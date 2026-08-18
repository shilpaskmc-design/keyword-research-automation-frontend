import { FilterSelect } from '@/components/shared/FilterSelect';
import { SearchInput } from '@/components/shared/SearchInput';
import { ExportCsvButton } from '@/features/final-results/components/ExportCsvButton';
import { cn } from '@/lib/utils';
import type {
  FinalResultsExportParams,
  PublishStatus,
  UrgencyValue,
} from '@/features/final-results/api/finalResultsApi';

const URGENCY_OPTIONS: { label: string; value: UrgencyValue }[] = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const PUBLISH_STATUS_OPTIONS: { label: string; value: PublishStatus }[] = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Published', value: 'Published' },
  { label: 'Reject', value: 'Reject' },
];

interface FinalResultsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  urgency: UrgencyValue | undefined;
  onUrgencyChange: (value: UrgencyValue | undefined) => void;
  publishStatus: PublishStatus | undefined;
  onPublishStatusChange: (value: PublishStatus | undefined) => void;
  exportParams: FinalResultsExportParams;
  /** When true, the Publish Status filter is hidden (Open Items locks it to Pending+Approved). */
  hidePublishStatusFilter?: boolean;
}

export function FinalResultsToolbar({
  searchValue,
  onSearchChange,
  urgency,
  onUrgencyChange,
  publishStatus,
  onPublishStatusChange,
  exportParams,
  hidePublishStatusFilter = false,
}: FinalResultsToolbarProps) {
  return (
    <div
      className={cn(
        'grid gap-3 md:items-end',
        hidePublishStatusFilter
          ? 'md:grid-cols-[1fr_minmax(9rem,11rem)_auto]'
          : 'md:grid-cols-[1fr_minmax(9rem,11rem)_minmax(9rem,13rem)_auto]'
      )}
    >
      {/* Keyword search */}
      <div className="min-w-0 space-y-2">
        <label htmlFor="final-results-search-input" className="text-sm font-medium leading-none">
          Search
        </label>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search keyword…"
          ariaLabel="Search keywords"
        />
      </div>

      {/* Urgency filter */}
      <FilterSelect<UrgencyValue>
        id="urgency-filter"
        label="Urgency"
        value={urgency}
        options={URGENCY_OPTIONS}
        onValueChange={onUrgencyChange}
        clearLabel="All"
      />

      {/* Publish Status filter */}
      {!hidePublishStatusFilter && (
        <FilterSelect<PublishStatus>
          id="publish-status-filter"
          label="Publish Status"
          value={publishStatus}
          options={PUBLISH_STATUS_OPTIONS}
          onValueChange={onPublishStatusChange}
          clearLabel="All"
        />
      )}

      {/* CSV Export — invisible label keeps its bottom edge aligned with the selects */}
      <div className="min-w-0 space-y-2">
        <span className="invisible block text-sm font-medium leading-none" aria-hidden="true">
          Export
        </span>
        <ExportCsvButton params={exportParams} />
      </div>
    </div>
  );
}
