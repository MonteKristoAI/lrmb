const puppeteer = require(require('path').join(__dirname, '..', '..', '..', 'reports-engine', 'node_modules', 'puppeteer'));
const fs = require('fs');
const path = require('path');

// ─── REPORT DATA ────────────────────────────────────────────────────────────

const reportData = {
  client: 'AiiAco',
  endClient: 'Nemr Hallak',
  period: 'April 2026',
  preparedBy: 'MonteKristo AI',
  tagline: 'Full SEO Audit - Technical, Content, Schema, Performance, AI Search Readiness',

  intro: 'This report covers a comprehensive SEO audit of aiiaco.com conducted in April 2026. The audit analyzed all 41 pages across five categories: technical SEO, content quality, schema/structured data, Core Web Vitals performance, and AI search readiness (GEO). The site is built on Manus AI, a proprietary website builder, and runs behind Cloudflare CDN.',

  glance: [
    { label: 'Overall Score', value: '41/100' },
    { label: 'Technical SEO', value: '45/100' },
    { label: 'Content Quality', value: '35/100', coral: true },
    { label: 'Schema Coverage', value: '55/100' },
    { label: 'Performance', value: '30/100', coral: true },
    { label: 'AI Readiness', value: '62/100' },
  ],

  technical: {
    intro: 'The site has solid DNS and CDN infrastructure behind Cloudflare, with a well-configured robots.txt that includes AI crawler guidance. However, critical issues with canonical tags, soft 404 pages, and client-side rendering threaten indexability.',
    stats: [
      { label: 'Canonical Tags', value: 'CRITICAL', coral: true, note: 'Every page has TWO canonical tags - one always pointing to www.aiiaco.com homepage. Google cannot determine the correct canonical.' },
      { label: 'Soft 404 Pages', value: '6 pages', coral: true, note: '/ai-infrastructure, /ai-crm-integration, /ai-workflow-automation, /ai-revenue-engine, /ai-for-real-estate, /ai-for-vacation-rentals return HTTP 200 with empty content' },
      { label: 'Rendering', value: 'CSR Only', coral: true, note: 'React SPA with <div id="root"> - all content rendered client-side. Crawlers without JS execution see empty page.' },
      { label: 'Title Tags', value: 'Duplicate', note: 'Same title "AiiAco | AI Integration Authority..." appears in raw HTML for every page before JS renders' },
      { label: 'robots.txt', value: 'Good', note: 'Properly configured with sitemap reference, blocks /admin. Includes llms.txt and about.txt references.' },
      { label: 'Sitemap', value: 'Present', note: 'sitemap.xml exists with proper URLs, changefreq, and priority values' },
      { label: 'HSTS', value: 'Active', note: 'max-age=31536000 with includeSubDomains' },
      { label: 'llms.txt', value: 'Present', note: 'Comprehensive company description for AI crawlers - ahead of 90% of competitors' },
    ],
  },

  content: {
    intro: 'Content volume is the biggest weakness. 18 of 21 analyzed pages fall below minimum word count thresholds. All 20+ industry vertical pages use an identical 5-section template with 330-430 words each, which Google may classify as thin or templated content.',
    stats: [
      { label: 'Thin Pages', value: '18/21', coral: true, note: '86% of pages below minimum content thresholds' },
      { label: 'Homepage', value: '820 words', note: 'Only page with adequate depth (minimum: 500)' },
      { label: 'Industry Pages', value: '330-430 words', coral: true, note: 'All 20+ verticals use identical 5-section template - well below 800 word minimum' },
      { label: '/method', value: '295 words', coral: true, note: 'Core methodology page has less content than the minimum' },
      { label: '/results', value: '239 words', coral: true, note: 'Weakest content page - no verifiable case studies' },
      { label: '/ai-integration', value: '560 words', note: 'Best service page but still below 800 minimum' },
      { label: 'AI Tells Found', value: '3 pages', note: '"streamline" on /method and /oil-gas, "systematize" on /crypto' },
      { label: 'Template Pattern', value: 'Detected', coral: true, note: 'All industry pages share identical structure: header, 4 stats, 4 problems, 4 systems, CTA' },
    ],
  },

  schema: {
    intro: 'The homepage has above-average schema implementation with Organization, WebSite, and ProfessionalService blocks. However, the remaining 40 pages have zero structured data. BreadcrumbList is missing site-wide.',
    stats: [
      { label: 'Homepage', value: '3 blocks', note: 'Organization, WebSite, ProfessionalService - solid foundation with @id linking' },
      { label: 'All Other Pages', value: '0 blocks', coral: true, note: '40 pages with zero schema markup' },
      { label: 'BreadcrumbList', value: 'Missing', coral: true, note: 'Not present on any page - Google has no hierarchy signal' },
      { label: 'FAQPage', value: 'Missing', coral: true, note: 'FAQ content exists on 3 pages but no FAQPage schema' },
      { label: 'Service Schema', value: 'Missing', note: 'No Service markup on any service or industry page' },
      { label: 'SearchAction', value: 'Missing', note: 'WebSite block lacks Sitelinks Searchbox eligibility' },
      { label: 'contactType', value: 'Minor Fix', note: '"Business Inquiry" should be "sales" per schema.org vocabulary' },
    ],
  },

  performance: {
    intro: 'Core Web Vitals are critically poor, primarily caused by the Manus AI platform delivering a 735KB JavaScript bundle that must execute before any content renders. Mobile performance is especially bad.',
    stats: [
      { label: 'Mobile Score', value: '38/100', coral: true, note: 'Homepage Lighthouse performance - far below 90+ target' },
      { label: 'Desktop Score', value: '59/100', coral: true, note: 'Homepage Lighthouse performance' },
      { label: 'LCP (Mobile)', value: '12.6s', coral: true, note: 'Target is under 2.5 seconds - current is 5x over threshold' },
      { label: 'LCP (Desktop)', value: '9.0s', coral: true, note: 'Still 3.6x over the 2.5s target' },
      { label: 'FCP', value: '4.5s', coral: true, note: 'First paint at 4.5 seconds - target is under 1.8s' },
      { label: 'TBT (Mobile)', value: '930ms', coral: true, note: 'Total Blocking Time - target is under 200ms' },
      { label: 'CLS', value: '0', note: 'No layout shift detected - the one bright spot' },
      { label: 'JS Bundle', value: '735KB', note: 'Manus AI runtime - single blocking JavaScript file from CloudFront S3' },
    ],
  },

  geo: {
    intro: 'AiiAco shows proactive AI search readiness with llms.txt and about.txt files, but critical execution gaps prevent actual citations. FAQ answers are hidden behind JavaScript, statistics lack source attribution, and there is no blog content for AI systems to cite.',
    stats: [
      { label: 'GEO Score', value: '62/100', note: 'Functional foundation with significant citability gaps' },
      { label: 'Google AI Overview', value: '45/100', coral: true, note: 'CSR blocking, no FAQPage schema, no blog content' },
      { label: 'ChatGPT', value: '40/100', coral: true, note: 'No external brand corpus, FAQ answers not crawlable' },
      { label: 'Perplexity', value: '55/100', note: 'llms.txt presence helps, but statistics lack source attribution' },
      { label: 'Bing Copilot', value: '50/100', note: 'Schema foundation helps, but low external authority' },
      { label: 'FAQ Visibility', value: 'Blocked', coral: true, note: 'FAQ answers in JS accordions - crawlers see questions but NOT answers' },
      { label: 'Statistics', value: 'Unsourced', coral: true, note: '68% cycle time, 3x capacity - no client name, timeframe, or third-party verification' },
      { label: 'External Presence', value: 'Near Zero', coral: true, note: 'No Wikipedia, Crunchbase, Reddit, or YouTube presence' },
    ],
  },

  actionPlan: [
    { priority: 'CRITICAL', fix: 'Remove duplicate canonical tag (www variant on line 38)', effort: 'Low', impact: 'Every page affected - Google indexing confusion' },
    { priority: 'CRITICAL', fix: 'Fix 6 soft 404 pages - add noindex or build content', effort: 'Medium', impact: 'Crawl budget waste, authority dilution' },
    { priority: 'CRITICAL', fix: 'Make FAQ answers visible in static HTML (CSS not JS)', effort: 'Low', impact: 'Unlocks AI Overview for all target queries' },
    { priority: 'HIGH', fix: 'Expand thin content on 18 pages (800+ words each)', effort: 'High', impact: '86% of pages below quality threshold' },
    { priority: 'HIGH', fix: 'Add schema markup to all 40 interior pages', effort: 'Medium', impact: 'Zero structured data on 97% of site' },
    { priority: 'HIGH', fix: 'Build 6 core service pages (2000+ words each)', effort: 'High', impact: 'Foundation for keyword rankings and internal linking' },
    { priority: 'HIGH', fix: 'Launch blog.aiiaco.com with first 8 articles', effort: 'Medium', impact: 'Only way to get article-type AI citations' },
    { priority: 'MEDIUM', fix: 'Add FAQPage schema to pages with FAQ content', effort: 'Low', impact: 'Rich result eligibility for target queries' },
    { priority: 'MEDIUM', fix: 'Investigate SSR or prerendering for Manus pages', effort: 'High', impact: 'LCP from 12.6s toward 2.5s target' },
    { priority: 'MEDIUM', fix: 'Create Crunchbase listing + Wikidata entity', effort: 'Low', impact: 'External entity presence for AI citation systems' },
  ],

  bottomLine: {
    rows: [
      { label: 'Technical', value: '45/100 - Dual canonicals and soft 404s are critical blockers' },
      { label: 'Content', value: '35/100 - 18/21 pages are thin, industry pages are templated' },
      { label: 'Schema', value: '55/100 - Homepage solid, 40 other pages have zero markup' },
      { label: 'Performance', value: '30/100 - LCP 12.6s mobile, 735KB JS bundle from Manus' },
      { label: 'AI Readiness', value: '62/100 - llms.txt is ahead of curve, FAQ answers blocked by JS' },
    ],
    closing: 'Score: 41/100. Fix the three critical issues first. Build the six service pages. Launch the blog. These moves will shift the score above 70 within 60 days.',
  },
};

// ─── LOGO ───────────────────────────────────────────────────────────────────

const svgLogoPath = path.join(__dirname, '..', '..', '..', 'Logo', 'favicon-bold.svg');
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

  function renderStats(stats) {
    return stats.map(s => `
      <div class="stat-row">
        <span class="stat-label">${s.label}</span>
        <span class="stat-value${s.coral ? ' coral' : ''}">${s.value}</span>
        <span class="stat-note">${s.note}</span>
      </div>`).join('');
  }

  const actionRows = data.actionPlan.map(a => `
    <tr>
      <td class="td-priority ${a.priority.toLowerCase()}">${a.priority}</td>
      <td>${a.fix}</td>
      <td>${a.effort}</td>
      <td>${a.impact}</td>
    </tr>`).join('');

  const bottomRows = data.bottomLine.rows.map(r => `
    <div class="bottom-row">
      <span class="bl-label">${r.label}</span>
      <span class="bl-value">${r.value}</span>
    </div>`).join('');

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
    font-size: 10pt;
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
    font-size: 20pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
    margin: 0 0 6pt 0;
  }
  .report-meta {
    font-size: 10pt;
    color: #777;
    margin: 0 0 3pt 0;
  }
  .report-prepared {
    font-size: 9pt;
    font-style: italic;
    color: #999;
    margin: 0;
  }
  .header-logo { width: 80pt; flex-shrink: 0; margin-left: 20pt; margin-top: 2pt; }

  .tagline {
    text-align: center;
    font-size: 9.5pt;
    font-style: italic;
    color: #bbb;
    margin: 4pt 0 14pt 0;
  }

  .intro { font-size: 10pt; color: #444; line-height: 1.65; margin: 0 0 16pt 0; }

  h2.sh {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 700;
    color: #041122;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 18pt 0 8pt 0;
    padding-bottom: 5pt;
    border-bottom: 1pt solid #ddd;
  }

  h3.subh {
    font-family: 'Poppins', sans-serif;
    font-size: 10pt;
    font-weight: 600;
    color: #1D1F28;
    margin: 12pt 0 6pt 0;
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
    font-size: 14pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
  }
  .glance-label {
    font-size: 7pt;
    color: #999;
    margin-top: 3pt;
    line-height: 1.35;
  }

  .stat-row {
    display: flex;
    align-items: baseline;
    gap: 0;
    padding: 5pt 0;
    border-bottom: 0.5pt solid #eee;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-label {
    font-size: 9pt;
    color: #888;
    width: 110pt;
    flex-shrink: 0;
  }
  .stat-value {
    font-size: 10pt;
    font-weight: 600;
    color: #041122;
    width: 70pt;
    flex-shrink: 0;
  }
  .stat-note {
    font-size: 8.5pt;
    color: #999;
    font-style: italic;
  }

  .coral { color: #FF5C5C !important; }
  .bold  { font-weight: 700; }

  /* Action Plan Table */
  .action-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    margin-top: 4pt;
  }
  .action-table th {
    font-size: 7pt;
    font-weight: 500;
    color: #aaa;
    text-align: left;
    padding: 4pt 6pt 4pt 0;
    border-bottom: 1pt solid #ddd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .action-table td {
    padding: 5pt 6pt 5pt 0;
    border-bottom: 0.5pt solid #eee;
    color: #1D1F28;
    vertical-align: top;
    line-height: 1.45;
  }
  .td-priority {
    font-weight: 700;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    white-space: nowrap;
    width: 60pt;
  }
  .td-priority.critical { color: #FF5C5C; }
  .td-priority.high { color: #E6A817; }
  .td-priority.medium { color: #4A90D9; }

  .analysis { font-size: 9.5pt; color: #555; line-height: 1.6; margin: 8pt 0 0 0; }

  /* Bottom Line */
  .bottom-section {
    background: #041122;
    border-radius: 6pt;
    padding: 14pt 16pt;
    margin-top: 18pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .bottom-row {
    display: flex;
    align-items: baseline;
    gap: 0;
    padding: 4pt 0;
    border-bottom: 0.5pt solid rgba(255,255,255,0.12);
  }
  .bottom-row:last-child { border-bottom: none; }
  .bl-label {
    font-size: 9pt;
    color: rgba(255,255,255,0.5);
    width: 90pt;
    flex-shrink: 0;
  }
  .bl-value {
    font-size: 9pt;
    color: rgba(255,255,255,0.85);
  }
  .bottom-closing {
    text-align: center;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 10pt;
    color: #FAF8F4;
    margin-top: 12pt;
    padding-top: 8pt;
    border-top: 0.5pt solid rgba(255,255,255,0.2);
  }

  .footer {
    text-align: center;
    font-size: 7.5pt;
    color: #bbb;
    margin-top: 18pt;
    padding-top: 8pt;
    border-top: 0.5pt solid #e5e1db;
  }
</style>
</head>
<body>

  <div class="header">
    <div>
      <h1 class="report-title">SEO Audit Report</h1>
      <p class="report-meta">${data.client} - ${data.endClient} - ${data.period}</p>
      <p class="report-prepared">Prepared by ${data.preparedBy}</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">${data.tagline}</p>
  <p class="intro">${data.intro}</p>

  <h2 class="sh">SEO Health at a Glance</h2>
  <div class="glance-grid no-break">${glanceCards}</div>

  <h2 class="sh">1. Technical SEO</h2>
  <p class="analysis">${data.technical.intro}</p>
  ${renderStats(data.technical.stats)}

  <h2 class="sh">2. Content Quality</h2>
  <p class="analysis">${data.content.intro}</p>
  ${renderStats(data.content.stats)}

  <h2 class="sh">3. Schema / Structured Data</h2>
  <p class="analysis">${data.schema.intro}</p>
  ${renderStats(data.schema.stats)}

  <h2 class="sh">4. Performance / Core Web Vitals</h2>
  <p class="analysis">${data.performance.intro}</p>
  ${renderStats(data.performance.stats)}

  <h2 class="sh">5. AI Search Readiness (GEO)</h2>
  <p class="analysis">${data.geo.intro}</p>
  ${renderStats(data.geo.stats)}

  <h2 class="sh">Prioritized Action Plan</h2>
  <table class="action-table">
    <tr>
      <th>Priority</th>
      <th>Fix</th>
      <th>Effort</th>
      <th>Impact</th>
    </tr>
    ${actionRows}
  </table>

  <div class="bottom-section no-break">
    ${bottomRows}
    <div class="bottom-closing">${data.bottomLine.closing}</div>
  </div>

  <div class="footer">${data.preparedBy} - montekristobelgrade.com - ${data.period}</div>

</body>
</html>`;
}

// ─── GENERATE PDF ───────────────────────────────────────────────────────────

(async () => {
  const html = buildHTML(reportData);

  // Save preview
  const previewPath = path.join(__dirname, 'aiiaco-seo-audit-preview.html');
  fs.writeFileSync(previewPath, html);
  console.log('Preview saved:', previewPath);

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pagedjs_pages', { timeout: 30000 });

  const pdfPath = path.join(__dirname, 'aiiaco-seo-audit-april-2026.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log('PDF generated:', pdfPath);
})();
