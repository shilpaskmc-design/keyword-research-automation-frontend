import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { isApiError } from '@/api/errors';
import { Button } from '@/components/ui/button';
import type { FinalResultsExportParams } from '@/features/final-results/api/finalResultsApi';
import { exportFinalResultsCsv } from '@/features/final-results/api/finalResultsApi';

const EXPORT_LIMIT_CODE = 'FINAL_RESULT_EXPORT_LIMIT_EXCEEDED';

interface ExportCsvButtonProps {
  params: FinalResultsExportParams;
}

/**
 * Downloads the current section's full result set as CSV.
 *
 * Rules enforced here:
 * - page/page_size are never sent (export covers all matching rows, not just the page).
 * - Duplicate export is prevented while a request is in-flight.
 * - 413 + FINAL_RESULT_EXPORT_LIMIT_EXCEEDED surfaces a user-safe message.
 * - Blob URL is revoked after the download anchor is triggered.
 * - Filename comes from Content-Disposition when available, falls back to
 *   "final-results-export.csv".
 */
export function ExportCsvButton({ params }: ExportCsvButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    if (isExporting) return;
    setIsExporting(true);
    setError(null);

    try {
      const result = await exportFinalResultsCsv(params);

      // Determine filename — prefer Content-Disposition, fallback to deterministic name.
      const filename = extractFilename(result.contentDisposition) ?? 'final-results-export.csv';

      // Trigger browser download without opening or parsing the CSV.
      const url = URL.createObjectURL(result.blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      if (isApiError(err) && err.status === 413 && err.code === EXPORT_LIMIT_CODE) {
        setError(
          'The current result set exceeds the export limit of 10,000 rows. Please narrow your filters and try again.'
        );
      } else {
        setError('Export failed. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
        aria-busy={isExporting}
        aria-label={isExporting ? 'Exporting CSV…' : 'Export CSV'}
        className="w-full gap-1.5"
      >
        {isExporting ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Download aria-hidden="true" className="h-4 w-4" />
        )}
        {isExporting ? 'Exporting…' : 'Export CSV'}
      </Button>
      {error && (
        <p role="alert" className="max-w-xs text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Attempts to extract filename from Content-Disposition header value. */
function extractFilename(contentDisposition: string | undefined): string | null {
  if (!contentDisposition) return null;
  const match = /filename\*?=(?:UTF-8'')?["']?([^"';\r\n]+)["']?/i.exec(contentDisposition);
  return match ? decodeURIComponent(match[1].trim()) : null;
}
