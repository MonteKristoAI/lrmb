const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

// ProjectPro Brand Tokens (extracted from their landing page)
const PP = {
  bg:      '#0C0A08',
  bgLight: '#1a1714',
  accent:  '#C85A1E',
  accentGlow: 'rgba(200,90,30,0.3)',
  text:    '#F0EBE3',
  textDim: 'rgba(240,235,227,0.5)',
  textFaint: 'rgba(240,235,227,0.3)',
  red:     '#CC3333',
  headingFont: "'Barlow Condensed',sans-serif",
  bodyFont: "'DM Sans',sans-serif",
  radius:  '3px',
};

function shell(w, h, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:${PP.bodyFont};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:${PP.bg};}
</style></head><body>${body}</body></html>`;
}

function cta(text, w, isP) {
  return `<div style="
    width:100%;
    background:${PP.accent};
    border-radius:${PP.radius};
    padding:${isP?'22px 0':'18px 0'};
    text-align:center;
    font-family:${PP.bodyFont};
    font-weight:800;
    font-size:${isP?22:20}px;
    color:#FFFFFF;
    letter-spacing:0.5px;
    box-shadow:0 0 28px ${PP.accentGlow}, 0 4px 12px rgba(0,0,0,0.3);
  ">${text}</div>`;
}

// ════════════════════════════════════════════════════════════════════
// CONCEPT 1: THE PIPELINE COUNTER
// A massive number "237" dominates like a scoreboard.
// "Projects delivered to your inbox last Monday"
// Three inline stats. CTA at bottom.
// ════════════════════════════════════════════════════════════════════
function concept1(w, h) {
  const isP = h > w;
  const numSize = isP ? Math.round(h * 0.30) : Math.round(h * 0.35);
  const labelSize = isP ? Math.round(w * 0.08) : Math.round(w * 0.075);
  const subSize = isP ? Math.round(w * 0.035) : Math.round(w * 0.03);
  const statSize = isP ? Math.round(w * 0.028) : Math.round(w * 0.025);

  return `
<div style="width:${w}px;height:${h}px;background:${PP.bg};
  display:flex;flex-direction:column;align-items:center;
  padding:${isP?'48px 56px':'40px 56px'};position:relative;">

  <!-- Logo placeholder -->
  <div style="
    font-family:${PP.headingFont};font-weight:700;
    font-size:${isP?20:18}px;color:${PP.text};
    letter-spacing:2px;text-transform:uppercase;
    opacity:0.6;margin-bottom:${isP?16:12}px;
  ">PROJECTPRO</div>

  <!-- Main counter zone -->
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <!-- The number -->
    <div style="
      font-family:${PP.headingFont};font-weight:900;
      font-size:${numSize}px;
      line-height:0.85;
      color:${PP.accent};
      letter-spacing:-8px;
      text-shadow:0 0 80px ${PP.accentGlow};
    ">237</div>

    <!-- Label -->
    <div style="
      font-family:${PP.headingFont};font-weight:700;
      font-size:${labelSize}px;
      color:${PP.text};
      text-transform:uppercase;
      letter-spacing:6px;
      margin-top:${isP?12:8}px;
    ">PROJECTS</div>

    <!-- Subtitle -->
    <div style="
      font-size:${subSize}px;
      color:${PP.textDim};
      margin-top:${isP?16:12}px;
      text-align:center;
    ">delivered to your inbox last Monday</div>
  </div>

  <!-- Three stats row -->
  <div style="
    width:100%;
    display:flex;align-items:center;justify-content:center;
    gap:0;
    margin-bottom:${isP?28:20}px;
  ">
    <div style="flex:1;text-align:center;padding:0 12px;">
      <div style="font-family:${PP.headingFont};font-weight:800;font-size:${isP?20:18}px;color:${PP.text};">$2.1B+</div>
      <div style="font-size:${statSize}px;color:${PP.textFaint};margin-top:2px;">total project value</div>
    </div>
    <div style="width:1px;height:32px;background:${PP.accent};opacity:0.3;"></div>
    <div style="flex:1;text-align:center;padding:0 12px;">
      <div style="font-family:${PP.headingFont};font-weight:800;font-size:${isP?20:18}px;color:${PP.text};">Pre-Bid</div>
      <div style="font-size:${statSize}px;color:${PP.textFaint};margin-top:2px;">planning stage</div>
    </div>
    <div style="width:1px;height:32px;background:${PP.accent};opacity:0.3;"></div>
    <div style="flex:1;text-align:center;padding:0 12px;">
      <div style="font-family:${PP.headingFont};font-weight:800;font-size:${isP?20:18}px;color:${PP.text};">Direct</div>
      <div style="font-size:${statSize}px;color:${PP.textFaint};margin-top:2px;">architect contacts</div>
    </div>
  </div>

  ${cta("See This Week's Projects", w, isP)}
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// CONCEPT 3: THE MONDAY MORNING
// Simulated email notification card at top.
// "While your competitors search for leads, yours are already
// in your inbox."
// ════════════════════════════════════════════════════════════════════
function concept3(w, h) {
  const isP = h > w;
  const hlSize = isP ? Math.round(w * 0.095) : Math.round(w * 0.085);
  const hlAccentSize = isP ? Math.round(w * 0.11) : Math.round(w * 0.10);
  const bodySize = isP ? Math.round(w * 0.03) : Math.round(w * 0.028);

  return `
<div style="width:${w}px;height:${h}px;background:${PP.bg};
  display:flex;flex-direction:column;
  padding:${isP?'40px 44px':'32px 44px'};position:relative;">

  <!-- Fake notification bar -->
  <div style="
    display:flex;justify-content:space-between;align-items:center;
    margin-bottom:${isP?24:16}px;
    padding:0 4px;
  ">
    <div style="font-size:14px;color:${PP.textFaint};">Mon 7:02 AM</div>
    <div style="display:flex;gap:6px;align-items:center;">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 11L4 8L7 10L11 4L15 1" stroke="${PP.textFaint}" stroke-width="1.5" stroke-linecap="round"/></svg>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="1" y="8" width="3" height="4" rx="0.5" fill="${PP.textFaint}"/><rect x="5.5" y="5" width="3" height="7" rx="0.5" fill="${PP.textFaint}"/><rect x="10" y="2" width="3" height="10" rx="0.5" fill="${PP.textFaint}"/><rect x="14.5" y="0" width="3" height="12" rx="0.5" fill="${PP.textFaint}"/></svg>
    </div>
  </div>

  <!-- Email notification card -->
  <div style="
    background:${PP.bgLight};
    border:1px solid rgba(200,90,30,0.15);
    border-radius:12px;
    padding:${isP?'24px 28px':'20px 24px'};
    margin-bottom:${isP?40:28}px;
  ">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="
        width:36px;height:36px;border-radius:8px;
        background:${PP.accent};
        display:flex;align-items:center;justify-content:center;
        font-family:${PP.headingFont};font-weight:900;font-size:18px;color:#fff;
      ">P</div>
      <div>
        <div style="font-weight:700;font-size:${isP?17:16}px;color:${PP.text};">ProjectPro</div>
        <div style="font-size:${isP?14:13}px;color:${PP.textDim};">just now</div>
      </div>
    </div>
    <div style="font-weight:700;font-size:${isP?20:18}px;color:${PP.text};margin-bottom:6px;">
      Your 214 Projects for April 7-11
    </div>
    <div style="font-size:${isP?15:14}px;color:${PP.textDim};line-height:1.4;">
      Southeast Region: 214 commercial projects, $890M total value. Excel attached.
    </div>
  </div>

  <!-- Main text: the punch -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <div style="
      font-family:${PP.headingFont};font-weight:700;
      font-size:${hlSize}px;
      line-height:1.05;
      color:${PP.textDim};
    ">While your competitors<br>search for leads</div>

    <div style="
      font-family:${PP.headingFont};font-weight:900;
      font-size:${hlAccentSize}px;
      line-height:1.0;
      color:${PP.accent};
      margin-top:${isP?12:8}px;
      text-shadow:0 0 40px ${PP.accentGlow};
    ">yours are already<br>in your inbox.</div>
  </div>

  <!-- Proof points -->
  <div style="margin-bottom:${isP?24:16}px;">
    <div style="font-size:${bodySize}px;color:${PP.text};font-weight:600;line-height:1.5;">
      150-250 early-stage projects weekly
    </div>
    <div style="font-size:${bodySize}px;color:${PP.textDim};line-height:1.5;">
      Excel format. Your territory. Pre-bid stage.
    </div>
  </div>

  ${cta('Get Your First Monday List', w, isP)}
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// CONCEPT 2: THE TIMELINE KILLER
// Horizontal timeline SVG showing construction stages.
// "Planning" highlighted with ProjectPro, "Bidding" crossed out.
// ════════════════════════════════════════════════════════════════════
function concept2(w, h) {
  const isP = h > w;
  const hlSize = isP ? Math.round(w * 0.085) : Math.round(w * 0.08);
  const stageSize = isP ? 15 : 14;
  const nodeR = isP ? 10 : 8;
  const pad = isP ? 48 : 44;
  const timelineW = w - pad * 2 - 20;
  const gap = Math.round(timelineW / 4);

  const stages = ['Planning', 'Pre-Bid', 'Bidding', 'Awarded', 'Construction'];
  const nodes = stages.map((s, i) => {
    const x = 10 + gap * i;
    const isPlanning = i <= 1;
    const isBidding = i === 2;
    const fill = isPlanning ? PP.accent : (isBidding ? PP.red : `${PP.textFaint}`);
    const opacity = isPlanning ? 1 : (isBidding ? 0.8 : 0.3);
    return { x, label: s, fill, opacity, isPlanning, isBidding };
  });

  const timelineSVG = `
    <svg width="${timelineW}" height="120" viewBox="0 0 ${timelineW} 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Line -->
      <line x1="${nodes[0].x}" y1="40" x2="${nodes[4].x}" y2="40" stroke="${PP.textFaint}" stroke-width="2"/>
      <!-- Highlighted segment -->
      <line x1="${nodes[0].x}" y1="40" x2="${nodes[1].x}" y2="40" stroke="${PP.accent}" stroke-width="3"/>
      ${nodes.map(n => `
        <circle cx="${n.x}" cy="40" r="${nodeR}" fill="${n.fill}" opacity="${n.opacity}"/>
        <text x="${n.x}" y="72" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="${stageSize}" font-weight="${n.isPlanning?'700':'500'}" fill="${n.isPlanning ? PP.text : (n.isBidding ? PP.red : PP.textFaint)}">${n.label}</text>
        ${n.isPlanning && n.label === 'Planning' ? `<text x="${n.x}" y="92" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" font-weight="700" fill="${PP.accent}">ProjectPro</text>` : ''}
        ${n.isBidding ? `<text x="${n.x}" y="92" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="500" fill="${PP.textFaint}" text-decoration="line-through">Others find here</text>` : ''}
      `).join('')}
      <!-- Bracket under Planning-PreBid -->
      <path d="M${nodes[0].x} 100 L${nodes[0].x} 108 L${nodes[1].x} 108 L${nodes[1].x} 100" stroke="${PP.accent}" stroke-width="1.5" fill="none" opacity="0.5"/>
      <text x="${(nodes[0].x + nodes[1].x)/2}" y="118" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="600" fill="${PP.accent}">3-6 months before bid</text>
    </svg>
  `;

  return `
<div style="width:${w}px;height:${h}px;background:${PP.bg};
  display:flex;flex-direction:column;
  padding:${pad}px;position:relative;">

  <!-- Top label -->
  <div style="
    font-size:${isP?16:15}px;color:${PP.textDim};
    text-align:center;margin-bottom:${isP?32:24}px;
  ">Your competitors find projects here:</div>

  <!-- Timeline SVG -->
  <div style="
    display:flex;justify-content:center;
    margin-bottom:${isP?40:28}px;
  ">${timelineSVG}</div>

  <!-- Main headline -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <div style="
      font-family:${PP.headingFont};font-weight:700;
      font-size:${hlSize}px;line-height:1.05;
      color:${PP.text};text-align:center;
    ">Reach decision-makers<br><span style="color:${PP.accent};font-weight:900;">before the bid list closes.</span></div>

    <div style="
      font-size:${isP?Math.round(w*0.038):Math.round(w*0.035)}px;
      color:${PP.accent};font-weight:600;
      text-align:center;margin-top:${isP?20:14}px;
    ">150-250 pre-bid commercial projects. Every week.</div>
  </div>

  <!-- Logo + CTA -->
  <div style="margin-top:${isP?20:16}px;">
    ${cta('Get Early-Stage Projects', w, isP)}
    <div style="
      text-align:center;margin-top:12px;
      font-family:${PP.headingFont};font-weight:600;
      font-size:16px;color:${PP.textFaint};
      letter-spacing:2px;text-transform:uppercase;
    ">PROJECTPRO</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// CONCEPT 4: THE MAP GRID
// Abstract tile grid suggesting territory coverage with project counts.
// "Every commercial project in your territory."
// ════════════════════════════════════════════════════════════════════
function concept4(w, h) {
  const isP = h > w;
  const hlSize = isP ? Math.round(w * 0.075) : Math.round(w * 0.07);
  const hlAccentSize = isP ? Math.round(w * 0.095) : Math.round(w * 0.088);
  const tileSize = isP ? Math.round((w - 120) / 6) : Math.round((w - 120) / 6);
  const tileGap = 8;

  const counts = [
    [12, 0, 0, 8, 34, 22],
    [0, 18, 52, 41, 27, 15],
    [6, 31, 48, 63, 19, 0],
    [0, 14, 37, 28, 9, 0],
  ];
  const hot = [[0,4],[0,5],[1,2],[1,3],[1,4],[2,2],[2,3]];
  const isHot = (r, c) => hot.some(([hr, hc]) => hr === r && hc === c);

  const tiles = counts.map((row, ri) => row.map((count, ci) => {
    if (count === 0) return `<div style="width:${tileSize}px;height:${tileSize}px;"></div>`;
    const h = isHot(ri, ci);
    return `<div style="
      width:${tileSize}px;height:${tileSize}px;
      background:${h ? `linear-gradient(135deg,${PP.accent},${PP.bg})` : PP.bgLight};
      border-radius:6px;
      display:flex;align-items:center;justify-content:center;
      font-family:${PP.headingFont};font-weight:${h?'800':'600'};
      font-size:${h ? (isP?20:18) : (isP?16:14)}px;
      color:${h ? PP.text : PP.textFaint};
      ${h ? `box-shadow:0 0 16px ${PP.accentGlow};` : ''}
    ">${count}</div>`;
  }).join('')).map(row => `<div style="display:flex;gap:${tileGap}px;">${row}</div>`).join('');

  return `
<div style="width:${w}px;height:${h}px;background:${PP.bg};
  display:flex;flex-direction:column;
  padding:${isP?'48px 44px':'40px 44px'};position:relative;">

  <!-- Logo -->
  <div style="
    font-family:${PP.headingFont};font-weight:700;
    font-size:${isP?18:16}px;color:${PP.textFaint};
    letter-spacing:2px;text-transform:uppercase;
    text-align:center;margin-bottom:${isP?24:16}px;
  ">PROJECTPRO</div>

  <!-- Grid -->
  <div style="
    display:flex;flex-direction:column;
    align-items:center;
    gap:${tileGap}px;
    margin-bottom:${isP?16:12}px;
  ">${tiles}</div>

  <!-- Legend -->
  <div style="
    display:flex;align-items:center;justify-content:center;
    gap:8px;margin-bottom:${isP?32:24}px;
  ">
    <div style="width:12px;height:12px;border-radius:3px;background:${PP.accent};"></div>
    <div style="font-size:${isP?15:14}px;color:${PP.textDim};">Your coverage area: <span style="color:${PP.text};font-weight:700;">214 active projects</span></div>
  </div>

  <!-- Headline -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <div style="
      font-family:${PP.headingFont};font-weight:700;
      font-size:${hlSize}px;line-height:1.05;
      color:${PP.text};text-align:center;
    ">Every commercial project</div>
    <div style="
      font-family:${PP.headingFont};font-weight:900;
      font-size:${hlAccentSize}px;line-height:1.0;
      color:${PP.accent};text-align:center;
      text-shadow:0 0 30px ${PP.accentGlow};
      margin-top:4px;
    ">in your territory.</div>
    <div style="
      font-size:${isP?Math.round(w*0.03):Math.round(w*0.028)}px;
      color:${PP.textDim};text-align:center;
      margin-top:${isP?12:8}px;
    ">Before anyone else sees them.</div>
  </div>

  ${cta('Claim Your Territory', w, isP)}
</div>`;
}

// ════════════════════════════════════════════════════════════════════
async function main() {
  console.log('PRO creatives (ProjectPro branded)...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const ads = [
    { fn: concept1, name: 'pro_counter' },
    { fn: concept2, name: 'pro_timeline' },
    { fn: concept3, name: 'pro_monday' },
    { fn: concept4, name: 'pro_mapgrid' },
  ];
  const sizes = [
    { suffix: 'sq', w: 1080, h: 1080 },
    { suffix: 'port', w: 1080, h: 1350 },
  ];
  for (const ad of ads) {
    for (const size of sizes) {
      const fp = path.join(DIR, `${ad.name}_${size.suffix}.png`);
      const page = await browser.newPage();
      await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 });
      await page.setContent(shell(size.w, size.h, ad.fn(size.w, size.h)), { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: fp, type: 'png' });
      await page.close();
      console.log(`  ${ad.name}_${size.suffix} (${(fs.statSync(fp).size/1024).toFixed(0)}KB)`);
    }
  }
  await browser.close();
  console.log('Done.');
}
main().catch(console.error);
