# L10 Sweep — Two items that need Milan personally (2026-05-29)

The 2026-05-29 L10 sweep landed 4 migrations + 7 edge-function redeploys.
Two findings cannot be self-served by the deploy pipeline and need Milan
to action.

## 1. Service-role JWT pasted in plaintext into every `cron.job` command

**Severity: P0 (data-exposure)**

`cron.job` rows 21, 22, 23, 24 (the four pg_cron entries that invoke our
edge functions over `net.http_post`) embed the **full service-role JWT**
inside the command body:

```sql
SELECT net.http_post(
  url => 'https://hfpvnsbiewudpqbtlvte.functions.supabase.co/track-poll',
  headers => '{"Authorization": "Bearer eyJhbGc...<full JWT>"}'::jsonb,
  ...
);
```

Decoded payload: `role=service_role, exp=2068316402` (year 2035).

Anyone with `SELECT` on `cron.job` reads the master key — that's the
postgres role, dashboard users with `pg_cron` extension UI access, future
cron-management tooling, and anything that runs `pg_dump --schema=cron`.

**What Milan needs to do:**

1. **Rotate the service-role JWT** in the Supabase dashboard
   (`Settings → API → Generate new keys`). All edge-function envs that
   reference it auto-rebind. Cron jobs will need their command bodies
   regenerated.
2. **Move the JWT to `vault.secrets`** and rewrite each cron command to
   read it at runtime, the same way `CRON_SECRET` is already vaulted
   (see [[reference_supabase_cloud_no_alter_database]] and
   `migration 20260524*_*` for the existing pattern). Skeleton:

```sql
-- Stash once
SELECT vault.create_secret('eyJ...', 'service_role_jwt');

-- Rewrite each cron command
SELECT cron.schedule('track-poll', '*/5 * * * *', $$
  SELECT net.http_post(
    url => 'https://hfpvnsbiewudpqbtlvte.functions.supabase.co/track-poll',
    headers => jsonb_build_object(
      'Authorization', 'Bearer ' || vault.read('service_role_jwt'),
      'x-cron-secret', vault.read('cron_secret')
    )
  );
$$);
```

Until the rotation lands, ANY exposure of `cron.job` schema = full DB
admin handoff.

## 2. `seed-demo-data` has hardcoded admin password

**Severity: P1 (latent — only fires when `SEED_DEMO_DATA_ENABLED=true`)**

`supabase/functions/seed-demo-data/index.ts:46-51` creates
`admin@lrmb.test` with password `Test1234!`. The function checks
`SEED_DEMO_DATA_ENABLED` env at line 12 and returns 403 when unset, so
this is latent today. But if anyone flips the env on the production
project for staging-style testing (the lrmb dashboard URL and the
staging dashboard URL are one keystroke apart), anyone who guesses the
email gets Mike-Admin-tier access.

**What Milan needs to do:**

Either:

a. **Delete the function** — it's a one-time seed and we've verified
   demo data is in place; OR
b. **Tighten the env gate** to require BOTH an env flag AND a
   per-invocation shared secret in the request body, AND switch the
   password to `crypto.randomUUID()` returned only in the response.

Option (a) is recommended — the demo seed has already run and we are
past Phase 1 launch.

Both items are flagged in the edge-function corpus audit report (EF-10
and EF-55).
