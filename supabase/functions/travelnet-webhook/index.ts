import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function buildCorsHeaders(origin: string | null) {
  const allowedOrigin = Deno.env.get("TRAVELNET_ALLOWED_ORIGIN");
  const accessControlAllowOrigin = allowedOrigin && origin === allowedOrigin ? allowedOrigin : "null";

  return {
    "Access-Control-Allow-Origin": accessControlAllowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
    "Vary": "Origin",
  };
}

type TravelNetPayload = {
  event_type?: string;
  external_id?: string;
  reservation_id?: string;
  event_at?: string;
  property_id?: string;
  unit_id?: string;
  property_track_id?: number | string;
  unit_track_id?: number | string;
  payload?: Record<string, unknown>;
};

function toIsoDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// QA P1 Q-SEC-18: constant-time secret comparison. Previously used `!==` which
// returned in the first mismatching character — an attacker can deduce the
// secret one byte at a time by measuring response latency.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still run the loop on a same-length zero buffer so the early-return
    // path doesn't leak whether length matched.
    const filler = "0".repeat(a.length);
    let dummy = 0;
    for (let i = 0; i < a.length; i++) dummy |= a.charCodeAt(i) ^ filler.charCodeAt(i);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const expectedSecret = Deno.env.get("TRAVELNET_WEBHOOK_SECRET");
    const receivedSecret = req.headers.get("x-webhook-secret");

    if (!expectedSecret) {
      return new Response(JSON.stringify({ error: "Webhook secret is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!receivedSecret || !timingSafeEqual(receivedSecret, expectedSecret)) {
      return new Response(JSON.stringify({ error: "Unauthorized webhook secret" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = (await req.json()) as TravelNetPayload;
    const eventType = payload.event_type?.trim();
    if (!eventType) {
      return new Response(JSON.stringify({ error: "Missing event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing Supabase env configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let propertyId = payload.property_id ?? null;
    let unitId = payload.unit_id ?? null;

    // Resolve by Track IDs when direct UUIDs are not provided.
    if (!unitId && payload.unit_track_id !== undefined) {
      const { data: unit, error } = await supabase
        .from("units")
        .select("id, property_id")
        .eq("track_id", Number(payload.unit_track_id))
        .maybeSingle();
      if (error) throw error;
      if (unit) {
        unitId = unit.id;
        propertyId = propertyId ?? unit.property_id;
      }
    }

    if (!propertyId && payload.property_track_id !== undefined) {
      const { data: property, error } = await supabase
        .from("properties")
        .select("id")
        .eq("external_id", String(payload.property_track_id))
        .maybeSingle();
      if (error) throw error;
      if (property) propertyId = property.id;
    }

    const externalId = payload.external_id ?? payload.reservation_id ?? null;
    const eventAt = toIsoDate(payload.event_at) ?? new Date().toISOString();

    const { data, error } = await supabase
      .from("reservation_events")
      .insert({
        external_source: "travelnet",
        external_id: externalId,
        property_id: propertyId,
        unit_id: unitId,
        event_type: eventType,
        event_at: eventAt,
        payload_json: payload.payload ?? payload,
      })
      .select("id")
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        ok: true,
        reservation_event_id: data.id,
        event_type: eventType,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    // QA P2: don't leak DB internals or stack info to webhook caller.
    console.error("travelnet-webhook error", error);
    return new Response(JSON.stringify({ error: "webhook_processing_failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
