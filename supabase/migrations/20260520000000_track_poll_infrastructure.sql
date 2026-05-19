-- TRACK PMS polling infrastructure
-- Pairs with supabase/functions/track-poll/index.ts
-- Date: 2026-05-20

-- ============================================================================
-- 1. State table: per-collection last-seen timestamps + run heartbeat
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.track_poll_state (
  collection_name TEXT PRIMARY KEY,
  last_seen_updated_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  last_run_outcome TEXT,           -- 'ok' | 'partial' | 'error'
  records_processed INT NOT NULL DEFAULT 0,
  records_errored INT NOT NULL DEFAULT 0
);

ALTER TABLE public.track_poll_state ENABLE ROW LEVEL SECURITY;

-- Only admins/supervisors/managers can read poll state via RLS (no write from clients)
CREATE POLICY "track_poll_state_admin_read"
  ON public.track_poll_state
  FOR SELECT
  TO authenticated
  USING (public.has_admin_access(auth.uid()));

-- Service role bypasses RLS (the edge function uses service role)

-- Seed rows for each collection so the worker has a known starting state
INSERT INTO public.track_poll_state (collection_name, last_seen_updated_at, last_run_outcome, records_processed, records_errored)
VALUES
  ('reservations', NULL, 'pending', 0, 0),
  ('maintenance-work-orders', NULL, 'pending', 0, 0),
  ('housekeeping-work-orders', NULL, 'pending', 0, 0)
ON CONFLICT (collection_name) DO NOTHING;

-- ============================================================================
-- 2. Idempotency: UNIQUE on (external_source, external_id) for tasks
--    + a partial UNIQUE on reservation_events for the 'sync' event_type so we
--    don't insert duplicate sync rows on every poll.
-- ============================================================================

-- Tasks: ensure we never create two AiiA tasks for the same TRACK WO
CREATE UNIQUE INDEX IF NOT EXISTS uq_tasks_external_id
  ON public.tasks (external_source, external_id)
  WHERE external_source IS NOT NULL AND external_id IS NOT NULL;

-- Reservation events: allow many 'sync' events per reservation but require unique
-- one per (external_id, event_at) so re-polling the same record doesn't spam.
CREATE UNIQUE INDEX IF NOT EXISTS uq_reservation_events_external_sync
  ON public.reservation_events (external_source, external_id, event_type, event_at)
  WHERE external_source IS NOT NULL;

-- ============================================================================
-- 3. Audit logs index for fast lookup of polling-run heartbeats + errors
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_audit_logs_track_poll
  ON public.audit_logs (action, created_at DESC)
  WHERE action IN ('track_poll_run', 'track_poll_error');

-- ============================================================================
-- 4. pg_cron schedule: invoke the edge function every 5 minutes
--    Requires pg_cron extension + pg_net extension (Supabase provides both)
--    NB: The Authorization Bearer uses the project's service role JWT,
--    which must be set as a Postgres setting `app.settings.service_role_key`
--    via a Supabase secret BEFORE this cron schedule runs.
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any existing schedule with the same name (idempotent re-deploy)
DO $$
BEGIN
  PERFORM cron.unschedule('track-poll-every-5min');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Schedule the edge function invocation every 5 minutes
SELECT cron.schedule(
  'track-poll-every-5min',
  '*/5 * * * *',
  $cron$
    SELECT net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/track-poll',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object('source', 'pg_cron'),
      timeout_milliseconds := 90000
    );
  $cron$
);

-- ============================================================================
-- 5. Helper view: latest poll status (for OperationsOverview page + ops monitor)
-- ============================================================================
CREATE OR REPLACE VIEW public.v_track_poll_latest AS
SELECT
  collection_name,
  last_seen_updated_at,
  last_run_at,
  last_run_outcome,
  records_processed,
  records_errored,
  EXTRACT(EPOCH FROM (now() - last_run_at)) AS seconds_since_last_run,
  CASE
    WHEN last_run_at IS NULL THEN 'never_ran'
    WHEN last_run_at < now() - INTERVAL '15 minutes' THEN 'stale'
    WHEN last_run_outcome = 'error' THEN 'failing'
    WHEN last_run_outcome = 'partial' THEN 'degraded'
    ELSE 'healthy'
  END AS health
FROM public.track_poll_state;

GRANT SELECT ON public.v_track_poll_latest TO authenticated;
