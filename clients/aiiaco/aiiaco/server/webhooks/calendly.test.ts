/**
 * Tests for the Calendly webhook handler.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

// ── Mock DB helpers ────────────────────────────────────────────────────────────
vi.mock("../db", () => ({
  getLeadByEmail: vi.fn(),
  updateLeadStatus: vi.fn(),
}));

vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import { getLeadByEmail, updateLeadStatus } from "../db";
import { handleCalendlyWebhook } from "./calendly";

// ── Helpers ────────────────────────────────────────────────────────────────────
function makeReq(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    body: {},
    ...overrides,
  } as unknown as Request;
}

function makeRes(): { res: Response; json: ReturnType<typeof vi.fn>; status: ReturnType<typeof vi.fn> } {
  const json = vi.fn();
  const status = vi.fn().mockReturnThis();
  const res = { json, status } as unknown as Response;
  return { res, json, status };
}

function makeInviteeCreatedBody(email = "test@example.com") {
  return {
    event: "invitee.created",
    payload: {
      invitee: { email, name: "Test User" },
      event_type: { name: "Discovery Call" },
      event: { start_time: "2026-04-01T14:00:00Z" },
    },
  };
}

const mockLead = {
  id: 42,
  name: "Test User",
  email: "test@example.com",
  company: "Acme Corp",
  status: "diagnostic_ready" as const,
  type: "intake" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe("handleCalendlyWebhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Disable signing key so tests don't need to compute HMAC
    process.env.CALENDLY_WEBHOOK_SIGNING_KEY = "";
  });

  it("returns 200 and processed:true when a matching lead is found and advanced", async () => {
    vi.mocked(getLeadByEmail).mockResolvedValue(mockLead as any);
    vi.mocked(updateLeadStatus).mockResolvedValue(undefined as any);

    const req = makeReq({ body: makeInviteeCreatedBody("test@example.com") });
    const { res, json } = makeRes();

    await handleCalendlyWebhook(req, res);

    expect(getLeadByEmail).toHaveBeenCalledWith("test@example.com");
    expect(updateLeadStatus).toHaveBeenCalledWith(42, "contacted");
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ processed: true, leadId: 42 }));
  });

  it("does not update status when lead is already closed", async () => {
    vi.mocked(getLeadByEmail).mockResolvedValue({ ...mockLead, status: "closed" } as any);

    const req = makeReq({ body: makeInviteeCreatedBody("test@example.com") });
    const { res, json } = makeRes();

    await handleCalendlyWebhook(req, res);

    expect(updateLeadStatus).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ processed: true }));
  });

  it("returns processed:false when no lead is found for the email", async () => {
    vi.mocked(getLeadByEmail).mockResolvedValue(undefined);

    const req = makeReq({ body: makeInviteeCreatedBody("nobody@example.com") });
    const { res, json } = makeRes();

    await handleCalendlyWebhook(req, res);

    expect(updateLeadStatus).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ processed: false, reason: "lead_not_found" }));
  });

  it("ignores non-invitee.created events", async () => {
    const req = makeReq({ body: { event: "invitee.canceled", payload: {} } });
    const { res, json } = makeRes();

    await handleCalendlyWebhook(req, res);

    expect(getLeadByEmail).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ processed: false, reason: "event_type_ignored" }));
  });

  it("returns processed:false when invitee email is missing", async () => {
    const req = makeReq({ body: { event: "invitee.created", payload: { invitee: {} } } });
    const { res, json } = makeRes();

    await handleCalendlyWebhook(req, res);

    expect(getLeadByEmail).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ processed: false, reason: "no_email" }));
  });
});
