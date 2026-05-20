-- v2 of v_track_poll_latest: use relative error rate threshold (>10%) instead
-- of treating ANY error as degraded. Most "errors" are statistically expected
-- on edge-case TRACK records (e.g., billing-trigger blocked old historical
-- records); they shouldn't trigger the operator-facing warning banner.

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
    WHEN records_processed = 0 AND records_errored > 5 THEN 'failing'
    WHEN records_processed > 0 AND (records_errored::float / NULLIF(records_processed + records_errored, 0)) > 0.10 THEN 'degraded'
    ELSE 'healthy'
  END AS health
FROM public.track_poll_state;

ALTER VIEW public.v_track_poll_latest SET (security_invoker = on);
GRANT SELECT ON public.v_track_poll_latest TO authenticated, service_role;
