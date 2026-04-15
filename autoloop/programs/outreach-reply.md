# AutoLoop Program: Cold Outreach Reply Rate Optimization

## Objective

Maximize email/LinkedIn reply rate through systematic A/B testing
of message variants. PROPOSE-ONLY mode -- never send without human approval.

## Evaluation

Reply rate % from Instantly API or manual tracking.
Minimum sample: 50 sends per variant, 72h observation window.

**Primary metric:** Reply rate (replies / total sends), higher is better.

## Guard Rails

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| Bounce rate | Must stay < 5% | FLAG immediately |
| Unsubscribe rate | Must not increase vs baseline | FLAG |
| Positive reply ratio | Monitor (no hard gate) | REPORT |
| Brand voice | Must pass content quality gate | DISCARD variant |
| Banned vocabulary | Must be 0 | DISCARD variant |

## Action Space (2-3 variables per cycle)

### High Impact
1. **Subject line** -- length, personalization token, question vs statement, curiosity gap
2. **First sentence** -- pain point opener vs curiosity vs social proof vs direct ask
3. **CTA** -- question CTA vs soft ask vs specific date vs binary choice

### Medium Impact
4. **Message length** -- test 50-word vs 100-word vs 150-word variants
5. **Tone** -- formal vs conversational vs peer-to-peer
6. **Personalization depth** -- company name only vs role-specific vs industry insight

### Lower Impact
7. **PS line** -- with vs without, social proof vs scarcity
8. **Send time** -- morning vs afternoon (requires week-long test)

## Constraints

- **ALL variants → HUMAN REVIEW** before any sending
- **Never change more than 2 variables** between control and challenger
- **Minimum 50 sends per variant** before declaring winner
- **Minimum 72h observation** before declaring winner
- **Never fabricate social proof** or false urgency
- **Brand voice compliance** -- run content quality gate on every variant
- **No banned vocabulary** (AI tells, em dashes, etc.)

## Workflow

This domain uses n8n for data collection and Claude Code for variant generation:

1. n8n cron (weekly) pulls reply rates from Instantly API
2. n8n compares variant A vs B
3. If statistical significance → declare winner
4. Claude generates new challenger variant with hypothesis
5. Proposal saved to `autoloop/proposals/`
6. Milan reviews and approves/rejects
7. After approval → n8n pushes new variant to Instantly

## Clients

| Client | Platform | Status |
|--------|----------|--------|
| Reggie Riley (PathFinder Health) | Instantly + LinkedIn (Expandi) | Active |
| EdgeWork (Anthony Bova) | Instantly (18 accounts, 6 domains) + Expandi LinkedIn | Active |

## Proven Techniques

(Will be populated after experiments.)
