import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  label?: string;
  rows?: number;
  announce?: boolean;
  className?: string;
}

export function LoadingState({
  label = 'Loading…',
  rows = 3,
  announce = false,
  className,
}: LoadingStateProps) {
  const rowCount = Math.max(1, Math.floor(rows));

  return (
    <div
      role={announce ? 'status' : undefined}
      aria-live={announce ? 'polite' : undefined}
      aria-busy="true"
      className={cn('space-y-4 rounded-lg border bg-surface p-5', className)}
    >
      <p className="text-supporting text-muted-foreground">{label}</p>
      <div aria-hidden="true" className="space-y-3">
        {Array.from({ length: rowCount }, (_, index) => (
          <Skeleton key={index} className={cn('h-4 w-full', index === rowCount - 1 && 'w-2/3')} />
        ))}
      </div>
    </div>
  );
}
