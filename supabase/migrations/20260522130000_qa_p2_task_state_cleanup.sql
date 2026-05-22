-- QA P2 Q-DB-3,4,5: clean up inconsistent task state + orphan storage blobs.

-- Q-DB-3: 8 tasks have status='completed' but completed_at IS NULL.
-- Use updated_at as the completion timestamp — that's when the row last moved.
-- Q-DB-3: 8 tasks status=completed but completed_at IS NULL.
UPDATE public.tasks SET completed_at = updated_at
WHERE status='completed' AND completed_at IS NULL;

-- Q-DB-4: 2 tasks status=in_progress but started_at IS NULL.
UPDATE public.tasks SET started_at = updated_at
WHERE status='in_progress' AND started_at IS NULL;

-- Q-DB-3 (terminal expansion): a handful of completed/verified/processed rows
-- have started_at NULL because TRACK historically didn't populate dateStarted.
-- Use completed_at as the approximation so the CHECK below holds.
UPDATE public.tasks
SET started_at = COALESCE(started_at, completed_at, updated_at)
WHERE status IN ('completed','verified','processed') AND started_at IS NULL;

UPDATE public.tasks
SET verified_at = COALESCE(verified_at, completed_at, updated_at)
WHERE status IN ('verified','processed') AND verified_at IS NULL;

UPDATE public.tasks
SET processed_at = COALESCE(processed_at, verified_at, completed_at, updated_at)
WHERE status='processed' AND processed_at IS NULL;

-- Last 2 outliers: processed rows where completed_at slipped through (TRACK
-- skipped completion and went straight to processed). Backfill from updated_at.
UPDATE public.tasks SET completed_at = updated_at
WHERE status IN ('completed','verified','processed') AND completed_at IS NULL;

-- Forward guard: lock the invariant.
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_status_timestamp_consistency
  CHECK (
    (status NOT IN ('completed','verified','processed') OR completed_at IS NOT NULL)
    AND (status NOT IN ('in_progress','completed','verified','processed') OR started_at IS NOT NULL)
  );

-- Q-DB-5: 3 orphan storage objects from test fixtures (Mar-Apr 2026).
-- These were uploaded then the matching task_photos row was deleted.
-- We can't use a SQL DELETE on storage.objects (Supabase uses internal API);
-- the cleanup is performed via a one-shot service-role storage.remove() call
-- documented in QA-CLEANUP-2026-05-22.md. This migration is a no-op for them.
