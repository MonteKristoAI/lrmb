# Blog Agent — Architectural Decisions

Permanent record of significant editorial and technical decisions.
Append new entries at the top. Format: decision → why → revisit condition.

---

## D-010 | BreathMastery internal links: absolute URLs, no /blog/ prefix (2026-03-29)
**Decision:** Internal links in BreathMastery posts must use absolute URLs: `https://breathmastery.com/{slug}/`. Do NOT use `/blog/{slug}` relative paths.
**Why:** BreathMastery's URL structure has no `/blog/` directory. All posts live at root level (e.g., `breathmastery.com/the-essence-of-breathwork/`). CLAUDE.md Section 4 shows `/blog/{slug}` as the general format, but this does not apply to BreathMastery. All 4 published posts had broken `/blog/` links that were corrected in the 2026-03-29 audit session.
**Revisit:** If BreathMastery restructures to add a /blog/ subdirectory (check SITEMAP.md for evidence).

---

## D-009 | Session state in JSON not markdown (2026-03-29)
**Decision:** blog-progress.json and blog-tasks.json use JSON, not markdown tables.
**Why:** Claude naturally reformats markdown tables (adds rows, changes columns). JSON with an embedded IMMUTABILITY_RULE is structurally resistant to accidental corruption.
**Revisit:** Never — this is a structural constraint, not a preference.

---

## D-008 | Quality floor: never save below 85, target 90+ (standing)
**Decision:** Hard floor is 85/100. Target is 90+. Maximum 2 analyze runs per post (token efficiency).
**Why:** Below 85 signals structural issues (missing schema, thin content, no internal links) that won't resolve with minor edits — requires a full rewrite which is cheaper than iterating.
**Revisit:** If analyze scoring algorithm changes significantly.

---

## D-007 | Tables always include `<thead>` (standing)
**Decision:** Every HTML table must have `<thead>` markup, even simple ones.
**Why:** AI citation rate increases +47% when tables have proper semantic structure. Google AI Overviews preferentially cite structured data.
**Revisit:** Never — pure upside, no downside.

---

## D-006 | Author @type: Person, never Organization (standing)
**Decision:** JSON-LD schema author is always `"@type": "Person"` with full Person fields.
**Why:** Google's E-E-A-T evaluation requires a named human author with verifiable credentials. Organization authorship signals AI-generated or low-quality content.
**Revisit:** Never.

---

## D-005 | SITEMAP.md is the ONLY source of valid internal link slugs (standing)
**Decision:** Internal links can only use slugs that exist in SITEMAP.md. No guessing, no constructing from titles.
**Why:** Dan Brulé's team flagged broken internal links in early posts. The `/product-category/training-programs/` URL is a 404. Strict SITEMAP enforcement prevents this class of error entirely.
**Revisit:** Never — zero-tolerance rule.

---

## D-004 | SVG charts: WPBakery Raw HTML (BreathMastery) vs Gutenberg Custom HTML (REIG) (standing)
**Decision:** SVG chart paste target differs by client.
**Why:** BreathMastery uses WPBakery page builder; REIG Solar uses Gutenberg. Pasting SVG into wrong block type breaks rendering.
**Revisit:** If either client migrates page builders.

---

## D-003 | No `<article>` or `<section>` tags in WordPress HTML output (standing)
**Decision:** Use `<div class="...">` instead of semantic sectioning elements in WordPress post body.
**Why:** WordPress wraps post content in its own `<article>` already. Nesting `<article>` inside `<article>` is invalid HTML and causes layout issues with some themes.
**Revisit:** If clients switch to headless WordPress or custom themes that handle this differently.

---

## D-002 | SEO plugin: AIOSEO (BreathMastery) vs Yoast (REIG Solar) (standing)
**Decision:** STEP 1 SEO fields use AIOSEO format for BreathMastery, Yoast format for REIG Solar.
**Why:** Each client's WordPress install uses a different SEO plugin. Field names and character limits differ slightly between the two.
**Revisit:** If either client changes SEO plugin.

---

## D-001 | WordPress 5-block output format for all posts (standing)
**Decision:** Every post is structured as 5 numbered STEP blocks: SEO fields, sidebar fields, OG/social fields, JSON-LD schema, HTML body.
**Why:** Separates concerns cleanly — SEO plugin paste, sidebar paste, and code editor paste are distinct operations in WordPress. Prevents copy-paste errors.
**Revisit:** If a non-WordPress client is onboarded — use their platform's equivalent structure.
