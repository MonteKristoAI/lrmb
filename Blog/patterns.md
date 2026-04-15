# Blog Agent — Reusable Patterns

Proven solutions discovered during production. Append new entries at the top.
Format: problem → solution → evidence → conditions for use.

---

## P-013 | SVG overflow fix: audit ALL SVGs, not just SVG1 (2026-04-01)
**Problem:** When a post has multiple SVG charts and SVG1's source text was fixed in a previous session, SVG2's source text was left untouched — still overflowing (98-char label in a 560px viewBox).
**Solution:** After fixing SVG overflow in any chart, grep the full post for all `<text` elements and verify EVERY source label is ≤45 chars (safe for centered x=280 position). Fix all in the same pass.
**Evidence:** blog24 session — SVG2 "Source: REIG Solar commissioning project data, average days added to COD schedule per failure type" was missed until re-read. Required an extra edit pass.
**Conditions:** Every post with 2+ SVG charts. Run SVG audit on all charts simultaneously.

---

## P-012 | Em dashes in SVG HTML comments count toward body limit (2026-04-01)
**Problem:** SVG chart HTML comments like `<!-- Bars — left label area: 0–180 -->` contain em dashes. The reviewer's em dash counter scans the full HTML body including comments, pushing the count over the ≤8 limit even when prose em dashes are correctly controlled.
**Solution:** When writing SVG chart comments, use colons or plain hyphens instead of em dashes. Replace `—` with `:` or `-` in all HTML comments. Run a final grep for `—` on the full post body before saving.
**Evidence:** blog24 session — one SVG comment em dash pushed count to 7, but combined with prose em dashes nearly hit the ceiling. Fixed by replacing with colon.
**Conditions:** All posts with SVG charts. Check HTML comments as part of the em dash pre-check.

---

## P-011 | Ralph Wiggum phase 3: transition words + image count + FAQ length (2026-03-30)
**Problem:** Ralph Wiggum pre-check caught SEO issues but missed readability/structural issues
that kept triggering extra reviewer passes. blog12: 5 reviewer passes, ~325K tokens.
**Solution:** Add (e) transition word coverage ≥30%, (f) in-body image count ≥2,
(g) FAQ answer length ≥80w to STEP 3.1 PRE-CHECK. Fix before first reviewer run.
**Evidence:** blog12 session — all 3 were flagged as High/Critical by reviewer on passes 3-5.
Catching them pre-run would have saved 3 passes × ~65K = ~195K tokens.
**Conditions:** All posts. Run before /blog analyze on both new and blocked posts.

---

## P-010 | Airtable sync failure recovery (2026-03-29)
**Problem:** mcp__airtable__update_records sometimes fails silently or with timeout.
**Solution:** Complete all local saves first (HTML, CONTENT.md, SITEMAP.md, Google Doc). Log failure to error_log in blog-progress.json. Retry at the START of the next session before picking new work.
**Evidence:** Architectural — local files are the source of truth; Airtable is a sync target.
**Conditions:** Any time an Airtable call fails during Phase 5.

---

## P-009 | Session WIP recovery — jump directly to interrupted phase (2026-03-29)
**Problem:** Session ends mid-post (e.g., after outline but before writing). Next session wastes context re-doing Phase 0 research.
**Solution:** blog-progress.json wip field stores `{slug, phase}`. Next session reads it at STARTUP-B and jumps directly to the interrupted phase. All prior phases are skipped.
**Evidence:** Architectural — research data is already embedded in the outline or draft.
**Conditions:** Any time wip is not null at session startup.

---

## P-008 | geo score <80: answer-first paragraph fix (standing)
**Problem:** /blog geo returns score below 80.
**Solution:** Identify the 2 lowest-scoring H2 sections. Rewrite their opening paragraphs to answer-first format: stat-rich sentence (40-60 words) that completely answers the H2 question without requiring further reading. Also improve FAQ answers to be fully self-contained (40-60 words each).
**Evidence:** Consistently adds 8-12 points to geo score. Tested on breathwork certification and science of breathing posts.
**Conditions:** geo score <80 after first run. Apply before re-running — do not run geo twice without making changes.

---

## P-007 | E-E-A-T score low: named institutions fix (standing)
**Problem:** /blog analyze E-E-A-T subcategory below 12/15.
**Solution:** Replace generic citations "(Chen et al., 2023)" with institution-named citations: "Stanford researchers found..." / "A 2024 study from the NIH confirmed..." / "NREL data shows...". Add at least 8 Tier 1 sources (PubMed, .gov, .edu, major journals). Reference Dan's credentials (50+ years, 73 countries, 300,000+ people) at least once.
**Evidence:** E-E-A-T is the #1 driver of score variance across posts. Named institutions signal human expertise.
**Conditions:** E-E-A-T subcategory <12/15 in analyze output.

---

## P-006 | Key Takeaways box: 2+ stats minimum for AI citation (standing)
**Problem:** AI citation score (analyze subcategory) underperforms even when FAQ is strong.
**Solution:** Key Takeaways box must contain at least 2 bullets with specific statistics and inline source references. Format: "X% of [group] experience [outcome], according to [Institution]."
**Evidence:** AI citation scoring rewards passage-level citability. Key Takeaways is the highest-visibility passage — it appears first and is frequently extracted by AI overviews.
**Conditions:** Apply on every post during initial write (not a fix — a default requirement).

---

## P-005 | Safety note: one consolidated block, never scattered (BreathMastery) (standing)
**Problem:** Multiple small safety disclaimers scattered through a breathing technique post create a fragmented reading experience and look unpolished.
**Solution:** One consolidated safety note as a styled `<div>` block, positioned after the first practice section. Use consistent styling: `border-left: 3px solid #f97316; padding: 1rem; margin: 1.5rem 0;`.
**Evidence:** Dan Brulé's FEEDBACK.md — client preference for clean, non-alarmist safety communication.
**Conditions:** Any BreathMastery post that teaches a technique. One block, one location, every time.

---

## P-004 | Internal links: SITEMAP search before writing each H2 (standing)
**Problem:** Writing internal links from memory produces broken URLs (e.g., `/product-category/training-programs/` is a 404).
**Solution:** Before writing each H2 section, search SITEMAP.md for topic-related keywords. Copy exact slugs. Never construct URLs from post titles.
**Evidence:** D-005 decision — logged after Dan's team flagged broken links in early posts.
**Conditions:** Every internal link in every post. Zero exceptions.

---

## P-003 | SVG charts: 3 different types, never repeat (standing)
**Problem:** Using the same chart type (e.g., 3 bar charts) in one post gets flagged as a structural AI tell.
**Solution:** Pick 3 different chart types from: Horizontal bar, Grouped bar, Donut, Line, Lollipop, Area, Radar. Assign chart type to data type: comparisons → bar/grouped, proportions → donut, trends over time → line/area, rankings → lollipop.
**Evidence:** Section 7 anti-AI detection — symmetrical structure across sections is a detectable pattern.
**Conditions:** All posts requiring 2-3 SVG charts (which is all posts).

---

## P-002 | analyze: batch all fixes before second run (standing)
**Problem:** Running /blog analyze after every individual fix wastes tokens and context.
**Solution:** Run analyze once → collect all issues → apply ALL fixes in a single pass using OpenAI for prose rewrites → run analyze once more to verify. Maximum 2 runs total.
**Evidence:** Token efficiency — each analyze run costs significant context. Batching reduces total cost by ~50% vs issue-by-issue fixing.
**Conditions:** Every post. Hard limit: 2 analyze runs per post.

---

## P-001 | FAQ sourcing: People Also Ask first, then long-tail questions (standing)
**Problem:** FAQ sections with generic questions ("What is breathwork?") score lower on geo and don't capture search intent.
**Solution:** Mine "People Also Ask" box from Perplexity (Step 0.5) first. Use the exact question phrasing Google shows — these are already validated search queries. Fill remaining FAQ slots with long-tail variations.
**Evidence:** PAA questions have confirmed search volume and match real user intent. FAQs sourced this way consistently score higher on geo citability.
**Conditions:** All posts. Run Step 0.5 before outlining — FAQ structure shapes the H2 hierarchy.
