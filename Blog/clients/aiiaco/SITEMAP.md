---
type: sitemap
client: AiiACo
updated: 2026-04-13
tags: [aiiaco, sitemap, published-posts]
---

# AiiACo Blog Sitemap

**Purpose**: Ground truth of what is currently live on aiiaco-blog.pages.dev + `/blog/` (once Worker lives). Track publish date, primary keyword, schema verification status, and AI Overview citation status.

**Blog URL**: https://aiiaco-blog.pages.dev

## Published posts (7 live)

| # | Slug | Title | Published | Primary keyword | Schema OK | AI Overview cite | Notes |
|---|------|-------|-----------|-----------------|-----------|-----------------|-------|
| 1 | [what-is-an-ai-revenue-system](https://aiiaco-blog.pages.dev/what-is-an-ai-revenue-system/) | What Is an AI Revenue System? The 5-Component Framework | 2026-04-11 | ai revenue system | YES (BlogPosting + BreadcrumbList + FAQPage) | PENDING-CHECK | Round 5 seed, 6-Q FAQ |
| 2 | [how-to-integrate-ai-into-a-real-estate-crm](https://aiiaco-blog.pages.dev/how-to-integrate-ai-into-a-real-estate-crm/) | How to Integrate AI Into a Real Estate CRM | 2026-04-11 | ai crm integration real estate | YES | PENDING-CHECK | 5-Q FAQ, FHA compliance callout |
| 3 | [real-estate-brokerages-ai-mistakes](https://aiiaco-blog.pages.dev/real-estate-brokerages-ai-mistakes/) | What Real Estate Brokerages Get Wrong About AI | 2026-04-11 | ai mistakes real estate | YES | PENDING-CHECK | 5-Q FAQ, 5-mistake framework |
| 4 | [speed-to-lead-ai-response-playbook](https://aiiaco-blog.pages.dev/speed-to-lead-ai-response-playbook/) | Speed to Lead: The AI Response Playbook | 2026-04-11 | speed to lead (880 vol KD 13) | YES | PENDING-CHECK | Post 51. Nemr priority #1. 4-layer framework, HBR citation, sanctioned outcome ranges. 2711 words. |
| 5 | [what-is-speed-to-lead](https://aiiaco-blog.pages.dev/what-is-speed-to-lead/) | What Is Speed to Lead and Why Your CRM Loses Deals in the First Five Minutes | 2026-04-13 | what is speed to lead (50 vol KD 2) | YES | PENDING-CHECK | Post 53. AEO definition bait. HBR 21x stat. 4 leak reasons. 1460 words. |
| 6 | [ai-dormant-database-reactivation-math](https://aiiaco-blog.pages.dev/ai-dormant-database-reactivation-math/) | AI Dormant Database Reactivation: The Real Math (With Real Numbers) | 2026-04-13 | dormant database reactivation (KD 2) | YES | PENDING-CHECK | Post 7. Nemr priority #2. Unit economics, 10K contacts, 2.4-7.2x ROI. 1643 words. |
| 7 | [how-to-integrate-ai-into-follow-up-boss](https://aiiaco-blog.pages.dev/how-to-integrate-ai-into-follow-up-boss/) | How to Integrate AI Into Follow Up Boss (Operator Playbook) | 2026-04-13 | Follow Up Boss AI (KD 5) | YES | PENDING-CHECK | Post 4. Nemr priority #3. FUB REST API, webhooks, custom fields, FHA callout. 1516 words. |

## Citation tracking

Check every Friday. Format: `date | keyword | Google AI Overview | Perplexity top 5 | ChatGPT Web Search top 5`

| Date | Keyword | Google AIO | Perplexity | ChatGPT |
|------|---------|-----------|------------|---------|
| _pending_ | ai revenue system | - | - | - |
| _pending_ | speed to lead | - | - | - |
| _pending_ | what is speed to lead | - | - | - |
| _pending_ | dormant database reactivation | - | - | - |
| _pending_ | how to integrate ai into follow up boss | - | - | - |
| _pending_ | how to integrate ai into a real estate crm | - | - | - |
| _pending_ | real estate brokerages ai mistakes | - | - | - |

First check scheduled for 2026-04-18.

## Service area / index pages

Not applicable. AiiACo is national B2B, no service area pages on the blog. Main aiiaco.com has:
- `/` (home)
- `/manifesto` (founder bio)
- `/industries` + `/industries/{slug}` (20 industry microsites)
- `/method`
- `/models`
- Service pages: `/ai-integration`, `/ai-implementation-services`, `/ai-governance`, `/ai-revenue-engine`, `/ai-crm-integration`, `/ai-workflow-automation`, `/ai-for-real-estate`, `/ai-for-vacation-rentals`
- Pending PR #2: `/ai-infrastructure`

The blog links TO these pages. Does not duplicate them.

## Publishing log

- 2026-04-11: Round 5 shipped posts 1, 2, 3 via wrangler to Pages
- 2026-04-11: `_redirects` fix shipped (CSS path resolution before Worker proxy)
- 2026-04-11: Blog onboarding v2 completed (55-post queue, 273 keywords, 4 personas, 3 critic levels)
- 2026-04-11: AiiACo brand casing fix across all posts + templates + build.js (reversed Round 3 AiiAco)
- 2026-04-11: Post 51 (speed-to-lead-ai-response-playbook) shipped. Nemr priority #1 cluster.
- 2026-04-11: PR #1 opened on 10452/aiiaco (Round 2-4 SEO, 97 files)
- 2026-04-11: PR #2 opened on 10452/aiiaco (/ai-infrastructure page)
- 2026-04-11: PR #3 opened on 10452/aiiaco (StructuredData duplicate fix)
- 2026-04-13: Posts 53, 7, 4 shipped (what-is-speed-to-lead, reactivation-math, follow-up-boss)
- 2026-04-13: GA4 (G-6XQ3T33HTF) added to both templates
- 2026-04-13: build.js patched to emit llms.txt + about.txt per build
- 2026-04-13: DataForSEO baseline monthly refresh (0 rankings, blog too new)

## Manual steps pending (for Milan)

1. **Cloudflare auto-deploy**: Workers & Pages -> aiiaco-blog -> Settings -> Git -> Connect to Git -> select MonteKristoAI/aiiaco-blog -> branch main -> build command `node build.js` -> output dir `dist`. After this, every git push auto-deploys.
2. **GSC submit**: run `bash clients/aiiaco/scripts/gsc-submit-after-merge.sh` after Nemr merges PR #1.
3. **Friday citation check**: query top 7 keywords on Google, Perplexity, ChatGPT. Fill in citation tracking table above.
