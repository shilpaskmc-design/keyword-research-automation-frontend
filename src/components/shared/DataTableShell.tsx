import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataTableShellProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  isEmpty?: boolean;
  emptyState?: ReactNode;
  pagination?: ReactNode;
  className?: string;
  tableClassName?: string;
}

export function DataTableShell({
  children,
  isLoading = false,
  loadingState,
  errorState,
  isEmpty = false,
  emptyState,
  pagination,
  className,
  tableClassName,
}: DataTableShellProps) {
  const content = isLoading ? loadingState : (errorState ?? (isEmpty ? emptyState : children));

  return (
    <section
      aria-busy={isLoading}
      className={cn('min-w-0 overflow-hidden rounded-lg border bg-surface', className)}
    >
      {isLoading || errorState || isEmpty ? (
        <div className="p-4">{content}</div>
      ) : (
        <div className={cn('max-w-full overflow-x-auto', tableClassName)}>{content}</div>
      )}
      {!isLoading && !errorState && pagination ? pagination : null}
    </section>
  );
}
