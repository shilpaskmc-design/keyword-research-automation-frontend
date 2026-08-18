import { isApiError } from '@/api/errors';

export function getBusinessProfileErrorMessage(error: unknown, fallback: string): string {
  if (!isApiError(error)) return fallback;

  if (error.status === 404) {
    return 'This item no longer exists. The Business Profile is being refreshed.';
  }

  if (error.status === 409 && error.code === 'DUPLICATE_RESOURCE') {
    return 'A category with this name already exists.';
  }

  if (error.status === 422 && error.code === 'VALIDATION_ERROR') {
    return 'Check the entered value and try again.';
  }

  if (error.kind === 'network') {
    return 'The server could not be reached. Please try again.';
  }

  return fallback;
}
