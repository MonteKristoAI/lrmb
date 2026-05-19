// Returns aggregated Operations Overview data for the read-only /operations page.
//
// Auth model: HMAC-signed share-link token. NO Supabase session required.
// Token validated against OPS_VIEW_HMAC_SECRET. If the token is missing/expired/forged,
// we return 401 with a typed reason code.
//
// Output shape (all timestamps ISO 8601):
//   {
//     viewer: string | null,
//     generatedAt: string,
//     reservations: {
//       arrivalsToday, inHouse, checkoutsToday, upcoming7d: ReservationCard[]
//     },
//     housekeeping: {
//       scheduledToday, inProgress, completedPendingVerify: TaskCard[]
//     },
//     maintenance: {
//       open, overdue, blocked, completedPendingVerify: TaskCard[]
//     },
//     pollHealth: { collection_name, health, last_run_at, seconds_since_last_run }[]
//   }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyShareToken, ShareLinkError } from "../_shared/share-link.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? url.searchParams.get("token");
  const secret = Deno.env.get("OPS_VIEW_HMAC_SECRET");

  if (!secret) return json(500, { error: "Server missing OPS_VIEW_HMAC_SECRET" });

  let viewer: string | null = null;
  try {
    const payload = await verifyShareToken(token ?? "", secret);
    viewer = payload.viewer ?? null;
  } catch (err) {
    if (err instanceof ShareLinkError) {
      return json(401, { error: err.code, message: err.message });
    }
    return json(401, { error: "verification_failed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "Server missing Supabase env" });
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Daily window in UTC (good enough for v1; tz-aware version can come later)
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfToday = new Date(startOfToday.getTime() + 86400 * 1000);
  const in7d = new Date(endOfToday.getTime() + 7 * 86400 * 1000);

  // === Reservations: arrivals today / in-house / checkouts today / upcoming 7d ===
  // Sourced from reservation_events table (mirrored from TRACK by the polling worker)
  const { data: reservationsRaw } = await supabase
    .from("reservation_events")
    .select("external_id, event_type, event_at, payload_json, created_at")
    .eq("external_source", "track")
    .order("event_at", { ascending: false })
    .limit(1500);

  const latestByReservation = new Map<string, {
    externalId: string;
    payload: Record<string, unknown>;
    eventAt: string | null;
  }>();
  for (const ev of reservationsRaw ?? []) {
    const id = ev.external_id as string;
    if (!latestByReservation.has(id)) {
      latestByReservation.set(id, {
        externalId: id,
        payload: (ev.payload_json as Record<string, unknown>) ?? {},
        eventAt: ev.event_at as string | null,
      });
    }
  }

  const arrivalsToday: ReservationCard[] = [];
  const inHouse: ReservationCard[] = [];
  const checkoutsToday: ReservationCard[] = [];
  const upcoming7d: ReservationCard[] = [];

  for (const { externalId, payload } of latestByReservation.values()) {
    const card = toReservationCard(externalId, payload);
    if (!card) continue;
    const arr = card.arrivalDate ? new Date(card.arrivalDate) : null;
    const dep = card.departureDate ? new Date(card.departureDate) : null;

    if (arr && arr >= startOfToday && arr < endOfToday) arrivalsToday.push(card);
    if (arr && dep && arr < now && dep > now) inHouse.push(card);
    if (dep && dep >= startOfToday && dep < endOfToday) checkoutsToday.push(card);
    if (arr && arr >= endOfToday && arr < in7d) upcoming7d.push(card);
  }

  // === Housekeeping tasks: scheduled today / in progress / completed pending verify ===
  const { data: hkTasks } = await supabase
    .from("tasks")
    .select("id, title, status, started_at, completed_at, due_at, unit_id, external_id, updated_at")
    .eq("task_category", "housekeeping")
    .in("status", ["new", "assigned", "in_progress", "completed"])
    .order("updated_at", { ascending: false })
    .limit(200);

  const hkScheduledToday = (hkTasks ?? []).filter((t) =>
    (t.due_at && inDayWindow(t.due_at, startOfToday, endOfToday)) ||
    (t.started_at && inDayWindow(t.started_at, startOfToday, endOfToday)),
  ).map(toTaskCard);
  const hkInProgress = (hkTasks ?? []).filter((t) => t.status === "in_progress").map(toTaskCard);
  const hkPendingVerify = (hkTasks ?? []).filter((t) => t.status === "completed").map(toTaskCard);

  // === Maintenance: open / overdue / blocked / completed pending verify ===
  const { data: maintTasks } = await supabase
    .from("tasks")
    .select("id, title, status, due_at, completed_at, blocked_reason, unit_id, external_id, updated_at")
    .eq("task_category", "maintenance")
    .in("status", ["new", "assigned", "in_progress", "blocked", "completed"])
    .order("updated_at", { ascending: false })
    .limit(200);

  const open = (maintTasks ?? []).filter((t) => ["new", "assigned", "in_progress"].includes(t.status as string)).map(toTaskCard);
  const overdue = (maintTasks ?? []).filter((t) =>
    t.due_at && new Date(t.due_at as string) < now && !["completed", "verified"].includes(t.status as string),
  ).map(toTaskCard);
  const blocked = (maintTasks ?? []).filter((t) => t.status === "blocked").map(toTaskCard);
  const maintPendingVerify = (maintTasks ?? []).filter((t) => t.status === "completed").map(toTaskCard);

  // === Poll health ===
  const { data: health } = await supabase.from("v_track_poll_latest").select("*");

  return json(200, {
    viewer,
    generatedAt: new Date().toISOString(),
    windowUTC: { start: startOfToday.toISOString(), end: endOfToday.toISOString() },
    reservations: {
      arrivalsToday,
      inHouse,
      checkoutsToday,
      upcoming7d,
    },
    housekeeping: {
      scheduledToday: hkScheduledToday,
      inProgress: hkInProgress,
      completedPendingVerify: hkPendingVerify,
    },
    maintenance: {
      open,
      overdue,
      blocked,
      completedPendingVerify: maintPendingVerify,
    },
    pollHealth: health ?? [],
  });
});

interface ReservationCard {
  externalId: string;
  unitId: number | null;
  arrivalDate: string | null;
  departureDate: string | null;
  status: string | null;
  occupants: number | null;
  nights: number | null;
}

interface TaskCard {
  id: string;
  title: string;
  status: string;
  unitId: string | null;
  externalId: string | null;
  dueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

function toReservationCard(externalId: string, payload: Record<string, unknown>): ReservationCard | null {
  if (!payload) return null;
  return {
    externalId,
    unitId: (payload.unitId as number | undefined) ?? null,
    arrivalDate: (payload.arrivalDate as string | undefined) ?? null,
    departureDate: (payload.departureDate as string | undefined) ?? null,
    status: (payload.status as string | undefined) ?? null,
    occupants: (payload.occupants as number | undefined) ?? null,
    nights: (payload.nights as number | undefined) ?? null,
  };
}

function toTaskCard(t: Record<string, unknown>): TaskCard {
  return {
    id: t.id as string,
    title: (t.title as string) ?? "",
    status: (t.status as string) ?? "new",
    unitId: (t.unit_id as string | undefined) ?? null,
    externalId: (t.external_id as string | undefined) ?? null,
    dueAt: (t.due_at as string | undefined) ?? null,
    startedAt: (t.started_at as string | undefined) ?? null,
    completedAt: (t.completed_at as string | undefined) ?? null,
    updatedAt: (t.updated_at as string) ?? new Date().toISOString(),
  };
}

function inDayWindow(iso: string, startUTC: Date, endUTC: Date): boolean {
  const d = new Date(iso);
  return d >= startUTC && d < endUTC;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
