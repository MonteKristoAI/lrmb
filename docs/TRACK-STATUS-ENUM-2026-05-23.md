# TRACK PMS work-order status enum (live-probed 2026-05-23)

Live probe of `https://lrmb.trackhs.com/api/pms/{maintenance,housekeeping}/work-orders`
returned the following status values across a 1,000-row sample:

| TRACK raw status   | Count | AiiA task_status      | Meaning                                       |
|--------------------|-------|-----------------------|-----------------------------------------------|
| `pending`          | 440   | `new`                 | Scheduled but unstarted                       |
| `cancelled`        | 305   | `completed` (terminal)| Cancelled before / during work                |
| `vendor-not-start` | 126   | `vendor_not_started`  | Vendor assigned but hasn't started            |
| `open`             | 93    | `new`                 | Created, unscheduled                          |
| `in-progress`      | 12    | `in_progress`         | Worker started, not yet done                  |
| `vendor-assigned`  | 8     | `assigned`            | Vendor assigned, hasn't begun                 |
| `completed`        | 7     | `completed`           | Work done by staff                            |
| `processed`        | 7     | `processed`           | Closed out by admin                           |
| `exception`        | 1     | `blocked`             | Blocking issue raised                         |

`verified` exists in AiiA's enum but TRACK does not appear to use it.

## What broke

The pre-2026-05-23 mapper missed `cancelled`, `in-progress` (hyphen variant),
`vendor-not-start`, and `exception`. All four fell through to the `new`
fallback, mis-classifying ~12K terminal or in-flight work orders as Open
on the Admin Dashboard.

## Fix

Patched `mapTrackStatus()` in `track-poll`, `track-catchup-units`, and
`track-webhook` (the latter named `mapStatus()`) to lower-case + strip
hyphens/underscores before matching, and to recognise the new keywords.

After deploy, a one-shot Python rebackfill (`/tmp/lrmb-track-resync.py`)
probed every existing `new`-status TRACK-mirrored task against the live
API and corrected the stored status. See PR description for counts.
