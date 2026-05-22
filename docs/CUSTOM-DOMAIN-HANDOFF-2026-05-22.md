# Custom Domain Handoff — LRMB

> Step-by-step DNS configuration template for when Greg / Retaja Group grants registrar access. Two domains in scope: dashboard (`ops.lrmb.com`) and PWA (`app.lrmb.com`).

## Current state (2026-05-22)

| Surface | Current URL | Hosted on |
|---|---|---|
| Operations dashboard (Tony share-link) | `https://lrmb.vercel.app/operations?t=…` | Vercel |
| PWA Field Ops app (staff) | `https://lrmb.lovable.app/login` | Lovable Cloud |
| Both | use auto-generated subdomains | — |

## Target state

| Surface | Target URL |
|---|---|
| Operations dashboard | `https://ops.lrmb.com/operations?t=…` |
| PWA Field Ops app | `https://app.lrmb.com/login` |

## Prerequisites

1. **Registrar access**: who controls `lrmb.com` DNS? Greg / Retaja. We need either:
   - Direct DNS editor access (add CNAME + verification TXT records), OR
   - Greg + a 30-minute call to add the records together.
2. **Vercel team access**: this dashboard is on the `montekristoais-projects` Vercel team. The custom domain needs to be added there (we do this).
3. **Lovable Cloud domain access**: the PWA repo (`MonteKristoAI/lrmb`) is Lovable-managed. Custom domain is configured in Lovable dashboard → Project Settings.

## Step-by-step: `ops.lrmb.com` (Vercel dashboard)

### 1. Add domain in Vercel (we do this)

```bash
# Via Vercel CLI or dashboard
vercel domains add ops.lrmb.com --scope=montekristoais-projects
vercel domains add ops.lrmb.com --project=lrmb
```

Vercel will display two requirements:
- **CNAME record**: `ops` → `cname.vercel-dns.com.`
- **Verification TXT**: `_vercel.ops.lrmb.com` → `vc-domain-verify=<token>` (only needed if SSO/team verification is required)

### 2. Add DNS records at registrar (Greg does this, or together)

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME | `ops` | `cname.vercel-dns.com.` | 300 |

(TXT only if Vercel requested it during step 1)

### 3. Wait for propagation

```bash
dig +short ops.lrmb.com CNAME
# Expected output: cname.vercel-dns.com.
```

Usually 1-5 minutes with TTL 300. Up to 24h on slow registrars.

### 4. Confirm SSL provisioning

Vercel auto-provisions a Let's Encrypt cert once the CNAME points correctly. Check status:

```bash
vercel domains inspect ops.lrmb.com
```

Wait for `SSL: Valid` (~30 seconds after DNS propagates).

### 5. Smoke test

```bash
TOKEN="<a valid share-link token>"
curl -sI "https://ops.lrmb.com/operations?t=${TOKEN}" | head -5
# Expected: HTTP/2 200, server: Vercel
```

### 6. Update share-link generator (if applicable)

If any code or n8n workflow hard-codes `lrmb.vercel.app`, update it. Grep:
```bash
grep -rE "lrmb\.vercel\.app" .
```

Currently hard-coded in:
- `supabase/functions/track-overview-token/index.ts` (returns the share URL in response — check `BASE_URL` env var or hardcoded fallback)
- n8n workflow `BknKUOVi1SUlrNJj` Format Email node (CTA button + link in email)

Set Vercel project env var `NEXT_PUBLIC_BASE_URL=https://ops.lrmb.com` if used.

## Step-by-step: `app.lrmb.com` (Lovable PWA)

### 1. Add domain in Lovable dashboard

Go to Lovable project `lrmb` (auth: `https://lovable.dev/projects/lrmb`) → Settings → Domains → "Add custom domain" → `app.lrmb.com`.

Lovable will display:
- **CNAME**: `app` → `cname.lovable.app.` (exact target may differ; copy from Lovable UI)
- **Verification TXT**: occasionally requested

### 2. Add DNS at registrar

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME | `app` | (value from Lovable UI) | 300 |

### 3. Wait for propagation + SSL

```bash
dig +short app.lrmb.com CNAME
```

### 4. PWA manifest update

Edit `public/manifest.json` (or `vite.config.ts` PWA config) to update:
- `start_url` → `/login`
- `scope` → `/`
- `id` → `lrmb-field-ops` (stays the same so existing install retention)

Push to `main`, Lovable auto-deploys.

### 5. Re-install on staff devices

PWA installs are domain-scoped. Once `app.lrmb.com` is live, staff need to:
1. Uninstall old PWA (long-press → Remove)
2. Open `https://app.lrmb.com/login` in Safari (iOS) or Chrome (Android)
3. Add to Home Screen again

Send staff a one-pager with screenshots (we can write this when domain goes live).

## Optional: Apex domain (`lrmb.com`) landing page

If Greg wants `lrmb.com` itself to serve a marketing landing page (separate from `ops.` and `app.`), we'd add either:
- An A record pointing to a Cloudflare Worker or Vercel project with a marketing site
- Or a 301 redirect at the registrar level (`lrmb.com` → `https://www.luxuryrentalsmiamibeach.com/`)

Not in scope until Greg/Tony decide.

## Rollback

If the cutover causes problems:
1. **Vercel**: removing the custom domain via Vercel dashboard reverts to `lrmb.vercel.app` URL. Existing share-links keep working because the token verifies independently of hostname.
2. **Lovable**: same pattern — remove the domain in Lovable dashboard, revert to `lrmb.lovable.app`.
3. **DNS**: registrar revert (remove CNAME). 24h TTL caching may delay full revert.

Total rollback time: under 10 minutes.

## Cost

- Vercel: custom domain is free on team plan (already on it)
- Lovable: custom domain free on paid plan (LRMB project already qualifies)
- DNS: zero (using existing registrar)
- SSL: zero (auto Let's Encrypt)

## Next action

When Greg shares registrar access, execute steps 1-5 of the Vercel block (~15 min including propagation). Lovable block can wait until after staff training video is recorded, so all staff materials reference `app.lrmb.com` from day one.

## Open questions for Greg

- Which registrar? (GoDaddy, Cloudflare, Namecheap…)
- Any existing email DNS records (MX, SPF, DKIM) we must not touch?
- Should `lrmb.com` apex redirect somewhere or stay parked?

## Related

- `docs/GO-LIVE-OPERATIONS-RUNBOOK-2026-04-22.md` — April runbook (some sections superseded)
- Vault: `wiki/patterns/cloudflare-domain-setup.md` (if it exists) — similar pattern for other clients
- This document supersedes: any earlier custom-domain notes in `docs/IMPLEMENTATION-READINESS-2026-04-21.md`
