# AutoLoop Program: Skill Self-Improvement

## Objective

Improve the pass rate of a Claude Code skill against its eval suite
by iterating on the SKILL.md instructions. PROPOSE-ONLY -- all skill
modifications require human approval.

## Evaluation

Run the skill against its eval suite (binary pass/fail test cases).
Calculate pass rate across all criteria.

**Primary metric:** Eval suite pass rate (0-100%), higher is better.

## Guard Rails

| Metric | Threshold | If Violated |
|--------|-----------|-------------|
| No category regression | No eval category drops below baseline | DISCARD |
| Execution time | Must not increase > 50% vs baseline | FLAG |
| No new failure modes | No previously passing evals start failing | DISCARD |

## Action Space

1. **Add explicit rules** for tool selection based on failure patterns
2. **Add few-shot examples** demonstrating correct parameterization
3. **Restructure instructions** for clarity based on error analysis
4. **Add edge case handling** for identified failure patterns
5. **Remove ambiguous instructions** that cause inconsistent behavior
6. **Add decision criteria** for common branching points

## Constraints

- **ALL SKILL.md changes → HUMAN REVIEW** before deployment
- **Keep full version history** of every SKILL.md variant
- **Minimum 20 eval cases** before running self-improvement loop
- **Maximum 5 iterations per run** (prevent overfitting to eval suite)
- **Generate 3-5 candidate variants** per iteration, test ALL against full suite
- **Keep the highest-scoring variant** only if it beats current baseline
- **Never remove core functionality** -- only add or refine

## The Loop

```
1. Run skill against eval suite → record pass rate per category
2. Analyze failure patterns:
   - Which criteria fail most frequently?
   - Are failures clustered in specific eval categories?
   - What's the common thread across failures?
3. Generate 3-5 candidate SKILL.md variants:
   - Each addresses the top failure pattern differently
   - Small, targeted changes (not full rewrites)
4. Test each candidate against FULL eval suite
5. Select highest-scoring candidate
6. If it beats baseline → log as improvement, propose to Milan
7. If no candidate beats baseline → log stagnation, try different approach
```

## Candidate Skills for Self-Improvement

| Skill | Eval Focus | Impact |
|-------|-----------|--------|
| blog-write | Quality scores of generated posts | High -- affects all blog clients |
| blog-analyze | Scoring consistency across known posts | High -- is the evaluator for blog-quality |
| seo-page | Accuracy of recommendations | Medium |
| retell-agent-builder | Voice prompt quality scores | Medium |
| frontend-design | frontend-critic scores of generated pages | Medium |
| montekristo-website | Quality gate scores of generated sites | Medium |

## Eval Suite Format

```json
{
  "skill": "blog-write",
  "version": "1.0",
  "created": "2026-04-14",
  "test_cases": [
    {
      "id": "bw_001",
      "description": "Write 1500-word post about box breathing",
      "input": {
        "topic": "box breathing for anxiety",
        "client": "breathmastery",
        "word_count_target": 1500
      },
      "criteria": [
        {"name": "word_count", "check": "word_count >= 1400 AND word_count <= 1800", "weight": 1},
        {"name": "burstiness", "check": "burstiness_score > 6", "weight": 2},
        {"name": "no_ai_tells", "check": "banned_word_count == 0", "weight": 3},
        {"name": "sourced_stats", "check": "unsourced_stat_count == 0", "weight": 2},
        {"name": "summary_box", "check": "has_key_takeaways == true", "weight": 1},
        {"name": "cta_present", "check": "cta_count >= 1", "weight": 1},
        {"name": "heading_hierarchy", "check": "heading_skip_count == 0", "weight": 1},
        {"name": "internal_links", "check": "internal_link_count >= 3", "weight": 1}
      ]
    }
  ]
}
```

## Proven Techniques

(Will be populated after experiments.)
