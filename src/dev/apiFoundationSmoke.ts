import { requestJson, type ApiResult, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

type ServiceTaxonomyOperation = operations['get_service_taxonomy_api_v1_service_taxonomy_get'];
type ServiceTaxonomyEnvelope =
  ServiceTaxonomyOperation['responses'][200]['content']['application/json'];
type ServiceTaxonomyData = ServiceTaxonomyEnvelope['data'];
type ServiceTaxonomyMeta = ServiceTaxonomyEnvelope['meta'];

export function runApiFoundationSmoke(
  options: RequestOptions = {}
): Promise<ApiResult<ServiceTaxonomyData, ServiceTaxonomyMeta>> {
  return requestJson<ServiceTaxonomyData, ServiceTaxonomyMeta>('/api/v1/service-taxonomy', options);
}
