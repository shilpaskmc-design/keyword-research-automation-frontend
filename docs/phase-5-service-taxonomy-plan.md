# Implementation Plan — Phase 5: First Vertical Slice — Service Taxonomy

> [!info] Document Status
> **Status:** Approved for implementation
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Implement the first complete production feature slice using the API Foundation, TanStack Query, shared components, and the approved Service Taxonomy UX.

---

# 1. Goal

Implement Service Taxonomy end-to-end:

```text
Generated OpenAPI Contract
        ↓
Feature API Function
        ↓
TanStack Query Hook
        ↓
Service Taxonomy Page
        ↓
Client-side Search
        ↓
Expand / Collapse
        ↓
Loading / Error / Empty States
        ↓
Responsive + Accessible UI
```

Milestone:

```text
First production-quality frontend screen complete
```

Service Taxonomy is a good first vertical slice because it is fully read-only and validates the frontend architecture without mutations, forms, uploads, or workflow state.

---

# 2. Current Baseline

Completed:

```text
Phase 0 — Repository Setup
Phase 1 — Design System Foundation
Phase 2 — Application Shell
Phase 3 — Shared Application Components
Phase 4 — API Foundation
```

Already available:

```text
React Router shell
PageHeader
SearchInput
EmptyState
ErrorState
LoadingState
Shared API Client
Normalized ApiError
Generated OpenAPI types
TanStack Query
QueryClientProvider
Design System primitives
```

Existing route:

```text
/service-taxonomy
```

Replace the current placeholder page with the production screen.

---

# 3. Sources of Truth

Before implementation, read:

```text
AGENTS.md
Service Taxonomy Screen Specification
docs/component-inventory.md
docs/api-contract.md
docs/frontend-architecture.md
docs/frontend-data-models-and-types.md
docs/ux-behaviour-rules.md
docs/responsive-and-accessibility-guidelines.md
docs/coding-standards.md
docs/definition-of-done.md
```

The generated OpenAPI contract is authoritative for exact endpoint paths, response types, nullability, and field names.

---

# 4. Product Rules

Service Taxonomy is read-only.

Backend endpoint:

```http
GET /api/v1/service-taxonomy
```

Hierarchy:

```text
Service Area
    ↓
Service Offering
    ↓
SEO Query
```

The current public API does not provide taxonomy search parameters, so search must remain frontend-side over the complete hierarchy. Matching nested offerings or SEO Queries must reveal their parent Service Area.

Do not implement:

```text
Add
Edit
Delete
Rename
Reorder
Drag and drop
Mutation endpoints
Taxonomy search endpoint
```

---

# 5. Expected Feature Structure

```text
src/features/service-taxonomy/
├── api/
│   └── serviceTaxonomyApi.ts
├── components/
│   ├── TaxonomyToolbar.tsx
│   ├── ServiceAreaList.tsx
│   ├── ServiceAreaCard.tsx
│   ├── ServiceOfferingList.tsx
│   ├── ServiceOfferingItem.tsx
│   └── ExpandCollapseAllButton.tsx
├── hooks/
│   └── useServiceTaxonomy.ts
├── pages/
│   └── ServiceTaxonomyPage.tsx
├── types/
│   └── serviceTaxonomy.ts       # only if genuinely required
└── utils/
    └── filterServiceTaxonomy.ts
```

Approved components:

```text
TaxonomyToolbar
ServiceAreaList
ServiceAreaCard
ServiceOfferingList
ServiceOfferingItem
ExpandCollapseAllButton
```

These are already defined in the Component Inventory.

Do not create additional abstractions unless implementation genuinely requires them.

---

# 6. Explicitly Out of Scope

Do not implement:

```text
Backend modifications
Taxonomy mutations
Server-side taxonomy search
Pagination
Sorting controls
Reordering
Forms
Toasts
Authentication
Role checks
Analytics
Charts
Pipeline diagnostics
Technical metadata
New shared components
New UI primitives
New runtime dependencies
```

---

# 7. Baseline Verification

Before editing:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

Inspect:

```text
src/features/service-taxonomy/
src/api/client.ts
src/api/errors.ts
src/api/generated/schema.d.ts
src/lib/query/client.ts
src/components/shared/SearchInput.tsx
src/components/shared/EmptyState.tsx
src/components/shared/ErrorState.tsx
src/components/shared/LoadingState.tsx
src/components/shared/PageHeader.tsx
```

Record any pre-existing failures separately.

---

# 8. Audit the Generated Contract

Inspect:

```text
src/api/generated/schema.d.ts
```

Find the generated operation for:

```http
GET /api/v1/service-taxonomy
```

Confirm:

```text
Operation ID
Success response
Response envelope
Service Area schema
Service Offering schema
seo_query type/nullability
Error responses
```

Current approved contract expects Service Areas with:

```text
service_area_id
name
offerings
```

and Service Offerings with:

```text
service_offering_id
name
seo_query
```

Areas without offerings should return:

```text
offerings: []
```

Offering count is frontend-derived from:

```typescript
offerings.length
```

Do not invent an `offering_count` field.

---

# 9. Types and Mapping Rules

Use generated OpenAPI types at the API boundary.

Prefer generated:

```text
paths
operations
components
```

Do not duplicate transport DTOs manually.

Default:

```text
Generated Type
        ↓
Feature UI
```

Only introduce a feature view model or mapper if the UI genuinely needs a different shape.

Do not create mapping solely to rename every field or copy the same structure.

Preserve backend ordering unless the API contract explicitly provides sorting controls.

---

# 10. Feature API Function

Create:

```text
src/features/service-taxonomy/api/serviceTaxonomyApi.ts
```

Implement:

```typescript
getServiceTaxonomy(...)
```

Responsibilities:

```text
Call GET /api/v1/service-taxonomy
Use Shared API Client
Use generated types
Accept/pass AbortSignal
Return typed taxonomy data
Preserve backend order
```

Conceptual flow:

```text
getServiceTaxonomy()
        ↓
requestJson()
        ↓
ApiResult<TData, TMeta>
        ↓
return result.data
```

Do not:

```text
Use raw fetch()
Hard-code backend URL
Add search query parameters
Sort taxonomy data
Create user-facing error copy here
```

---

# 11. TanStack Query Hook

Create:

```text
src/features/service-taxonomy/hooks/useServiceTaxonomy.ts
```

Use:

```typescript
["service-taxonomy"]
```

as the query key.

Conceptually:

```typescript
useQuery({
  queryKey: ["service-taxonomy"],
  queryFn: ({ signal }) => getServiceTaxonomy({ signal }),
})
```

Use the global QueryClient retry policy from Phase 4.

The feature query owns:

```text
Loading
Loaded data
Error
Retry/refetch
Background fetching
```

Do not fetch independently inside low-level feature components.

---

# 12. ServiceTaxonomyPage Responsibilities

Update:

```text
src/features/service-taxonomy/pages/ServiceTaxonomyPage.tsx
```

The page should orchestrate:

```text
Query state
Search value
Explicit expansion state
Derived filtered taxonomy
Derived search-required expansion
```

Render:

```text
PageHeader
        ↓
TaxonomyToolbar
        ↓
ServiceAreaList
```

Use:

```text
Title:
Service Taxonomy

Description:
Browse the services used by the keyword research pipeline.
```

The screen should remain a reference/catalogue rather than a management surface.

---

# 13. TaxonomyToolbar

Create:

```text
TaxonomyToolbar.tsx
```

Compose:

```text
SearchInput
ExpandCollapseAllButton
```

Responsibilities:

```text
Display current search
Update search
Clear search
Expose Expand All / Collapse All
Adapt responsively
```

Suggested placeholder:

```text
Search service areas or offerings...
```

Provide an accessible name independent of placeholder text.

---

# 14. Search Behaviour

Create:

```text
src/features/service-taxonomy/utils/filterServiceTaxonomy.ts
```

Search is client-side only.

Search scope:

```text
Service Area name
Service Offering name
SEO Query
```

Use simple normalization:

```text
Trim whitespace
Case-insensitive
Substring matching
```

Do not add fuzzy-search or ranking dependencies.

An empty or whitespace-only search restores the full taxonomy.

Search rules:

```text
Service Area match
→ include the Service Area

Service Offering match
→ include parent Service Area
→ include matching offering
→ reveal parent

SEO Query match
→ include associated offering
→ include parent Service Area
→ reveal parent
```

Search filtering must preserve backend ordering.

Detailed filtering rules:

```text
Service Area name matches
→ include the Service Area
→ retain all of its offerings
→ do not force it open solely because the parent name matched
→ respect its explicit expansion state

Service Offering or SEO Query matches
→ include the parent Service Area
→ include only matching offerings within that area
→ add the parent to search-required expansion
```

A Service Area can match both directly and through nested content. When the
Service Area name matches directly, its complete offering list takes
precedence over nested filtering.

---

# 15. Expansion Behaviour

All Service Areas start collapsed on a fresh mount.

Users may expand multiple Service Areas simultaneously.

Do not implement single-open accordion behavior.

Keep two concepts separate:

```text
Explicit user expansion
+
Search-required expansion
```

Suggested model:

```text
expandedAreaIds
+
searchMatchedParentIds
        ↓
effectiveExpandedAreaIds
```

Search-required expansion should be derived rather than permanently modifying the user's explicit expansion state.

Clearing search should therefore restore the user's explicit expansion choices.

Do not persist expansion through:

```text
Navigation
Reload
localStorage
sessionStorage
Global state
Query cache
```

---

# 16. Expand All / Collapse All

Create:

```text
ExpandCollapseAllButton.tsx
```

Behavior:

```text
Not all explicitly expanded
→ Expand All

All explicitly expanded
→ Collapse All
```

Expand All:

```text
Add every loaded Service Area ID that has offerings
to explicit expansion state
```

Collapse All:

```text
Clear explicit expansion state
```

Empty Service Areas are not considered when determining whether all expandable
areas are explicitly expanded.

During active search, search-required areas must still remain effectively expanded so matches remain visible.

---

# 17. ServiceAreaList

Create:

```text
ServiceAreaList.tsx
```

Responsibilities:

```text
Render visible Service Areas
Preserve backend order
Use stable backend IDs as React keys
Render responsive one/two-column layout
Pass expansion state and callbacks
```

Do not fetch or search independently.

---

# 18. ServiceAreaCard

Create:

```text
ServiceAreaCard.tsx
```

Collapsed state:

```text
Service Area name
Offering count
Expand/collapse control
```

Expanded state additionally renders:

```text
ServiceOfferingList
```

Collapsed cards should remain compact to support fast scanning.

Offering count:

```typescript
offerings.length
```

Use sensible singular/plural text:

```text
1 service offering
5 service offerings
```

---

# 19. Empty Service Areas

If:

```typescript
offerings.length === 0
```

keep the Service Area visible.

Display:

```text
No service offerings available
```

Do not hide empty areas.

Do not expose a misleading expand interaction when no nested content exists.

---

# 20. ServiceOfferingList

Create:

```text
ServiceOfferingList.tsx
```

Responsibilities:

```text
Render offerings for one Service Area
Preserve backend order
Use service_offering_id as stable key
Render only offerings included by active search
```

No independent data fetching.

---

# 21. ServiceOfferingItem

Create:

```text
ServiceOfferingItem.tsx
```

Display:

```text
Service Offering name
SEO Query
```

The Service Offering name should be visually more prominent than its SEO Query.

The current generated contract defines:

```typescript
seo_query: string;
```

Use that generated type directly. Do not create a nullable frontend DTO.

Because the contract does not specify a minimum length, handle an unexpected
empty string safely in presentation without deriving a query from the offering
name.

```text
Do not invent a value
Do not derive it from the offering name
Present a safe “Not provided” state when the string is empty
```

---

# 22. Internal IDs

Use internal IDs only for:

```text
React keys
Expansion state
Internal associations
```

Do not render:

```text
Area IDs
Offering IDs
UUIDs
Database identifiers
```

The screen specification explicitly excludes technical/internal identifiers.

---

# 23. Feature States

Use shared Phase 3 presentation components.

| Condition                             | UI                           |
| ------------------------------------- | ---------------------------- |
| Initial request pending               | `LoadingState`               |
| Query failed                          | `ErrorState` + Retry         |
| Successful `data: []`                 | taxonomy `EmptyState`        |
| Data exists + search has zero matches | search-specific `EmptyState` |
| Data loaded                           | taxonomy UI                  |
| Background refetch with existing data | keep existing data visible   |

Suggested loading text:

```text
Loading service taxonomy...
```

Suggested error:

```text
Unable to load Service Taxonomy.
```

Suggested search no-results:

```text
No services found.

Try a different Service Area, Service Offering or SEO Query.
```

Do not expose technical API errors or stack traces.

State priority:

```text
Initial pending with no data
→ LoadingState

Error with no successfully loaded data
→ ErrorState with Retry

Data available, including during background refetch
→ keep taxonomy UI visible

Background refetch failure with existing data
→ do not replace valid taxonomy data with the full ErrorState
```

Do not render a full-page `ErrorState` solely because a background refetch
failed while valid cached taxonomy data is still available.

---

# 24. Accessibility

Expansion controls must use real buttons.

Support:

```text
aria-expanded
aria-controls
Tab
Enter
Space
Visible focus
```

Search must have:

```text
Accessible name
Keyboard-accessible clear control
Visible focus
```

Auto-expanding search results must not move keyboard focus unexpectedly.

Decorative chevrons/icons should not create duplicate screen-reader labels.

Use semantic hierarchy:

```text
Page title → h1
Service Area → appropriate subordinate heading
Offering → subordinate content/heading where appropriate
```

Do not choose heading levels only for visual styling.

Use Lucide React for icons.

---

# 25. Responsive Behaviour

Verify at:

```text
375px
768px
1024px
1440px
```

Expected:

```text
Wider desktop
→ two-column Service Area layout

Smaller screens
→ single-column layout

Expanded offerings
→ remain inside parent card

Toolbar
→ stacks/wraps without overflow

Normal browsing
→ no page-level horizontal scrolling
```

The screen specification explicitly supports two columns on wider screens and one column on smaller screens.

---

# 26. Dependency Guardrails

Phase 5 should require:

```text
0 new runtime dependencies
```

Use existing:

```text
React
TanStack Query
Shared API Client
Generated OpenAPI types
Shared components
shadcn/ui primitives
Lucide React
Tailwind CSS
```

Do not add:

```text
Fuzzy-search library
Accordion library
State library
HTTP library
Runtime schema library
```

Stop and report before installing any unexpected dependency.

---

# 27. Testing Rule

Inspect whether the repository now has a test runner.

If yes, add focused deterministic tests where useful:

```text
Service Area search
Offering search
SEO Query search
Nested match reveal
No-results search
Order preservation
Empty area
Independent expansion
Expand All
Collapse All
```

If no test runner exists:

```text
Do not add one solely for Phase 5
```

Use deterministic/manual verification and report that automated tests were unavailable.

---

# 28. Runtime API Verification

When the approved backend runtime is available, verify:

```text
GET /api/v1/service-taxonomy succeeds

Generated response types are used

Real taxonomy renders

No duplicate /api/v1 path exists

Offering counts match offerings.length

Client-side search works

No console/runtime errors occur
```

Do not use mock data to claim production integration success.

If the backend is unavailable, report runtime integration as unavailable rather than mocking success.

---

# 29. Quality Verification

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

Manual checks:

```text
Fresh load starts collapsed

Multiple areas can stay open

Individual collapse does not affect others

Expand All works

Collapse All works

Service Area search works

Offering search works

SEO Query search works

Nested matches reveal parent

Clearing search restores normal hierarchy

Backend ordering remains unchanged

Empty area remains visible

Empty taxonomy works

Search no-results works

Retry works

No IDs visible

No editing controls visible

Keyboard-only interaction works

Responsive behavior works

No page-level horizontal overflow
```

---

# 30. Final Diff Review

Run:

```bash
git status --short
git diff --stat
```

Confirm:

```text
Only Service Taxonomy feature work was added/updated

No backend files modified

No new taxonomy endpoint invented

No raw fetch added

Generated types are used

No duplicate handwritten backend DTOs

No mutations added

No backend search parameter added

No frontend sorting changed backend order

No internal IDs displayed

No editing controls added

No new runtime dependency

No unnecessary shared-component changes

No mock taxonomy data used as production data

No unrelated Phase 0–4 regression
```

Preserve unrelated worktree changes.

Do not commit or push unless explicitly authorized.

---

# 31. Implementation Sequence

```text
1. Read AGENTS.md and approved docs
        ↓
2. Verify Phase 4 baseline
        ↓
3. Audit generated taxonomy OpenAPI operation
        ↓
4. Implement feature API function
        ↓
5. Implement TanStack Query hook
        ↓
6. Implement taxonomy search utility
        ↓
7. Implement toolbar + Expand/Collapse All
        ↓
8. Implement offering components
        ↓
9. Implement Service Area components
        ↓
10. Integrate ServiceTaxonomyPage
        ↓
11. Add Loading / Error / Empty states
        ↓
12. Verify search + expansion interaction
        ↓
13. Verify responsive + accessibility behavior
        ↓
14. Verify real API integration when available
        ↓
15. Run quality checks
        ↓
16. Run relevant Definition of Done checks
        ↓
17. Review final diff
```

---

# 32. Completion Criteria

Phase 5 is complete when:

```text
GET /api/v1/service-taxonomy uses the Shared API Client

Generated OpenAPI types are used

useServiceTaxonomy owns server-state retrieval

No mutation or taxonomy-search API is invented

Search is client-side across:
Service Area
Service Offering
SEO Query

Nested matches reveal their parent Service Area

Search preserves backend ordering

All Service Areas start collapsed

Multiple Service Areas may remain expanded

Explicit expansion and search-required expansion remain separate

Expand All / Collapse All works

Offering counts come from offerings.length

Empty Service Areas remain visible

Service Offering name and SEO Query are displayed

Internal IDs are not rendered

No editing controls exist

Loading, Error, Empty, and No-results states work

Background refetch preserves valid displayed data

Desktop supports two columns

Smaller screens use one column

No normal page-level horizontal overflow

Expansion controls are keyboard accessible

Visible focus works

No new runtime dependency is introduced

No backend file is modified

No unrelated feature is implemented

TypeScript passes

ESLint passes

Format check passes

Production build passes

npm audit remains clean

Real backend integration is verified when runtime is available

Relevant Definition of Done items pass

No known blocking defect remains
```

Milestone:

```text
Generated Contract
        ↓
Feature API
        ↓
TanStack Query
        ↓
Production Service Taxonomy UI
        ↓
Search + Progressive Disclosure
        ↓
Responsive + Accessible States
        ↓
First Complete Vertical Slice
```
