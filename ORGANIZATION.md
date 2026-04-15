# MonteKristo AI -- File Organization Rules

> **Purpose:** Every file in this folder must be in its correct location. No loose files at root. No orphan folders outside `clients/`. Claude detects violations and organizes automatically.

## Folder Structure (canonical)

```
MonteKristo AI/
├── CLAUDE.md                    ← CEO Agent (system file, stays at root)
├── AGENTS.md                    ← Codex instructions (system file, stays at root)
├── ORGANIZATION.md              ← This file (system file, stays at root)
├── .mcp.json                    ← MCP config (system file, stays at root)
│
├── clients/                     ← ALL client work lives here
│   ├── INDEX.md                 ← Client roster
│   └── {client-slug}/           ← One folder per client
│       ├── CLIENT.md            ← Client profile (REQUIRED)
│       ├── reports/             ← PDF reports (REQUIRED folder)
│       ├── website/             ← Website source code (if applicable)
│       ├── blog/                ← Blog repo (if applicable)
│       ├── assets/              ← Images, logos, screenshots, design files
│       ├── documents/           ← PDFs, docx, spreadsheets from/for client
│       ├── screenshots/         ← Screenshots of client's site/systems
│       └── state/               ← Engagement state files (if applicable)
│
├── Blog/                        ← Blog production sub-system (shared)
├── Logo/                        ← MonteKristo AI brand assets (shared)
├── n8n/                         ← n8n workflow architect (shared)
├── reports-engine/              ← PDF report generator (shared)
├── skills/                      ← Local skill modules (shared)
├── _internal/                   ← Internal MonteKristo files (shared)
├── autoloop/                    ← AutoLoop optimization system (shared)
├── docs/                        ← Superpowers plans and specs (shared)
└── .claude/                     ← Claude Code config (system)
```

## Rules

### Rule 1: No loose files at root

The ONLY files allowed at root level are:
- `CLAUDE.md`, `AGENTS.md`, `ORGANIZATION.md` (system docs)
- `.mcp.json`, `openai-costs.json` (system config)
- `.DS_Store` (macOS, ignored)

**Any other file at root is a violation.** It must be moved to `clients/{slug}/documents/` or `clients/{slug}/assets/` based on its type and content.

### Rule 2: No orphan project folders at root

The ONLY folders allowed at root level are:
- `clients/` -- all client work
- `Blog/` -- blog production sub-system
- `Logo/` -- MonteKristo brand assets
- `n8n/` -- workflow architect
- `reports-engine/` -- PDF generator
- `skills/` -- skill modules
- `_internal/` -- internal files
- `autoloop/` -- AutoLoop optimization system (programs, logs, proposals)
- `docs/` -- Superpowers plans and specs
- `.claude/`, `.claude-plugin/` -- system config

**Any other folder at root is a violation.** Website repos, blog repos, screenshot folders, app folders -- ALL go into `clients/{slug}/`.

### Rule 3: Every client folder must have CLIENT.md + reports/

Minimum required structure:
```
clients/{slug}/
├── CLIENT.md      ← REQUIRED
└── reports/       ← REQUIRED (even if empty)
```

A client folder without CLIENT.md is incomplete and must be fixed.

### Rule 4: No loose files in clients/ root

Only `INDEX.md` is allowed directly in `clients/`. All other files must be inside a client subfolder.

### Rule 5: File type routing

| File Type | Destination |
|-----------|-------------|
| `.pdf`, `.docx`, `.xlsx`, `.numbers`, `.csv` | `clients/{slug}/documents/` |
| `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`, `.gif` | `clients/{slug}/assets/` |
| `.html` (website code) | `clients/{slug}/website/` |
| Screenshots (named "Screenshot..." or in screenshot folders) | `clients/{slug}/screenshots/` |
| Reports (named "*report*" or "*performance*") | `clients/{slug}/reports/` |
| Blog repo contents | `clients/{slug}/blog/` |

### Rule 6: Client identification

When a file or folder needs to be moved, identify the client by:
1. **Filename contains client name** -- `CheckUps_by_PathFinder_Health...` -> reggierriley
2. **Folder name contains client reference** -- `LuxeShutters_website` -> luxeshutters
3. **Content inspection** -- read the file to identify which client it belongs to
4. **Ask user** -- if unclear, ask before moving

## Client Slug Mapping

| Client Name / Alias | Slug | Notes |
|---------------------|------|-------|
| LuxeShutters, Luxe | `luxeshutters` | Website, blog, CRM, voice agent |
| Pulse Performance, Pulse, Gym | `pulse-performance` | Voice SDR, GHL, ClubReady |
| AiiAco, aiiaco | `aiiaco` | SEO remediation, blog |
| BreathMastery, Dan Brule | `breathmastery` | Blog production |
| REIG Solar, reig | `reig-solar` | Blog production, HubSpot |
| GummyGurl, gummy | `gummygurl` | E-commerce, blog |
| Entourage Gummies, entourage | `entouragess` | Website, blog |
| SDS Systems, SDS, Warrior | `sds` | Website, content |
| LRMB, AiiA app | `lrmb` | Field ops app |
| Reggie Riley, PathFinder Health, CheckUps | `reggierriley` | Outbound |
| SunRaise Capital, Sunrise | `sunraise-capital` | Website, voice agent |
| ProjectPro, CDK | `projectpro` | Meta Ads (inactive) |
| EdgeWork, AV Bova, Anthony Bova | `edgework` | Outbound, events |
| DeployPros | `deploypros` | Demo website |
| Nomads International | `nomads-international` | Demo website |
| AlumAlco | `alumalco` | Demo website |
| Wurqly | `wurqly` | Demo website |
| Sol Siren, Sol Siren Design | `sol-siren` | Demo website |
| Totally Mushrooms | `totallymushrooms` | Demo website |
| Lord Nelson Charters | `lordnelsoncharters` | Demo website |
| SmartGrid Integrations | `smartgrid` | Demo website |
| GetStuffDone, GSD | `getstuffdone` | Demo/prospect website |
| Mind.Share | `mindshare` | Event (Genericki mejlovi za sponzore) |

## Violation Detection (for hook)

Scan for these conditions:
1. Files at `MonteKristo AI/` root that aren't in the allowed list
2. Folders at `MonteKristo AI/` root that aren't in the allowed list
3. Files at `clients/` root that aren't INDEX.md
4. Client folders missing CLIENT.md
5. Client folders missing reports/ directory
