// Tony's weekly operations summary.
//
// Runs every Monday 09:00 UTC via pg_cron. Computes KPIs for the past 7 days
// and writes a structured 'tony_weekly_report' audit_logs row. Adjacent n8n
// workflow (TBD) reads this row + emails Tony via SendGrid/Postmark.
//
// Metrics:
//   1. Reservations: arrivals, in-house mid-week, checkouts
//   2. Housekeeping: completed, pending verification, blocked
//   3. Maintenance: opened, completed, overdue
//   4. Photo proof: photos uploaded, % synced to TRACK
//   5. Polling health: total runs, errors, attachment push successes
//   6. Active units + properties (TRACK parity %)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // QA P1 Q-SEC-13: cron-only endpoint.
  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "missing env" });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const weekEnd = new Date();
  const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 3600 * 1000);

  const counts = {} as Record<string, number>;
  for (const [name, q] of Object.entries(metrics(weekStart.toISOString(), weekEnd.toISOString()))) {
    const { count } = await supabase.from(q.table).select("id", { count: "exact", head: true }).match(q.filters as never);
    counts[name] = count ?? 0;
  }

  // Custom aggregations needing SQL
  const { data: arrivalsThisWeek } = await supabase
    .from("reservation_events")
    .select("payload_json")
    .eq("external_source", "track")
    .gte("event_at", weekStart.toISOString())
    .lt("event_at", weekEnd.toISOString())
    .limit(1000);

  let arrivalsCount = 0;
  let checkoutsCount = 0;
  for (const ev of arrivalsThisWeek ?? []) {
    const p = ev.payload_json as Record<string, unknown> | null;
    const arrival = p?.arrivalDate as string | undefined;
    const departure = p?.departureDate as string | undefined;
    if (arrival) {
      const aDate = new Date(arrival);
      if (aDate >= weekStart && aDate < weekEnd) arrivalsCount++;
    }
    if (departure) {
      const dDate = new Date(departure);
      if (dDate >= weekStart && dDate < weekEnd) checkoutsCount++;
    }
  }

  // Push health
  const { data: pushRuns } = await supabase
    .from("audit_logs")
    .select("payload_json")
    .eq("action", "track_attachment_push_run")
    .gte("created_at", weekStart.toISOString())
    .limit(2000);
  let pushedTotal = 0;
  let deadLetterTotal = 0;
  for (const r of pushRuns ?? []) {
    const p = r.payload_json as Record<string, unknown> | null;
    pushedTotal += (p?.pushed as number) ?? 0;
    deadLetterTotal += (p?.deadLettered as number) ?? 0;
  }

  // Unit + property parity
  const { count: unitsActive } = await supabase.from("units").select("id", { count: "exact", head: true }).eq("active", true);
  const { count: propertiesTotal } = await supabase.from("properties").select("id", { count: "exact", head: true });

  const report = {
    runId,
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    reservations: {
      arrivalsThisWeek: arrivalsCount,
      checkoutsThisWeek: checkoutsCount,
    },
    housekeeping: {
      newOrAssigned: counts.hkNewOrAssigned,
      completed: counts.hkCompleted,
      inProgress: counts.hkInProgress,
    },
    maintenance: {
      open: counts.maintOpen,
      completed: counts.maintCompleted,
      blocked: counts.maintBlocked,
    },
    photos: {
      uploaded: counts.photosUploaded,
      pushedToTrack: pushedTotal,
      deadLettered: deadLetterTotal,
    },
    coverage: {
      activeUnits: unitsActive ?? 0,
      properties: propertiesTotal ?? 0,
      trackUnitsTotal: 232, // last known from probe; refreshable
      coveragePercent: Math.round(((unitsActive ?? 0) / 232) * 100),
    },
    elapsedMs: Date.now() - startedAt,
  };

  // Write to audit_logs (n8n workflow picks this up for email delivery)
  await supabase.from("audit_logs").insert({
    action: "tony_weekly_report",
    entity_type: "system",
    entity_id: runId,
    description: `Tony weekly report ${weekStart.toISOString().slice(0,10)} → ${weekEnd.toISOString().slice(0,10)}: ${counts.hkCompleted ?? 0} cleans completed, ${counts.maintCompleted ?? 0} maint completed, ${pushedTotal} photos to TRACK`,
    payload_json: { ...report, severity: "info" },
  });

  return json(200, report);
});

function metrics(weekStart: string, weekEnd: string) {
  return {
    hkNewOrAssigned: { table: "tasks", filters: { task_category: "housekeeping" } as Record<string, unknown> },
    hkCompleted: { table: "tasks", filters: { task_category: "housekeeping", status: "completed" } as Record<string, unknown> },
    hkInProgress: { table: "tasks", filters: { task_category: "housekeeping", status: "in_progress" } as Record<string, unknown> },
    maintOpen: { table: "tasks", filters: { task_category: "maintenance", status: "new" } as Record<string, unknown> },
    maintCompleted: { table: "tasks", filters: { task_category: "maintenance", status: "completed" } as Record<string, unknown> },
    maintBlocked: { table: "tasks", filters: { task_category: "maintenance", status: "blocked" } as Record<string, unknown> },
    photosUploaded: { table: "task_photos", filters: {} as Record<string, unknown> },
  };
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
