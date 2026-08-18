import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/api/errors';

const MAX_QUERY_RETRIES = 2;

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= MAX_QUERY_RETRIES || !isApiError(error)) {
    return false;
  }

  if (error.kind === 'network') {
    return true;
  }

  return error.kind === 'api' && error.status !== undefined && error.status >= 500;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: false,
    },
  },
});
