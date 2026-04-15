# SDS / Warrior — Content Templates

**Purpose:** Every SDS blog post uses one of the 5 templates below. Template choice is specified in the brief (`briefs/XX-slug.md`) and recorded in `CONTENT.md`.

**Why these 5:** They are the formats that (a) match how wireline engineers actually consume technical information, (b) maximize AI citation surface, (c) allow Christopher to approve copy quickly without round-tripping style questions.

Each template has:
- When to use it
- Required sections (in order)
- Word count range
- Minimum H2 count
- Key formatting rules
- Example headline patterns

---

## Template T1 — Technical Deep Dive

### When to use
When the topic is an engineering concept that requires explanation from first principles. Examples: "How addressable switches communicate with the panel", "What happens inside the Warrior Universal Panel when you load a new tool string."

### Target audience
Electronics Technician / Tech Manager, Field Logging Engineer, Perforating Engineer

### Word count
2,200 - 3,000

### Required sections (in order)
1. **Failure mode opener** (150 words) — a named scenario where the wrong choice caused a measurable problem. No abstract theory.
2. **Key Takeaways box** (5 bullets with statistics) — mandatory per Blog CLAUDE.md
3. **Citation capsule** (60-80 words) — the AI-liftable paragraph that defines the key entity
4. **Anatomy section** — component-by-component or signal-by-signal breakdown
5. **How it actually works in the field** — operational walkthrough
6. **Comparison table** — minimum 4 rows × 3 columns
7. **Chart or diagram** — SVG per Blog/SVG-REFERENCE.md
8. **Failure modes section** — what goes wrong, why, how to prevent
9. **The Warrior difference** — how SDS handles this differently (reference Weatherford credential where applicable)
10. **FAQ** (5+ Q&A pairs, 40-60 words each)
11. **CTA matched to persona** (demo / quote / user forum)
12. **Further reading** (4 internal links, verified against SITEMAP.md)

### H2 minimum
7 (beyond the title)

### Key rules
- Technical vocabulary acceptable (audience knows "CCL", "LAS", "tension on", "stage firing")
- First-mention definitions inline in parentheses
- Every claim has a citation or a named expert
- Diagrams must be real, not generic oil & gas stock

### Headline patterns
- "How [System] Actually Works [When/Where]"
- "Inside the [Component]: [X] Things You Didn't Know About [Topic]"
- "[Topic] Explained: From [Starting Point] to [Outcome]"

---

## Template T2 — Comparison / Vs Post

### When to use
Multiple solutions exist and the buyer needs help choosing. Examples: "DynaStage vs Titan ControlFire vs G&H DSS", "Warrior vs MAXIS vs InSite", "Leasing vs buying wireline equipment".

### Target audience
Service Company Leader, Fleet/Procurement Lead, Perforating Engineer

### Word count
2,500 - 3,200

### Required sections
1. **Scenario opener** (100 words) — "You need to choose between X and Y because Z."
2. **Key Takeaways box**
3. **Citation capsule**
4. **The 5 criteria that actually matter** — the buyer's real decision framework, not the vendor's marketing pitch
5. **Head-to-head comparison table** — 5+ rows × 3+ columns; include at least 1 objective data point (safety cert, operation count, cost, compatibility %)
6. **Winner for [use case 1]** — e.g., "Winner for perforating-heavy operations"
7. **Winner for [use case 2]** — e.g., "Winner for cased-hole logging fleets"
8. **Winner for [use case 3]**
9. **Case study or evidence section** — real data, named operator if possible
10. **The honest limitations** — what the winner can't do
11. **FAQ (5+)**
12. **CTA — "Request a custom comparison for your operation"**
13. **Further reading**

### H2 minimum
8

### Key rules
- **Must be neutral in voice.** If every comparison winds up being Warrior, the post loses credibility. Pick specific use cases where competitors win.
- Cite each competitor's public data directly — link to their own spec sheets
- Include a "what would make [competitor] win?" section
- No marketing claims without sources
- When SDS is the winner, the reason must be specific (not "we're better")

### Headline patterns
- "[A] vs [B] vs [C]: An Independent Comparison for [Use Case]"
- "Which [System] Is Right For [Scenario]? A [Criterion]-Based Breakdown"
- "The [Topic] Decision: [Option 1] or [Option 2]?"

---

## Template T3 — Regulatory / Standards Primer

### When to use
A regulation, standard, or compliance requirement affects the audience's daily work. Examples: "API RP 67 4th edition for wireline crews", "BSEE Safety Alert 274 lessons", "BOEM wireline intervention requirements".

### Target audience
Field Service Manager, Perforating Engineer, Service Company Leader

### Word count
2,500 - 3,000

### Required sections
1. **Regulatory context opener** (150 words) — "On [date], the [authority] published / will publish [document]. Here's what it means for your operations."
2. **Key Takeaways box** (with specific regulatory action items)
3. **Citation capsule** (what the standard is + where to find it)
4. **What the standard actually requires** — plain-English version of the regulatory language
5. **What's changing from the previous version** — side-by-side table
6. **The practical implications at the wellsite** — what this means for rigging up, running the job, paperwork
7. **Compliance checklist** — actionable items with checkboxes (markdown or HTML)
8. **What the Warrior platform already handles** — where applicable
9. **Common mistakes and how to avoid them**
10. **FAQ** (5+, focused on compliance questions)
11. **CTA — "Download the compliance checklist PDF"** (or "Talk to our compliance team")
12. **Further reading**

### H2 minimum
8

### Key rules
- Cite the original standard/document with edition number and publication year
- Do NOT paraphrase regulatory language incorrectly — use direct quotes where precision matters
- Include a disclaimer where appropriate: "This post is not legal advice. Consult your compliance team."
- Use checkbox lists for actionable items (✓)
- Link to the official source (API, BSEE, OSHA, etc.)

### Headline patterns
- "What [Standard] [Edition] Means for [Audience]"
- "[Authority] Just [Changed X]: Here's What Your [Role] Needs to Do"
- "The [Compliance Topic] Handbook for [Audience]"

---

## Template T4 — Thought Leadership / Industry Analysis

### When to use
A structural shift in the industry requires commentary and SDS has a differentiated view. Examples: "Why Weatherford distributes a competitor's wireline panel", "The geothermal pivot and what it means for wireline fleets", "The end of the proprietary wireline era".

### Target audience
Service Company Leader, Operator Company Man, Fleet/Procurement Lead

### Word count
2,000 - 2,800

### Required sections
1. **Provocative opener** (150 words) — a fact that stops the reader ("Weatherford, one of the world's largest wireline companies, sells the Warrior panel — built by a 34-employee engineering firm in Houston.")
2. **Key Takeaways box**
3. **Citation capsule**
4. **The context** — why this matters now
5. **The evidence** — data, citations, named examples
6. **The contrarian view** — SDS's position, backed by the data
7. **What this means for [audience]** — concrete implications
8. **What to watch next** — predictions or indicators
9. **A specific action the reader can take today**
10. **FAQ** (4-5 pairs addressing objections)
11. **CTA — "Read the Warrior architecture brief" or "Schedule a strategic consultation"**
12. **Further reading**

### H2 minimum
6

### Key rules
- Must have an actual point of view, not "on one hand, on the other hand"
- Every claim backed by data OR by a named expert's opinion
- Voice: confident but not arrogant
- Acknowledge counter-arguments before dismissing them
- Do not preach — show, don't tell

### Headline patterns
- "Why [Unexpected Fact] Matters More Than [Conventional Wisdom]"
- "The [Industry Shift] Nobody Is Talking About"
- "[Provocative Claim]: What It Means For [Audience]"

---

## Template T5 — Business Case / ROI Analysis

### When to use
The reader needs to justify a purchase to a finance or operations leader. Examples: "Warrior leasing at $2,500/month math", "TCO of proprietary vs open wireline systems", "The 90-day payback on a Universal Panel upgrade".

### Target audience
Service Company Leader, Fleet/Procurement Lead, Operator completion engineer

### Word count
2,000 - 2,600

### Required sections
1. **Scenario opener** — a specific buyer facing a specific capex decision
2. **Key Takeaways box** (with cost numbers)
3. **Citation capsule** (the core business claim)
4. **The current-state cost structure** — what the buyer is paying today, itemized
5. **The proposed-state cost structure** — what they would pay with Warrior/leasing
6. **Side-by-side cost table** — 12-24 month view with line items
7. **The assumptions** — explicit list of what's baked into the math
8. **Break-even analysis** — when does the new option become cheaper?
9. **Risk adjustment** — what could make the numbers worse
10. **A 3-scenario view** — best case / expected / worst case
11. **What similar operators have experienced** (case study if available, hypothetical if not)
12. **FAQ** (cost-focused objections)
13. **CTA — "Request a custom ROI analysis" or "Download the cost calculator"**
14. **Further reading**

### H2 minimum
8

### Key rules
- **All numbers must be either (a) verifiable from published sources or (b) explicitly labeled as assumptions**
- No magic numbers without sourcing
- Cost comparisons must include maintenance, training, and downtime — not just sticker price
- Avoid being misleading about "total savings" — be honest about when the math breaks

### Headline patterns
- "The [Product] Math: [Specific Cost Claim]"
- "Is [Option A] Really Cheaper Than [Option B]? A 10-Year TCO Breakdown"
- "[Budget Decision]: The 5 Numbers That Matter"

---

## Template Selection Guide

Use this table to pick a template fast:

| If the post is about… | Template |
|---|---|
| How a piece of technology works | T1 — Technical Deep Dive |
| Choosing between multiple products | T2 — Comparison |
| A regulation or standard | T3 — Regulatory Primer |
| An industry trend or strategic shift | T4 — Thought Leadership |
| A cost or ROI decision | T5 — Business Case |

**Launch post template mapping:**

| Post | Template |
|---|---|
| #1 Vendor-agnostic architecture | T4 — Thought Leadership |
| #2 Warrior Universal Panel explained | T1 — Technical Deep Dive |
| #3 Addressable switches comparison | T2 — Comparison |
| #4 Geothermal wireline pivot | T4 — Thought Leadership |
| #5 API RP 67 4th edition | T3 — Regulatory Primer |
| #6 Why Weatherford distributes Warrior | T4 — Thought Leadership |
| #7 Wireline leasing economics | T5 — Business Case |
| #8 Wireline engineer career guide | T1 — Technical Deep Dive (about a career) |

---

## Mandatory Structural Elements (All Templates)

Regardless of template choice, every SDS post must include:

1. **SEO meta comment block** (per Blog/WORDPRESS.md when on WordPress; platform-appropriate otherwise)
2. **JSON-LD schema** — BlogPosting + FAQPage + BreadcrumbList minimum (Person/Author once we have Christopher's bio)
3. **Author byline immediately after H1**
4. **Key Takeaways box** (5 bullets, 2+ with statistics)
5. **Citation capsule** in the first 300 words — the AI-liftable passage
6. **Comparison table** or chart (at least 1 of each per post, more for pillar posts)
7. **FAQ section** (5+ pairs, 40-60 words each, self-contained)
8. **3-5 internal links** from SITEMAP.md
9. **3-5 external links** Tier 1-3 from SOURCES.md
10. **Named technical reviewer** (placeholder: "Technical review: SDS Houston engineering team" until we have names)
11. **CTA matched to persona + hub**
12. **4 Further Reading links** that don't duplicate body links
13. **Zero em dashes** (replace with commas, colons, hyphens, or rewrite)
14. **Zero banned vocabulary** (check `clients/sds/copy/banned-vocab.md`)

---

## Anti-Templates (Do Not Use)

These common blog formats are banned for SDS:

- ❌ **The listicle** ("10 Wireline Tips"). Oilfield engineers hate listicles.
- ❌ **The personality post** ("What wireline taught me about life"). Wrong register.
- ❌ **The company news post** ("SDS announces..."). Goes to the press release page, not the blog.
- ❌ **The generic industry primer** ("What is oil and gas?"). Wrong audience level.
- ❌ **The "how we built this" product story.** Unless there's a genuine engineering lesson, nobody cares.
- ❌ **The thought-leadership without evidence.** Opinions without data get thrown out.
- ❌ **The SEO-stuffed how-to** ("How to buy wireline equipment in 2026"). Transparent AI output.
