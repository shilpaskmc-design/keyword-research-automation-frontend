import { ServiceAreaCard } from '@/features/service-taxonomy/components/ServiceAreaCard';
import type { ServiceArea } from '@/features/service-taxonomy/types/serviceTaxonomy';

interface ServiceAreaListProps {
  areas: ServiceArea[];
  explicitExpandedAreaIds: ReadonlySet<number>;
  effectiveExpandedAreaIds: ReadonlySet<number>;
  searchExpandedAreaIds: ReadonlySet<number>;
  onToggleArea: (areaId: number) => void;
}

export function ServiceAreaList({
  areas,
  explicitExpandedAreaIds,
  effectiveExpandedAreaIds,
  searchExpandedAreaIds,
  onToggleArea,
}: ServiceAreaListProps) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {areas.map((area) => (
        <ServiceAreaCard
          key={area.service_area_id}
          area={area}
          isExpanded={effectiveExpandedAreaIds.has(area.service_area_id)}
          isSearchExpanded={
            searchExpandedAreaIds.has(area.service_area_id) &&
            !explicitExpandedAreaIds.has(area.service_area_id)
          }
          onToggle={onToggleArea}
        />
      ))}
    </div>
  );
}
