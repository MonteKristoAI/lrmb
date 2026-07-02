-- v3.0 L10 P0 sweep (2026-07-02). Adversarial audit surfaced 9 P0 defects.
-- All fixes applied to prod via MCP; this file backfills the repo.
--
-- P0 SECURITY:
--   RLS-01: mv_track_reservations_latest granted SELECT to anon+authenticated.
--   RLS-02: mv_operational_exceptions same class of leak.
--   RLS-03/04: operational_health_score, _by_property, health_score_history
--              were SECDEF granted to authenticated, no role check.
--   RLS-05: refresh_task_priority_scores callable by any authenticated user.
--   REG-4:  smart_queue_score/reason RPC-callable, leaking VIP+ADR-derived data.
--
-- P0/P1 CORRECTNESS:
--   L10-DDL-04: exec_command_center_bundle.turnovers_remaining compared uuid
--              to int, always 0.
--   L10-DDL-02: operational_health_score_by_property band CASE used different
--              formula than score.
--   L10-DDL-07: operational_health_score vendor_avg hardcoded 0.7.
--   SPRINT-01: HK Completion denominator included cancelled tasks.
--   F2:        Vendor top/bottom included test accounts with <10 tasks.
--   L10-DDL-01: sla_targets had no unique constraint on scope, resolver
--              non-deterministic on duplicates.

-- 1) Revoke MVs from anon+authenticated. UI reads go through SECDEF bundles.
REVOKE SELECT ON public.mv_track_reservations_latest FROM anon, authenticated;
REVOKE SELECT ON public.mv_operational_exceptions FROM anon, authenticated;
REVOKE SELECT ON public.mv_vendor_performance_30d FROM anon, authenticated;
REVOKE SELECT ON public.mv_properties_at_risk FROM anon, authenticated;

-- 2) Revoke leaky RPCs from PUBLIC/anon/authenticated.
REVOKE EXECUTE ON FUNCTION public.smart_queue_score(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.smart_queue_reason(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_task_priority_scores() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sla_target_hours(public.task_category, text, public.task_priority) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.sla_deadline(uuid) FROM PUBLIC, anon;

-- 3) Recreate health functions with role guard (null-uid bypass for
--    service_role/cron/migration contexts) + live vendor_avg + unified band.
DROP MATERIALIZED VIEW IF EXISTS public.mv_operational_exceptions CASCADE;
DROP FUNCTION IF EXISTS public.operational_health_score() CASCADE;
DROP FUNCTION IF EXISTS public.operational_health_score_by_property() CASCADE;
DROP FUNCTION IF EXISTS public.health_score_history(int) CASCADE;

CREATE FUNCTION public.operational_health_score()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_open int; v_overdue int; v_blocked int; v_completed_30d int; v_ontime_30d int;
  v_photo_req int; v_photo_have int; v_verify_completed int; v_verify_processed int;
  v_vendor_avg numeric; v_score int; v_band text; v_components jsonb;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'operational_health_score requires admin/manager' USING ERRCODE = '42501';
  END IF;
  SELECT
    COUNT(*) FILTER (WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')),
    COUNT(*) FILTER (WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND sla_deadline(id) < now()),
    COUNT(*) FILTER (WHERE status = 'blocked')
  INTO v_open, v_overdue, v_blocked FROM public.tasks;
  SELECT
    COUNT(*) FILTER (WHERE completed_at > now() - interval '30 days'),
    COUNT(*) FILTER (WHERE completed_at > now() - interval '30 days' AND completed_at <= sla_deadline(id))
  INTO v_completed_30d, v_ontime_30d FROM public.tasks;
  SELECT
    COUNT(*) FILTER (WHERE requires_photo = true AND completed_at > now() - interval '30 days'),
    COUNT(DISTINCT tp.task_id) FILTER (WHERE tp.id IS NOT NULL)
  INTO v_photo_req, v_photo_have
  FROM public.tasks t LEFT JOIN public.task_photos tp ON tp.task_id = t.id
  WHERE t.requires_photo = true AND t.completed_at > now() - interval '30 days';
  SELECT
    COUNT(*) FILTER (WHERE status = 'completed' AND completed_at > now() - interval '7 days'),
    COUNT(*) FILTER (WHERE status IN ('verified','processed') AND completed_at > now() - interval '7 days')
  INTO v_verify_completed, v_verify_processed FROM public.tasks;
  SELECT COALESCE(SUM(score * task_count)::numeric / NULLIF(SUM(task_count), 0) / 100.0, 0.7)
  INTO v_vendor_avg FROM public.mv_vendor_performance_30d WHERE task_count >= 10;
  v_components := jsonb_build_object(
    'open_count', v_open, 'overdue_count', v_overdue, 'blocked_count', v_blocked,
    'overdue_ratio', ROUND((v_overdue::numeric / NULLIF(v_open, 0))::numeric, 3),
    'blocked_ratio', ROUND((v_blocked::numeric / NULLIF(v_open, 0))::numeric, 3),
    'completed_30d', v_completed_30d, 'on_time_30d', v_ontime_30d,
    'on_time_rate', ROUND((v_ontime_30d::numeric / NULLIF(v_completed_30d, 0))::numeric, 3),
    'photo_rate', ROUND((v_photo_have::numeric / NULLIF(v_photo_req, 0))::numeric, 3),
    'verify_health', ROUND((v_verify_processed::numeric / NULLIF(v_verify_completed + v_verify_processed, 0))::numeric, 3),
    'vendor_avg', ROUND(v_vendor_avg, 3));
  v_score := ROUND(100 * (
    0.20 * (1 - COALESCE(v_overdue::numeric / NULLIF(v_open, 0), 0))
    + 0.10 * (1 - COALESCE(v_blocked::numeric / NULLIF(v_open, 0), 0))
    + 0.25 * COALESCE(v_ontime_30d::numeric / NULLIF(v_completed_30d, 0), 0)
    + 0.10 * COALESCE(v_verify_processed::numeric / NULLIF(v_verify_completed + v_verify_processed, 0), 0)
    + 0.15 * COALESCE(v_photo_have::numeric / NULLIF(v_photo_req, 0), 0)
    + 0.20 * v_vendor_avg))::int;
  v_band := CASE WHEN v_score >= 85 THEN 'healthy' WHEN v_score >= 70 THEN 'watch' ELSE 'at_risk' END;
  RETURN jsonb_build_object('score', v_score, 'band', v_band, 'computed_at', now(), 'components', v_components);
END $$;

CREATE FUNCTION public.operational_health_score_by_property()
RETURNS TABLE(property_id uuid, property_name text, score int, band text, components jsonb)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_vendor_avg numeric;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'operational_health_score_by_property requires admin/manager' USING ERRCODE = '42501';
  END IF;
  SELECT COALESCE(SUM(mv.score * mv.task_count)::numeric / NULLIF(SUM(mv.task_count), 0) / 100.0, 0.7)
  INTO v_vendor_avg FROM public.mv_vendor_performance_30d mv WHERE mv.task_count >= 10;
  RETURN QUERY
  WITH per_prop AS (
    SELECT p.id AS property_id, p.name AS property_name,
      COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')) AS open_count,
      COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND sla_deadline(t.id) < now()) AS overdue_count,
      COUNT(*) FILTER (WHERE t.status = 'blocked') AS blocked_count,
      COUNT(*) FILTER (WHERE t.completed_at > now() - interval '30 days') AS completed_30d,
      COUNT(*) FILTER (WHERE t.completed_at > now() - interval '30 days' AND t.completed_at <= sla_deadline(t.id)) AS on_time_30d
    FROM public.properties p LEFT JOIN public.tasks t ON t.property_id = p.id
    GROUP BY p.id, p.name),
  scored AS (
    SELECT pp.*, ROUND(100 * (
      0.20 * (1 - COALESCE(pp.overdue_count::numeric / NULLIF(pp.open_count, 0), 0))
      + 0.10 * (1 - COALESCE(pp.blocked_count::numeric / NULLIF(pp.open_count, 0), 0))
      + 0.25 * COALESCE(pp.on_time_30d::numeric / NULLIF(pp.completed_30d, 0), 0)
      + 0.45 * v_vendor_avg))::int AS s_score
    FROM per_prop pp)
  SELECT s.property_id, s.property_name, s.s_score,
    CASE WHEN s.s_score >= 85 THEN 'healthy' WHEN s.s_score >= 70 THEN 'watch' ELSE 'at_risk' END,
    jsonb_build_object('open_count', s.open_count, 'overdue_count', s.overdue_count, 'blocked_count', s.blocked_count, 'completed_30d', s.completed_30d, 'on_time_30d', s.on_time_30d)
  FROM scored s;
END $$;

CREATE FUNCTION public.health_score_history(p_hours int DEFAULT 24)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'health_score_history requires admin/manager' USING ERRCODE = '42501';
  END IF;
  RETURN (SELECT COALESCE(jsonb_agg(row_to_json(h) ORDER BY h.captured_at ASC), '[]'::jsonb) FROM (
    SELECT captured_at, AVG(score)::int AS score, MODE() WITHIN GROUP (ORDER BY band) AS band
    FROM public.ops_health_snapshots WHERE captured_at > now() - (p_hours || ' hours')::interval GROUP BY captured_at) h);
END $$;

REVOKE EXECUTE ON FUNCTION public.operational_health_score() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.operational_health_score_by_property() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.health_score_history(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.operational_health_score() TO authenticated;
GRANT EXECUTE ON FUNCTION public.operational_health_score_by_property() TO authenticated;
GRANT EXECUTE ON FUNCTION public.health_score_history(int) TO authenticated;

-- 4) Recreate mv_operational_exceptions (unchanged shape).
CREATE MATERIALIZED VIEW public.mv_operational_exceptions AS
WITH
p1_unit_not_ready_raw AS (
  SELECT r.unit_id, r.unit_code, r.guest_name, r.arrival_time, r.arrival_date,
    t.id AS task_id, t.title AS task_title, t.status AS task_status, t.updated_at
  FROM mv_track_reservations_latest r
  JOIN units u ON u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint
  JOIN tasks t ON t.unit_id = u.id
  WHERE r.arrival_date >= CURRENT_DATE AND r.arrival_date <= (CURRENT_DATE + INTERVAL '24 hours')
    AND t.task_category = 'housekeeping'::task_category
    AND t.status = ANY (ARRAY['new'::task_status,'assigned'::task_status,'in_progress'::task_status,'vendor_not_started'::task_status,'waiting_parts'::task_status,'blocked'::task_status])),
p1_unit_not_ready AS (
  SELECT DISTINCT ON (unit_id, arrival_date) 'P1'::text AS severity,
    ('Unit ' || COALESCE(unit_code, 'ID ' || unit_id::text) || ' not guest ready')::text AS title,
    ('Arriving ' || COALESCE(guest_name, 'guest') || ' at ' || COALESCE(arrival_time, 'today') || ', ' || COUNT(*) OVER (PARTITION BY unit_id, arrival_date) || ' HK task(s) open')::text AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id, ('/tasks/' || task_id::text)::text AS entity_link,
    ('p1_notready_' || unit_id::text || '_' || arrival_date::text)::text AS dedupe_key, now() AS created_at
  FROM p1_unit_not_ready_raw ORDER BY unit_id, arrival_date, updated_at DESC NULLS LAST),
p1_vip_raw AS (
  SELECT r.unit_id, r.unit_code, r.guest_name, r.arrival_date, t.id AS task_id, t.title AS task_title, t.updated_at
  FROM mv_track_reservations_latest r
  JOIN units u ON u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint
  JOIN tasks t ON t.unit_id = u.id
  WHERE r.is_vip = true AND r.arrival_date >= CURRENT_DATE AND r.arrival_date <= (CURRENT_DATE + INTERVAL '48 hours')
    AND t.status = ANY (ARRAY['new'::task_status,'assigned'::task_status,'in_progress'::task_status,'vendor_not_started'::task_status,'waiting_parts'::task_status,'blocked'::task_status])),
p1_vip_open_wo AS (
  SELECT DISTINCT ON (unit_id, arrival_date) 'P1'::text AS severity,
    ('VIP arrival with open WO on ' || COALESCE(unit_code, 'unit ' || unit_id::text))::text AS title,
    (COALESCE(guest_name, 'VIP guest') || ' arriving ' || arrival_date::text || ', ' || COUNT(*) OVER (PARTITION BY unit_id, arrival_date) || ' open WO(s)')::text AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id, ('/tasks/' || task_id::text)::text AS entity_link,
    ('p1_vip_' || unit_id::text || '_' || arrival_date::text)::text AS dedupe_key, now() AS created_at
  FROM p1_vip_raw ORDER BY unit_id, arrival_date, updated_at DESC NULLS LAST),
p2_vendor_raw AS (
  SELECT v.id AS vendor_id, v.name AS vendor_name, t.id AS task_id, t.updated_at
  FROM tasks t JOIN vendors v ON v.id = t.vendor_id
  WHERE t.vendor_id IS NOT NULL
    AND t.status = ANY (ARRAY['new'::task_status,'assigned'::task_status,'in_progress'::task_status,'vendor_not_started'::task_status,'waiting_parts'::task_status,'blocked'::task_status])
    AND sla_deadline(t.id) < now()),
p2_vendor_sla AS (
  SELECT DISTINCT ON (vendor_id) 'P2'::text AS severity,
    ('Vendor SLA missed: ' || COALESCE(vendor_name, 'Unknown vendor'))::text AS title,
    (COUNT(*) OVER (PARTITION BY vendor_id) || ' overdue task(s) past SLA deadline')::text AS subtitle,
    'vendor'::text AS entity_type, vendor_id AS entity_id, ('/admin/vendors/' || vendor_id::text)::text AS entity_link,
    ('p2_vendorsla_' || vendor_id::text)::text AS dedupe_key, now() AS created_at
  FROM p2_vendor_raw ORDER BY vendor_id, updated_at DESC NULLS LAST),
p2_health_dropped AS (
  SELECT 'P2'::text AS severity, ('Property health dropped: ' || p.name)::text AS title,
    ('Score dropped from ' || snap.score::text || ' to ' || curr.score::text)::text AS subtitle,
    'property'::text AS entity_type, p.id AS entity_id, ('/admin/properties/' || p.id::text)::text AS entity_link,
    ('p2_healthdrop_' || p.id::text)::text AS dedupe_key, now() AS created_at
  FROM properties p
  JOIN LATERAL (SELECT score FROM operational_health_score_by_property() ohs WHERE ohs.property_id = p.id) curr ON true
  JOIN LATERAL (SELECT score FROM ops_health_snapshots ohs2 WHERE ohs2.property_id = p.id AND ohs2.captured_at <= (now() - INTERVAL '15 minutes') ORDER BY ohs2.captured_at ASC LIMIT 1) snap ON true
  WHERE curr.score <= (snap.score - 10)),
p3_overdue_vip_raw AS (
  SELECT u.id AS unit_id, u.unit_code, t.id AS task_id, t.title AS task_title, sla_deadline(t.id) AS deadline, t.updated_at
  FROM tasks t JOIN units u ON u.id = t.unit_id
  WHERE t.status = ANY (ARRAY['new'::task_status,'assigned'::task_status,'in_progress'::task_status,'vendor_not_started'::task_status,'waiting_parts'::task_status,'blocked'::task_status])
    AND sla_deadline(t.id) < (now() - INTERVAL '24 hours')
    AND EXISTS (SELECT 1 FROM mv_track_reservations_latest r
                WHERE (r.unit_id::text = u.id::text OR (u.track_id IS NOT NULL AND r.unit_id::bigint = u.track_id))
                  AND r.is_vip = true AND r.arrival_date >= (CURRENT_DATE - INTERVAL '7 days')
                  AND r.arrival_date <= (CURRENT_DATE + INTERVAL '7 days'))),
p3_overdue_vip AS (
  SELECT DISTINCT ON (unit_id) 'P3'::text AS severity,
    ('Overdue on VIP-tagged unit: ' || COALESCE(unit_code, 'unit'))::text AS title,
    (COUNT(*) OVER (PARTITION BY unit_id) || ' overdue task(s), oldest ' || round(EXTRACT(epoch FROM now() - MIN(deadline) OVER (PARTITION BY unit_id)) / 3600.0)::text || 'h past SLA')::text AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id, ('/tasks/' || task_id::text)::text AS entity_link,
    ('p3_overduevip_' || unit_id::text)::text AS dedupe_key, now() AS created_at
  FROM p3_overdue_vip_raw ORDER BY unit_id, deadline ASC NULLS LAST),
merged AS (SELECT * FROM p1_unit_not_ready UNION ALL SELECT * FROM p1_vip_open_wo
           UNION ALL SELECT * FROM p2_vendor_sla UNION ALL SELECT * FROM p2_health_dropped
           UNION ALL SELECT * FROM p3_overdue_vip)
SELECT DISTINCT ON (dedupe_key) severity, title, subtitle, entity_type, entity_id, entity_link, dedupe_key, created_at
FROM merged ORDER BY dedupe_key, severity ASC;

CREATE UNIQUE INDEX mv_operational_exceptions_dedupe_key_idx ON public.mv_operational_exceptions (dedupe_key);
CREATE INDEX mv_operational_exceptions_severity_idx ON public.mv_operational_exceptions (severity, created_at DESC);
REVOKE ALL ON public.mv_operational_exceptions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.exception_feed(p_limit int DEFAULT 50)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.has_admin_access(auth.uid()) OR public.has_role(auth.uid(), 'supervisor')) THEN
    RAISE EXCEPTION 'exception_feed requires supervisor/manager/admin' USING ERRCODE = '42501';
  END IF;
  RETURN (SELECT COALESCE(jsonb_agg(row_to_json(e)), '[]'::jsonb) FROM (
    SELECT severity, title, subtitle, entity_type, entity_id, entity_link, dedupe_key, created_at
    FROM public.mv_operational_exceptions ORDER BY severity ASC, created_at DESC LIMIT p_limit) e);
END $$;
REVOKE EXECUTE ON FUNCTION public.exception_feed(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.exception_feed(int) TO authenticated;

-- 5) exec_command_center_bundle: turnovers uuid join fix, HK denominator excludes
--    cancelled, vendor top/bottom floors at task_count >= 10.
CREATE OR REPLACE FUNCTION public.exec_command_center_bundle()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_health jsonb; v_revenue numeric; v_props_at_risk int; v_props_at_risk_top jsonb;
  v_vip_today jsonb; v_vip_tomorrow jsonb; v_turnovers int;
  v_hk_pct numeric; v_maint_sla numeric;
  v_vendor_top jsonb; v_vendor_bottom jsonb;
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'exec_command_center_bundle requires admin/manager' USING ERRCODE = '42501';
  END IF;
  v_health := public.operational_health_score();
  SELECT COALESCE(SUM(adr), 0) INTO v_revenue
  FROM public.mv_track_reservations_latest
  WHERE arrival_date <= CURRENT_DATE AND departure_date > CURRENT_DATE;
  SELECT COUNT(*) FILTER (WHERE risk_band IN ('critical','at_risk')),
    COALESCE(jsonb_agg(row_to_json(m) ORDER BY
      CASE risk_band WHEN 'critical' THEN 1 WHEN 'at_risk' THEN 2 WHEN 'watch' THEN 3 ELSE 4 END,
      health_score ASC) FILTER (WHERE risk_band != 'healthy'), '[]'::jsonb)
  INTO v_props_at_risk, v_props_at_risk_top FROM public.mv_properties_at_risk m;
  SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_time), '[]'::jsonb) INTO v_vip_today
  FROM (SELECT unit_code, guest_name, arrival_time, is_vip FROM public.mv_track_reservations_latest WHERE is_vip = true AND arrival_date = CURRENT_DATE) v;
  SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_time), '[]'::jsonb) INTO v_vip_tomorrow
  FROM (SELECT unit_code, guest_name, arrival_time, is_vip FROM public.mv_track_reservations_latest WHERE is_vip = true AND arrival_date = CURRENT_DATE + 1) v;
  SELECT COUNT(DISTINCT u.id) INTO v_turnovers
  FROM public.mv_track_reservations_latest r
  JOIN public.units u ON u.track_id = r.unit_id::bigint
  WHERE r.departure_date = CURRENT_DATE
    AND EXISTS (SELECT 1 FROM public.tasks t WHERE t.unit_id = u.id
                AND t.task_category = 'housekeeping'::task_category
                AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked'));
  SELECT COALESCE(
    COUNT(*) FILTER (WHERE status IN ('completed','verified','processed'))::numeric /
    NULLIF(COUNT(*) FILTER (WHERE status != 'cancelled'), 0), 0)
  INTO v_hk_pct FROM public.tasks
  WHERE task_category = 'housekeeping'::task_category
    AND (updated_at::date = CURRENT_DATE OR scheduled_for::date = CURRENT_DATE);
  SELECT COALESCE(COUNT(*) FILTER (WHERE completed_at <= sla_deadline(id))::numeric / NULLIF(COUNT(*), 0), 0)
  INTO v_maint_sla FROM public.tasks
  WHERE task_category = 'maintenance'::task_category AND completed_at > now() - interval '30 days';
  SELECT COALESCE(jsonb_agg(row_to_json(v)), '[]'::jsonb) INTO v_vendor_top
  FROM (SELECT vendor_id, vendor_name, score, on_time_pct, task_count
        FROM public.mv_vendor_performance_30d WHERE task_count >= 10 ORDER BY score DESC LIMIT 3) v;
  SELECT COALESCE(jsonb_agg(row_to_json(v)), '[]'::jsonb) INTO v_vendor_bottom
  FROM (SELECT vendor_id, vendor_name, score, no_show_pct, task_count
        FROM public.mv_vendor_performance_30d WHERE task_count >= 10 ORDER BY score ASC LIMIT 3) v;
  RETURN jsonb_build_object(
    'health', v_health, 'revenue_today', v_revenue,
    'properties_at_risk_count', v_props_at_risk, 'properties_at_risk_top10', v_props_at_risk_top,
    'vip_arrivals_today', v_vip_today, 'vip_arrivals_tomorrow', v_vip_tomorrow,
    'turnovers_remaining', v_turnovers,
    'housekeeping_completion_pct', v_hk_pct, 'maintenance_sla_pct', v_maint_sla,
    'vendor_top3', v_vendor_top, 'vendor_bottom3', v_vendor_bottom,
    'computed_at', now());
END $$;
REVOKE EXECUTE ON FUNCTION public.exec_command_center_bundle() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.exec_command_center_bundle() TO authenticated;

-- 6) sla_targets uniqueness on scope (NULLS NOT DISTINCT so NULL type/priority
--    dedupe against each other).
CREATE UNIQUE INDEX IF NOT EXISTS sla_targets_scope_active_uniq
  ON public.sla_targets (task_category, task_type, priority)
  NULLS NOT DISTINCT
  WHERE active = true;

-- 7) PDF-02 hygiene: strip en-dash / em-dash from user-facing text.
--    22,059 of 31,738 task titles arrived from TRACK with U+2013.
UPDATE public.tasks
SET title = replace(replace(title, chr(8211), '-'), chr(8212), '-')
WHERE title LIKE '%' || chr(8211) || '%' OR title LIKE '%' || chr(8212) || '%';
UPDATE public.tasks
SET blocked_reason = replace(replace(blocked_reason, chr(8211), '-'), chr(8212), '-')
WHERE blocked_reason ~ (chr(8211) || '|' || chr(8212));
UPDATE public.task_updates
SET note = replace(replace(note, chr(8211), '-'), chr(8212), '-')
WHERE note ~ (chr(8211) || '|' || chr(8212));
UPDATE public.units
SET unit_code = replace(replace(unit_code, chr(8211), '-'), chr(8212), '-')
WHERE unit_code ~ (chr(8211) || '|' || chr(8212));

-- 8) PERF-6: stagger v3 cron off :00 to avoid connection storm at top-of-minute.
SELECT cron.unschedule('mv-operational-exceptions-refresh')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'mv-operational-exceptions-refresh');
SELECT cron.unschedule('mv-properties-at-risk-refresh')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'mv-properties-at-risk-refresh');
SELECT cron.unschedule('mv-track-reservations-latest-refresh')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'mv-track-reservations-latest-refresh');
SELECT cron.unschedule('mv-vendor-performance-30d-refresh')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'mv-vendor-performance-30d-refresh');
SELECT cron.unschedule('refresh-task-priority-scores-2min')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh-task-priority-scores-2min');

SELECT cron.schedule('mv-operational-exceptions-refresh', '2-59/5 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_operational_exceptions;$$);
SELECT cron.schedule('mv-properties-at-risk-refresh', '3-59/5 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_properties_at_risk;$$);
SELECT cron.schedule('mv-track-reservations-latest-refresh', '7-59/10 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_track_reservations_latest;$$);
SELECT cron.schedule('mv-vendor-performance-30d-refresh', '11-59/15 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_vendor_performance_30d;$$);
SELECT cron.schedule('refresh-task-priority-scores-2min', '1-59/2 * * * *',
  $$SELECT public.refresh_task_priority_scores();$$);

REFRESH MATERIALIZED VIEW public.mv_operational_exceptions;
SELECT public.refresh_task_priority_scores();
