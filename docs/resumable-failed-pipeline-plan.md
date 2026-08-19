# Minimal Plan — Resume Button for Resumable Failed Pipeline Runs

> **Scope:** Frontend only  
> **Location:** Existing Dashboard → Recent Pipeline Runs table  
> **Goal:** Show a minimal **Resume** action only when the backend explicitly
> allows resuming a failed pipeline run.

## Contract and eligibility

Use `PipelineExecutionSummary.allowed_actions` from the generated OpenAPI types.
Render Resume only when:

```ts
run.status === 'failed' && run.allowed_actions.includes('resume');
```

Do not introduce a `resumable` field or infer eligibility from
`recovery_state`. Call the existing
`POST /api/v1/pipeline/runs/{pipeline_execution_id}/resume` endpoint through the
shared authenticated API client and type its `202` response from the generated
operation.

## State and mutation behavior

Keep the resume mutation in `useDashboard()` beside the existing start
mutation. On success:

1. read the returned `pipeline_execution_id`;
2. clear stale terminal detail for that same execution ID;
3. reset the existing terminal-handling marker for that ID;
4. immediately activate it through the existing started-execution state;
5. invalidate `['pipeline', 'latest']` and the `['pipeline', 'recent']` prefix;
6. let the existing active-detail polling and progress UI take over.

Do not create another execution-state owner or Resume-specific progress UI.

## Submission guards

- Disable all Resume actions while `dashboard.activeExecutionId` exists.
- Disable Resume while Start Pipeline submission is pending.
- Disable Start Pipeline while a Resume submission is pending.
- Track the mutation variable so only the selected row displays `Resuming…`.
- Disable every other Resume action while one Resume request is pending.

These are submission guards, not frontend resumability rules. The backend
remains authoritative.

## Errors

Show an accessible error near Recent Pipeline Runs:

- `PIPELINE_ALREADY_ACTIVE` → “Another pipeline run is already active.”
- `PIPELINE_NOT_RESUMABLE` → “This pipeline run can no longer be resumed.”
- `404` → “This pipeline run is no longer available.”
- fallback → “The pipeline run could not be resumed. Please try again.”

Never display backend detail or raw payloads. For `404` and `409`, invalidate
latest and recent execution state so refreshed `allowed_actions` controls the
UI.

## UI and scope

Use the existing Action cell. Preserve the existing View Results behavior for
other rows and show an em dash when no action applies. Do not add a column,
modal, page, confirmation workflow, backend endpoint, automatic retry, or
scheduler behavior.

## Verification

Verify eligible, ineligible, non-failed, active-execution, successful resume,
stale `404`/`409`, duplicate-click, and Start/Resume cross-submission states.
Run the configured typecheck, lint, format check, production build, and
`git diff --check`. Regenerate API types only if repository inspection shows
that they are outdated.
