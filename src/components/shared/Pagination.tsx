import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  totalItems?: number;
  pageSize?: number;
  showPageNumbers?: boolean;
  className?: string;
}

function getVisiblePages(page: number, totalPages: number) {
  const firstPage = Math.max(1, Math.min(page - 1, totalPages - 2));
  const lastPage = Math.min(totalPages, firstPage + 2);

  return Array.from({ length: Math.max(0, lastPage - firstPage + 1) }, (_, index) =>
    Math.min(totalPages, firstPage + index)
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  totalItems,
  pageSize,
  showPageNumbers = true,
  className,
}: PaginationProps) {
  const hasResultRange = totalItems !== undefined && pageSize !== undefined && pageSize > 0;

  if (totalPages <= 1 && !hasResultRange) {
    return null;
  }

  const start = hasResultRange && totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = hasResultRange ? Math.min(page * pageSize, totalItems) : 0;
  const visiblePages = showPageNumbers ? getVisiblePages(page, totalPages) : [];

  function requestPage(nextPage: number) {
    if (!disabled && nextPage >= 1 && nextPage <= totalPages && nextPage !== page) {
      onPageChange(nextPage);
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {hasResultRange ? (
        <p className="text-caption text-muted-foreground">
          Showing {start}–{end} of {totalItems}
        </p>
      ) : (
        <span />
      )}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => requestPage(page - 1)}
            disabled={disabled || page <= 1}
          >
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
          {visiblePages.length ? (
            <div className="hidden items-center gap-1 sm:flex">
              {visiblePages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  type="button"
                  variant={pageNumber === page ? 'default' : 'outline'}
                  size="icon"
                  aria-label={`Page ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                  onClick={() => requestPage(pageNumber)}
                  disabled={disabled}
                  className="h-8 w-8"
                >
                  {pageNumber}
                </Button>
              ))}
            </div>
          ) : (
            <span className="text-supporting text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => requestPage(page + 1)}
            disabled={disabled || page >= totalPages}
          >
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </nav>
  );
}
