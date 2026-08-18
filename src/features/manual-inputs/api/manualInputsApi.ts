import { requestBinaryJson, requestJson, serializeQuery, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

type ListOperation = operations['get_manual_intake_history_api_v1_raw_data_manual_intake_get'];
type SummaryOperation =
  operations['get_manual_intake_summary_api_v1_raw_data_manual_intake_summary_get'];
type CreateOperation = operations['create_manual_entry_api_v1_raw_data_manual_entry_post'];
type UploadOperation = operations['upload_excel_api_v1_raw_data_upload_excel_post'];

type ListEnvelope = ListOperation['responses'][200]['content']['application/json'];
type SummaryEnvelope = SummaryOperation['responses'][200]['content']['application/json'];
type CreateBody = CreateOperation['requestBody']['content']['application/json'];
type CreateEnvelope = CreateOperation['responses'][201]['content']['application/json'];
type UploadEnvelope = UploadOperation['responses'][201]['content']['application/json'];

export type ManualInputRecord = ListEnvelope['data'][number];
export type ManualInputSummary = SummaryEnvelope['data'];
export type ExcelUploadResult = UploadEnvelope['data'];

export interface ManualInputListParameters {
  keyword?: string;
  status?: string;
  source?: string;
  page: number;
  pageSize: number;
}

export async function getManualInputs(
  parameters: ManualInputListParameters,
  options: RequestOptions = {}
) {
  const query = serializeQuery({
    keyword: parameters.keyword,
    status: parameters.status,
    source: parameters.source,
    page: parameters.page,
    page_size: parameters.pageSize,
  });
  const result = await requestJson<ListEnvelope['data'], ListEnvelope['meta']>(
    `/api/v1/raw-data/manual-intake?${query}`,
    options
  );

  return result;
}

export async function getManualInputSummary(options: RequestOptions = {}) {
  const result = await requestJson<SummaryEnvelope['data'], SummaryEnvelope['meta']>(
    '/api/v1/raw-data/manual-intake/summary',
    options
  );

  return result.data;
}

export async function createManualInput(body: CreateBody) {
  const result = await requestJson<CreateEnvelope['data'], CreateEnvelope['meta'], CreateBody>(
    '/api/v1/raw-data/manual-entry',
    { method: 'POST', body }
  );

  return result.data;
}

export async function uploadManualInputs(file: File) {
  const isCsv = file.name.toLowerCase().endsWith('.csv');
  const contentType = isCsv
    ? 'text/csv'
    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  const result = await requestBinaryJson<UploadEnvelope['data'], UploadEnvelope['meta']>(
    '/api/v1/raw-data/upload-excel',
    {
      method: 'POST',
      body: file,
      contentType,
      headers: { 'X-Upload-Filename': file.name },
    }
  );

  return result.data;
}
