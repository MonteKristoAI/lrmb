---
type: template
client: AiiACo
date: 2026-04-11
template_for: T1 long-form pillar (2500-3500 words)
filled_example: how-to-integrate-ai-into-follow-up-boss
tags: [aiiaco, template, perfect-post]
---

# AiiACo Perfect Post Template

**Purpose**: the canonical structure every post on aiiaco-blog.pages.dev must follow. Exact markers for AEO, FAQPage schema extraction, internal linking, and quality gate pass.

This file shows the structure BOTH as a blank template AND as a filled example for one real Phase 1 post.

---

## PART A: Blank template structure

```
<!-- META
title: {TITLE 50-60 chars, includes primary keyword in first 50 chars}
slug: {kebab-case slug}
description: {META DESC 140-160 chars, primary keyword in first 50 chars}
date: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
category: {Pillar Guide | How-To | Opinion | Explainer | Case Study | Comparison}
image: /blog/images/og-default.webp
image_alt: {Descriptive alt text with primary keyword}
read_time: {integer, minutes}
subtitle: {One-line editorial subtitle, no period at end}
direct_answer: {40-80 word AEO passage, complete answer to primary keyword query}
-->

<p>{Opening paragraph - operator observation or contrarian stake. 2-4 sentences. Patterns A or D from VOICE-CORPUS section 4.}</p>

<p>{Second paragraph - set up the framework or thesis. Name specific tools or platforms. 3-4 sentences.}</p>

<h2>{Primary H2 - framework declaration or first phase}</h2>

<p>{Paragraph introducing the H2 section. 2-3 sentences. Establish specificity.}</p>

<h3>{Sub-section H3 with specific noun phrase}</h3>

<p>{2-3 sentences of explanation with at least one specific tool, API, or metric named.}</p>

<h3>{Sub-section H3 - variation, don't start with same word}</h3>

<p>{Explanation. Include one data point or timeline commitment.}</p>

<h2>{Second H2 - new section, new angle}</h2>

<p>{Intro paragraph for section 2.}</p>

<ul>
  <li>{Specific list item 1 - include a platform name or metric}</li>
  <li>{Specific list item 2 - include a different platform or metric}</li>
  <li>{Specific list item 3 - compliance or governance reference}</li>
  <li>{Specific list item 4 - timeline or cost number}</li>
</ul>

<p>{Closing paragraph for the section. Move the argument forward, don't summarize.}</p>

<aside class="callout">
  <p class="callout-label">{Operator signal | Compliance note | Math check | Build note | Counter-example}</p>
  <p>{1-3 sentences. Most valuable when a specific threshold, dollar amount, or rule is stated.}</p>
</aside>

<h2>{Third H2 - typically "How long does it take" or "Who builds it" for pillar posts}</h2>

<p>{Paragraph with actual timeline or cost number. 3-5 sentences.}</p>

<p>{Close with Pattern F punch line from VOICE-CORPUS.}</p>

<section class="faq-section">
  <h2>Frequently Asked Questions</h2>

  <h3>{FAQ Q1 - ideally from a real PAA question in competitor-gap-analysis.md section "All 36 PAA questions"}</h3>
  <p>{Complete 40-80 word answer. Citation-ready for AI Overview. Specific tools or metrics.}</p>

  <h3>{FAQ Q2}</h3>
  <p>{Answer.}</p>

  <h3>{FAQ Q3}</h3>
  <p>{Answer.}</p>

  <h3>{FAQ Q4}</h3>
  <p>{Answer.}</p>

  <h3>{FAQ Q5}</h3>
  <p>{Answer.}</p>

  <h3>{FAQ Q6}</h3>
  <p>{Answer.}</p>
</section>

<div class="article-tags">
  <span class="article-tag">#{tag1}</span>
  <span class="article-tag">#{tag2}</span>
  <span class="article-tag">#{tag3}</span>
  <span class="article-tag">#{tag4}</span>
  <span class="article-tag">#{category}</span>
</div>
```

---

## PART B: Filled example - Post 4

Below is a complete, ship-ready example for Phase 1 Post 4 (`how-to-integrate-ai-into-follow-up-boss`). Use this as the gold standard when writing any subsequent post.

```html
<!-- META
title: How to Integrate AI Into Follow Up Boss (Operator Playbook)
slug: how-to-integrate-ai-into-follow-up-boss
description: Step-by-step guide to integrating AI into Follow Up Boss via the official REST API. Lead scoring, automated sequences, listing content, pipeline intelligence without CRM migration.
date: 2026-04-14
updated: 2026-04-14
category: How-To
image: /blog/images/og-default.webp
image_alt: AiiACo Follow Up Boss AI integration playbook for real estate brokerages
read_time: 9
subtitle: A 4-step integration playbook using the Follow Up Boss REST API, webhooks, and custom fields
direct_answer: Integrate AI into Follow Up Boss in four steps: (1) map the current CRM workflow, (2) authenticate against the Follow Up Boss REST API with an API key, (3) wire AI capabilities to webhook events (lead created, stage changed, note added), and (4) route AI outputs back to Follow Up Boss via custom fields and scheduled sequences. No data migration required. Agents keep the same interface.
-->

<p>Most real estate brokerages already run Follow Up Boss. It has 60,000+ agents on it, a clean REST API, and webhooks that fire on every lead event. The problem is not that agents lack a platform. The problem is that agents are still doing the work the platform should be doing: triaging leads, writing follow-up sequences, updating deal stages, drafting listing descriptions, and manually coordinating with lenders and title.</p>

<p>AI integration removes the coordination drag without replacing Follow Up Boss. This post walks through the exact four-step process AiiACo uses to bolt an AI operational layer on top of an existing Follow Up Boss deployment.</p>

<h2>Step 1: Map the current Follow Up Boss workflow</h2>

<p>Before calling a single API endpoint, audit every touchpoint in the existing CRM. The questions to answer:</p>

<ul>
  <li>Where do inbound leads enter Follow Up Boss (Zillow, Realtor.com, IDX sites, open house scans, referral imports)?</li>
  <li>What percentage of leads get triaged within the first 5 minutes?</li>
  <li>What is the average number of follow-up touches per lead, and are they triggered manually or via action plans?</li>
  <li>Which stages in the Follow Up Boss pipeline are updated by agents vs by admins vs by nobody?</li>
  <li>What custom fields already exist, and which ones are abandoned?</li>
</ul>

<p>The output is a map of where manual work currently lives. Most brokerages running Follow Up Boss discover that 60 to 70 percent of agent time on the platform goes to activities that have clear AI automation patterns. The mapping usually takes 2 to 4 hours for a 20-agent brokerage and doubles for every additional 40 agents.</p>

<h2>Step 2: Authenticate against the Follow Up Boss API</h2>

<p>Follow Up Boss exposes a REST API at <code>https://api.followupboss.com/v1/</code>. Authentication is HTTP Basic with the API key as the username and an empty password. Get the key from Settings, then API in the Follow Up Boss admin panel. The account owner must generate the key.</p>

<p>Once authenticated, test against the <code>/people</code> endpoint with a GET request to confirm access. The response returns paginated contacts with all custom fields, stages, and tags. If the API returns 401, the key is either wrong or has been rotated. If it returns 403, the account owner has not enabled API access at the subscription tier (Pro plan or above).</p>

<h3>Required scopes for an AI integration</h3>

<p>AiiACo integrations typically need read and write access to people (contacts), events (webhook targets), notes (for agent handoffs), and custom fields (for AI scores and tags). Follow Up Boss does not expose granular scopes; a single API key gets full account access. This means the API key must be stored in a secrets manager, never committed to a repo.</p>

<h2>Step 3: Wire AI capabilities to webhook events</h2>

<p>Follow Up Boss supports webhooks for these event types: <code>peopleCreated</code>, <code>peopleUpdated</code>, <code>peopleDeleted</code>, <code>notesCreated</code>, <code>tasksCreated</code>, <code>dealsCreated</code>, <code>dealsUpdated</code>, and <code>communicationsCreated</code>. Subscribe via the API by POSTing to <code>/webhooks</code> with the event type and the destination URL.</p>

<p>Wire AI capabilities to specific events:</p>

<h3>Inbound lead scoring on peopleCreated</h3>

<p>Every new lead fires a <code>peopleCreated</code> webhook. Route it to an AI scoring endpoint that evaluates intent signals (source, message body, property search history if available from the IDX integration), budget indicators (price range searched), timeline (move date, rental expiry), and fit (geography, property type). Write the score back to Follow Up Boss via a custom field called <code>ai_lead_score</code> plus a tag like <code>ai-scored-high</code>, <code>ai-scored-medium</code>, or <code>ai-scored-low</code>. Agents see the score in the normal contact view. No new UI.</p>

<h3>Automated multi-touch nurture on stage change</h3>

<p>When an agent moves a lead from New to Contacted, fire an AI sequence generator that drafts 5 personalized follow-up messages over a 21-day window. Push each message to Follow Up Boss as a scheduled task assigned to the agent, with the draft in the task note. The agent reviews and sends (or approves auto-send for vetted templates). Agents stay in control but save 45 minutes per lead on the coordination work.</p>

<h3>Listing content generation on note events</h3>

<p>When an agent adds a note with the trigger phrase "new listing", fire a listing content generator that pulls the MLS data and drafts a description, neighborhood summary, and buyer pitch copy. Push the output back as a new note with a <code>draft-ai-listing</code> tag. Listing agents review and publish to MLS.</p>

<h3>Pipeline intelligence on dealsUpdated</h3>

<p>Every deal stage change fires a <code>dealsUpdated</code> webhook. Feed this into a pipeline intelligence model that computes deal velocity, at-risk probability, and next-best-action per opportunity. Surface the output via custom fields on the deal (<code>ai_close_probability</code>, <code>ai_next_action</code>, <code>ai_risk_flag</code>) so the broker of record sees the data in the standard Follow Up Boss reports.</p>

<h2>Step 4: Deploy without platform migration</h2>

<p>Everything above runs as a separate service (n8n workflow, custom middleware, or hosted Python app) that talks to Follow Up Boss over the API. No data migration. No replacement of Follow Up Boss. Agents continue logging in to the same URL and seeing the same interface. What changes is that the coordination work happens automatically in the background.</p>

<p>Typical deployment timeline for a 40-agent brokerage: first operational module (lead scoring and basic follow-up automation) ships in 3 to 5 weeks. Full four-capability rollout takes 8 to 12 weeks. AiiACo owns every phase of the build including the Follow Up Boss API wiring, model tuning, agent training session, and month-by-month performance review.</p>

<aside class="callout">
  <p class="callout-label">Compliance note</p>
  <p>Every AI-generated listing description and outbound message must be filtered through a Fair Housing Act compliance layer before sending. The filter flags discriminatory language patterns, steering violations, and prohibited terminology. No exceptions. A single FHA complaint costs more than every dollar the AI integration will save in its first year.</p>
</aside>

<h2>What this costs and how long it takes</h2>

<p>A full Follow Up Boss AI integration for a 40-agent brokerage runs 8 to 12 weeks, with the first operational module live in 3 to 5 weeks. Engagement costs fall in the $45,000 to $120,000 range depending on scope, number of custom fields, and whether listing content generation is included. The Follow Up Boss subscription itself stays on the Pro plan ($500 per user per year as of April 2026). Agents do not need new licenses or training on a new tool. Treat it as infrastructure, not a new tool, and it will compound quarter over quarter.</p>

<section class="faq-section">
  <h2>Frequently Asked Questions</h2>

  <h3>Can I integrate AI into Follow Up Boss without replacing it?</h3>
  <p>Yes. AiiACo integrates AI directly into Follow Up Boss via the official REST API. Lead scoring, automated follow-up sequences, listing content generation, and pipeline intelligence all run on top of Follow Up Boss. Agents continue using the same CRM interface. No data migration. No plan change beyond Pro tier if API access is not already enabled.</p>

  <h3>How does an AI SDR work inside Follow Up Boss?</h3>
  <p>The AI SDR subscribes to the Follow Up Boss peopleCreated webhook. Every new lead fires a scoring model that writes back a score, tag, and suggested first message as a task. An agent reviews the task and fires the message or approves auto-send for pre-vetted templates. The AI never replaces the agent's relationship; it removes the triage and first-touch coordination load.</p>

  <h3>How long does the integration take for a mid-size brokerage?</h3>
  <p>For a 40-agent brokerage on Follow Up Boss Pro, the first operational module (lead scoring and basic follow-up automation) ships in 3 to 5 weeks. Full rollout of four capabilities (scoring, sequences, listing content, pipeline intelligence) takes 8 to 12 weeks. Full costs run $45,000 to $120,000 including the API wiring, model tuning, and agent training session.</p>

  <h3>What about Fair Housing Act compliance for AI-generated listings?</h3>
  <p>Every AI-generated listing description and outbound message must be filtered through an FHA compliance layer before publishing. The filter flags discriminatory language patterns, steering violations, and prohibited terminology. AiiACo includes this layer in every real estate engagement. Any AI vendor that cannot explain their FHA compliance approach is not ready for real estate deployment.</p>

  <h3>Do I need to pay for a higher Follow Up Boss plan?</h3>
  <p>Only if your brokerage is not already on Follow Up Boss Pro. Pro tier includes API access, webhooks, and custom fields. The Growth plan does not expose webhooks and will not support the full integration. Upgrading from Growth to Pro costs roughly $200 more per user per year as of April 2026. Budget for the plan upgrade alongside the integration cost.</p>

  <h3>Can the AI write listing descriptions that actually sound like a human wrote them?</h3>
  <p>Yes, when the model is tuned against your brokerage's real listing copy and the FHA compliance filter runs on every output. Generic AI listing content sounds AI-generated because vendors use generic prompts. AiiACo tunes the listing generator on 50 to 200 real approved listings from the brokerage, then runs every output through FHA review. The difference is material; agents stop flagging AI-generated drafts within 2 weeks of tuning.</p>
</section>

<div class="article-tags">
  <span class="article-tag">#real estate</span>
  <span class="article-tag">#follow up boss</span>
  <span class="article-tag">#crm integration</span>
  <span class="article-tag">#ai integration</span>
  <span class="article-tag">#how-to</span>
</div>
```

---

## PART C: Quality gate checklist (mandatory before commit)

- [ ] Primary keyword appears in title, first 100 words, at least one H2, meta description
- [ ] Direct Answer block is 40-80 words and answers the primary keyword query as a complete thought
- [ ] FAQ section has 5 to 7 H3/P pairs
- [ ] At least 3 PAA questions from competitor-gap-analysis.md section "All 36 PAA questions" are used verbatim as FAQ headers
- [ ] At least 3 named entities from `research/geo-readiness.md` 30-entity graph appear in the body
- [ ] At least one specific tool, API endpoint, or metric is named in each H2 section
- [ ] At least one timeline commitment is published (weeks / dollars / percentages)
- [ ] At least one internal link to an aiiaco.com service page (absolute URL only, not relative)
- [ ] Zero em dashes. Zero en dashes. Verified by python3 check.
- [ ] Zero banned words from STYLE.md banned vocabulary list
- [ ] Zero opener clichés ("In today's...", "In the ever-evolving...", "As AI transforms...")
- [ ] Author byline links to `#nemr-hallak` Person schema node
- [ ] Article tags section has 4 to 6 tags, last one is the category
- [ ] Image path is `/blog/images/{slug}.webp` or default `/blog/images/og-default.webp`
- [ ] Word count falls in the template target (T1: 2500-3500, T2: 1200-1800, T3: 1200-1800, T4: 1500-3000)
- [ ] At least one pattern from VOICE-CORPUS section 4 is used (contrastive framing, numbered declaration, specific timeline, operator observation opener, rhetorical objection framing, or punch-line close)

## PART D: Post-publish verification (first 48 hours)

- [ ] URL returns HTTP 200
- [ ] `curl /path/ | grep application/ld+json` returns BlogPosting, BreadcrumbList, FAQPage schemas
- [ ] Google AI Overview query test: query the primary keyword on Google, log whether AiiACo passage is cited
- [ ] Perplexity query test: query the primary keyword, log whether AiiACo is in the top 5 sources
- [ ] ChatGPT Web Search query test: same
- [ ] Post row added to `SITEMAP.md` with publish date, primary keyword, schema status, citation status
- [ ] Citation tracking queue entry added for Friday of same week
