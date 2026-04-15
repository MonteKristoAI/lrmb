#!/bin/bash
# AiiACo: Run after PR #1 merges and Manus rebuilds aiiaco.com
# This script verifies the new routes are live, then prints the
# manual GSC + Bing steps (no API automation yet — requires oauth).

set -e

echo "=== Step 1: Verify new service pages return real content (not 404 shell) ==="
FAIL=0
for route in /ai-revenue-engine /ai-crm-integration /ai-workflow-automation /ai-for-real-estate /ai-for-vacation-rentals /ai-infrastructure; do
  title=$(curl -s -A "Googlebot/2.1" "https://aiiaco.com${route}" | grep -oE '<h1[^>]*>[^<]+' | head -1)
  if [ -z "$title" ] || echo "$title" | grep -q "404"; then
    echo "  FAIL: $route -> $title"
    FAIL=1
  else
    echo "  OK: $route -> $title"
  fi
done

if [ $FAIL -eq 1 ]; then
  echo ""
  echo "Some routes still show 404. Manus may not have rebuilt yet."
  echo "Wait 5 minutes and re-run, or check Manus dashboard."
  exit 1
fi

echo ""
echo "=== Step 2: Verify sitemap includes new routes ==="
for route in ai-revenue-engine ai-crm-integration ai-workflow-automation ai-for-real-estate ai-for-vacation-rentals ai-infrastructure; do
  count=$(curl -s https://aiiaco.com/sitemap.xml | grep -c "$route")
  echo "  sitemap: $route -> $count entries"
done

echo ""
echo "=== Step 3: Verify no duplicate canonical ==="
count=$(curl -s -A "Googlebot/2.1" https://aiiaco.com/ | grep -c 'rel="canonical"')
echo "  canonical tags on homepage: $count (should be 1)"

echo ""
echo "=== Step 4: Manual GSC submission steps ==="
echo ""
echo "1. Open Google Search Console: https://search.google.com/search-console"
echo "   Property: https://aiiaco.com/"
echo "   Login: contact@montekristobelgrade.com"
echo ""
echo "2. Go to Sitemaps -> Submit 'https://aiiaco.com/sitemap.xml'"
echo ""
echo "3. Go to URL Inspection -> Inspect these 6 URLs one by one:"
echo "   - https://aiiaco.com/ai-revenue-engine"
echo "   - https://aiiaco.com/ai-crm-integration"
echo "   - https://aiiaco.com/ai-workflow-automation"
echo "   - https://aiiaco.com/ai-for-real-estate"
echo "   - https://aiiaco.com/ai-for-vacation-rentals"
echo "   - https://aiiaco.com/ai-infrastructure"
echo ""
echo "4. For each: click 'Request Indexing' after inspection completes"
echo ""
echo "5. Also submit blog sitemap for the Cloudflare Pages domain:"
echo "   Property: https://aiiaco-blog.pages.dev/"
echo "   Sitemap: https://aiiaco-blog.pages.dev/sitemap.xml"
echo ""
echo "=== Step 5: Bing Webmaster Tools ==="
echo ""
echo "1. Open Bing Webmaster Tools: https://www.bing.com/webmasters"
echo "2. Add property https://aiiaco.com/ (if not already added)"
echo "3. Submit sitemap: https://aiiaco.com/sitemap.xml"
echo "4. Submit blog sitemap: https://aiiaco-blog.pages.dev/sitemap.xml"
echo ""
echo "Done. Monitor GSC for indexation over the next 48-72 hours."
