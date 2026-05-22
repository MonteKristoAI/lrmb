// v7 (2026-05-22): major rewrite for dashboard quality
//   - Joins units + properties so every task/reservation shows context
//     (property name + unit code instead of opaque TRACK IDs)
//   - Week-over-week KPIs (cleans completed this week vs last week, etc)
//   - Returns full breakdown by property for filtering on the frontend
//   - Hides internal jargon (TRACK IDs, UUIDs) — surfaces operational language
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
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfToday = new Date(startOfToday.getTime() + 86400 * 1000);
  const in7d = new Date(endOfToday.getTime() + 7 * 86400 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 86400 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400 * 1000);

  // Build unit lookup map: { unit_id (uuid): {unit_code, property_name, track_id}, track_id (int): same }
  const { data: unitsRows } = await supabase
    .from("units")
    .select("id, unit_code, short_name, track_id, property_id, properties(name)")
    .eq("active", true);
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

  // === Reservations ===
  const { data: reservationsRaw } = await supabase.from("reservation_events")
    .select("external_id, event_type, event_at, payload_json, created_at")
    .eq("external_source", "track").order("event_at", { ascending: false }).limit(1500);

  const latestByReservation = new Map<string, { externalId: string; payload: Record<string, unknown>; eventAt: string | null }>();
  for (const ev of reservationsRaw ?? []) {
    if (!latestByReservation.has(ev.external_id as string)) {
      latestByReservation.set(ev.external_id as string, {
        externalId: ev.external_id as string,
        payload: (ev.payload_json as Record<string, unknown>) ?? {},
        eventAt: ev.event_at as string | null,
      });
    }
  }
  const arrivalsToday: ReturnType<typeof toReservationCard>[] = [];
  const inHouse: ReturnType<typeof toReservationCard>[] = [];
  const checkoutsToday: ReturnType<typeof toReservationCard>[] = [];
  const upcoming7d: ReturnType<typeof toReservationCard>[] = [];
  for (const { externalId, payload } of latestByReservation.values()) {
    const card = toReservationCard(externalId, payload, unitsByTrackId);
    if (!card) continue;
    const arr = card.arrivalDate ? new Date(card.arrivalDate) : null;
    const dep = card.departureDate ? new Date(card.departureDate) : null;
    if (arr && arr >= startOfToday && arr < endOfToday) arrivalsToday.push(card);
    if (arr && dep && arr < now && dep > now) inHouse.push(card);
    if (dep && dep >= startOfToday && dep < endOfToday) checkoutsToday.push(card);
    if (arr && arr >= endOfToday && arr < in7d) upcoming7d.push(card);
  }

  // === Housekeeping ===
  const { data: hkTasks } = await supabase.from("tasks")
    .select("id, title, status, priority, housekeeping_type, started_at, completed_at, due_at, scheduled_for, unit_id, external_id, updated_at, reservation_id")
    .eq("task_category", "housekeeping").in("status", ["new", "assigned", "in_progress", "completed"])
    .order("updated_at", { ascending: false }).limit(500);
  const hkCards = (hkTasks ?? []).map((t) => toTaskCard(t, "housekeeping", unitsByUuid));
  const hkScheduledToday = hkCards.filter((t) =>
    (t.dueAt && inDayWindow(t.dueAt, startOfToday, endOfToday)) ||
    (t.startedAt && inDayWindow(t.startedAt, startOfToday, endOfToday)) ||
    (t.scheduledFor && inDayWindow(t.scheduledFor, startOfToday, endOfToday)));
  const hkInProgress = hkCards.filter((t) => t.status === "in_progress");
  const hkPendingVerify = hkCards.filter((t) => t.status === "completed");

  // === Maintenance ===
  const { data: maintTasks } = await supabase.from("tasks")
    .select("id, title, status, priority, due_at, completed_at, blocked_reason, unit_id, external_id, updated_at, reservation_id")
    .eq("task_category", "maintenance").in("status", ["new", "assigned", "in_progress", "blocked", "completed"])
    .order("updated_at", { ascending: false }).limit(1500);
  const maintCards = (maintTasks ?? []).map((t) => toTaskCard(t, "maintenance", unitsByUuid));
  const open = maintCards.filter((t) => ["new", "assigned", "in_progress"].includes(t.status));
  const overdue = maintCards.filter((t) => t.dueAt && new Date(t.dueAt) < now && !["completed", "verified"].includes(t.status));
  const blocked = maintCards.filter((t) => t.status === "blocked");
  const maintPendingVerify = maintCards.filter((t) => t.status === "completed");

  // === Week-over-week KPIs ===
  // Exact counts for KPIs (separate from card slices so volume is accurate)
  const [
    hkInProgressTotal,
    maintInProgressTotal,
    maintOverdueTotal,
    hkCompletedThisWeek,
    hkCompletedLastWeek,
    maintCompletedThisWeek,
    maintCompletedLastWeek,
  ] = await Promise.all([
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "housekeeping").eq("status", "in_progress"),
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "maintenance").eq("status", "in_progress"),
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "maintenance").in("status", ["new", "assigned", "in_progress"])
      .lt("due_at", now.toISOString()),
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "housekeeping").eq("status", "completed")
      .gte("completed_at", weekAgo.toISOString()).lte("completed_at", now.toISOString()),
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "housekeeping").eq("status", "completed")
      .gte("completed_at", twoWeeksAgo.toISOString()).lt("completed_at", weekAgo.toISOString()),
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "maintenance").eq("status", "completed")
      .gte("completed_at", weekAgo.toISOString()).lte("completed_at", now.toISOString()),
    supabase.from("tasks").select("id", { count: "planned", head: true })
      .eq("task_category", "maintenance").eq("status", "completed")
      .gte("completed_at", twoWeeksAgo.toISOString()).lt("completed_at", weekAgo.toISOString()),
  ]);

  const { data: health } = await supabase.from("v_track_poll_latest").select("*");
  const { data: recentActivity } = await supabase.from("v_operations_recent_activity").select("*");
  const { data: recentPhotos } = await supabase.from("v_operations_recent_photos").select("*");
  const { data: damageClaims } = await supabase.from("v_operations_damage_claims").select("*").limit(50);

  const STORAGE_BUCKET = "task-photos";
  const photosWithUrls = await Promise.all((recentPhotos ?? []).map(async (p) => {
    try {
      const { data } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(p.storage_path as string, 3600);
      return { ...p, signed_url: data?.signedUrl ?? null };
    } catch {
      return { ...p, signed_url: null };
    }
  }));

  const { count: trackTaskCount } = await supabase.from("tasks")
    .select("id", { count: "planned", head: true }).eq("external_source", "track");

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
        thisWeek: hkCompletedThisWeek.count ?? 0,
        lastWeek: hkCompletedLastWeek.count ?? 0,
      },
      maintCompleted: {
        thisWeek: maintCompletedThisWeek.count ?? 0,
        lastWeek: maintCompletedLastWeek.count ?? 0,
      },
      hkInProgress: hkInProgressTotal.count ?? 0,
      maintInProgress: maintInProgressTotal.count ?? 0,
      maintOverdue: maintOverdueTotal.count ?? 0,
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

function toReservationCard(externalId: string, payload: Record<string, unknown>, unitsByTrackId: Map<number, Unit>) {
  if (!payload) return null;
  const trackUnitId = (payload.unitId as number | undefined) ?? null;
  const unit = trackUnitId != null ? unitsByTrackId.get(trackUnitId) : null;
  return {
    externalId,
    unitId: trackUnitId,
    unitCode: unit?.short_name ?? unit?.unit_code ?? null,
    propertyName: unit?.property_name ?? null,
    arrivalDate: (payload.arrivalDate as string | undefined) ?? null,
    departureDate: (payload.departureDate as string | undefined) ?? null,
    status: (payload.status as string | undefined) ?? null,
    occupants: (payload.occupants as number | undefined) ?? null,
    nights: (payload.nights as number | undefined) ?? null,
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

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
