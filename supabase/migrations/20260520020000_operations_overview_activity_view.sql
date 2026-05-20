-- Recent activity + photo gallery views for the OperationsOverview page

CREATE OR REPLACE VIEW public.v_operations_recent_activity AS
SELECT
  tu.id, tu.created_at, tu.task_id,
  t.title AS task_title, t.task_category,
  tu.actor_id, p.full_name AS actor_name,
  tu.update_type, tu.old_status, tu.new_status, tu.note,
  (SELECT count(*) FROM public.task_photos tp WHERE tp.task_id = tu.task_id) AS photo_count
FROM public.task_updates tu
JOIN public.tasks t ON t.id = tu.task_id
LEFT JOIN public.profiles p ON p.id = tu.actor_id
WHERE tu.created_at > now() - INTERVAL '24 hours'
ORDER BY tu.created_at DESC LIMIT 50;
ALTER VIEW public.v_operations_recent_activity SET (security_invoker = on);
GRANT SELECT ON public.v_operations_recent_activity TO authenticated, service_role;

CREATE OR REPLACE VIEW public.v_operations_recent_photos AS
SELECT
  tp.id AS photo_id, tp.created_at AS uploaded_at, tp.task_id,
  tp.storage_path, tp.photo_subtype, tp.caption,
  t.title AS task_title, t.task_category, t.status AS task_status,
  p.full_name AS uploaded_by_name
FROM public.task_photos tp
JOIN public.tasks t ON t.id = tp.task_id
LEFT JOIN public.profiles p ON p.id = tp.uploaded_by
ORDER BY tp.created_at DESC LIMIT 8;
ALTER VIEW public.v_operations_recent_photos SET (security_invoker = on);
GRANT SELECT ON public.v_operations_recent_photos TO authenticated, service_role;
