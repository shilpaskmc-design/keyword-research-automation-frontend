import { requestJson } from '@/api/client';
import type { operations } from '@/api/generated/schema';

type LoginOperation = operations['login_api_v1_auth_login_post'];
type SessionOperation = operations['current_session_api_v1_auth_session_get'];
type LogoutOperation = operations['logout_api_v1_auth_logout_post'];

type LoginBody = LoginOperation['requestBody']['content']['application/json'];
type LoginEnvelope = LoginOperation['responses'][200]['content']['application/json'];
type SessionEnvelope = SessionOperation['responses'][200]['content']['application/json'];
type LogoutEnvelope = LogoutOperation['responses'][200]['content']['application/json'];

export type AuthSession = SessionEnvelope['data'];
export type LoginCredentials = LoginBody;

export async function login(credentials: LoginCredentials) {
  const result = await requestJson<LoginEnvelope['data'], LoginEnvelope['meta'], LoginBody>(
    '/api/v1/auth/login',
    { method: 'POST', body: credentials }
  );
  return result.data;
}

export async function getCurrentSession(options: { signal?: AbortSignal } = {}) {
  const result = await requestJson<SessionEnvelope['data'], SessionEnvelope['meta']>(
    '/api/v1/auth/session',
    options
  );
  return result.data;
}

export async function logout() {
  const result = await requestJson<LogoutEnvelope['data'], LogoutEnvelope['meta']>(
    '/api/v1/auth/logout',
    { method: 'POST' }
  );
  return result.data;
}
