/**
 * Calendly Webhook Handler
 *
 * Endpoint: POST /api/webhooks/calendly
 *
 * Listens for Calendly `invitee.created` events. When a booking is confirmed,
 * it matches the invitee's email to the most recent lead in the DB and
 * automatically advances that lead's status to "contacted".
 *
 * Security: Calendly signs each request with an HMAC-SHA256 signature using
 * the webhook signing key. We verify this before processing.
 * Set CALENDLY_WEBHOOK_SIGNING_KEY in environment variables.
 *
 * Calendly docs: https://developer.calendly.com/api-docs/ZG9jOjM2MzE2MDM4-webhook-signatures
 */

import type { Request, Response } from "express";
import crypto from "crypto";
import { getLeadByEmail, updateLeadStatus } from "../db";
import { notifyOwner } from "../_core/notification";

const SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY ?? "";

/**
 * Verify Calendly HMAC-SHA256 signature.
 * Calendly sends the signature in the `Calendly-Webhook-Signature` header
 * as `t=<timestamp>,v1=<hex_signature>`.
 */
function verifyCalendlySignature(rawBody: Buffer, header: string | undefined): boolean {
  if (!SIGNING_KEY) {
    // If no signing key is configured, skip verification (dev/test mode)
    console.warn("[CalendlyWebhook] No signing key configured — skipping signature verification");
    return true;
  }
  if (!header) return false;

  // Parse header: "t=1234567890,v1=abcdef..."
  const parts: Record<string, string> = {};
  for (const part of header.split(",")) {
    const [k, v] = part.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }

  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  // Reconstruct the signed payload: "<timestamp>.<rawBody>"
  const signedPayload = `${timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(signedPayload)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
}

export async function handleCalendlyWebhook(req: Request, res: Response): Promise<void> {
  // req.rawBody is populated by the raw body middleware registered in index.ts
  const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));
  const signatureHeader = req.headers["calendly-webhook-signature"] as string | undefined;

  if (!verifyCalendlySignature(rawBody, signatureHeader)) {
    console.warn("[CalendlyWebhook] Signature verification failed");
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  const event = req.body;
  const eventType: string = event?.event ?? "";

  // Only process booking confirmations
  if (eventType !== "invitee.created") {
    res.status(200).json({ received: true, processed: false, reason: "event_type_ignored" });
    return;
  }

  const invitee = event?.payload?.invitee;
  const email: string | undefined = invitee?.email;
  const name: string | undefined = invitee?.name;
  const eventName: string | undefined = event?.payload?.event_type?.name;
  const scheduledAt: string | undefined = event?.payload?.event?.start_time;

  if (!email) {
    console.warn("[CalendlyWebhook] No invitee email in payload");
    res.status(200).json({ received: true, processed: false, reason: "no_email" });
    return;
  }

  try {
    const lead = await getLeadByEmail(email.toLowerCase().trim());

    if (!lead) {
      console.log(`[CalendlyWebhook] No lead found for email: ${email}`);
      res.status(200).json({ received: true, processed: false, reason: "lead_not_found" });
      return;
    }

    // Only advance if not already in a later stage
    const advanceable: typeof lead.status[] = ["new", "diagnostic_ready", "reviewed"];
    if (advanceable.includes(lead.status)) {
      await updateLeadStatus(lead.id, "contacted");
      console.log(`[CalendlyWebhook] Lead #${lead.id} (${email}) → contacted`);

      // Notify owner
      const scheduledStr = scheduledAt
        ? new Date(scheduledAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
        : "time TBD";
      await notifyOwner({
        title: `📅 CALL BOOKED — ${lead.name}${lead.company ? ` | ${lead.company}` : ""}`,
        content: `${name ?? lead.name} (${email}) just booked a ${eventName ?? "call"} for ${scheduledStr}.\n\nLead #${lead.id} status automatically advanced to Contacted.`,
      });
    } else {
      console.log(`[CalendlyWebhook] Lead #${lead.id} already in status "${lead.status}" — no update needed`);
    }

    res.status(200).json({ received: true, processed: true, leadId: lead.id });
  } catch (err) {
    console.error("[CalendlyWebhook] Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
