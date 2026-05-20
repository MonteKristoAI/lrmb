# LRMB Week 2 → Week 3 Handoff

**Status snapshot:** 2026-05-20 09:00 UTC · all systems green · pending only Emma's reply

---

## What's live in production

| Component | State | Evidence |
|---|---|---|
| `track-poll` edge fn (v6) — every 5 min | ✅ healthy, 0 errors in last 10 runs | audit_logs `track_poll_run`, run latency 1.2-2.4s |
| `track-attachment-push` edge fn (v3) — every 1 min | ✅ healthy, enabled=true since 08:43 UTC | audit_logs `track_attachment_push_run` |
| `track-overview-data` edge fn (v4) — public read | ✅ serves Tony's share link | Lighthouse Mobile SEO 100, 4 viewports rendered |
| `track-overview-token` edge fn — admin-only RBAC | ✅ HMAC mint gated via `has_admin_access` | Migration `20260520010000_security_definer_hardening.sql` |
| Operations Overview `/operations` page | ✅ live at lrmb.vercel.app | Banner=false, 12 in-house + 4 scheduled today |
| TRACK historical backfill | ✅ COMPLETE 07:37 UTC | 52,627 records: 10k res + 21.8k maint + 20.7k HK |
| pg_cron `track-poll-every-5min` | ✅ scheduled, running clean | `cron.job` schema_id=1 |
| pg_cron `track-attachment-push-every-1min` | ✅ scheduled, push-enabled | `cron.job` schema_id=2 |

---

## DB state

| Metric | Count |
|---|---|
| Total TRACK-mirrored tasks | 29,422 |
| Housekeeping tasks (TRACK-sourced) | 20,762 |
| Maintenance tasks (TRACK-sourced) | 8,660 |
| Reservation events (TRACK-sourced) | 10,102 |
| Unique reservations mirrored | 10,102 |
| Photos in queue (pending push) | 0 |
| Dead-letter photos | 0 |

Last mirrored task: 2026-05-20 07:37 UTC.
Last mirrored reservation event: 2026-05-20 06:15 UTC.

---

## Gated on Emma (blocks Week 3 fully going live)

| Item | Reason it blocks |
|---|---|
| Q3 confirmation — key #51 write scope | Photo push will dry-fire silently. Currently enabled but no verified-writable test |
| Webhook ticket outcome | If yes, switch from polling to event triggers (latency drops from ≤5min to <1s) |
| Sample TRACK Final Clean WO | Tells us whether AiiA mirrors (passive) or replaces (active orchestrator) |
| Rate limit / quota numbers | Currently polling 5min × 3 collections = ~36 calls/hour. Want to confirm <ceiling |
| IP allowlist requirement | If yes, send Supabase edge function egress range |
| Sandbox tenant URL | Determines whether write tests hit prod or sandbox |
| Field-staff roster | Need names/emails to seed Week 3 field-test cohort |
| LRMB logo | Header branding on `/operations` page (currently text-only) |

---

## Known operational caveats

1. **Maintenance poll watermark stuck at 2026-04-10.** TRACK's `?updatedSince` filter on `/maintenance/work-orders` appears to return same 25 records each cycle without advancing. Polling does no harm (idempotent upsert) but wastes one fetch per 5min. Will investigate after Emma confirms whether TRACK supports `?updatedSince` semantically on maintenance endpoint.

2. **Pre-existing AiiA security advisor warnings** (8 total, all pre-date this work):
   - `http` extension in public schema
   - `form_submissions.anon_insert` allows unrestricted INSERT for anon role
   - 4 SECURITY DEFINER functions callable by authenticated users (`has_admin_access`, `has_role`, `find_similar_tasks`, `avg_admin_touches_per_task`)
   - HIBP leaked-password protection disabled (needs Pro plan)
   - Postgres 17.4.1.064 has security patches available
   - **Owner:** Nemr/Manus AiiA core team. Do not touch without explicit approval.

3. **78 performance lints** (39× auth_rls_initplan, 24× unused_index, 15× multiple_permissive_policies). AiiA-wide. Same owner.

4. **Test photo from 2026-04-23** marked synced with `track_attachment_id="n/a"` — by design. It's an AiiA-native task without a TRACK work order, so push worker correctly skips.

---

## Files / artifacts produced this engagement

```
clients/lrmb/
├── app/                              # Phase 1 vault — actual source
│   ├── supabase/
│   │   ├── functions/
│   │   │   ├── track-poll/             # v6 deployed
│   │   │   ├── track-attachment-push/  # v3 deployed
│   │   │   ├── track-overview-data/    # v4 deployed
│   │   │   └── track-overview-token/   # v1 deployed
│   │   └── migrations/                 # 7 migrations
│   ├── scripts/
│   │   ├── sync-track-history.mjs      # one-shot backfill walker
│   │   ├── sync-track-units.mjs        # unit-mapping refresh
│   │   ├── test-track-api.mjs          # auth probe
│   │   └── test-track-writeback.mjs    # write-scope probe (gated on Emma)
│   └── src/pages/
│       └── OperationsOverview.tsx      # public read-only dashboard
├── documents/                          # this folder
├── screenshots/production-2026-05-20/  # 4-viewport capture
└── reports/
    └── LRMB-Pilot-Week0-Snapshot-2026-05-20.pdf
```

---

## Rollback / kill switches

```bash
# Pause polling
SELECT cron.unschedule('track-poll-every-5min');

# Pause photo push (turn off the safety gate)
curl -X POST -H "Authorization: Bearer sbp_..." \
  -H "Content-Type: application/json" \
  "https://api.supabase.com/v1/projects/hfpvnsbiewudpqbtlvte/secrets" \
  -d '[{"name":"TRACK_ATTACHMENT_PUSH_ENABLED","value":"false"}]'

# Pause attachment-push cron entirely
SELECT cron.unschedule('track-attachment-push-every-1min');

# Revoke Tony's share link (rotate HMAC secret — invalidates all outstanding tokens)
curl -X POST -H "Authorization: Bearer sbp_..." \
  -H "Content-Type: application/json" \
  "https://api.supabase.com/v1/projects/hfpvnsbiewudpqbtlvte/secrets" \
  -d '[{"name":"OPS_VIEW_HMAC_SECRET","value":"NEW_SECRET_HERE"}]'
```

Field-staff PWA continues unaffected — AiiA-native tasks remain functional regardless of TRACK polling state.

---

## Week 3 candidate next actions (ordered by reversibility)

1. **(safe, no Emma)** Replace polling on maintenance endpoint with id-range walker if TRACK confirms `?updatedSince` semantics broken there
2. **(safe, no Emma)** Add Recent Activity feed pagination (currently capped at last 50)
3. **(needs Emma's Q3)** Run live write-back probe → enable bidirectional sync (currently only inbound)
4. **(needs Emma webhook ticket outcome)** Switch reservations from poll to webhook subscriber
5. **(needs Emma sample WO)** Decide passive-mirror vs active-orchestrator on Final Clean
6. **(needs Tony briefing)** Schedule 15-min walkthrough of `/operations` link, capture his ask-list
7. **(needs field-staff roster from Emma)** Onboard 2-3 cleaners to mobile PWA, validate photo-upload → TRACK round trip

---

**Owner:** MonteKristo (Alex Srdic persona for Emma comms)
**Next checkpoint:** when Emma responds to Q3 + 5 follow-ups
