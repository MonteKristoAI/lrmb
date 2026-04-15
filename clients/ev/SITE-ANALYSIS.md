# EV (evcam.com) - Full Site Analysis

**Date:** 2026-04-15
**Analyst:** MonteKristo AI
**Purpose:** Pre-redesign audit of current evcam.com

---

## 1. Site Architecture

**Total pages:** 98 (mapped via Firecrawl)
**CMS:** Umbraco (Windows/IIS hosting)
**Domain:** evcam.com (www.evcam.com)

### Full Site Tree

```
evcam.com/
│
├── Homepage
│   ├── Hero video (animation-poster.jpg background)
│   ├── Challenge selector (11 options)
│   ├── Challenge cards (8 with hover video)
│   ├── Conveyance options (4 cards)
│   ├── AIVA section (YouTube embed)
│   ├── ClearVision section (YouTube embed)
│   ├── Sustainability section (YouTube embed)
│   ├── Video of the Month signup (YouTube embed)
│   ├── Contact sidebar (rotating regional contacts)
│   ├── Latest News (3 cards)
│   └── Footer (VA logo, about blurb, login link)
│
├── Challenges/ (8 pages)
│   ├── /challenges/perforation
│   ├── /challenges/corrosion
│   ├── /challenges/fish
│   ├── /challenges/restriction
│   ├── /challenges/valve
│   ├── /challenges/sand
│   ├── /challenges/water
│   └── /challenges/leak
│
├── Visual Analytics Solutions/ (9 pages)
│   ├── /visual-analytics-solutions/perforation-va
│   ├── /visual-analytics-solutions/corrosion-va
│   ├── /visual-analytics-solutions/fish-va
│   ├── /visual-analytics-solutions/restriction-va
│   ├── /visual-analytics-solutions/valve-va
│   ├── /visual-analytics-solutions/sand-va
│   ├── /visual-analytics-solutions/plug-va
│   ├── /visual-analytics-solutions/water-va
│   └── /visual-analytics-solutions/leak-va
│
├── Technology/ (8 pages + 4 conveyance sub-pages)
│   ├── /technology/technology-overview
│   ├── /technology/extreme-video
│   ├── /technology/clearvision
│   ├── /technology/optis-infinity
│   ├── /technology/optis-infinity-ivc
│   ├── /technology/optis-unity (NEW - Nov 2025)
│   └── /technology/conveyance/
│       ├── /slickline
│       ├── /electric-line
│       ├── /coiled-tubing
│       └── /drill-pipe
│
├── Pipeline & Infrastructure/ (3 pages)
│   ├── /pipeline-and-infrastructure (landing)
│   ├── /pipeline-and-infrastructure/pigcam-4
│   └── /pipeline-and-infrastructure/pigcam-8
│
├── Software & Data Analysis/ (7+ pages)
│   ├── /software-data-analysis (landing)
│   ├── /software-data-analysis/aiva
│   ├── /software-data-analysis/log-analysis
│   ├── /software-data-analysis/multi-finger-image-processing-software-mips
│   ├── /software-data-analysis/pipe-integrity-platform-pip
│   ├── /software-data-analysis/pipe-deformation-analysis-pda
│   ├── /software-data-analysis/the-ev-web-portal
│   └── /software-data-analysis/aiva-support/
│       ├── /aiva-how-to-videos
│       ├── /faqs
│       └── /getting-started
│
├── Case Studies/ (~40+ pages, paginated)
│   └── Categories (21): Perforation, Scale, Sand, Leak, Fracking,
│       Coiled Tubing, Slickline, Restriction, Fish, Valve,
│       Integrated Solutions, Integrity, Services, Drill Pipe,
│       Corrosion, Electric Line, Fluid Entry, Open Hole,
│       Milling, Safety Valves, Water
│
├── News/ (paginated)
│   ├── EV Announces CEO Transition (06 Jan 2026)
│   ├── EV Unveils Optis Unity at ADIPEC (03 Nov 2025)
│   ├── EV and INLINE Services Announce Technical Collaboration (30 Oct 2025)
│   └── EV Turns 25! (03 Mar 2025)
│
├── Sustainability/
├── Email Sign-up/
├── Visual Analytics/ (about/overview)
└── Contact/ → 404 ERROR
```

---

## 2. Content Inventory

### Homepage Content
- **Hero:** Full-width video with "REVOLUTIONIZING VISUAL ANALYTICS" H1
- **Challenge Selector:** Dropdown-style selector with 11 options (9 VA + 2 PigCAM)
- **Challenge Cards:** 8 cards with static images that play video on hover
- **Conveyance Cards:** 4 simple image+text cards (Slickline, Electric Line, Coiled Tubing, Drill Pipe)
- **AIVA Section:** H3 heading, embedded YouTube video, brief description, CTA to AIVA page
- **ClearVision Section:** H3 heading, YouTube embed, description as "world's only integrated array video and phased array ultrasound"
- **Sustainability Section:** YouTube embed, commitment statement
- **Video of the Month:** YouTube embed, email signup CTA
- **Contact Sidebar:** Regional office address (Scotland) with David Fisher contact
- **News:** 3 latest news cards with images, titles, dates
- **Footer:** VA logo, EV logo, about statement, login link

### Technology Content
- **Technology Overview:** Rich text about innovation, in-house R&D, technology centers
- **Capabilities list:** Camera optics, high-temp electronics, signal compression, image analysis, data analytics, data communication, mechanical engineering, manufacturing
- **Key stats:** HD, high frame-rate, 20,000 psi, 200C+

### Product Pages (Extreme Video)
- **Optis R150:** Real-time, full color, 25fps, 150C, 6 hours
- **Optis M160:** Color video, 25fps, 160C
- **Basis R200:** Monochrome, 200C, 1034 bar
- **MagCam:** Magnetic carrier + HD video, mini-fish extraction
- **UVCam:** UV lighting, hydrocarbon identification
- **VesselCam:** Confined space inspection, water jets + variable lighting
- **WedgeCam:** Flapper window manipulation with real-time video

### Pipeline Content
- **PigCAM 4:** 4 cameras, 360 view, 24hr runtime, small diameter pipelines
- **PigCAM 8:** 8 cameras, 360 view, 96hr runtime, up to 176km, large diameter
- **INLINE Speed Control Pig collaboration:** Active speed control, 10mph inspection speed
- **Applications:** Corrosion assessment, coating inspection, crack/leak detection, blockage quantification

### Software Content
- **AIVA:** All-in-one platform for customer deliverables, secure storage, intuitive display
- **MIPS:** Industry-leading multi-finger caliper processing and interpretation
- **PIP:** Extended well integrity sensor analysis
- **PDA:** 3D quantified pipe deformation analysis
- **EV Web Portal:** Customer data access

### Case Studies (sampled titles)
- Restriction Analytics in Geothermal Injection
- PigCAM 8 for CCUS Pipeline Repurposing
- Combined Video + Ultrasound in Enhanced Geothermal
- SandVA for Sand Management
- AIVA Swift Leak Resolution (Offshore)
- ClearVision 100% Perforation Capture
- PlugVA Stage Plug Performance
- ValveVA Safety Valve Failures
- Multiple Geothermal case studies (declining injectivity, well integrity, scale)

---

## 3. Technical Analysis

### Meta Tags
| Tag | Homepage Value | Issue |
|-----|---------------|-------|
| title | "Revolutionizing Visual Analytics \| EV" | OK but generic |
| description | "EV's Video Cameras provide a complete, quantified picture..." | OK |
| robots | **noindex** | CRITICAL - homepage not indexed |
| language | en | OK |
| viewport | width=device-width, initial-scale=1 | OK (repeated 5x) |
| og:image | **null** | Missing |
| google-site-verification | Present | Verified |

### Performance Observations
- 4 YouTube embeds on homepage (each loads ~1MB+ of YouTube scripts)
- Images served via CMS image processor with quality and sizing params
- Custom font (Blender-Pro-Medium) - likely self-hosted
- No visible lazy loading implementation
- No visible service worker or PWA features
- Multiple large header images per page

### URL Structure
- Clean, hierarchical URLs
- Consistent naming convention (lowercase, hyphens)
- Deep nesting for some pages (3-4 levels)
- Some URL slugs are excessively long (/multi-finger-image-processing-software-mips)

---

## 4. Design Assessment

### Layout Patterns
- **Full-width hero images** on every section landing page
- **Breadcrumb navigation** (HOME > SECTION > PAGE)
- **Card grids** for challenges and case studies
- **YouTube embed sections** with text descriptions
- **Contact sidebar** with regional office info (appears on most pages)
- **Consistent footer** with VA and EV logos

### Typography
- Single font family (Blender-Pro-Medium) for everything
- H1/H2 at 64px (large, uppercase)
- Body at 19.2px
- All-caps headings throughout

### Color Usage
- Orange `#FF5A00` as primary accent (links, hover states)
- Dark slate `#333F48` for text
- Blue `#007BFF` as secondary (minimal use)
- White backgrounds throughout
- Dark overlays on hero images

### Design Weaknesses
1. **Monotonous layout** - every page follows the same hero+text+cards+contact pattern
2. **No visual hierarchy** - all sections look the same weight
3. **No interactive elements** beyond video hovers on challenge cards
4. **No data visualization** - a data analytics company with no charts, graphs, or interactive data
5. **Dated aesthetic** - feels 2015-era enterprise website
6. **No animations or micro-interactions** beyond card hovers
7. **Poor whitespace usage** - content feels cramped in places
8. **No dark mode** or visual contrast variation

---

## 5. Information Architecture Issues

### Duplicate/Confusing Structure
- **Challenges** (/challenges/perforation) and **VA Solutions** (/visual-analytics-solutions/perforation-va) cover the SAME topics
- The distinction between "here's the problem" (Challenges) and "here's our solution" (VA Solutions) is unclear to users
- **Recommendation:** Merge into unified solution pages that present problem -> solution -> case study flow

### Missing Pages
- No About/Company page
- No Team/Leadership page (new CEO not featured)
- No Careers page
- No Partners/Clients page
- No FAQ page (except AIVA-specific)
- No Privacy Policy (GDPR concern)
- Contact page is 404

### Navigation Gaps
- No search functionality for 98 pages
- Case studies lack a results/outcomes focus
- No "Industries" section despite serving Oil & Gas, Geothermal, Pipeline, CCUS
- No clear path from "I have a problem" to "contact us for a solution"

---

## 6. Competitor Positioning Notes

EV operates in the downhole video and well intervention diagnostics market. Their key differentiators vs competitors:
- **ClearVision** is positioned as the "world's only" integrated video + ultrasound system
- **Visual Analytics** as a product category is unique to EV (computational analysis layered on video)
- **PigCAM** with INLINE speed control partnership is a competitive advantage
- **AIVA** as a cloud platform positions them as tech-forward vs traditional service companies
- 25-year track record with global operations

### What competitors do better (implied from gaps)
- Strong "About" stories with leadership profiles and company culture
- Interactive product configurators
- ROI calculators and value quantification tools
- Client logos and partnership badges for social proof
- Gated content (whitepapers, webinars) for lead generation
- Modern, immersive web experiences with 3D product viewers

---

## 7. Recommendations for New Site

### Must-Have Improvements
1. Fix the fundamentals: proper meta tags, working contact page, OG images
2. Unified solution pages (merge Challenges + VA Solutions)
3. Clear CTA journey on every page (Demo, Quote, Consultation)
4. About/Company section with leadership, history, global offices
5. Industry-focused landing pages (Oil & Gas, Geothermal, Pipeline/CCUS)
6. Modern case study presentation with results/ROI focus
7. Self-hosted video with lazy loading (replace YouTube embeds)
8. Interactive product explorer or configurator
9. GDPR compliance (cookie consent, privacy policy)
10. Search functionality

### Design Direction
- Move from static enterprise site to **immersive, data-driven experience**
- Dark theme option that matches the "downhole" aesthetic
- 3D or parallax product visualization
- Animated data/stats on scroll
- Interactive challenge-to-solution flow
- Video backgrounds with performance optimization
- Mobile-first responsive design

---

## Appendix: All Mapped URLs

98 URLs captured - see Firecrawl map data in project files.
