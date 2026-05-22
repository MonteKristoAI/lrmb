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

  // Optional HMAC signature check (TRACK_WEBHOOK_SECRET set = enforce)
  const expectedSecret = Deno.env.get("TRACK_WEBHOOK_SECRET");
  if (expectedSecret) {
    const signature = req.headers.get("x-track-signature") ?? req.headers.get("X-Track-Signature") ?? "";
    const ok = await verifyHmac(rawBody, signature, expectedSecret);
    if (!ok) {
      await logEvent(supabase, runId, "signature_invalid", { headerPresent: !!signature }, "error");
      return new Response(JSON.stringify({ error: "invalid_signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
          await supabase.from("tasks").upsert(
            {
              external_source: "track",
              external_id: String(entityId),
              source_type: "travelnet",
              task_category: category,
              task_type: category === "housekeeping" ? "checkout_turnover" : "maintenance",
              unit_id: unit.id,
              property_id: unit.property_id,
              status: mapStatus(String(data?.status ?? "").toLowerCase()),
              updated_at: new Date().toISOString(),
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
      },
      routed ? "info" : "warning",
    );
  } catch (err) {
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
  if (!s) return "new";
  if (
    s.includes("complete") || s.includes("processed") || s.includes("verify") ||
    s.includes("verified") || s.includes("done") || s.includes("closed")
  ) return "completed";
  if (s.includes("inprogress") || s.includes("in_progress") || s.includes("started")) return "in_progress";
  if (s.includes("assign")) return "assigned";
  if (s.includes("hold") || s.includes("block")) return "blocked";
  if (s.includes("wait")) return "waiting_parts";
  return "new";
}

function ok(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
