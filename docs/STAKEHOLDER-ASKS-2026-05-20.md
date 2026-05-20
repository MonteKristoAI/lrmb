# LRMB — Complete Stakeholder Ask List (2026-05-20)

Everything that's blocked on someone outside MonteKristo. Grouped by person, ordered by what unblocks the most downstream work.

---

## 🟦 Emma Roach (TravelNet / TRACK Solutions partner contact)

**Channel:** Gmail thread, last reply from her was the URL + key #51 confirmation
**Best subject line:** Reply to her last message in the existing thread
**Body ready to send:** `documents/MILAN-CLICK-BY-CLICK-2026-05-20.md` → Korak 2

### Must-have (unblocks Week 3 go-live)

| # | Ask | Why it blocks | What changes when she replies |
|---|---|---|---|
| 1 | **Confirm key #51 has WRITE access on Reservations + Work Orders** (check `/system/api-keys/update/51/` for the user who created it and their role) | Photo push to TRACK is enabled but unverified. Write-back probe is sitting in dry-run mode (`scripts/test-track-writeback.mjs`). | We run the live write probe. If passes → bidirectional sync confirmed. If fails → we ask for a key tied to a higher-role user. |
| 2 | **Open a TRACK Support ticket** asking: "Can outbound webhooks for reservation lifecycle events (checkout, status change) be enabled for the LRMB tenant?" | Webhook subscription endpoints returned 404 in our probe — not self-serve. | If TRACK Support says yes → swap polling for real-time webhook (latency 5min → <1s). If no → keep polling, document decision in `WEBHOOK-VS-POLLING-MEMO`. |
| 3 | **Send 1-2 sample TRACK Final Clean / Inspection work orders** (export or screenshot) from any recent checked-out reservation | Need to see field structure to decide passive-mirror vs active-orchestrator | Tony's Q3 decision (in `TONY-BRIEFING-2026-05-20.md`) gets the data it needs |
| 4 | **API rate limits / quotas for LRMB tenant** — calls per minute, daily caps, anything documented | We currently poll 3 collections × every 5 min = ~36 calls/hour. Want to stay well under ceiling | Lets us tune cron cadence safely; allows higher-frequency polling if quota is generous |
| 5 | **IP allowlisting** — does LRMB tenant require calling IP to be allowlisted? | Supabase edge function egress IPs are not pinned. If allowlist required, we need her to add our range. | We send egress IP range, she allowlists, we deploy webhook subscriptions / write-back without surprise 403s |
| 6 | **Sandbox tenant URL** (if exists, e.g. `lrmb-test.trackhs.com`) | Currently all probes hit prod | Lets us test write-back without risk to live LRMB data |

### Still pending from earlier asks (no-rush, just flagging)

| # | Ask | First sent |
|---|---|---|
| 7 | **Akia API/webhook info** when their support replies | 2026-05-05 thread |
| 8 | **Field-staff roster** (cleaners, maintenance techs, inspectors) once 5 admins finish self-test loop | 2026-05-05 thread |
| 9 | **LRMB logo** (forward request to Tony / Rabih) | 2026-05-05 thread |

---

## 🟦 Tony Andrew (LRMB pilot owner / decision-maker)

**Channel:** No direct thread logged. Most likely path: Emma forwards or Milan reaches out directly via whatever channel was used for kick-off
**Briefing doc ready:** `documents/TONY-BRIEFING-2026-05-20.md` — covers what he's seeing + the 3 questions
**Share link to send him:** `https://lrmb.vercel.app/operations?t=eyJpYXQiOjE3NzkyMzQwODcsImV4cCI6MTc4MTgyNjA4NywidiI6MSwidmlld2VyIjoiVG9ueSJ9.qgeaGgsAglINUyb0t8r-BLGh2uWInoNTwW_m5wqCxzU`

### 3 decisions needed

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | **Add 4 active TRACK units to AiiA?** (TRACK IDs 7, 41, 252, 268 — including combined listings like "Ritz Carlton 310/311") | (a) Add as-is (one AiiA unit per TRACK id), (b) Split combined listings (310 + 311 separately), (c) Skip — these are not pilot scope | None — Tony has to say what these units represent operationally |
| 2 | **Silent filter for 30 inactive TRACK units** | (a) Filter silently (clean dashboard, lose visibility), (b) Surface as warnings (more noise) | (a) silent filter, can re-enable per-unit if needed |
| 3 | **Final Clean / Inspection workflow ownership** | (a) Passive — AiiA mirrors TRACK's auto-created WOs, (b) Active — AiiA generates + manages, TRACK reflects | (a) passive for pilot, decide on (b) after Phase 1 surfaces gaps |

### Process asks

| # | Ask | Why |
|---|---|---|
| 4 | **15-min walkthrough call** when he's clicked through the dashboard | Surface any UX gaps before Phase 2 scoping |
| 5 | **Field-staff roster** (his side may have it faster than Emma — Carlos was the field-test account at lrmb.lovable.app) | Lets us onboard 2-3 real cleaners to mobile PWA |
| 6 | **LRMB logo** (currently dashboard is text-header only) | Tony/Rabih likely owns the brand asset |

---

## 🟦 Nemr (AiiA core engineering / Manus)

**Channel:** Direct (Nemr is co-founder / engineering lead for AiiA platform)
**Owner of:** AiiA platform schema, RLS policies, core triggers, security warnings

### Pre-existing security advisor warnings (NOT introduced by MK)

| # | Warning | His call |
|---|---|---|
| 1 | `http` extension in public schema | Move to extensions schema OR confirm intentional |
| 2 | `form_submissions.anon_insert` RLS `WITH CHECK (true)` allows unrestricted anonymous INSERT | Tighten to authenticated-only OR confirm public form is intentional |
| 3 | 4× SECURITY DEFINER fn (`has_admin_access`, `has_role`, `find_similar_tasks`, `avg_admin_touches_per_task`) callable by authenticated | Add internal RLS check OR confirm safe-by-design |
| 4 | HIBP leaked-password protection disabled (HTTP 402 — needs Pro plan) | Decide if Supabase Pro upgrade is in budget |
| 5 | Postgres 17.4.1.064 has security patches available | Schedule upgrade window |

### Pre-existing performance lints (78 total)

| # | Category | Count | His call |
|---|---|---|---|
| 6 | `auth_rls_initplan` (auth.uid() not in SELECT sub) | 39 | Bulk-fix or accept (perf cost depends on table size) |
| 7 | `unused_index` | 24 | Confirm each is genuinely unused before dropping (some may be production-protective) |
| 8 | `multiple_permissive_policies` | 15 | Consolidate where redundant |

### Architecture question (raised but not yet resolved)

| # | Question | Status |
|---|---|---|
| 9 | TRACK polling vs AiiA's existing `handle_travelnet_checkout()` SQL function + `trg_reservation_event_to_housekeeping` trigger | Polling avoids 'checkout' event_type to dodge the trigger — but two parallel pipelines could drift. Long-term, Nemr should decide which one is authoritative. |

---

## 🟦 Akia (third-party PMS — pending support reply)

**Channel:** Their support inbox — last contact: see `documents/REPLY-DRAFT-2026-05-05.md`
**Status:** Not in pilot scope. Their reply unblocks future scope, not current.

### Open

| # | Ask | Priority |
|---|---|---|
| 1 | API endpoint + webhook documentation | Low — only matters if LRMB ever adds Akia-managed properties |

---

## 🟦 LRMB internal — Rabih / Tony / brand owner

| # | Ask | Why |
|---|---|---|
| 1 | **Final brand: official LRMB logo file** (vector preferred) | Header on `/operations` page is text-only right now |
| 2 | **Final brand colors** — confirm `#0680A2` teal + `#C4BAB1` taupe are correct (these were Emma's choices 2026-05-05) | Used across mobile PWA + Tony's dashboard |

---

## Summary table — who unblocks what

| Stakeholder | Asks | Unblocks |
|---|---|---|
| Emma | 6 must-have + 3 pending | Write-back probe, webhook switch, sandbox tests, ratelimit tuning, field-staff onboarding |
| Tony | 3 decisions + 3 process | Active-unit creation, dashboard hygiene, Final Clean architecture, walkthrough → Phase 2 scoping |
| Nemr | 8 security/perf items + 1 architecture | Compliance posture, AiiA-side hygiene |
| Akia support | 1 doc | Future scope only |
| LRMB internal | 2 brand assets | Header polish on shared dashboard |

---

## Recommended send order

1. **Now:** Emma email (paste-ready in Korak 2) — unblocks the most downstream work
2. **After Emma's Q3 confirmation:** Tony briefing + share link — he can review during async + answer the 3 decisions
3. **When you're with Nemr next:** walk through the 8 advisor items + 1 architecture question — these aren't urgent, but better not to let them rot
4. **Whenever:** Akia + brand assets — no-rush items

---

**Bottom line:** the only Day-1 critical send is Emma. Everything else is staged + ready when you have time.
