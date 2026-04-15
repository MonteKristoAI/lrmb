# AutoLoop Program: Voice Agent Booking Rate Optimization

## Objective

Maximize appointment booking conversion rate for Retell AI voice agents.
PROPOSE-ONLY mode -- all prompt changes require human approval.

## Evaluation

Booking conversion rate from Retell call data + GHL pipeline data.
Minimum sample: 30 calls per variant, 1 week observation.

**Primary metric:** Booking rate (appointments booked / total calls), higher is better.

## Guard Rails

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| Call completion rate | Must not decrease vs baseline | DISCARD |
| Compliance language | Must be PRESERVED exactly | DISCARD (hard gate) |
| Payment gating | Must remain active (Pulse) | DISCARD (hard gate) |
| Average call duration | Monitor for anomalies (>2x or <0.5x) | FLAG |

## IMMUTABLE Sections (NEVER modify these)

Each voice agent has compliance sections that are LOCKED:
- Business hours and availability statements
- Payment processing instructions (Text2Pay flow)
- Legal disclaimers
- Emergency/safety redirects
- Data collection consent language

These sections are marked in the Retell prompt with `[COMPLIANCE - DO NOT MODIFY]` tags.

## Action Space

### High Impact
1. **Opening greeting** -- warmth, energy, personalization, name usage
2. **Objection handling** -- price, timing, "just looking", "need to think about it"
3. **Booking flow** -- when to suggest booking, urgency framing, choice architecture

### Medium Impact
4. **Information gathering order** -- front-load vs weave into conversation
5. **Tone/personality** -- professional vs friendly vs enthusiastic
6. **Urgency/scarcity** -- limited spots vs popular times vs seasonal

### Lower Impact
7. **Closing technique** -- assumptive close vs choice close vs summary close
8. **Follow-up offer** -- callback scheduling, text follow-up

## Constraints

- **ALL prompt changes → HUMAN REVIEW** before deployment
- **COMPLIANCE sections are IMMUTABLE** -- never modify
- **A/B testing** via duplicate Retell agent (not modifying live agent)
- **Minimum 30 calls** before declaring winner
- **Minimum 1 week observation** window
- **Transcript review** -- Milan reviews 3+ call transcripts before approving

## Workflow

1. n8n cron (weekly) pulls call data from Retell API
2. n8n analyzes: booking rate, common objections, drop-off points
3. Claude analyzes transcripts for improvement opportunities
4. Claude generates proposed prompt modifications
5. Proposal saved to `autoloop/proposals/` with transcript evidence
6. Milan reviews transcripts + proposed changes
7. After approval → update Retell agent via MCP

## Clients

| Client | Agent | Type | Current Metric |
|--------|-------|------|---------------|
| LuxeShutters | agent_85fc774ff7ac5874444b070ed5 | Inbound | TBD |
| Pulse Performance | agent_d7187b5cf0c77bf25fcac95a47 | Outbound SDR | TBD |

## Proven Techniques

(Will be populated after experiments.)
