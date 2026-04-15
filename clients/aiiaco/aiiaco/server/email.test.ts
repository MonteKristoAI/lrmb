import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Resend before importing the module under test
vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({
    data: { id: "test-email-id-123" },
    error: null,
  });
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
    })),
  };
});

import { sendLeadConfirmationEmail } from "./email";
import { Resend } from "resend";

describe("sendLeadConfirmationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test_key";
  });

  it("sends an email to the lead's address", async () => {
    const result = await sendLeadConfirmationEmail({
      name: "Maria L Castronovo",
      email: "alliedbestsellers@gmail.com",
      company: "Alliedbestsellers",
      callPreference: "afternoon",
      leadBrief: "Your business is growing and we see clear areas to help.",
    });

    expect(result).toBe(true);
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    expect(resendInstance.emails.send).toHaveBeenCalledOnce();
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    expect(callArgs.to).toContain("alliedbestsellers@gmail.com");
  });

  it("uses the lead's first name in the subject line", async () => {
    await sendLeadConfirmationEmail({
      name: "Maria L Castronovo",
      email: "alliedbestsellers@gmail.com",
      callPreference: "afternoon",
    });
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    expect(callArgs.subject).toContain("Maria");
  });

  it("includes the human-readable call preference label in the email body", async () => {
    await sendLeadConfirmationEmail({
      name: "Maria L Castronovo",
      email: "alliedbestsellers@gmail.com",
      callPreference: "afternoon",
    });
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    expect(callArgs.html).toContain("Afternoon — Weekdays 12pm to 5pm");
  });

  it("shows call-back confirmation text for non-Calendly leads", async () => {
    await sendLeadConfirmationEmail({
      name: "Test User",
      email: "test@example.com",
      callPreference: "morning",
      isCalendly: false,
    });
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    expect(callArgs.html).toContain("call-back request has been received");
  });

  it("shows Calendly confirmation text for Calendly leads", async () => {
    await sendLeadConfirmationEmail({
      name: "Test User",
      email: "test@example.com",
      callPreference: "Calendly booking",
      isCalendly: true,
    });
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    expect(callArgs.html).toContain("Calendly booking is confirmed");
  });

  it("includes the AI-generated lead brief in the email body", async () => {
    const brief = "Based on what you've shared, your primary challenge is operational scaling.";
    await sendLeadConfirmationEmail({
      name: "Test User",
      email: "test@example.com",
      callPreference: "afternoon",
      leadBrief: brief,
    });
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    expect(callArgs.html).toContain("INITIAL ASSESSMENT");
    expect(callArgs.html).toContain(brief);
    expect(callArgs.text).toContain(brief);
  });

  it("does NOT include any full diagnostic content in the email", async () => {
    await sendLeadConfirmationEmail({
      name: "Maria L Castronovo",
      email: "alliedbestsellers@gmail.com",
      callPreference: "afternoon",
      leadBrief: "High-level brief only.",
    });
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const callArgs = resendInstance.emails.send.mock.calls[0][0];
    // Ensure no owner-only diagnostic keywords appear in the lead email
    expect(callArgs.html).not.toContain("FULL DIAGNOSTIC");
    expect(callArgs.html).not.toContain("SALES CALL — NEXT STEPS");
    expect(callArgs.html).not.toContain("OWNER ONLY");
    expect(callArgs.text).not.toContain("FULL DIAGNOSTIC");
  });

  it("returns false gracefully when Resend returns an error", async () => {
    vi.mocked(Resend).mockImplementationOnce(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: null, error: { message: "Invalid API key" } }),
      },
    }));

    const result = await sendLeadConfirmationEmail({
      name: "Test User",
      email: "test@example.com",
      callPreference: "morning",
    });
    expect(result).toBe(false);
  });

  it("returns false gracefully when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendLeadConfirmationEmail({
      name: "Test User",
      email: "test@example.com",
    });
    expect(result).toBe(false);
  });
});
