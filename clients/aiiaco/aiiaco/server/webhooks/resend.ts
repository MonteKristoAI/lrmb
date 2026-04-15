/**
 * Resend Email Tracking Webhook Handler
 *
 * Endpoint: POST /api/webhooks/resend
 *
 * Receives email events from Resend (sent, delivered, opened, clicked, bounced, complained).
 * Verifies the webhook signature using svix, then stores the event in the email_events table.
 * Links events to leads via the `lead_id` tag or by matching the recipient email.
 */

import type { Request, Response } from "express";
import { Webhook } from "svix";
import { insertEmailEvent, findLeadIdByEmail } from "../db";

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET ?? "";

/** Supported event types we track */
const TRACKED_EVENTS = new Set([
  "email.sent",
  "email.delivered",
  "email.opened",
  "email.clicked",
  "email.bounced",
  "email.complained",
  "email.delivery_delayed",
]);

export async function handleResendWebhook(req: Request, res: Response): Promise<void> {
  const rawBody: string = (req as any).rawBodyText ?? "";

  // ── Verify signature ────────────────────────────────────────────────────────
  if (!RESEND_WEBHOOK_SECRET) {
    console.warn("[ResendWebhook] No RESEND_WEBHOOK_SECRET configured — skipping verification");
  }

  let payload: any;
  try {
    if (RESEND_WEBHOOK_SECRET) {
      const wh = new Webhook(RESEND_WEBHOOK_SECRET);
      payload = wh.verify(rawBody, {
        "svix-id": req.headers["svix-id"] as string ?? "",
        "svix-timestamp": req.headers["svix-timestamp"] as string ?? "",
        "svix-signature": req.headers["svix-signature"] as string ?? "",
      });
    } else {
      payload = JSON.parse(rawBody);
    }
  } catch (err) {
    console.error("[ResendWebhook] Signature verification failed:", err);
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  // ── Parse event ─────────────────────────────────────────────────────────────
  const eventType: string = payload?.type ?? "";
  if (!TRACKED_EVENTS.has(eventType)) {
    // Acknowledge but don't store untracked event types
    console.log(`[ResendWebhook] Ignoring event type: ${eventType}`);
    res.status(200).json({ received: true, tracked: false });
    return;
  }

  const data = payload?.data ?? {};
  const emailId: string = data.email_id ?? "";
  const recipientEmails: string[] = Array.isArray(data.to) ? data.to : [];
  const recipientEmail = recipientEmails[0] ?? "";
  const subject: string = data.subject ?? "";
  const tags: Record<string, string> = data.tags ?? {};
  const click = data.click ?? null;

  // ── Resolve lead ID ─────────────────────────────────────────────────────────
  // Priority: tag > email lookup
  let leadId: number | null = null;
  if (tags.lead_id) {
    leadId = parseInt(tags.lead_id, 10);
    if (isNaN(leadId)) leadId = null;
  }
  if (!leadId && recipientEmail) {
    try {
      leadId = await findLeadIdByEmail(recipientEmail);
    } catch (err) {
      console.warn("[ResendWebhook] Failed to resolve lead by email:", err);
    }
  }

  // ── Parse event timestamp ───────────────────────────────────────────────────
  let eventTimestamp: Date | null = null;
  const tsStr = click?.timestamp ?? data.created_at ?? payload?.created_at;
  if (tsStr) {
    const parsed = new Date(tsStr);
    if (!isNaN(parsed.getTime())) eventTimestamp = parsed;
  }

  // ── Store event ─────────────────────────────────────────────────────────────
  try {
    await insertEmailEvent({
      emailId,
      eventType,
      recipientEmail,
      leadId,
      subject,
      clickedLink: click?.link ?? null,
      clickUserAgent: click?.userAgent ?? null,
      clickIpAddress: click?.ipAddress ?? null,
      eventTimestamp,
      rawPayload: rawBody,
    });

    console.log(`[ResendWebhook] Stored ${eventType} for ${recipientEmail}${leadId ? ` (lead ${leadId})` : ""}`);
  } catch (err) {
    console.error("[ResendWebhook] Failed to insert email event:", err);
    // Still return 200 to prevent Resend from retrying
  }

  res.status(200).json({ received: true, tracked: true, eventType, leadId });
}
