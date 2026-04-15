const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── REPORT DATA ────────────────────────────────────────────────────────────

const reportData = {
  client: 'In Market Partners',
  endClient: 'PathFinder Health',
  period: 'March 2026',
  preparedBy: 'MonteKristo AI',
  tagline: "It's another great day to be great.",

  intro: `This report covers outreach activity for the month of March 2026 — a full four-week period, March 2 through March 31. The program operated across two LinkedIn sender profiles and a scaled email channel, with the shared objective of generating qualified conversations for PathFinder Health.`,

  glance: [
    { label: 'LinkedIn Requests', value: '887' },
    { label: 'Connections Built', value: '234' },
    { label: 'Acceptance Rate', value: '26.4%', coral: true },
    { label: 'LinkedIn Replies', value: '37' },
    { label: 'Emails Sent', value: '20,000' },
    { label: 'Email Reply Rate', value: '1.2%', coral: true },
  ],

  linkedin: {
    intro: `The LinkedIn channel maintained strong engagement throughout March, generating consistent connection volume and a growing reply pipeline across both sender profiles.`,
    stats: [
      { label: 'Acceptance Rate', value: '26.4%', coral: true, note: 'within the 15–30% benchmark for cold outreach' },
      { label: 'Connections Built', value: '234', note: 'new connections from 887 requests sent' },
      { label: 'Replies Generated', value: '37', note: 'total replies across both profiles' },
      { label: 'Follow-Ups Active', value: '414', note: 'messages sent to existing connections' },
    ],
    profiles: [
      { name: 'John Noble',    requests: 457, connected: 100, rate: '21.9%', followups: 172, replies: 19 },
      { name: 'Kristina Muxo', requests: 430, connected: 134, rate: '31.2%', followups: 242, replies: 18 },
    ],
    analysis: `Kristina Muxo outperformed on connection acceptance in March — 31.2% versus 21.9% for John Noble, a gap of nine percentage points. This confirms that sender positioning and narrative framing are material drivers of engagement quality. Muxo's higher follow-up volume (242 versus 172) produces a proportionally larger active conversation pipeline heading into April.`,
  },

  email: {
    intro: `The email channel reached a significant new audience in March while sustaining follow-up engagement with existing contacts.`,
    stats: [
      { label: 'Volume',           value: '20,000', note: 'total emails sent — 14,196 new contacts, 5,046 follow-ups' },
      { label: 'Reply Rate',       value: '1.2%',   coral: true, note: '239 leads responded to outreach across the month' },
      { label: 'Interested Leads', value: '3',      note: 'prospects flagged as actively interested, ready for direct follow-up' },
    ],
    analysis: `Three leads currently identified as interested represent the most advanced stage of the email pipeline. Direct outreach to these contacts is the immediate conversion priority for April. Messaging refinement continues, with updated sequences in progress to improve the reply-to-meeting conversion rate.`,
  },

  outlook: {
    intro: `The outreach engine is active across both channels. The focus for April is conversion.`,
    linkedin: `On LinkedIn, 37 replies generated in March — including active conversations across both profiles — provide a clear pipeline for meeting scheduling. The 414 follow-up messages sent in March sustain ongoing momentum into the new month.`,
    email: `On email, the three identified interested leads are the immediate priority. Alongside direct outreach to these contacts, messaging experiments will be deployed to improve the broader reply-to-meeting rate across the full pipeline.`,
  },

  bottomLine: {
    rows: [
      { label: 'LinkedIn', value: '887 requests  ·  234 connected ', coral: '26.4%', suffix: '  ·  414 follow-ups  ·  37 replies' },
      { label: 'Email',    value: '14,196 new contacts reached  ·  239 replies  ·  3 leads interested' },
    ],
    closing: 'The pipeline is active. The next step is conversion.',
  },
};

// ─── LOGO (favicon-bold.svg embedded inline — fix camelCase attrs for browser SVG) ───

const svgLogoPath = path.join(__dirname, '..', 'Logo', 'favicon-bold.svg');
const svgRaw = fs.readFileSync(svgLogoPath, 'utf8')
  .replace(/strokeWidth=/g, 'stroke-width=')
  .replace(/strokeLinecap=/g, 'stroke-linecap=')
  .replace(/strokeLinejoin=/g, 'stroke-linejoin=');
const svgBase64 = Buffer.from(svgRaw).toString('base64');
const logoSrc = `data:image/svg+xml;base64,${svgBase64}`;

// ─── HTML TEMPLATE ──────────────────────────────────────────────────────────

function buildHTML(data) {

  const glanceCards = data.glance.map(g => `
    <div class="glance-card">
      <div class="glance-value${g.coral ? ' coral' : ''}">${g.value}</div>
      <div class="glance-label">${g.label}</div>
    </div>`).join('');

  const linkedinStats = data.linkedin.stats.map(s => `
    <div class="stat-row">
      <span class="stat-label">${s.label}</span>
      <span class="stat-value${s.coral ? ' coral' : ''}">${s.value}</span>
      <span class="stat-note">${s.note}</span>
    </div>`).join('');

  const profileRows = data.linkedin.profiles.map(p => `
    <tr>
      <td class="td-name">${p.name}</td>
      <td>${p.requests}</td>
      <td>${p.connected}</td>
      <td class="coral bold">${p.rate}</td>
      <td>${p.followups}</td>
      <td>${p.replies}</td>
    </tr>`).join('');

  const emailStats = data.email.stats.map(s => `
    <div class="stat-row">
      <span class="stat-label">${s.label}</span>
      <span class="stat-value${s.coral ? ' coral' : ''}">${s.value}</span>
      <span class="stat-note">${s.note}</span>
    </div>`).join('');

  const bottomRows = data.bottomLine.rows.map(r => {
    const value = r.coral
      ? `${r.value}<span class="coral bold">${r.coral}</span>${r.suffix || ''}`
      : r.value;
    return `
    <div class="bottom-row">
      <span class="bl-label">${r.label}</span>
      <span class="bl-value">${value}</span>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
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
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    font-size: 11pt;
    color: #1D1F28;
    line-height: 1.6;
    background: #FAF8F4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── PAGE BREAK RULES ── */
  .no-break  { break-inside: avoid; page-break-inside: avoid; }
  h2.sh      { break-after: avoid;  page-break-after: avoid; }
  h3.subh    { break-after: avoid;  page-break-after: avoid; }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5pt solid #041122;
    padding-bottom: 14pt;
    margin-bottom: 12pt;
  }
  .report-title {
    font-family: 'Poppins', sans-serif;
    font-size: 22pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
    margin: 0 0 6pt 0;
  }
  .report-meta {
    font-size: 11pt;
    color: #777;
    margin: 0 0 3pt 0;
  }
  .report-prepared {
    font-size: 10pt;
    font-style: italic;
    color: #999;
    margin: 0;
  }
  .header-logo { width: 90pt; flex-shrink: 0; margin-left: 20pt; margin-top: 2pt; }

  /* ── TAGLINE ── */
  .tagline {
    text-align: center;
    font-size: 10.5pt;
    font-style: italic;
    color: #bbb;
    margin: 4pt 0 14pt 0;
  }

  /* ── INTRO ── */
  .intro { font-size: 11pt; color: #444; line-height: 1.65; margin: 0 0 16pt 0; }

  /* ── SECTION HEADER ── */
  h2.sh {
    font-family: 'Poppins', sans-serif;
    font-size: 10.5pt;
    font-weight: 700;
    color: #041122;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 20pt 0 9pt 0;
    padding-bottom: 5pt;
    border-bottom: 1pt solid #ddd;
  }

  /* ── SUB-HEADER ── */
  h3.subh {
    font-family: 'Poppins', sans-serif;
    font-size: 10.5pt;
    font-weight: 600;
    color: #1D1F28;
    margin: 14pt 0 6pt 0;
  }

  /* ── GLANCE GRID ── */
  .glance-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8pt;
    background: white;
    border-radius: 6pt;
    padding: 14pt 12pt;
    border: 1pt solid #e5e1db;
    margin-bottom: 16pt;
  }
  .glance-card { text-align: center; }
  .glance-value {
    font-family: 'Poppins', sans-serif;
    font-size: 16pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
  }
  .glance-label {
    font-size: 7.5pt;
    color: #999;
    margin-top: 3pt;
    line-height: 1.35;
  }

  /* ── STAT ROWS ── */
  .stat-row {
    display: flex;
    align-items: baseline;
    gap: 0;
    padding: 6.5pt 0;
    border-bottom: 0.5pt solid #eee;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-label {
    font-size: 10pt;
    color: #888;
    width: 120pt;
    flex-shrink: 0;
  }
  .stat-value {
    font-size: 12pt;
    font-weight: 600;
    color: #041122;
    width: 56pt;
    flex-shrink: 0;
  }
  .stat-note {
    font-size: 10pt;
    color: #999;
    font-style: italic;
  }

  /* ── PROFILE TABLE ── */
  .profile-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
    margin-top: 4pt;
  }
  .profile-table th {
    font-size: 8pt;
    font-weight: 500;
    color: #aaa;
    text-align: left;
    padding: 4pt 8pt 4pt 0;
    border-bottom: 1pt solid #ddd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  .profile-table td {
    padding: 7pt 8pt 7pt 0;
    border-bottom: 0.5pt solid #eee;
    color: #1D1F28;
    font-weight: 500;
    white-space: nowrap;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .profile-table tr { break-inside: avoid; page-break-inside: avoid; }
  .td-name {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    color: #041122;
    font-size: 10.5pt;
  }

  /* ── ANALYSIS ── */
  .analysis {
    font-size: 11pt;
    color: #1D1F28;
    margin: 10pt 0 0 0;
    line-height: 1.65;
  }

  /* ── BOTTOM LINE ── */
  .bottom-section {
    background: #041122;
    border-radius: 6pt;
    padding: 16pt 18pt;
    margin-top: 20pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .bottom-section h2.sh {
    color: white;
    border-bottom-color: rgba(255,255,255,0.15);
    margin-top: 0;
  }
  .bottom-row {
    display: flex;
    gap: 12pt;
    align-items: baseline;
    padding: 5pt 0;
    border-bottom: 0.5pt solid rgba(255,255,255,0.08);
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .bottom-row:last-of-type { border-bottom: none; }
  .bl-label {
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    font-size: 9pt;
    width: 56pt;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .bl-value {
    font-size: 10.5pt;
    font-weight: 500;
    color: rgba(255,255,255,0.88);
  }
  .closing {
    font-family: 'Poppins', sans-serif;
    font-size: 12pt;
    font-weight: 700;
    color: white;
    text-align: center;
    margin-top: 12pt;
    padding-top: 12pt;
    border-top: 1pt solid rgba(255,255,255,0.15);
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


  /* ── UTILITY ── */
  .coral { color: #FF5C5C; }
  .bold  { font-weight: 700; }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header no-break">
    <div>
      <h1 class="report-title">Outbound Program Performance Update</h1>
      <p class="report-meta">${data.client}  ·  ${data.endClient}  ·  ${data.period}</p>
      <p class="report-prepared">Prepared by ${data.preparedBy}</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">${data.tagline}</p>
  <p class="intro">${data.intro}</p>

  <!-- MARCH AT A GLANCE -->
  <div class="section-block">
    <h2 class="sh">March at a Glance</h2>
    <div class="glance-grid no-break">
      ${glanceCards}
    </div>
  </div>

  <!-- LINKEDIN -->
  <div class="section-block">
    <h2 class="sh">LinkedIn</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:8pt;">${data.linkedin.intro}</p>
    <div class="no-break">
      ${linkedinStats}
    </div>
  </div>

  <!-- PROFILE COMPARISON -->
  <div class="section-block">
    <h3 class="subh">Profile Comparison</h3>
    <table class="profile-table no-break">
      <thead>
        <tr>
          <th>Profile</th>
          <th>Requests</th>
          <th>Connected</th>
          <th>Rate</th>
          <th>Follow-ups</th>
          <th>Replies</th>
        </tr>
      </thead>
      <tbody>${profileRows}</tbody>
    </table>
    <p class="analysis">${data.linkedin.analysis}</p>
  </div>

  <!-- EMAIL -->
  <div class="section-block">
    <h2 class="sh">Email</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:8pt;">${data.email.intro}</p>
    <div class="no-break">
      ${emailStats}
    </div>
    <p class="analysis">${data.email.analysis}</p>
  </div>

  <!-- APRIL PRIORITIES -->
  <div class="section-block">
    <h2 class="sh">April Priorities</h2>
    <p class="analysis" style="margin-top:0;">${data.outlook.intro}</p>
    <p class="analysis">${data.outlook.linkedin}</p>
    <p class="analysis">${data.outlook.email}</p>
  </div>

  <!-- BOTTOM LINE -->
  <div class="bottom-section">
    <h2 class="sh">Bottom Line</h2>
    ${bottomRows}
    <p class="closing">${data.bottomLine.closing}</p>
  </div>

  <div class="footer">MonteKristo AI  ·  montekristoai.com  ·  ${data.period}</div>

</body>
</html>`;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function generateReport() {
  const outputPath = path.join(__dirname, '..', 'reggierriley-march-2026.pdf');
  const html = buildHTML(reportData);
  fs.writeFileSync(path.join(__dirname, 'report-preview.html'), html);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // wait for paged.js to finish laying out all pages
  await page.waitForSelector('.pagedjs_pages', { timeout: 15000 });
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
