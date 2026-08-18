import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isApiError } from '@/api/errors';
import {
  createCategory,
  createEntry,
  deleteCategory,
  deleteEntry,
  getBusinessProfile,
} from '@/features/business-profile/api/businessProfileApi';

export const businessProfileQueryKey = ['business-profile'] as const;

export function useBusinessProfile() {
  return useQuery({
    queryKey: businessProfileQueryKey,
    queryFn: ({ signal }) => getBusinessProfile({ signal }),
  });
}

function useBusinessProfileInvalidation() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: businessProfileQueryKey });
}

export function useCreateCategory() {
  const invalidate = useBusinessProfileInvalidation();

  return useMutation({
    mutationFn: (name: string) => createCategory({ name }),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useBusinessProfileInvalidation();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
    onError: (error) => {
      if (isApiError(error) && error.status === 404) void invalidate();
    },
  });
}

export function useCreateEntry() {
  const invalidate = useBusinessProfileInvalidation();

  return useMutation({
    mutationFn: ({ categoryId, value }: { categoryId: number; value: string }) =>
      createEntry(categoryId, { value }),
    onSuccess: invalidate,
    onError: (error) => {
      if (isApiError(error) && error.status === 404) void invalidate();
    },
  });
}

export function useDeleteEntry() {
  const invalidate = useBusinessProfileInvalidation();

  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: invalidate,
    onError: (error) => {
      if (isApiError(error) && error.status === 404) void invalidate();
    },
  });
}
