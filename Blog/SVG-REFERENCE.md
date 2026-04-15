# SVG Chart Reference

All SVG charts must meet these standards:

| Property | Requirement |
|----------|-------------|
| Background | Transparent — no fill on root SVG |
| Text color | `fill="currentColor"` — never hardcoded hex |
| Grid lines | `stroke="currentColor" opacity="0.08"` |
| Role | `role="img"` on SVG element |
| Accessibility | `aria-label`, `<title>`, `<desc>` inside every SVG |
| ViewBox | `0 0 560 380` (standard) |
| Width | `style="width: 100%; display: block;"` — NO `max-width`. SVG scales to full container. |
| Font | `font-family: 'Inter', system-ui, sans-serif` |

**Color palette:**

| Color | Hex | Use |
|-------|-----|-----|
| Orange | `#f97316` | Primary / highest value |
| Sky Blue | `#38bdf8` | Secondary / comparison |
| Purple | `#a78bfa` | Tertiary / special category |
| Green | `#22c55e` | Positive indicator / Key Takeaways accent |

**Chart type diversity (never repeat a type in one post):**
Horizontal bar · Grouped bar · Donut · Line · Lollipop · Area · Radar
