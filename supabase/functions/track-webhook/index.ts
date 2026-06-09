// TRACK PMS webhook receiver — v11 (2026-06-10) L10 wave 16 fixes.
//
// Changes from v10:
//   - Method gate (only POST).
//   - Body size cap before parse (256KB).
//   - Atomic nonce dedup via webhook_nonces table (INSERT-first, catch
//     unique violation). Was check-then-insert via audit_logs which
//     swallowed failures and let concurrent replays both pass.
//   - reservation_events.payload_json now whitelisted (no guest PII).
//   - All upsert errors checked + surfaced. Function returns 5xx on
//     processing failure so TRACK retries.
//   - Cancellation skip log uses normalized status only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-track-signature",
};

const MAX_BODY_BYTES = 256 * 1024;

// Whitelist applied to reservation_events.payload_json BEFORE persistence
// so the raw TRACK payload (guest name/email/phone/address/total) never
// lands in our DB. Mirrors track-detail's RES_WHITELIST.
const RES_WHITELIST = [
  "id", "checkin", "checkout", "arrivalDate", "departureDate",
  "status", "nights", "adultCount", "childCount", "petCount",
  "channelName", "source", "type",
  "isOwnerBlock", "isHold",
  "updatedAt", "createdAt",
] as const;

function whitelistReservation(raw: unknown): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return safe;
  const obj = raw as Record<string, unknown>;
  for (const k of RES_WHITELIST) {
    if (k in obj) safe[k] = obj[k];
  }
  return safe;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "payload_too_large" }), {
      status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // HMAC FIRST — reject unsigned payloads before parse.
  const expectedSecret = Deno.env.get("TRACK_WEBHOOK_SECRET");
  if (!expectedSecret) {
    await logEvent(supabase, runId, "secret_unconfigured", {}, "error");
    return new Response(JSON.stringify({ error: "webhook_unconfigured" }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const signature = req.headers.get("x-track-signature") ?? req.headers.get("X-Track-Signature") ?? "";
  const sigOk = await verifyHmac(rawBody, signature, expectedSecret);
  if (!sigOk) {
    await logEvent(supabase, runId, "signature_invalid", { headerPresent: !!signature }, "error");
    return new Response(JSON.stringify({ error: "invalid_signature" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    await logEvent(supabase, runId, "parse_error", { rawBodyLength: rawBody.length }, "warning");
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const tsHeader = req.headers.get("x-track-timestamp") ?? req.headers.get("X-Track-Timestamp");
  const nonceHeader = req.headers.get("x-track-nonce") ?? req.headers.get("X-Track-Nonce");
  const replayWindowSec = 300;
  if (tsHeader) {
    const ts = Number(tsHeader);
    const skew = Math.abs(Math.floor(Date.now() / 1000) - ts);
    if (!Number.isFinite(ts) || skew > replayWindowSec) {
      await logEvent(supabase, runId, "timestamp_out_of_window", { ts, skew }, "error");
      return new Response(JSON.stringify({ error: "timestamp_out_of_window" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // v11: atomic nonce dedup via webhook_nonces unique constraint.
  // INSERT first; catch 23505 unique_violation → 409.
  if (nonceHeader) {
    const { error: nonceErr } = await supabase.from("webhook_nonces").insert({
      nonce: nonceHeader,
      source: "track",
    });
    if (nonceErr) {
      if ((nonceErr as { code?: string }).code === "23505") {
        await logEvent(supabase, runId, "replay_detected", { nonce: nonceHeader }, "warning");
        return new Response(JSON.stringify({ error: "replay_detected" }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("webhook_nonces insert failed", nonceErr);
      await logEvent(supabase, runId, "nonce_persist_failed", { code: (nonceErr as { code?: string }).code }, "error");
      return new Response(JSON.stringify({ error: "internal" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const event = String(body.event ?? body.type ?? body.eventType ?? "").toLowerCase();
  const data = (body.data ?? body.payload ?? body) as Record<string, unknown>;
  const entityId = (data?.id ?? body?.id) as number | string | undefined;

  let routed = false;
  let processingFailed = false;

  try {
    if (event.includes("reservation") && entityId) {
      // v11: whitelist payload_json before persistence.
      const safePayload = whitelistReservation(data);
      const { error: resErr } = await supabase.from("reservation_events").upsert(
        {
          external_source: "track",
          external_id: String(entityId),
          event_type: "sync",
          event_at: (body.timestamp as string) ?? new Date().toISOString(),
          payload_json: safePayload,
        },
        { onConflict: "external_source,external_id,event_type,event_at", ignoreDuplicates: true },
      );
      if (resErr) {
        processingFailed = true;
        await logEvent(supabase, runId, "reservation_upsert_failed", { code: (resErr as { code?: string }).code, entityId }, "error");
      } else {
        routed = true;
      }
    }

    if (!processingFailed && (event.includes("workorder") || event.includes("work_order") || event.includes("work-order")) && entityId) {
      const category = event.includes("maintenance") ? "maintenance" : "housekeeping";
      const trackUnitId = data?.unitId as number | undefined;
      if (trackUnitId) {
        const { data: unit, error: unitErr } = await supabase
          .from("units")
          .select("id, property_id")
          .eq("track_id", trackUnitId)
          .maybeSingle();
        if (unitErr) {
          processingFailed = true;
          await logEvent(supabase, runId, "unit_lookup_failed", { code: (unitErr as { code?: string }).code, trackUnitId }, "error");
        } else if (unit) {
          const rawStatus = String(data?.status ?? "").toLowerCase();
          const status = mapStatus(rawStatus);
          if (status === null) {
            // v11: log normalized status only (no raw free-form text).
            await logEvent(supabase, runId, "event_skipped_cancellation", { event, entityId, normalizedStatus: "cancelled" }, "info");
            return ok({ ok: true, runId, event, entityId, routed: true, skipped: "cancellation" });
          }
          const nowIso = new Date().toISOString();
          const startedAt = ["in_progress", "completed", "verified", "processed"].includes(status)
            ? ((data?.dateStarted as string | undefined) ?? (data?.scheduledAt as string | undefined) ?? nowIso)
            : ((data?.dateStarted as string | undefined) ?? null);
          const completedAt = ["completed", "verified", "processed"].includes(status)
            ? ((data?.completedAt as string | undefined) ?? (data?.dateCompleted as string | undefined) ?? startedAt ?? nowIso)
            : ((data?.completedAt as string | undefined) ?? null);
          const { error: taskErr } = await supabase.from("tasks").upsert(
            {
              external_source: "track",
              external_id: String(entityId),
              source_type: "travelnet",
              task_category: category,
              task_type: category === "housekeeping" ? "checkout_turnover" : "maintenance",
              unit_id: unit.id,
              property_id: unit.property_id,
              status,
              started_at: startedAt,
              completed_at: completedAt,
              updated_at: nowIso,
              requires_photo: true,
              requires_note: true,
              requires_timestamp: true,
            },
            { onConflict: "external_source,external_id", ignoreDuplicates: false },
          );
          if (taskErr) {
            processingFailed = true;
            await logEvent(supabase, runId, "task_upsert_failed", { code: (taskErr as { code?: string }).code, entityId }, "error");
          } else {
            routed = true;
          }
        }
      }
    }

    await logEvent(
      supabase, runId, "event_received",
      {
        event,
        entityId,
        routed,
        rawBodyLength: rawBody.length,
        elapsedMs: Date.now() - startedAt,
        nonce: nonceHeader ?? null,
        ts: tsHeader ?? null,
      },
      processingFailed ? "error" : (routed ? "info" : "warning"),
    );
  } catch (err) {
    processingFailed = true;
    console.error("track-webhook processing_error", err);
    await logEvent(supabase, runId, "processing_error", {
      event,
      entityId,
      errorName: err instanceof Error ? err.name : "unknown",
      errorMessage: (err instanceof Error ? err.message : String(err)).slice(0, 200),
    }, "error");
  }

  // v11: 5xx on processing failure so TRACK retries.
  if (processingFailed) {
    return new Response(JSON.stringify({ runId, error: "processing_failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return ok({ runId, routed, event });
});

async function logEvent(
  supabase: ReturnType<typeof createClient>,
  runId: string,
  action: string,
  meta: Record<string, unknown>,
  severity: "info" | "warning" | "error",
): Promise<void> {
  try {
    await supabase.from("audit_logs").insert({
      action: `track_webhook_${action}`,
      entity_type: "edge_function",
      entity_id: runId,
      description: `track-webhook: ${action}`,
      payload_json: { ...meta, severity, runId },
    });
  } catch { /* swallow */ }
}

async function verifyHmac(body: string, signature: string, secret: string): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const variants = [
    hexDecode(signature),
    base64Decode(signature.replace(/^sha256=/, "")),
  ].filter((v) => v !== null) as Uint8Array[];
  for (const sigBytes of variants) {
    const ok = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(body));
    if (ok) return true;
  }
  return false;
}

function hexDecode(s: string): Uint8Array | null {
  const clean = s.replace(/^sha256=/, "");
  if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0) return null;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function base64Decode(s: string): Uint8Array | null {
  try {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

const RE_CANCEL  = /(?<![a-z])(?<!un)(?:cancel|void|archive|reject)/;
const RE_BLOCK   = /(?<![a-z])(?<!un)(?:block|hold|exception)/;
const RE_STARTED = /(?<![a-z])(?<!re)(?:started|inprogress|in_progress|in-progress)/;

function mapStatus(s: string): string | null {
  if (!s) return "new";
  const t = s.toLowerCase();
  const normalized = t.replace(/[-_]/g, "");
  if (RE_CANCEL.test(t)) return null;
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  if (t.includes("vendor") && t.includes("not") && t.includes("start")) return "vendor_not_started";
  if (normalized.includes("notstarted")) return "vendor_not_started";
  if (RE_STARTED.test(t)) return "in_progress";
  if (t.includes("assign")) return "assigned";
  if (RE_BLOCK.test(t)) return "blocked";
  if (t.includes("wait")) return "waiting_parts";
  return "new";
}

function ok(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
