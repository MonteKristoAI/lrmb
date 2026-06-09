-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Cover all foreign keys without an explicit supporting index. Improves
-- DELETE/UPDATE on the parent and JOIN performance. Pure additive change.
-- Source: Supabase performance advisor 2026-05-05.

CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx                    ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS inspection_responses_template_item_id_idx  ON public.inspection_responses (template_item_id);
CREATE INDEX IF NOT EXISTS inspections_template_id_idx                ON public.inspections (template_id);
CREATE INDEX IF NOT EXISTS inspections_unit_id_idx                    ON public.inspections (unit_id);
CREATE INDEX IF NOT EXISTS notification_events_task_id_idx            ON public.notification_events (task_id);
CREATE INDEX IF NOT EXISTS reservation_events_property_id_idx         ON public.reservation_events (property_id);
CREATE INDEX IF NOT EXISTS reservation_events_unit_id_idx             ON public.reservation_events (unit_id);
CREATE INDEX IF NOT EXISTS task_photos_uploaded_by_idx                ON public.task_photos (uploaded_by);
CREATE INDEX IF NOT EXISTS task_updates_actor_id_idx                  ON public.task_updates (actor_id);
CREATE INDEX IF NOT EXISTS tasks_created_by_idx                       ON public.tasks (created_by);
CREATE INDEX IF NOT EXISTS tasks_processed_by_idx                     ON public.tasks (processed_by);
CREATE INDEX IF NOT EXISTS tasks_unit_id_idx                          ON public.tasks (unit_id);
