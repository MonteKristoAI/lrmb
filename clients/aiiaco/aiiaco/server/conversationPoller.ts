/**
 * Conversation Poller — Fallback Safety Net
 *
 * Polls the ElevenLabs conversations API every 5 minutes to catch any calls
 * that the webhook missed (due to HMAC failures, network issues, downtime, etc.)
 *
 * RULE: No REAL call is ever lost. If the webhook fails, the poller catches it.
 * RULE: Abandoned/spam calls are silently dropped — no lead, no email, no notification.
 * RULE: Each conversation is processed EXACTLY ONCE — deduplication via in-memory set + DB check.
 * RULE: If a lead already exists (by email), update the lead but NEVER re-send email or re-notify.
 */

import { parseCallWebhook, extractConversationIntelligence } from "./aiAgent";
import { buildCallerSummaryEmail, buildOwnerPilotBriefEmail, buildContinueConversationEmail } from "./emailTemplates";
import { insertLead, getLeadByEmail, updateLeadById, updateLeadEmailStatus, getDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail, sendOwnerPilotBrief } from "./email";
import { assessLeadQuality, countUserTurns, type CallMetrics } from "./leadQualityGate";
import { leads } from "../drizzle/schema";
import { sql } from "drizzle-orm";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID ?? "";
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const INITIAL_DELAY_MS = 60 * 1000; // 1 minute after startup

// ── In-memory deduplication set ─────────────────────────────────────────────
// Tracks every conversation ID we've ever seen (processed OR skipped).
// Survives across poll cycles. Cleared only on server restart.
const processedConversationIds = new Set<string>();

interface ElevenLabsConversation {
  conversation_id: string;
  agent_id: string;
  status: string;
  start_time_unix_secs?: number;
  call_duration_secs?: number;
}

interface ElevenLabsConversationDetail {
  conversation_id: string;
  agent_id: string;
  status: string;
  transcript: Array<{ role: string; message: string; time_in_call_secs?: number }>;
  metadata?: Record<string, unknown>;
  analysis?: Record<string, unknown>;
  call_duration_secs?: number;
}

// ── Fetch recent conversations from ElevenLabs API ─────────────────────────

async function fetchRecentConversations(): Promise<ElevenLabsConversation[]> {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
    console.warn("[ConversationPoller] Missing API key or agent ID");
    return [];
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${ELEVENLABS_AGENT_ID}&page_size=20`,
      { headers: { "xi-api-key": ELEVENLABS_API_KEY } }
    );
    if (!res.ok) {
      console.error(`[ConversationPoller] Failed to fetch conversations: ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { conversations?: ElevenLabsConversation[] };
    return data.conversations ?? [];
  } catch (err) {
    console.error("[ConversationPoller] Error fetching conversations:", err);
    return [];
  }
}

async function fetchConversationDetail(conversationId: string): Promise<ElevenLabsConversationDetail | null> {
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      { headers: { "xi-api-key": ELEVENLABS_API_KEY } }
    );
    if (!res.ok) {
      console.error(`[ConversationPoller] Failed to fetch conversation ${conversationId}: ${res.status}`);
      return null;
    }
    return (await res.json()) as ElevenLabsConversationDetail;
  } catch (err) {
    console.error(`[ConversationPoller] Error fetching conversation ${conversationId}:`, err);
    return null;
  }
}

// ── Check if a conversation is already captured in our DB ──────────────────

async function isConversationInDb(conversationId: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    const rows = await db
      .select({ id: leads.id })
      .from(leads)
      .where(sql`${leads.conversationId} = ${conversationId}`)
      .limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}

// ── Seed the in-memory set from DB on first run ────────────────────────────
// This prevents re-processing conversations that were already captured before
// the current server process started.

let seeded = false;

async function seedProcessedIds(): Promise<void> {
  if (seeded) return;
  try {
    const db = await getDb();
    if (!db) return;
    const rows = await db
      .select({ conversationId: leads.conversationId })
      .from(leads)
      .where(sql`${leads.conversationId} IS NOT NULL`);
    for (const row of rows) {
      if (row.conversationId) {
        processedConversationIds.add(row.conversationId);
      }
    }
    console.log(`[ConversationPoller] Seeded ${processedConversationIds.size} known conversation IDs from DB`);
    seeded = true;
  } catch (err) {
    console.error("[ConversationPoller] Failed to seed processed IDs:", err);
  }
}

// ── Process a missed conversation ──────────────────────────────────────────

async function processMissedConversation(detail: ElevenLabsConversationDetail): Promise<void> {
  console.log(`[ConversationPoller] Processing missed conversation ${detail.conversation_id}`);

  // Build a webhook-like payload so we can reuse parseCallWebhook
  const webhookPayload = {
    type: "post_call_transcription",
    data: {
      conversation_id: detail.conversation_id,
      agent_id: detail.agent_id,
      transcript: detail.transcript,
      metadata: detail.metadata ?? {},
      analysis: detail.analysis ?? {},
    },
  };

  try {
    const summary = parseCallWebhook(webhookPayload);

    // Extract intelligence
    const intelligence = await extractConversationIntelligence(summary.transcriptText);

    // LLM extraction is PRIMARY, regex is FALLBACK (same as webhook handler)
    const callerEmail = intelligence.callerEmail ?? summary.callerEmail;
    const callerName = intelligence.callerName ?? summary.callerName;
    const companyName = intelligence.companyName ?? summary.companyName;
    const callerPhone = intelligence.callerPhone ?? summary.callerPhone;

    // ── QUALITY GATE ─────────────────────────────────────────────────────
    const userTurnCount = countUserTurns(detail.transcript);
    const callMetrics: CallMetrics = {
      durationSeconds: summary.durationSeconds ?? detail.call_duration_secs,
      userTurnCount,
      totalTurnCount: detail.transcript?.length ?? 0,
      callerName,
      callerEmail,
      callerPhone,
      conversationId: summary.conversationId,
      callStatus: detail.status,
    };

    const assessment = assessLeadQuality(callMetrics);
    console.log(`[ConversationPoller] Quality: ${assessment.quality} — ${assessment.reason} (duration: ${callMetrics.durationSeconds}s, user turns: ${userTurnCount})`);

    if (!assessment.shouldSave) {
      console.log(`[ConversationPoller] ⏭ Skipping ${detail.conversation_id} — ${assessment.reason}`);
      return;
    }

    // ── Save lead ────────────────────────────────────────────────────────
    const structuredTranscriptJson = summary.structuredTranscript.length > 0
      ? JSON.stringify(summary.structuredTranscript)
      : null;
    const intelligenceFields = {
      painPoints: intelligence.painPoints.length > 0 ? JSON.stringify(intelligence.painPoints) : null,
      wants: intelligence.wants.length > 0 ? JSON.stringify(intelligence.wants) : null,
      currentSolutions: intelligence.currentSolutions.length > 0 ? JSON.stringify(intelligence.currentSolutions) : null,
      conversationSummary: intelligence.conversationSummary || null,
      structuredTranscript: structuredTranscriptJson,
      callDurationSeconds: summary.durationSeconds ?? null,
      conversationId: summary.conversationId ?? null,
    };

    let leadId: number | null = null;
    let isNewLead = false;

    if (callerEmail && !callerEmail.includes("@aiiaco.com")) {
      const existing = await getLeadByEmail(callerEmail);
      if (existing) {
        leadId = existing.id;
        // Update existing lead with call data but DON'T re-email or re-notify
        await updateLeadById(existing.id, {
          callTranscript: summary.transcriptText,
          ...intelligenceFields,
          phone: callerPhone ?? existing.phone,
          name: callerName ?? existing.name,
          company: companyName ?? existing.company,
          // Don't change status if it's already been progressed
          status: (existing.status === "new" || existing.status === "incomplete")
            ? assessment.suggestedStatus
            : existing.status,
        });
        console.log(`[ConversationPoller] Updated existing lead ${existing.id} (no re-email, no re-notify)`);
      }
    }

    if (!leadId) {
      try {
        const emailForLead = (callerEmail && !callerEmail.includes("@aiiaco.com"))
          ? callerEmail
          : `voice-${summary.conversationId}@aiiaco.com`;
        const result = await insertLead({
          type: "call",
          email: emailForLead,
          name: callerName ?? "Voice Caller",
          company: companyName ?? undefined,
          phone: callerPhone ?? undefined,
          callTrack: summary.track,
          leadSource: "voice",
          status: assessment.suggestedStatus,
          callTranscript: summary.transcriptText,
          ...intelligenceFields,
        });
        leadId = result.insertId;
        isNewLead = true;
        console.log(`[ConversationPoller] Created NEW lead ${leadId} (quality: ${assessment.quality})`);
      } catch (insertErr) {
        console.error("[ConversationPoller] Failed to insert lead:", insertErr);
      }
    }

    // ── Send personalized caller summary email ONLY for NEW complete leads ──
    // NEVER re-email existing leads — they already got their email from the webhook
    if (isNewLead && assessment.shouldEmail && callerEmail && leadId) {
      try {
        // Use "continue conversation" template for short calls with thin intelligence
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
        const emailResult = await sendEmail({
          to: callerEmail,
          subject: callerEmailContent.subject,
          html: callerEmailContent.html,
          text: callerEmailContent.text,
          leadId,
        });
        await updateLeadEmailStatus(leadId, emailResult.success ? "sent" : "failed");
        console.log(`[ConversationPoller] Caller summary email ${emailResult.success ? "sent" : "FAILED"} to ${callerEmail}`);
      } catch (emailErr) {
        console.error(`[ConversationPoller] Failed to send caller summary email:`, emailErr);
        if (leadId) await updateLeadEmailStatus(leadId, "failed").catch(() => {});
      }
    } else if (leadId && isNewLead) {
      await updateLeadEmailStatus(leadId, "not_applicable").catch(() => {});
    }

    // ── Send owner pilot brief + Manus notification ONLY for NEW complete leads ──
    // NEVER re-notify for existing leads
    if (isNewLead && assessment.shouldNotifyOwner && leadId) {
      // Send magnificent pilot brief email
      try {
        const pilotBrief = buildOwnerPilotBriefEmail({
          leadId,
          name: callerName ?? "Voice Caller",
          email: callerEmail ?? `voice-${summary.conversationId}@aiiaco.com`,
          company: companyName,
          phone: callerPhone,
          leadSource: "voice (recovered by poller)",
          track: summary.track,
          callDurationSeconds: summary.durationSeconds,
          conversationId: summary.conversationId,
          conversationSummary: intelligenceFields.conversationSummary,
          painPoints: intelligenceFields.painPoints,
          wants: intelligenceFields.wants,
          currentSolutions: intelligenceFields.currentSolutions,
          quality: assessment.quality,
        });
        const briefSent = await sendOwnerPilotBrief({
          subject: pilotBrief.subject,
          html: pilotBrief.html,
          text: pilotBrief.text,
        });
        console.log(`[ConversationPoller] Owner pilot brief ${briefSent ? "sent" : "FAILED"}`);
      } catch (briefErr) {
        console.error(`[ConversationPoller] Failed to send owner pilot brief:`, briefErr);
      }

      // Also send Manus push notification as fallback
      try {
        const summaryLines = [
          `📞 **Recovered Missed Call** (via poller)`,
          `Caller: ${callerName ?? "Unknown"} (${callerEmail ?? "no email"})`,
          `Company: ${companyName ?? "Unknown"}`,
          `Track: ${summary.track}`,
          `Duration: ${summary.durationSeconds ?? 0}s`,
          intelligence.conversationSummary ? `\nSummary: ${intelligence.conversationSummary}` : "",
          `\n📧 Full pilot brief also emailed to go@aiiaco.com`,
        ].filter(Boolean).join("\n");

        await notifyOwner({
          title: `🔄 Recovered Call: ${callerName ?? callerEmail ?? "Unknown"}`,
          content: summaryLines,
        });
      } catch (notifyErr) {
        console.error(`[ConversationPoller] Failed to notify owner:`, notifyErr);
      }
    }

    console.log(`[ConversationPoller] ✅ Processed ${detail.conversation_id} (quality: ${assessment.quality}, new: ${isNewLead})`);
  } catch (err) {
    console.error(`[ConversationPoller] Failed to process conversation ${detail.conversation_id}:`, err);
  }
}

// ── Main poll loop ─────────────────────────────────────────────────────────

async function pollForMissedCalls(): Promise<void> {
  console.log("[ConversationPoller] Checking for missed calls...");

  // Seed the in-memory set from DB on first run
  await seedProcessedIds();

  try {
    const conversations = await fetchRecentConversations();

    // Only process "done" calls — skip "failed" entirely
    const completedCalls = conversations.filter(
      (c) => c.status === "done" && c.agent_id === ELEVENLABS_AGENT_ID
    );

    let recovered = 0;
    let alreadyKnown = 0;
    let abandoned = 0;

    for (const call of completedCalls) {
      // ── DEDUP CHECK 1: In-memory set (fast, survives across poll cycles) ──
      if (processedConversationIds.has(call.conversation_id)) {
        alreadyKnown++;
        continue;
      }

      // ── Pre-filter: skip obviously abandoned calls ────────────────────────
      if (call.call_duration_secs !== undefined && call.call_duration_secs < 30) {
        processedConversationIds.add(call.conversation_id); // Remember so we don't check again
        abandoned++;
        continue;
      }

      // ── DEDUP CHECK 2: DB check (catches leads from before this server started) ──
      const inDb = await isConversationInDb(call.conversation_id);
      if (inDb) {
        processedConversationIds.add(call.conversation_id); // Cache for future cycles
        alreadyKnown++;
        continue;
      }

      // Fetch full details and process
      const detail = await fetchConversationDetail(call.conversation_id);
      if (!detail || !detail.transcript || detail.transcript.length === 0) {
        processedConversationIds.add(call.conversation_id); // Don't retry empty conversations
        continue;
      }

      await processMissedConversation(detail);

      // Mark as processed regardless of outcome
      processedConversationIds.add(call.conversation_id);
      recovered++;

      // Small delay between processing to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (recovered > 0 || abandoned > 0) {
      console.log(`[ConversationPoller] ✅ Recovered ${recovered} new, skipped ${alreadyKnown} known + ${abandoned} abandoned`);
    } else if (alreadyKnown > 0) {
      console.log(`[ConversationPoller] All ${alreadyKnown} conversations already processed`);
    } else {
      console.log("[ConversationPoller] No conversations found");
    }
  } catch (err) {
    console.error("[ConversationPoller] Poll error:", err);
  }
}

// ── Scheduler ──────────────────────────────────────────────────────────────

let pollTimer: ReturnType<typeof setInterval> | null = null;

export function startConversationPoller(): void {
  console.log(`[ConversationPoller] Starting — initial check in ${INITIAL_DELAY_MS / 1000}s, then every ${POLL_INTERVAL_MS / 1000 / 60} minutes`);

  // Initial check after delay
  setTimeout(() => {
    pollForMissedCalls();

    // Then poll on interval
    pollTimer = setInterval(pollForMissedCalls, POLL_INTERVAL_MS);
  }, INITIAL_DELAY_MS);
}

export function stopConversationPoller(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    console.log("[ConversationPoller] Stopped");
  }
}

// Export for manual triggering from admin
export { pollForMissedCalls };
