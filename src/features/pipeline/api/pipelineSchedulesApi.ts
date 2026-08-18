import { requestJson, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

type CreateScheduleOperation =
  operations['create_pipeline_schedule_api_v1_pipeline_schedules_post'];
type CurrentScheduleOperation =
  operations['get_current_pipeline_schedule_api_v1_pipeline_schedules_current_get'];
type CancelScheduleOperation =
  operations['cancel_pipeline_schedule_api_v1_pipeline_schedules__schedule_id__delete'];

type CreateScheduleBody = CreateScheduleOperation['requestBody']['content']['application/json'];
type CreateScheduleEnvelope =
  CreateScheduleOperation['responses'][201]['content']['application/json'];
type CurrentScheduleEnvelope =
  CurrentScheduleOperation['responses'][200]['content']['application/json'];
type CancelScheduleEnvelope =
  CancelScheduleOperation['responses'][200]['content']['application/json'];

export type PipelineSchedule = CreateScheduleEnvelope['data'];
export type CreatePipelineScheduleInput = CreateScheduleBody;

export async function getCurrentPipelineSchedule(options: RequestOptions = {}) {
  const result = await requestJson<
    CurrentScheduleEnvelope['data'],
    CurrentScheduleEnvelope['meta']
  >('/api/v1/pipeline/schedules/current', options);
  return result.data;
}

export async function createPipelineSchedule(
  input: CreatePipelineScheduleInput,
  options: RequestOptions = {}
) {
  const result = await requestJson<
    CreateScheduleEnvelope['data'],
    CreateScheduleEnvelope['meta'],
    CreateScheduleBody
  >('/api/v1/pipeline/schedules', { ...options, method: 'POST', body: input });
  return result.data;
}

export async function cancelPipelineSchedule(scheduleId: string, options: RequestOptions = {}) {
  const result = await requestJson<CancelScheduleEnvelope['data'], CancelScheduleEnvelope['meta']>(
    `/api/v1/pipeline/schedules/${scheduleId}`,
    { ...options, method: 'DELETE' }
  );
  return result.data;
}
