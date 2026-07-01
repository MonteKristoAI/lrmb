-- v3.0 L10 sweep fixes (2026-07-01 late-evening).
-- Adversarial audit surfaced 33 findings across 12 dimensions. Applying the top
-- confirmed defects here. See daily/2026-07-01.md for the full write-up.
--
-- P0: smart_queue_score/reason joined tasks.unit_id (UUID) to
--     mv_track_reservations_latest.unit_id (BIGINT cast to text). Result:
--     proximity, revenue, VIP boost signals ALWAYS 0 for every task. Distribution
--     was frozen at 4 buckets (400/325/220/45). After fix: 800 max, real spread.
--     Root cause: mv_track_reservations_latest.unit_id sources track's own
--     integer unit_id (units.track_id), not our internal units.id UUID.
--     Fix: route through public.units on (track_id, id) like the exception feed
--     already does.
--
-- P1: smart_queue_open used INNER JOIN task_priority_scores so a task created
--     between the 2-min refresh cycles was invisible on the admin queue.
--     Fix: LEFT JOIN + COALESCE + composite tie-break so new tasks land at
--     bottom of their priority band instead of disappearing.
--
-- P1: refresh_task_priority_scores had no advisory lock. Two overlapping calls
--     (cron retry + manual trigger) could interleave INSERT/DELETE.
--     Fix: pg_try_advisory_xact_lock, return -1 if another run is holding it.
--
-- P1: ops_health_snapshots had no uniqueness on (property_id, captured_at).
--     Cron retry could insert duplicate rows and skew the health-dropped
--     lookback.
--     Fix: unique index on (property_id, captured_at).
--
-- P1: smart_queue_score SLA burn saturated at 100 so 6h-past-SLA tasks tied
--     with 300d-past-SLA. With the observed reality of huge score-ties,
--     tie-break was ORDER BY created_at which favored the wrong tasks.
--     Fix: widen burn cap to 200 so worse-overdue always outranks less-overdue.

CREATE OR REPLACE FUNCTION public.smart_queue_score(p_task_id uuid)
RETURNS integer LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_priority public.task_priority; v_unit_uuid uuid;
  v_arrival_date date; v_arrival_hours numeric;
  v_adr numeric; v_is_vip boolean; v_sla_burn numeric;
  v_urgency int; v_proximity int; v_revenue int; v_vip_boost int; v_burn int;
  v_created_at timestamptz; v_sla_hours int;
BEGIN
  SELECT priority, unit_id, created_at, COALESCE(sla_target_hours(task_category, task_type, priority), 72)
  INTO v_priority, v_unit_uuid, v_created_at, v_sla_hours
  FROM public.tasks WHERE id = p_task_id;
  IF v_priority IS NULL THEN RETURN 0; END IF;

  SELECT r.arrival_date, r.adr, r.is_vip INTO v_arrival_date, v_adr, v_is_vip
  FROM public.units u
  JOIN public.mv_track_reservations_latest r
    ON (u.track_id IS NOT NULL AND r.unit_id::bigint = u.track_id) OR r.unit_id::text = u.id::text
  WHERE u.id = v_unit_uuid AND r.arrival_date >= CURRENT_DATE
  ORDER BY r.arrival_date ASC LIMIT 1;

  v_urgency := CASE v_priority WHEN 'urgent' THEN 100 WHEN 'high' THEN 75 WHEN 'medium' THEN 40 ELSE 15 END;
  IF v_arrival_date IS NOT NULL THEN
    v_arrival_hours := EXTRACT(EPOCH FROM (v_arrival_date::timestamptz - now())) / 3600.0;
    v_proximity := GREATEST(0, LEAST(100, (100 - v_arrival_hours * 4.16)::int));
    v_revenue := LEAST(100, ((COALESCE(v_adr, 0) / 500.0) * v_proximity / 100.0 * 100)::int);
    v_vip_boost := CASE WHEN COALESCE(v_is_vip, false) THEN 100 ELSE 0 END;
  ELSE
    v_proximity := 0; v_revenue := 0; v_vip_boost := 0;
  END IF;
  v_sla_burn := EXTRACT(EPOCH FROM (now() - v_created_at)) / (v_sla_hours * 3600.0);
  v_burn := GREATEST(0, LEAST(200, (v_sla_burn * 100)::int));
  RETURN v_urgency * 3 + v_proximity * 2 + v_revenue + v_vip_boost + v_burn;
END $$;

CREATE OR REPLACE FUNCTION public.smart_queue_reason(p_task_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_priority public.task_priority; v_unit_uuid uuid;
  v_arrival_date date; v_arrival_hours numeric; v_is_vip boolean;
  v_created_at timestamptz; v_sla_hours int; v_burn_pct int;
  v_parts text[] := ARRAY[]::text[];
BEGIN
  SELECT priority, unit_id, created_at, COALESCE(sla_target_hours(task_category, task_type, priority), 72)
  INTO v_priority, v_unit_uuid, v_created_at, v_sla_hours
  FROM public.tasks WHERE id = p_task_id;
  IF v_priority IS NULL THEN RETURN ''; END IF;

  SELECT r.arrival_date, r.is_vip INTO v_arrival_date, v_is_vip
  FROM public.units u
  JOIN public.mv_track_reservations_latest r
    ON (u.track_id IS NOT NULL AND r.unit_id::bigint = u.track_id) OR r.unit_id::text = u.id::text
  WHERE u.id = v_unit_uuid AND r.arrival_date >= CURRENT_DATE
  ORDER BY r.arrival_date ASC LIMIT 1;

  IF v_priority = 'urgent' THEN v_parts := array_append(v_parts, 'Urgent priority');
  ELSIF v_priority = 'high' THEN v_parts := array_append(v_parts, 'High priority');
  END IF;
  IF v_arrival_date IS NOT NULL THEN
    v_arrival_hours := EXTRACT(EPOCH FROM (v_arrival_date::timestamptz - now())) / 3600.0;
    IF v_is_vip THEN v_parts := array_append(v_parts, 'VIP arrival'); END IF;
    IF v_arrival_hours <= 0 THEN v_parts := array_append(v_parts, 'guest arriving today');
    ELSIF v_arrival_hours <= 24 THEN v_parts := array_append(v_parts, 'arrival in ' || ROUND(v_arrival_hours) || 'h');
    ELSIF v_arrival_hours <= 48 THEN v_parts := array_append(v_parts, 'arrival in ' || ROUND(v_arrival_hours / 24) || 'd');
    END IF;
  END IF;
  v_burn_pct := (EXTRACT(EPOCH FROM (now() - v_created_at)) / (v_sla_hours * 3600.0) * 100)::int;
  IF v_burn_pct >= 100 THEN
    v_parts := array_append(v_parts, 'overdue ' || ROUND(EXTRACT(EPOCH FROM (now() - v_created_at)) / 3600.0 - v_sla_hours)::text || 'h');
  ELSIF v_burn_pct >= 80 THEN
    v_parts := array_append(v_parts, 'SLA burn ' || v_burn_pct || '%');
  END IF;
  RETURN COALESCE(array_to_string(v_parts, ' · '), '');
END $$;

CREATE OR REPLACE FUNCTION public.smart_queue_open(p_limit int DEFAULT 500)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'smart_queue_open requires admin/manager' USING ERRCODE = '42501';
  END IF;
  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
      SELECT t.id, t.title, t.status, t.priority, t.task_category, t.housekeeping_type,
        t.due_at, t.scheduled_for, t.started_at, t.completed_at, t.created_at, t.updated_at,
        t.external_id, t.unit_id, t.property_id, t.assigned_to, t.blocked_reason,
        COALESCE(s.score, 0) AS smart_queue_score, COALESCE(s.reason, '') AS smart_queue_reason,
        (SELECT row_to_json(p) FROM public.properties p WHERE p.id = t.property_id) AS properties,
        (SELECT row_to_json(u) FROM public.units u WHERE u.id = t.unit_id) AS units
      FROM public.tasks t
      LEFT JOIN public.task_priority_scores s ON s.task_id = t.id
      WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
      ORDER BY COALESCE(s.score, 0) DESC NULLS LAST,
        CASE t.priority WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC,
        t.due_at ASC NULLS LAST, t.created_at ASC
      LIMIT p_limit
    ) t
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.smart_queue_open(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.smart_queue_open(int) TO authenticated;

CREATE OR REPLACE FUNCTION public.refresh_task_priority_scores()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_updated integer;
BEGIN
  IF NOT pg_try_advisory_xact_lock(hashtext('refresh_task_priority_scores')) THEN
    RETURN -1;
  END IF;
  INSERT INTO public.task_priority_scores (task_id, score, reason, computed_at)
  SELECT id, public.smart_queue_score(id), public.smart_queue_reason(id), now()
  FROM public.tasks
  WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
  ON CONFLICT (task_id) DO UPDATE SET score = EXCLUDED.score, reason = EXCLUDED.reason, computed_at = EXCLUDED.computed_at;
  DELETE FROM public.task_priority_scores tps
  WHERE NOT EXISTS (
    SELECT 1 FROM public.tasks t WHERE t.id = tps.task_id
      AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
  );
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ops_health_snapshots_property_captured_uidx
  ON public.ops_health_snapshots (property_id, captured_at);
