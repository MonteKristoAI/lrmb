-- Close 3 over-permissive RLS policies on profiles + vendors that were
-- flagged as pre-existing P2 backlog but turn out to be unused by any
-- frontend code path (grep confirmed). They each allow more data out than
-- the actual app needs:
--
-- 1. profiles.anon_select_limited USING true — anon API key can SELECT
--    every staff row (email, phone, full_name, vendor_id, department).
--    The anon key ships in the Vercel bundle. Anyone hitting
--    /rest/v1/profiles with that key dumps the whole roster.
--    No frontend code reads profiles as anon (lib/auth.tsx reads only
--    AFTER login, which is authenticated). Drop.
--
-- 2. vendors.anon_select_for_onboarding USING true — anon can SELECT
--    every vendor including email, phone, payment_method, address,
--    notes. Same anon-key exposure as profiles. No frontend code reads
--    vendors as anon (useVendors / useActiveVendors are both behind
--    /admin/* routes). Drop.
--
-- 3. vendors."Authenticated read vendors" USING true — any logged-in
--    field_staff user can see every vendor's PII. The frontend uses
--    vendors only on admin routes (CreateTask, VendorManagement) and
--    field_staff display vendor identity via tasks.assigned_vendor_name
--    (already a text column denormalized on tasks). Replace with two
--    narrower policies: admin sees all, staff sees ONLY their own
--    vendor row.

DROP POLICY IF EXISTS "anon_select_limited" ON public.profiles;
DROP POLICY IF EXISTS "anon_select_for_onboarding" ON public.vendors;
DROP POLICY IF EXISTS "Authenticated read vendors" ON public.vendors;

-- Admins keep full read access (consolidated with the existing
-- "Admin manage vendors" ALL policy — already covers SELECT, so this
-- is implicit and we don't need a redundant SELECT policy).

-- Field staff: see only the vendor row matching profiles.vendor_id.
-- Used today only as defense-in-depth for any future UI that wants to
-- show "your HK company: <vendor.name>" via a JOIN instead of the
-- denormalized assigned_vendor_name. Costs nothing if unused.
CREATE POLICY "Staff read own vendor" ON public.vendors
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT p.vendor_id FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.vendor_id IS NOT NULL
    )
  );
