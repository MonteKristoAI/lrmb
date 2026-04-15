# Entourage Gummies -- Brand Guidelines

Source of truth for colors, fonts, logos, silhouettes, and differentiators. The main site lives at `clients/entouragess/`; the blog inherits everything here and mirrors it via `entouragess-blog/css/blog.css`.

---

## Colors (OFFICIAL from Seamus McKeon, 2026-04-07)

Reference card: `clients/entouragess/_client-docs/entourage-hex-codes.png`.

| Role | Hex | Usage |
|---|---|---|
| **Relaxed** | `#029b78` | Green effect, Relaxed SKU, cluster tags, hover states |
| **Uplifted** | `#b21e41` | Pink/red effect, Uplifted SKU, warning states |
| **Balanced / Gold** | `#e2b829` | Default brand color, Balanced SKU, CTAs, accents, links |
| **Gold glow** | `#f2cc48` | Gradient pair for CTA buttons, hover gold |
| **Off-white text** | `#faf6f0` | Primary foreground on black |
| **Off-white muted** | `rgba(250, 246, 240, 0.72)` | Secondary text |
| **Off-white faint** | `rgba(250, 246, 240, 0.5)` | Captions, disclaimers |
| **Background** | `#000000` | Base site background, sitewide |
| **Background raised** | `#0b0b0c` | Cards, raised sections, newsletter panels |
| **Background card** | `#101012` | Blog post body, post cards on index |
| **Border** | `rgba(250, 246, 240, 0.1)` | Default divider / border |
| **Border strong** | `rgba(250, 246, 240, 0.2)` | Active states, inputs |

### Usage rules

- **Gold is the default brand accent.** Use it on primary CTAs, active nav links, the reading progress bar, eyebrow tags, and the effect-bar Balanced pill.
- **Green and pink are reserved for their respective effects.** Do not use green as a "success" color or pink as a "destructive" color. They belong to Relaxed and Uplifted only.
- **Black is never optional.** The brand is a dark-theme brand. Do not light-theme anything.
- **Gradients:** only use `linear-gradient(135deg, #e2b829, #f2cc48)` for the primary CTA button. No other gradients.

---

## Typography

### Official fonts (pending file delivery from Seamus)

- **Balboa Plus (Fill)** -- logo + display headings. H1, H2, blog post titles, hero copy.
- **Roc Grotesk (Light)** -- sub-headings, nav, button labels.
- **Futura 100 (Book)** -- body copy, ingredients, detail text.

### Fallback stack (in use until files land)

- **Display headings:** `'Fraunces', 'Georgia', serif` -- Google Fonts serif that approximates Balboa Plus's display weight
- **Body + nav + UI:** `'Inter', system-ui, -apple-system, sans-serif` -- standard Google Fonts sans that approximates Futura and Roc Grotesk

The `@font-face` infrastructure is wired in both the main site (`clients/entouragess/src/index.css`) and the blog (`entouragess-blog/css/blog.css` via Google Fonts link). Swap to real files once Seamus delivers the `.woff2`.

### Type scale (blog)

- H1: 2.25rem mobile / 2.75rem desktop, Fraunces 700, letter-spacing -0.02em
- H2: 1.75rem, Fraunces 700, margin-top 3rem
- H3: 1.25rem, Inter 700, margin-top 2.25rem
- Body: 1.0625rem, Inter 400, line-height 1.75
- Caption: 0.8125rem, Inter 400, color cream-faint

---

## Logo

Official variants in `clients/entouragess/_client-docs/`:

- `entourage-gold-logo-official.png` -- **default brand mark**, used in header, footer, age gate, and OG images
- `entourage-green-logo-official.png` -- Relaxed contexts (hero on Relaxed product page, Relaxed blog cluster tag)
- `entourage-pink-logo-official.png` -- Uplifted contexts

Copies live in `entouragess-blog/images/logo-gold.png`, `logo-green.png`, `logo-pink.png`. Convert to `.webp` before launch via the `webp-convert` skill.

**Logo rules:**

- Never place the logo on a light background without a dark plate behind it
- Never stretch, rotate, or re-color the logo
- Never use just the mark without the wordmark for headers (wordmark anchors the brand)
- Minimum height: 32px mobile, 44px desktop

---

## Silhouettes

Hand-drawn human figures embodying each effect. Part of the brand identity, not decoration. **Sandy has explicitly required silhouettes to appear on every page** (2026-04-02 feedback).

Files in `clients/entouragess/src/assets/`:

- `silhouette-relaxed.png` / `silhouette-relaxed-cutout.png`
- `silhouette-uplifted.png` / `silhouette-uplifted-cutout.png`
- `silhouette-social.png` / `silhouette-social-cutout.png` (used as the Balanced silhouette)

Copied into `entouragess-blog/images/silhouette-relaxed.png`, `silhouette-balanced.png`, `silhouette-uplifted.png`. Used as decorative background on the blog hero with reduced opacity.

### Silhouette placement rules

- Always three silhouettes together (Relaxed, Balanced, Uplifted) on brand hero sections
- Opacity 0.08-0.12 when used as background decoration
- Full opacity on product cards and effect-specific contexts
- Never invert or color-shift (brand colors are applied via background tint, not filter)

---

## Brand Voice Summary

Warm-but-expert, social not clinical, honest about the category's failures. Writes like a former flower smoker explaining to a friend why most edibles are broken and what Entourage did differently. Sessionable, first-person-comfortable, anti-wellness-cringe. Full voice guide in [STYLE.md](./STYLE.md).

---

## Key Differentiators

1. **Dual-pillar positioning.** Most hemp brands sell one or the other (formulation OR delivery). Entourage owns both, with equal weight in every piece of content.
2. **TiME INFUSION delivery process.** Proprietary water-soluble infusion. 15-30 minute onset. Named, branded, and explained in plain English. No other competitor has a branded fast-acting process with an actual science story.
3. **Full-spectrum formulation modeled on flower.** THC, CBD, and terpenes in ratios that mimic the cannabis smoking experience, not isolated Delta-9 in a sugar gummy.
4. **Three sessionable effects with distinct terpene profiles.** Relaxed, Balanced, Uplifted. Each maps to a moment, not a time of day or a dose. Sessional by design.
5. **Named manufacturing partner.** Carolina Natural Solutions is disclosed on every product and content page. Almost no other hemp brand names their facility.
6. **Charlotte, NC origin.** Southeast authority. Hometown Hero owns Texas; nobody owns the Southeast. Sandy fills the gap by default.
