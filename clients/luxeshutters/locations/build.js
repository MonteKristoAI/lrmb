#!/usr/bin/env node
/**
 * LuxeShutters Location Pages Build Script
 *
 * Reads JSON data from /locations/, applies the HTML template,
 * generates structured data, and outputs static HTML to /dist/.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://luxeshutters.com.au';
const DIST = path.join(__dirname, 'dist');
const LOCATIONS_DIR = path.join(__dirname, 'locations');
const TEMPLATE_FILE = path.join(__dirname, 'templates', 'location.html');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Read all location JSON files
const locationFiles = fs.readdirSync(LOCATIONS_DIR).filter(f => f.endsWith('.json'));
const locations = locationFiles.map(f => {
  const data = JSON.parse(fs.readFileSync(path.join(LOCATIONS_DIR, f), 'utf-8'));
  return data;
});

console.log(`Found ${locations.length} locations`);

// Read template
const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
ensureDir(DIST);

// Build each location page
for (const loc of locations) {
  console.log(`Building /${loc.slug}/...`);

  // Generate highlights HTML (Tailwind classes matching React)
  const highlightsHtml = loc.highlights.map(h =>
    `<div class="flex items-start gap-3 bg-card rounded-xl p-5 shadow-sm border border-border/40 text-left">
          <svg class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span class="text-sm">${h}</span>
        </div>`
  ).join('\n        ');

  // Generate FAQ HTML (matches FAQSection.tsx accordion style)
  const faqsHtml = loc.faqs.map((faq, i) =>
    `<details class="rounded-xl border border-border/60 bg-card px-5 sm:px-6 shadow-sm"${i === 0 ? ' open' : ''}>
          <summary class="text-left font-medium hover:no-underline py-5 text-[15px] sm:text-base cursor-pointer list-none [&::-webkit-details-marker]:hidden">${faq.q}</summary>
          <div class="text-muted-foreground leading-relaxed pb-5 text-sm sm:text-[15px]">${faq.a}</div>
        </details>`
  ).join('\n        ');

  // Generate other locations HTML
  const otherLocsHtml = locations
    .filter(l => l.slug !== loc.slug)
    .map(l => `<a href="/${l.slug}/" class="rounded-full px-5 py-2.5 text-sm font-medium bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors shadow-sm">${l.name}</a>`)
    .join('\n        ');

  // Generate footer location links
  const footerLocsHtml = locations
    .map(l => `<li><a href="/${l.slug}/" class="text-sm text-white/60 hover:text-white transition-colors">${l.name}</a></li>`)
    .join('\n            ');

  // Generate JSON-LD schema
  const schema = `<script type="application/ld+json">
${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Luxe Shutters",
      "description": `Premium shutters, blinds, curtains, zipscreens, and awnings in ${loc.name}, ${loc.region}. Custom-made and professionally installed.`,
      "url": `${SITE_URL}/${loc.slug}/`,
      "telephone": "1800-465-893",
      "email": "admin@luxeshutters.com.au",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "185 Hoskins St",
        "addressLocality": "Temora",
        "addressRegion": "New South Wales",
        "postalCode": "2666",
        "addressCountry": "AU"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": -34.4468, "longitude": 147.5344 },
      "areaServed": { "@type": "City", "name": loc.name },
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:00", "closes": "17:00"
      }],
      "priceRange": "$$",
      "image": `${SITE_URL}/og-image.webp`,
      "sameAs": ["https://www.facebook.com/Luxeshutters", "https://www.instagram.com/luxe_shutters"]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": loc.name, "item": `${SITE_URL}/${loc.slug}/` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Window Furnishings in ${loc.name}`,
      "description": `Premium shutters, blinds, curtains, zipscreens, and awnings. Custom-made and professionally installed in ${loc.name} and surrounding ${loc.region} areas.`,
      "provider": { "@type": "LocalBusiness", "name": "Luxe Shutters", "url": SITE_URL },
      "areaServed": { "@type": "State", "name": "New South Wales" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": loc.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ], null, 2)}
</script>`;

  // Apply template
  let html = template
    .replace(/\{\{TITLE\}\}/g, loc.title)
    .replace(/\{\{META_DESCRIPTION\}\}/g, loc.metaDescription)
    .replace(/\{\{SLUG\}\}/g, loc.slug)
    .replace(/\{\{NAME\}\}/g, loc.name)
    .replace(/\{\{REGION\}\}/g, loc.region)
    .replace(/\{\{HERO_TAGLINE\}\}/g, loc.heroTagline)
    .replace(/\{\{DISTANCE\}\}/g, loc.distance)
    .replace(/\{\{DESCRIPTION\}\}/g, loc.description)
    .replace(/\{\{HIGHLIGHTS\}\}/g, highlightsHtml)
    .replace(/\{\{FAQS\}\}/g, faqsHtml)
    .replace(/\{\{OTHER_LOCATIONS\}\}/g, otherLocsHtml)
    .replace(/\{\{FOOTER_LOCATIONS\}\}/g, footerLocsHtml)
    .replace(/\{\{SCHEMA\}\}/g, schema)
    .replace(/\{\{YEAR\}\}/g, new Date().getFullYear().toString());

  // Write output
  const outDir = path.join(DIST, loc.slug);
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, 'index.html'), html);

  const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`  Saved dist/${loc.slug}/index.html (${sizeKB} KB)`);
}

// Generate sitemap fragment
const sitemapEntries = locations.map(loc =>
  `  <url>\n    <loc>${SITE_URL}/${loc.slug}/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

fs.writeFileSync(path.join(DIST, 'sitemap-locations.xml'), sitemap);
console.log(`\nSitemap: dist/sitemap-locations.xml`);
console.log(`\nBuild complete! ${locations.length} location pages generated.`);
