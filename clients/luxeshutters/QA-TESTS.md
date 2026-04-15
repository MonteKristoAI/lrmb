# LuxeShutters - Kompletni QA Testovi

Rucni testovi za sve sisteme. Svaki test ima: sta radis, sta ocekujes, i kako znas da je prosao/pao.

---

## A. WEBSITE TESTOVI (luxeshutters.com.au)

### A1. Homepage Load
- [ ] Otvori https://luxeshutters.com.au/
- [ ] Stranica se ucitava za < 3 sekunde
- [ ] Header: "Luxe Shutters" logo, nav (Home, Services, Gallery, Blog, About, Contact), telefon 1800 465 893, "Get a Free Quote" dugme
- [ ] Hero sekcija se prikazuje sa slikom (WebP, ne prazno)
- [ ] Scroll do Reviews sekcije: 16 Google reviewova sa slikama
- [ ] Footer: kontakt info, linkovi, adresa Temora

### A2. Sve Stranice
- [ ] /services - ucitava se, prikazuje 6 servisa sa slikama
- [ ] /gallery - ucitava se, prikazuje galeriju slika
- [ ] /blog - ucitava se (trenutno React SPA placeholder, ne static blog)
- [ ] /contact - ucitava se, forma za kontakt vidljiva
- [ ] /temora - ucitava se, Temora service area

### A3. WebP Slike
- [ ] Otvori DevTools (F12) → Network tab → filtriraj "Img"
- [ ] Ucitaj bilo koju stranicu
- [ ] SVE slike treba da budu .webp format (ne .jpg, ne .png)
- [ ] Nijedna slika ne sme da bude broken (404)

### A4. Mobile Responsive
- [ ] Otvori sajt na telefonu (ili DevTools mobile view)
- [ ] Header: hamburger meni radi, nav se otvara/zatvara
- [ ] Slike se pravilno skaliraju
- [ ] Tekst citljiv bez zumiranja
- [ ] CTA dugmad dovoljno velika za touch

### A5. SEO Elementi
- [ ] View Page Source na homepage-u
- [ ] Proveri: `<title>` sadrzi "Luxe Shutters"
- [ ] Proveri: `<meta name="description">` postoji i ima smisla
- [ ] Proveri: `<link rel="canonical">` = https://luxeshutters.com.au/
- [ ] Proveri: `<meta property="og:image">` = og-image.webp
- [ ] Proveri: `hreflang="en-AU"` postoji
- [ ] Proveri: geo meta tagovi (geo.region = AU-NSW, geo.placename = Temora)

### A6. Retell Web Widget (Max)
- [ ] Sacekaj 4 sekunde na homepage-u
- [ ] Popup poruka se pojavljuje: "Hi, I'm Max from Luxe Shutters..."
- [ ] Klikni na widget ikonicu
- [ ] Chat se otvara
- [ ] Napisi "I need shutters for my living room"
- [ ] Max odgovara relevantno (pita za detalje, lokaciju, itd.)
- [ ] Napisi ime, email, telefon kad pita
- [ ] Zatvori chat

### A7. SSL i Security Headers
- [ ] Otvori https://luxeshutters.com.au/ (HTTPS, zeleni lokot)
- [ ] DevTools → Network → klikni na prvi request → Headers tab
- [ ] Proveri: `X-Content-Type-Options: nosniff`
- [ ] Proveri: `X-Frame-Options: DENY`
- [ ] Proveri: `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Otvori http://www.luxeshutters.com.au → treba redirect na https://luxeshutters.com.au

### A8. Favicon
- [ ] Otvori sajt
- [ ] Tab ikonica (favicon) se prikazuje (WebP format)

---

## B. GHL CRM TESTOVI

### B1. Login i Pipeline Pregled
- [ ] Loguj se u GHL (https://app.gohighlevel.com)
- [ ] Izaberi LuxeShutters lokaciju
- [ ] Idi na Opportunities → Pipelines
- [ ] "Luxe Shutters Pipeline" postoji
- [ ] 11 stage-ova vidljivo: New Enquiry, Consultation Scheduled, Measurements Taken, Quote Requested, Quote Sent, Won, Invoice Sent, In Production, Installation Scheduled, Completed, Lost

### B2. Custom Fields - Contact
- [ ] Idi na Settings → Custom Fields → Contact
- [ ] Proveris da postoje: Lead Source, Enquiry Type, Notes, Service Type, Timeframe, Property Type, Window Count
- [ ] Ukupno 7 custom polja

### B3. Custom Fields - Opportunity
- [ ] Idi na Settings → Custom Fields → Opportunity
- [ ] Proveris da postoje: Product Type (dropdown sa 26 opcija), Measurements, Mount Config (Inside/Outside), Colour Preference, Additional Notes, Cost Price, Xero Quote ID, Xero Quote URL, Markup Percent, Consumer Price, Xero Invoice ID, Xero Invoice URL, Cora Order ID
- [ ] Ukupno 13 custom polja
- [ ] Product Type dropdown ima 26 opcija (Shutters, Roller Blinds, Roller Blinds Linked 2, itd.)

### B4. GHL Automations (Webhook Triggers)
- [ ] Idi na Automations
- [ ] Proveri da postoje 3 automatizacije:
  - "Luxe Quote Generate" - trigger: Stage Changed to Quote Requested
  - "Luxe Quote Follow-up" - trigger: Stage Changed to Quote Sent
  - "Luxe Sale Won" - trigger: Stage Changed to Won
- [ ] Svaka ima Webhook action sa URL-om ka n8n Railway instanci

---

## C. N8N WORKFLOW TESTOVI

### C1. Svi Workflowovi Aktivni
- [ ] Otvori n8n: https://primary-production-5fdce.up.railway.app/
- [ ] Filtriraj po tagu "LuxeShutters"
- [ ] 5 workflowova se prikazuje (sa tagom)
- [ ] Pretrazis "Luxe" - nalazis jos 5 (Quote Generator, Follow-up, Sale Won, Xero Auth, Token Manager)
- [ ] Svih 10 imaju zeleni "Active" indicator

### C2. Quote Form Workflow Test
- [ ] Idi na https://luxeshutters.com.au/contact (ili gde je quote forma)
- [ ] Popuni formu: ime "QA Test", email "qa-test@test.com", telefon "+61400000000", service "Shutters"
- [ ] Submit
- [ ] Sacekaj 30 sekundi
- [ ] Proveri u GHL → Contacts: da li postoji "QA Test" kontakt?
- [ ] Proveri custom fields: Lead Source = "Quote Form", Service Type = "Shutters"

### C3. Quote Generator E2E Test (NAJVAZNIJI TEST)
- [ ] U GHL, kreiraj test opportunity na "QA Test" kontaktu u Luxe Shutters Pipeline
- [ ] Popuni opportunity fields:
  - Product Type: "Shutters"
  - Measurements: "1200x2100" (jedna linija)
  - Mount Config: "Inside"
  - Colour Preference: "Oasis"
  - Markup Percent: 40
- [ ] Pomeri opportunity na "Quote Requested" stage
- [ ] Sacekaj 30-60 sekundi
- [ ] Proveri:
  - [ ] Cost Price polje je popunjeno (trebalo bi ~$202 * 1.2m * 2.1m = ~$509)
  - [ ] Consumer Price polje je popunjeno (Cost * 1.4 markup)
  - [ ] Xero Quote ID polje je popunjeno
  - [ ] Xero Quote URL polje ima link
  - [ ] Opportunity se automatski pomerila na "Quote Sent" stage
- [ ] Otvori Xero Quote URL - proveri da je draft quote kreiran sa ispravnim iznosom

### C4. Quote Follow-up Test
- [ ] Posle C3, opportunity je na "Quote Sent"
- [ ] Proveri n8n execution log za "Luxe - Quote Follow-up" workflow
- [ ] Trebalo bi da se trigeruje i zakaze:
  - Day 3: email
  - Day 6: SMS (ako telefon postoji)
  - Day 11: manual task u GHL
- [ ] Proveri GHL Tasks za test kontakt - da li postoji zakazan task za Dan 11?

### C5. Sale Won Test
- [ ] Pomeri test opportunity na "Won" stage
- [ ] Sacekaj 30-60 sekundi
- [ ] Proveri:
  - [ ] Xero Invoice ID popunjeno
  - [ ] Xero Invoice URL ima link
  - [ ] Cora Order ID popunjeno (ako je product = Shutters)
  - [ ] GHL Task kreiran za instalaciju
  - [ ] Opportunity stage se pomerila na "Invoice Sent"

### C6. Negative Feedback Test
- [ ] Na sajtu, klikni na review sekciju
- [ ] Ostavi 1-3 zvezde rating
- [ ] Popuni feedback formu
- [ ] Submit
- [ ] Proveri GHL → Tasks: da li postoji novi task sa feedback sadrzajem?

### C7. Web Widget Lead Processing Test
- [ ] Na sajtu, otvori Max chat widget
- [ ] Razgovaraj sa Max-om, daj mu ime "Widget Test", email "widget@test.com", telefon "+61400111222"
- [ ] Zavrsi razgovor
- [ ] Sacekaj 60 sekundi (chat_analyzed event)
- [ ] Proveri GHL → Contacts: da li postoji "Widget Test" kontakt?
- [ ] Proveri custom fields: Lead Source = "Web Chat Widget"

---

## D. RETELL AI TESTOVI

### D1. Web Widget Agent
- [ ] Otvori https://luxeshutters.com.au/
- [ ] Widget se pojavljuje posle 4 sekunde
- [ ] Klikni na widget
- [ ] Agent se zove "Max"
- [ ] Pozdrav poruka sadrzi: shutters, blinds, curtains
- [ ] Pisi: "How much do shutters cost?"
- [ ] Agent odgovara sa cenom ili pita za detalje
- [ ] Pisi: "My name is Test, my email is test@test.com, phone 0400000000"
- [ ] Agent hvata podatke

### D2. Phone Agent (ako je broj povezan)
- [ ] Pozovi broj koji je povezan sa Retell-om
- [ ] AI agent se javlja (glas: Cimo, australijski engleski)
- [ ] Kazi: "I'm interested in plantation shutters for my home in Wagga Wagga"
- [ ] Agent pita za detalje (broj prozora, timeframe, kontakt)
- [ ] Daj test podatke
- [ ] Zavrsi poziv
- [ ] Proveri GHL za novi kontakt sa "Phone Call" lead source

---

## E. XERO INTEGRATION TESTOVI

### E1. OAuth Konekcija
- [ ] Test C3 (Quote Generator) je vec potvrdio da Xero radi
- [ ] Ako C3 radi (quote se kreira u Xero), OAuth je aktivan
- [ ] Ako C3 ne radi (greska u n8n logu oko tokena), OAuth je istekao
- [ ] Fix: Chris ponovo poseti https://primary-production-5fdce.up.railway.app/webhook/xero-auth-start

### E2. Xero Quote Sadrzaj
- [ ] Otvori Xero quote kreiran u testu C3
- [ ] Proveri:
  - [ ] Quote je "DRAFT" status
  - [ ] Kontakt ime se poklapa
  - [ ] Line items: svaki prozor je poseban item
  - [ ] Format: "Oasis Shutter - 1200x2100mm (Inside Mount) - 2.52m²"
  - [ ] Cena po itemu je tacna

### E3. Xero Invoice (posle Sale Won)
- [ ] Otvori Xero invoice kreiran u testu C5
- [ ] Proveri da je invoice kreiran od quote-a
- [ ] Status: AUTHORISED ili DRAFT

---

## F. BLOG SISTEM TESTOVI

### F1. Blog Repo Build
- [ ] Otvori terminal
- [ ] `cd ~/Desktop/MonteKristo\ AI/luxeshutters-blog`
- [ ] `node build.js`
- [ ] Output kaze: "Build complete: 1 post(s)"
- [ ] `dist/` folder sadrzi: index.html, welcome/index.html, sitemap.xml, rss.xml, css/blog.css
- [ ] Otvori `dist/index.html` u browseru - blog index stranica sa post kartom

### F2. Blog Post Rendering
- [ ] Otvori `dist/welcome/index.html` u browseru
- [ ] Header sa "Luxe Shutters" logo i nav linkovima
- [ ] Breadcrumbs: Home / Blog / Welcome to the Luxe Shutters Blog
- [ ] Post sadrzaj sa Key Takeaways box (plavi border levo)
- [ ] CTA box (plavi gradient, telefon, "Book Free Consultation" dugme)
- [ ] Footer sa kontakt info
- [ ] Responsive: smanjuj browser - layout se adaptira

### F3. Sitemap
- [ ] Otvori `dist/sitemap.xml`
- [ ] Sadrzi URL: https://luxeshutters.com.au/blog/
- [ ] Sadrzi URL: https://luxeshutters.com.au/blog/welcome/
- [ ] lastmod datum postoji

### F4. RSS Feed
- [ ] Otvori `dist/rss.xml`
- [ ] Validan XML sa channel info (Luxe Shutters Blog)
- [ ] Item za welcome post postoji sa title, link, description

### F5. Schema Markup
- [ ] Otvori `dist/welcome/index.html` source
- [ ] Pretrazis "application/ld+json"
- [ ] BlogPosting schema postoji sa: headline, datePublished, author (Person), publisher (LocalBusiness)
- [ ] BreadcrumbList schema postoji sa 3 itema

### F6. OG Tags
- [ ] U source-u welcome/index.html
- [ ] `og:type` = "article"
- [ ] `og:url` sadrzi luxeshutters.com.au/blog/welcome/
- [ ] `og:title` sadrzi "Welcome"
- [ ] `twitter:card` = "summary_large_image"

### F7. Blog na Produkciji (POSLE CF Worker Deploy-a)
- [ ] Otvori https://luxeshutters.com.au/blog/
- [ ] Prikazuje se NAS blog (ne React SPA blog page)
- [ ] Otvori https://luxeshutters.com.au/blog/welcome/
- [ ] Post se ucitava (ne 404)
- [ ] Otvori https://luxeshutters.com.au/blog/sitemap.xml
- [ ] XML sitemap se prikazuje (ne 404)

---

## G. BLOG STRATEGY FAJLOVI

### G1. Kompletnost Fajlova
- [ ] `Blog/clients/luxeshutters/CLIENT.md` postoji i ima platform sekciju
- [ ] `Blog/clients/luxeshutters/STYLE.md` postoji i ima 4 template tipa
- [ ] `Blog/clients/luxeshutters/CONTENT.md` postoji i ima Phase 1 (8 postova, svi Tier A)
- [ ] `Blog/clients/luxeshutters/SITEMAP.md` postoji
- [ ] `Blog/clients/luxeshutters/BRAND.md` postoji sa bojama
- [ ] `Blog/clients/luxeshutters/FEEDBACK.md` postoji sa 13+ pravila
- [ ] `Blog/clients/luxeshutters/KEYWORD-DATABASE.md` postoji sa 221+ keywords
- [ ] `Blog/clients/luxeshutters/BLOG-STRATEGY-V3.md` postoji (28KB+)

### G2. Persona
- [ ] `~/.claude/skills/blog/references/personas/luxeshutters.json` postoji
- [ ] Sadrzi: tone_dimensions, voice_patterns, do/dont liste, cta_hierarchy

### G3. Blog Agent Integracija
- [ ] `Blog/CLAUDE.md` → Active Clients tabela sadrzi LuxeShutters red
- [ ] CTA sekcija za LuxeShutters postoji (consultation, quote, phone)

---

## H. SKILL TESTOVI

### H1. blog-onboard Skill
- [ ] `~/.claude/skills/blog-onboard/SKILL.md` postoji
- [ ] `~/.claude/skills/blog-onboard/PATTERNS.md` postoji sa 10 paterna (P-001 do P-010)
- [ ] `~/.claude/skills/blog-onboard/references/` sadrzi 4 fajla:
  - research-playbook.md
  - critic-prompts.md
  - technical-playbook.md
  - client-files-template.md

---

## I. KOMPLETNI RUCNI E2E TEST (Ceo Ciklus)

Ovaj test simulira kompletnog novog klijenta od prvog kontakta do zavrsene instalacije.

### Priprema
- Koristi test podatke: "Sarah Johnson", email sarah.test@test.com, telefon +61400999888
- Zapisuj vreme svakog koraka

### Korak 1: Lead dolazi preko Quote forme (t=0)
1. Otvori https://luxeshutters.com.au/contact
2. Popuni: Sarah Johnson, sarah.test@test.com, +61400999888, "Plantation shutters for 4 bedroom windows"
3. Submit formu
4. Zapisi vreme: ____

### Korak 2: Verifikuj lead u GHL (t+30s)
5. Otvori GHL → Contacts
6. Pretrazis "Sarah Johnson"
7. [ ] PASS: Kontakt postoji
8. [ ] PASS: Lead Source = "Quote Form"
9. [ ] PASS: Service Type = "Shutters" ili slicno
10. [ ] PASS: Notes sadrze opis iz forme
11. Zapisi vreme: ____

### Korak 3: Kreiraj Opportunity (simulira Chris-ov rad)
12. Na kontaktu Sarah Johnson, kreiraj novu Opportunity u "Luxe Shutters Pipeline"
13. Stage: "New Enquiry"
14. Ime: "Sarah Johnson - 4 Bedroom Shutters"

### Korak 4: Pomeri kroz Pipeline (simulira proces)
15. Pomeri na "Consultation Scheduled"
16. Pomeri na "Measurements Taken"
17. Popuni opportunity polja:
    - Product Type: **Shutters**
    - Measurements:
      ```
      1200x1500
      900x1200
      1400x1800
      1000x1400
      ```
    - Mount Config: **Inside**
    - Colour Preference: **Bayview Basswood**
    - Markup Percent: **40**

### Korak 5: Pokreni Quote Generator (t+2min)
18. Pomeri opportunity na **"Quote Requested"**
19. Zapisi vreme: ____
20. Sacekaj 60 sekundi

### Korak 6: Verifikuj Auto-Quote (t+3min)
21. Refreshuj opportunity stranicu u GHL
22. [ ] PASS: Cost Price je popunjeno (Bayview Basswood = $276/m2, 4 prozora razlicitih velicina)
23. [ ] PASS: Consumer Price = Cost Price * 1.4
24. [ ] PASS: Xero Quote ID je popunjeno
25. [ ] PASS: Xero Quote URL ima link
26. [ ] PASS: Stage se promenila na "Quote Sent"
27. Otvori Xero Quote URL:
28. [ ] PASS: Xero quote je DRAFT sa 4 line itema
29. [ ] PASS: Svaki item ima format "[Product] - WxHmm (Mount) - X.XXm2"
30. [ ] PASS: Cene su tacne po CWGlobal cenama
31. Zapisi vreme: ____

### Korak 7: Verifikuj Follow-up Sequence
32. Proveri n8n execution log za "Luxe - Quote Follow-up"
33. [ ] PASS: Workflow se trigerovao
34. [ ] PASS: Day 3 email zakazan (proveri Wait node u execution)
35. [ ] PASS: Day 6 SMS zakazan (ako telefon postoji)
36. [ ] PASS: Day 11 task ce biti kreiran

### Korak 8: Zatvori Deal (t+5min)
37. Pomeri opportunity na **"Won"**
38. Zapisi vreme: ____
39. Sacekaj 60 sekundi

### Korak 9: Verifikuj Sale Won Automatizaciju (t+6min)
40. Refreshuj opportunity stranicu
41. [ ] PASS: Xero Invoice ID popunjeno
42. [ ] PASS: Xero Invoice URL ima link
43. [ ] PASS: Cora Order ID popunjeno
44. [ ] PASS: GHL Task kreiran za instalaciju
45. Otvori Xero Invoice URL:
46. [ ] PASS: Invoice kreiran od quote-a
47. [ ] PASS: Iznosi se poklapaju
48. Zapisi vreme: ____

### Korak 10: Cleanup
49. U Xero: obrisi test quote i test invoice (DRAFT status, safe to delete)
50. U GHL: obrisi test kontakt "Sarah Johnson" i opportunity
51. [ ] Cleanup zavrsen

### Rezultat E2E Testa

| Korak | Ocekivano Vreme | Tvoje Vreme | Status |
|-------|----------------|-------------|--------|
| Lead → GHL kontakt | < 30s | ____ | PASS / FAIL |
| Quote Requested → Quote Generated | < 60s | ____ | PASS / FAIL |
| Quote → Xero Draft | < 60s | ____ | PASS / FAIL |
| Follow-up triggered | < 30s | ____ | PASS / FAIL |
| Won → Invoice + Cora Order | < 60s | ____ | PASS / FAIL |
| **Ukupno** | **< 5 min** | **____** | **____** |

---

## Rezime: Ukupan Broj Testova

| Kategorija | Testova | Kriticnih |
|-----------|---------|-----------|
| A. Website | 8 testova (35 check-ova) | A1, A3, A6, A7 |
| B. GHL CRM | 4 testa (20 check-ova) | B1, B3, B4 |
| C. n8n Workflows | 7 testova (30 check-ova) | C2, C3, C5 |
| D. Retell AI | 2 testa (12 check-ova) | D1 |
| E. Xero | 3 testa (10 check-ova) | E1, E2 |
| F. Blog | 7 testova (20 check-ova) | F1, F2, F7 |
| G. Strategy Files | 3 testa (12 check-ova) | G1 |
| H. Skills | 1 test (4 check-a) | H1 |
| I. Full E2E | 1 test (20 check-ova) | CEO test |
| **TOTAL** | **36 testova (163 check-ova)** | **14 kriticnih** |
