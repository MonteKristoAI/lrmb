-- L10 wave 18 (2026-06-10): wave 17 dropped tasks_track_clean_type_id_idx
-- because it had zero query traffic, but the FK
-- tasks_track_clean_type_id_fkey still exists and needs a covering index
-- so cascade checks + delete on track_clean_types don't seq-scan tasks.
-- Restored as partial (track_clean_type_id IS NOT NULL) to keep it tiny
-- since most tasks don't carry this fkey.

CREATE INDEX IF NOT EXISTS tasks_track_clean_type_id_idx
  ON public.tasks (track_clean_type_id)
  WHERE track_clean_type_id IS NOT NULL;
