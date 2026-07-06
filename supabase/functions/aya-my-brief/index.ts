// aya-my-brief: the per-user staff Aya (Nemr vision: "every role a landing page
// around decisions"). Field staff are the one role without their own brief. This
// user-authenticated fn reads the caller's own smart queue and returns a short
// "what to do first and why" over their work orders.
//
// On-demand + cached: it caches the brief per (user, day, locale) in
// aya_user_briefs and returns the cached copy for CACHE_TTL_MS, so opening the
// page repeatedly does not re-hit the model. The brief is returned inline in the
// response; the client never queries the table (server-only, deny-all RLS).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { accrue, type AyaOut, callLLM, maskSignals, newCost, parseBrief } from "../_shared/aya-llm.ts";

const ALLOWED_ORIGINS = new Set([
  "https://lrmb.vercel.app",
  "http://localhost:5173",
  "http://localhost:8080",
]);
function corsHeadersFor(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://lrmb.vercel.app";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STAFF_MODEL = Deno.env.get("AYA_MODEL") ?? "gpt-4o-mini";
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2h: the cache is also the rate limit.
const QUEUE_LIMIT = 15;

const STAFF_PROMPT =
  "You are Aya, briefing ONE field worker at a luxury vacation-rental operation. " +
  "From their ranked work queue, tell them what to do first and why, in plain language. " +
  "Give the top 3 to 5 items, most urgent first. Name the specific unit and the concrete next step. " +
  "Judge urgency from the real signals (past_sla, priority, blocked_reason, smart_queue_reason); never invent " +
  "a task, unit, or number. Be direct, no filler, no hedging, no em-dashes. " +
  "The headline is the single thing to start with right now. For each item give the next action, not a restatement. " +
  "Return ONLY valid JSON: {\"headline\": string <=90 chars, \"narrative\": string 1-2 sentences, " +
  "\"bullets\": [{\"severity\": \"P1\"|\"P2\"|\"P3\", \"text\": the task naming its unit, \"impact\": why it is urgent, " +
  "\"action\": the specific next step, \"entity_link\": string|null}]}. Max 5 bullets, ordered by urgency. " +
  "Only use entity_link values that appear verbatim in the signals.";

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeadersFor(origin) });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" }, origin);

  const sbUrl = Deno.env.get("SUPABASE_URL");
  const srKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !srKey) return json(500, { error: "server_misconfigured" }, origin);

  const authz = req.headers.get("Authorization") ?? "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  if (!token) return json(401, { error: "missing_bearer_token" }, origin);

  // Signature-verified JWT (mirrors photo-upload). Resolves the caller's user id.
  const authClient = createClient(sbUrl, srKey);
  const { data: authData, error: authErr } = await authClient.auth.getUser(token);
  if (authErr || !authData?.user?.id || !UUID_RE.test(authData.user.id)) {
    if (authErr) console.error("aya-my-brief auth failed", authErr.message);
    return json(401, { error: "unauthorized" }, origin);
  }
  const userId = authData.user.id;

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body is fine */ }
  const locale = body.locale === "es" ? "es" : "en";
  const today = new Date().toISOString().slice(0, 10);

  const service = createClient(sbUrl, srKey);

  // Cache: a fresh brief for this (user, day, locale) short-circuits the model.
  const { data: cached } = await service
    .from("aya_user_briefs")
    .select("headline, narrative, bullets, model, generated_at")
    .eq("user_id", userId).eq("generated_for", today).eq("locale", locale)
    .maybeSingle();
  if (cached && (Date.now() - new Date(cached.generated_at as string).getTime()) < CACHE_TTL_MS) {
    return json(200, { brief: shape(cached), cached: true }, origin);
  }

  // The caller's own ranked queue, resolved by auth.uid() inside my_smart_queue
  // (user-scoped: srKey client carrying the user's bearer, same as photo-upload).
  const userClient = createClient(sbUrl, srKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: queue, error: qErr } = await userClient.rpc("my_smart_queue", { p_limit: QUEUE_LIMIT });
  if (qErr) { console.error("aya-my-brief queue failed", qErr.message); return json(500, { error: "queue_failed" }, origin); }
  const tasks = (queue ?? []) as Array<Record<string, unknown>>;
  if (tasks.length === 0) return json(200, { brief: null, reason: "empty_queue" }, origin);

  const gwKey = Deno.env.get("MK_GW_KEY");
  if (!gwKey) return json(200, { brief: cached ? shape(cached) : null, skipped: true, reason: "MK_GW_KEY unset" }, origin);

  // Compact, grounded signals + the allowlist of real /tasks links.
  const validLinks = new Set<string>();
  const signalTasks = tasks.map((t) => {
    const link = `/tasks/${t.id}`;
    validLinks.add(link);
    const unit = t.units as Record<string, unknown> | null;
    const prop = t.properties as Record<string, unknown> | null;
    return {
      entity_link: link,
      title: t.title,
      status: t.status,
      priority: t.priority,
      task_category: t.task_category,
      housekeeping_type: t.housekeeping_type,
      due_at: t.due_at,
      blocked_reason: t.blocked_reason,
      unit_code: unit?.unit_code ?? null,
      property_name: prop?.name ?? null,
      queue_reason: t.smart_queue_reason,
      past_sla: t.due_at ? new Date(String(t.due_at)).getTime() < Date.now() : false,
    };
  });
  // No guest_name fields on tasks, but run redaction anyway so a future field or
  // an embedded name is masked before it reaches the model.
  const signals = maskSignals({ scope: "staff", date: today, tasks: signalTasks });

  const cost = newCost();
  const lang = locale === "es"
    ? " Write headline, narrative, text, impact, and action in Spanish (es). Keep entity_link values exactly as given."
    : "";
  const { content, usage } = await callLLM(gwKey, STAFF_MODEL, [
    { role: "system", content: STAFF_PROMPT + lang },
    { role: "user", content: "Signals:\n" + JSON.stringify(signals) },
  ]);
  accrue(cost, STAFF_MODEL, usage);
  const brief = parseBrief(content, validLinks);
  if (!brief) return json(200, { brief: cached ? shape(cached) : null, error: "generation_failed" }, origin);

  // Cache it. The unique index is on real columns, so onConflict upsert works
  // (unlike aya_insights' expression index, which silently no-ops).
  const { error: upErr } = await service.from("aya_user_briefs").upsert({
    user_id: userId, generated_for: today, locale,
    headline: brief.headline, narrative: brief.narrative, bullets: brief.bullets,
    model: STAFF_MODEL, generated_at: new Date().toISOString(),
  }, { onConflict: "user_id,generated_for,locale" });
  if (upErr) console.error("aya-my-brief cache upsert failed", upErr.message);

  return json(200, { brief: { ...brief, model: STAFF_MODEL, generated_at: new Date().toISOString() }, cached: false }, origin);
});

// Cached row -> the same shape the fresh path returns.
function shape(row: Record<string, unknown>): AyaOut & { model?: string; generated_at?: string } {
  return {
    headline: String(row.headline ?? ""),
    narrative: String(row.narrative ?? ""),
    bullets: (row.bullets ?? []) as AyaOut["bullets"],
    model: row.model as string | undefined,
    generated_at: row.generated_at as string | undefined,
  };
}

function json(status: number, body: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(origin), "Content-Type": "application/json" },
  });
}
