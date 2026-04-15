# AiiAco Round 4 — Deep SEO Audit Findings

**Date**: 2026-04-11
**Scope**: Comprehensive technical + content + schema + AEO audit after Round 3 completion
**Baseline**: Round 3 code state (committed to github.com/MonteKristoAI/aiiaco)

---

## Critical context

**Live aiiaco.com is still running Round 1 code.** Verified via WebFetch on the live URL:
- Title tag reads "AiiA | Remove Operational Friction..." (old Round 1 placeholder, should be "AiiAco | AI Integration Company...")
- Only 3 JSON-LD schemas present (Organization, WebSite, ProfessionalService). Round 2 added Person + Offers; Round 3 added SearchAction + audience + hasOfferCatalog. None of it is live.
- No mention of "AI revenue system" anywhere on the homepage. The 5 Round 2 service pages do not exist on the live site.
- OG image still served from Manus CloudFront, not self-hosted.

Everything in this document is improvements to the local working copy that will take effect once Round 2 + 3 + 4 ships via the Manus sync path (Bucket A).

---

## Severity definitions

- **CRITICAL** = SEO regression, broken crawler signal, or factually wrong data. Fix immediately.
- **HIGH** = Significant ranking opportunity lost or best-practice violation with measurable impact.
- **MEDIUM** = Quality improvement with moderate impact.
- **LOW** = Polish, nice-to-have, or future proofing.

---

## CRITICAL findings (4)

### C1. 16 of 24 meta descriptions exceed 165 characters — Google will truncate
**File**: `client/src/seo/seo.config.ts`

Google shows meta descriptions up to ~160 characters in SERPs. Longer descriptions get truncated mid-sentence. Current status:

| Route | Current length | Status |
|---|---|---|
| `/` | 201 chars | Truncated |
| `/method` | 179 chars | Truncated |
| `/industries` | 188 chars | Truncated |
| `/models` | 198 chars | Truncated |
| `/case-studies` | 194 chars | Truncated |
| `/results` | 171 chars | Truncated |
| `/ai-integration` | 199 chars | Truncated |
| `/ai-implementation-services` | 193 chars | Truncated |
| `/ai-automation-for-business` | 190 chars | Truncated |
| `/ai-governance` | 169 chars | Truncated |
| `/ai-crm-integration` | 232 chars | Badly truncated |
| `/ai-workflow-automation` | 223 chars | Badly truncated |
| `/ai-revenue-engine` | 222 chars | Badly truncated |
| `/ai-for-real-estate` | 210 chars | Badly truncated |
| `/ai-for-vacation-rentals` | 230 chars | Badly truncated |
| `/workplace` | 178 chars | Truncated |

**Fix**: Rewrite all 16 to 140-160 chars with primary keyword in first 120 chars.

### C2. 10 of 24 titles outside optimal 50-65 char range
**File**: `client/src/seo/seo.config.ts`

Google truncates titles over ~60 chars. Too short titles waste prime SERP real estate.

| Route | Current | Length | Status |
|---|---|---|---|
| `/` | 81 | Truncated |
| `/industries` | 75 | Truncated |
| `/models` | 82 | Badly truncated |
| `/ai-revenue-engine` | 69 | Slightly truncated |
| `/ai-for-real-estate` | 80 | Truncated |
| `/ai-for-vacation-rentals` | 66 | Slightly truncated |
| `/workplace` | 73 | Truncated |
| `/privacy` | 23 | Too short |
| `/terms` | 25 | Too short |
| `/talk` | 35 | Too short |

**Fix**: Rewrite 7 long titles to 55-60 chars, expand 3 short ones to 50+ chars.

### C3. AIImplementationPage and AIGovernancePage have FAQSection but no FAQPage schema dispatcher
**File**: `client/src/seo/StructuredDataSSR.tsx`

Round 2 added FAQPage dispatchers for 9 routes: /method, /manifesto, /ai-integration, /ai-automation-for-business, /ai-crm-integration, /ai-workflow-automation, /ai-revenue-engine, /ai-for-real-estate, /ai-for-vacation-rentals.

But `client/src/pages/AIImplementationPage.tsx` and `client/src/pages/AIGovernancePage.tsx` both import `FAQSection` and render FAQs on-page. Google requires FAQPage schema for those FAQs to qualify for rich results. Right now their FAQs are invisible to the Rich Results Test.

**Fix**: Add two new dispatcher entries in `StructuredDataSSR.tsx` with the actual FAQ content from those pages.

### C4. Sitemap has zero `<image:image>` entries despite 70 local images
**File**: `client/public/sitemap.xml`

Google Image Search uses image sitemaps. We have 35 WebP + 35 AVIF files shipping but no image sitemap declarations.

**Fix**: Add `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` to urlset, then add `<image:image><image:loc>` entries for logo, OG default, and hero background on every relevant page.

---

## HIGH findings (8)

### H1. No `/blog` route exists anywhere
**Scope**: Site-wide

User explicit request for this round. No `BlogPosting` schema, no `/blog` listing page, no posts. Missing the #1 long-term SEO lever (content engine) that 2026 AEO best practices consistently rank as the highest-ROI signal.

**Fix**: Phase 2 of this round creates `/blog` + 3 seed posts inside the main aiiaco.com React app (consistent with existing design system) rather than as a separate Astro subdomain.

### H2. Bundle main chunk 1.76 MB (453 KB gzipped)
**File**: `dist/public/assets/index-*.js`

Round 3 Phase 7 already added React.lazy for 13 admin/portal pages, but the main bundle is still large because the 20 eager routes + all shared components + framer-motion + lucide-react + all the Tailwind runtime stay in main.

Not a fix-today problem (we validated every route loads at HTTP 200), but worth noting: further code-splitting opportunities exist by lazy-loading CaseStudiesPage, CorporatePage, WorkplacePage, AgentPackagePage (all 500+ word pages that aren't on the primary pillar-spoke path).

**Fix**: Lazy-load 5-8 secondary public pages. Verify prerender still works for each.

### H3. No Article schema on CaseStudiesPage
**File**: `client/src/pages/CaseStudiesPage.tsx` + `client/src/components/caseStudies/caseStudies.data.ts`

5 case studies exist in `caseStudies.data.ts` but none are marked up as Article. Google's Top Stories and AI Overviews heavily cite Article-schema content. Case studies are the single highest-converting asset for B2B services and should be maximally crawlable.

**Fix**: Add per-case-study Article schema via `StructuredDataSSR` dispatcher on `/case-studies` route. Author = Nemr Person `@id` reference.

### H4. HowTo schema only on `/method`, not on `/ai-crm-integration` or `/ai-workflow-automation`
**File**: `client/src/seo/StructuredDataSSR.tsx`

Both `/ai-crm-integration` and `/ai-workflow-automation` explicitly contain "How to integrate AI into a CRM" and "How AI automates operations" 4-step processes — perfect HowTo schema candidates. They currently only have FAQPage schema. HowTo schema triggers rich results with step-by-step previews in Google SERPs.

**Fix**: Add HowTo dispatcher entries for these two routes alongside the existing FAQPage.

### H5. 5 case studies live as a single long page, not individual indexed routes
**Scope**: `/case-studies`

Each case study is a long-form deep-dive. Keeping them on one page caps each at ~400 words of SERP-visible content. Splitting into `/case-studies/:slug` with one full page per study would:
- Let each rank for its specific industry+outcome query
- Enable per-case-study Article schema
- Produce 5 new indexed URLs with 1000+ words each

**Fix**: Create IndividualCaseStudyPage.tsx + `/case-studies/:slug` route + per-page Article schema. Keep the hub page as a curated index.

### H6. `SearchAction` schema references a search endpoint that does not exist
**File**: `client/index.html` (Round 3 Phase 8 addition)

I added `potentialAction.SearchAction` with `urlTemplate: "https://aiiaco.com/?q={search_term_string}"`. The homepage does not actually handle a `q` query parameter. Google validates this against the live page — if the action returns a non-search result, it may count as broken markup.

**Fix**: Either build a minimal on-site search (filter pages by query) or remove the SearchAction (better to have no schema than a lying schema).

### H7. No BreadcrumbList on 7 top-level pages
**File**: `client/src/seo/StructuredDataSSR.tsx`

Round 2 added BreadcrumbList to industry pages and some pillar pages via dispatcher, but routes like `/workplace`, `/corporate`, `/agentpackage`, `/operator` (already noindex), `/results`, `/case-studies`, `/models` do not get BreadcrumbList. Each missing breadcrumb means Google cannot render the rich SERP breadcrumb display for that URL.

**Fix**: Add auto-generated BreadcrumbList fallback in StructuredDataSSR for every non-home path (2-level breadcrumb: Home > Page Name).

### H8. Homepage Hero uses `whileInView` + initial `opacity: 0` + Framer Motion
**File**: `client/src/components/HeroSection.tsx`

State docs already noted that Framer Motion + SSR produces invisible content. Round 2 addressed it via `prerender.mjs` post-processor regex. But on the live Manus-hosted site, Manus's own prerender does not run our post-processor, so Googlebot may see `opacity: 0` content. This is a *live site* regression from Round 1, not Round 3.

**Fix**: Patch HeroSection to use inline initial style that doesn't depend on Framer Motion post-processing. Add explicit `initial={false}` on the root motion container and delegate entry animation to a child. This removes the reliance on Manus's prerender behavior entirely.

---

## MEDIUM findings (9)

### M1. 61 `any` type usages across client/src
Type safety debt. Not an SEO issue directly, but narrow types would catch bugs that cause runtime errors → hydration mismatches → SEO issues. Too large for Round 4 scope.

### M2. No `/search` page exists (linked from H6)
Tied to H6. Building minimal on-site search would let SearchAction schema work + improve UX.

### M3. No humans-readable changelog or release notes
Google E-E-A-T rewards sites that show active maintenance. `/changelog` or `/releases` would signal freshness.

### M4. No video sitemap despite `/talk` hosting an MP4
File: `client/src/pages/TalkPage.tsx` references a remote MP4. Video sitemap would expose it to Google Video Search.

### M5. `nav` aria-label attributes could be more specific
Footer has `aria-label="Services navigation"` etc which is good. Navbar lacks aria-label on the top-level nav element.

### M6. No `rel="noopener"` audit on external links
Round 2 Footer uses `<a target="_blank" rel="noopener noreferrer">` in some places, but sitewide audit hasn't been done.

### M7. No `srcset` on non-hero images
Phase 1 generated responsive variants only for hero-bg, process-bg, team-bg. Icons and landmark illustrations ship a single-size WebP. Mobile users on slow connections download desktop-sized assets.

### M8. `/demo` and `/upgrade` still fail prerender (tRPC context missing)
Already documented in ROUND-3-CHANGES.md as pre-existing Round 2 issues. Would require wrapping entry-server.tsx in a minimal tRPC provider shim.

### M9. No `loading="lazy"` on images below the fold
`Picture` component defaults `loading="lazy"` but existing page imports passing raw `<img>` tags may not benefit.

---

## LOW findings (6)

### L1. No `X-Robots-Tag` HTTP header (can't set from static HTML)
Manus controls HTTP headers. Out of our direct control.

### L2. `color-scheme` meta added but no separate light/dark CSS variables
The site is dark-only. Adding a light mode would be out-of-scope rebuild.

### L3. No `preload` for critical WOFF2 fonts
The site uses system fonts (SF Pro, Segoe UI, system-ui) per `client/src/index.css` — no external font loads. Not an issue.

### L4. `humans.txt` references outdated 2026-04-11 date
Round 3 Phase 7 added this file. It will need periodic updates.

### L5. OG image single size (1200x630)
One OG image for every page. Per-page OG images (e.g., different hero for each service page) would increase social CTR but requires generative image pipeline.

### L6. No RSS/Atom feed (relevant once /blog exists)
Will be addressed in Phase 2 blog setup.

---

## What's already good (confirmed during audit)

- ✅ robots.txt has per-bot directives for 15+ crawlers including GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- ✅ PAGE_META has all 24 public routes in `seo.config.ts`
- ✅ Sitemap has lastmod, priority, changefreq on all 44 URLs
- ✅ Canonical URL logic correctly uses apex domain (never www)
- ✅ Organization/WebSite/ProfessionalService/Person schemas all valid JSON-LD
- ✅ BreadcrumbList, FAQPage, Service schemas present on industry pages
- ✅ `/manifest.json`, `/humans.txt`, `/.well-known/security.txt` all served
- ✅ preconnect + dns-prefetch + preload hero image in index.html
- ✅ All images self-hosted (except 1 video and 8 audio files on noindex page)
- ✅ Zero em-dashes, zero en-dashes, zero `AiiACo` in marketing copy
- ✅ Internal linking: all 5 new service pages have 5-14 incoming links
- ✅ 41 of 45 routes prerender successfully
- ✅ All 20 industries populated with directAnswer, regulations, platforms, roles, faq
- ✅ Accessibility: skip link, aria-expanded, aria-modal, aria-label
- ✅ TeamSection founder block active on /manifesto

---

## Round 4 execution plan

### Priority 1 — Critical fixes (2-3 hours)
1. Rewrite all 16 overlong meta descriptions to 140-160 chars
2. Rewrite all 10 out-of-range titles to 50-65 chars
3. Add FAQPage dispatchers for `/ai-implementation-services` and `/ai-governance`
4. Add `<image:image>` entries to sitemap.xml

### Priority 2 — /blog infrastructure (4-6 hours)
5. Create `client/src/pages/BlogIndexPage.tsx` (listing)
6. Create `client/src/pages/BlogPostPage.tsx` (individual post)
7. Create `client/src/data/blog.ts` (post catalog with frontmatter + MDX-like content)
8. Add 3 seed posts as TypeScript modules (real industry content, not placeholders):
   - "What is an AI revenue system?" (pillar, 2000+ words, targets zero-competition keyword)
   - "How to integrate AI into a real estate CRM" (vertical + how-to, 1800 words)
   - "What real estate brokerages get wrong about AI" (opinion / thought leadership, 1500 words, Nemr byline)
9. Add `/blog` and `/blog/:slug` routes to App.tsx + entry-server.tsx
10. Add BlogPosting schema dispatcher in StructuredDataSSR.tsx
11. Create RSS feed at `/feed.xml` (static generation via prerender script extension)
12. Add sitemap entries for blog posts + feed
13. Link /blog in Navbar + Footer
14. Integrate RelatedServices on blog posts

### Priority 3 — Schema and structural fixes (2-3 hours)
15. Add HowTo dispatchers for `/ai-crm-integration` and `/ai-workflow-automation`
16. Add Article schema dispatcher for `/case-studies`
17. Add BreadcrumbList fallback for every non-home page via `StructuredDataSSR.tsx`
18. Remove or fix SearchAction (decide: build minimal /?q= handler vs remove schema)

### Priority 4 — Build-time improvements (1-2 hours)
19. Add 5-8 more public pages to React.lazy
20. Add responsive `srcset` generation for icons (optimize-images.mjs)

### Priority 5 — Final verification (30 min)
21. TypeScript clean
22. pnpm build + prerender — verify 41+ routes + 3+ new blog routes render
23. Commit + push phases independently

---

## Expected outcome after Round 4

1. Every public meta tag is search-optimized (50-60 char titles, 140-160 char descriptions)
2. Every public page has at least 2 relevant JSON-LD schema types (Organization/WebSite global + page-specific)
3. `/blog` exists with 3 seed posts and proper schema
4. Google Rich Results Test passes for: homepage, all 5 Round 2 service pages, /ai-integration, /ai-implementation-services, /ai-governance, /case-studies, /blog, every industry page
5. Sitemap exposes 44 + 3 blog + case-study slugs = 50+ URLs with image entries
6. Ready for deployment to Manus or Vercel with zero known SEO regressions

---

## Sources (2026 AEO research)

- [Green Flag Digital - AEO Best Practices 2026](https://greenflagdigital.com/aeo-best-practices/)
- [GenOptima - AEO in SEO 2026](https://www.gen-optima.com/blog/aeo-in-seo-how-answer-engine-optimization-integrates-with-ai-search-2026/)
- [SEO Clarity - 2026 SEO & AEO Strategies for Enterprises](https://www.seoclarity.net/blog/2026-seo-aeo-strategies)
- [DOJO AI - Complete AEO Guide](https://www.dojoai.com/blog/answer-engine-optimization-aeo-guide-dynamic-ai-seo)
