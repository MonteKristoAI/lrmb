-- Post-PR#4 hardening (applied 2026-05-20 09:00 UTC via Supabase MCP).
-- Two fixes uncovered during post-merge live audit:
--
-- FIX 1: Composite index for supervisor task list query
-- ----------------------------------------------------
-- With 11.7k tasks in active statuses, the existing single-column idx_tasks_status
-- forces a Bitmap Heap Scan + Sort that takes ~296ms for a top-50 by updated_at.
-- A composite (status, updated_at DESC) lets Postgres do an index-only top-N.
-- Measured: 296ms -> 10ms (29x faster).
--
-- FIX 2: Activity Feed view refactor
-- ----------------------------------------------------
-- v_operations_recent_activity was reading from task_updates which is only
-- populated by the AiiA mobile app (2 rows total). Polling + backfill don't
-- write there. Tony's dashboard showed an empty Activity Feed.
--
-- The existing trg_audit_tasks trigger writes status_change / priority_change /
-- create / assignment_change rows to audit_logs on every UPDATE/INSERT of tasks
-- (7,280 status_changes in last 24h post-backfill). Refactor view to read from
-- audit_logs instead, mapping fields to match the original schema so the
-- frontend OperationsOverview.tsx component needs no changes.

CREATE INDEX IF NOT EXISTS idx_tasks_status_updated_at
  ON public.tasks(status, updated_at DESC)
  WHERE status IN ('new','assigned','in_progress');

DROP VIEW IF EXISTS public.v_operations_recent_activity;
CREATE VIEW public.v_operations_recent_activity
WITH (security_invoker = on)
AS
SELECT
  a.id,
  a.created_at,
  a.entity_id AS task_id,
  t.title AS task_title,
  t.task_category,
  a.actor_id,
  COALESCE(a.actor_name, p.full_name, 'System') AS actor_name,
  a.action AS update_type,
  (a.payload_json->'old'->>'status')::text AS old_status,
  (a.payload_json->'new'->>'status')::text AS new_status,
  COALESCE(a.description, a.payload_json->>'note') AS note,
  (SELECT COUNT(*) FROM public.task_photos tp WHERE tp.task_id = a.entity_id) AS photo_count
FROM public.audit_logs a
LEFT JOIN public.tasks t ON t.id = a.entity_id
LEFT JOIN public.profiles p ON p.id = a.actor_id
WHERE a.entity_type = 'tasks'
  AND a.action IN ('status_change','priority_change','create','assignment_change')
  AND a.created_at > NOW() - INTERVAL '24 hours'
ORDER BY a.created_at DESC
LIMIT 50;

GRANT SELECT ON public.v_operations_recent_activity TO service_role;
GRANT SELECT ON public.v_operations_recent_activity TO authenticated;
COMMENT ON VIEW public.v_operations_recent_activity IS
'Recent task activity feed for Tony Operations Overview dashboard. Reads from audit_logs (populated by trg_audit_tasks trigger) since task_updates is mobile-app-only and not populated by polling/backfill.';
