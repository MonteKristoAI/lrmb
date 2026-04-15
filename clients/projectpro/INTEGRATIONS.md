# ProjectPro - Integration Reference

## GoHighLevel

| Property | Value |
|----------|-------|
| Sub-account | ProjectPro Construction Leads |
| Location ID | `a285qm0t8o1lXULFoIbn` |
| PIT Token | `pit-e0b51ff4-afe4-44d3-bc2f-4814916fbd9a` |
| MCP Server | `ghl-projectpro` |
| Timezone | America/Phoenix |

### SDR

| Property | Value |
|----------|-------|
| Name | Kreel Hutchinson |
| Phone | +1 (604) 721-4824 |
| Email | kreel@blueoceanaiagency.com |
| GHL Contact ID | `u1mVfMwGf22jDyXl27Pc` |

### Custom Fields (Contact)

| Field Name | Field Key | GHL Field ID | Type |
|-----------|----------|-------------|------|
| Lead Tier | contact.lead_tier | tP157D1TWDY8A5NG0uB4 | SINGLE_OPTIONS (GOLD, SILVER, BRONZE, DISQUALIFIED) |
| Region | contact.region | 6sEZ4ZVSitCMcZ0rQGm9 | SINGLE_OPTIONS (Northeast, Southeast, Midwest, Southwest, West Coast, Mountain Plains, Full US) |
| Team Size | contact.team_size | 2Bfo3vMCZGME07mH0dMf | NUMERICAL |
| Current Tools | contact.current_tools | nbFKOWtDtUSeoS7CdwUN | SINGLE_OPTIONS (Dodge / ConstructConnect, Bid boards, GC relationships, No system) |
| Interest Level | contact.interest_level | YwQO6j9mdhtvOFzm121G | SINGLE_OPTIONS (Hot, Warm, Cold) |
| Lead Source | contact.lead_source | bHIvGxAxKAJxZ1hsB5Ct | SINGLE_OPTIONS (Meta Ads, Cold Email, LinkedIn, Inbound) |
| Call Outcome | contact.call_outcome | UYC2K76vIxIxXrwOp2JB | SINGLE_OPTIONS (trial_requested, will_review_sample, callback_requested, not_interested, wrong_number, voicemail, no_answer) |
| Objection | contact.objection | Q2Q5YOkCDSMCpyyKe3NG | TEXT |
| Sales Team Answer | contact.sales_team_answer | Hl0Bhh3cwtj3DITdtL9y | TEXT |

### Pipeline: Meta Leads Pipeline

| # | Stage | Stage ID |
|---|-------|----------|
| 1 | New Lead | 5cee6be3-ccba-4806-ad17-7590681cacc3 |
| 2 | AI Called | 494933ef-c592-4853-9bee-42368fb6ba7f |
| 3 | Sample Sent | d193c61b-f4fb-4e00-98c7-116ea8da15c5 |
| 4 | Interested | 0f141fb7-b029-437f-aeca-e2aee5381a81 |
| 5 | Trial Activated | 08293582-b82d-4a63-a364-7a981f114959 |
| 6 | Paying Customer | 07fb7f9e-895e-48cb-ad9b-b4b8de9307af |
| 7 | Not Interested | 721a64f4-7aa7-411a-98b8-89ed23336c93 |
| 8 | Disqualified | 0d8a8149-dc53-449d-8e3a-e187ac56a19e |

Pipeline ID: `Z8qGmGJUKZbSy43vJr72`

### Tags
- meta-lead, cold-email-lead
- gold, silver, bronze, disqualified
- trial-activated, ai-called
- sdr, internal

### Test Contact
- ID: Wk6EnhRJz2YfKNoqabvQ
- Name: Test Lead / ABC Building Supply

---

## Email Sending - Domain Setup

### Recommended Architecture

**Sending subdomain**: `mail.projectproconstructionleads.com`
**From address**: `alex@mail.projectproconstructionleads.com`
**Reply-to**: `contact@projectproconstructionleads.com`

Why a subdomain:
- Protects main domain reputation (if deliverability drops, main domain is untouched)
- Industry standard for transactional/marketing email
- GHL/Mailgun manage reputation separately
- Main domain keeps clean reputation for regular business email

### DNS Records Required

Add these to the DNS for `projectproconstructionleads.com` (wherever DNS is managed - likely GoDaddy based on current SPF record):

**1. SPF Record** (TXT on mail subdomain):
```
Host: mail
Type: TXT
Value: v=spf1 include:mailgun.org ~all
```

**2. DKIM Records** (provided by GHL/Mailgun after setup - will look like):
```
Host: smtp._domainkey.mail
Type: TXT
Value: [provided by Mailgun]

Host: k1._domainkey.mail
Type: TXT  
Value: [provided by Mailgun]
```

**3. DMARC Record** (TXT):
```
Host: _dmarc.mail
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:contact@projectproconstructionleads.com
```

**4. CNAME for tracking** (provided by Mailgun):
```
Host: email.mail
Type: CNAME
Value: mailgun.org
```

### GHL Setup Steps

1. Go to ProjectPro sub-account in GHL
2. Settings → Email Services → Add Dedicated Domain
3. Enter: `mail.projectproconstructionleads.com`
4. GHL will generate the exact DNS records needed
5. Add those records to DNS
6. Verify in GHL
7. Set as default sending domain
8. Set From Name: "Alex at ProjectPro"
9. Set From Email: `alex@mail.projectproconstructionleads.com`
10. Set Reply-To: `contact@projectproconstructionleads.com`

### Current DNS (main domain)
- MX: outlook.com (Microsoft 365 / business email)
- SPF: `v=spf1 include:secureserver.net -all`
- DMARC: `v=DMARC1; p=none; pct=90; sp=none`

Main domain SPF will NOT be modified. Subdomain gets its own SPF.

---

## n8n Workflow

### Meta Lead → GHL + SDR Notify
- **ID**: `IZfcj6KRYdB1RFj5`
- **Status**: Active
- **Webhook**: `https://primary-production-5fdce.up.railway.app/webhook/projectpro-meta-lead`
- **Nodes**: 11

**Flow**:
```
Meta Lead Form webhook
  → Parse lead data (name, email, phone, company, region, tools, team)
  → Determine lead tier (GOLD/SILVER/BRONZE/DISQUALIFIED)
  → Create GHL contact with tags
  → Set all custom fields
  → Create pipeline opportunity (New Lead stage)
  → Send welcome email to lead (with sample list link)
  → If GOLD or SILVER: Send SMS to lead
  → SMS Kreel: instant lead alert with all details
  → Email Kreel: full lead brief with personalized opening script
```

**What Kreel receives on every new lead:**

SMS (instant):
```
NEW GOLD LEAD
John Smith
ABC Building Supply
Phone: +15551234567
Region: Southwest
Team: We have outside sales reps
Tools: Dodge / ConstructConnect

CALL WITHIN 15 MIN!
```

Email (instant, with clickable phone link):
- Full lead details table
- Color-coded tier badge
- Personalized opening script based on their Current Tools answer
- Key qualification question reminder
- Handling instructions by team size

---

## Budget

| Service | Monthly Cost |
|---------|-------------|
| GHL sub-account | Included in agency plan |
| GHL dedicated domain (Mailgun) | Included or ~$10/mo |
| Meta Ads | $70 CAD/day |
| Apollo.io (cold email list) | $49 USD/mo |
| Instantly.ai (cold email sending) | $30 USD/mo |
