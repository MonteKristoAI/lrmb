# LuxeShutters — Blog Client Overview

**Company:** LuxeShutters
**Owners:** Chris & Campbell
**Location:** Temora, NSW, Australia (Riverina region)
**Website:** luxeshutters.com.au
**Phone:** 1800-465-893
**Email:** admin@luxeshutters.com.au
**Status:** Pre-launch — blog infrastructure must be built first

---

## Mission & Identity

LuxeShutters supplies and installs premium window furnishings across the Riverina region of NSW. They are a CWGlobal dealer offering Australian-manufactured products including plantation shutters, roller blinds, venetian blinds, vertical blinds, panel glides, VersaDrapes, dual shades, curtains, zipscreens, awnings, security roller shutters, and louvre roofs.

Chris and Campbell handle every project from initial measure to final installation. They know every product by name, material, and price point. This hands-on expertise is the foundation of blog authenticity.

**Service area:** Temora, Wagga Wagga, Griffith, Cootamundra, Young, West Wyalong, Narrandera, Leeton, and surrounding Riverina towns (~160,000 population in service radius).

---

## CMS Platform

**FINAL ARCHITECTURE: Static HTML Blog + Cloudflare Workers Reverse Proxy (Subfolder)**

Static HTML blog in a separate GitHub repo, served at `luxeshutters.com.au/blog/*` via Cloudflare Workers reverse proxy. This gives SUBFOLDER SEO benefits (25% better organic growth than subdomains per Semrush) with complete separation from the main React SPA.

### Why This Beats Every Alternative

| vs. | Why static HTML + CF Worker wins |
|-----|--------------------------------|
| WordPress | No PHP/MySQL, no security patches, no plugins, no hosting cost, 10x faster TTFB |
| Subdomain (blog.luxeshutters.com.au) | Subfolder shares domain authority, consolidates link equity, 25% better traffic |
| React SPA + prerender | Zero pre-rendering risk, guaranteed Google indexation, no JS dependency |
| Astro | Simpler, fewer dependencies, Blog Agent already outputs HTML |

### Architecture
```
luxeshutters.com.au/blog/*  →  CF Worker proxy  →  luxeshutters-blog.pages.dev
luxeshutters.com.au/*       →  Main React SPA (unchanged)
```

- **Blog repo:** `MonteKristoAI/luxeshutters-blog` (separate GitHub repo)
- **Deploy:** Cloudflare Pages (auto-deploy on push to main)
- **Proxy:** Cloudflare Worker at luxeshutters.com.au routes `/blog/*` to blog Pages project
- **Output:** Pure static HTML files, zero JavaScript required, guaranteed SEO indexation
- **Build:** Node.js script auto-generates index page, sitemap.xml, RSS feed from post files
- **Cost:** Free (Cloudflare Pages free tier + Workers free tier)

### Blog Output Format
MonteKristo Blog Agent writes posts as self-contained HTML files (same as WordPress pipeline output format). Build script wraps each post in site template (header, nav, footer, schema, breadcrumbs, CTA components) and generates all supporting files.

### URL Structure
```
/blog/                                          → Blog index (listing page)
/blog/plantation-shutters-cost-australia/        → Individual post
/blog/sitemap.xml                               → Blog sitemap
/blog/rss.xml                                   → RSS feed
```

### Build Script Auto-Generates
1. `/blog/index.html` - paginated listing of all posts (newest first)
2. `/blog/sitemap.xml` - all blog URLs with lastmod dates
3. `/blog/rss.xml` - RSS feed for subscribers
4. Wraps each post HTML in shared template with header, nav, footer, schema
5. Processes images (WebP conversion, responsive srcset)

**HARD RULE:** Blog platform must be live and verified (GSC fetch-and-render test on first post) BEFORE any content is written.

---

## Author & E-E-A-T

**Author byline:** By Chris & Campbell, LuxeShutters — Temora, NSW

**Author bio:**
Chris and Campbell are the founders of LuxeShutters, based in Temora in the NSW Riverina. As CWGlobal dealers, they work with Australian-manufactured shutters, blinds, curtains, and outdoor products. They handle every project personally, from the first measure to the final installation, across towns from Wagga Wagga to Griffith and everywhere in between.

**E-E-A-T signals to include:**
- CWGlobal dealer status (Australian manufacturer)
- Window Shading Association of Australia (WSAA, formerly BMAA) reference
- Housing Industry Association (HIA) reference where relevant
- Real installation photos from Riverina projects
- Google Business Profile with 16+ real reviews
- ABN, physical showroom in Temora, 1800 number
- Anonymized real pricing from actual CWGlobal price lists

**Industry body:** Window Shading Association of Australia (WSAA) — offers Certificate III in Blinds, Awnings, Security Screens and Grilles

---

## Blog Strategy Summary

Full strategy: `/Blog/clients/luxeshutters/BLOG-STRATEGY-V3.md`

### 5 Content Clusters (48 posts Year 1)
1. **Plantation Shutters** (9 posts) — highest margin product, hub-and-spoke
2. **Local & Regional + Case Studies** (15 posts) — the competitive moat, zero competition
3. **Blinds, Curtains & Other Products** (12 posts) — mid-funnel comparisons
4. **Energy, Climate & Sustainability** (5 posts) — topical authority
5. **Buying Guides & Bottom-of-Funnel** (7 posts) — direct conversion

### Content Mix
- 40% Local/Regional + Case Studies (fastest to rank, highest conversion)
- 30% Product Comparisons & Buying Guides (mid-funnel)
- 20% Informational/Educational (authority, AI citability)
- 10% Bottom-of-Funnel (direct conversion)

### Revenue Tiers
- **Tier A:** Direct lead generation posts (cost guides, case studies, consultation process)
- **Tier B:** Consideration support (comparisons, buying guides)
- **Tier C:** Authority/traffic builders (energy efficiency, trends, how-tos)

### Publishing Cadence
- Phase 1 (Months 1-3): 14 posts — Clusters 1, 2, 5 only (focused)
- Phase 2 (Months 4-6): 14 posts — Add Clusters 3 & 4
- Phase 3 (Months 7-12): 20 posts — Complete all clusters
- Ongoing: 3 posts/month (2 new + 1 refresh)

---

## Competitors (Content Landscape)

### Local (Riverina) — NO blog content exists
| Competitor | Notes |
|-----------|-------|
| Apollo Blinds (Wagga/Griffith) | 20+ years, zero blog |
| Watson Blinds (Wagga) | 50+ years, zero blog |
| Riverina Interiors (Wagga) | Thin website, zero blog |
| Kotzur Blinds (Wagga/Albury) | Product pages only |
| Dollar Curtains + Blinds (national chain) | National blog, not localized |

### National — Blog content exists but no Riverina coverage
| Competitor | Weakness |
|-----------|----------|
| ABC Blinds (WA) | WA-only content |
| Luxaflex | Aspirational, not practical |
| Classic Blinds (Sydney) | Sydney metro only |

**Competitive advantage:** Total content vacuum in the Riverina. First-mover advantage of 12-18 months.

---

## SERP Reality: Blog vs Service Pages

| Query Type | Google Shows | Our Strategy |
|-----------|-------------|-------------|
| "[product] [town]" | Maps pack + business listings | Service area pages (NOT blog) |
| "[product] cost" | Blog + product pages | Blog posts |
| "how to [action]" | Blog + YouTube | Blog + video companion |
| "[A] vs [B]" | Blog posts dominate | Blog posts (prime territory) |
| "best [product] for [use]" | Blog + product pages | Blog posts |

---

## CTAs (Tiered by Content Type)

| Post Type | CTA | Mechanism |
|-----------|-----|-----------|
| Bottom-funnel | "Book Your Free Consultation" | Consultation form → GHL |
| Commercial/comparison | "Get a Free Quote" | Quote form or web widget → GHL |
| Informational | "Download Our Free Buying Guide" | Email capture → GHL tag |
| Case study | "Call 1800 465 893" | Phone (tracked) |

**GHL Lead Source:** `Website Blog` in custom field `augA5eQDHNYvuppnwPHo`
**Lead Source Detail:** Post slug in Notes field

---

## CRITICAL PRE-LAUNCH: Chris Voice Corpus

**Before writing Post #1, conduct a 30-minute recorded call with Chris covering:**

1. "Walk me through your last three installations. What happened, what was tricky, what did the homeowner ask?"
2. "What is the number one mistake people make when choosing shutters?"
3. "If someone calls you tomorrow and says they are building a new home in Wagga, what do you tell them?"
4. "What do you think about PVC vs basswood? What do you actually recommend and why?"
5. "What products do you personally like installing the most? Why?"
6. "What is the weirdest or trickiest window you have ever had to fit?"

Transcribe this. Extract:
- Chris's actual vocabulary (does he say "shutters" or "plantation shutters"?)
- His sentence patterns and length
- Verbal tics, phrases he repeats
- How he explains technical concepts to homeowners
- Specific product names he reaches for first
- Stories and anecdotes he naturally tells

Save to: `/Blog/clients/luxeshutters/CHRIS-VOICE-CORPUS.md`

This corpus is the ground-truth calibration for ALL blog content. Every post is checked against: "Could Chris have plausibly said this?"

---

## Content Production Workflow

| Role | Person | Responsibilities |
|------|--------|-----------------|
| Writer | MonteKristo AI (Blog Agent) | Writes, SEO optimizes, formats |
| SME | Chris & Campbell | Reviews technical accuracy, provides pricing |
| Photos | Chris & Campbell | Takes installation photos per SOP |
| Approver | Chris (48h SLA, auto-publish for non-case-studies) |
| Publisher | MonteKristo AI | Commits to repo, triggers deploy |

### "Chris Does Nothing" Contingency
Phase 1 posts (Months 1-2) require ZERO photos and ZERO Chris input beyond the initial voice corpus call. Case studies start in Month 3 only after photo pipeline is validated. If Chris goes dark for 6+ weeks, the editorial calendar shifts to non-photo-dependent posts (comparisons, buying guides, energy content).

---

## Photo Pipeline (5-Layer System)

Chris photo capture has a ~15-20% probability of sustained compliance over 12 months. The system must produce visual content even when Chris takes zero photos.

### Layer 1: Chris captures (primary, when it happens)
- One-tap shortcut on phone home screen → opens camera → auto-uploads to Google Drive with GPS tag
- Target: 3+ sets/month. Realistic expectation: 1-2 sets/month after initial enthusiasm fades.

### Layer 2: Google Reviews with photos
- Encourage every customer to post a Google Review WITH photo (offer $20 gift card)
- These photos are public, citable, and build GBP simultaneously
- Target: 2+ photo reviews/month

### Layer 3: CWGlobal manufacturer photos
- CWGlobal has professional product photography for their entire range
- Use manufacturer photos for product comparison and buying guide posts (with permission)
- Reserve real installation photos exclusively for case studies

### Layer 4: Quarterly MonteKristo on-site visit
- Once per quarter, visit 2-3 active installations for professional photos/video
- 4 visits/year = 8-12 photo sets guaranteed, regardless of Chris participation
- Also captures short iPhone video clips for YouTube

### Layer 5: Google Street View before/after
- For exterior shots (outdoor blinds, zipscreens, awnings): Google Street View of address (before) + one post-installation photo (after)
- Creates compelling content with only ONE photo needed from Chris

MonteKristo processes: download from Drive → convert to WebP (1200px max) → commit to blog images folder → update markdown frontmatter.

---

## Measurement Stack

**Level 1000 insight:** At 5-15 consultations/month, you CANNOT statistically measure blog-to-consultation attribution with confidence. Use leading indicators instead.

| Tool | Purpose |
|------|---------|
| Google Analytics 4 | Traffic, engagement, CTA clicks |
| Google Search Console | Impressions, clicks, keyword rankings (PRIMARY metric) |
| GHL Dashboard | Consultations with "how did you hear about us" field |
| Dedicated phone number | Blog-only 1300 number ($5-15/month) for clean phone attribution |
| Monthly Report (MonteKristo) | Consolidated performance review |

### What to Actually Measure (Leading Indicators)
1. **GSC impressions and clicks** (available immediately, statistically reliable)
2. **Branded search volume** increase month-over-month
3. **"How did you hear about us?"** on every consultation form (qualitative)
4. **Total organic traffic growth** as % of all traffic
5. **Blog-specific phone number** call count

### Decision Triggers
- 0 keywords in top 50 after 3 months → audit technical SEO + indexation
- Keywords ranking but 0 consultations after 4 months → audit CTAs + phone attribution
- One cluster outperforms by 3x → double down on that cluster
- Post gets 0 traffic after 60 days → rewrite title/meta, resubmit to GSC
- Branded search increases 20%+ → blog is working (indirect attribution)

---

## Content Decay Protocol

| Trigger | Action | Timeline |
|---------|--------|----------|
| CWGlobal new price list | Refresh all pricing posts | Within 2 weeks |
| New product added to range | Create new post | Within 30 days |
| Annual trends post | Publish updated version | January each year |
| Post traffic declines 30%+ | Content refresh | Within 2 weeks of detection |
| Any post older than 6 months | Review for accuracy | Rolling monthly check |

---

## Entity Definition (Required on Every Post)

> LuxeShutters is a window furnishing company based in Temora, NSW, serving the Riverina region of Australia. Owned by Chris and Campbell, LuxeShutters supplies and installs plantation shutters, blinds, curtains, zipscreens, awnings, and louvre roofs from CWGlobal's Australian-manufactured range.
