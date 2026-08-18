# Implementation Plan — Phase 8: Dashboard

> [!info] Document Status
> **Status:** Implemented; non-destructive verification complete
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Implement the operational Dashboard workflow for starting, monitoring, and reviewing pipeline executions.

# 1. Goal

```text
Manual Input Summary → Start Reminder → POST 202 Queued → Execution Detail Polling
                     → Backend Dashboard Progress → Terminal Refresh
                     → Latest Completed / Recent Runs → Final Results Navigation
```

Milestone: `Pipeline lifecycle works from the frontend`.

# 2. Approved API Scope

```http
POST /api/v1/pipeline/runs
GET  /api/v1/pipeline/runs/latest
GET  /api/v1/pipeline/runs?status=completed&page=1&page_size=1
GET  /api/v1/pipeline/runs?page=1&page_size=5
     [&exclude_pipeline_execution_id=<active-id>]
GET  /api/v1/pipeline/runs/{pipeline_execution_id}
GET  /api/v1/raw-data/manual-intake/summary
```

Reuse the existing `useManualInputSummary()` hook and `['manual-input-summary']` cache from Manual Inputs. Do not create a Dashboard-specific summary request or cache.

Do not add aggregation, diagnostics, resume, abandonment, or other endpoints.

# 3. Distinct Execution Concerns

The Dashboard must keep these separate:

```text
Latest execution
→ GET /pipeline/runs/latest
→ determines whether an active queued/running execution exists

Latest completed execution
→ GET /pipeline/runs?status=completed&page=1&page_size=1
→ supplies Latest Completed Run

Recent executions
→ GET /pipeline/runs?page=1&page_size=5
→ backend ordered
→ excludes the active ID through exclude_pipeline_execution_id

Started execution
→ pipeline_execution_id returned directly by POST 202
→ immediately becomes the active detail-query identity
```

Never derive latest completed from the five recent rows and never rediscover a newly queued execution through `/latest`.

# 4. Feature Structure and Scope

Implement Dashboard-owned API functions, orchestration hooks, presentation utilities, and these components under `src/features/dashboard/`:

```text
ManualInputSummary
StartPipelineButton
ManualInputReminderDialog
PipelineStatusCard
PipelineStageProgress
PipelineStageItem
LatestPipelineRunCard
RecentPipelineRunsTable
```

Out of scope: Final Results implementation, diagnostics, failure internals, artificial percentages, separate progress/runs screens, resume/abandonment, authentication, dependencies, and backend changes.

# 5. Start Flow

Start Pipeline opens a reminder containing the backend ready count, Continue, View Manual Inputs, and Cancel. The frontend does not independently decide whether starting is allowed.

On Continue, disable repeated submission and call `POST /pipeline/runs`.

```text
202
→ accepted/queued, not completed
→ immediately retain returned pipeline_execution_id and queued status
→ enable the detail query for that exact ID
→ refresh latest/recent in the background

409
→ show safe conflict feedback
→ refetch latest execution to reconcile the active run
```

Do not parse arbitrary backend message text.

# 6. Active Detail and Polling

Query:

```http
GET /pipeline/runs/{active-id}
```

Use TanStack Query `refetchInterval`:

```text
queued / running                         → 5000 ms
completed / partial / failed / abandoned → false
```

No custom polling timer. Keep confirmed detail visible during background requests.

When one active execution transitions to a terminal status, invalidate exactly once:

```text
latest execution
latest completed execution
recent executions
existing manual-input-summary
```

Then retire that ID from the active slot. A small effect may detect the transition; it must not implement polling.

# 7. Dashboard Progress Contract

Render only:

```text
detail.dashboard_progress.current_stage
detail.dashboard_progress.stages
```

Do not render raw `PipelineExecutionDetail.stages`, retry lineage, interruption, supersession, diagnostics, failure codes, or failure messages.

Dashboard stage statuses are:

```text
pending
running
completed
partial
failed
```

Sort a copied stage array by backend `order` and render backend `display_name`. Expected names currently are:

```text
Collecting Data
Filtering Relevance & Generating Keywords
Grouping Similar Keywords
Extracting SEO Data
Evaluating & Filtering Keywords
Preparing Final Results
```

Do not display technical keys, replace names with frontend mappings, or invent percentages.

# 8. Latest and Recent Runs

When latest-execution loading succeeds with no active queued/running run, show the newest item from the dedicated completed query. Recent Runs contains exactly the five backend-returned recent summaries and excludes the active execution through the API query parameter.

Display user-safe date, execution status, Final Results count, and eligible action. Failed, partial, and abandoned rows may be shown but never expose diagnostics.

# 9. Result Eligibility and Navigation

```typescript
const canViewResults =
  run.status === 'completed' &&
  typeof run.final_results_count === 'number' &&
  run.final_results_count > 0
```

Exact links:

```text
Latest completed:
/final-results?tab=latest

Specific historical execution:
/final-results?tab=history&run=<pipeline_execution_id>
```

Completed zero-result and partial/failed/abandoned runs do not receive a results action.

# 10. Independent States

Summary, latest execution, active detail, latest completed, and recent runs use independent loading/error/retry states. One failed section must not replace usable Dashboard sections. Do not show Latest Completed until `/latest` has confirmed there is no active run.

# 11. Accessibility, Responsive, and Verification

Verify reminder focus, text status, backend stage names/statuses, disabled duplicate start, keyboard actions, contained recent-table overflow, visible focus, and no page-level overflow at 375, 768, 1024, and 1440 pixels.

Run typecheck, lint, format check, production build, and `npm audit`. Verify read-only real-backend Dashboard loading, ready count, latest/completed/recent separation, active exclusion where available, exact links, reminder behavior, no technical diagnostics, no artificial percentage, responsive behavior, and console state. Do not start a real pipeline merely for routine verification.

# 12. Guardrails and Completion

No backend files, duplicate summary cache, raw detailed stages, frontend stage-name mapping, fake percentage, diagnostics, extra screens, raw fetch, optimistic completion, unsupported result action, dependency, or unrelated change. Preserve existing worktree changes and do not commit/push without authorization.

Phase 8 is complete when all approved operations use generated types and the Shared API Client; the three execution concerns remain separate; `202` immediately activates its returned ID; active detail polls at five seconds and stops terminally; terminal invalidation occurs once; backend Dashboard progress is rendered; latest completed/recent/result links follow exact rules; independent states and responsive/accessibility checks pass; and all static/build/audit checks pass.
