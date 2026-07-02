-- Final advisor sweep: revoke anon+authenticated exec on trigger-only SECDEF
-- fns (tasks_recompute_score_on_change, upsert_track_reservations_latest_from_event),
-- set search_path on sla_targets_bump_version, add push_config deny policy.
REVOKE EXECUTE ON FUNCTION public.tasks_recompute_score_on_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upsert_track_reservations_latest_from_event() FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.sla_targets_bump_version() SET search_path = public;
CREATE POLICY push_config_deny_authenticated ON public.push_config
  FOR SELECT TO authenticated USING (false);
