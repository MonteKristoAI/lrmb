-- Replace partial UNIQUE indexes with regular UNIQUE constraints so Supabase JS
-- upsert (ON CONFLICT inference) can find them. Partial WHERE-clause predicates
-- aren't accepted by Postgres ON CONFLICT inference unless explicitly passed,
-- which the supabase-js client doesn't do.
-- Date: 2026-05-20

DROP INDEX IF EXISTS public.uq_tasks_external_id;
DROP INDEX IF EXISTS public.uq_reservation_events_external_sync;

ALTER TABLE public.tasks
  ADD CONSTRAINT uq_tasks_external_id
  UNIQUE (external_source, external_id);

ALTER TABLE public.reservation_events
  ADD CONSTRAINT uq_reservation_events_external_sync
  UNIQUE (external_source, external_id, event_type, event_at);
