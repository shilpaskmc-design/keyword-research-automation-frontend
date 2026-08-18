import { isApiError } from '@/api/errors';

export function getPipelineScheduleErrorMessage(error: unknown, action: 'create' | 'cancel') {
  if (isApiError(error)) {
    if (error.code === 'SCHEDULE_NOT_FOUND') {
      return 'This schedule no longer exists.';
    }
    if (error.code === 'SCHEDULE_CANCELLATION_CUTOFF') {
      return 'This schedule can no longer be changed because it is less than one minute away.';
    }
    if (error.code === 'SCHEDULE_NOT_CANCELLABLE') {
      return 'This schedule can no longer be cancelled.';
    }
    if (error.status === 422 || error.code === 'VALIDATION_ERROR') {
      return 'Choose a valid time at least five minutes from now.';
    }
    if (error.kind === 'network') {
      return 'The server could not be reached. Check your connection and try again.';
    }
  }

  return action === 'create'
    ? 'The pipeline schedule could not be saved.'
    : 'The pipeline schedule could not be cancelled.';
}
