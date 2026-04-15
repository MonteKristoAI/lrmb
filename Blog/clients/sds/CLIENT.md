# Scientific Data Systems (SDS / Warrior) — Blog Client Overview

## Who They Are

Scientific Data Systems, Inc. is a 34-year-old Houston-based manufacturer of the **Warrior** wireline data acquisition and control platform. Their 2026 flagship launch is the **Warrior Universal Panel** (ULPP) — a consolidated surface unit that runs multiple switches, tool strings, and surface systems from a single command point. SDS is **vendor-agnostic by architecture**: Warrior runs approximately 60% of open-hole tools, 85% of cased-hole tools, and 90% of addressable switches across manufacturers. One of the "big four" wireline majors — **Weatherford International** — distributes the Warrior panel through its own catalog, providing rare third-party validation of the open-platform claim.

SDS serves oil and gas, geothermal, water well, environmental, and mining operations worldwide. The blog reinforces a May 5, 2026 product launch event and builds long-term authority in wireline acquisition, perforating automation, and the geothermal transition.

## Niche

Vendor-agnostic wireline data acquisition hardware and software for oilfield, geothermal, and related subsurface operations.

## Target Audience

9 specific buyer personas (full detail in `PERSONAS.md`). Primary personas for blog content:
- **Field Service Manager (FSM)** at wireline service companies running perforating and logging crews
- **Perforating Engineer ("The Shooter")** running stage-by-stage operations in the Permian, Eagle Ford, Marcellus, Bakken
- **Electronics Technician / Technology Manager** at service company shops
- **Service Company Leader** (VP Ops, Owner) making fleet capex decisions
- **Operator Completion Engineer** specifying wireline services

**Common characteristics:**
- Petroleum, chemical, or electrical engineering background
- 5-30+ years in oilfield services
- Work in Houston, Odessa, Williston, Pittsburgh, Calgary, and offshore
- Read JPT, Rigzone, Hart Energy, LinkedIn, SPE Connect, r/oilfield
- Do NOT tolerate marketing speak, buzzwords, or AI-written content
- Buy from people they trust, not from product catalogs

## Primary Business Goal from Blog

**Lead generation** via the 4-step Warrior quote-builder form on `sdsdata.lovable.app`.

Secondary goals:
1. **AI citation surface** — become the canonical source cited by ChatGPT, Perplexity, and Google AI Overview for wireline acquisition, addressable switches, and geothermal wireline queries
2. **LinkedIn thought leadership** for Maxine and Christopher
3. **Authority building** for the Warrior Universal Panel launch on May 5, 2026

## Website

- **New blog (redesign in progress):** `sdsdata.lovable.app` — Lovable-hosted React site
- **Legacy:** `warriorsystem.com` — older product site
- **Domain strategy:** TBD — blog may end up on a subdomain of warriorsystem.com or on sdsdata.lovable.app depending on final hosting decision (blocker tracked in `clients/sds/PROJECT.md`)

## CMS Platform

**To be confirmed.** Current SDS marketing site is on **Lovable**. Three options under consideration:
1. **Lovable blog routes** — simplest; blog lives at `sdsdata.lovable.app/blog/*`
2. **Static HTML blog repo** — matches the LuxeShutters / GummyGurl / Entourage pattern that MK has proven; deployed via Cloudflare Pages + Worker proxy on a custom domain
3. **WordPress subdomain** — adds a CMS MK already supports for REIG Solar and BreathMastery

**Recommendation:** Static HTML blog repo (option 2). Matches Pattern P-015 from the MK playbook, deploys fast, and gives SDS full control of the build pipeline.

**Decision owner:** Maxine / Christopher. Pending confirmation.

## Content Volume

- **Pre-launch:** 8 posts by May 5, 2026 (~2 per week for 4 weeks starting April 14)
- **Post-launch May 2026:** 4 posts
- **June 2026 onwards:** 4 posts per month sustained (~48 posts/year)

**Full editorial calendar:** `CONTENT.md`
**Launch post queue:** `REQUESTS.md`

## Active Persona

**Persona name:** `sds-warrior`
**Persona file:** `/Users/milanmandic/.claude/skills/blog/references/personas/sds-warrior.json`
**Load with:** `/blog persona use sds-warrior`
**Voice in one line:** Written by the engineers in Houston who designed your wireline system — for the crews who actually run it.

Full voice detail in `STYLE.md`.

## Identity & Engagement Rules (CRITICAL)

**MonteKristo operates as "Alex Srdic" to SDS.** All blog content is authored and delivered as if by Alex Srdic, an engineer working with the Houston SDS team. **Never use "MonteKristo AI" in any blog output or in any communication that reaches Christopher Knight or SDS.**

**Billing entity:** GetStuffDone LLC (agency)
**Primary contact:** Maxine Aitkenhead (maxine.aitkenhead@getsstuffdone.com / 281-844-2458)
**End-client approver:** Christopher M Knight (christopher.knight@warriorsystem.com / 281-398-1612) — all copy goes through him
**Cc'd on technical threads:** Cameron K Kramr (cameronkramr@warriorsystem.com)

## Author Byline

**Current default:** "By the Scientific Data Systems engineering team — Houston, TX"

**Once Christopher provides bio info (pending):**
- Technical reviewer: Christopher M Knight
- Title format: "Technical review: Christopher Knight, Scientific Data Systems — [years] in downhole diagnostics"

## CTAs by Post Type

| Post type | Primary CTA | URL / Destination |
|---|---|---|
| Pillar / architecture (Hub A) | "Request a demo of the Warrior platform" | `sdsdata.lovable.app/#quote` |
| Product deep dive (Hub B) | "Configure your Universal Panel" | Quote builder (4-step form) |
| Perforating / safety (Hub C) | "Download the addressable switch compatibility matrix" | Gated PDF |
| Geothermal pivot (Hub D) | "Talk to the Houston engineers about geothermal wireline" | Direct contact form |
| Leasing / business case (Hub E) | "Get your leasing quote in 1 business day" | Quote builder |
| Career post (standalone) | "Join the Warrior user forum" | User forum link |

## Source Documents

**Master materials:** `/Users/milanmandic/Desktop/MonteKristo AI/SDS Systems/`
- `SDS_2026_Brand_Voice_Manifesto_v4.pdf` — authoritative voice and banned vocab
- `SDS_Website_Proposal_Complete_April8.docx` — master proposal with approved copy
- `SDS Features and Outcomes.docx` — feature-to-outcome mapping
- `SDS Product Catalog for Website.xlsx` — product picklist source
- `SDS LinkedIn Post Series_April.docx` — drafted LinkedIn campaign
- `SDS Warrior Universal Panel Storyboard.pdf` — visual storyboard

**Research artifacts:** `_research/`
- `research-findings.md` — consolidated research with live stats
- `dfs-keywords-raw.json` — DataForSEO keyword data

**Related MK files:**
- `clients/sds/CLIENT.md` — master client profile (read this first for identity/operating rules)
- `clients/sds/copy/banned-vocab.md` — Christopher's rejected terms (run grep before publish)
- `clients/sds/copy/approved-copy.md` — Christopher-approved copy blocks

## Key Blockers (as of 2026-04-11)

1. Leadership headshots not scheduled — blocks bylines and About section credibility
2. Lovable credentials and blog hosting decision pending
3. Christopher's 2 quote-builder JSON files need retrieval from Gmail thread `19d6dafed9307d19`
4. GA4, Google Search Console, UTM infrastructure not yet configured
5. Email list doesn't exist yet — building in parallel

See `clients/sds/PROJECT.md` for the full blocker and task list.
