# Keyword Research Automation — Frontend

Internal marketing-operations interface for preparing keyword-research inputs,
running or scheduling the pipeline, monitoring progress, and reviewing the
resulting content recommendations.

The application is a React and TypeScript client for the companion FastAPI
backend repository: `../keyword-research-automation`.

## Features

- Single-user, cookie-session authentication
- Dashboard for starting, scheduling, and monitoring pipeline runs
- Scheduling one future pipeline run in the `Asia/Kolkata` timezone
- Reviewing, filtering, updating publish status, and exporting Final Results as CSV
- Manual Input creation and CSV/XLSX upload
- Business Profile maintenance
- Read-only Service Taxonomy browsing
- Responsive application shell with keyboard-accessible dialogs and controls

## Technology

- React 18 and TypeScript
- Vite 6
- React Router
- TanStack Query
- React Hook Form and Zod
- Tailwind CSS
- shadcn/ui and Radix UI primitives
- OpenAPI-generated API types

## Prerequisites

- Node.js supported by Vite 6 (Node.js 20 LTS is recommended)
- npm

The frontend requires the companion FastAPI backend running at
`http://localhost:8000`. See the backend repository for backend installation,
database setup, migrations, authentication, and startup instructions.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create the local environment file

```bash
cp .env.example .env
```

The expected configuration is:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

The backend must allow the frontend development origin through CORS:

```json
["http://localhost:5173"]
```

### 3. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

> [!IMPORTANT]
> Use `localhost` for both applications during local development. Do not open
> one application through `localhost` and the other through `127.0.0.1`.
> They are different browser sites, and mixing them prevents the development
> `SameSite=Lax` session cookie from being persisted correctly.

## Available Commands

| Command                      | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `npm run dev`                | Start the Vite development server                                    |
| `npm run generate:api-types` | Regenerate frontend types from the approved backend OpenAPI snapshot |
| `npm run typecheck`          | Run the TypeScript check without emitting files                      |
| `npm run lint`               | Run ESLint with zero warnings allowed                                |
| `npm run format`             | Format repository files with Prettier                                |
| `npm run format:check`       | Check formatting without modifying files                             |
| `npm run build`              | Type-check and create a production build in `dist/`                  |
| `npm run preview`            | Preview the production build locally                                 |

There is currently no configured frontend automated-test script or test
framework. Do not report automated tests as passing unless one is intentionally
introduced and configured.

## API Contract and Generated Types

The backend owns business rules, validation, lifecycle transitions, error
codes, and the public API contract.

The approved OpenAPI source is:

```text
../keyword-research-automation/docs/openapi/public-openapi.json
```

Generate the frontend API definitions with:

```bash
npm run generate:api-types
```

Generated definitions are written to:

```text
src/api/generated/schema.d.ts
```

Do not edit generated files manually. Feature code should access the backend
through the shared authenticated client in `src/api/client.ts`, not through raw
`fetch()` calls in components.

## Authentication

Authentication is provided and administered by the backend. The frontend only
submits login requests, maintains authenticated UI state, and handles expired
sessions.

The MVP frontend behavior is intentionally single-user:

- no signup flow;
- no roles or role-based access control;
- no browser storage of session credentials;
- the backend session cookie is `HttpOnly`;
- CSRF protection is handled centrally by the authentication provider and
  shared API client;
- application routes are protected by `AuthGate`;
- a `401` response clears stale authenticated UI state and returns the user to
  login.

The frontend does not create users, reset passwords, or configure backend
authentication.

## Project Structure

```text
src/
├── api/                 # Shared API client, normalized errors, generated types
├── app/                 # Router and application providers
├── components/
│   ├── shared/          # Reusable application components
│   └── ui/              # shadcn/Radix UI primitives
├── features/
│   ├── auth/
│   ├── business-profile/
│   ├── dashboard/
│   ├── final-results/
│   ├── manual-inputs/
│   ├── pipeline/
│   └── service-taxonomy/
├── layouts/             # Authenticated application shell
├── lib/                 # Shared infrastructure utilities
└── styles/              # Global styles and design tokens
```

Feature data flow follows:

```text
Page
  → Feature Component
  → Feature Hook
  → Feature API Function
  → Shared API Client
  → Backend
```

TanStack Query owns server state. React local state is used for temporary UI
state such as dialogs and form interactions.

## Primary Routes

| Route               | Screen                                     |
| ------------------- | ------------------------------------------ |
| `/login`            | Single-user login                          |
| `/`                 | Dashboard and pipeline operations          |
| `/final-results`    | Latest, open, and historical Final Results |
| `/manual-inputs`    | Manual Input management and upload         |
| `/business-profile` | Business Profile maintenance               |
| `/service-taxonomy` | Read-only Service Taxonomy                 |

## Pipeline Scheduling

The Dashboard supports two independent actions:

```text
Start Pipeline     → run now
Schedule Pipeline  → run later
```

Scheduling uses a fixed `Asia/Kolkata (IST)` timezone and submits explicit
timezone-aware values. The backend remains authoritative for minimum lead time,
replacement, cancellation, cutoff rules, and trigger lifecycle. The browser
never triggers the pipeline on a timer; it only observes backend state.

## Verification Before Handoff

Run the configured checks:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Then manually verify the affected workflow, keyboard behavior, and responsive
layouts at representative widths:

```text
375px
768px
1024px
1440px
```

Use [`docs/definition-of-done.md`](docs/definition-of-done.md) as the final
frontend checklist.

API type generation is a separate update step because it modifies
`src/api/generated/schema.d.ts`. Run `npm run generate:api-types` whenever the
approved backend OpenAPI snapshot changes, review the generated diff, and
include the updated generated file with the corresponding frontend contract
change.

## Contributing

Before submitting frontend changes:

1. Read [`AGENTS.md`](AGENTS.md) and the documents relevant to the affected
   feature.
2. Keep API access behind feature API functions and the shared client.
3. Do not manually edit files under `src/api/generated/`.
4. Run the configured typecheck, lint, format check, and production build.
5. Manually verify the affected workflow, responsive behavior, and keyboard
   accessibility where applicable.

Frontend architecture, API, design, UX, responsive, accessibility, and
completion decisions are documented under [`docs/`](docs/). Generated API
definitions should be included when an approved OpenAPI contract change causes
them to change.

## Troubleshooting

### CORS errors

Confirm that the backend allows the exact frontend origin:

```text
http://localhost:5173
```

Origins include the scheme, hostname, and port. A similar-looking origin is not
equivalent.

### Incorrect API base URL

Confirm `.env` contains:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Restart the Vite development server after changing environment variables.

### Login succeeds but the session request returns `401`

Open both applications through `localhost`. Mixing `localhost` and
`127.0.0.1` causes the development session cookie to be rejected because they
are different browser sites.

### Backend unavailable

Confirm the companion backend is running at `http://localhost:8000`. Backend
installation and runtime troubleshooting belong to the backend repository.

### Generated API types are out of date

With both repositories in the expected sibling layout, run:

```bash
npm run generate:api-types
```

Review the generated changes in `src/api/generated/schema.d.ts`; never edit that
file manually.

## Documentation

Start with:

- [`AGENTS.md`](AGENTS.md) — mandatory repository rules for coding agents
- [`docs/frontend-architecture.md`](docs/frontend-architecture.md)
- [`docs/api-contract.md`](docs/api-contract.md)
- [`docs/design-system.md`](docs/design-system.md)
- [`docs/ux-behaviour-rules.md`](docs/ux-behaviour-rules.md)
- [`docs/responsive-and-accessibility-guidelines.md`](docs/responsive-and-accessibility-guidelines.md)
- [`docs/frontend-implementation-plan.md`](docs/frontend-implementation-plan.md)
- [`docs/definition-of-done.md`](docs/definition-of-done.md)

## Production Build

Create the optimized static build with:

```bash
npm run build
```

The output is written to `dist/`. Configure the production web server to:

- serve the `dist/` assets;
- fall back to `index.html` for client-side routes such as `/final-results` and
  `/business-profile`;
- provide the production backend origin through `VITE_API_BASE_URL` at build
  time;
- use an HTTPS deployment and backend cookie/CORS settings appropriate for the
  final frontend origin.

Never place secrets in `VITE_*` variables—Vite exposes them to browser code.
