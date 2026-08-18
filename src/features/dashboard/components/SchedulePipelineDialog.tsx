import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import type { PipelineSchedule } from '@/features/pipeline/api/pipelineSchedulesApi';
import { useCreatePipelineSchedule } from '@/features/pipeline/hooks/usePipelineSchedule';
import { getPipelineScheduleErrorMessage } from '@/features/pipeline/utils/pipelineScheduleErrors';
import {
  buildIstScheduleTimestamp,
  formatPipelineScheduleTime,
  getIstScheduleFormValues,
  isAtLeastFiveMinutesAhead,
} from '@/features/pipeline/utils/pipelineScheduleTime';

const scheduleSchema = z
  .object({
    date: z.string().min(1, 'Date is required.'),
    time: z.string().min(1, 'Time is required.'),
  })
  .superRefine((values, context) => {
    if (!values.date || !values.time) return;
    const timestamp = buildIstScheduleTimestamp(values.date, values.time);
    if (!timestamp) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'Choose a valid date and time.',
      });
    } else if (!isAtLeastFiveMinutesAhead(timestamp)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['time'],
        message: 'Schedule the pipeline at least five minutes from now.',
      });
    }
  });

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface SchedulePipelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSchedule: PipelineSchedule | null;
}

export function SchedulePipelineDialog({
  open,
  onOpenChange,
  currentSchedule,
}: SchedulePipelineDialogProps) {
  const mutation = useCreatePipelineSchedule();
  const resetMutation = mutation.reset;
  const wasOpen = useRef(false);
  const isReplacing = Boolean(currentSchedule);
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { date: '', time: '' },
  });

  useEffect(() => {
    const openedNow = open && !wasOpen.current;
    wasOpen.current = open;
    if (!openedNow) return;

    const currentValues = currentSchedule
      ? getIstScheduleFormValues(currentSchedule.scheduled_for)
      : null;
    form.reset(currentValues ?? { date: '', time: '' });
    resetMutation();
  }, [currentSchedule, form, open, resetMutation]);

  function handleSubmit(values: ScheduleFormValues) {
    const scheduledFor = buildIstScheduleTimestamp(values.date, values.time);
    if (!scheduledFor) {
      form.setError('date', { message: 'Choose a valid date and time.' });
      return;
    }

    mutation.mutate({ scheduled_for: scheduledFor }, { onSuccess: () => onOpenChange(false) });
  }

  const errorMessage = mutation.error
    ? getPipelineScheduleErrorMessage(mutation.error, 'create')
    : undefined;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !mutation.isPending && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isReplacing ? 'Change Schedule' : 'Schedule Pipeline'}</DialogTitle>
          <DialogDescription>
            Choose when the pipeline should run. Times are scheduled in Asia/Kolkata (IST).
          </DialogDescription>
        </DialogHeader>

        {currentSchedule ? (
          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            <span className="font-medium text-foreground">Current schedule</span>
            <p className="mt-1 text-muted-foreground">
              {formatPipelineScheduleTime(currentSchedule.scheduled_for)}
            </p>
          </div>
        ) : null}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pipeline-schedule-date">Date *</Label>
              <Input
                id="pipeline-schedule-date"
                type="date"
                {...form.register('date')}
                disabled={mutation.isPending}
                aria-invalid={Boolean(form.formState.errors.date)}
                aria-describedby={
                  form.formState.errors.date ? 'pipeline-schedule-date-error' : undefined
                }
              />
              {form.formState.errors.date?.message ? (
                <p
                  id="pipeline-schedule-date-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {form.formState.errors.date.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pipeline-schedule-time">Time *</Label>
              <Input
                id="pipeline-schedule-time"
                type="time"
                {...form.register('time')}
                disabled={mutation.isPending}
                aria-invalid={Boolean(form.formState.errors.time)}
                aria-describedby={
                  form.formState.errors.time ? 'pipeline-schedule-time-error' : undefined
                }
              />
              {form.formState.errors.time?.message ? (
                <p
                  id="pipeline-schedule-time-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {form.formState.errors.time.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-medium text-foreground">Timezone</p>
            <p className="text-muted-foreground">Asia/Kolkata (IST)</p>
            <p className="text-muted-foreground">
              Run must be scheduled at least five minutes in advance.
            </p>
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
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : null}
              {mutation.isPending
                ? isReplacing
                  ? 'Updating…'
                  : 'Scheduling…'
                : isReplacing
                  ? 'Update Schedule'
                  : 'Schedule Pipeline'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
