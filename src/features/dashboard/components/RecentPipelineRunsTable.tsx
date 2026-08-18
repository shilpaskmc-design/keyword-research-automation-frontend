import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import type { PipelineExecutionSummary } from '@/features/dashboard/api/dashboardApi';
import {
  canViewResults,
  getExecutionStatusPresentation,
  formatFinalResultsCount,
  formatRunDate,
} from '@/features/dashboard/utils/dashboardPresentation';

export function RecentPipelineRunsTable({ runs }: { runs: PipelineExecutionSummary[] }) {
  return (
    <table className="w-full min-w-[680px] border-collapse text-left">
      <thead className="border-b bg-surface-muted/50">
        <tr>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Run Date
          </th>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Status
          </th>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Final Results
          </th>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {runs.map((run) => {
          const presentation = getExecutionStatusPresentation(run.status);
          return (
            <tr key={run.pipeline_execution_id}>
              <td className="px-4 py-4 text-sm text-foreground">
                {formatRunDate(run.completed_at ?? run.requested_at)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge label={presentation.label} variant={presentation.variant} />
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">
                {formatFinalResultsCount(run.final_results_count)}
              </td>
              <td className="px-4 py-4">
                {canViewResults(run) ? (
                  <Button type="button" variant="link" size="sm" asChild className="h-auto p-0">
                    <Link
                      to={`/final-results?tab=history&run=${encodeURIComponent(run.pipeline_execution_id)}`}
                    >
                      View Results
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
