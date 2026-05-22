// Polls TRACK PMS every 5 min and reconciles state into AiiA.
//
// Reads:    reservations, maintenance work orders, housekeeping work orders
// Writes:   reservation_events (audit trail), tasks (new + status sync), audit_logs (errors)
// Mode:     passive observer (no TRACK writes). Switch to active orchestrator after
//           Emma confirms Q3 write scope and LRMB picks active vs passive.
//
// Idempotency: per-collection state in track_poll_state. UNIQUE
// (external_source='track', external_id) on reservation_events + tasks.
//
// Triggered by pg_cron every 5 min via the SQL migration that pairs with this fn.
// Manual invocation:
//   curl -X POST 'https://{ref}.functions.supabase.co/track-poll' \
//        -H 'Authorization: Bearer {SERVICE_ROLE_KEY}'
//
// Environment variables required (set via supabase secrets):
//   TRACK_API_KEY, TRACK_API_SECRET, TRACK_TENANT (default: lrmb)
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;

const COLLECTIONS = [
  {
    name: "reservations",
    path: "/reservations",
    embeddedKey: "reservations",
    onRow: handleReservationRow,
  },
  {
    name: "maintenance-work-orders",
    path: "/maintenance/work-orders",
    embeddedKey: "workOrders",
    onRow: handleMaintenanceWorkOrderRow,
  },
  {
    name: "housekeeping-work-orders",
    path: "/housekeeping/work-orders",
    embeddedKey: "workOrders",
    onRow: handleHousekeepingWorkOrderRow,
  },
];

const MAX_RETRY = 3;
const PAGE_SIZE = 50;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // QA P1 Q-SEC-10: cron-only endpoint. Require x-cron-secret header.
  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  const startedAt = Date.now();
  const runId = crypto.randomUUID();

  if (!TRACK_KEY || !TRACK_SECRET) {
    return jsonResponse(500, {
      runId,
      error: "Missing TRACK_API_KEY or TRACK_API_SECRET in function secrets",
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, {
      runId,
      error: "Missing Supabase env vars",
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const auth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);

  const summary: Record<string, unknown> = {
    runId,
    startedAt: new Date(startedAt).toISOString(),
    collections: {} as Record<string, { fetched: number; processed: number; errors: number; nextSinceTs: string | null }>,
  };

  try {
    for (const c of COLLECTIONS) {
      try {
        summary.collections[c.name] = await pollCollection(supabase, auth, c);
      } catch (collErr) {
        summary.collections[c.name] = {
          fetched: 0,
          processed: 0,
          errors: 1,
          nextSinceTs: null,
          fatal: collErr instanceof Error ? collErr.message : String(collErr),
        };
        await logError(supabase, c.name, "Collection-level fatal error", {
          error: collErr instanceof Error ? collErr.message : String(collErr),
          stack: collErr instanceof Error ? collErr.stack : undefined,
        });
      }
    }
  } catch (outerErr) {
    summary.fatal = outerErr instanceof Error ? outerErr.message : String(outerErr);
  }

  const elapsedMs = Date.now() - startedAt;
  summary.elapsedMs = elapsedMs;
  summary.completedAt = new Date().toISOString();

  // Heartbeat (best-effort; if this fails we still return the summary).
  // audit_logs schema: entity_type/entity_id (uuid)/action/payload_json/description/actor_id
  try {
    await supabase.from("audit_logs").insert({
      action: "track_poll_run",
      entity_type: "edge_function",
      entity_id: runId,
      description: anyErrors(summary)
        ? `track-poll run with errors: ${summarizeErrors(summary)}`
        : `track-poll run ok in ${summary.elapsedMs as number}ms`,
      payload_json: { ...summary, severity: anyErrors(summary) ? "warning" : "info" },
    });
  } catch (_heartbeatErr) {
    // swallow - returning the summary is more useful than failing the response
  }

  return jsonResponse(200, summary);
});

function summarizeErrors(summary: Record<string, unknown>): string {
  const c = summary.collections as Record<string, { errors: number }>;
  return Object.entries(c)
    .filter(([_, s]) => s.errors > 0)
    .map(([name, s]) => `${name}=${s.errors}`)
    .join(", ");
}

interface CollectionDef {
  name: string;
  path: string;
  embeddedKey: string;
  onRow: (supabase: ReturnType<typeof createClient>, row: Record<string, unknown>) => Promise<void>;
}

async function pollCollection(
  supabase: ReturnType<typeof createClient>,
  auth: string,
  c: CollectionDef,
): Promise<{ fetched: number; processed: number; errors: number; nextSinceTs: string | null }> {
  const state = await getPollState(supabase, c.name);
  const sinceTs = state?.last_seen_updated_at ?? null;

  let fetched = 0;
  let processed = 0;
  let errors = 0;
  let newestSeenTs = sinceTs;

  // Pull most-recently-updated first, walk back until we hit sinceTs or end of data.
  // TRACK PMS supports sortColumn=updatedAt + sortDirection=desc. updatedSince filter
  // is attempted but not guaranteed to be supported by every tenant; we client-side
  // filter as a safety net.
  let page = 1;
  let keepPaging = true;
  while (keepPaging) {
    const url = new URL(`${BASE}${c.path}`);
    url.searchParams.set("sortColumn", "updatedAt");
    url.searchParams.set("sortDirection", "desc");
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));
    if (sinceTs) url.searchParams.set("updatedSince", sinceTs);

    const res = await fetchWithRetry(url.toString(), {
      headers: {
        Authorization: auth,
        Accept: "application/json",
        "User-Agent": "MonteKristo-AI/LRMB-track-poll/1.0",
      },
    });

    if (!res.ok) {
      await logError(supabase, c.name, `HTTP ${res.status} fetching ${url.pathname}`, { page });
      errors++;
      break;
    }

    const json = await res.json();
    const embedded = json?._embedded ?? {};
    const rows: Array<Record<string, unknown>> =
      (embedded[c.embeddedKey] as Array<Record<string, unknown>>) ??
      (Array.isArray(embedded[Object.keys(embedded)[0] ?? ""])
        ? (embedded[Object.keys(embedded)[0] ?? ""] as Array<Record<string, unknown>>)
        : []);

    fetched += rows.length;
    if (rows.length === 0) break;

    for (const row of rows) {
      const updatedAt = (row.updatedAt as string | undefined) ?? null;

      // Client-side stop: if TRACK ignored updatedSince, walk back until we cross the boundary.
      if (sinceTs && updatedAt && updatedAt <= sinceTs) {
        keepPaging = false;
        continue;
      }

      try {
        await c.onRow(supabase, row);
        processed++;
        if (!newestSeenTs || (updatedAt && updatedAt > newestSeenTs)) {
          newestSeenTs = updatedAt;
        }
      } catch (err) {
        errors++;
        await logError(
          supabase,
          c.name,
          err instanceof Error ? err.message : String(err),
          { externalId: row.id, page },
        );
      }
    }

    const hasNext = json?._links?.next?.href !== undefined;
    if (!hasNext) keepPaging = false;
    page++;
    if (page > 50) {
      // Safety guard: do not poll forever
      await logError(supabase, c.name, "Page cap (50) reached, stopping", { page });
      break;
    }
  }

  // Update poll state
  await supabase
    .from("track_poll_state")
    .upsert({
      collection_name: c.name,
      last_seen_updated_at: newestSeenTs,
      last_run_at: new Date().toISOString(),
      last_run_outcome: errors === 0 ? "ok" : "partial",
      records_processed: processed,
      records_errored: errors,
    }, { onConflict: "collection_name" });

  return { fetched, processed, errors, nextSinceTs: newestSeenTs };
}

async function getPollState(
  supabase: ReturnType<typeof createClient>,
  collection: string,
): Promise<{ last_seen_updated_at: string | null } | null> {
  const { data, error } = await supabase
    .from("track_poll_state")
    .select("last_seen_updated_at")
    .eq("collection_name", collection)
    .maybeSingle();
  if (error) return null;
  return data;
}

async function logError(
  supabase: ReturnType<typeof createClient>,
  collection: string,
  message: string,
  context: Record<string, unknown>,
  severity: "error" | "warning" | "info" = "error",
) {
  // v8: severity parameter so unit-not-mapped (expected for TRACK-only/archived
  // units) can be demoted to severity=info under action='track_poll_info'.
  // Keeps poll-health metric clean (only true errors hit records_errored).
  await supabase.from("audit_logs").insert({
    action: severity === "info" ? "track_poll_info" : "track_poll_error",
    entity_type: "edge_function",
    entity_id: crypto.randomUUID(),
    description: `track-poll ${collection}: ${message}`,
    payload_json: { collection, message, severity, ...context },
  });
}

function anyErrors(summary: Record<string, unknown>): boolean {
  const c = summary.collections as Record<string, { errors: number }>;
  return Object.values(c).some((s) => s.errors > 0);
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status >= 500 || res.status === 429) {
        // Retryable
        await sleep(2 ** attempt * 500);
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(2 ** attempt * 500);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ------------- Row handlers -------------

async function handleReservationRow(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
): Promise<void> {
  const externalId = String(row.id);

  // Mirror to reservation_events as a sync event ONLY. We intentionally do NOT
  // insert a 'checkout' event_type because the existing trigger
  // `trg_reservation_event_to_housekeeping` would fire `create_housekeeping_task_from_reservation_event()`,
  // creating a duplicate task alongside our `tasks` upsert in upsertTaskFromTrackWO.
  // The 'sync' event_type is ignored by that trigger (event_type filter), so we're safe.
  await supabase.from("reservation_events").upsert(
    {
      external_source: "track",
      external_id: externalId,
      event_type: "sync",
      event_at: (row.updatedAt as string | undefined) ?? new Date().toISOString(),
      payload_json: row,
    },
    { onConflict: "external_source,external_id,event_type,event_at", ignoreDuplicates: true },
  );
}

async function handleMaintenanceWorkOrderRow(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
): Promise<void> {
  await upsertTaskFromTrackWO(supabase, row, "maintenance");
}

async function handleHousekeepingWorkOrderRow(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
): Promise<void> {
  await upsertTaskFromTrackWO(supabase, row, "housekeeping");
}

async function upsertTaskFromTrackWO(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  category: "maintenance" | "housekeeping",
): Promise<void> {
  const externalId = String(row.id);
  const trackUnitIdNum = typeof row.unitId === "number" ? row.unitId : Number(row.unitId ?? NaN);
  const trackUnitIdStr = Number.isFinite(trackUnitIdNum) ? String(trackUnitIdNum) : null;

  // Resolve our local unit. Prefer the dedicated track_id integer column (set by
  // the existing 2026-04-21 reconciliation migration). Fall back to the generic
  // (external_source='track', external_id=...) pair populated by sync-track-units.mjs.
  let localUnitId: string | null = null;
  let propertyId: string | null = null;
  if (Number.isFinite(trackUnitIdNum)) {
    const { data: unitByTrackId } = await supabase
      .from("units")
      .select("id, property_id")
      .eq("track_id", trackUnitIdNum)
      .maybeSingle();
    if (unitByTrackId) {
      localUnitId = unitByTrackId.id as string;
      propertyId = unitByTrackId.property_id as string;
    }
  }
  if (!localUnitId && trackUnitIdStr) {
    const { data: unitByExternal } = await supabase
      .from("units")
      .select("id, property_id")
      .eq("external_source", "track")
      .eq("external_id", trackUnitIdStr)
      .maybeSingle();
    if (unitByExternal) {
      localUnitId = unitByExternal.id as string;
      propertyId = unitByExternal.property_id as string;
    }
  }

  if (!localUnitId || !propertyId) {
    // v8: demote to severity=info. Expected for TRACK-only units (archived
    // listings, units LRMB hasn't imported into AiiA — see
    // documents/TONY-BRIEFING-2026-05-20.md Q1+Q2 for the 34 unmapped units).
    // Surfaces in audit_logs under action='track_poll_info' so poll-health
    // metric stays clean.
    await logError(
      supabase,
      `${category}-work-orders`,
      "Unit not yet mapped from TRACK",
      { externalId, trackUnitId: trackUnitIdNum },
      "info",
    );
    return;
  }

  // Map TRACK status to AiiA status (best-effort, conservative)
  const trackStatus = String(row.status ?? "").toLowerCase();
  const aiiaStatus = mapTrackStatus(trackStatus);

  const reservationId = row.reservationId ?? row.nextReservationId ?? null;

  const baseTask = {
    // Identification + linkage
    external_source: "track",
    external_id: externalId,
    source_type: "travelnet", // matches existing SQL function's dedup check
    reservation_id: reservationId ? String(reservationId) : null,
    // Categorization
    task_category: category,
    task_type: category === "housekeeping" ? "checkout_turnover" : "maintenance",
    housekeeping_type: category === "housekeeping" ? deriveHousekeepingType(row) : null,
    title: derivedTitle(row, category),
    description: (row.description as string | undefined) ??
      (row.comments as string | undefined) ?? null,
    priority: derivePriority(row),
    // Linkage
    unit_id: localUnitId,
    property_id: propertyId,
    // Enforcement flags (AiiA's value-prop: photo+note required)
    requires_photo: true,
    requires_note: true,
    requires_timestamp: true,
    // Lifecycle
    status: aiiaStatus,
    started_at: (row.dateStarted as string | undefined) ??
      (row.scheduledAt as string | undefined) ?? null,
    completed_at: (row.dateCompleted as string | undefined) ??
      (row.completedAt as string | undefined) ?? null,
    processed_at: (row.dateProcessed as string | undefined) ??
      (row.processedAt as string | undefined) ?? null,
    scheduled_for: (row.scheduledAt as string | undefined) ??
      (row.dateScheduled as string | undefined) ?? null,
    updated_at: (row.updatedAt as string | undefined) ?? new Date().toISOString(),
  };

  // Upsert on (external_source, external_id)
  const { error } = await supabase
    .from("tasks")
    .upsert(baseTask, { onConflict: "external_source,external_id", ignoreDuplicates: false });

  if (error) {
    throw new Error(`upsert task failed: ${error.message}`);
  }
}

function mapTrackStatus(s: string): string {
  // Map onto the AiiA task_status enum:
  // new / assigned / vendor_not_started / in_progress / waiting_parts /
  // blocked / completed / verified / processed
  if (!s) return "new";
  if (s.includes("processed")) return "processed";
  if (s.includes("verify") || s.includes("verified")) return "verified";
  if (s.includes("complete")) return "completed";
  if (s.includes("inprogress") || s.includes("in_progress") || s.includes("started")) return "in_progress";
  if (s.includes("assign")) return "assigned";
  if (s.includes("hold") || s.includes("block")) return "blocked";
  if (s.includes("wait")) return "waiting_parts";
  return "new";
}

function deriveHousekeepingType(row: Record<string, unknown>): string {
  // Map onto the AiiA housekeeping_type enum:
  // checkout_clean / mid_stay_clean / deep_clean / linen_change /
  // intermittent_clean / owner_specific_clean
  const raw = String(row.cleanType ?? "").toLowerCase();
  if (row.isInspection) return "checkout_clean"; // inspections paired with cleans
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

function derivedTitle(row: Record<string, unknown>, category: "maintenance" | "housekeeping"): string {
  if (category === "maintenance") {
    return (row.summary as string | undefined) ??
      (row.description as string | undefined) ??
      `TRACK maintenance WO #${row.id}`;
  }
  const cleanType = row.cleanType ? String(row.cleanType) : "Clean";
  return `${cleanType} – TRACK WO #${row.id}`;
}
