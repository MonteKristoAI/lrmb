# Blog Post Audit & Fix Protocol

**Use this prompt to audit and fix existing blog posts to MonteKristo AI production standards.**

One post per session. When a session finishes, immediately start the next post in a new session. Do not stop until all posts in the queue are done.

---

## How to Run

Paste this to Claude Code:

```
/blog rewrite [path-to-html-file]
```

If the blog skill does not cover all checks below, run them manually after the rewrite completes. The skill handles content quality, SEO, and scoring. The checks below cover structural and technical issues the skill may miss.

---

## Pre-Audit: Load Context

Before touching the post, load these files for the client:

1. `Blog/clients/{client}/SITEMAP.md` : valid internal link slugs + correct URL format
2. `Blog/clients/{client}/LINK-USAGE.md` : which internal links are overused/underused
3. `Blog/clients/{client}/EXTERNAL-LINKS.md` : verified external authority sources
4. `Blog/clients/{client}/IMAGE-LOG.md` : previously used image IDs (banned list)
5. `Blog/clients/{client}/LINKING-GRAPH.md` : hub-spoke link assignments (if exists)

---

## The Audit Checklist (Run Every Check, Fix Every Failure)

### 1. ZERO EM DASHES

```
grep -o '—' "{file}" | wc -l
```

**Target: 0.** Not 8. Not 5. Zero.

Replace every em dash with:
- Comma (parenthetical clauses)
- Colon (explanatory clauses)
- Period (start a new sentence)
- Parentheses (inline definitions)

Never use a hyphen as a substitute for an em dash either. Rewrite the sentence if no punctuation works naturally.

---

### 2. DOMAIN AND CANONICAL URLs

```
grep 'Canonical\|"url":\|"@id":\|"item":' "{file}" | grep -v 'category'
```

Verify:
- Domain uses `www.` prefix if the live site redirects to www (e.g., `www.reig-us.com` not `reig-us.com`)
- Canonical URL matches the actual live URL format
- Schema `url`, `@id`, and breadcrumb `item` fields all match the canonical
- No `/blog/` prefix in post URLs if WordPress serves posts at root level (check SITEMAP.md header for the client's URL format)

---

### 3. INTERNAL LINK FORMAT

```
grep -c 'href="/blog/' "{file}"
```

**Target: 0** (unless this client genuinely uses `/blog/` prefix, per SITEMAP.md)

Then verify:
- Every internal link has a trailing slash: `href="/slug/"` not `href="/slug"`
- Every internal link slug exists in SITEMAP.md (grep the slug against SITEMAP.md)
- No links to planned/draft posts (only published posts in SITEMAP.md)
- No same-batch linking (posts written in the same session cannot link to each other)

```
grep -oE 'href="/([a-z][a-z0-9-]+)/"' "{file}" | sed 's|href="/||;s|/"||' | while read slug; do
  grep -q "$slug" "Blog/clients/{client}/SITEMAP.md" || echo "NOT IN SITEMAP: $slug"
done
```

---

### 4. INTERNAL LINK DIVERSITY

Check LINK-USAGE.md:
- Are we using links that have been used 3+ times already? Swap for underused alternatives.
- Does this post share more than 2 links with the previous post? Diversify.
- Are "never used" links from LINK-USAGE.md being prioritized when topically relevant?

After fixing, update LINK-USAGE.md with this post's final link selections.

---

### 5. EXTERNAL LINKS: VERIFICATION

Every external link must be verified. Not just "does the server respond 200" but "does the page contain the content we're citing?"

```
grep -o 'href="https://[^"]*"' "{file}" | grep -v 'reig-us.com\|breathmastery.com\|{client-domain}'
```

For each external link:
1. Fetch with WebFetch
2. Confirm the page exists AND contains relevant content (not a homepage redirect, not a removed article, not a different standard than cited)
3. If broken/wrong: find a replacement from EXTERNAL-LINKS.md or via Perplexity research, verify the replacement, then swap

**Common failure patterns:**
- 404 pages (article removed)
- Redirect to homepage (article restructured)
- Wrong IEC/IEEE standard number (webstore page exists but covers a different standard)
- Paywalled with no abstract visible
- Domain changed (org rebranded)

After fixing, update EXTERNAL-LINKS.md with any new verified sources.

---

### 6. EXTERNAL LINK COUNT

| Post type | Minimum external links (excluding client domain) |
|-----------|--------------------------------------------------|
| How-to guide | 5 |
| Pillar page | 8 |
| Comparison | 5 |
| Data/research | 8 |

If below minimum, add authority links from EXTERNAL-LINKS.md or research new ones. Prioritize:
1. Government (.gov), academic (.edu), peer-reviewed (pubmed, doi.org)
2. Industry standards bodies (IEEE, IEC, NERC, ISO, ANSI)
3. Manufacturer documentation (Moxa, Fluke, Vaisala, etc.)
4. Industry publications (PV Magazine, Solar Power World, etc.)

---

### 7. IMAGE DEDUPLICATION

```
grep -o 'src="[^"]*"' "{file}" | grep -v svg | sort -u
```

For each image:
1. Extract the Pexels/Unsplash ID
2. Check IMAGE-LOG.md banned list: is this ID already used in another post?
3. If duplicate: replace with a unique image from a different Pexels/Unsplash search
4. Check subject category rotation in IMAGE-LOG.md: avoid overused visual categories

Cross-post verification (run across ALL client posts):
```
grep -roh 'pexels-photo-[0-9]*' "Blog/clients/{client}/posts/"*.html | sort | uniq -c | sort -rn
```

Any image appearing in 2+ posts must be replaced in all but one.

After fixing, update IMAGE-LOG.md with new image IDs, search queries, and category rotation.

---

### 8. HTML WRAPPER

```
grep '<div class="post-body">\|<article>' "{file}"
```

Must be `<article>`, not `<div class="post-body">`. Fix both opening and closing tags.

---

### 9. SVG ACCESSIBILITY

Every `<svg>` tag must have:
- `role="img"`
- `aria-label="descriptive text"`
- A `<title>` element inside
- A `<desc>` element inside
- `viewBox` attribute
- No em dashes in SVG text elements

```
grep '<svg' "{file}" | grep -v 'role="img"'
```

If any SVG is missing these, add them.

---

### 10. ANTI-AI CONTENT AUDIT

**Source of truth:** `~/Documents/MonteKristo Vault/skills/content-quality.md`

**Banned word scan:**
```
grep -i 'delve\|tapestry\|nuanced\|realm\|landscape\|multifaceted\|pivotal\|utilize\|facilitate\|elucidate\|robust\|seamless\|cutting-edge\|transformative\|innovative\|dynamic\|agile\|game-changer\|revolutionize\|crucial\|moreover\|furthermore\|in conclusion\|it.s worth noting\|it.s important to note\|dive deep\|incredibly\|extremely\|absolutely\|truly\|significantly\|groundbreaking\|revolutionary\|leverage\|streamline\|empower\|harness\|unpack\|unravel' "{file}"
```

**Target: 0 matches.** Replace every hit with a simpler, more specific word.

**Structural checks:**
- No 3+ consecutive paragraphs starting the same way
- No symmetrical 3-item lists in every section (vary to 2, 4, 5, 7)
- No two consecutive paragraphs within 15% of each other's word count
- No "In today's..." / "Let's dive..." / "It's not just X, it's Y" patterns
- At least 3 domain-expertise claims per post (specifics only an expert would know)
- Burstiness: mix 1-sentence and 4-sentence paragraphs
- At least 1 opinion/stance that some readers might disagree with

**Copula audit:** Replace "serves as", "boasts", "features", "represents" with "is" or "has" where simpler.

**Participle audit:** Flag sentences with 2+ present participle clauses. Rewrite.

---

### 11. READABILITY

| Check | Target |
|-------|--------|
| Flesch Reading Ease | >= 60 |
| Transition word coverage | 30-50% of sentences |
| Consecutive same-word openers | Max 2 in a row |
| Words between subheadings | Max 300 |
| Sentence length variation | CoV > 0.5 |

---

### 12. SCHEMA VALIDATION

- Author is `@type: "Person"` (never "Organization")
- BlogPosting, FAQPage (if 3+ FAQ), BreadcrumbList all present
- BreadcrumbList position 3+ items do not use wrong URL format
- Schema `image` matches Featured Image in SEO meta comment

---

## Post-Audit: Update Tracking Files

After every post is fixed:

1. **LINK-USAGE.md** : add row with this post's internal link slugs
2. **IMAGE-LOG.md** : add rows for all images, update banned list and category rotation
3. **EXTERNAL-LINKS.md** : add any new verified sources, update usage counts

---

## Session Protocol

**One post per session.** Here is why: each post requires full context (SITEMAP, LINK-USAGE, IMAGE-LOG, EXTERNAL-LINKS, persona, STYLE, BRAND) plus the post itself plus WebFetch verification of external links. Cramming multiple posts into one session degrades verification quality.

**Session flow:**

1. Load client context files
2. Read the post file completely
3. Run all 12 audit checks above
4. Apply all fixes
5. Run verification scan (confirm 0 em dashes, 0 banned words, 0 broken links, 0 duplicate images, 0 wrong URL formats)
6. Update tracking files
7. State: "Post {slug} audit complete. Starting next post."
8. **Immediately begin the next post.** Do not wait for user input.

**Queue for REIG Solar (remaining):**
All 9 posts (blog17-blog25) were fixed for links, images, domains, and em dashes in the April 15 2026 session. Future audits should focus on anti-AI content quality, readability, and expertise injection.

**Queue format for new audit runs:**
```
Audit and fix these posts in order, one per session, no stopping between sessions:
1. Blog/clients/{client}/posts/{file1}.html
2. Blog/clients/{client}/posts/{file2}.html
3. ...
```
