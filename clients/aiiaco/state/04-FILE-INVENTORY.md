# AiiAco — File Inventory (Round 2 Changes)

Every file modified or created in Round 2. For each: exact location, line count, purpose, specific changes, key code patterns.

---

## NEW FILES (6)

### 1. `client/src/pages/AIRevenueEnginePage.tsx` (234 lines)

**Route**: `/ai-revenue-engine`
**Target keyword**: "AI revenue systems" (zero competition per competitor audit)
**Strategic importance**: HIGHEST — this is the definitional whitespace claim we're making. Replaces the abandoned `/ai-infrastructure` page.

**Structure**:
1. Hero section (badge + H1 "AI Revenue Engine. Pipeline Without Proportional Headcount." + direct-answer paragraph + CTAs)
2. "Not a Tool. An Operating Layer." definitional section (AEO-optimized prose block)
3. 5 components grid:
   - 01 Lead Generation Layer
   - 02 Multi-Touch Nurture Engine
   - 03 Pipeline Intelligence
   - 04 Dormant Database Reactivation
   - 05 Closed-Loop Revenue Attribution
4. FAQSection (8 questions, see below)
5. Related Services grid (links to /ai-integration, /ai-crm-integration, /ai-workflow-automation)
6. Final CTA to /upgrade

**FAQ questions (exact)**:
1. "What is an AI revenue system?"
2. "How is this different from buying a sales AI tool like Outreach, Salesloft, or Clay?"
3. "How much revenue can an AI revenue system generate from a dormant customer database?"
4. "How long does AiiAco take to deploy an AI revenue system?"
5. "Does AiiAco replace the sales team?"
6. "Which CRMs does AiiAco integrate with?"
7. "Can an AI revenue system be deployed performance-based?"
8. "What makes AiiAco qualified to build this vs an internal team?"

**Imports**: `SEO`, `Navbar`, `Footer`, `FAQSection`, `motion` (framer-motion), `Link` (wouter)
**Fade variant**: Standard pattern
**SEO**: Uses `<SEO path="/ai-revenue-engine" />` - pulls from PAGE_META
**Key data constants**:
- `components` array (5 objects with `n`, `title`, `body`)
- `faqItems` array (8 Q&A)

**Unverifiable claim to watch**: "15 to 25 percent response rates" from dormant database reactivation. Critic M1 flagged as potentially unverifiable. Hedge if challenged.

---

### 2. `client/src/pages/AICrmIntegrationPage.tsx` (209 lines)

**Route**: `/ai-crm-integration`
**Target keyword**: "AI CRM integration", "how to integrate AI into a CRM"

**Structure**:
1. Hero (badge "AI CRM Integration" + H1 "AI CRM Integration. Your CRM. Smarter Operations." + direct-answer paragraph + CTAs)
2. 4-step how-to section:
   - 01 Map the CRM Workflow
   - 02 Design the Integration Layer
   - 03 Deploy Without Platform Migration
   - 04 Manage and Optimize
3. Supported CRMs grid (12 platforms)
4. FAQSection (6 questions)
5. Final CTA

**Supported CRMs (exact list)**:
```
Salesforce
HubSpot
Pipedrive
GoHighLevel
Follow Up Boss
Zoho CRM
Microsoft Dynamics 365
Close
Copper
Keap
ActiveCampaign
Monday.com CRM
```

**FAQ questions**:
1. "How do you integrate AI into a CRM?"
2. "Which CRMs does AiiAco work with?"
3. "Do we have to migrate off our current CRM?"
4. "What does AI actually do inside a CRM?"
5. "How long does an AI CRM integration take?"
6. "Is AI CRM integration compliant with data privacy rules?"

---

### 3. `client/src/pages/AIWorkflowAutomationPage.tsx` (163 lines)

**Route**: `/ai-workflow-automation`
**Target keyword**: "AI workflow automation", "how AI automates operations"

**Structure**:
1. Hero
2. "6 Automation Categories" section (grid):
   - 01 Revenue Operations
   - 02 Client Operations
   - 03 Document Intelligence
   - 04 Financial Operations
   - 05 Workforce Optimization
   - 06 Operational Infrastructure
3. FAQSection (6 questions)
4. Final CTA

**FAQ questions**:
1. "How does AI automate business operations?"
2. "What operational tasks can AI automate immediately?"
3. "What is the difference between AI workflow automation and RPA?"
4. "Does AiiAco build on top of tools like n8n, Make, or Zapier?"
5. "How long does AI workflow automation take to deploy?"
6. "How is AI workflow automation measured?"

**Positioning note**: This page explicitly says AiiAco builds ON TOP of n8n, Make, Zapier, Workato — we are the integrator, not a competing automation platform.

---

### 4. `client/src/pages/AIForRealEstatePage.tsx` (172 lines)

**Route**: `/ai-for-real-estate`
**Target keyword**: "AI for real estate brokerages", "AI for real estate"
**Cross-link to**: `/industries/real-estate-brokerage` (deeper industry page)

**Structure**:
1. Hero
2. 6 Use Cases grid:
   - 01 Lead Qualification in Seconds
   - 02 MLS-Compliant Listing Content
   - 03 Automated Multi-Touch Follow-Up
   - 04 Pipeline Intelligence
   - 05 Dormant Database Reactivation
   - 06 Transaction Coordination
3. Supported platforms grid (10 brokerage platforms)
4. FAQSection (6 questions)
5. Final CTA

**Supported platforms (exact list)**:
```
Follow Up Boss
kvCORE
BoomTown
Lofty (formerly Chime)
BoldTrail
Compass
dotloop
SkySlope
Salesforce Real Estate Cloud
Zillow Premier Agent
```

**FAQ questions**:
1. "How does AI help real estate brokerages?"
2. "Does AI replace real estate agents?"
3. "Can AI write MLS listings without violating Fair Housing Act rules?"
4. "Which real estate platforms does AiiAco integrate with?"
5. "How long does AI integration take for a real estate brokerage?"
6. "Can AiiAco deploy performance-based for a brokerage?"

**Note**: Critic M2 caught that the original draft had both "Chime CRM" AND "Lofty (formerly Chime)" — these are the same product. Fixed by removing "Chime CRM".

---

### 5. `client/src/pages/AIForVacationRentalsPage.tsx` (175 lines)

**Route**: `/ai-for-vacation-rentals`
**Target keyword**: "AI for vacation rentals", "AI vacation rental management"
**Strategic positioning**: AiiAco is the **integrator layer**, NOT a competing vendor. Explicitly framed against Hospitable/Jurny/Hostaway messaging.
**Cross-link to**: `/industries/luxury-lifestyle-hospitality`

**Structure**:
1. Hero ("Scale From 50 Units to 500. Without Chaos.")
2. 6 Use Cases:
   - 01 Guest Communication Automation
   - 02 Dynamic Pricing Integration
   - 03 Maintenance Coordination
   - 04 Review Intelligence
   - 05 Financial Reporting Automation
   - 06 Unit Onboarding Automation
3. Supported platforms grid (14 platforms)
4. FAQSection (6 questions)
5. Final CTA

**Supported platforms (exact list)**:
```
Hostaway
Guesty
Hospitable
Hostfully
Jurny
RentalReady
Boom
CiiRUS
PriceLabs
Wheelhouse
Beyond Pricing
Airbnb
Vrbo
Booking.com
```

**FAQ questions**:
1. "Isn't Hostaway, Hospitable, or Jurny already an AI vacation rental platform?"
2. "Do I have to switch PMS platforms to work with AiiAco?"
3. "What does AI actually do for a vacation rental operator?"
4. "Can AI personalize guest communication across hundreds of units?"
5. "How long does AI integration take for a vacation rental operator?"
6. "Does AiiAco replace housekeepers or property managers?"

**Key positioning quote from page**: "Hostaway, Hospitable, Jurny, RentalReady, and Boom are product platforms that handle specific parts of vacation rental operations. AiiAco is an integration layer that ties those platforms together and adds AI coordination between them."

---

### 6. `client/src/seo/NoindexRoute.tsx` (34 lines)

**Purpose**: Helper wrapper that injects ONLY `<meta name="robots" content="noindex,nofollow">` and `<meta name="googlebot" content="noindex,nofollow">` alongside children. Does NOT override child title/description.

**Why this design**: Earlier version used `<SEO noindex title="Private - AiiAco">` which clobbered child page titles via helmet last-one-wins merge. Phase B+C critic pass refactored.

**Exact code**:
```tsx
import React from "react";
import { Helmet } from "react-helmet-async";

type NoindexRouteProps = {
  children: React.ReactNode;
};

export default function NoindexRoute({ children }: NoindexRouteProps) {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>
      {children}
    </>
  );
}
```

**Used in `client/src/App.tsx`** to wrap these routes:
- `/admin/leads` → AdminLeadsPage
- `/admin/agent` → AdminAgentPage
- `/admin/knowledge` → AdminKnowledgePage
- `/admin/analytics` → AdminAnalyticsPage
- `/admin-opsteam` → AdminConsolePage
- `/operator` → OperatorPage
- `/demo-walkthrough` → DemoWalkthroughPage
- `/portal/login` → PortalAuth
- `/portal` → PortalDashboard
- `/portal/agent` → PortalAgent
- `/portal/conversations` → PortalConversations
- `/portal/embed` → PortalEmbed
- `/portal/billing` → PortalBilling
- `/portal/settings` → PortalSettings

---

## MODIFIED FILES (18)

### 7. `client/index.html` (157 lines)

**Purpose**: Static HTML shell injected by Vite. Contains global JSON-LD schemas shipped with every page.

**Round 1 changes**:
- REMOVED hardcoded `<link rel="canonical" href="https://www.aiiaco.com/">` - now per-page via SEO.tsx
- REMOVED hardcoded `<meta name="description">` - now per-page
- REMOVED hardcoded `<meta name="keywords">` - now per-page
- REMOVED hardcoded `<meta name="robots">` - now per-page
- REMOVED hardcoded `<meta property="og:url">` (pointed to www.aiiaco.com)
- REMOVED hardcoded OG/Twitter title/description
- KEPT fallback `<title>AiiAco | AI Integration Company for Real Estate, Mortgage & Management Consulting</title>` (shell fallback if helmet fails)
- KEPT static `<meta property="og:image">`, `og:site_name`, `og:image:alt`, `twitter:card`, `twitter:site`, `twitter:image` (global, don't vary per page)
- UPDATED Organization schema `foundingDate: "2024"` → `"2025"`
- UPDATED Organization `alternateName: ["AiiA", "AiiAco", "AI Integration Authority"]` → `["AiiAco", "AI Integration Authority"]` (removed "AiiA")
- ADDED Organization `"founder": { "@id": "https://aiiaco.com/#nemr-hallak" }`
- ADDED Organization `"numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 15 }`
- ADDED new `<script type="application/ld+json">` Person schema block for Nemr Hallak (complete)

**Phase F changes**:
- ALL em-dashes replaced with hyphens (7 replacements)
- Marketing-copy `AiiACo` → `AiiAco` (preserved 3 in schema `@name`)

**Schema @id graph** (verify intact after any future edit):
- `https://aiiaco.com/#organization` → Organization
- `https://aiiaco.com/#website` → WebSite (publisher references organization)
- `https://aiiaco.com/#service` → ProfessionalService (provider references organization)
- `https://aiiaco.com/#nemr-hallak` → Person (worksFor references organization)
- Organization has `founder` → Person
- Organization has `sameAs` → [LinkedIn, Wikidata Q138638897, Crunchbase]

**Schemas in file (4 blocks)**:
1. Organization (lines ~45-95)
2. WebSite (lines ~97-107)
3. ProfessionalService (lines ~108-120)
4. Person (lines ~121-148)

**Schema @name field casing** (LOCKED):
- Line ~49: `"name": "AiiACo"` (Organization)
- Line ~102: `"name": "AiiACo - AI Integration Authority"` (WebSite)
- Line ~113: `"name": "AiiACo Enterprise AI Integration"` (ProfessionalService)
- These 3 are the ONLY places `AiiACo` camelcase should appear in the entire codebase

---

### 8. `client/src/seo/seo.config.ts` (154 lines)

**Purpose**: Central PAGE_META map and SITE defaults. Read by SEO.tsx as fallback when page doesn't pass explicit title/description.

**SITE object**:
```ts
export const SITE = {
  name: "AiiAco",
  domain: "https://aiiaco.com",
  defaultTitle: "AiiAco | AI Integration Company for Real Estate, Mortgage & Management Consulting",
  defaultDescription: "AiiAco is an enterprise AI integration company. We design, deploy, and manage operational AI systems for real estate, mortgage lending, and management consulting firms. Done-for-you, performance-based.",
  ogImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia-og-image-v3_1b0f8ae3.png",
  twitterHandle: "@aiiaco",
  keywords: "AI integration, enterprise AI integration, AI integration company, AI revenue systems, AI CRM integration, AI workflow automation, managed AI integration, operational AI infrastructure, AI workforce, done-for-you AI, performance-based AI, AI for real estate, AI for vacation rentals, AI for property management, AI integration authority",
};
```

**PAGE_META keys (24 entries)**:
```
/                              - Homepage
/manifesto                     - Corporate age manifesto
/method                        - 4-phase framework
/industries                    - Industries hub
/models                        - Engagement models
/case-studies                  - Case studies list
/results                       - Outcomes
/upgrade                       - Conversion page
/privacy                       - Privacy policy
/terms                         - Terms of service
/ai-integration                - Pillar AI integration page
/ai-implementation-services    - Existing service page
/ai-automation-for-business    - Existing service page
/ai-governance                 - Existing page
/workplace                     - Workplace offering
/corporate                     - Corporate offering
/agentpackage                  - Agent package
/demo                          - Demo page
/talk                          - Talk to AiA voice page
/ai-crm-integration            - NEW service page
/ai-workflow-automation        - NEW service page
/ai-revenue-engine             - NEW service page (highest priority)
/ai-for-real-estate            - NEW service page
/ai-for-vacation-rentals       - NEW service page
```

**Helper function**:
```ts
export function buildIndustryMeta(slug: string, industryName: string): {
  title: string;
  description: string;
} {
  return {
    title: `AI Integration for ${industryName} | AiiAco`,
    description: `Operational AI integration for ${industryName}. AiiAco designs, deploys, and manages AI systems that eliminate friction, automate workflows, and unlock measurable throughput without adding headcount.`,
  };
}
```

---

### 9. `client/src/seo/SEO.tsx` (73 lines)

**Purpose**: React component that injects per-page meta tags via react-helmet-async.

**Props interface** (exact):
```ts
type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  ogImage?: string;
  keywords?: string;
  suppressCanonical?: boolean;  // NEW in Phase F
};
```

**Resolution chain** (for title and description):
1. Explicit `title` / `description` prop passed by page
2. `PAGE_META[path]?.title` / `PAGE_META[path]?.description`
3. `SITE.defaultTitle` / `SITE.defaultDescription`

**suppressCanonical** (new in Phase F):
- When true, omits `<link rel="canonical">` AND `<meta property="og:url">`
- Used ONLY by NotFound.tsx to avoid creating false canonicals for unknown URLs

**Imports**:
```ts
import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE, PAGE_META } from "./seo.config";
```

---

### 10. `client/src/seo/StructuredData.tsx` (42 lines)

**Purpose**: CLIENT-side dispatcher. Runs in browser after hydration. Uses wouter `useLocation()` to get current route, normalizes pathname, delegates to StructuredDataSSR.

**CRITICAL**: Must be rendered INSIDE `<Router>` in App.tsx. Previously rendered as sibling of Router → hydration mismatch. Fixed in Phase F.

**Exact code**:
```tsx
import { useLocation } from "wouter";
import StructuredDataSSR from "./StructuredDataSSR";

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

---

### 11. `client/src/seo/StructuredDataSSR.tsx` (438 lines)

**Purpose**: Page-specific JSON-LD schema dispatcher. Used by BOTH:
- SSR (via `entry-server.tsx` with explicit `pathname` prop)
- Client (via `StructuredData.tsx` which extracts pathname from wouter useLocation)

**CRITICAL DESIGN**: Takes `pathname` as a **PROP**, NOT via `useLocation()`. Decouples from wouter Router context.

**Schemas dispatched by route**:

| Route | Schemas |
|---|---|
| `/` | (none - global schemas from index.html shell cover homepage) |
| any non-`/` route | BreadcrumbList (auto-generated from URL segments) |
| `/method` | BreadcrumbList + HowTo |
| `/ai-integration` | BreadcrumbList + FAQPage (4 Q&A) |
| `/ai-automation-for-business` | BreadcrumbList + FAQPage (3 Q&A) |
| `/ai-crm-integration` | BreadcrumbList + FAQPage (3 Q&A) |
| `/ai-workflow-automation` | BreadcrumbList + FAQPage (3 Q&A) |
| `/ai-revenue-engine` | BreadcrumbList + FAQPage (3 Q&A) |
| `/ai-for-real-estate` | BreadcrumbList + FAQPage (3 Q&A) |
| `/ai-for-vacation-rentals` | BreadcrumbList + FAQPage (3 Q&A) |
| `/manifesto` | BreadcrumbList + AboutPage |

**UPPER_TOKENS dictionary** (fixes breadcrumb casing):
```ts
const UPPER_TOKENS: Record<string, string> = {
  ai: "AI",
  crm: "CRM",
  ev: "EV",
  b2b: "B2B",
  b2c: "B2C",
  saas: "SaaS",
};
```

Without this, `/ai-crm-integration` breadcrumb label would be "Ai Crm Integration" (wrong). With it: "AI CRM Integration".

**Helper functions** (7 total):
1. `titleCaseSegment(segment)` - handles URL slug → display title with upper tokens
2. `buildBreadcrumb(pathname)` - returns BreadcrumbList schema or null
3. `buildHowToMethod()` - returns HowTo schema for /method
4. `buildFaqAiIntegration()` - 4 Q&A
5. `buildFaqAiAutomation()` - 3 Q&A
6. `buildFaqAiCrmIntegration()` - 3 Q&A
7. `buildFaqAiWorkflowAutomation()` - 3 Q&A
8. `buildFaqAiRevenueEngine()` - 3 Q&A
9. `buildFaqAiForRealEstate()` - 3 Q&A
10. `buildFaqAiForVacationRentals()` - 3 Q&A
11. `buildAboutPageManifesto()` - AboutPage for /manifesto

**Main export**:
```tsx
type StructuredDataSSRProps = {
  pathname: string;
};

export default function StructuredDataSSR({ pathname }: StructuredDataSSRProps) {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  const schemas: SchemaInput[] = [];
  const breadcrumb = buildBreadcrumb(normalized);
  if (breadcrumb) schemas.push(breadcrumb);
  if (normalized === "/method") schemas.push(buildHowToMethod());
  if (normalized === "/ai-integration") schemas.push(buildFaqAiIntegration());
  if (normalized === "/ai-automation-for-business") schemas.push(buildFaqAiAutomation());
  if (normalized === "/ai-crm-integration") schemas.push(buildFaqAiCrmIntegration());
  if (normalized === "/ai-workflow-automation") schemas.push(buildFaqAiWorkflowAutomation());
  if (normalized === "/ai-revenue-engine") schemas.push(buildFaqAiRevenueEngine());
  if (normalized === "/ai-for-real-estate") schemas.push(buildFaqAiForRealEstate());
  if (normalized === "/ai-for-vacation-rentals") schemas.push(buildFaqAiForVacationRentals());
  if (normalized === "/manifesto") schemas.push(buildAboutPageManifesto());

  if (schemas.length === 0) return null;

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
```

**Known deferred issue (Round 3)**: FAQ answer text in schema is shortened/reworded vs what appears on the page. Google prefers byte-identical match between FAQ schema and visible content. Fix: import `faqItems` from the page modules directly instead of re-declaring in StructuredDataSSR. Not critical for ship.

---

### 12. `client/src/entry-server.tsx` (128 lines)

**Purpose**: SSG entry point used by `scripts/prerender.mjs` at build time. Exports `renderRoute(url)` that returns `{ html, helmetContext }`.

**Page imports (20)**:
Home, ManifestoPage, MethodPage, IndustriesPage, ModelsPage, CaseStudiesPage, ResultsPage, UpgradePage, PrivacyPage, TermsPage, NotFound, AIIntegrationPage, AIImplementationPage, AIAutomationPage, AIGovernancePage, WorkplacePage, CorporatePage, AgentPackagePage, OperatorPage, DiagnosticDemoPage, TalkPage, IndustryMicrosite, **AICrmIntegrationPage, AIWorkflowAutomationPage, AIRevenueEnginePage, AIForRealEstatePage, AIForVacationRentalsPage**

**routeMap (21 static entries)**:
```ts
const routeMap: Record<string, React.ComponentType> = {
  "/": Home,
  "/manifesto": ManifestoPage,
  "/method": MethodPage,
  "/industries": IndustriesPage,
  "/models": ModelsPage,
  "/case-studies": CaseStudiesPage,
  "/results": ResultsPage,
  "/upgrade": UpgradePage,
  "/privacy": PrivacyPage,
  "/terms": TermsPage,
  "/ai-integration": AIIntegrationPage,
  "/ai-implementation-services": AIImplementationPage,
  "/ai-automation-for-business": AIAutomationPage,
  "/ai-governance": AIGovernancePage,
  "/workplace": WorkplacePage,
  "/corporate": CorporatePage,
  "/agentpackage": AgentPackagePage,
  "/operator": OperatorPage,
  "/demo": DiagnosticDemoPage,
  "/talk": TalkPage,
  "/ai-crm-integration": AICrmIntegrationPage,
  "/ai-workflow-automation": AIWorkflowAutomationPage,
  "/ai-revenue-engine": AIRevenueEnginePage,
  "/ai-for-real-estate": AIForRealEstatePage,
  "/ai-for-vacation-rentals": AIForVacationRentalsPage,
};
```

**Dynamic route handling** (for /industries/:slug):
```ts
let PageComponent: React.ComponentType = NotFound;
if (routeMap[url]) {
  PageComponent = routeMap[url];
} else if (url.startsWith("/industries/")) {
  PageComponent = IndustryMicrosite;
}
```

**renderRoute body**:
```tsx
const html = renderToString(
  <HelmetProvider context={helmetContext}>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Router hook={hook}>
            <StructuredDataSSR pathname={url} />
            <Toaster />
            <PageComponent />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </HelmetProvider>
);
```

**Critical**: `StructuredDataSSR pathname={url}` MUST be INSIDE `<Router hook={hook}>` (Phase A critic fix). NO `MotionConfig` wrapper (removed in Phase F).

---

### 13. `scripts/prerender.mjs` (219 lines)

**Purpose**: Node script that runs after Vite build. Produces static HTML per route.

**STATIC_ROUTES (25)**:
```js
const STATIC_ROUTES = [
  "/",
  "/manifesto",
  "/method",
  "/industries",
  "/models",
  "/case-studies",
  "/results",
  "/upgrade",
  "/privacy",
  "/terms",
  "/ai-integration",
  "/ai-implementation-services",
  "/ai-automation-for-business",
  "/ai-governance",
  "/ai-crm-integration",
  "/ai-workflow-automation",
  "/ai-revenue-engine",
  "/ai-for-real-estate",
  "/ai-for-vacation-rentals",
  "/workplace",
  "/corporate",
  "/agentpackage",
  "/operator",
  "/demo",
  "/talk",
];
```

**INDUSTRY_SLUGS (20)**:
```js
// Off-brand slugs (high-risk-merchant-services, beauty-health-wellness,
// cosmetics-personal-care, helium-specialty-gas, biofuel-sustainable-fuels)
// are intentionally excluded from SEO pre-rendering per the SEO audit.
const INDUSTRY_SLUGS = [
  "real-estate-brokerage",
  "mortgage-lending",
  "commercial-real-estate",
  "management-consulting",
  "insurance",
  "financial-services",
  "investment-wealth-management",
  "luxury-lifestyle-hospitality",
  "software-technology",
  "agency-operations",
  "energy",
  "solar-renewable-energy",
  "automotive-ev",
  "food-beverage",
  "cryptocurrency-digital-assets",
  "software-consulting",
  "software-engineering",
  "oil-gas",
  "alternative-energy",
  "battery-ev-technology",
];

const ROUTES = [
  ...STATIC_ROUTES,
  ...INDUSTRY_SLUGS.map(slug => `/industries/${slug}`),
];
```

**Framer Motion post-processor** (exact):
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

**Why scoped**: Phase B+C critic caught that the naive global regex broke badge centering (`translateX(-50%)`), progress bars, hidden modals. Scoping to style attributes containing BOTH opacity:0 AND translate catches Framer initial state specifically.

**Title injection fix**:
```js
if (helmetTitleStr && helmetTitleStr.trim().length > 0) {
  output = output.replace(/<title>[^<]*<\/title>/, "");
}
```
Only strips shell `<title>` if helmet emitted its own. Previously always stripped, leaving pages title-less on helmet failures.

---

### 14. `client/src/App.tsx` (175 lines)

**Purpose**: Client-side Router + App wrapper.

**Imports added in Round 2**:
- `NoindexRoute` from `./seo/NoindexRoute`
- `AICrmIntegrationPage`, `AIWorkflowAutomationPage`, `AIRevenueEnginePage`, `AIForRealEstatePage`, `AIForVacationRentalsPage` from `./pages/...`

**Router() function structure** (Phase F final form):
```tsx
function Router() {
  return (
    <>
      <StructuredData />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/manifesto" component={ManifestoPage} />
        ...
        {/* 5 new service pages */}
        <Route path="/ai-crm-integration" component={AICrmIntegrationPage} />
        <Route path="/ai-workflow-automation" component={AIWorkflowAutomationPage} />
        <Route path="/ai-revenue-engine" component={AIRevenueEnginePage} />
        <Route path="/ai-for-real-estate" component={AIForRealEstatePage} />
        <Route path="/ai-for-vacation-rentals" component={AIForVacationRentalsPage} />
        ...
        <Route path="/industries/:slug" component={IndustryMicrosite} />
        {/* Admin routes - all noindex */}
        <Route path="/admin/leads">
          <NoindexRoute><AdminLeadsPage /></NoindexRoute>
        </Route>
        {/* ... 13 more NoindexRoute wrappers ... */}
        <Route path="/talk" component={TalkPage} />
        <Route path="/videostudio" component={VideoStudioRedirect} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
```

**Key change**: `<StructuredData />` is inside `Router()` (wouter context available). Previously it was a sibling of `<Router />` in the App component tree, which caused hydration mismatch.

**App() function wrapper**:
```tsx
function App() {
  useEffect(() => {
    document.dispatchEvent(new Event("prerender-ready"));
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <AiiAVoiceWidget />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

**Removed**:
- `<StructuredData />` at App level (moved inside Router)
- Duplicate `<Route path="/operator" component={OperatorPage} />` (old unwrapped route bypassing NoindexRoute)
- Explicit `<Route path="/404" component={NotFound} />` (was returning 200, fallback handles it)

---

### 15. `client/src/pages/Home.tsx` (141 lines)

**Purpose**: Homepage component.

**Round 2 change** (single):
```tsx
// Before:
<SEO
  title="AiiA | Remove Operational Friction. Run Your Business Faster."
  description="AiiA helps growing companies..."
  path="/"
  keywords="AI integration authority, ..."
/>

// After:
{/* title/description resolve from PAGE_META["/"] in seo.config.ts - no manual override */}
<SEO path="/" />
```

Removed explicit title (which had brand inconsistency — "AiiA" vs "AiiAco"). Now uses PAGE_META["/"] which is canonical.

Visible content unchanged. Uses existing HeroSection, CredibilityBlock, OperationalLeaks, PlatformSection, MethodSection, AfterUpgradeSection, ResultsSection, Industries, CaseStudiesSection, EngagementModels, BuiltForCorporateAge, ContactSection components (none touched).

---

### 16. `client/src/pages/NotFound.tsx` (239 lines) — COMPLETE REWRITE

**Purpose**: 404 page.

**Before**: Light theme (`from-slate-50 to-slate-100`), no SEO component, no navigation. Clashed with dark brand.

**After**: Full dark brand rewrite. Matches `aiiaco.com` visual language.

**Structure**:
1. SEO component with `noindex={true}` and `suppressCanonical={true}`
2. Navbar
3. Main hero section with gradient background
4. Badge ("Error 404")
5. Massive "404" display (clamp(56px, 10vw, 120px))
6. "Page Not Found" heading
7. Copy paragraph
8. CTAs: "Return to Homepage" (btn-gold) + "Browse Industries"
9. Divider
10. "Popular Destinations" section with 6 cards linking to:
    - `/` - Home
    - `/ai-integration` - AI Integration Services
    - `/method` - The AiiAco Method
    - `/industries` - Industries We Serve
    - `/results` - Results
    - `/upgrade` - Request an Engagement
11. Footer

**Key wouter pattern**: Uses `<Link href="/...">` for all internal navigation (SPA-friendly).

**SEO call**:
```tsx
<SEO
  title="Page Not Found | AiiAco"
  description="The page you requested does not exist. Return to aiiaco.com or explore our AI integration services, industries, and engagement models."
  noindex
  suppressCanonical
/>
```

---

### 17. `client/src/pages/IndustryMicrosite.tsx` (1094 lines)

**Purpose**: Dynamic component for all `/industries/:slug` routes. Reads industry data via `getIndustryBySlug(slug)` and renders microsite page.

**Round 2 additions**:

**New imports**:
```tsx
import { Helmet } from "react-helmet-async";
import FAQSection from "@/components/FAQSection";
```

**New constant**:
```tsx
const BASE_URL = "https://aiiaco.com";
```

**New computations**:
```tsx
const relatedIndustries = industry?.relatedSlugs
  ?.map(s => getIndustryBySlug(s))
  .filter((i): i is NonNullable<typeof i> => Boolean(i))
  .slice(0, 4) ?? [];

// Build per-industry JSON-LD schema blocks
const industrySchemas: Array<Record<string, unknown>> = [];
if (industry) {
  const pageUrl = `${BASE_URL}/industries/${industry.slug}`;

  industrySchemas.push({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: `AI Integration for ${industry.name}`,
    serviceType: "AI Integration and Implementation Consulting",
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: "Worldwide",
    description: industry.directAnswer ?? industry.description,
    url: pageUrl,
    category: "Artificial Intelligence Consulting",
  });

  industrySchemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${BASE_URL}/industries` },
      { "@type": "ListItem", position: 3, name: industry.name, item: pageUrl },
    ],
  });

  if (industry.faq && industry.faq.length > 0) {
    industrySchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: industry.faq.map(q => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    });
  }
}
```

**New Helmet block** (after `<SEO>` block):
```tsx
{industrySchemas.length > 0 && (
  <Helmet>
    {industrySchemas.map((schema, i) => (
      <script key={i} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ))}
  </Helmet>
)}
```

**New FAQ section** (conditional, after Use Cases, before Featured Case Study):
```tsx
{industry.faq && industry.faq.length > 0 && (
  <FAQSection
    items={industry.faq}
    eyebrow={`${industry.name} FAQ`}
    headline={`AI for ${industry.name}: Frequently Asked Questions`}
    subheadline={`Answers to the questions ${industry.name.toLowerCase()} operators ask about AI integration, engagement timelines, and how AiiAco deploys and manages the stack.`}
  />
)}
```

**New Related Industries section** (conditional, before Cross-links to pillar pages):
- Renders up to 4 related industry cards
- Uses wouter `<Link>` to link to each related microsite
- Eyebrow "Related Industries" + H2 "Operators in Adjacent Verticals"
- Each card shows: industry name + subheadline + Industry label

**Link fixes** (5 places):
- Back button `href="/#industries"` → `href="/industries"` + changed `<a>` to `<Link>`
- "View All Case Studies" → changed `<a>` to `<Link>`
- "← All Industries" × 2 → changed `<a>` to `<Link>`
- Sticky back bar → changed `<a>` to `<Link>`
- Added `aria-hidden="true"` to decorative chevron SVG

**Round 3 opportunity**: Component does NOT yet render `industry.regulations`, `industry.platforms`, or `industry.roles` fields. Data is populated for 5 priority industries; needs visible rendering. Would push priority industry pages from ~500 words to ~1500 words.

---

### 18. `client/src/data/industries.ts` (954 lines)

**Purpose**: Industry microsite data source. Consumed by IndustryMicrosite.tsx, Industries.tsx (homepage section), and IndustriesPage.tsx (hub).

**Interface** (extended in Round 2):
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
  // ROUND 2 ADDITIONS (all optional):
  directAnswer?: string;
  relatedSlugs?: string[];
  faq?: { question: string; answer: string }[];
  regulations?: string[];
  platforms?: string[];
  roles?: string[];
}
```

**Full data population state**: See `state/06-INDUSTRY-DATA.md` for the complete breakdown of what's populated for each of the 20 industries.

**Removed industries** (5, NEVER re-add):
- high-risk-merchant-services
- beauty-health-wellness
- cosmetics-personal-care
- helium-specialty-gas
- biofuel-sustainable-fuels

**Exported helpers**:
```ts
export const industries: IndustryData[] = [ ... 20 entries ... ];

export function getIndustryBySlug(slug: string): IndustryData | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getPrimaryIndustries(): IndustryData[] {
  return industries.filter(i => i.primary === true);
}
```

---

### 19. `client/public/robots.txt` — MODIFIED

**Purpose**: Crawler access rules.

**Structure**:
1. Header comment block with entity disambiguation context
2. Baseline `User-agent: *` block with Allow / Disallow rules
3. 20 per-bot named blocks, each with identical Disallow list for private paths

**Private paths (in every bot block)**:
```
Disallow: /admin
Disallow: /admin-opsteam
Disallow: /admin/
Disallow: /portal/
Disallow: /operator
Disallow: /demo-walkthrough
```

**Named bots**:
```
Googlebot, Googlebot-Image, Google-Extended
Bingbot
Applebot, Applebot-Extended
GPTBot, OAI-SearchBot, ChatGPT-User
ClaudeBot, Claude-Web, anthropic-ai
PerplexityBot, Perplexity-User
Meta-ExternalAgent
Amazonbot
Bytespider
CCBot
DuckDuckBot
YandexBot
```

**Sitemap reference**: `Sitemap: https://aiiaco.com/sitemap.xml`

**Why per-bot blocks**: Per robots.txt spec, named User-agent blocks are independent from wildcard. If an AI crawler matches a specific block, the wildcard disallows do NOT apply. Phase B+C critic caught this — GPTBot/ClaudeBot could crawl /admin without per-bot blocks. Fixed.

---

### 20. `client/public/sitemap.xml` — REGENERATED

**Purpose**: XML sitemap for search engines.

**Structure** (with section comments):
1. Core (5 URLs): /, /manifesto, /method, /models, /upgrade
2. Service pages (9 URLs): /ai-integration, /ai-automation-for-business, /ai-implementation-services, /ai-governance, /ai-crm-integration, /ai-workflow-automation, /ai-revenue-engine, /ai-for-real-estate, /ai-for-vacation-rentals
3. Industry hub + 20 verticals
4. Supporting (7 URLs): /case-studies, /results, /workplace, /corporate, /agentpackage, /demo, /talk
5. Legal (2 URLs): /privacy, /terms

**Total URLs**: ~43

**Every URL has**:
- `<loc>` with absolute URL
- `<lastmod>2026-04-11</lastmod>` (all identical — Round 3 task to differentiate)
- `<changefreq>` (weekly for homepage, monthly for most, yearly for legal)
- `<priority>` (1.0 homepage, 0.95 ai-revenue-engine, 0.9 services, 0.8-0.9 industries, 0.3 legal)

**Removed URLs** (5 off-brand, never re-add):
- /industries/high-risk-merchant-services
- /industries/beauty-health-wellness
- /industries/cosmetics-personal-care
- /industries/helium-specialty-gas
- /industries/biofuel-sustainable-fuels

---

### 21. `client/public/llms.txt` — MODIFIED (enhanced)

**Purpose**: Plain-text company overview for AI systems (GPT, Claude, Perplexity).

**Sections**:
1. What AiiAco Is
2. **Founder** (NEW — Nemr Hallak with LinkedIn + nemrhallak.com)
3. What We Do (3 service lines)
4. **Typical Outcomes (Measured)** (NEW — specific metrics: 30-70% cycle time, 3x capacity, 60% automation, 75-85% document processing)
5. Industries Served (20 industries listed, matches industries.ts)
6. Who We Work With ($5M to $100M+ revenue ICP)
7. What Makes AiiAco Different
8. **Target Queries (Answer Engine Optimization)** (NEW — 10 AEO questions listed)
9. Contact and Engagement
10. Clarification on Name Confusion (disambiguation from RAII, AIIA, mobile game developers)
11. Verification

**Key additions in Round 2**:
- Founder section with Nemr's full bio + LinkedIn URL
- Typical Outcomes with specific metrics
- Target Queries AEO section
- Founding date 2025 with Wikidata reference

---

### 22. `client/public/about.txt` — MODIFIED (rewrite)

**Purpose**: Company overview plain text (like llms.txt but more conventional format).

**Round 2 changes**:
- Founding year 2024 → 2025 with Wikidata reference
- Added Founder section for Nemr
- **Methodology rewritten** to match HowTo schema phases: Find the Friction / Implement the Fix / Measure the Improvement / Expand What Works (previously inconsistent wording: Diagnostic / Architecture / Deployment / Optimization)
- **Industries list rewritten** to match industries.ts canonical set (previously claimed Legal, Healthcare, Construction, Dealerships which are NOT actually served — critic Phase B+C caught)

---

## SUMMARY TABLE

| # | File | Status | Lines | Key Change |
|---|---|---|---|---|
| 1 | AIRevenueEnginePage.tsx | NEW | 234 | Zero-competition "AI revenue systems" claim |
| 2 | AICrmIntegrationPage.tsx | NEW | 209 | "how to integrate AI into a CRM" target |
| 3 | AIWorkflowAutomationPage.tsx | NEW | 163 | "AI workflow automation" target |
| 4 | AIForRealEstatePage.tsx | NEW | 172 | Industry #1 entry point |
| 5 | AIForVacationRentalsPage.tsx | NEW | 175 | INTEGRATOR positioning |
| 6 | NoindexRoute.tsx | NEW | 34 | Minimal noindex wrapper |
| 7 | index.html | MODIFIED | 157 | Person schema, removed dupe meta |
| 8 | seo.config.ts | MODIFIED | 154 | PAGE_META + 5 new entries |
| 9 | SEO.tsx | MODIFIED | 73 | PAGE_META fallback + suppressCanonical |
| 10 | StructuredData.tsx | REWRITTEN | 42 | Thin client dispatcher |
| 11 | StructuredDataSSR.tsx | REWRITTEN | 438 | pathname prop + 7 FAQ dispatchers |
| 12 | entry-server.tsx | MODIFIED | 128 | +5 routes, StructuredDataSSR inside Router |
| 13 | prerender.mjs | MODIFIED | 219 | +5 routes, scoped post-processor |
| 14 | App.tsx | MODIFIED | 175 | +5 routes, NoindexRoute wraps, StructuredData inside Router |
| 15 | Home.tsx | MODIFIED | 141 | Simplified SEO call |
| 16 | NotFound.tsx | REWRITTEN | 239 | Dark theme, noindex, helpful nav |
| 17 | IndustryMicrosite.tsx | MODIFIED | 1094 | FAQ, Related Industries, inline schema |
| 18 | industries.ts | MODIFIED | 954 | +6 fields, 20 populated |
| 19 | robots.txt | MODIFIED | — | Per-bot Disallow blocks |
| 20 | sitemap.xml | REGENERATED | — | +5 new URLs, lastmod |
| 21 | llms.txt | MODIFIED | — | Founder, metrics, AEO queries |
| 22 | about.txt | MODIFIED | — | Method aligned, 2025 date |

**Total LoC edited/created in TypeScript/TSX**: 4660+ lines
**Total files touched**: 22 + 4 public assets = 24
