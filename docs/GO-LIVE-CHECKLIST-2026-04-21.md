# LRMB Go-Live Checklist

This checklist is the final release gate for production launch.

## 1) Security Gate

- [x] Public signup disabled at auth layer (`enable_signup=false`).
- [x] TravelNet webhook rejects missing/invalid secret with `401`.
- [x] TravelNet CORS no longer allows wildcard origin.
- [x] Set `TRAVELNET_ALLOWED_ORIGIN` strategy decided (deferred until exact TravelNet origin is confirmed; secret-only mode active in interim).
- [ ] Rotate all test credentials and remove any non-production users from production auth.
- [ ] Perform final RLS negative test pass for `tasks`, `vendors`, `inspections`, `reservation_events`.

## 2) Quality Gate

- [x] `npm run lint` passes with zero errors.
- [x] `npm run test` passes.
- [x] `npm run build` passes and bundle chunking is split.
- [x] `npm run verify:prod` exists and validates critical production behaviors.
- [x] CI workflow exists: `.github/workflows/lrmb-app-ci.yml`.
- [x] Add repo secrets in GitHub Actions:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- [x] Confirm CI green on default branch after secrets are added.

## 3) Integration Gate

- [x] TravelNet webhook deployed.
- [x] Signup hardening migration applied.
- [x] Run one real TravelNet staging payload end-to-end and verify:
  - reservation event inserted
  - housekeeping task created
  - dedupe logic prevents duplicate tasks
- [ ] Confirm final TravelNet event taxonomy with LRMB operations.

## 4) Operability Gate

- [x] Enable frontend + edge error monitoring baseline (CI-driven production smoke monitor workflow).
- [x] Set alert rules for:
  - webhook 5xx rate
  - webhook unauthorized spikes
  - task creation automation failure
- [x] Create incident runbook for auth outage + webhook outage.

## 5) Release Execution Gate

- [ ] Take pre-release backup snapshot.
- [ ] Tag release commit for rollback point.
- [ ] Deploy DB migrations, then functions, then frontend artifact.
- [x] Run `npm run verify:prod` against live deployment.
- [x] Smoke test role matrix:
  - admin login + admin routes
  - supervisor routes
  - staff restricted access behavior
- [ ] Observe metrics and logs for 24h post-release.

## Ownership Suggestion

- Engineering: Security/Quality/Release gates
- Operations (LRMB): Event taxonomy confirmation + vendor data finalization
- Integration owner: TravelNet payload validation and secret distribution
