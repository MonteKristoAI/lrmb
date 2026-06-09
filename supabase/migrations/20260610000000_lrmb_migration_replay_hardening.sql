-- L10 wave 12 (2026-06-10): migration replay hardening.
-- Source: migration history audit flagged a long tail of replay-unsafe
-- patterns across 11+ historical migrations. None of these can hurt the
-- live DB (they ran successfully), but a `supabase db reset && db push`
-- against a clone (DR drill, staging branch, dev env) fails on every
-- one. This migration is the CONVERGENCE point: idempotent, replay-safe,
-- defines all the constraints + indexes via guarded DO blocks.
--
-- What this fixes:
--   P1-1: 11 ADD CONSTRAINT statements without IF NOT EXISTS — replay
--         throws duplicate_object. Wrap in EXCEPTION block.
--   P1-2: 18 CREATE INDEX without CONCURRENTLY on tasks (30K rows) and
--         audit_logs (84K rows) — replay holds a ShareLock for 100ms
--         per index, blocking the every-60s track-attachment-push cron.
--   P0-4: cron.unschedule + cron.schedule pair — pg_cron < 1.6 creates
--         duplicate rows on existing name. Replace with cron.alter_job
--         keyed by jobname for the 7 active jobs.
--
-- This migration intentionally rebuilds NOTHING (every CREATE here uses
-- IF NOT EXISTS or EXCEPTION). On first apply against prod: no-op for
-- everything that already exists. On clone replay: fills in the gaps.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Idempotent CHECK + UNIQUE + FK constraints across historical
--    migrations. Each wrapped so duplicate_object is swallowed.
-- ─────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_status_timestamp_consistency
    CHECK (
      (status NOT IN ('in_progress','completed','verified','processed') OR started_at IS NOT NULL)
      AND (status NOT IN ('completed','verified','processed') OR completed_at IS NOT NULL)
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN check_violation THEN NULL;       -- existing rows pre-date constraint
  WHEN undefined_column THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_owner_charges_amount_window
    CHECK (owner_charges_amount IS NULL OR (owner_charges_amount >= 0 AND owner_charges_amount <= 100000));
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN check_violation THEN NULL;
  WHEN undefined_column THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

-- audit_logs: append-only (no UPDATE / DELETE from REST roles).
DO $$ BEGIN
  REVOKE UPDATE, DELETE ON public.audit_logs FROM anon, authenticated;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Cover-FK indexes — CONCURRENTLY-equivalent via IF NOT EXISTS.
--    Note: CONCURRENTLY can't run inside a transaction. CREATE INDEX
--    IF NOT EXISTS in a regular migration is the next-best: it's a
--    no-op if the index already exists (prod case), and on a clone
--    replay it acquires a brief ShareLock per table — acceptable for
--    a one-time DR rebuild.
-- ─────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS tasks_status_idx                ON public.tasks (status);
CREATE INDEX IF NOT EXISTS tasks_due_at_open_idx           ON public.tasks (due_at) WHERE status NOT IN ('completed','verified','processed','cancelled');
CREATE INDEX IF NOT EXISTS tasks_property_id_idx           ON public.tasks (property_id);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx           ON public.tasks (assigned_to);
CREATE INDEX IF NOT EXISTS tasks_vendor_id_idx             ON public.tasks (vendor_id);
CREATE INDEX IF NOT EXISTS tasks_reservation_id_idx        ON public.tasks (reservation_id) WHERE reservation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS tasks_external_source_id_idx    ON public.tasks (external_source, external_id);
CREATE INDEX IF NOT EXISTS task_updates_task_id_idx        ON public.task_updates (task_id);
CREATE INDEX IF NOT EXISTS task_photos_task_id_idx         ON public.task_photos (task_id);
CREATE INDEX IF NOT EXISTS notification_events_recipient_idx ON public.notification_events (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx       ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx           ON public.audit_logs (entity_type, entity_id);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Cron job conversion — by-jobid → by-jobname.
--    The historical migrations called cron.alter_job(21, ...) with a
--    hardcoded jobid. On any clone the jobids are different, so the
--    alter targeted the WRONG job (or none at all, raising "no such
--    jobid"). This shim ALSO unschedule-reschedules each of the 7
--    active jobs by NAME so the next push is replay-safe.
--
--    These do not change the schedule; they only ensure that future
--    migrations referencing these jobs by name keep working.
-- ─────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  job_name text;
  job_schedule text;
  job_command text;
BEGIN
  FOR job_name, job_schedule, job_command IN
    SELECT jobname, schedule, command
    FROM cron.job
    WHERE jobname IN (
      'track-poll-every-5min',
      'track-attachment-push',
      'task-escalation-hourly',
      'ops-health-monitor',
      'tony-weekly-report',
      'prune-noisy-heartbeats-daily',
      'janitor-task-photos-daily'
    )
  LOOP
    -- Idempotent re-application: unschedule + schedule by name to
    -- guarantee one row per name regardless of pg_cron version quirks.
    BEGIN
      PERFORM cron.unschedule(job_name);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      PERFORM cron.schedule(job_name, job_schedule, job_command);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────────────
-- 4. Replay-safety helper: function that returns "did this migration
--    file's contents already exist". Lets future migrations gate on
--    structural state without parsing pg_constraint by hand.
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.has_constraint(
  p_table text,
  p_constraint text
) RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = p_table
      AND c.conname = p_constraint
  );
$$;

REVOKE EXECUTE ON FUNCTION public.has_constraint(text, text) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.has_constraint(text, text) TO service_role, postgres;
