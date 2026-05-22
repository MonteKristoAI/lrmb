# LRMB — Secrets & Share-Link Rotation Runbook

**Owner:** MonteKristo (Alex Srdic)
**Last verified:** 2026-05-22

This runbook covers two routine rotations + one emergency procedure.

---

## 1. Tony share-link rotation (every 30 days)

**Current live token:** issued 2026-05-20, expires **2026-06-18** (~27 days from initial issue)
**Where it lives:** `documents/MILAN-CLICK-BY-CLICK-2026-05-20.md` quick reference table

### When to rotate

- 5-7 days **before** expiry (so Tony's bookmark doesn't suddenly 401)
- Immediately if Tony reports the link doesn't work
- Immediately if the link is suspected leaked (forwarded to wrong person, posted publicly)

### How to rotate

```bash
# Step 1: Read the HMAC secret from the durable backup
HMAC_SECRET=$(cat "/home/milan/projects/MonteKristo Devs/clients/lrmb/.secrets/ops-view-hmac-secret.txt")

# Step 2: Mint a new token via the track-overview-token edge function
# (admin-only — RBAC-gated via has_admin_access RPC)
curl -X POST "https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-overview-token" \
  -H "Authorization: Bearer <YOUR_USER_JWT_AS_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{"viewer":"Tony","ttl_days":30}'

# Response will include:
#   {"token":"eyJpYXQi...", "url":"https://lrmb.vercel.app/operations?t=...", "exp":1782345600}

# Step 3: Send the new URL to Tony, ask him to update his bookmark.
# Step 4: Update documents/MILAN-CLICK-BY-CLICK-2026-05-20.md → "Active share link" row.
# Step 5: The OLD token continues to work until its original expiry — no need to invalidate
#         unless leak suspected. If invalidating needed, see HMAC rotation below.
```

### Verification

Open the new URL in incognito → should load `/operations` with all sections rendered.
Confirm via:
```bash
curl -sI "https://lrmb.vercel.app/operations?t=<NEW_TOKEN>" | head -3
# Expect: HTTP/2 200
```

---

## 2. HMAC secret rotation (every 90 days OR on suspected leak)

**Effect:** Invalidates ALL outstanding share-link tokens (Tony's, any others). Use carefully.

### When to rotate

- Every 90 days as routine hygiene
- Immediately if the HMAC secret is suspected leaked
- After staff turnover with access to the secret

### How to rotate

```bash
# Step 1: Generate new HMAC secret (32 random bytes, base64 encoded)
NEW_HMAC=$(openssl rand -base64 32)
echo "$NEW_HMAC"

# Step 2: Update Supabase function secret
curl -X POST \
  -H "Authorization: Bearer <SUPABASE_MANAGEMENT_TOKEN>" \
  -H "Content-Type: application/json" \
  "https://api.supabase.com/v1/projects/hfpvnsbiewudpqbtlvte/secrets" \
  -d "[{\"name\":\"OPS_VIEW_HMAC_SECRET\",\"value\":\"$NEW_HMAC\"}]"

# Step 3: Update local durable backup
echo "$NEW_HMAC" > "/home/milan/projects/MonteKristo Devs/clients/lrmb/.secrets/ops-view-hmac-secret.txt"
chmod 600 "/home/milan/projects/MonteKristo Devs/clients/lrmb/.secrets/ops-view-hmac-secret.txt"

# Step 4: Verify edge function picked up the new secret
# (Supabase secrets are hot-loaded — no redeploy needed)
curl -sI "https://lrmb.vercel.app/operations?t=<OLD_TOKEN>"
# Expect: 401 (proves old token is now invalid)

# Step 5: Mint a fresh token for Tony (per section 1 above)
# Step 6: Send new URL to Tony
# Step 7: Update MILAN-CLICK-BY-CLICK with new URL + new rotation date
```

### Emergency: revoke immediately without rotating

If a leak is confirmed and Tony's link should die ASAP without minting a new one:

```bash
# Set HMAC to a random value temporarily (locks everyone out)
curl -X POST \
  -H "Authorization: Bearer <SUPABASE_MANAGEMENT_TOKEN>" \
  -H "Content-Type: application/json" \
  "https://api.supabase.com/v1/projects/hfpvnsbiewudpqbtlvte/secrets" \
  -d '[{"name":"OPS_VIEW_HMAC_SECRET","value":"LOCKED-OUT-EMERGENCY-2026-05-XX"}]'
```

Then follow standard rotation when ready to reactivate.

---

## 3. TRACK API key (#51) rotation (if Emma rotates her side)

Currently we use Basic auth via `TRACK_API_KEY` + `TRACK_API_SECRET` Supabase secrets.

### When to rotate

- Emma notifies us TRACK key was regenerated
- Suspected compromise (the secrets are stored in cron commands — see `ROTATION-RUNBOOK.md` security note below)

### How to rotate

```bash
# Step 1: Get new key+secret from Emma
# Step 2: Update Supabase function secrets
curl -X POST \
  -H "Authorization: Bearer <SUPABASE_MANAGEMENT_TOKEN>" \
  -H "Content-Type: application/json" \
  "https://api.supabase.com/v1/projects/hfpvnsbiewudpqbtlvte/secrets" \
  -d '[
    {"name":"TRACK_API_KEY","value":"<NEW_KEY>"},
    {"name":"TRACK_API_SECRET","value":"<NEW_SECRET>"}
  ]'

# Step 3: Verify by triggering a manual track-poll
curl -X POST "https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-poll" \
  -H "Authorization: Bearer <SERVICE_ROLE_JWT>"
# Check audit_logs for the run severity
```

No cron command updates needed — edge function reads secrets at runtime.

---

## 4. Supabase service_role key (if Supabase rotates)

This is the secret embedded in cron commands. Rotation requires re-scheduling cron jobs.

### How to rotate (only if Supabase regenerates the service_role JWT)

```bash
# Step 1: Get new service_role JWT from Supabase dashboard
NEW_JWT="<NEW_JWT_VALUE>"

# Step 2: Unschedule + re-schedule all 3 crons with new JWT inline
psql <<SQL
SELECT cron.unschedule('track-poll-every-5min');
SELECT cron.unschedule('track-attachment-push-every-1min');
SELECT cron.unschedule('ops-health-monitor-every-15min');

SELECT cron.schedule('track-poll-every-5min', '*/5 * * * *', $$
  SELECT net.http_post(
    url := 'https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/track-poll',
    headers := jsonb_build_object('Content-Type','application/json','Authorization', 'Bearer $NEW_JWT'),
    body := jsonb_build_object('source','pg_cron'),
    timeout_milliseconds := 90000
  );
$$);

-- Same pattern for track-attachment-push (every minute, 50s timeout)
-- Same pattern for ops-health-monitor (every 15 min, 30s timeout)
SQL

# Step 3: Verify all 3 crons fire successfully within their cadence
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## Security note — why secrets are inlined in cron commands

Managed Supabase blocks `ALTER DATABASE postgres SET app.settings.X` for the migration role. The standard PostgreSQL pattern (read secret via `current_setting('app.settings.X')` in cron command) doesn't work.

**Inline secret in `cron.command` is acceptable because:**
- `cron.job` table is only readable by `postgres` superuser + `supabase_admin` — same blast radius as `pg_settings`
- A compromised role with `cron` access would have it either way
- Rotation procedure (above) handles this — no operational cost over the standard pattern

See `vault/wiki/patterns/pg-cron-managed-supabase-env-vars-inline-secrets.md` for the historical context.

---

## Quick reference

| Secret | Where stored | Rotation cadence |
|---|---|---|
| `OPS_VIEW_HMAC_SECRET` | Supabase secrets + `clients/lrmb/.secrets/ops-view-hmac-secret.txt` (chmod 600, gitignored) | Every 90 days OR on leak |
| Tony share-link token | Issued from HMAC, embedded in URL | Every 30 days OR on suspected forward |
| `TRACK_API_KEY` + `TRACK_API_SECRET` | Supabase secrets only | When Emma rotates her side |
| Supabase service_role JWT | Embedded in 3 cron commands | When Supabase regenerates (rare) |
| Management API token (`sbp_...`) | Local machine only | When Milan rotates personally |

---

## Verification checklist after any rotation

- [ ] Cron run succeeds within expected cadence
- [ ] `ops_health_check` `audit_logs` row severity stays `info`
- [ ] No new dead-letter photos in `task_photos`
- [ ] Tony's share link returns 200 (if HMAC didn't change) OR 401 then 200 with new token
- [ ] Update `documents/MILAN-CLICK-BY-CLICK-2026-05-20.md` quick reference table
