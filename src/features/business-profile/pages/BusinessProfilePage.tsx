import { useState } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { AddCategoryDialog } from '@/features/business-profile/components/AddCategoryDialog';
import { BusinessProfileCategoryList } from '@/features/business-profile/components/BusinessProfileCategoryList';
import { useBusinessProfile } from '@/features/business-profile/hooks/useBusinessProfile';

export function BusinessProfilePage() {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<number>>(() => new Set());
  const { data, isPending, isError, isFetching, refetch } = useBusinessProfile();

  function handleToggleCategory(categoryId: number) {
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Business Profile"
        description="View and maintain the business context used by the keyword research pipeline."
        actions={<AddCategoryDialog />}
      />

      {isPending && !data ? (
        <LoadingState label="Loading Business Profile…" rows={5} announce />
      ) : null}

      {isError && !data ? (
        <ErrorState
          title="Unable to load Business Profile"
          description="The Business Profile could not be loaded. Please try again."
          onRetry={() => void refetch()}
        />
      ) : null}

      {data ? (
        <div className="space-y-3">
          {isFetching ? (
            <p role="status" className="text-sm text-muted-foreground">
              Refreshing…
            </p>
          ) : null}
          {data.length === 0 ? (
            <EmptyState
              title="No Business Profile categories"
              description="Add a category to start organizing business information."
              icon={<BriefcaseBusiness />}
            />
          ) : (
            <BusinessProfileCategoryList
              categories={data}
              expandedCategoryIds={expandedCategoryIds}
              onToggleCategory={handleToggleCategory}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
