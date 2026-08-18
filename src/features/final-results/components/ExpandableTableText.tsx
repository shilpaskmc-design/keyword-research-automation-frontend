import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableTableTextProps {
  text: string | null | undefined;
  /** Used in the accessible label: "Show more: Article Angle" */
  fieldLabel: string;
  /** Max number of lines to show when collapsed. Defaults to 3. */
  maxLines?: number;
  className?: string;
}

export function ExpandableTableText({
  text,
  fieldLabel,
  maxLines = 3,
  className,
}: ExpandableTableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className={cn('min-w-0', className)}>
      <p
        className={cn(
          'whitespace-pre-wrap break-words text-sm',
          !isExpanded && `line-clamp-${maxLines}`
        )}
      >
        {text}
      </p>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? `Show less: ${fieldLabel}` : `Show more: ${fieldLabel}`}
        onClick={() => setIsExpanded((v) => !v)}
        className="mt-1 text-xs font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
}
