# LuxeShutters - Update & Action Items

**Date:** 10 April 2026
**From:** MonteKristo AI

---

## What We've Done

**Xero Contact Sync - Fixed**
Contact details (phone, email, address, suburb, postcode) now sync from GHL into Xero when a quote or invoice is created. Previously only the name was coming through. Both workflows updated and live.

**GHL Staff - Done**
Chris is now added as Agency Owner with full access.

**Pipeline - Done**
"Rework" stage added between Installation Scheduled and Completed.

**AI Phone Agent - Upgraded**
The Luxe Shutters phone receptionist has been completely rewritten. More natural, handles objections better, sounds like a real local receptionist. Live now.

---

## What We Need From You

### 1. Outlook Calendar & Email

To keep all client communication logged in GHL and sync your calendar, you'll need to connect Outlook. Takes about 10 minutes.

**Connect your email:**
1. In GHL, go to Settings (gear icon, bottom-left)
2. Click Integrations
3. Find Microsoft Outlook / Office 365 and click Connect
4. Sign in with your Outlook account
5. Grant the permissions it asks for
6. Then go to Settings > Email Services
7. Select your Outlook account as the default sending email
8. Turn on "Log sent emails to conversations"

**Sync your calendar:**
1. Go to Settings > Calendars
2. Click your calendar (or create one)
3. Find Calendar Sync / Integrations
4. Click Connect Outlook Calendar
5. Pick the calendar you want to sync
6. Turn on two-way sync

Do the same for Cam if he uses Outlook.

---

### 2. SMS Reminders - We Need Twilio or LC Phone

For the text confirmations (24hrs before quote, 48hrs before install), we need a phone number that can send SMS. Two options:

**Option A - Twilio (cheaper per message, more setup)**
1. Create an account at twilio.com/try-twilio
2. Add a payment method
3. Submit an Australian regulatory bundle (you'll need your ABN + a utility bill, takes 1-3 days to approve)
4. Buy an Australian number (~$2/month)
5. Send us your Account SID, Auth Token, and the number

**Option B - GHL LC Phone (simpler, slightly more expensive)**
1. In GHL, go to Settings > Phone Numbers
2. Click + Add Number
3. Search for an Australian number
4. Purchase it

Either way works. Let us know which you prefer and we'll build the reminder workflows once the number is sorted.

---

### 3. Website Location Pages - Urgent

The new website doesn't have location-specific pages (like /shutters-temora or /blinds-wagga). If your Google Ads are pointing to location URLs, they're likely landing on error pages.

**We need from you:**
- The exact URLs your Google Ads are currently pointing to
- Which towns you want dedicated pages for
- Which products for each town

Once we have that, we'll build proper landing pages with local content, SEO, and your quote form.

---

## Summary

| Item | Status |
|------|--------|
| Xero contact sync | Done (fixed typeVersion bug) |
| Chris added to GHL | Done |
| Rework pipeline stage | Done |
| AI phone agent upgrade | Done |
| Retell Phone null phone fix | Done |
| Location pages (8 towns) | Done — deployed, need old ad URLs for redirects |
| Pricing engine (40 products) | Done — 14 new products auto-pricing from Retail |
| GHL Product Type dropdown | Done — expanded from 26 to 40 options |
| All 10 workflows tested | Done — all pass |
| Outlook integration | Needs Chris (10 min) |
| SMS reminders | Needs Twilio or LC Phone setup |
| Old Google Ads URLs | Needs Chris — for 301 redirects |
| Delete test data | Needs Chris — filter GHL by "MKTEST-DELETE" tag, delete Xero draft quotes from Apr 14 |
