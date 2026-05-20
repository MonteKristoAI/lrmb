# TRACK API — Attachment endpoint discovery results

**Date:** 2026-05-20 11:00 UTC
**Probed by:** MonteKristo (Alex) via direct curl against `https://lrmb.trackhs.com/api/pms/...` using key #51

## Finding

**TRACK does not expose work-order attachment endpoints via the PMS API.** The architecture we deployed in D2.3 (`track-attachment-push` → `POST /maintenance/work-orders/{id}/attachments`) returns 404 unconditionally — there is no such endpoint.

## Probe matrix

### Endpoint discovery — 404 across the board

| Method | URL | Status |
|---|---|---|
| POST | `/api/pms/housekeeping/work-orders/1/attachments` | 404 |
| POST | `/api/pms/housekeeping/work-orders/1/files` | 404 |
| POST | `/api/pms/housekeeping/work-orders/1/photos` | 404 |
| POST | `/api/pms/housekeeping/work-orders/1/media` | 404 |
| POST | `/api/pms/housekeeping/work-orders/1/documents` | 404 |
| POST | `/api/pms/maintenance/work-orders/1/attachments` | 404 |
| POST | `/api/pms/maintenance/work-orders/1/files` | 404 |
| POST | `/api/pms/maintenance/work-orders/1/photos` | 404 |
| POST | `/api/pms/maintenance/work-orders/1/media` | 404 |
| POST | `/api/pms/maintenance/work-orders/1/documents` | 404 |
| GET | `/api/pms/attachments` | 404 |
| GET | `/api/pms/files` | 404 |
| GET | `/api/pms/photos` | 404 |
| GET | `/api/files/...` | 404 |
| GET | `/api/storage/...` | 404 |
| GET | `/api/v2/pms/...` | 404 |

### What DOES work — confirmed write paths on key #51

| Method | URL | Status | Result |
|---|---|---|---|
| POST | `/api/pms/reservations/1/notes` | 422 | Scope OK (rejected on bad data) |
| POST | `/api/pms/maintenance/work-orders` | 422 | Scope OK (rejected on bad data — CAN CREATE WOs) |
| POST | `/api/pms/housekeeping/work-orders` | 422 | Scope OK (rejected on bad data — CAN CREATE WOs) |
| PATCH | `/api/pms/housekeeping/work-orders/{id}` | 200 | UPDATE works (verified no mutation of WO #1 — `updatedAt` unchanged from 2023-03-09) |
| PATCH | `/api/pms/maintenance/work-orders/{id}` | 200 | UPDATE works |

### Inspection of WO response payload

GET `/api/pms/housekeeping/work-orders/1` returns:
- 33 top-level fields (id, status, scheduledAt, comments, unitId, vendorId, assignees, etc.)
- `_links`: `self`, `tasks` (sub-tasks like "make beds")
- `_embedded`: `cleanType`, `unit`, `user`, `reservation`, `nextReservation`
- **NO `attachments` link, NO `_embedded.attachments`, NO file/photo field**

### Negative probe — PATCH with `attachments` field

```http
PATCH /api/pms/housekeeping/work-orders/1
{ "attachments": [{ "url": "https://example.com/probe.jpg", "name": "probe" }] }
```
→ Returns 200, **but `attachments` is silently dropped** (not in response, not persisted).

## Root cause hypothesis

Three possibilities:
1. **TRACK PMS API doesn't support attachments at all** — file attachments are admin-portal-only (TRACK UI), not API-exposed.
2. **A different API tier** (TRACK Plus / Enterprise) exposes attachments — not available to LRMB's current plan.
3. **A different mechanism we haven't found** — perhaps an older REST endpoint, GraphQL, or webhook-based file ingestion.

Emma's original mention of TRACK auto-creating Final Clean / Inspection work orders with attached completion photos may refer to a TRACK-UI-only mechanism, not an API path.

## Impact on D2.3 (photo push to TRACK)

The architecture deployed in `track-attachment-push` cannot push photos to TRACK via the PMS API. Every push attempt would 404.

### Mitigation deployed (track-attachment-push v4, this session)

1. **Detect 404/405 as permanent failure** — don't retry 5× on a definitively-missing endpoint
2. **Dead-letter immediately** on permanent failure (set `track_sync_attempts = MAX_ATTEMPTS`, `track_next_attempt_at = NULL`)
3. **Tag error with `PERMANENT:` prefix** so it's distinguishable from transient errors
4. Photo push currently sees 0 queue depth (only 1 historical photo, on a non-TRACK task, correctly skipped). No functional impact today.

### Working alternative: comments-field embed

The only writable evidence-attachment path we have is **PATCH the work-order `comments` field** with a text reference to the photo.

Two options to surface AiiA photos in TRACK without an attachments endpoint:

**Option A — direct signed URL in comments**
```http
PATCH /api/pms/housekeeping/work-orders/{id}
{ "comments": "AiiA proof of completion (2026-05-20 13:00 UTC):\nhttps://supabase-signed-url-1.jpg\nhttps://supabase-signed-url-2.jpg" }
```
Pros: Photos viewable directly from TRACK comments
Cons: Signed URLs expire (need long TTL or re-sign cron), comments balloon with each upload

**Option B — single AiiA URL pointing to a public proof page**
```http
PATCH /api/pms/housekeeping/work-orders/{id}
{ "comments": "AiiA proof of completion: https://lrmb.vercel.app/proof/{taskId}?t=<HMAC>" }
```
Pros: One URL per WO regardless of photo count, no signed URL expiry, all photos visible
Cons: Requires building a `/proof/{taskId}` page (similar to `/operations` but per-task)

**Recommendation:** Option B if Tony wants TRACK-side photo proof. Option A as quick demo.

Both require Emma's confirmation that we should write to the WO `comments` field (it's a customer-visible audit trail in TRACK).

## Open question for Emma

Add to the existing Q3 email follow-up:

> **Q7: Photo attachments.** Our test probe shows there's no public API endpoint
> for posting photo attachments to work orders (`POST /work-orders/{id}/attachments`
> returns 404, as do `/files`, `/photos`, `/media`, `/documents`). Three possibilities:
>
> (a) Is there a different attachment API path we should be using? If yes, can
>     you share the docs?
> (b) Is attachment upload an admin-portal-only feature (no API), or a paid TRACK
>     tier we'd need to add?
> (c) If neither (a) nor (b), are you OK with us embedding photo URLs in the
>     work-order `comments` field as the workaround?

## Status

- ✅ Write scope on key #51: **CONFIRMED** for create/update on reservations + work orders (3 WRITE_OK paths)
- ✅ No accidental mutations during probe (verified `updatedAt` unchanged on WO #1)
- ❌ Attachment push (D2.3) architecture: **BLOCKED** until Emma clarifies, or until we pivot to comments-field embed
- ✅ Push fn hardened (v4): 404 = dead-letter immediately, no retry waste
- ✅ Photo queue empty in production right now (no functional impact while we await Emma)
