-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

DROP VIEW IF EXISTS public.v_track_reservations_latest;

CREATE VIEW public.v_track_reservations_latest AS
SELECT DISTINCT ON (external_id)
  external_id,
  event_at,
  event_type,
  NULLIF(payload_json->>'unitId', '')::int AS unit_id,
  payload_json->>'arrivalDate' AS arrival_date,
  payload_json->>'departureDate' AS departure_date,
  payload_json->>'status' AS status,
  payload_json->'occupants' AS occupants,  -- pass object through as JSONB
  NULLIF(payload_json->>'nights', '')::int AS nights
FROM public.reservation_events
WHERE external_source = 'track'
ORDER BY external_id, event_at DESC;

COMMENT ON VIEW public.v_track_reservations_latest IS
  'Latest reservation event per reservation_id with extracted JSON fields.
   Replaces 13MB payload_json fetch with ~200KB columnar fetch in track-overview-data fn.';
