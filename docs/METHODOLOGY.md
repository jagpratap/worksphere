# WorkSphere — Development Methodology

> A production-grade, phase-driven workflow for building features incrementally.
> Follow this for every feature, every day, every week.

---

## Why This Methodology?

In professional teams, code is the **last** thing written. Before a single line ships, the team has already agreed on what to build, how the pieces connect, and what the data looks like. This prevents the most expensive kind of waste — building the wrong thing, or building the right thing in the wrong order and having to tear it apart.

This document codifies that discipline into three phases and ten steps. Each step produces a concrete, testable artifact. Each step only depends on completed steps above it. If requirements change mid-build, the blast radius is contained — you never rewrite something that hasn't been built yet.

---

## The Three Phases

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1 — DESIGN & PLANNING          (Think before code)  │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────────┐   │
│  │ Step 1    │→ │ Step 2    │→ │ Step 3                │   │
│  │ Require-  │  │ Low-Level │  │ Fixtures &            │   │
│  │ ments     │  │ Design    │  │ Mock Data             │   │
│  └───────────┘  └───────────┘  └───────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  PHASE 2 — BUILD                 (Bottom-up construction)   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐ │
│  │ Step 4  │→│ Step 5  │→│ Step 6  │→│ Step 7  │→│ S.8 │ │
│  │Constants│ │ API     │ │Schemas  │ │Componen-│ │Wire │ │
│  │& Types  │ │ Layer   │ │& Valid. │ │  ts     │ │     │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────┘ │
├─────────────────────────────────────────────────────────────┤
│  PHASE 3 — VALIDATE & HARDEN         (Make it bulletproof)  │
│  ┌───────────────────┐  ┌───────────────────────────────┐  │
│  │ Step 9             │→ │ Step 10                       │  │
│  │ Integration        │  │ Edge Cases                    │  │
│  │ Walkthrough        │  │ & Polish                      │  │
│  └───────────────────┘  └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — Design & Planning

The goal of this phase is to **eliminate ambiguity before writing code**. Every minute spent here saves ten minutes of debugging later. You should be able to hand the output of Phase 1 to any developer and they could build the feature without asking questions.

---

### Step 1: Requirements Gathering

**Purpose:** Define _what_ the feature does, _who_ uses it, and _what "done" looks like_.

**What you produce:**

- A plain-language description of the feature
- A list of user stories or behaviors (not technical — written from the user's perspective)
- Acceptance criteria for each behavior
- Scope boundaries — what is explicitly _not_ included

**How to do it:**

Start by asking these questions:

1. **Who uses this?** Which roles interact with this feature? What can each role do vs. not do?
2. **What's the happy path?** Walk through the ideal flow from start to finish.
3. **What are the edge cases?** Empty states, maximum limits, permission denials, concurrent actions.
4. **What already exists?** Which existing components, types, or endpoints can this feature reuse?
5. **What's out of scope?** Name the things you're deliberately not building yet.

**Example output:**

```markdown
## Feature: Project Detail Page

### Who uses it:
- Admin: can view and edit any project
- Manager: can view/edit projects they own or belong to
- Member: can view projects they belong to (read-only project info)

### Behaviors:
1. Navigating to /app/projects/:id shows the project detail page
2. Page has three tabs: Overview, Board, Sprints
3. Overview tab shows: project name, description, status, color, owner,
   members list, and task statistics (count by status)
4. If the project doesn't exist → redirect to /app/projects
5. If the user doesn't have access → redirect to role home

### Out of scope:
- Editing project details (that's the existing sheet)
- Sprint tab content (Week 3)
- Member management (Week 3)
```

**Why this matters:** Without clear requirements, you'll build something that _almost_ works, then spend days patching edge cases you didn't think about. Requirements are cheap to change. Code is expensive to change.

---

### Step 2: Low-Level Design (LLD)

**Purpose:** The technical blueprint. Translates requirements into architecture decisions _before_ implementation.

**What you produce:**

- Folder structure for the feature
- Component tree (what renders what, with props)
- Data flow diagram (where state lives, how it moves)
- API contract (request shapes, response shapes, status codes)
- Type definitions (interfaces and enums)
- Key logic or algorithms (filtering, sorting, access control)

**How to do it:**

Work through these areas in order:

#### 2a. Folder Structure

Decide where every file lives before creating any. Follow the project conventions:

| Directory     | Contains                   | Rule of thumb                       |
| ------------- | -------------------------- | ----------------------------------- |
| `constants/`  | Domain vocabulary          | Would you copy this to a backend?   |
| `config/`     | App wiring, static data    | Specific to this frontend, no logic |
| `utils/`      | Pure functions             | Takes inputs, returns results       |
| `features/X/` | Feature-specific code      | Components, API, schemas, types     |
| `components/` | Shared/reusable components | Used by 2+ features                 |
| `types/`      | Shared type definitions    | Used by 2+ features                 |

#### 2b. Component Tree

Draw the hierarchy. Every component should have:

- A clear single responsibility
- Defined props (what data flows in)
- Defined events (what actions flow out)

```
ProjectDetailPage
├── PageHeader (title, breadcrumb, actions)
├── TabNavigation (Overview | Board | Sprints)
├── OverviewTab
│   ├── ProjectInfoCard (name, description, status, color)
│   ├── MembersList (avatars, roles)
│   └── TaskStats (count per status, bar chart)
├── BoardTab
│   ├── BoardFilters (search, priority, assignee)
│   └── KanbanBoard
│       └── KanbanColumn (per status)
│           └── TaskCard (key, title, priority, assignee)
└── SprintsTab (placeholder)
```

#### 2c. Data Flow

Answer these questions:

- Where does the data come from? (RTK Query endpoint, Redux slice, local state)
- Where does derived/computed data live? (selectors, inline computation, memoized)
- How do mutations flow? (form submit → RTK mutation → cache invalidation → re-render)

#### 2d. API Contract

Define every endpoint the feature needs:

```
GET /api/projects/:id
  → 200: { success: true, data: Project (with tasks[], taskCount) }
  → 404: { success: false, error: { code: "NOT_FOUND", message: "..." } }
  → 403: { success: false, error: { code: "FORBIDDEN", message: "..." } }
```

#### 2e. Type Definitions

Write the TypeScript interfaces. These become the contract between every layer:

```typescript
interface Project {
  id: string;
  name: string;
  key: string;
  // ... every field, no ambiguity
}
```

**Why this matters:** The LLD is your map. Without it, you'll make architectural decisions _while_ coding — under pressure, without full context, and you'll make them inconsistently. With it, coding becomes mechanical translation from blueprint to implementation.

---

### Step 3: Fixtures & Mock Data

**Purpose:** Create realistic test data that exercises every state the feature can be in.

**What you produce:**

- Fixture files with typed mock data
- Coverage of: happy path, empty state, error state, boundary values, all roles
- MSW handler logic (if the feature has API endpoints)

**How to do it:**

For every entity the feature touches, create fixtures that cover:

| Scenario           | What to include                            |
| ------------------ | ------------------------------------------ |
| **Happy path**     | 3-5 realistic records with varied data     |
| **Empty state**    | A user/project/context with zero records   |
| **Boundary**       | Max-length names, many items, zero counts  |
| **Permission**     | Records owned by different roles           |
| **Status variety** | At least one record per status/state value |

**Example fixture thinking:**

```
Projects fixture needs:
- 5 projects (covers list view)
- Owned by different managers (tests visibility filtering)
- At least 1 per status: planning, active, completed, archived
- 1 project with zero tasks (empty board state)
- 1 project with tasks in every status (full board state)
- Varying name lengths (tests text overflow)
```

**Why this matters:** Fixtures ARE your test cases. If your fixtures don't cover a state, you'll never test that state. If you discover a missing state during Step 7 (components), you have to backtrack to add fixtures, update handlers, and possibly adjust types — expensive. Get it right here.

---

## Phase 2 — Build (Bottom-Up)

The golden rule: **build in dependency order**. Every step only imports from completed steps. You never write code against an interface that doesn't exist yet.

```
Step 4 (Constants/Types)  ← depends on nothing
Step 5 (API Layer)        ← depends on Step 4
Step 6 (Schemas)          ← depends on Step 4
Step 7 (Components)       ← depends on Steps 4, 5, 6
Step 8 (Wiring)           ← depends on Step 7
```

---

### Step 4: Constants & Types

**Purpose:** Define the vocabulary of the feature. These files have zero dependencies and everything else imports from them.

**What you produce:**

- Constants: enums, labels, badge variants, colors, default values
- Types: TypeScript interfaces for entities, API inputs, API responses

**Pattern for constants files:**

```typescript
// 1. Values (the enum)
export const TASK_STATUS = { ... } as const;

// 2. Type (derived from values)
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

// 3. Labels (human-readable)
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = { ... };

// 4. Badge variants (UI mapping)
export const TASK_STATUS_BADGE_VARIANTS: Record<TaskStatus, BadgeVariant> = { ... };

// 5. Colors (if applicable)
export const TASK_STATUS_COLORS: Record<TaskStatus, string> = { ... };

// 6. Order (if applicable)
export const TASK_STATUS_ORDER: TaskStatus[] = [ ... ];

// 7. Default
export const DEFAULT_TASK_STATUS = TASK_STATUS.TODO;
```

**Validation checkpoint:** At this point you can already verify your data model makes sense. Import your types in a scratch file and try constructing mock objects — do the types feel right? Are any fields missing?

---

### Step 5: API Layer (MSW Handlers + RTK Query)

**Purpose:** Build the mock backend and the client that talks to it. After this step, you have a fully working data round-trip — testable before any UI exists.

**Build order within this step:**

1. **MSW handlers first** — these simulate the server. They read from fixtures, apply business logic (access control, filtering), and return shaped responses.

2. **RTK Query endpoints second** — these call the MSW handlers. They define cache tags, optimistic updates, and data transformations.

**MSW handler pattern:**

```typescript
http.get('/api/projects', withAuth(withRole(['admin', 'manager'], (req) => {
  // 1. Extract params
  // 2. Apply business logic (filtering, access control)
  // 3. Return shaped response
  return success(filteredProjects);
})))
```

**RTK Query pattern:**

```typescript
const projectsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Projects'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getProjects: builder.query<ApiSuccessResponse<Project[]>, void>({
        query: () => '/projects',
        providesTags: (result) =>
          result?.data
            ? [...result.data.map(({ id }) => ({ type: 'Projects' as const, id })),
               { type: 'Projects' as const, id: 'LIST' }]
            : [{ type: 'Projects' as const, id: 'LIST' }],
      }),
    }),
  });
```

**Validation checkpoint:** Open the browser console, call `__mswProjects()` to verify fixture data, then use the RTK Query devtools or `store.dispatch(api.endpoints.getProjects.initiate())` to verify the full round-trip. All this works before Step 7.

---

### Step 6: Schemas & Validation

**Purpose:** Define validation rules for user input. Used by forms (React Hook Form + Zod) and potentially by MSW handlers.

**What you produce:**

- Zod schemas for every form in the feature
- Inferred TypeScript types from schemas
- Resolver setup for React Hook Form

**Pattern:**

```typescript
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum([...]),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
```

**Why separate from types?** Entity types (Step 4) describe _what the server returns_. Schemas describe _what the user submits_. They overlap but aren't identical — the server returns `id`, `createdAt`, `taskCount`; the form never sends those.

---

### Step 7: Components (Leaf → Page)

**Purpose:** Build the UI, starting from the smallest reusable piece and composing upward.

**Build order:**

```
1. Leaf components     (TaskCard, StatusBadge, ColorPicker)
2. Composite components (KanbanColumn, MembersList, FilterBar)
3. Section components   (OverviewTab, BoardTab)
4. Page components      (ProjectDetailPage)
```

**Why bottom-up?**

- Each leaf is testable in isolation — you can render a `TaskCard` without the entire page
- When you build composites, the leaves already work — bugs are in the composition, not the pieces
- When you build the page, everything below it already works — the page is just layout and data wiring

**Component checklist:**

For every component, verify:

- [ ] Uses shadcn/ui for interactive elements (never native `<button>`, `<input>`)
- [ ] Has a loading/skeleton state
- [ ] Has an empty state (if it renders a list)
- [ ] Has an error state (if it fetches data)
- [ ] Handles long text (truncation, wrapping)
- [ ] Respects permissions (hides/disables actions the role can't perform)
- [ ] Uses design tokens (spacing, colors — never raw values)

---

### Step 8: Wiring (Routes, Navigation, Guards)

**Purpose:** Connect the page to the application shell. This is the final step — the feature "lights up" in the app.

**What you do:**

1. **Add the route** to `Router.tsx`
2. **Add navigation entry** to `config/navigation.ts` (with required permission)
3. **Apply guards** — `AuthGuard`, `RoleGuard`, `PermissionGate` as needed
4. **Add path constants** to `config/paths.ts`
5. **Verify sidebar** shows/hides the entry for each role

**Why this is last:** The route is just a thin shell that renders the page component. If the page component works (Step 7), wiring it is trivial. If you wire the route first, you'll be staring at broken pages while building components — demoralizing and hard to debug.

---

## Phase 3 — Validate & Harden

The feature works. Now make it _reliable_.

---

### Step 9: Integration Walkthrough

**Purpose:** Test the complete flow as each role would experience it.

**Walkthrough checklist:**

For **each role** (admin, manager, member):

- [ ] Navigate to the feature — does the page load?
- [ ] Is the navigation entry visible/hidden correctly?
- [ ] Perform the happy path — does everything work end to end?
- [ ] Try to access something forbidden — do you get redirected (not an error)?
- [ ] Submit a form with valid data — does it succeed with correct feedback?
- [ ] Submit a form with invalid data — do inline errors appear?
- [ ] Trigger a server error — does a toast appear?
- [ ] Check optimistic updates — do they apply instantly and roll back on failure?
- [ ] Check cache invalidation — does related data refresh after mutations?

---

### Step 10: Edge Cases & Polish

**Purpose:** Handle everything that isn't the happy path.

**Edge case categories:**

| Category           | Examples                                           |
| ------------------ | -------------------------------------------------- |
| **Empty states**   | No projects, no tasks, no search results, new user |
| **Loading states** | Skeleton screens, disabled buttons during mutation |
| **Error states**   | Network failure, 404, 403, 500, validation errors  |
| **Overflow**       | Long names, many items, deep nesting               |
| **Concurrency**    | Double-click submit, rapid navigation, stale data  |
| **Responsiveness** | Mobile layout, sidebar collapsed, narrow viewport  |
| **Accessibility**  | Keyboard navigation, focus management, ARIA labels |

**Polish checklist:**

- [ ] Every list has an empty state
- [ ] Every async action has a loading indicator
- [ ] Every mutation shows success/error feedback (toast)
- [ ] No layout shift on data load (skeletons match final size)
- [ ] Focus returns to a sensible element after modals/sheets close
- [ ] Tab order is logical
- [ ] Colors meet contrast requirements

---

## Summary — The Complete Flow

Here's the full sequence for building any feature:

```
PLAN     →  1. Requirements    What are we building? For whom?
            2. LLD             How do the pieces connect?
            3. Fixtures        What does the data look like?

BUILD    →  4. Constants       Define the vocabulary
            5. API Layer       Build the data pipeline
            6. Schemas         Define validation rules
            7. Components      Build UI bottom-up
            8. Wiring          Connect to the app

VALIDATE →  9. Walkthrough     Test every role, every flow
           10. Polish          Handle every edge case
```

**At every step, you have something testable:**

| After Step | What you can verify                          |
| ---------- | -------------------------------------------- |
| 4          | Types compile, constants are complete        |
| 5          | Full API round-trip works (console/devtools) |
| 6          | Schemas validate/reject correct inputs       |
| 7          | Components render with real data             |
| 8          | Feature is accessible in the live app        |
| 9          | All roles see the correct experience         |
| 10         | No broken states remain                      |

---

## Anti-Patterns to Avoid

These are the mistakes this methodology prevents:

| Anti-Pattern                 | Why It Hurts                                                        | This Methodology's Answer                                        |
| ---------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Building UI first            | You write components against imagined APIs that don't match reality | Build API layer (Step 5) before components (Step 7)              |
| Defining types as you go     | Types become inconsistent across files, refactoring cascades        | Define all types upfront (Step 4)                                |
| Skipping fixtures            | You test happy path only, edge cases surface in production          | Fixtures force you to think through every state (Step 3)         |
| Wiring routes first          | Broken pages while building, hard to isolate bugs                   | Routes are the last step (Step 8)                                |
| Building "just in case" code | Unused abstractions, premature complexity                           | Build only what current requirements need (Step 1 scope)         |
| Mixing constants and logic   | Unclear imports, circular dependencies                              | Strict folder separation: constants → config → utils             |
| Skipping the design phase    | Architectural decisions made under pressure, inconsistently         | LLD forces decisions upfront when you have full context (Step 2) |

---

## How This Maps to Our Schedule

Each **day** in the roadmap follows this methodology:

- **Planning sessions** (typically the start of a multi-day feature) cover Steps 1–3
- **Build sessions** cover Steps 4–8 (sometimes split across days for larger features)
- **Polish sessions** (typically end-of-week) cover Steps 9–10

For smaller features that fit in a single day, all ten steps happen in one session — but still in order. Never skip a step, even if it's quick.

---

_This methodology is a living document. As we learn what works and what doesn't, we'll refine it — but the core principle never changes: **design before code, build bottom-up, validate everything**._
