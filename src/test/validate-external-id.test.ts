// L10 audit 2026-06-09: validateExternalId() is the gate that decides
// whether a TRACK row gets upserted or aborts. If this lets a sentinel
// through ('undefined', 'null', '', whitespace) we end up with junk
// external_id rows that can NEVER be matched to a real TRACK WO again,
// and the local_terminal guard in track-refresh-stale can't recover them
// because the external_id query 404s forever.
//
// Port of validateExternalId from supabase/functions/track-poll/index.ts.
// Keep in sync.

import { describe, expect, it } from "vitest";

function validateExternalId(raw: unknown): string {
  if (raw === null || raw === undefined) {
    throw new Error("row.id missing");
  }
  const s = String(raw).trim();
  if (!s || s === "undefined" || s === "null" || s === "NaN") {
    throw new Error(`row.id invalid: ${JSON.stringify(raw)}`);
  }
  return s;
}

describe("validateExternalId — sentinel rejection", () => {
  it("rejects null", () => {
    expect(() => validateExternalId(null)).toThrow(/row\.id missing/);
  });

  it("rejects undefined", () => {
    expect(() => validateExternalId(undefined)).toThrow(/row\.id missing/);
  });

  it("rejects the literal 'undefined' string (TRACK serialization bug)", () => {
    expect(() => validateExternalId("undefined")).toThrow(/row\.id invalid/);
  });

  it("rejects the literal 'null' string", () => {
    expect(() => validateExternalId("null")).toThrow(/row\.id invalid/);
  });

  it("rejects the literal 'NaN' string", () => {
    expect(() => validateExternalId("NaN")).toThrow(/row\.id invalid/);
  });

  it("rejects empty string", () => {
    expect(() => validateExternalId("")).toThrow(/row\.id invalid/);
  });

  it("rejects whitespace-only string", () => {
    expect(() => validateExternalId("   ")).toThrow(/row\.id invalid/);
    expect(() => validateExternalId("\t\n")).toThrow(/row\.id invalid/);
  });

  it("rejects NaN as a number", () => {
    // String(NaN) === "NaN" — caught by the sentinel branch.
    expect(() => validateExternalId(NaN)).toThrow(/row\.id invalid/);
  });
});

describe("validateExternalId — valid identifiers", () => {
  it("accepts a normal integer id and stringifies it", () => {
    expect(validateExternalId(32390)).toBe("32390");
  });

  it("accepts a numeric string", () => {
    expect(validateExternalId("32390")).toBe("32390");
  });

  it("accepts zero (legitimate edge case)", () => {
    // String(0) === "0", non-empty, not a sentinel.
    expect(validateExternalId(0)).toBe("0");
  });

  it("trims surrounding whitespace", () => {
    expect(validateExternalId("  32390  ")).toBe("32390");
  });

  it("accepts a UUID-like string", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(validateExternalId(uuid)).toBe(uuid);
  });

  it("accepts a very long numeric string (TRACK never sends one but should not crash)", () => {
    const big = "9".repeat(50);
    expect(validateExternalId(big)).toBe(big);
  });

  it("accepts a negative integer (TRACK never uses one but should not silently fail)", () => {
    expect(validateExternalId(-1)).toBe("-1");
  });
});
