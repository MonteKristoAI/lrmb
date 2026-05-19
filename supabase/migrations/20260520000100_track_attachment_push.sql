-- D2.3 — TRACK photo push-back infrastructure
-- Pairs with supabase/functions/track-attachment-push/index.ts
-- Date: 2026-05-20
-- Phase: 2 (Week 2 Day 5 deliverable per LRMB-05-15 Document 2)
--
-- NB: This migration ships the schema + cron BUT the edge function refuses to
-- push to TRACK until Q3 (write scope on key #51) is confirmed by Emma. Set
-- the function secret TRACK_ATTACHMENT_PUSH_ENABLED=true ONLY after confirmation.

-- ============================================================================
-- 1. task_photos -- add sync-state columns
-- ============================================================================
ALTER TABLE public.task_photos
  ADD COLUMN IF NOT EXISTS track_attachment_id TEXT,
  ADD COLUMN IF NOT EXISTS track_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS track_sync_attempts INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS track_sync_error TEXT,
  ADD COLUMN IF NOT EXISTS track_next_attempt_at TIMESTAMPTZ;

-- Default new rows to attempt-soon (now)
ALTER TABLE public.task_photos
  ALTER COLUMN track_next_attempt_at SET DEFAULT now();

-- Backfill existing rows
UPDATE public.task_photos
  SET track_next_attempt_at = now()
  WHERE track_next_attempt_at IS NULL AND track_synced_at IS NULL;

-- Index for the worker's queue query
CREATE INDEX IF NOT EXISTS idx_task_photos_pending_sync
  ON public.task_photos (track_next_attempt_at)
  WHERE track_synced_at IS NULL;

-- ============================================================================
-- 2. Helper view: queue depth + failing rows
-- ============================================================================
CREATE OR REPLACE VIEW public.v_track_attachment_queue AS
SELECT
  COUNT(*) FILTER (WHERE track_synced_at IS NULL AND track_next_attempt_at <= now()) AS due_now,
  COUNT(*) FILTER (WHERE track_synced_at IS NULL AND track_next_attempt_at > now()) AS backoff_pending,
  COUNT(*) FILTER (WHERE track_synced_at IS NOT NULL) AS synced_total,
  COUNT(*) FILTER (WHERE track_sync_attempts >= 5 AND track_synced_at IS NULL) AS dead_letter,
  MIN(track_next_attempt_at) FILTER (WHERE track_synced_at IS NULL) AS next_pending_at
FROM public.task_photos;

GRANT SELECT ON public.v_track_attachment_queue TO authenticated;

-- ============================================================================
-- 3. pg_cron schedule: every minute, batch-push pending photos
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  PERFORM cron.unschedule('track-attachment-push-every-1min');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'track-attachment-push-every-1min',
  '* * * * *',
  $cron$
    SELECT net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/track-attachment-push',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object('source', 'pg_cron'),
      timeout_milliseconds := 50000
    );
  $cron$
);
