import { requestJson, serializeQuery, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

// Extracted to a neutral shared location because both the Dashboard and Final Results
// features need the same latest-completed execution query with the same TanStack Query
// cache key. Importing dashboard internals from Final Results would create an
// unacceptable feature-to-feature dependency.

type ListOperation = operations['list_pipeline_executions_api_v1_pipeline_runs_get'];
type ListEnvelope = ListOperation['responses'][200]['content']['application/json'];

export type PipelineExecutionSummary = NonNullable<
  operations['get_latest_pipeline_execution_api_v1_pipeline_runs_latest_get']['responses'][200]['content']['application/json']['data']
>;
export type PipelineExecutionStatus = PipelineExecutionSummary['status'];

export interface PipelineListParameters {
  page: number;
  pageSize: number;
  status?: PipelineExecutionStatus | PipelineExecutionStatus[];
  excludePipelineExecutionId?: string;
}

// Shared query key — both Dashboard and Final Results must use this exact key
// so TanStack Query serves a single cache entry for the same request.
export const latestCompletedQueryKey = ['pipeline', 'latest-completed'] as const;
export const latestResultsEligibleQueryKey = ['pipeline', 'latest-eligible'] as const;

export async function getPipelineExecutions(
  parameters: PipelineListParameters,
  options: RequestOptions = {}
) {
  const query = serializeQuery({
    page: parameters.page,
    page_size: parameters.pageSize,
    status: parameters.status,
    exclude_pipeline_execution_id: parameters.excludePipelineExecutionId,
  });

  // serializeQuery stringifies arrays nicely as repeated keys (status=a&status=b)
  return requestJson<ListEnvelope['data'], ListEnvelope['meta']>(
    `/api/v1/pipeline/runs?${query}`,
    options
  );
}
