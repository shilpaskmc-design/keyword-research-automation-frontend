import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getPipelineExecutions,
  latestResultsEligibleQueryKey,
} from '@/features/pipeline/api/pipelineExecutionsApi';
import { LatestRunResultsSection } from '@/features/final-results/components/LatestRunResultsSection';
import { OpenItemsSection } from '@/features/final-results/components/OpenItemsSection';
import { HistoryResultsSection } from '@/features/final-results/components/HistoryResultsSection';

type TabValue = 'latest' | 'history';

/**
 * Final Results page.
 *
 * URL state (tab and run) follows the approved contract:
 *
 *   /final-results               → latest tab (default)
 *   /final-results?tab=latest    → latest tab
 *   /final-results?tab=history   → history tab, no run filter
 *   /final-results?tab=history&run=<uuid> → history tab, filtered to that run
 *
 * Pagination, search, and filter state remain feature-local (not in URL).
 */
export function FinalResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── URL state ──────────────────────────────────────────────────────────────
  const rawTab = searchParams.get('tab');
  const activeTab: TabValue = rawTab === 'history' ? 'history' : 'latest';
  const activeRunId = searchParams.get('run') ?? undefined;

  function setTab(tab: TabValue) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', tab);
        // Clear run filter when switching away from history.
        if (tab !== 'history') {
          next.delete('run');
        }
        return next;
      },
      { replace: true }
    );
  }

  const clearRunFilter = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('run');
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  // ── Latest completed or partial pipeline execution ───────────────────────────────────
  const latestEligibleQuery = useQuery({
    queryKey: latestResultsEligibleQueryKey,
    queryFn: ({ signal }) =>
      getPipelineExecutions({ page: 1, pageSize: 1, status: ['completed', 'partial'] }, { signal }),
    placeholderData: keepPreviousData,
  });

  const latestExecutionId: string | undefined = (
    latestEligibleQuery.data?.data as { pipeline_execution_id?: string }[] | undefined
  )?.[0]?.pipeline_execution_id;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Final Results"
        description="Review recommendations, manage publication status, and browse historical results."
      />

      <Tabs value={activeTab} onValueChange={(value) => setTab(value as TabValue)}>
        <TabsList>
          <TabsTrigger value="latest">Latest Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* ── Latest Results tab ───────────────────────────────────────────── */}
        <TabsContent value="latest" className="space-y-8">
          <LatestRunResultsSection
            pipelineExecutionId={latestExecutionId}
            isPipelineLoading={latestEligibleQuery.isPending && !latestEligibleQuery.data}
          />
          <OpenItemsSection
            excludePipelineExecutionId={latestExecutionId}
            isPipelineLoading={latestEligibleQuery.isPending && !latestEligibleQuery.data}
          />
        </TabsContent>

        {/* ── History tab ──────────────────────────────────────────────────── */}
        <TabsContent value="history">
          <HistoryResultsSection activeRunId={activeRunId} onClearRunFilter={clearRunFilter} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
