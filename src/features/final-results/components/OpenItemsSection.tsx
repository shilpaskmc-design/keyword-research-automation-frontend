import { useState } from 'react';
import { DataTableShell } from '@/components/shared/DataTableShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Pagination } from '@/components/shared/Pagination';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type {
  FinalResultsExportParams,
  UrgencyValue,
} from '@/features/final-results/api/finalResultsApi';
import { FinalResultsTable } from '@/features/final-results/components/FinalResultsTable';
import { FinalResultsToolbar } from '@/features/final-results/components/FinalResultsToolbar';
import { useOpenItems } from '@/features/final-results/hooks/useFinalResults';
import { useUpdatePublishStatus } from '@/features/final-results/hooks/useUpdatePublishStatus';

interface OpenItemsSectionProps {
  /** The latest completed execution ID to exclude from Open Items. undefined while loading. */
  excludePipelineExecutionId: string | undefined;
  /** Whether the parent query fetching the pipeline execution ID is loading. */
  isPipelineLoading: boolean;
}

/**
 * Shows unfinished recommendations from all previous runs (Pending + Approved only).
 * Excludes the latest pipeline run.
 * Uses server-side pagination, 25 rows per page.
 */
export function OpenItemsSection({
  excludePipelineExecutionId,
  isPipelineLoading,
}: OpenItemsSectionProps) {
  const [search, setSearch] = useState('');
  const [urgency, setUrgency] = useState<UrgencyValue | undefined>();
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

  const query = useOpenItems({
    excludePipelineExecutionId,
    search,
    urgency,
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
  const isEmpty =
    (query.isSuccess && rows.length === 0 && !query.isFetching) ||
    (!isPipelineLoading && !excludePipelineExecutionId);
  const totalItems = meta?.total_items ?? 0;
  const totalPages = meta?.total_pages ?? 1;

  // Export params: Open Items scope — exclude latest, Pending+Approved, active filters.
  const exportParams: FinalResultsExportParams = {
    excludePipelineExecutionId,
    publishStatus: ['Pending', 'Approved'],
    search: search || undefined,
    urgency,
  };

  return (
    <section aria-labelledby="open-items-heading" className="space-y-3">
      <SectionHeader
        title="Open Items from Previous Runs"
        headingLevel={2}
        description={
          totalItems > 0
            ? `${totalItems} item${totalItems === 1 ? '' : 's'} still need attention`
            : undefined
        }
      />

      {/* Publish Status filter is hidden — Open Items is always Pending+Approved */}
      <FinalResultsToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        urgency={urgency}
        onUrgencyChange={handleUrgencyChange}
        publishStatus={undefined}
        onPublishStatusChange={() => undefined}
        exportParams={exportParams}
        hidePublishStatusFilter
      />

      <DataTableShell
        isLoading={isPipelineLoading || query.isLoading}
        loadingState={<LoadingState label="Loading open items…" />}
        errorState={
          query.isError ? (
            <ErrorState
              description="Failed to load open items."
              onRetry={() => void query.refetch()}
            />
          ) : undefined
        }
        isEmpty={isEmpty}
        emptyState={
          <EmptyState title="No open items" description="No open items from previous runs." />
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
