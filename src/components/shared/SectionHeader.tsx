import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  count?: number;
  actions?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  count,
  actions,
  headingLevel = 2,
  className,
}: SectionHeaderProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <header
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <Heading className="text-section-title text-foreground">{title}</Heading>
          {count !== undefined ? (
            <span className="text-supporting text-muted-foreground">({count})</span>
          ) : null}
        </div>
        {description ? (
          <p className="mt-1 max-w-3xl text-supporting text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
