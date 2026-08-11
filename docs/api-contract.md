# API Contract

> [!info] Document Status
> **Status:** MVP Frontend API Contract
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define the backend API contract required by the frontend. OpenAPI remains the authoritative source for exact paths, schemas, enums, nullability, and validation rules.

---

# 1. Contract Principles

The frontend treats the backend public API and approved OpenAPI specification as authoritative.

Frontend developers must not derive API behaviour from:

* database schemas;
* internal backend models;
* private implementation details;
* assumptions based on the UI.

Generated OpenAPI types should be used wherever practical.

---

# 2. API Integration

All requests follow:

```text
Feature Hook
    ↓
Feature API Function
    ↓
Shared API Client
    ↓
Backend API
```

Shared client:

```text
src/api/client.ts
```

Feature API functions:

```text
src/features/<feature>/api/
```

Raw API requests should not be made directly from React components.

---

# 3. Generated Types

Generated OpenAPI types live in:

```text
src/api/generated/
```

Example:

```text
src/api/generated/schema.d.ts
```

Rules:

* do not manually edit generated files;
* regenerate when the approved API contract changes;
* do not manually duplicate backend DTOs unless a separate frontend model is genuinely required.

---

# 4. Error Contract

The frontend should preserve:

```text
HTTP Status
Stable Error Code
Safe Message
Validation Details
```

Conceptual normalized error:

```typescript
interface ApiError {
  status: number
  code?: string
  message: string
  validation?: unknown
}
```

Frontend behaviour must not depend on parsing arbitrary backend message text.

Important statuses:

| Status | Meaning                              |
| ------ | ------------------------------------ |
| `200`  | Success                              |
| `201`  | Created                              |
| `202`  | Accepted for asynchronous processing |
| `400`  | Invalid request                      |
| `409`  | Business conflict                    |
| `413`  | Request/export limit exceeded        |
| `422`  | Validation/filter error              |
| `500+` | Server failure                       |

---

# 5. Pipeline Contract

Required frontend operations:

```text
Start Pipeline
Get Current / Latest Execution
Get Pipeline Run History
Get Execution Stage State
```

Known start endpoint:

```http
POST /api/v1/pipeline/runs
```

Known read endpoints:

```http
GET /api/v1/pipeline/runs
GET /api/v1/pipeline/runs/latest
GET /api/v1/pipeline/runs/{pipeline_execution_id}
```

A `202` response means the execution was accepted/queued, not completed.

## Execution Status

```text
queued
running
completed
partial
failed
abandoned
```

Classification:

```text
Active:
- queued
- running

Terminal:
- completed
- partial
- failed
- abandoned
```

## Stage Status

Known frontend-relevant stage states:

```text
pending
running
completed
interrupted
partial
failed
superseded
```

Execution status and stage status are separate domains.

## Stage Labels

| Backend Stage    | Frontend Label                            |
| ---------------- | ----------------------------------------- |
| `collection`     | Collecting Data                           |
| `ai_pass1a`      | Filtering Relevance & Generating Keywords |
| `ai_pass1b`      | Grouping Similar Keywords                 |
| `seo_enrichment` | Extracting SEO Data                       |
| `ai_pass2`       | Evaluating & Filtering Keywords           |
| `ranking`        | Preparing Final Results                   |

---

# 6. Final Results Contract

Primary endpoint:

```http
GET /api/v1/final-results
```

Related endpoints:

```http
GET   /api/v1/final-results/export.csv
PATCH /api/v1/sheet-export-rows/{row_id}/status
```

Required scopes:

```text
Latest Pipeline Results
Open Items from Previous Runs
History
Specific Historical Pipeline Run
```

Supported query concepts:

```text
pipeline_execution_id
exclude_pipeline_execution_id
service_area_id
service_offering_id
search
relevance_min
relevance_max
selection_status
urgency
publish_status
rank_min
rank_max
page
page_size
sort_by
sort_direction
```

Exact parameter names and encoding follow OpenAPI.

## Urgency

```text
high
medium
low
```

These are the currently defined frontend options. The OpenAPI contract treats
`urgency` as an open string rather than a closed backend enum.

## Publish Status

```text
Pending
Approved
Published
Reject
```

Exact casing must follow the backend enum.

## Open Items

Open Items require the backend-supported equivalent of:

```text
Exclude latest execution

Publish Status:
- Pending
- Approved
```

## Pagination

Expected contract:

```text
page
page_size
total_items
total_pages
has_next
has_previous
```

Current direction:

```text
page:
default = 1
minimum = 1

page_size:
default = 25
minimum = 1
maximum = 100
```

Ordering remains backend-authoritative.

---

# 7. Publish Status Update

Endpoint:

```http
PATCH /api/v1/sheet-export-rows/{row_id}/status
```

The `{row_id}` must come from the backend response. The frontend must not
create its own identifier or substitute a different result or execution ID.

Feature function:

```typescript
updatePublishStatus(...)
```

Backend remains authoritative for allowed transitions.

Terminal statuses:

```text
Published
Reject
```

---

# 8. Final Results CSV Export

The frontend requires an export operation supporting the same relevant scope as Final Results:

```text
Pipeline Execution
Search
Urgency
Publish Status
Ordering
```

Export must contain all matching records, not only the current page.

Maximum matching rows:

```text
10,000
```

Limit response:

```text
HTTP 413
Code: FINAL_RESULT_EXPORT_LIMIT_EXCEEDED
```

Successful export returns a downloadable file response rather than the normal JSON response.

---

# 9. Manual Inputs Contract

Known list endpoint:

```http
GET /api/v1/raw-data/manual-intake
```

Required operations:

```text
List Manual Inputs
Create Manual Input
Upload Excel
Retrieve Manual Input Summary
Cancel Manual Input where included in the MVP screen scope
```

Known supporting endpoints:

```http
GET  /api/v1/raw-data/manual-intake/summary
POST /api/v1/raw-data/manual-entry
POST /api/v1/raw-data/upload-excel
POST /api/v1/raw-data/manual-intake/{intake_id}/cancel
```

Supported list concepts:

```text
keyword
status
source
page
page_size
```

## Status

| API Value   | Frontend Label       |
| ----------- | -------------------- |
| `pending`   | Ready for Next Run   |
| `promoted`  | Used in Previous Run |
| `invalid`   | Invalid              |
| `cancelled` | Cancelled            |

Default frontend scope:

```text
status = pending
```

## Source

| API Value      | Frontend Label |
| -------------- | -------------- |
| `manual_entry` | Manual Entry   |
| `manual_excel` | Excel Upload   |

## Create Manual Input

Required request concepts:

```text
input_text
summary / gist
additional_details
```

Exact field names and schema follow OpenAPI.

Current field mapping:

```text
Input Text          → raw_text
Summary / Gist      → gist
Additional Details  → extra_data
```

## Summary

Dashboard requires backend-provided summary concepts such as:

```text
ready_count
invalid_count
total_unprocessed_count
```

`ready_count` must represent backend eligibility and must not be calculated from the currently visible table page.

## Excel Upload

The upload contract must support reporting:

```text
Ready records
Invalid records
Validation information where applicable
```

Exact endpoint and response schema follow OpenAPI.

---

# 10. Business Profile Contract

Required operations:

```text
List Categories
Create Category
Delete Category

List Category Entries
Create Entry
Delete Entry
```

Not supported in the current MVP:

```text
Rename Category
Edit Entry
```

The backend contract must define deletion behaviour when a category contains entries.

The frontend must not assume cascade deletion.

---

# 11. Service Taxonomy Contract

Service Taxonomy is read-only in the MVP.

Known endpoint:

```http
GET /api/v1/service-taxonomy
```

Required data:

```text
Service Areas
    ↓
Service Offerings
    ↓
SEO Queries
```

No frontend mutation operations are required.

The endpoint does not provide search query parameters in the current public
contract. MVP search is therefore client-side over the complete hierarchy
returned by the read-only endpoint. Matching parent Service Areas should
expand to reveal matching offerings or SEO Queries.

---

# 12. Common Query Rules

For backend-driven datasets:

* omit unused optional filters;
* preserve backend enum values;
* follow OpenAPI array encoding;
* do not send empty strings where omission is expected;
* use server-side pagination where supported;
* preserve backend ordering unless an explicit sort parameter is used.

---

# 13. Date and Null Handling

Backend timestamps are authoritative.

Examples:

```text
started_at
completed_at
final_stage_completed_at
```

Frontend may format them for display but must not replace them with locally generated timestamps.

Nullable fields must be handled according to generated types.

Where appropriate, missing display values may use:

```text
—
```

---

# 14. Unknown Contract Values

If an unknown backend enum or status appears:

```text
Preserve the value
Use a neutral frontend fallback
Do not crash
Do not silently map it to another known value
```

This helps expose API contract drift during development.

---

# 15. API Environment

Current API version:

```text
/api/v1/
```

Base URL must come from environment configuration:

```text
VITE_API_BASE_URL
```

Do not hard-code staging or production URLs inside feature code.

Authentication is not part of the current MVP.

---

# 16. Remaining Product / Implementation Decisions

The following are the remaining items that may require product or UX
decisions. Exact endpoint paths, schemas, enums, nullability, pagination, and
encoding must be read directly from the committed OpenAPI snapshot rather than
treated as unresolved contract items.

```text
Allowed Publish Status transitions
Exact Final Results search scope
Category deletion behaviour with existing entries
Whether Manual Input cancellation is exposed in the MVP UI
```

Frontend developers should not guess these contracts.

---

# 17. API Contract Guardrails

1. OpenAPI is authoritative for exact API definitions.
2. Use generated API types wherever practical.
3. Never manually edit generated files.
4. Keep feature API functions inside their owning feature.
5. Use the Shared API Client for common HTTP handling.
6. Do not make raw API calls from React components.
7. Keep backend enum values separate from frontend labels.
8. Do not recreate backend filtering, ordering, validation, or eligibility rules.
9. Do not calculate backend-authoritative counts from visible frontend data.
10. Do not parse arbitrary error messages for application logic.
11. Handle nullable and unknown values explicitly.
12. Do not expose endpoints or actions that are not supported by the public API.

---

# 18. Related Documents

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
```

This document defines **what backend contract the frontend depends on**.

Implementation architecture, interaction behaviour, component ownership, visual rules, and detailed screen behaviour are defined in their respective documents.
