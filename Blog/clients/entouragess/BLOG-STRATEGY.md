# Entourage Gummies -- Blog Strategy

**Version:** V1 (2026-04-11)
**Author:** MonteKristo AI (informed by parallel research + all 15 blog-onboard patterns)
**Status:** Draft for Sandy Adams review

> All strategy decisions below are load-bearing. This is not a framework handout, it is a set of real choices pulled from real research data: a 210-keyword database with SERP validation, a 10-brand competitor audit, a market + regulatory scan, and the hard realities of launching a new hemp brand 7 months before a federal ban.

---

## 1. Business Context

Entourage Gummies is a pre-launch hemp-derived THC gummy brand built on two equal pillars: a full-spectrum entourage-mimicking formulation (THC + CBD + terpenes in flower-matched ratios) and TiME INFUSION, a proprietary water-soluble delivery process that produces 15-30 minute onset instead of the 45-90 minute lottery of conventional oil-based edibles. The brand is owned by Sandy Adams in Charlotte, North Carolina, manufactured by Carolina Natural Solutions (Seamus McKeon runs the process). Three SKUs, each with two strengths and two pack sizes, mapped to three effects: Relaxed (green, #029b78), Balanced (gold default, #e2b829), Uplifted (pink, #b21e41).

The blog exists for one reason: to prove the two pillars with real science and real consumer language so the brand can rank for commercial-intent queries before the November 12, 2026 federal hemp deadline closes the category in its current form.

## 2. SERP Reality Check

Live SERP validation on the 5 head terms (from the keyword research agent):

| Head term | Blog can rank? | Why |
|---|---|---|
| `entourage effect gummies` | **YES (primary money keyword)** | SERP is 60% educational brand blogs + publisher articles. Brand name literally matches the query. |
| `nano thc gummies` | PARTIAL | Top 5 is 80% product and collection pages. A blog can slot into positions 3-6 with a definitive explainer. Build a collection page **and** supporting blog. |
| `fast acting thc gummies` | **YES** | SERP is ~50/50 blog and product. Multiple slots for definitive long-form. |
| `hemp thc gummies that work` | Limited | 90% brand collection pages. Best play is a shop collection page, not a blog post. |
| `delta 9 gummies vs smoking` | **YES (easy win)** | 100% blog SERP. Zero product pages in top 10. Healthline and PubMed are the only authorities. Wide open. |

**Strategic implication:** the blog's job is informational and comparison content; the main site's job is product collection pages for transactional queries. Do not fight the SERP.

## 3. Blog Architecture

- **Platform:** Static HTML in a separate GitHub repo (`MonteKristoAI/entouragess-blog`, already built) served via Cloudflare Pages behind a Cloudflare Worker reverse proxy. Pattern P-002: subfolder beats subdomain by ~25% organic growth.
- **URL structure:** `getentouragegummies.com/blog/` index + `getentouragegummies.com/blog/{slug}/` per post
- **Why not WordPress:** Sandy is a solo operator with no editorial team. WordPress adds attack surface and maintenance overhead. Static HTML with build-time brand validation (em-dash sweep, TiME INFUSION case check, Azuca ban, medical-claim ban) is safer and faster.
- **Why not a React SPA blog:** Pattern P-009. The main Entourage site is a Vite + React SPA with no pre-rendering. That is already a Google-indexability risk for the commerce pages. Adding SPA-based blog content on top would compound the problem. Static HTML bypasses it entirely and will be crawled and rendered on first fetch.
- **Build-time compliance gates:** zero em dashes, exact `TiME INFUSION` stylization, no Azuca, no medical-claim vocabulary. The build exits non-zero if any post violates these rules.
- **Crawlability:** sitemap.xml, robots.txt, canonical URLs, BlogPosting + BreadcrumbList + FAQPage schema all generated on build. IndexNow submission on every deploy.

## 4. Buyer Personas (4)

**P1. The Former Flower Smoker (primary)** -- 28 to 42, used to smoke regularly, quit or cut back for career or health reasons, misses the headspace not the smoke. Is not looking for wellness, they are looking for the experience they remember. Current edibles feel nothing like flower and they have given up on the category. This persona makes or breaks the brand.

**P2. The Sessional Social User** -- 25 to 38, still smokes or vapes occasionally but wants a cleaner social option for dinner parties, concerts, hikes, game nights. Wants predictable dosing and non-sedating effects. Does not want to be knocked out at 11pm for 8 hours because of a 25mg gummy they ate at 8pm.

**P3. The Alcohol-Replacement Convert** -- 30 to 50, sober-curious or California sober, replaced or cut back on alcohol and is looking for something that serves the same social function without the hangover. Per Gallup, this is now a record-low 54% of Americans drinking, and 69% of 18-24 prefer cannabis to alcohol. High-growth segment.

**P4. The Curious Returner** -- 40 to 60, has not used cannabis in 10+ years, aware edibles exist, nervous about dosing, has heard "don't take a whole one" horror stories. Needs hand-held education, starts at 5-10mg, will become a high-LTV customer if the first experience is good.

**Deliberately excluded personas (to avoid GummyGurl overlap per the competitor agent):** CBD-first wellness seekers, pet CBD shoppers, women-focused wellness, sleep-CBD, CBD skincare, general hemp wellness. These lanes belong to GummyGurl and Entourage must not compete in them.

## 5. Content Architecture

Three clusters in Phase 1 (Months 1-2), two more in Phase 2, and a time-critical regulatory cluster dropped into Phase 1B (Month 3) because of the November 12, 2026 federal hemp deadline.

### Cluster A -- Entourage Effect Science (hub cluster)
Owns the brand-name keyword. The hub post ("What Is the Entourage Effect") already exists as the seed post in the blog repo.

- Hub: What Is the Entourage Effect? How THC, CBD, and Terpenes Work Together
- Spoke: Full-Spectrum vs Broad-Spectrum vs Isolate THC Gummies
- Spoke: β-Caryophyllene: The Only Terpene That Binds to a Cannabinoid Receptor
- Spoke: How THC, CBD, and Terpene Ratios Shape a Cannabis Experience

### Cluster B -- Fast-Acting / TiME INFUSION Science
Owns the "feels like flower" positioning.

- Hub: Why Edibles Take So Long (And What TiME INFUSION Changes)
- Spoke: 15 Minutes vs 90 Minutes: Onset Time in Real Life
- Spoke: Nano, Water-Soluble, Self-Emulsifying: A Plain-English Guide to Fast-Acting Edibles

### Cluster C -- Smoking vs Edible Experience (highest-leverage content gap)
This is the single biggest content opportunity in the research. No competitor owns it. Cornerstone cluster for converting persona P1.

- Hub: Delta 9 Gummies vs Smoking: The Honest Comparison
- Spoke: Edibles That Feel Like Smoking a Joint: Is It Possible?
- Spoke: 11-Hydroxy-THC Explained: Why Edibles Hit Different

### Cluster D (Phase 1B, time-critical) -- 2026 Federal Hemp Reality
Must be live by **July 12, 2026** per Pattern P-012. The federal ban effective date is November 12, 2026, and a zero-authority domain needs 4 months of runway to index and rank.

- What the 2026 Federal Hemp Ban Means for You (evergreen with rolling updates)
- State-by-State Hemp THC Status Tracker (data piece, refreshed quarterly)

### Clusters E, F (Phase 2, Months 4-6)
- Cluster E: Dosing and sessionability (10mg vs 25mg, microdosing, first-time user)
- Cluster F: Terpenes deep dive (matching terpene profiles to moments, each major terpene as its own spoke)

## 6. Publishing Schedule

**Phase 1 (Months 1-2) -- 8 posts, 100% Tier A, per Pattern P-003.** Depth over breadth. No Tier B or C in Phase 1.

| Week | Post | Cluster | Template | Tier |
|---|---|---|---|---|
| W1 | What Is the Entourage Effect? (hub) | A | A (Long-form) | A |
| W2 | Delta 9 Gummies vs Smoking: The Honest Comparison | C | A (Long-form) | A |
| W3 | Why Edibles Take So Long (And What TiME INFUSION Changes) | B | A (Long-form) | A |
| W4 | Full-Spectrum vs Broad-Spectrum vs Isolate THC Gummies | A | D (Data piece) | A |
| W5 | Edibles That Feel Like Smoking a Joint: Is It Possible? | C | C (Story-led) | A |
| W6 | 11-Hydroxy-THC Explained: Why Edibles Hit Different | C | A (Long-form) | A |
| W7 | β-Caryophyllene: The Only Terpene That Binds to a Cannabinoid Receptor | A | B (Short direct) | A |
| W8 | 15 Minutes vs 90 Minutes: Onset Time in Real Life | B | D (Data piece) | A |

Template distribution: 4 x Long-form (A), 1 x Short direct (B), 1 x Story-led (C), 2 x Data piece (D). No template repeats 3 times in a row, per Pattern P-005.

**Phase 1B (Month 3) -- 4 posts, regulatory-critical + cluster D, must be live by July 12, 2026 per P-012**

- W9: What the 2026 Federal Hemp Ban Means for You (Template A)
- W10: State-by-State Hemp THC Status Tracker (Template D)
- W11: Microdose THC Gummies: The California Sober Guide (Template C)
- W12: 10mg vs 25mg THC Gummies: Which Should You Start With? (Template B)

**Phase 2 (Months 4-6) -- 9 posts, mix of Tier A and Tier B, rest of clusters E/F**

**Phase 3 (Months 7-12) -- 12 posts, long-tail and seasonal, finishing year with ~33 total posts**

## 7. Content Specifications

Four template types per Pattern P-005. Structural variation is mandatory for anti-AI-detection.

| Template | Word count | Format | When to use |
|---|---|---|---|
| **A -- Long-form** | 2,500-3,500 | Key Takeaways + H2 sections + FAQ + CTA + sources | Hub posts, pillar content, evergreen explainers |
| **B -- Short direct** | 1,200-1,500 | Direct-answer intro + 3-4 H2 sections + short CTA | Single-topic quick answers, β-Caryophyllene spokes |
| **C -- Story-led** | 1,800-2,200 | First-person anecdote + H2 sections + FAQ + CTA | Smoker-parity content, Sandy's founder perspective, persona P1 targeting |
| **D -- Data piece** | 2,000-2,500 | Headline stat + tables + charts + sources + CTA | Comparisons, pharmacokinetic data, state trackers |

**Per-post anatomy (every post, regardless of template):**
- Title with primary keyword in the first 60 characters
- Meta description 150-160 chars, includes primary keyword
- H1 matches title exactly
- Key Takeaways box (5 bullets) for templates A and D only
- Minimum 3 internal links to the main site (products, effects page, science page) and the rest of the blog
- Minimum 3 external citations (at least 1 to PubMed / peer-reviewed source)
- FAQ section with 3-5 questions for templates A and C
- Sources section at the bottom
- CTA box mid or end-of-post linking to `/shop`
- Brand entity block above sources (Entourage Gummies is...)

## 8. E-E-A-T Framework

- **Experience:** Sandy Adams, founder byline, first-person in story-led posts. Her story of transitioning from flower smoker to edible maker because the existing edible category could not recreate the smoking experience. This is the single most powerful trust asset we have and it is unique to Entourage. Pattern P-014: before publishing post #2, collect 5+ samples of Sandy's real written communication (emails, texts, product descriptions) to calibrate the voice. Until then, do not publish a story-led post.
- **Expertise:** Carolina Natural Solutions as the named manufacturing partner. Seamus McKeon, Graphic Design and Production Specialist, is the process expert and will be credited as the technical author on infusion-science posts.
- **Authoritativeness:** Third-party lab COAs on every product page (when they land). Batch-level lot numbers. Transparent manufacturer disclosure (rare in the category). Brand-origin dateline: "Crafted in Charlotte, North Carolina" on every footer.
- **Trust:** 21+ age gate on the blog with localStorage persistence. Farm Bill compliance note on every page. FDA disclaimer in every footer. No medical claims (enforced at build time). Refund and shipping policy visible from every footer.

## 9. Conversion Path (with real email math per Pattern P-011)

Blog post → CTA box (mid or end of post) → `/shop` → product page → age gate at checkout → purchase. Secondary path: newsletter signup inline in the post.

**Email math, not wishful thinking:**

- Phase 1 traffic target (Month 2 exit): 3,000 organic sessions/month based on 8 Tier A posts, realistic rank positions 5-15 for target keywords, and category CTR baselines.
- Realistic signup rate on hemp edible blog traffic: 4-6% (the research agent called 5-8% optimistic; I am discounting for the age gate friction)
- Month-2 incremental email list: 120-180 subscribers
- Month-6 cumulative (assuming steady growth): 1,200-2,000 subscribers
- **This is not enough to matter without a second acquisition channel.** If email is positioned as a survival asset (per P-011's GummyGurl lesson), we need to add paid social or creator partnerships by Month 4. Otherwise the email list is a bonus, not a moat.

**Decision:** email is a secondary asset in the strategy, not the primary moat. The primary moat is the dual-pillar positioning (full-spectrum formulation + TiME INFUSION delivery) documented in rankable educational content before the November 2026 federal deadline.

## 10. Measurement Stack

- **Google Search Console:** verify property once main domain is on Cloudflare. Submit blog sitemap. Monitor weekly for indexation and ranking position.
- **Google Analytics 4:** event-track `blog_cta_click`, `blog_external_link_click`, `newsletter_signup_intent`, `age_gate_confirm`, `age_gate_deny`.
- **Shopify or ecomm platform (TBD):** attribution window 7 days click. Revenue per organic session is the north star metric.
- **Klaviyo (likely ESP):** list growth, weekly cohort open rates, click-to-site rates from campaigns.
- **Leading indicator (weekly):** new keywords ranking in top 30. Trailing indicator (monthly): organic sessions, email list adds, blog-attributed revenue.
- **Decision triggers:** if Month 3 organic traffic is under 1,000 sessions, re-evaluate topic selection and SERP validation. If Month 6 blog-attributed revenue is under $2,000, de-prioritize Tier B content in Phase 2 and double down on Tier A.

## 11. Internal Linking Architecture

Hub-and-spoke. Every spoke in cluster A (Entourage Effect) links to the hub. Every spoke in cluster B (TiME INFUSION) links to its hub. Every post in cluster C (smoking vs edible) links to both hubs. Every post links to at least 2 product pages on the main site and one page each from Effects and Science on the main site.

**Main site pages that must exist for internal linking to work:**
- `getentouragegummies.com/` (homepage)
- `/shop` (general)
- `/shop/relaxed`, `/shop/balanced`, `/shop/uplifted` (when per-blend product pages ship, per the 2026-04-10 feedback PDF)
- `/explore-technology` (the TiME INFUSION science page)
- `/effects` (the entourage effect page)
- `/contact`
- `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy` (legal footer)

## 12. AI and GEO Readiness

- Every post opens with a **direct-answer paragraph** under the H1, so ChatGPT, Perplexity, and Google AI Overviews can extract a citable snippet without reading the whole post.
- Every post includes an **entity definition block** ("Entourage Gummies is a hemp-derived THC gummy brand based in Charlotte, North Carolina, built around a full-spectrum entourage-mimicking formulation and TiME INFUSION fast-onset delivery.") above the sources section. This is the passage AI systems will quote when asked "what is Entourage Gummies."
- **BlogPosting, BreadcrumbList, and FAQPage schema** generated automatically by the build script. FAQPage only emitted when the post has 3+ Q/A pairs, per Google's updated schema guidelines.
- **Citable data points in tables.** AI systems overwhelmingly prefer to quote data in tables over prose. Data-piece posts (template D) will win AI citations.
- **llms.txt** will be generated in Phase 2 as AI crawlers mature.

## 13. Defensibility Moat

Five assets competitors cannot copy:

1. **The dual-pillar positioning itself.** No other hemp brand owns both a full-spectrum formulation story and a named fast-acting delivery process. Kanha, Plus, Wyld, Wana, Cornbread, 3Chi, Hometown Hero all pick one or the other or neither. Entourage owns the intersection.
2. **Named-manufacturer transparency.** Carolina Natural Solutions as the open manufacturing partner. Only Cornbread does anything similar with their USDA organic certification, and even they do not name the facility. This is a trust asset.
3. **Charlotte, NC origin.** Hometown Hero owns Texas. Nobody owns the Southeast. Sandy is in Charlotte. Geographic authority is free money for local SEO and for Southeast press mentions.
4. **The "Smoke the Gummy" content pillar.** No competitor has the product architecture to credibly own "sessionable, fast-acting, mimics-flower" positioning. An isolate-based brand literally cannot publish these posts without contradicting their own product claims.
5. **The founder's smoker-to-maker story.** Pattern P-014: once voice-calibrated, Sandy's first-person content will be unique and high E-E-A-T. No competitor has a founder with this arc who is actively writing.

## 14. Content Decay Protocol

| Trigger | Action | Timeline |
|---|---|---|
| Organic traffic drops 20% MoM for 2 consecutive months | Refresh: new data, re-examine H2s, add 500 words, re-publish | Within 1 week |
| Primary keyword falls out of top 20 | Full rewrite with updated SERP reality check, change angle if needed | Within 2 weeks |
| Regulatory cluster post (federal hemp ban, state tracker) goes stale | Rolling edits as news lands, monthly `updated` field refresh | Continuous |
| Evergreen post hits 12 months old | Audit links, add new sources, refresh screenshots, re-publish | Batch quarterly |
| New peer-reviewed research on entourage effect or nano-emulsion bioavailability | Add to hub post, cite in sources section | Within 1 month of publication |

## 15. KPIs

**3-month targets (end of Phase 1B):**
- 12 posts live
- 800-1,500 monthly organic sessions
- 100-200 email subscribers
- 2-3 keywords ranking in top 10
- 8-15 keywords ranking in top 30
- $500-1,500 blog-attributed revenue (once shop is live)

**6-month targets (end of Phase 2):**
- 21 posts live
- 3,000-6,000 monthly organic sessions
- 500-1,000 email subscribers
- 6-10 keywords in top 10
- 25-40 keywords in top 30
- $3,000-8,000 blog-attributed revenue per month
- Survived the November 12, 2026 federal deadline with regulatory-cluster content indexed and ranking

**12-month targets (end of Year 1):**
- 33 posts live
- 8,000-15,000 monthly organic sessions
- 1,500-3,000 email subscribers
- Dominant position on `entourage effect gummies` (top 3)
- Top 10 on `delta 9 gummies vs smoking`, `fast acting thc gummies`, `10mg vs 25mg thc gummy`, `β-caryophyllene benefits`
- $10,000-25,000 blog-attributed monthly revenue
- Recognized as the authority on sessionable / smoke-mimicking hemp edibles

---

## Patterns Applied

| Pattern | Where it shows up |
|---|---|
| P-001 SERP validation | Section 2 -- 5 head terms Google-tested before any post was scheduled |
| P-002 Subfolder not subdomain | Section 3 -- `getentouragegummies.com/blog/` via CF Worker proxy |
| P-003 Phase 1 = Tier A only, 8 max | Section 6 -- exactly 8 posts, all Tier A |
| P-004 Owner does nothing | Sandy is the solo operator. Content calendar assumes zero participation after voice-calibration call |
| P-005 Template variation | Section 7 -- 4 templates, distribution in Section 6 avoids 3-in-a-row |
| P-006 National keywords, localize through content | Primary keywords are national. Charlotte NC shows up in author bylines, entity blocks, and the "Southeast authority" moat, not in keyword targets |
| P-007 Photo pipeline needs 5 layers | Pending until Sandy delivers assets. Fallbacks: Gemini-generated illustrations, silhouette art, packaging shots, terpene molecule diagrams |
| P-009 Build infra before writing | DONE. The static HTML blog is built, validated, and ready before post #2 is written |
| P-010 Tier every post, 40%+ Tier A | Phase 1 is 100% Tier A, well over 40% |
| P-011 Validate email math | Section 9 -- real numbers, not wishes. Email is bonus, not moat. |
| P-012 Regulatory deadlines need 4-month buffer | Section 5/6 -- cluster D in Phase 1B, live by July 12, 2026 for the November 12, 2026 federal deadline |
| P-013 Cannibalization kills zero-authority domains | Section 5 -- one definitive post per head keyword, no 3 posts targeting "best THC gummies" |
| P-014 Voice persona from real speech | Section 8 -- collect 5+ Sandy writing samples before post #2 |
| P-015 Auto-publish rule | 72h auto-publish on non-medical-claim posts. Medical-claim posts always require explicit Sandy approval. To be added to `FEEDBACK.md`. |

## Open Questions for Sandy

These were listed in `DISCOVERY.md` and remain open:

1. **Domain path:** `/blog/` subfolder (recommended) or `blog.getentouragegummies.com` subdomain?
2. **ESP:** Klaviyo (aligned with GummyGurl), Mailchimp, Beehiiv, or other?
3. **Seed post approval:** the hub post "What Is the Entourage Effect?" is already drafted in `entouragess-blog/posts/`. Does Sandy want to review before it goes live, or treat it as a template that can be auto-published with the rest of Phase 1?
4. **Voice corpus:** can Sandy send 5+ samples of her own writing (emails, texts, Instagram DMs, product notes) before post #2? This is the single biggest lever for avoiding AI-generic voice per Pattern P-014.
5. **GummyGurl topic list:** can Sandy confirm the GummyGurl blog topic list so we can keep Entourage's editorial lanes clean?
6. **Per-blend product pages:** the 2026-04-10 feedback PDF asks for `/shop/relaxed`, `/shop/balanced`, `/shop/uplifted`. Internal linking in Phase 1 content assumes those pages will exist. If they are delayed, every spoke post's link architecture has to be rewritten.
