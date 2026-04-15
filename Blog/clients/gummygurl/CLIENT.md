# GummyGurl -- Blog Client Overview

**Company:** GummyGurl (Carolina Natural Solutions)
**Owner:** Seamus McKeon
**Location:** North Carolina, USA (ships nationwide where legal)
**Website:** gummygurl.com
**Phone:** 978-406-3946
**Email:** seamus@carolinanaturalsolutions.com
**Status:** Blog infrastructure build in progress

---

## Mission & Identity

GummyGurl is a hemp-derived edibles and wellness brand operated by Carolina Natural Solutions in North Carolina. They sell lab-tested THC, CBD, CBN, mushroom, and pet wellness products across six specialized sub-brands. Seamus McKeon handles product creation, graphic design, and packaging.

**Market:** Direct-to-consumer e-commerce, nationwide shipping where legal. High-risk payment category (hemp/THC).

**CRITICAL TIMELINE:** Federal hemp redefinition effective November 12, 2026. Total THC limit (not just delta-9) caps at 0.3% per dry weight AND 0.4mg per container. ~80% of current catalog becomes federally illegal. Blog strategy must build traffic, authority, and email list within this 7-month window.

---

## Blog Platform

**FINAL ARCHITECTURE: Static HTML Blog + Cloudflare Workers Reverse Proxy (Subfolder)**

Static HTML blog in a separate GitHub repo (`MonteKristoAI/gummygurl-blog`), served at `gummygurl.com/blog/*` via Cloudflare Workers reverse proxy. WordPress handles WooCommerce e-commerce only. Blog is pure HTML with zero JS dependency for guaranteed Google indexation.

**Why not WordPress blog:** Separate blog repo keeps WooCommerce complexity isolated. Static HTML = 10x faster TTFB, zero security patches, zero plugin conflicts. Blog Agent already outputs HTML. Pattern P-002 subfolder approach proven with LuxeShutters.

### Architecture
```
gummygurl.com/blog/*    ->  CF Worker proxy  ->  gummygurl-blog.pages.dev
gummygurl.com/*         ->  WordPress/WooCommerce (SiteGround, unchanged)
```

- **Blog repo:** `MonteKristoAI/gummygurl-blog` (separate GitHub repo)
- **Deploy:** Cloudflare Pages (auto-deploy on push to main)
- **Proxy:** Cloudflare Worker routes `/blog/*` to blog Pages project
- **Output:** Pure static HTML, zero JavaScript required
- **Build:** `node build.js` auto-generates index, sitemap.xml, RSS feed
- **Cost:** Free (Cloudflare Pages + Workers free tier)

### URL Structure
```
/blog/                                    -> Blog index (listing page)
/blog/delta-8-vs-delta-9-thc-edibles/     -> Individual post
/blog/sitemap.xml                         -> Blog sitemap
/blog/rss.xml                             -> RSS feed
```

---

## Author & E-E-A-T

**Author byline:** By the GummyGurl Team, Carolina Natural Solutions

**Author bio:**
The GummyGurl team at Carolina Natural Solutions creates and tests every product in-house, from formulation through packaging. With lab-tested products across six specialized brands and publicly available Certificates of Analysis for every item, they bring hands-on production knowledge to every guide they write.

**E-E-A-T signals to include:**
- Third-party lab testing with publicly accessible COAs
- Six specialized brands (signals depth, not generic reselling)
- Carolina Natural Solutions as parent company (established NC business)
- Product-specific firsthand testing descriptions
- Cannabinoid science citations (PubMed, university research)
- Compliance statements (Farm Bill, state law)
- 21+ age verification gate on site
- SSL certificate, privacy policy, terms of service

**Industry bodies:** U.S. Hemp Roundtable, National Hemp Association (reference where relevant)

---

## Blog Strategy Summary

Full strategy: `/Blog/clients/gummygurl/BLOG-STRATEGY.md`

### 5 Clusters, 40 Posts Year 1 (V3 -- post L1/L10/L100 critic loop)
1. **THC Education & Comparisons** (14 posts) -- hub: "Complete Guide to Hemp THC Edibles"
2. **THCA Flower Guides** (8 posts) -- hub: "THCA Flower: What It Is, How It Works"
3. **Wellness, Sleep & Mushroom** (14 posts) -- hub: "CBD, CBN, and Mushroom Edibles Guide"
4. **Pet CBD** (6 posts) -- hub: "CBD for Dogs: The Complete Guide"
5. **Regulatory, Legal & Post-Ban** (10 posts) -- hub: "2026 Hemp Ban: What Changes"

### Content Mix
- 60% Tier A (direct product links, purchase intent)
- 25% Tier B (consideration, authority building)
- 15% Tier C (traffic, topical authority)

### Publishing Cadence
- Phase 1 (Months 1-2): 10 posts -- hubs first, all Tier A
- Phase 1B (Month 3): 6 posts -- wellness hub, mushroom anchor
- Phase 2 (Months 4-5): 8 posts -- complete THC before ban window
- Phase 3 (Months 6-7): 8 posts -- post-ban pivot (ZERO new THC)
- Phase 4 (Months 8-12): 8 posts -- steady state wellness/mushroom/pet
- Ongoing: 2 new + 1 refresh per month

---

## Featured Products for Blog (updated 2026-04-14 per Seamus)

These 5 products are the priority for blog CTAs, product callouts, and internal linking:
1. **Fubar** - flagship THC gummy
2. **Cereal Killa** - THC gummy
3. **Mean Green** - THC gummy
4. **GK Sleep Gummy** - sleep/wellness
5. **Chicken Chip Pet Treats** - pet wellness (Nature Gurl brand)

## Products (49 across 6 brands)

| Brand | Focus | Products |
|-------|-------|----------|
| Gummy Gurl | THC edibles | Gummies, cookies, chocolates, specialty (23) |
| Nature Gurl | Pet CBD | Peanut Butter Soft Chews, Beef Liver Treats, Chicken Chips (3) |
| Lifted Labs | Functional | Mushroom gummies, hot cocoa, caffeine gummies (3) |
| Phyto Kinetics | Sleep/wellness | CBN sleep gummy (1) |
| Good Karma | CBD/wellness | Tinctures, topicals, sleep gummies, cheapest gummies (8) |
| Rize | Mushrooms | Mushroom gummies, chocolate bars (3) |
| THCA Flower | Flower | 9 strains: Sativa/Hybrid/Indica |
| Bundles | Value sets | Curiosity, Gummy Lovers, Decadence (3) |

---

## Competitors

### Direct (Hemp edibles e-commerce with blogs)
| Competitor | Strength | Weakness |
|-----------|----------|----------|
| 3Chi | Strong blog, pharmacology angle, deep education | Overly clinical, weak on lifestyle |
| Exhale Wellness | High visibility, review/listicle approach | Generic content, thin product pages |
| Binoid | Emerging, good product range | Blog is thin, inconsistent |
| Neurogan | Premium positioning, Scandinavian angle | Limited US-specific content |
| Cornbread Hemp | Strong E-E-A-T, USDA organic, Kentucky heritage | Narrow product range (CBD only) |

### Content Gaps (Our Opportunity)
1. THCA flower strain guides (underdeveloped by all)
2. November 2026 hemp ban content (nobody covering it well)
3. Pet CBD breed-specific dosing
4. Mushroom + hemp crossover education
5. State-by-state legality pages (50 pages of content)
6. Multi-brand comparison content (6 brands = unique angle)
7. COA reading guides (unique expertise)

---

## CTAs (Tiered by Content Type)

| Post Type | Primary CTA | Secondary CTA |
|-----------|-------------|---------------|
| Product comparison | "Shop [Winner]" button to product page | "Subscribe & Save 10%" |
| Educational guide | "Browse Products" button | Newsletter popup (Klaviyo, 10% off) |
| Dosing guide | "Start with [beginner product]" link | Future: "Take our quiz" |
| Legal/regulatory | Newsletter signup | "Bookmark this page" |
| Pet CBD | "Shop Pet Products" button | "Calculate your pet's dose" (future) |

**Conversion Flow:**
1. Blog post -> product link (direct purchase)
2. Blog post -> Klaviyo popup (10% off first order)
3. Blog post -> Subscribe & Save CTA (recurring revenue)
4. Blog post -> Lab Reports page (trust building)

---

## Content Production Workflow

| Role | Person | Responsibilities |
|------|--------|-----------------|
| Writer | MonteKristo AI (Blog Agent) | Writes, SEO optimizes, formats HTML |
| SME / Approver | Seamus McKeon | Reviews accuracy, approves (48h SLA) |
| Publisher | MonteKristo AI | Commits to repo, auto-deploys via CF Pages |

### "Seamus Does Nothing" Contingency (Pattern P-004)
Phase 1 posts require ZERO photos and ZERO Seamus input beyond approval. Content uses product images from WooCommerce (already synced). Case studies and behind-the-scenes content start only after Seamus engagement is validated.

---

## Photo Pipeline

| Layer | Source | Expectation |
|-------|--------|-------------|
| 1. WooCommerce product images | Already synced (49 products) | Primary -- always available |
| 2. COA document screenshots | Lab reports page | Available now |
| 3. Seamus captures (in-house) | Production/packaging photos | Low reliability (sole operator) |
| 4. Stock imagery | Pixabay/Unsplash (hemp, wellness) | Fallback for hero images |
| 5. AI-generated (Gemini) | Blog-specific illustrations | On-demand via blog-image skill |

---

## Measurement Stack

| Tool | Purpose |
|------|---------|
| GA4 | Blog traffic, engagement, product page clicks |
| Google Search Console | Rankings, impressions, CTR |
| Klaviyo | Email signups from blog, email-attributed revenue |
| WooCommerce | Orders with blog referral (UTM tracking) |

### Decision Triggers
- 0 impressions after 4 weeks -> check indexing + Coming Soon mode
- Ranking 11-20 -> refresh + add internal links
- Traffic drops 30%+ -> immediate refresh
- New regulation news -> publish within 48 hours
- November 2026 ban takes effect -> execute pre-planned content pivot

---

## Content Decay Protocol

| Trigger | Action | Timeline |
|---------|--------|----------|
| New regulation/law | Update legal posts + publish new post | Within 48 hours |
| Product price change | Update all posts mentioning that product | Within 1 week |
| New product launch | Publish product spotlight post | Within 2 weeks |
| 4/20 / seasonal event | Publish seasonal content | 2 weeks before |
| Traffic drops 30%+ | Full refresh | Within 2 weeks |
| November 2026 ban takes effect | Major content pivot | Pre-planned (October) |

---

## Entity Definition (Required on Every Post)

> GummyGurl is a hemp-derived edibles brand operated by Carolina Natural Solutions in North Carolina, offering lab-tested THC, CBD, CBN, mushroom, and pet wellness products across six specialized brands: Gummy Gurl, Nature Gurl, Lifted Labs, Phyto Kinetics, Good Karma, and Rize.

---

## Client Review Google Doc
[GummyGurl Blog - Post Review](https://docs.google.com/document/d/1vYeYYEWPOPOfE4yFQSN_gUtRzuHNEwMA5FTg1rQAuzY/edit)

## Klaviyo Integration
- Company ID: VYQtS4
- List ID: XZJniy
- Blog signup forms should use the same Klaviyo list
- Tag blog subscribers with "source:blog" for segmentation
