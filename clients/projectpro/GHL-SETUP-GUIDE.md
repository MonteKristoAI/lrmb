# ProjectPro GHL Setup - Click by Click Guide

Sve sto treba RUCNO da se uradi u GoHighLevel.
n8n workflow vec radi (Meta Lead → GHL Contact + Opportunity + Email Kreel).
Ovo uputstvo podesava email follow-up sekvencu koja se salje LEADU automatski.

---

## KORAK 1: Popuni Email Template sadrzaje

Idi na: GHL → Marketing → Email Templates

Naci ces 4 prazna templatea koja sam kreirao. Edituj svaki:

### Template 1: "Email 1 - Welcome + Sample List"

Klikni na template → Edit → prebaci na HTML editor (</> ikonica)

Subject: `Your sample project list`

Body (copy-paste KOMPLETNO):
]
/
```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Body -->
<tr><td style="padding:36px 40px 20px;">
  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Hey {{contact.first_name}},</p>
  
  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Good news - your region is active. Here is a preview of last Monday's delivery:</p>

  <!-- Download button -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td align="center">
    <a href="https://drive.google.com/uc?id=16MYwz1RNegw8jcj0LB3_Ge0Tt1JdJtBJ&export=download" style="display:inline-block;background:#C85A1E;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:3px;font-weight:700;font-size:16px;box-shadow:0 2px 8px rgba(200,90,30,0.3);">Download Sample Project List (Excel)</a>
  </td></tr>
  </table>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">That is what your reps would open every Monday at 9am. 150-250 commercial construction projects. Planning stage. Key decision-maker on every row with direct phone and email.</p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 12px;">Want to see how it all works? <a href="https://start.projectproconstructionleads.com/" style="color:#C85A1E;font-weight:700;">See the full breakdown here.</a></p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">I am going to call you shortly to answer any questions. If you want to skip ahead and start your free trial, reply <strong>"ready"</strong> and I will set it up today.</p>
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px 36px;">
  <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e5e0;padding-top:20px;width:100%;">
  <tr><td>
    <p style="margin:0;font-weight:700;font-size:15px;color:#1a1a1a;">Kreel</p>
    <p style="margin:2px 0 0;font-size:13px;color:#888;">ProjectPro Construction Leads</p>
    <p style="margin:2px 0 0;font-size:13px;"><a href="tel:5203752111" style="color:#C85A1E;text-decoration:none;">(520) 375-2111</a></p>
  </td></tr>
  </table>
</td></tr>

</table>

<!-- Footer -->
<table width="600" cellpadding="0" cellspacing="0" style="margin-top:16px;">
<tr><td style="text-align:center;padding:8px 40px;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="120" style="display:block;margin:0 auto 8px;opacity:0.5;">
  <p style="font-size:12px;color:#999;margin:0;">ProjectPro Construction Leads | 10645 N Oracle Rd, Ste 121-319, Oro Valley, AZ 85737</p>
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>
```

Save.

---

### Template 2: "Email 2 - Region Sample (Day 2)"

Subject: `Projects your team would have had last Monday`

Body:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:#0C0A08;padding:28px 40px;text-align:center;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="200" style="display:block;margin:0 auto;">
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px 20px;">
  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Hey {{contact.first_name}},</p>
  
  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Here is a sample from last Monday's project list. 150-250 commercial projects, 90%+ still in planning or pre-construction.</p>

  <!-- Download button -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td align="center">
    <a href="https://drive.google.com/uc?id=16MYwz1RNegw8jcj0LB3_Ge0Tt1JdJtBJ&export=download" style="display:inline-block;background:#C85A1E;color:#ffffff;padding:16px 40px;text-decoration:none;border-radius:3px;font-weight:700;font-size:16px;box-shadow:0 2px 8px rgba(200,90,30,0.3);">Download Sample Project List (Excel)</a>
  </td></tr>
  </table>

  <!-- What's included -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border-radius:6px;padding:20px 24px;margin:0 0 24px;">
  <tr><td>
    <p style="font-size:14px;font-weight:700;color:#C85A1E;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">What each row includes</p>
    <p style="font-size:15px;color:#444;line-height:1.8;margin:0;">
      Project name, type, city, estimated value<br>
      Construction stage (90%+ planning/pre-construction)<br>
      The decision-maker: name, title, direct phone, direct email<br>
      Architects, developers, GCs, engineers, project owners<br>
      Company, website, and email verification status
    </p>
  </td></tr>
  </table>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Your reps open this at 9am Monday. By 9:15 they are on the phone with the person who decides what goes in the spec.</p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">If this is relevant for {{contact.company_name}}, reply <strong>"ready"</strong> and I will start your 30-day trial today. Or <a href="https://start.projectproconstructionleads.com/" style="color:#C85A1E;font-weight:700;">see how it works here</a>.</p>
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px 36px;">
  <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e5e0;padding-top:20px;width:100%;">
  <tr><td>
    <p style="margin:0;font-weight:700;font-size:15px;color:#1a1a1a;">Kreel</p>
    <p style="margin:2px 0 0;font-size:13px;color:#888;">ProjectPro Construction Leads</p>
    <p style="margin:2px 0 0;font-size:13px;"><a href="tel:5203752111" style="color:#C85A1E;text-decoration:none;">(520) 375-2111</a></p>
  </td></tr>
  </table>
</td></tr>

</table>
<table width="600" cellpadding="0" cellspacing="0" style="margin-top:16px;">
<tr><td style="text-align:center;padding:8px 40px;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="120" style="display:block;margin:0 auto 8px;opacity:0.5;">
  <p style="font-size:12px;color:#999;margin:0;">ProjectPro Construction Leads | 10645 N Oracle Rd, Ste 121-319, Oro Valley, AZ 85737</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
```

Save.

---

### Template 3: "Email 3 - Case Study (Day 5)"

Subject: `How one supplier turned a $199 spreadsheet into a pipeline`

Body:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:#0C0A08;padding:28px 40px;text-align:center;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="200" style="display:block;margin:0 auto;">
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px 20px;">
  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Hey {{contact.first_name}},</p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Seven years ago a commercial supplier started using ProjectPro because premium project databases were too expensive.</p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">He cold emailed architects with the project name in the subject line. <em>"Quick question about the Riverside Medical Center expansion."</em></p>

  <!-- Stat highlight -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
  <tr><td align="center">
    <table cellpadding="0" cellspacing="0" style="background:#0C0A08;border-radius:8px;padding:28px 40px;text-align:center;">
    <tr><td>
      <p style="font-size:48px;font-weight:900;color:#C85A1E;margin:0;line-height:1;">28%</p>
      <p style="font-size:15px;color:#F0EBE3;margin:8px 0 0;opacity:0.7;">cold email open rate</p>
      <p style="font-size:13px;color:#F0EBE3;margin:4px 0 0;opacity:0.4;">nearly triple the industry average</p>
    </td></tr>
    </table>
  </td></tr>
  </table>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Why it worked: he was emailing architects about their actual project, by name, while they were still choosing materials. That does not work at bid stage. It works when you get there first.</p>

  <!-- Quote block -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td style="border-left:4px solid #C85A1E;padding:16px 20px;background:#faf8f5;">
    <p style="font-size:17px;color:#333;line-height:1.6;margin:0;font-style:italic;">"We literally built our business from the ground up using this service."</p>
    <p style="font-size:13px;color:#888;margin:8px 0 0;">7-year ProjectPro subscriber</p>
  </td></tr>
  </table>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:20px 0;">That is the same Monday list your team would get. <a href="https://start.projectproconstructionleads.com/" style="color:#C85A1E;font-weight:700;">See how it works.</a></p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Worth a look? Reply to this email or call me at <a href="tel:5203752111" style="color:#C85A1E;font-weight:700;">(520) 375-2111</a>.</p>
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px 36px;">
  <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e5e0;padding-top:20px;width:100%;">
  <tr><td>
    <p style="margin:0;font-weight:700;font-size:15px;color:#1a1a1a;">Kreel</p>
    <p style="margin:2px 0 0;font-size:13px;color:#888;">ProjectPro Construction Leads</p>
    <p style="margin:2px 0 0;font-size:13px;"><a href="tel:5203752111" style="color:#C85A1E;text-decoration:none;">(520) 375-2111</a></p>
  </td></tr>
  </table>
</td></tr>

</table>
<table width="600" cellpadding="0" cellspacing="0" style="margin-top:16px;">
<tr><td style="text-align:center;padding:8px 40px;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="120" style="display:block;margin:0 auto 8px;opacity:0.5;">
  <p style="font-size:12px;color:#999;margin:0;">ProjectPro Construction Leads | 10645 N Oracle Rd, Ste 121-319, Oro Valley, AZ 85737</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
```

Save.

---

### Template 4: "Email 4 - Breakup (Day 10)"

Subject: `Should I close your file?`

Body:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:#0C0A08;padding:28px 40px;text-align:center;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="200" style="display:block;margin:0 auto;">
</td></tr>

<!-- Body -->
<tr><td style="padding:36px 40px 20px;">
  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px;">Hey {{contact.first_name}},</p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 24px;">I have reached out a few times and want to respect your time.</p>

  <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 12px;font-weight:700;">Two options:</p>

  <!-- Option cards -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
    <tr><td style="background:#C85A1E;border-radius:6px;padding:16px 20px;">
      <p style="font-size:16px;color:#ffffff;margin:0;font-weight:700;">Reply "Set me up"</p>
      <p style="font-size:14px;color:rgba(255,255,255,0.8);margin:4px 0 0;">I start your 30-day free trial today. <a href="https://start.projectproconstructionleads.com/" style="color:#fff;text-decoration:underline;">Or start here.</a></p>
    </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:#f4f2ee;border-radius:6px;padding:16px 20px;border:1px solid #e0ddd7;">
      <p style="font-size:16px;color:#1a1a1a;margin:0;font-weight:700;">Reply "Not now"</p>
      <p style="font-size:14px;color:#888;margin:4px 0 0;">I check back in 90 days, zero emails until then</p>
    </td></tr>
    </table>
  </td></tr>
  </table>

  <p style="font-size:15px;color:#888;line-height:1.6;margin:0 0 20px;">The trial is free for 30 days and you cancel anytime. Most teams know within two Mondays whether the list is useful.</p>
</td></tr>

<!-- Signature -->
<tr><td style="padding:0 40px 36px;">
  <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e5e0;padding-top:20px;width:100%;">
  <tr><td>
    <p style="margin:0;font-weight:700;font-size:15px;color:#1a1a1a;">Kreel</p>
    <p style="margin:2px 0 0;font-size:13px;color:#888;">ProjectPro Construction Leads</p>
    <p style="margin:2px 0 0;font-size:13px;"><a href="tel:5203752111" style="color:#C85A1E;text-decoration:none;">(520) 375-2111</a></p>
  </td></tr>
  </table>
</td></tr>

</table>
<table width="600" cellpadding="0" cellspacing="0" style="margin-top:16px;">
<tr><td style="text-align:center;padding:8px 40px;">
  <img src="https://start.projectproconstructionleads.com/brand_assets/ProjectPro-Logo-Horizontal-300x64.png" alt="ProjectPro" width="120" style="display:block;margin:0 auto 8px;opacity:0.5;">
  <p style="font-size:12px;color:#999;margin:0;">ProjectPro Construction Leads | 10645 N Oracle Rd, Ste 121-319, Oro Valley, AZ 85737</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
```

Save.

---

## KORAK 2: Kreiraj GHL Workflow za Email Sekvencu

Idi na: GHL → Automation → Workflows → + Create Workflow → Start from Scratch

### Workflow Name:
`Meta Lead - Email Follow-Up Sequence`

### Step 1: Trigger
1. Klikni "Add New Trigger"
2. Izaberi: **"Contact Tag"**
3. Filter: Tag is **"meta-lead"**
4. Klikni Save Trigger

### Step 2: Wait 1 minute (safety buffer)
1. Klikni + ispod triggera
2. Izaberi **"Wait"**
3. Postavi: Wait for **1 minute**
4. Ovo daje n8n-u vremena da zavrsi kreiranje kontakta

### Step 3: Send Email 1 (Welcome)
1. Klikni + ispod Wait
2. Izaberi **"Send Email"**
3. Subject: `Your sample project list`
4. Template: Izaberi **"Email 1 - Welcome + Sample List"**
5. From Name: `Kreel`
6. From Email: `contact@projectproconstructionleads.com`
7. Save

### Step 4: Wait 2 days
1. Klikni + ispod Email 1
2. Izaberi **"Wait"**
3. Postavi: Wait for **2 days**

### Step 5: Send Email 2 (Region Sample)
1. Klikni + ispod Wait
2. Izaberi **"Send Email"**
3. Subject: `Projects your team would have had last Monday`
4. Template: Izaberi **"Email 2 - Region Sample (Day 2)"**
5. From Name: `Kreel`
6. From Email: `contact@projectproconstructionleads.com`
7. Save

### Step 6: Wait 3 days
1. Klikni + ispod Email 2
2. Izaberi **"Wait"**
3. Postavi: Wait for **3 days**

### Step 7: Send Email 3 (Case Study)
1. Klikni + ispod Wait
2. Izaberi **"Send Email"**
3. Subject: `How one supplier turned a $199 spreadsheet into a pipeline`
4. Template: Izaberi **"Email 3 - Case Study (Day 5)"**
5. From Name: `Kreel`
6. From Email: `contact@projectproconstructionleads.com`
7. Save

### Step 8: Wait 5 days
1. Klikni + ispod Email 3
2. Izaberi **"Wait"**
3. Postavi: Wait for **5 days**

### Step 9: Send Email 4 (Breakup)
1. Klikni + ispod Wait
2. Izaberi **"Send Email"**
3. Subject: `Should I close your file?`
4. Template: Izaberi **"Email 4 - Breakup (Day 10)"**
5. From Name: `Kreel`
6. From Email: `contact@projectproconstructionleads.com`
7. Save

### Step 10: Toggle ON
1. Klikni toggle u gornjem desnom uglu da aktiviras workflow
2. Status treba da kaze "Published"

---

## KORAK 3: Proveri da email sending radi

1. Idi na: GHL → Settings → Email Services
2. Proveri da postoji podesena email adresa: `contact@projectproconstructionleads.com`
3. Ako NE postoji, treba da se podesi:
   - Opcija A: Mailgun integracija (preporuceno za production)
   - Opcija B: GHL built-in email (ogranicen volume)
   - Opcija C: Gmail/SMTP integracija

Bez podesenog email servisa, GHL nece moci da salje emailove!

---

## KORAK 4: Testiraj ceo flow

1. Idi na n8n: https://primary-production-5fdce.up.railway.app/
2. Otvori workflow "ProjectPro | Meta Lead → GHL + Email Kreel"
3. Klikni "Test Workflow"
4. Posalji test webhook sa ovim JSON body-jem:

```json
{
  "first_name": "Test",
  "last_name": "Lead",
  "email": "tvoj@email.com",
  "phone": "+15551234567",
  "company_name": "Test Building Supply",
  "sales_team_size": "We have outside sales reps covering territories",
  "pipeline_source": "Dodge / ConstructConnect"
}
```

5. Proveri:
   - [ ] Kontakt kreiran u GHL (Contacts → trazi "Test Lead")
   - [ ] Opportunity kreirana u pipeline-u (Opportunities → Meta Leads Pipeline)
   - [ ] Kreel dobio email sa lead briefom
   - [ ] GHL Workflow se trigerovao (Automation → Meta Lead - Email Follow-Up Sequence → History)
   - [ ] Test Lead dobio Email 1 sa download linkom

---

## KORAK 5: Podesi Meta Lead Form Webhook

Ovo je poslednji korak - konektuje Meta reklamu sa n8n.

1. U Meta Ads Manager, idi na kampanju → ad set → ad → Lead Form
2. U Form Settings, postavi Webhook URL:
   `https://primary-production-5fdce.up.railway.app/webhook/projectpro-meta-lead`
3. Ili koristi Zapier/Make kao posrednik izmedju Meta i n8n webhook-a

Alternativa: Koristi GHL-ov built-in Facebook integration:
1. GHL → Settings → Integrations → Facebook
2. Konektuj Facebook page
3. GHL automatski prima leadove iz Meta forme
4. n8n webhook onda nije potreban (GHL radi sve)

---

## REZIME: Sta radi automatski vs rucno

### AUTOMATSKI (vec radi):
- Meta lead → n8n webhook → GHL kontakt kreiran
- GHL opportunity kreirana u "New Lead" stage
- Kreel dobije email sa lead briefom + opening scriptom
- Email 1 (Welcome + Excel download) salje se leadu odmah
- Email 2 salje se posle 2 dana
- Email 3 salje se posle 5 dana
- Email 4 salje se posle 10 dana
- Kreel dobije dnevni digest svakog jutra u 8:30am PT

### RUCNO (Kreel radi):
- Pozovi lead u roku od 15 min (biznis sati)
- Azuriraj pipeline stage u GHL posle svakog poziva
- LinkedIn connection request (Dan 2-3)
- Follow-up pozivi (Dan 3, Dan 12)

---

## GHL VARIJABLE za email templateove

Koristi ove merge tagove u email body-ju:
- `{{contact.first_name}}` - ime leada
- `{{contact.last_name}}` - prezime
- `{{contact.email}}` - email
- `{{contact.phone}}` - telefon
- `{{contact.company_name}}` - kompanija
- `{{contact.sales_team_size}}` - odgovor na Q5 (custom field)
- `{{contact.pipeline_source}}` - odgovor na Q6 (custom field)
