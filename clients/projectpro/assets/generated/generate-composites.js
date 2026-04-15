const puppeteer = require('/Users/milanmandic/Desktop/MonteKristo AI/reports-engine/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = __dirname;
const BG_DESK = path.join(OUTPUT_DIR, 'bg_desk_sq.png');
const BG_CONSTRUCTION = path.join(OUTPUT_DIR, 'bg_construction_port.png');

const brand = {
  navy:   '#041122',
  coral:  '#FF5C5C',
  cream:  '#FAF8F4',
  white:  '#FFFFFF',
  text:   '#1D1F28',
  gray:   '#8A8F98',
};

function toBase64(filepath) {
  return fs.readFileSync(filepath).toString('base64');
}

function htmlShell(width, height, bodyHtml) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${width}px; height:${height}px; overflow:hidden;
    font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }
</style></head><body>${bodyHtml}</body></html>`;
}

// ─── COMPOSITE AD: DESK BACKGROUND + THE SPEC HEADLINE (SQUARE) ────────────
function adSpec_sq() {
  const b64 = toBase64(BG_DESK);
  return `
<div style="width:1080px;height:1080px;position:relative;overflow:hidden;">
  <!-- Background image -->
  <img src="data:image/png;base64,${b64}" style="
    width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;
  ">
  <!-- Dark gradient overlay for text readability -->
  <div style="
    position:absolute;inset:0;
    background:linear-gradient(
      180deg,
      rgba(4,17,34,0.85) 0%,
      rgba(4,17,34,0.5) 40%,
      rgba(4,17,34,0.3) 60%,
      rgba(4,17,34,0.75) 85%,
      rgba(4,17,34,0.92) 100%
    );
  "></div>
  <!-- Content -->
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:60px;">
    <!-- Top tag -->
    <div style="
      color:${brand.coral};font-size:14px;font-weight:700;
      letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;
    ">For Commercial Material Suppliers</div>
    <!-- Headline -->
    <div style="
      font-family:'Poppins',sans-serif;color:${brand.white};
      font-size:52px;font-weight:800;line-height:1.15;
      max-width:700px;
    ">Your competitor got specified 3 months ago.</div>
    <!-- Subheadline -->
    <div style="
      color:rgba(255,255,255,0.7);font-size:20px;line-height:1.5;
      margin-top:20px;max-width:600px;
    ">By bid stage, the architect already chose materials. You're quoting a job you've already lost.</div>
    <!-- Spacer -->
    <div style="flex:1;"></div>
    <!-- Bottom stats row -->
    <div style="display:flex;gap:30px;align-items:center;margin-bottom:20px;">
      <div>
        <div style="color:${brand.coral};font-size:36px;font-weight:900;font-family:'Poppins',sans-serif;">150-250</div>
        <div style="color:rgba(255,255,255,0.5);font-size:13px;">planning-stage projects/week</div>
      </div>
      <div style="width:1px;height:40px;background:rgba(255,255,255,0.15);"></div>
      <div>
        <div style="color:${brand.white};font-size:36px;font-weight:900;font-family:'Poppins',sans-serif;">Monday</div>
        <div style="color:rgba(255,255,255,0.5);font-size:13px;">Excel delivery before 9am</div>
      </div>
      <div style="width:1px;height:40px;background:rgba(255,255,255,0.15);"></div>
      <div>
        <div style="color:${brand.white};font-size:36px;font-weight:900;font-family:'Poppins',sans-serif;">28%</div>
        <div style="color:rgba(255,255,255,0.5);font-size:13px;">cold email open rate</div>
      </div>
    </div>
    <!-- CTA -->
    <div style="
      display:inline-flex;align-self:flex-start;
      background:${brand.coral};border-radius:30px;
      padding:16px 40px;
      color:${brand.white};font-size:18px;font-weight:700;
    ">See if your team qualifies</div>
  </div>
</div>`;
}

// ─── COMPOSITE AD: CONSTRUCTION BG + HIDDEN COST HEADLINE (PORTRAIT) ───────
function adHiddenCost_port() {
  const b64 = toBase64(BG_CONSTRUCTION);
  return `
<div style="width:1080px;height:1920px;position:relative;overflow:hidden;">
  <img src="data:image/png;base64,${b64}" style="
    width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;
  ">
  <div style="
    position:absolute;inset:0;
    background:linear-gradient(
      180deg,
      rgba(4,17,34,0.92) 0%,
      rgba(4,17,34,0.6) 25%,
      rgba(4,17,34,0.3) 45%,
      rgba(4,17,34,0.5) 65%,
      rgba(4,17,34,0.92) 85%,
      rgba(4,17,34,0.98) 100%
    );
  "></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:70px 60px;">
    <!-- Top tag -->
    <div style="
      color:${brand.coral};font-size:15px;font-weight:700;
      letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;
    ">The Visibility Problem</div>
    <!-- Headline -->
    <div style="
      font-family:'Poppins',sans-serif;color:${brand.white};
      font-size:54px;font-weight:800;line-height:1.15;
    ">How many projects in your market did your team never hear about?</div>
    <!-- Sub -->
    <div style="
      color:rgba(255,255,255,0.65);font-size:22px;line-height:1.5;
      margin-top:24px;max-width:800px;
    ">Every project you don't know about is a spec written without you in the room.</div>
    <!-- Spacer -->
    <div style="flex:1;"></div>
    <!-- Value props -->
    <div style="
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.1);
      border-radius:16px;padding:28px 32px;
      margin-bottom:30px;
    ">
      <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
        <div style="color:rgba(255,255,255,0.5);font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">What you get every Monday</div>
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="color:${brand.coral};font-size:32px;font-weight:900;font-family:'Poppins',sans-serif;">150-250</div>
          <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">commercial projects</div>
        </div>
        <div style="flex:1;min-width:200px;">
          <div style="color:${brand.white};font-size:32px;font-weight:900;font-family:'Poppins',sans-serif;">Planning stage</div>
          <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">3-6 months before bid</div>
        </div>
        <div style="flex:1;min-width:200px;">
          <div style="color:${brand.white};font-size:32px;font-weight:900;font-family:'Poppins',sans-serif;">Direct contacts</div>
          <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px;">Architect phone + email</div>
        </div>
      </div>
    </div>
    <!-- Trusted by -->
    <div style="
      color:rgba(255,255,255,0.35);font-size:14px;margin-bottom:24px;text-align:center;
    ">Trusted by commercial suppliers for over 10 years</div>
    <!-- CTA -->
    <div style="
      display:flex;justify-content:center;
    ">
      <div style="
        background:${brand.coral};border-radius:30px;
        padding:18px 50px;
        color:${brand.white};font-size:20px;font-weight:700;
      ">See if your team qualifies</div>
    </div>
    <!-- Trial note -->
    <div style="
      color:rgba(255,255,255,0.3);font-size:13px;text-align:center;margin-top:14px;
    ">30-day free trial &middot; No contract &middot; Excel delivery</div>
  </div>
</div>`;
}

// ─── COMPOSITE AD: DESK BG + QUOTE CARD OVERLAY (SQUARE) ───────────────────
function adQuote_sq() {
  const b64 = toBase64(BG_DESK);
  return `
<div style="width:1080px;height:1080px;position:relative;overflow:hidden;">
  <img src="data:image/png;base64,${b64}" style="
    width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;
    filter:blur(6px) brightness(0.3);
  ">
  <div style="
    position:absolute;inset:0;
    background:rgba(4,17,34,0.7);
  "></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;">
    <!-- Quote marks -->
    <div style="
      font-family:Georgia,serif;font-size:120px;color:${brand.coral};
      opacity:0.3;line-height:0.6;margin-bottom:-10px;
    ">"</div>
    <!-- Quote text -->
    <div style="
      font-family:'Poppins',sans-serif;color:${brand.white};
      font-size:36px;font-weight:700;text-align:center;
      line-height:1.4;max-width:800px;margin-bottom:24px;
    ">We literally built our business from the ground up using this service.</div>
    <!-- Attribution -->
    <div style="
      color:rgba(255,255,255,0.5);font-size:16px;margin-bottom:40px;
    ">7-year subscriber &middot; Commercial building material supplier</div>
    <!-- Stat -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="
        font-family:'Poppins',sans-serif;color:${brand.coral};
        font-size:72px;font-weight:900;line-height:1;
      ">28%</div>
      <div style="color:${brand.white};font-size:18px;margin-top:8px;font-weight:500;">cold email open rate</div>
      <div style="color:rgba(255,255,255,0.4);font-size:14px;margin-top:4px;">using project names in subject lines</div>
    </div>
    <!-- Divider -->
    <div style="width:60px;height:3px;background:${brand.coral};border-radius:2px;margin-bottom:30px;"></div>
    <!-- Stats row -->
    <div style="
      display:flex;gap:30px;align-items:center;margin-bottom:36px;
    ">
      <div style="text-align:center;">
        <div style="color:${brand.white};font-size:22px;font-weight:800;">150-250</div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px;">projects/week</div>
      </div>
      <div style="color:rgba(255,255,255,0.15);">|</div>
      <div style="text-align:center;">
        <div style="color:${brand.white};font-size:22px;font-weight:800;">Monday</div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px;">Excel delivery</div>
      </div>
      <div style="color:rgba(255,255,255,0.15);">|</div>
      <div style="text-align:center;">
        <div style="color:${brand.white};font-size:22px;font-weight:800;">30-day</div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px;">free trial</div>
      </div>
    </div>
    <!-- CTA -->
    <div style="
      background:${brand.coral};border-radius:30px;
      padding:16px 44px;
      color:${brand.white};font-size:18px;font-weight:700;
    ">See if your team qualifies</div>
  </div>
</div>`;
}

// ─── GENERATE ───────────────────────────────────────────────────────────────
async function generateAll() {
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ headless:true, args:['--no-sandbox'] });

  const composites = [
    { name:'composite_spec_sq',        fn:adSpec_sq,         w:1080, h:1080 },
    { name:'composite_hidden_port',    fn:adHiddenCost_port, w:1080, h:1920 },
    { name:'composite_quote_sq',       fn:adQuote_sq,        w:1080, h:1080 },
  ];

  for (const c of composites) {
    const filepath = path.join(OUTPUT_DIR, `${c.name}.png`);
    console.log(`Generating ${c.name}.png (${c.w}x${c.h})...`);

    const html = htmlShell(c.w, c.h, c.fn());
    const page = await browser.newPage();
    await page.setViewport({ width:c.w, height:c.h, deviceScaleFactor:2 });
    await page.setContent(html, { waitUntil:'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path:filepath, type:'png' });
    await page.close();

    const stats = fs.statSync(filepath);
    console.log(`  -> ${c.name}.png (${(stats.size/1024).toFixed(0)}KB)`);
  }

  await browser.close();
  console.log('\nDone! Composites generated.');
}

generateAll().catch(console.error);
