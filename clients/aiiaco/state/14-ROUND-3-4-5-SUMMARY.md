# AiiAco - Round 3, 4, 5 Full Summary

Consolidated reference for all work after the state folder was first written. Read this single file to understand everything that happened Apr 11 2026 across the three rounds.

---

## TL;DR

| Round | Theme | Status | Artifact |
|---|---|---|---|
| Round 1 | Critical bug fixes | ✅ Shipped nowhere (Manus blocker) | aiiaco/ working copy |
| Round 2 | 5 new service pages + schema overhaul | ✅ Code complete locally | aiiaco/ working copy |
| Round 3 | Sitewide cleanup + WebP pipeline + infra | ✅ Code complete locally | aiiaco/ working copy, github.com/MonteKristoAI/aiiaco |
| Round 4 | Deep SEO audit + meta/schema fixes + React blog | ✅ Code complete locally | same repo |
| Round 5 | Static HTML blog (replaces Round 4 React blog) | ✅ **LIVE at aiiaco-blog.pages.dev** | github.com/MonteKristoAI/aiiaco-blog |

**Round 5 is the ONLY thing currently live on the internet.** Rounds 1-4 are still waiting on Manus sync to reach aiiaco.com.

---

## Round 3 - Ultra-Deep Site Overhaul (Apr 11 2026)

Addressed accumulated debt across 73 files that Round 2 didn't touch, plus infrastructure gaps.

### What shipped (all in main aiiaco/ working copy)

1. **Image pipeline** - scripts/download-assets.mjs + optimize-images.mjs + relink-images.mjs. Downloaded 23 remote images from CloudFront + Manus CDN, converted to WebP + AVIF + responsive variants, wrote to `client/public/images/`. 60 MB -> 4 MB (93.3% reduction). Replaced every CDN URL in source with local paths. Fixed time-bomb: hero/process/team backgrounds were using Manus signed URLs expiring 2026-11-01.

2. **Brand + em-dash cleanup** - 278 `AiiACo` -> `AiiAco` in marketing copy, 414 em-dashes + 28 en-dashes -> hyphens across 73 files. Python batch script `scripts/round3-cleanup.py` with EM_DASH unicode constant so the script itself is clean of literal em-dashes.

3. **Internal linking architecture** - Created `client/src/components/RelatedServices.tsx` reusable cross-link block with 6-service catalog + industry affinity map. Footer expanded to 6 columns adding "Solutions" nav. Navbar "Services" link -> /ai-integration. RelatedServices imported into 15 non-Round-2 pages. Each of the 5 new service pages now has 5-14 incoming links.

4. **IndustryMicrosite visual expansion** - Added 4 new conditional sections: Direct Answer hero block, Compliance Context grid, Platform Integrations grid, Who We Work With (Roles) list. Only render if industry data is populated.

5. **Populate 15 remaining industries** - `scripts/round3-populate-industries.py` added full data (regulations, platforms, roles, 6-question FAQ) for insurance, financial-services, investment-wealth-management, software-technology, agency-operations, energy, solar-renewable-energy, automotive-ev, food-beverage, cryptocurrency-digital-assets, software-consulting, software-engineering, oil-gas, alternative-energy, battery-ev-technology. All 20 industries now fully populated. industries.ts grew 954 -> 1899 lines.

6. **TeamSection activated** - Component existed with Nemr bio but was never imported. Now rendered on ManifestoPage for E-E-A-T founder visibility.

7. **Build + perf hardening** - preconnect + dns-prefetch + preload hero-bg-1280.webp in index.html. manifest.json, humans.txt, .well-known/security.txt created. Absolute URLs for OG/schema images. React.lazy for 13 admin/portal/demo-walkthrough pages with Suspense wrappers (kept Round 2 service pages eager for prerender). color-scheme meta.

8. **Schema enrichment** - Organization slogan added, areaServed expanded to country array, inLanguage en-US, SearchAction added to WebSite (later removed in Round 4 because endpoint didn't exist). ProfessionalService got priceRange $$$$, paymentAccepted, BusinessAudience, hasOfferCatalog with 6 Offer items pointing to Round 2 service pages.

9. **Accessibility** - skip-to-content link in index.html + main-content wrapper. aria-expanded + aria-controls on Navbar hamburger. id="mobile-menu" + role="dialog" + aria-modal=true on overlay.

10. **Prerender SSR fix** (critical) - Pre-existing Round 2 prerender was silently broken across 41 of 45 routes. Root causes:
    - wouter `<Link>` triggered "Missing getServerSnapshot" in SSR. Fix: swap all Link -> `<a href>` in RelatedServices, IndustryMicrosite, and 5 Round 2 service pages.
    - IndustryMicrosite `useParams()` returned empty in SSR because rendered outside matched Route. Fix: entry-server.tsx extracts slug from URL and passes as `ssrSlug` prop. IndustryMicrosite.tsx accepts `ssrSlug`/`params` props with fallback chain.
    - Result: prerender went from 3 OK / 42 errors to 41 OK / 4 errors. The 4 remaining errors are pre-existing tRPC/localStorage issues on Home/Upgrade/Demo/Talk (not Round 3 regressions).

### Round 3 git history (on github.com/MonteKristoAI/aiiaco)

11 commits, all on `main`. Full ROUND-3-CHANGES.md at `clients/aiiaco/audit/ROUND-3-CHANGES.md` (308 lines).

---

## Round 4 - Deep SEO Audit + Critical Fixes + React Blog (Apr 11 2026)

### Audit findings (audit/ROUND-4-FINDINGS.md, 290 lines)

- **CRITICAL context**: Live aiiaco.com still runs Round 1 code. Verified via WebFetch. Title reads "AiiA | Remove Operational Friction...", only 3 JSON-LD schemas present, no mention of AI revenue system, OG image still on Manus CloudFront.
- **C1**: 16/24 meta descriptions exceeded 165 chars (Google SERP truncation)
- **C2**: 10/24 titles outside 50-65 char range
- **C3**: AIImplementationPage + AIGovernancePage had FAQSection but no FAQPage schema dispatcher
- **C4**: No `<image:image>` sitemap entries despite 70 local images
- **H1-H8**: 8 high findings including no /blog, bundle size, missing Article/HowTo schemas, broken SearchAction lying about a nonexistent search endpoint, missing BreadcrumbList on 7 pages
- **M1-M9, L1-L6**: 15 lower priority findings

### What shipped (Round 4 Phase 1)

1. **Meta optimization** - seo.config.ts rewritten: 25/25 titles in 40-65 char range, 25/25 descriptions in 140-165 char range. Primary keyword in first 50 chars of every description.

2. **Schema dispatcher enrichment** (client/src/seo/StructuredDataSSR.tsx):
   - FAQPage for /ai-implementation-services (6 questions on deployment timeline, engineering dependency, platforms, measurement, post-ship ops)
   - FAQPage for /ai-governance (6 questions on EU AI Act, NIST AI RMF, ISO 42001, audit logging, bias testing, incident response)
   - HowTo for /ai-crm-integration (4 steps: map workflow, design layer, deploy without migration, manage)
   - HowTo for /ai-workflow-automation (4 steps: identify work, build integration layer, deploy with human oversight gates, measure and expand)
   - CollectionPage + Article ItemList for /case-studies (5 nested Article items per case study)

3. **Broken SearchAction removed** - Round 3 had added a SearchAction referencing /?q= which doesn't exist. Google validates against live page, lying schema is worse than none. Removed.

4. **Image sitemap namespace** - Added `xmlns:image` to sitemap.xml urlset. Added `<image:image>` entries for logo, og-default, hero-bg on homepage URL.

### React blog (Round 4 Phase 2) - REMOVED in Round 5

Built a complete TSX blog inside the main Vite/React app: BlogIndexPage.tsx, BlogPostPage.tsx, client/src/data/blog.ts with 3 full seed posts. Round 5 replaced this with a separate static HTML blog repo and deleted all the TSX files. Content is preserved in `clients/aiiaco/aiiaco-blog/posts/what-is-an-ai-revenue-system.html` (1 post ported to static HTML format as verification seed).

### Round 4 git history

2 commits on `main`:
- Round 4 Phase 1: SEO audit + critical meta/schema/sitemap fixes (5 files, 717 insertions)
- Round 4 Phase 2: /blog infrastructure + 3 seed posts (8 files, 1411 insertions) -- now deleted in Round 5

---

## Round 5 - Static HTML Blog (Apr 11 2026) - LIVE

### The decision

Round 4's TSX blog was technically correct but violated a user requirement: Milan wanted a "real static HTML blog like gummygurl-blog and luxeshutters-blog". Not React. He also wanted it "200% pixel-perfect" to the main aiiaco.com site so visitors couldn't tell the difference.

### The approach

Created a second repo at `github.com/MonteKristoAI/aiiaco-blog` (private) following the exact structure of `github.com/MonteKristoAI/gummygurl-blog`. Confirmed via MCP GitHub API inspection that both gummygurl-blog and luxeshutters-blog use this exact pattern.

### Repo structure

```
aiiaco-blog/
├── build.js              # 390 lines Node.js, zero build dependencies
├── package.json          # only devDep: "serve" (for local preview)
├── README.md
├── DEPLOY.md             # Cloudflare Pages + Worker setup
├── .gitignore            # node_modules, dist
├── wrangler.toml         # Worker config + pages_build_output_dir=dist
├── worker.js             # Reverse proxy /blog/* -> pages.dev
├── css/
│   └── blog.css          # ~32 KB, 1:1 port of aiiaco Liquid Glass
├── images/               # 19 images copied from main aiiaco/client/public/images/
├── posts/
│   └── what-is-an-ai-revenue-system.html  # Seed pillar post
└── templates/
    ├── index.html        # Blog listing template
    └── post.html         # Individual post template
```

### build.js flow

1. `loadPosts()` reads every `.html` in `posts/`, parses `<!-- META ... -->` header, strips meta block, sorts newest-first
2. `buildPostPages()` wraps each post's body in `templates/post.html` via placeholder substitution: `{{TITLE}}`, `{{SLUG}}`, `{{META_DESCRIPTION}}`, `{{OG_IMAGE}}`, `{{CATEGORY}}`, `{{DATE_FORMATTED}}`, `{{DATE_ISO}}`, `{{READ_TIME}}`, `{{SUBTITLE}}`, `{{DIRECT_ANSWER}}`, `{{SCHEMA}}`, `{{CONTENT}}`, `{{RELATED_POSTS}}`, `{{YEAR}}`
3. `buildPostSchema()` emits BlogPosting + BreadcrumbList + FAQPage (auto-extracted from `<section class="faq-section">` H3/P pairs) JSON-LD
4. `buildIndexPage()` generates post card grid + Blog JSON-LD
5. `buildSitemap()` + `buildRss()` + `buildRobotsTxt()`
6. `copyAssets()` minifies CSS and copies images
7. `pingSitemap()` pings Google, Bing, IndexNow with latest URLs (skipped if `PING=false`)

Seed post author = Nemr Hallak. Publisher = AiiACo Organization. Schema `@id`s reference main aiiaco.com so knowledge graph is shared across the two sites.

### Design system port

css/blog.css is a direct port of `clients/aiiaco/aiiaco/client/src/index.css` lines 39-500. Same tokens:
- `--void: #03050A`, `--deep: #060B14`
- `--glass-dark: rgba(8,14,24,0.72)`, `--glass-border: rgba(255,255,255,0.10)`, `--glass-border-gold: rgba(184,156,74,0.28)`
- `--pearl: rgba(255,255,255,0.88)`, `--pearl-muted: rgba(210,220,235,0.72)`, `--pearl-dim: rgba(200,215,230,0.45)`
- `--gold: #B89C4A`, `--gold-bright: #D4A843`
- Typography: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`
- `.display-headline` = clamp(32px, 6vw, 80px), weight 700, letter-spacing -1.5px
- `.section-headline` = clamp(26px, 4vw, 52px), weight 700, letter-spacing -0.8px
- `.btn-gold` = linear-gradient 135deg rgba(184,156,74,0.95) -> rgba(212,168,67,0.80), radius 12px, weight 800

Navbar: Services / Method / Industries / Models / Blog (active) / Upgrade. Every link except Blog points to `https://aiiaco.com/...` absolute URLs. Blog stays relative `/blog/`.

Announce bar text matches exactly: "Operational Intelligence for Real Estate, Mortgage & Management Consulting."

Footer: 6 columns (Brand / Services / Solutions / Platform / Company) with identical copy word-for-word to the main site's Footer.tsx.

### Deployment via Cloudflare MCP

1. **Cloudflare Pages project created via API** (`mcp__cloudflare__execute`):
   - Endpoint: `POST /accounts/9ff5132f189939745601b8a00bcfb23b/pages/projects`
   - Body: `{ name: "aiiaco-blog", production_branch: "main" }`
   - Result: `{ id: "e8525ec4-6e64-4dae-aa27-0b151875f094", subdomain: "aiiaco-blog.pages.dev" }`
2. **Initial deployment via wrangler**:
   - `CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npx -y wrangler@latest pages deploy dist --project-name=aiiaco-blog --branch=main`
   - Uploaded 25 files in 3.59 seconds
   - Deployment preview URL: https://06c7e7a3.aiiaco-blog.pages.dev
3. **Verified live**: every route (/, /what-is-an-ai-revenue-system/, /sitemap.xml, /rss.xml, /css/blog.css, /images/logo-gold.webp) returns HTTP 200

### Cleanup in main aiiaco repo

After Round 5 shipped the static blog, deleted from the main aiiaco repo:
- `client/src/pages/BlogIndexPage.tsx`
- `client/src/pages/BlogPostPage.tsx`
- `client/src/data/blog.ts`
- `/blog` + `/blog/:slug` routes from `App.tsx` and `entry-server.tsx`
- BLOG_SLUGS array and routes from `scripts/prerender.mjs`
- 4 blog entries from `client/public/sitemap.xml`
- `/blog` entry from `client/src/seo/seo.config.ts` PAGE_META
- Added `aiiaco-blog/` to `clients/aiiaco/.gitignore` (it's a separate repo now, parent shouldn't track it)

Kept unchanged:
- Navbar "Blog" link (still points to `/blog/` - now served by static blog via Worker proxy)
- Footer "Blog & Insights" link

TypeScript clean after cleanup. 1437 lines deleted, 11 lines added.

### Round 5 git history

On `github.com/MonteKristoAI/aiiaco-blog`:
- 2 commits on `main`: initial blog + wrangler.toml pages_build_output_dir fix

On `github.com/MonteKristoAI/aiiaco`:
- `Round 5: remove React blog - replaced by static HTML blog at aiiaco-blog repo` (9 files, 1437 deletions)
- `Exclude aiiaco-blog subrepo from parent` (.gitignore update)

---

## Current live URLs (as of Apr 11 2026)

| URL | What | Status |
|---|---|---|
| https://aiiaco.com | Main site (Manus-hosted) | **Round 1 only** - all Round 2/3/4 work still pending Manus sync |
| https://aiiaco-blog.pages.dev | Static blog | **LIVE** (Cloudflare Pages, deployed via MCP + wrangler) |
| https://aiiaco.com/blog/* | Eventual blog URL | Requires Cloudflare Worker + aiiaco.com DNS on Cloudflare (blocked on Nemr) |

## Repos

| Repo | Purpose | Status |
|---|---|---|
| github.com/MonteKristoAI/aiiaco | Main engagement backup | Private, up-to-date through Round 5 |
| github.com/MonteKristoAI/aiiaco-blog | Static HTML blog source | Private, LIVE on Cloudflare Pages |
| github.com/10452/aiiaco.git | Nemr's Manus-linked repo | We have NO access. Blocked. |

## Cloudflare resources

| Resource | Value |
|---|---|
| Account ID | `9ff5132f189939745601b8a00bcfb23b` |
| Pages project | `aiiaco-blog` (id `e8525ec4-6e64-4dae-aa27-0b151875f094`) |
| Pages subdomain | `aiiaco-blog.pages.dev` |
| Worker project (not yet deployed) | `aiiaco-blog-proxy` (config in wrangler.toml) |
| Worker target route (after DNS migration) | `aiiaco.com/blog/*` |

## How to update the blog (follow-up rounds)

```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco-blog"
# Add a new post
vim posts/my-new-post.html  # with <!-- META --> header
# Build locally
PING=false node build.js
# Deploy to production
CLOUDFLARE_API_TOKEN="[from .mcp.json]" \
  CLOUDFLARE_ACCOUNT_ID="9ff5132f189939745601b8a00bcfb23b" \
  npx -y wrangler@latest pages deploy dist --project-name=aiiaco-blog --branch=main
# Commit + push source
git add . && git commit -m "Add post: my-new-post" && git push
```

## What's still blocked

1. **Manus sync** - Round 1/2/3/4 code still sitting in `clients/aiiaco/aiiaco/` working copy. Needs Nemr to grant GitHub collaborator access or ZIP upload. Not touched by Round 5.
2. **Cloudflare Worker for /blog/* proxy** - Requires aiiaco.com DNS on Cloudflare. Nemr action.
3. **GitHub auto-deploy for Pages** - Currently Direct Upload mode. Connecting to GitHub in Cloudflare dashboard (1-click) would enable auto-deploy on every push to main. Not done yet.

## Still-pending blog content

Round 5 shipped with only 1 seed post (`what-is-an-ai-revenue-system.html`). Round 4's data had 2 additional posts that weren't ported to HTML format yet:
- `how-to-integrate-ai-into-a-real-estate-crm` (how-to, 1000 words)
- `real-estate-brokerages-ai-mistakes` (opinion, 1100 words)

Those two posts are still in `git log` history of the main aiiaco repo (at commit e455091, then deleted at 77ff574). They can be recovered from git history when ready to port.

---

## Hard rules (unchanged across all rounds)

- **No em-dashes** anywhere in any deliverable
- **Brand casing**: `AiiAco` in marketing copy, `AiiACo` only in 3 JSON-LD `@name` fields
- **No outbound messages** to Nemr without Milan approval
- **ZERO AI tells** in public content
- **TypeScript must pass**: `cd clients/aiiaco/aiiaco && npx -y -p pnpm@10.15.1 pnpm run check`
- **Never touch**: `.manus/`, `client/public/__manus__/`, `client/public/agent/`
- **Blog updates** must not break visual match with main site - every CSS/template change should be visually verified against aiiaco.com Vite dev server
