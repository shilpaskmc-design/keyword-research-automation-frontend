import { cn } from '@/lib/utils';
import type { PublishStatus } from '@/features/final-results/api/finalResultsApi';

interface FinalResultStatusBadgeProps {
  status: PublishStatus | null | undefined;
}

const statusConfig: Record<PublishStatus, { label: string; className: string }> = {
  Pending: {
    label: 'Pending',
    className: 'border-warning/30 bg-warning/10 text-foreground',
  },
  Approved: {
    label: 'Approved',
    className: 'border-info/30 bg-info/10 text-info',
  },
  Published: {
    label: 'Published',
    className: 'border-success/30 bg-success/10 text-success',
  },
  Reject: {
    label: 'Reject',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
};

/**
 * Read-only status badge — used for terminal statuses (Published, Reject)
 * where no further editing is allowed.
 * Color is never the only indicator: the label text always conveys the state.
 */
export function FinalResultStatusBadge({ status }: FinalResultStatusBadgeProps) {
  if (!status) {
    return <span className="text-muted-foreground">—</span>;
  }

  const config = statusConfig[status];

  if (!config) {
    // Unknown status: render neutral — protects against API contract drift.
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
          'border-border bg-muted text-foreground'
        )}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
