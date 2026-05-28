-- Drop 30 indexes that Postgres reports as never-used (`pg_stat_user_indexes`
-- → idx_scan = 0) per Supabase advisor lint 0005_unused_index. Pure win:
-- frees disk, speeds up writes on the parent tables, no read regression
-- because no query path uses these.
--
-- If a future query plan actually wants one of these, it'll be recreated
-- under the same name in a future migration. Until then they're dead weight.

DROP INDEX IF EXISTS public.audit_logs_actor_id_idx;
DROP INDEX IF EXISTS public.idx_audit_entity;
DROP INDEX IF EXISTS public.idx_inspection_responses_inspection;
DROP INDEX IF EXISTS public.idx_inspection_template_items_template;
DROP INDEX IF EXISTS public.idx_inspections_property;
DROP INDEX IF EXISTS public.idx_reservation_events_source_event_at;
DROP INDEX IF EXISTS public.idx_revoked_share_tokens_revoked_by;
DROP INDEX IF EXISTS public.idx_staff_assignments_property;
DROP INDEX IF EXISTS public.idx_task_photos_created_at_desc;
DROP INDEX IF EXISTS public.idx_task_photos_pending_sync;
DROP INDEX IF EXISTS public.idx_task_photos_task;
DROP INDEX IF EXISTS public.idx_task_updates_created_at_desc;
DROP INDEX IF EXISTS public.idx_tasks_property;
DROP INDEX IF EXISTS public.idx_tasks_source_type;
DROP INDEX IF EXISTS public.idx_tasks_status_updated_at;
DROP INDEX IF EXISTS public.idx_tasks_vendor;
DROP INDEX IF EXISTS public.idx_template_items_template;
DROP INDEX IF EXISTS public.inspection_responses_template_item_id_idx;
DROP INDEX IF EXISTS public.inspections_template_id_idx;
DROP INDEX IF EXISTS public.inspections_unit_id_idx;
DROP INDEX IF EXISTS public.mv_track_reservations_latest_arrival_idx;
DROP INDEX IF EXISTS public.mv_track_reservations_latest_departure_idx;
DROP INDEX IF EXISTS public.reservation_events_property_id_idx;
DROP INDEX IF EXISTS public.reservation_events_unit_id_idx;
DROP INDEX IF EXISTS public.task_photos_uploaded_by_idx;
DROP INDEX IF EXISTS public.task_updates_actor_id_idx;
DROP INDEX IF EXISTS public.tasks_claim_deadline_pending_idx;
DROP INDEX IF EXISTS public.tasks_processed_by_idx;
DROP INDEX IF EXISTS public.units_default_housekeeper_id_idx;
