import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock LLM, notifyOwner, and sendLeadConfirmationEmail
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            recap_snapshot: "Maria L Castronovo — Owner at Alliedbestsellers, a growing distribution business.",
            what_they_told_us: "Maria's company is experiencing growth constraints tied to headcount. She cannot scale revenue without adding staff.",
            full_diagnostic: "Alliedbestsellers is at a classic inflection point. Revenue growth is being throttled by linear headcount dependency. The root cause is the absence of AI-assisted execution layers.",
            solution_areas: "AI Revenue Engine to automate follow-up. Operational AI Systems to reduce manual coordination overhead.",
            sales_call_next_steps: "1. Quantify current headcount-to-revenue ratio\n2. Map top 3 manual workflows\n3. Identify revenue activities falling through the cracks",
            lead_brief: "Based on what you've shared, your business is at a growth inflection point where operational constraints are limiting what's possible without adding headcount. We'll walk you through our thinking on the call.",
          }),
        },
      },
    ],
  }),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./email", () => ({
  sendLeadConfirmationEmail: vi.fn().mockResolvedValue(true),
  sendOwnerPilotBrief: vi.fn().mockResolvedValue(true),
}));

import { generateAndSendLeadDiagnostic } from "./leadDiagnostic";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { sendLeadConfirmationEmail } from "./email";

const mockLead = {
  id: 1,
  type: "intake" as const,
  name: "Maria L Castronovo",
  email: "alliedbestsellers@gmail.com",
  company: "Alliedbestsellers",
  phone: "5149099983",
  industry: null,
  engagementModel: null,
  annualRevenue: null,
  message: null,
  investmentType: null,
  budgetRange: null,
  problemCategory: "We're growing but can't scale without adding headcount",
  problemDetail: null,
  callPreference: "afternoon",
  leadSource: "Navbar — Request Upgrade",
  status: "reviewed" as const,
  createdAt: new Date("2026-03-07T21:04:00Z"),
  updatedAt: new Date("2026-03-07T21:04:00Z"),
};

describe("generateAndSendLeadDiagnostic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the LLM with the lead's intake data", async () => {
    await generateAndSendLeadDiagnostic(mockLead);
    expect(invokeLLM).toHaveBeenCalledOnce();
    const callArgs = vi.mocked(invokeLLM).mock.calls[0][0];
    const userMessage = (callArgs.messages as any[]).find((m: any) => m.role === "user");
    expect(userMessage.content).toContain("Maria L Castronovo");
    expect(userMessage.content).toContain("We're growing but can't scale without adding headcount");
    expect(userMessage.content).toContain("Alliedbestsellers");
  });

  it("maps the problem category to the correct AiiACo pillar", async () => {
    await generateAndSendLeadDiagnostic(mockLead);
    const callArgs = vi.mocked(invokeLLM).mock.calls[0][0];
    const userMessage = (callArgs.messages as any[]).find((m: any) => m.role === "user");
    expect(userMessage.content).toContain("AI Revenue Engine + Operational AI Systems");
    expect(userMessage.content).toContain("Critical");
  });

  it("sends the owner notification BEFORE the lead email", async () => {
    const callOrder: string[] = [];
    vi.mocked(notifyOwner).mockImplementation(async () => { callOrder.push("owner"); return true; });
    vi.mocked(sendLeadConfirmationEmail).mockImplementation(async () => { callOrder.push("lead"); return true; });

    await generateAndSendLeadDiagnostic(mockLead);

    expect(callOrder[0]).toBe("owner");
    expect(callOrder[1]).toBe("lead");
  });

  it("includes full diagnostic sections in the owner notification", async () => {
    await generateAndSendLeadDiagnostic(mockLead);
    const notifArgs = vi.mocked(notifyOwner).mock.calls[0][0];
    expect(notifArgs.title).toContain("Maria L Castronovo");
    expect(notifArgs.content).toContain("FULL DIAGNOSTIC");
    expect(notifArgs.content).toContain("SALES CALL — NEXT STEPS");
    expect(notifArgs.content).toContain("WHO THEY ARE");
    expect(notifArgs.content).toContain("WHAT THEY TOLD US");
  });

  it("includes a reference to the pilot brief email in the owner notification", async () => {
    await generateAndSendLeadDiagnostic(mockLead);
    const notifArgs = vi.mocked(notifyOwner).mock.calls[0][0];
    // The Manus push notification now references the pilot brief email instead of inlining the lead brief
    expect(notifArgs.content).toContain("Full pilot brief also emailed to go@aiiaco.com");
    // Still includes the full diagnostic content
    expect(notifArgs.content).toContain("FULL DIAGNOSTIC");
  });

  it("passes the generated lead brief to the lead email", async () => {
    await generateAndSendLeadDiagnostic(mockLead);
    const emailArgs = vi.mocked(sendLeadConfirmationEmail).mock.calls[0][0];
    expect(emailArgs.leadBrief).toContain("growth inflection point");
    expect(emailArgs.email).toBe("alliedbestsellers@gmail.com");
    expect(emailArgs.name).toBe("Maria L Castronovo");
  });

  it("correctly detects Calendly booking and passes isCalendly=true", async () => {
    const calendlyLead = { ...mockLead, callPreference: "Calendly booking" };
    await generateAndSendLeadDiagnostic(calendlyLead);
    const emailArgs = vi.mocked(sendLeadConfirmationEmail).mock.calls[0][0];
    expect(emailArgs.isCalendly).toBe(true);
  });

  it("does NOT pass full diagnostic content to the lead email", async () => {
    await generateAndSendLeadDiagnostic(mockLead);
    const emailArgs = vi.mocked(sendLeadConfirmationEmail).mock.calls[0][0];
    expect(emailArgs).not.toHaveProperty("fullDiagnostic");
    expect(emailArgs).not.toHaveProperty("salesCallNextSteps");
    expect(emailArgs).not.toHaveProperty("full_diagnostic");
  });

  it("handles unknown problem categories gracefully", async () => {
    const unknownLead = { ...mockLead, problemCategory: "Something completely new" };
    await expect(generateAndSendLeadDiagnostic(unknownLead)).resolves.not.toThrow();
    const callArgs = vi.mocked(invokeLLM).mock.calls[0][0];
    const userMessage = (callArgs.messages as any[]).find((m: any) => m.role === "user");
    expect(userMessage.content).toContain("Full Diagnostic Required");
  });

  it("still sends both notifications even if LLM fails", async () => {
    vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM timeout"));
    await generateAndSendLeadDiagnostic(mockLead);
    expect(notifyOwner).toHaveBeenCalledOnce();
    const notifArgs = vi.mocked(notifyOwner).mock.calls[0][0];
    expect(notifArgs.content).toContain("Diagnostic generation failed");
    // Lead email should still be attempted with fallback brief
    expect(sendLeadConfirmationEmail).toHaveBeenCalledOnce();
  });
});
