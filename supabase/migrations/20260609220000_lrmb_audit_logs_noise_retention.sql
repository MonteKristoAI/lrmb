-- L10 audit 2026-06-09 P1-4 (DB) + P1-2 (Ops): audit_logs is 94% machine
-- noise from `track_attachment_push_run` (1 row / minute even when
-- pushed=0/deferred=0/deadLettered=0) and `track_poll_run` heartbeats.
-- At ~50K rows/day current rate the table will hit 1.5M rows/month, and
-- `prune_audit_logs(90)` keeps 90 days so signal-to-noise is &lt; 6%.
--
-- Fix: shorter retention for the two noisy heartbeat actions specifically.
-- Existing `prune_audit_logs(90)` cron handles default retention; we add a
-- separate function for these noisy actions on a 7-day window.

CREATE OR REPLACE FUNCTION public.prune_noisy_heartbeats(days_to_keep integer DEFAULT 7)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  removed integer;
BEGIN
  -- Only keep recent heartbeats from the two highest-volume cron actions.
  -- Keep audit_logs with payload severity != info (errors + warnings).
  DELETE FROM public.audit_logs
  WHERE action IN ('track_attachment_push_run', 'track_poll_run', 'final_clean_orchestrator_run')
    AND created_at &lt; (now() - make_interval(days =&gt; days_to_keep))
    AND COALESCE((payload_json-&gt;&gt;'severity'), 'info') = 'info';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_noisy_heartbeats(integer)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.prune_noisy_heartbeats(integer) TO service_role, postgres;

-- One-shot now: clean up the existing backlog.
SELECT public.prune_noisy_heartbeats(7);

-- Schedule a daily cleanup at 04:00 UTC.
DO $$
BEGIN
  PERFORM cron.unschedule('prune-noisy-heartbeats-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'prune-noisy-heartbeats-daily',
  '0 4 * * *',
  $cron$ SELECT public.prune_noisy_heartbeats(7); $cron$
);
