# Entourage Gummies -- Blog Client Overview

**Company:** Entourage Gummies (legal: K'town Squishes)
**Owner:** Sandy Adams
**Location:** Charlotte, North Carolina, USA
**Website:** getentouragegummies.com (pre-launch)
**Phone:** (330) 573-1097 (WhatsApp OK)
**Email:** info@getentouragegummies.com (business) / sandy@getentouragegummies.com (personal)
**Intro via:** John Rice, AI Savants (john@aisavants.io)
**Manufacturer:** Carolina Natural Solutions (Seamus McKeon, Graphic Design & Production Specialist, seamus@carolinanaturalsolutions.com)
**Status:** Pre-launch, blog infrastructure live and validated (`entouragess-blog/`), seed post drafted, full strategy at [BLOG-STRATEGY.md](./BLOG-STRATEGY.md)

---

## Mission & Identity

Entourage Gummies is a hemp-derived THC + CBD + terpene gummy designed to recreate the cannabis smoking experience in a precisely-dosed, sessionable edible. The brand is built on two equal pillars: a full-spectrum entourage-mimicking formulation and TiME INFUSION, a proprietary water-soluble delivery process that produces 15-30 minute onset. Three SKUs (Relaxed / Balanced / Uplifted) with two strengths and two pack sizes each. Positioning north star, taken verbatim from the back of the packaging:

> The result of the entourage mimicking formulation and the TiME INFUSION delivery system is a consistent, easy to dose effect designed for clarity, enjoyment, and connection. It delivers a social, sessionable gummy experience rather than a heavy or sedating one.

**Service area:** Direct-to-consumer nationwide (wherever hemp-derived Delta-9 remains compliant). Crafted in Charlotte, NC.

---

## Blog Platform

Static HTML, separate repo, served via Cloudflare Pages behind a Cloudflare Worker reverse proxy (Pattern P-002: subfolder beats subdomain). Zero WordPress, zero CMS overhead.

**Architecture:**
```
getentouragegummies.com/            (main Vite + React + shadcn site)
                      /blog/         (served by CF Worker from entouragess-blog.pages.dev)
                      /blog/{slug}/  (individual post)
                      /blog/sitemap.xml
                      /blog/rss.xml
```

**Repo:** `/Users/milanmandic/Desktop/MonteKristo AI/entouragess-blog/` (not yet pushed to GitHub, pending user approval to push to `MonteKristoAI/entouragess-blog`)

**Build:** `npm run build` -> Node `build.js` -> `dist/`. Build-time brand validation rejects em dashes, incorrectly-cased TiME INFUSION, Azuca mentions, and medical-claim vocabulary.

**URL structure:**
- `/blog/` -- blog index
- `/blog/{slug}/` -- individual post
- `/blog/sitemap.xml` -- XML sitemap
- `/blog/rss.xml` -- RSS feed

---

## Author & E-E-A-T

**Primary byline:** Sandy Adams, Founder, Entourage Gummies -- Charlotte, NC.
Sandy is a former flower smoker who built Entourage because existing edibles could not recreate the smoking experience. Her first-person founder perspective is the single strongest E-E-A-T asset the brand has. Per Pattern P-014, before publishing post #2 we must collect 5+ samples of Sandy's real written communication (emails, Instagram posts, text messages, product notes) and calibrate the voice to her actual speech patterns. Until then, all story-led (template C) posts are parked.

**Technical byline (infusion-science posts):** Seamus McKeon, Carolina Natural Solutions, process lead for the TiME INFUSION delivery system.

**E-E-A-T signals we will publish:**
- Third-party lab COAs linked from every product page once they land (Sandy sourcing)
- Named manufacturing partner (Carolina Natural Solutions) -- rare in the category, cited in every post's entity block
- Farm Bill compliance statement on every page
- FDA disclaimer in every footer
- Real peer-reviewed citations (PubMed, Journal of Cannabis Research, clinical trial registries)
- 21+ age gate with localStorage persistence

**Industry bodies (future):** US Hemp Roundtable, Hemp Industries Association. Membership pending.

---

## Blog Strategy Summary

Full strategy document: [BLOG-STRATEGY.md](./BLOG-STRATEGY.md). Short version below.

### Clusters: 6 total, 4 active in Year 1

| # | Cluster | Phase | Posts Y1 |
|---|---|---|---|
| A | Entourage Effect Science (hub cluster) | Phase 1 | 4 |
| B | Fast-Acting / TiME INFUSION Science | Phase 1 | 3 |
| C | Smoking vs Edible Experience (biggest content gap) | Phase 1 | 3 |
| D | 2026 Federal Hemp Reality (regulatory) | Phase 1B | 2 |
| E | Dosing and Sessionability | Phase 2 | 5 |
| F | Terpenes Deep Dive | Phase 2-3 | 8 |

### Content Mix (per Pattern P-010)

- 100% Tier A (direct lead gen) in Phase 1
- 60% Tier A / 30% Tier B / 10% Tier C in Phases 2-3

### Publishing Cadence

- **Phase 1 (Months 1-2):** 4 posts per month, 8 total, all Tier A
- **Phase 1B (Month 3):** 4 posts, regulatory cluster, must be live by July 12, 2026 (P-012 4-month buffer before the November 12, 2026 federal hemp deadline)
- **Phase 2 (Months 4-6):** 3 posts per month, 9 total
- **Phase 3 (Months 7-12):** 2 posts per month, 12 total
- **Year 1 total:** ~33 posts

---

## Competitors

### Direct (hemp DTC with blogs)

| Brand | Blog state | Notable lanes | Overlap with Entourage? |
|---|---|---|---|
| 3Chi | Heaviest publisher. 100+ posts, multi-per-month | Minor cannabinoids (THCP, HHC, THCV), nerdy-recreational voice | Partial (cannabinoid education) |
| Cornbread Hemp | Deep educational hub, SEO-engineered | CBD dosage, "fake CBD" detection, nano CBD | Partial (CBD lane) |
| Hometown Hero | Large "Learn" library, legality-focused | Delta-8/HHC/Delta-9 matrices, Farm Bill, Texas identity | Partial (regulatory cluster) |
| Mood | Weekly cadence, strain-level depth | Strain profiles, THCP, recreational-educational | Partial (experiential) |
| Wana Brands | Science-lite, 9 evergreen posts | Fast-acting mechanism, terpenes, cannabis vs alcohol | High (science cluster) |
| Kanha Treats | Lifestyle, 1 post/month | Holiday guides, PR | Low |
| Plus Products | Wellness-premium | Sleep, seasonal gifting | Low |
| Joy Organics | Wellness lifestyle | CBD for fitness, gut health | Low (CBD-first) |
| Wyld CBD | Dormant | Sustainability, sourcing | Low |

### Sister brand: GummyGurl (SAME parent company -- off-limits lanes)

GummyGurl is a Lovable SPA with no crawlable blog index, but it shares the Carolina Natural Solutions parent. Until Sandy confirms GummyGurl's topic list, Entourage must **not** publish in these lanes:

- CBD-first wellness (anxiety, stress, general calm)
- Pet CBD / pet hemp
- CBD skincare / topicals
- "CBD vs THC" beginner 101
- Generic "hemp wellness" lifestyle
- Sleep / CBN gummy wellness positioning
- Women-focused wellness positioning

**Safe lanes for Entourage:** THC-forward recreational, sessionable, smoker-parity, entourage-effect pharmacology, fast-acting delivery, strain-matched terpenes, Southeast regional, manufacturer-transparent, concert/festival/social occasions.

---

## CTAs (Tiered by Content Type)

| Post type | Primary CTA | Mechanism | Secondary CTA |
|---|---|---|---|
| Hub post (A) | Shop the three effects | Gold CTA box linking to `/shop` | Newsletter signup inline |
| Science spoke (A, B clusters) | Explore the TiME INFUSION process | CTA box linking to `/explore-technology` | Newsletter signup inline |
| Smoking-comparison (C cluster) | Try a sessionable gummy for free (sample size when available) | CTA box linking to `/shop` | Newsletter for new drop announcements |
| Regulatory (D cluster) | Stock up while Farm Bill compliance holds | CTA box linking to `/shop` | Newsletter for regulatory updates |
| Dosing (E cluster) | Start low, go slow, find your effect | CTA box linking to `/effects` | Newsletter for dosing guide PDF |
| Terpene (F cluster) | Match the terpene to the moment | CTA box linking to `/shop` with effect filter | Newsletter |

---

## Content Production Workflow

| Role | Who | Responsibilities |
|---|---|---|
| Writer | MonteKristo AI blog pipeline | Drafts posts in `posts/*.html` with META block, passes brand validation, opens PR |
| Voice calibrator | Sandy Adams | Provides 5+ writing samples before post #2 (P-014); reviews story-led posts |
| Technical reviewer | Seamus McKeon | Reviews science and infusion claims on cluster A and B posts; provides citations |
| Brand reviewer | Sandy Adams | Final approval on all posts before merge; 72h auto-publish for non-medical-claim posts (P-015) |
| Deployer | CI (Cloudflare Pages) | Auto-deploys on push to `main` |

### "Sandy Does Nothing" Contingency (Pattern P-004)

Sandy is a solo operator who is also running the entire business. The content calendar must work when she is offline for 2-6 weeks. Contingency plan:

- **Voice corpus is collected in one single call** at the start of the engagement. After that, no Sandy input is required for non-claim posts.
- **72-hour auto-publish rule** (P-015): if Sandy does not review a non-medical-claim post within 72 hours, it publishes anyway. Medical-claim and regulatory posts always require explicit approval.
- **Fallback photos:** Gemini-generated illustrations, silhouette art, packaging shots Sandy already sent, stock photography from Unsplash/Pexels. No post is blocked on Sandy taking a photo.
- **Voice falls back to brand voice document** (`STYLE.md`) if Sandy goes dark for longer than 30 days. Posts will remain publishable with a slightly less personal tone until she is back.

---

## Photo Pipeline (5 Layers, Pattern P-007)

1. **Packaging shots from Sandy.** Already in hand: front/back of Relaxed, Balanced, Uplifted, collection shot. Usable as-is for CTA boxes and hero images.
2. **Silhouette art from Seamus.** Already in `src/assets/` of the main site and copied into `entouragess-blog/images/`. Used on the blog hero and as decorative backgrounds on every page.
3. **Gemini-generated illustrations via the `blog-image` skill.** Used for pharmacology diagrams, terpene molecules, onset-time charts, and any abstract explainer visual.
4. **Stock photography from Pexels/Unsplash.** Used for lifestyle shots (dinner parties, hikes, concerts) when the post is persona-focused. Must be original-looking, never the generic "gummies on a wooden table" stock photo that every competitor uses.
5. **Third-party lab COA screenshots** once they land from Sandy. Used for trust content and for the Shop collection pages, not blog posts (COAs belong to products).

---

## Measurement Stack

- **Google Search Console:** verify `getentouragegummies.com` property. Submit `/blog/sitemap.xml`. Weekly review.
- **Google Analytics 4:** blog_cta_click, blog_external_link_click, newsletter_signup_intent, age_gate_confirm, age_gate_deny events.
- **Klaviyo (likely ESP):** list growth, campaign performance, abandoned cart flow attribution.
- **Shopify or ecomm (TBD):** 7-day click attribution, revenue per organic session as north star.
- **Leading indicators (weekly):** new keywords ranking in top 30, new backlinks, email list net adds.
- **Trailing indicators (monthly):** organic sessions, blog-attributed revenue, conversion rate from blog traffic.

### Decision Triggers

- Month 3 organic sessions < 1,000 → re-run SERP validation, re-evaluate topic selection
- Month 6 blog-attributed revenue < $2,000 → pause Tier B, double down on Tier A
- Month 6 email list < 500 → add paid acquisition channel (Meta Ads, creator partnerships)
- Any month with regulatory-cluster posts ranking in top 10 → accelerate publishing cadence in cluster D before November 12, 2026

---

## Content Decay Protocol

| Trigger | Action | Timeline |
|---|---|---|
| Traffic drop 20% MoM for 2 months | Refresh with new data, add 500 words, re-publish | Within 1 week |
| Primary keyword falls out of top 20 | Full rewrite with fresh SERP validation | Within 2 weeks |
| Regulatory post outdated by news | Rolling edit + `updated` field refresh | Continuous |
| Evergreen post hits 12 months | Quarterly audit batch: links, sources, screenshots | Quarterly |
| New peer-reviewed research lands | Cite and update hub post | Within 1 month |

---

## Entity Definition (required on every post)

> Entourage Gummies is a hemp-derived THC gummy brand based in Charlotte, North Carolina, built around a full-spectrum entourage-mimicking formulation (THC, CBD, and terpenes in flower-matched ratios) and TiME INFUSION, a proprietary water-soluble delivery process that produces 15 to 30 minute onset. Three sessionable effects: Relaxed, Balanced, and Uplifted. Manufactured by Carolina Natural Solutions. Farm Bill compliant. 21 plus only.

This block goes above the Sources section on every post. It is what AI search systems will quote when asked "what is Entourage Gummies."
