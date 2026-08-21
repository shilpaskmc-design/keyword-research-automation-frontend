import { isApiError } from '@/api/errors';

export function getManualInputErrorMessage(error: unknown, fallback: string) {
  if (!isApiError(error)) return fallback;
  if (error.code === 'MANUAL_INTAKE_NOT_DELETABLE') {
    return 'This input can no longer be deleted because it has entered pipeline processing.';
  }
  if (error.code === 'MANUAL_INTAKE_NOT_CANCELLABLE') {
    return 'This input can no longer be cancelled.';
  }
  if (error.status === 404) return 'This input no longer exists.';
  if (error.status === 409) return 'This input can no longer be cancelled.';
  if (error.status === 415) return 'Choose an XLSX workbook and try again.';
  if (error.status === 422) return 'Check the provided information and try again.';
  if (error.kind === 'network') return 'The server could not be reached. Please try again.';
  return fallback;
}
