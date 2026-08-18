import { useQuery } from '@tanstack/react-query';
import { getServiceTaxonomy } from '@/features/service-taxonomy/api/serviceTaxonomyApi';

export const serviceTaxonomyQueryKey = ['service-taxonomy'] as const;

export function useServiceTaxonomy() {
  return useQuery({
    queryKey: serviceTaxonomyQueryKey,
    queryFn: ({ signal }) => getServiceTaxonomy({ signal }),
  });
}
