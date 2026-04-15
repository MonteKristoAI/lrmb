import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * VaaS Platform Tests
 *
 * Tests the client-facing Voice Agent as a Service endpoints:
 * - Client signup validation
 * - Client login validation
 * - Catalog endpoints (templates, voices)
 * - Agent creation validation
 */

// ─── Helpers ────────────────────────────────────────────────────────────────────

function createPublicContext(): TrpcContext {
  const cookies: Record<string, string> = {};
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies,
    } as unknown as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string) => {
        cookies[name] = value;
      },
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

// ─── Catalog Tests (Public Endpoints) ───────────────────────────────────────────

describe("vaas.catalog", () => {
  it("returns agent templates", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const templates = await caller.vaas.catalog.templates();
    expect(Array.isArray(templates)).toBe(true);
    // We seeded 5 templates
    expect(templates.length).toBeGreaterThanOrEqual(5);
    // Check structure
    const first = templates[0];
    expect(first).toHaveProperty("templateKey");
    expect(first).toHaveProperty("displayName");
    expect(first).toHaveProperty("description");
    expect(first).toHaveProperty("defaultPrompt");
    expect(first).toHaveProperty("defaultFirstMessage");
  });

  it("returns voice tiers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const voices = await caller.vaas.catalog.voices();
    expect(Array.isArray(voices)).toBe(true);
    // We seeded 5 voices
    expect(voices.length).toBeGreaterThanOrEqual(5);
    // Check structure
    const first = voices[0];
    expect(first).toHaveProperty("voiceId");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("tier");
    expect(first).toHaveProperty("monthlyCostCents");
  });

  it("includes both free and premium voices", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const voices = await caller.vaas.catalog.voices();
    const tiers = voices.map((v: any) => v.tier);
    expect(tiers).toContain("free");
    expect(tiers).toContain("premium");
  });

  it("includes all 5 template industries", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const templates = await caller.vaas.catalog.templates();
    const keys = templates.map((t: any) => t.templateKey);
    expect(keys).toContain("real_estate");
    expect(keys).toContain("mortgage");
    expect(keys).toContain("law");
    expect(keys).toContain("hospitality");
    expect(keys).toContain("manufacturing");
  });
});

// ─── Auth Validation Tests ──────────────────────────────────────────────────────

describe("vaas.auth", () => {
  it("rejects signup with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vaas.auth.signup({
        email: "not-an-email",
        password: "securepass123",
        companyName: "Test Corp",
        contactName: "John Doe",
      })
    ).rejects.toThrow();
  });

  it("rejects signup with short password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vaas.auth.signup({
        email: "test@example.com",
        password: "short",
        companyName: "Test Corp",
        contactName: "John Doe",
      })
    ).rejects.toThrow();
  });

  it("rejects signup with missing company name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vaas.auth.signup({
        email: "test@example.com",
        password: "securepass123",
        companyName: "",
        contactName: "John Doe",
      })
    ).rejects.toThrow();
  });

  it("rejects login with invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vaas.auth.login({
        email: "not-valid",
        password: "anypassword",
      })
    ).rejects.toThrow();
  });

  it("rejects login with non-existent email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vaas.auth.login({
        email: "nonexistent-vaas-test@example.com",
        password: "anypassword123",
      })
    ).rejects.toThrow(/Invalid email or password/);
  });

  it("rejects me query without auth token", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.vaas.auth.me()).rejects.toThrow(/Client login required/);
  });
});

// ─── Agent Creation Validation Tests ────────────────────────────────────────────

describe("vaas.agent", () => {
  it("rejects agent creation without auth", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vaas.agent.create({
        agentName: "Test Agent",
        templateType: "real_estate",
      })
    ).rejects.toThrow(/Client login required/);
  });

  it("rejects agent list without auth", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.vaas.agent.list()).rejects.toThrow(/Client login required/);
  });
});

// ─── Promo Code Validation Tests ────────────────────────────────────────────────

describe("vaas.billing.validatePromo", () => {
  it("validates the CORPORATE2025 promo code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vaas.billing.validatePromo({ code: "CORPORATE2025" });
    expect(result.valid).toBe(true);
    expect(result.monthlyPriceCents).toBe(88800); // $888
  });

  it("rejects invalid promo codes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vaas.billing.validatePromo({ code: "FAKECODE123" });
    expect(result.valid).toBe(false);
  });
});
