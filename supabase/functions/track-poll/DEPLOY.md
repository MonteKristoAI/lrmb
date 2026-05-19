# track-poll deploy guide

The polling worker has 3 deploy steps that **must** all complete or `pg_cron` won't actually invoke the function.

## 1. Function secrets

Set the TRACK credentials as Supabase Function secrets (these go into `Deno.env.get(...)` at runtime):

```bash
supabase secrets set \
  TRACK_API_KEY=ae3bc51fcade5499ca001ee041d1c3c3 \
  TRACK_API_SECRET=50fbf400641ed0f23a1d0f7e51fe2753 \
  TRACK_TENANT=lrmb \
  --project-ref <YOUR_REF>
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase Functions runtime — don't set them yourself.

## 2. Deploy the function

```bash
cd clients/lrmb/app
supabase functions deploy track-poll --project-ref <YOUR_REF>
```

Test invocation (returns a JSON summary):

```bash
curl -X POST 'https://<YOUR_REF>.functions.supabase.co/track-poll' \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

Expected first-run output: collections fetched + processed counts > 0, errors close to 0 (some "Unit not yet mapped from TRACK" entries are OK; we haven't built the unit sync yet).

## 3. Set the Postgres GUCs that the cron schedule depends on

The migration `20260520000000_track_poll_infrastructure.sql` schedules a `pg_net.http_post` every 5 min that reads two Postgres settings: `app.settings.supabase_url` and `app.settings.service_role_key`. If those aren't set, the cron job silently no-ops.

Run this in the Supabase SQL editor **once** after applying the migration:

```sql
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://<YOUR_REF>.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = '<YOUR_SERVICE_ROLE_KEY>';
```

You need a fresh connection after `ALTER DATABASE` for the GUC to take effect — restart the SQL editor session or wait ~1 min.

## 4. Apply the migration

```bash
cd clients/lrmb/app
supabase db push --project-ref <YOUR_REF>
```

This:
- Creates `track_poll_state` table + seed rows
- Adds UNIQUE indexes for idempotency
- Schedules the cron (named `track-poll-every-5min`)
- Creates the `v_track_poll_latest` health view

## Verify the schedule is active

```sql
SELECT jobid, schedule, command, active
FROM cron.job
WHERE jobname = 'track-poll-every-5min';
```

You should see `active = true` and `schedule = '*/5 * * * *'`.

## Watch the heartbeat

The function writes a row to `audit_logs` on every run. To watch it live:

```sql
SELECT created_at, severity, metadata->>'elapsedMs' AS ms, metadata->'collections' AS collections
FROM audit_logs
WHERE action = 'track_poll_run'
ORDER BY created_at DESC
LIMIT 10;
```

Or use the helper view:

```sql
SELECT * FROM v_track_poll_latest;
```

## Operational notes

- **Long first run.** The first 1-3 runs may pull thousands of historical records and exceed the default 90s `pg_net` timeout. That's OK — `pg_net` only enforces timeout on the HTTP call itself; the function keeps running in the background. After a few runs the `last_seen_updated_at` watermark stabilizes and runs complete in seconds.
- **Concurrent runs.** If a run takes longer than 5 min the next cron firing will overlap. State updates are upsert-based and idempotent, so the worst case is duplicated CPU work (no data corruption). If this becomes a problem, wrap the function body in `pg_try_advisory_lock(SOMETHING)` or set a `is_running` flag in `track_poll_state`.
- **Backfill mode.** To force a full re-poll, set:
  ```sql
  UPDATE track_poll_state SET last_seen_updated_at = NULL;
  ```
  The next run will walk the entire collection again.
- **Failure alerting.** Tied into existing `audit_logs` severity=error rows. Wire to the global n8n error handler (8N1HZ9RMBZc5oi0z) if/when LRMB joins the alert distribution.

## Rollback

```sql
SELECT cron.unschedule('track-poll-every-5min');
-- then optionally
DROP VIEW v_track_poll_latest;
DROP TABLE track_poll_state;
DROP INDEX uq_tasks_external_id;
DROP INDEX uq_reservation_events_external_sync;
DROP INDEX idx_audit_logs_track_poll;
```

The function deployment itself is removed via `supabase functions delete track-poll`.
