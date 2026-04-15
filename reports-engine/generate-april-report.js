const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── REPORT DATA ────────────────────────────────────────────────────────────

const reportData = {
  client: 'In Market Partners',
  endClient: 'PathFinder Health',
  period: 'April 1 - 15, 2026',
  periodShort: 'April 2026',
  preparedBy: 'MonteKristo AI',
  tagline: "It's another great day to be great.",

  intro: `This report covers outreach activity for the first half of April 2026 across LinkedIn and email. Both channels remained active throughout the period. The LinkedIn Connector campaigns launched in February are now approaching full saturation, and the email channel continued scaling new contact volume while managing follow-up sequences across the existing pipeline.`,

  glance: [
    { label: 'LinkedIn Contacted', value: '1,993' },
    { label: 'Connections Built', value: '548' },
    { label: 'Acceptance Rate', value: '27.5%', coral: true },
    { label: 'LinkedIn Replies', value: '99' },
    { label: 'Emails Sent', value: '8,800' },
    { label: 'Email Replies', value: '87' },
  ],

  linkedin: {
    intro: `Both LinkedIn Connector campaigns activated on February 9 are now past 97% contact saturation. Combined, the two profiles have built 548 connections from 1,993 contacts reached, maintaining a strong 27.5% acceptance rate across the program.`,
    stats: [
      { label: 'Acceptance Rate', value: '27.5%', coral: true, note: 'combined across both profiles (548 of 1,993 contacted)' },
      { label: 'Total Replies', value: '99', note: 'across both profiles since campaign launch' },
      { label: 'Positive Sentiment', value: '31.3%', note: '31 of 99 replies flagged as positive engagement' },
      { label: 'Campaign Saturation', value: '97.4%', coral: true, note: 'less than 3% of loaded prospects remain uncontacted' },
    ],
    profiles: [
      { name: 'Kristina Muxo', contacted: 996, connected: 318, rate: '31.93%', replies: 59, positive: 19 },
      { name: 'John Noble',    contacted: 997, connected: 230, rate: '23.07%', replies: 40, positive: 12 },
    ],
    analysis: `Kristina Muxo continues to outperform on connection acceptance, holding 31.93% versus John Noble's 23.07%, a gap of nearly nine percentage points. This pattern has held consistently since launch, confirming that sender positioning remains a material driver of engagement quality. Both campaigns are now effectively exhausted, with 97%+ of loaded prospects contacted. Fresh prospect lists are needed to sustain LinkedIn activity at current volume.`,
  },

  email: {
    intro: `The email channel sent 8,800 messages in the first half of April, reaching 4,949 new contacts for the first time and delivering 3,871 follow-up touches to existing prospects.`,
    stats: [
      { label: 'Total Sent',      value: '8,800', note: '4,949 new contacts + 3,871 follow-up emails' },
      { label: 'New Contacts',    value: '4,949', note: 'prospects contacted for the first time this period' },
      { label: 'Follow-ups',     value: '3,871', coral: true, note: '44% of send volume consumed by sequence follow-ups' },
      { label: 'Replies',         value: '87',    note: 'leads who responded to outreach' },
      { label: 'Meetings Booked', value: '0',     note: 'no confirmed meetings during this period' },
    ],
    analysis: `The 87 replies represent active engagement across the pipeline, but none have converted to booked meetings during this period. Converting these conversations into confirmed calendar invites is the immediate priority for the second half of April. Reply handling speed and follow-up quality on responsive leads will be the primary levers for driving that conversion.`,
  },

  outlook: {
    intro: `Three priorities for the second half of April: convert existing replies into meetings, reload the LinkedIn pipeline, and optimize email send allocation.`,
    linkedin: `LinkedIn: Both Connector campaigns are effectively complete at 97%+ saturation. The next step is loading fresh prospect lists into both profiles to maintain connection volume. Kristina Muxo's consistently higher acceptance rate suggests prioritizing her profile for any high-value segments.`,
    email: `Email: The follow-up load will continue to grow as more prospects move through the eight-step sequences. To protect new-contact velocity, send scheduling may need to be rebalanced, either by increasing daily limits where deliverability allows or by trimming lower-performing sequence steps. The 87 replies generated this period represent the immediate conversion opportunity. Prioritizing direct engagement with responsive leads is the fastest path to booked meetings.`,
  },

  bottomLine: {
    rows: [
      { label: 'LinkedIn', value: '1,993 contacted  ·  548 connected ', coral: '27.5%', suffix: '  ·  99 replies  ·  campaigns at 97% saturation' },
      { label: 'Email',    value: '8,800 sent  ·  4,949 new contacts  ·  87 replies  ·  44% of volume is follow-ups' },
    ],
    closing: 'The pipeline is generating engagement. The next step is conversion.',
  },
};

// ─── LOGO (favicon-bold.svg embedded inline) ───

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
      <td>${p.contacted}</td>
      <td>${p.connected}</td>
      <td class="coral bold">${p.rate}</td>
      <td>${p.replies}</td>
      <td>${p.positive}</td>
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

  .no-break  { break-inside: avoid; page-break-inside: avoid; }
  h2.sh      { break-after: avoid;  page-break-after: avoid; }
  h3.subh    { break-after: avoid;  page-break-after: avoid; }

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

  .tagline {
    text-align: center;
    font-size: 10.5pt;
    font-style: italic;
    color: #bbb;
    margin: 4pt 0 14pt 0;
  }

  .intro { font-size: 11pt; color: #444; line-height: 1.65; margin: 0 0 16pt 0; }

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

  h3.subh {
    font-family: 'Poppins', sans-serif;
    font-size: 10.5pt;
    font-weight: 600;
    color: #1D1F28;
    margin: 14pt 0 6pt 0;
  }

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
    width: 130pt;
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

  .analysis {
    font-size: 11pt;
    color: #1D1F28;
    margin: 10pt 0 0 0;
    line-height: 1.65;
  }

  /* ── CALLOUT BOX ── */
  .callout {
    background: white;
    border-left: 3pt solid #FF5C5C;
    border-radius: 0 6pt 6pt 0;
    padding: 12pt 16pt;
    margin: 14pt 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .callout-title {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 700;
    color: #041122;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 6pt 0;
  }
  .callout-body {
    font-size: 10.5pt;
    color: #444;
    line-height: 1.6;
    margin: 0;
  }

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
      <h1 class="report-title">Outbound Program Performance Update</h1>
      <p class="report-meta">${data.client}  ·  ${data.endClient}  ·  ${data.period}</p>
      <p class="report-prepared">Prepared by ${data.preparedBy}</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">${data.tagline}</p>
  <p class="intro">${data.intro}</p>

  <!-- AT A GLANCE -->
  <div class="section-block">
    <h2 class="sh">April at a Glance</h2>
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
          <th>Contacted</th>
          <th>Connected</th>
          <th>Rate</th>
          <th>Replies</th>
          <th>Positive</th>
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
  </div>

  <!-- FOLLOW-UP CALLOUT -->
  <div class="callout">
    <p class="callout-title">Why new contact velocity has slowed</p>
    <p class="callout-body">The active email sequences contain up to eight steps per prospect. As the pipeline matures, follow-up emails accumulate and consume a growing share of daily sending limits. In this period, 44% of all sends (3,871 of 8,800) were follow-ups rather than first-touch outreach. This is expected behavior for multi-step sequences and reflects a pipeline that is deepening engagement with existing contacts while naturally throttling the rate at which new prospects enter the funnel.</p>
  </div>

  <p class="analysis">${data.email.analysis}</p>

  <!-- PRIORITIES -->
  <div class="section-block">
    <h2 class="sh">Priorities for the Second Half of April</h2>
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

  <div class="footer">MonteKristo AI  ·  montekristoai.com  ·  ${data.periodShort}</div>

</body>
</html>`;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function generateReport() {
  const outputPath = path.join(__dirname, '..', 'clients', 'reggierriley', 'reports', 'reggierriley-april-2026.pdf');
  const html = buildHTML(reportData);
  fs.writeFileSync(path.join(__dirname, 'report-preview.html'), html);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
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
