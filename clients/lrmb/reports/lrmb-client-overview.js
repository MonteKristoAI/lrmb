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

// ─── HTML ─────────────────────────────────────────────────────────────────────

function buildHTML() {
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
    margin: 0; padding: 0;
    font-family: 'Inter', sans-serif;
    font-size: 10.5pt;
    color: #1D1F28;
    line-height: 1.65;
    background: #FAF8F4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .no-break  { break-inside: avoid; page-break-inside: avoid; }
  h2.sh      { break-after: avoid; page-break-after: avoid; }
  h3.subh    { break-after: avoid; page-break-after: avoid; }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5pt solid #041122;
    padding-bottom: 14pt;
    margin-bottom: 10pt;
  }
  .report-title {
    font-family: 'Poppins', sans-serif;
    font-size: 22pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
    margin: 0 0 5pt 0;
  }
  .report-meta {
    font-size: 10.5pt;
    color: #777;
    margin: 0 0 3pt 0;
  }
  .report-prepared {
    font-size: 9.5pt;
    font-style: italic;
    color: #999;
    margin: 0;
  }
  .header-logo { width: 84pt; flex-shrink: 0; margin-left: 20pt; margin-top: 4pt; }

  /* ── TAGLINE ── */
  .tagline {
    text-align: center;
    font-size: 10pt;
    font-style: italic;
    color: #bbb;
    margin: 6pt 0 14pt 0;
  }

  /* ── SECTION HEADER ── */
  h2.sh {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 700;
    color: #041122;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 20pt 0 8pt 0;
    padding-bottom: 5pt;
    border-bottom: 1pt solid #ddd;
  }

  /* ── SUB-HEADER ── */
  h3.subh {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 600;
    color: #1D1F28;
    margin: 12pt 0 5pt 0;
  }

  /* ── BODY COPY ── */
  p.body { font-size: 10.5pt; color: #1D1F28; margin: 0 0 8pt 0; line-height: 1.65; }
  p.muted { font-size: 10pt; color: #666; font-style: italic; margin: 0 0 10pt 0; }

  /* ── INFO GRID (2-col) ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8pt 16pt;
    background: white;
    border: 1pt solid #e5e1db;
    border-radius: 6pt;
    padding: 12pt 14pt;
    margin-bottom: 12pt;
  }
  .info-item {}
  .info-label { font-size: 8pt; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2pt; }
  .info-value { font-size: 10.5pt; font-weight: 600; color: #041122; }

  /* ── STACK LIST ── */
  .stack-list { list-style: none; padding: 0; margin: 0 0 10pt 0; }
  .stack-list li {
    display: flex;
    align-items: baseline;
    gap: 8pt;
    padding: 5pt 0;
    border-bottom: 0.5pt solid #eee;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .stack-list li:last-child { border-bottom: none; }
  .stack-name { font-weight: 600; color: #041122; font-size: 10.5pt; min-width: 100pt; flex-shrink: 0; }
  .stack-desc { font-size: 10pt; color: #666; font-style: italic; }

  /* ── PROBLEM LIST ── */
  .problem-list { list-style: none; padding: 0; margin: 0 0 8pt 0; }
  .problem-list li {
    padding: 4pt 0 4pt 14pt;
    position: relative;
    font-size: 10.5pt;
    color: #1D1F28;
    border-bottom: 0.5pt solid #eee;
    break-inside: avoid;
  }
  .problem-list li:last-child { border-bottom: none; }
  .problem-list li::before { content: '•'; position: absolute; left: 0; color: #999; }

  /* ── WORKFLOW GRID ── */
  .workflow-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10pt;
    margin-bottom: 12pt;
  }
  .wf-card {
    background: white;
    border: 1pt solid #e5e1db;
    border-radius: 5pt;
    padding: 10pt 12pt;
    break-inside: avoid;
  }
  .wf-card-title {
    font-family: 'Poppins', sans-serif;
    font-size: 9.5pt;
    font-weight: 700;
    color: #041122;
    margin: 0 0 5pt 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .wf-card p { font-size: 9.5pt; color: #555; margin: 0; line-height: 1.5; }

  /* ── KPI TABLE ── */
  .kpi-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
    margin-bottom: 12pt;
  }
  .kpi-table th {
    font-size: 8pt;
    font-weight: 600;
    color: #aaa;
    text-align: left;
    padding: 4pt 8pt 4pt 0;
    border-bottom: 1pt solid #ddd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .kpi-table td {
    padding: 7pt 8pt 7pt 0;
    border-bottom: 0.5pt solid #eee;
    color: #1D1F28;
    vertical-align: top;
    break-inside: avoid;
  }
  .kpi-table tr { break-inside: avoid; page-break-inside: avoid; }
  .kpi-metric { font-weight: 600; color: #041122; }
  .kpi-target { font-weight: 700; color: #FF5C5C; }

  /* ── MODULE CARD ── */
  .module-card {
    background: white;
    border: 1pt solid #e5e1db;
    border-radius: 6pt;
    padding: 13pt 15pt;
    margin-bottom: 12pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 7pt;
    border-bottom: 1pt solid #eee;
    padding-bottom: 6pt;
  }
  .module-title {
    font-family: 'Poppins', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: #041122;
    margin: 0;
  }
  .module-badge {
    font-size: 8.5pt;
    font-style: italic;
    color: #999;
  }
  .module-body { font-size: 10pt; color: #555; line-height: 1.6; }
  .module-body strong { color: #041122; font-weight: 600; }

  .kpi-line {
    font-size: 9.5pt;
    color: #888;
    margin-top: 8pt;
    padding-top: 6pt;
    border-top: 0.5pt solid #eee;
  }
  .kpi-line span { color: #FF5C5C; font-weight: 700; }

  /* ── STRATEGY TABLE ── */
  .strategy-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
    margin-bottom: 12pt;
  }
  .strategy-table th {
    font-size: 8pt;
    font-weight: 600;
    color: #aaa;
    text-align: left;
    padding: 4pt 10pt 4pt 0;
    border-bottom: 1pt solid #ddd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .strategy-table td {
    padding: 8pt 10pt 8pt 0;
    border-bottom: 0.5pt solid #eee;
    color: #1D1F28;
    font-weight: 500;
  }
  .strategy-table tr { break-inside: avoid; }
  .strategy-module { font-family: 'Poppins', sans-serif; font-weight: 700; color: #041122; font-size: 10.5pt; }
  .tag {
    display: inline-block;
    font-size: 8pt;
    padding: 1pt 6pt;
    border-radius: 3pt;
    font-weight: 600;
  }
  .tag-med  { background: #fff3e0; color: #b45309; }
  .tag-low  { background: #e8f5e9; color: #2e7d32; }
  .tag-lowmed { background: #e3f2fd; color: #1565c0; }

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
    gap: 10pt;
    align-items: baseline;
    padding: 5pt 0;
    border-bottom: 0.5pt solid rgba(255,255,255,0.08);
    break-inside: avoid;
  }
  .bottom-row:last-of-type { border-bottom: none; }
  .bl-label {
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    font-size: 8.5pt;
    min-width: 70pt;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .bl-value { font-size: 10.5pt; font-weight: 500; color: rgba(255,255,255,0.88); }
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

  .coral { color: #FF5C5C; }
  .bold  { font-weight: 700; }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header no-break">
    <div>
      <h1 class="report-title">LRMB — Field Ops Module</h1>
      <p class="report-meta">Luxury Rentals Miami Beach  ·  Client Overview  ·  April 2026</p>
      <p class="report-prepared">Prepared by MonteKristo AI</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">Operational speed and payroll efficiency — the system enforces the behavior.</p>

  <!-- 1. CLIENT OVERVIEW -->
  <h2 class="sh">01 — Client Overview</h2>
  <div class="info-grid no-break">
    <div class="info-item">
      <div class="info-label">Company</div>
      <div class="info-value">Luxury Rentals Miami Beach (LRMB)</div>
    </div>
    <div class="info-item">
      <div class="info-label">Business</div>
      <div class="info-value">Luxury vacation rental management</div>
    </div>
    <div class="info-item">
      <div class="info-label">Department Focus</div>
      <div class="info-value">Property Management / Guest Relations</div>
    </div>
    <div class="info-item">
      <div class="info-label">Team Size</div>
      <div class="info-value">~15 field staff  ·  ~4 admins</div>
    </div>
  </div>
  <p class="body">Field staff perform inspections, maintenance follow-ups, housekeeping coordination, and guest issue handling. Operations are currently inefficient and payroll-heavy due to manual workflows and poor field system usability.</p>

  <!-- 2. CURRENT SYSTEM STACK -->
  <h2 class="sh">02 — Current System Stack</h2>
  <p class="muted">Primary PMS / CRM: TravelNet Solutions — Reservations · CRM · Channel management · Accounting · Owner statements · Work orders</p>
  <ul class="stack-list no-break">
    <li><span class="stack-name">Akia</span><span class="stack-desc">Guest messaging + contract sending</span></li>
    <li><span class="stack-name">PriceLabs</span><span class="stack-desc">Dynamic pricing automation</span></li>
    <li><span class="stack-name">KeyData</span><span class="stack-desc">Market analytics + pricing insights</span></li>
    <li><span class="stack-name">Excel / Spreadsheets</span><span class="stack-desc">Used heavily for task coordination and tracking</span></li>
  </ul>

  <!-- 3. CORE OPERATIONAL PROBLEM -->
  <h2 class="sh">03 — Core Operational Problem</h2>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10pt; margin-bottom:10pt;">
    <div>
      <h3 class="subh">Current Workflow Problems</h3>
      <ul class="problem-list">
        <li>Work orders require manual coordination</li>
        <li>Tasks tracked in Excel</li>
        <li>Field staff can't upload photos from mobile</li>
        <li>Updates entered after returning to office</li>
        <li>Multiple admins chase status updates</li>
        <li>Task closure is inconsistent and slow</li>
      </ul>
    </div>
    <div>
      <h3 class="subh">Operational Results</h3>
      <ul class="problem-list">
        <li>High admin workload</li>
        <li>Slow turnaround times</li>
        <li>Duplicate data entry</li>
        <li>Lack of operational visibility</li>
      </ul>
    </div>
  </div>

  <!-- 4. THE WEDGE MODULE -->
  <h2 class="sh">04 — The Wedge Module</h2>
  <div class="info-grid no-break">
    <div class="info-item">
      <div class="info-label">Module Name</div>
      <div class="info-value">Field Ops Warp-Speed Module</div>
    </div>
    <div class="info-item">
      <div class="info-label">Approach</div>
      <div class="info-value">Sits on top of TravelNet — does not replace it</div>
    </div>
  </div>
  <p class="body">Create a mobile-first task workflow layer that standardizes task intake, assignment, progress updates, and proof-of-completion. Field staff operate entirely from their phones — no office return required to log work.</p>

  <!-- 5. MINIMUM VIABLE WORKFLOW -->
  <h2 class="sh">05 — Minimum Viable Workflow</h2>
  <div class="workflow-grid">
    <div class="wf-card no-break">
      <p class="wf-card-title">Task Intake</p>
      <p>Sources: guest issue · inspection result · maintenance request · housekeeping issue · manager-created task<br><br>Captures: property · unit · task type · description · priority · assigned staff</p>
    </div>
    <div class="wf-card no-break">
      <p class="wf-card-title">Task Status Flow</p>
      <p>New → Assigned → In Progress → Blocked → Completed<br><br>Optional: Verified / Closed</p>
    </div>
    <div class="wf-card no-break">
      <p class="wf-card-title">Mobile Field Updates</p>
      <p>Open task from phone · upload photo · add note · mark status change<br><br>No laptop required.</p>
    </div>
    <div class="wf-card no-break">
      <p class="wf-card-title">Definition of Done</p>
      <p>Task cannot close unless: photo uploaded (when required) · timestamp recorded · notes entered</p>
    </div>
    <div class="wf-card no-break">
      <p class="wf-card-title">Notifications</p>
      <p>Auto-triggered on: task assigned · task overdue · task blocked · task completed<br><br>Goes to supervisor and admin — no spam.</p>
    </div>
    <div class="wf-card no-break">
      <p class="wf-card-title">Manager Visibility</p>
      <p>Open tasks · overdue tasks · tasks by property · tasks by staff member · average completion time</p>
    </div>
  </div>

  <!-- 6. PILOT SCOPE -->
  <h2 class="sh">06 — Pilot Deployment Scope</h2>
  <div class="info-grid no-break">
    <div class="info-item">
      <div class="info-label">Properties</div>
      <div class="info-value">10–20</div>
    </div>
    <div class="info-item">
      <div class="info-label">Field Staff</div>
      <div class="info-value">3–5</div>
    </div>
    <div class="info-item">
      <div class="info-label">Admin</div>
      <div class="info-value">1</div>
    </div>
    <div class="info-item">
      <div class="info-label">Duration</div>
      <div class="info-value">2–3 weeks</div>
    </div>
  </div>

  <!-- 7. KPIs -->
  <h2 class="sh">07 — KPIs We Want to Measure</h2>
  <table class="kpi-table">
    <thead>
      <tr>
        <th>Metric</th>
        <th>Baseline</th>
        <th>Target</th>
      </tr>
    </thead>
    <tbody>
      <tr class="no-break">
        <td class="kpi-metric">Work order cycle time (open → closed)</td>
        <td>Current</td>
        <td class="kpi-target">↓ 30–50%</td>
      </tr>
      <tr class="no-break">
        <td class="kpi-metric">Admin touches per task</td>
        <td>Current</td>
        <td class="kpi-target">↓ 40–60%</td>
      </tr>
      <tr class="no-break">
        <td class="kpi-metric">Field-to-office re-entry</td>
        <td>Current</td>
        <td class="kpi-target">Near zero</td>
      </tr>
      <tr class="no-break">
        <td class="kpi-metric">Tasks closed with photo proof</td>
        <td>—</td>
        <td class="kpi-target">90%+</td>
      </tr>
      <tr class="no-break">
        <td class="kpi-metric">Repeat task rate</td>
        <td>Current</td>
        <td class="kpi-target">↓ 20–40%</td>
      </tr>
    </tbody>
  </table>

  <!-- 8. TECHNICAL PREFERENCE -->
  <h2 class="sh">08 — Technical Preference</h2>
  <ul class="stack-list no-break">
    <li><span class="stack-name">Workflow / Database</span><span class="stack-desc">Airtable or similar</span></li>
    <li><span class="stack-name">Mobile Form Layer</span><span class="stack-desc">Jotform / Typeform / GHL forms</span></li>
    <li><span class="stack-name">Automation</span><span class="stack-desc">n8n / Make / GHL workflows</span></li>
    <li><span class="stack-name">Notifications</span><span class="stack-desc">Slack / SMS / Email</span></li>
  </ul>

  <!-- 9. DELIVERABLES -->
  <h2 class="sh">09 — Deliverables for Saturday</h2>
  <ul class="problem-list no-break">
    <li>Workflow architecture diagram</li>
    <li>Recommended tool stack</li>
    <li>Implementation timeline</li>
    <li>Internal cost estimate</li>
    <li>Client pricing recommendation</li>
    <li>Pilot rollout plan</li>
  </ul>

  <!-- MODULE BREAKDOWN -->
  <h2 class="sh">10 — Module Breakdown</h2>

  <div class="module-card">
    <div class="module-header">
      <p class="module-title">1. Maintenance / Work Order Management</p>
      <span class="module-badge">Most operational leverage · Difficulty: Medium</span>
    </div>
    <div class="module-body">
      <p style="margin:0 0 6pt 0;font-size:10pt;color:#666;">Covers: broken appliances · AC issues · guest complaints · damage reports · vendor coordination · repair follow-ups</p>
      <strong>Task Intake Layer</strong> — Manager/admin submits issue; property + unit auto-tagged; priority assigned<br>
      <strong>Auto Assignment</strong> — Routed to correct technician/vendor with escalation rules if not accepted<br>
      <strong>Mobile Field Interface</strong> — View task · upload photos · add notes · change status · mark complete<br>
      <strong>Status Flow</strong> — New → Assigned → In Progress → Waiting Parts → Completed → Verified<br>
      <strong>Definition of Done</strong> — Photo uploaded · note entered · timestamp recorded<br>
      <strong>Manager Dashboard</strong> — Open work orders · overdue · technician workload · avg completion time + visual comparison vs previous period
    </div>
    <p class="kpi-line">KPI Impact: Cycle time <span>↓ 30–50%</span>  ·  Admin touches <span>↓ 40–60%</span>  ·  Reopen rate <span>↓ 20–30%</span></p>
  </div>

  <div class="module-card">
    <div class="module-header">
      <p class="module-title">2. Housekeeping Coordination</p>
      <span class="module-badge">Easiest implementation · Difficulty: Low</span>
    </div>
    <div class="module-body">
      <p style="margin:0 0 6pt 0;font-size:10pt;color:#666;">Covers: cleaning schedules · turnover tasks · readiness confirmation</p>
      <strong>Auto Task Creation</strong> — Reservation ends → cleaning task auto-created with unit number, checklist, scheduled time<br>
      <strong>Mobile Cleaner Interface</strong> — Task on phone; check off items · upload final photo · mark unit ready<br>
      <strong>Status Flow</strong> — Scheduled → Cleaning → Ready → Verified<br>
      <strong>Admin Dashboard</strong> — Units ready · units pending · units delayed<br>
      <strong>Replaces</strong>: WhatsApp updates · phone calls · manual scheduling
    </div>
    <p class="kpi-line">KPI Impact: Turnover speed <span>↑ 20–30%</span>  ·  Cleaner coordination time <span>↓ 50%</span>  ·  Admin scheduling <span>↓ massively</span></p>
  </div>

  <div class="module-card">
    <div class="module-header">
      <p class="module-title">3. Inspection Reporting</p>
      <span class="module-badge">Best data foundation · Difficulty: Low–Medium</span>
    </div>
    <div class="module-body">
      <p style="margin:0 0 6pt 0;font-size:10pt;color:#666;">Covers: property inspections · damage documentation · compliance checks · guest readiness verification</p>
      <strong>Mobile Inspection Forms</strong> — Inspector opens checklist on phone (kitchen · bathrooms · appliances · furniture condition)<br>
      <strong>Required Evidence</strong> — Photos · notes · issue tags<br>
      <strong>Auto Issue Creation</strong> — Inspector flags problem → maintenance ticket auto-generated<br>
      <strong>Inspection Dashboard</strong> — Inspections completed · issues flagged · recurring property problems<br>
      <strong>Removes</strong>: inspection paperwork · missing documentation · reactive repairs
    </div>
    <p class="kpi-line">KPI Impact: Damage detection <span>↑ early</span>  ·  Guest complaints <span>↓</span>  ·  Maintenance predictability <span>↑</span></p>
  </div>

  <!-- STRATEGIC DIFFERENCE TABLE -->
  <h2 class="sh">Strategic Comparison</h2>
  <table class="strategy-table no-break">
    <thead>
      <tr>
        <th>Module</th>
        <th>Impact</th>
        <th>Complexity</th>
        <th>Speed to Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="strategy-module">Maintenance Work Orders</td>
        <td>Highest payroll impact</td>
        <td><span class="tag tag-med">Medium</span></td>
        <td>Medium</td>
      </tr>
      <tr>
        <td class="strategy-module">Housekeeping</td>
        <td>Fastest improvement</td>
        <td><span class="tag tag-low">Low</span></td>
        <td>Fast</td>
      </tr>
      <tr>
        <td class="strategy-module">Inspections</td>
        <td>Best data foundation</td>
        <td><span class="tag tag-lowmed">Low–Medium</span></td>
        <td>Medium</td>
      </tr>
    </tbody>
  </table>

  <!-- BOTTOM LINE -->
  <div class="bottom-section">
    <h2 class="sh">Positioning Reminder</h2>
    <div class="bottom-row">
      <span class="bl-label">What We Sell</span>
      <span class="bl-value">Operational speed and payroll efficiency — not AI tools</span>
    </div>
    <div class="bottom-row">
      <span class="bl-label">The System</span>
      <span class="bl-value">Enforces behavior · standardizes work · eliminates manual coordination</span>
    </div>
    <div class="bottom-row">
      <span class="bl-label">Wedge Entry</span>
      <span class="bl-value">Mobile-first task layer on top of TravelNet — three modules, measurable ROI from day one</span>
    </div>
    <p class="closing">The system enforces the behavior. Speed and efficiency follow.</p>
  </div>

  <div class="footer">MonteKristo AI  ·  montekristoai.com  ·  LRMB Client Overview  ·  April 2026</div>

</body>
</html>`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function generateReport() {
  const outputPath = path.join(__dirname, 'lrmb-client-overview.pdf');
  const html = buildHTML();

  const previewPath = path.join(__dirname, '..', '..', '..', 'reports-engine', 'report-preview.html');
  fs.writeFileSync(previewPath, html);

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
