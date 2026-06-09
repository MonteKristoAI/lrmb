-- L10 wave 16 (2026-06-10): drop the 7 indexes created in wave 12 that
-- duplicate pre-existing indexes (Supabase advisor 0009_duplicate_index).
-- The wave 12 ones are newer; keep the originals.

DROP INDEX IF EXISTS public.tasks_status_idx;
DROP INDEX IF EXISTS public.tasks_property_id_idx;
DROP INDEX IF EXISTS public.tasks_assigned_to_idx;
DROP INDEX IF EXISTS public.tasks_reservation_id_idx;
DROP INDEX IF EXISTS public.task_updates_task_id_idx;
DROP INDEX IF EXISTS public.task_photos_task_id_idx;
DROP INDEX IF EXISTS public.audit_logs_entity_idx;

-- Kept wave 12 additions (no duplicates):
--   tasks_due_at_open_idx, tasks_external_source_id_idx, tasks_vendor_id_idx,
--   notification_events_recipient_idx, audit_logs_created_at_idx
