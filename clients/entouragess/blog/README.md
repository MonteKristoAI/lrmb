# Entourage Gummies Blog

Static HTML blog for Entourage Gummies. Served via Cloudflare Pages and proxied through a Cloudflare Worker so the blog lives at `getentouragegummies.com/blog/` as a subfolder of the main site (not a subdomain — Pattern P-002, ~25% better organic growth).

## Stack

- Plain HTML posts authored with a `META` comment block at the top
- Node build script (`build.js`) wraps each post in templates and outputs a `dist/` folder with post pages, index, sitemap, RSS, robots.txt, and Cloudflare Pages `_redirects`
- Cloudflare Worker reverse proxy (`worker.js`) routes the main domain's `/blog/*` paths to the Pages project
- No dependencies beyond Node itself (optional `serve` for local preview)
- Fonts load from Google Fonts (Inter + Fraunces) as a fallback until Entourage's custom fonts (Balboa Plus Fill, Roc Grotesk Light, Futura Book) are delivered and hosted

## Layout

```
entouragess-blog/
├── build.js           ← reads posts/, writes dist/
├── worker.js          ← CF Worker reverse proxy
├── wrangler.toml      ← CF Worker deploy config
├── package.json       ← npm scripts
├── posts/             ← HTML blog posts (one file per post, META block at top)
├── templates/
│   ├── post.html      ← post wrapper
│   └── index.html     ← blog listing page
├── css/
│   └── blog.css       ← dark theme matching the main site
├── images/            ← logos, silhouettes, hero images, OG defaults
└── dist/              ← build output (gitignored, deploy this)
```

## Post format

Each post is a plain HTML file with a metadata comment block at the top. The build script parses it, strips it from the final output, and injects everything into the post template.

```html
<!-- META
title: What Is the Entourage Effect?
slug: what-is-the-entourage-effect
description: 150-160 char meta description
date: 2026-04-11
updated: 2026-04-11
category: Entourage Effect Science
author: Sandy Adams
image: /blog/images/hero.webp
image_alt: Descriptive alt text
read_time: 9
-->

<h1>Post Title</h1>
<p>Post body...</p>
```

## Build-time brand validation

The build will **fail fast** if any post contains:

1. Em dashes (`—`) or en dashes (`–`). Sandy calls these "AI dashes" and wants every one gone.
2. Incorrect `TiME INFUSION` stylization. It must appear exactly as `TiME INFUSION` (lowercase `i`, `INFUSION` all caps), always as a proper noun, never as a verb.
3. Any mention of `Azuca` (case-insensitive).
4. Obvious medical-claim language (`cure`, `treat`, `heal`, `remedy`, `medicine`, `pharmaceutical`).

Errors are printed to the console with the file name and a short explanation, and the build exits with code 1. No bad content ever reaches `dist/`.

## Local development

```bash
cd entouragess-blog
npm install
npm run build        # writes dist/
npm run dev          # builds + serves dist/ on http://localhost:3003
```

Open `http://localhost:3003/` to see the blog index. The age gate is localStorage-backed (30 day TTL) and is part of every template; clear `localStorage.entourage_age_verified` to see it again.

## Deployment

See [DEPLOY.md](./DEPLOY.md) for the full Cloudflare Pages + Worker walkthrough. Short version:

1. Push this repo to GitHub (`MonteKristoAI/entouragess-blog`).
2. Create a Cloudflare Pages project connected to the repo. Build: `node build.js`. Output: `dist`.
3. Deploy the Worker: `npx wrangler deploy` from this folder.
4. In the Cloudflare dashboard, add a Worker route: `getentouragegummies.com/blog/*` → `entouragess-blog-proxy`.

## House rules for blog authors

Before committing a post, re-read [Blog/clients/entouragess/FEEDBACK.md](../Blog/clients/entouragess/FEEDBACK.md) in the main repo. The short version:

- **TiME INFUSION** is a proper noun. It is the infusion process that wraps each cannabinoid molecule in a hydrophilic coating. It does not get absorbed; the compounds do.
- **Zero em dashes.** The build will reject them.
- **Never mention Azuca.** Ever.
- **Silhouettes on every page.** The Relaxed, Balanced, and Uplifted figures are part of the brand identity, not decoration.
- **Gummy company > infusion tech.** The brand is a gummy company whose moat includes a proprietary process. Keep the emphasis on the gummy experience.
- **Terpene names use Greek letter form.** `β-Caryophyllene`, not `Beta Caryophyllene`.
- **No medical claims.** No "cures anxiety," no "treats insomnia." Hemp edibles cannot make those claims and the payment processor will not allow them.
- **FDA disclaimer and Farm Bill compliance notice must render on every page.** They are part of the templates; do not remove them.
