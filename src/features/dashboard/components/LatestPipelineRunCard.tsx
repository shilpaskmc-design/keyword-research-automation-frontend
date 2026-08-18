import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { PipelineExecutionSummary } from '@/features/dashboard/api/dashboardApi';
import {
  canViewResults,
  executionStatusPresentation,
  formatFinalResultsCount,
  formatRunDate,
} from '@/features/dashboard/utils/dashboardPresentation';

export function LatestPipelineRunCard({ run }: { run: PipelineExecutionSummary }) {
  const presentation = executionStatusPresentation[run.status];

  return (
    <section className="rounded-lg border bg-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <h2 className="text-section-title text-foreground">Latest Pipeline Run</h2>
          <StatusBadge label={presentation.label} variant={presentation.variant} />
          <p className="text-sm text-muted-foreground">
            {formatRunDate(run.completed_at ?? run.requested_at)}
          </p>
          <p className="font-medium text-foreground">
            {formatFinalResultsCount(run.final_results_count)}
          </p>
        </div>
        {canViewResults(run) ? (
          <Button asChild>
            <Link to="/final-results?tab=latest">
              View Final Results
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
