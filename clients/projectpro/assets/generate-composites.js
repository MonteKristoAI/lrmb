/**
 * ProjectPro Meta Ads — Composite Generator
 * Generates 10 production-ready ad creatives (5 ads x 2 formats)
 * MonteKristo AI · April 2026
 */

const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

// ─── Brand Tokens ────────────────────────────────────────────────────────────
const NAVY   = '#041122';
const CORAL  = '#FF5C5C';
const WHITE  = '#FFFFFF';
const CREAM  = '#FAF8F4';

// ─── Output Directory ────────────────────────────────────────────────────────
const OUT_DIR = path.join(__dirname, 'generated');

// ─── Background Paths ────────────────────────────────────────────────────────
function bgBase64(filename) {
  const p = path.join(OUT_DIR, filename);
  return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
}

// ─── Ad Definitions ──────────────────────────────────────────────────────────
const ads = [
  {
    id: 1,
    bg_sq:   'bg_a_sq.png',
    bg_port: 'bg_a_port.png',
    tag:     'FOR VP OF SALES · BUILDING MATERIALS',
    headline: 'Your Competitor Got\nSpecified 3 Months Ago',
    subline:  'By the time it hit the bid board, the decision was already made.',
    stats: [
      { num: '150–250', label: 'projects/week' },
      { num: '95%',     label: 'pre-bid stage' },
      { num: '3–6mo',   label: 'before spec lock' },
    ],
    cta: 'See if your team qualifies',
    gradient: 'bottom-heavy',
  },
  {
    id: 2,
    bg_sq:   'bg_a_sq.png',
    bg_port: 'bg_a_port.png',
    tag:     'FOR VP OF SALES · COMMERCIAL CONSTRUCTION',
    headline: '150 Projects Every Monday\nBefore 9am',
    subline:  'One subscriber hit a 28% cold email open rate. That\'s what early-stage looks like.',
    stats: [
      { num: '28%',     label: 'cold email open rate' },
      { num: '150+',    label: 'projects delivered weekly' },
      { num: 'Excel',   label: 'no platform to learn' },
    ],
    cta: 'See if your team qualifies',
    gradient: 'top-heavy',
  },
  {
    id: 3,
    bg_sq:   'bg_b_sq.png',
    bg_port: 'bg_b_port.png',
    tag:     'FOR COMMERCIAL BUILDING MATERIAL SUPPLIERS',
    headline: 'Stop Finding Projects\nAfter Specs Are Locked',
    subline:  'Your competitor is already in the drawings. Your rep shows up and competes on price.',
    stats: [
      { num: '150–250', label: 'early-stage projects/week' },
      { num: '95%',     label: 'in planning or pre-construction' },
      { num: 'Direct',  label: 'architect contact included' },
    ],
    cta: 'See if your team qualifies',
    gradient: 'bottom-heavy',
  },
  {
    id: 4,
    bg_sq:   'bg_b_sq.png',
    bg_port: 'bg_b_port.png',
    tag:     'FOR SALES LEADERS · BUILDING MATERIALS',
    headline: 'Your Reps Already\nHave Their List',
    subline:  'Monday 9:07am. Excel opens. First architect call by 9:15. Two meetings booked by lunch.',
    stats: [
      { num: '9:07',    label: 'Monday list arrives' },
      { num: '11 min',  label: 'pipeline meeting (not 45)' },
      { num: '30-day',  label: 'free trial' },
    ],
    cta: 'See if your team qualifies',
    gradient: 'top-heavy',
  },
  {
    id: 5,
    bg_sq:   'bg_c_sq.png',
    bg_port: 'bg_c_port.png',
    tag:     'DATA · COMMERCIAL CONSTRUCTION LEADS',
    headline: '$0.52 Per Lead vs.\nWhat You Pay Now',
    subline:  '31% of premium database users report outdated data monthly. Run the math yourself.',
    stats: [
      { num: '$0.52',   label: 'per commercial lead' },
      { num: '31%',     label: 'inaccuracy rate (premium DBs)' },
      { num: 'Cancel',  label: 'anytime, no contract' },
    ],
    cta: 'See if your team qualifies',
    gradient: 'full-dark',
  },
];

// ─── Gradient Overlays ────────────────────────────────────────────────────────
const gradients = {
  'top-heavy': `linear-gradient(180deg,
    rgba(4,17,34,0.90) 0%,
    rgba(4,17,34,0.55) 35%,
    rgba(4,17,34,0.30) 55%,
    rgba(4,17,34,0.72) 80%,
    rgba(4,17,34,0.93) 100%)`,
  'bottom-heavy': `linear-gradient(180deg,
    rgba(4,17,34,0.30) 0%,
    rgba(4,17,34,0.15) 28%,
    rgba(4,17,34,0.45) 58%,
    rgba(4,17,34,0.88) 82%,
    rgba(4,17,34,0.96) 100%)`,
  'full-dark': `rgba(4,17,34,0.78)`,
};

// ─── HTML Builder ─────────────────────────────────────────────────────────────
function buildHTML(ad, bgFile, width, height) {
  const bgData  = bgBase64(bgFile);
  const grad    = gradients[ad.gradient];
  const isPort  = height > width;

  // Font sizing scaled to canvas
  const tagSize    = Math.round(width * 0.013);
  const headSize   = Math.round(width * (isPort ? 0.052 : 0.048));
  const subSize    = Math.round(width * 0.019);
  const numSize    = Math.round(width * 0.038);
  const lblSize    = Math.round(width * 0.013);
  const ctaSize    = Math.round(width * 0.018);

  // Layout paddings
  const pad        = Math.round(width * 0.065);
  const ctaH       = Math.round(height * 0.075);

  // Stats row
  const statsHtml = ad.stats.map((s, i) => `
    <div style="display:flex;flex-direction:column;align-items:center;${i < ad.stats.length - 1 ? `padding-right:${Math.round(width*0.04)}px;margin-right:${Math.round(width*0.04)}px;border-right:1px solid rgba(255,255,255,0.18);` : ''}">
      <div style="color:${CORAL};font-size:${numSize}px;font-weight:900;font-family:'Poppins',sans-serif;line-height:1;letter-spacing:-0.5px;">${s.num}</div>
      <div style="color:rgba(255,255,255,0.55);font-size:${lblSize}px;font-family:'Inter',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:1.5px;margin-top:4px;">${s.label}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${width}px; height:${height}px; overflow:hidden;
    font-family:'Inter',sans-serif;
    -webkit-font-smoothing:antialiased;
    position:relative;
  }
  .bg {
    position:absolute; inset:0;
    background-image:url('${bgData}');
    background-size:cover; background-position:center;
  }
  .overlay {
    position:absolute; inset:0;
    background:${grad};
  }
  .content {
    position:absolute; inset:0;
    display:flex; flex-direction:column;
    justify-content:space-between;
    padding:${pad}px;
  }
  .top-section {
    display:flex; flex-direction:column; gap:${Math.round(height * 0.018)}px;
  }
  .tag {
    display:inline-block;
    background:${CORAL};
    color:${WHITE};
    font-size:${tagSize}px;
    font-weight:700;
    letter-spacing:2.5px;
    text-transform:uppercase;
    padding:6px 14px;
    border-radius:4px;
    font-family:'Inter',sans-serif;
    align-self:flex-start;
  }
  .headline {
    font-family:'Poppins',sans-serif;
    color:${WHITE};
    font-size:${headSize}px;
    font-weight:800;
    line-height:1.12;
    letter-spacing:-0.5px;
    white-space:pre-line;
    text-shadow:0 2px 12px rgba(4,17,34,0.5);
    max-width:${Math.round(width * 0.88)}px;
  }
  .subline {
    color:rgba(255,255,255,0.72);
    font-size:${subSize}px;
    font-family:'Inter',sans-serif;
    font-weight:400;
    line-height:1.5;
    max-width:${Math.round(width * 0.82)}px;
  }
  .bottom-section {
    display:flex; flex-direction:column; gap:${Math.round(height * 0.022)}px;
  }
  .stats-row {
    display:flex; align-items:center;
  }
  .cta-bar {
    background:${CORAL};
    border-radius:${Math.round(ctaH * 0.5)}px;
    height:${ctaH}px;
    display:flex; align-items:center; justify-content:center;
    color:${WHITE};
    font-size:${ctaSize}px;
    font-weight:700;
    font-family:'Inter',sans-serif;
    letter-spacing:0.3px;
    box-shadow:0 4px 20px rgba(255,92,92,0.35);
  }
</style></head>
<body>
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="content">
    <div class="top-section">
      <div class="tag">${ad.tag}</div>
      <div class="headline">${ad.headline}</div>
      <div class="subline">${ad.subline}</div>
    </div>
    <div class="bottom-section">
      <div class="stats-row">${statsHtml}</div>
      <div class="cta-bar">${ad.cta}</div>
    </div>
  </div>
</body></html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const formats = [
    { suffix: 'sq',   width: 1080, height: 1080 },
    { suffix: 'port', width: 1080, height: 1350 },
  ];

  let generated = 0;

  for (const ad of ads) {
    for (const fmt of formats) {
      const bgFile  = fmt.suffix === 'sq' ? ad.bg_sq : ad.bg_port;
      const outFile = path.join(OUT_DIR, `composite_ad${ad.id}_${fmt.suffix}.png`);

      console.log(`Generating Ad ${ad.id} [${fmt.suffix.toUpperCase()}] → ${path.basename(outFile)}`);

      const html = buildHTML(ad, bgFile, fmt.width, fmt.height);

      const page = await browser.newPage();
      await page.setViewport({ width: fmt.width, height: fmt.height, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 600)); // Font rendering buffer

      await page.screenshot({ path: outFile, type: 'png' });
      await page.close();

      generated++;
      console.log(`  ✓ Saved: ${path.basename(outFile)}`);
    }
  }

  await browser.close();
  console.log(`\nDone. ${generated} composites generated in:\n${OUT_DIR}`);
})();
