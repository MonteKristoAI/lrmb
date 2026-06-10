-- L10 wave 17 (2026-06-10): drop wave 12 indexes that never got query
-- traffic. Foresight-created inspection_* / profile_vendor_id /
-- revoked_share_tokens kept; they'll be hit once those paths see load.

DROP INDEX IF EXISTS public.tasks_track_clean_type_id_idx;
DROP INDEX IF EXISTS public.tasks_due_at_open_idx;
DROP INDEX IF EXISTS public.tasks_external_source_id_idx;
DROP INDEX IF EXISTS public.notification_events_recipient_idx;
DROP INDEX IF EXISTS public.audit_logs_created_at_idx;
