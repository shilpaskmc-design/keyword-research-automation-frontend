# Phase 11C — Frontend Single-User Authentication

Status: Implemented pending final verification.

## Mandatory local-development origin

Use `http://localhost:5173` for the browser frontend and
`VITE_API_BASE_URL=http://localhost:8000` for the backend origin. The backend
must allow exactly `http://localhost:5173` through `CORS_ORIGINS`. Do not mix
`localhost` and `127.0.0.1`; with the development `SameSite=Lax` cookie, that
mix makes the login response cookie cross-site and prevents session restore.

## Contract

Use the approved generated OpenAPI types for:

```text
POST /api/v1/auth/login
GET /api/v1/auth/session
POST /api/v1/auth/logout
```

Authentication uses an HttpOnly backend cookie and one stable CSRF token per
session. The session credential is never read or stored by frontend code. The
CSRF token exists only in non-persisted runtime memory.

## Flow

```text
Startup → session check → AuthGate → protected AppLayout
Login → use login response → register CSRF → requested safe route or /
Logout/401 → clear CSRF and query cache → /login
CSRF 403 → one shared session refresh → no automatic mutation replay
```

Only safe internal routes created by AuthGate may be restored after login.
No redirect query parameter, external destination, `/profile` route, RBAC,
signup, recovery, or browser credential storage is allowed.

## UI

The Login page is outside AppLayout. Profile is a bottom navigation utility on
desktop and mobile. Its menu contains read-only authenticated email and Logout.

## Verification

Run API type generation, TypeScript, ESLint, format check, production build,
and review `npm audit`. Manually verify login, restore, direct protected URLs,
single-session invalidation, CSRF failure recovery, logout/back behavior,
desktop/mobile Profile access, responsive widths, and existing feature flows.
