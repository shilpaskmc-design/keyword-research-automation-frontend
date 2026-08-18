import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AuthGate() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === 'checking') {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center px-4">
        <LoadingState label="Checking your session…" announce className="w-full" />
      </main>
    );
  }

  if (auth.status === 'session-check-error') {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center px-4">
        <ErrorState
          title="Unable to verify your session"
          description="We couldn't verify your session. Check your connection and try again."
          onRetry={auth.retrySession}
          className="w-full"
        />
      </main>
    );
  }

  if (auth.status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
