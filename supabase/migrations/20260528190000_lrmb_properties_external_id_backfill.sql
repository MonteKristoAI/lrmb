-- v21 audit (DB integrity, agent D, finding P0-2) flagged 21 properties
-- with `external_source='track'` AND `external_id IS NULL`. These are real
-- LRMB-managed buildings (Setai, Faena, Fontainebleau, 1H&H, etc.) that
-- were seeded manually in April + May, mis-labeled with source='track'.
-- They aren't duplicates today, but the new (non-partial) unique index
-- properties_external_uniq allows multiple NULL rows so a future bug
-- could silently grow this set.
--
-- Backfilling external_id with a derived slug so each row has a unique
-- non-NULL key. Future inserts that collide on slug get a UNIQUE error
-- (visible) instead of silently duplicating.

UPDATE public.properties
SET external_id = 'manual:' || lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE external_source = 'track' AND external_id IS NULL;
