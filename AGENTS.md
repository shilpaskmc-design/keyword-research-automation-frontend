# AGENTS.md

> [!info] Purpose
> Mandatory instructions for AI coding agents working on the **Keyword Research Automation Frontend**, including Codex, Antigravity, and similar coding agents.
>
> This file applies to the entire frontend repository unless a more specific nested `AGENTS.md` explicitly overrides it.

---

# 1. Mandatory First Step

Before making any code change:

1. Read this `AGENTS.md` completely.
2. Read the relevant project documentation under `docs/`.
3. Inspect the existing implementation related to the task.
4. Understand the current API contract before changing API-dependent code.
5. Identify the smallest safe change required.
6. Only then begin implementation.

Do not begin coding based only on the task prompt.

---

# 2. Repository Documentation

Project documentation lives under:

```text
docs/
```

The documentation is part of the implementation contract.

## Core Documents

```text
docs/product-scope-and-screen-inventory.md
docs/frontend-tech-stack.md
docs/frontend-architecture.md
docs/design-system.md
docs/ux-behaviour-rules.md
docs/component-inventory.md
docs/api-contract.md
docs/frontend-data-models-and-types.md
docs/form-and-validation-specification.md
docs/responsive-and-accessibility-guidelines.md
docs/coding-standards.md
docs/definition-of-done.md
```

## Screen Specifications

Detailed screen requirements live under:

```text
docs/frontend-screens/
```

Files:

```text
docs/frontend-screens/Screen 1 - Home Screen Specification.md
docs/frontend-screens/Screen 2 - Final Results Screen Specification.md
docs/frontend-screens/Screen 3 - Manual Inputs Screen Specification.md
docs/frontend-screens/Screen 4 - Business Profile Screen Specification.md
docs/frontend-screens/Screen 5 - Service Taxonomy Screen Specification.md
```

Before changing a screen, read its corresponding screen specification.
If a required document is listed but missing, report it and continue with the
available authoritative sources. Do not invent the missing requirements.

---

# 3. Documentation Reading Rules

Do not read every document blindly for every small task.

Read the documents relevant to the requested change.

## New Feature or Screen Change

Read:

```text
product-scope-and-screen-inventory.md
frontend-architecture.md
design-system.md
ux-behaviour-rules.md
component-inventory.md
relevant screen specification
definition-of-done.md
```

## API-Related Work

Also read:

```text
api-contract.md
frontend-data-models-and-types.md
```

## Forms or Validation

Also read:

```text
form-and-validation-specification.md
```

## Responsive or Accessibility Work

Also read:

```text
responsive-and-accessibility-guidelines.md
```

## Structural or Refactoring Work

Also read:

```text
frontend-tech-stack.md
frontend-architecture.md
coding-standards.md
```

---

# 4. Source-of-Truth Order

Use this order when making implementation decisions:

```text
1. Current explicit user instruction
2. AGENTS.md
3. Approved OpenAPI snapshot for exact API behaviour
4. Relevant approved frontend product and UX documentation
5. Existing frontend implementation
6. Reasonable implementation inference
```

Additional rules:

* Backend request/response structure must follow the actual public API/OpenAPI contract.
* Frontend business behaviour must not be invented from accidental existing implementation.
* Existing code is not automatically correct merely because it already exists.

If documentation and implementation conflict, do not silently choose one.

Identify the conflict before making a significant change.

---

# 5. Product Scope

This AGENTS.md applies only to the
`keyword-research-automation-frontend/` repository. Do not modify the backend
repository unless the user explicitly requests a cross-repository change.

This is an MVP frontend for the Marketing Team.

Current primary screens:

```text
Home / Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Do not add new screens, workflows, roles, authentication, analytics, dashboards, or product functionality unless explicitly requested.

Avoid speculative implementation for possible future features.

---

# 6. Authentication and Roles

Authentication and role-based access control are not part of the current MVP.

Do not introduce:

```text
Login flows
Authentication providers
Protected routes
Role guards
Permission systems
Token refresh systems
User session infrastructure
```

unless explicitly requested.

---

# 7. Approved Frontend Stack

Use the approved stack:

```text
React
Vite
TypeScript
Tailwind CSS
shadcn/ui
Radix UI where required
Lucide React
React Router
TanStack Query
React Hook Form
Zod
Native fetch through the Shared API Client
```

Do not introduce competing frameworks or libraries without a concrete requirement.

Do not introduce:

```text
Redux
Zustand
MobX
Axios
another UI framework
another styling system
```

unless explicitly approved.

---

# 8. Architecture Rules

The frontend uses a feature-oriented architecture.

Expected component direction:

```text
Page
  ↓
Feature Component
  ↓
Shared Application Component
  ↓
UI Primitive
```

Expected data flow:

```text
Feature Component
  ↓
Feature Hook
  ↓
Feature API Function
  ↓
Shared API Client
  ↓
Backend API
```

Feature-specific code belongs inside:

```text
src/features/<feature>/
```

Shared code should only be extracted when genuine reuse exists.

Do not create abstractions only because they may be useful later.

---

# 9. API Rules

The backend public API and OpenAPI contract are authoritative.

Do not:

* invent endpoint paths;
* infer API schemas from database models;
* manually recreate backend DTOs when generated types exist;
* calculate backend-authoritative values from visible frontend rows;
* recreate backend filtering, ordering, eligibility, or transition rules;
* parse arbitrary backend error messages to drive application logic.

Use:

```text
Feature Hook
    ↓
Feature API Function
    ↓
Shared API Client
```

Do not place raw `fetch()` calls inside React components.

---

# 10. API Environment

The API base URL must come from:

```typescript
import.meta.env.VITE_API_BASE_URL
```

Do not use:

```text
VITE_API_URL
process.env
hard-coded backend URLs
```

inside application code.

---

# 11. Generated API Types

Generated API types live under:

```text
src/api/generated/
```

Never manually edit generated files.

Use generated request/response types at API boundaries.

Regenerate generated API types from the approved backend OpenAPI snapshot using
the project-approved generation script or exact pinned package version.

Prefer:

```bash
npm run generate:api-types
```

when the repository provides that script.

If no project script exists, use the exact `openapi-typescript` version pinned
by the project. Do not use an unpinned `npx openapi-typescript` command.

Frontend-owned types may be created for:

```text
Forms
Filters
Route state
Display models
Component props
Local UI state
```

only where required.

---

# 12. Backend Authority

The backend remains authoritative for business rules.

Examples:

```text
Pipeline lifecycle
Pipeline execution status
Pipeline stage status
Allowed pipeline actions
Final Results ordering
Final Results filtering
Pagination
Manual Input eligibility
Publish Status transitions
Validation
Backend counts
```

The frontend represents these rules but must not independently redefine them.

---

# 13. State Management

Use:

```text
TanStack Query
```

for server state.

Use React local state for:

```text
Modal state
Expanded sections
Temporary UI state
Local selections
Simple local form state
```

Do not copy server state into global client state unnecessarily.

No global state library is currently required.

---

# 14. Query Key Rules

TanStack Query keys must include every value that can change the server response.

Example:

```typescript
[
  "final-results",
  {
    pipelineExecutionId,
    publishStatus,
    search,
    page,
    pageSize,
  },
]
```

Do not omit filters, pagination, execution scope, or other server-affecting parameters from query keys.

---

# 15. Mutation Rules

Business-sensitive mutations must wait for backend confirmation.

Examples:

```text
Start Pipeline
Publish Status Update
Delete Category
Excel Upload
```

Do not use optimistic updates by default.

While a mutation is pending:

* prevent duplicate submission;
* show appropriate pending state;
* preserve user input where necessary.

After success:

* invalidate/refetch affected query scopes;
* do not manually reproduce backend filtering logic.

---

# 16. TypeScript Rules

Use TypeScript for application code.

Avoid:

```typescript
any
```

Prefer:

```text
Generated types
Explicit types/interfaces
Generics
unknown
```

Do not use unnecessary non-null assertions.

Preserve backend nullability.

Use backend-returned IDs rather than constructing frontend IDs for backend operations.

---

# 17. Identifier Rules

Do not substitute identifiers.

Example:

```text
Publish Status Update
→ use backend row_id
```

Do not replace it with:

```text
pipeline_execution_id
array index
frontend-generated identifier
```

Preserve identifier type distinctions defined by the API contract.

---

# 18. Styling Rules

Use Tailwind CSS as the primary styling system.

Use semantic Design System tokens.

Use shadcn/ui primitives before creating competing base components.

Avoid unnecessary arbitrary values such as:

```text
text-[15px]
mt-[17px]
bg-[#1473E6]
rounded-[11px]
```

when an approved design token exists.

Do not introduce another styling system.

---

# 19. Component Rules

Before creating a new shared component:

1. Check `docs/component-inventory.md`.
2. Check whether an approved component already exists.
3. Determine whether the requirement is genuinely shared.

Do not create multiple components solving the same primitive problem.

Feature-specific workflow components should remain inside their feature.

Shared visual components must not own feature business rules.

---

# 20. Form Rules

Use React Hook Form + Zod for structured forms where appropriate.

Backend validation remains authoritative.

Frontend validation should improve UX.

Do not invent:

```text
Maximum lengths
Business transition rules
Numeric limits
Backend enum values
```

unless documented by product/OpenAPI.

Do not require users to enter JSON manually.

Preserve form values after failed requests.

---

# 21. Error Handling

Use normalized API errors.

Application behaviour may depend on:

```text
HTTP status
Stable backend error code
```

Do not depend on arbitrary backend message text.

Never display:

```text
Stack traces
Raw exceptions
Database details
Internal backend implementation details
Sensitive information
```

to users.

---

# 22. Unknown Backend Values

Unknown backend enum/status values must not crash the application.

Use:

```text
Preserve value
Neutral display fallback
Do not silently reinterpret
```

This protects against API contract drift.

---

# 23. Loading / Empty / Error States

Every data-driven feature must consider:

```text
Loading
Empty
Filtered Empty
Error
Success
Disabled
```

Do not show empty content while data is still loading.

Prefer section-level loading rather than blocking the entire application.

---

# 24. Responsive Rules

The frontend must remain usable at representative widths:

```text
375px
768px
1024px
1440px
```

Use standard Tailwind breakpoints by default.

Avoid arbitrary feature-specific breakpoints.

Do not allow unintended page-level horizontal scrolling.

Tables may use controlled horizontal scrolling.

Core actions must remain available on smaller screens.

---

# 25. Accessibility Rules

Target:

```text
WCAG 2.1 AA
```

Minimum requirements:

* semantic HTML;
* keyboard-accessible actions;
* visible focus;
* accessible labels;
* correct dialog focus behaviour;
* color is not the only status indicator;
* expandable controls expose state;
* semantic tables;
* accessible validation messages;
* accessible names for icon-only controls;
* skip-to-main-content support;
* appropriate live regions for meaningful asynchronous updates.

Do not bypass accessibility behaviour provided by shadcn/ui / Radix primitives.

---

# 26. React Rules

Use functional components.

Use `useEffect` only for actual side effects.

Do not use effects to maintain state that can be derived directly.

Avoid unnecessary:

```text
useMemo
useCallback
React.memo
```

unless there is a demonstrated need.

Use stable backend identifiers for React list keys.

Avoid deeply nested conditional JSX.

Prefer explicit:

```text
Loading
Error
Empty
Content
```

branches.

---

# 27. Code Quality

Follow:

```text
docs/coding-standards.md
```

At minimum:

* use meaningful names;
* maintain clear component responsibilities;
* avoid unnecessary `any`;
* remove dead code;
* remove temporary debug code;
* avoid unexplained broad lint suppression;
* remove commented-out implementation;
* avoid vague TODOs;
* avoid unnecessary dependencies.

Prefer clarity over clever abstractions.

---

# 28. Comments

Comments should explain:

```text
Why
Constraint
Non-obvious behaviour
Backend contract nuance
```

Do not add comments that simply repeat the code.

TODOs must be specific and actionable.

Avoid:

```text
TODO: fix later
```

---

# 29. Security Rules

Frontend code is an untrusted client.

Never place secrets in:

```text
Source files
VITE_* variables
Client-side constants
```

Everything shipped to the browser must be considered public.

Avoid `dangerouslySetInnerHTML` unless explicitly required and the input is trusted/sanitized.

Do not log sensitive or internal backend information.

---

# 30. Documentation Changes

Do not update files under:

```text
docs/
```

unless the task explicitly requires documentation changes.

Documentation changes are allowed when the user explicitly requests them.

If implementation reveals that documentation is outdated or contradictory and
the user has not requested documentation changes:

1. identify the conflict;
2. report it;
3. do not silently rewrite product requirements.

---

# 31. Do Not Modify Generated Files

Do not manually edit:

```text
src/api/generated/
```

or other generated artifacts.

If generated types are outdated, regenerate them using the project's approved generation workflow.

---

# 32. Change Scope

Make the smallest change that correctly satisfies the task.

Do not:

* refactor unrelated modules;
* rename unrelated files;
* upgrade unrelated dependencies;
* reorganize directories without need;
* perform broad cleanup during a focused bug fix;
* change product behaviour outside the requested scope.

If a larger refactor is required, explain why before performing it.

---

# 33. Existing Code Investigation

Before changing existing functionality:

1. Identify the route/page.
2. Trace the component hierarchy.
3. Trace relevant hooks.
4. Trace query/mutation logic.
5. Trace feature API functions.
6. Inspect generated/API types.
7. Inspect relevant shared components.
8. Understand current behaviour.
9. Compare it with documentation.
10. Only then modify code.

Do not patch symptoms without identifying the current flow.

---

# 34. Debugging Rule

When fixing a bug:

```text
Reproduce / Understand
        ↓
Identify Root Cause
        ↓
Determine Smallest Safe Fix
        ↓
Implement
        ↓
Verify
```

Do not start by rewriting the affected component.

Do not hide errors merely to make the UI appear correct.

---

# 35. Implementation Sequence

For new functionality, prefer:

```text
Contract / Types
        ↓
Feature API
        ↓
Query / Mutation Hook
        ↓
Feature Logic
        ↓
UI Component
        ↓
Responsive / Accessibility
        ↓
Verification
```

Do not build the UI around invented mock contracts when the backend contract already exists.

---

# 36. Testing and Verification

Before considering work complete, perform the relevant checks from:

```text
docs/definition-of-done.md
```

For frontend source changes, verify as applicable:

```text
TypeScript check
ESLint
Production build
Relevant tests
Manual workflow verification
Responsive verification
Keyboard/accessibility verification
```

Do not claim a check passed unless it was actually run.

If a check cannot be run, state that clearly.

---

# 37. Definition of Done

A change is not complete simply because it renders successfully.

It must satisfy the relevant items in:

```text
docs/definition-of-done.md
```

At minimum:

```text
Required functionality works
+
Relevant Definition of Done checks pass
+
No known blocking defect remains
```

---

# 38. Agent Working Protocol

For non-trivial tasks, follow this sequence.

## Before Editing

Provide a short summary of:

```text
Relevant docs read
Current flow identified
Files likely affected
Planned change
```

Do not produce a long essay.

## During Editing

* keep changes focused;
* preserve existing unrelated behaviour;
* follow project architecture;
* do not invent requirements.

## After Editing

Report:

```text
What changed
Files changed
Why
Checks run
Result
Any unresolved issue
```

Do not claim completion if required verification failed.

---

# 39. Stop Conditions

Stop and ask for clarification when:

* requirements materially conflict;
* documentation and backend contract conflict in a way that changes product behaviour;
* a destructive migration is required;
* the requested change would introduce authentication/roles not currently in scope;
* required backend functionality does not exist;
* implementation requires a significant product decision not covered by documentation.

Do not ask questions for minor implementation choices that can safely follow the established architecture and standards.

---

# 40. Documentation Conflict Rule

If two documents appear inconsistent:

1. Identify the exact conflicting statements.
2. Determine whether one is more specific to the task.
3. Check the current API contract where applicable.
4. Do not silently combine incompatible rules.

General guidance:

```text
Screen-specific behaviour
→ Relevant Screen Specification

API structure
→ OpenAPI / API Contract

Visual behaviour
→ Design System + Responsive & Accessibility Guidelines

UX behaviour
→ UX Behaviour Rules

Code organization
→ Frontend Architecture + Coding Standards

Completion requirements
→ Definition of Done
```

---

# 41. Final Agent Checklist

Before making any frontend change, verify:

```text
Does this match the approved product scope?

Does it match the relevant screen specification?

Does it follow the frontend architecture?

Does it respect the backend API contract?

Does it use the approved data models/types?

Does it follow the Design System?

Does it follow UX behaviour rules?

Does it satisfy responsive/accessibility requirements?

Does it follow Coding Standards?

Does it satisfy the Definition of Done?
```

If the answer to any applicable question is **No**, the task is not complete.

---

# 42. Repository Placement

The operational copy of this file must live at:

```text
keyword-research-automation-frontend/
├── AGENTS.md
├── docs/
│   ├── frontend-screens/
│   ├── api-contract.md
│   ├── coding-standards.md
│   ├── component-inventory.md
│   ├── definition-of-done.md
│   ├── design-system.md
│   ├── form-and-validation-specification.md
│   ├── frontend-architecture.md
│   ├── frontend-data-models-and-types.md
│   ├── frontend-tech-stack.md
│   ├── product-scope-and-screen-inventory.md
│   ├── responsive-and-accessibility-guidelines.md
│   └── ux-behaviour-rules.md
└── ...
```

Keep `AGENTS.md` at the repository root so its instructions govern the frontend repository.

An additional copy may be kept in Obsidian for reference, but the repository-root `AGENTS.md` is the operational version coding agents must follow.
