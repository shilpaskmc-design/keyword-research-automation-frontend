import { SearchInput } from '@/components/shared/SearchInput';
import { ExpandCollapseAllButton } from '@/features/service-taxonomy/components/ExpandCollapseAllButton';

interface TaxonomyToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  isAllExpanded: boolean;
  onToggleAll: () => void;
  isEmpty: boolean;
  isRefreshing?: boolean;
}

export function TaxonomyToolbar({
  searchValue,
  onSearchChange,
  isAllExpanded,
  onToggleAll,
  isEmpty,
  isRefreshing = false,
}: TaxonomyToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full max-w-xl">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search service areas or offerings..."
          ariaLabel="Search service taxonomy"
        />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {isRefreshing ? (
          <span role="status" className="text-caption text-muted-foreground">
            Refreshing…
          </span>
        ) : null}
        <ExpandCollapseAllButton
          isAllExpanded={isAllExpanded}
          onToggle={onToggleAll}
          disabled={isEmpty}
        />
      </div>
    </div>
  );
}
