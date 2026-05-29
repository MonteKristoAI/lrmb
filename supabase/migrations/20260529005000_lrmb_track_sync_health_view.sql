-- Anti-regression layer for TRACK sync data quality.
-- Emma feedback 2026-05-29 revealed a class of bug where the sync code
-- reads a field name (e.g. row.cleanType) that TRACK has silently
-- replaced (or never sent), and EVERY row falls back to the same
-- default. The bug doesn't trigger an error, doesn't fail any test,
-- and only surfaces months later when a user notices.
--
-- This view turns those silent collapses into observable metrics. The
-- ops-health-monitor cron reads it every 15 min and escalates any
-- non-ok status to severity=warning/error.
--
-- Window: last 6 hours of new HK WO rows, with min-volume guards so
-- low-traffic periods + post-deploy bursts don't cause false alerts.
-- 7 metrics:
-- 1. hk_volume_l6h               sanity: is anything coming in?
-- 2. hk_clean_type_coverage_pct  are we resolving cleanTypeId? (fires if >= 5 vol)
-- 3. hk_generic_clean_title_pct  is the title falling back to "Clean"? (fires if >= 5 vol)
-- 4. hk_distinct_clean_types     are we getting diverse clean types? (fires if > 10 vol)
-- 5. hk_vendor_coverage_pct      are we resolving vendor links? (fires if >= 5 vol)
-- 6. reference_clean_types_count is the reference table populated?
-- 7. reference_clean_types_age_h has the reference gone stale?

CREATE OR REPLACE VIEW public.v_track_sync_health AS
WITH new_hk AS (
  SELECT track_clean_type_id, vendor_id, title
  FROM public.tasks
  WHERE task_category = 'housekeeping'
    AND external_source = 'track'
    AND created_at > now() - interval '6 hours'
),
agg AS (
  SELECT
    count(*) AS volume,
    count(*) FILTER (WHERE track_clean_type_id IS NOT NULL) AS with_clean_type,
    count(*) FILTER (WHERE title LIKE 'Clean – TRACK WO #%') AS generic_title,
    count(DISTINCT track_clean_type_id) FILTER (WHERE track_clean_type_id IS NOT NULL) AS distinct_clean_types,
    count(*) FILTER (WHERE vendor_id IS NOT NULL) AS with_vendor
  FROM new_hk
),
ref AS (
  SELECT count(*) AS ref_count, max(synced_at) AS last_synced
  FROM public.track_clean_types
)
SELECT 'hk_volume_l6h' AS metric, agg.volume::text AS observed,
       'sanity (informational)' AS threshold, 'ok' AS status,
       'HK WOs synced from TRACK in last 6h (used as denominator for ratios)' AS description
FROM agg
UNION ALL
SELECT 'hk_clean_type_coverage_pct',
  CASE WHEN agg.volume = 0 THEN 'n/a' ELSE round((agg.with_clean_type::numeric / agg.volume) * 100, 1)::text || '%' END,
  '>= 95% (only fires if volume >= 5)',
  CASE WHEN agg.volume < 5 THEN 'ok'
       WHEN (agg.with_clean_type::numeric / agg.volume) >= 0.95 THEN 'ok'
       ELSE 'fail' END,
  'HK rows with TRACK clean type FK populated (fallback path if 0)' FROM agg
UNION ALL
SELECT 'hk_generic_clean_title_pct',
  CASE WHEN agg.volume = 0 THEN 'n/a' ELSE round((agg.generic_title::numeric / agg.volume) * 100, 1)::text || '%' END,
  '<= 5% (only fires if volume >= 5)',
  CASE WHEN agg.volume < 5 THEN 'ok'
       WHEN (agg.generic_title::numeric / agg.volume) <= 0.05 THEN 'ok'
       ELSE 'fail' END,
  'HK rows whose title is generic "Clean - TRACK WO #X" (lookup fallback signal)' FROM agg
UNION ALL
SELECT 'hk_distinct_clean_types', agg.distinct_clean_types::text,
  '>= 3 (only fires if volume > 10)',
  CASE WHEN agg.volume <= 10 THEN 'ok'
       WHEN agg.distinct_clean_types >= 3 THEN 'ok'
       ELSE 'warn' END,
  'Distinct clean types in last 6h (low diversity = enum collapse)' FROM agg
UNION ALL
SELECT 'hk_vendor_coverage_pct',
  CASE WHEN agg.volume = 0 THEN 'n/a' ELSE round((agg.with_vendor::numeric / agg.volume) * 100, 1)::text || '%' END,
  '>= 70% (only fires if volume >= 5)',
  CASE WHEN agg.volume < 5 THEN 'ok'
       WHEN (agg.with_vendor::numeric / agg.volume) >= 0.70 THEN 'ok'
       ELSE 'warn' END,
  'HK rows with vendor_id resolved (vendor-membership RLS depends on this)' FROM agg
UNION ALL
SELECT 'reference_clean_types_count', ref.ref_count::text, '>= 10',
  CASE WHEN ref.ref_count >= 10 THEN 'ok' ELSE 'fail' END,
  'Number of rows in public.track_clean_types reference table' FROM ref
UNION ALL
SELECT 'reference_clean_types_age_hours',
  CASE WHEN ref.last_synced IS NULL THEN 'never'
       ELSE round(EXTRACT(epoch FROM (now() - ref.last_synced)) / 3600.0, 1)::text || ' h' END,
  '<= 168 h (7 d)',
  CASE WHEN ref.last_synced IS NULL THEN 'fail'
       WHEN EXTRACT(epoch FROM (now() - ref.last_synced)) <= 7 * 86400 THEN 'ok'
       ELSE 'warn' END,
  'Hours since reference table last synced from TRACK' FROM ref;

REVOKE SELECT ON public.v_track_sync_health FROM anon;
GRANT  SELECT ON public.v_track_sync_health TO authenticated, service_role;
