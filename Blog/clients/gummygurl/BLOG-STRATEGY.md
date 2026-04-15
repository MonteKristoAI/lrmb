# GummyGurl Blog Strategy V1

## 1. Business Context

**Company**: GummyGurl (Carolina Natural Solutions)
**Location**: North Carolina, USA. Ships nationwide where legal.
**Website**: gummygurl.com (React SPA on Lovable + WooCommerce backend)
**Owner**: Seamus McKeon - Graphic Designer/Production Specialist, handles product creation and packaging
**Revenue Model**: Direct e-commerce sales + subscription recurring revenue (10% off)
**Current Blog**: None. Zero blog content. Everything must be built from scratch.

**Products** (49 across 6 brands):
- Gummy Gurl: THC edibles (gummies, cookies, chocolates, specialty) - 23 products
- Nature Gurl: Pet CBD treats - 3 products
- Lifted Labs: Mushroom products, functional edibles - 3 products
- Phyto Kinetics: CBN + CBD sleep/wellness - 1 product
- Good Karma: CBD tinctures, topicals, caffeine gummies - 8 products
- Rize: Mushroom gummies + chocolate - 3 products
- THCA Flower: 9 strains (Sativa, Hybrid, Indica)
- Bundles: 3 curated sets

**CRITICAL INDUSTRY EVENT**: Federal hemp redefinition effective November 12, 2026. Total THC limit (not just delta-9) caps at 0.3% per dry weight AND 0.4mg per container. This effectively bans ~80% of GummyGurl's current catalog. Blog strategy must account for this 7-month runway.

---

## 2. SERP Reality Check

| Query Type | What Google Shows | Our Strategy |
|-----------|------------------|-------------|
| "delta-8 vs delta-9" | Blog posts, educational guides | Blog posts (primary target) |
| "best delta-8 gummies 2026" | Review roundups, listicles | Blog posts (product authority) |
| "THCA flower effects" | Educational guides, how-to | Blog posts (education) |
| "CBD for dogs anxiety" | Vet-reviewed guides, dosing | Blog posts (pet wellness) |
| "is delta-8 legal in [state]" | State guides, legal articles | 50 state pages (massive opportunity) |
| "mushroom gummies legal" | Legal explainers, comparisons | Blog posts (differentiation) |
| "CBN for sleep" | Health/wellness sites | Blog posts (backed by 2025 meta-analysis) |
| "hemp ban 2026" | News articles, legal analysis | Blog posts (URGENT - time-sensitive) |

**Verdict**: Blog posts CAN rank for all target queries. No Maps pack interference (e-commerce, not local service).

---

## 3. Blog Architecture (Technical)

**Platform**: Static HTML + Cloudflare Workers Reverse Proxy (Pattern P-002)
**Why not WordPress blog**: Separate blog repo keeps WooCommerce complexity isolated. Static HTML = 10x faster TTFB, zero security patches, zero plugin conflicts, guaranteed Google indexation without JS dependency. Blog Agent already outputs HTML.
**URL structure**: `gummygurl.com/blog/[slug]/`
**Build pipeline**: Write in Claude Code -> commit to `gummygurl-blog` repo -> auto-deploy via CF Pages -> Seamus reviews
**Deployment**: Cloudflare Pages (auto-deploy on push to main)
**Repo**: `MonteKristoAI/gummygurl-blog` (separate from WooCommerce)
**Worker**: CF Worker routes `/blog/*` to `gummygurl-blog.pages.dev`
**Build**: `node build.js` generates index, sitemap.xml, RSS from `/posts/*.html`

### Architecture
```
gummygurl.com/blog/*  ->  CF Worker proxy  ->  gummygurl-blog.pages.dev
gummygurl.com/*       ->  WordPress/WooCommerce (SiteGround, unchanged)
```

---

## 4. Buyer Personas

| Persona | Description | Content Needs | AOV |
|---------|-------------|---------------|-----|
| **Curious Newcomer** | 21-35, never tried hemp edibles, found through social media or friend recommendation | Dosing guides, "what to expect", beginner products, legality questions | $15-30 (starter products) |
| **Experienced User** | 25-45, regular cannabis/hemp user, shops online, compares products | Product comparisons, strain reviews, high-potency guides, deals | $40-80 (multi-product, subscriptions) |
| **Wellness Seeker** | 30-55, interested in CBD/CBN for sleep, pain, anxiety. Less interested in "getting high" | Sleep guides, CBD education, tincture dosing, scientific research | $25-50 (wellness products) |
| **Pet Parent** | 28-50, dog/cat owner seeking natural anxiety/joint solutions | Pet CBD guides, vet-cited dosing, breed-specific advice, safety | $30 (pet treats) |
| **THCA Connoisseur** | 25-40, experienced, specifically seeks THCA flower, knows strains | Strain reviews, terpene profiles, growing methods, potency comparisons | $50-250 (flower by weight) |
| **Dispensary Refugee** | 21-40, currently buying from dispensaries, switching to legal hemp for cost/access/drug testing reasons | "Legal alternative to dispensary", hemp vs dispensary comparisons, drug test guides | $40-80 (regular buyer, high LTV) |

---

## 5. Content Architecture

### 5 Clusters (consolidated from 8 per L10 critic -- depth beats breadth for zero-authority domain)

| Cluster | Posts Y1 | Revenue Focus | Priority | Hub Post |
|---------|----------|---------------|----------|----------|
| 1. THC Education & Comparisons | 14 | A (product links, brand listicles) | Phase 1 | "The Complete Guide to Hemp THC Edibles" |
| 2. THCA Flower Guides | 8 | A (strain-specific product links) | Phase 1 | "THCA Flower: What It Is, How It Works" |
| 3. Wellness, Sleep & Mushroom | 14 | A+B (CBD/CBN/mushroom products) | Phase 1-2 | "CBD, CBN, and Mushroom Edibles Guide" |
| 4. Pet CBD | 6 | A (Nature Gurl product links) | Phase 1-2 | "CBD for Dogs: The Complete Guide" |
| 5. Regulatory, Legal & Post-Ban | 10 | B+A (email capture, urgency, pivot products) | Phase 1 (URGENT) | "2026 Hemp Ban: What Changes" |

**Why 5 not 8:** Google rewards depth for new domains in YMYL-adjacent niches. With 40 posts across 5 clusters, the average cluster has 8+ posts. Top 3 clusters have 10-14 posts each. That signals topical authority with zero cannibalization.

**Merged:** Mushroom → Wellness (same buyer persona). Post-Ban Survival → Regulatory (same topic, different time horizons). Brand Comparisons → THC Education (same audience funnel).

**Total Year 1**: 40 posts (compressed pre-ban, steady post-ban -- reduced from 52 per L100)
**Revenue tier mix**: 60% Tier A, 25% Tier B, 15% Tier C

**PRIMARY KPI: Email signups.** Organic traffic for THC terms has a 7-month shelf life. The blog's real job is building an email list that survives the November ban. Every KPI table leads with email signups, not organic sessions.

**CRITICAL CALENDAR CONSTRAINT**: All THC/THCA/delta-8 content must be live and indexing by July 2026 (4 months before ban). All regulatory/ban content must be indexed by July to capture the panic-search wave. Months 6-7 = wellness/mushroom/pet authority building.

---

## 6. Publishing Schedule

### Phase 1: Months 1-2 (10 posts -- hubs first, high-CVR posts, regulatory urgency)

Hub pages publish FIRST in each cluster. Every spoke links up to its hub from day one.

| # | Title | Cluster | Template | Tier | Target Keyword | Role |
|---|-------|---------|----------|------|---------------|------|
| 1 | Delta-8 vs Delta-9: The Complete Guide to Hemp THC Edibles | THC Education | Long-form | A | delta-8 vs delta-9 | HUB |
| 2 | The 2026 Hemp Ban Explained: What Changes, What's Still Legal | Regulatory/Legal | Data piece | A | hemp ban 2026 | HUB |
| 3 | THCA Flower: What It Is, How It Works, and Where It's Legal | THCA Flower | Long-form | A | thca flower guide | HUB |
| 4 | CBD for Dog Anxiety: Dosing Guide by Weight and Breed | Pet CBD | Long-form | A | cbd for dogs anxiety | HUB |
| 5 | Best Delta-8 Gummies 2026: Lab-Tested Brands Ranked | THC Education | Data piece | A | best delta-8 gummies 2026 | High CVR |
| 6 | Best Delta-8 Gummies for Beginners: Dosing Guide and Product Picks | THC Education | Story-led | A | best delta-8 gummies beginners | High CVR |
| 7 | CBN for Sleep: What the Science Says About Cannabinol Gummies | Wellness/Mushroom | Long-form | A | cbn for sleep | Spoke |
| 8 | What Happens to Hemp Products After November 2026? | Regulatory/Legal | Story-led | A | hemp products after 2026 | Urgency |
| 9 | THCA Flower Strains Ranked: Sativa, Hybrid, and Indica Guide | THCA Flower | Data piece | A | thca flower strains | Spoke |
| 10 | Hemp-Derived THC vs Dispensary: Legal Alternatives That Ship Nationwide | THC Education | Short direct | A | hemp thc vs dispensary | Dispensary Refugee |

### Phase 1B: Month 3 (6 posts -- wellness hub, mushroom anchor, email capture)

| # | Title | Cluster | Template | Tier | Role |
|---|-------|---------|----------|------|------|
| 11 | CBD, CBN, and Mushroom Edibles: The Complete Wellness Guide | Wellness/Mushroom | Long-form | A | HUB |
| 12 | Delta-8 Edibles: How Long Do They Take to Kick In? | THC Education | Short direct | A | Spoke |
| 13 | Best Delta-8 Gummies Brands Compared: Lab-Tested Options | THC Education | Data piece | A | High CVR |
| 14 | How to Read a Certificate of Analysis (COA) for Hemp Products | THC Education | Short direct | A | Spoke |
| 15 | 5000mg CBD Tincture vs Gummies: Which Delivery Method Works Better? | Wellness/Mushroom | Data piece | A | Spoke |
| 16 | CBD Treats for Dogs with Joint Pain: What Actually Works | Pet CBD | Story-led | A | Spoke |

### Phase 2: Months 4-5 (12 posts -- complete THC content before ban window)

All remaining THC/THCA/delta-8 content must be published and indexing by end of month 5.

| # | Title | Cluster | Template | Tier |
|---|-------|---------|----------|------|
| 17 | Delta-8 Brand Comparison 2026: Top 5 Lab-Tested Options | THC Education | Data piece | A |
| 18 | THCA vs THC: What's the Difference and Why It Matters | THCA Flower | Long-form | A |
| 19 | Best THC Gummies for Pain Relief in 2026 | THC Education | Long-form | A |
| 20 | Is Delta-8 Legal in Your State? 2026 State-by-State Guide | Regulatory | Long-form | B |
| 21 | Mushroom Gummies vs THC Gummies: Effects, Legality, Uses | Wellness/Mushroom | Data piece | B |
| 22 | How Much Delta-8 Should I Take? Complete Dosing Chart | THC Education | Short direct | A |
| 23 | CBN vs CBD for Sleep: Which Cannabinoid Works Better? | Wellness/Mushroom | Long-form | A |
| 24 | Best THCA Flower Strains for Relaxation | THCA Flower | Story-led | A |
| 25 | Delta-8 Chocolate vs Gummies: Which Hits Better? | THC Education | Data piece | A |
| 26 | CBD Oil for Senior Dogs: Dosing and Safety Guide | Pet CBD | Long-form | A |
| 27 | Subscribe & Save: Why Subscription Edibles Beat One-Time Buys | Regulatory/Legal | Story-led | A |
| 28 | Hemp Edibles and Drug Tests: What You Need to Know | THC Education | Short direct | B |

### Phase 3: Months 6-7 (8 posts -- post-ban pivot, email capture urgency)

ZERO new THC content. 100% focused on: (a) products that survive the ban, (b) email list urgency, (c) mushroom/CBD/CBN authority.

| # | Title | Cluster | Template | Tier |
|---|-------|---------|----------|------|
| 29 | What GummyGurl Is Selling After the 2026 Hemp Ban | Regulatory/Legal | Long-form | A |
| 30 | How We Make Our Gummies: Behind the Scenes at Carolina Natural Solutions | Regulatory/Legal | Story-led | B |
| 31 | The Complete Guide to Functional Mushroom Edibles | Wellness/Mushroom | Long-form | A |
| 32 | Mushroom Gummies vs Psilocybin: Legal Status and Key Differences | Wellness/Mushroom | Data piece | B |
| 33 | CBD, CBN, and CBG: Which Cannabinoid Is Right for You? | Wellness/Mushroom | Long-form | A |
| 34 | 10 Signs Your CBD Pet Treats Are Working | Pet CBD | Short direct | B |
| 35 | Best Legal Alternatives to THC Edibles After 2026 | Wellness/Mushroom | Story-led | A |
| 36 | November 2026 Hemp Law Update: What Just Changed | Regulatory | Data piece | B |

### Phase 4: Months 8-12 (16 posts -- post-ban steady state)

Shift to wellness, mushroom, pet CBD, and state-specific content. Ongoing: 3 posts/month (2 new + 1 refresh).

---

## 6B. Review Protocol (L10 fix -- health/dosing liability)

Hemp content with dosing recommendations and health claims carries real liability. One incorrect dosing claim could result in a product liability issue.

**Review layers:**
1. **MonteKristo AI (Blog Agent):** Writes post, verifies all statistics against cited sources, runs quality gates
2. **Seamus McKeon:** Reviews brand voice, product accuracy, pricing. 48h SLA.
3. **Health/dosing claims rule:** No dosing number without a cited source (published study, manufacturer recommendation, or standard industry guidance). "We recommend" language is banned -- use "many users report" or "research suggests" framing.

**Claims the blog WILL make (with citations):**
- Onset times and duration (citing published pharmacology)
- Cannabinoid comparisons backed by peer-reviewed research
- Product ingredients, prices, and COA data (first-party source)
- Legal status based on statute citations

**Claims the blog will NOT make:**
- Medical treatment claims ("treats anxiety", "cures pain")
- Specific dosing prescriptions ("take 25mg for sleep")
- Superiority claims without data ("better than any other brand")
- Implied FDA approval or medical endorsement

---

## 7. Content Specifications

### 4 Template Types (Pattern P-005: mandatory variation)

| Template | Word Count | Structure | Use When |
|----------|-----------|-----------|----------|
| A: Long-form Guide | 2,500-3,500 | Intro → Key Takeaways → 5-7 sections → FAQ → CTA | Educational deep-dives, "ultimate guide" |
| B: Short Direct Answer | 1,200-1,800 | Answer first → Supporting evidence → Product link → FAQ | Single question ("how long", "is it legal") |
| C: Story-led | 1,800-2,500 | Scenario hook → Problem → Solution → Products → Conclusion | Personal angle, "first time user" stories |
| D: Data Piece | 1,500-2,200 | Key stat → Data table/chart → Analysis → Implications → CTA | Comparisons, rankings, research summaries |

**Variation rule**: Never 3+ consecutive posts with same template. Rotate A-B-C-D.

### Every Post Must Include:
- Meta title (55-60 chars) + meta description (150-155 chars)
- Key Takeaways box (3-5 bullet points after intro)
- At least 1 product link with price
- At least 1 internal link to another blog post
- FAQ section (3-5 questions, schema-ready)
- Compliance disclaimer footer
- Author bio (Seamus or brand team)

---

## 8. E-E-A-T Framework

### Experience
- Product-specific firsthand testing descriptions
- "Our team tested [product] and found..." framing
- Photos of actual products with COA documents
- Customer testimonials and review excerpts

### Expertise
- Third-party lab testing (all products have COAs)
- Cannabinoid science citations (PubMed, university research)
- Dosing guides backed by clinical data (Cornell CBD study, 2025 Sleep Medicine Reviews meta-analysis)
- Detailed product composition knowledge (ingredients, formulations)

### Authoritativeness
- Lab Reports page with all COAs accessible
- Partnership with Carolina Natural Solutions (established NC company)
- 6 specialized brands (signals depth, not generic reselling)
- Regulatory content shows industry awareness

### Trust
- Privacy Policy, Terms of Service, Shipping Policy, Return Policy (all live)
- hello@gummygurl.com + orders@gummygurl.com (real contact)
- Farm Bill compliance statements on every page
- 21+ age verification gate
- SSL certificate (Let's Encrypt)

---

## 9. Conversion Path Design

### CTA Types by Content:
| Content Type | Primary CTA | Secondary CTA |
|-------------|-------------|---------------|
| Product comparison | "Shop [Winner]" button | "Subscribe & Save 10%" |
| Educational guide | "Browse Products" button | Newsletter signup popup |
| Dosing guide | "Start with [beginner product]" link | "Take our quiz" (future) |
| Legal/regulatory | Newsletter signup | "Bookmark this page" |
| Pet CBD | "Shop Pet Products" button | "Calculate your pet's dose" (future) |

### Conversion Flow:
1. Blog post → product link (direct purchase)
2. Blog post → email capture (Klaviyo popup: 10% off first order)
3. Blog post → Subscribe & Save CTA (recurring revenue)
4. Blog post → Lab Reports page (trust building → eventual purchase)

### Tracking:
- UTM parameters on all blog-to-product links
- Klaviyo "Viewed Product" events from blog clicks
- WooCommerce order attribution (source=blog)

### Cross-Domain Tracking (CRITICAL -- L10 fix)
The blog is served from CF Pages (proxied as `/blog/`), the store runs on SiteGround/WooCommerce. Without explicit cross-domain setup, GA4 cannot attribute blog traffic to WooCommerce orders.

**Setup required:**
1. GA4 cross-domain measurement: add both `gummygurl.com` (store) and `gummygurl-blog.pages.dev` (CF Pages origin) to GA4 cross-domain configuration
2. Since CF Worker proxies `/blog/*` as same domain, GA4 should treat blog and store as same property. Verify with GA4 DebugView that `page_location` shows `gummygurl.com/blog/...` (not the `.pages.dev` origin)
3. UTM parameters persist across the proxy: `?utm_source=blog&utm_medium=post&utm_campaign={slug}` on all product links
4. Klaviyo tracks across both: newsletter signup forms on blog use same Klaviyo list (XZJniy) with `source:blog` tag

---

## 10. Measurement Stack

### Tools:
- **GA4**: Blog traffic, session duration, product page clicks
- **Google Search Console**: Rankings, impressions, CTR
- **Klaviyo**: Email signups from blog, email-attributed revenue
- **WooCommerce**: Orders with blog referral source

### Leading Indicators:
- Indexed pages (GSC)
- Keyword positions for target terms
- Blog-to-product click-through rate
- Email signup rate from blog visitors

### Monthly Review (run by MonteKristo AI, delivered to Seamus):
- **Email signups from blog** (PRIMARY KPI)
- Posts published vs plan
- Organic sessions trend
- New keywords ranking (positions 1-20)
- Blog-attributed revenue

### Decision Triggers:
- Post gets 0 impressions after 4 weeks → check indexing
- Post ranks 11-20 → refresh + add internal links
- Traffic drops 30%+ on any post → immediate refresh
- New regulation news → publish within 48 hours

---

## 11. Internal Linking Architecture

### Hub-Spoke Model:

**Hub 1**: "Hemp Edibles Guide" (links to all THC education posts)
**Hub 2**: "THCA Flower Guide" (links to all strain reviews)
**Hub 3**: "Pet CBD Guide" (links to all pet content)
**Hub 4**: "Hemp Legality Center" (links to all regulatory content)

### Rules:
- Every spoke links UP to its hub
- Hub links to all its spokes
- Cross-cluster links where relevant (e.g., CBN sleep → THC edibles for sleep)
- Every post links to at least 1 product page
- Product pages link back to relevant blog posts (via WooCommerce)

---

## 12. AI/GEO Readiness

### Entity Definition (on every post):
"GummyGurl is a hemp-derived edibles brand operated by Carolina Natural Solutions in North Carolina, offering lab-tested THC, CBD, CBN, mushroom, and pet wellness products across six specialized brands."

### GEO Priority Posts (designed for AI citation):
1. Delta-8 vs Delta-9 comparison (definitional query)
2. THCA flower explainer (emerging topic, few authoritative sources)
3. CBN for sleep (science-backed, citable data)
4. How to read a COA (unique expertise angle)
5. 2026 hemp ban explainer (breaking/timely content)

### Citable Passage Structure:
Every post contains at least 2 self-contained passages (120-180 words) that directly answer a question with cited sources. These are formatted as standalone paragraphs that AI can extract and cite.

### Schema per Post:
- BlogPosting (every post)
- FAQPage (every post with FAQ section)
- Product (when specific products mentioned)
- BreadcrumbList (navigation)

---

## 13. Defensibility Moat

### Two Real Moats (L10 revised -- everything else is copyable in 2 weeks):

**MOAT 1: Speed to index.** GummyGurl can be first to publish comprehensive ban-related content tied to specific product alternatives. The window closes by July 2026. If we have 10+ ban/regulatory posts indexed before competitors react, we own the "hemp ban" SERP for the critical panic-search wave (Aug-Nov). This requires all regulatory + post-ban content live by July, not Phase 3.

**MOAT 2: Email list.** The only asset that survives the November ban. When organic traffic for THC terms collapses, the email list becomes the primary revenue channel. Every blog post should drive email signups. Target: 500 subscribers by month 3, 2,000 by month 7. The list is worth more than the traffic.

### Supporting advantages (real but copyable):
- 6 brands = breadth no single-brand competitor matches
- COA transparency with walkthrough content
- Pet CBD dedicated line (different audience funnel)
- Production knowledge from Seamus (behind-the-scenes content)

### Email List as Moat:
The blog's #1 strategic goal (beyond sales) is building an email list before November 2026. When the federal ban hits and organic traffic for THC terms drops, the email list becomes the primary revenue channel. Every blog post should drive email signups.

### Email Capture Operationalization:

| Mechanism | Where | Incentive |
|-----------|-------|-----------|
| Klaviyo popup | Every blog page (after 30s or 50% scroll) | 10% off first order |
| Inline CTA box | Bottom of every THC/THCA post | "Get notified when hemp law changes" |
| Gated content: Pre-Ban Buyer's Guide | Post #3 (dedicated lead magnet) | Free PDF download |
| Quiz: "Which GummyGurl Product Is Right For You?" | Sidebar widget on all posts | Personalized product recommendation |
| "Stock Up" urgency banner | All blog pages from August 2026 | "Last chance before Nov 12 law change" |

**Realistic email capture math (L100 fix):**
- Blog organic at 5-8% signup rate = 400-600 subscribers by month 7 (from ~7,000 cumulative sessions)
- Post-ban churn: THC-only subscribers leave when products disappear. Surviving engaged list: ~300-400
- **To hit 2,000 subscribers: add paid acquisition.** $500/month Meta ads to "Pre-Ban Buyer's Guide" lead magnet = 125-250 leads/month at $2-4 CPL. 5 months of paid = 625-1,250 leads + 400-600 organic = 1,000-1,850 total
- Blog's job = SEO authority + organic sales support. Email list grows from paid + organic combined.

**Klaviyo flow architecture (L100 fix):**
1. **Welcome sequence** (post-signup): 3 emails over 7 days. Product education + 10% discount + COA transparency
2. **Pre-ban urgency sequence** (triggers October 2026): 5 emails over 4 weeks. "Stock up" messaging + product recommendations + subscription CTA
3. **Post-ban pivot sequence** (triggers November 2026): 3 emails. "What's still available" + mushroom/CBD/pet product spotlight + brand story

Tag all blog subscribers with `source:blog` and `cluster:{cluster-name}` for segmentation.

---

## 14. Content Decay Protocol

| Trigger | Action | Timeline |
|---------|--------|----------|
| New regulation/law | Update legal posts + publish new post | Within 48 hours |
| Product price change | Update all posts mentioning that product | Within 1 week |
| New product launch | Publish product spotlight post | Within 2 weeks |
| Seasonal event (4/20, holidays) | Publish seasonal content | 2 weeks before |
| Traffic drops 30%+ on any post | Full refresh (update data, add sections) | Within 2 weeks |
| Post older than 6 months with stale data | Scheduled refresh | Quarterly review |
| November 2026 ban takes effect | Major content pivot across all THC posts | Pre-planned (October) |

### Post-Ban THC Content Protocol (L100 fix)

After November 12, 2026, all THC/delta-8/THCA posts contain legally outdated product info.

**Execute by October 15, 2026:**
1. Add "UPDATE: November 2026" banner to top of every THC post: "Federal law changed. THC products in this article may no longer be available. See our post-ban guide for what's still legal."
2. Replace all THC product links with links to post-ban alternatives (mushroom, CBD, CBN, pet)
3. Keep posts indexed (they attract "what happened to delta-8" traffic) but redirect conversion path to surviving products
4. Do NOT noindex or delete -- posts have accumulated authority. Add disclaimer, redirect CTAs.
5. After 6 months post-ban (May 2027): evaluate. If a THC post has zero traffic, 301 redirect to nearest surviving cluster post.

---

## 15. KPIs

### Pre-Ban Phase: 3-Month Targets (10 posts published)
- **Email signups: 100+ from blog organic** (PRIMARY KPI)
- 10 blog posts live and indexed
- 300+ organic sessions/month
- 10+ keywords in positions 1-30
- $200+ in blog-attributed revenue
- Cross-domain GA4 tracking verified working

### Pre-Ban Phase: 6-Month Targets (24 posts published)
- **Email signups: 400-600 organic + 600-1,200 paid = 1,000-1,800 total**
- 24 blog posts live (reduced from 28 per L100 -- quality over quantity)
- 1,500+ organic sessions/month
- 30+ keywords in positions 1-20
- $800+ in blog-attributed revenue
- 2+ posts ranking page 1 for long-tail keywords (KD < 30)

### Post-Ban Phase: 12-Month Targets (40 posts published)
- **Email list: 1,500-2,000 total (300-400 engaged post-ban survivors)**
- 40 blog posts live (reduced from 52 per L100 -- zero cannibalization)
- 2,000-4,000 organic sessions/month (traffic shifts to wellness/mushroom/pet)
- 60+ keywords in positions 1-20
- $1,000+ in combined blog + email revenue
- Post-ban content protocol executed (THC posts updated with disclaimers + redirected product links)
- Mushroom + CBD/CBN + pet CBD clusters covering 60%+ of traffic

### Kill Switch Criteria (L100 fix)
If month 4 shows fewer than 200 organic sessions AND zero email signups from blog, pause content production and reassess. Do not continue bleeding investment into a channel that shows no traction.

### Revenue Model (Realistic per L10 -- segment by post type):

| Post Type | Expected CVR | Example Posts |
|-----------|-------------|---------------|
| Brand comparison / listicle | 2-3% | #5, #13 |
| Beginner dosing guide | 1-2% | #6, #12 |
| Product-focused education | 0.5-1% | #1, #7, #9 |
| Regulatory / legal | 0.1-0.3% (email capture focus) | #2, #8 |

- Average blended CVR months 1-6: 0.7% (new domain, building trust)
- Average order value: $35 (subscription: $31.50)
- Month 6 (pre-ban): 1,500 sessions x 0.7% x $35 = $368/month direct + email list value
- Month 12 (post-ban): 4,000 sessions x 0.8% x $30 = $960/month direct
- Email list revenue: 2,000 subs x 25% open rate x 1.5% click-to-purchase x $30 = $225/month
- Combined month 12: ~$1,185/month from blog + email (conservative floor)
- **The email list's real value is retention**: 2,000 engaged subscribers who know and trust GummyGurl survive the organic traffic cliff in November

### Backlink Acquisition Plan (L100 revised -- realistic targets)
- NC business press outreach: hemp ban angle as local business story (target: 1-2 placements)
- Pet blogger outreach: Nature Gurl product reviews (target: 2-3 pet/wellness bloggers)
- University cannabis research citation outreach: link to our cited research roundups (target: 1-2)
- Industry directory submissions: Hemp Industries Association, USHR, NC hemp association
- Local NC business directory listings (Chamber of Commerce, BBB)
- **Target: 5-8 referring domains in first 6 months** (realistic for hemp niche where mainstream publishers avoid linking to THC product sites)
- Note: HARO is effectively dead (replaced by Connectively, pay-to-play). Do not rely on it.
