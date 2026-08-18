import type { ServiceArea } from '@/features/service-taxonomy/types/serviceTaxonomy';

interface FilteredServiceTaxonomy {
  areas: ServiceArea[];
  searchExpandedAreaIds: Set<number>;
}

function includesSearch(value: string, search: string) {
  return value.toLowerCase().includes(search);
}

export function filterServiceTaxonomy(
  areas: ServiceArea[],
  searchValue: string
): FilteredServiceTaxonomy {
  const search = searchValue.trim().toLowerCase();

  if (!search) {
    return { areas, searchExpandedAreaIds: new Set() };
  }

  const filteredAreas: ServiceArea[] = [];
  const searchExpandedAreaIds = new Set<number>();

  for (const area of areas) {
    const areaMatches = includesSearch(area.name, search);
    const matchingOfferings = area.offerings.filter(
      (offering) =>
        includesSearch(offering.name, search) || includesSearch(offering.seo_query, search)
    );

    if (!areaMatches && matchingOfferings.length === 0) {
      continue;
    }

    if (matchingOfferings.length > 0) {
      searchExpandedAreaIds.add(area.service_area_id);
    }

    filteredAreas.push(areaMatches ? area : { ...area, offerings: matchingOfferings });
  }

  return { areas: filteredAreas, searchExpandedAreaIds };
}
