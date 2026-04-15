# AiiAco Engagement

Private repository containing the full MonteKristo AI engagement with [aiiaco.com](https://aiiaco.com) — an enterprise AI integration consultancy founded by Nemr Hallak.

**This repo is a backup and working archive, not a deployment source.** The live aiiaco.com site is hosted on Manus AI, a proprietary platform we do not control directly.

## Entry point

**New to this repo?** Read [`state/00-READ-ME-FIRST.md`](state/00-READ-ME-FIRST.md) first. It gives a 30-second orientation and tells you which state files to read next.

## Folder map

| Folder | Contents |
|---|---|
| [`aiiaco/`](aiiaco/) | Working copy of the Manus source (Vite/React SPA). Round 1 + Round 2 SEO code fixes applied. 24 modified files. TypeScript clean. |
| [`state/`](state/) | 14 reference documents covering every aspect of the engagement: business context, tech stack, file inventory, critic findings, industry data, commands, next buckets, credentials, conversation log, pitfalls, deployment, schemas. |
| [`audit/`](audit/) | Three audit reports: master report, action plan, Round 2 change summary. |
| [`backups/`](backups/) | Tar.gz snapshot of all Round 2 modified files for disaster recovery. |
| [`schema/`](schema/) | Standalone JSON-LD schema blocks used as reference for page-specific dispatchers. |
| [`reports/`](reports/) | PDF audit reports and paged.js preview HTML. |
| [`cloudflare-worker/`](cloudflare-worker/) | Abandoned CF Worker prerender experiment. Kept for reference. Manus already serves pre-rendered HTML to bots, so this was not needed. |
| [`SESSION-STATE.md`](SESSION-STATE.md) | Legacy master state doc (67 KB). Superseded by `state/` folder but preserved for historical context. |
| [`CLIENT.md`](CLIENT.md) | Top-level client summary. |

## Status

- **Round 1**: COMPLETE. Round 1 critical bug fixes shipped.
- **Round 2**: CODE COMPLETE locally. NOT yet shipped to live aiiaco.com.
- **Blocker**: Manus sync path. See `state/12-DEPLOYMENT-MANUS-SYNC.md`.

## Hard rules

- **No em-dashes** anywhere (use hyphens, commas, or rewrite)
- **No outbound messages** to client without Milan's explicit approval
- **Brand casing**: `AiiAco` in marketing copy, `AiiACo` only in schema `@name` fields
- **No commits of** `.env`, `node_modules/`, or any token strings
- **TypeScript must pass**: `cd aiiaco && npx -y -p pnpm@10.15.1 pnpm run check`

## Private

This repository contains client business strategy, positioning decisions, and platform details. Do not share outside MonteKristo AI.
