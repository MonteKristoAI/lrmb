# Pulse Performance Studio — Integrations Reference

Last updated: 2026-03-31

---

## Retell AI

| Resource | ID / Value |
|----------|-----------|
| Agent ID (Outbound SDR) | `agent_d7187b5cf0c77bf25fcac95a47` |
| Agent name (internal) | Gym |
| AI name (in call) | Anna |
| LLM ID | `llm_7a4325ade3c8ec2f3bc65208feac` |
| LLM version | 0 |
| Model | gpt-5.1 |
| Voice | retell-Cimo |
| Language | en-US |
| Interruption sensitivity | 0.9 |
| Silence end call (ms) | 30000 |
| Max duration (ms) | 3600000 |
| Post-call analysis model | gpt-4o-mini |
| **Webhook URL** | ✅ `https://primary-production-5fdce.up.railway.app/webhook/retell-pulse` |
| Phone number | ⚠️ TBD — purchase Atlanta area code (404/678/770) |

### Post-Call Analysis Fields (configured ✅)
| Field | Type | Choices |
|-------|------|---------|
| lead_name | string | — |
| phone_number | string | — |
| lead_goal | string | — |
| primary_challenge | string | — |
| motivation_trigger | string | — |
| path_taken | enum | ems_intro, body_contouring, disqualified, no_answer |
| booking_status | enum | booked, link_sent, not_interested, disqualified, no_answer |
| booking_link_sent | boolean | — |

---

## GoHighLevel — gymtest

| Resource | ID / Value |
|----------|-----------|
| Location ID | `YESvqOS2vsCLnJUXzsa1` |
| MCP server name | `ghl-gymtest` |
| Private Integration Token | `pit-318b21b0-cd8a-4da9-874c-a34e7c264621` |
| API Base URL | `https://services.leadconnectorhq.com` |
| Version header | `2021-07-28` |

### GHL Pipeline — "basic" (temporary)
> ⚠️ Pipeline creation requires admin access. Create "Pulse Outbound Leads" pipeline manually in GHL UI.
> After creating, update stage IDs in `Extract Call Data` node in n8n workflow `7QH9i9DkU5RXdfrs`.

| Stage | Current Name | Target Name | Stage ID |
|-------|-------------|-------------|----------|
| 0 | New Lead | New Lead | `8c1b89fb-2ffd-4b92-a2b0-166aa6962d30` |
| 1 | Contacted | Spoke — No Booking | `e564b707-dead-494b-a154-6f90e3af600b` |
| 2 | Proposal Sent | **Intro Session Booked** | `62ff53f4-c92a-4516-a9e9-71bcb760155d` |
| 3 | Closed | Not a Fit | `d4155173-166c-4df8-875b-87cd0268770a` |

Pipeline ID: `zb8PBQPck6uVra0HGgam`

### GHL Custom Fields (all created ✅)
| Field name | Field Key | GHL Field ID |
|-----------|-----------|-------------|
| lead_goal | contact.lead_goal | `CnPc9T1mR6Q7MODYUTmD` |
| primary_challenge | contact.primary_challenge | `34JyxKrBFz0Vr6qiZRTI` |
| motivation_trigger | contact.motivation_trigger | `OI3XJye40hQL8uinzuFT` |
| desired_outcome | contact.desired_outcome | `vsrwTsofRu4tenXXFbV9` |
| booking_status | contact.booking_status | `zDiNaXbZW0dy1bRKMLKv` |
| retell_call_id | contact.retell_call_id | `wpAWnE6e6x7Wd93iE2WO` |
| ad_source | contact.ad_source | `FktjL6ru9VKKp1ni5VNk` |
| path_taken | contact.path_taken | `62pIusF9YJGPmZRCP5pZ` |

---

## n8n Automation

| Resource | ID / Value |
|----------|-----------|
| n8n instance | `https://primary-production-5fdce.up.railway.app/` |
| **Workflow: "Pulse — Retell Post-Call Processor"** | ✅ `7QH9i9DkU5RXdfrs` |
| Webhook path | `/webhook/retell-pulse` |
| Full webhook URL | `https://primary-production-5fdce.up.railway.app/webhook/retell-pulse` |
| Status | ✅ **ACTIVE** — email node disabled until SMTP configured |

### Workflow Logic
```
POST /webhook/retell-pulse (from Retell after every call)
  → Extract Call Data (Code node)
      - Parses call_analysis.custom_analysis_data
      - Maps booking_status → GHL pipeline stage ID
      - Sets should_notify flag
  → GHL Upsert Contact (HTTP Request)
      - Creates or updates contact in gymtest
      - Tags with 'pulse-outbound-lead'
      - Populates all 6 custom fields
  → GHL Create Opportunity (HTTP Request)
      - Creates opportunity in 'basic' pipeline
      - Stage depends on booking outcome
      - Sets monetary value ($29 if booked)
  → Should Notify Glenn (IF node)
      - If booking_status = booked OR link_sent:
          → Send email to buckhead@ + glenn@
```

### Email Notification (requires SMTP setup)
> ⚠️ Email node requires SMTP credentials configured in n8n Settings → Credentials.
> Go to n8n → Settings → Credentials → Add new → SMTP.
> Then reconnect the "Notify Glenn — New Booking" node.

---

## Booking Systems

### ClubReady (EMS sessions)
| Resource | Value |
|----------|-------|
| URL | https://pulseperformance.clubready.com/ |
| Login | glenn@pulseperformancestudio.com / AISDR1! |
| Zapier login | glennbraunstein@pulseperformancestudio.com / FeelTheEnergy1! |
| Booking rule | Only book 0-attendee slots |

### GHL Calendar (Body Contouring only)
| Resource | Value |
|----------|-------|
| Calendar ID | TBD — configure in GHL UI (Mon/Tue/Thu/Fri only) |

---

## SMS Payment Flow (not yet implemented)

| Step | System | Status |
|------|--------|--------|
| 1. Opportunity → "Intro Session Booked" | n8n | ✅ (via workflow) |
| 2. GHL sends SMS with $29 payment link | GHL workflow | ⚠️ Set up payment product + GHL automation in UI |
| 3. Payment confirmed webhook | GHL | ⚠️ Configure in GHL |
| 4. Auto-book in ClubReady | Zapier | ⚠️ Set up Zapier zap |
| 5. Email confirmation | n8n / GHL | ⚠️ Pending payment webhook |

---

---

## ClubReady Booking System

| Resource | Value |
|----------|-------|
| Studio URL | https://pulseperformance.clubready.com/ |
| Chain ID | `1034` |
| Store ID | `14318` |
| Developer portal | https://developer.clubready.com |
| Zapier | ✅ Native integration exists |
| n8n community node | ❌ Not available — use HTTP Request nodes |
| Webhooks | ✅ Supported (check-ins, registrations, cancellations) |

### ClubReady — Add Prospect API ✅ WORKING (no agreement needed)

This API adds a lead directly to ClubReady as a prospect. **Already tested and confirmed working.**

| Resource | Value |
|----------|-------|
| Endpoint | `https://www.clubready.com/admin/api/adduserapi.asp` |
| Method | POST |
| API Key field | `apikey` |
| **API Key** | ⚠️ Found in admin portal at: Setup → Add Lead API (page shows current key) |
| Response (success) | ClubReady UserID (numeric string, e.g. `128978921`) |
| Response (error) | Text string e.g. `Invalid API Key` |

**Mandatory fields:**
| POST Variable | Description |
|--------------|-------------|
| `apikey` | From Setup → Add Lead API page |
| `firstname` | Lead first name |
| `lastname` | Lead last name |
| `gender` | `M` or `F` |
| `promotionalsmsoptin` | `1` (opt-in) or `0` |

**Optional fields:** `email`, `cellphone`, `phone`, `prospecttype`, `userid`

**Prospect Types (pre-configured in ClubReady):**
| Type | ID |
|------|----|
| EMS Lead | `75838` |
| EMS Intro Scheduled | `63705` |
| EMS Intro Cancelled | `62108` |
| EMS Intro No-Show | `60012` |
| Body Contouring Lead | `63710` |
| Body Contouring Consultation Scheduled | `61143` |
| Body Contouring Consultation Cancelled | `69756` |
| Body Contouring Consultation No-Show | `75801` |
| Cooled Off | `63704` |
| Missed Sale | `63709` |
| Fake/Invalid Lead | `70867` |

> ⚠️ **Note:** 2 test records were accidentally created during API testing (UserIDs `128978921` and `128978930`). Glenn should delete these via the ClubReady admin.

### ClubReady — Developer REST API (class booking)

For actual slot booking (booking a lead into a specific EMS class), a separate Developer API is required.

| Resource | Value |
|----------|-------|
| API type | REST (Azure API Management) |
| Authentication | `Ocp-Apim-Subscription-Key` header |
| Access request | support@clubready.com — mention Store ID `14318`, sign API agreement |

**Capabilities:**
| Feature | Status |
|---------|--------|
| Query class schedules | ✅ |
| Search slots with 0 attendees | ✅ (needs testing) |
| Book member into class | ✅ |
| Member check-in webhook | ✅ |

### Integration Plan

**Immediate (Add Prospect API — working now):**
```
n8n step after GHL opportunity created:
  1. HTTP POST /admin/api/adduserapi.asp
     → apikey, firstname, lastname, gender=M, promotionalsmsoptin=1
     → email, cellphone, prospecttype (63705 for EMS, 61143 for Body Contouring)
  2. Store returned ClubReady UserID in GHL contact note or custom field
```

**Future (class booking — requires Developer API):**
```
  1. HTTP GET /classes?storeId=14318&attendees=0 → find available slot
  2. HTTP POST /bookings → book prospect into slot
  3. Send email confirmation to buckhead@ + glenn@
```

**To unlock class booking:** Glenn emails support@clubready.com, references Store ID `14318`, signs API agreement.

**Zapier workaround (immediate option):**
If Glenn has Zapier connected to ClubReady already, n8n can trigger Zapier via webhook.
Zapier login: glennbraunstein@pulseperformancestudio.com / FeelTheEnergy1!

---

## ✅ Completed (automated 2026-03-31)

- [x] **n8n workflow** built + ACTIVE — 8 nodes including ClubReady Add Prospect step ✅
- [x] **Retell phone number** purchased: `(678) 661-4504` — assigned inbound + outbound to Anna ✅
- [x] **LuxeShutters test fields deleted** from GHL gymtest (Property Type, product_type, Window Count, Timeframe, Issue Description, enquiry_type) ✅
- [x] **ClubReady Add Prospect node** added to n8n workflow — fires on booking/link_sent outcomes ✅

---

## ⚠️ Manual Steps (for you)

### 1. GHL — Rename Pipeline Stages (5 min)
**GHL → Pulse Performance → Settings → Pipelines → "basic"**
- "Contacted" → **Spoke — No Booking**
- "Proposal Sent" → **Intro Session Booked**
- "Closed" → **Not a Fit**

### 2. n8n — SMTP Credentials (10 min)
**n8n → Settings → Credentials → New → SMTP**
Add email server credentials → open workflow `7QH9i9DkU5RXdfrs` → enable "Notify Glenn — New Booking" node

### 3. ClubReady — Delete 2 test records (2 min)
**pulseperformance.clubready.com → Prospects**
Delete UserID `128978921` (Test Lead) and `128978930` (KeyTest Check)

### 4. ClubReady — API Key (if node fails)
Key may need refreshing. Go to: **pulseperformance.clubready.com → Setup → Add Lead API**
Copy `apikey` value → update in n8n "ClubReady Add Prospect" node → `apikey` field

### 5. GHL — $29 Payment Product + SMS Automation (15 min)
**GHL → Payments → Products → New** → "EMS Intro Session" @ $29
**GHL → Automations → New Workflow:**
- Trigger: Opportunity Stage = "Intro Session Booked"
- Action: Send SMS with payment link

### 6. GHL — Body Contouring Calendar (10 min)
**GHL → Calendars → New** → "Body Contouring Consultation"
Available: Mon / Tue / Thu / Fri only

### 7. ClubReady — Developer API for slot booking (future)
Email **support@clubready.com**, mention Store ID `14318`
Sign API agreement → receive subscription key → I'll build the auto-booking node

### 8. Test End-to-End (30 min)
1. Call `(678) 661-4504` from a test number
2. Check n8n executions log
3. Verify GHL contact + opportunity in correct stage
4. Verify ClubReady prospect added (admin → Prospects)
5. (After SMTP) Verify email to buckhead@
