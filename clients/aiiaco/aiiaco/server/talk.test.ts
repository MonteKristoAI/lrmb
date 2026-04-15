import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for the talk router:
 *   - talk.sendMagicLink
 *   - talk.verifyMagicLink
 *   - talk.saveTranscript
 *
 * These tests mock the database and email layer so they run without
 * a live DB or Resend credentials.
 */

// ─── Mocks ──────────────────────────────────────────────────────────

// Mock the db module
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  const leads = new Map<number, any>();
  const magicTokens = new Map<string, any>();
  const webTranscripts: any[] = [];
  let nextLeadId = 1;
  let nextTokenId = 1;
  let nextTranscriptId = 1;

  return {
    ...actual,
    getDb: vi.fn().mockResolvedValue({}),
    getLeadsByEmail: vi.fn().mockImplementation(async (email: string) => {
      return Array.from(leads.values()).filter(
        (l) => l.email === email.toLowerCase()
      );
    }),
    getLeadById: vi.fn().mockImplementation(async (id: number) => {
      return leads.get(id);
    }),
    insertMagicLinkToken: vi
      .fn()
      .mockImplementation(async (data: any) => {
        const id = nextTokenId++;
        magicTokens.set(data.token, { id, ...data, usedAt: null });
        return { insertId: id };
      }),
    getMagicLinkByToken: vi
      .fn()
      .mockImplementation(async (token: string) => {
        return magicTokens.get(token) ?? undefined;
      }),
    markMagicLinkUsed: vi.fn().mockImplementation(async (id: number) => {
      for (const [, t] of magicTokens) {
        if (t.id === id) {
          t.usedAt = new Date();
        }
      }
    }),
    insertWebTranscript: vi.fn().mockImplementation(async (data: any) => {
      const id = nextTranscriptId++;
      webTranscripts.push({ id, ...data });
      return { insertId: id };
    }),
    getWebTranscriptsByLeadId: vi
      .fn()
      .mockImplementation(async (leadId: number) => {
        return webTranscripts.filter((t) => t.leadId === leadId);
      }),
    getAllWebTranscripts: vi.fn().mockImplementation(async () => {
      return [...webTranscripts];
    }),
    getWebTranscriptBySessionId: vi.fn().mockImplementation(async (sessionId: string) => {
      return webTranscripts.find((t) => t.sessionId === sessionId) ?? null;
    }),
    updateWebTranscriptById: vi.fn().mockImplementation(async (id: number, data: any) => {
      const idx = webTranscripts.findIndex((t) => t.id === id);
      if (idx >= 0) Object.assign(webTranscripts[idx], data);
    }),
    // Other db functions needed by the router (not under test)
    insertLead: vi.fn(),
    getAllLeads: vi.fn().mockResolvedValue([]),
    updateLeadStatus: vi.fn(),
    updateLeadById: vi.fn(),
    updateLeadEmailStatus: vi.fn(),
    getAdminUserByUsername: vi.fn(),
    getAdminUserById: vi.fn(),
    getAllAdminUsers: vi.fn(),
    createAdminUser: vi.fn(),
    deleteAdminUser: vi.fn(),
    updateAdminUserPassword: vi.fn(),
    countAdminUsers: vi.fn(),
    getAllKnowledgeEntries: vi.fn(),
    getActiveKnowledgeEntries: vi.fn(),
    getKnowledgeEntryById: vi.fn(),
    insertKnowledgeEntry: vi.fn(),
    updateKnowledgeEntry: vi.fn(),
    deleteKnowledgeEntry: vi.fn(),
    markKnowledgePushed: vi.fn(),
    getAnalyticsOverview: vi.fn(),
    getDailyCallVolume: vi.fn(),
    getRecentCalls: vi.fn(),
    getEmailEventsByLeadId: vi.fn(),
    getEmailEngagementStats: vi.fn(),
    getRecentEmailEvents: vi.fn(),
    upsertUser: vi.fn(),
    getUserByOpenId: vi.fn(),
    getLeadByEmail: vi.fn(),
    findLeadIdByEmail: vi.fn(),
    insertEmailEvent: vi.fn(),
    getEmailEventsByEmailId: vi.fn(),
  };
});

// Mock the email module
vi.mock("./email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
  sendLeadConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

// Mock the leadDiagnostic module
vi.mock("./leadDiagnostic", () => ({
  generateAndSendLeadDiagnostic: vi.fn().mockResolvedValue(undefined),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the aiAgent module
vi.mock("./aiAgent", () => ({
  updateElevenLabsAgentPrompt: vi.fn().mockResolvedValue(undefined),
}));

// ─── Helpers ────────────────────────────────────────────────────────

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ──────────────────────────────────────────────────────────

describe("talk.saveTranscript", () => {
  it("saves a transcript and returns the ID", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.saveTranscript({
      visitorName: "John Doe",
      visitorEmail: "john@example.com",
      transcript: JSON.stringify([
        { role: "ai", text: "Hello!", timestamp: new Date().toISOString() },
        { role: "user", text: "Hi AiA", timestamp: new Date().toISOString() },
      ]),
      transcriptText: "AiA: Hello!\n\nVisitor: Hi AiA",
      durationSeconds: 45,
    });

    expect(result.success).toBe(true);
    expect(result.transcriptId).toBeGreaterThan(0);
  });

  it("saves a transcript without optional fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.saveTranscript({
      transcript: JSON.stringify([
        { role: "ai", text: "Hello!", timestamp: new Date().toISOString() },
      ]),
    });

    expect(result.success).toBe(true);
    expect(result.transcriptId).toBeGreaterThan(0);
  });
});

describe("talk.sendMagicLink", () => {
  it("returns success even when email is not found (privacy protection)", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.sendMagicLink({
      email: "nonexistent@example.com",
      origin: "https://aiiaco.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("magic link");
  });

  it("sends a magic link when lead exists", async () => {
    // Seed a lead
    const { getLeadsByEmail } = await import("./db");
    (getLeadsByEmail as any).mockResolvedValueOnce([
      {
        id: 42,
        name: "Jane Smith",
        email: "jane@example.com",
        company: "Acme Corp",
        phone: "+15551234567",
        status: "new",
        type: "voice",
        callTranscript: "Hello",
        conversationSummary: "Discussed AI integration",
        painPoints: "Manual processes",
        wants: "Automation",
        createdAt: new Date(),
      },
    ]);

    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.sendMagicLink({
      email: "jane@example.com",
      origin: "https://aiiaco.com",
    });

    expect(result.success).toBe(true);

    // Verify email was sent
    const { sendEmail } = await import("./email");
    expect(sendEmail).toHaveBeenCalled();
  });
});

describe("talk.checkEmail", () => {
  it("returns exists: false for unknown email", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.checkEmail({
      email: "unknown-person@example.com",
    });

    expect(result.exists).toBe(false);
  });

  it("returns exists: true for known lead email", async () => {
    const { getLeadsByEmail } = await import("./db");
    (getLeadsByEmail as any).mockResolvedValueOnce([
      { id: 99, email: "known@example.com", name: "Known Lead" },
    ]);

    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.checkEmail({
      email: "known@example.com",
    });

    expect(result.exists).toBe(true);
  });
});

describe("talk.verifyMagicLink", () => {
  it("rejects invalid tokens", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.talk.verifyMagicLink({ token: "invalid-token-xyz" })
    ).rejects.toThrow("Invalid or expired link");
  });

  it("verifies a valid token and returns lead data", async () => {
    // Set up: insert a token and mock the lead
    const { insertMagicLinkToken, getMagicLinkByToken, getLeadById, getWebTranscriptsByLeadId } =
      await import("./db");

    // Create the token
    await (insertMagicLinkToken as any)({
      token: "valid-test-token-abc",
      email: "jane@example.com",
      leadId: 42,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Mock lead lookup
    (getLeadById as any).mockResolvedValueOnce({
      id: 42,
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Acme Corp",
      phone: "+15551234567",
      status: "new",
      type: "voice",
      callTranscript: null,
      structuredTranscript: null,
      conversationSummary: "Discussed AI integration",
      painPoints: "Manual processes",
      wants: "Automation",
      createdAt: new Date(),
    });

    // Mock empty previous transcripts
    (getWebTranscriptsByLeadId as any).mockResolvedValueOnce([]);

    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.verifyMagicLink({
      token: "valid-test-token-abc",
    });

    expect(result.success).toBe(true);
    expect(result.lead.id).toBe(42);
    expect(result.lead.name).toBe("Jane Smith");
    expect(result.lead.email).toBe("jane@example.com");
    expect(result.previousTranscripts).toHaveLength(0);
  });

  it("rejects already-used tokens", async () => {
    // The token "valid-test-token-abc" was already used in the previous test
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.talk.verifyMagicLink({ token: "valid-test-token-abc" })
    ).rejects.toThrow("already been used");
  });

  it("rejects expired tokens", async () => {
    const { insertMagicLinkToken } = await import("./db");

    // Create an expired token
    await (insertMagicLinkToken as any)({
      token: "expired-token-xyz",
      email: "jane@example.com",
      leadId: 42,
      expiresAt: new Date(Date.now() - 1000), // Already expired
    });

    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.talk.verifyMagicLink({ token: "expired-token-xyz" })
    ).rejects.toThrow("expired");
  });
});

describe("talk.upsertTranscript", () => {
  it("creates a new transcript on first call with sessionId", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.upsertTranscript({
      sessionId: "web_test_session_001",
      visitorName: "Alice Test",
      visitorEmail: "alice@example.com",
      transcript: JSON.stringify([
        { role: "ai", text: "Hello!", timestamp: new Date().toISOString() },
      ]),
      transcriptText: "AiA: Hello!",
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(true);
    expect(result.transcriptId).toBeGreaterThan(0);
  });

  it("updates existing transcript on subsequent calls with same sessionId", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    // Second call with same sessionId should update
    const result = await caller.talk.upsertTranscript({
      sessionId: "web_test_session_001",
      visitorName: "Alice Test",
      visitorEmail: "alice@example.com",
      transcript: JSON.stringify([
        { role: "ai", text: "Hello!", timestamp: new Date().toISOString() },
        { role: "user", text: "Hi AiA", timestamp: new Date().toISOString() },
      ]),
      transcriptText: "AiA: Hello!\n\nVisitor: Hi AiA",
      durationSeconds: 30,
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(false);
  });

  it("creates a new transcript for a different sessionId", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.upsertTranscript({
      sessionId: "web_test_session_002",
      transcript: JSON.stringify([
        { role: "ai", text: "Welcome!", timestamp: new Date().toISOString() },
      ]),
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(true);
  });

  it("rejects invalid sessionId (too short)", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.talk.upsertTranscript({
        sessionId: "short",
        transcript: JSON.stringify([{ role: "ai", text: "Hi" }]),
      })
    ).rejects.toThrow();
  });

  it("handles final save with duration", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.talk.upsertTranscript({
      sessionId: "web_test_session_003",
      visitorName: "Bob Final",
      transcript: JSON.stringify([
        { role: "ai", text: "Goodbye!", timestamp: new Date().toISOString() },
      ]),
      durationSeconds: 120,
      isFinal: true,
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(true);
  });
});
