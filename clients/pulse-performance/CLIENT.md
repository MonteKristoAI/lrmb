# Pulse Performance Studio - Client Profile

**Company:** Pulse Performance Studio
**Owner:** Glenn Braunstein
**Location:** 2286 Peachtree Road, Buckhead, Atlanta, GA 30309, USA
**Phone:** +1 (404) 860-2333
**Email (primary):** glenn@pulseperformancestudio.com
**Email (alt):** glennbraunstein@pulseperformancestudio.com
**Email (studio ops):** buckhead@pulseperformancestudio.com
**Website:** pulseperformancebuckhead.com
**Google Places ID:** ChIJydeGdvkF9YgRWeIiPJtbvOw
**Status:** Active - automation retainer

---

## What We Do for Them

| Service | Stack |
|---------|-------|
| Outbound AI SDR Voice Agent | Retell AI - calls warm leads from FB/IG ads |
| CRM & Lead Management | GoHighLevel (GHL) - real Pulse account (`ghl-pulse`) |
| Post-Call Automation | n8n (Railway) - Retell webhook > GHL contacts + pipeline |
| Booking (EMS) | ClubReady - available slot booking via JSON API |
| Booking (Body Contouring) | GHL Calendar |
| Payment | GHL SMS payment link ($29 Intro Session) |

---

## Services Offered

| Service | Price | Scheduling |
|---------|-------|------------|
| EMS Intro Session (3D scan + EMS workout + Infrared Pod) | $29 | Mon-Sat (no Sundays) via ClubReady |
| Body Sculpting Consultation (with licensed esthetician) | FREE | Mon, Tue, Thu, Fri only - GHL calendar |
| Memberships | from $249/month | After intro |

**EMS booking rule:** Use `GetClassSchedule` with `FromDate/ToDate` params, book into slots with `FreeSpots > 0`. Must use `ProspectTypeId: 63705` (EMS Intro Scheduled) to auto-add credits.

---

## GoHighLevel CRM

**Location ID:** `NnfeZFhrOArPQEjVgCfa`
**MCP Server:** `ghl-pulse`
**API Token:** `pit-ec5a586d-0b66-429f-8734-9d0e7de5ee9e`
**API Base URL:** `https://services.leadconnectorhq.com`
**Version header:** `2021-07-28`

**Pipeline:** Pulse Sales Pipeline (`OB4y46dgt7o0rcmLcnDo`) - 17 stages including:
- New Lead (`1797be32`)
- Attempted Contact / No Connection (`d55d1e5f`)
- Intro Session Booked (`5e11aeb2`)
- Body Contouring Consultation Booked (`6a619ec4`)
- Disqualified by Pulse (`fb37a303`)
- Converted to Member (`d7b78411`)
- Package Sold (`d21efe0e`)

**Custom Fields (mapped for n8n workflow):**
- fitness_goal (`svWS0IAWgfKABw02cOh2`) - lead goal
- fitness_challenges (`EvJSmn0iBTaddWMFYJY6`) - primary challenge
- training_interest (`QjTbSs0IhXdwfNpUjqOI`) - motivation trigger
- call_outcome (`znhqN8prnGcx8lmTJprW`) - booking status
- most_recent_conversation (`pjSKCtpBQSzuszadrQHg`) - retell call ID
- bhwb_service_type (`evHbevORWH7xdmoyZPv8`) - path taken (EMS/BC)
- booking_intent (`rDYIxLUrd6Mtl9abfnv7`) - booking intent
- call_summary (`AedYW3PnIADv7gyp8xQy`) - desired outcome

---

## Retell AI

**Outbound SDR Agent ID:** `agent_d7187b5cf0c77bf25fcac95a47`
**Agent Name (internal):** Gym
**AI Name (in call):** Anna
**LLM ID:** `llm_7a4325ade3c8ec2f3bc65208feac`
**Model:** gpt-5.1
**Voice:** retell-Cimo
**Language:** en-US
**Phone number:** `+16786614504` (Atlanta - 678 area code)

**Call behavior:**
- Outbound only - calling warm leads who responded to FB/IG ads
- Two paths based on which ad they responded to:
  - **Path 1 - EMS Intro Session** ($29): qualify > book intro > send payment link
  - **Path 2 - Body Contouring Consultation** (FREE): qualify > book esthetician consult
- Weight loss filter: if ONLY goal is 30+ lb weight loss > politely decline, suggest other program
- Tone: friendly, empathetic, conversational - NOT pushy, NOT salesy

---

## Booking System - ClubReady

**URL:** https://pulseperformance.clubready.com/
**Chain ID:** 1034
**Store ID:** 14318
**API Key:** `836f2547-b6ea-4f66-a423-23975aee988a`
**Login:** glenn@pulseperformancestudio.com / AISDR1!
**Zapier login:** glennbraunstein@pulseperformancestudio.com / FeelTheEnergy1!

### API Endpoints (tested 2026-04-03)

| Endpoint | Method | URL |
|----------|--------|-----|
| Create Prospect | POST (JSON) | `https://www.clubready.com/api/users/prospect` |
| Class Schedule | GET | `https://www.clubready.com/api/scheduling/class-schedule?FromDate=...&ToDate=...&ApiKey=...&StoreId=14318` |
| Book Class | POST (JSON) | `https://www.clubready.com/api/scheduling/class-booking` |
| User Info | GET | `https://www.clubready.com/api/current/users/{userId}?ApiKey=...&StoreId=14318` |
| Lead Types | GET | `https://www.clubready.com/api/club/lead-types?ApiKey=...&StoreId=14318` |
| Class Categories | GET | `https://www.clubready.com/api/scheduling/class-category?ApiKey=...&StoreId=14318` |

### Key ProspectType IDs
- **63705** - EMS Intro Scheduled (auto-adds booking credits)
- **61143** - Body Contouring Consultation Scheduled (auto-adds credits)
- **75838** - EMS Lead (no credits)
- **63710** - Body Contouring Lead (no credits)
- **60891** - Unscheduled Lead (default)

### Important Notes
- Use `FromDate/ToDate` for schedule queries (the `Date` param does NOT work)
- ScheduleIDs are unique per date - each day generates different IDs
- ProspectTypeId must be set at creation to auto-add credits for booking
- Full Developer API v2 APPROVED 2026-04-06. Credentials below.

### ClubReady v2 API (Developer API - approved 2026-04-06)
- **Portal:** `https://crprod-apim.developer.azure-api.net/`
- **Username:** `f165dc9d-81e1-4f9e-a6a4-2038dcbfe614`
- **Password:** `88842059-4cea-46e0-9469-3594fb0b45db`
- **Base64 (username:password):** `ZjE2NWRjOWQtODFlMS00ZjllLWE2YTQtMjAzOGRjYmZlNjE0Ojg4ODQyMDU5LTRjZWEtNDZlMC05NDY5LTM1OTRmYjBiNDVkYg==`
- **Auth flow:** POST to token endpoint with `Authorization: Basic {base64}`, body `grant_type=client_credentials`
- **Token expires:** every 14 days, needs auto-renewal workflow
- **Capabilities:** cancel booking, tags, notes, full member management
- **Contact:** Penelope Toogood (ptoogood@clubready.com), Adam Faris (afaris@clubready.com)
- **TODO:** Glenn needs to register on the portal, get Ocp-Apim-Subscription-Key, then we build token auto-renewal in n8n

**Post-booking:** send email to buckhead@ + glenn@ with name, date/time, payment status.

---

## n8n Workflow

**Workflow ID:** `7QH9i9DkU5RXdfrs`
**Name:** "Pulse - Retell Post-Call Processor"
**Status:** ACTIVE
**Webhook:** `https://primary-production-5fdce.up.railway.app/webhook/retell-pulse`
**Flow:** Webhook > Extract > GHL upsert (real account) > create opportunity (Pulse Sales Pipeline) > IF notify > ClubReady Add Prospect (JSON API) > email (disabled - needs SMTP)

---

## Notification Emails

All booking confirmations and lead notifications go to:
- buckhead@pulseperformancestudio.com
- glenn@pulseperformancestudio.com

---

## Reference Documents

| Document | Link |
|----------|------|
| Outbound SDR Requirements | [Google Doc](https://docs.google.com/document/d/1e0IzM1crX6jU1FqueI28Ve1u1xHvz6chmUYA1p7zee0/edit) |
| Outbound SDR Call Script | [Google Doc](https://docs.google.com/document/d/1XgMsasBT46HJJIy33HQJ9off3AGwbD_Gsuorvp1ZjoQ/edit) |
| ClubReady API Authorization Form | [JotForm](https://form.jotform.com/202044182473044) |
| ClubReady API Docs (Swagger) | [Swagger UI](https://www.clubready.com/api/swagger-ui/) |
| ClubReady Postman Collection | [Download](https://www.clubready.com/api/postman) |

---

## Changelog

| Date | Work |
|------|------|
| 2026-03-31 | Client onboarded - folder created, Retell agent + LLM documented, GHL gymtest MCP confirmed |
| 2026-04-03 | Migrated to real GHL account (`NnfeZFhrOArPQEjVgCfa`, `ghl-pulse` MCP). ClubReady JSON API key tested and confirmed working. n8n workflow updated with real GHL credentials, Pulse Sales Pipeline stages, and ClubReady JSON endpoint. Vault + CLIENT.md fully updated. |
| 2026-04-06 | **FULL SYSTEM AUDIT + CRITICAL FIX.** Found Tool Handler workflow (`SuSAEF1xoHcPb7bG`) still using OLD GHL credentials (location `YESvqOS2vsCLnJUXzsa1`, token `pit-318b...`) and OLD ClubReady admin API. Fixed via n8n MCP: updated 4 nodes to real Pulse GHL account + JSON ClubReady API. Enabled email node in Post-Call Processor with `montekristobelgrade@gmail.com`. Glenn confirmed: Stripe connected, $29 payment link active, GHL Payment Received webhook published. ClubReady v2 Developer API approved (credentials saved). Verified: all 5 n8n workflows active, all custom field IDs match, ClubReady schedule API returning 9 classes. |
| 2026-04-10 | **SYSTEM AUDIT #2 + 9 BUG FIXES.** Phase 1: (1) Post-Call Processor empty webhook validation. (2) Tool Handler deactivated. (3) 12 test contacts deleted. Phase 2 - deep cross-system audit found 9 bugs: **P0**: Body contouring booking was fake (no GHL appointment created) - fixed with real GHL Calendar appointment + SMS + stage update. Body contouring availability returned EMS slots - fixed with GHL free-slots API branch in Schedule Checker (Calendar ID `jUz9UzSGYEjtAFAPnkDf`). **P1**: Duplicate opportunities (Payment Link Sender + Post-Call both created) - Post-Call now skips when booking_link_sent=true. Phone fallback used Pulse's from_number instead of lead's to_number for outbound - fixed in both Post-Call and Payment Link Sender. **P2**: Booking Link IF used strict type comparison (boolean vs string) - changed to loose. No-answer calls created empty opportunities - Extract now returns [] for no_answer without phone. **P3**: Dead body field removed from SMS node. ClubReady booking ID now saved to GHL custom fields (clubready_booking_id, clubready_member_id, booking_date). Retell schedule tools now require date parameter (was optional). All 4 workflows verified active with correct connections. Phase 3 - ultra-deep re-audit found 3 more bugs: **P1**: BC slot times displayed in UTC instead of ET (9 AM shown as 1 PM) - fixed Format BC Slots to parse local time from ISO offset string. BC appointment created in UTC instead of ET (10 AM booking = 6 AM real) - fixed Prepare BC Appointment to build ISO with -04:00 ET offset. **P2**: Prompt + tool description said "Mon, Tue, Thu, Fri" but GHL Calendar has Mon-Fri (includes Wed) - updated prompt and Retell tool description to "Monday through Friday". Total: 12 bugs found and fixed across 3 audit phases. |
