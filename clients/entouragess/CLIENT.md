# Entourage Gummies — Client Profile

**Industry**: THC/CBD edibles (hemp-derived, US)
**Website**: getentouragegummies.com (pending launch)
**Repo**: github.com/MonteKristoAI/entouragess
**Local**: `clients/entouragess/`
**Status**: Active — design iteration phase, approaching final revision before launch

---

## Primary Contact

- **Sandy Adams** — owner
- Email (primary, new): sandy@getentouragegummies.com
- Email (original): ktownsquishes@gmail.com
- Phone / WhatsApp: (330) 573-1097
- Business email for site: `info@getentouragegummies.com` (per 2026-04-10 PDF; supersedes the earlier `entouragegummyinquiries@gmail.com`)
- Business location for site: Charlotte, North Carolina, USA

## Introduced By

- **John Rice** (AI Savants) — john@aisavants.io
- Initial kickoff call: 2026-03-05
- Terry Decker (FFI) — tdecker@ffiinc.net (cc on materials thread)

## Packaging Designer

- **Seamus McKeon** — Carolina Natural Solutions
- Email: seamus@carolinanaturalsolutions.com
- Phone: 978-406-3946
- Source of truth for brand fonts, hex codes, logo files, silhouette PNGs

---

## Product Overview

Entourage makes a hemp-derived THC + CBD + terpene gummy designed to mimic the
cannabis smoking experience (the "entourage effect") in a precisely-dosed
edible. Two things make the product unique and the website must reinforce
BOTH with equal weight:

1. **Entourage-mimicking formulation** — THC/CBD/terpene ratio that recreates
   the full-spectrum effect of smoked flower
2. **TiME INFUSION** — proprietary infusion process by Carolina Natural
   Solutions that wraps each cannabinoid molecule in a hydrophilic coating
   for fast onset and consistent dosing

Positioning line from the packaging (use as north star for the site copy):

> The result of the entourage mimicking formulation and the TiME INFUSION
> delivery system is a consistent, easy to dose effect designed for clarity,
> enjoyment, and connection. It delivers a social, sessionable gummy
> experience rather than a heavy or sedating one.

Three product SKUs / effects:
- **Relaxed** (effect-relaxed green)
- **Balanced** (effect-balanced gold — default brand color)
- **Uplifted** (effect-uplifted red/pink)

---

## Brand System

### Colors (OFFICIAL from Seamus, 2026-04-07)

Hex card at `_client-docs/entourage-hex-codes.png`. These are the **exact**
values from the packaging designer and must replace current CSS tokens:

| Role | Hex | Use |
|---|---|---|
| **Relaxed (green)** | `#029b78` | `--effect-relaxed` |
| **Uplifted (pink/red)** | `#b21e41` | `--effect-uplifted` |
| **Balanced / Gold (default brand)** | `#e2b829` | `--effect-balanced`, `--gold` |
| **Off-white text** | `#faf6f0` | foreground on black |
| **Background** | `#000000` | base background |

Current `src/index.css` HSL tokens are approximations and need updating to
match these exact hex values.

### Fonts (official)

- **Balboa Plus (Fill)** — logo/display headings
- **Roc Grotesk (Light)** — sub-headings
- **Futura 100 (Book)** — body, ingredients, detail text

Infrastructure is wired in `tailwind.config.ts` and `src/index.css` via
`@font-face` blocks (commented out). Drop the .woff2/.otf files in
`public/fonts/` and uncomment. No files on disk yet.

### Logo Assets

Logos exist in `src/assets/`:
- `Entourage_gold_logo.png` — default (header, footer, age gate)
- `Entourage_green_logo.png` — Relaxed contexts
- `Entourage_pink_logo.png` — Uplifted contexts

Silhouettes (from packaging, must appear on every page, not only home):
- `silhouette-relaxed.png` / `silhouette-relaxed-cutout.png`
- `silhouette-uplifted.png` / `silhouette-uplifted-cutout.png`
- `silhouette-social.png` / `silhouette-social-cutout.png`

---

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript + SWC
- **UI**: shadcn/ui (full Radix set installed), Tailwind CSS, lucide-react
- **Routing**: react-router-dom v6
- **State**: @tanstack/react-query
- **Forms**: react-hook-form + zod
- **Testing**: Vitest + Playwright
- **Origin**: Lovable project (`.lovable/plan.md` contains last Lovable spec)

### Routes (`src/App.tsx`)
- `/` — Index
- `/shop` — Shop
- `/explore-technology` — ExploreTechnology (TiME INFUSION deep dive)
- `/effects` — Effects page (entourage effect explainer)
- `/contact` — Contact
- `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy` — Legal
- `*` — NotFound

All routes wrapped in `<AgeGate>` (21+ gate on entry).

### Key Components
- `AgeGate.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `FarmBillBanner.tsx`
- Home sections: `HeroSection`, `SilhouetteHero`, `FindYourEffect`,
  `DualPillarSection`, `AboutTime`, `ScienceSection`, `ScienceComparison`,
  `EdiblesProblem`, `WhyDifferent`, `FeaturedGummies`, `FeaturedProducts`,
  `EffectsShowcase`, `ReviewsSection`, `TrustStats`, `VideoSection`,
  `NewsletterSection`, `FaqSection`, `AudienceGrid`, `SmokersSection`

---

## Payment Processor Compliance (HARD BLOCKERS for launch)

From Sandy (2026-04-02). All of these must ship before the site can go live:

1. **Farm Bill notice** visible on every page
2. **Age gate** on site entry AND again at checkout (currently only on entry)
3. **Footer legal links on every page**: Terms · Privacy · Refund Policy · Shipping Policy
4. **Contact page must show**: business email (`entouragegummyinquiries@gmail.com`)
   and hours of operation
5. **COAs (Certificates of Analysis)** accessible on the site — Sandy is sourcing
6. **Product photos** — Sandy is sourcing (expected week of Apr 13, 2026)

Legal copy (T&Cs, Privacy, Refund, Shipping) is being drafted by Sandy's
attorney. Status as of 2026-04-10: "need to fill in a few details,
sending later today or tomorrow."

---

## Content / Copy Rules (critical)

- **ZERO em dashes.** Sandy calls them "AI dashes" and has explicitly
  flagged them for full removal. Replace with commas, periods, or rework the
  sentence. Applies site-wide. This reinforces the MonteKristo-wide
  no-em-dashes rule.
- **"TiME INFUSION"** — proper noun, not a verb. Always capitalize exactly
  `TiME` (lowercase i) and `INFUSION` (all caps). Example phrasing Sandy
  approved: *"TiME INFUSION is the infusion process that wraps each
  individual cannabinoid molecule in a hydrophilic coating."*
- **"It's About TiME"** — pillar 2 title must stylize M and E: `TiME`
- **Entourage effect copy** (on `/effects`): "Cannabis flower contains
  hundreds of compounds, and when it is smoked, all of them are consumed
  at once. The experience the smoker gets is the result of all of those
  compounds working together and not just THC. THC drives the experience,
  CBD smooths it out, and terpenes shape the character."
- **Q&A** — remove the "safe for beginners" question entirely
- **Chart citation** — the entourage effect chart needs a real citation
  (Sandy sent a reference image; omit any funding-source reference)
- **Emphasis balance** — gummy company first, infusion tech second. Do not
  let TiME INFUSION dominate. Company name + tagline + silhouettes must be
  present everywhere.
- **Contact page** — invite wholesale inquiries
- **Silhouettes** — use on every page, not just home

---

## Engagement Timeline

| Date | Event |
|---|---|
| 2026-03-05 | Kickoff call. Sandy sent slide deck + package images. |
| 2026-03-17 | First feedback: "site emphasizes TiME INFUSION, not the gummy company. Reposition." |
| 2026-03-24 to 27 | Iteration round. Zoom call 2026-03-27 to resolve direction. |
| 2026-03-29 | Second feedback doc (Google Docs). |
| 2026-03-31 | Sandy sent silhouette PNGs from Seamus. |
| 2026-04-02 | Big feedback: em dash purge, fonts/hex from package designer, compliance requirements. |
| 2026-04-07 | Seamus (packaging designer) sent official hex codes + logo PNGs + fonts. |
| 2026-04-10 | Sandy: "last round of design changes." Website Notes 2.pdf attached. COAs + legal coming next week. |

---

## Open Items (as of 2026-04-11)

### Blocking launch
- [ ] Apply final round of design changes from `_client-docs/website-notes-2_2026-04-10.pdf`
- [ ] Add checkout age re-verification (compliance)
- [ ] Add Farm Bill banner on every page (verify `FarmBillBanner` is mounted on every route, not just home)
- [ ] Wait on: COAs (Sandy)
- [ ] Wait on: product photos (Sandy)
- [ ] Wait on: legal copy for `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy` (Sandy's attorney)
- [ ] Wait on: chart citation image (Sandy)

### Design polish from 2026-04-02 feedback (check if applied)
- [ ] Em dash sweep across site (replace all `—` / `–`)
- [ ] Install real font files in `public/fonts/` and uncomment @font-face blocks
- [ ] Silhouettes used on every page
- [ ] Contact page: wholesale invite + hours of operation + business email
- [ ] Pillar 2: "It's About TiME" stylization
- [ ] Pillar 2 description: "TiME INFUSION is the infusion process..." rewrite
- [ ] FAQ: remove "safe for beginners"
- [ ] `/effects`: update entourage-effect copy
- [ ] Entourage effect chart: real citation

### Nice to have / future
- Domain + hosting: needs to be set up (getentouragegummies.com email already live)
- CI/CD deploy target: TBD (likely Cloudflare Pages or Vercel — Vite static build)
- Analytics / cookies / GDPR banner: compliance pending
- No MCP integrations needed (static marketing site + ecomm)

---

## Reference Docs (all downloaded 2026-04-11)

- `_client-docs/website-notes-2_2026-04-10.pdf` — latest feedback (final round, Sandy)
- `_client-docs/entourage-hex-codes.png` — official hex card from Seamus
- `_client-docs/entourage-gold-logo-official.png` — official gold logo
- `_client-docs/entourage-green-logo-official.png` — official green logo
- `_client-docs/entourage-pink-logo-official.png` — official pink logo
- `.lovable/plan.md` — last Lovable build spec (logo PNG integration)
- `src/` — source of truth for the site

---

## Final Round Feedback (PDF, 2026-04-10) — Full Punch List

### Home Page
1. **Font still wrong.** Packaging back-text font (Futura Book) must be used everywhere except the logo. Logo + tagline font is correct. → Install Futura Book .woff2 in `public/fonts/` and uncomment `@font-face`.
2. `/` "Find Your Effect" → UPLIFTED body: replace `Beta Caryophyllene` with `β-Caryophyllene`.
3. FAQ "What makes these different from other edibles": remove the word "high" and rewrite "They also feature TiME INFUSION delivery, which absorbs in 5-15 minutes" — TiME INFUSION doesn't get absorbed, the compounds do.

### Shop
1. Under "Shop Gummies" header remove "One standard of quality".
2. **Each blend needs its own product page** with: COAs, ingredients, cannabinoid content (mg THC/CBD/terpenes per serving), serving size, total servings per package. Schema: blend → 2 strengths → 2 pack sizes each (single-gummy pack + 100mg total-THC pack = 10x10mg or 4x25mg depending on strength). Serving = 10mg.

### Effects
1. "How Entourage Gummies Use It" blend cards: remove color dot in top-left (colored squares are enough).
2. Relaxed card: replace `guide` with `produce`.
3. Remove the entire "Why It Matters" section.

### Science / Explore Technology
1. "Two Innovations. One Unique Gummy." → remove redundant `Entourage blend` under `THC+CBD+Terpene Blend`.
2. Pillar 2 sentence 2: replace `It` with `The process`.
3. Pillar 2 sentence 3: replace `in the mouth` with `in the mouth and stomach`.
4. Pillar 2 sentence 4: replace `heavy, sedating effects` with `heavy and sedating effects`.
5. **"Preclinical Pharmacokinetic Data" chart**: remake from scratch (do NOT paste the Azuca image). Rewrite footnote verbatim but **delete the phrase "and funded by Azuca"**. Azuca must not appear anywhere on the site, ever.
6. "Why It Matters" → "Social and Sessionable" card: replace `offset` with `non-sedating effects` (hyphen is fine).
7. "Entourage vs Traditional Edibles" table — Entourage Gummy × Formulation: remove `(entourage)`.
8. Same table — Entourage Gummy × THC Form Delivered: remove `(preserved)`.
9. Same table — Entourage Gummy × Predictability: replace `offset` with `experience`.
10. Same table — Entourage Gummy × Social suitability: replace `predictable timing` with `predictable timing and non-sedating`.
11. Same table — Traditional Edibles × Social suitability: replace `Risky, delayed and unpredictable` with `Risky, delayed, unpredictable, and sedating`.

### Contact
1. **Email address changed** → `info@getentouragegummies.com` (NOT `entouragegummyinquiries@gmail.com` from the 2026-04-02 email; the new one supersedes).
2. **Location** → `Charlotte, North Carolina USA` (not Denver). Site likely hardcodes Denver somewhere.

### Other (blocks launch)
1. Age verification still needed (on entry already, need checkout re-verification).
2. Per-blend product pages (see Shop 2 above).
3. **FDA disclaimer** must appear on site (payment processor requirement).
4. **Farm Bill on every page** (currently `FarmBillBanner.tsx` exists — audit that it is mounted on every route, not just `/`).
5. Footer legal docs (Terms, Privacy, Refund, Shipping) on every page.
6. Contact email + hours of operation on contact page.

## Emails to Reread Before Any Work

Search Gmail for `Ktown OR Entourage` and check these threads:

- **Website Feedback Notes** (2026-04-10, msgId 19d78664f28ce676) — PDF attached, final round
- **Fwd: Hex Codes + Logo File for Website** (2026-04-07, msgId 19d68adb258f1886) — fonts
- **Fwd: Hex Codes + Logo File for Entourage Website** (2026-04-07, msgId 19d68319de643b41) — 4 PNG attachments
- **Website Feedback + Compliance Requirements** (2026-04-02, msgId 19d4f7a7466ddefd) — STARRED, hard blockers
- **Entourage Website Notes** (2026-03-29, msgId 19d3a99a2383bd3c) — Google Docs attachment
- **Website Notes** (2026-03-17, msgId 19cfbe65691a6041) — repositioning memo
- **Website Materials** (2026-03-05, msgId 19cbea655b631a49) — kickoff deck + package images
