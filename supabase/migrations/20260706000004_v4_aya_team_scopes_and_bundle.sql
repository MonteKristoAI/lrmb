-- Team-level Aya (Nemr: "when Jennifer logs in, the system should tell her
-- exactly where attention is needed"). Adds housekeeping/maintenance scopes,
-- generalizes the read RPC to any non-property scope, and a service-role team
-- signal bundle with grounded counts + the top open tasks (with /tasks links).

ALTER TABLE public.aya_insights DROP CONSTRAINT IF EXISTS aya_insights_scope_check;
ALTER TABLE public.aya_insights ADD CONSTRAINT aya_insights_scope_check
  CHECK (scope IN ('platform','property','housekeeping','maintenance'));

CREATE OR REPLACE FUNCTION public.aya_latest_insight(
  p_scope text, p_property_id uuid DEFAULT NULL, p_locale text DEFAULT 'en'
)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_caller uuid := auth.uid(); v_row public.aya_insights;
BEGIN
  IF NOT (public.has_admin_access(v_caller) OR public.has_role(v_caller,'supervisor') OR public.has_role(v_caller,'manager')) THEN
    RAISE EXCEPTION 'aya_latest_insight requires supervisor/manager/admin' USING ERRCODE='42501';
  END IF;
  SELECT * INTO v_row FROM public.aya_insights
  WHERE scope = p_scope
    AND property_id IS NOT DISTINCT FROM p_property_id
    AND locale IN (p_locale, 'en')
  ORDER BY (locale = p_locale) DESC, generated_for DESC, generated_at DESC
  LIMIT 1;
  IF v_row.id IS NULL THEN RETURN NULL; END IF;
  RETURN jsonb_build_object('scope',v_row.scope,'property_id',v_row.property_id,'generated_for',v_row.generated_for,
    'locale',v_row.locale,'headline',v_row.headline,'narrative',v_row.narrative,'bullets',v_row.bullets,
    'model',v_row.model,'generated_at',v_row.generated_at);
END $function$;
GRANT EXECUTE ON FUNCTION public.aya_latest_insight(text, uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.aya_team_bundle(p_category task_category)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  RETURN jsonb_build_object(
    'category', p_category,
    'open_total', (SELECT COUNT(*) FROM public.tasks WHERE task_category=p_category AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')),
    'not_started', (SELECT COUNT(*) FROM public.tasks WHERE task_category=p_category AND status IN ('new','assigned','vendor_not_started')),
    'in_progress', (SELECT COUNT(*) FROM public.tasks WHERE task_category=p_category AND status IN ('in_progress','waiting_parts')),
    'blocked', (SELECT COUNT(*) FROM public.tasks WHERE task_category=p_category AND status='blocked'),
    'completed_today', (SELECT COUNT(*) FROM public.tasks WHERE task_category=p_category AND status IN ('completed','verified','processed') AND completed_at>=CURRENT_DATE::timestamptz),
    'overdue_past_sla', (SELECT COUNT(*) FROM public.tasks t LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id
        WHERE t.task_category=p_category AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND d.deadline < now()),
    'turnovers_today', CASE WHEN p_category='housekeeping'::task_category THEN (
        SELECT COUNT(DISTINCT u.id) FROM public.mv_track_reservations_latest r JOIN public.units u ON u.track_id=r.unit_id::bigint
        WHERE r.arrival_date=CURRENT_DATE AND EXISTS (SELECT 1 FROM public.mv_track_reservations_latest prev WHERE prev.unit_id=r.unit_id AND prev.departure_date BETWEEN CURRENT_DATE-INTERVAL '7 days' AND CURRENT_DATE AND prev.external_id<>r.external_id)) ELSE NULL END,
    'top_urgent', (SELECT COALESCE(jsonb_agg(row_to_json(x) ORDER BY score DESC NULLS LAST),'[]'::jsonb) FROM (
        SELECT t.id, ('/tasks/'||t.id) AS entity_link, t.title, t.status, t.priority, t.housekeeping_type,
               t.scheduled_for, u.unit_code, u.short_name AS unit_short, p.name AS property_name,
               COALESCE(s.score,0) AS score,
               (SELECT d.deadline < now() FROM public.task_sla_deadlines d WHERE d.task_id=t.id) AS past_sla
        FROM public.tasks t
        LEFT JOIN public.task_priority_scores s ON s.task_id=t.id
        LEFT JOIN public.units u ON u.id=t.unit_id
        LEFT JOIN public.properties p ON p.id=t.property_id
        WHERE t.task_category=p_category AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        ORDER BY COALESCE(s.score,0) DESC LIMIT 10) x),
    'computed_at', now()
  );
END $function$;
REVOKE ALL ON FUNCTION public.aya_team_bundle(task_category) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.aya_team_bundle(task_category) TO service_role;
