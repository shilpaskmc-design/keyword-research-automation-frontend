import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatAdditionalDetailValue } from '@/features/manual-inputs/utils/manualInputMapping';

interface AdditionalDetailsDisplayProps {
  details?: Record<string, unknown> | null;
}

const PREVIEW_LIMIT = 2;

export function AdditionalDetailsDisplay({ details }: AdditionalDetailsDisplayProps) {
  const [expanded, setExpanded] = useState(false);
  const entries = Object.entries(details ?? {});

  if (entries.length === 0) return <span className="text-muted-foreground">—</span>;

  const visibleEntries = expanded ? entries : entries.slice(0, PREVIEW_LIMIT);
  const remaining = entries.length - PREVIEW_LIMIT;

  return (
    <div className="min-w-44 space-y-1">
      <dl className="space-y-1 text-sm">
        {visibleEntries.map(([key, value]) => (
          <div key={key} className="flex gap-1">
            <dt className="font-medium text-foreground">{key}:</dt>
            <dd className="break-words text-muted-foreground">
              {formatAdditionalDetailValue(value)}
            </dd>
          </div>
        ))}
      </dl>
      {remaining > 0 ? (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `+${remaining} more`}
        </Button>
      ) : null}
    </div>
  );
}
