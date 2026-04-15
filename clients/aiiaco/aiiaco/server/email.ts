/**
 * AiiACo Transactional Email — Resend
 *
 * Three email functions:
 * 1. sendEmail() — generic email sender (used by webhooks, etc.)
 * 2. sendLeadConfirmationEmail() — branded intake confirmation for form leads
 * 3. sendOwnerPilotBrief() — magnificent pilot brief email to owner (go@aiiaco.com)
 *
 * The full AI diagnostic is NEVER included in lead-facing emails — it goes only
 * to the owner via the pilot brief email.
 */

import { Resend } from "resend";
import { sanitizeName } from "./emailTemplates";

const CALL_PREF_LABELS: Record<string, string> = {
  morning: "Morning — Weekdays 8am to 12pm",
  afternoon: "Afternoon — Weekdays 12pm to 5pm",
  weekdays: "Any weekday — morning or afternoon",
  anytime: "Anytime — flexible",
  "Calendly booking": "Your selected Calendly time slot",
};

const OWNER_EMAIL = "go@aiiaco.com";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

/**
 * Generic email sender — used by webhooks and other server-side code.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Optional lead ID for email tracking — will be sent as a Resend tag */
  leadId?: number;
}): Promise<{ success: boolean; emailId?: string }> {
  const { to, subject, html, text, leadId } = params;
  try {
    const resend = getResend();
    const tags: { name: string; value: string }[] = [{ name: "source", value: "aiiaco" }];
    if (leadId) tags.push({ name: "lead_id", value: String(leadId) });
    const result = await resend.emails.send({
      from: "AiiACo <team@aiiaco.com>",
      replyTo: OWNER_EMAIL,
      to: [to],
      subject,
      html,
      text,
      tags,
    });
    if (result.error) {
      console.error("[Email] Resend error:", result.error);
      return { success: false };
    }
    console.log("[Email] Sent to:", to, "| id:", result.data?.id);
    return { success: true, emailId: result.data?.id };
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return { success: false };
  }
}

/**
 * Send the magnificent pilot brief email to the owner.
 * Uses the full-access Resend key if available (can send to any domain),
 * falls back to the regular key.
 */
export async function sendOwnerPilotBrief(params: {
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const { subject, html, text } = params;
  try {
    // Prefer RESEND_FULL_ACCESS_KEY for owner emails (can send to any address)
    const key = process.env.RESEND_FULL_ACCESS_KEY || process.env.RESEND_API_KEY;
    if (!key) {
      console.error("[Email] No Resend API key configured for owner pilot brief");
      return false;
    }
    const resend = new Resend(key);
    const result = await resend.emails.send({
      from: "AiiA Intelligence <team@aiiaco.com>",
      replyTo: OWNER_EMAIL,
      to: [OWNER_EMAIL],
      subject,
      html,
      text,
    });
    if (result.error) {
      console.error("[Email] Owner pilot brief Resend error:", result.error);
      return false;
    }
    console.log("[Email] Owner pilot brief sent | id:", result.data?.id);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send owner pilot brief:", err);
    return false;
  }
}

export async function sendLeadConfirmationEmail(params: {
  name: string;
  email: string;
  company?: string | null;
  callPreference?: string | null;
  isCalendly?: boolean;
  leadBrief?: string;
}): Promise<boolean> {
  const { name, email, company, callPreference, isCalendly = false, leadBrief } = params;

  const cleanName = sanitizeName(name);
  const firstName = cleanName ? cleanName.split(" ")[0] : null;
  const callLabel =
    CALL_PREF_LABELS[callPreference ?? ""] ??
    callPreference ??
    "a time that works for you";

  // Meeting confirmation block copy
  const meetingHeading = isCalendly
    ? "Your Calendly booking is confirmed."
    : "Your call-back request has been received.";

  const meetingBody = isCalendly
    ? `You selected a specific time slot via Calendly. You should have received a calendar invite. If you need to reschedule, use the link in that invite.`
    : `One of our team will call you during your preferred window: <strong>${callLabel}</strong>. If your availability changes, simply reply to this email.`;

  // Lead brief section — only shown if brief was generated
  const briefSection = leadBrief
    ? `
    <div class="section-label">INITIAL ASSESSMENT</div>
    <p class="brief-text">${leadBrief.replace(/\n/g, "<br/>")}</p>
    <p class="brief-note">We will walk you through the full picture and discuss potential next steps on the call.</p>`
    : "";

  const briefTextSection = leadBrief
    ? `\nINITIAL ASSESSMENT\n${leadBrief}\n\nWe will walk you through the full picture and discuss potential next steps on the call.\n`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Request — AiiACo</title>
  <style>
    body {
      margin: 0; padding: 0;
      background-color: #03050A;
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      color: #C8D7E6;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .logo {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.20em;
      color: rgba(184,156,74,0.90);
      text-transform: uppercase;
      margin-bottom: 36px;
    }
    .divider-gold {
      width: 48px;
      height: 1px;
      background: linear-gradient(90deg, rgba(184,156,74,0.80), rgba(184,156,74,0.15));
      margin-bottom: 32px;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #F0F4F8;
      margin: 0 0 14px 0;
      line-height: 1.3;
    }
    p {
      font-size: 15px;
      line-height: 1.75;
      color: rgba(200,215,230,0.80);
      margin: 0 0 18px 0;
    }
    .meeting-block {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      padding: 20px 22px;
      margin: 28px 0;
    }
    .meeting-heading {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: rgba(240,192,80,0.90);
      margin: 0 0 8px 0;
      text-transform: uppercase;
    }
    .meeting-body {
      font-size: 14px;
      line-height: 1.65;
      color: rgba(200,215,230,0.75);
      margin: 0;
    }
    .section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: rgba(184,156,74,0.60);
      text-transform: uppercase;
      margin: 32px 0 10px 0;
    }
    .divider-thin {
      width: 100%;
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 28px 0;
    }
    .brief-text {
      font-size: 15px;
      line-height: 1.75;
      color: rgba(200,215,230,0.85);
      margin: 0 0 14px 0;
      font-style: italic;
    }
    .brief-note {
      font-size: 13px;
      color: rgba(200,215,230,0.50);
      margin: 0;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 12px;
      color: rgba(200,215,230,0.30);
      line-height: 1.6;
    }
    a { color: rgba(184,156,74,0.75); text-decoration: none; }
    strong { color: rgba(240,192,80,0.90); font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="logo">AiiACo</div>
    <div class="divider-gold"></div>

    <h1>${firstName ? `${firstName}, your` : `Your`} request has been received.</h1>

    <p>
      Thank you for taking the time to walk us through your situation${company ? ` at <strong>${company}</strong>` : ""}.
      We've reviewed your answers and prepared an initial assessment of your operational landscape.
    </p>

    <div class="meeting-block">
      <p class="meeting-heading">${meetingHeading}</p>
      <p class="meeting-body">${meetingBody}</p>
    </div>

    ${briefSection ? `<div class="divider-thin"></div>${briefSection}` : ""}

    <div class="divider-thin"></div>

    <p style="color: rgba(200,215,230,0.55); font-size: 14px; margin-top: 8px;">
      If you have any questions before the call, reply directly to this email.
    </p>

    <p style="color: rgba(200,215,230,0.55); font-size: 14px;">
      — The AiiACo Team
    </p>

    <div class="footer">
      <p style="margin:0;">
        AiiACo &nbsp;·&nbsp; AI Integration Authority for the Corporate Age<br />
        <a href="https://aiiaco.com">aiiaco.com</a>
      </p>
      <p style="margin: 8px 0 0 0;">
        You received this email because you submitted a request on aiiaco.com.
      </p>
    </div>

  </div>
</body>
</html>`;

  const text = `AiiACo — ${firstName ? `${firstName}, your` : `Your`} request has been received.

Thank you for taking the time to walk us through your situation${company ? ` at ${company}` : ""}.

${meetingHeading}
${meetingBody.replace(/<[^>]+>/g, "")}
${briefTextSection}
If you have any questions before the call, reply directly to this email.

— The AiiACo Team
aiiaco.com`;

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: "AiiACo <team@aiiaco.com>",
      replyTo: OWNER_EMAIL,
      to: [email],
      subject: firstName ? `${firstName}, your AiiACo request is confirmed` : `Your AiiACo request is confirmed`,
      html,
      text,
    });

    if (result.error) {
      console.error("[Email] Resend error:", result.error);
      return false;
    }

    console.log("[Email] Confirmation sent to:", email, "| id:", result.data?.id);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send confirmation:", err);
    return false;
  }
}
