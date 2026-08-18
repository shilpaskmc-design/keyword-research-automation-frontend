Yes. You should start development now.

Given your documentation and MVP scope, I would build the frontend in **small vertical phases**, so each phase leaves the project in a working state.

# Frontend Development Plan

## Phase 0 — Repository Setup

Goal: make the frontend project ready for actual feature work.

Do:

```text
Vite + React + TypeScript
Tailwind CSS
shadcn/ui
React Router
TanStack Query
React Hook Form
Zod
Lucide React
ESLint
Prettier
```

Also create:

```text
.env.example
VITE_API_BASE_URL=
```

Set up:

```text
src/
├── app/
├── api/
├── components/
├── features/
├── hooks/
├── layouts/
├── lib/
├── styles/
├── types/
└── main.tsx
```

Then verify:

```text
npm run dev
npm run build
npm run lint
```

**Milestone:** blank React application builds successfully.

---

# Phase 1 — Design System Foundation

Do not start feature screens yet.

## 1. Verify Phase 0 Baseline

Confirm and preserve the existing utility structure:

```text
src/lib/utils/cn.ts
src/lib/utils/index.ts
```

Do not create a competing `src/lib/utils.ts` file. Run the available baseline
checks before editing and record any existing failures.

## 2. Load the Primary Font

Inter must actually be available to the application:

```text
Primary font → Inter
Fallback      → system-ui, sans-serif
```

Use one pinned project-managed loading strategy, preferably a pinned Inter font
package. Do not rely on whether Inter is installed on the user's computer.

## 3. Global Styles and Tokens

Create or update:

```text
src/styles/globals.css
tailwind.config.cjs
```

Define product tokens plus the primitive roles required by shadcn/ui:

```text
background, foreground, surface, surface-muted, border
muted, muted-foreground, primary, primary-hover, primary-active
primary-foreground, success, warning, destructive, destructive-foreground, info
input, ring, card, card-foreground, popover, popover-foreground
secondary, secondary-foreground, accent, accent-foreground
```

Map every defined token into Tailwind. Do not define `primary-hover` or
`primary-active` unless they are mapped and used.

Use these concrete radius values:

```text
Small   → 4px
Default → 8px
Large   → 12px
```

Use a minimal typography foundation with the Inter font, base weights, line
heights, and only the scale required by the Design System. Do not invent a
large set of final visual classes while exact values remain deferred.

Focus styles must be visible, keyboard-friendly, and WCAG 2.1 AA compatible.

Set up:

```text
Tailwind design tokens
Global typography
Primary / neutral / semantic colors
Border radius
Spacing conventions
Focus styles
```

Install only the shadcn primitives currently needed:

```text
Button
Input
Textarea
Select
Dialog
AlertDialog
Tabs
Badge
Tooltip
Skeleton
Label
Checkbox
Dropdown Menu
Separator
```

Verify the existing shared utility:

```text
src/lib/utils/cn.ts
src/lib/utils/index.ts
```

Verify that `cn()` uses the already installed:

```text
clsx
tailwind-merge
```

Do not create `src/lib/utils.ts`.

Use one pinned shadcn CLI version or the project-approved generation workflow.
Add exactly the 14 listed primitives and allow only their required transitive
dependencies. Review `package.json` and `package-lock.json` afterward.

Do not install every shadcn component.

Create a temporary development-only preview at:

```text
src/dev/DesignSystemPreview.tsx
```

Temporarily render it from `App.tsx` while keeping `App.tsx` small. Demonstrate
the listed primitives and important states without product workflows or mock
business data. Remove the preview hookup before Phase 2.

Verify at `375px`, `768px`, `1024px`, and `1440px`:

```text
Visible focus
Keyboard operation
Readable contrast
Responsive dialogs
Readable disabled states
No unintended page overflow
No clipped text
```

Run the configured checks:

```text
npm run typecheck
npm run lint
npm run build
npm run format:check when configured
```

Also verify that no feature screens, API calls, business rules, or generated
API changes were added.

**Milestone:** core UI primitives visually match the Design System.

---

# Phase 2 — Application Shell

Build the common application structure.

Create:

```text
App.tsx
router.tsx
providers.tsx
AppLayout.tsx
AppNavigation.tsx
PageHeader.tsx
```

Configure routes:

```text
/
 /final-results
 /manual-inputs
 /business-profile
 /service-taxonomy
```

Also implement:

```text
Skip to main content
Active navigation
Responsive navigation
404 fallback
```

At this stage, each route can render a simple placeholder page.

**Milestone:** all five screens can be navigated between.

---

# Phase 3 — Shared Application Components

Create only the components that are clearly shared:

```text
SearchInput
FilterSelect
StatusBadge
EmptyState
ErrorState
LoadingState
ConfirmDialog
Pagination
SectionHeader
DataTableShell
```

Do **not** build feature-specific components yet.

Also avoid building one giant generic DataTable.

**Milestone:** shared UI infrastructure is ready for features.

---

# Phase 4 — API Foundation

This should happen before serious screen development.

Create:

```text
src/api/
├── generated/
├── client.ts
└── errors.ts
```

Implement:

```text
Shared API Client
JSON request handling
Non-JSON/file response handling
Normalized API errors
VITE_API_BASE_URL handling
AbortSignal support
```

Then generate OpenAPI types using the approved project workflow.

The repository should provide:

```text
npm run generate:api-types
```

If that script is not available, use the exact `openapi-typescript` version
pinned by the project. Do not use an unpinned `npx openapi-typescript` command.

Configure TanStack Query:

```text
QueryClient
QueryClientProvider
Default retry behaviour
```

**Milestone:** frontend can make one typed request to the backend successfully.

---

# Phase 5 — First Vertical Slice: Service Taxonomy

I recommend starting here because it is **read-only** and has the lowest business risk.

Implement end-to-end:

```text
API function
    ↓
TanStack Query hook
    ↓
Types/mapping if required
    ↓
Service Taxonomy page
    ↓
Search
    ↓
Expand/Collapse
    ↓
Responsive behaviour
    ↓
Loading/Error/Empty states
```

Components:

```text
TaxonomyToolbar
ServiceAreaList
ServiceAreaCard
ServiceOfferingList
ServiceOfferingItem
ExpandCollapseAllButton
```

Taxonomy search is client-side over the complete hierarchy returned by the
read-only endpoint; the current public API does not provide a taxonomy search
endpoint.

Why first?

Because it validates almost your entire frontend foundation without mutations, forms, or complicated workflow state.

**Milestone:** first production-quality screen complete.

Run the relevant Definition of Done checklist before moving on.

---

# Phase 6 — Business Profile

Next build the simpler CRUD feature.

Implement:

```text
List Categories
List Entries
Add Category
Add Entry
Delete Category
Delete Entry
Expand/Collapse entries
```

Build:

```text
BusinessProfileCategoryList
BusinessProfileCategoryCard
BusinessProfileEntryList
BusinessProfileEntry
AddEntryInput
AddCategoryDialog
DeleteCategoryDialog
```

Focus on:

```text
Mutation invalidation
Confirmation behaviour
Backend validation
Error preservation
```

**Milestone:** CRUD/query/mutation architecture proven.

---

# Phase 7 — Manual Inputs

This introduces more complex forms and file upload.

Implement:

```text
Manual Input list
Ready count
Search
Status filter
Source filter
Pagination
Add Manual Input
Additional Details editor
Excel upload
Invalid records
Upload result summary
```

Build:

```text
ManualInputReadySummary
ManualInputsToolbar
ManualInputsTable
ManualInputStatusBadge
AddManualInputDialog
AddManualInputForm
AdditionalDetailsEditor
UploadExcelDialog
UploadResultSummary
ManualInputValidationInfo
```

This phase should validate:

```text
React Hook Form
Zod
Binary XLSX request handling
Field error mapping
Partial upload result handling
```

**Milestone:** form and upload architecture complete.

---

# Phase 8 — Dashboard

Now implement the operational workflow.

Build:

```text
ManualInputSummary
StartPipelineButton
ManualInputReminderDialog
PipelineStatusCard
PipelineStageProgress
PipelineStageItem
LatestPipelineRunCard
RecentPipelineRunsTable
```

Then implement:

```text
Start Pipeline
202 → queued
409 conflict handling
Pipeline polling
Stage state display
Terminal-state detection
Latest completed run
Recent runs
Navigation to Final Results
```

Polling rule:

```text
queued / running
→ continue polling

completed / partial / failed / abandoned
→ stop polling
```

Do not create fake progress percentages.

The Dashboard may initially link to the Final Results route/query contract
before the full Final Results screen is implemented in Phase 9.

**Milestone:** pipeline lifecycle works from the frontend.

---

# Phase 9 — Final Results

I would deliberately build this last because it is the most data-heavy screen.

Implement in this order:

### 9.1 Latest Results

```text
Latest run
Result table
Search
Filters
Publish Status
Expandable text
```

### 9.2 Open Items

```text
Previous-run unfinished results
Pending / Approved scope
```

### 9.3 History

```text
History tab
Pagination
Filtering
Historical run filter
Dashboard deep-link
URL state
```

### 9.4 Export

```text
CSV Export
Current filters/scope
All matching rows
413 export-limit handling
Browser download
```

Use the exact backend error code:

```text
FINAL_RESULT_EXPORT_LIMIT_EXCEEDED
```

Build:

```text
FinalResultsTabs
FinalResultsToolbar
FinalResultsTable
PublishStatusSelect
FinalResultStatusBadge
UrgencyBadge
ExpandableTableText
LatestRunResultsSection
OpenItemsSection
HistoryResultsSection
ActiveRunFilterNotice
ExportCsvButton
```

**Milestone:** complete MVP feature set.

---

# Phase 10 — Cross-Screen Quality Pass

Do not treat this as cosmetic cleanup.

Go screen by screen and verify:

```text
375px
768px
1024px
1440px
```

Check:

```text
Keyboard navigation
Focus order
Dialogs
Table scrolling
Accessible labels
aria-expanded
Live regions
Loading states
Filtered-empty states
Error states
Long text
Unknown backend values
Null values
Skip-to-main-content link
Live-region behaviour
Accessible toast behaviour
Small-screen table row actions
```

---

# Phase 11C — Frontend Single-User Authentication

Add a minimal authentication flow for the single marketing user. This is
authentication and session protection only; it is not role-based access
control.

Use a stable per-session CSRF token, initialize the canonical auth session
query directly from the successful login response, and restore sessions with
`GET /api/v1/auth/session` only on startup/recovery. Preserve safe internal
requested routes in React Router state, use one AuthGate above AppLayout, and
clear protected query data when authentication ends. The shared API client owns
`credentials: include`, centralized CSRF injection, and idempotent auth-event
callbacks without importing React auth components.

The backend must define the authentication mechanism, session/token shape,
expiry behaviour, login/logout endpoints, and unauthorized response contract
before frontend implementation begins. Use the approved OpenAPI contract and
do not infer auth behaviour from local storage or mock data.

Implement:

```text
Login screen
Authenticated application shell
Session restore on refresh when supported
Logout
Unauthorized/expired-session handling
```

Requirements:

* [ ] One user/account only for MVP.
* [ ] No roles, permissions, role guards, invitations, teams, or admin
  management.
* [ ] No secrets embedded in the frontend or VITE_* variables.
* [ ] Use the backend-approved secure session/token approach.
* [ ] Do not persist sensitive credentials in plain browser storage.
* [ ] Prevent unauthenticated access to application routes.
* [ ] Handle expired sessions without leaving stale confirmed UI state.
* [ ] Keep login, logout, loading, validation, network-error, and
  unauthorized states accessible and responsive.
* [ ] Ensure every authenticated API request uses the shared API client.

If the backend authentication contract is not available by this phase, stop at
the contract/design step; do not implement a frontend-only approximation.

**Milestone:** the single marketing user can securely sign in, use the
application, restore a supported session, and sign out.

Local-development origin rule:

```text
Frontend browser: http://localhost:5173
VITE_API_BASE_URL: http://localhost:8000
Backend CORS_ORIGINS: ["http://localhost:5173"]
```

Do not mix `localhost` and `127.0.0.1`. They are different browser sites, and
the development `SameSite=Lax` session cookie will not persist correctly across
that mixed-host login flow.

---

# Phase 12 — Pipeline Scheduling

## Phase 12B — Frontend Pipeline Scheduling

> **Status:** Implemented; authenticated manual verification pending
> **Scope:** Frontend only
> **Integration location:** Existing Dashboard pipeline area

Add one-future-run scheduling beside the existing Dashboard **Start Pipeline**
action. Do not create a Pipeline page, Scheduler page, duplicate Start Pipeline
action, or scheduler-specific execution progress UI.

Use only the approved endpoints:

```text
POST   /api/v1/pipeline/schedules
GET    /api/v1/pipeline/schedules/current
DELETE /api/v1/pipeline/schedules/{schedule_id}
```

Replacement reuses `POST /api/v1/pipeline/schedules`. The backend remains
authoritative for validation, replacement/cancellation conflicts, lifecycle
transitions, and the reason an active schedule disappears.

### Architecture

* [x] Integrate Schedule/Change beside the existing Start action through
  `PageHeader.actions`; reuse the existing Start component and handler.
* [x] Keep schedule API, query, time, and error utilities under the pipeline
  feature; keep Dashboard-specific schedule UI under the Dashboard feature.
* [x] Use generated OpenAPI request/response types and the shared authenticated
  API client. Do not add raw fetch, another client, or scheduler-specific auth,
  cookie, or CSRF state.
* [x] Use dedicated schedule query keys. Do not store schedule data under the
  canonical execution key `['pipeline', 'latest']`.

### Current schedule and mutations

* [x] GET current exposes a localized loading/error/success state. Only a
  successful `data = null` response may show the empty state and Schedule
  action. Loading/error must not masquerade as no schedule.
* [x] Poll GET current every 30 seconds while an active schedule exists.
* [x] Create and replace use the same Date/Time dialog and POST mutation.
* [x] Cancel requires the existing confirmation primitive and backend success.
  Do not place the cancelled DELETE response in the current-schedule cache;
  refetch GET current and wait for confirmed `null`.
* [x] Prevent duplicate create, replace, and cancel submissions and preserve
  form values after failed requests.

### Fixed timezone handling

The user-facing scheduling timezone is always `Asia/Kolkata (IST)`.

* [x] Construct requests centrally as strict, validated
  `YYYY-MM-DDTHH:mm:ss+05:30` values. Never use
  `new Date(`${date}T${time}`)` for request construction and never send a naive
  datetime.
* [x] Reject impossible calendar/time combinations before submission and
  compare the parsed explicit-offset instant with `Date.now()`.
* [x] Format backend timestamps and pre-populate replacement fields with
  `Intl.DateTimeFormat({ timeZone: 'Asia/Kolkata' })`, independent of the
  browser timezone.
* [ ] Verify non-IST browser behavior and UTC/IST midnight date rollover.

### Lead time and cutoff

* [x] Enforce the documented five-minute minimum locally for UX while keeping
  backend validation authoritative.
* [x] Disable Change and Cancel during the final minute using a lightweight
  local UI-only timer. Recalculate when the schedule changes, when the document
  becomes visible, and when window focus returns; clean up timers on change or
  unmount.
* [x] The local timer must never trigger a pipeline or mutate backend state.
* [x] Handle backend cutoff races for both replacement POST and cancellation
  DELETE through stable `ApiError` codes and refetch current state.

### Transition and placement

* [x] Place schedule loading, error, empty, and current-card content in a
  compact section below the PageHeader, not inside `PageHeader.actions`.
* [x] On a previous successful non-null schedule changing to successful null,
  invalidate the exported canonical `['pipeline', 'latest']` query key. Recent
  execution data may also be refreshed when required by the existing Dashboard.
* [x] Do not infer triggered, skipped, failed, or cancelled from disappearance;
  let the existing execution UI display only backend-proven state.
* [x] A future schedule must not disable Start Pipeline by itself.

### Verification

* [ ] Verify create, refresh persistence, replace, cancel, replacement cutoff,
  cancellation cutoff, and schedule-disappearance flows against the backend.
* [ ] Verify keyboard/focus behavior and responsive layouts at 375, 768, 1024,
  and 1440 pixels with no page-level horizontal overflow.
* [x] Run configured API generation, typecheck, lint, format-check, and build
  commands. Do not claim tests passed: this repository currently has no
  configured frontend test script or test framework, and adding one requires
  separate approval.

**Milestone:** the marketing user can start now or create, view, replace, and
cancel one future IST schedule from the Dashboard while scheduling remains
backend-authoritative.

---

# Phase 13 — Technical Verification

Run:

```text
TypeScript check
ESLint
Production build
Relevant tests
```

Run each check only after its corresponding project script and tooling have
been configured. Do not claim a check passed if it was not run.

Then manually verify each major flow:

```text
Service Taxonomy
Business Profile
Manual Inputs
Pipeline start/progress
Pipeline scheduling
Final Results
Publish Status
CSV export
Single-user login/session/logout
```

Use `docs/definition-of-done.md` as the final checklist.

---

# Recommended Implementation Order

So the actual build order I recommend is:

```text
1. Project Setup
        ↓
2. Design System Foundation
        ↓
3. Single-user authentication
        ↓
4. App Shell + Routing
        ↓
5. Shared Components
        ↓
6. API + TanStack Query Foundation
        ↓
7. Service Taxonomy
        ↓
8. Business Profile
        ↓
9. Manual Inputs
        ↓
10. Dashboard
        ↓
11. Final Results
        ↓
12. Pipeline scheduling
        ↓
13. Responsive / Accessibility Pass
        ↓
14. Final DoD Verification
```

## Important rule while building

Do **not** try to create every component, hook, type, and abstraction before building the first screen.

Use this pattern repeatedly:

```text
Read relevant docs
        ↓
Inspect existing code
        ↓
Implement one vertical slice
        ↓
Verify it
        ↓
Review diff and preserve a clean checkpoint
        ↓
Move to next slice
```

Do not commit or push unless explicitly authorized.

That will give you much better control than trying to build the entire architecture upfront.

I would now begin with **Phase 0 — Repository Setup**, and keep each implementation task small enough that Codex/Antigravity can complete and verify it independently.
