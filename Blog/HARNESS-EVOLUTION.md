# Blog Agent — Harness Evolution Log

Every pipeline component encodes an assumption about what the model can and cannot do.
Those assumptions go stale as models improve. This file tracks them so we can audit monthly
and remove scaffolding that the model no longer needs.

**Review cadence:** First session of each month.
**Audit question:** "Is this scaffolding still needed, or does the model handle this natively?"

---

## Assumption Audit Table

| Component | File | Assumption | Added | Last Verified | Stale? |
|-----------|------|-----------|-------|---------------|--------|
| Ralph Wiggum pre-check | CLAUDE.md STEP 3.1 | Model won't self-check keyword density, em dashes, or H2 keyword % before running reviewer | 2026-03 | 2026-03 | No |
| Sprint contract (STEP 1.2) | CLAUDE.md | Model generates H2 structure and CTA without pre-approval, leading to structural mismatch and rewrites | 2026-03 | 2026-03 | No |
| Parallel quality gates | CLAUDE.md Phase 3 | Gates run sequentially by default; model won't parallelize 3.2/3.3/3.4/3.5 without explicit instruction | 2026-03 | 2026-03 | No |
| Max 2 reviewer passes | CLAUDE.md STEP 3.1 | Model will run reviewer in a loop without a hard stop | 2026-03 | 2026-03 | No |
| Evaluator skepticism mandate | blog-analyze/SKILL.md Step 2 | Model defaults to validation mode (confirming quality) rather than adversarial scoring | 2026-03 | 2026-03 | No |
| Step 0 HTML/link hard gates | blog-analyze/SKILL.md Step 0 | Model won't parse JSON-LD or fetch external links before scoring; catches issues late (blog11 pass 4) | 2026-03 | 2026-03 | No |
| brief.json fast-path | CLAUDE.md STARTUP-C | 4 source MD files = ~78KB; loading all slows session startup and wastes context | 2026-03 | 2026-03 | No |
| SITEMAP.md slug check | CLAUDE.md Section 4 | Model will hallucinate plausible-looking internal URLs if not constrained to a verified slug list | 2026-03 | 2026-03 | No |
| Section 7B readability rules | CLAUDE.md | Model produces Flesch <60 prose without explicit targets; transition word coverage < 30% without instruction | 2026-03 | 2026-03 | No |
| SVG no max-width rule | SVG-REFERENCE.md | Reviewer fix passes added max-width constraints that capped SVGs in WordPress content column | 2026-03 | 2026-03 | No |
| Ralph Wiggum +3 (e/f/g) | CLAUDE.md STEP 3.1 | Model misses transition word coverage, image count, FAQ length before reviewer | 2026-03 | 2026-03 | No |
| Cross-session analyze limit | CLAUDE.md STEP 3.1 + blog-tasks.json | "Max 2 per session" rule doesn't prevent multi-session bloat; need global ceiling | 2026-03 | 2026-03 | No |
| Compressed reviewer output | blog-analyze/SKILL.md | Posts 82+ generate 1500-2500w reports; 70% unused when only blocking issues matter | 2026-03 | 2026-03 | No |
| brief.json 4-file check | CLAUDE.md STARTUP-C | CLIENT.md/STYLE.md/BRAND.md changes silently stale brief.json | 2026-03 | 2026-03 | No |

---

## Evolution Log

### 2026-03 — Phase 3 Implementation (Token Efficiency)

**Root cause:** blog12 took 5 reviewer passes due to: (a) no global analyze run ceiling,
(b) 3 mechanical issues not in Ralph Wiggum pre-check, (c) verbose reviewer output.

**Added scaffolding:**
- Ralph Wiggum pre-check items (e) transition words ≥30%, (f) image count ≥2, (g) FAQ ≥80w
- Cross-session analyze limit (total_analyze_runs field in blog-tasks.json, global ceiling 4)
- Compressed reviewer output for posts ≥82 (max 450 words)
- brief.json 4-file rebuild condition (was: FEEDBACK.md only)
- Fixed `<article>` vs `<div>` contradiction in CLAUDE.md Section 3/5

**Assumptions still holding:** All Phase 1 and Phase 2 assumptions. Sonnet 4.6 does not
self-correct structural or mechanical decisions without scaffolding in place.

---

### 2026-03 — Phase 1 + Phase 2 Implementation

**Removed scaffolding:** None yet — this is the baseline.

**Added scaffolding (Phase 1):**
- `brief.json` distillation — saves ~56KB/session vs loading 4 source MD files
- Parallel quality gates — Phase 3 CLAUDE.md rule after STEP 3.1
- Max 2 reviewer passes — STEP 3.1 hard limit
- Sections 8-10 moved to REFERENCE.md — ~30KB removed from base context
- Readability standards — Section 7B added
- SVG no max-width rule — SVG-REFERENCE.md updated, 5 SVGs fixed in posts

**Added scaffolding (Phase 2):**
- Ralph Wiggum pre-check — keyword density, em dash, H2 keyword % before reviewer
- Sprint contract (STEP 1.2) — pre-write alignment before 2,000+ words are written
- Evaluator skepticism mandate — Step 2 intro in blog-analyze/SKILL.md
- Step 0 HTML/link hard gates — JSON-LD parse, external link spot-check, hero image check
- Weight rebalancing — readability ↑, structured-data ↑, depth ↓, OG ↓ (AIOSEO handles natively)
- Transition word target synced — all files now say 30-50% (was 20-30% in quality-scoring.md)

**Assumptions still holding:** All of the above. Sonnet 4.6 does not self-correct structural or mechanical decisions without scaffolding in place.

---

## Monthly Audit Checklist

Run at the start of the first session each month:

- [ ] Did any post score 90+ on the FIRST `/blog analyze` pass without triggering any pre-check fixes? → Consider removing Ralph Wiggum gate.
- [ ] Did sprint contracts require zero changes before approval in the last 3 posts? → Consider auto-approving sprint contracts (or removing the step).
- [ ] Did `brief.json` miss any voice rule that caused a post to fail review? → Add the missing rule to the `brief.json` schema and rebuild.
- [ ] Did the evaluator skepticism mandate produce false Critical issues (valid content flagged as a fail)? → Soften the wording in Step 2.
- [ ] Did Step 0 hard gates fire on any post (JSON-LD error, broken link, missing hero)? → Note the frequency. If it never fires, consider whether it's still worth the WebFetch cost.
- [ ] Did any scaffolding assumption prove wrong? → Mark the row "Stale: Yes" in the Assumption Audit Table and propose removal.
- [ ] Any new model capability that makes a scaffolding item redundant? → Note it here before removing, so the removal is intentional and documented.
