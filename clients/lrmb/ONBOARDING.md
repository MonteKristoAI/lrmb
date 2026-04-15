# LRMB — Production Onboarding Questionnaire

**Cilj:** Prikupiti sve što nam treba za prelaz iz pilot verzije u production-ready aplikaciju.  
**Voditi sa:** Emma (ops lead) + admin korisnik  
**Format:** Discovery call (1–1.5h) ili async popunjavanje

---

## 01 — PROPERTIES & UNITS

> Trebamo tačan inventar nekretnina koje ulaze u sistem.

- Koliko ukupno property-ja upravljate? (LRMB total, ne samo pilot)
- Koliko property-ja ide u fazu 1 production deployementa?
- Da li imate existirajuću listu (Excel, TravelNet export) property-ja sa adresama?
- Da li su property-ji organizovani po regionima ili zonama? (npr. South Beach, Mid-Beach)
- Koliko unit-a ima prosječna nekretnina? (da li ima multi-unit property-ja?)
- Kako se property-ji zovu u vašem sistemu — da li koristimo iste nazive kao u TravelNetu?
- Da li postoji property ID ili kod koji koristite interno?

---

## 02 — STAFF ROSTER

> Trebamo punu listu svih korisnika koji ulaze u sistem sa rolama.

Za svakog zaposlenog:

| Ime | Email | Telefon | Rola | Property-ji koje pokriva |
|-----|-------|---------|------|--------------------------|
| | | | field_staff / admin / supervisor / manager | |

- Ko kreira taskove danas? (admin? supervisor? oba?)
- Ko može da dodijeli task drugom staff-u?
- Ko može da zatvori/verifikuje task?
- Da li isti field staff pokriva sve property-je ili su dodijeljeni specifičnim lokacijama?
- Da li imate vendore/externe izvođače koji trebaju pristup? (ako da — koji rola im odgovara?)
- Koliko admina treba pristup admin dashboard-u?

---

## 03 — TASK TYPES & CATEGORIES

> Trebamo da mapiramo sve tipove taskova koji se pojavljuju u vašem poslovanju.

### Maintenance
- Navedite 10 najčešćih tipova maintenance taskova (npr. "AC issue", "Broken appliance", "Plumbing")
- Da li postoje vendor-specific taskovi? (npr. "HVAC contractor", "Pool service")
- Ko dodjeljuje vendore — admin ili supervisor?
- Šta je prosječno vrijeme zatvaranja maintenance taska danas?

### Housekeeping
- Koji su tipovi housekeeping taskova? (checkout clean, mid-stay clean, deep clean, turnover...)
- Ko kreira housekeeping taskove danas? (manuelno ili TravelNet ih generiše?)
- Da li postoji checklist za svaki tip čišćenja? (možete podijeliti?)
- Koliko cleanera je na roster-u?
- Da li je svaki cleaner dodijeljen specifičnim property-jima ili rade po dostupnosti?

### Inspection
- Koje tipove inspekcija radite? (move-in, move-out, periodic, damage, guest-ready...)
- Ko vrši inspekcije? (supervisor? dedicated inspector? field staff?)
- Da li postoji standardni checklist? (možete podijeliti?)
- Da li inspekcija automatski kreira maintenance task ako se flaguje problem?

### General
- Da li postoje taskovi koji ne spadaju u maintenance/housekeeping/inspection? Koji?

---

## 04 — TASK STATUS & COMPLETION RULES

> Moramo tačno definisati kada je task "završen" i ko može što da uradi.

**Status flow koji smo izgradili:** `new → assigned → in_progress → waiting_parts → blocked → completed → verified`

- Da li ovaj flow odgovara vašim operacijama? Šta bi mijenjali?
- Šta znači "blocked" u vašem kontekstu? (nedostaje materijal? treba odobrenje? vendor ne dolazi?)
- Ko može da promijeni status u "blocked" — samo field staff ili i admin?
- "waiting_parts" — koristite li ovo? Ko naručuje dijelove?
- Ko može da označi task kao "completed"? (field staff, admin, ili oba?)
- Ko verifikuje completed task? (supervisor uvijek? ili samo za određene tipove?)
- Da li je foto obavezan za zatvaranje taska? Za koji tip — svi ili samo određeni?
- Da li je nota obavezna za zatvaranje? Za koji tip?
- Koliko dugo task ostaje otvoren prije nego postaje "overdue"? (24h? 48h? zavisi od prioriteta?)

**Prioriteti:**

| Prioritet | Definicija kod vas | Koliko brzo treba zatvoriti |
|-----------|-------------------|----------------------------|
| Urgent | | |
| High | | |
| Medium | | |
| Low | | |

---

## 05 — ESCALATION RULES

> Trebamo automatizovati eskalacije.

- Šta se desi ako task nije prihvaćen u X sati? Ko dobija notifikaciju?
- Šta se desi ako task postane overdue? Ko dobija notifikaciju?
- Šta se desi ako task ostane blocked više od X sati?
- Da li postoji eskalacija do menadžera (frank level) u određenim situacijama? Koje?
- Da li imate SLA-ove (service level agreements) s gostima za određene tipove popravki?

---

## 06 — TRAVELNET INTEGRATION

> Cilj: auto-kreiranje housekeeping taskova na checkout, sync property/unit podataka.

- Koja verzija TravelNet koristite?
- Da li TravelNet ima webhook funkcionalnost? (Da li šalje notifikacije kada se rezervacija promijeni?)
- Ako ne webhooks — da li ima API za pulling reservation podataka?
- Da li postoji API dokumentacija/pristup koji možete dijeliti?
- Koji trigger treba da kreira housekeeping task: checkout događaj? X sati prije checkout-a?
- Da li housekeeping task treba da se kreira i kada gost produlji boravak (mid-stay clean)?
- Koji podaci iz rezervacije su nam potrebni za task? (gost ime? checkout time? special instructions?)
- Da li TravelNet ima property i unit IDs koje možemo matchovati s našom bazom?
- Da li se property/unit lista mjenja često ili je relativno stabilna?

---

## 07 — AKIA INTEGRATION

> Cilj: guest issue → automatski maintenance task.

- Koji tipovi guest poruka u Akii trebaju automatski kreirati task? (npr. "AC ne radi", "Nema topla voda")
- Ili bi ovo trebalo biti manuelno — admin vidi poruku i kreira task?
- Ima li Akia webhook ili API?
- Da li gost treba dobiti automatski odgovor kada se task kreira? ("Your request has been received...")

---

## 08 — NOTIFICATIONS

> Trebamo definisati ko dobija šta i kojim kanalom.

**Trenutno implementirano:** In-app notifications only.

**Pitanja:**
- Da li field staff ima smartphone koji koristi za posao?
- Koji kanali su prihvatljivi: in-app (push notification), SMS, email, WhatsApp?
- Da li koristite neki team komunikacijski alat (Slack, Teams, WhatsApp group)?

**Per event — ko dobija notifikaciju?**

| Event | Field Staff (assigned) | Admin | Supervisor | Manager |
|-------|----------------------|-------|------------|---------|
| Task assigned | ✓ | ? | ? | ? |
| Task overdue | | ✓ | ? | ? |
| Task blocked | | ✓ | ✓ | ? |
| Task completed | | ✓ | ? | ? |
| Task needs verification | | | ✓ | ? |
| New urgent task created | ? | ✓ | ✓ | ? |

- Da li postoji "quiet hours" (npr. nema notifikacija između 22h i 7h)?
- Koliko notifikacija je previše? Da li postoji opasnost od notification fatigue?

---

## 09 — INSPECTION TEMPLATES

> Trebamo popuniti inspekcijske cheklist-e sa vašim sadržajem.

Za svaki tip inspekcije (move-in, move-out, periodic...):

- Koje sekcije postoje u vašem checklist-u? (npr. Kitchen, Bathrooms, Living Room, Exterior...)
- Za svaku sekciju — koje stavke se provjeravaju?
- Koje stavke zahtijevaju foto?
- Koje stavke mogu flagovati problem koji automatski kreira maintenance task?
- Da li postoji damage report forma koja se razlikuje od standardne inspekcije?
- Postoji li scoring sistem (1-5) ili je checkmark dovoljan?

**Molimo vas podijelite:** Svaki existirajući inspekcijski dokument/PDF/checklist koji koristite.

---

## 10 — BRANDING & UX

> Kako app treba da izgleda za vaše zaposlene.

- Koji je naziv aplikacije koji field staff treba da vidi? ("LRMB Field Ops"? "AiiA"? Nešto drugo?)
- Da li imate LRMB logo koji trebamo koristiti u aplikaciji?
- Da li postoje brand colors?
- Na kom jeziku koriste aplikaciju field staff? (English only? Može biti i Spanish za cleanere?)
- Da li field staff treba tutorial/onboarding walkthrough unutar aplikacije?
- Na kojim uređajima koriste field staff? (iOS, Android, ili oba?)
- Da li se aplikacija koristi uvijek online ili i offline (dead zones u property-jima)?

---

## 11 — MANAGER DASHBOARD & REPORTING

> Šta menadžer treba da vidi svaki dan.

- Koje metrike su najvažnije za vas svaki dan? (open tasks, overdue, completion rate...)
- Da li vam treba daily/weekly email report?
- Da li trebate export funkcionalnost? (CSV, PDF?)
- Da li imate potrebu za billing tracking po tasku? (vendor troškovi, materijal...)
- Da li trebate history/audit trail koji možete gledati za prošle taskove?
- Da li vam trebaju weekly/monthly KPI izvještaji?

---

## 12 — PRODUCTION DEPLOYMENT

> Tehničke odluke za production setup.

- Da li koristiti Lovable hosting (lovable.app subdomain) ili vlastiti custom domain?
  - Ako custom domain — koji domain? (npr. ops.lrmb.com, fieldops.lrmb.com)
- Da li imate IT team ili osoba koja može upravljati DNS/domain setup-om?
- Ko kreira/uklanja korisničke naloge u produkciji? (vi sami ili mi?)
- Da li trebate SSO (Single Sign-On) sa Google ili Microsoft?
- Da li postoje security/compliance zahtjevi? (HIPAA? SOC2? Nije vjerojatno ali pitamo)
- Da li trebate data backup — kopije svih taskova/foto?
- Koja je politika za brisanje starih/zatvorenih taskova? (koliko dugo čuvamo historiju?)
- Ko je primary technical contact za production issues?

---

## 13 — BASELINE MEASUREMENT (za KPI tracking)

> Ovo nam treba PRIJE deployementa da bismo mogli dokazati poboljšanje.

Da bi izmjerili KPI impact, trebamo baseline od 2–4 sedmice.

- Da li imate bill od radnih sati po zadatku za prošli mjesec?
- Koliko prosječno traje maintenance task od otvaranja do zatvaranja? (vaša procjena)
- Koliko admin sati tjedno ide na task koordinaciju? (follow-up pozivi, status provjere)
- Koliko % taskova se zatvara s fotografijom danas?
- Koliko % taskova se ponovo otvara (reopen rate)?
- Koliko puta dnevno admin pita field staff "jesi završio"?

---

## 14 — OPEN QUESTIONS (Pilot Review)

> Stvari koje smo identifikovali kao nejasne iz pilot dokumentacije.

- [ ] Ko je krajnji vlasnik task closure-a? (field staff ili admin mora potvrditi?)
- [ ] Što tačno definiše "completed" za svaki tip taska?
- [ ] Koji trigger pokreće eskalaciju? (timestamp? prioritet? kombinacija?)
- [ ] Da li je Emma jedini admin ili ima više admina?
- [ ] Koji je region za pilot — samo Miami Beach ili šire?
- [ ] Da li postoji vendor/contractor lista koja treba biti u sistemu?
- [ ] Šta se desi sa taskom kada gost odjavi pritužbu direktno kod menadžera mimo sistema?

---

## Deliverable: Šta nam trebate poslati/dostaviti

Da bismo mogli početi production build, trebamo od vas:

| Deliverable | Format | Prioritet |
|-------------|--------|-----------|
| Lista svih property-ja + adresi | Excel / CSV | KRITIČNO |
| Roster svih zaposlenih sa emailima i telefonima | Excel | KRITIČNO |
| Inspekcijski checklist(i) koje koristite | PDF / Word / Excel | KRITIČNO |
| Housekeeping checklist | PDF / Word | KRITIČNO |
| LRMB logo (za branding u appu) | PNG / SVG | Visok |
| TravelNet API dokumentacija ili IT kontakt | Link / PDF | Visok |
| Baseline KPI podaci (radni sati, completion times) | Bilo koji format | Srednji |
| Primjer popunjenog damage report-a | Anonymiziran OK | Srednji |

---

*Dokument kreiran: 2026-04-01 | MonteKristo AI × LRMB*
