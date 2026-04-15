# AutoLoop Program: Ad Creative CPA Optimization

## Objective

Minimize cost per acquisition (CPA) through systematic A/B testing
of ad creative variants. PROPOSE-ONLY mode -- all creatives require human approval.

## Evaluation

CPA from Meta Marketing API or manual tracking.
Minimum: 200 impressions, 72h observation, $50 minimum spend per variant.

**Primary metric:** CPA (cost per acquisition), lower is better.

## Guard Rails

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| CTR | Must not drop below baseline | FLAG |
| Relevance score | Must not drop below 5 | FLAG |
| Daily spend | Must stay within budget cap | HARD STOP |
| Content policy | Must pass Meta content review | DISCARD |

## Action Space

### High Impact
1. **Primary headline** -- benefit-driven vs curiosity vs social proof
2. **Ad description** -- problem-agitate vs benefit-stack vs testimonial
3. **CTA text** -- "Learn More" vs "Get Started" vs "Book Now" vs custom

### Medium Impact
4. **Creative angle** -- pain point vs aspiration vs fear of missing out
5. **Social proof format** -- number-based vs quote vs case study
6. **Offer framing** -- price anchor vs savings vs free trial

### Lower Impact
7. **Ad format** -- single image vs carousel vs video
8. **Audience segment** -- test creative across different audiences

## Constraints

- **ALL new creatives → HUMAN REVIEW** before deployment
- **ALL budget changes → HUMAN REVIEW** (never auto-modify budgets)
- **Photojournalistic style** -- per MonteKristo creative generation lessons
- **One emotion per ad** -- CTA matches the emotion
- **Never use Gemini HTML/CSS output** -- Gemini generates complete images
- **Maximum $50/day per test variant** unless approved higher
- **Minimum 200 impressions** before evaluating

## Workflow

1. n8n cron (every 3 days) pulls performance data from Meta API
2. n8n compares active variants
3. If winner with significance → propose promoting to control
4. Claude generates new challenger creative with hypothesis
5. Image generation via nanobanana-mcp (Gemini)
6. Proposal saved to `autoloop/proposals/`
7. Milan reviews creative + copy + targeting
8. After approval → create new ad variant via Meta API

## Proven Techniques

(Will be populated after experiments.)
