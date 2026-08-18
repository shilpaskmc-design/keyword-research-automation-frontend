# Known Technical Debt & Security Audit Tracker

> [!info] Document Status
> **Status:** Active Tracking
> **Product:** Keyword Research Automation Frontend

---

## Security Audit Items

The following security audit findings are tracked as known technical debt to be resolved before Phase 2 feature routing work:

### 1. React Router Upgrade
- **Current Version:** `react-router-dom` `6.30.4`
- **Audit Findings:** Moderate advisories on React Router 6.x line (`CVE-2025-68470`, `GHSA-337j-9hxr-rhxg`).
- **Target Resolution:** Migrate to `react-router-dom` `>= 7.18.0`.
- **Scheduled Phase:** Immediately prior to **Phase 2 — Application Shell & Routing**.
- **Rationale:** No router-dependent application logic exists yet in Phase 0/1, making Phase 2 the cleanest milestone to execute the React Router major version upgrade without breaking feature code.

---

### 2. Vite / Esbuild Upgrade [RESOLVED]
- **Previous Version:** `vite` `5.4.21` (resolved `esbuild` `0.21.5`)
- **Updated Version:** `vite` `6.4.3` (resolves `esbuild` `0.25.12`)
- **Status:** Resolved in pre-Phase-2 security maintenance task. `npm audit` reports 0 vulnerabilities.
