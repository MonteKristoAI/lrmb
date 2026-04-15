# AiiAco — SEO Action Plan

**Date**: 2026-04-11
**Method**: Prioritized by impact × effort ratio

---

## P0 — DO TODAY (Critical blockers, all low effort)

These 5 fixes block ranking on every page. They must be done first. Total estimated time: 4-6 hours.

### P0-1 — Remove duplicate canonical from static HTML template
**Where**: Manus editor → `index.html` template or base layout
**Change**: Delete the `<link rel="canonical" href="https://www.aiiaco.com/">` line from static template. Leave only the React-injected canonical.
**Verification**: `curl -A "Googlebot/2.1" https://aiiaco.com/ai-integration | grep canonical` should show only ONE canonical tag pointing to `/ai-integration`
**Impact**: Restores canonical integrity site-wide. Every page can accumulate its own ranking signals again.

### P0-2 — Add fallback title tag to static HTML template
**Where**: Manus editor → base HTML template head
**Change**: Add `<title>AiiAco | AI Integration Authority</title>` before React mounts. React will override per-page.
**Verification**: `curl -A "Googlebot/2.1" https://aiiaco.com/ | grep -o "<title>.*</title>"` should return the title
**Impact**: Google receives actual title tags instead of auto-generating from headings.

### P0-3 — Enable HTTPS redirect in Cloudflare
**Where**: Cloudflare Dashboard → aiiaco.com → SSL/TLS → Edge Certificates → "Always Use HTTPS" toggle ON
**Alternative**: Rules → Redirect Rules → Create: "If hostname equals aiiaco.com AND scheme equals http" → "Static redirect to https://aiiaco.com/{URL path} 301"
**Verification**: `curl -I http://aiiaco.com/` should return `HTTP/2 301` with `Location: https://aiiaco.com/`
**Impact**: Eliminates HTTP duplicate content across entire site.
**Note**: Currently blocked — aiiaco.com is NOT in our Cloudflare yet. This requires either (a) adding it to our CF and Nemr updating nameservers at Namecheap, or (b) Nemr configuring it in his CF if he has one.

### P0-4 — Remove duplicate meta description from static HTML template
**Where**: Same as P0-1, same file
**Change**: Delete the `<meta name="description" ...>` line from static template. Leave only React-injected.
**Verification**: Grep for only ONE meta description tag per page
**Impact**: Unified meta description messaging, removes brand name inconsistency ("AiiAco" vs "AiiA")

### P0-5 — Fix Framer Motion hero animations
**Where**: Manus editor → page components for homepage and all landing pages
**Change**: On HERO section ONLY, change Framer Motion `initial={{ opacity: 0, y: 24 }}` to `initial={{ opacity: 1, y: 0 }}`. Keep below-fold scroll animations unchanged.
**Verification**: Test Live URL in GSC → Screenshot should show full hero content (H1, subheading, CTAs)
**Impact**: LCP element becomes visible immediately. Screenshot-based signals see proper hero.

---

## P1 — THIS WEEK (High impact, moderate effort)

### P1-1 — Delete 2 broken + 5 off-brand industry pages
Delete via Manus editor:
1. `/industries/high-risk-merchant-services` (broken SPA shell + off-brand)
2. `/industries/helium-specialty-gas` (off-brand programmatic SEO spam)
3. `/industries/biofuel-sustainable-fuels` (off-brand)
4. `/industries/cosmetics-personal-care` (off-brand, low ICP fit)
5. `/industries/beauty-health-wellness` (off-brand SMB)

Then in Cloudflare/Manus, add 301 redirects from each to `/industries`.

**Impact**: Removes thin content signals, recovers topical authority for core industries.

### P1-2 — Fix /industries/financial-services broken route
Rebuild page as a PILLAR linking to:
- /industries/investment-wealth-management
- /industries/insurance
- /industries/mortgage-lending
Target: 2,000+ words, includes regulations (SEC, FINRA, GLBA), platforms (Salesforce Financial Services Cloud, Envestnet, Orion, Addepar), role-specific language.

### P1-3 — Add Nemr Hallak founder presence
**Option A (fast)**: Add founder bio block to `/manifesto` with Nemr's name, photo, title ("Founder & CEO"), short bio, LinkedIn link
**Option B (better)**: Create new `/about` page with full bio, credentials, speaking/podcast history
Also add Nemr's name to homepage hero or About section.

### P1-4 — Add Person schema for Nemr Hallak
Deploy this JSON-LD sitewide (in Manus layout or head):
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://aiiaco.com/#nemr-hallak",
  "name": "Nemr Hallak",
  "jobTitle": "Founder and CEO",
  "worksFor": {"@id": "https://aiiaco.com/#organization"},
  "url": "https://nemrhallak.com",
  "sameAs": [
    "https://www.linkedin.com/in/nemrhallak",
    "https://nemrhallak.com"
  ]
}
```
Then add `"founder": {"@id": "https://aiiaco.com/#nemr-hallak"}` to Organization schema.

### P1-5 — Add FAQPage schema to /ai-integration and /ai-automation-for-business
Both pages already have FAQ sections. Wrap the Q&A pairs in FAQPage JSON-LD. Takes 30 min per page.
**Impact**: Immediate eligibility for Google AI Overview direct citation + Perplexity citation.

### P1-6 — Add sameAs array to Organization schema
Add to existing Organization JSON-LD:
```json
"sameAs": [
  "https://www.linkedin.com/company/aiiaco",
  "https://www.wikidata.org/wiki/Q138638897"
]
```
**Impact**: Closes entity loop for Google Knowledge Graph. Critical for Knowledge Panel appearance.

### P1-7 — Fix founding date discrepancy
Sitewide schema says "2024". Wikidata says "2025". Pick one (recommend 2025 since that matches Wikidata which is harder to change) and update Organization schema on all pages.

### P1-8 — Add HowTo schema to /method
4-phase framework (Find, Implement, Measure, Expand) is perfect HowTo content. Wrap it:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How AiiAco Deploys AI Integration: The 4-Phase Method",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "Find the Friction", "text": "..."},
    {"@type": "HowToStep", "position": 2, "name": "Implement the Fix", "text": "..."},
    {"@type": "HowToStep", "position": 3, "name": "Measure the Improvement", "text": "..."},
    {"@type": "HowToStep", "position": 4, "name": "Expand What Works", "text": "..."}
  ]
}
```

### P1-9 — Add security headers in Cloudflare
Cloudflare → Rules → Transform Rules → Response Headers. Add:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### P1-10 — Expand /industries hub to show all KEEP pages
Currently only 4 industry pages are linked. Expand to all 11 KEEP pages grouped by sector:
- Real Estate (real-estate-brokerage, commercial-real-estate)
- Finance (financial-services, mortgage-lending, investment-wealth-management, insurance)
- Professional Services (management-consulting, agency-operations)
- Technology (software-technology, software-engineering)
- Lifestyle & Hospitality (luxury-lifestyle-hospitality)

---

## P2 — WEEKS 2-3 (Content Build)

### P2-1 — Merge commodity industry pages into /industries/energy pillar
Create single 2,500-word pillar at `/industries/energy` absorbing:
- oil-gas
- alternative-energy
- solar-renewable-energy
- biofuel-sustainable-fuels (if not already deleted per P1-1)

Each becomes H2 section within the pillar.

### P2-2 — Merge battery-ev-technology into automotive-ev
Single page at `/industries/automotive-ev`, battery section as H2.

### P2-3 — Merge software-consulting into software-technology
Single page at `/industries/software-technology`, consulting services as subsection.

### P2-4 — Expand 5 priority 1 industry pages to 2,000 words each
Per-page content additions:

**real-estate-brokerage**:
- Named platforms: Follow Up Boss, kvCORE, BoomTown, Chime, Compass, dotloop, SkySlope, Lofty, BoldTrail
- Regulations: Fair Housing Act, NAR compliance, MLS IDX data rules
- Role workflows: listing agent vs buyer agent vs TC
- Full case study (composite): brokerage with agent count, GCI, before/after
- FAQ (8-10 Qs): "Does AI replace agents?", "How does AI qualify real estate leads?", "Can AI write MLS descriptions?", "Is AI listing content legal under NAR rules?", "How does AI integrate with kvCORE?"
- Schema: Service + FAQPage + BreadcrumbList

**mortgage-lending**:
- Regulations: TRID, RESPA, ECOA, HMDA, QM/ATR, URLA 1003, SAFE Act
- Platforms: Encompass, Calyx Point, LendingPad, Blend, ICE Mortgage Technology, Optimal Blue, Fannie Mae DU, Freddie Mac LP
- Document types: W-2, 1099, 4506-T, VOE, VOD, AUS findings
- Role workflow: LO → processor → underwriter → closer
- Expanded case study
- FAQ: "How does AI reduce clear-to-close time?", "Is AI document extraction RESPA-compliant?", "Can AI underwrite a mortgage?"

**commercial-real-estate**:
- Platforms: Yardi, MRI, VTS, CoStar, ARGUS Enterprise, AppFolio, RentCafe, Entrata
- Terminology: TI/LC, CAM reconciliation, NNN, estoppels, SNDAs, rent rolls, cap rate
- Roles: asset manager, property manager, leasing director
- New case study
- FAQ: "How does AI help commercial property managers?", "Can AI read commercial leases?"

**luxury-lifestyle-hospitality**:
- Platforms: Opera PMS, Amadeus, Sabre, SevenRooms, Revinate, Cendyn
- Standards: Forbes Travel Guide, Leading Hotels of the World
- Guest segmentation: loyalty tiers, VIP flagging
- Case study (named property type)
- FAQ: "Does AI break the luxury service standard?", "How does AI personalize guest experiences at scale?"

**management-consulting**:
- Metrics: utilization, realization, bill rate, leverage ratio
- Platforms: Kantata, BigTime, Replicon, Workday PSA
- Deliverable types: SOW, MSA, steerco deck
- Case study (named firm size)
- FAQ: "How does AI help management consulting firms?", "Can AI draft a client deliverable?"

### P2-5 — Build 6 service pages (Nemr's request)

**/ai-integration** (exists, polish as PILLAR)
- Target: 2,500-3,000 words
- Keep existing content, add: direct-answer 100-word intro, FAQ section with schema, Service schema
- Links TO: all 5 spoke service pages, /industries hub, /method, /results

**/ai-crm-integration** (NEW)
- Target keyword: "AI CRM integration", "how to integrate AI into a CRM"
- Word count: 2,000
- AEO opening: "AI CRM integration embeds artificial intelligence directly into customer relationship management systems..."
- How-to section (step framework)
- Named CRMs: Salesforce, HubSpot, Pipedrive, GoHighLevel, Zoho, Follow Up Boss
- FAQ with FAQPage schema

**/ai-workflow-automation** (NEW)
- Target keyword: "AI workflow automation"
- Word count: 2,000
- AEO opening: "AI workflow automation uses machine learning to orchestrate business processes..."
- Process framework tied to /method
- Named platforms: n8n, Make, Zapier, Workato, Tines (note: position AiiAco as BUILDER, not these tools)

**/ai-revenue-engine** (NEW — highest value)
- Target keyword: **"AI revenue systems"** (zero competition per competitor research)
- Word count: 2,500 (go deep, own the term)
- AEO opening: "An AI revenue system is an integrated set of AI-powered workflows..."
- Defines the category term
- Includes Person schema reference to Nemr
- Case studies with revenue metrics

**/ai-for-real-estate** (NEW — industry #1)
- Target keyword: "AI for real estate brokerages"
- Word count: 2,500
- Links to: /industries/real-estate-brokerage (deeper), /ai-crm-integration, /ai-revenue-engine
- Named tools/platforms
- Case study

**/ai-for-vacation-rentals** (NEW)
- Target keyword: "AI for vacation rental management"
- Word count: 2,000
- Position AiiAco as INTEGRATOR (not vendor like Hostaway, Jurny, Hospitable)
- Link to /industries/luxury-lifestyle-hospitality

### P2-6 — Add horizontal interlinking to all industry pages
Each industry page gets a "Related industries" section with 3-5 contextual links. Examples:
- real-estate-brokerage → commercial-real-estate, mortgage-lending, luxury-lifestyle-hospitality
- mortgage-lending → real-estate-brokerage, financial-services, insurance
- financial-services → investment-wealth-management, insurance, mortgage-lending

### P2-7 — Add BreadcrumbList schema to all industry + service pages
Template per industry page:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aiiaco.com"},
    {"@type": "ListItem", "position": 2, "name": "Industries", "item": "https://aiiaco.com/industries"},
    {"@type": "ListItem", "position": 3, "name": "[Industry]", "item": "https://aiiaco.com/industries/[slug]"}
  ]
}
```

---

## P3 — WEEK 3+ (Blog + Long-term)

### P3-1 — Launch blog.aiiaco.com
- Vercel deployment (Astro or Next.js static)
- Custom domain CNAME to Vercel
- Design to match AiiAco dark/premium brand
- RSS feed
- Blog schema per post

### P3-2 — Onboard blog via blog-onboard skill
Run `/blog onboard` with:
- Industry: AI integration services
- Location: US
- Keyword database from competitor audit
- Pillar topics: AI integration, AI revenue systems, industry-specific verticals

### P3-3 — Publish first 4 launch posts
1. **"What is an AI revenue system?"** — Definitional pillar claiming the category term (zero competition)
2. **"How to reactivate a dormant customer database with AI"** — Quick-win tutorial (thin SERPs)
3. **"How AI automates operations for real estate brokerages"** — Vertical-specific (gap)
4. **"How to integrate AI into a real estate CRM"** — CRM vertical (Pipedrive owns generic version)

All 4 formatted for AEO:
- Direct answer in first 60 words
- FAQPage schema at bottom
- Quantified data points
- Named entities
- Scannable H2/H3 structure

### P3-4 — Ongoing content
- 2 blog posts per week after launch
- Monthly performance reports via `/report` skill
- Quarterly content audit via `/blog audit`

### P3-5 — Off-site / PR
- Inman guest post pitch (Nemr bylined)
- HousingWire guest column
- Podcast outreach: Inman Access, Real Estate Rockstars, Brian Buffini, VRMA podcasts
- LinkedIn content ramp: 2-3 founder posts per week

### P3-6 — YouTube presence
First video: "What is AI Integration for Business?" (5-7 min explainer)
- Even low-production video generates measurable AI citation signal (0.737 correlation)
- Embed on homepage + /ai-integration
- Channel art matches AiiAco brand

### P3-7 — Domain portfolio consolidation
Nemr owns ~100 domains. After audit:
- Identify which have existing backlinks/authority (check via free tools)
- Domains with authority → 301 redirect to relevant aiiaco.com pages
- Weak domains → park or drop
- 2-3 high-value domains → consider as legitimate standalone content hubs
- NEVER create thin PBN sites

---

## Verification Checklist (post-P0 fixes)

- [ ] `curl -A "Googlebot/2.1" https://aiiaco.com/ai-integration | grep canonical` returns exactly 1 canonical tag pointing to `/ai-integration`
- [ ] `curl -A "Googlebot/2.1" https://aiiaco.com/ | grep -c "<title>"` returns 1
- [ ] `curl -I http://aiiaco.com/` returns `HTTP/2 301`
- [ ] `curl -A "Googlebot/2.1" https://aiiaco.com/ | grep -c 'name="description"'` returns 1
- [ ] GSC Test Live URL screenshot shows full hero content (not faded)
- [ ] `curl -s https://aiiaco.com/industries/financial-services | grep -c "financial services"` > 5 (real content, not SPA shell)

## Verification Checklist (post-P1 fixes)

- [ ] Nemr Hallak name appears on homepage or /manifesto
- [ ] Person schema validates in Google Rich Results Test
- [ ] FAQPage schema on /ai-integration validates
- [ ] HowTo schema on /method validates
- [ ] Organization schema has sameAs array
- [ ] `/industries` hub shows all 11 KEEP pages
- [ ] All security headers present in CF response
