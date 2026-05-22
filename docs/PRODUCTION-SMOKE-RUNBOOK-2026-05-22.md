# Production Smoke Runbook — 2026-05-22

> Replaces the April runbook. Covers the v15 dashboard stack: edge functions, materialized views, share-link auth, n8n weekly report.

## What this verifies

The CI verify gate (`npm run verify:prod`) and on-demand smoke runs do these checks against the live `hfpvnsbiewudpqbtlvte` Supabase project:

| Check | What it proves |
|---|---|
| Public signup disabled | RLS + auth flow not exploitable |
| TravelNet unauthorized without secret | Webhook auth wall up |
| TravelNet CORS locked down | No browser-origin webhooks |
| **track-overview-data rejects missing token** | Share-link auth required (new in v15) |
| **track-overview-data rejects bad signature** | HMAC verification active (new in v15) |
| **track-detail rejects missing token** | Drill-down endpoint guarded (new in v15) |

Run it via:
```bash
VITE_SUPABASE_URL=https://hfpvnsbiewudpqbtlvte.supabase.co \
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key> \
node ./scripts/production-smoke.mjs
```

CI runs this automatically on every PR via `npm run verify:prod` (lint + tests + build + smoke).

## Manual additional checks

### Edge function versions

```bash
# Replace with your token
curl -sI "https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-overview-data?t=$TOKEN" \
  | grep -i x-sb-edge-version
```

Expected current versions (as of 2026-05-22):
- `track-overview-data` v15
- `track-detail` v3
- `track-poll` v8
- `track-attachment-push` v5
- `ops-health-monitor` v1
- `tony-weekly-report` v1
- `escalate-overdue-tasks` v? (active)
- `travelnet-webhook` v? (active)

### Materialized view freshness

```sql
-- run via Supabase SQL editor or psql
SELECT refreshed_at, NOW() - refreshed_at AS age
FROM mv_ops_dashboard_kpis;
```

Expected: `age` < 90 seconds. If older, pg_cron job `mv-ops-dashboard-kpis-refresh` has stalled.

```sql
-- Reservations MV: check pg_cron status
SELECT jobname, schedule, last_run_status, last_run
FROM cron.job_run_details d
JOIN cron.job j ON d.jobid = j.jobid
WHERE jobname IN ('mv-ops-dashboard-kpis-refresh', 'mv-track-reservations-latest-refresh')
ORDER BY last_run DESC
LIMIT 6;
```

Expected: `last_run_status = succeeded`, `last_run` within the last 2 minutes.

### TTFB sanity check

```bash
TOKEN="<valid Tony token>"
for i in 1 2 3; do
  curl -s -o /dev/null -w "Run $i: TTFB %{time_starttransfer}s\n" \
    "https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-overview-data?t=$TOKEN"
done
```

Expected: TTFB warm 0.7-1.0s, cold 2.0-2.5s. If consistently >3s, something regressed — check pg_cron, MV bloat (`SELECT pg_size_pretty(pg_total_relation_size('mv_track_reservations_latest'))`), and edge fn logs.

### Frontend live smoke

```bash
# Confirms Vercel deploy + bundle live
curl -sI -A "Mozilla/5.0" https://lrmb.vercel.app/operations | grep -iE "last-modified|HTTP"
curl -s -A "Mozilla/5.0" https://lrmb.vercel.app/ | grep -oE 'OperationsOverview-[A-Za-z0-9_-]+\.js' | head -1
```

The OperationsOverview bundle hash should change after each main-branch merge. If it doesn't, check Vercel deploy status (rate limit, build failure, etc).

### n8n weekly report pipeline

Workflow `BknKUOVi1SUlrNJj` (`[LRMB] Tony Weekly Report → Email`):

```bash
# Verify scheduled trigger is configured
mcp__n8n-mcp__n8n_get_workflow id=BknKUOVi1SUlrNJj mode=structure
```

Expected:
- Schedule trigger active (Mondays 09:15 UTC, cron `0 15 9 * * 1`)
- `Send to Tony` node — **disabled** until Milan toggles on
- `toEmail` = `trajeh@lrmb.com`, CC `contact@montekristobelgrade.com`

To enable for go-live: enable the Send node via n8n UI or MCP `enableNode`.

To smoke-test the email format without firing the schedule:
```bash
# See runbook documents/TONY-WEEKLY-EMAIL-RUNBOOK.md for the procedure used 2026-05-22:
# 1. Reroute toEmail to alex@montekristobelgrade.com
# 2. Add temp webhook trigger
# 3. POST to webhook
# 4. Revert all 3 changes
```

## Troubleshooting

### Dashboard returns empty data

1. Check `mv_ops_dashboard_kpis` exists and has a row (it's a 1-row MV)
2. Check `mv_track_reservations_latest` row count (~10K expected)
3. Check edge fn logs for `db_query_failed` error (v15 surfaces these as HTTP 500)
4. Run TTFB sanity check above

### Modal drill-down errors

1. Open browser DevTools Console — any `RangeError: Invalid time value`? If so, a date field is null/undefined — check the response payload shape against the type defs in `src/pages/OperationsOverview.tsx`
2. Network tab — does `/track-detail?id=...` return 200? If 500, check edge fn logs

### Photos missing from dashboard

Photos live in `task-photos` Supabase Storage bucket. Dashboard generates signed URLs (1-hour TTL) at request time. If 0 photos render:
1. Check `task_photos` table row count
2. Check Storage bucket has matching files (path = `task_photos.storage_path`)
3. Check `track-attachment-push` worker status (separate from dashboard)

### TRACK photo push not working

Currently expected — pending Kent + developer.trackhs.com portal access. See `docs/TRACK-ATTACHMENT-FINDING-2026-05-20.md` and plan `~/.claude/plans/lrmb-je-poslao-ovo-humming-dusk.md`.

## Related docs

- `docs/GO-LIVE-OPERATIONS-RUNBOOK-2026-04-22.md` — April run-of-play
- `docs/TRACK-ATTACHMENT-FINDING-2026-05-20.md` — photo push blocker investigation
- `docs/WEEK2-TO-WEEK3-HANDOFF-2026-05-20.md` — week-over-week handoff state
- Vault: `daily/2026-05-22.md` and `work-log/2026-05-22-lrmb-dashboard-9-pr-hardening.md` — full session log
- Vault: `wiki/patterns/supabase-mv-first-dashboard-perf.md` — the perf pattern this dashboard uses
