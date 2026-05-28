-- TRACK API ignores sortColumn / sortDirection / updatedSince params on
-- /maintenance/work-orders and /housekeeping/work-orders endpoints.
-- Confirmed via track-debug edge fn 2026-05-28:
--   sortColumn=updatedAt -> ignored (returns ID ASC default)
--   sortDirection=desc   -> ignored
--   updatedSince=<ts>    -> ignored
-- Result: page 1 always returns IDs 1-25 (oldest), our client-side
-- updated_at filter drops all rows, last_seen_updated_at watermark
-- stuck on 2026-04-10 for maintenance for 7 weeks.
--
-- Fix: switch watermark from updated_at timestamp to external_id integer
-- and walk pages backward from page_count (where newest WOs live since
-- TRACK sorts by ID ASC). Edge fn track-poll v18+ uses this column.

ALTER TABLE public.track_poll_state
  ADD COLUMN IF NOT EXISTS last_seen_external_id BIGINT;

-- Backfill watermark from the highest external_id we already have in tasks
-- per collection. This prevents the first new-poll run from re-processing
-- thousands of historical WOs (cron timeout risk).
UPDATE public.track_poll_state
SET last_seen_external_id = COALESCE((
  SELECT MAX(NULLIF(regexp_replace(external_id, '\D', '', 'g'), '')::bigint)
  FROM public.tasks
  WHERE external_source = 'track'
    AND task_category = 'maintenance'
), 0)
WHERE collection_name = 'maintenance-work-orders';

UPDATE public.track_poll_state
SET last_seen_external_id = COALESCE((
  SELECT MAX(NULLIF(regexp_replace(external_id, '\D', '', 'g'), '')::bigint)
  FROM public.tasks
  WHERE external_source = 'track'
    AND task_category = 'housekeeping'
), 0)
WHERE collection_name = 'housekeeping-work-orders';
