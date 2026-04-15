# Deploying the Entourage Gummies Blog

Full walkthrough for getting the blog live at `getentouragegummies.com/blog/`. Assumes the main Entourage site is on Cloudflare. If it is not yet, use the raw `entouragess-blog.pages.dev` URL until the main site is migrated.

## Prerequisites

- Cloudflare account with the `getentouragegummies.com` zone (or pending move)
- GitHub repo `MonteKristoAI/entouragess-blog` (push pending approval)
- `wrangler` CLI installed (`npm install -g wrangler` or use `npx wrangler`)
- Node 18+ locally

## 1. Push the repo to GitHub

```bash
cd entouragess-blog
git init
git add .
git commit -m "Initial blog scaffold: Vite site mirror, age gate, Farm Bill, brand validation, first post"
git branch -M main
git remote add origin git@github.com:MonteKristoAI/entouragess-blog.git
git push -u origin main
```

## 2. Create the Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select `MonteKristoAI/entouragess-blog`
3. Build settings:
   - **Framework preset**: None
   - **Build command**: `node build.js`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
   - **Environment variables**: none needed for v1
4. Save and deploy
5. First deploy produces a URL like `https://entouragess-blog.pages.dev` — verify it renders correctly before wiring up the Worker

## 3. Deploy the Worker

```bash
cd entouragess-blog
npx wrangler login     # if not already logged in
npx wrangler deploy    # picks up wrangler.toml
```

This uploads `worker.js` as `entouragess-blog-proxy` under your Cloudflare account. Note the Worker URL from the output.

## 4. Bind the Worker to the main domain

Only do this step **after the main Entourage site is on Cloudflare**. Until then, `entouragess-blog.pages.dev` is the canonical URL.

1. Cloudflare dashboard → `getentouragegummies.com` → **Workers Routes**
2. **Add route**:
   - Route: `getentouragegummies.com/blog/*`
   - Worker: `entouragess-blog-proxy`
3. Save

Now `getentouragegummies.com/blog/` serves the Pages project without any DNS hops or redirects.

## 5. Verify

- Open `https://getentouragegummies.com/blog/` — should render the blog index
- Open `https://getentouragegummies.com/blog/what-is-the-entourage-effect/` — should render the seed post
- Open `https://getentouragegummies.com/blog/sitemap.xml` — should return XML with post URLs
- Open `https://getentouragegummies.com/blog/robots.txt` — should mention the sitemap
- Age gate: clear `localStorage.entourage_age_verified` in devtools and reload; modal should appear
- Google Search Console: **URL Inspection** → fetch as Google → confirm the rendered HTML is indexable (it should be, since the blog is static HTML not a SPA)
- Submit the sitemap in GSC once the main domain is verified

## 6. Update `BLOG_ORIGIN` if needed

If the Pages project URL differs from `entouragess-blog.pages.dev`, edit `worker.js`:

```js
const BLOG_ORIGIN = 'https://your-actual-pages-url.pages.dev';
```

Then redeploy:

```bash
npx wrangler deploy
```

## 7. Ongoing publishing flow

1. Write a new post as `posts/your-slug.html` with the META block at the top
2. Run `npm run build` to validate (brand rules + schema + sitemap)
3. Commit and push to `main`
4. Cloudflare Pages auto-deploys on push
5. Worker is already routed — new post is live at `getentouragegummies.com/blog/your-slug/` within ~60 seconds

## Known gaps to close before public launch

- [ ] Wire the newsletter form to Sandy's chosen ESP (Klaviyo is the likely pick given Carolina Natural Solutions' existing stack). Currently the form is an inert placeholder.
- [ ] Replace Google Fonts Inter + Fraunces with the real Entourage fonts (Balboa Plus Fill, Roc Grotesk Light, Futura Book) once Seamus delivers the `.woff2` files. Drop them into `images/fonts/` and uncomment the `@font-face` block in `css/blog.css`.
- [ ] Convert the logo PNGs and silhouettes to `.webp` for performance (run the `webp-convert` skill against `images/`)
- [ ] Add the final product URLs for the Relaxed, Balanced, Uplifted CTAs once the shop goes live (currently they point to `/shop` as a placeholder)
- [ ] Verify the main Entourage site footer link structure matches this blog footer; if the main site moves to different URLs, update `templates/post.html` and `templates/index.html` in lockstep
