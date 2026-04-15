# SDS / Warrior — Blog Post Request Queue

**Source:** Derived from `CONTENT.md`. The 8 launch posts are the initial queue; post-launch posts are added here as they move from backlog into the main pipeline.

**Status values:**
- `Not Yet` — in queue, not started
- `Writing` — in progress (see `blog-progress.json` wip)
- `Review` — awaiting quality gate
- `Done` — published and Airtable-synced

---

## Active Queue

| Row | Airtable ID | Title | Primary Keyword | Template | Priority | Status | Completed At |
|---|---|---|---|---|---|---|---|
| 1 | sds-001 | The Vendor-Agnostic Wireline Platform: Why One Panel for Every Tool Isn't a Marketing Claim | vendor agnostic wireline | T4 thought-leadership | 1 | Not Yet | — |
| 2 | sds-002 | The Warrior Universal Panel: How One Surface Unit Replaces a Wireline Truck Full of Legacy Panels | warrior universal panel | T1 technical-deep-dive | 2 | Not Yet | — |
| 3 | sds-003 | Addressable Switches, Auto-Perf Mode, and the End of the Rig-Floor Lottery | addressable switch | T2 comparison | 3 | Not Yet | — |
| 4 | sds-004 | Fervo, FORGE, and the Wireline Pivot to EGS: What Your Fleet Needs to Run Geothermal Wells | geothermal wireline | T4 thought-leadership | 4 | Not Yet | — |
| 5 | sds-005 | What API RP 67 4th Edition Means for Every Wireline Crew Running Perforating Operations | API RP 67 | T3 regulatory-primer | 5 | Not Yet | — |
| 6 | sds-006 | Why Weatherford Distributes a Competitor's Wireline Panel: The Vendor-Agnostic Wireline Story | weatherford wireline | T4 thought-leadership | 6 | Not Yet | — |
| 7 | sds-007 | Wireline Leasing vs Buying: The $2,500/Month Math That Changes the Switching Decision | wireline leasing | T5 business-case | 7 | Not Yet | — |
| 8 | sds-008 | What a Wireline Engineer Actually Does (and How to Become One) | wireline engineer | T1 technical-deep-dive | 8 | Not Yet | — |

---

## Airtable Integration

**Note:** Airtable sync for SDS is NOT YET configured. The `sds-001` through `sds-008` identifiers are placeholder IDs used by `blog-tasks.json` until GetStuffDone provides Airtable base access (or confirms they prefer to run without Airtable).

**When Airtable is added:**
1. Create base for SDS OR use existing MK base with new table
2. Update `blog-tasks.json` → `clients.sds.airtable_base` and `airtable_requests_table`
3. Replace placeholder IDs with real Airtable record IDs
4. Add `mcp__airtable__update_records` calls to pipeline Step 5.3

Until then, this file and `blog-tasks.json` are the source of truth.

---

## Approval Flow

Every post must clear:
1. MK internal quality gates (Blog CLAUDE.md Section 3 Phase 3)
2. **Maxine review** — before publishing; Maxine may make edits or route to Christopher
3. **Christopher review** — for any post making new factual claims about Warrior, SDS, or citing regulatory content. Not required for every post; Maxine judges.
4. MK final publish to the site

**Approval expectation:** Maxine turnaround ~24h. Christopher turnaround ~48-72h for content review.

---

## Post-Launch Additions

When a backlog post promotes into the active queue, add a new row here with the next sequential ID (`sds-009`, `sds-010`, ...). Do not reuse IDs.

---

## Queue Review Cadence

- **Weekly** — check if any post is stuck (>5 days in Writing status) and surface in the Monday dashboard
- **Monthly** — reconcile against `CONTENT.md` backlog and promote the next 4 posts into the active queue
