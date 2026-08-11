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

Also create the shared utility:

```text
cn()
```

Do not install every shadcn component.

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

# Phase 11 — Technical Verification

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
Final Results
Publish Status
CSV export
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
3. App Shell + Routing
        ↓
4. Shared Components
        ↓
5. API + TanStack Query Foundation
        ↓
6. Service Taxonomy
        ↓
7. Business Profile
        ↓
8. Manual Inputs
        ↓
9. Dashboard
        ↓
10. Final Results
        ↓
11. Responsive / Accessibility Pass
        ↓
12. Final DoD Verification
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
