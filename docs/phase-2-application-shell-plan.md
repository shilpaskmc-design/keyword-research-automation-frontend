# Implementation Plan — Phase 2: Application Shell

> [!info] Document Status
> **Status:** Approved for implementation
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Build the shared application shell, routing, accessible navigation, placeholder pages, and route fallback without introducing feature business logic or backend integration.

---

# 1. Goal

Build the common frontend application structure so all five MVP screens can be reached through a responsive and accessible shell.

Milestone:

```text
Five primary routes work
+
Shared application layout works
+
Desktop and mobile navigation work
+
Skip link and active-route behavior work
+
Unknown routes render a 404 page
```

---

# 2. Current Baseline

Phase 0 and Phase 1 have already established the frontend project and Design System foundation.

Existing application files include:

```text
src/main.tsx
src/app/App.tsx
src/app/providers.tsx
src/app/router.tsx
src/dev/DesignSystemPreview.tsx
src/styles/globals.css
```

Current package versions:

```text
react-router-dom 7.18.2
react-router 7.18.2
```

Use the React Router 7 Data Router API available in the installed version. Do
not upgrade or downgrade React Router as part of Phase 2.

---

# 3. Scope

Create or complete:

```text
src/app/App.tsx
src/app/router.tsx
src/app/NotFoundPage.tsx
src/layouts/AppLayout.tsx
src/components/shared/AppNavigation.tsx
src/components/shared/PageHeader.tsx
```

Create placeholder pages:

```text
src/features/dashboard/pages/DashboardPage.tsx
src/features/final-results/pages/FinalResultsPage.tsx
src/features/manual-inputs/pages/ManualInputsPage.tsx
src/features/business-profile/pages/BusinessProfilePage.tsx
src/features/service-taxonomy/pages/ServiceTaxonomyPage.tsx
```

Configure routes:

```text
/                       → Dashboard
/final-results          → Final Results
/manual-inputs          → Manual Inputs
/business-profile       → Business Profile
/service-taxonomy       → Service Taxonomy
*                       → Not Found
```

---

# 4. Explicitly Out of Scope

Do not implement during Phase 2:

```text
Backend API requests
Generated API types
TanStack Query feature hooks
Feature mutations
Dashboard polling
Forms
Tables
CSV export
Business Profile CRUD
Manual Input creation or upload
Final Results filtering or publishing
Service Taxonomy data/search
Authentication or roles
Production hosting rewrites
Route loaders or actions
SSR or React Router framework mode
```

Do not add mock backend contracts or invented data.

---

# 5. Step 1 — Verify the Existing Baseline

Read and inspect:

```text
AGENTS.md
docs/frontend-architecture.md
docs/design-system.md
docs/ux-behaviour-rules.md
docs/component-inventory.md
docs/responsive-and-accessibility-guidelines.md
docs/coding-standards.md
docs/definition-of-done.md
src/main.tsx
src/app/App.tsx
src/app/providers.tsx
src/app/router.tsx
src/styles/globals.css
tailwind.config.cjs
```

Confirm:

```text
AppProviders wraps App
Tailwind and global styles load
The @/ path alias works
Existing Phase 1 assets remain intact
No unrelated changes are present in the intended files
```

Run the existing baseline checks before editing:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Record any pre-existing failure before continuing.

---

# 6. Step 2 — Disconnect the Design System Preview

`src/app/App.tsx` currently renders `DesignSystemPreview`.

Change the application root so it renders the router instead.

Do not delete:

```text
src/dev/DesignSystemPreview.tsx
```

The preview may remain as a development reference, but it must not remain mounted in the production application shell.

---

# 7. Step 3 — Configure React Router

Use the Data Router API from the installed React Router 7.18.2 packages:

```text
createBrowserRouter
RouterProvider
Outlet
NavLink
```

Ownership:

```text
src/app/router.tsx
→ creates and exports the router

src/app/App.tsx
→ renders RouterProvider

src/main.tsx
→ renders AppProviders and App
```

Target flow:

```text
main.tsx
    ↓
AppProviders
    ↓
App
    ↓
RouterProvider
    ↓
AppLayout
    ↓
Outlet
```

Use nested routes under `AppLayout`.

Do not add:

```text
loaders
actions
route-level API calls
authentication guards
SSR
framework mode
```

---

# 8. Step 4 — Create AppLayout

Create:

```text
src/layouts/AppLayout.tsx
```

Responsibilities:

```text
Render the skip link
Render AppNavigation
Provide the shared page shell
Render route content through Outlet
Provide main#main-content
Keep layout responsive
```

Conceptual structure:

```text
AppLayout
├── Skip to main content
├── AppNavigation
└── main#main-content
    └── Outlet
```

The skip link should:

```text
Appear before navigation in DOM order
Remain visually hidden until focused
Target #main-content
Have a visible focus style
```

The main region should be keyboard-focusable when needed so skip-link behavior is reliable.

---

# 9. Step 5 — Build Desktop Navigation

Create:

```text
src/components/shared/AppNavigation.tsx
```

Navigation items:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Use `NavLink` for every primary navigation item.

Rules:

```text
Use NavLink active state
Do not maintain a second active-route state
Do not store active navigation in React state
Do not store navigation state in TanStack Query
Use end matching for Dashboard /
Preserve aria-current="page" behavior
Use semantic nav markup
Keep all links keyboard accessible
```

Lucide icons may be used where they improve recognition, but visible text labels must remain.

---

# 10. Step 6 — Build Responsive Mobile Navigation

Do not install:

```text
Sheet
Drawer
Another UI primitive library
```

Use the existing Dialog primitive for the mobile navigation overlay because it already provides:

```text
Focus trapping
Escape handling
Focus restoration
Accessible dialog behavior
```

Mobile navigation state remains local to `AppNavigation` or a small shell-level hook.

Requirements:

```text
Menu button has an accessible name
Menu button exposes aria-expanded
All five routes remain available
Active route remains visible
Dialog closes after route selection
Escape closes the dialog
Focus returns to the menu trigger
No page-level horizontal overflow
```

Do not hand-build modal focus management.

---

# 11. Step 7 — Create PageHeader

Create:

```text
src/components/shared/PageHeader.tsx
```

Props:

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
```

Responsibilities:

```text
Render the page h1
Render an optional description
Render an optional action area
Stack actions on narrow screens
Keep heading hierarchy semantic
```

`PageHeader` owns the page `<h1>`. Placeholder pages must not render a second `<h1>`.

---

# 12. Step 8 — Create Placeholder Pages

Create one feature-owned page for each MVP route.

Each placeholder page should:

```text
Render PageHeader
Use the approved screen title
Provide a short product-appropriate description
Render a simple placeholder message
Avoid API calls
Avoid mock data
Avoid feature-specific components that belong to later phases
```

Approved titles:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

The placeholder content should make it clear that feature implementation will arrive in later phases without exposing technical/backend details to normal users.

---

# 13. Step 9 — Create NotFoundPage

Create:

```text
src/app/NotFoundPage.tsx
```

Keep it application-owned because it exists specifically for routing.

It should:

```text
Render a clear h1
Explain that the page was not found
Provide a link back to Dashboard
Use shared styling/components where appropriate
Remain keyboard accessible
```

Configure it as the `*` fallback route.

---

# 14. Visual Scope

Implement a clean, restrained shell using the approved Design System.

Do not invent elaborate application chrome. Follow detailed screen sketches where they define navigation layout; otherwise use a simple shell that can evolve without restructuring routes or features.

Phase 2 visual requirements:

```text
Consistent page padding
Readable navigation
Clear active route
Responsive menu
Visible focus states
Semantic tokens
No arbitrary visual system
```

Polished feature-screen visuals belong to later feature phases.

---

# 15. Step 10 — Manual Verification

Verify routes:

```text
/                       renders Dashboard
/final-results          renders Final Results
/manual-inputs          renders Manual Inputs
/business-profile       renders Business Profile
/service-taxonomy       renders Service Taxonomy
/unknown-route          renders Not Found
```

Verify navigation:

```text
Every primary link works
Dashboard uses exact active matching
Only the current route is active
aria-current is present on the active link
Browser Back/Forward works
Keyboard navigation works
```

Verify accessibility:

```text
Skip link moves focus to main content
Every page has exactly one h1
Navigation has an accessible name
Mobile menu trigger has an accessible name
Mobile dialog traps focus
Escape closes the mobile dialog
Focus returns to the trigger
Visible focus styles remain intact
```

Verify responsive behavior at:

```text
375px
768px
1024px
1440px
```

Check:

```text
No unintended page-level horizontal overflow
Navigation remains usable
Page headers wrap/stack correctly
Main content remains readable
All route actions remain reachable
```

Verify direct URL refresh under Vite development or preview for each primary route.

Do not add production Nginx/server fallback configuration in this phase. SPA fallback configuration belongs to deployment work.

---

# 16. Step 11 — Automated Verification

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

If `package.json` or `package-lock.json` changes unexpectedly, inspect the change and run:

```bash
npm audit
```

`npm audit` is optional when Phase 2 makes no dependency changes.

Do not claim a check passed unless it was actually run.

---

# 17. Expected File Structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   └── NotFoundPage.tsx
│
├── layouts/
│   └── AppLayout.tsx
│
├── components/
│   └── shared/
│       ├── AppNavigation.tsx
│       └── PageHeader.tsx
│
└── features/
    ├── dashboard/
    │   └── pages/
    │       └── DashboardPage.tsx
    ├── final-results/
    │   └── pages/
    │       └── FinalResultsPage.tsx
    ├── manual-inputs/
    │   └── pages/
    │       └── ManualInputsPage.tsx
    ├── business-profile/
    │   └── pages/
    │       └── BusinessProfilePage.tsx
    └── service-taxonomy/
        └── pages/
            └── ServiceTaxonomyPage.tsx
```

---

# 18. Implementation Sequence

```text
1. Verify Phase 1 baseline
        ↓
2. Disconnect DesignSystemPreview from App
        ↓
3. Configure React Router 7 Data Router
        ↓
4. Create AppLayout + Outlet + skip link
        ↓
5. Build desktop AppNavigation with NavLink
        ↓
6. Add mobile navigation with existing Dialog
        ↓
7. Build PageHeader
        ↓
8. Add five placeholder pages
        ↓
9. Add NotFoundPage
        ↓
10. Verify routes, keyboard behavior, and responsive layout
        ↓
11. Run typecheck, lint, format check, and production build
```

---

# 19. Completion Criteria

Phase 2 is complete only when:

```text
All five primary routes render
404 fallback renders
AppLayout is shared by all routes
AppNavigation uses NavLink
Dashboard uses exact active matching
Desktop and mobile navigation work
Skip-to-main-content works
Every page has one h1 through PageHeader
DesignSystemPreview is no longer mounted
No new navigation primitive dependency was added
No feature API/business logic was introduced
Responsive and keyboard checks pass
Typecheck passes
ESLint passes
Format check passes
Production build passes
No known blocking defect remains
```

Do not commit or push unless explicitly authorized.
