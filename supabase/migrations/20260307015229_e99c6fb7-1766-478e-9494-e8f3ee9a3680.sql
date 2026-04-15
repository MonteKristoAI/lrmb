-- Function to get average admin touches per task
CREATE OR REPLACE FUNCTION public.avg_admin_touches_per_task()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    ROUND(
      COUNT(*)::numeric / NULLIF(COUNT(DISTINCT tu.task_id), 0),
      1
    ),
    0
  )
  FROM public.task_updates tu
  INNER JOIN public.user_roles ur ON ur.user_id = tu.actor_id
  WHERE ur.role IN ('admin', 'supervisor', 'manager')
$$;