# REIG Solar - HubSpot Automation Deployment

**Prepared for:** Brian Otto, CEO - REIG Solar
**Prepared by:** MonteKristo AI
**Date:** April 10, 2026

---

## 1. Email Automation System

The full quote follow-up automation system is now live. All workflows are running in production with zero monthly cost (SendGrid free tier).

### Quote Follow-Up Sequence

Automatic email and task sequence triggered for every open deal in the Proposal Sent or Budgetary Proposals stage. The system checks daily at 8:00 AM EST and sends the appropriate follow-up based on how many days have passed since the quote was sent.

| Day | Action | Type |
|-----|--------|------|
| 7 | "Any questions? Happy to walk through it" | Email |
| 21 | "Checking timing / next steps" | Email |
| 30 | "Should I keep this open or close it out?" | Email |
| 45 | Call task created in HubSpot | Task |
| 60 | "Quote expired, want me to refresh pricing?" | Email |
| 90 | Final follow-up call task created in HubSpot | Task |

- All emails send from **brian@reig-us.com** through SendGrid, so they appear to come directly from you
- The system automatically skips any deal that moves to Closed Won, Closed Lost, or Dead/Superseded
- Each follow-up is logged for reporting purposes

### Hot Lead Detection

Tracks engagement with your emails in real time through SendGrid event monitoring.

- **Email opens:** Each open is counted per contact. At 2 opens the contact is marked as "Warm", at 3+ opens they are flagged as "Hot". This appears on the contact record under the **"Lead Temperature"** field
- **Link clicks:** When a contact clicks any link in your email, a high-priority follow-up task is automatically created in HubSpot with their name, email, and the specific link they clicked

### Stale Deal Re-engagement

Runs daily at 9:00 AM EST. If a deal in Proposal Sent or Budgetary Proposals has had no activity for 7 days, the system sends a check-in email to the associated contact automatically.

### New Contact Welcome Email

Whenever a new contact is created in HubSpot (from any source), they receive an introductory email covering REIG's services, SCADA/DAS specialization, and RenergyWare product line.

### Weekly Sales Report

Delivered every Monday at 9:00 AM EST to brian@reig-us.com. Includes:

- Total deals and open deals
- Proposals Sent and Budgetary Proposals breakdown
- Closed Won / Closed Lost / Dead counts
- Close rate percentage
- Average days to close
- Average follow-up attempts per deal
- Deals lost due to no response
- New deals created that week

### Action Required

When sending a quote, fill in the **"Quote Sent Date"** field on the deal record. This tells the system exactly when to start the follow-up sequence. If left blank, the deal creation date is used as a fallback.

---

## 2. Goals Duplication Fix

### Problem Identified

The Goals "Bids Created" metric was double-counting projects. REIG's system creates separate deal records for proposals (REIQ) and orders (REIO). When a bid converts to a contract, the original REIQ deal stays in Proposal Sent while a new REIO deal is created in Closed Won. Goals was counting both, inflating the bid count and throwing off the 30% conversion target.

### What Was Done

- Created a new deal property: **"Deal Category (Proposal/Order)"**
- Tagged all **710 proposal deals** as "Proposal (REIQ)"
- Tagged all **635 order deals** as "Order (REIO)"
- New deals are tagged automatically going forward based on REIQ/REIO in the deal name

### Action Required

1. Go to the **Goals** tab in HubSpot
2. Edit the "Bids Created" goal
3. Add a filter: **Deal Category (Proposal/Order)** = **Proposal (REIQ)**
4. Save

This ensures Goals only counts actual bids (proposals), not duplicate order records. The 30% conversion tracking will be accurate from this point forward.

---

## 3. Website Form Notifications Updated

The popup form on reig-us.com ("Claim Your Bonus" - Commissioning Guide lead magnet) was only sending submission notifications to MonteKristo AI. The REIG team was not being notified when new leads came in through the website.

Updated notification recipients:

| Recipient | Email |
|-----------|-------|
| Brian Otto | botto@reig-us.com |
| M. Rhyne | mrhyne@reig-us.com |
| Kreel (Blue Ocean) | kreel@blueoceanaiagency.com |
| MonteKristo AI | contact@montekristobelgrade.com |

No action required. Already live.

---

## System Summary

| Component | Status | Trigger |
|-----------|--------|---------|
| Quote Follow-Up Sequence | Active | Daily 8:00 AM EST |
| Hot Lead Detection | Active | Real-time (SendGrid events) |
| Stale Deal Re-engagement | Active | Daily 9:00 AM EST |
| New Contact Welcome Email | Active | Real-time (HubSpot webhook) |
| Weekly Sales Report | Active | Monday 9:00 AM EST |
| Deal Category Tagging | Complete | 1,346 deals tagged |
| Form Notifications | Updated | Real-time |

Monthly cost: **$0**
