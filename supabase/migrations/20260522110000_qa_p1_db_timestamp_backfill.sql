-- QA P1 Q-DB-1,2: fix the 30,286 tasks where created_at = NOW() (insert default)
-- but updated_at = TRACK's historical timestamp, causing updated_at < created_at
-- and negative "cycle time" reads.
--
-- Best-effort fix: set created_at = updated_at when the latter is earlier.
-- We do NOT have access to the original TRACK createdAt (it wasn't mirrored).
-- Using updated_at as the floor is a conservative approximation — it makes
-- cycle-time analytics non-negative without inventing data.
--
-- For new rows the track-poll + track-catchup-units edge fns now write
-- created_at = TRACK's createdAt / dateOpened / dateCreated explicitly, so
-- this anomaly will stop growing after deploy.

UPDATE public.tasks
SET created_at = updated_at
WHERE updated_at IS NOT NULL
  AND updated_at < created_at
  AND external_source = 'track';

-- Q-DB-2: 62 tasks have completed_at < started_at. Same root cause when
-- TRACK reports a completion before our started_at backfilled.
UPDATE public.tasks
SET started_at = completed_at
WHERE started_at IS NOT NULL
  AND completed_at IS NOT NULL
  AND completed_at < started_at
  AND external_source = 'track';

-- Verification helper (queryable post-deploy to confirm zero anomalies):
-- SELECT count(*) FROM public.tasks WHERE updated_at < created_at;     -- expect 0
-- SELECT count(*) FROM public.tasks WHERE completed_at < started_at;   -- expect 0
