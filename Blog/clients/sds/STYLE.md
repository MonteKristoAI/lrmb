# SDS / Warrior — Tone & Style Guide

## Voice in One Line

> **Written by the engineers in Houston who designed your wireline system — for the crews who actually run it.**

Engineer-to-engineer. Peer-to-peer. Authoritative but grounded. Specific over abstract. Never corporate, never consumer.

## Tone Dimensions (NNGroup 4-Dimension Framework)

| Dimension | Score (0–1) | Notes |
|-----------|-------------|-------|
| Funny (0) → **Serious** (1) | **0.85** | Lives are on the line in perforating. Humor is rare and dry when it appears. |
| Formal (0) → Casual (1) | **0.55** | Technical precision + working-class oilfield register. Not a corporate memo, not a barstool story. Reads like two engineers talking at a wellsite. |
| Respectful (0) → Irreverent (1) | **0.25** | Respects the reader's expertise. Gently irreverent toward proprietary vendor marketing ("the closed-system tax"). |
| Enthusiastic (0) → **Matter-of-fact** (1) | **0.80** | Facts over feelings. Data over drama. Never exclamatory. |

## Writing Rules

| Setting | Value |
|---------|-------|
| Vocabulary tier | **Technical** (oilfield-literate audience) |
| Target readability | **Flesch Grade 9–12** (Flesch Reading Ease ≥ 55, acceptable for technical posts — lower than MK's general 60+ rule) |
| Avg sentence length | **18–22 words** (longer than consumer blogs because audience handles technical density) |
| Max sentence length | **35 words** before a rewrite (split long clauses) |
| Contractions | **Sparingly** — in dialog or personal reflection only; formal body copy spells out |
| Passive voice max | **15%** of sentences |
| Summary label | **Key Takeaways** (standard MK label, matches REIG Solar) |
| POV | **Second person** (you/your) — direct to the reader; occasionally "we" for SDS engineering voice |

## Do

- **Open with a failure mode.** A named scenario where the wrong choice caused a real consequence at a specific location. "A Permian perforating crew lost 8 hours last summer swapping panels mid-stage when the gun system changed."
- **Name specific entities.** Use "Permian", "Eagle Ford", "Marcellus", "Bakken", "Weatherford", "DynaEnergetics", "Houston", "3401 Bacor Rd" — specifics signal credibility.
- **Cite years inline.** "In 2015, DynaEnergetics field-trialed..." not "Several years ago, a manufacturer..."
- **Use oilfield vocabulary correctly.** "Run in the hole", "rig up", "tension on the line", "off bottom", "stage", "gun string", "company man", "FSM", "on location".
- **Define terms on first mention inline.** "A CCL (Casing Collar Locator) sends a magnetic signature when it crosses a casing joint..."
- **Prefer concrete nouns.** "The Warrior Universal Panel" not "our surface system". "The DynaStage addressable switch" not "the selective firing device".
- **Show math when claiming cost or time savings.** Numbers with assumptions labeled. "$2,500/month × 36 months = $90,000 — compared to a $350,000 capex purchase, break-even arrives at month 41."
- **Use the Weatherford-distribution fact** when the topic is vendor-agnosticism.
- **End sections with a consequence or a question.** "The difference shows up at 3 a.m. when the switch changes on pad."
- **Use active voice by default.** "The Warrior panel runs the gun string" not "The gun string is run by the Warrior panel."
- **Write sentences that read aloud well.** A wireline engineer skimming on their phone should understand in one pass.

## Don't

- **Don't open with a definition.** Never start a post with "Wireline logging is the process of..." Start with the failure mode or the new reality.
- **Don't use "in today's [X] world".** Banned opener.
- **Don't use "dive into", "let's explore", "unlock the power of", "transformative", "revolutionary", "seamless", "cutting-edge", "innovative".** Full list in `clients/sds/copy/banned-vocab.md` plus `Blog/CLAUDE.md` Section 7.
- **Don't use "interoperable" / "interoperability".** Use **"universally compatible"** (Christopher-approved replacement).
- **Don't use "subsurface intelligence", "data sovereignty", "guided workflows", "intelligent automation", "supervised automation".** All Christopher-vetoed.
- **Don't call it "Warrior 8.0 launch".** The launch is the **Warrior Universal Panel**. Warrior 8 / P10V7.1 is the existing software.
- **Don't use em dashes.** Zero tolerance (MK global rule + SDS rule). Replace with commas, colons, hyphens, or rewrite.
- **Don't hype.** "Dramatically better" is banned. "20% faster, per field trial data (Company X, 2024)" is acceptable.
- **Don't use first-person singular ("I").** Use "we" (SDS engineering team) or the second person.
- **Don't reference "our product" or "our software".** Always name it: "Warrior", "the Warrior Universal Panel".
- **Don't use Wikipedia as a primary source.** OK as a fallback citation; never as the authoritative reference.
- **Don't call wireline "the wireline industry".** Call it "wireline services", "wireline operations", "wireline work".
- **Don't moralize about safety.** Cite incident reports and regulations, not sentiments.
- **Don't end with a generic CTA.** Every CTA matches the specific persona and post intent.

## Preferred Article Length

| Template | Target words | Pillar exception |
|---|---|---|
| T1 Technical Deep Dive | 2,200 - 3,000 | 3,000+ for pillar |
| T2 Comparison | 2,500 - 3,200 | 3,200+ for pillar |
| T3 Regulatory Primer | 2,500 - 3,000 | 3,000+ for pillar |
| T4 Thought Leadership | 2,000 - 2,800 | 2,800+ for pillar |
| T5 Business Case | 2,000 - 2,600 | 2,600+ for pillar |

**Pillar posts** (the first post in each hub) run at the upper end. **Spoke posts** run at the lower end. Per `Blog/CLAUDE.md` Section 6, the absolute minimum is 2,000 words for how-to posts and 3,000 words for pillars.

**Quality over length.** A tight 2,200-word technical deep dive beats a padded 3,500-word ramble.

## Internal Linking Preference

- **3-5 internal links per post**, all sourced from `SITEMAP.md`
- **Every post must link to its hub pillar** (when the spoke post publishes after the pillar)
- **Every spoke post links to 1-2 sibling spokes** when topics overlap
- **Cross-hub linking is allowed** when topics naturally overlap (e.g., a Hub B Universal Panel post can link to a Hub C addressable switches post)
- **No same-batch linking** — posts being written in the same session don't link to each other until all are live (per `Blog/CLAUDE.md` Section 4)

## External Linking Preference

- **3-5 external links per post**, all from `SOURCES.md`
- **Mix of tiers:** at least 2 Tier 1 sources (SPE, API, DOE, BSEE), 1-2 Tier 2 sources (JPT, World Oil, Hart), and optionally 1 Tier 4 reference (competitor or SDS product page for context)
- **All external links:** `target="_blank" rel="noopener noreferrer"`
- **Publication year mandatory** in the inline citation

## Answer-First Paragraph Format

Every H2 section opens with a 40-60 word **answer-first paragraph** that:
1. Directly answers the H2 as a question (even if the H2 isn't phrased as one)
2. Contains a statistic with an inline source
3. Can be read in isolation and still make sense

See `CITATIONS.md` Rule 2 for examples.

## Sentence Variety (Burstiness)

Mix:
- **Short sentences (5-12 words)** for punch and emphasis
- **Medium sentences (13-25 words)** for technical explanation
- **Long sentences (26-35 words)** sparingly, for deliberate rhythm — max 1 per 4 paragraphs

**Never** write 3 consecutive sentences of the same length. This is an AI tell.

## Paragraph Variety

- **Short paragraphs (1-2 sentences)** for emphasis or transition
- **Medium paragraphs (3-4 sentences)** for the main body rhythm
- **Long paragraphs (5-6 sentences)** for deep technical explanation — max 1 per section

Uniform paragraph lengths are an AI tell. Mix aggressively.

## Opening Paragraph Patterns (Approved)

Pick one per post. Never two the same in a row.

1. **Failure mode scenario:** "A Permian perforating crew lost 8 hours last summer swapping panels mid-stage when the gun system changed. That kind of downtime costs $140 per minute at the wellhead and doesn't appear anywhere in the job ticket. It only shows up in the next quarter's P&L."
2. **Surprising fact:** "Weatherford International — one of the four largest wireline service companies in the world — sells a wireline surface panel built by a 34-employee company on Bacor Road in Houston. Here's why that's the most important fact in wireline right now."
3. **Regulatory event:** "The fourth edition of API Recommended Practice 67 is expected to land this year. It will introduce RF-distance arming rules that make a lot of working perforating crews non-compliant overnight. Here's what the new rules say, what changes, and what your crews need to do before the deadline."
4. **Data lead:** "DynaEnergetics' DynaStage system has completed over 300,000 perforating operations without a safety incident. That's a 99.41% perforating efficiency — one misrun per 420 runs. The number matters because most perforating safety data isn't this clean. Here's what it tells us about where addressable switches are headed."
5. **Question the reader is asking:** "Is your wireline surface system running every tool your crews need, or are you still swapping panels every time the job changes? The answer determines whether your fleet spends the next five years growing or treading water."

## Closing Patterns (Approved)

1. **Specific next-step CTA:** "Request a demo of the Warrior Universal Panel and see it run your own tool strings."
2. **Technical invitation:** "Download the Warrior compatibility matrix and cross-check it against your current fleet."
3. **Expert handoff:** "Talk to the Houston engineers who built the system — (281) 398-1612."
4. **Community invite:** "Join the Warrior user forum and compare notes with other crews running the same operations."

## Anti-AI Checklist (Run Before Publishing)

- [ ] No banned vocabulary (Blog CLAUDE.md Section 7 + `clients/sds/copy/banned-vocab.md`)
- [ ] No banned opening patterns
- [ ] Em dash count = 0 (grep -c '—' file.html should return 0)
- [ ] No 3 consecutive sentences of similar length
- [ ] No symmetrical 3-item lists in every section
- [ ] At least 2 named entities per H2 section (person, institution, product, location, standard)
- [ ] At least 1 "we tested" / "in practice" / "in the field" signal
- [ ] TTR (type-token ratio) > 0.40 — vocabulary diversity check
- [ ] Burstiness: short and long sentences mixed in every section
- [ ] Flesch Reading Ease ≥ 55 (relaxed from 60 for technical audience)
- [ ] Transition word coverage 30-50%
- [ ] Citation capsule present in first 300 words
- [ ] FAQ section present with 5+ Q&A pairs

## Calibration Notes

- The SDS persona is **more formal and technical** than BreathMastery (which is casual and warm) but **less academic** than REIG Solar (which leans declarative-technical)
- Closest comparison in MK's portfolio is **REIG Solar**, but SDS is even more field-operative in voice — think "the REIG engineer if he'd spent 20 years in a wireline truck instead of a solar plant"
- Christopher's own writing style (from his email edits) is direct, specific, slightly grumpy, and allergic to marketing hype. Match it.

## Review Cadence

This file is refreshed:
- After receiving feedback from Christopher (append to `FEEDBACK.md` and adjust here if the rule is generalizable)
- Quarterly as part of strategic review
- When a voice calibration issue is raised more than twice
