---
type: keyword-database-mirror
client: AiiACo
date: 2026-04-11
source: /clients/aiiaco/research/keyword-database.md
tags: [aiiaco, keywords, dataforseo]
---

# AiiACo Keyword Database (Pointer)

The full 100-keyword database with DataForSEO Labs metrics, cluster breakdown, zero-competition gold list, question keywords, comparison keywords, SERP insights, and methodology lives at:

**`/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/research/keyword-database.md`**

This file in `Blog/clients/aiiaco/` is a pointer to keep the blog-onboard skill file layout consistent. Open the research file for the actual data.

## Quick reference (top 20 gold keywords)

| Keyword | Vol | KD | Cluster | Post # |
|---------|----:|---:|---------|-------:|
| ai sdr | 2400 | 11 | ai_sdr | 6 |
| ai for real estate | 3600 | 28 | real_estate | (cluster anchor) |
| ai crm | 1900 | 39 | crm_integration | (cluster anchor) |
| ai for lead generation | 1900 | ~30 | ai_sdr | 6 |
| ai workflow automation | 1000 | 40 | workflow | 14 |
| ai lead generation tools | 480 | 38 | ai_sdr | 11 |
| ai for real estate agent | 480 | 21 | real_estate | 15 |
| ai workflow automation tools | 480 | 25 | workflow | 14 |
| ai consultants for small business | 390 | 0 | consulting | 8 |
| ai sdr software | 320 | 9 | ai_sdr | 11 |
| mortgage ai | 320 | 4 | mortgage | 5 |
| ai sales automation | 260 | 22 | revenue | (future post) |
| ai sdr agent | 260 | 16 | ai_sdr | 6 |
| ai for property management | 210 | 16 | vacation_rental | 12 |
| ai tools for real estate agents | 210 | 19 | real_estate | 15 |
| ai mortgage lending | 210 | 12 | mortgage | 5 |
| ai sdr tool | 170 | 8 | ai_sdr | 11 |
| ai-native crm | 170 | 12 | crm_integration | (future post) |
| eu ai act compliance | 140 | 21 | governance | 19 |
| ai for commercial real estate | 110 | 9 | real_estate | 15 |

## How to use

- When writing a post, pull the primary keyword from this table + the research file
- Verify keyword is mapped to a post number in CONTENT.md
- Use the Tier (Gold / Silver / Bronze) to decide how much effort to invest in the post
- For each new cluster, reference the cluster breakdown section of the research file
- For AI Overview / AEO targeting, reference `research/geo-readiness.md`

## Monthly keyword refresh

Schedule: every 30 days, re-run `ranked_keywords_live` on AiiACo's published URLs plus the top 50 target keywords. Cost: approximately $0.50 USD per refresh.

Command template:
```
curl -u "contact@montekristobelgrade.com:336047a9c56e6e64" \
  -H "Content-Type: application/json" \
  -X POST -d '[{"target":"aiiaco-blog.pages.dev","location_code":2840,"language_code":"en"}]' \
  "https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live"
```

Log monthly deltas in `SITEMAP.md` citation tracking table.
