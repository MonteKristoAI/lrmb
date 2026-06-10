// Detail endpoint for drill-down modals.
// Accepts ?id=<task_uuid> for task detail OR ?reservation=<track_id> for reservation detail.
// Auth: same HMAC share-link token as track-overview-data.

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
// QA P1 Q-SEC-16: accept v1 (legacy) AND v2 (scoped + revokable).
// v2 tokens must carry aud="ops_detail" or "ops_full". v1 tokens accepted
// for backward compatibility until they expire naturally.
type TokenPayload =
  | { v: 1; iat: number; exp: number; viewer?: string }
  | { v: 2; iat: number; exp: number; viewer?: string; aud: string; jti: string };

async function verifyShareToken(
  token: string,
  secret: string,
  isRevoked?: (jti: string) => Promise<boolean>,
): Promise<TokenPayload> {
  if (!secret) throw new ShareLinkError("missing_secret", "no secret");
  if (!token) throw new ShareLinkError("missing_token", "no token");
  const parts = token.split(".");
  if (parts.length !== 2) throw new ShareLinkError("bad_format", "bad format");
  const [payloadB64, sigB64] = parts;
  const key = await importKey(secret);
  const sig = b64UrlDecode(sigB64);
  const ok = await crypto.subtle.verify("HMAC", key, sig, TEXT.encode(payloadB64));
  if (!ok) throw new ShareLinkError("bad_signature", "sig mismatch");
  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(new TextDecoder().decode(b64UrlDecode(payloadB64)));
  } catch {
    throw new ShareLinkError("bad_format", "payload not json");
  }
  // L10 wave 17 (2026-06-10): runtime typecheck. Even with a valid HMAC
  // signature an attacker who somehow got the secret could craft a
  // payload with string-coerced numerics, null fields, array claims, etc.
  // Validate every field's type before time/aud checks.
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    throw new ShareLinkError("bad_format", "payload not object");
  }
  const obj = rawPayload as Record<string, unknown>;
  if (obj.v !== 1 && obj.v !== 2) {
    throw new ShareLinkError("unsupported_version", `v=${String(obj.v)}`);
  }
  if (typeof obj.iat !== "number" || typeof obj.exp !== "number") {
    throw new ShareLinkError("bad_format", "iat/exp must be numbers");
  }
  const now = Math.floor(Date.now() / 1000);
  if (obj.iat > now + 60) throw new ShareLinkError("future_iat", "iat in future");
  if (obj.exp <= now) throw new ShareLinkError("expired", "expired");

  if (obj.v === 2) {
    if (typeof obj.aud !== "string" || typeof obj.jti !== "string") {
      throw new ShareLinkError("bad_format", "v2 aud/jti must be strings");
    }
    if (obj.aud !== "ops_detail" && obj.aud !== "ops_full") {
      throw new ShareLinkError("wrong_audience", `aud=${obj.aud}`);
    }
    if (isRevoked && (await isRevoked(obj.jti))) {
      throw new ShareLinkError("revoked", "token revoked");
    }
  }
  return obj as unknown as TokenPayload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? url.searchParams.get("token");
  const secret = Deno.env.get("OPS_VIEW_HMAC_SECRET");
  if (!secret) return json(500, { error: "Server missing OPS_VIEW_HMAC_SECRET" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "Server missing Supabase env" });
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const isRevoked = async (jti: string): Promise<boolean> => {
    const { data } = await supabase.rpc("has_revoked_share_token", { p_jti: jti });
    return Boolean(data);
  };

  try {
    await verifyShareToken(token ?? "", secret, isRevoked);
  } catch (err) {
    if (err instanceof ShareLinkError) return json(401, { error: err.code, message: err.message });
    return json(401, { error: "verification_failed" });
  }

  const taskId = url.searchParams.get("id");
  const reservationId = url.searchParams.get("reservation");
  if (!taskId && !reservationId) {
    return json(400, { error: "missing_param", message: "Provide ?id=<task_uuid> or ?reservation=<track_id>" });
  }

  // QA P0 Q-SEC-20: validate UUID format BEFORE the DB call. Previously a malformed
  // id (path traversal probe, 10K char garbage, SQL-ish input) caused the DB to
  // return its internal error verbatim, leaking column type info to the caller.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (taskId && !UUID_RE.test(taskId)) {
    return json(400, { error: "invalid_id_format", message: "id must be a UUID" });
  }
  // Reservation IDs from TRACK are numeric strings ("322890"). Accept digits only.
  if (reservationId && !/^\d+$/.test(reservationId)) {
    return json(400, { error: "invalid_reservation_format", message: "reservation must be numeric" });
  }

  if (taskId) {
    // Task detail
    const [taskRes, photosRes, activityRes] = await Promise.all([
      supabase
        .from("tasks")
        .select(`
          id, title, description, status, priority, task_category, housekeeping_type, task_type,
          external_source, external_id, reservation_id, blocked_reason,
          due_at, scheduled_for, started_at, completed_at, processed_at, updated_at, created_at,
          requires_photo, requires_note, requires_timestamp,
          damage_classification, claim_status, claim_filed_amount, claim_approved_amount,
          claim_id, claim_provider, claim_filed_at, claim_decided_at, claim_deadline_at,
          unit_id, property_id,
          units!tasks_unit_id_fkey(unit_code, short_name, track_id),
          properties!tasks_property_id_fkey(name, address)
        `)
        .eq("id", taskId)
        .maybeSingle(),
      supabase
        // v13 (2026-06-10) L10 wave 16: drop uploaded_by + storage_path
        // from the share-link response. uploaded_by is an internal user
        // UUID a vendor share-link viewer should never see; storage_path
        // is a server-only key we re-sign into signed_url anyway.
        .from("task_photos")
        .select("id, photo_type, photo_subtype, caption, created_at, track_attachment_id, track_synced_at, storage_path")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false })
        .limit(100),
      // L10 EF-28 (2026-05-29): drop `payload_json` from the select. Whatever
      // any future writer dumps into payload_json (service_role context,
      // user emails, internal IDs) used to land in the share-link viewer's
      // response. Limit to display fields only.
      supabase
        // v13: drop actor_id (internal UUID). Keep actor_name only.
        .from("audit_logs")
        .select("id, action, actor_name, description, created_at")
        .eq("entity_type", "tasks")
        .eq("entity_id", taskId)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    // QA P2 Q-SEC-21..27: don't leak raw DB error messages to clients. Log
    // server-side, return generic message to caller.
    if (taskRes.error) {
      console.error("track-detail task query failed", taskRes.error);
      return json(500, { error: "db_query_failed", query: "task" });
    }
    if (!taskRes.data) return json(404, { error: "task_not_found" });
    if (photosRes.error) {
      console.error("track-detail photos query failed", photosRes.error);
      return json(500, { error: "db_query_failed", query: "photos" });
    }
    if (activityRes.error) {
      console.error("track-detail activity query failed", activityRes.error);
      return json(500, { error: "db_query_failed", query: "activity" });
    }

    // Sign photo URLs
    const STORAGE_BUCKET = "task-photos";
    // v13: strip storage_path BEFORE returning. We use it only to sign
    // the URL server-side; the share-link viewer never needs the raw key.
    const photos = await Promise.all((photosRes.data ?? []).map(async (p) => {
      const storagePath = (p as { storage_path?: string }).storage_path ?? "";
      let signedUrl: string | null = null;
      try {
        const { data } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(storagePath, 3600);
        signedUrl = data?.signedUrl ?? null;
      } catch { /* swallow; return null URL */ }
      // Drop storage_path before returning.
      const { storage_path: _drop, ...rest } = p as Record<string, unknown>;
      void _drop;
      return { ...rest, signed_url: signedUrl };
    }));

    // Linked reservation (if any)
    let linkedReservation: Record<string, unknown> | null = null;
    if (taskRes.data.reservation_id) {
      const { data: resData } = await supabase
        .from("reservation_events")
        .select("payload_json, event_at")
        .eq("external_source", "track")
        .eq("external_id", String(taskRes.data.reservation_id))
        .order("event_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (resData) {
        // L10 EF-28 (2026-05-29): whitelist non-PII fields from the
        // TRACK reservation payload. Before, we dumped the full
        // payload_json which includes guest name + email + phone +
        // address + total_amount — exposing them to vendor share-link
        // holders. Show stay logistics only.
        const raw = (resData.payload_json ?? {}) as Record<string, unknown>;
        const RES_WHITELIST = [
          "id", "checkin", "checkout", "arrivalDate", "departureDate",
          "status", "nights", "adultCount", "childCount", "petCount",
          "channelName", "source", "type",
          "isOwnerBlock", "isHold",
          "updatedAt", "createdAt",
        ] as const;
        linkedReservation = {};
        for (const k of RES_WHITELIST) {
          if (k in raw) (linkedReservation as Record<string, unknown>)[k] = raw[k];
        }
        (linkedReservation as Record<string, unknown>).eventAt = resData.event_at;
      }
    }

    return json(200, {
      task: taskRes.data,
      photos,
      activity: activityRes.data ?? [],
      linkedReservation,
    });
  }

  // Reservation detail
  if (reservationId) {
    const [resRes, tasksRes] = await Promise.all([
      supabase
        .from("reservation_events")
        .select("payload_json, event_at, event_type, created_at")
        .eq("external_source", "track")
        .eq("external_id", reservationId)
        .order("event_at", { ascending: false })
        .limit(50),
      supabase
        .from("tasks")
        .select(`
          id, title, status, priority, task_category, housekeeping_type, task_type, external_id,
          description, due_at, scheduled_for, started_at, completed_at, updated_at,
          units!tasks_unit_id_fkey(unit_code, short_name),
          properties!tasks_property_id_fkey(name)
        `)
        .eq("reservation_id", reservationId)
        .order("updated_at", { ascending: false }),
    ]);

    // Distinguish DB failure (500) from "reservation not in our cache" (404)
    if (resRes.error) {
      console.error("track-detail reservation_events query failed", resRes.error);
      return json(500, { error: "db_query_failed", query: "reservation_events" });
    }
    if (tasksRes.error) {
      console.error("track-detail linked_tasks query failed", tasksRes.error);
      return json(500, { error: "db_query_failed", query: "linked_tasks" });
    }
    if (!resRes.data || resRes.data.length === 0) {
      return json(404, { error: "reservation_not_found" });
    }

    // L10 EF-29 (2026-06-09): mirror the task-link branch whitelist on the
    // reservation-detail branch too. Previously this returned the raw
    // payload_json which carries guest PII (name, email, phone, address,
    // total_amount) — exposed to vendor share-link holders + admin
    // dashboards alike. Show stay logistics only.
    const rawReservation = (resRes.data[0].payload_json ?? {}) as Record<string, unknown>;
    const RES_WHITELIST = [
      "id", "checkin", "checkout", "arrivalDate", "departureDate",
      "status", "nights", "adultCount", "childCount", "petCount",
      "channelName", "source", "type",
      "isOwnerBlock", "isHold",
      "updatedAt", "createdAt",
    ] as const;
    const reservationSafe: Record<string, unknown> = {};
    for (const k of RES_WHITELIST) {
      if (k in rawReservation) reservationSafe[k] = rawReservation[k];
    }
    return json(200, {
      reservation: reservationSafe,
      eventHistory: resRes.data.map((r) => ({
        eventType: r.event_type,
        eventAt: r.event_at,
        createdAt: r.created_at,
      })),
      linkedTasks: tasksRes.data ?? [],
    });
  }

  return json(400, { error: "invalid_request" });
});

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
