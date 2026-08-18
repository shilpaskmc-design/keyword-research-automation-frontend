import { useState } from 'react';
import { SearchX } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ServiceAreaList } from '@/features/service-taxonomy/components/ServiceAreaList';
import { TaxonomyToolbar } from '@/features/service-taxonomy/components/TaxonomyToolbar';
import { useServiceTaxonomy } from '@/features/service-taxonomy/hooks/useServiceTaxonomy';
import { filterServiceTaxonomy } from '@/features/service-taxonomy/utils/filterServiceTaxonomy';

export function ServiceTaxonomyPage() {
  const [searchValue, setSearchValue] = useState('');
  const [explicitExpandedAreaIds, setExplicitExpandedAreaIds] = useState<Set<number>>(
    () => new Set()
  );
  const { data, isPending, isError, isFetching, refetch } = useServiceTaxonomy();
  const taxonomy = data ?? [];
  const { areas: visibleAreas, searchExpandedAreaIds } = filterServiceTaxonomy(
    taxonomy,
    searchValue
  );
  const expandableAreas = taxonomy.filter((area) => area.offerings.length > 0);
  const effectiveExpandedAreaIds = new Set(explicitExpandedAreaIds);

  for (const areaId of searchExpandedAreaIds) {
    effectiveExpandedAreaIds.add(areaId);
  }

  const isAllExpanded =
    expandableAreas.length > 0 &&
    expandableAreas.every((area) => explicitExpandedAreaIds.has(area.service_area_id));

  function handleToggleArea(areaId: number) {
    setExplicitExpandedAreaIds((current) => {
      const next = new Set(current);

      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }

      return next;
    });
  }

  function handleToggleAll() {
    setExplicitExpandedAreaIds(
      isAllExpanded ? new Set() : new Set(expandableAreas.map((area) => area.service_area_id))
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Service Taxonomy"
        description="Browse the services used by the keyword research pipeline."
      />

      {isPending && !data ? (
        <LoadingState label="Loading service taxonomy…" rows={6} announce />
      ) : null}

      {isError && !data ? (
        <ErrorState
          title="Unable to load Service Taxonomy"
          description="The service catalogue could not be loaded. Please try again."
          onRetry={() => void refetch()}
        />
      ) : null}

      {data ? (
        <div className="space-y-6">
          <TaxonomyToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            isAllExpanded={isAllExpanded}
            onToggleAll={handleToggleAll}
            isEmpty={taxonomy.length === 0}
            isRefreshing={isFetching}
          />

          {taxonomy.length === 0 ? (
            <EmptyState
              title="No services available"
              description="The service taxonomy is currently empty."
            />
          ) : visibleAreas.length === 0 ? (
            <EmptyState
              title="No services found"
              description="Try a different Service Area, Service Offering or SEO Query."
              icon={<SearchX />}
              action={
                <Button type="button" variant="outline" onClick={() => setSearchValue('')}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <ServiceAreaList
              areas={visibleAreas}
              explicitExpandedAreaIds={explicitExpandedAreaIds}
              effectiveExpandedAreaIds={effectiveExpandedAreaIds}
              searchExpandedAreaIds={searchExpandedAreaIds}
              onToggleArea={handleToggleArea}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
