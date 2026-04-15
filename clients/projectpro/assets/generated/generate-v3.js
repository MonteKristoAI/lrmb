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
// MASSIVE headline, nothing else except a tiny CTA
// Headline IS the ad. Background supports, doesn't compete.
// ════════════════════════════════════════════════════════════════
function ad1(w, h) {
  const bg = toB64('v2_bg_ad1_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Heavy localized gradient where text lives -->
  <div style="position:absolute;inset:0;
    background:radial-gradient(ellipse at 25% ${isP?'35%':'40%'},
      rgba(0,0,0,0.85) 0%,
      rgba(0,0,0,0.6) 30%,
      rgba(0,0,0,0.2) 60%,
      transparent 80%
    );"></div>

  <!-- JUST the headline. Nothing else competes. -->
  <div style="
    position:absolute;
    top:${isP?'15%':'12%'};
    left:${isP?48:48}px;
    right:${isP?48:120}px;
  ">
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FFFFFF;
      font-size:${isP?88:82}px;
      font-weight:900;
      line-height:0.95;
      letter-spacing:-3px;
      text-shadow:
        0 4px 20px rgba(0,0,0,0.8),
        0 8px 40px rgba(0,0,0,0.5);
    ">Your<br>Competitor<br>Got Specified<br><span style="color:#FF5C5C;">3 Months<br>Ago.</span></div>
  </div>

  <!-- Single CTA, small, bottom right -->
  <div style="
    position:absolute;
    bottom:${isP?48:40}px;
    right:48px;
    background:#FF5C5C;
    border-radius:50px;
    padding:16px 36px;
    color:#fff;
    font-size:16px;
    font-weight:700;
    box-shadow:0 4px 24px rgba(255,92,92,0.5);
  ">Get Your First Monday List</div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// AD 3: "Stop Finding Projects After Specs Are Locked"
// Headline centered on the sky. HUGE. Steel frames it.
// Nothing else except small CTA at very bottom.
// ════════════════════════════════════════════════════════════════
function ad3(w, h) {
  const bg = toB64('v2_bg_ad3_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Darken the sky where headline sits -->
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,
      rgba(0,0,0,0.65) 0%,
      rgba(0,0,0,0.35) 35%,
      rgba(0,0,0,0.05) 55%,
      rgba(0,0,0,0.5) 100%
    );"></div>

  <!-- MASSIVE centered headline -->
  <div style="
    position:absolute;
    top:${isP?'8%':'5%'};
    left:0;right:0;
    text-align:center;
    padding:0 40px;
  ">
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FFFFFF;
      font-size:${isP?78:74}px;
      font-weight:900;
      line-height:0.98;
      letter-spacing:-3px;
      text-shadow:
        0 4px 20px rgba(0,0,0,0.7),
        0 8px 50px rgba(0,0,0,0.4);
    ">Stop Finding<br>Projects After<br>Specs Are<br><span style="color:#FF5C5C;">Locked.</span></div>
  </div>

  <!-- CTA at very bottom, centered -->
  <div style="
    position:absolute;
    bottom:${isP?44:32}px;
    left:50%;transform:translateX(-50%);
    background:#FF5C5C;
    border-radius:50px;
    padding:16px 36px;
    color:#fff;
    font-size:16px;
    font-weight:700;
    box-shadow:0 4px 24px rgba(255,92,92,0.5);
    white-space:nowrap;
  ">See What You're Missing</div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// AD 5: "$0.52" - Just the number. ENORMOUS. Nothing else.
// The number IS the scroll-stop. Subtitle tiny below.
// ════════════════════════════════════════════════════════════════
function ad5(w, h) {
  const bg = toB64('v2_bg_ad5_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Minimal tint -->
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.15);"></div>

  <!-- Centered: MASSIVE number + tiny context -->
  <div style="
    position:absolute;inset:0;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:40px;
  ">
    <!-- The number. This IS the ad. -->
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FF5C5C;
      font-size:${isP?200:180}px;
      font-weight:900;
      line-height:0.85;
      letter-spacing:-8px;
      text-shadow:
        0 0 80px rgba(255,92,92,0.3),
        0 4px 20px rgba(0,0,0,0.5);
    ">$0.52</div>

    <!-- Tiny context -->
    <div style="
      color:rgba(255,255,255,0.5);
      font-size:${isP?20:18}px;
      font-weight:500;
      margin-top:12px;
      letter-spacing:2px;
      text-transform:uppercase;
    ">per commercial construction lead</div>

    <!-- Tiny comparison -->
    <div style="
      margin-top:${isP?40:28}px;
      color:rgba(255,255,255,0.3);
      font-size:${isP?16:14}px;
    ">vs $6,000-$15,000/yr for premium databases</div>
  </div>

  <!-- CTA bottom center -->
  <div style="
    position:absolute;
    bottom:${isP?48:36}px;
    left:50%;transform:translateX(-50%);
    border:2px solid rgba(255,92,92,0.7);
    border-radius:50px;
    padding:14px 36px;
    color:#FF5C5C;
    font-size:15px;
    font-weight:700;
    white-space:nowrap;
  ">Start Your Free Trial</div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
async function main() {
  console.log('Generating V3 creatives...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  const ads = [
    { fn: ad1, name: 'v3_ad1' },
    { fn: ad3, name: 'v3_ad3' },
    { fn: ad5, name: 'v3_ad5' },
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
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: fp, type: 'png' });
      await page.close();
      console.log(`  ${ad.name}_${size.suffix}.png (${(fs.statSync(fp).size/1024).toFixed(0)}KB)`);
    }
  }
  await browser.close();
  console.log('Done.');
}
main().catch(console.error);
