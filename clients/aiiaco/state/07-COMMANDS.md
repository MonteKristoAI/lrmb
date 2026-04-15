# AiiAco — Exact Commands Reference

Every command ready to copy-paste. Organized by task.

---

## Working directory

```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
```

Always run from here unless otherwise stated.

---

## Verification commands

### TypeScript check (run after any code edit)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm run check
```
Expected: `tsc --noEmit` exit 0, no errors.

### Dependency install (if node_modules missing)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
npx -y -p pnpm@10.15.1 pnpm install --ignore-scripts
```
The `--ignore-scripts` flag prevents Puppeteer from hanging during post-install (we don't need Puppeteer).

### Full sanity grep battery
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"

echo "=== 1. Em-dashes in Round 2 scope (expect 0) ==="
grep -rn "—" \
  client/index.html \
  client/src/seo/SEO.tsx \
  client/src/seo/seo.config.ts \
  client/src/seo/StructuredData.tsx \
  client/src/seo/StructuredDataSSR.tsx \
  client/src/seo/NoindexRoute.tsx \
  client/src/data/industries.ts \
  client/src/entry-server.tsx \
  client/src/App.tsx \
  client/src/pages/Home.tsx \
  client/src/pages/NotFound.tsx \
  client/src/pages/IndustryMicrosite.tsx \
  client/src/pages/AIRevenueEnginePage.tsx \
  client/src/pages/AICrmIntegrationPage.tsx \
  client/src/pages/AIWorkflowAutomationPage.tsx \
  client/src/pages/AIForRealEstatePage.tsx \
  client/src/pages/AIForVacationRentalsPage.tsx \
  scripts/prerender.mjs \
  client/public/robots.txt \
  client/public/sitemap.xml \
  client/public/llms.txt \
  client/public/about.txt \
  2>/dev/null

echo ""
echo "=== 2. AiiACo marketing copy (expect 0 outside index.html schema fields) ==="
grep -rn "AiiACo" client/src/ 2>/dev/null

echo ""
echo "=== 3. AiiACo in index.html (expect 3 - schema @name only) ==="
grep -c "AiiACo" client/index.html

echo ""
echo "=== 4. Dead slug references (expect 2 - both in prerender.mjs comment) ==="
grep -rnE 'high-risk-merchant|helium-specialty|biofuel-sustainable|cosmetics-personal|beauty-health' client/src client/public scripts/ 2>/dev/null

echo ""
echo "=== 5. Founding date consistency (expect all 2025) ==="
grep -rn "foundingDate" client/ 2>/dev/null

echo ""
echo "=== 6. www.aiiaco.com (expect 1 - Footer.tsx intentional display) ==="
grep -rn "www\.aiiaco\.com" client/src/ 2>/dev/null

echo ""
echo "=== 7. Hash fragment /#industries (expect 0) ==="
grep -rn '/#industries' client/src/ 2>/dev/null
```

### Live site bot test (after sync)
```bash
# Verify Manus serves pre-rendered HTML to Googlebot
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://aiiaco.com/ai-integration | grep -c "AI Integration"
# Expected: non-zero (Manus serves pre-rendered HTML to Googlebot)

# Test GPTBot
curl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2" https://aiiaco.com/ai-integration | grep -c "AI Integration"

# Test new service page (should work only AFTER Round 2 ships to Manus)
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://aiiaco.com/ai-revenue-engine | grep -c "AI revenue system"
# Expected before ship: 0 (404 or SPA shell)
# Expected after ship: non-zero

# Verify regular browser gets SPA (not pre-rendered)
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" https://aiiaco.com/ai-integration | grep -c "AI Integration"
# Expected: 0 or low (regular browser gets SPA shell, content populates via JS)
```

### Wikidata verification
```bash
curl -s "https://www.wikidata.org/wiki/Special:EntityData/Q138638897.json" | python3 -c "
import sys, json
d = json.load(sys.stdin)
e = list(d['entities'].values())[0]
print('Label:', e['labels']['en']['value'])
print('Inception:', e['claims']['P571'][0]['mainsnak']['datavalue']['value']['time'])
print('Website:', e['claims']['P856'][0]['mainsnak']['datavalue']['value'])
"
# Expected:
# Label: AiiACo
# Inception: +2025-00-00T00:00:00Z
# Website: https://aiiaco.com
```

### Route sync verification (sitemap vs routeMap vs App.tsx)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"

echo "=== Static routes in App.tsx ==="
grep -oE 'path="/[a-z-]+"' client/src/App.tsx | sort -u

echo ""
echo "=== Static routes in entry-server.tsx routeMap ==="
grep -oE '"/[a-z-]+":' client/src/entry-server.tsx | sort -u

echo ""
echo "=== Static routes in prerender.mjs STATIC_ROUTES ==="
grep -oE '"/[a-z-]+"' scripts/prerender.mjs | sort -u | head -30

echo ""
echo "=== URLs in sitemap.xml ==="
grep -oE '<loc>[^<]+</loc>' client/public/sitemap.xml | sed 's|<loc>https://aiiaco.com||' | sed 's|</loc>||' | sort -u

echo ""
echo "=== PAGE_META keys in seo.config.ts ==="
grep -oE '"/[a-z-]+"' client/src/seo/seo.config.ts | sort -u
```

All five should have the same static route set (not including industry slugs).

---

## Round 3 cleanup scripts

### Grep inventory for Round 3 targets
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"

echo "=== AiiACo in untouched components (target for replacement) ==="
grep -rn "AiiACo" client/src/components/ client/src/const.ts 2>/dev/null | wc -l

echo ""
echo "=== Files containing AiiACo in components ==="
grep -rl "AiiACo" client/src/components/ client/src/const.ts 2>/dev/null

echo ""
echo "=== Em-dashes in untouched files ==="
grep -rn "—" client/src/components/ client/src/const.ts client/src/index.css client/src/pages/AIAutomationPage.tsx client/src/pages/AIImplementationPage.tsx client/src/pages/AIIntegrationPage.tsx client/src/pages/AIGovernancePage.tsx client/src/pages/ManifestoPage.tsx client/src/pages/MethodPage.tsx client/src/pages/IndustriesPage.tsx client/src/pages/ResultsPage.tsx client/src/pages/CaseStudiesPage.tsx client/src/pages/ModelsPage.tsx client/src/pages/UpgradePage.tsx client/src/pages/WorkplacePage.tsx client/src/pages/CorporatePage.tsx client/src/pages/AgentPackagePage.tsx client/src/pages/DiagnosticDemoPage.tsx client/src/pages/TalkPage.tsx 2>/dev/null | wc -l
```

### Python script: AiiACo → AiiAco in Round 3 files
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
python3 << 'PYEOF'
import os
import subprocess

# Get files that have AiiACo in them
result = subprocess.run(
    ["grep", "-rl", "AiiACo", "client/src/components/", "client/src/const.ts", "client/src/pages/"],
    capture_output=True, text=True
)
files = [f for f in result.stdout.strip().split("\n") if f and "index.html" not in f]

total = 0
for path in files:
    try:
        with open(path) as f:
            content = f.read()
    except FileNotFoundError:
        continue
    before = content.count("AiiACo")
    if before == 0:
        continue
    # Replace ALL AiiACo with AiiAco in components (no schema @name fields in components)
    content = content.replace("AiiACo", "AiiAco")
    after = content.count("AiiACo")
    with open(path, 'w') as f:
        f.write(content)
    print(f"  {path}: {before} -> {after}")
    total += before - after

print(f"\nTotal replacements: {total}")
PYEOF
```

### Python script: em-dash purge in Round 3 files
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"
python3 << 'PYEOF'
import os
import subprocess

# Get files with em-dashes
result = subprocess.run(
    ["grep", "-rl", "—",
     "client/src/components/",
     "client/src/const.ts",
     "client/src/index.css",
     "client/src/pages/"],
    capture_output=True, text=True
)
files = [f for f in result.stdout.strip().split("\n") if f]

# Exclude Round 2 files (already cleaned)
round2_files = {
    "client/src/pages/Home.tsx",
    "client/src/pages/NotFound.tsx",
    "client/src/pages/IndustryMicrosite.tsx",
    "client/src/pages/AIRevenueEnginePage.tsx",
    "client/src/pages/AICrmIntegrationPage.tsx",
    "client/src/pages/AIWorkflowAutomationPage.tsx",
    "client/src/pages/AIForRealEstatePage.tsx",
    "client/src/pages/AIForVacationRentalsPage.tsx",
}
files = [f for f in files if f not in round2_files]

total = 0
for path in files:
    try:
        with open(path) as f:
            content = f.read()
    except FileNotFoundError:
        continue
    before = content.count("—")
    if before == 0:
        continue
    content = content.replace(">—<", ">•<")
    content = content.replace(" — ", " - ")
    content = content.replace(" —", " -")
    content = content.replace("— ", "- ")
    content = content.replace("—", "-")
    with open(path, 'w') as f:
        f.write(content)
    print(f"  {path}: removed {before}")
    total += before

print(f"\nTotal em-dashes removed: {total}")
PYEOF
```

### After Round 3 cleanup, verify
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco"

# TypeScript check
npx -y -p pnpm@10.15.1 pnpm run check

# Should be 0 now (outside index.html schema)
grep -rn "AiiACo" client/src/ 2>/dev/null | grep -v "index.html" | wc -l

# Should be 0 for all files
grep -rn "—" client/src/ client/public/ scripts/ 2>/dev/null | wc -l

# Spawn critic agent for final review (use Agent tool)
```

---

## Manus sync preparation

### Create ZIP of changed files only (for Manus upload)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"
zip -r aiiaco-round2-upload.zip \
  aiiaco/client/index.html \
  aiiaco/client/src/App.tsx \
  aiiaco/client/src/entry-server.tsx \
  aiiaco/client/src/seo/ \
  aiiaco/client/src/data/industries.ts \
  aiiaco/client/src/pages/Home.tsx \
  aiiaco/client/src/pages/NotFound.tsx \
  aiiaco/client/src/pages/IndustryMicrosite.tsx \
  aiiaco/client/src/pages/AIRevenueEnginePage.tsx \
  aiiaco/client/src/pages/AICrmIntegrationPage.tsx \
  aiiaco/client/src/pages/AIWorkflowAutomationPage.tsx \
  aiiaco/client/src/pages/AIForRealEstatePage.tsx \
  aiiaco/client/src/pages/AIForVacationRentalsPage.tsx \
  aiiaco/client/public/robots.txt \
  aiiaco/client/public/sitemap.xml \
  aiiaco/client/public/llms.txt \
  aiiaco/client/public/about.txt \
  aiiaco/scripts/prerender.mjs \
  -x "*/node_modules/*"
ls -lh aiiaco-round2-upload.zip
```

### OR create full source ZIP (complete project minus node_modules)
```bash
cd "/Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco"
zip -r aiiaco-full-source.zip aiiaco/ \
  -x "*/node_modules/*" \
  -x "*/.git/*" \
  -x "*/dist/*" \
  -x "*/__manus__/*"
ls -lh aiiaco-full-source.zip
```

---

## Adversarial critic spawn pattern

Use this exact prompt template when spawning a critic agent via the `Agent` tool:

```
description: "Adversarial critic [phase name]"
subagent_type: "general-purpose"
prompt: "You are an adversarial senior code reviewer. Your SOLE job is to find mistakes. Be hostile. Assume the engineer was sloppy and you must prevent production bugs.

WORKING DIR: /Users/milanmandic/Desktop/MonteKristo AI/clients/aiiaco/aiiaco

CONTEXT: [describe what was changed and why]

Review these files:
[list files]

CHECK FOR:
1. TypeScript/JSX errors
2. Schema.org validation (wrong @type, missing required properties, broken @id references)
3. Broken references (routes, imports, slugs)
4. Logic errors (off-by-one, wrong conditional)
5. SEO regressions (canonical, meta tags, noindex)
6. Hydration mismatches
7. Brand casing (AiiAco marketing, AiiACo schema @name only)
8. AI-tell phrases (delve, tapestry, moreover, em-dashes)
9. Accessibility (alt text, aria, semantic HTML)
10. Content factuality (real regulation/platform names)
11. Completeness (half-done changes)
12. Cross-file consistency (routes in sync across App.tsx, entry-server.tsx, prerender.mjs, sitemap.xml, PAGE_META)

OUTPUT: Ordered list by severity (CRITICAL/HIGH/MEDIUM/LOW). Each finding: FILE:LINE, description, suggested fix.

Your bar is STRICT. Minimum 10 findings or you haven't looked hard enough. Report under 4000 words."
run_in_background: true
```

After critic completes, read output carefully, fix critical + high findings, re-run TypeScript check.

---

## MCP cloudflare commands (if needed)

### List zones
```javascript
// Via mcp__cloudflare__execute
async () => {
  const res = await cloudflare.request({ method: "GET", path: "/zones", query: { per_page: 50 } });
  return res.result.map(z => ({ name: z.name, status: z.status, id: z.id }));
}
```

### Delete aiiaco.com zone (if still exists from old work)
```javascript
async () => {
  // First find it
  const zones = await cloudflare.request({ method: "GET", path: "/zones", query: { name: "aiiaco.com" } });
  if (zones.result.length === 0) return { message: "not found" };
  const id = zones.result[0].id;
  return await cloudflare.request({ method: "DELETE", path: `/zones/${id}` });
}
```

---

## Firecrawl commands (for site scraping)

### Scrape a single page
```
mcp__firecrawl-mcp__firecrawl_scrape
url: https://aiiaco.com/ai-revenue-engine
formats: ["markdown", "links"]
onlyMainContent: true
```

### Map entire site (discover all URLs)
```
mcp__firecrawl-mcp__firecrawl_map
url: https://aiiaco.com
includeSubdomains: false
limit: 100
```

---

## Google Search Console submission (manual via UI)

No MCP available for GSC, requires UI:

1. Go to https://search.google.com/search-console/
2. Select property `https://aiiaco.com`
3. Sitemaps → Add a new sitemap → `sitemap.xml` → Submit
4. URL Inspection → enter each new URL → Request Indexing:
   - `https://aiiaco.com/ai-crm-integration`
   - `https://aiiaco.com/ai-workflow-automation`
   - `https://aiiaco.com/ai-revenue-engine`
   - `https://aiiaco.com/ai-for-real-estate`
   - `https://aiiaco.com/ai-for-vacation-rentals`
5. Check Coverage report after 7 days for indexation status
