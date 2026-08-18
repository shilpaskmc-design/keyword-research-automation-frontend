import { AlertCircle, Check, Circle, LoaderCircle } from 'lucide-react';
import type { PipelineExecutionDetail } from '@/features/dashboard/api/dashboardApi';

type DashboardStage = PipelineExecutionDetail['dashboard_progress']['stages'][number];

const stageStatusLabels = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  partial: 'Partial',
  failed: 'Failed',
} as const;

export function PipelineStageItem({ stage }: { stage: DashboardStage }) {
  const Icon =
    stage.status === 'completed'
      ? Check
      : stage.status === 'running'
        ? LoaderCircle
        : stage.status === 'failed' || stage.status === 'partial'
          ? AlertCircle
          : Circle;

  return (
    <li className="flex items-start gap-3 rounded-md border p-3">
      <Icon
        aria-hidden="true"
        className={
          stage.status === 'running'
            ? 'mt-0.5 h-5 w-5 animate-spin text-info'
            : stage.status === 'completed'
              ? 'mt-0.5 h-5 w-5 text-success'
              : stage.status === 'failed'
                ? 'mt-0.5 h-5 w-5 text-destructive'
                : 'mt-0.5 h-5 w-5 text-muted-foreground'
        }
      />
      <div className="min-w-0">
        <p className="font-medium text-foreground">{stage.display_name}</p>
        <p className="text-sm text-muted-foreground">{stageStatusLabels[stage.status]}</p>
      </div>
    </li>
  );
}
