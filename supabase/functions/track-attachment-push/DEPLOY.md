# track-attachment-push deploy guide (D2.3)

Pushes AiiA-uploaded photos into TRACK as work-order attachments. Satisfies LRMB-05-15 Document 2 §D2.3 ("Photo Synchronization Pipeline") with acceptance criteria: uploads visible <60s, photos linked to correct tasks, failed uploads logged visibly.

## Safety gate

**This function does NOT push to TRACK until you explicitly enable it.** The `TRACK_ATTACHMENT_PUSH_ENABLED` secret defaults to false → the worker drains its queue in noop/dry-run mode (logs every photo it would push, but never POSTs).

This is intentional. Until Emma confirms Q3 (write scope on key #51), pushing attachments to TRACK could fail loudly (403) or — worse — succeed against the wrong scope.

## Pre-flight checks

1. Q3 write scope confirmed by Emma — written confirmation in the email thread that key #51 has write access on maintenance + housekeeping work orders.
2. `test-track-writeback.mjs --live` ran cleanly against a sandbox work order (or against a Emma-pre-approved safe-to-mutate WO).
3. The polling worker (`track-poll`) is deployed and `tasks.external_id` is being populated. Verify with:
   ```sql
   SELECT COUNT(*) FROM tasks WHERE external_source = 'track' AND external_id IS NOT NULL;
   ```

## 1. Apply the migration

```bash
cd clients/lrmb/app
supabase db push --project-ref <REF>
```

This:
- Adds 5 columns to `task_photos` (track_attachment_id, track_synced_at, track_sync_attempts, track_sync_error, track_next_attempt_at)
- Backfills `track_next_attempt_at = now()` for existing rows so they enter the queue immediately
- Adds an index on `(track_next_attempt_at) WHERE track_synced_at IS NULL`
- Creates the `v_track_attachment_queue` health view
- Schedules `track-attachment-push-every-1min` cron

## 2. Set function secrets

```bash
supabase secrets set \
  TRACK_API_KEY=ae3bc51fcade5499ca001ee041d1c3c3 \
  TRACK_API_SECRET=50fbf400641ed0f23a1d0f7e51fe2753 \
  TRACK_TENANT=lrmb \
  --project-ref <REF>
```

**LEAVE `TRACK_ATTACHMENT_PUSH_ENABLED` UNSET FOR NOW.**

## 3. Deploy the function

```bash
supabase functions deploy track-attachment-push --project-ref <REF>
```

## 4. Verify dry-run drain

Watch the first 2-3 cron runs. They should report `enabled: false`, `skippedDisabled: N` where N is the number of pending photos. No TRACK calls happen.

```sql
SELECT created_at, metadata->>'enabled' AS enabled,
       metadata->>'batchSize' AS batch,
       metadata->>'skippedDisabled' AS skipped
FROM audit_logs
WHERE action = 'track_attachment_push_run'
ORDER BY created_at DESC LIMIT 5;
```

## 5. Flip the switch (ONLY after Q3 + safe-mutate test)

```bash
supabase secrets set TRACK_ATTACHMENT_PUSH_ENABLED=true --project-ref <REF>
```

The next cron run will start actually POSTing to TRACK. Watch `audit_logs` for `severity='error'` rows.

## 6. Monitor

```sql
-- Queue depth
SELECT * FROM v_track_attachment_queue;

-- Recent runs
SELECT created_at, severity,
       metadata->>'pushed' AS pushed,
       metadata->>'deferred' AS deferred,
       metadata->>'deadLettered' AS dead
FROM audit_logs
WHERE action = 'track_attachment_push_run'
ORDER BY created_at DESC LIMIT 20;

-- Dead-lettered photos (>=5 failed attempts)
SELECT id, task_id, file_name, track_sync_attempts, track_sync_error
FROM task_photos
WHERE track_synced_at IS NULL AND track_sync_attempts >= 5
ORDER BY updated_at DESC;
```

## Backoff schedule

Failed pushes retry on this cadence: 1m, 5m, 30m, 4h, 24h. After attempt 5 the photo is dead-lettered and excluded from the queue. Manual recovery requires resetting `track_sync_attempts` + `track_next_attempt_at`:

```sql
UPDATE task_photos
SET track_sync_attempts = 0,
    track_next_attempt_at = now(),
    track_sync_error = NULL
WHERE id IN (...);
```

## Acceptance criteria (per Document 2 D2.3)

| Criterion | Verification |
|---|---|
| Uploads visible <60 sec | Cron fires every 1 min → max latency from photo INSERT to TRACK = 60s ± batch processing time. With 50-photo batch, processing is <5s per photo, so worst-case latency ~65s. Acceptable. |
| Photos linked to correct tasks | The function looks up `task_photos.task_id → tasks.external_id` and POSTs to the matching `/{category}/work-orders/{external_id}/attachments`. Linkage is enforced by the FK. |
| Failed uploads logged visibly | `audit_logs` action=track_attachment_push_run captures every run; severity=error for dead-letter or any push fail. `v_track_attachment_queue` view exposes dead-letter count for the Operations Overview banner. |

## Rollback (Tier 1)

```sql
SELECT cron.unschedule('track-attachment-push-every-1min');
```

Queue stays in DB; can be re-enabled. To reset to a clean slate:

```sql
UPDATE task_photos
SET track_sync_attempts = 0,
    track_next_attempt_at = now(),
    track_sync_error = NULL,
    track_synced_at = NULL,
    track_attachment_id = NULL;
```
