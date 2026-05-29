-- Emma round 4 (2026-05-29). Three independent fixes after she opened
-- a maintenance TEST WO (#30726) and a Daily Clean (#32389) and saw:
--   1. The maintenance WO had a 23-item HK checklist ("Remove trash",
--      "Strip linen on the bed", "Open all drawers and curtains"...).
--      Root cause: TRACK upstream /housekeeping/work-orders/{id}/tasks
--      returns HK items even for maintenance WO IDs. Our edge fn
--      persisted them without a category guard.
--   2. Maint WO had no Photo / Note / Waiting Parts buttons because
--      canAct required assigned_to===user.id, locking out vendor-only
--      assignments. (Fixed in TaskDetail.tsx — not here.)
--   3. #32389 showed "In Progress" with 0/20 checklist and zero
--      task_updates. Faithful TRACK sync (TRACK side said "started"),
--      not a local bug. No DB fix; UI now surfaces sync provenance.

-- Layer 1: delete invalid subtasks (one-time backfill).
DELETE FROM public.track_wo_subtasks
WHERE task_id IN (
  SELECT id FROM public.tasks WHERE task_category <> 'housekeeping'
);

-- Layer 2: BEFORE INSERT trigger — reject future regressions at row
-- level. Guards both manual INSERTs and edge-fn upserts.
CREATE OR REPLACE FUNCTION public.reject_non_hk_subtask_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_category text;
BEGIN
  SELECT task_category INTO v_category FROM public.tasks WHERE id = NEW.task_id;
  IF v_category IS NULL THEN
    RAISE EXCEPTION 'track_wo_subtasks insert blocked: parent task % does not exist', NEW.task_id;
  END IF;
  IF v_category <> 'housekeeping' THEN
    RAISE EXCEPTION 'track_wo_subtasks insert blocked: parent task % is %, not housekeeping', NEW.task_id, v_category;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_reject_non_hk_subtask_insert ON public.track_wo_subtasks;
CREATE TRIGGER trg_reject_non_hk_subtask_insert
  BEFORE INSERT ON public.track_wo_subtasks
  FOR EACH ROW EXECUTE FUNCTION public.reject_non_hk_subtask_insert();

-- Layer 3: extend v_track_sync_health with a category-leak signal so
-- the next regression shows up on the daily monitor instead of waiting
-- for Emma's WhatsApp.
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
subtask_leak AS (
  SELECT count(DISTINCT t.id) AS non_hk_with_subtasks
  FROM public.tasks t
  JOIN public.track_wo_subtasks s ON s.task_id = t.id
  WHERE t.task_category <> 'housekeeping'
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
SELECT 'non_hk_wo_with_subtasks', subtask_leak.non_hk_with_subtasks::text,
  '= 0 (the BEFORE INSERT trigger rejects these — > 0 means a bypass exists)',
  CASE WHEN subtask_leak.non_hk_with_subtasks = 0 THEN 'ok' ELSE 'fail' END,
  'Maintenance / inspection WOs that somehow have HK checklist rows attached. Should always be zero post-trigger.' FROM subtask_leak
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
