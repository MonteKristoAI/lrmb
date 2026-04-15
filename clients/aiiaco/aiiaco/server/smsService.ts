/**
 * AiiACo SMS Engagement Service
 * ─────────────────────────────
 * Intelligent SMS pipeline via Telnyx with:
 * - Rate limiting: 2 SMS/phone/24h, 4 SMS/phone/4 days
 * - Context-aware message templates by call outcome
 * - Telnyx native scheduling (send_at) for delayed sends
 * - Delivery tracking via sms_events table
 *
 * SOP: Every lead with a valid phone number gets a text.
 * - Incomplete calls (< 60s): 20-min delayed warm reconnect
 * - Short calls (60-120s): 30-min delayed follow-up
 * - Complete calls: 5-min delay (after email), warm relationship text
 * - Diagnostic ready: after pilot brief, strategy call CTA
 */

import { eq, and, gte, sql } from "drizzle-orm";
import { smsEvents } from "../drizzle/schema";
import { getDb } from "./db";

/* ─── Constants ─── */
const TELNYX_API_KEY = process.env.TELNYX_API_KEY ?? "";
const TELNYX_API_URL = "https://api.telnyx.com/v2";
const AIIA_PHONE = "+18888080001";
const CALENDLY_URL = "https://calendly.com/aiiaco";
const MAX_SMS_PER_DAY = 2;
const MAX_SMS_PER_4_DAYS = 4;

/* ─── Types ─── */
export type SmsMessageType =
  | "incomplete_followup"    // Call < 60s — immediate
  | "short_followup"         // Call 60-120s — 30min delay
  | "post_email_warmup"      // Complete call — after email sent
  | "diagnostic_ready"       // After pilot brief generated
  | "continue_conversation"; // Manual/admin triggered warm follow-up

export interface SmsContext {
  leadId: number;
  phone: string;              // E.164 format
  firstName?: string | null;
  company?: string | null;
  callDurationSeconds?: number | null;
  conversationSummary?: string | null;
  callTrack?: string | null;
  painPoints?: string | null;
}

interface TelnyxSendResult {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
  cost?: string;
}

/* ─── Rate Limiter ─── */

/**
 * Check if we can send an SMS to this phone number.
 * Rules: max 2 per 24 hours, max 4 per 4 days.
 * Returns { allowed: boolean, reason?: string }
 */
export async function checkSmsRateLimit(phone: string): Promise<{ allowed: boolean; reason?: string }> {
  const db = await getDb();
  if (!db) return { allowed: false, reason: "Database unavailable" };

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return { allowed: false, reason: "Invalid phone number" };

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  // Count SMS in last 24 hours (exclude rate_limited and failed)
  const [dayCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(smsEvents)
    .where(
      and(
        eq(smsEvents.phone, normalizedPhone),
        gte(smsEvents.createdAt, oneDayAgo),
        sql`${smsEvents.status} NOT IN ('rate_limited', 'failed')`
      )
    );

  if ((dayCount?.count ?? 0) >= MAX_SMS_PER_DAY) {
    return { allowed: false, reason: `Rate limited: ${dayCount?.count}/${MAX_SMS_PER_DAY} SMS in 24h` };
  }

  // Count SMS in last 4 days
  const [fourDayCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(smsEvents)
    .where(
      and(
        eq(smsEvents.phone, normalizedPhone),
        gte(smsEvents.createdAt, fourDaysAgo),
        sql`${smsEvents.status} NOT IN ('rate_limited', 'failed')`
      )
    );

  if ((fourDayCount?.count ?? 0) >= MAX_SMS_PER_4_DAYS) {
    return { allowed: false, reason: `Rate limited: ${fourDayCount?.count}/${MAX_SMS_PER_4_DAYS} SMS in 4 days` };
  }

  return { allowed: true };
}

/* ─── Phone Number Normalization ─── */

/**
 * Normalize phone to E.164 format (+1XXXXXXXXXX for US numbers).
 * Returns null if invalid.
 */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  // Strip everything except digits and leading +
  let cleaned = phone.replace(/[^\d+]/g, "");
  // If starts with +, keep it; otherwise assume US
  if (cleaned.startsWith("+")) {
    // Already has country code
    if (cleaned.length >= 11) return cleaned;
    return null;
  }
  // US number: 10 digits → +1XXXXXXXXXX
  if (cleaned.length === 10) return `+1${cleaned}`;
  // US number with 1 prefix: 11 digits → +1XXXXXXXXXX
  if (cleaned.length === 11 && cleaned.startsWith("1")) return `+${cleaned}`;
  return null;
}

/* ─── Message Templates ─── */

/**
 * Generate context-aware SMS text based on message type and lead context.
 * All messages are warm, professional, and AiiA-branded.
 */
export function buildSmsText(type: SmsMessageType, ctx: SmsContext): string {
  const name = ctx.firstName || "there";
  const company = ctx.company ? ` at ${ctx.company}` : "";

  switch (type) {
    case "incomplete_followup":
      return (
        `Hi ${name}, this is AiA from AiiACo. ` +
        `Looks like we got disconnected — no worries at all. ` +
        `Whenever you're ready, you can call us back or book a quick intro here: ${CALENDLY_URL}\n\n` +
        `— AiiACo`
      );

    case "short_followup":
      return (
        `Hi ${name}, it was great hearing from you${company}. ` +
        `We barely scratched the surface — I'd love to continue our conversation. ` +
        `Book 15 minutes and we'll pick up right where we left off: ${CALENDLY_URL}\n\n` +
        `— AiiACo`
      );

    case "post_email_warmup":
      return (
        `Hi ${name}, just sent you an email with a summary of our conversation and your initial assessment. ` +
        `Check your inbox — and if you have any questions, reply to the email or book time here: ${CALENDLY_URL}\n\n` +
        `It was a pleasure talking with you. — AiiACo`
      );

    case "diagnostic_ready":
      return (
        `Hi ${name}, your pilot brief is ready. ` +
        `We've put together a tailored assessment based on our conversation${company}. ` +
        `Book a strategy call to walk through it together: ${CALENDLY_URL}\n\n` +
        `— AiiACo`
      );

    case "continue_conversation":
      return (
        `Hi ${name}, this is AiA from AiiACo. ` +
        `We'd love to pick up where we left off and learn more about what you're working on${company}. ` +
        `Here's a link to book a quick call: ${CALENDLY_URL}\n\n` +
        `— AiiACo`
      );

    default:
      return (
        `Hi ${name}, thanks for reaching out to AiiACo. ` +
        `Book a call with our team: ${CALENDLY_URL}\n\n` +
        `— AiiACo`
      );
  }
}

/* ─── Telnyx SMS Sender ─── */

/**
 * Send an SMS via Telnyx API.
 * Supports immediate send (no sendAt) or scheduled send (sendAt in ISO 8601 UTC).
 */
async function telnyxSend(to: string, text: string, sendAt?: string): Promise<TelnyxSendResult> {
  if (!TELNYX_API_KEY) {
    return { success: false, error: "TELNYX_API_KEY not configured" };
  }

  try {
    const body: Record<string, unknown> = {
      from: AIIA_PHONE,
      to,
      text,
      type: "SMS",
    };
    if (sendAt) {
      body.send_at = sendAt;
    }

    const res = await fetch(`${TELNYX_API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TELNYX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[SMS] Telnyx error ${res.status}: ${errBody}`);
      return { success: false, error: `Telnyx ${res.status}: ${errBody}` };
    }

    const json = await res.json() as {
      data: {
        id: string;
        to: Array<{ status: string }>;
        cost?: { amount: string };
      };
    };

    return {
      success: true,
      messageId: json.data.id,
      status: json.data.to?.[0]?.status ?? "queued",
      cost: json.data.cost?.amount,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[SMS] Send failed: ${msg}`);
    return { success: false, error: msg };
  }
}

/* ─── Main Send Function ─── */

/**
 * Send an SMS to a lead with rate limiting, template generation, and event tracking.
 * Returns { sent: boolean, reason?: string, smsEventId?: number }
 */
export async function sendLeadSms(
  type: SmsMessageType,
  ctx: SmsContext,
  delayMinutes?: number
): Promise<{ sent: boolean; reason?: string; smsEventId?: number }> {
  const db = await getDb();
  if (!db) return { sent: false, reason: "Database unavailable" };

  const phone = normalizePhone(ctx.phone);
  if (!phone) return { sent: false, reason: "Invalid phone number" };

  // Filter out AiiA's own number
  if (phone === AIIA_PHONE) return { sent: false, reason: "Cannot SMS AiiA's own number" };

  // Rate limit check
  const rateCheck = await checkSmsRateLimit(phone);
  if (!rateCheck.allowed) {
    // Record the rate-limited attempt
    await db.insert(smsEvents).values({
      leadId: ctx.leadId,
      phone,
      messageType: type,
      messageText: "(rate limited — not sent)",
      status: "rate_limited",
    });
    console.log(`[SMS] Rate limited for ${phone}: ${rateCheck.reason}`);
    return { sent: false, reason: rateCheck.reason };
  }

  // Build message
  const messageText = buildSmsText(type, ctx);

  // Calculate scheduled time if delayed
  let sendAt: string | undefined;
  let scheduledFor: Date | undefined;
  if (delayMinutes && delayMinutes >= 5) {
    // Telnyx requires at least 5 min in the future
    scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);
    sendAt = scheduledFor.toISOString();
  } else if (delayMinutes && delayMinutes > 0 && delayMinutes < 5) {
    // Less than 5 min: Telnyx minimum is 5 min, so bump to 5
    scheduledFor = new Date(Date.now() + 5 * 60 * 1000);
    sendAt = scheduledFor.toISOString();
  }

  // Send via Telnyx
  const result = await telnyxSend(phone, messageText, sendAt);

  // Record event
  const [insertResult] = await db.insert(smsEvents).values({
    leadId: ctx.leadId,
    phone,
    messageType: type,
    messageText,
    telnyxMessageId: result.messageId ?? null,
    status: result.success ? (sendAt ? "scheduled" : "queued") : "failed",
    scheduledFor: scheduledFor ?? null,
    sentAt: sendAt ? null : (result.success ? new Date() : null),
    errorMessage: result.error ?? null,
    costAmount: result.cost ?? null,
  });

  if (result.success) {
    console.log(
      `[SMS] ${sendAt ? "Scheduled" : "Sent"} ${type} to ${phone} (lead ${ctx.leadId})` +
      (sendAt ? ` for ${scheduledFor?.toISOString()}` : "") +
      ` — Telnyx ID: ${result.messageId}`
    );
  } else {
    console.error(`[SMS] Failed ${type} to ${phone} (lead ${ctx.leadId}): ${result.error}`);
  }

  return {
    sent: result.success,
    reason: result.error,
    smsEventId: (insertResult as any)?.insertId,
  };
}

/* ─── Convenience Functions for Each Sequence ─── */

/** Incomplete call (< 60s): send after 20 min delay */
export function sendIncompleteFollowup(ctx: SmsContext) {
  return sendLeadSms("incomplete_followup", ctx, 20);
}

/** Short call (60-120s): send after 30 min delay */
export function sendShortFollowup(ctx: SmsContext) {
  return sendLeadSms("short_followup", ctx, 30);
}

/** Complete call: send 5 min after email (warm relationship text) */
export function sendPostEmailWarmup(ctx: SmsContext) {
  return sendLeadSms("post_email_warmup", ctx, 5);
}

/** Diagnostic ready: send after pilot brief is generated */
export function sendDiagnosticReadySms(ctx: SmsContext) {
  return sendLeadSms("diagnostic_ready", ctx, 5);
}

/** Continue conversation: manual/admin triggered */
export function sendContinueConversation(ctx: SmsContext) {
  return sendLeadSms("continue_conversation", ctx);
}

/* ─── Query Helpers ─── */

/** Get all SMS events for a specific lead */
export async function getSmsEventsForLead(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(smsEvents)
    .where(eq(smsEvents.leadId, leadId))
    .orderBy(sql`${smsEvents.createdAt} DESC`);
}

/** Get SMS stats for analytics dashboard */
export async function getSmsStats() {
  const db = await getDb();
  if (!db) return { total: 0, delivered: 0, failed: 0, rateLimited: 0, scheduled: 0 };

  const [stats] = await db
    .select({
      total: sql<number>`count(*)`,
      delivered: sql<number>`SUM(CASE WHEN ${smsEvents.status} IN ('sent', 'delivered', 'queued') THEN 1 ELSE 0 END)`,
      failed: sql<number>`SUM(CASE WHEN ${smsEvents.status} = 'failed' THEN 1 ELSE 0 END)`,
      rateLimited: sql<number>`SUM(CASE WHEN ${smsEvents.status} = 'rate_limited' THEN 1 ELSE 0 END)`,
      scheduled: sql<number>`SUM(CASE WHEN ${smsEvents.status} = 'scheduled' THEN 1 ELSE 0 END)`,
    })
    .from(smsEvents);

  return {
    total: stats?.total ?? 0,
    delivered: stats?.delivered ?? 0,
    failed: stats?.failed ?? 0,
    rateLimited: stats?.rateLimited ?? 0,
    scheduled: stats?.scheduled ?? 0,
  };
}

/** Get recent SMS events for analytics feed */
export async function getRecentSmsEvents(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(smsEvents)
    .orderBy(sql`${smsEvents.createdAt} DESC`)
    .limit(limit);
}
