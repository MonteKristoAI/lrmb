// track-cancel-sweep v2 (2026-06-11): full-pipeline reconciliation of
// cancelled-in-TRACK / open-locally drift. Emma 2026-06-11: "I see Work
// Orders that are cancelled in Track but not the platform."
//
// ROOT CAUSE: TRACK's listing endpoints exclude cancelled WOs from
// updatedSince walks, so track-poll never sees them. Only per-row GET
// reveals the cancellation. track-refresh-stale does this but only for
// >14d stale + >7d past scheduled — silent recent cancellations slip
// through.
//
// v2: state-table backed cursor. Without ?cursor=N in querystring, reads
// last cursor from `track_poll_state` (collection_name='cancel_sweep').
// Scheduled daily via pg_cron; each run processes a chunk, resumes next
// day. When done, cursor resets to 0.
//
// Manual override: pass ?cursor=N&limit=L to force a one-shot run.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;

const DEFAULT_LIMIT = 300;
const MAX_LIMIT = 500;
const MAX_RETRY = 3;
const LOCAL_TERMINAL = new Set(["processed", "verified", "completed", "cancelled"]);
const STATE_NAME = "cancel_sweep";

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

  const url = new URL(req.url);
  const cursorParam = url.searchParams.get("cursor");
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(url.searchParams.get("limit") ?? String(DEFAULT_LIMIT))));

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const auth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);
  const headers = { Authorization: auth, Accept: "application/json", "User-Agent": "MK/track-cancel-sweep/2.0" };
  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  // Resolve cursor: query param overrides state-table value.
  let cursor: number;
  let usingState = false;
  if (cursorParam !== null) {
    cursor = Math.max(0, parseInt(cursorParam));
  } else {
    usingState = true;
    const { data: state } = await supabase
      .from("track_poll_state")
      .select("last_seen_external_id")
      .eq("collection_name", STATE_NAME)
      .maybeSingle();
    cursor = Number(state?.last_seen_external_id ?? 0);
  }

  const { data: rows, error: qErr } = await supabase
    .from("tasks")
    .select("id, external_id, task_category, status")
    .eq("external_source", "track")
    .not("status", "in", "(cancelled,completed,verified,processed)")
    .order("created_at", { ascending: true })
    .range(cursor, cursor + limit - 1);
  if (qErr) return jr(500, { error: `query: ${qErr.message}` });

  if (!rows || rows.length === 0) {
    // End of catalog → reset cursor for next cycle.
    if (usingState) await upsertState(supabase, 0, { cycle_completed_at: new Date().toISOString() });
    return jr(200, { runId, message: "no rows at cursor — cycle complete, reset to 0", cursor, checked: 0, done: true });
  }

  const summary = {
    runId, cursor, limit,
    checked: 0, cancelled: 0, statusChanged: 0,
    errors: 0, notFound: 0, unchanged: 0, rateLimited: 0, terminalSkipped: 0,
    sample: [] as unknown[], failedSample: [] as unknown[],
    done: false,
    nextCursor: 0,
  };

  let rateLimitFired = false;

  for (const row of rows) {
    summary.checked++;
    if (rateLimitFired) { summary.rateLimited++; continue; }
    if (!row.external_id) continue;

    const path = row.task_category === "housekeeping" ? "housekeeping/work-orders" : "maintenance/work-orders";
    const apiUrl = `${BASE}/${path}/${row.external_id}`;
    try {
      const res = await fetchWithRetry(apiUrl, { headers });
      if (res.status === 429) {
        rateLimitFired = true;
        summary.rateLimited++;
        if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: "track_429" });
        continue;
      }
      if (res.status === 404) {
        if (LOCAL_TERMINAL.has(row.status)) { summary.terminalSkipped++; continue; }
        const { data: updated, error: cErr } = await supabase
          .from("tasks")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("id", row.id)
          .eq("status", row.status)
          .select("id");
        if (cErr) {
          summary.errors++;
          if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: `cancel_${cErr.code ?? "err"}` });
          continue;
        }
        if (!updated || updated.length === 0) { summary.terminalSkipped++; continue; }
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
        continue;
      }
      if (!newStatus || newStatus === row.status) { summary.unchanged++; continue; }

      const { data: changed, error: uErr } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", row.id)
        .eq("status", row.status)
        .select("id");
      if (uErr) {
        summary.errors++;
        if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: `update_${uErr.code ?? "err"}` });
        continue;
      }
      if (!changed || changed.length === 0) { summary.terminalSkipped++; continue; }
      if (newStatus === "cancelled") summary.cancelled++;
      summary.statusChanged++;
      if (summary.sample.length < 10) summary.sample.push({ external_id: row.external_id, from: row.status, to: newStatus });
    } catch (e) {
      summary.errors++;
      if (summary.failedSample.length < 10) summary.failedSample.push({ external_id: row.external_id, reason: e instanceof Error ? e.message.slice(0, 80) : "exception" });
    }
    if (summary.checked % 25 === 0) await new Promise((r) => setTimeout(r, 150));
  }

  summary.done = rows.length < limit;
  summary.nextCursor = summary.done ? 0 : cursor + rows.length;

  // Persist cursor for next scheduled run.
  if (usingState) {
    await upsertState(supabase, summary.nextCursor, {
      last_summary: { runId, cursor, checked: summary.checked, cancelled: summary.cancelled, statusChanged: summary.statusChanged, errors: summary.errors, done: summary.done },
    });
  }

  await supabase.from("audit_logs").insert({
    action: "track_cancel_sweep_run",
    entity_type: "edge_function",
    entity_id: runId,
    description: `track-cancel-sweep v2: cursor=${cursor}→${summary.nextCursor} checked=${summary.checked} cancelled=${summary.cancelled} statusChanged=${summary.statusChanged} errors=${summary.errors}`,
    payload_json: { ...summary, severity: rateLimitFired || summary.errors > 50 ? "warning" : "info", elapsedMs: Date.now() - startedAt },
  });

  return jr(200, { ...summary, elapsedMs: Date.now() - startedAt });
});

async function upsertState(supabase: ReturnType<typeof createClient>, cursor: number, extras: Record<string, unknown>) {
  await supabase
    .from("track_poll_state")
    .upsert({
      collection_name: STATE_NAME,
      last_seen_external_id: cursor,
      last_run_at: new Date().toISOString(),
      last_run_outcome: JSON.stringify(extras).slice(0, 500),
    }, { onConflict: "collection_name" });
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
