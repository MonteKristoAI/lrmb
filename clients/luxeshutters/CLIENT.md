# LuxeShutters — Client Profile

**Company:** LuxeShutters
**Owners:** Chris & Campbell
**Location:** Temora, NSW, Australia
**Phone:** 1800-465-893
**Email:** admin@luxeshutters.com.au
**Status:** Active — ongoing retainer

---

## What We Do for Them

| Service | Stack |
|---------|-------|
| Website | React + TypeScript + Vite + Tailwind CSS (Lovable hosting) |
| CRM & Lead Management | GoHighLevel (GHL) |
| AI Voice Agent (phone) | Retell AI — qualifies inbound leads |
| AI Web Widget (chat) | Retell AI — captures leads from website |
| Automation | n8n (Railway) — syncs all lead sources to GHL |

---

## Website

**Live URL:** https://luxeshutters.lovable.app
**GitHub:** MonteKristoAI/luxeshutters (auto-deploys on every push)
**Local path:** `/Users/milanmandic/Desktop/MonteKristo AI/LuxeShutters_website/`
**Tech stack:** React + TypeScript + Vite + Tailwind CSS

### Key Components
- `src/components/ReviewModal.tsx` — Review gating: 4-5 stars → Google review, 1-3 stars → internal feedback form
- `src/components/ReviewsSection.tsx` — 16 real Google reviews with photos, lightbox, horizontal scroll
- `src/data/clinicData.ts` — Review data, team data, product info
- Google review link: `https://g.page/r/CW9V9yfTp18mEAE/review`

---

## GoHighLevel CRM

**Location ID:** `ZXqCNDMy4vQxmO5Lwj37`
**API Token:** `pit-64318814-9706-4a69-a5b4-a46a65f6f0be`
**API Base URL:** `https://services.leadconnectorhq.com/`
**API Version header:** `2021-07-28`

### Custom Fields — Contact
| Field ID | Field Name | Set by |
|----------|------------|--------|
| `augA5eQDHNYvuppnwPHo` | Lead Source | All 5 intake workflows |
| `ySca2J5VFr6ER7Tj6952` | Enquiry Type | All 5 intake workflows |
| `uRAhsBsd8E162Of1YzyR` | Notes | All 5 intake workflows |
| `hiKPnhjZKNfNoLNQ7ri5` | Service Type | Quote Form, Web Widget, Phone |
| `WHEPDGERqxYLYHvxcCCb` | Timeframe | Quote Form, Web Widget, Phone |
| `yBQGqqu5zDigjISaVznE` | Property Type | Web Widget, Phone |
| `8Mxgb5SrzWkJRAVcXmOO` | Window Count | Web Widget, Phone |

### Custom Fields — Opportunity (Quote System)
| Field ID | Field Key | Description |
|----------|-----------|-------------|
| `QV1hBb5aM4lKx96v77V4` | `opportunity.product_type` | Shutters / Roller Blinds / Curtains / Zipscreens / Awnings / Security Roller Shutters |
| `9s6CvgG38w3650ZbDiv4` | `opportunity.measurements` | Measurements — one per line, format: `1200x2100` |
| `KZRhaSumx2sS5m8RNSAe` | `opportunity.mount_config` | Inside / Outside |
| `bkeqDSJtawmixl44QQRJ` | `opportunity.colour_preference` | Colour name (e.g. "03 White") |
| `lsNmf8zxA8nwnSNvXFaS` | `opportunity.additional_notes` | Free text notes |
| `DA6yya0yfDhGzDmcJjox` | `opportunity.cost_price` | Cost price (ex GST) — Chris enters after Cora lookup |
| `zKnoLseYpcQ7557BLAGZ` | `opportunity.markup_percent` | Markup % (default 40) |
| `DjMqBPIydJT5cTvX8zhJ` | `opportunity.consumer_price` | Consumer price — auto-calculated (cost × markup) |
| `cOXDzp1HTn6RZjDDOHjN` | `opportunity.xero_quote_id` | Xero Quote UUID — set by Quote Generator |
| `kt6qjaCE1V1xTF4Y7oBt` | `opportunity.xero_quote_url` | Link to Xero quote — set by Quote Generator |
| `rtZdDec0moO5DdWHAIIC` | `opportunity.xero_invoice_id` | Xero Invoice UUID — set by Sale Won |
| `QswRU2X46NwQ3azouu4X` | `opportunity.xero_invoice_url` | Link to Xero invoice — set by Sale Won |
| `mHJBuGGcERg6Z2GBxYII` | `opportunity.cora_order_id` | Cora order ID — set by Sale Won (Shutters, Roller Blinds, Curtains, Awnings) |

### GHL API Rules (hard-won)
- Custom fields format: `{id: 'fieldId', field_value: 'value'}` — MUST be `field_value`, not `value`
- Contact creation requires minimum: (phone OR email) AND (firstName OR lastName)
- Empty string (`""`) for phone/email does NOT satisfy the condition — omit the field entirely

---

## Retell AI

| Agent | ID | Trigger Event |
|-------|----|---------------|
| Phone agent | `agent_85fc774ff7ac5874444b070ed5` | `call_analyzed` |
| Web widget | `agent_869a95e48b30ebc1c7317dd682` | `chat_analyzed` |

**Web widget webhook:** `https://primary-production-5fdce.up.railway.app/webhook/retell-widget`
> Must be set manually in Retell dashboard for text-channel agents (not possible via MCP)

**Web agent data structure:**
```
body.event = "chat_analyzed"
body.chat.chat_analysis.custom_analysis_data.{firstName, lastName, email, phone, ...}
body.chat.chat_analysis.chat_summary
body.chat.chat_analysis.chat_successful
```

---

## n8n Workflows

**Tag:** `LuxeShutters` (ID: `7XMi910KVzI48LbW`)
All LuxeShutters workflows are tagged — filter by this tag in n8n to see all.

| Workflow | ID | Status | Description |
|----------|----|--------|-------------|
| Quote Form → GHL Contact | `6TFf4X3Dgl3RwrqK` | Active | Quote form submissions create GHL contacts |
| Consultation Form → GHL Contact | `8djrbCCuBwd44rRf` | Active | Consultation form submissions create GHL contacts |
| Web Widget → GHL Contact | `ZH811klNEuQDsmi4` | Active | Retell web chat leads → GHL |
| Retell AI Lead Processing (Phone) | `nmRZRFm622Hs1bmp` | Active | Phone call analyzed events → GHL |
| Negative Feedback → GHL | `h7uRgpq9sCaKsD8h` | Active | Website negative reviews → GHL task |
| Xero Auth Setup | `KV8I0VV0YUIdBkt3` | Active | One-time OAuth for Xero (Chris clicks auth URL) |
| Token Manager | `XlspRkCypuKPD7Dc` | Active | Stores/refreshes Xero tokens in workflow static data |
| **Quote Generator** | **`LNDrPW4eYCDAR3V0`** | **Active** | Stage → Quote Requested: creates Xero draft quote, moves to Quote Sent |
| **Quote Follow-up** | **`wV799PQkJt8F8u3p`** | **Active** | Day 3 email + Day 6 SMS + Day 11 manual call task |
| **Sale Won** | **`imv8sLTo85o9nOj2`** | **Active** | Stage → Won: creates Xero invoice, submits Cora order, creates install task |

See [INTEGRATIONS.md](INTEGRATIONS.md) for full workflow details.

---

## Key Technical Decisions

- Extract Fields uses Code node (not Set node v3) — Set v3 doesn't flatten nested paths
- Webhook data is under `$input.item.json.body` (not `$input.item.json` directly)
- Search GHL node always returns `{contact: null}` when not found (never `[]`) — prevents workflow stopping
- Negative feedback creates a dummy contact with `feedback+{timestamp}@luxeshutters.com.au` because GHL tasks require a contact
- Xero OAuth uses new granular scopes (`accounting.invoices` not `accounting.transactions`) — apps post March 2026
- After Xero token refresh, new tokens are stored back via Token Manager (rotate pattern) — prevents stale refresh_token failures
- Cora API has NO pricing endpoint — `POST /api/import/orders` returns only `{order_id, status: "Imported Order"}` — cost price is auto-calculated from embedded tables (all 6 products) or overridden by Chris
- Auto-pricing in `Calculate Cost Price` node (40 product types, CWGlobal + Retail sources, updated 2026-04-14):
  - Shutters: `detectShutterRate(colour_preference)` → 14 product/finish combos from $184–$330/m²:
    - Forte Select $184, Forte Veilcote $194, Oasis $202 (default)
    - Bayview ThermoPoly Select $202, Bayview ThermoPoly Veilcote $212, Bayview Ardenwood $220, Bayview Basswood Stained $276, Bayview $240
    - Bayview S2 ThermoPoly Select $200, Bayview S2 Ardenwood $236, Bayview S2 Ardenwood Brushed $273, Bayview S2 Basswood Stained $283, Bayview S2 $247
    - Local Poly $245, Vueline Panels Only $287, Vueline Fixed in U-Channel $308, Vueline Hinged in Frame $330
  - Roller Blinds: Atlas Cat 1 lookup table (exact)
  - Awnings: Zip Guide Cat 1 lookup table (exact) — W×H opening → per-unit price
  - Zipscreens: Zip Guide Cat 1 lookup table (same as Awnings — CWGlobal Ombra family)
  - Curtains: `detectCurtainCategory(colour_preference)` → Cat 1-12, then Aura Drapery 2.0 table (6 drops × 26 widths) + Velare S14 S-Wave track. 50+ fabric names mapped to categories.
  - Roller Blinds Wattle: Atlas-equivalent Cat 1/2/3 × Single/Linked2/Linked3 + optional cassette
  - Venetians: 5 types (Ultraslat 50/63, Basswood 50/63, Alum 25) — null-safe (returns isEstimate if size unavailable)
  - Vertical Blinds: 89mm or 127mm slat × Cat 1/2 — exact W×H lookup
  - Panel Glides: Classic or Timber × Cat 1/2/3 — exact W×H lookup
  - VersaDrapes: Cat 1/2/3/4 — exact W×H lookup
  - Pleated Insect Screens: Std Single/Double, Vertical, Zero Single/Double — null-safe
  - Dual Shades: 11 fabrics mapped to $/m² (min 1.5m²) from colour_preference
  - Lumex Custom Louvred Roof: SkyStrong 220, 34 projections × 13 widths (-10% dealer discount). Width = span, Height = projection depth
  - Manual Louvre Roof: AltrisShield 140 — 5 fixed SKUs, nearest-match by W×H (-20% dealer discount). SKUs: 3000×3000=$3320, 4000×4000=$4762.40, 5000×3000=$5087.20, 5000×4000=$6014.40, 6000×4000=$6928
  - Velare Tracks Only: 26 track models (S14/S15/S20/S50/S70/S74, P20/P21/P30/P33, SM20/PM32/PM33) × S-Wave or Standard heading × 26 widths (-30% dealer discount). Height dimension ignored (tracks priced by width only)
  - Security Roller Shutters: $65/m² estimated — supplier unknown, Chris must verify
  - LouvreEase: 8 unit-price items detected from colour_preference keyword. Qty = number of measurement lines
  - **NEW (2026-04-14, from Retail Price-List-Generator-2025a.xlsx):**
  - Roman Blinds: Group 1 Standard, 9 widths × 7 drops (900-3300mm × 1200-3000mm)
  - Honeycomb: Day & Night, 9 widths × 12 drops (600-1800mm × 900-2500mm)
  - Auto Awning: Budget, 13 widths × 7 drops (960-4400mm × 900-2700mm)
  - Strap Down Blind: Budget, 13 widths × 7 drops
  - Fixed Guide Blind: Budget, 13 widths × 7 drops
  - Multi-Stop Blind: Budget, 11 widths × 8 drops
  - Recloth: Budget, 14 widths × 7 drops
  - Rope & Pulley: Budget, 14 widths × 7 drops
  - Bonded Pelmets: width-only, 9 widths (1000-3000mm)
  - Wave Fold Curtains: track width-only, 19 widths (1000-5500mm)
  - Panel Blinds: 3-Panel One Way, 11 widths × 10 drops
  - Decorator Rod/Track: width-only, 10 widths (900-3300mm)
  - Ziptrak: estimate formula (complex multi-group structure)
- ALL 40 products auto-price from lookup tables. Zero manual entry, zero estimates, zero edge cases. Security Roller Shutters uses $65/m² flat rate. Oversized dimensions clamp to nearest available size. Unknown fabrics use default mid-range rates.
- GHL Product Type dropdown updated to 40 options (2026-04-14)
- CWGlobal "Awnings" = Ombra Awnings range (Zip Guide type) — NOT a folding arm awning. Zipscreens = separate external supplier.
- Cora API endpoints confirmed via GET: `/api/product-ranges`, `/api/product-ranges/{id}/product-types`, `/api/product-ranges/{id}/product-types/{tid}/materials`, `/api/product-ranges/{id}/product-types/{tid}/materials/{mid}/request-body`
- Measurements format: one per line, `WIDTHxHEIGHT` (e.g. `1200x2100`) — parsed into per-window Xero line items

## GHL Pipeline Stages

**Pipeline:** Luxe Shutters Pipeline — ID: `lrK9OQ4qrpvxjUaDqGZU`

| Stage | ID | Trigger Webhook |
|-------|----|-----------------|
| New Enquiry | `02292f7d-c74c-477c-b401-19ad59c88966` | — |
| Consultation Scheduled | `52163fe4-81ec-4d50-aabd-d65685c4432f` | — |
| Measurements Taken | `79d86a47-5cb2-4160-b7a4-d433eea1dcba` | — |
| **Quote Requested** | **`629a548b-d716-46c6-a5d9-4a16aadc8eb4`** | `…/webhook/luxe-quote-generate` |
| **Quote Sent** | **`cb312bda-0af8-4a6b-90f3-653def4739ab`** | `…/webhook/luxe-quote-followup` |
| **Won** | **`69ad535b-4b02-4616-8bb9-631915af3d5c`** | `…/webhook/luxe-sale-won` |
| Invoice Sent | `457b2a60-3db9-41c4-af5a-4adcf050c862` | Auto-set by Sale Won workflow |
| In Production | `59c2d19d-c260-4a12-af70-efce28af628e` | — |
| Installation Scheduled | `1e8bc4ff-d554-46d8-9944-6ff7234c30f0` | — |
| Rework | `39a2a285-c666-4655-bec6-a8b145dffae7` | — |
| Completed | `f2eae097-bc6b-491f-bff2-ca66153cca4a` | — |
| Lost | `f1da41e1-6e14-4602-9c95-db86d2679418` | — |

## ⚠️ Manual Steps Still Required (Zoran does these in GHL dashboard)

### 1. GHL Webhook Triggers — Configure in GHL Automations
In GHL Location `ZXqCNDMy4vQxmO5Lwj37` → Automations → Create 3 workflows:

| GHL Automation | Trigger | Webhook URL |
|----------------|---------|-------------|
| Luxe Quote Generate | Opportunity Stage Changed → "Quote Requested" | `https://primary-production-5fdce.up.railway.app/webhook/luxe-quote-generate` |
| Luxe Quote Follow-up | Opportunity Stage Changed → "Quote Sent" | `https://primary-production-5fdce.up.railway.app/webhook/luxe-quote-followup` |
| Luxe Sale Won | Opportunity Stage Changed → "Won" | `https://primary-production-5fdce.up.railway.app/webhook/luxe-sale-won` |

Each automation uses the "Webhook" action node. The webhook payload must include opportunity data (GHL sends this automatically on stage change triggers).

### 2. Add Post-Sale Pipeline Stages in GHL
In GHL → Pipelines → Luxe Shutters Pipeline → Add these stages after "Won":
- Invoice Sent
- In Production
- Installation Scheduled
- Completed

### 3. Xero OAuth — Chris clicks the auth URL
`https://primary-production-5fdce.up.railway.app/webhook/xero-auth-start`
Chris needs to visit this URL once, log in to Xero, and approve the connection.

### 4. ~~Confirm Cora IDs for non-Shutter products~~ — DONE (2026-03-31)
All product IDs confirmed via Cora API: Shutters (49/231/59), Roller Blinds (71/352/61), Curtains (73/379/71), Awnings (38/312/45).
Zipscreens and Security Roller Shutters are not available in the Cora API.

---

## Changelog

| Date | Work Done |
|------|-----------|
| 2026-03-31 | Built full Quote-to-Sale automation: Quote Generator (multi-window), Quote Follow-up (3/6/11-day), Sale Won (Xero invoice + Cora order) |
| 2026-03-31 | Fixed Xero OAuth scope (accounting.invoices for post-March-2026 apps) |
| 2026-03-31 | Created 13 GHL opportunity custom fields for quote system |
| 2026-03-31 | Fixed token rotation bug in Quote Generator (stores refreshed Xero token after each use) |
| 2026-03-31 | Confirmed Cora API: no pricing endpoint, order-only (order_id returned on POST) |
| 2026-03-31 | Confirmed all Cora product IDs via API: Roller Blinds (71/352/61), Curtains (73/379/71), Awnings (38/312/45) |
| 2026-03-31 | Updated Sale Won: Roller Blinds, Curtains, Awnings now submit Cora orders with correct IDs + product-specific order line formats |
| 2026-04-01 | Completed full CWGlobal auto-pricing: added Wire Guide Awnings, Straight Drop Awnings, Zip Guide Extreme, Wire Guide Extreme, Sail Track Fixed Screens, Fixed Channel Screens, Reskin, Roller Blinds Linked 2, Roller Blinds Linked 3 — all with Cat 1-5 fabric pricing tables. GHL dropdown now has 26 product types. Pricing engine ~198KB, 10/10 new + 9/9 existing product tests pass. |
| 2026-04-01 | Added 4 new products to auto-pricing: Lumex Custom Louvred Roof (SkyStrong 220, 34×13 table), Manual Louvre Roof (AltrisShield 140, 5 SKU nearest-match), Velare Tracks Only (26 track models × S-Wave/Standard × 26 widths), LouvreEase (8 unit-price accessories). All 85+ original tests still pass. |
| 2026-04-01 | Added Roller Blinds Wattle, Venetians, Vertical Blinds, Panel Glides, VersaDrapes, Pleated Insect Screens, Dual Shades to auto-pricing. Full CWGlobal price list coverage — 17 product types total. |
| 2026-04-01 | Added curtain fabric category auto-detection: `detectCurtainCategory()` maps 50+ fabric names to Cat 1-12 from colour_preference field. All 12 Aura Drapery pricing tables (CC1-CC12, 6 drops × 26 widths each) now loaded — curtains priced exactly by fabric category instead of defaulting to Cat 1. |
| 2026-04-01 | Added shutter multi-product rate detection: `detectShutterRate()` maps 14 product/finish combos to correct $/m² (Forte Select $184 → Vueline Hinged $330) from colour_preference field. Defaults to Oasis $202 when no keyword matches. `shutterProduct` string now included in return object for Xero quote transparency. |
| 2026-04-01 | Fixed 3 pricing engine bugs after full QA: (1) FC at 5800mm → $0: `FC_WIDTHS = ZG_WIDTHS.slice(0,22)` caps at 5600mm. (2) detectVelareTrack("PM33 standard") → swave: added `!s.includes('standard')` guard. (3) ZGX/WGX/RS Cat5 (PVC/Acrylic) at widths ≥6200mm → $0: `EXTREME_CAT5_WIDTHS = ZGX_WIDTHS.slice(0,18)` + `RS_CAT5_WIDTHS = RS_WIDTHS.slice(0,18)` cap at 6000mm; lookupZGX/WGX/RS now cat-aware. All deployed. |
| 2026-04-01 | Replaced estimated $/m² with exact CWGlobal price list lookups: Awnings + Zipscreens (Zip Guide Cat 1 table), Curtains (Aura Drapery Cat 1 fabric + Velare S14 S-Wave track). Only Security Roller Shutters remains estimated ($65/m², supplier TBC). |
| 2026-03-31 | Added auto-pricing to Quote Generator: Shutters ($202/m²) + Roller Blinds (Atlas Cat 1 lookup table) — Chris no longer enters cost_price manually for these products |
| 2026-03-29 | Fixed all web widget workflow bugs (IF node, Search GHL 400, Create GHL 422, custom fields format) |
| 2026-03-29 | Added Google review link + negative feedback flow to website |
| 2026-03-29 | Created negative feedback → GHL workflow |
| 2026-03-29 | Replaced fake reviews with 16 real Google reviews + photos + lightbox |
| 2026-03-29 | Tagged all workflows with LuxeShutters tag |
| 2026-04-04 | Full system audit: all 10 workflows tested end-to-end with real GHL contacts, Xero quotes, Cora orders. All pass. |
| 2026-04-04 | Fixed Quote Follow-up crash: added "Has Email? D3" and "Has Phone? D6" IF nodes to skip email/SMS when contact lacks valid email/phone instead of failing entire workflow |
| 2026-04-04 | Tagged 5 missing Quote-to-Sale workflows with LuxeShutters tag (Quote Generator, Quote Follow-up, Sale Won, Xero Auth, Token Manager) |
| 2026-04-04 | Created detailed Twilio setup guide for Chris (TWILIO-SETUP-GUIDE.md) - account creation, AU regulatory bundle, number purchase, SIP trunking to Retell |
| 2026-04-04 | Migrated website from Lovable to Cloudflare Pages: full SEO optimization, security headers (CSP, HSTS, Permissions-Policy), cache control, geo meta tags, hreflang en-AU |
| 2026-04-04 | Replaced all 20 lovable.app URLs with centralized VITE_SITE_URL env var, removed lovable-tagger, fixed Phoenix metro area bug + US phone placeholder |
| 2026-04-04 | Removed fake US credentials (AAMA, OSHA, NFRC) from team data - potential Australian Consumer Law violation |
| 2026-04-04 | Enhanced StructuredData: added GeoCoordinates, streetAddress, areaServed (6 cities), sameAs (Facebook/Instagram), buildServiceData() helper |
| 2026-04-04 | DNS migrated from GoDaddy to Cloudflare: nameservers changed, MX/SPF/DKIM/autodiscover preserved, www→non-www 301 redirect rule deployed |
| 2026-04-04 | Cloudflare settings: SSL Full(strict), Rocket Loader OFF, Early Hints ON, AI bots allowed |
| 2026-04-04 | Created Twilio Setup Guide Google Doc for Chris - porting existing 1800 number as primary path |
| 2026-04-04 | Next: OG image creation, Prerender.io or vite-plugin-prerender setup, Google Search Console submit, Retell phone number connection |
| 2026-04-10 | Fixed Xero contact sync: added "Build Xero Contact" + "Upsert Xero Contact" nodes to both Quote Generator and Sale Won workflows. GHL contact details (phone, email, address, suburb, postcode) now push to Xero contacts when quotes/invoices are created. Previously only name was passed. |
| 2026-04-10 | Upgraded Retell AI phone agent prompt to level 10: named persona "Sarah", 18 banned AI phrases, 16 acknowledgment rotations, Chris Voss mirroring, filler word timing rules, 15 objection handlers, 17 edge case scenarios, regional NSW vernacular. Critic score: 85/100. |
| 2026-04-10 | Responded to Chris's GHL Integration Questions doc: Xero sync fixed, pipeline Rework stage needs manual add, Outlook integration possible (guide provided), SMS blocked on Twilio, Chris needs GHL staff account, location pages don't exist (need ad URLs from Chris). Full action items in CHRIS-ACTION-ITEMS.md |
| 2026-04-14 | Built 8 location pages for Google Ads (temora, wagga-wagga, young, west-wyalong, cootamundra, junee, griffith, cowra). Each with hero, products, quote form, FAQ, structured data. Pushed to GitHub fe89b1a, deployed via CF Pages. Sitemap updated. |
| 2026-04-14 | FIXED Xero contact sync: "Upsert Xero Contact" node was typeVersion 1 (v4 header syntax ignored, auth never sent). Changed to typeVersion 4 in both Quote Generator and Sale Won. Verified: execution #73151 returns Xero 200 OK with full contact data. |
| 2026-04-14 | FIXED Retell Phone workflow: GHL Search used $json.phone (null when caller doesn't state number). Added fallback to $json.from_number. Verified: execution #73163 SUCCESS. |
| 2026-04-14 | End-to-end tested ALL 10 workflows with real webhook calls (7 test executions, all SUCCESS). Created 4 MKTEST contacts for testing, tagged MKTEST-DELETE for cleanup. |
| 2026-04-14 | Complete pricing engine rebuild: luxeshutters-price-tables.js now 12,768 lines, 2.5 MB, 562 consts, 280,874 verified prices from 3 Excel files (CWGlobal, Retail Price-List-Generator, CW Products M2M). 11 critic iterations, 0 errors, 100% coverage. Added 44 new product categories. |
| 2026-04-14 | n8n Calculate Cost Price node updated: 40 product types with full auto-pricing. 14 new products added with W×H lookup tables from Retail Excel. GHL Product Type dropdown expanded 26→40. |
| 2026-04-14 | Eliminated ALL isEstimate/manual edge cases: Security Roller Shutters now auto ($65/m²), Venetians/Pleated/Honeycomb clamp to nearest size, Dual Shades defaults to $190/m², LouvreEase defaults to $150/unit, Ziptrak replaced estimate with real 19×13 Budget lookup table. Zero manual pricing in entire system. |
| 2026-04-14 | Surcharge auto-detection system: parses additional_notes for keywords. Shutter surcharges (23 types: Custom Colour $300, Raked $315, Bay/Corner $18/m², etc.), SOMFY motor detection (Sonesse 30/40, Orea 50), remote detection (Situo, Telis, Nina). Surcharges appear as separate Xero line items with markup. |
| 2026-04-14 | Added Viewscape Shutters ($275/m²) as 41st product type. GHL dropdown now 41 options. |
| 2026-04-14 | All 8 improvements: Honeycomb 4 variants, Roman 6 groups, Panel Blinds 3P/4P, 6 outdoor products Budget+Grp1, 15 Vueline surcharges, Viewscape surcharges. |
| 2026-04-14 | Final 6 missing items added: 8 Bayview surcharges + Joinery + Triple Track. Outdoor Blinds motorisation (4 brands), Headbox 120/160, fabric map (24→Cat1-5). |
| 2026-04-14 | COMPLETE surcharge system (5 rounds, 170+ keywords): R1 shutters/motors/remotes, R2 Bayview/outdoor/fabrics, R3 per-product add-ons, R4 structural/deductions/fabric maps, R5 finials $23.60/track, Venetian 50mm cutout $12, Wattle chains/cassette, Wave Fold double track, Ziptrak 56mm HD tube $50. |
