import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { configureAuthHandlers } from '@/api/client';
import { isApiError } from '@/api/errors';
import { queryClient } from '@/lib/query/client';
import {
  getCurrentSession,
  login as loginRequest,
  logout as logoutRequest,
  type AuthSession,
  type LoginCredentials,
} from '@/features/auth/api/authApi';
import {
  AUTH_SESSION_QUERY_KEY,
  AuthContext,
  type AuthStatus,
} from '@/features/auth/hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [forcedUnauthenticated, setForcedUnauthenticated] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const csrfTokenRef = useRef<string | null>(null);
  const csrfRecoveryRef = useRef<Promise<unknown> | null>(null);

  const sessionQuery = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: ({ signal }) => getCurrentSession({ signal }),
    enabled: !forcedUnauthenticated,
  });

  const endSession = useCallback(
    (showMessage: boolean) => {
      if (forcedUnauthenticated) return;
      csrfTokenRef.current = null;
      setForcedUnauthenticated(true);
      setSessionEnded(showMessage);
      queryClient.clear();
    },
    [forcedUnauthenticated]
  );

  useEffect(() => {
    if (sessionQuery.data) {
      csrfTokenRef.current = sessionQuery.data.csrf_token;
    }
  }, [sessionQuery.data]);

  useEffect(() => {
    if (sessionQuery.error && isApiError(sessionQuery.error) && sessionQuery.error.status === 401) {
      endSession(false);
    }
  }, [endSession, sessionQuery.error]);

  useEffect(
    () =>
      configureAuthHandlers({
        getCsrfToken: () => csrfTokenRef.current,
        onUnauthorized: () => endSession(true),
        onCsrfRejected: () => {
          if (!csrfRecoveryRef.current) {
            csrfRecoveryRef.current = queryClient
              .fetchQuery({ queryKey: AUTH_SESSION_QUERY_KEY, queryFn: () => getCurrentSession() })
              .then((session) => {
                csrfTokenRef.current = session.csrf_token;
              })
              .catch((error: unknown) => {
                if (isApiError(error) && error.status === 401) endSession(true);
              })
              .finally(() => {
                csrfRecoveryRef.current = null;
              });
          }
        },
      }),
    [endSession]
  );

  let status: AuthStatus;
  let session: AuthSession | null = null;
  if (forcedUnauthenticated) {
    status = 'unauthenticated';
  } else if (sessionQuery.isPending) {
    status = 'checking';
  } else if (sessionQuery.isError) {
    status =
      isApiError(sessionQuery.error) && sessionQuery.error.status === 401
        ? 'unauthenticated'
        : 'session-check-error';
  } else {
    status = 'authenticated';
    session = sessionQuery.data;
  }

  async function login(credentials: LoginCredentials) {
    const nextSession = await loginRequest(credentials);
    csrfTokenRef.current = nextSession.csrf_token;
    setForcedUnauthenticated(false);
    setSessionEnded(false);
    queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, nextSession);
  }

  async function logout() {
    try {
      await logoutRequest();
      endSession(false);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        endSession(false);
        return;
      }
      throw error;
    }
  }

  function retrySession() {
    void sessionQuery.refetch();
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        session,
        sessionEnded,
        login,
        logout,
        retrySession,
        clearSessionEnded: () => setSessionEnded(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
