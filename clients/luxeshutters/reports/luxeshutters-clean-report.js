const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const reportData = {
  title: 'LuxeShutters System Report',
  subtitle: 'Complete System Overview — April 2026',
  intro: 'This document covers all systems built, deployed, and configured for LuxeShutters from March 29 through April 7, 2026. It covers the website, CRM, AI voice agents, automation engine, accounting integration, and blog system.',

  glance: [
    { label: 'Workflows', value: '10', note: 'All active' },
    { label: 'Product Types', value: '17', note: 'Auto-priced' },
    { label: 'Pipeline Stages', value: '11', note: 'CRM pipeline' },
    { label: 'Blog Posts', value: '55', note: 'Planned' },
    { label: 'Keywords', value: '221', note: 'Researched' },
    { label: 'Images', value: '258', accent: true, note: 'WebP' },
  ],

  sections: [
    {
      title: 'Website',
      intro: 'Custom React + TypeScript website on Cloudflare Pages with full SEO infrastructure.',
      stats: [
        { label: 'Domain', value: 'luxeshutters.com.au', note: 'Cloudflare Pages, auto-deploy from GitHub' },
        { label: 'Stack', value: 'React + Vite + Tailwind', note: 'TypeScript, responsive, mobile-first' },
        { label: 'Migration', value: 'Lovable to CF', note: 'TTFB improved from 465ms to 160ms (65% faster)' },
        { label: 'Images', value: '258 WebP', accent: true, note: '83MB saved from JPG/PNG conversion' },
        { label: 'SEO', value: 'Full stack', note: 'Schema, OG tags, hreflang, canonical, geo meta' },
        { label: 'Security', value: 'Production', note: 'CSP, HSTS, X-Frame, Permissions-Policy' },
        { label: 'DNS', value: 'Cloudflare', note: 'Migrated from GoDaddy, MX/SPF/DKIM preserved' },
        { label: 'SSL', value: 'Full (strict)', note: 'Rocket Loader OFF, Early Hints ON' },
      ],
      analysis: 'The website was migrated from Lovable to Cloudflare Pages on April 4, achieving a 65% improvement in Time to First Byte. All 258 images were converted from JPG/PNG to WebP on April 7, reducing total image payload by approximately 83MB. SEO infrastructure includes structured data (LocalBusiness, GeoCoordinates, areaServed), hreflang en-AU, and six-city service area coverage.',
    },
    {
      title: 'CRM & Pipeline (GoHighLevel)',
      intro: 'Full CRM setup with automated lead capture, 11-stage pipeline, and 20 custom fields.',
      stats: [
        { label: 'Pipeline', value: '11 stages', note: 'New Enquiry through Completed/Lost' },
        { label: 'Contact Fields', value: '7 custom', note: 'Lead Source, Service Type, Timeframe, etc.' },
        { label: 'Opp. Fields', value: '13 custom', note: 'Product, measurements, pricing, Xero/Cora IDs' },
        { label: 'Lead Sources', value: '5 automated', note: 'Quote form, consultation, phone, chat, feedback' },
        { label: 'Webhooks', value: '3 active', accent: true, note: 'Quote Requested, Quote Sent, Won triggers' },
      ],
      analysis: 'Every lead source feeds directly into GoHighLevel with full contact details, service type, and AI-generated conversation summaries. The 11-stage pipeline tracks every job from initial enquiry through to completion. Three stage transitions (Quote Requested, Quote Sent, Won) trigger automated workflows via n8n webhooks. All verified working via end-to-end testing on April 4.',
    },
    {
      title: 'AI Voice Agents (Retell AI)',
      intro: 'Two AI agents handle inbound calls and website chat, qualifying leads around the clock.',
      stats: [
        { label: 'Phone Agent', value: 'Active', note: 'Qualifies inbound calls, captures lead details, en-AU voice' },
        { label: 'Web Widget', value: 'Max', note: 'Chat widget on every page, captures leads from visitors' },
        { label: 'Processing', value: 'Automatic', note: 'Both agents send leads to GHL via n8n workflows' },
        { label: 'Post-Call', value: '16 fields', note: 'Name, email, phone, suburb, postcode, product, timeframe, etc.' },
        { label: 'AU Number', value: 'Pending', note: 'Twilio account created, number import to Retell needed' },
      ],
      analysis: 'The phone agent qualifies callers and captures 16 structured data fields via post-call analysis. Max, the web chat widget, appears on every page and performs the same qualification. Both agents route leads to GHL via dedicated n8n workflows. Australian phone number connection is pending Twilio-to-Retell import.',
    },
    {
      title: 'Automation Engine (10 n8n Workflows)',
      intro: 'Ten production workflows handle lead intake, quoting, follow-up, and supplier ordering.',
      stats: [
        { label: 'Lead Intake', value: '5 workflows', note: 'Quote form, consultation, phone, widget, feedback' },
        { label: 'Quote System', value: '3 workflows', note: 'Generator + Follow-up + Sale Won' },
        { label: 'Xero Auth', value: '2 workflows', note: 'OAuth setup + Token Manager (auto-rotate)' },
        { label: 'Auto-Pricing', value: '17 products', accent: true, note: 'Exact CWGlobal price list lookups' },
        { label: 'Follow-up', value: '3-step', note: 'Day 3 email, Day 6 SMS, Day 11 call task' },
        { label: 'Testing', value: 'Full E2E', note: 'All 10 workflows tested Apr 4 with real data' },
      ],
      analysis: 'The Quote Generator auto-calculates cost prices for 17 product types using exact CWGlobal price list lookup tables (e.g., Bayview Basswood = $240/m², Forte Select = $184/m², Oasis default = $202/m²). It applies the markup percentage and creates a Xero draft quote with per-window line items. The Follow-up workflow sends a three-step sequence. The Sale Won workflow creates a Xero invoice, submits a Cora supplier order, and creates an installation task.',
    },
    {
      title: 'Xero & Cora Integration',
      intro: 'Automated accounting (quotes and invoices) plus supplier ordering. Connected and tested.',
      stats: [
        { label: 'Xero OAuth', value: 'Connected', accent: true, note: 'Active, tokens auto-rotating' },
        { label: 'Xero Quotes', value: 'Auto-generated', note: 'Multi-window, per-item pricing, draft status' },
        { label: 'Xero Invoices', value: 'Auto-generated', note: 'Created when opportunity moves to Won' },
        { label: 'Cora Orders', value: '4 product types', note: 'Shutters, Roller Blinds, Curtains, Awnings' },
      ],
      analysis: 'Xero OAuth is connected and operational with auto-rotating tokens. Quotes are generated as drafts with per-window line items including product name, dimensions, mount type, and area calculation. Invoices are created automatically from accepted quotes. Cora supplier orders are submitted for Shutters (49/231/59), Roller Blinds (71/352/61), Curtains (73/379/71), and Awnings (38/312/45). Zipscreens and Security Roller Shutters require manual ordering.',
    },
    {
      title: 'Blog System',
      intro: 'Complete blog infrastructure built from scratch with SEO strategy, keyword database, and static HTML platform.',
      stats: [
        { label: 'Architecture', value: 'Static HTML', note: 'Separate repo, CF Worker proxy at /blog/' },
        { label: 'Strategy', value: '4 critic levels', note: 'Iterated through L1, L10, L100, L1000 reviews' },
        { label: 'Keywords', value: '221 researched', note: '17 clusters with volume estimates' },
        { label: 'Posts Planned', value: '55 total', accent: true, note: '8 in Phase 1, all Tier A' },
        { label: 'System Files', value: '9 files', note: 'Strategy, style, content, keywords, brand, etc.' },
        { label: 'Competitors', value: '0 blogs', note: 'No Riverina competitor has blog content' },
        { label: 'Skill', value: 'blog-onboard', note: 'Reusable skill created, self-improving' },
      ],
      analysis: 'The blog strategy was developed through four iterative critic levels. The final architecture uses static HTML served at luxeshutters.com.au/blog/ via Cloudflare Workers reverse proxy (subfolder, not subdomain). Phase 1 focuses on 8 Tier A posts with mandatory template variation across 4 formats. Zero competitors in the Riverina have blog content, providing a significant first-mover advantage. Cloudflare Worker deployment is pending.',
    },
  ],

  pricing_example: {
    title: 'Auto-Pricing Example: Bayview Basswood Shutters',
    intro: 'Example quote calculation for 4 windows, Inside mount, "Bayview Basswood" colour preference, 40% markup.',
    windows: [
      { num: 1, w: 1200, h: 1500, sqm: 1.80, cost: 432.00 },
      { num: 2, w: 900, h: 1200, sqm: 1.08, cost: 259.20 },
      { num: 3, w: 1400, h: 1800, sqm: 2.52, cost: 604.80 },
      { num: 4, w: 1000, h: 1400, sqm: 1.40, cost: 336.00 },
    ],
    rate: 240,
    product: 'Bayview (Knoxcote solid paint)',
    totalSqm: 6.80,
    totalCost: 1632.00,
    markup: 40,
    consumerPrice: 2284.80,
    note: '"Bayview Basswood" matches Bayview default ($240/m²). To get Basswood Stained ($276/m²), enter "Bayview Basswood Stained".',
  },

  pending: [
    { item: 'Blog CF Worker deployment', note: '4 clicks in Cloudflare dashboard' },
    { item: 'Twilio → Retell phone import', note: 'Need Account SID + Auth Token from Chris' },
    { item: 'GA4 property', note: 'Create property, add ID to blog templates' },
    { item: 'GSC blog sitemap', note: 'Submit after blog Worker is deployed' },
  ],
};

// ─── HTML ───

function buildHTML(data) {
  const glanceCards = data.glance.map(g => `
    <div class="glance-card">
      <div class="glance-value${g.accent ? ' accent' : ''}">${g.value}</div>
      <div class="glance-label">${g.label}</div>
      <div class="glance-note">${g.note || ''}</div>
    </div>`).join('');

  const sectionsHTML = data.sections.map(s => {
    const stats = s.stats.map(st => `
      <div class="stat-row">
        <span class="stat-label">${st.label}</span>
        <span class="stat-value${st.accent ? ' accent' : ''}">${st.value}</span>
        <span class="stat-note">${st.note}</span>
      </div>`).join('');
    return `
    <div class="section-block">
      <h2 class="sh">${s.title}</h2>
      <p class="body" style="margin-top:0; margin-bottom:8pt;">${s.intro}</p>
      <div class="no-break">${stats}</div>
      <p class="body">${s.analysis}</p>
    </div>`;
  }).join('');

  const pe = data.pricing_example;
  const windowRows = pe.windows.map(w => `
    <tr>
      <td>${w.num}</td>
      <td>${w.w}x${w.h}mm</td>
      <td>${w.sqm.toFixed(2)} m²</td>
      <td>$${w.cost.toFixed(2)}</td>
    </tr>`).join('');

  const pendingHTML = data.pending.map(p => `
    <div class="stat-row">
      <span class="stat-label" style="width:180pt;">${p.item}</span>
      <span class="stat-note">${p.note}</span>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 16mm 20mm 18mm 20mm; background: #ffffff; }
  html, body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; font-size: 10.5pt; color: #1a2332; line-height: 1.6; background: #fff; }
  .no-break { break-inside: avoid; page-break-inside: avoid; }
  h2.sh { break-after: avoid; page-break-after: avoid; }

  /* Header */
  .header { border-bottom: 2pt solid #1E5AA8; padding-bottom: 14pt; margin-bottom: 14pt; }
  .report-title { font-size: 22pt; font-weight: 700; color: #1a2332; line-height: 1.2; margin: 0 0 4pt 0; }
  .report-subtitle { font-size: 11pt; color: #6b7d8e; margin: 0; }

  .body { font-size: 10.5pt; color: #333; line-height: 1.65; margin: 8pt 0; }

  /* Section headers */
  h2.sh { font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 700; color: #1E5AA8; text-transform: uppercase; letter-spacing: 0.06em; margin: 22pt 0 8pt 0; padding-bottom: 5pt; border-bottom: 1pt solid #e2e8f0; }

  /* Glance grid */
  .glance-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8pt; background: #f8fafc; border-radius: 6pt; padding: 14pt 12pt; border: 1pt solid #e2e8f0; margin-bottom: 14pt; }
  .glance-card { text-align: center; }
  .glance-value { font-size: 18pt; font-weight: 700; color: #1a2332; line-height: 1.2; }
  .glance-label { font-size: 7.5pt; color: #6b7d8e; margin-top: 2pt; line-height: 1.35; text-transform: uppercase; letter-spacing: 0.03em; }
  .glance-note { font-size: 6.5pt; color: #94a3b8; margin-top: 1pt; }

  /* Stat rows */
  .stat-row { display: flex; align-items: baseline; padding: 6pt 0; border-bottom: 0.5pt solid #f1f5f9; break-inside: avoid; page-break-inside: avoid; }
  .stat-row:last-child { border-bottom: none; }
  .stat-label { font-size: 9.5pt; color: #6b7d8e; width: 100pt; flex-shrink: 0; }
  .stat-value { font-size: 11pt; font-weight: 600; color: #1a2332; width: 110pt; flex-shrink: 0; }
  .stat-note { font-size: 9.5pt; color: #94a3b8; font-style: italic; }

  /* Pricing table */
  .pricing-table { width: 100%; border-collapse: collapse; font-size: 10pt; margin: 8pt 0; }
  .pricing-table th { background: #1E5AA8; color: #fff; font-weight: 600; text-align: left; padding: 6pt 10pt; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.04em; }
  .pricing-table th:first-child { border-radius: 4pt 0 0 0; }
  .pricing-table th:last-child { border-radius: 0 4pt 0 0; }
  .pricing-table td { padding: 6pt 10pt; border-bottom: 0.5pt solid #f1f5f9; color: #1a2332; }
  .pricing-table tr:hover { background: #f8fafc; }
  .pricing-total td { font-weight: 700; border-top: 1.5pt solid #1E5AA8; background: #f8fafc; }

  /* Bottom section */
  .bottom-section { background: #1a2332; border-radius: 6pt; padding: 14pt 16pt; margin-top: 18pt; break-inside: avoid; page-break-inside: avoid; }
  .bottom-section h2.sh { color: #fff; border-bottom-color: rgba(255,255,255,0.12); margin-top: 0; }
  .bottom-row { display: flex; gap: 12pt; align-items: baseline; padding: 4pt 0; border-bottom: 0.5pt solid rgba(255,255,255,0.06); break-inside: avoid; }
  .bottom-row:last-of-type { border-bottom: none; }
  .bl-label { font-weight: 600; color: rgba(255,255,255,0.45); font-size: 8.5pt; width: 72pt; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.04em; }
  .bl-value { font-size: 10pt; font-weight: 500; color: rgba(255,255,255,0.85); }

  .footer { text-align: center; font-size: 7.5pt; color: #94a3b8; margin-top: 12pt; padding-top: 8pt; border-top: 0.5pt solid #e2e8f0; }
  .accent { color: #1E5AA8; }
  .bold { font-weight: 700; }
  .note-box { background: #f8fafc; border-left: 3pt solid #1E5AA8; padding: 8pt 12pt; font-size: 9.5pt; color: #6b7d8e; margin: 8pt 0; border-radius: 0 4pt 4pt 0; }
</style>
</head>
<body>

<div class="header no-break">
  <h1 class="report-title">${data.title}</h1>
  <p class="report-subtitle">${data.subtitle}</p>
</div>

<p class="body">${data.intro}</p>

<div class="section-block">
  <h2 class="sh">System at a Glance</h2>
  <div class="glance-grid no-break">${glanceCards}</div>
</div>

${sectionsHTML}

<div class="section-block">
  <h2 class="sh">${pe.title}</h2>
  <p class="body" style="margin-top:0;">${pe.intro}</p>
  <div class="note-box">Rate: <strong>$${pe.rate}/m²</strong> (${pe.product}). Minimum 1m² per item.</div>
  <table class="pricing-table no-break">
    <thead><tr><th>Window</th><th>Dimensions</th><th>Area</th><th>Cost Price</th></tr></thead>
    <tbody>
      ${windowRows}
      <tr class="pricing-total">
        <td>Total</td>
        <td>4 windows</td>
        <td>${pe.totalSqm.toFixed(2)} m²</td>
        <td>$${pe.totalCost.toFixed(2)}</td>
      </tr>
      <tr class="pricing-total">
        <td colspan="3">Consumer Price (${pe.markup}% markup)</td>
        <td class="accent bold">$${pe.consumerPrice.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
  <div class="note-box">${pe.note}</div>
</div>

<div class="section-block">
  <h2 class="sh">Remaining Items</h2>
  <div class="no-break">${pendingHTML}</div>
</div>

<div class="bottom-section">
  <h2 class="sh">Summary</h2>
  <div class="bottom-row"><span class="bl-label">Website</span><span class="bl-value">Live on Cloudflare Pages, 258 WebP images, full SEO</span></div>
  <div class="bottom-row"><span class="bl-label">CRM</span><span class="bl-value">11-stage pipeline, 5 automated lead sources, 20 custom fields</span></div>
  <div class="bottom-row"><span class="bl-label">AI Agents</span><span class="bl-value">Phone + web chat active, auto-qualify leads</span></div>
  <div class="bottom-row"><span class="bl-label">Automation</span><span class="bl-value">10 workflows, 17 auto-priced products, Xero + Cora connected</span></div>
  <div class="bottom-row"><span class="bl-label">Blog</span><span class="bl-value">55 posts planned, 221 keywords, static HTML platform built</span></div>
</div>

<div class="footer">LuxeShutters System Report &middot; April 2026</div>

</body>
</html>`;
}

async function generateReport() {
  const outputPath = path.join(__dirname, 'luxeshutters-clean-report.pdf');
  const previewPath = path.join(__dirname, 'clean-report-preview.html');
  const html = buildHTML(reportData);
  fs.writeFileSync(previewPath, html);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pagedjs_pages', { timeout: 15000 });
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  console.log(`PDF → ${outputPath}`);
}

generateReport().catch(console.error);
