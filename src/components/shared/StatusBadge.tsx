import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusBadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'destructive';

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  icon?: ReactNode;
  className?: string;
}

const variantClasses: Record<StatusBadgeVariant, string> = {
  neutral: 'border-border bg-muted text-foreground',
  info: 'border-info/30 bg-info/10 text-info',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-foreground',
  destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
};

export function StatusBadge({ label, variant = 'neutral', icon, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('gap-1.5 whitespace-nowrap', variantClasses[variant], className)}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span>{label}</span>
    </Badge>
  );
}
