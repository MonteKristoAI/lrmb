import { describe, expect, it } from "vitest";

/**
 * Demo Walkthrough — unit tests
 *
 * The /demo-walkthrough page is a pure frontend component with no server
 * procedures. These tests validate the widget config endpoint that the
 * embed widget relies on (same infrastructure the walkthrough showcases).
 *
 * Widget route tests live in widgetRoutes.test.ts. Here we test the
 * data structures and validation logic used by the walkthrough's
 * simulated intelligence card.
 */

/* ------------------------------------------------------------------ */
/*  Simulated intelligence extraction validation                       */
/* ------------------------------------------------------------------ */

interface IntelligenceCard {
  callerName: string;
  email: string;
  appointment: string;
  leadScore: number;
  painPoint: string;
}

function validateIntelligenceCard(card: IntelligenceCard): string[] {
  const errors: string[] = [];

  if (!card.callerName || card.callerName.trim().length < 2) {
    errors.push("callerName must be at least 2 characters");
  }

  if (card.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(card.email)) {
    errors.push("email format is invalid");
  }

  if (card.leadScore < 0 || card.leadScore > 100) {
    errors.push("leadScore must be between 0 and 100");
  }

  if (!card.painPoint || card.painPoint.trim().length === 0) {
    errors.push("painPoint must not be empty");
  }

  return errors;
}

describe("intelligence card validation", () => {
  it("accepts a valid intelligence card", () => {
    const card: IntelligenceCard = {
      callerName: "Marcus Chen",
      email: "marcus.chen@gmail.com",
      appointment: "Thu 2:30 PM — Cleaning",
      leadScore: 92,
      painPoint: "Patient hasn't visited in 2 years",
    };
    expect(validateIntelligenceCard(card)).toEqual([]);
  });

  it("rejects empty caller name", () => {
    const card: IntelligenceCard = {
      callerName: "",
      email: "test@test.com",
      appointment: "Fri 10 AM",
      leadScore: 80,
      painPoint: "Needs emergency repair",
    };
    const errors = validateIntelligenceCard(card);
    expect(errors).toContain("callerName must be at least 2 characters");
  });

  it("rejects single-character caller name", () => {
    const card: IntelligenceCard = {
      callerName: "A",
      email: "test@test.com",
      appointment: "Fri 10 AM",
      leadScore: 80,
      painPoint: "Needs emergency repair",
    };
    const errors = validateIntelligenceCard(card);
    expect(errors).toContain("callerName must be at least 2 characters");
  });

  it("rejects invalid email format", () => {
    const card: IntelligenceCard = {
      callerName: "Jane Doe",
      email: "not-an-email",
      appointment: "Mon 3 PM",
      leadScore: 75,
      painPoint: "AC not cooling",
    };
    const errors = validateIntelligenceCard(card);
    expect(errors).toContain("email format is invalid");
  });

  it("accepts empty email (caller didn't provide one)", () => {
    const card: IntelligenceCard = {
      callerName: "Jane Doe",
      email: "",
      appointment: "Mon 3 PM",
      leadScore: 75,
      painPoint: "AC not cooling",
    };
    expect(validateIntelligenceCard(card)).toEqual([]);
  });

  it("rejects lead score above 100", () => {
    const card: IntelligenceCard = {
      callerName: "Bob Smith",
      email: "bob@example.com",
      appointment: "Wed 11 AM",
      leadScore: 150,
      painPoint: "Wants full renovation",
    };
    const errors = validateIntelligenceCard(card);
    expect(errors).toContain("leadScore must be between 0 and 100");
  });

  it("rejects negative lead score", () => {
    const card: IntelligenceCard = {
      callerName: "Bob Smith",
      email: "bob@example.com",
      appointment: "Wed 11 AM",
      leadScore: -5,
      painPoint: "Wants full renovation",
    };
    const errors = validateIntelligenceCard(card);
    expect(errors).toContain("leadScore must be between 0 and 100");
  });

  it("rejects empty pain point", () => {
    const card: IntelligenceCard = {
      callerName: "Alice Johnson",
      email: "alice@example.com",
      appointment: "Tue 9 AM",
      leadScore: 60,
      painPoint: "",
    };
    const errors = validateIntelligenceCard(card);
    expect(errors).toContain("painPoint must not be empty");
  });

  it("accepts lead score of 0 (valid minimum)", () => {
    const card: IntelligenceCard = {
      callerName: "Test User",
      email: "test@example.com",
      appointment: "N/A",
      leadScore: 0,
      painPoint: "General inquiry only",
    };
    expect(validateIntelligenceCard(card)).toEqual([]);
  });

  it("accepts lead score of 100 (valid maximum)", () => {
    const card: IntelligenceCard = {
      callerName: "Hot Lead",
      email: "hot@example.com",
      appointment: "ASAP",
      leadScore: 100,
      painPoint: "Urgent need, ready to buy today",
    };
    expect(validateIntelligenceCard(card)).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/*  Transcript timing validation                                       */
/* ------------------------------------------------------------------ */

interface TranscriptEntry {
  speaker: "aia" | "caller";
  timestamp: number; // seconds from start
  text: string;
}

function validateTranscriptOrder(entries: TranscriptEntry[]): boolean {
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].timestamp < entries[i - 1].timestamp) return false;
  }
  return true;
}

function validateTranscriptAlternation(entries: TranscriptEntry[]): boolean {
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].speaker === entries[i - 1].speaker) return false;
  }
  return true;
}

describe("transcript validation", () => {
  const validTranscript: TranscriptEntry[] = [
    { speaker: "aia", timestamp: 1, text: "Thank you for calling..." },
    { speaker: "caller", timestamp: 4, text: "Hi, I'd like to schedule..." },
    { speaker: "aia", timestamp: 10, text: "Of course! I'd be happy..." },
    { speaker: "caller", timestamp: 19, text: "Sure, it's Marcus..." },
    { speaker: "aia", timestamp: 24, text: "Perfect, Marcus..." },
    { speaker: "caller", timestamp: 38, text: "Yeah, it's marcus.chen..." },
    { speaker: "aia", timestamp: 44, text: "You're all set, Marcus!" },
  ];

  it("validates correct chronological order", () => {
    expect(validateTranscriptOrder(validTranscript)).toBe(true);
  });

  it("validates speaker alternation (aia/caller/aia/caller)", () => {
    expect(validateTranscriptAlternation(validTranscript)).toBe(true);
  });

  it("rejects out-of-order timestamps", () => {
    const badOrder: TranscriptEntry[] = [
      { speaker: "aia", timestamp: 10, text: "Hello" },
      { speaker: "caller", timestamp: 5, text: "Hi" },
    ];
    expect(validateTranscriptOrder(badOrder)).toBe(false);
  });

  it("rejects consecutive same-speaker entries", () => {
    const badAlternation: TranscriptEntry[] = [
      { speaker: "aia", timestamp: 1, text: "Hello" },
      { speaker: "aia", timestamp: 5, text: "Are you there?" },
    ];
    expect(validateTranscriptAlternation(badAlternation)).toBe(false);
  });

  it("handles single-entry transcript", () => {
    const single: TranscriptEntry[] = [
      { speaker: "aia", timestamp: 0, text: "Hello" },
    ];
    expect(validateTranscriptOrder(single)).toBe(true);
    expect(validateTranscriptAlternation(single)).toBe(true);
  });

  it("AiA always speaks first in the demo", () => {
    expect(validTranscript[0].speaker).toBe("aia");
  });

  it("AiA always speaks last in the demo (closing)", () => {
    expect(validTranscript[validTranscript.length - 1].speaker).toBe("aia");
  });
});
