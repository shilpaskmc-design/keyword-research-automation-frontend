import type { components } from '@/api/generated/schema';

export type ManualInputStatus = components['schemas']['ManualIntakeHistoryResponse']['status'];

export interface AdditionalDetailRow {
  key: string;
  value: string;
}

export interface ManualInputFormValues {
  inputText: string;
  gist: string;
  additionalDetails: AdditionalDetailRow[];
}

export const manualInputStatusOptions: Array<{ value: ManualInputStatus; label: string }> = [
  { value: 'pending', label: 'Ready for Next Run' },
  { value: 'promoted', label: 'Used in Previous Run' },
  { value: 'invalid', label: 'Invalid' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const manualInputSourceOptions = [
  { value: 'manual_entry', label: 'Manual Entry' },
  { value: 'manual_excel', label: 'Excel Upload' },
] as const;

export function mapManualInputForm(values: ManualInputFormValues) {
  const rawText = values.inputText.trim();
  const gist = values.gist.trim();
  const detailEntries = values.additionalDetails
    .map((detail) => [detail.key.trim(), detail.value.trim()] as const)
    .filter(([key, value]) => key && value);

  return {
    raw_text: rawText,
    ...(gist ? { gist } : {}),
    ...(detailEntries.length ? { extra_data: Object.fromEntries(detailEntries) } : {}),
  };
}

export function formatAdditionalDetailValue(value: unknown): string {
  if (value === null) return 'Not provided';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return 'Structured value';
}
