# LRMB — Client Profile

**Company:** Luxury Rentals Miami Beach (LRMB)
**Industry:** Luxury vacation rental management
**Location:** Miami Beach, FL
**Contact:** Emma (ops lead — "Map current workflow with Emma")
**Status:** Active — pilot phase

---

## What We Do for Them

| Service | Stack |
|---------|-------|
| Field Ops Web App (AiiA) | React + Supabase + Lovable (lrmb.lovable.app) |
| Task management system | Supabase PostgreSQL + Storage (photo proof) |
| GitHub repo | MonteKristoAI/lrmb (auto-deploys via Lovable) |

**Positioning:** We are NOT selling AI tools. We are selling **operational speed and payroll efficiency**. The system exists to enforce behavior.

---

## The Problem

LRMB manages luxury vacation rentals with ~15 field staff and ~4 admins. Their operations were:
- Manual and Excel-heavy for all task coordination
- 8–12 touchpoints per maintenance task
- No mobile field updates — staff returned to office to log work
- Zero real-time visibility for managers
- Slow task closure, inconsistent documentation

**The result:** High admin workload, slow turnaround, duplicate data entry, no operational visibility.

---

## What We Built: Field Ops Warp-Speed Module (AiiA)

A mobile-first task coordination system that sits **on top of** LRMB's existing TravelNet PMS — not replacing it.

**Live app:** https://lrmb.lovable.app/login
**GitHub:** https://github.com/MonteKristoAI/lrmb
**Local path:** `/Users/milanmandic/Desktop/MonteKristo AI/LRMB App/`

### Three Modules

| Module | Complexity | Status | KPI Impact |
|--------|------------|--------|-----------|
| Maintenance / Work Order Management | Medium | ✓ Built | Cycle time ↓30-50%, admin touches ↓40-60% |
| Housekeeping Coordination | Low | ✓ Built | Turnover speed ↑20-30%, coordination time ↓50% |
| Inspection Reporting | Low-Medium | ✓ Built | Damage detection ↑early, complaints ↓ |

### KPI Targets

| Metric | Baseline | Target |
|--------|----------|--------|
| Work order cycle time | TBD | ↓ 30–50% |
| Admin touches per task | 8–12 | ↓ to 2–3 (↓40–60%) |
| Field-to-office re-entry | High | Near zero |
| Tasks closed with photo proof | Low | 90%+ |
| Repeat task rate | TBD | ↓ 20–40% |

---

## App Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase + TanStack Query v5 + React Hook Form + Zod + Recharts
**Hosting:** Lovable (auto-deploys on GitHub push)
**Auth:** Supabase Auth (email/password)

### Routes & Pages

| Route | Page | Role |
|-------|------|------|
| `/login` | Login | All |
| `/tasks` | MyTasks | Field staff |
| `/tasks/completed` | CompletedTasks | Field staff |
| `/tasks/:id` | TaskDetail (photo upload, status updates) | Field staff |
| `/admin` | AdminDashboard | Admin |
| `/admin/tasks/create` | CreateTask | Admin |
| `/admin/tasks/open` | OpenTasksQueue | Admin |
| `/admin/tasks/overdue` | OverdueQueue | Admin |
| `/admin/tasks/blocked` | BlockedQueue | Admin |
| `/admin/tasks/property/:id` | PropertyTasks | Admin |
| `/admin/tasks/staff/:id` | StaffTasks | Admin |
| `/admin/housekeeping` | HousekeepingQueue | Admin |
| `/admin/inspections` | InspectionQueue | Admin |
| `/inspections/:id` | InspectionChecklist (mobile) | Inspector |
| `/supervisor` | SupervisorDashboard | Supervisor/Manager |
| `/supervisor/verify` | VerificationQueue | Supervisor |
| `/supervisor/kpi` | KPIOverview | Supervisor/Manager |
| `/supervisor/staff` | StaffWorkload | Supervisor/Manager |
| `/supervisor/trends` | TrendCharts | Supervisor/Manager |

### User Roles

| Role | Access Level |
|------|-------------|
| `field_staff` | Own tasks only (`/tasks`, `/tasks/:id`, `/inspections/:id`) |
| `admin` | Full `/admin/*` + task creation |
| `supervisor` | Full `/supervisor/*` + verification queue |
| `manager` | Same as supervisor |

Admin access is controlled by `has_admin_access()` SQL function — grants access to any of: admin, supervisor, manager.

### Task Status Flow

```
new → assigned → in_progress → waiting_parts → blocked → completed → verified
```

Task closure requirements: photo uploaded (when required) + note entered + timestamp recorded.

---

## Database Schema (Supabase — 15 tables)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles, linked to auth.users |
| `user_roles` | Role assignments (field_staff/admin/supervisor/manager) |
| `properties` | Properties with external_source/external_id for TravelNet sync |
| `units` | Units within properties |
| `staff_assignments` | Staff ↔ property assignments |
| `tasks` | Central task table (maintenance/housekeeping/inspection/general) |
| `task_updates` | Immutable audit trail of all task changes |
| `task_photos` | Photo proof storage (Supabase bucket: `task-photos`, private) |
| `inspection_templates` | Reusable inspection checklists |
| `inspection_template_items` | Checklist items by section |
| `inspections` | Inspection records |
| `inspection_responses` | Inspector answers + flagged issues → auto-creates maintenance tickets |
| `notification_events` | In-app notifications (task assigned/overdue/blocked/completed) |
| `audit_logs` | System-level audit trail |
| `reservation_events` | TravelNet integration stub (webhook receiver for auto-housekeeping tasks) |

All tables have Row Level Security (RLS) enabled.

---

## Real Staff (from Emma Benson, Apr 15, 2026)

| # | Name | Email | Phone | Role | Notes |
|---|------|-------|-------|------|-------|
| 1 | Tony Rajeh | trajeh@lrmb.com | 786-493-2611 | Admin | Owner/investor |
| 2 | Jennifer Jingco | jjingco@lrmb.com | 907-227-5430 | Admin | |
| 3 | Emma Benson | ebenson@lrmb.com | 208-602-4170 | Admin | Ops lead, primary contact |
| 4 | Alan Dourado | adourado@lrmb.com | 786-389-0553 | Admin | |
| 5 | Kent Calero | kent@myryc.com | 305-484-3788 | Admin | External partner (myryc.com) |

**MISSING:** Field staff, cleaners, maintenance workers, inspectors. Need to request from Emma.

## Test Accounts (Pilot)

| # | Email | Password | Name | Role |
|---|-------|----------|------|------|
| 1 | admin@lrmb.test | Test1234! | Mike Admin | Admin |
| 2 | supervisor@lrmb.test | Test1234! | Sarah Supervisor | Supervisor |
| 3 | staff1@lrmb.test | Test1234! | Carlos Field | Field Staff |
| 4 | staff2@lrmb.test | Test1234! | Diana Cleaner | Field Staff |
| 5 | staff3@lrmb.test | Test1234! | Eddie Maintenance | Field Staff |
| 6 | manager@lrmb.test | Test1234! | Frank Manager | Manager |

---

## LRMB Existing Tech Stack (Integrate With, Don't Replace)

| System | Purpose | Integration Status |
|--------|---------|-------------------|
| **TravelNet Solutions (TRACK)** | PMS/CRM — reservations, work orders, channel mgmt, accounting, owner statements | Stub ready. Emma confirms TRACK has open API. She can create channel + provide key/secret. Waiting on her. |
| **Akia** | Guest messaging + contract sending | Emma contacted Akia support re: webhook support. Waiting on response. |
| **Safely** | Damage claim submissions | NO API access. Use platform directly. Emma has SOP to share. |
| **Rental Guardian** | Damage claim submissions | NO API access. Use platform directly. Same SOP as Safely. |
| **PriceLabs** | Dynamic pricing | Not relevant to ops layer |
| **KeyData** | Market analytics | Not relevant to ops layer |
| **Excel** | Still used heavily — being replaced by this system | Being displaced |

### TravelNet Integration Roadmap
The `reservation_events` table is pre-built as a webhook stub. When a reservation ends in TravelNet:
1. TravelNet fires a webhook → lands in `reservation_events`
2. n8n/Supabase function auto-creates a housekeeping task in `tasks`
3. Task assigned to available cleaner, mobile notification sent
4. Cleaner marks complete with photo proof → admin sees real-time

---

## Pilot Scope

- **Properties:** 10–20
- **Field staff:** 3–5
- **Admin:** 1
- **Supervisor:** 1
- **Duration:** 4 weeks (Maintenance pilot) / 2–3 weeks (general)
- **Region:** Miami Beach (to be confirmed)

### Pilot Measurement Week
Baseline metrics to be collected before full deployment:
- Current work order cycle time (open → close)
- Current admin touches per task
- Current task visibility score

---

## Open Questions / Pending

- [ ] Map current workflow with Emma (admin contact)
- [ ] Confirm who owns final task closure
- [ ] Define exact "completed" definition per task type
- [ ] Confirm escalation trigger rules
- [ ] TravelNet webhook setup (for auto-housekeeping task creation)
- [ ] Pilot team confirmed names + phone numbers

---

## Changelog

| Date | Work Done |
|------|-----------|
| 2026-03-07 | Initial build: full schema (15 tables), all 3 modules built in Lovable |
| 2026-04-01 | Repo cloned to local workspace, CLIENT.md created, added to MonteKristo AI client roster |
