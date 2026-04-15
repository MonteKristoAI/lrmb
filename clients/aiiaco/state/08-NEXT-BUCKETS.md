# AiiAco — Next Session Buckets

7 buckets of work remaining, ordered by priority. Each bucket has exact steps, commands, and time estimates.

**Pick a bucket at the start of each session, complete it, update SESSION-STATE files, then pick the next.**

---

## Bucket A: Sync Round 2 to Manus (PRIORITY 1)

**Blocker status**: BLOCKS EVERYTHING. Round 2 code is local-only. Until it ships to aiiaco.com, none of our SEO work affects rankings.

**Time estimate**: 1-2 hours (mostly waiting on Nemr)

**Sub-steps**:

### A1. Verify Round 2 is still clean before shipping
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm run check
```
Expected: 0 errors.

### A2. Pick a sync path
- **Path 1 (preferred)**: Nemr re-connects GitHub in Manus settings and grants MonteKristoAI push access to `10452/aiiaco`
- **Path 2**: ZIP upload via Manus UI file interface
- **Path 3**: Manus chat agent applies diffs (costs Nemr credits)

### A3. Draft message to Nemr
Send via email (`contact@montekristobelgrade.com` → `nemr@aiiaco.com`):

```
Hey Nemr,

The SEO code sweep for aiiaco.com is ready. 5 new service pages, data expansion across all 20 industries, proper schema markup, and a refreshed 404 page.

Three ways we can get the code live on aiiaco.com:

1. GitHub sync (preferred)
In Manus > Settings > GitHub, reconnect the repo and add our GitHub user "MonteKristoAI" as a collaborator on 10452/aiiaco. Once we have push access we deploy immediately.

2. ZIP upload
If Manus has a file upload interface, I can send you a ZIP of the updated source and you upload it directly.

3. Manus chat
Worst case, you open the Manus project chat, paste our diff, and the Manus agent applies it (this will use some of your credits).

Which works best? Path 1 is cleanest and gives us ongoing push access for future updates.

Quick preview of what ships:
- 5 new service pages Nemr requested
- Industry data for 20 verticals (FAQ, regulations, platforms, roles for priority 5)
- Fixed duplicate meta tags, canonical issues, Framer Motion hero visibility
- Person schema added for you (was missing)
- Dark-themed 404 page matching brand
- Per-bot robots.txt with explicit AI crawler access rules

Full change summary available if you want: clients/aiiaco/audit/ROUND-2-CHANGES.md

All TypeScript clean (0 errors, verified). Ready to ship whenever you give the word.
```

**IMPORTANT**: Show the user this draft before sending. Ask for approval per the user's rule "always show drafts before sending."

### A4. If Path 1 (GitHub): get push access and deploy
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
git init  # if not already a git repo
git remote add manus https://github.com/10452/aiiaco.git
git add client/ scripts/
git commit -m "SEO Round 2: 5 new service pages, industry data expansion, schema markup, brand consistency, critic fixes"
git push manus main
```

### A5. If Path 2 (ZIP): create upload bundle
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"
zip -r aiiaco-round2-upload.zip \
  aiiaco/client/index.html \
  aiiaco/client/src/App.tsx \
  aiiaco/client/src/entry-server.tsx \
  aiiaco/client/src/seo/ \
  aiiaco/client/src/data/industries.ts \
  aiiaco/client/src/pages/Home.tsx \
  aiiaco/client/src/pages/NotFound.tsx \
  aiiaco/client/src/pages/IndustryMicrosite.tsx \
  aiiaco/client/src/pages/AIRevenueEnginePage.tsx \
  aiiaco/client/src/pages/AICrmIntegrationPage.tsx \
  aiiaco/client/src/pages/AIWorkflowAutomationPage.tsx \
  aiiaco/client/src/pages/AIForRealEstatePage.tsx \
  aiiaco/client/src/pages/AIForVacationRentalsPage.tsx \
  aiiaco/client/public/robots.txt \
  aiiaco/client/public/sitemap.xml \
  aiiaco/client/public/llms.txt \
  aiiaco/client/public/about.txt \
  aiiaco/scripts/prerender.mjs
```
Then upload to Google Drive and send Nemr the link.

### A6. Post-ship verification
```bash
# After Manus has deployed
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
# Expected: > 0 (previously 0)

curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-crm-integration | grep -c "CRM integration"
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-workflow-automation | grep -c "workflow automation"
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-for-real-estate | grep -c "real estate"
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-for-vacation-rentals | grep -c "vacation rental"
# All should return > 0
```

### A7. GSC submission
1. Open https://search.google.com/search-console/ signed in as contact@montekristobelgrade.com
2. Select property aiiaco.com
3. Sitemaps → Submit `sitemap.xml`
4. URL Inspection → request indexing for each new route (5 URLs)
5. Check Coverage report in 7 days

### A8. Update state files
Mark Bucket A complete in `state/01-INDEX.md`. Update `clients/aiiaco/CLIENT.md` status to "Round 2 shipped, monitoring GSC indexation".

---

## Bucket B: Round 3 cleanup (brand + em-dash in untouched components)

**Priority**: HIGH (brand consistency must be sitewide before any presentation)
**Time estimate**: 2-4 hours
**Dependency**: None (can run before or after Bucket A)

**Target**: 242 AiiACo instances + ~29 em-dashes in components NOT touched in Round 2.

### B1. Inventory
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"

echo "=== AiiACo outside index.html ==="
grep -rn "AiiACo" client/src/ 2>/dev/null | wc -l
# Should be ~242

echo ""
echo "=== Files with AiiACo ==="
grep -rl "AiiACo" client/src/ 2>/dev/null | sort

echo ""
echo "=== Em-dashes across client/src/ and client/public/ ==="
grep -rn "—" client/src/ client/public/ scripts/ 2>/dev/null | wc -l
```

### B2. Run batch replacement
Use the Python scripts from `state/07-COMMANDS.md` Round 3 section.

### B3. TypeScript check
```bash
npx -y -p pnpm@10.15.1 pnpm run check
```

### B4. Spawn adversarial critic
Use the critic spawn template from `state/07-COMMANDS.md`. Scope: all modified files.

### B5. Apply critic findings, re-check, repeat until clean

### B6. Update state files

### B7. (Optional) Extend IndustryMicrosite.tsx to render new data fields
Priority 5 industries have `regulations`, `platforms`, `roles` data that isn't yet rendered visibly. Adding sections for these would push those pages from ~500 to ~1500 words and close the content gap vs competitors.

Sections to add (conditional, between existing Use Cases and Featured Case Study):

1. **"Compliance & Regulatory Context"** section
   - Renders `industry.regulations` as badge/pill grid
   - Only renders if `industry.regulations?.length > 0`

2. **"Platform Integrations"** section
   - Renders `industry.platforms` as card grid
   - Only renders if `industry.platforms?.length > 0`

3. **"Who We Work With"** section
   - Renders `industry.roles` as list or grid
   - Only renders if `industry.roles?.length > 0`

4. **Direct answer paragraph at top of hero**
   - Render `industry.directAnswer` prominently below the H1
   - AEO-ready definitional content (40-60 words)

---

## Bucket C: blog.aiiaco.com infrastructure

**Priority**: HIGH (content engine, biggest lever for long-tail SEO)
**Time estimate**: 6-10 hours for setup + first 4 posts
**Dependency**: Bucket A (need aiiaco.com live before we launch the blog)

### C1. Scaffold Astro project
```bash
cd ~/Desktop
npm create astro@latest aiiaco-blog -- --template blog --install --git --typescript strict
cd aiiaco-blog
```

Recommended: Astro (fastest SSG for blogs, built-in SEO, markdown-first, minimal runtime JS).

Alternative: Next.js with MDX if Nemr wants React components in blog posts.

### C2. Apply AiiAco design system
- Background: `#03050A`
- Gold accents: `#D4A843` / `#B89C4A`
- Typography: SF Pro Display + SF Pro Text
- Match homepage hero visual language

### C3. Create GitHub repo
```bash
cd ~/Desktop/aiiaco-blog
gh repo create MonteKristoAI/aiiaco-blog --private --source=. --push
```

### C4. Deploy to Vercel
- Link GitHub repo to Vercel
- Set custom domain: `blog.aiiaco.com`
- Vercel gives you a CNAME value

### C5. Send CNAME to Nemr
Email or message:
```
Blog infrastructure ready. To point blog.aiiaco.com at our hosting, add this CNAME record in your Namecheap DNS:

Type: CNAME
Host: blog
Value: cname.vercel-dns.com
TTL: Automatic

After you save, DNS propagation takes 5-30 minutes. Let me know when done and I'll verify.
```

### C6. Run blog-onboard skill for AiiAco
```
/blog onboard
industry: AI integration services
location: US
domain: blog.aiiaco.com
```

The skill creates `Blog/clients/aiiaco/` with 6 files: CLIENT.md, STYLE.md, BRAND.md, FEEDBACK.md, CONTENT.md, SITEMAP.md

### C7. Create persona
```
/blog persona create aiiaco
```
Voice: Authoritative, direct, no-fluff, technical but accessible
NNGroup 4-Dimension: Serious (0.9), Formal-Casual (0.3), Respectful (0.2), Matter-of-fact (0.8)

### C8. First 4 launch posts (priority order from competitor audit)

**Post 1: "What is an AI revenue system?"** (PILLAR — zero-competition claim)
- Primary keyword: "what is an AI revenue system", "AI revenue systems"
- Target: 3000+ words, definitive guide
- Sections: Direct answer → 5 components → Why this matters → Implementation timeline → Case study → FAQ
- Schema: Article + FAQPage
- Internal link to `/ai-revenue-engine` service page

**Post 2: "How to reactivate a dormant customer database with AI"** (QUICK WIN)
- Primary keyword: "how to reactivate a customer database"
- Target: 2500 words, tutorial format
- Sections: Direct answer → Why dormant databases matter → Step-by-step process → Typical ROI → Case study → FAQ
- Schema: HowTo + FAQPage
- Internal link to `/ai-revenue-engine`

**Post 3: "How AI automates operations for real estate brokerages"** (VERTICAL GAP)
- Primary keyword: "AI for real estate brokerage operations"
- Target: 2500 words
- Sections: Problem statement → Where AI actually helps → Platform-specific integration (Follow Up Boss, kvCORE, BoomTown) → Case study → FAQ
- Internal link to `/ai-for-real-estate` and `/industries/real-estate-brokerage`

**Post 4: "How to integrate AI into a real estate CRM"** (CRM VERTICAL GAP)
- Primary keyword: "AI CRM integration real estate"
- Target: 2500 words, step-by-step
- Sections: Direct answer → 4-step process → Platform-specific guides (Follow Up Boss, kvCORE) → Case study → FAQ
- Internal link to `/ai-crm-integration` and `/ai-for-real-estate`

### C9. Publishing cadence
Target: 2 posts per week after launch. Alternating between:
- Pillar topics (long, definitive guides targeting zero-competition queries)
- Vertical-specific (industry deep-dives)
- Platform-specific (CRM integrations, PMS integrations)
- Thought leadership (Nemr-bylined opinion pieces)

---

## Bucket D: Domain portfolio strategy

**Priority**: MEDIUM (opportunistic — may yield backlink value)
**Time estimate**: 3-5 hours
**Dependency**: None

Nemr owns ~100 domains. Potential uses:
- 301 redirects → transfer authority to aiiaco.com
- Standalone content hubs (legitimate — unique content only)
- Park or drop

### D1. Request domain list from Nemr
Message:
```
Hey Nemr,

You mentioned you own around 100 domains and had thought about using some for case-study sites pointing to aiiaco. Before we build anything, can you send me the full list?

We'll audit each one for existing backlinks, traffic history, and topical fit, then recommend:
- Which to 301 redirect to aiiaco.com (free authority boost)
- Which to park
- Which are worth building as standalone content hubs (only if we can produce unique content — never thin PBN sites, Google kills those)

CSV or spreadsheet is fine. Even just a plain text list works.
```

### D2. Audit each domain
For each:
- Check DNS resolution (is it live?)
- WHOIS age (old domains carry more potential authority)
- Archive.org snapshot history (was it ever a real site?)
- Free backlink checker (Ahrefs free tier, moz.com Link Explorer)
- Topical relevance to AiiAco (AI? Real estate? Mortgage? Tech? Unrelated?)

### D3. Categorize
- **301 redirect candidates** (20-30 domains probably): aged, have any backlinks, topically aligned
- **Standalone hub candidates** (2-3 domains max): high authority + unique topic angle + Nemr willing to produce content
- **Park or drop** (rest): weak, off-brand, no authority

### D4. Present categorized plan to Nemr for approval

### D5. Execute
- Set 301 redirects via domain registrar or Cloudflare Page Rules
- DO NOT create thin PBN sites
- DO NOT spam internal links from fake domains

---

## Bucket E: Off-site / authority building

**Priority**: MEDIUM (long-term compounding value)
**Time estimate**: Ongoing (weeks)
**Dependency**: Bucket A (live site needed for outreach references)

### E1. Guest post pitches

**Inman** (real estate)
- Pitch: "AI Is Not Going to Replace Real Estate Agents. Here's What It Will Replace Instead."
- Byline: Nemr Hallak, Founder, AiiAco
- Contact: editorial@inman.com (tips), more specific via LinkedIn

**HousingWire** (mortgage)
- Pitch: "The SMB Mortgage Broker's Case for AI: Why Enterprise Platforms Don't Fit"
- Byline: Nemr Hallak
- Contact: editor@housingwire.com

**VRMA** (vacation rental)
- Pitch: "AI Integration for Short-Term Rental Operators: Beyond the Vendor Bundle"

**RISMedia, RealTrends, Mike DelPrete's Substack**
- Topical pieces on AI in real estate brokerage operations

### E2. Podcast outreach list
- Inman Access
- Real Estate Rockstars (Pat Hiban)
- Tom Ferry Show
- Brian Buffini
- VRMA podcast
- Rental Scale-Up
- Get Paid For Your Pad (STR)

Draft pitch template:
```
Hi [Host name],

I'm Nemr Hallak, founder of AiiAco. We design and deploy AI infrastructure for real estate brokerages, mortgage lenders, and vacation rental operators — without replacing the platforms they already own.

I've got a concrete story I think would resonate with your audience: how a mid-size brokerage went from managing 80 agents with 4 admins to managing 200 agents with the same 4 admins, without adding headcount and without replacing Follow Up Boss or kvCORE.

Would you be open to a 30-minute conversation on this topic? I can cover:
- What AI actually does (and doesn't do) in real estate operations
- Why most brokerages are buying the wrong AI tools
- Specific integrations that compound over time

Available [dates]. Happy to do video or audio-only.

Best,
Nemr
```

### E3. LinkedIn content ramp
- 2-3 Nemr-bylined posts per week
- Topics rotation: industry observations, platform deep-dives, case study snippets, "lessons from Week X" operator POV
- Each post includes 1 link back to relevant page on aiiaco.com (not spam, genuine reference)

### E4. YouTube channel
- Create `@aiiaco` YouTube channel
- First video: "What Is AI Integration for Business? (And Why It's Not AI Tools)" — 5-7 minutes, Nemr talking head + screenshots
- Audit found YouTube is the #1 correlated signal (0.737) for AI citation in ChatGPT/Perplexity
- Embed video on homepage and /ai-integration page
- Publish cadence: 1 video per month initially

### E5. Wikipedia entity creation
- **DEFER**. Wikipedia requires notability (3rd-party sources). AiiAco doesn't have enough yet.
- Revisit after 6 months of guest posts and podcast appearances.

### E6. G2/Capterra listings
- Create profiles for AiiAco on G2 (B2B software review platform)
- Requires Nemr's business credentials and sometimes a paid plan
- Value: brand mentions in buyer research funnels
- **PARTIALLY OPTIONAL**: G2 is for products, not services. May not fit AiiAco's service model.

---

## Bucket F: Industry page visual expansion (ties to Bucket B)

**Priority**: MEDIUM-HIGH (closes content gap)
**Time estimate**: 2-3 hours
**Dependency**: Bucket B (typically done together)

Extend IndustryMicrosite.tsx to render the new data fields (regulations, platforms, roles, directAnswer). See Bucket B sub-step B7 for details.

**Pages affected**: 5 priority industries (real-estate-brokerage, mortgage-lending, commercial-real-estate, luxury-lifestyle-hospitality, management-consulting).

**Expected impact**: Page word count per industry goes from ~500 to ~1500-2000 words. Closes competitor gap (1800-3500 benchmark).

---

## Bucket G: PDF audit report for Nemr

**Priority**: LOW (nice-to-have client deliverable)
**Time estimate**: 30 minutes
**Dependency**: None

Nemr has access to the Markdown audit files in `clients/aiiaco/audit/`. A branded PDF would be a nicer deliverable for investor/board sharing.

### G1. Invoke report skill
```
/report
client: aiiaco
type: seo-audit
source: clients/aiiaco/audit/MASTER-AUDIT-REPORT.md + clients/aiiaco/audit/ACTION-PLAN.md
branding: MonteKristo
output: clients/aiiaco/reports/aiiaco-seo-audit-april-2026.pdf
```

### G2. Upload to Drive
Upload the PDF to the client folder in Google Drive (same folder as brand assets).

### G3. Send Nemr shareable link
```
Hey Nemr,

Full SEO audit PDF for aiiaco.com: [link]

Covers everything we found (technical, content, schema, competitive) and the prioritized action plan. Feel free to share with investors or advisors.

Raw Markdown versions are also in our system if you want the source.
```

---

## Decision tree for next session

```
Start session
│
├─ Read state/01-INDEX.md, state/02-BUSINESS-CONTEXT.md, state/08-NEXT-BUCKETS.md
│
├─ Run: cd working-dir && pnpm run check
│   │
│   ├─ Errors → fix drift before anything else
│   │
│   └─ Clean → continue
│
├─ Run: curl -A "Googlebot" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
│   │
│   ├─ 0 (Round 2 NOT shipped) → Bucket A (sync to Manus)
│   │
│   └─ >0 (Round 2 LIVE) → ask user which bucket
│       │
│       ├─ "Content" → Bucket C (blog)
│       ├─ "Cleanup" → Bucket B (Round 3)
│       ├─ "Domains" → Bucket D (portfolio)
│       ├─ "Outreach" → Bucket E (off-site)
│       ├─ "Industry pages" → Bucket F (visual expansion)
│       └─ "PDF report" → Bucket G (deliverable)
│
└─ Execute chosen bucket, update state files, end session
```
