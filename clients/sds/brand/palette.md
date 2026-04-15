# SDS / Warrior — Brand Palette (Manifesto v4)

**Status:** Locked as of 2026-04-07 email. Subject to final SDS management review.

## Colors

| Role | Hex | CSS Variable | Usage |
|---|---|---|---|
| Slate Base | `#182939` | `--sds-slate` | Hero backgrounds, nav bar, footer, dark section breaks |
| Signal Blue | `#3498DB` | `--sds-signal` | CTAs, links, hover states, primary buttons, line icons |
| Steel Mid-Blue | `#4B86B4` | `--sds-steel` | Secondary text, subheadings, card borders, icon strokes |
| White | `#FFFFFF` | `--sds-white` | Body text on dark, card surfaces |
| Gold / Brass gradient | `#C09C00 → #C8B44F` (fallback `#C6A92B`) | `--sds-gold` | Section dividers, "34 years" heritage badge, hover highlights, footer tagline |
| Dark Text | `#1A2A3A` | `--sds-dark` | Body copy on white backgrounds |

## Gold Gradient Rule
Apply as `linear-gradient(#C09C00, #C8B44F)` on section dividers, heritage badges, and premium accents. Use the solid fallback `#C6A92B` for any element under 14px where gradients lose fidelity.

## CSS Starter
```css
:root {
  --sds-slate: #182939;
  --sds-signal: #3498DB;
  --sds-steel: #4B86B4;
  --sds-white: #FFFFFF;
  --sds-dark: #1A2A3A;
  --sds-gold-1: #C09C00;
  --sds-gold-2: #C8B44F;
  --sds-gold: #C6A92B;
}
.sds-gold-gradient {
  background: linear-gradient(90deg, var(--sds-gold-1), var(--sds-gold-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

## Typography
**Arial** or comparable system sans-serif. Bold for headings, regular for body.
- **No script fonts**
- **No decorative fonts**
- Type should feel engineered, not designed.

## Identity Pillars
- **Rugged Tech** — high-contrast, industrial
- **Modern Wisdom** — history proves future-readiness
- **Verifiable Integrity** — "battle-tested" over "legacy"
- **Culture** — peer-to-peer, engineer-to-engineer
- **Stewardship of Resources** — energy transition (oil → geothermal)

## Visual Tone
- Dark, high-contrast photography (selective lighting on equipment and operators)
- Desaturate slightly, overlay with Slate Base tint at 10–20% opacity
- Simple line icons — no filled/solid, no rounded/playful styles
- Generous whitespace on light sections, dense info on dark sections

## Footer Tagline
**"Digital precision for a physical world."** — gold gradient.
