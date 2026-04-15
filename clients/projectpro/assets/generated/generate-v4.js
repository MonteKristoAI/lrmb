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
// AD 1: Short punchy headline. Bottom card with visible CTA.
// ════════════════════════════════════════════════════════════════
function ad1(w, h) {
  const bg = toB64('v2_bg_ad1_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Let the image breathe in the middle. Dark top + dark bottom. -->
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,
      rgba(0,0,0,0.8) 0%,
      rgba(0,0,0,0.2) 35%,
      rgba(0,0,0,0.1) 50%,
      rgba(0,0,0,0.7) 75%,
      rgba(0,0,0,0.95) 100%
    );"></div>

  <!-- Headline: TOP, huge, short -->
  <div style="
    position:absolute;
    top:${isP?56:44}px;
    left:${isP?44:44}px;
    right:${isP?44:200}px;
  ">
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FFFFFF;
      font-size:${isP?96:90}px;
      font-weight:900;
      line-height:0.92;
      letter-spacing:-4px;
    ">Specified<br><span style="color:#FF5C5C;">Before<br>You Knew.</span></div>
  </div>

  <!-- Bottom card: solid, high contrast, impossible to miss -->
  <div style="
    position:absolute;
    bottom:0;left:0;right:0;
    background:rgba(4,17,34,0.97);
    padding:${isP?'36px 44px':'28px 44px'};
    display:flex;align-items:center;justify-content:space-between;
    border-top:1px solid rgba(255,255,255,0.06);
  ">
    <div>
      <div style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">
        Every Monday before 9am
      </div>
      <div style="color:#fff;font-size:${isP?22:20}px;font-weight:800;margin-top:4px;font-family:'Poppins',sans-serif;">
        150-250 planning-stage projects
      </div>
    </div>
    <div style="
      background:#FF5C5C;
      border-radius:12px;
      padding:${isP?'18px 32px':'14px 28px'};
      color:#fff;
      font-size:${isP?17:15}px;
      font-weight:800;
      white-space:nowrap;
      box-shadow:0 4px 20px rgba(255,92,92,0.4);
    ">Get Monday's List</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// AD 3: Short headline on sky. Bottom solid bar with CTA.
// ════════════════════════════════════════════════════════════════
function ad3(w, h) {
  const bg = toB64('v2_bg_ad3_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">

  <!-- Sky darkened for text, bottom darkened for CTA bar -->
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,
      rgba(0,0,0,0.7) 0%,
      rgba(0,0,0,0.3) 30%,
      rgba(0,0,0,0.05) 50%,
      rgba(0,0,0,0.6) 75%,
      rgba(0,0,0,0.95) 100%
    );"></div>

  <!-- HUGE centered headline - shorter text -->
  <div style="
    position:absolute;
    top:${isP?'6%':'3%'};
    left:0;right:0;
    text-align:center;
    padding:0 36px;
  ">
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FFFFFF;
      font-size:${isP?92:84}px;
      font-weight:900;
      line-height:0.93;
      letter-spacing:-4px;
      text-shadow:0 4px 30px rgba(0,0,0,0.6);
    ">Specs Are<br><span style="color:#FF5C5C;">Already<br>Locked.</span></div>
  </div>

  <!-- Bottom solid bar -->
  <div style="
    position:absolute;
    bottom:0;left:0;right:0;
    background:rgba(4,17,34,0.97);
    padding:${isP?'36px 44px':'28px 44px'};
    display:flex;align-items:center;justify-content:space-between;
    border-top:1px solid rgba(255,255,255,0.06);
  ">
    <div>
      <div style="color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">
        Architect contacts included
      </div>
      <div style="color:#fff;font-size:${isP?22:20}px;font-weight:800;margin-top:4px;font-family:'Poppins',sans-serif;">
        Get there 3-6 months earlier
      </div>
    </div>
    <div style="
      background:#FF5C5C;
      border-radius:12px;
      padding:${isP?'18px 32px':'14px 28px'};
      color:#fff;
      font-size:${isP?17:15}px;
      font-weight:800;
      white-space:nowrap;
      box-shadow:0 4px 20px rgba(255,92,92,0.4);
    ">See What You're Missing</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
// AD 5: $0.52 MASSIVE with filled CTA that pops
// ════════════════════════════════════════════════════════════════
function ad5(w, h) {
  const bg = toB64('v2_bg_ad5_sq.png');
  const isP = h > w;
  return `
<div style="width:${w}px;height:${h}px;position:relative;">
  <img src="data:image/png;base64,${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.2);"></div>

  <!-- Centered content -->
  <div style="
    position:absolute;inset:0;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:40px;
  ">
    <!-- ENORMOUS number -->
    <div style="
      font-family:'Poppins',sans-serif;
      color:#FF5C5C;
      font-size:${isP?240:200}px;
      font-weight:900;
      line-height:0.8;
      letter-spacing:-10px;
      text-shadow:0 0 100px rgba(255,92,92,0.25);
    ">$0<span style="font-size:${isP?160:130}px;">.52</span></div>

    <!-- Label: big enough to read -->
    <div style="
      color:rgba(255,255,255,0.65);
      font-size:${isP?26:22}px;
      font-weight:700;
      margin-top:16px;
      text-transform:uppercase;
      letter-spacing:3px;
    ">per lead</div>

    <!-- Comparison line -->
    <div style="
      margin-top:${isP?32:24}px;
      color:rgba(255,255,255,0.35);
      font-size:${isP?18:16}px;
    ">Premium databases charge $6,000-$15,000/yr</div>
  </div>

  <!-- Bottom bar: solid, visible CTA -->
  <div style="
    position:absolute;
    bottom:0;left:0;right:0;
    background:rgba(4,17,34,0.97);
    padding:${isP?'32px 44px':'24px 44px'};
    display:flex;align-items:center;justify-content:center;
    border-top:1px solid rgba(255,255,255,0.06);
  ">
    <div style="
      background:#FF5C5C;
      border-radius:12px;
      padding:${isP?'18px 48px':'14px 40px'};
      color:#fff;
      font-size:${isP?18:16}px;
      font-weight:800;
      box-shadow:0 4px 20px rgba(255,92,92,0.4);
    ">Start Your Free 30-Day Trial</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════
async function main() {
  console.log('V4...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const ads = [
    { fn: ad1, name: 'v4_ad1' },
    { fn: ad3, name: 'v4_ad3' },
    { fn: ad5, name: 'v4_ad5' },
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
      console.log(`  ${ad.name}_${size.suffix} (${(fs.statSync(fp).size/1024).toFixed(0)}KB)`);
    }
  }
  await browser.close();
  console.log('Done.');
}
main().catch(console.error);
