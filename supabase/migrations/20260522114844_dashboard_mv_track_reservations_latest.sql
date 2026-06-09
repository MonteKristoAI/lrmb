-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

DROP VIEW IF EXISTS public.v_track_reservations_latest;

CREATE MATERIALIZED VIEW public.mv_track_reservations_latest AS
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

CREATE UNIQUE INDEX mv_track_reservations_latest_pkey ON public.mv_track_reservations_latest (external_id);
CREATE INDEX mv_track_reservations_latest_arrival_idx ON public.mv_track_reservations_latest (arrival_date);
CREATE INDEX mv_track_reservations_latest_departure_idx ON public.mv_track_reservations_latest (departure_date);

COMMENT ON MATERIALIZED VIEW public.mv_track_reservations_latest IS
  'Latest reservation event per reservation_id with extracted JSON fields.
   Refreshed every minute by pg_cron. Drops 13MB payload_json fetch to ~200KB columnar.';

-- Schedule REFRESH CONCURRENTLY every 2 min (cheap because indexed)
SELECT cron.schedule(
  'mv-track-reservations-latest-refresh',
  '*/2 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_track_reservations_latest;$$
);
