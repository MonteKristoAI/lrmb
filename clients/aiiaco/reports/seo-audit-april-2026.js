const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── REPORT DATA ────────────────────────────────────────────────────────────

const reportData = {
  client: 'AiiACo',
  title: 'SEO & AI Search Readiness Audit',
  period: 'April 2026',
  preparedBy: 'MonteKristo AI',
  tagline: 'Operational clarity starts with visibility.',

  intro: `This report covers a comprehensive SEO and AI Search Readiness audit of aiiaco.com, conducted in the first week of April 2026. The audit spans four dimensions: technical SEO, content quality, structured data, and generative engine optimization (GEO/AEO). The site currently has 43 indexed pages across service verticals, industry pages, and supporting content. The findings below identify the structural issues preventing the site from reaching its ranking potential and provide a prioritized implementation roadmap.`,

  glance: [
    { label: 'Overall Score', value: '42/100' },
    { label: 'Technical SEO', value: '42/100' },
    { label: 'Schema Markup', value: '72/100', coral: true },
    { label: 'GEO/AEO Score', value: '51/100' },
    { label: 'JS Rendering', value: '10/100' },
    { label: 'Total Pages', value: '43' },
  ],

  critical: {
    intro: `Three compounding issues are responsible for the majority of the site's SEO underperformance. Until these are resolved, all other optimizations will have limited impact.`,
    items: [
      {
        label: 'Client-Side Rendering (CSR)',
        severity: 'CRITICAL',
        description: 'The entire site delivers an empty div element (id="root") to crawlers. Zero text, zero headings, zero internal links exist in the HTML source. All content is rendered by a 2.24MB JavaScript bundle after page load. Google\'s first-pass crawl indexes nothing. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see blank pages.',
        impact: 'Estimated 80-90% of page content is invisible to search engines and AI systems.',
        fix: 'Implement Cloudflare Worker dynamic rendering to serve pre-rendered HTML to Googlebot and AI crawlers. This can be done without changing the Manus platform.',
        effort: '2-3 days',
      },
      {
        label: 'Identical Titles & Meta Descriptions',
        severity: 'CRITICAL',
        description: 'All 43 pages share the same title tag ("AiiAco | AI Integration Authority for the Corporate Age") and meta description. Google cannot differentiate the real estate page from the mortgage page from the cryptocurrency page.',
        impact: 'Pages compete against each other instead of ranking for distinct keywords. Google will rewrite titles in SERPs.',
        fix: 'Implement unique, keyword-optimized title (50-60 chars) and meta description (150-160 chars) for every page via Manus editor.',
        effort: '2-3 hours for top 7 pages, then remaining 36',
      },
      {
        label: 'Duplicate Conflicting Canonical Tags',
        severity: 'CRITICAL',
        description: 'Every page has TWO canonical tags pointing to different URLs: one to https://www.aiiaco.com/ and one to https://aiiaco.com/. When Google encounters conflicting canonicals, it ignores both and makes its own decision.',
        impact: 'Crawl budget wasted on canonical resolution. Link equity may split between www and non-www versions.',
        fix: 'Remove the www canonical from the Manus template. Keep only the non-www canonical. Also fix og:url to match.',
        effort: '30 minutes',
      },
    ],
  },

  technical: {
    intro: `Beyond the three critical issues, the technical audit revealed gaps across security, indexability, and site infrastructure that should be addressed in priority order.`,
    stats: [
      { label: 'Crawlability', value: '65/100', note: 'robots.txt correct, sitemap present, but internal links invisible in HTML' },
      { label: 'Indexability', value: '25/100', coral: true, note: 'empty body, duplicate canonicals, identical metas across all pages' },
      { label: 'Security', value: '40/100', note: 'HTTPS active but HTTP not redirecting, missing CSP/X-Frame headers' },
      { label: 'URL Structure', value: '70/100', note: 'clean URLs, but trailing slash creates duplicates' },
      { label: 'Mobile', value: '78/100', coral: true, note: 'viewport correct, responsive CSS, but no font preload' },
      { label: 'Core Web Vitals', value: '45/100', note: 'estimated poor LCP (4s+) due to 2.24MB JS bundle' },
      { label: 'JS Rendering', value: '10/100', coral: true, note: 'pure CSR, zero content in HTML source' },
      { label: 'IndexNow', value: '55/100', note: 'key files return SPA HTML instead of plain text' },
    ],
    analysis: `The site is built on Manus AI using React + Vite with Wouter routing. This pure client-side rendering architecture means the HTML document delivered to any crawler contains only meta tags and schema in the head section, with a completely empty body. The 2.24MB JavaScript bundle must execute before any content appears. This is the root cause of most technical issues. A Cloudflare Worker that pre-renders pages for crawler user-agents is the most practical fix given the current stack.`,
  },

  security: {
    intro: `Four security headers are missing, and HTTP traffic is not being redirected to HTTPS.`,
    items: [
      { label: 'HTTP to HTTPS Redirect', severity: 'CRITICAL', fix: 'Enable "Always Use HTTPS" in Cloudflare SSL/TLS settings', effort: '2 minutes' },
      { label: 'Content-Security-Policy', severity: 'HIGH', fix: 'Add CSP header via Cloudflare Transform Rules', effort: '15 minutes' },
      { label: 'X-Frame-Options', severity: 'HIGH', fix: 'Add SAMEORIGIN via Cloudflare HTTP Response Headers', effort: '5 minutes' },
      { label: 'X-Content-Type-Options', severity: 'HIGH', fix: 'Add nosniff via Cloudflare HTTP Response Headers', effort: '5 minutes' },
      { label: 'Referrer-Policy', severity: 'MEDIUM', fix: 'Add strict-origin-when-cross-origin via Cloudflare', effort: '5 minutes' },
    ],
  },

  schema: {
    intro: `The site has a decent schema foundation (Organization, WebSite, ProfessionalService) but is missing page-specific structured data and has a critical SPA-related issue.`,
    stats: [
      { label: 'Organization', value: 'PARTIAL', note: 'exists but missing founder, telephone, address' },
      { label: 'WebSite', value: 'PARTIAL', note: 'exists but missing SearchAction and inLanguage' },
      { label: 'ProfessionalService', value: 'PARTIAL', note: 'exists but identical on all 43 pages' },
      { label: 'Person (Nemr Hallak)', value: 'MISSING', coral: true, note: 'no founder entity linked to Organization' },
      { label: 'BreadcrumbList', value: 'MISSING', coral: true, note: 'no breadcrumbs on any inner page' },
      { label: 'Service (per page)', value: 'MISSING', coral: true, note: 'industry pages use generic global schema' },
      { label: 'FAQPage', value: 'MISSING', note: 'FAQ content exists but no schema markup' },
      { label: 'WebPage', value: 'MISSING', note: 'no page-level entity definition on any page' },
    ],
    analysis: `The critical SPA issue compounds here: because the app serves identical HTML for every route, all 43 pages carry the exact same three schema blocks. Google sees no schema differentiation between the real estate page and the cryptocurrency page. Schema must be injected per-route by the application router, or via Cloudflare Workers as part of the dynamic rendering solution. Ready-to-implement JSON-LD blocks for Organization, Person, Service, BreadcrumbList, and WebPage have been prepared and are available for immediate deployment.`,
  },

  geo: {
    intro: `GEO (Generative Engine Optimization) measures how well the site is positioned to be cited by AI search systems: Google AI Overviews, ChatGPT web search, Perplexity, and Bing Copilot.`,
    stats: [
      { label: 'Google AI Overviews', value: '42/100', note: 'CSR rendering, no FAQ schema, thin E-E-A-T signals' },
      { label: 'ChatGPT Web Search', value: '28/100', coral: true, note: 'GPTBot cannot render JS, no entity recognition' },
      { label: 'Perplexity', value: '35/100', note: 'better JS handling, but no authority signals' },
      { label: 'Bing Copilot', value: '38/100', note: 'collapsed FAQs invisible, no HowTo schema' },
    ],
    analysis: `The site's AEO readiness is undermined by three compounding problems. First, the JavaScript-rendered architecture prevents AI crawlers from reading most content. Second, FAQ answers are hidden inside JS accordion elements that crawlers cannot expand. Third, there are near-zero external brand signals (no YouTube, no Reddit presence, minimal LinkedIn following, no Wikipedia/Wikidata entity). The opening definitions on /ai-integration and /ai-automation-for-business are strong and citable, but at 30-40 words they fall short of the 134-167 word optimal citation range.`,
  },

  faq: {
    intro: `FAQ sections exist on key pages with well-chosen questions that map directly to target search queries. However, every FAQ answer is hidden behind a JavaScript accordion.`,
    items: [
      { question: 'What is AI integration and how is it different from buying AI tools?', page: '/ai-integration', status: 'INVISIBLE TO CRAWLERS' },
      { question: 'How does AI integration work with existing ERP and CRM systems?', page: '/ai-integration', status: 'INVISIBLE TO CRAWLERS' },
      { question: 'What business processes can be automated with AI?', page: '/ai-automation-for-business', status: 'INVISIBLE TO CRAWLERS' },
      { question: 'How does AI automation reduce operational costs?', page: '/ai-automation-for-business', status: 'INVISIBLE TO CRAWLERS' },
    ],
    fix: 'Replace JS accordion with native HTML details/summary elements (crawler-readable and still collapsible for users). Add FAQPage JSON-LD schema to every page with FAQ content. This is the single highest-impact AEO fix on the entire site.',
  },

  pages404: {
    intro: `Six planned service pages return HTTP 404. These are the core pages that should anchor the site's keyword strategy.`,
    items: [
      { url: '/ai-infrastructure', keyword: 'AI infrastructure for business', status: 'PILLAR PAGE' },
      { url: '/ai-crm-integration', keyword: 'AI CRM integration', status: 'SERVICE' },
      { url: '/ai-workflow-automation', keyword: 'AI workflow automation', status: 'SERVICE' },
      { url: '/ai-revenue-engine', keyword: 'AI revenue systems', status: 'SERVICE' },
      { url: '/ai-for-real-estate', keyword: 'AI for real estate', status: 'INDUSTRY' },
      { url: '/ai-for-vacation-rentals', keyword: 'AI for vacation rentals', status: 'INDUSTRY' },
    ],
  },

  quickWins: {
    intro: `These fixes can be implemented immediately with Cloudflare and Manus access. Combined effort: under 2 hours.`,
    items: [
      { action: 'Enable "Always Use HTTPS" in Cloudflare', effort: '2 min', impact: 'Closes critical HTTP security gap' },
      { action: 'Add security headers via Cloudflare Transform Rules', effort: '15 min', impact: 'Resolves 4 security vulnerabilities' },
      { action: 'Remove duplicate www canonical from Manus template', effort: '30 min', impact: 'Fixes canonical conflict on all 43 pages' },
      { action: 'Standardize entity name to AiiACo everywhere', effort: '30 min', impact: 'Consistent entity recognition for Knowledge Panel' },
    ],
  },

  roadmap: {
    intro: `The following implementation sequence is ordered by dependency and impact. Each phase builds on the previous one.`,
    phases: [
      {
        name: 'Week 1: Foundation Fixes',
        items: [
          'Cloudflare quick wins (HTTPS redirect, security headers)',
          'Remove duplicate canonical tags',
          'Write unique titles/meta descriptions for top 7 pages',
          'Create and deploy llms.txt file',
          'Make FAQ answers static HTML (remove JS accordion)',
          'Add FAQPage JSON-LD schema to key pages',
          'Install Plausible Analytics token on website',
        ]
      },
      {
        name: 'Week 2: Dynamic Rendering + Schema',
        items: [
          'Deploy Cloudflare Worker for dynamic rendering (pre-render for crawlers)',
          'Add Person schema for Nemr Hallak (founder entity)',
          'Add BreadcrumbList schema to all inner pages',
          'Add Service schema to industry and service pages',
          'Expand definition blocks to 134-167 word citation-optimal length',
          'Fix IndexNow key file delivery (bypass SPA routing)',
        ]
      },
      {
        name: 'Week 2-3: Build Core Service Pages',
        items: [
          '/ai-infrastructure (PILLAR, 2,500-3,000 words)',
          '/ai-crm-integration (2,000 words)',
          '/ai-workflow-automation (2,000 words)',
          '/ai-revenue-engine (2,000 words)',
          '/ai-for-real-estate (2,000-2,500 words)',
          '/ai-for-vacation-rentals (2,000-2,500 words)',
          'Internal linking architecture across all pages',
        ]
      },
      {
        name: 'Week 3-4: Blog Launch & Content',
        items: [
          'Deploy blog.aiiaco.com on Vercel',
          'CNAME record setup in DNS',
          'Blog design matching AiiACo brand',
          'First 4 blog posts targeting core AEO queries',
          'Topic cluster architecture with hub-and-spoke linking',
        ]
      },
      {
        name: 'Month 2+: Authority Building',
        items: [
          'YouTube channel with 4 target-query videos',
          'Reddit presence building (r/artificial, r/automation, r/entrepreneur)',
          'Wikidata entity population',
          'Named leadership on About/Manifesto pages',
          'Domain portfolio audit (100 owned domains)',
          'Monthly SEO performance reporting',
        ]
      },
    ],
  },

  bottomLine: {
    rows: [
      { label: 'Technical', value: 'Score 42/100 - CSR rendering is the #1 blocker. Cloudflare Worker fix unlocks everything.' },
      { label: 'Schema', value: 'Score 72/100 - Good foundation, needs per-page differentiation + Person entity for E-E-A-T.' },
      { label: 'GEO/AEO', value: 'Score 51/100 - FAQ answers invisible to AI crawlers. Single highest-impact fix available.' },
      { label: '404 Pages', value: '6 core service pages missing - the commercial backbone needs to be built.' },
    ],
    closing: 'The content is strong. The architecture is the bottleneck. Fix rendering, fix schema, build the missing pages.',
  },
};

// ─── LOGO (favicon-bold.svg embedded inline) ───

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

  const criticalItems = data.critical.items.map((item, i) => `
    <div class="issue-block no-break">
      <div class="issue-header">
        <span class="issue-number">${i + 1}</span>
        <span class="issue-title">${item.label}</span>
        <span class="severity severity-${item.severity.toLowerCase()}">${item.severity}</span>
      </div>
      <p class="issue-desc">${item.description}</p>
      <div class="issue-meta">
        <div class="issue-meta-row"><span class="meta-label">Impact:</span> ${item.impact}</div>
        <div class="issue-meta-row"><span class="meta-label">Fix:</span> ${item.fix}</div>
        <div class="issue-meta-row"><span class="meta-label">Effort:</span> ${item.effort}</div>
      </div>
    </div>`).join('');

  const technicalStats = data.technical.stats.map(s => `
    <div class="stat-row">
      <span class="stat-label">${s.label}</span>
      <span class="stat-value${s.coral ? ' coral' : ''}">${s.value}</span>
      <span class="stat-note">${s.note}</span>
    </div>`).join('');

  const securityItems = data.security.items.map(s => `
    <div class="stat-row no-break">
      <span class="stat-label">${s.label}</span>
      <span class="stat-value severity-text-${s.severity.toLowerCase()}">${s.severity}</span>
      <span class="stat-note">${s.fix} (${s.effort})</span>
    </div>`).join('');

  const schemaStats = data.schema.stats.map(s => `
    <div class="stat-row">
      <span class="stat-label">${s.label}</span>
      <span class="stat-value${s.coral ? ' coral' : ''}">${s.value}</span>
      <span class="stat-note">${s.note}</span>
    </div>`).join('');

  const geoStats = data.geo.stats.map(s => `
    <div class="stat-row">
      <span class="stat-label">${s.label}</span>
      <span class="stat-value${s.coral ? ' coral' : ''}">${s.value}</span>
      <span class="stat-note">${s.note}</span>
    </div>`).join('');

  const faqItems = data.faq.items.map(f => `
    <div class="stat-row no-break">
      <span class="stat-label" style="width:auto; flex:1;">${f.question}</span>
      <span class="stat-value coral" style="width:auto; font-size:9pt; text-align:right;">${f.status}</span>
    </div>`).join('');

  const pages404 = data.pages404.items.map(p => `
    <div class="stat-row no-break">
      <span class="stat-label" style="width:160pt;">${p.url}</span>
      <span class="stat-value" style="width:auto; font-size:9pt; margin-right:8pt;">${p.status}</span>
      <span class="stat-note">${p.keyword}</span>
    </div>`).join('');

  const quickWins = data.quickWins.items.map((w, i) => `
    <div class="stat-row no-break">
      <span class="stat-label" style="width:20pt; color:#041122; font-weight:600;">${i + 1}.</span>
      <span class="stat-note" style="flex:1; font-style:normal; color:#1D1F28;">${w.action}</span>
      <span class="stat-value" style="width:50pt; font-size:9pt; text-align:right;">${w.effort}</span>
    </div>`).join('');

  const roadmapHTML = data.roadmap.phases.map(phase => `
    <div class="roadmap-phase no-break">
      <h3 class="subh">${phase.name}</h3>
      <ul class="roadmap-list">
        ${phase.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>`).join('');

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
    font-size: 10.5pt;
    color: #1D1F28;
    line-height: 1.6;
    background: #FAF8F4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .no-break { break-inside: avoid; page-break-inside: avoid; }
  h2.sh { break-after: avoid; page-break-after: avoid; }
  h3.subh { break-after: avoid; page-break-after: avoid; }

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
    font-size: 20pt;
    font-weight: 700;
    color: #041122;
    line-height: 1.2;
    margin: 0 0 4pt 0;
  }
  .report-client {
    font-family: 'Poppins', sans-serif;
    font-size: 13pt;
    font-weight: 600;
    color: #041122;
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
    font-size: 10pt;
    font-style: italic;
    color: #bbb;
    margin: 4pt 0 14pt 0;
  }

  .intro { font-size: 10.5pt; color: #444; line-height: 1.65; margin: 0 0 14pt 0; }

  /* ── SECTION HEADER ── */
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

  /* ── GLANCE GRID ── */
  .glance-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6pt;
    background: white;
    border-radius: 6pt;
    padding: 12pt 10pt;
    border: 1pt solid #e5e1db;
    margin-bottom: 14pt;
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
    margin-top: 2pt;
    line-height: 1.3;
  }

  /* ── STAT ROWS ── */
  .stat-row {
    display: flex;
    align-items: baseline;
    gap: 0;
    padding: 5.5pt 0;
    border-bottom: 0.5pt solid #eee;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-label {
    font-size: 9.5pt;
    color: #888;
    width: 120pt;
    flex-shrink: 0;
  }
  .stat-value {
    font-size: 11pt;
    font-weight: 600;
    color: #041122;
    width: 56pt;
    flex-shrink: 0;
  }
  .stat-note {
    font-size: 9pt;
    color: #999;
    font-style: italic;
  }

  /* ── ISSUE BLOCKS ── */
  .issue-block {
    background: white;
    border: 1pt solid #e5e1db;
    border-radius: 6pt;
    padding: 12pt 14pt;
    margin-bottom: 8pt;
  }
  .issue-header {
    display: flex;
    align-items: center;
    gap: 8pt;
    margin-bottom: 6pt;
  }
  .issue-number {
    font-family: 'Poppins', sans-serif;
    font-size: 14pt;
    font-weight: 700;
    color: #FF5C5C;
    width: 24pt;
    flex-shrink: 0;
  }
  .issue-title {
    font-family: 'Poppins', sans-serif;
    font-size: 11pt;
    font-weight: 600;
    color: #041122;
    flex: 1;
  }
  .severity {
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 2pt 6pt;
    border-radius: 3pt;
  }
  .severity-critical { background: #FF5C5C; color: white; }
  .severity-high { background: #F59E0B; color: white; }
  .severity-medium { background: #3B82F6; color: white; }
  .severity-text-critical { color: #FF5C5C; font-size: 9pt; }
  .severity-text-high { color: #F59E0B; font-size: 9pt; }
  .severity-text-medium { color: #3B82F6; font-size: 9pt; }
  .issue-desc {
    font-size: 9.5pt;
    color: #444;
    line-height: 1.55;
    margin: 0 0 8pt 0;
  }
  .issue-meta {
    border-top: 0.5pt solid #eee;
    padding-top: 6pt;
  }
  .issue-meta-row {
    font-size: 9pt;
    color: #666;
    line-height: 1.5;
    padding: 2pt 0;
  }
  .meta-label {
    font-weight: 600;
    color: #041122;
  }

  /* ── ANALYSIS ── */
  .analysis {
    font-size: 10pt;
    color: #1D1F28;
    margin: 8pt 0 0 0;
    line-height: 1.6;
  }

  /* ── ROADMAP ── */
  .roadmap-phase { margin-bottom: 4pt; }
  .roadmap-list {
    margin: 0;
    padding-left: 16pt;
    font-size: 9.5pt;
    color: #444;
    line-height: 1.55;
  }
  .roadmap-list li {
    padding: 2pt 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* ── TABLE ── */
  .profile-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    margin-top: 4pt;
  }
  .profile-table th {
    font-size: 7.5pt;
    font-weight: 500;
    color: #aaa;
    text-align: left;
    padding: 4pt 6pt 4pt 0;
    border-bottom: 1pt solid #ddd;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  .profile-table td {
    padding: 6pt 6pt 6pt 0;
    border-bottom: 0.5pt solid #eee;
    color: #1D1F28;
    font-weight: 500;
    white-space: nowrap;
    break-inside: avoid;
  }

  /* ── BOTTOM LINE ── */
  .bottom-section {
    background: #041122;
    border-radius: 6pt;
    padding: 14pt 16pt;
    margin-top: 16pt;
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
    page-break-inside: avoid;
  }
  .bottom-row:last-of-type { border-bottom: none; }
  .bl-label {
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    font-size: 8.5pt;
    width: 56pt;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .bl-value {
    font-size: 9.5pt;
    font-weight: 500;
    color: rgba(255,255,255,0.88);
    line-height: 1.45;
  }
  .closing {
    font-family: 'Poppins', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    color: white;
    text-align: center;
    margin-top: 12pt;
    padding-top: 10pt;
    border-top: 1pt solid rgba(255,255,255,0.15);
  }

  .footer {
    text-align: center;
    font-size: 7.5pt;
    font-style: italic;
    color: #ccc;
    margin-top: 12pt;
    padding-top: 6pt;
    border-top: 0.5pt solid #ddd;
  }

  .coral { color: #FF5C5C; }
  .bold { font-weight: 700; }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header no-break">
    <div>
      <p class="report-client">${data.client}</p>
      <h1 class="report-title">${data.title}</h1>
      <p class="report-meta">${data.period}</p>
      <p class="report-prepared">Prepared by ${data.preparedBy}</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">${data.tagline}</p>
  <p class="intro">${data.intro}</p>

  <!-- AUDIT AT A GLANCE -->
  <div class="section-block">
    <h2 class="sh">Audit at a Glance</h2>
    <div class="glance-grid no-break">
      ${glanceCards}
    </div>
  </div>

  <!-- CRITICAL ISSUES -->
  <div class="section-block">
    <h2 class="sh">Critical Issues</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:8pt;">${data.critical.intro}</p>
    ${criticalItems}
  </div>

  <!-- TECHNICAL SEO -->
  <div class="section-block">
    <h2 class="sh">Technical SEO Breakdown</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.technical.intro}</p>
    <div class="no-break">
      ${technicalStats}
    </div>
    <p class="analysis">${data.technical.analysis}</p>
  </div>

  <!-- SECURITY -->
  <div class="section-block">
    <h2 class="sh">Security Headers</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.security.intro}</p>
    ${securityItems}
  </div>

  <!-- SCHEMA -->
  <div class="section-block">
    <h2 class="sh">Structured Data (Schema.org)</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.schema.intro}</p>
    <div class="no-break">
      ${schemaStats}
    </div>
    <p class="analysis">${data.schema.analysis}</p>
  </div>

  <!-- GEO/AEO -->
  <div class="section-block">
    <h2 class="sh">AI Search Readiness (GEO/AEO)</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.geo.intro}</p>
    <div class="no-break">
      ${geoStats}
    </div>
    <p class="analysis">${data.geo.analysis}</p>
  </div>

  <!-- FAQ STATUS -->
  <div class="section-block">
    <h2 class="sh">FAQ Visibility Audit</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.faq.intro}</p>
    ${faqItems}
    <p class="analysis" style="margin-top:8pt;"><span style="font-weight:600; color:#041122;">Recommended Fix:</span> ${data.faq.fix}</p>
  </div>

  <!-- 404 PAGES -->
  <div class="section-block">
    <h2 class="sh">Missing Service Pages (404)</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.pages404.intro}</p>
    ${pages404}
  </div>

  <!-- QUICK WINS -->
  <div class="section-block">
    <h2 class="sh">Quick Wins (Under 2 Hours)</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.quickWins.intro}</p>
    ${quickWins}
  </div>

  <!-- ROADMAP -->
  <div class="section-block">
    <h2 class="sh">Implementation Roadmap</h2>
    <p class="analysis" style="margin-top:0; margin-bottom:6pt;">${data.roadmap.intro}</p>
    ${roadmapHTML}
  </div>

  <!-- BOTTOM LINE -->
  <div class="bottom-section">
    <h2 class="sh">Bottom Line</h2>
    ${bottomRows}
    <p class="closing">${data.bottomLine.closing}</p>
  </div>

  <div class="footer">MonteKristo AI  ·  montekristobelgrade.com  ·  ${data.period}</div>

</body>
</html>`;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function generateReport() {
  const outputDir = __dirname;
  const outputPath = path.join(outputDir, 'aiiaco-seo-audit-april-2026.pdf');
  const html = buildHTML(reportData);

  // Save preview HTML
  const previewPath = path.join(outputDir, 'report-preview.html');
  fs.writeFileSync(previewPath, html);
  console.log(`HTML preview -> ${previewPath}`);

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
  console.log(`PDF -> ${outputPath}`);
  return outputPath;
}

generateReport().catch(console.error);
