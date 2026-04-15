# MK Blog Editor

MonteKristo AI internal blog management tool. Manage, preview, and publish blog posts across all clients from one dashboard.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL + Auth + Vault)
- **UI:** shadcn/ui + Tailwind CSS
- **Code Editor:** CodeMirror 6
- **AI:** Anthropic Claude API (streaming)
- **Hosting:** Vercel

## Features

- Dashboard with client cards and post statistics
- Post editor with 5 tabs: SEO Fields, HTML Code, Preview, Images, AI Assistant
- One-click copy for all SEO fields (title, meta, slug, OG, JSON-LD)
- Client CSS preview in sandboxed iframe with viewport toggle
- Image URL replacement with live preview
- Quality gates (zero em dashes, banned words, SEO validation)
- WordPress publish (upload media + create post via REST API)
- Cloudflare Pages publish (GitHub API push)
- Scheduled publishing via Vercel cron
- AI editor with Claude streaming + apply suggested changes
- Bulk import existing HTML post files

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `MonteKristoAI/mk-blog-editor` from GitHub
3. Add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://hfpvnsbiewudpqbtlvte.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ANTHROPIC_API_KEY=<sk-ant-...>
GITHUB_TOKEN=<ghp_... with repo write access>
CRON_SECRET=<random string for cron auth>
```

4. Deploy
5. Configure custom domain: `editor.montekristobelgrade.com`

## Local Development

```bash
npm install
cp .env.local.example .env.local  # fill in keys
npm run dev
```

## Bulk Import Existing Posts

```bash
# Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
npm install -g tsx
npx tsx scripts/bulk-import.ts
```

## Supabase Auth Setup

Create a user in Supabase Dashboard > Authentication > Users:
- Email: contact@montekristobelgrade.com
- Password: (set a strong password)

This user will be able to log into the editor at /login.
