# Tony — LRMB Operations Overview Briefing

**Live link:** https://lrmb.vercel.app/operations?t=eyJpYXQiOjE3NzkyMzQwODcsImV4cCI6MTc4MTgyNjA4NywidiI6MSwidmlld2VyIjoiVG9ueSJ9.qgeaGgsAglINUyb0t8r-BLGh2uWInoNTwW_m5wqCxzU
**Refresh:** auto-refreshes every 5 minutes · no login required · token expires 2026-06-18
**Open on:** desktop or phone — both viewports tested

---

## What you're looking at

This is a read-only operations dashboard pulling live data from your TRACK PMS and the AiiA field-staff system. It updates every 5 minutes. No-one can edit anything through this link.

| Section | What it shows | Where the data comes from |
|---|---|---|
| Top-line counters | Total tasks mirrored from TRACK + photos uploaded by field staff | AiiA database (24h rolling) |
| Reservations | Arrivals today, In house, Checkouts today, Upcoming 7 days | TRACK reservations, polled every 5 min |
| Housekeeping queue | Scheduled today, In progress, Completed pending verification | TRACK + AiiA work orders |
| Maintenance queue | Open, Overdue, Blocked, Completed pending verification | TRACK + AiiA work orders |
| Recent Activity (last 24h) | Status changes, priority changes, new tasks | AiiA audit log |
| Recent Photo Proof | Field-staff completion photos | AiiA storage (signed URLs, 1h TTL) |
| Polling Health | Per-collection sync status for TRACK | Polling worker self-reports |

---

## Current state (snapshot 2026-05-20)

- **52,627 TRACK records mirrored** in the AiiA database (~10K reservations, ~21K maintenance work orders, ~20K housekeeping work orders — full historical backfill complete)
- **29,422 active TRACK-sourced tasks**
- **All polling healthy** — zero errors in last 10 cron cycles
- **Photo push to TRACK enabled** — when field staff completes a task with photos, they automatically post to the matching TRACK work order
- **79 AiiA units mapped to TRACK** (one-to-one)

---

## Three questions for you

### Q1 — Add these 4 active TRACK units to AiiA?

These 4 units exist in TRACK and are marked active, but they aren't in AiiA. Field-staff work orders for them currently get dropped by the polling worker because there's no matching AiiA unit. **Decide whether to create AiiA records for them, and whether to combine or split.**

| TRACK ID | TRACK Name | Address | Note |
|---|---|---|---|
| 7 | 1 Hotel & Homes 919 | 102 24th Street | Single listing — likely should be added as-is |
| 41 | Ritz Carlton 310/311 | 10295 Collins Ave | **Combined listing** — should this be one AiiA unit, or two (310 + 311 separately)? |
| 252 | The Setai 1707 | 101 20th Street | Single listing — likely should be added as-is |
| 268 | Roney Palace 1128/1129 | 2301 Collins Ave | **Combined listing** — same question as 41 |

**If we should add them, what property names/addresses match in AiiA?** (i.e. do these correspond to existing AiiA "properties" or do we create new ones?)

### Q2 — Should inactive TRACK units be filtered silently?

30 TRACK units flagged `isActive: false` (archived/retired listings) still generate work orders in TRACK that get polled. Examples: TRACK unit 10 (1 Hotel & Homes 1010), 15 (1 Hotel & Homes 1045), 32 (Castle Beach M15), 86 (The Setai 2202), etc.

**Two options:**
- (a) Filter them silently — polling worker ignores. Cleaner dashboard, no error noise. Slight risk: if a unit gets reactivated in TRACK, we'd need to manually re-import.
- (b) Surface them as warnings — we know if TRACK starts creating work orders for archived units, but the polling health metric flags them.

**Recommendation:** (a) silent filter. We can always re-enable if you want a specific archived unit tracked again.

### Q3 — TRACK Final Clean / Inspection: passive mirror or active orchestrator?

Emma mentioned TRACK auto-creates Final Clean + Inspection work orders for each reservation checkout. Right now AiiA mirrors these (passive). Two paths forward:

- (a) **Passive (status quo)**: AiiA shows what TRACK created. Field staff complete via AiiA, photos sync back to TRACK. Both systems stay in sync.
- (b) **Active orchestrator**: AiiA generates the work order based on checkout events, manages the lifecycle, and TRACK reflects the AiiA state. Better if you want to enforce AiiA-specific SLAs / photo requirements that TRACK doesn't support natively.

**Recommendation:** stay passive for the pilot. Switch to active orchestrator in Phase 2 if Phase 1 surfaces gaps in TRACK's work order semantics (e.g. no photo enforcement, no SLA escalation).

---

## What's pending from Emma's side

- **Q3 confirmation** that TRACK API key #51 has write access on the Reservations and Work Orders modules (write probe gated)
- **Webhook ticket** for real-time reservation lifecycle events (5-min polling currently)
- **Sample Final Clean WO** — to inform Q3 above
- **Rate limits / IP allowlist / sandbox URL** — operational hygiene
- **Field-staff roster** — to onboard cleaners + maintenance techs to AiiA mobile app
- **LRMB logo** — current dashboard is text-header only

---

## What's pending from your side

- Answers to Q1, Q2, Q3 above
- 15-minute walkthrough call when you've had time to click through the dashboard — share any surface-level questions before Phase 2 scoping

---

**Status:** All green. Production-ready. No-action-needed unless you spot something off when you click through.
