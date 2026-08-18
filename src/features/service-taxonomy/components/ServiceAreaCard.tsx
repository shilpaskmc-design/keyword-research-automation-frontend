import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceOfferingList } from '@/features/service-taxonomy/components/ServiceOfferingList';
import type { ServiceArea } from '@/features/service-taxonomy/types/serviceTaxonomy';

interface ServiceAreaCardProps {
  area: ServiceArea;
  isExpanded: boolean;
  isSearchExpanded: boolean;
  onToggle: (areaId: number) => void;
}

export function ServiceAreaCard({
  area,
  isExpanded,
  isSearchExpanded,
  onToggle,
}: ServiceAreaCardProps) {
  const contentId = `service-area-${area.service_area_id}-offerings`;
  const offeringCount = area.offerings.length;
  const hasOfferings = offeringCount > 0;

  return (
    <section className="overflow-hidden rounded-lg border bg-surface shadow-sm">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-card-title text-foreground">{area.name}</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            {hasOfferings
              ? `${offeringCount} service ${offeringCount === 1 ? 'offering' : 'offerings'}`
              : 'No service offerings available'}
          </p>
        </div>
        {hasOfferings ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isSearchExpanded
                ? `${area.name} is expanded to show search results`
                : `${isExpanded ? 'Collapse' : 'Expand'} ${area.name}`
            }
            aria-expanded={isExpanded || isSearchExpanded}
            aria-controls={contentId}
            onClick={() => onToggle(area.service_area_id)}
            disabled={isSearchExpanded}
            className="shrink-0"
          >
            {isExpanded || isSearchExpanded ? (
              <ChevronDown aria-hidden="true" />
            ) : (
              <ChevronRight aria-hidden="true" />
            )}
          </Button>
        ) : null}
      </div>
      {hasOfferings && isExpanded ? (
        <div id={contentId}>
          <ServiceOfferingList offerings={area.offerings} />
        </div>
      ) : null}
    </section>
  );
}
