-- L10 regression fix (2026-07-02): mv_properties_at_risk was dropped by CASCADE
-- when 20260702010001 dropped operational_health_score_by_property() to change
-- its return type. Recreate from the v3_wave2_properties_at_risk source.

CREATE MATERIALIZED VIEW public.mv_properties_at_risk AS
WITH ohs AS (SELECT * FROM public.operational_health_score_by_property()),
arrivals AS (
  SELECT u.property_id,
    COUNT(*) FILTER (WHERE r.arrival_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '24 hours') AS arrivals_next_24h,
    COUNT(*) FILTER (WHERE r.arrival_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '48 hours') AS arrivals_next_48h,
    COUNT(*) FILTER (WHERE r.arrival_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '48 hours' AND r.is_vip) AS vip_arrivals_next_48h,
    COUNT(*) FILTER (WHERE r.departure_date = CURRENT_DATE
                     AND EXISTS (SELECT 1 FROM public.mv_track_reservations_latest r2
                                 WHERE r2.arrival_date = CURRENT_DATE AND r2.unit_id = r.unit_id
                                       AND r2.external_id <> r.external_id)) AS turnovers_today
  FROM public.mv_track_reservations_latest r
  JOIN public.units u ON u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint
  GROUP BY u.property_id),
wo_counts AS (
  SELECT property_id,
    COUNT(*) FILTER (WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
                     AND public.sla_deadline(id) < now()) AS overdue_wo_count,
    COUNT(*) FILTER (WHERE status IN ('blocked','waiting_parts')) AS blocked_wo_count,
    COUNT(*) FILTER (WHERE status = 'vendor_not_started' AND created_at < now() - INTERVAL '24 hours') AS vendor_delayed_count
  FROM public.tasks WHERE property_id IS NOT NULL GROUP BY property_id),
top_arr AS (
  SELECT u.property_id,
    jsonb_agg(row_to_json(x) ORDER BY x.arrival_date ASC) FILTER (WHERE x.rn <= 3) AS top_arrivals
  FROM (
    SELECT r.unit_id, r.arrival_date, r.unit_code, r.guest_name, r.is_vip,
      ROW_NUMBER() OVER (PARTITION BY u2.property_id ORDER BY r.arrival_date ASC) AS rn
    FROM public.mv_track_reservations_latest r
    JOIN public.units u2 ON u2.id::text = r.unit_id::text OR u2.track_id = r.unit_id::bigint
    WHERE r.arrival_date >= CURRENT_DATE
  ) x
  JOIN public.units u ON u.id::text = x.unit_id::text OR u.track_id = x.unit_id::bigint
  WHERE x.rn <= 3 GROUP BY u.property_id)
SELECT o.property_id, o.property_name, o.score AS health_score, o.band AS health_band,
  COALESCE(a.arrivals_next_24h, 0) AS arrivals_next_24h,
  COALESCE(a.arrivals_next_48h, 0) AS arrivals_next_48h,
  COALESCE(a.vip_arrivals_next_48h, 0) AS vip_arrivals_next_48h,
  COALESCE(a.turnovers_today, 0) AS turnovers_today,
  COALESCE(wc.overdue_wo_count, 0) AS overdue_wo_count,
  COALESCE(wc.blocked_wo_count, 0) AS blocked_wo_count,
  COALESCE(wc.vendor_delayed_count, 0) AS vendor_delayed_count,
  CASE
    WHEN COALESCE(a.vip_arrivals_next_48h, 0) > 0 AND o.score < 80 THEN 'critical'
    WHEN o.score < 70 OR COALESCE(wc.overdue_wo_count, 0) >= 5 THEN 'at_risk'
    WHEN o.score < 85 OR COALESCE(a.arrivals_next_24h, 0) >= 3 THEN 'watch'
    ELSE 'healthy'
  END AS risk_band,
  COALESCE(ta.top_arrivals, '[]'::jsonb) AS top_arrivals,
  now() AS computed_at
FROM ohs o
LEFT JOIN arrivals a ON a.property_id = o.property_id
LEFT JOIN wo_counts wc ON wc.property_id = o.property_id
LEFT JOIN top_arr ta ON ta.property_id = o.property_id;

CREATE UNIQUE INDEX mv_properties_at_risk_pkey ON public.mv_properties_at_risk (property_id);
CREATE INDEX mv_properties_at_risk_band_idx ON public.mv_properties_at_risk (risk_band, health_score);

REVOKE ALL ON public.mv_properties_at_risk FROM PUBLIC, anon, authenticated;
REFRESH MATERIALIZED VIEW public.mv_properties_at_risk;
