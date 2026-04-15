# ProjectPro Construction Leads — Meta Ads Campaign Strategy
**April 2026 | Rescue Phase | $70 CAD/day | MICRO Tier**

Prepared by: MonteKristo AI
Last updated: 2026-04-04

---

## Situation Assessment

Before the strategy: the previous campaign spent $1,372 CAD and produced 4 conversions. The root cause was not the audience or the offer. It was friction and commitment ask sequencing. Sending cold B2B traffic to a landing page that immediately required a credit card is asking someone to marry you before the first date. The offer is strong (30-day free trial, price is 95% cheaper than Dodge), but it was delivered at the wrong moment in the relationship. This campaign fixes that.

The second reality to accept immediately: at $70 CAD/day (~$50 USD/day), this campaign will operate in permanent learning phase. Meta requires 50 conversion events per week to exit learning. At a realistic $25-40 CPL for this ICP, we will generate 9-14 leads per week, not 50. This is not a failure of execution. It is a mathematical fact of the budget tier. The strategy below is built around this constraint, not in denial of it.

---

## 1. Campaign Structure

### Exact Hierarchy

```
CAMPAIGN: ProjectPro | Leads | Native Form | USA | Apr 2026
  Objective: Leads
  Budget type: CBO (Campaign Budget Optimization)
  Daily budget: $70 CAD / ~$50 USD
  Bid strategy: Lowest cost (no bid cap - bid caps starve micro budgets)
  Special ad category: None
  A/B test: Off

  AD SET: A+ Audience | Commercial Material Suppliers | USA
    Location: United States
    Age: 30-65 (hard constraint only)
    Gender: All
    Audience type: Advantage+ Audience
    Interest suggestions (signals, not constraints):
      - Building materials
      - Construction industry
      - Dodge Data & Analytics
      - ConstructConnect
      - Construction management software
    Placements: Advantage+ Placements (automatic)
    Optimization event: Leads
    Attribution: 7-day click, 1-day view

    AD 1: Hook A - Price Contrast (Static image)
    AD 2: Hook B - Contrarian/Anti-Dodge (Static image)
    AD 3: Hook C - Data proof/ROI (Static image)
    AD 4: Hook D - Problem/Pain (Static image)
```

**Why 1 campaign, 1 ad set, 4 ads:**
The MICRO tier rules are absolute. Any attempt to run multiple ad sets splits a budget that is already mathematically insufficient for one. Two ad sets at $35 each get so few impressions that neither generates meaningful signal. 4 ads within a single ad set gives Meta's Andromeda system enough creative variety to find the best performer while keeping all spend weight behind one targeting pool.

---

## 2. Targeting Decision

**Decision: Advantage+ Audience. No detailed targeting. No exceptions at this budget.**

### Reasoning

At $50 USD/day, detailed targeting layers increase CPMs without proportionally improving lead quality. Narrow job-title targeting (VP Sales, Sales Director) at this budget produces audiences so small that frequency spikes within days, ad fatigue sets in, and CPL climbs sharply. This is what likely killed the previous campaign alongside the landing page friction.

Advantage+ Audience works differently. The interest suggestions (Building materials, Dodge Data & Analytics, ConstructConnect, Construction management software) function as starting signals - Meta's AI reads them as "find people who convert from pools similar to this" rather than as hard filters. At $50/day, this gives Meta maximum room to find the buyers within the budget.

The gating question in the lead form (see Section 5) handles ICP qualification. Meta finds the traffic. The form filters the quality. SDR handles the rest.

**Hard constraints applied:**
- Location: United States only
- Age: 30-65 (removes irrelevant demographics without narrowing the professional pool)
- No income, no job title, no company size filters (these raise CPMs significantly on Meta)

---

## 3. Number of Ads and Reasoning

**4 ads. Not 3, not 5.**

3 ads gives Andromeda too little variety to distinguish a winner. 5 ads at this budget means some ads may never receive enough impressions to generate statistically meaningful data before the campaign ends. 4 ads is the MICRO tier optimal: each ad gets enough impressions to show a signal within 5-7 days, and Andromeda can shift budget weight toward the winner.

Each of the 4 ads tests a different hook angle. The format is static image for all 4 - faster to produce, performs equally to video on B2B lead forms (the form itself is the conversion mechanism, not the video), and easier to iterate rapidly if Day 5 review shows a clear loser.

**Hook angle assignments:**
- Ad 1 (Price Contrast): Lead with the competitor price gap. "Your pipeline data costs $6,000/year from Dodge. ProjectPro is $199/month. Same commercial projects. Different invoice."
- Ad 2 (Contrarian/Anti-Dodge): Challenge the status quo. "The data provider you're using was built for general contractors. Not for material suppliers. Here's the difference."
- Ad 3 (Data Proof): Lead with the deliverable specificity. "150-250 early-stage commercial projects in your market. Every week. Before your competitors see them in Dodge."
- Ad 4 (Pain/Lost Revenue): Lead with the cost of inaction. "How many commercial bids are you losing because you found out about the project after groundbreaking?"

---

## 4. Lead Form vs Landing Page Decision

**Decision: Native lead form only. Landing page is off the table for this campaign.**

### Reasoning

The previous campaign failed partly because of off-platform friction. When a cold B2B prospect clicks a Meta ad, they have approximately 8-12 seconds of attention before they bounce. A landing page requires: loading time, reading time, decision time, and then a credit card input. Each step is a drop-off point.

The native lead form removes every step except: read the intro, answer 5 questions, submit. No page load. No navigation. No credit card. The trial activation with card required happens later, after the SDR has qualified the lead and the prospect has seen the actual product.

**Form type: More Volume** (not Higher Intent)
At 9-14 leads per week, volume is the constraint. The SDR qualification call handles quality filtering. Using Higher Intent form type at MICRO budget would reduce lead volume to 5-8 per week, which provides no usable optimization signal and guarantees the campaign ends without actionable data.

**The "card required" objection:** Do not mention the credit card requirement in the ad, the form intro screen, or the thank you screen. The card requirement is a retention mechanism for ProjectPro, not a trial barrier for the prospect. The SDR introduces the trial, establishes value, and handles the card conversation during the activation call. Putting "card required" in the ad kills CTR from people who are actually good leads.

---

## 5. Lead Form Architecture

### Intro Screen
- Headline: "See What's Available in Your Market"
- Body: "ProjectPro delivers 150-250 early-stage commercial projects in your territory every week - before permits are filed. Check your market now."
- CTA button: "Check Availability"
- Hero image: Screenshot of the actual ProjectPro Excel deliverable with project data visible (real data, redact company names if needed)

### Question Set (5 questions)

**Q1: First Name** - Prefilled from Facebook. Zero friction. Builds momentum.

**Q2: Company Name** - Short answer, required. Placeholder: "e.g. Pacific Building Supply Co." Filters out personal accounts immediately.

**Q3: Business Email** - Custom email field, NOT prefilled, required. This is the quality gate. Forced manual entry eliminates Gmail/Hotmail accounts and proves intent. This single change will dramatically improve lead quality versus the previous campaign.

**Q4: Phone** - Prefilled, OPTIONAL. SDR can find phone from company name in 30 seconds via LinkedIn. Keeping it optional prevents abandonment at the last question.

**Q5: Gating Question (ICP Segmentation)** - Multiple choice, required.
"What best describes your company's primary business?"
- A. We sell/distribute building materials to commercial contractors (GOLD - exact ICP)
- B. We manufacture building products sold through distributors (SILVER - acceptable, different GTM)
- C. We're a commercial general contractor (BRONZE - not ICP, but can refer)
- D. Other (DISQUALIFIED - do not call same day)

This single question gives the SDR their opening line before dialing. GOLD leads get called within 5 minutes. SILVER within 2 hours. BRONZE and DISQUALIFIED get an email sequence only.

### Thank You Screen
- Headline: "Your market coverage is being pulled now."
- Body: "A ProjectPro team member will call you within 4 business hours to walk through what's available in your territory. You'll see the actual project data before we discuss anything else."
- CTA button: "See a Sample Report" (link to sample Excel/PDF on website)
- Small text: Include phone number for questions.

---

## 6. Budget Allocation Plan

**Total estimated budget: $1,050-1,400 CAD over 15-20 days**

### Week 1 (Days 1-7): Signal Collection - $490 CAD (~$70/day)
Objective: Identify which 1-2 ads generate leads at acceptable CPL. Do not touch anything.

- All 4 ads running simultaneously
- No adjustments, no pausing, no budget changes during Days 1-4
- Log every lead: GOLD/SILVER/BRONZE/DISQUALIFIED, company size, SDR outcome
- First review at Day 5 (see Decision Points, Section 10)

**What to ignore this week:** CPM, CTR, click volume. At MICRO budget these metrics fluctuate wildly in the first 7 days as Meta's algorithm explores the audience. CPL is the only metric that matters, and it only becomes meaningful after $150+ spend per ad.

### Week 2 (Days 8-14): Pruning and Consolidation - $490 CAD (~$70/day)
Objective: Kill the 1-2 underperforming ads. Let budget concentrate on the winner(s).

- Pause ads with CPL more than 2x the campaign average after Day 7 review
- Do NOT duplicate ad sets or create new audiences (budget cannot support it)
- If 2 ads are within 20% of each other on CPL, keep both running
- Consider refreshing the weakest ad's creative only if it has zero leads after $100+ spend

**Do not scale budget this week.** The MICRO tier scaling rule is: do not scale. Budget increase before Day 14 disrupts whatever fragile signal Meta has built and resets the learning phase entirely.

### Week 3/Final Push (Days 15-20): Conversion Focus - $350-560 CAD (~$70/day)
Objective: Maximize lead volume from proven creative before campaign end.

- Only the 1-2 winning ads remain active
- SDR follow-up speed is the primary lever now, not ad changes
- Begin cold email sequence in parallel (see Section 8) using ICP match from lead form responses as list validation signal
- Day 14 decision determines whether to continue (see Decision Points, Section 10)

---

## 7. KPI Benchmarks and Kill Thresholds

### Primary KPI: Cost per Qualified Lead (GOLD + SILVER responses only)

| Metric | Target | Warning | Kill Threshold |
|--------|--------|---------|---------------|
| CPL (all leads) | $25-40 CAD | $55 CAD | $70+ CAD for 5 consecutive days |
| CPL (GOLD only) | $60-90 CAD | $120 CAD | $150+ CAD after Day 10 |
| Form completion rate | 18-25% | 12% | Below 10% (indicates intro screen problem) |
| GOLD lead % | 30-40% | 20% | Below 15% (indicates audience or hook mismatch) |
| Click-to-form-open rate | 40-60% | 25% | Below 20% (indicates creative/copy problem) |
| SDR contact rate | 60%+ | 40% | Below 30% (lead quality or response time problem) |

### Hard Kill Conditions (pause campaign immediately)
1. Zero leads after $150 CAD spent (roughly 2 days of budget)
2. CPL exceeds $70 CAD for 5 consecutive days with no improvement trajectory
3. GOLD lead percentage drops below 15% for 7 consecutive days

### What "zero conversions to paid" means at this budget:
With 9-14 leads/week and a realistic 10-20% trial-to-paid conversion rate for this ICP at this price point, expect 1-3 trial activations total over 15-20 days. Do not judge the campaign by trial activations alone. Judge it by: (a) CPL trajectory, (b) GOLD lead percentage, (c) SDR pipeline value. A campaign that generates 25 GOLD leads at $50 CAD each, with 3 in active trials, has succeeded at the MICRO tier. Scale the budget to $150+ USD/day to convert pipeline.

---

## 8. Parallel Channel: Cold Email (Required Supplement)

**Cold email is not optional at this budget tier. Meta alone at $50 USD/day cannot produce enough volume for a viable pipeline.**

Cold email runs concurrently with Meta ads starting Day 1, not as a fallback if Meta fails.

### Target List Criteria (mirrors Meta ICP exactly)
- Title: VP Sales, Sales Director, Director of Business Development, Owner/Principal
- Company type: Building material supplier, distributor, manufacturer with distribution arm
- Company size: 50-500 employees
- Geography: USA (prioritize markets with highest commercial construction activity: Texas, Florida, California, Southeast)
- Exclude: General contractors, residential-only suppliers, tools/equipment (not materials)

### Suggested List Sources
1. Apollo.io - filter by industry (wholesale building materials, NAICS 423310, 423390), title, headcount
2. LinkedIn Sales Navigator - same filters, export to Apollo or directly to email tool
3. ZoomInfo if available

### Email Sequence Structure (minimum 4-touch, 14-day window)

**Email 1 (Day 1) - The Specific Problem**
Subject line options:
- "How many projects does your team miss before GC awards?"
- "Dodge shows projects after permits. Your reps are calling too late."
- "[City] commercial pipeline - are you seeing these projects?"

Body approach: One specific problem, one specific claim about ProjectPro, one link to sample data. 3 short paragraphs max. No features list. No "I hope this email finds you well."

**Email 2 (Day 4) - The Price Contrast**
Subject: "FYI - ProjectPro vs Dodge price comparison"
Body: Brief, factual comparison. Dodge $6K-15K/year vs ProjectPro $199-399/month. Same commercial project data. Question: "Would it be worth a 15-minute call to see what's in your market right now?"

**Email 3 (Day 8) - The Social Proof / Specificity**
Subject: "150-250 projects/week in your territory"
Body: What the Excel deliverable actually looks like. Project name, location, type, stage, estimated value. Make it concrete. Offer to send a sample of their specific market.

**Email 4 (Day 14) - The Close or Disqualify**
Subject: "Last note on [Company Name]"
Body: Acknowledge it may not be the right time. Offer a specific ask: "If you want the free 30-day trial, I can activate it now - no call needed, just reply 'yes' and I'll send the setup link." This catches the interested-but-busy prospect.

### Cold Email Tools
- Instantly.ai (already in use per client files) or Smartlead
- Warm sending domain required (aged 60+ days, SPF/DKIM/DMARC configured)
- Send volume: start at 30/day per mailbox, scale to 80/day by week 2 if inbox placement is clean
- Target: 300-500 total sends over the campaign window

### Expected Cold Email Results (conservative)
- Open rate: 35-50% (with strong subject lines and warm domain)
- Reply rate: 3-8%
- Positive reply rate: 1-3%
- Estimated meetings/trials booked: 3-8 over the 20-day window

Combined with Meta's 15-30 leads, the total pipeline becomes 18-38 contacts, making the 15-20 day window genuinely viable for 2-5 trial activations and 1-2 paid conversions.

---

## 9. SDR Response Time SLA

**This is where campaigns at this budget tier are won or lost. Creative drives the lead. Response speed drives the conversion.**

### Response Time Requirements by Lead Tier

| Lead Tier | Response Requirement | Method | Notes |
|-----------|---------------------|--------|-------|
| GOLD (building material supplier/distributor) | Within 5 minutes during business hours | Phone call first, SMS if no answer, email within 1 hour | Speed to lead at this tier is the single highest-leverage variable |
| SILVER (manufacturer with distribution) | Within 2 hours during business hours | Email first, phone follow-up same day | Different GTM conversation required |
| BRONZE (GC or adjacent) | Email within 4 hours | Email only | May be a referral source; do not deprioritize entirely |
| DISQUALIFIED (Other) | Email within 24 hours | Automated email sequence only | Do not allocate SDR time |
| Cold email positive reply | Within 1 hour | Reply in-thread, offer call link | Reply speed matters as much as Meta leads |

### Why 5 Minutes for GOLD Leads

Harvard Business Review research consistently shows lead response time is the single most predictive variable in B2B conversion, more than price, product fit, or even lead quality. A GOLD lead responding in 5 minutes versus 60 minutes sees 21x improvement in qualification rate. At $60-90 CAD per GOLD lead, a 5-minute response protocol is worth more than any creative optimization.

### SDR Script Opening (by lead tier)

GOLD opener: "Hi [Name], this is [SDR] from ProjectPro. You just requested access to our commercial project pipeline - I wanted to reach out right away and show you exactly what's available in [State/Region] this week. Do you have 10 minutes now or later today?"

SILVER opener: "Hi [Name], this is [SDR] from ProjectPro. I see you manufacture [product type] - I wanted to ask a quick question about how your reps currently identify commercial bid opportunities before I waste your time with the demo. Do you have 2 minutes?"

### SDR No-Answer Protocol
1. Leave voicemail (15 seconds, state company, state that you're following up on their request for market data, state callback number)
2. Send SMS immediately after voicemail: "Hi [Name], just left a voicemail - this is [Name] from ProjectPro re: your market pipeline request. Available for a quick call today?"
3. Send email within 1 hour with sample project data for their state
4. If no response after 48 hours, add to automated nurture sequence (2 more touches over 7 days)

---

## 10. Decision Points

### Day 5 Review
**Question:** Is there enough signal to identify a winner?

**Data needed:**
- CPL for each ad (requires at minimum $100 CAD spend per ad, so ads launched at $70/day/4 ads = ~$17.50/ad/day, meaning each ad has ~$87 CAD by Day 5)
- Lead volume per ad
- Form completion rate overall

**Decision tree:**
- If 1-2 ads have CPL more than 2x the campaign average AND zero GOLD leads: pause those ads immediately, do not wait for Day 7
- If all 4 ads have zero leads after $200+ total spend: pause campaign, diagnose intro screen (headline or image likely the problem), relaunch with revised creative on Day 7
- If CPL is within range and GOLD% is above 20%: do nothing. Let it run.

### Day 7 Review
**Question:** Which ads survive to Week 2?

**Action regardless of results:** Review all leads generated. Call any GOLD/SILVER lead that was not reached in Day 1-7 before doing anything else. The SDR pipeline review is more important than the ad review at this stage.

**Ad decisions:**
- Keep: Any ad with CPL below 1.5x campaign average
- Pause: Any ad with CPL above 2x campaign average and fewer than 3 leads total
- Keep if borderline: If an ad has 1-2 leads but they are both GOLD, do not pause on CPL alone. Quality signal matters at low volume.

**Creative refresh decision:** Only refresh an ad's creative if it has spent more than $120 CAD with zero leads. A new hook angle on the same format takes 2-4 hours to produce and can salvage the remaining budget.

### Day 14 Review
**Question:** Continue, scale, or stop?

This is the primary go/no-go decision for campaign continuation beyond Day 20 and budget increase recommendation.

**Continue and scale (recommend increasing to $150+ USD/day):**
- 15+ total leads generated
- GOLD lead percentage above 25%
- At least 1 trial activation or 1 SDR-qualified active conversation
- CPL trending downward or stable (not increasing week over week)

**Continue at current budget:**
- 10-15 total leads generated
- GOLD% above 20%
- CPL stable
- No trial activations yet but 2-3 warm SDR conversations
- Recommendation: extend campaign 2 additional weeks at $70/day while cold email volume increases

**Stop Meta, double down on cold email:**
- Fewer than 10 leads generated
- CPL above $60 CAD average
- GOLD% below 20%
- No trial activations
- Recommendation: pause Meta, reallocate ad budget to cold email tool/list ($500 CAD goes further in email at this stage)

**Full stop:**
- Fewer than 5 leads after $600+ CAD spend
- Zero SDR conversations
- Kill threshold hit on multiple metrics
- Recommendation: full campaign debrief, offer/positioning review before any relaunch

---

## Appendix: Campaign Naming and Setup Checklist

**Campaign name:** `ProjectPro | Leads | Native Form | USA | Apr 2026`

**Pre-launch checklist:**
- [ ] Lead form privacy policy URL accessible and returns 200
- [ ] Hero image is actual ProjectPro deliverable screenshot (not stock)
- [ ] Business email field is set to custom (NOT prefilled)
- [ ] Phone field is set to OPTIONAL
- [ ] Gating question has 4 answer options (GOLD/SILVER/BRONZE/DISQUALIFIED)
- [ ] Thank you screen CTA links to live sample report URL
- [ ] Lead notification is connected to SDR workflow (Zapier/n8n to Slack or SMS within 60 seconds of submission)
- [ ] SDR is briefed on GOLD/SILVER/BRONZE protocol and response time SLA
- [ ] Cold email domain warmed and first sequence loaded in Instantly
- [ ] Reporting dashboard set up (even manual spreadsheet): Date | Leads | GOLD | SILVER | CPL | SDR calls | Trials

**Lead routing (critical - do not skip):**
Meta leads must hit the SDR's phone within 60 seconds of submission. The fastest implementation: Meta Lead Ads webhook via n8n to Slack DM + SMS to SDR phone number. This is 30 minutes of setup and directly determines whether the 5-minute GOLD lead SLA is achievable.

---

*Strategy version 1.0 | MonteKristo AI | April 2026*
*Next review: Day 5 of campaign launch*
