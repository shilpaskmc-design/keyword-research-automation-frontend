# Implementation Plan — Phase 7: Manual Inputs

> [!info] Document Status
> **Status:** Implemented; non-destructive verification complete
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Implement Manual Inputs end-to-end with server-side list/search/filter/pagination, manual creation, raw XLSX upload, validation feedback, and backend-derived ready summary.

# 1. Goal and Milestone

```text
Manual Inputs Query → Search / Filters / Pagination → Add Manual Input
                    → Upload Excel → Validation Results → Invalidation
```

Milestone: `Forms + upload + server-driven table architecture proven`.

# 2. Approved API Scope

```http
GET  /api/v1/raw-data/manual-intake
GET  /api/v1/raw-data/manual-intake/summary
POST /api/v1/raw-data/manual-entry
POST /api/v1/raw-data/upload-excel
```

Cancellation exists in the backend but is not an approved Phase 7 screen action. Do not add it.

The list uses `keyword`, `status`, `source`, `page`, and `page_size`. Defaults are `status=pending`, `page=1`, and `page_size=25`. Search is backend-driven through `keyword` and covers `raw_text` and `gist`; do not claim Additional Details are searchable.

# 3. Scope and Structure

Implement feature-owned API, query hooks, mapping/error utilities, list/summary/table components, filters, pagination, Add Manual Input dialog/form, Additional Details editor/display, XLSX upload dialog, count summary, and validation presentation under `src/features/manual-inputs/`.

Extend `src/api/client.ts` only with a focused raw-binary-to-JSON-envelope transport. It must reuse centralized URL construction, native fetch transport, cancellation, HTTP errors, JSON error envelopes, and success-envelope validation.

# 4. Out of Scope

Do not add edit, cancel, separate History, client-side list filtering, bulk table actions, a new shared table framework, dependencies, backend changes, authentication, workbook parsing, or invented API behavior.

# 5. Typed API and Query State

Use generated operation request/response types for:

```typescript
getManualInputs(...)
getManualInputSummary(...)
createManualInput(...)
uploadManualInputs(...)
```

Forward `AbortSignal` for GET requests and preserve pagination metadata and normalized `ApiError`. Do not call raw fetch from feature code.

Use keys based on:

```typescript
['manual-inputs', { keyword, status, source, page, pageSize }]
['manual-input-summary']
```

Search debounce is exactly `400 ms`. Search/status/source changes reset page to 1. Page changes preserve filters. Use `placeholderData: keepPreviousData`; while parameters refetch, retain the current table, disable pagination where needed, and show a subtle refresh state. Successful create/upload invalidates both list and summary. Do not use optimistic updates.

# 6. Summary, Toolbar, and Table

Render `{ready_count} inputs ready for next run` from the summary endpoint; never derive it from the visible list page. A summary failure must not block the list and gets its own retry state.

Toolbar composition:

```text
SearchInput
Status: pending / promoted / invalid / cancelled / All (omit)
Source: manual_entry / manual_excel / All (omit)
Upload Excel
Add Manual Input
```

User labels map `pending` to Ready for Next Run and `promoted` to Used in Previous Run. The table shows Input Text, Summary / Gist, Status, and Additional Details. Show Validation Error only when the selected status is `invalid`. Never show IDs, timestamps, raw JSON, raw validation objects, pipeline data, or API metadata.

# 7. Additional Details

Display compact readable key/value pairs and allow disclosure of remaining fields. Value formatting is decisive:

```text
string / number / boolean → readable text
null                      → Not provided
object / array / other    → Structured value
```

Never stringify nested values as raw JSON.

# 8. Manual Input Form

Use React Hook Form and Zod. Input Text is required, trimmed, and rejected when empty after trimming. Gist is optional and trimmed. Additional Detail rows are trimmed; completely empty rows are ignored; key-only/value-only rows and duplicate trimmed keys are rejected.

Request mapping:

```text
raw_text   → required trimmed value
gist       → non-empty trimmed value, otherwise omit
extra_data → include only when complete rows exist, otherwise omit
```

Disable duplicate submission while pending. On success close/reset and invalidate. On failure keep the dialog open, preserve all values, show safe feedback, and allow retry. Do not invent length limits.

# 9. XLSX Upload and Result

Require a selected `.xlsx` file. Send it as the raw request body with:

```text
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
X-Upload-Filename: selected filename
```

The backend owns workbook structure, columns, parsing, row validation, malformed-workbook detection, and eligibility. Preserve the file after request failure; clear it after completed success. Disable duplicate upload while pending.

The upload response contains only `pending_rows`, `invalid_rows`, `upload_batch_id`, and `source`. The result summary displays ready and invalid counts. It must not claim row-level validation data is present. When invalid count is positive, direct the user to Status → Invalid. Keep the summary visible until dismissal, then invalidate/refetch list and summary.

# 10. Invalid Record Validation

For each Invalid record:

```text
1. Display non-empty validation_errors as a readable list.
2. Otherwise display validation_message when present.
3. Otherwise display “Validation details are not available.”
```

These are backend-sanitized public fields. Do not expose any other internal validation data.

# 11. State Priority

```text
Initial list loading without data → LoadingState
Initial list error without data   → ErrorState + Retry
Loaded empty filters             → filtered EmptyState
Loaded globally empty result     → dataset EmptyState
Parameter/background refetch     → retain current data
Background error with data       → retain current table
```

Pagination remains server-driven and preserves active parameters.

# 12. Accessibility, Responsive, and Verification

Verify labels/error associations, dialog focus, keyboard-operable search/filters/pagination, pending-disabled actions, non-color-only validation, table-local horizontal scrolling, and no page-level overflow at 375, 768, 1024, and 1440 pixels.

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

Verify real-backend default list and summary, 400 ms search, filters and reset behavior, pagination preservation, Invalid validation presentation, safe Additional Details, form validation/mapping/state preservation, XLSX validation/transport/result counts, invalidation, retained background data, responsive/keyboard behavior, and console state. Do not claim integration success from production mocks.

# 13. Guardrails and Completion

No backend files, cancellation/edit/history feature, raw feature fetch, unsupported search field, client-side replacement of server operations, raw JSON, technical validation objects, dependency, generated-type manual edit, or unrelated feature change. Preserve unrelated worktree changes and do not commit/push without authorization.

Phase 7 is complete when all four operations use generated types and the Shared API Client; list and summary are backend-driven; search/filter/pagination and retained refetch behavior work; form and XLSX workflows follow the rules above; upload counts and invalid-table details are represented accurately; accessibility/responsive checks and all quality checks pass.
