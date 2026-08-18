import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryEntriesToggleProps {
  categoryName: string;
  entryCount: number;
  expanded: boolean;
  controlsId: string;
  onToggle: () => void;
}

export function CategoryEntriesToggle({
  categoryName,
  entryCount,
  expanded,
  controlsId,
  onToggle,
}: CategoryEntriesToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={controlsId}
      className="h-auto w-full justify-between px-0 py-2 hover:bg-transparent"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Entries ({entryCount})
      </span>
      <ChevronDown
        aria-hidden="true"
        className={cn('transition-transform', expanded && 'rotate-180')}
      />
      <span className="sr-only">for {categoryName}</span>
    </Button>
  );
}
