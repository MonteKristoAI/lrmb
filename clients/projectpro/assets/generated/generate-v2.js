const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const toB64 = (f) => fs.readFileSync(path.join(DIR, f)).toString('base64');

function shell(w, h, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box;}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
</style></head><body>${body}</body></html>`;
}

// ════════════════════════════════════════════════════════════════
// AD 1: "Your Competitor Got Specified 3 Months Ago"
// Layout: Headline top-left on dark wood zone, blueprints bottom-right
// Overlay: Localized radial gradient only where text lives
// ════════════════════════════════════════════════════════════════
function ad1(w, h) {
  const bg = toB64('v2_bg_ad1_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Localized gradient: dark only top-left where text sits -->
  <div style="position:absolute;inset:0;
    background:radial-gradient(ellipse at 15% 20%,
      rgba(4,17,34,0.75) 0%,
      rgba(4,17,34,0.4) 35%,
      rgba(4,17,34,0.1) 55%,
      transparent 75%
    );"></div>

  <!-- Very subtle overall tint for cohesion -->
  <div style="position:absolute;inset:0;background:rgba(4,17,34,0.15);"></div>

  <!-- Text content -->
  <div style="position:absolute;top:${isP?60:50}px;left:${isP?50:50}px;right:${isP?50:400}px;">
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FFFFFF;
      font-size:${isP?56:58}px;
      font-weight:900;
      line-height:1.08;
      text-shadow: 0 2px 12px rgba(0,0,0,0.7), 0 4px 30px rgba(0,0,0,0.5);
      letter-spacing:-1px;
    ">Your<br>Competitor<br>Got Specified<br><span style="color:#FF5C5C;">3 Months Ago.</span></div>

    <div style="
      margin-top:${isP?24:20}px;
      color:rgba(255,255,255,0.6);
      font-size:${isP?17:16}px;
      line-height:1.5;
      max-width:420px;
      text-shadow: 0 1px 6px rgba(0,0,0,0.6);
    ">The spec was locked before the bid<br>hit your desk.</div>
  </div>

  <!-- Bottom CTA bar with glassmorphism -->
  <div style="
    position:absolute;bottom:${isP?50:40}px;left:50px;right:50px;
    display:flex;align-items:center;justify-content:space-between;
  ">
    <div style="
      background:rgba(4,17,34,0.5);
      backdrop-filter:blur(16px);
      -webkit-backdrop-filter:blur(16px);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:12px;
      padding:16px 24px;
      display:flex;gap:24px;align-items:center;
    ">
      <div>
        <div style="color:#FF5C5C;font-size:22px;font-weight:900;font-family:'Poppins',sans-serif;">150-250</div>
        <div style="color:rgba(255,255,255,0.4);font-size:10px;text-transform:uppercase;letter-spacing:1px;">projects/week</div>
      </div>
      <div style="width:1px;height:28px;background:rgba(255,255,255,0.1);"></div>
      <div>
        <div style="color:#fff;font-size:22px;font-weight:900;font-family:'Poppins',sans-serif;">95%</div>
        <div style="color:rgba(255,255,255,0.4);font-size:10px;text-transform:uppercase;letter-spacing:1px;">pre-bid stage</div>
      </div>
    </div>
    <div style="
      background:#FF5C5C;border-radius:50px;
      padding:14px 32px;
      color:#fff;font-size:15px;font-weight:700;
      box-shadow:0 4px 20px rgba(255,92,92,0.4);
    ">Get Your First Monday List</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// AD 3: "Stop Finding Projects After Specs Are Locked"
// Layout: Headline centered on sky zone, steel beams frame bottom
// Overlay: Very light top tint, heavier at center for text readability
// ════════════════════════════════════════════════════════════════
function ad3(w, h) {
  const bg = toB64('v2_bg_ad3_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Gradient: darken the sky zone where headline sits, light at bottom where beams are -->
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,
      rgba(4,17,34,0.7) 0%,
      rgba(4,17,34,0.5) 25%,
      rgba(4,17,34,0.2) 50%,
      rgba(4,17,34,0.1) 70%,
      rgba(4,17,34,0.6) 100%
    );"></div>

  <!-- Centered headline in the sky zone -->
  <div style="
    position:absolute;
    top:${isP?'12%':'8%'};left:0;right:0;
    display:flex;flex-direction:column;align-items:center;
    padding:0 60px;
  ">
    <div style="
      font-family:'Poppins',sans-serif;color:#FFFFFF;
      font-size:${isP?50:52}px;font-weight:900;
      text-align:center;line-height:1.1;
      text-shadow:0 2px 16px rgba(0,0,0,0.6),0 0 60px rgba(0,0,0,0.3);
      letter-spacing:-1px;
    ">Stop Finding<br>Projects After<br>Specs Are <span style="color:#FF5C5C;">Locked.</span></div>

    <div style="
      margin-top:20px;
      color:rgba(255,255,255,0.55);font-size:16px;
      text-align:center;line-height:1.5;
      text-shadow:0 1px 8px rgba(0,0,0,0.5);
    ">Your competitor is already in the drawings.<br>Your rep shows up and competes on price.</div>
  </div>

  <!-- Bottom: glassmorphism card with stats + CTA -->
  <div style="
    position:absolute;bottom:${isP?50:35}px;left:40px;right:40px;
    background:rgba(4,17,34,0.55);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:16px;
    padding:20px 28px;
    display:flex;align-items:center;justify-content:space-between;
  ">
    <div style="display:flex;gap:20px;">
      <div>
        <div style="color:#FF5C5C;font-size:20px;font-weight:900;font-family:'Poppins';">150-250</div>
        <div style="color:rgba(255,255,255,0.4);font-size:9px;text-transform:uppercase;letter-spacing:1px;">early-stage projects</div>
      </div>
      <div style="width:1px;height:28px;background:rgba(255,255,255,0.1);"></div>
      <div>
        <div style="color:#fff;font-size:20px;font-weight:900;font-family:'Poppins';">Direct</div>
        <div style="color:rgba(255,255,255,0.4);font-size:9px;text-transform:uppercase;letter-spacing:1px;">architect contacts</div>
      </div>
    </div>
    <div style="
      background:#FF5C5C;border-radius:50px;
      padding:12px 28px;
      color:#fff;font-size:14px;font-weight:700;
      box-shadow:0 4px 20px rgba(255,92,92,0.35);
    ">See What You're Missing</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// AD 5: "$0.52 Per Lead vs. What You Pay Now"
// Layout: Stat-led. Massive $0.52 number dominates. Abstract dark bg.
// Overlay: Minimal - background is already dark
// ════════════════════════════════════════════════════════════════
function ad5(w, h) {
  const bg = toB64('v2_bg_ad5_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Minimal overlay - bg is already dark -->
  <div style="position:absolute;inset:0;background:rgba(4,17,34,0.25);"></div>

  <!-- Content: stat-led layout -->
  <div style="
    position:absolute;inset:0;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:${isP?'80px 50px':'60px 50px'};
    text-align:center;
  ">
    <!-- Small tag -->
    <div style="
      color:rgba(255,255,255,0.35);font-size:11px;font-weight:600;
      text-transform:uppercase;letter-spacing:3px;
      margin-bottom:${isP?30:20}px;
    ">Commercial Construction Leads</div>

    <!-- Massive stat -->
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FF5C5C;
      font-size:${isP?120:100}px;
      font-weight:900;
      line-height:0.9;
      text-shadow:0 0 60px rgba(255,92,92,0.3);
      letter-spacing:-3px;
    ">$0.52</div>

    <div style="
      color:rgba(255,255,255,0.5);font-size:${isP?18:16}px;font-weight:500;
      margin-top:8px;letter-spacing:1px;
    ">per lead</div>

    <!-- vs line -->
    <div style="
      margin:${isP?40:28}px 0;
      display:flex;align-items:center;gap:16px;
    ">
      <div style="width:60px;height:1px;background:rgba(255,255,255,0.15);"></div>
      <div style="color:rgba(255,255,255,0.3);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">vs</div>
      <div style="width:60px;height:1px;background:rgba(255,255,255,0.15);"></div>
    </div>

    <!-- Competitor price -->
    <div style="
      color:rgba(255,255,255,0.7);
      font-size:${isP?28:24}px;
      font-weight:700;
      font-family:'Poppins',sans-serif;
    ">$6,000-$15,000/yr</div>
    <div style="
      color:rgba(255,255,255,0.35);font-size:13px;margin-top:4px;
    ">for premium databases with the same projects everyone else sees</div>

    <!-- Separator -->
    <div style="width:40px;height:2px;background:#FF5C5C;border-radius:1px;margin:${isP?36:24}px 0;opacity:0.5;"></div>

    <!-- Key difference -->
    <div style="
      color:rgba(255,255,255,0.55);font-size:${isP?16:15}px;line-height:1.6;
      max-width:500px;
    ">150-250 planning-stage projects every Monday.<br>Architect contacts. Direct phone. Direct email.<br>3-6 months before bid stage.</div>

    <!-- CTA -->
    <div style="
      margin-top:${isP?40:28}px;
      border:2px solid #FF5C5C;border-radius:50px;
      padding:14px 36px;
      color:#FF5C5C;font-size:15px;font-weight:700;
      transition:all 0.2s;
    ">Start Your Free Trial</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// GENERATE
// ════════════════════════════════════════════════════════════════
async function main() {
  console.log('Generating V2 creatives...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  const ads = [
    { fn: ad1, name: 'v2_ad1' },
    { fn: ad3, name: 'v2_ad3' },
    { fn: ad5, name: 'v2_ad5' },
  ];

  const sizes = [
    { suffix: 'sq', w: 1080, h: 1080 },
    { suffix: 'port', w: 1080, h: 1350 },
  ];

  for (const ad of ads) {
    for (const size of sizes) {
      const filepath = path.join(DIR, `${ad.name}_${size.suffix}.png`);
      console.log(`  ${ad.name}_${size.suffix}.png (${size.w}x${size.h})...`);

      const html = shell(size.w, size.h, ad.fn(size.w, size.h));
      const page = await browser.newPage();
      await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: filepath, type: 'png' });
      await page.close();

      const kb = (fs.statSync(filepath).size / 1024).toFixed(0);
      console.log(`    -> ${kb}KB`);
    }
  }

  await browser.close();
  console.log('Done.');
}

main().catch(console.error);
