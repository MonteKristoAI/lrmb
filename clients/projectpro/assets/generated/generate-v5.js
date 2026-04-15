const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const toB64 = (f) => fs.readFileSync(path.join(DIR, f)).toString('base64');

function shell(w, h, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
</style></head><body>${body}</body></html>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 1: LOSS NARRATIVE
// "Specified Before You Knew."
//
// Design: Full-bleed dark photo. Headline takes 60% of vertical space.
// The headline IS the entire creative. Text so large it's impossible
// to scroll past. Coral accent on key words. Subtle glow on coral.
// Bottom: solid dark strip with one-liner + big CTA button.
// ════════════════════════════════════════════════════════════════════
function ad1(w, h) {
  const bg = toB64('v2_bg_ad1_sq.png');
  const isP = h > w;
  const headlineSize = isP ? 108 : 96;
  const ctaSize = isP ? 20 : 18;
  const stripH = isP ? 130 : 110;

  return `
<div style="width:${w}px;height:${h}px;position:relative;background:#0a0a0a;">
  <!-- Background photo, dimmed -->
  <img src="data:image/png;base64,${bg}" style="
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    opacity:0.35;
  ">

  <!-- Headline zone: centered vertically in the upper area -->
  <div style="
    position:absolute;
    top:0;left:0;right:0;
    height:${h - stripH}px;
    display:flex;flex-direction:column;
    justify-content:center;
    padding:0 ${isP?52:56}px;
  ">
    <div style="
      font-family:'Poppins',sans-serif;
      font-weight:900;
      font-size:${headlineSize}px;
      line-height:0.92;
      letter-spacing:-5px;
      color:#FFFFFF;
    ">Specified<br><span style="
      color:#FF5C5C;
      text-shadow:
        0 0 30px rgba(255,92,92,0.4),
        0 0 60px rgba(255,92,92,0.2);
    ">Before You<br>Knew.</span></div>

    <!-- One supporting line, large enough to read -->
    <div style="
      margin-top:${isP?28:20}px;
      font-size:${isP?24:22}px;
      font-weight:500;
      color:rgba(255,255,255,0.55);
      line-height:1.4;
      max-width:${isP?'90%':'70%'};
    ">The architect locked the spec months before<br>the bid hit your desk.</div>
  </div>

  <!-- Bottom strip: solid, clear, high contrast -->
  <div style="
    position:absolute;
    bottom:0;left:0;right:0;
    height:${stripH}px;
    background:#0d1117;
    border-top:1px solid rgba(255,255,255,0.06);
    display:flex;align-items:center;
    justify-content:space-between;
    padding:0 ${isP?48:52}px;
  ">
    <div>
      <div style="
        font-family:'Poppins',sans-serif;
        font-weight:800;
        font-size:${isP?26:24}px;
        color:#FFFFFF;
      ">150-250 projects every Monday</div>
      <div style="
        font-size:${isP?15:14}px;
        color:rgba(255,255,255,0.4);
        margin-top:4px;
        font-weight:500;
      ">Planning stage. Architect contacts. Direct phone.</div>
    </div>
    <div style="
      background:#FF5C5C;
      border-radius:14px;
      padding:${isP?'20px 36px':'16px 32px'};
      font-size:${ctaSize}px;
      font-weight:800;
      color:#FFFFFF;
      white-space:nowrap;
      box-shadow:
        0 4px 16px rgba(255,92,92,0.4),
        0 0 40px rgba(255,92,92,0.15);
      flex-shrink:0;
      margin-left:24px;
    ">Get Monday's List</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 3: FEAR / HIDDEN SHAME
// "Specs Are Already Locked."
//
// Design: Construction site at twilight. Headline centered on sky.
// Steel beams frame the bottom. Strong glow on "Locked."
// Bottom strip with benefit line + CTA.
// ════════════════════════════════════════════════════════════════════
function ad3(w, h) {
  const bg = toB64('v2_bg_ad3_sq.png');
  const isP = h > w;
  const headlineSize = isP ? 104 : 92;
  const stripH = isP ? 130 : 110;

  return `
<div style="width:${w}px;height:${h}px;position:relative;background:#070b14;">
  <!-- Background: show more of the image here since sky is naturally dark -->
  <img src="data:image/png;base64,${bg}" style="
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    opacity:0.55;
  ">

  <!-- Top gradient to ensure headline readability on sky -->
  <div style="
    position:absolute;top:0;left:0;right:0;height:60%;
    background:linear-gradient(180deg,
      rgba(7,11,20,0.75) 0%,
      rgba(7,11,20,0.3) 60%,
      transparent 100%
    );
  "></div>

  <!-- Headline zone -->
  <div style="
    position:absolute;
    top:0;left:0;right:0;
    height:${h - stripH}px;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:0 40px;
    text-align:center;
  ">
    <div style="
      font-family:'Poppins',sans-serif;
      font-weight:900;
      font-size:${headlineSize}px;
      line-height:0.92;
      letter-spacing:-4px;
      color:#FFFFFF;
      text-shadow:0 4px 30px rgba(0,0,0,0.5);
    ">Specs Are<br>Already<br><span style="
      color:#FF5C5C;
      text-shadow:
        0 0 40px rgba(255,92,92,0.5),
        0 0 80px rgba(255,92,92,0.25),
        0 4px 30px rgba(0,0,0,0.5);
    ">Locked.</span></div>

    <div style="
      margin-top:${isP?28:20}px;
      font-size:${isP?24:22}px;
      font-weight:500;
      color:rgba(255,255,255,0.5);
      text-shadow:0 2px 12px rgba(0,0,0,0.4);
    ">Your competitor is already in the drawings.</div>
  </div>

  <!-- Bottom strip -->
  <div style="
    position:absolute;
    bottom:0;left:0;right:0;
    height:${stripH}px;
    background:#0d1117;
    border-top:1px solid rgba(255,255,255,0.06);
    display:flex;align-items:center;
    justify-content:space-between;
    padding:0 ${isP?48:52}px;
  ">
    <div>
      <div style="
        font-family:'Poppins',sans-serif;
        font-weight:800;
        font-size:${isP?26:24}px;
        color:#FFFFFF;
      ">Get there 3-6 months earlier</div>
      <div style="
        font-size:${isP?15:14}px;
        color:rgba(255,255,255,0.4);
        margin-top:4px;
        font-weight:500;
      ">Architect contacts with direct phone and email.</div>
    </div>
    <div style="
      background:#FF5C5C;
      border-radius:14px;
      padding:${isP?'20px 36px':'16px 32px'};
      font-size:${isP?20:18}px;
      font-weight:800;
      color:#FFFFFF;
      white-space:nowrap;
      box-shadow:
        0 4px 16px rgba(255,92,92,0.4),
        0 0 40px rgba(255,92,92,0.15);
      flex-shrink:0;
      margin-left:24px;
      border-radius:14px;
    ">See What You're Missing</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 5: DATA / COMPARISON
// "$0.52 per lead"
//
// Design: Massive coral number on abstract dark bg with light beam.
// Price comparison underneath. Bottom strip with CTA.
// Glow effect on the dollar amount.
// ════════════════════════════════════════════════════════════════════
function ad5(w, h) {
  const bg = toB64('v2_bg_ad5_sq.png');
  const isP = h > w;
  const numSize = isP ? 220 : 180;
  const stripH = isP ? 120 : 100;

  return `
<div style="width:${w}px;height:${h}px;position:relative;background:#060a12;">
  <img src="data:image/png;base64,${bg}" style="
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    opacity:0.6;
  ">

  <!-- Content zone -->
  <div style="
    position:absolute;
    top:0;left:0;right:0;
    height:${h - stripH}px;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:0 40px;
  ">
    <!-- Massive number -->
    <div style="
      font-family:'Poppins',sans-serif;
      font-weight:900;
      color:#FF5C5C;
      font-size:${numSize}px;
      line-height:0.85;
      letter-spacing:-8px;
      text-shadow:
        0 0 60px rgba(255,92,92,0.35),
        0 0 120px rgba(255,92,92,0.15),
        0 4px 20px rgba(0,0,0,0.4);
    ">$0.52</div>

    <!-- Per lead label -->
    <div style="
      font-family:'Poppins',sans-serif;
      font-weight:700;
      color:rgba(255,255,255,0.6);
      font-size:${isP?28:24}px;
      margin-top:16px;
      letter-spacing:4px;
      text-transform:uppercase;
    ">per lead</div>

    <!-- Divider -->
    <div style="
      width:60px;height:2px;
      background:rgba(255,255,255,0.12);
      margin:${isP?36:28}px 0;
    "></div>

    <!-- Comparison -->
    <div style="
      font-family:'Poppins',sans-serif;
      font-weight:700;
      color:rgba(255,255,255,0.45);
      font-size:${isP?26:22}px;
      text-align:center;
    ">Premium databases charge<br><span style="
      color:rgba(255,255,255,0.7);
      font-size:${isP?32:28}px;
    ">$6,000-$15,000/yr</span></div>
  </div>

  <!-- Bottom strip -->
  <div style="
    position:absolute;
    bottom:0;left:0;right:0;
    height:${stripH}px;
    background:#0d1117;
    border-top:1px solid rgba(255,255,255,0.06);
    display:flex;align-items:center;justify-content:center;
  ">
    <div style="
      background:#FF5C5C;
      border-radius:14px;
      padding:${isP?'20px 52px':'16px 44px'};
      font-size:${isP?22:20}px;
      font-weight:800;
      color:#FFFFFF;
      box-shadow:
        0 4px 16px rgba(255,92,92,0.4),
        0 0 40px rgba(255,92,92,0.15);
    ">Start Your Free 30-Day Trial</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
async function main() {
  console.log('V5...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const ads = [
    { fn: ad1, name: 'v5_ad1' },
    { fn: ad3, name: 'v5_ad3' },
    { fn: ad5, name: 'v5_ad5' },
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
      await new Promise(r => setTimeout(r, 700));
      await page.screenshot({ path: fp, type: 'png' });
      await page.close();
      console.log(`  ${ad.name}_${size.suffix} (${(fs.statSync(fp).size/1024).toFixed(0)}KB)`);
    }
  }
  await browser.close();
  console.log('Done.');
}
main().catch(console.error);
