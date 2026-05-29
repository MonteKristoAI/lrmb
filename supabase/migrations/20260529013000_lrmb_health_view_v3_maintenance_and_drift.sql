-- v_track_sync_health v3: add maintenance metrics + status-drift signal.
-- Closes the monitoring gap that let Emma's two bugs (maintenance
-- vendor missing + cancellations not propagating) accumulate before
-- she noticed.

CREATE OR REPLACE VIEW public.v_track_sync_health AS
WITH new_hk AS (
  SELECT track_clean_type_id, vendor_id, title
  FROM public.tasks
  WHERE task_category = 'housekeeping'
    AND external_source = 'track'
    AND created_at > now() - interval '6 hours'
),
new_maint AS (
  SELECT vendor_id, title, assigned_vendor_name
  FROM public.tasks
  WHERE task_category = 'maintenance'
    AND external_source = 'track'
    AND created_at > now() - interval '6 hours'
),
hk_agg AS (
  SELECT count(*) AS volume,
    count(*) FILTER (WHERE track_clean_type_id IS NOT NULL) AS with_clean_type,
    count(*) FILTER (WHERE title LIKE 'Clean – TRACK WO #%') AS generic_title,
    count(DISTINCT track_clean_type_id) FILTER (WHERE track_clean_type_id IS NOT NULL) AS distinct_clean_types,
    count(*) FILTER (WHERE vendor_id IS NOT NULL) AS with_vendor
  FROM new_hk
),
maint_agg AS (
  SELECT count(*) AS volume,
    count(*) FILTER (WHERE vendor_id IS NOT NULL) AS with_vendor,
    count(*) FILTER (WHERE assigned_vendor_name IS NOT NULL AND vendor_id IS NULL) AS named_but_no_link
  FROM new_maint
),
drift_agg AS (
  SELECT count(*) AS stale_active
  FROM public.tasks
  WHERE external_source = 'track'
    AND status::text IN ('vendor_not_started', 'in_progress', 'new')
    AND updated_at < now() - interval '14 days'
),
ref AS (
  SELECT count(*) AS ref_count, max(synced_at) AS last_synced
  FROM public.track_clean_types
)
SELECT 'hk_volume_l6h' AS metric, hk_agg.volume::text AS observed,
       'sanity (informational)' AS threshold, 'ok' AS status,
       'HK WOs synced from TRACK in last 6h' AS description FROM hk_agg
UNION ALL
SELECT 'hk_clean_type_coverage_pct',
  CASE WHEN hk_agg.volume = 0 THEN 'n/a' ELSE round((hk_agg.with_clean_type::numeric / hk_agg.volume) * 100, 1)::text || '%' END,
  '>= 95% (fires if volume >= 5)',
  CASE WHEN hk_agg.volume < 5 THEN 'ok' WHEN (hk_agg.with_clean_type::numeric / hk_agg.volume) >= 0.95 THEN 'ok' ELSE 'fail' END,
  'HK rows with TRACK clean type FK populated' FROM hk_agg
UNION ALL
SELECT 'hk_generic_clean_title_pct',
  CASE WHEN hk_agg.volume = 0 THEN 'n/a' ELSE round((hk_agg.generic_title::numeric / hk_agg.volume) * 100, 1)::text || '%' END,
  '<= 5% (fires if volume >= 5)',
  CASE WHEN hk_agg.volume < 5 THEN 'ok' WHEN (hk_agg.generic_title::numeric / hk_agg.volume) <= 0.05 THEN 'ok' ELSE 'fail' END,
  'HK rows whose title is generic "Clean – TRACK WO #X"' FROM hk_agg
UNION ALL
SELECT 'hk_distinct_clean_types', hk_agg.distinct_clean_types::text,
  '>= 3 (fires if volume > 10)',
  CASE WHEN hk_agg.volume <= 10 THEN 'ok' WHEN hk_agg.distinct_clean_types >= 3 THEN 'ok' ELSE 'warn' END,
  'Distinct clean types in last 6h (low diversity = enum collapse)' FROM hk_agg
UNION ALL
SELECT 'hk_vendor_coverage_pct',
  CASE WHEN hk_agg.volume = 0 THEN 'n/a' ELSE round((hk_agg.with_vendor::numeric / hk_agg.volume) * 100, 1)::text || '%' END,
  '>= 70% (fires if volume >= 5)',
  CASE WHEN hk_agg.volume < 5 THEN 'ok' WHEN (hk_agg.with_vendor::numeric / hk_agg.volume) >= 0.70 THEN 'ok' ELSE 'warn' END,
  'HK rows with vendor_id resolved' FROM hk_agg
UNION ALL
SELECT 'maint_volume_l6h', maint_agg.volume::text, 'sanity (informational)', 'ok',
       'Maintenance WOs synced from TRACK in last 6h' FROM maint_agg
UNION ALL
SELECT 'maint_vendor_coverage_pct',
  CASE WHEN maint_agg.volume = 0 THEN 'n/a' ELSE round((maint_agg.with_vendor::numeric / NULLIF((maint_agg.with_vendor + maint_agg.named_but_no_link), 0)) * 100, 1)::text || '%' END,
  '>= 95% (fires if 5+ WOs had a named vendor)',
  CASE WHEN (maint_agg.with_vendor + maint_agg.named_but_no_link) < 5 THEN 'ok'
       WHEN maint_agg.named_but_no_link = 0 THEN 'ok'
       WHEN (maint_agg.with_vendor::numeric / NULLIF((maint_agg.with_vendor + maint_agg.named_but_no_link), 0)) >= 0.95 THEN 'ok'
       ELSE 'fail' END,
  'Maintenance rows where TRACK supplied a vendor name and we resolved it to vendor_id' FROM maint_agg
UNION ALL
SELECT 'stale_active_wo_14d', drift_agg.stale_active::text,
  '<= 100 (TRACK status changes likely missed)',
  CASE WHEN drift_agg.stale_active <= 100 THEN 'ok'
       WHEN drift_agg.stale_active <= 500 THEN 'warn'
       ELSE 'fail' END,
  'TRACK WOs stuck in vendor_not_started/in_progress/new for > 14 days. High count = likely TRACK status updates not propagating to local rows.' FROM drift_agg
UNION ALL
SELECT 'reference_clean_types_count', ref.ref_count::text, '>= 10',
  CASE WHEN ref.ref_count >= 10 THEN 'ok' ELSE 'fail' END,
  'Number of rows in public.track_clean_types reference' FROM ref
UNION ALL
SELECT 'reference_clean_types_age_hours',
  CASE WHEN ref.last_synced IS NULL THEN 'never' ELSE round(EXTRACT(epoch FROM (now() - ref.last_synced)) / 3600.0, 1)::text || ' h' END,
  '<= 168 h (7 d)',
  CASE WHEN ref.last_synced IS NULL THEN 'fail'
       WHEN EXTRACT(epoch FROM (now() - ref.last_synced)) <= 7 * 86400 THEN 'ok'
       ELSE 'warn' END,
  'Hours since reference table last synced from TRACK' FROM ref;

ALTER VIEW public.v_track_sync_health SET (security_invoker = true);
REVOKE SELECT ON public.v_track_sync_health FROM anon;
GRANT SELECT ON public.v_track_sync_health TO authenticated, service_role;
