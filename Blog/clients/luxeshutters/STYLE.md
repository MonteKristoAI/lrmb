# LuxeShutters — Writing Style Guide

## Voice: Knowledgeable Local Tradesperson

Chris and Campbell are not corporate marketers. They are tradespeople who know their products inside out. The blog voice should sound like a knowledgeable friend who happens to install shutters for a living, explaining things over a cuppa.

### Tone Dimensions (NNGroup Framework)
- **Funny ← → Serious:** Slightly toward serious (6/10). Not stiff, but not joking around.
- **Formal ← → Casual:** Casual-leaning (4/10). Approachable. No corporate speak.
- **Respectful ← → Irreverent:** Respectful (7/10). Professional without being stuffy.
- **Enthusiastic ← → Matter-of-fact:** Matter-of-fact (7/10). Straight talk, real answers.

### Voice Characteristics
- **Direct and practical.** Get to the answer fast. No waffling.
- **Specific over vague.** "$300-$600 per square metre" not "prices vary."
- **Australian English.** Colour, metre, aluminium, louvre. Never American spellings.
- **Regional awareness.** Reference Riverina towns, local climate, local building styles.
- **Product expertise.** Use real product names (Forte, Bayview, Oasis, Atlas, Aura Drapery). This signals genuine dealer knowledge.
- **No upselling tone.** Educate, don't sell. The CTA handles conversion.

### Sentence Style
- Short to medium sentences. Average 15-18 words.
- Mix 1-sentence paragraphs with 3-4 sentence paragraphs.
- Start with the answer, then explain why.
- Use contractions naturally ("we've installed" not "we have installed").
- Active voice default.

### Australian Vernacular (Use Naturally, Not Forced)
- "alfresco area" (not "outdoor dining space")
- "reno" or "renovation" (both fine)
- "cuppa" (only in casual context, don't overuse)
- "ute" (if referencing work vehicles)
- "stinking hot" or "scorching" (for Riverina summers)
- "frosty mornings" (for Riverina winters)

---

## Do Not Use (Banned)

### Banned Words (AI Detection Risk)
delve, tapestry, nuanced, realm, landscape, multifaceted, pivotal, utilize, facilitate, elucidate, comprehensive (as filler), robust, seamless, cutting-edge, transformative, innovative (generic), dynamic, agile, game-changer, unlock (metaphorical), revolutionize, crucial, moreover, furthermore, in conclusion, it's worth noting, it's important to note, dive deep

### Banned Openings
- "In today's modern world..."
- "Let's dive into..."
- "Whether you're a homeowner or..."
- "When it comes to window treatments..."
- "Are you looking for the perfect..."

### Banned Patterns
- Generic superlatives without evidence ("the best in the Riverina" needs a reason WHY)
- Fake urgency ("Don't wait! Limited time!")
- Corporate passive voice ("It is recommended that...")
- Stacking more than 2 adjectives ("beautiful, elegant, timeless plantation shutters")

---

## Do Use (Human Signals)

### Experience Markers
- "We fitted these in a Temora home last month..."
- "In our experience across the Riverina..."
- "Chris measured a set of bay windows in Wagga recently and..."
- "One thing we see a lot in older Riverina homes is..."
- "After installing hundreds of sets across the region..."

### Specificity Markers
- Real product names (Forte Select, Bayview ThermoPoly, Atlas Cat 1)
- Real price ranges from CWGlobal
- Real town names (Temora, Wagga Wagga, Griffith, Cootamundra)
- Real climate data (Temora averages 33 frost days/year, summer highs above 40 degrees)

### Regional Context
Every post should include at least one "In the Riverina" paragraph (100-150 words) that localizes the content to the region. Examples:
- Energy efficiency post → "Riverina homes cop extreme heat in summer and proper frost in winter, so your window coverings are doing double duty."
- Shutter comparison post → "We install both PVC and basswood across the region. In Temora and surrounds where summers hit 40-plus, PVC handles the heat without warping."

---

## Readability Targets

| Metric | Target |
|--------|--------|
| Flesch Reading Ease | 65+ (slightly easier than general blog standard) |
| Average sentence length | 15-18 words |
| Paragraph length | 2-4 sentences typical, occasional 1-sentence for emphasis |
| TTR (vocabulary diversity) | > 0.40 |
| Transition word coverage | 30-50% of sentences |
| Em dash count | 0 (use commas, colons, or rewrite) |

**Note on em dashes:** MonteKristo has a standing rule: never use em dashes in any deliverable. Use commas, colons, or split the sentence.

---

## Content Formatting (Level 1000 Perfect Post Template)

### CRITICAL: Structural Variation Rule
NOT every post gets all components. This is what makes AI detection impossible.

| Template | Key Takeaways | FAQ | Word Count | Opens With |
|----------|:---:|:---:|-----------|-----------|
| A: Long-form guide | Yes | Yes (5+) | 2,500-3,500 | Hook + takeaways |
| B: Short direct-answer | No | No | 1,200-1,500 | Direct answer sentence |
| C: Story-led | No | Yes (3-4) | 1,800-2,200 | Project anecdote |
| D: Data piece | Yes | No | 2,000-2,500 | Key stat + table |

Assign template type in CONTENT.md. Never use the same template for 3+ consecutive posts.

### Universal Requirements (ALL templates)
1. **Answer-first opening** (answer the query in the first 100 words)
2. **"In the Riverina" section** (100-150 words localising paragraph, even in non-local posts)
3. **Internal links** (3-5, from SITEMAP.md only)
4. **External links** (3-5, Tier 1-3 sources, at least one .gov.au or .edu.au)
5. **CTA** (tiered per CLIENT.md, phone number always visible)
6. **H2 sections vary in length** (100-400 words, never uniform)
7. **Voice markers:** 1 contraction per 150 words, 1 experience marker per section, 1 product name per relevant section, 1 town name minimum per post

### Opening Hook Rules (NOT a definition, ever)
- **BAD:** "Plantation shutters are a popular window treatment in Australia."
- **GOOD:** "Last Tuesday, a homeowner in Wagga asked us: 'Just give me a straight answer. What am I actually going to pay for shutters?' Fair question."
- Focus keyword in first 2 sentences, naturally.
- Contains one specific number or data point.

### Key Takeaways Box (Templates A and D only)
- Use brand blue (#1E5AA8), NOT green
- 5 bullets, 60-80 words total
- 2+ bullets contain specific statistics with inline sources
- Style: `border-left: 4px solid #1E5AA8; background: rgba(30,90,168,0.06)`

### FAQ Section (Templates A and C only)
- 3-5 Q&A pairs
- 80-100 words per answer (fully self-contained, readable if extracted by AI)
- Questions sourced from Google "People Also Ask" for target keyword
- Schema: FAQPage microdata with itemprop markup

### Image Requirements
- 2-3 images per post
- Real installation photos where available (from 5-layer photo pipeline)
- CWGlobal manufacturer photos for product comparisons
- Descriptive alt text with primary keyword in at least 1 image
- WebP format, max 1200px width
- figcaption on every image, loading="lazy"

### Schema Requirements
- BlogPosting + LocalBusiness + BreadcrumbList on every post
- FAQPage on posts with 3+ FAQ pairs
- Product + AggregateOffer on pricing posts
- HowTo schema on step-by-step guides
- Person schema for author (NEVER Organization)

### Pricing Content Rules (Level 1000)
- Publish INSTALLED price ranges (what homeowners pay), NOT dealer costs
- Always include: "Prices current as of [month year]. Based on standard installations in the Riverina. Your quote may vary based on window size, access, and product selection."
- Post #1 targets shutters pricing ONLY. Post #7 targets blinds/curtains/other pricing. ZERO overlap.

### Quality Gate Targets

| Metric | Target |
|--------|--------|
| Blog analyze score | 95+ / 100 |
| Word count | Per template type (see above) |
| Flesch Reading Ease | 65-70 |
| Avg sentence length | 15-18 words |
| Focus keyword density | 0.65-0.9% |
| TTR (vocabulary diversity) | > 0.45 |
| Burstiness (sentence length std/mean) | > 0.5 |
| Em dashes | 0 |
| AI banned words | 0 |
| Passive voice | < 10% |
| Transition words | 30-45% |
| Internal links | 3-5 (SITEMAP.md only) |
| External links | 3-5 (1+ .gov.au or .edu.au) |
| Images | 2-3 with alt + figcaption |
