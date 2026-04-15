# LuxeShutters — Integrations & IDs Reference

All IDs, endpoints, and technical references in one place.

---

## n8n Workflows

**Instance:** https://primary-production-5fdce.up.railway.app/
**Tag name:** LuxeShutters | **Tag ID:** `7XMi910KVzI48LbW`

| Workflow | ID | Status | Description |
|----------|----|--------|-------------|
| Quote Form → GHL Contact | `6TFf4X3Dgl3RwrqK` | Active | Quote form submissions create GHL contacts |
| Consultation Form → GHL Contact | `8djrbCCuBwd44rRf` | Active | Consultation form submissions create GHL contacts |
| Web Widget → GHL Contact | `ZH811klNEuQDsmi4` | Active | Retell web chat leads → GHL |
| Retell AI Lead Processing (Phone) | `nmRZRFm622Hs1bmp` | Active | Phone call analyzed events → GHL |
| Negative Feedback → GHL | `h7uRgpq9sCaKsD8h` | Active | Website negative reviews → GHL task |
| Xero Auth Setup | `KV8I0VV0YUIdBkt3` | Active | One-time OAuth — Chris visits `/webhook/xero-auth-start` |
| Token Manager | `XlspRkCypuKPD7Dc` | Active | Stores/retrieves/rotates Xero tokens |
| **Quote Generator** | **`LNDrPW4eYCDAR3V0`** | **Active** | GHL stage → Quote Requested: Xero draft quote + moves to Quote Sent |
| **Quote Follow-up** | **`wV799PQkJt8F8u3p`** | **Active** | Day 3 email + Day 6 SMS + Day 11 manual call task |
| **Sale Won** | **`imv8sLTo85o9nOj2`** | **Active** | GHL stage → Won: Xero invoice + Cora order + GHL install task |

### Webhook URLs
| Webhook | URL |
|---------|-----|
| Web widget (Retell chat) | `https://primary-production-5fdce.up.railway.app/webhook/retell-widget` |
| Negative feedback | `https://primary-production-5fdce.up.railway.app/webhook/luxe-feedback` |
| **Xero auth start** | `https://primary-production-5fdce.up.railway.app/webhook/xero-auth-start` |
| **Quote Generator trigger** | `https://primary-production-5fdce.up.railway.app/webhook/luxe-quote-generate` |
| **Quote Follow-up trigger** | `https://primary-production-5fdce.up.railway.app/webhook/luxe-quote-followup` |
| **Sale Won trigger** | `https://primary-production-5fdce.up.railway.app/webhook/luxe-sale-won` |

---

## GoHighLevel

| Key | Value |
|-----|-------|
| Location ID | `ZXqCNDMy4vQxmO5Lwj37` |
| API Token | `pit-64318814-9706-4a69-a5b4-a46a65f6f0be` |
| API Base URL | `https://services.leadconnectorhq.com/` |
| Version header | `2021-07-28` |
| Pipeline ID | `lrK9OQ4qrpvxjUaDqGZU` |

### Contact Custom Field IDs
| Field Name | ID | Set by |
|------------|----|--------|
| Lead Source | `augA5eQDHNYvuppnwPHo` | All 5 intake workflows |
| Enquiry Type | `ySca2J5VFr6ER7Tj6952` | All 5 intake workflows |
| Notes | `uRAhsBsd8E162Of1YzyR` | All 5 intake workflows |
| Service Type | `hiKPnhjZKNfNoLNQ7ri5` | Quote Form, Web Widget, Phone |
| Timeframe | `WHEPDGERqxYLYHvxcCCb` | Quote Form, Web Widget, Phone |
| Property Type | `yBQGqqu5zDigjISaVznE` | Web Widget, Phone |
| Window Count | `8Mxgb5SrzWkJRAVcXmOO` | Web Widget, Phone |

### Opportunity Custom Field IDs (Quote System)
| Field Key | ID | Notes |
|-----------|----|-------|
| `opportunity.product_type` | `QV1hBb5aM4lKx96v77V4` | Picklist: Shutters, Roller Blinds, Curtains, Zipscreens, Awnings, Security Roller Shutters |
| `opportunity.measurements` | `9s6CvgG38w3650ZbDiv4` | One per line: `1200x2100` |
| `opportunity.mount_config` | `KZRhaSumx2sS5m8RNSAe` | Inside / Outside |
| `opportunity.colour_preference` | `bkeqDSJtawmixl44QQRJ` | e.g. "03 White" |
| `opportunity.additional_notes` | `lsNmf8zxA8nwnSNvXFaS` | Free text |
| `opportunity.cost_price` | `DA6yya0yfDhGzDmcJjox` | Chris enters ex-GST after Cora lookup |
| `opportunity.markup_percent` | `zKnoLseYpcQ7557BLAGZ` | Default: 40 |
| `opportunity.consumer_price` | `DjMqBPIydJT5cTvX8zhJ` | Auto-set by Quote Generator |
| `opportunity.xero_quote_id` | `cOXDzp1HTn6RZjDDOHjN` | Auto-set by Quote Generator |
| `opportunity.xero_quote_url` | `kt6qjaCE1V1xTF4Y7oBt` | Auto-set by Quote Generator |
| `opportunity.xero_invoice_id` | `rtZdDec0moO5DdWHAIIC` | Auto-set by Sale Won |
| `opportunity.xero_invoice_url` | `QswRU2X46NwQ3azouu4X` | Auto-set by Sale Won |
| `opportunity.cora_order_id` | `mHJBuGGcERg6Z2GBxYII` | Auto-set by Sale Won (Shutters only) |

---

## Xero (Accounting / Quotes / Invoices)

| Key | Value |
|-----|-------|
| App Client ID | `3BA6FFAAD6C741C49F2845AE40C2171E` |
| App Client Secret | `ZIf_KRy2Mm7nmUlHuLv8Jc4KhvYGtWRSOK1LrkE_ibLTAKbK` |
| OAuth Scopes | `accounting.invoices accounting.contacts offline_access` |
| Token Manager Workflow | `XlspRkCypuKPD7Dc` |
| Auth URL (Chris visits once) | `https://primary-production-5fdce.up.railway.app/webhook/xero-auth-start` |
| Quotes API | `POST https://api.xero.com/api.xro/2.0/Quotes` |
| Invoices API | `POST https://api.xero.com/api.xro/2.0/Invoices` |

> **Note:** Xero app created after March 2026 — must use `accounting.invoices` not `accounting.transactions`

---

## Cora CW Trade HUB (Supplier Ordering)

| Key | Value |
|-----|-------|
| API Base URL | `https://cwglobal.online/api` |
| API Key | `7qW97IDLxPGZKuIwqmhvwVcvxJ18EbWNpf2TmuNqq0uL9aT4xU15DctRVr24fhSv` |
| Auth User Email | `chris@luxeshutters.com.au` |
| Order Import Endpoint | `POST /api/import/orders` |
| Response | `{data: [{order_id, status: "Imported Order"}], success: "Orders created successfully"}` |

> **Note:** Cora API has NO pricing endpoint. Order import is for post-sale production orders only.

### Cora Product Mapping
| GHL Product Type | Cora Range | Range ID | Type ID | Material ID |
|-----------------|------------|----------|---------|-------------|
| Shutters | Oasis Shutters | 49 | 231 (Hinged) | 59 (Oasis) |
| Roller Blinds | Roller Blinds \| Atlas | 71 | 352 (Single Blind) | 61 (Internal Blinds) |
| Curtains | Curtain & Track | 73 | 379 (Curtain & Track \| 2.0 Full) | 71 (Velare - Manual Tracks) |
| Awnings | Ombra Awnings | 38 | 312 (Zip Guide) | 45 (Ombra) |
| Zipscreens | Not in Cora API | — | — | — |
| Security Roller Shutters | Not in Cora API | — | — | — |

### Default Cora Shutter Config (Range 49)
Blade: Aero 63mm · Frame: Oasis Frames · Tiltrod: Clearview · Hinge: Non-Mortise · Stile: Beaded/Rabbet/51mm · Mid-rail: None · Colour: Standard Paint Colours

---

## Retell AI

| Agent | ID | Event |
|-------|----|-------|
| Phone agent | `agent_85fc774ff7ac5874444b070ed5` | `call_analyzed` |
| Web widget | `agent_869a95e48b30ebc1c7317dd682` | `chat_analyzed` |

---

## Website / GitHub

| Key | Value |
|-----|-------|
| Live URL | https://luxeshutters.lovable.app |
| GitHub repo | MonteKristoAI/luxeshutters |
| Hosting | Lovable (auto-deploy on push) |
| Local path | `/Users/milanmandic/Desktop/MonteKristo AI/LuxeShutters_website/` |
| Google review link | `https://g.page/r/CW9V9yfTp18mEAE/review` |

---

## Web Widget Payload Schema

```json
{
  "event": "chat_analyzed",
  "chat": {
    "chat_analysis": {
      "custom_analysis_data": {
        "firstName": "",
        "lastName": "",
        "email": "",
        "phone": "",
        "productType": "",
        "enquiryType": "",
        "timeframe": "",
        "issueDescription": "",
        "notes": "",
        "suburb": "",
        "postcode": "",
        "windowCount": "",
        "propertyType": ""
      },
      "chat_summary": "",
      "chat_successful": true
    }
  }
}
```
