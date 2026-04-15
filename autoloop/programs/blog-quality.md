# AutoLoop Program: Blog Quality Optimization

This is the program.md for blog post quality optimization.
Read this file before running any blog-quality autoloop experiment.

## Objective

Get the highest blog-analyze score (0-100) while maintaining zero AI tells,
preserving author voice, and keeping all guard rails green.

## Evaluation

Run `/blog-analyze` on the target blog post file.

**Primary metric:** Total score (0-100), higher is better.

**Score breakdown (5 categories):**
- Content Quality: 30 points (depth, readability, originality, structure, engagement, grammar)
- SEO Optimization: 25 points (headings, title, keywords, internal links, URL, meta, external links)
- E-E-A-T Signals: 15 points (author, citations, trust, experience)
- Technical Elements: 15 points (schema, images, structured data, speed, mobile, OG tags)
- AI Citation Readiness: 15 points (passage citability, Q&A format, entity clarity, structure, crawler access)

## Guard Rails (HARD GATES -- must not regress)

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| Banned vocabulary count | Must be 0 | DISCARD immediately |
| Burstiness score | Must stay > 5.0/10 | DISCARD |
| TTR (vocabulary diversity) | Must stay > 0.35 | DISCARD |
| AI detection probability | Must stay < 30% | DISCARD |
| Em dash count | Must not increase | DISCARD |
| Author voice (persona phrases) | Must be preserved | DISCARD |
| Existing sourced statistics | Must not be removed | DISCARD |
| Existing internal/external links | Must not be removed (can add) | DISCARD |

## Action Space (what you CAN modify)

Prioritized by typical impact:

### High Impact (try these first)
1. **Rewrite flat paragraphs for burstiness** -- vary sentence lengths dramatically
   (short punchy sentence. Then a longer one that builds on the idea with specific detail and a subordinate clause.)
2. **Add sourced statistics** -- find real stats from tier 1-3 sources, add inline with citation
3. **Add Key Takeaways / summary box** -- after the introduction, 4-6 bullet points
4. **Convert H2 sections to Q&A format** -- rephrase headings as questions readers would ask

### Medium Impact
5. **Improve heading hierarchy** -- ensure H1 > H2 > H3, no skips, keyword in 2-3 headings
6. **Add internal links** -- from SITEMAP.md, 3-10 contextual links with descriptive anchor text
7. **Add structured data elements** -- tables with `<thead>`, comparison blocks, definition lists
8. **Strengthen CTA** -- match to reader intent per client CTA table in Blog/CLAUDE.md

### Lower Impact (diminishing returns)
9. **Add external links** -- to tier 1-3 authoritative sources (3-8 total)
10. **Optimize title tag** -- 40-60 chars, front-loaded keyword, power word
11. **Improve meta description** -- 150-160 chars, include one statistic
12. **Add FAQ section** -- 3-5 questions with concise answers for schema

## Constraints (what you CANNOT do)

- **NEVER add banned vocabulary** -- check against the 18 AI phrases in blog-analyze plus
  the full list in `~/Documents/MonteKristo Vault/skills/content-quality.md`
- **NEVER add em dashes** (--). Use commas, periods, or rewrite the sentence.
- **NEVER change the author byline or persona voice**
- **NEVER fabricate statistics** -- every number must have a real, verifiable source
- **NEVER remove existing sourced statistics** (can add new ones)
- **NEVER remove existing links** (can add new ones)
- **NEVER change the primary keyword or topic focus**
- **Maximum 3 changes per iteration** -- isolate what helps
- **Simplicity criterion**: if a change adds complexity without clear score improvement, discard it

## Client-Specific Rules

Before running, load the client's persona and rules:

| Client | Persona | Voice Rules | CTA Table |
|--------|---------|-------------|-----------|
| BreathMastery | breathmastery | Dan Brule's voice, micro-phrases, safety notes | Blog/CLAUDE.md Section 2 |
| REIG Solar | reig-solar | Technical B2B, SCADA domain language | Blog/CLAUDE.md Section 2 |
| LuxeShutters | luxeshutters | Chris & Campbell, Temora NSW, Australian English | Blog/CLAUDE.md Section 2 |
| AiiAco | (pending) | AI Infrastructure + Revenue Systems dual positioning | Blog/clients/aiiaco/ |
| GummyGurl | gummygurl | Carolina Natural Solutions team voice | Blog/clients/gummygurl/ |
| Entourage Gummies | (pending voice corpus P-014) | Sandy Adams founder voice, zero em dashes | Blog/clients/entouragess/ |
| SDS / Warrior | sds-warrior | Engineering team voice, MK operates as "Alex Srdic" | Blog/clients/sds/ |

Read the client's `brief.json` or STYLE.md before any modifications.

## Proven Techniques (from experiments)

This section is updated automatically as experiments accumulate.

(No proven techniques yet -- will be populated after first experiments.)

## Anti-Patterns (what consistently fails)

This section is updated automatically from failed experiments.

(No anti-patterns yet -- will be populated after first experiments.)

## Example Experiment Flow

```
Iteration 1 (baseline):
  Score: 72/100
  Weakest: Content Quality (18/30), AI Citation Readiness (8/15)
  Burstiness: 5.2/10 (flat -- AI pattern)

Hypothesis: Rewrite paragraphs 4, 7, 12 for sentence length variance
Action: 3 paragraph rewrites (short+long alternation)
Result: Score 76/100 (+4), Burstiness 7.1/10
Status: KEPT

Iteration 2:
  Score: 76/100
  Weakest: Content Quality (20/30), E-E-A-T (9/15)

Hypothesis: Add 4 sourced statistics to sections 2 and 4
Action: Research + add 4 stats with tier-1 citations
Result: Score 79/100 (+3), Source count +4
Status: KEPT

Iteration 3:
  Score: 79/100
  Weakest: AI Citation Readiness (8/15)

Hypothesis: Add Key Takeaways box after intro
Action: Add 5-bullet summary box
Result: Score 81/100 (+2), Engagement elements check passes
Status: KEPT

...continue until score >= 90 or stagnation
```
