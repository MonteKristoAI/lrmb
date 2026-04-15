# Blog Agent: Autonomous Production Pipeline

This is an execution script, not a reference guide.
Read each section and execute it as written. No decisions are left to interpretation.
Every post goes through the full pipeline. No shortcuts. No optional steps.

> **Second Brain integration:** Before starting any blog work, read the relevant vault files for additional context:
> - Writing rules (applies to ALL clients): `~/Documents/MonteKristo Vault/skills/writing-rules.md`
> - Brand voice: `~/Documents/MonteKristo Vault/skills/brand-voice.md`
> - BreathMastery deep context: `~/Documents/MonteKristo Vault/projects/breathmastery/editorial-rules.md`
> - REIG Solar deep context: `~/Documents/MonteKristo Vault/projects/reig-solar/blog-config.md`
> The vault is the single source of truth for rules. If vault and this file conflict, vault wins for rules/preferences.

---

## SECTION 0: Initializer Protocol (One-Time Setup Only)

```
Run this section ONLY IF either file does not exist:
  /Blog/blog-progress.json
  /Blog/blog-tasks.json

Do NOT run at the start of a normal session: skip directly to Section 1.

---

STEP 0.A: Check for JSON state files

  Attempt to read: /Blog/blog-progress.json
  If the file exists → skip this entire section and go to Section 1.
  If the file does not exist → proceed with Steps 0.B and 0.C.

---

STEP 0.B: Create blog-progress.json

  Create /Blog/blog-progress.json with this structure:
  {
    "schema_version": "1.0",
    "last_updated": "{today YYYY-MM-DD}",
    "clients": {
      "{client-name}": {
        "last_session": "{today}",
        "posts_completed_total": 0,
        "wip": null,
        "last_completed": null,
        "next_priority": null
      }
    },
    "sessions": [],
    "error_log": []
  }

  If initializing an existing client (REQUESTS.md already has Done rows):
    Read REQUESTS.md → count Done rows → set posts_completed_total.
    Find the most recent Done row by Completed At → set last_completed (slug from CONTENT.md).
    Find the first Not Yet row → set next_priority (that row's Airtable ID).

---

STEP 0.C: Create blog-tasks.json

  Create /Blog/blog-tasks.json with this structure:
  {
    "schema_version": "1.0",
    "last_synced": "{today}",
    "IMMUTABILITY_RULE": "ONLY update: status, passes, completed_at, generated_post_id, retry_count, last_error, slug. NEVER delete tasks. NEVER modify id, title, keyword, priority.",
    "clients": {
      "{client-name}": {
        "airtable_base": "appZaD3T174afBSaq",
        "airtable_requests_table": "tblyq7MN2svfMrZNy",
        "airtable_generated_table": "tbl3yijxMg5P58Q6c",
        "tasks": []
      }
    }
  }

  Populate tasks from REQUESTS.md:
    For each row: create a task object with id, title, keyword, priority (row number).
    Status=Done rows   → status:"done",   passes:true,  fill completed_at/generated_post_id/slug
    Status=Not Yet rows → status:"queued", passes:false, set completed_at/generated_post_id/slug to null

  CRITICAL: It is unacceptable to remove tasks from blog-tasks.json or edit any field
  except: status, passes, completed_at, generated_post_id, retry_count, last_error, slug.
  Removing or editing tasks could lead to missed work or lost history.

---

STEP 0.D: New client onboarding

  After creating the 6 client files per Section 12 (ONBOARDING.md):
  1. Create /Blog/clients/{client}/REQUESTS.md with the post queue from client brief.
  2. Run Step 0.C to populate blog-tasks.json for this client.
  3. Add the client key to blog-progress.json → clients object.
  4. Set next_priority to the Airtable ID of the first row in REQUESTS.md.
  5. Add client to Active Clients table in Section 2.
```

---

## SECTION 1: Session Startup (Run Every Session)

```
On every session start : in this exact order:

STEP STARTUP-A: Read the session progress file FIRST (before anything else)

  Read: /Blog/blog-progress.json
  Note for this client:
    → wip          : is it null, or does it contain a slug + phase?
    → next_priority : the Airtable ID of the next queued task
  Read sessions[-1] (last entry in sessions array) to see what the previous session did.
  This prevents duplicating work that was already completed.

STEP STARTUP-B: Check for interrupted work (WIP)

  If wip is NOT null:
    → A previous session was interrupted mid-post. Do NOT pick a new task.
    → Resume the post at: wip.phase
    → The post slug is: wip.slug
    → State out loud: "Resuming interrupted post: {slug} at phase {phase}"
    → Jump to that phase in Section 3. Skip all prior phases.

  If wip IS null:
    → No interrupted work. Proceed to select a new task.
    → Read /Blog/blog-tasks.json → find tasks array for this client
    → Locate the task where id = next_priority from blog-progress.json
    → Confirm its status is "queued" before starting
    → Set its status to "processing" in blog-tasks.json
    → State out loud: "Starting new task: {task title}"

STEP STARTUP-C: Client context load

1. Identify the client (from user prompt or ask: "Which client?")
2. Navigate to /Blog/clients/{client-name}/
3. Load client context : fast path first:
   a. Read brief.json  : compact distilled profile (identity, voice, dont list, CTAs, last feedback)
      If brief.json does NOT exist for this client: read CLIENT.md, STYLE.md, BRAND.md, FEEDBACK.md
      in full and create brief.json before continuing (see brief.json schema in clients/breathmastery/)
      If brief.json exists but ANY of CLIENT.md, STYLE.md, BRAND.md, or FEEDBACK.md is newer
      than brief.json: rebuild brief.json from all 4 source files, then continue.
   b. CONTENT.md       : find next post with status "planned"
   c. SITEMAP.md       : load completely : this is the ONLY source of valid internal URLs
   d. LINK-USAGE.md    : load link frequency data to prioritize underused internal links
   e. EXTERNAL-LINKS.md : load verified external authority links for this client's niche
   f. IMAGE-LOG.md     : load all previously used image IDs (banned list for this session)
4. Note the CMS Platform from CLIENT.md:
   - WordPress → read /Blog/WORDPRESS.md and apply its output format to every post
   - Other platforms → apply matching format from blog skill references/platform-guides.md
5. Activate persona: /blog persona use {persona-name} (from CLIENT.md)
6. Confirm: state client name, persona loaded, CMS platform, next post title in queue
```

If SITEMAP.md is missing: stop and create it before proceeding. Internal links cannot be written without it.
If CONTENT.md has no "planned" posts: check REQUESTS.md for "Not Yet" items and ask user which to work on.

---

## SECTION 2: Active Clients

| Client | Folder | Persona | Website | Author Byline | Review Doc |
|--------|--------|---------|---------|---------------|------------|
| Breath Mastery | `clients/breathmastery/` | breathmastery | breathmastery.com | By Dan Brulé, Founder of Breath Mastery \| 50+ years, 73 countries | [Open Doc](https://docs.google.com/document/d/1x6TSrHb3RLTMcPdqOETgrjMSx8a_JnEvpuWipcARCKM/edit) |
| REIG Solar | `clients/reig-solar/` | reig-solar | reig-us.com | By Alex Montekristobelgrade, REIG Solar Technical Team | [Open Doc](https://docs.google.com/document/d/1JZXXwh6e1z7t4uIdVeQgzI8j68SAEwGEN2eQ36W7XE8/edit) |
| LuxeShutters | `clients/luxeshutters/` | luxeshutters | luxeshutters.com.au | By Chris & Campbell, LuxeShutters, Temora NSW | Static HTML blog (separate repo) |
| GummyGurl | `clients/gummygurl/` | gummygurl | gummygurl.com | By the GummyGurl Team, Carolina Natural Solutions | Static HTML blog (`MonteKristoAI/gummygurl-blog`) |
| Entourage Gummies | `clients/entouragess/` | (pending voice corpus P-014) | getentouragegummies.com | By Sandy Adams, Founder of Entourage Gummies, Charlotte NC | Static HTML blog (local `entouragess-blog/`, git initialized, not pushed) |
| Scientific Data Systems (SDS / Warrior) | `clients/sds/` | sds-warrior | sdsdata.lovable.app / warriorsystem.com | By the Scientific Data Systems engineering team (Houston, TX) — MK operates as "Alex Srdic", NEVER reveal MonteKristo AI | TBD — recommended: Static HTML blog (same pattern as LuxeShutters/GummyGurl/Entourage) |

### Breath Mastery CTAs

| Post type | Primary CTA | URL |
|-----------|-------------|-----|
| Beginner / entry posts | Breath & Beyond ($97) | https://breathmastery.com/product/breath-beyond/ |
| Practice-building posts | Mastering The Breath ($97) | https://breathmastery.com/product/mastering-the-breath/ |
| Deep practice / science posts | Legacy Collection ($397, 500+ lessons) | https://breathmastery.com/product/dan-brules-breathwork-legacy-collection/ |
| Professional / career posts | Practitioner Certification ($7,560) | https://breathmastery.com/practitioner-program/ |
| Events or Breathfest | Live events | https://breathmastery.com/events/ |
| Secondary / free fallback only | 21-Day Training (free) | https://breathmastery.com/21daytraininginbreathwork/ |

**CTA rules:**
- Lead with a paid product. The free 21-Day Training is a secondary fallback only — never the sole CTA.
- Each post can mention 2 products max: one primary (paid) + one secondary (lower price tier or free).
- Match the product to the reader's intent: someone fixing stress tonight → Breath & Beyond or Mastering The Breath; someone going deep into science/practice → Legacy Collection; someone considering teaching → Practitioner Certification.

**NEVER link to:** `/product-category/training-programs/` — this URL is a 404.

### REIG Solar CTAs

| Post type | CTA |
|-----------|-----|
| Technical reference posts | RenergyWare: https://reig-us.com/renergyware/ |
| All posts | Contact: https://reig-us.com/contact/ |

### LuxeShutters CTAs

| Post type | CTA |
|-----------|-----|
| Bottom-funnel (consultation, process) | Book free consultation: https://luxeshutters.com.au/contact |
| Commercial (cost, comparison) | Get a free quote: https://luxeshutters.com.au/contact |
| Case studies | Call 1800 465 893 |
| Informational | Download buying guide (email capture) |

**LuxeShutters platform:** Static HTML blog in separate repo (`MonteKristoAI/luxeshutters-blog`). NOT WordPress. Posts are HTML files in `/posts/` with META comment blocks. Build with `node build.js`. Auto-deploys to Cloudflare Pages. Served at `luxeshutters.com.au/blog/` via CF Worker proxy.

**LuxeShutters output format:** HTML post files with META comment block (not WordPress HTML). See `Blog/clients/luxeshutters/CLIENT.md` for full platform details.

### GummyGurl CTAs

| Post type | Primary CTA | Secondary CTA |
|-----------|-------------|---------------|
| Product comparison | "Shop [Winner]" button to product page | "Subscribe & Save 10%" |
| Educational guide | "Browse Products" button | Newsletter popup (Klaviyo, 10% off) |
| Dosing guide | "Start with [beginner product]" link | Newsletter signup |
| Legal/regulatory | Newsletter signup ("Get notified when hemp law changes") | "Bookmark this page" |
| Pet CBD | "Shop Pet Products" button | Newsletter signup |

**GummyGurl platform:** Static HTML blog in separate repo (`MonteKristoAI/gummygurl-blog`). NOT WordPress. Posts are HTML files in `/posts/` with META comment blocks. Build with `node build.js`. Cloudflare Pages + CF Worker proxy at `gummygurl.com/blog/`. Same architecture as LuxeShutters.

**GummyGurl output format:** HTML post files with META comment block. See `Blog/clients/gummygurl/CLIENT.md` for full platform details. Compliance disclaimer required on every post (STYLE.md).

**CRITICAL:** November 2026 hemp ban. All THC content must be live by July 2026. Primary KPI is email signups, not organic sessions. Every THC post must include November 2026 urgency section.

### Entourage Gummies CTAs

| Post type | Primary CTA | Secondary CTA |
|---|---|---|
| Hub post (cluster A) | "Shop the three effects" -> `getentouragegummies.com/shop` | Newsletter inline |
| Science spoke (clusters A, B) | "Explore TiME INFUSION" -> `/explore-technology` | Newsletter inline |
| Smoking-comparison (cluster C) | "Try a sessionable gummy" -> `/shop` | Newsletter for new drops |
| Regulatory (cluster D) | "Stock up before federal rules change" -> `/shop` | Newsletter for regulatory updates |
| Dosing (cluster E) | "Start low, go slow, find your effect" -> `/effects` | Newsletter for dosing PDF |
| Terpene (cluster F) | "Match the terpene to the moment" -> `/shop` | Newsletter |

**Entourage Gummies platform:** Static HTML blog in separate repo (`entouragess-blog/`, mirror of `MonteKristoAI/gummygurl-blog` and `MonteKristoAI/luxeshutters-blog` pattern). NOT WordPress. Posts are HTML files in `/posts/` with META comment blocks. Build with `node build.js`. Target: Cloudflare Pages + CF Worker proxy at `getentouragegummies.com/blog/`. Same architecture as GummyGurl and LuxeShutters.

**Entourage output format:** HTML post files with META comment block. See `Blog/clients/entouragess/CLIENT.md` and `entouragess-blog/README.md`. Build-time brand validation rejects em dashes, incorrectly-cased TiME INFUSION, Azuca mentions, and medical-claim vocabulary.

### Scientific Data Systems (SDS / Warrior) CTAs

| Post type | Primary CTA | URL / Destination |
|---|---|---|
| Pillar / architecture (Hub A) | "Request a demo of the Warrior platform" | `sdsdata.lovable.app/#quote` |
| Product deep dive (Hub B) | "Configure your Universal Panel" | Quote builder (4-step form) |
| Perforating / safety (Hub C) | "Download the addressable switch compatibility matrix" | Gated PDF |
| Geothermal pivot (Hub D) | "Talk to the Houston engineers about geothermal wireline" | Direct contact form |
| Leasing / business case (Hub E) | "Get your leasing quote in 1 business day" | Quote builder |
| Career post (standalone) | "Join the Warrior user forum" | User forum link |

**SDS platform:** TBD. Current recommendation: Static HTML blog repo (same pattern as LuxeShutters, GummyGurl, Entourage) deployed via Cloudflare Pages + Worker proxy on a custom domain. Alternative: Lovable blog routes on `sdsdata.lovable.app/blog/*`. Decision pending with Maxine Aitkenhead (GetStuffDone LLC agency PM).

**CRITICAL for SDS:**
1. **MK identity:** Operate as **"Alex Srdic"** to SDS in every post, CTA, byline, and comment. **Never reveal "MonteKristo AI", "MonteKristo", "MK", or "Milan Mandic"** in any SDS-facing output. Billing entity is GetStuffDone LLC.
2. **May 5, 2026 Warrior Universal Panel Mixer launch.** 8 blog posts must be live by that date. Order and dates are in `clients/sds/CONTENT.md`.
3. **Approver is Christopher M Knight** (christopher.knight@warriorsystem.com). Every post with new factual claims about Warrior, SDS, or regulatory content must route through Maxine → Christopher. Allow 48-72h for Christopher's review.
4. **Banned vocabulary (Christopher-rejected):** interoperable, subsurface intelligence, data sovereignty, guided workflows, intelligent automation, supervised automation, Warrior 8.0 launch, tractor-conveyed claims, proprietary formats (as abstract), legacy/old. Full list at `clients/sds/copy/banned-vocab.md` and in the `sds-warrior` persona JSON `dont` array. **Zero em dashes** (MK + SDS rule).
5. **Use "Warrior Universal Panel"** not "Warrior 8.0" for the launch product. Warrior 8 / P10V7.1 is existing software.
6. **Use "universally compatible"** not "interoperable". **Use "standardized interfaces"** not "guided workflows".
7. **Auto-Perf mode handles FIRING ONLY**, not setup. Christopher was specific about this.
8. **Weatherford distributes SDS Warrior** (via weatherford.com product catalog) — the single most important positioning fact. Use in 4+ of the 8 launch posts.
9. **Quality gates:** `/blog analyze` ≥ 90, `/blog geo` ≥ 85 (raised from default 80), `/blog factcheck` 0 NOT FOUND, `/blog seo-check` 0 FAIL. Non-negotiable.
10. **Airtable NOT configured for SDS.** Using placeholder task IDs `sds-001` through `sds-008`. Skip Step 5.3 Airtable updates for SDS tasks until GetStuffDone provides base access.

**CRITICAL for Entourage:**
1. **November 12, 2026 federal hemp ban (H.R. 5371)** -- all regulatory cluster content must be live by 2026-07-12 per Pattern P-012 (4-month indexation buffer).
2. **GummyGurl overlap** -- Entourage and GummyGurl share the same parent company (Carolina Natural Solutions). Until GummyGurl's topic list is confirmed, Entourage must NOT publish in: CBD-first wellness, pet CBD, CBD skincare, CBD vs THC 101, hemp wellness lifestyle, sleep-CBD, women-focused wellness. See `clients/entouragess/FEEDBACK.md` Rule 15.
3. **Voice calibration gate (P-014)** -- collect 5+ Sandy writing samples before publishing post #2. Story-led (template C) posts are parked until voice is calibrated.
4. **Brand rules enforced at build time**: zero em dashes, exact `TiME INFUSION` stylization, zero Azuca, no medical claims, FDA disclaimer + Farm Bill + age gate on every page.

---

## SECTION 3: The Blog Production Pipeline (ALL 20 SKILLS — MANDATORY)

Every post runs every step. No step is skipped. Execute fully before moving to the next.

---

### PHASE 0: PRE-WRITE (Quality Foundation)

#### STEP 0.1 — Cannibalization Check

```
Run: /blog cannibalization
Also check: SITEMAP.md and CONTENT.md Primary Keyword column
If conflict exists → stop and flag to user. Do not proceed.
```

#### STEP 0.2 — Deep Research (Perplexity)

```
Call: mcp__perplexity__perplexity_research
  Query 1: "[topic] statistics 2025 2026 research study"
  Query 2: "[topic] SERP analysis what competitors miss"
Record:
  → 8-12 statistics with exact source URLs and publication years
  → 3-5 content angles competitors miss (gaps to own)
```

#### STEP 0.3 — Source Verification + Image Discovery

```
Launch: blog-researcher agent with:
  - Perplexity findings from Step 0.2
  - Client niche and audience from CLIENT.md
  - IMAGE-LOG.md banned image IDs list
  - EXTERNAL-LINKS.md verified sources

Agent tasks:
  a. Verify each statistic by fetching source URL
  b. Find 3 Pixabay/Unsplash/Pexels image URLs:
     - MUST check IMAGE-LOG.md first -- never select an image ID that appears there
     - Use DIVERSE search queries (check IMAGE-LOG.md query log, never repeat a query)
     - Vary subject matter: if last 3 posts used "person meditating", search for environments,
       hands/details, nature scenes, or abstract concepts instead
     - Check IMAGE-LOG.md Subject Category Rotation -- pick from least-used categories
     - Confirm each image resolves (HTTP 200) via WebFetch
  c. For external links: check EXTERNAL-LINKS.md first for verified sources on this topic
     - Use existing verified links before searching for new ones
     - Any NEW external link found via research must be verified via WebFetch immediately
     - Add verified new links to EXTERNAL-LINKS.md
  d. Identify most-cited sources for E-E-A-T
  e. Extract 2-3 real quotes or data points from primary sources
```

#### STEP 0.4 — Content Brief

```
Run: /blog brief [topic]
Brief includes: keyword strategy, template recommendation, competitive analysis,
  8-12 verified statistics, title options, meta description draft, CTA assignment
```

#### STEP 0.5 — FAQ Mining from SERP

```
Call: mcp__perplexity__perplexity_ask
  Query: "People also ask questions for: [topic] [primary keyword]"
  Query: "Most common questions beginners ask about [topic]"
Record: 8-10 real questions people type into Google for this topic.
These become the FAQ section + inform H2 phrasing.
Priority: questions that appear in Google's "People Also Ask" box rank fastest as FAQ schema.
Add the best 5-6 to the outline as FAQ candidates.
```

---

### PHASE 1: STRUCTURE

#### STEP 1.1 — Outline

```
Run: /blog outline [topic]
Output must include:
  → 6-8 H2 sections with word count targets per section (150-400 words, not uniform)
  → AIOSEO keyword placement plan: note which H2, intro paragraph, and image alt will contain the exact focus keyword phrase
  → Chart placement markers (2-3 charts, different types)
  → Image placement markers (2-3 images)
  → FAQ plan (5+ Q&A pairs)
  → Internal link zones (3-5 spots to link, verified against SITEMAP.md)
  → 60-70% of H2s must be questions or answer-seeking phrases
```

---

#### STEP 1.2 — Sprint Contract (Confirm Before Writing)

```
Before writing a single word of body content, output a sprint contract and
WAIT for user confirmation (or auto-approve after 2 minutes if running unattended via cron).

Sprint contract format:
  ─────────────────────────────────────────────────────────────────────
  SPRINT CONTRACT: [Post Title]
  Focus angle:     [1 sentence — what unique angle beats the top 3 SERP results]
  Lead statistics (top 3 to anchor intro + H2 openers):
    1. [Stat] — [Source name] ([year])
    2. [Stat] — [Source name] ([year])
    3. [Stat] — [Source name] ([year])
  H2 structure (6-8 headings, in order):
    H2-1: [heading text]
    H2-2: [heading text]
    H2-3: [heading text]
    ...
  CTA assignment: [product name + price] — [1 sentence matching reader intent]
  Word count target: [X] words
  ─────────────────────────────────────────────────────────────────────

If user approves (or 2 min passes with no response): proceed to STEP 2.1.
If user requests changes: revise contract and re-present. Do NOT start writing until locked.
```

---

### PHASE 2: CONTENT CREATION

#### STEP 2.1 — Write Post

```
Run: /blog write [topic]
Inputs: active persona + brief from 0.4 + outline from 1.1 + verified stats from 0.3

PLATFORM OUTPUT: Apply CMS-specific format noted in startup Step 4.
WordPress clients (BreathMastery + REIG Solar): use paste-ready format per /Blog/WORDPRESS.md
  Structure the output as 5 numbered STEP sections (STEP 1 through STEP 5):
    STEP 1: SEO plugin fields (AIOSEO for BreathMastery / Yoast for REIG)
    STEP 2: Sidebar fields (Featured Image URL+alt, Excerpt, Category, Tags)
    STEP 3: JSON-LD schema block (NOT in post body -- paste into plugin schema tab)
    STEP 4: Clean HTML post body

  NOTE: OG/Social fields are NOT needed. WordPress auto-generates OG tags from
  the post title, excerpt, and featured image. Do NOT create separate OG title,
  OG description, or OG image fields. This is wasted effort.

  WordPress HTML rules — apply to STEP 5 body only:
    ✗ No <section> tags for inner content blocks — use <div class="..."> for all inner wrappers
    ★ Outer post body wrapper: MUST be <article> (per Section 5 spec). Not a <div>.
    ✗ No <script> tags — schema goes in STEP 4 only
    ✗ WORDPRESS CLIENTS: No hero/featured image in HTML body. Hero goes in WP sidebar "Featured Image" panel.
      The HTML body starts directly with <h1>, byline, then Key Takeaways. No <figure> before content.
    ✗ NON-WORDPRESS CLIENTS (CF Pages, static HTML): Featured image IS in the HTML body,
      placed as <figure> immediately after the author byline, before the first H2.
    ✗ No <style> blocks — use inline style="" on elements
    ★ Every SVG chart must be marked with a comment:
       <!-- ★ SVG CHART — paste into WPBakery Raw HTML (BreathMastery)
                          or Gutenberg Custom HTML block (REIG) -->

  Schema (STEP 4) MUST include ALL of:
    ✓ BlogPosting (with speakable for BreathMastery technique posts)
    ✓ Person (full: name, jobTitle, url, image, sameAs, description, knowsAbout)
    ✓ Organization
    ✓ BreadcrumbList (4 levels: Home → Blog → Category → Post)
    ✓ FAQPage (when post has 3+ FAQ pairs)

  Use exact schema templates from /Blog/WORDPRESS.md.

Post MUST contain on first draft:
  ✓ Key Takeaways box (5 bullets; 2+ contain statistics with inline sources)
  ✓ WORDPRESS: NO H1 and NO author byline in HTML body. Title is set via WP post title field. Byline is handled by WP theme.
    NON-WORDPRESS: H1 + author byline ARE in HTML body (after <article> tag, before Key Takeaways).

AIOSEO/Yoast Compliance — MANDATORY. ALL checks must pass before Phase 3.
  Iterate on the post until every check is green. No check may be skipped or left failing.
  If any check fails: identify the failing element, fix it in the HTML, re-verify, repeat.
  ✓ ONE focus keyword per post — use the exact `focus_keyphrase:` value from the
    brief's .md file. Never change it to a shorter version for AIOSEO.
    AIOSEO "keyword too long" warning is acceptable. All placement checks must pass.
  ✓ Focus keyword in meta description — exact phrase (not paraphrase);
    length MUST be 150-160 characters. Statistic is recommended but not required.
  ✓ Focus keyword in the FIRST PARAGRAPH of the body (after the Key Takeaways box).
    Must appear within the opening paragraph itself — not merely somewhere in the first 100 words.
  ✓ Focus keyword in 30–40% of all H2 and H3 headings (exact phrase).
    Count every H2 and H3 in the post → ensure 30–40% contain the exact keyword.
    With 8 H2s + 4 H3s (12 total) → 4–5 headings must contain the exact phrase.
    Variations and paraphrases do NOT count.
  ✓ Focus keyword in at least 1 image alt attribute (exact phrase)
  ✓ Focus keyword density MUST be 0.65%–0.9% — hard range, not a floor.
    Below 0.65%: add occurrences. Above 0.9%: thin out forced repetitions.
    For a 1,600-word post → 10–14 occurrences. For a 2,000-word post → 13–18.
    For a 2,500-word post → 16–22 occurrences. Weave into section openings,
    sentence variations, and recap sentences where they fit naturally.
  ✓ URL slug MUST contain the focus keyword words (stop words "for/the/a" may be omitted).
    The slug must be listed explicitly in the SEO meta comment block (URL Slug: field).

  ✓ Answer-first H2 format: every H2 opens with 40-60 word stat-rich paragraph
  ✓ 6-8 H2 sections with H3 subheadings where depth requires
  ✓ 5+ FAQ pairs (40-60 words each; fully self-contained answers)
  ✓ Safety note (health/breathing posts) OR Failure Modes section (REIG posts)
  ✓ Embedded practice exercise (technique posts) OR checklist (reference posts)
  ✓ 1-2 comparison tables with <thead> markup
  ✓ SVG charts: include as many as the content requires for quality and clarity. Each SVG requires a separate WPBakery Raw HTML / Gutenberg Custom HTML block.
  ✓ 2-3 images with descriptive alt text and figcaption
  ✓ 3-5 internal links — ALL from SITEMAP.md, prioritized by LINK-USAGE.md:
    ALGORITHM:
    1. Open LINK-USAGE.md → sort internal links by usage count (ascending)
    2. From the least-used links, select 3-5 that are topically relevant to this post
    3. If a link has been used 3+ times AND a relevant alternative exists with 0-1 uses → pick the alternative
    4. NEVER use the same internal link in consecutive posts (check last post's link set in LINK-USAGE.md)
    5. After writing: append this post's link selections to LINK-USAGE.md
  ✓ 3-5 external links — verified sources only:
    ALGORITHM:
    1. Open EXTERNAL-LINKS.md → find sources matching this post's topic clusters
    2. Select 3-5 from the verified database, prioritizing:
       - Sources not used in the last 3 posts (check EXTERNAL-LINKS.md Link Usage Tracking)
       - Government (.gov), academic (.edu), peer-reviewed (pubmed, doi.org) first
       - Industry authority sites second
    3. If topic needs a source NOT in EXTERNAL-LINKS.md:
       a. Search via Perplexity for the specific claim/statistic
       b. WebFetch the found URL immediately to verify HTTP 200
       c. If verified: add to EXTERNAL-LINKS.md with today's date
       d. If not verified: do NOT use — find an alternative
    4. NEVER fabricate or guess a URL. If you cannot find a verified source, omit the link.
    5. All external links: target="_blank" rel="noopener noreferrer"
  ✓ CTA appropriate to post type (from Section 2)
  ✓ Further reading (4 links; none duplicating body links)
  ✓ Word count: 2,000+ for how-to posts; 3,000+ for pillar pages
```

#### STEP 2.2 — Find Images (Stock First, AI Fallback)

```
IMAGES PER POST:
  - WordPress clients: 1 featured image only (NOT in HTML body, uploaded to WP sidebar)
  - Non-WordPress clients: 1 featured image (in HTML body after byline) + 0-1 body images

NO OG IMAGES NEEDED. WordPress and CF Pages auto-generate OG from featured image.
Do NOT create separate OG image fields. Do NOT search for OG-specific images.

PRE-CHECK:
  1. Read IMAGE-LOG.md -> extract banned image IDs
  2. Read IMAGE-LOG.md -> check Subject Category Rotation
  3. Read IMAGE-LOG.md -> extract search queries used in last 5 posts

IMAGE SOURCE PRIORITY (follow this order strictly):
  1. STOCK PHOTO FIRST (Pexels, Unsplash, Pixabay)
     - Search for a specific, relevant image that matches the post topic
     - Use descriptive search queries related to the post content:
       GOOD: "solar farm SCADA control panel monitoring screens"
       GOOD: "fiber optic cable splicing technician field"
       GOOD: "pyranometer weather station solar panels"
       BAD: "technology", "business", "nature" (too generic)
     - Image MUST have clear visual relevance to the post topic
     - Image ID must NOT appear in IMAGE-LOG.md banned list
     - Search query must NOT repeat any query from IMAGE-LOG.md
     - Verify image loads (HTTP 200) via WebFetch before using
  2. AI GENERATION ONLY AS FALLBACK (nanobanana-mcp Gemini)
     - Use ONLY when stock search fails to find a relevant image after 3+ different search queries
     - Set aspect ratio: mcp__nanobanana-mcp__set_aspect_ratio (16:9)
     - Generate: mcp__nanobanana-mcp__gemini_generate_image
     - Upload to Supabase Storage (blog-images bucket) for permanent hosting
     - Log with prefix "gemini-{slug}"

SUBJECT DIVERSITY:
  - Check IMAGE-LOG.md Subject Category Rotation
  - If last 3 posts used same visual category, pick from least-used category
  - Rotate: equipment/panels, control rooms, field work, cables/infrastructure, aerial views

AFTER SELECTING:
  - Update IMAGE-LOG.md: Used Images table, Banned IDs list, Search Queries, Category Rotation
  - Each image needs: descriptive alt text with focus keyword, loading="lazy"

WHAT NOT TO DO:
  - Do NOT use generic stock photos with no connection to solar/SCADA/fiber/energy
  - Do NOT reuse any image ID from IMAGE-LOG.md banned list
  - Do NOT generate OG images
  - Do NOT add more than 1 featured image per post
```

#### STEP 2.3 — Schema Validation

```
Run: /blog schema [file]
Validates and generates complete JSON-LD array:
  → BlogPosting (author as Person — @type: "Person", NOT Organization)
  → FAQPage (all FAQ pairs)
  → BreadcrumbList (Home → Blog → Post)
Fix any validation errors before proceeding.
```

---

### PHASE 3: QUALITY GATES (All Must Pass — Auto-Fix If Not)

**PARALLEL EXECUTION RULE:** After STEP 3.1 passes, launch STEPS 3.2, 3.3, 3.4, and 3.5 IN PARALLEL as separate agent calls. Do NOT run them sequentially. Collect all failure lists, then apply all fixes in ONE combined pass before moving to Phase 4.

#### STEP 3.1 — Quality Score

```
PRE-CHECK (run before /blog analyze — catch mechanical failures without spending reviewer tokens):

  a. Keyword density: count exact focus keyword occurrences ÷ total word count × 100
     → Must be 0.65%–0.9%. If outside range: add or remove occurrences NOW before scoring.
  b. Em dash count: count all "—" in post body
     → Must be ZERO. Em dashes are permanently banned from ALL client content.
     → Replace every em dash with a comma, colon, period, or parentheses. Rewrite if needed.
     → This is a MonteKristo AI company-wide rule, not a suggestion. Zero tolerance.
  c. H2/H3 keyword coverage: count headings containing exact focus keyword ÷ total H2+H3 count
     → Must be 30–40%. If below: rewrite headings NOW. If above: vary some headings NOW.
  d. Focus keyword in first paragraph (after Key Takeaways): verify exact phrase present.
     → If missing: add to opening sentence NOW.
  e. Transition word coverage: count sentences containing any of these words/phrases:
     "however, therefore, additionally, in addition, as a result, in contrast, in fact,
     that said, by contrast, first, second, finally, also, still, indeed, moreover,
     thus, consequently, meanwhile, next, then, because, so, although, yet"
     Coverage = matching sentences ÷ total sentences × 100.
     → Must be ≥30%. If below: add transition openers to body paragraphs NOW before scoring.
     Note: add transitions only where they fit naturally — do not force them every sentence.
  f. Image count: count all <img and <figure tags in post body (exclude schema block).
     → Must be ≥2. If below 2: add a second in-body image with alt text and figcaption NOW.
  g. FAQ answer length: for each FAQ answer paragraph (itemprop="text" or answer <p> after FAQ H3),
     count words. Each answer must be ≥80 words.
     → If any answer is below 80 words: expand it NOW before scoring.

  Fix ALL failing pre-checks BEFORE running /blog analyze.
  These are verifiable in under 60 seconds and prevent wasted full-review passes.

TOKEN OPTIMIZATION: Run /blog analyze ONCE to get the full issue list.
Apply ALL fixes in a single pass (use OpenAI for prose rewrites).
Run /blog analyze ONCE to verify final score.
Do NOT analyze after individual fixes — batch all fixes first.

CROSS-SESSION ANALYZE LIMIT:
After each /blog analyze run: increment blog-tasks.json → this task → total_analyze_runs by 1.
Global limit: total_analyze_runs ≤ 4 per post (across all sessions).
If total_analyze_runs reaches 4 and score is still <85: flag to user per Section 17 CASE A.
Do NOT run another pass. Rationale: each new session resets context but cumulative token
spend is real. The 2-per-session limit only controls within a session; 4 total is the ceiling.

Target: 90+/100

If score is 90+   → proceed to Step 3.2
If score is 85-89 → apply ALL remaining fixes in one pass → re-analyze once
If score is <85   → run /blog rewrite [file] with full fix list → re-analyze once
Maximum 2 analyze runs per session (initial + final verification). Global ceiling: 4 total across all sessions.
Still <85 after global ceiling → flag to user per Section 17 CASE A.
```

#### STEP 3.2 — SEO Validation

```
Run: /blog seo-check [file]
Fix every FAIL item before proceeding (no exceptions).
Re-run after fixes to confirm all FAILs resolved.
All WARNs documented; critical WARNs fixed.
For WordPress clients: open AIOSEO panel and verify every keyword check is green.
  ITERATION RULE: If any check fails → fix that element → re-verify → repeat until all pass.
  All checks are hard requirements — no exceptions, no skipping.
  Keyword density must be 0.65%–0.9%: both below and above this range require correction.
```

#### STEP 3.3 — AI Citation Readiness

```
Run: /blog geo [file]
Target: 80+/100

If < 80: add/improve answer-first paragraphs on lowest-scoring H2s,
  improve FAQ answers, add comparison table with <thead>, then re-run
Post must have: answer-first H2s, self-contained FAQ, entity defined at first mention
```

#### STEP 3.4 — Statistics Verification

```
Run: /blog factcheck [file]
Every cited statistic must show VERIFIED or PARAPHRASE status.
Replace any NOT FOUND statistics with verified alternatives from Perplexity research.
Re-run until all stats verified. Zero unverified statistics allowed.
```

#### STEP 3.5 — Voice Consistency Check

```
Load: persona JSON file for this client from
  /Users/milanmandic/.claude/skills/blog/references/personas/{persona-name}.json

Check the post against these persona rules:
  → Does it open with problem/failure mode (not a definition)?
  → Is the sentence rhythm correct? (breathmastery: short/long variation; reig: declarative + technical)
  → Are banned words from persona "dont" list present? If yes: replace them.
  → Does it match the tone dimensions? (breathmastery: casual, warm; reig: serious, technical)
  → Are required elements present? (persona content_requirements checklist)
  → TTR > 0.40? (run vocabulary diversity check on body text)
  → Em dash count = 0? (ZERO em dashes allowed in any post)
  → Flesch Reading Ease ≥ 60? (flag dense paragraphs, split long sentences)
  → Transition word coverage 30–50%? (count sentences with transition words ÷ total sentences)
  → Any 3+ consecutive sentences starting with the same word? (rewrite the third)
  → Any H2 section over 300 words without an H3? (add a subheading)

If any check fails: fix inline. Do not run Phase 4 until voice check passes.
```

#### STEP 3.6 — External Link Verification

```
Hard gate before delivery. All external links must return HTTP 200.

For every external link in the post:
  1. Fetch the URL using WebFetch (Perplexity API is unreliable — use WebFetch directly)
  2. If 404 / connection refused / redirect to homepage: replace with a working alternative
  3. Document any replaced links in the post's SEO meta comment block

Common failure patterns:
  → Expired DOIs: find the paper on PubMed, replace with pubmed.ncbi.nlm.nih.gov URL
  → Domain changes: search for the org name to find the new domain
  → Paywalled research: link to PubMed abstract instead of full PDF

No broken external link may remain at delivery.

After verification, sync EXTERNAL-LINKS.md:
  - Add any newly discovered working links to EXTERNAL-LINKS.md with today's date
  - Remove any broken links from EXTERNAL-LINKS.md (if they were listed there)
  - Update "Last Verified" date for all links used from EXTERNAL-LINKS.md
  - Update Link Usage Tracking counts in EXTERNAL-LINKS.md
```

#### STEP 3.7 -- AutoLoop Optimization (Automatic)

```
After ALL quality gates pass (Steps 3.1-3.5), run AutoLoop to squeeze final points:

  Run: /autoloop blog-quality [file] --iterations 5

  This runs the Karpathy ratchet loop:
  - Evaluates current score with /blog analyze
  - Proposes targeted improvements (schema, meta tags, burstiness, internal links)
  - Keeps changes that improve score, discards regressions
  - Guard rails: zero banned words, burstiness stable, voice preserved

  If score is already 90+: AutoLoop focuses on Technical Elements and AI Citation Readiness
  If score is 85-89: AutoLoop targets the weakest category first

  AutoLoop generates a proposal in autoloop/proposals/ for review.
  Apply kept changes before proceeding to Phase 4.

  SKIP CONDITIONS:
  - Skip if post already scored 95+ in Step 3.1 (diminishing returns)
  - Skip if this is a time-sensitive post that must publish immediately
```

---

### PHASE 4: DISTRIBUTION ASSETS

#### STEP 4.1 — Social Media Content

```
Run: /blog repurpose [file]
Produces:
  → Twitter/X thread (7-9 tweets)
  → LinkedIn article (800-1,200 words)
  → YouTube script (hook + 3-5 talking points + CTA)
  → Reddit post (for relevant subreddit)
  → Email newsletter excerpt (subject + preview + 3 takeaways)
Save to: /clients/{client}/repurposed/{slug}/
```

#### STEP 4.2 — Taxonomy

```
Run: /blog taxonomy suggest [file]
Apply suggested tags and category to post metadata comment block.
```

#### STEP 4.3 — Audio (Pillar posts only — 3,000+ word posts)

```
Run: /blog audio [file] --mode summary
Produces 1-2 minute summary for "Listen to this article" embed.
```

---

### PHASE 5: SAVE & TRACKING

#### STEP 5.1 — Save HTML File

```
Save as: /Blog/clients/{client}/posts/{slug}.html
Format: WordPress code editor HTML (no outer <html>/<head>/<body> wrappers)
File structure (in this exact order):
  1. SEO meta comment block
  2. JSON-LD schema <script> block
  3. <article> content body
```

#### STEP 5.1B — Import to MK Blog Editor (MANDATORY)

```
After saving the HTML file, import the post to the MK Blog Editor platform (Supabase).

Use mcp__supabase-blogeditor__execute_sql to insert the post:
  1. Read the saved HTML file
  2. Parse: SEO fields from comment block, JSON-LD, article body
  3. Get client_id from clients table by slug
  4. INSERT into posts table with all parsed fields
  5. Set status = 'draft' for new posts

IMPORTANT for WordPress clients:
  - HTML body must NOT contain <h1> or author byline
  - Featured image URL goes in featured_image_url column (not in HTML body)

This step ensures every blog post appears in the editor at
https://mk-blog-editor.vercel.app immediately after creation.
Supabase project: pplolmxyagikhhhzruul
```

#### STEP 5.2 — Update CONTENT.md

```
Change status: planned → writing → complete
Fill in URL slug if not already set.
```

#### STEP 5.3 — Update Airtable

```
Call: mcp__airtable__update_records
  Base: appZaD3T174afBSaq
  Table tblyq7MN2svfMrZNy (Requests): Status = "Done", "Completed At" = today (YYYY-MM-DD)
  Table tbl3yijxMg5P58Q6c (Generated): verify row exists with slug + keyphrase
```

#### STEP 5.4 — Update SITEMAP.md

```
Add new post to the correct cluster in SITEMAP.md immediately.
Format: | {slug} | {Full Title} | {primary keyword} |
```

#### STEP 5.5 — Bidirectional Link Scanner

```
After adding to SITEMAP.md, scan all existing post HTML files in /posts/:
  grep -r "topic-related keywords" to find posts that SHOULD link to the new post but don't.

For each existing post that covers a related topic:
  → Note: "Post X should add a link to /blog/{new-slug} in section Y"
  → Output a short list: "Recommended link additions to existing posts"

The user can then decide which to apply. Do not auto-edit existing posts.
This surfaces link opportunities that would otherwise be missed.
```

#### STEP 5.6 — Google Doc Client Tab

```
Read: CLIENT.md → get Document ID from "Client Review Google Doc" field

Format the post for client review (clean readable version — NOT raw HTML):
  → Title (H1)
  → Author + date line
  → Key Takeaways box (as plain bullet list)
  → Full body content (headings preserved, no SVG code, no JSON-LD)
  → FAQ section
  → CTA
  → Note at bottom: "HTML file ready for WordPress upload: {slug}.html"

Create new tab in the document:
  mcp__google-workspace__appendToGoogleDoc with tabId for new content
  Tab name: post title (max 50 chars)

If tab creation is not supported by MCP: append to end of document with
  a clear separator: "═══ POST: {Title} ═══" followed by formatted content.

After adding: get shareable link and confirm doc is accessible.
```

#### STEP 5.7 — Post Score Recording

```
Record quality scores in Airtable for tracking over time:
  mcp__airtable__update_records on tbl3yijxMg5P58Q6c (Generated posts table)
  Fields to update on the generated post row:
    - If "Quality Score" field exists: write the /blog analyze score
    - If field doesn't exist: add a note in the post's Comments field:
      "Quality scores: analyze={X}/100, geo={X}/100, seo_check=PASS/FAIL, factcheck=PASS/FAIL | {date}"

This creates a time-stamped audit trail. When a post is refreshed later,
the score delta shows whether the update improved quality.
```

#### STEP 5.8 — Update Tracking Files

```
After post completion, update all three tracking files:

a. LINK-USAGE.md:
   - Add row to Usage Log: post slug, list of internal link slugs used, date
   - Increment Link Frequency counts for each link used
   - Recalculate Underused Links list (move links from "never used" to frequency table as needed)

b. IMAGE-LOG.md:
   - Add rows for all images used: ID, source, post slug, position, description, date
   - Add image IDs to Banned Image IDs list
   - Log search queries used in Search Query table
   - Update Subject Category Rotation counts

c. EXTERNAL-LINKS.md:
   - Add any new verified external links discovered during this post
   - Update "Last Verified" date for links re-verified during Step 3.6
   - Update Link Usage Tracking counts for all external links used

CRITICAL: These updates must happen BEFORE Section 16 session exit.
Failure to update tracking files defeats the purpose of the dedup system.
```

---

### FINAL DELIVERABLE CHECKLIST

Run before marking any post complete. Every box must be checked.

```
□ /blog analyze score: 90+ / 100
□ /blog seo-check: 0 FAIL items
□ /blog geo score: 80+ / 100
□ /blog factcheck: 0 NOT FOUND statistics
□ Voice consistency check: all persona rules pass
□ FAQ sourced from SERP "People Also Ask" (Step 0.5)
□ Author byline present immediately after H1
□ JSON-LD author is @type: Person (not Organization)
□ HTML file saved to /posts/{slug}.html
□ Social content saved to /repurposed/{slug}/
□ Google Doc tab created with client-readable version
□ Bidirectional link opportunities documented
□ Quality scores recorded in Airtable
□ CONTENT.md status updated to complete
□ Airtable updated (both tables)
□ SITEMAP.md updated with new post
□ AIOSEO panel — ALL green (hard gate, no exceptions):
    Focus keyword in SEO title ✓  |  meta description ✓  |  URL ✓
    introduction (first paragraph) ✓  |  subheadings (30–40% of H2/H3) ✓
    image alt ✓  |  density 0.65%–0.9% ✓
□ All external links verified via WebFetch — no 404s, no connection refused, no domain changes
□ LINK-USAGE.md updated with this post's internal link selections
□ IMAGE-LOG.md updated with all images used (IDs, queries, categories)
□ EXTERNAL-LINKS.md updated with any new verified sources + usage counts
```

---

## SECTION 4: SITEMAP-First Internal Linking (Zero-Tolerance Rule)

```
ABSOLUTE RULE: Every internal link must come from SITEMAP.md.
Do NOT construct URLs from post titles.
Do NOT guess that a URL exists because a post was mentioned.

CRITICAL — NO SAME-BATCH LINKING:
A post may only link to posts that are ALREADY LIVE on the website at the time of writing.
Posts being written in the same session or batch are NOT yet live.
Never link between posts in the same batch — they may go live at different times.
A post is live only when it is in SITEMAP.md AND has been uploaded to WordPress.

Procedure:
1. Open SITEMAP.md
2. Open LINK-USAGE.md → check which links have been overused vs underused
3. Search for topically relevant slugs in SITEMAP.md
4. PRIORITIZE links that appear in LINK-USAGE.md "Underused Links" section
5. AVOID links that have been used 3+ times (check Link Frequency table)
6. Copy the exact slug from SITEMAP.md
7. Confirm the post is already published (not just planned or in-progress)
8. Format using the client's URL pattern (check SITEMAP.md header for format):
   - BreathMastery: /{slug}/ (relative, root level, NO /blog/ prefix)
   - REIG Solar: https://www.reig-us.com/{slug}/ (ABSOLUTE URLs ONLY, full domain required)
   - SDS: /blog/{slug} (relative)
   - LuxeShutters: /blog/{slug} (has /blog/ prefix)
   - Other clients: check SITEMAP.md header for correct format

If a topic is NOT in SITEMAP.md, or is in SITEMAP.md but not yet published:
  Option A: Don't link to it
  Option B: Use a placeholder: <!-- FUTURE LINK: [topic] when published -->
  Option C: Link to the closest existing published post that covers the topic

Never use full domain URLs for internal links. Use relative paths per the client's URL format.

SITEMAP.md only ever contains published posts. Never pre-add planned posts to SITEMAP.md.
```

---

## SECTION 5: WordPress HTML Output Specification

Every .html file must follow this exact structure:

```html
<!-- ============================================================
  SEO META (paste into WordPress SEO plugin — AIOSEO / Yoast)
  SEO Title:        [Title text only. NO char count. 40-60 chars target but do NOT append "(XX chars)" to the value.]
  Meta description: [150-160 chars REQUIRED — exact focus keyword + benefit + stat]
  Focus keyphrase:  [primary keyword]
  URL Slug:         [slug — must contain focus keyword words; stop words may be omitted]
  Canonical:        [full absolute URL — https://domain.com/slug/]
  Featured Image:   [same URL as JSON-LD "image" field — paste into WP sidebar]
============================================================ -->

<script type="application/ld+json">
[
  { "@context": "https://schema.org", "@type": "BlogPosting", ... },
  { "@context": "https://schema.org", "@type": "FAQPage", ... },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", ... }
]
</script>

<article>

<!-- WORDPRESS CLIENTS: Start directly with Key Takeaways. NO <h1> and NO byline paragraph.
     Title goes in the WP post title field. Author is set by WP user/theme.
     NON-WORDPRESS CLIENTS: Include <h1> and byline before Key Takeaways:
     <h1>[Title]</h1>
     <p style="font-size:0.9rem; opacity:0.65; margin-bottom:1.5rem;">
       By <strong><a href="[/about/ URL]">[Author Name]</a></strong>, [Credential]
     </p>
-->

<div class="key-takeaways" style="border-left:4px solid #22c55e; background:rgba(34,197,94,0.08); padding:1.25rem 1.5rem; margin:1.5rem 0; border-radius:0 8px 8px 0;">
  <h3 style="margin-top:0; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.06em; opacity:0.65;">Key Takeaways</h3>
  <ul>
    <li>Takeaway 1 — with statistic and source</li>
    <li>Takeaway 2 — with statistic and source</li>
    <li>Takeaway 3</li>
    <li>Takeaway 4</li>
    <li>Takeaway 5</li>
  </ul>
</div>

[Body content — H2 → H3 hierarchy, no skipped levels]

<section class="faq-section">
  <h2>Frequently Asked Questions</h2>
  <h3>Question?</h3>
  <p>Self-contained answer (40-60 words — complete without reading the rest of the post).</p>
  [5+ Q&A pairs]
</section>

<p><em>Note: [Safety disclaimer — required for health/breathing posts]</em></p>

[CTA paragraph]

<ul>
  <li>Further reading: <a href="/blog/slug-1">Title 1</a></li>
  <li>Further reading: <a href="/blog/slug-2">Title 2</a></li>
  <li>Further reading: <a href="/blog/slug-3">Title 3</a></li>
  <li>Further reading: <a href="/blog/slug-4">Title 4</a></li>
</ul>

</article>
```

### Critical HTML Conventions

| Element | Rule |
|---------|------|
| External links | `target="_blank" rel="noopener noreferrer"` always |
| Internal links | `/blog/slug` — relative path from SITEMAP.md only, never full domain URL |
| Images | `<figure><img loading="lazy" alt="[descriptive]" ...><figcaption>[caption]</figcaption></figure>` |
| SVG charts | `role="img"`, `aria-label`, `<title>`, `<desc>`, transparent bg, `fill="currentColor"` |
| Tables | Always include `<thead>` — required for AI citation detection (+47% citation rate) |
| Key Takeaways | Border-left: 4px solid #22c55e, background: rgba(34,197,94,0.08) |
| Author type in JSON-LD | `"@type": "Person"` — NEVER `"@type": "Organization"` |

---

## SECTION 6: Quality Standards — Non-Negotiable Minimums

| Metric | Tool | Minimum | Hard Floor |
|--------|------|---------|------------|
| Overall score | `/blog analyze` | 90/100 | Never save below 85 |
| Content quality | `/blog analyze` | 26/30 | Answer-first + depth |
| SEO | `/blog analyze` | 22/25 | Heading hierarchy + links |
| E-E-A-T | `/blog analyze` | 12/15 | Named author + 8+ Tier 1 sources |
| Technical | `/blog analyze` | 12/15 | Schema + OG + images |
| AI citation | `/blog analyze` | 12/15 | Answer-first + FAQ + tables |
| SEO checklist | `/blog seo-check` | 0 FAIL | All items pass or WARN |
| GEO / AI citation | `/blog geo` | 80/100 | — |
| Factcheck | `/blog factcheck` | 0 NOT FOUND | All statistics verified |
| Word count | — | 2,000+ how-to; 3,000+ pillar | — |
| Internal links | — | 3-5 | All from SITEMAP.md |
| External links | — | 3-5 | Tier 1-3 only |
| Images | — | 2-3 | Alt text + figcaption on every image |
| SVG charts | — | As many as needed | Each SVG = separate Raw HTML / Custom HTML block |
| FAQ pairs | — | 5+ | 40-60 words each, self-contained |
| Further reading | — | 4 links | None duplicating body links |

---

## SECTION 7: Anti-AI Detection Protocol (MonteKristo AI Company-Wide Standard)

**Source of truth:** `~/Documents/MonteKristo Vault/skills/content-quality.md`
**This section overrides all other content rules when they conflict.**

Every piece of content must pass one test: **a skeptical reader with AI detection experience should not suspect AI involvement at any point.** Not a single sentence, not a single phrase, not a single structural pattern. This is the core differentiator of MonteKristo AI.

Run this check before saving any post. Post FAILS if any of these are present.

### Banned Vocabulary (Zero Tolerance - Instant Fail)

**Category: Filler hedges**
"It's important to note that", "It's worth mentioning", "It should be noted"

**Category: AI enthusiasm**
"Exciting", "Groundbreaking", "Revolutionary", "Game-changing", "Cutting-edge"

**Category: Empty intensifiers**
"Incredibly", "Extremely", "Absolutely", "Truly", "Highly", "Significantly"

**Category: AI transitions**
"Furthermore", "Moreover", "Additionally", "In addition", "That being said"

**Category: AI closers**
"In conclusion", "To sum up", "To summarize", "Overall", "At the end of the day"

**Category: AI openers**
"In today's world", "In the ever-evolving", "In the realm of", "When it comes to"

**Category: AI qualifiers**
"It's crucial to", "It's essential to", "It's vital to", "It's imperative to"

**Category: Overused pairs**
"Robust and scalable", "Seamless and efficient", "Comprehensive and intuitive"

**Category: Corporate fluff**
"Leverage", "Utilize", "Optimize", "Streamline", "Empower", "Harness"

**Category: AI list headers**
"Here are X ways to...", "Top X tips for...", "X things you need to know"

**Category: False depth**
"Delve into", "Navigate the complexities", "Unpack", "Unravel", "Dive deep"

**Category: Legacy banned (original list)**
delve, tapestry, nuanced, realm, landscape, multifaceted, pivotal, facilitate, elucidate, robust, seamless, transformative, innovative (generic), dynamic, agile, game-changer, unlock (metaphorical), revolutionize, crucial

### Banned Opening Patterns

- "In today's [fast-paced/digital/modern] world..."
- "Let's dive into..." / "Let's explore..." / "Let's take a closer look..."
- "Whether you're a beginner..."
- "This is something we all..."
- "Here's the thing..."
- "What is X? X is..." (definition-then-explanation opener)
- Any opener starting with a present participle clause ("Leveraging our expertise, we...")

### Banned Structural Patterns

- "It's not just X, it's Y" / "X isn't just about Y, it's about Z" (AI contrastive)
- "Not only X but also Y" / "Goes beyond X" / "More than just X"
- Conclusions that restate previous points without adding new synthesis
- "Now that we've covered X, let's move on to Y" (generic transition)
- Any sentence starting with a present participle clause followed by a main clause

### Structural AI Tells (Flag and Fix)

| Tell | Fix |
|------|-----|
| Em dashes (--) anywhere in post | **ZERO em dashes. Replace with comma, colon, period, or parentheses. Rewrite if needed. Company-wide rule.** |
| Symmetrical 3-item lists in every section | Vary to 2, 4, 5, or 7 items |
| Every paragraph the same length | Mix 1-sentence paragraphs with 4-sentence ones. No two consecutive paragraphs within 15% of each other's word count. |
| Every H2 section same word count | Vary sections: 150-400 words each |
| No rhetorical questions in body | Add 1-2 |
| No contractions (general audience posts) | Add naturally |
| Uniformly positive tone | Real experts have frustrations, caveats, trade-offs. Pick a side. |
| Present both sides then conclude "it depends" | Take a clear stance |
| 3+ consecutive sentences starting same way | Rewrite the third |
| Same sentence rhythm for 3+ sentences | Vary length aggressively |
| More than 1 exclamation mark per 1,000 words | Remove excess |

### Advanced Anti-AI Checks (2026 Detection Research)

**Burstiness Check:**
Sentence length coefficient of variation must be > 0.5 (human baseline: 0.4+, AI baseline: <0.3). Mix 3-word fragments with 35-word complex sentences. Never allow 3+ consecutive sentences within 5 words of each other in length.

**Copula Audit:**
Search for "serves as", "boasts", "features", "represents", "offers" when "is" or "has" would be simpler. AI avoids simple copular verbs; humans use them freely.

**Present Participle Audit:**
Flag sentences with 2+ present participle clauses (AI uses them at 2-5x the human rate). "Leaning on X, dancing around Y, evading Z" is a clear AI tell.

**Entropy Boost:**
Use unexpected word choices. Vary complexity deliberately. Mix domain-specific jargon with casual language. Human text: 4.5-5.5 bits/character entropy. AI text: 3.5-4.0.

**Expertise Injection:**
Every piece must contain at least 3 claims that could ONLY come from genuine domain experience: specific numbers, named tools, real incident references, practitioner shortcuts. Information not available in general AI training data.

### Human Signal Requirements

- Burstiness: 1-sentence paragraphs mixed with 3-4 sentence paragraphs (high variance)
- TTR (Type-Token Ratio): > 0.40 vocabulary diversity
- At least 1 "we tested" / "in practice" / "in the field" signal where appropriate to voice
- At least 2 specific named entities (person, institution, product, standard) per H2 section
- At least 3 domain-expertise claims per post that could not come from generic AI training data
- No two consecutive paragraphs within 15% of each other's word count

### Quality Checkpoints (Before ANY Content Goes Public)

1. **Read it aloud.** Does it sound like a person talking to a peer? Or a corporate brochure?
2. **The colleague test.** Would you forward this to a smart colleague without disclaimers?
3. **The banned word scan.** Ctrl+F for every term in the banned lists above. Zero hits required.
4. **The opening test.** Cover the byline. Can you tell which human expert wrote this?
5. **The paragraph diversity test.** Are any two consecutive paragraphs the same length (within 10 words)? Rewrite one.
6. **The opinion test.** Does the piece take at least one clear stance some readers might disagree with?

---

## SECTION 7B: Readability Standards

These apply to every post at every stage. Check before delivery.

### Hard Rules

| Rule | Target |
|------|--------|
| Flesch Reading Ease | ≥ 60 |
| Transition word coverage | 30–50% of sentences begin with or contain a transition word |
| Consecutive same-word sentence openers | Max 2 in a row, rewrite the third |
| Words between subheadings | Max 300. Add an H3 if a section runs over |

### Sentence Rules (apply every sentence)

- One main idea per sentence. Long sentences with multiple clauses → split into 2–3.
- Active voice by default. Passive voice only when the subject is genuinely unknown.
- Short and medium sentences dominate. Reserve long sentences for deliberate rhythm, not density.
- Avoid stacked modifiers: "highly effective evidence-based long-term regulation strategy" → rewrite.
- Define technical terms in plain English the first time they appear, inline, in parentheses or a follow-on sentence.

### Word-Level Rules

- Prefer simple common words over formal or academic equivalents.
  Examples: "use" not "utilize", "show" not "demonstrate", "help" not "facilitate"
- No filler, no corporate phrasing, no abstract nouns where a concrete noun works.
- Jargon that the target reader already knows is fine. Jargon they don't know must be explained.

### Transition Word Targets

Use a mix of these categories, not just "however" and "additionally":

| Category | Examples |
|----------|---------|
| Addition | also, and, besides, in addition, moreover |
| Contrast | but, however, yet, although, on the other hand, in contrast |
| Cause/Effect | so, therefore, as a result, consequently, this is why |
| Sequence | first, then, next, finally, after that |
| Emphasis | in fact, indeed, specifically, notably |
| Example | for example, for instance, such as, specifically |
| Concession | even so, granted, admittedly, of course |

---

## SECTIONS 8-10: Reference Docs (Read On Demand Only)

→ **MCP tools:** read `/Blog/REFERENCE.md` — section "MCP Reference" when needed mid-session
→ **Per-client voice detail:** read `/Blog/REFERENCE.md` — section "Per-Client Voice" (brief.json covers routine use)
→ **Airtable sync protocol:** read `/Blog/REFERENCE.md` — section "Airtable Sync" at Step 5.3

---

## SECTION 11: Monthly Maintenance Tasks

→ Full procedures in `/Blog/MAINTENANCE.md`. Read it when running monthly tasks.

**Quick reference:**

| Task | Tool / Method | Cadence |
|------|---------------|---------|
| Full site health scan | `/blog audit` | Monthly |
| Keyword cannibalization check | `/blog cannibalization` | Monthly |
| Stale content detection | `/blog calendar` | Monthly |
| Strategic cluster review | `/blog strategy` | Quarterly |
| CMS taxonomy sync | `/blog taxonomy sync` | After each batch of 5+ posts |
| Content freshness scan | Step M.1 in MAINTENANCE.md | Monthly |
| Pillar page auto-detection | Step M.2 in MAINTENANCE.md | Monthly |
| Link gap report | Step M.3 in MAINTENANCE.md | Monthly |
| Image alt text audit | Step M.4 in MAINTENANCE.md | Monthly |
| Broken link monitor | Step M.5 in MAINTENANCE.md | Monthly |

---

---

## SECTION 12: New Client Onboarding

→ Full file templates in `/Blog/ONBOARDING.md`. Read it when onboarding a new client.

Steps:
1. Create `/Blog/clients/{kebab-name}/`
2. Copy 6 file templates from ONBOARDING.md: CLIENT.md, STYLE.md, BRAND.md, FEEDBACK.md, CONTENT.md, SITEMAP.md
3. Run: `/blog persona create {name}`
4. Add client to Active Clients table in Section 2

---

## SECTION 13: File Templates

→ All templates in `/Blog/ONBOARDING.md`.

---

## SECTION 14: Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Client folders | kebab-case lowercase | `reig-solar`, `breathmastery` |
| Persona files | same as client folder | `reig-solar.json` |
| URL slugs | lowercase hyphens, no domain | `/blog/topic-name` |
| HTML post files | slug only | `topic-name.html` |
| Dates | ISO 8601 | `2026-03-29` |
| Status values | exact lowercase | `planned`, `writing`, `published` |
| Repurposed content | `/repurposed/{slug}/` | `/repurposed/breathwork-101/` |

---

## SECTION 15: SVG Chart Reference

→ Full specs in `/Blog/SVG-REFERENCE.md`. Read it when creating charts.

**Quick:** transparent bg · `fill="currentColor"` · `role="img"` · `aria-label`+`<title>`+`<desc>` · viewBox `0 0 560 380`
**Colors:** Orange `#f97316` · Blue `#38bdf8` · Purple `#a78bfa` · Green `#22c55e`
**Types (never repeat):** Horizontal bar · Grouped bar · Donut · Line · Lollipop · Area · Radar

---

---

## SECTION 16: Session Exit Protocol (Mandatory Before Ending Any Session)

```
Run this section BEFORE ending every session, without exception.
This is what keeps the system coherent across context windows.

---

STEP 16.0 — Capture patterns and decisions (optional — 30 seconds if applicable)

  Skip this step if nothing notable happened this session.

  If a REUSABLE SOLUTION was discovered (e.g., "adding X to section Y improved geo by Z points"):
    Append to /Blog/patterns.md:
      ## P-NNN | {short title} ({date})
      **Problem:** {what failed or was inefficient}
      **Solution:** {what fixed it}
      **Evidence:** {score change, test result, or reasoning}
      **Conditions:** {when to apply this pattern}

  If a SIGNIFICANT EDITORIAL OR TECHNICAL DECISION was made:
    Append to /Blog/decisions.md:
      ## D-NNN | {short title} ({date})
      **Decision:** {what was decided}
      **Why:** {reasoning}
      **Revisit:** {condition under which to reconsider}

  Use the next available number (check the highest existing P-NNN or D-NNN and increment).
  Only log things that are non-obvious and would genuinely help a future session.
  Do NOT log things already in CLAUDE.md or the existing patterns/decisions files.

---

STEP 16.1 — Determine exit state

  If currently mid-post (any phase in Section 3 incomplete):
    exit_state = "interrupted"
    Identify the last completed phase (0-4 from Section 3).
    Update blog-progress.json → clients["{client}"].wip:
      {
        "slug": "{post slug}",
        "phase": "{last completed phase, e.g. phase-1-outline}",
        "started_at": "{today}"
      }

  If the current post was fully completed (Section 3 final checklist passed):
    exit_state = "clean"
    Update blog-progress.json → clients["{client}"].wip = null
    Update blog-progress.json → clients["{client}"].last_completed = "{slug}"

  If no post was worked on this session:
    exit_state = "clean"

---

STEP 16.2 — Update blog-tasks.json for all tasks touched this session

  ⚠️ HARD RULE — A task may ONLY be set to status "done" when ALL of the following are true:
    - quality_scores.analyze ≥ 88 (hard floor; target is 90)
    - seo_check: "pass" (0 FAIL items)
    - All external links verified via STEP 3.6
    - All AIOSEO hard gates confirmed green (keyword in first paragraph, density 0.65–0.9%, etc.)
  If ANY condition is unmet → set status to "needs-review" and document the gap in last_error.
  Do NOT mark "done" mid-cron-session just because writing is complete.

  For each task COMPLETED this session:
    Find the task in blog-tasks.json by id (Airtable ID).
    Update ONLY these fields:
      status:             "done"
      passes:             true
      completed_at:       "{today YYYY-MM-DD}"
      generated_post_id:  "{Airtable ID from generated posts table}"
      slug:               "{url slug}"
      quality_scores:     {"analyze": X, "geo": X, "seo_check": "pass/fail", "factcheck": "pass/fail"}
      total_analyze_runs: {current value + N runs this session}
    DO NOT modify: id, title, keyword, priority.

  For each task BLOCKED (quality gate failed after 2 cycles) this session:
    status:       "blocked"
    passes:       false
    retry_count:  {increment by 1}
    last_error:   "{brief description, e.g. analyze score 78 after 2 cycles on 2026-03-29}"
    → See Section 17 for recovery.

  For the task currently IN PROGRESS (if wip is not null):
    status:  "processing"  ← already set at startup; leave as-is

---

STEP 16.3 — Append session entry to blog-progress.json

  Append to sessions array:
  {
    "session_id": "{YYYY-MM-DD}-{NNN}",
    "date": "{today}",
    "client": "{client-name}",
    "tasks_completed": ["{airtable-id-1}", "{airtable-id-2}"],
    "posts_written": ["{slug-1}", "{slug-2}"],
    "exit_state": "{clean|interrupted|error}",
    "notes": "{1-2 sentence summary: what was done, any blockers, what next session should know}"
  }

  session_id format: date (YYYY-MM-DD) + hyphen + 3-digit counter starting at 001.
  If multiple sessions on the same day: check existing entries and increment counter (001, 002...).

---

STEP 16.4 — Update next_priority pointer

  If exit_state = "clean" (post completed):
    In blog-tasks.json for this client, find the task with the lowest priority number
    where status = "queued".
    Set blog-progress.json → clients["{client}"].next_priority = that task's id.
    Increment blog-progress.json → clients["{client}"].posts_completed_total by 1.

  If exit_state = "interrupted":
    Leave next_priority unchanged — wip already points to the resumption target.

---

STEP 16.5 — Trim sessions array (keep rolling 20)

  If sessions array has more than 20 entries: remove the oldest (index 0).

---

STEP 16.6 — Finalize

  Set blog-progress.json → last_updated = "{today}"

  Confirm out loud before ending:
    ✓ last_updated is today
    ✓ If post completed: wip is null, last_completed is updated, posts_completed_total incremented
    ✓ If interrupted: wip contains slug and phase
    ✓ blog-tasks.json status is updated for all touched tasks
    ✓ A new session entry exists in sessions array for this session

---

STEP 16.7 — Schedule WordPress post (REIG Solar)

  After every REIG Solar post is uploaded to WordPress as draft, immediately schedule it.

  RULE: Every completed post must be scheduled for the next available Wednesday or Friday
  after the previously scheduled post, at 23:30 EST (04:30 UTC next day).

  Algorithm:
  1. Check the last scheduled post date from CONTENT.md (most recent "scheduled" or "complete" entry).
  2. Find the next Wednesday or Friday after that date (whichever comes first).
  3. Schedule via WP REST API (curl — no n8n needed):

     curl -s -X POST "https://www.reig-us.com/wp-json/wp/v2/posts/{WP_ID}" \
       -H "Content-Type: application/json" \
       -u "Alex:dYvD JomZ PBwJ p4QR mVlx 0zqU" \
       -d '{"status":"future","date":"{YYYY-MM-DDT23:30:00}","date_gmt":"{YYYY-MM-DDT04:30:00}"}'

     Note: date_gmt = date + 1 day at 04:30 (EST = UTC-5, so 23:30 EST = 04:30 UTC next day).

  4. Confirm response has "status": "future" before proceeding.
  5. Record scheduled date in CONTENT.md notes column for that post.

  Current schedule tail (update this after each new post):
    sre 29. apr 2026 → blog25 DAS Networking (last scheduled)
    Next available: pet 1. maj 2026 at 23:30 EST
```

---

## SECTION 17: Error Recovery Protocol

```
Use this section when a post cannot be completed normally.

---

CASE A — Quality gate failure (analyze score below floor after 2 cycles)

  Definition: /blog analyze ran twice and score is still below 85.

  Steps:
  1. In blog-tasks.json → find this task:
       status:      "blocked"
       passes:      false
       retry_count: {current value + 1}
       last_error:  "analyze score {X} after 2 cycles on {date}. Gaps: {list main issues}"

  2. In blog-progress.json → clients["{client}"].wip:
       { "slug": "{slug}", "phase": "phase-3-quality-blocked", "started_at": "{today}" }

  3. Append to blog-progress.json → error_log:
       { "date": "{today}", "client": "{client}", "task_id": "{id}", "error": "{description}" }
     Keep error_log to 10 entries max — remove the oldest if needed.

  4. Write session exit entry per Section 16 with exit_state: "error" and descriptive notes.

  5. Do NOT delete the post file. Leave it in /posts/.

---

CASE B — Resuming a blocked post in a new session

  At session startup (STARTUP-B), if wip.phase = "phase-3-quality-blocked":
    → Read the post from /posts/{slug}.html
    → Read blog-tasks.json for this task → check last_error to understand what failed
    → Apply targeted fixes for the specific issues named in last_error
    → Run /blog analyze once (this is cycle 3 — allowed as recovery attempt)
    → If score 85+: continue to Phase 4 and complete normally. Update status to "done", passes to true.
    → If still below 85: flag to user. Set status: "blocked" again. Do not continue alone.

---

CASE C — Session interrupted mid-task (non-quality issue)

  Normal WIP recovery — handled automatically by Section 1 STARTUP-B.
  Next session reads wip.phase and resumes from that point.

---

CASE D — Airtable sync failure (Section 5.3 fails)

  Steps:
  1. Complete all local file saves first: HTML file, CONTENT.md, SITEMAP.md, Google Doc tab.
  2. Append to blog-progress.json → error_log:
       { "date": "{today}", "type": "airtable_sync", "task_id": "{id}", "error": "{message}" }
  3. At the START of the next session for this client:
     Before picking new work, check error_log for entries with type "airtable_sync".
     Retry those Airtable updates first.
     Remove the entry from error_log once successfully synced.
```

---

## Verification: The System Is Level 10 When

- [ ] `/blog write [topic]` autonomously produces 90+ score without manual fixes
- [ ] All internal links in any generated post match SITEMAP.md slugs exactly
- [ ] Every post deliverable includes: HTML file + social content folder + Airtable updated
- [ ] REIG Solar matches BreathMastery: CONTENT.md ✓ SITEMAP.md ✓ persona ✓
- [ ] Monthly `/blog audit` runs without manual setup and produces actionable report
- [ ] Any new session for either client can start first post within 2 minutes of loading context
- [ ] `/Blog/blog-progress.json` wip is null at the start of every new session (clean handoff)
- [ ] Section 16 session exit protocol runs before every session end (no session ends silently)
