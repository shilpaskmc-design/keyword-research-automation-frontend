import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isApiError } from '@/api/errors';
import {
  cancelPipelineSchedule,
  createPipelineSchedule,
  getCurrentPipelineSchedule,
} from '@/features/pipeline/api/pipelineSchedulesApi';
import { isInsideScheduleCutoff } from '@/features/pipeline/utils/pipelineScheduleTime';

const SCHEDULE_POLL_INTERVAL_MS = 30_000;
const CUTOFF_TICK_INTERVAL_MS = 1_000;

export const pipelineScheduleKeys = {
  all: ['pipeline', 'schedules'] as const,
  current: () => ['pipeline', 'schedules', 'current'] as const,
};

export function useCurrentPipelineSchedule() {
  return useQuery({
    queryKey: pipelineScheduleKeys.current(),
    queryFn: ({ signal }) => getCurrentPipelineSchedule({ signal }),
    refetchInterval: (query) => (query.state.data ? SCHEDULE_POLL_INTERVAL_MS : false),
  });
}

export function useCreatePipelineSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof createPipelineSchedule>[0]) =>
      createPipelineSchedule(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pipelineScheduleKeys.current() }),
    onError: (error) => {
      if (isApiError(error) && (error.status === 404 || error.status === 409)) {
        void queryClient.invalidateQueries({ queryKey: pipelineScheduleKeys.current() });
      }
    },
  });
}

export function useCancelPipelineSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => cancelPipelineSchedule(scheduleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pipelineScheduleKeys.current() }),
    onError: (error) => {
      if (isApiError(error) && (error.status === 404 || error.status === 409)) {
        void queryClient.invalidateQueries({ queryKey: pipelineScheduleKeys.current() });
      }
    },
  });
}

export function useScheduleCutoff(scheduledFor?: string) {
  const [insideCutoff, setInsideCutoff] = useState(() =>
    scheduledFor ? isInsideScheduleCutoff(scheduledFor) : false
  );

  useEffect(() => {
    const recalculate = () => {
      setInsideCutoff(scheduledFor ? isInsideScheduleCutoff(scheduledFor) : false);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') recalculate();
    };

    recalculate();
    if (!scheduledFor) return;

    const intervalId = window.setInterval(recalculate, CUTOFF_TICK_INTERVAL_MS);
    window.addEventListener('focus', recalculate);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', recalculate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [scheduledFor]);

  return insideCutoff;
}
