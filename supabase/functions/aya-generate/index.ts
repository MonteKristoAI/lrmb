// Aya: the LRMB operational intelligence layer (Nemr vision 2026-07-04).
//
// Cron-only. Reads the same aggregated signals the Command Center already
// computes (exec_command_center_bundle + exception_feed + properties overview),
// asks the LLM (via MonteKristo's mk-ai-gateway, an OpenAI-compatible proxy) to
// synthesize a short "what needs attention today and why" narrative, and upserts
// it into aya_insights. The UI reads the cached row through aya_latest_insight.
//
// Design notes:
//  - PHI safety: guest names are masked to initials before they enter the prompt.
//  - Anti-hallucination: every bullet's entity_link must exist in the real
//    signals we sent, or the bullet is dropped. source_signals is persisted.
//  - Graceful degradation: if MK_GW_KEY is unset or the gateway errors, we SKIP
//    (return 200, skipped:true) and leave any existing row intact. Never crash,
//    never wipe yesterday's insight.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const GATEWAY_URL = Deno.env.get("MK_GW_URL") ?? "https://gateway.montekristo.co/v1";
const MODEL = Deno.env.get("AYA_MODEL") ?? "gpt-4o-mini";
const LOCALES = ["en", "es"] as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json(500, { error: "missing_supabase_env" });
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const gwKey = Deno.env.get("MK_GW_KEY");
  const startedAt = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // 1. Gather the signals by reading the underlying MVs/tables DIRECTLY. We are
  // the service role here (bypasses RLS), so we deliberately do NOT call the
  // role-guarded leadership RPCs (exec_command_center_bundle etc.) - those check
  // auth.uid() and RAISE 42501 for the null service-role uid. The MVs already
  // hold everything those RPCs aggregate.
  const [{ data: healthRow }, { data: exceptions }, { data: properties }] = await Promise.all([
    supabase.from("ops_health_snapshots")
      .select("score,band,components,captured_at")
      .is("property_id", null)
      .order("captured_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("mv_operational_exceptions")
      .select("severity,title,subtitle,entity_type,entity_id,entity_link,dedupe_key,created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase.from("mv_properties_at_risk")
      .select("property_id,property_name,health_score,health_band,arrivals_next_24h,arrivals_next_48h,vip_arrivals_next_48h,turnovers_today,overdue_wo_count,blocked_wo_count,vendor_delayed_count,risk_band,top_arrivals")
      .order("health_score", { ascending: true }),
  ]);

  if (!healthRow && (!properties || properties.length === 0)) {
    return json(500, { error: "no_signals" });
  }

  // If we have no gateway key we cannot generate; skip cleanly (see header).
  if (!gwKey) {
    return json(200, {
      skipped: true,
      reason: "MK_GW_KEY unset - provision an mk-ai-gateway virtual key and set it as a function secret to enable Aya",
      signals_ready: true,
      counts: { exceptions: (exceptions ?? []).length, properties: (properties ?? []).length, health: !!healthRow },
    });
  }

  // 2. Build the set of REAL entity links so we can reject hallucinated bullets.
  const validLinks = new Set<string>();
  for (const ex of (exceptions ?? []) as Array<Record<string, unknown>>) {
    if (typeof ex.entity_link === "string") validLinks.add(ex.entity_link);
  }
  for (const p of (properties ?? []) as Array<Record<string, unknown>>) {
    if (typeof p.property_id === "string") validLinks.add(`/admin/properties/${p.property_id}`);
  }

  const atRisk = ((properties ?? []) as Array<Record<string, unknown>>)
    .filter((p) => p.risk_band && p.risk_band !== "healthy");

  const results: Array<Record<string, unknown>> = [];

  // 3a. Platform-level morning brief.
  const platformSignals = maskSignals({
    scope: "platform",
    date: today,
    health: healthRow,
    exceptions: (exceptions ?? []) as unknown,
    properties_at_risk: atRisk,
  });

  // The app is bilingual, so narrate in each locale (viewer sees their own).
  for (const locale of LOCALES) {
    const platform = await generate(gwKey, platformSignals, validLinks, locale);
    if (platform) {
      const err = await persist(supabase, "platform", null, today, locale, platform, platformSignals);
      results.push({ scope: "platform", locale, ok: !err, bullets: platform.bullets.length, err });
    }
  }

  // 3b. Per-property, only for properties that are NOT healthy (save tokens).
  const props = atRisk.slice(0, 8); // cap fan-out per run

  for (const p of props) {
    const propSignals = maskSignals({ scope: "property", date: today, property: p });
    for (const locale of LOCALES) {
      const insight = await generate(gwKey, propSignals, validLinks, locale);
      if (!insight) continue;
      const err = await persist(supabase, "property", p.property_id as string, today, locale, insight, propSignals);
      results.push({ scope: "property", property_id: p.property_id, locale, ok: !err, bullets: insight.bullets.length, err });
    }
  }

  return json(200, { generated: results.length, results, elapsedMs: Date.now() - startedAt });
});

// Idempotent write: delete today's row for this scope/property, then insert.
// We do NOT use PostgREST upsert(onConflict) because the dedupe uniqueness is an
// expression index (COALESCE(property_id, sentinel)) that onConflict can't target,
// which silently no-ops the write. Delete+insert doesn't depend on the constraint
// shape. Returns an error string on failure, or null on success.
async function persist(
  supabase: ReturnType<typeof createClient>,
  scope: "platform" | "property",
  propertyId: string | null,
  today: string,
  locale: string,
  out: AyaOut,
  signals: unknown,
): Promise<string | null> {
  let del = supabase.from("aya_insights").delete().eq("scope", scope).eq("generated_for", today).eq("locale", locale);
  del = propertyId === null ? del.is("property_id", null) : del.eq("property_id", propertyId);
  const { error: delErr } = await del;
  if (delErr) return `delete: ${delErr.message}`;
  const { error: insErr } = await supabase.from("aya_insights").insert({
    scope,
    property_id: propertyId,
    generated_for: today,
    locale,
    headline: out.headline,
    narrative: out.narrative,
    bullets: out.bullets,
    source_signals: signals,
    model: MODEL,
    generated_at: new Date().toISOString(),
  });
  return insErr ? `insert: ${insErr.message}` : null;
}

// --- LLM call -------------------------------------------------------------

interface AyaOut { headline: string; narrative: string; bullets: Array<{ severity: string; text: string; entity_link?: string }>; }

const SYSTEM_PROMPT = [
  "You are Aya, the operational intelligence layer for a luxury vacation-rental",
  "management company. You do not describe data; you tell an operator what needs",
  "attention today and why, so they can decide in seconds. Be concise and direct.",
  "Lead with the single most important thing. Ground every statement in the",
  "signals provided. NEVER invent a property, unit, guest, number, or link that is",
  "not present in the input. If nothing is urgent, say operations look stable and",
  "note the one thing worth watching. No hedging, no filler, no em-dashes.",
  "Return ONLY valid JSON: {\"headline\": string (<=90 chars),",
  "\"narrative\": string (2-5 sentences), \"bullets\": [{\"severity\": \"P1\"|\"P2\"|\"P3\",",
  "\"text\": string, \"entity_link\": string|null}]}. Max 6 bullets, ordered by severity.",
  "Only use entity_link values that appear verbatim in the input signals.",
].join(" ");

async function generate(gwKey: string, signals: unknown, validLinks: Set<string>, locale: string): Promise<AyaOut | null> {
  const langLine = locale === "es"
    ? " Write headline, narrative, and bullet text in Spanish (es). Keep entity_link values exactly as given, do not translate them."
    : "";
  try {
    const res = await fetch(`${GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${gwKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT + langLine },
          { role: "user", content: "Signals:\n" + JSON.stringify(signals) },
        ],
      }),
    });
    if (!res.ok) {
      console.error("aya gateway error", res.status, (await res.text()).slice(0, 200));
      return null;
    }
    const body = await res.json();
    const content = body?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return null;
    const parsed = JSON.parse(content) as AyaOut;
    if (!parsed.headline || !parsed.narrative) return null;
    // Anti-hallucination: drop any bullet whose entity_link is not a real link.
    const bullets = (parsed.bullets ?? [])
      .filter((b) => b && typeof b.text === "string")
      .map((b) => (b.entity_link && validLinks.has(b.entity_link) ? b : { ...b, entity_link: undefined }))
      .slice(0, 6);
    return { headline: parsed.headline.slice(0, 200), narrative: parsed.narrative, bullets };
  } catch (e) {
    console.error("aya generate exception", (e as Error).message);
    return null;
  }
}

// --- PHI masking ----------------------------------------------------------

// Two-pass PHI redaction before the payload leaves our infra for the LLM.
// Pass 1 collects every guest name (from guest_name fields). Pass 2 replaces
// those names to initials EVERYWHERE: both the guest_name fields AND any free-
// text string that embeds the name (the exception feed subtitle is literally
// "Arriving <Full Name> at ...", which a field-only mask misses).
function maskSignals(obj: unknown): unknown {
  const names = new Set<string>();
  collectNames(obj, names);
  const map = new Map<string, string>();
  for (const n of names) if (n.trim()) map.set(n, initials(n));
  return redact(obj, map);
}

function collectNames(obj: unknown, into: Set<string>): void {
  if (Array.isArray(obj)) { for (const v of obj) collectNames(v, into); return; }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if ((k === "guest_name" || k === "guestName") && typeof v === "string" && v.trim()) into.add(v);
      else collectNames(v, into);
    }
  }
}

function redactString(s: string, map: Map<string, string>): string {
  let out = s;
  for (const [name, init] of map) if (out.includes(name)) out = out.split(name).join(init);
  return out;
}

function redact(obj: unknown, map: Map<string, string>): unknown {
  if (typeof obj === "string") return redactString(obj, map);
  if (Array.isArray(obj)) return obj.map((v) => redact(v, map));
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[k] = (k === "guest_name" || k === "guestName") && typeof v === "string" ? initials(v) : redact(v, map);
    }
    return out;
  }
  return obj;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Guest";
  return parts.map((p) => p[0].toUpperCase() + ".").join("");
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
