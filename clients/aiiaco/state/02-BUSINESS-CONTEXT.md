# AiiAco — Business Context

## Client identity

**Legal entity**: AiiAco (privately held enterprise AI integration firm)
**Domain**: `https://aiiaco.com`
**Wikidata entity**: [Q138638897](https://www.wikidata.org/wiki/Q138638897) (label "AiiACo", inception 2025)
**Category**: Professional services, enterprise AI consulting
**Tagline**: "AI Integration Authority for the Corporate Age"
**Founded**: 2025 (matches Wikidata — site previously said 2024, critic pass A caught this)

## People

### Nemr Hallak — Founder and CEO
- Title: Founder and CEO / AI Systems Architect
- Primary email: `nemr@aiiaco.com`
- Legacy email: `nemr@volentixlabs.com` (previous Web3 project, still receives mail)
- LinkedIn: `https://www.linkedin.com/in/nemrhallak`
- Personal site: `https://nemrhallak.com` (also Manus AI-built)
- Phone: `+1 888 808 0001 x3`
- Previous work: Volentix Labs (Web3), Digital Experience Monitoring consulting

### Marylou — Admin assistant
- Company email: `go@aiiaco.com`
- Creates workspace accounts and manages onboarding for external collaborators
- Created our `alex@aiiaco.com` Google Workspace account on 2026-03-18

## Our side (MonteKristo AI)

- Primary consultancy email: `contact@montekristobelgrade.com`
- Workspace account on aiiaco.com domain: `alex@aiiaco.com`
- Operator: Milan Mandic

## Nemr's original brief (verbatim from his filled-in Google Doc)

Nemr filled in the access requirements doc (`https://docs.google.com/document/d/1ONrb3CPoDLebYihuVAP4YE50FOt0rS0Zo6mrbYcdsow`) with this positioning statement:

> Positioning (non-negotiable):
> We are an AI infrastructure company.
> We are not an AI tools, chatbot, or marketing automation agency.
>
> Primary focus:
> AI systems embedded into revenue and operational workflows.
>
> Core keywords to build around:
> AI infrastructure
> AI systems for business
> AI CRM integration
> AI workflow automation
> AI revenue systems
> AI integration company
> enterprise AI integration
>
> Target industries:
> Real estate
> Vacation rental operators
> Property management
> Hospitality
> Service businesses with field teams
>
> Core service pages:
> /ai-infrastructure
> /ai-crm-integration
> /ai-workflow-automation
> /ai-revenue-engine
> /ai-for-real-estate
> /ai-for-vacation-rentals
>
> Content strategy (AEO):
> We want direct-answer pages, no fluff.
>
> Examples:
> What is AI infrastructure for business
> How to integrate AI into a CRM
> How AI automates operations
> How to reactivate a customer database
> What is an AI revenue system
>
> Important:
> We are not targeting "AI tools" or "chatbot services."
> We want to own AI infrastructure and AI systems positioning.
>
> Let me know how you would structure the pillar page and internal linking around this.

## Strategic pivot we made (not yet reviewed by Nemr)

### What Nemr asked for
- `/ai-infrastructure` as a core service page
- Ranking for "AI infrastructure" keyword
- Positioning as "AI infrastructure company"

### What competitive intel showed
Per Phase 1 competitor research (see `clients/aiiaco/audit/MASTER-AUDIT-REPORT.md` section on keyword intelligence):

- "AI infrastructure" Google SERP is owned by compute/cloud hyperscalers: **IBM, CoreWeave, Nebius, HPE, Intel, Snowflake, AWS, Supermicro**
- Google AI Overview for "AI infrastructure" defines it as "hardware, GPUs, TPUs, HPC, networking" — hardware infrastructure, not software integration
- No boutique AI consultancy ranks for this term — the SERP is locked behind hyperscaler documentation authority
- Estimated difficulty: Very High
- Realistic ranking potential for AiiAco: None

### What we did
- ABANDONED "AI infrastructure" as a keyword target
- Created `/ai-revenue-engine` instead, targeting "**AI revenue systems**" — a zero-competition definitional whitespace
- Competitor research confirmed no existing ranker owns "AI revenue system" as a definitional term (scattered RevOps blog posts, nothing authoritative)
- Kept "AI integration company" and "enterprise AI integration" as claimable targets
- Strengthened `/ai-integration` page as the pillar for these terms

### When we talk to Nemr about this
Frame it as: "You asked for /ai-infrastructure but the keyword is dead — IBM and CoreWeave own it. We built /ai-revenue-engine instead targeting 'AI revenue systems' which nobody else owns. Stronger claim, easier ranking."

He is likely to accept. The business logic is clean. But if he pushes back, we can add `/ai-infrastructure` as a secondary landing page and keep the primary claim on `/ai-revenue-engine`.

## Locked strategic decisions (DO NOT REVERSE without explicit user instruction)

### Decision 1: "AI infrastructure" keyword ABANDONED
- Reason: Unwinnable vs hyperscaler authority
- Alternative: `/ai-revenue-engine` targets "AI revenue systems" (zero competition)
- Evidence: Competitor audit Section 3.6

### Decision 2: Brand casing rule
- Schema `@name` fields: `AiiACo` (camelcase K)
- Everywhere else: `AiiAco`
- Reason: Schema casing is locked in index.html JSON-LD and matches Wikidata label. Marketing copy uses natural casing.
- Enforcement: Phase F critic pass replaced 131 marketing-copy "AiiACo" to "AiiAco", preserved 3 instances in index.html schema name fields

### Decision 3: Founding date 2025
- Source: Wikidata Q138638897 inception date
- Previous inconsistent values: site said 2024, StructuredData.tsx said 2026
- Fixed everywhere

### Decision 4: Em-dash ban
- Rule source: `~/.claude/projects/.../memory/feedback_no_mdashes.md`
- Applies to: every deliverable (website copy, PDFs, reports, docs, public asset files, JSON-LD)
- Replacement: hyphens with spaces (` - `), commas, or rewrite
- Phase F cleanup removed 111 em-dashes across 20 Round 2 files
- Known remaining em-dashes: ~29 in untouched components (Round 3 task)

### Decision 5: Integrator positioning
- AiiAco is an **INTEGRATOR** layer, not a product vendor
- Vacation rental page explicitly positions against Hospitable/Jurny/Hostaway as a vendor: "AiiAco is the integration layer that ties those platforms together"
- Property management page positioned against EliseAI
- Mortgage page positioned to avoid Better.com/Ocrolus direct competition — targets SMB broker segment
- Real estate page highlights building on top of Follow Up Boss, kvCORE, BoomTown, Lofty

### Decision 6: No Cloudflare Worker
- We explored deploying a CF Worker for pre-rendering
- Testing with 11 bot user-agents confirmed Manus already serves pre-rendered HTML to Googlebot, Bingbot, Applebot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Perplexity-User, Google-Extended
- Only "Claude-Web" (deprecated UA) gets the SPA shell
- Conclusion: Manus handles dynamic rendering at edge. No Worker needed.
- Cloudflare zone for aiiaco.com was created in our account then DELETED as unnecessary

### Decision 7: Off-brand industries removed
Removed permanently from `client/src/data/industries.ts`:
- `high-risk-merchant-services` - chargebacks/adult/CBD connotation, clashes with "Corporate Age" positioning
- `beauty-health-wellness` - SMB wellness, low AI budget, off-brand for enterprise
- `cosmetics-personal-care` - same
- `helium-specialty-gas` - programmatic SEO spam, zero ICP fit
- `biofuel-sustainable-fuels` - commodity shell, zero ICP fit

### Decision 8: StructuredDataSSR takes pathname prop
- Never use `useLocation()` inside it
- Client-side wrapper (StructuredData.tsx) normalizes pathname and passes to SSR version
- SSR entry (entry-server.tsx) passes `url` explicitly
- Phase A critic caught this — Round 1 version called useLocation outside Router and silently returned null path at SSR

### Decision 9: StructuredData renders INSIDE Router
- In App.tsx, `<StructuredData />` is rendered inside the `Router()` function component (before `<Switch>`)
- Phase F critic caught this — previously rendered as sibling of Router, causing hydration mismatch

### Decision 10: NotFound uses suppressCanonical
- NotFound has `noindex` + `suppressCanonical` props
- Reason: We cannot know the requested URL at render time, so hardcoding `/404` as canonical would create false canonical links
- Alternative would be to use `window.location.pathname` but that breaks SSR

### Decision 11: Framer Motion fix in prerender.mjs post-processor
- NOT in SSR wrapper (MotionConfig reducedMotion="always" is version-dependent and unreliable)
- Scoped per-style-attribute regex: only rewrites when BOTH `opacity:0` AND `transform:translate{X|Y}(...)` appear in the same style attribute
- Prevents breaking legitimate static layout transforms (badge centering, progress bars, hidden modals)

### Decision 12: GitHub repo inaccessible
- `github.com/10452/aiiaco.git` is private
- "10452" is a Manus-auto-generated GitHub username
- Our MonteKristoAI GitHub token cannot push
- Path forward: (a) Nemr re-connects GitHub in Manus to our account, or (b) ZIP upload through Manus UI, or (c) Manus chat agent applies diffs

## Target audience

### ICP (Ideal Customer Profile)
- Company size: $5M to $100M+ annual revenue
- Role: Executive, founder, department head
- Pain: Scaling operations but cannot add headcount proportionally
- Mindset: Operational thinker who sees AI as systems, not tools
- Industries: Real estate brokerages, mortgage lenders, commercial property managers, luxury hospitality operators, management consulting firms, financial services

### Target keywords (from competitor audit)

**Claimable (low to medium competition)**:
- AI integration company (medium)
- Enterprise AI integration (medium)
- AI revenue systems (**zero competition** - our #1 target)
- How to integrate AI into a CRM (low-medium)
- How AI automates operations (low, open)
- How to reactivate a customer database (very low, open)
- What is an AI revenue system (very low, open)
- AI for real estate brokerages (medium, fragmented)
- AI for vacation rental operators (medium, vendor-dominated)

**Abandoned (too hard)**:
- AI infrastructure (very high, hyperscaler-owned)
- AI workflow automation (high, tool-owned - Make, n8n, Zapier)

**Industry listicle SERPs (dominated by competitors)**:
- Top AI integration companies (RTS Labs, Addepto, Master of Code own listicles)

## Deliverables promised to Nemr

1. **Full SEO audit** - DONE (`clients/aiiaco/audit/MASTER-AUDIT-REPORT.md`)
2. **6 service pages Nemr requested** - 5 of 6 DONE in source (ai-crm-integration, ai-workflow-automation, ai-revenue-engine, ai-for-real-estate, ai-for-vacation-rentals). The 6th (`/ai-infrastructure`) was strategically replaced with `/ai-revenue-engine` — needs to be communicated to Nemr.
3. **blog.aiiaco.com subdomain with managed content** - NOT STARTED (Bucket C)
4. **Domain portfolio strategy** - NOT STARTED (Bucket D)
5. **Ongoing SEO management** - ongoing after Round 2 ships

## What Nemr has agreed to (via chat/doc)

- Full audit authority
- Editor access to Manus via alex@aiiaco.com
- GSC Full user, GA4 Editor, GBP Manager
- Brand assets via Google Drive folder
- Will create X/Twitter account (not done yet)
- Will run blog through blog.aiiaco.com (we host)

## What Nemr has NOT yet agreed to

- The strategic pivot from "AI infrastructure" to "AI revenue systems" (we need to present this)
- Performance-based engagement structure (model offering, no contracts yet)
- Off-site content calendar (Inman, HousingWire guest posts)
- YouTube channel creation
- Domain portfolio action plan

## Related Nemr projects

- `nemrhallak.com` - personal brand site, also Manus AI-built, should be optimized as supporting E-E-A-T for aiiaco.com (Round 4 task)
- Volentix Labs - previous Web3 project, NOT related to AiiAco work
- ~100 owned domains (Nemr mentioned in initial message) - Bucket D target
