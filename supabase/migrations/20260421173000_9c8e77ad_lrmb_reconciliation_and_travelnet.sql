-- Reconcile local schema with current LRMB app expectations
-- and add TravelNet reservation -> housekeeping automation.

-- ===============================
-- Enum reconciliations
-- ===============================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'task_status' AND e.enumlabel = 'vendor_not_started'
  ) THEN
    ALTER TYPE public.task_status ADD VALUE 'vendor_not_started';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'task_status' AND e.enumlabel = 'processed'
  ) THEN
    ALTER TYPE public.task_status ADD VALUE 'processed';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'task_category' AND e.enumlabel = 'property_management'
  ) THEN
    ALTER TYPE public.task_category ADD VALUE 'property_management';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'task_category' AND e.enumlabel = 'concierge'
  ) THEN
    ALTER TYPE public.task_category ADD VALUE 'concierge';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'damage_classification') THEN
    CREATE TYPE public.damage_classification AS ENUM ('wear_and_tear', 'guest_damage', 'unclassified');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'housekeeping_type') THEN
    CREATE TYPE public.housekeeping_type AS ENUM (
      'checkout_clean',
      'mid_stay_clean',
      'deep_clean',
      'linen_change',
      'intermittent_clean',
      'owner_specific_clean'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status') THEN
    CREATE TYPE public.claim_status AS ENUM ('pending', 'filed', 'approved', 'denied', 'closed');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inspection_type') THEN
    CREATE TYPE public.inspection_type AS ENUM (
      'after_final_clean',
      'owner_arrival',
      'owner_departure',
      'damage',
      'guest_ready'
    );
  END IF;
END
$$;

-- ===============================
-- Core table reconciliations
-- ===============================
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS zone text;

ALTER TABLE public.units
  ADD COLUMN IF NOT EXISTS short_name text,
  ADD COLUMN IF NOT EXISTS bedrooms integer,
  ADD COLUMN IF NOT EXISTS max_occupancy integer,
  ADD COLUMN IF NOT EXISTS unit_type text,
  ADD COLUMN IF NOT EXISTS unit_size text,
  ADD COLUMN IF NOT EXISTS default_housekeeper uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS track_id bigint;

ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS actor_name text,
  ADD COLUMN IF NOT EXISTS description text;

CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text,
  phone text,
  email text,
  specialty text,
  payment_method text,
  notes text,
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_vendors_updated_at'
  ) THEN
    CREATE TRIGGER trg_vendors_updated_at
    BEFORE UPDATE ON public.vendors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
  END IF;
END
$$;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES public.vendors(id),
  ADD COLUMN IF NOT EXISTS housekeeping_type public.housekeeping_type,
  ADD COLUMN IF NOT EXISTS damage_classification public.damage_classification,
  ADD COLUMN IF NOT EXISTS guest_name text,
  ADD COLUMN IF NOT EXISTS reservation_id text,
  ADD COLUMN IF NOT EXISTS is_guest_facing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_for timestamptz,
  ADD COLUMN IF NOT EXISTS vendor_invoice_received boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vendor_invoice_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS owner_charges_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS billing_ready boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS billing_notes text,
  ADD COLUMN IF NOT EXISTS processed_at timestamptz,
  ADD COLUMN IF NOT EXISTS processed_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS claim_provider text,
  ADD COLUMN IF NOT EXISTS claim_id text,
  ADD COLUMN IF NOT EXISTS claim_status public.claim_status,
  ADD COLUMN IF NOT EXISTS needs_review boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS special_instructions text,
  ADD COLUMN IF NOT EXISTS checkin_time timestamptz,
  ADD COLUMN IF NOT EXISTS checkout_time timestamptz,
  ADD COLUMN IF NOT EXISTS expected_duration_minutes integer;

ALTER TABLE public.inspection_template_items
  ADD COLUMN IF NOT EXISTS auto_create_task_on_flag boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_task_category public.task_category DEFAULT 'maintenance',
  ADD COLUMN IF NOT EXISTS min_photos integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS photo_instructions text;

ALTER TABLE public.inspection_responses
  ADD COLUMN IF NOT EXISTS photos jsonb,
  ADD COLUMN IF NOT EXISTS severity text;

ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS inspection_type public.inspection_type,
  ADD COLUMN IF NOT EXISTS score numeric(5,2),
  ADD COLUMN IF NOT EXISTS total_items integer,
  ADD COLUMN IF NOT EXISTS flagged_items integer,
  ADD COLUMN IF NOT EXISTS photo_compliance_pct numeric(5,2);

-- ===============================
-- Policies for vendors
-- ===============================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'vendors' AND policyname = 'Authenticated read vendors'
  ) THEN
    CREATE POLICY "Authenticated read vendors"
      ON public.vendors FOR SELECT TO authenticated
      USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'vendors' AND policyname = 'Admin manage vendors'
  ) THEN
    CREATE POLICY "Admin manage vendors"
      ON public.vendors FOR ALL TO authenticated
      USING (public.has_admin_access(auth.uid()))
      WITH CHECK (public.has_admin_access(auth.uid()));
  END IF;
END
$$;

-- ===============================
-- Utility function for duplicate checks in Create Task
-- ===============================
DROP FUNCTION IF EXISTS public.find_similar_tasks(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.find_similar_tasks(
  p_property_id uuid,
  p_unit_id uuid DEFAULT NULL,
  p_title text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  status public.task_status,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT
    t.id,
    t.title,
    t.status,
    t.created_at
  FROM public.tasks t
  WHERE t.property_id = p_property_id
    AND (p_unit_id IS NULL OR t.unit_id = p_unit_id)
    AND t.status NOT IN ('completed', 'verified', 'processed')
    AND (
      p_title IS NULL
      OR length(trim(p_title)) < 3
      OR t.title ILIKE '%' || trim(p_title) || '%'
    )
  ORDER BY t.created_at DESC
  LIMIT 10;
$$;

-- ===============================
-- TravelNet reservation event -> housekeeping task automation
-- ===============================
CREATE OR REPLACE FUNCTION public.create_housekeeping_task_from_reservation_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_assigned_to uuid;
  v_unit_code text;
  v_title text;
  v_event_key text;
BEGIN
  IF NEW.event_type NOT IN ('checkout', 'reservation_checkout', 'final_clean_required') THEN
    RETURN NEW;
  END IF;

  IF NEW.unit_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_event_key := COALESCE(NEW.external_id, NEW.id::text);

  -- First dedupe: if event key already created a housekeeping task from integration, skip.
  IF EXISTS (
    SELECT 1
    FROM public.tasks t
    WHERE t.source_type = 'travelnet'
      AND t.task_category = 'housekeeping'
      AND COALESCE(t.external_source, '') = COALESCE(NEW.external_source, 'travelnet')
      AND t.external_id = v_event_key
  ) THEN
    RETURN NEW;
  END IF;

  -- Second dedupe: avoid duplicate housekeeping task for same reservation/unit if active.
  IF EXISTS (
    SELECT 1
    FROM public.tasks t
    WHERE t.task_category = 'housekeeping'
      AND t.unit_id = NEW.unit_id
      AND t.reservation_id = NEW.external_id
      AND t.status NOT IN ('completed', 'verified', 'processed')
  ) THEN
    RETURN NEW;
  END IF;

  SELECT u.default_housekeeper, u.short_name
  INTO v_assigned_to, v_unit_code
  FROM public.units u
  WHERE u.id = NEW.unit_id;

  v_title := 'Checkout clean - ' || COALESCE(v_unit_code, 'Unit');

  INSERT INTO public.tasks (
    title,
    description,
    property_id,
    unit_id,
    task_category,
    task_type,
    priority,
    status,
    assigned_to,
    requires_photo,
    requires_note,
    requires_timestamp,
    due_at,
    scheduled_for,
    source_type,
    external_source,
    external_id,
    reservation_id,
    housekeeping_type,
    is_guest_facing
  )
  VALUES (
    v_title,
    'Auto-created from TravelNet reservation checkout event.',
    NEW.property_id,
    NEW.unit_id,
    'housekeeping',
    'checkout_turnover',
    'high',
    CASE WHEN v_assigned_to IS NOT NULL THEN 'assigned'::public.task_status ELSE 'new'::public.task_status END,
    v_assigned_to,
    true,
    true,
    true,
    NEW.event_at,
    NEW.event_at,
    'travelnet',
    COALESCE(NEW.external_source, 'travelnet'),
    v_event_key,
    NEW.external_id,
    'checkout_clean',
    false
  );

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_reservation_event_to_housekeeping'
  ) THEN
    CREATE TRIGGER trg_reservation_event_to_housekeeping
    AFTER INSERT ON public.reservation_events
    FOR EACH ROW
    EXECUTE FUNCTION public.create_housekeeping_task_from_reservation_event();
  END IF;
END
$$;
