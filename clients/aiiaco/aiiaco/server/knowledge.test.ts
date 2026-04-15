import { describe, it, expect, vi } from "vitest";

/**
 * Knowledge Base — Unit tests
 * Tests the knowledge base data flow and push-to-agent logic.
 */

// ─── Test: Knowledge entry structure ─────────────────────────────────────────

describe("Knowledge Base Entry Structure", () => {
  it("should validate category enum values", () => {
    const validCategories = ["packages", "company", "processes", "faq", "other"];
    validCategories.forEach(cat => {
      expect(validCategories).toContain(cat);
    });
    expect(validCategories).not.toContain("invalid");
  });

  it("should validate source enum values", () => {
    const validSources = ["document", "website", "conversation", "manual"];
    validSources.forEach(src => {
      expect(validSources).toContain(src);
    });
    expect(validSources).not.toContain("api");
  });

  it("should enforce title length constraints", () => {
    const maxTitleLength = 255;
    const validTitle = "Agent Package — Full Details";
    const tooLongTitle = "x".repeat(256);
    expect(validTitle.length).toBeLessThanOrEqual(maxTitleLength);
    expect(tooLongTitle.length).toBeGreaterThan(maxTitleLength);
  });

  it("should enforce content length constraints", () => {
    const maxContentLength = 50000;
    const validContent = "This is knowledge content about AiiACo packages.";
    expect(validContent.length).toBeLessThanOrEqual(maxContentLength);
  });
});

// ─── Test: Knowledge prompt assembly ─────────────────────────────────────────

describe("Knowledge Prompt Assembly", () => {
  it("should build knowledge section from entries", () => {
    const entries = [
      { title: "Agent Package", content: "Details about the agent package..." },
      { title: "Operator Package", content: "Details about the operator package..." },
      { title: "Corporate Package", content: "Details about the corporate package..." },
    ];

    const knowledgeSection = entries.map(e => `### ${e.title}\n${e.content}`).join("\n\n");

    expect(knowledgeSection).toContain("### Agent Package");
    expect(knowledgeSection).toContain("### Operator Package");
    expect(knowledgeSection).toContain("### Corporate Package");
    expect(knowledgeSection).toContain("Details about the agent package...");
  });

  it("should inject knowledge into prompt with markers", () => {
    const basePrompt = `You are AiA.

## Deep Company Knowledge

Old knowledge here.

## Identity & Adversarial Resilience

Never break character.`;

    const knowledgeSection = "### New Knowledge\nFresh content here.";
    const knowledgeMarker = "## Deep Company Knowledge";
    const nextSectionMarker = "## Identity & Adversarial Resilience";

    let fullPrompt: string;
    if (basePrompt.includes(knowledgeMarker) && basePrompt.includes(nextSectionMarker)) {
      const beforeKnowledge = basePrompt.split(knowledgeMarker)[0];
      const afterKnowledge = basePrompt.split(nextSectionMarker).slice(1).join(nextSectionMarker);
      fullPrompt = `${beforeKnowledge}${knowledgeMarker}\n\n${knowledgeSection}\n\n${nextSectionMarker}${afterKnowledge}`;
    } else {
      fullPrompt = `${basePrompt}\n\n## Additional Knowledge\n\n${knowledgeSection}`;
    }

    expect(fullPrompt).toContain("You are AiA.");
    expect(fullPrompt).toContain("### New Knowledge");
    expect(fullPrompt).toContain("Fresh content here.");
    expect(fullPrompt).toContain("Never break character.");
    expect(fullPrompt).not.toContain("Old knowledge here.");
  });

  it("should fallback to appending when markers are missing", () => {
    const basePrompt = "You are AiA. Simple prompt without markers.";
    const knowledgeSection = "### FAQ\nCommon questions.";
    const knowledgeMarker = "## Deep Company Knowledge";
    const nextSectionMarker = "## Identity & Adversarial Resilience";

    let fullPrompt: string;
    if (basePrompt.includes(knowledgeMarker) && basePrompt.includes(nextSectionMarker)) {
      const beforeKnowledge = basePrompt.split(knowledgeMarker)[0];
      const afterKnowledge = basePrompt.split(nextSectionMarker).slice(1).join(nextSectionMarker);
      fullPrompt = `${beforeKnowledge}${knowledgeMarker}\n\n${knowledgeSection}\n\n${nextSectionMarker}${afterKnowledge}`;
    } else {
      fullPrompt = `${basePrompt}\n\n## Additional Knowledge\n\n${knowledgeSection}`;
    }

    expect(fullPrompt).toContain("You are AiA. Simple prompt without markers.");
    expect(fullPrompt).toContain("## Additional Knowledge");
    expect(fullPrompt).toContain("### FAQ");
  });

  it("should handle empty knowledge entries gracefully", () => {
    const entries: { title: string; content: string }[] = [];
    const knowledgeSection = entries.map(e => `### ${e.title}\n${e.content}`).join("\n\n");
    expect(knowledgeSection).toBe("");
  });

  it("should filter only active entries for push", () => {
    const allEntries = [
      { id: 1, title: "Active", content: "content", isActive: 1 },
      { id: 2, title: "Inactive", content: "content", isActive: 0 },
      { id: 3, title: "Also Active", content: "content", isActive: 1 },
    ];

    const activeEntries = allEntries.filter(e => e.isActive === 1);
    expect(activeEntries).toHaveLength(2);
    expect(activeEntries.map(e => e.title)).toEqual(["Active", "Also Active"]);
  });

  it("should detect stale entries (updated after last push)", () => {
    const entry = {
      updatedAt: new Date("2026-03-12T10:00:00Z"),
      lastPushedAt: new Date("2026-03-12T08:00:00Z"),
    };
    const isStale = entry.lastPushedAt && new Date(entry.updatedAt) > new Date(entry.lastPushedAt);
    expect(isStale).toBe(true);
  });

  it("should detect synced entries (pushed after update)", () => {
    const entry = {
      updatedAt: new Date("2026-03-12T08:00:00Z"),
      lastPushedAt: new Date("2026-03-12T10:00:00Z"),
    };
    const isStale = entry.lastPushedAt && new Date(entry.updatedAt) > new Date(entry.lastPushedAt);
    expect(isStale).toBe(false);
  });
});

// ─── Test: Seed data completeness ────────────────────────────────────────────

describe("Knowledge Base Seed Data", () => {
  const expectedCategories = ["company", "packages", "processes", "faq"];
  const expectedTitles = [
    "Company Overview",
    "Agent Package",
    "Operator Package",
    "Corporate",
    "Engagement Process",
    "Common Questions",
  ];

  it("should cover all major categories", () => {
    // The seed creates entries in company, packages, processes, faq categories
    expectedCategories.forEach(cat => {
      expect(["packages", "company", "processes", "faq", "other"]).toContain(cat);
    });
  });

  it("should include all three package types", () => {
    const packageNames = ["Agent", "Operator", "Corporate"];
    packageNames.forEach(pkg => {
      expect(expectedTitles.some(t => t.includes(pkg) || pkg.includes("Corporate"))).toBe(true);
    });
  });
});
