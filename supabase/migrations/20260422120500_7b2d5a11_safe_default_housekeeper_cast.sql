-- Prevent TravelNet housekeeping automation from crashing when legacy
-- units.default_housekeeper values contain non-UUID text.
CREATE OR REPLACE FUNCTION public.create_housekeeping_task_from_reservation_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_assigned_to uuid;
  v_default_housekeeper_raw text;
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

  SELECT u.default_housekeeper::text, u.short_name
  INTO v_default_housekeeper_raw, v_unit_code
  FROM public.units u
  WHERE u.id = NEW.unit_id;

  IF v_default_housekeeper_raw ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
    v_assigned_to := v_default_housekeeper_raw::uuid;
  ELSE
    v_assigned_to := NULL;
  END IF;

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
