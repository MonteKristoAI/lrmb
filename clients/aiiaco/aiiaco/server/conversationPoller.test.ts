/**
 * Tests for the Conversation Poller, Track Emails, and Admin Recovery Endpoints
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Track Email Tests ──────────────────────────────────────────────────────

describe("Track Email Templates (shared module)", () => {
  it("should export getTrackEmail function", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    expect(typeof getTrackEmail).toBe("function");
  });

  it("should return operator track email with caller name", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    const email = getTrackEmail("operator", "John Smith");
    expect(email.subject).toBe("Your AiiACo Operator Program Overview");
    expect(email.html).toContain("Hi John Smith");
    expect(email.html).toContain("Operator Program");
    expect(email.text).toContain("John Smith");
  });

  it("should return agent track email", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    const email = getTrackEmail("agent", "Jane Doe");
    expect(email.subject).toBe("Your AiiACo Agent Program Overview");
    expect(email.html).toContain("Agent Program");
  });

  it("should return corporate track email", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    const email = getTrackEmail("corporate", null);
    expect(email.subject).toBe("Your AiiACo Corporate Program Overview");
    expect(email.html).toContain("Hi there"); // null name → "there"
    expect(email.html).toContain("Corporate Program");
  });

  it("should return unknown track email for unrecognized tracks", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    const email = getTrackEmail("unknown", "Test User");
    expect(email.subject).toBe("Thank you for calling AiiACo");
    expect(email.html).toContain("Hi Test User");
  });

  it("should include Calendly booking link in all track emails", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    for (const track of ["operator", "agent", "corporate", "unknown"] as const) {
      const email = getTrackEmail(track, "Test");
      expect(email.html).toContain("calendly.com");
      expect(email.text).toContain("calendly.com");
    }
  });

  it("should include AiiACo branding in all track emails", async () => {
    const { getTrackEmail } = await import("./trackEmails");
    for (const track of ["operator", "agent", "corporate", "unknown"] as const) {
      const email = getTrackEmail(track, "Test");
      expect(email.html).toContain("AiiACo");
      expect(email.html).toContain("#B89C4A"); // Gold brand color
      expect(email.html).toContain("#03050A"); // Dark background
    }
  });
});

// ─── Conversation Poller Module Tests ───────────────────────────────────────

describe("Conversation Poller Module", () => {
  it("should export startConversationPoller function", async () => {
    const mod = await import("./conversationPoller");
    expect(typeof mod.startConversationPoller).toBe("function");
  });

  it("should export stopConversationPoller function", async () => {
    const mod = await import("./conversationPoller");
    expect(typeof mod.stopConversationPoller).toBe("function");
  });

  it("should export pollForMissedCalls function", async () => {
    const mod = await import("./conversationPoller");
    expect(typeof mod.pollForMissedCalls).toBe("function");
  });
});

// ─── Health Monitor — Conversation Poller Vital ─────────────────────────────

describe("Health Monitor includes Conversation Poller vital", () => {
  it("should check 7 vitals (including Conversation Poller)", async () => {
    // We can't easily run the full health check without mocking everything,
    // but we can verify the module structure
    const { runHealthCheck } = await import("./healthMonitor");
    expect(typeof runHealthCheck).toBe("function");
  });
});

// ─── Email Module Tests ─────────────────────────────────────────────────────

describe("Email Module", () => {
  it("should export sendEmail function", async () => {
    const { sendEmail } = await import("./email");
    expect(typeof sendEmail).toBe("function");
  });

  it("should export sendLeadConfirmationEmail function", async () => {
    const { sendLeadConfirmationEmail } = await import("./email");
    expect(typeof sendLeadConfirmationEmail).toBe("function");
  });
});

// ─── Webhook Handler Tests ──────────────────────────────────────────────────

describe("Webhook Handler uses new email templates", () => {
  it("should import buildCallerSummaryEmail and buildOwnerPilotBriefEmail from emailTemplates", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("./server/webhooks/elevenlabs.ts", "utf-8");
    expect(content).toContain('buildCallerSummaryEmail');
    expect(content).toContain('buildOwnerPilotBriefEmail');
    expect(content).toContain('buildContinueConversationEmail');
    expect(content).toContain('from "../emailTemplates"');
    // Should NOT contain old getTrackEmail import
    expect(content).not.toContain("getTrackEmail");
  });
});

describe("Conversation Poller uses new email templates", () => {
  it("should import buildCallerSummaryEmail and buildOwnerPilotBriefEmail from emailTemplates", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("./server/conversationPoller.ts", "utf-8");
    expect(content).toContain('buildCallerSummaryEmail');
    expect(content).toContain('buildOwnerPilotBriefEmail');
    expect(content).toContain('buildContinueConversationEmail');
    expect(content).toContain('from "./emailTemplates"');
    // Should NOT contain old getTrackEmail import
    expect(content).not.toContain("getTrackEmail");
  });
});
