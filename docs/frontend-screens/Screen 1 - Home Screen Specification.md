# Required Backend Changes for Dashboard Screen Specification

## 1. Purpose

This document defines the backend changes required to support the proposed **Dashboard Screen** for the keyword research automation frontend.

The screen is currently referred to as **Dashboard**.

A future rename from **Dashboard** to **Home** has been proposed, but this should not be reflected in implementation or documentation until approved.

The Dashboard is intended to provide the marketing team with a simple operational view of:

- the currently active pipeline;
- current pipeline progress;
- Manual Inputs ready for the next run;
- the latest completed pipeline run;
- Final Results count;
- recent previous pipeline runs;
- navigation to Final Results.

The Dashboard must not expose backend diagnostics or technical execution details.

---

## 2. Backend Ownership Principle

The backend remains authoritative for:

- pipeline execution state;
- stage state;
- stage ordering;
- stage-to-display-name mapping;
- Manual Input eligibility;
- Final Results count;
- pipeline lifecycle rules;
- allowed pipeline actions;
- validation rules;
- error codes.

The frontend should display backend state rather than reconstructing pipeline business logic itself.

---

## 3. Required Backend Changes

The Dashboard requires the following main backend changes:

1. Manual Intake summary for the next pipeline run.
2. `final_results_count` in pipeline execution summaries.
3. Active pipeline stage progress.
4. Marketing-friendly stage labels.
5. Recent previous pipeline runs without duplicating the active execution.
6. Public OpenAPI contract updates.

A unified Dashboard summary endpoint may also be introduced as an optimization, but it is not mandatory for the first implementation.

---

## 4. Manual Intake Summary

### 4.1 Requirement

The Dashboard needs to show how many Manual Input records are currently **ready for the next pipeline run**.

Example:

```text
Manual Inputs

27 entries ready for the next run

[View Inputs]
```

The Dashboard does not need to fetch all Manual Input rows just to calculate this number.

### 4.2 Definition of `ready_count`

`ready_count` means:

> Number of Manual Input records currently eligible to participate in the next pipeline run.

It should be calculated using the backend's existing validation and eligibility rules.

It must not simply be a `COUNT(*)` of every record if some records are invalid or otherwise ineligible for the next run.

Example:

```text
35 Manual Input records

27 valid / eligible
8 invalid

ready_count = 27
invalid_count = 8
```

The Dashboard should display:

```text
27 entries ready for the next run
```

### 4.3 Recommended Endpoint

Add:

```http
GET /api/v1/raw-data/manual-intake/summary
```

Recommended response:

```json
{
  "status": "success",
  "data": {
    "ready_count": 27,
    "invalid_count": 8,
    "total_unprocessed_count": 35
  },
  "meta": {
    "request_id": "uuid",
    "timestamp": "2026-08-10T11:41:00Z",
    "duration_ms": 5
  }
}
```

`has_ready_inputs` is not strictly required because the frontend can determine:

```text
ready_count > 0
```

However, it may remain in the API if useful elsewhere.

---

## 5. Final Results Count

### 5.1 Requirement

The Dashboard needs a Final Results count for:

- Pipeline Completed state;
- Latest Pipeline Run;
- Recent Pipeline Runs.

Example:

```text
Latest Pipeline Run

Completed
10 Aug 2026

7 Final Results

[View Final Results]
```

### 5.2 Definition of `final_results_count`

`final_results_count` means:

> Number of rows in `sheet_export_rows` associated with that specific `pipeline_execution_id`.

Phase 9 already controls the final selection and writes a maximum of 10 Final Results for a single pipeline execution.

Therefore, the Dashboard does not need to apply another top-10 rule.

For a single pipeline execution:

```text
Minimum final_results_count = 0
Maximum final_results_count = 10
```

Examples:

```text
Run A
sheet_export_rows for Run A = 10
final_results_count = 10
```

```text
Run B
sheet_export_rows for Run B = 7
final_results_count = 7
```

### 5.3 Historical Table Size

The overall `sheet_export_rows` database table can contain more than 10 rows because it stores results from multiple pipeline executions.

Example:

```text
Week 1 → 10 rows
Week 2 → 7 rows
Week 3 → 10 rows

Total sheet_export_rows = 27
```

This does not affect `final_results_count`.

The Dashboard count must always be scoped to one `pipeline_execution_id`.

### 5.4 Dashboard Presentation

Display:

```text
10 Final Results
```

or:

```text
7 Final Results
```

Do not display:

```text
7 of 10
```

A pipeline producing fewer than 10 Final Results does not by itself mean the pipeline failed or produced an incomplete result.

---

## 6. Pipeline Execution Summary Update

The pipeline execution summary should expose `final_results_count`.

Example:

```json
{
  "pipeline_execution_id": "uuid",
  "status": "completed",
  "requested_at": "2026-08-10T08:30:00Z",
  "started_at": "2026-08-10T08:31:00Z",
  "completed_at": "2026-08-10T09:15:00Z",
  "final_results_count": 10
}
```

Recommended field:

```text
final_results_count: integer | null
```

Expected behavior:

| Pipeline State | `final_results_count` |
|---|---:|
| queued | `null` |
| running | `null` |
| completed | `0–10` |
| partial | Based on authoritative backend behavior |
| failed | `null` |
| abandoned | `null` |

Do not make the frontend query and count Final Results separately for every Recent Pipeline Runs row.

---

## 7. Active Pipeline Progress

### 7.1 Requirement

When a pipeline is active, the Dashboard itself should show its progress.

There is no separate Pipeline Progress screen.

Example:

```text
Pipeline Running

Started today at 10:42 AM

✓ Collecting Data
✓ Filtering Relevance & Generating Keywords
● Grouping Similar Keywords
○ Extracting SEO Data
○ Evaluating & Filtering Keywords
○ Preparing Final Results
```

The frontend should not invent percentage completion.

Progress should be based on authoritative backend stage state.

---

## 8. Pipeline Stage Mapping

The internal pipeline currently contains these stages:

```text
collection
ai_pass1a
ai_pass1b
seo_enrichment
ai_pass2
ranking
```

The Dashboard should not expose these technical names.

Use marketing-friendly display labels.

| Internal Pipeline Stage | Dashboard Display Label | Display Order |
|---|---|---:|
| `collection` | Collecting Data | 1 |
| `ai_pass1a` | Filtering Relevance & Generating Keywords | 2 |
| `ai_pass1b` | Grouping Similar Keywords | 3 |
| `seo_enrichment` | Extracting SEO Data | 4 |
| `ai_pass2` | Evaluating & Filtering Keywords | 5 |
| `ranking` | Preparing Final Results | 6 |

---

## 9. Stage Naming Rationale

### `collection`

Display:

```text
Collecting Data
```

This clearly tells the marketing user that the pipeline is gathering the data required for processing.

### `ai_pass1a`

Display:

```text
Filtering Relevance & Generating Keywords
```

This describes the business activity without exposing the internal `ai_pass1a` terminology.

### `ai_pass1b`

Display:

```text
Grouping Similar Keywords
```

This is more specific than "Grouping Similar Data" and tells the marketing user what is actually being grouped.

### `seo_enrichment`

Display:

```text
Extracting SEO Data
```

This reflects the SEO enrichment activity while remaining understandable to a marketing user.

### `ai_pass2`

Display:

```text
Evaluating & Filtering Keywords
```

This distinguishes the later evaluation stage from the earlier relevance filtering and keyword-generation stage.

### `ranking`

Display:

```text
Preparing Final Results
```

This communicates the final pipeline activity without exposing ranking implementation details.

---

## 10. Stage Progress Contract

The backend should provide enough information for the frontend to determine:

- completed stages;
- currently running stage;
- pending stages;
- failed stage if applicable.

Example:

```json
{
  "current_stage": {
    "key": "seo_enrichment",
    "display_name": "Extracting SEO Data",
    "status": "running"
  },
  "stages": [
    {
      "key": "collection",
      "display_name": "Collecting Data",
      "status": "completed",
      "order": 1
    },
    {
      "key": "ai_pass1a",
      "display_name": "Filtering Relevance & Generating Keywords",
      "status": "completed",
      "order": 2
    },
    {
      "key": "ai_pass1b",
      "display_name": "Grouping Similar Keywords",
      "status": "completed",
      "order": 3
    },
    {
      "key": "seo_enrichment",
      "display_name": "Extracting SEO Data",
      "status": "running",
      "order": 4
    },
    {
      "key": "ai_pass2",
      "display_name": "Evaluating & Filtering Keywords",
      "status": "pending",
      "order": 5
    },
    {
      "key": "ranking",
      "display_name": "Preparing Final Results",
      "status": "pending",
      "order": 6
    }
  ]
}
```

The backend should remain authoritative for stage status and ordering.

---

## 11. No Artificial Percentage Progress

Do not require the backend or frontend to generate artificial percentages such as:

```text
62% complete
```

unless the backend can calculate a genuinely meaningful percentage.

The Dashboard should use stage-based progress instead.

Example:

```text
✓ Collecting Data
✓ Filtering Relevance & Generating Keywords
● Grouping Similar Keywords
○ Extracting SEO Data
○ Evaluating & Filtering Keywords
○ Preparing Final Results
```

---

## 12. Recent Pipeline Runs

### 12.1 Purpose

The Dashboard should show a small list of recent **previous** pipeline executions.

Recommended:

```text
3–5 recent previous runs
```

Example:

| Date | Status | Final Results | Action |
|---|---|---:|---|
| 3 Aug 2026 | Completed | 10 | View Results |
| 27 Jul 2026 | Completed | 7 | View Results |
| 20 Jul 2026 | Failed | — | — |

---

## 13. Active Pipeline Must Not Be Duplicated

If a pipeline is currently running, it should appear only in the main Pipeline Progress section.

Example:

```text
Pipeline Running

Started today at 10:42 AM

✓ Collecting Data
✓ Filtering Relevance & Generating Keywords
● Grouping Similar Keywords
○ Extracting SEO Data
○ Evaluating & Filtering Keywords
○ Preparing Final Results
```

The same execution should **not** also appear in Recent Pipeline Runs.

Do not show:

```text
Recent Pipeline Runs

10 Aug 2026   Running      —
3 Aug 2026    Completed    10
27 Jul 2026   Completed     7
```

Instead show:

```text
Recent Pipeline Runs

3 Aug 2026    Completed    10    View Results
27 Jul 2026   Completed     7    View Results
20 Jul 2026   Failed        —    —
```

Therefore:

> **Current active pipeline = Pipeline Progress section.**

> **Recent Pipeline Runs = previous pipeline executions.**

This avoids displaying the same execution twice on the Dashboard.

---

## 14. Latest Pipeline Run

When there is no active pipeline, the Dashboard should show the most recently completed pipeline separately.

Example:

```text
Latest Pipeline Run

Completed
10 Aug 2026

10 Final Results

[View Final Results]
```

The backend must provide:

- pipeline execution ID;
- status;
- completion timestamp;
- `final_results_count`.

---

## 15. Recent Pipeline Runs and Latest Run

The Latest Pipeline Run may also appear as the first row of Recent Pipeline Runs when there is no active execution.

This is acceptable because the two sections serve different purposes:

- **Latest Pipeline Run** provides a prominent shortcut to the most recent output.
- **Recent Pipeline Runs** provides chronological context for previous executions.

However, the **currently active execution must never be duplicated** in Recent Pipeline Runs.

---

## 16. View Results — Latest Completed Run

When the user clicks **View Results** for the latest completed pipeline:

```text
Dashboard
    ↓
View Results
    ↓
Final Results
    ↓
Latest Results
```

The backend already supports retrieving Final Results by `pipeline_execution_id`.

No separate Pipeline Run Details screen is required.

---

## 17. View Results — Older Completed Run

When the user clicks **View Results** for an older completed pipeline:

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
    ↓
Filter by selected pipeline_execution_id
```

The frontend should pass the selected:

```text
pipeline_execution_id
```

to the existing Final Results query.

No new backend endpoint is required specifically for viewing an older run's results if the existing Final Results endpoint already supports `pipeline_execution_id`.

---

## 18. Failed Recent Runs

Failed pipeline runs may appear in Recent Pipeline Runs.

Example:

```text
20 Jul 2026    Failed    —    —
```

No **View Results** action is required for failed runs unless Final Results actually exist and product requirements later define that behavior.

When the backend includes `resume` in a failed execution's `allowed_actions`,
the existing Action cell shows a minimal **Resume** button. The backend-provided
allowed action is authoritative; the frontend must not derive resumability from
the recovery state. Resume uses the existing execution progress experience and
does not introduce a separate workflow or progress display.

The Dashboard must not expose:

- stack traces;
- worker errors;
- provider errors;
- model errors;
- checkpoint information;
- internal failure diagnostics.

---

## 19. No Separate Pipeline Runs Screen

The frontend does not currently require a separate Pipeline Runs screen.

Pipeline-related functionality is distributed as follows:

| Requirement | Frontend Location |
|---|---|
| Start Pipeline | Dashboard |
| Manual Intake reminder | Dashboard modal |
| Active Pipeline Progress | Dashboard |
| Latest Pipeline Run | Dashboard |
| Recent Pipeline Runs | Dashboard |
| Latest Final Results | Final Results → Latest Results |
| Historical Final Results | Final Results → History |
| Open older run results | Dashboard → Final Results → History |

Therefore, no backend changes should be introduced solely to support a dedicated Pipeline Runs frontend screen.

---

## 20. Existing Endpoint Readiness

| Dashboard Requirement | Existing Path | Current Situation | Backend Change |
|---|---|---|---|
| Start Pipeline | `POST /api/v1/pipeline/runs` | Existing | No path change |
| Manual Input ready count | `GET /api/v1/raw-data/manual-intake` | Paginated records only | Add summary endpoint |
| Active pipeline | `GET /api/v1/pipeline/runs/latest` | Execution summary exists | Add/return stage progress |
| Final Results count | Pipeline summary | Count missing | Add `final_results_count` |
| Recent previous runs | `GET /api/v1/pipeline/runs` | Existing run summaries | Include result count and exclude/handle active execution appropriately |
| Latest Results | `GET /api/v1/final-results` | Existing | Use execution filter as required |
| Historical run results | `GET /api/v1/final-results` | Supports `pipeline_execution_id` | No new endpoint required |

---

## 21. Unified Dashboard Summary Endpoint

A composite Dashboard endpoint may be added:

```http
GET /api/v1/dashboard/summary
```

This is an optimization, not a mandatory requirement.

The Dashboard can initially load data from the existing domain endpoints plus the new Manual Intake summary endpoint.

A composite endpoint becomes useful if:

- multiple requests create inconsistent Dashboard state;
- Dashboard loading performance becomes poor;
- frontend orchestration becomes unnecessarily complex.

Do not introduce the endpoint only because the Dashboard needs data from several backend domains.

---

## 22. Optional Dashboard Summary Response

If the composite endpoint is implemented, a possible response is:

```json
{
  "status": "success",
  "data": {
    "active_execution": {
      "pipeline_execution_id": "uuid",
      "status": "running",
      "started_at": "2026-08-10T10:42:00Z",
      "current_stage": {
        "key": "seo_enrichment",
        "display_name": "Extracting SEO Data",
        "status": "running"
      },
      "stages": [
        {
          "key": "collection",
          "display_name": "Collecting Data",
          "status": "completed",
          "order": 1
        },
        {
          "key": "ai_pass1a",
          "display_name": "Filtering Relevance & Generating Keywords",
          "status": "completed",
          "order": 2
        },
        {
          "key": "ai_pass1b",
          "display_name": "Grouping Similar Keywords",
          "status": "completed",
          "order": 3
        },
        {
          "key": "seo_enrichment",
          "display_name": "Extracting SEO Data",
          "status": "running",
          "order": 4
        },
        {
          "key": "ai_pass2",
          "display_name": "Evaluating & Filtering Keywords",
          "status": "pending",
          "order": 5
        },
        {
          "key": "ranking",
          "display_name": "Preparing Final Results",
          "status": "pending",
          "order": 6
        }
      ]
    },
    "latest_completed_execution": {
      "pipeline_execution_id": "uuid",
      "status": "completed",
      "completed_at": "2026-08-03T10:45:00Z",
      "final_results_count": 10
    },
    "manual_inputs_summary": {
      "ready_count": 27,
      "invalid_count": 8,
      "total_unprocessed_count": 35
    },
    "recent_executions": [
      {
        "pipeline_execution_id": "uuid",
        "started_at": "2026-08-03T10:00:00Z",
        "completed_at": "2026-08-03T10:45:00Z",
        "status": "completed",
        "final_results_count": 10
      },
      {
        "pipeline_execution_id": "uuid",
        "started_at": "2026-07-27T14:00:00Z",
        "completed_at": "2026-07-27T14:45:00Z",
        "status": "completed",
        "final_results_count": 7
      },
      {
        "pipeline_execution_id": "uuid",
        "started_at": "2026-07-20T14:20:00Z",
        "completed_at": "2026-07-20T14:25:00Z",
        "status": "failed",
        "final_results_count": null
      }
    ]
  }
}
```

The active execution should not also be included in `recent_executions`.

---

## 23. Dashboard-Safe API Data

The backend may internally maintain detailed execution information, but the Dashboard frontend should only consume/render information useful to marketing users.

### Useful

- pipeline status;
- start time;
- completion time;
- stage progress;
- marketing-friendly stage label;
- Manual Input ready count;
- Final Results count;
- recent run status.

### Not useful on Dashboard

- worker IDs;
- execution internals;
- retry counters;
- checkpoint IDs;
- provider information;
- model names;
- prompts;
- raw AI responses;
- token counts;
- database details;
- stack traces;
- heartbeat data.

---

## 24. Pipeline Completed State

When the active pipeline transitions from running to completed, the Dashboard can temporarily show:

```text
Pipeline Completed

10 Final Results

[View Final Results]
```

If only seven results were generated:

```text
Pipeline Completed

7 Final Results

[View Final Results]
```

The backend does not need to maintain a special persistent "Dashboard completed" state.

The frontend can derive this transient UI state from the execution transition:

```text
running → completed
```

On a later Dashboard load, the execution appears normally as the Latest Pipeline Run.

---

## 25. Backend Changes That Are Required

### 25.1 Manual Intake Summary

Add a lightweight mechanism to return:

```text
ready_count
invalid_count
total_unprocessed_count
```

with `ready_count` based on actual eligibility for the next pipeline run.

### 25.2 Final Results Count

Add:

```text
final_results_count
```

to the pipeline execution summary.

It must count `sheet_export_rows` scoped to the specific `pipeline_execution_id`.

Expected completed-run range:

```text
0–10
```

### 25.3 Active Stage Progress

Expose enough stage information for the Dashboard to show:

```text
completed
running
pending
```

states for the six marketing-facing pipeline stages.

### 25.4 Marketing-Friendly Stage Mapping

Use:

```text
collection      → Collecting Data
ai_pass1a       → Filtering Relevance & Generating Keywords
ai_pass1b       → Grouping Similar Keywords
seo_enrichment  → Extracting SEO Data
ai_pass2        → Evaluating & Filtering Keywords
ranking         → Preparing Final Results
```

The frontend should not need to understand internal AI pass terminology.

### 25.5 Recent Previous Executions

Ensure the Dashboard can retrieve recent previous runs without duplicating the currently active execution.

Recent run summaries need:

```text
pipeline_execution_id
status
started_at
completed_at
final_results_count
```

### 25.6 OpenAPI Contract

After backend changes are implemented:

- regenerate `docs/openapi/public-openapi.json`;
- verify the new/changed schemas;
- regenerate or synchronize frontend API types;
- update frontend handoff documentation where necessary.

---

## 26. Optional Backend Change

The following is recommended only if it provides a measurable implementation benefit:

```http
GET /api/v1/dashboard/summary
```

It may aggregate:

- active execution;
- active stage progress;
- latest completed execution;
- Manual Intake summary;
- recent previous executions.

This should be treated as an optimization rather than a prerequisite for building the Dashboard.

---

## 27. Backend Changes Not Required

The following are not currently required:

- separate Pipeline Runs frontend API;
- Pipeline Run Details endpoint;
- artificial pipeline percentage calculation;
- diagnostic Dashboard endpoint;
- analytics endpoint;
- Dashboard charts endpoint;
- new historical Final Results endpoint;
- frontend calculation of Final Results count;
- frontend reconstruction of pipeline stage business logic.

---

## 28. Final Dashboard Data Flow

### No Active Pipeline

```text
Dashboard
    ↓
Manual Intake Summary
    ↓
Latest Completed Pipeline
    ↓
Recent Previous Pipeline Runs
```

### Active Pipeline

```text
Dashboard
    ↓
Active Pipeline
    ↓
Stage Progress
    ↓
Recent Previous Pipeline Runs

Active pipeline is NOT repeated in Recent Pipeline Runs.
```

### Pipeline Completes

```text
Active Pipeline
    ↓
Pipeline Completed
    ↓
final_results_count
    ↓
View Final Results
```

### View Latest Results

```text
Dashboard
    ↓
Latest Pipeline Run
    ↓
View Final Results
    ↓
Final Results
    ↓
Latest Results
```

### View Older Results

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
    ↓
pipeline_execution_id filter applied
```

---

## 29. Finalized Decisions

The following decisions are currently finalized for the proposed Dashboard:

- Continue using the name **Dashboard** until the proposed Home rename is approved.
- Dashboard is operational rather than analytical.
- Pipeline starts from Dashboard.
- Pipeline progress appears directly on Dashboard.
- No separate Pipeline Progress screen is required.
- No separate Pipeline Runs screen is required.
- Manual Intake reminder is a modal.
- Dashboard shows Manual Input `ready_count`.
- `ready_count` means records eligible for the next pipeline run.
- Invalid Manual Inputs do not contribute to `ready_count`.
- Pipeline progress uses six marketing-friendly stages.
- No artificial percentage is required.
- `final_results_count` is scoped to one `pipeline_execution_id`.
- `final_results_count` counts rows written to `sheet_export_rows` for that execution.
- Phase 9 already limits a single run to a maximum of 10 Final Results.
- Dashboard does not apply another top-10 calculation.
- Fewer than 10 Final Results is valid and does not automatically indicate failure.
- Dashboard displays `7 Final Results`, not `7 of 10`.
- Active pipeline is shown in the main Pipeline Progress section.
- Active pipeline is not duplicated in Recent Pipeline Runs.
- Recent Pipeline Runs represents previous executions.
- Completed recent runs show `final_results_count`.
- Completed recent runs provide **View Results**.
- Latest completed results open Final Results → Latest Results.
- Older completed results open Final Results → History filtered by `pipeline_execution_id`.
- Failed runs do not currently require a View Results action.
- No technical diagnostics are shown to marketing users.
- A unified Dashboard summary endpoint is optional rather than mandatory.
- Backend remains authoritative for pipeline state and business rules.

---

## 30. Backend Implementation Checklist

- [ ] Add Manual Intake summary capability.
- [ ] Define `ready_count` using actual next-run eligibility.
- [ ] Return `invalid_count`.
- [ ] Return total relevant Manual Intake count if required.
- [ ] Add `final_results_count` to pipeline execution summaries.
- [ ] Scope `final_results_count` by `pipeline_execution_id`.
- [ ] Verify completed-run count corresponds to `sheet_export_rows`.
- [ ] Expose active stage progress.
- [ ] Use six ordered marketing-facing stage labels.
- [ ] Ensure current active execution is not duplicated in Dashboard recent-run data.
- [ ] Verify historical Final Results filtering by `pipeline_execution_id`.
- [ ] Regenerate public OpenAPI snapshot.
- [ ] Re-sync frontend API types.
- [ ] Update frontend handoff documentation.
- [ ] Decide separately whether `/api/v1/dashboard/summary` provides enough benefit to implement.
