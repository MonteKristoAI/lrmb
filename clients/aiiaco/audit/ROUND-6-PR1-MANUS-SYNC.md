# Round 6: PR #1 Manus Sync (2026-04-11)

**Status**: PR OPEN, awaiting Nemr review and merge
**PR URL**: https://github.com/10452/aiiaco/pull/1
**Branch**: `seo/rounds-2-3-4`
**Base**: `main` at `7668adf`
**Head**: `bdd5bf7`
**Stats**: 97 files changed, +5,444 insertions, −579 deletions

## Context

Nemr responded to our outbound SEO work report with a green light plus concrete direction. He granted MonteKristoAI GitHub collaborator access on `10452/aiiaco` and asked us to push Rounds 2 through 4. He also added new direction:

1. New pillar: speed to lead / AI lead response
2. Three priority clusters: dormant database reactivation, AI SDR / follow-up systems, AI for real estate
3. Voice: operator level, specific tools, real workflows
4. Proof: directional outcome ranges (30 to 70 percent faster workflows, 2 to 3x conversion lift)
5. Distribution: video + shorts + LinkedIn + blog per topic
6. Long-term URL: blog moves to aiiaco.com/blog once DNS is on Cloudflare
7. Category ownership: AI Revenue Systems + AI Infrastructure

## Critical discovery on pull

When we cloned `10452/aiiaco` the state was NOT Round 1 as we assumed. The Manus repo was at HEAD `7668adf` with 100+ commits ahead of where our fork started. Manus had been auto-committing Nemr's ongoing work through Rounds 103 to 123, which included:

- VaaS (Voice Agent as a Service) platform build (Round 107 onward)
- `/demo-walkthrough` interactive sales page (Round 122)
- Embeddable voice widget with embed tokens (Round 115)
- Admin console expansion for VaaS clients
- Portal system (login, agent, conversations, embed config, billing, settings)
- 243 passing tests across 17 test files
- Cookie consent banner, cookie copy updates, `/talk` page holographic video
- **HEAD commit `7668adf`: brand casing fix reversing our Round 3 AiiACo → AiiAco cleanup. Nemr's rule: AiiACo = company/team, AiA = voice agent.**

Our Round 3 brand cleanup was directly opposite Nemr's rule. Our working copy at `edc2f92` had 34 files with `AiiAco` lowercase across `client/src/pages/`. The push would have introduced 78 file-level reintroductions of the wrong casing if we had not caught it.

Our working copy was also NOT a stale snapshot. It had Manus's VaaS + demo walkthrough + portal work already merged in. The missing pieces were the post-Round-107 brand cleanup and the `7668adf` casing fix itself.

## What was pushed (commit `bdd5bf7`)

### New files (clean adds)

5 public service pages, all prerender-safe with native anchor tags:

- `client/src/pages/AIRevenueEnginePage.tsx`
- `client/src/pages/AICrmIntegrationPage.tsx`
- `client/src/pages/AIWorkflowAutomationPage.tsx`
- `client/src/pages/AIForRealEstatePage.tsx`
- `client/src/pages/AIForVacationRentalsPage.tsx`

Plus:
- `client/src/components/RelatedServices.tsx` (reusable cross-link block)
- `client/public/humans.txt` (team info)
- `client/public/.well-known/security.txt` (security contact)
- `client/public/manifest.json` (PWA signal)
- 67 WebP + AVIF images in `client/public/images/` (responsive hero variants at 640/960/1280/1920)
- 3 image pipeline scripts: `scripts/download-assets.mjs`, `scripts/optimize-images.mjs`, `scripts/relink-images.mjs`

### Modified files (surgical edits)

- `client/src/App.tsx`: 5 new Route imports + 5 Route mounts for the new service pages. No changes to VaaS / portal / admin routes.
- `client/src/seo/seo.config.ts`: expanded PAGE_META for all 25+ routes. AiiACo casing throughout. Meta titles 40-65 chars, descriptions 140-165 chars. 5 new entries for new service pages.
- `client/src/seo/StructuredDataSSR.tsx`: per-route JSON-LD dispatcher with FAQPage for `/ai-implementation-services` + `/ai-governance`, HowTo for `/ai-crm-integration` + `/ai-workflow-automation`, CollectionPage + ItemList for `/case-studies`.
- `client/src/seo/SEO.tsx`: adds optional `suppressCanonical` prop for NotFound page (fixes TS error).
- `client/src/entry-server.tsx`: full routeMap with ssrSlug prop pattern for dynamic industry routes. Round 3 Phase 11 prerender SSR fix.
- `scripts/prerender.mjs`: Framer Motion SSR post-processor, dynamic industry route walker, expanded route list from 24 to 35+.
- `client/src/pages/Home.tsx`: simplified to rely on SEO component + PAGE_META.
- `client/src/pages/NotFound.tsx`: dark theme, noindex, suppressCanonical prop.
- `client/src/pages/IndustryMicrosite.tsx`: Direct Answer hero, Compliance Context grid, Platform Integrations grid, Who We Work With roles list, inline Service + BreadcrumbList + FAQPage schemas.
- `client/src/data/industries.ts`: 20 industries populated from 747 lines to 1899 lines with directAnswer, regulations, platforms, roles, 6-question FAQ arrays.
- `client/index.html`: Person schema for Nemr Hallak, preconnect + preload hero-bg with responsive imagesrcset, duplicate canonical cleanup, Organization enriched with slogan + areaServed + inLanguage, ProfessionalService enriched with priceRange + audience + hasOfferCatalog, AiiACo casing completed.
- `client/public/robots.txt`: expanded from 11 lines to 210 lines with per-bot directives for GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, Google-Extended, CCBot, Amazonbot, DuckDuckBot.
- `client/public/llms.txt`: expanded founder bio and positioning, AiiACo casing.
- `client/public/about.txt`: expanded company description, AiiACo casing.
- `client/public/sitemap.xml`: xmlns:image namespace added, image sitemap entries for logo + og-default + hero-bg, new service route entries.

## What was NOT touched

Explicitly preserved Manus's VaaS and platform work:

- `server/` (aiAgent.ts, emailTemplates.ts, leadDiagnostic.ts, healthMonitor.ts, and all tests)
- `drizzle/` (database migrations)
- `knowledge-extraction/`
- `shared/`
- `tests/`
- `seed-vaas.mjs`
- `todo.md`, `ideas.md`
- Portal pages, Admin pages, Demo walkthrough, Talk page, AiA voice widget
- AIIntegrationPage.tsx, AIAutomationPage.tsx, AIGovernancePage.tsx (already existed, we added new service pages alongside)

## Quality gates

- `npx tsc --noEmit` clean
- Zero em dashes in modified files (pre-existing em dashes in server/, AIIntegrationPage, AIAutomationPage, WorkplacePage were untouched)
- Zero AiiAco lowercase in modified files (AiiACo casing applied)
- Codex CLI review passed on 5 of 6 critical files
- 1 known issue flagged by Codex (pre-existing, not introduced): client-side `<StructuredData />` in App.tsx line 117 duplicates SSR-rendered schemas on hydration. Left in place; deferred to a follow-up PR.

## Known follow-ups (not in PR #1)

- `<StructuredData />` client-side duplicate mount in App.tsx (pre-existing, Codex flagged)
- 3 files still have AiiAco lowercase: `todo.md`, `knowledge-extraction/re-agent-offer.txt`, `knowledge-extraction/operator-offer.txt` (Manus internal docs, left alone)
- Em dashes in server/, admin pages, AIIntegrationPage.tsx, AIAutomationPage.tsx, WorkplacePage.tsx (pre-existing, untouched)
- `/ai-infrastructure` positioning page (referenced in BLOG-STRATEGY.md v2 but not in PR #1; can ship as PR #2 once Nemr approves the dual positioning approach)

## After merge verification (run when Nemr merges)

```bash
# 1. Main site serves Round 2+ content
curl -s -A "Googlebot/2.1" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
# expect > 0

# 2. Other 4 new service pages
for p in /ai-crm-integration /ai-workflow-automation /ai-for-real-estate /ai-for-vacation-rentals; do
  curl -s -A "Googlebot/2.1" "https://aiiaco.com${p}" | grep -oE '<title[^>]*>[^<]+' | head -1
done

# 3. Industry microsite has Round 3 expansion
curl -s -A "Googlebot/2.1" https://aiiaco.com/industries/real-estate-brokerage | grep -c "Follow Up Boss\|kvCORE"
# expect > 0

# 4. No duplicate canonical
curl -s -A "Googlebot/2.1" https://aiiaco.com/ | grep -c 'rel="canonical"'
# expect 1

# 5. New service page in sitemap
curl -s https://aiiaco.com/sitemap.xml | grep -c "ai-revenue-engine"
# expect > 0
```

After all checks pass:

1. Submit updated sitemap to Google Search Console (`contact@montekristobelgrade.com`)
2. Request indexing on the 5 new service pages via URL Inspection
3. Submit to Bing Webmaster Tools

## Lessons learned

1. **Never assume the remote state matches a working copy.** We assumed Manus was at Round 1. Reality: 100+ commits ahead. Always clone and check HEAD + merge-base before planning any push.
2. **Brand conventions can reverse.** Round 3 cleaned AiiACo → AiiAco based on our interpretation. Nemr's HEAD commit did the opposite and established AiiACo as the rule. Always verify brand rules against the client's most recent public writing before enforcing them.
3. **Feature branches + PRs beat force-push.** Even with collaborator access, a PR is the right move because it lets Nemr review before merge and preserves his VaaS work.
4. **Codex as a second pair of eyes.** Codex CLI caught a real SSR / JSON-LD duplication issue (pre-existing) that we would have missed in pure manual review.
