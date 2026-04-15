const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── LOGO ──────────────────────────────────────────────────────────────────
const svgLogoPath = path.join(__dirname, '..', 'Logo', 'favicon-bold.svg');
const svgRaw = fs.readFileSync(svgLogoPath, 'utf8')
  .replace(/strokeWidth=/g, 'stroke-width=')
  .replace(/strokeLinecap=/g, 'stroke-linecap=')
  .replace(/strokeLinejoin=/g, 'stroke-linejoin=');
const svgBase64 = Buffer.from(svgRaw).toString('base64');
const logoSrc = `data:image/svg+xml;base64,${svgBase64}`;

// ─── HTML ──────────────────────────────────────────────────────────────────
function buildHTML() {
return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"><\/script>
<style>
  *, *::before, *::after { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 14mm 18mm 16mm 18mm; background: #FAF8F4; }
  html, body { margin:0; padding:0; font-family:'Inter',sans-serif; font-size:10.5pt; color:#1D1F28; line-height:1.65; background:#FAF8F4; }
  .no-break { break-inside:avoid; page-break-inside:avoid; }
  h2.sh { font-family:'Poppins',sans-serif; font-size:10.5pt; font-weight:700; color:#041122; text-transform:uppercase; letter-spacing:0.08em; margin:22pt 0 9pt 0; padding-bottom:5pt; border-bottom:1pt solid #ddd; break-after:avoid; }
  h3.subh { font-family:'Poppins',sans-serif; font-size:10pt; font-weight:600; color:#1D1F28; margin:14pt 0 6pt 0; break-after:avoid; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1.5pt solid #041122; padding-bottom:14pt; margin-bottom:10pt; }
  .report-title { font-family:'Poppins',sans-serif; font-size:20pt; font-weight:700; color:#041122; line-height:1.2; margin:0 0 6pt 0; }
  .report-meta { font-size:10pt; color:#777; margin:0 0 3pt 0; }
  .report-prepared { font-size:9pt; font-style:italic; color:#999; margin:0; }
  .header-logo { width:80pt; flex-shrink:0; margin-left:16pt; margin-top:2pt; }
  p { margin:0 0 8pt 0; font-size:10.5pt; line-height:1.65; }
  .intro { color:#444; margin-bottom:14pt; }
  .coral { color:#FF5C5C; }
  .bold { font-weight:700; }
  .code-block { background:#041122; color:#e0e0e0; border-radius:4pt; padding:10pt 12pt; font-family:'Courier New',monospace; font-size:9pt; line-height:1.5; margin:8pt 0 12pt 0; break-inside:avoid; overflow-x:auto; white-space:pre-wrap; word-break:break-all; }
  .code-block .cmd { color:#FF5C5C; }
  .code-block .comment { color:#666; }

  .info-box { background:white; border:1pt solid #e5e1db; border-radius:6pt; padding:12pt 14pt; margin:10pt 0 14pt 0; break-inside:avoid; }
  .info-box h4 { font-family:'Poppins',sans-serif; font-size:9.5pt; font-weight:600; color:#041122; margin:0 0 6pt 0; text-transform:uppercase; letter-spacing:0.05em; }

  table.doc-table { width:100%; border-collapse:collapse; margin:8pt 0 12pt 0; font-size:9.5pt; }
  table.doc-table th { font-size:8pt; font-weight:500; color:#aaa; text-align:left; padding:4pt 8pt 4pt 0; border-bottom:1pt solid #ddd; text-transform:uppercase; letter-spacing:0.05em; }
  table.doc-table td { padding:6pt 8pt 6pt 0; border-bottom:0.5pt solid #eee; color:#1D1F28; vertical-align:top; }
  table.doc-table tr { break-inside:avoid; }
  td.label { font-weight:600; color:#041122; white-space:nowrap; width:140pt; }
  td.mono { font-family:'Courier New',monospace; font-size:9pt; color:#555; }

  .step-num { display:inline-block; width:22pt; height:22pt; background:#041122; color:white; border-radius:50%; text-align:center; line-height:22pt; font-size:9pt; font-weight:700; margin-right:6pt; flex-shrink:0; }
  .step-row { display:flex; align-items:flex-start; gap:0; margin:8pt 0; break-inside:avoid; }
  .step-text { flex:1; padding-top:2pt; }

  .bottom-section { background:#041122; border-radius:6pt; padding:16pt 18pt; margin-top:20pt; break-inside:avoid; }
  .bottom-section h2.sh { color:white; border-bottom-color:rgba(255,255,255,0.15); margin-top:0; }
  .bottom-row { display:flex; gap:12pt; align-items:baseline; padding:5pt 0; border-bottom:0.5pt solid rgba(255,255,255,0.08); break-inside:avoid; }
  .bottom-row:last-of-type { border-bottom:none; }
  .bl-label { font-weight:600; color:rgba(255,255,255,0.5); font-size:8.5pt; width:90pt; flex-shrink:0; text-transform:uppercase; letter-spacing:0.05em; }
  .bl-value { font-size:10pt; font-weight:500; color:rgba(255,255,255,0.88); }
  .closing { font-family:'Poppins',sans-serif; font-size:11pt; font-weight:700; color:white; text-align:center; margin-top:12pt; padding-top:12pt; border-top:1pt solid rgba(255,255,255,0.15); }

  .footer { text-align:center; font-size:8pt; font-style:italic; color:#ccc; margin-top:14pt; padding-top:8pt; border-top:0.5pt solid #ddd; }

  ul.doc-list { margin:4pt 0 10pt 0; padding-left:16pt; }
  ul.doc-list li { margin:3pt 0; font-size:10pt; }
  .warn { background:#FFF3E0; border-left:3pt solid #FF9800; padding:8pt 12pt; border-radius:0 4pt 4pt 0; margin:8pt 0 12pt 0; font-size:9.5pt; break-inside:avoid; }
  .warn strong { color:#E65100; }
  .success { background:#E8F5E9; border-left:3pt solid #4CAF50; padding:8pt 12pt; border-radius:0 4pt 4pt 0; margin:8pt 0 12pt 0; font-size:9.5pt; break-inside:avoid; }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header no-break">
  <div>
    <h1 class="report-title">AutoLoop System Documentation</h1>
    <p class="report-meta">MonteKristo AI  ·  Internal Documentation  ·  April 2026</p>
    <p class="report-prepared">Autonomous Optimization System based on Karpathy's AutoResearch Pattern</p>
  </div>
  <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
</div>

<p class="intro">AutoLoop je autonomni optimizacioni sistem koji primenjuje Karpathy-jev autoresearch pattern na sve merljive deliverable-ove MonteKristo AI sistema. Sistem pokrece eksperimente, evaluira sa postojecim scorer-ima, cuva poboljsanja, odbacuje regresije, i generise predloge za odobravanje. Sve promene u produkciji zahtevaju tvoje odobrenje.</p>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Sta je AutoLoop?</h2>

<p>Tri komponente, jedna petlja:</p>

<div class="info-box no-break">
  <h4>Karpathy Pattern</h4>
  <table class="doc-table">
    <tr><td class="label">Prepare (immutable)</td><td>Evaluacioni harness - blog-analyze (100pt), seo-page, frontend-critic (176 checks)</td></tr>
    <tr><td class="label">Train (modifiable)</td><td>Target fajl - blog post HTML, page meta tags, voice prompt, email template</td></tr>
    <tr><td class="label">Program (instructions)</td><td>Domain-specificne instrukcije - autoloop/programs/{domain}.md</td></tr>
  </table>
</div>

<p>Petlja: Procitaj program, modifikuj target, evaluiraj, uporedi sa baseline. Ako je bolje I ako guard rails prolaze - sacuvaj. Ako nije - vrati nazad. Ponovi.</p>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Kako se koristi (komande)</h2>

<p>Pokreces autoloop tako sto kazes Claude-u sta zelis da optimizujes:</p>

<div class="code-block"><span class="cmd">/autoloop blog-quality</span> clients/luxeshutters/blog/posts/post.html
<span class="cmd">/autoloop seo-score</span> https://luxeshutters.com.au/blog/some-page
<span class="cmd">/autoloop website-perf</span> clients/sunraise-capital/website/index.html
<span class="cmd">/autoloop skill-improve</span> blog-write --iterations 3
<span class="cmd">/autoloop outreach-reply</span> clients/reggierriley/templates/email.md --propose-only
<span class="cmd">/autoloop voice-booking</span> --propose-only</div>

<div class="info-box no-break">
  <h4>Argumenti</h4>
  <table class="doc-table">
    <tr><td class="label">domain (obavezan)</td><td>blog-quality | seo-score | website-perf | outreach-reply | voice-booking | ad-creative | skill-improve</td></tr>
    <tr><td class="label">target (obavezan)</td><td>Putanja do fajla, URL, ili ime skill-a</td></tr>
    <tr><td class="label">--iterations N</td><td>Maksimalan broj iteracija (default: 10 za content, 5 za skills)</td></tr>
    <tr><td class="label">--propose-only</td><td>Generisi predlog bez primene promena (default za Layer 2)</td></tr>
    <tr><td class="label">--auto-level N</td><td>Nivo autonomije 0-3 (default: 0 = sve ide na review)</td></tr>
  </table>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">7 Domena Optimizacije</h2>

<table class="doc-table">
  <thead>
    <tr><th>Domen</th><th>Metrika</th><th>Evaluator</th><th>Feedback</th></tr>
  </thead>
  <tbody>
    <tr><td class="label">blog-quality</td><td>Blog score 0-100</td><td>blog-analyze skill</td><td>~2 min</td></tr>
    <tr><td class="label">seo-score</td><td>SEO score 0-100</td><td>seo-page skill</td><td>~3 min</td></tr>
    <tr><td class="label">website-perf</td><td>PageSpeed 0-100</td><td>seo-google + frontend-critic</td><td>~4 min</td></tr>
    <tr><td class="label">outreach-reply</td><td>Reply rate %</td><td>Instantly API via n8n</td><td>48-72h</td></tr>
    <tr><td class="label">voice-booking</td><td>Booking rate %</td><td>Retell API via n8n</td><td>1 nedelja</td></tr>
    <tr><td class="label">ad-creative</td><td>CPA (nize = bolje)</td><td>Meta API via n8n</td><td>3-5 dana</td></tr>
    <tr><td class="label">skill-improve</td><td>Eval pass rate %</td><td>Eval suite runner</td><td>~5 min</td></tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Tri Sloja Arhitekture</h2>

<div class="info-box no-break">
  <h4>Layer 1 - Content Loops (instant feedback)</h4>
  <p style="margin:0">Claude Code pokrece loop direktno. Evaluacija za sekunde/minute. Domeni: blog-quality, seo-score, website-perf. Pokreces sa /autoloop {domain} {fajl}.</p>
</div>

<div class="info-box no-break">
  <h4>Layer 2 - Business Metric Loops (slow feedback)</h4>
  <p style="margin:0">n8n cron workflow-ovi prikupljaju podatke nedeljno. Domeni: outreach-reply, voice-booking, ad-creative. Radi automatski u pozadini, rezultati u n8n execution log-ovima.</p>
</div>

<div class="info-box no-break">
  <h4>Layer 3 - Meta Loop (skill self-improvement)</h4>
  <p style="margin:0">Skills koji poboljsavaju sopstveni SKILL.md na osnovu eval suite rezultata. Pokreces manuelno sa /autoloop skill-improve {skill-name}.</p>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Sta radi automatski u pozadini</h2>

<p>Tri n8n workflow-a rade na cron rasporedu bez ikakvog manuelnog pokretanja:</p>

<table class="doc-table">
  <thead>
    <tr><th>Workflow</th><th>ID</th><th>Raspored</th><th>Sta radi</th></tr>
  </thead>
  <tbody>
    <tr>
      <td class="label">Voice Agent Weekly Analyzer</td>
      <td class="mono">ksLBw7KqlgUDGVj4</td>
      <td>Nedelja 9am Belgrade</td>
      <td>Povlaci sve Retell pozive za proslu nedelju (Pulse + LuxeShutters agente), analizira booking rate, trajanje, sentiment, cuva izvestaj u execution log</td>
    </tr>
    <tr>
      <td class="label">Outreach Reply Rate Tracker</td>
      <td class="mono">zpTDn387nfH2QqLO</td>
      <td>Ponedeljak 8am Belgrade</td>
      <td>Prikuplja outreach metrike (placeholder dok se ne konektuje Instantly API), poredi A/B varijante, cuva izvestaj</td>
    </tr>
    <tr>
      <td class="label">Weekly Summary Report</td>
      <td class="mono">NbuRaeEFYtpvBQcP</td>
      <td>Nedelja 10pm Belgrade</td>
      <td>Agregira sve eksperimente iz te nedelje, pravi sumarni izvestaj svih domena, cuva u execution log</td>
    </tr>
  </tbody>
</table>

<div class="warn">
  <strong>Bitno:</strong> Izvestaji se cuvaju u n8n execution log-ovima. Kada zelis da vidis rezultate, pitaj Claude-a: "Sta je autoloop javio ove nedelje?" i on cita podatke iz n8n-a preko MCP-a.
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Kako izgleda jedan autoloop ciklus (korak po korak)</h2>

<div class="step-row no-break"><span class="step-num">1</span><div class="step-text"><strong>Citanje programa</strong> - Claude cita autoloop/programs/{domain}.md za instrukcije: koja metrika, koje akcije su dozvoljene, koja ogranicenja vaze, koje guard rails moraju da prodju.</div></div>

<div class="step-row no-break"><span class="step-num">2</span><div class="step-text"><strong>Uspostavljanje baseline-a</strong> - Pokrece evaluacioni skill (npr. blog-analyze) na neizmenjenom fajlu. Rezultat se cuva u autoloop/baselines/ kao JSON.</div></div>

<div class="step-row no-break"><span class="step-num">3</span><div class="step-text"><strong>Citanje istorije</strong> - Ucitava poslednjih 20 eksperimenata iz autoloop/logs/ da ne ponavlja neuspele pokusaje (failure memory).</div></div>

<div class="step-row no-break"><span class="step-num">4</span><div class="step-text"><strong>Generisanje hipoteze</strong> - Na osnovu najslabije kategorije, istorije, i PATTERNS.md, predlaze jednu specificnu promenu: npr. "Dodaj BlogPosting JSON-LD schema da poboljsa Technical Elements score."</div></div>

<div class="step-row no-break"><span class="step-num">5</span><div class="step-text"><strong>Primena promene</strong> - Pravi backup (git commit ili kopija fajla), primenjuje promenu na target fajl.</div></div>

<div class="step-row no-break"><span class="step-num">6</span><div class="step-text"><strong>Evaluacija</strong> - Ponovo pokrece isti evaluacioni skill. Poredi novi score sa baseline-om.</div></div>

<div class="step-row no-break"><span class="step-num">7</span><div class="step-text"><strong>Odluka</strong> - Ako je score bolji I svi guard rails prolaze: KEEP (sacuvaj promenu, azuriraj baseline). Ako nije: DISCARD (vrati na prethodno stanje).</div></div>

<div class="step-row no-break"><span class="step-num">8</span><div class="step-text"><strong>Logovanje</strong> - Svaki eksperiment se belezi u autoloop/logs/ kao JSONL (timestamp, hipoteza, promene, score pre/posle, status, obrazlozenje).</div></div>

<div class="step-row no-break"><span class="step-num">9</span><div class="step-text"><strong>Ponavljanje ili zaustavljanje</strong> - Ponavlja korake 3-8 do max iteracija ili stagnacije (5 uzastopnih eksperimenata sa delta < 0.5).</div></div>

<div class="step-row no-break"><span class="step-num">10</span><div class="step-text"><strong>Generisanje predloga</strong> - Kreira citljiv dokument u autoloop/proposals/ sa svim sacuvanim promenama, score progresijom, i guard rail statusom. Ti pregledas i odobris ili odbacis.</div></div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Guard Rails (zastita od gresaka)</h2>

<p>Svaki domen ima hard gates - sekundarne metrike koje MORAJU da prodju. Ako bilo koji guard rail ne prodje, promena se automatski odbacuje, bez obzira na score poboljsanje.</p>

<table class="doc-table">
  <thead>
    <tr><th>Domen</th><th>Guard Rails</th></tr>
  </thead>
  <tbody>
    <tr><td class="label">blog-quality</td><td>banned_words == 0, burstiness > 5.0, TTR > 0.35, AI probability < 50%, em dashes ne smeju da rastu</td></tr>
    <tr><td class="label">seo-score</td><td>Nijedna kategorija ne sme da padne, keyword density 1-3%, schema mora da bude validan JSON-LD</td></tr>
    <tr><td class="label">website-perf</td><td>CLS < 0.1, frontend-critic score stabilan, vizuelni dizajn nepromenjen</td></tr>
    <tr><td class="label">voice-booking</td><td>Compliance jezik sacuvan, payment gating aktivan, call completion rate stabilan</td></tr>
    <tr><td class="label">outreach-reply</td><td>Bounce rate < 5%, unsubscribe rate stabilan, brand voice compliance</td></tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Human-in-the-Loop (Odobravanje)</h2>

<div class="warn">
  <strong>Kljucno pravilo:</strong> Nijedna promena ne ide u produkciju bez tvog odobrenja. AutoLoop predlaze, ti odobravaj.
</div>

<p>Svaki autoloop run generise proposal dokument u <strong>autoloop/proposals/</strong>. Dokument sadrzi:</p>
<ul class="doc-list">
  <li>Score progresiju (tabela: iteracija, score, delta, status)</li>
  <li>Svaku sacuvanu promenu sa objasnjenjm (sta, zasto, koji impact)</li>
  <li>Odbacene promene sa razlogom</li>
  <li>Ukupan rezultat (pre/posle score, guard rail status)</li>
</ul>

<p>Opcije za odobravanje:</p>
<ul class="doc-list">
  <li><strong>Odobri sve</strong> - Primeni sve sacuvane promene</li>
  <li><strong>Odobri pojedinacno</strong> - Cherry-pick specificne promene</li>
  <li><strong>Odbaci</strong> - Vrati sve nazad, loguj razlog</li>
</ul>

<h3 class="subh">Graduated Autonomy (4 nivoa)</h3>

<table class="doc-table">
  <thead><tr><th>Nivo</th><th>Period</th><th>Sta se auto-odobrava</th></tr></thead>
  <tbody>
    <tr><td class="label">Level 0</td><td>Nedelja 1-2</td><td>Nista. SVE ide na review.</td></tr>
    <tr><td class="label">Level 1</td><td>Nedelja 3-4</td><td>Image format konverzije, loading=lazy, width/height, alt text, OG tags, schema dodavanje</td></tr>
    <tr><td class="label">Level 2</td><td>Mesec 2+</td><td>Level 1 + title tag, meta description, heading hierarchy, internal links</td></tr>
    <tr><td class="label">Level 3</td><td>Mesec 3+</td><td>Level 2 + paragraph rewrite za burstiness, sourced statistike, engagement elementi</td></tr>
  </tbody>
</table>

<div class="warn">
  <strong>NIKAD auto-approve:</strong> Fakticke tvrdnje, voice agent prompts, outreach sadrzaj, ad kreative, skill modifikacije, bilo sta client-facing.
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Fajl Struktura</h2>

<div class="code-block"><span class="comment"># Skill</span>
~/.claude/skills/autoloop/SKILL.md

<span class="comment"># Programi (instrukcije po domenu)</span>
autoloop/programs/blog-quality.md
autoloop/programs/seo-score.md
autoloop/programs/website-perf.md
autoloop/programs/outreach-reply.md
autoloop/programs/voice-booking.md
autoloop/programs/ad-creative.md
autoloop/programs/skill-improve.md

<span class="comment"># Eval suites (binarni pass/fail kriterijumi)</span>
autoloop/eval-suites/blog-quality.json
autoloop/eval-suites/seo-score.json
autoloop/eval-suites/website-perf.json

<span class="comment"># Runtime fajlovi (popunjavaju se tokom rada)</span>
autoloop/baselines/{domain}-{client}-{target}.json
autoloop/logs/{domain}-{client}-{date}.jsonl
autoloop/proposals/{id}-{domain}-{client}.md

<span class="comment"># Kompoundirano znanje</span>
autoloop/PATTERNS.md</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Kako proveravas izvestaje</h2>

<p>Postoje tri nacina da vidis sta je autoloop uradio:</p>

<div class="info-box no-break">
  <h4>1. Pitaj Claude-a</h4>
  <p style="margin:0">Kazes: "Sta je autoloop javio ove nedelje?" ili "Pokazi mi poslednji autoloop izvestaj." Claude cita podatke iz n8n execution log-ova i autoloop/logs/ fajlova i daje ti sumarizovan pregled.</p>
</div>

<div class="info-box no-break">
  <h4>2. Proposals folder</h4>
  <p style="margin:0">Svaki autoloop run generise dokument u autoloop/proposals/. Otvori bilo koji .md fajl da vidis detaljan pregled promena sa score progresijom.</p>
</div>

<div class="info-box no-break">
  <h4>3. n8n Dashboard</h4>
  <p style="margin:0">Otvori n8n na https://primary-production-5fdce.up.railway.app/ i pogledaj execution log-ove za AutoLoop workflow-ove. Svaki execution sadrzi formatiran izvestaj.</p>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Primeri koriscenja</h2>

<div class="info-box no-break">
  <h4>Primer 1: Optimizuj blog post pre objave</h4>
  <p style="margin:0 0 6pt 0">Kazes: "Optimizuj ovaj post pre objave" ili direktno:</p>
  <div class="code-block" style="margin-bottom:0"><span class="cmd">/autoloop blog-quality</span> clients/breathmastery/blog/posts/box-breathing.html</div>
  <p style="margin:6pt 0 0 0">Claude pokrece 10 iteracija, prati score od npr. 72 do 90+, generise proposal. Ti pregledas i odobris.</p>
</div>

<div class="info-box no-break">
  <h4>Primer 2: Mesecni SEO sweep</h4>
  <p style="margin:0 0 6pt 0">Kazes: "Uradi SEO sweep na LuxeShutters sajtu" ili:</p>
  <div class="code-block" style="margin-bottom:0"><span class="cmd">/autoloop seo-score</span> https://luxeshutters.com.au/blog/plantation-shutters-cost-australia</div>
  <p style="margin:6pt 0 0 0">Dodaje nedostajuce meta tags, schema, OG tagove. Nikad ne menja vidljiv sadrzaj stranice.</p>
</div>

<div class="info-box no-break">
  <h4>Primer 3: Proveri voice agent performanse</h4>
  <p style="margin:0 0 6pt 0">Kazes: "Sta je autoloop javio za voice agente ove nedelje?"</p>
  <p style="margin:0">Claude cita n8n execution log za Voice Agent Analyzer workflow i daje ti booking rate, broj poziva, prosecno trajanje, i preporuke za poboljsanje.</p>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<h2 class="sh">Knowledge Compounding</h2>

<p>Svaki eksperiment hrani tri sistema:</p>
<ul class="doc-list">
  <li><strong>autoloop/logs/</strong> - Sirovi JSONL logovi (timestamp, hipoteza, rezultat, reasoning)</li>
  <li><strong>autoloop/PATTERNS.md</strong> - Cross-experiment obrasci (posle svakih 10 eksperimenata, analiziraju se trendovi i azuriraju proven/anti-patterns)</li>
  <li><strong>Obsidian Wiki</strong> - Kad ista tehnika uspe za 2+ klijenta, postaje wiki pattern stranica sa status: proven</li>
</ul>

<p>Ovo znaci da svaki novi klijent pocinje sa dokazanim obrascima umesto od nule. Znanje se akumulira.</p>

<!-- ═══════════════════════════════════════════════════════════════ -->

<div class="bottom-section">
  <h2 class="sh">Sumarni Status</h2>
  <div class="bottom-row"><span class="bl-label">Skill</span><span class="bl-value">autoloop SKILL.md  ·  404 linija  ·  <span class="coral">ACTIVE</span></span></div>
  <div class="bottom-row"><span class="bl-label">Domeni</span><span class="bl-value">7 programa  ·  3 eval suite-a  ·  svi domeni pokriveni</span></div>
  <div class="bottom-row"><span class="bl-label">n8n</span><span class="bl-value">3 workflow-a  ·  svi <span class="coral">ACTIVE</span>  ·  cron nedelja/ponedeljak</span></div>
  <div class="bottom-row"><span class="bl-label">Wiki</span><span class="bl-value">2 stranice  ·  autoloop-pattern + run-autoloop-optimization</span></div>
  <div class="bottom-row"><span class="bl-label">Testiran</span><span class="bl-value">End-to-end na LuxeShutters postu  ·  86 -> <span class="coral">90/100</span></span></div>
  <div class="bottom-row"><span class="bl-label">Retell API</span><span class="bl-value">Verifikovan  ·  vraca prave pozive sa transkriptima</span></div>
  <p class="closing">Sistem predlaze. Ti odobravaj. Znanje se akumulira.</p>
</div>

<p class="footer">MonteKristo AI  ·  montekristobelgrade.com  ·  AutoLoop v1.0  ·  April 2026</p>

</body></html>`;
}

// ─── GENERATE ──────────────────────────────────────────────────────────────

(async () => {
  const html = buildHTML();

  // Save preview
  const previewPath = path.join(__dirname, 'autoloop-documentation-preview.html');
  fs.writeFileSync(previewPath, html);
  console.log(`Preview: ${previewPath}`);

  // PDF
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pagedjs_pages', { timeout: 30000 });

  const pdfPath = path.join(__dirname, '..', '_internal', 'AutoLoop-System-Documentation.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`PDF: ${pdfPath}`);
})();
