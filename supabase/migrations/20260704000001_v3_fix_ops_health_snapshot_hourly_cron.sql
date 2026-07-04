-- Fix: ops-health-snapshot-hourly cron has been failing since 2026-07-01 23:05
-- (all runs failed for 2.5 days, ~60 failed runs, 0 successful).
--
-- Root cause: the L10 mega-hunt (2026-07-02, commit 5fa03bc, COMP-03) changed
-- operational_health_score() from RETURNS TABLE(score int, band text, ...) to
-- RETURNS jsonb, so the built-in guard could raise an exception. The cron
-- command was authored back in Wave 2 assuming the tabular return shape:
--
--   INSERT INTO public.ops_health_snapshots (property_id, score, band, components, captured_at)
--   SELECT NULL, score, band, components, computed_at
--   FROM public.operational_health_score();
--
-- After COMP-03, that SELECT throws "column score does not exist" because
-- operational_health_score() now returns a jsonb column, not a projection of
-- score/band/components/computed_at columns.
--
-- Fix: unpack the jsonb via ->> / -> so the INSERT still receives the correct
-- typed values. Call the fn once via a CTE so we do not evaluate it 4x.
--
-- operational_health_score_by_property() still RETURNS TABLE, so that half of
-- the cron is unchanged.
--
-- Also backfilled a fresh snapshot immediately on prod at apply time so
-- HealthScoreHero sparkline has recent data instead of staying on
-- "Building history..." for another hour.

SELECT cron.unschedule('ops-health-snapshot-hourly');

SELECT cron.schedule('ops-health-snapshot-hourly', '5 * * * *', $CRON$
  WITH platform AS (SELECT public.operational_health_score() AS h)
  INSERT INTO public.ops_health_snapshots (property_id, score, band, components, captured_at)
  SELECT NULL,
         (h->>'score')::int,
         h->>'band',
         h->'components',
         COALESCE((h->>'computed_at')::timestamptz, now())
  FROM platform;

  INSERT INTO public.ops_health_snapshots (property_id, score, band, components, captured_at)
  SELECT property_id, score, band, components, now()
  FROM public.operational_health_score_by_property();
$CRON$);
