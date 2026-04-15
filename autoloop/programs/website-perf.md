# AutoLoop Program: Website Performance Optimization

## Objective

Get the highest PageSpeed Insights performance score (0-100) while
maintaining visual design integrity and functionality.

## Evaluation

Run PageSpeed Insights API via `seo-google` skill on the target URL.
For local files, serve locally and test.

**Primary metric:** Performance score (0-100), higher is better.

**Secondary checks:** Run `frontend-critic` after each change to verify no visual regression.

## Guard Rails

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| CLS | Must stay < 0.1 | DISCARD |
| frontend-critic score | Must not decrease | DISCARD |
| Visual appearance | Must not change (screenshot comparison) | DISCARD |
| Functionality | Must not break (all links/forms work) | DISCARD |

## Action Space

### High Impact
1. **Convert images to WebP/AVIF** -- use `webp-convert` skill
2. **Add width/height to images** -- prevents CLS
3. **Add loading="lazy" to below-fold images** -- except hero/LCP image
4. **Defer non-critical JS** -- add `defer` or `async` attributes

### Medium Impact
5. **Optimize font loading** -- `font-display: swap`, preload critical fonts
6. **Add preconnect hints** -- for CDN, analytics, font providers
7. **Inline critical CSS** -- above-the-fold styles inline
8. **Remove unused CSS** -- identify and remove dead CSS rules

### Lower Impact
9. **Add resource hints** -- `preload` for critical resources
10. **Compress images** -- reduce quality where not noticeable

## Constraints

- **NEVER change visual appearance** -- screenshot before/after must match
- **NEVER remove functionality** -- all interactive elements must work
- **NEVER modify JS logic** -- only loading attributes (defer, async)
- **NEVER change content** -- text, headings, images must stay the same
- **Maximum 2 changes per iteration** (performance changes can cascade)
- **Run frontend-critic after EVERY change** to catch regressions

## Proven Techniques

(Will be populated after experiments.)
