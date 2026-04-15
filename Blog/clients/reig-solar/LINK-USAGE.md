# REIG Solar - Internal Link Usage Tracker

## Purpose
Tracks which internal links each post uses. Prevents the same 3-5 links from appearing in every post.
The blog agent MUST consult this file before selecting internal links.
Prioritize links with the lowest usage count that are topically relevant.

**CRITICAL URL FORMAT:** REIG Solar posts are at root level: `/{slug}/` (NOT `/blog/{slug}/`).
The WordPress permalink structure places posts at the domain root.

## Usage Log

| Post Slug | Internal Links Used (slugs) | Date |
|-----------|---------------------------|------|
| (retroactive population needed - grep existing post files) | | |

## Link Frequency (auto-updated after each post)

| Internal Link Slug | Times Used | Last Used In |
|-------------------|------------|--------------|
| (to be populated) | | |

## Underused Links (priority for next posts)

All links from SITEMAP.md that have been used 0-1 times. Full list to be populated after retroactive scan.
