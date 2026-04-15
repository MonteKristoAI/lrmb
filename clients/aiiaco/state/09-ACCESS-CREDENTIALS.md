# AiiAco — Access, Credentials, and References

Every service, credential, URL, and account reference used on this engagement.

---

## Our side (MonteKristo AI)

### Primary email
- **`contact@montekristobelgrade.com`** - main consultancy email, has GSC/GA4/GBP access

### Workspace account on AiiAco domain
- **`alex@aiiaco.com`** - Google Workspace account on aiiaco.com domain
- Created by Marylou (go@aiiaco.com) on 2026-03-18
- Purpose: Manus editor access + any future aiiaco.com admin tasks

### GitHub
- **Org**: `MonteKristoAI`
- **Token in .mcp.json**: `[REDACTED — see .mcp.json at MonteKristo AI project root]`
- **Access to 10452/aiiaco**: NONE (private Manus-auto-created repo)

### Cloudflare
- **Account**: `contact@montekristobelgrade.com`'s Account
- **Account ID**: `9ff5132f189939745601b8a00bcfb23b`
- **API token (in .mcp.json)**: `[REDACTED — see .mcp.json at MonteKristo AI project root]`
- **Zones in account**: luxeshutters.com.au, gummygurl.com (aiiaco.com is NOT in our CF — previously created then deleted as unnecessary)

---

## AiiAco services and access state

| Service | Status | Owner | Our access | Notes |
|---|---|---|---|---|
| Google Search Console (aiiaco.com) | ✅ Full user | Nemr | Yes, via contact@montekristobelgrade.com | Granted, can submit sitemap and request indexing |
| Google Analytics 4 (G-6XQ3T33HTF) | ✅ Editor | Nemr | Yes | Can view traffic, set up goals |
| Google Business Profile | ✅ Manager | Nemr | Yes | Pending verification if any |
| Google Workspace (aiiaco.com domain) | ⚠ Partial | Nemr | alex@aiiaco.com user | We have a user account, not admin |
| Manus project | ⚠ Editor via alex@aiiaco.com | Nemr | Can view/edit via Manus UI | No API access — can't automate |
| Manus GitHub repo (`github.com/10452/aiiaco.git`) | ❌ Private | Manus (auto-account) | None | Cannot push, cannot pull via our GitHub MCP |
| Namecheap DNS (aiiaco.com) | ❌ | Nemr | None | Not needed for current scope |
| Cloudflare (aiiaco.com - Nemr's) | ❌ | Nemr | None | Nemr said DONE in access doc but invite never arrived. Not needed for current scope. |
| Plausible Analytics | ⚠ Partial | Nemr | Nemr created account but hasn't installed token on site | Token not wired into code |
| LinkedIn Company Page (linkedin.com/company/aiiaco) | ❌ | Nemr | None | 16 followers currently |
| X/Twitter (@aiiaco) | ❌ | N/A | N/A | Account doesn't exist yet; Nemr said he'd create |
| Calendly (calendly.com/aiiaco) | ⚠ Unclear | Nemr | Nemr said "you have access" but unverified | Used in CTAs |
| Brand assets | ✅ | Nemr | Yes | Google Drive folder |

### Brand assets location
- **Google Drive folder**: `https://drive.google.com/drive/folders/1YASBMB1AiOh_gevnGz7qoTG7kgJ7AEOO?usp=drive_link`
- Contents: logo SVG/PNG, font files, brand guidelines (if any)
- **Main logo URL** (live on CloudFront): `https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia_logo_pure_gold_transparent_8063797a.png`
- **OG image** (live on CloudFront): `https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia-og-image-v3_1b0f8ae3.png`

---

## Key people

### Nemr Hallak (client principal)
- **Role**: Founder and CEO, AI Systems Architect
- **Primary email**: `nemr@aiiaco.com`
- **Legacy email**: `nemr@volentixlabs.com` (still receives mail)
- **LinkedIn**: `https://www.linkedin.com/in/nemrhallak`
- **Personal site**: `https://nemrhallak.com`
- **Phone**: `[REDACTED — see Milan's records]`
- **Calendly**: `https://calendly.com/aiiaco`
- **Timezone**: America/New_York

### Marylou (admin assistant)
- **Email**: `go@aiiaco.com`
- **Role**: Admin assistant, manages external collaborator workspace accounts
- **Contact when**: Need to provision a new aiiaco.com Google Workspace account or adjust permissions

### Milan Mandic (MonteKristo operator - you)
- **Email**: `contact@montekristobelgrade.com`
- **Company**: MonteKristo AI
- **Timezone**: Europe/Belgrade
- **Preference**: PDF reports over Google Docs for deliverables, no em-dashes anywhere, approval required before sending any outbound message

---

## Platform-specific URLs

### Live site
- `https://aiiaco.com` - primary domain
- `https://www.aiiaco.com` - www variant (previously used in canonical, now fixed to apex)

### Google properties
- GSC: `https://search.google.com/search-console/?resource_id=https://aiiaco.com`
- GA4: property ID `G-6XQ3T33HTF`
- GBP: `https://business.google.com/` (Nemr's account)

### Social
- LinkedIn company: `https://www.linkedin.com/company/aiiaco` (16 followers)
- Twitter: doesn't exist yet
- Facebook: none
- Instagram: none

### External references we assert in schemas
- `https://www.wikidata.org/wiki/Q138638897` (verified exists, label "AiiACo", inception 2025)
- `https://www.crunchbase.com/organization/aiiaco` (unverified but referenced in Organization sameAs)
- `https://www.linkedin.com/company/aiiaco` (verified)

### Manus platform
- `https://manus.im/app/FvSFBd374GXzqjgBtweNkq` (example project URL pattern)
- `https://manus.im/share/...` (share link pattern)

---

## Google Drive references

### Access requirements doc (Nemr filled in his brief here)
`https://docs.google.com/document/d/1ONrb3CPoDLebYihuVAP4YE50FOt0rS0Zo6mrbYcdsow`
Purpose: Original access grants document. Nemr wrote his positioning brief in the bottom half.

### Brand assets folder
`https://drive.google.com/drive/folders/1YASBMB1AiOh_gevnGz7qoTG7kgJ7AEOO`
Purpose: Logos, fonts, guidelines from Nemr.

---

## Email conventions

### When emailing Nemr
- To: `nemr@aiiaco.com`
- CC (optional): `go@aiiaco.com` (Marylou) if admin action needed
- From: `contact@montekristobelgrade.com`
- Rule (user preference): ALWAYS show draft to Milan before sending. Never auto-send outbound messages.

### Email signature to use
```
MonteKristo AI
https://montekristobelgrade.com
```

---

## API keys and tokens referenced (DO NOT commit to any git repo)

All live in `/Users/milanmandic/Desktop/MonteKristo AI/.mcp.json`:

- `FIRECRAWL_API_KEY`
- `GITHUB_PERSONAL_ACCESS_TOKEN`
- `CLOUDFLARE_API_TOKEN` (cfat_...)
- `AIRTABLE_API_KEY`
- `N8N_API_KEY`
- `GOOGLE_AI_API_KEY`
- `PERPLEXITY_API_KEY`
- `OPENAI_API_KEY`
- `RETELL_API_KEY`
- `SUPABASE_ACCESS_TOKEN` (multiple)
- `OBSIDIAN_API_KEY`

None of these should ever appear in AiiAco source code. Environment variables only.

---

## Manus-specific file locations (in project)

### Do NOT touch
- `.manus/` - Manus project metadata
- `client/public/__manus__/` - Manus runtime overlay
- `client/public/agent/` - Retell voice agent config
- `package.json` `vite-plugin-manus-runtime` dev dependency
- `vite-plugin-manus-runtime` imports in vite.config.ts or vite.ssr.config.ts

### Safe to edit (our Round 2 modifications live here)
- All of `client/src/`
- `client/index.html`
- `client/public/robots.txt`, `sitemap.xml`, `llms.txt`, `about.txt`
- `scripts/prerender.mjs`

---

## Analytics and tracking references

### Google Analytics 4
- Measurement ID: `G-6XQ3T33HTF`
- Hardcoded in `client/index.html` at top of head:
  ```html
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-6XQ3T33HTF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-6XQ3T33HTF');
  </script>
  ```

### Plausible Analytics
- Account exists but token NOT installed on site yet
- Would need to add `<script defer data-domain="aiiaco.com" src="https://plausible.io/js/script.js"></script>` to index.html
- Nemr said he'd install but hasn't

### Manus internal analytics (Umami)
- URL: `manus-analytics.com/umami`
- Blocked by robots.txt as editor artifact
- Not our concern

---

## Referenced platforms/competitors/tools in codebase

All the following names appear in our Round 2 content (pages, industries.ts, FAQ answers). Verify they are real and current before using in any new content:

### Real estate CRMs (all verified as of 2026)
- Follow Up Boss
- kvCORE (InsideRealEstate)
- BoomTown
- Lofty (formerly Chime) - renamed, acquired by Lone Wolf
- BoldTrail
- Compass
- dotloop
- SkySlope
- Salesforce Real Estate Cloud
- Zillow Premier Agent

### Mortgage lending platforms
- ICE Mortgage Technology Encompass
- Calyx Point
- LendingPad
- Blend
- Optimal Blue
- Fannie Mae Desktop Underwriter (DU)
- Freddie Mac Loan Product Advisor (LP)
- MortgageBot LOS
- Mortgage Cadence

### Commercial real estate / PM
- Yardi Voyager
- MRI Software
- VTS (leasing)
- CoStar
- ARGUS Enterprise
- AppFolio
- RentCafe
- Entrata
- Building Engines

### Consulting PSA
- Kantata (formerly Mavenlink)
- BigTime
- Replicon
- Workday Professional Services Automation
- Salesforce PSA
- Deltek Vantagepoint
- Microsoft Dynamics 365 Project Operations

### Luxury hospitality PMS
- Opera PMS (Oracle Hospitality)
- Amadeus Central Reservations
- Sabre SynXis
- SevenRooms
- Revinate
- Cendyn
- ALICE (hotel operations)
- Knowcross

### Vacation rental PMS
- Hostaway
- Guesty
- Hospitable
- Hostfully
- Jurny
- RentalReady
- Boom
- CiiRUS
- PriceLabs (dynamic pricing)
- Wheelhouse (dynamic pricing)
- Beyond Pricing (dynamic pricing)
- Airbnb, Vrbo, Booking.com (channels)

### Generic CRMs (ai-crm-integration page)
- Salesforce
- HubSpot
- Pipedrive
- GoHighLevel
- Zoho CRM
- Microsoft Dynamics 365
- Close
- Copper
- Keap
- ActiveCampaign
- Monday.com CRM

### Regulations we reference
- Fair Housing Act (FHA)
- NAR Code of Ethics
- MLS IDX data-use rules
- TILA-RESPA Integrated Disclosure (TRID)
- Real Estate Settlement Procedures Act (RESPA)
- Equal Credit Opportunity Act (ECOA)
- Home Mortgage Disclosure Act (HMDA)
- Qualified Mortgage / Ability-to-Repay (QM/ATR)
- Uniform Residential Loan Application (URLA 1003)
- SAFE Mortgage Licensing Act
- CAN-SPAM Act
- Telephone Consumer Protection Act (TCPA)
- Forbes Travel Guide standards
- Leading Hotels of the World standards
- AAA Five Diamond Award criteria
- PCI DSS
- GDPR
- CCPA
- Americans with Disabilities Act (ADA)
- OSHA workplace safety rules

### Competitors we reference or mention by name
- IBM (AI infrastructure category owner — we don't compete)
- CoreWeave, Nebius, HPE, Intel, Snowflake, AWS (same)
- RTS Labs (PRIMARY SEO competitor — listicle domination)
- Addepto (secondary)
- Master of Code (secondary)
- Sema4.ai (closest positioning match)
- Shakudo, Faye Digital (mentioned)
- Accenture AI, BCG X, McKinsey QuantumBlack (enterprise tier, not direct competitors)
- EliseAI (property management dominator — we position around them)
- Better.com, Ocrolus, TRUE (mortgage vendors — we target SMB segment around them)
- Hospitable, Jurny, Hostaway, RentalReady, Boom (vacation rental vendors — we're integrator layer)

---

## Key URLs reference (for linking in future content)

### Own domain
- `https://aiiaco.com` - homepage
- `https://aiiaco.com/ai-integration` - pillar page
- `https://aiiaco.com/ai-revenue-engine` - NEW whitespace claim
- `https://aiiaco.com/ai-crm-integration` - NEW
- `https://aiiaco.com/ai-workflow-automation` - NEW
- `https://aiiaco.com/ai-for-real-estate` - NEW
- `https://aiiaco.com/ai-for-vacation-rentals` - NEW
- `https://aiiaco.com/method` - 4-phase framework
- `https://aiiaco.com/industries` - hub
- `https://aiiaco.com/industries/real-estate-brokerage` etc - 20 microsite pages
- `https://aiiaco.com/upgrade` - conversion page
- `https://aiiaco.com/calendly.com/aiiaco` - booking

### Industry publications (guest post targets)
- Inman: `https://www.inman.com/`
- HousingWire: `https://www.housingwire.com/`
- RISMedia: `https://www.rismedia.com/`
- RealTrends: `https://www.housingwire.com/realtrends/`
- Mike DelPrete: `https://www.mikedp.com/`
- VRMA (vacation rental): `https://www.vrma.org/`
- Rental Scale-Up: `https://www.rentalscaleup.com/`

### Podcast targets
- Inman Access
- Real Estate Rockstars
- Tom Ferry Show
- Brian Buffini
- Get Paid For Your Pad (STR)

### Wikidata
- `https://www.wikidata.org/wiki/Q138638897` - AiiACo entity
