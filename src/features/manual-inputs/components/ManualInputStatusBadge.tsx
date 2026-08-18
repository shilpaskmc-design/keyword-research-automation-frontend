import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ManualInputStatus } from '@/features/manual-inputs/utils/manualInputMapping';

const statusPresentation: Record<
  string,
  { label: string; variant: 'success' | 'info' | 'destructive' | 'neutral' | 'warning' }
> = {
  pending: { label: 'Ready for Next Run', variant: 'success' },
  promoted: { label: 'Used in Previous Run', variant: 'info' },
  invalid: { label: 'Invalid', variant: 'destructive' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
};

export function ManualInputStatusBadge({ status }: { status: ManualInputStatus | string }) {
  const presentation = statusPresentation[status] ?? { label: status, variant: 'neutral' as const };
  return <StatusBadge label={presentation.label} variant={presentation.variant} />;
}
