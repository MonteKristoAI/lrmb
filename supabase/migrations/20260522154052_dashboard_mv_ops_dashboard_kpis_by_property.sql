-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Per-property KPI breakdown materialized view.
-- Each row = one property + its current and historical task counts.
-- Refresh: every 2 minutes (CONCURRENTLY, requires unique index on property_name).

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_ops_dashboard_kpis_by_property AS
SELECT
  p.name AS property_name,
  -- Now metrics
  COUNT(*) FILTER (WHERE t.task_category = 'housekeeping' AND t.status = 'in_progress') AS hk_in_progress,
  COUNT(*) FILTER (WHERE t.task_category = 'maintenance' AND t.status = 'in_progress') AS maint_in_progress,
  COUNT(*) FILTER (
    WHERE t.task_category = 'maintenance'
      AND t.status IN ('new','assigned','in_progress')
      AND t.due_at < NOW()
  ) AS maint_overdue,
  -- This week
  COUNT(*) FILTER (
    WHERE t.task_category = 'housekeeping' AND t.status = 'completed'
      AND t.completed_at >= NOW() - INTERVAL '7 days'
      AND t.completed_at <= NOW()
  ) AS hk_completed_this_week,
  COUNT(*) FILTER (
    WHERE t.task_category = 'housekeeping' AND t.status = 'completed'
      AND t.completed_at >= NOW() - INTERVAL '14 days'
      AND t.completed_at <  NOW() - INTERVAL '7 days'
  ) AS hk_completed_last_week,
  COUNT(*) FILTER (
    WHERE t.task_category = 'maintenance' AND t.status = 'completed'
      AND t.completed_at >= NOW() - INTERVAL '7 days'
      AND t.completed_at <= NOW()
  ) AS maint_completed_this_week,
  COUNT(*) FILTER (
    WHERE t.task_category = 'maintenance' AND t.status = 'completed'
      AND t.completed_at >= NOW() - INTERVAL '14 days'
      AND t.completed_at <  NOW() - INTERVAL '7 days'
  ) AS maint_completed_last_week,
  NOW() AS refreshed_at
FROM public.properties p
LEFT JOIN public.tasks t ON t.property_id = p.id
GROUP BY p.name;

CREATE UNIQUE INDEX IF NOT EXISTS mv_ops_dashboard_kpis_by_property_pkey
  ON public.mv_ops_dashboard_kpis_by_property (property_name);

COMMENT ON MATERIALIZED VIEW public.mv_ops_dashboard_kpis_by_property IS
  'Per-property KPI breakdown. Mirrors mv_ops_dashboard_kpis but keyed by property name. '
  'Refreshed every 2 minutes via pg_cron. Used by dashboard when a property filter is active.';

SELECT cron.schedule(
  'mv-ops-dashboard-kpis-by-property-refresh',
  '*/2 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_ops_dashboard_kpis_by_property;$$
);
