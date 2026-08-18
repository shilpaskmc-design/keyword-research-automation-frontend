import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-surface-muted/40 px-6 py-10 text-center',
        className
      )}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          {icon}
        </div>
      ) : null}
      <h3 className="text-card-title text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-supporting text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
