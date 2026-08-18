import { useState } from 'react';
import { DataTableShell } from '@/components/shared/DataTableShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Pagination } from '@/components/shared/Pagination';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type {
  FinalResultsExportParams,
  PublishStatus,
  UrgencyValue,
} from '@/features/final-results/api/finalResultsApi';
import { ActiveRunFilterNotice } from '@/features/final-results/components/ActiveRunFilterNotice';
import { FinalResultsTable } from '@/features/final-results/components/FinalResultsTable';
import { FinalResultsToolbar } from '@/features/final-results/components/FinalResultsToolbar';
import { useHistoryResults } from '@/features/final-results/hooks/useFinalResults';
import { useUpdatePublishStatus } from '@/features/final-results/hooks/useUpdatePublishStatus';

interface HistoryResultsSectionProps {
  /** When set, History is filtered to this pipeline_execution_id. */
  activeRunId: string | undefined;
  onClearRunFilter: () => void;
}

/**
 * Shows all historical Final Result rows in a unified table.
 * Server-side search, urgency, publish status filters, and pagination (25/page).
 * When activeRunId is present, filters by that run and shows ActiveRunFilterNotice.
 */
export function HistoryResultsSection({
  activeRunId,
  onClearRunFilter,
}: HistoryResultsSectionProps) {
  const [search, setSearch] = useState('');
  const [urgency, setUrgency] = useState<UrgencyValue | undefined>();
  const [publishStatus, setPublishStatus] = useState<PublishStatus | undefined>();
  const [page, setPage] = useState(1);

  const { updateStatus, pendingRowIds, rowErrors } = useUpdatePublishStatus();

  // Reset to page 1 when filters change.
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }
  function handleUrgencyChange(value: UrgencyValue | undefined) {
    setUrgency(value);
    setPage(1);
  }
  function handlePublishStatusChange(value: PublishStatus | undefined) {
    setPublishStatus(value);
    setPage(1);
  }

  const query = useHistoryResults({
    search,
    urgency,
    publishStatus,
    pipelineExecutionId: activeRunId,
    page,
  });

  const meta = query.data?.meta as
    | {
        total_items: number;
        total_pages: number;
        page: number;
        page_size: number;
        has_next: boolean;
        has_previous: boolean;
      }
    | undefined;

  const rows = (query.data?.data as NonNullable<typeof query.data>['data']) ?? [];
  const isEmpty = query.isSuccess && rows.length === 0 && !query.isFetching;
  const totalItems = meta?.total_items ?? 0;
  const totalPages = meta?.total_pages ?? 1;

  const exportParams: FinalResultsExportParams = {
    pipelineExecutionId: activeRunId,
    search: search || undefined,
    urgency,
    publishStatus: publishStatus ? [publishStatus] : undefined,
  };

  // The run date for the notice is derived from the first row (if any).
  // If zero rows returned for this run, a generic fallback message is shown.
  const firstRow = rows[0];

  return (
    <section aria-labelledby="history-heading" className="space-y-3">
      <SectionHeader title="History" headingLevel={2} />

      {/* Active run filter notice — only shown when a run is selected */}
      {activeRunId && (
        <ActiveRunFilterNotice firstRow={firstRow} onClearFilter={onClearRunFilter} />
      )}

      <FinalResultsToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        urgency={urgency}
        onUrgencyChange={handleUrgencyChange}
        publishStatus={publishStatus}
        onPublishStatusChange={handlePublishStatusChange}
        exportParams={exportParams}
      />

      <DataTableShell
        isLoading={query.isLoading}
        loadingState={<LoadingState label="Loading history…" />}
        errorState={
          query.isError ? (
            <ErrorState
              description="Failed to load history."
              onRetry={() => void query.refetch()}
            />
          ) : undefined
        }
        isEmpty={isEmpty}
        emptyState={
          <EmptyState
            title="No history"
            description={
              activeRunId
                ? 'No Final Results found for the selected pipeline run.'
                : 'No historical results found.'
            }
          />
        }
        pagination={
          totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={25}
              onPageChange={setPage}
              disabled={query.isFetching}
            />
          ) : undefined
        }
      >
        {rows.length > 0 && (
          <FinalResultsTable
            rows={rows}
            showRunDate
            pendingRowIds={pendingRowIds}
            onStatusChange={updateStatus}
          />
        )}
      </DataTableShell>

      {rowErrors.size > 0 && (
        <ul className="space-y-1" aria-live="polite">
          {[...rowErrors.entries()].map(([rowId, msg]) => (
            <li key={rowId} role="alert" className="text-xs text-destructive">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
