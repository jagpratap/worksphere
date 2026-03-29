# Project Context Summary

## Goal

Building **WorkSphere** — a role-based project management SaaS (lightweight Jira + Notion hybrid) where three roles (`admin`, `manager`, `member`) see entirely different interfaces. Full MSW mock backend simulating a real API. Zero real backend — everything runs in the browser.

**Tech Stack:** React 19 + TypeScript 5.9, Vite 7, React Router v7 (data mode), Redux Toolkit + RTK Query, MSW 2.x, Tailwind CSS 4 + shadcn/ui, Recharts, React Hook Form + Zod v4, dnd-kit, Sonner, Vercel deploy.

**6-week roadmap:**

- Week 1: Foundation & role infrastructure ✅
- Week 2: Projects & task system (kanban) ✅
- Week 3: Sprint planning, time tracker, member experience ✅
- Week 4: Admin features (user management, billing, audit log)
- Week 5: Workload, notifications, polish
- Week 6: Visual polish, performance, deploy

---

## Key Decisions & Conclusions

### Architecture

- **Centralized permission engine** (`utils/permissions.ts`) — flat `Set<Permission>` per role, `canAccess()` / `hasAnyPermission()` functions. Single source of truth for sidebar, guards, components, and MSW handlers.
- **URL prefix-based role separation** — `/admin/*` (admin), `/app/*` (admin+manager), `/my/*` (all authenticated), `/shared/*` (all authenticated). Prefix alone determines access.
- **Redirect on forbidden, not error page** — wrong role → `ROLE_HOME_ROUTE[role]`, not `/unauthorized`. Unauthorized page reserved for broken states only.
- **Single `rootLoader` + component guards** — avoids race conditions from parallel loader execution. `rootLoader` initializes auth, `AuthGuard`/`RoleGuard`/`GuestGuard` are component wrappers reading resolved Redux state.
- **Single `baseApi` with `injectEndpoints`** — all features inject into one API slice. Store never changes when adding features. Tags registered per-feature via `enhanceEndpoints({ addTagTypes })`.
- **No envelope unwrap in baseQuery** — endpoints return full `ApiSuccessResponse<T>`. Call sites use `const { data, message } = await mutation(values).unwrap()` to access both data and server message.
- **Build only what the current week needs** — no premature files, constants, or utilities. Everything scales by addition, not refactoring.
- **Admin sees everything** — admin sidebar shows all 4 nav groups (Administration, Workspace, My Work, General). Admin has all 14 permissions.
- **Unified sidebar with PermissionGate** — single nav config, items gated per permission. No separate NavAdmin/NavMain/NavMember components.
- **shadcn SidebarProvider for collapse state** — no Redux sidebar slice needed.
- **PublicLayout wraps Landing + Auth pages** — shared auth-aware header (logo → home, conditional "Sign in" / "Dashboard" CTA). Auth pages hide the "Sign in" button via `isAuthPage` check.

### Folder Organization Rules

- **`constants/`** — Domain vocabulary. Business enums, labels, variants. Same values a backend would define. ("What values exist?")
- **`config/`** — App wiring. Static data specific to this frontend — routes, navigation, role mappings. No logic/functions. ("How is this app configured?")
- **`utils/`** — Pure functions with logic. Takes inputs, returns results. ("Compute something.")
- **Quick test:** Would you copy this file to a backend? Yes → `constants/`. No → `config/`. Has logic? → `utils/`.
- Example: `constants/roles.ts` (ROLES, labels) → `config/roles.ts` (ROLE_HOME_ROUTE, ROUTE_ROLE_MAP) → `utils/roles.ts` (getAllowedRolesForPath function)

### UI Component Rules

- **Always use shadcn components for interactive elements** — Button, Input, InputGroup, Select, etc. Never native `<button>`, `<input>`, `<a>` for interactive controls.
- **Native HTML only for layout** — `<div>`, `<span>`, `<p>`, `<Link>` are fine for structure.

### Week 2 Decisions

- **Kanban DnD library:** `dnd-kit` (`@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`) — more actively maintained, better TS support.
- **Project detail layout:** Breadcrumb nav + always-visible overview (Members + Tasks cards) + tabs (Board / Sprints). Overview removed from tabs to reduce nesting — project info (description, dates) moved to header.
- **Task detail:** Unified `TaskSheet` component — handles both create and edit modes via discriminated union props. Edit mode includes delete with AlertDialog confirmation. Sheet overlay keeps board context visible.
- **Project visibility:** Admin sees all projects; managers/members see only projects they own or belong to.
- **Task permissions:** Admin/owner can update all fields; members/assignees can update status + order only (for drag-and-drop).
- **Bulk reorder endpoint:** `POST /api/tasks/reorder` for drag-and-drop — accepts array of `{ id, status, order }` updates. Invalidates `Tasks LIST` tag to sync overview stats and server data after optimistic updates.
- **Kanban optimistic updates:** `localTasks` state holds optimistic positions during/after drag. Cleared when server data arrives via prop change (cache invalidation) or on failure (revert). No `useEffect` for cleanup — derived from `localTasks ?? tasks`.
- **CRUD permissions:** `PROJECTS_CREATE` and `TASKS_CREATE` added alongside existing `_LIST` permissions. Admin + manager can create; members can only view. `PermissionGate` wraps create actions.
- **Field whitelisting in updateTask handler:** Both project owners and assignees go through explicit field allowlists. No raw `...body` spread.
- **Reusable utilities:** `PageBreadcrumb` (array-driven breadcrumb nav), `formatDate` (centralized date format), `getInitials` (first-letter initials from name words). All replace inline logic across components.
- **Task keys:** Auto-incrementing per project using `TASK_COUNTERS` map (e.g., WSP-1, WSP-2, MOB-1).
- **Filtering:** Client-side for both projects and tasks (low data volume). Server-side pagination deferred — `PaginationMeta` type removed, will add back in Week 4 if needed.
- **URL sync for filters:** Generic `useFilterParams` hook syncs filter state to URL search params. Accepts defaults object, omits params from URL when they match defaults. Used by ProjectsPage and MyTasksPage. No Board-level filters needed (kanban has no filter UI).
- **Project access in handlers:** Kept as inline checks (not abstracted into middleware). `withProjectAccess` wrapper was considered but rejected — too complex for 5 handlers with varying access patterns. `withAuth` and `withRole` are the only two middleware.
- **RTK Query tag types:** Registered per-feature via `enhanceEndpoints({ addTagTypes: ["Projects", "Tasks"] })` before `injectEndpoints`. Base API has no `tagTypes`. Every `type` field in tag objects needs `as const` inside `.map()` to prevent TypeScript widening.
- **`taskCount` on Project:** Computed at response time by MSW handlers via `withTaskCount()` helper, not stored in fixtures.

### Auth Flow Decisions

- **SignOut mutation** — kept `clearCredentials` inside the mutation. AuthGuard appends `redirectTo` on signout — acceptable behavior.
- **`signOut` and `refresh` mutations take no arguments** — refresh token read internally from `tokenStorage.get()`.
- **`refresh` mutation removed** — refresh flow lives entirely in `baseQueryWithReauth` via raw `fetch`.
- **`setUserRole` reducer** added for dev role switcher — cleanly updates `state.user.role`.
- **`isLoading` from RTK Query mutation** used for form submit state, not RHF's `isSubmitting`.
- **`parseApiError<T>`** — generic version, returns typed `fieldErrors: FieldErrors<T>`.
- **Field errors → inline, general errors → toast** — if `fieldErrors` has entries, they render via `FieldError` components. Toast only fires when no field errors exist.
- **Post-signin redirect** — reads `redirectTo` from search params, falls back to `ROLE_HOME_ROUTE[user.role]`.
- **Email verification:** MSW handlers + RTK Query endpoints exist but NO UI built. Parked for Week 5 polish.

### Design System

- **Dual font system** — Outfit Variable for headings, Inter Variable for body text.
- **Semantic spacing tokens** — `--space-page-x` (1.5rem), `--space-page-y` (1.5rem), `--space-section` (2rem), `--space-card` (1.5rem), `--space-group` (1rem), `--space-inline` (0.5rem).
- **Layout tokens** — `--layout-max-w` (80rem), `--layout-prose-w` (42rem), `--header-h` (3.5rem).
- **Token usage rule** — use semantic tokens over raw values. No combined `--space-page` token — always use `px-page-x` and `py-page-y` separately.

### Naming & Conventions

- `export *` barrel pattern — TS catches name collisions immediately.
- `DEACTIVATED` not `INACTIVE` — explicit admin action, self-documenting.
- Response envelope: `ApiSuccessResponse<T>` / `ApiErrorResponse`.
- `SafeUser` has `name` (single string), optional `avatar` URL.
- Zod v4 — resolver import: `import { zodResolver } from "@hookform/resolvers/zod"` (verify if v4 needs `/v4` suffix).
- Constants pattern: values → type → labels → badge variants → colors → default.

### MSW Backend

- Standardized response structure: `{ success: true, data, message }` / `{ success: false, error: { code, message, details? } }`.
- Two middleware only: `withAuth` (JWT + deactivation check) and `withRole` (role check). No `withProjectAccess`.
- `withTaskCount()` helper enriches project responses with computed task count.
- Dev utilities on `window`: `__mswReset()`, `__mswUsers()`, `__mswProjects()`, `__mswTasks()`.

### Redux Store

- `store/base-api.ts` — single `createApi` with empty endpoints, NO `tagTypes` (features register their own).
- `store/base-query.ts` — `rawBaseQuery` → `baseQueryWithReauth` (refresh queue with token rotation). No envelope unwrap layer.
- Auth slice: `user`, `accessToken`, `refreshToken`, `isAuthenticated`, `isInitialized`. Actions: `setCredentials`, `updateAccessToken`, `clearCredentials`, `setInitialized`, `setUserRole`.

---

## Details, Facts & Constraints

### Folder Structure (current state after Week 3)

```
src/
├── app/
│   ├── guards/
│   │   ├── Auth.tsx           # Redirects unauthenticated → /auth/signin (with redirectTo)
│   │   ├── Guest.tsx          # Redirects authenticated → role home (respects redirectTo)
│   │   ├── Role.tsx           # Checks role via getAllowedRolesForPath (imported from utils/roles)
│   │   └── index.ts
│   ├── layouts/
│   │   ├── protected/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── NavUser.tsx
│   │   │   │   └── DevRoleSwitcher.tsx
│   │   │   └── index.tsx
│   │   ├── Auth.tsx
│   │   ├── Public.tsx
│   │   ├── Root.tsx
│   │   └── index.ts
│   ├── loader.ts
│   ├── routes/
│   │   ├── admin/             # Dashboard (wired)
│   │   ├── app/
│   │   │   ├── Dashboard.tsx  # Wired
│   │   │   ├── Projects.tsx   # Wired — renders ProjectsPage
│   │   │   ├── ProjectDetail.tsx # Wired
│   │   │   └── Workload.tsx   # Wired — renders WorkloadPage
│   │   ├── my/
│   │   │   ├── Tasks.tsx      # Wired — renders MyTasksPage
│   │   │   └── Time.tsx       # Wired — renders TimeTrackerPage
│   │   ├── auth/              # SignIn, SignUp, ForgotPassword, ResetPassword (all functional)
│   │   ├── shared/            # Profile, Settings, Notifications (wired)
│   │   ├── Landing.tsx
│   │   ├── NotFound.tsx
│   │   └── Unauthorized.tsx
│   ├── Router.tsx             # All routes wired
│   └── index.tsx
│
├── components/
│   ├── common/
│   │   ├── ErrorFallback.tsx
│   │   ├── FullPageSpinner.tsx
│   │   ├── PageBreadcrumb.tsx   # Reusable breadcrumb — array of { label, path? }
│   │   ├── PageContainer.tsx
│   │   ├── PageHeader.tsx
│   │   ├── PermissionGate.tsx
│   │   └── index.ts
│   └── ui/                    # shadcn/ui primitives
│
├── config/
│   ├── env.ts
│   ├── navigation.ts
│   ├── paths.ts               # projects.detail, board, sprints paths ready
│   └── roles.ts               # DATA ONLY — DEFAULT_ROLE, ROLE_HOME_ROUTE, ROUTE_ROLE_MAP
│
├── constants/
│   ├── index.ts
│   ├── project-status.ts      # PROJECT_STATUS, labels, badge variants, PROJECT_COLORS, color labels, default
│   ├── roles.ts               # ROLES, Role, ROLE_LABELS
│   ├── sprint-status.ts       # SPRINT_STATUS (planning/active/completed), labels, badge variants, default
│   ├── task-priority.ts       # TASK_PRIORITY, labels, badge variants, colors, weights, default
│   ├── task-status.ts         # TASK_STATUS, labels, badge variants, column colors, order, default
│   └── user-status.ts
│
├── features/
│   ├── auth/
│   │   ├── components/        # SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm
│   │   ├── api.ts, schemas.ts, slice.ts, types.ts, index.ts
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ColorPicker.tsx          # 8-color circle picker with shadcn Button + Tooltip
│   │   │   ├── CreateProjectSheet.tsx   # Slide-over form (RHF + Zod + RTK mutation)
│   │   │   ├── KanbanBoard.tsx          # dnd-kit DnD with optimistic reorder
│   │   │   ├── KanbanColumn.tsx         # Droppable column with SortableContext
│   │   │   ├── MemberManager.tsx        # Inline add/remove members with Select
│   │   │   ├── OverviewTab.tsx          # MemberManager + task stats cards (always visible)
│   │   │   ├── ProjectCard.tsx          # Vertical card layout + skeleton
│   │   │   ├── ProjectDetailPage.tsx    # Breadcrumb + header + overview + tabs (Board/Sprints)
│   │   │   ├── ProjectsEmptyState.tsx   # Empty / no-results states
│   │   │   ├── ProjectsPage.tsx         # Main page — filter tabs, search, list
│   │   │   ├── TaskCard.tsx             # Sortable card with useSortable
│   │   │   ├── TaskSheet.tsx            # Unified create/edit sheet + sprintId Select
│   │   │   └── index.ts
│   │   ├── api.ts             # enhanceEndpoints + injectEndpoints, 6 endpoints (+ getUsers)
│   │   ├── schemas.ts         # createProjectSchema, updateProjectSchema (Zod)
│   │   ├── types.ts           # ProjectWithOwner, ProjectDetailResponse
│   │   └── index.ts
│   ├── sprints/
│   │   ├── components/
│   │   │   ├── SprintCard.tsx           # Status accent border, icons, progress bar
│   │   │   ├── SprintSheet.tsx          # Unified create/edit sheet (discriminated union)
│   │   │   ├── SprintsTab.tsx           # Sprint list with loading/error/empty states
│   │   │   └── index.ts
│   │   ├── api.ts             # 4 endpoints: getByProject, create, update, delete
│   │   ├── schemas.ts         # createSprintSchema (with date cross-validation), updateSprintSchema
│   │   ├── types.ts           # CreateSprintInput, UpdateSprintInput, SprintWithStats
│   │   └── index.ts
│   ├── tasks/
│   │   ├── components/
│   │   │   ├── MyTaskCard.tsx          # Standalone task card (status dot, priority badge, date)
│   │   │   ├── MyTasksPage.tsx         # My Tasks page — useFilterParams, loading/error/empty states
│   │   │   └── index.ts
│   │   ├── api.ts             # 7 endpoints, cross-invalidates Sprints tag
│   │   ├── schemas.ts         # createTaskSchema (+ sprintId), updateTaskSchema
│   │   ├── types.ts           # CreateTaskInput (+ sprintId), UpdateTaskInput, ReorderTasks
│   │   └── index.ts
│   ├── time-entries/
│   │   ├── components/
│   │   │   ├── TimeEntryCard.tsx       # Time, task key/title, dropdown edit/delete with confirmation
│   │   │   ├── TimeEntrySheet.tsx      # Unified create/edit sheet (task select, minutes, date)
│   │   │   ├── TimeTrackerPage.tsx     # Summary stats, filter tabs, search, entry list
│   │   │   └── index.ts
│   │   ├── api.ts             # 4 endpoints: getMy, create, update, delete
│   │   ├── schemas.ts         # createTimeEntrySchema (minutes 1-480), updateTimeEntrySchema
│   │   ├── types.ts           # CreateTimeEntryInput, UpdateTimeEntryInput, TimeEntryWithTask
│   │   └── index.ts
│   └── workload/
│       ├── components/
│       │   ├── MemberWorkloadCard.tsx  # Avatar, task breakdown by status, multi-color progress bar
│       │   ├── WorkloadPage.tsx        # Project filter Select, member workload grid
│       │   └── index.ts
│       ├── api.ts             # 1 endpoint: getWorkload (optional projectId filter)
│       ├── types.ts           # MemberWorkload (user + tasksByStatus + totalTasks)
│       └── index.ts
│
├── hooks/
│   ├── use-filter-params.ts   # Generic URL-synced filter state hook
│   ├── use-mobile.ts
│   └── use-permission.ts
│
├── mocks/
│   ├── fixtures/
│   │   ├── projects.ts        # 5 projects (3 Bob, 2 Diana), 1 archived
│   │   ├── sprints.ts         # 3 sprints across WSP + MOB
│   │   ├── tasks.ts           # 19 tasks across 4 projects (with sprintId)
│   │   ├── time-entries.ts    # 10 entries across users/tasks
│   │   └── users.ts           # 12 users
│   ├── handlers/
│   │   ├── auth.ts            # + GET /api/users (admin/manager)
│   │   ├── projects.ts        # CRUD with inline access checks + withTaskCount
│   │   ├── sprints.ts         # CRUD with max-1-active enforcement
│   │   ├── tasks.ts           # CRUD with sprintId allowlist
│   │   ├── time-entries.ts    # CRUD with owner-only guards
│   │   ├── workload.ts        # Aggregates tasks by assignee
│   │   └── index.ts
│   ├── utils/
│   │   ├── auth.ts            # withAuth, withRole, sanitizeUser (NO withProjectAccess)
│   │   ├── constants.ts       # TTLs, all BASE_URLs
│   │   ├── delay.ts
│   │   ├── jwt.ts
│   │   ├── responses.ts
│   │   └── store-persistence.ts
│   ├── browser.ts
│   └── index.ts
│
├── store/
│   ├── base-api.ts            # Empty tagTypes — features register via enhanceEndpoints
│   ├── base-query.ts
│   ├── index.ts
│   └── local-storage.ts
│
├── types/
│   ├── api.ts                 # ApiSuccessResponse (NO PaginationMeta), ApiErrorResponse, AuthTokens, FieldErrors<T>
│   ├── entities.ts            # SafeUser, Project, Task (with sprintId), Sprint, TimeEntry
│   └── index.ts
│
├── utils/
│   ├── date.ts                # formatDate, formatMinutes, isToday, isThisWeek
│   ├── error.ts
│   ├── permissions.ts
│   ├── redirect.ts
│   ├── roles.ts               # getAllowedRolesForPath() — split from config/roles.ts
│   └── string.ts              # getInitials() — first-letter initials from name words
│
├── index.css
├── DESIGN_TOKENS.md
└── main.tsx
```

### API Endpoints (MSW)

**Auth** (10 endpoints — all functional)
**Projects** (5 endpoints): list, get (with tasks + taskCount), create, update, delete
**Tasks** (7 endpoints): by-project, my-tasks, get, create, update, reorder, delete
**Sprints** (4 endpoints): get-by-project (with taskCount/completedCount), create, update (max 1 active per project), delete (unsets task sprintIds)
**Time Entries** (4 endpoints): get-my (enriched with task key/title), create, update (owner-only), delete (owner-only)
**Users** (1 endpoint): list active users (admin/manager only)
**Workload** (1 endpoint): task distribution by assignee, optional projectId filter

### Fixture Data

- **Users:** 12 (1 admin: Alice, 3 managers: Bob/Diana/Evan, 8 members)
- **Projects:** 5 (WSP, MOB, DSN, AGW active; MKT archived). Bob owns WSP/DSN/MKT, Diana owns MOB/AGW.
- **Tasks:** 19 across 4 active projects. Mixed statuses and priorities. ~5 tasks assigned to sprints.
- **Sprints:** 3 across WSP + MOB projects (1 completed, 1 active, 1 planning).
- **Time Entries:** 10 entries across users/tasks with varying minutes and dates.

---

## Last Working Point

Completed **Week 3** — Sprint planning, time tracker, workload, and member management all functional.

### What's built:

- **Week 1:** Auth flow, role-aware sidebar, guards, all auth forms, landing page, design system
- **Week 2 Day 1:** Constants, entity types, fixtures, MSW handlers (12 endpoints), RTK Query APIs, Zod schemas
- **Week 2 Day 2:** Projects list page — filter tabs (shadcn Button), search (InputGroup), project cards (vertical layout), create project sheet, color picker, empty states, skeletons. Route wired at `/app/projects`.
- **Week 2 Day 3-4:** Project detail page with breadcrumb navigation, header (name, key, status, description, dates), always-visible overview (Members + Task stats cards), Board/Sprints tabs. Kanban board with dnd-kit drag-and-drop, optimistic reorder with cache invalidation. Unified TaskSheet (create/edit via discriminated union props, delete with confirmation). CRUD permissions (PROJECTS_CREATE, TASKS_CREATE) gating create actions. Reusable utilities: PageBreadcrumb, formatDate, getInitials. Hardened MSW task handler with field whitelisting. Refactored RTK Query providesTags to clean named-variable pattern.
- **Week 2 Day 5:** Generic `useFilterParams` hook (URL-synced filter state). ProjectsPage migrated to `useFilterParams`. Query error state added to ProjectsPage, toast on KanbanBoard drag failure. My Tasks page (`/my/tasks`) — `useGetMyTasksQuery` with status/search filters, MyTaskCard component (status dot, priority badge with color, date), loading skeletons, error/empty/no-results states.
- **Week 3 Day 1-2:** Sprint + time entry data layer. Sprint/TimeEntry types on entities.ts, `sprintId` on Task. Sprint constants (status, labels, badge variants). Fixtures for sprints (3) and time entries (10). MSW store collections with full CRUD. Sprint handlers (max 1 active per project, delete unsets task sprintIds). Time entry handlers (owner-only edit/delete, enriched with task key/title). RTK Query APIs + Zod schemas for both features. `sprintId` added to task types, schemas, and handler allowlists. Cross-feature cache invalidation (task mutations invalidate Sprints tag).
- **Week 3 Day 3:** Sprint Planning UI. SprintCard (status accent border, status icons, progress bar colored by status). SprintSheet (unified create/edit with delete confirmation). SprintsTab (list with loading/error/empty states). ProjectDetailPage updated with controlled tabs — "New Task" on Board tab, "New Sprint" on Sprints tab (gated by SPRINTS_MANAGE). TaskSheet extended with sprintId Select field (Backlog + available sprints).
- **Week 3 Day 4:** Time Tracker page (`/my/time`). Date utils (formatMinutes, isToday, isThisWeek). TimeEntryCard (formatted time, task key/title, dropdown with edit/delete + confirmation dialog). TimeEntrySheet (task select from My Tasks, minutes input, date picker). TimeTrackerPage (summary stat cards for Today/This Week, filter tabs All/Today/Week, search, entry list). Route wired.
- **Week 3 Day 5:** Member management — MemberManager component (inline in OverviewTab, add via Select, remove with X button, gated by SPRINTS_MANAGE). GET /api/users handler (admin/manager only). Workload page (`/app/workload`) — MemberWorkloadCard (avatar, task breakdown by status with colored dots, multi-color progress bar), WorkloadPage (project filter Select, grid layout). Route wired.

### Week 3 Decisions

- **Sprint UI:** List-based sprint cards (not timeline/gantt). Card has status-colored left border accent, status icon (CircleDashed/Zap/CheckCircle2), progress bar colored by status.
- **Date input:** Native `<input type="date">` styled with existing Input component — no new dependency.
- **Time tracker:** Manual log form (task + minutes + date + description), not start/stop timer — simpler state model.
- **Member management:** Inline in OverviewTab using Select component for adding members. No separate view.
- **Task → Sprint link:** `sprintId: string | null` on Task entity. null = backlog. TaskSheet has Sprint Select with "Backlog" default.
- **Cross-feature cache invalidation:** All 4 task mutations (create, update, reorder, delete) invalidate `Sprints LIST` tag since sprint stats (taskCount/completedCount) depend on task data.
- **Workload aggregation:** Server-side grouping by assigneeId. Sorted by totalTasks descending. Optional projectId filter via query param.

---

## Next Steps & Open Questions

### Next: Week 4 — Admin features (user management, billing, audit log)

- User management page (CRUD users, role assignment, activation/deactivation)
- Billing page (placeholder/mock data)
- Audit log page (action history)

### Open Questions

- Audit log — what events to track? Just CRUD operations or also auth events?
- Billing — static mockup or interactive mock with plan selection?

---
