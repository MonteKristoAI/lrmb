/**
 * AiiACo Lead Diagnostic Engine — v2
 *
 * Sequence on intake completion:
 * 1. Generate a structured JSON output from GPT-4o containing:
 *    a. Full owner diagnostic (who they are, what they said, problem areas, solutions)
 *    b. Lead-facing brief (high-level, no internal analysis language)
 *    c. Recap snapshot (one-liner identity + challenge summary)
 * 2. Send owner notification with the full report + preview of what the lead will receive
 * 3. Call sendLeadConfirmationEmail() with the generated brief for the lead email
 *
 * The lead NEVER sees the full diagnostic. The owner sees everything including
 * a preview of the exact brief the lead received.
 */

import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { sendLeadConfirmationEmail, sendOwnerPilotBrief } from "./email";
import { buildOwnerPilotBriefEmail } from "./emailTemplates";
import { updateLeadById } from "./db";
import { Lead } from "../drizzle/schema";

// ─── Problem → AiiACo signal mapping ─────────────────────────────────────────

const PROBLEM_SIGNAL_MAP: Record<
  string,
  { pillar: string; signal: string; urgency: string; aiiaFit: string }
> = {
  "My team spends too much time on manual, repetitive tasks": {
    pillar: "Operational AI Systems",
    signal: "High manual overhead across internal workflows",
    urgency: "High",
    aiiaFit: "Workflow automation, task routing, and AI-assisted execution layers",
  },
  "We lose leads because follow-up is slow or inconsistent": {
    pillar: "AI Revenue Engine",
    signal: "Revenue leakage from pipeline gaps",
    urgency: "Critical",
    aiiaFit: "Automated follow-up sequencing, lead scoring, and CRM intelligence",
  },
  "Our data lives in multiple systems and we can't trust the numbers": {
    pillar: "Operational AI Systems",
    signal: "Fragmented data infrastructure and reporting blind spots",
    urgency: "High",
    aiiaFit: "Data unification layer, real-time dashboards, and AI-driven reporting",
  },
  "Document processing and approvals take too long": {
    pillar: "Operational AI Systems",
    signal: "Document bottlenecks slowing delivery and compliance",
    urgency: "Medium",
    aiiaFit: "AI document processing, automated approval workflows",
  },
  "Client communication requires too much manual coordination": {
    pillar: "AI Revenue Engine",
    signal: "Communication overhead reducing capacity",
    urgency: "High",
    aiiaFit: "AI-assisted client communication, automated touchpoint management",
  },
  "We lack real-time visibility into operations and performance": {
    pillar: "Operational AI Systems",
    signal: "Leadership operating without live operational data",
    urgency: "High",
    aiiaFit: "Real-time operational dashboards, AI performance monitoring",
  },
  "Proposal and deliverable creation is slow and resource-heavy": {
    pillar: "Operational AI Systems",
    signal: "Delivery capacity constrained by manual production",
    urgency: "Medium",
    aiiaFit: "AI-assisted proposal generation, templated delivery systems",
  },
  "We're growing but can't scale without adding headcount": {
    pillar: "AI Revenue Engine + Operational AI Systems",
    signal: "Growth ceiling caused by linear headcount dependency",
    urgency: "Critical",
    aiiaFit:
      "AI infrastructure that decouples revenue growth from headcount — the core AiiACo thesis",
  },
};

const CALL_PREF_LABELS: Record<string, string> = {
  morning: "Morning (Weekdays 8am – 12pm)",
  afternoon: "Afternoon (Weekdays 12pm – 5pm)",
  weekdays: "Any Weekday (morning or afternoon)",
  anytime: "Anytime — flexible",
  "Calendly booking": "Calendly — specific slot booked",
};

// ─── Structured output type ───────────────────────────────────────────────────

export type DiagnosticResult = {
  /** One-line identity snapshot: who they are + what they do */
  recap_snapshot: string;
  /** What the lead told us — their challenge in their own words, contextualised */
  what_they_told_us: string;
  /** Full owner-only diagnostic: problem areas, root causes, business impact */
  full_diagnostic: string;
  /** High-level solution areas — what AiiACo could do, no pricing or specifics */
  solution_areas: string;
  /** 3 specific next steps for the sales call */
  sales_call_next_steps: string;
  /**
   * Lead-facing brief — 3–4 sentences max.
   * Acknowledges their situation, names the problem area at a high level,
   * and sets up the call as the place where the full picture will be shared.
   * NO internal analysis language, NO pricing, NO specifics.
   */
  lead_brief: string;
};

// ─── Main function ────────────────────────────────────────────────────────────

export async function generateAndSendLeadDiagnostic(lead: Lead): Promise<void> {
  const problemCategory = lead.problemCategory ?? "Not specified";
  const context = PROBLEM_SIGNAL_MAP[problemCategory] ?? {
    pillar: "Full Diagnostic Required",
    signal: "Custom situation — requires discovery call",
    urgency: "Medium",
    aiiaFit: "Tailored AI infrastructure design",
  };

  const callPrefLabel =
    CALL_PREF_LABELS[lead.callPreference ?? ""] ?? lead.callPreference ?? "Not specified";

  const isCalendly = (lead.callPreference ?? "") === "Calendly booking";

  const submittedAt = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      }) + " EST"
    : "Unknown";

  // ── Step 1: Generate structured diagnostic ──────────────────────────────────
  let result: DiagnosticResult;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are AiiACo's internal lead intelligence system. AiiACo is an AI infrastructure firm that designs, deploys, and manages AI inside the operational and revenue systems of modern businesses ($5M–$100M revenue). AiiACo's three service pillars are:
1. Database Reactivation — cleaning and reactivating dormant CRM databases to generate new conversations from existing assets
2. AI Revenue Engine — AI-assisted outbound prospecting, automated follow-up sequencing, lead scoring, and conversion intelligence
3. Operational AI Systems — custom AI integrations embedded in field operations, communications, reporting, and workflow coordination

You will produce a structured JSON diagnostic for every completed intake lead. The JSON must contain exactly these fields:

recap_snapshot: One sentence. Who this person is and what their company does. Infer from name, company name, and industry context. Be specific and professional.

what_they_told_us: 2–3 sentences. Summarise the challenge they selected and any detail they provided. Write as if briefing a senior partner before a call — factual, no spin.

full_diagnostic: 3–4 paragraphs. Deep analysis for the owner only: what is actually broken, why it matters, the downstream business impact, and how this maps to AiiACo's pillars. Use executive language. Be direct.

solution_areas: 2–3 sentences. High-level areas where AiiACo could intervene. No pricing, no specific deliverables — just the strategic zones.

sales_call_next_steps: Exactly 3 numbered steps. Specific questions or actions for the discovery call to qualify and advance this lead.

lead_brief: 3–4 sentences maximum. Written directly to the lead (use "you" / "your"). Acknowledge their situation warmly but professionally. Name the problem area at a high level (e.g. "operational scaling constraints" not "you can't hire fast enough"). Tell them the call is where the full picture and potential path forward will be shared. Do NOT include any internal analysis, pricing, pillar names, or specifics. Tone: confident, warm, executive.`,
        },
        {
          role: "user",
          content: `Generate the diagnostic for this lead:

Name: ${lead.name}
Company: ${lead.company ?? "Not provided"}
Email: ${lead.email}
Phone: ${lead.phone ?? "Not provided"}
Source: ${lead.leadSource ?? "Website"}
Call Preference: ${callPrefLabel}
Submitted: ${submittedAt}

Primary Challenge: "${problemCategory}"${lead.problemDetail ? `\nAdditional Detail: "${lead.problemDetail}"` : ""}

Internal Signal Mapping:
- Matched Pillar: ${context.pillar}
- Operational Signal: ${context.signal}
- Urgency: ${context.urgency}
- AiiACo Fit: ${context.aiiaFit}`,
        },
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
            required: [
              "recap_snapshot",
              "what_they_told_us",
              "full_diagnostic",
              "solution_areas",
              "sales_call_next_steps",
              "lead_brief",
            ],
            additionalProperties: false,
          },
        },
      },
    } as any);

    const raw =
      (response as any)?.choices?.[0]?.message?.content ?? "{}";
    result = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw)) as DiagnosticResult;
  } catch (err) {
    console.error("[LeadDiagnostic] LLM call failed:", err);
    // Fallback — still send both notifications with degraded content
    result = {
      recap_snapshot: `${lead.name}${lead.company ? ` — ${lead.company}` : ""}`,
      what_they_told_us: problemCategory,
      full_diagnostic: `[Diagnostic generation failed — review lead manually]\n\nPrimary Challenge: ${problemCategory}\nMapped Pillar: ${context.pillar}\nUrgency: ${context.urgency}`,
      solution_areas: context.aiiaFit,
      sales_call_next_steps: "1. Understand the scope\n2. Identify quick wins\n3. Discuss fit",
      lead_brief: `Thank you for sharing your situation with us. Based on what you've described, we've identified some clear areas where operational improvements could make a meaningful difference for your business. We'll walk you through our findings on the call.`,
    };
  }

  // ── Step 1b: Persist diagnostic to database + auto-progress status ──────────
  try {
    const fullDiagnosticText = [
      `WHO THEY ARE\n${result.recap_snapshot}`,
      `WHAT THEY TOLD US\n${result.what_they_told_us}`,
      `FULL DIAGNOSTIC\n${result.full_diagnostic}`,
      `SOLUTION AREAS\n${result.solution_areas}`,
      `SALES CALL — NEXT STEPS\n${result.sales_call_next_steps}`,
    ].join("\n\n");
    await updateLeadById(lead.id, {
      diagnosticSnapshot: fullDiagnosticText,
      leadBrief: result.lead_brief,
      // Auto-progress: move lead from "new" to "diagnostic_ready" once diagnostic is saved
      ...(lead.status === "new" ? { status: "diagnostic_ready" as const } : {}),
    });
    console.log(`[LeadDiagnostic] Lead #${lead.id} status → diagnostic_ready`);
  } catch (err) {
    console.error("[LeadDiagnostic] Failed to persist diagnostic to DB:", err);
  }

  // ── Step 2: Send magnificent pilot brief email + Manus push notification ────

  // 2a: Send pilot brief email to owner (go@aiiaco.com)
  try {
    const pilotBrief = buildOwnerPilotBriefEmail({
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      phone: lead.phone,
      industry: lead.industry,
      leadSource: lead.leadSource,
      callPreference: callPrefLabel,
      submittedAt,
      track: (lead.callTrack as "operator" | "agent" | "corporate" | "unknown") ?? "unknown",
      callDurationSeconds: lead.callDurationSeconds,
      conversationId: lead.conversationId,
      conversationSummary: lead.conversationSummary,
      painPoints: lead.painPoints,
      wants: lead.wants,
      currentSolutions: lead.currentSolutions,
      recapSnapshot: result.recap_snapshot,
      whatTheyToldUs: result.what_they_told_us,
      fullDiagnostic: result.full_diagnostic,
      solutionAreas: result.solution_areas,
      salesCallNextSteps: result.sales_call_next_steps,
      leadBrief: result.lead_brief,
      quality: lead.status,
    });
    const briefSent = await sendOwnerPilotBrief({
      subject: pilotBrief.subject,
      html: pilotBrief.html,
      text: pilotBrief.text,
    });
    console.log(`[LeadDiagnostic] Owner pilot brief email ${briefSent ? "sent" : "FAILED"}`);
  } catch (err) {
    console.error("[LeadDiagnostic] Owner pilot brief email failed:", err);
  }

  // 2b: Also send Manus push notification as fallback
  const ownerNotifTitle = `NEW LEAD — ${lead.name}${lead.company ? ` | ${lead.company}` : ""} | ${callPrefLabel}`;
  const ownerNotifContent = [
    `LEAD PROFILE`,
    `Name:      ${lead.name}`,
    `Company:   ${lead.company ?? "—"}`,
    `Email:     ${lead.email}`,
    `Phone:     ${lead.phone ?? "—"}`,
    `Call:      ${callPrefLabel}`,
    `Source:    ${lead.leadSource ?? "Website"}`,
    `Submitted: ${submittedAt}`,
    ``,
    `WHO THEY ARE`,
    result.recap_snapshot,
    ``,
    `WHAT THEY TOLD US`,
    result.what_they_told_us,
    ``,
    `FULL DIAGNOSTIC (OWNER ONLY)`,
    result.full_diagnostic,
    ``,
    `SOLUTION AREAS`,
    result.solution_areas,
    ``,
    `SALES CALL — NEXT STEPS`,
    result.sales_call_next_steps,
    ``,
    `📧 Full pilot brief also emailed to go@aiiaco.com`,
  ].join("\n");

  try {
    await notifyOwner({ title: ownerNotifTitle, content: ownerNotifContent });
  } catch (err) {
    console.error("[LeadDiagnostic] Owner notification failed:", err);
  }

  // ── Step 3: Send lead confirmation email with brief ─────────────────────────
  try {
    await sendLeadConfirmationEmail({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      callPreference: lead.callPreference,
      isCalendly,
      leadBrief: result.lead_brief,
    });
  } catch (err) {
    console.error("[LeadDiagnostic] Lead email failed:", err);
  }
}
