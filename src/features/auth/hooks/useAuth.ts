import { createContext, useContext } from 'react';
import type { AuthSession, LoginCredentials } from '@/features/auth/api/authApi';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'session-check-error';
export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export interface AuthContextValue {
  status: AuthStatus;
  session: AuthSession | null;
  sessionEnded: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  retrySession: () => void;
  clearSessionEnded: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return value;
}
