// Unit tests for the TRACK -> AiiA status mapper. This is a port of the
// edge-function logic into pure TS so we can lock its behaviour without
// spinning up Deno. Keep this in sync with mapTrackStatus() in
// supabase/functions/track-poll/index.ts (and its twins in
// track-catchup-units and track-webhook).
//
// 2026-05-23: a missed 'cancelled' case silently inflated the Open Tasks
// dashboard by ~10.9K rows. These tests prevent that class of bug.

import { describe, expect, it } from "vitest";

const KNOWN_NEW_TRACK_STATUSES = new Set([
  "pending", "open", "new", "scheduled", "draft", "queued", "", "null",
]);

function mapTrackStatus(s: string, unknownTracker?: Set<string>): string {
  if (!s) return "new";
  const t = s.toLowerCase();
  const normalized = t.replace(/[-_]/g, "");
  if (t.includes("cancel") || t.includes("void") || t.includes("archive") || t.includes("reject")) return "completed";
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  if (normalized.includes("inprogress") || t.includes("started")) return "in_progress";
  if (t.includes("assign")) return "assigned";
  if (t.includes("vendor") && t.includes("not") && t.includes("start")) return "vendor_not_started";
  if (t.includes("exception") || t.includes("hold") || t.includes("block")) return "blocked";
  if (t.includes("wait")) return "waiting_parts";
  if (unknownTracker && !KNOWN_NEW_TRACK_STATUSES.has(t)) unknownTracker.add(t);
  return "new";
}

describe("mapTrackStatus - live-probed TRACK enum", () => {
  it("maps cancelled -> completed (terminal)", () => {
    expect(mapTrackStatus("cancelled")).toBe("completed");
    expect(mapTrackStatus("Cancelled")).toBe("completed");
  });

  it("maps in-progress (hyphenated) -> in_progress", () => {
    expect(mapTrackStatus("in-progress")).toBe("in_progress");
    expect(mapTrackStatus("In-Progress")).toBe("in_progress");
    expect(mapTrackStatus("in_progress")).toBe("in_progress");
    expect(mapTrackStatus("inprogress")).toBe("in_progress");
  });

  it("maps vendor-not-start -> vendor_not_started", () => {
    expect(mapTrackStatus("vendor-not-start")).toBe("vendor_not_started");
  });

  it("maps vendor-assigned -> assigned", () => {
    expect(mapTrackStatus("vendor-assigned")).toBe("assigned");
  });

  it("maps exception -> blocked", () => {
    expect(mapTrackStatus("exception")).toBe("blocked");
  });

  it("maps processed / completed / verified to themselves", () => {
    expect(mapTrackStatus("processed")).toBe("processed");
    expect(mapTrackStatus("completed")).toBe("completed");
    expect(mapTrackStatus("verified")).toBe("verified");
  });

  it("keeps pending and open as new (legitimate fallback)", () => {
    expect(mapTrackStatus("pending")).toBe("new");
    expect(mapTrackStatus("open")).toBe("new");
  });

  it("treats null/empty as new", () => {
    expect(mapTrackStatus("")).toBe("new");
    expect(mapTrackStatus(null as unknown as string)).toBe("new");
  });
});

describe("mapTrackStatus - unknown status tracker", () => {
  it("does not log known fallback statuses as unknown", () => {
    const tracker = new Set<string>();
    mapTrackStatus("pending", tracker);
    mapTrackStatus("open", tracker);
    mapTrackStatus("scheduled", tracker);
    expect(tracker.size).toBe(0);
  });

  it("logs truly unknown statuses for surfacing in audit_logs", () => {
    const tracker = new Set<string>();
    expect(mapTrackStatus("snoozed", tracker)).toBe("new");
    expect(mapTrackStatus("teleported", tracker)).toBe("new");
    expect(tracker.has("snoozed")).toBe(true);
    expect(tracker.has("teleported")).toBe(true);
    expect(tracker.size).toBe(2);
  });
});

describe("mapTrackStatus - synonym coverage", () => {
  it("treats void / archive / reject as terminal completed", () => {
    expect(mapTrackStatus("voided")).toBe("completed");
    expect(mapTrackStatus("archived")).toBe("completed");
    expect(mapTrackStatus("rejected")).toBe("completed");
  });

  it("treats hold / block as blocked", () => {
    expect(mapTrackStatus("on-hold")).toBe("blocked");
    expect(mapTrackStatus("blocked")).toBe("blocked");
  });

  it("treats wait as waiting_parts", () => {
    expect(mapTrackStatus("waiting-parts")).toBe("waiting_parts");
  });
});
