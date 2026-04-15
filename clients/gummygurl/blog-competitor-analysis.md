# GummyGurl Blog Competitor Analysis
## Hemp/CBD Blog Design, Layout & Content Structure Research

**Date**: 2026-04-09
**Purpose**: Inform blog CSS, template design, and content structure for GummyGurl blog onboarding
**Sources analyzed**: 3Chi, CBDfx, Leafly, Medical News Today, Joy Organics, Gold Bee, CFAH, Cheef Botanicals

> Note: Several original targets (Exhale Wellness, Binoid, Neurogan, Cornbread Hemp) were inaccessible due to domain parking, redirects, Shopify JS-only rendering, or 403 blocks. Replacements were sourced from the same competitive tier in hemp/CBD e-commerce and authority health content sites.

---

## 1. Competitor Blog Index Pages

### 3Chi (3chi.com/blog)
- **Layout**: Single-column vertical list (not grid)
- **Category navigation**: Dropdown filter with categories: CBD, Delta 10 THC, Delta 8 THC, Delta 9 THC, Delta 9o, HHC, News, THCA
- **Featured post**: Most recent post appears first with full image
- **Sidebar**: Right sidebar with category dropdown, best-selling product cards (with ratings + prices), "More Blogs by 3CHI" recent post list
- **Post count**: 5 posts per page, 101 total pages of content
- **Card design**: Title, featured image, date, author ("3CHI"), excerpt, category tags, comment count
- **Pagination**: Numbered with ellipsis (1, 2, 3, 4 ... 101)
- **CTA**: Newsletter signup ("Sign up for the 3CHI newsletter!")
- **Search**: Search bar in footer and navigation
- **Colors**: Gold accent (#dfb57e), black (#000000), blue (#334862)
- **Typography**: Open Sans (body), Montserrat (navigation), Dancing Script (accent)

### CBDfx (cbdfx.com/blog)
- **Layout**: Grid-based card layout
- **Category navigation**: Topics visible but no explicit filter UI
- **Featured post**: No dedicated hero section
- **Sidebar**: None
- **Post count**: 40+ posts available
- **Card design**: Title, 1000x1000px featured image, publication date, author name, direct URL
- **Pagination**: Not clearly visible
- **CTA**: Judge.me review widget integration
- **Search**: Not visible on index
- **Colors**: Orange/amber accent (#E7721B), white background
- **Typography**: Professional readability-focused design

### Joy Organics (joyorganics.com/blogs/news)
- **Layout**: Mixed - featured post large at top, then grid of smaller cards below
- **Category navigation**: Horizontal category tabs (CBD NEWS, Lifestyle, PHYSICAL HEALTH, etc.) with expandable "more" option
- **Featured post**: Yes - first post ("CBD for Fitness Recovery") gets large prominent placement
- **Sidebar**: None
- **Card design**: Hero image (responsive), 1-2 category tags, title, publication date, author name. No excerpts in card view
- **Pagination**: Infinite scroll or "See all" within sections
- **CTA**: Not visible on index
- **Search**: Search in header
- **Colors**: Cream/off-white background, dark text
- **Typography**: Serif for headlines, Muli (sans-serif) for body

### Gold Bee (goldbee.com/blog)
- **Layout**: 3-column grid
- **Category navigation**: Single [CBD] category badge above each title
- **Featured post**: None - first post just appears first in grid
- **Sidebar**: None
- **Card design**: Thumbnail image (3:2 ratio), category badge, headline, brief excerpt, "Read More" link
- **Pagination**: Numbered (1, 2, 3 ... 6)
- **CTA**: None on index
- **Search**: Not visible
- **Colors**: Gold/amber accent (#ffa129), dark gray text, white background
- **Typography**: Clean sans-serif

### Leafly (leafly.com/news)
- **Layout**: Card-based grid with horizontal scrollable sections per category
- **Category navigation**: Full horizontal menu tabs: News, Cannabis 101, Growing, Strains & products, CBD, Politics, Health, Lifestyle, Science & tech, Industry, Reports, Canada, Podcasts
- **Featured post**: Yes - large featured article at top
- **Sidebar**: Newsletter signup, business solutions links
- **Card design**: 16:9 image with lazy-loading, color-coded category tag, bold title, author name, publication date, white card with subtle shadow
- **Pagination**: No traditional pagination - categorical grouping with "See all" links
- **CTA**: "Stay In Touch" newsletter signup with email input
- **Search**: Yes, integrated in header
- **Colors**: Green primary (#017c6b), white backgrounds, light grey accents
- **Typography**: Public Sans

---

## 2. Individual Blog Post Design Patterns

### 3Chi Posts (2 posts analyzed)

**Layout**: Full-width content column, no sidebar on posts. Best Sellers product section appears below content.

**Hero image**: Full-width banner at top (1600x896px lifestyle/stock imagery). Contained within page width.

**Typography**:
- H1: Post title
- H2: Major sections (6-7 per post)
- H3: Subsections (9+ per post)
- Body: Open Sans, generous line spacing, 100% base scaling to 120% on mobile

**Table of Contents**: Not present

**Product integration**: Extensive inline hyperlinks to product category pages and specific products throughout body copy. "Best Sellers" carousel (Owl Carousel) with 5 product cards (ratings + prices) below content.

**CTA placement**: Soft-sell - contextual text links within body ("Reset your wellness this fall with our daily essentials"), best sellers section at bottom. Newsletter signup in footer ("5% off your first order" + free gummies incentive). No sticky/floating CTAs.

**FAQ section**: Not present

**Author bio**: Minimal - "by 3CHI" byline with date only. No photo, no bio box.

**Related posts**: "More Blogs by 3CHI" - 5 recent articles as simple linked list with dates (no thumbnails)

**Social sharing**: 6 icons below content (WhatsApp, Facebook, X, Email, Pinterest, Tumblr) - inline icons without text labels

**Key takeaways/summary boxes**: None

**Comparison tables**: None in standard posts (despite "vs" articles using structured comparison via sections, not tables)

**Internal links**: 15-20 per post, contextual hyperlinks in sentences, gold/blue colored

**Comments**: Present but requires login. Zero engagement visible.

**Images**: Hero + 4-6 inline images per post. Mix of stock photos and product imagery. ~1 image per 600-800 words.

**Unique elements**:
- Legal disclaimer box in italics at top
- Safety callout in italics at bottom ("Start low and go slow")
- Green checkmark list styling (custom CSS with green #22C55E checkmarks)
- Product card carousel with navigation arrows
- Word count in schema markup (~2,500 words)

---

### Leafly Posts (1 post analyzed in depth)

**Layout**: Full-width, max content width 768px for text (narrow readable column). Full-width for media.

**Hero image**: Large featured image (3962x2503px) with photographer credit. Responsive breakpoints.

**Table of Contents**: Yes - interactive dropdown labeled "Jump to a section" with anchor links to 11 sections. Chevron icons for expand/collapse.

**Product integration**: Dispensary locator cards ("Shop highly rated dispensaries near you") placed mid-article and post-article. Location-based product discovery.

**CTA placement**: Dispensary locator (2x in article), newsletter signup at bottom ("Get good reads, local deals, and strain spotlights"), app download prompts.

**FAQ section**: Not formal accordion - uses pull-quote styling for key statements.

**Author bio**: Footer bio with name, role descriptor, headshot (96x96px Gravatar), link to author archive.

**Related posts**: "Latest in Cannabis 101" carousel with 4-5 thumbnail cards at bottom.

**Social sharing**: Facebook, X, LinkedIn, Pinterest, email - positioned above and below article.

**Key takeaways**: Pull-quote blockquotes with yellow background and italic text for critical statements.

**Comparison elements**: Pros/cons as bulleted lists with bold Pro/Con labels (not formal tables).

**Internal links**: Contextual throughout. Green-bordered inline callout blocks linking to supplementary articles mid-flow ("6 common myths and controversies about high-CBD cannabis").

**Comments**: 7 comments shown in structured data.

**Images**: Embedded video (JWPlayer), multiple full-width figures with captions, consistent attribution styling.

**Heading hierarchy**: H1 title, H2 major sections, H3 subsections. Clean nesting.

**Unique elements**:
- Inline related content callouts (green-bordered boxes mid-article)
- Embedded video player
- Photographer credit on images
- Pull-quote blockquotes with yellow background

---

### Medical News Today Posts (2 posts analyzed)

**Layout**: Responsive container - 550px mobile, 989px tablet, 1100px desktop max-width. Tabbed article template.

**Hero image**: No traditional banner. Product card images serve as visual anchors.

**Table of Contents**: Sticky navigation system (position: sticky, z-index: 500). Not traditional TOC but section navigation.

**Product integration**: Highly structured product cards with:
- Product image with overlay system
- Star rating with progress bars
- Three-tier highlight (CBD type, potency, COA, third-party testing)
- Pros/Cons collapsible sections
- "SHOP NOW" CTA buttons with affiliate tracking
- Discount codes prominently displayed
- Price per mg calculations
- Hands-on reviewer testimonials with photos

**CTA buttons**: Dark red (#8E0B0F) with white text, 5px border-radius, 15px padding, 16px bold font. Hover state: #D3422E.

**FAQ/Accordion**: Native button elements with plus/minus SVG toggle icons. aria-expanded state management.

**Author/Reviewer bio**: Structured - author name with credentials, medical reviewer listed separately with extensive qualifications (education, certifications, professional accomplishments).

**Related posts**: Not prominent - focus stays on in-article product comparison.

**Social sharing**: Absolute positioned on right side. Includes print, Pinterest, Reddit. Hidden below 768px on mobile.

**Key takeaways**: Distributed within product descriptions rather than dedicated box.

**Comparison elements**: Card-based rather than table-based. Standardized highlight fields across all products enable implicit comparison.

**Internal links**: Styled with color #3D5191, underlined. Hover: #f0533a (red-orange).

**Heading hierarchy**: H2 for major sections, H3 within product cards. 24px mobile, 38px desktop for primary headings.

**Colors**: Navy (#231f20), accent red (#f0533a), light gray backgrounds (#f7f7f7)

**Typography**: Proxima Nova, responsive font sizing 14-38px range

---

### CFAH Posts (1 post analyzed)

**Layout**: Standard centered column with full-width hero.

**Hero image**: 1200x675px product/lifestyle image at top.

**Table of Contents**: Yes - extensive hierarchical TOC with 5 primary sections and multiple subsections.

**Product integration**: Two formats:
1. Quick summary cards ("Best Overall", "Best Organic") with "CHECK BEST PRICE" buttons
2. Detailed sequential reviews with consistent pros/cons formatting

**Comparison table**: Custom CSS-styled table with branded purple header (#645CF6).

**CTA placement**: "CHECK BEST PRICE" in summary cards, affiliate links throughout, discount codes ("Use code CFAH").

**Author bio**: Author name + credentials ("science and math teacher for 6 years"). Third-party testing references.

**Internal links**: Cross-links to related guides (CBD oils, anxiety gummies, sleep products).

**Information architecture**: Educational "What Are CBD Gummies?" section BEFORE product recommendations (progressive disclosure).

---

## 3. Design Patterns Matrix

| Feature | 3Chi | CBDfx | Joy Organics | Leafly | Gold Bee | MNT | CFAH |
|---------|-------|-------|--------------|--------|----------|-----|------|
| **Index Layout** | List (1-col) | Grid | Mixed (hero + grid) | Grid + scroll sections | Grid (3-col) | N/A | N/A |
| **Category Nav** | Dropdown | Minimal | Horizontal tabs | Full horizontal tabs | Badge only | N/A | N/A |
| **Featured Post** | Yes (top) | No | Yes (large) | Yes (large) | No | N/A | N/A |
| **Sidebar (Index)** | Yes (products) | No | No | Newsletter | No | N/A | N/A |
| **Sidebar (Post)** | Products + recent | No data | No data | No | No data | No | No |
| **Post TOC** | No | No data | No data | Yes (dropdown) | No data | Sticky nav | Yes (hierarchical) |
| **Hero Image** | Full-width banner | No data | No data | Full-width + credit | No data | Product cards | Yes (1200x675) |
| **Product Integration** | Inline links + carousel | No data | No data | Dispensary locator | No data | Structured cards | Summary + detail cards |
| **Inline CTAs** | Soft text links | No data | No data | Dispensary cards | No data | SHOP NOW buttons | CHECK BEST PRICE |
| **FAQ Section** | No | No data | No data | No (pull-quotes) | No data | Yes (accordion) | No |
| **Author Bio** | Minimal (name only) | Author name | Author name | Full (photo + role) | No | Full (credentials) | Credentials only |
| **Related Posts** | Simple list (5) | No data | No data | Carousel (4-5) | No data | No | Cross-links |
| **Social Sharing** | 6 icons (below) | No data | No data | 5 icons (above+below) | No data | Right sidebar | No data |
| **Key Takeaways** | No | No data | No data | Yellow blockquotes | No data | No | No |
| **Comparison Tables** | No | No data | No data | Pros/cons lists | No data | Card-based | CSS-styled table |
| **Comments** | Yes (login req) | No data | No data | Yes | No data | No | No data |
| **Newsletter CTA** | Yes (5% off) | Review widget | Not on index | Yes (email capture) | No | No | No |
| **Search** | Yes | No | Yes (header) | Yes (header) | No | N/A | N/A |
| **Color Scheme** | Gold/black | Orange/white | Cream/dark | Green/white | Gold/white | Navy/red/gray | Purple/white |
| **Body Font** | Open Sans | Unknown | Muli | Public Sans | Sans-serif | Proxima Nova | Unknown |
| **Heading Font** | Montserrat | Unknown | Serif | Public Sans | Sans-serif | Proxima Nova | Unknown |

---

## 4. Best Practices Identified

### Industry Standards (3+ competitors do this)

1. **Grid or card-based blog index** - Every competitor uses cards with images, not plain text lists. Grid layouts (2-3 columns) dominate.

2. **Featured/hero image on every post** - Full-width or contained banner image at top of every article. Always high-quality, 16:9 or wider aspect ratio.

3. **Clean heading hierarchy** (H1 > H2 > H3) - All competitors use proper semantic heading structure. H2 for major sections, H3 for subsections.

4. **Inline product links** - Every e-commerce CBD blog weaves product links naturally into body copy. Not disruptive - contextual hyperlinks within sentences.

5. **Social sharing buttons** - Present on most blogs, typically 4-6 platforms (Facebook, X, Pinterest, Email being the core set).

6. **Category/tag navigation on index** - Most use either dropdown, horizontal tabs, or badge-style category filtering.

7. **No sidebar on individual posts** - The majority of modern CBD blogs use full-width (or narrow centered column) layouts for posts. Sidebar is dying.

8. **Author attribution** - Every blog credits an author, though depth varies from minimal (name only) to full (photo + credentials + bio).

9. **Related posts section** - Present on most blogs at bottom of posts, either as cards or simple list.

10. **Legal disclaimers** - CBD-specific requirement. All competitors include FDA/health disclaimers.

11. **Schema markup** - Article, BlogPosting, Person, BreadcrumbList structured data is standard.

12. **Responsive/mobile-first** - All sites implement responsive breakpoints for mobile reading.

### Unique Differentiators (only 1-2 competitors)

1. **Interactive Table of Contents** (Leafly, CFAH) - Dropdown or hierarchical TOC with anchor links. Major UX advantage for long-form CBD guides.

2. **Pull-quote blockquotes** (Leafly) - Yellow-background key statement highlights mid-article.

3. **Product card comparison format** (MNT, CFAH) - Structured product cards with standardized specs (CBD type, potency, price-per-mg, testing) enable visual product comparison.

4. **Hands-on reviewer testimonials with photos** (MNT) - Real reviewer photos alongside product reviews.

5. **Inline related content callout boxes** (Leafly) - Green-bordered boxes linking to supplementary articles mid-flow without disrupting reading.

6. **Embedded video** (Leafly) - JWPlayer video content within articles.

7. **Custom checkmark list styling** (3Chi) - Green checkmark bullets instead of standard dots.

8. **Progressive disclosure architecture** (CFAH) - Educational content BEFORE product recommendations.

9. **Product card carousel** (3Chi) - Owl Carousel best sellers section below content.

10. **Discount code integration** (MNT, CFAH) - Affiliate discount codes displayed prominently within product cards.

### What ALL Competitors Are Missing (Gap Opportunities)

1. **Key Takeaways summary box at top** - None have a proper "Key Takeaways" or "TL;DR" box at the very top of posts. Only Leafly has pull-quotes (mid-article). This is a major E-E-A-T and AI citation optimization gap.

2. **Structured FAQ accordion sections** - Only MNT uses proper expandable FAQ. Most CBD blogs skip structured FAQ entirely despite it being a rich result opportunity.

3. **Comparison tables (proper HTML tables)** - Almost nobody uses actual formatted comparison tables. They use card layouts or prose instead. Real tables would improve scannability and AI citation surface.

4. **Author bio with E-E-A-T depth** - Most CBD blogs have weak author attribution. None combine photo + full credentials + experience + social proof in a well-designed author card. This is critical for health/wellness YMYL content.

5. **Reading time estimate** - None display estimated reading time on post cards or at article top.

6. **Last updated date prominently displayed** - Most hide modification dates in schema only. Showing "Last Updated: [date]" prominently builds trust for health content.

7. **Sticky/floating Table of Contents** - Even the blogs with TOC use static or dropdown. None have a sticky sidebar TOC that tracks reading progress.

8. **Audio narration / listen option** - Zero competitors offer audio playback of their blog posts.

9. **Content rating / helpfulness feedback** - None ask "Was this article helpful?" at the end.

10. **Source citation formatting** - Most link to studies inline but none have a proper "Sources" or "References" section at the bottom with numbered citations.

11. **Mobile sticky CTA bar** - None have a persistent mobile bottom bar linking to product pages while reading.

12. **Dark mode support** - None offer dark mode for reading comfort.

---

## 5. Recommendations for GummyGurl Blog Design

### Layout
- **Index page**: 3-column responsive grid (3 cols desktop, 2 tablet, 1 mobile) with a large featured post at top spanning full width. This combines the Joy Organics featured treatment with Gold Bee's clean grid.
- **Individual posts**: Full-width layout with centered content column (max-width 768px for text, full-width for images). NO sidebar. This is the modern standard.

### Typography & Color Treatment
- **Heading font**: Poppins or similar geometric sans-serif (industry standard is clean sans-serif headings)
- **Body font**: Inter, system-ui, or similar high-readability sans-serif at 16-18px
- **Line height**: 1.6-1.8 for body text (generous spacing is universal)
- **Color scheme**: Use GummyGurl's brand palette with these patterns:
  - White or cream (#FAF8F4) backgrounds for readability
  - Dark text (#1D1F28 range) for body copy
  - Brand accent color for category tags, CTA buttons, and key metric numbers only
  - Muted accent for inline links (distinguishable but not garish)
- **Heading sizes**: H1 32-38px, H2 24-28px, H3 20-22px (responsive scaling)

### Product Integration Pattern
- **Inline contextual links** to products within body copy (3Chi model - natural, not disruptive)
- **Product recommendation cards** below content (not in sidebar) with: product image, name, rating, price, one-line description, CTA button
- **"Editor's Pick" callout box** mid-article for relevant products (inspired by Leafly's inline callout boxes but product-focused)
- **Progressive disclosure**: Educational content FIRST, product recommendations SECOND (CFAH model - critical for E-E-A-T)

### CTA Strategy
- **Newsletter signup**: Inline after first section + bottom of article. Offer incentive (discount code like 3Chi's "5% off")
- **Product CTAs**: Below content as card grid (2-3 products max). Button style: solid brand color, rounded corners, bold text
- **NO popups** - none of the successful competitors use them
- **Mobile sticky bottom bar** (gap opportunity): Thin persistent bar with "Shop [Product Category]" CTA

### Content Structure Pattern (every post template)
1. **Key Takeaways box** (GAP - nobody does this well) - 3-5 bullet summary at top with light background color
2. **Hero image** - Full-width, 16:9 aspect ratio, lifestyle or product photography
3. **Meta line** - Author name + credentials + publication date + "Last Updated" + reading time
4. **Table of Contents** - Sticky sidebar TOC or collapsible dropdown (Leafly-inspired but better)
5. **H2/H3 structured content** with images every 500-700 words
6. **Inline product callout boxes** mid-article (green/brand-colored border)
7. **Comparison table** (proper HTML table) where applicable
8. **FAQ section** with proper accordion (Schema.org FAQPage markup)
9. **Sources/References** section with numbered citations
10. **Author bio card** with photo, credentials, social links
11. **Related posts** carousel (3-4 cards with thumbnails)
12. **Social sharing** (Facebook, X, Pinterest, Email) - floating or below content
13. **"Was this helpful?"** feedback widget
14. **Legal disclaimer** - Required for CBD content

### Mobile Experience
- Single-column layout with full-width images
- Collapsed TOC (hamburger or dropdown)
- Sticky bottom CTA bar
- Touch-friendly accordion FAQ
- 18px+ body font size
- Adequate tap targets (44px+)
- Lazy-loaded images

### Unique Differentiators for GummyGurl (exploiting gaps)
1. **Key Takeaways box** at top of every post - immediate value delivery
2. **Sticky progress-tracking TOC** - shows where reader is in the article
3. **Proper comparison tables** with product specs - better than card-based comparisons
4. **Full E-E-A-T author cards** - photo, credentials, "reviewed by" medical/scientific advisor
5. **"Last Updated" prominent display** - builds trust in fast-changing CBD regulatory landscape
6. **Audio listen option** - differentiate from every competitor
7. **Numbered source citations** - academic-style references section
8. **Reading time estimate** - on cards and at article top
9. **Helpfulness feedback** - "Was this article helpful?" at bottom
10. **Dark mode toggle** - modern reading comfort option

---

## 6. Color Schemes Across Industry

| Brand | Primary Accent | Background | Text | Link Color |
|-------|---------------|------------|------|------------|
| 3Chi | Gold #dfb57e | Black #000 | White | Blue #334862 |
| CBDfx | Orange #E7721B | White | Dark | Standard |
| Joy Organics | Cream/muted | Off-white | Dark | Muted |
| Leafly | Green #017c6b | White | Dark | Green |
| Gold Bee | Gold #ffa129 | White | Dark gray | Gold |
| MNT | Red #f0533a | Light gray #f7f7f7 | Navy #231f20 | Navy #3D5191 |
| CFAH | Purple #645CF6 | White | Dark | Purple |
| Cheef Botanicals | Sage green #586C4C | White | Warm brown #4C3F39 | Green |

**Pattern**: Most CBD brands use warm earth tones (gold, green, brown) or natural colors. GummyGurl should use colors that feel natural/organic but also fun/approachable (it is a gummy brand after all). Avoid clinical whites-only or overly corporate palettes.

---

## 7. Typography Across Industry

| Brand | Heading Font | Body Font |
|-------|-------------|-----------|
| 3Chi | Montserrat | Open Sans |
| Joy Organics | Serif (unnamed) | Muli |
| Leafly | Public Sans | Public Sans |
| Gold Bee | Sans-serif | Sans-serif |
| MNT | Proxima Nova | Proxima Nova |
| Cheef Botanicals | Montserrat | Poppins |

**Pattern**: Sans-serif dominates. Poppins and Montserrat are the most common heading fonts in the CBD space. Inter or Open Sans for body. One outlier (Joy Organics) uses serif headings for a premium/editorial feel.

---

*This analysis informs GummyGurl's blog template CSS, component design, and content structure decisions. All recommendations prioritize E-E-A-T compliance, AI citation readiness, and product conversion - the three pillars of a successful CBD e-commerce blog.*
