export type ApiErrorKind = 'api' | 'network' | 'cancelled' | 'unexpected' | 'configuration';

interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  detail?: unknown;
  requestId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly detail?: unknown;
  readonly requestId?: string;
  readonly cause?: unknown;

  constructor({ kind, message, status, code, detail, requestId, cause }: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.detail = detail;
    this.requestId = requestId;
    this.cause = cause;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
