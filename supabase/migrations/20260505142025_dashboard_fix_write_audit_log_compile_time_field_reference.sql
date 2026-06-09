-- ============================================================================
-- RESYNC FROM PROD (2026-06-09 L10 wave 4)
-- This migration was applied directly via the Supabase dashboard SQL editor on
-- the production project (hfpvnsbiewudpqbtlvte) but never committed to the
-- repo. Pulled back from supabase_migrations.schema_migrations.statements via
-- MCP execute_sql so the repo schema matches prod for disaster recovery.
-- ============================================================================

-- Bug: PL/pgSQL parses NEW.created_by / NEW.title at trigger-fire time before
-- evaluating the CASE branch, so any INSERT into a table without those columns
-- (e.g. vendors, properties, units) fails with "record \"new\" has no field
-- \"created_by\"". The CASE only protected at logical level, not parse level.
-- Split into per-table branches that only reference fields that actually exist
-- on the affected table.

CREATE OR REPLACE FUNCTION public.write_audit_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'tasks' THEN
      INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, description, payload_json)
      VALUES (TG_TABLE_NAME, NEW.id, 'create', NEW.created_by,
        TG_TABLE_NAME || ' created',
        jsonb_build_object('title', NEW.title));
    ELSE
      INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, description, payload_json)
      VALUES (TG_TABLE_NAME, NEW.id, 'create', auth.uid(),
        TG_TABLE_NAME || ' created',
        '{}'::jsonb);
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF TG_TABLE_NAME = 'tasks' THEN
      IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, description, payload_json)
        VALUES ('tasks', NEW.id, 'status_change', auth.uid(),
          'Task status: ' || OLD.status || ' -> ' || NEW.status,
          jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'title', NEW.title));
      END IF;
      IF OLD.priority IS DISTINCT FROM NEW.priority THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, description, payload_json)
        VALUES ('tasks', NEW.id, 'priority_change', auth.uid(),
          'Task priority: ' || OLD.priority || ' -> ' || NEW.priority,
          jsonb_build_object('old_priority', OLD.priority, 'new_priority', NEW.priority, 'title', NEW.title));
      END IF;
      IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, description, payload_json)
        VALUES ('tasks', NEW.id, 'reassign', auth.uid(),
          'Task reassigned',
          jsonb_build_object('old_assignee', OLD.assigned_to, 'new_assignee', NEW.assigned_to, 'title', NEW.title));
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (entity_type, entity_id, action, actor_id, description)
    VALUES (TG_TABLE_NAME, OLD.id, 'delete', auth.uid(), TG_TABLE_NAME || ' deleted');
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$function$;

COMMENT ON FUNCTION public.write_audit_log() IS
  'Audit-log trigger. Per-table branches keep field references valid for tables that lack created_by/title (vendors, properties, units, etc.). Fixed 2026-05-05.';
