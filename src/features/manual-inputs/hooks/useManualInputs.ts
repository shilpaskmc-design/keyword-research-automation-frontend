import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createManualInput,
  getManualInputs,
  getManualInputSummary,
  uploadManualInputs,
  type ManualInputListParameters,
} from '@/features/manual-inputs/api/manualInputsApi';

export const manualInputSummaryQueryKey = ['manual-input-summary'] as const;

export function manualInputsQueryKey(parameters: ManualInputListParameters) {
  return ['manual-inputs', parameters] as const;
}

export function useManualInputs(parameters: ManualInputListParameters) {
  return useQuery({
    queryKey: manualInputsQueryKey(parameters),
    queryFn: ({ signal }) => getManualInputs(parameters, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useManualInputSummary() {
  return useQuery({
    queryKey: manualInputSummaryQueryKey,
    queryFn: ({ signal }) => getManualInputSummary({ signal }),
  });
}

function useManualInputInvalidation() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['manual-inputs'] }),
      queryClient.invalidateQueries({ queryKey: manualInputSummaryQueryKey }),
    ]);
}

export function useCreateManualInput() {
  const invalidate = useManualInputInvalidation();

  return useMutation({ mutationFn: createManualInput, onSuccess: invalidate });
}

export function useUploadManualInputs() {
  const invalidate = useManualInputInvalidation();

  return useMutation({ mutationFn: uploadManualInputs, onSuccess: invalidate });
}
