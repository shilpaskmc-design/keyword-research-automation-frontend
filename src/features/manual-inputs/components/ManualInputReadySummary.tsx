import { CircleCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useManualInputSummary } from '@/features/manual-inputs/hooks/useManualInputs';

export function ManualInputReadySummary() {
  const { data, isPending, isError, isFetching, refetch } = useManualInputSummary();

  return (
    <section className="rounded-lg border bg-surface p-4" aria-busy={isFetching}>
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading ready-input count…</p>
      ) : null}
      {isError ? (
        <div className="flex flex-wrap items-center justify-between gap-3" role="alert">
          <p className="text-sm text-muted-foreground">Ready-input count is unavailable.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            <RotateCcw aria-hidden="true" />
            Retry
          </Button>
        </div>
      ) : null}
      {data ? (
        <div className="flex items-center gap-3">
          <CircleCheck aria-hidden="true" className="h-5 w-5 text-success" />
          <p className="font-medium text-foreground">
            {data.ready_count} {data.ready_count === 1 ? 'input' : 'inputs'} ready for next run
          </p>
          {isFetching ? <span className="text-sm text-muted-foreground">Refreshing…</span> : null}
        </div>
      ) : null}
    </section>
  );
}
