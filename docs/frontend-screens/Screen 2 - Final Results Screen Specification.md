# Final Results Screen Specification and Backend Requirements

## 1. Purpose

The **Final Results** screen is the main output and content-workflow screen for the marketing team.

It allows users to:

- review results from the latest completed pipeline run;
- identify unfinished items from previous runs;
- search recommendations;
- filter recommendations;
- update Publish Status;
- export the currently filtered result set to CSV;
- browse historical results from previous pipeline runs.

The screen should remain focused on marketing decisions and content workflow.

It should not expose technical pipeline diagnostics or backend-only information.

For any single pipeline execution, the final stage writes a maximum of **10 rows** to `sheet_export_rows`.

Therefore:

```text
One pipeline run → 0 to 10 Final Results
```

The overall `sheet_export_rows` table can contain more than 10 rows because it stores results from multiple historical runs.

---

## 2. Main Screen Structure

The screen contains two tabs:

```text
[ Latest Results ]   [ History ]
```

Default selected tab:

**Latest Results**

Only the content belonging to the selected tab should be rendered.

---

# 3. Latest Results Tab

The **Latest Results** tab contains two sections:

1. **Latest Pipeline Run**
2. **Open Items from Previous Runs**

Example:

```text
Final Results

[ Latest Results ]   [ History ]


Latest Pipeline Run
10 Aug 2026
10 Final Results

[Search Keyword...] [Urgency: All ▼] [Publish Status: All ▼] [Export CSV]

Results are ranked by relevance, highest first.

────────────────────────────────────────────────────────────────────────────
Keyword | Topic Title | Article Angle | Why Relevant | Content Type |
Search Intent | Urgency | Publish Status
────────────────────────────────────────────────────────────────────────────
...
...
...
```

A latest run may contain fewer than 10 results.

For example:

```text
7 Final Results
```

This does not automatically indicate pipeline failure.

---

# 4. Latest Pipeline Run Results

The first table contains only the Final Results produced by the **most recently completed pipeline execution**.

The frontend should request these results using that run's:

```text
pipeline_execution_id
```

Maximum rows for a single run:

```text
10
```

The Latest Results table does not require pagination in normal operation because a single run contains no more than 10 Final Results.

---

# 5. Open Items from Previous Runs

Below the latest run table, show:

## Open Items from Previous Runs

This section acts as a marketing-team work queue.

It contains Final Result rows from **all previous pipeline runs**, excluding the latest run, where:

```text
Publish Status = Pending
OR
Publish Status = Approved
```

Exclude:

```text
Published
Reject
```

Example:

```text
Open Items from Previous Runs

42 items still need attention

[Search Keyword...] [Urgency: All ▼] [Publish Status: Pending + Approved ▼]
[Export CSV]

────────────────────────────────────────────────────────────────────────────
Run Date | Keyword | Topic Title | Article Angle | Why Relevant |
Content Type | Search Intent | Urgency | Publish Status
────────────────────────────────────────────────────────────────────────────
...
...
...
```

---

## 5.1 Purpose of Open Items

This section prevents unfinished work from previous pipeline runs from being forgotten.

Examples:

- a recommendation was approved last week but was never marked Published;
- a recommendation from an older run is still Pending;
- a user forgot to update Publish Status after completing content work.

The user should not need to manually search History every time to discover these records.

---

## 5.2 Open Items Rules

Open Items must:

- exclude the latest pipeline run;
- include all earlier runs;
- include only `Pending` and `Approved`;
- support Keyword search;
- support Urgency filtering;
- support Publish Status filtering;
- support server-side pagination;
- support CSV export;
- allow Publish Status updates where permitted.

Default page size:

```text
25 rows
```

---

# 6. Results Table Columns

The frontend Final Results table uses the following columns.

| Order | Column |
|---:|---|
| 1 | Keyword |
| 2 | Topic Title |
| 3 | Article Angle |
| 4 | Why Relevant |
| 5 | Content Type |
| 6 | Search Intent |
| 7 | Urgency |
| 8 | Publish Status |

Historical/Open Items tables additionally include:

```text
Run Date
```

---

# 7. Keyword

The main keyword recommendation.

It should be the first and most prominent content column.

Backend field:

```text
keyword
```

Keyword is also the only currently supported text-search field.

---

# 8. Topic Title

The recommended content/article title associated with the keyword.

Frontend label:

```text
Topic Title
```

Backend API list response must expose this field.

Backend field:

```text
topic_title
```

Historical values are read-only.

---

# 9. Article Angle

Explains the recommended direction, perspective, or treatment of the content.

Backend field:

```text
article_angle
```

Article Angle may contain longer text.

The table may:

- limit the number of visible lines;
- provide simple expand/show-more behavior.

A separate row-details drawer is not required.

Historical values are read-only.

---

# 10. Why Relevant

Explains why the recommendation is relevant to the business or research objective.

Frontend label:

```text
Why Relevant
```

Backend source:

```text
FilteredResult.why_relevant
```

This field currently exists in the database but must be included in the public Final Results list schema.

Long text may use line truncation with optional expansion.

No separate detail drawer is required.

---

# 11. Content Type

Shows the recommended content type.

Examples may include:

```text
Blog
Service Page
Guide
Landing Page
```

Actual values must come from backend data.

Backend field:

```text
content_type
```

---

# 12. Search Intent

Frontend label:

```text
Search Intent
```

The backend currently stores the source field as:

```text
intent
```

The public API should expose/alias this as:

```text
search_intent
```

This keeps frontend terminology clear while preserving backend implementation internally.

---

# 13. Urgency

Urgency represents the priority or time-sensitivity of the recommendation.

Known values:

```text
high
medium
low
```

The backend currently represents Urgency as a string rather than a strict enum.

Contract constraint:

```text
string
min length = 1
max length = 50
```

The frontend should safely support the known values:

```text
High
Medium
Low
```

Unknown values should still render safely using a neutral fallback.

---

## 13.1 Urgency Display

Urgency may be displayed as a badge.

Example:

```text
High
Medium
Low
```

Exact colors and styling belong to the design system and should not be hard-coded into this specification.

---

## 13.2 Urgency Filter

Provide:

```text
Urgency

All
High
Medium
Low
```

Filtering must be backend-driven.

---

# 14. Publish Status

Marketing users can update Publish Status directly from the table.

Backend-authoritative values are:

```text
Pending
Approved
Published
Reject
```

Do not use:

```text
Rejected
```

The correct backend value is:

```text
Reject
```

---

# 15. Publish Status Transition Rules

Backend transition rules are:

```text
Pending
    → Approved
    → Published
    → Reject
```

More precisely:

```text
Pending  → Approved, Published, Reject

Approved → Pending, Published, Reject

Published → Terminal

Reject    → Terminal
```

Submitting the same current status is idempotent.

Example:

```text
Approved → Approved
```

returns success without changing state.

Invalid transitions return:

```text
HTTP 422 Unprocessable Entity
```

with:

```text
INVALID_STATUS_TRANSITION
```

---

# 16. Publish Status UI Behaviour

For editable rows, display Publish Status using a dropdown.

Example:

```text
[ Approved ▼ ]
```

When status is:

```text
Published
```

or:

```text
Reject
```

the status is terminal.

The frontend should disable further editing for those rows.

---

# 17. Historical Editing Rules

Historical topic/content information is immutable.

Users cannot edit:

- Keyword;
- Topic Title;
- Article Angle;
- Why Relevant;
- Content Type;
- Search Intent;
- Urgency;
- AI score;
- ranking information;
- timestamps.

The only editable field across historical runs is:

```text
Publish Status
```

and only while status is:

```text
Pending
Approved
```

Once a row reaches:

```text
Published
Reject
```

status editing is locked.

---

# 18. Result Ordering — Latest Run

Latest pipeline results are ordered by:

```text
AI Score descending
```

Highest-ranked recommendations appear first.

The AI Score itself does not need to be displayed as a column.

Show a short explanation:

```text
Results are ranked by relevance, highest first.
```

---

# 19. Result Ordering — History and Open Items

When multiple pipeline runs are combined, ordering should be:

1. **Run Date descending**
2. **AI Score descending within the same run**
3. Stable ID descending as a final tie-breaker

Conceptually:

```text
Newest Run
    Highest AI Score
    ↓
    Lowest AI Score

Next Newest Run
    Highest AI Score
    ↓
    Lowest AI Score

...
```

Backend implementation should use:

```text
final_stage_completed_at DESC
final_score DESC
id DESC
```

---

# 20. Search

Search currently applies only to:

```text
Keyword
```

Search must be:

- case-insensitive;
- partial-match;
- backend-driven;
- compatible with pagination.

Do not claim that search covers:

- Topic Title;
- Article Angle;
- Why Relevant.

Those fields may be considered later if backend support is intentionally added.

---

# 21. Filters

The MVP provides:

1. Urgency
2. Publish Status

Filters can be combined.

Example:

```text
Urgency = High
Publish Status = Approved
```

The backend should return only matching results while preserving the appropriate sort order.

---

# 22. Latest Results Filter Scope

Latest Results filters apply only to the latest:

```text
pipeline_execution_id
```

Example:

```text
pipeline_execution_id = latest completed run
urgency = high
publish_status = Approved
```

---

# 23. Open Items Filter Scope

Open Items uses these base conditions automatically:

```text
pipeline_execution_id != latest pipeline execution

publish_status IN (
    Pending,
    Approved
)
```

Additional user filters may then narrow the dataset further.

---

# 24. CSV Export

CSV export should represent the **current frontend result view**.

It must respect:

- selected screen section/tab;
- pipeline execution scope;
- excluded latest run where relevant;
- Keyword search;
- Urgency filter;
- Publish Status filter;
- ordering.

The export must contain **all matching rows**, not only the currently visible pagination page.

Example:

```text
142 matching rows
Page size = 25

CSV export = all 142 matching rows
```

---

# 25. CSV Export Columns

CSV must contain only frontend-visible result fields.

Required CSV columns:

```text
Keyword
Topic Title
Article Angle
Why Relevant
Content Type
Search Intent
Urgency
Publish Status
```

For History/Open Items, include:

```text
Run Date
```

when it is visible on screen.

Do not export the existing internal 32-column backend representation.

Do not export:

- stage-run IDs;
- internal database IDs;
- gist-source internals;
- trend internals;
- provider information;
- backend-only metadata.

---

# 26. CSV Export Limit

Maximum matching rows per export:

```text
10,000
```

If more than 10,000 rows match:

```text
HTTP 413 Payload Too Large
```

with error code:

```text
FINAL_RESULT_EXPORT_LIMIT_EXCEEDED
```

The frontend must display a clear message asking the user to narrow filters.

Do not silently truncate the CSV.

Current filename:

```text
final-results.csv
```

---

# 27. No Row Detail Drawer

A row-detail drawer is not required.

All required marketing fields are already shown directly in the table.

For long fields such as:

- Article Angle;
- Why Relevant;

use:

- line clamp;
- Show More / Show Less;

if required.

---

# 28. History Tab

The second tab is:

```text
History
```

The History tab shows **all historical Final Result rows combined into one unified table**.

It does not display a list of pipeline runs.

---

# 29. History Table Columns

Recommended order:

| Order | Column |
|---:|---|
| 1 | Run Date |
| 2 | Keyword |
| 3 | Topic Title |
| 4 | Article Angle |
| 5 | Why Relevant |
| 6 | Content Type |
| 7 | Search Intent |
| 8 | Urgency |
| 9 | Publish Status |

---

# 30. Run Date

Frontend label:

```text
Run Date
```

Authoritative backend field:

```text
final_stage_completed_at
```

Do not use:

```text
ranked_at
exported_at
```

as the user-facing Run Date.

---

# 31. History Ordering

History ordering:

```text
final_stage_completed_at DESC
```

then:

```text
final_score DESC
```

then:

```text
id DESC
```

This gives:

> newest run first, highest-ranked recommendations first within each run.

---

# 32. History Search

History search supports:

```text
Keyword only
```

Search remains backend-driven.

---

# 33. History Filters

Provide:

```text
Urgency
Publish Status
```

Publish Status options:

```text
All
Pending
Approved
Published
Reject
```

Urgency:

```text
All
High
Medium
Low
```

---

# 34. History Pagination

History must use server-side pagination.

Backend contract:

```text
page
default = 1
minimum = 1
```

```text
page_size
default = 25
minimum = 1
maximum = 100
```

Response pagination metadata:

```json
{
  "page": 1,
  "page_size": 25,
  "total_items": 1420,
  "total_pages": 57,
  "has_next": true,
  "has_previous": false
}
```

Requesting a page beyond the final page should return:

```text
HTTP 200 OK
```

with:

```json
"data": []
```

and correct pagination metadata.

Default frontend page size:

```text
25
```

---

# 35. Opening Historical Results from Dashboard

The Dashboard Recent Pipeline Runs table can send users directly to a specific historical run.

Example:

```text
Dashboard
    ↓
Recent Pipeline Runs
    ↓
View Results
    ↓
Final Results
    ↓
History
```

The History tab should automatically apply:

```text
pipeline_execution_id = selected run
```

The UI should indicate that a run filter is active.

Example:

```text
Viewing results from:
3 Aug 2026

[Clear Run Filter]
```

Clicking **Clear Run Filter** restores the normal unified History dataset.

No separate Pipeline Run Details screen is required.

---

# 36. Removed Concepts

The following are not required:

- pipeline-run-based History navigation;
- separate Run Results screen;
- row-detail drawer;
- Pipeline Run Details screen;
- technical result metadata panels.

History is a unified result-row view.

---

# 37. What Should Not Be Shown

Do not expose:

- AI prompts;
- raw model responses;
- internal stage IDs;
- pipeline diagnostics;
- provider details;
- worker details;
- backend-only columns;
- internal UUIDs unless required internally for routing;
- database IDs as visible UI fields;
- checkpoint information.

---

# 38. Frontend Caching Strategy

Final Results should use query caching based on active server-side query state.

Example cache key:

```text
[
  'final-results',
  {
    page,
    page_size,
    pipeline_execution_id,
    exclude_pipeline_execution_id,
    search,
    urgency,
    selection_status,
    publish_status,
    sort_by,
    sort_direction
  }
]
```

Backend remains the authoritative source of truth.

Caching is only a frontend performance layer.

---

# 39. Cache Invalidation

Invalidate/refetch Final Results after:

### Publish Status update

```text
PATCH /api/v1/sheet-export-rows/{row_id}/status
```

### New pipeline completion

When a new pipeline completes:

- Latest Results changes;
- Open Items changes;
- History changes.

Relevant result queries should be invalidated/refetched.

---

# 40. Current Backend Support

The backend already supports several required capabilities.

## 40.1 Final Results Listing

Existing:

```http
GET /api/v1/final-results
```

Supports:

- server-side pagination;
- Keyword search;
- `pipeline_execution_id`;
- single Publish Status filter;
- existing sorting fields;
- Final Results retrieval.

---

## 40.2 CSV Export

Existing:

```http
GET /api/v1/final-results/export.csv
```

Already supports:

- bounded export;
- 10,000-row maximum;
- `413` protection when result size exceeds limit.

The output column set still needs changing.

---

## 40.3 Publish Status Update

Existing:

```http
PATCH /api/v1/sheet-export-rows/{row_id}/status
```

Already supports the authoritative status state machine.

---

# 41. Backend Changes Needed

The following backend changes are required to fully support the finalized screen.

---

## 41.1 Expand `FinalResultListItem`

### Current problem

`GET /api/v1/final-results` currently omits several fields required by the frontend table.

The list response does not currently expose all required columns.

Fields currently missing from the list response include:

```text
topic_title
article_angle
why_relevant
content_type
search_intent
urgency
```

Some are available only through the single-result detail endpoint.

`why_relevant` is currently not exposed in either list or detail schemas.

Because the frontend does not use a row-detail drawer, these fields must be available directly in the paginated list response.

---

## 41.2 Required List Item Schema

Update `FinalResultListItem` to expose at least:

```python
class FinalResultListItem(BaseModel):
    filtered_result_id: int
    sheet_export_row_id: Optional[int] = None
    pipeline_execution_id: uuid.UUID

    keyword: str
    topic_title: str
    article_angle: str
    why_relevant: str
    content_type: str
    search_intent: str
    urgency: str

    publish_status: Optional[PublishStatus] = None
    final_score: Optional[float] = None
    final_stage_completed_at: datetime
```

Exact nullability should follow database/business rules rather than being guessed by the frontend.

---

## 41.3 Update Final Results Projection

Update:

```text
FinalResultService._public_statement()
```

so that the frontend-required columns are included in normal list queries.

The list endpoint should not require:

```text
include_detail = true
```

to obtain fields that are required by the main frontend table.

Expose:

```text
intent → search_intent
```

and include:

```text
why_relevant
```

from the relevant filtered-result source.

---

# 42. Backend Change — Urgency Filtering

### Current state

Neither:

```http
GET /api/v1/final-results
```

nor:

```http
GET /api/v1/final-results/export.csv
```

currently exposes an Urgency filter.

### Required change

Add:

```text
urgency: Optional[str]
```

to both endpoints.

Filtering should be case-insensitive.

Conceptually:

```sql
LOWER(urgency) = LOWER(:urgency)
```

Known frontend values:

```text
high
medium
low
```

Unknown stored values should not break serialization.

---

# 43. Backend Change — Multi-Status Filtering

### Current state

`publish_status` currently accepts only one value.

Example:

```text
publish_status=Pending
```

This cannot support the Open Items requirement:

```text
Pending OR Approved
```

### Required change

Allow multiple Publish Status values.

Conceptually:

```text
publish_status=Pending
publish_status=Approved
```

or equivalent public API representation.

Backend SQL behavior:

```sql
WHERE publish_status IN ('Pending', 'Approved')
```

This is required for:

```text
Open Items from Previous Runs
```

---

# 44. Backend Change — Run-Date Sorting

### Current state

Existing sort options include fields such as:

```text
id
keyword
relevance_score
final_score
final_rank
ranked_at
exported_at
```

but not:

```text
final_stage_completed_at
```

### Required change

Add:

```text
final_stage_completed_at
```

to the supported Final Result sort fields.

---

# 45. Backend Change — Composite History Ordering

For History/Open Items, the backend must support:

```text
final_stage_completed_at DESC
final_score DESC
id DESC
```

This is not equivalent to merely sorting by one field.

The backend should implement this composite ordering as the authoritative history-order rule.

---

# 46. Backend Change — Exclude Latest Pipeline Run

### Current problem

The API supports:

```text
pipeline_execution_id = specific run
```

but does not currently support:

> all results except one specified run.

Open Items needs:

```text
all previous runs
EXCEPT
latest run
```

### Required change

Add a query parameter such as:

```text
exclude_pipeline_execution_id
```

Example:

```http
GET /api/v1/final-results?exclude_pipeline_execution_id=<latest-run-id>
```

Service behavior:

```sql
WHERE pipeline_execution_id != :exclude_pipeline_execution_id
```

This will be combined with:

```text
publish_status = Pending + Approved
```

for the Open Items table.

---

# 47. Backend Change — CSV Columns

### Current problem

CSV export currently outputs approximately 32 backend/internal fields.

This does not match the frontend specification.

### Required change

Restrict CSV export to frontend-visible columns.

For Latest Results:

```text
keyword
topic_title
article_angle
why_relevant
content_type
search_intent
urgency
publish_status
```

For unified historical/Open Items exports, include:

```text
final_stage_completed_at
```

as:

```text
Run Date
```

when that column is visible in the current frontend view.

---

# 48. Backend Change — CSV Filter Parity

The CSV endpoint must support the same relevant query semantics as the list endpoint.

This includes:

- `pipeline_execution_id`;
- `exclude_pipeline_execution_id`;
- Keyword search;
- Urgency;
- one or multiple Publish Status values;
- ordering.

The user should not see one dataset on screen and receive a materially different dataset in CSV.

---

# 49. Backend Requirement — `sheet_export_row_id`

Publish Status updates require:

```http
PATCH /api/v1/sheet-export-rows/{row_id}/status
```

Therefore every selected/exported Final Result list item must expose:

```text
sheet_export_row_id
```

The frontend uses this internal identifier for the mutation call.

It should not need to display the ID to the user.

---

# 50. Backend Requirement — Publish Status Governance

The existing `SheetExportService` remains authoritative for status transitions.

Frontend must not duplicate or redefine transition rules.

Backend rules:

```text
Pending
    → Approved
    → Published
    → Reject

Approved
    → Pending
    → Published
    → Reject

Published
    → terminal

Reject
    → terminal
```

Invalid transition:

```text
HTTP 422
INVALID_STATUS_TRANSITION
```

Same-state update:

```text
200 OK
```

---

# 51. Recommended Performance Improvements

Because History combines records across all pipeline runs, database performance should be reviewed as data grows.

Recommended indexes should support:

```text
final_stage_completed_at
```

and possibly composite access patterns involving:

```text
final_stage_completed_at
final_score
```

The exact index design should be based on actual PostgreSQL query plans rather than added blindly.

---

# 52. Backend Support vs Required Changes Summary

| Requirement | Backend Status |
|---|---|
| Pagination | ✅ Supported |
| Keyword search | ✅ Supported |
| Filter by one Publish Status | ✅ Supported |
| Publish Status mutation | ✅ Supported |
| Status transition enforcement | ✅ Supported |
| CSV 10,000-row limit | ✅ Supported |
| `pipeline_execution_id` filtering | ✅ Supported |
| All 8 frontend columns in list response | ❌ Change required |
| `why_relevant` exposure | ❌ Change required |
| `search_intent` projection | ❌ Change required |
| Urgency filtering | ❌ Change required |
| Multiple Publish Status filters | ❌ Change required |
| `final_stage_completed_at` sorting | ❌ Change required |
| Composite History ordering | ❌ Change required |
| Exclude latest run | ❌ Change required |
| Frontend-only CSV columns | ❌ Change required |
| CSV filter parity | ❌ Change required |
| `sheet_export_row_id` available for status mutation | ⚠️ Must be guaranteed |

---

# 53. Backend Implementation Checklist

- [ ] Add `topic_title` to `FinalResultListItem`.
- [ ] Add `article_angle` to `FinalResultListItem`.
- [ ] Add `why_relevant` to `FinalResultListItem`.
- [ ] Add `content_type` to `FinalResultListItem`.
- [ ] Expose `intent` as `search_intent`.
- [ ] Add `urgency` to `FinalResultListItem`.
- [ ] Ensure `final_stage_completed_at` is returned.
- [ ] Ensure `sheet_export_row_id` is always returned for selected/exported rows.
- [ ] Update `_public_statement()` to project frontend fields for list requests.
- [ ] Add `urgency` query filtering to list endpoint.
- [ ] Add `urgency` query filtering to CSV endpoint.
- [ ] Change Publish Status filtering to support multiple statuses.
- [ ] Add `final_stage_completed_at` to supported sort fields.
- [ ] Implement Run Date DESC + AI Score DESC + ID DESC composite ordering.
- [ ] Add `exclude_pipeline_execution_id`.
- [ ] Apply exclusion support to list endpoint.
- [ ] Apply exclusion support to CSV endpoint.
- [ ] Replace internal 32-column CSV output with frontend-visible fields.
- [ ] Ensure CSV respects all active frontend filters.
- [ ] Preserve existing 10,000-row CSV limit.
- [ ] Preserve existing Publish Status transition rules.
- [ ] Add/update backend tests.
- [ ] Regenerate public OpenAPI snapshot.
- [ ] Regenerate/synchronize frontend API types.
- [ ] Update frontend handoff documentation.

---

# 54. Frontend Query Examples

## Latest Results

```text
GET /api/v1/final-results

pipeline_execution_id = latest_pipeline_execution_id
sort_by = final_score
sort_direction = desc
page = 1
page_size = 25
```

In practice the response contains at most 10 selected rows for a single run.

---

## Open Items from Previous Runs

Conceptually:

```text
GET /api/v1/final-results

exclude_pipeline_execution_id = latest_pipeline_execution_id
publish_status = Pending
publish_status = Approved
sort_by = final_stage_completed_at
sort_direction = desc
page = 1
page_size = 25
```

Backend composite ordering should then preserve:

```text
Run Date DESC
AI Score DESC
```

within the result.

---

## History

```text
GET /api/v1/final-results

sort_by = final_stage_completed_at
sort_direction = desc
page = 1
page_size = 25
```

Optional filters:

```text
search
urgency
publish_status
pipeline_execution_id
```

---

# 55. Final Screen Layout

```text
Final Results

[ Latest Results ]   [ History ]


LATEST PIPELINE RUN

10 Aug 2026
10 Final Results

[Search Keyword...]
[Urgency: All ▼]
[Publish Status: All ▼]
[Export CSV]

Results are ranked by relevance, highest first.

──────────────────────────────────────────────────────────────
Keyword
Topic Title
Article Angle
Why Relevant
Content Type
Search Intent
Urgency
Publish Status
──────────────────────────────────────────────────────────────
...
...
...


OPEN ITEMS FROM PREVIOUS RUNS

42 items still need attention

[Search Keyword...]
[Urgency: All ▼]
[Publish Status: Pending + Approved ▼]
[Export CSV]

──────────────────────────────────────────────────────────────
Run Date
Keyword
Topic Title
Article Angle
Why Relevant
Content Type
Search Intent
Urgency
Publish Status
──────────────────────────────────────────────────────────────
...
...
...

Showing 1–25 of 42
< Previous   1 2   Next >
```

---

# 56. History Layout

```text
Final Results

[ Latest Results ]   [ History ]


HISTORY

[Search Keyword...]
[Urgency: All ▼]
[Publish Status: All ▼]
[Export CSV]

──────────────────────────────────────────────────────────────
Run Date
Keyword
Topic Title
Article Angle
Why Relevant
Content Type
Search Intent
Urgency
Publish Status
──────────────────────────────────────────────────────────────
...
...
...

Showing 1–25 of 245
< Previous   1 2 3 ...   Next >
```

---

# 57. Current Finalized Decisions

The current agreed direction is:

- Final Results is a dedicated screen.
- It contains two tabs:
  - Latest Results
  - History
- Latest Results is selected by default.
- Latest Results contains:
  - Latest Pipeline Run results
  - Open Items from Previous Runs
- A single pipeline run produces at most 10 Final Results.
- Latest Results are ordered by AI Score descending.
- AI Score is not displayed as a column.
- Open Items includes all previous-run rows in:
  - Pending
  - Approved
- Open Items excludes:
  - Published
  - Reject
- Open Items excludes the latest pipeline run.
- History displays all historical result rows together.
- History does not display a list of pipeline runs.
- Run Date uses `final_stage_completed_at`.
- History/Open Items ordering is:
  - newest run first;
  - highest AI score first within each run.
- Search currently applies only to Keyword.
- Urgency filter values are:
  - high
  - medium
  - low
- Publish Status values are exactly:
  - Pending
  - Approved
  - Published
  - Reject
- Published and Reject are terminal.
- Publish Status can be changed directly from table rows while non-terminal.
- Historical content fields are read-only.
- No row-detail drawer is required.
- CSV export respects the current dataset.
- CSV exports all matching rows, not just the current pagination page.
- CSV should contain only frontend-visible columns.
- CSV export is limited to 10,000 matching rows.
- History and Open Items use 25 rows per page by default.
- Dashboard can deep-link into History using `pipeline_execution_id`.
- No separate Pipeline Run Details screen is required.
- Backend remains authoritative for filtering, ordering, pagination, status transitions and validation.

---

# 58. Still To Be Finalized

The following implementation details should be confirmed during backend work:

- exact nullability of newly exposed list fields;
- whether the API will use repeated `publish_status` parameters or another array format;
- exact response representation for `search_intent`;
- exact handling of unknown urgency strings;
- whether Run Date should be included in every CSV or only historical/Open Items CSV;
- whether Latest Results requires any pagination UI despite the 10-row maximum;
- whether Open Items should expose quick presets such as `Needs Action`;
- final database indexing based on actual query plans;
- cache TTL/stale-time values;
- user-facing copy for CSV export-limit errors.

---

# Google Stitch Wireframe Prompt

Create a low-fidelity desktop web application wireframe for the **Final Results** screen of an internal keyword research tool used by a marketing team.

Use the same application layout and navigation style as the other approved frontend screens.

At the top create two tabs:

- Latest Results
- History

Select **Latest Results** by default.

## Latest Results

Create a first section called:

**Latest Pipeline Run**

Show:

- run date;
- Final Results count, such as "10 Final Results";
- Keyword search;
- Urgency filter;
- Publish Status filter;
- Export CSV button;
- message saying results are ranked by relevance, highest first.

Create a results table with:

1. Keyword
2. Topic Title
3. Article Angle
4. Why Relevant
5. Content Type
6. Search Intent
7. Urgency
8. Publish Status

Publish Status should appear as an editable dropdown for Pending and Approved rows.

Published and Reject should appear locked/non-editable.

Do not show AI Score as a column.

Below this table create another section:

**Open Items from Previous Runs**

Show text such as:

"42 items still need attention"

This table combines Pending and Approved records from all previous pipeline runs.

Add these columns:

1. Run Date
2. Keyword
3. Topic Title
4. Article Angle
5. Why Relevant
6. Content Type
7. Search Intent
8. Urgency
9. Publish Status

Include:

- Keyword search;
- Urgency filter;
- Publish Status filter;
- Export CSV;
- pagination with 25 rows per page.

## History Tab

Create a unified historical results table.

Do not show a list of pipeline runs.

Columns:

1. Run Date
2. Keyword
3. Topic Title
4. Article Angle
5. Why Relevant
6. Content Type
7. Search Intent
8. Urgency
9. Publish Status

Include:

- Keyword search;
- Urgency filter;
- Publish Status filter;
- Export CSV;
- 25-row pagination.

Do not create:

- row detail drawers;
- AI-score columns;
- pipeline diagnostic data;
- internal IDs;
- API information;
- raw AI outputs;
- charts;
- analytics.

Keep the design simple, professional and optimized for marketing users reviewing, approving and publishing keyword recommendations.