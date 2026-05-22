# TRACK API — Attachment Architecture (RESOLVED)

**Last update:** 2026-05-22 — Resolution shipped as v5
**Discovered by:** MonteKristo (Alex) via dev portal v12.0 schema + live probe with key #51

---

## Resolution (v5)

**Photos attach to TRACK at the reservation level**, not the work-order level. The correct flow is a single API call:

```
POST https://lrmb.trackhs.com/api/pms/reservations/{reservationId}/attachments
Authorization: Basic <key#51 credentials>
Content-Type: application/json

{
  "fileUrl": "<Supabase signed URL with 7-day TTL>",
  "name": "AiiA proof — housekeeping WO #32227 — <fileName>",
  "isPublic": false
}
```

TRACK server-side fetches the `fileUrl`, downloads bytes into their own S3 bucket (`track-pm.s3.amazonaws.com/lrmb/image/...`), and links the resulting file to the reservation. Field staff + supervisors viewing any work order on that reservation see the photo proof at the reservation header level in the TRACK UI.

Response on success (201):
```json
{
  "id": 9513,
  "type": "attachment",
  "name": "AiiA proof — housekeeping WO #32227 — ...",
  "fileType": "image",
  "mimeType": "image/jpeg",
  "size": 3434700,
  "fileUrl": "https://track-pm.s3.amazonaws.com/lrmb/image/...",
  "createdAt": "2026-05-22T04:51:02-04:00",
  "createdBy": "system",
  "_links": { "self": { "href": ".../attachments/9513/" } }
}
```

### E2E verification (2026-05-22 08:51 UTC)

| Step | Result |
|---|---|
| Inject task_photo row pointing to TRACK-backed HK task 59701b2c, reservation 322890 | ✅ Inserted id `f12abc2a` |
| Cron fires (60s cadence) | ✅ Picked up row |
| Push v5: signed URL → POST `/api/pms/reservations/322890/attachments` | ✅ TRACK returned 201 + attachment id 9513 |
| `task_photos.track_attachment_id = "9513"`, `track_synced_at` set, errors=0 | ✅ |
| GET `/api/pms/reservations/322890/attachments/9513` on TRACK | ✅ 200 — attachment visible |
| DELETE attachment 9513 + delete task_photos row | ✅ Cleanup complete |

---

## Original discovery (kept for reference)

Initial probe (2026-05-20) showed `POST /work-orders/{id}/attachments` returns 404 across all variants (`/attachments`, `/files`, `/photos`, `/media`, `/documents`). We initially suspected an attachment endpoint was missing entirely.

Kent Schoen (LRMB internal) replied with critical context on 2026-05-22:
- TRACK API keys are NOT delegated — permissions selected at key creation
- 2 key types exist: Channel API + Server API
- `developer.trackhs.com` is the official dev portal (Auth0-gated)
- TRACK security model is "dangerous by design"

Dev portal v12.0 schema then revealed:
- `POST /api/files` — universal file upload (returns file id)
- `POST /api/pms/reservations/{id}/attachments` — reservation-level attachment (accepts `fileUrl` directly, does 1-step upload + link)
- `POST /api/pms/housekeeping/work-orders/{id}/tasks/{taskId}/comments` — text-only sub-task comments
- **NO work-order-level attachment endpoint** in either HK or maintenance namespace

The reservation-level path is the correct TRACK pattern — work orders are children of reservations, so attaching at the parent gives field staff visibility from any WO on that reservation.

### Live probe matrix (which paths work with key #51)

| Method | URL | Result | Note |
|---|---|---|---|
| GET | `/api/files` | 200 | Listing existing files works |
| POST | `/api/files` | 201 | Upload via `{fileUrl, name, type}` payload — but doesn't link to anything |
| DELETE | `/api/files/{id}` | 204 | Cleanup works |
| GET | `/api/pms/reservations/{id}/attachments` | 200 | Listing per-reservation attachments |
| POST | `/api/pms/reservations/{id}/attachments` | 201 | ⭐ **1-step upload + link** with `{fileUrl, name, isPublic}` |
| DELETE | `/api/pms/reservations/{id}/attachments/{attId}` | 204 | Cleanup works |
| POST | `/api/crm/companies/{id}/attachments` | 422 (scope OK) | Company-level — not what we need |
| POST | `/api/pms/housekeeping/work-orders/{id}/tasks/{taskId}/comments` | 422 "Comment is required" (scope OK) | Text-only proof channel |
| POST | `/api/pms/housekeeping/work-orders/{id}/attachments` | 404 | Endpoint does not exist |
| POST | `/api/pms/maintenance/work-orders/{id}/attachments` | 404 | Endpoint does not exist |

### Why the original push fn 404'd

We deployed `track-attachment-push` v1-v4 targeting `/api/pms/housekeeping/work-orders/{id}/attachments` — an endpoint that doesn't exist in TRACK's API. The queue was always empty (only AiiA-native test photos), so no real production impact. Architecture rebuilt as v5 + verified end-to-end.

---

## Code reference

- Edge function: `supabase/functions/track-attachment-push/index.ts` (v5, deployed 2026-05-22)
- Cron: `pg_cron` job `track-attachment-push-every-1min`
- Safety gate: `TRACK_ATTACHMENT_PUSH_ENABLED=true` (flipped 2026-05-20 08:43 UTC)
- Backoff: 1m → 5m → 30m → 4h → 24h, then dead-letter
- Permanent failures (404/405): dead-letter immediately, no retry

---

## Open items

- ✅ ~~Attachment endpoint discovery~~ — RESOLVED
- ✅ ~~Write scope confirmation on key #51~~ — confirmed working
- ✅ ~~Push fn end-to-end~~ — verified live with cleanup

No outstanding blockers on the photo push pipeline. Once real field staff complete TRACK-backed tasks with photos via the AiiA mobile app, the existing cron will pick them up within 60s and push to TRACK reservation attachments automatically.
