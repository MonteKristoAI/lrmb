// v2/v3: adds totals + recentActivity + recentPhotos sections.
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

function b64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
    const card = toReservationCard(externalId, payload);
    if (!card) continue;
    const arr = card.arrivalDate ? new Date(card.arrivalDate) : null;
    const dep = card.departureDate ? new Date(card.departureDate) : null;
    if (arr && arr >= startOfToday && arr < endOfToday) arrivalsToday.push(card);
    if (arr && dep && arr < now && dep > now) inHouse.push(card);
    if (dep && dep >= startOfToday && dep < endOfToday) checkoutsToday.push(card);
    if (arr && arr >= endOfToday && arr < in7d) upcoming7d.push(card);
  }

  const { data: hkTasks } = await supabase.from("tasks")
    .select("id, title, status, started_at, completed_at, due_at, unit_id, external_id, updated_at")
    .eq("task_category", "housekeeping").in("status", ["new", "assigned", "in_progress", "completed"])
    .order("updated_at", { ascending: false }).limit(200);
  const hkScheduledToday = (hkTasks ?? []).filter((t) =>
    (t.due_at && inDayWindow(t.due_at as string, startOfToday, endOfToday)) ||
    (t.started_at && inDayWindow(t.started_at as string, startOfToday, endOfToday))).map(toTaskCard);
  const hkInProgress = (hkTasks ?? []).filter((t) => t.status === "in_progress").map(toTaskCard);
  const hkPendingVerify = (hkTasks ?? []).filter((t) => t.status === "completed").map(toTaskCard);

  const { data: maintTasks } = await supabase.from("tasks")
    .select("id, title, status, due_at, completed_at, blocked_reason, unit_id, external_id, updated_at")
    .eq("task_category", "maintenance").in("status", ["new", "assigned", "in_progress", "blocked", "completed"])
    .order("updated_at", { ascending: false }).limit(200);
  const open = (maintTasks ?? []).filter((t) => ["new", "assigned", "in_progress"].includes(t.status as string)).map(toTaskCard);
  const overdue = (maintTasks ?? []).filter((t) => t.due_at && new Date(t.due_at as string) < now && !["completed", "verified"].includes(t.status as string)).map(toTaskCard);
  const blocked = (maintTasks ?? []).filter((t) => t.status === "blocked").map(toTaskCard);
  const maintPendingVerify = (maintTasks ?? []).filter((t) => t.status === "completed").map(toTaskCard);

  const { data: health } = await supabase.from("v_track_poll_latest").select("*");
  const { data: recentActivity } = await supabase.from("v_operations_recent_activity").select("*");
  const { data: recentPhotos } = await supabase.from("v_operations_recent_photos").select("*");

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
    .select("id", { count: "exact", head: true }).eq("external_source", "track");
  const { count: photoCount } = await supabase.from("task_photos")
    .select("id", { count: "exact", head: true });

  return json(200, {
    viewer,
    generatedAt: new Date().toISOString(),
    windowUTC: { start: startOfToday.toISOString(), end: endOfToday.toISOString() },
    totals: { trackMirroredTasks: trackTaskCount ?? 0, photosUploaded: photoCount ?? 0 },
    reservations: { arrivalsToday, inHouse, checkoutsToday, upcoming7d },
    housekeeping: { scheduledToday: hkScheduledToday, inProgress: hkInProgress, completedPendingVerify: hkPendingVerify },
    maintenance: { open, overdue, blocked, completedPendingVerify: maintPendingVerify },
    pollHealth: health ?? [],
    recentActivity: recentActivity ?? [],
    recentPhotos: photosWithUrls,
  });
});

function toReservationCard(externalId: string, payload: Record<string, unknown>) {
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
function toTaskCard(t: Record<string, unknown>) {
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
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
