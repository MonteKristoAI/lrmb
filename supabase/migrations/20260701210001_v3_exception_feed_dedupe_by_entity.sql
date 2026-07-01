-- v3 sweep fix (2026-07-01 evening): exception feed was per-task dedupe causing flood.
-- Root cause: dedupe_key included task_id so a unit with 400+ historical HK tasks produced 400+ P1 rows.
-- Additional bug: p1_unit_not_ready counted 'completed' status (field work done, awaits verify) as still-open blocker.
-- Result before: 7,374 rows (6,096 P1, 851 P2, 427 P3). Result after: 53 rows (33 P1, 9 P2, 11 P3), all real signal.
-- Aggregation is now per (unit + arrival_date), per (vendor), or per (property). Subtitle shows affected count.

DROP MATERIALIZED VIEW IF EXISTS public.mv_operational_exceptions CASCADE;

CREATE MATERIALIZED VIEW public.mv_operational_exceptions AS
WITH
p1_unit_not_ready_raw AS (
  SELECT
    r.unit_id, r.unit_code, r.guest_name, r.arrival_time, r.arrival_date,
    t.id AS task_id, t.title AS task_title, t.status AS task_status, t.updated_at
  FROM mv_track_reservations_latest r
  JOIN units u ON u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint
  JOIN tasks t ON t.unit_id = u.id
  WHERE r.arrival_date >= CURRENT_DATE
    AND r.arrival_date <= (CURRENT_DATE + INTERVAL '24 hours')
    AND t.task_category = 'housekeeping'::task_category
    -- Only unfinished tasks. 'completed' means work is done, awaiting verify (admin step, not blocker).
    AND t.status = ANY (ARRAY['new'::task_status, 'assigned'::task_status, 'in_progress'::task_status, 'vendor_not_started'::task_status, 'waiting_parts'::task_status, 'blocked'::task_status])
),
p1_unit_not_ready AS (
  SELECT DISTINCT ON (unit_id, arrival_date)
    'P1'::text AS severity,
    ('Unit ' || COALESCE(unit_code, 'ID ' || unit_id::text) || ' not guest ready')::text AS title,
    ('Arriving ' || COALESCE(guest_name, 'guest') || ' at ' || COALESCE(arrival_time, 'today') || ', ' || COUNT(*) OVER (PARTITION BY unit_id, arrival_date) || ' HK task(s) open')::text AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id,
    ('/tasks/' || task_id::text)::text AS entity_link,
    ('p1_notready_' || unit_id::text || '_' || arrival_date::text)::text AS dedupe_key,
    now() AS created_at
  FROM p1_unit_not_ready_raw
  ORDER BY unit_id, arrival_date, updated_at DESC NULLS LAST
),
p1_vip_raw AS (
  SELECT r.unit_id, r.unit_code, r.guest_name, r.arrival_date, t.id AS task_id, t.title AS task_title, t.updated_at
  FROM mv_track_reservations_latest r
  JOIN units u ON u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint
  JOIN tasks t ON t.unit_id = u.id
  WHERE r.is_vip = true
    AND r.arrival_date >= CURRENT_DATE
    AND r.arrival_date <= (CURRENT_DATE + INTERVAL '48 hours')
    AND t.status = ANY (ARRAY['new'::task_status, 'assigned'::task_status, 'in_progress'::task_status, 'vendor_not_started'::task_status, 'waiting_parts'::task_status, 'blocked'::task_status])
),
p1_vip_open_wo AS (
  SELECT DISTINCT ON (unit_id, arrival_date)
    'P1'::text AS severity,
    ('VIP arrival with open WO on ' || COALESCE(unit_code, 'unit ' || unit_id::text))::text AS title,
    (COALESCE(guest_name, 'VIP guest') || ' arriving ' || arrival_date::text || ', ' || COUNT(*) OVER (PARTITION BY unit_id, arrival_date) || ' open WO(s)')::text AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id,
    ('/tasks/' || task_id::text)::text AS entity_link,
    ('p1_vip_' || unit_id::text || '_' || arrival_date::text)::text AS dedupe_key,
    now() AS created_at
  FROM p1_vip_raw
  ORDER BY unit_id, arrival_date, updated_at DESC NULLS LAST
),
p2_vendor_raw AS (
  SELECT v.id AS vendor_id, v.name AS vendor_name, t.id AS task_id, t.updated_at
  FROM tasks t
  JOIN vendors v ON v.id = t.vendor_id
  WHERE t.vendor_id IS NOT NULL
    AND t.status = ANY (ARRAY['new'::task_status, 'assigned'::task_status, 'in_progress'::task_status, 'vendor_not_started'::task_status, 'waiting_parts'::task_status, 'blocked'::task_status])
    AND sla_deadline(t.id) < now()
),
p2_vendor_sla AS (
  SELECT DISTINCT ON (vendor_id)
    'P2'::text AS severity,
    ('Vendor SLA missed: ' || COALESCE(vendor_name, 'Unknown vendor'))::text AS title,
    (COUNT(*) OVER (PARTITION BY vendor_id) || ' overdue task(s) past SLA deadline')::text AS subtitle,
    'vendor'::text AS entity_type, vendor_id AS entity_id,
    ('/admin/vendors/' || vendor_id::text)::text AS entity_link,
    ('p2_vendorsla_' || vendor_id::text)::text AS dedupe_key,
    now() AS created_at
  FROM p2_vendor_raw
  ORDER BY vendor_id, updated_at DESC NULLS LAST
),
p2_health_dropped AS (
  SELECT
    'P2'::text AS severity,
    ('Property health dropped: ' || p.name)::text AS title,
    ('Score dropped from ' || snap.score::text || ' to ' || curr.score::text)::text AS subtitle,
    'property'::text AS entity_type, p.id AS entity_id,
    ('/admin/properties/' || p.id::text)::text AS entity_link,
    ('p2_healthdrop_' || p.id::text)::text AS dedupe_key,
    now() AS created_at
  FROM properties p
  JOIN LATERAL (SELECT score FROM operational_health_score_by_property() ohs WHERE ohs.property_id = p.id) curr ON true
  JOIN LATERAL (SELECT score FROM ops_health_snapshots ohs2 WHERE ohs2.property_id = p.id AND ohs2.captured_at < (now() - INTERVAL '30 minutes') ORDER BY ohs2.captured_at DESC LIMIT 1) snap ON true
  WHERE curr.score <= (snap.score - 10)
),
p3_overdue_vip_raw AS (
  SELECT u.id AS unit_id, u.unit_code, t.id AS task_id, t.title AS task_title, sla_deadline(t.id) AS deadline, t.updated_at
  FROM tasks t
  JOIN units u ON u.id = t.unit_id
  WHERE t.status = ANY (ARRAY['new'::task_status, 'assigned'::task_status, 'in_progress'::task_status, 'vendor_not_started'::task_status, 'waiting_parts'::task_status, 'blocked'::task_status])
    AND sla_deadline(t.id) < (now() - INTERVAL '24 hours')
    AND EXISTS (
      SELECT 1 FROM mv_track_reservations_latest r
      WHERE (r.unit_id::text = u.id::text OR (u.track_id IS NOT NULL AND r.unit_id::bigint = u.track_id))
        AND r.is_vip = true
        AND r.arrival_date >= (CURRENT_DATE - INTERVAL '7 days')
        AND r.arrival_date <= (CURRENT_DATE + INTERVAL '7 days')
    )
),
p3_overdue_vip AS (
  SELECT DISTINCT ON (unit_id)
    'P3'::text AS severity,
    ('Overdue on VIP-tagged unit: ' || COALESCE(unit_code, 'unit'))::text AS title,
    (COUNT(*) OVER (PARTITION BY unit_id) || ' overdue task(s), oldest ' || round(EXTRACT(epoch FROM now() - MIN(deadline) OVER (PARTITION BY unit_id)) / 3600.0)::text || 'h past SLA')::text AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id,
    ('/tasks/' || task_id::text)::text AS entity_link,
    ('p3_overduevip_' || unit_id::text)::text AS dedupe_key,
    now() AS created_at
  FROM p3_overdue_vip_raw
  ORDER BY unit_id, deadline ASC NULLS LAST
),
merged AS (
  SELECT * FROM p1_unit_not_ready
  UNION ALL SELECT * FROM p1_vip_open_wo
  UNION ALL SELECT * FROM p2_vendor_sla
  UNION ALL SELECT * FROM p2_health_dropped
  UNION ALL SELECT * FROM p3_overdue_vip
)
SELECT DISTINCT ON (dedupe_key) severity, title, subtitle, entity_type, entity_id, entity_link, dedupe_key, created_at
FROM merged
ORDER BY dedupe_key, severity;

CREATE UNIQUE INDEX mv_operational_exceptions_dedupe_key_idx ON public.mv_operational_exceptions (dedupe_key);
CREATE INDEX mv_operational_exceptions_severity_idx ON public.mv_operational_exceptions (severity, created_at DESC);

REVOKE ALL ON public.mv_operational_exceptions FROM PUBLIC;
GRANT SELECT ON public.mv_operational_exceptions TO authenticated;

REFRESH MATERIALIZED VIEW public.mv_operational_exceptions;

-- Re-create exception_feed RPC (was CASCADEd off the MV drop)
CREATE OR REPLACE FUNCTION public.exception_feed(p_limit int DEFAULT 50)
RETURNS jsonb
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (public.has_admin_access(auth.uid()) OR public.has_role(auth.uid(), 'supervisor')) THEN
    RAISE EXCEPTION 'exception_feed requires supervisor/manager/admin' USING ERRCODE = '42501';
  END IF;
  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(e)), '[]'::jsonb) FROM (
      SELECT severity, title, subtitle, entity_type, entity_id, entity_link, dedupe_key, created_at
      FROM public.mv_operational_exceptions
      ORDER BY severity ASC, created_at DESC
      LIMIT p_limit
    ) e
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.exception_feed(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.exception_feed(int) TO authenticated;
