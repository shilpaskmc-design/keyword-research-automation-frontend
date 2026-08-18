import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRunDate } from '@/features/final-results/utils/formatRunDate';
import type { FinalResultListItem } from '@/features/final-results/api/finalResultsApi';

interface ActiveRunFilterNoticeProps {
  /** The first row from the filtered History result, used to derive the run date. */
  firstRow: FinalResultListItem | undefined;
  onClearFilter: () => void;
}

/**
 * Shows the active run filter banner when the user deep-linked to a specific run.
 *
 * Run date resilience:
 *   - When filtered History has ≥ 1 row: show "Showing results for run <date>"
 *   - When 0 rows returned:              show generic "Viewing results from a selected pipeline run."
 *   - Always:                            show Clear Run Filter button
 *
 * The raw pipeline_execution_id UUID is never displayed.
 * No extra network request is made solely to resolve the notice copy.
 */
export function ActiveRunFilterNotice({ firstRow, onClearFilter }: ActiveRunFilterNoticeProps) {
  const noticeText = firstRow
    ? `Showing results for run ${formatRunDate(firstRow.final_stage_completed_at)}.`
    : 'Viewing results from a selected pipeline run.';

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-info/30 bg-info/5 px-4 py-3"
    >
      <div className="flex items-center gap-2 text-sm text-foreground">
        <Filter aria-hidden="true" className="h-4 w-4 shrink-0 text-info" />
        <span>{noticeText}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClearFilter}
        className="gap-1.5 text-xs"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
        Clear Run Filter
      </Button>
    </div>
  );
}
