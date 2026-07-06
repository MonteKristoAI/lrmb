-- Rich signal bundle for Aya (2026-07-06 quality upgrade). Service-role only
-- (the aya-generate edge fn), so it is UNGUARDED by design and REVOKED from
-- anon/authenticated (never exposed to the app; the app uses the guarded
-- exec_command_center_bundle). Reuses the exact exec-bundle aggregations so the
-- numbers match the dashboard, and adds a health trend (vs ~24h ago) plus a
-- revenue-at-risk estimate (ADR of today's arrivals into at-risk properties).
CREATE OR REPLACE FUNCTION public.aya_signal_bundle()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  h_now jsonb;
  h_prev_score int;
BEGIN
  h_now := public.operational_health_score();
  SELECT score INTO h_prev_score FROM public.ops_health_snapshots
  WHERE property_id IS NULL AND captured_at <= now() - interval '24 hours'
  ORDER BY captured_at DESC LIMIT 1;

  RETURN jsonb_build_object(
    'health', h_now,
    'health_24h_ago_score', h_prev_score,
    'health_delta', CASE WHEN h_prev_score IS NULL THEN NULL ELSE (h_now->>'score')::int - h_prev_score END,
    'revenue_in_house_today', (SELECT COALESCE(SUM(adr),0)::int FROM public.mv_track_reservations_latest
                               WHERE arrival_date<=CURRENT_DATE AND departure_date>CURRENT_DATE),
    'revenue_at_risk_today', (
      SELECT COALESCE(SUM(r.adr),0)::int FROM public.mv_track_reservations_latest r
      JOIN public.units u ON u.track_id = r.unit_id::bigint
      JOIN public.mv_properties_at_risk m ON m.property_id = u.property_id
      WHERE r.arrival_date = CURRENT_DATE AND m.risk_band IN ('critical','at_risk')),
    'vip_arrivals_24h', (SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_date, arrival_time),'[]'::jsonb) FROM (
        SELECT unit_code, guest_name, arrival_time, arrival_date FROM public.mv_track_reservations_latest
        WHERE is_vip=true AND arrival_date BETWEEN CURRENT_DATE AND CURRENT_DATE+1) v),
    'turnovers_today', (
      SELECT COUNT(DISTINCT u.id) FROM public.mv_track_reservations_latest r
      JOIN public.units u ON u.track_id = r.unit_id::bigint
      WHERE r.arrival_date=CURRENT_DATE
        AND EXISTS (SELECT 1 FROM public.mv_track_reservations_latest prev
                    WHERE prev.unit_id=r.unit_id AND prev.departure_date BETWEEN CURRENT_DATE-INTERVAL '7 days' AND CURRENT_DATE AND prev.external_id<>r.external_id)),
    'housekeeping_completion_pct', (
      SELECT ROUND(COALESCE(COUNT(*) FILTER (WHERE status IN ('completed','verified','processed'))::numeric /
                    NULLIF(COUNT(*) FILTER (WHERE status!='cancelled'),0), 0)*100)
      FROM public.tasks WHERE task_category='housekeeping'::task_category
        AND updated_at>=CURRENT_DATE::timestamptz AND updated_at<(CURRENT_DATE+1)::timestamptz),
    'maintenance_sla_pct', (
      SELECT ROUND(COALESCE(COUNT(*) FILTER (WHERE t.completed_at<=d.deadline)::numeric / NULLIF(COUNT(*),0), 0)*100)
      FROM public.tasks t LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id
      WHERE t.task_category='maintenance'::task_category AND t.completed_at IS NOT NULL AND t.completed_at>now()-interval '90 days'),
    'vendor_bottom', (SELECT COALESCE(jsonb_agg(row_to_json(v)),'[]'::jsonb) FROM (
        SELECT vendor_name,score,no_show_pct,task_count FROM public.mv_vendor_performance_30d
        WHERE task_count>=10 ORDER BY score ASC LIMIT 3) v),
    'exceptions', (SELECT COALESCE(jsonb_agg(row_to_json(e)),'[]'::jsonb) FROM (
        SELECT severity,title,subtitle,entity_type,entity_id,entity_link FROM public.mv_operational_exceptions
        ORDER BY severity, created_at DESC LIMIT 30) e),
    -- Each at-risk property carries its own health_delta_24h so the per-property
    -- brief can state a REAL trend. The field is OMITTED (not null) when there is
    -- no ~24h-ago snapshot, so the model has no ambiguous null to fabricate from.
    'properties_at_risk', (
      SELECT COALESCE(jsonb_agg(pj ORDER BY sort_key, hs ASC), '[]'::jsonb) FROM (
        SELECT (to_jsonb(m) ||
                CASE WHEN d.delta IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('health_delta_24h', d.delta) END) AS pj,
               CASE m.risk_band WHEN 'critical' THEN 1 WHEN 'at_risk' THEN 2 WHEN 'watch' THEN 3 ELSE 4 END AS sort_key,
               m.health_score AS hs
        FROM public.mv_properties_at_risk m
        LEFT JOIN LATERAL (SELECT m.health_score - s.score AS delta FROM public.ops_health_snapshots s
                           WHERE s.property_id=m.property_id AND s.captured_at <= now()-interval '24 hours'
                           ORDER BY s.captured_at DESC LIMIT 1) d ON true
        WHERE m.risk_band!='healthy'
      ) q),
    'computed_at', now(),
    -- Redaction seed: EVERY arrival guest name in a +/-2 day window (VIP or not).
    -- The edge fn uses this only to build the PHI redaction set, then strips it
    -- before the payload reaches the LLM. Catches names embedded in exception
    -- subtitles that have no guest_name field of their own.
    '_redact_names', (SELECT COALESCE(jsonb_agg(DISTINCT guest_name),'[]'::jsonb) FROM public.mv_track_reservations_latest
                      WHERE guest_name IS NOT NULL AND length(guest_name) > 3 AND arrival_date BETWEEN CURRENT_DATE-1 AND CURRENT_DATE+2)
  );
END $function$;

REVOKE ALL ON FUNCTION public.aya_signal_bundle() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.aya_signal_bundle() TO service_role;
