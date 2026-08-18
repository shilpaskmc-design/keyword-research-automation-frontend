import { isApiError } from '@/api/errors';

export function getManualInputErrorMessage(error: unknown, fallback: string) {
  if (!isApiError(error)) return fallback;
  if (error.status === 415) return 'Choose an XLSX workbook and try again.';
  if (error.status === 422) return 'Check the provided information and try again.';
  if (error.kind === 'network') return 'The server could not be reached. Please try again.';
  return fallback;
}
