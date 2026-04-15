---
type: kpi-dashboard
client: AiiACo
date: 2026-04-11
update_cadence: monthly
tags: [aiiaco, kpi, dashboard, measurement]
---

# AiiACo Blog KPI Dashboard

**Purpose**: the canonical scorecard for the AiiACo blog program. Updated monthly on the 1st. Fills into a Google Sheet or Notion page for Milan + Nemr.

---

## 1. Core traffic metrics

| Metric | Source | Frequency | Target M3 | Target M6 | Target M12 | Current |
|--------|--------|-----------|----------:|----------:|-----------:|--------:|
| Monthly organic sessions | GA4 | Monthly | 500 | 2000 | 10000 | - |
| Unique visitors | GA4 | Monthly | 400 | 1600 | 8000 | - |
| Sessions per post (avg) | GA4 | Monthly | 45 | 120 | 250 | - |
| Bounce rate | GA4 | Monthly | < 70% | < 65% | < 60% | - |
| Avg time on page | GA4 | Monthly | > 2:00 | > 2:30 | > 3:00 | - |
| Pages per session | GA4 | Monthly | > 1.3 | > 1.5 | > 1.8 | - |

## 2. Search performance

| Metric | Source | Frequency | Target M3 | Target M6 | Target M12 | Current |
|--------|--------|-----------|----------:|----------:|-----------:|--------:|
| Indexed pages (GSC) | GSC | Weekly | 8 | 19 | 50 | 3 |
| Total impressions | GSC | Monthly | 2000 | 15000 | 80000 | - |
| Total clicks | GSC | Monthly | 200 | 1500 | 6000 | - |
| Avg CTR | GSC | Monthly | > 8% | > 10% | > 12% | - |
| Avg position (top 20 KWs) | GSC | Monthly | 30 | 18 | 10 | - |
| KWs in top 10 | GSC + DFS | Monthly | 2 | 8 | 20 | - |
| KWs in top 3 | GSC + DFS | Monthly | 0 | 2 | 8 | - |

## 3. AI citation tracking

| Metric | Source | Frequency | Target M3 | Target M6 | Target M12 | Current |
|--------|--------|-----------|----------:|----------:|-----------:|--------:|
| Google AI Overview citations | Manual query | Weekly | 1 | 3 | 10 | 0 |
| Perplexity citations (top 5) | Manual query | Weekly | 2 | 8 | 20 | 0 |
| ChatGPT Web Search citations | Manual query | Weekly | 1 | 5 | 15 | 0 |
| AI referral traffic (Perplexity + ChatGPT) | GA4 | Monthly | 20 sessions | 100 sessions | 500 sessions | - |

## 4. Publishing velocity

| Metric | Source | Frequency | Target | Current |
|--------|--------|-----------|-------:|--------:|
| Posts published this month | SITEMAP.md | Monthly | 4 | 3 (ship date 2026-04-11) |
| Posts published YTD | SITEMAP.md | Monthly | 4 per month avg | 3 |
| Template distribution (last 10) | CONTENT.md audit | Monthly | Balanced across T1-T4 | - |
| Buffer weeks used | Calendar | Quarterly | < 2 per quarter | - |
| Quality gate pass rate | Quality gate log | Per post | 100% | 3/3 |

## 5. Revenue metrics (derived)

| Metric | Source | Frequency | Target M3 | Target M6 | Target M12 | Current |
|--------|--------|-----------|----------:|----------:|-----------:|--------:|
| Consultation requests | Calendly / form log | Monthly | 3 | 8 | 15 | 0 |
| Consultation -> engagement conversion | CRM | Monthly | 30% | 40% | 50% | - |
| Attributed ARR from blog | CRM (attribution) | Monthly | $0 | $60k | $180k | $0 |
| Avg engagement size | CRM | Monthly | - | $60k | $75k | - |
| Blog CAC | CRM + time log | Quarterly | - | < $10k | < $5k | - |

## 6. Content health

| Metric | Source | Frequency | Target | Current |
|--------|--------|-----------|-------:|--------:|
| Orphan posts (no inbound links) | SITEMAP + link audit | Quarterly | 0 | 0 |
| Cannibalization warnings | blog-cannibalization skill | Quarterly | 0 | 0 |
| Posts losing 10+ positions | GSC + refresh skill | Weekly | 0 | - |
| Stale posts (>9 months, tool-referenced) | Date + skill | Quarterly | < 10% | - |
| FAQ schema extractions valid | Schema validator | Per post | 100% | 100% |
| Em/en-dash violations | Quality gate | Per post | 0 | 0 |

## 7. Backlink growth (Phase 2+)

| Metric | Source | Frequency | Target M6 | Target M12 | Current |
|--------|--------|-----------|----------:|-----------:|--------:|
| Referring domains | DFS Backlinks | Monthly | 10 | 50 | 0 |
| Total backlinks | DFS Backlinks | Monthly | 25 | 150 | 0 |
| DR equivalent | DFS | Monthly | 15 | 30 | - |
| Guest posts shipped | Manual | Quarterly | 2 | 8 | 0 |
| Podcast appearances | Manual | Quarterly | 1 | 5 | 0 |

## 8. Monthly report template

Every 1st of the month, Milan produces a one-page scorecard for Nemr:

```
AiiACo Blog - [Month YYYY] Report
=====================================

[Publishing]
- Posts this month: X
- Cumulative: X
- Quality gate: X/X pass

[Traffic]
- Sessions: X (+X% MoM, -X% from target)
- Top 5 posts by traffic:
  1. [post title] - X sessions
  2. ...

[Search]
- Indexed: X / X
- Top 10 KWs: X
- New rankings this month: X
- Best new rank: [keyword] jumped from #X to #X

[AI Citations]
- Google AI Overview: X posts cited
- Perplexity: X posts in top 5
- ChatGPT Web Search: X posts in top 5

[Revenue]
- Consultation requests: X
- Engagements closed: X
- Attributed ARR: $X

[Health]
- Issues: [list]
- Decay flags: [list]
- Refresh queue: [list]

[Next month]
- Posts planned: X
- Priority focus: [cluster]
```

## 9. Data sources + automation

- **GA4** (Measurement ID G-6XQ3T33HTF) - automated via GA4 API
- **GSC** (aiiaco.com property + aiiaco-blog.pages.dev) - automated via Search Console API
- **DataForSEO** - monthly rank tracking via ranked_keywords/live on aiiaco-blog.pages.dev domain
- **Manual citation queries** - weekly Friday manual query on top 10 priority keywords
- **Perplexity API** (future) - automated citation detection
- **CRM attribution** - UTM parameters + Calendly form attribution

All of this feeds the `aiiaco-refresh` skill on a monthly cron schedule, with output written to this dashboard file.

## 10. Red flags (immediate attention)

Alert Milan (or Nemr) if any of these trigger:

- Zero consultation requests in 2 consecutive months after month 3
- More than 3 posts lose 10+ positions in a single week
- GA4 shows 70% of traffic on 1 post (over-concentration)
- Quality gate fails on a commit
- Cannibalization warning fires
- DFS rank check finds a competitor moving above AiiACo on a Platinum keyword
- AI Overview citation disappears from a previously-cited post
