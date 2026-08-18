import { requestJson, requestNoContent, type RequestOptions } from '@/api/client';
import type { operations } from '@/api/generated/schema';

type ListOperation = operations['list_business_profile_categories'];
type CreateCategoryOperation = operations['create_business_profile_category'];
type AddEntryOperation = operations['add_business_profile_entry'];

type ListEnvelope = ListOperation['responses'][200]['content']['application/json'];
type CreateCategoryBody = CreateCategoryOperation['requestBody']['content']['application/json'];
type CreateCategoryEnvelope =
  CreateCategoryOperation['responses'][201]['content']['application/json'];
type AddEntryBody = AddEntryOperation['requestBody']['content']['application/json'];
type AddEntryEnvelope = AddEntryOperation['responses'][201]['content']['application/json'];

export type BusinessProfileCategory = ListEnvelope['data'][number];

export async function getBusinessProfile(options: RequestOptions = {}) {
  const result = await requestJson<ListEnvelope['data'], ListEnvelope['meta']>(
    '/api/v1/business-profile',
    options
  );

  return result.data;
}

export async function createCategory(body: CreateCategoryBody) {
  const result = await requestJson<
    CreateCategoryEnvelope['data'],
    CreateCategoryEnvelope['meta'],
    CreateCategoryBody
  >('/api/v1/business-profile/categories', { method: 'POST', body });

  return result.data;
}

export function deleteCategory(categoryId: number) {
  return requestNoContent(`/api/v1/business-profile/categories/${categoryId}`, {
    method: 'DELETE',
  });
}

export async function createEntry(categoryId: number, body: AddEntryBody) {
  const result = await requestJson<
    AddEntryEnvelope['data'],
    AddEntryEnvelope['meta'],
    AddEntryBody
  >(`/api/v1/business-profile/categories/${categoryId}/entries`, {
    method: 'POST',
    body,
  });

  return result.data;
}

export function deleteEntry(entryId: number) {
  return requestNoContent(`/api/v1/business-profile/entries/${entryId}`, {
    method: 'DELETE',
  });
}
