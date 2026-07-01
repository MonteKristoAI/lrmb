-- v3.0 Wave 1: composite RPC for the Supervisor Today's Brief page.
-- Returns a single JSON payload with today's arrivals, departures, turnovers,
-- urgent WOs, verification queue teaser, vendor delays, and avg completion time.
-- Verification queue filtered to last 7 days so it does not surface 19k
-- historical completed rows.
--
-- Applied via MCP apply_migration on 2026-07-01 18:28 UTC (version 20260701182821).
-- File committed to repo for DR parity.

CREATE OR REPLACE FUNCTION public.supervisor_brief_bundle()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_today date := CURRENT_DATE;
BEGIN
  IF NOT (
    public.has_admin_access(v_caller)
    OR public.has_role(v_caller, 'supervisor')
    OR public.has_role(v_caller, 'manager')
  ) THEN
    RAISE EXCEPTION 'supervisor_brief_bundle requires supervisor/manager/admin'
      USING ERRCODE = '42501';
  END IF;

  RETURN jsonb_build_object(
    'date', v_today,
    'arrivals_today_count', (
      SELECT COUNT(*) FROM mv_track_reservations_latest WHERE arrival_date = v_today
    ),
    'arrivals_today', (
      SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (
        SELECT external_id, unit_id, unit_code, unit_short_name, arrival_time,
          guest_name, is_vip, adr, nights
        FROM mv_track_reservations_latest
        WHERE arrival_date = v_today
        ORDER BY arrival_time NULLS LAST, external_id
        LIMIT 10
      ) r
    ),
    'departures_today_count', (
      SELECT COUNT(*) FROM mv_track_reservations_latest WHERE departure_date = v_today
    ),
    'departures_today', (
      SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (
        SELECT external_id, unit_id, unit_code, unit_short_name, departure_time,
          guest_name, is_vip
        FROM mv_track_reservations_latest
        WHERE departure_date = v_today
        ORDER BY departure_time NULLS LAST, external_id
        LIMIT 10
      ) r
    ),
    'turnovers_today_count', (
      SELECT COUNT(DISTINCT unit_id) FROM mv_track_reservations_latest r1
      WHERE r1.departure_date = v_today
        AND EXISTS (
          SELECT 1 FROM mv_track_reservations_latest r2
          WHERE r2.arrival_date = v_today AND r2.unit_id = r1.unit_id
            AND r2.external_id <> r1.external_id
        )
    ),
    'urgent_wo_count', (
      SELECT COUNT(*) FROM tasks
      WHERE priority = 'urgent'
        AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
    ),
    'urgent_wo', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
        SELECT id, title, status, task_category, task_type, unit_id, property_id,
          due_at, created_at
        FROM tasks
        WHERE priority = 'urgent'
          AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        ORDER BY created_at DESC
        LIMIT 5
      ) t
    ),
    'verification_queue_count', (
      SELECT COUNT(*) FROM tasks
      WHERE status = 'completed'
        AND completed_at >= now() - INTERVAL '7 days'
    ),
    'verification_queue_top5', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
        SELECT id, title, task_category, task_type, unit_id, property_id,
          completed_at, assigned_to
        FROM tasks
        WHERE status = 'completed'
          AND completed_at >= now() - INTERVAL '7 days'
        ORDER BY completed_at ASC
        LIMIT 5
      ) t
    ),
    'vendor_delays', (
      SELECT COALESCE(jsonb_agg(row_to_json(v)), '[]'::jsonb) FROM (
        SELECT
          v.id AS vendor_id,
          v.name AS vendor_name,
          COUNT(*) FILTER (WHERE t.status = 'vendor_not_started') AS pending_count,
          COUNT(*) FILTER (
            WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
              AND public.sla_deadline(t.id) < now()
          ) AS sla_missed_count
        FROM vendors v
        JOIN tasks t ON t.vendor_id = v.id
        WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        GROUP BY v.id, v.name
        HAVING
          COUNT(*) FILTER (WHERE t.status = 'vendor_not_started') >= 3
          OR COUNT(*) FILTER (
            WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
              AND public.sla_deadline(t.id) < now()
          ) >= 1
        ORDER BY sla_missed_count DESC, pending_count DESC
        LIMIT 10
      ) v
    ),
    'avg_completion_hours_today', (
      SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - COALESCE(started_at, created_at))) / 3600.0)::numeric, 1), 0)
      FROM tasks
      WHERE completed_at::date = v_today
    ),
    'avg_completion_hours_30d', (
      SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - COALESCE(started_at, created_at))) / 3600.0)::numeric, 1), 0)
      FROM tasks
      WHERE completed_at >= now() - INTERVAL '30 days'
    ),
    'computed_at', now()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.supervisor_brief_bundle TO authenticated;
