---
type: distribution-templates
client: AiiACo
date: 2026-04-11
added_per: Nemr feedback (video + shorts + LinkedIn + blog per topic)
tags: [aiiaco, distribution, repurposing, multi-format]
---

# AiiACo Distribution Templates

**Purpose**: every blog post becomes 4 content formats (blog + LinkedIn + video + shorts). Nemr's direction is multi-format per topic so the content compounds across channels, not just search.

**Scope**: this file defines the 4 templates. The `aiiaco-blog-write` skill calls `/blog repurpose` after writing each post and maps the output into these templates.

---

## Format 1: Blog post (the anchor)

Source of truth. Lives in `aiiaco-blog/posts/{slug}.html`. Follows `PERFECT-POST-TEMPLATE.md` structure. Everything else references this.

## Format 2: LinkedIn post (Nemr's personal account)

**Voice**: first person Nemr. Punchy opener, real numbers, real stakes.
**Length**: 150 to 300 words, 3 to 5 short paragraphs.
**Link**: one link at the bottom to the blog post.

### Template

```
[1 sentence hook - contrarian claim or specific operator observation]

[2-3 sentences setting up the problem - use specific tools, specific numbers]

[2-3 sentences for the framework or the answer - name the layer/step/component]

[1-2 sentences closing with the outcome range - use sanctioned ranges if applicable]

Full breakdown here: https://aiiaco.com/blog/{slug}/

#AIIntegration #{VerticalTag} #AI{Category}
```

### Good example (for Post 51 Speed to Lead)

```
Most real estate brokerages lose deals in the first 5 minutes.

The HBR lead response time study shows: firms that respond within 5 minutes are 21x more likely to qualify the lead than firms that wait 30. That's not a marketing stat. That's where your pipeline leaks.

The fix is not "hire more SDRs". The fix is a 4-layer AI response system that captures, scores, and first-touches every lead in under 60 seconds. Follow Up Boss webhook fires, AI scores and tags inside 30 seconds, first SMS fires within 60 seconds, human agent gets a ready-to-close handoff.

Operators who wire this see 30 to 70 percent faster triage workflows and a 2 to 3x conversion lift on first-response leads, directional based on our engagement observations.

Full breakdown here: https://aiiaco.com/blog/speed-to-lead-ai-response-playbook/

#AIIntegration #RealEstate #SpeedToLead
```

### Rules

- Never use generic hashtags like #AI or #Innovation.
- Use the sanctioned outcome range where applicable, citing "directional based on our engagement observations".
- No em dashes. No banned vocabulary from STYLE.md.
- Open with a contrarian or specific claim, never with "Excited to share" or "I just wrote".
- Always include a link to the blog post.
- Only one link per LinkedIn post (LinkedIn algorithm deprioritizes multi-link posts).

## Format 3: Video (YouTube + LinkedIn native upload)

**Voice**: Nemr on camera or voiceover over screen demo.
**Length**: 90 seconds (target), 120 seconds max.
**Structure**: hook (0-10s), problem (10-25s), framework (25-70s), CTA (70-90s).

### Template

```
[HOOK, 0-10s]
"Most [ICP operators] lose deals in [specific timeframe]. Here is why."

[PROBLEM, 10-25s]
[1-2 specific pain points with real numbers. Show screenshot or whiteboard.]

[FRAMEWORK, 25-70s]
[Walk through the 3 to 5 steps of the solution. Use quick whiteboard, quick tool screenshot, quick voiceover.]
Step 1: [name]
Step 2: [name]
Step 3: [name]
[Step 4-5 if applicable]

[CTA, 70-90s]
"Full breakdown on aiiaco.com/blog/{slug}. If you run a [vertical] and want to map this to your stack, book a call. Link in description."
```

### Production notes

- Shoot on Nemr's phone or use a simple teleprompter setup.
- One take preferred. No over-editing.
- B-roll optional but keep it simple (whiteboard, CRM screenshot, terminal window).
- Gold + void color palette to match aiiaco.com design system.
- End frame: AiiACo logo + "aiiaco.com/blog/{slug}"
- YouTube title: "[Post primary keyword] - The 90 Second AiiACo Playbook"
- YouTube description: first 150 chars contain the primary keyword + post URL

## Format 4: Shorts / Reels (3 variants per post)

**Length**: 30 to 45 seconds each.
**Platforms**: YouTube Shorts, LinkedIn native, Instagram Reels, TikTok.
**Structure**: single punch per short. Never cover the whole framework.

### 3 variants per post

**Variant 1: The Hook Short**
- Opens with the contrarian claim from the LinkedIn post
- 20 seconds of "here is the problem"
- 10 seconds of "the solution is a framework, link in bio"
- Purpose: drives clicks to the full video or blog

**Variant 2: The Framework Short**
- Opens with "Here are the N steps to [outcome]"
- Quick screen of each step, 3-5 seconds each
- Closes with "full framework at aiiaco.com/blog"
- Purpose: saves / re-shares

**Variant 3: The Contrarian Take Short**
- Opens with "People tell you [common advice]. That is wrong."
- 20 seconds of why
- 10 seconds of "here is what to do instead, link in bio"
- Purpose: comments + engagement

### Shorts production rules

- Vertical 9:16 aspect ratio.
- Captions burned in (default for autoplay muted).
- First 1 second must hook visually (not a logo intro).
- No watermark in the first second.
- AiiACo brand colors burned into the end frame.

## Repurposing workflow (automated by `aiiaco-blog-write` skill)

When the skill finishes drafting a post and passing the quality gate, it calls `/blog repurpose` which produces:

1. LinkedIn draft (`repurposed/{slug}/linkedin.md`)
2. Video script (`repurposed/{slug}/video-script.md`)
3. 3 shorts scripts (`repurposed/{slug}/shorts.md`)
4. Twitter/X thread (`repurposed/{slug}/x-thread.md`) - optional, not in Nemr's priority list but useful
5. Reddit discussion post (`repurposed/{slug}/reddit.md`) - optional
6. Email newsletter excerpt (`repurposed/{slug}/email.md`) - optional

All outputs read from the same blog post source. All outputs inherit the same voice, sanctioned ranges, and entity anchors.

## Publishing cadence per format

| Format | Cadence | Source |
|--------|---------|--------|
| Blog post | 1 per week | Original writing from CONTENT.md queue |
| LinkedIn post | 1 per week (same week as blog) | Auto-generated from blog via repurpose skill |
| Video | 1 per week (same week as blog) | Manual shoot, script from repurpose |
| Shorts | 3 per week (staggered across Mon/Wed/Fri) | 3 variants auto-generated |

## Handoff pipeline

1. MonteKristo writes the blog post via `aiiaco-blog-write`
2. Repurpose skill fires automatically, produces LinkedIn + video script + 3 shorts
3. LinkedIn post is reviewed by Milan, sent to Nemr for approval, scheduled
4. Video script goes to Nemr for shoot (or to a voiceover artist if Nemr is unavailable)
5. Shorts scripts go to an editor for production
6. All assets go into `repurposed/{slug}/` folder with publish status tracked in SITEMAP.md

## Quality gate per format

Every format must pass:
- Zero em dashes
- Zero banned vocabulary from STYLE.md
- Brand spelling AiiACo (capital C)
- At least one sanctioned outcome range (where context applies)
- Primary keyword appears in the hook or the title
- Internal link to the blog post (for LinkedIn + video description)

## Out of scope

- Podcast episodes (future consideration, not in current pipeline)
- Newsletter deep-dives (future, not in current pipeline)
- Twitter threads (optional output, not mandatory)
