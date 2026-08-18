import { useState } from 'react';
import { Check, Inbox } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DataTableShell } from '@/components/shared/DataTableShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { FilterSelect } from '@/components/shared/FilterSelect';
import { LoadingState } from '@/components/shared/LoadingState';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

const filterOptions = [
  { value: 'high', label: 'High' },
  { value: 'low', label: 'Low' },
] as const;

export function SharedComponentsPreview() {
  const [search, setSearch] = useState('example keyword');
  const [filter, setFilter] = useState<'high' | 'low'>();
  const [page, setPage] = useState(2);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <main className="mx-auto max-w-6xl space-y-10 p-6">
      <h1 className="text-page-title">Shared Components Preview</h1>

      <section className="grid gap-4 sm:grid-cols-2">
        <SearchInput value={search} onChange={setSearch} ariaLabel="Preview search" />
        <FilterSelect
          label="Urgency"
          value={filter}
          options={[...filterOptions]}
          onValueChange={setFilter}
        />
      </section>

      <section className="flex flex-wrap gap-2">
        <StatusBadge label="Neutral" />
        <StatusBadge label="In progress" variant="info" />
        <StatusBadge label="Complete" variant="success" icon={<Check />} />
        <StatusBadge label="Needs attention" variant="warning" />
        <StatusBadge label="Failed" variant="destructive" />
      </section>

      <SectionHeader
        title="Recent results"
        description="A responsive section heading with actions."
        count={24}
        actions={<Button onClick={() => setIsConfirmOpen(true)}>Open confirmation</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <EmptyState
          title="No results"
          description="Try changing the active filters."
          icon={<Inbox />}
          action={<Button variant="outline">Clear filters</Button>}
        />
        <ErrorState description="The data could not be loaded safely." onRetry={() => undefined} />
        <LoadingState label="Loading results…" announce />
      </div>

      <DataTableShell
        pagination={
          <Pagination
            page={page}
            totalPages={8}
            totalItems={183}
            pageSize={25}
            onPageChange={setPage}
          />
        }
      >
        <table className="min-w-[60rem] text-left text-sm">
          <thead className="border-b bg-surface-muted">
            <tr>
              <th className="px-4 py-3">Keyword</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3">example keyword</td>
              <td className="px-4 py-3">Ready</td>
              <td className="px-4 py-3">Wide content verifies bounded horizontal scrolling.</td>
            </tr>
          </tbody>
        </table>
      </DataTableShell>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm action"
        description="This preview verifies keyboard and focus behavior."
        onConfirm={() => setIsConfirmOpen(false)}
      />
    </main>
  );
}
