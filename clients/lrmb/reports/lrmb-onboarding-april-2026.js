const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── LOGO ────────────────────────────────────────────────────────────────────

const svgLogoPath = path.join(__dirname, '..', '..', '..', 'Logo', 'favicon-bold.svg');
const svgRaw = fs.readFileSync(svgLogoPath, 'utf8')
  .replace(/strokeWidth=/g, 'stroke-width=')
  .replace(/strokeLinecap=/g, 'stroke-linecap=')
  .replace(/strokeLinejoin=/g, 'stroke-linejoin=');
const svgBase64 = Buffer.from(svgRaw).toString('base64');
const logoSrc = `data:image/svg+xml;base64,${svgBase64}`;

// ─── CONTENT ─────────────────────────────────────────────────────────────────

const sections = [
  {
    id: '01',
    title: 'Properties & Units',
    note: 'Trebamo tačan inventar nekretnina koje ulaze u sistem.',
    questions: [
      'Koliko ukupno property-ja upravljate? (LRMB total, ne samo pilot)',
      'Koliko property-ja ide u fazu 1 production deployementa?',
      'Da li imate existirajuću listu (Excel, TravelNet export) property-ja sa adresama?',
      'Da li su property-ji organizovani po regionima ili zonama? (npr. South Beach, Mid-Beach)',
      'Koliko unit-a ima prosječna nekretnina? Da li ima multi-unit property-ja?',
      'Kako se property-ji zovu u vašem sistemu — koristimo iste nazive kao u TravelNetu?',
      'Da li postoji property ID ili kod koji koristite interno?',
    ],
  },
  {
    id: '02',
    title: 'Staff Roster',
    note: 'Trebamo punu listu svih korisnika koji ulaze u sistem sa rolama.',
    questions: [
      'Ko kreira taskove danas? (admin? supervisor? oba?)',
      'Ko može da dodijeli task drugom staff-u?',
      'Ko može da zatvori/verifikuje task?',
      'Da li isti field staff pokriva sve property-je ili su dodijeljeni specifičnim lokacijama?',
      'Da li imate vendore/externe izvođače koji trebaju pristup? Koji rola im odgovara?',
      'Koliko admina treba pristup admin dashboard-u?',
    ],
    table: {
      caption: 'Molimo popunite za svakog zaposlenog:',
      headers: ['Ime', 'Email', 'Telefon', 'Rola', 'Property-ji'],
      rows: 8,
      rowData: null,
    },
  },
  {
    id: '03',
    title: 'Task Types & Categories',
    note: 'Trebamo da mapiramo sve tipove taskova koji se pojavljuju u vašem poslovanju.',
    subsections: [
      {
        title: 'Maintenance',
        questions: [
          'Navedite 10 najčešćih tipova maintenance taskova (npr. "AC issue", "Broken appliance", "Plumbing")',
          'Da li postoje vendor-specific taskovi? (npr. "HVAC contractor", "Pool service")',
          'Ko dodjeljuje vendore — admin ili supervisor?',
          'Šta je prosječno vrijeme zatvaranja maintenance taska danas?',
        ],
      },
      {
        title: 'Housekeeping',
        questions: [
          'Koji su tipovi housekeeping taskova? (checkout clean, mid-stay clean, deep clean, turnover...)',
          'Ko kreira housekeeping taskove danas? (manuelno ili TravelNet ih generiše?)',
          'Da li postoji checklist za svaki tip čišćenja? (možete podijeliti?)',
          'Koliko cleanera je na roster-u?',
          'Da li je svaki cleaner dodijeljen specifičnim property-jima ili rade po dostupnosti?',
        ],
      },
      {
        title: 'Inspection',
        questions: [
          'Koje tipove inspekcija radite? (move-in, move-out, periodic, damage, guest-ready...)',
          'Ko vrši inspekcije? (supervisor? dedicated inspector? field staff?)',
          'Da li postoji standardni checklist? (možete podijeliti?)',
          'Da li inspekcija automatski kreira maintenance task ako se flaguje problem?',
        ],
      },
      {
        title: 'General',
        questions: [
          'Da li postoje taskovi koji ne spadaju u maintenance/housekeeping/inspection? Koji?',
        ],
      },
    ],
  },
  {
    id: '04',
    title: 'Task Status & Completion Rules',
    note: 'Moramo tačno definisati kada je task završen i ko može što da uradi.',
    intro: 'Status flow koji smo izgradili: new → assigned → in_progress → waiting_parts → blocked → completed → verified',
    questions: [
      'Da li ovaj flow odgovara vašim operacijama? Šta bi mijenjali?',
      'Šta znači "blocked" u vašem kontekstu? (nedostaje materijal? treba odobrenje? vendor ne dolazi?)',
      'Ko može da promijeni status u "blocked" — samo field staff ili i admin?',
      '"waiting_parts" — koristite li ovo? Ko naručuje dijelove?',
      'Ko može da označi task kao "completed"? (field staff, admin, ili oba?)',
      'Ko verifikuje completed task? (supervisor uvijek? ili samo za određene tipove?)',
      'Da li je foto obavezan za zatvaranje taska? Za koji tip — svi ili samo određeni?',
      'Da li je nota obavezna za zatvaranje? Za koji tip?',
      'Koliko dugo task ostaje otvoren prije nego postaje "overdue"? (24h? 48h? zavisi od prioriteta?)',
    ],
    table: {
      caption: 'Definicija prioriteta:',
      headers: ['Prioritet', 'Definicija kod vas', 'Rok zatvaranja'],
      rowData: [
        ['Urgent', '', ''],
        ['High', '', ''],
        ['Medium', '', ''],
        ['Low', '', ''],
      ],
    },
  },
  {
    id: '05',
    title: 'Escalation Rules',
    note: 'Trebamo automatizovati eskalacije.',
    questions: [
      'Šta se desi ako task nije prihvaćen u X sati? Ko dobija notifikaciju?',
      'Šta se desi ako task postane overdue? Ko dobija notifikaciju?',
      'Šta se desi ako task ostane blocked više od X sati?',
      'Da li postoji eskalacija do menadžera (manager level) u određenim situacijama? Koje?',
      'Da li imate SLA-ove (service level agreements) s gostima za određene tipove popravki?',
    ],
  },
  {
    id: '06',
    title: 'TravelNet Integration',
    note: 'Cilj: auto-kreiranje housekeeping taskova na checkout, sync property/unit podataka.',
    questions: [
      'Koja verzija TravelNet koristite?',
      'Da li TravelNet ima webhook funkcionalnost? (Da li šalje notifikacije kada se rezervacija promijeni?)',
      'Ako ne webhooks — da li ima API za pulling reservation podataka?',
      'Da li postoji API dokumentacija/pristup koji možete dijeliti?',
      'Koji trigger treba da kreira housekeeping task: checkout događaj? X sati prije checkout-a?',
      'Da li housekeeping task treba da se kreira i kada gost produlji boravak (mid-stay clean)?',
      'Koji podaci iz rezervacije su nam potrebni za task? (gost ime? checkout time? special instructions?)',
      'Da li TravelNet ima property i unit IDs koje možemo matchovati s našom bazom?',
      'Da li se property/unit lista mjenja često ili je relativno stabilna?',
    ],
  },
  {
    id: '07',
    title: 'Akia Integration',
    note: 'Cilj: guest issue poruka → automatski maintenance task.',
    questions: [
      'Koji tipovi guest poruka u Akii trebaju automatski kreirati task? (npr. "AC ne radi", "Nema tople vode")',
      'Ili bi ovo trebalo biti manuelno — admin vidi poruku i kreira task?',
      'Ima li Akia webhook ili API?',
      'Da li gost treba dobiti automatski odgovor kada se task kreira? ("Your request has been received...")',
    ],
  },
  {
    id: '08',
    title: 'Notifications',
    note: 'Trenutno implementirano: in-app notifications only. Trebamo definisati ko dobija šta.',
    questions: [
      'Da li field staff ima smartphone koji koristi za posao?',
      'Koji kanali su prihvatljivi: in-app (push notification), SMS, email, WhatsApp?',
      'Da li koristite neki team komunikacijski alat (Slack, Teams, WhatsApp group)?',
      'Da li postoji "quiet hours"? (npr. nema notifikacija između 22h i 7h)',
      'Koliko notifikacija je previše? Postoji li opasnost od notification fatigue?',
    ],
    table: {
      caption: 'Ko dobija notifikaciju per event:',
      headers: ['Event', 'Field Staff', 'Admin', 'Supervisor', 'Manager'],
      rowData: [
        ['Task assigned', '✓', '?', '?', '?'],
        ['Task overdue', '—', '✓', '?', '?'],
        ['Task blocked', '—', '✓', '✓', '?'],
        ['Task completed', '—', '✓', '?', '?'],
        ['Needs verification', '—', '—', '✓', '?'],
        ['New urgent task', '?', '✓', '✓', '?'],
      ],
    },
  },
  {
    id: '09',
    title: 'Inspection Templates',
    note: 'Trebamo popuniti inspekcijske checklist-e sa vašim sadržajem.',
    questions: [
      'Koje sekcije postoje u vašem checklist-u? (npr. Kitchen, Bathrooms, Living Room, Exterior...)',
      'Za svaku sekciju — koje stavke se provjeravaju?',
      'Koje stavke zahtijevaju foto kao dokaz?',
      'Koje stavke mogu flagovati problem koji automatski kreira maintenance task?',
      'Da li postoji damage report forma koja se razlikuje od standardne inspekcije?',
      'Postoji li scoring sistem (1–5) ili je checkmark dovoljan?',
    ],
    callout: 'Molimo podijelite svaki existirajući inspekcijski dokument, PDF ili checklist koji koristite.',
  },
  {
    id: '10',
    title: 'Branding & UX',
    note: 'Kako app treba da izgleda za vaše zaposlene.',
    questions: [
      'Koji je naziv aplikacije koji field staff treba da vidi? ("LRMB Field Ops"? "AiiA"? Nešto drugo?)',
      'Da li imate LRMB logo koji trebamo koristiti u aplikaciji?',
      'Da li postoje brand colors?',
      'Na kom jeziku koriste aplikaciju field staff? (English only? Može biti i Spanish za cleanere?)',
      'Da li field staff treba tutorial/onboarding walkthrough unutar aplikacije?',
      'Na kojim uređajima koriste field staff? (iOS, Android, ili oba?)',
      'Da li se aplikacija koristi uvijek online ili i offline (dead zones u property-jima)?',
    ],
  },
  {
    id: '11',
    title: 'Manager Dashboard & Reporting',
    note: 'Šta menadžer treba da vidi svaki dan.',
    questions: [
      'Koje metrike su najvažnije za vas svaki dan? (open tasks, overdue, completion rate...)',
      'Da li vam treba daily/weekly email report?',
      'Da li trebate export funkcionalnost? (CSV, PDF?)',
      'Da li imate potrebu za billing tracking po tasku? (vendor troškovi, materijal...)',
      'Da li trebate history/audit trail koji možete gledati za prošle taskove?',
      'Da li vam trebaju weekly/monthly KPI izvještaji?',
    ],
  },
  {
    id: '12',
    title: 'Production Deployment',
    note: 'Tehničke odluke za production setup.',
    questions: [
      'Da li koristiti Lovable hosting (lovable.app subdomain) ili vlastiti custom domain? (npr. ops.lrmb.com)',
      'Da li imate IT team ili osoba koja može upravljati DNS/domain setup-om?',
      'Ko kreira/uklanja korisničke naloge u produkciji? (vi sami ili mi?)',
      'Da li trebate SSO (Single Sign-On) sa Google ili Microsoft?',
      'Da li postoje security/compliance zahtjevi?',
      'Da li trebate data backup — kopije svih taskova/foto?',
      'Koja je politika za brisanje starih/zatvorenih taskova? (koliko dugo čuvamo historiju?)',
      'Ko je primary technical contact za production issues?',
    ],
  },
  {
    id: '13',
    title: 'Baseline Measurement',
    note: 'Ovo nam treba PRIJE deployementa da bismo mogli dokazati poboljšanje.',
    intro: 'Da bi izmjerili KPI impact, trebamo baseline podatke od 2–4 sedmice. Bez baseline-a ne možemo dokazati ROI.',
    questions: [
      'Da li imate bill od radnih sati po zadatku za prošli mjesec?',
      'Koliko prosječno traje maintenance task od otvaranja do zatvaranja? (vaša procjena)',
      'Koliko admin sati tjedno ide na task koordinaciju? (follow-up pozivi, status provjere)',
      'Koliko % taskova se zatvara s fotografijom danas?',
      'Koliko % taskova se ponovo otvara (reopen rate)?',
      'Koliko puta dnevno admin pita field staff "jesi završio"?',
    ],
  },
  {
    id: '14',
    title: 'Open Questions & Deliverables',
    note: 'Stvari identificovane kao nejasne iz pilot dokumentacije, plus šta nam trebate dostaviti.',
    checklist: [
      'Ko je krajnji vlasnik task closure-a? (field staff ili admin mora potvrditi?)',
      'Što tačno definiše "completed" za svaki tip taska?',
      'Koji trigger pokreće eskalaciju? (timestamp? prioritet? kombinacija?)',
      'Da li je Emma jedini admin ili ima više admina?',
      'Koji je region za pilot — samo Miami Beach ili šire?',
      'Da li postoji vendor/contractor lista koja treba biti u sistemu?',
      'Šta se desi sa taskom kada gost odjavi pritužbu direktno kod menadžera mimo sistema?',
    ],
    deliverables: [
      { item: 'Lista svih property-ja + adresi', format: 'Excel / CSV', priority: 'KRITIČNO' },
      { item: 'Roster svih zaposlenih (email + telefon)', format: 'Excel', priority: 'KRITIČNO' },
      { item: 'Inspekcijski checklist(i)', format: 'PDF / Word / Excel', priority: 'KRITIČNO' },
      { item: 'Housekeeping checklist', format: 'PDF / Word', priority: 'KRITIČNO' },
      { item: 'LRMB logo (za branding u appu)', format: 'PNG / SVG', priority: 'Visok' },
      { item: 'TravelNet API dokumentacija ili IT kontakt', format: 'Link / PDF', priority: 'Visok' },
      { item: 'Baseline KPI podaci (radni sati, completion times)', format: 'Bilo koji format', priority: 'Srednji' },
      { item: 'Primjer popunjenog damage report-a (anonymiziran OK)', format: 'PDF / foto', priority: 'Srednji' },
    ],
  },
];

// ─── HTML BUILDER ─────────────────────────────────────────────────────────────

function buildSection(sec) {
  let html = `<div class="section-block">`;
  html += `<h2 class="sh"><span class="sec-num">${sec.id}</span>${sec.title}</h2>`;

  if (sec.note) {
    html += `<p class="sec-note">${sec.note}</p>`;
  }
  if (sec.intro) {
    html += `<div class="flow-box no-break"><span class="flow-label">Status flow</span>${sec.intro}</div>`;
  }

  if (sec.questions) {
    html += `<ul class="q-list">`;
    sec.questions.forEach(q => {
      html += `<li class="q-item">${q}</li>`;
    });
    html += `</ul>`;
  }

  if (sec.subsections) {
    sec.subsections.forEach(sub => {
      html += `<h3 class="subh">${sub.title}</h3><ul class="q-list">`;
      sub.questions.forEach(q => { html += `<li class="q-item">${q}</li>`; });
      html += `</ul>`;
    });
  }

  if (sec.table) {
    if (sec.table.caption) html += `<p class="table-caption">${sec.table.caption}</p>`;
    html += `<table class="data-table no-break"><thead><tr>`;
    sec.table.headers.forEach(h => { html += `<th>${h}</th>`; });
    html += `</tr></thead><tbody>`;
    if (sec.table.rowData) {
      sec.table.rowData.forEach(row => {
        html += `<tr>`;
        row.forEach((cell, i) => {
          const cls = i === 0 ? ' class="td-key"' : '';
          html += `<td${cls}>${cell}</td>`;
        });
        html += `</tr>`;
      });
    } else {
      // empty input rows
      for (let i = 0; i < sec.table.rows; i++) {
        html += `<tr>`;
        sec.table.headers.forEach(() => { html += `<td class="td-empty">&nbsp;</td>`; });
        html += `</tr>`;
      }
    }
    html += `</tbody></table>`;
  }

  if (sec.callout) {
    html += `<div class="callout no-break"><span class="callout-icon">↗</span>${sec.callout}</div>`;
  }

  if (sec.checklist) {
    html += `<h3 class="subh">Open Questions</h3><ul class="check-list">`;
    sec.checklist.forEach(item => { html += `<li class="check-item"><span class="check-box">□</span>${item}</li>`; });
    html += `</ul>`;
  }

  if (sec.deliverables) {
    html += `<h3 class="subh" style="margin-top:14pt;">Šta nam trebate dostaviti</h3>`;
    html += `<table class="data-table no-break"><thead><tr><th>Deliverable</th><th>Format</th><th>Prioritet</th></tr></thead><tbody>`;
    sec.deliverables.forEach(d => {
      const pCls = d.priority === 'KRITIČNO' ? ' class="td-critical"' : '';
      html += `<tr><td>${d.item}</td><td class="td-muted">${d.format}</td><td${pCls}>${d.priority}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  html += `</div>`;
  return html;
}

function buildHTML() {
  const sectionsHTML = sections.map(buildSection).join('\n');

  return `<!DOCTYPE html>
<html lang="bs">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
<style>
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page {
    size: A4;
    margin: 14mm 18mm 16mm 18mm;
    background: #FAF8F4;
  }

  html, body {
    margin: 0; padding: 0;
    font-family: 'Inter', sans-serif;
    font-size: 10.5pt;
    color: #1D1F28;
    line-height: 1.6;
    background: #FAF8F4;
  }

  .no-break  { break-inside: avoid; page-break-inside: avoid; }
  h2.sh      { break-after: avoid;  page-break-after: avoid; }
  h3.subh    { break-after: avoid;  page-break-after: avoid; }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2pt solid #041122;
    padding-bottom: 14pt;
    margin-bottom: 6pt;
  }
  .report-title {
    font-family: 'Poppins', sans-serif;
    font-size: 20pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
    margin: 0 0 5pt 0;
  }
  .report-meta    { font-size: 10.5pt; color: #777; margin: 0 0 2pt 0; }
  .report-prepared { font-size: 9.5pt; font-style: italic; color: #aaa; margin: 0; }
  .header-logo    { width: 80pt; flex-shrink: 0; margin-left: 18pt; margin-top: 4pt; }

  /* ── TAGLINE ── */
  .tagline {
    text-align: center;
    font-size: 10pt;
    font-style: italic;
    color: #bbb;
    margin: 5pt 0 14pt 0;
  }

  /* ── INTRO BLOCK ── */
  .intro-block {
    background: white;
    border: 1pt solid #e5e1db;
    border-radius: 6pt;
    padding: 13pt 16pt;
    margin-bottom: 18pt;
    break-inside: avoid;
  }
  .intro-block p { margin: 0 0 8pt 0; font-size: 10.5pt; color: #444; line-height: 1.65; }
  .intro-block p:last-child { margin: 0; }
  .kpi-row {
    display: flex;
    gap: 0;
    border-top: 0.5pt solid #eee;
    padding-top: 10pt;
    margin-top: 10pt;
    flex-wrap: wrap;
  }
  .kpi-item {
    flex: 1;
    min-width: 100pt;
    text-align: center;
    padding: 0 8pt;
    border-right: 0.5pt solid #eee;
  }
  .kpi-item:last-child { border-right: none; }
  .kpi-val {
    font-family: 'Poppins', sans-serif;
    font-size: 14pt;
    font-weight: 700;
    color: #FF5C5C;
    display: block;
  }
  .kpi-lbl { font-size: 8pt; color: #999; display: block; margin-top: 2pt; }

  /* ── SECTION HEADER ── */
  h2.sh {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 700;
    color: #041122;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 22pt 0 8pt 0;
    padding-bottom: 5pt;
    border-bottom: 1pt solid #ddd;
    display: flex;
    align-items: center;
    gap: 8pt;
  }
  .sec-num {
    display: inline-block;
    background: #041122;
    color: white;
    font-size: 7.5pt;
    font-weight: 700;
    padding: 1.5pt 5pt;
    border-radius: 3pt;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }

  /* ── SUB-HEADER ── */
  h3.subh {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 600;
    color: #1D1F28;
    margin: 12pt 0 5pt 0;
  }

  /* ── SEC NOTE ── */
  .sec-note {
    font-size: 9.5pt;
    color: #888;
    font-style: italic;
    margin: 0 0 8pt 0;
  }

  /* ── FLOW BOX ── */
  .flow-box {
    background: #f0f4f8;
    border-left: 3pt solid #041122;
    border-radius: 0 4pt 4pt 0;
    padding: 7pt 12pt;
    font-size: 9.5pt;
    color: #444;
    margin: 0 0 9pt 0;
    font-family: 'Inter', monospace;
  }
  .flow-label {
    display: block;
    font-size: 8pt;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 3pt;
  }

  /* ── QUESTION LIST ── */
  .q-list {
    list-style: none;
    margin: 0 0 4pt 0;
    padding: 0;
  }
  .q-item {
    font-size: 10.5pt;
    color: #1D1F28;
    padding: 5pt 0 5pt 18pt;
    border-bottom: 0.5pt solid #eee;
    position: relative;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .q-item:last-child { border-bottom: none; }
  .q-item::before {
    content: '›';
    position: absolute;
    left: 4pt;
    color: #FF5C5C;
    font-size: 12pt;
    line-height: 1;
    top: 5.5pt;
  }

  /* ── CHECKLIST ── */
  .check-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .check-item {
    display: flex;
    gap: 8pt;
    align-items: flex-start;
    font-size: 10.5pt;
    color: #1D1F28;
    padding: 5pt 0;
    border-bottom: 0.5pt solid #eee;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .check-item:last-child { border-bottom: none; }
  .check-box {
    font-size: 14pt;
    color: #ccc;
    line-height: 1;
    flex-shrink: 0;
    margin-top: -1pt;
  }

  /* ── DATA TABLE ── */
  .table-caption {
    font-size: 9.5pt;
    color: #888;
    font-style: italic;
    margin: 8pt 0 4pt 0;
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    margin-top: 4pt;
    margin-bottom: 4pt;
  }
  .data-table th {
    font-size: 8pt;
    font-weight: 600;
    color: #aaa;
    text-align: left;
    padding: 5pt 8pt;
    background: #f5f3ef;
    border: 0.5pt solid #ddd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  .data-table td {
    padding: 6pt 8pt;
    border: 0.5pt solid #e8e5e0;
    color: #1D1F28;
    vertical-align: top;
  }
  .data-table tr { break-inside: avoid; page-break-inside: avoid; }
  .td-key {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    color: #041122;
    font-size: 9.5pt;
  }
  .td-empty { background: white; min-height: 18pt; }
  .td-muted { color: #999; font-size: 9pt; }
  .td-critical { color: #FF5C5C; font-weight: 700; font-size: 9pt; }

  /* ── CALLOUT ── */
  .callout {
    background: #fff8f0;
    border: 1pt solid #ffd0b0;
    border-radius: 5pt;
    padding: 9pt 12pt;
    font-size: 9.5pt;
    color: #aa4400;
    margin-top: 10pt;
    display: flex;
    gap: 8pt;
    align-items: flex-start;
  }
  .callout-icon { font-size: 11pt; flex-shrink: 0; }

  /* ── BOTTOM BLOCK ── */
  .bottom-section {
    background: #041122;
    border-radius: 6pt;
    padding: 16pt 18pt;
    margin-top: 22pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .bottom-section h3 {
    font-family: 'Poppins', sans-serif;
    font-size: 9pt;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 10pt 0;
    padding-bottom: 8pt;
    border-bottom: 0.5pt solid rgba(255,255,255,0.1);
  }
  .bottom-kpi {
    display: flex;
    gap: 0;
    margin-bottom: 12pt;
  }
  .bk-item {
    flex: 1;
    text-align: center;
    padding: 0 8pt;
    border-right: 0.5pt solid rgba(255,255,255,0.1);
  }
  .bk-item:last-child { border-right: none; }
  .bk-val {
    font-family: 'Poppins', sans-serif;
    font-size: 15pt;
    font-weight: 700;
    color: #FF5C5C;
    display: block;
  }
  .bk-lbl { font-size: 7.5pt; color: rgba(255,255,255,0.45); display: block; margin-top: 3pt; }
  .closing {
    font-family: 'Poppins', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: white;
    text-align: center;
    padding-top: 12pt;
    border-top: 0.5pt solid rgba(255,255,255,0.1);
  }

  /* ── FOOTER ── */
  .footer {
    text-align: center;
    font-size: 8pt;
    font-style: italic;
    color: #ccc;
    margin-top: 14pt;
    padding-top: 8pt;
    border-top: 0.5pt solid #ddd;
  }

  .coral { color: #FF5C5C; }
  .bold  { font-weight: 700; }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header no-break">
    <div>
      <h1 class="report-title">LRMB — Production Onboarding</h1>
      <p class="report-meta">Luxury Rentals Miami Beach  ·  Field Ops Discovery  ·  April 2026</p>
      <p class="report-prepared">Prepared by MonteKristo AI</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">Cilj: Prikupiti sve što trebamo za prelaz iz pilot u production-ready sistem.</p>

  <!-- INTRO BLOCK -->
  <div class="intro-block no-break">
    <p>Izgradili smo <strong>Field Ops Warp-Speed Module (AiiA)</strong> — mobilni task coordination sistem za LRMB koji sjedi na vrhu TravelNet PMS-a. Pilot verzija je živa na <strong>lrmb.lovable.app</strong>. Sljedeći korak je production deployment sa realnim podacima, property-jima i staff-om.</p>
    <p>Ovaj dokument pokriva 14 oblasti koje moramo razjasniti na discovery sesiji. Odgovorite na pitanja ili popunite tabele — sve što trebamo da počnemo graditi.</p>
    <div class="kpi-row">
      <div class="kpi-item"><span class="kpi-val">↓ 40–60%</span><span class="kpi-lbl">Admin touchpoints</span></div>
      <div class="kpi-item"><span class="kpi-val">↓ 30–50%</span><span class="kpi-lbl">Cycle time</span></div>
      <div class="kpi-item"><span class="kpi-val">90%+</span><span class="kpi-lbl">Tasks s foto dokazom</span></div>
      <div class="kpi-item"><span class="kpi-val">≈ 0</span><span class="kpi-lbl">Field-to-office re-entry</span></div>
    </div>
  </div>

  <!-- 14 SECTIONS -->
  ${sectionsHTML}

  <!-- BOTTOM LINE -->
  <div class="bottom-section">
    <h3>Odmah nakon discovery sesije</h3>
    <div class="bottom-kpi">
      <div class="bk-item"><span class="bk-val">8</span><span class="bk-lbl">Kritičnih deliverables</span></div>
      <div class="bk-item"><span class="bk-val">14</span><span class="bk-lbl">Oblasti za razjasniti</span></div>
      <div class="bk-item"><span class="bk-val">4</span><span class="bk-lbl">Obavezni deliverables odmah</span></div>
      <div class="bk-item"><span class="bk-val">2–3w</span><span class="bk-lbl">Do production deploymenta</span></div>
    </div>
    <p class="closing">Odgovori na ova pitanja = production build može početi.</p>
  </div>

  <div class="footer">MonteKristo AI  ·  montekristoai.com  ·  LRMB × AiiA Field Ops  ·  April 2026</div>

</body>
</html>`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function generateReport() {
  const outputPath = path.join(__dirname, 'lrmb-onboarding-april-2026.pdf');
  const html = buildHTML();

  // save preview HTML
  const previewPath = path.join(__dirname, '..', '..', '..', 'reports-engine', 'report-preview.html');
  fs.writeFileSync(previewPath, html);
  console.log(`Preview → ${previewPath}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pagedjs_pages', { timeout: 20000 });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await browser.close();
  console.log(`PDF → ${outputPath}`);
  return outputPath;
}

generateReport().catch(console.error);
