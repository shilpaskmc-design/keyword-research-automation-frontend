import { ErrorState } from '@/components/shared/ErrorState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type {
  PipelineExecutionDetail,
  PipelineExecutionStatus,
} from '@/features/dashboard/api/dashboardApi';
import { PipelineStageProgress } from '@/features/dashboard/components/PipelineStageProgress';
import {
  getExecutionStatusPresentation,
  formatRunDate,
} from '@/features/dashboard/utils/dashboardPresentation';

interface PipelineStatusCardProps {
  status: PipelineExecutionStatus;
  requestedAt: string;
  detail?: PipelineExecutionDetail;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function PipelineStatusCard({
  status,
  requestedAt,
  detail,
  isLoading,
  isError,
  onRetry,
}: PipelineStatusCardProps) {
  const presentation = getExecutionStatusPresentation(detail?.status ?? status);

  return (
    <section className="space-y-5 rounded-lg border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-section-title text-foreground">Pipeline Progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Requested {formatRunDate(detail?.requested_at ?? requestedAt)}
          </p>
        </div>
        <StatusBadge label={presentation.label} variant={presentation.variant} />
      </div>

      {isLoading && !detail ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading stage progress…
        </p>
      ) : null}
      {isError && !detail ? (
        <ErrorState
          title="Unable to load pipeline progress"
          description="The execution state could not be refreshed."
          onRetry={onRetry}
          className="min-h-40"
        />
      ) : null}
      {detail ? <PipelineStageProgress progress={detail.dashboard_progress} /> : null}
    </section>
  );
}
