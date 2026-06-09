// One-shot catchup: iterate stale LRMB rows (status not terminal AND
// updated_at very old AND scheduled_for past), fetch each one's current
// TRACK status individually via /housekeeping/work-orders/{id} or
// /maintenance/work-orders/{id}, and update local status accordingly.
//
// Track-poll's backward walk only re-visits WOs at or above the watermark.
// Old WOs (Feb-March 2026 IDs ~25K-30K, watermark now ~32800) never get
// re-fetched, so cancellations / status changes there never reach AiiA.
// Emma flagged 2026-06-09: "I see WOs cancelled in Track but not the platform".
//
// Triggered manually via service-role JWT.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;

const STALE_DAYS = 14;       // updated_at older than this
const SCHEDULED_DAYS = 7;    // scheduled_for older than this
const ROW_CAP = 250;         // per-invocation cap to stay within timeout

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
  const headers = { Authorization: auth, Accept: "application/json", "User-Agent": "MK/track-refresh-stale/1.0" };
  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  // 1. Query stale rows
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

  const summary = { runId, checked: 0, cancelled: 0, statusChanged: 0, errors: 0, notFound: 0, unchanged: 0, sample: [] as unknown[] };

  for (const row of stale) {
    summary.checked++;
    const path = row.task_category === "housekeeping" ? "housekeeping/work-orders" : "maintenance/work-orders";
    const url = `${BASE}/${path}/${row.external_id}`;
    try {
      const res = await fetch(url, { headers });
      if (res.status === 404) {
        // WO truly gone from TRACK → mark cancelled locally
        await supabase.from("tasks").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", row.id);
        summary.cancelled++;
        summary.notFound++;
        continue;
      }
      if (!res.ok) {
        summary.errors++;
        continue;
      }
      const wo = await res.json();
      const trackStatus = String(wo.status ?? "").toLowerCase();
      const newStatus = mapStatusForUpdate(trackStatus);
      if (!newStatus) {
        summary.unchanged++;
        continue;
      }
      if (newStatus !== row.status) {
        const { error: uErr } = await supabase.from("tasks").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", row.id);
        if (uErr) { summary.errors++; continue; }
        if (newStatus === "cancelled") summary.cancelled++;
        summary.statusChanged++;
        if (summary.sample.length < 10) summary.sample.push({ external_id: row.external_id, from: row.status, to: newStatus });
      } else {
        summary.unchanged++;
      }
    } catch (e) {
      summary.errors++;
    }
    // Mild pacing — don't hammer TRACK
    if (summary.checked % 25 === 0) await new Promise((r) => setTimeout(r, 200));
  }

  // Log heartbeat
  await supabase.from("audit_logs").insert({
    action: "track_refresh_stale_run",
    entity_type: "edge_function",
    entity_id: runId,
    description: `track-refresh-stale: checked=${summary.checked} cancelled=${summary.cancelled} statusChanged=${summary.statusChanged} errors=${summary.errors}`,
    payload_json: { ...summary, severity: summary.errors > 0 ? "warning" : "info", elapsedMs: Date.now() - startedAt },
  });

  return jr(200, { ...summary, elapsedMs: Date.now() - startedAt });
});

// Returns the AiiA status to set, OR null if no change needed.
// Cancelled / voided / archived / rejected → 'cancelled' (terminal for our queues).
function mapStatusForUpdate(t: string): string | null {
  if (!t) return null;
  if (/(cancel|void|archive|reject)/i.test(t)) return "cancelled";
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  // Don't downgrade 'new' → 'new' or other non-terminal moves; track-poll catches forward motion.
  return null;
}

function jr(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body, null, 2), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
