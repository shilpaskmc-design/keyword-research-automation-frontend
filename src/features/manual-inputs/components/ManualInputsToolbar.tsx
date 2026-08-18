import type { ReactNode } from 'react';
import { FilterSelect } from '@/components/shared/FilterSelect';
import { SearchInput } from '@/components/shared/SearchInput';
import {
  manualInputSourceOptions,
  manualInputStatusOptions,
  type ManualInputStatus,
} from '@/features/manual-inputs/utils/manualInputMapping';

type ManualInputSource = (typeof manualInputSourceOptions)[number]['value'];

interface ManualInputsToolbarProps {
  searchValue: string;
  status?: ManualInputStatus;
  source?: ManualInputSource;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ManualInputStatus | undefined) => void;
  onSourceChange: (value: ManualInputSource | undefined) => void;
  actions: ReactNode;
  isRefreshing?: boolean;
}

export function ManualInputsToolbar({
  searchValue,
  status,
  source,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  actions,
  isRefreshing = false,
}: ManualInputsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">{actions}</div>
      <div className="grid gap-3 md:grid-cols-[minmax(14rem,1fr)_minmax(12rem,16rem)_minmax(10rem,14rem)] md:items-end">
        <div className="space-y-2">
          <span className="text-sm font-medium">Search</span>
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search input text or summary"
            ariaLabel="Search Manual Inputs"
          />
        </div>
        <FilterSelect
          label="Status"
          value={status}
          options={manualInputStatusOptions}
          onValueChange={onStatusChange}
          clearLabel="All statuses"
        />
        <FilterSelect
          label="Source"
          value={source}
          options={[...manualInputSourceOptions]}
          onValueChange={onSourceChange}
          clearLabel="All sources"
        />
      </div>
      {isRefreshing ? (
        <p role="status" className="text-sm text-muted-foreground">
          Refreshing results…
        </p>
      ) : null}
    </div>
  );
}
