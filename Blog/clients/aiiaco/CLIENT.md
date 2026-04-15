---
type: client
client: AiiACo
status: active
platform: static-html
blog_url: https://aiiaco-blog.pages.dev
target_url: https://aiiaco.com/blog/
main_url: https://aiiaco.com
repo: github.com/MonteKristoAI/aiiaco-blog
founder: Nemr Hallak
onboarded: 2026-04-11
tags: [aiiaco, client, blog, static-html]
---

# AiiACo - Blog Client Profile

## Overview

AiiACo is an AI integration consultancy founded by Nemr Hallak. The firm serves real estate brokerages, mortgage lenders, vacation rental operators, and management consulting firms. Its core differentiator is that it places an AI operational layer on top of existing CRMs (Follow Up Boss, kvCORE, Salesforce, HubSpot, GoHighLevel, Encompass, Guesty, Hostaway, etc.) rather than replacing them.

The blog is the firm's primary content marketing and AI citation channel. It lives in a separate static HTML repository but is designed to look and feel identical to the main React site.

## Platform

- **Stack**: Static HTML + Cloudflare Pages (already shipped)
- **Build**: `node build.js` produces `dist/` with posts, index, sitemap, RSS, robots.txt, _redirects, schemas
- **Repo**: `github.com/MonteKristoAI/aiiaco-blog` (private)
- **Deploy**: `CLOUDFLARE_API_TOKEN=... npx -y wrangler@latest pages deploy dist --project-name=aiiaco-blog --branch=main`
- **Pages project**: `aiiaco-blog` (id `e8525ec4-6e64-4dae-aa27-0b151875f094`, subdomain `aiiaco-blog.pages.dev`)
- **Worker proxy** (not yet live): `aiiaco-blog-proxy` targeting route `aiiaco.com/blog/*` - waiting on aiiaco.com DNS migration to Cloudflare
- **Account**: Cloudflare Account ID `9ff5132f189939745601b8a00bcfb23b`

**Do NOT touch**: `build.js`, `templates/`, `css/blog.css`, `posts/*.html` (Round 5 shipped state). Strategy only writes new post sources + blog system files.

## Authoring workflow

1. Write new post as `posts/{slug}.html` with `<!-- META -->` header (title, slug, description, date, category, image, read_time, subtitle, direct_answer)
2. Body uses `<p>`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<aside class="callout">`, and `<section class="faq-section">` (H3+P pairs auto-extract to FAQPage schema)
3. Run `PING=false node build.js` to produce dist
4. Deploy via wrangler (Direct Upload mode - GitHub auto-deploy pending 1-click CF dashboard connect)
5. Commit + push to `MonteKristoAI/aiiaco-blog` `main`
6. Log publish in `SITEMAP.md` with date, URL, schema verification
7. Query primary keyword on Google to check AI Overview citation within 48 hours

## Review and approval

- **Solo reviewer**: Milan Mandic (contact@montekristobelgrade.com)
- **Approval rule**: Posts do NOT go to Nemr for review by default. Nemr sees posts after publish via the `llms.txt` + `about.txt` tracking. If Nemr flags edits, they go into `FEEDBACK.md` as a new rule.
- **Auto-publish rule (P-015 variant)**: Since Milan is the solo reviewer, posts auto-publish once the `content-quality-gate.md` checklist passes. No pending-review bottleneck.

## Content quality gates

Every post must pass before shipping:

- [ ] Zero em dashes AND en dashes (use hyphens, commas, or rewrite)
- [ ] Zero banned AI-tell words from `skills/content-quality.md`
- [ ] At least one entity anchor from the 30-entity graph (see `research/geo-readiness.md`)
- [ ] Direct Answer block at the top, 40-80 words
- [ ] At least 5 FAQ Q/A pairs (FAQPage schema extraction)
- [ ] At least 1 internal link to an aiiaco.com service page
- [ ] Author byline links to `#nemr-hallak` Person schema
- [ ] Primary keyword appears in title, first 100 words, at least one H2, and meta description
- [ ] Word count matches template target
- [ ] Template rotation rule obeyed (never 3 consecutive same template)

Run `python3 -c "import pathlib; c=pathlib.Path('posts/<slug>.html').read_text(); print('em:',c.count(chr(0x2014)),'en:',c.count(chr(0x2013)))"` before every commit.

## Measurement

- **GA4**: `G-6XQ3T33HTF` (configured on main site, pending add to blog templates)
- **GSC**: aiiaco.com property live. Add `aiiaco-blog.pages.dev` as separate property in Phase 2.
- **DataForSEO**: monthly rank audit on top 50 keywords via `ranked_keywords_live` endpoint ($0.30 budget per month)
- **Manual citation tracking**: weekly query of 10 priority keywords on Google, Perplexity, ChatGPT. Log citation status in `SITEMAP.md`.
- **Monthly report**: pageviews by post, top referrers, AI citation count, consultation requests attributed via UTM.

## Content decay protocol

- Any post losing 10 positions in GSC -> refresh within 2 weeks
- Any post older than 9 months referencing a tool name -> verify API / feature still exists
- Any post with a statistic older than 12 months -> update source
- Any post with a compliance citation (FHA, TRID, QM, EU AI Act, NIST RMF) after regulatory update -> immediate review
- Quarterly: mass refresh on top 20 percent of posts by traffic
- Annually: sweep all posts

## E-E-A-T anchors

- **Founder Person schema**: `https://aiiaco.com/#nemr-hallak` (Wikidata Q138638897)
- **Organization schema**: `https://aiiaco.com/#organization`
- **Author byline in every post**: "Written by Nemr Hallak" linked to founder bio on `/manifesto`
- **Credentials**: AI Systems Architect, founder of AiiACo (2025), nemrhallak.com personal site
- **Publishing history**: blog itself builds authority over time via post count + citation count

## Hard rules

1. Zero em/en dashes. Period.
2. Nemr-voice only. Never corporate "we believe" voice.
3. Every stat has a source and year.
4. Every how-to names specific tools (Follow Up Boss API, Encompass webhook, etc.)
5. No outbound emails to Nemr from the blog pipeline without Milan's explicit approval
6. Blog templates never use React `Link` or relative paths to main site - always absolute `https://aiiaco.com/...`
7. Build must never emit invalid JSON-LD. Verify with `curl | jq` before deploy.
8. Every post passes `content-quality-gate.md` before commit.

## Supporting files

- `BLOG-STRATEGY.md` - full strategy (15 sections)
- `STYLE.md` - voice, tone, templates, banned vocabulary
- `CONTENT.md` - 24-post content queue
- `SITEMAP.md` - published post tracker
- `BRAND.md` - colors, fonts, positioning
- `FEEDBACK.md` - standing rules + feedback log
- `KEYWORD-DATABASE.md` - mirror of research/keyword-database.md
- `EDITORIAL-CALENDAR.md` - 24-post schedule with dates
- `../../clients/aiiaco/research/keyword-database.md` - DataForSEO keyword research
- `../../clients/aiiaco/research/competitor-gap-analysis.md` - competitor + gap analysis
- `../../clients/aiiaco/research/geo-readiness.md` - GEO / AI citation framework
