# SDS / Warrior — Blog Sitemap

**Authoritative source for all internal links.**
Every internal link in every blog post MUST come from this file.

**Rule:** Only posts that are **already live on the site** appear here. Planned posts do NOT get listed until they're published. No same-batch linking (per Blog/CLAUDE.md Section 4).

---

## Non-Blog Pages

| Page | URL | Use when... |
|------|-----|-------------|
| Homepage | https://sdsdata.lovable.app/ | Referring to the SDS main landing (TEMP URL — will change when domain is confirmed) |
| About Us | https://sdsdata.lovable.app/about | Referring to SDS history, Houston heritage, 34 years |
| Products / Warrior Universal Panel | https://sdsdata.lovable.app/products/warrior-universal-panel | Product-specific references |
| Request a Quote | https://sdsdata.lovable.app/#quote | All primary CTAs for blog posts |
| Contact | https://sdsdata.lovable.app/contact | Secondary CTA |
| Warrior User Forum | (TBD) | Secondary CTA for ET / Tech Manager posts |
| Leasing Program | (TBD — add when live) | Leasing-related CTAs |
| Blog Hub | https://sdsdata.lovable.app/blog/ | Back link from every post |

**Domain caveat:** All URLs above use `sdsdata.lovable.app` as the placeholder domain. When the final blog hosting decision is made (see `clients/sds/PROJECT.md`), update this file in a single pass.

---

## Blog Posts

### Cluster: Hub A — Vendor-Agnostic Wireline Architecture

| Slug | Title | Primary Keyword |
|------|-------|----------------|
| (empty) | | |

### Cluster: Hub B — Warrior Universal Panel

| Slug | Title | Primary Keyword |
|------|-------|----------------|
| (empty) | | |

### Cluster: Hub C — Perforating Automation & Addressable Switches

| Slug | Title | Primary Keyword |
|------|-------|----------------|
| (empty) | | |

### Cluster: Hub D — Geothermal Wireline Transition

| Slug | Title | Primary Keyword |
|------|-------|----------------|
| (empty) | | |

### Cluster: Hub E — Wireline Economics & Leasing

| Slug | Title | Primary Keyword |
|------|-------|----------------|
| (empty) | | |

### Cluster: Standalone (Career / Education)

| Slug | Title | Primary Keyword |
|------|-------|----------------|
| (empty) | | |

---

## How to Update This File

After every post is published:

1. Add the post row to the correct cluster table:
   ```
   | post-slug | Full Title | primary keyword |
   ```
2. Save this file
3. Run the Bidirectional Link Scanner (`Blog/CLAUDE.md` Step 5.5) to surface posts that should link to the new one

**Never pre-add planned posts here.** SITEMAP.md is a reflection of what is actually live.

---

## Link Hygiene Rules

- **Use relative paths for internal links:** `/blog/{slug}/` — never include the full domain
- **Trailing slashes required** (WordPress convention; static HTML also supports)
- **External link format:** `<a href="..." target="_blank" rel="noopener noreferrer">`
- **Do not link to a post that isn't in this file.** If a topic is referenced but not yet published, use a future-link comment: `<!-- FUTURE LINK: [topic] when published -->`
- **Do not link to the same post twice** in a single blog post. Link once, in the most relevant paragraph.
