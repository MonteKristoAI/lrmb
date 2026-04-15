# LuxeShutters - System Update & Progress Report

**Date:** 14 April 2026
**From:** MonteKristo AI (Alex)

---

## 1. Location Pages & Google Ads (URGENT)

We've built and deployed **8 dedicated location pages** for your Google Ads campaigns. These are live right now:

| Town | URL |
|------|-----|
| Temora | https://luxeshutters.com.au/temora/ |
| Wagga Wagga | https://luxeshutters.com.au/wagga-wagga/ |
| Young | https://luxeshutters.com.au/young/ |
| West Wyalong | https://luxeshutters.com.au/west-wyalong/ |
| Cootamundra | https://luxeshutters.com.au/cootamundra/ |
| Junee | https://luxeshutters.com.au/junee/ |
| Griffith | https://luxeshutters.com.au/griffith/ |
| Cowra | https://luxeshutters.com.au/cowra/ |

Each page includes:
- Hero section with the town name and local description
- Product showcase (shutters, blinds, curtains, awnings, zipscreens, security)
- Quote request CTA
- 6 real Google reviews with photos
- FAQ section with location-specific questions
- Structured data for Google (LocalBusiness, Service, FAQ schema)
- Cross-links to all other locations

These pages are **static HTML** (not part of the React app), which means they're 100% crawlable by Google with zero JavaScript dependency. This is better for ad quality scores and SEO.

**What we need from you:**
If your old Google Ads were pointing to different URLs (e.g. `/shutters-temora` or `/blinds-wagga-wagga`), send us those exact URLs so we can set up 301 redirects. That way any old links or cached ad destinations will automatically forward to the new pages and your ads won't get declined.

---

## 2. Full System Overview

Here's everything that's been built and is currently running for LuxeShutters:

### Website
- **URL:** luxeshutters.com.au
- **Stack:** React + TypeScript + Tailwind CSS
- **Hosting:** Cloudflare Pages (migrated from Lovable for better performance, security, and SEO)
- **Features:** Product pages, quote form, consultation form, Google reviews section with lightbox, review gating (4-5 stars go to Google, 1-3 stars go to internal feedback), AI chat widget, structured data, full mobile responsive

### Location Pages (8 towns)
- Separate static HTML pages on the same domain
- Served via Cloudflare Worker reverse proxy (same domain, seamless experience)
- Optimised for Google Ads Quality Score

### GHL CRM
- **Pipeline:** 12 stages (New Enquiry, Consultation Scheduled, Measurements Taken, Quote Requested, Quote Sent, Won, Invoice Sent, In Production, Installation Scheduled, Rework, Completed, Lost)
- **Product Types:** 41 options in the dropdown
- **Custom fields:** Lead Source, Enquiry Type, Service Type, Timeframe, Property Type, Window Count, Notes, plus 13 opportunity fields for the quote system (product type, measurements, mount config, colour, cost price, markup, consumer price, Xero quote/invoice links, Cora order ID)
- **Lead capture:** All 5 sources (quote form, consultation form, phone, web chat, negative feedback) automatically create contacts with the correct tags and fields

### Automation Workflows (10 total, all active and tested)

| Workflow | What It Does |
|----------|-------------|
| Quote Form to GHL | Website quote form submissions create a GHL contact automatically |
| Consultation Form to GHL | Consultation form submissions create a GHL contact automatically |
| Web Widget to GHL | Retell AI chat leads create a GHL contact automatically |
| Phone to GHL | Retell AI phone call leads create a GHL contact automatically |
| Negative Feedback to GHL | Low star reviews from the website create a GHL task for follow-up |
| Quote Generator | When you move a deal to "Quote Requested", the system auto-calculates cost price, applies your markup, creates a draft quote in Xero, syncs the contact details to Xero, and moves the deal to "Quote Sent" |
| Quote Follow-up | After a quote is sent: Day 3 follow-up email, Day 6 SMS, Day 11 manual call task created |
| Sale Won | When you move a deal to "Won": creates a Xero invoice, submits a Cora production order (for Shutters, Roller Blinds, Curtains, Awnings), creates an install task in GHL |
| Xero Auth | One-time OAuth connection (already done) |
| Token Manager | Keeps the Xero connection alive by rotating tokens automatically |

All 10 workflows were tested end-to-end on 14 April with real webhook calls and verified as working.

### Retell AI (Voice Agent)
- **Phone agent:** Answers inbound calls, qualifies leads, collects name, product interest, timeframe, property details. Named "Sarah" with a natural Australian tone and full objection handling.
- **Web widget:** Chat agent on the website that captures lead info and pushes to GHL.
- Both agents feed directly into the GHL workflows above.

### Xero Integration
- **Quote Generator** creates draft quotes with per-window line items, surcharges as separate items, and markup applied
- **Sale Won** creates invoices and submits Cora production orders
- **Contact sync** pushes phone, email, address, suburb, and postcode from GHL to Xero when a quote or invoice is created

### Auto-Pricing Engine
- **41 product types** auto-calculate cost price from supplier lookup tables
- **170+ surcharge keywords** detected automatically from the notes field
- **280,874 verified prices** extracted from 3 supplier Excel files (CWGlobal, Retail Price-List-Generator, CW Products M2M)
- **Zero manual entry** required for pricing. You select the product, enter measurements, and the system calculates everything.
- More detail in Section 6 below.

---

## 3. Answers to Your Questions

### Xero: "Contact details don't sync from GHL to Xero"
**Fixed.** There was a bug where the Xero sync was silently failing due to an internal version mismatch in the automation. This has been resolved. When a quote or invoice is created, the contact's phone, email, address, suburb, and postcode now sync from GHL into Xero correctly. Tested and verified.

### Location Pages: "Do all the pages have the same URLs?"
**Done.** The 8 location pages listed above are live now. They use clean URL paths: `/temora/`, `/wagga-wagga/`, `/young/`, `/west-wyalong/`, `/cootamundra/`, `/junee/`, `/griffith/`, `/cowra/`.

If these are different from what your old ads pointed to, we need your old URLs so we can set up redirects. Once we have those, no ads will get declined.

### Outlook: "Is calendar and email integration possible?"
**Yes.** Connecting Outlook keeps all client communication logged in GHL and syncs your calendar. Here's how:

**Connect your email:**
1. In GHL, go to Settings (gear icon, bottom-left)
2. Click Integrations
3. Find Microsoft Outlook / Office 365 and click Connect
4. Sign in with your Outlook account and grant the permissions
5. Go to Settings > Email Services
6. Select your Outlook account as the default sending email
7. Turn on "Log sent emails to conversations"

**Sync your calendar:**
1. Go to Settings > Calendars
2. Click your calendar (or create one)
3. Find Calendar Sync / Integrations
4. Click Connect Outlook Calendar
5. Pick the calendar you want to sync
6. Turn on two-way sync

Do the same for Cam if he uses Outlook.

### SMS Reminders: "Text confirmations 24hrs before quote, 48hrs before install"
**Ready to build, waiting on a phone number.** We need a number that can send SMS. Two options:

**Option A - Twilio (cheaper per message, more control)**
1. Create an account at twilio.com
2. Add a payment method
3. Submit an Australian regulatory bundle (ABN + utility bill, takes 1-3 business days)
4. Buy an AU number (~$2/month)
5. Send us the Account SID, Auth Token, and the number

**Option B - GHL LC Phone (simpler, slightly more per message)**
1. In GHL, go to Settings > Phone Numbers
2. Click + Add Number
3. Search for an Australian number and purchase it

Once the number is sorted, we'll build the reminder workflows immediately.

### GHL Staff: "I've added Cam but I don't appear myself"
**Done.** You should have Agency Owner access with full permissions. If you're still not seeing yourself, check Settings > My Staff and make sure your email address matches. Let us know if there's still an issue.

### Pipeline: "I need a column for rework"
**Done.** A "Rework" stage has been added between Installation Scheduled and Completed.

---

## 4. Airtable Migration

We migrated all your lead data from Airtable into GHL. Here's the breakdown:

**What was migrated successfully:**
All leads that had at least a phone number or email address were imported into GHL as contacts with their deal history, notes, and status.

**What couldn't be imported (~200 leads):**
GHL requires at least a phone number or email to create a contact. About 200 leads in your old Airtable had a name and deal info but no phone or email on file. These are documented in a Google Sheet so nothing is lost:

**[LuxeShutters - Missing Contact Info (Airtable Migration)](https://docs.google.com/spreadsheets/d/15U26-Md-_eYPwopWvx0t5kRIVbDBmho-7dvdPECg9HE/edit)**

The sheet has two tabs:
- **Sheet1** - ~200 individual leads with name, status, estimated value, payment status, and region. Missing phone and/or email.
- **B2B Partners - Missing** - 23 trade partners (interior designers and builders) that also need contact info.

**Photos & attachments from Airtable:**
All photos, measurement sheets, and quote files that were attached to Airtable records have been exported to Google Drive:

**[LuxeShutters - Airtable Photos (Google Drive)](https://drive.google.com/drive/folders/1E6gjJO6aXq4a-DeUGly1ljWWpt3IGjFc)**

This folder has 50+ files (job photos, measurement spreadsheets, etc.) named by client.

**What we need from you:**
If you can fill in the missing phone numbers and/or email addresses in the Google Sheet, we can import those remaining ~200 leads into GHL. The B2B partners tab is worth prioritising since those are referral relationships.

---

## 5. Pricing Engine

The system now auto-calculates cost price for every product you sell. Here's how it works:

1. You create a deal in GHL and select the product type (41 options)
2. You enter the measurements (width x height, one per line)
3. You enter the colour/fabric preference
4. You add any notes about extras (motors, surcharges, custom options)
5. You move the deal to "Quote Requested"
6. The system:
   - Looks up the exact cost price from the supplier's price table (matched by width, height, and fabric/colour category)
   - Detects any surcharges from the notes field (170+ keywords: raked shutters, motors, remotes, cassettes, custom colours, etc.)
   - Applies your markup percentage (default 40%)
   - Creates a Xero draft quote with line items for each window + separate line items for each surcharge
   - Moves the deal to "Quote Sent"

**Products covered (41 total):**

| Source | Products |
|--------|----------|
| CWGlobal | Shutters (14 variants), Roller Blinds Atlas, Roller Blinds Wattle, Awnings (Zip Guide), Zipscreens, Curtains (12 fabric categories), Venetians (5 types), Vertical Blinds, Panel Glides, VersaDrapes, Pleated Insect Screens, Dual Shades, Lumex Louvred Roof, Manual Louvre Roof, Velare Tracks, LouvreEase, Security Roller Shutters, Wire Guide, Straight Drop, Extreme variants, Sail Track, Fixed Channel, Reskin, Linked Rollers |
| Retail | Roman Blinds (6 groups), Honeycomb (4 variants), Auto Awning, Strap Down, Fixed Guide, Multi-Stop, Recloth, Rope & Pulley, Bonded Pelmets, Wave Fold Curtains, Panel Blinds (3P + 4P), Decorator Rod/Track, Ziptrak |
| Added | Viewscape Shutters |

**Surcharges auto-detected (170+ keywords):**
Shutter surcharges (raked, bay, corner, custom colour, stainless hinges, fly screen, track sliding, etc.), Bayview add-ons, Vueline structural (L-angles, box sections, U-channels), outdoor motorisation (Automate, Alpha, Simu, Somfy), roller blind cassettes, fabric category detection, and more.

**Important note on pricing:** All prices come from the supplier spreadsheets you provided. If suppliers update their pricing, we'll need the new spreadsheets to update the system. The current data is from the April 2025 price lists.

---

## 6. Testing & Bug Reporting

Everything has been tested and is working, but real-world usage will be the best test. As you start using the system with real deals, please let us know if you run into any issues.

**Specifically, please watch for:**
- **Pricing accuracy** - When you create a quote, compare the auto-calculated cost price against what you'd expect from the supplier price list. If anything looks off, let us know the product type, measurements, and what price you expected vs what the system generated.
- **Surcharges** - Check that the system picks up the extras you type in the notes field. If it misses something or calculates wrong, send us the exact text you entered.
- **Xero quotes** - Make sure the draft quotes in Xero look correct (line items, amounts, contact details).
- **Workflow triggers** - When you move deals between pipeline stages, the automations should fire. If something doesn't trigger or gives an error, let us know which deal and which stage.

If something isn't working as expected, just message us with the details and we'll get it sorted.

---

## 7. What We Need From You

| # | Item | Priority | Time Needed |
|---|------|----------|-------------|
| 1 | **Old Google Ads URLs** - Send us the exact URLs your ads currently point to so we can set up 301 redirects and stop the ad rejections | Urgent | 5 min |
| 2 | **Connect Outlook to GHL** - Follow the steps in Section 3 above | High | 10 min |
| 3 | **Set up Twilio or LC Phone** - For SMS reminders (pick Option A or B from Section 3) | High | 15-30 min |
| 4 | **Fill in missing contact info** - Add phone/email to the [Google Sheet](https://docs.google.com/spreadsheets/d/15U26-Md-_eYPwopWvx0t5kRIVbDBmho-7dvdPECg9HE/edit) so we can import remaining leads to GHL | Medium | As time allows |
| 5 | **Test a few real quotes** - Run through the quote process with real deals and let us know if pricing or Xero output needs adjustment | Medium | 15 min |
| 6 | **Clean up test data** - In GHL, search for contacts tagged "MKTEST-DELETE" and delete them. Also delete any test draft quotes from 14 April in Xero. | Low | 5 min |

---

If you have any questions about anything above, or if you run into issues with the system, just let us know and we'll get on it straight away.
