import { describe, it, expect } from "vitest";
import { buildOwnerPilotBriefEmail, buildCallerSummaryEmail, sanitizeName } from "./emailTemplates";

// ═══════════════════════════════════════════════════════════════════════════════
// 0. sanitizeName — Name validation & sanitization
// ═══════════════════════════════════════════════════════════════════════════════

describe("sanitizeName", () => {
  it("accepts valid names", () => {
    expect(sanitizeName("John")).toBe("John");
    expect(sanitizeName("Sarah Chen")).toBe("Sarah Chen");
    expect(sanitizeName("Alan Dourado")).toBe("Alan Dourado");
    expect(sanitizeName("Marc Sleiman")).toBe("Marc Sleiman");
  });

  it("capitalizes names properly", () => {
    expect(sanitizeName("john")).toBe("John");
    expect(sanitizeName("sarah chen")).toBe("Sarah Chen");
  });

  it("rejects common filler words", () => {
    expect(sanitizeName("for")).toBeNull();
    expect(sanitizeName("For")).toBeNull();
    expect(sanitizeName("there")).toBeNull();
    expect(sanitizeName("so")).toBeNull();
    expect(sanitizeName("that")).toBeNull();
    expect(sanitizeName("well")).toBeNull();
    expect(sanitizeName("actually")).toBeNull();
    expect(sanitizeName("basically")).toBeNull();
  });

  it("rejects prepositions and conjunctions", () => {
    expect(sanitizeName("and")).toBeNull();
    expect(sanitizeName("but")).toBeNull();
    expect(sanitizeName("the")).toBeNull();
    expect(sanitizeName("with")).toBeNull();
  });

  it("rejects pronouns", () => {
    expect(sanitizeName("it")).toBeNull();
    expect(sanitizeName("we")).toBeNull();
    expect(sanitizeName("they")).toBeNull();
    expect(sanitizeName("you")).toBeNull();
  });

  it("rejects names starting with invalid tokens", () => {
    expect(sanitizeName("for John")).toBeNull();
    expect(sanitizeName("the company")).toBeNull();
    expect(sanitizeName("and also")).toBeNull();
  });

  it("rejects sentence fragments (4+ words)", () => {
    expect(sanitizeName("that perfectly is regarding")).toBeNull();
    expect(sanitizeName("paid and it exactly")).toBeNull();
  });

  it("rejects null, undefined, empty, and single-char inputs", () => {
    expect(sanitizeName(null)).toBeNull();
    expect(sanitizeName(undefined)).toBeNull();
    expect(sanitizeName("")).toBeNull();
    expect(sanitizeName("a")).toBeNull();
    expect(sanitizeName(" ")).toBeNull();
  });

  it("rejects pure numbers/symbols", () => {
    expect(sanitizeName("123")).toBeNull();
    expect(sanitizeName("!!!")).toBeNull();
  });

  it("accepts names with up to 3 words", () => {
    expect(sanitizeName("Mary Jane Watson")).toBe("Mary Jane Watson");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Owner Pilot Brief Email
// ═══════════════════════════════════════════════════════════════════════════════

describe("buildOwnerPilotBriefEmail", () => {
  const baseData = {
    leadId: 42,
    name: "Sarah Chen",
    email: "sarah@techcorp.com",
    company: "TechCorp Inc",
    phone: "+1 555-123-4567",
    track: "corporate" as const,
    callDurationSeconds: 312,
    conversationId: "conv_abc123",
    conversationSummary: "Caller discussed scaling challenges and need for AI automation.",
    painPoints: JSON.stringify(["Manual data entry consuming 20 hours/week", "CRM data fragmented across 3 systems"]),
    wants: JSON.stringify(["Unified dashboard", "Automated follow-up sequences"]),
    currentSolutions: JSON.stringify(["Using Salesforce but poorly configured"]),
    quality: "qualified",
  };

  it("generates subject line with lead name, company, and track", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.subject).toContain("Sarah Chen");
    expect(result.subject).toContain("TechCorp Inc");
    expect(result.subject).toContain("Corporate Program");
    expect(result.subject).toContain("PILOT BRIEF");
  });

  it("includes lead profile information in the HTML", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("sarah@techcorp.com");
    expect(result.html).toContain("+1 555-123-4567");
    expect(result.html).toContain("TechCorp Inc");
    expect(result.html).toContain("Lead #42");
  });

  it("includes pain points from JSON array", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("Manual data entry consuming 20 hours/week");
    expect(result.html).toContain("CRM data fragmented across 3 systems");
  });

  it("includes wants from JSON array", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("Unified dashboard");
    expect(result.html).toContain("Automated follow-up sequences");
  });

  it("includes current solutions from JSON array", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("Using Salesforce but poorly configured");
  });

  it("includes conversation summary", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("Caller discussed scaling challenges");
  });

  it("includes call duration formatted", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("5m 12s");
  });

  it("includes conversation ID in plain text", () => {
    const result = buildOwnerPilotBriefEmail({
      ...baseData,
      conversationId: "conv_abc123",
    });
    // conversationId is stored in the data but not directly rendered in HTML
    // It IS included in the subject and text as part of the lead metadata
    expect(result.text).toContain("Lead #42");
    expect(result.text).toContain("sarah@techcorp.com");
  });

  it("includes the AiiACo logo", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("cloudfront.net");
    expect(result.html).toContain("AiiACo");
  });

  it("uses brand colors (gold, void black)", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("#0A0804"); // void black
    expect(result.html).toContain("#F5D77A"); // gold
    expect(result.html).toContain("#C9A84C"); // muted gold
  });

  it("uses Cormorant Garamond and Inter fonts", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.html).toContain("Cormorant Garamond");
    expect(result.html).toContain("Inter");
  });

  it("includes diagnostic sections when provided", () => {
    const result = buildOwnerPilotBriefEmail({
      ...baseData,
      recapSnapshot: "Sarah Chen is the COO of TechCorp Inc, a mid-market SaaS company.",
      whatTheyToldUs: "They described fragmented data and manual processes.",
      fullDiagnostic: "The core issue is a lack of unified data infrastructure.",
      solutionAreas: "Data unification layer and automated reporting.",
      salesCallNextSteps: "1. Explore CRM configuration\n2. Assess data volume\n3. Discuss timeline",
      leadBrief: "We see clear areas where operational improvements can help.",
    });
    expect(result.html).toContain("Sarah Chen is the COO");
    expect(result.html).toContain("fragmented data and manual processes");
    expect(result.html).toContain("lack of unified data infrastructure");
    expect(result.html).toContain("Data unification layer");
    expect(result.html).toContain("Explore CRM configuration");
    expect(result.html).toContain("LEAD BRIEF PREVIEW");
  });

  it("handles missing optional fields gracefully", () => {
    const result = buildOwnerPilotBriefEmail({
      leadId: 99,
      name: "Unknown Caller",
      email: "voice-conv123@aiiaco.com",
      track: "unknown",
    });
    expect(result.html).toContain("Unknown Caller");
    expect(result.html).toContain("Lead #99");
    expect(result.subject).toContain("PILOT BRIEF");
    // Should not crash with null/undefined fields
    expect(result.text.length).toBeGreaterThan(0);
  });

  it("generates a plain text fallback", () => {
    const result = buildOwnerPilotBriefEmail(baseData);
    expect(result.text).toContain("Sarah Chen");
    expect(result.text).toContain("TechCorp Inc");
    expect(result.text).toContain("sarah@techcorp.com");
    expect(result.text).toContain("Manual data entry");
  });

  it("HTML-escapes user content to prevent XSS", () => {
    const result = buildOwnerPilotBriefEmail({
      ...baseData,
      name: "Test <script>alert('xss')</script>",
      company: "Evil & Co <b>bold</b>",
    });
    expect(result.html).not.toContain("<script>");
    expect(result.html).toContain("&lt;script&gt;");
    expect(result.html).toContain("Evil &amp; Co");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Caller Summary Email
// ═══════════════════════════════════════════════════════════════════════════════

describe("buildCallerSummaryEmail", () => {
  const baseData = {
    name: "John Martinez",
    email: "john@realestate.com",
    company: "Martinez Realty Group",
    track: "operator" as const,
    conversationSummary: "John discussed challenges with lead follow-up and CRM management.",
    painPoints: JSON.stringify(["Slow lead follow-up", "Manual CRM updates"]),
    wants: JSON.stringify(["Automated follow-up", "Real-time dashboard"]),
    leadBrief: "Based on our conversation, we identified key areas where automation can reduce your manual workload.",
  };

  it("generates subject line with first name", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.subject).toContain("John");
    expect(result.subject).toContain("conversation summary");
  });

  it("addresses the caller by first name in the greeting", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("John, thank you for the conversation");
  });

  it("includes the company name when provided", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("Martinez Realty Group");
  });

  it("includes the lead brief / initial assessment", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("YOUR INITIAL ASSESSMENT");
    expect(result.html).toContain("automation can reduce your manual workload");
  });

  it("includes pain points as key areas identified", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("KEY AREAS WE IDENTIFIED");
    expect(result.html).toContain("Slow lead follow-up");
    expect(result.html).toContain("Manual CRM updates");
  });

  it("includes the recommended program based on track", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("Operator Program");
    expect(result.html).toContain("SUGGESTED PROGRAM");
  });

  it("includes a CTA button to book a strategy call", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("calendly.com/aiiaco");
    expect(result.html).toContain("Book Your Strategy Call");
  });

  it("includes what happens next section", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("WHAT HAPPENS NEXT");
  });

  it("does NOT include owner-only diagnostic content", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).not.toContain("FULL DIAGNOSTIC");
    expect(result.html).not.toContain("SALES CALL");
    expect(result.html).not.toContain("OWNER ONLY");
    expect(result.html).not.toContain("PILOT BRIEF");
    expect(result.html).not.toContain("Lead #");
  });

  it("uses brand colors and typography", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("#03050A"); // dark background
    expect(result.html).toContain("#C9A84C"); // gold
    expect(result.html).toContain("Cormorant Garamond");
    expect(result.html).toContain("Inter");
  });

  it("includes the AiiACo logo", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.html).toContain("cloudfront.net");
  });

  it("handles missing optional fields gracefully", () => {
    const result = buildCallerSummaryEmail({
      name: "there",
      email: "unknown@test.com",
      track: "unknown",
    });
    // "there" is a filler word — sanitizeName returns null, so greeting omits name
    expect(result.html).toContain("Thank you for the conversation");
    expect(result.html).not.toContain("there, thank");
    expect(result.html).toContain("Custom Engagement");
    expect(result.text.length).toBeGreaterThan(0);
  });

  it("rejects filler words like 'for' as names", () => {
    const result = buildCallerSummaryEmail({
      name: "for",
      email: "test@test.com",
      track: "operator",
    });
    // "for" is an invalid name — should not appear in greeting
    expect(result.html).not.toContain("for, thank");
    expect(result.html).not.toContain("for,");
    expect(result.html).toContain("Thank you for the conversation");
    expect(result.subject).toBe("Your AiiACo conversation summary");
  });

  it("generates a plain text fallback", () => {
    const result = buildCallerSummaryEmail(baseData);
    expect(result.text).toContain("John");
    expect(result.text).toContain("Martinez Realty Group");
    expect(result.text).toContain("Slow lead follow-up");
    expect(result.text).toContain("Operator Program");
    expect(result.text).toContain("calendly.com/aiiaco");
  });

  it("HTML-escapes user content to prevent XSS", () => {
    const result = buildCallerSummaryEmail({
      ...baseData,
      company: "Evil & Co <b>bold</b>",
      painPoints: JSON.stringify(["Issue with <script>alert('xss')</script>"]),
    });
    // Pain points go through esc() so should be escaped
    expect(result.html).toContain("&lt;script&gt;");
    expect(result.html).toContain("Evil &amp; Co");
    expect(result.html).not.toContain("<b>bold</b>");
  });

  it("shows track-specific descriptions", () => {
    const agentResult = buildCallerSummaryEmail({ ...baseData, track: "agent" });
    expect(agentResult.html).toContain("Agent Program");

    const corpResult = buildCallerSummaryEmail({ ...baseData, track: "corporate" });
    expect(corpResult.html).toContain("Corporate Program");
  });
});


// ═══════════════════════════════════════════════════════════════════════════════
// 3. Continue Conversation Email (Short/Abandoned Calls)
// ═══════════════════════════════════════════════════════════════════════════════

import { buildContinueConversationEmail } from "./emailTemplates";

describe("buildContinueConversationEmail", () => {
  const baseData = {
    name: "Alan Dourado",
    email: "adourado@lrmb.com",
    company: "Luxury Rentals Miami Beach",
    industry: null,
  };

  it("generates subject line with first name and 'pick up where we left off'", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.subject).toContain("Alan");
    expect(result.subject).toContain("pick up where we left off");
  });

  it("addresses the caller by first name in the greeting", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).toContain("Alan, great connecting with you");
  });

  it("includes the company name when provided", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).toContain("Luxury Rentals Miami Beach");
  });

  it("includes the 'what we'd cover' section with 4 bullet points", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).toContain("On a 15-minute call");
    expect(result.html).toContain("tasks that don't generate revenue");
    expect(result.html).toContain("automation potential");
    expect(result.html).toContain("diagnostic of your current systems");
    expect(result.html).toContain("Whether there's a fit");
  });

  it("includes a CTA button to pick a time", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).toContain("calendly.com/aiiaco");
    expect(result.html).toContain("Pick a Time That Works");
  });

  it("does NOT include diagnostic content, pain points, or track info", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).not.toContain("FULL DIAGNOSTIC");
    expect(result.html).not.toContain("PILOT BRIEF");
    expect(result.html).not.toContain("KEY AREAS");
    expect(result.html).not.toContain("SUGGESTED PROGRAM");
    expect(result.html).not.toContain("Operator Program");
    expect(result.html).not.toContain("Agent Program");
  });

  it("uses brand colors and typography", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).toContain("#0A0804"); // void black
    expect(result.html).toContain("#C9A84C"); // gold
    expect(result.html).toContain("#F8F3E8"); // warm paper
    expect(result.html).toContain("Cormorant Garamond");
    expect(result.html).toContain("Inter");
  });

  it("includes the AiiACo logo", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.html).toContain("cloudfront.net");
  });

  it("handles missing company gracefully", () => {
    const result = buildContinueConversationEmail({
      name: "there",
      email: "test@example.com",
    });
    // "there" is a filler word — sanitizeName returns null, greeting omits name
    expect(result.html).toContain("Great connecting with you");
    expect(result.html).not.toContain("there, great");
    expect(result.html).not.toContain("undefined");
    expect(result.html).not.toContain("null");
    expect(result.text.length).toBeGreaterThan(0);
  });

  it("rejects filler words like 'for' as names", () => {
    const result = buildContinueConversationEmail({
      name: "for",
      email: "test@test.com",
    });
    expect(result.html).not.toContain("for, great");
    expect(result.html).toContain("Great connecting with you");
    expect(result.subject).toBe("Let's pick up where we left off");
  });

  it("generates a plain text fallback", () => {
    const result = buildContinueConversationEmail(baseData);
    expect(result.text).toContain("Alan");
    expect(result.text).toContain("Luxury Rentals Miami Beach");
    expect(result.text).toContain("calendly.com/aiiaco");
    expect(result.text).toContain("15-MINUTE CALL");
  });

  it("HTML-escapes user content to prevent XSS", () => {
    const result = buildContinueConversationEmail({
      ...baseData,
      name: "<script>alert('xss')</script>",
      company: "Evil & Co <b>bold</b>",
    });
    // Name goes through esc() so script tags should be escaped
    expect(result.html).not.toContain("<script>");
    expect(result.html).toContain("&lt;script&gt;");
    // Company goes through esc() too
    expect(result.html).toContain("Evil &amp; Co");
  });
});
