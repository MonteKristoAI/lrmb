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
  let payload: TokenPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64UrlDecode(payloadB64)));
  } catch {
    throw new ShareLinkError("bad_format", "payload not json");
  }
  if (payload.v !== 1 && payload.v !== 2) {
    throw new ShareLinkError("unsupported_version", `v=${(payload as { v: unknown }).v}`);
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.iat > now + 60) throw new ShareLinkError("future_iat", "iat in future");
  if (payload.exp <= now) throw new ShareLinkError("expired", "expired");

  if (payload.v === 2) {
    if (!payload.aud || !payload.jti) throw new ShareLinkError("bad_format", "v2 missing aud/jti");
    if (payload.aud !== "ops_detail" && payload.aud !== "ops_full" && payload.aud !== "ops_overview") {
      throw new ShareLinkError("wrong_audience", `aud=${payload.aud}`);
    }
    if (isRevoked && (await isRevoked(payload.jti))) {
      throw new ShareLinkError("revoked", "token revoked");
    }
  }
  return payload;
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
        .from("task_photos")
        .select("id, storage_path, photo_type, photo_subtype, caption, created_at, uploaded_by, track_attachment_id, track_synced_at")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false }),
      supabase
        .from("audit_logs")
        .select("id, action, actor_name, actor_id, payload_json, description, created_at")
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
    const photos = await Promise.all((photosRes.data ?? []).map(async (p) => {
      try {
        const { data } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(p.storage_path as string, 3600);
        return { ...p, signed_url: data?.signedUrl ?? null };
      } catch {
        return { ...p, signed_url: null };
      }
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
        linkedReservation = resData.payload_json as Record<string, unknown>;
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
        .order("event_at", { ascending: false }),
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

    return json(200, {
      reservation: resRes.data[0].payload_json,
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
