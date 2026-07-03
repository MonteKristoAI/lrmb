-- PERF-M1: denormalize sla_deadline() per-row calls into task_sla_deadlines
-- table maintained by trigger. exec_command_center_bundle warm floor was 410ms
-- (cold 1.5s) because the Maintenance-SLA block ran sla_deadline() per row
-- across ~4,500 completed maintenance tasks every 30s per admin tab.
--
-- After PERF-M1: cold 181ms (8.3x faster), warm 152ms (2.7x faster).
-- Numbers preserved (maintenance_sla_pct = 0.057, unchanged).

CREATE TABLE IF NOT EXISTS public.task_sla_deadlines (
  task_id uuid PRIMARY KEY REFERENCES public.tasks(id) ON DELETE CASCADE,
  deadline timestamptz NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS task_sla_deadlines_deadline_idx ON public.task_sla_deadlines (deadline);
ALTER TABLE public.task_sla_deadlines ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.task_sla_deadlines FROM PUBLIC, anon, authenticated;

COMMENT ON TABLE public.task_sla_deadlines IS
  'Denormalized SLA deadline per task, maintained by tasks_recompute_sla_deadline_tg. Service-role only (all client grants revoked).';

-- Backfill
INSERT INTO public.task_sla_deadlines (task_id, deadline, computed_at)
SELECT id, sla_deadline(id), now() FROM public.tasks
WHERE sla_deadline(id) IS NOT NULL
ON CONFLICT (task_id) DO UPDATE SET deadline = EXCLUDED.deadline, computed_at = EXCLUDED.computed_at;

-- Trigger maintenance
CREATE OR REPLACE FUNCTION public.tasks_recompute_sla_deadline() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.task_sla_deadlines WHERE task_id = OLD.id;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' AND
     NEW.due_at IS NOT DISTINCT FROM OLD.due_at AND
     NEW.task_category IS NOT DISTINCT FROM OLD.task_category AND
     NEW.task_type IS NOT DISTINCT FROM OLD.task_type AND
     NEW.priority IS NOT DISTINCT FROM OLD.priority AND
     NEW.created_at IS NOT DISTINCT FROM OLD.created_at THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.task_sla_deadlines (task_id, deadline, computed_at)
  VALUES (NEW.id, sla_deadline(NEW.id), now())
  ON CONFLICT (task_id) DO UPDATE SET deadline = EXCLUDED.deadline, computed_at = EXCLUDED.computed_at;
  RETURN NEW;
END $$;

REVOKE EXECUTE ON FUNCTION public.tasks_recompute_sla_deadline() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS tasks_recompute_sla_deadline_tg ON public.tasks;
CREATE TRIGGER tasks_recompute_sla_deadline_tg
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.tasks_recompute_sla_deadline();

-- Rewrite exec_command_center_bundle to JOIN task_sla_deadlines
CREATE OR REPLACE FUNCTION public.exec_command_center_bundle()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r jsonb;
BEGIN
  IF NOT public.has_admin_or_manager(auth.uid()) THEN
    RAISE EXCEPTION 'exec_command_center_bundle requires admin/manager' USING ERRCODE='42501';
  END IF;
  r := jsonb_build_object(
    'health', public.operational_health_score(),
    'revenue_today', (SELECT COALESCE(SUM(adr),0) FROM public.mv_track_reservations_latest
                      WHERE arrival_date<=CURRENT_DATE AND departure_date>CURRENT_DATE),
    'properties_at_risk_count', (SELECT COUNT(*) FILTER (WHERE risk_band IN ('critical','at_risk')) FROM public.mv_properties_at_risk),
    'properties_at_risk_top10', (SELECT COALESCE(jsonb_agg(row_to_json(m) ORDER BY
        CASE risk_band WHEN 'critical' THEN 1 WHEN 'at_risk' THEN 2 WHEN 'watch' THEN 3 ELSE 4 END,
        health_score ASC) FILTER (WHERE risk_band!='healthy'), '[]'::jsonb)
      FROM public.mv_properties_at_risk m),
    'vip_arrivals_today', (SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_time),'[]'::jsonb) FROM (
        SELECT unit_code,guest_name,arrival_time,is_vip FROM public.mv_track_reservations_latest
        WHERE is_vip=true AND arrival_date=CURRENT_DATE) v),
    'vip_arrivals_tomorrow', (SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_time),'[]'::jsonb) FROM (
        SELECT unit_code,guest_name,arrival_time,is_vip FROM public.mv_track_reservations_latest
        WHERE is_vip=true AND arrival_date=CURRENT_DATE+1) v),
    'turnovers_remaining', (
      SELECT COUNT(DISTINCT u.id) FROM public.mv_track_reservations_latest r
      JOIN public.units u ON u.track_id = r.unit_id::bigint
      WHERE r.arrival_date=CURRENT_DATE
        AND EXISTS (SELECT 1 FROM public.mv_track_reservations_latest prev
                    WHERE prev.unit_id=r.unit_id AND prev.departure_date BETWEEN CURRENT_DATE-INTERVAL '7 days' AND CURRENT_DATE AND prev.external_id<>r.external_id)
        AND NOT EXISTS (SELECT 1 FROM public.tasks t
                        WHERE t.unit_id=u.id AND t.task_category='housekeeping'::task_category
                          AND t.status IN ('completed','verified','processed')
                          AND t.completed_at > (SELECT MAX(prev.departure_date::timestamptz) FROM public.mv_track_reservations_latest prev
                                                WHERE prev.unit_id=r.unit_id AND prev.departure_date BETWEEN CURRENT_DATE-INTERVAL '7 days' AND CURRENT_DATE AND prev.external_id<>r.external_id))
    ),
    'housekeeping_completion_pct', (
      SELECT COALESCE(COUNT(*) FILTER (WHERE status IN ('completed','verified','processed'))::numeric /
                      NULLIF(COUNT(*) FILTER (WHERE status!='cancelled'),0), 0)
      FROM public.tasks WHERE task_category='housekeeping'::task_category
        AND updated_at>=CURRENT_DATE::timestamptz AND updated_at<(CURRENT_DATE+1)::timestamptz),
    'housekeeping_completion_n', (
      SELECT COUNT(*) FILTER (WHERE status!='cancelled')
      FROM public.tasks WHERE task_category='housekeeping'::task_category
        AND updated_at>=CURRENT_DATE::timestamptz AND updated_at<(CURRENT_DATE+1)::timestamptz),
    -- PERF-M1: JOIN task_sla_deadlines instead of sla_deadline(id) per-row
    'maintenance_sla_pct', (
      SELECT COALESCE(COUNT(*) FILTER (WHERE t.completed_at<=d.deadline)::numeric / NULLIF(COUNT(*),0), 0)
      FROM public.tasks t
      LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id
      WHERE t.task_category='maintenance'::task_category
        AND t.completed_at IS NOT NULL AND t.completed_at>now()-interval '90 days'),
    'maintenance_sla_n', (
      SELECT COUNT(*) FROM public.tasks WHERE task_category='maintenance'::task_category
        AND completed_at IS NOT NULL AND completed_at>now()-interval '90 days'),
    'vendor_top3', (SELECT COALESCE(jsonb_agg(row_to_json(v)),'[]'::jsonb) FROM (
        SELECT vendor_id,vendor_name,score,on_time_pct,task_count FROM public.mv_vendor_performance_30d
        WHERE task_count>=10 ORDER BY score DESC LIMIT 3) v),
    'vendor_bottom3', (SELECT COALESCE(jsonb_agg(row_to_json(v)),'[]'::jsonb) FROM (
        SELECT vendor_id,vendor_name,score,no_show_pct,task_count FROM public.mv_vendor_performance_30d
        WHERE task_count>=10 ORDER BY score ASC LIMIT 3) v),
    'computed_at', now()
  );
  RETURN r;
END $$;

-- operational_health_score also JOINs task_sla_deadlines now
CREATE OR REPLACE FUNCTION public.operational_health_score()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_open int; v_overdue int; v_blocked int; v_completed_30d int; v_ontime_30d int;
  v_photo_req int; v_photo_have int; v_verify_completed int; v_verify_processed int;
  v_vendor_avg numeric; v_score int; v_band text; v_components jsonb;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_or_manager(auth.uid()) THEN
    RAISE EXCEPTION 'operational_health_score requires admin/manager' USING ERRCODE='42501';
  END IF;
  SELECT
    COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')),
    COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND d.deadline<now()),
    COUNT(*) FILTER (WHERE t.status='blocked')
  INTO v_open, v_overdue, v_blocked
  FROM public.tasks t LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id;
  SELECT
    COUNT(*) FILTER (WHERE t.completed_at>now()-interval '30 days'),
    COUNT(*) FILTER (WHERE t.completed_at>now()-interval '30 days' AND t.completed_at<=d.deadline)
  INTO v_completed_30d, v_ontime_30d
  FROM public.tasks t LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id;
  SELECT COUNT(*) FILTER (WHERE requires_photo=true AND completed_at>now()-interval '30 days'),
    COUNT(DISTINCT tp.task_id) FILTER (WHERE tp.id IS NOT NULL)
  INTO v_photo_req, v_photo_have
  FROM public.tasks t LEFT JOIN public.task_photos tp ON tp.task_id=t.id
  WHERE t.requires_photo=true AND t.completed_at>now()-interval '30 days';
  SELECT COUNT(*) FILTER (WHERE status='completed' AND completed_at>now()-interval '7 days'),
    COUNT(*) FILTER (WHERE status IN ('verified','processed') AND completed_at>now()-interval '7 days')
  INTO v_verify_completed, v_verify_processed FROM public.tasks;
  SELECT COALESCE(SUM(score*task_count)::numeric/NULLIF(SUM(task_count),0)/100.0, 0.7)
  INTO v_vendor_avg FROM public.mv_vendor_performance_30d WHERE task_count>=10;
  v_components := jsonb_build_object(
    'open_count',v_open,'overdue_count',v_overdue,'blocked_count',v_blocked,
    'overdue_ratio',ROUND((v_overdue::numeric/NULLIF(v_open,0))::numeric,3),
    'blocked_ratio',ROUND((v_blocked::numeric/NULLIF(v_open,0))::numeric,3),
    'completed_30d',v_completed_30d,'on_time_30d',v_ontime_30d,
    'on_time_rate',ROUND((v_ontime_30d::numeric/NULLIF(v_completed_30d,0))::numeric,3),
    'photo_rate',ROUND((v_photo_have::numeric/NULLIF(v_photo_req,0))::numeric,3),
    'verify_health',ROUND((v_verify_processed::numeric/NULLIF(v_verify_completed+v_verify_processed,0))::numeric,3),
    'vendor_avg',ROUND(v_vendor_avg,3));
  v_score := ROUND(100 * (
    0.20*(1-COALESCE(v_overdue::numeric/NULLIF(v_open,0),0))
    + 0.10*(1-COALESCE(v_blocked::numeric/NULLIF(v_open,0),0))
    + 0.25*COALESCE(v_ontime_30d::numeric/NULLIF(v_completed_30d,0),0)
    + 0.10*COALESCE(v_verify_processed::numeric/NULLIF(v_verify_completed+v_verify_processed,0),0)
    + 0.15*COALESCE(v_photo_have::numeric/NULLIF(v_photo_req,0),0)
    + 0.20*v_vendor_avg))::int;
  v_band := CASE WHEN v_score>=85 THEN 'healthy' WHEN v_score>=70 THEN 'watch' ELSE 'at_risk' END;
  RETURN jsonb_build_object('score',v_score,'band',v_band,'computed_at',now(),'components',v_components);
END $$;

-- Tighten SECDEF exposure: sla_deadline + sla_target_hours are internal only
REVOKE EXECUTE ON FUNCTION public.sla_deadline(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sla_target_hours(public.task_category, text, public.task_priority) FROM PUBLIC, anon, authenticated;
