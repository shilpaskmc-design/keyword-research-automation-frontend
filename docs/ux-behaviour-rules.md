Below is the Obsidian-ready `UX Behaviour Rules.md`.

# UX Behaviour Rules

> [!info] Document Status
> **Status:** Approved direction for MVP UX Behaviour
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define consistent frontend behaviour for user actions, loading, errors, navigation, forms, filtering, polling, destructive actions, and state transitions.

---

# 1. UX Principles

The frontend should behave in a way that is:

* predictable;
* consistent;
* responsive to user actions;
* clear about system state;
* resistant to duplicate actions;
* safe for destructive operations;
* aligned with backend-authoritative rules.

The UI should never require users to understand backend implementation details.

---

# 2. Backend Authority

The frontend must not invent business behaviour.

Backend-authoritative areas include:

```text
Pipeline lifecycle
Pipeline stage state
Allowed pipeline actions
Manual Input eligibility
Publish Status transitions
Filtering
Ordering
Pagination
Validation
Stable API error codes
```

The frontend should represent these rules but not independently redefine them.

---

# 3. Loading Behaviour

Loading should occur at the smallest relevant UI level.

Prefer:

```text
Section loading
Table loading
Button loading
Modal submission loading
```

Avoid blocking the entire application when only one section is waiting for data.

---

# 4. Initial Page Loading

When a screen first loads:

```text
Page Layout
    ↓
Relevant Loading State
    ↓
Data Loaded
    ↓
Content Rendered
```

Do not briefly display fake or empty data before the actual request completes.

---

# 5. Background Refetching

When previously loaded data is being refreshed:

* keep existing data visible where safe;
* avoid replacing the entire section with a full loading screen;
* indicate background activity only when useful;
* update the UI when fresh data arrives.

A background refetch should not unnecessarily interrupt user interaction.

---

# 6. Button Submission Behaviour

When an action is submitted:

```text
User Click
    ↓
Button enters loading state
    ↓
Duplicate submission prevented
    ↓
Request completes
    ↓
Success or Error
```

The action should remain disabled while the same request is in progress when duplicate submission could cause problems.

---

# 7. Success Behaviour

After a successful action:

1. update or refresh the affected data;
2. close the modal if the task is complete;
3. reset temporary form state where appropriate;
4. show concise success feedback where useful.

Examples:

```text
Manual Input added.
Upload completed.
Category added.
Publish Status updated.
```

Avoid unnecessary success confirmation dialogs.

---

# 8. Error Behaviour

Errors should be displayed at the level where the failure occurred.

## Field Error

Display next to the affected field.

## Action Error

Display near the relevant action or through lightweight notification.

## Section Error

Display inside the failed section with Retry where applicable.

## Page Error

Use only when the page cannot meaningfully function.

---

# 9. Error Message Rules

User-facing errors should:

* explain what failed;
* remain concise;
* provide an action when recovery is possible.

Do not expose:

```text
Stack traces
Database information
Internal IDs
Technical exception names
Provider details
```

Documented safe backend error messages may be displayed where useful. Never
display raw exceptions, stack traces, provider errors, or untrusted technical
details. Frontend behaviour must use HTTP status and stable backend error codes
rather than parsing arbitrary message text.

Common contract-specific responses should have clear UX treatment:

```text
409 → explain the conflict or unavailable action and refresh relevant state
413 → ask the user to narrow the export filters
422 → show field or filter validation feedback
```

---

# 10. Retry Behaviour

Retry should repeat only the failed operation.

Example:

```text
Final Results failed to load

[Retry]
```

Retrying a table request should not reload unrelated Dashboard or application data.

---

# 11. Empty States

The UI must distinguish between different empty states.

## No Data Exists

Example:

```text
No pipeline runs yet.
```

## No Search / Filter Results

Example:

```text
No results match your current filters.

[Clear Filters]
```

## No Open Work

Example:

```text
No open items from previous runs.
```

Do not use one generic empty-state message everywhere.

---

# 12. Search Behaviour

Search should follow the backend-supported search contract.

General behaviour:

```text
User enters search
    ↓
Search state updates
    ↓
Request uses current search
    ↓
Results refresh
```

Search should not claim to cover fields that the API does not explicitly support.

---

# 13. Search Request Timing

For server-driven search, use a short debounce where appropriate.

Recommended implementation range:

```text
300–500 ms
```

Avoid sending a request for every individual keystroke when unnecessary.

Pressing Enter may trigger immediate search where appropriate.

---

# 14. Clear Search

If a search value is active, users should be able to clear it easily.

Clearing search should:

```text
Remove search value
    ↓
Reset search query
    ↓
Return matching unsearched dataset
```

Pagination should return to the first page when required.

---

# 15. Filter Behaviour

Filters should apply only to the dataset they control.

Example:

```text
Final Results → Latest Pipeline Run filters
```

must not unintentionally affect:

```text
Open Items from Previous Runs
```

unless the screen specification explicitly defines shared filtering.

---

# 16. Filter Changes

When a filter changes:

1. apply the selected value;
2. reset pagination to page 1 where applicable;
3. request the filtered dataset;
4. keep the active filter visible.

Users should never have to guess whether a filter is active.

---

# 17. Clear Filters

Where multiple filters exist, provide a clear reset option when useful.

Reset should restore the defined default state.

Example:

```text
Urgency → All
Publish Status → All
Search → Empty
Page → 1
```

Feature-specific default filters still apply.

Example:

```text
Manual Inputs
Status → Ready for Next Run
```

---

# 18. Pagination Behaviour

Pagination should be server-driven where required.

When changing page:

```text
Current Filters Preserved
Current Search Preserved
    ↓
Requested Page Changes
    ↓
New Results Loaded
```

Do not clear filters when users move between pages.

---

# 19. Pagination Reset

Reset to page 1 when:

```text
Search changes
Filter changes
Run filter changes
Dataset scope changes
```

Do not reset pagination for unrelated UI interactions.

---

# 20. URL State

Important navigation state should remain in the URL where required by the architecture.

Examples:

```text
Final Results tab
Selected historical pipeline run
Relevant filters
Pagination where useful
```

This supports:

* refresh;
* browser back/forward;
* bookmarking;
* internal sharing.

Temporary UI state should not be placed in the URL.

---

# 21. Tab Behaviour

Tabs should preserve a clear active state.

For Final Results:

```text
Latest Results
History
```

Default:

```text
Latest Results
```

Changing tabs should load or display only the relevant dataset.

Tab changes should not unintentionally retain incompatible filters from another tab.

---

# 22. Deep-Link Behaviour

Dashboard may navigate directly to a historical pipeline run.

Flow:

```text
Dashboard
    ↓
Recent Pipeline Run
    ↓
View Results
    ↓
Final Results
    ↓
History
    ↓
Selected Run Filter
```

The History screen should clearly indicate when a run-specific filter is active.

Users should be able to clear the run filter and return to normal History.

---

# 23. Modal Behaviour

Opening a modal should:

* move focus into the modal;
* prevent interaction with background content;
* preserve required parent-screen state.

Closing a modal should return focus to the control that opened it where practical.

---

# 24. Modal Closing

A modal may close through:

```text
Cancel
Successful completion
Escape where safe
```

Clicking outside the modal should only close it where accidental dismissal would not cause data loss.

---

# 25. Forms With Unsaved Data

If closing a form would discard meaningful user-entered data, the frontend should avoid accidental loss.

For simple MVP forms, either:

* preserve the form until the modal is intentionally closed; or
* request confirmation when substantial entered data would be lost.

Do not add confirmation prompts to trivial forms without a practical need.

---

# 26. Form Validation

Frontend validation should improve usability.

Recommended sequence:

```text
User Input
    ↓
Frontend Validation
    ↓
Submit
    ↓
Backend Validation
```

Backend validation remains authoritative.

---

# 27. Validation Timing

Use validation at sensible moments.

Prefer:

```text
On submit
On blur where useful
After correction of existing error
```

Avoid showing aggressive validation errors before users have had a reasonable opportunity to complete a field.

---

# 28. Backend Validation Errors

If the backend returns field-specific validation errors:

* map them to the relevant field where possible;
* preserve safe validation information;
* do not replace precise backend validation with a generic error unnecessarily.

General validation failures may appear at form level.

---

# 29. Destructive Actions

Significant irreversible actions require confirmation.

Current example:

```text
Delete Business Profile Category
```

Flow:

```text
Delete
    ↓
Confirmation Dialog
    ↓
Cancel
OR
Confirm
    ↓
Submit
```

---

# 30. Destructive Confirmation Content

A destructive confirmation should clearly state:

```text
What will be deleted
Whether the action can be undone
Primary destructive action
Cancel action
```

Example:

```text
Delete Category?

Are you sure you want to delete "Competitors"?

This action cannot be undone.

[Cancel] [Delete]
```

---

# 31. Publish Status Behaviour

Publish Status actions must use backend-authoritative transition rules.

The frontend should:

* show the current status;
* provide only valid actions where the backend contract supports determining them;
* disable terminal states;
* handle invalid-transition responses safely.

Terminal states:

```text
Published
Reject
```

Do not infer allowed transitions from badge color or visual appearance.

---

# 32. Publish Status Mutation

When status is changed:

```text
User selects status
    ↓
Mutation starts
    ↓
Control protected from duplicate update
    ↓
Backend confirms transition
    ↓
Relevant Final Results data refreshed
```

If the update fails, keep or restore the last confirmed backend state.

Do not leave the UI displaying an unconfirmed status.

---

# 33. Optimistic Updates

Do not use optimistic updates by default for business-sensitive actions.

For actions such as:

```text
Publish Status
Pipeline Start
Delete Category
```

prefer backend confirmation before treating the operation as complete.

Optimistic behaviour may be introduced later only where failure recovery is clear and safe.

---

# 34. Pipeline Start Behaviour

Pipeline starts from Dashboard.

Flow:

```text
Start Pipeline
    ↓
Manual Input Reminder
    ↓
Continue
    ↓
Start Request
    ↓
Queued / Running
```

A `202` response means the pipeline was accepted/queued.

It must not be treated as completed.

---

# 35. Pipeline Start Duplicate Protection

While the start request is pending:

* disable repeated Start Pipeline submission;
* show a loading state;
* wait for the backend response.

If backend rules reject starting another pipeline, display the returned conflict safely.

---

# 36. Pipeline Progress Behaviour

Pipeline progress is backend-driven.

Active execution states:

```text
queued
running
```

Terminal execution states currently include:

```text
completed
partial
failed
abandoned
```

The frontend should poll while the pipeline remains active.

---

# 37. Pipeline Polling

Conceptually:

```text
Pipeline status is `queued` or `running`
    ↓
Poll Backend
    ↓
Update Stage State
    ↓
Still Active?
    ├── Yes → Continue Polling
    └── No  → Stop Polling
```

Polling must continue while the execution is `queued` or `running`, and must
stop for `completed`, `partial`, `failed`, or `abandoned`.

Exact interval is an implementation decision.

---

# 38. Pipeline Stage Display

Display backend-returned stage state using approved user-facing labels.

Possible visual states may include:

```text
Completed
Running
Pending
Interrupted
Partial
Failed
Superseded
```

Do not create artificial percentage progress.

---

# 39. Pipeline Completion

When an active execution reaches a terminal state:

```text
Completed → Final Results Count → View Final Results
Partial → Partial outcome and backend-supported result availability
Failed → Safe failure state
Abandoned → Ended/abandoned state
```

The frontend may temporarily emphasize a terminal-state transition. It must
not offer View Results or other actions unless the backend contract supports
them for that execution.

On later Dashboard loads, the execution appears normally as the latest completed pipeline run.

---

# 40. Pipeline Failure

If a pipeline fails:

* stop active polling;
* show a user-safe failed state;
* do not expose technical diagnostics;
* do not offer View Results unless product/backend rules support results for that run.

The same safe terminal-state treatment applies to partial and abandoned
executions, using only actions and result availability returned or supported by
the backend.

---

# 41. Manual Inputs Default Behaviour

When Manual Inputs opens:

```text
Status = Ready for Next Run
```

should be the default view.

Invalid, promoted, and cancelled records should not clutter the default workflow.

---

# 42. Add Manual Input Behaviour

Flow:

```text
Add Manual Input
    ↓
Modal Opens
    ↓
User Enters Data
    ↓
Validate
    ↓
Submit
    ↓
Success
    ↓
Modal Closes
    ↓
Ready Count / Table Refresh
```

Do not require users to manually enter JSON for Additional Details.

---

# 43. Excel Upload Behaviour

Flow:

```text
Upload Excel
    ↓
Select File
    ↓
Upload
    ↓
Processing
    ↓
Result Summary
```

After successful upload, show useful counts such as:

```text
Ready records
Invalid records
```

Then refresh the Manual Inputs dataset where appropriate.

---

# 44. File Upload State

During upload:

* disable repeated upload;
* show progress state where available;
* preserve selected file until completion or intentional cancellation.

If upload fails, allow retry without forcing unnecessary re-navigation.

Handle invalid file type, malformed workbook, backend validation errors, and
partial valid/invalid upload results explicitly. Preserve the selected file
for retry where safe and do not imply that invalid records were accepted.

---

# 45. Invalid Manual Inputs

Invalid records should be accessible through the Status filter.

When viewing Invalid:

* expose validation information provided by the backend;
* visually distinguish invalid state;
* avoid exposing internal validation implementation details.

---

# 46. Business Profile Expansion

Business Profile categories remain visible.

Only entry lists expand/collapse.

Behaviour:

```text
Category
    ↓
Entries Toggle
    ↓
Expanded / Collapsed
```

Expansion should not affect unrelated categories.

---

# 47. Add Business Profile Entry

Adding an entry should happen inline.

Flow:

```text
Enter value
    ↓
Add
    ↓
Mutation
    ↓
Success
    ↓
Clear input
    ↓
Refresh entries / count
```

Empty values must not be submitted.

---

# 48. Delete Business Profile Category

Category deletion requires confirmation.

The frontend must follow backend behaviour regarding categories containing entries.

Do not assume:

```text
Cascade deletion
OR
Deletion blocked
```

unless defined by the backend contract.

---

# 49. Service Taxonomy Expansion

Service Areas should support independent expansion.

Users may have multiple areas expanded simultaneously.

Do not force accordion behaviour where opening one area closes another.

---

# 50. Expand All / Collapse All

Behaviour:

```text
Expand All
    ↓
All Service Areas Expanded
    ↓
Control becomes Collapse All
```

and:

```text
Collapse All
    ↓
All Service Areas Collapsed
```

This state is local UI state unless persistence is explicitly added later.

---

# 51. Service Taxonomy Search

Search should reveal matching nested content.

If a matching Service Offering is inside a collapsed Service Area:

```text
Search Match
    ↓
Parent Service Area Revealed
    ↓
Relevant Area Expanded
    ↓
Matching Offering Visible
```

The exact searchable fields depend on the API/search implementation.

---

# 52. CSV Export Behaviour

CSV export should use the current dataset scope.

It should respect:

```text
Current section/tab
Run scope
Search
Filters
Ordering
```

Export must include all matching rows, not only the visible page.

---

# 53. CSV Export Loading

During export:

* disable repeated export requests;
* show an export-in-progress state;
* keep the current table usable where possible.

Export should not clear current filters or pagination.

---

# 54. CSV Export Limit

If the backend returns:

```text
413
FINAL_RESULT_EXPORT_LIMIT_EXCEEDED
```

show a clear message asking the user to narrow filters.

Do not silently truncate the export.

---

# 55. Browser Navigation

Browser Back and Forward should behave predictably for URL-controlled state.

Examples:

```text
Final Results tab
Historical run filter
Relevant filters
Pagination where URL-backed
```

Temporary modal state does not need to participate in browser history unless explicitly required.

---

# 56. Refresh Behaviour

Refreshing the browser should preserve URL-backed navigation state.

Server data should be re-requested as needed.

Temporary UI state may reset.

Example:

```text
Open modal → may reset
Selected History run in URL → should remain
```

---

# 57. Disabled Actions

When an action is unavailable:

* disable it when appropriate;
* preserve readable text;
* avoid implying it is available through hover styling.

Where useful, provide concise explanation through supporting text or tooltip.

Do not invent frontend-only reasons for backend-controlled restrictions.

---

# 58. Unknown Backend States

If an unknown backend status or enum value appears:

* render it safely;
* use neutral visual treatment;
* avoid crashing;
* do not reinterpret it as another known status.

Unknown states should remain observable during development so contract mismatches can be corrected.

Use backend enum values for state handling and approved frontend labels for
display. Unknown values receive neutral fallback treatment; they must not be
silently mapped to another known status. Allowed actions and transitions must
come from the backend rather than from badge colors, labels, or local guesses.

---

# 59. Stale Data

When a mutation changes data that is also shown elsewhere:

```text
Mutation Success
    ↓
Invalidate Affected Queries
    ↓
Refetch
    ↓
Consistent UI
```

Invalidate queries according to their current execution, tab, filter, and
search scope. Do not manually duplicate backend filtering or ordering logic in
each affected view.

Examples:

```text
Manual Input added
    → Ready Count
    → Manual Input table

Publish Status changed
    → Latest Results
    → Open Items
    → History where relevant
```

---

# 60. Duplicate Submission Protection

Protect actions such as:

```text
Start Pipeline
Add Manual Input
Upload Excel
Add Category
Add Entry
Delete Category
Publish Status Update
CSV Export
```

from accidental repeated submission while the same operation is already pending.

---

# 61. Feedback Hierarchy

Use the smallest feedback mechanism that communicates the result clearly.

Preferred hierarchy:

```text
Field message
    ↓
Inline section message
    ↓
Toast
    ↓
Modal / blocking message only when necessary
```

Avoid using dialogs for routine success or recoverable errors.

---

# 62. Keyboard Behaviour

All interactive controls should remain keyboard-accessible.

Expected behaviour includes:

```text
Tab → Move focus
Enter / Space → Activate control
Escape → Close safe dismissible overlays
Arrow keys → Supported component navigation
```

Detailed accessibility requirements belong in the Responsive & Accessibility document.

---

# 63. Focus After Actions

After important UI transitions:

## Modal Opens

Focus moves inside the modal.

## Modal Closes

Focus should return to the triggering control where practical.

## Validation Failure

Focus may move to the first invalid field when useful.

## Destructive Completion

Focus should move to the next meaningful interface location.

---

# 64. UX Behaviour Guardrails

During implementation:

1. Keep backend business rules authoritative.
2. Do not invent statuses or transitions.
3. Prevent duplicate submissions.
4. Preserve confirmed backend state when mutations fail.
5. Use local loading states where possible.
6. Keep existing data visible during safe background refreshes.
7. Distinguish empty, filtered-empty, loading, and error states.
8. Reset pagination when dataset scope changes.
9. Preserve filters during pagination.
10. Keep URL-backed navigation state refresh-safe.
11. Require confirmation for significant destructive actions.
12. Avoid unnecessary confirmation dialogs.
13. Do not use optimistic updates for sensitive actions by default.
14. Stop pipeline polling at terminal states.
15. Do not generate artificial pipeline percentages.
16. Keep error messages user-safe.
17. Never parse arbitrary backend message text to determine behaviour.
18. Refresh all affected datasets after successful mutations.
19. Keep temporary UI state local.
20. Maintain keyboard and focus behaviour for interactive controls.

---

# 65. UX Decision Summary

| Area                   | Decision                                |
| ---------------------- | --------------------------------------- |
| Loading                | Local / section-level where possible    |
| Background Refresh     | Preserve existing data where safe       |
| Duplicate Submission   | Prevent while request is pending        |
| Success Feedback       | Lightweight                             |
| Errors                 | Contextual and user-safe                |
| Search                 | Backend contract driven                 |
| Search Debounce        | 300–500 ms where appropriate            |
| Filters                | Preserve active state                   |
| Pagination             | Server-driven where required            |
| Filter Change          | Reset to page 1                         |
| URL State              | Use for meaningful navigation state     |
| Modals                 | Focused temporary tasks                 |
| Destructive Actions    | Confirmation required where significant |
| Optimistic Updates     | Not default for sensitive operations    |
| Pipeline Progress      | Backend-driven polling                  |
| Artificial Percentage  | Not allowed                             |
| Global Loading Overlay | Avoid unless necessary                  |
| Unknown Backend State  | Neutral safe fallback                   |
| Authentication UX      | Not part of MVP                         |

---

# 66. Decisions Deferred

The following may be finalized during implementation or later UX documentation:

* exact search debounce duration;
* exact polling interval;
* whether every form requires unsaved-change confirmation;
* whether individual Business Profile entry deletion requires confirmation;
* exact toast duration;
* exact background-refetch indicator;
* exact URL-backed filter set;
* exact table behaviour on very small screens;
* whether expansion state should persist across navigation.

---

# 67. Related Documents

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

This document defines **how the frontend should behave during interaction and state changes**.

The next document should define the reusable UI building blocks required by the application:

```text
07 - Component Inventory.md
```

The existing detailed screen specifications already cover:

```text
06 - Detailed Screen Specifications
```

so they do not need to be recreated.
