/**
 * ElevenLabs Post-Call Webhook Handler
 *
 * Endpoint: POST /api/webhooks/elevenlabs
 *
 * Receives post_call_transcription events from ElevenLabs after each call
 * to the AiA Diagnostic Agent. Processes the transcript through:
 *   1. Quality gate (anti-spam + minimum viable lead check)
 *   2. Extract caller info (email, name, company, phone, pain point, budget, track)
 *   3. Run LLM-powered conversation intelligence extraction
 *   4. Create or update a lead in the DB with full transcript + intelligence
 *   5. Send a personalized caller summary email (with conversation intelligence)
 *   6. Send a magnificent pilot brief email to the owner (with full intelligence)
 *   7. Send an owner notification (Manus push — plain text fallback)
 */

import type { Request, Response } from "express";
import { verifyElevenLabsSignature, parseCallWebhook, extractConversationIntelligence } from "../aiAgent";
import { buildCallerSummaryEmail, buildOwnerPilotBriefEmail, buildContinueConversationEmail } from "../emailTemplates";
import { insertLead, getLeadByEmail, updateLeadById, updateLeadEmailStatus } from "../db";
import { notifyOwner } from "../_core/notification";
import { sendEmail, sendOwnerPilotBrief } from "../email";
import { assessLeadQuality, countUserTurns, type CallMetrics } from "../leadQualityGate";

const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET ?? "";

// ── Webhook handler ──────────────────────────────────────────────────────────

export async function handleElevenLabsWebhook(req: Request, res: Response): Promise<void> {
  const rawBody: string = (req as any).rawBodyText ?? JSON.stringify(req.body);
  const signatureHeader = req.headers["elevenlabs-signature"] as string | undefined;

  const signatureValid = verifyElevenLabsSignature(rawBody, signatureHeader, WEBHOOK_SECRET);
  if (!signatureValid) {
    // CRITICAL: Never drop a lead over a signature mismatch.
    // Log the warning for security review but ALWAYS process the call.
    console.warn("[ElevenLabsWebhook] ⚠ Signature verification failed — processing anyway to avoid losing lead data");
    console.warn(`[ElevenLabsWebhook] Header: ${signatureHeader?.substring(0, 40)}... | Secret set: ${!!WEBHOOK_SECRET} | Secret length: ${WEBHOOK_SECRET.length}`);
  }

  const eventType: string = (req.body as Record<string, unknown>)?.type as string ?? "";

  // Only process transcription events
  if (eventType !== "post_call_transcription") {
    res.status(200).json({ received: true, processed: false, reason: "event_type_ignored" });
    return;
  }

  try {
    const summary = parseCallWebhook(req.body as Record<string, unknown>);

    console.log(`[ElevenLabsWebhook] Call ${summary.conversationId} — track: ${summary.track}, email: ${summary.callerEmail ?? "none"}, duration: ${summary.durationSeconds}s`);

    // ── Extract conversation intelligence via LLM ───────────────────────────
    const intelligence = await extractConversationIntelligence(summary.transcriptText);
    console.log(`[ElevenLabsWebhook] Intelligence extracted: ${intelligence.painPoints.length} pain points, ${intelligence.wants.length} wants, ${intelligence.currentSolutions.length} current solutions`);

    // LLM extraction is PRIMARY — it has full context and explicit instructions
    // to only return real human names. Regex is FALLBACK for when LLM returns null.
    // This prevents regex false positives like "for reaching" from overriding good LLM data.
    const callerEmail = intelligence.callerEmail ?? summary.callerEmail;
    const callerName = intelligence.callerName ?? summary.callerName;
    const companyName = intelligence.companyName ?? summary.companyName;
    const callerPhone = intelligence.callerPhone ?? summary.callerPhone;

    // ── QUALITY GATE ────────────────────────────────────────────────────────
    const rawTranscript = (req.body as any)?.data?.transcript;
    const userTurnCount = countUserTurns(rawTranscript);
    const callMetrics: CallMetrics = {
      durationSeconds: summary.durationSeconds,
      userTurnCount,
      totalTurnCount: rawTranscript?.length ?? 0,
      callerName,
      callerEmail,
      callerPhone,
      conversationId: summary.conversationId,
    };

    const assessment = assessLeadQuality(callMetrics);
    console.log(`[ElevenLabsWebhook] Quality: ${assessment.quality} — ${assessment.reason} (duration: ${summary.durationSeconds}s, user turns: ${userTurnCount})`);

    if (!assessment.shouldSave) {
      console.log(`[ElevenLabsWebhook] ⏭ Skipping ${summary.conversationId} — ${assessment.reason}`);
      res.status(200).json({ received: true, processed: false, reason: assessment.reason, quality: assessment.quality });
      return;
    }

    // ── Save lead to DB ────────────────────────────────────────────────────
    let leadId: number | null = null;

    // Shared intelligence fields for DB storage
    const structuredTranscriptJson = summary.structuredTranscript.length > 0
      ? JSON.stringify(summary.structuredTranscript)
      : null;
    const intelligenceFields = {
      painPoints: intelligence.painPoints.length > 0 ? JSON.stringify(intelligence.painPoints) : null,
      wants: intelligence.wants.length > 0 ? JSON.stringify(intelligence.wants) : null,
      currentSolutions: intelligence.currentSolutions.length > 0 ? JSON.stringify(intelligence.currentSolutions) : null,
      conversationSummary: intelligence.conversationSummary !== "Transcript analysis unavailable." ? intelligence.conversationSummary : null,
      callDurationSeconds: summary.durationSeconds || null,
      conversationId: summary.conversationId || null,
      structuredTranscript: structuredTranscriptJson,
    };

    if (callerEmail && !callerEmail.includes("@aiiaco.com")) {
      // Check if lead already exists (e.g. from a form submission)
      const existing = await getLeadByEmail(callerEmail);

      if (existing) {
        // Update existing lead with call data + intelligence
        await updateLeadById(existing.id, {
          name: callerName ?? existing.name,
          company: companyName ?? existing.company ?? undefined,
          phone: callerPhone ?? existing.phone ?? undefined,
          adminNotes: [
            existing.adminNotes,
            `📞 AI Call (${summary.conversationId}): Track → ${summary.track}${summary.painPoint ? ` | Pain: ${summary.painPoint}` : ""}${summary.budgetSignal ? ` | Budget: ${summary.budgetSignal}` : ""}`,
          ].filter(Boolean).join("\n\n"),
          callTranscript: summary.transcriptText ?? undefined,
          callTrack: summary.track,
          ...intelligenceFields,
          status: existing.status === "new" ? assessment.suggestedStatus : existing.status,
        });
        leadId = existing.id;
      } else {
        // Create new lead from call
        const result = await insertLead({
          type: "call",
          name: callerName ?? "Phone Caller",
          email: callerEmail,
          company: companyName ?? undefined,
          phone: callerPhone ?? undefined,
          message: summary.painPoint ?? undefined,
          budgetRange: summary.budgetSignal ?? undefined,
          leadSource: `AI Phone Call — ${summary.track} track`,
          callTranscript: summary.transcriptText ?? undefined,
          callTrack: summary.track,
          ...intelligenceFields,
          status: assessment.suggestedStatus,
        });
        leadId = result.insertId;
      }
    } else {
      // No real email — create with placeholder but use quality-gated status
      const emailForLead = `voice-${summary.conversationId}@aiiaco.com`;
      const result = await insertLead({
        type: "call",
        name: callerName ?? "Voice Caller",
        email: emailForLead,
        company: companyName ?? undefined,
        phone: callerPhone ?? undefined,
        message: summary.painPoint ?? undefined,
        budgetRange: summary.budgetSignal ?? undefined,
        leadSource: `AI Phone Call — ${summary.track} track`,
        callTranscript: summary.transcriptText ?? undefined,
        callTrack: summary.track,
        ...intelligenceFields,
        status: assessment.suggestedStatus,
      });
      leadId = result.insertId;
    }

    // ── Send personalized caller summary email ──────────────────────────────
    if (assessment.shouldEmail && callerEmail && leadId) {
      // Decide template: use "continue conversation" for short calls with thin intelligence
      const hasMeaningfulIntelligence = intelligence.painPoints.length >= 2 && intelligence.conversationSummary !== "Transcript analysis unavailable.";
      const isShortCall = (summary.durationSeconds ?? 0) < 90;

      const callerEmailContent = (isShortCall && !hasMeaningfulIntelligence)
        ? buildContinueConversationEmail({
            name: callerName ?? "there",
            email: callerEmail,
            company: companyName,
            industry: null,
          })
        : buildCallerSummaryEmail({
            name: callerName ?? "there",
            email: callerEmail,
            company: companyName,
            track: summary.track,
            conversationSummary: intelligenceFields.conversationSummary,
            painPoints: intelligenceFields.painPoints,
            wants: intelligenceFields.wants,
            leadBrief: intelligence.conversationSummary !== "Transcript analysis unavailable."
              ? intelligence.conversationSummary
              : null,
          });
      try {
        const emailResult = await sendEmail({
          to: callerEmail,
          subject: callerEmailContent.subject,
          html: callerEmailContent.html,
          text: callerEmailContent.text,
          leadId,
        });
        await updateLeadEmailStatus(leadId, emailResult.success ? "sent" : "failed");
        console.log(`[ElevenLabsWebhook] Caller summary email ${emailResult.success ? "sent" : "FAILED"} to ${callerEmail}`);
      } catch (emailErr) {
        console.error("[ElevenLabsWebhook] Failed to send caller summary email:", emailErr);
        await updateLeadEmailStatus(leadId, "failed").catch(() => {});
      }
    } else if (leadId) {
      await updateLeadEmailStatus(leadId, "not_applicable").catch(() => {});
    }

    // ── Send magnificent pilot brief email to owner ─────────────────────────
    if (assessment.shouldNotifyOwner && leadId) {
      const pilotBrief = buildOwnerPilotBriefEmail({
        leadId,
        name: callerName ?? "Voice Caller",
        email: callerEmail ?? `voice-${summary.conversationId}@aiiaco.com`,
        company: companyName,
        phone: callerPhone,
        leadSource: `AI Phone Call — ${summary.track} track`,
        track: summary.track,
        callDurationSeconds: summary.durationSeconds,
        conversationId: summary.conversationId,
        conversationSummary: intelligenceFields.conversationSummary,
        painPoints: intelligenceFields.painPoints,
        wants: intelligenceFields.wants,
        currentSolutions: intelligenceFields.currentSolutions,
        quality: assessment.quality,
      });

      try {
        const briefSent = await sendOwnerPilotBrief({
          subject: pilotBrief.subject,
          html: pilotBrief.html,
          text: pilotBrief.text,
        });
        console.log(`[ElevenLabsWebhook] Owner pilot brief ${briefSent ? "sent" : "FAILED"}`);
      } catch (briefErr) {
        console.error("[ElevenLabsWebhook] Failed to send owner pilot brief:", briefErr);
      }

      // Also send Manus push notification as fallback
      const trackLabel = summary.track === "unknown" ? "Unrouted" : summary.track.charAt(0).toUpperCase() + summary.track.slice(1);
      await notifyOwner({
        title: `📞 AI CALL — ${trackLabel} Track${callerName ? ` | ${callerName}` : ""}${companyName ? ` @ ${companyName}` : ""}`,
        content: [
          `Conversation ID: ${summary.conversationId}`,
          `Duration: ${summary.durationSeconds}s`,
          `Track: ${trackLabel}`,
          callerEmail ? `Email: ${callerEmail}` : null,
          callerPhone ? `Phone: ${callerPhone}` : null,
          summary.painPoint ? `Pain point: ${summary.painPoint}` : null,
          summary.budgetSignal ? `Budget signal: ${summary.budgetSignal}` : null,
          intelligence.conversationSummary !== "Transcript analysis unavailable." ? `\nSUMMARY\n${intelligence.conversationSummary}` : null,
          intelligence.painPoints.length > 0 ? `\nPAIN POINTS\n${intelligence.painPoints.map(p => `• ${p}`).join("\n")}` : null,
          intelligence.wants.length > 0 ? `\nWANTS & WISHES\n${intelligence.wants.map(w => `• ${w}`).join("\n")}` : null,
          intelligence.currentSolutions.length > 0 ? `\nCURRENT SOLUTIONS\n${intelligence.currentSolutions.map(s => `• ${s}`).join("\n")}` : null,
          leadId ? `\nLead #${leadId} saved to pipeline (quality: ${assessment.quality})` : null,
          `\n📧 Full pilot brief also emailed to go@aiiaco.com`,
        ].filter(Boolean).join("\n"),
      });
    } else {
      console.log(`[ElevenLabsWebhook] ⏭ Skipping owner notification — quality: ${assessment.quality} (${assessment.reason})`);
    }

    res.status(200).json({ received: true, processed: true, leadId, quality: assessment.quality });
  } catch (err) {
    console.error("[ElevenLabsWebhook] Error processing webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
