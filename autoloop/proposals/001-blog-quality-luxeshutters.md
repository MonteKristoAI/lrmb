# AutoLoop Proposal: 001

**Domain:** blog-quality
**Client:** LuxeShutters
**Target:** clients/luxeshutters/blog/posts/plantation-shutters-cost-australia.html
**Generated:** 2026-04-14
**Iterations:** 3 total, 3 kept, 0 discarded

## Score Progression

| Iteration | Score | Delta | Status | Change Summary |
|-----------|-------|-------|--------|----------------|
| baseline  | 86    | --    | --     | Starting point. Strong post, weak on Technical Elements (10/15) |
| 1         | 89    | +3    | kept   | Added BlogPosting + Person + Organization JSON-LD schema |
| 2         | 90    | +1    | kept   | Added OG meta tags (og:title, og:description, og:image, twitter:card) |
| 3         | 90    | +0    | kept   | Added contextual internal link to /temora service area |

## Kept Changes (apply these)

### Change 1: BlogPosting + Person JSON-LD Schema (+3 points)
- **What:** Added `<script type="application/ld+json">` block at end of file with BlogPosting, Person (Chris & Campbell), Organization (LuxeShutters), and LocalBusiness schema
- **Why:** Post had FAQPage microdata but no JSON-LD for the article itself. BlogPosting + Person is the minimum for Google rich results and E-E-A-T signaling.
- **Impact:** Technical Elements 10/15 -> 13/15. Schema validates as valid JSON-LD.

### Change 2: OG/Social Meta Tags (+1 point)
- **What:** Added og_title, og_description, og_image, twitter_card to META frontmatter block
- **Why:** Social sharing preview was completely absent. These tags control how the post appears when shared on Facebook, LinkedIn, Twitter.
- **Impact:** Technical Elements 13/15 -> 14/15.

### Change 3: Contextual Internal Link (+0 points, SEO benefit)
- **What:** Linked the word "Temora" to /temora service area page within the quoting process section
- **Why:** Strengthens internal link architecture. Only 1 blog post exists on the site currently, so blog-to-blog linking is not possible.
- **Impact:** No score change, but improves link equity flow to service area page.

## Discarded Changes
- None. All 3 iterations produced improvements or neutral-positive changes.

## Stagnation Note
After 3 iterations, the post scores 90/100 (Exceptional). Remaining improvement potential is limited:
- Content Quality (27/30): could gain 1-2 points with additional sourced statistics, but post is already data-rich
- SEO (22/25): internal linking limited by single-post blog. Will improve as more posts are published.
- E-E-A-T (13/15): already strong with named authors and real-world experience signals
- Technical (14/15): 1 remaining point would require page speed verification (not possible from file alone)

## Net Result
- Before: **86/100** (Strong)
- After: **90/100** (Exceptional)
- Delta: **+4 points**
- AI detection: 18% (unchanged, no risk)
- Burstiness: 7.5/10 (unchanged, human-like)
- Banned words: 0 (unchanged)
- Em dashes: 0 (unchanged)
- All guard rails: PASSED

## Action Required
Milan: Review the 3 changes above. Approve individually or batch. Changes are already applied to the local file. Reject to revert.
