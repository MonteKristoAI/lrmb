# AiiAco Round 3 - Change Summary

**Date**: 2026-04-11
**Status**: CODE COMPLETE LOCALLY. Not yet shipped to live aiiaco.com.
**Commits**: 11 phase commits on `main` at `github.com/MonteKristoAI/aiiaco`
**TypeScript**: 0 errors throughout
**Build + SSR + Prerender**: 41 of 45 routes prerender successfully (4 pre-existing Round 2 errors)

---

## Why Round 3

After Round 1 and Round 2 fixed the critical SEO bugs and added 5 new service pages, a deep sitewide audit surfaced three classes of debt that Round 2 had not addressed:

1. **A time bomb.** Hero, HowItWorks, and TeamSection backgrounds were referencing Manus CDN signed URLs with an expiry of 2026-11-01. After that date those sections would render blank on the live site. No local fallback existed.
2. **Sitewide brand and em-dash drift.** 278 instances of `AiiACo` in marketing copy and 414 em-dashes (plus 28 en-dashes) across 73 files that Round 2 had not touched.
3. **Zero pillar-spoke internal linking** from non-Round-2 pages into the 5 new service pages. The architecture was broken at the Round 2 boundary.

Round 3 was executed fully autonomously with no client dependency, no budget, and no outbound messaging. Each phase committed independently to the GitHub backup.

---

## Round 3 at a glance

| Phase | Theme | Files changed | Lines added |
|---|---|---|---|
| 1 | Image pipeline + asset migration | 21 | ~600 |
| 2 | Brand + em-dash + en-dash sweep | 73 | ~900 |
| 3 | Internal linking architecture | 18 | ~290 |
| 4 | IndustryMicrosite visual expansion | 1 | 286 |
| 5 | Populate 15 industries with real data | 2 | 1,656 |
| 6 | Activate TeamSection founder block | 1 | 4 |
| 7 | Build hardening (manifest, preconnect, lazy) | 6 | 136 |
| 8 | Schema graph enrichment | 1 | 33 |
| 9 | Accessibility sweep | 3 | 29 |
| 10 | Dead code audit (no changes needed) | 0 | 0 |
| 11 | Prerender SSR fix | 8 | 72 |
| 12 | State updates + ROUND-3-CHANGES | 2+ | current file |

**Total**: 130+ files touched across 11 commits, ~4,000 net lines added, 800+ lines removed via cleanup passes.

---

## Phase 1 - Image pipeline

### Problem
Every raster image on the site was served from Manus's CloudFront (`d2xsxph8kpxj0f.cloudfront.net`) or Manus's signed private CDN. Local `client/public/` contained only 8 favicons. No WebP. No AVIF. No responsive variants. No build-time optimization. Three background images (hero, process, team) depended on signed URLs that expire 2026-11-01.

### Work
- Added `sharp@0.34.5` as devDependency
- Wrote `scripts/download-assets.mjs` - downloads 23 source images (59.54 MB) to `.cache/image-originals/` (gitignored)
- Wrote `scripts/optimize-images.mjs` - generates WebP + AVIF for each source, plus 4 responsive widths (640/960/1280/1920) for the 3 hero-class backgrounds
- Wrote `scripts/relink-images.mjs` - bulk rewrites every CloudFront + manuscdn reference to local `/images/` paths
- Created `client/src/components/Picture.tsx` - reusable `<picture>` wrapper with AVIF/WebP format fallback and optional responsive srcset
- Relinked 20 source files with 72 CDN URL replacements

### Result
- **70 output image files** in `client/public/images/` (35 WebP + 35 AVIF)
- **60 MB to 4 MB**, a 93.3% byte reduction
- Time-bomb defused: hero-bg, process-bg, team-bg now self-hosted with responsive variants
- Every production-facing image reference is local. Only a `.mp4` video and 8 `.wav` files on a noindex page still point to Manus CloudFront.

---

## Phase 2 - Brand + em-dash + en-dash cleanup

### Problem
The state docs had estimated ~242 `AiiACo` instances and ~29 em-dashes remaining after Round 2. Reality was significantly worse: **278 brand casing violations** and **414 em-dashes** plus **28 en-dashes** across 73 files.

### Work
- Wrote `scripts/round3-cleanup.py` with ordered replacement rules:
  - `>EM_DASH<` (between JSX tags) -> bullet separator
  - `digit EM_DASH digit` (ranges) -> hyphen
  - ` EM_DASH ` -> ` - `
  - Bare em-dash -> hyphen
  - `AiiACo` -> `AiiAco` (except in schema @name JSON-LD)
- Python script uses the EM_DASH unicode constant `\u2014` so `grep` for literal em-dash in the script itself returns zero (self-referential cleanliness)
- Additional targeted fix for 6 server-side scripts (seed-knowledge.mjs, generate-diagnostic.mjs, etc.)
- En-dash cleanup pass for time/currency/numeric ranges

### Result
- **0** em-dashes sitewide
- **0** en-dashes sitewide
- **0** `AiiACo` in marketing copy (3 preserved in `client/index.html` JSON-LD `@name` fields per Wikidata Q138638897)
- `scripts/round3-cleanup.py` is idempotent - safe to run again

---

## Phase 3 - Internal linking architecture

### Problem
Round 2 built 5 new service pages but never wired them into the rest of the site. Grepping for `/ai-revenue-engine`, `/ai-crm-integration`, etc. returned **zero matches** from any page component. The pillar-spoke architecture was disconnected.

### Work
- Created `client/src/components/RelatedServices.tsx` - reusable cross-link block with:
  - 6-service canonical catalog (5 new pages + `/ai-integration` pillar)
  - Industry-to-service affinity map for 10 priority industries
  - Props for `current`, `max`, `headline`, `subhead`
- `Footer.tsx`: expanded from 5 to 6 columns, added "Solutions" column with all 5 new service pages
- `Navbar.tsx`: swapped Platform hash-link for Services -> /ai-integration
- Integrated `RelatedServices` into 15 non-Round-2 pages via Python batch script
- Updated `IndustryMicrosite.tsx` to use industry-specific affinity (real-estate-brokerage -> ai-for-real-estate + ai-crm-integration + ai-revenue-engine)

### Result
- Incoming links per new service page:
  - `/ai-revenue-engine`: 11
  - `/ai-crm-integration`: 12
  - `/ai-workflow-automation`: 14
  - `/ai-for-real-estate`: 5
  - `/ai-for-vacation-rentals`: 5
- Zero weak anchor text ("click here", "learn more")
- Sitewide pillar-spoke architecture complete

---

## Phase 4 - IndustryMicrosite visual expansion

### Problem
Round 2 populated `regulations`, `platforms`, `roles`, `directAnswer` data for 5 priority industries in `industries.ts`, but `IndustryMicrosite.tsx` never rendered those fields. The data existed invisibly. Priority industry pages capped at ~500 words vs 1,800+ word competitor benchmark.

### Work
Extended `IndustryMicrosite.tsx` with 4 new conditionally-rendered sections:
1. **Direct Answer block** in hero - gold-bordered AEO passage for Google AI Overviews / ChatGPT / Perplexity citation
2. **Compliance Context** - grid of industry-specific regulations as badges
3. **Platform Integrations** - grid of real platform/tool names the integration works on top of
4. **Who We Work With (Roles)** - list of role titles specific to the industry

Each section renders only if the corresponding `industry` data field has entries, so pages degrade gracefully.

### Result
Priority 5 industry pages now render 4 new visual sections. Combined with Phase 5 data population, pages grow from ~500 to 830-920 words (prerender word counts).

---

## Phase 5 - Populate 15 remaining industries

### Problem
Only the 5 priority industries had `regulations`, `platforms`, `roles`, `faq`. The other 15 industries had placeholder `directAnswer` and `relatedSlugs` but nothing that the new Phase 4 sections could render.

### Work
Wrote `scripts/round3-populate-industries.py` with hand-curated data for all 15 industries:
- insurance, financial-services, investment-wealth-management
- software-technology, software-consulting, software-engineering
- agency-operations, cryptocurrency-digital-assets
- energy, solar-renewable-energy, oil-gas, alternative-energy
- automotive-ev, battery-ev-technology
- food-beverage

Each industry received:
- 6-9 real 2026-current regulation names (NAIC, FERC, NERC, FSMA, IRA, MiCA, ISO 26262, UN ECE R100, etc.)
- 8-11 real platform integration targets (Guidewire, Orion, Salesforce FSC, SAP S/4HANA, Aurora Solar, CDK Global, Chainalysis, Siemens Opcenter, etc.)
- 6-7 role titles specific to the vertical
- 6-question FAQ, 150-200 words per answer, operator voice, zero AI-tell phrases

### Result
**20 of 20 industries** fully populated across directAnswer, regulations, platforms, roles, faq, relatedSlugs. `industries.ts` grew from 954 to 1,899 lines. Every industry microsite renders 800+ words post-prerender.

---

## Phase 6 - Activate TeamSection founder block

### Problem
`TeamSection.tsx` existed in the codebase with a complete Nemr Hallak bio and expertise chips, but was never imported by any page. Founder visibility (E-E-A-T signal) was effectively zero on the public site.

### Work
Imported `TeamSection` in `ManifestoPage.tsx` and rendered it between the declarations and RelatedServices block. Added absolutely nothing else - the component already had the bio, the image placeholders, and the layout.

### Result
E-E-A-T founder visibility now live on `/manifesto` without any new content writing. Supports the existing Round 2 Person schema in `client/index.html`.

---

## Phase 7 - Build pipeline and performance hardening

### Problem
`client/index.html` had no preconnect hints, no preload for the LCP image, no manifest.json, no security.txt, no humans.txt. OG and Twitter meta images used relative URLs (broken for third-party crawlers). All routes were eagerly imported in `App.tsx` so the main bundle shipped everything.

### Work
- Added preconnect + dns-prefetch for googletagmanager.com and google-analytics.com
- Added `<link rel="preload">` for hero background with responsive `imagesrcset` and `fetchpriority="high"` for LCP optimization
- Upgraded OG/Twitter/schema image URLs to absolute (required by crawlers)
- Created `client/public/manifest.json` - PWA manifest with 7 icon sizes
- Created `client/public/.well-known/security.txt` - RFC 9116 compliant
- Created `client/public/humans.txt` - team attribution
- Converted 13 admin/portal/demo-walkthrough pages to `React.lazy` with `Suspense` wrappers. Kept Round 2 service pages + prerender targets eager.

### Result
- 13 lazy chunks split from main bundle (PortalSettings 6KB, PortalAuth 7KB, AdminLeads 50KB, AdminAnalytics 425KB, etc.)
- Skip link + preconnect in index.html
- Manifest, security, humans served at HTTP 200

---

## Phase 8 - Schema graph enrichment

### Problem
Round 2 added the core schemas but left gaps: WebSite had no SearchAction, ProfessionalService had no `priceRange` / `audience` / `hasOfferCatalog`, Organization had no slogan, areaServed was a single string instead of country array.

### Work
- Organization: added slogan, expanded areaServed to `[US, Canada, UK, Worldwide]`
- WebSite: added `inLanguage`, `potentialAction` (SearchAction with EntryPoint template)
- ProfessionalService: added priceRange `$$$$`, paymentAccepted, BusinessAudience, and a 6-Offer `hasOfferCatalog` linking back to every service page

### Result
All 4 JSON-LD blocks in `client/index.html` validated. Google Rich Results Test should now recognize the full service catalog, not just the single Organization-level catalog Round 2 set up.

---

## Phase 9 - Accessibility and semantic HTML

### Problem
No skip-to-content link. Hamburger menu had aria-label but no aria-expanded or aria-controls. Mobile menu container lacked role/aria-modal/aria-label.

### Work
- Added WCAG 2.4.1 compliant skip link in `client/index.html` (visible only on keyboard focus)
- Wrapped Switch in `<div id="main-content">` as skip target (avoided nested `<main>` landmarks by using div not main)
- Navbar hamburger: added aria-expanded + aria-controls
- Mobile menu overlay: added id, role=dialog, aria-modal=true, aria-label=Main navigation

### Result
Keyboard-first accessibility pattern complete. Zero images missing alt text. All interactive buttons have accessible names.

---

## Phase 10 - Dead code audit

### Problem
Potential accumulated debt: unused components, console.log in production, TODO/FIXME comments.

### Work
Sitewide scan.

### Result
- **0 dead components** (every file in `client/src/components/` is imported somewhere)
- **0 TODO/FIXME/HACK** comments
- **2 console.log** statements (one in dev-only page, one in dev-gated GA4 debug hook - acceptable)
- 61 `any` type usages remain but each fix would require component-by-component review - deferred

---

## Phase 11 - Prerender SSR pipeline fix

### Problem
Round 2 shipped `scripts/prerender.mjs` + `client/src/entry-server.tsx` but the prerender pipeline was silently broken across 41 of 45 routes. Only `/privacy`, `/terms`, and (empty-shell) `/operator` rendered successfully. Two root causes:

1. **wouter `<Link>` in SSR context triggers "Missing getServerSnapshot"** error. Any page that imported wouter's Link (RelatedServices, IndustryMicrosite, and all 5 new service pages) failed to render.
2. **IndustryMicrosite's `useParams()` returns empty** when called outside a matched `<Route>`. entry-server.tsx rendered `<IndustryMicrosite />` directly, so every industry page fell into the "Industry Not Found" fallback (184-word empty shell).

### Work
1. Swapped every `<Link>` import for native `<a href>` in: RelatedServices.tsx, IndustryMicrosite.tsx, AIRevenueEnginePage, AICrmIntegrationPage, AIWorkflowAutomationPage, AIForRealEstatePage, AIForVacationRentalsPage
2. entry-server.tsx: extract slug from URL manually, pass as `ssrSlug` prop
3. IndustryMicrosite.tsx: accept optional `ssrSlug` prop with fallback chain: `useParams().slug || props.params?.slug || props.ssrSlug`

### Result
- **Before Round 3**: 3 routes OK, 42 errors (broken since Round 2, never tested)
- **After Round 3**: 41 routes OK, 4 errors
- Industry pages now prerender with 830-920 words each (vs 184 empty-shell before)
- 4 remaining errors are all pre-existing Round 2 issues not in Round 3 scope:
  - `/` Home: Unable to find tRPC Context (would require wrapping entry-server in withTRPC)
  - `/upgrade`: same
  - `/demo`: same
  - `/talk`: localStorage is not defined (would need SSR shim)

The prerender pipeline is now production-viable for 41 of 45 routes.

---

## What still has to happen (not in Round 3)

1. **Ship Round 2 + Round 3 to live aiiaco.com**. Still blocked on Manus sync path. Code is ready, GitHub backup is complete, but no deploy path is confirmed.
2. **4 pre-existing prerender errors**. Home / Upgrade / Demo use tRPC, Talk uses localStorage. These would need SSR shims we decided not to invest in during Round 3. Not Round 3 regressions.
3. **Plausible Analytics activation**. Still deferred - needs script wiring in index.html.
4. **blog.aiiaco.com infrastructure**. Bucket C, separate effort.

---

## Sitewide verification totals

| Metric | Target | Actual |
|---|---|---|
| Em-dashes (em + en) | 0 | 0 |
| AiiACo in marketing copy | 0 | 0 |
| Remote image refs in source | 0 non-video/audio | 0 non-video/audio |
| Industry fields populated | 20/20 | 20/20 (directAnswer, regulations, platforms, roles, faq, relatedSlugs) |
| New service page incoming links | >= 5 each | 5-14 each |
| WebP+AVIF images | >= 40 | 70 |
| Manifest/security/humans infra | present | present |
| TypeScript errors | 0 | 0 |
| Prerender success rate | 40+ | 41 of 45 |

---

## Git history

```
7d2573c Round 3 Phase 11: fix prerender SSR pipeline
cda0d89 Round 3 Phase 9: accessibility and semantic HTML sweep
7650368 Round 3 Phase 8: schema graph enrichment
2fec873 Round 3 Phase 7: build pipeline and performance hardening
c8e155b Round 3 Phase 6: activate TeamSection on ManifestoPage
de4b8d7 Round 3 Phase 5: populate 15 remaining industries
c033f0a Round 3 Phase 4: IndustryMicrosite visual expansion
dcd2ad7 Round 3 Phase 3: internal linking architecture
31a5575 Round 3 Phase 2: sitewide brand casing + em-dash + en-dash cleanup
1c9cf56 Round 3 Phase 1: asset migration + WebP pipeline
```

All commits on `main` at `github.com/MonteKristoAI/aiiaco`. Secrets scan clean throughout.
