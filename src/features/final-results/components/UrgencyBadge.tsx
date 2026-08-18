import { cn } from '@/lib/utils';

type UrgencyValue = string | null | undefined;

interface UrgencyBadgeProps {
  urgency: UrgencyValue;
}

const urgencyConfig: Record<string, { label: string; className: string }> = {
  high: {
    label: 'High',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  medium: {
    label: 'Medium',
    className: 'border-warning/30 bg-warning/10 text-foreground',
  },
  low: {
    label: 'Low',
    className: 'border-info/30 bg-info/10 text-info',
  },
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  if (!urgency) {
    return <span className="text-muted-foreground">—</span>;
  }

  const config = urgencyConfig[urgency.toLowerCase()];

  if (!config) {
    // Unknown urgency values render neutrally — protects against API contract drift.
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
          'border-border bg-muted text-foreground'
        )}
      >
        {urgency}
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
