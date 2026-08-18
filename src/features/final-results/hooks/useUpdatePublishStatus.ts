import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updatePublishStatus,
  type PublishStatus,
} from '@/features/final-results/api/finalResultsApi';
import { finalResultsKeys } from '@/features/final-results/hooks/useFinalResults';

/**
 * Manages Publish Status mutations for Final Results rows.
 *
 * Rules enforced:
 * - No optimistic update — confirmed value shown until backend responds.
 * - While in-flight: that rowId is added to pendingRowIds (disables the select).
 * - On success: invalidates all three query scopes (latest, open-items, history)
 *   because a single row can appear in multiple sections.
 * - On error: row is removed from pendingRowIds; caller should show safe inline error.
 */
export function useUpdatePublishStatus() {
  const queryClient = useQueryClient();
  // Track which row IDs have an in-flight mutation.
  const [pendingRowIds, setPendingRowIds] = useState<Set<number>>(new Set());
  const [rowErrors, setRowErrors] = useState<Map<number, string>>(new Map());

  const mutation = useMutation({
    mutationFn: ({ rowId, status }: { rowId: number; status: PublishStatus }) =>
      updatePublishStatus({ rowId, status }),

    onMutate: ({ rowId }) => {
      setPendingRowIds((prev) => {
        const next = new Set(prev);
        next.add(rowId);
        return next;
      });
      // Clear any previous error for this row on new attempt.
      setRowErrors((prev) => {
        const next = new Map(prev);
        next.delete(rowId);
        return next;
      });
    },

    onSuccess: (_data, { rowId }) => {
      setPendingRowIds((prev) => {
        const next = new Set(prev);
        next.delete(rowId);
        return next;
      });
      // Invalidate all three scopes — a row can appear in Latest, Open Items, and History.
      void queryClient.invalidateQueries({ queryKey: finalResultsKeys.all });
    },

    onError: (_error, { rowId }) => {
      setPendingRowIds((prev) => {
        const next = new Set(prev);
        next.delete(rowId);
        return next;
      });
      setRowErrors((prev) => {
        const next = new Map(prev);
        next.set(rowId, 'Status update failed. Please try again.');
        return next;
      });
    },
  });

  function updateStatus(rowId: number, status: PublishStatus) {
    // Prevent duplicate mutations for the same row.
    if (pendingRowIds.has(rowId)) return;
    mutation.mutate({ rowId, status });
  }

  return {
    updateStatus,
    pendingRowIds: pendingRowIds as ReadonlySet<number>,
    rowErrors: rowErrors as ReadonlyMap<number, string>,
  };
}
