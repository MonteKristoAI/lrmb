# AiiAco — Tech Stack and Platform

## Overview

AiiAco is a **Vite + React 19 SPA** built on the **Manus AI** website builder platform. Manus is a proprietary AI-assisted site builder that:
- Lets users chat with an AI agent to build React components
- Exposes a GitHub mirror of the generated code (private, auto-account per project)
- Hosts the site on their infrastructure with Cloudflare CDN
- Does **dynamic rendering** at the edge: serves pre-rendered HTML to bot user-agents, SPA shell to browsers
- Provides ZIP download of the full project source

## Exact versions (from package.json)

### Core framework
- `react`: `^19.2.1`
- `react-dom`: `^19.2.1`
- `vite`: `^7.1.7`
- `typescript`: `5.9.3`
- `@types/react`: `^19.2.1`
- `@types/react-dom`: `^19.2.1`
- `@vitejs/plugin-react`: `^5.0.4`

### Routing
- `wouter`: `^3.3.5` (+ patch to wouter@3.7.1 via pnpm patchedDependencies)
- Uses `memoryLocation` for SSR, `useBrowserLocation` (default) for client

### SEO / head management
- `react-helmet-async`: `^2.0.5`
- Important: v2 SSR requires text children in script tags, NOT dangerouslySetInnerHTML

### Animations
- `framer-motion`: `^12.23.22`
- Note: `MotionConfig reducedMotion="always"` does NOT override `initial` prop in v12. Fix lives in prerender post-processor.

### Styling
- `tailwindcss`: `^4.1.14`
- `@tailwindcss/vite`: `^4.1.3`
- `tailwind-merge`: `^3.3.1`
- `tailwindcss-animate`: `^1.0.7`
- `class-variance-authority`: `^0.7.1`

### UI primitives (Radix UI)
- `@radix-ui/react-accordion`, `-alert-dialog`, `-aspect-ratio`, `-avatar`, `-checkbox`, `-collapsible`, `-context-menu`, `-dialog`, `-dropdown-menu`, `-hover-card`, `-label`, `-menubar`, `-navigation-menu`, `-popover`, `-progress`, `-radio-group`, `-scroll-area`, `-select`, `-separator`, `-slider`, `-slot`, `-switch`, `-tabs`, `-toggle`, `-toggle-group`, `-tooltip`

### Other client
- `@tanstack/react-query`: `^5.90.2`
- `react-helmet-async`: `^2.0.5`
- `sonner`: `^2.0.7` (toast notifications)
- `lucide-react`: `^0.453.0` (icons)
- `embla-carousel-react`: `^8.6.0`
- `cmdk`: `^1.1.1`
- `input-otp`: `^1.4.2`
- `vaul`: `^1.1.2`
- `react-hook-form`: `^7.64.0`
- `@hookform/resolvers`: `^5.2.2`
- `zod`: `^4.1.12`
- `date-fns`: `^4.1.0`
- `react-day-picker`: `^9.11.1`
- `react-resizable-panels`: `^3.0.6`
- `recharts`: `^2.15.2`
- `streamdown`: `^1.4.0`
- `next-themes`: `^0.4.6`

### Server (backend, not touched by us)
- `express`: `^4.21.2`
- `tsx`: `^4.19.1` (dev runtime)
- `esbuild`: `^0.25.0` (build bundler for server)
- `drizzle-orm`: `^0.44.5`
- `drizzle-kit`: `^0.31.4`
- `mysql2`: `^3.15.0`
- `@trpc/client` / `@trpc/server` / `@trpc/react-query`: `^11.6.0`
- `bcryptjs`: `^3.0.3`
- `jose`: `6.1.0` (JWT)
- `cookie`: `^1.0.2`
- `axios`: `^1.12.0`
- `stripe`: `^22.0.0`
- `resend`: `^6.9.3` (transactional email)
- `svix`: `^1.88.0`
- `@aws-sdk/client-s3` / `@aws-sdk/s3-request-presigner`: `^3.693.0`
- `superjson`: `^1.13.3`
- `nanoid`: `^5.1.5`

### Voice/AI integrations (not our concern, do not touch)
- `@11labs/react`: `^0.2.0`
- `@elevenlabs/client`: `^0.15.1`

### Build devtools
- `@builder.io/vite-plugin-jsx-loc`: `^0.1.1`
- `vite-plugin-manus-runtime`: `^0.0.57` (Manus-specific runtime plugin, DO NOT remove)
- `vite-plugin-prerender`: `^1.0.8`
- `vitest`: `^2.1.4`
- `postcss`: `^8.4.47`
- `autoprefixer`: `^10.4.20`
- `prettier`: `^3.6.2`
- `tw-animate-css`: `^1.4.0`

### Package manager
- `pnpm`: `10.4.1+sha512...` (pinned in `packageManager` field)
- Patched: `wouter@3.7.1` via `patches/wouter@3.7.1.patch`
- `onlyBuiltDependencies: ["puppeteer"]` - puppeteer post-install will hang unless `--ignore-scripts` used

## Build pipeline

### Scripts in package.json
```json
"dev": "NODE_ENV=development tsx watch server/_core/index.ts",
"build:vite": "vite build",
"build:ssr": "vite build --config vite.ssr.config.ts",
"prerender": "node scripts/prerender.mjs",
"build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
"start": "NODE_ENV=production node dist/index.js",
"check": "tsc --noEmit",
"format": "prettier --write .",
"test": "vitest run",
"db:push": "drizzle-kit generate && drizzle-kit migrate"
```

### Full production build sequence
1. `pnpm build:vite` - standard Vite client build produces `dist/public/index.html` and asset chunks
2. `pnpm build:ssr` - Vite SSR build produces `dist/server-entry.js` from `client/src/entry-server.tsx`
3. `pnpm prerender` - runs `scripts/prerender.mjs`:
   - Loads `dist/public/index.html` as clean shell
   - Dynamically imports `dist/server-entry.js` and its `renderRoute` export
   - Iterates `ROUTES` array (25 static + 20 industry slugs = 45 routes)
   - For each route:
     - Calls `renderRoute(url)` → returns `{ html, helmetContext }`
     - Runs `makeFramerContentVisible(html)` post-processor on the rendered HTML
     - Injects `<div id="root">${html}</div>` into shell copy
     - Assembles helmet head tags (title/meta/link/script/style/noscript)
     - Strips shell `<title>` ONLY if helmet emitted its own
     - Writes to `dist/public/{route}/index.html`
4. `pnpm build` - full pipeline including server bundle

### Our working copy state
We have `dist/` unbuilt. We don't need to build locally - Manus runs the build on their side when we sync source code. Our only local verification is `tsc --noEmit` (via `pnpm run check`).

## Manus platform behavior

### Dynamic rendering (key finding, verified empirically)
Manus serves **pre-rendered HTML** to bot user-agents at the edge. Verified with 11 bot UAs via curl:

```bash
test_ua() {
  curl -s -A "$1" https://aiiaco.com/ai-integration | grep -c "Business Intelligence Audit"
}
test_ua "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"      # → 1 (has content)
test_ua "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)"        # → 1
test_ua "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2"     # → 1
test_ua "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0"  # → 1
test_ua "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot"  # → 1
test_ua "Mozilla/5.0 (compatible; OAI-SearchBot/1.0)"                                     # → 1
test_ua "Mozilla/5.0 (compatible; ChatGPT-User/1.0)"                                      # → 1
test_ua "Mozilla/5.0 (compatible; Google-Extended/1.0)"                                   # → 1
test_ua "Mozilla/5.0 (Applebot/0.1; +http://www.apple.com/go/applebot)"                   # → 1
test_ua "Mozilla/5.0 (compatible; Perplexity-User/1.0)"                                   # → 1
test_ua "Mozilla/5.0 (compatible; Claude-Web/1.0)"                                        # → 0 (gets SPA shell)
test_ua "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"              # → 0 (regular browser)
```

10 of 11 bots get the 78KB pre-rendered HTML. Only "Claude-Web" (deprecated Anthropic UA) and regular browsers get the SPA. This means our SEO work via source code changes WILL reach Googlebot/GPTBot/ClaudeBot/PerplexityBot once synced.

### CDN / hosting
- Manus uses **Amazon CloudFront** (`d2xsxph8kpxj0f.cloudfront.net`) for static assets
- Origin server IPs resolve to Cloudflare (104.18.x.x) - Manus uses Cloudflare as a CDN layer
- Manus domain for images: `files.manuscdn.com`
- Manus runtime script: `files.manuscdn.com/manus-space-dispatcher/spaceEditor-*.js` (editor overlay, blocked in robots)
- Analytics: `manus-analytics.com/umami` (Manus's own analytics, separate from GA4)

### DNS
- Nameservers: `dns1.registrar-servers.com`, `dns2.registrar-servers.com` (Namecheap DNS)
- Registrar: Namecheap (Nemr owns)
- MX: `smtp.google.com` (Google Workspace for @aiiaco.com)
- SPF: `v=spf1 include:amazonses.com ~all` (Amazon SES backup)
- Google site verification: `google-site-verification=rQhG20ir4L3rfJPxhDhpVbp7bnXqndozBDB1dpyL2ps`
- DMARC: `v=DMARC1; p=none; rua=mailto:dmarc@aiiaco.com`

### GitHub mirror
- URL: `https://github.com/10452/aiiaco.git`
- Owner: `10452` (Manus auto-generated GitHub account, 0 public repos, 0 followers)
- Visibility: Private
- Our push access: NONE (our MonteKristoAI token cannot access this repo)
- Sync direction: Manus pushes to this repo as code changes; we cannot push back directly

### ZIP export
Manus UI has `... > Download as ZIP` in the project settings. The ZIP contains the complete source (client, scripts, server, shared, package.json, etc.) minus `node_modules` and `dist`.

### Known Manus files to NEVER touch
- `client/public/__manus__/` - Manus runtime overlay
- `client/public/agent/` - Retell voice agent config
- `.manus/` - Manus project metadata
- `vite-plugin-manus-runtime` - dev plugin that injects Manus editor overlay in dev mode

## Design system

### Color palette (from `client/src/index.css`)
- Background: `#03050A` (deep void black)
- Background gradients: `linear-gradient(180deg, #050810 0%, #070c14 60%, #050810 100%)`
- Gold accent: `#D4A843` (bright) / `#B89C4A` (deep) / `rgba(184,156,74,0.85)` (muted)
- Text primary: `rgba(255,255,255,0.92)` / `rgba(255,255,255,0.95)`
- Text secondary: `rgba(200,215,230,0.70)` / `rgba(200,215,230,0.60)`
- Text tertiary: `rgba(200,215,230,0.50)` / `rgba(200,215,230,0.40)`
- Card background: `rgba(255,255,255,0.025)` / `rgba(255,255,255,0.03)`
- Card border: `rgba(255,255,255,0.07)` / `rgba(255,255,255,0.08)`
- Gold card background: `rgba(184,156,74,0.04)`
- Gold card border: `rgba(184,156,74,0.12)` / `rgba(184,156,74,0.22)`

### Typography
- Display font: SF Pro Display (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif`)
- Body font: SF Pro Text (`-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`)
- H1 headline: `clamp(32px, 5vw, 56px)` bold, letter-spacing `-0.02em`
- H2 section: `clamp(26px, 3.5vw, 38px)` bold, letter-spacing `-0.02em`
- Body: `clamp(14px, 1.3vw, 15px)` to `17px`, line-height `1.7`

### Custom Tailwind/CSS classes (defined in `client/src/index.css`)
- `.display-headline` - large display heading
- `.section-headline` - mid-level H2
- `.gold-line` - gold gradient underline span
- `.accent` - gold accent text
- `.btn-gold` - primary gold button
- `.gold-divider` - small gold horizontal divider (48px x 2px gradient)
- `.container` - max-width wrapper with horizontal padding
- `.gold-text` - gold foreground color text
- `.glass-card` - glass-morphism card background

### Framer Motion fade variant (used everywhere)
```ts
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
```

Usage pattern on hero sections:
```tsx
<motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
  <motion.div variants={fade}>...</motion.div>
  <motion.h1 variants={fade}>...</motion.h1>
  <motion.p variants={fade}>...</motion.p>
</motion.div>
```

Usage pattern on below-fold sections:
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.07, duration: 0.5 }}
>
  ...
</motion.div>
```

### Why Framer Motion matters for SEO
The hero `initial={{ opacity: 0, y: 24 }}` renders `style="opacity:0; transform:translateY(24px)"` in the SSR HTML snapshot. Googlebot's renderer captures the first frame, so hero content is invisible in the bot screenshot even though the text is in the DOM. Google uses screenshots for some ranking signals (AI Overviews, visual understanding).

**Fix**: `scripts/prerender.mjs` has a scoped post-processor (`makeFramerContentVisible`) that rewrites `opacity:0` + `translate{X|Y}(...)` to `opacity:1` + `transform:none` ONLY when both appear in the same style attribute. This catches Framer Motion initial states without breaking static layout transforms (badge centering, progress bars).

## TypeScript config (do not change)

`tsconfig.json`:
- Strict mode enabled
- Path aliases: `@/*` maps to `client/src/*`
- JSX: `react-jsx` (React 19)
- Target: ES2022
- `noEmit: true` for check script

## Vite config notes

- `vite.config.ts` - client build config
- `vite.ssr.config.ts` - SSR build config (separate entry)
- Both configs include `vite-plugin-manus-runtime` - do NOT remove this plugin or Manus previews break

## File tree (relevant parts, simplified)

```
clients/aiiaco/aiiaco/
├── .manus/               ← Manus metadata (do not touch)
├── client/
│   ├── index.html        ← Static HTML shell (MODIFIED)
│   ├── public/
│   │   ├── __manus__/    ← Manus runtime overlay (do not touch)
│   │   ├── agent/        ← Retell agent assets (do not touch)
│   │   ├── _redirects    ← SPA fallback (NOT modified)
│   │   ├── robots.txt    ← MODIFIED
│   │   ├── sitemap.xml   ← MODIFIED
│   │   ├── llms.txt      ← MODIFIED
│   │   ├── about.txt     ← MODIFIED
│   │   └── favicon-*.png ← Not touched
│   └── src/
│       ├── main.tsx      ← NOT touched
│       ├── App.tsx       ← MODIFIED
│       ├── entry-server.tsx ← MODIFIED
│       ├── index.css     ← NOT touched (has design system classes)
│       ├── const.ts      ← NOT touched (has CALENDLY_URL, API endpoints)
│       ├── _core/        ← Core infra (not touched)
│       ├── components/   ← 30+ components, Round 2 did NOT touch
│       ├── contexts/     ← ThemeContext (not touched)
│       ├── data/
│       │   └── industries.ts ← MODIFIED (interface + 20 entries)
│       ├── hooks/        ← not touched
│       ├── lib/          ← not touched
│       ├── pages/        ← 30+ pages, 5 new + 3 modified
│       │   ├── AIRevenueEnginePage.tsx      ← CREATED
│       │   ├── AICrmIntegrationPage.tsx     ← CREATED
│       │   ├── AIWorkflowAutomationPage.tsx ← CREATED
│       │   ├── AIForRealEstatePage.tsx      ← CREATED
│       │   ├── AIForVacationRentalsPage.tsx ← CREATED
│       │   ├── IndustryMicrosite.tsx        ← MODIFIED
│       │   ├── Home.tsx                      ← MODIFIED
│       │   └── NotFound.tsx                  ← REWRITTEN
│       └── seo/
│           ├── SEO.tsx                       ← MODIFIED
│           ├── SEOProvider.tsx               ← not touched
│           ├── seo.config.ts                 ← MODIFIED
│           ├── StructuredData.tsx            ← REWRITTEN
│           ├── StructuredDataSSR.tsx         ← REWRITTEN
│           └── NoindexRoute.tsx              ← CREATED
├── scripts/
│   └── prerender.mjs     ← MODIFIED (post-processor + 5 routes)
├── server/               ← Backend, not touched
├── shared/               ← Shared types, not touched
├── drizzle/              ← DB schema, not touched
├── patches/              ← wouter patch, not touched
├── knowledge-extraction/ ← Not touched
├── package.json          ← Not touched
├── pnpm-lock.yaml        ← Not touched
├── tsconfig.json         ← Not touched
├── vite.config.ts        ← Not touched
└── vite.ssr.config.ts    ← Not touched
```

## pnpm specifics

### Install command (with Puppeteer workaround)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm install --ignore-scripts
```

The `--ignore-scripts` flag is critical. Without it, puppeteer post-install downloads Chrome and can hang or fail. We don't need puppeteer for anything we do (TypeScript check, grep, edits).

### Run check
```bash
npx -y -p pnpm@10.15.1 pnpm run check
```

### Why `npx -y -p pnpm@10.15.1` prefix
The user doesn't have pnpm installed globally. This invocation downloads pnpm temporarily via npx. We use 10.15.1 specifically to avoid version drift.
