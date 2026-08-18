import { useId, useState, type FormEvent } from 'react';
import { LoaderCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCategory } from '@/features/business-profile/hooks/useBusinessProfile';
import { getBusinessProfileErrorMessage } from '@/features/business-profile/utils/getBusinessProfileErrorMessage';

export function AddCategoryDialog() {
  const inputId = useId();
  const errorId = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string>();
  const mutation = useCreateCategory();
  const errorMessage = mutation.error
    ? getBusinessProfileErrorMessage(mutation.error, 'The category could not be added.')
    : validationError;

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending) return;
    setOpen(nextOpen);

    if (!nextOpen) {
      setName('');
      setValidationError(undefined);
      mutation.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError('Category name is required.');
      return;
    }

    setValidationError(undefined);
    mutation.mutate(trimmedName, {
      onSuccess: () => {
        setName('');
        setOpen(false);
      },
    });
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus aria-hidden="true" />
        Add Category
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Create a category for grouping related business information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor={inputId}>Category Name</Label>
              <Input
                id={inputId}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setValidationError(undefined);
                  if (mutation.error) mutation.reset();
                }}
                disabled={mutation.isPending}
                autoFocus
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : undefined}
              />
              {errorMessage ? (
                <p id={errorId} role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : null}
                {mutation.isPending ? 'Adding…' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
