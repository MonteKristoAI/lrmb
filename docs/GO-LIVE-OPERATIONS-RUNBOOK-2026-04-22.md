# LRMB Go-Live Operations Runbook

## Ownership
- Launch owner: MonteKristo AI engineering
- Rollback owner: MonteKristo AI engineering lead
- Business escalation: LRMB operations lead
- Communication channel: `#lrmb-launch` (or designated launch WhatsApp thread)

## Monitoring And Alerts
- CI monitor workflow: `.github/workflows/lrmb-prod-monitor.yml` (runs every 15 minutes).
- Production smoke checks:
  - public signup remains disabled,
  - TravelNet webhook blocks unauthorized calls,
  - TravelNet CORS remains locked down.
- Alert signal:
  - Any failed `LRMB Production Monitor` run is launch-critical and requires immediate triage.

## Pre-Launch Checks
1. Confirm latest `main` branch CI is green (`LRMB App CI`).
2. Confirm Supabase secrets:
   - `TRAVELNET_WEBHOOK_SECRET` exists,
   - `TRAVELNET_ALLOWED_ORIGIN` set (or explicitly deferred for server-to-server mode).
3. Confirm latest migrations are applied.
4. Run `npm run verify:prod` from repository root.

## Incident Response (First 24h)
1. Identify incident type:
   - auth failure,
   - webhook ingestion failure,
   - task automation failure.
2. Gather evidence:
   - failing workflow link,
   - relevant Supabase function logs,
   - external id / reservation id involved.
3. Apply immediate mitigation:
   - rotate `TRAVELNET_WEBHOOK_SECRET` if unauthorized traffic is suspected,
   - redeploy `travelnet-webhook` if runtime regression is suspected,
   - pause launch expansion while incident is active.

## Rollback Procedure
1. Revert the latest release PR on GitHub.
2. Push rollback commit to `main`.
3. Re-run `LRMB App CI`.
4. Validate auth and webhook smoke checks.
5. Notify operations channel with rollback completion status.

## Release Artifacts To Record
- Release commit hash/tag.
- Migration list applied for this release.
- TravelNet end-to-end validation external id and resulting task id.
