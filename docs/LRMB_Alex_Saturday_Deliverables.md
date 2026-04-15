# LRMB — Alex's Saturday Deliverables

> **Prepared:** March 2026  
> **For:** Internal use — Alex's client meeting  
> **Reminder:** We are NOT selling AI tools. We sell operational speed and payroll efficiency.

---

## Table of Contents

1. [Workflow Architecture Diagram](#1-workflow-architecture-diagram)
2. [Recommended Tool Stack](#2-recommended-tool-stack)
3. [Implementation Timeline](#3-implementation-timeline)
4. [Internal Cost Estimate](#4-internal-cost-estimate)
5. [Client Pricing Recommendation](#5-client-pricing-recommendation)
6. [Pilot Rollout Plan](#6-pilot-rollout-plan)

---

## 1. Workflow Architecture Diagram

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        LRMB PLATFORM                            │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  MAINTENANCE   │  │ HOUSEKEEPING  │  │  INSPECTIONS  │       │
│  │    Module      │  │    Module     │  │    Module     │       │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘       │
│          │                  │                  │                │
│          └──────────────────┼──────────────────┘                │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │   TASK ENGINE   │                          │
│                    │  (State Machine)│                          │
│                    └────────┬────────┘                          │
│                             │                                   │
│          ┌──────────────────┼──────────────────┐               │
│          │                  │                  │                │
│  ┌───────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐       │
│  │  MOBILE APP   │  │  DASHBOARDS  │  │ NOTIFICATIONS │       │
│  │ (Field Staff) │  │(Admin/Super) │  │  (Auto-push)  │       │
│  └───────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Task Lifecycle (All Modules)

```
  NEW ──► ASSIGNED ──► IN PROGRESS ──► COMPLETED ──► VERIFIED
   │          │             │               │
   │          │             ▼               │
   │          │        WAITING PARTS        │
   │          │             │               │
   │          │             ▼               │
   │          └────►   BLOCKED   ◄──────────┘
   │                       │
   └───────────────────────┘  (can reopen → NEW)
```

### Housekeeping Checkout-Driven Flow

```
  PMS Checkout Event
        │
        ▼
  Auto-create Housekeeping Task
        │
        ▼
  Assign to Housekeeper (by property)
        │
        ▼
  Staff opens mobile → sees task
        │
        ▼
  Start → Clean → Upload Photo → Complete
        │
        ▼
  Supervisor verifies (photo + checklist)
        │
        ▼
  Unit marked ready for next guest
```

### Inspection Flow

```
  Schedule Inspection (Admin)
        │
        ▼
  Inspector gets mobile checklist
        │
        ▼
  Go room-by-room, item-by-item
        │
        ▼
  Flag issues → auto-create maintenance tasks
        │
        ▼
  Complete inspection → Supervisor reviews
```

### Role Access Map

| Feature                    | Field Staff | Supervisor | Admin | Manager |
|----------------------------|:-----------:|:----------:|:-----:|:-------:|
| View own tasks             | ✅          | ✅         | ✅    | ✅      |
| Start / complete tasks     | ✅          | ✅         | ✅    | —       |
| Upload photos & notes      | ✅          | ✅         | ✅    | —       |
| Verify completed tasks     | —           | ✅         | ✅    | —       |
| Create & assign tasks      | —           | —          | ✅    | ✅      |
| View all dashboards & KPIs | —           | ✅         | ✅    | ✅      |
| Manage staff & properties  | —           | —          | ✅    | ✅      |

---

## 2. Recommended Tool Stack

### What We Built (Custom Web App)

| Layer          | Technology          | Why                                              |
|----------------|---------------------|--------------------------------------------------|
| Frontend       | React + TypeScript  | Mobile-first PWA, works on any phone browser     |
| UI Framework   | Tailwind + shadcn   | Fast iteration, professional look                |
| Backend/DB     | Supabase (Postgres) | Real-time subscriptions, auth, storage, edge functions |
| Hosting        | Lovable Cloud       | Zero-config deployment, instant updates          |
| Automation     | pg_cron + Edge Fns  | Auto-escalation every 15 min, no external tools  |
| Auth           | Supabase Auth       | Email/password, role-based access control        |
| File Storage   | Supabase Storage    | Photo uploads with RLS security                  |

### Why Custom vs. Airtable/Jotform/n8n

| Criteria                   | Custom App (What We Built)      | Airtable + Jotform + n8n         |
|----------------------------|---------------------------------|----------------------------------|
| **Monthly cost at scale**  | ~$25/mo (flat)                  | $50-200+/mo (per seat + records) |
| **Mobile experience**      | Native-feel PWA                 | Clunky form links                |
| **Real-time updates**      | Instant (WebSocket)             | Polling / manual refresh         |
| **Photo proof workflow**   | Built-in, enforced              | Manual upload, no enforcement    |
| **Auto-escalation**        | Built-in (pg_cron)              | Requires n8n workflows           |
| **Offline capability**     | Planned (service worker)        | Limited                          |
| **Custom KPI dashboards**  | Built-in                        | Requires Airtable extensions     |
| **Branding / white-label** | Full control                    | Airtable/Jotform branding        |
| **Vendor lock-in**         | Open source stack               | Locked to 3 vendors              |
| **Setup complexity**       | One deployment                  | 3 tools to configure & connect   |

### Key Advantage for Client Conversations

> "This isn't a bunch of tools duct-taped together. It's a single system purpose-built for property operations. Your staff opens one link on their phone — that's it."

---

## 3. Implementation Timeline

### Pre-Pilot (Already Completed ✅)

| Task                                          | Status |
|-----------------------------------------------|--------|
| Database schema (tasks, properties, units, staff, inspections) | ✅ Done |
| Role-based access control (4 roles)           | ✅ Done |
| Task state machine (7 states)                 | ✅ Done |
| Mobile-first task interface                   | ✅ Done |
| Photo upload & "Definition of Done" enforcement | ✅ Done |
| Admin dashboard (create, assign, monitor)     | ✅ Done |
| Supervisor dashboard (verify, workload view)  | ✅ Done |
| KPI dashboard (cycle time, admin touches)     | ✅ Done |
| Auto-escalation (overdue → urgent, 15-min cron) | ✅ Done |
| Notification system (in-app)                  | ✅ Done |
| Housekeeping queue                            | ✅ Done |
| Inspection checklist module                   | ✅ Done |
| Demo data seed function                       | ✅ Done |

### Pilot Phase (4 Weeks)

| Week | Focus                        | Key Activities                                                    |
|------|------------------------------|-------------------------------------------------------------------|
| **0** | **Setup** (1-2 days)        | Create user accounts, configure properties/units, seed initial tasks, brief training session |
| **1** | **Baseline & Onboarding**   | Run both old process AND new system in parallel. Measure current cycle times, admin touches, completion rates manually. Staff gets comfortable with app. |
| **2** | **Active Pilot**            | Switch primary workflow to LRMB. Admin creates all tasks in system. Staff uses mobile for updates. Supervisor verifies via app. Daily check-ins. |
| **3** | **Full Operation**          | All task management through LRMB. Housekeeping auto-triggered. Inspections run through checklist module. KPI dashboard reviewed daily by admin. |
| **4** | **Review & Decision**       | Compare Week 1 baseline to Week 3-4 metrics. Present ROI analysis. Decide on expansion or adjustments. |

### Post-Pilot Enhancements (If Client Proceeds)

- PMS integration (Guesty/Hostaway webhook for auto-checkout tasks)
- Push notifications (SMS/email via Twilio or Resend)
- Offline mode (service worker for poor-connectivity areas)
- Multi-language support (Spanish for field staff)
- Guest-facing QR code for issue reporting

---

## 4. Internal Cost Estimate

> ⚠️ **INTERNAL ONLY — Do not share with client**

### Ongoing Monthly Costs

| Item                     | Cost/Month  | Notes                              |
|--------------------------|-------------|-------------------------------------|
| Supabase Pro plan        | $25         | 8GB DB, 250GB bandwidth, 100GB storage |
| Lovable hosting          | $0-20       | Included in plan or minimal         |
| Domain (optional)        | ~$1         | Custom domain if desired            |
| **Total infrastructure** | **~$25-45/mo** |                                  |

### Ongoing Maintenance Estimate

| Item                         | Hours/Month | Notes                            |
|------------------------------|-------------|----------------------------------|
| Bug fixes & minor updates    | 2-4 hrs     | Reactive                         |
| Feature additions            | 4-8 hrs     | Client requests, improvements    |
| Monitoring & support         | 1-2 hrs     | DB health, user issues           |
| **Total maintenance**        | **7-14 hrs/mo** |                              |

---

## 6. Pilot Rollout Plan

### Pilot Scope

| Parameter          | Target                                    |
|--------------------|-------------------------------------------|
| Properties         | 10-20 (start with best-performing ones)   |
| Field staff        | 3-5 people                                |
| Supervisors        | 1 person                                  |
| Admins             | 1 person (primary task creator)           |
| Duration           | 4 weeks                                   |
| Primary module     | Maintenance tasks + Housekeeping          |
| Secondary module   | Inspections (introduce Week 2-3)          |

### Day-by-Day Setup (Week 0)

| Day       | Activity                                                      | Owner |
|-----------|---------------------------------------------------------------|-------|
| **Day 1** | Create Supabase accounts for all pilot users                  | Alex  |
| **Day 1** | Configure properties and units in the system                  | Alex  |
| **Day 1** | Assign staff to properties via staff_assignments              | Alex  |
| **Day 2** | 30-min training: Admin — how to create, assign, monitor tasks | Alex  |
| **Day 2** | 15-min training: Supervisor — how to verify, view workload    | Alex  |
| **Day 2** | 15-min training: Field staff — how to accept, update, complete tasks (mobile) | Alex |
| **Day 3** | Create 5-10 real tasks as a dry run                           | Admin |
| **Day 3** | Staff completes dry-run tasks on their phones                 | Staff |
| **Day 3** | Fix any issues, answer questions                              | Alex  |

### Weekly Check-in Structure

| Week | Check-in Focus                                              |
|------|-------------------------------------------------------------|
| **1** | "Is everyone comfortable? Any friction points?" — focus on adoption, not metrics |
| **2** | "How does the workload feel? Are tasks getting done faster?" — review first KPI numbers |
| **3** | "Let's look at the dashboard together." — show cycle time trends, admin touch count |
| **4** | "Here are your results." — present before/after comparison, discuss next steps |

### KPI Targets (What We're Measuring)

| KPI                          | Baseline (Week 1) | Target (Week 4)  | How We Measure                       |
|------------------------------|--------------------|--------------------|---------------------------------------|
| Avg task cycle time          | Measure manually   | ↓ 30-50%          | `completed_at - created_at` in system |
| Admin touches per task       | Measure manually   | ↓ 40-60%          | `avg_admin_touches_per_task` RPC      |
| Photo proof compliance       | 0% (no system)     | 90%+              | Tasks with photos / total completed   |
| Task repeat/reopen rate      | Measure manually   | ↓ 20-40%          | `reopened_count > 0` percentage       |
| Staff adoption rate          | —                  | 100%              | Active users / total assigned staff   |

### Baseline Measurement Template (Week 1)

Have the admin track these **manually** for one week before full system use:

```
Date: ___________
Property: ___________

1. How many tasks were assigned today?          ___
2. How many calls/texts did you send about tasks? ___
3. How many tasks were completed today?          ___
4. Any tasks that had to be redone?              ___
5. Time spent coordinating (hours):              ___
6. Any tasks with photo proof?                   ___
```

This manual baseline will be compared against automated KPI data from Weeks 2-4.



## Quick Reference: What to Bring Saturday

- [ ] This document (printed or on tablet)
- [ ] Live demo ready on phone (log in as each role to show workflow)
- [ ] 3 demo accounts ready: admin, supervisor, field staff
- [ ] Sample properties & tasks pre-loaded (use seed function)
- [ ] One-page ROI summary (Section 5 numbers)
- [ ] Pilot timeline visual (Section 3 table)

### Demo Script (5 minutes)

1. **Admin view** (1 min): "Here's where you create a task and assign it. One click."
2. **Staff phone** (2 min): "Staff sees it on their phone. They tap Start, do the work, take a photo, tap Complete. Done."
3. **Supervisor view** (1 min): "Supervisor sees the completed task with photo proof. One tap to verify."
4. **Dashboard** (1 min): "And here's your real-time dashboard — how many tasks are open, average completion time, staff workload. No spreadsheets."

### Key Phrases for the Meeting

- "This replaces your group texts, spreadsheets, and phone calls with one system."
- "Your staff just opens a link on their phone. No app to download."
- "Every completed task has photo proof. No more he-said-she-said."
- "We'll run it free for 4 weeks. If the numbers don't work, you lose nothing."
- "We're not selling you software. We're selling you back 10+ hours a week."
