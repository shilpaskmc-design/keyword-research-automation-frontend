import { useState } from 'react';
import { DataTableShell } from '@/components/shared/DataTableShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type {
  FinalResultsExportParams,
  PublishStatus,
  UrgencyValue,
} from '@/features/final-results/api/finalResultsApi';
import { FinalResultsTable } from '@/features/final-results/components/FinalResultsTable';
import { FinalResultsToolbar } from '@/features/final-results/components/FinalResultsToolbar';
import { useLatestResults } from '@/features/final-results/hooks/useFinalResults';
import { useUpdatePublishStatus } from '@/features/final-results/hooks/useUpdatePublishStatus';

interface LatestRunResultsSectionProps {
  /** The latest completed or partial pipeline execution ID. undefined while loading. */
  pipelineExecutionId: string | undefined;
  /** Whether the parent query fetching the pipeline execution ID is loading. */
  isPipelineLoading: boolean;
}

/**
 * Shows Final Results for the latest completed or partial pipeline run.
 * No pagination — a single run produces at most 10 rows.
 * Shows "Results are ranked by relevance, highest first." per spec §18.
 */
export function LatestRunResultsSection({
  pipelineExecutionId,
  isPipelineLoading,
}: LatestRunResultsSectionProps) {
  const [search, setSearch] = useState('');
  const [urgency, setUrgency] = useState<UrgencyValue | undefined>();
  const [publishStatus, setPublishStatus] = useState<PublishStatus | undefined>();

  const { updateStatus, pendingRowIds, rowErrors } = useUpdatePublishStatus();

  const query = useLatestResults({
    pipelineExecutionId,
    search,
    urgency,
    publishStatus,
  });

  const exportParams: FinalResultsExportParams = {
    pipelineExecutionId,
    search: search || undefined,
    urgency,
    publishStatus: publishStatus ? [publishStatus] : undefined,
  };

  const rows = (query.data?.data as NonNullable<typeof query.data>['data']) ?? [];
  const isEmpty =
    (query.isSuccess && rows.length === 0) || (!isPipelineLoading && !pipelineExecutionId);

  return (
    <section aria-labelledby="latest-run-heading" className="space-y-3">
      <SectionHeader
        title="Latest Pipeline Run"
        headingLevel={2}
        description="Results are ranked by relevance, highest first."
      />

      <FinalResultsToolbar
        searchValue={search}
        onSearchChange={(v) => setSearch(v)}
        urgency={urgency}
        onUrgencyChange={setUrgency}
        publishStatus={publishStatus}
        onPublishStatusChange={setPublishStatus}
        exportParams={exportParams}
      />

      <DataTableShell
        isLoading={isPipelineLoading || query.isLoading}
        loadingState={<LoadingState label="Loading latest results…" />}
        errorState={
          query.isError ? (
            <ErrorState
              description="Failed to load latest results."
              onRetry={() => void query.refetch()}
            />
          ) : undefined
        }
        isEmpty={isEmpty}
        emptyState={
          <EmptyState
            title="No results"
            description={
              pipelineExecutionId
                ? 'No Final Results match the current filters.'
                : 'No pipeline run with Final Results found.'
            }
          />
        }
      >
        {rows.length > 0 && (
          <FinalResultsTable
            rows={rows}
            showRunDate={false}
            pendingRowIds={pendingRowIds}
            onStatusChange={updateStatus}
          />
        )}
      </DataTableShell>

      {/* Per-row inline mutation errors */}
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
