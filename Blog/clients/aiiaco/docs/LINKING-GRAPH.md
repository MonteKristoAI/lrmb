---
type: linking-graph
client: AiiACo
date: 2026-04-11
tags: [aiiaco, internal-links, pagerank]
---

# AiiACo Internal Linking Graph

**Purpose**: explicit hub-and-spoke internal linking per post. Every writer references this when drafting to avoid cannibalization and maximize internal pagerank flow.

**Rule**: every post body must contain the exact internal link set listed in its row. No more (link dilution), no less (missed pagerank).

---

## Link schema

Each post has 5 types of internal links:

1. **Cluster hub link**: link to the cluster hub post (anchor text = hub's primary keyword)
2. **Cluster spoke links (1-2)**: link to adjacent spokes in the same cluster
3. **Cross-cluster bridge (1)**: link to a hub in a related cluster
4. **Service page link (1-3)**: absolute URL to aiiaco.com service page
5. **CTA link (1)**: consultation booking link at the end of post (Tier A only)

## Per-post link matrix

Columns: Hub target | Spoke 1 | Spoke 2 | Bridge | Service | CTA

| Post | Hub link | Spoke 1 | Spoke 2 | Bridge | Service | CTA |
|-----:|----------|---------|---------|--------|---------|-----|
| 1 (shipped) | - | 7 | 24 | 2 | /ai-revenue-engine | yes |
| 2 (shipped) | - | 3, 4 | 9 | 1 | /ai-crm-integration, /ai-for-real-estate | yes |
| 3 (shipped) | 2 | 4 | 25 | 1 | /ai-for-real-estate | yes |
| 4 | 2 | 9, 26 | 27 | 1 | /ai-crm-integration | yes |
| 5 | 1 | 10, 16 | 29 | 2 | /ai-revenue-engine, /ai-crm-integration | yes |
| 6 | 1 | 11 | 44 | 8 | /ai-revenue-engine | yes |
| 7 | 1 | 16, 24 | 50 | 2 | /ai-revenue-engine | yes |
| 8 | 9 | 21, 36 | 40 | 1 | /ai-integration-services | yes |
| 9 | 2 | 4, 26 | 27 | 1 | /ai-crm-integration | yes |
| 10 | 5 | 16 | 48 | 3 | /ai-crm-integration | yes |
| 11 | 6 | 44 | - | 1 | /ai-revenue-engine | yes |
| 12 | 1 | 17, 22 | 39 | 4 | /ai-for-vacation-rentals | yes |
| 13 | 2 | 33, 34 | 19 | 7 | /ai-governance | no |
| 14 | 6 (hub itself) | 46 | - | 1 | /ai-workflow-automation | no |
| 15 | 2 | 25 | 38 | 1 | /ai-for-real-estate | yes |
| 16 | 5 | 7 | 35 | 3 | /ai-revenue-engine | yes |
| 17 | 4 | 12, 22 | - | 1 | /ai-for-vacation-rentals | no |
| 18 | 2 | 25 | - | 6 | /ai-for-real-estate | no |
| 19 | 7 (hub itself) | 20, 31 | 13 | 2 | /ai-governance | no |
| 20 | 7 (hub itself) | 19, 31 | 10 | 3 | /ai-governance | no |
| 21 | 9 | 8, 40 | 45 | 1 | /ai-integration-services | yes |
| 22 | 4 | 12, 17 | - | 4 | /ai-for-vacation-rentals | no |
| 23 | 2 | 3, 38 | - | 1 | /ai-revenue-engine | no |
| 24 | 1 (hub itself) | 7, 49 | 50 | 9 | /ai-revenue-engine | yes |
| 25 | 2 | 4, 18 | - | 1 | /ai-crm-integration | no |
| 26 | 2 | 4, 9 | 27 | 1 | /ai-crm-integration | yes |
| 27 | 2 | 4, 9 | 26 | 1 | /ai-crm-integration | yes |
| 28 | 8 | 30, 43 | 4 | 1 | /ai-crm-integration | no |
| 29 | 5 | 10, 16 | - | 3 | /ai-for-real-estate | no |
| 30 | 8 | 28, 43 | - | 6 | /ai-crm-integration | no |
| 31 | 7 | 19, 20 | - | 9 | /ai-governance | no |
| 32 | 2 | 4, 38 | - | 8 | /ai-for-real-estate | no |
| 33 | 2 | 13, 34 | - | 7 | /ai-for-real-estate | no |
| 34 | 2 | 13, 33 | - | 7 | /ai-for-real-estate | no |
| 35 | 5 | 16 | 7 | 3 | /ai-revenue-engine | no |
| 36 | 9 | 8, 42 | 46 | 6 | /ai-integration-services | no |
| 37 | 9 | 8, 21 | 40 | 1 | /ai-integration-services | no |
| 38 | 2 | 11, 25 | - | 1 | /ai-for-real-estate | yes |
| 39 | 4 | 12, 47 | - | 1 | /ai-for-vacation-rentals | yes |
| 40 | 9 | 8, 21 | 45 | 1 | /ai-integration-services | no |
| 41 | 2 | 4, 14 | - | 6 | /ai-workflow-automation | no |
| 42 | 9 | 8, 36 | - | 1 | /ai-integration-services | yes |
| 43 | 8 (hub itself) | 28, 30 | - | 1 | /ai-crm-integration | no |
| 44 | 1 | 11, 6 | - | 5 | /ai-revenue-engine | yes |
| 45 | 1 | 24, 49 | 50 | 1 | /ai-revenue-engine | no |
| 46 | 6 | 14, 36 | - | 6 | /ai-workflow-automation | no |
| 47 | 4 | 12, 39 | - | 1 | /ai-for-vacation-rentals | yes |
| 48 | 5 | 10, 16 | - | 3 | /ai-for-real-estate | yes |
| 49 | 1 | 24, 45 | 50 | 1 | /ai-revenue-engine | yes |
| 50 | 1 | 24, 45 | 49 | 9 | /ai-revenue-engine | no |

Service page legend:
- `/ai-revenue-engine` (Cluster 1 primary)
- `/ai-crm-integration` (Cluster 2 + 3 primary)
- `/ai-for-real-estate` (Cluster 2 secondary)
- `/ai-for-vacation-rentals` (Cluster 4 primary)
- `/ai-workflow-automation` (Cluster 6 primary)
- `/ai-integration-services` (Cluster 9 primary)
- `/ai-governance` (Cluster 7 primary)

## Anchor text rules

Never use generic anchor text ("click here", "read more", "this post"). Always use descriptive text that names the target post's primary keyword or close variant.

### Good examples

- "Our [five-component framework for AI revenue systems](/blog/what-is-an-ai-revenue-system/) covers..."
- "If you run Follow Up Boss, see our [Follow Up Boss integration playbook](/blog/how-to-integrate-ai-into-follow-up-boss/)."
- "[FHA compliance for AI-generated listings](/blog/fair-housing-act-compliance-for-ai-listings/) is not optional."

### Bad examples

- "Read [this post](...) for more."
- "[Click here](...)."
- "[See our guide](...)."

## Link density rules

- Pillar posts (T1): 5 to 8 internal links minimum
- How-to posts (T2): 4 to 6 internal links
- Opinion posts (T3): 3 to 5 internal links
- Data / comparison (T4): 4 to 7 internal links

## Service page link rules

Absolute URLs only. Never `/ai-revenue-engine` - always `https://aiiaco.com/ai-revenue-engine`. This is per PATTERN P-017 and is already enforced in shipped posts.

## CTA block (Tier A posts only)

At the end of every Tier A post, include this block:

```html
<div class="article-cta">
  <h3>Planning an AI integration?</h3>
  <p>Book a 30-minute diagnostic call with Nemr Hallak. We walk through your current CRM stack, identify where the operational friction lives, and show you whether a 3-to-5 week first module makes sense for your operation.</p>
  <p><a class="btn-gold" href="https://aiiaco.com/talk">Book a call with Nemr</a></p>
</div>
```

## Reverse-link audit

Every time a new post ships, go to each post listed in its "Hub / Spoke / Bridge" columns and verify the target post's body actually contains an anchor back to the new post. Two-way linking is worth 3x the one-way version for pagerank.

Audit checklist after each publish:

1. For Post N, list the posts referenced in its Link Matrix row
2. For each referenced post, edit to include a link back to Post N (if not already present)
3. Rebuild and redeploy
4. Verify both directions with curl + grep

## Link equity flow analysis

Target distribution of internal link clicks (estimated from GA4 in Phase 2):

- 30% of clicks go to cluster hubs (posts 1, 2, 5, 6, 7, 8, 12, 14, 19, 43)
- 40% of clicks go to spokes within the same cluster
- 20% of clicks go to bridge posts in adjacent clusters
- 10% of clicks go to service pages

If GA4 shows heavy skew (e.g. 70% of clicks going to a single post), rebalance link placement.
