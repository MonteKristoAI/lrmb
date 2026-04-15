# Entourage Gummies -- Blog Discovery

**Created:** 2026-04-11
**Status:** Phase 0 of blog-onboard pipeline complete
**Source:** Gmail thread audit, clients/entouragess/CLIENT.md, packaging copy, official brand assets from Seamus McKeon

---

## Business

- **Legal / Parent:** K'town Squishes (Sandy Adams, owner-operator)
- **Brand:** Entourage Gummies
- **Website:** getentouragegummies.com (pre-launch, currently `clients/entouragess/` Vite+React build)
- **Location:** Charlotte, North Carolina, USA (confirmed in 2026-04-10 feedback PDF, corrects earlier "Denver" placeholder)
- **Manufacturer:** Carolina Natural Solutions (same parent as GummyGurl — Seamus McKeon is the packaging designer and process lead)
- **Intro via:** John Rice, AI Savants (john@aisavants.io)

## Product Positioning

Entourage Gummies are hemp-derived, Farm-Bill-compliant THC + CBD + terpene gummies designed to recreate the full-spectrum cannabis smoking experience in a precisely-dosed edible. The brand is built on two equal pillars — not one — and this balance is critical to every piece of content:

1. **Entourage-mimicking formulation** — THC / CBD / terpene ratio calibrated to reproduce the interaction profile of smoked flower
2. **TiME INFUSION** — proprietary infusion process that wraps each cannabinoid molecule in a hydrophilic coating for fast, predictable onset

North-star positioning line from the back of the packaging (treat as the single source of truth):

> The result of the entourage mimicking formulation and the TiME INFUSION delivery system is a consistent, easy to dose effect designed for clarity, enjoyment, and connection. It delivers a social, sessionable gummy experience rather than a heavy or sedating one.

### SKUs (three effects)

| Effect | Hex | Positioning |
|---|---|---|
| Relaxed | `#029b78` (green) | Wind-down, introverted sessions |
| Balanced | `#e2b829` (gold, brand default) | Everyday, sessionable, social |
| Uplifted | `#b21e41` (pink/red) | Daytime, creative, energetic |

Each SKU will ship in 2 strengths × 2 pack sizes each:
- Single-gummy pack (1 gummy)
- 100mg total-THC pack (either 10 × 10mg gummies or 4 × 25mg gummies depending on strength)

Serving = 10mg.

## Audience

Primary: current cannabis flower smokers (18-45) who want a precisely-dosed, sessionable edible that mimics the smoking experience without the heavy/sedating effects of traditional edibles. Secondary: wellness-curious adults who reject the "get blasted" aesthetic of most edible brands and want clear-headed, social dosing.

Sandy explicitly rejects "medical/clinical" framing and "get high" framing — the brand voice is social, sessionable, clarity-focused.

## Brand System

### Colors (official from Seamus, 2026-04-07)

| Hex | Role |
|---|---|
| `#029b78` | Relaxed |
| `#b21e41` | Uplifted |
| `#e2b829` | Balanced / Gold (brand default) |
| `#faf6f0` | Off-white foreground text |
| `#000000` | Background |

### Fonts (official)

- **Balboa Plus Fill** — logo + display headings
- **Roc Grotesk (Light)** — sub-headings
- **Futura (Book)** — body + ingredients + detail

Font files are not yet on disk. Blog will run with Google Fonts fallback (Inter + Fraunces) until the real files land in `public/fonts/`.

### Logo + Silhouettes

Official assets downloaded to `clients/entouragess/_client-docs/`:
- `entourage-gold-logo-official.png`
- `entourage-green-logo-official.png`
- `entourage-pink-logo-official.png`
- `entourage-hex-codes.png` (the hex card shown above)

Silhouettes (human figures embodying each effect) already live in `clients/entouragess/src/assets/` and must appear on every page per Sandy's explicit instruction. Blog will carry them on hero + cards.

## Compliance (payment processor hard blockers)

These apply to the main site AND the blog. Every blog page must carry all six:

1. Farm Bill notice visible on every page
2. Age gate (21+) on blog entry and at checkout
3. Legal footer: Terms, Privacy, Refund Policy, Shipping Policy on every page
4. Contact page shows business email (`info@getentouragegummies.com` — updated 2026-04-10, supersedes earlier `entouragegummyinquiries@gmail.com`) and hours of operation
5. FDA disclaimer somewhere on the site
6. COAs accessible (product-level, not blog)

## Content Rules (strict)

1. **ZERO em dashes** site-wide. Sandy calls them "AI dashes." Replace every `—` and `–` with commas, periods, or rewritten sentences. Build-time validation will fail any post containing them.
2. **TiME INFUSION** — proper noun, stylized exactly: lowercase `i` in `TiME`, all caps `INFUSION`. Never used as a verb ("TiME INFUSION is the infusion process that ...", never "TiME INFUSION absorbs ..."). Build-time validation will fail wrong-case variants.
3. **AZUCA is forbidden.** The Preclinical Pharmacokinetic Data chart must be re-drawn from scratch and the footnote must never mention Azuca or "funded by Azuca." Azuca cannot appear anywhere, ever.
4. **Gummy company > infusion tech.** The brand is a gummy company whose moat happens to include a proprietary infusion process. Do not let TiME INFUSION dominate the tone. Company name, tagline, and silhouettes must be present on every page.
5. **No "high" language** in FAQ or product copy (per 2026-04-10 feedback: the "what makes these different from other edibles" answer must not use the word "high").
6. **Terpenes use Greek letter form** — `β-Caryophyllene`, not `Beta Caryophyllene`.
7. **"It's About TiME"** — Pillar 2 title stylization with capital M and E. Use this phrasing consistently when referring to onset/timing claims.
8. **The real entourage effect passage** (from 2026-04-10 feedback, copy-ready): "Cannabis flower contains hundreds of compounds, and when it is smoked, all of them are consumed at once. The experience the smoker gets is the result of all of those compounds working together and not just THC. THC drives the experience, CBD smooths it out, and terpenes shape the character." Use this verbatim or very close to it on the hub post.

## Tech + Platform Decisions

- **Main site:** Vite + React 18 + TypeScript + shadcn/ui (Lovable origin). SPA, not pre-rendered. Hosting: TBD (Cloudflare Pages candidate).
- **Blog platform decision:** Static HTML + Cloudflare Worker reverse proxy. Same pattern as gummygurl-blog and luxeshutters-blog. Subfolder `/blog/` preferred over subdomain per Pattern P-002 (25% better organic growth). Separate GitHub repo: `MonteKristoAI/entouragess-blog`.
- **Why static HTML:** the main site is an SPA with no pre-rendering, which is the fatal flaw Pattern P-009 warns against. Static HTML blog is crawlable out of the box, faster, and doesn't depend on the main site's infrastructure being ready.
- **Build:** Node-based `build.js` that reads `posts/*.html` files with META-block frontmatter and generates a `dist/` folder with post pages, index, sitemap, RSS.
- **Author byline:** Sandy Adams as owner-author for narrative pieces; Carolina Natural Solutions team credit on process/science pieces with Seamus McKeon as process expert.

## E-E-A-T Assets

- **Experience:** Sandy's story of transitioning from cannabis smoker to edible maker because existing edibles couldn't recreate the smoking experience
- **Expertise:** Carolina Natural Solutions as manufacturer, Seamus McKeon as process lead, third-party lab COAs for every batch
- **Authoritativeness:** Charlotte NC DTC hemp brand, Farm-Bill-compliant, publishes its own formulation science
- **Trust:** COAs on every product page, transparent manufacturing partner, FDA disclaimer, strict 21+ gating, no medical claims

## Open Blockers (on Sandy's side)

- COAs (in progress, ETA week of 2026-04-13)
- Product photos (in progress, same ETA)
- Legal copy for Terms, Privacy, Refund, Shipping policies (attorney drafted, waiting for Sandy to fill in details)
- Chart citation image for the entourage-effect chart (remade from scratch without Azuca attribution)
- Font files (.woff2 for Balboa Plus Fill, Roc Grotesk Light, Futura Book) — not yet delivered

**On our side (blog-specific):**
- No voice corpus from Sandy yet (Pattern P-014 — need 5+ written samples before post #2)
- ESP not chosen (Klaviyo likely given Carolina Natural Solutions uses it on gummygurl, but not confirmed)
- Main site not on Cloudflare yet, so Worker route can't be bound (will build + verify locally only)

## Assumptions to Validate in Phase 1

1. Hemp-derived THC gummies have real search demand around "entourage effect," "fast-acting thc gummies," "nano thc gummies," and "hemp thc gummies that work"
2. The main competitors with blogs are national DTC hemp brands (not local NC brands), so local SEO is a weak lever for Phase 1
3. Head-term SERPs are dominated by listicles and brand product pages — blog posts can rank for comparison, science, and problem-solving queries
4. There is a content gap around honest discussion of the "edibles problem" (unpredictable onset, heavy body-hit, being knocked out) that Entourage can own

## Questions for the User

These will go to Sandy when Sandy is next in the loop, via the user:

1. Subfolder or subdomain for the blog?
2. ESP / newsletter platform? (Klaviyo / Mailchimp / Beehiiv / other)
3. Do we have permission to write the seed post as publishable content now, or hold until voice corpus is collected?
4. Push `entouragess-blog` repo to MonteKristoAI GitHub org now or after Sandy signs off on the seed post?
