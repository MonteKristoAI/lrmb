/**
 * Tests for Resend Email Tracking Webhook + Email Event DB functions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock DB ──────────────────────────────────────────────────────────────────
const mockInsertEmailEvent = vi.fn().mockResolvedValue(undefined);
const mockFindLeadIdByEmail = vi.fn().mockResolvedValue(null);
const mockGetEmailEventsByLeadId = vi.fn().mockResolvedValue([]);
const mockGetEmailEngagementStats = vi.fn().mockResolvedValue({
  totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalBounced: 0,
  openRate: 0, clickRate: 0, bounceRate: 0,
});
const mockGetRecentEmailEvents = vi.fn().mockResolvedValue([]);

vi.mock("./db", () => ({
  insertEmailEvent: (...args: any[]) => mockInsertEmailEvent(...args),
  findLeadIdByEmail: (...args: any[]) => mockFindLeadIdByEmail(...args),
  getEmailEventsByLeadId: (...args: any[]) => mockGetEmailEventsByLeadId(...args),
  getEmailEngagementStats: (...args: any[]) => mockGetEmailEngagementStats(...args),
  getRecentEmailEvents: (...args: any[]) => mockGetRecentEmailEvents(...args),
}));

// ── Mock svix ────────────────────────────────────────────────────────────────
vi.mock("svix", () => ({
  Webhook: vi.fn().mockImplementation(() => ({
    verify: vi.fn((body: string) => JSON.parse(body)),
  })),
}));

import { handleResendWebhook } from "./webhooks/resend";

// ── Express mock helpers ─────────────────────────────────────────────────────
function mockReq(body: any, headers: Record<string, string> = {}): any {
  const rawBodyText = JSON.stringify(body);
  return {
    body,
    rawBodyText,
    headers: {
      "svix-id": "msg_test123",
      "svix-timestamp": "1234567890",
      "svix-signature": "v1,test_signature",
      ...headers,
    },
  };
}

function mockRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("Resend Webhook Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should store email.delivered event and return 200", async () => {
    const req = mockReq({
      type: "email.delivered",
      data: {
        email_id: "em_abc123",
        to: ["test@example.com"],
        subject: "Your AiiACo Assessment",
        tags: { lead_id: "42" },
        created_at: "2026-03-13T10:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ received: true, tracked: true, eventType: "email.delivered" })
    );
    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        emailId: "em_abc123",
        eventType: "email.delivered",
        recipientEmail: "test@example.com",
        leadId: 42,
        subject: "Your AiiACo Assessment",
      })
    );
  });

  it("should store email.opened event", async () => {
    const req = mockReq({
      type: "email.opened",
      data: {
        email_id: "em_open1",
        to: ["lead@company.com"],
        subject: "Next Steps",
        tags: {},
        created_at: "2026-03-13T11:00:00Z",
      },
    });
    const res = mockRes();

    mockFindLeadIdByEmail.mockResolvedValueOnce(99);

    await handleResendWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "email.opened",
        recipientEmail: "lead@company.com",
        leadId: 99,
      })
    );
  });

  it("should store email.clicked event with click data", async () => {
    const req = mockReq({
      type: "email.clicked",
      data: {
        email_id: "em_click1",
        to: ["lead@company.com"],
        subject: "Book a Call",
        tags: { lead_id: "55" },
        click: {
          link: "https://calendly.com/aiiaco/15min",
          timestamp: "2026-03-13T12:00:00Z",
          userAgent: "Mozilla/5.0",
          ipAddress: "1.2.3.4",
        },
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "email.clicked",
        clickedLink: "https://calendly.com/aiiaco/15min",
        clickUserAgent: "Mozilla/5.0",
        clickIpAddress: "1.2.3.4",
        leadId: 55,
      })
    );
  });

  it("should ignore untracked event types", async () => {
    const req = mockReq({
      type: "email.some_unknown_event",
      data: { email_id: "em_unknown" },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ received: true, tracked: false })
    );
    expect(mockInsertEmailEvent).not.toHaveBeenCalled();
  });

  it("should store email.bounced event", async () => {
    const req = mockReq({
      type: "email.bounced",
      data: {
        email_id: "em_bounce1",
        to: ["bad@invalid.com"],
        subject: "Test",
        tags: { lead_id: "77" },
        created_at: "2026-03-13T13:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "email.bounced",
        recipientEmail: "bad@invalid.com",
        leadId: 77,
      })
    );
  });

  it("should handle missing lead_id tag by looking up email", async () => {
    mockFindLeadIdByEmail.mockResolvedValueOnce(123);

    const req = mockReq({
      type: "email.sent",
      data: {
        email_id: "em_noid",
        to: ["known@lead.com"],
        subject: "Welcome",
        tags: {},
        created_at: "2026-03-13T14:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockFindLeadIdByEmail).toHaveBeenCalledWith("known@lead.com");
    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({ leadId: 123 })
    );
  });

  it("should handle null lead_id when email is not found", async () => {
    mockFindLeadIdByEmail.mockResolvedValueOnce(null);

    const req = mockReq({
      type: "email.delivered",
      data: {
        email_id: "em_unknown_lead",
        to: ["stranger@nowhere.com"],
        subject: "Test",
        tags: {},
        created_at: "2026-03-13T15:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({ leadId: null })
    );
  });

  it("should return 200 even if DB insert fails (prevent Resend retries)", async () => {
    mockInsertEmailEvent.mockRejectedValueOnce(new Error("DB connection lost"));

    const req = mockReq({
      type: "email.delivered",
      data: {
        email_id: "em_dbfail",
        to: ["test@example.com"],
        subject: "Test",
        tags: { lead_id: "1" },
        created_at: "2026-03-13T16:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should handle email.delivery_delayed event", async () => {
    const req = mockReq({
      type: "email.delivery_delayed",
      data: {
        email_id: "em_delayed",
        to: ["slow@server.com"],
        subject: "Delayed",
        tags: { lead_id: "88" },
        created_at: "2026-03-13T17:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "email.delivery_delayed",
        leadId: 88,
      })
    );
  });

  it("should handle empty to array gracefully", async () => {
    const req = mockReq({
      type: "email.sent",
      data: {
        email_id: "em_empty",
        to: [],
        subject: "No recipient",
        tags: { lead_id: "10" },
        created_at: "2026-03-13T18:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientEmail: "",
        leadId: 10,
      })
    );
  });

  it("should handle email.complained event", async () => {
    const req = mockReq({
      type: "email.complained",
      data: {
        email_id: "em_complaint",
        to: ["angry@user.com"],
        subject: "Spam?",
        tags: { lead_id: "66" },
        created_at: "2026-03-13T19:00:00Z",
      },
    });
    const res = mockRes();

    await handleResendWebhook(req, res);

    expect(mockInsertEmailEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "email.complained",
        recipientEmail: "angry@user.com",
        leadId: 66,
      })
    );
  });
});
