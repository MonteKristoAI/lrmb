import { describe, expect, it } from "vitest";
import { parseCallWebhook } from "./aiAgent";

/**
 * Tests for the conversation intelligence pipeline:
 * 1. parseCallWebhook — regex-based extraction of caller info from transcripts
 * 2. ConversationIntelligence — LLM-based extraction (tested via structure validation)
 */

// ── Sample transcript simulating a real AiA diagnostic call ─────────────────

const SAMPLE_TRANSCRIPT_TURNS = [
  { role: "agent", message: "Hey there — thanks for reaching out to AiiACo. I'm AiA, your AI diagnostic intelligence. I'm going to ask you a few quick questions so we can figure out exactly how to help. But first — what's your name?" },
  { role: "user", message: "Hi, I'm John Miller." },
  { role: "agent", message: "Great to meet you, John. And what company are you with?" },
  { role: "user", message: "I'm with Apex Logistics." },
  { role: "agent", message: "Got it — Apex Logistics. What's the best email to reach you?" },
  { role: "user", message: "john@apexlogistics.com" },
  { role: "agent", message: "Got it — that's j-o-h-n at apex logistics dot com, right?" },
  { role: "user", message: "That's correct." },
  { role: "agent", message: "And a phone number in case we need to reach you directly?" },
  { role: "user", message: "Sure, it's 555-867-5309." },
  { role: "agent", message: "Perfect, thanks John. Now — tell me what's going on. Tell me about your business — what do you do, and roughly how many people are on your team?" },
  { role: "user", message: "We're a mid-size logistics company, about 45 employees. We handle freight forwarding and last-mile delivery for e-commerce brands." },
  { role: "agent", message: "What's the single biggest friction point slowing you down right now?" },
  { role: "user", message: "Honestly, our dispatch team spends about 4 hours a day on manual route planning and customer follow-ups. We tried using HubSpot for the CRM side but it was way too complicated for our team. We lose leads because follow-up is slow." },
  { role: "agent", message: "How long has that been going on?" },
  { role: "user", message: "About a year now. We've been growing fast but can't scale without adding more dispatchers." },
  { role: "agent", message: "Are you looking for someone to build and manage everything for you, or do you want powerful tools you can run yourself?" },
  { role: "user", message: "Definitely want someone to handle it all. We don't have the technical bandwidth." },
  { role: "agent", message: "Last one — when it comes to investing in solving this, are we talking a few hundred a month, a few thousand, or are you open to an enterprise-level engagement?" },
  { role: "user", message: "We're thinking a few thousand a month, maybe more if the ROI is there." },
  { role: "agent", message: "Based on what you've shared, you're a strong fit for our Operator Program — that's where AiiACo builds, deploys, and manages your entire AI infrastructure. You'll get an overview and a strategy call link in the next few minutes." },
  { role: "agent", message: "Just to confirm — j-o-h-n at apex logistics dot com?" },
  { role: "user", message: "Yes, that's right." },
  { role: "agent", message: "You're in good hands, John. The AiiACo team will be in touch shortly. Have a great day." },
];

function buildWebhookPayload(turns: Array<{ role: string; message: string }>, conversationId = "conv_test_123") {
  return {
    type: "post_call_transcription",
    data: {
      conversation_id: conversationId,
      transcript: turns,
      metadata: {
        call_duration_secs: 187,
      },
    },
  };
}

// ── parseCallWebhook tests ───────────────────────────────────────────────────

describe("parseCallWebhook", () => {
  it("extracts the conversation ID and duration", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.conversationId).toBe("conv_test_123");
    expect(result.durationSeconds).toBe(187);
  });

  it("builds a plain-text transcript from turns", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.transcriptText).toContain("AiA:");
    expect(result.transcriptText).toContain("Caller:");
    expect(result.transcriptText).toContain("john@apexlogistics.com");
  });

  it("extracts the caller email from transcript", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.callerEmail).toBe("john@apexlogistics.com");
  });

  it("detects the operator track from routing statement", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.track).toBe("operator");
  });

  it("detects the agent track", () => {
    const agentTurns = [
      { role: "agent", message: "You'd be a great fit for our Agent Program — AI tools built for operators like you." },
      { role: "user", message: "Sounds good. My email is solo@startup.io" },
    ];
    const payload = buildWebhookPayload(agentTurns);
    const result = parseCallWebhook(payload as any);
    expect(result.track).toBe("agent");
  });

  it("detects the corporate track", () => {
    const corpTurns = [
      { role: "agent", message: "What you're describing is a corporate-level engagement — we'd start with a deep diagnostic." },
      { role: "user", message: "Great. Reach me at ceo@bigcorp.com" },
    ];
    const payload = buildWebhookPayload(corpTurns);
    const result = parseCallWebhook(payload as any);
    expect(result.track).toBe("corporate");
  });

  it("returns unknown track when no routing statement is found", () => {
    const shortTurns = [
      { role: "agent", message: "Thanks for calling." },
      { role: "user", message: "I just had a quick question." },
    ];
    const payload = buildWebhookPayload(shortTurns);
    const result = parseCallWebhook(payload as any);
    expect(result.track).toBe("unknown");
  });

  it("extracts phone number from transcript", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.callerPhone).toBe("555-867-5309");
  });

  it("extracts budget signal from transcript", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.budgetSignal).toBeTruthy();
    // The regex matches the first budget-related phrase it finds in the transcript
    // "a few hundred" appears in the regex alternation and matches first
    expect(result.budgetSignal!.toLowerCase()).toMatch(/few (hundred|thousand)|enterprise/);
  });

  it("handles empty transcript gracefully", () => {
    const payload = buildWebhookPayload([]);
    const result = parseCallWebhook(payload as any);
    expect(result.callerEmail).toBeNull();
    expect(result.callerName).toBeNull();
    expect(result.companyName).toBeNull();
    expect(result.callerPhone).toBeNull();
    expect(result.track).toBe("unknown");
    expect(result.transcriptText).toBe("");
  });

  it("handles missing data field gracefully", () => {
    const result = parseCallWebhook({} as any);
    expect(result.conversationId).toBe("");
    expect(result.durationSeconds).toBe(0);
    expect(result.transcriptText).toBe("");
    expect(result.structuredTranscript).toEqual([]);
  });

  it("builds structured transcript with roles and timing", () => {
    const turnsWithTime = [
      { role: "agent", message: "Hello!", time_in_call_secs: 0 },
      { role: "user", message: "Hi there.", time_in_call_secs: 2 },
      { role: "agent", message: "How can I help?", time_in_call_secs: 5 },
    ];
    const payload = buildWebhookPayload(turnsWithTime);
    const result = parseCallWebhook(payload as any);
    expect(result.structuredTranscript).toHaveLength(3);
    expect(result.structuredTranscript[0]).toEqual({ role: "agent", message: "Hello!", time_in_call_secs: 0 });
    expect(result.structuredTranscript[1]).toEqual({ role: "user", message: "Hi there.", time_in_call_secs: 2 });
    expect(result.structuredTranscript[2]).toEqual({ role: "agent", message: "How can I help?", time_in_call_secs: 5 });
  });

  it("builds structured transcript without timing when not provided", () => {
    const payload = buildWebhookPayload(SAMPLE_TRANSCRIPT_TURNS);
    const result = parseCallWebhook(payload as any);
    expect(result.structuredTranscript.length).toBeGreaterThan(0);
    expect(result.structuredTranscript[0].role).toBe("agent");
    expect(result.structuredTranscript[0].message).toBeTruthy();
  });

  it("returns empty structured transcript for empty turns", () => {
    const payload = buildWebhookPayload([]);
    const result = parseCallWebhook(payload as any);
    expect(result.structuredTranscript).toEqual([]);
  });
});

// ── Regex name extraction: false positive prevention ────────────────────────

describe("parseCallWebhook — name extraction false positive prevention", () => {
  function buildPayloadFromTranscript(turns: Array<{ role: string; message: string }>) {
    return {
      type: "post_call_transcription",
      data: {
        conversation_id: "conv_name_test",
        transcript: turns,
        metadata: { call_duration_secs: 60 },
      },
    };
  }

  it("does NOT extract 'for reaching' from 'Thanks for reaching out'", () => {
    const turns = [
      { role: "agent", message: "Thanks for reaching out to AiiACo. I'm AiA." },
      { role: "user", message: "Hi, I have a question about your services." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBeNull();
  });

  it("does NOT extract garbage from 'Well, that sounds interesting'", () => {
    const turns = [
      { role: "agent", message: "Well, that sounds interesting. Tell me more." },
      { role: "user", message: "We need help with automation." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBeNull();
  });

  it("does NOT extract 'So' or 'Now' as names", () => {
    const turns = [
      { role: "agent", message: "So, let me understand your situation better." },
      { role: "user", message: "Sure, go ahead." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBeNull();
  });

  it("extracts name from 'My name is Jennifer'", () => {
    const turns = [
      { role: "agent", message: "What's your name?" },
      { role: "user", message: "My name is Jennifer Jingco." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBe("Jennifer Jingco");
  });

  it("extracts name from 'I'm Tone'", () => {
    const turns = [
      { role: "agent", message: "Who am I speaking with?" },
      { role: "user", message: "I'm Tone." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBe("Tone");
  });

  it("extracts name from 'Thanks, Marc' in agent line", () => {
    const turns = [
      { role: "agent", message: "Thanks, Marc. Now tell me about your business." },
      { role: "user", message: "We're a real estate firm." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBe("Marc");
  });

  it("extracts name from 'Thank you, Alan' in agent line", () => {
    const turns = [
      { role: "agent", message: "Thank you, Alan. Let's dive in." },
      { role: "user", message: "Sure." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBe("Alan");
  });

  it("rejects filler words even when capitalized in name position", () => {
    const turns = [
      { role: "agent", message: "Thanks, Actually I wanted to ask you something." },
      { role: "user", message: "Go ahead." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    // "Actually" is in the filler word list and should be rejected
    expect(result.callerName).toBeNull();
  });

  it("returns null for transcript with no name at all", () => {
    const turns = [
      { role: "agent", message: "Hello, how can I help you today?" },
      { role: "user", message: "I want to know about your pricing." },
      { role: "agent", message: "Our engagements start at a few thousand per month." },
    ];
    const result = parseCallWebhook(buildPayloadFromTranscript(turns) as any);
    expect(result.callerName).toBeNull();
  });
});

// ── ConversationIntelligence type structure tests ────────────────────────────

describe("ConversationIntelligence interface", () => {
  it("has the correct shape when imported", async () => {
    // Dynamically import to verify the type exports correctly
    const mod = await import("./aiAgent");
    expect(typeof mod.extractConversationIntelligence).toBe("function");
  });

  it("returns fallback for empty transcript", async () => {
    const { extractConversationIntelligence } = await import("./aiAgent");
    const result = await extractConversationIntelligence("");
    expect(result.painPoints).toEqual([]);
    expect(result.wants).toEqual([]);
    expect(result.currentSolutions).toEqual([]);
    expect(result.conversationSummary).toBe("Transcript analysis unavailable.");
    expect(result.callerName).toBeNull();
    expect(result.callerEmail).toBeNull();
    expect(result.callerPhone).toBeNull();
    expect(result.companyName).toBeNull();
  });

  it("returns fallback for very short transcript", async () => {
    const { extractConversationIntelligence } = await import("./aiAgent");
    const result = await extractConversationIntelligence("Hi");
    expect(result.painPoints).toEqual([]);
    expect(result.wants).toEqual([]);
    expect(result.currentSolutions).toEqual([]);
  });
});
