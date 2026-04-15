# AutoLoop Program: SEO Page Score Optimization

## Objective

Get the highest seo-page score (0-100) for a given page while preserving
visual design and content integrity.

## Evaluation

Run `/seo-page` on the target URL or HTML file.

**Primary metric:** Overall score (0-100), higher is better.

**Score categories:** On-Page SEO, Content Quality, Technical, Schema, Images

## Guard Rails

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| No category score drops | Must not decrease vs baseline | DISCARD |
| Keyword density | Must stay 1-3% | DISCARD |
| Schema JSON-LD | Must parse without errors | DISCARD |
| Visible content | Must not change meaning | DISCARD |

## Action Space

### High Impact
1. **Optimize title tag** -- 50-60 chars, front-loaded keyword, power word
2. **Write/improve meta description** -- 150-160 chars, include one statistic
3. **Add missing schema markup** -- BlogPosting, Person, FAQ, BreadcrumbList (JSON-LD)
4. **Fix heading hierarchy** -- H1 > H2 > H3, no skips, keyword in 2-3 headings

### Medium Impact
5. **Add alt text to images** -- descriptive, include keyword where natural
6. **Add internal links** -- from SITEMAP.md, descriptive anchor text
7. **Add Open Graph meta tags** -- og:title, og:description, og:image, og:url
8. **Add Twitter Card meta tags** -- twitter:card, twitter:title, twitter:description

### Lower Impact
9. **Add canonical tag** -- self-referencing
10. **Add external links** -- to tier 1-3 authoritative sources

## Constraints

- **NEVER change visible page content** (headings, paragraphs, images) unless specifically targeting Content Quality score
- **Only modify meta/technical elements and schema** by default
- **NEVER remove existing schema** that passes validation
- **NEVER introduce keyword stuffing** (density > 3%)
- **Maximum 3 changes per iteration**

## Proven Techniques

(Will be populated after experiments.)

## Anti-Patterns

(Will be populated after experiments.)
