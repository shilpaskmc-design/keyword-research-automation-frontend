import { AlertTriangle, CircleCheck } from 'lucide-react';
import type { ExcelUploadResult } from '@/features/manual-inputs/api/manualInputsApi';

export function UploadResultSummary({ result }: { result: ExcelUploadResult }) {
  return (
    <div role="status" className="space-y-3 rounded-lg border bg-surface-muted/40 p-4">
      <h3 className="font-semibold text-foreground">Upload completed</h3>
      <div className="flex items-start gap-2 text-sm">
        <CircleCheck aria-hidden="true" className="mt-0.5 h-4 w-4 text-success" />
        <p>
          {result.pending_rows} {result.pending_rows === 1 ? 'input is' : 'inputs are'} ready for
          the next run.
        </p>
      </div>
      <div className="flex items-start gap-2 text-sm">
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 text-warning" />
        <p>
          {result.invalid_rows} invalid {result.invalid_rows === 1 ? 'input was' : 'inputs were'}
          stored.
          {result.invalid_rows > 0
            ? ' Choose Status → Invalid after closing this dialog to review validation details.'
            : ''}
        </p>
      </div>
    </div>
  );
}
