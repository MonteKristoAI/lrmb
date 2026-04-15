const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = __dirname;

// ─── BRAND TOKENS ───────────────────────────────────────────────────────────
const brand = {
  navy:   '#041122',
  coral:  '#FF5C5C',
  cream:  '#FAF8F4',
  white:  '#FFFFFF',
  text:   '#1D1F28',
  gray:   '#8A8F98',
  green:  '#34C759',
  red:    '#FF3B30',
  darkGray: '#2A2E37',
};

// ─── SHARED HTML SHELL ──────────────────────────────────────────────────────
function htmlShell(width, height, bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

// ─── CONCEPT 1: SPEC TIMELINE ───────────────────────────────────────────────
function specTimeline(w, h) {
  const isPortrait = h > w;
  const pad = isPortrait ? 60 : 50;
  const titleSize = isPortrait ? 42 : 38;
  const subtitleSize = isPortrait ? 20 : 18;
  const labelSize = isPortrait ? 26 : 24;
  const timelineY = isPortrait ? '46%' : '44%';
  const dotSize = isPortrait ? 22 : 18;
  const bracketGap = isPortrait ? 40 : 30;

  return `
<div style="
  width:${w}px; height:${h}px;
  background: ${brand.navy};
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding: ${pad}px;
  position: relative;
">
  <!-- Subtle blueprint grid overlay -->
  <div style="
    position:absolute; inset:0; opacity:0.03;
    background-image:
      linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
    background-size: 40px 40px;
  "></div>

  <!-- Top label -->
  <div style="
    color: ${brand.gray}; font-size: ${subtitleSize - 2}px;
    letter-spacing: 3px; text-transform: uppercase;
    font-weight: 600; margin-bottom: ${isPortrait ? 30 : 20}px;
    position: relative; z-index: 1;
  ">The Timing Advantage</div>

  <!-- Main question -->
  <div style="
    font-family: 'Poppins', sans-serif;
    color: ${brand.white}; font-size: ${titleSize}px;
    font-weight: 800; text-align: center;
    line-height: 1.2; margin-bottom: ${isPortrait ? 60 : 40}px;
    position: relative; z-index: 1;
    max-width: ${w - pad * 2}px;
  ">Where do you find out<br>about projects?</div>

  <!-- Timeline container -->
  <div style="
    width: ${w - pad * 2 - 40}px;
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
  ">
    <!-- Timeline line -->
    <div style="
      width: 100%; height: 4px;
      background: linear-gradient(to right, ${brand.green}, ${brand.gray} 50%, ${brand.red});
      border-radius: 2px; position: relative;
      margin: ${isPortrait ? 30 : 20}px 0;
    ">
      <!-- Green dot left -->
      <div style="
        position:absolute; left:0; top:50%; transform:translate(-50%,-50%);
        width:${dotSize}px; height:${dotSize}px; border-radius:50%;
        background:${brand.green}; border: 3px solid ${brand.navy};
        box-shadow: 0 0 20px rgba(52,199,89,0.4);
      "></div>
      <!-- Red dot right -->
      <div style="
        position:absolute; right:0; top:50%; transform:translate(50%,-50%);
        width:${dotSize}px; height:${dotSize}px; border-radius:50%;
        background:${brand.red}; border: 3px solid ${brand.navy};
        box-shadow: 0 0 20px rgba(255,59,48,0.4);
      "></div>
    </div>

    <!-- Labels row -->
    <div style="
      width:100%; display:flex; justify-content:space-between;
      margin-top: 16px;
    ">
      <!-- Left label -->
      <div style="text-align:left; max-width:45%;">
        <div style="color:${brand.green}; font-size:${labelSize}px; font-weight:800; font-family:'Poppins',sans-serif;">
          Planning Stage
        </div>
        <div style="color:${brand.gray}; font-size:${subtitleSize - 2}px; margin-top:6px; line-height:1.4;">
          Architect choosing materials<br>
          <span style="color:${brand.white}; font-weight:600;">Specs still open</span>
        </div>
      </div>
      <!-- Right label -->
      <div style="text-align:right; max-width:45%;">
        <div style="color:${brand.red}; font-size:${labelSize}px; font-weight:800; font-family:'Poppins',sans-serif;">
          Bid Stage
        </div>
        <div style="color:${brand.gray}; font-size:${subtitleSize - 2}px; margin-top:6px; line-height:1.4;">
          Spec already locked<br>
          <span style="color:${brand.gray}; font-weight:600;">Competing on price</span>
        </div>
      </div>
    </div>

    <!-- Bracket labels -->
    <div style="
      width:100%; display:flex; justify-content:space-between;
      margin-top: ${bracketGap}px;
    ">
      <div style="
        background: rgba(52,199,89,0.12); border: 1px solid rgba(52,199,89,0.3);
        border-radius: 8px; padding: 12px 20px; max-width: 48%;
        text-align: center;
      ">
        <div style="color:${brand.white}; font-size:${subtitleSize}px; font-weight:700;">ProjectPro</div>
        <div style="color:${brand.green}; font-size:${subtitleSize - 4}px; margin-top:4px;">3-6 months before bid</div>
      </div>
      <div style="
        background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.2);
        border-radius: 8px; padding: 12px 20px; max-width: 48%;
        text-align: center;
      ">
        <div style="color:${brand.gray}; font-size:${subtitleSize}px; font-weight:600;">Every other service</div>
        <div style="color:${brand.red}; font-size:${subtitleSize - 4}px; margin-top:4px;">After specs are locked</div>
      </div>
    </div>
  </div>

  <!-- Stat bar -->
  <div style="
    margin-top: ${isPortrait ? 60 : 40}px;
    display: flex; gap: ${isPortrait ? 40 : 30}px;
    position: relative; z-index: 1;
  ">
    <div style="text-align:center;">
      <div style="color:${brand.coral}; font-size:${titleSize - 4}px; font-weight:900; font-family:'Poppins',sans-serif;">150-250</div>
      <div style="color:${brand.gray}; font-size:${subtitleSize - 4}px;">projects/week</div>
    </div>
    <div style="width:1px; background:${brand.darkGray};"></div>
    <div style="text-align:center;">
      <div style="color:${brand.coral}; font-size:${titleSize - 4}px; font-weight:900; font-family:'Poppins',sans-serif;">$199</div>
      <div style="color:${brand.gray}; font-size:${subtitleSize - 4}px;">/month</div>
    </div>
    <div style="width:1px; background:${brand.darkGray};"></div>
    <div style="text-align:center;">
      <div style="color:${brand.coral}; font-size:${titleSize - 4}px; font-weight:900; font-family:'Poppins',sans-serif;">Monday</div>
      <div style="color:${brand.gray}; font-size:${subtitleSize - 4}px;">Excel delivery</div>
    </div>
  </div>

  <!-- CTA -->
  <div style="
    margin-top: ${isPortrait ? 50 : 30}px;
    border: 2px solid ${brand.coral}; border-radius: 30px;
    padding: 14px 40px;
    color: ${brand.coral}; font-size: ${subtitleSize}px; font-weight: 700;
    letter-spacing: 0.5px;
    position: relative; z-index: 1;
  ">See if your team qualifies</div>
</div>`;
}

// ─── CONCEPT 2: QUOTE CARD ─────────────────────────────────────────────────
function quoteCard(w, h) {
  const isPortrait = h > w;
  const pad = isPortrait ? 60 : 50;
  const quoteSize = isPortrait ? 34 : 30;
  const statSize = isPortrait ? 56 : 48;

  return `
<div style="
  width:${w}px; height:${h}px;
  background: ${brand.cream};
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding: ${pad}px;
  position: relative;
">
  <!-- Subtle texture -->
  <div style="
    position:absolute; inset:0; opacity:0.015;
    background-image: radial-gradient(${brand.navy} 1px, transparent 1px);
    background-size: 20px 20px;
  "></div>

  <!-- Top decorative quote mark -->
  <div style="
    font-family: Georgia, serif;
    font-size: ${isPortrait ? 180 : 140}px;
    color: ${brand.coral};
    opacity: 0.15;
    line-height: 0.6;
    margin-bottom: ${isPortrait ? -40 : -30}px;
    position: relative; z-index: 0;
  ">"</div>

  <!-- Quote -->
  <div style="
    font-family: 'Poppins', sans-serif;
    font-size: ${quoteSize}px;
    font-weight: 700;
    color: ${brand.navy};
    text-align: center;
    line-height: 1.45;
    max-width: ${w - pad * 2 - 40}px;
    position: relative; z-index: 1;
    margin-bottom: ${isPortrait ? 40 : 30}px;
  ">We literally built our business from the ground up using this service.</div>

  <!-- Attribution -->
  <div style="
    color: ${brand.gray};
    font-size: ${isPortrait ? 18 : 16}px;
    font-weight: 500;
    text-align: center;
    margin-bottom: ${isPortrait ? 50 : 35}px;
    position: relative; z-index: 1;
  ">7-year subscriber &middot; Commercial building material supplier</div>

  <!-- Divider -->
  <div style="
    width: 60px; height: 3px;
    background: ${brand.coral};
    border-radius: 2px;
    margin-bottom: ${isPortrait ? 50 : 35}px;
  "></div>

  <!-- Stat highlight -->
  <div style="
    text-align: center;
    position: relative; z-index: 1;
    margin-bottom: ${isPortrait ? 40 : 25}px;
  ">
    <div style="
      font-family: 'Poppins', sans-serif;
      font-size: ${statSize}px;
      font-weight: 900;
      color: ${brand.coral};
      line-height: 1;
    ">28%</div>
    <div style="
      font-size: ${isPortrait ? 18 : 16}px;
      color: ${brand.text};
      font-weight: 500;
      margin-top: 8px;
    ">cold email open rate</div>
    <div style="
      font-size: ${isPortrait ? 14 : 13}px;
      color: ${brand.gray};
      margin-top: 4px;
    ">using project names in subject lines</div>
  </div>

  <!-- What you get -->
  <div style="
    background: ${brand.white};
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 12px;
    padding: ${isPortrait ? 24 : 18}px ${isPortrait ? 32 : 24}px;
    max-width: ${w - pad * 2 - 20}px;
    width: 100%;
    position: relative; z-index: 1;
    margin-bottom: ${isPortrait ? 40 : 25}px;
  ">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div style="text-align:center; flex:1;">
        <div style="font-weight:800; color:${brand.navy}; font-size:${isPortrait ? 20 : 18}px;">150-250</div>
        <div style="color:${brand.gray}; font-size:${isPortrait ? 12 : 11}px;">projects/week</div>
      </div>
      <div style="width:1px; height:30px; background:#E5E5E7;"></div>
      <div style="text-align:center; flex:1;">
        <div style="font-weight:800; color:${brand.navy}; font-size:${isPortrait ? 20 : 18}px;">Monday</div>
        <div style="color:${brand.gray}; font-size:${isPortrait ? 12 : 11}px;">Excel delivery</div>
      </div>
      <div style="width:1px; height:30px; background:#E5E5E7;"></div>
      <div style="text-align:center; flex:1;">
        <div style="font-weight:800; color:${brand.navy}; font-size:${isPortrait ? 20 : 18}px;">$199</div>
        <div style="color:${brand.gray}; font-size:${isPortrait ? 12 : 11}px;">/month</div>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div style="
    background: ${brand.coral};
    border-radius: 30px;
    padding: 16px 44px;
    color: ${brand.white};
    font-size: ${isPortrait ? 20 : 18}px;
    font-weight: 700;
    position: relative; z-index: 1;
  ">See if your team qualifies</div>

  <!-- Footer -->
  <div style="
    margin-top: ${isPortrait ? 20 : 14}px;
    color: ${brand.gray}; font-size: 13px;
    position: relative; z-index: 1;
  ">30-day free trial &middot; No contract &middot; No software</div>
</div>`;
}

// ─── CONCEPT 3: GAP CHART ───────────────────────────────────────────────────
function gapChart(w, h) {
  const isPortrait = h > w;
  const pad = isPortrait ? 60 : 50;
  const titleSize = isPortrait ? 38 : 34;
  const barHeight = isPortrait ? 56 : 48;

  return `
<div style="
  width:${w}px; height:${h}px;
  background: ${brand.navy};
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding: ${pad}px;
  position: relative;
">
  <!-- Grid overlay -->
  <div style="
    position:absolute; inset:0; opacity:0.03;
    background-image:
      linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
    background-size: 40px 40px;
  "></div>

  <!-- Top label -->
  <div style="
    color: ${brand.gray}; font-size: 14px;
    letter-spacing: 3px; text-transform: uppercase;
    font-weight: 600; margin-bottom: ${isPortrait ? 24 : 16}px;
    position: relative; z-index: 1;
  ">The Visibility Problem</div>

  <!-- Headline -->
  <div style="
    font-family: 'Poppins', sans-serif;
    color: ${brand.white}; font-size: ${titleSize}px;
    font-weight: 800; text-align: center;
    line-height: 1.2; margin-bottom: ${isPortrait ? 60 : 40}px;
    position: relative; z-index: 1;
    max-width: ${w - pad * 2}px;
  ">How many projects is<br>your team missing?</div>

  <!-- Bar chart container -->
  <div style="
    width: ${w - pad * 2 - 40}px;
    position: relative; z-index: 1;
  ">
    <!-- Bar 1: All projects -->
    <div style="margin-bottom: 16px;">
      <div style="
        display:flex; justify-content:space-between; align-items:center;
        margin-bottom: 8px;
      ">
        <span style="color:${brand.white}; font-size:15px; font-weight:600;">Projects in your market</span>
        <span style="color:${brand.green}; font-size:15px; font-weight:700;">100%</span>
      </div>
      <div style="
        width:100%; height:${barHeight}px;
        background: linear-gradient(90deg, ${brand.green}, #2DBF56);
        border-radius: 8px;
        display:flex; align-items:center; padding-left:20px;
      ">
        <span style="color:${brand.white}; font-weight:800; font-size:${isPortrait ? 20 : 18}px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
          Full market
        </span>
      </div>
    </div>

    <!-- Bar 2: What you see -->
    <div style="margin-bottom: 16px;">
      <div style="
        display:flex; justify-content:space-between; align-items:center;
        margin-bottom: 8px;
      ">
        <span style="color:${brand.white}; font-size:15px; font-weight:600;">Projects your team sees</span>
        <span style="color:${brand.coral}; font-size:15px; font-weight:700;">~55%</span>
      </div>
      <div style="position:relative; width:100%; height:${barHeight}px;">
        <!-- Ghost bar -->
        <div style="
          position:absolute; width:100%; height:100%;
          background: rgba(255,92,92,0.08);
          border: 1px dashed rgba(255,92,92,0.2);
          border-radius: 8px;
        "></div>
        <!-- Actual bar -->
        <div style="
          position:absolute; width:55%; height:100%;
          background: linear-gradient(90deg, ${brand.coral}, #FF7A7A);
          border-radius: 8px;
          display:flex; align-items:center; padding-left:20px;
        ">
          <span style="color:${brand.white}; font-weight:800; font-size:${isPortrait ? 20 : 18}px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
            Your team
          </span>
        </div>
        <!-- Gap label -->
        <div style="
          position:absolute; right: 10px; top:50%; transform:translateY(-50%);
          color: rgba(255,92,92,0.6); font-size:${isPortrait ? 16 : 14}px; font-weight:700;
          font-style:italic;
        ">
          &larr; the gap
        </div>
      </div>
    </div>
  </div>

  <!-- Gap explanation -->
  <div style="
    max-width: ${w - pad * 2 - 40}px;
    margin-top: ${isPortrait ? 40 : 25}px;
    position: relative; z-index: 1;
    text-align: center;
  ">
    <div style="color:${brand.white}; font-size:${isPortrait ? 20 : 18}px; font-weight:700; line-height:1.5;">
      Every project in the gap is a spec written<br>without you in the room.
    </div>
    <div style="color:${brand.gray}; font-size:${isPortrait ? 16 : 14}px; margin-top:12px; line-height:1.5;">
      ProjectPro delivers 150-250 planning-stage projects<br>every Monday. Architect contacts included.
    </div>
  </div>

  <!-- Price + trial -->
  <div style="
    margin-top: ${isPortrait ? 40 : 25}px;
    display: flex; gap: 20px; align-items:center;
    position: relative; z-index: 1;
  ">
    <div style="text-align:center;">
      <span style="color:${brand.white}; font-size:${isPortrait ? 28 : 24}px; font-weight:900; font-family:'Poppins',sans-serif;">$199</span>
      <span style="color:${brand.gray}; font-size:14px;">/mo</span>
    </div>
    <div style="color:${brand.gray}; font-size:14px;">|</div>
    <div style="color:${brand.gray}; font-size:14px;">30-day free trial</div>
    <div style="color:${brand.gray}; font-size:14px;">|</div>
    <div style="color:${brand.gray}; font-size:14px;">Excel delivery</div>
  </div>

  <!-- CTA -->
  <div style="
    margin-top: ${isPortrait ? 40 : 25}px;
    border: 2px solid ${brand.coral}; border-radius: 30px;
    padding: 14px 40px;
    color: ${brand.coral}; font-size: ${isPortrait ? 20 : 18}px; font-weight: 700;
    position: relative; z-index: 1;
  ">See if your team qualifies</div>
</div>`;
}

// ─── GENERATE ALL ───────────────────────────────────────────────────────────
async function generateAll() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const concepts = [
    { name: 'spec_timeline', fn: specTimeline },
    { name: 'quote_card',    fn: quoteCard },
    { name: 'gap_chart',     fn: gapChart },
  ];

  const sizes = [
    { suffix: 'sq',   w: 1080, h: 1080 },
    { suffix: 'port', w: 1080, h: 1920 },
  ];

  for (const concept of concepts) {
    for (const size of sizes) {
      const filename = `${concept.name}_${size.suffix}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      console.log(`Generating ${filename} (${size.w}x${size.h})...`);

      const html = htmlShell(size.w, size.h, concept.fn(size.w, size.h));
      const page = await browser.newPage();
      await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Wait for Google Fonts to load
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 500));

      await page.screenshot({ path: filepath, type: 'png' });
      await page.close();

      const stats = fs.statSync(filepath);
      console.log(`  -> ${filename} (${(stats.size / 1024).toFixed(0)}KB)`);
    }
  }

  await browser.close();
  console.log('\nDone! All creatives generated.');
}

generateAll().catch(console.error);
