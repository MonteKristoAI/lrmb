# LRMB Field Ops Warp-Speed Module

## Pre-Pilot Technical Documentation

**Version:** 1.0
**Date:** March 7, 2026
**Classification:** Internal / Client-Ready
**Status:** Pre-Pilot Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Database Schema Reference](#4-database-schema-reference)
5. [Operational Modules](#5-operational-modules)
6. [Task Lifecycle](#6-task-lifecycle)
7. [Notification System](#7-notification-system)
8. [Screen-by-Screen Reference](#8-screen-by-screen-reference)
9. [KPI Framework](#9-kpi-framework)
10. [API & Data Hooks Reference](#10-api--data-hooks-reference)
11. [Edge Functions](#11-edge-functions)
12. [Design System](#12-design-system)
13. [Pilot Deployment Guide](#13-pilot-deployment-guide)
14. [Integration Roadmap](#14-integration-roadmap)
15. [Known Limitations & Future Work](#15-known-limitations--future-work)

---

## 1. Executive Summary

### 1.1 What This System Is

The **Field Ops Warp-Speed Module** is a mobile-first task workflow application purpose-built for Luxury Rentals Miami Beach (LRMB). It creates a standardized digital layer for task intake, assignment, progress tracking, proof-of-completion, and supervisor verification across three operational domains: maintenance work orders, housekeeping coordination, and inspection reporting.

The system sits **on top of** the existing TravelNet Solutions PMS. It does not replace TravelNet but addresses the operational gap that TravelNet does not cover: real-time field coordination, mobile-first task management, and KPI-driven accountability.

### 1.2 The Problem It Solves

LRMB manages luxury vacation rental properties with approximately 15 field staff and 4 administrative coordinators. The current operational workflow suffers from:

- **Manual task coordination** via Excel spreadsheets and WhatsApp messages
- **No mobile field interface** --- staff return to office to log updates
- **Multiple admins chasing status updates** on the same tasks
- **Inconsistent task closure** --- no enforced proof-of-completion
- **Zero operational visibility** --- no real-time dashboards or KPI tracking
- **High admin workload** --- estimated 40-60% of admin time spent on status chasing

These problems result in slow turnaround times, duplicate data entry, high payroll costs relative to output, and reactive (rather than preventive) maintenance.

### 1.3 Positioning

This system is **not an AI tool**. It is an **operational speed and payroll efficiency system**. The system exists to enforce behavior: structured task intake, mandatory photo proof, real-time status updates from the field, and supervisor verification gates. The technology is invisible to the end user; the result is measurable operational improvement.

### 1.4 Pilot Scope

| Parameter | Target |
|-----------|--------|
| Properties | 10--20 |
| Field staff | 3--5 |
| Admins | 1 |
| Supervisors | 1 |
| Duration | 2--3 weeks |
| Baseline measurement | Week 1 (manual process) |
| System measurement | Weeks 2--3 (digital process) |

### 1.5 Success Criteria (from Client Overview)

| KPI | Target |
|-----|--------|
| Work order cycle time (open to closed) | 30--50% reduction |
| Admin touches per task | 40--60% reduction |
| Field-to-office re-entry | Near zero |
| Tasks closed with photo proof | 90%+ |
| Repeat task rate | 20--40% reduction |

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
+---------------------------------------------------------------+
|                      CLIENT DEVICE                             |
|  Mobile browser (iOS Safari / Android Chrome)                  |
|  Viewport: 375-430px primary target                            |
+-------------------------------+-------------------------------+
                                |
                                | HTTPS
                                |
+-------------------------------v-------------------------------+
|                     REACT FRONTEND                             |
|  Vite 5.x + React 18.3 + TypeScript + Tailwind CSS            |
|  shadcn/ui component library (40+ components)                  |
|                                                                |
|  +------------------+  +-------------------+  +-----------+   |
|  |   Auth Context   |  |  React Query v5   |  |  Router   |   |
|  |  (src/lib/auth)  |  |  (query cache)    |  |  (v6.30)  |   |
|  +--------+---------+  +--------+----------+  +-----+-----+   |
|           |                      |                   |         |
|  +--------+----------------------+-------------------+------+  |
|  |              CUSTOM HOOKS LAYER                          |  |
|  |  useTasks  useProperties  useInspections                 |  |
|  |  useNotifications                                        |  |
|  +------------------------------+---------------------------+  |
|                                 |                              |
|                                 | @supabase/supabase-js v2.98  |
+-------------------------------+-+-----------------------------+
                                |
                                | REST + Realtime (WebSocket)
                                |
+-------------------------------v-------------------------------+
|                    SUPABASE BACKEND                             |
|                                                                |
|  +------------------+  +-------------------+  +-----------+   |
|  |   Auth Service   |  |   PostgreSQL 15   |  |  Storage  |   |
|  |  email/password  |  |   14 tables       |  |  (S3)     |   |
|  |  JWT tokens      |  |   5 enums         |  |           |   |
|  |  user metadata   |  |   3 triggers      |  |  Bucket:  |   |
|  +------------------+  |   2 functions      |  |  task-    |   |
|                         |   RLS on all      |  |  photos   |   |
|  +------------------+  +-------------------+  +-----------+   |
|  |  Edge Functions  |                                         |
|  |  (Deno runtime)  |                                         |
|  |                  |                                         |
|  | seed-demo-data   |                                         |
|  | escalate-overdue |                                         |
|  +------------------+                                         |
+---------------------------------------------------------------+
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Build tool | Vite | 5.x | Fast HMR, ESM-native bundling |
| UI framework | React | 18.3.1 | Component rendering |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Animations | tailwindcss-animate | 1.0.7 | CSS animation utilities |
| Component library | shadcn/ui | Latest | 40+ accessible components |
| State management | TanStack React Query | 5.83.0 | Server state, caching, polling |
| Routing | React Router DOM | 6.30.1 | Client-side routing |
| Charts | Recharts | 2.15.4 | KPI visualization |
| Forms | React Hook Form | 7.61.1 | Form state management |
| Validation | Zod | 3.25.76 | Schema validation |
| Date utilities | date-fns | 3.6.0 | Date formatting, comparison |
| Icons | Lucide React | 0.462.0 | Icon set |
| Toasts | Sonner | 1.7.4 | Toast notifications |
| Backend | Supabase | 2.98.0 | Auth, DB, storage, edge functions |

### 2.3 Data Flow

A typical user interaction follows this path:

```
User taps "Complete" button
        |
        v
TaskDetail component calls transition("completed")
        |
        v
useUpdateTask().mutateAsync({ id, status: "completed", completed_at: now })
        |
        v
supabase.from("tasks").update(updates).eq("id", id)
        |
        v
PostgreSQL receives UPDATE request
        |
        v
RLS policy check: (assigned_to = auth.uid()) OR has_admin_access(auth.uid())
        |
        +---> DENIED: 403 error returned
        |
        +---> ALLOWED:
              |
              v
              Row updated in tasks table
              |
              v
              Trigger: update_updated_at() sets updated_at = now()
              |
              v
              Trigger: notify_on_task_change() fires
              |     -> Inserts notification_event for created_by
              |     -> Event type: "task_completed"
              |     -> Title: "Task Completed"
              |     -> Body: "{title} has been completed"
              |
              v
              Response returned to client
              |
              v
              React Query invalidates ["tasks"], ["task", id], ["all_tasks"]
              |
              v
              UI re-renders with updated task status
```

### 2.4 Authentication Flow

```
App mounts
    |
    v
AuthProvider initializes
    |
    +--> supabase.auth.getSession() -- check existing session
    |
    +--> supabase.auth.onAuthStateChange() -- subscribe to changes
    |
    v
Session found?
    |
    +---> NO: setLoading(false), render <Login />
    |
    +---> YES:
          |
          v
          fetchProfileAndRoles(userId) -- parallel requests:
          |
          +--> supabase.from("profiles").select("*").eq("id", userId).single()
          |
          +--> supabase.from("user_roles").select("role").eq("user_id", userId)
          |
          v
          Set profile state, roles array, loading = false
          |
          v
          AuthContext provides: session, user, profile, roles,
                                hasRole(), hasAdminAccess(), signOut()
          |
          v
          ProtectedRoute checks session + role requirements
          |
          +--> No session: redirect to /login
          +--> Missing role: redirect to /tasks
          +--> OK: render child component
```

---

## 3. User Roles & Permissions

### 3.1 Role Definitions

The system implements four roles stored in the `user_roles` table, separate from the `profiles` table, to prevent privilege escalation attacks.

| Role | Intended User | Scope |
|------|--------------|-------|
| `field_staff` | Technicians, cleaners, inspectors | Own assigned tasks and assigned properties only |
| `admin` | Office coordinators | Full access to all data and operations |
| `supervisor` | Operations supervisor | Full read access, verification authority, KPI dashboards |
| `manager` | Executive/owner | Same as supervisor (executive-level visibility) |

### 3.2 Security Functions

Two PostgreSQL functions provide role-checking capabilities. Both are `SECURITY DEFINER`, meaning they execute with the privileges of the function owner (bypassing RLS) to avoid recursive policy evaluation.

#### `has_role(_user_id uuid, _role app_role) -> boolean`

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

Used in: `user_roles` RLS policies (admin management).

#### `has_admin_access(_user_id uuid) -> boolean`

```sql
CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'supervisor', 'manager')
  )
$$;
```

Used in: Most RLS policies for admin/supervisor/manager access.

### 3.3 Per-Table RLS Policy Matrix

All tables have Row-Level Security enabled. Policies use `RESTRICTIVE` mode (all applicable policies must pass).

#### `tasks`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin full task access | ALL | `has_admin_access(auth.uid())` |
| Staff see assigned tasks | SELECT | `assigned_to = auth.uid()` |
| Staff update assigned tasks | UPDATE | `assigned_to = auth.uid()` (USING and WITH CHECK) |

Staff cannot INSERT or DELETE tasks. Only admin/supervisor/manager can create tasks.

#### `task_updates`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Users see updates on visible tasks | SELECT | EXISTS subquery: task must be assigned to user OR user has admin access |
| Users insert updates on assigned tasks | INSERT | `actor_id = auth.uid()` AND EXISTS subquery on task visibility |

Staff cannot UPDATE or DELETE task_updates (append-only audit trail).

#### `task_photos`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Users see photos on visible tasks | SELECT | EXISTS subquery: task assigned to user OR admin access |
| Users upload photos on assigned tasks | INSERT | `uploaded_by = auth.uid()` AND task visibility check |

Staff cannot UPDATE or DELETE photos (immutable evidence).

#### `properties`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin access all properties | ALL | `has_admin_access(auth.uid())` |
| Staff see assigned properties | SELECT | EXISTS subquery on `staff_assignments` where `profile_id = auth.uid()` AND `active = true` |

#### `units`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin access all units | ALL | `has_admin_access(auth.uid())` |
| Staff see units of assigned properties | SELECT | EXISTS subquery on `staff_assignments` matching property and user |

#### `profiles`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin access all profiles | SELECT | `has_admin_access(auth.uid())` |
| Users read own profile | SELECT | `id = auth.uid()` |
| Users update own profile | UPDATE | `id = auth.uid()` |

No INSERT or DELETE allowed via client. Profile creation is handled by the `handle_new_user()` trigger.

#### `user_roles`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin manage roles | ALL | `has_role(auth.uid(), 'admin')` |
| Admin read all roles | SELECT | `has_admin_access(auth.uid())` |
| Users read own roles | SELECT | `user_id = auth.uid()` |

Only `admin` role (not supervisor/manager) can insert/update/delete roles.

#### `notification_events`

| Policy Name | Command | Logic |
|------------|---------|-------|
| System insert notifications | INSERT | `has_admin_access(auth.uid())` |
| Users see own notifications | SELECT | `recipient_id = auth.uid()` |
| Users update own notifications | UPDATE | `recipient_id = auth.uid()` |

Note: The INSERT policy requires admin access. In practice, notifications are created by PostgreSQL triggers (which run as the table owner, bypassing RLS) or by edge functions (which use the service role key). Field staff cannot create notifications directly.

#### `inspections`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin full inspection access | ALL | `has_admin_access(auth.uid())` |
| Inspector sees own inspections | SELECT | `inspector_id = auth.uid()` |
| Inspector updates own inspections | UPDATE | `inspector_id = auth.uid()` |

#### `inspection_responses`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Users manage responses on own inspections | ALL | EXISTS subquery: inspection must belong to user as inspector OR user has admin access |

#### `inspection_templates` and `inspection_template_items`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin manage templates/items | ALL | `has_admin_access(auth.uid())` |
| All read templates/items | SELECT | `true` (public read for authenticated users) |

#### `staff_assignments`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin manage assignments | ALL | `has_admin_access(auth.uid())` |
| Users read own assignments | SELECT | `profile_id = auth.uid()` |

#### `audit_logs`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin read audit logs | SELECT | `has_admin_access(auth.uid())` |
| System insert audit logs | INSERT | `true` (open insert for triggers) |

No UPDATE or DELETE allowed.

#### `reservation_events`

| Policy Name | Command | Logic |
|------------|---------|-------|
| Admin access reservation events | ALL | `has_admin_access(auth.uid())` |

### 3.4 Route Access Matrix

| Route | Component | Required Auth | Required Role |
|-------|-----------|--------------|---------------|
| `/login` | Login | None | None |
| `/` | Redirect to `/tasks` | Authenticated | Any |
| `/tasks` | MyTasks | Authenticated | Any |
| `/tasks/completed` | CompletedTasks | Authenticated | Any |
| `/tasks/:id` | TaskDetail | Authenticated | Any |
| `/admin` | AdminDashboard | Authenticated | Admin access |
| `/admin/tasks/create` | CreateTask | Authenticated | Admin access |
| `/admin/tasks/open` | OpenTasksQueue | Authenticated | Admin access |
| `/admin/tasks/overdue` | OverdueQueue | Authenticated | Admin access |
| `/admin/tasks/blocked` | BlockedQueue | Authenticated | Admin access |
| `/admin/tasks/property/:id` | PropertyTasks | Authenticated | Admin access |
| `/admin/tasks/staff/:id` | StaffTasks | Authenticated | Admin access |
| `/admin/housekeeping` | HousekeepingQueue | Authenticated | Admin access |
| `/admin/inspections` | InspectionQueue | Authenticated | Admin access |
| `/inspections/:id` | InspectionChecklist | Authenticated | Any |
| `/supervisor` | SupervisorDashboard | Authenticated | Admin access |
| `/supervisor/verify` | VerificationQueue | Authenticated | Admin access |
| `/supervisor/kpi` | KPIOverview | Authenticated | Admin access |
| `/supervisor/staff` | StaffWorkload | Authenticated | Admin access |
| `/supervisor/trends` | TrendCharts | Authenticated | Admin access |

"Admin access" means any of: `admin`, `supervisor`, or `manager` role.

### 3.5 Bottom Navigation Visibility

| Tab | Visible To |
|-----|-----------|
| Tasks | All authenticated users |
| Admin | Users with `hasAdminAccess()` (admin, supervisor, manager) |
| Supervisor | Users with `supervisor` or `manager` role specifically |
| Completed | All authenticated users |

---

## 4. Database Schema Reference

### 4.1 Entity Relationship Diagram

```
                        +------------------+
                        |   auth.users     |
                        |  (Supabase Auth) |
                        +--------+---------+
                                 |
                   +-------------+-------------+
                   |                           |
          +--------v---------+        +--------v---------+
          |    profiles      |        |   user_roles     |
          |------------------|        |------------------|
          | id (PK, FK)      |        | id (PK)          |
          | full_name        |        | user_id (FK)     |
          | email            |        | role (enum)      |
          | phone            |        +------------------+
          | avatar_url       |
          | active           |
          +--------+---------+
                   |
      +------------+------------+
      |                         |
+-----v----------+    +--------v-----------+
| staff_          |    |                    |
| assignments     |    |  (assigned_to,     |
|-----------------|    |   created_by,      |
| id (PK)         |    |   inspector_id,    |
| profile_id (FK) |    |   uploaded_by,     |
| property_id(FK) |    |   actor_id,        |
| assignment_type |    |   recipient_id)    |
| active          |    |                    |
+-----------------+    +--------------------+

+------------------+     +------------------+     +------------------+
|   properties     |---->|     units        |     | reservation_     |
|------------------|     |------------------|     | events           |
| id (PK)          |     | id (PK)          |     |------------------|
| name             |     | property_id (FK) |     | id (PK)          |
| address          |     | unit_code        |     | property_id (FK) |
| region           |     | active           |     | unit_id (FK)     |
| active           |     | external_source  |     | event_type       |
| external_source  |     | external_id      |     | event_at         |
| external_id      |     +------------------+     | external_source  |
+--------+---------+                               | payload_json     |
         |                                          +------------------+
         |
+--------v-----------------------------------------+
|                    tasks                          |
|--------------------------------------------------|
| id (PK)                                          |
| property_id (FK -> properties)                   |
| unit_id (FK -> units, nullable)                  |
| title                                            |
| description                                      |
| task_category (enum: maintenance|housekeeping|   |
|                inspection|general)                |
| task_type (free text, nullable)                  |
| priority (enum: low|medium|high|urgent)          |
| status (enum: new|assigned|in_progress|          |
|         waiting_parts|blocked|completed|verified)|
| assigned_to (FK -> profiles, nullable)           |
| created_by (FK -> profiles, nullable)            |
| assigned_vendor_name (nullable)                  |
| blocked_reason (nullable)                        |
| requires_photo (boolean, default false)          |
| requires_note (boolean, default false)           |
| requires_timestamp (boolean, default true)       |
| due_at (timestamptz, nullable)                   |
| started_at (timestamptz, nullable)               |
| completed_at (timestamptz, nullable)             |
| verified_at (timestamptz, nullable)              |
| reopened_count (integer, default 0)              |
| source_type (text, default 'manual')             |
| external_source (nullable)                       |
| external_id (nullable)                           |
| created_at (timestamptz, default now())          |
| updated_at (timestamptz, auto-updated)           |
+-----+------------------+------------------------+
      |                  |
      |                  |
+-----v--------+  +------v---------+  +-------------------+
| task_updates  |  |  task_photos   |  | notification_     |
|---------------|  |----------------|  | events            |
| id (PK)       |  | id (PK)        |  |-------------------|
| task_id (FK)  |  | task_id (FK)   |  | id (PK)           |
| actor_id      |  | uploaded_by    |  | recipient_id      |
| update_type   |  | storage_path   |  | task_id (FK,null) |
| old_status    |  | photo_type     |  | event_type        |
| new_status    |  | created_at     |  | title             |
| note          |  +----------------+  | body              |
| metadata_json |                      | channel           |
| created_at    |                      | read (boolean)    |
+---------------+                      | delivery_status   |
                                       | sent_at           |
                                       | created_at        |
                                       +-------------------+

+------------------+     +------------------------+     +--------------------+
| inspection_      |---->| inspection_template_   |     | inspection_        |
| templates        |     | items                  |     | responses          |
|------------------|     |------------------------|     |--------------------|
| id (PK)          |     | id (PK)                |     | id (PK)            |
| name             |     | template_id (FK)       |     | inspection_id (FK) |
| version          |     | section_name           |     | template_item_id   |
| active           |     | label                  |     | (FK)               |
+------------------+     | item_type              |     | response_value     |
                          | sort_order             |     | note               |
+------------------+     | required (boolean)     |     | flagged_issue      |
| inspections      |     +------------------------+     | (boolean)          |
|------------------|                                     +--------------------+
| id (PK)          |
| property_id (FK) |
| unit_id (FK,null)|
| inspector_id     |
| template_id (FK) |
| status (enum)    |
| completed_at     |
+------------------+

+------------------+
|   audit_logs     |
|------------------|
| id (PK)          |
| entity_type      |
| entity_id        |
| action           |
| actor_id         |
| payload_json     |
| created_at       |
+------------------+
```

### 4.2 Enums

#### `app_role`

| Value | Description |
|-------|-------------|
| `field_staff` | Technicians, cleaners, inspectors with limited access |
| `admin` | Office coordinators with full system access |
| `supervisor` | Operations supervisors with verification authority |
| `manager` | Executive-level visibility (same permissions as supervisor) |

#### `task_status`

| Value | Description | Active? |
|-------|-------------|---------|
| `new` | Created but not assigned | Yes |
| `assigned` | Assigned to staff, not started | Yes |
| `in_progress` | Staff actively working | Yes |
| `waiting_parts` | Paused, waiting for materials | Yes |
| `blocked` | Cannot proceed, requires intervention | Yes |
| `completed` | Staff marked done, awaiting verification | Terminal |
| `verified` | Supervisor confirmed completion | Terminal |

#### `task_priority`

| Value | Sort Order | Description |
|-------|-----------|-------------|
| `urgent` | 0 | Immediate attention required |
| `high` | 1 | Same-day resolution expected |
| `medium` | 2 | Standard priority (default) |
| `low` | 3 | Can be deferred |

#### `task_category`

| Value | Description |
|-------|-------------|
| `maintenance` | Repairs, appliance issues, vendor coordination |
| `housekeeping` | Cleaning, turnover, linen, restocking |
| `inspection` | Property inspections, safety checks |
| `general` | Miscellaneous operational tasks |

#### `inspection_status`

| Value | Description |
|-------|-------------|
| `scheduled` | Inspection planned, not started |
| `in_progress` | Inspector actively filling checklist |
| `completed` | All required items answered |
| `verified` | Supervisor reviewed results |

### 4.3 Detailed Table Schemas

#### `profiles`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | None | Primary key, foreign key to `auth.users(id)` |
| `full_name` | text | No | `''` | Display name |
| `email` | text | Yes | None | Email address |
| `phone` | text | Yes | None | Phone number |
| `avatar_url` | text | Yes | None | Profile image URL |
| `active` | boolean | No | `true` | Soft-delete flag |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | Auto-updated by trigger |

**No INSERT or DELETE** via client API. Created by `handle_new_user()` trigger.

#### `user_roles`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | No | None | Foreign key to `auth.users(id)`, CASCADE on delete |
| `role` | app_role | No | None | One of the four role values |
| `created_at` | timestamptz | No | `now()` | |

**Unique constraint** on `(user_id, role)` prevents duplicate role assignments.

#### `properties`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `name` | text | No | None | Property display name |
| `address` | text | Yes | None | Street address |
| `region` | text | Yes | None | Geographic region grouping |
| `active` | boolean | No | `true` | Soft-delete flag |
| `external_source` | text | Yes | None | Integration source (e.g., "travelnet") |
| `external_id` | text | Yes | None | ID in external system |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | Auto-updated |

#### `units`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `property_id` | uuid | No | None | FK -> `properties(id)` |
| `unit_code` | text | No | None | Display code (e.g., "101", "201") |
| `active` | boolean | No | `true` | |
| `external_source` | text | Yes | None | Integration source |
| `external_id` | text | Yes | None | External ID |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | Auto-updated |

#### `staff_assignments`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `profile_id` | uuid | No | None | FK -> `profiles` (implicit) |
| `property_id` | uuid | No | None | FK -> `properties(id)` |
| `assignment_type` | text | No | `'general'` | Type of assignment |
| `active` | boolean | No | `true` | |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | Auto-updated |

#### `tasks`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `title` | text | No | None | Task display title |
| `description` | text | Yes | None | Detailed description |
| `property_id` | uuid | No | None | FK -> `properties(id)` |
| `unit_id` | uuid | Yes | None | FK -> `units(id)` |
| `task_category` | task_category | No | `'maintenance'` | |
| `task_type` | text | Yes | None | Free-text subtype (e.g., "plumbing") |
| `priority` | task_priority | No | `'medium'` | |
| `status` | task_status | No | `'new'` | |
| `assigned_to` | uuid | Yes | None | FK -> `profiles` (implicit) |
| `created_by` | uuid | Yes | None | FK -> `profiles` (implicit) |
| `assigned_vendor_name` | text | Yes | None | External vendor name |
| `blocked_reason` | text | Yes | None | Reason for blocked/waiting status |
| `requires_photo` | boolean | No | `false` | Definition of Done flag |
| `requires_note` | boolean | No | `false` | Definition of Done flag |
| `requires_timestamp` | boolean | No | `true` | Definition of Done flag |
| `due_at` | timestamptz | Yes | None | Due date/time |
| `started_at` | timestamptz | Yes | None | Set when status -> in_progress |
| `completed_at` | timestamptz | Yes | None | Set when status -> completed |
| `verified_at` | timestamptz | Yes | None | Set when status -> verified |
| `reopened_count` | integer | No | `0` | Incremented on each reopen |
| `source_type` | text | No | `'manual'` | How task was created |
| `external_source` | text | Yes | None | Integration source |
| `external_id` | text | Yes | None | External ID |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | Auto-updated |

**Foreign keys:** `tasks.property_id -> properties.id`, `tasks.unit_id -> units.id`.

#### `task_updates`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `task_id` | uuid | No | None | FK -> `tasks(id)` |
| `actor_id` | uuid | Yes | None | Who performed the action |
| `update_type` | text | No | None | `"status_change"`, `"note"`, etc. |
| `old_status` | task_status | Yes | None | Previous status |
| `new_status` | task_status | Yes | None | New status |
| `note` | text | Yes | None | Free-text note content |
| `metadata_json` | jsonb | Yes | None | Additional structured data |
| `created_at` | timestamptz | No | `now()` | |

**Append-only:** No UPDATE or DELETE allowed. This table serves as an immutable audit trail.

#### `task_photos`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `task_id` | uuid | No | None | FK -> `tasks(id)` |
| `uploaded_by` | uuid | Yes | None | Who uploaded |
| `storage_path` | text | No | None | Path in `task-photos` bucket |
| `photo_type` | text | No | `'proof'` | Category of photo |
| `created_at` | timestamptz | No | `now()` | |

**Immutable:** No UPDATE or DELETE allowed.

**Storage path convention:** `{property_id}/{task_id}/{random_uuid}.{ext}`

#### `notification_events`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `recipient_id` | uuid | No | None | Who receives the notification |
| `task_id` | uuid | Yes | None | FK -> `tasks(id)` |
| `event_type` | text | No | None | Type of event |
| `title` | text | Yes | None | Display title |
| `body` | text | Yes | None | Display body text |
| `channel` | text | No | `'in_app'` | Delivery channel |
| `read` | boolean | No | `false` | Whether user has read it |
| `delivery_status` | text | No | `'pending'` | Delivery state |
| `sent_at` | timestamptz | Yes | None | When sent externally |
| `created_at` | timestamptz | No | `now()` | |

**No DELETE allowed.**

#### `inspection_templates`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `name` | text | No | None | Template display name |
| `version` | integer | No | `1` | Template version number |
| `active` | boolean | No | `true` | Whether template is available |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

#### `inspection_template_items`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `template_id` | uuid | No | None | FK -> `inspection_templates(id)` |
| `section_name` | text | No | None | Grouping header (e.g., "Kitchen") |
| `label` | text | No | None | Checklist item text |
| `item_type` | text | No | `'checkbox'` | Input type |
| `sort_order` | integer | No | `0` | Display order |
| `required` | boolean | No | `false` | Must be answered to complete |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

#### `inspections`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `property_id` | uuid | No | None | FK -> `properties(id)` |
| `unit_id` | uuid | Yes | None | FK -> `units(id)` |
| `inspector_id` | uuid | No | None | Who performs the inspection |
| `template_id` | uuid | No | None | FK -> `inspection_templates(id)` |
| `status` | inspection_status | No | `'scheduled'` | |
| `completed_at` | timestamptz | Yes | None | |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

#### `inspection_responses`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `inspection_id` | uuid | No | None | FK -> `inspections(id)` |
| `template_item_id` | uuid | No | None | FK -> `inspection_template_items(id)` |
| `response_value` | text | Yes | None | `"pass"` or `"fail"` |
| `note` | text | Yes | None | Free-text note |
| `flagged_issue` | boolean | No | `false` | Whether issue was flagged |
| `created_at` | timestamptz | No | `now()` | |
| `updated_at` | timestamptz | No | `now()` | |

#### `audit_logs`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `entity_type` | text | No | None | e.g., "task", "inspection" |
| `entity_id` | uuid | No | None | ID of the affected entity |
| `action` | text | No | None | e.g., "create", "update", "delete" |
| `actor_id` | uuid | Yes | None | Who performed the action |
| `payload_json` | jsonb | Yes | None | Change details |
| `created_at` | timestamptz | No | `now()` | |

**Immutable:** No UPDATE or DELETE allowed.

#### `reservation_events`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | No | `gen_random_uuid()` | Primary key |
| `property_id` | uuid | Yes | None | FK -> `properties(id)` |
| `unit_id` | uuid | Yes | None | FK -> `units(id)` |
| `event_type` | text | No | None | e.g., "checkout", "checkin" |
| `event_at` | timestamptz | Yes | None | When the event occurs |
| `external_source` | text | Yes | None | e.g., "travelnet" |
| `external_id` | text | Yes | None | Reservation ID in PMS |
| `payload_json` | jsonb | Yes | None | Full event payload |
| `created_at` | timestamptz | No | `now()` | |

### 4.4 Database Triggers

#### `handle_new_user()` on `auth.users`

**Fires:** AFTER INSERT on `auth.users`
**Action:** Creates a corresponding row in `profiles` with:
- `id` = new user's ID
- `full_name` = extracted from `raw_user_meta_data->>'full_name'`
- `email` = new user's email

This ensures every authenticated user automatically has a profile record.

#### `update_updated_at()` on multiple tables

**Fires:** BEFORE UPDATE
**Tables:** `profiles`, `properties`, `units`, `staff_assignments`, `tasks`, `inspection_templates`, `inspection_template_items`, `inspections`, `inspection_responses`
**Action:** Sets `updated_at = now()` on the row being updated.

#### `notify_on_task_change()` on `tasks`

**Fires:** AFTER UPDATE on `tasks`
**Security:** SECURITY DEFINER (bypasses RLS to insert notifications)
**Action:** Detects status changes and creates notification_events:

| Old Status | New Status | Recipient | Event Type | Title | Body |
|-----------|-----------|-----------|------------|-------|------|
| Any | `assigned` | `NEW.assigned_to` | `task_assigned` | "Task Assigned" | "{title} has been assigned to you" |
| Any | `blocked` | `NEW.created_by` | `task_blocked` | "Task Blocked" | "{title} has been blocked" |
| Any | `completed` | `NEW.created_by` | `task_completed` | "Task Completed" | "{title} has been completed" |
| Any | `verified` | `NEW.assigned_to` | `task_verified` | "Task Verified" | "{title} has been verified" |

Only fires when `OLD.status <> NEW.status` and the recipient is not null.

---

## 5. Operational Modules

### 5.1 Maintenance / Work Order Management

**Client Overview Reference:** Pages 9--11
**Difficulty Level:** Medium
**Payoff:** Highest payroll impact

#### Current Pain Points (Pre-System)

- Broken appliances, AC issues, guest complaints, damage reports, vendor coordination, and repair follow-ups are all tracked manually
- Work orders require manual coordination via Excel and WhatsApp
- Multiple admins chase the same status updates
- Technicians return to office to log updates
- Task closure is inconsistent and slow

#### What the System Implements

**Task Intake:**
- Admin/manager creates a maintenance task via `/admin/tasks/create`
- Required fields: title, property (dropdown of all active properties)
- Optional fields: description, unit (dependent dropdown filtered by selected property), task type (free text, e.g., "plumbing", "electrical"), priority, assignee, due date
- Definition of Done toggles: require photo proof, require completion note
- Source type is automatically set to `"manual"`
- If an assignee is selected, status is set to `"assigned"`; otherwise `"new"`

**Auto Assignment Logic (Current Implementation):**
- Manual assignment at creation time or via reassignment in Open Tasks Queue
- The system routes notifications to the assignee upon assignment
- Future: automated routing based on staff assignments and workload

**Mobile Field Interface:**
Technician opens task on phone and can:
- View complete task details (description, property, unit, due date, DoD requirements)
- Upload photos directly from camera (`capture="environment"` attribute)
- Add text notes via dialog
- Change status via tap targets (minimum 48px)
- Mark completed (with DoD enforcement)

**Status Flow:**
```
New -> Assigned -> In Progress -> Waiting Parts -> Completed -> Verified
                              \-> Blocked -------/
```

**Manager Dashboard (`/admin`):**
- Open work orders count
- Overdue work orders count
- Blocked work orders count
- Due today count
- Average completion time (hours)
- Technician workload (active staff count)
- Recent open tasks list (top 10)

**KPI Impact Targets:**

| Metric | Target |
|--------|--------|
| Cycle time | 30--50% reduction |
| Admin touches | 40--60% reduction |
| Reopen rate | 20--30% reduction |

### 5.2 Housekeeping Coordination

**Client Overview Reference:** Pages 11--13
**Difficulty Level:** Low
**Payoff:** Fastest improvement

#### Current Pain Points

- Cleaning schedules coordinated via WhatsApp and phone calls
- Manual scheduling for turnover tasks
- No confirmation system for unit readiness
- No photo proof of cleaning completion

#### What the System Implements

**Task Creation:**
- Admin creates housekeeping tasks with `task_category = "housekeeping"`
- Future: automatic task creation when reservation checkout event is received via `reservation_events` table

**Housekeeping Pipeline (`/admin/housekeeping`):**
Four-stage tabbed interface mapped to task statuses:

| Stage | Tab Label | Task Statuses |
|-------|----------|---------------|
| 1 | Scheduled | `new`, `assigned` |
| 2 | Cleaning | `in_progress`, `waiting_parts` |
| 3 | Blocked | `blocked` |
| 4 | Ready/Verified | `completed`, `verified` |

Each tab shows a count badge and filtered task cards. Only tasks with `task_category = "housekeeping"` appear.

**Mobile Cleaner Interface:**
Same as maintenance mobile interface --- cleaners receive tasks on phone, check off items, upload final photo, mark unit ready.

**KPI Impact Targets:**

| Metric | Target |
|--------|--------|
| Turnover speed | 20--30% improvement |
| Cleaner coordination time | 50% reduction |
| Admin scheduling overhead | Massive reduction |

### 5.3 Inspection Reporting

**Client Overview Reference:** Pages 13--15
**Difficulty Level:** Low--Medium
**Payoff:** Best data foundation

#### Current Pain Points

- Inspection paperwork is manual
- Missing documentation
- Reactive rather than preventive repairs
- No structured data on property condition

#### What the System Implements

**Template System:**
Inspection templates define reusable checklists. Each template contains items organized by section:

| Template | Sections | Items |
|----------|---------|-------|
| Standard Unit Turnover | Kitchen (4), Bathroom (4), Living Area (3), Bedroom (3) | 14 items |
| Monthly Safety Check | Fire Safety (4), Electrical (3), General Safety (4) | 11 items |

Each item has: label, section_name, item_type (default: checkbox), sort_order, and a `required` flag.

**Mobile Inspection Forms (`/inspections/:id`):**
- Inspector opens checklist on phone
- Items are grouped by section with section headers
- Each item has a checkbox (pass/fail) toggle
- Required items are marked with a red asterisk
- For items not passed, inspector can:
  - Add a note
  - Flag the issue (triggers auto-issue creation)

**Auto Issue Creation:**
When an inspector flags a checklist item:
1. The `inspection_responses` row is updated with `flagged_issue = true`
2. A new maintenance task is automatically created with:
   - Title: `[Inspection] {item label}`
   - Description: `Flagged during inspection: {template name}. {inspector note}`
   - Property and unit inherited from the inspection
   - Category: `maintenance`
   - Priority: `high`
   - Source type: `inspection`
   - Created by: current user

**Completion Validation:**
Before completing an inspection, the system checks that all `required` template items have a `response_value`. If any are missing, a destructive toast shows: "{N} required items remaining."

**Inspection Dashboard (`/admin/inspections`):**
Lists all inspections with property name, unit code, template name, and current status.

---

## 6. Task Lifecycle

### 6.1 State Machine

```
                         +-----------+
                         |    NEW    |
                         |  (start)  |
                         +-----+-----+
                               |
                    Accept     | (assigned_to = user.id)
                    (staff)    | status -> "assigned"
                               |
                         +-----v-----+
                         |  ASSIGNED |
                         +-----+-----+
                               |
                    Start      | (started_at = now)
                    (staff)    | status -> "in_progress"
                               |
                    +----------v----------+
                    |    IN_PROGRESS      |
                    +--+------+-------+---+
                       |      |       |
            Block      |      |       | Wait Parts
            (staff)    |      |       | (staff)
                       |      |       |
               +-------v-+   |   +---v-----------+
               | BLOCKED  |   |   | WAITING_PARTS |
               +-------+--+   |   +---+-----------+
                       |       |       |
            Resume     |       |       | Resume
            (staff)    |       |       | (staff)
                       |       |       |
                    +--v-------v-------v--+
                    |    (back to         |
                    |    IN_PROGRESS)     |
                    +----------+----------+
                               |
                    Complete    | (completed_at = now)
                    (staff)    | DoD enforcement
                               |
                         +-----v-----+
                         | COMPLETED |
                         +--+-----+--+
                            |     |
                 Verify     |     | Reopen
                 (super)    |     | (super)
                            |     |
                    +-------v-+   |   (reopened_count++,
                    | VERIFIED|   |    completed_at = null,
                    +-------+-+   |    verified_at = null,
                            |     |    status -> "in_progress")
                 Reopen     |     |
                 (super)    +-----+
                            |
                   (same reopen logic)
```

### 6.2 Transition Details

| From | To | Who Can Trigger | Fields Changed | Notification Fired |
|------|-----|----------------|----------------|-------------------|
| `new` | `assigned` | Staff (Accept) or Admin | `assigned_to = user.id`, `status = "assigned"` | `task_assigned` -> assignee |
| `assigned` | `in_progress` | Assigned staff | `status`, `started_at = now()` (if first start) | None |
| `in_progress` | `blocked` | Assigned staff | `status`, `blocked_reason` | `task_blocked` -> created_by |
| `in_progress` | `waiting_parts` | Assigned staff | `status`, `blocked_reason` | None |
| `blocked` | `in_progress` | Assigned staff | `status`, `blocked_reason = null` | None |
| `waiting_parts` | `in_progress` | Assigned staff | `status`, `blocked_reason = null` | None |
| `in_progress` / `assigned` / `waiting_parts` | `completed` | Assigned staff | `status`, `completed_at = now()` | `task_completed` -> created_by |
| `completed` | `verified` | Admin/Supervisor | `status`, `verified_at = now()` | `task_verified` -> assigned_to |
| `completed` / `verified` | `in_progress` | Admin/Supervisor | `status`, `completed_at = null`, `verified_at = null`, `reopened_count += 1` | None (task_update logged) |

### 6.3 Definition of Done Enforcement

When a user attempts to complete a task (status -> `completed`), the system performs client-side validation:

```typescript
// From TaskDetail.tsx handleComplete()
if (task.requires_photo && photos.length === 0) {
  toast({
    title: "Photo required",
    description: "Upload at least one photo before completing.",
    variant: "destructive"
  });
  return; // BLOCKED
}

const hasNote = updates.some((u) => u.update_type === "note");
if (task.requires_note && !hasNote) {
  toast({
    title: "Note required",
    description: "Add a note before completing.",
    variant: "destructive"
  });
  return; // BLOCKED
}
```

| DoD Rule | Check | Data Source |
|----------|-------|------------|
| Photo required | `task.requires_photo && photos.length === 0` | `task_photos` table |
| Note required | `task.requires_note && !updates.some(u => u.update_type === "note")` | `task_updates` table |
| Timestamp | Always recorded via `completed_at = now()` | Automatic |

If any required condition is not met, a destructive toast is shown and the completion is blocked. The complete confirmation dialog also shows warning messages for unmet requirements.

### 6.4 Reopening Flow

When an admin or supervisor reopens a completed or verified task:

1. `status` is set to `"in_progress"`
2. `completed_at` is set to `null`
3. `verified_at` is set to `null`
4. `reopened_count` is incremented by 1
5. A `task_update` is inserted with `note: "Task reopened"`
6. The reopened count is displayed in the task header as "Reopened x{N}"

The `reopened_count` field is used to calculate the **Repeat Rate** KPI on the Supervisor Dashboard.

---

## 7. Notification System

### 7.1 Notification Architecture

```
+-------------------+     +-------------------+     +-------------------+
|  Trigger-based    |     | Edge Function     |     | Client-side       |
|  (real-time)      |     | (scheduled)       |     | (polling)         |
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
| notify_on_task_   |     | escalate-overdue- |     | useUnreadCount()  |
| change() trigger  |     | tasks             |     |   poll: 15s       |
|                   |     |                   |     |                   |
| Fires on tasks    |     | Checks due_at <   |     | useNotifications()|
| UPDATE when       |     | now() for active  |     |   poll: 30s       |
| status changes    |     | tasks             |     |                   |
|                   |     |                   |     | NotificationBell  |
| Inserts into      |     | Inserts into      |     |   shows badge     |
| notification_     |     | notification_     |     |   shows popover   |
| events            |     | events            |     |                   |
+-------------------+     +-------------------+     +-------------------+
```

### 7.2 Trigger-Based Notifications

The `notify_on_task_change()` PostgreSQL trigger fires on every `tasks` UPDATE and creates notifications for the following events:

| Event | Condition | Recipient | Event Type | Example Body |
|-------|-----------|-----------|------------|-------------|
| Task assigned | `OLD.status <> 'assigned'` AND `NEW.status = 'assigned'` | `NEW.assigned_to` | `task_assigned` | "Fix leaky faucet has been assigned to you" |
| Task blocked | `OLD.status <> 'blocked'` AND `NEW.status = 'blocked'` | `NEW.created_by` | `task_blocked` | "Fix leaky faucet has been blocked" |
| Task completed | `OLD.status <> 'completed'` AND `NEW.status = 'completed'` | `NEW.created_by` | `task_completed` | "Fix leaky faucet has been completed" |
| Task verified | `OLD.status <> 'verified'` AND `NEW.status = 'verified'` | `NEW.assigned_to` | `task_verified` | "Fix leaky faucet has been verified" |

The trigger only inserts a notification if the recipient is not null.

### 7.3 Escalation Notifications

The `escalate-overdue-tasks` edge function handles overdue task escalation:

1. **Detection:** Queries all tasks where `due_at < now()` and status is not `completed` or `verified`
2. **Recipients:** Fetches all users with `admin`, `supervisor`, or `manager` roles
3. **Deduplication:** Checks `notification_events` for existing `task_overdue` notifications within the last 24 hours for the same task
4. **Notification:** Creates one `task_overdue` notification per overdue task per admin/supervisor/manager, but only if no notification was sent in the last 24 hours

This function must be invoked externally (e.g., via a cron job or webhook) as Supabase does not have built-in cron scheduling for edge functions.

### 7.4 Client-Side Notification Handling

**Unread Count Badge:**
- Hook: `useUnreadCount(userId)`
- Query: `SELECT count(*) FROM notification_events WHERE recipient_id = userId AND read = false`
- Polling interval: **15 seconds**
- Display: Red badge on bell icon, shows count (max "9+")

**Notification List:**
- Hook: `useNotifications(userId)`
- Query: `SELECT * FROM notification_events WHERE recipient_id = userId ORDER BY created_at DESC LIMIT 50`
- Polling interval: **30 seconds**
- Display: Popover list under bell icon

**Mark Read:**
- `useMarkRead()`: Updates single notification `read = true`
- `useMarkAllRead()`: Updates all unread notifications for user `read = true`
- Both invalidate `["notifications"]` and `["unread_count"]` query caches

**Spam Prevention (per Client Overview):**
- The 24-hour deduplication in the escalation function prevents repeated overdue notifications
- Trigger-based notifications only fire on status changes, not on every update
- Notifications are per-event, not per-check

---

## 8. Screen-by-Screen Reference

### 8.1 Field Staff Screens

#### Login (`/login`)

| Property | Value |
|----------|-------|
| Component | `src/pages/Login.tsx` |
| Auth required | No |
| Data hooks | None (direct `supabase.auth.signInWithPassword`) |

Simple email/password form with LRMB branding. On success, navigates to `/tasks`. No registration form --- accounts are created by admin. Error toast on failed login. Contact administrator message at bottom.

#### My Tasks (`/tasks`)

| Property | Value |
|----------|-------|
| Component | `src/pages/MyTasks.tsx` |
| Auth required | Yes (any role) |
| Data hooks | `useTasks({ assigned_to: user.id, status: ACTIVE_STATUSES })` |
| Active statuses | `new`, `assigned`, `in_progress`, `waiting_parts`, `blocked` |

Displays tasks assigned to the current user with active (non-terminal) statuses. Tasks are sorted by:
1. Priority (urgent first, using `PRIORITY_ORDER`)
2. Due date (earliest first)
3. Tasks with no due date appear last

Each task is rendered as a `TaskCard` component. Empty state shows "No active tasks assigned."

#### Task Detail (`/tasks/:id`)

| Property | Value |
|----------|-------|
| Component | `src/pages/TaskDetail.tsx` |
| Auth required | Yes (any role) |
| Data hooks | `useTask(id)`, `useTaskUpdates(id)`, `useTaskPhotos(id)`, `useUpdateTask()`, `useAddTaskUpdate()`, `useUploadTaskPhoto()` |

The most complex screen in the application. Sections:

**Header:** Title, status badge, priority badge, overdue indicator (red "OVERDUE" text with icon), reopened count badge.

**Info Card:** Description, property name, unit code, due date (formatted), category, task type, blocked reason (if applicable), DoD requirement indicators (photo/note badges).

**Action Buttons (contextual, shown in 2-column grid):**

| Button | Shown When | Action |
|--------|-----------|--------|
| Accept | `status = "new"` | Sets `assigned_to = user.id`, status -> `assigned` |
| Start | `status = "assigned"` | Sets `started_at = now()`, status -> `in_progress` |
| Resume | `status = "blocked"` or `"waiting_parts"` | Clears `blocked_reason`, status -> `in_progress` |
| Note | Active status, not completed/verified | Opens dialog, inserts `task_update` with type `"note"` |
| Photo | Active status, not completed/verified | Opens camera/file picker, uploads to storage, inserts `task_photo` |
| Block | Active status, not completed/verified | Opens dialog for reason, status -> `blocked` |
| Waiting Parts | Active status, not completed/verified | Opens dialog for reason, status -> `waiting_parts` |
| Complete | `in_progress`, `assigned`, or `waiting_parts` | Validates DoD, then status -> `completed` |
| Verify | `status = "completed"` AND admin access | Status -> `verified` |
| Reopen | `status = "completed"` or `"verified"` AND admin access | Resets timestamps, increments `reopened_count` |

**Photos Section:** Grid of uploaded proof photos (3 columns). Images loaded via signed URLs (1-hour expiry).

**Activity Timeline:** Chronological list of all `task_updates` for this task, showing update type, relative time, notes, and status transitions.

**Dialogs:**
- Note dialog: textarea + save button
- Block dialog: textarea for reason + block button (destructive variant)
- Waiting Parts dialog: textarea for reason + mark waiting button
- Complete confirmation: shows DoD warnings if requirements unmet

#### Completed Tasks (`/tasks/completed`)

| Property | Value |
|----------|-------|
| Component | `src/pages/CompletedTasks.tsx` |
| Auth required | Yes (any role) |
| Data hooks | `useTasks({ assigned_to: user.id, status: ["completed", "verified"] })` |

Shows the current user's completed and verified tasks. Same layout as My Tasks.

### 8.2 Admin Screens

#### Admin Dashboard (`/admin`)

| Property | Value |
|----------|-------|
| Component | `src/pages/AdminDashboard.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()` |

**6 Stat Cards (2-column grid):**

| Card | Value Calculation | Icon | Click Action |
|------|-------------------|------|-------------|
| Open Tasks | Count where status not in `completed`, `verified` | ClipboardList | Navigate to `/admin/tasks/open` |
| Overdue | Count where `due_at < now()` AND status active | AlertTriangle | Navigate to `/admin/tasks/overdue` |
| Blocked | Count where `status = "blocked"` | Ban | Navigate to `/admin/tasks/blocked` |
| Due Today | Count where `due_at` is today AND status active | Clock | None |
| Avg Cycle Time | `mean(max(0, completed_at - created_at))` in hours | Timer | None |
| Active Staff | Count of distinct `assigned_to` values | Users | Navigate to `/supervisor/staff` |

"New Task" button navigates to `/admin/tasks/create`.

Recent open tasks list shows top 10 non-terminal tasks ordered by `created_at DESC`.

#### Create Task (`/admin/tasks/create`)

| Property | Value |
|----------|-------|
| Component | `src/pages/CreateTask.tsx` |
| Auth required | Admin access |
| Data hooks | `useCreateTask()`, `useProperties()`, `useUnits(propertyId)`, `useProfiles()` |

Form fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | text input | Yes | |
| Description | textarea | No | |
| Property | select dropdown | Yes | Populated from `useProperties()` |
| Unit | select dropdown | No | Populated from `useUnits(selectedPropertyId)`, disabled until property selected |
| Category | select | No | maintenance, housekeeping, inspection, general |
| Priority | select | No | low, medium, high, urgent (default: medium) |
| Task Type | text input | No | Free-text (e.g., "plumbing", "electrical") |
| Assign To | select dropdown | No | Populated from `useProfiles()` |
| Due Date | datetime-local input | No | |
| Require Photo | switch toggle | No | Default: off |
| Require Note | switch toggle | No | Default: off |

On submit: inserts task with `status = "assigned"` if assignee selected, otherwise `"new"`. Sets `created_by = user.id`, `source_type = "manual"`. Navigates back to `/admin`.

#### Open Tasks Queue (`/admin/tasks/open`)

| Property | Value |
|----------|-------|
| Component | `src/pages/OpenTasksQueue.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()`, `useProfiles()`, `useUpdateTask()` |

Lists all tasks not in `completed` or `verified` status. Each task has a "Reassign" button that opens a dialog with a staff selector dropdown. Reassigning sets `assigned_to` and `status = "assigned"`.

#### Overdue Queue (`/admin/tasks/overdue`)

| Property | Value |
|----------|-------|
| Component | `src/pages/OverdueQueue.tsx` |
| Auth required | Admin access |

Filters tasks where `due_at < now()` and status is not completed/verified.

#### Blocked Queue (`/admin/tasks/blocked`)

| Property | Value |
|----------|-------|
| Component | `src/pages/BlockedQueue.tsx` |
| Auth required | Admin access |

Filters tasks with `status = "blocked"`.

#### Property Tasks (`/admin/tasks/property/:id`)

| Property | Value |
|----------|-------|
| Component | `src/pages/PropertyTasks.tsx` |
| Auth required | Admin access |

Tasks filtered by `property_id = :id`.

#### Staff Tasks (`/admin/tasks/staff/:id`)

| Property | Value |
|----------|-------|
| Component | `src/pages/StaffTasks.tsx` |
| Auth required | Admin access |

Tasks filtered by `assigned_to = :id`.

#### Housekeeping Queue (`/admin/housekeeping`)

| Property | Value |
|----------|-------|
| Component | `src/pages/HousekeepingQueue.tsx` |
| Auth required | Admin access |
| Data hooks | `useTasks({ category: "housekeeping" })` |

Four-tab pipeline interface. See [Section 5.2](#52-housekeeping-coordination) for details.

#### Inspection Queue (`/admin/inspections`)

| Property | Value |
|----------|-------|
| Component | `src/pages/InspectionQueue.tsx` |
| Auth required | Admin access |
| Data hooks | `useInspections()` |

Lists all inspections with property name, unit code, template name, and status badge.

### 8.3 Supervisor Screens

#### Supervisor Dashboard (`/supervisor`)

| Property | Value |
|----------|-------|
| Component | `src/pages/SupervisorDashboard.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()` |

**5 KPI Cards (2-column grid):**

| Card | Calculation |
|------|-------------|
| Pending Verification | Count where `status = "completed"` |
| Avg Cycle Time | `mean(max(0, completed_at - created_at))` hours for completed/verified tasks |
| Overdue | Count where `due_at < now()` AND status active |
| Photo Compliance | `(photo-required tasks that are completed) / (all photo-required tasks) * 100` |
| Repeat Rate | `(tasks with reopened_count > 0) / (total tasks) * 100`, target: < 20% |

**Navigation Buttons (2-column grid):**
- Verify Queue -> `/supervisor/verify`
- KPI Details -> `/supervisor/kpi`
- Staff Workload -> `/supervisor/staff`
- Trends -> `/supervisor/trends`

**Tasks by Category Bar Chart:**
Horizontal bar chart showing task counts for maintenance, housekeeping, inspection, general.

#### Verification Queue (`/supervisor/verify`)

| Property | Value |
|----------|-------|
| Component | `src/pages/VerificationQueue.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()`, `useUpdateTask()`, `useAddTaskUpdate()` |

Lists tasks with `status = "completed"`. Each card has a "Verify" button that:
1. Updates task: `status = "verified"`, `verified_at = now()`
2. Inserts task_update: `old_status = "completed"`, `new_status = "verified"`
3. Triggers notification to assigned_to

#### KPI Overview (`/supervisor/kpi`)

| Property | Value |
|----------|-------|
| Component | `src/pages/KPIOverview.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()` |

**4 Charts:**

1. **Tasks by Status** (bar chart): Counts for each of the 7 task statuses
2. **Priority Distribution** (pie chart): Counts for low, medium, high, urgent
3. **Avg Cycle Time Trend** (line chart): Daily average completion hours over last 14 days. Only shown if > 1 data point.
4. **Individual Completion Times** (line chart): Hours for last 30 completed tasks

#### Staff Workload (`/supervisor/staff`)

| Property | Value |
|----------|-------|
| Component | `src/pages/StaffWorkload.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()`, `useProfiles()` |

**Horizontal bar chart:** Active vs completed task counts per staff member (stacked bars).

**Staff cards:** Each staff member with tasks assigned shows: name, active count, completed count, total count. Clicking navigates to `/admin/tasks/staff/:id`.

#### Trend Charts (`/supervisor/trends`)

| Property | Value |
|----------|-------|
| Component | `src/pages/TrendCharts.tsx` |
| Auth required | Admin access |
| Data hooks | `useAllTasks()` |

**2 Charts:**

1. **Created vs Completed (14 days)** (line chart): Two lines showing daily created and completed task counts
2. **Overdue Tasks Trend** (bar chart): Daily overdue task count over 14 days

### 8.4 Inspection Screens

#### Inspection Checklist (`/inspections/:id`)

| Property | Value |
|----------|-------|
| Component | `src/pages/InspectionChecklist.tsx` |
| Auth required | Yes (any role) |
| Data hooks | `useInspection(id)`, `useTemplateItems(templateId)`, `useInspectionResponses(id)`, `useSaveResponse()`, `useUpdateInspection()`, `useCreateTask()` |

See [Section 5.3](#53-inspection-reporting) for full details.

---

## 9. KPI Framework

### 9.1 KPI Definitions

| KPI | Formula | Data Source | Target (from Client) | Dashboard Location |
|-----|---------|------------|---------------------|-------------------|
| **Open Tasks** | `COUNT(tasks WHERE status NOT IN ('completed','verified'))` | `tasks` | Minimize | Admin Dashboard |
| **Overdue** | `COUNT(tasks WHERE due_at < now() AND status active)` | `tasks` | Minimize | Admin, Supervisor |
| **Blocked** | `COUNT(tasks WHERE status = 'blocked')` | `tasks` | Minimize | Admin Dashboard |
| **Due Today** | `COUNT(tasks WHERE due_at is today AND status active)` | `tasks` | Informational | Admin Dashboard |
| **Avg Cycle Time** | `MEAN(MAX(0, completed_at - created_at))` hours, for completed/verified tasks | `tasks` | 30--50% reduction | Admin, Supervisor, KPI Overview |
| **Active Staff** | `COUNT(DISTINCT assigned_to)` across all tasks | `tasks` | Informational | Admin Dashboard |
| **Pending Verification** | `COUNT(tasks WHERE status = 'completed')` | `tasks` | Minimize (fast verification) | Supervisor Dashboard |
| **Photo Compliance** | `(photo-required completed tasks / all photo-required tasks) * 100` | `tasks` | 90%+ | Supervisor Dashboard |
| **Repeat Rate** | `(tasks with reopened_count > 0 / total tasks) * 100` | `tasks` | < 20% target, 20-40% reduction | Supervisor Dashboard |
| **Admin Touches** | Not directly measured in current version | N/A | 40--60% reduction | Future |
| **Field-to-Office Re-entry** | Eliminated by mobile interface | N/A | Near zero | System design |

### 9.2 Trend Metrics

| Metric | Window | Aggregation | Chart Type | Location |
|--------|--------|-------------|-----------|----------|
| Cycle Time Trend | 14 days | Daily average hours | Line chart | KPI Overview |
| Individual Completion Times | Last 30 tasks | Per-task hours | Line chart | KPI Overview |
| Created vs Completed | 14 days | Daily count | Dual line chart | Trend Charts |
| Overdue Trend | 14 days | Daily count | Bar chart | Trend Charts |
| Tasks by Status | All time | Count per status | Bar chart | KPI Overview |
| Priority Distribution | All time | Count per priority | Pie chart | KPI Overview |
| Tasks by Category | All time | Count per category | Bar chart | Supervisor Dashboard |
| Staff Workload | All time | Active + completed per staff | Horizontal bar | Staff Workload |

### 9.3 Defensive Calculations

All cycle time calculations use `Math.max(0, ...)` to prevent negative values from data inconsistencies:

```typescript
const avgCycleHrs = completed.length
  ? Math.max(0, Math.round(
      completed.reduce((sum, t) =>
        sum + (t.completed_at
          ? Math.max(0, differenceInHours(new Date(t.completed_at), new Date(t.created_at)))
          : 0
        ), 0
      ) / completed.length
    ))
  : 0;
```

---

## 10. API & Data Hooks Reference

### 10.1 Task Hooks (`src/hooks/useTasks.ts`)

#### Queries

| Hook | Parameters | Query Key | Return Type | Polling |
|------|-----------|-----------|-------------|---------|
| `useTasks(filters?)` | `{ status?: TaskStatus[], category?: TaskCategory, assigned_to?: string, property_id?: string }` | `["tasks", filters]` | `(Task & { properties, units })[]` | None |
| `useTask(id)` | `id: string \| undefined` | `["task", id]` | `Task & { properties, units }` | None |
| `useAllTasks()` | None | `["all_tasks"]` | `(Task & { properties, units })[]` | None |
| `useTaskUpdates(taskId)` | `taskId: string \| undefined` | `["task_updates", taskId]` | `TaskUpdateRow[]` | None |
| `useTaskPhotos(taskId)` | `taskId: string \| undefined` | `["task_photos", taskId]` | `TaskPhoto[]` | None |

All queries use `enabled: !!param` to prevent firing with undefined parameters.

`useTasks` supports multiple filters that are applied additively:
- `status`: array of statuses (uses `.in()`)
- `category`: single category (uses `.eq()`)
- `assigned_to`: user ID (uses `.eq()`)
- `property_id`: property ID (uses `.eq()`)

Results are ordered by `created_at DESC`.

#### Mutations

| Hook | Input | Action | Cache Invalidation |
|------|-------|--------|-------------------|
| `useUpdateTask()` | `{ id, ...updates }` | `supabase.from("tasks").update(updates).eq("id", id)` | `["tasks"]`, `["task", id]`, `["all_tasks"]` |
| `useCreateTask()` | `TaskInsert` | `supabase.from("tasks").insert(task)` | `["tasks"]`, `["all_tasks"]` |
| `useAddTaskUpdate()` | `TaskUpdateInsert` | `supabase.from("task_updates").insert(update)` | `["task_updates", task_id]`, `["tasks"]` |
| `useUploadTaskPhoto()` | `{ taskId, propertyId, file, userId }` | Upload to storage + insert DB record | `["task_photos", taskId]` |

#### Photo Upload Flow

```
1. Generate path: {propertyId}/{taskId}/{crypto.randomUUID()}.{ext}
2. Upload: supabase.storage.from("task-photos").upload(path, file)
3. Insert DB: supabase.from("task_photos").insert({
     task_id, storage_path: path, uploaded_by: userId, photo_type: "proof"
   })
4. Invalidate: ["task_photos", taskId]
```

Photo display uses signed URLs with 1-hour expiry:
```typescript
supabase.storage.from("task-photos").createSignedUrl(path, 3600)
```

### 10.2 Property Hooks (`src/hooks/useProperties.ts`)

| Hook | Parameters | Query Key | Return Type | Notes |
|------|-----------|-----------|-------------|-------|
| `useProperties()` | None | `["properties"]` | `Property[]` | Active only, ordered by name |
| `useUnits(propertyId)` | `propertyId: string \| undefined` | `["units", propertyId]` | `Unit[]` | Active only, ordered by unit_code |
| `useProfiles()` | None | `["profiles"]` | `Profile[]` | Active only, ordered by full_name |
| `useStaffForProperty(propertyId)` | `propertyId: string \| undefined` | `["staff_for_property", propertyId]` | `Profile[]` | Two-step: fetch assignments, then profiles |

`useStaffForProperty` performs two queries:
1. `staff_assignments` filtered by `property_id` and `active = true` -> gets `profile_id` list
2. `profiles` filtered by `id IN (profile_ids)` -> returns full profile objects

### 10.3 Inspection Hooks (`src/hooks/useInspections.ts`)

| Hook | Parameters | Query Key | Return Type | Notes |
|------|-----------|-----------|-------------|-------|
| `useInspections()` | None | `["inspections"]` | `(Inspection & { properties, units, inspection_templates })[]` | Joins property, unit, template names |
| `useInspection(id)` | `id: string \| undefined` | `["inspection", id]` | Same as above, single | |
| `useTemplateItems(templateId)` | `templateId: string \| undefined` | `["template_items", templateId]` | `InspectionTemplateItem[]` | Ordered by sort_order |
| `useInspectionResponses(inspectionId)` | `inspectionId: string \| undefined` | `["inspection_responses", inspectionId]` | `InspectionResponse[]` | |
| `useSaveResponse()` | Response object | N/A (mutation) | void | Upsert: checks for existing, updates or inserts |
| `useUpdateInspection()` | `{ id, ...updates }` | N/A (mutation) | void | Invalidates `["inspections"]`, `["inspection"]` |

The `useSaveResponse` mutation implements an upsert pattern:
1. Query for existing response matching `inspection_id` + `template_item_id`
2. If found: UPDATE the existing row
3. If not found: INSERT a new row
4. Invalidates `["inspection_responses", inspection_id]`

### 10.4 Notification Hooks (`src/hooks/useNotifications.ts`)

| Hook | Parameters | Query Key | Return Type | Polling |
|------|-----------|-----------|-------------|---------|
| `useNotifications(userId)` | `userId: string \| undefined` | `["notifications", userId]` | `NotificationEvent[]` | **30 seconds** |
| `useUnreadCount(userId)` | `userId: string \| undefined` | `["unread_count", userId]` | `number` | **15 seconds** |
| `useMarkRead()` | `id: string` | N/A (mutation) | void | Invalidates notifications + unread_count |
| `useMarkAllRead()` | `userId: string` | N/A (mutation) | void | Invalidates notifications + unread_count |

Notification list is limited to 50 most recent, ordered by `created_at DESC`.

---

## 11. Edge Functions

### 11.1 `seed-demo-data`

**Location:** `supabase/functions/seed-demo-data/index.ts`
**JWT Verification:** Not configured (requires manual invocation)
**Runtime:** Deno (Supabase Edge Functions)

**Purpose:** Populates the database with realistic demo data for testing and pilot demonstrations.

**What It Creates:**

| Entity | Count | Details |
|--------|-------|---------|
| Users | 6 | 1 admin, 1 supervisor, 1 manager, 3 field staff |
| Properties | 15 | Diverse names, addresses, regions (West/Central/East) |
| Units | ~35 | 2-3 per property (more for Resorts/Lodges/Hotels) |
| Staff Assignments | 15 | 5 properties per staff member |
| Tasks | 35 | All statuses, categories, priorities, some overdue |
| Inspection Templates | 2 | "Standard Unit Turnover" (14 items), "Monthly Safety Check" (11 items) |
| Inspections | 4 | Various statuses |

**Test Credentials (all use password `Test1234!`):**

| Email | Role | Full Name |
|-------|------|-----------|
| `admin@lrmb.test` | admin | Mike Admin |
| `supervisor@lrmb.test` | supervisor | Sarah Supervisor |
| `manager@lrmb.test` | manager | Frank Manager |
| `staff1@lrmb.test` | field_staff | Carlos Field |
| `staff2@lrmb.test` | field_staff | Diana Cleaner |
| `staff3@lrmb.test` | field_staff | Eddie Maintenance |

**Idempotency Notes:**
- User creation checks for existing users by email before creating
- Role assignment uses `upsert` with `onConflict: "user_id,role"`
- Property creation checks for existing properties by name
- Units, tasks, inspections do NOT check for duplicates --- re-running will create duplicates
- For a clean re-seed: delete all data from tables first, then re-run

**Task Temporal Data:**
Tasks have `created_at` values set to past dates (4--168 hours ago) using the `ago()` helper function. Completed tasks have `completed_at` values that are more recent than their `created_at`, ensuring positive cycle time calculations.

### 11.2 `escalate-overdue-tasks`

**Location:** `supabase/functions/escalate-overdue-tasks/index.ts`
**JWT Verification:** Disabled (`verify_jwt = false` in `config.toml`)
**Runtime:** Deno (Supabase Edge Functions)

**Purpose:** Detects overdue tasks and sends notifications to all admin/supervisor/manager users.

**Algorithm:**

```
1. Query tasks WHERE:
   - status NOT IN ('completed', 'verified')
   - due_at < now()
   - due_at IS NOT NULL

2. Query user_roles WHERE role IN ('admin', 'supervisor', 'manager')
   -> Get unique admin user IDs

3. Query notification_events WHERE:
   - event_type = 'task_overdue'
   - task_id IN (overdue task IDs)
   - created_at >= (now - 24 hours)
   -> Build set of already-notified task IDs

4. For each overdue task NOT in already-notified set:
   For each admin user:
     Create notification:
       - recipient_id: admin user ID
       - task_id: overdue task ID
       - event_type: 'task_overdue'
       - title: 'Overdue Task'
       - body: '{task title} is past due'

5. Batch insert all notifications

6. Return: { escalated: count }
```

**Invocation:**
```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/escalate-overdue-tasks \
  -H "Content-Type: application/json"
```

No authorization header required (JWT verification disabled).

**Scheduling:**
This function should be invoked on a schedule (e.g., every 30 minutes or hourly). Options:
- External cron service (e.g., cron-job.org, GitHub Actions)
- n8n workflow (webhook URL already configured)
- Supabase `pg_cron` extension (if enabled)

---

## 12. Design System

### 12.1 Color System

The application uses a dark navy and gold theme defined as HSL CSS custom properties in `src/index.css`.

#### Core Tokens

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `216 39% 10%` | Page background (dark navy) |
| `--foreground` | `40 20% 92%` | Primary text (warm off-white) |
| `--card` | `216 35% 14%` | Card backgrounds |
| `--card-foreground` | `40 20% 92%` | Card text |
| `--primary` | `43 52% 54%` | Gold accent, primary actions |
| `--primary-foreground` | `216 39% 10%` | Text on primary buttons |
| `--secondary` | `216 25% 20%` | Secondary surfaces |
| `--secondary-foreground` | `40 20% 92%` | Text on secondary |
| `--muted` | `216 25% 18%` | Muted backgrounds |
| `--muted-foreground` | `216 15% 55%` | Muted text, labels |
| `--accent` | `43 52% 54%` | Same as primary (gold) |
| `--destructive` | `0 72% 51%` | Error states, blocked status |
| `--border` | `216 20% 22%` | Border color |
| `--input` | `216 20% 22%` | Input border |
| `--ring` | `43 52% 54%` | Focus ring (gold) |
| `--radius` | `0.625rem` | Border radius (10px) |

#### Status Colors

| Token | HSL Value | Status |
|-------|-----------|--------|
| `--status-new` | `210 80% 55%` | New tasks (blue) |
| `--status-assigned` | `200 70% 50%` | Assigned tasks (cyan) |
| `--status-in-progress` | `38 92% 50%` | In progress (amber) |
| `--status-waiting` | `28 80% 52%` | Waiting parts (orange) |
| `--status-blocked` | `0 72% 51%` | Blocked (red) |
| `--status-completed` | `142 60% 45%` | Completed (green) |
| `--status-verified` | `160 55% 42%` | Verified (teal) |

#### Priority Colors

| Token | HSL Value | Priority |
|-------|-----------|----------|
| `--priority-low` | `210 15% 50%` | Low (gray-blue) |
| `--priority-medium` | `43 52% 54%` | Medium (gold) |
| `--priority-high` | `25 90% 55%` | High (orange) |
| `--priority-urgent` | `0 72% 51%` | Urgent (red, with `animate-pulse`) |

### 12.2 Badge Styling

**StatusBadge** uses outline badges with 20% opacity background, full color text, and 30% opacity border:
```
bg-status-{status}/20 text-status-{status} border-status-{status}/30
```

**PriorityBadge** follows the same pattern. Urgent priority adds `animate-pulse` for visual attention.

### 12.3 Touch Targets

All interactive elements use the `.tap-target` utility class:
```css
.tap-target {
  @apply min-h-[48px] min-w-[48px];
}
```

This ensures compliance with WCAG 2.5.5 (Target Size Enhanced) and Apple's iOS Human Interface Guidelines for minimum tap target size.

### 12.4 Typography

- **Font family:** `'Inter', system-ui, -apple-system, sans-serif`
- **Font smoothing:** `-webkit-font-smoothing: antialiased`
- **Heading sizes:** `text-3xl` (login), `text-xl` (task title), `text-lg` (page title, stat values)
- **Body text:** `text-sm` (default), `text-xs` (metadata, badges)
- **Micro text:** `text-[10px]` (timestamps, tab labels)

### 12.5 Sidebar Tokens

| Token | HSL Value |
|-------|-----------|
| `--sidebar-background` | `216 35% 12%` |
| `--sidebar-foreground` | `40 20% 92%` |
| `--sidebar-primary` | `43 52% 54%` |
| `--sidebar-primary-foreground` | `216 39% 10%` |
| `--sidebar-accent` | `216 25% 18%` |
| `--sidebar-accent-foreground` | `40 20% 92%` |
| `--sidebar-border` | `216 20% 22%` |
| `--sidebar-ring` | `43 52% 54%` |

### 12.6 Chart Styling

All Recharts components use design system tokens for consistent theming:
- **Tick text:** `fill: "hsl(var(--muted-foreground))"`, `fontSize: 11`
- **Tooltip:** `background: "hsl(var(--card))"`, `border: "1px solid hsl(var(--border))"`, `borderRadius: 8`, `color: "hsl(var(--foreground))"`
- **Bar radius:** `[4, 4, 0, 0]` (rounded top corners)
- **Line stroke:** `strokeWidth: 2`

---

## 13. Pilot Deployment Guide

### 13.1 Prerequisites

1. Supabase project provisioned (project ID: `hfpvnsbiewudpqbtlvte`)
2. Environment variables set in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
3. Database migrations applied (all migrations in `supabase/migrations/`)
4. Storage bucket `task-photos` created with private access

### 13.2 Seeding Demo Data

Invoke the seed function via the Supabase dashboard or CLI:

```bash
# Via Supabase CLI
supabase functions invoke seed-demo-data --no-verify-jwt

# Via curl
curl -X POST https://hfpvnsbiewudpqbtlvte.supabase.co/functions/v1/seed-demo-data \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "users": 6,
  "properties": 15,
  "message": "Seed data created. Login credentials: any @lrmb.test email with password Test1234!"
}
```

### 13.3 Verification Checklist

After seeding, verify each module:

#### Authentication
- [ ] Login as `admin@lrmb.test` / `Test1234!` -- should see Admin and Supervisor tabs
- [ ] Login as `staff1@lrmb.test` / `Test1234!` -- should see Tasks and Completed tabs only
- [ ] Login as `supervisor@lrmb.test` / `Test1234!` -- should see Admin and Supervisor tabs

#### Admin Dashboard
- [ ] Navigate to `/admin` -- 6 stat cards should show non-zero values
- [ ] Click "Open Tasks" -- should list ~25 open tasks
- [ ] Click "Overdue" -- should list 2+ overdue tasks
- [ ] Click "Blocked" -- should list 2 blocked tasks
- [ ] Avg Cycle Time should show a positive number

#### Task Lifecycle
- [ ] As staff1: open an assigned task, click "Start" -> status changes to "In Progress"
- [ ] Add a note via the Note dialog
- [ ] Upload a photo via the Photo button
- [ ] Click "Complete" -- if DoD requirements met, status -> "Completed"
- [ ] As supervisor: navigate to Verify Queue, click "Verify" on the task

#### Notifications
- [ ] After completing a task, check that the admin/creator receives a notification
- [ ] Bell icon should show unread count badge
- [ ] Click bell to see notification popover
- [ ] Click "Mark all read" to clear

#### Housekeeping
- [ ] Navigate to `/admin/housekeeping` -- tabs should show housekeeping tasks in correct stages
- [ ] Verify tab counts match task statuses

#### Inspections
- [ ] Navigate to `/admin/inspections` -- should list 4 inspections
- [ ] Open an "in_progress" inspection -- checklist should load
- [ ] Toggle a checkbox item to pass
- [ ] Flag an issue on an unchecked item -- maintenance task should be auto-created
- [ ] Check that the new task appears in the admin task list

#### KPIs & Charts
- [ ] Navigate to `/supervisor` -- 5 KPI cards with values
- [ ] Click "KPI Details" -- 4 charts should render
- [ ] Click "Staff Workload" -- bar chart and staff cards
- [ ] Click "Trends" -- 2 trend charts

### 13.4 Storage Bucket Verification

The `task-photos` bucket must exist with the following configuration:
- **Access level:** Private
- **RLS policies:** Enable policies for authenticated INSERT and SELECT

Verify by uploading a test photo through the Task Detail screen and confirming it displays in the photos grid.

### 13.5 Edge Function Deployment

Deploy edge functions via Supabase CLI:
```bash
supabase functions deploy seed-demo-data
supabase functions deploy escalate-overdue-tasks
```

Verify `escalate-overdue-tasks` config in `supabase/config.toml`:
```toml
[functions.escalate-overdue-tasks]
verify_jwt = false
```

---

## 14. Integration Roadmap

### 14.1 TravelNet PMS Integration

**Status:** Architecture prepared, no active sync

The database schema includes integration hooks throughout:

| Table | Integration Fields |
|-------|-------------------|
| `properties` | `external_source`, `external_id` |
| `units` | `external_source`, `external_id` |
| `tasks` | `external_source`, `external_id`, `source_type` |
| `reservation_events` | `external_source`, `external_id`, `event_type`, `event_at`, `payload_json` |

**Planned Flow:**
1. TravelNet sends checkout/checkin events via webhook
2. Webhook handler (n8n or edge function) inserts into `reservation_events`
3. Trigger on `reservation_events` creates housekeeping tasks automatically
4. `source_type` set to `"travelnet"` for traceability

### 14.2 Airtable Integration

**Status:** Secrets configured, no active sync

| Secret | Purpose |
|--------|---------|
| `AIRTABLE_TOKEN` | API authentication |
| `AIRTABLE_BASE_ID` | Target Airtable base |
| `AIRTABLE_TABLE_ID` | Target table |

Potential use: sync completed tasks to an Airtable base for reporting or client visibility.

### 14.3 n8n Automation

**Status:** Webhook URL configured

| Secret | Purpose |
|--------|---------|
| `N8N_WEBHOOK_URL` | n8n automation endpoint |

Potential uses:
- Scheduled invocation of `escalate-overdue-tasks`
- TravelNet webhook receiver -> `reservation_events` writer
- External notification delivery (email, SMS)
- Airtable sync workflows

### 14.4 Future Integration Opportunities

| Integration | Purpose | Complexity |
|------------|---------|-----------|
| Push notifications (Firebase) | Real-time mobile alerts | Medium |
| SMS (Twilio) | Critical overdue/blocked alerts | Low |
| Email (SendGrid/Resend) | Daily digest summaries | Low |
| Akia integration | Guest issue -> task creation | Medium |
| PriceLabs/KeyData | Occupancy-driven task scheduling | High |

---

## 15. Known Limitations & Future Work

### 15.1 Current Limitations

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| No push notifications | Users must open app to see notifications | 15-second polling for unread count |
| No offline mode | Field staff need internet connectivity | Most luxury rental areas have coverage |
| No guest-facing interface | Guest issues must be reported to admin first | Admin creates task on guest's behalf |
| No automated task assignment | Admin manually assigns all tasks | Future: rule-based auto-routing |
| No automated PMS sync | Tasks created manually, not from reservations | Future: TravelNet webhook integration |
| Escalation function requires external cron | Overdue notifications not fully automatic | Schedule via n8n or external cron |
| Client-side DoD enforcement only | Savvy user could bypass via API | Add server-side validation trigger |
| No task templates | Recurring tasks created from scratch each time | Future: task template system |
| Single tenant | No multi-organization support | Sufficient for LRMB pilot |
| No data export | KPIs viewable in-app only | Future: CSV/PDF export |

### 15.2 Planned Future Work

**Phase 2 (Post-Pilot):**
- TravelNet PMS webhook integration for auto-task creation
- Push notification support (Firebase Cloud Messaging)
- Task templates for recurring work orders
- Automated assignment rules based on staff_assignments and workload
- Server-side DoD enforcement via PostgreSQL trigger

**Phase 3 (Scale):**
- Multi-property portfolio dashboards
- CSV/PDF report export
- Guest self-service issue reporting portal
- Vendor portal for external service providers
- Offline mode with sync-on-reconnect
- SMS/email notification channels
- Historical KPI comparison (month-over-month, quarter-over-quarter)

---

## Appendix A: File Structure

```
docs/
  LRMB_Pre_Pilot_Documentation.md    # This document

src/
  App.tsx                              # Root component, routing, providers
  App.css                             # (empty, styles in index.css)
  main.tsx                            # React entry point
  index.css                           # Tailwind + design system tokens
  vite-env.d.ts                       # Vite type declarations

  lib/
    auth.tsx                           # AuthProvider context + useAuth hook
    utils.ts                           # cn() class merge utility

  hooks/
    useTasks.ts                        # Task CRUD hooks (7 hooks)
    useProperties.ts                   # Property/unit/profile hooks (4 hooks)
    useInspections.ts                  # Inspection hooks (6 hooks)
    useNotifications.ts                # Notification hooks (4 hooks)
    use-mobile.tsx                     # Mobile breakpoint detection
    use-toast.ts                       # Toast hook re-export

  types/
    task.ts                            # Task types, enums, constants
    inspection.ts                      # Inspection types
    notification.ts                    # Notification types

  components/
    ProtectedRoute.tsx                 # Route guard component
    NavLink.tsx                        # Navigation link component

    layout/
      AppShell.tsx                     # Page wrapper (header + nav + content)
      MobileNav.tsx                    # Bottom tab navigation

    notifications/
      NotificationBell.tsx             # Header notification bell + popover

    tasks/
      TaskCard.tsx                     # Task list card component
      StatusBadge.tsx                  # Task status badge
      PriorityBadge.tsx                # Task priority badge

    ui/                                # 40+ shadcn/ui components
      accordion.tsx, alert.tsx, alert-dialog.tsx, aspect-ratio.tsx,
      avatar.tsx, badge.tsx, breadcrumb.tsx, button.tsx, calendar.tsx,
      card.tsx, carousel.tsx, chart.tsx, checkbox.tsx, collapsible.tsx,
      command.tsx, context-menu.tsx, dialog.tsx, drawer.tsx,
      dropdown-menu.tsx, form.tsx, hover-card.tsx, input-otp.tsx,
      input.tsx, label.tsx, menubar.tsx, navigation-menu.tsx,
      pagination.tsx, popover.tsx, progress.tsx, radio-group.tsx,
      resizable.tsx, scroll-area.tsx, select.tsx, separator.tsx,
      sheet.tsx, sidebar.tsx, skeleton.tsx, slider.tsx, sonner.tsx,
      switch.tsx, table.tsx, tabs.tsx, textarea.tsx, toast.tsx,
      toaster.tsx, toggle.tsx, toggle-group.tsx, tooltip.tsx,
      use-toast.ts

  pages/
    Login.tsx                          # Email/password login
    MyTasks.tsx                        # Field staff task list
    CompletedTasks.tsx                 # User's completed tasks
    TaskDetail.tsx                     # Full task management interface
    AdminDashboard.tsx                 # Admin overview with 6 stat cards
    CreateTask.tsx                     # Task creation form
    OpenTasksQueue.tsx                 # All open tasks with reassignment
    OverdueQueue.tsx                   # Overdue task filter
    BlockedQueue.tsx                   # Blocked task filter
    PropertyTasks.tsx                  # Tasks by property
    StaffTasks.tsx                     # Tasks by staff member
    HousekeepingQueue.tsx              # 4-stage housekeeping pipeline
    InspectionQueue.tsx                # Inspection list
    InspectionChecklist.tsx            # Mobile inspection form
    SupervisorDashboard.tsx            # Supervisor KPI overview
    VerificationQueue.tsx              # Tasks pending verification
    KPIOverview.tsx                    # 4 KPI charts
    StaffWorkload.tsx                  # Staff workload visualization
    TrendCharts.tsx                    # 14-day trend charts
    NotFound.tsx                       # 404 page

  integrations/supabase/
    client.ts                          # Supabase client instance
    types.ts                           # Auto-generated database types

  test/
    setup.ts                           # Test setup
    example.test.ts                    # Example test

supabase/
  config.toml                          # Supabase project config
  migrations/                          # SQL migration files (read-only)
  functions/
    seed-demo-data/index.ts            # Demo data seeding function
    escalate-overdue-tasks/index.ts    # Overdue task escalation function
```

---

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **Admin access** | Having any of the roles: admin, supervisor, or manager |
| **DoD** | Definition of Done --- requirements that must be met before a task can be marked completed |
| **Edge Function** | Serverless function running on Supabase's Deno runtime |
| **PMS** | Property Management System (TravelNet Solutions) |
| **RLS** | Row-Level Security --- PostgreSQL feature that restricts row access based on policies |
| **Security Definer** | PostgreSQL function that executes with the privileges of its owner, not the caller |
| **Signed URL** | Temporary URL with authentication token for accessing private storage files |
| **Tap target** | Minimum 48x48px interactive area for mobile touch accessibility |
| **Turnover** | The process of cleaning and preparing a rental unit between guest stays |
| **Upsert** | Insert or update --- creates a row if it doesn't exist, updates if it does |

---

*Document generated: March 7, 2026*
*System version: Pre-Pilot 1.0*
*Prepared for: LRMB Stakeholder Review*
