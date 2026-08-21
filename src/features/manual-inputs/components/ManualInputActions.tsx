import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { ManualInputRecord } from '@/features/manual-inputs/api/manualInputsApi';
import {
  useCancelManualInput,
  useDeleteManualInput,
} from '@/features/manual-inputs/hooks/useManualInputs';
import { getManualInputErrorMessage } from '@/features/manual-inputs/utils/getManualInputErrorMessage';

export function ManualInputActions({ record }: { record: ManualInputRecord }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const cancelMutation = useCancelManualInput();
  const deleteMutation = useDeleteManualInput();
  const actions = record.allowed_actions ?? [];
  const isPending = cancelMutation.isPending || deleteMutation.isPending;

  if (actions.length === 0) return <span className="text-sm text-muted-foreground">—</span>;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.includes('cancel') ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => setCancelOpen(true)}
          >
            Cancel Input
          </Button>
        ) : null}
        {actions.includes('delete') ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        ) : null}
      </div>
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Input"
        description="This input will not be processed in a future pipeline run."
        confirmLabel="Cancel Input"
        cancelLabel="Keep"
        isPending={cancelMutation.isPending}
        errorMessage={
          cancelMutation.error
            ? getManualInputErrorMessage(
                cancelMutation.error,
                'The action could not be completed. Please try again.'
              )
            : undefined
        }
        onConfirm={() =>
          cancelMutation.mutate(
            {
              intakeId: record.id,
              body: {
                operator_identifier: 'frontend-user',
                reason: 'Cancelled from Manual Inputs',
              },
            },
            { onSuccess: () => setCancelOpen(false) }
          )
        }
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Entry"
        description="This permanently removes this mistaken entry and cannot be undone."
        confirmLabel="Delete Permanently"
        cancelLabel="Keep Entry"
        destructive
        isPending={deleteMutation.isPending}
        errorMessage={
          deleteMutation.error
            ? getManualInputErrorMessage(
                deleteMutation.error,
                'The action could not be completed. Please try again.'
              )
            : undefined
        }
        onConfirm={() =>
          deleteMutation.mutate(record.id, { onSuccess: () => setDeleteOpen(false) })
        }
      />
    </>
  );
}
