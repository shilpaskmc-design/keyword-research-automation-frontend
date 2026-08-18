# Implementation Plan — Phase 3: Shared Application Components

> [!info] Document Status
> **Status:** Approved for implementation
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Build the reusable application-level presentation components required by multiple upcoming feature screens without introducing backend integration, feature business logic, or premature generic abstractions.

---

# 1. Goal

Create the shared application components that provide consistent patterns for:

```text
Search
Filtering
Status display
Loading
Empty states
Errors
Confirmation
Pagination
Section headings
Table containers
```

The component layer should follow:

```text
Feature Page / Component
        ↓
Shared Application Component
        ↓
shadcn/ui Primitive
        ↓
Tailwind / Design Tokens
```

Shared components must remain presentation-oriented and must not call feature APIs or contain backend business rules.

---

# 2. Current Baseline

Completed:

```text
Phase 0 — Repository Setup
Phase 1 — Design System Foundation
Phase 2 — Application Shell
```

Existing shared application components:

```text
src/components/shared/
├── AppNavigation.tsx
└── PageHeader.tsx
```

Existing UI primitives include the approved shadcn foundation:

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
DropdownMenu
Separator
```

Do not replace or duplicate these primitives.

The Component Inventory identifies the following shared application components:

```text
PageHeader
AppNavigation
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

`PageHeader` and `AppNavigation` already exist from Phase 2.

---

# 3. Sharing Rule

Before implementing any shared component, confirm:

```text
It is used by multiple features
AND
Its behavior is generic
AND
It does not know feature-specific business rules
```

Keep a component feature-specific when it:

```text
Knows backend statuses
Calls feature APIs
Owns feature workflow
Exists only for one screen
```

The components listed in this phase are already approved as shared application components in `docs/component-inventory.md` and have concrete use across the documented MVP screens.

This phase may create those approved components before feature implementation. Do not create additional speculative shared abstractions.

For components outside this approved list, the preferred reuse strategy remains:

```text
Build locally
    ↓
Observe real reuse
    ↓
Extract shared abstraction
```

Avoid large speculative abstractions.

---

# 4. Explicit Scope

Create or complete:

```text
src/components/shared/
├── AppNavigation.tsx       # existing — preserve
├── PageHeader.tsx          # existing — preserve
├── SearchInput.tsx
├── FilterSelect.tsx
├── StatusBadge.tsx
├── EmptyState.tsx
├── ErrorState.tsx
├── LoadingState.tsx
├── ConfirmDialog.tsx
├── Pagination.tsx
├── SectionHeader.tsx
└── DataTableShell.tsx
```

Do not create additional shared components unless a concrete requirement is discovered during implementation.

---

# 5. Explicitly Out of Scope

Do not implement:

```text
Backend API client
Generated API models
Feature API functions
TanStack Query feature hooks
Feature mutations
Dashboard pipeline logic
Final Results tables
Manual Inputs tables
Business Profile CRUD
Service Taxonomy UI
Search business logic
Filter business rules
Status mappings
Pagination API behavior
Table column definitions
Sorting logic
Authentication
Toast infrastructure
New product screens
```

Do not modify backend code.

---

# 6. Step 1 — Verify Current Baseline

Before editing, read:

```text
AGENTS.md
docs/component-inventory.md
docs/frontend-architecture.md
docs/design-system.md
docs/ux-behaviour-rules.md
docs/responsive-and-accessibility-guidelines.md
docs/coding-standards.md
docs/definition-of-done.md
```

Inspect:

```text
src/components/shared/
src/components/ui/
src/styles/globals.css
tailwind.config.cjs
src/lib/utils/cn.ts
```

Confirm Phase 2 behavior remains intact.

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Record any pre-existing failure before implementation.

---

# 7. Step 2 — Create SearchInput

Create:

```text
src/components/shared/SearchInput.tsx
```

`SearchInput` is intended for:

```text
Final Results
Manual Inputs
Service Taxonomy
```

Its shared responsibilities are:

```text
Search value
Search input presentation
Search icon
Clear action
Accessible label/name
Optional placeholder
```

The inventory explicitly keeps search behavior feature-owned.

Therefore, `SearchInput` must not own:

```text
Backend requests
Query parameters
Search API behavior
Result filtering
Feature-specific debounce duration
URL state
```

Suggested prop shape:

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
}
```

Do not introduce debounce behavior inside the shared component unless later implementation demonstrates genuine shared need.

---

# 8. Step 3 — Create FilterSelect

Create:

```text
src/components/shared/FilterSelect.tsx
```

Expected reuse includes:

```text
Urgency
Publish Status
Manual Input Status
Manual Input Source
```

The shared component owns:

```text
Consistent select presentation
Label
Current selection
Available display options
Default / clear option
Disabled state
```

Feature code owns:

```text
Backend enum values
Business meaning
Filter query parameters
URL synchronization
Server refetching
```

Keep the API generic and typed.

Example concept:

```typescript
interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterSelectProps<T extends string> {
  label: string;
  value?: T;
  options: FilterOption<T>[];
  onValueChange: (value: T | undefined) => void;
  clearLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

If a clear/default option is rendered through the Radix Select primitive, the shared component may use a private non-empty sentinel internally.

The sentinel must never be passed to feature code. Selecting it must call:

```typescript
onValueChange(undefined)
```

Associate the visible label with the Select trigger using a stable supplied or generated `id`.

Do not over-generalize beyond current use cases.

---

# 9. Step 4 — Create StatusBadge

Create:

```text
src/components/shared/StatusBadge.tsx
```

`StatusBadge` is a visual component only.

It may be reused for:

```text
Pipeline execution
Pipeline stage
Manual Input
Other generic status presentation
```

The owning feature must provide:

```text
Display label
Visual variant
Optional icon if justified
```

The component must not own:

```text
Backend status → label mappings
Allowed status transitions
Business eligibility
Feature-specific fallback logic
```

The Component Inventory explicitly requires status mappings to remain feature-owned.

Suggested visual variants may include generic semantic roles such as:

```text
neutral
info
success
warning
destructive
```

Do not name shared variants after backend states such as:

```text
queued
running
approved
published
rejected
```

Those mappings belong to features.

---

# 10. Step 5 — Create EmptyState

Create:

```text
src/components/shared/EmptyState.tsx
```

Support:

```text
Title
Description
Optional icon
Optional action
```

It should support generic cases such as:

```text
No data exists
No results match filters
No open work
```

Suggested props:

```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}
```

Do not encode feature-specific messages inside the component.

---

# 11. Step 6 — Create ErrorState

Create:

```text
src/components/shared/ErrorState.tsx
```

Support:

```text
Title
User-safe description
Optional Retry action
```

The component must never display:

```text
Raw backend errors
Stack traces
Database information
Internal implementation details
```

The Component Inventory defines ErrorState as a generic safe error presentation with optional retry.

Suggested props:

```typescript
interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
}
```

The owning feature remains responsible for translating API errors into safe presentation text.

---

# 12. Step 7 — Create LoadingState

Create:

```text
src/components/shared/LoadingState.tsx
```

Support generic local loading presentation using:

```text
Skeleton
Loading text
Optional spinner where appropriate
```

Loading should be shown at the smallest meaningful section rather than using a global application overlay.

Do not make `LoadingState` aware of:

```text
Query keys
TanStack Query
Pipeline execution
API status
Feature state
```

Suggested props may include:

```typescript
interface LoadingStateProps {
  label?: string;
  rows?: number;
}
```

`LoadingState` must include visible loading text.

Use `role="status"` and an appropriate polite live region when the loading state appears after an interaction and should be announced. Avoid repeatedly announcing skeleton-only background refreshes.

Avoid an excessively configurable skeleton framework.

---

# 13. Step 8 — Create ConfirmDialog

Create:

```text
src/components/shared/ConfirmDialog.tsx
```

Build it using the existing:

```text
AlertDialog
Button
```

Support:

```text
Title
Description
Cancel
Confirm
Pending/loading presentation
Destructive/non-destructive visual treatment
```

The inventory defines this as a reusable confirmation wrapper only where product requirements explicitly require confirmation.

Suggested props:

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
  destructive?: boolean;
}
```

The component must not determine whether an action requires confirmation.

That decision belongs to the owning feature/product rule.

---

# 14. Step 9 — Create Pagination

Create:

```text
src/components/shared/Pagination.tsx
```

Support:

```text
Current page
Total pages
Previous
Next
Optional page numbers
Optional result range
```

The owning feature must retain:

```text
Server page state
Page size
Query parameters
URL state
Backend total count
```

Do not build server pagination logic into this component.

Suggested minimal props:

```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  totalItems?: number;
  pageSize?: number;
}
```

The component must not clamp or rewrite the controlled `page` value.

Boundary behavior:

```text
Previous is disabled when page <= 1
Next is disabled when page >= totalPages
No page-change callback may emit a value outside 1...totalPages
```

When `totalPages <= 1`, hide the pagination controls unless result-range information still provides useful context.

When both `totalItems` and `pageSize` are available, calculate the optional presentation range as:

```text
start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
end = min(page * pageSize, totalItems)
```

This is display-only calculation and does not replace backend-authoritative pagination.

Do not invent backend pagination limits.

---

# 15. Step 10 — Create SectionHeader

Create:

```text
src/components/shared/SectionHeader.tsx
```

Support:

```text
Title
Optional description
Optional count
Optional action
```

Likely reuse includes sections such as:

```text
Latest Pipeline Run
Open Items from Previous Runs
Recent Pipeline Runs
```

Suggested props:

```typescript
interface SectionHeaderProps {
  title: string;
  description?: string;
  count?: number;
  actions?: React.ReactNode;
  headingLevel?: 2 | 3;
}
```

Default `headingLevel` to `2`.

This preserves the documented hierarchy:

```text
h1 → Page title
h2 → Major section
h3 → Subsection
```

Do not select a heading level based only on visual size.

---

# 16. Step 11 — Create a Minimal DataTableShell

Create:

```text
src/components/shared/DataTableShell.tsx
```

This is **not** a generic data-table engine.

It should only own generic presentation concerns:

```text
Bounded responsive table container
Loading state placement
Empty state placement
Error state placement
Optional pagination region
Controlled horizontal overflow
```

Feature tables will continue to own:

```text
Columns
Rows
Sorting mappings
Filtering
Row actions
Backend query behavior
Business formatting
```

The documentation explicitly warns against immediately creating one extremely generic table abstraction.

The intended architecture is:

```text
DataTableShell
      +
Feature-specific table
```

For example later:

```text
DataTableShell
      ↓
FinalResultsTable
```

and:

```text
DataTableShell
      ↓
ManualInputsTable
```

Do not install TanStack Table during Phase 3.

---

# 17. State and Ownership Rules

Shared components must remain controlled by their callers where practical.

Prefer:

```text
Feature owns state
      ↓
Pass typed value + callback
      ↓
Shared component renders interaction
```

Avoid:

```text
Shared component
      ↓
Owns business state
      ↓
Feature tries to synchronize with it
```

Local state is acceptable only for genuinely internal presentation behavior.

Examples:

```text
Dialog internal UI state where appropriate
Temporary visual expansion
Primitive-level interaction state
```

Do not introduce a global state library.

---

# 18. Accessibility Requirements

Every shared component must follow existing accessibility requirements.

Verify:

```text
Keyboard operation
Visible focus
Semantic HTML
Accessible control names
Correct disabled state
No color-only meaning
Readable text at increased zoom
No unintended page-level overflow
```

For interactive controls:

```text
SearchInput
FilterSelect
ConfirmDialog
Pagination
```

ensure keyboard users can complete the interaction.

For status/error/empty/loading presentation, provide readable text rather than relying solely on icons, animation, or color.

---

# 19. Responsive Requirements

Verify at:

```text
375px
768px
1024px
1440px
```

Components should:

```text
Wrap naturally
Avoid fixed-width overflow
Stack actions when necessary
Preserve readable spacing
Keep touch targets usable
Allow bounded horizontal scrolling only where appropriate
```

`DataTableShell` may provide controlled horizontal scrolling.

The page itself must not horizontally scroll because of these components.

---

# 20. Shared Component Preview

Do not turn a production screen into a component showcase.

If visual verification requires a development harness, use a development-only file such as:

```text
src/dev/SharedComponentsPreview.tsx
```

It may temporarily demonstrate:

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

Do not:

```text
Add it to primary navigation
Create a production route
Use mock backend contracts
Use feature business data
```

If temporarily connected for verification, disconnect it before Phase 3 completion.

The existing `DesignSystemPreview.tsx` should remain untouched unless there is a concrete reason to extend it.

---

# 21. Dependency Rules

Phase 3 should require **no new runtime dependency**.

Use:

```text
React
Existing shadcn/ui primitives
Lucide React
Tailwind CSS
Existing cn()
```

Do not install:

```text
TanStack Table
Another component library
Another icon library
Another state library
New modal/dialog library
```

If implementation unexpectedly requires a new dependency, stop and report before installing it.

---

# 22. Expected Files

Expected additions:

```text
src/components/shared/
├── SearchInput.tsx
├── FilterSelect.tsx
├── StatusBadge.tsx
├── EmptyState.tsx
├── ErrorState.tsx
├── LoadingState.tsx
├── ConfirmDialog.tsx
├── Pagination.tsx
├── SectionHeader.tsx
└── DataTableShell.tsx
```

Existing files that should normally remain unchanged:

```text
src/components/shared/AppNavigation.tsx
src/components/shared/PageHeader.tsx
src/app/router.tsx
src/layouts/AppLayout.tsx
src/app/providers.tsx
src/api/generated/*
```

Possible development-only addition:

```text
src/dev/SharedComponentsPreview.tsx
```

Do not modify feature placeholder pages merely to demonstrate shared components.

---

# 23. Verification

Run baseline verification before editing:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

After implementation run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

`npm audit` should remain:

```text
0 vulnerabilities
```

Manual verification should cover:

```text
Search clear behavior
Filter selection/clear behavior
Status visual variants
Empty-state action
Error Retry action
Loading presentation and appropriate announcement behavior
ConfirmDialog keyboard/focus behavior
Pagination first/middle/last states and callback boundaries
Responsive SectionHeader and heading hierarchy
DataTableShell horizontal overflow containment
```

Add focused component interaction tests when the existing test setup supports them. Prioritize:

```text
Search clearing
Filter clearing
Pagination boundaries
Confirmation pending behavior
```

Do not add a new testing dependency solely for Phase 3.

Do not claim manual verification passed unless it was actually performed.

---

# 24. Final Diff Review

Before declaring Phase 3 complete, review:

```bash
git status --short
git diff --stat
```

Confirm:

```text
No feature business logic added
No API calls added
No generated API files modified
No new dependency added
No duplicate UI primitive created
No backend status mapping placed in shared components
No backend pagination logic placed in Pagination
No generic table engine introduced
No production preview route added
No Phase 2 shell behavior regressed
```

Preserve unrelated existing worktree changes.

Do not commit or push unless explicitly authorized.

---

# 25. Implementation Sequence

```text
1. Verify Phase 2 baseline
        ↓
2. Inspect shared/UI primitives
        ↓
3. Build SearchInput
        ↓
4. Build FilterSelect
        ↓
5. Build StatusBadge
        ↓
6. Build EmptyState
        ↓
7. Build ErrorState
        ↓
8. Build LoadingState
        ↓
9. Build ConfirmDialog
        ↓
10. Build Pagination
        ↓
11. Build SectionHeader
        ↓
12. Build minimal DataTableShell
        ↓
13. Optional dev-only visual verification harness
        ↓
14. Focused interaction tests when supported by existing tooling
        ↓
15. Responsive + accessibility verification
        ↓
16. typecheck + lint + format:check + build + audit
        ↓
17. Final diff review
```

---

# 26. Completion Criteria

Phase 3 is complete only when:

```text
SearchInput is reusable and feature-neutral
FilterSelect is generic, typed, correctly labelled, and never exposes its clear sentinel
StatusBadge contains no backend mappings
EmptyState supports optional actions
ErrorState exposes only safe presentation
LoadingState is section-level, generic, and provides appropriate readable announcements
ConfirmDialog preserves accessible AlertDialog behavior
Pagination contains no server business logic and cannot emit invalid pages
SectionHeader is reusable and preserves the h1 → h2 → h3 hierarchy
DataTableShell remains a presentation shell, not a table engine
All shared props are explicitly typed
Keyboard/focus behavior works
Responsive checks pass
No new runtime dependency was introduced
No feature APIs/business rules were added
Typecheck passes
ESLint passes
Format check passes
Production build passes
npm audit remains clean
No known blocking defect remains
```

Milestone:

```text
Reusable shared presentation patterns are ready
+
No speculative feature architecture has been introduced
+
Repository is ready for the first real vertical feature slice
```
