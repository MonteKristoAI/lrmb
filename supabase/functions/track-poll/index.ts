// Polls TRACK PMS every 5 min and reconciles state into AiiA.
//
// v22 (2026-05-28): capture TRACK assignment metadata.
//   TRACK assigns HK work orders to a VENDOR (e.g. row.vendorId 1473 →
//   "Emma Benson CO Test"), not to a specific staff user. Old behavior
//   dropped both `vendorId` and `assignees[]` on the floor, so field
//   staff saw nothing in their app even when TRACK had them as the
//   assignee inside the vendor company.
//
//   v22 surfaces the assignment so admins can act on it:
//     - tasks.assigned_vendor_name = row._embedded.vendor.name OR
//                                    row.assignees[0].name OR null
//   No FK link yet (profiles → vendor mapping is a separate schema
//   change). Field-staff visibility still requires Tony to manually
//   `assigned_to` the right local user in the admin UI, or a future
//   profiles.vendor_id + RLS update.
//
// v21 (2026-05-28): level-10 adversarial audit fixes:
//   - CRON_SECRET now fail-CLOSED always (was fail-open if env unset).
//     The graceful-rollout backdoor from initial v3-era deploy is gone.
//   - Cancelled / voided / archived / rejected TRACK WOs are SKIPPED
//     entirely. Old behavior mapped them to AiiA 'completed' which
//     made them eligible for billing.
//   - Status mapper: vendor_not_started check moved BEFORE the bare
//     'started' substring match. Old order misclassified "vendor not
//     started" → in_progress.
//   - autoImportUnit now distinguishes "unit genuinely deleted in TRACK"
//     (404 → return skipped:true, advance watermark) from "transient
//     failure" (5xx / network → throw, hold watermark, retry next cron).
//   - Pre-fetch existing tasks row to preserve admin-set local state on
//     upsert: HK 'processed' status (Tony's billing-complete terminal)
//     is no longer downgraded back to 'verified' on every poll; and
//     maintenance owner_charges_amount > 0 is no longer reset to 0.
//   - Backward page cap (100) now holds watermark stable when more
//     pages remain. Old behavior advanced watermark to newestSeenId
//     mid-walk, which permanently skipped older pages.
//   - String(row.id) replaced with a guard that errors on null/undefined
//     so we don't upsert under external_id="undefined".
//   - maybeSingle() errors and reservation upsert errors no longer
//     swallowed silently.
//
// v20 (2026-05-28): autoImportUnit + getOrCreateAutoImportProperty
// switched from INSERT to UPSERT. Migration 20260528180000 dropped the
// partial WHERE on the unique indexes so PostgREST ON CONFLICT can
// resolve them (the partial predicate was the reason v20's UPSERT failed
// for unit W3B1229L at 16:51 UTC).
// TRACK 'processed' HK demoted to AiiA 'verified' — superseded by v21's
// pre-fetch which only demotes if the local row isn't already 'processed'.
//
// v19 (2026-05-28): default owner_charges_amount = 0 for TRACK-sourced
// maintenance WOs. DB CHECK constraint requires it for status='processed'
// and TRACK doesn't surface charges data via /maintenance/work-orders.
// Fixes the 22 silent upsert failures seen during v18 catchup walk.
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
  // v21: fail-CLOSED if env unset (was fail-open with a console.warn).
  // CRON_SECRET has been provisioned for weeks; missing env = misconfig +
  // attacker-with-service-role-JWT bypass risk.
  if (!expected) {
    return new Response(JSON.stringify({ error: "cron_misconfigured", hint: "CRON_SECRET env unset" }), {
      status: 503, headers: { "Content-Type": "application/json" },
    });
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

  // v21: HOLD the watermark when the backward page cap stops us before
  // we've hit known-old territory. Old behavior advanced newestSeenId
  // to the highest successful ID on the partial walk, which permanently
  // skipped older un-walked pages (would never be re-fetched).
  const partialBackwardWalk = pagesWalked >= BACKWARD_PAGE_CAP;
  if (partialBackwardWalk) {
    await logError(
      supabase, c.name,
      `Backward page cap (${BACKWARD_PAGE_CAP}) reached — holding watermark at ${lastSeenId} so older pages are re-walked next cron`,
      { pageCount, stoppedAtPage: page, candidateWatermark: newestSeenId, heldAt: lastSeenId },
      "warning",
    );
  }
  const persistedWatermark = partialBackwardWalk ? lastSeenId : newestSeenId;

  await supabase.from("track_poll_state").upsert({
    collection_name: c.name,
    last_seen_external_id: persistedWatermark,
    last_run_at: new Date().toISOString(),
    last_run_outcome: errors === 0 && !partialBackwardWalk ? "ok" : "partial",
    records_processed: processed,
    records_errored: errors,
  }, { onConflict: "collection_name" });

  return { fetched, processed, errors, pagesWalked, watermark: persistedWatermark };
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
  // v21: validate row.id (was: String(undefined) → "undefined" external_id).
  const externalId = validateExternalId(row.id);
  // v21: check upsert error (was: silently swallowed, lost reservations).
  const { error } = await supabase.from("reservation_events").upsert(
    {
      external_source: "track",
      external_id: externalId,
      event_type: "sync",
      event_at: (row.updatedAt as string | undefined) ?? new Date().toISOString(),
      payload_json: row,
    },
    { onConflict: "external_source,external_id,event_type,event_at", ignoreDuplicates: true },
  );
  if (error) throw new Error(`reservation upsert failed: ${error.message}`);
}

// v21: shared row.id validator. Throws if the upstream row lacks a usable
// identifier. Throwing aborts the row, increments errors, and holds the
// watermark so retries on next cron can pick it up if TRACK fills it in.
function validateExternalId(raw: unknown): string {
  if (raw === null || raw === undefined) {
    throw new Error("row.id missing");
  }
  const s = String(raw).trim();
  if (!s || s === "undefined" || s === "null" || s === "NaN") {
    throw new Error(`row.id invalid: ${JSON.stringify(raw)}`);
  }
  return s;
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
  // v21: validate ID before we use it as the upsert conflict key.
  const externalId = validateExternalId(row.id);
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

  // v18 + v21: auto-import unit from TRACK if we don't have it locally.
  // v21 splits the failure mode into permanent (TRACK 404 → skip row,
  // advance watermark) vs transient (5xx/network → throw, hold watermark).
  if (!localUnitId && Number.isFinite(trackUnitIdNum)) {
    const imported = await autoImportUnit(supabase, trackUnitIdNum, auth);
    if (imported.ok) {
      localUnitId = imported.unit_id;
      propertyId = imported.property_id;
    } else if (imported.permanent) {
      // Unit truly gone from TRACK; log + skip + let watermark advance.
      await logError(
        supabase, `${category}-work-orders`,
        `Permanent skip: ${imported.reason}`,
        { externalId, trackUnitId: trackUnitIdNum }, "info",
      );
      return;
    } else {
      // Transient — THROW so outer loop counts this as an error and
      // refuses to advance the watermark. Retried next cron.
      throw new Error(`auto-import transient failure: ${imported.reason}`);
    }
  }

  if (!localUnitId || !propertyId) {
    // We have a trackUnitIdNum that's NaN (TRACK row had no unitId) — log
    // and advance watermark. Truly malformed row, can't recover.
    await logError(
      supabase, `${category}-work-orders`,
      "WO has no resolvable unitId",
      { externalId, trackUnitId: trackUnitIdNum }, "info",
    );
    return;
  }

  const trackStatus = String(row.status ?? "").toLowerCase();
  const mappedStatus = mapTrackStatus(trackStatus, _unknownStatuses);

  // v21: skip cancelled/voided/archived/rejected. Mapper returns null for
  // these so they never enter our task queues. Watermark still advances
  // (we observed the row).
  if (mappedStatus === null) {
    return;
  }
  let aiiaStatus = mappedStatus;

  // v21: pre-fetch existing row so we can preserve admin-set local state
  // on update. ~10ms extra round-trip per row, acceptable for 5-min poll.
  const { data: existing, error: existingErr } = await supabase
    .from("tasks")
    .select("status, owner_charges_amount")
    .eq("external_source", "track")
    .eq("external_id", externalId)
    .maybeSingle();
  if (existingErr) {
    throw new Error(`pre-fetch existing task failed: ${existingErr.message}`);
  }

  // v21: HK 'processed' state preservation. If the local row is already
  // 'processed' (Tony advanced it after invoice receipt via the billing
  // modal), keep that — do NOT demote back to 'verified'. Otherwise
  // demote TRACK 'processed' to 'verified' so the vendor_invoice CHECK
  // constraint passes. Tony advances when the invoice actually arrives.
  if (category === "housekeeping" && aiiaStatus === "processed") {
    aiiaStatus = existing?.status === "processed" ? "processed" : "verified";
  }

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

  // v21: preserve admin-set owner_charges_amount when the local row already
  // has a non-zero value. Old behavior reset to 0 on every poll, erasing
  // the billing data Tony entered via the admin UI.
  // For first inserts (existing is null) or rows where the admin hasn't
  // entered a real charge yet (NULL or 0), default to 0 to satisfy the
  // tasks_processed_consistency CHECK constraint when status='processed'.
  const existingCharge = existing?.owner_charges_amount;
  const preserveCharge = category === "maintenance"
    && existingCharge !== null
    && existingCharge !== undefined
    && Number(existingCharge) > 0;
  const maintenanceExtras = category === "maintenance"
    ? { owner_charges_amount: preserveCharge ? Number(existingCharge) : 0 }
    : {};

  // v22: capture TRACK vendor / assignee label (informational only — no FK
  // link yet, profiles → vendor mapping is a separate schema change).
  const embedded = row._embedded as Record<string, unknown> | undefined;
  const trackVendor = embedded?.vendor as Record<string, unknown> | undefined;
  const trackAssignees = row.assignees as Array<Record<string, unknown>> | undefined;
  const vendorLabel =
    (trackVendor?.name as string | undefined) ??
    (trackAssignees && trackAssignees[0]?.name as string | undefined) ??
    null;

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
    assigned_vendor_name: vendorLabel,
    ...maintenanceExtras,
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

// v21: tri-state result. ok=true → use the imported unit. ok=false +
// permanent=true → unit truly doesn't exist in TRACK (404), skip the WO
// and advance watermark. ok=false + permanent=false → transient failure,
// the upsertTask path should THROW so the outer poll counts this as a
// row error and holds the watermark for next-cron retry.
type AutoImportResult =
  | { ok: true; unit_id: string; property_id: string }
  | { ok: false; permanent: boolean; reason: string };

async function autoImportUnit(
  supabase: ReturnType<typeof createClient>,
  trackUnitId: number,
  auth: string,
): Promise<AutoImportResult> {
  try {
    const url = `${BASE}/units/${trackUnitId}`;
    const res = await fetchWithRetry(url, { headers: trackHeaders(auth) });
    if (res.status === 404) {
      // Genuine "this unit no longer exists in TRACK" → permanent skip.
      await logError(
        supabase, "auto-import-unit",
        `TRACK /units/${trackUnitId} returned 404 — skipping WOs against this unit permanently`,
        { trackUnitId }, "info",
      );
      return { ok: false, permanent: true, reason: "track_unit_404" };
    }
    if (!res.ok) {
      // Transient (5xx, 429, 403, etc.) — caller throws so watermark holds.
      await logError(
        supabase, "auto-import-unit",
        `HTTP ${res.status} fetching /units/${trackUnitId}`,
        { trackUnitId },
      );
      return { ok: false, permanent: false, reason: `track_http_${res.status}` };
    }
    const unit = (await res.json()) as Record<string, unknown>;

    // Race-safe re-check: another concurrent invocation may have imported it.
    const { data: existing, error: existingErr } = await supabase
      .from("units").select("id, property_id")
      .eq("track_id", trackUnitId).maybeSingle();
    if (existingErr) {
      // v21: surface lookup errors instead of treating as not-found.
      return { ok: false, permanent: false, reason: `db_lookup_${existingErr.code ?? "error"}` };
    }
    if (existing) {
      return { ok: true, unit_id: existing.id as string, property_id: existing.property_id as string };
    }

    const propertyId = await getOrCreateAutoImportProperty(supabase);
    if (!propertyId) {
      return { ok: false, permanent: false, reason: "catch_all_property_create_failed" };
    }

    // v21: defensive unit_code derivation. If TRACK returns truly blank
    // unitCode + name + shortName, mark the unit inactive with a
    // placeholder name so it doesn't surface in active UI lists.
    const rawCode = (unit.unitCode as string | undefined)
      ?? (unit.name as string | undefined)
      ?? (unit.shortName as string | undefined)
      ?? "";
    const codeIsBlank = !rawCode.trim();
    const unitCode = (codeIsBlank ? `TRACK-${trackUnitId}-AUTOIMPORT` : rawCode).slice(0, 80);

    const insert = {
      property_id: propertyId,
      track_id: trackUnitId,
      external_source: "track",
      external_id: String(trackUnitId),
      unit_code: unitCode,
      short_name: (unit.shortName as string | undefined) ?? (unit.name as string | undefined) ?? null,
      bedrooms: Number(unit.bedrooms ?? 0) || 0,
      max_occupancy: Number(unit.maxOccupancy ?? 0) || 0,
      // v21: inactive by default when TRACK didn't surface a real name.
      active: !codeIsBlank && unit.isActive !== false,
    };

    // v20: UPSERT (not INSERT) so concurrent races land on the same row.
    // units_track_id_uniq (migration 20260528180000) is now a regular
    // (non-partial) unique index that ON CONFLICT can resolve.
    const { data: inserted, error } = await supabase
      .from("units")
      .upsert(insert, { onConflict: "track_id" })
      .select("id, property_id")
      .single();
    if (error || !inserted) {
      // Race fallback: another invocation may have inserted the same row
      // between our re-check and our upsert. Re-fetch.
      const { data: raced } = await supabase
        .from("units").select("id, property_id")
        .eq("track_id", trackUnitId).maybeSingle();
      if (raced) {
        return { ok: true, unit_id: raced.id as string, property_id: raced.property_id as string };
      }
      await logError(
        supabase, "auto-import-unit",
        `UPSERT failed: ${error?.message ?? "unknown"}`,
        { trackUnitId, unitCode },
      );
      return { ok: false, permanent: false, reason: `upsert_${error?.code ?? "error"}` };
    }

    _autoImportedUnits.add(trackUnitId);
    await supabase.from("audit_logs").insert({
      action: "track_unit_auto_imported",
      entity_type: "edge_function",
      entity_id: crypto.randomUUID(),
      description: `Auto-imported TRACK unit ${trackUnitId} (${unitCode})`,
      payload_json: {
        severity: "info", trackUnitId, unitCode,
        propertyId, unitId: inserted.id, codeWasBlank: codeIsBlank,
      },
    });

    return { ok: true, unit_id: inserted.id as string, property_id: inserted.property_id as string };
  } catch (err) {
    await logError(
      supabase, "auto-import-unit",
      err instanceof Error ? err.message : String(err),
      { trackUnitId },
    );
    return { ok: false, permanent: false, reason: "exception" };
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

  // v20: UPSERT against properties_external_uniq (migration 20260528170000)
  // so two concurrent first-import races don't create duplicate catch-all
  // properties.
  const { data: created, error } = await supabase
    .from("properties")
    .upsert({
      name: AUTO_IMPORT_PROPERTY_NAME,
      external_source: "track-auto-import",
      external_id: "catch-all",
    }, { onConflict: "external_source,external_id" })
    .select("id")
    .single();
  if (error || !created) {
    // Race fallback.
    const { data: raced } = await supabase
      .from("properties").select("id")
      .eq("external_source", "track-auto-import")
      .eq("external_id", "catch-all").maybeSingle();
    if (raced) return raced.id as string;
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

// v21: returns null for cancelled / voided / archived / rejected so the
// caller skips the upsert entirely. Old behavior mapped these to AiiA
// 'completed' which made cancelled WOs eligible for billing in our queues.
function mapTrackStatus(s: string, unknownTracker?: Set<string>): string | null {
  if (!s) return "new";
  const t = s.toLowerCase();
  const normalized = t.replace(/[-_]/g, "");

  // v21: hard skip for terminal-cancelled. Returns null → caller returns
  // without writing to tasks. Watermark still advances (we observed the
  // row), but no row is upserted.
  if (t.includes("cancel") || t.includes("void") || t.includes("archive") || t.includes("reject")) {
    return null;
  }

  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";

  // v21: vendor_not_started precedence — check BEFORE the bare 'started'
  // substring. Otherwise "vendor not started" trips the started branch
  // and maps to in_progress.
  if (t.includes("vendor") && t.includes("not") && t.includes("start")) return "vendor_not_started";

  if (normalized.includes("inprogress") || t.includes("started")) return "in_progress";
  if (t.includes("assign")) return "assigned";
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
