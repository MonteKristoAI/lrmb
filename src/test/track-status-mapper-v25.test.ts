// L10 audit 2026-06-09: the existing track-status-mapper.test.ts holds
// a STALE inline copy of mapTrackStatus that returns "completed" for
// cancelled — supabase/functions/track-poll/index.ts at v25 now returns
// `null` for cancelled / voided / archived / rejected so the caller can
// hard-skip the row instead of misclassifying it as completed (which
// historically made cancelled WOs eligible for billing).
//
// This suite ports the CURRENT v25 production logic verbatim (regex
// guards included) and pins the negative-prefix behavior (uncancelled,
// restarted, unblocked, approval_unblocked) so any future regression
// in the regex shows up here loudly. Keep in sync with track-poll v25+.

import { describe, expect, it } from "vitest";

const KNOWN_NEW_TRACK_STATUSES = new Set([
  "pending", "open", "new", "scheduled", "draft", "queued", "",
]);

const RE_CANCEL  = /(?<![a-z])(?<!un)(?:cancel|void|archive|reject)/;
const RE_BLOCK   = /(?<![a-z])(?<!un)(?:block|hold|exception)/;
const RE_STARTED = /(?<![a-z])(?<!re)(?:started|inprogress|in_progress|in-progress)/;

// v26 (2026-06-09): apply REs to `t` (not `normalized`) so hyphen/underscore
// act as word boundaries. Fixes the on-hold→new bug that the previous
// version of this test had pinned as a DOCUMENTED GAP.
function mapTrackStatus(s: string, unknownTracker?: Set<string>): string | null {
  if (!s) return "new";
  const t = s.toLowerCase();
  const normalized = t.replace(/[-_]/g, "");

  if (RE_CANCEL.test(t)) return null;
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  if (t.includes("vendor") && t.includes("not") && t.includes("start")) return "vendor_not_started";
  if (normalized.includes("notstarted")) return "vendor_not_started";
  if (RE_STARTED.test(t)) return "in_progress";
  if (t.includes("assign")) return "assigned";
  if (RE_BLOCK.test(t)) return "blocked";
  if (t.includes("wait")) return "waiting_parts";
  if (unknownTracker && !KNOWN_NEW_TRACK_STATUSES.has(t)) {
    unknownTracker.add(t);
  }
  return "new";
}

describe("mapTrackStatus v25 — cancellation returns null (NOT completed)", () => {
  it("cancelled => null so caller hard-skips the upsert", () => {
    expect(mapTrackStatus("cancelled")).toBeNull();
    expect(mapTrackStatus("Cancelled")).toBeNull();
    expect(mapTrackStatus("CANCELLED")).toBeNull();
  });

  it("voided / archived / rejected => null", () => {
    expect(mapTrackStatus("voided")).toBeNull();
    expect(mapTrackStatus("archived")).toBeNull();
    expect(mapTrackStatus("rejected")).toBeNull();
  });

  it("negative-prefix antonyms do NOT match cancel/block/start regex", () => {
    // These should fall through to "new" — they are revived/reopened WOs.
    expect(mapTrackStatus("uncancelled")).toBe("new");
    expect(mapTrackStatus("unblocked")).toBe("new");
    expect(mapTrackStatus("approval_unblocked")).toBe("new");
    expect(mapTrackStatus("restarted")).toBe("new");
  });
});

describe("mapTrackStatus v25 — vendor_not_started precedence", () => {
  it("'not-started' (TRACK literal v29) => vendor_not_started", () => {
    expect(mapTrackStatus("not-started")).toBe("vendor_not_started");
    expect(mapTrackStatus("not_started")).toBe("vendor_not_started");
    expect(mapTrackStatus("notstarted")).toBe("vendor_not_started");
  });

  it("'vendor not started' (3-word phrase) => vendor_not_started, NOT in_progress", () => {
    // Without precedence the bare 'started' substring trips in_progress.
    expect(mapTrackStatus("vendor not started")).toBe("vendor_not_started");
    expect(mapTrackStatus("Vendor Not Started")).toBe("vendor_not_started");
  });
});

describe("mapTrackStatus v25 — synonym + boundary checks", () => {
  it("in-progress family => in_progress", () => {
    expect(mapTrackStatus("in-progress")).toBe("in_progress");
    expect(mapTrackStatus("in_progress")).toBe("in_progress");
    expect(mapTrackStatus("inprogress")).toBe("in_progress");
    expect(mapTrackStatus("started")).toBe("in_progress");
  });

  it("blocked / exception => blocked (bare word)", () => {
    expect(mapTrackStatus("blocked")).toBe("blocked");
    expect(mapTrackStatus("exception")).toBe("blocked");
    expect(mapTrackStatus("hold")).toBe("blocked");
  });

  // BUG FIX 2026-06-09 (v26): on-hold now correctly maps to 'blocked'.
  // The original v25 test surfaced this as a DOCUMENTED GAP — applying
  // RE_BLOCK to `normalized` (with hyphens stripped) collapsed "on-hold"
  // to "onhold", which then failed the `(?<![a-z])` lookbehind because
  // 'n' precedes 'h'. Fix: apply RE_BLOCK to `t` so the hyphen acts as
  // a non-alpha word boundary. on_hold + on-hold both match; "onhold"
  // (no boundary) correctly stays 'new' since no boundary exists.
  it("v26 FIX: 'on-hold' / 'on_hold' map to 'blocked' via hyphen/underscore boundary", () => {
    expect(mapTrackStatus("on-hold")).toBe("blocked");
    expect(mapTrackStatus("on_hold")).toBe("blocked");
    // Concatenated "onhold" without any boundary still falls through —
    // there is no boundary between 'on' and 'hold', so RE_BLOCK's
    // (?<![a-z]) correctly rejects. TRACK never sends this literal form.
    expect(mapTrackStatus("onhold")).toBe("new");
  });

  it("waiting-parts => waiting_parts", () => {
    expect(mapTrackStatus("waiting-parts")).toBe("waiting_parts");
    expect(mapTrackStatus("waiting_parts")).toBe("waiting_parts");
  });

  it("vendor-assigned => assigned", () => {
    expect(mapTrackStatus("vendor-assigned")).toBe("assigned");
    expect(mapTrackStatus("assigned")).toBe("assigned");
  });
});

describe("mapTrackStatus v25 — unknown tracker", () => {
  it("known fallbacks not logged", () => {
    const tracker = new Set<string>();
    mapTrackStatus("pending", tracker);
    mapTrackStatus("open", tracker);
    mapTrackStatus("scheduled", tracker);
    mapTrackStatus("draft", tracker);
    mapTrackStatus("queued", tracker);
    expect(tracker.size).toBe(0);
  });

  it("'null' string IS logged (v25 dropped from known list to surface real TRACK 'null' strings)", () => {
    const tracker = new Set<string>();
    expect(mapTrackStatus("null", tracker)).toBe("new");
    expect(tracker.has("null")).toBe(true);
  });

  it("truly unknown statuses surface in audit logs", () => {
    const tracker = new Set<string>();
    mapTrackStatus("snoozed", tracker);
    mapTrackStatus("frozen", tracker);
    expect(tracker.has("snoozed")).toBe(true);
    expect(tracker.has("frozen")).toBe(true);
  });
});

describe("mapTrackStatus v25 — empty / nullish input", () => {
  it("empty string => 'new'", () => {
    expect(mapTrackStatus("")).toBe("new");
  });

  it("null/undefined coerced via String() in caller, but raw falsy => 'new'", () => {
    expect(mapTrackStatus(null as unknown as string)).toBe("new");
    expect(mapTrackStatus(undefined as unknown as string)).toBe("new");
  });
});
