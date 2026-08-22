import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { ManualInputRecord } from '@/features/manual-inputs/api/manualInputsApi';
import { useDeleteManualInput } from '@/features/manual-inputs/hooks/useManualInputs';
import { getManualInputErrorMessage } from '@/features/manual-inputs/utils/getManualInputErrorMessage';

export function ManualInputActions({ record }: { record: ManualInputRecord }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteManualInput();
  const actions = record.allowed_actions ?? [];
  const isPending = deleteMutation.isPending;

  if (actions.length === 0) return <span className="text-sm text-muted-foreground">—</span>;

  return (
    <>
      <div className="flex flex-wrap gap-2">
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
