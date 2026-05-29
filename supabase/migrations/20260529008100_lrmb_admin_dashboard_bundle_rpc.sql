-- QA Agent C P1-04 (2026-05-29): consolidate AdminDashboard's 9 parallel
-- queries into one RPC round-trip. Mirrors the JSONB shape the frontend
-- projects into StatCards.

CREATE OR REPLACE FUNCTION public.admin_dashboard_bundle()
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_caller uuid := auth.uid();
BEGIN
  IF NOT public.has_admin_access(v_caller) THEN
    RAISE EXCEPTION 'admin_dashboard_bundle requires admin/supervisor/manager'
      USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'kpis', (SELECT row_to_json(mv) FROM public.mv_ops_dashboard_kpis mv LIMIT 1),
    'open_count', (SELECT count(*) FROM public.tasks
      WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')),
    'overdue_count', (SELECT count(*) FROM public.tasks
      WHERE due_at < now()
        AND status NOT IN ('completed','verified','processed')),
    'blocked_count', (SELECT count(*) FROM public.tasks WHERE status = 'blocked'),
    'due_today_count', (
      SELECT count(*) FROM public.tasks
      WHERE due_at >= date_trunc('day', now())
        AND due_at < date_trunc('day', now()) + interval '1 day'
        AND status NOT IN ('completed','verified','processed')
    ),
    'active_staff_count', (
      SELECT count(DISTINCT assigned_to) FROM public.tasks
      WHERE assigned_to IS NOT NULL
        AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts')
    ),
    'avg_cycle_hours', public.avg_cycle_time_hours(),
    'admin_touches_avg', public.avg_admin_touches_per_task(),
    'computed_at', now()
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.admin_dashboard_bundle() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_dashboard_bundle() TO authenticated, service_role;
