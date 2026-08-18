import { ApiError, isApiError } from '@/api/errors';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface AuthRequestContext {
  path: string;
  method: HttpMethod;
}

interface AuthHandlers {
  getCsrfToken: () => string | null;
  onUnauthorized: (context: AuthRequestContext) => void;
  onCsrfRejected: (context: AuthRequestContext) => void;
}

let authHandlers: AuthHandlers = {
  getCsrfToken: () => null,
  onUnauthorized: () => undefined,
  onCsrfRejected: () => undefined,
};

export function configureAuthHandlers(handlers: AuthHandlers) {
  authHandlers = handlers;
  return () => {
    if (authHandlers === handlers) {
      authHandlers = {
        getCsrfToken: () => null,
        onUnauthorized: () => undefined,
        onCsrfRejected: () => undefined,
      };
    }
  };
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface JsonRequestOptions<TBody = never> extends RequestOptions {
  method?: HttpMethod;
  body?: TBody;
}

export interface NoContentRequestOptions extends RequestOptions {
  method: Exclude<HttpMethod, 'GET'>;
}

export interface BinaryJsonRequestOptions extends RequestOptions {
  method: Exclude<HttpMethod, 'GET'>;
  body: Blob;
  contentType: string;
}

export interface ApiResult<TData, TMeta = unknown> {
  data: TData;
  meta: TMeta;
}

export interface ApiFileResult {
  blob: Blob;
  contentType?: string;
  contentDisposition?: string;
}

type QueryValue = string | number | boolean | undefined | string[];

let cachedApiBaseUrl: string | undefined;

const hasOwn = (value: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(value, key);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonContentType(contentType: string | null) {
  return contentType?.toLowerCase().includes('json') ?? false;
}

function isAbortError(error: unknown, signal?: AbortSignal) {
  return signal?.aborted === true || (isRecord(error) && error.name === 'AbortError');
}

export function normalizeApiBaseUrl(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ApiError({
      kind: 'configuration',
      message: 'The API base URL is not configured.',
    });
  }

  let url: URL;

  try {
    url = new URL(value.trim());
  } catch (cause) {
    throw new ApiError({
      kind: 'configuration',
      message: 'The API base URL is invalid.',
      cause,
    });
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ApiError({
      kind: 'configuration',
      message: 'The API base URL must use HTTP or HTTPS.',
    });
  }

  if (url.pathname !== '/' || url.search !== '' || url.hash !== '') {
    throw new ApiError({
      kind: 'configuration',
      message: 'The API base URL must contain only the backend origin.',
    });
  }

  return url.toString().replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  cachedApiBaseUrl ??= normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
  return cachedApiBaseUrl;
}

export function serializeQuery(parameters: Readonly<Record<string, QueryValue>>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const item of value) {
          searchParams.append(key, String(item));
        }
      } else {
        searchParams.set(key, String(value));
      }
    }
  }

  return searchParams.toString();
}

function createRequestUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function createHeaders(
  path: string,
  method: HttpMethod,
  options: RequestOptions,
  hasJsonBody: boolean
) {
  const headers = new Headers(options.headers);

  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (method !== 'GET' && path !== '/api/v1/auth/login') {
    const csrfToken = authHandlers.getCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  return headers;
}

function createUnexpectedError(message: string, cause?: unknown) {
  return new ApiError({ kind: 'unexpected', message, cause });
}

function createSafeHttpError(status: number, cause?: unknown) {
  return new ApiError({
    kind: 'api',
    status,
    message: 'The server returned an error response.',
    cause,
  });
}

function normalizeJsonApiError(status: number, payload: unknown): ApiError {
  if (!isRecord(payload) || payload.status !== 'error' || !isRecord(payload.error)) {
    return createSafeHttpError(status);
  }

  const message =
    typeof payload.error.message === 'string'
      ? payload.error.message
      : 'The server returned an error response.';
  const code = typeof payload.error.code === 'string' ? payload.error.code : undefined;
  const requestId =
    isRecord(payload.meta) && typeof payload.meta.request_id === 'string'
      ? payload.meta.request_id
      : undefined;

  return new ApiError({
    kind: 'api',
    status,
    code,
    message,
    detail: payload.error.detail,
    requestId,
  });
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (cause) {
    throw createUnexpectedError('The server returned malformed JSON.', cause);
  }
}

async function throwResponseError(response: Response, context: AuthRequestContext): Promise<never> {
  const contentType = response.headers.get('Content-Type');

  if (!isJsonContentType(contentType)) {
    throw createSafeHttpError(response.status);
  }

  try {
    const payload: unknown = await response.json();
    const error = normalizeJsonApiError(response.status, payload);
    if (
      response.status === 401 &&
      context.path !== '/api/v1/auth/login' &&
      context.path !== '/api/v1/auth/session'
    ) {
      authHandlers.onUnauthorized(context);
    }
    if (response.status === 403 && error.code === 'CSRF_TOKEN_INVALID') {
      authHandlers.onCsrfRejected(context);
    }
    throw error;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    throw createSafeHttpError(response.status, error);
  }
}

async function executeRequest(url: string, init: RequestInit, signal?: AbortSignal) {
  try {
    return await fetch(url, init);
  } catch (cause) {
    if (isAbortError(cause, signal)) {
      throw new ApiError({
        kind: 'cancelled',
        message: 'The request was cancelled.',
        cause,
      });
    }

    throw new ApiError({
      kind: 'network',
      message: 'The server could not be reached.',
      cause,
    });
  }
}

export async function requestJson<TData, TMeta = unknown, TBody = never>(
  path: string,
  options: JsonRequestOptions<TBody> = {}
): Promise<ApiResult<TData, TMeta>> {
  const method = options.method ?? 'GET';
  const hasBody = options.body !== undefined;

  if (method === 'GET' && hasBody) {
    throw createUnexpectedError('GET requests cannot include a body.');
  }

  let body: string | undefined;

  if (hasBody) {
    try {
      body = JSON.stringify(options.body);
    } catch (cause) {
      throw createUnexpectedError('The request body could not be serialized.', cause);
    }
  }

  const response = await executeRequest(
    createRequestUrl(path),
    {
      method,
      headers: createHeaders(path, method, options, hasBody),
      body,
      signal: options.signal,
      credentials: 'include',
    },
    options.signal
  );

  if (!response.ok) {
    await throwResponseError(response, { path, method });
  }

  if (!isJsonContentType(response.headers.get('Content-Type'))) {
    throw createUnexpectedError('The server returned an unexpected response format.');
  }

  const payload = await parseJsonResponse(response);

  if (
    !isRecord(payload) ||
    payload.status !== 'success' ||
    !hasOwn(payload, 'data') ||
    !hasOwn(payload, 'meta') ||
    !isRecord(payload.meta)
  ) {
    throw createUnexpectedError('The server returned an invalid success response.');
  }

  return {
    data: payload.data as TData,
    meta: payload.meta as TMeta,
  };
}

export async function requestNoContent(
  path: string,
  options: NoContentRequestOptions
): Promise<void> {
  const response = await executeRequest(
    createRequestUrl(path),
    {
      method: options.method,
      headers: createHeaders(path, options.method, options, false),
      signal: options.signal,
      credentials: 'include',
    },
    options.signal
  );

  if (!response.ok) {
    await throwResponseError(response, { path, method: options.method });
  }
}

export async function requestBinaryJson<TData, TMeta = unknown>(
  path: string,
  options: BinaryJsonRequestOptions
): Promise<ApiResult<TData, TMeta>> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', options.contentType);
  const csrfToken = authHandlers.getCsrfToken();
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await executeRequest(
    createRequestUrl(path),
    {
      method: options.method,
      headers,
      body: options.body,
      signal: options.signal,
      credentials: 'include',
    },
    options.signal
  );

  if (!response.ok) {
    await throwResponseError(response, { path, method: options.method });
  }

  if (!isJsonContentType(response.headers.get('Content-Type'))) {
    throw createUnexpectedError('The server returned an unexpected response format.');
  }

  const payload = await parseJsonResponse(response);

  if (
    !isRecord(payload) ||
    payload.status !== 'success' ||
    !hasOwn(payload, 'data') ||
    !hasOwn(payload, 'meta') ||
    !isRecord(payload.meta)
  ) {
    throw createUnexpectedError('The server returned an invalid success response.');
  }

  return {
    data: payload.data as TData,
    meta: payload.meta as TMeta,
  };
}

export async function requestFile(
  path: string,
  options: RequestOptions = {}
): Promise<ApiFileResult> {
  const response = await executeRequest(
    createRequestUrl(path),
    {
      method: 'GET',
      headers: new Headers(options.headers),
      signal: options.signal,
      credentials: 'include',
    },
    options.signal
  );

  if (!response.ok) {
    await throwResponseError(response, { path, method: 'GET' });
  }

  const contentType = response.headers.get('Content-Type') ?? undefined;
  const contentDisposition = response.headers.get('Content-Disposition') ?? undefined;

  return {
    blob: await response.blob(),
    contentType,
    contentDisposition,
  };
}
