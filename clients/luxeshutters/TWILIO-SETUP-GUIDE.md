# Twilio Setup Guide for LuxeShutters

**Prepared by:** MonteKristo AI
**Date:** 4 April 2026
**For:** Chris & Campbell, LuxeShutters (Temora, NSW)

---

## What This Guide Covers

This guide walks you through setting up a Twilio account from scratch, purchasing an Australian phone number, and connecting it to your LuxeShutters AI phone agent. By the end, your AI receptionist will answer calls on a real Australian phone number.

**No prior Twilio experience is needed.** Follow each step in order.

---

## Overview of What We're Building

```
Customer calls your number
        |
        v
Australian phone number (on Twilio)
        |
        v
Twilio SIP Trunk (routes the call)
        |
        v
Retell AI Agent (your AI receptionist)
        |
        v
Lead captured in GoHighLevel CRM
```

**Why Twilio?** Retell AI (our AI phone agent platform) only sells US and Canadian numbers directly. For Australian numbers, we need to purchase one through Twilio and connect it to Retell using a technology called SIP Trunking. Twilio is the world's largest cloud telephony provider, used by companies like Uber, Airbnb, and thousands of Australian businesses.

---

## PART 1: Create Your Twilio Account

### Step 1.1 - Sign Up

1. Go to **twilio.com** in your browser
2. Click **"Sign up"** (top right corner)
3. Fill in your details:
   - **First name:** Chris (or whoever will manage the account)
   - **Last name:** Hanlon
   - **Email:** Your business email (e.g. chris@luxeshutters.com.au)
   - **Password:** Choose a strong password (save it somewhere safe)
4. Click **"Start your free trial"**
5. You will receive a verification email. Open it and click the verification link.
6. Twilio will ask you to verify your phone number via SMS. Enter your mobile number (e.g. +61 4XX XXX XXX) and enter the code they send you.

### Step 1.2 - Complete Your Twilio Profile

After email and phone verification, Twilio will ask some questions:

- **Which product do you need?** Select **"Voice"**
- **What are you building?** Select **"Contact Center"** or **"IVR / Phone Tree"**
- **How do you want to build?** Select **"With code"** (MonteKristo handles the technical side)
- **What is your preferred coding language?** Select **"JavaScript"** (or skip if optional)

### Step 1.3 - Upgrade from Trial to Full Account

**Important:** Trial accounts have limitations (can only call verified numbers, calls have a "trial" message). You must upgrade before going live.

1. In Twilio Console, click **"Upgrade"** in the top banner (or go to **Billing** in the left sidebar)
2. Enter your payment details:
   - **Credit card or debit card** (Visa, Mastercard, or Amex)
   - **Billing address:** Your business address in Temora
3. Add credit to your account. **We recommend starting with $20 USD** (approximately $30 AUD). This will cover your phone number and many hours of calls.
4. After upgrading, Twilio will ask for your **company details**:
   - **Company name:** Maxwell Hanlon Group Pty Ltd (or LuxeShutters)
   - **Website:** Leave blank for now (or enter luxeshutters.com.au if you have it live)
   - **ABN:** Your Australian Business Number

### Step 1.4 - Save Your Account Credentials

These two values are needed later. You will find them on the **Twilio Console home page** (dashboard):

1. **Account SID** - starts with "AC" followed by a long string (e.g. `AC1a2b3c4d5e...`)
2. **Auth Token** - click "Show" to reveal it (keep this secret, never share publicly)

Write these down or take a screenshot. **Send both values to Milan (MonteKristo) securely** (not via unencrypted email). Use a message in GoHighLevel, or text/WhatsApp is fine.

---

## PART 2: Set Up Australian Regulatory Compliance

Australian phone numbers require identity verification. This is a legal requirement from the Australian Communications and Media Authority (ACMA) and takes about 5-10 minutes to complete.

### Step 2.1 - Navigate to Regulatory Compliance

1. In Twilio Console, look at the **left sidebar**
2. Click **"Phone Numbers"** (the phone icon)
3. Under Phone Numbers, click **"Regulatory Compliance"**
4. Click **"Bundles"**
5. Click **"Create a Regulatory Bundle"**

### Step 2.2 - Choose Your Number Type

You will see options for country and number type:

- **Country:** Select **Australia (+61)**
- **Number type:** Choose one of the following (see the comparison below to decide):

| Number Type | Looks Like | Monthly Cost (USD) | Voice Inbound | Voice Outbound | SMS | Best For |
|------------|------------|-------------------|:---:|:---:|:---:|----------|
| **Local** | +61 2 XXXX XXXX | $3/month | Yes | Yes | No | Professional local presence, lowest cost |
| **Mobile** | +61 4XX XXX XXX | $6.50/month | Yes | Yes | Yes | If you also need SMS capability |
| **Toll-Free (1800)** | 1800 XXX XXX | $16/month | Yes | **No** | No | Free calls for customers, national presence |

**Important notes about number types:**
- **1800 numbers are inbound only.** Australian carriers block outbound calls from 1800 numbers. This means if the AI agent needs to call a customer back, it cannot use a 1800 number. You would need a separate local or mobile number for outbound.
- **Only mobile numbers support SMS** in Australia on Twilio. Local and 1800 numbers cannot send or receive text messages.

**Our recommendation:** Start with a **Local number** with a NSW area code (02 for Temora/regional NSW). It is the cheapest option, supports both inbound and outbound calls, and looks professional. If you also want a 1800 number for marketing materials, you can add one later or port your existing 1800 (see Part 6). If you need SMS capability, choose a **Mobile number** instead.

If you already have a 1800 number, you can port it to Twilio later (see Part 6), but be aware it will be inbound-only.

- **End user type:** Select **"Business"**

### Step 2.3 - Fill in Business Details

Fill in the following information exactly as it appears on your business registration:

**For Local Numbers:**
- **Business name:** Maxwell Hanlon Group Pty Ltd
- **Business address:** 185 Hoskins St, Temora, NSW 2666, Australia
- No supporting documents are required upfront for local numbers. Twilio will digitally verify your details.

**For Toll-Free (1800) Numbers:**
- **Business name:** Maxwell Hanlon Group Pty Ltd
- **Business address:** 185 Hoskins St, Temora, NSW 2666, Australia
- **Website:** luxeshutters.com.au (or your verified social media page)
- **Business registration number:** Your ABN (Australian Business Number)
- **Authorized representative:** Chris Hanlon, chris@luxeshutters.com.au

**For Mobile Numbers:**
- Same as above, PLUS:
- **Proof of business identity:** ABN registration document or ASIC company extract
- **Proof of address:** Business utility bill, ATO correspondence, or council rates notice

### Step 2.4 - Submit for Review

1. Review all your information
2. Click **"Submit for Review"**
3. Twilio will verify your details. This typically takes **24 business hours** (often faster)
4. You will receive an email when your bundle is **Approved**

**Status meanings:**
- **Draft** - Not yet submitted (you can still edit)
- **Pending Review** - Twilio is checking your details
- **Approved** - You can now buy numbers
- **Rejected** - Something needs fixing (Twilio will tell you what)

If your bundle is rejected, check that your business name matches exactly what is on your ABN registration. Fix and resubmit.

---

## PART 3: Purchase an Australian Phone Number

Once your regulatory bundle is approved (you will receive an email), follow these steps:

### Step 3.1 - Browse Available Numbers

1. In Twilio Console left sidebar, click **"Phone Numbers"**
2. Click **"Buy a Number"**
3. Set the filters:
   - **Country:** Australia (+61)
   - **Number type:** Local (or Toll-Free, matching your approved bundle)
   - **Capabilities:** Make sure **"Voice"** is ticked
   - **Area code (for local):** Enter **02** for NSW/ACT or leave blank to see all
4. Click **"Search"**

### Step 3.2 - Choose and Buy

1. Browse the list of available numbers
2. Pick one that looks good (the digits do not matter much for a business)
3. Click **"Buy"** next to your chosen number
4. Twilio will ask you to assign your regulatory bundle to this number
5. Select the bundle you created in Part 2
6. Confirm the purchase

**Write down your new number** (e.g. +61 2 6977 XXXX). Send it to Milan.

### Step 3.3 - Costs

Your Twilio account will be charged:
- **Monthly fee:** $3 USD for local, $6.50 USD for mobile, $16 USD for toll-free
- **Per-minute inbound (local/mobile):** $0.01 USD per minute (~1.5 cents AUD)
- **Per-minute inbound (toll-free):** $0.05 USD per minute
- These are Twilio's charges only. Retell AI also charges $0.10 USD/min for Australian calls (the AI processing cost).

**Total cost example:** A 3-minute inbound call on a local number costs roughly $0.33 USD total ($0.03 Twilio + $0.30 Retell). See Appendix A for full pricing.

---

## PART 4: Create an Elastic SIP Trunk

This is the bridge that routes calls from your Twilio number to the Retell AI agent. It sounds technical, but it is just filling in a few settings.

### Step 4.1 - Navigate to SIP Trunking

1. In Twilio Console left sidebar, click **"Elastic SIP Trunking"**
   - If you do not see it in the sidebar, click **"Explore Products"** and search for "SIP Trunking", then pin it to your sidebar
2. Click **"Trunks"**
3. Click **"Create new SIP Trunk"** (the "+" button)
4. **Friendly name:** Enter `LuxeShutters-Retell`
5. Click **"Create"**

### Step 4.2 - Configure Termination (for outbound calls)

This allows the AI agent to make outbound calls if needed.

1. Click on your new trunk (`LuxeShutters-Retell`)
2. Click the **"Termination"** tab
3. **Termination SIP URI:** Enter a unique name, e.g. `luxeshutters`
   - This creates: `luxeshutters.pstn.twilio.com`
   - **For best latency in Australia, use the Sydney endpoint:** `luxeshutters.pstn.sydney.twilio.com`
4. Under **Authentication**, click **"Add Credential List"** (recommended over IP whitelisting)
   - Click **"Create new Credential List"**
   - **Friendly name:** `Retell-AI-Credentials`
   - **Username:** Choose something (e.g. `luxeshutters_retell`)
   - **Password:** Choose a strong password
   - **Write down both the username and password.** You will need to send these to Milan along with your other credentials.
5. Click **"Save"**

**Why credentials instead of IP whitelisting?** Retell AI's servers do not have fully static IP addresses. Credential-based authentication is more reliable and is recommended by Retell's documentation.

### Step 4.3 - Configure Origination (for inbound calls)

This routes incoming calls from your Australian number to Retell AI.

1. Click the **"Origination"** tab
2. Click **"Add new Origination URI"**
3. **Origination SIP URI:** Enter exactly:
   ```
   sip:sip.retellai.com
   ```
4. **Priority:** `10`
5. **Weight:** `10`
6. Click **"Add"**

### Step 4.4 - Assign Your Phone Number to the Trunk

1. Click the **"Numbers"** tab
2. Click **"Add a Number"** (or the "+" icon)
3. Select the Australian number you purchased in Part 3
4. Click **"Add Selected"**

### Step 4.5 - Enable Voice Geographic Permissions for Australia

This step allows outbound calls to be made to Australian numbers. Without it, outbound calls to Australia will fail.

1. In the Twilio Console left sidebar, go to **"Voice"** (or search for "Voice Geographic Permissions")
2. Click **"Settings"** then **"Geo Permissions"**
3. Find **"Australia"** in the list
4. Make sure the checkbox is **ticked** (enabled)
5. Click **"Save"**

Your SIP trunk is now fully configured. When someone calls your Australian number, Twilio will route the call to Retell AI.

---

## PART 5: Hand Off to MonteKristo

At this point, you have completed everything on your side. Send the following to Milan at MonteKristo:

### What to Send

We need exactly these details to connect your number to the AI agent. Here is what each one is and where to find it:

| # | What We Need | Where to Find It | Example |
|---|-------------|-----------------|---------|
| 1 | **Phone Number** (your new AU number, in +61 format) | Twilio Console > Phone Numbers > Active Numbers | `+61269771234` |
| 2 | **Termination URI** (your SIP trunk address) | Twilio Console > Elastic SIP Trunking > Your trunk > Termination tab | `luxeshutters.pstn.sydney.twilio.com` |
| 3 | **SIP Trunk User Name** (the username you created in Part 4, Step 4.2) | You chose this when setting up credentials | `luxeshutters_retell` |
| 4 | **SIP Trunk Password** (the password you created in Part 4, Step 4.2) | You chose this when setting up credentials | (your chosen password) |

These are the exact four values we plug into the AI system to connect your number. Without any one of them, we cannot proceed.

**Send these securely** (GoHighLevel message, WhatsApp, or Signal). Do not send via unencrypted email.

### What MonteKristo Will Do

Once we receive these details, we will:

1. **Contact Retell AI support** to whitelist Australia on our account (required one-time step for international numbers)
2. **Import your Australian number into Retell AI** using the SIP trunk connection and credentials you provided
3. **Assign it to your LuxeShutters AI agent** (already built and tested)
4. **Run a test call** to verify:
   - The AI agent answers on your Australian number
   - The call recording and analysis work
   - The lead is captured in your GoHighLevel CRM with all details
5. **Confirm everything is live and working**

This takes about 15-30 minutes on our end (plus any wait time for Retell support to whitelist AU).

---

## PART 6: Optional - Port Your Existing 1800 Number to Twilio

If you want your existing business number (1800 465 893) to ring through to the AI agent instead of buying a new number, you can port it to Twilio.

### Important Notes About Porting

- **Porting transfers your number away from your current carrier to Twilio.** Your current carrier will no longer handle calls to that number.
- **During the port, there is no downtime.** The switchover happens instantly on the scheduled port date.
- **Porting takes up to 6 weeks** for Australian local/toll-free/1300 numbers (mobile numbers are faster, about 1 week)
- **You cannot undo a port easily.** Make sure you want to move the number before starting.
- **Do NOT cancel your current account or deactivate your number** while the port is in progress. This can cause the port to fail.

### Porting Steps

1. **Check portability:** In Twilio Console, go to **Phone Numbers > Port & Host > Port a Number**
2. Enter your number: `+61 1800 465 893`
3. Twilio will check if it can be ported
4. If eligible, you will need:
   - **Your current carrier name** (whoever provides your 1800 number now)
   - **Your account number** with that carrier
   - **A recent invoice/bill** from that carrier
   - **Letter of Authorization (LOA):** Twilio generates this automatically. You (Chris, as the authorized person) will receive an email to digitally sign it.
5. Twilio submits the port request to your current carrier
6. You will receive a confirmed port date via email
7. On the port date, calls to 1800 465 893 will automatically route to Twilio (and then to Retell AI)

### Alternative: Call Forwarding (simpler, but costs more)

Instead of porting, you can set up **call forwarding** with your current carrier:

1. Call your current 1800 provider
2. Ask them to set up **unconditional call forwarding** from 1800 465 893 to your new Twilio Australian number
3. This way you keep your 1800 number with your current carrier, and it simply forwards all calls to Twilio/Retell

**Pros:** Quick to set up (same day), easy to reverse
**Cons:** You pay your current carrier's forwarding fees PLUS Twilio/Retell per-minute fees (double cost)

---

## Appendix A: Cost Summary

| Item | Cost (USD) | Frequency |
|------|-----------|-----------|
| Twilio account | Free | One-time |
| AU Local number (+61 2/3/7/8) | $3.00/month | Monthly |
| AU Mobile number (+61 4) | $6.50/month | Monthly |
| AU Toll-Free (1800) | $16.00/month | Monthly |
| Twilio per-minute (local/mobile inbound) | $0.01/min | Per call |
| Twilio per-minute (toll-free inbound) | $0.05/min | Per call |
| Twilio per-minute (outbound to AU landline) | $0.025/min | Per call |
| Twilio per-minute (outbound to AU mobile) | $0.075/min | Per call |
| Retell AI per-minute (AU calls) | $0.10/min | Per call |
| **Typical 3-min inbound call on local number** | **$0.33** | Per call |
| **Typical 3-min inbound call on 1800 number** | **$0.45** | Per call |

**Monthly estimate for 50 inbound calls (avg 3 min each):**
- Local: $3 (number) + $15 (Retell) + $1.50 (Twilio) = **~$20 USD/month (~$30 AUD)**
- Toll-Free: $16 (number) + $15 (Retell) + $7.50 (Twilio) = **~$39 USD/month (~$58 AUD)**

---

## Appendix B: Troubleshooting

| Problem | Solution |
|---------|----------|
| Regulatory bundle rejected | Check that your business name matches your ABN registration exactly. Resubmit with corrected details. |
| No AU numbers available with my area code | Try a different area code, or choose toll-free instead. Not all area codes have stock at all times. |
| SIP trunk not connecting | Verify the origination URI is exactly `sip:sip.retellai.com` (no spaces, no trailing slash). Check that IP ACL includes `18.98.16.120/30`. |
| Calls go to voicemail or fail | Make sure the number is assigned to the SIP trunk (Part 4, Step 4.4). Check that the trunk's origination is configured. |
| Outbound calls to AU get SIP 403 error | Australia must be whitelisted at the Retell account level. MonteKristo handles this by contacting Retell support. Also check Twilio's Voice Geographic Permissions (Part 4, Step 4.5). |
| Inbound calls connect but no audio | Check SIP trunk transport protocol. Try changing from UDP to TCP by appending `;transport=tcp` to the origination URI. |
| Trial message plays on calls | You are still on a trial account. Complete the upgrade in Part 1, Step 1.3. |
| Cannot find "Elastic SIP Trunking" | Click "Explore Products" in the left sidebar and search for it, then click the pin icon to add it. |

---

## Appendix C: Glossary

| Term | What It Means |
|------|---------------|
| **Twilio** | Cloud phone system provider. Hosts your Australian number. |
| **Retell AI** | AI agent platform. Handles the actual phone conversation. |
| **SIP Trunk** | A virtual phone line that connects Twilio to Retell AI over the internet. |
| **Regulatory Bundle** | Australian government-required identity verification to own a phone number. |
| **Account SID** | Your unique Twilio account identifier (like a username). |
| **Auth Token** | Your Twilio account secret key (like a password). |
| **Origination** | Where incoming calls go (in our case, to Retell AI). |
| **Termination** | Where outgoing calls are sent (to the phone network). |
| **Porting** | Moving your existing phone number from one carrier to another. |
| **CIDR** | A technical notation for specifying a range of IP addresses. |
| **ABN** | Australian Business Number, your unique business identifier. |

---

## Need Help?

If you get stuck at any point, message Milan in GoHighLevel or call/text. We are happy to jump on a screen share and walk you through any step.

**MonteKristo AI** | contact@montekristobelgrade.com
