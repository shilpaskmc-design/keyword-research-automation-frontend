# Definition of Done

> [!info] Document Status
> **Status:** MVP Definition of Done
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define the minimum conditions that must be satisfied before a frontend screen, feature, or change is considered complete.

---

# 1. Completion Principle

A feature is not complete only because it visually works.

It is complete when it satisfies:

```text
Product Requirement
      +
Backend Contract
      +
UX Behaviour
      +
Design System
      +
Accessibility
      +
Code Quality
      +
Verification
```

---

# 2. Scope Verification

Before marking work complete:

* [ ] Implementation matches the approved screen specification.
* [ ] No unapproved feature or workflow has been added.
* [ ] Required actions and states are implemented.
* [ ] Out-of-scope functionality has not been introduced.
* [ ] Backend-authoritative rules have not been recreated incorrectly in the frontend.

---

# 3. Visual Completion

* [ ] Layout follows the approved Design System.
* [ ] Tailwind CSS is used consistently.
* [ ] Approved semantic design tokens are used.
* [ ] shadcn/ui primitives are used where appropriate.
* [ ] Typography is consistent.
* [ ] Spacing is consistent.
* [ ] Status and urgency styling follows approved mappings.
* [ ] No unnecessary arbitrary styling values are introduced.
* [ ] Loading, empty, error, disabled, and success states are visually handled.

---

# 4. Responsive Completion

Verify at representative widths:

```text
375px
768px
1024px
1440px
```

Checklist:

* [ ] Core workflow works on desktop.
* [ ] Core workflow works on tablet.
* [ ] Core workflow remains usable on mobile.
* [ ] No unintended page-level horizontal overflow exists.
* [ ] Tables use controlled overflow where required.
* [ ] Actions remain accessible on smaller screens.
* [ ] Text and controls do not overlap.
* [ ] Long content wraps or expands safely.
* [ ] Dialogs remain within the usable viewport.

---

# 5. Accessibility Completion

* [ ] Page contains a clear `h1`.
* [ ] Heading hierarchy is logical.
* [ ] All interactive controls are keyboard reachable.
* [ ] Keyboard focus is visible.
* [ ] Focus order is logical.
* [ ] Form fields have accessible labels.
* [ ] Validation errors are associated with relevant fields.
* [ ] Icon-only controls have accessible names.
* [ ] Color is not the only indicator of state.
* [ ] Dialog focus behaviour works correctly.
* [ ] Expandable controls expose expanded/collapsed state.
* [ ] Tables use semantic markup.
* [ ] Important asynchronous states have readable text.
* [ ] Core workflow can be completed without a mouse.
* [ ] WCAG 2.1 AA requirements are respected for MVP scope.
* [ ] Skip-to-main-content link works.
* [ ] Important asynchronous updates use appropriate live-region behavior.
* [ ] Important errors are not communicated only through toasts.
* [ ] Small-screen table row actions remain reachable.

---

# 6. API Integration Completion

* [ ] Endpoint exists in the approved public API/OpenAPI contract.
* [ ] Generated API types are used at request/response boundaries.
* [ ] No generated API file was manually edited.
* [ ] Feature API function is used instead of raw API calls from the component.
* [ ] Shared API Client is used.
* [ ] Backend-returned identifiers are used correctly.
* [ ] Backend enum values remain separate from frontend display labels.
* [ ] Nullable values are handled explicitly.
* [ ] Unknown backend values do not crash the UI.
* [ ] Backend ordering/filtering/pagination rules are preserved.
* [ ] Backend-authoritative counts are not recalculated from visible frontend data.
* [ ] `202` pipeline responses are treated as queued, not completed.
* [ ] `409` conflicts show safe conflict feedback.
* [ ] `413` export-limit errors ask the user to narrow filters.
* [ ] `422` validation/filter errors are mapped appropriately.

---

# 7. Query and Server-State Completion

For TanStack Query based functionality:

* [ ] Query key contains every server-affecting scope/filter.
* [ ] Loading state is handled.
* [ ] Error state is handled.
* [ ] Empty state is handled where applicable.
* [ ] Successful mutations invalidate the correct query scopes.
* [ ] Server data is not unnecessarily duplicated into local/global state.
* [ ] Polling stops when the relevant backend state becomes terminal.
* [ ] Duplicate business mutations are prevented.
* [ ] Polling continues for `queued`/`running` and stops for
  `completed`/`partial`/`failed`/`abandoned`.

---

# 8. Forms and Validation Completion

For any form:

* [ ] Required fields are validated.
* [ ] Whitespace-only required values are rejected.
* [ ] Optional values are handled according to API expectations.
* [ ] Frontend validation does not invent backend business rules.
* [ ] Backend validation errors are mapped where possible.
* [ ] Failed submissions preserve entered data.
* [ ] Duplicate submission is prevented.
* [ ] Successful submission resets/closes the form appropriately.
* [ ] Form values map correctly to backend request fields.
* [ ] Users are not required to enter technical formats such as JSON manually.

For Excel upload:

* [ ] Only XLSX files are accepted.
* [ ] The backend-supported XLSX content type is sent.
* [ ] Invalid records are not shown as accepted.
* [ ] Partial valid/invalid results are displayed correctly.
* [ ] Failed requests preserve the selected file for retry.

---

# 9. Search, Filters, and Pagination

Where applicable:

* [ ] Search uses the backend-supported contract.
* [ ] Active search/filter state is visible.
* [ ] Filter changes reset pagination appropriately.
* [ ] Pagination preserves active search and filters.
* [ ] URL-backed state survives refresh where required.
* [ ] Invalid URL/query values fail safely.
* [ ] Clear Search / Clear Filters restores the defined default state.

For CSV export:

* [ ] Current filters and scope are preserved.
* [ ] All matching rows are exported, not only the visible page.
* [ ] Browser download succeeds or fails with clear feedback.
* [ ] `413 FINAL_RESULT_EXPORT_LIMIT_EXCEEDED` is handled.

---

# 10. Error Handling Completion

* [ ] User-facing errors are safe and understandable.
* [ ] Raw exceptions are not displayed.
* [ ] Stack traces are not displayed.
* [ ] Internal backend implementation details are not displayed.
* [ ] Stable HTTP status/error codes are used where behaviour depends on errors.
* [ ] Frontend logic does not parse arbitrary backend message strings.
* [ ] Retry is available where recovery is appropriate.
* [ ] Network/server failures do not leave the UI in an incorrect confirmed state.

---

# 11. Business-Sensitive Actions

For actions such as:

```text
Start Pipeline
Publish Status Update
Delete Category
Excel Upload
```

verify:

* [ ] Duplicate submission is prevented.
* [ ] Backend confirmation is received before treating the action as complete.
* [ ] Failed mutation restores/preserves the last confirmed state.
* [ ] Destructive confirmation is used where required.
* [ ] No optimistic update is used unless explicitly approved.
* [ ] Relevant datasets refresh after success.

---

# 12. Component Quality

* [ ] Feature-specific components remain inside their feature.
* [ ] Shared components are genuinely reusable.
* [ ] UI primitives do not contain feature business logic.
* [ ] Components have clear responsibilities.
* [ ] Props are explicitly typed.
* [ ] Stable backend IDs are used for React list keys.
* [ ] No unnecessary generic abstraction has been introduced.
* [ ] Existing shared components are reused where appropriate.

---

# 13. Code Quality

Before completion:

* [ ] No unnecessary `any` exists.
* [ ] No unnecessary non-null assertions exist.
* [ ] No dead code remains.
* [ ] No commented-out implementation remains.
* [ ] No temporary debug code remains.
* [ ] No unnecessary `console.log` / `console.debug` remains.
* [ ] TODO comments are specific and still relevant.
* [ ] No hard-coded API origin exists.
* [ ] No secret exists in frontend code or environment variables.
* [ ] Naming follows Coding Standards.
* [ ] Imports follow approved dependency boundaries.

---

# 14. Required Technical Checks

For frontend source changes, the relevant checks must pass:

```text
TypeScript Check
ESLint
Production Build
Relevant Tests
```

Checklist:

* [ ] TypeScript check passes.
* [ ] ESLint passes.
* [ ] Production build completes successfully.
* [ ] Relevant automated tests pass.
* [ ] No known blocking browser/runtime error remains.

---

# 15. Manual Verification

The developer should manually verify the actual user flow.

Minimum checks:

* [ ] Screen loads successfully.
* [ ] Primary action works.
* [ ] Secondary actions work.
* [ ] Loading state appears correctly.
* [ ] Empty state behaves correctly.
* [ ] Error state behaves correctly.
* [ ] Success path behaves correctly.
* [ ] Failed request behaves correctly.
* [ ] Browser refresh behaves correctly.
* [ ] Browser Back/Forward behaves correctly where URL state is used.
* [ ] Keyboard-only interaction works.
* [ ] Responsive layout has been checked.

---

# 16. Feature-Specific Verification

The relevant screen specification remains the source of truth for feature-specific acceptance.

Examples:

```text
Dashboard
→ Pipeline start and progress behaviour

Final Results
→ Latest Results, Open Items, History, status update, CSV export

Manual Inputs
→ Manual entry, Excel upload, filters, invalid records

Business Profile
→ Category and entry actions

Service Taxonomy
→ Search, expand/collapse, read-only behaviour
```

A feature is not complete if its detailed screen specification is only partially implemented.

---

# 17. Known Limitations

A feature may still be considered complete when a limitation is:

```text
Explicitly outside MVP scope
OR
Documented as a known backend/product dependency
```

It must not be silently left unfinished.

Known limitations should be documented in the relevant issue/task or product documentation.

---

# 18. Blockers to Completion

A feature must **not** be marked complete if any of the following remain:

```text
Broken production build
TypeScript errors
Blocking lint errors
Broken primary workflow
Incorrect API contract usage
Known data corruption risk
Unhandled critical error state
Missing required validation
Inaccessible primary action
Unintended horizontal page overflow
Missing required responsive behaviour
Security-sensitive frontend secret
```

---

# 19. Definition of Done Checklist

Use this condensed checklist during implementation:

## Product

* [ ] Matches approved scope
* [ ] Matches screen specification
* [ ] No unapproved functionality added

## UI / UX

* [ ] Design System followed
* [ ] Loading handled
* [ ] Empty handled
* [ ] Error handled
* [ ] Disabled handled
* [ ] Success handled

## Responsive / Accessibility

* [ ] Responsive widths checked
* [ ] Keyboard workflow works
* [ ] Focus visible
* [ ] Labels and errors accessible
* [ ] No color-only meaning
* [ ] No unintended page overflow

## API / Data

* [ ] OpenAPI contract followed
* [ ] Generated types used
* [ ] Backend IDs used correctly
* [ ] Null/unknown values handled
* [ ] Query keys complete
* [ ] Correct caches invalidated

## Forms / Actions

* [ ] Validation correct
* [ ] Duplicate submission prevented
* [ ] Failed submission preserves state
* [ ] Backend confirmation used for sensitive mutations

## Code Quality

* [ ] Typecheck passes
* [ ] ESLint passes
* [ ] Production build passes
* [ ] Relevant tests pass
* [ ] Dead/debug code removed

## Manual QA

* [ ] Main workflow tested
* [ ] Error flow tested
* [ ] Refresh/navigation tested
* [ ] Responsive behaviour tested

---

# 20. Completion Rule

A task may be marked:

```text
DONE
```

only when:

```text
Required functionality works
+
Relevant Definition of Done checks pass
+
No known blocking defect remains
```

Minor non-blocking enhancements should be tracked separately rather than preventing completion of an otherwise accepted MVP feature.

---

# 21. Related Documents

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

This document defines **the minimum standard required before a frontend feature or screen can be considered complete for the MVP**.
