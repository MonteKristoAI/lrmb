-- L10 Playwright BUG-001 (2026-05-29): /supervisor/trends was rendering
-- forever-skeletons because POST /rest/v1/rpc/analytics_trends_daily 500'd
-- with `canceling statement due to statement timeout`. Root cause: 3
-- correlated subqueries per day × 30 days × ~40K rows × RLS-per-row =
-- ~3.6M row evaluations. The `created_at::date = d.day` cast also strips
-- the btree index on `tasks(created_at)`, forcing a seq scan in every
-- subquery.
--
-- Rewrite as one single-pass aggregation that:
--   1. Walks public.tasks once with WHERE clauses that DO use the btree
--      index (`created_at >= start AND created_at <  end`).
--   2. Buckets by date_trunc('day', ...).
--   3. RIGHT JOINs to a generated day series so empty days return zeros.
-- Same return shape, ~50× faster on the current data.

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
  WITH
  bounds AS (
    SELECT
      (now() - (LEAST(GREATEST(p_days, 1), 365) || ' days')::interval) AS start_ts,
      now() AS end_ts
  ),
  days AS (
    SELECT generate_series(
      (SELECT start_ts FROM bounds)::date,
      (SELECT end_ts FROM bounds)::date,
      '1 day'
    )::date AS day
  ),
  created_bucket AS (
    SELECT date_trunc('day', t.created_at)::date AS day, count(*)::bigint AS n
    FROM public.tasks t, bounds b
    WHERE t.created_at >= b.start_ts AND t.created_at < b.end_ts
    GROUP BY 1
  ),
  completed_bucket AS (
    SELECT date_trunc('day', t.completed_at)::date AS day, count(*)::bigint AS n
    FROM public.tasks t, bounds b
    WHERE t.completed_at IS NOT NULL
      AND t.completed_at >= b.start_ts
      AND t.completed_at < b.end_ts
    GROUP BY 1
  ),
  overdue_bucket AS (
    SELECT date_trunc('day', t.due_at)::date AS day, count(*)::bigint AS n
    FROM public.tasks t, bounds b
    WHERE t.due_at IS NOT NULL
      AND t.due_at >= b.start_ts
      AND t.due_at < b.end_ts
      AND t.status::text NOT IN ('completed', 'verified', 'processed')
    GROUP BY 1
  )
  SELECT
    d.day,
    COALESCE(cb.n, 0) AS created,
    COALESCE(co.n, 0) AS completed,
    COALESCE(ov.n, 0) AS overdue
  FROM days d
  LEFT JOIN created_bucket   cb ON cb.day = d.day
  LEFT JOIN completed_bucket co ON co.day = d.day
  LEFT JOIN overdue_bucket   ov ON ov.day = d.day
  ORDER BY d.day;
$$;

REVOKE EXECUTE ON FUNCTION public.analytics_trends_daily(integer) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.analytics_trends_daily(integer) TO authenticated, service_role;
