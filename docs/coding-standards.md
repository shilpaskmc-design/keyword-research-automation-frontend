# Coding Standards

> [!info] Document Status
> **Status:** MVP Frontend Coding Standards
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define enforceable coding conventions for React, TypeScript, file organization, API usage, components, state, error handling, formatting, and code quality.

---

# 1. General Principles

Frontend code should be:

* readable;
* predictable;
* type-safe;
* feature-oriented;
* easy to review;
* free from unnecessary abstraction;
* aligned with the approved architecture.

Prefer clarity over cleverness.

---

# 2. Language

Application code must use:

```text
TypeScript
```

Preferred extensions:

```text
.ts
.tsx
```

Do not introduce JavaScript files unless required by tooling or configuration.

---

# 3. TypeScript Rules

Use TypeScript strictly.

Avoid:

```typescript
any
```

Prefer:

```text
Generated API types
Explicit interfaces/types
Generics
unknown
```

Use `unknown` for untrusted or not-yet-narrowed values.

Do not use non-null assertions (`!`) unless the contract genuinely guarantees the value.

---

# 4. Generated Types

Backend API types must come from:

```text
src/api/generated/
```

Rules:

* never manually edit generated files;
* do not duplicate backend DTOs unnecessarily;
* regenerate types when the approved OpenAPI contract changes.

---

# 5. Component Style

Use React functional components.

Preferred:

```tsx
function PageHeader() {
  return (...)
}
```

or:

```tsx
const PageHeader = () => {
  return (...)
}
```

Choose one style within the project and use it consistently.

Do not use class components.

---

# 6. Component Naming

React components:

```text
PascalCase
```

Examples:

```text
PageHeader.tsx
FinalResultsTable.tsx
PipelineStageProgress.tsx
```

Hooks:

```text
useSomething
```

Examples:

```text
useFinalResults
useManualInputs
useStartPipeline
```

Utilities and functions:

```text
camelCase
```

Constants:

```text
UPPER_SNAKE_CASE
```

where appropriate for true constants.

---

# 7. File Naming

React component files:

```text
PascalCase.tsx
```

General TypeScript files:

```text
camelCase.ts
```

shadcn/ui generated files may retain their standard naming:

```text
button.tsx
dialog.tsx
select.tsx
```

---

# 8. Feature Boundaries

Feature-specific code stays inside:

```text
src/features/<feature>/
```

Example:

```text
src/features/final-results/
```

may own:

```text
api/
components/
hooks/
pages/
types/
schemas/
utils/
```

Do not place feature-specific business logic in global shared folders.

---

# 9. Shared Code

Move code to shared locations only when genuine reuse exists.

Shared locations include:

```text
src/components/shared/
src/hooks/
src/types/
src/lib/
```

Do not create shared abstractions based on hypothetical future reuse.

---

# 10. Import Direction

Preferred dependency direction:

```text
Pages
    ↓
Feature Components
    ↓
Shared Components
    ↓
UI Primitives
```

Data flow:

```text
Feature Component
    ↓
Feature Hook
    ↓
Feature API Function
    ↓
Shared API Client
```

Avoid circular dependencies.

One feature should not import deeply from another feature's internal implementation.

---

# 11. Imports

Prefer clear direct imports.

Use type-only imports where appropriate:

```typescript
import type { FinalResultViewModel } from "../types"
```

Avoid excessive barrel files that hide dependencies.

Group imports consistently:

```text
External libraries
Internal application imports
Relative imports
Type-only imports where appropriate
```

Exact ordering should be enforced by ESLint if configured.

---

# 12. React Props

Props must be explicitly typed.

Example:

```typescript
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}
```

Avoid anonymous `any`-typed props.

Keep prop types near the component unless genuinely shared.

---

# 13. Component Scope

Prefer one primary component per file.

Small tightly coupled helper components may remain in the same file.

Split components when:

* responsibilities become unclear;
* the file becomes difficult to review;
* logic is independently reusable;
* rendering becomes excessively complex.

Do not split components only to reduce line count.

---

# 14. Component Responsibility

Components should have a clear purpose.

Avoid components that simultaneously handle:

```text
API requests
Complex business rules
Large form state
Rendering
Routing
Formatting
```

Separate responsibilities where doing so improves clarity.

---

# 15. UI Primitives

Use approved shadcn/ui primitives before creating competing base controls.

Examples:

```text
Button
Input
Select
Dialog
Tabs
Badge
Tooltip
```

Do not create parallel versions such as:

```text
CustomButton
AnotherButton
PrimaryButton2
```

without a specific requirement.

---

# 16. Styling

Use:

```text
Tailwind CSS
```

as the primary styling system.

Use semantic design tokens from the Design System.

Avoid repeated arbitrary values such as:

```text
text-[15px]
mt-[17px]
bg-[#1473E6]
rounded-[11px]
```

unless explicitly required.

Do not introduce another styling system without approval.

---

# 17. Conditional Classes

Use the approved shared utility for conditional Tailwind classes where available.

Example:

```tsx
className={cn(
  "base-class",
  isActive && "active-class"
)}
```

Avoid unreadable nested ternaries inside `className`.

---

# 18. State Management

Use React local state for local UI state.

Examples:

```text
Modal visibility
Expanded sections
Temporary selections
Local form state
```

Use TanStack Query for server state.

Do not copy server data into a global store unnecessarily.

---

# 19. Global State

Do not introduce:

```text
Redux
Zustand
MobX
```

for the MVP unless a genuine cross-application client-state requirement appears.

Adding a global state library requires an explicit architecture decision.

---

# 20. TanStack Query

Use TanStack Query for:

```text
Fetching
Caching
Mutations
Refetching
Invalidation
Loading/error state
```

Feature query hooks should remain inside their feature.

Example:

```text
src/features/final-results/hooks/
```

---

# 21. Query Keys

Query keys should be structured and predictable.

Conceptually:

```typescript
["final-results"]
["final-results", "history", filters]
["manual-inputs", filters]
```

Avoid arbitrary query-key strings scattered across components.

Keep query-key construction close to the owning feature.

Query keys must include every server-affecting filter and scope. For example:

```typescript
["final-results", {
  pipelineExecutionId,
  publishStatus,
  search,
  page,
  pageSize,
}]
```

Do not omit a filter or execution scope that can change the returned data.

---

# 22. API Requests

React components must not contain scattered raw API calls.

Avoid:

```typescript
fetch("/api/v1/...")
```

inside components.

Use:

```text
Feature Hook
    ↓
Feature API Function
    ↓
Shared API Client
```

The Shared API Client must read the API origin from
`import.meta.env.VITE_API_BASE_URL`. Do not use `VITE_API_URL`,
`process.env`, or hard-coded API origins in application code.

---

# 23. API Functions

API function names should describe the operation.

Prefer:

```typescript
startPipeline()
getFinalResults()
updatePublishStatus()
createManualInput()
uploadManualInputs()
```

Avoid vague names such as:

```typescript
fetchData()
getData()
submit()
handleApi()
```

---

# 24. API Contract

The approved OpenAPI contract remains authoritative for:

```text
Endpoint paths
Request schemas
Response schemas
Enums
Nullability
Validation
Pagination
```

Do not infer backend behaviour from database schemas or frontend assumptions.

Generated OpenAPI types are required at request and response boundaries.
Frontend-owned types may be used for forms, route state, display models, and
UI state, with explicit mapping where necessary.

---

# 25. Error Handling

Use normalized API errors.

Frontend logic may depend on:

```text
HTTP status
Stable backend error code
```

Do not parse arbitrary backend message strings to determine behaviour.

User-facing messages must remain safe and understandable.

---

# 26. Async Error Handling

Handle expected async states explicitly:

```text
Loading
Success
Empty
Error
```

Do not silently ignore rejected promises.

Avoid broad empty catches such as:

```typescript
catch {
}
```

unless the error is intentionally ignored and documented.

---

# 27. Forms

Use:

```text
React Hook Form
Zod
```

for structured forms where appropriate.

Very small inline forms may use local React state.

Form state belongs to the feature that owns the form.

---

# 28. Validation

Frontend validation improves UX.

Backend validation remains authoritative.

Do not duplicate complex backend rules unless required for user experience.

Do not invent:

```text
Maximum lengths
Numeric limits
Enum values
Business transitions
```

that are not defined by product/OpenAPI rules.

---

# 29. Status and Enum Values

Keep backend values separate from frontend labels.

Example:

```typescript
pending
```

may display as:

```text
Ready for Next Run
```

but requests must still use the backend-supported value.

Do not let presentation components own backend status mappings.

---

# 30. Unknown Backend Values

Unknown enum/status values must:

```text
Not crash the application
Remain observable
Use a neutral display fallback
Not be silently mapped to another known value
```

This protects against contract drift.

---

# 31. Identifiers

Use backend-returned identifiers.

Do not construct or substitute identifiers.

Example:

```text
Publish Status update
→ use backend row_id
```

Do not replace it with:

```text
pipeline_execution_id
result index
frontend-generated ID
```

---

# 32. Dates and Times

Keep backend timestamps authoritative.

At the API boundary:

```text
string timestamp
```

Format timestamps only for display.

Do not replace server timestamps with browser-generated values.

---

# 33. Formatting Utilities

Reusable formatting should live in appropriate shared utilities.

Examples:

```text
Date formatting
Display fallback
Text formatting
```

Do not duplicate formatting logic across multiple components.

Avoid one large unrelated `utils.ts` file.

---

# 34. Constants

Use constants for repeated frontend-owned values such as:

```text
Display mappings
Tab keys
Default pagination
Approved UI labels
```

Do not duplicate magic strings throughout components.

Backend-controlled values should come from generated types/contracts where possible.

Frontend constants may define UI defaults, but backend pagination defaults,
limits, and enum rules remain authoritative.

---

# 35. Comments

Comments should explain:

```text
Why
Constraint
Non-obvious decision
Backend contract nuance
```

Avoid comments that merely repeat the code.

Bad:

```typescript
// increment page
page++
```

Useful:

```typescript
// Reset to page 1 because changing filters changes the dataset scope.
```

---

# 36. TODO Comments

TODOs must be specific.

Prefer:

```typescript
// TODO: Add category-delete conflict handling once backend behavior is finalized.
```

Avoid:

```typescript
// TODO: fix later
```

Remove obsolete TODOs.

---

# 37. Console Logging

Do not leave unnecessary:

```text
console.log
console.debug
```

in production code.

Development logging should not expose:

```text
Raw API responses
Sensitive data
Internal backend details
```

Use intentional error/reporting mechanisms where introduced later.

---

# 38. Accessibility

Do not bypass accessibility behaviour provided by shadcn/ui/Radix primitives.

Use semantic HTML.

Interactive controls must remain:

```text
Keyboard accessible
Focus visible
Properly labelled
```

Do not replace native buttons with clickable `<div>` elements.

---

# 39. Responsive Coding

Use standard Tailwind breakpoints by default.

Avoid arbitrary feature-specific media queries.

Layouts should:

```text
Wrap
Stack
Reflow
```

before introducing custom breakpoint logic.

Data tables may use controlled horizontal overflow.

---

# 40. Performance

Do not optimize prematurely.

Avoid unnecessary use of:

```text
useMemo
useCallback
React.memo
Complex virtualization
Manual caching
```

Use them when profiling or real application behaviour justifies them.

---

# 41. Effects

Use `useEffect` only for actual side effects.

Avoid using effects to derive values that can be calculated directly during render.

Prefer:

```typescript
const fullName = `${firstName} ${lastName}`
```

over synchronizing derived values into state.

---

# 42. Derived State

Do not store values in React state when they can be derived from existing state or server data.

Avoid:

```text
Source State
    ↓
useEffect
    ↓
Duplicate Derived State
```

Prefer direct derivation.

---

# 43. Event Handlers

Use meaningful handler names.

Prefer:

```typescript
handleSubmit
handleDeleteCategory
handleClearFilters
```

Avoid:

```typescript
doThing
clickHandler
fn
```

Handlers should remain concise where possible.

---

# 44. Boolean Naming

Boolean variables should read naturally.

Prefer:

```text
isLoading
isOpen
isActive
hasNextPage
canDelete
```

Avoid ambiguous names:

```text
loadingFlag
openValue
state1
```

---

# 45. Early Returns

Prefer early returns when they reduce nesting.

Example:

```tsx
if (isLoading) {
  return <LoadingState />
}

if (error) {
  return <ErrorState />
}

return <Content />
```

Avoid deeply nested conditional JSX where simpler control flow is possible.

---

# 46. Conditional Rendering

Make important states explicit.

Prefer:

```text
Loading
Error
Empty
Content
```

over large nested ternaries.

Avoid:

```tsx
condition ? a : otherCondition ? b : thirdCondition ? c : d
```

when it harms readability.

---

# 47. Array Keys

Use stable backend identifiers for React list keys.

Prefer:

```tsx
key={result.rowId}
```

Avoid using array indexes when stable identifiers exist.

---

# 48. Mutations

Business-sensitive mutations should wait for backend confirmation.

Examples:

```text
Pipeline Start
Publish Status Update
Delete Category
```

Do not use optimistic updates by default for these actions.

Prevent duplicate submissions while the mutation is pending.

When a request completes after a component is no longer active, do not apply
stale local updates to an unmounted or superseded view. Use TanStack Query
invalidation and current query scope to keep refreshed data consistent.

---

# 49. File Uploads

File upload code should:

```text
Validate basic supported type
Use backend-supported request format
Preserve file after failed request where useful
Prevent duplicate upload
```

Do not parse complex workbook business rules in the frontend.

---

# 50. Tests

At minimum, new critical logic should be testable.

Prioritize tests for:

```text
Data mapping
Validation
Status mappings
Critical business-facing interactions
URL/query parsing
Error-code handling
```

Do not write tests that only duplicate implementation details without protecting behaviour.

---

# 51. Security Basics

Frontend code must never contain secrets.

Do not place secrets in:

```text
Source files
VITE_* variables
Client-side constants
```

Anything delivered to the browser should be treated as public.

Never use unsafe HTML rendering unless content is explicitly trusted and sanitized.

Avoid:

```tsx
dangerouslySetInnerHTML
```

unless there is a documented requirement.

---

# 52. Dependency Management

Add dependencies only when they solve a concrete requirement.

Before adding a library, check whether the requirement is already covered by:

```text
React
Browser APIs
Tailwind CSS
shadcn/ui
TanStack Query
React Hook Form
Zod
Lucide React
```

Avoid multiple libraries solving the same problem.

---

# 53. Package Manager

Use:

```text
npm
```

consistently.

Commit:

```text
package-lock.json
```

Do not mix package managers.

---

# 54. Linting

Use:

```text
ESLint
```

for React and TypeScript code-quality rules.

Code should pass linting before being considered complete.

Do not broadly disable lint rules to avoid fixing legitimate issues.

If a rule must be disabled, keep the scope narrow and document the reason where necessary.

---

# 55. Formatting

Use:

```text
Prettier
```

for formatting.

Formatting should be automated rather than debated during reviews.

Do not manually align code in ways that conflict with Prettier output.

---

# 56. Build Quality

Before completing development work:

```text
TypeScript check passes
ESLint passes
Production build passes
Relevant tests pass
```

Do not merge knowingly broken build/type/lint output.

---

# 57. Dead Code

Remove:

```text
Unused imports
Unused components
Commented-out code
Obsolete helpers
Temporary debug code
```

Do not preserve large blocks of disabled code "for later."

Source control already preserves history.

---

# 58. Refactoring Rule

Refactor when:

```text
Duplication is real
Responsibility is unclear
Implementation has become difficult to change
A reusable pattern has actually emerged
```

Do not refactor purely to introduce patterns that the MVP does not need.

---

# 59. Coding Guardrails

1. Use TypeScript throughout application code.
2. Avoid `any`.
3. Keep feature-specific code inside its feature.
4. Share only genuinely reusable code.
5. Keep server state in TanStack Query.
6. Keep temporary UI state local.
7. Do not introduce a global state library without a real requirement.
8. Do not make raw API calls from components.
9. Keep OpenAPI authoritative for backend contracts.
10. Never manually edit generated API types.
11. Keep backend values separate from frontend labels.
12. Preserve backend nullability and identifiers.
13. Do not parse arbitrary backend messages for behaviour.
14. Use Tailwind CSS and approved design tokens.
15. Use shadcn/ui before creating competing primitives.
16. Preserve accessibility behaviour.
17. Avoid premature abstractions and optimization.
18. Prevent duplicate business mutations.
19. Remove debug/dead code.
20. Ensure typecheck, lint, build, and relevant tests pass.

---

# 60. Related Documents

```text
01. Product Scope & Screen Inventory
02. Frontend Tech Stack
03. Frontend Architecture
04. Design System
05. UX Behaviour Rules
06. Detailed Screen Specifications
07. Component Inventory
08. API Contract
09. Frontend Data Models & Types
10. Form & Validation Specification
11. Responsive & Accessibility Guidelines
12. Coding Standards
13. Definition of Done
```

This document defines **how frontend code should be written and reviewed consistently during MVP development**.
