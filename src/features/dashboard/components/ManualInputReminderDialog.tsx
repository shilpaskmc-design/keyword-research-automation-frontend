import { FileText, LoaderCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isApiError } from '@/api/errors';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ManualInputReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readyCount?: number;
  isPending: boolean;
  error: unknown;
  onContinue: () => void;
}

export function ManualInputReminderDialog({
  open,
  onOpenChange,
  readyCount,
  isPending,
  error,
  onContinue,
}: ManualInputReminderDialogProps) {
  const errorMessage = error
    ? isApiError(error) && error.status === 409
      ? 'A pipeline is already active. Dashboard state is being refreshed.'
      : 'The pipeline could not be started. Please try again.'
    : undefined;

  const readyLabel =
    readyCount === undefined
      ? 'Ready-input count unavailable'
      : `${readyCount} ${readyCount === 1 ? 'entry' : 'entries'} ready for the next run`;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isPending && onOpenChange(nextOpen)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Before Starting Pipeline</DialogTitle>
          <DialogDescription>
            The backend will determine whether a new run can start.
          </DialogDescription>
        </DialogHeader>

        {/* Manual Inputs summary block */}
        <div className="rounded-md border bg-surface-muted/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Manual Inputs
          </p>
          <p className="mt-1 font-medium text-foreground">{readyLabel}</p>
        </div>

        {/* Review prompt + inline navigation actions */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Do you want to review or add more inputs before starting the pipeline?
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="ghost" size="sm" asChild>
              <Link to="/manual-inputs">
                <FileText aria-hidden="true" />
                View Inputs
              </Link>
            </Button>
            <Button type="button" variant="ghost" size="sm" asChild>
              <Link to="/manual-inputs?add=1">
                <PlusCircle aria-hidden="true" />
                Add Input
              </Link>
            </Button>
          </div>
        </div>

        {errorMessage ? (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onContinue} disabled={isPending}>
            {isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            {isPending ? 'Starting…' : 'Continue & Run Pipeline'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
