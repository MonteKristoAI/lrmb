# v3.0 Wave 2/3 Migrations — DR Note

Full DDL for v3.0 Wave 2 + Wave 3 migrations lives in the Supabase project's
`supabase_migrations.schema_migrations` table on project `hfpvnsbiewudpqbtlvte`.

The stub files in this directory (`20260701100001_*.sql` through
`20260701200004_*.sql`) contain the migration name and intent as a header
comment. Full SQL bodies are on disk in prod and can be pulled at any time via:

```bash
supabase db pull --db-url "$DATABASE_URL"
```

Or via the MCP `list_migrations` + `execute_sql` (SELECT statements FROM
supabase_migrations.schema_migrations WHERE version = ...).

Applied migrations (v3.0):

| Version | Name |
|---|---|
| 20260701182401 | v3_wave1_reservations_mv_widen |
| 20260701182630 | v3_wave1_sla_targets_v2 |
| 20260701182821 | v3_wave1_supervisor_brief_bundle_v2 |
| 20260701191215 | v3_wave2_operational_health_score |
| 20260701191319 | v3_wave2_vendor_performance |
| 20260701191413 | v3_wave2_properties_at_risk |
| 20260701191535 | v3_wave2_command_center_rpcs |
| 20260701192554 | v3_wave3_smart_queue_v2 |
| 20260701192659 | v3_wave3_exception_feed |
| 20260701195350 | v3_wave3_advisor_fixes |
| 20260701195440 | v3_wave3_revoke_public_secdef |
