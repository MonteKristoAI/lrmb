-- Level-10 codex + playwright sweep hardening batch.
--
-- P1 — Profile-update trigger: replace `IF auth.uid() IS NULL THEN RETURN NEW`
-- with an allowlist on the connection role. A SECURITY DEFINER RPC could
-- run with no JWT and end up bypassing the column lock; only postgres
-- (migrations + edge functions running as service_role) should pass through.
CREATE OR REPLACE FUNCTION public.enforce_profile_self_update_scope()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := current_setting('request.jwt.claim.role', true);
  -- Server-side roles (cron, edge functions, migrations) bypass.
  IF current_user IN ('postgres', 'service_role', 'supabase_admin') THEN
    RETURN NEW;
  END IF;
  IF v_role IS NULL OR v_role = '' THEN
    -- No JWT and not a server role → reject any change to protected columns
    -- (was: silently return NEW, which the codex audit flagged as bypassable
    -- via SECURITY DEFINER RPCs that strip JWT context).
    IF NEW.vendor_id IS DISTINCT FROM OLD.vendor_id THEN
      RAISE EXCEPTION 'No authenticated user; cannot modify vendor membership'
        USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;
  IF public.has_admin_access((SELECT auth.uid())) THEN
    RETURN NEW;
  END IF;
  IF NEW.vendor_id IS DISTINCT FROM OLD.vendor_id THEN
    RAISE EXCEPTION 'Field staff cannot modify their own vendor membership'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;


-- P1 — Atomic vendor reconciliation. resolveTrackVendor in track-poll was
-- a multi-roundtrip select-then-upsert-then-name-fallback path with a
-- window where two concurrent polls could attach the same track_vendor_id
-- to different local vendors, or stamp track_vendor_id onto the wrong
-- name-matched row. Move the resolution into a single transaction.
CREATE OR REPLACE FUNCTION public.upsert_track_vendor(
  p_track_vendor_id INTEGER,
  p_name            TEXT,
  p_contact_name    TEXT DEFAULT NULL,
  p_email           TEXT DEFAULT NULL,
  p_phone           TEXT DEFAULT NULL,
  p_is_active       BOOLEAN DEFAULT TRUE
) RETURNS TABLE (vendor_id UUID, created BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing UUID;
  v_byname UUID;
BEGIN
  IF p_track_vendor_id IS NULL THEN
    RAISE EXCEPTION 'p_track_vendor_id required' USING ERRCODE = '22023';
  END IF;
  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'p_name required' USING ERRCODE = '22023';
  END IF;

  -- 1) Fast path: existing by track_vendor_id under a FOR UPDATE row lock
  --    so no concurrent caller can race past us.
  SELECT id INTO v_existing
  FROM public.vendors
  WHERE track_vendor_id = p_track_vendor_id
  FOR UPDATE;
  IF v_existing IS NOT NULL THEN
    RETURN QUERY SELECT v_existing, FALSE;
    RETURN;
  END IF;

  -- 2) Try insert. The unique on track_vendor_id (non-partial after
  --    20260529001100) catches a concurrent insert race deterministically.
  BEGIN
    INSERT INTO public.vendors (
      name, contact_name, email, phone, specialty, active, track_vendor_id
    ) VALUES (
      p_name, p_contact_name, p_email, p_phone, 'housekeeping', p_is_active, p_track_vendor_id
    )
    RETURNING id INTO v_existing;

    INSERT INTO public.audit_logs (
      action, entity_type, entity_id, description, payload_json
    ) VALUES (
      'track_vendor_auto_imported', 'edge_function', gen_random_uuid(),
      format('Auto-imported TRACK vendor %s (%s)', p_track_vendor_id, p_name),
      jsonb_build_object('severity', 'info', 'trackVendorId', p_track_vendor_id, 'name', p_name, 'vendorId', v_existing)
    );

    RETURN QUERY SELECT v_existing, TRUE;
    RETURN;
  EXCEPTION WHEN unique_violation THEN
    -- Either track_vendor_id raced or name collided. Find out which.
    SELECT id INTO v_existing
    FROM public.vendors WHERE track_vendor_id = p_track_vendor_id;
    IF v_existing IS NOT NULL THEN
      RETURN QUERY SELECT v_existing, FALSE;
      RETURN;
    END IF;
    -- Name collision: adopt only if the matched row has no track_vendor_id
    -- AND there's exactly ONE such candidate. Multiple matches = ambiguous,
    -- bail with NULL so the caller logs and continues without a vendor link.
    SELECT id INTO v_byname FROM public.vendors
    WHERE lower(name) = lower(p_name) AND track_vendor_id IS NULL
    FOR UPDATE;
    IF v_byname IS NOT NULL AND (
      SELECT count(*) FROM public.vendors WHERE lower(name) = lower(p_name) AND track_vendor_id IS NULL
    ) = 1 THEN
      UPDATE public.vendors SET track_vendor_id = p_track_vendor_id WHERE id = v_byname;
      RETURN QUERY SELECT v_byname, FALSE;
      RETURN;
    END IF;
    RETURN QUERY SELECT NULL::uuid, FALSE;
    RETURN;
  END;
END $$;

REVOKE EXECUTE ON FUNCTION public.upsert_track_vendor(INTEGER, TEXT, TEXT, TEXT, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.upsert_track_vendor(INTEGER, TEXT, TEXT, TEXT, TEXT, BOOLEAN)
  TO service_role;


-- P2 — Missing btree on tasks.vendor_id. The "Staff see vendor tasks" RLS
-- + MyTasks .or() filter both query by vendor_id. Currently no covering
-- index exists.
CREATE INDEX IF NOT EXISTS tasks_vendor_id_idx
  ON public.tasks (vendor_id) WHERE vendor_id IS NOT NULL;


-- P2 — lower(email) lookup nondeterminism in diagnose_wo_visibility.
-- The current RPC selects WHERE lower(email) = lower(p_email) LIMIT 1
-- without a unique constraint. If two profiles ever share a case-different
-- email, the chosen one is arbitrary. Backstop with a partial unique
-- functional index. Safe today (0 dupes confirmed via SELECT lower(email),
-- count(*) FROM profiles GROUP BY 1 HAVING count(*) > 1 yields no rows).
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_lower_uniq
  ON public.profiles (lower(email)) WHERE email IS NOT NULL;
