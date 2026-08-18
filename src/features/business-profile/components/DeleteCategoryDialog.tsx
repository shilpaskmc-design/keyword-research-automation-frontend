import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useDeleteCategory } from '@/features/business-profile/hooks/useBusinessProfile';
import { getBusinessProfileErrorMessage } from '@/features/business-profile/utils/getBusinessProfileErrorMessage';

interface DeleteCategoryDialogProps {
  categoryId: number;
  categoryName: string;
  entryCount: number;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  entryCount,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteCategory();
  const errorMessage = mutation.error
    ? getBusinessProfileErrorMessage(mutation.error, 'The category could not be deleted.')
    : undefined;

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) mutation.reset();
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-destructive hover:text-destructive"
        aria-label={`Delete category: ${categoryName}`}
      >
        <Trash2 aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Delete Category?"
        description={`Delete “${categoryName}” permanently? This will also delete ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} inside it. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          mutation.mutate(categoryId, {
            onSuccess: () => setOpen(false),
          });
        }}
        isPending={mutation.isPending}
        destructive
        errorMessage={errorMessage}
      />
    </>
  );
}
