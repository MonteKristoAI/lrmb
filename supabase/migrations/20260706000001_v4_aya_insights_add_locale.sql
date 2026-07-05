-- Bilingual Aya (2026-07-06): the app is EN/ES, so Aya narrates in the viewer's
-- locale. Add a locale dimension; generate + store one row per (scope, property,
-- locale, day). The read RPC gains p_locale, falling back to 'en' if the caller's
-- locale has no row yet.

ALTER TABLE public.aya_insights ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';

DROP INDEX IF EXISTS public.aya_insights_scope_prop_day_idx;
CREATE UNIQUE INDEX IF NOT EXISTS aya_insights_scope_prop_locale_day_idx
  ON public.aya_insights (scope, COALESCE(property_id, '00000000-0000-0000-0000-000000000000'::uuid), locale, generated_for);

-- Old 2-arg overload dropped so only the locale-aware version remains.
DROP FUNCTION IF EXISTS public.aya_latest_insight(text, uuid);

CREATE OR REPLACE FUNCTION public.aya_latest_insight(
  p_scope text,
  p_property_id uuid DEFAULT NULL,
  p_locale text DEFAULT 'en'
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

  -- Prefer the requested locale; fall back to English so a fresh ES viewer still
  -- sees the latest brief until the ES row is generated.
  SELECT * INTO v_row
  FROM public.aya_insights
  WHERE scope = p_scope
    AND ( (p_scope = 'platform' AND property_id IS NULL)
       OR (p_scope = 'property' AND property_id = p_property_id) )
    AND locale IN (p_locale, 'en')
  ORDER BY (locale = p_locale) DESC, generated_for DESC, generated_at DESC
  LIMIT 1;

  IF v_row.id IS NULL THEN RETURN NULL; END IF;

  RETURN jsonb_build_object(
    'scope', v_row.scope, 'property_id', v_row.property_id, 'generated_for', v_row.generated_for,
    'locale', v_row.locale, 'headline', v_row.headline, 'narrative', v_row.narrative,
    'bullets', v_row.bullets, 'model', v_row.model, 'generated_at', v_row.generated_at
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.aya_latest_insight(text, uuid, text) TO authenticated;
