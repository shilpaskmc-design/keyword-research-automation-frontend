import type { PipelineExecutionDetail } from '@/features/dashboard/api/dashboardApi';
import { PipelineStageItem } from '@/features/dashboard/components/PipelineStageItem';

export function PipelineStageProgress({
  progress,
}: {
  progress: PipelineExecutionDetail['dashboard_progress'];
}) {
  const stages = [...progress.stages].sort((left, right) => left.order - right.order);

  if (stages.length === 0) {
    return <p className="text-sm text-muted-foreground">Stage progress will appear shortly.</p>;
  }

  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {stages.map((stage) => (
        <PipelineStageItem key={stage.key} stage={stage} />
      ))}
    </ol>
  );
}
