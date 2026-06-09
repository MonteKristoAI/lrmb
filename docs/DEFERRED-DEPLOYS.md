# LRMB — Deferred deploys + resync

State of edge functions + migrations + repo as of 2026-06-09 wave 2.

## ✅ Shipped this round (live on edge runtime)

| Function | Version | Notes |
|---|---|---|
| `photo-upload` | v5 | v3 sig-JWT + v4 write-gate + v5 wave: AVIF/AVIS magic-byte support + dropped bogus `hevc` brand + signed URL TTL 24h → 1h + CORS Allow-Origin locked to LRMB origins. |
| `track-webhook` | v10 | Cancel→null skip path + mirror of track-poll v25 mapper. Cancelled WOs no longer contaminate billable queue from webhook delivery. |
| `track-refresh-stale` | v3 | Version-marker bump (forced cold restart). Audit row confirmed: `version=3 checked=250 bumped=210`. |
| `track-detail` | v12 | PII whitelist on BOTH task-link and reservation-detail branches. Guest name/email/phone/address/total no longer leak via share-link viewer. |
| `track-catchup-units` | v12 | Full mirror of track-poll v25+v26 mapper. cancel→null skip + on-hold fix + vendor_not_started precedence + negative-prefix guards. Counts `cancelledSkipped` separately in audit row. |

## ✅ Wave 6 (2026-06-09 follow-up) — both formerly-deferred items shipped

- **track-poll v26 (version 31)** — DEPLOYED via MCP. on-hold regex fix LIVE. First poll completed in 2854ms (success, no errors). New TRACK `on-hold` WOs now correctly classify to `blocked` instead of leaking into `new`.
- **task-photos orphan janitor (v2)** — DEPLOYED. Uses Storage REST API path via `net.http_delete` with vault `service_role_jwt` (bypasses `protect_delete()` trigger). One-shot already cleared 1 known orphan from 2026-05-29 test artifact. Daily cron at 03:15 UTC.

## ✅ Wave 7 (2026-06-10) — i18n Tier 1 shipped

- **Tier 1 pages wired with `t()`**: MyTasks · TaskDetail (toasts + modals + page header) · CompletedTasks · OverdueQueue · BlockedQueue · OpenTasksQueue · HousekeepingQueue · Login (form labels + lockout messages + magic-link toasts) · InspectionChecklist (toasts + completion gate + flag dialog).
- **`safeFormat` / `safeDistance`** now read `localStorage.getItem("lrmb_locale")` at format time and pass `date-fns` `es` locale when set. "hace 2 horas" instead of "2 hours ago".
- **translations.ts grew 188 → 310 keys (+122)** covering all Tier 1 surfaces + status enum labels (`status:new` through `status:cancelled`) for the `Work order ${status}` toast.
- **Login.test.tsx** wrapped in `I18nProvider` so 127/127 tests stay green.
- **AppShell + NotificationBell** already wired in wave 5.

## ⏳ i18n Tier 2 deferred to next round

Lower-traffic admin/supervisor surfaces still in English (Spanish HK staff see Spanish chrome + Tier 1 pages; English only on dashboards they rarely open):

- AdminDashboard, SupervisorDashboard, KPIOverview
- OperationsOverview (the biggest single file, ~1700 lines)
- StaffTasks, PropertyTasks, StaffWorkload, VendorManagement
- CreateTask (toast strings + form labels)
- VerificationQueue, InspectionQueue, TrendCharts, NotFound

Approach: same pattern as Tier 1 (`import { useI18n }`, wrap in `t()`, add keys to translations.ts). The mechanical work is straightforward; just a sprint of edits.

## ✅ Repo migration resync — DONE (wave 4, 2026-06-09)

Previously: 77 migration files in repo vs 93 migrations in DB → 17 dashboard-applied migrations missing from repo.

**Resolved this round (wave 4):** Pulled 17 migration bodies via MCP `execute_sql` against `supabase_migrations.schema_migrations.statements` and wrote them to `supabase/migrations/<version>_dashboard_<name>.sql`. Header on every file documents origin.

Repo file count is now 94 vs DB count 93. The extra file is the L10 lockdown that was applied this session (`20260609230000_lrmb_l10_rls_lockdown.sql`) which still maps 1:1 to the DB row at version `20260609201510_lrmb_l10_rls_lockdown_wave_2`. Migration timestamps remain slightly off between repo and DB on a few entries because the dashboard records the wall-clock apply time, not the file timestamp — this is cosmetic, not load-bearing.

### Historical migration audit context

### Missing versions

DB version timestamps with no corresponding repo file:

| Version | DB name | Likely contents |
|---|---|---|
| 20260505141612 | vendors_add_address_and_uniqueness | vendor schema |
| 20260505142025 | fix_write_audit_log_compile_time_field_reference | audit fn fix |
| 20260505142604 | damage_claim_sop_alignment | SOP |
| 20260505142640 | damage_claim_45day_deadline_via_trigger | 45-day SLA |
| 20260505180815 | units_default_housekeeper_id_fk_to_vendors | units FK |
| 20260505180931 | revoke_rpc_exec_on_pure_trigger_functions | RPC security |
| 20260505181015 | cover_fk_indexes_perf | perf indexes |
| 20260520005319 | security_definer_hardening (rev) | SECDEF |
| 20260520005506 | security_definer_hardening_v2_revoke_from_public | SECDEF v2 |
| 20260522114720 | v_track_reservations_latest | view |
| 20260522114757 | v_track_reservations_latest_v2 | view v2 |
| 20260522114844 | mv_track_reservations_latest | matview |
| 20260522154052 | mv_ops_dashboard_kpis_by_property | matview |
| 20260522195644 | qa_p1_drop_authenticated_audit_insert | RLS audit |
| 20260522195756 | qa_p1_trigger_service_role_bypass | trigger security |
| 20260529162206 | lrmb_regrant_avg_admin_touches_per_task | RPC regrant |
| 20260529162800 | lrmb_drop_legacy_task_photo_policies | storage RLS |

Some repo files exist with similar names but DIFFERENT version timestamps — the repo was tidied to use clean timestamps while dashboard keeps the original wall-clock versions. Cannot mechanically resolve without per-migration content diff.

### How to resync

```bash
# 1. Install supabase CLI
brew install supabase/tap/supabase   # macOS
# or: npm install -g supabase

# 2. Link to project
cd clients/lrmb/app
supabase link --project-ref hfpvnsbiewudpqbtlvte

# 3. Pull schema deltas
supabase db pull --schema public,extensions,vault
# This produces a new file under supabase/migrations/.

# 4. Diff vs existing migrations, consolidate as one resync file:
#    20260609240000_lrmb_dashboard_migrations_resync.sql

# 5. Same deploy goes for track-poll v26 (above):
supabase functions deploy track-poll

# 6. Commit + push.
```

### Risk if unresolved

- Disaster recovery (`supabase db reset && supabase db push`) lands in **prod-minus-16-migrations** state.
- Several missing migrations are security hardening (qa_p1_drop_authenticated_audit_insert, qa_p1_trigger_service_role_bypass, lrmb_drop_legacy_task_photo_policies).
- New env clones (staging branches, dev databases) silently diverge from prod.
- Future migration replay against a clean slate breaks (FK dependencies on dashboard-applied schema).

## 🔒 Service-role JWT rotation (Milan-only)

Still hardcoded in 5 migration files. Exp = 2068. HS256 master key.

| File | Line(s) |
|---|---|
| `supabase/migrations/20260522000000_ops_health_monitor_cron.sql` | 21 |
| `supabase/migrations/20260522010000_tony_weekly_report_cron.sql` | 13 |
| `supabase/migrations/20260522100000_qa_p1_cron_secret_headers.sql` | 33, 51, 69, 87 |
| `supabase/migrations/20260524030000_lrmb_cron_secret_via_vault.sql` | 31, 44, 57, 70 |
| `supabase/migrations/20260529010000_lrmb_service_role_jwt_to_vault.sql` | (already moved to vault, but historical bodies still in DB) |

To rotate:
1. Supabase dashboard → Settings → API → Rotate service_role JWT.
2. `vault.update_secret(<secret_id>, '<new_jwt>', 'service_role_jwt')` so all cron jobs pick up the new one.
3. `git filter-repo --replace-text` to scrub the old JWT from history.
4. Force-push (coordinate with Tony's local clones).

Skipped this round per user direction ("nastavi dalje bez rotacije ključeva").
