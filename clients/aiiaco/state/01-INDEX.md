# AiiAco State — Master Index

**Last updated**: 2026-04-11
**Purpose**: Single entry point for any future session continuing AiiAco work. Read files in the order listed below.

---

## How to continue AiiAco work

### Step 1. Read these files in order (every time)
1. **THIS FILE** (`state/01-INDEX.md`) - you're reading it
2. `state/02-BUSINESS-CONTEXT.md` - who, what, strategic positioning, locked decisions
3. `state/03-TECH-STACK.md` - exact versions, build pipeline, Manus platform behavior
4. `state/04-FILE-INVENTORY.md` - every file we touched with exact line refs and change descriptions
5. `state/05-CRITIC-FINDINGS.md` - all 67 bugs found by 3 adversarial critic passes with resolution status
6. `state/06-INDUSTRY-DATA.md` - the full 20-industry data set (what's populated, what's not)
7. `state/07-COMMANDS.md` - exact bash/python commands ready to copy-paste
8. `state/08-NEXT-BUCKETS.md` - detailed plan for every remaining bucket of work
9. `state/09-ACCESS-CREDENTIALS.md` - what access we have, what we're missing
10. `state/10-CONVERSATION-KEY-EXCHANGES.md` - key user decisions and why they were made
11. `state/11-PITFALLS-LESSONS.md` - gotchas we discovered and workarounds
12. `state/12-DEPLOYMENT-MANUS-SYNC.md` - exact steps to ship Round 2 to Manus

### Step 2. Run verification
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm run check
```
Expected: `tsc --noEmit` with 0 errors.

### Step 3. Check Round 2 ship status
```bash
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
```
- **> 0**: Round 2 is live on aiiaco.com. Move to Bucket B/C/D/E in `state/08-NEXT-BUCKETS.md`.
- **= 0**: Round 2 NOT shipped. Bucket A (Manus sync) is the priority.

### Step 4. Pick a bucket
See `state/08-NEXT-BUCKETS.md` for 7 detailed buckets (A through G).

---

## Quick snapshot

| Item | Value |
|---|---|
| Client | AiiAco (`aiiaco.com`), enterprise AI integration firm |
| Founder | Nemr Hallak (`nemr@aiiaco.com`) |
| Platform | Manus AI (Vite/React SPA with bot dynamic rendering) |
| Working copy | `/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco/` |
| TypeScript status | 0 errors (verified after each phase) |
| Round 1 status | COMPLETE |
| Round 2 status | COMPLETE in source code, NOT yet shipped to Manus |
| Source files edited in Round 2 | 18 modified + 6 created (24 total) |
| New service pages | 5 (AIRevenueEngine, AICrmIntegration, AIWorkflowAutomation, AIForRealEstate, AIForVacationRentals) |
| Critic passes executed | 3 (Phase A, Phase B+C, Phase F) |
| Total critic bugs found | 67 |
| Total critic bugs fixed | All critical + high, some medium/low deferred |
| Audit deliverables | 3 files in `clients/aiiaco/audit/` |

## NEVER DO (locked strategic decisions)

1. **Never re-target "AI infrastructure" keyword** - IBM/CoreWeave own it, unwinnable
2. **Never recreate `/ai-infrastructure` page** - we use `/ai-revenue-engine` instead
3. **Never write `AiiACo` in marketing copy** - only in schema `@name` fields (3 places in index.html)
4. **Never set founding date to anything other than 2025** - matches Wikidata Q138638897
5. **Never use em-dashes** in any deliverable - hyphens, commas, or rewrite
6. **Never position AiiAco as a product vendor** - always INTEGRATOR built on top of existing stack
7. **Never deploy a Cloudflare Worker** - Manus already dynamic-renders for bots
8. **Never re-add 5 off-brand industries** - high-risk-merchant-services, beauty-health-wellness, cosmetics-personal-care, helium-specialty-gas, biofuel-sustainable-fuels
9. **Never call useLocation() inside StructuredDataSSR** - takes `pathname` prop
10. **Never render StructuredData outside `<Router>`** - must be inside for wouter context
11. **Never re-run the 4-agent SEO audit** - it's already in `clients/aiiaco/audit/`
12. **Never redo Round 1 or Round 2 code fixes** - they're done, verified, TypeScript clean

## ALWAYS DO

1. Read this index first on every session start
2. Run TypeScript check before declaring anything "done"
3. Run adversarial critic after any significant code change
4. Update this state directory as work progresses
5. Preserve schema `@name: "AiiACo"` casing in index.html only
6. Use wouter `<Link>` for internal navigation, never raw `<a href>`
7. Ask user before sending outbound messages/emails
8. Apply MonteKristo branding to client-facing deliverables
