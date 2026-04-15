---
type: feedback
client: AiiACo
date: 2026-04-11
tags: [aiiaco, feedback, editorial-rules]
---

# AiiACo Blog Feedback Log + Standing Rules

## Standing editorial rules (always active)

These are derived from the MonteKristo vault, Round 3 Nemr conversation log, and existing content-quality rules. Every rule applies to every post.

### Brand and compliance

1. **Zero em/en dashes.** Use hyphens, commas, parentheses, or rewrite. Absolute. Verified on every file before commit via `python3 -c "import sys,pathlib; [print(p, p.read_text().count(chr(0x2014)), p.read_text().count(chr(0x2013))) for p in pathlib.Path('posts').glob('*.html')]"`.
2. **Brand spelling: AiiACo** (capital C). Never AiiAco (lowercase c), Aiiaco, AIIACO, AI&Co. Per Nemr's Manus HEAD commit `7668adf`. Voice agent is AiA, company is AiiACo.
3. **Never "AI infrastructure" as positioning.** Abandoned in Round 2. Replaced with "AI revenue systems" and "AI integration layer".
4. **Founding year: 2025** everywhere (matches Wikidata Q138638897).
5. **Integrator framing**: AiiACo sits on top of existing CRMs. Never positions as a replacement platform.

### Voice and content

6. **Nemr's first-person voice required** in at least 2 passages per post. "I have watched..." "When I integrate..." "In practice, the operators who..."
7. **Zero banned AI-tell words** from `STYLE.md` banned list. Run a mental scan before commit.
8. **Zero opening clichés**: no "In today's fast-paced world", "In the ever-evolving landscape", "As AI transforms", etc.
9. **Specific tools, not generic references.** Say "Follow Up Boss" not "your CRM". Say "Encompass by ICE Mortgage" not "loan origination system".
10. **Every statistic has a source and year.** If a number is uncited, it cannot ship.

### Structural

11. **Direct Answer block required.** 40-80 words, first element after H1, wrapped in `<div class="direct-answer">`. Extracted to AI Overview citation.
12. **FAQ section required.** 5+ H3/P pairs inside `<section class="faq-section">`. Each Q/A should stand alone as a Perplexity-citable answer.
13. **At least one internal link to an aiiaco.com service page.** Absolute URL (`https://aiiaco.com/ai-revenue-engine`), never relative.
14. **Author byline** links to `#nemr-hallak` Person schema on main site.
15. **Template rotation** obeyed (never 3 consecutive same T-type).

### E-E-A-T

16. **At least 3 named entities from the 30-entity graph** per post (see `research/geo-readiness.md`).
17. **Compliance layer cited** in any post that touches regulation (FHA, TRID, QM, EU AI Act, NIST AI RMF, ISO 42001).
18. **Transparent pricing** in any post mentioning engagement mechanics. Publish dollar ranges and week counts.
19. **Counter-examples published** alongside successes (where the pattern breaks).

### Workflow

20. **Solo reviewer (Milan)** - no Nemr approval bottleneck. Auto-publish once content-quality-gate passes.
21. **No outbound to Nemr without Milan's explicit approval** (hard rule from vault).
22. **Weekly citation check** (Fridays) on top 10 priority posts. Log in `SITEMAP.md`.
23. **Monthly KPI report** sent to Milan on the 1st.

### Infrastructure

24. **Never touch** `build.js`, `templates/*.html`, `css/blog.css`, `posts/*.html` that are already shipped, or `aiiaco/` main repo. New post sources only.
25. **Always run `PING=false node build.js`** before deploy to avoid accidentally pinging search engines during dev iterations.

---

## Feedback log (append-only)

Format:
```
## YYYY-MM-DD | {Source} | {Rule or change}
**Context:** [What happened]
**Action:** [What we changed]
**Rule added to:** [STYLE.md / BRAND.md / FEEDBACK.md / etc.]
```

---

## 2026-04-11 | Onboarding | Initial rule set

**Context**: Blog onboarding session. Milan requested ultra-deep keyword research + content strategy + editorial calendar. Research via DataForSEO API (credentials provided after initial plan-mode agent-leak failure).

**Action**: Full onboarding pipeline run. 24 posts in queue across 3 phases. 100-keyword database built via DataForSEO Labs + SERP spot-checks. Strategy published. 7 blog system files generated.

**Rules added**:
- All 25 standing rules above, derived from Round 3 conversation log + vault context
- Solo-reviewer auto-publish (P-015 variant) - Milan is the sole reviewer
- Template rotation check on every Phase boundary
- Priority citation tracking on 10 posts weekly

**Rule changes from PATTERNS.md**:
- P-003 (Tier A only in Phase 1): applied, 8 Phase 1 posts all Tier A
- P-005 (template variation): applied, 4-type rotation enforced
- P-006 (national keywords): applied, zero city modifiers
- P-010 (revenue tier per post): applied, tier column in CONTENT.md
- P-013 (one post per head keyword): applied, variants merged
- P-014 (voice from real speech): partial - using Round 3 conversation log + manifesto as calibration source. Real voice corpus call with Nemr pending.
- P-017 (absolute URLs to main site): applied, already in Round 5 templates
