// TRACK PMS webhook receiver (real-time event ingest).
//
// Activation: TRACK does not expose webhook subscription via public API
// (verified 2026-05-22 — /api/webhooks, /api/subscriptions all 404). When Emma
// gets TRACK Support to enable webhooks for the LRMB tenant, they'll register
// this URL as the target:
//   https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-webhook
//
// Until then this fn is dormant — no incoming traffic, no harm.
//
// Once active, replaces the 5-min poll cadence with sub-second event push.
// The track-poll cron stays as a safety-net for missed events.
//
// Expected payload shape (best-effort — TRACK hasn't published a schema):
//   {
//     "event": "reservation.checkout" | "workOrder.statusChanged" | ...
//     "timestamp": "2026-05-22T...",
//     "data": { "id": 123, ... }
//   }
//
// We accept ANY shape and try to extract entity_type + id. Unknown shapes are
// logged + returned 200 (TRACK retries on non-200).
//
// Security: optional HMAC signature header validation via TRACK_WEBHOOK_SECRET
// env var. When unset, accepts all (open during Emma's TRACK Support setup).
// Set TRACK_WEBHOOK_SECRET as Supabase secret once TRACK gives us the signing key.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-track-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Read raw body for signature validation + parsing
  const rawBody = await req.text();
  let body: Record<string, unknown> = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    // log + 200; TRACK shouldn't retry malformed
    await logEvent(supabase, runId, "parse_error", { rawBodyLength: rawBody.length }, "warning");
    return ok({ runId, error: "invalid_json" });
  }

  // QA P0 Q-SEC-3: mandatory HMAC signature check. Previously this accepted ALL
  // requests when TRACK_WEBHOOK_SECRET was unset — anyone could forge events and
  // write arbitrary reservation_events + tasks via service role. Now fail closed:
  // if the secret isn't configured, reject with 503 instead of accepting forgeries.
  const expectedSecret = Deno.env.get("TRACK_WEBHOOK_SECRET");
  if (!expectedSecret) {
    await logEvent(supabase, runId, "secret_unconfigured", {}, "error");
    return new Response(
      JSON.stringify({ error: "webhook_unconfigured", message: "Webhook not yet configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const signature = req.headers.get("x-track-signature") ?? req.headers.get("X-Track-Signature") ?? "";
  const sigOk = await verifyHmac(rawBody, signature, expectedSecret);
  if (!sigOk) {
    await logEvent(supabase, runId, "signature_invalid", { headerPresent: !!signature }, "error");
    return new Response(
      JSON.stringify({ error: "invalid_signature" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // QA P0 Q-SEC-4 (followup): timestamp window + replay nonce.
  // TRACK is expected to send `x-track-timestamp` (unix seconds) and
  // `x-track-nonce` (uuid). Without window+nonce the HMAC signature alone is
  // replayable indefinitely. Window: ±5 minutes. Nonce dedup TTL: 24h via
  // audit_logs lookup on the same nonce string.
  const tsHeader = req.headers.get("x-track-timestamp") ?? req.headers.get("X-Track-Timestamp");
  const nonceHeader = req.headers.get("x-track-nonce") ?? req.headers.get("X-Track-Nonce");
  // Soft enforcement: when TRACK hasn't published the spec yet we warn but
  // accept. Once Emma confirms TRACK sends both headers, change accept to reject.
  const replayWindowSec = 300;
  if (tsHeader) {
    const ts = Number(tsHeader);
    const skew = Math.abs(Math.floor(Date.now() / 1000) - ts);
    if (!Number.isFinite(ts) || skew > replayWindowSec) {
      await logEvent(supabase, runId, "timestamp_out_of_window", { ts, skew }, "error");
      return new Response(
        JSON.stringify({ error: "timestamp_out_of_window" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }
  if (nonceHeader) {
    // Replay check: have we seen this nonce in the last 24h?
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("audit_logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "track_webhook_event_received")
      .gte("created_at", since)
      .filter("payload_json->>nonce", "eq", nonceHeader);
    if ((count ?? 0) > 0) {
      await logEvent(supabase, runId, "replay_detected", { nonce: nonceHeader }, "warning");
      return new Response(
        JSON.stringify({ error: "replay_detected" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  // Route by event type + entity
  const event = String(body.event ?? body.type ?? body.eventType ?? "").toLowerCase();
  const data = (body.data ?? body.payload ?? body) as Record<string, unknown>;
  const entityId = (data?.id ?? body?.id) as number | string | undefined;

  let routed = false;

  try {
    // Reservation lifecycle events → reservation_events (sync only, no checkout
    // event_type because trg_reservation_event_to_housekeeping would create dups)
    if (event.includes("reservation") && entityId) {
      await supabase.from("reservation_events").upsert(
        {
          external_source: "track",
          external_id: String(entityId),
          event_type: "sync",
          event_at: (body.timestamp as string) ?? new Date().toISOString(),
          payload_json: data,
        },
        { onConflict: "external_source,external_id,event_type,event_at", ignoreDuplicates: true },
      );
      routed = true;
    }

    // Work order events → tasks upsert
    if ((event.includes("workorder") || event.includes("work_order") || event.includes("work-order")) && entityId) {
      const category = event.includes("maintenance") ? "maintenance" : "housekeeping";
      const trackUnitId = data?.unitId as number | undefined;
      if (trackUnitId) {
        const { data: unit } = await supabase
          .from("units")
          .select("id, property_id")
          .eq("track_id", trackUnitId)
          .maybeSingle();
        if (unit) {
          const status = mapStatus(String(data?.status ?? "").toLowerCase());
          const nowIso = new Date().toISOString();
          // Same defensive timestamp backfill as track-poll so a terminal
          // status from TRACK never violates the CHECK constraint.
          const startedAt = ["in_progress", "completed", "verified", "processed"].includes(status)
            ? ((data?.dateStarted as string | undefined) ?? (data?.scheduledAt as string | undefined) ?? nowIso)
            : ((data?.dateStarted as string | undefined) ?? null);
          const completedAt = ["completed", "verified", "processed"].includes(status)
            ? ((data?.completedAt as string | undefined) ?? (data?.dateCompleted as string | undefined) ?? startedAt ?? nowIso)
            : ((data?.completedAt as string | undefined) ?? null);
          await supabase.from("tasks").upsert(
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
          routed = true;
        }
      }
    }

    await logEvent(
      supabase,
      runId,
      "event_received",
      {
        event,
        entityId,
        routed,
        rawBodyLength: rawBody.length,
        elapsedMs: Date.now() - startedAt,
        nonce: nonceHeader ?? null,
        ts: tsHeader ?? null,
      },
      routed ? "info" : "warning",
    );
  } catch (err) {
    console.error("track-webhook processing_error", err);
    await logEvent(
      supabase,
      runId,
      "processing_error",
      {
        event,
        entityId,
        error: err instanceof Error ? err.message : String(err),
      },
      "error",
    );
  }

  // Always return 200 — TRACK retries on non-200, and we've already logged
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
  } catch {
    // swallow — webhook receiver must not fail on logging issues
  }
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
  // Try both hex + base64 representations of the signature
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

function mapStatus(s: string): string {
  // See track-poll/index.ts mapTrackStatus for full TRACK status enum.
  if (!s) return "new";
  const t = s.toLowerCase();
  const normalized = t.replace(/[-_]/g, "");
  if (t.includes("cancel") || t.includes("void") || t.includes("archive") || t.includes("reject")) return "completed";
  if (t.includes("processed")) return "processed";
  if (t.includes("verify")) return "verified";
  if (t.includes("complete")) return "completed";
  if (normalized.includes("inprogress") || t.includes("started")) return "in_progress";
  if (t.includes("assign")) return "assigned";
  if (t.includes("vendor") && t.includes("not") && t.includes("start")) return "vendor_not_started";
  if (t.includes("exception") || t.includes("hold") || t.includes("block")) return "blocked";
  if (t.includes("wait")) return "waiting_parts";
  return "new";
}

function ok(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
