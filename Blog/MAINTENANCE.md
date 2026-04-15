# Blog Maintenance — Monthly Tasks

Run these on the 1st of each month (batch operations — not per post):

| Task | Tool / Method | Cadence |
|------|---------------|---------|
| Full site health scan | `/blog audit` | Monthly |
| Keyword cannibalization check | `/blog cannibalization` | Monthly |
| Stale content detection | `/blog calendar` | Monthly |
| Strategic cluster review | `/blog strategy` | Quarterly |
| CMS taxonomy sync | `/blog taxonomy sync` | After each batch of 5+ posts |
| Content freshness scan | See Step M.1 below | Monthly |
| Pillar page auto-detection | See Step M.2 below | Monthly |
| Link gap report | See Step M.3 below | Monthly |
| Image alt text audit | See Step M.4 below | Monthly |
| Broken link monitor | See Step M.5 below | Monthly |

---

### STEP M.1 — Content Freshness Scanner

```
For each client:
1. Read CONTENT.md — find all posts with Published Date older than 180 days
2. For each post, call: mcp__perplexity__perplexity_ask
   Query: "Have there been significant new studies or statistics on [topic] since [published date]?"
3. Flag posts where the answer reveals new data, changed recommendations, or outdated statistics
4. Output: "Refresh candidates" list with specific outdated claims to update
5. Add flagged posts to CONTENT.md with a note: "refresh needed — [reason]"
```

### STEP M.2 — Pillar Page Auto-Detector

```
For each cluster in SITEMAP.md:
1. Count the number of posts in that cluster
2. If count >= 4 AND no post in the cluster has template = "pillar-page" in CONTENT.md:
   → Flag: "Cluster '{name}' has {N} supporting posts but no pillar page"
   → Add a planned pillar page entry to CONTENT.md
3. Output a summary: which clusters are complete (pillar + 4+ supporting) vs. still building

BreathMastery clusters to check first:
  Anxiety & Stress Relief (4 posts) — needs pillar?
  Techniques Library (7 posts) — needs pillar?
  Benefits & Power of Breath (4 posts) — needs pillar?
```

### STEP M.3 — Link Gap Report

```
For each client, scan SITEMAP.md:
1. For each slug, grep all /posts/*.html files for that slug being linked
2. Count: how many other posts link TO this post (inbound internal links)?
3. Flag any post with < 2 inbound internal links as "orphan risk"
4. Output: sorted list from least-linked to most-linked
5. For bottom 5 posts: suggest which existing posts should add a link and in which section

This report takes priority during the next post-writing session —
  add missing links to existing posts before writing new content.
```

### STEP M.4 — Image Alt Text Auditor

```
For each HTML file in /posts/:
1. Find all <img> tags
2. Check alt attribute:
   → Empty alt="" → FAIL (descriptive alt required unless decorative)
   → Generic alt: "image", "photo", "picture", "screenshot", "diagram" → FAIL
   → Alt longer than 125 chars → WARN (too long for screen readers)
   → Alt contains the filename → FAIL
3. Output: list of images needing new alt text with suggested descriptions
4. Apply fixes directly to HTML files
```

### STEP M.5 — Broken Link Monitor

```
For each HTML file in /posts/:
1. Extract all external links (href starting with http)
2. For each URL, call WebFetch to verify it responds
3. Flag:
   → HTTP 404 → BROKEN — replace immediately
   → HTTP 301/302 → REDIRECT — update to final destination URL
   → Timeout → UNREACHABLE — verify manually
4. For internal links (/blog/slug): verify slug exists in SITEMAP.md
   → If not in SITEMAP.md → flag as potentially broken
5. Output: broken/redirect list with replacement suggestions
6. Apply confirmed fixes directly to HTML files
```
