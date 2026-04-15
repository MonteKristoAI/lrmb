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
// AD 1: LOSS NARRATIVE - "Specified Before You Knew."
//
// F-pattern: headline left, image supports right
// Glassmorphism bottom card with large CTA
// Massive headline with coral glow accent
// 20-30% white space around headline area
// ════════════════════════════════════════════════════════════════════
function ad1(w, h) {
  const bg = toB64('v2_bg_ad1_sq.png');
  const isP = h > w;
  const hl = isP ? 112 : 100;
  const sub = isP ? 28 : 26;
  const ctaH = isP ? 64 : 56;

  return `
<div style="width:${w}px;height:${h}px;position:relative;background:#080c14;">
  <!-- BG dimmed significantly so it supports, never competes -->
  <img src="data:image/png;base64,${bg}" style="
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.3;
  ">

  <!-- Main content area -->
  <div style="
    position:absolute;inset:0;
    display:flex;flex-direction:column;
    justify-content:space-between;
    padding:${isP?'56px 48px 0':'44px 48px 0'};
  ">
    <!-- Top section: headline + subtext -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
      <!-- Headline: F-pattern left aligned -->
      <div style="
        font-family:'Poppins',sans-serif;
        font-weight:900;
        font-size:${hl}px;
        line-height:0.9;
        letter-spacing:-5px;
        color:#FFFFFF;
        margin-bottom:${isP?32:24}px;
      ">Specified<br><span style="
        color:#FF5C5C;
        text-shadow:
          0 0 40px rgba(255,92,92,0.5),
          0 0 80px rgba(255,92,92,0.2);
      ">Before You<br>Knew.</span></div>

      <!-- Subtext: large enough to read on mobile -->
      <div style="
        font-size:${sub}px;
        font-weight:500;
        color:rgba(255,255,255,0.5);
        line-height:1.45;
        max-width:${isP?'85%':'65%'};
      ">The architect locked the spec months before the bid hit your desk. Your team never had a chance.</div>
    </div>

    <!-- Bottom glassmorphism card -->
    <div style="
      margin:0 -48px;
      padding:${isP?'28px 48px':'24px 48px'};
      background:rgba(255,255,255,0.04);
      backdrop-filter:blur(24px);
      -webkit-backdrop-filter:blur(24px);
      border-top:1px solid rgba(255,255,255,0.08);
    ">
      <!-- Info line -->
      <div style="
        display:flex;align-items:center;gap:${isP?20:16}px;
        margin-bottom:${isP?20:16}px;
      ">
        <div style="
          width:4px;height:${isP?40:36}px;
          background:linear-gradient(180deg,#FF5C5C,rgba(255,92,92,0.3));
          border-radius:2px;
        "></div>
        <div>
          <div style="
            font-family:'Poppins',sans-serif;font-weight:800;
            font-size:${isP?24:22}px;color:#fff;
          ">150-250 planning-stage projects</div>
          <div style="
            font-size:${isP?16:15}px;color:rgba(255,255,255,0.4);
            font-weight:500;margin-top:2px;
          ">Every Monday before 9am. Architect contacts. Direct phone.</div>
        </div>
      </div>

      <!-- CTA: HUGE, full width, gradient background, impossible to miss -->
      <div style="
        width:100%;
        height:${ctaH}px;
        background:linear-gradient(135deg, #FF5C5C 0%, #FF7A7A 50%, #FF5C5C 100%);
        background: linear-gradient(135deg, #FF5C5C 0%, #FF7A7A 50%, #FF5C5C 100%);
        border-radius:16px;
        display:flex;align-items:center;justify-content:center;
        font-family:'Poppins',sans-serif;
        font-size:${isP?22:20}px;
        font-weight:800;
        color:#FFFFFF;
        letter-spacing:0.3px;
        box-shadow:
          0 4px 16px rgba(255,92,92,0.4),
          0 0 40px rgba(255,92,92,0.12),
          inset 0 1px 0 rgba(255,255,255,0.15);
      ">Get Your First Monday List</div>
    </div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 3: FEAR/SHAME - "Specs Are Already Locked."
//
// Centered headline on sky, steel silhouette frames bottom
// Glassmorphism card over the steel beams
// Large centered CTA
// ════════════════════════════════════════════════════════════════════
function ad3(w, h) {
  const bg = toB64('v2_bg_ad3_sq.png');
  const isP = h > w;
  const hl = isP ? 108 : 96;
  const sub = isP ? 28 : 26;
  const ctaH = isP ? 64 : 56;

  return `
<div style="width:${w}px;height:${h}px;position:relative;background:#070b14;">
  <img src="data:image/png;base64,${bg}" style="
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.5;
  ">

  <!-- Top gradient for headline area -->
  <div style="
    position:absolute;top:0;left:0;right:0;height:55%;
    background:linear-gradient(180deg,rgba(7,11,20,0.7) 0%,rgba(7,11,20,0.2) 80%,transparent 100%);
  "></div>

  <!-- Content -->
  <div style="
    position:absolute;inset:0;
    display:flex;flex-direction:column;
    justify-content:space-between;
  ">
    <!-- Headline centered -->
    <div style="
      flex:1;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      padding:0 40px;
      text-align:center;
    ">
      <div style="
        font-family:'Poppins',sans-serif;
        font-weight:900;
        font-size:${hl}px;
        line-height:0.9;
        letter-spacing:-4px;
        color:#FFFFFF;
        text-shadow:0 4px 30px rgba(0,0,0,0.5);
        margin-bottom:${isP?28:20}px;
      ">Specs Are<br>Already<br><span style="
        color:#FF5C5C;
        text-shadow:
          0 0 40px rgba(255,92,92,0.5),
          0 0 80px rgba(255,92,92,0.25),
          0 4px 30px rgba(0,0,0,0.5);
      ">Locked.</span></div>

      <div style="
        font-size:${sub}px;font-weight:500;
        color:rgba(255,255,255,0.5);
        text-shadow:0 2px 12px rgba(0,0,0,0.4);
      ">Your competitor is already in the drawings.</div>
    </div>

    <!-- Bottom glassmorphism card -->
    <div style="
      margin:0;
      padding:${isP?'28px 44px':'24px 44px'};
      background:rgba(255,255,255,0.04);
      backdrop-filter:blur(24px);
      -webkit-backdrop-filter:blur(24px);
      border-top:1px solid rgba(255,255,255,0.08);
    ">
      <div style="
        display:flex;align-items:center;gap:${isP?20:16}px;
        margin-bottom:${isP?20:16}px;
      ">
        <div style="
          width:4px;height:${isP?40:36}px;
          background:linear-gradient(180deg,#FF5C5C,rgba(255,92,92,0.3));
          border-radius:2px;
        "></div>
        <div>
          <div style="
            font-family:'Poppins',sans-serif;font-weight:800;
            font-size:${isP?24:22}px;color:#fff;
          ">Get there 3-6 months earlier</div>
          <div style="
            font-size:${isP?16:15}px;color:rgba(255,255,255,0.4);
            font-weight:500;margin-top:2px;
          ">Architect contacts with direct phone and email.</div>
        </div>
      </div>

      <div style="
        width:100%;height:${ctaH}px;
        background:linear-gradient(135deg, #FF5C5C 0%, #FF7A7A 50%, #FF5C5C 100%);
        border-radius:16px;
        display:flex;align-items:center;justify-content:center;
        font-family:'Poppins',sans-serif;
        font-size:${isP?22:20}px;font-weight:800;color:#FFFFFF;
        box-shadow:
          0 4px 16px rgba(255,92,92,0.4),
          0 0 40px rgba(255,92,92,0.12),
          inset 0 1px 0 rgba(255,255,255,0.15);
      ">See What You're Missing</div>
    </div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
// AD 5: DATA/COMPARISON - "$0.52 per lead"
//
// Massive number centered. Comparison below.
// Glassmorphism card at bottom with full-width CTA.
// Light beam from background adds drama.
// ════════════════════════════════════════════════════════════════════
function ad5(w, h) {
  const bg = toB64('v2_bg_ad5_sq.png');
  const isP = h > w;
  const numSize = isP ? 200 : 168;
  const ctaH = isP ? 64 : 56;

  return `
<div style="width:${w}px;height:${h}px;position:relative;background:#060a12;">
  <img src="data:image/png;base64,${bg}" style="
    position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.55;
  ">

  <div style="
    position:absolute;inset:0;
    display:flex;flex-direction:column;
    justify-content:space-between;
  ">
    <!-- Centered stat content -->
    <div style="
      flex:1;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      padding:0 40px;
    ">
      <div style="
        font-family:'Poppins',sans-serif;font-weight:900;
        color:#FF5C5C;
        font-size:${numSize}px;
        line-height:0.85;
        letter-spacing:-8px;
        text-shadow:
          0 0 60px rgba(255,92,92,0.35),
          0 0 120px rgba(255,92,92,0.15);
      ">$0.52</div>

      <div style="
        font-family:'Poppins',sans-serif;font-weight:700;
        color:rgba(255,255,255,0.6);
        font-size:${isP?30:26}px;
        margin-top:16px;
        letter-spacing:4px;
        text-transform:uppercase;
      ">per lead</div>

      <!-- Divider -->
      <div style="
        width:60px;height:2px;
        background:rgba(255,255,255,0.1);
        margin:${isP?36:28}px 0;
      "></div>

      <!-- Comparison -->
      <div style="text-align:center;">
        <div style="
          font-weight:500;color:rgba(255,255,255,0.4);
          font-size:${isP?22:20}px;
        ">Premium databases charge</div>
        <div style="
          font-family:'Poppins',sans-serif;font-weight:800;
          color:rgba(255,255,255,0.7);
          font-size:${isP?36:30}px;
          margin-top:8px;
        ">$6,000-$15,000/yr</div>
        <div style="
          font-weight:500;color:rgba(255,255,255,0.3);
          font-size:${isP?18:16}px;
          margin-top:6px;
        ">for projects everyone already sees</div>
      </div>
    </div>

    <!-- Bottom glassmorphism card -->
    <div style="
      padding:${isP?'28px 44px':'24px 44px'};
      background:rgba(255,255,255,0.04);
      backdrop-filter:blur(24px);
      -webkit-backdrop-filter:blur(24px);
      border-top:1px solid rgba(255,255,255,0.08);
    ">
      <div style="
        text-align:center;
        font-size:${isP?16:15}px;
        color:rgba(255,255,255,0.4);
        font-weight:500;
        margin-bottom:${isP?16:12}px;
      ">150-250 planning-stage projects with architect contacts every Monday</div>

      <div style="
        width:100%;height:${ctaH}px;
        background:linear-gradient(135deg, #FF5C5C 0%, #FF7A7A 50%, #FF5C5C 100%);
        border-radius:16px;
        display:flex;align-items:center;justify-content:center;
        font-family:'Poppins',sans-serif;
        font-size:${isP?22:20}px;font-weight:800;color:#FFFFFF;
        box-shadow:
          0 4px 16px rgba(255,92,92,0.4),
          0 0 40px rgba(255,92,92,0.12),
          inset 0 1px 0 rgba(255,255,255,0.15);
      ">Start Your Free 30-Day Trial</div>
    </div>
  </div>
</div>`;
}

// ════════════════════════════════════════════════════════════════════
async function main() {
  console.log('V6...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const ads = [
    { fn: ad1, name: 'v6_ad1' },
    { fn: ad3, name: 'v6_ad3' },
    { fn: ad5, name: 'v6_ad5' },
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
