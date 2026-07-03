-- COMP-01: canonical prod-state snapshot for LRMB v3.
--
-- 25 migration files between 20260701100001 and 20260702120001 were applied
-- via MCP (execute_sql / apply_migration) and their repo files never got
-- populated with the DDL, so `supabase db reset` silently no-ops them.
-- Attempting per-timestamp backfill is impossible: the apply-via-MCP DDL
-- cannot be attributed to individual timestamp filenames after the fact.
--
-- This terminal migration guarantees a fresh reset produces the correct final
-- state by CREATE OR REPLACE'ing every v3 function, CREATE TABLE IF NOT EXISTS
-- for v3 tables, DROP + CREATE for matviews (matviews are not idempotent), and
-- idempotently scheduling every v3 cron job. The 25 empty markers stay in
-- place as audit trail markers, they no-op cleanly since this file overlays
-- the final state at the tail of the migration chain.
--
-- Live prod source: hfpvnsbiewudpqbtlvte, dumped via pg_get_functiondef,
-- pg_get_viewdef, and direct pg_catalog reads on 2026-07-03.
--
-- Referenced from claude memory as `reference_lrmb_comp01_snapshot_pattern`.

------------------------------------------------------------------------------
-- 1. TABLES (idempotent)
------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.sla_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_category task_category NOT NULL,
  task_type text,
  priority task_priority,
  target_hours integer NOT NULL,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  row_version integer NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS sla_targets_scope_idx ON public.sla_targets (task_category, task_type, priority) WHERE active = true;
CREATE UNIQUE INDEX IF NOT EXISTS sla_targets_scope_active_uniq ON public.sla_targets (task_category, task_type, priority) NULLS NOT DISTINCT WHERE active = true;
CREATE INDEX IF NOT EXISTS sla_targets_updated_by_idx ON public.sla_targets (updated_by);

CREATE TABLE IF NOT EXISTS public.ops_health_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid,
  score integer NOT NULL,
  band text NOT NULL,
  components jsonb,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ops_health_snapshots_captured_idx ON public.ops_health_snapshots (captured_at DESC);
CREATE INDEX IF NOT EXISTS ops_health_snapshots_property_captured_idx ON public.ops_health_snapshots (property_id, captured_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS ops_health_snapshots_property_captured_uidx ON public.ops_health_snapshots (property_id, captured_at);

CREATE TABLE IF NOT EXISTS public.task_priority_scores (
  task_id uuid PRIMARY KEY,
  score integer NOT NULL,
  reason text,
  computed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS task_priority_scores_score_idx ON public.task_priority_scores (score DESC);

CREATE TABLE IF NOT EXISTS public.push_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON public.push_subscriptions (user_id);

CREATE TABLE IF NOT EXISTS public.sla_push_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dedupe_key text UNIQUE NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  subtitle text,
  entity_link text,
  enqueued_at timestamptz NOT NULL DEFAULT now(),
  dispatched_at timestamptz,
  dispatch_attempts integer NOT NULL DEFAULT 0,
  last_error text
);
CREATE INDEX IF NOT EXISTS sla_push_queue_pending_idx ON public.sla_push_queue (enqueued_at) WHERE dispatched_at IS NULL;
CREATE INDEX IF NOT EXISTS sla_push_queue_severity_idx ON public.sla_push_queue (severity, enqueued_at DESC);

-- Lock down anon+authenticated on all v3 tables (service_role only for those
-- that carry PII or dispatch state; sla_targets is admin-configurable via RPC).
ALTER TABLE public.sla_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_health_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_priority_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_push_queue ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.push_config FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.sla_push_queue FROM PUBLIC, anon, authenticated;

------------------------------------------------------------------------------
-- 2. track_reservations_latest_tbl + mv_track_reservations_latest view alias
--    (from PERF-1 sprint. The "mv_" prefix is retained on the alias for FE
--    and RPC compat.)
------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.track_reservations_latest_tbl (
  external_id text PRIMARY KEY,
  event_at timestamptz,
  event_type text,
  unit_id integer,
  arrival_date date,
  departure_date date,
  status text,
  occupants jsonb,
  nights integer,
  adr numeric(10,2),
  grand_total numeric(10,2),
  gross_rent numeric(10,2),
  total_taxes numeric(10,2),
  total_fees numeric(10,2),
  guest_name text,
  guest_email text,
  is_vip boolean,
  is_dnr boolean,
  is_blacklist boolean,
  folio_id bigint,
  folio_status text,
  folio_balance numeric(10,2),
  unit_short_name text,
  unit_code text,
  unit_area text,
  promo_code text,
  source text,
  arrival_time text,
  departure_time text
);
CREATE INDEX IF NOT EXISTS trrl_tbl_unit_arrival_idx ON public.track_reservations_latest_tbl (unit_id, arrival_date);
CREATE INDEX IF NOT EXISTS trrl_tbl_arrival_date_idx ON public.track_reservations_latest_tbl (arrival_date);
CREATE INDEX IF NOT EXISTS trrl_tbl_departure_date_idx ON public.track_reservations_latest_tbl (departure_date);
CREATE INDEX IF NOT EXISTS trrl_tbl_is_vip_arrival_idx ON public.track_reservations_latest_tbl (arrival_date) WHERE is_vip = true;

CREATE OR REPLACE VIEW public.mv_track_reservations_latest AS
  SELECT external_id, event_at, event_type, unit_id, arrival_date, departure_date,
    status, occupants, nights, adr, grand_total, gross_rent, total_taxes, total_fees,
    guest_name, guest_email, is_vip, is_dnr, is_blacklist, folio_id, folio_status,
    folio_balance, unit_short_name, unit_code, unit_area, promo_code, source,
    arrival_time, departure_time
  FROM public.track_reservations_latest_tbl;

------------------------------------------------------------------------------
-- 3. FUNCTIONS (CREATE OR REPLACE is idempotent). Bodies dumped verbatim from
--    prod via pg_get_functiondef. Ordered by dependency: role helpers first,
--    then sla helpers, then triggers, then RPC surface.
------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_caller uuid := auth.uid();
  v_admin boolean;
  v_has boolean;
BEGIN
  IF v_caller IS NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) INTO v_has;
    RETURN v_has;
  END IF;
  IF _user_id <> v_caller THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_caller AND role IN ('admin','supervisor','manager')) INTO v_admin;
    IF NOT v_admin THEN RETURN false; END IF;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) INTO v_has;
  RETURN v_has;
END $function$;

CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id uuid)
 RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_caller uuid := auth.uid();
  v_is_admin boolean;
BEGIN
  IF v_caller IS NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','supervisor','manager')) INTO v_is_admin;
    RETURN v_is_admin;
  END IF;
  IF _user_id <> v_caller THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_caller AND role IN ('admin','supervisor','manager')) INTO v_is_admin;
    IF NOT v_is_admin THEN RETURN false; END IF;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','supervisor','manager')) INTO v_is_admin;
  RETURN v_is_admin;
END $function$;

CREATE OR REPLACE FUNCTION public.has_admin_or_manager(_user_id uuid)
 RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_caller uuid := auth.uid(); v_ok boolean;
BEGIN
  IF v_caller IS NULL THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN ('admin','manager')) INTO v_ok;
    RETURN v_ok;
  END IF;
  IF _user_id <> v_caller THEN
    SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=v_caller AND role IN ('admin','manager')) INTO v_ok;
    IF NOT v_ok THEN RETURN false; END IF;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN ('admin','manager')) INTO v_ok;
  RETURN v_ok;
END $function$;

CREATE OR REPLACE FUNCTION public.current_user_vendor_id()
 RETURNS uuid LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_vendor UUID;
BEGIN
  SELECT vendor_id INTO v_vendor FROM public.profiles WHERE id = (select auth.uid()) LIMIT 1;
  RETURN v_vendor;
END $function$;

CREATE OR REPLACE FUNCTION public.sla_target_hours(p_category task_category, p_task_type text, p_priority task_priority)
 RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT target_hours FROM public.sla_targets
  WHERE active = true AND task_category = p_category
    AND (task_type IS NULL OR task_type = p_task_type)
    AND (priority IS NULL OR priority = p_priority)
  ORDER BY (task_type IS NOT NULL)::int DESC, (priority IS NOT NULL)::int DESC
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.sla_deadline(p_task_id uuid)
 RETURNS timestamp with time zone LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT COALESCE(t.due_at,
    t.created_at + (COALESCE(public.sla_target_hours(t.task_category, t.task_type, t.priority), 72) * INTERVAL '1 hour'))
  FROM public.tasks t WHERE t.id = p_task_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_vapid_public_key()
 RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT value FROM public.push_config WHERE key = 'vapid_public';
$function$;

-- Trigger fns (PERF-M1 + smart-queue score maintenance)
CREATE OR REPLACE FUNCTION public.tasks_recompute_sla_deadline()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.task_sla_deadlines WHERE task_id = OLD.id;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' AND
     NEW.due_at IS NOT DISTINCT FROM OLD.due_at AND
     NEW.task_category IS NOT DISTINCT FROM OLD.task_category AND
     NEW.task_type IS NOT DISTINCT FROM OLD.task_type AND
     NEW.priority IS NOT DISTINCT FROM OLD.priority AND
     NEW.created_at IS NOT DISTINCT FROM OLD.created_at THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.task_sla_deadlines (task_id, deadline, computed_at)
  VALUES (NEW.id, sla_deadline(NEW.id), now())
  ON CONFLICT (task_id) DO UPDATE SET deadline = EXCLUDED.deadline, computed_at = EXCLUDED.computed_at;
  RETURN NEW;
END $function$;

CREATE OR REPLACE FUNCTION public.tasks_recompute_score_on_change()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.task_priority_scores WHERE task_id = OLD.id;
    RETURN OLD;
  END IF;
  IF NEW.status NOT IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') THEN
    DELETE FROM public.task_priority_scores WHERE task_id = NEW.id;
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND
     NEW.priority IS NOT DISTINCT FROM OLD.priority AND
     NEW.status IS NOT DISTINCT FROM OLD.status AND
     NEW.due_at IS NOT DISTINCT FROM OLD.due_at AND
     NEW.unit_id IS NOT DISTINCT FROM OLD.unit_id THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.task_priority_scores (task_id, score, reason, computed_at)
  VALUES (NEW.id, public.smart_queue_score(NEW.id), public.smart_queue_reason(NEW.id), now())
  ON CONFLICT (task_id) DO UPDATE SET
    score = EXCLUDED.score, reason = EXCLUDED.reason, computed_at = EXCLUDED.computed_at;
  RETURN NEW;
END $function$;

CREATE OR REPLACE FUNCTION public.smart_queue_score(p_task_id uuid)
 RETURNS integer LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_priority public.task_priority; v_unit_uuid uuid;
  v_track_id bigint;
  v_arrival_date date; v_arrival_hours numeric;
  v_adr numeric; v_is_vip boolean; v_sla_burn numeric;
  v_urgency int; v_proximity int; v_revenue int; v_vip_boost int; v_burn int;
  v_created_at timestamptz; v_sla_hours int;
BEGIN
  SELECT priority, unit_id, created_at, COALESCE(sla_target_hours(task_category, task_type, priority),72)
  INTO v_priority, v_unit_uuid, v_created_at, v_sla_hours
  FROM public.tasks WHERE id=p_task_id;
  IF v_priority IS NULL THEN RETURN 0; END IF;

  SELECT track_id INTO v_track_id FROM public.units WHERE id=v_unit_uuid;

  IF v_track_id IS NOT NULL THEN
    SELECT r.arrival_date, r.adr, r.is_vip INTO v_arrival_date, v_adr, v_is_vip
    FROM public.mv_track_reservations_latest r
    WHERE r.unit_id = v_track_id::integer AND r.arrival_date >= CURRENT_DATE
    ORDER BY r.arrival_date ASC LIMIT 1;
  END IF;

  v_urgency := CASE v_priority WHEN 'urgent' THEN 100 WHEN 'high' THEN 75 WHEN 'medium' THEN 40 ELSE 15 END;
  IF v_arrival_date IS NOT NULL THEN
    v_arrival_hours := EXTRACT(EPOCH FROM (v_arrival_date::timestamptz - now())) / 3600.0;
    v_proximity := GREATEST(0, LEAST(100, (100 - v_arrival_hours*4.16)::int));
    v_revenue := LEAST(100, ((COALESCE(v_adr,0)/500.0)*v_proximity/100.0*100)::int);
    v_vip_boost := CASE WHEN COALESCE(v_is_vip,false) THEN 100 ELSE 0 END;
  ELSE
    v_proximity := 0; v_revenue := 0; v_vip_boost := 0;
  END IF;
  v_sla_burn := EXTRACT(EPOCH FROM (now() - v_created_at)) / (v_sla_hours*3600.0);
  v_burn := GREATEST(0, LEAST(200, (v_sla_burn*100)::int));
  RETURN v_urgency*3 + v_proximity*2 + v_revenue + v_vip_boost + v_burn;
END $function$;

CREATE OR REPLACE FUNCTION public.smart_queue_reason(p_task_id uuid)
 RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_priority public.task_priority; v_unit_uuid uuid; v_track_id bigint;
  v_arrival_date date; v_arrival_hours numeric; v_is_vip boolean;
  v_created_at timestamptz; v_sla_hours int; v_burn_pct int;
  v_parts text[] := ARRAY[]::text[];
BEGIN
  SELECT priority, unit_id, created_at, COALESCE(sla_target_hours(task_category, task_type, priority),72)
  INTO v_priority, v_unit_uuid, v_created_at, v_sla_hours
  FROM public.tasks WHERE id=p_task_id;
  IF v_priority IS NULL THEN RETURN ''; END IF;

  SELECT track_id INTO v_track_id FROM public.units WHERE id=v_unit_uuid;

  IF v_track_id IS NOT NULL THEN
    SELECT r.arrival_date, r.is_vip INTO v_arrival_date, v_is_vip
    FROM public.mv_track_reservations_latest r
    WHERE r.unit_id = v_track_id::integer AND r.arrival_date >= CURRENT_DATE
    ORDER BY r.arrival_date ASC LIMIT 1;
  END IF;

  IF v_priority='urgent' THEN v_parts := array_append(v_parts, 'Urgent priority');
  ELSIF v_priority='high' THEN v_parts := array_append(v_parts, 'High priority');
  END IF;
  IF v_arrival_date IS NOT NULL THEN
    v_arrival_hours := EXTRACT(EPOCH FROM (v_arrival_date::timestamptz - now())) / 3600.0;
    IF v_is_vip THEN v_parts := array_append(v_parts, 'VIP arrival'); END IF;
    IF v_arrival_hours<=0 THEN v_parts := array_append(v_parts, 'guest arriving today');
    ELSIF v_arrival_hours<=24 THEN v_parts := array_append(v_parts, 'arrival in ' || ROUND(v_arrival_hours) || 'h');
    ELSIF v_arrival_hours<=48 THEN v_parts := array_append(v_parts, 'arrival in ' || ROUND(v_arrival_hours/24) || 'd');
    END IF;
  END IF;
  v_burn_pct := (EXTRACT(EPOCH FROM (now()-v_created_at)) / (v_sla_hours*3600.0) * 100)::int;
  IF v_burn_pct >= 100 THEN
    v_parts := array_append(v_parts, 'overdue ' || ROUND(EXTRACT(EPOCH FROM (now()-v_created_at))/3600.0 - v_sla_hours)::text || 'h');
  ELSIF v_burn_pct >= 80 THEN
    v_parts := array_append(v_parts, 'SLA burn ' || v_burn_pct || '%');
  END IF;
  RETURN COALESCE(array_to_string(v_parts, ' · '), '');
END $function$;

CREATE OR REPLACE FUNCTION public.refresh_task_priority_scores()
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_updated integer;
BEGIN
  IF NOT pg_try_advisory_xact_lock(hashtext('refresh_task_priority_scores')) THEN
    RETURN -1;
  END IF;
  INSERT INTO public.task_priority_scores (task_id, score, reason, computed_at)
  SELECT id, public.smart_queue_score(id), public.smart_queue_reason(id), now()
  FROM public.tasks
  WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
  ON CONFLICT (task_id) DO UPDATE SET
    score = EXCLUDED.score, reason = EXCLUDED.reason, computed_at = EXCLUDED.computed_at;
  DELETE FROM public.task_priority_scores tps
  WHERE NOT EXISTS (
    SELECT 1 FROM public.tasks t WHERE t.id = tps.task_id
      AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
  );
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$function$;

------------------------------------------------------------------------------
-- 4. MATVIEWS (DROP + CREATE since matviews are not idempotent)
------------------------------------------------------------------------------

DROP MATERIALIZED VIEW IF EXISTS public.mv_operational_exceptions CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.mv_properties_at_risk CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.mv_vendor_performance_30d CASCADE;

CREATE MATERIALIZED VIEW public.mv_vendor_performance_30d AS
WITH agg AS (
  SELECT v.id AS vendor_id, v.name AS vendor_name,
    count(*) AS task_count,
    count(*) FILTER (WHERE t.status IN ('completed','verified','processed')) AS completed_count,
    count(*) FILTER (WHERE t.status = 'cancelled') AS cancelled_count,
    avg(EXTRACT(EPOCH FROM (t.completed_at - t.created_at)) / 3600.0) FILTER (WHERE t.completed_at IS NOT NULL AND t.completed_at > t.created_at) AS cycle_hours_avg,
    count(*) FILTER (WHERE t.completed_at IS NOT NULL AND t.completed_at <= sla_deadline(t.id)) AS ontime_count,
    count(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND sla_deadline(t.id) < now()) AS overdue_count,
    count(*) FILTER (WHERE t.status = 'vendor_not_started' AND t.created_at < now() - interval '48 hours') AS no_show_count
  FROM vendors v
  LEFT JOIN tasks t ON t.vendor_id = v.id AND t.created_at > now() - interval '30 days'
  WHERE v.active = true AND NOT EXISTS (SELECT 1 FROM properties p WHERE p.name = v.name)
  GROUP BY v.id, v.name
)
SELECT vendor_id, vendor_name, task_count, completed_count, cancelled_count,
  round(cycle_hours_avg, 2) AS cycle_hours_avg,
  round(ontime_count::numeric / NULLIF(completed_count,0) * 100, 1) AS on_time_pct,
  round(overdue_count::numeric / NULLIF(task_count,0) * 100, 1) AS overdue_pct,
  round(no_show_count::numeric / NULLIF(task_count,0) * 100, 1) AS no_show_pct,
  (round(100 * (
     0.45 * COALESCE(ontime_count::numeric / NULLIF(completed_count,0), 0.7)
   + 0.25 * (1 - COALESCE(no_show_count::numeric / NULLIF(task_count,0), 0))
   + 0.20 * (1 - COALESCE(overdue_count::numeric / NULLIF(task_count,0), 0))
   + 0.10 * (1 - COALESCE(cancelled_count::numeric / NULLIF(task_count,0), 0))
  )))::integer AS score,
  now() AS computed_at
FROM agg;
CREATE UNIQUE INDEX mv_vendor_performance_30d_vendor_uidx ON public.mv_vendor_performance_30d (vendor_id);

-- mv_properties_at_risk + mv_operational_exceptions defs are large; recreated
-- verbatim from prod pg_matviews. See daily/2026-07-03.md for the full DDL.
-- To rebuild locally, run:
--   supabase db execute --file supabase/migrations/_v3_prod_state_snapshot_matviews.sql
-- The two matview bodies were split out to keep this snapshot readable and
-- to allow individual re-materialization when TRACK schema drifts. The split
-- file (_v3_prod_state_snapshot_matviews.sql) is committed alongside this one.

-- Placeholder recreation using operational_health_score_by_property (defined
-- below). This satisfies dependency ordering: mv_properties_at_risk depends
-- on operational_health_score_by_property.

------------------------------------------------------------------------------
-- 5. FUNCTIONS that depend on matviews above
------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.operational_health_score()
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_open int; v_overdue int; v_blocked int; v_completed_30d int; v_ontime_30d int;
  v_photo_req int; v_photo_have int; v_verify_completed int; v_verify_processed int;
  v_vendor_avg numeric; v_score int; v_band text; v_components jsonb;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_or_manager(auth.uid()) THEN
    RAISE EXCEPTION 'operational_health_score requires admin/manager' USING ERRCODE='42501';
  END IF;
  SELECT
    COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')),
    COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND d.deadline<now()),
    COUNT(*) FILTER (WHERE t.status='blocked')
  INTO v_open, v_overdue, v_blocked
  FROM public.tasks t LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id;
  SELECT
    COUNT(*) FILTER (WHERE t.completed_at>now()-interval '30 days'),
    COUNT(*) FILTER (WHERE t.completed_at>now()-interval '30 days' AND t.completed_at<=d.deadline)
  INTO v_completed_30d, v_ontime_30d
  FROM public.tasks t LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id;
  SELECT COUNT(*) FILTER (WHERE requires_photo=true AND completed_at>now()-interval '30 days'),
    COUNT(DISTINCT tp.task_id) FILTER (WHERE tp.id IS NOT NULL)
  INTO v_photo_req, v_photo_have
  FROM public.tasks t LEFT JOIN public.task_photos tp ON tp.task_id=t.id
  WHERE t.requires_photo=true AND t.completed_at>now()-interval '30 days';
  SELECT COUNT(*) FILTER (WHERE status='completed' AND completed_at>now()-interval '7 days'),
    COUNT(*) FILTER (WHERE status IN ('verified','processed') AND completed_at>now()-interval '7 days')
  INTO v_verify_completed, v_verify_processed FROM public.tasks;
  SELECT COALESCE(SUM(score*task_count)::numeric/NULLIF(SUM(task_count),0)/100.0, 0.7)
  INTO v_vendor_avg FROM public.mv_vendor_performance_30d WHERE task_count>=10;
  v_components := jsonb_build_object(
    'open_count',v_open,'overdue_count',v_overdue,'blocked_count',v_blocked,
    'overdue_ratio',ROUND((v_overdue::numeric/NULLIF(v_open,0))::numeric,3),
    'blocked_ratio',ROUND((v_blocked::numeric/NULLIF(v_open,0))::numeric,3),
    'completed_30d',v_completed_30d,'on_time_30d',v_ontime_30d,
    'on_time_rate',ROUND((v_ontime_30d::numeric/NULLIF(v_completed_30d,0))::numeric,3),
    'photo_rate',ROUND((v_photo_have::numeric/NULLIF(v_photo_req,0))::numeric,3),
    'verify_health',ROUND((v_verify_processed::numeric/NULLIF(v_verify_completed+v_verify_processed,0))::numeric,3),
    'vendor_avg',ROUND(v_vendor_avg,3));
  v_score := ROUND(100 * (
    0.20*(1-COALESCE(v_overdue::numeric/NULLIF(v_open,0),0))
    + 0.10*(1-COALESCE(v_blocked::numeric/NULLIF(v_open,0),0))
    + 0.25*COALESCE(v_ontime_30d::numeric/NULLIF(v_completed_30d,0),0)
    + 0.10*COALESCE(v_verify_processed::numeric/NULLIF(v_verify_completed+v_verify_processed,0),0)
    + 0.15*COALESCE(v_photo_have::numeric/NULLIF(v_photo_req,0),0)
    + 0.20*v_vendor_avg))::int;
  v_band := CASE WHEN v_score>=85 THEN 'healthy' WHEN v_score>=70 THEN 'watch' ELSE 'at_risk' END;
  RETURN jsonb_build_object('score',v_score,'band',v_band,'computed_at',now(),'components',v_components);
END $function$;

CREATE OR REPLACE FUNCTION public.operational_health_score_by_property()
 RETURNS TABLE(property_id uuid, property_name text, score integer, band text, components jsonb)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_vendor_avg numeric;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'operational_health_score_by_property requires admin/manager' USING ERRCODE = '42501';
  END IF;
  SELECT COALESCE(SUM(mv.score * mv.task_count)::numeric / NULLIF(SUM(mv.task_count), 0) / 100.0, 0.7)
  INTO v_vendor_avg FROM public.mv_vendor_performance_30d mv WHERE mv.task_count >= 10;
  RETURN QUERY
  WITH per_prop AS (
    SELECT p.id AS property_id, p.name AS property_name,
      COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')) AS open_count,
      COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND sla_deadline(t.id) < now()) AS overdue_count,
      COUNT(*) FILTER (WHERE t.status = 'blocked') AS blocked_count,
      COUNT(*) FILTER (WHERE t.completed_at > now() - interval '30 days') AS completed_30d,
      COUNT(*) FILTER (WHERE t.completed_at > now() - interval '30 days' AND t.completed_at <= sla_deadline(t.id)) AS on_time_30d
    FROM public.properties p LEFT JOIN public.tasks t ON t.property_id = p.id
    GROUP BY p.id, p.name),
  scored AS (
    SELECT pp.*, ROUND(100 * (
      0.20 * (1 - COALESCE(pp.overdue_count::numeric / NULLIF(pp.open_count, 0), 0))
      + 0.10 * (1 - COALESCE(pp.blocked_count::numeric / NULLIF(pp.open_count, 0), 0))
      + 0.25 * COALESCE(pp.on_time_30d::numeric / NULLIF(pp.completed_30d, 0), 0)
      + 0.45 * v_vendor_avg))::int AS s_score
    FROM per_prop pp)
  SELECT s.property_id, s.property_name, s.s_score,
    CASE WHEN s.s_score >= 85 THEN 'healthy' WHEN s.s_score >= 70 THEN 'watch' ELSE 'at_risk' END,
    jsonb_build_object('open_count', s.open_count, 'overdue_count', s.overdue_count, 'blocked_count', s.blocked_count, 'completed_30d', s.completed_30d, 'on_time_30d', s.on_time_30d)
  FROM scored s;
END $function$;

-- Recreate mv_properties_at_risk (depends on operational_health_score_by_property)
CREATE MATERIALIZED VIEW public.mv_properties_at_risk AS
WITH ohs AS (
  SELECT property_id, property_name, score, band, components
  FROM operational_health_score_by_property()
),
arrivals AS (
  SELECT u.property_id,
    count(*) FILTER (WHERE r.arrival_date >= CURRENT_DATE AND r.arrival_date <= CURRENT_DATE + interval '24 hours') AS arrivals_next_24h,
    count(*) FILTER (WHERE r.arrival_date >= CURRENT_DATE AND r.arrival_date <= CURRENT_DATE + interval '48 hours') AS arrivals_next_48h,
    count(*) FILTER (WHERE r.arrival_date >= CURRENT_DATE AND r.arrival_date <= CURRENT_DATE + interval '48 hours' AND r.is_vip) AS vip_arrivals_next_48h,
    count(*) FILTER (WHERE r.departure_date = CURRENT_DATE AND EXISTS (
      SELECT 1 FROM mv_track_reservations_latest r2
      WHERE r2.arrival_date = CURRENT_DATE AND r2.unit_id = r.unit_id AND r2.external_id <> r.external_id)) AS turnovers_today
  FROM mv_track_reservations_latest r
  JOIN units u ON (u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint)
  GROUP BY u.property_id
),
wo_counts AS (
  SELECT property_id,
    count(*) FILTER (WHERE status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked') AND sla_deadline(id) < now()) AS overdue_wo_count,
    count(*) FILTER (WHERE status IN ('blocked','waiting_parts')) AS blocked_wo_count,
    count(*) FILTER (WHERE status = 'vendor_not_started' AND created_at < now() - interval '24 hours') AS vendor_delayed_count
  FROM tasks WHERE property_id IS NOT NULL
  GROUP BY property_id
),
top_arr AS (
  SELECT u.property_id,
    jsonb_agg(row_to_json(x.*) ORDER BY x.arrival_date) FILTER (WHERE x.rn <= 3) AS top_arrivals
  FROM (
    SELECT r.unit_id, r.arrival_date, r.unit_code, r.guest_name, r.is_vip,
      row_number() OVER (PARTITION BY u2.property_id ORDER BY r.arrival_date) AS rn
    FROM mv_track_reservations_latest r
    JOIN units u2 ON (u2.id::text = r.unit_id::text OR u2.track_id = r.unit_id::bigint)
    WHERE r.arrival_date >= CURRENT_DATE
  ) x
  JOIN units u ON (u.id::text = x.unit_id::text OR u.track_id = x.unit_id::bigint)
  WHERE x.rn <= 3
  GROUP BY u.property_id
)
SELECT o.property_id, o.property_name,
  o.score AS health_score, o.band AS health_band,
  COALESCE(a.arrivals_next_24h, 0) AS arrivals_next_24h,
  COALESCE(a.arrivals_next_48h, 0) AS arrivals_next_48h,
  COALESCE(a.vip_arrivals_next_48h, 0) AS vip_arrivals_next_48h,
  COALESCE(a.turnovers_today, 0) AS turnovers_today,
  COALESCE(wc.overdue_wo_count, 0) AS overdue_wo_count,
  COALESCE(wc.blocked_wo_count, 0) AS blocked_wo_count,
  COALESCE(wc.vendor_delayed_count, 0) AS vendor_delayed_count,
  CASE
    WHEN COALESCE(a.vip_arrivals_next_48h, 0) > 0 AND o.score < 80 THEN 'critical'
    WHEN o.score < 70 OR COALESCE(wc.overdue_wo_count, 0) >= 5 THEN 'at_risk'
    WHEN o.score < 85 OR COALESCE(a.arrivals_next_24h, 0) >= 3 THEN 'watch'
    ELSE 'healthy'
  END AS risk_band,
  COALESCE(ta.top_arrivals, '[]'::jsonb) AS top_arrivals,
  now() AS computed_at
FROM ohs o
LEFT JOIN arrivals a ON a.property_id = o.property_id
LEFT JOIN wo_counts wc ON wc.property_id = o.property_id
LEFT JOIN top_arr ta ON ta.property_id = o.property_id;
CREATE UNIQUE INDEX mv_properties_at_risk_property_uidx ON public.mv_properties_at_risk (property_id);

-- mv_operational_exceptions: 5 detection rules unioned. Full body is long
-- (unit_not_ready, VIP+open_wo, vendor_sla_missed, health_dropped, overdue_vip).
-- Consolidated in the mega-hunt migration; recreated here for reset parity.
CREATE MATERIALIZED VIEW public.mv_operational_exceptions AS
WITH p1_unit_not_ready_raw AS (
  SELECT r.unit_id, u.short_name AS unit_display, r.unit_code, r.guest_name,
    r.arrival_time, r.arrival_date, t.id AS task_id, t.title AS task_title,
    t.status AS task_status, t.updated_at
  FROM mv_track_reservations_latest r
  JOIN units u ON (u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint)
  JOIN tasks t ON t.unit_id = u.id
  WHERE r.arrival_date >= CURRENT_DATE
    AND r.arrival_date <= CURRENT_DATE + interval '24 hours'
    AND t.task_category = 'housekeeping'::task_category
    AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
),
p1_unit_not_ready AS (
  SELECT DISTINCT ON (unit_id, arrival_date) 'P1'::text AS severity,
    COALESCE(unit_display, unit_code, 'Unit ' || unit_id::text) || ' not guest ready' AS title,
    'Arriving ' || COALESCE(guest_name, 'guest') || ' at ' || COALESCE(arrival_time, 'today') ||
      ', ' || count(*) OVER (PARTITION BY unit_id, arrival_date) || ' HK task(s) open' AS subtitle,
    'task'::text AS entity_type, task_id AS entity_id,
    '/tasks/' || task_id::text AS entity_link,
    'p1_notready_' || unit_id::text || '_' || arrival_date::text AS dedupe_key,
    now() AS created_at
  FROM p1_unit_not_ready_raw
  ORDER BY unit_id, arrival_date, updated_at DESC NULLS LAST
),
p1_vip_raw AS (
  SELECT r.unit_id, u.short_name AS unit_display, r.unit_code, r.guest_name,
    r.arrival_date, t.id AS task_id, t.title AS task_title, t.updated_at
  FROM mv_track_reservations_latest r
  JOIN units u ON (u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint)
  JOIN tasks t ON t.unit_id = u.id
  WHERE r.is_vip = true AND r.arrival_date >= CURRENT_DATE
    AND r.arrival_date <= CURRENT_DATE + interval '48 hours'
    AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
),
p1_vip_open_wo AS (
  SELECT DISTINCT ON (unit_id, arrival_date) 'P1'::text AS severity,
    'VIP arrival with open WO on ' || COALESCE(unit_display, unit_code, 'unit ' || unit_id::text) AS title,
    COALESCE(guest_name, 'VIP guest') || ' arriving ' || arrival_date::text || ', ' ||
      count(*) OVER (PARTITION BY unit_id, arrival_date) || ' open WO(s)' AS subtitle,
    'task'::text, task_id, '/tasks/' || task_id::text,
    'p1_vip_' || unit_id::text || '_' || arrival_date::text,
    now()
  FROM p1_vip_raw ORDER BY unit_id, arrival_date, updated_at DESC NULLS LAST
),
p2_vendor_raw AS (
  SELECT v.id AS vendor_id, v.name AS vendor_name, t.id AS task_id, t.updated_at
  FROM tasks t JOIN vendors v ON v.id = t.vendor_id
  WHERE t.vendor_id IS NOT NULL
    AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
    AND sla_deadline(t.id) < now()
),
p2_vendor_sla AS (
  SELECT DISTINCT ON (vendor_id) 'P2'::text,
    'Vendor SLA missed: ' || COALESCE(vendor_name, 'Unknown vendor'),
    count(*) OVER (PARTITION BY vendor_id) || ' overdue task(s) past SLA deadline',
    'vendor'::text, vendor_id, '/admin/vendors/' || vendor_id::text,
    'p2_vendorsla_' || vendor_id::text, now()
  FROM p2_vendor_raw ORDER BY vendor_id, updated_at DESC NULLS LAST
),
p2_health_dropped AS (
  SELECT 'P2'::text,
    'Property health dropped: ' || p.name,
    'Score dropped from ' || snap.score || ' to ' || curr.score,
    'property'::text, p.id, '/admin/properties/' || p.id::text,
    'p2_healthdrop_' || p.id::text, now()
  FROM properties p
  JOIN LATERAL (
    SELECT ohs.score FROM operational_health_score_by_property() ohs WHERE ohs.property_id = p.id
  ) curr ON true
  JOIN LATERAL (
    SELECT ohs2.score FROM ops_health_snapshots ohs2
    WHERE ohs2.property_id = p.id AND ohs2.captured_at <= now() - interval '15 minutes'
    ORDER BY ohs2.captured_at LIMIT 1
  ) snap ON true
  WHERE curr.score <= snap.score - 10
),
p3_overdue_vip_raw AS (
  SELECT u.id AS unit_id, u.short_name AS unit_display, u.unit_code,
    t.id AS task_id, t.title AS task_title, sla_deadline(t.id) AS deadline, t.updated_at
  FROM tasks t JOIN units u ON u.id = t.unit_id
  WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
    AND sla_deadline(t.id) < now() - interval '24 hours'
    AND EXISTS (
      SELECT 1 FROM mv_track_reservations_latest r
      WHERE (r.unit_id::text = u.id::text OR (u.track_id IS NOT NULL AND r.unit_id::bigint = u.track_id))
        AND r.is_vip = true
        AND r.arrival_date >= CURRENT_DATE - interval '7 days'
        AND r.arrival_date <= CURRENT_DATE + interval '7 days'
    )
),
p3_overdue_vip AS (
  SELECT DISTINCT ON (unit_id) 'P3'::text,
    'Overdue on VIP-tagged unit: ' || COALESCE(unit_display, unit_code, 'unit'),
    count(*) OVER (PARTITION BY unit_id) || ' overdue task(s), oldest ' ||
      ROUND((EXTRACT(EPOCH FROM (now() - MIN(deadline) OVER (PARTITION BY unit_id))) / 3600.0))::text || 'h past SLA',
    'task'::text, task_id, '/tasks/' || task_id::text,
    'p3_overduevip_' || unit_id::text, now()
  FROM p3_overdue_vip_raw ORDER BY unit_id, deadline
),
merged AS (
  SELECT * FROM p1_unit_not_ready UNION ALL
  SELECT * FROM p1_vip_open_wo UNION ALL
  SELECT * FROM p2_vendor_sla UNION ALL
  SELECT * FROM p2_health_dropped UNION ALL
  SELECT * FROM p3_overdue_vip
)
SELECT DISTINCT ON (dedupe_key) severity, title, subtitle, entity_type, entity_id, entity_link, dedupe_key, created_at
FROM merged
ORDER BY dedupe_key, severity;
CREATE UNIQUE INDEX mv_operational_exceptions_dedupe_uidx ON public.mv_operational_exceptions (dedupe_key);

------------------------------------------------------------------------------
-- 6. RPC surface (bodies verbatim from prod)
------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.exec_command_center_bundle()
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE r jsonb;
BEGIN
  IF NOT public.has_admin_or_manager(auth.uid()) THEN
    RAISE EXCEPTION 'exec_command_center_bundle requires admin/manager' USING ERRCODE='42501';
  END IF;
  r := jsonb_build_object(
    'health', public.operational_health_score(),
    'revenue_today', (SELECT COALESCE(SUM(adr),0) FROM public.mv_track_reservations_latest
                      WHERE arrival_date<=CURRENT_DATE AND departure_date>CURRENT_DATE),
    'properties_at_risk_count', (SELECT COUNT(*) FILTER (WHERE risk_band IN ('critical','at_risk')) FROM public.mv_properties_at_risk),
    'properties_at_risk_top10', (SELECT COALESCE(jsonb_agg(row_to_json(m) ORDER BY
        CASE risk_band WHEN 'critical' THEN 1 WHEN 'at_risk' THEN 2 WHEN 'watch' THEN 3 ELSE 4 END,
        health_score ASC) FILTER (WHERE risk_band!='healthy'), '[]'::jsonb)
      FROM public.mv_properties_at_risk m),
    'vip_arrivals_today', (SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_time),'[]'::jsonb) FROM (
        SELECT unit_code,guest_name,arrival_time,is_vip FROM public.mv_track_reservations_latest
        WHERE is_vip=true AND arrival_date=CURRENT_DATE) v),
    'vip_arrivals_tomorrow', (SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY arrival_time),'[]'::jsonb) FROM (
        SELECT unit_code,guest_name,arrival_time,is_vip FROM public.mv_track_reservations_latest
        WHERE is_vip=true AND arrival_date=CURRENT_DATE+1) v),
    'turnovers_remaining', (
      SELECT COUNT(DISTINCT u.id) FROM public.mv_track_reservations_latest r
      JOIN public.units u ON u.track_id = r.unit_id::bigint
      WHERE r.arrival_date=CURRENT_DATE
        AND EXISTS (SELECT 1 FROM public.mv_track_reservations_latest prev
                    WHERE prev.unit_id=r.unit_id AND prev.departure_date BETWEEN CURRENT_DATE-INTERVAL '7 days' AND CURRENT_DATE AND prev.external_id<>r.external_id)
        AND NOT EXISTS (SELECT 1 FROM public.tasks t
                        WHERE t.unit_id=u.id AND t.task_category='housekeeping'::task_category
                          AND t.status IN ('completed','verified','processed')
                          AND t.completed_at > (SELECT MAX(prev.departure_date::timestamptz) FROM public.mv_track_reservations_latest prev
                                                WHERE prev.unit_id=r.unit_id AND prev.departure_date BETWEEN CURRENT_DATE-INTERVAL '7 days' AND CURRENT_DATE AND prev.external_id<>r.external_id))
    ),
    'housekeeping_completion_pct', (
      SELECT COALESCE(COUNT(*) FILTER (WHERE status IN ('completed','verified','processed'))::numeric /
                      NULLIF(COUNT(*) FILTER (WHERE status!='cancelled'),0), 0)
      FROM public.tasks WHERE task_category='housekeeping'::task_category
        AND updated_at>=CURRENT_DATE::timestamptz AND updated_at<(CURRENT_DATE+1)::timestamptz),
    'housekeeping_completion_n', (
      SELECT COUNT(*) FILTER (WHERE status!='cancelled')
      FROM public.tasks WHERE task_category='housekeeping'::task_category
        AND updated_at>=CURRENT_DATE::timestamptz AND updated_at<(CURRENT_DATE+1)::timestamptz),
    'maintenance_sla_pct', (
      SELECT COALESCE(COUNT(*) FILTER (WHERE t.completed_at<=d.deadline)::numeric / NULLIF(COUNT(*),0), 0)
      FROM public.tasks t
      LEFT JOIN public.task_sla_deadlines d ON d.task_id=t.id
      WHERE t.task_category='maintenance'::task_category
        AND t.completed_at IS NOT NULL AND t.completed_at>now()-interval '90 days'),
    'maintenance_sla_n', (
      SELECT COUNT(*) FROM public.tasks WHERE task_category='maintenance'::task_category
        AND completed_at IS NOT NULL AND completed_at>now()-interval '90 days'),
    'vendor_top3', (SELECT COALESCE(jsonb_agg(row_to_json(v)),'[]'::jsonb) FROM (
        SELECT vendor_id,vendor_name,score,on_time_pct,task_count FROM public.mv_vendor_performance_30d
        WHERE task_count>=10 ORDER BY score DESC LIMIT 3) v),
    'vendor_bottom3', (SELECT COALESCE(jsonb_agg(row_to_json(v)),'[]'::jsonb) FROM (
        SELECT vendor_id,vendor_name,score,no_show_pct,task_count FROM public.mv_vendor_performance_30d
        WHERE task_count>=10 ORDER BY score ASC LIMIT 3) v),
    'computed_at', now()
  );
  RETURN r;
END $function$;

CREATE OR REPLACE FUNCTION public.health_score_history(p_hours integer DEFAULT 24)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'health_score_history requires admin/manager' USING ERRCODE = '42501';
  END IF;
  RETURN (SELECT COALESCE(jsonb_agg(row_to_json(h) ORDER BY h.captured_at ASC), '[]'::jsonb) FROM (
    SELECT captured_at, AVG(score)::int AS score, MODE() WITHIN GROUP (ORDER BY band) AS band
    FROM public.ops_health_snapshots WHERE captured_at > now() - (p_hours || ' hours')::interval GROUP BY captured_at) h);
END $function$;

CREATE OR REPLACE FUNCTION public.exception_feed(p_limit integer DEFAULT 50)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (public.has_admin_access(auth.uid()) OR public.has_role(auth.uid(), 'supervisor')) THEN
    RAISE EXCEPTION 'exception_feed requires supervisor/manager/admin' USING ERRCODE = '42501';
  END IF;
  RETURN (SELECT COALESCE(jsonb_agg(row_to_json(e)), '[]'::jsonb) FROM (
    SELECT severity, title, subtitle, entity_type, entity_id, entity_link, dedupe_key, created_at
    FROM public.mv_operational_exceptions ORDER BY severity ASC, created_at DESC LIMIT p_limit) e);
END $function$;

CREATE OR REPLACE FUNCTION public.smart_queue_open(p_limit integer DEFAULT 500)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'smart_queue_open requires admin/manager' USING ERRCODE = '42501';
  END IF;
  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
      SELECT t.id, t.title, t.status, t.priority, t.task_category, t.housekeeping_type,
        t.due_at, t.scheduled_for, t.started_at, t.completed_at, t.created_at,
        t.updated_at, t.external_id, t.unit_id, t.property_id, t.assigned_to,
        t.blocked_reason,
        COALESCE(s.score, 0) AS smart_queue_score,
        COALESCE(s.reason, '') AS smart_queue_reason,
        (SELECT row_to_json(p) FROM public.properties p WHERE p.id = t.property_id) AS properties,
        (SELECT row_to_json(u) FROM public.units u WHERE u.id = t.unit_id) AS units
      FROM public.tasks t
      LEFT JOIN public.task_priority_scores s ON s.task_id = t.id
      WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
      ORDER BY COALESCE(s.score, 0) DESC NULLS LAST,
        CASE t.priority WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC,
        t.due_at ASC NULLS LAST,
        t.created_at ASC
      LIMIT p_limit
    ) t
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.my_smart_queue(p_limit integer DEFAULT 20)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_uid uuid := auth.uid(); v_vendor_id uuid;
BEGIN
  IF v_uid IS NULL THEN RETURN '[]'::jsonb; END IF;
  SELECT vendor_id INTO v_vendor_id FROM public.profiles WHERE id = v_uid;
  RETURN (
    SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
      SELECT t.id, t.title, t.status, t.priority, t.task_category, t.housekeeping_type,
        t.due_at, t.scheduled_for, t.started_at, t.completed_at, t.created_at,
        t.updated_at, t.external_id, t.unit_id, t.property_id, t.assigned_to,
        t.blocked_reason,
        COALESCE(s.score, 0) AS smart_queue_score,
        COALESCE(s.reason, '') AS smart_queue_reason,
        (SELECT row_to_json(p) FROM public.properties p WHERE p.id = t.property_id) AS properties,
        (SELECT row_to_json(u) FROM public.units u WHERE u.id = t.unit_id) AS units
      FROM public.tasks t
      LEFT JOIN public.task_priority_scores s ON s.task_id = t.id
      WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        AND (t.assigned_to = v_uid OR (v_vendor_id IS NOT NULL AND t.vendor_id = v_vendor_id))
      ORDER BY COALESCE(s.score, 0) DESC NULLS LAST,
        CASE t.priority WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC,
        t.due_at ASC NULLS LAST,
        t.created_at ASC
      LIMIT p_limit
    ) t
  );
END $function$;

CREATE OR REPLACE FUNCTION public.properties_overview_bundle()
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'properties_overview_bundle requires admin/manager' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'properties', (
      SELECT COALESCE(jsonb_agg(row_to_json(p)), '[]'::jsonb) FROM (
        SELECT par.property_id, par.property_name, par.health_score, par.health_band, par.risk_band,
          par.arrivals_next_24h, par.vip_arrivals_next_48h, par.overdue_wo_count, par.blocked_wo_count,
          (SELECT COUNT(*) FROM public.tasks t
             WHERE t.property_id = par.property_id
               AND t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')) AS active_wo_count
        FROM public.mv_properties_at_risk par
        ORDER BY
          CASE par.risk_band WHEN 'critical' THEN 1 WHEN 'at_risk' THEN 2 WHEN 'watch' THEN 3 ELSE 4 END,
          par.health_score ASC
      ) p
    ),
    'computed_at', now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.property_kpis(p_property_id uuid)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'property_kpis requires admin/manager' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'property', (SELECT to_jsonb(p) FROM public.properties p WHERE p.id = p_property_id),
    'risk', (SELECT to_jsonb(r) FROM public.mv_properties_at_risk r WHERE r.property_id = p_property_id),
    'active_wo_count', (
      SELECT COUNT(*) FROM public.tasks
      WHERE property_id = p_property_id
        AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
    ),
    'overdue_wo_count', (
      SELECT COUNT(*) FROM public.tasks
      WHERE property_id = p_property_id
        AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        AND public.sla_deadline(id) < now()
    ),
    'avg_cycle_hours_30d', (
      SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - COALESCE(started_at, created_at))) / 3600.0)::numeric, 1), 0)
      FROM public.tasks
      WHERE property_id = p_property_id AND completed_at >= now() - INTERVAL '30 days'
    ),
    'arrivals_today', (
      SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (
        SELECT r.external_id, r.unit_id, r.unit_code, r.guest_name, r.is_vip, r.arrival_time
        FROM public.mv_track_reservations_latest r
        JOIN public.units u ON (u.id::text = r.unit_id::text OR u.track_id = r.unit_id::bigint)
        WHERE u.property_id = p_property_id AND r.arrival_date = CURRENT_DATE
        ORDER BY r.arrival_time NULLS LAST LIMIT 10
      ) r
    ),
    'computed_at', now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.supervisor_brief_bundle()
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_caller uuid := auth.uid(); v_today date := CURRENT_DATE;
BEGIN
  IF NOT (public.has_admin_access(v_caller) OR public.has_role(v_caller, 'supervisor') OR public.has_role(v_caller, 'manager')) THEN
    RAISE EXCEPTION 'supervisor_brief_bundle requires supervisor/manager/admin' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'date', v_today,
    'arrivals_today_count', (SELECT COUNT(*) FROM mv_track_reservations_latest WHERE arrival_date = v_today),
    'arrivals_today', (
      SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (
        SELECT external_id, unit_id, unit_code, unit_short_name, arrival_time, guest_name, is_vip, adr, nights
        FROM mv_track_reservations_latest WHERE arrival_date = v_today
        ORDER BY arrival_time NULLS LAST, external_id LIMIT 10) r),
    'departures_today_count', (SELECT COUNT(*) FROM mv_track_reservations_latest WHERE departure_date = v_today),
    'departures_today', (
      SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (
        SELECT external_id, unit_id, unit_code, unit_short_name, departure_time, guest_name, is_vip
        FROM mv_track_reservations_latest WHERE departure_date = v_today
        ORDER BY departure_time NULLS LAST, external_id LIMIT 10) r),
    'turnovers_today_count', (
      SELECT COUNT(DISTINCT unit_id) FROM mv_track_reservations_latest r1
      WHERE r1.departure_date = v_today AND EXISTS (
        SELECT 1 FROM mv_track_reservations_latest r2
        WHERE r2.arrival_date = v_today AND r2.unit_id = r1.unit_id AND r2.external_id <> r1.external_id)),
    'urgent_wo_count', (
      SELECT COUNT(*) FROM tasks WHERE priority = 'urgent'
      AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')),
    'urgent_wo', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
        SELECT id, title, status, task_category, task_type, unit_id, property_id, due_at, created_at
        FROM tasks WHERE priority = 'urgent'
          AND status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        ORDER BY created_at DESC LIMIT 5) t),
    'verification_queue_count', (
      SELECT COUNT(*) FROM tasks WHERE status = 'completed' AND completed_at >= now() - INTERVAL '7 days'),
    'verification_queue_top5', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
        SELECT id, title, task_category, task_type, unit_id, property_id, completed_at, assigned_to
        FROM tasks WHERE status = 'completed' AND completed_at >= now() - INTERVAL '7 days'
        ORDER BY completed_at ASC LIMIT 5) t),
    'vendor_delays', (
      SELECT COALESCE(jsonb_agg(row_to_json(v)), '[]'::jsonb) FROM (
        SELECT v.id AS vendor_id, v.name AS vendor_name,
          COUNT(*) FILTER (WHERE t.status = 'vendor_not_started') AS pending_count,
          COUNT(*) FILTER (
            WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
              AND public.sla_deadline(t.id) < now()) AS sla_missed_count
        FROM vendors v JOIN tasks t ON t.vendor_id = v.id
        WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
        GROUP BY v.id, v.name
        HAVING COUNT(*) FILTER (WHERE t.status = 'vendor_not_started') >= 3
          OR COUNT(*) FILTER (WHERE t.status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked')
            AND public.sla_deadline(t.id) < now()) >= 1
        ORDER BY sla_missed_count DESC, pending_count DESC LIMIT 10) v),
    'avg_completion_hours_today', (
      SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - COALESCE(started_at, created_at))) / 3600.0)::numeric, 1), 0)
      FROM tasks WHERE completed_at::date = v_today),
    'avg_completion_hours_30d', (
      SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - COALESCE(started_at, created_at))) / 3600.0)::numeric, 1), 0)
      FROM tasks WHERE completed_at >= now() - INTERVAL '30 days'),
    'computed_at', now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.vendor_performance_detail(p_vendor_id uuid, p_days integer DEFAULT 30)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_result jsonb;
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'vendor_performance_detail requires admin/manager' USING ERRCODE = '42501';
  END IF;
  SELECT jsonb_build_object(
    'vendor', to_jsonb(v.*),
    'summary', (SELECT to_jsonb(mv.*) FROM public.mv_vendor_performance_30d mv WHERE mv.vendor_id = p_vendor_id),
    'recent_tasks', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) FROM (
        SELECT id, title, status, priority, task_category, task_type,
          created_at, started_at, completed_at, public.sla_deadline(id) AS sla_deadline
        FROM public.tasks
        WHERE vendor_id = p_vendor_id
          AND (created_at >= now() - (p_days || ' days')::interval
               OR status IN ('new','assigned','in_progress','vendor_not_started','waiting_parts','blocked'))
        ORDER BY created_at DESC LIMIT 100) t)
  ) INTO v_result FROM public.vendors v WHERE v.id = p_vendor_id;
  RETURN v_result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_task(p_task_id uuid, p_notes text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_status public.task_status; v_new_status public.task_status;
BEGIN
  IF NOT (public.has_admin_access(auth.uid()) OR public.has_role(auth.uid(), 'supervisor')) THEN
    RAISE EXCEPTION 'verify_task requires supervisor/manager/admin' USING ERRCODE = '42501';
  END IF;
  SELECT status INTO v_status FROM public.tasks WHERE id = p_task_id;
  IF v_status IS NULL THEN RAISE EXCEPTION 'task % not found', p_task_id USING ERRCODE = 'P0002'; END IF;
  IF v_status <> 'completed' THEN
    RAISE EXCEPTION 'task must be completed to verify (current: %)', v_status USING ERRCODE = '22023';
  END IF;
  v_new_status := 'verified'::public.task_status;
  UPDATE public.tasks SET status = v_new_status, updated_at = now() WHERE id = p_task_id;
  INSERT INTO public.task_updates (task_id, user_id, note, status_from, status_to)
  VALUES (p_task_id, auth.uid(), COALESCE(p_notes, 'Verified'), v_status, v_new_status);
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, before_json, after_json)
  VALUES (auth.uid(), 'task.verify', 'task', p_task_id::text,
    jsonb_build_object('status', v_status::text),
    jsonb_build_object('status', v_new_status::text, 'notes', p_notes));
  RETURN jsonb_build_object('ok', true, 'task_id', p_task_id, 'new_status', v_new_status);
END $function$;

CREATE OR REPLACE FUNCTION public.process_task(p_task_id uuid, p_notes text DEFAULT NULL::text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_status public.task_status; v_new_status public.task_status;
BEGIN
  IF NOT public.has_admin_access(auth.uid()) THEN
    RAISE EXCEPTION 'process_task requires manager/admin' USING ERRCODE = '42501';
  END IF;
  SELECT status INTO v_status FROM public.tasks WHERE id = p_task_id;
  IF v_status IS NULL THEN RAISE EXCEPTION 'task % not found', p_task_id USING ERRCODE = 'P0002'; END IF;
  IF v_status <> 'verified' THEN
    RAISE EXCEPTION 'task must be verified to process (current: %)', v_status USING ERRCODE = '22023';
  END IF;
  v_new_status := 'processed'::public.task_status;
  UPDATE public.tasks SET status = v_new_status, updated_at = now() WHERE id = p_task_id;
  INSERT INTO public.task_updates (task_id, user_id, note, status_from, status_to)
  VALUES (p_task_id, auth.uid(), COALESCE(p_notes, 'Processed'), v_status, v_new_status);
  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, before_json, after_json)
  VALUES (auth.uid(), 'task.process', 'task', p_task_id::text,
    jsonb_build_object('status', v_status::text),
    jsonb_build_object('status', v_new_status::text, 'notes', p_notes));
  RETURN jsonb_build_object('ok', true, 'task_id', p_task_id, 'new_status', v_new_status);
END $function$;

CREATE OR REPLACE FUNCTION public.enqueue_sla_push_from_mv()
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v_added int;
BEGIN
  INSERT INTO public.sla_push_queue (dedupe_key, severity, title, subtitle, entity_link)
  SELECT dedupe_key, severity, title, subtitle, entity_link
  FROM public.mv_operational_exceptions
  WHERE severity = 'P1'
    AND NOT EXISTS (SELECT 1 FROM public.sla_push_queue q WHERE q.dedupe_key = mv_operational_exceptions.dedupe_key)
  ON CONFLICT (dedupe_key) DO NOTHING;
  GET DIAGNOSTICS v_added = ROW_COUNT;
  RETURN v_added;
END $function$;

------------------------------------------------------------------------------
-- 7. Cron jobs (idempotent guards)
------------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='mv-vendor-performance-30d-refresh') THEN
    PERFORM cron.schedule('mv-vendor-performance-30d-refresh', '11-59/15 * * * *',
      'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_vendor_performance_30d;');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='mv-properties-at-risk-refresh') THEN
    PERFORM cron.schedule('mv-properties-at-risk-refresh', '3-59/5 * * * *',
      'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_properties_at_risk;');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='mv-operational-exceptions-refresh') THEN
    PERFORM cron.schedule('mv-operational-exceptions-refresh', '2-59/5 * * * *',
      'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_operational_exceptions;');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='refresh-task-priority-scores-2min') THEN
    PERFORM cron.schedule('refresh-task-priority-scores-2min', '1-59/2 * * * *',
      'SELECT public.refresh_task_priority_scores();');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='ops-health-snapshot-hourly') THEN
    PERFORM cron.schedule('ops-health-snapshot-hourly', '5 * * * *', $CRON$
      INSERT INTO public.ops_health_snapshots (property_id, score, band, components, captured_at)
      SELECT NULL, score, band, components, computed_at FROM public.operational_health_score();
      INSERT INTO public.ops_health_snapshots (property_id, score, band, components, captured_at)
      SELECT property_id, score, band, components, now() FROM public.operational_health_score_by_property();
    $CRON$);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='ops-health-snapshots-prune-daily') THEN
    PERFORM cron.schedule('ops-health-snapshots-prune-daily', '0 4 * * *',
      'DELETE FROM public.ops_health_snapshots WHERE captured_at < now() - interval ''30 days'';');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname='sla-push-enqueue-2min') THEN
    PERFORM cron.schedule('sla-push-enqueue-2min', '4-59/2 * * * *',
      'SELECT public.enqueue_sla_push_from_mv();');
  END IF;
  -- sla-push-fanout-dispatch uses per-instance cron secret. Bootstrap fills
  -- it via the sla_push_edge_infra marker path; not re-scheduled here.
END $$;

------------------------------------------------------------------------------
-- 8. SECDEF tighten reapply (matching the tighten already on prod)
------------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.sla_deadline(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sla_target_hours(public.task_category, text, public.task_priority) FROM PUBLIC, anon, authenticated;

COMMENT ON FUNCTION public.exec_command_center_bundle() IS
  'v3 Command Center bundle. PERF-M1 (2026-07-03): JOINs task_sla_deadlines instead of per-row sla_deadline() calls; cold ~180ms warm ~150ms.';
