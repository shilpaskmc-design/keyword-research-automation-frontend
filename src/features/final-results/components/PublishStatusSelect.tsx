import type { PublishStatus } from '@/features/final-results/api/finalResultsApi';
import { FinalResultStatusBadge } from '@/features/final-results/components/FinalResultStatusBadge';

const TERMINAL_STATUSES: ReadonlySet<PublishStatus> = new Set(['Published', 'Reject']);
const EDITABLE_OPTIONS: PublishStatus[] = ['Pending', 'Approved', 'Published', 'Reject'];

interface PublishStatusSelectProps {
  status: PublishStatus | null | undefined;
  /** The keyword text, used for the accessible label. */
  keyword: string;
  isPending: boolean;
  onStatusChange: (status: PublishStatus) => void;
}

/**
 * PublishStatusSelect:
 *  - Pending / Approved → editable <select>
 *  - Published / Reject → locked read-only badge
 *
 * While a mutation is in-flight (isPending=true), the select is disabled
 * and shows the last confirmed value — no optimistic update.
 */
export function PublishStatusSelect({
  status,
  keyword,
  isPending,
  onStatusChange,
}: PublishStatusSelectProps) {
  // Null / undefined status with no sheet_export_row_id means not yet exported.
  if (status === null || status === undefined) {
    return <FinalResultStatusBadge status={status} />;
  }

  // Terminal statuses are locked — no further editing allowed.
  if (TERMINAL_STATUSES.has(status)) {
    return <FinalResultStatusBadge status={status} />;
  }

  return (
    <div className="relative">
      <select
        aria-label={`Publish status for ${keyword}`}
        value={status}
        disabled={isPending}
        onChange={(e) => onStatusChange(e.target.value as PublishStatus)}
        className="h-8 w-full min-w-[110px] cursor-pointer appearance-none rounded-md border border-input bg-background px-2 pr-7 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        {EDITABLE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow or spinner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground"
      >
        {isPending ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          '▾'
        )}
      </span>
    </div>
  );
}
