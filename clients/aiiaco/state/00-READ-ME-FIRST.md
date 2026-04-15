# AiiAco — READ ME FIRST

You are resuming an in-progress SEO engagement for aiiaco.com. This file is the single entry point.

## 30-second orientation

- **Client**: aiiaco.com - Nemr Hallak, AI integration consultancy
- **Platform**: Manus AI (proprietary Vite/React SPA, we cannot deploy directly)
- **Working copy**: `clients/aiiaco/aiiaco/` (extracted from Manus ZIP)
- **Blog repo**: `clients/aiiaco/aiiaco-blog/` (separate static HTML site, **LIVE**)
- **Status**: **Round 1-4 code complete LOCALLY**, NOT YET SHIPPED to live aiiaco.com. **Round 5 static blog LIVE at https://aiiaco-blog.pages.dev**.
- **Blocker**: Manus sync path for main site (Rounds 1-4) - needs Nemr's input. Blog is unblocked and live.
- **Round 2 scope**: 24 files modified, 5 new service pages, industry data expansion, schema overhaul, brand consistency fixes, 67 critic bugs resolved
- **Round 3 scope**: Sitewide cleanup + infrastructure. Image pipeline (60MB→4MB WebP+AVIF), 278 AiiACo + 442 em-dash fixes across 73 files, 15 non-priority industries populated, internal linking architecture, schema enrichment, build hardening, React.lazy, accessibility, prerender SSR fix (3→41 routes). See `clients/aiiaco/audit/ROUND-3-CHANGES.md`.
- **Round 4 scope**: Deep SEO audit (`audit/ROUND-4-FINDINGS.md`) + critical fixes (25/25 meta tags in SERP range, FAQPage+HowTo+Article schemas added, image sitemap). Round 4 Phase 2 built TSX blog which was replaced in Round 5.
- **Round 5 scope**: Static HTML blog repo `MonteKristoAI/aiiaco-blog` following gummygurl-blog pattern. Cloudflare Pages deployed via MCP. 1:1 pixel-perfect port of aiiaco Liquid Glass CSS. TSX blog from Round 4 deleted from main repo. See `audit/ROUND-5-CHANGES.md` and `state/14-ROUND-3-4-5-SUMMARY.md`.

## Read order (do not skip)

1. **`14-ROUND-3-4-5-SUMMARY.md`** - THE most important file. Full summary of everything that happened after state/ was first written. Covers Rounds 3, 4, 5 with every decision, URL, repo, git commit, Cloudflare resource.
2. **`01-INDEX.md`** - Master index, NEVER DO / ALWAYS DO rules
3. **`02-BUSINESS-CONTEXT.md`** - Nemr's positioning brief, strategic pivots, locked decisions
4. **`04-FILE-INVENTORY.md`** - Every modified file with exact changes (Round 1+2 only; Round 3-5 in `14-*.md`)
5. **`12-DEPLOYMENT-MANUS-SYNC.md`** - How to ship Round 2-4 live (current blocker for main site)
6. **`08-NEXT-BUCKETS.md`** - What to work on next

Audit reports (read on demand):
- `clients/aiiaco/audit/ROUND-3-CHANGES.md` (308 lines, Round 3 full summary)
- `clients/aiiaco/audit/ROUND-4-FINDINGS.md` (290 lines, deep SEO audit)
- `clients/aiiaco/audit/ROUND-5-CHANGES.md` (Round 5 static blog ship log)

Everything else (`03`, `05`-`07`, `09`-`11`, `13`) is reference - read on demand.

## Hard rules (non-negotiable)

- **NO em-dashes** anywhere in deliverables. Use hyphens, commas, or rewrite. Banned character: `—`
- **NO outbound messages** (email/LinkedIn/chat) without explicit Milan approval. Draft → wait for "send it" → then send.
- **Brand casing**: `AiiAco` in marketing copy, `AiiACo` ONLY in schema `@name` fields (3 locations in index.html), NEVER `AiiA`.
- **Critic loop**: After any meaningful change, spawn adversarial critic subagent with "minimum 10 findings, be hostile" brief. Fix critical+high before moving on.
- **ZERO AI tells** in public content. Banned: "delve", "tapestry", "in the realm of", "it's important to note", "moreover"/"furthermore" without purpose.
- **TypeScript must pass**: `cd clients/aiiaco/aiiaco && npx -y -p pnpm@10.15.1 pnpm run check` → 0 errors before declaring done.

## Git remote

- **Repo**: https://github.com/MonteKristoAI/aiiaco (private)
- **Initialized**: 2026-04-11 with full engagement (source + state + audit + backups)
- **Remote is token-less** — git push uses credential helper / system keychain
- **Daily workflow**:
  ```bash
  cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"
  git status
  git add -p         # review hunks
  git commit -m "..."
  git push
  ```
- **Before any commit**: re-scan for leaked tokens
  ```bash
  git diff --cached | grep -E "ghp_[A-Za-z0-9]{20,}|cfat_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}" && echo "ABORT" || echo "clean"
  ```
- **Never commit**: `.env*`, `node_modules/`, token strings, Nemr's phone. The two files that had secrets (`state/09-ACCESS-CREDENTIALS.md` and `SESSION-STATE.md`) are scrubbed. If you ever need the real values, read `.mcp.json` at the MonteKristo AI project root.

## Disaster recovery

- **Round 2 source snapshot**: `clients/aiiaco/backups/round2-source-snapshot-2026-04-11.tar.gz` (62K, 24 files)
- If the working copy at `clients/aiiaco/aiiaco/` is corrupted, extract the snapshot: `tar -xzf clients/aiiaco/backups/round2-source-snapshot-2026-04-11.tar.gz -C clients/aiiaco/aiiaco/`
- The snapshot contains all Round 2 modified files: index.html, App.tsx, entry-server.tsx, seo/, industries.ts, 10 page files, public assets, prerender.mjs.
- **Off-site**: all of the above is mirrored at github.com/MonteKristoAI/aiiaco (private). `git clone` recovers the full engagement.

## Immediate next actions (pick one)

1. **Unblock Manus sync** → draft message to Nemr per `12-DEPLOYMENT-MANUS-SYNC.md`, get Milan approval, send, wait.
2. **Continue Bucket B (Round 3 cleanup)** → 242 `AiiACo` + 29 em-dashes in untouched components. Fully local work, no Nemr dependency.
3. **Start Bucket C (blog.aiiaco.com)** → Astro on Vercel, first 4 posts. Biggest long-term lever.

All three are detailed in `08-NEXT-BUCKETS.md`.

## What you (Claude) must NOT do

- Do not touch `.manus/`, `client/public/__manus__/`, `client/public/agent/`, or `vite-plugin-manus-runtime` imports
- Do not push to `github.com/10452/aiiaco.git` (we have no access)
- Do not send any message to Nemr without Milan's explicit approval
- Do not regenerate the 5 new service pages from scratch - they exist in the working copy and the backup snapshot
- Do not restart the critic loop from zero - Round 2 critic passes are logged in `05-CRITIC-FINDINGS.md`
