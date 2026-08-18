import type { PipelineExecutionSummary } from '@/features/dashboard/api/dashboardApi';

const executionStatusPresentationMap = {
  queued: { label: 'Queued', variant: 'info' },
  running: { label: 'Running', variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  partial: { label: 'Partial', variant: 'warning' },
  failed: { label: 'Failed', variant: 'destructive' },
  abandoned: { label: 'Abandoned', variant: 'neutral' },
} as const;

type StatusBadgeVariant = 'info' | 'success' | 'warning' | 'destructive' | 'neutral';

/** Returns a safe presentation for any status string, including unknown future values. */
export function getExecutionStatusPresentation(status: string): {
  label: string;
  variant: StatusBadgeVariant;
} {
  return (
    (
      executionStatusPresentationMap as Record<
        string,
        { label: string; variant: StatusBadgeVariant }
      >
    )[status] ?? { label: status, variant: 'neutral' }
  );
}

// Keep the named export for any existing consumers.
export const executionStatusPresentation = executionStatusPresentationMap;

export function formatRunDate(value: string | null | undefined) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatFinalResultsCount(count: number | null | undefined): string {
  if (typeof count !== 'number') return '—';
  if (count === 1) return '1 Final Result';
  return `${count} Final Results`;
}

export function canViewResults(run: PipelineExecutionSummary) {
  return (
    (run.status === 'completed' || run.status === 'partial') &&
    typeof run.final_results_count === 'number' &&
    run.final_results_count > 0
  );
}
