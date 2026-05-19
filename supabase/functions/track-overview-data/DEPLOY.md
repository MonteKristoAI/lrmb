# Operations Overview deploy guide

Two Supabase edge functions back the read-only `/operations` page:

| Function | Purpose |
|---|---|
| `track-overview-token` | Issues an HMAC-signed share link. Requires an admin/supervisor/manager JWT. |
| `track-overview-data` | Returns aggregated overview JSON. Validates the HMAC token (no Supabase session required). |

Both depend on a shared secret stored as a function secret.

## 1. Generate and store the HMAC secret

Pick a high-entropy secret (≥ 32 bytes). Example:

```bash
openssl rand -hex 32
# -> 9c1f...a3d4
```

Store it once in Supabase:

```bash
supabase secrets set OPS_VIEW_HMAC_SECRET=<the-secret> --project-ref <REF>
```

Both functions read the same secret. Do not change it without invalidating every outstanding share link.

## 2. Deploy both functions

```bash
cd clients/lrmb/app
supabase functions deploy track-overview-token --project-ref <REF>
supabase functions deploy track-overview-data --project-ref <REF>
```

The shared module at `supabase/functions/_shared/share-link.ts` ships with both functions automatically (Supabase bundles the `_shared` directory).

## 3. Issue your first share link

Any admin/supervisor/manager can mint a token by hitting `track-overview-token` with their AiiA session JWT:

```bash
SUPABASE_URL=https://<REF>.supabase.co
JWT="<paste from browser localStorage or supabase.auth.getSession() in console>"
curl -X POST "$SUPABASE_URL/functions/v1/track-overview-token" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"viewer":"Tony","expiresInDays":30}'
```

Response:

```json
{
  "token": "eyJ...xxx",
  "expiresAt": "2026-06-19T00:00:00Z",
  "url": "https://lrmb.lovable.app/operations?t=eyJ...xxx"
}
```

Send the `url` to whoever needs the read-only view.

## 4. Verify the page loads

Paste the `url` into an incognito window. You should see:

- "LRMB Operations Overview" header
- Live reservation pipeline (arrivals / in house / checkouts / next 7d)
- Housekeeping queues (scheduled today / in progress / pending verify)
- Maintenance queues (open / overdue / blocked / pending verify)
- Auto-refresh every 5 minutes (top-right shows last-updated timestamp)
- No edit / delete / mutation buttons

If the polling worker hasn't run yet, the reservation pipeline cards will be empty until it backfills.

## 5. Revoke / rotate

To invalidate every outstanding share link, rotate the secret:

```bash
supabase secrets set OPS_VIEW_HMAC_SECRET=<new-secret> --project-ref <REF>
```

Anyone holding an old `url` will get a 401 with `bad_signature` on next load. Issue new ones via step 3.

## Security model

- The share-link token is the **only** thing protecting the data. Treat the URL like a credential. Don't post it in public Slack channels or commit it.
- Tokens are HMAC-SHA256-signed, base64url-encoded, with a hard expiry. The signature can't be forged without the secret.
- The data endpoint runs as the Supabase service role on the server, so it can read across all tables. Don't expose any field on the page that shouldn't be in this trust class (e.g. guest PII has been intentionally excluded — only reservation external_id, unit_id, dates, status, occupant count, nights).
- Token issuance is gated by `has_admin_access()`. Field staff JWTs can't mint links.
- Every token issuance writes an `audit_logs` row (action=`ops_overview_token_issued`) with the issuer user_id and a SHA256 hash of the token (so we can later identify which token was leaked without storing it plaintext).

## Tests

```bash
cd clients/lrmb/app
npm test src/test/share-link.test.ts
```

13-case suite covering: round-trip, secret separation, tampered payload, expiry, future-iat, missing parts, non-JSON payload, unsupported version. Passes in <1s.
