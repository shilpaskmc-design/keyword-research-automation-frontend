# Manual Inputs Screen Specification and Backend Requirements

## 1. Purpose

The **Manual Inputs** screen allows marketing-team users to prepare additional information that should be included in the next pipeline run.

Users can:

- add an input manually;
- upload inputs using Excel;
- review inputs waiting for the next pipeline run;
- view additional details attached to each input;
- search Manual Inputs;
- filter by lifecycle status;
- filter by input source;
- review invalid records and their validation errors;
- access previously processed Manual Inputs through status filtering/history.

The default view should focus on records that are:

```text
status = pending
```

These are shown to users as:

**Ready for Next Run**

A separate Manual Input History screen is not required.

---

## 2. Main Screen Structure

The screen should contain:

1. Page title and description
2. Number of inputs ready for the next run
3. Add Manual Input button
4. Upload Excel button
5. Search
6. Status filter
7. Source filter
8. Manual Inputs table
9. Pagination

Example:

```text
Manual Inputs

Add additional information to be included
in the next pipeline run.

27 inputs ready for next run

                         [Upload Excel] [Add Manual Input]


[Search...]   [Status: Ready for Next Run ▼]   [Source: All ▼]


────────────────────────────────────────────────────────────────────
Input Text | Summary / Gist | Status | Additional Details
────────────────────────────────────────────────────────────────────
...
...
...
────────────────────────────────────────────────────────────────────

Showing 1–25 of 27                            < 1  2 >
```

---

# 3. Input Fields

When manually creating an input, users can provide:

1. Input Text
2. Summary / Gist
3. Additional Details

---

## 3.1 Input Text

Backend field:

```text
raw_text
```

Frontend label:

**Input Text**

This is the main/raw information the user wants to provide to the pipeline.

Input Text is required by the existing manual-entry API.

Use a multi-line text field.

Example:

```text
Input Text

[                                                     ]
[                                                     ]
[                                                     ]
```

---

## 3.2 Summary / Gist

Backend field:

```text
gist
```

Frontend label:

**Summary / Gist**

This provides a concise summary or explanation of the input.

The current backend Manual Entry contract treats this field as optional.

Example:

```text
Summary / Gist

[                                                     ]
[                                                     ]
```

---

## 3.3 Additional Details

Backend field:

```text
extra_data
```

Frontend label:

**Additional Details**

Users should not need to enter JSON manually.

The UI should allow users to create custom field-name/value pairs.

Example:

```text
Additional Details

Field Name                    Value

[ Target Country          ]   [ Japan              ]

[ Service                 ]   [ BIS                ]

[ + Add Field ]
```

The frontend converts these rows into a JSON object.

Example:

```json
{
  "Target Country": "Japan",
  "Service": "BIS"
}
```

The resulting object is sent as:

```text
extra_data
```

---

# 4. Add Manual Input

The **Add Manual Input** button should open a modal.

A separate page is not required.

Example:

```text
Add Manual Input

Input Text
[                                                     ]
[                                                     ]

Summary / Gist
[                                                     ]
[                                                     ]

Additional Details

Field Name                    Value
[                         ]   [                         ]

[ + Add Field ]

                        [Cancel]   [Add Input]
```

---

## 4.1 Backend Endpoint

Manual entry is already supported.

Endpoint:

```http
POST /api/v1/raw-data/manual-entry
```

No new backend endpoint is required.

---

## 4.2 Manual Entry Payload

Example:

```json
{
  "raw_text": "Japanese corporate registration rules",
  "gist": "Overview of BIS requirements for Japanese entities",
  "extra_data": {
    "Target Country": "Japan",
    "Service": "BIS"
  }
}
```

After successful creation, the record is created with:

```text
status = pending
```

and becomes available for the next pipeline run.

---

# 5. Upload Excel

The screen should provide:

**Upload Excel**

This opens an upload modal.

A separate Excel Upload page is not required.

Example:

```text
Upload Manual Inputs

Choose or drop an Excel file.

[ Choose File ]

                         [Cancel]   [Upload]
```

---

## 5.1 Backend Endpoint

Excel upload is already supported.

Endpoint:

```http
POST /api/v1/raw-data/upload-excel
```

No new backend endpoint is required.

---

## 5.2 Excel Request

The frontend sends the `.xlsx` file as binary content.

Required content type:

```text
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

Optional filename header:

```text
X-Upload-Filename: filename.xlsx
```

---

## 5.3 Excel Backend Processing

The existing backend parses Excel rows and creates Manual Intake records.

Based on the current backend:

```text
Valid rows   → pending
Invalid rows → invalid
```

Invalid rows can contain validation details.

---

## 5.4 Upload Response

Example:

```json
{
  "status": "success",
  "data": {
    "upload_batch_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "pending_rows": 25,
    "invalid_rows": 2,
    "source": "manual_excel"
  }
}
```

The frontend can use this response to show a simple upload summary.

Example:

```text
Upload completed

25 inputs ready for next run
2 invalid rows
```

---

# 6. Ready for Next Run Count

At the top of the screen, show the number of Manual Inputs currently ready for the next run.

Example:

```text
27 inputs ready for next run
```

---

## 6.1 Definition of Ready

Backend status:

```text
pending
```

Frontend label:

```text
Ready for Next Run
```

Therefore:

> `ready_count` means the number of Manual Intake records currently in `pending` status and eligible to participate in the next pipeline run.

Example:

```text
35 Manual Intake records

27 pending
8 invalid

Ready for Next Run = 27
```

---

## 6.2 Existing Backend Count Support

The current list endpoint already returns pagination metadata.

A request such as:

```http
GET /api/v1/raw-data/manual-intake?status=pending&page=1&page_size=1
```

can use:

```text
meta.pagination.total_items
```

as the Ready for Next Run count.

Therefore a dedicated summary endpoint is **not strictly required** for this screen.

---

## 6.3 Optional Summary Endpoint

As an optimization, the backend may later add:

```http
GET /api/v1/raw-data/manual-intake/summary
```

Example response:

```json
{
  "status": "success",
  "data": {
    "pending_count": 27,
    "invalid_count": 8,
    "promoted_count": 105,
    "cancelled_count": 2
  }
}
```

This is an optimization rather than a prerequisite because the existing paginated endpoint already exposes counts through pagination metadata.

---

# 7. Default Table View

The default table should show records that are:

```text
status = pending
```

Frontend label:

**Ready for Next Run**

Table columns:

| Column | Purpose |
|---|---|
| Input Text | Raw/manual information |
| Summary / Gist | Concise summary |
| Status | User-friendly lifecycle status |
| Additional Details | Extra field/value information |

Example:

```text
Input Text        Summary / Gist       Status       Additional Details
──────────────────────────────────────────────────────────────────────
BIS registration Japanese company     Ready        Country: Japan
FEMA query        FEMA requirements    Ready        Service: FEMA
```

---

# 8. Status Filter

The backend already supports lifecycle filtering through:

```http
GET /api/v1/raw-data/manual-intake?status={status}
```

Frontend labels should map to backend values.

| Frontend Label | Backend Status |
|---|---|
| Ready for Next Run | `pending` |
| Used in Previous Run | `promoted` |
| Invalid | `invalid` |
| Cancelled | `cancelled` |
| All | omit status parameter |

Default:

```text
Ready for Next Run
```

which means:

```text
status=pending
```

---

# 9. Source Filter

The backend already supports source filtering.

Frontend options:

```text
All
Manual Entry
Excel Upload
```

Mappings:

| Frontend Label | Backend Value |
|---|---|
| All | omit source parameter |
| Manual Entry | `manual_entry` |
| Excel Upload | `manual_excel` |

Example request:

```http
GET /api/v1/raw-data/manual-intake?status=pending&source=manual_excel
```

---

# 10. Search

Provide:

```text
[ Search manual inputs... ]
```

Search is already supported through:

```text
keyword
```

query parameter.

Example:

```http
GET /api/v1/raw-data/manual-intake?keyword=BIS
```

The backend currently searches both:

```text
raw_text
gist
```

using case-insensitive partial matching.

Conceptually:

```sql
raw_text ILIKE '%BIS%'
OR
gist ILIKE '%BIS%'
```

The frontend should not claim that Additional Details are searchable unless backend support is added.

---

# 11. Invalid Records

Invalid records should not clutter the default Ready view.

Users can select:

```text
Status → Invalid
```

The frontend then requests:

```http
GET /api/v1/raw-data/manual-intake?status=invalid
```

---

## 11.1 Invalid Table

When Invalid is selected, add:

**Validation Error**

Example:

```text
Input Text | Summary / Gist | Status | Additional Details | Validation Error
```

Example:

```text
Input Text      Summary      Status    Details         Validation Error
────────────────────────────────────────────────────────────────────────
ABC...          ...          Invalid   Country: Japan  Keyword is missing
XYZ...          ...          Invalid   —               Invalid volume
```

The Validation Error column should not remain visible in normal Ready views.

---

# 12. Validation Error Data

The current backend exposes:

```text
validation_message
```

as a single string.

However, detailed errors also exist as:

```text
validation_errors
```

and are not currently included in the public list response.

To fully support the proposed Invalid view, the public Manual Intake list response should expose:

```text
validation_errors
```

as an optional list of strings.

---

## 12.1 Frontend Error Rendering

If `validation_errors` contains multiple values, display them in a readable format.

Example:

```text
• Keyword is missing
• Volume must be numeric
```

The frontend should not display raw validation JSON or internal validation objects.

If only `validation_message` is present, it may be displayed as a fallback.

---

# 13. Additional Details in Table

The Manual Inputs table should not display raw JSON.

Instead:

```text
Country: Japan
Service: BIS
```

If many values exist:

```text
Country: Japan
Service: BIS
+3 more
```

The user can expand the content if necessary.

---

# 14. Additional Details Backend Gap

The backend stores:

```text
ManualIntake.extra_data
```

but the current public response schema:

```text
ManualIntakeHistoryResponse
```

does not expose it.

Therefore the frontend currently cannot render the proposed Additional Details column.

This is a required backend change.

---

# 15. History

Manual Inputs should remain accessible after processing.

The lifecycle is conceptually:

```text
pending
    ↓
pipeline consumes/promotes input
    ↓
promoted
```

The record remains stored.

Frontend label:

```text
Used in Previous Run
```

maps to:

```text
promoted
```

A separate History screen is not required.

History is provided through:

```text
Status → Used in Previous Run
```

or:

```text
Status → All
```

---

# 16. Cancelled Inputs

The backend also supports:

```text
cancelled
```

Frontend label:

```text
Cancelled
```

Cancelled inputs remain accessible through the Status filter.

---

# 17. Optional Cancel Action

The backend already supports cancelling a pending Manual Intake record.

Endpoint:

```http
POST /api/v1/raw-data/manual-intake/{intake_id}/cancel
```

It accepts an `IntakeCancellationRequest`, including:

```text
operator_identifier
reason
```

This means backend capability exists.

However, cancellation has **not yet been finalized as a required frontend action** for the Manual Inputs screen.

Therefore:

- do not automatically add a Cancel button to the current wireframe;
- treat frontend cancellation as a product decision still to be finalized.

---

# 18. Editing Existing Records

The current screen specification does not require editing an already-created Manual Input.

Existing backend analysis confirms create, list, filter, upload and cancellation capabilities, but does not establish a general Manual Intake edit/update endpoint.

Therefore, do not design an Edit action unless backend support is separately confirmed.

---

# 19. Pagination

Manual Inputs should use server-side pagination.

The current list endpoint already returns pagination metadata.

Default frontend page size should be:

```text
25 rows
```

Example:

```text
Showing 1–25 of 87

< Previous   1 2 3 4   Next >
```

Pagination should work together with:

- search;
- Status filter;
- Source filter.

---

# 20. Recommended Screen Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Manual Inputs                                                          │
│                                                                        │
│ Add additional information to be included in the next pipeline run.   │
│                                                                        │
│ 27 inputs ready for next run                [Upload Excel] [Add Input] │
│                                                                        │
│ [Search...]       [Status: Ready for Next Run ▼]   [Source: All ▼]   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Input Text │ Summary / Gist │ Status │ Additional Details         │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ ...        │ ...            │ Ready  │ Country: Japan             │ │
│ │ ...        │ ...            │ Ready  │ Service: FEMA              │ │
│ │ ...        │ ...            │ Ready  │ Country: UAE · +2 more     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ Showing 1–25 of 27                                 < 1 2 >            │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 21. Invalid View Layout

```text
Manual Inputs

[Search...]

[Status: Invalid ▼]

[Source: All ▼]


────────────────────────────────────────────────────────────────────────────
Input Text | Summary / Gist | Status | Additional Details | Validation Error
────────────────────────────────────────────────────────────────────────────
...
...
...

Showing 1–25 of 8
```

---

# 22. What Should Not Be Shown

Do not expose:

- database IDs as visible columns;
- internal UUIDs;
- raw JSON;
- internal `extra_data` JSON;
- pipeline checkpoint information;
- worker information;
- provider details;
- stack traces;
- raw validation objects;
- backend-only metadata;
- internal technical timestamps unless later needed.

Technical identifiers may still exist internally for API calls but should not be displayed to marketing users.

---

# 23. Primary User Flow

```text
Manual Inputs
      ↓
View Ready for Next Run
      ↓
Optional:
├── Add Manual Input
└── Upload Excel
      ↓
Backend validates input
      ↓
Valid
│
└── pending
    ↓
Ready for Next Run
    ↓
Pipeline runs
    ↓
promoted
    ↓
Used in Previous Run


Invalid
    ↓
status = invalid
    ↓
Available through Invalid filter
    ↓
Validation Error shown
```

---

# 24. Current Backend Support

The following functionality is already supported.

| Requirement | Backend Status |
|---|---|
| List Manual Inputs | ✅ Supported |
| Pagination | ✅ Supported |
| Status filtering | ✅ Supported |
| Source filtering | ✅ Supported |
| Search `raw_text` + `gist` | ✅ Supported |
| Add Manual Input | ✅ Supported |
| Excel upload | ✅ Supported |
| Pending/Promoted/Invalid/Cancelled statuses | ✅ Supported |
| Cancellation endpoint | ✅ Supported |
| Ready count via pagination metadata | ✅ Supported |
| `extra_data` in list response | ❌ Missing |
| detailed `validation_errors` in list response | ❌ Missing |

---

# 25. Backend Changes Needed

Only a small number of backend changes are required to fully support the finalized Manual Inputs screen.

---

## 25.1 Expose `extra_data`

### Current Problem

The database already stores:

```text
ManualIntake.extra_data
```

but:

```text
ManualIntakeHistoryResponse
```

does not expose this field.

As a result, the frontend cannot render:

```text
Country: Japan
Service: BIS
```

in the Additional Details column.

### Required Change

Add:

```python
extra_data: Optional[dict[str, Any]] = None
```

to:

```text
ManualIntakeHistoryResponse
```

and include the field when building list response items.

Conceptually:

```python
{
    "raw_text": intake.raw_text,
    "gist": intake.gist,
    "source": intake.source,
    "extra_data": intake.extra_data,
    "status": intake.status
}
```

---

## 25.2 Expose `validation_errors`

### Current Problem

The API currently exposes:

```text
validation_message
```

but does not expose the more detailed:

```text
validation_errors
```

list.

The proposed Invalid table needs clear validation errors.

### Required Change

Add:

```python
validation_errors: Optional[list[str]] = None
```

to:

```text
ManualIntakeHistoryResponse
```

and include it in service responses.

---

## 25.3 Recommended Updated Response Schema

Conceptually:

```python
class ManualIntakeHistoryResponse(BaseModel):
    id: int
    raw_text: Optional[str] = None
    gist: Optional[str] = None
    gist_source: Optional[str] = None
    source: str

    extra_data: Optional[dict[str, Any]] = None

    status: Literal[
        "pending",
        "promoted",
        "cancelled",
        "invalid"
    ]

    validation_message: Optional[str] = None
    validation_errors: Optional[list[str]] = None

    upload_batch_id: Optional[uuid.UUID] = None
    source_row_number: Optional[int] = None
    submitted_by: Optional[str] = None
    submitted_at: datetime
    pipeline_execution_id: Optional[uuid.UUID] = None
```

The frontend should use only the fields relevant to the screen.

---

# 26. Optional Backend Optimization — Summary Endpoint

A dedicated summary endpoint may be added:

```http
GET /api/v1/raw-data/manual-intake/summary
```

Possible response:

```json
{
  "status": "success",
  "data": {
    "pending_count": 27,
    "invalid_count": 8,
    "promoted_count": 105,
    "cancelled_count": 2
  }
}
```

This is **not required** for the initial Manual Inputs screen because the current list endpoint already provides:

```text
meta.pagination.total_items
```

for each filtered query.

It becomes useful if:

- Dashboard and Manual Inputs both need multiple counts;
- repeated list/count requests become inefficient;
- a single summary request simplifies frontend loading.

---

# 27. Frontend Query Examples

## Default Ready View

```http
GET /api/v1/raw-data/manual-intake?status=pending&page=1&page_size=25
```

---

## Search Ready Inputs

```http
GET /api/v1/raw-data/manual-intake?status=pending&keyword=BIS&page=1&page_size=25
```

---

## Excel Inputs Only

```http
GET /api/v1/raw-data/manual-intake?status=pending&source=manual_excel&page=1&page_size=25
```

---

## Invalid Inputs

```http
GET /api/v1/raw-data/manual-intake?status=invalid&page=1&page_size=25
```

---

## Used in Previous Runs

```http
GET /api/v1/raw-data/manual-intake?status=promoted&page=1&page_size=25
```

---

## Cancelled Inputs

```http
GET /api/v1/raw-data/manual-intake?status=cancelled&page=1&page_size=25
```

---

# 28. Frontend Field Mappings

## Create Manual Input

| Frontend Field | Backend Field |
|---|---|
| Input Text | `raw_text` |
| Summary / Gist | `gist` |
| Additional Details | `extra_data` |

---

## Table

| Frontend Column | Backend Field |
|---|---|
| Input Text | `raw_text` |
| Summary / Gist | `gist` |
| Status | `status` |
| Additional Details | `extra_data` |
| Validation Error | `validation_errors` / `validation_message` |

---

## Status

| Frontend | Backend |
|---|---|
| Ready for Next Run | `pending` |
| Used in Previous Run | `promoted` |
| Invalid | `invalid` |
| Cancelled | `cancelled` |

---

## Source

| Frontend | Backend |
|---|---|
| Manual Entry | `manual_entry` |
| Excel Upload | `manual_excel` |

---

# 29. Current Finalized Decisions

The current agreed direction is:

- Manual Inputs is a dedicated screen.
- Default view is **Ready for Next Run**.
- Ready for Next Run maps to backend `pending`.
- The ready count represents pending inputs eligible for the next pipeline run.
- Add Manual Input opens a modal.
- Excel Upload opens a modal.
- No separate Add Manual Input screen is required.
- No separate Excel Upload screen is required.
- Manual Input fields are:
  - Input Text
  - Summary / Gist
  - Additional Details
- Input Text maps to `raw_text`.
- Summary / Gist maps to `gist`.
- Additional Details maps to `extra_data`.
- Additional Details use dynamic Field Name + Value rows.
- Frontend converts those rows into an `extra_data` JSON object.
- Main table displays:
  - Input Text
  - Summary / Gist
  - Status
  - Additional Details
- Validation Error appears only where useful, especially for Invalid records.
- Search covers `raw_text` and `gist`.
- Status filtering is backend-supported.
- Source filtering is backend-supported.
- History is handled through status filtering.
- Used in Previous Run maps to `promoted`.
- A separate Manual Input History screen is not required.
- Excel upload is already backend-supported.
- Manual entry is already backend-supported.
- Cancellation exists in the backend but is not yet finalized as a frontend action.
- Existing records should not have an Edit action unless a backend update capability is separately confirmed.
- Backend must expose `extra_data` for the Additional Details column.
- Backend should expose `validation_errors` for the Invalid view.
- A dedicated Manual Intake summary endpoint is optional rather than mandatory.
- Technical and diagnostic data should not be displayed.

---

# 30. Still To Be Finalized

The following product/UI decisions remain open:

- whether Pending records can be cancelled from the frontend;
- whether cancellation should require a reason;
- whether invalid records can be corrected and resubmitted;
- whether invalid records require a separate action besides viewing errors;
- whether Additional Details expands inline or through a small popover;
- whether Excel upload should offer a downloadable template;
- exact Excel upload success/error messaging;
- exact maximum length of `raw_text`;
- exact maximum length of `gist`;
- whether duplicate Additional Detail field names are allowed;
- whether duplicate Manual Inputs are allowed;
- whether individual rows need any actions in the default table.

---

# 31. Backend Implementation Checklist

- [ ] Add `extra_data` to `ManualIntakeHistoryResponse`.
- [ ] Project `ManualIntake.extra_data` in Manual Intake list responses.
- [ ] Add `validation_errors` to `ManualIntakeHistoryResponse`.
- [ ] Project detailed validation errors for invalid records.
- [ ] Preserve existing `validation_message` fallback.
- [ ] Verify `status=pending` count matches Ready for Next Run semantics.
- [ ] Verify Search continues to cover `raw_text` and `gist`.
- [ ] Preserve Status filters:
  - [ ] `pending`
  - [ ] `promoted`
  - [ ] `invalid`
  - [ ] `cancelled`
- [ ] Preserve Source filters:
  - [ ] `manual_entry`
  - [ ] `manual_excel`
- [ ] Preserve `POST /api/v1/raw-data/manual-entry`.
- [ ] Preserve `POST /api/v1/raw-data/upload-excel`.
- [ ] Preserve existing cancellation endpoint.
- [ ] Add/update backend tests.
- [ ] Regenerate public OpenAPI snapshot.
- [ ] Re-sync frontend API types.
- [ ] Update frontend handoff documentation.
- [ ] Decide separately whether the summary endpoint is worth implementing.

---

# Google Stitch Wireframe Prompt

Create a low-fidelity desktop web application wireframe for an internal keyword research tool used by a marketing team.

Screen name:

**Manual Inputs**

Use the same left sidebar and overall layout as the approved Dashboard and other application screens.

At the top show:

- page title "Manual Inputs";
- short description explaining that these inputs will be included in the next pipeline run;
- "27 inputs ready for next run";
- "Upload Excel" button;
- "Add Manual Input" button.

Below show:

- Search field;
- Status filter with "Ready for Next Run" selected;
- Source filter with "All" selected.

Create a table with:

1. Input Text
2. Summary / Gist
3. Status
4. Additional Details

Show example Ready records.

For Additional Details, display readable key/value pairs such as:

```text
Country: Japan
Service: BIS
```

If more values exist, show:

```text
Country: UAE
Service: FEMA
+2 more
```

Use pagination with 25 rows per page.

Also create an **Add Manual Input modal** containing:

- Input Text multi-line field;
- Summary / Gist multi-line field;
- Additional Details section;
- Field Name input;
- Value input;
- "+ Add Field";
- Cancel;
- Add Input.

Also create an **Upload Excel modal** containing:

- drag-and-drop or Choose File area;
- Cancel;
- Upload.

Show an alternative Invalid table state where the Status filter is set to Invalid.

In the Invalid state add:

**Validation Error**

as an additional table column.

Do not add:

- charts;
- analytics;
- technical IDs;
- raw JSON;
- API information;
- diagnostics;
- pipeline internals;
- unrelated dashboard statistics.

Keep the design simple, professional and focused on preparing and reviewing Manual Inputs for the next pipeline run.