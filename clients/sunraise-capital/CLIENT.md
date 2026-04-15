# SunRaise Capital — Client Profile

## Quick Reference

| Field | Value |
|-------|-------|
| **Company** | SunRaise Capital LLC |
| **Industry** | Residential Solar Infrastructure / Fintech |
| **CEO** | Nathan Jovanelly (Nate) |
| **Email** | support@sunraisecapital.com |
| **Address** | 4021 Church Street, Sanford, FL 32771 |
| **Hours** | Monday - Friday, 8:00am - 5:00pm EST |
| **Website (current)** | sunraisecapital.com |
| **LinkedIn** | linkedin.com/company/sunraise-capital-llc |
| **Status** | Active — Website redesigned and on GitHub, voice agent planned |
| **GitHub** | MonteKristoAI/sunraise-capital-website (private) |

---

## What SunRaise Capital Does

SunRaise Capital is the **Central Alignment Layer for Residential Solar** — a technology infrastructure platform (NOT a solar installer) that structurally aligns three stakeholders:

1. **Capital Partners** (investors) — deploy capital with IRR embedded at origination, institutional governance, full lifecycle asset management
2. **Installer Partners** (solar dealers) — next-business-day underwriting, diversified capital sources, faster funding, optional project ownership
3. **Homeowners** — no-pressure direct-to-consumer solar, utility-data-based pricing, 10-20% day-one savings, no sales calls

### Key Stats
- $200M+ third-party capital deployed
- 5,600+ assets underwritten and governed
- 13 active U.S. markets
- $8B annual TPO financing market
- 150+ installer partners
- 25-year asset management lifecycle

### Institutional Partners
BlackRock, Ares Management, Basalt Infrastructure Partners, US Bank

---

## Team

### Leadership
| Name | Role | Background |
|------|------|------------|
| **Nathan Jovanelly** | Founder & CEO | $3B+ deployed into solar, 150MW/$600M residential at IGS Solar, Chemical Engineer P.E., Board member SunVena Solar |
| **Michael d'Amato** | Head of Capital Markets | Led SPAC merger, scaled revenue 500%, deep capital markets + M&A experience |
| **Franklin Tarter** | Chief Technology Officer | Architected scalable solar software platforms, led product development from concept to enterprise |

### Board & Advisors
| Name | Role | Background |
|------|------|------------|
| **Binyam Giorgis** | Board Advisor | Former Managing Director at Deutsche Bank, 25+ years energy/capital markets |
| **Douglas R. Berry, CPA** | Board Advisor | 20+ years energy development and tax structuring, 450+ commercial solar projects |
| **Waylon Krush** | Board Advisor | Founder with exit to Motorola Solutions, cybersecurity/AI expert, 25+ years |

---

## Services Delivered

### 1. Website (Complete)
- **Location:** `clients/sunraise-capital/website/`
- **Stack:** HTML + Tailwind CDN + vanilla JS (static, no build step)
- **Localhost:** `python3 -m http.server 8080` from website directory
- **Pages:** 9 HTML pages + 3 blog articles + sitemap + robots.txt
- **Design system:** Plus Jakarta Sans (headings) + Inter (body), navy/gold palette, noise textures, bg-photo CSS variables

### 2. Voice Agent (Planned)
- AI receptionist to route callers: Capital Partner / Installer / Homeowner
- Ask if existing client or new prospect
- Collect info based on audience type
- Platform: Retell AI
- Status: Not started — website was priority

---

## Website Architecture

### Pages
| Page | File | Key Content |
|------|------|-------------|
| Homepage | `index.html` | Photo-backed hero (solar-aerial.jpg overlay), bento audience cards, workflow, track record, SVG savings chart, testimonials (initial avatars), magazine blog, 4-step booking wizard with calendar + FAQ |
| Capital Partners | `capital-partners.html` | Investor pitch — IRR, governance, model comparison, TPO ecosystem, asset management |
| Installer Partners | `installer-partners.html` | Dealer pitch — features grid, faster funding timeline, growth, project ownership |
| Homeowners | `homeowners.html` | Consumer pitch — comparison (traditional vs SunRaise), path to solar, savings, contract clarity |
| Platform | `platform.html` | Technology deep-dive — architecture diagram, IRR pricing, underwriting, portfolio governance |
| About | `about.html` | CEO spotlight, leadership team, board & advisors, values grid |
| Contact | `contact.html` | 3-audience routing cards, form + map + business info |
| Blog | `blog/index.html` | Listing + 3 articles (solar finance, TPO market, homeowner guide) |
| 404 | `404.html` | Branded error page |

### Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| Navy 950 | `#080e1a` | Darkest bg (hero, CTA, footer) |
| Navy 900 | `#0f1d33` | Dark sections |
| Navy 800 | `#1a2d4d` | Header glass |
| Sun 500 | `#e8971a` | Primary accent (CTAs, stat numbers) |
| Sun 700 | `#a95d0f` | Text accent on light bg (labels, links) |
| Cream | `#FAFAF7` | Alt light bg |
| Heading font | Plus Jakarta Sans | 500-800 weight |
| Body font | Inter | 400-700 weight |
| Border radius | 12px (buttons), 16px (cards), 20px (large) | NOT pill/9999px |

### MonteKristo Features (11/11)
All present: Review Gating, Multi-Step Booking Wizard (audience-branching), Inquiry Form, Chatbot Widget, Partner Marquee, Premium Hero, Testimonials, FAQ Accordion (ARIA), SEO Infrastructure (JSON-LD FinancialService + FAQPage), Mobile CTA Bar, Blog with 3 Posts

### Background Image System
Uses CSS `::before` pseudo-element with `--bg` CSS variable:
```html
<section class="bg-photo bg-photo-dark" style="--bg: url(images/photo.jpg)">
```
Variants: `bg-photo-light`, `bg-photo-cream`, `bg-photo-dark`, `bg-photo-masked`, `bg-photo-right`, `bg-photo-top`

### JS Components
| File | Purpose |
|------|---------|
| `js/main.js` | Scroll reveal, glass header, stat counters, rotating text, mobile menu, mega dropdown, chart animation |
| `js/review-modal.js` | Review gating (>=4 stars → Google Reviews, <4 → feedback form) |
| `js/booking-wizard.js` | 4-step audience-branching wizard with Calendly-style calendar picker + form validation |
| `js/chatbot-widget.js` | Floating chat with audience routing responses |
| `js/faq-accordion.js` | ARIA-compliant accordion with smooth height transitions |

---

## Assets

### Images (in `website/images/`)
| File | Content | Usage |
|------|---------|-------|
| logo.png | SunRaise Capital logo | Header, footer, favicon |
| nathan-jovanelly.png | CEO headshot | About page, testimonial |
| michael-damato.png | Head of Capital Markets | About page, testimonial |
| franklin-tarter.png | CTO | About page, testimonial |
| binyam-giorgis.png | Board Advisor | About page |
| douglas-berry.png | Board Advisor | About page |
| waylon-krush.png | Board Advisor | About page |
| solar-aerial.jpg | Aerial solar panels | Hero bg, testimonials bg |
| solar-field.jpg | Solar field | Audience cards, dark sections |
| solar-sunset.jpg | Panels at sunset | Blog featured image |
| solar-home-modern.jpg | Modern home with panels | Audience cards, blog |
| hero-solar-panels.jpg | Close-up panels | Audience cards |
| solar-panels-rows.jpg | Panel rows | Blog cards, bg texture |
| solar-panels-pattern.jpg | Panel grid pattern | Section bg texture |
| solar-tech-abstract.jpg | Tech abstract | Blog, bg texture |
| tech-globe-abstract.jpg | Globe/tech | Dark section bg |
| solar-dawn-sky.jpg | Dawn sky | Section bg texture |
| city-aerial-night.jpg | Night city | CTA section bg |
| blockchain-abstract.jpg | Abstract | Dark section bg |
| professional-meeting.jpg | Meeting photo | About/contact bg |

---

## Build History

| Date | Score | Key Changes |
|------|-------|-------------|
| 2026-04-07 | 62/100 | Initial build — Space Grotesk, stock photo hero, template cards |
| 2026-04-07 | 74/100 | New CSS system, photo hero, glassmorphism cards |
| 2026-04-07 | 82/100 | Gradient mesh hero, noise texture, institutional chart |
| 2026-04-07 | 85/100 | Clean SVG diagram, unique images, crossfade text |
| 2026-04-07 | 88/100 | Canvas constellation, testimonial photos, varied headings |
| 2026-04-08 | 91/100 | Complete homepage rewrite — bento grid, sticky workflow, magazine blog, combined booking+FAQ |
| 2026-04-08 | ~95 | Stat dedup, contrast fixes, section heading variation, rotating text motion |
| 2026-04-08 | Final | Plus Jakarta Sans font fix, bg-photo CSS variable system, padding reduction, broken comment fix |

---

## Pending / Next Steps

1. **Deploy** — Website on GitHub (MonteKristoAI/sunraise-capital-website), deploy to Vercel/Netlify/CF Pages
2. **Real Webhook Endpoints** — Replace hooks.example.com with n8n or real API endpoints for booking + review forms
3. **Voice Agent** — Build Retell AI receptionist (3-audience routing, existing/new client detection)
4. **OG Image** — Create 1200x630px branded social share image
5. **Partner Logos** — Replace text marquee with actual SVG logos (BlackRock, Ares, etc.)
6. **Tailwind Production Build** — Compile CDN to static CSS for performance
7. **Google Analytics** — GA4 setup
8. **Google Search Console** — Submit sitemap
9. **Real Testimonials** — Replace placeholder quotes with actual client feedback
10. **Privacy Policy + Terms** — Create legal pages
