# Implementation Plan — Phase 6: Business Profile

> [!info] Document Status
> **Status:** Implemented and verified
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Implement the first CRUD/query/mutation feature using the shared API client, TanStack Query, generated OpenAPI types, and existing confirmation/error patterns.

---

# 1. Goal

Implement Business Profile end-to-end:

```text
List Categories + Entries
        ↓
Add Category
        ↓
Add Entry
        ↓
Delete Category
        ↓
Delete Entry
        ↓
Mutation Invalidation
        ↓
Loading / Error / Empty States
```

Milestone: `CRUD/query/mutation architecture proven`.

# 2. Current Contract

Use only these five frontend-public operations:

```http
GET    /api/v1/business-profile
POST   /api/v1/business-profile/categories
DELETE /api/v1/business-profile/categories/{category_id}
POST   /api/v1/business-profile/categories/{category_id}/entries
DELETE /api/v1/business-profile/entries/{entry_id}
```

Expected statuses:

```text
List                 → 200
Create Category      → 201
Delete Category      → 204
Add Entry            → 201
Delete Entry         → 204
```

Category deletion permanently cascade-deletes its child entries. Duplicate category errors use `409 DUPLICATE_RESOURCE`; missing resources use `404 NOT_FOUND`; invalid requests use `422 VALIDATION_ERROR`. Do not expose the internal bulk endpoint.

# 3. Scope

Create the Business Profile feature API, hooks, components, utilities, and page under:

```text
src/features/business-profile/
├── api/businessProfileApi.ts
├── hooks/useBusinessProfile.ts
├── utils/getBusinessProfileErrorMessage.ts
├── components/
│   ├── BusinessProfileCategoryList.tsx
│   ├── BusinessProfileCategoryCard.tsx
│   ├── CategoryEntriesToggle.tsx
│   ├── BusinessProfileEntryList.tsx
│   ├── BusinessProfileEntry.tsx
│   ├── AddEntryInput.tsx
│   ├── AddCategoryDialog.tsx
│   └── DeleteCategoryDialog.tsx
└── pages/BusinessProfilePage.tsx
```

Add a typed `requestNoContent()` helper to `src/api/client.ts`. It must reuse the existing request URL, fetch, cancellation, and error-normalization behavior; accept non-GET requests; treat a successful `204` response without parsing JSON; and keep raw fetch hidden from feature code.

# 4. Out of Scope

Do not implement rename category, edit entry, Business Profile search, bulk import, role-based access, optimistic updates, new runtime dependencies, or backend changes. Do not display IDs, raw JSON, API metadata, timestamps, or technical diagnostics.

# 5. Baseline and Contract Audit

Before editing, read `AGENTS.md` and relevant approved documents, inspect all five generated OpenAPI operations, and confirm request fields, response types, statuses, validation, and nullability. Do not handwrite backend DTOs where generated types exist.

Run the existing typecheck, lint, format, build, and audit commands before and after implementation as appropriate.

# 6. Feature API Layer

Create typed functions:

```typescript
getBusinessProfile(...)
createCategory(...)
deleteCategory(...)
createEntry(...)
deleteEntry(...)
```

Use the Shared API Client and generated request/response types. Forward `AbortSignal` for GET, use `requestNoContent()` for both DELETE operations, do not call raw `fetch()`, and preserve backend ordering.

# 7. TanStack Query

Use the stable key `['business-profile']`. `useBusinessProfile()` owns list data. Create category, delete category, create entry, and delete entry use typed mutations. Every successful mutation invalidates the Business Profile query. Prefer backend refetch to copied or optimistic server state.

# 8. Mutation Errors and Stale Resources

Preserve normalized `ApiError` and map known status/code combinations without parsing arbitrary message text:

```text
409 DUPLICATE_RESOURCE → duplicate category feedback
404 NOT_FOUND         → resource no longer exists feedback
422 VALIDATION_ERROR  → safe validation feedback
```

When a mutation returns `404 NOT_FOUND`, show a safe message and invalidate the Business Profile query so the UI reconciles with backend state. Preserve Add Entry input after failure. Do not clear any user-entered value after a failed create mutation.

# 9. Page, Categories, and Entries

Replace the placeholder with `PageHeader`, an Add Category action, and the category list. Categories always remain visible; only entry lists collapse. Show entry counts and preserve backend category/entry ordering. Expansion is independent local UI state. Empty categories remain visible and show an empty-entry message.

Entries display the exact stored text value and a Delete action. Do not transform stored text or infer additional URL information in this phase. No Edit action exists.

# 10. Add Category and Add Entry Validation

Use generated request types at the API boundary. For both category names and entry values:

```text
Trim surrounding whitespace
Reject values empty after trimming
Submit the trimmed value
Do not invent maximum lengths or character restrictions
```

Add Category opens a dialog near the page heading. On success, close and reset it; on failure, keep it open and preserve input.

Add Entry is inline per category. On success, clear it and refetch; on failure, preserve input. Disable repeated submission while pending.

# 11. Delete Behavior

Category deletion requires confirmation. The confirmation states that deletion is permanent and removes all entries inside the category. Keep the dialog open while pending and after failure; close it only after success.

Individual entry deletion does not require another confirmation dialog in Phase 6. Delete when activated while disabling repeated deletion for that entry, keeping it visible while pending, showing a safe failure message, and invalidating after success. Category deletion still requires confirmation because it cascade-deletes the category and children.

# 12. Feature State Priority

```text
Initial loading                 → LoadingState
Initial error without data      → ErrorState + Retry
Successful empty category list  → EmptyState
Loaded data                     → category list
Background refetch with data    → retain data and show subtle refresh status
```

# 13. Accessibility and Responsive Behavior

Verify dialog focus trap/restoration, visible focus, labels, keyboard-operable toggles, `aria-expanded`, pending-disabled actions, non-color-only errors, and no page-level horizontal overflow. Check widths 375, 768, 1024, and 1440 pixels.

# 14. Verification

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

Manually verify loading/error/empty states, backend ordering, independent expansion, successful and failed creates, duplicate-category feedback, both deletion flows, cascade reflection, invalidation, stale `404` reconciliation, preserved form values, responsive behavior, keyboard behavior, and absence of exposed technical data. If the real backend is unavailable, report runtime verification as unavailable instead of presenting mock success.

# 15. Final Diff Guardrails

Confirm no backend changes, bulk endpoint, rename/edit/search behavior, raw feature fetch, optimistic duplication, frontend sorting, displayed technical IDs, new dependency, unrelated feature change, or generated-file manual edit. Preserve unrelated worktree changes. Do not commit or push unless authorized.

# 16. Implementation Sequence

```text
1. Read instructions and approved Business Profile documents
2. Verify baseline and generated operations
3. Add shared no-content request support
4. Implement typed feature API functions
5. Implement query and mutation hooks
6. Build category and entry presentation
7. Build Add Entry and Add Category
8. Implement confirmed category deletion
9. Implement immediate entry deletion
10. Add state priority and stale-resource reconciliation
11. Verify accessibility and responsiveness
12. Run quality and Definition of Done checks
13. Review final diff
```

# 17. Completion Criteria

Phase 6 is complete when all five operations use generated types and the Shared API Client; no-content responses work; TanStack Query owns server state; successful mutations invalidate/refetch; `404` failures reconcile stale data; failed creates preserve input; trimmed required validation works; categories remain visible; entry lists expand independently; counts update from backend data; both create and delete workflows work according to the decisions above; all state, accessibility, responsive, static, build, audit, and relevant Definition of Done checks pass.

Milestone:

```text
Typed Query + Typed Mutations + Invalidation + Backend Validation + Confirmation
                                  ↓
              CRUD / Query / Mutation Architecture Proven
```
