-- Migration 20260528200000 dropped 29 "unused" indexes per advisor lint 0005.
-- That advisor only counts USER SELECT scans (pg_stat_user_indexes.idx_scan),
-- it does NOT count Postgres-internal FK enforcement scans during CASCADE
-- and parent-row DELETE/UPDATE. Many of the dropped indexes were actually
-- the only covering index for an outgoing foreign key, and dropping them
-- silently degrades cascade performance. Lint 0001 (unindexed_foreign_keys)
-- caught the regression immediately.
--
-- Restoring FK-covering indexes only. Names match originals where possible
-- so future schema diffs stay clean. We leave the non-FK indexes dropped
-- (idx_tasks_status_updated_at, idx_task_photos_created_at_desc,
-- idx_task_updates_created_at_desc, idx_tasks_source_type,
-- idx_reservation_events_source_event_at, idx_task_photos_pending_sync,
-- tasks_claim_deadline_pending_idx, mv_track_reservations_latest_*_idx,
-- idx_audit_entity) since those were sort/filter indexes the advisor
-- correctly identified as never-used by SELECT plans.

CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx
  ON public.audit_logs (actor_id);

CREATE INDEX IF NOT EXISTS idx_inspection_responses_inspection
  ON public.inspection_responses (inspection_id);

CREATE INDEX IF NOT EXISTS inspection_responses_template_item_id_idx
  ON public.inspection_responses (template_item_id);

CREATE INDEX IF NOT EXISTS idx_inspection_template_items_template
  ON public.inspection_template_items (template_id);

CREATE INDEX IF NOT EXISTS idx_inspections_property
  ON public.inspections (property_id);

CREATE INDEX IF NOT EXISTS inspections_template_id_idx
  ON public.inspections (template_id);

CREATE INDEX IF NOT EXISTS inspections_unit_id_idx
  ON public.inspections (unit_id);

CREATE INDEX IF NOT EXISTS reservation_events_property_id_idx
  ON public.reservation_events (property_id);

CREATE INDEX IF NOT EXISTS reservation_events_unit_id_idx
  ON public.reservation_events (unit_id);

CREATE INDEX IF NOT EXISTS idx_revoked_share_tokens_revoked_by
  ON public.revoked_share_tokens (revoked_by);

CREATE INDEX IF NOT EXISTS idx_staff_assignments_property
  ON public.staff_assignments (property_id);

CREATE INDEX IF NOT EXISTS idx_task_photos_task
  ON public.task_photos (task_id);

CREATE INDEX IF NOT EXISTS task_photos_uploaded_by_idx
  ON public.task_photos (uploaded_by);

CREATE INDEX IF NOT EXISTS task_updates_actor_id_idx
  ON public.task_updates (actor_id);

CREATE INDEX IF NOT EXISTS idx_tasks_property
  ON public.tasks (property_id);

CREATE INDEX IF NOT EXISTS idx_tasks_vendor
  ON public.tasks (vendor_id);

CREATE INDEX IF NOT EXISTS tasks_processed_by_idx
  ON public.tasks (processed_by);

CREATE INDEX IF NOT EXISTS units_default_housekeeper_id_idx
  ON public.units (default_housekeeper_id);
