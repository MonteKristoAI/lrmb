# New Client Onboarding

## Steps

1. Create `/Blog/clients/{kebab-name}/`
2. Create these 9 files (use templates below):
   - `CLIENT.md`
   - `STYLE.md`
   - `BRAND.md`
   - `FEEDBACK.md`
   - `CONTENT.md`
   - `SITEMAP.md` (empty table -- populate as posts are published)
   - `LINK-USAGE.md` (empty tracker -- auto-populated as posts are written)
   - `EXTERNAL-LINKS.md` (seed with Perplexity research for client's niche)
   - `IMAGE-LOG.md` (empty tracker -- auto-populated as images are selected)
3. Run: `/blog persona create {name}` -- configure from STYLE.md values
4. Add client to Active Clients table in CLAUDE.md Section 2
5. Set persona name in CLIENT.md

---

## File Templates

### CLIENT.md template

```markdown
# [Client Name] — Client Overview

## Who They Are
<!-- 2-4 sentences: what they do, business model, how long operating -->

## Niche
<!-- 1 line -->

## Target Audience
<!-- Specific: role, age range, pain points, discovery platform -->

## Primary Business Goal from Blog
<!-- Organic traffic / email list / course sales / brand authority -->

## Website
<!-- URL -->

## CMS Platform
<!-- WordPress / Ghost / Webflow / etc. -->

## Content Volume
<!-- Posts per month target -->

## Active Persona
<!-- Persona name to load via /blog persona use <name> -->
```

### STYLE.md template

```markdown
# [Client Name] — Tone & Style Guide

## Voice in One Line

## Tone Dimensions (NNGroup 4-Dimension Framework)
| Dimension | Score (0–1) | Notes |
|-----------|-------------|-------|
| Funny (0) → Serious (1) | 0.x | |
| Formal (0) → Casual (1) | 0.x | |
| Respectful (0) → Irreverent (1) | 0.x | |
| Enthusiastic (0) → Matter-of-fact (1) | 0.x | |

## Writing Rules
| Setting | Value |
|---------|-------|
| Vocabulary tier | Consumer / Professional / Technical |
| Target readability | Flesch Grade X–Y |
| Avg sentence length | ~XX words |
| Contractions | Yes / Sparingly / Never |
| Passive voice max | X% |
| Summary label | Key Takeaways / TL;DR / etc. |
| POV | Second person (you/your) |

## Do
## Don't
## Preferred Article Length
## Internal Linking Preference
```

### BRAND.md template

```markdown
# [Client Name] — Brand Guidelines

## Unique Angle / Positioning
## Core Topics (Always In Scope)
## Off-Limits Topics
## Competitor Blogs to NOT Mimic
## Preferred External Sources to Cite
## Affiliate / Product Mentions
## Legal / Compliance Notes
```

### FEEDBACK.md template

```markdown
# [Client Name] — Client Feedback Log

**Most recent entries at the top.**

---

## [YYYY-MM-DD] — [Context / source of feedback]
-
-

---
```

### CONTENT.md template

```markdown
# Content Calendar — [Client Name]

| # | Title | Primary Keyword | Secondary Keywords | Template | Status | Published Date | URL Slug | Notes |
|---|-------|----------------|--------------------|----------|--------|----------------|----------|-------|
| 1 | | | | how-to-guide | planned | — | /blog/ | — |
```

**Valid template names:**
`how-to-guide` · `listicle` · `comparison` · `case-study` · `pillar-page` · `product-review` · `thought-leadership` · `tutorial` · `faq-knowledge` · `data-research` · `roundup` · `news-analysis`

### SITEMAP.md template

```markdown
# [Client Name] — Site Map

**Authoritative source for all internal links.**
Every internal link in every post MUST come from this file.

---

## Non-Blog Pages

| Page | URL | Use when... |
|------|-----|-------------|
| Homepage | https://domain.com/ | — |

---

## Blog Posts

### Cluster: [Topic]

| Slug | Title | Primary Keyword |
|------|-------|----------------|
```

### LINK-USAGE.md template

```markdown
# [Client Name] - Internal Link Usage Tracker

## Purpose
Tracks which internal links each post uses. Prevents the same 3-5 links from appearing in every post.
The blog agent MUST consult this file before selecting internal links.
Prioritize links with the lowest usage count that are topically relevant.

## Usage Log

| Post Slug | Internal Links Used (slugs) | Date |
|-----------|---------------------------|------|

## Link Frequency (auto-updated after each post)

| Internal Link Slug | Times Used | Last Used In |
|-------------------|------------|--------------|

## Underused Links (priority for next posts)

All links from SITEMAP.md that have been used 0-1 times.
```

### EXTERNAL-LINKS.md template

```markdown
# [Client Name] - Verified External Link Database

## Purpose
Pre-verified authority links per topic. Blog agent MUST use links from this file first.
Only add new external links if verified via WebFetch during writing.

## Verification Rules
- Every URL in this file has been verified via WebFetch (HTTP 200)
- Last full verification: [date]
- Links older than 6 months should be re-verified before use

## Authority Sources by Topic

### [Topic Cluster 1]

| URL | Source Name | Type | Topics | Last Verified |
|-----|-----------|------|--------|---------------|

## Link Usage Tracking

| URL (short) | Times Used | Last Used In |
|------------|------------|--------------|
```

### IMAGE-LOG.md template

```markdown
# [Client Name] - Image Usage Log

## Purpose
Tracks all images used across blog posts. Agent MUST check this before selecting images.
Never reuse a Pexels/Unsplash/Pixabay image ID that already appears here.

## Used Images

| Image ID | Source | Post Slug | Position | Description | Date |
|----------|--------|-----------|----------|-------------|------|

## Banned Image IDs (already used - never select again)

(none yet)

## Search Query Diversification Rules

Never repeat the same Pexels/Unsplash search query across posts.

| Post Slug | Search Queries Used |
|-----------|-------------------|

## Subject Category Rotation

| Category | Last Used In | Count (last 6 posts) |
|----------|-------------|---------------------|
```
