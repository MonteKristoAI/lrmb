# Claude Code + OpenAI Codex — Synergy Plan

**Date**: 2026-04-02
**Status**: Ready for implementation
**Author**: MonteKristo AI

---

## 1. Executive Summary

Claude Code i OpenAI Codex su komplementarni alati sa različitim snagama. Optimalna strategija: **Claude Code kao primarni "architect" agent**, **Codex kao "reviewer + parallel worker"**. Ovo daje best-of-both-worlds setup gde Claude piše i refaktoruje kod, a Codex automatski recenzira, lovi bugove, i radi paralelne taskove.

---

## 2. Oba Alata — Tehničke Specifikacije

### Claude Code (Trenutni Primary)
- **Model**: Claude Opus 4.6 (1M context)
- **Snage**: Duboko rezonovanje, multi-file refactoring, MCP ekosistem (17 servera), kompleksni taskovi
- **SWE-bench**: 80.8% (best za complex reasoning)
- **Pricing**: ~$20/mesec (Max plan) + API per-token
- **MCP**: Potpuna podrška — `.mcp.json` konfiguracija
- **Lokacija**: Terminal-first, IDE ekstenzije, web app

### OpenAI Codex
- **Model**: GPT-5.3-Codex (cloud) / GPT-5.4 (CLI)
- **Snage**: Brz, token-efikasan (3x manje tokena po tasku), odličan za code review, terminal debugging
- **Terminal-Bench 2.0**: 77.3% (best za structured debugging)
- **Pricing**: Plus $20/mo, Pro $200/mo, API ~$1.50/1M input + $6/1M output
- **MCP**: Potpuna podrška — `config.toml` konfiguracija
- **Lokacija**: CLI, desktop app, cloud agent, GitHub integration

### Ključne Razlike

| Dimenzija | Claude Code | Codex |
|-----------|-------------|-------|
| Filozofija | "Measure twice, cut once" | "Move fast, iterate" |
| Best za | Complex reasoning, multi-file refactoring | Speed, code review, parallel tasks |
| Token efikasnost | Standardna | ~3x efikasniji |
| MCP ekosistem | 17 servera konfigurisano | Treba setup |
| GitHub native | Via MCP server | Native @codex review na PR |
| Context window | 1M tokena | Veliki ali manji |
| AGENTS.md/CLAUDE.md | CLAUDE.md | AGENTS.md (ekvivalent) |

---

## 3. Sinergija Arhitektura — "Architect + Reviewer" Model

```
┌─────────────────────────────────────────────────────────┐
│                    DEVELOPER (Milan)                     │
│                                                          │
│  ┌──────────────┐          ┌──────────────────────┐     │
│  │  Claude Code  │◄────────►│    OpenAI Codex CLI   │    │
│  │  (Architect)  │          │    (Fast Worker)      │    │
│  │               │          │                       │    │
│  │ • Write code  │          │ • Code review         │    │
│  │ • Refactor    │          │ • Bug fixes (simple)  │    │
│  │ • Complex     │          │ • Test generation     │    │
│  │   multi-file  │          │ • Parallel tasks      │    │
│  │ • Blog/SEO    │          │ • Terminal debugging   │    │
│  │ • MCP tools   │          │ • Quick prototypes    │    │
│  └──────┬───────┘          └──────────┬────────────┘    │
│         │                              │                 │
│         └──────────┬───────────────────┘                 │
│                    │                                     │
│         ┌──────────▼──────────┐                         │
│         │     GitHub Repo      │                         │
│         │                      │                         │
│         │  @codex review ◄─── Auto PR Review            │
│         │  Codex GitHub Action  ◄─── CI/CD Pipeline     │
│         │  Claude Code commits  ───► Codex validates    │
│         └──────────────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

### Task Routing Strategy

| Task Type | Primary Agent | Why |
|-----------|--------------|-----|
| **Novi feature (complex)** | Claude Code | Duboko rezonovanje, multi-file |
| **Bug fix (simple, scoped)** | Codex CLI | Brži, manje tokena |
| **Code review** | Codex (GitHub) | Native @codex review, auto-review |
| **Refactoring (large)** | Claude Code | Bolje razumevanje codebase-a |
| **Test writing** | Codex CLI | Brz, pattern-based |
| **Terminal debugging** | Codex CLI | Terminal-Bench 77.3% |
| **Blog/SEO/Content** | Claude Code | MCP ekosistem, skills |
| **n8n workflows** | Claude Code | n8n-mcp server, domain knowledge |
| **Client work (GHL, Retell)** | Claude Code | MCP serveri, CLAUDE.md kontekst |
| **Quick prototype** | Codex CLI (full-auto) | Brz, iterativan |
| **CI/CD automated checks** | Codex GitHub Action | Native integration |
| **Documentation** | Codex CLI | Brz za rutinski rad |

---

## 4. Implementation Plan — 4 Faze

### Faza 1: Foundation Setup (Dan 1)

#### 1.1 Instaliraj Codex CLI
```bash
npm i -g @openai/codex
```

#### 1.2 Instaliraj GitHub CLI
```bash
brew install gh
gh auth login
```

#### 1.3 Kreiraj Codex Config
Fajl: `~/.codex/config.toml`
```toml
# === Model & Reasoning ===
model = "gpt-5.4"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

# === Personality ===
personality = "pragmatic"

# === Web Search ===
web_search = "cached"

# === MCP Servers (shared with Claude Code where possible) ===

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_YOUR_TOKEN" }

[mcp_servers.firecrawl]
command = "npx"
args = ["-y", "firecrawl-mcp"]
env = { FIRECRAWL_API_KEY = "fc-YOUR_KEY" }

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

#### 1.4 Kreiraj AGENTS.md za Codex
Za svaki repo gde Codex treba da radi, kreiraj `AGENTS.md`:
```markdown
# Codex Agent Instructions

## Review Guidelines
- Flag security vulnerabilities (OWASP Top 10)
- Check for hardcoded secrets/API keys
- Verify error handling on all external API calls
- Flag unused imports and dead code
- Ensure TypeScript strict mode compliance

## Code Style
- Use functional components in React
- Prefer const over let
- Use meaningful variable names (no single letters except loop vars)
- Max function length: 50 lines

## MonteKristo AI Standards
- Brand colors: #FF5C5C (accent), #041122 (primary), #FAF8F4 (bg)
- All public content must pass AI-detection quality gate
- No console.log in production code
```

---

### Faza 2: GitHub Integration (Dan 2-3)

#### 2.1 Setup Codex Cloud za Code Review

1. Idi na codex.openai.com (ili ChatGPT → Codex)
2. Poveži GitHub account
3. Dodaj repozitorijume:
   - `LuxeShutters_website`
   - Bilo koji drugi aktivan repo
4. Uključi "Automatic Reviews" za sve PR-ove

#### 2.2 Setup Codex GitHub Action za CI/CD

Kreiraj `.github/workflows/codex-review.yml`:
```yaml
name: Codex Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Fetch base and head
        run: |
          git fetch origin ${{ github.event.pull_request.base.ref }}
          git fetch origin ${{ github.event.pull_request.head.ref }}

      - name: Codex Review
        id: codex
        uses: openai/codex-action@v1
        with:
          prompt-file: .github/codex/prompts/review.md
          sandbox: workspace-write
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const output = `${{ steps.codex.outputs.final-message }}`;
            if (output && output.trim()) {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: `## 🔍 Codex Review\n\n${output}`
              });
            }
```

#### 2.3 Kreiraj Review Prompt

Fajl: `.github/codex/prompts/review.md`
```markdown
Review this pull request. Focus on:

1. **Security**: API keys, injection vulnerabilities, auth issues
2. **Performance**: N+1 queries, unnecessary re-renders, memory leaks
3. **Logic errors**: Edge cases, null checks, race conditions
4. **Style**: Consistency with existing codebase patterns
5. **Tests**: Are changes adequately tested?

Output format:
- P0 (must fix): Critical security/logic issues
- P1 (should fix): Performance/reliability concerns
- P2 (nice to have): Style/cleanup suggestions

Be concise. Only flag real issues, not style nitpicks.
```

---

### Faza 3: Dual-Agent Workflow (Dan 4-5)

#### 3.1 Workflow: Claude Code Piše → Codex Reviewira

```
1. Claude Code piše feature/fix u terminalu
2. Claude Code commituje na feature branch
3. Claude Code kreira PR via GitHub MCP
4. Codex GitHub Action automatski reviewira PR
5. @codex review za dodatnu duboku analizu
6. Fix issues → merge
```

#### 3.2 Workflow: Codex za Quick Parallel Tasks

```
# Terminal 1: Claude Code radi na feature-u
claude "Implement new contact form for LuxeShutters"

# Terminal 2: Codex radi paralelno na testovima
codex "Write unit tests for the contact form component"

# Terminal 3: Codex radi na dokumentaciji
codex "Update README with new contact form API docs"
```

#### 3.3 Workflow: Codex Code Review Pre Commita

```bash
# U Claude Code terminalu, pre commita:
codex "Review the staged changes for security issues and bugs"

# Ili direktno:
codex review  # built-in review command
```

#### 3.4 Shared MCP Servers

Oba alata podržavaju MCP. Serveri koji treba da budu u oba:

| MCP Server | Claude Code (.mcp.json) | Codex (config.toml) | Purpose |
|------------|------------------------|---------------------|---------|
| github | ✅ Konfigurisano | ⬜ Dodati | Repo management |
| firecrawl | ✅ Konfigurisano | ⬜ Dodati | Web scraping |
| context7 | ❌ | ⬜ Dodati | Dev docs lookup |

**Nota**: Codex NE treba sve 17 Claude Code MCP servera. Codex je za kodiranje — treba mu samo: github, firecrawl, context7. Klijent-specifični serveri (GHL, Retell, n8n, Airtable, WordPress) ostaju ekskluzivno u Claude Code.

---

### Faza 4: n8n Automation Layer (Opciono, Dan 6+)

#### 4.1 n8n Workflow: Auto-Fix Failing CI

```
Trigger: GitHub Webhook (CI failed)
  → Code node: Parse error logs
  → HTTP Request: Call Codex API to suggest fix
  → IF: Fix confidence > 80%
    → GitHub: Create PR with fix
    → Slack/Email: Notify developer
  → ELSE:
    → Slack/Email: Alert developer with error context
```

#### 4.2 n8n Workflow: Daily Code Health Check

```
Trigger: Cron (daily 9am)
  → GitHub: Get recent commits
  → HTTP Request: Codex review via API
  → IF: Issues found
    → GitHub: Create issue with findings
    → Notification: Alert team
```

---

## 5. Cost Optimization

### Preporučeni Plan

| Tool | Plan | Mesečni trošak | Šta dobijaš |
|------|------|----------------|-------------|
| Claude Code | Max ($20/mo) + API usage | ~$50-100/mo | Primary agent, MCP, deep reasoning |
| Codex | Plus ($20/mo) | $20/mo | Code review, quick tasks, GitHub |
| **Total** | | **~$70-120/mo** | Full dual-agent setup |

### Token Savings Strategy

- Codex koristi ~3x manje tokena po tasku → koristi ga za rutinske taskove
- Claude Code za complex work gde kvalitet > brzina
- GitHub Action: Pay-per-use, ~$0.05 po review → minimalni trošak

---

## 6. Per-Project Config Templates

### LuxeShutters Website (React + Vite)

`.codex/config.toml` u repo root-u:
```toml
model = "gpt-5.3-codex"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

`AGENTS.md`:
```markdown
# LuxeShutters Website — Codex Agent

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- TypeScript strict mode

## Brand Standards
- Primary: #041122, Accent: #FF5C5C, Background: #FAF8F4
- Fonts: Poppins (headings), Inter (body)

## Review Guidelines
- No inline styles — use Tailwind classes
- All components must be functional (no class components)
- Images must have alt text
- No hardcoded strings — use constants
- Check responsive design (mobile-first)
```

### MonteKristo AI (Master Repo)

`.codex/config.toml`:
```toml
model = "gpt-5.4"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_TOKEN" }
```

---

## 7. Daily Workflow — How It Looks

```
JUTRO:
├── Otvori Claude Code → čita CLAUDE.md, vault, memory
├── Plan dana: šta treba za koje klijente
└── Complex tasks → Claude Code radi

TOKOM DANA:
├── Claude Code: Feature development, blog, automations
├── Codex CLI (parallel terminal): Quick fixes, tests, docs
├── @codex review: Automatski na svakom PR-u
└── Codex GitHub Action: CI/CD quality gate

PRED KRAJ:
├── Claude Code: Final commits, PR creation
├── Codex: Auto-review svih PR-ova
└── Claude Code: Daily note u vault
```

---

## 8. Komande Za Brz Početak

```bash
# 1. Install
npm i -g @openai/codex
brew install gh

# 2. Auth
codex  # First run → auth prompt
gh auth login

# 3. Test Codex
cd ~/Desktop/MonteKristo\ AI/LuxeShutters_website
codex "List all React components and their props"

# 4. Test Review
codex review  # Reviews current staged changes

# 5. Test Full Auto
codex --approval-mode full-auto "Fix all TypeScript errors in src/"
```

---

## 9. Kada NE Koristiti Codex

- **Nikad** za klijent-specifične MCP taskove (GHL, Retell, n8n, WordPress)
- **Nikad** za blog pisanje (Claude Code ima 23 blog skilla)
- **Nikad** za SEO audit (Claude Code ima 20 SEO skillova)
- **Nikad** za Obsidian vault operacije
- **Nikad** za Google Workspace integracije
- **Nikad** za Airtable/Supabase operacije

Codex = **kod + review + speed**. Claude Code = **sve ostalo + complex code**.

---

## 10. Rizici i Mitigacije

| Rizik | Mitigacija |
|-------|-----------|
| Oba agenta menjaju isti fajl | Git branching — svaki agent na svom branchu |
| Codex napravi breaking change | GitHub Action review + test suite gate |
| Token troškovi eskaliraju | Monitor usage, Codex za rutinu (3x jeftiniji) |
| AGENTS.md i CLAUDE.md out of sync | Održavaj oba iz istog source-of-truth |
| Codex nema kontekst o klijentima | Ne koristiti za klijent-specifično — samo kod |
