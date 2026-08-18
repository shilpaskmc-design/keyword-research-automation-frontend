# Frontend Architecture

> [!info] Document Status
> **Status:** Approved for MVP Architecture
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define the frontend application structure, architectural boundaries, data flow, routing, state management, API integration, component organization, and engineering rules.

---

# 1. Architecture Goals

The frontend architecture should prioritize:

* clear feature boundaries;
* predictable data flow;
* reusable UI components;
* backend-authoritative business logic;
* type safety;
* maintainability;
* minimal unnecessary abstraction;
* easy extension as the product grows.

The architecture should remain simple enough for the current five-screen MVP.

---

# 2. Architecture Overview

The application follows a feature-oriented React architecture.

```text
Browser
   ↓
React Application
   ↓
Application Router
   ↓
Page / Feature
   ↓
Feature Components
   ↓
Queries / Mutations
   ↓
API Layer
   ↓
Backend API
```

UI foundation:

```text
Tailwind CSS
      ↓
shadcn/ui
      ↓
Shared Application Components
      ↓
Feature Components
      ↓
Pages
```

The frontend should primarily:

```text
Request
Display
Collect User Input
Submit Actions
Represent Backend State
```

Business rules remain backend-authoritative.

---

# 3. Proposed Source Structure

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   └── shared/
│
├── api/
│   ├── generated/
│   │   └── schema.d.ts
│   ├── client.ts
│   └── errors.ts
│
├── features/
│   ├── dashboard/
│   ├── final-results/
│   ├── manual-inputs/
│   ├── business-profile/
│   └── service-taxonomy/
│
├── layouts/
│
├── lib/
│   ├── query/
│   └── utils/
│
├── hooks/
│
├── types/
│
├── constants/
│
├── assets/
│
├── styles/
│
└── main.tsx
```

This is the default structure. New top-level folders should only be introduced when there is a clear architectural need.

---

# 4. Application Layer

The `app/` directory contains application-level configuration.

```text
app/
├── App.tsx
├── router.tsx
└── providers.tsx
```

## `App.tsx`

Responsible for the application root.

It should remain small and should not contain feature-specific business logic.

## `router.tsx`

Defines application routes and route-level page composition.

## `providers.tsx`

Centralizes application-wide providers.

Example:

```text
QueryClientProvider
Future global providers
```

Providers should not be scattered throughout feature components.

## Generated API Types

The approved backend OpenAPI snapshot is the source of truth for API request
and response types.

Generated types belong under:

```text
src/api/generated/
```

Generated files must not be manually edited. Custom API-client behavior,
error normalization, and screen-oriented endpoint functions belong outside the
generated directory.

---

# 5. Feature Architecture

Each major product area should have its own feature directory.

```text
features/
├── dashboard/
├── final-results/
├── manual-inputs/
├── business-profile/
└── service-taxonomy/
```

A feature may contain:

```text
feature-name/
├── api/
├── components/
├── hooks/
├── pages/
├── types/
├── schemas/
└── utils/
```

Only create subdirectories that the feature actually needs.

Avoid creating empty folders simply to satisfy a template.

---

# 6. Feature Ownership

Each product screen belongs primarily to one feature.

| Screen           | Feature            |
| ---------------- | ------------------ |
| Dashboard        | `dashboard`        |
| Final Results    | `final-results`    |
| Manual Inputs    | `manual-inputs`    |
| Business Profile | `business-profile` |
| Service Taxonomy | `service-taxonomy` |

Feature-specific logic should remain inside its feature.

For example:

```text
features/final-results/
```

may own:

```text
Final Results page
Latest Results
History
Publish Status controls
Final Result filters
Final Result queries
Final Result mutations
Final Result types
```

---

# 7. Feature Boundary Rule

A component should remain inside a feature when it exists specifically for that feature.

Example:

```text
features/final-results/components/PublishStatusSelect.tsx
```

Do not move components into shared directories merely because they might theoretically be reusable later.

Promote a component to shared only when there is genuine reuse across features.

---

# 8. Shared Components

Shared application components live under:

```text
components/
```

Recommended separation:

```text
components/
├── ui/
└── shared/
```

## `components/ui/`

Contains low-level UI primitives, primarily based on shadcn/ui.

Examples:

```text
button.tsx
dialog.tsx
input.tsx
select.tsx
tabs.tsx
tooltip.tsx
dropdown-menu.tsx
```

## `components/shared/`

Contains reusable application-level components.

Examples:

```text
PageHeader
StatusBadge
SearchInput
FilterSelect
ConfirmDialog
EmptyState
ErrorState
LoadingState
Pagination
```

Feature-specific components should not be placed here.

---

# 9. Component Dependency Direction

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

A low-level component should not depend on a feature-level component.

For example:

```text
Button
```

must not import:

```text
FinalResultsTable
```

Dependency direction should remain predictable.

---

# 10. Layout Architecture

Application-level layouts should live in:

```text
layouts/
```

Example:

```text
AppLayout.tsx
```

The main layout may contain:

```text
Navigation
Header
Main Content Area
```

Feature pages should render inside the shared application layout rather than rebuilding navigation or page structure independently.

---

# 11. Routing Architecture

Use React Router for client-side routing.

Conceptually:

```text
App
 ↓
AppLayout
 ├── Dashboard
 ├── Final Results
 ├── Manual Inputs
 ├── Business Profile
 └── Service Taxonomy
```

Recommended route structure:

```text
/
 /final-results
 /manual-inputs
 /business-profile
 /service-taxonomy
```

Dashboard may use:

```text
/
```

as the application home route.

Exact deep-link query parameters should follow screen requirements.

Example:

```text
/final-results?tab=history&run=<execution-id>
```

for navigating from Dashboard to results belonging to an older pipeline run.

---

# 12. Route State

Important navigation state that users may need to:

* bookmark;
* refresh;
* share internally;
* navigate back to;

should generally be represented in the URL.

Examples:

```text
Selected tab
Selected pipeline run
Final Results filters
Pagination where refresh/bookmark behavior requires it
```

Temporary UI state should remain local.

Examples:

```text
Modal open/closed
Dropdown open/closed
Tooltip visibility
```

---

# 13. Authentication Architecture

The MVP uses one backend-managed authentication user. Authentication is
implemented with a persistent server-side session represented in the browser by
an HttpOnly cookie. The frontend never reads or stores the session credential.

```text
Startup → GET /api/v1/auth/session → AuthGate → protected AppLayout
Login → POST /api/v1/auth/login → initialize auth query + runtime CSRF token
Logout → POST /api/v1/auth/logout → clear auth state and protected query cache
401 → clear authenticated state → /login
CSRF 403 → refresh session once → do not replay the mutation automatically
```

`AuthProvider` owns the canonical authentication query and runtime-only CSRF
token. `AuthGate` protects application routes and preserves only validated
internal destinations. The shared API client always uses
`credentials: "include"` and injects `X-CSRF-Token` for authenticated
state-changing requests.

Roles, permissions, RBAC, signup, password recovery, refresh tokens, and browser
storage of credentials remain out of scope.

---

# 14. Server State

Server-derived data should be managed using:

```text
TanStack Query
```

Server state includes:

```text
Pipeline executions
Pipeline progress
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

TanStack Query should manage:

* fetching;
* caching;
* loading state;
* error state;
* refetching;
* mutations;
* invalidation.

---

# 15. Server State Rule

Do not copy server data into global client state without a specific requirement.

Avoid:

```text
API
 ↓
TanStack Query
 ↓
Global Store
 ↓
Component
```

Prefer:

```text
API
 ↓
TanStack Query
 ↓
Component
```

This avoids maintaining multiple copies of the same server state.

---

# 16. Local UI State

React local state should be the default for UI-only state.

Use:

```text
useState
useReducer
```

for examples such as:

```text
Modal visibility
Expanded taxonomy sections
Temporary form UI
Local selections
Dropdown state
Confirmation state
```

---

# 17. Global Client State

No dedicated global state library is required for the MVP.

Do not introduce:

```text
Redux
Zustand
MobX
```

unless a genuine application-wide client-state requirement appears.

The existence of data used by multiple components does not automatically justify a global store.

First determine whether the data is actually server state.

---

# 18. API Architecture

Backend communication should be centralized.

Recommended structure:

```text
api/
├── generated/
├── client.ts
└── errors.ts
```

Feature-specific endpoint functions remain within their features.

Example:

```text
features/
└── manual-inputs/
    └── api/
        └── manualInputsApi.ts
```

Conceptually:

```text
Feature
   ↓
Feature API Function
   ↓
Shared API Client
   ↓
Backend
```

---

# 19. Shared API Client

The Shared API Client should handle common HTTP concerns such as:

* API base URL;
* request configuration;
* JSON handling;
* standard headers;
* response parsing;
* common error normalization.

Use native `fetch` as the underlying HTTP implementation unless a concrete requirement justifies another client.

Feature-specific endpoint knowledge should not accumulate inside the generic API client.

The shared client should also preserve the backend HTTP status and stable
error code while normalizing errors for feature code.

---

# 20. Feature API Functions

API calls should use meaningful functions rather than raw `fetch` calls inside components.

Prefer:

```typescript
getFinalResults()
updatePublishStatus()
getManualInputs()
createManualInput()
startPipeline()
```

Avoid:

```typescript
fetch("/api/...")
```

directly throughout React components.

CSV export is a file-download operation rather than a JSON response. The API
layer must support the Final Results export filters and sorting, handle the
`413 FINAL_RESULT_EXPORT_LIMIT_EXCEEDED` response, and expose browser download
failures as a user-safe action error.

---

# 21. API Data Flow

Read flow:

```text
Backend API
      ↓
Shared API Client
      ↓
Feature API Function
      ↓
TanStack Query
      ↓
Page / Component
      ↓
UI
```

Write flow:

```text
User Action
      ↓
Component
      ↓
TanStack Mutation
      ↓
Feature API Function
      ↓
Backend
      ↓
Mutation Result
      ↓
Invalidate / Update Relevant Query
      ↓
UI Refresh
```

---

# 22. Query Organization

Feature queries should live close to their feature.

Example:

```text
features/final-results/
└── hooks/
    ├── useFinalResults.ts
    └── useUpdatePublishStatus.ts
```

Query keys should be predictable and centralized within the relevant feature.

Conceptually:

```text
finalResults
finalResults.latest
finalResults.history
finalResults.history(filters)
```

Avoid arbitrary query-key strings spread throughout components.

---

# 23. Backend Authority

The frontend must not recreate backend business rules.

Backend-authoritative areas include:

```text
Pipeline lifecycle
Pipeline stage state
Pipeline stage ordering
Manual Input eligibility
Final Results ordering
Final Results filtering
Pagination
Publish Status transitions
Validation
Allowed pipeline actions
Stable API error codes and HTTP statuses
```

The frontend may represent these rules visually but should not become an independent business-rules engine.

---

# 24. API Contract Boundary

Frontend code should depend on the backend's public API contract.

Where available, OpenAPI should be used to validate or generate API types.

Do not derive frontend API contracts from:

```text
Database schemas
Internal backend models
Private implementation details
Assumptions from UI requirements
```

---

# 25. Type Architecture

Types should live as close as practical to their ownership.

Feature-specific types:

```text
features/final-results/types/
features/manual-inputs/types/
```

Shared frontend-only application types:

```text
types/
```

Only genuinely cross-feature types belong in the global `types/` directory.
Backend request and response types must come from `src/api/generated/` rather
than being manually duplicated in this directory.

---

# 26. API Types vs UI Types

API response models and UI-specific models should not automatically be treated as identical.

Conceptually:

```text
Backend Response
      ↓
API Type
      ↓
Optional Mapping
      ↓
UI Model
      ↓
Component
```

Introduce mapping only where the UI genuinely requires a different representation.

Do not create mapping layers unnecessarily.

---

# 27. Forms Architecture

Use React Hook Form for forms where structured form handling provides value.

Use Zod where frontend schema validation is appropriate.

Conceptually:

```text
Form Component
      ↓
React Hook Form
      ↓
Zod Validation
      ↓
Mutation
      ↓
Backend Validation
```

Backend validation remains authoritative.

---

# 28. Form Ownership

Forms should remain inside the feature that owns them.

Examples:

```text
features/manual-inputs/components/AddManualInputForm.tsx

features/business-profile/components/AddCategoryForm.tsx
```

A generic form field may be shared.

A business-specific form should not be placed in the global component directory.

---

# 29. Error Handling Architecture

Errors should be handled at the appropriate level.

## Field-Level Errors

Use for:

```text
Required field
Invalid value
Validation failure
```

Display near the affected field.

## Feature-Level Errors

Use when a screen section cannot load.

Example:

```text
Unable to load Final Results.
Retry
```

## Action Errors

Use when an operation fails.

Examples:

```text
Unable to update Publish Status.
Unable to start pipeline.
Unable to upload file.
```

---

# 30. Error Normalization

Raw backend errors should not be displayed directly to users.

The API layer should normalize errors into a predictable frontend representation.

The normalized error should preserve, where available:

```text
HTTP status
Backend error code
Safe user-facing message
Validation details
```

Feature behavior must use the HTTP status and stable backend error code. It
must not parse backend messages or details to determine behavior. The frontend
must distinguish relevant `409` conflicts, `413` export-limit errors, and
`422` validation/filter errors from general server failures.

Conceptually:

```text
HTTP / Backend Error
      ↓
API Error Normalization
      ↓
User-Safe Error State
```

Technical details may be logged where appropriate but should not appear in the normal marketing UI.

---

# 31. Loading States

Loading should be represented at the smallest useful level.

Avoid blocking the entire application when only one section is loading.

Examples:

```text
Dashboard pipeline section loading
Final Results table loading
Business Profile categories loading
Service Taxonomy loading
```

Detailed loading visuals belong in the Design System.

---

# 32. Empty States

Empty states should distinguish between:

```text
No data exists
```

and:

```text
No results match current filters
```

These are different user situations and should not automatically use the same message.

---

# 33. Mutation Behaviour

Mutations should provide clear feedback.

General pattern:

```text
User Action
      ↓
Disable / Protect Duplicate Submission
      ↓
Submit Mutation
      ↓
Success or Error
      ↓
Refresh Relevant Data
```

Do not allow accidental duplicate requests from repeated clicks where the operation is not intended to be repeated.

---

# 34. Polling / Pipeline Progress

Pipeline progress is server state.

The frontend may periodically refetch pipeline state while a pipeline execution is active.

Conceptually:

```text
Pipeline Active
      ↓
Periodic Status Request
      ↓
Update Stage Display
      ↓
Pipeline Terminal State
      ↓
Stop Polling
```

The frontend should use the backend-returned execution status and should treat
`queued` and `running` as active states. Terminal statuses currently include
`completed`, `partial`, `failed`, and `abandoned`. A `202` response from the
start endpoint means that the execution was queued; it does not mean that the
pipeline has completed.

Polling should stop when the execution reaches one of those terminal states.

The frontend must not generate artificial progress percentages.

Exact polling intervals should be determined during implementation based on backend behavior and operational needs.

---

# 35. Styling Architecture

Tailwind CSS is the primary styling system.

Architecture:

```text
Design Tokens
      ↓
Tailwind CSS
      ↓
shadcn/ui
      ↓
Shared Components
      ↓
Feature Components
```

Visual rules should come from the Design System rather than being independently invented inside features.

---

# 36. CSS Usage

Prefer Tailwind utilities for normal application styling.

Global CSS should be limited primarily to:

* Tailwind setup;
* design tokens;
* root-level styles;
* typography defaults;
* unavoidable global behavior.

Avoid large feature-specific global CSS files.

---

# 37. Design Tokens

Reusable design decisions should be defined centrally.

Examples:

```text
Colors
Typography
Spacing
Radius
Shadows
Status colors
```

Do not repeatedly introduce arbitrary values inside feature components.

Exact token values belong in the Design System document.

---

# 38. shadcn/ui Usage

shadcn/ui provides the low-level component foundation.

Do not treat generated shadcn components as immutable third-party black boxes.

They may be adapted to match the approved Design System.

However, changes to shared primitives should be deliberate because they can affect multiple screens.

---

# 39. Responsive Architecture

Responsive behavior should be implemented through shared layout rules and Tailwind breakpoints.

Components should adapt to available space rather than relying on fixed desktop-only dimensions.

Detailed breakpoint and accessibility rules belong in the Responsive & Accessibility document.

---

# 40. Environment Configuration

Environment-specific values should be accessed through Vite environment configuration.

Example:

```text
import.meta.env.VITE_*
```

Possible configuration includes:

```text
API base URL
Environment identifier
Feature configuration
```

Do not hard-code staging or production URLs inside feature code.

---

# 41. Constants

Application constants should live in:

```text
constants/
```

only when they are genuinely shared.

Feature-specific constants should remain inside the feature.

Do not create frontend constants for backend-controlled values merely to duplicate backend business logic.

---

# 42. Utility Functions

Shared generic utilities should live under:

```text
lib/utils/
```

or an equivalent shared utility location.

Examples:

```text
Date formatting
String helpers
Generic formatting
```

Feature-specific utilities remain inside their feature.

Avoid creating a large generic `utils.ts` file containing unrelated functions.

---

# 43. Custom Hooks

Global reusable hooks may live under:

```text
hooks/
```

Feature-specific hooks should remain inside:

```text
features/<feature>/hooks/
```

Do not create a custom hook merely to move a few lines out of a component.

Hooks should represent meaningful reusable behavior.

---

# 44. Import Direction

Preferred dependency direction:

```text
app
 ↓
layouts / pages
 ↓
features
 ↓
shared components
 ↓
ui primitives
 ↓
shared libraries
```

Feature modules should avoid circular dependencies.

One feature should not directly reach deeply into another feature's internal files.

If functionality becomes genuinely shared, extract an appropriate shared abstraction.

---

# 45. Barrel Files

Avoid excessive use of broad `index.ts` barrel exports.

Direct imports are preferred when they make dependencies clearer.

Barrel files may be used selectively where they provide a clean public boundary for a feature or shared module.

---

# 46. Code Splitting

Primary screens may be route-level lazy-loaded if beneficial.

Conceptually:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

can become separate route bundles.

Do not introduce complex manual code-splitting before there is a measurable need.

---

# 47. Performance Principle

Start with simple architecture and optimize based on evidence.

Avoid premature use of:

```text
useMemo everywhere
useCallback everywhere
Complex caching
Custom virtualization
Global stores
Manual cache layers
```

Use these when actual application behavior justifies them.

---

# 48. Security Boundary

The frontend must be treated as an untrusted client. Authentication-aware UI
does not replace backend route protection or backend business-rule enforcement.

Never place secrets in frontend code or Vite environment variables.

Anything shipped to the browser must be considered visible to the user.
The CSRF token may be read by authenticated frontend JavaScript but must remain
in runtime memory only. The session credential remains in an HttpOnly cookie.

---

# 49. Logging

Normal production UI should not expose:

```text
Raw API responses
Stack traces
Database information
Internal backend identifiers unnecessarily
AI provider details
Prompts
Model configuration
```

Development logging should be intentional and should not leave unnecessary console output in production.

---

# 50. Architecture Guardrails

The following rules apply during MVP development:

1. Keep feature-specific code inside its feature.
2. Share components only when genuine reuse exists.
3. Keep backend communication centralized.
4. Do not make raw API calls throughout UI components.
5. Use TanStack Query for server state.
6. Use React local state for local UI state.
7. Do not introduce a global state library without a concrete requirement.
8. Keep backend business rules authoritative.
9. Do not duplicate server state unnecessarily.
10. Use TypeScript throughout application code.
11. Use Tailwind CSS as the primary styling system.
12. Use shadcn/ui as the UI primitive foundation.
13. Use Lucide React as the default icon library.
14. Keep API types aligned with the public backend contract.
15. Keep feature dependencies explicit.
16. Avoid premature abstractions.
17. Avoid speculative infrastructure for future features.
18. Do not introduce authentication architecture until authentication becomes part of product scope.

---

# 51. Target Architecture

```text
main.tsx
   │
   ▼
Application Providers
   │
   ▼
React Router
   │
   ▼
App Layout
   │
   ├─────────────────────────────────────┐
   │                                     │
   ▼                                     ▼
Pages / Features                    Shared UI
   │                                     │
   ▼                                     ▼
Feature Components                Application Components
   │                                     │
   └───────────────┬─────────────────────┘
                   │
                   ▼
            shadcn/ui
                   │
                   ▼
             Tailwind CSS


Feature Data Flow

Page / Component
      │
      ▼
TanStack Query / Mutation
      │
      ▼
Feature API Function
      │
      ▼
Shared API Client
      │
      ▼
Backend API
```

---

# 52. Architecture Decision Summary

| Area                 | Decision                                    |
| -------------------- | ------------------------------------------- |
| Architecture Style   | Feature-oriented                            |
| Framework            | React                                       |
| Language             | TypeScript                                  |
| Build Tool           | Vite                                        |
| Routing              | React Router                                |
| Styling              | Tailwind CSS                                |
| UI Foundation        | shadcn/ui                                   |
| UI Primitives        | Radix UI where required                     |
| Icons                | Lucide React                                |
| Server State         | TanStack Query                              |
| Local UI State       | React state                                 |
| Global State Library | Not required for MVP                        |
| Forms                | React Hook Form where appropriate           |
| Validation           | Zod where appropriate                       |
| HTTP                 | Native Fetch through centralized API client |
| Business Rules       | Backend authoritative                       |
| Authentication       | Single-user HttpOnly cookie session         |
| Feature Organization | By product feature                          |
| Testing Architecture | Defined separately                          |

Pipeline-run history and run-detail endpoints remain backend capabilities.
They may be embedded in Dashboard and Final Results without becoming
additional primary navigation screens in the five-screen MVP.

---

# 53. Architecture Decisions Deferred

The following do not need to be finalized in this document:

* exact Design System values;
* typography;
* colors;
* spacing scale;
* exact responsive breakpoints;
* exact component visual appearance;
* detailed API DTOs;
* exact query keys;
* exact polling interval;
* detailed form validation rules;
* test coverage requirements;
* production deployment implementation;
* future role-based authorization architecture.

These belong in their respective documents or implementation decisions.

---

# 54. Related Documents

```text
01. Product Scope & Screen Inventory
02. Frontend Tech Stack
03. Frontend Architecture
04. Design System
05. UX Behaviour Rules
06. Detailed Screen Specifications
07. Component Inventory
08. API Contract
09. Frontend Data Models / Types
10. Form & Validation Specification
11. Responsive & Accessibility Guidelines
12. Coding Standards
13. Testing Strategy
14. Performance & Security
15. Environment & Deployment
16. Definition of Done
```

This document defines **how the frontend is structurally organized**.

The next document should define **how the frontend visually looks and remains consistent**:

```text
04 - Design System.md
```
