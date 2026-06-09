// L10 audit 2026-06-09: track-refresh-stale v2 state machine pins.
//
// Locked behaviors:
//   - LOCAL_TERMINAL guard: never downgrade processed/verified/completed/cancelled
//     even if TRACK returns 404 or a different status.
//   - 404 path on a non-terminal local: status becomes 'cancelled'.
//   - mapStatusForUpdate is intentionally NARROW — it only returns when TRACK
//     reports a terminal status. Any active state returns null so the row gets
//     its updated_at bumped (leaves stale window) without overwriting status.
//
// These tests replicate the exact pure-function behaviors. Keep in sync
// with supabase/functions/track-refresh-stale/index.ts.

import { describe, expect, it } from "vitest";

const LOCAL_TERMINAL = new Set(["processed", "verified", "completed", "cancelled"]);

function mapStatusForUpdate(t: string): string | null {
  if (!t) return null;
  if (/(cancel|void|archive|reject)/i.test(t)) return "cancelled";
  if (t.includes("processed")) return "processed";
  if (t.includes("verif")) return "verified";
  if (t.includes("complete")) return "completed";
  return null;
}

// Helper that mirrors the resolution logic in track-refresh-stale's main loop.
// Returns the action the loop SHOULD take for given inputs.
type Action =
  | "skip_rate_limited"
  | "terminal_skip_bump"      // 404 against a terminal local
  | "cancel_row"               // 404 against a non-terminal local
  | "http_error"               // 5xx that exhausted retries
  | "terminal_skip_bump_diff"  // 200 but local already terminal
  | "bump_no_change"           // 200 same as local OR mapStatusForUpdate returned null
  | "status_change"            // 200 with new terminal mapping
  ;

function decide(
  httpStatus: number,
  trackStatusBody: string,
  localStatus: string,
  rateLimitFired = false,
): Action {
  if (rateLimitFired) return "skip_rate_limited";
  if (httpStatus === 429) return "skip_rate_limited";
  if (httpStatus === 404) {
    return LOCAL_TERMINAL.has(localStatus) ? "terminal_skip_bump" : "cancel_row";
  }
  if (httpStatus >= 400) return "http_error";

  const newStatus = mapStatusForUpdate(trackStatusBody.toLowerCase());
  if (newStatus && newStatus !== localStatus && LOCAL_TERMINAL.has(localStatus)) {
    return "terminal_skip_bump_diff";
  }
  if (!newStatus || newStatus === localStatus) {
    return "bump_no_change";
  }
  return "status_change";
}

describe("track-refresh-stale — mapStatusForUpdate (terminal-only)", () => {
  it("cancellation family => 'cancelled'", () => {
    expect(mapStatusForUpdate("cancelled")).toBe("cancelled");
    expect(mapStatusForUpdate("voided")).toBe("cancelled");
    expect(mapStatusForUpdate("archived")).toBe("cancelled");
    expect(mapStatusForUpdate("rejected")).toBe("cancelled");
  });

  it("processed/verified/completed => themselves", () => {
    expect(mapStatusForUpdate("processed")).toBe("processed");
    expect(mapStatusForUpdate("verified")).toBe("verified");
    expect(mapStatusForUpdate("completed")).toBe("completed");
  });

  it("active states => null (deliberately narrow — DON'T overwrite active local state)", () => {
    expect(mapStatusForUpdate("in_progress")).toBeNull();
    expect(mapStatusForUpdate("assigned")).toBeNull();
    expect(mapStatusForUpdate("on-hold")).toBeNull();
    expect(mapStatusForUpdate("pending")).toBeNull();
    expect(mapStatusForUpdate("vendor-not-start")).toBeNull();
  });

  it("empty body => null (preserves local)", () => {
    expect(mapStatusForUpdate("")).toBeNull();
  });
});

describe("track-refresh-stale — 404 state machine", () => {
  it("404 against in_progress local => cancel_row", () => {
    expect(decide(404, "", "in_progress")).toBe("cancel_row");
  });

  it("404 against assigned local => cancel_row", () => {
    expect(decide(404, "", "assigned")).toBe("cancel_row");
  });

  it("404 against PROCESSED local => terminal_skip_bump (NEVER downgrade)", () => {
    expect(decide(404, "", "processed")).toBe("terminal_skip_bump");
  });

  it("404 against VERIFIED local => terminal_skip_bump", () => {
    expect(decide(404, "", "verified")).toBe("terminal_skip_bump");
  });

  it("404 against CANCELLED local => terminal_skip_bump (idempotent)", () => {
    expect(decide(404, "", "cancelled")).toBe("terminal_skip_bump");
  });

  it("404 against COMPLETED local => terminal_skip_bump", () => {
    expect(decide(404, "", "completed")).toBe("terminal_skip_bump");
  });
});

describe("track-refresh-stale — 200 status reconciliation", () => {
  it("local in_progress + TRACK cancelled => status_change to cancelled", () => {
    expect(decide(200, "cancelled", "in_progress")).toBe("status_change");
  });

  it("local in_progress + TRACK in_progress (active) => bump_no_change (narrow mapper)", () => {
    // mapStatusForUpdate('in_progress') is null — we deliberately don't
    // overwrite an active state. Row just leaves the stale window.
    expect(decide(200, "in_progress", "in_progress")).toBe("bump_no_change");
  });

  it("local in_progress + TRACK assigned => bump_no_change (active state, narrow mapper)", () => {
    expect(decide(200, "assigned", "in_progress")).toBe("bump_no_change");
  });

  it("local in_progress + TRACK completed => status_change", () => {
    expect(decide(200, "completed", "in_progress")).toBe("status_change");
  });

  it("local PROCESSED + TRACK reports cancelled => terminal_skip_bump_diff (do NOT downgrade)", () => {
    // L10 guard. Processed is later in the flow than cancelled. TRACK
    // sometimes flips a processed WO back to cancelled, and accepting
    // that downgrade clobbers Tony's accounting.
    expect(decide(200, "cancelled", "processed")).toBe("terminal_skip_bump_diff");
  });

  it("local VERIFIED + TRACK reports completed => terminal_skip_bump_diff", () => {
    expect(decide(200, "completed", "verified")).toBe("terminal_skip_bump_diff");
  });

  it("local cancelled + TRACK reports cancelled => bump_no_change (idempotent)", () => {
    expect(decide(200, "cancelled", "cancelled")).toBe("bump_no_change");
  });
});

describe("track-refresh-stale — rate limit + error paths", () => {
  it("429 from TRACK => skip_rate_limited (caller flips global flag)", () => {
    expect(decide(429, "", "in_progress")).toBe("skip_rate_limited");
  });

  it("subsequent rows after a 429 => skip_rate_limited", () => {
    expect(decide(200, "completed", "in_progress", true)).toBe("skip_rate_limited");
  });

  it("500 after retries exhausted => http_error", () => {
    expect(decide(500, "", "in_progress")).toBe("http_error");
  });

  it("403 (auth blip) => http_error (NOT cancel_row — only 404 cancels)", () => {
    expect(decide(403, "", "in_progress")).toBe("http_error");
  });
});
