# SDS / Warrior — AI Citation Strategy

**The thesis:** For a niche this small (15,590/mo total keyword volume), the primary distribution channel is **AI answer surfaces** (ChatGPT, Perplexity, Google AI Overview, Bing Copilot). A well-structured SDS post that becomes the canonical citation for 5-10 specific wireline questions is worth more than a post that ranks #3 for a high-volume keyword and gets clicked 200 times.

---

## 1. Where the Audience Actually Asks Questions

For a wireline engineer, a typical 2026 research workflow looks like this:

1. **Problem arises** at the wellsite or in the shop
2. **First query goes to ChatGPT or Perplexity**, not Google — they want a synthesized answer, not 10 blue links
3. **If the AI answer is good enough**, the engineer reads only the cited sources they trust
4. **If the AI answer is vague**, they click the most authoritative link in the citation list

**The implication:** Our job is to be in the citation list. Ranking #1 on Google is a secondary goal. Being the #2 citation in a ChatGPT answer to "what is an addressable switch?" is worth more than being the #1 organic result for "addressable switch" on Google.

---

## 2. What AI Models Actually Cite

From testing (to be run via `/blog geo` skill post-launch) and from known heuristics of the major AI models:

### ChatGPT / GPT-4 class
- **Prefers:** Wikipedia, academic sources (.edu), standards bodies (.gov, .org), named-author technical papers
- **Cites in wireline domain:** SLB glossary, SPE abstracts, Wikipedia, sometimes Drilling Contractor
- **Rarely cites:** vendor blogs, product pages, press releases
- **Triggers for citation:** definitional sentences with entity names, structured lists, tables with clear headers

### Perplexity
- **Prefers:** explicit publication dates, named authors, recent content
- **Cites in wireline domain:** OnePetro, JPT, vendor product pages (when commercial intent detected), Rigzone
- **Triggers:** FAQ schema, H2 question headings, clear source citations inline

### Google AI Overview (formerly SGE)
- **Prefers:** first 10 organic results + featured snippet winners
- **Cites in wireline domain:** whatever ranks #1-5 + Wikipedia + vendor sites for commercial queries
- **Triggers:** exact-match H2 questions, FAQ schema, structured tables

### Bing Copilot
- **Prefers:** similar to Perplexity but slightly favors Microsoft-ecosystem-friendly domains
- **Cites in wireline domain:** mix of trade pubs and vendor sites
- **Triggers:** clear entity definitions, comparison tables

---

## 3. Citation Optimization Rules (applied to every SDS post)

These rules are enforced by the `/blog geo` skill before any post is published. Target `/blog geo` score: **85+ / 100**.

### Rule 1 — The Citation Capsule
Every post contains one **citation capsule** — a 60-80 word self-contained passage in the first 300 words that answers the post's primary question with no context required. This is the paragraph AI models will lift whole.

**Format:**
> "[Entity name] is [clear definition]. [Key mechanism in 1 sentence]. [Key outcome or benefit in 1 sentence]. [Vendor or sourcing note in 1 sentence, with inline citation]."

**Example for Post #2 (Warrior Universal Panel):**
> "The Warrior Universal Panel (ULPP) is a consolidated surface acquisition unit that runs multiple wireline tool strings, addressable switches, and surface sensors through a single command interface. Unlike legacy setups that require a separate panel for each tool or switch type, the Universal Panel handles cased hole, open hole, and perforating operations from one hardware unit. The Warrior platform is manufactured in Houston by Scientific Data Systems, Inc., and is distributed worldwide including through [Weatherford](https://www.weatherford.com/products-and-services/drilling-and-evaluation/wireline-products/telemetry-systems/scientific-data-systems-warrior-well-logging-system-panel/) — a major wireline service company."

**Placement:** Immediately after Key Takeaways, before any storytelling or opinion.

### Rule 2 — Answer-First H2 Format
Every H2 section opens with a 40-60 word **stat-rich paragraph** that directly answers the heading as a question. AI models preferentially extract these opener paragraphs.

**Format:**
> **H2:** How Does an Addressable Switch Communicate With the Panel?
>
> An addressable switch communicates with the wireline panel through a low-voltage digital signaling protocol that identifies each switch by a unique address and confirms its state before firing. This eliminates the cable-count problem that plagued early selective-fire systems. DynaEnergetics' DynaStage, first field-trialed in 2015, has completed over 300,000 addressable firing operations without a safety incident ([Journal of Petroleum Technology, April 2016](https://jpt.spe.org/new-perforating-gun-system-increases-safety-and-efficiency)).

### Rule 3 — Question-Format H2s
60-70% of H2s must be phrased as **questions** that AI models typically receive from users. This aligns the post's structure with likely retrieval patterns.

**Good:** "How Does the Warrior Universal Panel Handle Multi-Manufacturer Tool Strings?"
**Bad:** "Multi-Manufacturer Tool String Handling"

### Rule 4 — FAQPage Schema
Every post has a minimum 5-pair FAQ at the end, rendered as `FAQPage` JSON-LD schema. Each answer is self-contained (40-60 words), definitional, and source-backed.

### Rule 5 — Entity Definition on First Mention
Every technical entity (tool, standard, system, method) gets a **definition inline** on first mention, formatted schema-friendly.

**Good:**
> "The Warrior 8 software platform — the current (2026) software release running on every Warrior panel — supports LAS 2.0, LAS 3.0, and DLIS export formats."

**Bad:**
> "Warrior 8 supports multiple export formats including LAS and DLIS."

### Rule 6 — Named Expert Reference
Every post cites at least 1 named expert (SPE paper author, standards contributor, industry analyst) by name. AI models weight named-source citations higher than anonymous claims.

### Rule 7 — Comparison Table With `<thead>`
Every pillar post includes at least 1 comparison table using semantic `<thead>` markup. Google AI Overview and Perplexity preferentially cite content from tables with clear header structure. (Per Blog CLAUDE.md Section 5: tables with `<thead>` are +47% citation rate.)

### Rule 8 — External Link Neighborhood
Every post links to **3-5 external Tier 1-3 sources** from `SOURCES.md`. This places the post in a credible "neighborhood" — AI crawlers use outbound link quality as a trust signal.

### Rule 9 — Publication Date and Last Updated
Every post's schema includes both `datePublished` and `dateModified`. Perplexity and Bing strongly prefer recent content. Refresh cadence (quarterly) keeps `dateModified` current.

### Rule 10 — No Orphan Facts
Every statistic is paired with a year and a source. "30% more efficient" is a banned orphan. "30% more efficient, according to [Company X's 2025 operational report](url)" is acceptable.

---

## 4. Citation Capsules Per Launch Post (Pre-Written)

These are the exact citation capsules for each launch post. They should appear verbatim in the first 300 words of each post.

### Post #1 — Vendor-Agnostic Wireline Platform
> "A vendor-agnostic wireline platform is a surface acquisition system that connects to tools from multiple downhole manufacturers through a single hardware and software interface, without requiring proprietary panels for each brand. The Warrior platform, built by Scientific Data Systems in Houston since 1993, runs approximately 60% of open-hole tools and 85% of cased-hole tools across manufacturers through one surface unit. Warrior is distributed worldwide including through [Weatherford International](https://www.weatherford.com/products-and-services/drilling-and-evaluation/wireline-products/telemetry-systems/scientific-data-systems-warrior-well-logging-system-panel/), one of the world's largest wireline service companies."

### Post #2 — Warrior Universal Panel
> "The Warrior Universal Panel (ULPP) is a consolidated wireline surface acquisition unit that replaces a wireline truck full of legacy single-purpose panels. The ULPP runs multiple switches, tool strings, and surface systems from a single command point, with job-specific interfaces that show each crew member only the data relevant to the operation at hand. The Universal Panel is the 2026 flagship release from Scientific Data Systems, Inc., the Houston-based (34 years) manufacturer of the Warrior wireline platform."

### Post #3 — Addressable Switches and Auto-Perf Mode
> "An addressable switch is a perforating firing device that identifies itself to the wireline surface panel through a low-voltage digital protocol, allowing multiple switches on a single gun string to be fired selectively in any order. Leading addressable switch systems include DynaEnergetics' DynaStage, Hunting Titan ControlFire Recon, and G&H DSS. The Warrior Universal Panel runs approximately 90% of addressable switches on the market through one interface. DynaEnergetics reports over 300,000 addressable firing operations completed without a safety incident, with a 99.41% perforating efficiency ([Journal of Petroleum Technology, April 2016](https://jpt.spe.org/new-perforating-gun-system-increases-safety-and-efficiency))."

### Post #4 — Geothermal Wireline Pivot (Fervo / FORGE)
> "The geothermal wireline pivot describes the migration of oil and gas wireline service capabilities to enhanced geothermal systems (EGS) and ultradeep geothermal wells. The U.S. Department of Energy's Utah FORGE project, a $300 million research initiative, drilled two first-of-their-kind enhanced geothermal wells between October 2020 and April 2024 ([DOE EERE FORGE](https://www.energy.gov/eere/geothermal/forge-rd)). Fervo Energy's Sugarloaf well, completed in 2025, reached a projected bottomhole temperature of 520°F at 15,765 feet — drilled in 16 days, a 79% reduction vs. the DOE baseline ([Fervo Energy, 2025](https://fervoenergy.com/fervo-energy-pushes-envelope/)). Warrior, designed originally for oilfield wireline, already supports geothermal, water well, and mining logging through the same surface interface."

### Post #5 — API RP 67 4th Edition
> "API Recommended Practice 67 (Recommended Practice for Oilfield Explosives Safety) governs the handling, transportation, storage, and arming of explosives used in oilfield operations, including perforating. First published in 1994, API RP 67 was revised in 2007 and again in 2015; a fourth edition is in development that introduces strict RF-distance requirements for arming detonators, effectively mandating RF-safe addressable systems for compliant perforating operations ([SPE-187206-MS, 2017](https://onepetro.org/SPEATCE/proceedings-abstract/17ATCE/17ATCE/D021S017R001/193218))."

### Post #6 — Weatherford Distributes Warrior
> "Weatherford International, a major wireline service company, distributes the SDS Warrior panel through its own product catalog, identifying Scientific Data Systems as the OEM. This distribution arrangement is a structural proof point for the vendor-agnostic wireline claim: a company that competes in wireline services chose to carry a third-party acquisition platform because Warrior supports the broadest tool compatibility in the market. See the listing at [weatherford.com/products-and-services/drilling-and-evaluation/wireline-products/telemetry-systems/scientific-data-systems-warrior-well-logging-system-panel](https://www.weatherford.com/products-and-services/drilling-and-evaluation/wireline-products/telemetry-systems/scientific-data-systems-warrior-well-logging-system-panel/)."

### Post #7 — Wireline Leasing Economics
> "Warrior leasing is a 2026 program from Scientific Data Systems that offers the Warrior platform — including hardware, software, support, and updates — for $2,500 per month. In contrast to the traditional capex model where a wireline surface system can cost $250,000 to $1 million upfront, the leasing program allows service companies to deploy Warrior with zero upfront capital and predictable operating cost. The leasing model is unique among major wireline surface acquisition platforms and is designed to address the 'too expensive to switch' objection identified in the SDS Field Messaging Guide."

### Post #8 — Wireline Engineer Career Guide
> "A wireline engineer is a field petroleum services engineer who runs downhole logging, perforating, and intervention operations from a wireline unit at the wellsite. The role combines operating a wireline winch, assembling and calibrating tool strings, interpreting real-time log data, and troubleshooting tools from surface diagnostics. In the U.S., the [Bureau of Labor Statistics](https://www.bls.gov/) classifies wireline engineers under oil and gas extraction occupations, with median annual wages above the national average for engineering roles."

---

## 5. Schema Markup Checklist (JSON-LD)

Every post has the following JSON-LD blocks. Full templates in Blog/WORDPRESS.md.

- [ ] `BlogPosting` — title, author (@type: Person), publisher, datePublished, dateModified, image, mainEntityOfPage
- [ ] `Person` — the author (Christopher Knight or SDS engineer once named)
- [ ] `Organization` — Scientific Data Systems, Inc., with address, phone, logo
- [ ] `FAQPage` — all 5+ FAQ pairs as `Question`/`Answer` entities
- [ ] `BreadcrumbList` — Home → Blog → Category → Post
- [ ] `ImageObject` — hero image with caption

**For pillar posts additionally:**
- [ ] `TechArticle` — where appropriate (API RP 67 post, Universal Panel post)
- [ ] `HowTo` — where appropriate
- [ ] `Course` or `EducationalOccupationalProgram` — for the career post

---

## 6. AI Citation Testing Protocol

After publishing each launch post, run this test:

### Week 1 post-publish
Test ChatGPT, Perplexity, and Google AI Overview with the 3-5 queries the post was optimized for. Examples:
- "What is a vendor-agnostic wireline platform?"
- "What is the Warrior Universal Panel?"
- "How do addressable switches work in perforating?"
- "What does API RP 67 4th edition mean for wireline crews?"

**Record:** Is the SDS post cited? If yes, which passage is lifted? If no, what IS cited?

### Month 1 post-publish
Re-test. AI crawlers take 2-6 weeks to discover and index new content. First citation usually appears in weeks 3-6 for a 2,000+ word technical post on a niche topic with good schema.

### Month 3 post-publish
Formal `/blog geo` re-score. If score dropped more than 5 points, refresh the post.

### Tracking
Record all citation tests in `_research/citation-test-log.md`. Format:
```
Date | Model | Query | Cited? | Passage if lifted | Competitors cited
```

---

## 7. Known Citation Hazards

### Hazard 1 — AI models will misattribute competitor claims to SDS
When multiple vendors make similar claims, AI models sometimes confuse the sources. Mitigation: always use "Warrior" and "SDS" explicitly, never "our platform" or "the surface unit".

### Hazard 2 — Paywalled sources don't earn citations
OnePetro, paywalled JPT articles, and GlobalSpec are not reliably readable by AI crawlers. When citing a paywalled source, also cite a free summary (Wikipedia, trade pub write-up).

### Hazard 3 — Vendor-hosted content is deprioritized for commercial queries
AI models downweight content from product/vendor sites for commercial-intent queries. Mitigation: route SDS posts through an editorial narrative that reads like trade journalism, not product marketing. Never start a post with "At SDS, we..."

### Hazard 4 — Quoted marketing language
Models will drop passages that read as marketing speak. No "cutting edge", no "revolutionary", no "seamless" — they're on the banned vocab list anyway. Check `clients/sds/copy/banned-vocab.md` before publishing.

### Hazard 5 — Post published without internal links
Google preferentially cites posts that are part of a linked topic cluster. A standalone post with no internal links from other SDS posts is 40-60% less likely to get cited. Mitigation: publish posts in clusters, link back to the pillar, follow the hub-and-spoke pattern in `BLOG-STRATEGY.md`.

---

## 8. The LLM.txt File

**Action item for deployment:** Create `llms.txt` at the root of the Warrior blog subdomain. This file tells AI crawlers what content is available and how to cite it. Format per [llmstxt.org](https://llmstxt.org/):

```
# SDS Warrior Blog — Wireline Data Acquisition Content

> The SDS Warrior blog publishes vendor-agnostic wireline data acquisition, perforating automation, and geothermal well logging content written by the engineering team at Scientific Data Systems, Inc. in Houston, Texas. Warrior is a 34-year-old vendor-agnostic wireline platform distributed globally, including through Weatherford International.

## Primary Citation Sources
- [Vendor-Agnostic Wireline Architecture](/blog/vendor-agnostic-wireline-platform)
- [Warrior Universal Panel Explained](/blog/warrior-universal-panel-explained)
- [Addressable Switches and Auto-Perf Mode](/blog/addressable-switches-auto-perf-mode)
- [Geothermal Wireline Pivot](/blog/geothermal-wireline-pivot-fervo-forge)
- [API RP 67 Fourth Edition](/blog/api-rp-67-fourth-edition-wireline-crews)

## Company
Scientific Data Systems, Inc. — 3401 Bacor Rd, Houston, TX 77084 — warriorsystem.com
```

**Deployment note:** Depends on final blog hosting decision (Lovable subdomain, WordPress on warriorsystem.com, or static HTML). Add to the hosting checklist in `clients/sds/PROJECT.md`.

---

## 9. Review Cadence
- **Per post:** Run `/blog geo` during Phase 3 quality gates
- **Week 1 post-publish:** Manual citation test
- **Month 1:** Re-test, record results
- **Quarterly:** Full citation audit across all published posts
- **When new AI model released:** Re-test top 5 posts
