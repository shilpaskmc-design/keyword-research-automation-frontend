import { ServiceOfferingItem } from '@/features/service-taxonomy/components/ServiceOfferingItem';
import type { ServiceOffering } from '@/features/service-taxonomy/types/serviceTaxonomy';

interface ServiceOfferingListProps {
  offerings: ServiceOffering[];
}

export function ServiceOfferingList({ offerings }: ServiceOfferingListProps) {
  return (
    <ul className="space-y-2 border-t px-4 py-4 sm:px-5">
      {offerings.map((offering) => (
        <ServiceOfferingItem key={offering.service_offering_id} offering={offering} />
      ))}
    </ul>
  );
}
