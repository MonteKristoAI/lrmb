-- Per-user staff Aya (Nemr vision: "every role a landing page around decisions").
-- Field staff are the one role without their own brief. The aya-my-brief edge fn
-- generates a short "what to do first and why" over the caller's smart queue and
-- caches it here, keyed by (user, day, locale), so a second open within the cache
-- window costs nothing.
--
-- Server-only, exactly like aya_insights: RLS on with no policy = deny-all to
-- anon/authenticated. The edge fn reads/writes with the service-role key and
-- returns the brief inline in its response, so the client never touches this
-- table. That keeps any unit/task detail in a brief off the public API surface.

CREATE TABLE IF NOT EXISTS public.aya_user_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_for date NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  headline text NOT NULL,
  narrative text NOT NULL,
  bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  model text NOT NULL DEFAULT 'unknown',
  generated_at timestamptz NOT NULL DEFAULT now()
);

-- One cached brief per (user, day, locale); regeneration upserts the same row.
CREATE UNIQUE INDEX IF NOT EXISTS aya_user_briefs_user_day_locale_idx
  ON public.aya_user_briefs (user_id, generated_for, locale);

ALTER TABLE public.aya_user_briefs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.aya_user_briefs FROM anon, authenticated;
