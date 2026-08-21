import type { ManualInputRecord } from '@/features/manual-inputs/api/manualInputsApi';
import { AdditionalDetailsDisplay } from '@/features/manual-inputs/components/AdditionalDetailsDisplay';
import { ManualInputStatusBadge } from '@/features/manual-inputs/components/ManualInputStatusBadge';
import { ManualInputValidationInfo } from '@/features/manual-inputs/components/ManualInputValidationInfo';
import { ManualInputActions } from '@/features/manual-inputs/components/ManualInputActions';

interface ManualInputsTableProps {
  records: ManualInputRecord[];
  showValidation: boolean;
}

export function ManualInputsTable({ records, showValidation }: ManualInputsTableProps) {
  return (
    <table className="w-full min-w-[880px] border-collapse text-left">
      <thead className="border-b bg-surface-muted/50">
        <tr>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Input Text
          </th>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Summary / Gist
          </th>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Status
          </th>
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Additional Details
          </th>
          {showValidation ? (
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
              Validation Error
            </th>
          ) : null}
          <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {records.map((record) => (
          <tr key={record.id} className="align-top">
            <td className="max-w-xs break-words px-4 py-4 text-sm text-foreground">
              {record.raw_text?.trim() || 'Not provided'}
            </td>
            <td className="max-w-xs break-words px-4 py-4 text-sm text-muted-foreground">
              {record.gist?.trim() || '—'}
            </td>
            <td className="px-4 py-4">
              <ManualInputStatusBadge status={record.status} />
            </td>
            <td className="px-4 py-4">
              <AdditionalDetailsDisplay details={record.extra_data} />
            </td>
            {showValidation ? (
              <td className="px-4 py-4">
                <ManualInputValidationInfo record={record} />
              </td>
            ) : null}
            <td className="px-4 py-4">
              <ManualInputActions record={record} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
