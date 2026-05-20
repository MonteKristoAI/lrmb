-- REVOKE EXECUTE FROM PUBLIC on SECURITY DEFINER trigger functions
-- (callers are triggers, not REST users) + restore narrower grants for
-- functions actually used by authenticated UI.

-- Trigger functions: revoke entirely
REVOKE EXECUTE ON FUNCTION public.auto_process_inspection() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_billing_requirements() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_housekeeping_task_from_reservation_event() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_form_submission() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.notify_on_task_change() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.send_push_on_notification() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_claim_deadline() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.block_public_signup() FROM PUBLIC;

-- Cron-only escalation functions
REVOKE EXECUTE ON FUNCTION public.escalate_overdue_tasks() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.escalate_unaccepted_tasks() FROM PUBLIC;

-- RBAC + utility: revoke from PUBLIC, grant back to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_admin_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_admin_access(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.find_similar_tasks(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.find_similar_tasks(uuid, uuid, text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.avg_admin_touches_per_task() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.avg_admin_touches_per_task() TO authenticated;

-- Set SECURITY INVOKER on the 2 new views so they enforce caller RLS
ALTER VIEW public.v_track_poll_latest SET (security_invoker = on);
ALTER VIEW public.v_track_attachment_queue SET (security_invoker = on);
