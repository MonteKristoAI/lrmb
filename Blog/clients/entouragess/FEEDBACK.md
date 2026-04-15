# Entourage Gummies -- Editorial Feedback & Standing Rules

Every rule here is either derived from a MonteKristo pattern (P-NNN), from the 2026-04-02 or 2026-04-10 feedback from Sandy, or from compliance requirements from Sandy's payment processor. None of them are stylistic preferences -- they are hard gates.

---

## Standing Rules

### 1. Zero em dashes, zero en dashes (site-wide)

Sandy calls em dashes "AI dashes" and has explicitly demanded they be removed from every page of the main site. The blog inherits this rule. The build rejects any post containing `—` or `–`. Use commas, periods, or rewrite the sentence.

**Why it matters:** Sandy's anti-AI-tone stance is one of the single most non-negotiable brand rules. Pattern P-014 (voice calibration) depends on this.

### 2. TiME INFUSION stylization (exact)

The only acceptable form is `TiME INFUSION`. Lowercase `i`, `INFUSION` all caps. It is a proper noun and a process, never a verb. The build rejects `Time Infusion`, `TIME INFUSION`, `time infusion`, `time-infusion`, and any construction that treats it as a verb ("TiME INFUSION absorbs..." is wrong; the correct phrasing is "TiME INFUSION is the infusion process that wraps each individual cannabinoid molecule in a hydrophilic coating. The compounds are then absorbed in the mouth and stomach.").

**Why it matters:** 2026-04-10 feedback PDF called this out specifically (Pillar 2 description, FAQ answer).

### 3. Azuca must never appear

The Preclinical Pharmacokinetic Data chart is re-drawn from scratch. The footnote is rewritten without the phrase "and funded by Azuca." **Azuca cannot be mentioned anywhere on the site, ever.** The build rejects any post containing the word (case-insensitive).

**Why it matters:** 2026-04-10 feedback PDF, explicit ban.

### 4. No medical claims

No "cures," "treats," "heals," "remedies," "medicine," or "pharmaceutical" language. The payment processor will reject the site if any post implies a medical benefit. The build rejects these words.

**Why it matters:** Payment processor compliance gate. Without this, the shop cannot process payments.

### 5. Farm Bill notice + FDA disclaimer on every page

Templates already inject both into the footer. Do not remove them when customizing a new post type or making CSS changes. 2018 Farm Bill compliance wording: "All Entourage Gummies products are derived from hemp and comply with the 2018 Farm Bill, containing less than 0.3% Delta 9 THC by dry weight." FDA disclaimer wording: "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."

**Why it matters:** Payment processor compliance.

### 6. 21+ age gate on every page

Templates inject a localStorage-backed modal with a 30-day TTL. First visit shows the modal and locks scroll until verification. "No" path shows a gated-out message. Do not remove the age gate.

**Why it matters:** Payment processor compliance + state law.

### 7. Gummy company > infusion tech emphasis

The brand is a gummy company whose moat happens to include a proprietary infusion process. The 2026-03-17 feedback from Sandy corrected us for over-emphasizing TiME INFUSION at the expense of the gummy brand identity. Every post must keep the emphasis on the gummy experience first, the process second.

**Why it matters:** Sandy's explicit repositioning from 2026-03-17, repeated on 2026-03-24.

### 8. Silhouettes on every page

Sandy has required Relaxed, Balanced, and Uplifted silhouettes on every page, not only the home page. The blog template carries them as hero background decoration. When designing a new page type, preserve them.

**Why it matters:** 2026-04-02 feedback.

### 9. No "high" language as a product benefit

The 2026-04-10 feedback PDF explicitly asked to remove the word "high" from the FAQ answer "what makes these different from other edibles." Treat "high" as soft-banned: acceptable when quoting a study or describing a general experience, never as a product benefit or selling point.

**Why it matters:** 2026-04-10 feedback.

### 10. Terpenes use Greek letter form

`β-Caryophyllene`, not `Beta Caryophyllene`. Same for other terpenes when a Greek form exists. 2026-04-10 feedback flagged this specifically for the Uplifted "Find Your Effect" section.

**Why it matters:** 2026-04-10 feedback.

### 11. "It's About TiME" stylization

When referring to onset / timing claims in titles or headers, use "It's About TiME" with capital M and E. 2026-04-10 feedback.

**Why it matters:** 2026-04-10 feedback.

### 12. The entourage-effect copy is locked (2026-04-10)

When a post needs to define the entourage effect at a high level, use this passage verbatim or very close to it:

> Cannabis flower contains hundreds of compounds, and when it is smoked, all of them are consumed at once. The experience the smoker gets is the result of all of those compounds working together and not just THC. THC drives the experience, CBD smooths it out, and terpenes shape the character.

**Why it matters:** 2026-04-10 feedback provided this wording specifically.

### 13. Auto-publish rule (Pattern P-015)

Non-medical-claim, non-regulatory posts that sit in Sandy's review queue for 72 hours auto-publish. Medical-claim and regulatory-cluster posts always require explicit Sandy approval before publishing.

**Why it matters:** Sandy is a solo operator; the content calendar cannot block on her inbox.

### 14. Voice calibration gate (Pattern P-014)

Before publishing story-led (template C) posts, we must collect 5+ samples of Sandy's real written communication (emails, Instagram DMs, product notes, text messages). Voice calibration must happen in one session before post #2 ships. Until then, story-led posts are parked.

**Why it matters:** Default story-led posts written without voice calibration will read as generic "brand voice" content, which is the #1 signal of AI-written copy.

### 15. GummyGurl overlap (Pattern P-013 adjacent)

Entourage must not publish in GummyGurl's lanes (CBD-first wellness, pet CBD, CBD skincare, "CBD vs THC" 101, generic hemp wellness, sleep-CBD, women-focused wellness). This is because GummyGurl shares the same parent company (Carolina Natural Solutions / Seamus McKeon) and two sister brands fighting for the same keywords would cannibalize each other. Until Sandy confirms GummyGurl's topic list, apply the off-limits list conservatively.

**Why it matters:** Competitor analysis agent flagged this as a real and ongoing risk.

### 16. P-013 cannibalization rule

One definitive post per head keyword. No two Entourage posts target the same primary keyword. Long-tail variants go to spoke posts, not to duplicate hub posts.

**Why it matters:** Zero-authority domains cannot rank two posts for the same keyword; Google picks one and suppresses the rest.

### 17. P-012 regulatory buffer

Any content tied to the November 12, 2026 federal hemp deadline must be live by July 12, 2026 at the latest. The 4-month buffer accounts for indexation and ranking lag on a zero-authority domain.

**Why it matters:** Missing this deadline means the regulatory cluster never ranks, and the brand loses the single biggest search-intent window in Year 1.

### 18. Email list is a secondary asset, not a moat (Pattern P-011)

Do not position email list size as the survival asset for the brand. Realistic blog-driven signup math (4-6% of organic traffic) does not support it. The primary moat is the dual-pillar positioning documented in rankable content.

**Why it matters:** GummyGurl's strategy broke on this exact point. Do not repeat it.

---

## Client Feedback Log

| Date | Post | Feedback | Action Taken |
|---|---|---|---|
| 2026-04-11 | (seed post drafted) | N/A -- not yet reviewed by Sandy | Awaiting voice corpus collection before review |
