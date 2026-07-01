-- v3.0 Wave 1 (2026-07-01): widen mv_track_reservations_latest to expose the
-- HAL fields we already persist in reservation_events.payload_json. Track uses
-- HAL+JSON, so revenue lives under quoteBreakdown, guest+VIP under
-- _embedded.contact, unit metadata under _embedded.unit. No track-poll change.
--
-- Also converts arrival_date/departure_date from text to date so downstream
-- date arithmetic stops casting on every read.
--
-- Applied via MCP apply_migration on 2026-07-01 18:24 UTC (version 20260701182401).
-- File committed to repo for DR parity with dashboard-applied migrations.

DROP MATERIALIZED VIEW IF EXISTS public.mv_track_reservations_latest CASCADE;

CREATE MATERIALIZED VIEW public.mv_track_reservations_latest AS
SELECT DISTINCT ON (external_id)
  external_id,
  event_at,
  event_type,
  NULLIF(payload_json->>'unitId', '')::int AS unit_id,
  NULLIF(payload_json->>'arrivalDate', '')::date AS arrival_date,
  NULLIF(payload_json->>'departureDate', '')::date AS departure_date,
  payload_json->>'status' AS status,
  payload_json->'occupants' AS occupants,
  NULLIF(payload_json->>'nights', '')::int AS nights,

  -- Revenue (quoteBreakdown)
  NULLIF(payload_json->'quoteBreakdown'->>'adr', '')::numeric(10,2) AS adr,
  NULLIF(payload_json->'quoteBreakdown'->>'grandTotal', '')::numeric(10,2) AS grand_total,
  NULLIF(payload_json->'quoteBreakdown'->>'grossRent', '')::numeric(10,2) AS gross_rent,
  NULLIF(payload_json->'quoteBreakdown'->>'totalTaxes', '')::numeric(10,2) AS total_taxes,
  NULLIF(payload_json->'quoteBreakdown'->>'totalFees', '')::numeric(10,2) AS total_fees,

  -- Guest + VIP (_embedded.contact)
  NULLIF(payload_json->'_embedded'->'contact'->>'name', '') AS guest_name,
  NULLIF(payload_json->'_embedded'->'contact'->>'primaryEmail', '') AS guest_email,
  COALESCE((payload_json->'_embedded'->'contact'->>'isVip')::bool, false) AS is_vip,
  COALESCE((payload_json->'_embedded'->'contact'->>'isDNR')::bool, false) AS is_dnr,
  COALESCE((payload_json->'_embedded'->'contact'->>'isBlacklist')::bool, false) AS is_blacklist,

  -- Folio (_embedded.folio)
  NULLIF(payload_json->'_embedded'->'folio'->>'id', '')::bigint AS folio_id,
  NULLIF(payload_json->'_embedded'->'folio'->>'status', '') AS folio_status,
  NULLIF(payload_json->'_embedded'->'folio'->>'currentBalance', '')::numeric(10,2) AS folio_balance,

  -- Unit metadata (_embedded.unit)
  NULLIF(payload_json->'_embedded'->'unit'->>'shortName', '') AS unit_short_name,
  NULLIF(payload_json->'_embedded'->'unit'->>'unitCode', '') AS unit_code,
  NULLIF(payload_json->'_embedded'->'unit'->'custom'->>'pms_units_area', '') AS unit_area,

  -- Top-level booking metadata
  NULLIF(payload_json->>'promoCode', '') AS promo_code,
  NULLIF(payload_json->>'source', '') AS source,
  NULLIF(payload_json->>'arrivalTime', '') AS arrival_time,
  NULLIF(payload_json->>'departureTime', '') AS departure_time
FROM public.reservation_events
WHERE external_source = 'track'
ORDER BY external_id, event_at DESC;

CREATE UNIQUE INDEX mv_track_reservations_latest_pkey ON public.mv_track_reservations_latest (external_id);
CREATE INDEX mv_track_reservations_latest_arrival_idx ON public.mv_track_reservations_latest (arrival_date);
CREATE INDEX mv_track_reservations_latest_departure_idx ON public.mv_track_reservations_latest (departure_date);
CREATE INDEX mv_track_reservations_latest_vip_arrival_idx ON public.mv_track_reservations_latest (arrival_date) WHERE is_vip = true;
CREATE INDEX mv_track_reservations_latest_unit_arrival_idx ON public.mv_track_reservations_latest (unit_id, arrival_date);

COMMENT ON MATERIALIZED VIEW public.mv_track_reservations_latest IS
  'Latest reservation event per external_id, HAL-flattened. Refreshed every 2 min by pg_cron.
   v3.0 Wave 1: adds revenue (adr, grand_total, gross_rent), guest (name, is_vip, is_dnr),
   folio (id, status, balance), unit_code, promo_code, source.';

REFRESH MATERIALIZED VIEW public.mv_track_reservations_latest;
