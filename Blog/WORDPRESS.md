# WordPress Publishing Guide

**Read this file whenever CLIENT.md shows `CMS Platform: WordPress`.**
This file defines the exact output format and all publishing steps.

---

## Client Setup

| Client | Editor | SEO Plugin | SVG Charts |
|--------|--------|-----------|-----------|
| BreathMastery | Classic Editor + WPBakery | All in One SEO (AIOSEO) | WPBakery "Raw HTML" element |
| REIG Solar | Gutenberg (Block Editor) | Yoast SEO | Gutenberg "Custom HTML" block |

---

## WordPress Content Filter — What Gets Stripped

WordPress runs all post body content through `wp_kses_post()`.
**Do NOT include these tags in the post body (Step 5):**

| Tag | Status | Use instead |
|-----|--------|-------------|
| `<svg>` | STRIPPED | Separate Raw HTML / Custom HTML element (see SVG section) |
| `<article>` | STRIPPED | `<div class="post-body">` or omit |
| `<section>` | STRIPPED | `<div class="section-[name]">` |
| `<script>` | STRIPPED | Step 4 only — never in post body |
| `<style>` | STRIPPED | Inline `style=""` on individual elements |
| `<header>` | STRIPPED | `<div class="post-header">` |
| `<footer>` | STRIPPED | `<div class="post-footer">` |

**These tags ARE safe in post body:**
`<p>` `<h2>`–`<h6>` `<ul>` `<ol>` `<li>` `<table>` `<thead>` `<tbody>` `<tr>` `<th>` `<td>`
`<figure>` `<figcaption>` `<img>` `<a>` `<strong>` `<em>` `<blockquote>` `<code>` `<pre>`
`<div>` `<span>` (both support inline `style=""`) `<br>` `<hr>`

---

## SVG Charts — How to Paste

Each SVG requires its own Raw HTML (WPBakery) or Custom HTML (Gutenberg) element. Include as many SVGs as the content requires — prioritize quality and data visualization depth.

WordPress strips `<svg>` tags from regular post content. Every SVG chart needs its own container.

### BreathMastery (Classic Editor + WPBakery)
1. In WPBakery, add a **"Raw HTML"** element at the chart's position
2. Paste the entire `<figure>...<svg>...</svg>...</figure>` block into it
3. Save — the SVG renders correctly on the front end

### REIG Solar (Gutenberg)
1. In the block editor, click **+** → search "Custom HTML"
2. Add a **Custom HTML** block at the chart's position
3. Paste the entire `<figure>...<svg>...</svg>...</figure>` block into it
4. Preview — chart renders in the block preview

### Chart markup (always use this wrapper):
```html
<!-- ★ SVG CHART — paste into Raw HTML (WPBakery) or Custom HTML block (Gutenberg) -->
<figure style="margin: 2rem 0; text-align: center;">
  <svg viewBox="0 0 560 380"
       style="max-width: 100%; height: auto; font-family: 'Inter', system-ui, sans-serif;"
       role="img"
       aria-label="[chart description]">
    <title>[Chart Title]</title>
    <desc>[Full description with data points]</desc>
    <!-- chart content -->
  </svg>
  <figcaption style="font-size: 0.85rem; text-align: center; margin-top: 0.5rem; opacity: 0.6;">
    [Caption. Source: Name (Year).]
  </figcaption>
</figure>
```

---

## AIOSEO Compliance Rules

AIOSEO does strict exact-match checking. Every post must satisfy all 7 checks before publishing.

| AIOSEO Check | Requirement | Common failure |
|---|---|---|
| Focus keyword in SEO title | Exact phrase in title tag | ✅ Usually passes |
| Focus keyword in meta description | Exact phrase (not paraphrase); 150-160 chars REQUIRED; statistic recommended, not required | ❌ Paraphrasing fails; ❌ Under 150 or over 160 chars |
| Focus keyword length | Max 3 words recommended | ❌ 4-6 word phrases flagged as "too long" (warning only — acceptable) |
| Focus keyword in URL | Keyword words in slug (stop words OK to omit) | ❌ Missing "for/the/at" |
| Focus keyword in introduction | Exact phrase in the FIRST PARAGRAPH (not just anywhere in first 100 words) | ❌ Keyword after the opening paragraph fails |
| Focus keyword in subheadings | Exact phrase in 30–40% of all H2/H3 headings | ❌ Variations don't count; ❌ fewer than 30% fails |
| Focus keyword in image alt | Exact phrase in ≥1 alt attribute | ❌ Descriptive alts without keyword fail |
| Keyword density | 0.65%–0.9% — hard range; below 0.65% = add more; above 0.9% = thin out | ❌ Below 0.65% fails; ❌ above 0.9% = keyword stuffing |

**One keyword rule:** One focus keyword per post — the exact `focus_keyphrase:` value from the brief .md file. It is used in AIOSEO as-is. It is never replaced with a shorter variant. AIOSEO's "keyword too long" warning is acceptable; all 6 placement checks must pass.

**Iteration rule:** Every AIOSEO/Yoast check is mandatory. If any check fails after writing, fix the post and re-verify. Repeat until all checks are green. No exceptions. Keyword density MUST be in the 0.65%–0.9% range — both under-use and over-use require correction.

**Density target by post length (0.65%–0.9% hard range):**
- 1,600-word post → 10–14 exact phrase occurrences
- 2,000-word post → 13–18 exact phrase occurrences
- 2,500-word post → 16–22 exact phrase occurrences

---

## Hero Image Rule

**The hero image must NOT appear in the post body.**

- Set it via the **Featured Image** panel in the WordPress sidebar
- It controls the OG image, blog listing thumbnail, and header automatically
- If you also put it in the post body → it renders twice on the page

---

## Paste-Ready Output Format

Every post file must contain these 5 sections in order, clearly separated.
The person publishing copies each section into the correct WordPress field.

---

### BreathMastery (Classic Editor + WPBakery + AIOSEO)

```
╔══════════════════════════════════════════════════════════════════╗
║  STEP 1 — AIOSEO FIELDS                                         ║
║  (AIOSEO panel below editor — fill in each field)               ║
╚══════════════════════════════════════════════════════════════════╝

Post Title (H1 — also the WordPress post title field):
  [Post title]

SEO Title (title tag, 50–60 chars):
  [SEO title]

Meta Description (150–160 chars):
  [Meta description]

Focus Keyword:
  [primary keyword]

Canonical URL:
  https://breathmastery.com/[slug]/

╔══════════════════════════════════════════════════════════════════╗
║  STEP 2 — POST SIDEBAR                                          ║
║  (Right-hand sidebar in WordPress editor)                       ║
╚══════════════════════════════════════════════════════════════════╝

FEATURED IMAGE — set via "Featured Image" box in sidebar:
  Image URL:  [Unsplash/Pixabay URL — 1200×630 minimum, WebP preferred]
  Alt text:   [Descriptive sentence with primary keyword]
  Note: Use "Import External Images" plugin to save to Media Library,
        or manually download and upload.

TAGS — add in sidebar (6–10 tags, comma-separated):
  [tag1], [tag2], [tag3], [tag4], [tag5], [tag6]

╔══════════════════════════════════════════════════════════════════╗
║  STEP 3 — SOCIAL / OG                                           ║
║  (AIOSEO → Social tab)                                          ║
╚══════════════════════════════════════════════════════════════════╝

OG Title:        [Can match SEO title or slightly longer]
OG Description:  [Same as meta description]
OG Image URL:    [Same URL as Featured Image above]
Twitter Card:    summary_large_image

╔══════════════════════════════════════════════════════════════════╗
║  STEP 4 — SCHEMA                                                ║
║  Do NOT paste into the post body.                               ║
║  AIOSEO → Schema tab → Add Schema → Custom Schema               ║
║  Paste the JSON-LD block (without the <script> tags) into       ║
║  the custom schema field. AIOSEO wraps it automatically.        ║
╚══════════════════════════════════════════════════════════════════╝

[JSON-LD array — BlogPosting + Person + BreadcrumbList + FAQPage]

╔══════════════════════════════════════════════════════════════════╗
║  STEP 5 — POST BODY                                             ║
║  Classic Editor: click "Text" tab, paste the full HTML below.   ║
║  SVG charts: use a WPBakery "Raw HTML" element at each          ║
║  chart's position (marked with ★ below).                        ║
╚══════════════════════════════════════════════════════════════════╝

[clean HTML body — no <script>, no <article>, no <section>, no hero <figure>]
```

---

### REIG Solar (Gutenberg + Yoast)

```
╔══════════════════════════════════════════════════════════════════╗
║  STEP 1 — YOAST FIELDS                                          ║
║  (Yoast SEO panel below the Gutenberg editor)                   ║
╚══════════════════════════════════════════════════════════════════╝

Post Title (H1 — also the WordPress post title field):
  [Post title]

SEO Title (title tag, 50–60 chars):
  [SEO title]

Meta Description (150–160 chars):
  [Meta description]

Focus Keyphrase:
  [primary keyword]

Canonical URL:
  https://reig-us.com/[slug]/

╔══════════════════════════════════════════════════════════════════╗
║  STEP 2 — POST SIDEBAR                                          ║
╚══════════════════════════════════════════════════════════════════╝

FEATURED IMAGE:
  Image URL:  [1200×630, WebP preferred]
  Alt text:   [Descriptive sentence with keyword]

TAGS: [tag1], [tag2], [tag3], [tag4], [tag5], [tag6]

╔══════════════════════════════════════════════════════════════════╗
║  STEP 3 — SOCIAL / OG                                           ║
║  (Yoast → Social tab)                                           ║
╚══════════════════════════════════════════════════════════════════╝

OG Title:        [...]
OG Description:  [...]
OG Image URL:    [same as Featured Image]
Twitter Card:    summary_large_image

╔══════════════════════════════════════════════════════════════════╗
║  STEP 4 — SCHEMA                                                ║
║  Yoast Free: use "Insert Headers and Footers" plugin            ║
║              → Footer Scripts → paste the full <script> block.  ║
║  Yoast Premium: Schema → Custom schema tab → paste JSON only.   ║
╚══════════════════════════════════════════════════════════════════╝

<script type="application/ld+json">
[JSON-LD array]
</script>

╔══════════════════════════════════════════════════════════════════╗
║  STEP 5 — POST BODY (Gutenberg)                                 ║
║  Option A (simplest): add one "Custom HTML" block, paste all.   ║
║  Option B (cleanest): use Gutenberg blocks:                     ║
║    • Paragraph/Heading blocks for text                          ║
║    • Custom HTML block for each SVG chart (marked ★)            ║
║    • Custom HTML block for each <table>                         ║
╚══════════════════════════════════════════════════════════════════╝

[clean HTML body — no <script>, no <article>, no <section>, no hero <figure>]
```

---

## Schema Templates

### BlogPosting (required on every post)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://[domain]/blog/[slug]/#article",
  "headline": "[Post title — exact match to H1]",
  "description": "[Meta description]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": { "@id": "https://[domain]/author/[author-slug]/#person" },
  "publisher": { "@id": "https://[domain]/#organization" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://[domain]/blog/[slug]/" },
  "image": {
    "@type": "ImageObject",
    "url": "[Featured Image URL]",
    "width": 1200,
    "height": 630
  },
  "articleSection": "[Category name]",
  "inLanguage": "en-US",
  "wordCount": [approximate word count],
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".key-takeaways", "h2 + p", ".faq-answer"]
  }
}
```

Note: `speakable` — include on BreathMastery technique posts only (not REIG Solar).

### Person — Dan Brulé (BreathMastery, every post)
```json
{
  "@type": "Person",
  "@id": "https://breathmastery.com/author/dan-brule/#person",
  "name": "Dan Brulé",
  "jobTitle": "Founder of Breath Mastery, Master Breathwork Trainer",
  "url": "https://breathmastery.com/about/",
  "image": {
    "@type": "ImageObject",
    "url": "https://breathmastery.com/wp-content/uploads/dan-brule.jpg"
  },
  "sameAs": [
    "https://www.instagram.com/danbruleofficial/",
    "https://www.facebook.com/DanBruleBreathmastery",
    "https://www.linkedin.com/in/danbrule/"
  ],
  "worksFor": { "@type": "Organization", "@id": "https://breathmastery.com/#organization" },
  "description": "Dan Brulé has spent 50+ years studying and teaching breathwork across 73 countries, training over 300,000 people. Author of Just Breathe (Simon & Schuster, 2017), foreword by Tony Robbins.",
  "knowsAbout": ["Breathwork", "Pranayama", "Nervous System Regulation", "Anxiety Relief", "Sleep", "Breathwork Certification"]
}
```

### Person — Alex Montekristobelgrade (REIG Solar, every post)
```json
{
  "@type": "Person",
  "@id": "https://reig-us.com/author/alex-montekristobelgrade/#person",
  "name": "Alex Montekristobelgrade",
  "jobTitle": "REIG Solar Technical Team",
  "url": "https://reig-us.com/author/alex-montekristobelgrade/",
  "worksFor": { "@type": "Organization", "@id": "https://reig-us.com/#organization" },
  "description": "Member of REIG Solar's technical team, specializing in SCADA integration, DAS commissioning, and fiber optic communications for utility-scale solar.",
  "knowsAbout": ["Solar SCADA", "Data Acquisition Systems", "Fiber Optics", "Commissioning", "Utility-Scale Solar"]
}
```

### Organization — BreathMastery
```json
{
  "@type": "Organization",
  "@id": "https://breathmastery.com/#organization",
  "name": "Breath Mastery",
  "url": "https://breathmastery.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://breathmastery.com/wp-content/uploads/breathmastery-logo.png"
  },
  "sameAs": [
    "https://www.instagram.com/danbruleofficial/",
    "https://www.facebook.com/DanBruleBreathmastery"
  ]
}
```

### Organization — REIG Solar
```json
{
  "@type": "Organization",
  "@id": "https://reig-us.com/#organization",
  "name": "REIG Solar",
  "url": "https://reig-us.com",
  "logo": { "@type": "ImageObject", "url": "https://reig-us.com/wp-content/uploads/reig-logo.png" }
}
```

### BreadcrumbList (required on every post)
```json
{
  "@type": "BreadcrumbList",
  "@id": "https://[domain]/blog/[slug]/#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://[domain]/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://[domain]/blog/" },
    { "@type": "ListItem", "position": 3, "name": "[Category]", "item": "https://[domain]/blog/category/[cat-slug]/" },
    { "@type": "ListItem", "position": 4, "name": "[Post Title]", "item": "https://[domain]/blog/[slug]/" }
  ]
}
```

### FAQPage (include when post has 3+ FAQ pairs)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text — exact match to FAQ heading]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text — 40–60 words, self-contained, no HTML tags]"
      }
    }
  ]
}
```

### Full JSON-LD block structure (wrap all schemas in an array)
```json
[
  { BlogPosting },
  { Person },
  { Organization },
  { BreadcrumbList },
  { FAQPage }
]
```

---

## Duplicate Schema Prevention

AIOSEO and Yoast both auto-generate BlogPosting + Person schemas.
**If both our JSON-LD and the plugin are active → Google sees duplicate schema → validation warning.**

### AIOSEO (BreathMastery):
AIOSEO > Search Appearance > Content Types > Posts
→ Turn off "Enable Schema Markup" for Posts
→ We handle BlogPosting, Person, BreadcrumbList, FAQPage manually

### Yoast (REIG Solar):
Yoast > Search Appearance > Content Types > Posts
→ Schema tab → change "Article type" to "None"
→ Leave "Page type" as WebPage (site-level, not post-level)
→ We handle BlogPosting, Person, BreadcrumbList, FAQPage manually

---

## WordPress SEO Checklist

Run before finalizing every post file:

| Check | Requirement |
|-------|-------------|
| SEO title | 50–60 chars; focus keyword in first 3 words |
| Meta description | 150–160 chars REQUIRED; exact focus keyword; statistic recommended, not required |
| Focus keyword in H1 | Yes |
| Focus keyword in first paragraph | MUST be in the opening paragraph — first 100 words is not sufficient |
| Internal links | 3–5; all slugs from SITEMAP.md |
| External links | 2–3; `target="_blank" rel="noopener noreferrer"` |
| Image alt text | All images have keyword-rich alt text |
| Heading hierarchy | H1 (one) → H2 → H3 only |
| Featured image | 1200×630px minimum; set in sidebar, NOT in body |
| Schema | BlogPosting + Person + BreadcrumbList + FAQPage (if FAQ) |
| BreadcrumbList | Position 1–4 with correct category slug |
| Person schema | name, jobTitle, url, image, sameAs, description |
| Hero image in body | NO — set as Featured Image only |
| `<article>` / `<section>` in body | NO — use `<div>` instead |
| SVG charts | Marked with ★ for Raw HTML / Custom HTML block |
| Tags | 6–10 assigned |

---

## Category & Tag Strategy

### BreathMastery — Categories (use one per post)
- Breathing Techniques
- Breathwork Science
- Stress & Anxiety
- Sleep & Recovery
- Certification & Training
- Performance & Focus

### BreathMastery — Tag format
Lowercase, hyphenated: `box-breathing`, `nervous-system`, `stress-relief`, `dan-brule`, `breathwork-certification`

### REIG Solar — Categories (use one per post)
- SCADA Integration
- Data Acquisition Systems
- Commissioning
- Fiber Optics
- Operations & Maintenance
- Industry Insights

### REIG Solar — Tag format
Lowercase, hyphenated: `scada`, `solar-monitoring`, `das-commissioning`, `fiber-optic`, `reig-solar`
