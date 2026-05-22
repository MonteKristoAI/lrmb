-- Materialized view: latest reservation event per reservation_id with JSON fields extracted.
-- Root cause: reservation_events.payload_json is 13MB across 1500 rows. Edge fn reading raw
-- payload_json took ~6s of wire transfer + JSON parse. This MV pre-extracts the 5 fields
-- the dashboard actually uses (unit_id, arrival_date, departure_date, status, occupants, nights)
-- and pre-dedupes via DISTINCT ON (external_id).
-- Refresh: every 2 minutes via pg_cron (REFRESH CONCURRENTLY, requires unique index).

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_track_reservations_latest AS
SELECT DISTINCT ON (external_id)
  external_id,
  event_at,
  event_type,
  NULLIF(payload_json->>'unitId', '')::int AS unit_id,
  payload_json->>'arrivalDate' AS arrival_date,
  payload_json->>'departureDate' AS departure_date,
  payload_json->>'status' AS status,
  payload_json->'occupants' AS occupants,
  NULLIF(payload_json->>'nights', '')::int AS nights
FROM public.reservation_events
WHERE external_source = 'track'
ORDER BY external_id, event_at DESC;

CREATE UNIQUE INDEX IF NOT EXISTS mv_track_reservations_latest_pkey
  ON public.mv_track_reservations_latest (external_id);
CREATE INDEX IF NOT EXISTS mv_track_reservations_latest_arrival_idx
  ON public.mv_track_reservations_latest (arrival_date);
CREATE INDEX IF NOT EXISTS mv_track_reservations_latest_departure_idx
  ON public.mv_track_reservations_latest (departure_date);

COMMENT ON MATERIALIZED VIEW public.mv_track_reservations_latest IS
  'Latest reservation event per reservation_id with extracted JSON fields. '
  'Refreshed every 2 min by pg_cron. Drops 13MB payload_json fetch to ~200KB columnar.';

-- pg_cron job: refresh every 2 minutes (CONCURRENTLY since we have a unique index)
SELECT cron.schedule(
  'mv-track-reservations-latest-refresh',
  '*/2 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_track_reservations_latest;$$
);
