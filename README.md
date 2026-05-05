# LRMB Field Ops

Field-operations PWA for Luxury Rentals Miami Beach. Mobile-first task
coordination on top of the existing TRACK PMS, supporting maintenance,
housekeeping, inspections, vendor management, and damage claims.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind + shadcn/ui + TanStack Query v5 |
| Backend  | Supabase (Postgres 17, Auth, Storage, Edge Functions) |
| PWA      | vite-plugin-pwa (injectManifest), Web Push, offline cache |
| Hosting  | Vercel - production at https://lrmb.vercel.app |
| CI       | GitHub Actions (`lrmb-app-ci.yml` on PRs, `lrmb-prod-monitor.yml` every 30 min) |

## Run locally

```bash
npm install
cp .env.example .env  # if you keep an example; otherwise see env vars below
npm run dev           # http://localhost:5174
```

### Required env vars

```
VITE_SUPABASE_URL=https://hfpvnsbiewudpqbtlvte.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...   # the publishable / anon key (safe to expose)
VITE_VAPID_PUBLIC_KEY=...           # public VAPID key for Web Push
```

These same three vars must be set on Vercel under Settings -> Environment
Variables for Production, Preview, and Development. The Supabase service-role
key is never used in the frontend.

## Tests + verification

```bash
npm run lint        # eslint
npm run test        # vitest
npm run build       # production build
npm run verify:prod # full gate: lint + test + build + production-smoke probes
```

## Deployment

Main branch auto-deploys to https://lrmb.vercel.app via the Vercel-GitHub
integration. Pull requests get preview deployments under
`*-montekristoais-projects.vercel.app`.

The Vercel project lives at https://vercel.com/montekristoais-projects/lrmb.

### Required Vercel env vars (Production + Preview + Development)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_VAPID_PUBLIC_KEY`

### Required Supabase Auth dashboard configuration

- Site URL: `https://lrmb.vercel.app`
- Additional Redirect URLs:
  - `https://lrmb.vercel.app/**`
  - `https://*-montekristoais-projects.vercel.app/**` (preview deployments)
  - `http://localhost:5174/**` (local dev)

### Production smoke monitor

GitHub Actions runs the smoke probes every 30 minutes against the live
Supabase backend (signup disabled, webhook unauthorized, CORS lockdown).
Failures email the repo collaborators. See
`.github/workflows/lrmb-prod-monitor.yml`.

## Database

- Project: `hfpvnsbiewudpqbtlvte` (Postgres 17.4, us-east-2)
- 18 tables, all with RLS enabled
- Migrations in `supabase/migrations/`
- Auth: email + password, public signup blocked at config + DB trigger level
- Roles: `field_staff`, `admin`, `supervisor`, `manager` (see `app_role` enum)
- Admin gate: SQL function `has_admin_access(uuid)` granting access to `admin` and `manager`

## Three modules

1. **Maintenance / Work Orders** - mobile-first task lifecycle with photo proof
2. **Housekeeping Coordination** - auto-created from TRACK reservation events
3. **Inspection Reporting** - 4 templates, 308 items, auto-creates maintenance tickets when items are flagged

## Damage claims

Follows LRMB's existing Trainual SOP (Safely / Rental Guardian); see
`docs/DAMAGE-CLAIM-SOP-MAPPING.md` for the field-by-field mapping.
45-day claim deadline auto-tracked via `tasks.claim_deadline_at`.

## Branding

- App name: `LRMB Field Ops`
- Primary color (taupe): `#C4BAB1` (HSL 28 14% 73%)
- Accent color (teal): `#0680A2` (HSL 193 93% 33%)
- Fonts: Inter (body) + Poppins (headings)
- PWA theme color: `#080E1A` (deep navy canvas)
