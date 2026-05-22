-- Metadata for two new edge functions deployed 2026-05-22:
--   1. track-webhook — real-time event receiver (dormant until Emma's TRACK
--      Support ticket activates webhooks for the LRMB tenant)
--   2. tony-weekly-report — Monday 09:00 UTC summary written to audit_logs

-- No table changes here. This migration documents intent + serves as the
-- repo-side record of the deploy. The cron job for tony-weekly-report was
-- already created via 20260522010000_tony_weekly_report_cron.sql (preceding
-- migration in this PR).

-- The track-webhook function intentionally runs with verify_jwt=false because
-- TRACK does NOT send a Supabase Bearer token. Security is enforced via the
-- optional TRACK_WEBHOOK_SECRET env var (HMAC-SHA256 over request body).
-- Until that secret is set, the receiver accepts all payloads (open during
-- setup with Emma; we tighten as soon as TRACK Support shares signing details).

SELECT 1;  -- migration placeholder
