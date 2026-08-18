import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddManualInputForm } from '@/features/manual-inputs/components/AddManualInputForm';

interface AddManualInputDialogProps {
  /** When true the dialog opens immediately on mount (e.g. from ?add=1 URL param). */
  defaultOpen?: boolean;
}

export function AddManualInputDialog({ defaultOpen = false }: AddManualInputDialogProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus aria-hidden="true" />
        Add Manual Input
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Manual Input</DialogTitle>
            <DialogDescription>
              Add information to be considered during the next keyword research run.
            </DialogDescription>
          </DialogHeader>
          <AddManualInputForm onCancel={() => setOpen(false)} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
