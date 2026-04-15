# GummyGurl Blog

Static HTML blog for [gummygurl.com/blog/](https://gummygurl.com/blog/). Served via Cloudflare Workers reverse proxy (subfolder pattern).

## Architecture

```
gummygurl.com/blog/*  ->  CF Worker proxy  ->  gummygurl-blog.pages.dev
gummygurl.com/*       ->  WordPress/WooCommerce (SiteGround)
```

## Development

```bash
npm install
npm run build    # Build to dist/
npm run dev      # Build + local server on :3002
```

## Adding Posts

1. Create HTML file in `posts/` with META comment block
2. Run `npm run build`
3. Push to main (auto-deploys to Cloudflare Pages)

### Post META format

```html
<!-- META
title: Your Post Title
slug: your-post-slug
description: Meta description 150-160 chars
date: 2026-04-15
updated: 2026-04-15
category: THC Education
image: /blog/images/hero.webp
image_alt: Descriptive alt text
read_time: 8
-->
```

## Deployment

1. Connect this repo to Cloudflare Pages (build: `node build.js`, output: `dist`)
2. Deploy `worker.js` to Cloudflare Workers
3. Set worker route: `gummygurl.com/blog/*`

## Stack

- Pure static HTML (zero JS dependency)
- Poppins + Inter fonts (Google Fonts CDN)
- Colors: Navy #041122, Blue #007BFF, Cream #FAF8F4
