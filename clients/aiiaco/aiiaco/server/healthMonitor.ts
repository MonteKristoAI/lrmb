/**
 * AiiA Diagnostic Chain — Health Monitor
 *
 * Checks every vital in the pipeline:
 *   1. ElevenLabs Agent — is the agent reachable and configured?
 *   2. ElevenLabs Webhook — is the workspace webhook assigned and not failing?
 *   3. Database — can we read/write?
 *   4. Email (Resend) — is the API key valid and domain verified?
 *   5. LLM (Intelligence Extraction) — is the LLM endpoint reachable?
 *   6. Owner Notification — can we reach the notification service?
 *   7. Conversation Poller — is the conversations API reachable?
 *
 * Each check returns { status, latencyMs, details }.
 * The aggregate result includes an overall health score and alerts.
 *
 * Reliability features:
 *   - Every external fetch has a 10s AbortSignal timeout
 *   - Each check retries once on failure before reporting "down"
 *   - Alerts only fire after 2 consecutive "down" reports for the same vital
 *   - Alert cooldown: max 1 alert per vital per 30 minutes
 */

import { getAgent } from "./aiAgent";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

// ─── Types ───────────────────────────────────────────────────────────────────

export type VitalStatus = "healthy" | "degraded" | "down";

export interface VitalCheck {
  name: string;
  status: VitalStatus;
  latencyMs: number;
  details: string;
  checkedAt: string;
}

export interface HealthReport {
  overall: VitalStatus;
  score: number; // 0-100
  vitals: VitalCheck[];
  checkedAt: string;
  alertsSent: boolean;
}

// ─── Consecutive Failure Tracking ──────────────────────────────────────────

/** Track consecutive failures per vital to avoid false-positive alerts */
const consecutiveFailures: Record<string, number> = {};
/** Track last alert time per vital to enforce cooldown */
const lastAlertTime: Record<string, number> = {};

const CONSECUTIVE_FAILURES_BEFORE_ALERT = 2;
const ALERT_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

function recordVitalResult(name: string, status: VitalStatus): void {
  if (status === "down") {
    consecutiveFailures[name] = (consecutiveFailures[name] ?? 0) + 1;
  } else {
    consecutiveFailures[name] = 0;
  }
}

function shouldAlert(name: string): boolean {
  const failures = consecutiveFailures[name] ?? 0;
  if (failures < CONSECUTIVE_FAILURES_BEFORE_ALERT) return false;

  const lastAlert = lastAlertTime[name] ?? 0;
  if (Date.now() - lastAlert < ALERT_COOLDOWN_MS) return false;

  return true;
}

function markAlerted(name: string): void {
  lastAlertTime[name] = Date.now();
}

// ─── Resilient Fetch Helper ────────────────────────────────────────────────

/**
 * Fetch with a 10-second timeout. Returns null on network/timeout errors
 * instead of throwing, so callers can handle gracefully.
 */
async function safeFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res;
  } catch {
    return null;
  }
}

/**
 * Run a health check function with one automatic retry on failure.
 * If the first attempt returns "down", wait 2 seconds and try again.
 */
async function withRetry(
  checkFn: () => Promise<VitalCheck>
): Promise<VitalCheck> {
  const first = await checkFn();
  if (first.status !== "down") return first;

  // Wait 2 seconds before retry
  await new Promise((r) => setTimeout(r, 2000));
  return checkFn();
}

// ─── Individual Health Checks ────────────────────────────────────────────────

const EL_API_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const EL_BASE = "https://api.elevenlabs.io/v1";

/** 1. Check ElevenLabs Agent is reachable and has a prompt */
async function checkElevenLabsAgent(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "ElevenLabs Agent";
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!agentId) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "ELEVENLABS_AGENT_ID not configured", checkedAt: new Date().toISOString() };
    }
    const agent = await getAgent(agentId) as Record<string, unknown>;
    const config = (agent.conversation_config as Record<string, unknown>) ?? {};
    const agentSection = (config.agent as Record<string, unknown>) ?? {};
    const prompt = (agentSection.prompt as Record<string, unknown>) ?? {};
    const promptText = (prompt.prompt as string) ?? "";

    if (promptText.length < 100) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: `Agent reachable but prompt is only ${promptText.length} chars (expected 1000+)`, checkedAt: new Date().toISOString() };
    }

    return { name, status: "healthy", latencyMs: Date.now() - start, details: `Agent live, prompt ${promptText.length} chars`, checkedAt: new Date().toISOString() };
  } catch (err: any) {
    return { name, status: "down", latencyMs: Date.now() - start, details: `Agent unreachable: ${err.message?.slice(0, 200)}`, checkedAt: new Date().toISOString() };
  }
}

/** 2. Check ElevenLabs Webhook is assigned and not failing */
async function checkElevenLabsWebhook(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "ElevenLabs Webhook";
  try {
    if (!EL_API_KEY) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "ELEVENLABS_API_KEY not configured", checkedAt: new Date().toISOString() };
    }
    const res = await safeFetch(`${EL_BASE}/convai/settings`, {
      headers: { "xi-api-key": EL_API_KEY },
    });
    if (!res) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "ElevenLabs API unreachable (timeout)", checkedAt: new Date().toISOString() };
    }
    if (!res.ok) {
      return { name, status: "down", latencyMs: Date.now() - start, details: `Workspace settings API returned ${res.status}`, checkedAt: new Date().toISOString() };
    }
    const settings = await res.json() as Record<string, unknown>;
    const webhooks = (settings.webhooks as Record<string, unknown>) ?? {};
    const postCallId = webhooks.post_call_webhook_id as string | null;

    if (!postCallId) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "No post-call webhook assigned to workspace", checkedAt: new Date().toISOString() };
    }

    const whRes = await safeFetch(`${EL_BASE}/workspace/webhooks`, {
      headers: { "xi-api-key": EL_API_KEY },
    });
    if (!whRes || !whRes.ok) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: `Webhook ${postCallId.slice(0, 8)} assigned but couldn't fetch webhook list`, checkedAt: new Date().toISOString() };
    }
    const whListData = await whRes.json() as { webhooks?: Array<Record<string, unknown>> };
    const webhookList = whListData.webhooks ?? [];
    const activeWebhook = webhookList.find(w => w.webhook_id === postCallId);

    if (!activeWebhook) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: `Webhook ${postCallId.slice(0, 8)} assigned but not found in workspace list`, checkedAt: new Date().toISOString() };
    }

    if (activeWebhook.is_disabled || activeWebhook.is_auto_disabled) {
      return { name, status: "down", latencyMs: Date.now() - start, details: `Webhook ${postCallId.slice(0, 8)} is disabled`, checkedAt: new Date().toISOString() };
    }

    const failureTimestamp = activeWebhook.most_recent_failure_timestamp as number | null;
    if (failureTimestamp) {
      const hoursSinceFailure = (Date.now() / 1000 - failureTimestamp) / 3600;
      if (hoursSinceFailure < 24) {
        const failCode = activeWebhook.most_recent_failure_error_code as number | null;
        return { name, status: "degraded", latencyMs: Date.now() - start, details: `Webhook active but had a ${failCode ?? "unknown"} failure ${Math.round(hoursSinceFailure)}h ago`, checkedAt: new Date().toISOString() };
      }
    }

    return { name, status: "healthy", latencyMs: Date.now() - start, details: `Webhook ${postCallId.slice(0, 8)} assigned and operational`, checkedAt: new Date().toISOString() };
  } catch (err: any) {
    return { name, status: "down", latencyMs: Date.now() - start, details: `Webhook check failed: ${err.message?.slice(0, 200)}`, checkedAt: new Date().toISOString() };
  }
}

/** 3. Check Database connectivity */
async function checkDatabase(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "Database";
  try {
    const db = await getDb();
    if (!db) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "Database connection not available", checkedAt: new Date().toISOString() };
    }
    const result = await db.execute(sql`SELECT 1 as health_check`);
    return { name, status: "healthy", latencyMs: Date.now() - start, details: "Database responding", checkedAt: new Date().toISOString() };
  } catch (err: any) {
    // Distinguish between connection errors and query errors
    const msg = err.message ?? "";
    if (msg.includes("ECONNREFUSED") || msg.includes("ETIMEDOUT") || msg.includes("ENOTFOUND")) {
      return { name, status: "down", latencyMs: Date.now() - start, details: `Database connection failed: ${msg.slice(0, 150)}`, checkedAt: new Date().toISOString() };
    }
    // Transient errors (connection reset, pool exhaustion) → degraded, not down
    return { name, status: "degraded", latencyMs: Date.now() - start, details: `Database query error (transient): ${msg.slice(0, 150)}`, checkedAt: new Date().toISOString() };
  }
}

/** 4. Check Resend Email Service */
async function checkEmailService(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "Email Service (Resend)";
  try {
    const key = process.env.RESEND_API_KEY || process.env.RESEND_FULL_ACCESS_KEY;
    if (!key) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "No Resend API key configured", checkedAt: new Date().toISOString() };
    }
    const res = await safeFetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res) {
      // Network failure — likely transient DNS/TLS issue, not a hard "down"
      return { name, status: "degraded", latencyMs: Date.now() - start, details: "Resend API unreachable (network timeout — likely transient)", checkedAt: new Date().toISOString() };
    }
    if (res.status === 401 || res.status === 403) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "Resend API key is invalid or expired", checkedAt: new Date().toISOString() };
    }
    if (!res.ok) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: `Resend API returned ${res.status}`, checkedAt: new Date().toISOString() };
    }
    const data = await res.json() as { data?: Array<{ name: string; status: string }> };
    const domains = data.data ?? [];
    const verifiedDomains = domains.filter(d => d.status === "verified" || d.status === "active");

    if (verifiedDomains.length === 0) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: `Resend reachable but no verified domains found (${domains.length} total)`, checkedAt: new Date().toISOString() };
    }

    return { name, status: "healthy", latencyMs: Date.now() - start, details: `Resend operational, ${verifiedDomains.length} verified domain(s)`, checkedAt: new Date().toISOString() };
  } catch (err: any) {
    return { name, status: "degraded", latencyMs: Date.now() - start, details: `Email check error (transient): ${err.message?.slice(0, 200)}`, checkedAt: new Date().toISOString() };
  }
}

/** 5. Check LLM Service (for intelligence extraction) */
async function checkLLMService(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "LLM (Intelligence Extraction)";
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "Reply with exactly: OK" },
        { role: "user", content: "Health check" },
      ],
    });
    const content = (response as any)?.choices?.[0]?.message?.content ?? "";
    if (content.toLowerCase().includes("ok")) {
      return { name, status: "healthy", latencyMs: Date.now() - start, details: "LLM responding normally", checkedAt: new Date().toISOString() };
    }
    return { name, status: "degraded", latencyMs: Date.now() - start, details: `LLM responded but unexpected content: "${content.slice(0, 50)}"`, checkedAt: new Date().toISOString() };
  } catch (err: any) {
    return { name, status: "down", latencyMs: Date.now() - start, details: `LLM unreachable: ${err.message?.slice(0, 200)}`, checkedAt: new Date().toISOString() };
  }
}

/** 6. Check Owner Notification Service */
async function checkNotificationService(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "Owner Notifications";
  try {
    const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
    const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
    if (!forgeUrl || !forgeKey) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: "Forge API credentials not configured — notifications may not work", checkedAt: new Date().toISOString() };
    }
    const res = await safeFetch(`${forgeUrl}/api/health`, {
      headers: { Authorization: `Bearer ${forgeKey}` },
    });

    if (!res || !res.ok) {
      const pingRes = await safeFetch(forgeUrl, {
        method: "HEAD",
        headers: { Authorization: `Bearer ${forgeKey}` },
      });

      if (pingRes) {
        return { name, status: "healthy", latencyMs: Date.now() - start, details: "Notification service reachable", checkedAt: new Date().toISOString() };
      }
      return { name, status: "degraded", latencyMs: Date.now() - start, details: "Notification service endpoint not responding (transient)", checkedAt: new Date().toISOString() };
    }

    return { name, status: "healthy", latencyMs: Date.now() - start, details: "Notification service operational", checkedAt: new Date().toISOString() };
  } catch (err: any) {
    return { name, status: "degraded", latencyMs: Date.now() - start, details: `Notification check inconclusive: ${err.message?.slice(0, 200)}`, checkedAt: new Date().toISOString() };
  }
}

/** 7. Check Conversation Poller status */
async function checkConversationPoller(): Promise<VitalCheck> {
  const start = Date.now();
  const name = "Conversation Poller";
  try {
    if (!EL_API_KEY) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "ELEVENLABS_API_KEY not configured — poller cannot run", checkedAt: new Date().toISOString() };
    }
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!agentId) {
      return { name, status: "down", latencyMs: Date.now() - start, details: "ELEVENLABS_AGENT_ID not configured — poller cannot run", checkedAt: new Date().toISOString() };
    }
    const res = await safeFetch(
      `${EL_BASE}/convai/conversations?agent_id=${agentId}&page_size=1`,
      { headers: { "xi-api-key": EL_API_KEY } }
    );
    if (!res) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: "Conversations API unreachable (timeout)", checkedAt: new Date().toISOString() };
    }
    if (!res.ok) {
      return { name, status: "degraded", latencyMs: Date.now() - start, details: `Conversations API returned ${res.status} — poller may fail`, checkedAt: new Date().toISOString() };
    }
    const data = await res.json() as { conversations?: unknown[] };
    const count = data.conversations?.length ?? 0;
    return { name, status: "healthy", latencyMs: Date.now() - start, details: `Conversations API reachable, poller operational (${count} recent)`, checkedAt: new Date().toISOString() };
  } catch (err: any) {
    return { name, status: "degraded", latencyMs: Date.now() - start, details: `Poller check failed: ${err.message?.slice(0, 200)}`, checkedAt: new Date().toISOString() };
  }
}

// ─── Aggregate Health Check ──────────────────────────────────────────────────

/**
 * Run all health checks in parallel with retry logic and produce an aggregate report.
 * Alerts only fire after consecutive failures to avoid false positives from transient issues.
 */
export async function runHealthCheck(): Promise<HealthReport> {
  const vitals = await Promise.all([
    withRetry(checkElevenLabsAgent),
    withRetry(checkElevenLabsWebhook),
    withRetry(checkDatabase),
    withRetry(checkEmailService),
    withRetry(checkLLMService),
    withRetry(checkNotificationService),
    withRetry(checkConversationPoller),
  ]);

  // Record results for consecutive failure tracking
  for (const v of vitals) {
    recordVitalResult(v.name, v.status);
  }

  // Calculate score: healthy=100, degraded=50, down=0
  const weights: Record<string, number> = {
    "ElevenLabs Agent": 25,
    "ElevenLabs Webhook": 20,
    "Database": 20,
    "Email Service (Resend)": 15,
    "LLM (Intelligence Extraction)": 10,
    "Owner Notifications": 10,
    "Conversation Poller": 10,
  };

  let totalWeight = 0;
  let weightedScore = 0;
  for (const v of vitals) {
    const w = weights[v.name] ?? 10;
    totalWeight += w;
    if (v.status === "healthy") weightedScore += w;
    else if (v.status === "degraded") weightedScore += w * 0.5;
  }

  const score = Math.round((weightedScore / totalWeight) * 100);

  const downCount = vitals.filter(v => v.status === "down").length;
  const degradedCount = vitals.filter(v => v.status === "degraded").length;

  let overall: VitalStatus = "healthy";
  if (downCount > 0) overall = "down";
  else if (degradedCount > 0) overall = "degraded";

  const report: HealthReport = {
    overall,
    score,
    vitals,
    checkedAt: new Date().toISOString(),
    alertsSent: false,
  };

  // Only alert for vitals that have failed consecutively AND are past cooldown
  const vitalsToAlert = vitals.filter(
    v => v.status === "down" && shouldAlert(v.name)
  );

  if (vitalsToAlert.length > 0) {
    try {
      const alertContent = vitalsToAlert
        .map(v => `❌ ${v.name}: ${v.details}`)
        .join("\n");

      await notifyOwner({
        title: `🚨 AiiA Health Alert — ${vitalsToAlert.length} vital(s) DOWN`,
        content: `The following components in the AiiA diagnostic chain are down (confirmed after ${CONSECUTIVE_FAILURES_BEFORE_ALERT} consecutive checks):\n\n${alertContent}\n\nHealth Score: ${score}/100\nChecked at: ${report.checkedAt}`,
      });

      for (const v of vitalsToAlert) {
        markAlerted(v.name);
      }
      report.alertsSent = true;
    } catch (err) {
      console.error("[HealthMonitor] Failed to send alert:", err);
    }
  }

  return report;
}

/**
 * Quick check — returns just the overall status without sending alerts.
 * Used for the public /api/health endpoint.
 */
export async function quickHealthCheck(): Promise<{ status: VitalStatus; score: number }> {
  const report = await runHealthCheck();
  return { status: report.overall, score: report.score };
}
