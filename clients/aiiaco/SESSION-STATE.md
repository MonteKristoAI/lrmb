# AiiAco Engagement — Ultra-Detailed Session State

**Last updated**: 2026-04-11
**Purpose**: Complete handoff so the next Claude Code session can pick up with zero re-learning. Every file path is absolute. Every decision has reasoning. Every pending task has exact commands.

> **READ THIS FILE FIRST ON ANY CONTINUATION.** Do not re-run the audit. Do not redo Round 1 or Round 2. Pick a bucket from the "Next Session Buckets" section below.

---

## 0. Quickstart for the next session

1. `cat "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/SESSION-STATE.md"` (this file)
2. Verify TypeScript still clean:
   ```bash
   cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
   npx -y -p pnpm@10.15.1 pnpm run check
   ```
   Expected: `tsc --noEmit` with 0 errors. If errors appear, something drifted — investigate.
3. Check if Manus sync happened (see section 9). If aiiaco.com live site still shows old content, Round 2 has NOT shipped yet.
4. Pick next bucket of work (section 11).

---

## 1. Business context (who, what, why)

### 1.1 Client
- **Company**: AiiAco — "AI Integration Authority for the Corporate Age"
- **Legal entity**: Privately held, founded 2025 (Wikidata `Q138638897`)
- **Website**: `https://aiiaco.com`
- **Founder**: Nemr Hallak (AI Systems Architect, CEO)
- **Nemr's other properties**: `https://nemrhallak.com` (personal brand, also Manus AI-built), `volentixlabs.com` (previous Web3 project — NOT related to AiiAco work)
- **Admin assistant**: Marylou (the one who creates workspace accounts; cc'd on access setup emails)
- **Contact emails**:
  - Nemr primary: `nemr@aiiaco.com`
  - Nemr legacy: `nemr@volentixlabs.com`
  - Company public: `go@aiiaco.com`
- **Our access**:
  - Workspace account at `alex@aiiaco.com` (Google Workspace, created by Marylou 2026-03-18)
  - Our consultancy email: `contact@montekristobelgrade.com`
- **Client roster location**: `clients/aiiaco/CLIENT.md` (updated 2026-04-11)

### 1.2 Engagement scope (what Nemr asked for)
Nemr's original brief (quoted from Google Doc he filled in):
> Positioning (non-negotiable):
> We are an AI infrastructure company.
> We are not an AI tools, chatbot, or marketing automation agency.
>
> Primary focus: AI systems embedded into revenue and operational workflows.
>
> Core keywords to build around:
> AI infrastructure, AI systems for business, AI CRM integration, AI workflow automation, AI revenue systems, AI integration company, enterprise AI integration
>
> Target industries:
> Real estate, Vacation rental operators, Property management, Hospitality, Service businesses with field teams
>
> Core service pages:
> /ai-infrastructure, /ai-crm-integration, /ai-workflow-automation, /ai-revenue-engine, /ai-for-real-estate, /ai-for-vacation-rentals
>
> Content strategy (AEO):
> Direct-answer pages, no fluff.
>
> Important:
> We are not targeting "AI tools" or "chatbot services." We want to own AI infrastructure and AI systems positioning.

### 1.3 Strategic pivot we made (do NOT reverse without explicit user instruction)
Competitive intelligence audit (see section 3) determined that "**AI infrastructure**" is an **unwinnable keyword**. It is owned by hardware/cloud hyperscalers (IBM, CoreWeave, Nebius, HPE, Intel, Snowflake, AWS) who control the Google definition (GPUs/TPUs/HPC/networking). Any page targeting this keyword will rank behind hyperscaler documentation indefinitely.

**Our pivot**:
- ABANDONED: "AI infrastructure" as a keyword target
- REPLACED: `/ai-infrastructure` page with `/ai-revenue-engine` targeting **"AI revenue systems"** — a zero-competition definitional whitespace claim per our competitor research (no current ranker owns the term)
- KEPT: "AI integration company", "enterprise AI integration", "AI CRM integration", "AI workflow automation", "AI for real estate", "AI for vacation rentals" as active targets
- POSITIONING: AiiAco is an **INTEGRATOR**, not a product vendor. Always "built on top of your existing stack" — never competing with Hostaway, EliseAI, Better.com, Ocrolus, etc.

Nemr has not yet seen the pivot explicitly. When we sync to Manus and present to him, we should explain: "You asked for /ai-infrastructure but the keyword is dead. We built /ai-revenue-engine instead to claim 'AI revenue systems' which nobody else owns." He is likely to accept because the business logic is clean.

---

## 2. Technical stack (exact)

### 2.1 Frontend architecture
- **Build tool**: Vite 7.1.7
- **Framework**: React 19.2.1 + React DOM 19.2.1
- **Routing**: wouter 3.3.5 (+ patched wouter 3.7.1 via pnpm patch)
- **SEO head management**: react-helmet-async 2.0.5
- **Animations**: framer-motion 12.23.22
- **Styling**: Tailwind CSS 4.1.14 + custom design system classes (`display-headline`, `gold-line`, `section-headline`, `accent`, `btn-gold`, `gold-divider`, `container`, `gold-text`)
- **UI primitives**: Radix UI (accordion, dialog, tooltip, etc.)
- **Theme**: Dark (`#03050A` background, gold accents `#D4A843` / `#B89C4A`)
- **TypeScript**: 5.9.3 strict

### 2.2 Backend (not touched by us)
- Express 4.21.2 + tsx watch dev server
- Drizzle ORM 0.44.5 + MySQL 2
- tRPC 11.6.0
- bcryptjs, jose (auth)
- Stripe 22, Resend 6 (emails)

### 2.3 Build pipeline
- `pnpm build:vite` — standard Vite client build
- `pnpm build:ssr` — Vite SSR build producing `dist/server-entry.js`
- `pnpm prerender` — runs `scripts/prerender.mjs` which iterates routes, calls `renderRoute(url)` from the SSR entry, writes static HTML to `dist/public/`
- `pnpm build` — full pipeline
- Package manager: pnpm 10.4.1 (pinned)

### 2.4 Hosting / infrastructure
- **Host**: Manus AI platform (proprietary). Dynamic rendering serves pre-rendered HTML to bot user-agents.
- **CDN**: Cloudflare (Manus's CF account, NOT ours)
- **Domain registrar**: Namecheap (owned by Nemr)
- **Image CDN**: Amazon CloudFront (`d2xsxph8kpxj0f.cloudfront.net`) — Manus's CF
- **GitHub mirror**: `github.com/10452/aiiaco.git` — Manus auto-creates a numeric-ID GitHub account per project. Repo is **private**, we have **NO push access**.
- **Email**: Google Workspace for `@aiiaco.com` domain, with Amazon SES as backup SPF include
- **Analytics**: Google Analytics 4 (`G-6XQ3T33HTF`) + Plausible (token not yet wired into the site code)

### 2.5 Manus dynamic rendering — KEY FINDING
Early in the engagement we suspected Google couldn't see the site content because it's a JS-heavy SPA. We ran a test with 11 different bot user-agents:

```bash
for ua in "Googlebot" "Bingbot" "Applebot" "GPTBot" "OAI-SearchBot" "ChatGPT-User" "ClaudeBot" "PerplexityBot" "Perplexity-User" "Google-Extended" "Claude-Web"; do ... ; done
```

Result: **Manus serves pre-rendered HTML with full content to 10 of 11 major AI/search bots.** Only "Claude-Web" (deprecated Anthropic UA) got the SPA shell. Googlebot, GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Bingbot, Applebot, Google-Extended all receive the pre-rendered 78KB HTML.

**Conclusion**: No Cloudflare Worker needed. Manus's edge layer handles crawler serving. Our source code fixes work WITH Manus, not around it.

---

## 3. Audit results (summary — full reports on disk)

### 3.1 Audit files on disk
- `clients/aiiaco/audit/MASTER-AUDIT-REPORT.md` — consolidated findings from all 4 subagents
- `clients/aiiaco/audit/ACTION-PLAN.md` — P0/P1/P2/P3 prioritized fix list
- `clients/aiiaco/audit/ROUND-2-CHANGES.md` — detailed Round 2 diff summary + sync instructions

### 3.2 Health scores (before Round 2 fixes)
| Category | Score | Status |
|---|---|---|
| Technical SEO | 58/100 | Critical issues |
| Content Quality | 42/100 | Thin + templated |
| Schema / Structured Data | 52/100 | Partial |
| GEO / AEO Readiness | 61/100 | Above average |
| Positioning / Keyword Strategy | 35/100 | Wrong target keyword |
| **Overall** | **50/100** | Needs work |

### 3.3 Technical audit — top findings (all resolved in Round 1/2)
1. **Duplicate canonical tags** on every page (static HTML hardcoded `https://www.aiiaco.com/` + React-injected canonical) → FIXED in index.html
2. **Missing `<title>` tags** in pre-rendered HTML → FIXED in prerender.mjs + shell fallback
3. **HTTP does not redirect to HTTPS** → Cloudflare dashboard change, NOT in code (pending — needs Nemr's CF)
4. **2 broken industry pages** (`/industries/financial-services`, `/industries/high-risk-merchant-services`) → FIXED (financial-services works via dynamic route, high-risk-merchant-services removed as off-brand)
5. **JS bundle 2.35MB uncompressed** → NOT FIXED (would need Manus platform change)
6. **Framer Motion opacity:0 on hero** → FIXED via prerender.mjs post-processor
7. **21/25 industry pages orphaned** from `/industries` hub → PARTIALLY FIXED (cluster now has `relatedSlugs` but `/industries` hub page itself not expanded — Round 3 task)

### 3.4 Content / E-E-A-T audit — top findings
1. **Nemr Hallak invisible on the site** — zero mentions anywhere → FIXED via Person schema in index.html (Round 1). Still needs visible founder bio on /manifesto or /about (Round 3 task — no visible copy yet)
2. **Industry pages 418-545 words** vs competitor 1800-3500 → PARTIAL (data expansion done in industries.ts; IndustryMicrosite.tsx renders FAQ but does NOT yet render regulations/platforms/roles sections — Round 3 task)
3. **Meta descriptions duplicated** across industry pages → FIXED (now per-industry via industries.ts + SEO.tsx)
4. **No industry expertise** (no RESPA, TRID, MLS, kvCORE, Encompass, Yardi names) → FIXED in data for priority 5 industries. Rendering as sections is Round 3.

### 3.5 GEO / AEO audit — top findings
1. **llms.txt already existed** ✓ (Manus put it there — AiiAco was ahead of most peers)
2. **Missing Person schema for Nemr** → FIXED
3. **Missing FAQPage schema** despite FAQ sections existing → FIXED (on 7 pages)
4. **Missing HowTo schema on /method** → FIXED
5. **Founding date inconsistency**: site `2024`, Wikidata `2025`, StructuredData.tsx `2026` → FIXED to 2025 everywhere
6. **Organization schema missing `founder` link** → FIXED

### 3.6 Competitive intelligence — top findings (drove the pivot)
- **"AI infrastructure"** keyword: IBM, CoreWeave, Nebius, HPE own it. Unwinnable. DROPPED.
- **Primary SEO competitor**: **RTS Labs** (dominates "AI integration company" listicle SERPs)
- **Secondary competitors**: Addepto (Polish boutique), Master of Code, Sema4.ai, Shakudo, Faye Digital
- **Industry category owners**:
  - Real estate: **FRAGMENTED** (no single owner — best entry point for AiiAco)
  - Vacation rentals: **Hospitable**, **Jurny**, **RentalReady**, **Hostaway AI** consolidating
  - Property management: **EliseAI** dominates
  - Mortgage: **Better.com**, **Ocrolus**, **TRUE** (enterprise locked, SMB broker segment open)
- **5 zero-competition AEO queries** to claim:
  1. "What is an AI revenue system" (→ `/ai-revenue-engine` created)
  2. "How to reactivate a customer database" (→ blog post pillar for Round 4)
  3. "How AI automates operations" (→ `/ai-workflow-automation` created)
  4. "What is AI infrastructure for business" (redefinition play — covered by `/ai-integration` existing pillar)
  5. "How to integrate AI into a CRM" (→ `/ai-crm-integration` created)
- **Best vertical entry point for AiiAco**: Real estate brokerages (fragmented SERP, no single dominator)

### 3.7 Industry pages audit — top findings
- **25 → 20 pages** after off-brand removal
- **5 REMOVED** (off-brand, deleted from `industries.ts`):
  - `high-risk-merchant-services` (chargebacks/adult/CBD connotation)
  - `beauty-health-wellness` (SMB wellness, off-brand for enterprise AI)
  - `cosmetics-personal-care` (low AI budget, off-brand)
  - `helium-specialty-gas` (programmatic SEO spam)
  - `biofuel-sustainable-fuels` (commodity shell, no ICP fit)
- **2 BROKEN pages** (financial-services + high-risk-merchant-services) returned 9-word SPA shell → financial-services FIXED, other DELETED
- **18 of 20 pages have NO case study section** (only real-estate-brokerage and mortgage-lending populated `featuredCaseStudyId`) — Round 3 task
- **Template-heavy writing**: 23 pages share verbatim CTA block "Every engagement begins with a Business Intelligence Audit..." — flagged as AI tell. Round 3 should diversify.

---

## 4. Source code working copy

### 4.1 Location
`/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco/`

### 4.2 How it got here
Nemr exported the Manus project as ZIP via Manus UI (`... > Download as ZIP`). ZIP was saved to `~/Downloads/aiiaco.zip`, extracted into `clients/aiiaco/aiiaco/`. The ZIP contains the complete Vite/React source.

`node_modules/` was installed locally via:
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm install --ignore-scripts
```

This is a local working copy. Changes are NOT live on `aiiaco.com` until synced back to Manus (see section 9).

### 4.3 Directory tree (relevant parts)
```
clients/aiiaco/aiiaco/
├── client/
│   ├── index.html              # Static HTML shell with JSON-LD schemas
│   ├── public/
│   │   ├── _redirects          # /*  /index.html  200 (Cloudflare Pages SPA fallback)
│   │   ├── robots.txt          # MODIFIED — per-bot Disallow blocks
│   │   ├── sitemap.xml         # MODIFIED — regenerated with 5 new pages + lastmod
│   │   ├── llms.txt            # MODIFIED — Nemr section, metrics, target queries
│   │   ├── about.txt           # MODIFIED — method aligned to HowTo schema
│   │   ├── favicon-*.png       # Unchanged
│   │   ├── __manus__/          # Manus runtime (do not touch)
│   │   └── agent/              # Retell voice agent assets (do not touch)
│   └── src/
│       ├── App.tsx             # MODIFIED — 5 new routes, NoindexRoute wrappers, StructuredData inside Router
│       ├── entry-server.tsx    # MODIFIED — 5 new page imports + routeMap, StructuredDataSSR inside Router, pathname prop
│       ├── main.tsx            # Unchanged
│       ├── index.css           # Unchanged (contains design system classes)
│       ├── const.ts            # Unchanged (CALENDLY_URL etc)
│       ├── components/         # ~30 components, Round 2 did NOT touch
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── HeroSection.tsx
│       │   ├── FAQSection.tsx        # Reusable accordion, used by new service pages
│       │   ├── caseStudies/          # Case study data and card components
│       │   └── ... (rest)
│       ├── data/
│       │   └── industries.ts          # MODIFIED — 20 entries (was 25), interface extended, priority 5 fully populated
│       ├── pages/
│       │   ├── Home.tsx                           # MODIFIED — SEO uses path-only
│       │   ├── NotFound.tsx                       # REWRITTEN — dark theme, noindex, suppressCanonical
│       │   ├── IndustryMicrosite.tsx              # MODIFIED — FAQ section, Related Industries, inline schema, Link fixes
│       │   ├── AIIntegrationPage.tsx              # Unchanged (pillar page reference template)
│       │   ├── AIAutomationPage.tsx               # Unchanged
│       │   ├── AIImplementationPage.tsx           # Unchanged
│       │   ├── AIGovernancePage.tsx               # Unchanged
│       │   ├── AICrmIntegrationPage.tsx           # CREATED (Round 2)
│       │   ├── AIWorkflowAutomationPage.tsx       # CREATED (Round 2)
│       │   ├── AIRevenueEnginePage.tsx            # CREATED (Round 2) — highest priority keyword claim
│       │   ├── AIForRealEstatePage.tsx            # CREATED (Round 2)
│       │   ├── AIForVacationRentalsPage.tsx       # CREATED (Round 2)
│       │   ├── ManifestoPage.tsx                  # Unchanged (Round 3 should add visible founder bio)
│       │   ├── MethodPage.tsx                     # Unchanged (HowTo schema already dispatched from StructuredDataSSR)
│       │   ├── IndustriesPage.tsx                 # Unchanged (Round 3 should expand hub to link all 20)
│       │   ├── ModelsPage.tsx
│       │   ├── ResultsPage.tsx
│       │   ├── CaseStudiesPage.tsx
│       │   ├── UpgradePage.tsx
│       │   ├── PrivacyPage.tsx
│       │   ├── TermsPage.tsx
│       │   ├── WorkplacePage.tsx
│       │   ├── CorporatePage.tsx
│       │   ├── AgentPackagePage.tsx
│       │   ├── OperatorPage.tsx
│       │   ├── DiagnosticDemoPage.tsx
│       │   ├── DemoWalkthroughPage.tsx
│       │   ├── TalkPage.tsx
│       │   ├── AdminLeadsPage.tsx
│       │   ├── AdminAgentPage.tsx
│       │   ├── AdminKnowledgePage.tsx
│       │   ├── AdminAnalyticsPage.tsx
│       │   ├── AdminConsolePage.tsx
│       │   └── portal/ (7 portal pages, all wrapped in NoindexRoute in App.tsx)
│       └── seo/
│           ├── SEO.tsx                    # MODIFIED — PAGE_META fallback, suppressCanonical prop
│           ├── SEOProvider.tsx            # Unchanged (6 lines — just HelmetProvider wrapper)
│           ├── seo.config.ts              # MODIFIED — PAGE_META expanded, aligned with Home title
│           ├── StructuredData.tsx         # REWRITTEN — thin client dispatcher
│           ├── StructuredDataSSR.tsx      # REWRITTEN — pathname prop, 7 FAQ dispatchers, upper-token helper
│           └── NoindexRoute.tsx           # CREATED (Round 2) — helper wrapper
├── scripts/
│   ├── prerender.mjs           # MODIFIED — 5 new routes, scoped Framer post-processor, title injection fix
│   └── (others unchanged — Telnyx/Retell agent scripts)
├── server/                     # Not touched
├── shared/                     # Not touched
├── drizzle/                    # Not touched
├── patches/                    # Not touched
├── .manus/                     # Manus metadata folder (do not touch)
├── node_modules/               # Installed locally via pnpm install
├── package.json                # Not touched
├── pnpm-lock.yaml              # Not touched
├── tsconfig.json               # Not touched
└── vite.config.ts              # Not touched
```

### 4.4 Lines of code (current state, 4660 lines total in touched files)
```
954  client/src/data/industries.ts
1094 client/src/pages/IndustryMicrosite.tsx
234  client/src/pages/AIRevenueEnginePage.tsx
209  client/src/pages/AICrmIntegrationPage.tsx
163  client/src/pages/AIWorkflowAutomationPage.tsx
172  client/src/pages/AIForRealEstatePage.tsx
175  client/src/pages/AIForVacationRentalsPage.tsx
239  client/src/pages/NotFound.tsx
438  client/src/seo/StructuredDataSSR.tsx
 73  client/src/seo/SEO.tsx
 42  client/src/seo/StructuredData.tsx
 34  client/src/seo/NoindexRoute.tsx
154  client/src/seo/seo.config.ts
128  client/src/entry-server.tsx
175  client/src/App.tsx
219  scripts/prerender.mjs
157  client/index.html
```

---

## 5. Every file modified — exact change reference

### 5.1 `client/index.html` (157 lines)
**Purpose**: Static HTML shell injected by Vite. Contains global JSON-LD schemas that ship with every page.

**Changes from original**:
- REMOVED hardcoded `<link rel="canonical" href="https://www.aiiaco.com/">` (Round 1)
- REMOVED hardcoded `<meta name="description">` (Round 1) — now per-page via `SEO.tsx` + helmet
- REMOVED hardcoded `<meta name="keywords">` (Round 1)
- REMOVED hardcoded `<meta name="robots">` (Round 1)
- REMOVED hardcoded `<meta property="og:url">` (pointed to www) (Round 1)
- REMOVED hardcoded `<meta property="og:title">`, `<meta property="og:description">`, `<meta name="twitter:title">`, `<meta name="twitter:description">` (Round 1)
- KEPT fallback `<title>AiiAco | AI Integration Company for Real Estate, Mortgage & Management Consulting</title>` (shell fallback)
- KEPT `<meta property="og:image">`, `<meta property="og:site_name">`, `<meta property="og:image:alt">`, `<meta name="twitter:card">`, `<meta name="twitter:site">`, `<meta name="twitter:image">` as static (global, don't vary per page)
- UPDATED Organization schema `foundingDate: "2024"` → `"2025"` (matches Wikidata)
- UPDATED Organization `alternateName: ["AiiA", "AiiAco", "AI Integration Authority"]` → `["AiiAco", "AI Integration Authority"]` (removed "AiiA" to match brand rule)
- ADDED Organization `"founder": { "@id": "https://aiiaco.com/#nemr-hallak" }` (Round 1)
- ADDED Organization `"numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 15 }` (Round 1)
- ADDED new **Person JSON-LD** at bottom (`@id: https://aiiaco.com/#nemr-hallak`) with `jobTitle`, `description`, `worksFor`, `sameAs` (LinkedIn + nemrhallak.com), `knowsAbout`
- KEPT schema @name as `"AiiACo"` (camelcase) in Organization, WebSite, ProfessionalService (3 places)
- All em-dashes converted to hyphens (Round 2 final critic pass)

**Schema @id graph** (verify intact):
- `https://aiiaco.com/#organization` → Organization
- `https://aiiaco.com/#website` → WebSite (references organization via publisher)
- `https://aiiaco.com/#service` → ProfessionalService (references organization via provider)
- `https://aiiaco.com/#nemr-hallak` → Person (references organization via worksFor)

### 5.2 `client/src/seo/seo.config.ts` (154 lines)
**Purpose**: Central PAGE_META map and SITE defaults. Used by SEO.tsx as fallback.

**Changes**:
- `SITE.defaultTitle` aligned with `PAGE_META["/"]` to `"AiiAco | AI Integration Company for Real Estate, Mortgage & Management Consulting"`
- `SITE.defaultDescription` updated to match
- `SITE.ogImage` fixed from nonexistent `/og-image.jpg` to real CloudFront URL
- `PAGE_META` expanded with all 19 existing pages + 5 new service pages (24 entries total)
- Added `buildIndustryMeta(slug, industryName)` helper function at end

**Key PAGE_META entries** (exact):
```ts
"/": { title: "AiiAco | AI Integration Company for Real Estate, Mortgage & Management Consulting", description: "AiiAco is an enterprise AI integration company. We design, deploy, and manage operational AI systems for real estate, mortgage lending, and management consulting firms. Done-for-you, performance-based." }
"/ai-crm-integration": { title: "AI CRM Integration | How to Integrate AI Into Your CRM", ... }
"/ai-workflow-automation": { title: "AI Workflow Automation | How AI Automates Operations", ... }
"/ai-revenue-engine": { title: "AI Revenue Engine | AI Revenue Systems for Pipeline Without Headcount", ... }
"/ai-for-real-estate": { title: "AI for Real Estate Brokerages | Lead Qualification, Listing Content, Pipeline AI", ... }
"/ai-for-vacation-rentals": { title: "AI for Vacation Rentals | Scale 50 to 500+ Units Without Headcount", ... }
```

### 5.3 `client/src/seo/SEO.tsx` (73 lines)
**Purpose**: React component that injects per-page meta tags via react-helmet-async.

**Changes**:
- Imports `PAGE_META` from `./seo.config`
- Resolution chain: explicit prop → `PAGE_META[path]?.title` → `SITE.defaultTitle` (same for description)
- Added `suppressCanonical?: boolean` prop — when true, omits `<link rel="canonical">` and `<meta property="og:url">`. Used ONLY by NotFound.tsx to avoid hardcoding `/404` as canonical.

**Props interface** (exact):
```ts
type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  ogImage?: string;
  keywords?: string;
  suppressCanonical?: boolean;
};
```

### 5.4 `client/src/seo/StructuredData.tsx` (42 lines)
**Purpose**: CLIENT-side dispatcher. Runs in the browser after hydration. Looks up current route via wouter `useLocation` and delegates to `StructuredDataSSR` with `pathname` as prop.

**Critical design note**: This component MUST be rendered INSIDE `<Router>` in App.tsx because wouter `useLocation()` only works inside a Router context. The final critic (Phase F) caught this — was previously rendered as a sibling of Router, causing hydration mismatch. Fixed by moving `<StructuredData />` into the `Router()` function component return, before `<Switch>`.

**Key logic**:
```ts
function normalize(pathname: string): string {
  if (!pathname || pathname === "") return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}
export default function StructuredData() {
  const [pathname] = useLocation();
  return <StructuredDataSSR pathname={normalize(pathname)} />;
}
```

### 5.5 `client/src/seo/StructuredDataSSR.tsx` (438 lines)
**Purpose**: Page-specific JSON-LD schema dispatcher. Used by both SSR (via `entry-server.tsx` with explicit `pathname` prop) and client (via `StructuredData.tsx`).

**Critical design**: Takes `pathname` as a **prop**, NOT via `useLocation()`. This decouples it from wouter Router context and makes it safe to render anywhere.

**Schemas dispatched by route**:
- All non-homepage: `BreadcrumbList` (auto-generated from URL segments)
- `/method` → `HowTo` (Find/Implement/Measure/Expand 4-phase)
- `/ai-integration` → `FAQPage` (4 Q&A)
- `/ai-automation-for-business` → `FAQPage` (3 Q&A)
- `/ai-crm-integration` → `FAQPage` (3 Q&A)
- `/ai-workflow-automation` → `FAQPage` (3 Q&A)
- `/ai-revenue-engine` → `FAQPage` (3 Q&A)
- `/ai-for-real-estate` → `FAQPage` (3 Q&A)
- `/ai-for-vacation-rentals` → `FAQPage` (3 Q&A)
- `/manifesto` → `AboutPage`

**`UPPER_TOKENS` dictionary** for breadcrumb casing:
```ts
const UPPER_TOKENS: Record<string, string> = {
  ai: "AI", crm: "CRM", ev: "EV", b2b: "B2B", b2c: "B2C", saas: "SaaS",
};
```

**Known issue (MEDIUM, deferred to Round 3)**: Schema FAQ answers are shortened/reworded versions of what appears on the page. Google prefers byte-identical match between FAQ schema and visible content. Fix: import `faqItems` from the page modules directly instead of re-declaring in StructuredDataSSR. Not critical for ship.

### 5.6 `client/src/seo/NoindexRoute.tsx` (34 lines)
**Purpose**: Helper wrapper that injects ONLY `<meta name="robots" content="noindex,nofollow">` and `<meta name="googlebot" content="noindex,nofollow">` alongside children. Does NOT override child title/description.

**Why minimal**: Earlier version used `<SEO noindex title="Private - AiiAco">` which clobbered child page titles via helmet last-one-wins. Refactored by the Phase B+C critic pass.

**Used in App.tsx to wrap**:
- `/admin/leads`, `/admin/agent`, `/admin/knowledge`, `/admin/analytics`, `/admin-opsteam`
- `/operator`
- `/demo-walkthrough`
- `/portal/login`, `/portal`, `/portal/agent`, `/portal/conversations`, `/portal/embed`, `/portal/billing`, `/portal/settings`

### 5.7 `client/src/entry-server.tsx` (128 lines)
**Purpose**: SSG entry point used by `scripts/prerender.mjs` at build time. Exports `renderRoute(url)` that returns `{ html, helmetContext }`.

**Changes**:
- Added imports for 5 new service pages + all previously-missing pages (`AIGovernancePage`, `WorkplacePage`, `CorporatePage`, `AgentPackagePage`, `OperatorPage`, `DiagnosticDemoPage`, `TalkPage`, `IndustryMicrosite`)
- `routeMap` now has 20 static entries (was 13)
- Dynamic industry slug handler: `if (url.startsWith("/industries/")) { PageComponent = IndustryMicrosite; }`
- `<StructuredDataSSR pathname={url} />` rendered **inside** `<Router hook={hook}>` with explicit pathname prop (final critic fix)
- MotionConfig wrapper REMOVED (was a failed attempt to override Framer Motion initial state — framer-motion version-dependent behavior made it unreliable)
- Fix moved to `scripts/prerender.mjs` post-processor instead

### 5.8 `scripts/prerender.mjs` (219 lines)
**Purpose**: Node script that runs after Vite build. Iterates `ROUTES` array, calls `renderRoute(url)` from the compiled SSR entry, assembles final HTML by injecting rendered body into `dist/public/index.html` shell, injects helmet head tags, and writes per-route `dist/public/{route}/index.html` files.

**Changes**:
- `STATIC_ROUTES` expanded from 13 to 25 (added 7 previously-missing + 5 new service pages)
- `INDUSTRY_SLUGS` array (20 slugs, with 5 off-brand excluded via comment)
- `ROUTES = [...STATIC_ROUTES, ...INDUSTRY_SLUGS.map(s => `/industries/${s}`)]`
- **Framer Motion post-processor** (`makeFramerContentVisible(html)`): **scoped per-style-attribute** rewriter. Only rewrites when a SINGLE style attribute contains BOTH `opacity:0` AND a `transform:translate{X|Y}(...)`. This prevents breaking legitimate static layout transforms (badge centering via `translateX(-50%)`, progress bar fills, hidden tooltips/modals).
- **Title injection fix**: only strips shell `<title>` if helmet actually produced a title (previously always stripped, leaving pages title-less if helmet failed)

**Exact post-processor implementation**:
```js
function makeFramerContentVisible(html) {
  return html.replace(/style="([^"]*)"/g, (_match, styleBody) => {
    const hasOpacityZero = /opacity:\s*0(?![.\d])/.test(styleBody);
    const hasTranslate = /transform:\s*translate[XY]\([^)]+\)/.test(styleBody);
    if (!hasOpacityZero || !hasTranslate) return `style="${styleBody}"`;
    let rewritten = styleBody
      .replace(/opacity:\s*0(?![.\d])/g, "opacity:1")
      .replace(/transform:\s*translate[XY]\([^)]+\)/g, "transform:none");
    return `style="${rewritten}"`;
  });
}
```

### 5.9 `client/src/App.tsx` (175 lines)
**Purpose**: Client-side Router component + App wrapper.

**Changes**:
- Added imports: `NoindexRoute`, `AICrmIntegrationPage`, `AIWorkflowAutomationPage`, `AIRevenueEnginePage`, `AIForRealEstatePage`, `AIForVacationRentalsPage`
- Added `<Route>` for 5 new service pages
- REMOVED duplicate `<Route path="/operator" component={OperatorPage} />` (first-match-wins in wouter Switch — old route was bypassing NoindexRoute wrapper)
- REMOVED explicit `<Route path="/404" component={NotFound} />` (was returning 200 for /404, creating soft-404; fallback at bottom handles it)
- WRAPPED admin, portal, operator, demo-walkthrough routes in `<NoindexRoute>...</NoindexRoute>` (children pattern, not component prop)
- **`<StructuredData />` moved INSIDE `Router()` component** (before `<Switch>`) so wouter's useLocation context is available and matches SSR dispatch
- App wrapper structure: `<ErrorBoundary><ThemeProvider><TooltipProvider><Toaster /><Router /><AiiAVoiceWidget /><CookieConsent /></TooltipProvider></ThemeProvider></ErrorBoundary>`

### 5.10 `client/src/pages/Home.tsx` (141 lines)
**Purpose**: Homepage component.

**Changes**:
- `<SEO title="..." description="..." keywords="..." path="/" />` → `<SEO path="/" />` — uses PAGE_META["/"] automatically
- Removed brand inconsistency ("AiiA" in old title)
- Visible content unchanged

### 5.11 `client/src/pages/NotFound.tsx` (239 lines)
**Purpose**: 404 page.

**Changes** (complete rewrite):
- Old: Light theme (`from-slate-50 to-slate-100`), no SEO, no navigation
- New: Dark brand (`#050810` → `#070c14` gradient), Navbar + Footer, SEO with `noindex` + `suppressCanonical`, hero with "404" heading, "Popular Destinations" grid with 6 links (home, ai-integration, method, industries, results, upgrade)
- Uses wouter `<Link>` throughout for SPA navigation

### 5.12 `client/src/pages/IndustryMicrosite.tsx` (1094 lines)
**Purpose**: Dynamic component for all `/industries/:slug` routes.

**Changes**:
- Imported `Helmet` (from react-helmet-async), `FAQSection` (reusable accordion)
- Added `BASE_URL = "https://aiiaco.com"` constant
- Added `relatedIndustries` computation: `industry.relatedSlugs?.map(getIndustryBySlug).filter(Boolean).slice(0, 4) ?? []`
- Added `industrySchemas` array built inline per page with:
  - `Service` schema (provider @id → org, name, description, url, serviceType)
  - `BreadcrumbList` schema (Home → Industries → [Industry Name])
  - `FAQPage` schema (only if `industry.faq` populated)
- Added `<Helmet>` block with `industrySchemas.map(...)` → `<script type="application/ld+json">` per schema
- Added new `<FAQSection>` render (conditional on `industry.faq`)
- Added new "Related Industries" section (conditional on `relatedIndustries.length > 0`) — card grid linking to 3-4 related microsites
- Fixed back button `href="/#industries"` → `href="/industries"` in 2 places
- Replaced 5 raw `<a href>` with wouter `<Link>` (back button, case studies link, all-industries links × 3)
- Added `aria-hidden="true"` to decorative chevron SVG

**Section order** (top → bottom):
1. Sticky back bar (Link to /industries)
2. Hero (badge, H1 headline, subheadline, divider, description, CTAs)
3. KPIs grid (4 metric tiles)
4. Pain Points (H2 + 4 cards)
5. Use Cases (H2 + 4 cards)
6. **FAQ** (conditional, new — renders FAQSection with industry.faq)
7. Featured Case Study (conditional on industry.featuredCaseStudyId)
8. CTA (with optional Calendly embed)
9. **Related Industries** (conditional, new — grid of 3-4 related microsites)
10. Cross-links to 3 pillar service pages (existing)

### 5.13 `client/src/data/industries.ts` (954 lines)
**Purpose**: Industry microsite data source. Imported by IndustryMicrosite.tsx and other components.

**Interface** (extended, exact):
```ts
export interface IndustryData {
  slug: string;
  name: string;
  headline: string;
  subheadline: string;
  description: string;
  painPoints: { title: string; body: string }[];
  useCases: { title: string; body: string }[];
  kpis: { value: string; label: string }[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  featuredCaseStudyId?: string;
  showCalendly?: boolean;
  primary?: boolean;
  // ROUND 2 ADDITIONS:
  directAnswer?: string;              // 40-60 word AEO definition
  relatedSlugs?: string[];            // for Related Industries section
  faq?: { question: string; answer: string }[];  // for FAQ section + FAQPage schema
  regulations?: string[];             // informational (Round 3 will render as section)
  platforms?: string[];               // informational (Round 3 will render as section)
  roles?: string[];                   // informational (Round 3 will render as section)
}
```

**Current population state**:
| Slug | directAnswer | relatedSlugs | faq | regulations | platforms | roles |
|---|---|---|---|---|---|---|
| real-estate-brokerage | ✓ | ✓ | ✓ (6) | ✓ | ✓ (10) | ✓ |
| mortgage-lending | ✓ | ✓ | ✓ (6) | ✓ | ✓ (9) | ✓ |
| commercial-real-estate | ✓ | ✓ | ✓ (5) | ✓ | ✓ (9) | ✓ |
| luxury-lifestyle-hospitality | ✓ | ✓ | ✓ (5) | ✓ | ✓ (8) | ✓ |
| management-consulting | ✓ | ✓ | ✓ (5) | ✓ | ✓ (7) | ✓ |
| insurance | ✓ | ✓ | — | — | — | — |
| financial-services | ✓ | ✓ | — | — | — | — |
| investment-wealth-management | ✓ | ✓ | — | — | — | — |
| software-technology | ✓ | ✓ | — | — | — | — |
| agency-operations | ✓ | ✓ | — | — | — | — |
| energy | ✓ | ✓ | — | — | — | — |
| solar-renewable-energy | ✓ | ✓ | — | — | — | — |
| automotive-ev | ✓ | ✓ | — | — | — | — |
| food-beverage | ✓ | ✓ | — | — | — | — |
| cryptocurrency-digital-assets | ✓ | ✓ | — | — | — | — |
| software-consulting | ✓ | ✓ | — | — | — | — |
| software-engineering | ✓ | ✓ | — | — | — | — |
| oil-gas | ✓ | ✓ | — | — | — | — |
| alternative-energy | ✓ | ✓ | — | — | — | — |
| battery-ev-technology | ✓ | ✓ | — | — | — | — |

**Removed industries** (DO NOT re-add):
- `high-risk-merchant-services`
- `beauty-health-wellness`
- `cosmetics-personal-care`
- `helium-specialty-gas`
- `biofuel-sustainable-fuels`

**`getIndustryBySlug(slug)` helper** exists at bottom of file.

### 5.14 Five new service pages

All follow the `AIIntegrationPage.tsx` template pattern:
- Imports: `SEO`, `Navbar`, `Footer`, `FAQSection`, `motion`, wouter `Link`
- Design system classes: `display-headline`, `gold-line`, `section-headline`, `accent`, `btn-gold`, `container`
- Fade variant: `{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }`
- Structure: Hero → Definition/Explainer → Content sections (pillars/steps/components) → FAQSection → Related Services (cross-links) → Final CTA

**`AIRevenueEnginePage.tsx`** (234 lines) — `/ai-revenue-engine`
- Target keyword: "AI revenue systems" (zero competition)
- 5 components: Lead Generation Layer, Multi-Touch Nurture Engine, Pipeline Intelligence, Dormant Database Reactivation, Closed-Loop Revenue Attribution
- FAQ: 8 questions
- Cross-links: /ai-integration, /ai-crm-integration, /ai-workflow-automation

**`AICrmIntegrationPage.tsx`** (209 lines) — `/ai-crm-integration`
- Target: "AI CRM integration", "how to integrate AI into a CRM"
- 4-step process: Map the CRM Workflow, Design the Integration Layer, Deploy Without Platform Migration, Manage and Optimize
- 12 supported CRMs: Salesforce, HubSpot, Pipedrive, GoHighLevel, Follow Up Boss, Zoho CRM, Microsoft Dynamics 365, Close, Copper, Keap, ActiveCampaign, Monday.com CRM
- FAQ: 6 questions

**`AIWorkflowAutomationPage.tsx`** (163 lines) — `/ai-workflow-automation`
- Target: "AI workflow automation", "how AI automates operations"
- 6 automation categories: Revenue Ops, Client Ops, Document Intelligence, Financial Ops, Workforce Optimization, Operational Infrastructure
- FAQ: 6 questions

**`AIForRealEstatePage.tsx`** (172 lines) — `/ai-for-real-estate`
- Target: "AI for real estate brokerages"
- 6 use cases: Lead Qualification in Seconds, MLS-Compliant Listing Content, Automated Multi-Touch Follow-Up, Pipeline Intelligence, Dormant Database Reactivation, Transaction Coordination
- 10 platforms: Follow Up Boss, kvCORE, BoomTown, Lofty (formerly Chime), BoldTrail, Compass, dotloop, SkySlope, Salesforce Real Estate Cloud, Zillow Premier Agent
- FAQ: 6 questions
- Cross-link: /industries/real-estate-brokerage

**`AIForVacationRentalsPage.tsx`** (175 lines) — `/ai-for-vacation-rentals`
- Target: "AI for vacation rentals", "AI vacation rental management"
- Positioning: **INTEGRATOR layer**, NOT vendor (competes only vs Hostaway/Jurny/Hospitable messaging)
- 6 use cases: Guest Communication Automation, Dynamic Pricing Integration, Maintenance Coordination, Review Intelligence, Financial Reporting Automation, Unit Onboarding Automation
- 14 platforms: Hostaway, Guesty, Hospitable, Hostfully, Jurny, RentalReady, Boom, CiiRUS, PriceLabs, Wheelhouse, Beyond Pricing, Airbnb, Vrbo, Booking.com
- FAQ: 6 questions
- Cross-link: /industries/luxury-lifestyle-hospitality

### 5.15 Public asset files

**`client/public/robots.txt`**
- Per-bot Disallow blocks: Googlebot, Googlebot-Image, Google-Extended, Bingbot, Applebot, Applebot-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Meta-ExternalAgent, Amazonbot, Bytespider, CCBot, DuckDuckBot, YandexBot
- Every named bot block includes: `Disallow: /admin`, `/admin/`, `/admin-opsteam`, `/portal/`, `/operator`, `/demo-walkthrough`
- Sitemap reference: `Sitemap: https://aiiaco.com/sitemap.xml`

**`client/public/sitemap.xml`**
- 40 URLs total
- Sections (by priority):
  - Core: /, /manifesto, /method, /models, /upgrade
  - Services: /ai-integration, /ai-automation-for-business, /ai-implementation-services, /ai-governance, /ai-crm-integration, /ai-workflow-automation, /ai-revenue-engine, /ai-for-real-estate, /ai-for-vacation-rentals
  - Industries: /industries hub + 20 verticals
  - Supporting: /case-studies, /results, /workplace, /corporate, /agentpackage, /demo, /talk
  - Legal: /privacy, /terms
- Every URL has `<lastmod>2026-04-11</lastmod>`
- Known issue: all lastmods identical (MEDIUM critic finding, deferred)

**`client/public/llms.txt`**
- Sections: What AiiAco Is, Founder (Nemr Hallak with LinkedIn + nemrhallak.com), What We Do (3 service lines), Typical Outcomes (Measured), Industries Served (20), Who We Work With, What Makes AiiAco Different, Target Queries (Answer Engine Optimization), Contact, Clarification on Name Confusion, Verification
- Target Queries section lists 10 AEO questions
- Founding date: 2025 (matches Wikidata Q138638897)
- References all 11 key routes

**`client/public/about.txt`**
- Method aligned to HowTo schema phases: Find the Friction / Implement the Fix / Measure the Improvement / Expand What Works (previously inconsistent "Diagnostic / Architecture / Deployment / Optimization")
- Industries list matches llms.txt canonical set (previously claimed Legal, Healthcare, Construction, Dealerships which are NOT actually served)
- Founding date: 2025
- Founder section added

**`client/public/_redirects`** (NOT modified in Round 2)
- Content: `/videostudio → https://aiivideo-zyf9pqt6.manus.space/` + `/*  /index.html  200` SPA fallback
- Known issue: `/*  /index.html  200` means unknown URLs return 200 not 404 (soft-404). Critic flagged as CRITICAL but the fix requires platform-level 404 handling that we can't do in code alone. Mitigation: NotFound.tsx emits `noindex` + `suppressCanonical`.

---

## 6. All 67 critic findings with resolution status

### Phase A critic (Round 1 review) — 20 findings
1. **C1 FIXED**: StructuredDataSSR using useLocation() outside Router → refactored to take pathname prop
2. **C2 FIXED**: 3 different homepage titles (Home.tsx / index.html / seo.config.ts) + dead PAGE_META → aligned all three, wired PAGE_META into SEO.tsx auto-lookup
3. **C3 FIXED**: Sitemap still referencing 5 deleted industries → regenerated in Phase B
4. **H1 FIXED**: Organization alternateName had "AiiA" → removed
5. **H2 NOTED**: Crunchbase sameAs URL unverified (actually exists per Wikidata claim, OK)
6. **H3 FIXED**: prerender.mjs title-strip regex brittle → scoped to only strip when helmet emits title
7. **H4 FIXED**: BreadcrumbList "Ai Automation For Business" → added UPPER_TOKENS helper
8. **H5 FIXED**: MotionConfig reducedMotion="always" doesn't override initial state → removed wrapper, added post-processor in prerender.mjs
9. **M1-M14 FIXED or DEFERRED**: Medium/low severity items addressed where appropriate

### Phase B+C critic (public assets + components) — 14 findings
1. **C1 FIXED**: prerender.mjs translateX regex breaking badge centering → scoped per-style-attribute
2. **C2 FIXED**: prerender.mjs opacity:0 regex too broad → scoped to only rewrite when BOTH opacity:0 AND translate present
3. **C3 FIXED**: IndustryMicrosite back button raw `<a href>` → wouter Link (2 places)
4. **C4 FIXED**: @id references OK (verified)
5. **H1 FIXED**: robots.txt per-bot blocks missing Disallow → added to all 20 bot blocks
6. **H2 FIXED**: Sitemap listed 5 routes not yet implemented → removed until Phase E then re-added
7. **H3 NOTED**: Sitemap missing routes that DO render → added /demo in regeneration
8. **H4 NOTED**: PAGE_META missing /operator (fine, NoindexRoute handles it)
9. **H5 FIXED**: Duplicate /operator Route bypassing noindex wrapper → removed old /operator Route
10. **H6 FIXED**: Explicit /404 route returning 200 → removed (fallback handles it)
11. **M1 FIXED**: Hydration mismatch risk → normalize() helper in StructuredData.tsx
12. **M3 NOTED**: FAQ schema drift from visible content (deferred to Round 3)
13. **M5 NOTED**: Brand casing rule (fixed in Phase F)
14. **M6 NOTED**: about.txt method inconsistency → fixed in Phase B
15. **M7 NOTED**: about.txt industries list drift → fixed in Phase B

### Phase F critic (final sweep) — 33 findings
1. **C1 NOTED**: _redirects soft-404 → platform-level, cannot fix in code alone
2. **C2 FIXED**: NotFound canonical hardcoded `/404` → added `suppressCanonical` prop
3. **C3 FIXED**: StructuredData outside Router in App.tsx → moved inside Router() function
4. **C4 FIXED**: 85+ em-dashes across 12 files → 111 em-dashes removed via Python batch script
5. **H1 FIXED**: 22+ AiiACo in marketing copy → 131 replaced to AiiAco, 3 preserved in schema @name
6. **H2 FIXED**: Person @id cross-graph reference (OK — @id resolution works at document level)
7. **H3 VERIFIED**: Wikidata Q138638897 exists with label "AiiACo", Crunchbase link retained
8. **H4 FIXED**: Literal em-dash bullet in IndustryMicrosite:743 → became `•` via batch script
9. **H5 FALSE POSITIVE**: FAQSection component does NOT emit JSON-LD (verified via grep)
10. **H6 DEFERRED**: FAQ schema answer text doesn't byte-match page copy (Round 3)
11. **H7 FIXED**: em-dashes in new service pages (covered by C4 batch)
12. **H8 FIXED**: Googlebot-Image missing Disallow /operator /demo-walkthrough
13. **H9 NOTED**: Sitemap priority inconsistencies (minor)
14. **M1 DEFERRED**: Unverifiable 15-25% response rate claim (Round 3 should hedge)
15. **M2 FIXED**: Chime CRM + Lofty duplicate → removed "Chime CRM" line
16. **M3 NOTED**: Salesforce Real Estate Cloud 2026 naming (verified acceptable)
17. **M4 NOTED**: NoindexRoute canonical leak risk (low probability, admin pages don't emit SEO)
18. **M5 DUPLICATE OF C3**
19. **M6 DEFERRED**: buildFaqAiAutomation answer drift (Round 3)
20. **M7 NOTED**: Sitemap lastmod all identical (low, acceptable for now)
21. **M8 DEFERRED**: Person schema missing image (Round 3 — needs Nemr photo)
22. **M9 DEFERRED**: Offer schema incomplete (needs price or url per item)
23. **M10 NOTED**: AboutPage author field (acceptable per schema.org)
24. **L1-L10**: Low priority, deferred

---

## 7. Exact commands reference

### 7.1 TypeScript verification
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm run check
# Expected: > tsc --noEmit  (no errors, exit 0)
```

### 7.2 Dependency install (if node_modules missing)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm install --ignore-scripts
# --ignore-scripts because puppeteer post-install hangs without it
```

### 7.3 Sanity checks
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"

# Brand casing — should only find 3 AiiACo in index.html schema @name fields
grep -rn "AiiACo" client/src/ client/public/ scripts/

# Em-dashes in Round 2 scope — should be 0 across edited files
grep -rn "—" client/index.html client/src/seo/ client/src/data/industries.ts client/src/pages/AIRevenueEnginePage.tsx client/src/pages/AICrmIntegrationPage.tsx client/src/pages/AIWorkflowAutomationPage.tsx client/src/pages/AIForRealEstatePage.tsx client/src/pages/AIForVacationRentalsPage.tsx client/src/pages/NotFound.tsx client/src/pages/IndustryMicrosite.tsx client/src/pages/Home.tsx client/src/App.tsx client/src/entry-server.tsx client/public/ scripts/prerender.mjs 2>/dev/null

# Dead slugs — should be 2 matches (both in prerender.mjs comment explaining the exclusion)
grep -rn "high-risk-merchant\|helium-specialty\|biofuel-sustainable\|cosmetics-personal\|beauty-health" client/src client/public scripts/ 2>/dev/null

# Founding date consistency — should show 2025 everywhere
grep -rn "foundingDate" client/ 2>/dev/null

# Routes in sync — compare entry-server.tsx routeMap vs sitemap.xml vs prerender.mjs STATIC_ROUTES
grep -c "component=" client/src/App.tsx
grep -c '"/' client/src/entry-server.tsx
grep -c "STATIC_ROUTES\|INDUSTRY_SLUGS" scripts/prerender.mjs
grep -c "<loc>" client/public/sitemap.xml
```

### 7.4 Live site bot test (dynamic rendering verification)
```bash
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-integration | grep -c "AI Integration"
# Expected: non-zero (Manus serves pre-rendered HTML to Googlebot)

curl -s -A "GPTBot/1.2" https://aiiaco.com/ai-integration | grep -c "Integration"
# Expected: non-zero

curl -s -A "Mozilla/5.0" https://aiiaco.com/ai-integration | grep -c "Integration"
# Expected: 0 or low (regular browser gets SPA shell, content populates via JS)
```

### 7.5 Wikidata verification
```bash
curl -s "https://www.wikidata.org/wiki/Special:EntityData/Q138638897.json" | python3 -c "import sys,json; d=json.load(sys.stdin); e=list(d['entities'].values())[0]; print('Label:', e['labels']['en']['value']); print('Inception:', e['claims']['P571'][0]['mainsnak']['datavalue']['value']['time'])"
# Expected: Label: AiiACo, Inception: +2025-00-00T00:00:00Z
```

---

## 8. Strategic decisions locked in (do NOT reverse)

1. **"AI infrastructure" ABANDONED** as a keyword target. Unwinnable vs IBM/CoreWeave/Nebius/hyperscalers.
2. **No `/ai-infrastructure` page**. Replaced with `/ai-revenue-engine` targeting "AI revenue systems" (zero competition).
3. **Schema @name** is `AiiACo` (camelcase K). Everywhere else is `AiiAco`.
4. **Founding date** is **2025** (Wikidata Q138638897). Never 2024 or 2026.
5. **NO em-dashes** in any deliverable (website, docs, PDFs, reports, public asset files). Use hyphens, commas, or rewrite. Applies to visible copy, JSON-LD, and comments.
6. **AiiAco is an INTEGRATOR**, not a product vendor. Positioning vs Hospitable/Jurny/EliseAI/Ocrolus/Better.com: always "built on top of your existing stack".
7. **Cloudflare Worker REJECTED**. Manus already serves pre-rendered HTML to bots via dynamic rendering. No Worker needed.
8. **Off-brand industries REMOVED**: high-risk-merchant-services, beauty-health-wellness, cosmetics-personal-care, helium-specialty-gas, biofuel-sustainable-fuels. Do NOT re-add.
9. **StructuredDataSSR takes `pathname` prop**. Never call `useLocation()` inside it at SSR. Client-side wrapper (StructuredData.tsx) handles client routing.
10. **StructuredData renders INSIDE `<Router>`** in App.tsx (not as sibling). wouter context required.
11. **NotFound uses `suppressCanonical` + `noindex`**. Never hardcode `/404` as a canonical URL.
12. **Framer Motion fix lives in prerender.mjs post-processor**, NOT in SSR wrapper. MotionConfig reducedMotion doesn't reliably override `initial` prop across framer-motion versions.
13. **Manus is not a standard host**. We CANNOT deploy, only edit source locally and send changes back to Manus via chat/ZIP/GitHub (when available).
14. **Nemr's GitHub access is broken**: `github.com/10452/aiiaco.git` is a Manus-auto-created account, we have NO push token. Any sync requires Nemr or manual ZIP upload.

---

## 9. Manus sync — how to actually ship Round 2

The source code is ready. It needs to land in `github.com/10452/aiiaco.git` OR be re-uploaded to Manus. Three paths:

### Path A: Nemr re-connects GitHub (best)
1. Have Nemr log into Manus
2. In Manus project settings > GitHub panel, disconnect current repo
3. Reconnect with our GitHub (MonteKristoAI) or ask him to add MonteKristoAI as collaborator on `10452/aiiaco`
4. Once we have push access, we commit all Round 2 changes and push
5. Manus auto-pulls and re-deploys

### Path B: ZIP upload through Manus UI (likely works)
1. `cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"`
2. `zip -r aiiaco-round2.zip aiiaco/client aiiaco/scripts -x "*/node_modules/*" -x "*/__manus__/*"`
3. Send ZIP to Nemr
4. Nemr uploads via Manus UI (if supported) OR opens Manus chat and says "apply this updated source"

### Path C: Manus agent prompt (costs credits)
1. Open Manus chat
2. Paste a detailed prompt listing every file to change + exact diffs
3. Manus agent applies changes one by one
4. Costs Nemr Manus credits

**Recommended**: Path A first, Path B fallback. Path C only if desperate.

### Post-sync verification
Once Round 2 ships to aiiaco.com:
1. Visit `https://aiiaco.com/ai-revenue-engine` → should render the new page
2. Visit `https://aiiaco.com/ai-crm-integration`, `/ai-workflow-automation`, `/ai-for-real-estate`, `/ai-for-vacation-rentals` → all should render
3. `curl -A "Googlebot/2.1" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"` should be > 0
4. View page source on `/ai-integration` → look for `"@type": "FAQPage"` in head (should be there)
5. View page source on any industry page → look for `"@type": "Service"` and `"@type": "BreadcrumbList"`
6. Check sitemap at `https://aiiaco.com/sitemap.xml` → should contain 5 new service URLs
7. Google Search Console → Sitemaps → re-submit sitemap
8. Google Search Console → URL Inspection on each new page → Request Indexing

---

## 10. Access state (access granted so far)

| Service | Status | How |
|---|---|---|
| Google Search Console | ✅ Full user | Granted by nemr@aiiaco.com to contact@montekristobelgrade.com |
| Google Analytics 4 | ✅ Editor | Granted to contact@montekristobelgrade.com, property G-6XQ3T33HTF |
| Google Business Profile | ✅ Manager | Nemr added |
| Manus editor | ✅ Via alex@aiiaco.com | Google Workspace account on aiiaco.com, created by Marylou 2026-03-18 |
| Manus project ZIP download | ✅ | Downloaded 2026-04-11 |
| Manus GitHub repo push | ❌ | 10452/aiiaco is private, Manus-auto-created, no push token |
| Cloudflare (Milan's own) | ✅ | Token in .mcp.json, can manage gummygurl.com, luxeshutters.com.au. aiiaco.com NOT added as zone (unnecessary). |
| Cloudflare (Nemr's — aiiaco.com) | ❌ | Nemr marked DONE in access doc but invite never arrived. Not needed for current scope. |
| Brand assets | ✅ | Google Drive folder: `https://drive.google.com/drive/folders/1YASBMB1AiOh_gevnGz7qoTG7kgJ7AEOO` |
| Calendly admin | ⚠ | `calendly.com/aiiaco` — Nemr said "you have access" but we haven't verified |
| Plausible Analytics | ⚠ | Nemr created account but hasn't installed the token on the site yet |
| LinkedIn Company Page | ❌ | No admin access, 16 followers |
| X/Twitter | ❌ | Account doesn't exist yet; Nemr said he'd create one |
| Namecheap DNS | ❌ | Not needed (no nameserver change required) |

---

## 11. NEXT SESSION BUCKETS — pick one and go

### Bucket A: Sync Round 2 to Manus (PRIORITY 1, BLOCKS EVERYTHING)
**Why**: All Round 2 work is local only. Until it lands on aiiaco.com, Google can't crawl the new pages, and none of our SEO work has any effect on rankings.

**Steps**:
1. Message Nemr: ask him to either (a) re-connect GitHub in Manus and add MonteKristoAI as collaborator to 10452/aiiaco, or (b) upload a ZIP we provide, or (c) apply changes via Manus chat agent.
2. Prepare the ZIP if Path B chosen:
   ```bash
   cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"
   zip -r aiiaco-round2.zip aiiaco/client aiiaco/scripts -x "*/node_modules/*" -x "*/__manus__/*"
   ```
3. Verify live site after Nemr syncs (section 9)
4. Submit sitemap in GSC, request indexation for 5 new routes
5. Update `clients/aiiaco/CLIENT.md` status to "Round 2 shipped"

**Estimated time**: 1-2 hours depending on Nemr's response time

### Bucket B: Round 3 cleanup (deferred from Round 2)
**Why**: 242 AiiACo instances + 29 em-dashes remain in components we didn't touch in Round 2. Brand consistency should be sitewide before Nemr presents the site publicly.

**Files to clean** (use grep then Python batch):
- `client/src/components/HeroSection.tsx`
- `client/src/components/PlatformSection.tsx`
- `client/src/components/MethodSection.tsx`
- `client/src/components/OperationalLeaks.tsx`
- `client/src/components/BuiltForCorporateAge.tsx`
- `client/src/components/ResultsSection.tsx`
- `client/src/components/Industries.tsx`
- `client/src/components/CredibilityBlock.tsx`
- `client/src/components/EngagementModels.tsx`
- `client/src/components/CallNowButton.tsx`
- `client/src/components/Navbar.tsx`
- `client/src/components/Footer.tsx`
- `client/src/components/Pricing.tsx`
- `client/src/components/ContactSection.tsx`
- `client/src/components/caseStudies/caseStudies.data.ts`
- `client/src/components/caseStudies/CaseStudyCard.tsx`
- `client/src/components/caseStudies/CaseStudiesSection.tsx`
- `client/src/components/AfterUpgradeSection.tsx`
- `client/src/components/TeamSection.tsx`
- `client/src/components/WhatIsAiiA.tsx`
- `client/src/components/DreamState.tsx`
- `client/src/const.ts`
- `client/src/index.css`

**Steps**:
1. Grep inventory: `grep -rn "AiiACo" client/src/components/ client/src/const.ts | wc -l` (expect ~242)
2. Grep em-dashes: `grep -rn "—" client/src/components/ client/src/index.css client/src/const.ts | wc -l` (expect ~29)
3. Run Python batch replace preserving schema `@name: "AiiACo"` if any exist in components (unlikely)
4. Run Python batch em-dash replace (→ ` - ` or `,` depending on context)
5. `pnpm run check`
6. Spawn adversarial critic to re-check
7. If priority industry pages (real-estate-brokerage etc) should render `regulations`/`platforms`/`roles` sections visibly, extend `IndustryMicrosite.tsx` to render those fields when present. That pushes industry page word counts from 500 to 1500+ words.

**Estimated time**: 2-4 hours

### Bucket C: blog.aiiaco.com infrastructure
**Why**: Content engine. Competitor audit identified 5 quick-win blog topics that target zero-competition queries.

**Plan** (from master plan):
1. Create GitHub repo `MonteKristoAI/aiiaco-blog`
2. Scaffold with Astro (recommended — fastest SSG for blogs, best SEO out of box)
3. Design: dark theme matching AiiAco brand (`#03050A` bg, gold accents)
4. Deploy to Vercel with custom domain `blog.aiiaco.com`
5. Send CNAME value to Nemr for Namecheap DNS
6. Run `/blog onboard` skill with industry=AI integration services, location=US
7. Populate `Blog/clients/aiiaco/` folder per ONBOARDING.md (CLIENT.md, STYLE.md, BRAND.md, FEEDBACK.md, CONTENT.md, SITEMAP.md)
8. Create persona via `/blog persona create aiiaco`
9. Publish first 4 launch posts:
   - **"What is an AI revenue system?"** (pillar, zero-competition definitional claim)
   - **"How to reactivate a dormant customer database with AI"** (quick win)
   - **"How AI automates operations for real estate brokerages"** (vertical gap)
   - **"How to integrate AI into a real estate CRM"** (CRM vertical gap)

**Estimated time**: 6-10 hours for setup + first 4 posts

### Bucket D: Domain portfolio strategy
**Why**: Nemr owns ~100 domains. Most are likely dormant but some may have existing backlinks and authority.

**Steps**:
1. Message Nemr: ask for full domain list (CSV or spreadsheet)
2. For each domain, check:
   - DNS resolution (is it live?)
   - WHOIS age
   - Archive.org snapshot history
   - Free backlink checker (Ahrefs Backlink Checker tier, moz.com)
3. Categorize:
   - **301 redirect to aiiaco.com** (domains with authority, topically aligned)
   - **Standalone content hub** (2-3 high-value, unique content, linked naturally — NOT PBN)
   - **Park or drop** (weak, off-brand)
4. Present plan to Nemr before executing
5. NEVER create thin PBN sites (Google penalty risk)

**Estimated time**: 3-5 hours

### Bucket E: Off-site / authority building
**Why**: E-E-A-T is Google's #1 ranking factor post-Dec 2025 Core Update. AiiAco has zero founder signal off-site.

**Steps**:
1. **Inman guest post pitch** (Nemr bylined) — "How AI Is Changing Real Estate Brokerage Operations" or similar
2. **HousingWire guest column** — mortgage-focused
3. **Podcast outreach list**: Inman Access, Real Estate Rockstars, Brian Buffini, Tom Ferry, VRMA podcasts, Rental Scale-Up, Get Paid For Your Pad
4. **LinkedIn content ramp**: 2-3 Nemr posts per week, themes matching target keywords
5. **YouTube channel**: first 3-5 min explainer video (0.737 correlation with AI citation per audit)
6. **Wikipedia entry creation**: nontrivial, requires community consensus. Probably defer.
7. **G2 / Capterra listings**: create profiles for AiiAco (requires Nemr's business credentials)

**Estimated time**: ongoing (weeks)

### Bucket F: Industry page visual expansion (ties to Round 3)
**Why**: Industry data now has regulations/platforms/roles for priority 5, but IndustryMicrosite.tsx doesn't render them yet.

**Steps**:
1. Extend IndustryMicrosite.tsx with new sections:
   - **"Compliance & Regulatory Context"** (renders `industry.regulations` as badge grid)
   - **"Platform Integrations"** (renders `industry.platforms` as card grid with supported logos)
   - **"Who We Work With"** (renders `industry.roles` as list)
2. Position: between Use Cases and Case Study (or between FAQ and Related Industries)
3. Make each section conditional on the field being populated
4. Push priority 5 industry pages from ~500 words to ~1500-2000 words

**Estimated time**: 2-3 hours

### Bucket G: PDF audit report for Nemr
**Why**: We have a rich audit in Markdown but Nemr might want a branded PDF to share with investors/board.

**Steps**:
1. Use `/report` skill with MonteKristo branding
2. Source: `clients/aiiaco/audit/MASTER-AUDIT-REPORT.md` + `ACTION-PLAN.md`
3. Generate A4 PDF via reports-engine (Puppeteer + paged.js)
4. Upload to Drive
5. Send Nemr the shareable link

**Estimated time**: 30 minutes

---

## 12. Known pitfalls and workarounds we learned

### 12.1 "Prompt is too long" errors when spawning subagents
Workaround: Keep agent prompts under ~2500 words. If longer, break into multiple agents.

### 12.2 Firecrawl scrape results exceeding token limit
Workaround: When rawHtml exceeds limits, use Grep on the saved file path instead of reading the output directly.

### 12.3 wouter Link vs wouter Route children pattern
wouter 3 supports both `<Route component={X} />` AND `<Route path="/x"><Y /></Route>`. When mixing, be aware that the children pattern does NOT auto-pass params. For dynamic routes like `/industries/:slug`, use `useParams<{ slug: string }>()` inside the component.

### 12.4 react-helmet-async merge semantics
Last-one-wins for `<title>`. Multiple `<Helmet>` components can render in the same tree; they merge. The NoindexRoute was previously using `<SEO noindex title="Private - AiiAco">` which clobbered child titles — fixed by switching NoindexRoute to inject only `<meta name="robots">` directly via `<Helmet>`.

### 12.5 Framer Motion `reducedMotion="always"` doesn't override `initial`
framer-motion 12.x `MotionConfig reducedMotion="always"` suppresses transitions but does NOT override `initial={{ opacity: 0 }}`. Components still render at opacity:0 in SSR snapshot. Fix has to happen post-render at the HTML string level (see prerender.mjs post-processor).

### 12.6 Manus dynamic rendering is good
Don't build workarounds for Manus's SPA rendering. Manus serves pre-rendered HTML to 10+ bot UAs. Test with `curl -A "Googlebot"` before assuming a rendering problem.

### 12.7 JSON-LD @graph vs separate scripts
Google accepts both. Multiple `<script type="application/ld+json">` blocks in the same document are fine, and `@id` references resolve across scripts within the same document. We use separate scripts (simpler).

### 12.8 Em-dash purge: use character substitution, not rewriting
`—` → ` - ` (hyphen with spaces). Don't try to semantically rewrite 111 instances — the cost of case-by-case editing is too high. Batch replace is good enough.

### 12.9 Python brace-matching for industries.ts edits
When removing objects from a TypeScript array literal, use a proper brace-counting parser (not regex). Previous naive regex left dangling fragments. See Phase D Python script pattern.

### 12.10 TypeScript strict mode
Any untyped `any` or implicit `any` will fail `tsc --noEmit`. When adding new fields to interfaces, make them optional (`?`) if existing data doesn't have them, to avoid breaking existing entries.

---

## 13. MCP servers used

- `mcp__cloudflare__execute` / `mcp__cloudflare__search` — Cloudflare API (api token `[REDACTED]` in .mcp.json, used for zone management not needed anymore)
- `mcp__firecrawl-mcp__firecrawl_scrape` / `firecrawl_map` — live site scraping + site mapping
- `mcp__google-workspace__*` — Gmail, Drive, Docs, Sheets (account: `main` = `contact@montekristobelgrade.com`)
- `mcp__github__*` — GitHub (MonteKristoAI token, NO access to 10452/aiiaco private repo)
- `mcp__perplexity__perplexity_research` / `perplexity_ask` — competitor research
- `mcp__nanobanana-mcp__*` — Gemini image generation (not used yet, reserved for blog phase)
- `Agent` tool with subagent types: `seo-technical`, `seo-content`, `seo-geo`, `general-purpose`, `Explore`, `Plan` — audit + critic loops

---

## 14. Memory / project files updated

- `/Users/milanmandic/.claude/projects/-Users-milanmandic-Desktop-MonteKristo-AI/memory/MEMORY.md` — added pointer to project_aiiaco.md
- `/Users/milanmandic/.claude/projects/-Users-milanmandic-Desktop-MonteKristo-AI/memory/project_aiiaco.md` — single-line reminder to read SESSION-STATE.md first
- `/Users/milanmandic/Desktop/MonteKristo AI/clients/INDEX.md` — AiiAco entry exists (added earlier in engagement)
- `/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/CLIENT.md` — status updated to "Round 2 complete, awaiting Manus sync"

---

## 15. Conversation context (for disambiguation)

This engagement started when Milan received `aiiaco.com` as a new client. Nemr filled in an access requirements Google Doc (`https://docs.google.com/document/d/1ONrb3CPoDLebYihuVAP4YE50FOt0rS0Zo6mrbYcdsow`) which contained his positioning brief (section 1.2 above). We ran a 4-subagent SEO audit, discovered Manus handles dynamic rendering, downloaded the source ZIP, and executed 2 rounds of code fixes with adversarial critic loops.

Milan's behavioral preferences (saved in memory):
- **No em-dashes in any deliverable** — strictly enforced
- **All outbound emails/messages require approval** before sending
- **MonteKristo branding on all documents** (PDF via /report skill preferred over Google Docs)
- **REIG Solar WP scheduling rule** applies to REIG blog posts (not AiiAco)
- **Content quality: zero AI tells** in any public content

Nemr's behavioral preferences:
- Non-negotiable "AI Integration Authority" positioning
- "Not AI tools, not chatbots, not marketing automation"
- Performance-based engagement preferred
- Target industries: real estate, mortgage, hospitality, consulting
- Direct, no-fluff copy style
- Measured outcomes over promises

---

## 16. How to continue autonomously

If you're reading this in a fresh session and the user has asked you to continue on AiiAco:

1. Read this file fully (you're doing that now)
2. Run `pnpm run check` in the working directory to verify TypeScript still clean
3. Run the sanity checks from section 7.3 to verify no drift
4. Check if Round 2 has shipped to aiiaco.com yet:
   ```bash
   curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
   ```
   - If > 0: Round 2 is live, move to post-ship tasks (GSC submission, Round 3, or other buckets)
   - If 0: Round 2 NOT shipped, Bucket A is priority 1
5. Ask the user which bucket they want to tackle OR proceed with Bucket A if they've given blanket approval
6. Do NOT re-run the 4-agent audit. Do NOT redo Round 1 or Round 2 fixes.
7. Update this file as work progresses — add entries to section 6 if new critic findings, section 11 if new buckets emerge, section 9 when Manus sync completes.

---

**End of session state. 4660+ lines of code ready to ship. Round 2 complete, awaiting sync. Phase G (blog), Phase H (domains), Phase I (off-site) still to come.**
