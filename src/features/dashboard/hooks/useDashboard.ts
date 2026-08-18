import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isApiError } from '@/api/errors';
import {
  getExecutionDetail,
  getLatestExecution,
  getPipelineExecutions,
  startPipeline,
  type PipelineExecutionStatus,
} from '@/features/dashboard/api/dashboardApi';
import { latestResultsEligibleQueryKey } from '@/features/pipeline/api/pipelineExecutionsApi';
import { manualInputSummaryQueryKey } from '@/features/manual-inputs/hooks/useManualInputs';

export { latestResultsEligibleQueryKey as latestCompletedQueryKey };

const ACTIVE_STATUSES: ReadonlySet<PipelineExecutionStatus> = new Set(['queued', 'running']);
const POLLING_INTERVAL_MS = 5_000;

export const latestExecutionQueryKey = ['pipeline', 'latest'] as const;
export const recentExecutionsQueryKey = (activeExecutionId?: string) =>
  ['pipeline', 'recent', { activeExecutionId }] as const;
export const executionDetailQueryKey = (executionId: string) =>
  ['pipeline', 'execution', executionId] as const;

export function isActiveExecutionStatus(status: PipelineExecutionStatus) {
  return ACTIVE_STATUSES.has(status);
}

export function useDashboard() {
  const queryClient = useQueryClient();
  const [startedExecutionId, setStartedExecutionId] = useState<string>();
  const [terminalExecutionId, setTerminalExecutionId] = useState<string>();
  const handledTerminalExecutionIds = useRef(new Set<string>());

  const latestExecution = useQuery({
    queryKey: latestExecutionQueryKey,
    queryFn: ({ signal }) => getLatestExecution({ signal }),
  });
  const latestActiveId =
    latestExecution.data &&
    isActiveExecutionStatus(latestExecution.data.status) &&
    latestExecution.data.pipeline_execution_id !== terminalExecutionId
      ? latestExecution.data.pipeline_execution_id
      : undefined;
  const activeExecutionId = startedExecutionId ?? latestActiveId;

  const latestCompleted = useQuery({
    queryKey: latestResultsEligibleQueryKey,
    queryFn: ({ signal }) =>
      getPipelineExecutions({ page: 1, pageSize: 1, status: ['completed', 'partial'] }, { signal }),
  });

  const recentExecutions = useQuery({
    queryKey: recentExecutionsQueryKey(activeExecutionId),
    queryFn: ({ signal }) =>
      getPipelineExecutions(
        {
          page: 1,
          pageSize: 5,
          excludePipelineExecutionId: activeExecutionId,
        },
        { signal }
      ),
    enabled: latestExecution.isSuccess || Boolean(startedExecutionId),
  });

  const executionDetail = useQuery({
    queryKey: executionDetailQueryKey(activeExecutionId ?? ''),
    queryFn: ({ signal }) => getExecutionDetail(activeExecutionId!, { signal }),
    enabled: Boolean(activeExecutionId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && isActiveExecutionStatus(status) ? POLLING_INTERVAL_MS : false;
    },
  });

  const startMutation = useMutation({
    mutationFn: startPipeline,
    onSuccess: (queuedExecution) => {
      setTerminalExecutionId(undefined);
      setStartedExecutionId(queuedExecution.pipeline_execution_id);
      void queryClient.invalidateQueries({ queryKey: latestExecutionQueryKey });
      void queryClient.invalidateQueries({ queryKey: ['pipeline', 'recent'] });
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: latestExecutionQueryKey });
      }
    },
  });

  useEffect(() => {
    const detail = executionDetail.data;
    if (!activeExecutionId || !detail || isActiveExecutionStatus(detail.status)) return;
    if (handledTerminalExecutionIds.current.has(activeExecutionId)) return;

    handledTerminalExecutionIds.current.add(activeExecutionId);
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: latestExecutionQueryKey }),
      queryClient.invalidateQueries({ queryKey: latestResultsEligibleQueryKey }),
      queryClient.invalidateQueries({ queryKey: ['pipeline', 'recent'] }),
      queryClient.invalidateQueries({ queryKey: manualInputSummaryQueryKey }),
    ]).finally(() => {
      setTerminalExecutionId(activeExecutionId);
      setStartedExecutionId((current) => (current === activeExecutionId ? undefined : current));
    });
  }, [activeExecutionId, executionDetail.data, queryClient]);

  return {
    activeExecutionId,
    executionDetail,
    latestCompleted,
    latestExecution,
    recentExecutions,
    startMutation,
  };
}
