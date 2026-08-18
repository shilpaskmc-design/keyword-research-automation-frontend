import { requestJson, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';
import {
  getPipelineExecutions,
  type PipelineListParameters,
  type PipelineExecutionSummary,
  type PipelineExecutionStatus,
} from '@/features/pipeline/api/pipelineExecutionsApi';

// Re-export shared types so Dashboard consumers keep working without changes.
export type { PipelineListParameters, PipelineExecutionSummary, PipelineExecutionStatus };
export { getPipelineExecutions };

type StartOperation = operations['start_pipeline_execution_api_v1_pipeline_runs_post'];
type LatestOperation = operations['get_latest_pipeline_execution_api_v1_pipeline_runs_latest_get'];
type DetailOperation =
  operations['get_pipeline_execution_api_v1_pipeline_runs__pipeline_execution_id__get'];

type StartEnvelope = StartOperation['responses'][202]['content']['application/json'];
type LatestEnvelope = LatestOperation['responses'][200]['content']['application/json'];
type DetailEnvelope = DetailOperation['responses'][200]['content']['application/json'];

export type PipelineExecutionDetail = DetailEnvelope['data'];

export async function startPipeline() {
  const result = await requestJson<StartEnvelope['data'], StartEnvelope['meta']>(
    '/api/v1/pipeline/runs',
    { method: 'POST' }
  );
  return result.data;
}

export async function getLatestExecution(options: RequestOptions = {}) {
  const result = await requestJson<LatestEnvelope['data'], LatestEnvelope['meta']>(
    '/api/v1/pipeline/runs/latest',
    options
  );
  return result.data;
}

export async function getExecutionDetail(
  pipelineExecutionId: string,
  options: RequestOptions = {}
) {
  const result = await requestJson<DetailEnvelope['data'], DetailEnvelope['meta']>(
    `/api/v1/pipeline/runs/${pipelineExecutionId}`,
    options
  );
  return result.data;
}
