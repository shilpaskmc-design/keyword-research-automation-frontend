import { CalendarClock } from 'lucide-react';
import { ErrorState } from '@/components/shared/ErrorState';
import { PipelineScheduleCard } from '@/features/dashboard/components/PipelineScheduleCard';
import type { PipelineSchedule } from '@/features/pipeline/api/pipelineSchedulesApi';

interface PipelineScheduleSectionProps {
  isPending: boolean;
  isError: boolean;
  schedule: PipelineSchedule | null | undefined;
  insideCutoff: boolean;
  onRetry: () => void;
}

export function PipelineScheduleSection({
  isPending,
  isError,
  schedule,
  insideCutoff,
  onRetry,
}: PipelineScheduleSectionProps) {
  if (isPending) {
    return (
      <section className="rounded-lg border bg-surface px-5 py-4" aria-busy="true">
        <p className="text-sm text-muted-foreground">Loading current pipeline schedule…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load the current schedule"
        description="The current pipeline schedule could not be loaded."
        retryLabel="Retry"
        onRetry={onRetry}
        className="min-h-0 py-6"
      />
    );
  }

  if (schedule) {
    return <PipelineScheduleCard schedule={schedule} insideCutoff={insideCutoff} />;
  }

  return (
    <section className="flex items-center gap-3 rounded-lg border bg-surface px-5 py-4">
      <CalendarClock aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No pipeline run is currently scheduled.</p>
    </section>
  );
}
