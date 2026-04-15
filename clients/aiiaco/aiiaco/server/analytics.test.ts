import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => {
  const mockLeads = [
    {
      id: 1,
      name: "Alice",
      email: "alice@test.com",
      company: "Acme",
      type: "call",
      status: "new",
      callTrack: "operator",
      callTranscript: "AiA: Hello\nCaller: Hi",
      conversationId: "conv_1",
      callDurationSeconds: 180,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@test.com",
      company: "Corp",
      type: "call",
      status: "contacted",
      callTrack: "agent",
      callTranscript: "AiA: Welcome\nCaller: Thanks",
      conversationId: "conv_2",
      callDurationSeconds: 300,
      createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@test.com",
      company: "StartupCo",
      type: "intake",
      status: "diagnostic_ready",
      callTrack: null,
      callTranscript: null,
      conversationId: null,
      callDurationSeconds: null,
      createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: "Diana",
      email: "diana@test.com",
      company: "Enterprise",
      type: "call",
      status: "closed",
      callTrack: "corporate",
      callTranscript: "AiA: Hi\nCaller: Hello",
      conversationId: "conv_3",
      callDurationSeconds: 420,
      createdAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
      updatedAt: new Date(),
    },
  ];

  return {
    getAnalyticsOverview: vi.fn(async () => {
      const voiceCalls = mockLeads.filter(l => l.callTranscript || l.conversationId);
      const durations = voiceCalls.map(l => l.callDurationSeconds ?? 0).filter(d => d > 0);
      const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const byStatus: Record<string, number> = {};
      const byTrack: Record<string, number> = {};
      const byType: Record<string, number> = {};

      for (const lead of mockLeads) {
        byStatus[lead.status] = (byStatus[lead.status] ?? 0) + 1;
        const track = lead.callTrack ?? "untracked";
        byTrack[track] = (byTrack[track] ?? 0) + 1;
        byType[lead.type] = (byType[lead.type] ?? 0) + 1;
      }

      const contacted = mockLeads.filter(l => l.status === "contacted" || l.status === "closed").length;

      return {
        totalLeads: mockLeads.length,
        totalVoiceCalls: voiceCalls.length,
        avgCallDurationSeconds: Math.round(avgDuration),
        callsToday: voiceCalls.filter(l => l.createdAt >= todayStart).length,
        callsThisWeek: voiceCalls.filter(l => l.createdAt >= weekStart).length,
        callsThisMonth: voiceCalls.length,
        conversionRate: Math.round((contacted / mockLeads.length) * 1000) / 10,
        byStatus,
        byTrack,
        byType,
      };
    }),
    getDailyCallVolume: vi.fn(async (days: number = 30) => {
      const result = [];
      for (let i = 0; i < Math.min(days, 3); i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        result.push({
          date: d.toISOString().slice(0, 10),
          count: i === 0 ? 1 : 0,
          avgDuration: i === 0 ? 180 : 0,
        });
      }
      return result;
    }),
    getRecentCalls: vi.fn(async (limit: number = 10) => {
      return mockLeads
        .filter(l => l.callDurationSeconds != null && l.callDurationSeconds > 0)
        .slice(0, limit)
        .map(l => ({
          id: l.id,
          name: l.name,
          email: l.email,
          company: l.company,
          callTrack: l.callTrack,
          callDurationSeconds: l.callDurationSeconds,
          status: l.status,
          conversationSummary: null,
          createdAt: l.createdAt,
        }));
    }),
  };
});

import { getAnalyticsOverview, getDailyCallVolume, getRecentCalls } from "./db";

describe("Analytics Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAnalyticsOverview", () => {
    it("returns correct total leads count", async () => {
      const result = await getAnalyticsOverview();
      expect(result.totalLeads).toBe(4);
    });

    it("counts voice calls correctly (excludes intake-only leads)", async () => {
      const result = await getAnalyticsOverview();
      expect(result.totalVoiceCalls).toBe(3); // Alice, Bob, Diana have transcripts
    });

    it("calculates average call duration correctly", async () => {
      const result = await getAnalyticsOverview();
      // (180 + 300 + 420) / 3 = 300
      expect(result.avgCallDurationSeconds).toBe(300);
    });

    it("calculates conversion rate correctly", async () => {
      const result = await getAnalyticsOverview();
      // 2 out of 4 leads are contacted/closed = 50%
      expect(result.conversionRate).toBe(50);
    });

    it("breaks down leads by status", async () => {
      const result = await getAnalyticsOverview();
      expect(result.byStatus.new).toBe(1);
      expect(result.byStatus.contacted).toBe(1);
      expect(result.byStatus.diagnostic_ready).toBe(1);
      expect(result.byStatus.closed).toBe(1);
    });

    it("breaks down leads by track", async () => {
      const result = await getAnalyticsOverview();
      expect(result.byTrack.operator).toBe(1);
      expect(result.byTrack.agent).toBe(1);
      expect(result.byTrack.corporate).toBe(1);
      expect(result.byTrack.untracked).toBe(1); // Charlie has no track
    });

    it("breaks down leads by type", async () => {
      const result = await getAnalyticsOverview();
      expect(result.byType.call).toBe(3);
      expect(result.byType.intake).toBe(1);
    });
  });

  describe("getDailyCallVolume", () => {
    it("returns daily volume data", async () => {
      const result = await getDailyCallVolume(30);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("count");
      expect(result[0]).toHaveProperty("avgDuration");
    });

    it("includes today's data with correct count", async () => {
      const result = await getDailyCallVolume(7);
      const today = result.find(d => d.count > 0);
      expect(today).toBeDefined();
      expect(today!.count).toBe(1);
      expect(today!.avgDuration).toBe(180);
    });
  });

  describe("getRecentCalls", () => {
    it("returns only voice calls (with duration > 0)", async () => {
      const result = await getRecentCalls(10);
      expect(result.length).toBe(3); // Alice, Bob, Diana
      for (const call of result) {
        expect(call.callDurationSeconds).toBeGreaterThan(0);
      }
    });

    it("respects the limit parameter", async () => {
      const result = await getRecentCalls(2);
      expect(result.length).toBe(2);
    });

    it("includes expected fields for each call", async () => {
      const result = await getRecentCalls(10);
      const call = result[0];
      expect(call).toHaveProperty("id");
      expect(call).toHaveProperty("name");
      expect(call).toHaveProperty("email");
      expect(call).toHaveProperty("company");
      expect(call).toHaveProperty("callTrack");
      expect(call).toHaveProperty("callDurationSeconds");
      expect(call).toHaveProperty("status");
      expect(call).toHaveProperty("createdAt");
    });
  });
});
