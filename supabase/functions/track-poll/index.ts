// Polls TRACK PMS every 5 min and reconciles state into AiiA.
//
// v18 (2026-05-28): switched HK + maintenance pagination from forward-walk +
// updatedSince to BACKWARD-WALK from last page + last_seen_external_id watermark.
// Confirmed via track-debug 2026-05-28: TRACK API ignores sortColumn /
// sortDirection / updatedSince on those two endpoints (returns ID ASC default).
// Old forward+timestamp logic was stuck on Apr 10 for maintenance and only
// caught some HK rows by accident.
//
// Also added: auto-import of unmapped TRACK units. When a WO references a
// unitId we don't have in public.units, fetch /units/{id} from TRACK and
// INSERT into our units table (under the catch-all "TRACK Auto-Imported"
// property), then proceed with the task upsert. Eliminates the silent-drop
// path that bit Emma's "Emma Benson CO Test" tenant 2026-05-28.
//
// Reservations collection still uses forward-walk + updatedSince — that
// endpoint respects the filter and has been working fine.
//
// Reads:    reservations, maintenance work orders, housekeeping work orders, units
// Writes:   reservation_events, tasks, units (auto-import), properties (catch-all), audit_logs
// Mode:     passive observer (no TRACK writes).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Inlined from ../_shared/cron-auth.ts to keep deploy single-file. Kept in
// sync with that file — if you change one, change the other. Same behavior:
// require x-cron-secret header matching CRON_SECRET env var.
const _CRON_AUTH_TEXT = new TextEncoder();
function _timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
function requireCronSecret(req: Request): Response | null {
  const expected = Deno.env.get("CRON_SECRET");
  if (!expected) {
    console.warn("cron-auth: CRON_SECRET unset, accepting unauthenticated invocation");
    return null;
  }
  const received = req.headers.get("x-cron-secret") ?? req.headers.get("X-Cron-Secret") ?? "";
  if (!received || !_timingSafeEqualBytes(
    _CRON_AUTH_TEXT.encode(received), _CRON_AUTH_TEXT.encode(expected),
  )) {
    return new Response(JSON.stringify({ error: "cron_unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;

const PAGE_SIZE = 50;             // TRACK caps response at 25 regardless
const MAX_RETRY = 3;
const BACKWARD_PAGE_CAP = 100;    // walk at most this many pages back per run (~2500 WOs)
const AUTO_IMPORT_PROPERTY_NAME = "TRACK Auto-Imported";

// Per-run trackers (cleared each invocation).
const _unknownStatuses = new Set<string>();
const _autoImportedUnits = new Set<number>();

type Strategy = "forward" | "backward";

interface CollectionDef {
  name: string;
  path: string;
  embeddedKey: string;
  strategy: Strategy;
  onRow: (
    supabase: ReturnType<typeof createClient>,
    row: Record<string, unknown>,
    auth: string,
  ) => Promise<void>;
}

const COLLECTIONS: CollectionDef[] = [
  {
    name: "reservations",
    path: "/reservations",
    embeddedKey: "reservations",
    strategy: "forward",
    onRow: handleReservationRow,
  },
  {
    name: "maintenance-work-orders",
    path: "/maintenance/work-orders",
    embeddedKey: "workOrders",
    strategy: "backward",
    onRow: handleMaintenanceWorkOrderRow,
  },
  {
    name: "housekeeping-work-orders",
    path: "/housekeeping/work-orders",
    embeddedKey: "workOrders",
    strategy: "backward",
    onRow: handleHousekeepingWorkOrderRow,
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  _unknownStatuses.clear();
  _autoImportedUnits.clear();

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
    return jsonResponse(500, { runId, error: "Missing Supabase env vars" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const auth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);

  const summary: Record<string, unknown> = {
    runId,
    startedAt: new Date(startedAt).toISOString(),
    collections: {} as Record<string, unknown>,
  };

  try {
    for (const c of COLLECTIONS) {
      try {
        (summary.collections as Record<string, unknown>)[c.name] = c.strategy === "forward"
          ? await pollCollectionForward(supabase, auth, c)
          : await pollCollectionBackward(supabase, auth, c);
      } catch (collErr) {
        (summary.collections as Record<string, unknown>)[c.name] = {
          fetched: 0, processed: 0, errors: 1,
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
  summary.unknownTrackStatuses = Array.from(_unknownStatuses);
  summary.autoImportedUnits = Array.from(_autoImportedUnits);

  if (_unknownStatuses.size > 0) {
    try {
      await supabase.from("audit_logs").insert({
        action: "track_poll_unknown_status",
        entity_type: "edge_function",
        entity_id: runId,
        description: `track-poll saw ${_unknownStatuses.size} unknown TRACK status value(s): ${Array.from(_unknownStatuses).join(", ")}`,
        payload_json: {
          severity: "warning",
          runId,
          unknownStatuses: Array.from(_unknownStatuses),
          hint: "Update mapTrackStatus() to handle these.",
        },
      });
    } catch (_) { /* swallow */ }
  }

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
  } catch (_) { /* swallow */ }

  return jsonResponse(200, summary);
});

function summarizeErrors(summary: Record<string, unknown>): string {
  const c = summary.collections as Record<string, { errors: number }>;
  return Object.entries(c)
    .filter(([_, s]) => s && s.errors > 0)
    .map(([name, s]) => `${name}=${s.errors}`)
    .join(", ");
}

function anyErrors(summary: Record<string, unknown>): boolean {
  const c = summary.collections as Record<string, { errors: number }>;
  return Object.values(c).some((s) => s && s.errors > 0);
}

// ===========================================================================
// Polling strategies
// ===========================================================================

interface PollResult {
  fetched: number;
  processed: number;
  errors: number;
  pagesWalked?: number;
  watermark?: string | number | null;
}

// Forward walk + updatedSince filter — used for /reservations only.
async function pollCollectionForward(
  supabase: ReturnType<typeof createClient>,
  auth: string,
  c: CollectionDef,
): Promise<PollResult> {
  const state = await getPollState(supabase, c.name);
  const sinceTs = state?.last_seen_updated_at ?? null;

  let fetched = 0;
  let processed = 0;
  let errors = 0;
  let newestSeenTs = sinceTs;

  let page = 1;
  let keepPaging = true;
  while (keepPaging) {
    const url = new URL(`${BASE}${c.path}`);
    url.searchParams.set("sortColumn", "updatedAt");
    url.searchParams.set("sortDirection", "desc");
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));
    if (sinceTs) url.searchParams.set("updatedSince", sinceTs);

    const res = await fetchWithRetry(url.toString(), { headers: trackHeaders(auth) });
    if (!res.ok) {
      await logError(supabase, c.name, `HTTP ${res.status} fetching ${url.pathname}`, { page });
      errors++;
      break;
    }

    const json = await res.json();
    const rows = extractRows(json, c.embeddedKey);
    fetched += rows.length;
    if (rows.length === 0) break;

    for (const row of rows) {
      const updatedAt = (row.updatedAt as string | undefined) ?? null;
      if (sinceTs && updatedAt && updatedAt <= sinceTs) {
        keepPaging = false;
        continue;
      }
      try {
        await c.onRow(supabase, row, auth);
        processed++;
        if (!newestSeenTs || (updatedAt && updatedAt > newestSeenTs)) {
          newestSeenTs = updatedAt;
        }
      } catch (err) {
        errors++;
        await logError(supabase, c.name, err instanceof Error ? err.message : String(err), {
          externalId: row.id, page,
        });
      }
    }

    const hasNext = json?._links?.next?.href !== undefined;
    if (!hasNext) keepPaging = false;
    page++;
    if (page > 50) {
      await logError(supabase, c.name, "Page cap (50) reached", { page });
      break;
    }
  }

  await supabase.from("track_poll_state").upsert({
    collection_name: c.name,
    last_seen_updated_at: newestSeenTs,
    last_run_at: new Date().toISOString(),
    last_run_outcome: errors === 0 ? "ok" : "partial",
    records_processed: processed,
    records_errored: errors,
  }, { onConflict: "collection_name" });

  return { fetched, processed, errors, watermark: newestSeenTs };
}

// Backward walk from last page — used for /maintenance/work-orders and
// /housekeeping/work-orders. TRACK ignores sortColumn / updatedSince on
// these endpoints (default sort is ID ASC), so newest WOs live at the
// END of pagination.
async function pollCollectionBackward(
  supabase: ReturnType<typeof createClient>,
  auth: string,
  c: CollectionDef,
): Promise<PollResult> {
  const state = await getPollState(supabase, c.name);
  const lastSeenId = Number(state?.last_seen_external_id ?? 0) || 0;

  // 1. Fetch page 1 to learn total page_count (TRACK rejects page=0).
  const firstUrl = `${BASE}${c.path}?limit=${PAGE_SIZE}&page=1`;
  const firstRes = await fetchWithRetry(firstUrl, { headers: trackHeaders(auth) });
  if (!firstRes.ok) {
    await logError(supabase, c.name, `HTTP ${firstRes.status} probing page 1`, {});
    return { fetched: 0, processed: 0, errors: 1, pagesWalked: 0, watermark: lastSeenId };
  }
  const firstJson = await firstRes.json();
  const pageCount = Number(firstJson?.page_count) || 1;

  let page = pageCount;
  let pagesWalked = 0;
  let fetched = 0;
  let processed = 0;
  let errors = 0;
  let newestSeenId = lastSeenId;

  while (page >= 1 && pagesWalked < BACKWARD_PAGE_CAP) {
    const url = `${BASE}${c.path}?limit=${PAGE_SIZE}&page=${page}`;
    const res = await fetchWithRetry(url, { headers: trackHeaders(auth) });
    if (!res.ok) {
      await logError(supabase, c.name, `HTTP ${res.status} on page ${page}`, { page });
      errors++;
      break;
    }
    const json = await res.json();
    const rows = extractRows(json, c.embeddedKey);
    pagesWalked++;
    fetched += rows.length;

    // Process newest first within each page so the watermark advances cleanly.
    rows.sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0));

    let hitOld = false;
    for (const row of rows) {
      const rowId = Number(row.id);
      if (!Number.isFinite(rowId)) continue;
      if (rowId <= lastSeenId) {
        // We've crossed back into known-processed territory.
        hitOld = true;
        continue;
      }
      try {
        await c.onRow(supabase, row, auth);
        processed++;
        if (rowId > newestSeenId) newestSeenId = rowId;
      } catch (err) {
        errors++;
        await logError(supabase, c.name, err instanceof Error ? err.message : String(err), {
          externalId: row.id, page,
        });
      }
    }

    if (hitOld) break;
    page--;
  }

  if (pagesWalked >= BACKWARD_PAGE_CAP) {
    await logError(
      supabase, c.name,
      `Backward page cap (${BACKWARD_PAGE_CAP}) reached — more pages remain, will resume next cron`,
      { pageCount, stoppedAtPage: page, watermark: newestSeenId },
      "warning",
    );
  }

  await supabase.from("track_poll_state").upsert({
    collection_name: c.name,
    last_seen_external_id: newestSeenId,
    last_run_at: new Date().toISOString(),
    last_run_outcome: errors === 0 ? "ok" : "partial",
    records_processed: processed,
    records_errored: errors,
  }, { onConflict: "collection_name" });

  return { fetched, processed, errors, pagesWalked, watermark: newestSeenId };
}

function extractRows(json: unknown, key: string): Array<Record<string, unknown>> {
  if (!json || typeof json !== "object") return [];
  const embedded = (json as Record<string, unknown>)._embedded as
    | Record<string, unknown>
    | undefined;
  if (!embedded) return [];
  const k = key in embedded ? key : Object.keys(embedded)[0];
  if (!k) return [];
  const arr = embedded[k];
  return Array.isArray(arr) ? (arr as Array<Record<string, unknown>>) : [];
}

async function getPollState(
  supabase: ReturnType<typeof createClient>,
  collection: string,
): Promise<{
  last_seen_updated_at: string | null;
  last_seen_external_id: number | null;
} | null> {
  const { data, error } = await supabase
    .from("track_poll_state")
    .select("last_seen_updated_at, last_seen_external_id")
    .eq("collection_name", collection)
    .maybeSingle();
  if (error) return null;
  return data as {
    last_seen_updated_at: string | null;
    last_seen_external_id: number | null;
  } | null;
}

async function logError(
  supabase: ReturnType<typeof createClient>,
  collection: string,
  message: string,
  context: Record<string, unknown>,
  severity: "error" | "warning" | "info" = "error",
) {
  await supabase.from("audit_logs").insert({
    action: severity === "info" ? "track_poll_info" : "track_poll_error",
    entity_type: "edge_function",
    entity_id: crypto.randomUUID(),
    description: `track-poll ${collection}: ${message}`,
    payload_json: { collection, message, severity, ...context },
  });
}

function trackHeaders(auth: string): HeadersInit {
  return {
    Authorization: auth,
    Accept: "application/json",
    "User-Agent": "MonteKristo-AI/LRMB-track-poll/1.0",
  };
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status >= 500 || res.status === 429) {
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

// ===========================================================================
// Row handlers
// ===========================================================================

async function handleReservationRow(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  _auth: string,
): Promise<void> {
  const externalId = String(row.id);
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
  auth: string,
): Promise<void> {
  await upsertTaskFromTrackWO(supabase, row, "maintenance", auth);
}

async function handleHousekeepingWorkOrderRow(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  auth: string,
): Promise<void> {
  await upsertTaskFromTrackWO(supabase, row, "housekeeping", auth);
}

async function upsertTaskFromTrackWO(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  category: "maintenance" | "housekeeping",
  auth: string,
): Promise<void> {
  const externalId = String(row.id);
  const trackUnitIdNum = typeof row.unitId === "number" ? row.unitId : Number(row.unitId ?? NaN);
  const trackUnitIdStr = Number.isFinite(trackUnitIdNum) ? String(trackUnitIdNum) : null;

  let localUnitId: string | null = null;
  let propertyId: string | null = null;

  if (Number.isFinite(trackUnitIdNum)) {
    const { data: unitByTrackId } = await supabase
      .from("units").select("id, property_id")
      .eq("track_id", trackUnitIdNum).maybeSingle();
    if (unitByTrackId) {
      localUnitId = unitByTrackId.id as string;
      propertyId = unitByTrackId.property_id as string;
    }
  }
  if (!localUnitId && trackUnitIdStr) {
    const { data: unitByExternal } = await supabase
      .from("units").select("id, property_id")
      .eq("external_source", "track").eq("external_id", trackUnitIdStr).maybeSingle();
    if (unitByExternal) {
      localUnitId = unitByExternal.id as string;
      propertyId = unitByExternal.property_id as string;
    }
  }

  // v18: auto-import unit from TRACK if we don't have it locally.
  if (!localUnitId && Number.isFinite(trackUnitIdNum)) {
    const imported = await autoImportUnit(supabase, trackUnitIdNum, auth);
    if (imported) {
      localUnitId = imported.unit_id;
      propertyId = imported.property_id;
    }
  }

  if (!localUnitId || !propertyId) {
    await logError(
      supabase, `${category}-work-orders`,
      "Unit not yet mapped from TRACK",
      { externalId, trackUnitId: trackUnitIdNum }, "info",
    );
    return;
  }

  const trackStatus = String(row.status ?? "").toLowerCase();
  const aiiaStatus = mapTrackStatus(trackStatus, _unknownStatuses);

  const reservationId = row.reservationId ?? row.nextReservationId ?? null;
  const updatedAtVal = (row.updatedAt as string | undefined) ?? new Date().toISOString();
  let startedAt = (row.dateStarted as string | undefined) ??
    (row.scheduledAt as string | undefined) ?? null;
  let completedAt = (row.dateCompleted as string | undefined) ??
    (row.completedAt as string | undefined) ?? null;

  if (["in_progress", "completed", "verified", "processed"].includes(aiiaStatus) && !startedAt) {
    startedAt = completedAt ?? updatedAtVal;
  }
  if (["completed", "verified", "processed"].includes(aiiaStatus) && !completedAt) {
    completedAt = startedAt ?? updatedAtVal;
  }

  const baseTask = {
    external_source: "track",
    external_id: externalId,
    source_type: "travelnet",
    reservation_id: reservationId ? String(reservationId) : null,
    task_category: category,
    task_type: category === "housekeeping" ? "checkout_turnover" : "maintenance",
    housekeeping_type: category === "housekeeping" ? deriveHousekeepingType(row) : null,
    title: derivedTitle(row, category),
    description: (row.description as string | undefined) ??
      (row.comments as string | undefined) ?? null,
    priority: derivePriority(row),
    unit_id: localUnitId,
    property_id: propertyId,
    requires_photo: true,
    requires_note: true,
    requires_timestamp: true,
    status: aiiaStatus,
    started_at: startedAt,
    completed_at: completedAt,
    processed_at: (row.dateProcessed as string | undefined) ??
      (row.processedAt as string | undefined) ?? null,
    scheduled_for: (row.scheduledAt as string | undefined) ??
      (row.dateScheduled as string | undefined) ?? null,
    created_at: (row.createdAt as string | undefined) ??
      (row.dateOpened as string | undefined) ??
      (row.dateCreated as string | undefined) ??
      updatedAtVal,
    updated_at: updatedAtVal,
  };

  const { error } = await supabase.from("tasks").upsert(
    baseTask,
    { onConflict: "external_source,external_id", ignoreDuplicates: false },
  );
  if (error) throw new Error(`upsert task failed: ${error.message}`);
}

// ===========================================================================
// Auto-import unit on demand
// ===========================================================================

async function autoImportUnit(
  supabase: ReturnType<typeof createClient>,
  trackUnitId: number,
  auth: string,
): Promise<{ unit_id: string; property_id: string } | null> {
  try {
    const url = `${BASE}/units/${trackUnitId}`;
    const res = await fetchWithRetry(url, { headers: trackHeaders(auth) });
    if (!res.ok) {
      await logError(
        supabase, "auto-import-unit",
        `HTTP ${res.status} fetching /units/${trackUnitId}`,
        { trackUnitId },
      );
      return null;
    }
    const unit = (await res.json()) as Record<string, unknown>;

    // Race-safe re-check: another concurrent invocation may have imported it.
    const { data: existing } = await supabase
      .from("units").select("id, property_id")
      .eq("track_id", trackUnitId).maybeSingle();
    if (existing) {
      return { unit_id: existing.id as string, property_id: existing.property_id as string };
    }

    const propertyId = await getOrCreateAutoImportProperty(supabase);
    if (!propertyId) return null;

    const unitCode = String(
      unit.unitCode ?? unit.name ?? unit.shortName ?? `TRACK-${trackUnitId}`,
    ).slice(0, 80);

    const insert = {
      property_id: propertyId,
      track_id: trackUnitId,
      external_source: "track",
      external_id: String(trackUnitId),
      unit_code: unitCode,
      short_name: (unit.shortName as string | undefined) ?? (unit.name as string | undefined) ?? null,
      bedrooms: Number(unit.bedrooms ?? 0) || 0,
      max_occupancy: Number(unit.maxOccupancy ?? 0) || 0,
      active: unit.isActive !== false,
    };

    const { data: inserted, error } = await supabase
      .from("units").insert(insert).select("id, property_id").single();
    if (error || !inserted) {
      await logError(
        supabase, "auto-import-unit",
        `INSERT failed: ${error?.message ?? "unknown"}`,
        { trackUnitId, unitCode },
      );
      return null;
    }

    _autoImportedUnits.add(trackUnitId);
    await supabase.from("audit_logs").insert({
      action: "track_unit_auto_imported",
      entity_type: "edge_function",
      entity_id: crypto.randomUUID(),
      description: `Auto-imported TRACK unit ${trackUnitId} (${unitCode})`,
      payload_json: {
        severity: "info", trackUnitId, unitCode,
        propertyId, unitId: inserted.id,
      },
    });

    return { unit_id: inserted.id as string, property_id: inserted.property_id as string };
  } catch (err) {
    await logError(
      supabase, "auto-import-unit",
      err instanceof Error ? err.message : String(err),
      { trackUnitId },
    );
    return null;
  }
}

async function getOrCreateAutoImportProperty(
  supabase: ReturnType<typeof createClient>,
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("properties").select("id")
    .eq("external_source", "track-auto-import")
    .eq("external_id", "catch-all").maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from("properties").insert({
      name: AUTO_IMPORT_PROPERTY_NAME,
      external_source: "track-auto-import",
      external_id: "catch-all",
    }).select("id").single();
  if (error || !created) {
    await logError(
      supabase, "auto-import-unit",
      `getOrCreateAutoImportProperty failed: ${error?.message ?? "unknown"}`,
      {},
    );
    return null;
  }
  return created.id as string;
}

// ===========================================================================
// Mappers
// ===========================================================================

const KNOWN_NEW_TRACK_STATUSES = new Set([
  "pending", "open", "new", "scheduled", "draft", "queued", "", "null",
]);

function mapTrackStatus(s: string, unknownTracker?: Set<string>): string {
  if (!s) return "new";
  const t = s.toLowerCase();
  const normalized = t.replace(/[-_]/g, "");
  if (t.includes("cancel") || t.includes("void") || t.includes("archive") || t.includes("reject")) return "completed";
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  if (normalized.includes("inprogress") || t.includes("started")) return "in_progress";
  if (t.includes("assign")) return "assigned";
  if (t.includes("vendor") && t.includes("not") && t.includes("start")) return "vendor_not_started";
  if (t.includes("exception") || t.includes("hold") || t.includes("block")) return "blocked";
  if (t.includes("wait")) return "waiting_parts";
  if (unknownTracker && !KNOWN_NEW_TRACK_STATUSES.has(t)) {
    unknownTracker.add(t);
  }
  return "new";
}

function deriveHousekeepingType(row: Record<string, unknown>): string {
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

function derivedTitle(row: Record<string, unknown>, category: "maintenance" | "housekeeping"): string {
  if (category === "maintenance") {
    return (row.summary as string | undefined) ??
      (row.description as string | undefined) ??
      `TRACK maintenance WO #${row.id}`;
  }
  const cleanType = row.cleanType ? String(row.cleanType) : "Clean";
  return `${cleanType} – TRACK WO #${row.id}`;
}
