import type {
  FinalResultListItem,
  PublishStatus,
} from '@/features/final-results/api/finalResultsApi';
import { ExpandableTableText } from '@/features/final-results/components/ExpandableTableText';
import { UrgencyBadge } from '@/features/final-results/components/UrgencyBadge';
import { PublishStatusSelect } from '@/features/final-results/components/PublishStatusSelect';
import { formatRunDate } from '@/features/final-results/utils/formatRunDate';

interface FinalResultsTableProps {
  rows: FinalResultListItem[];
  showRunDate?: boolean;
  /** Set of row IDs with a pending publish-status mutation. */
  pendingRowIds: ReadonlySet<number>;
  onStatusChange: (rowId: number, status: PublishStatus) => void;
}

/**
 * Shared table for all Final Results sections (Latest, Open Items, History).
 * showRunDate=true adds the Run Date column (used by Open Items and History).
 */
export function FinalResultsTable({
  rows,
  showRunDate = false,
  pendingRowIds,
  onStatusChange,
}: FinalResultsTableProps) {
  return (
    <table className="w-full table-fixed border-collapse text-sm">
      <colgroup>
        {showRunDate && <col className="w-[110px]" />}
        <col className="w-[140px]" />
        <col className="w-[160px]" />
        <col className="w-[200px]" />
        <col className="w-[200px]" />
        <col className="w-[110px]" />
        <col className="w-[110px]" />
        <col className="w-[80px]" />
        <col className="w-[130px]" />
      </colgroup>
      <thead>
        <tr className="border-b bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {showRunDate && (
            <th scope="col" className="px-3 py-2">
              Run Date
            </th>
          )}
          <th scope="col" className="px-3 py-2">
            Keyword
          </th>
          <th scope="col" className="px-3 py-2">
            Topic Title
          </th>
          <th scope="col" className="px-3 py-2">
            Article Angle
          </th>
          <th scope="col" className="px-3 py-2">
            Why Relevant
          </th>
          <th scope="col" className="px-3 py-2">
            Content Type
          </th>
          <th scope="col" className="px-3 py-2">
            Search Intent
          </th>
          <th scope="col" className="px-3 py-2">
            Urgency
          </th>
          <th scope="col" className="px-3 py-2">
            Publish Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((row) => (
          <tr
            key={row.filtered_result_id}
            className="align-top transition-colors hover:bg-muted/20"
          >
            {showRunDate && (
              <td className="px-3 py-3 text-xs text-muted-foreground">
                <time dateTime={row.final_stage_completed_at}>
                  {formatRunDate(row.final_stage_completed_at)}
                </time>
              </td>
            )}
            <td className="px-3 py-3 font-medium text-foreground">{row.keyword}</td>
            <td className="px-3 py-3 text-muted-foreground">{row.topic_title ?? '—'}</td>
            <td className="px-3 py-3">
              <ExpandableTableText text={row.article_angle} fieldLabel="Article Angle" />
            </td>
            <td className="px-3 py-3">
              <ExpandableTableText text={row.why_relevant} fieldLabel="Why Relevant" />
            </td>
            <td className="px-3 py-3 text-muted-foreground">{row.content_type ?? '—'}</td>
            <td className="px-3 py-3 text-muted-foreground">{row.search_intent ?? '—'}</td>
            <td className="px-3 py-3">
              <UrgencyBadge urgency={row.urgency} />
            </td>
            <td className="px-3 py-3">
              {row.sheet_export_row_id !== null && row.sheet_export_row_id !== undefined ? (
                <PublishStatusSelect
                  status={row.publish_status}
                  keyword={row.keyword}
                  isPending={pendingRowIds.has(row.sheet_export_row_id)}
                  onStatusChange={(status) => {
                    if (row.sheet_export_row_id !== null && row.sheet_export_row_id !== undefined) {
                      onStatusChange(row.sheet_export_row_id, status);
                    }
                  }}
                />
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
