-- QA P1 Q-PERF-7..10: server-side aggregation RPCs so dashboard pages
-- don't ship 50K rows × ~200B = 10MB to the client just to filter in JS.

-- 1) One-shot KPI bundle for SupervisorDashboard + KPIOverview.
CREATE OR REPLACE FUNCTION public.analytics_dashboard_summary()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path TO public
AS $$
  WITH base AS (
    SELECT
      status,
      priority,
      task_category,
      due_at,
      completed_at,
      created_at,
      requires_photo
    FROM public.tasks
  )
  SELECT jsonb_build_object(
    'total', (SELECT count(*) FROM base),
    'byStatus', (
      SELECT jsonb_object_agg(status, c)
      FROM (SELECT status::text AS status, count(*) AS c FROM base GROUP BY status) s
    ),
    'byPriority', (
      SELECT jsonb_object_agg(priority, c)
      FROM (SELECT priority::text AS priority, count(*) AS c FROM base GROUP BY priority) p
    ),
    'byCategory', (
      SELECT jsonb_object_agg(task_category, c)
      FROM (SELECT task_category::text AS task_category, count(*) AS c FROM base GROUP BY task_category) cc
    ),
    'overdue', (
      SELECT count(*) FROM base
      WHERE due_at < now()
        AND status NOT IN ('completed', 'verified', 'processed')
    ),
    'pendingVerify', (SELECT count(*) FROM base WHERE status = 'completed'),
    'completedTotal', (SELECT count(*) FROM base WHERE status IN ('completed', 'verified', 'processed')),
    'avgCycleHours', (
      SELECT round(avg(extract(epoch from (completed_at - created_at)) / 3600)::numeric, 1)
      FROM base
      WHERE completed_at IS NOT NULL
        AND created_at IS NOT NULL
        AND completed_at >= created_at
    ),
    'photoComplianceTotal', (SELECT count(*) FROM base WHERE requires_photo),
    'photoComplianceDone', (
      SELECT count(*) FROM base
      WHERE requires_photo
        AND status IN ('completed', 'verified', 'processed')
    ),
    'computedAt', now()
  )
$$;
REVOKE EXECUTE ON FUNCTION public.analytics_dashboard_summary() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.analytics_dashboard_summary() TO authenticated;

-- 2) Daily trend buckets for TrendCharts.
CREATE OR REPLACE FUNCTION public.analytics_trends_daily(p_days integer DEFAULT 30)
RETURNS TABLE (
  day date,
  created bigint,
  completed bigint,
  overdue bigint
)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path TO public
AS $$
  WITH days AS (
    SELECT generate_series(
      (now() - (LEAST(GREATEST(p_days, 1), 365) || ' days')::interval)::date,
      now()::date,
      '1 day'
    )::date AS day
  )
  SELECT
    d.day,
    (SELECT count(*) FROM public.tasks t
       WHERE t.created_at::date = d.day) AS created,
    (SELECT count(*) FROM public.tasks t
       WHERE t.completed_at::date = d.day) AS completed,
    (SELECT count(*) FROM public.tasks t
       WHERE t.due_at::date = d.day
         AND t.status NOT IN ('completed', 'verified', 'processed')) AS overdue
  FROM days d
  ORDER BY d.day;
$$;
REVOKE EXECUTE ON FUNCTION public.analytics_trends_daily(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.analytics_trends_daily(integer) TO authenticated;

-- 3) Staff workload (assigned/active/done per profile).
CREATE OR REPLACE FUNCTION public.analytics_staff_workload()
RETURNS TABLE (
  profile_id uuid,
  full_name text,
  assigned bigint,
  active bigint,
  done bigint
)
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path TO public
AS $$
  SELECT
    p.id AS profile_id,
    p.full_name,
    count(t.id) AS assigned,
    count(t.id) FILTER (WHERE t.status NOT IN ('completed', 'verified', 'processed')) AS active,
    count(t.id) FILTER (WHERE t.status IN ('completed', 'verified', 'processed')) AS done
  FROM public.profiles p
  LEFT JOIN public.tasks t ON t.assigned_to = p.id
  WHERE p.active = true
  GROUP BY p.id, p.full_name
  ORDER BY active DESC, done DESC, p.full_name;
$$;
REVOKE EXECUTE ON FUNCTION public.analytics_staff_workload() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.analytics_staff_workload() TO authenticated;
