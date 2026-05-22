-- View for active damage claims surfaced on Tony's dashboard.
-- Existing schema (from 2026-05-05 Damage Claim SOP migrations) lives on
-- tasks.* columns: damage_classification, claim_status, claim_deadline_at,
-- claim_filed_amount, claim_approved_amount, claim_id, claim_provider.

DROP VIEW IF EXISTS public.v_operations_damage_claims;
CREATE VIEW public.v_operations_damage_claims
WITH (security_invoker = on)
AS
SELECT
  t.id AS task_id,
  t.external_id AS track_wo,
  t.title,
  t.damage_classification,
  t.claim_status,
  t.claim_filed_amount,
  t.claim_approved_amount,
  t.claim_id,
  t.claim_provider,
  t.claim_filed_at,
  t.claim_decided_at,
  t.claim_deadline_at,
  CASE
    WHEN t.claim_deadline_at IS NULL THEN NULL
    WHEN t.claim_deadline_at < NOW() THEN 'overdue'
    WHEN t.claim_deadline_at < NOW() + INTERVAL '3 days' THEN 'urgent'
    WHEN t.claim_deadline_at < NOW() + INTERVAL '7 days' THEN 'approaching'
    ELSE 'fine'
  END AS deadline_status,
  EXTRACT(EPOCH FROM (t.claim_deadline_at - NOW())) / 3600.0 AS hours_to_deadline,
  u.unit_code,
  p.name AS property,
  t.created_at AS task_created_at
FROM public.tasks t
LEFT JOIN public.units u ON u.id = t.unit_id
LEFT JOIN public.properties p ON p.id = t.property_id
WHERE t.damage_classification = 'guest_damage'
  AND (t.claim_status IN ('pending','filed') OR t.claim_status IS NULL)
ORDER BY
  CASE WHEN t.claim_deadline_at < NOW() THEN 0
       WHEN t.claim_deadline_at < NOW() + INTERVAL '3 days' THEN 1
       WHEN t.claim_deadline_at < NOW() + INTERVAL '7 days' THEN 2
       ELSE 3 END,
  t.claim_deadline_at NULLS LAST;

GRANT SELECT ON public.v_operations_damage_claims TO service_role;
GRANT SELECT ON public.v_operations_damage_claims TO authenticated;
COMMENT ON VIEW public.v_operations_damage_claims IS
'Active guest-damage claims (pending or filed). Surfaces deadline urgency for Tony dashboard and weekly report.';
