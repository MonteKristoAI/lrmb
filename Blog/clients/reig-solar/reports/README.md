# SEO Progress Report — reig-us.com

Self-contained HTML report styled after Semrush Domain Overview. All metrics come from `data.json`.

## Files

| File | Purpose |
|------|---------|
| `data.json` | Single source of truth for all metrics and chart data |
| `data.schema.json` | JSON Schema (draft-07) documenting every field |
| `report.html` | Self-contained report — CSS + inline SVG, no external dependencies |
| `README.md` | This file |

## How to update numbers

1. Open `data.json` in any text editor.
2. Update the relevant fields (see field reference below).
3. Open `report.html` in a browser — or have Claude regenerate it.

All chart values are hardcoded SVG coordinates derived from the data. **Changing `data.json` alone does not automatically update the charts** — you must either:
- Ask Claude to regenerate `report.html` from the updated `data.json`, or
- Manually update the SVG coordinate values (see notes inline in the HTML).

## Key fields to update each month

```jsonc
// Monthly snapshot — update these each reporting period:
overview.organic_traffic_current      // Current month's organic visits
overview.organic_traffic_prev_month   // Prior month (for delta calculation)
overview.ref_domains_current          // Current referring domains
overview.ref_domains_prev_month       // Prior month
overview.backlinks_current            // Current total backlinks
overview.backlinks_prev_month         // Prior month
overview.organic_keywords_current     // Current keyword count

// Append new row to each time series:
time_series.organic_traffic_monthly   // { "month": "YYYY-MM", "value": N }
time_series.ref_domains_monthly       // same format
time_series.backlinks_monthly         // same format
time_series.blog_posts_per_month      // same format — tally posts published per month
```

## TBD fields

Any field with `"value": null` renders as "TBD" in the report. Replace `null` with the actual integer once data is available.

## Regeneration prompt (Claude)

> "Read `/Blog/clients/reig-solar/reports/data.json` and regenerate `report.html` with updated SVG chart coordinates to reflect the new data values. Keep the same design and section structure."

## Chart coordinate reference

Charts use a `viewBox="0 0 620 280"` coordinate space:
- Chart area: x=64..596, y=28..248 (width=532, height=220)
- Y scale varies per chart (set to ~10% headroom above max value)
- X positions: evenly distributed across available width for the number of data points
- Null/TBD values: shown as dashed vertical line + "TBD" label, line broken at that point

## Data sources

- Organic traffic, keywords, authority score: Semrush Domain Overview
- Backlinks, referring domains: Semrush Backlinks Overview
- AI visibility, mentions, cited pages: Semrush AI Search tab
- Blog posts per month: site publishing history (CMS / Airtable)
- Baseline (Sep–Nov 2025 avg = 21): observed flat period in Semrush traffic chart
