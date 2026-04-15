import { describe, expect, it, vi, beforeAll } from "vitest";
import { SignJWT } from "jose";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    insertLead: vi.fn().mockResolvedValue({ insertId: 1 }),
    getAllLeads: vi.fn().mockResolvedValue([]),
    updateLeadStatus: vi.fn().mockResolvedValue(undefined),
    updateLeadById: vi.fn().mockResolvedValue(undefined),
    getLeadById: vi.fn().mockResolvedValue(null),
  };
});

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./email", () => ({
  sendLeadConfirmationEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock("./leadDiagnostic", () => ({
  generateAndSendLeadDiagnostic: vi.fn().mockResolvedValue(undefined),
}));

// ─── Context factories ────────────────────────────────────────────────────────

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

/**
 * Creates a context that passes the adminAuthedProcedure middleware.
 * The middleware reads from ctx.req.headers["x-admin-token"], so we sign
 * a valid JWT with the same secret the server uses (ENV.cookieSecret + "_admin").
 */
let adminToken: string;

beforeAll(async () => {
  // JWT_SECRET defaults to "" in test env — mirror what ENV.cookieSecret resolves to
  const cookieSecret = process.env.JWT_SECRET ?? "";
  const secret = new TextEncoder().encode(cookieSecret + "_admin");
  adminToken = await new SignJWT({ id: 1, username: "owner", role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .setIssuedAt()
    .sign(secret);
});

function createAdminCtx(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-admin-token": adminToken },
      cookies: {},
    } as unknown as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("leads.submitCall", () => {
  it("accepts a valid call request and returns success", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.leads.submitCall({ name: "Jane Smith", email: "jane@corp.com" });
    expect(result).toEqual({ success: true });
  });

  it("rejects an invalid email", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.leads.submitCall({ name: "Jane", email: "not-an-email" })).rejects.toThrow();
  });
});

describe("leads.submitIntake", () => {
  it("accepts a full intake submission and returns success", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.leads.submitIntake({
      name: "John Doe",
      email: "john@enterprise.com",
      company: "Acme Corp",
      industry: "Financial Services",
      engagementModel: "Full Integration",
      annualRevenue: "$25M – $100M",
      message: "We need to automate our underwriting pipeline.",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("leads.list", () => {
  it("returns leads list for admin-authenticated users", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.leads.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("leads.updateStatus", () => {
  it("updates lead status for admin-authenticated users", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.leads.updateStatus({ id: 1, status: "reviewed" });
    expect(result).toEqual({ success: true });
  });
});

describe("leads.rerunDiagnostic", () => {
  it("returns NOT_FOUND when lead does not exist", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    await expect(caller.leads.rerunDiagnostic({ id: 9999 })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
