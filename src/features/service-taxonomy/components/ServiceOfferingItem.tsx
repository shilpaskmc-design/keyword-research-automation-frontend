import type { ServiceOffering } from '@/features/service-taxonomy/types/serviceTaxonomy';

interface ServiceOfferingItemProps {
  offering: ServiceOffering;
}

export function ServiceOfferingItem({ offering }: ServiceOfferingItemProps) {
  return (
    <li className="rounded-md border bg-surface-muted/40 px-4 py-3">
      <h3 className="text-sm font-semibold text-foreground">{offering.name}</h3>
      <p className="mt-1 text-caption text-muted-foreground">
        <span className="font-medium text-foreground">SEO Query:</span>{' '}
        {offering.seo_query.trim() ? offering.seo_query : 'Not provided'}
      </p>
    </li>
  );
}
