-- Covering indexes for hot OperationsOverview queries.
-- Anticipating 50,000+ TRACK-mirrored records post-backfill.

CREATE INDEX IF NOT EXISTS idx_tasks_category_status_updated
  ON public.tasks (task_category, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_category_due_at
  ON public.tasks (task_category, due_at)
  WHERE due_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reservation_events_source_event_at
  ON public.reservation_events (external_source, event_at DESC)
  WHERE external_source IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_task_updates_created_at_desc
  ON public.task_updates (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_task_photos_created_at_desc
  ON public.task_photos (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_external_source_track
  ON public.tasks (external_source)
  WHERE external_source = 'track';

ANALYZE public.tasks;
ANALYZE public.reservation_events;
ANALYZE public.task_updates;
ANALYZE public.task_photos;
