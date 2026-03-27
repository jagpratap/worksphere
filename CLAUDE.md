# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context Files

This project has three context documents. Read them in this order when starting work:

1. **CLAUDE.md** (this file) — Commands, enforced conventions, quick reference
2. **docs/PROJECT_CONTEXT.md** — Architecture decisions, roadmap, progress, next steps. **Read this before building any feature** — it contains all resolved decisions and the current working point
3. **docs/METHODOLOGY.md** — The 10-step feature development workflow (Plan → Build → Validate). **Follow this process for every feature**

## Commands

```bash
pnpm dev          # Start dev server (Vite + MSW mock API)
pnpm build        # Type-check then build (tsc -b && vite build)
pnpm lint         # ESLint (antfu config)
pnpm lint:fix     # ESLint with auto-fix
```

No test framework is configured yet.

## Commit Conventions

Husky pre-commit runs `lint-staged` (ESLint fix on `*.{js,jsx,ts,tsx}`). Commit messages validated by commitlint — allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Enforced Code Conventions

### ESLint Rules

- **`type` over `interface`** — `ts/consistent-type-definitions: ["error", "type"]`
- **No `any`** — `@typescript-eslint/no-explicit-any: "error"`
- **Unused vars**: prefix with `_` to keep intentionally
- **Imports**: sorted naturally ascending with newline separation (perfectionist plugin)

### File Naming

- `.tsx` files (components): **PascalCase** (except `src/main.tsx` and `src/components/ui/**`)
- `.ts` files (non-component): **kebab-case**

### Path Alias

`@/` maps to `src/` — use it for all imports.

### UI Components

- **Always use shadcn components for interactive elements** — Button, Input, Select, etc. Never native `<button>`, `<input>`, `<a>` for controls. Native HTML only for layout.
- shadcn/ui primitives: `src/components/ui/` (kebab-case). Shared app components: `src/components/common/`. Class merging: `cn()` from `src/lib/utils.ts`.

### Folder Organization

- **`constants/`** — Domain vocabulary. Business enums, labels, variants. ("Would you copy this to a backend?" → Yes)
- **`config/`** — App wiring. Static frontend-specific data — routes, navigation, role mappings. No logic. ("How is this app configured?")
- **`utils/`** — Pure functions with logic. ("Compute something.")
- **`features/<name>/`** — Feature modules: `api.ts`, `types.ts`, `schemas.ts`, `slice.ts`, `components/`, `index.ts`

### Constants Pattern

`as const` objects with derived union types. Full pattern: values → type → labels → badge variants → colors → default. `ts/no-redeclare` is off to allow same-name const + type (e.g., `ROLES` const + `Role` type).

### Forms

React Hook Form + Zod + `@hookform/resolvers`. Schemas in `src/features/<name>/schemas.ts`. Use `isLoading` from RTK Query mutation for submit state (not RHF `isSubmitting`). Field errors → inline; general errors → toast.

### Design Tokens

Dual fonts: Outfit Variable (headings), Inter Variable (body). Semantic spacing: `--space-page-x`, `--space-page-y`, `--space-section`, `--space-card`, `--space-group`, `--space-inline`. Always use semantic tokens over raw values.

### Development Approach

Build only what the current week needs — no premature files, constants, or utilities. Everything scales by addition, not refactoring.
