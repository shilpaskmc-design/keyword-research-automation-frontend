import { requestJson, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

type ServiceTaxonomyOperation = operations['get_service_taxonomy_api_v1_service_taxonomy_get'];
type ServiceTaxonomyEnvelope =
  ServiceTaxonomyOperation['responses'][200]['content']['application/json'];

export async function getServiceTaxonomy(options: RequestOptions = {}) {
  const result = await requestJson<
    ServiceTaxonomyEnvelope['data'],
    ServiceTaxonomyEnvelope['meta']
  >('/api/v1/service-taxonomy', options);

  return result.data;
}
