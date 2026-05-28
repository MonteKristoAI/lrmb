-- v20 introduced partial unique indexes (WHERE col IS NOT NULL) but
-- supabase-js / PostgREST ON CONFLICT can't resolve a partial unique index
-- as a conflict target. Live error confirmed 2026-05-28 16:51 UTC:
--   "UPSERT failed: there is no unique or exclusion constraint matching
--    the ON CONFLICT specification" for unit W3B1229L (track_id 208).
--
-- Postgres UNIQUE already allows multiple NULLs to coexist without partial
-- predicates, so the WHERE clause was redundant. Recreating as unconditional
-- UNIQUE indexes that ON CONFLICT can target.

DROP INDEX IF EXISTS public.units_track_id_uniq;
DROP INDEX IF EXISTS public.units_external_uniq;
DROP INDEX IF EXISTS public.properties_external_uniq;

CREATE UNIQUE INDEX units_track_id_uniq
  ON public.units (track_id);

CREATE UNIQUE INDEX units_external_uniq
  ON public.units (external_source, external_id);

CREATE UNIQUE INDEX properties_external_uniq
  ON public.properties (external_source, external_id);
