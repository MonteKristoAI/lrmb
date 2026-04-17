# Max — Luxe Shutters Web Chatbot (Retell)

**Deployed:** 2026-04-17
**Channel:** Retell Chat (text, not voice)
**Status:** Live on luxeshutters.com.au via retell-widget.js

## Retell identifiers

| Resource | ID |
|---|---|
| Chat Agent | `agent_bf11204c7056065b22ce597ed4` |
| Retell LLM | `llm_dc8402c9198ee7bdbb92a2726630` |
| Model | `claude-4.6-sonnet` |
| Temperature | 0.6 |
| Agent version | 2 (v1 published) |

## Widget configuration (index.html)

```html
<script id="retell-widget"
  src="https://dashboard.retellai.com/retell-widget.js"
  data-public-key="public_key_462b3086b404893b6a625"
  data-agent-id="agent_bf11204c7056065b22ce597ed4"
  data-title="Luxe Shutters"
  data-bot-name="Max"
  data-color="#1E5AA8"
  data-logo-url="/logo-widget.webp">
```

Previous voice-widget config (Max v1 — `agent_869a95e48b30ebc1c7317dd682`) replaced.

## Tools (webhook URLs — n8n endpoints)

| Tool | URL | Purpose |
|---|---|---|
| `check_service_area` | `https://primary-production-5fdce.up.railway.app/webhook/luxe-chat-service-area` | Verify suburb/postcode in service area |
| `submit_consultation` | `https://primary-production-5fdce.up.railway.app/webhook/luxe-quote-generate` | Submit lead to GHL pipeline |
| `escalate_to_phone` | `https://primary-production-5fdce.up.railway.app/webhook/luxe-chat-escalate` | Log human handoff + trigger priority SMS |

**⚠️ TODO (not built yet):** `luxe-chat-service-area` and `luxe-chat-escalate` n8n workflows need creating. `luxe-quote-generate` already exists (shared with web form).

## Lifecycle webhook

Agent webhook → `https://primary-production-5fdce.up.railway.app/webhook/luxe-chat-lifecycle`

Retell fires chat_started / chat_ended / chat_analyzed events to this endpoint. n8n workflow needs building to consume.

## Post-chat analysis fields (16)

`product_interest`, `product_material_hint`, `suburb`, `postcode`, `timeline`, `build_type`, `room_count`, `decision_mode`, `intent_score`, `resolution`, `lead_submitted`, `consent_to_contact`, `sentiment`, `objection_raised`, `chat_summary`, `competitor_mentioned`.

## Live stress test results (4 scenarios)

| Scenario | User message | Score |
|---|---|---|
| Price objection (Griffith) | "shutters ridiculously expensive, like a used car, why?" | 95/100 |
| Heritage home (Junee) | "federation with old timber sash windows" | 94/100 |
| Just browsing | "just looking tbh, not ready to buy" | 92/100 |
| Bot question | "are you AI or human?" | 96/100 |
| **Average** | | **94/100** |

All 4 responses: Aussie warmth ✓, regional awareness ✓, zero banned AI phrases ✓, correct tools available ✓, 1 question per turn ✓, real AU terminology (basswood, PVC, Ziptrak, pelmet, federation, sash) ✓.

## Deliverables

- `BLUEPRINT.md` — conversation state machine, objection map, capture flow
- `PROMPT.md` — full Retell LLM prompt (also live in Retell at llm_dc8402c9198ee7bdbb92a2726630)
- `DEPLOYMENT.md` — this file

## Sibling agents

- **Sarah** (phone SDR) — `agent_85fc774ff7ac5874444b070ed5`, voice `minimax-Cimo`, handles inbound 1800-465-893
- **Max v1** (old voice widget) — `agent_869a95e48b30ebc1c7317dd682` — superseded by this chat agent

## Next steps (not in this deploy)

1. Build the 3 new n8n workflows (`luxe-chat-service-area`, `luxe-chat-escalate`, `luxe-chat-lifecycle`)
2. Attach global error handler workflow `8N1HZ9RMBZc5oi0z` to each new n8n workflow
3. Deprecate old Max voice agent if unused (`agent_869a95e48b30ebc1c7317dd682`)
4. Add GHL custom field `chat_source` to pipeline for chat-origin leads vs form leads
5. A/B test: begin message variants at 30-day mark
