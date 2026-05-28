-- Defense-in-depth for the inline TRACK auto-import path added in
-- track-poll v18 (see 20260528150000). Without these UNIQUE constraints,
-- two concurrent track-poll invocations that both see the same unmapped
-- unitId can race past the race-safe re-check inside autoImportUnit() and
-- end up creating duplicate units / duplicate catch-all properties.
--
-- Adding partial-unique indexes (not constraints) so existing NULL rows
-- aren't affected and we don't fight the existing schema generators.

CREATE UNIQUE INDEX IF NOT EXISTS units_track_id_uniq
  ON public.units (track_id)
  WHERE track_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS units_external_uniq
  ON public.units (external_source, external_id)
  WHERE external_source IS NOT NULL AND external_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS properties_external_uniq
  ON public.properties (external_source, external_id)
  WHERE external_source IS NOT NULL AND external_id IS NOT NULL;
