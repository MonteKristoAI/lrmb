// v15 (2026-05-22): Miami-local date windows + error surfacing
//   - date windows previously computed in UTC, causing arrivals/checkouts to
//     drift +/-1 day around UTC midnight (which is 8 PM EST / 7 PM EDT in Miami).
//   - now: arrival_date / departure_date (date-only strings) are compared
//     against today's date in America/New_York timezone, which matches how
//     LRMB / TRACK think about a "stay day".
//   - Promise.all now returns full responses so a single failing query can
//     surface as 500 instead of silently returning {data: null}.
// v14: SQL-side date-window filter on mv_track_reservations_latest
//   - fixes v13 bug: PostgREST 1000-row default cut off relevant reservations
//   - now: arrival in [today-14d, today+8d] OR departure today -> ~150 rows
// v13: switch reservations from raw payload_json to mv_track_reservations_latest
//   - was: fetch 1500 raw reservation_events with payload_json = 13MB transfer
//   - now: read pre-extracted MV with only 5 columns = ~2MB transfer + already-deduped
//   - MV refreshed every 2 min by pg_cron alongside mv_ops_dashboard_kpis
// v12: single Promise.all across ALL reads (no perf win, queries already fast)
// v11: KPI counts from materialized view mv_ops_dashboard_kpis (refreshed every minute by pg_cron)
// v10: Promise.all parallelization of count + view reads
// v9:  per-panel array trim to top 100 + total counts
// v7:  joins units + properties, week-over-week KPIs, property breakdown
// v5/v6: + damageClaims + maint limit bumped
// v2/v3: + totals + recentActivity + recentPhotos
// Auth: HMAC-signed share-link token in ?t= query param. No Supabase session needed.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store",
};

const TEXT = new TextEncoder();
const ALG = { name: "HMAC", hash: "SHA-256" };

class ShareLinkError extends Error {
  constructor(public readonly code: string, msg: string) { super(msg); }
}

function b64UrlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function importKey(secret: string) {
  return crypto.subtle.importKey("raw", TEXT.encode(secret), ALG, false, ["sign", "verify"]);
}
async function verifyShareToken(token: string, secret: string) {
  if (!secret) throw new ShareLinkError("missing_secret", "no secret");
  if (!token) throw new ShareLinkError("missing_token", "no token");
  const parts = token.split(".");
  if (parts.length !== 2) throw new ShareLinkError("bad_format", "bad format");
  const [payloadB64, sigB64] = parts;
  const key = await importKey(secret);
  const sig = b64UrlDecode(sigB64);
  const ok = await crypto.subtle.verify("HMAC", key, sig, TEXT.encode(payloadB64));
  if (!ok) throw new ShareLinkError("bad_signature", "sig mismatch");
  let payload: { iat: number; exp: number; v: number; viewer?: string };
  try {
    payload = JSON.parse(new TextDecoder().decode(b64UrlDecode(payloadB64)));
  } catch {
    throw new ShareLinkError("bad_format", "payload not json");
  }
  if (payload.v !== 1) throw new ShareLinkError("unsupported_version", `v=${payload.v}`);
  const now = Math.floor(Date.now() / 1000);
  if (payload.iat > now + 60) throw new ShareLinkError("future_iat", "iat in future");
  if (payload.exp <= now) throw new ShareLinkError("expired", "expired");
  return payload;
}

type Unit = {
  id: string;
  unit_code: string | null;
  short_name: string | null;
  track_id: number | null;
  property_id: string | null;
  property_name: string | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? url.searchParams.get("token");
  const secret = Deno.env.get("OPS_VIEW_HMAC_SECRET");
  if (!secret) return json(500, { error: "Server missing OPS_VIEW_HMAC_SECRET" });

  let viewer: string | null = null;
  try {
    const p = await verifyShareToken(token ?? "", secret);
    viewer = p.viewer ?? null;
  } catch (err) {
    if (err instanceof ShareLinkError) return json(401, { error: err.code, message: err.message });
    return json(401, { error: "verification_failed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "Server missing Supabase env" });
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const now = new Date();
  // v15: compute today's date in America/New_York (LRMB property timezone) so
  // arrivals/checkouts buckets align with how Miami staff think about "today".
  // Returns a YYYY-MM-DD string ready to compare to TRACK's date-only fields.
  const miamiToday = todayInMiami(now);
  const miamiTomorrow = addDaysISO(miamiToday, 1);
  const miamiPlus7 = addDaysISO(miamiToday, 7);
  const miamiPlus8 = addDaysISO(miamiToday, 8);
  const miamiMinus14 = addDaysISO(miamiToday, -14);
  // For "in-house" we still need a UTC timestamp comparison (uses arrival_date
  // and departure_date strings — a guest is in-house if arrival <= today <= departure).
  const startOfToday = new Date(`${miamiToday}T00:00:00-04:00`);
  const endOfToday = new Date(`${miamiTomorrow}T00:00:00-04:00`);

  // v12: fire ALL reads in parallel. Total wait = max(query), not sum(query).
  // v15: capture full responses so a single failing query can be surfaced
  // instead of silently returning empty data.
  const results = await Promise.all([
    supabase.from("units")
      .select("id, unit_code, short_name, track_id, property_id, properties(name)")
      .eq("active", true),
    // v13: use materialized view with pre-extracted JSON fields (200B/row vs 9KB/row).
    // v14: filter at SQL: only reservations relevant to the dashboard date windows
    // (arrival in [today-7d, today+8d] OR departure in [today, today+1d]) -> ~150 rows vs 10k.
    // v15: compare arrival_date/departure_date strings against Miami-local YYYY-MM-DD.
    supabase.from("mv_track_reservations_latest")
      .select("external_id, event_at, event_type, unit_id, arrival_date, departure_date, status, occupants, nights")
      .or(`and(arrival_date.gte.${miamiMinus14},arrival_date.lt.${miamiPlus8}),and(departure_date.gte.${miamiToday},departure_date.lt.${miamiTomorrow})`)
      .limit(2000),
    supabase.from("tasks")
      .select("id, title, status, priority, housekeeping_type, started_at, completed_at, due_at, scheduled_for, unit_id, external_id, updated_at, reservation_id")
      .eq("task_category", "housekeeping").in("status", ["new", "assigned", "in_progress", "completed"])
      .order("updated_at", { ascending: false }).limit(500),
    supabase.from("tasks")
      .select("id, title, status, priority, due_at, completed_at, blocked_reason, unit_id, external_id, updated_at, reservation_id")
      .eq("task_category", "maintenance").in("status", ["new", "assigned", "in_progress", "blocked", "completed"])
      .order("updated_at", { ascending: false }).limit(1500),
    supabase.from("mv_ops_dashboard_kpis").select("*").maybeSingle(),
    supabase.from("v_track_poll_latest").select("*"),
    supabase.from("v_operations_recent_activity").select("*"),
    supabase.from("v_operations_recent_photos").select("*"),
    supabase.from("v_operations_damage_claims").select("*").limit(50),
  ]);

  // v15: surface any query failures instead of silently returning empty data
  const queryNames = ["units", "reservations", "hk_tasks", "maint_tasks", "kpi_mv", "poll_health", "recent_activity", "recent_photos", "damage_claims"];
  const firstError = results.findIndex((r) => r.error);
  if (firstError >= 0) {
    return json(500, {
      error: "db_query_failed",
      query: queryNames[firstError],
      message: results[firstError].error?.message ?? "unknown",
    });
  }
  const [
    { data: unitsRows },
    { data: reservationsRaw },
    { data: hkTasks },
    { data: maintTasks },
    { data: kpiRow },
    { data: health },
    { data: recentActivity },
    { data: recentPhotos },
    { data: damageClaims },
  ] = results;

  // Build unit lookup map: { unit_id (uuid): {unit_code, property_name, track_id}, track_id (int): same }
  const unitsByUuid = new Map<string, Unit>();
  const unitsByTrackId = new Map<number, Unit>();
  for (const u of unitsRows ?? []) {
    const props = (u.properties as { name: string } | { name: string }[] | null);
    const propertyName = Array.isArray(props) ? (props[0]?.name ?? null) : (props?.name ?? null);
    const unit: Unit = {
      id: u.id as string,
      unit_code: (u.unit_code as string) ?? null,
      short_name: (u.short_name as string) ?? null,
      track_id: (u.track_id as number) ?? null,
      property_id: (u.property_id as string) ?? null,
      property_name: propertyName,
    };
    unitsByUuid.set(unit.id, unit);
    if (unit.track_id != null) unitsByTrackId.set(unit.track_id, unit);
  }

  // === Reservations === (already deduped + extracted in mv_track_reservations_latest)
  // v15: bucket by comparing arrival_date / departure_date (YYYY-MM-DD strings)
  // against Miami-local today instead of UTC Date arithmetic.
  const arrivalsToday: ReturnType<typeof toReservationCard>[] = [];
  const inHouse: ReturnType<typeof toReservationCard>[] = [];
  const checkoutsToday: ReturnType<typeof toReservationCard>[] = [];
  const upcoming7d: ReturnType<typeof toReservationCard>[] = [];
  for (const row of reservationsRaw ?? []) {
    const card = toReservationCard(row, unitsByTrackId);
    if (!card) continue;
    const arr = card.arrivalDate;  // "YYYY-MM-DD" string
    const dep = card.departureDate;
    if (arr === miamiToday) arrivalsToday.push(card);
    if (arr && dep && arr <= miamiToday && dep >= miamiTomorrow) inHouse.push(card);
    if (dep === miamiToday) checkoutsToday.push(card);
    if (arr && arr > miamiToday && arr < miamiPlus8) upcoming7d.push(card);
  }

  // === Housekeeping === (data already fetched in Promise.all above)
  const hkCards = (hkTasks ?? []).map((t) => toTaskCard(t, "housekeeping", unitsByUuid));
  const hkScheduledToday = hkCards.filter((t) =>
    (t.dueAt && inDayWindow(t.dueAt, startOfToday, endOfToday)) ||
    (t.startedAt && inDayWindow(t.startedAt, startOfToday, endOfToday)) ||
    (t.scheduledFor && inDayWindow(t.scheduledFor, startOfToday, endOfToday)));
  const hkInProgress = hkCards.filter((t) => t.status === "in_progress");
  const hkPendingVerify = hkCards.filter((t) => t.status === "completed");

  // === Maintenance === (data already fetched in Promise.all above)
  const maintCards = (maintTasks ?? []).map((t) => toTaskCard(t, "maintenance", unitsByUuid));
  const open = maintCards.filter((t) => ["new", "assigned", "in_progress"].includes(t.status));
  const overdue = maintCards.filter((t) => t.dueAt && new Date(t.dueAt) < now && !["completed", "verified"].includes(t.status));
  const blocked = maintCards.filter((t) => t.status === "blocked");
  const maintPendingVerify = maintCards.filter((t) => t.status === "completed");

  // v11: KPI counts from MV (fetched in top Promise.all). 8 count(*) -> 1 row read.
  const kpi = (kpiRow as Record<string, number | string> | null) ?? {};

  const STORAGE_BUCKET = "task-photos";
  const photosWithUrls = await Promise.all((recentPhotos ?? []).map(async (p) => {
    try {
      const { data } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(p.storage_path as string, 3600);
      return { ...p, signed_url: data?.signedUrl ?? null };
    } catch {
      return { ...p, signed_url: null };
    }
  }));

  // v11: trackTaskCount sourced from MV (was a separate count query)
  const trackTaskCount = (kpi.track_mirrored_tasks as number) ?? 0;

  // Property breakdown (for filter dropdown in UI)
  const propertyList = Array.from(new Set(
    [...hkCards, ...maintCards].map((t) => t.propertyName).filter((p): p is string => !!p),
  )).sort();

  // v9: trim per-panel arrays to top N to reduce response size.
  // UI shows max ~30 cards per panel; we send 100 to allow client-side filter.
  const PANEL_LIMIT = 100;
  const trimmedHkScheduledToday = hkScheduledToday.slice(0, PANEL_LIMIT);
  const trimmedHkInProgress = hkInProgress.slice(0, PANEL_LIMIT);
  const trimmedHkPendingVerify = hkPendingVerify.slice(0, PANEL_LIMIT);
  const trimmedOpen = open.slice(0, PANEL_LIMIT);
  const trimmedOverdue = overdue.slice(0, PANEL_LIMIT);
  const trimmedBlocked = blocked.slice(0, PANEL_LIMIT);
  const trimmedMaintPendingVerify = maintPendingVerify.slice(0, PANEL_LIMIT);
  const trimmedArrivalsToday = arrivalsToday.slice(0, PANEL_LIMIT);
  const trimmedInHouse = inHouse.slice(0, PANEL_LIMIT);
  const trimmedCheckoutsToday = checkoutsToday.slice(0, PANEL_LIMIT);
  const trimmedUpcoming7d = upcoming7d.slice(0, PANEL_LIMIT);

  return json(200, {
    viewer,
    generatedAt: new Date().toISOString(),
    windowUTC: { start: startOfToday.toISOString(), end: endOfToday.toISOString() },
    totals: {
      trackMirroredTasks: trackTaskCount ?? 0,
      activeUnits: unitsByUuid.size,
      activeProperties: propertyList.length,
    },
    kpis: {
      hkCompleted: {
        thisWeek: (kpi.hk_completed_this_week as number) ?? 0,
        lastWeek: (kpi.hk_completed_last_week as number) ?? 0,
      },
      maintCompleted: {
        thisWeek: (kpi.maint_completed_this_week as number) ?? 0,
        lastWeek: (kpi.maint_completed_last_week as number) ?? 0,
      },
      hkInProgress: (kpi.hk_in_progress as number) ?? 0,
      maintInProgress: (kpi.maint_in_progress as number) ?? 0,
      maintOverdue: (kpi.maint_overdue as number) ?? 0,
      kpiRefreshedAt: kpi.refreshed_at as string | undefined,
    },
    propertyList,
    // v9: trimmed arrays + total counts for "+ N more" indicator
    reservations: {
      arrivalsToday: trimmedArrivalsToday, arrivalsTodayTotal: arrivalsToday.length,
      inHouse: trimmedInHouse, inHouseTotal: inHouse.length,
      checkoutsToday: trimmedCheckoutsToday, checkoutsTodayTotal: checkoutsToday.length,
      upcoming7d: trimmedUpcoming7d, upcoming7dTotal: upcoming7d.length,
    },
    housekeeping: {
      scheduledToday: trimmedHkScheduledToday, scheduledTodayTotal: hkScheduledToday.length,
      inProgress: trimmedHkInProgress, inProgressTotal: hkInProgress.length,
      completedPendingVerify: trimmedHkPendingVerify, completedPendingVerifyTotal: hkPendingVerify.length,
    },
    maintenance: {
      open: trimmedOpen, openTotal: open.length,
      overdue: trimmedOverdue, overdueTotal: overdue.length,
      blocked: trimmedBlocked, blockedTotal: blocked.length,
      completedPendingVerify: trimmedMaintPendingVerify, completedPendingVerifyTotal: maintPendingVerify.length,
    },
    pollHealth: health ?? [],
    recentActivity: recentActivity ?? [],
    recentPhotos: photosWithUrls,
    damageClaims: {
      total: damageClaims?.length ?? 0,
      overdue: damageClaims?.filter((c) => c.deadline_status === "overdue").length ?? 0,
      urgent: damageClaims?.filter((c) => c.deadline_status === "urgent").length ?? 0,
      approaching: damageClaims?.filter((c) => c.deadline_status === "approaching").length ?? 0,
      items: damageClaims ?? [],
    },
  });
});

function toReservationCard(row: Record<string, unknown>, unitsByTrackId: Map<number, Unit>) {
  if (!row) return null;
  const trackUnitId = (row.unit_id as number | undefined) ?? null;
  const unit = trackUnitId != null ? unitsByTrackId.get(trackUnitId) : null;
  return {
    externalId: row.external_id as string,
    unitId: trackUnitId,
    unitCode: unit?.short_name ?? unit?.unit_code ?? null,
    propertyName: unit?.property_name ?? null,
    arrivalDate: (row.arrival_date as string | undefined) ?? null,
    departureDate: (row.departure_date as string | undefined) ?? null,
    status: (row.status as string | undefined) ?? null,
    occupants: row.occupants ?? null,
    nights: (row.nights as number | undefined) ?? null,
  };
}

function toTaskCard(t: Record<string, unknown>, category: "housekeeping" | "maintenance", unitsByUuid: Map<string, Unit>) {
  const unit = t.unit_id ? unitsByUuid.get(t.unit_id as string) : null;
  return {
    id: t.id as string,
    title: (t.title as string) ?? "",
    status: (t.status as string) ?? "new",
    category,
    priority: (t.priority as string) ?? "medium",
    housekeepingType: (t.housekeeping_type as string | undefined) ?? null,
    unitId: (t.unit_id as string | undefined) ?? null,
    unitCode: unit?.short_name ?? unit?.unit_code ?? null,
    propertyName: unit?.property_name ?? null,
    externalId: (t.external_id as string | undefined) ?? null,
    reservationId: (t.reservation_id as string | undefined) ?? null,
    dueAt: (t.due_at as string | undefined) ?? null,
    startedAt: (t.started_at as string | undefined) ?? null,
    completedAt: (t.completed_at as string | undefined) ?? null,
    scheduledFor: (t.scheduled_for as string | undefined) ?? null,
    blockedReason: (t.blocked_reason as string | undefined) ?? null,
    updatedAt: (t.updated_at as string) ?? new Date().toISOString(),
  };
}

function inDayWindow(iso: string, startUTC: Date, endUTC: Date): boolean {
  const d = new Date(iso);
  return d >= startUTC && d < endUTC;
}

// Returns today's date in America/New_York as "YYYY-MM-DD".
// Uses Intl.DateTimeFormat which handles DST transitions correctly.
function todayInMiami(now: Date): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  return fmt.format(now); // "en-CA" returns YYYY-MM-DD natively
}

function addDaysISO(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  // Date.UTC + setUTCDate handles month/year rollover safely
  const t = Date.UTC(y, m - 1, d) + delta * 86400 * 1000;
  return new Date(t).toISOString().slice(0, 10);
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
