/**
 * Retroactive Diagnostic Runner
 * Runs the full diagnostic flow for a specific lead by ID.
 * Usage: node scripts/retroactive-diagnostic.mjs <leadId>
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const LEAD_ID = parseInt(process.argv[2] || "1", 10);
const BASE_URL = process.env.SERVER_URL || "http://localhost:3000";

// We'll call the internal tRPC endpoint directly via HTTP
// First, get the lead from the DB, then run the diagnostic module

import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await conn.execute(
  "SELECT * FROM leads WHERE id = ?",
  [LEAD_ID]
);

if (!rows.length) {
  console.error(`No lead found with ID ${LEAD_ID}`);
  process.exit(1);
}

const lead = rows[0];
// Convert date strings to Date objects
lead.createdAt = new Date(lead.createdAt);
lead.updatedAt = new Date(lead.updatedAt);

console.log(`\nRunning retroactive diagnostic for lead #${lead.id}: ${lead.name} (${lead.email})`);
console.log(`Company: ${lead.company || "N/A"}`);
console.log(`Problem: ${lead.problemCategory || "N/A"}`);
console.log(`Call Preference: ${lead.callPreference || "N/A"}`);
console.log("\nGenerating diagnostic...\n");

// Dynamically import the compiled server module
// We need to run this via ts-node or the compiled output
// Instead, we'll replicate the logic inline using the raw API calls

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;

if (!FORGE_URL || !FORGE_KEY) {
  console.error("Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

// ─── Problem → AiiACo signal mapping ─────────────────────────────────────────
const PROBLEM_SIGNAL_MAP = {
  "We're growing but can't scale without adding headcount": {
    pillars: "AI Revenue Engine + Operational AI Systems",
    urgency: "Critical",
    context: "Business is at a headcount ceiling - every new dollar of revenue requires a new hire. Classic operational scaling problem that AI execution layers solve directly.",
  },
  "My team is buried in manual tasks and repetitive work": {
    pillars: "Operational AI Systems",
    urgency: "High",
    context: "Operational drag from manual processes is consuming team capacity that should be directed toward revenue-generating activities.",
  },
  "We're losing leads or clients due to slow follow-up": {
    pillars: "AI Revenue Engine",
    urgency: "Critical",
    context: "Revenue leakage at the follow-up stage - a direct, quantifiable problem that AI-driven outreach and CRM automation resolves.",
  },
  "Our data is scattered and leadership can't see what's happening": {
    pillars: "Operational AI Systems + AI Revenue Engine",
    urgency: "High",
    context: "Visibility gap at the leadership level - decisions are being made without real-time operational data, creating strategic blind spots.",
  },
  "We have tools but they don't talk to each other": {
    pillars: "Operational AI Systems",
    urgency: "Medium",
    context: "Technology fragmentation creating coordination overhead. Integration and orchestration layer needed.",
  },
  "We want to add AI but don't know where to start": {
    pillars: "Full Diagnostic Required",
    urgency: "Medium",
    context: "Early-stage AI adoption - needs a structured discovery to identify the highest-leverage entry points before implementation.",
  },
};

const signal = PROBLEM_SIGNAL_MAP[lead.problemCategory] || {
  pillars: "Full Diagnostic Required",
  urgency: "Medium",
  context: "Problem category not mapped - requires full discovery conversation.",
};

const CALL_PREF_LABELS = {
  morning: "Morning (Weekdays 8am - 12pm)",
  afternoon: "Afternoon (Weekdays 12pm - 5pm)",
  evening: "Evening (Weekdays 5pm - 8pm)",
  flexible: "Flexible - Any Time",
  "Calendly booking": "Calendly Booking",
};
const callPrefLabel = CALL_PREF_LABELS[lead.callPreference] || lead.callPreference || "Not specified";

// ─── LLM Call ─────────────────────────────────────────────────────────────────
const systemPrompt = `You are AiiACo's senior AI strategist. You generate structured lead diagnostics for the internal sales team.

AiiACo is the AI Integration Authority for the Corporate Age. We operate across three pillars:
1. AI Revenue Engine - automated lead follow-up, CRM activation, revenue workflow automation
2. Operational AI Systems - workflow automation, process intelligence, coordination layer
3. AI Workforce - AI-augmented team capabilities, training, and embedded AI roles

Your output must be a JSON object with exactly these six fields:
- recap_snapshot: 1-2 sentences. Who this person is and what kind of business they run.
- what_they_told_us: 2-3 sentences. What they shared about their challenges, in plain language.
- full_diagnostic: 3-5 sentences. Deep analysis of the root cause and business impact. Be specific and direct.
- solution_areas: 2-3 sentences. Which AiiACo pillars apply and why. Be concrete.
- sales_call_next_steps: Exactly 3 numbered action items for the sales call. Each should be a specific question or discovery task.
- lead_brief: 2-3 sentences. A warm, professional summary written TO the lead (not about them). This is what they will receive in their confirmation email. Do NOT mention internal analysis, diagnostics, or sales process. Frame it as: "Based on what you've shared, [observation]. We'll walk you through [what we'll cover] on the call."

Respond ONLY with valid JSON. No markdown, no explanation.`;

const userPrompt = `Lead Profile:
Name: ${lead.name}
Company: ${lead.company || "Not provided"}
Email: ${lead.email}
Phone: ${lead.phone || "Not provided"}
Problem Category: ${lead.problemCategory || "Not specified"}
Problem Detail: ${lead.problemDetail || "None provided"}
Call Preference: ${callPrefLabel}
Lead Source: ${lead.leadSource || "Direct"}
Submitted: ${lead.createdAt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

AiiACo Signal Analysis:
Primary Pillars: ${signal.pillars}
Urgency Level: ${signal.urgency}
Context: ${signal.context}

Generate the full diagnostic JSON now.`;

let result;
try {
  const llmRes = await fetch(`${FORGE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FORGE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lead_diagnostic",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recap_snapshot: { type: "string" },
              what_they_told_us: { type: "string" },
              full_diagnostic: { type: "string" },
              solution_areas: { type: "string" },
              sales_call_next_steps: { type: "string" },
              lead_brief: { type: "string" },
            },
            required: ["recap_snapshot", "what_they_told_us", "full_diagnostic", "solution_areas", "sales_call_next_steps", "lead_brief"],
            additionalProperties: false,
          },
        },
      },
    }),
  });

  const llmData = await llmRes.json();
  const raw = llmData.choices?.[0]?.message?.content;
  result = JSON.parse(raw);
  console.log("✓ Diagnostic generated successfully\n");
} catch (err) {
  console.error("LLM call failed:", err.message);
  result = {
    recap_snapshot: `${lead.name} - ${lead.company || "business owner"}.`,
    what_they_told_us: lead.problemCategory || "Shared operational challenges.",
    full_diagnostic: "Diagnostic generation failed - requires manual review.",
    solution_areas: signal.pillars,
    sales_call_next_steps: "1. Understand current operational bottlenecks\n2. Identify highest-leverage AI entry points\n3. Discuss engagement model fit",
    lead_brief: "Thank you for sharing your situation with us. Based on what you've described, we've identified some clear areas where operational improvements could make a meaningful difference for your business. We'll walk you through our findings on the call.",
  };
}

// ─── Save to DB ───────────────────────────────────────────────────────────────
const fullDiagnosticText = [
  `WHO THEY ARE\n${result.recap_snapshot}`,
  `WHAT THEY TOLD US\n${result.what_they_told_us}`,
  `FULL DIAGNOSTIC\n${result.full_diagnostic}`,
  `SOLUTION AREAS\n${result.solution_areas}`,
  `SALES CALL - NEXT STEPS\n${result.sales_call_next_steps}`,
].join("\n\n");

await conn.execute(
  "UPDATE leads SET diagnosticSnapshot = ?, leadBrief = ?, status = 'reviewed', updatedAt = NOW() WHERE id = ?",
  [fullDiagnosticText, result.lead_brief, lead.id]
);
console.log("✓ Diagnostic saved to database\n");

// ─── Owner Notification ───────────────────────────────────────────────────────
const notifTitle = `RETROACTIVE DIAGNOSTIC - ${lead.name}${lead.company ? ` | ${lead.company}` : ""} | ${callPrefLabel}`;
const notifContent = [
  `LEAD PROFILE`,
  `Name: ${lead.name}`,
  `Email: ${lead.email}`,
  `Phone: ${lead.phone || "Not provided"}`,
  `Company: ${lead.company || "Not provided"}`,
  `Source: ${lead.leadSource || "Direct"}`,
  `Call Preference: ${callPrefLabel}`,
  `Submitted: ${lead.createdAt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
  ``,
  `WHO THEY ARE`,
  result.recap_snapshot,
  ``,
  `WHAT THEY TOLD US`,
  result.what_they_told_us,
  ``,
  `FULL DIAGNOSTIC`,
  result.full_diagnostic,
  ``,
  `SOLUTION AREAS`,
  result.solution_areas,
  ``,
  `SALES CALL - NEXT STEPS`,
  result.sales_call_next_steps,
  ``,
  `─────────────────────────────────────`,
  `PREVIEW - WHAT THE LEAD WILL RECEIVE`,
  result.lead_brief,
].join("\n");

const notifBase = FORGE_URL.endsWith("/") ? FORGE_URL : `${FORGE_URL}/`;
const notifEndpoint = new URL("webdevtoken.v1.WebDevService/SendNotification", notifBase).toString();
const notifRes = await fetch(notifEndpoint, {
  method: "POST",
  headers: {
    accept: "application/json",
    authorization: `Bearer ${FORGE_KEY}`,
    "content-type": "application/json",
    "connect-protocol-version": "1",
  },
  body: JSON.stringify({ title: notifTitle, content: notifContent }),
});
const notifText = await notifRes.text();
console.log(`✓ Owner notification sent (status: ${notifRes.status})\n`);

// ─── Lead Email ───────────────────────────────────────────────────────────────
if (!RESEND_KEY) {
  console.warn("RESEND_API_KEY not set - skipping lead email");
} else {
  const firstName = lead.name.split(" ")[0];
  const isCalendly = lead.callPreference === "Calendly booking";

  const meetingLine = isCalendly
    ? `Your <strong>Calendly booking is confirmed</strong>. We'll be prepared with your initial assessment before the call.`
    : `Your <strong>call-back request has been received</strong>. We'll reach out to you during your preferred window: <strong>${callPrefLabel}</strong>.`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AiiACo - Your Request Has Been Received</title>
</head>
<body style="margin:0;padding:0;background:#03050A;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#03050A;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="padding:0 0 32px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="border-bottom:1px solid rgba(184,156,74,0.25);padding-bottom:20px;">
<span style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:rgba(184,156,74,0.90);letter-spacing:-0.01em;">AiiACo</span>
<span style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(200,215,230,0.35);margin-left:12px;">AI Integration Authority</span>
</td>
</tr>
</table>
</td></tr>

<!-- Body -->
<tr><td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:36px 40px;">

<p style="font-size:13px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:rgba(184,156,74,0.65);margin:0 0 16px;">Confirmation</p>

<h1 style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:700;color:rgba(255,255,255,0.92);letter-spacing:-0.02em;margin:0 0 24px;line-height:1.3;">
  ${firstName}, your request has been received.
</h1>

<p style="font-size:14px;line-height:1.7;color:rgba(200,215,230,0.70);margin:0 0 24px;">
  ${meetingLine}
</p>

<div style="background:rgba(184,156,74,0.06);border:1px solid rgba(184,156,74,0.18);border-radius:10px;padding:24px 28px;margin:0 0 28px;">
  <p style="font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:rgba(184,156,74,0.60);margin:0 0 12px;">Initial Assessment</p>
  <p style="font-size:14px;line-height:1.75;color:rgba(200,215,230,0.82);margin:0;font-style:italic;">
    ${result.lead_brief}
  </p>
</div>

<p style="font-size:14px;line-height:1.7;color:rgba(200,215,230,0.60);margin:0 0 8px;">
  We look forward to speaking with you.
</p>

<p style="font-size:14px;color:rgba(200,215,230,0.60);margin:0;">
  - The AiiACo Team
</p>

</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 0 0;text-align:center;">
<p style="font-size:11px;color:rgba(200,215,230,0.25);margin:0;">
  AiiACo &nbsp;·&nbsp; AI Integration Authority for the Corporate Age &nbsp;·&nbsp; <a href="https://aiiaco.com" style="color:rgba(184,156,74,0.50);text-decoration:none;">aiiaco.com</a>
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const textBody = `AiiACo - Confirmation\n\n${firstName}, your request has been received.\n\n${isCalendly ? "Your Calendly booking is confirmed." : `Your call-back request has been received. We'll reach out during: ${callPrefLabel}.`}\n\nINITIAL ASSESSMENT\n${result.lead_brief}\n\nWe look forward to speaking with you.\n- The AiiACo Team\n\naiiaco.com`;

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AiiACo <team@aiiaco.com>",
      to: [lead.email],
      subject: `${firstName}, your AiiACo request is confirmed`,
      html: htmlBody,
      text: textBody,
    }),
  });

  const emailData = await emailRes.json();
  if (emailRes.ok) {
    console.log(`✓ Lead confirmation email sent to ${lead.email} (ID: ${emailData.id})\n`);
  } else {
    console.error(`✗ Email failed:`, emailData);
  }
}

await conn.end();

console.log("=== DIAGNOSTIC COMPLETE ===");
console.log("\nFULL DIAGNOSTIC:\n");
console.log(fullDiagnosticText);
console.log("\nLEAD BRIEF (what they received):\n");
console.log(result.lead_brief);
