// One-shot catchup: iterate stale LRMB rows + fetch each one's current TRACK
// status individually + update local row accordingly.
//
// v2 (2026-06-09): level-10 audit fixes:
//   - bump updated_at on ALL processed rows (unchanged paths too) so they
//     leave the stale window. Previous behavior re-fetched the same rows
//     forever; cap never moved forward.
//   - fetchWithRetry with backoff for 5xx; surface 429 + abort run instead of
//     pounding TRACK.
//   - terminal-state guard before clobbering: never demote local
//     'processed'/'verified'/'completed'/'cancelled' to a different state
//     just because TRACK returned 404 or a different status.
//   - capture failedSample in audit payload for triage.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;

const STALE_DAYS = 14;
const SCHEDULED_DAYS = 7;
const ROW_CAP = 250;
const MAX_RETRY = 3;
const LOCAL_TERMINAL = new Set(["processed", "verified", "completed", "cancelled"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!TRACK_KEY || !TRACK_SECRET) return jr(500, { error: "Missing TRACK creds" });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return jr(500, { error: "Missing Supabase env" });

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const auth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);
  const headers = { Authorization: auth, Accept: "application/json", "User-Agent": "MK/track-refresh-stale/2.0" };
  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  const { data: stale, error: qErr } = await supabase
    .from("tasks")
    .select("id, external_id, task_category, status")
    .eq("external_source", "track")
    .not("status", "in", "(cancelled,completed,verified,processed)")
    .lt("updated_at", new Date(Date.now() - STALE_DAYS * 86400 * 1000).toISOString())
    .lt("scheduled_for", new Date(Date.now() - SCHEDULED_DAYS * 86400 * 1000).toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(ROW_CAP);
  if (qErr) return jr(500, { error: `query: ${qErr.message}` });
  if (!stale || stale.length === 0) {
    return jr(200, { runId, message: "no stale rows", checked: 0 });
  }

  const summary = {
    runId, checked: 0, cancelled: 0, statusChanged: 0, bumped: 0,
    errors: 0, notFound: 0, unchanged: 0, rateLimited: 0, terminalSkipped: 0,
    sample: [] as unknown[], failedSample: [] as unknown[],
  };

  let rateLimitFired = false;

  for (const row of stale) {
    summary.checked++;
    if (rateLimitFired) { summary.rateLimited++; continue; }

    const path = row.task_category === "housekeeping" ? "housekeeping/work-orders" : "maintenance/work-orders";
    const url = `${BASE}/${path}/${row.external_id}`;
    try {
      const res = await fetchWithRetry(url, { headers });
      if (res.status === 429) {
        rateLimitFired = true;
        summary.rateLimited++;
        if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: "track_429" });
        continue;
      }
      if (res.status === 404) {
        // v2 P0-5: terminal-state guard
        if (LOCAL_TERMINAL.has(row.status)) {
          summary.terminalSkipped++;
          await bumpUpdatedAt(supabase, row.id);
          summary.bumped++;
          continue;
        }
        await supabase.from("tasks").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", row.id);
        summary.cancelled++;
        summary.notFound++;
        if (summary.sample.length < 10) summary.sample.push({ external_id: row.external_id, from: row.status, to: "cancelled", reason: "track_404" });
        continue;
      }
      if (!res.ok) {
        summary.errors++;
        if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: `track_http_${res.status}` });
        continue;
      }
      const wo = await res.json();
      const trackStatus = String(wo.status ?? "").toLowerCase();
      const newStatus = mapStatusForUpdate(trackStatus);

      if (newStatus && newStatus !== row.status && LOCAL_TERMINAL.has(row.status)) {
        summary.terminalSkipped++;
        await bumpUpdatedAt(supabase, row.id);
        summary.bumped++;
        continue;
      }

      if (!newStatus || newStatus === row.status) {
        // v2 P0-3: bump updated_at so unchanged rows leave the stale window.
        await bumpUpdatedAt(supabase, row.id);
        summary.bumped++;
        summary.unchanged++;
        continue;
      }
      const { error: uErr } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (uErr) {
        summary.errors++;
        if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: `update_${uErr.code ?? "err"}: ${uErr.message?.slice(0, 80)}` });
        continue;
      }
      if (newStatus === "cancelled") summary.cancelled++;
      summary.statusChanged++;
      if (summary.sample.length < 10) summary.sample.push({ external_id: row.external_id, from: row.status, to: newStatus });
    } catch (e) {
      summary.errors++;
      if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: e instanceof Error ? e.message.slice(0, 80) : "exception" });
    }
    if (summary.checked % 25 === 0) await new Promise((r) => setTimeout(r, 200));
  }

  await supabase.from("audit_logs").insert({
    action: "track_refresh_stale_run",
    entity_type: "edge_function",
    entity_id: runId,
    description: `track-refresh-stale v2: checked=${summary.checked} cancelled=${summary.cancelled} statusChanged=${summary.statusChanged} bumped=${summary.bumped} errors=${summary.errors} rateLimited=${summary.rateLimited} terminalSkipped=${summary.terminalSkipped}`,
    payload_json: { ...summary, severity: rateLimitFired || summary.errors > 25 ? "warning" : "info", elapsedMs: Date.now() - startedAt },
  });

  return jr(200, { ...summary, elapsedMs: Date.now() - startedAt });
});

async function bumpUpdatedAt(supabase: ReturnType<typeof createClient>, id: string): Promise<void> {
  try {
    await supabase.from("tasks").update({ updated_at: new Date().toISOString() }).eq("id", id);
  } catch (_) {
    // Swallow — bump failure isn't fatal. Next run will retry.
  }
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429) return res;
      if (res.status >= 500) { await sleep(2 ** attempt * 500); continue; }
      return res;
    } catch (err) { lastErr = err; await sleep(2 ** attempt * 500); }
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed after retries");
}

function sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

function mapStatusForUpdate(t: string): string | null {
  if (!t) return null;
  if (/(cancel|void|archive|reject)/i.test(t)) return "cancelled";
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  return null;
}

function jr(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body, null, 2), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
