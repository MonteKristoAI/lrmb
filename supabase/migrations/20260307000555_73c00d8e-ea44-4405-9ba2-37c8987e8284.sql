
-- =============================================
-- LRMB Field Ops Schema — Phase 1: Enums
-- =============================================

CREATE TYPE public.app_role AS ENUM ('field_staff', 'admin', 'supervisor', 'manager');
CREATE TYPE public.task_status AS ENUM ('new', 'assigned', 'in_progress', 'waiting_parts', 'blocked', 'completed', 'verified');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.task_category AS ENUM ('maintenance', 'housekeeping', 'inspection', 'general');
CREATE TYPE public.inspection_status AS ENUM ('scheduled', 'in_progress', 'completed', 'verified');

-- =============================================
-- 1. profiles
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. user_roles
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Security definer function: has_role
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- helper: has_any_role (admin, supervisor, or manager)
CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'supervisor', 'manager')
  )
$$;

-- =============================================
-- 3. properties
-- =============================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_source TEXT,
  external_id TEXT,
  name TEXT NOT NULL,
  address TEXT,
  region TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. units
-- =============================================
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  external_source TEXT,
  external_id TEXT,
  unit_code TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_units_property ON public.units(property_id);

-- =============================================
-- 5. staff_assignments
-- =============================================
CREATE TABLE public.staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT 'general',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, property_id, assignment_type)
);
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_staff_assignments_profile ON public.staff_assignments(profile_id);
CREATE INDEX idx_staff_assignments_property ON public.staff_assignments(property_id);

-- =============================================
-- 6. tasks (central table)
-- =============================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_source TEXT,
  external_id TEXT,
  property_id UUID NOT NULL REFERENCES public.properties(id),
  unit_id UUID REFERENCES public.units(id),
  source_type TEXT NOT NULL DEFAULT 'manual',
  task_category public.task_category NOT NULL DEFAULT 'maintenance',
  task_type TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  status public.task_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id),
  assigned_vendor_name TEXT,
  requires_photo BOOLEAN NOT NULL DEFAULT false,
  requires_note BOOLEAN NOT NULL DEFAULT false,
  requires_timestamp BOOLEAN NOT NULL DEFAULT true,
  due_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  blocked_reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  reopened_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_tasks_property ON public.tasks(property_id);
CREATE INDEX idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due ON public.tasks(due_at);
CREATE INDEX idx_tasks_category ON public.tasks(task_category);

-- =============================================
-- 7. task_updates (immutable audit trail)
-- =============================================
CREATE TABLE public.task_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  update_type TEXT NOT NULL,
  old_status public.task_status,
  new_status public.task_status,
  note TEXT,
  metadata_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.task_updates ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_task_updates_task ON public.task_updates(task_id);

-- =============================================
-- 8. task_photos
-- =============================================
CREATE TABLE public.task_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  storage_path TEXT NOT NULL,
  photo_type TEXT NOT NULL DEFAULT 'proof',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.task_photos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_task_photos_task ON public.task_photos(task_id);

-- =============================================
-- 9. inspection_templates
-- =============================================
CREATE TABLE public.inspection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inspection_templates ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 10. inspection_template_items
-- =============================================
CREATE TABLE public.inspection_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.inspection_templates(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  label TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'checkbox',
  required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inspection_template_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_template_items_template ON public.inspection_template_items(template_id);

-- =============================================
-- 11. inspections
-- =============================================
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id),
  unit_id UUID REFERENCES public.units(id),
  inspector_id UUID NOT NULL REFERENCES auth.users(id),
  template_id UUID NOT NULL REFERENCES public.inspection_templates(id),
  status public.inspection_status NOT NULL DEFAULT 'scheduled',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_inspections_property ON public.inspections(property_id);
CREATE INDEX idx_inspections_inspector ON public.inspections(inspector_id);

-- =============================================
-- 12. inspection_responses
-- =============================================
CREATE TABLE public.inspection_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  template_item_id UUID NOT NULL REFERENCES public.inspection_template_items(id),
  response_value TEXT,
  flagged_issue BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inspection_responses ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_inspection_responses_inspection ON public.inspection_responses(inspection_id);

-- =============================================
-- 13. notification_events
-- =============================================
CREATE TABLE public.notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  channel TEXT NOT NULL DEFAULT 'in_app',
  event_type TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  read BOOLEAN NOT NULL DEFAULT false,
  title TEXT,
  body TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_notifications_recipient ON public.notification_events(recipient_id);
CREATE INDEX idx_notifications_read ON public.notification_events(recipient_id, read);

-- =============================================
-- 14. audit_logs
-- =============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);

-- =============================================
-- 15. reservation_events (TravelNet stub)
-- =============================================
CREATE TABLE public.reservation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_source TEXT,
  external_id TEXT,
  property_id UUID REFERENCES public.properties(id),
  unit_id UUID REFERENCES public.units(id),
  event_type TEXT NOT NULL,
  event_at TIMESTAMPTZ,
  payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reservation_events ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Trigger: auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Trigger: auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_staff_assignments_updated_at BEFORE UPDATE ON public.staff_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_inspection_templates_updated_at BEFORE UPDATE ON public.inspection_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_inspection_template_items_updated_at BEFORE UPDATE ON public.inspection_template_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_inspections_updated_at BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_inspection_responses_updated_at BEFORE UPDATE ON public.inspection_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- Storage: private bucket for task photos
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('task-photos', 'task-photos', false);
