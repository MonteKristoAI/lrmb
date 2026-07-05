-- Aya intelligence layer (Nemr vision 2026-07-04): precomputed operational
-- narrative. Mirrors the ops_health_snapshots pattern: a cron edge fn reads the
-- aggregated signals, calls the LLM via mk-ai-gateway, and upserts a natural-
-- language "what needs attention and why" row here. The UI reads the cached
-- latest row through a role-guarded SECDEF RPC (never the table directly).

CREATE TABLE IF NOT EXISTS public.aya_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL CHECK (scope IN ('platform','property')),
  property_id uuid NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  generated_for date NOT NULL,
  headline text NOT NULL,
  narrative text NOT NULL,
  bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_signals jsonb NOT NULL DEFAULT '{}'::jsonb,
  model text NOT NULL DEFAULT 'unknown',
  generated_at timestamptz NOT NULL DEFAULT now()
);

-- One row per (scope, property, day). Platform rows use the all-zero sentinel so
-- the partial-null unique still dedupes. Re-generation upserts the same day.
CREATE UNIQUE INDEX IF NOT EXISTS aya_insights_scope_prop_day_idx
  ON public.aya_insights (scope, COALESCE(property_id, '00000000-0000-0000-0000-000000000000'::uuid), generated_for);

-- MVs/ops tables in this project are read only through SECDEF RPCs. Same here:
-- enable RLS with no policy = deny-all to anon/authenticated (the read RPC is
-- SECURITY DEFINER and bypasses it); service_role (the cron writer) is exempt.
ALTER TABLE public.aya_insights ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.aya_insights FROM anon, authenticated;

-- Read RPC: latest insight for a scope. Same supervisor/manager/admin guard the
-- other leadership bundles use. GRANT to authenticated is required IN ADDITION
-- to the internal guard (a guard without a grant returns 403; QA-010 lesson).
CREATE OR REPLACE FUNCTION public.aya_latest_insight(
  p_scope text,
  p_property_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_caller uuid := auth.uid();
  v_row public.aya_insights;
BEGIN
  IF NOT (
    public.has_admin_access(v_caller)
    OR public.has_role(v_caller, 'supervisor')
    OR public.has_role(v_caller, 'manager')
  ) THEN
    RAISE EXCEPTION 'aya_latest_insight requires supervisor/manager/admin'
      USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_row
  FROM public.aya_insights
  WHERE scope = p_scope
    AND (
      (p_scope = 'platform' AND property_id IS NULL)
      OR (p_scope = 'property' AND property_id = p_property_id)
    )
  ORDER BY generated_for DESC, generated_at DESC
  LIMIT 1;

  IF v_row.id IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'scope', v_row.scope,
    'property_id', v_row.property_id,
    'generated_for', v_row.generated_for,
    'headline', v_row.headline,
    'narrative', v_row.narrative,
    'bullets', v_row.bullets,
    'model', v_row.model,
    'generated_at', v_row.generated_at
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.aya_latest_insight(text, uuid) TO authenticated;
