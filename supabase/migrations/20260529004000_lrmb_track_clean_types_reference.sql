-- TRACK housekeeping clean type reference + denormalized task fields.
-- Emma feedback 2026-05-29: the field-staff WO list shows generic
-- "Clean - TRACK WO #X" because TRACK's polling response has
-- cleanTypeId (integer) but the cleanType (name string) is always null.
-- We were only reading the name string, so every HK WO collapsed to
-- the "Clean" fallback regardless of whether it was a Final Clean,
-- Deep Clean, Inspection, Touch Up, Linen Change, etc.
--
-- TRACK exposes the reference list at GET /api/pms/housekeeping/clean-
-- types (probed 2026-05-29: 77 rows, 66 active). This migration:
-- 1. Mirrors the reference as public.track_clean_types.
-- 2. Adds two denormalized columns on public.tasks so the WO list can
--    render the real name without a JOIN per row, AND historical rows
--    survive if a clean type is later removed from the reference.
-- 3. RLS: authenticated reads (so the UI can list types in dropdowns
--    + render names), service_role writes (sync only).

CREATE TABLE IF NOT EXISTS public.track_clean_types (
  track_id INTEGER PRIMARY KEY,
  type     TEXT NOT NULL,
  code     TEXT,
  name     TEXT NOT NULL,
  active   BOOLEAN NOT NULL DEFAULT TRUE,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.track_clean_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read clean types" ON public.track_clean_types;
CREATE POLICY "Authenticated read clean types" ON public.track_clean_types
  FOR SELECT TO authenticated USING (TRUE);

GRANT SELECT ON public.track_clean_types TO authenticated;
GRANT ALL    ON public.track_clean_types TO service_role;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS track_clean_type_id INTEGER REFERENCES public.track_clean_types(track_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS clean_type_name TEXT;

CREATE INDEX IF NOT EXISTS tasks_track_clean_type_id_idx
  ON public.tasks (track_clean_type_id) WHERE track_clean_type_id IS NOT NULL;
