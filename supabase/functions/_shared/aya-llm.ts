// Shared Aya building blocks, used by both aya-generate (cron, platform + team +
// property briefs) and aya-my-brief (per-user staff brief). Keeping the PHI
// redaction, the gateway call, and the brief parser in one place means a fix to
// any of them (a new redaction case, a pricing change) lands in every brief.

const GATEWAY_URL = Deno.env.get("MK_GW_URL") ?? "https://gateway.montekristo.co/v1";

export interface Bullet {
  severity: string;
  text: string;
  impact?: string;
  action?: string;
  entity_link?: string;
}
export interface AyaOut {
  headline: string;
  narrative: string;
  bullets: Bullet[];
}
export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// --- LLM --------------------------------------------------------------------

// Returns the raw content string plus the token usage the gateway reports, so the
// caller can both parse the brief and account for cost. Never throws: a gateway
// failure returns null content (the brief is an enhancement, not load-bearing).
export async function callLLM(
  gwKey: string,
  model: string,
  messages: unknown,
): Promise<{ content: string | null; usage: Usage | null }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${gwKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.2, response_format: { type: "json_object" }, messages }),
    });
    if (!res.ok) {
      console.error("aya gateway error", res.status, (await res.text()).slice(0, 200));
      return { content: null, usage: null };
    }
    const body = await res.json();
    const c = body?.choices?.[0]?.message?.content;
    const u = body?.usage;
    const usage: Usage | null = u
      ? {
        prompt_tokens: Number(u.prompt_tokens) || 0,
        completion_tokens: Number(u.completion_tokens) || 0,
        total_tokens: Number(u.total_tokens) || 0,
      }
      : null;
    return { content: typeof c === "string" ? c : null, usage };
  } catch (e) {
    console.error("aya llm exception", (e as Error).message);
    return { content: null, usage: null };
  }
}

// Approximate USD per 1M tokens (in, out) by model. Only used for the cost row in
// audit_logs; a rough figure is enough to spot a runaway run, not to bill anyone.
const PRICE_PER_1M: Record<string, [number, number]> = {
  "gpt-4o": [2.5, 10],
  "gpt-4o-mini": [0.15, 0.6],
};
export function estimateCostUsd(model: string, usage: Usage | null): number {
  if (!usage) return 0;
  const [inP, outP] = PRICE_PER_1M[model] ?? [0, 0];
  return (usage.prompt_tokens / 1_000_000) * inP + (usage.completion_tokens / 1_000_000) * outP;
}

// A running total the callers accrue into across a whole run.
export interface CostAccumulator {
  calls: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  est_cost_usd: number;
  by_model: Record<string, { calls: number; total_tokens: number }>;
}
export function newCost(): CostAccumulator {
  return { calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0, est_cost_usd: 0, by_model: {} };
}
export function accrue(cost: CostAccumulator, model: string, usage: Usage | null): void {
  cost.calls += 1;
  const m = (cost.by_model[model] ??= { calls: 0, total_tokens: 0 });
  m.calls += 1;
  if (!usage) return;
  cost.prompt_tokens += usage.prompt_tokens;
  cost.completion_tokens += usage.completion_tokens;
  cost.total_tokens += usage.total_tokens;
  cost.est_cost_usd += estimateCostUsd(model, usage);
  m.total_tokens += usage.total_tokens;
}

// Strip the AI-tell glyphs the model still emits despite the prompt (an en-dash
// as a separator in Spanish, an em-dash, an arrow). Guarantees no banned glyph
// reaches the client, from any brief, without depending on the model behaving.
function deGlyph(s: string): string {
  return s.replace(/\s*[\u2014\u2013]\s*/g, " - ").replace(/\s*\u2192\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function parseBrief(content: string | null, validLinks: Set<string>): AyaOut | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content) as AyaOut;
    if (!parsed.headline || !parsed.narrative) return null;
    const bullets = (parsed.bullets ?? [])
      .filter((b) => b && typeof b.text === "string")
      .map((b) => ({
        ...b,
        text: deGlyph(String(b.text)),
        impact: b.impact ? deGlyph(String(b.impact)) : b.impact,
        action: b.action ? deGlyph(String(b.action)) : b.action,
        entity_link: (b.entity_link && validLinks.has(b.entity_link)) ? b.entity_link : undefined,
      }))
      .slice(0, 5);
    return { headline: deGlyph(String(parsed.headline)).slice(0, 200), narrative: deGlyph(String(parsed.narrative)), bullets };
  } catch {
    return null;
  }
}

// --- PHI redaction ----------------------------------------------------------

// Two-pass redaction: collect every guest name (from guest_name fields plus an
// explicit extraNames seed for names that only appear inside free-text like
// exception subtitles), then string-replace them everywhere with initials.
export function maskSignals(obj: unknown, extraNames: string[] = []): unknown {
  const names = new Set<string>(extraNames);
  collectNames(obj, names);
  const map = new Map<string, string>();
  // Longer names first so "Patricia Merodio Bassan" is replaced before a
  // substring like "Patricia" would partially match.
  for (const n of [...names].filter((n) => n.trim()).sort((a, b) => b.length - a.length)) map.set(n, initials(n));
  return redact(obj, map);
}
function collectNames(obj: unknown, into: Set<string>): void {
  if (Array.isArray(obj)) {
    for (const v of obj) collectNames(v, into);
    return;
  }
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
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Guest";
  return parts.map((p) => p[0].toUpperCase() + ".").join("");
}
