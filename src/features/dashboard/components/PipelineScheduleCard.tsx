import { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CancelScheduleDialog } from '@/features/dashboard/components/CancelScheduleDialog';
import type { PipelineSchedule } from '@/features/pipeline/api/pipelineSchedulesApi';
import { formatPipelineScheduleTime } from '@/features/pipeline/utils/pipelineScheduleTime';

interface PipelineScheduleCardProps {
  schedule: PipelineSchedule;
  insideCutoff: boolean;
}

export function PipelineScheduleCard({ schedule, insideCutoff }: PipelineScheduleCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <section className="rounded-lg border bg-surface p-5" aria-labelledby="pipeline-schedule-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <CalendarClock aria-hidden="true" className="h-5 w-5 text-primary" />
            <h2 id="pipeline-schedule-title" className="text-card-title text-foreground">
              Scheduled Pipeline Run
            </h2>
          </div>
          <p className="font-medium text-foreground">
            {formatPipelineScheduleTime(schedule.scheduled_for)}
          </p>
          <p className="text-sm text-muted-foreground">Status: Scheduled</p>
          <p className="text-sm text-muted-foreground">
            The pipeline will start automatically at the scheduled time.
          </p>
          {insideCutoff ? (
            <p className="text-sm font-medium text-foreground">
              This schedule can no longer be changed because it is about to start.
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={insideCutoff}
          onClick={() => setCancelOpen(true)}
        >
          Cancel Schedule
        </Button>
      </div>
      <CancelScheduleDialog open={cancelOpen} onOpenChange={setCancelOpen} schedule={schedule} />
    </section>
  );
}
