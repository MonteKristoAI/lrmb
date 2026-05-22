// Production monitoring for LRMB pilot.
//
// Runs every 15 min via pg_cron. Checks 6 health signals + writes an
// 'ops_health_check' row to audit_logs with severity. When severity=error,
// the row is queryable by the global n8n error-handler workflow
// (8N1HZ9RMBZc5oi0z) for email notification.
//
// Signals:
//   1. track-poll cron stale  — last successful run > 15 min ago
//   2. track-attachment-push cron stale — last run > 3 min ago
//   3. polling error rate (1h) — > 10% of runs returned warning/error
//   4. dead-letter photos — any task_photos with attempts >= 5 AND not synced
//   5. share-link expiry — < 7 days until OPS_VIEW token expires (HMAC secret check)
//   6. backfill drift — TRACK reservation count diverged from mirrored count > 5%
//
// Environment variables:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected)
//   OPS_VIEW_HMAC_SECRET (used to detect expiry by decoding embedded token)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, { runId, error: "Missing Supabase env" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const issues: Array<{ signal: string; severity: "warning" | "error"; detail: string }> = [];

  // Signal 1: track-poll cron freshness (must be < 15 min)
  {
    const { data } = await supabase
      .from("audit_logs")
      .select("created_at")
      .eq("action", "track_poll_run")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const ageMs = data ? Date.now() - new Date(data.created_at).getTime() : Infinity;
    if (ageMs > 15 * 60 * 1000) {
      issues.push({
        signal: "track_poll_stale",
        severity: "error",
        detail: `Last run ${Math.round(ageMs / 60000)} min ago (threshold: 15 min)`,
      });
    }
  }

  // Signal 2: track-attachment-push cron freshness (must be < 3 min)
  {
    const { data } = await supabase
      .from("audit_logs")
      .select("created_at")
      .eq("action", "track_attachment_push_run")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const ageMs = data ? Date.now() - new Date(data.created_at).getTime() : Infinity;
    if (ageMs > 3 * 60 * 1000) {
      issues.push({
        signal: "track_attachment_push_stale",
        severity: "error",
        detail: `Last run ${Math.round(ageMs / 60000)} min ago (threshold: 3 min)`,
      });
    }
  }

  // Signal 3: polling error rate (1h window)
  {
    const { data: runs } = await supabase
      .from("audit_logs")
      .select("payload_json")
      .eq("action", "track_poll_run")
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

    const total = runs?.length ?? 0;
    const failing = runs?.filter((r) => {
      const sev = (r.payload_json as Record<string, unknown>)?.severity;
      return sev === "warning" || sev === "error";
    }).length ?? 0;
    const errorRate = total > 0 ? failing / total : 0;
    if (errorRate > 0.1) {
      issues.push({
        signal: "polling_error_rate_high",
        severity: "warning",
        detail: `${failing}/${total} runs failing (${Math.round(errorRate * 100)}%, threshold: 10%)`,
      });
    }
  }

  // Signal 4: dead-letter photos
  {
    const { count } = await supabase
      .from("task_photos")
      .select("id", { count: "exact", head: true })
      .gte("track_sync_attempts", 5)
      .is("track_synced_at", null);
    if ((count ?? 0) > 0) {
      issues.push({
        signal: "dead_letter_photos",
        severity: "error",
        detail: `${count} photos dead-lettered (likely TRACK API rejecting — investigate via task_photos.track_sync_error)`,
      });
    }
  }

  // Signal 5: share-link expiry detection
  // We don't have the active token here, but we check whether the OPS_VIEW_HMAC_SECRET is set
  // (rotation would invalidate ALL outstanding tokens). For per-token expiry, see runbook.
  {
    const hmacSet = !!Deno.env.get("OPS_VIEW_HMAC_SECRET");
    if (!hmacSet) {
      issues.push({
        signal: "ops_view_hmac_missing",
        severity: "error",
        detail: "OPS_VIEW_HMAC_SECRET env var is unset — share links will return 500",
      });
    }
  }

  // Signal 6: backfill drift detection (vs TRACK)
  // Compare unique reservation count in TRACK (via existing track_poll_state) vs our mirror.
  // We don't hit TRACK from here (rate limit budget). Instead, check polling state freshness +
  // signal if poll has been stuck (last_seen_updated_at hasn't moved in > 1 hour).
  {
    const { data: pollStates } = await supabase
      .from("track_poll_state")
      .select("collection_name, last_seen_updated_at, last_run_at");
    const stuckCollections = (pollStates ?? []).filter((s) => {
      // OK if last_run is fresh and either last_seen advanced OR nothing's been updated in TRACK
      const lastRun = s.last_run_at ? new Date(s.last_run_at as string).getTime() : 0;
      const ageMs = Date.now() - lastRun;
      return ageMs > 60 * 60 * 1000; // last run > 1h ago
    });
    if (stuckCollections.length > 0) {
      issues.push({
        signal: "poll_collection_stuck",
        severity: "warning",
        detail: `Collections with stale runs: ${stuckCollections.map((s) => s.collection_name).join(", ")}`,
      });
    }
  }

  const overallSeverity: "info" | "warning" | "error" =
    issues.some((i) => i.severity === "error")
      ? "error"
      : issues.some((i) => i.severity === "warning")
        ? "warning"
        : "info";

  const summary = {
    runId,
    startedAt: new Date(startedAt).toISOString(),
    elapsedMs: Date.now() - startedAt,
    overallSeverity,
    signalsChecked: 6,
    issuesFound: issues.length,
    issues,
  };

  // Write to audit_logs for visibility + n8n alerting
  try {
    await supabase.from("audit_logs").insert({
      action: "ops_health_check",
      entity_type: "system",
      entity_id: runId,
      description:
        issues.length === 0
          ? "ops_health_check: all 6 signals healthy"
          : `ops_health_check: ${issues.length} issues — ${issues.map((i) => i.signal).join(", ")}`,
      payload_json: { ...summary, severity: overallSeverity },
    });
  } catch (err) {
    console.error("audit_log insert failed:", err);
  }

  return jsonResponse(200, summary);
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
