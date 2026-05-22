// One-off catch-up: walks TRACK WO history for a specific set of unit IDs.
// Used after bulk-importing new units to AiiA when those units already had
// historical work orders in TRACK that the regular polling worker passed by
// (its watermark sits at "latest" so it doesn't re-walk back through history).
//
// Calls: GET /api/pms/{collection}/work-orders?unitId={id}&page=N&limit=50
//        for each unit_id × collection in payload.
// Upserts to public.tasks via the same row-handler logic as track-poll.
//
// Trigger: manual POST with a JSON body { unit_ids: [int], collections: ["maintenance","housekeeping"] }
// Idempotent (ON CONFLICT external_source+external_id DO UPDATE).
//
// Environment: TRACK_API_KEY, TRACK_API_SECRET, TRACK_TENANT, SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY (auto-injected).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;
const PAGE_SIZE = 50;
const MAX_PAGES_PER_UNIT = 50; // safety cap (2500 records / unit / collection)

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  let body: { unit_ids?: number[]; collections?: string[] };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const unitIds = (body.unit_ids ?? []).filter((n) => Number.isFinite(n));
  const collections = (body.collections ?? ["maintenance", "housekeeping"]).filter((c) =>
    ["maintenance", "housekeeping"].includes(c),
  );
  if (unitIds.length === 0) {
    return json(400, { runId, error: "unit_ids must be non-empty array of integers" });
  }

  if (!TRACK_KEY || !TRACK_SECRET) {
    return json(500, { runId, error: "Missing TRACK_API_KEY/SECRET" });
  }
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { runId, error: "Missing Supabase env" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const auth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);

  const summary = {
    runId,
    unit_ids: unitIds,
    collections,
    perUnit: {} as Record<string, { fetched: number; processed: number; errors: number }>,
    totalProcessed: 0,
    totalErrors: 0,
  };

  for (const unitId of unitIds) {
    // Resolve our local unit + property to avoid round-trip per row
    const { data: localUnit } = await supabase
      .from("units")
      .select("id, property_id")
      .eq("track_id", unitId)
      .maybeSingle();
    if (!localUnit) {
      summary.perUnit[`${unitId}`] = { fetched: 0, processed: 0, errors: 1 };
      summary.totalErrors++;
      continue;
    }

    for (const category of collections) {
      const key = `${unitId}:${category}`;
      summary.perUnit[key] = { fetched: 0, processed: 0, errors: 0 };
      let page = 1;
      while (page <= MAX_PAGES_PER_UNIT) {
        const url = new URL(`${BASE}/${category}/work-orders`);
        url.searchParams.set("unitId", String(unitId));
        url.searchParams.set("limit", String(PAGE_SIZE));
        url.searchParams.set("page", String(page));
        url.searchParams.set("sortColumn", "id");
        url.searchParams.set("sortDirection", "asc");
        const res = await fetch(url.toString(), {
          headers: { Authorization: auth, Accept: "application/json", "User-Agent": "MK-LRMB-Catchup/1.0" },
        });
        if (!res.ok) {
          summary.perUnit[key].errors++;
          summary.totalErrors++;
          break;
        }
        const j = await res.json();
        const rows = (j._embedded?.workOrders ?? []) as Array<Record<string, unknown>>;
        if (rows.length === 0) break;
        summary.perUnit[key].fetched += rows.length;

        for (const row of rows) {
          try {
            await upsertTask(supabase, row, category, localUnit.id as string, localUnit.property_id as string);
            summary.perUnit[key].processed++;
            summary.totalProcessed++;
          } catch (err) {
            summary.perUnit[key].errors++;
            summary.totalErrors++;
          }
        }
        if (!j._links?.next?.href) break;
        page++;
      }
    }
  }

  const elapsedMs = Date.now() - startedAt;
  await supabase.from("audit_logs").insert({
    action: "track_catchup_units_run",
    entity_type: "system",
    entity_id: runId,
    description: `track-catchup: ${summary.totalProcessed} processed, ${summary.totalErrors} errors across ${unitIds.length} units`,
    payload_json: { ...summary, elapsedMs, severity: summary.totalErrors > 0 ? "warning" : "info" },
  });

  return json(200, { ...summary, elapsedMs });
});

async function upsertTask(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  category: string,
  localUnitId: string,
  propertyId: string,
): Promise<void> {
  const externalId = String(row.id);
  const reservationId = row.reservationId ?? row.nextReservationId ?? null;
  const trackStatus = String(row.status ?? "").toLowerCase();
  const aiiaStatus = mapTrackStatus(trackStatus);

  const task = {
    external_source: "track",
    external_id: externalId,
    source_type: "travelnet",
    reservation_id: reservationId ? String(reservationId) : null,
    task_category: category,
    task_type: category === "housekeeping" ? "checkout_turnover" : "maintenance",
    housekeeping_type: category === "housekeeping" ? deriveHkType(row) : null,
    title: derivedTitle(row, category),
    description: (row.description as string | undefined) ?? (row.comments as string | undefined) ?? null,
    priority: derivePriority(row),
    unit_id: localUnitId,
    property_id: propertyId,
    requires_photo: true,
    requires_note: true,
    requires_timestamp: true,
    status: aiiaStatus,
    started_at: (row.dateStarted as string | undefined) ?? (row.scheduledAt as string | undefined) ?? null,
    completed_at: (row.dateCompleted as string | undefined) ?? (row.completedAt as string | undefined) ?? null,
    processed_at: (row.dateProcessed as string | undefined) ?? (row.processedAt as string | undefined) ?? null,
    scheduled_for: (row.scheduledAt as string | undefined) ?? (row.dateScheduled as string | undefined) ?? null,
    updated_at: (row.updatedAt as string | undefined) ?? new Date().toISOString(),
  };

  const { error } = await supabase
    .from("tasks")
    .upsert(task, { onConflict: "external_source,external_id", ignoreDuplicates: false });
  if (error) throw new Error(error.message);
}

function mapTrackStatus(s: string): string {
  if (!s) return "new";
  if (
    s.includes("complete") || s.includes("processed") || s.includes("verify") ||
    s.includes("verified") || s.includes("done") || s.includes("closed")
  ) return "completed";
  if (s.includes("inprogress") || s.includes("in_progress") || s.includes("started")) return "in_progress";
  if (s.includes("assign")) return "assigned";
  if (s.includes("hold") || s.includes("block")) return "blocked";
  if (s.includes("wait")) return "waiting_parts";
  return "new";
}

function deriveHkType(row: Record<string, unknown>): string {
  const raw = String(row.cleanType ?? "").toLowerCase();
  if (row.isInspection) return "checkout_clean";
  if (raw.includes("deep")) return "deep_clean";
  if (raw.includes("linen")) return "linen_change";
  if (raw.includes("mid")) return "mid_stay_clean";
  if (raw.includes("owner")) return "owner_specific_clean";
  if (raw.includes("intermittent")) return "intermittent_clean";
  return "checkout_clean";
}

function derivePriority(row: Record<string, unknown>): string {
  const raw = String(row.priority ?? "").toLowerCase();
  if (raw.includes("urgent") || raw.includes("high")) return "high";
  if (raw.includes("low")) return "low";
  return "medium";
}

function derivedTitle(row: Record<string, unknown>, category: string): string {
  if (category === "maintenance") {
    return (row.summary as string | undefined) ?? (row.description as string | undefined) ??
      `TRACK maintenance WO #${row.id}`;
  }
  const cleanType = row.cleanType ? String(row.cleanType) : "Clean";
  return `${cleanType} – TRACK WO #${row.id}`;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
