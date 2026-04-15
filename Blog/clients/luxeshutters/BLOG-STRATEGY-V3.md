# LuxeShutters Blog Strategy V3

*Rebuilt after Level 10 critic review (42/100). Addressed: blog architecture, SERP validation, production workflow, revenue modeling, cluster focus, conversion path, measurement stack, defensibility.*

---

## 1. Business Context

**Company:** LuxeShutters — premium window furnishings
**Location:** Temora, NSW (pop. ~5,000) serving Riverina region (~160,000)
**Website:** luxeshutters.com.au (React + Vite + Tailwind on Cloudflare Pages)
**Products:** Plantation shutters, roller blinds, venetians, vertical blinds, panel glides, VersaDrapes, dual shades, curtains, zipscreens, awnings, security roller shutters, louvre roofs
**Supplier:** CWGlobal (Australian manufacturer) — 17 product types with real pricing
**Owners:** Chris & Campbell (measure + install every project)
**Current blog:** Empty — Blog.tsx is a static card grid, no individual post routes

---

## 2. SERP Reality Check

Before writing content, we validated what Google actually shows for target queries:

| Query Type | What Google Shows | Strategy |
|-----------|------------------|----------|
| "[product] [town]" (e.g. "shutters wagga wagga") | Google Maps pack + business listings | **Service area pages** on main site, NOT blog posts |
| "[product] cost Australia" | Mix of service pages + blog posts | Blog posts viable, but need high content quality |
| "how to [action] [product]" | Blog posts + YouTube videos | Blog posts + video companion |
| "[product A] vs [product B]" | Blog posts dominate | Prime blog territory |
| "best [product] for [use case]" | Blog posts + product pages | Blog posts with product links |
| "[product] energy efficiency" | Blog posts + government sites | Blog posts with data/stats |

**Key insight:** Local product+town queries go to **service area pages**, not blog. Blog targets informational, comparison, and consideration-stage queries. The blog's job is to build topical authority, earn trust, and capture people BEFORE they search for "[product] [town]."

---

## 3. Blog Architecture (Technical — Must Build First)

### Data Source: Markdown Files in Repository
Blog posts are `.md` files in `/src/content/blog/` with YAML frontmatter. Versioned with git, no external CMS dependency.

```
src/content/blog/
├── plantation-shutters-cost-riverina.md
├── shutters-vs-roller-blinds.md
├── temora-extreme-climate-window-treatments.md
└── ...
```

### Frontmatter Schema
```yaml
---
title: "How Much Do Plantation Shutters Cost in the Riverina? (2026)"
slug: "plantation-shutters-cost-riverina"
description: "Real pricing from a local Riverina installer..."
author: "Chris & Campbell"
date: "2026-05-15"
updated: "2026-05-15"
category: "Plantation Shutters"
tags: ["pricing", "plantation shutters", "riverina"]
image: "/blog/plantation-shutters-cost-hero.webp"
imageAlt: "Plantation shutters installed in a Temora home"
readTime: 8
schema: ["BlogPosting", "FAQPage"]
revenueTier: "A"
cluster: "shutters"
---
```

### React Components Needed
1. `BlogPost.tsx` — renders individual post from markdown (gray-matter + react-markdown)
2. `BlogIndex.tsx` — replace current Blog.tsx card grid with real post data
3. `BlogLayout.tsx` — shared layout: breadcrumbs, sidebar, related posts, CTA
4. `RelatedPosts.tsx` — shows 3 posts from same cluster
5. `BlogCTA.tsx` — tiered CTA component (consultation/guide download/call)
6. `TableOfContents.tsx` — auto-generated from headings
7. `KeyTakeaways.tsx` — styled callout box for top of post
8. `FAQSection.tsx` — expandable FAQ with JSON-LD schema injection

### Build Pipeline
1. Vite `import.meta.glob('/src/content/blog/*.md')` loads all posts
2. `gray-matter` parses frontmatter + content
3. `react-markdown` renders markdown to React components
4. `vite-plugin-prerender` generates static HTML for each `/blog/[slug]` at build time
5. Cloudflare Pages serves pre-rendered HTML (SEO indexable)
6. Sitemap auto-generated at build from all posts' frontmatter

### URL Structure
```
/blog/                          → BlogIndex (paginated)
/blog/plantation-shutters-cost-riverina  → BlogPost
/blog/category/plantation-shutters       → Category page
```

### Pre-rendering Config
```js
// vite.config.ts
prerender({
  routes: ['/blog', '/blog/post-1', '/blog/post-2', ...],
  // Generated dynamically from markdown file slugs
})
```

**BLOCKER: This technical foundation must be built and deployed before Post #1 is written.**

---

## 4. Buyer Personas

| Persona | Description | Content Needs | Revenue Potential |
|---------|-------------|--------------|------------------|
| **Renovating Homeowner** | 35-55, established home, updating rooms | Comparisons, cost guides, style inspiration | Medium ($2K-8K) |
| **New Build Owner** | Building in Wagga/Griffith/Temora subdivision | Whole-home packages, builder coordination | High ($8K-20K) |
| **Builder/Developer** | Specifying window furnishings for 5-50+ homes | Lead times, bulk pricing, spec guides | Very High (recurring) |
| **Landlord/Property Manager** | Investment properties, durability focus | Cost-effective, durable, tenant-proof options | Medium (recurring) |
| **Rural Property Owner** | Farms, large properties, security concerns | Security shutters, UV protection, weatherproofing | High ($5K-15K) |
| **Retiree Downsizer** | Moving/renovating, replacing old curtains | Ease of use, motorisation, low maintenance | Medium ($3K-8K) |

---

## 5. Content Architecture: 5 Clusters, 48 Posts (Year 1)

### Cluster Distribution
- **40% Local/Regional + Case Studies** (19 posts) — fastest to rank, highest conversion
- **30% Product Comparisons & Buying Guides** (15 posts) — mid-funnel, commercial intent
- **20% Informational/Educational** (10 posts) — topical authority, AI citability
- **10% Bottom-of-Funnel** (4 posts) — direct conversion content

### Revenue Tiers
- **Tier A (Direct Lead Gen):** Posts designed to generate consultation requests. 40%+ of Phase 1.
- **Tier B (Consideration):** Posts that move people from "thinking about it" to "ready to buy."
- **Tier C (Authority):** Posts that build domain authority and AI citability but don't directly convert.

---

### CLUSTER 1: Plantation Shutters (Primary Revenue Product)
**Hub:** "Plantation Shutters in the Riverina: Everything You Need to Know"
*Publish hub in Month 2 after 5+ spokes exist*

| # | Topic | Primary Keyword | Tier | Revenue | Phase | SERP Format |
|---|-------|----------------|------|---------|-------|-------------|
| 1 | How Much Do Plantation Shutters Cost in the Riverina? (2026 Prices) | plantation shutters cost regional nsw | A | Direct lead gen | 1 | Blog + product pages |
| 2 | Plantation Shutters vs Roller Blinds: Complete Comparison | shutters vs roller blinds comparison | B | Consideration | 1 | Blog posts dominate |
| 3 | Do Plantation Shutters Block Heat? (Tested in 40°C Riverina Summers) | plantation shutters heat insulation australia | B | Consideration | 1 | Blog posts + forums |
| 4 | PVC vs Basswood vs Thermopoly: Shutter Materials Compared | plantation shutter materials compared | B | Consideration | 2 | Blog posts |
| 5 | Plantation Shutters for Sliding Doors: Options & Costs | plantation shutters sliding doors cost | B | Consideration | 2 |  Blog posts |
| 6 | Do Plantation Shutters Increase Home Value? | plantation shutters home value australia | C | Authority | 3 | Blog posts |
| 7 | How to Clean Plantation Shutters (5-Minute Method) | how to clean plantation shutters | C | Authority | 3 | Blog + video |
| 8 | Plantation Shutters vs Curtains: Which Is Better for Your Home? | shutters vs curtains comparison | B | Consideration | 2 | Blog posts |
| 9 | **HUB: Plantation Shutters in the Riverina** | plantation shutters riverina nsw | A | Lead gen | 1 (Month 2) | — |

### CLUSTER 2: Local & Regional Content + Case Studies
**THE MOAT — Unreplicable by National Brands**

| # | Topic | Primary Keyword | Tier | Revenue | Phase | SERP Format |
|---|-------|----------------|------|---------|-------|-------------|
| 10 | Window Treatments for Temora's Extreme Climate (40°C to Frost) | window treatments temora extreme heat cold | A | Lead gen | 1 | Blog (no competition) |
| 11 | Riverina Home Renovation: Window Furnishing Ideas for 2026 | home renovation riverina window ideas | A | Lead gen | 1 | Blog (no competition) |
| 12 | Why Choose a Local Installer Over a National Chain? | local vs national window furnishing installer | A | Lead gen | 1 | Blog posts |
| 13 | **PROJECT: Plantation Shutters in a Temora Heritage Home** | — (brand/E-E-A-T play) | A | Trust builder | 1 | — |
| 14 | Best Outdoor Blinds for Riverina Entertaining in Extreme Heat | outdoor blinds riverina summer | A | Lead gen | 2 | Blog (no competition) |
| 15 | New Build Window Packages: What Riverina Builders & Homeowners Need to Know | new build window furnishings nsw | A | Lead gen (B2B) | 1 | Blog posts |
| 16 | **PROJECT: Full Window Package for a New Build in Wagga Wagga** | — (brand/E-E-A-T play) | A | Trust builder | 2 | — |
| 17 | Heritage Home Window Treatments: Preserving Character in the Riverina | heritage window treatments nsw | B | Consideration | 2 | Blog posts |
| 18 | Smart Blinds in Rural NSW: Is Home Automation Worth It in the Country? | smart blinds rural nsw | B | Consideration | 2 | Blog posts |
| 19 | **PROJECT: Zipscreens Transform a Griffith Alfresco Area** | — (brand/E-E-A-T play) | A | Trust builder | 2 | — |
| 20 | **PROJECT: Before & After — 5 Riverina Window Transformations** | — (brand/E-E-A-T play) | A | Trust builder | 2 | — |
| 21 | Real Pricing: What Riverina Homeowners Actually Pay for Window Furnishings | window furnishings cost riverina real prices | A | Lead gen | 1 | Blog (no competition) |
| 22 | What Riverina Builders Need to Know About Window Furnishing Lead Times | window furnishing lead times builder guide | A | B2B lead gen | 1 | Blog (no competition) |
| 23 | Farmhouse Window Treatments for Riverina Properties | farmhouse window treatments country nsw | B | Consideration | 3 | Blog posts |
| 24 | Working with Interior Designers: Specifying Window Furnishings | interior designer blinds shutters specification | B | B2B | 3 | Blog posts |

### CLUSTER 3: Blinds, Curtains & Other Products
**Hub:** "Choosing Window Furnishings for Your Riverina Home: Every Option Compared"

| # | Topic | Primary Keyword | Tier | Revenue | Phase | SERP Format |
|---|-------|----------------|------|---------|-------|-------------|
| 25 | Roller Blinds vs Venetian Blinds: Complete Comparison | roller blinds vs venetian | B | Consideration | 2 | Blog posts |
| 26 | Best Blackout Blinds for Bedrooms (Shift Workers & Nurseries) | best blackout blinds bedroom | B | Consideration | 1 | Blog posts |
| 27 | Sheer Curtains vs Blockout Curtains: When to Use Each | sheer vs blockout curtains | B | Consideration | 2 | Blog posts |
| 28 | How Much Do Custom Curtains Cost? (Riverina 2026 Guide) | custom curtains cost nsw | A | Lead gen | 2 | Blog + product |
| 29 | Zipscreens vs Outdoor Blinds: The Complete Comparison | zipscreens vs outdoor blinds | B | Consideration | 1 | Blog posts |
| 30 | Honeycomb Blinds: Australia's Best Insulating Option | honeycomb blinds energy efficiency australia | C | Authority | 3 | Blog posts |
| 31 | Panel Glide vs Vertical Blinds: Which for Large Windows? | panel glide vs vertical blinds | B | Consideration | 2 | Blog posts |
| 32 | Dual Shades: Light Control & Insulation in One | dual shades blinds explained | C | Authority | 3 | Blog posts |
| 33 | Security Roller Shutters for Rural & Remote Properties | security roller shutters rural nsw | A | Lead gen | 2 | Blog + product |
| 34 | Louvre Roofs: Turn Your Patio into an All-Weather Room | louvre roof patio australia | A | Lead gen | 2 | Blog posts |
| 35 | Motorised Blinds 2026: Smart Home Integration Guide | motorised blinds smart home australia | B | Consideration | 2 | Blog + product |
| 36 | **HUB: Every Window Furnishing Option Compared** | choosing blinds shutters curtains riverina | B | Consideration | 2 | — |

### CLUSTER 4: Energy, Climate & Sustainability
**Hub:** "Window Treatments & Energy Efficiency for Riverina Homes"

| # | Topic | Primary Keyword | Tier | Revenue | Phase | SERP Format |
|---|-------|----------------|------|---------|-------|-------------|
| 37 | How Window Furnishings Slash Your Energy Bill (Real Numbers) | window furnishings energy saving australia | C | Authority | 2 | Blog posts |
| 38 | Best Window Treatments for Energy Efficiency in 2026 | energy efficient window treatments australia | C | Authority | 3 | Blog posts + govt |
| 39 | Window Treatments vs Double Glazing: Cost-Benefit for Riverina | window treatments vs double glazing cost | B | Consideration | 3 | Blog posts |
| 40 | Bushfire-Rated Window Coverings for Rural Properties | bushfire rated window coverings australia | C | Authority | 3 | Blog (underserved) |
| 41 | Child-Safe Window Treatments: The Complete Guide | child safe blinds australia cord free | C | Authority | 3 | Blog + product |

### CLUSTER 5: Buying Guides & Bottom-of-Funnel

| # | Topic | Primary Keyword | Tier | Revenue | Phase | SERP Format |
|---|-------|----------------|------|---------|-------|-------------|
| 42 | What Happens at a Free In-Home Consultation (Step-by-Step) | free window consultation what to expect | A | Direct conversion | 1 | Blog (no competition) |
| 43 | Our Installation Process: From Measure to Finish | window furnishing installation process | A | Direct conversion | 1 | Blog (no competition) |
| 44 | Window Furnishings Buying Guide: First-Time Buyer's Checklist | buying window furnishings guide first time | B | Consideration | 1 | Blog posts |
| 45 | How to Measure Windows for Blinds & Shutters (Step-by-Step) | how to measure windows blinds shutters | C | Authority | 2 | Blog + video |
| 46 | Custom vs Off-the-Shelf: Why Made-to-Measure Matters | custom vs ready made blinds australia | B | Consideration | 3 | Blog posts |
| 47 | Window Furnishings FAQ: 30+ Questions Answered | window furnishings faq australia | C | Authority/GEO | 2 | Blog (FAQ rich snippet) |
| 48 | Window Treatment Trends 2026: What's In for Australian Homes | window treatment trends 2026 australia | C | Authority | 2 | Blog posts |

---

## 6. Publishing Schedule (Focused Clusters)

### Phase 1 (Months 1-3): 14 Posts — ONLY Clusters 1, 2, and 5
**Strategy: Local + Shutters + Bottom-funnel only. No scatter.**

#### Pre-Launch (Before Post #1):
- [ ] Build BlogPost.tsx component + routing
- [ ] Set up pre-rendering pipeline
- [ ] Install GA4 + Google Search Console
- [ ] Create author bios page (/about updated)
- [ ] Design blog CTA components (consultation form, guide download)
- [ ] Set up GHL lead source tracking (source = "blog", notes = slug)
- [ ] Train Chris/Campbell on photo capture pipeline

#### Month 1 (4 posts — all quick wins, no photos needed)
| Wk | # | Post | Tier | Why First |
|----|---|------|------|-----------|
| 1 | 42 | What Happens at a Free Consultation | A | Converts warm leads immediately |
| 2 | 10 | Window Treatments for Temora's Extreme Climate | A | Zero competition, unique angle |
| 3 | 43 | Our Installation Process | A | Builds trust, conversion support |
| 4 | 1 | Plantation Shutters Cost in the Riverina | A | Highest commercial intent |

#### Month 2 (5 posts — add first case study, builder content)
| Wk | # | Post | Tier | Why |
|----|---|------|------|-----|
| 5 | 12 | Why Choose Local vs National Chain | A | Differentiator |
| 6 | 22 | What Builders Need to Know (Lead Times) | A | B2B, high revenue per lead |
| 7 | 21 | Real Pricing: What Riverina Homeowners Pay | A | Pricing transparency = trust |
| 8 | 13 | PROJECT: Shutters in Temora Heritage Home | A | First case study (needs photos) |
| 9 | 9 | HUB: Plantation Shutters in the Riverina | A | Now has 4+ spokes to link to |

#### Month 3 (5 posts — expand to comparisons)
| Wk | # | Post | Tier | Why |
|----|---|------|------|-----|
| 10 | 2 | Shutters vs Roller Blinds Comparison | B | High search volume comparison |
| 11 | 44 | Buying Guide: First-Time Buyer's Checklist | B | Broad capture, email CTA |
| 12 | 29 | Zipscreens vs Outdoor Blinds | B | Seasonal (approaching summer) |
| 13 | 26 | Best Blackout Blinds for Bedrooms | B | Clear intent, answers question |
| 14 | 11 | Riverina Home Renovation Window Ideas | A | Local capture |

### Phase 2 (Months 4-6): 14 Posts — Add Clusters 3 & 4
- Remaining comparison posts
- More case studies (Wagga, Griffith projects)
- Energy efficiency cluster
- Product-specific posts (curtains cost, security shutters, louvre roofs)
- Cluster hubs for Blinds/Curtains and Energy

### Phase 3 (Months 7-12): 20 Posts — Complete All Clusters
- All remaining spokes
- FAQ compilation
- Trends post (annual refresh)
- Niche products (VersaDrapes, dual shades, panel glides)
- Seasonal refreshes of Phase 1 posts

### Ongoing: 3 posts/month (2 new + 1 refresh)

---

## 7. Content Production Workflow

### Who Does What
| Role | Person | Responsibilities |
|------|--------|-----------------|
| Content Writer | MonteKristo AI (Blog Agent) | Writes all posts, optimizes SEO, formats |
| Subject Matter Expert | Chris & Campbell | Reviews technical accuracy, provides pricing data, project details |
| Photo Provider | Chris & Campbell | Takes installation photos per SOP |
| Approver | Chris OR Campbell | Reviews & approves before publish |
| Publisher | MonteKristo AI | Commits to repo, triggers Cloudflare deploy |
| Analytics | MonteKristo AI | Monthly reporting, content pivots |

### Approval Workflow
1. MonteKristo writes draft → commits to `/src/content/blog/` as draft
2. Notification to Chris (email or GHL task)
3. Chris reviews within **48 hours** — edits or approves
4. If no response in 48h: **auto-publish** (Chris has standing approval for non-case-study content)
5. Case studies require explicit approval (contain pricing/photos)

### Photo Capture SOP
**After every installation, Chris/Campbell:**
1. Take 5 photos minimum: wide room shot, product close-up, exterior (if outdoor), before (if possible), finished result
2. Use phone — no special equipment needed
3. Upload to shared Google Drive folder: `LuxeShutters Photos / [YYYY-MM] / [Town] - [Product]`
4. Get verbal consent from homeowner ("Can we share a photo of the finished job on our website?")
5. Written consent form: link to Google Form on Chris's phone home screen
6. **Target: 3+ photo sets per month**

### Content Calendar Management
- Monthly plan set by MonteKristo on 1st of each month
- Shared via Google Sheet (link in Chris's GHL dashboard)
- Status columns: Draft → Review → Approved → Published
- Chris tags photos to specific upcoming posts

---

## 8. Conversion Path Design

### Blog → Lead Pipeline
```
Blog Post → Tiered CTA → Form/Phone/Widget → GHL Contact → Pipeline
```

### CTA Strategy (Tiered)
| Content Type | CTA | Mechanism | GHL Source |
|-------------|-----|-----------|-----------|
| Bottom-funnel (consultation, process) | "Book Your Free Consultation" | Consultation form (GHL) | `Blog - [slug]` |
| Commercial (cost, comparison) | "Get a Free Quote" | Quote form OR web widget | `Blog - [slug]` |
| Informational (how-to, energy) | "Download Our Free Buying Guide" | Email capture PDF | `Blog Guide - [slug]` |
| Case studies | "See What We Can Do For You — Call 1800 465 893" | Phone | `Blog - [slug]` (if UTM tracked) |

### CTA Components in React
- `BlogCTAConsultation` — links to /contact with UTM params + hidden field (blog slug)
- `BlogCTAQuote` — opens quote form modal with pre-filled source
- `BlogCTAGuide` — email capture form → GHL contact with tag "Blog Guide Download"
- `BlogCTAPhone` — click-to-call with GTM event tracking

### Lead Attribution
- Every blog CTA form includes hidden field: `leadSource: "Blog"`, `leadSourceDetail: "[post-slug]"`
- Phone: use a dedicated tracking number for blog (if budget allows) OR UTM-tagged links
- GHL custom field `augA5eQDHNYvuppnwPHo` (Lead Source) = "Website Blog"
- GHL Notes field includes the specific blog post title

---

## 9. Measurement Stack

### Tools
| Tool | Purpose | Status |
|------|---------|--------|
| Google Analytics 4 | Traffic, engagement, conversion events | **MUST INSTALL** |
| Google Search Console | Impressions, clicks, keyword rankings | **MUST SUBMIT** |
| GHL Dashboard | Consultation requests, pipeline attribution | Active |
| Monthly Report | Consolidated blog performance | MonteKristo creates |

### GA4 Conversion Events
- `blog_cta_click` — any CTA button click (with post slug + CTA type)
- `blog_guide_download` — buying guide email submit
- `blog_consultation_request` — consultation form submit from blog
- `blog_phone_click` — click-to-call from blog

### Monthly Review Cadence
**First Monday of each month, MonteKristo pulls:**
1. GSC: impressions, clicks, average position for all blog keywords
2. GA4: sessions, engagement rate, CTA clicks, conversions per post
3. GHL: consultations with source = "Website Blog", count by post
4. Rankings: top 20 movements for Phase 1 target keywords

### Decision Triggers
| Signal | After | Action |
|--------|-------|--------|
| Zero keywords in top 50 | 3 months | Audit technical SEO + pre-rendering |
| Keywords ranking but 0 consultations | 4 months | Audit CTA placement, A/B test forms |
| One cluster outperforms others by 3x | 3 months | Double down on that cluster |
| Case studies get 5x more engagement | 2 months | Increase case study cadence |
| A post gets 0 traffic after 60 days | 60 days | Rewrite title/meta, check indexing |

---

## 10. Internal Linking Architecture

### Link Hierarchy
```
Service Pages (main site: /services)
    ↕ (bidirectional)
Hub Pages (/blog/plantation-shutters-riverina)
    ↕ (bidirectional)
Spoke Posts (/blog/plantation-shutters-cost-riverina)
    → (one-way to related spokes in same cluster)
    → (one-way to 1-2 spokes in different clusters for cross-pollination)
```

### Link Rules
1. Every spoke links UP to its hub (mandatory)
2. Every spoke links to 1-2 other spokes in same cluster
3. Every spoke links to 1 relevant service page on main site
4. Every hub links DOWN to all its spokes (mandatory)
5. Every hub links to the main /services page
6. Cross-cluster links: max 1 per post (e.g., shutters cost post → buying guide)
7. `RelatedPosts.tsx` component shows 3 posts from same cluster (auto-generated)

### Service Page ↔ Blog Integration
| Service Page | Links TO Blog Hub |
|-------------|------------------|
| /services (Shutters section) | /blog/plantation-shutters-riverina |
| /services (Blinds section) | /blog/choosing-window-furnishings-riverina |
| /services (Curtains section) | /blog/choosing-window-furnishings-riverina |
| /services (Outdoor section) | /blog/choosing-window-furnishings-riverina |

---

## 11. AI/GEO Readiness

### Entity Definition (Required on Every Post)
```
LuxeShutters is a window furnishing company based in Temora, NSW, 
serving the Riverina region of Australia. Owned by Chris and Campbell, 
LuxeShutters supplies and installs plantation shutters, blinds, curtains, 
zipscreens, awnings, and louvre roofs from CWGlobal's Australian-manufactured range.
```

### GEO Priority Posts (Designed for AI Citation)
These 5 posts are specifically structured for ChatGPT/Perplexity/AI Overview citation:

1. **#1: Plantation Shutters Cost** — Definitive pricing data with structured tables
2. **#21: Real Pricing** — Consolidated Riverina pricing reference
3. **#47: FAQ — 30+ Questions** — Dense Q&A format, high schema density
4. **#37: Energy Bill Savings** — Data-driven, citable statistics
5. **#10: Temora Climate Guide** — Unique regional expertise

### AI Citation Formatting Rules
- First 150 words = self-contained answer (citable passage)
- Every H2 section = standalone fact unit (120-180 words)
- Comparison tables with clear headers (AI models extract table data)
- Specific numbers > vague claims ("$300-$600 per m²" not "varies by material")
- Named sources for all statistics (WSAA, ABS, energy.gov.au)

### Schema Markup Per Post Type
| Post Type | Schema |
|----------|--------|
| All posts | BlogPosting + LocalBusiness + BreadcrumbList |
| Comparison posts | + Product (for each product compared) |
| FAQ posts | + FAQPage |
| How-to posts | + HowTo |
| Case studies | + ImageObject + Place |
| Pricing posts | + Product + AggregateOffer |

---

## 12. Defensibility Moat

### What competitors CANNOT easily replicate:
1. **Real Riverina pricing data** — Published cost breakdowns from actual CWGlobal dealer pricing. No competitor publishes real prices.
2. **Installation video library** — Chris on camera measuring, installing, explaining. Even basic iPhone video is 10x harder to copy than text. Plan: 1 short video per case study from Month 2.
3. **Project photo bank** — Real before/after from Riverina homes. Grows monthly. Irreplaceable.
4. **Local partnership content** — Co-authored with Riverina builders and interior designers. Creates backlinks + brand associations.
5. **Email list** — Buying guide download captures emails. 500+ Riverina homeowner emails = direct channel no competitor can copy.

### Video Strategy (Starting Month 2)
- iPhone filming by Chris or MonteKristo during visits
- 60-90 second clips: "How we measured this window" / "The finished result"
- Upload to YouTube (LuxeShutters channel), embed in case study posts
- YouTube + blog post = double indexing opportunity
- No editing needed for authenticity — raw footage builds trust

### Email Capture: Buying Guide
**"The Riverina Homeowner's Window Furnishing Buying Guide"**
- PDF, 12-15 pages
- Content: product comparison matrix, pricing ranges, measuring tips, what to ask your installer, seasonal buying tips
- Gate behind email form on informational + buying guide posts
- Feeds into GHL with tag "Blog Guide Download"
- Follow-up sequence: 3 emails over 2 weeks (helpful tips, not sales)

---

## 13. Service Area Pages (Parallel Strategy — Not Blog)

These are NOT blog posts. They are permanent service pages on the main site targeting "[product] [town]" queries where Google shows business listings.

| Page | Target Keyword | Priority |
|------|---------------|----------|
| /shutters-wagga-wagga | shutters wagga wagga | P1 |
| /blinds-wagga-wagga | blinds wagga wagga | P1 |
| /shutters-griffith | shutters griffith nsw | P2 |
| /blinds-griffith | blinds griffith nsw | P2 |
| /curtains-wagga-wagga | curtains wagga wagga | P2 |
| /window-furnishings-cootamundra | window furnishings cootamundra | P3 |
| /window-furnishings-young | window furnishings young nsw | P3 |

Each service area page includes:
- H1: "[Product] in [Town] — LuxeShutters"
- Product range description
- Local photos (if available)
- Google reviews from that area
- CTA: Book free in-home consultation
- Schema: LocalBusiness + Service + GeoCoordinates
- Links TO relevant blog hub page

---

## 14. KPIs

### 3-Month Targets (After Pre-Launch Complete)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Posts published | 14 | Git commit count |
| Organic blog sessions | 150+/month | GA4 |
| Keywords in top 50 | 25+ | GSC |
| Local keywords in top 10 | 3+ | GSC |
| Blog consultation requests | 1-2/month | GHL |
| Email list (guide downloads) | 30+ | GHL tag count |

### 6-Month Targets
| Metric | Target |
|--------|--------|
| Posts published | 28 |
| Organic blog sessions | 600+/month |
| Keywords in top 20 | 15+ |
| Blog consultation requests | 5-8/month |
| Email list | 100+ |
| Case studies published | 4+ |

### 12-Month Targets
| Metric | Target |
|--------|--------|
| Posts published | 48 |
| Organic blog sessions | 1,500+/month |
| Keywords in top 10 | 12+ |
| Blog consultation requests | 15-25/month |
| Email list | 300+ |
| Video library | 8+ clips |
| Builder/B2B relationships from content | 2-3 |

---

## 15. E-E-A-T Checklist (Pre-Launch)

- [ ] Author bio page: Chris & Campbell, years of experience, qualifications, CWGlobal dealership, WSAA reference
- [ ] Photo pipeline trained and tested (Chris uploads 1 test set)
- [ ] Google Business Profile optimized with blog link
- [ ] ABN, contact details, physical address verified on site
- [ ] Schema: LocalBusiness + Person schema on /about page
- [ ] 16+ Google reviews already exist (strong trust signal)
- [ ] WSAA (Window Shading Association of Australia) membership mentioned
- [ ] HIA (Housing Industry Association) reference where applicable
