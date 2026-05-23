-- Nemr Build Directive §15: extend role normalization to include
-- 'executive' (CEO/exec visibility) and 'vendor' (external maintenance
-- vendor login). The four prior values (admin, manager, supervisor,
-- field_staff) remain unchanged.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'executive';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendor';
