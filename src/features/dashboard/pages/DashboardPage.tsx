import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Activity, CalendarClock, History } from 'lucide-react';
import { DataTableShell } from '@/components/shared/DataTableShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LatestPipelineRunCard } from '@/features/dashboard/components/LatestPipelineRunCard';
import { ManualInputReminderDialog } from '@/features/dashboard/components/ManualInputReminderDialog';
import { PipelineScheduleSection } from '@/features/dashboard/components/PipelineScheduleSection';
import { PipelineStatusCard } from '@/features/dashboard/components/PipelineStatusCard';
import { RecentPipelineRunsTable } from '@/features/dashboard/components/RecentPipelineRunsTable';
import { SchedulePipelineDialog } from '@/features/dashboard/components/SchedulePipelineDialog';
import { StartPipelineButton } from '@/features/dashboard/components/StartPipelineButton';
import { latestExecutionQueryKey, useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useManualInputSummary } from '@/features/manual-inputs/hooks/useManualInputs';
import {
  useCurrentPipelineSchedule,
  useScheduleCutoff,
} from '@/features/pipeline/hooks/usePipelineSchedule';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const [reminderOpen, setReminderOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const dashboard = useDashboard();
  const currentSchedule = useCurrentPipelineSchedule();
  const manualInputSummary = useManualInputSummary();
  const previousSuccessfulScheduleId = useRef<string | undefined>(undefined);
  const schedule = currentSchedule.data ?? null;
  const insideScheduleCutoff = useScheduleCutoff(schedule?.scheduled_for);
  const activeDetail = dashboard.executionDetail.data;
  const startedExecution = dashboard.startMutation.data;
  const latestExecution = dashboard.latestExecution.data;
  const activeOverview =
    activeDetail ??
    (startedExecution?.pipeline_execution_id === dashboard.activeExecutionId
      ? startedExecution
      : latestExecution?.pipeline_execution_id === dashboard.activeExecutionId
        ? latestExecution
        : undefined);
  const latestCompletedRun = dashboard.latestCompleted.data?.data[0];
  const recentRuns = dashboard.recentExecutions.data?.data ?? [];

  function openReminder() {
    dashboard.startMutation.reset();
    setReminderOpen(true);
  }

  useEffect(() => {
    if (!currentSchedule.isSuccess) return;

    if (previousSuccessfulScheduleId.current && !currentSchedule.data) {
      void queryClient.invalidateQueries({ queryKey: latestExecutionQueryKey });
      void queryClient.invalidateQueries({ queryKey: ['pipeline', 'recent'] });
    }
    previousSuccessfulScheduleId.current = currentSchedule.data?.id;
  }, [currentSchedule.data, currentSchedule.isSuccess, queryClient]);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Start and monitor the keyword research pipeline, review ready inputs, and access recent results."
        actions={
          <>
            <StartPipelineButton onClick={openReminder} />
            <Button
              type="button"
              variant="outline"
              disabled={!currentSchedule.isSuccess || Boolean(schedule && insideScheduleCutoff)}
              onClick={() => setScheduleDialogOpen(true)}
            >
              <CalendarClock aria-hidden="true" />
              {schedule ? 'Change Schedule' : 'Schedule Pipeline'}
            </Button>
          </>
        }
      />

      <PipelineScheduleSection
        isPending={currentSchedule.isPending}
        isError={currentSchedule.isError}
        schedule={currentSchedule.data}
        insideCutoff={insideScheduleCutoff}
        onRetry={() => void currentSchedule.refetch()}
      />

      {dashboard.latestExecution.isPending ? (
        <LoadingState label="Loading pipeline status…" rows={3} />
      ) : null}
      {dashboard.latestExecution.isError ? (
        <ErrorState
          title="Unable to load pipeline status"
          description="The latest pipeline state could not be loaded."
          onRetry={() => void dashboard.latestExecution.refetch()}
        />
      ) : null}

      {dashboard.activeExecutionId && activeOverview ? (
        <PipelineStatusCard
          status={activeOverview.status}
          requestedAt={activeOverview.requested_at}
          detail={activeDetail}
          isLoading={dashboard.executionDetail.isPending}
          isError={dashboard.executionDetail.isError}
          onRetry={() => void dashboard.executionDetail.refetch()}
        />
      ) : null}

      {dashboard.latestExecution.isSuccess && !dashboard.activeExecutionId ? (
        <div className="space-y-4">
          {dashboard.latestCompleted.isPending ? (
            <LoadingState label="Loading latest pipeline run…" rows={3} />
          ) : null}
          {dashboard.latestCompleted.isError ? (
            <ErrorState
              title="Unable to load latest pipeline run"
              description="The latest pipeline run could not be loaded."
              onRetry={() => void dashboard.latestCompleted.refetch()}
            />
          ) : null}
          {dashboard.latestCompleted.data && !latestCompletedRun ? (
            <EmptyState
              title="No pipeline runs with Final Results"
              description="Start a pipeline to generate your first set of Final Results."
              icon={<Activity />}
            />
          ) : null}
          {latestCompletedRun ? <LatestPipelineRunCard run={latestCompletedRun} /> : null}
        </div>
      ) : null}

      <div className="space-y-4">
        <SectionHeader
          title="Recent Pipeline Runs"
          description="The five most recent previous executions."
        />
        <DataTableShell
          isLoading={dashboard.recentExecutions.isPending && !dashboard.recentExecutions.data}
          loadingState={<LoadingState label="Loading recent pipeline runs…" rows={5} />}
          errorState={
            dashboard.recentExecutions.isError && !dashboard.recentExecutions.data ? (
              <ErrorState
                title="Unable to load recent pipeline runs"
                description="Recent pipeline history could not be loaded."
                onRetry={() => void dashboard.recentExecutions.refetch()}
              />
            ) : undefined
          }
          isEmpty={Boolean(dashboard.recentExecutions.data) && recentRuns.length === 0}
          emptyState={
            <EmptyState
              title="No recent pipeline runs"
              description="Previous pipeline executions will appear here."
              icon={<History />}
            />
          }
        >
          <RecentPipelineRunsTable runs={recentRuns} />
        </DataTableShell>
      </div>

      <ManualInputReminderDialog
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        readyCount={manualInputSummary.data?.ready_count}
        isPending={dashboard.startMutation.isPending}
        error={dashboard.startMutation.error}
        onContinue={() =>
          dashboard.startMutation.mutate(undefined, {
            onSuccess: () => setReminderOpen(false),
          })
        }
      />
      <SchedulePipelineDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        currentSchedule={schedule}
      />
    </section>
  );
}
