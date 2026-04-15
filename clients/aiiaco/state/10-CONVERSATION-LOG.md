# AiiAco — Conversation Log (Key Decisions)

Paraphrased summary of significant user-to-Claude exchanges that established current decisions and preferences. Read this to understand WHY we made the choices we did.

---

## Opening: engagement kickoff

**Context**: Milan received aiiaco.com as a new client. Wanted full SEO audit and remediation plus blog infrastructure on blog.aiiaco.com subdomain.

**Milan's initial ask** (paraphrased):
> I have a new client, aiiaco.com. Want you to do serious SEO analysis and fix on the site. Tell me what access we need and compose a message for him. Check where the site is hosted, can it deploy to GitHub, can we work directly from here. Also start blog.aiiaco.com subdomain we'll host on our GitHub and manage for him.

**Claude's investigation**:
- Scraped aiiaco.com via Firecrawl
- Discovered Manus AI as the builder (via `__manus_*` runtime markers in HTML)
- DNS dig: Namecheap nameservers, Cloudflare IPs (proxy via Manus)
- Determined site is Vite/React SPA

**Decision locked**: Not a standard host. Can't just push to GitHub. Would need to either rebuild on Next.js OR work with Manus's constraints.

---

## Access requirements doc

**Context**: Created `AiiAco — SEO Engagement: Access Requirements` Google Doc for Nemr. Originally had 10 items including Namecheap access.

**Milan's correction**:
> Namecheap isn't needed if we can just give Nemr the CNAME value from Vercel. Less invasive.

**Decision**: Dropped Namecheap from access list. Simplified to what we actually need.

**Milan's style request**:
> Sastavi mi tu poruku. Ne tabele, nego kao Google document. Uredi i stilizuj sa sve naslovima i svime sto je lepo i dobro.
> (Compose it as a Google doc with proper styling, headings, not tables.)

**Action**: Created formatted Google Doc with MonteKristo branding applied (Poppins headings, Inter body, navy headings, coral only on email address).

---

## Nemr's response

**Context**: Nemr filled in the doc with all access grants plus his positioning brief.

**Nemr's brief** (verbatim, captured in `state/02-BUSINESS-CONTEXT.md`):
> Positioning (non-negotiable):
> We are an AI infrastructure company.
> We are not an AI tools, chatbot, or marketing automation agency.
> [... full brief ...]

**Decision locked**: Nemr wants to own "AI infrastructure" keyword. This looked reasonable at first. Competitor audit later proved it's unwinnable.

---

## Discovery: Manus dynamic rendering

**Context**: Content quality agent crashed trying to read the page. Investigated.

**Milan's concern**:
> Manus AI je SPA, znaci Google ne vidi sadrzaj, ni onda da se ne rankira na sajtu?
> (Manus AI is a SPA, so Google doesn't see content, or it won't rank?)

**Claude's investigation**:
- Tested 11 bot user-agents via curl
- Found that Manus serves pre-rendered HTML to Googlebot, GPTBot, ClaudeBot, PerplexityBot, etc.
- Only Claude-Web (deprecated UA) gets SPA shell
- **Conclusion**: Manus already handles dynamic rendering. We don't need to build a Cloudflare Worker.

**Decision locked**: No Cloudflare Worker. Work WITH Manus, not around it.

---

## Discovery: GitHub mirror

**Context**: Milan showed a screenshot of Manus UI with "GitHub" panel containing clone URL `github.com/10452/aiiaco.git`.

**Milan's question**:
> Jel ima nesto od ovoga smisla? [sharing Download as ZIP / Version history / View docs options]
> (Does this make sense?)

**Claude's decision**: Download the ZIP. Gives us full source code access without needing GitHub push.

**Outcome**: Source extracted to `clients/aiiaco/aiiaco/`. Confirmed Vite/React SPA with custom prerender script. Node modules installed locally for TypeScript checking.

---

## Strategic pivot: "AI infrastructure" abandoned

**Context**: Running competitor audit via general-purpose agent.

**Competitor audit finding** (paraphrased):
> "AI infrastructure" keyword is owned by IBM, CoreWeave, Nebius, HPE, Intel, Snowflake, AWS. Google AI Overview defines it as GPU/hardware infrastructure, not software integration. Unwinnable for a boutique consultancy.

**Recommendation**: Pivot to "AI integration company" (medium difficulty, claimable) and "AI revenue systems" (zero competition, definitional whitespace).

**Decision locked**: Abandon "AI infrastructure" as keyword target. Create `/ai-revenue-engine` page instead of `/ai-infrastructure`. Present pivot to Nemr after Round 2 ships.

---

## Off-brand industries removal

**Context**: Industry pages audit agent reported 25 pages, several clearly off-brand.

**Claude's recommendation**: Remove 5 off-brand industries:
- high-risk-merchant-services (chargebacks/adult/CBD)
- helium-specialty-gas (programmatic spam)
- biofuel-sustainable-fuels (commodity shell)
- cosmetics-personal-care (off-brand)
- beauty-health-wellness (SMB wellness)

**Milan's implicit approval**: Accepted recommendation. Industries removed from `data/industries.ts`, from sitemap.xml, from prerender.mjs ROUTES.

---

## Round 2: Ultra-thorough execution request

**Context**: After Round 1 shipped, Milan asked for deeper work.

**Milan's verbatim request**:
> Hoću da kreneš da radiš na tome i da unaprediš apsolutno sve što možeš ti da unaprediš u ovom trenutku preko ovog koda koji imas. Hoću da sve što radiš da proveravaš detaljno i da radiš sa što manje grešaka. Moraš da imaš u svakom trenutku kritičara koji ide za tobom i traži greške koje si napravio. Kritičar mora da bude strog i da mu je cilj da najde što više grešaka
> (Work on improving absolutely everything you can in this code right now. Check everything thoroughly and work with as few mistakes as possible. You must have a critic going behind you at every moment looking for mistakes. The critic must be strict and aim to find as many errors as possible.)

**Decision locked**: Round 2 execution pattern:
1. Implement changes
2. Run TypeScript check
3. Spawn fresh adversarial critic agent with "minimum 10 findings" quota
4. Fix critical + high findings
5. Repeat until clean
6. Move to next phase

**Result**: 3 critic passes (A, B+C, F) finding 67 total bugs. All critical + high resolved before declaring Round 2 done.

---

## Em-dash rule (locked in by Milan earlier)

**Context**: During an earlier engagement, Milan saved the em-dash rule to memory.

**Rule**: Never use em-dashes in docs, PDFs, reports, or any deliverable. Use hyphens, commas, or rewrite.

**Saved in**: `~/.claude/projects/.../memory/feedback_no_mdashes.md`

**Enforcement in Round 2**:
- Phase F critic caught 111 em-dashes across 20 Round 2 files
- Python batch script removed all 111
- Verified 0 em-dashes in Round 2 scope
- Round 3 cleanup pass will catch the remaining ~29 in untouched components

---

## Brand casing rule

**Context**: Brand name has two valid spellings depending on context.

**Rule**:
- **Marketing copy**: `AiiAco` (camelcase)
- **Schema `@name` fields**: `AiiACo` (camelcase K) - matches Wikidata label Q138638897
- **Never**: `AiiA` (was in Round 1 Home.tsx title, removed)

**Enforcement in Round 2**:
- Phase F critic caught 131 `AiiACo` in marketing copy
- Python batch script replaced them with `AiiAco`
- Preserved exactly 3 `AiiACo` in `index.html` schema `@name` fields (Organization, WebSite, ProfessionalService)
- Round 3 will catch the remaining 242 in untouched components

---

## Plan mode activation and approval

**Context**: Before starting Round 2 big work, Milan asked to enter plan mode.

**Flow**:
1. Claude investigated codebase via Explore agents
2. Wrote detailed plan to `~/.claude/plans/rippling-squishing-lighthouse.md`
3. Called ExitPlanMode for approval
4. Milan approved without modification

**Key plan elements**:
- Phase A: Critic Round 1 review before any new work
- Phase B: Public assets (robots/sitemap/llms/about)
- Phase C: Component enhancements (NotFound, SEO, NoindexRoute, IndustryMicrosite, Home, StructuredData dispatcher)
- Phase D: Industry data expansion
- Phase E: 5 new service pages
- Phase F: Final overall critic sweep

---

## Session persistence request

**Context**: Approaching context limit, Milan asked to save state.

**Milan's verbatim request (first attempt)**:
> Hocu da ga mnogo mnogo detaljnije sacuvas, mora to da bude ultra detaljno, kako bi znao jako kvalitetno kako da nastavis
> (I want you to save it much more in detail. It must be ultra detailed so you know quality-wise how to continue.)

**Milan's verbatim request (expanded)**:
> mora jos mnogo detaljnije sve da se sacuva
> (Everything must be saved in much more detail.)

**Action**: Created `clients/aiiaco/state/` folder with 12 reference files covering every aspect of the engagement.

---

## User preferences we learned

### 1. Serbian-mixed communication
Milan often writes in Serbian/English mix. Claude responds in whichever language Milan used last, or Serbian if Milan's request was in Serbian.

### 2. Deliverable preferences
- PDF reports via `/report` skill preferred over Google Docs for client-facing deliverables
- MonteKristo branding applied automatically to all PDFs (coral accent, dark navy headings, Poppins + Inter)
- **Rule**: "Any Google Doc or PDF we create gets MonteKristo branding applied IMMEDIATELY upon creation, not as an afterthought"

### 3. Communication approval
- **RULE**: Never send outbound emails/messages via MCP without explicit user approval
- Always show draft first, wait for "send it"
- Saved in memory as `feedback_no_outbound_without_approval.md`

### 4. Content quality
- Zero AI tells in any public content
- Banned phrases: "delve", "tapestry", "in the realm of", "it's important to note", "moreover", "furthermore" (without purpose)
- Banned character: em-dash (`—`)
- Anti-AI Content Mandate is "Rule #1"

### 5. Working style
- Expects Claude to be thorough, use critics, verify work
- Prefers multi-agent parallelization for research tasks
- Wants structured plans before execution
- Appreciates when Claude catches its own mistakes (critic loop)

### 6. Strategic thinking
- Wants business justification, not just "yes boss" compliance
- Accepts strategic pivots when evidence is strong (e.g., abandoning "AI infrastructure" keyword)
- Values domain expertise over generic AI-speak

---

## Key quotes from Milan (for tone reference)

- "Hoću da kreneš da radiš na tome i da unaprediš apsolutno sve što možeš ti da unaprediš"
- "Moraš da imaš u svakom trenutku kritičara koji ide za tobom"
- "Kritičar mora da bude strog"
- "Hocu da ga mnogo mnogo detaljnije sacuvas"
- "koristi i agenta i uradi ultra vrhunsko istrazivanje"
- "sa sto manje gresaka"

Pattern: direct, demanding quality, expects thoroughness, comfortable with hostile self-review.

---

## Nemr's tone (from his messages)

Nemr's responses were brief and business-focused:
- "Yes I did it myself with manus AI. I'll do everything here in the next day or so."
- "I already setup all the pages you mention so it is already done just needs the regular upkeep/blogs/etc."
- "Also just fyi I have around 100 domain names, some point to aiiaco and I had planned on creating case study sites..."

Pattern: practical, action-oriented, thinks in systems, experimental (100 domains), open to collaboration but needs clean handoffs.

---

## Key decisions to re-surface with Nemr

When next presenting to Nemr, Claude should explicitly mention:

1. **Strategic pivot on "AI infrastructure"** - we replaced it with `/ai-revenue-engine`. He asked for 6 pages; we shipped 5 of his 6 plus the pivot page. Explain why (IBM/hyperscalers own that keyword).

2. **Off-brand industries removed** - we deleted 5 industries (high-risk-merchant-services, beauty-health-wellness, cosmetics-personal-care, helium-specialty-gas, biofuel-sustainable-fuels). Give him the reasoning if he notices.

3. **Round 2 sync blocker** - we need GitHub push access to `10452/aiiaco` or ZIP upload path. He should pick the method.

4. **Plausible Analytics** - he said he created account but didn't install token. Remind him to install or let us do it.

5. **Domain portfolio** - we need the list of his ~100 domains before we can recommend a strategy.

6. **X/Twitter account** - he said he'd create one. Follow up.

7. **Founder bio visibility** - Person schema added but he's still not visible ON the site. Round 3 should add a founder bio block to /manifesto or /about. Need his photo and bio copy.
