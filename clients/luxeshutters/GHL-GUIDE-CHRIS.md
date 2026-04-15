# Luxe Shutters - How to Use Your CRM (GoHighLevel)

This guide is for Chris & Campbell. It explains how leads come in, how to manage your pipeline, and what happens automatically behind the scenes.

---

## How Leads Come In (5 Sources)

Your system captures leads from 5 places. Every lead automatically lands in GoHighLevel as a contact with their details filled in.

| Source | What Happens | You Need To Do |
|--------|-------------|----------------|
| **Quote Form** (website) | Customer fills in the form on your site. Name, email, phone, service type, timeframe auto-saved. | Nothing. Contact appears in GHL. Follow up when ready. |
| **Consultation Form** (website) | Customer requests a free consultation. Same details captured. | Nothing. Contact appears in GHL. |
| **Phone Call** (Retell AI) | Customer calls 1800 465 893. AI assistant qualifies them, captures their details. | Nothing. Contact + call summary appear in GHL. |
| **Web Chat** (Max widget) | Customer chats with Max on the website. Max captures their details and what they need. | Nothing. Contact + chat summary appear in GHL. |
| **Negative Review** | Customer leaves 1-3 stars on the review prompt. Feedback saved as a GHL task. | Check your Tasks in GHL. Follow up personally. |

**Key point:** You do NOT need to manually enter leads. The system handles it. Just check GHL daily for new contacts.

---

## Your Pipeline (10 Stages)

Your pipeline is called **"Luxe Shutters Pipeline."** Every job moves through these stages from left to right.

| Stage | What It Means | Who Moves It Here | What to Do |
|-------|--------------|-------------------|-----------|
| **New Enquiry** | Fresh lead just came in | Automatic (from any of the 5 sources) | Review the lead. Call or message them. |
| **Consultation Scheduled** | You've booked a time to visit | You (drag the card) | Show up, take notes, show samples. |
| **Measurements Taken** | You've been to the property and measured up | You (drag the card) | Enter measurements + product + colour in the opportunity fields. |
| **Quote Requested** | Ready for a quote to be generated | You (drag the card) | **AUTOMATIC:** System calculates cost, creates Xero quote, emails it to customer. |
| **Quote Sent** | Quote has been emailed to the customer | Automatic (after quote is generated) | **AUTOMATIC:** Follow-up sequence starts (Day 3 email, Day 6 SMS, Day 11 call task). |
| **Won** | Customer accepted the quote | You (drag the card) | **AUTOMATIC:** Xero invoice created, Cora order submitted, install task created. |
| **Invoice Sent** | Invoice has been sent via Xero | Automatic | Wait for payment. |
| **In Production** | Product is being manufactured | You (drag the card) | Track with supplier. Update customer on ETA. |
| **Installation Scheduled** | Install date booked with customer | You (drag the card) | Confirm date with customer. |
| **Completed** | Job finished, customer happy | You (drag the card) | Ask for a Google review! |
| **Lost** | Customer decided not to go ahead | You (drag the card) | Note the reason. Move on. |

---

## The Quote System (How It Works)

This is the most powerful part of your system. Here is what you do vs what happens automatically:

### What YOU Do:

1. **Visit the customer** and take measurements
2. **Open the opportunity** in GHL (click on the lead's card in the pipeline)
3. **Fill in these fields:**
   - **Product Type** - choose from the dropdown (Shutters, Roller Blinds, Curtains, Awnings, Zipscreens, etc.)
   - **Measurements** - enter one per line, format: `1200x2100` (width x height in mm)
   - **Mount Config** - Inside or Outside mount
   - **Colour Preference** - enter the product/colour name (e.g., "Oasis", "Bayview Basswood", "Forte Select White")

4. **Move the card to "Quote Requested"**

### What the SYSTEM Does Automatically:

1. **Calculates the cost price** from the CWGlobal price list (covers 17 product types)
2. **Applies your markup** (default 40%, or whatever you set)
3. **Creates a Xero draft quote** with per-window line items
4. **Moves the card to "Quote Sent"**
5. **Starts the follow-up sequence:**
   - Day 3: sends a follow-up email to the customer
   - Day 6: sends a follow-up SMS (if phone number exists)
   - Day 11: creates a manual call task for you in GHL

### When the Customer Says YES:

1. **Move the card to "Won"**
2. The system automatically:
   - Creates a Xero invoice from the quote
   - Submits a Cora order to the supplier (for Shutters, Roller Blinds, Curtains, Awnings)
   - Creates an installation task in GHL

### Products with Auto-Pricing:

| Product | Pricing Source |
|---------|---------------|
| Plantation Shutters (14 types) | CWGlobal rate by product/finish ($184-$330/m2) |
| Roller Blinds | Atlas Cat 1 exact lookup |
| Roller Blinds Wattle | Cat 1/2/3 exact lookup |
| Curtains (12 fabric categories) | Aura Drapery + Velare track exact lookup |
| Awnings | Zip Guide Cat 1 exact lookup |
| Zipscreens | Zip Guide Cat 1 exact lookup |
| Venetian Blinds (5 types) | Exact W x H lookup |
| Vertical Blinds | 89mm/127mm slat exact lookup |
| Panel Glides | Classic/Timber exact lookup |
| VersaDrapes | Cat 1-4 exact lookup |
| Dual Shades | 11 fabrics, $/m2 |
| Lumex Louvre Roof | SkyStrong 220 exact lookup |
| Manual Louvre Roof | AltrisShield 5 SKU nearest-match |
| Velare Tracks Only | 26 models x 26 widths exact lookup |
| Pleated Insect Screens | Std/Zero, Single/Double |
| LouvreEase | 8 accessories, unit price |
| Security Roller Shutters | **$65/m2 ESTIMATED - you need to verify** |

**Colour/product detection:** When you type the colour preference, the system automatically detects which product variant you mean. For example:
- "Forte Select" → $184/m2
- "Bayview Basswood Stained" → $276/m2
- "Oasis" (or if you leave it blank) → $202/m2 (default)

---

## Custom Fields Explained

### On Every Contact:
| Field | What It Means |
|-------|--------------|
| Lead Source | Where the lead came from (Quote Form, Consultation, Phone, Web Chat, Feedback) |
| Enquiry Type | What they're interested in |
| Notes | AI summary of their conversation or form submission |
| Service Type | What product they asked about |
| Timeframe | How soon they want it done |
| Property Type | House, unit, commercial, etc. |
| Window Count | How many windows they mentioned |

### On Every Opportunity (Quote):
| Field | What It Means |
|-------|--------------|
| Product Type | What you're quoting (dropdown: 26 options) |
| Measurements | One per line, WIDTHxHEIGHT in mm |
| Mount Config | Inside or Outside |
| Colour Preference | Product variant or colour name |
| Cost Price | Auto-calculated from price list (or manually entered) |
| Markup % | Default 40% (change if needed) |
| Consumer Price | Auto-calculated (cost x markup) |
| Additional Notes | Anything else about this job |

---

## Daily Routine

1. **Morning:** Open GHL. Check "New Enquiry" column for new leads.
2. **Call/message** new leads to book consultations.
3. **After visits:** Enter measurements and move cards to "Quote Requested."
4. **Check tasks** for any follow-up calls the system has scheduled.
5. **When customer accepts:** Move card to "Won." Everything else is automatic.

---

## Tips & Common Issues

**"I entered measurements but the quote seems wrong"**
- Check the format: must be `WIDTHxHEIGHT` (e.g., `1200x2100`), one per line
- Check the colour preference matches a known product (see pricing table above)
- Security Roller Shutters pricing is estimated - verify manually

**"Customer didn't get the follow-up email"**
- Check if they have a valid email address in GHL
- The system skips email if no email exists (won't crash, just skips that step)

**"I need to change the markup"**
- Open the opportunity, change the Markup % field, move back to a previous stage, then back to Quote Requested to regenerate

**"Where do I see my Xero quotes?"**
- The system creates them in Xero automatically. The Xero Quote URL is saved in the opportunity fields once generated.

**"How do I connect Xero?"**
- Visit this URL once (you only need to do this one time): `https://primary-production-5fdce.up.railway.app/webhook/xero-auth-start`
- Log in to your Xero account and approve the connection
