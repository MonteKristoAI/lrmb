# Bridge Hospice — Current Website Analysis

**URL**: https://bridge-hospice.com/
**Analysis Date**: 2026-04-15
**Screenshots**: `clients/bridge-hospice/screenshots/` (26 files, desktop + mobile)

---

## Site Architecture

### Pages (15 total)
| Page | URL | Last Updated |
|------|-----|-------------|
| Homepage | `/` | 2026-02-19 |
| Our Services | `/our-services/` | 2025-06-09 |
| About Us | `/about/` | 2025-09-05 |
| Our Team | `/our-team/` | 2025-09-10 |
| Contact | `/contact/` | 2025-06-09 |
| Valor (Veterans) | `/valor/` | 2026-01-23 |
| Dave's Wish (Nonprofit) | `/daves-wish/` | 2026-02-09 |
| Volunteer | `/volunteer/` | 2025-11-21 |
| Our Volunteers | `/our-volunteers/` | 2025-11-21 |
| Volunteer Documentation | `/volunteer-documentation/` | 2026-04-13 |
| Counseling | `/counseling/` | 2025-08-14 |
| Referral | `/referral/` | 2025-07-02 |
| Careers | `/careers/` | 2025-06-09 |
| Gallery | `/gallery/` | 2025-10-27 |
| Animal Rescue | `/animal-rescue/` | 2025-09-10 |

### Blog Posts (11 total)
| Post | Last Updated |
|------|-------------|
| How Hospice Volunteers Change Lives | 2025-09-25 |
| How to Talk to a Loved One About Hospice | 2025-09-16 |
| Top 10 Questions Families Ask About Hospice | 2025-09-08 |
| Bridge Hospice Adopts HOPE Assessment | 2025-08-14 |
| Pain Awareness Month | 2025-08-14 |
| Time as a Gift | 2025-08-14 |
| Holiday Stress and Grief | 2025-08-14 |
| Celebrating Five Years | 2025-08-14 |
| A Legacy of Compassion | 2025-08-14 |
| Trying to Grow While Trying to Grieve | 2025-08-14 |
| Blog index | 2025-09-08 |

---

## Visual Design Assessment

### Overall Impression: 4/10

The current website has a **dated, template-heavy look** typical of mid-tier WordPress Avada builds from 2020-2022. It functions but does not inspire trust or emotional connection at the level a hospice organization deserves.

### Color Palette (Current)
| Element | Color | Assessment |
|---------|-------|-----------|
| Primary accent | Orange/amber | Feels generic, lacks warmth and gravitas |
| Secondary accent | Blue (nav links, buttons) | Standard healthcare blue, no personality |
| Backgrounds | White, light gray | Clean but sterile |
| Footer | Dark charcoal/navy | Adequate |
| Text | Dark gray/black | Readable |

**Problem**: Orange accent reads as "construction" or "retail" — not appropriate for end-of-life care. Needs warm, dignified tones (sage green, deep blue, soft gold, muted rose).

### Typography
- Generic sans-serif throughout (Avada defaults)
- No typographic hierarchy creating visual rhythm
- Headings lack weight and distinction
- **Problem**: No personality. Could be any business website.

### Layout Issues
1. **Homepage is cluttered** — too many sections competing for attention (awards badges, 6 service cards, video tabs, founder section, blog, all crammed together)
2. **Hero section is weak** — Bridge Port van image as hero is bizarre. The hero should be an emotional, human-centered image with a clear value proposition
3. **Award badges dominate** — Best of the West badges take up prime real estate above the fold. Awards should be secondary trust signals, not the focal point
4. **Services page is a wall of cards** — 12 identical orange-icon cards with small text. No visual hierarchy, no emotional storytelling
5. **Team page is a photo grid** — just headshots in rows. Missing: bios, stories, warmth. The placeholder orange circle icons for missing photos look broken
6. **About page is mostly text** — walls of text with minimal visual engagement
7. **Contact page is basic** — simple form + map, no warmth or reassurance

### Mobile Experience: 3/10
- Content stacks but doesn't adapt — just desktop shrunk
- Hero image becomes tiny and unreadable
- Navigation hamburger works but is basic
- Card grids don't optimize for touch
- Too much vertical scrolling with no hierarchy
- CTAs not thumb-friendly

### Images & Media
- **Quality varies wildly** — professional team photos mixed with phone-quality shots
- **Hero image (van)** is a strange choice — a vehicle as the first thing visitors see
- **Award badges** are low-res PNGs that look pixelated
- **Team photos** — some are well-lit studio portraits, others are casual/outdoor. No consistency
- **Dave's Wish photos** — genuine, emotional, but low production quality
- **Video embeds** — English/Spanish testimonial videos (good accessibility)

---

## Content Assessment

### Strengths
1. **Real stories** — Dave's Wish origin story is genuinely moving. David Wayne Schuchard's legacy is powerful
2. **Valor program** — unique veteran-specific hospice care is a strong differentiator
3. **Comprehensive services** — 12 distinct service offerings well-defined
4. **Award streak** — 5 consecutive Best of the West wins builds credibility
5. **Bilingual content** — English/Spanish video testimonials show inclusivity
6. **Community involvement** — volunteers, animal rescue, nonprofit arm

### Weaknesses
1. **No emotional hook on entry** — homepage opens with a van photo and awards. Should open with humanity
2. **Generic hospice language** — "compassionate care, dignified support" is what every hospice says. No unique voice
3. **No patient/family testimonials** (written) — only video embeds which many won't watch
4. **Blog is thin** — 11 posts, mostly from mid-2025, no posting cadence
5. **No clear conversion path** — scattered "Call Now" CTAs with no guided journey (family exploring hospice for the first time needs hand-holding)
6. **Missing trust signals** — no Google reviews widget, no success stories, no outcome data
7. **Referral page is buried** — healthcare providers (key referral source) need a clear, fast path
8. **No FAQ section** on main pages (only a blog post about FAQs)
9. **No "What to Expect" journey** — families have no idea what the hospice process looks like

---

## Technical Assessment

### Platform
- **CMS**: WordPress with Avada theme (ThemeFusion)
- **SEO Plugin**: Yoast SEO
- **Sitemaps**: 7 child sitemaps (page, post, portfolio, category, tag, portfolio_category, element_category)
- **Avada portfolio** sitemap exists (likely unused gallery feature)

### Performance (Estimated from observation)
- Heavy Avada theme = bloated CSS/JS
- Multiple unoptimized images
- No visible lazy loading
- No visible caching headers
- Mobile homepage timed out at 30s during our screenshot capture — performance concern

### SEO Issues
- **Meta descriptions**: likely incomplete (Yoast installed but quality unknown)
- **Title tags**: "Hospice Care in Lubbock - Bridge Hospice" is decent for homepage
- **Schema markup**: unknown (needs audit)
- **Internal linking**: weak — pages feel siloed
- **Blog publishing frequency**: ~11 posts total, no recent activity
- **Page speed**: likely poor due to Avada bloat

---

## Competitive Positioning

### What Bridge Hospice Has That Others Don't
1. **Valor (Veterans Division)** — most hospices don't have a dedicated military program
2. **Dave's Wish (Nonprofit Arm)** — unique financial assistance program
3. **5x Best of the West** — strongest local award streak
4. **Bilingual care** — English/Spanish services
5. **Founder story** — Tammie Ware's personal connection

### What's Missing vs. Top Hospice Websites
1. Virtual tours / "Day in the Life" content
2. Family resource center (downloadable guides, checklists)
3. Interactive "Am I Eligible?" tool
4. Provider/referral portal
5. Grief resource library
6. Community events calendar
7. Staff bios with personal stories
8. Patient/family video testimonials (modern production)
9. Accessibility compliance (WCAG)
10. Live chat or 24/7 digital intake

---

## Recommendations for New Website

### Design Direction
- **Warm, dignified, human-centered** — soft color palette (sage, cream, deep blue, muted gold)
- **Photography-led** — large, high-quality images of real caregiving moments, families, community
- **Generous whitespace** — breathing room reflects the peace Bridge Hospice provides
- **Serif + sans-serif pairing** — serif for headings (warmth, tradition), sans-serif for body (clarity)
- **Subtle animations** — fade-ins, parallax, not flashy. Respectful motion.

### Information Architecture (Proposed)
```
Homepage (emotional hero + trust signals + conversion paths)
├── For Families/
│   ├── Our Services
│   ├── What to Expect (patient journey)
│   ├── Am I Eligible? (interactive)
│   ├── Family Resources (downloadable guides)
│   └── FAQs
├── For Healthcare Providers/
│   ├── Make a Referral (streamlined form)
│   └── Partner With Us
├── Special Programs/
│   ├── Valor (Veterans)
│   ├── Dave's Wish (Nonprofit)
│   └── Animal Rescue
├── About/
│   ├── Our Story
│   ├── Our Team (with real bios)
│   ├── Awards & Certifications
│   └── Gallery
├── Get Involved/
│   ├── Volunteer
│   ├── Careers
│   └── Donate (Dave's Wish)
├── Resources/
│   ├── Blog
│   ├── Grief Support
│   ├── Counseling Services
│   └── Community Events
└── Contact (24/7 prominence)
```

### Priority Features for New Build
1. **Emotional hero with clear CTA** — "Your family deserves peace. We're here."
2. **Trust bar** — CHAP certified, 5x Best of the West, Women Owned, 24/7 care
3. **Patient journey visualization** — "What to Expect" step-by-step
4. **Provider referral portal** — fast, minimal friction
5. **Testimonials carousel** — real family quotes + video
6. **Team profiles with stories** — not just headshots
7. **Dave's Wish storytelling section** — the origin story is the heart of the brand
8. **Valor veteran showcase** — honor and dignity
9. **Blog with publishing cadence** — SEO + thought leadership
10. **Accessibility** — WCAG 2.1 AA (required for healthcare)
11. **Spanish language toggle** — bilingual audience
12. **Mobile-first responsive** — most hospice searches happen on phones during stressful moments
13. **Live chat / 24/7 intake form** — digital front door matching 24/7 care promise

---

## Screenshots Inventory

### Desktop (1440px) — 14 pages
| File | Page |
|------|------|
| `homepage-desktop.png` | Homepage |
| `services-desktop.png` | Our Services |
| `about-desktop.png` | About Us |
| `team-desktop.png` | Our Team |
| `contact-desktop.png` | Contact |
| `valor-desktop.png` | Valor (Veterans) |
| `daves-wish-desktop.png` | Dave's Wish |
| `volunteer-desktop.png` | Volunteer |
| `counseling-desktop.png` | Counseling |
| `referral-desktop.png` | Referral |
| `careers-desktop.png` | Careers |
| `gallery-desktop.png` | Gallery |
| `blog-desktop.png` | Blog |
| `animal-rescue-desktop.png` | Animal Rescue |

### Mobile (375px) — 7 key pages
| File | Page |
|------|------|
| `homepage-mobile.png` | Homepage |
| `services-mobile.png` | Our Services |
| `about-mobile.png` | About Us |
| `team-mobile.png` | Our Team |
| `contact-mobile.png` | Contact |
| `valor-mobile.png` | Valor (Veterans) |
| `daves-wish-mobile.png` | Dave's Wish |
