import { requestFile, requestJson, serializeQuery, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

// ─── Operation & Envelope Types ─────────────────────────────────────────────

type ListOperation = operations['list_final_results_api_v1_final_results_get'];
type ListEnvelope = ListOperation['responses'][200]['content']['application/json'];

type PatchOperation =
  operations['update_publish_status_api_v1_sheet_export_rows__row_id__status_patch'];
type PatchEnvelope = PatchOperation['responses'][200]['content']['application/json'];

// ─── Exported Types ──────────────────────────────────────────────────────────

export type FinalResultListItem = NonNullable<ListEnvelope['data']>[number];
export type FinalResultsMeta = ListEnvelope['meta'];

/** Publish status values exactly as the backend defines them. */
export type PublishStatus = NonNullable<FinalResultListItem['publish_status']>;

/** Urgency values sent to the backend (lowercase). */
export type UrgencyValue = 'high' | 'medium' | 'low';

// ─── Query Parameters ────────────────────────────────────────────────────────

export interface FinalResultsListParams {
  page?: number;
  pageSize?: number;
  pipelineExecutionId?: string;
  excludePipelineExecutionId?: string;
  search?: string;
  urgency?: UrgencyValue;
  publishStatus?: PublishStatus[];
}

export interface FinalResultsExportParams {
  pipelineExecutionId?: string;
  excludePipelineExecutionId?: string;
  search?: string;
  urgency?: UrgencyValue;
  publishStatus?: PublishStatus[];
}

export interface UpdatePublishStatusParams {
  rowId: number;
  status: PublishStatus;
}

// ─── Serialisation ───────────────────────────────────────────────────────────

/**
 * The backend `publish_status` parameter is an array type.
 * `URLSearchParams.set` would overwrite duplicates, so we use `.append` to
 * produce repeated query params:  publish_status=Pending&publish_status=Approved
 *
 * This is the only correct representation — do not use comma-separated values.
 */
function appendMultiParam(params: URLSearchParams, key: string, values: string[]): void {
  for (const value of values) {
    params.append(key, value);
  }
}

function buildFinalResultsQuery(
  p: Omit<FinalResultsListParams, 'publishStatus'> & { publishStatus?: PublishStatus[] }
): string {
  const params = new URLSearchParams(
    serializeQuery({
      page: p.page,
      page_size: p.pageSize,
      pipeline_execution_id: p.pipelineExecutionId,
      exclude_pipeline_execution_id: p.excludePipelineExecutionId,
      search: p.search ?? undefined,
      urgency: p.urgency,
    })
  );

  if (p.publishStatus && p.publishStatus.length > 0) {
    appendMultiParam(params, 'publish_status', p.publishStatus);
  }

  return params.toString();
}

function buildExportQuery(p: FinalResultsExportParams): string {
  // Export must NOT include page or page_size — the backend exports all matching rows.
  const params = new URLSearchParams(
    serializeQuery({
      pipeline_execution_id: p.pipelineExecutionId,
      exclude_pipeline_execution_id: p.excludePipelineExecutionId,
      search: p.search ?? undefined,
      urgency: p.urgency,
    })
  );

  if (p.publishStatus && p.publishStatus.length > 0) {
    appendMultiParam(params, 'publish_status', p.publishStatus);
  }

  return params.toString();
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function listFinalResults(
  params: FinalResultsListParams,
  options: RequestOptions = {}
) {
  const query = buildFinalResultsQuery(params);
  return requestJson<ListEnvelope['data'], ListEnvelope['meta']>(
    `/api/v1/final-results?${query}`,
    options
  );
}

/**
 * Export all matching rows to CSV.
 * Uses requestFile because the response is text/csv, not JSON.
 * Must not send page or page_size — the backend exports all matching rows.
 *
 * On HTTP 413 the backend returns application/json with
 * code = "FINAL_RESULT_EXPORT_LIMIT_EXCEEDED" — the caller handles this.
 */
export async function exportFinalResultsCsv(
  params: FinalResultsExportParams,
  options: RequestOptions = {}
) {
  const query = buildExportQuery(params);
  return requestFile(`/api/v1/final-results/export.csv?${query}`, options);
}

export async function updatePublishStatus(
  { rowId, status }: UpdatePublishStatusParams,
  options: RequestOptions = {}
) {
  type Body = PatchOperation['requestBody']['content']['application/json'];
  const body: Body = { publish_status: status };
  return requestJson<PatchEnvelope['data'], PatchEnvelope['meta'], Body>(
    `/api/v1/sheet-export-rows/${rowId}/status`,
    { method: 'PATCH', body, ...options }
  );
}
