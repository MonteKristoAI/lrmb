# SDS / Warrior — Blog Measurement & KPIs

**Principle:** In a niche with 15,590/mo total search volume, traditional blog KPIs (sessions, pageviews) are the wrong metric. The right metrics are **lead quality**, **AI citation capture**, and **referral from authority sources**.

---

## 1. Tiered KPI Framework

### Tier 1 KPIs — Lead generation (what we're actually paid to deliver)

| KPI | Target (90 days) | Target (180 days) | Source |
|---|---|---|---|
| Quote form submits attributed to blog | 20+ | 60+ | UTM tracking on the 4-step quote form |
| MQLs from blog | 10+ | 30+ | GetStuffDone's CRM (once integrated) |
| Demo requests | 5+ | 15+ | Blog post CTAs |
| Inbound from operator (geothermal cluster) | 1+ | 3+ | Manual qualifier |
| Email list growth | 50+ | 200+ | Newsletter signup forms |

### Tier 2 KPIs — Authority signals (leading indicators)

| KPI | Target (90 days) | Target (180 days) | Method |
|---|---|---|---|
| AI citation pickups (ChatGPT/Perplexity/AIO) | 2+ | 8+ | Manual `/blog geo` testing |
| Backlinks from Tier 2 sources (trade pubs, SPE) | 3+ | 10+ | Ahrefs / Majestic / Google Search Console |
| LinkedIn engagement on launch posts (combined) | 500+ | 2,000+ | LinkedIn analytics |
| Named mentions in industry Slack / forums / Reddit | 5+ | 15+ | Google Alerts + manual |
| JPT / Hart Energy / OGJ pitch conversions | 0-1 | 1-3 | Editorial calendar |

### Tier 3 KPIs — Search & traffic (lagging indicators)

| KPI | Target (90 days) | Target (180 days) | Source |
|---|---|---|---|
| Organic sessions to blog | 500/mo | 2,000/mo | GA4 (when configured) |
| Keywords ranking top 10 | 15+ | 40+ | Google Search Console |
| Keywords ranking #1 | 3+ | 10+ | GSC |
| Avg time on page (pillar posts) | 3+ min | 4+ min | GA4 |
| Scroll depth to FAQ section | 40%+ | 50%+ | GA4 scroll tracking |

---

## 2. Core Weekly Dashboard

Pull these numbers every Monday. Share in a 3-bullet Slack / email to Maxine every Tuesday.

### Weekly questions
1. **Last week's posts** — what did we publish? Link + 1 line
2. **Last week's traffic** — organic sessions, LinkedIn impressions, newsletter opens
3. **Last week's leads** — quote form submits, demos, MQLs
4. **Last week's citations** — any new AI citations caught in manual testing?

### Format
```
Week of 2026-MM-DD

Published: Post #X "Title" (1,234 words, Hub Y, 92 analyze score)

Traffic (7d):
- Blog organic: X sessions (+/- Y vs prior week)
- LinkedIn impressions: X
- Newsletter opens: X/Y recipients

Leads (7d):
- Form submits: X
- Demos requested: X
- MQLs: X

Citations:
- ChatGPT: [cited? yes/no]
- Perplexity: [cited? yes/no]
- AIO: [cited? yes/no]

Notable:
- [1 line on anything unusual]
```

---

## 3. Lead Attribution Rules

**Problem:** In B2B wireline, a lead might read 3 blog posts over 2 months before filling out a form. Single-touch attribution underestimates blog impact.

**Solution:** Use **last-non-direct-click attribution** as the default, but also track:
- First-touch source (what initially brought them to the blog)
- All touched posts before conversion (GA4 content groups)
- Time-to-conversion (hours between first blog visit and form submit)

### Attribution rules
- **UTM-tagged:** fully attributed to the tagged channel
- **Organic search:** attributed to the entry post (Landing Page in GA4)
- **Direct:** attributed to the most-recently-viewed post (if blog is in the session)
- **Cross-device:** not attributed automatically — GetStuffDone's CRM is the source of truth when form fields match

---

## 4. AI Citation Monitoring Protocol

### Monthly manual test (first Monday of each month)
1. Open incognito / unsigned tabs on ChatGPT, Perplexity, Google AI Overview, Bing Copilot
2. Run these 10 queries (they change as new posts publish):
   - "What is a vendor-agnostic wireline platform?"
   - "What is the Warrior Universal Panel?"
   - "How does an addressable switch work in perforating?"
   - "DynaStage vs Titan ControlFire vs G&H"
   - "What does API RP 67 4th edition change?"
   - "Does Weatherford sell a competitor's wireline system?"
   - "What wireline equipment do Fervo Energy and FORGE use?"
   - "What does a wireline engineer do?"
   - "Cost of a wireline surface system"
   - "LAS vs DLIS wireline data format"
3. For each query, record:
   - Model
   - Date
   - Whether SDS was cited (yes/no)
   - Which passage was lifted (screenshot + copy)
   - Competitors cited
4. Log to `_research/citation-test-log.md`

### Quarterly formal audit
- Run `/blog geo` on every published post
- Refresh posts scoring below 85
- Update `CITATIONS.md` citation capsules based on what AI models actually lifted

---

## 5. Quality KPIs (Enforced by Blog CLAUDE.md Pipeline)

Every post must hit these before publishing:

| Metric | Target | Tool | Gate |
|---|---|---|---|
| `/blog analyze` score | 90+ | blog-analyze skill | Hard gate (Blog CLAUDE.md Section 6) |
| `/blog seo-check` | 0 FAIL | blog-seo-check | Hard gate |
| `/blog geo` score | 85+ | blog-geo | Hard gate (raised from 80 for SDS) |
| `/blog factcheck` | 0 NOT FOUND | blog-factcheck | Hard gate |
| Word count | 2,000+ (pillar 3,000+) | Manual | Soft |
| Internal links | 3-5 from SITEMAP | Manual | Hard |
| External links Tier 1-3 | 3-5 from SOURCES.md | Manual | Hard |
| Em dash count | 0 | grep | Hard (SDS + MK rule) |
| Banned vocab | 0 | grep against banned-vocab.md | Hard |
| Focus keyword density | 0.65% - 0.9% | Blog CLAUDE.md pre-check | Hard |
| Flesch Reading Ease | 60+ | Manual | Soft (technical posts may run lower) |

---

## 6. Benchmarks from Analogous Clients

### REIG Solar (industrial B2B blog, 8-10 posts/month)
- Typical pillar post after 3 months: 300-500 organic sessions/mo
- Typical conversion rate: ~1% of sessions → form submit
- AI citation pickup: 30-40% of posts cited within 6 months

### BreathMastery (wellness B2C, 4-6 posts/month)
- Typical post after 3 months: 500-2,000 organic sessions/mo
- Typical conversion rate: ~2-3% of sessions → email signup
- Much higher volume niche — NOT directly comparable

### SDS Expected Baseline
Given the niche volume, SDS posts will see:
- **50-300 organic sessions/mo per post** after 3-6 months (vs REIG's 300-500)
- **LinkedIn reach 5-10× organic Google** (for Maxine + Christopher combined, reach may outstrip search)
- **Conversion rate 2-5%** (much higher than typical because audience is narrow and buying-intent is strong)
- **AI citation pickup 40-60% of posts** within 6 months (higher than REIG because competitive content is thinner)

---

## 7. Reporting Cadence

### Weekly (every Tuesday)
- 3-bullet Slack/email to Maxine with the core dashboard

### Monthly (first Monday)
- AI citation test + short written report
- Top 5 posts by performance (any metric)
- Content gaps that need filling
- Recommended next 4 posts

### Quarterly (at end of each quarter)
- Full strategic review
- Refresh `KEYWORD-DATABASE.md` with new DataForSEO pull
- Refresh `COMPETITORS.md` with new gap scan
- Adjust hubs if needed
- Report format: PDF via MonteKristo `/report` skill, branded, sent to Maxine

### Annually
- Year-end performance report
- Strategic pivot recommendations
- Content calendar for next year

---

## 8. Tools Required

| Tool | Purpose | Status |
|---|---|---|
| **GA4** | Traffic, behavior, conversion | **Needs setup** on final blog hosting |
| **Google Search Console** | Ranking, clicks, impressions | **Needs setup** post-launch |
| **UTM builder** | Campaign tagging | Built into MK workflow |
| **LinkedIn analytics** | Social reach | Use SDS's LinkedIn company page |
| **Ahrefs or Majestic** | Backlinks | Optional; Search Console's Links report is the minimum |
| **Airtable** | Content calendar + lead tracking | Possibly — check with GetStuffDone's stack |
| **ChatGPT / Perplexity / Bing Copilot** | AI citation testing | Manual |
| **Blog skills** (`/blog analyze`, `/blog geo`, etc.) | Quality + citation scoring | Built-in to MK pipeline |

---

## 9. What Success Looks Like at 6 Months

Write this target on the wall:

> "By October 2026, when a wireline engineer in Houston types 'What is the best addressable switch panel for multi-manufacturer perforating?' into Perplexity or ChatGPT, the first citation that comes back is from the SDS Warrior blog. And when a service company VP asks Maxine 'Is Warrior actually vendor-agnostic or is that just marketing?', she points to the Weatherford distribution post, and the conversation is over."

If that happens for one persona × one question, the blog has paid for itself. If it happens for 5 persona × 10 questions, SDS has a content moat that compounds.

---

## 10. Failure Modes (Watch Out For)

| Risk | Symptom | Mitigation |
|---|---|---|
| Posts read as AI-written | High bounce rate, low scroll depth, flat LinkedIn engagement | Strict adherence to `STYLE.md` persona voice + human review |
| AI citations never materialize | Manual tests show 0 citations at 3 months | Restructure to lean harder on citation capsules + FAQ schema |
| No quote form submits | 10+ posts published, 0 leads | CTAs are too soft — tighten persona match, add "talk to a Houston engineer" language |
| Banned vocab creeps in | Christopher spots it on review | Add a pre-publish grep check to the pipeline |
| LinkedIn engagement is flat | <20 reactions per post | Review with Maxine; possibly too corporate — push toward personal posts |
| Posts stale after Q3 | Traffic declining on older posts | Quarterly refresh pass; update stats; re-post |

---

## 11. Ownership

**Data owner:** MonteKristo (Alex Srdic)
**Reports delivered to:** Maxine Aitkenhead (weekly Slack, monthly report, quarterly PDF)
**Reports reviewed by:** Christopher Knight (quarterly)
**Strategic adjustments require:** MK → Maxine → Christopher approval
