import { useEffect } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { PipelineSchedule } from '@/features/pipeline/api/pipelineSchedulesApi';
import { useCancelPipelineSchedule } from '@/features/pipeline/hooks/usePipelineSchedule';
import { getPipelineScheduleErrorMessage } from '@/features/pipeline/utils/pipelineScheduleErrors';

interface CancelScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: PipelineSchedule;
}

export function CancelScheduleDialog({ open, onOpenChange, schedule }: CancelScheduleDialogProps) {
  const mutation = useCancelPipelineSchedule();
  const resetMutation = mutation.reset;

  useEffect(() => {
    if (open) resetMutation();
  }, [open, resetMutation]);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(nextOpen) => !mutation.isPending && onOpenChange(nextOpen)}
      title="Cancel Schedule"
      description="Are you sure you want to cancel this scheduled pipeline run?"
      confirmLabel="Yes, Cancel"
      cancelLabel="No"
      destructive
      isPending={mutation.isPending}
      errorMessage={
        mutation.error ? getPipelineScheduleErrorMessage(mutation.error, 'cancel') : undefined
      }
      onConfirm={() => mutation.mutate(schedule.id, { onSuccess: () => onOpenChange(false) })}
    />
  );
}
