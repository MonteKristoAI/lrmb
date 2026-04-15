const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const toB64 = (f) => fs.readFileSync(path.join(DIR, f)).toString('base64');

function shell(w, h, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{width:${w}px;height:${h}px;overflow:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
</style></head><body>${body}</body></html>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 1: BOLD STATEMENT ON SOLID COLOR
//
// Inspired by Nike/Elementor: Clean colored bg + massive text + CTA
// No photo. No effects. Just a powerful statement on a strong color.
// The COLOR is the emotion. The TEXT is the message.
// ════════════════════════════════════════════════════════════════════
function ad1(w, h) {
  const isP = h > w;
  return `
<div style="
  width:${w}px;height:${h}px;
  background:linear-gradient(145deg, #1a0a0a 0%, #2d0f0f 40%, #1a0a0a 100%);
  display:flex;flex-direction:column;
  padding:${isP?'72px 56px 48px':'60px 56px 40px'};
  font-family:'Poppins',sans-serif;
  position:relative;
  overflow:hidden;
">
  <!-- Subtle texture: diagonal lines -->
  <div style="
    position:absolute;inset:0;opacity:0.03;
    background:repeating-linear-gradient(
      -45deg,
      transparent,transparent 20px,
      rgba(255,255,255,0.5) 20px,rgba(255,255,255,0.5) 21px
    );
  "></div>

  <!-- Top: small coral marker -->
  <div style="
    width:48px;height:5px;background:#FF5C5C;border-radius:3px;
    margin-bottom:${isP?48:36}px;
    position:relative;z-index:1;
  "></div>

  <!-- Main headline: takes up 60%+ of vertical space -->
  <div style="
    flex:1;display:flex;align-items:center;
    position:relative;z-index:1;
  ">
    <div style="
      font-weight:900;
      font-size:${isP?96:88}px;
      line-height:1.0;
      letter-spacing:-3px;
      color:#FFFFFF;
    ">The architect<br>locked the spec<br><span style="color:#FF5C5C;">before the bid<br>hit your desk.</span></div>
  </div>

  <!-- Bottom section: value prop + CTA side by side -->
  <div style="
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:24px;
    position:relative;z-index:1;
    margin-top:${isP?32:20}px;
  ">
    <div style="flex:1;">
      <div style="
        font-family:'Inter',sans-serif;
        font-weight:700;
        font-size:${isP?22:20}px;
        color:rgba(255,255,255,0.85);
        line-height:1.35;
      ">150-250 planning-stage projects<br>every Monday before 9am</div>
      <div style="
        font-family:'Inter',sans-serif;
        font-weight:500;
        font-size:${isP?16:15}px;
        color:rgba(255,255,255,0.35);
        margin-top:8px;
      ">Architect contacts. Direct phone. Direct email.</div>
    </div>
    <div style="
      background:#FF5C5C;
      border-radius:14px;
      padding:${isP?'20px 36px':'18px 32px'};
      font-family:'Inter',sans-serif;
      font-weight:800;
      font-size:${isP?18:17}px;
      color:#fff;
      white-space:nowrap;
      flex-shrink:0;
    ">Get Monday's List</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 3: PHOTO + EDITORIAL LAYOUT
//
// Inspired by HP/Pepsi: Strong photo visible, text in dedicated zone.
// Split layout: photo takes top/right, text takes bottom/left.
// Clean separation. No overlay fighting. Each has its own space.
// ════════════════════════════════════════════════════════════════════
function ad3(w, h) {
  const bg = toB64('v2_bg_ad3_sq.png');
  const isP = h > w;
  const photoH = isP ? Math.round(h * 0.48) : Math.round(h * 0.45);
  const textH = h - photoH;

  return `
<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;">
  <!-- Photo zone: full bleed, no overlay, the image speaks -->
  <div style="
    width:100%;height:${photoH}px;
    position:relative;overflow:hidden;
  ">
    <img src="data:image/png;base64,${bg}" style="
      width:100%;height:100%;object-fit:cover;
      filter:brightness(0.85) contrast(1.1);
    ">
    <!-- Tiny bottom fade into text zone -->
    <div style="
      position:absolute;bottom:0;left:0;right:0;height:60px;
      background:linear-gradient(transparent,#0d1117);
    "></div>
  </div>

  <!-- Text zone: solid dark bg, structured content -->
  <div style="
    width:100%;height:${textH}px;
    background:#0d1117;
    padding:${isP?'36px 48px 44px':'28px 48px 36px'};
    display:flex;flex-direction:column;
    justify-content:space-between;
    font-family:'Poppins',sans-serif;
  ">
    <!-- Headline -->
    <div>
      <div style="
        font-weight:900;
        font-size:${isP?64:56}px;
        line-height:0.95;
        letter-spacing:-2px;
        color:#FFFFFF;
        margin-bottom:${isP?16:12}px;
      ">Specs are already<br><span style="color:#FF5C5C;">locked.</span></div>
      <div style="
        font-family:'Inter',sans-serif;
        font-weight:500;
        font-size:${isP?22:20}px;
        color:rgba(255,255,255,0.45);
        line-height:1.4;
      ">Your competitor is already in the drawings.<br>Get there 3-6 months earlier.</div>
    </div>

    <!-- CTA: full width, prominent -->
    <div style="
      width:100%;
      background:#FF5C5C;
      border-radius:14px;
      padding:${isP?'22px 0':'18px 0'};
      text-align:center;
      font-family:'Inter',sans-serif;
      font-weight:800;
      font-size:${isP?20:18}px;
      color:#FFFFFF;
      margin-top:${isP?20:16}px;
    ">See What You're Missing</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 5: DATA CARD / INFOGRAPHIC STYLE
//
// Inspired by Semrush/Crunchbase: Number dominates. Clean layout.
// White/light background for contrast against typical dark feeds.
// Structured like a data card you'd see in a dashboard.
// ════════════════════════════════════════════════════════════════════
function ad5(w, h) {
  const isP = h > w;
  return `
<div style="
  width:${w}px;height:${h}px;
  background:#FFFFFF;
  display:flex;flex-direction:column;
  padding:${isP?'64px 56px 48px':'52px 56px 40px'};
  font-family:'Poppins',sans-serif;
  position:relative;
">
  <!-- Top: brand accent bar -->
  <div style="
    width:48px;height:5px;background:#FF5C5C;border-radius:3px;
    margin-bottom:${isP?20:16}px;
  "></div>

  <!-- Category label -->
  <div style="
    font-family:'Inter',sans-serif;
    font-weight:600;
    font-size:${isP?15:14}px;
    color:#999;
    text-transform:uppercase;
    letter-spacing:2px;
    margin-bottom:${isP?48:36}px;
  ">Commercial Construction Leads</div>

  <!-- MASSIVE stat -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <div style="
      font-weight:900;
      font-size:${isP?180:148}px;
      line-height:0.85;
      letter-spacing:-6px;
      color:#FF5C5C;
    ">$0.52</div>
    <div style="
      font-weight:700;
      font-size:${isP?32:28}px;
      color:#1D1F28;
      margin-top:12px;
      letter-spacing:1px;
    ">per lead</div>

    <!-- Comparison -->
    <div style="
      margin-top:${isP?40:28}px;
      padding-top:${isP?32:24}px;
      border-top:2px solid #F0F0F0;
    ">
      <div style="
        font-family:'Inter',sans-serif;
        font-weight:500;
        font-size:${isP?20:18}px;
        color:#999;
      ">Premium databases charge</div>
      <div style="
        font-weight:800;
        font-size:${isP?36:30}px;
        color:#1D1F28;
        margin-top:4px;
      ">$6,000-$15,000/yr</div>
      <div style="
        font-family:'Inter',sans-serif;
        font-weight:500;
        font-size:${isP?16:15}px;
        color:#BBB;
        margin-top:4px;
      ">for projects everyone already sees</div>
    </div>
  </div>

  <!-- Bottom: CTA -->
  <div style="margin-top:${isP?32:24}px;">
    <div style="
      width:100%;
      background:#FF5C5C;
      border-radius:14px;
      padding:${isP?'22px 0':'18px 0'};
      text-align:center;
      font-family:'Inter',sans-serif;
      font-weight:800;
      font-size:${isP?20:18}px;
      color:#FFFFFF;
    ">Start Your Free 30-Day Trial</div>
    <div style="
      text-align:center;
      font-family:'Inter',sans-serif;
      font-size:${isP?14:13}px;
      color:#BBB;
      margin-top:10px;
    ">150-250 planning-stage projects with architect contacts every Monday</div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
async function main() {
  console.log('FINAL creatives...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const ads = [
    { fn: ad1, name: 'final_ad1' },
    { fn: ad3, name: 'final_ad3' },
    { fn: ad5, name: 'final_ad5' },
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
