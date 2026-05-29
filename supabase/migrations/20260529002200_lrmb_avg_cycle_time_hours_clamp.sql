-- 709 of 1123 task rows in the 30-day window had completed_at <= created_at
-- because TRACK backsyncs work orders with the original timestamps but our
-- created_at is the sync time. The first avg_cycle_time_hours (mig 002100)
-- returned negative hours. Use t_start = COALESCE(started_at, created_at)
-- and exclude rows where completed_at <= t_start.

CREATE OR REPLACE FUNCTION public.avg_cycle_time_hours()
RETURNS NUMERIC LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT round(
    avg(EXTRACT(EPOCH FROM (completed_at - COALESCE(started_at, created_at))) / 3600.0)::numeric,
    2
  )
  FROM public.tasks
  WHERE completed_at IS NOT NULL
    AND completed_at > COALESCE(started_at, created_at)
    AND completed_at > now() - interval '30 days';
$$;
