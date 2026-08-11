# Frontend Tech Stack

> [!info] Document Status  
> **Status:** Approved  
> **Product:** Keyword Research Automation Frontend  
> **Purpose:** Define the frontend technologies and technical tooling used to build the application.

---

# 1. Core Stack

|Area|Technology|Status|
|---|---|---|
|Frontend Framework|React|Approved|
|Build Tool|Vite|Approved|
|Language|TypeScript|Approved|
|Styling|Tailwind CSS|Approved|
|UI Components|shadcn/ui|Approved|
|UI Primitives|Radix UI where required|Supporting|
|Icons|Lucide React|Approved|

---

# 2. Application Foundation

## React

React will be used for:

- screen composition;
    
- reusable UI components;
    
- forms and modals;
    
- interactive tables;
    
- frontend state;
    
- user interactions.
    

Use functional components and React Hooks.

---

## Vite

Vite will be used for:

- local development;
    
- frontend builds;
    
- environment variables;
    
- production bundling.
    

Environment variables should follow:

```text
VITE_*
```

Environment-specific configuration must not be hard-coded.

---

## TypeScript

All application source code should use TypeScript.

Preferred extensions:

```text
.ts
.tsx
```

TypeScript should be used for:

- API request types;
    
- API response types;
    
- component props;
    
- application models;
    
- reusable utility types;
    
- enums and unions;
    
- form values;
    
- frontend state.
    

Avoid unnecessary use of:

```typescript
any
```

---

# 3. Routing

## Technology

```text
React Router
```

Status:

```text
Approved
```

Primary application screens:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Exact routes and routing architecture will be defined in the Frontend Architecture document.

---

# 4. Styling

## Technology

```text
Tailwind CSS
```

Status:

```text
Approved
```

Tailwind CSS will be the primary styling system.

It will be used for:

- layout;
    
- spacing;
    
- typography;
    
- colors;
    
- responsive behavior;
    
- borders;
    
- radius;
    
- shadows;
    
- component states.
    

---

## Styling Principle

Avoid arbitrary styling values unless genuinely required.

Avoid patterns such as:

```tsx
mt-[13px]
text-[17px]
bg-[#1473E6]
```

when the same requirement can be represented through the approved design system.

Reusable values should come from the Design System.

Examples:

```text
Colors
Typography
Spacing
Border Radius
Shadows
Breakpoints
Status Colors
```

---

# 5. UI Component System

## Technology

```text
shadcn/ui
```

Status:

```text
Approved
```

shadcn/ui will provide reusable UI foundations for components such as:

- buttons;
    
- dialogs;
    
- dropdowns;
    
- selects;
    
- tabs;
    
- tooltips;
    
- popovers;
    
- form controls;
    
- menus.
    

---

## Application Component Layer

Screens should not depend directly on scattered low-level component implementations.

Reusable application components should be created where appropriate.

Examples:

```text
Button
PageHeader
Modal
ConfirmDialog
StatusBadge
SearchInput
FilterSelect
DataTable
Pagination
EmptyState
ErrorState
LoadingState
```

Conceptually:

```text
Tailwind CSS
      ↓
Design System
      ↓
shadcn/ui / UI Primitives
      ↓
Application Components
      ↓
Feature Components
      ↓
Screens
```

---

# 6. UI Primitives

## Technology

```text
Radix UI
```

Status:

```text
Supporting
```

Radix UI may be used through shadcn/ui or directly where required for accessible interactive primitives.

Typical use cases:

```text
Dialog
Popover
Dropdown
Tooltip
Tabs
Select
```

Do not introduce another competing UI primitive library without a specific requirement.

---

# 7. Icons

## Technology

```text
Lucide React
```

Status:

```text
Approved
```

Lucide React should be the default application icon library.

Avoid mixing multiple icon libraries.

Exact icon selection and usage rules belong in the Design System.

---

# 8. Server State / API Data

## Technology

```text
TanStack Query
```

Status:

```text
Approved
```

Use for:

- API fetching;
    
- caching;
    
- refetching;
    
- loading states;
    
- error states;
    
- mutations;
    
- cache invalidation.
    

Relevant data includes:

```text
Pipeline State
Pipeline Progress
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Backend state remains authoritative.

---

# 9. Client State

Default approach:

```text
React local state first
```

Use:

```text
useState
useReducer
```

for local UI state such as:

- modal visibility;
    
- selected tabs;
    
- expanded sections;
    
- temporary form state;
    
- local controls.
    

Do not introduce Redux, Zustand, or another global-state library unless a genuine cross-application state requirement appears.

Do not duplicate server state unnecessarily into global client state.

---

# 10. Forms

## Technology

```text
React Hook Form
```

Status:

```text
Approved
```

Use where structured form handling provides value.

Relevant examples:

- Add Manual Input;
    
- Add Business Profile Category;
    
- future structured forms.
    

Very small forms may use local React state when simpler.

---

# 11. Validation

## Technology

```text
Zod
```

Status:

```text
Approved
```

Zod may be used for:

- frontend form validation;
    
- structured schemas;
    
- TypeScript-safe validation.
    

Principle:

```text
Frontend validation improves UX.
Backend validation remains authoritative.
```

Frontend validation must not replace backend validation.

---

# 12. HTTP / API Layer

Preferred approach:

```text
Native fetch
```

with a thin application-specific API client.

Do not introduce Axios unless a concrete requirement justifies it.

API communication should be centralized.

Conceptually:

```text
Screen / Feature
      ↓
Query / Mutation
      ↓
API Client
      ↓
Backend API
```

UI components should not contain scattered raw API calls.

---

# 13. API Contract

The backend public API contract should remain the source of truth.

Where available:

```text
OpenAPI
```

should be used to validate or generate frontend API types.

Do not manually invent:

- response fields;
    
- backend statuses;
    
- enum values;
    
- request structures;
    
- validation behavior.
    

---

# 14. Tables

Data-heavy screens include:

```text
Final Results
Manual Inputs
Recent Pipeline Runs
```

Required table capabilities include:

- pagination where required;
    
- backend-driven filtering;
    
- backend-driven search;
    
- status display;
    
- loading states;
    
- empty states;
    
- error states;
    
- responsive handling.
    

---

## Table Library

Candidate:

```text
TanStack Table
```

Status:

```text
Approved
```

Introduce it only if application table requirements justify the additional abstraction.

Do not add it automatically.

---

# 15. Testing

Approved stack:

|Testing Area|Technology|
|---|---|
|Unit Tests|Vitest|
|React Component Tests|React Testing Library|
|End-to-End Tests|Playwright|

Detailed coverage requirements belong in the Testing Strategy document.

---

# 16. Code Quality

## ESLint

Use for:

- React rules;
    
- TypeScript rules;
    
- detecting problematic code;
    
- maintaining code-quality standards.
    

## Prettier

Use for consistent code formatting.

Detailed conventions belong in the Coding Standards document.

---

# 17. Package Manager

## Technology

```text
npm
```

Status:

```text
Approved
```

Use one package manager consistently.

Do not mix:

```text
npm
yarn
pnpm
```

The package lockfile should be committed to source control.

---

# 18. Environment Configuration

Expected environments:

```text
Development
Staging
Production
```

Environment-specific configuration should use Vite environment variables.

Examples:

```text
API base URL
environment identifier
feature configuration
```

Do not commit secrets into frontend source control.

---

# 19. Approved / Proposed Stack

```text
React
    ↓
TypeScript
    ↓
Vite
    ↓
React Router
    ↓
Tailwind CSS
    ↓
shadcn/ui
    ↓
Application Component Layer
    ↓
TanStack Query
    ↓
React Hook Form
    ↓
Zod
    ↓
Native Fetch / API Client
    ↓
Backend API
```

Supporting technologies:

```text
Radix UI
Lucide React
Vitest
React Testing Library
Playwright
ESLint
Prettier
npm
```

---

# 20. Technology Decision Status

|Technology / Area|Decision|
|---|---|
|React|Approved|
|Vite|Approved|
|TypeScript|Approved|
|Tailwind CSS|Approved|
|shadcn/ui|Approved|
|Radix UI|Supporting|
|Lucide React|Approved|
|React Router|Approved|
|TanStack Query|Approved|
|React local state|Default|
|Global state library|Not currently required|
|React Hook Form|Approved|
|Zod|Approved|
|Native Fetch / API Client|Approved|
|TanStack Table|Approved|
|Vitest|Approved|
|React Testing Library|Approved|
|Playwright|Approved|
|ESLint|Approved|
|Prettier|Approved|
|npm|Approved|

---

# 21. Tech Stack Guardrails

During development:

- use React + TypeScript consistently;
    
- use Tailwind CSS as the primary styling system;
    
- use shadcn/ui as the UI component foundation;
    
- use Lucide React as the default icon library;
    
- avoid arbitrary design values where design tokens exist;
    
- avoid multiple competing UI libraries;
    
- avoid multiple styling systems;
    
- avoid unnecessary global state;
    
- separate server state from UI state;
    
- centralize backend communication;
    
- keep backend business rules authoritative;
    
- do not duplicate backend logic unnecessarily;
    
- do not introduce dependencies without a concrete requirement.
    

---

# 22. Related Documents

This document defines **which technologies are used**.

Detailed implementation decisions belong in:

```text
Frontend Architecture
Design System
UX Behaviour Rules
Component Inventory
API Contract
Frontend Data Models / Types
Coding Standards
Testing Strategy
Performance & Security
Environment & Deployment
```
