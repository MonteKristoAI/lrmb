# REIG Solar — Tone & Style Guide

**Source:** Full analysis of 10 blog posts (Feb–Mar 2026) by Alex Montekristobelgrade

---

## Voice in One Line

Technical, field-practical, and evidence-driven — writes like an experienced SCADA engineer explaining their process to a smart project manager who needs to make decisions.

---

## Tone Dimensions (NNGroup 4-Dimension Framework)

| Dimension | Score (0–1) | Notes |
|-----------|-------------|-------|
| Funny (0) → Serious (1) | 0.85 | Very serious. No jokes. Occasional dry understatement ("mystery data gaps"). |
| Formal (0) → Casual (1) | 0.35 | Professional, not stiff. Uses contractions sparingly. Reads like a technical report written for humans. |
| Respectful (0) → Irreverent (1) | 0.15 | Always respectful of the reader's time and expertise. |
| Enthusiastic (0) → Matter-of-fact (1) | 0.75 | Matter-of-fact and confident. No hype. States outcomes as facts, not promises. |

---

## SEO Hard Limits (Non-Negotiable)

Count characters exactly — no estimation, no annotation shortcuts.

| Field | Limit | Enforcement |
|-------|-------|-------------|
| **SEO Title** | 50–60 chars exactly | MINIMUM 50. MAXIMUM 60. Outside this range = blocker. |
| **Meta Description** | < 155 chars (target 145–154) | Hard ceiling. ≥155 = blocker. |
| **Focus keyword in title** | Required | Must appear in first 50 chars of SEO Title. |
| **Focus keyword in meta** | Required | Exact phrase, not paraphrase. |
| **Focus keyword in H2+H3** | 30–40% of all headings | Count every H2 and H3 — exact phrase only. |
| **Keyword density** | 0.65%–0.9% | Hard range. Calculate exact count ÷ word count. |
| **External links** | All verified | Fetch every external link via WebFetch. Zero broken or wrong-page links at delivery. |
| **SVG label overflow** | Zero tolerance | Every text label must fit its container. Bar labels outside bar if bar width < label pixel width. |

---

## Writing Rules

| Setting | Value |
|---------|-------|
| Vocabulary tier | Professional/Technical (engineering audience) |
| Target readability | Flesch Grade 12–14 (engineers and PMs) |
| Avg sentence length | ~18–22 words |
| Contractions | Sparingly |
| Passive voice max | 15% |
| Summary label | Key Takeaways |
| POV | Second person (you/your) for direct sections; third person for process descriptions |
| Paragraph length | Short — 2–4 sentences. Heavy use of bullets, tables, numbered lists |

---

## Signature Vocabulary (MUST USE)

These phrases appear across nearly every piece of content and define the brand voice:

| Phrase | Context |
|--------|---------|
| **commissioning-ready** | How REIG describes their deliverables and RenergyWare products |
| **day one** | "trustworthy from day one" — their core promise |
| **end-to-end** | Validation, verification, ownership |
| **device to historian** | The full data chain they validate |
| **mystery data gaps** | The problem they solve (post-COD data issues) |
| **online but wrong** | When SCADA is communicating but data quality is bad |
| **the two truths** | HMI looks right, historian is wrong |
| **COD** | Commercial Operation Date — always the goalpost |
| **O&M-ready turnover** | Their standard vs just "handing over" |
| **testable point list** | Their commissioning documentation format |
| **defensible** | Data or process that holds up under scrutiny |
| **witness testing** | Utility acceptance testing at interconnection |
| **POI** | Point of Interconnection |
| **rework** | What they prevent; why you should hire them right |
| **evidence-based / evidence-driven** | Their approach to commissioning |
| **field-first** | Their operational culture |
| **Measurement, Meaning, Control** | Their core commissioning framework — use this |
| **Completeness, Accuracy, Latency** | Their DAS commissioning targets triad |

---

## Core Frameworks (Reference These)

**1. Measurement, Meaning, Control**
Their primary commissioning lens used across 5+ posts:
- *Measurement* = sensors, tagging, data accuracy
- *Meaning* = alarms, dashboards, KPIs that are actionable
- *Control* = setpoints, logic, curtailment, interoperability

**2. DAS Commissioning Targets: Completeness, Accuracy, Latency**
- Completeness: % of points reporting
- Accuracy: signals match physical reality
- Latency: data arrives within operational tolerance

**3. 5 Layers of SCADA Architecture**
1. Field / Measurement
2. Communications / OT Network
3. Control & Compute
4. Presentation / Operations
5. Utility / ISO Interface

**4. FAT → SAT → COD Readiness**
Factory Acceptance Testing → Site Acceptance Testing → Commercial Operation Date readiness

**5. Tiered Testing**
- Tier 1: Must be correct (critical data, utility signals, protection)
- Tier 2: Operational reliability (alarms, historian completeness, dashboard accuracy)
- Tier 3: Nice to have (performance analytics, trend reports)

---

## Article Structure Template

Every REIG blog post follows this structure — replicate it:

1. **Hook** — Problem statement ("X often looks done before data is trustworthy")
2. **Audience declaration** — Who this is for (owners, operators, commissioning leads, etc.)
3. **Quick definitions** — Define the main concept clearly
4. **Core framework** — Numbered, layered, tableable
5. **Tables** — Deliverables, failure modes, comparisons (almost every post has 1–2 tables)
6. **Common failure modes** — A dedicated section on what goes wrong
7. **Checklist or rubric** — Actionable takeaway list
8. **Where REIG fits** — 1–2 paragraphs, always mentions "commissioning-ready"
9. **Conclusion** — Restate the core promise
10. **FAQ** — 5–6 Q&A pairs (always included)
11. **Further reading** — Internal links to related posts
12. **References** — External: NIST, NREL, IEC, IEEE (adds credibility)
13. **CTA** — Practical, never salesy ("share your point list" or "schedule a call")

---

## Do

- Lead every post with the specific problem it solves
- Use tables for comparisons, checklists, and deliverable lists — readers scan
- Reference standards (IEC, NIST, IEEE) when making technical claims
- Include a "Where REIG fits" or similar section that naturally positions their service
- End with FAQ — their readers have technical questions
- Use numbered frameworks — readers remember structured knowledge
- Always include "Further reading" links to their other posts
- State outcomes as facts, not promises: "This ensures data is defensible" not "This will help you"

## Don't

- Don't use marketing superlatives ("best," "leading," "world-class") — they're not their style
- Don't write without tables or lists — wall-of-text doesn't fit their audience
- Don't omit the failure modes section — showing what goes wrong builds credibility
- Don't use vague language like "efficient" or "optimized" without specifics
- Don't skip the FAQ section
- Don't write for a general audience — always assume the reader is technical

---

## Preferred Article Length

- Standard technical post: 2,000–2,800 words
- Deep-dive / architecture posts: 3,000+ words
- Every post must include: tables, FAQ, references

## Internal Linking Preference

3–5 internal links per post minimum. Use their existing posts as reference material. Link within "Further reading" section and inline where contextually relevant.
