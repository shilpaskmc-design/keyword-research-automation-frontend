import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';

const allowedPaths = new Set([
  '/',
  '/final-results',
  '/manual-inputs',
  '/business-profile',
  '/service-taxonomy',
]);

function safeDestination(value: unknown) {
  if (typeof value !== 'string') return '/';
  const [pathname] = value.split('?');
  return allowedPaths.has(pathname) && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/';
}

export function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const requested = safeDestination((location.state as { from?: unknown } | null)?.from);

  if (auth.status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground shadow-sm"
          >
            KRA
          </div>
          <p className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
            Keyword Research Automation
          </p>
          <p className="mt-1 text-supporting text-muted-foreground">Marketing Operations</p>
        </div>
        <section
          className="w-full rounded-xl border bg-surface p-6 shadow-sm sm:p-8"
          aria-labelledby="login-title"
        >
          <h1 id="login-title" className="text-page-title text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-2 text-supporting text-muted-foreground">Access marketing operations</p>
          {auth.sessionEnded ? (
            <p
              role="status"
              className="mt-5 rounded-md border border-info/30 bg-info/5 p-3 text-sm text-foreground"
            >
              Your session has ended. Please sign in again.
            </p>
          ) : null}
          <LoginForm onSuccess={() => navigate(requested, { replace: true })} />
        </section>
      </div>
    </main>
  );
}
