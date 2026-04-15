const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ─── LOGO ───
const svgLogoPath = path.join(__dirname, '..', '..', '..', 'Logo', 'favicon-bold.svg');
const svgRaw = fs.readFileSync(svgLogoPath, 'utf8')
  .replace(/strokeWidth=/g, 'stroke-width=')
  .replace(/strokeLinecap=/g, 'stroke-linecap=')
  .replace(/strokeLinejoin=/g, 'stroke-linejoin=');
const logoSrc = `data:image/svg+xml;base64,${Buffer.from(svgRaw).toString('base64')}`;

// ─── FLOWS DATA ───
const flows = [
  {
    name: 'Welcome Series',
    trigger: 'New subscriber joins Email List',
    emailCount: 3,
    emails: [
      { timing: 'Immediate', subject: 'Welcome to the Gummy Gurl fam', body: 'Welcome message introducing all 6 brands (Gummy Gurl, Nature Gurl, Lifted Labs, Phyto Kinetics, Good Karma, Rize). Includes 10% first-order discount code: WELCOME10. CTA: Shop Now.' },
      { timing: 'Day 2', subject: 'What makes us different', body: 'Lab-tested quality, Farm Bill compliant, 6 brands under one roof. Best sellers showcase: FUBAR Gummies, Magnum 2000mg, CBN Sleep Gummy. Social proof section. CTA: Explore Products.' },
      { timing: 'Day 5', subject: 'New to hemp edibles? Start here', body: 'Educational: Delta-8 vs Delta-9 explained. Dosing guide (beginner 5-10mg, intermediate 10-25mg, experienced 25mg+). Product recommendations by experience level. CTA: Find Your Fit.' },
    ],
  },
  {
    name: 'Abandoned Cart',
    trigger: 'Started Checkout, no purchase within 1 hour',
    emailCount: 3,
    emails: [
      { timing: '1 Hour', subject: 'You left something in your cart', body: 'Cart contents with product images and prices. Simple, no discount. CTA: Complete Your Order.' },
      { timing: '24 Hours', subject: 'Your cart is waiting', body: 'Cart items + customer reviews and social proof. "Join thousands of satisfied customers." CTA: Return to Cart.' },
      { timing: '72 Hours', subject: "Here's 10% off to finish your order", body: 'Cart items + exclusive 10% discount code: CART10. "This code expires in 48 hours." CTA: Use Code & Checkout.' },
    ],
  },
  {
    name: 'Post-Purchase',
    trigger: 'Order placed successfully',
    emailCount: 2,
    emails: [
      { timing: 'Immediate', subject: "Order confirmed - here's what's next", body: 'Order details, estimated shipping (2-5 business days), tracking info coming soon. "Your products are Farm Bill compliant and lab tested."' },
      { timing: 'Day 7', subject: "How's everything?", body: 'Ask about experience. Link to leave review. Cross-sell related products. Subscribe & Save mention (10% off recurring). CTA: Shop More.' },
    ],
  },
  {
    name: 'Browse Abandonment',
    trigger: 'Viewed product, no add-to-cart within 2 hours',
    emailCount: 1,
    emails: [
      { timing: '2 Hours', subject: 'Still thinking about [Product Name]?', body: 'Product they viewed with image, price, and highlights. "Here\'s why customers love it." Similar products section. CTA: View Product.' },
    ],
  },
  {
    name: 'Subscription Welcome',
    trigger: 'First subscription order placed',
    emailCount: 2,
    emails: [
      { timing: 'Immediate', subject: "You're subscribed - welcome to 10% savings", body: 'Subscription confirmation. Automatic delivery on your schedule. Manage at gummygurl.com/account. Change frequency, pause, or cancel anytime.' },
      { timing: 'Day 3', subject: 'Quick guide to managing your subscription', body: 'Step-by-step: change frequency, pause, cancel. FAQ: When am I charged? Can I change products? What if I need to skip?' },
    ],
  },
  {
    name: 'Win-Back',
    trigger: 'No purchase in 60 days',
    emailCount: 2,
    emails: [
      { timing: '60 Days', subject: "It's been a while - here's what's new", body: 'New product highlights. What\'s been popular. 15% comeback code: COMEBACK15. CTA: Shop What\'s New.' },
      { timing: '75 Days', subject: 'We want you back - 20% off everything', body: 'Stronger offer. 20% code: MISSYOU20. Expires in 7 days. Best sellers showcase. CTA: Claim Your Discount.' },
    ],
  },
  {
    name: 'Subscription Reminder',
    trigger: '3 days before subscription renewal',
    emailCount: 1,
    emails: [
      { timing: '3 Days Before', subject: 'Your next delivery ships soon', body: 'What\'s being delivered. Next charge date. Manage subscription link. "Need to make changes? Update, pause, or cancel from your account."' },
    ],
  },
];

// ─── BUILD HTML ───
function buildHTML() {
  const flowSections = flows.map(flow => {
    const emailRows = flow.emails.map(e => `
      <div class="email-card no-break">
        <div class="email-timing">${e.timing}</div>
        <div class="email-subject">${e.subject}</div>
        <div class="email-body">${e.body}</div>
      </div>
    `).join('');

    return `
      <div class="flow-block no-break">
        <div class="flow-header">
          <span class="flow-name">${flow.name}</span>
          <span class="flow-meta">${flow.emailCount} email${flow.emailCount > 1 ? 's' : ''}</span>
        </div>
        <div class="flow-trigger">Trigger: ${flow.trigger}</div>
        ${emailRows}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 14mm 18mm 16mm 18mm; background: #FAF8F4; }
  html, body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; font-size: 10pt; color: #1D1F28; line-height: 1.6; background: #FAF8F4; }
  .no-break { break-inside: avoid; page-break-inside: avoid; }
  h2.sh { break-after: avoid; page-break-after: avoid; }

  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.5pt solid #041122; padding-bottom: 14pt; margin-bottom: 10pt; }
  .report-title { font-family: 'Poppins', sans-serif; font-size: 20pt; font-weight: 700; color: #041122; line-height: 1.2; margin: 0 0 6pt 0; }
  .report-meta { font-size: 10pt; color: #777; margin: 0 0 3pt 0; }
  .report-prepared { font-size: 9pt; font-style: italic; color: #999; margin: 0; }
  .header-logo { width: 80pt; flex-shrink: 0; margin-left: 16pt; margin-top: 2pt; }

  .tagline { text-align: center; font-size: 10pt; font-style: italic; color: #bbb; margin: 4pt 0 12pt 0; }
  .intro { font-size: 10pt; color: #444; line-height: 1.65; margin: 0 0 14pt 0; }

  h2.sh { font-family: 'Poppins', sans-serif; font-size: 10pt; font-weight: 700; color: #041122; text-transform: uppercase; letter-spacing: 0.08em; margin: 18pt 0 8pt 0; padding-bottom: 4pt; border-bottom: 1pt solid #ddd; }

  /* Glance grid */
  .glance-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8pt; background: white; border-radius: 6pt; padding: 14pt 12pt; border: 1pt solid #e5e1db; margin-bottom: 14pt; }
  .glance-card { text-align: center; }
  .glance-value { font-family: 'Poppins', sans-serif; font-size: 18pt; font-weight: 700; color: #041122; line-height: 1.2; }
  .glance-value.coral { color: #FF5C5C; }
  .glance-label { font-size: 7pt; color: #999; margin-top: 2pt; line-height: 1.3; }

  /* Flow blocks */
  .flow-block { background: white; border: 1pt solid #e5e1db; border-radius: 6pt; padding: 12pt 14pt; margin-bottom: 10pt; }
  .flow-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt; }
  .flow-name { font-family: 'Poppins', sans-serif; font-size: 11pt; font-weight: 700; color: #041122; }
  .flow-meta { font-size: 8pt; color: #007BFF; font-weight: 600; background: rgba(0,123,255,0.08); padding: 2pt 8pt; border-radius: 10pt; }
  .flow-trigger { font-size: 8.5pt; color: #888; margin-bottom: 8pt; font-style: italic; }

  .email-card { padding: 8pt 0; border-top: 0.5pt solid #eee; }
  .email-card:first-of-type { border-top: none; }
  .email-timing { font-size: 7.5pt; color: #007BFF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2pt; }
  .email-subject { font-family: 'Poppins', sans-serif; font-size: 10pt; font-weight: 600; color: #041122; margin-bottom: 3pt; }
  .email-body { font-size: 9pt; color: #666; line-height: 1.55; }

  /* Template cards */
  .template-card { background: white; border: 1pt solid #e5e1db; border-radius: 6pt; padding: 12pt 14pt; margin-bottom: 8pt; break-inside: avoid; }
  .template-name { font-family: 'Poppins', sans-serif; font-size: 10.5pt; font-weight: 700; color: #041122; margin-bottom: 4pt; }
  .template-desc { font-size: 9pt; color: #666; line-height: 1.55; }

  /* Responsibility table */
  .resp-table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 4pt; }
  .resp-table th { font-size: 8pt; font-weight: 600; color: #aaa; text-align: left; padding: 4pt 8pt 4pt 0; border-bottom: 1pt solid #ddd; text-transform: uppercase; letter-spacing: 0.05em; }
  .resp-table td { padding: 6pt 8pt 6pt 0; border-bottom: 0.5pt solid #eee; color: #1D1F28; }
  .resp-table tr { break-inside: avoid; }

  /* Timeline */
  .timeline-row { display: flex; gap: 10pt; padding: 6pt 0; border-bottom: 0.5pt solid #eee; break-inside: avoid; }
  .timeline-week { font-family: 'Poppins', sans-serif; font-size: 9pt; font-weight: 700; color: #007BFF; width: 50pt; flex-shrink: 0; }
  .timeline-desc { font-size: 9pt; color: #444; }

  /* Bottom */
  .bottom-section { background: #041122; border-radius: 6pt; padding: 14pt 16pt; margin-top: 16pt; break-inside: avoid; }
  .bottom-section h2.sh { color: white; border-bottom-color: rgba(255,255,255,0.15); margin-top: 0; }
  .bottom-row { display: flex; gap: 10pt; align-items: baseline; padding: 4pt 0; border-bottom: 0.5pt solid rgba(255,255,255,0.08); }
  .bottom-row:last-of-type { border-bottom: none; }
  .bl-label { font-weight: 600; color: rgba(255,255,255,0.5); font-size: 8pt; width: 80pt; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.05em; }
  .bl-value { font-size: 9.5pt; font-weight: 500; color: rgba(255,255,255,0.88); }
  .closing { font-family: 'Poppins', sans-serif; font-size: 11pt; font-weight: 700; color: white; text-align: center; margin-top: 10pt; padding-top: 10pt; border-top: 1pt solid rgba(255,255,255,0.15); }

  .footer { text-align: center; font-size: 7.5pt; font-style: italic; color: #ccc; margin-top: 12pt; padding-top: 6pt; border-top: 0.5pt solid #ddd; }
  .coral { color: #FF5C5C; }
  .bold { font-weight: 700; }
  .section-text { font-size: 9.5pt; color: #444; line-height: 1.6; margin: 0 0 10pt 0; }
  .bullet-list { font-size: 9pt; color: #444; line-height: 1.7; margin: 4pt 0 8pt 16pt; padding: 0; }
  .bullet-list li { margin-bottom: 3pt; }
</style>
</head>
<body>

  <div class="header no-break">
    <div>
      <h1 class="report-title">Email Marketing &<br>Automation Strategy</h1>
      <p class="report-meta">GummyGurl  ·  Carolina Natural Solutions  ·  April 2026</p>
      <p class="report-prepared">Prepared by MonteKristo AI</p>
    </div>
    <img class="header-logo" src="${logoSrc}" alt="MonteKristo AI">
  </div>

  <p class="tagline">Klaviyo-powered email ecosystem for hemp e-commerce</p>

  <p class="intro">This proposal outlines a complete email marketing ecosystem for GummyGurl, powered by Klaviyo. The system includes 7 automated flows (14 emails total), 3 reusable campaign templates, subscriber capture, and compliance-ready design. Klaviyo is already connected to WooCommerce and tracking 30 events. Once approved, we build everything in 2 weeks.</p>

  <!-- AT A GLANCE -->
  <h2 class="sh">Strategy at a Glance</h2>
  <div class="glance-grid no-break">
    <div class="glance-card"><div class="glance-value coral">7</div><div class="glance-label">Automated Flows</div></div>
    <div class="glance-card"><div class="glance-value coral">14</div><div class="glance-label">Email Templates</div></div>
    <div class="glance-card"><div class="glance-value coral">3</div><div class="glance-label">Campaign Types</div></div>
    <div class="glance-card"><div class="glance-value coral">15-25%</div><div class="glance-label">Expected Revenue Lift</div></div>
  </div>

  <!-- AUTOMATED FLOWS -->
  <h2 class="sh">Automated Flows</h2>
  <p class="section-text">Each flow triggers automatically based on customer behavior. No manual work required after setup.</p>
  ${flowSections}

  <!-- CAMPAIGN TEMPLATES -->
  <h2 class="sh">Monthly Campaign Templates</h2>
  <p class="section-text">Reusable templates for recurring campaigns. We draft content, you review before sending.</p>

  <div class="template-card no-break">
    <div class="template-name">Template A: Monthly Newsletter</div>
    <div class="template-desc">Logo header + hero image + 3-4 featured products with images, prices, and CTAs + educational content block (cannabinoid spotlight, dosing tips, wellness article) + current promotion + social links footer + compliance disclaimer.</div>
  </div>
  <div class="template-card no-break">
    <div class="template-name">Template B: Product Launch</div>
    <div class="template-desc">Hero product image + product name, description, and highlights + "Shop Now" CTA + related/similar products + compliance footer. Used for new product drops and restocks.</div>
  </div>
  <div class="template-card no-break">
    <div class="template-name">Template C: Promotion / Sale</div>
    <div class="template-desc">Bold offer headline + featured products with original/sale prices + discount code prominently displayed + urgency element (limited time) + CTA button + compliance footer.</div>
  </div>

  <!-- EMAIL DESIGN -->
  <h2 class="sh">Email Design</h2>
  <p class="section-text">All emails match your site branding for a consistent customer experience.</p>
  <ul class="bullet-list">
    <li><strong>Headers:</strong> Dark navy (#041122) with Gummy Gurl logo</li>
    <li><strong>Backgrounds:</strong> White/cream (#FAF8F4)</li>
    <li><strong>CTA Buttons:</strong> Blue (#007BFF), rounded, bold text</li>
    <li><strong>Footer:</strong> Instagram + Facebook links, unsubscribe, compliance text</li>
    <li><strong>Compliance:</strong> "All hemp-derived products are Farm Bill compliant and contain less than 0.3% THC by dry weight. Must be 21+ to purchase."</li>
  </ul>

  <!-- SUBSCRIBER CAPTURE -->
  <h2 class="sh">Subscriber Capture</h2>
  <ul class="bullet-list">
    <li><strong>Popup:</strong> Klaviyo built-in popup, 10 seconds after first visit. "Get 10% Off Your First Order" + email input. Mobile-optimized.</li>
    <li><strong>Footer Signup:</strong> Already built on site and connected to Klaviyo.</li>
    <li><strong>Checkout Opt-in:</strong> Already built. Checkbox on checkout page.</li>
    <li><strong>Post-Purchase:</strong> WooCommerce plugin auto-subscribes buyers to email list.</li>
  </ul>

  <!-- COMPLIANCE -->
  <h2 class="sh">Compliance</h2>
  <p class="section-text">Klaviyo supports hemp/CBD businesses (Mailchimp bans them). Every email includes:</p>
  <ul class="bullet-list">
    <li>21+ age disclaimer</li>
    <li>FDA disclaimer (not evaluated, not intended to diagnose/treat/cure)</li>
    <li>No medical claims in any email copy</li>
    <li>Easy one-click unsubscribe</li>
    <li>CAN-SPAM compliant physical address</li>
  </ul>

  <!-- RESPONSIBILITIES -->
  <h2 class="sh">What We Handle vs What You Manage</h2>
  <table class="resp-table">
    <thead><tr><th>We Handle</th><th>You Handle</th></tr></thead>
    <tbody>
      <tr><td>All flow setup and configuration</td><td>Monthly newsletter content approval</td></tr>
      <tr><td>Email template design and copy</td><td>Discount code creation in WooCommerce</td></tr>
      <tr><td>Automation triggers and timing</td><td>Responding to customer email replies</td></tr>
      <tr><td>WooCommerce integration (done)</td><td>Approving changes to automated flows</td></tr>
      <tr><td>Performance monitoring and A/B testing</td><td></td></tr>
    </tbody>
  </table>

  <!-- TIMELINE -->
  <h2 class="sh">Implementation Timeline</h2>
  <div class="timeline-row"><span class="timeline-week">Week 1</span><span class="timeline-desc">You approve this proposal</span></div>
  <div class="timeline-row"><span class="timeline-week">Week 2</span><span class="timeline-desc">We build all 7 flows + 3 templates + signup popup in Klaviyo</span></div>
  <div class="timeline-row"><span class="timeline-week">Week 3</span><span class="timeline-desc">Test with internal emails, refine copy and design</span></div>
  <div class="timeline-row"><span class="timeline-week">Week 4</span><span class="timeline-desc">Go live - all automations active, performance tracking begins</span></div>

  <!-- EXPECTED RESULTS -->
  <h2 class="sh">Expected Results (Industry Benchmarks)</h2>
  <div class="glance-grid no-break" style="grid-template-columns: repeat(4, 1fr);">
    <div class="glance-card"><div class="glance-value coral">50-60%</div><div class="glance-label">Welcome Series<br>Open Rate</div></div>
    <div class="glance-card"><div class="glance-value coral">40-50%</div><div class="glance-label">Abandoned Cart<br>Open Rate</div></div>
    <div class="glance-card"><div class="glance-value coral">5-15%</div><div class="glance-label">Cart Recovery<br>Rate</div></div>
    <div class="glance-card"><div class="glance-value coral">15-25%</div><div class="glance-label">Revenue From<br>Email Channel</div></div>
  </div>

  <!-- BOTTOM LINE -->
  <div class="bottom-section">
    <h2 class="sh">Next Steps</h2>
    <div class="bottom-row"><span class="bl-label">Approve</span><span class="bl-value">Review this proposal and confirm you're happy with the flows and copy</span></div>
    <div class="bottom-row"><span class="bl-label">Discount</span><span class="bl-value">Create WELCOME10, CART10, COMEBACK15, MISSYOU20 coupon codes in WooCommerce</span></div>
    <div class="bottom-row"><span class="bl-label">Launch</span><span class="bl-value">We build everything in Klaviyo and go live within 2 weeks of approval</span></div>
    <p class="closing">Ready when you are.</p>
  </div>

  <div class="footer">MonteKristo AI  ·  montekristobelgrade.com  ·  April 2026</div>

</body>
</html>`;
}

// ─── GENERATE ───
async function generateReport() {
  const outputPath = path.join(__dirname, 'gummygurl-email-strategy-april-2026.pdf');
  const html = buildHTML();
  fs.writeFileSync(path.join(__dirname, 'email-strategy-preview.html'), html);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pagedjs_pages', { timeout: 15000 });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  await browser.close();
  console.log(`PDF → ${outputPath}`);
  return outputPath;
}

generateReport().catch(console.error);
