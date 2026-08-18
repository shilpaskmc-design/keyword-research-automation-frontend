import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  listFinalResults,
  type FinalResultsListParams,
  type PublishStatus,
  type UrgencyValue,
} from '@/features/final-results/api/finalResultsApi';

const DEBOUNCE_MS = 400;

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const finalResultsKeys = {
  all: ['final-results'] as const,
  latest: (filters: LatestFilters) => ['final-results', 'latest', filters] as const,
  openItems: (filters: OpenItemsFilters, page: number) =>
    ['final-results', 'open-items', filters, page] as const,
  history: (filters: HistoryFilters, page: number) =>
    ['final-results', 'history', filters, page] as const,
} as const;

// ─── Filter Shapes ───────────────────────────────────────────────────────────

export interface LatestFilters {
  pipelineExecutionId: string;
  search?: string;
  urgency?: UrgencyValue;
  publishStatus?: PublishStatus;
}

export interface OpenItemsFilters {
  excludePipelineExecutionId: string;
  search?: string;
  urgency?: UrgencyValue;
}

export interface HistoryFilters {
  search?: string;
  urgency?: UrgencyValue;
  publishStatus?: PublishStatus;
  pipelineExecutionId?: string;
}

// ─── Latest Results ──────────────────────────────────────────────────────────

interface UseLatestResultsOptions {
  pipelineExecutionId: string | undefined;
  search: string;
  urgency: UrgencyValue | undefined;
  publishStatus: PublishStatus | undefined;
}

export function useLatestResults({
  pipelineExecutionId,
  search,
  urgency,
  publishStatus,
}: UseLatestResultsOptions) {
  // 400 ms debounce on keyword search — timer cancelled on change/unmount.
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const filters: LatestFilters | undefined = pipelineExecutionId
    ? {
        pipelineExecutionId,
        search: debouncedSearch || undefined,
        urgency,
        publishStatus,
      }
    : undefined;

  return useQuery({
    queryKey: filters ? finalResultsKeys.latest(filters) : ['final-results', 'latest', 'idle'],
    queryFn: ({ signal }) => {
      const params: FinalResultsListParams = {
        pipelineExecutionId: filters!.pipelineExecutionId,
        search: filters!.search,
        urgency: filters!.urgency,
        // Latest only allows single-value publish status filter
        publishStatus: filters!.publishStatus ? [filters!.publishStatus] : undefined,
        // No page/page_size — ≤ 10 results per run, pagination omitted.
      };
      return listFinalResults(params, { signal });
    },
    enabled: Boolean(pipelineExecutionId),
  });
}

// ─── Open Items ──────────────────────────────────────────────────────────────

// Open Items publish status is fixed: Pending + Approved (not user-configurable).
const OPEN_ITEMS_PUBLISH_STATUS: PublishStatus[] = ['Pending', 'Approved'];

interface UseOpenItemsOptions {
  excludePipelineExecutionId: string | undefined;
  search: string;
  urgency: UrgencyValue | undefined;
  page: number;
}

export function useOpenItems({
  excludePipelineExecutionId,
  search,
  urgency,
  page,
}: UseOpenItemsOptions) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const filters: OpenItemsFilters | undefined = excludePipelineExecutionId
    ? {
        excludePipelineExecutionId,
        search: debouncedSearch || undefined,
        urgency,
      }
    : undefined;

  return useQuery({
    queryKey: filters
      ? finalResultsKeys.openItems(filters, page)
      : ['final-results', 'open-items', 'idle'],
    queryFn: ({ signal }) => {
      const params: FinalResultsListParams = {
        excludePipelineExecutionId: filters!.excludePipelineExecutionId,
        publishStatus: OPEN_ITEMS_PUBLISH_STATUS,
        search: filters!.search,
        urgency: filters!.urgency,
        page,
        pageSize: 25,
      };
      return listFinalResults(params, { signal });
    },
    enabled: Boolean(excludePipelineExecutionId),
    placeholderData: keepPreviousData,
  });
}

// ─── History ─────────────────────────────────────────────────────────────────

interface UseHistoryResultsOptions {
  search: string;
  urgency: UrgencyValue | undefined;
  publishStatus: PublishStatus | undefined;
  pipelineExecutionId?: string;
  page: number;
}

export function useHistoryResults({
  search,
  urgency,
  publishStatus,
  pipelineExecutionId,
  page,
}: UseHistoryResultsOptions) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const filters: HistoryFilters = {
    search: debouncedSearch || undefined,
    urgency,
    publishStatus,
    pipelineExecutionId,
  };

  return useQuery({
    queryKey: finalResultsKeys.history(filters, page),
    queryFn: ({ signal }) => {
      const params: FinalResultsListParams = {
        search: filters.search,
        urgency: filters.urgency,
        publishStatus: filters.publishStatus ? [filters.publishStatus] : undefined,
        pipelineExecutionId: filters.pipelineExecutionId,
        page,
        pageSize: 25,
      };
      return listFinalResults(params, { signal });
    },
    placeholderData: keepPreviousData,
  });
}
