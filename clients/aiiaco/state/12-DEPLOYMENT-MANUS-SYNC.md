# AiiAco — Manus Sync and Deployment Guide

How to get Round 2 source code from our local working copy into the live aiiaco.com site.

**Current state**: Round 2 is local-only. aiiaco.com is running pre-Round-2 code.

---

## The problem

Manus AI is a proprietary hosting platform. We cannot:
- SSH into their servers
- Deploy via standard CI/CD
- Push to a shared git repo directly (the `github.com/10452/aiiaco.git` Manus GitHub mirror is private and we have no push access)

We CAN:
- Edit source code locally (the ZIP export gives us everything)
- Run TypeScript checks locally
- Run the Manus platform's build pipeline (if we had access — we don't)
- Chat with the Manus agent to apply changes (costs Nemr credits)

---

## Three sync paths

### Path 1: GitHub collaborator access (PREFERRED)

**Why**: Gives us ongoing push access for future updates. Cleanest workflow.

**Steps**:
1. Nemr logs into Manus
2. In Manus project settings → GitHub panel, either:
   - Add our GitHub user `MonteKristoAI` as collaborator on `10452/aiiaco`, OR
   - Disconnect the current repo and reconnect with a new repo on our GitHub account
3. If option A: accept the GitHub collaborator invite email, then `git remote add manus https://github.com/10452/aiiaco.git`
4. Push changes:
   ```bash
   cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
   # If no .git folder yet:
   git init
   git add client/ scripts/
   git commit -m "SEO Round 2: 5 new service pages, industry data expansion, schema markup, brand consistency"
   # Add the manus remote:
   git remote add manus https://github.com/10452/aiiaco.git
   # Push:
   git push manus main
   ```
5. Manus auto-pulls and redeploys

**Risk**: Manus may not support collaborator adds on auto-created accounts. May require platform support ticket.

---

### Path 2: ZIP upload via Manus UI

**Why**: Backup option if GitHub sync isn't available.

**Steps**:
1. Create bundle ZIP of only changed files:
   ```bash
   cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"
   zip -r aiiaco-round2-changes.zip \
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
   ls -lh aiiaco-round2-changes.zip
   ```

2. Upload ZIP to Google Drive (use `google-workspace` MCP)

3. Share link with Nemr:
   ```
   Hey Nemr,

   Round 2 source files are in this ZIP:
   [Google Drive link]

   Contains 6 new files and 18 modifications. Extract over your Manus project files (overwriting existing). Or if Manus has a file upload UI, upload the ZIP directly.

   After upload, Manus should rebuild and deploy automatically. Let me know when done and I'll verify.
   ```

4. Wait for Nemr to complete upload

5. Verify deploy (see Path 3 verification steps below — same for all paths)

**Risk**: Manus UI may not have a ZIP upload feature. Nemr may need to manually drag each file.

---

### Path 3: Manus chat agent applies diffs

**Why**: Worst-case fallback. Costs Nemr Manus credits. Slowest.

**Steps**:
1. Generate a human-readable change summary (use `state/04-FILE-INVENTORY.md` as the source)
2. Nemr opens Manus chat in the aiiaco project
3. Nemr pastes a prompt like:
   ```
   Apply these SEO code changes. Do not modify anything else:

   NEW FILES TO CREATE:
   - client/src/pages/AIRevenueEnginePage.tsx  [paste content]
   - client/src/pages/AICrmIntegrationPage.tsx [paste content]
   ...

   FILES TO MODIFY:
   - client/index.html [paste new content]
   - client/src/App.tsx [paste new content]
   ...
   ```
4. Manus agent applies changes, commits, rebuilds
5. Nemr verifies

**Risk**: Context limit. Manus agent may not handle all 24 file changes in one pass. May need to break into multiple chat sessions. Each session costs credits.

**When to use**: Only if Paths 1 and 2 are both blocked.

---

## Draft message to Nemr

Send this via email or LinkedIn (get Milan's approval first per rule):

---

**Subject**: Round 2 SEO code is ready — need your call on deploy path

Hey Nemr,

The Round 2 SEO code sweep for aiiaco.com is complete and verified (0 TypeScript errors, 3 adversarial critic passes, 67 bugs found and resolved).

Here's what ships:

**5 new service pages you requested** (the 6th was strategically replaced — explanation below):
- `/ai-crm-integration` — "How to integrate AI into a CRM" + 12 supported CRMs + 6-question FAQ
- `/ai-workflow-automation` — 6 automation categories + 6-question FAQ
- `/ai-revenue-engine` — "AI revenue systems" pillar (zero-competition keyword per our competitor research)
- `/ai-for-real-estate` — 10 brokerage platforms + 6 use cases + 6-question FAQ
- `/ai-for-vacation-rentals` — 14 PMS platforms + 6 use cases (positioned as integrator, not vendor)

**Industry data expansion**: All 20 industries have AEO-ready direct-answer definitions and related-industry cross-links. 5 priority industries (real-estate-brokerage, mortgage-lending, commercial-real-estate, luxury-lifestyle-hospitality, management-consulting) also have full 6-question FAQs, regulation lists, named platform lists, and role-specific language.

**Schema markup**: Person schema added for you (was missing entirely). BreadcrumbList, FAQPage, Service, HowTo, and AboutPage schemas dispatched dynamically by route. All validated.

**Critical bugs fixed**: Duplicate canonical tags, missing title tags in pre-render, Framer Motion hero visibility, hydration mismatch between SSR and client dispatch, 111 em-dashes cleaned, 131 brand casing inconsistencies fixed.

**Public assets refreshed**: robots.txt with per-bot explicit rules (GPTBot, ClaudeBot, PerplexityBot all get Allow), sitemap.xml regenerated with all 5 new URLs + proper lastmod, llms.txt with your founder bio and target AEO queries, about.txt aligned with canonical methodology.

**Rewritten 404 page**: Dark theme matching your brand (was light slate before — clashed hard), noindex meta, helpful navigation to 6 popular destinations.

**Strategic pivot worth discussing**: You asked for `/ai-infrastructure` as a core page. Our competitor research showed that term is owned by IBM, CoreWeave, Nebius, and cloud hyperscalers — Google AI Overview defines "AI infrastructure" as GPUs/HPC/networking hardware, not software integration. Unwinnable for a boutique consultancy. We built `/ai-revenue-engine` instead, targeting "AI revenue systems" which has zero current rankers — a definitional whitespace you can own. I can revert if you disagree, but the business logic is clean.

---

**Now I need you to pick a sync path**. Three options for getting this live on aiiaco.com:

**Option 1 (best): GitHub collaborator access**

In Manus, re-connect the GitHub panel and add our GitHub user `MonteKristoAI` as a collaborator on the `10452/aiiaco` repo. Once we have push access, I deploy immediately and we have ongoing push access for all future updates. No more manual handoffs.

**Option 2: ZIP upload**

I send you a ZIP of the 24 changed files. You upload to Manus via their file interface. Manus rebuilds.

**Option 3: Manus chat**

You paste the changes into the Manus project chat. The Manus agent applies them. This will use some of your Manus credits (not sure how many — depends on how Manus prices diff application).

Option 1 is cleanest. Option 2 is simple if Manus supports bulk file upload. Option 3 is last resort.

Which works best? Happy to walk through any of them.

Also: Plausible Analytics token still not installed on the site. Want me to add it to index.html as part of this sync, or do you have a reason to keep it off?

---

## After sync: verification checklist

Once Manus confirms Round 2 has shipped, run these checks:

### Live URL checks
```bash
# Each of these should return > 0 after ship (was 0 before)
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://aiiaco.com/ai-crm-integration | grep -c "CRM integration"
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://aiiaco.com/ai-workflow-automation | grep -c "workflow automation"
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://aiiaco.com/ai-for-real-estate | grep -c "real estate"
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://aiiaco.com/ai-for-vacation-rentals | grep -c "vacation rental"
```

### Schema validation
1. Visit `https://search.google.com/test/rich-results` (Google Rich Results Test)
2. Test each new URL:
   - https://aiiaco.com/ai-revenue-engine
   - https://aiiaco.com/ai-crm-integration
   - https://aiiaco.com/ai-workflow-automation
   - https://aiiaco.com/ai-for-real-estate
   - https://aiiaco.com/ai-for-vacation-rentals
3. Verify each shows: Organization, WebSite, ProfessionalService, Person (from shell) AND FAQPage (from page-specific dispatcher)
4. Also test homepage and priority industry pages
5. Fix any schema errors

### Brand consistency spot checks
```bash
# Visit these and look for AiiACo vs AiiAco inconsistencies
https://aiiaco.com/
https://aiiaco.com/ai-integration
https://aiiaco.com/ai-revenue-engine
https://aiiaco.com/industries/real-estate-brokerage
```

Expected: `AiiACo` appears only in schema blocks (view page source), `AiiAco` everywhere else.

### 404 page check
Visit `https://aiiaco.com/this-does-not-exist` — should render the new dark-themed 404 with helpful navigation.

### Google Search Console submission
1. Open https://search.google.com/search-console/ (as contact@montekristobelgrade.com)
2. Select property `https://aiiaco.com`
3. Sitemaps → submit `sitemap.xml` (if not auto-detected)
4. URL Inspection → paste each new URL → Request Indexing:
   - https://aiiaco.com/ai-revenue-engine
   - https://aiiaco.com/ai-crm-integration
   - https://aiiaco.com/ai-workflow-automation
   - https://aiiaco.com/ai-for-real-estate
   - https://aiiaco.com/ai-for-vacation-rentals
5. Coverage report → check for errors in 24-48 hours
6. Core Web Vitals → should improve over 7-14 days (Framer Motion hero visibility fix)

### Update state tracking
After successful deploy:
1. Update `clients/aiiaco/CLIENT.md` status: "Round 2 shipped, monitoring GSC indexation"
2. Update `clients/aiiaco/state/01-INDEX.md` Bucket A status to "COMPLETE"
3. Add date of sync to notes

---

## Rollback plan

If Round 2 breaks something on the live site:

### Immediate rollback options
1. **If Path 1 (GitHub)**: `git revert HEAD && git push manus main`
2. **If Path 2 (ZIP)**: Have Nemr restore from Manus version history (Manus has "Version history" in the project UI)
3. **If Path 3 (chat)**: Nemr asks Manus agent to "undo the previous change"

### What could break
- Hydration mismatch if StructuredData dispatcher still has issues
- Missing CSS classes if a new page references a class that doesn't exist in index.css (display-headline, gold-line, etc. — all verified to exist)
- Import errors if new pages reference a module that doesn't exist (all verified via TypeScript check)
- 404 on new routes if entry-server.tsx routeMap doesn't have them (verified)

### Monitoring in first 48 hours post-deploy
- GSC Coverage report
- GA4 page views — new URLs should start receiving traffic
- Manus platform logs (if accessible)
- Browser console errors (manually check a few pages)

---

## If Nemr is unresponsive for > 1 week

**Escalation**:
1. Email follow-up (show Milan draft first)
2. LinkedIn DM to Nemr
3. Phone call to +1 888 808 0001 x3 (use Milan's discretion)
4. Work with Marylou (go@aiiaco.com) for any admin adjustments
5. Last resort: pause Round 2 ship, continue with Bucket B (Round 3 cleanup) which is fully local work

---

## Post-sync: continue with Bucket C (blog) or Bucket B (Round 3 cleanup)

Once Round 2 is live:
- **Bucket C** (blog.aiiaco.com) is next biggest lever — 10+ hours work but launches the content engine
- **Bucket B** (Round 3 cleanup) is quicker — 2-4 hours to clean remaining components

See `state/08-NEXT-BUCKETS.md` for full details.
