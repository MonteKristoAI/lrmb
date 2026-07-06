// Aya: the LRMB operational intelligence layer (Nemr vision). Cron-only.
//
// Reads a RICH service-role signal bundle (aya_signal_bundle: health + 24h trend,
// revenue in-house + revenue at risk, VIP arrivals, turnovers, HK%, SLA%, worst
// vendors, exceptions, at-risk properties), asks the LLM via mk-ai-gateway to act
// as the COO's chief of staff and return a ranked, quantified, actionable brief,
// then self-critiques + refines the platform brief once. Bilingual (en/es),
// PHI-redacted, anti-hallucination, persisted per (scope, property, locale, day).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";
import {
  accrue,
  type AyaOut,
  callLLM,
  type CostAccumulator,
  maskSignals,
  newCost,
  parseBrief,
} from "../_shared/aya-llm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

// The platform brief is the headline; give it the stronger model. Per-property
// notes are many + change slowly, so the cheap model is fine.
const PLATFORM_MODEL = Deno.env.get("AYA_PLATFORM_MODEL") ?? "gpt-4o";
const PROPERTY_MODEL = Deno.env.get("AYA_MODEL") ?? "gpt-4o-mini";
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
  const runId = crypto.randomUUID();
  const cost = newCost();
  const today = new Date().toISOString().slice(0, 10);
  const url = new URL(req.url);
  const onlyScope = url.searchParams.get("scope"); // 'platform' | 'property' | null(both)
  // fast=1: intraday refresh. Platform uses the cheap model + no refine, so the
  // headline stays fresh through the day without the gpt-4o cost of the morning run.
  const fast = url.searchParams.get("fast") === "1";

  const { data: bundle, error: bundleErr } = await supabase.rpc("aya_signal_bundle");
  if (bundleErr || !bundle) return json(500, { error: "signal_bundle_failed", detail: bundleErr?.message });

  // Redaction seed: every arrival guest name (incl. non-VIP names that only
  // appear inside exception subtitles, which have no guest_name field). Used to
  // build the PHI set; the field itself is never sent to the LLM.
  const redactNames = ((bundle._redact_names ?? []) as string[]).filter((n) => typeof n === "string");

  if (!gwKey) {
    // Config error, not a transient blip: the key that lets Aya think is gone.
    // Log it as an error row so the n8n handler alerts, then skip cleanly.
    await writeRunAudit(supabase, runId, { fast, scopes: onlyScope ?? "all" }, cost, startedAt, [], "MK_GW_KEY unset");
    return json(200, {
      skipped: true, reason: "MK_GW_KEY unset", signals_ready: true,
      counts: { exceptions: (bundle.exceptions ?? []).length, at_risk: (bundle.properties_at_risk ?? []).length },
    });
  }

  // Real entity links (anti-hallucination allowlist).
  const validLinks = new Set<string>();
  for (const ex of (bundle.exceptions ?? []) as Array<Record<string, unknown>>) {
    if (typeof ex.entity_link === "string") validLinks.add(ex.entity_link);
  }
  for (const p of (bundle.properties_at_risk ?? []) as Array<Record<string, unknown>>) {
    if (typeof p.property_id === "string") validLinks.add(`/admin/properties/${p.property_id}`);
  }

  const results: Array<Record<string, unknown>> = [];

  // 1. Platform morning brief: rich bundle, strong model, generate then refine.
  if (onlyScope !== "property") {
    const platformSignals = maskSignals(stripForPlatform(bundle), redactNames);
    const pModel = fast ? PROPERTY_MODEL : PLATFORM_MODEL;
    for (const locale of LOCALES) {
      let brief = await generate(cost, gwKey, pModel, platformSignals, validLinks, locale, false);
      if (brief && !fast) brief = await refine(cost, gwKey, pModel, platformSignals, brief, validLinks, locale) ?? brief;
      if (brief) {
        const err = await persist(supabase, "platform", null, today, locale, pModel, brief, platformSignals);
        results.push({ scope: "platform", locale, ok: !err, bullets: brief.bullets.length, err });
      }
    }
  }

  // 1b. Team briefs (housekeeping, maintenance): grounded team signals so a team
  // lead (Nemr's "Jennifer") opens the queue to exactly what to tackle first and
  // why. Cheap model; generated on the platform-inclusive runs (full + fast).
  if (onlyScope !== "property") {
    for (const cat of ["housekeeping", "maintenance"] as const) {
      const { data: tb } = await supabase.rpc("aya_team_bundle", { p_category: cat });
      if (!tb) continue;
      const teamLinks = new Set<string>();
      for (const x of ((tb as Record<string, unknown>).top_urgent ?? []) as Array<Record<string, unknown>>) {
        if (typeof x.entity_link === "string") teamLinks.add(x.entity_link);
      }
      const teamSignals = maskSignals(tb, redactNames);
      for (const locale of LOCALES) {
        const brief = await generate(cost, gwKey, PROPERTY_MODEL, teamSignals, teamLinks, locale, false);
        if (!brief) continue;
        const err = await persist(supabase, cat, null, today, locale, PROPERTY_MODEL, brief, teamSignals);
        results.push({ scope: cat, locale, ok: !err, bullets: brief.bullets.length, err });
      }
    }
  }

  // 2. Per-property notes for at-risk properties (cheaper model, single pass).
  if (onlyScope !== "platform") {
    const atRisk = (bundle.properties_at_risk ?? []) as Array<Record<string, unknown>>;
    for (const p of atRisk.slice(0, 8)) {
      const propSignals = maskSignals({ scope: "property", date: today, property: p }, redactNames);
      // The property carries its own top open tasks (with /tasks links); allow
      // those so per-property bullets can point at specific work orders.
      const propLinks = new Set(validLinks);
      for (const tu of ((p.top_urgent ?? []) as Array<Record<string, unknown>>)) {
        if (typeof tu.entity_link === "string") propLinks.add(tu.entity_link);
      }
      for (const locale of LOCALES) {
        const brief = await generate(cost, gwKey, PROPERTY_MODEL, propSignals, propLinks, locale, true);
        if (!brief) continue;
        const err = await persist(supabase, "property", p.property_id as string, today, locale, PROPERTY_MODEL, brief, propSignals);
        results.push({ scope: "property", property_id: p.property_id, locale, ok: !err, bullets: brief.bullets.length, err });
      }
    }
  }

  await writeRunAudit(supabase, runId, { fast, scopes: onlyScope ?? "all" }, cost, startedAt, results, null);
  return json(200, { generated: results.length, results, elapsedMs: Date.now() - startedAt });
});

// One structured cost/health row per run, same shape as ops-health-monitor so it
// surfaces in /admin/audit and the n8n error handler picks up severity:"error".
// Never throws: a failed audit insert must not fail the run.
async function writeRunAudit(
  supabase: ReturnType<typeof createClient>,
  runId: string,
  ctx: { fast: boolean; scopes: string },
  cost: CostAccumulator,
  startedAt: number,
  results: Array<Record<string, unknown>>,
  skipReason: string | null,
): Promise<void> {
  const persistErrors = results.filter((r) => r.err).length;
  // Error when the key is gone, when we called the model but nothing survived, or
  // when a write failed. A normal run that produced briefs is info.
  const isError = !!skipReason || (cost.calls > 0 && results.length === 0) || persistErrors > 0;
  const severity = isError ? "error" : "info";
  const desc = skipReason
    ? `aya_generate_run skipped: ${skipReason}`
    : `aya_generate_run: ${results.length} insights, $${cost.est_cost_usd.toFixed(4)}, ${cost.total_tokens} tok, ${Date.now() - startedAt}ms`;
  try {
    await supabase.from("audit_logs").insert({
      action: "aya_generate_run",
      entity_type: "system",
      entity_id: runId,
      description: desc,
      payload_json: {
        fast: ctx.fast,
        scopes: ctx.scopes,
        generated: results.length,
        persist_errors: persistErrors,
        llm_calls: cost.calls,
        tokens: { prompt: cost.prompt_tokens, completion: cost.completion_tokens, total: cost.total_tokens },
        est_cost_usd: Number(cost.est_cost_usd.toFixed(5)),
        by_model: cost.by_model,
        elapsed_ms: Date.now() - startedAt,
        skip_reason: skipReason,
        severity,
      },
    });
  } catch (err) {
    console.error("aya audit insert failed:", (err as Error).message);
  }
}

// Trim the bundle to what the platform prompt needs (drop noisy nested arrays we
// do not want the model to over-enumerate; keep the summary numbers + top rows).
function stripForPlatform(b: Record<string, unknown>): Record<string, unknown> {
  const props = ((b.properties_at_risk ?? []) as Array<Record<string, unknown>>).slice(0, 10).map((p) => ({
    property_id: p.property_id, property_name: p.property_name, risk_band: p.risk_band,
    health_score: p.health_score, arrivals_next_24h: p.arrivals_next_24h,
    vip_arrivals_next_48h: p.vip_arrivals_next_48h, overdue_wo_count: p.overdue_wo_count,
    blocked_wo_count: p.blocked_wo_count, vendor_delayed_count: p.vendor_delayed_count,
  }));
  return {
    scope: "platform",
    health_score: (b.health as Record<string, unknown>)?.score,
    health_band: (b.health as Record<string, unknown>)?.band,
    health_delta_vs_24h_ago: b.health_delta,
    revenue_in_house_today_usd: b.revenue_in_house_today,
    revenue_at_risk_today_usd: b.revenue_at_risk_today,
    vip_arrivals_next_24h: b.vip_arrivals_24h,
    turnovers_today: b.turnovers_today,
    housekeeping_completion_pct: b.housekeeping_completion_pct,
    maintenance_sla_pct: b.maintenance_sla_pct,
    worst_vendors: b.vendor_bottom,
    exceptions: b.exceptions,
    properties_at_risk: props,
  };
}

async function persist(supabase: ReturnType<typeof createClient>, scope: string, propertyId: string | null, today: string, locale: string, model: string, out: AyaOut, signals: unknown): Promise<string | null> {
  let del = supabase.from("aya_insights").delete().eq("scope", scope).eq("generated_for", today).eq("locale", locale);
  del = propertyId === null ? del.is("property_id", null) : del.eq("property_id", propertyId);
  const { error: delErr } = await del;
  if (delErr) return `delete: ${delErr.message}`;
  const { error: insErr } = await supabase.from("aya_insights").insert({
    scope, property_id: propertyId, generated_for: today, locale, headline: out.headline, narrative: out.narrative,
    bullets: out.bullets, source_signals: signals, model, generated_at: new Date().toISOString(),
  });
  return insErr ? `insert: ${insErr.message}` : null;
}

// --- LLM --------------------------------------------------------------------

const SYSTEM_PROMPT =
  "You are Aya, chief of staff to the COO of a luxury vacation-rental operation. " +
  "From the operational signals, tell the operator ONLY the few things that actually matter right now, " +
  "ranked by business impact: revenue at risk, VIP guests arriving, SLA breaches, and units not guest-ready " +
  "for imminent arrivals. Do not describe the data or enumerate everything; synthesize the top 3 to 5. " +
  "Quantify impact using the real numbers in the signals (dollars, counts, hours). Only mention a health " +
  "trend (better or worse vs 24h ago) if a delta value (e.g. health_delta) is present in the signals; if no " +
  "delta is given, do NOT claim any 24h comparison. The headline is the single highest-leverage decision " +
  "to make today. Every claim must be traceable to the signals; never invent a property, unit, guest, number, " +
  "or link. Be direct and specific, name the unit or property, no filler, no hedging, no em-dashes. " +
  "For each item give a concrete next action, not a restatement of the problem. " +
  "Return ONLY valid JSON: {\"headline\": string <=90 chars, \"narrative\": string 2-4 sentences that quantify " +
  "and include the trend, \"bullets\": [{\"severity\": \"P1\"|\"P2\"|\"P3\", \"text\": short issue naming the entity, " +
  "\"impact\": quantified why it matters, \"action\": the specific next step, \"entity_link\": string|null}]}. " +
  "Max 5 bullets, ordered by impact. Only use entity_link values that appear verbatim in the signals.";

async function generate(cost: CostAccumulator, gwKey: string, model: string, signals: unknown, validLinks: Set<string>, locale: string, actionOptional: boolean): Promise<AyaOut | null> {
  const lang = locale === "es"
    ? " Write headline, narrative, text, impact, and action in Spanish (es). Keep entity_link values exactly as given."
    : "";
  const softer = actionOptional ? " For a single property, 2 to 4 bullets is enough." : "";
  const { content, usage } = await callLLM(gwKey, model, [
    { role: "system", content: SYSTEM_PROMPT + lang + softer },
    { role: "user", content: "Signals:\n" + JSON.stringify(signals) },
  ]);
  accrue(cost, model, usage);
  return parseBrief(content, validLinks);
}

// Self-critique + rewrite once. Forces every bullet to be quantified + actionable
// and drops anything not grounded, before we persist the headline brief.
async function refine(cost: CostAccumulator, gwKey: string, model: string, signals: unknown, draft: AyaOut, validLinks: Set<string>, locale: string): Promise<AyaOut | null> {
  const lang = locale === "es" ? " Respond in Spanish (es)." : "";
  const { content, usage } = await callLLM(gwKey, model, [
    { role: "system", content: SYSTEM_PROMPT + lang },
    { role: "user", content:
        "Signals:\n" + JSON.stringify(signals) +
        "\n\nDraft brief:\n" + JSON.stringify(draft) +
        "\n\nCritique this draft against the signals, then return an IMPROVED brief in the SAME JSON schema. " +
        "Make the headline the single highest-leverage decision. Ensure every bullet has a quantified impact " +
        "and a concrete action, is ranked by impact, and names a specific unit or property. Drop any claim not " +
        "backed by the signals. Do not add entity_link values that are not in the signals." },
  ]);
  accrue(cost, model, usage);
  return parseBrief(content, validLinks);
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
