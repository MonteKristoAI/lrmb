---
type: brand
client: AiiACo
date: 2026-04-11
tags: [aiiaco, brand, design-system]
---

# AiiACo Brand Reference

Blog templates port the main aiiaco.com Liquid Glass design system 1:1. This file is the reference for any new template or CSS work.

## Colors (CSS tokens from css/blog.css)

```
--void: #03050A          (deep background)
--deep: #060B14          (slightly lighter background layer)
--glass-dark: rgba(8, 14, 24, 0.72)     (glass card base)
--glass-mid: rgba(12, 20, 36, 0.60)
--glass-light: rgba(255, 255, 255, 0.04)
--glass-border: rgba(255, 255, 255, 0.10)
--glass-border-gold: rgba(184, 156, 74, 0.28)
--pearl: rgba(255, 255, 255, 0.88)      (primary text)
--pearl-muted: rgba(210, 220, 235, 0.72)
--pearl-dim: rgba(200, 215, 230, 0.45)
--gold: #B89C4A
--gold-bright: #D4A843
--gold-glow: rgba(184, 156, 74, 0.18)
--gold-glow-strong: rgba(184, 156, 74, 0.35)
--electric: rgba(255, 255, 255, 0.92)
--radius: 18px
```

## Typography

```
--font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif
--font-text: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif
```

Scale:
- `.display-headline`: clamp(32px, 6vw, 80px), weight 700, letter-spacing -1.5px
- `.section-headline`: clamp(26px, 4vw, 52px), weight 700, letter-spacing -0.8px
- `.article-title`: clamp(32px, 5.5vw, 60px), weight 700, letter-spacing -1.2px
- Blog body: 17px, line-height 1.75, `--font-text`
- H2 in body: clamp(24px, 3vw, 34px)
- H3 in body: clamp(19px, 2.2vw, 23px)

## Components

### Buttons
- `.btn-gold`: gradient `135deg rgba(184,156,74,0.95) -> rgba(212,168,67,0.80)`, radius 12px, weight 800, box-shadow `0 8px 30px rgba(184,156,74,0.30)`
- `.btn-glass`: `rgba(255,255,255,0.05)` + border `rgba(255,255,255,0.12)` + backdrop-filter blur(12px)

### Cards
- `.glass-card`: `var(--glass-dark)` + `var(--glass-border)` + radius 18px + blur(20px) + inner shadow
- `.glass-card-gold`: same with gold border variant

### Direct Answer block (AEO gold border)
- Background `rgba(184,156,74,0.06)`
- Border `rgba(184,156,74,0.18)` + left border `3px rgba(184,156,74,0.60)`
- Radius 8px, padding 24px 28px
- Label: uppercase, letter-spacing 0.18em, color `rgba(184,156,74,0.85)`
- Body: 16px, weight 500, color `rgba(230,220,200,0.92)`

### Callout (Operator signal, Compliance note, etc.)
- Same visual style as Direct Answer but with different label text
- Class: `<aside class="callout">` + `<p class="callout-label">{LABEL}</p>` + body `<p>`

### FAQ section
- Class: `<section class="faq-section">`
- Contains H2 title + H3/P pairs
- Each FAQ item: padding 22px 26px, background `rgba(255,255,255,0.025)`, border `rgba(255,255,255,0.07)`, radius 12px, margin-bottom 14px
- Extracts to FAQPage schema by build.js

## Navbar text (exact match to main site)

Left brand: logo + "AiiACo"
Nav items (desktop, left to right): Services, Method, Industries, Models, **Blog** (active), Upgrade
Right CTA: "Talk to AiiA" (nav-talk) + "Upgrade" (nav-upgrade gold button)
Mobile: hamburger opens full-screen menu overlay with same items

Announce bar (top of page, exact text):
> Operational Intelligence for Real Estate, Mortgage & Management Consulting.

## Footer text (exact 6-column match to main site)

Columns:
1. **Brand** - logo + "AiiACo - AI Integration Authority" description + sector line + URL
2. **Services** - AI Integration, AI Implementation, AI Automation, AI Governance, Engagement Models
3. **Solutions** - AI Revenue Engine, AI CRM Integration, AI Workflow Automation, AI for Real Estate, AI for Vacation Rentals
4. **Platform** - Method, Industries, Results, Case Studies, Blog & Insights, Diagnostic Intelligence
5. **Company** - Manifesto, Workplace, Upgrade, Privacy, Terms

All external links resolve to `https://aiiaco.com/...`. The blog `/blog/` link stays relative.

## Imagery

- Hero OG image: `/blog/images/og-default.webp`
- Logo: `/blog/images/logo-gold.webp`
- 19 images copied from main site `client/public/images/` into `aiiaco-blog/images/`
- All images are WebP + AVIF with responsive variants (from Round 3 pipeline)

## Brand spelling rules (updated 2026-04-11 after Manus HEAD audit)

- **AiiACo** (A-i-i-A-C-o, with capital C) - use everywhere in marketing, in body copy, in schema `@name` fields, in page titles, in author bylines. This is Nemr's established rule documented in the Manus HEAD commit `7668adf` which reverted 90+ AiiAco instances back to AiiACo.
- **AiA** - reserved for the voice agent product only. Never refers to the company.
- Never: AiiAco (lowercase c), Aiiaco, AIIACO, AI&Co, AI-Co, AIIACo

## Positioning one-liners

- "AI integration on top of your CRM, not a replacement for it."
- "AI revenue systems for operators, not vendors."
- "Integrator, not platform."
- "Real experience. Real stacks. Real ROI."

## Tone reference

See `STYLE.md` for the full voice guide. Short version: operator-to-operator, specific, contrarian when warranted, transparent about pricing and timelines, zero AI tells.
