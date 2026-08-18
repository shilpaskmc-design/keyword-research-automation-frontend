import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { DataTableShell } from '@/components/shared/DataTableShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { Pagination } from '@/components/shared/Pagination';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddManualInputDialog } from '@/features/manual-inputs/components/AddManualInputDialog';
import { ManualInputReadySummary } from '@/features/manual-inputs/components/ManualInputReadySummary';
import { ManualInputsTable } from '@/features/manual-inputs/components/ManualInputsTable';
import { ManualInputsToolbar } from '@/features/manual-inputs/components/ManualInputsToolbar';
import { UploadExcelDialog } from '@/features/manual-inputs/components/UploadExcelDialog';
import { useManualInputs } from '@/features/manual-inputs/hooks/useManualInputs';
import {
  manualInputSourceOptions,
  type ManualInputStatus,
} from '@/features/manual-inputs/utils/manualInputMapping';

type ManualInputSource = (typeof manualInputSourceOptions)[number]['value'];

const PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 400;

export function ManualInputsPage() {
  const [searchParams] = useSearchParams();
  const openAddDialog = searchParams.get('add') === '1';
  const [searchValue, setSearchValue] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [status, setStatus] = useState<ManualInputStatus | undefined>('pending');
  const [source, setSource] = useState<ManualInputSource>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedKeyword(searchValue.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  const listQuery = useManualInputs({
    keyword: debouncedKeyword || undefined,
    status,
    source,
    page,
    pageSize: PAGE_SIZE,
  });
  const pagination = listQuery.data?.meta.pagination;
  const records = listQuery.data?.data ?? [];
  const hasFilters = Boolean(debouncedKeyword || status || source);

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setPage(1);
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Manual Inputs"
        description="Prepare additional information to include in the next keyword research run."
      />
      <ManualInputReadySummary />
      <ManualInputsToolbar
        searchValue={searchValue}
        status={status}
        source={source}
        onSearchChange={handleSearchChange}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onSourceChange={(value) => {
          setSource(value);
          setPage(1);
        }}
        actions={
          <>
            <UploadExcelDialog />
            <AddManualInputDialog defaultOpen={openAddDialog} />
          </>
        }
        isRefreshing={listQuery.isFetching && Boolean(listQuery.data)}
      />

      <DataTableShell
        isLoading={listQuery.isPending && !listQuery.data}
        loadingState={<LoadingState label="Loading Manual Inputs…" rows={8} announce />}
        errorState={
          listQuery.isError && !listQuery.data ? (
            <ErrorState
              title="Unable to load Manual Inputs"
              description="Manual Inputs could not be loaded. Please try again."
              onRetry={() => void listQuery.refetch()}
            />
          ) : undefined
        }
        isEmpty={Boolean(listQuery.data) && records.length === 0}
        emptyState={
          <EmptyState
            title={
              hasFilters ? 'No Manual Inputs match these filters' : 'No Manual Inputs available'
            }
            description={
              hasFilters
                ? 'Adjust the search or filters to see other Manual Inputs.'
                : 'Add a Manual Input or upload an XLSX workbook to get started.'
            }
            icon={<Inbox />}
          />
        }
        pagination={
          pagination && records.length > 0 ? (
            <Pagination
              page={pagination.page}
              pageSize={pagination.page_size}
              totalItems={pagination.total_items}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
              disabled={listQuery.isFetching}
            />
          ) : undefined
        }
      >
        <ManualInputsTable
          records={records}
          showValidation={status === 'invalid' && !listQuery.isPlaceholderData}
        />
      </DataTableShell>
    </section>
  );
}
