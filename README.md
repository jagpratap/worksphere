# WorkSphere

**[Live Demo](https://worksphere-eta.vercel.app/)**

A role-based project management SaaS application — think lightweight Jira meets Notion. Built as a frontend-complete demo with a fully mocked API layer.

## Tech Stack

- **React 19** + TypeScript + Vite
- **Redux Toolkit** + RTK Query (data fetching & caching)
- **React Router v7** (file-based lazy routes, role guards)
- **React Hook Form** + Zod (form validation)
- **shadcn/ui** + Tailwind CSS v4 (component library)
- **dnd-kit** (drag-and-drop kanban board)
- **MSW 2.x** (mock API with localStorage persistence)

## Features

### Authentication & Authorization
- Role-based access control (Admin / Manager / Member)
- Sign in, sign up, forgot/reset password flows
- Route guards with automatic redirects

### Project Management
- Create, edit, archive projects
- Kanban board with drag-and-drop task reordering
- Project overview with member management

### Task Management
- Full CRUD with status, priority, assignee, sprint assignment
- URL-synced filters (status, priority, assignee, search)
- My Tasks page with personal task view

### Sprint Planning
- Create sprints with date ranges, goals, and status tracking
- Progress bars with task completion stats
- Max one active sprint per project enforcement

### Time Tracking
- Log time entries against tasks (manual entry)
- Daily/weekly summary stats
- Filter and search entries

### Team Workload
- Visual task distribution per team member
- Status breakdown with colored progress bars
- Filter by project

### Coming Soon
- Admin Dashboard analytics & charts
- User management (CRUD)
- Billing & subscription management
- Audit log viewer
- Real-time notifications
- Profile & settings pages
- Advanced reporting

## Mock API

This app runs entirely in the browser using **MSW (Mock Service Worker)**. No backend server needed. Data persists in `localStorage` — clear it to reset to fixture data.

### Test Credentials

All accounts use password: `password123`

| Role | Email | Access |
|------|-------|--------|
| Admin | `admin@worksphere.dev` | Full system access |
| Manager | `bob@worksphere.dev` | Projects, sprints, workload |
| Member | `carol@worksphere.dev` | My tasks, time tracker |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and sign in with any test credential above.

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Type-check + production build
pnpm lint         # Run ESLint
pnpm lint:fix     # ESLint with auto-fix
```

## Project Structure

```
src/
├── app/            # Router, layouts, guards, route pages
├── components/     # ui/ (shadcn), common/ (shared app components)
├── config/         # Paths, navigation, roles, permissions, env
├── constants/      # Business enums, labels, variants
├── features/       # Feature modules (auth, projects, tasks, sprints, etc.)
├── lib/            # Utility wrappers (cn, utils)
├── mocks/          # MSW handlers, fixtures, store persistence
├── store/          # Redux store configuration
├── types/          # Shared entity types
└── utils/          # Pure helper functions
```
