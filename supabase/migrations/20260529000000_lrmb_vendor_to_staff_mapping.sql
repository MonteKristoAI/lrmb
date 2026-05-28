-- Schema fix for the "Emma can't see her TRACK WOs as field_staff" class
-- of bug (2026-05-28). TRACK assigns housekeeping work orders to a vendor
-- company (e.g. vendorId 1473 = "Emma Benson CO Test"), not to a specific
-- staff user. Our field_staff RLS "Staff see assigned tasks" filters by
-- assigned_to = auth.uid(), so until an admin manually assigned each WO
-- Emma saw nothing.
--
-- Two-column addition:
--   vendors.track_vendor_id  — links our vendors row to a TRACK vendor.
--   profiles.vendor_id       — links a field_staff user to their HK vendor.
--
-- Plus an updated tasks SELECT policy that lets a field_staff user see
-- tasks where the WO's vendor matches their own vendor membership, not
-- just where they're personally assigned.

ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS track_vendor_id INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS vendors_track_vendor_id_uniq
  ON public.vendors (track_vendor_id) WHERE track_vendor_id IS NOT NULL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS profiles_vendor_id_idx
  ON public.profiles (vendor_id) WHERE vendor_id IS NOT NULL;

-- Augment the existing field_staff SELECT policy on tasks so a member
-- of a vendor sees TRACK-assigned WOs against that vendor too, not just
-- ones where assigned_to = me. The existing "Admin full task access"
-- and "Staff see assigned tasks" policies stay; we add a third additive
-- (OR) policy. RLS combines permissive policies with OR by default.

DROP POLICY IF EXISTS "Staff see vendor tasks" ON public.tasks;
CREATE POLICY "Staff see vendor tasks" ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    vendor_id IS NOT NULL
    AND vendor_id IN (
      SELECT p.vendor_id FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.vendor_id IS NOT NULL
    )
  );

-- Field staff can also UPDATE WOs assigned to their vendor (mark in
-- progress, complete, etc.) — same membership check.
DROP POLICY IF EXISTS "Staff update vendor tasks" ON public.tasks;
CREATE POLICY "Staff update vendor tasks" ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    vendor_id IS NOT NULL
    AND vendor_id IN (
      SELECT p.vendor_id FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.vendor_id IS NOT NULL
    )
  );
