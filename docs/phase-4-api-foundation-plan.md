# Implementation Plan — Phase 4: API Foundation

> [!info] Document Status
> **Status:** Approved for implementation
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Establish the shared HTTP transport layer, normalized API errors, generated OpenAPI types, and TanStack Query defaults before feature API integration and serious screen development.

---

# 1. Goal

Build the reusable API foundation used by all later feature slices.

```text
Feature Component
        ↓
Feature Hook
        ↓
Feature API Function
        ↓
Shared API Client
        ↓
Backend Public API
```

Phase 4 should provide:

```text
VITE_API_BASE_URL handling
Generated OpenAPI types
Shared native-fetch client
JSON request handling
JSON success-envelope handling
JSON error normalization
Non-JSON/file response handling
AbortSignal support
Query serialization foundation
TanStack Query defaults
```

Milestone:

```text
Approved OpenAPI Contract
        ↓
Generated Types
        ↓
Shared API Client
        ↓
Normalized Result / Error
        ↓
Ready for Feature API Integration
```

---

# 2. Current Baseline

Completed:

```text
Phase 0 — Repository Setup
Phase 1 — Design System Foundation
Phase 2 — Application Shell
Phase 3 — Shared Application Components
```

Already available:

```text
React 18
TypeScript
TanStack Query
QueryClientProvider
Vite environment support
.env.example
package-lock.json
```

Existing Query infrastructure:

```text
src/lib/query/client.ts
src/app/providers.tsx
```

Preserve these locations.

Do not create another `QueryClient` or another provider hierarchy.

---

# 3. Approved Backend Contract

The authoritative frontend API contract is:

```text
../keyword-research-automation/docs/openapi/public-openapi.json
```

Use the OpenAPI contract for:

```text
Paths
HTTP methods
Parameters
Request bodies
Response bodies
Enums
Media types
Response statuses
```

Do not derive frontend contracts from:

```text
Database models
SQLAlchemy models
Migrations
Services
Workers
Internal routes
Database tables
```

If the approved snapshot is missing, unreadable, invalid, or missing a required contract, stop and report the gap rather than guessing.

---

# 4. Repository Boundary

Modify only:

```text
keyword-research-automation-frontend/
```

Read-only access is allowed to:

```text
../keyword-research-automation/docs/openapi/public-openapi.json
```

Do not modify or regenerate backend files during Phase 4.

---

# 5. Scope

Create or complete:

```text
src/api/
├── generated/
│   └── schema.d.ts
├── client.ts
└── errors.ts
```

Review or update where required:

```text
src/lib/query/client.ts
src/app/providers.tsx
package.json
package-lock.json
.env.example
```

Add only small shared transport helpers under `src/api/` when genuinely necessary.

---

# 6. Explicitly Out of Scope

Do not implement:

```text
Dashboard API wrappers
Pipeline API wrappers
Final Results API wrappers
Manual Inputs API wrappers
Business Profile API wrappers
Service Taxonomy feature wrapper
Feature hooks
Feature query keys
Feature mutations
Polling
Forms
Feature view models
Feature mapping
Product screen API integration
Authentication
Authorization
Token storage
Refresh tokens
Third-party API calls from the browser
```

Phase 4 builds the transport foundation only.

---

# 7. Step 1 — Verify the Existing Baseline

Before editing, read:

```text
AGENTS.md
docs/api-contract.md
docs/frontend-architecture.md
docs/frontend-data-models-and-types.md
docs/coding-standards.md
docs/definition-of-done.md
```

Inspect:

```text
package.json
package-lock.json
.env.example
src/app/providers.tsx
src/lib/query/client.ts
src/api/
vite.config.ts
tsconfig.app.json
```

Inspect the approved OpenAPI snapshot.

Confirm:

```text
Snapshot exists
Public API paths already contain /api/v1
QueryClientProvider is already centralized
No existing API implementation needs to be unnecessarily replaced
```

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

Record any pre-existing failures before editing.

---

# 8. Step 2 — Configure OpenAPI Type Generation

Generated types belong at:

```text
src/api/generated/schema.d.ts
```

Generated files:

```text
Must come from the approved public OpenAPI snapshot
Must not be manually edited
Must be repository-tracked artifacts
Must not regenerate automatically during normal build
```

Generated backend request/response types remain authoritative at the API boundary.

---

# 9. Generation Command

Standardize the frontend workflow as:

```bash
npm run generate:api-types
```

Add an exact pinned development dependency:

```text
openapi-typescript
```

Do not use unpinned commands such as:

```bash
npx openapi-typescript ...
npx openapi-typescript@latest ...
```

The script must use the locally installed pinned version.

It must read:

```text
../keyword-research-automation/docs/openapi/public-openapi.json
```

and generate:

```text
src/api/generated/schema.d.ts
```

Normal:

```bash
npm run build
```

must not regenerate API types.

---

# 10. Generated Type Rules

After generation:

```text
Do not manually edit schema.d.ts
Do not recreate generated backend DTOs
Do not duplicate backend enums
Do not weaken generated types with any
```

Later feature API functions should consume generated:

```text
paths
operations
components
```

as appropriate.

Generated OpenAPI types provide compile-time contract safety.

They are not runtime validators.

---

# 11. Step 3 — API Base URL Configuration

The backend origin must come from:

```typescript
import.meta.env.VITE_API_BASE_URL
```

Do not use:

```text
VITE_API_URL
process.env
hard-coded localhost URLs
hard-coded staging URLs
hard-coded production URLs
```

The contract paths already contain:

```text
/api/v1
```

Do not duplicate `/api/v1` in both the base URL and endpoint path.

---

# 12. Lazy Environment Validation

Do not throw merely because `client.ts` was imported.

Provide a small configuration accessor that:

```text
Reads VITE_API_BASE_URL
Validates it on first API transport use
Normalizes it
Caches the normalized result
```

A valid API base URL must:

```text
Be an absolute URL
Use the http: or https: protocol
```

Normalize trailing `/` safely.

Example:

```text
https://api.example.com/
        ↓
https://api.example.com
```

Missing or invalid configuration must produce:

```text
ApiError
kind = "configuration"
```

Do not:

```text
Crash the application shell during module import
Fall back to window.location.origin
Fall back to localhost
Guess another backend origin
```

---

# 13. Step 4 — Define the Shared JSON Result Contract

The Shared API Client should not return the raw outer success envelope.

Use one consistent transport result:

```typescript
export interface ApiResult<TData, TMeta = unknown> {
  data: TData;
  meta: TMeta;
}
```

Flow:

```text
Backend Success Envelope
        ↓
Shared API Client
- validates common envelope
- removes outer status
        ↓
ApiResult<TData, TMeta>
        ↓
Feature API Function
        ↓
Returns data only
or
Returns data + metadata
```

This keeps transport metadata available without propagating the raw backend envelope throughout the application.

---

# 14. Runtime Success-Envelope Validation

Successful JSON responses use the common transport shape:

```json
{
  "status": "success",
  "data": {},
  "meta": {}
}
```

At runtime, the Shared API Client validates only the common transport structure:

```text
The response is a non-null object

status === "success"

The data property exists

The meta property exists

meta is a non-null object
```

Do not use truthiness checks for `data`.

These are potentially valid values:

```text
null
false
0
[]
""
```

Check property presence rather than value truthiness.

Generated OpenAPI types provide compile-time endpoint-specific validation.

The Shared API Client must not attempt to reproduce every generated endpoint schema as handwritten runtime validation.

Do not introduce a runtime schema-validation library solely for Phase 4.

---

# 15. Endpoint-Specific Metadata

The Shared API Client may structurally normalize:

```text
status
data
meta
```

but must not invent or reinterpret endpoint-specific metadata.

Feature API functions later decide whether their callers need:

```typescript
result.data
```

or:

```typescript
{
  data: result.data,
  meta: result.meta,
}
```

Do not assume every endpoint has identical pagination, request metadata, or other `meta` semantics.

---

# 16. Step 5 — Define ApiError

Create:

```text
src/api/errors.ts
```

Use a real `Error` subclass.

Conceptually:

```typescript
export type ApiErrorKind =
  | "api"
  | "network"
  | "cancelled"
  | "unexpected"
  | "configuration";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly detail?: unknown;
  readonly requestId?: string;
  readonly cause?: unknown;
}
```

The exact constructor design may follow project coding conventions, but these responsibilities must be preserved.

---

# 17. ApiError Rules

`ApiError` should preserve where available:

```text
Error kind
HTTP status
Backend error code
Safe backend message
Optional detail
Request ID
Original cause
```

HTTP status remains authoritative transport information.

`error.code` remains the stable backend machine-readable refinement.

`meta.request_id` should be preserved where supplied by the backend.

---

# 18. Error Safety Rules

UI code must never directly render:

```text
ApiError.detail
ApiError.cause
```

without explicit safe mapping.

Never expose:

```text
Stack traces
SQL
Database errors
Prompts
Provider payloads
Credentials
Tokens
Raw internal exceptions
Raw proxy error pages
Raw HTML error responses
```

Do not parse arbitrary `error.message` strings to drive business logic.

---

# 19. Error Classification

Use only transport-level kinds:

```text
api
network
cancelled
unexpected
configuration
```

Do not introduce feature-specific kinds such as:

```text
pipeline-active
publish-conflict
manual-input-invalid
export-limit-exceeded
```

Those interpretations belong to future feature modules.

---

# 20. Cancellation Detection

Support cancellation using both:

```text
AbortError
```

and:

```typescript
signal?.aborted
```

where applicable.

Cancellation must not be classified as:

```text
network failure
server failure
unexpected backend failure
```

Preserve the original cause where appropriate.

---

# 21. Step 6 — Create the Shared API Client

Create:

```text
src/api/client.ts
```

Use:

```text
native fetch
```

Do not add Axios or another HTTP library.

The client owns:

```text
Base URL joining
Request headers
JSON request serialization
HTTP method handling
Content-Type handling
Response inspection
JSON parsing
Common success-envelope validation
ApiResult creation
Error normalization
AbortSignal forwarding
Blob/non-JSON handling
```

Raw `fetch()` must not be scattered through React components or feature modules.

---

# 22. Request Option Contracts

Keep the shared transport options deliberately small.

Use a boundary equivalent to:

```typescript
export interface RequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface JsonRequestOptions<TBody = never>
  extends RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: TBody;
}
```

The exact implementation may vary slightly if TypeScript constraints require a safer representation, but preserve the responsibilities above.

Generated request-body types are supplied as `TBody` by future feature API wrappers.

The Shared API Client must not define feature request DTOs.

---

# 23. Request Method Rules

Support the methods currently required by the public contract:

```text
GET
POST
PATCH
DELETE
```

where applicable.

Extend the shared method type only when a future approved OpenAPI snapshot
introduces another method.

Rules:

```text
GET requests must not receive or transmit a request body.

Content-Type: application/json is added only when a JSON body is actually present.

No request body means no manufactured {} or null body.

Feature wrappers provide generated request-body types.

The Shared API Client does not know feature-specific request structures.
```

If a caller attempts an invalid GET-with-body combination, reject it deterministically rather than silently transmitting it.

---

# 24. JSON Request Handling

When a JSON body is actually present:

```text
JSON.stringify(body)
Content-Type: application/json
```

If there is no request body:

```text
Do not send {}
Do not send null
Do not manufacture a body
Do not unnecessarily add Content-Type
```

Do not globally force JSON content type for future:

```text
FormData
File
Blob
```

requests.

---

# 25. JSON Response Handling

Inspect:

```text
HTTP status
Content-Type
```

before deciding how to parse the response.

For expected JSON responses:

```text
Parse JSON
Validate common transport structure
Normalize success
Normalize API errors
```

If a response declares or is expected to be JSON but contains malformed JSON:

```text
Throw normalized ApiError
kind = "unexpected"
```

Do not return:

```text
undefined
{}
partial success
```

for malformed contract responses.

---

# 26. JSON API Error Handling

For non-success JSON responses, preserve where declared:

```text
HTTP status
error.code
error.message
error.detail
meta.request_id
```

Example:

```text
HTTP 409
+
PIPELINE_ALREADY_ACTIVE
```

remains transport information.

The future owning feature determines its UX meaning.

The Shared API Client must not contain:

```text
Pipeline rules
Publishing rules
Upload rules
Dashboard rules
Export business rules
```

---

# 27. Non-JSON HTTP Error Handling

A server, reverse proxy, CDN, or other HTTP intermediary may return a non-JSON error response such as:

```text
500 + text/plain
502 + text/html
503 + text/html
```

For a non-2xx HTTP response that does not contain a valid JSON error envelope:

```text
Preserve the HTTP status

Create ApiError with:
kind = "api"

Use a generic safe message

Do not expose the raw HTML response

Do not expose the raw plain-text response

Leave backend code undefined when unavailable

Leave requestId undefined when unavailable
```

Example:

```text
HTTP 502
text/html response
        ↓
ApiError {
  kind: "api",
  status: 502,
  code: undefined,
  requestId: undefined,
  message: <generic safe message>
}
```

A response is a network error only when no HTTP response was received.

Therefore:

```text
HTTP 502 received
→ api error

HTTP 503 received
→ api error

DNS failure
→ network error

Connection refused
→ network error

Browser offline / fetch connection failure
→ network error
```

This distinction must remain reliable because TanStack Query retry behavior depends on it.

---

# 28. Network Failure Handling

Browser/network failures such as:

```text
Offline
DNS failure
Connection refusal
Connection-level fetch failure
```

must become:

```text
ApiError
kind = "network"
```

Network failure means no usable HTTP response was received.

Do not classify an HTTP `4xx` or `5xx` response as a network failure merely because it represents a server-side problem.

---

# 29. Step 7 — Non-JSON / File Responses

The public API contains successful non-JSON responses such as CSV export.

Provide explicit file-response support.

Prefer:

```text
requestJson()
requestFile()
```

or another equally clear explicit transport API.

Do not try to infer every possible transport behavior through one overly generic public method.

---

# 30. ApiFileResult

Successful file responses should return:

```typescript
export interface ApiFileResult {
  blob: Blob;
  contentType?: string;
  contentDisposition?: string;
}
```

This preserves both:

```text
File content
Relevant response metadata
```

Filename parsing and browser download behavior belong to the future Final Results feature.

The Shared API Client must not trigger browser downloads itself.

---

# 31. Mixed File / JSON Error Responses

A file endpoint may return:

```text
2xx
→ text/csv

4xx
→ application/json error envelope
```

Therefore the transport must inspect:

```text
HTTP status
Content-Type
```

before choosing Blob versus JSON error handling.

Do not blindly call:

```typescript
response.blob()
```

for every response from a file endpoint.

If the file endpoint returns a non-JSON non-2xx response, apply the same safe non-JSON HTTP error rules defined earlier.

---

# 32. Step 8 — AbortSignal Support

Forward:

```typescript
signal
```

directly to native `fetch`.

All future feature API wrappers should be able to supply an `AbortSignal` through the shared request options.

Cancelled requests must:

```text
Not be retried
Not be shown as network failures
Not be interpreted as server failures
```

---

# 33. Step 9 — Query Serialization Foundation

Only add a shared query serializer if it is genuinely needed by the transport.

Rules:

```text
undefined → omit

false → preserve

0 → preserve

allowed empty string → preserve

strings → URL encode

numbers → serialize correctly

booleans → serialize correctly
```

Do not invent array encoding conventions.

Future array parameters must follow the OpenAPI contract:

```text
style
explode
```

Do not add feature-specific query rules during Phase 4.

---

# 34. Step 10 — Configure TanStack Query Defaults

Preserve:

```text
src/lib/query/client.ts
```

and:

```text
src/app/providers.tsx
```

Do not create a second `QueryClient`.

`QueryClientProvider` remains centralized in application providers.

---

# 35. Query Defaults

Keep only genuinely global behavior here.

Baseline:

```text
refetchOnWindowFocus → false

mutation retry → false
```

For queries, use a conservative transport-aware retry function.

Do not simply configure:

```text
retry: 3
```

for every failure type.

---

# 36. Query Retry Policy

Default query retry should behave approximately as:

```text
cancelled
→ never retry

configuration error
→ never retry

deterministic 4xx API response
→ never retry

network failure
→ limited retry

5xx API response
→ limited retry

unexpected malformed contract response
→ generally do not retry automatically unless deliberately justified
```

Keep the retry limit conservative.

Do not put feature codes such as:

```text
PIPELINE_ALREADY_ACTIVE
VALIDATION_ERROR
FINAL_RESULT_EXPORT_LIMIT_EXCEEDED
```

into the global QueryClient retry policy.

Feature hooks may later override global defaults when required.

---

# 37. Step 11 — Generate and Inspect API Types

Run:

```bash
npm run generate:api-types
```

Confirm:

```text
src/api/generated/schema.d.ts exists

File is non-empty

paths exists

operations exists

components exists
```

Confirm that generated routes match the approved frontend-public OpenAPI snapshot.

Never manually edit generated output to fix compilation.

---

# 38. Step 12 — Typed Smoke Request

Create one development/integration smoke request to prove:

```text
Generated OpenAPI Type
        ↓
Shared API Client
        ↓
Typed Transport Result
```

Use a simple read-only public operation.

The current public contract includes:

```text
GET /api/v1/service-taxonomy
```

which may be used for transport verification.

This does not mean implementing the Service Taxonomy feature.

---

# 39. Smoke Request Restrictions

Do not:

```text
Render taxonomy data on the real product screen

Create a Service Taxonomy feature hook

Create a Service Taxonomy production API abstraction

Connect production navigation to API behavior

Create mock success data
```

Keep runtime verification in:

```text
development-only code
existing test infrastructure
or another temporary non-production verification mechanism
```

Remove temporary runtime-only verification code before Phase 4 completion unless it becomes a legitimate reusable test.

---

# 40. Smoke Request Type Requirements

The smoke request must:

```text
Use generated OpenAPI types

Use Shared API Client

Use VITE_API_BASE_URL

Use the generated response contract

Support AbortSignal where relevant

Use normalized ApiError handling
```

Do not:

```text
Handwrite the backend DTO

Use any

Double-cast through unknown

Ignore the generated response shape
```

---

# 41. Runtime Smoke Check Is Conditional

Phase 4 completion does not require the backend runtime to be available.

Required:

```text
Typed read-only smoke request compiles through:

Generated OpenAPI Type
+
Shared API Client
```

When both are available:

```text
Backend runtime
Valid VITE_API_BASE_URL
```

execute the smoke request and record the result.

If unavailable:

```text
Report runtime verification as unavailable

Do not mock success

Do not classify external runtime unavailability as a Phase 4 implementation defect
```

---

# 42. Step 13 — Transport Verification

The repository currently has no automated test runner.

Do not add a new testing framework solely for Phase 4.

Use the safest available deterministic verification for:

```text
JSON success

Falsey JSON success data

Missing success-envelope properties

JSON API error

request_id preservation

Malformed JSON

Non-JSON HTTP error

HTTP 5xx versus network-failure classification

Network error normalization

Abort/cancellation normalization

Blob/file success

JSON error from file endpoint

Non-JSON error from file endpoint

GET-with-body protection

Query serialization basics
```

If an existing test mechanism becomes available during implementation, focused tests may be added without unnecessarily expanding the dependency footprint.

---

# 43. `.env.example`

Ensure:

```env
VITE_API_BASE_URL=
```

remains documented.

Do not add:

```text
Secrets
API credentials
Provider keys
Bearer tokens
Production private values
```

Anything stored in a Vite environment variable must be considered browser-visible.

---

# 44. Authentication Guardrail

Do not add:

```text
Authorization headers
Bearer token management
Login state
Refresh tokens
Protected API wrappers
Session infrastructure
```

Authentication was not part of the Phase 4 delivery. Phase 11C later added
single-user cookie-session authentication on top of this centralized transport
without changing the historical Phase 4 scope.

---

# 45. Expected Structure

```text
src/
├── api/
│   ├── generated/
│   │   └── schema.d.ts
│   ├── client.ts
│   └── errors.ts
│
├── lib/
│   └── query/
│       └── client.ts
│
└── app/
    └── providers.tsx
```

Likely package changes:

```text
package.json
package-lock.json
```

Expected dependency addition:

```text
openapi-typescript
```

as an exact pinned:

```text
devDependency
```

No new runtime HTTP dependency should be added.

---

# 46. Dependency Rules

Allowed:

```text
Pinned openapi-typescript devDependency
```

Do not add:

```text
Axios
ky
SWR
Another query library
Runtime OpenAPI client generator
Another state library
Runtime schema-validation library solely for this phase
```

Use:

```text
native fetch
TanStack Query
generated TypeScript contract types
```

---

# 47. Verification Sequence

Before implementation:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

After implementation:

```bash
npm run generate:api-types
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit
```

`npm audit` should remain:

```text
0 vulnerabilities
```

---

# 48. Manual / Development Verification

Verify:

```text
Generated schema exists and is non-empty

No generated file was manually edited

VITE_API_BASE_URL is lazily validated

Missing base URL does not crash the shell during module import

Missing/invalid base URL produces configuration ApiError when transport is used

Only absolute http:/https: base URLs are accepted

Trailing slash normalization works

/api/v1 is not duplicated

JSON success validates the common envelope

status must equal "success"

data property presence is checked rather than truthiness

Valid null/false/0/[]/"" data is preserved

meta must exist as a non-null object

No handwritten endpoint runtime schemas were introduced

ApiResult returns { data, meta }

GET requests do not transmit bodies

JSON Content-Type is added only when a body exists

JSON API errors normalize correctly

request_id is preserved

Non-JSON HTTP errors preserve status but not unsafe raw content

HTTP 5xx responses differ from network failures

Network failure differs from API failure

Cancellation differs from network failure

AbortSignal is forwarded

Malformed JSON becomes unexpected ApiError

Successful file response returns ApiFileResult

JSON error from a file endpoint normalizes as ApiError

Non-JSON HTTP error from a file endpoint normalizes safely

QueryClient provider remains centralized

No product screen behavior changes
```

---

# 49. Runtime Integration Check

When a backend runtime is available:

1. Configure local environment:

```env
VITE_API_BASE_URL=<approved local backend origin>
```

2. Execute the typed read-only smoke request.

3. Confirm:

```text
Correct endpoint is requested

No duplicate /api/v1 exists

Common response envelope validates

ApiResult contains typed data/meta

No unexpected browser/runtime error occurs
```

4. Verify request cancellation when practical.

If the backend or valid environment configuration is unavailable, record:

```text
Runtime integration verification unavailable
```

and continue with compile-time and transport completion.

---

# 50. Final Diff Review

Run:

```bash
git status --short
git diff --stat
```

Review relevant changes including:

```text
package.json
package-lock.json
src/api/client.ts
src/api/errors.ts
src/api/generated/schema.d.ts
src/lib/query/client.ts
src/app/providers.tsx
.env.example
```

Confirm:

```text
No feature API wrapper added

No feature hook added

No product screen connected to backend

No raw fetch inside React components

No backend DTO manually recreated

No generated file manually edited

No handwritten endpoint runtime schemas

No hard-coded backend origin

No duplicate /api/v1 logic

No authentication infrastructure

No secret added

No feature business logic

No Axios or competing HTTP client

No unnecessary runtime validation dependency

No Phase 0–3 regression
```

Preserve unrelated worktree changes.

Do not commit or push unless explicitly authorized.

---

# 51. Implementation Sequence

```text
1. Read AGENTS.md and approved frontend documentation
        ↓
2. Verify Phase 3 baseline
        ↓
3. Inspect approved OpenAPI snapshot
        ↓
4. Pin openapi-typescript
        ↓
5. Add generate:api-types script
        ↓
6. Generate schema.d.ts
        ↓
7. Implement lazy VITE_API_BASE_URL configuration
        ↓
8. Implement ApiError
        ↓
9. Implement ApiResult
        ↓
10. Define small typed request-option boundaries
        ↓
11. Implement shared native-fetch JSON client
        ↓
12. Add common success-envelope validation
        ↓
13. Add JSON API error normalization
        ↓
14. Add safe non-JSON HTTP error normalization
        ↓
15. Add AbortSignal + cancellation/network handling
        ↓
16. Add ApiFileResult and explicit file handling
        ↓
17. Add minimal query serialization if required
        ↓
18. Configure QueryClient retry defaults
        ↓
19. Add typed smoke-request compile verification
        ↓
20. Execute runtime smoke request when backend is available
        ↓
21. Run typecheck + lint + format:check + build + audit
        ↓
22. Review final diff
```

---

# 52. Completion Criteria

Phase 4 is complete only when:

```text
src/api/generated/schema.d.ts is generated from the approved snapshot

npm run generate:api-types works

openapi-typescript is exactly pinned

Generated API files are not manually edited

Generated OpenAPI types provide endpoint-specific compile-time contracts

No handwritten duplicate endpoint runtime schemas were introduced

VITE_API_BASE_URL is centralized

Base URL validation is lazy

Only absolute http:/https: API origins are accepted

Missing/invalid configuration produces configuration ApiError

Importing the API client does not crash the application shell

src/api/client.ts exists

src/api/errors.ts exists

Native fetch is the only HTTP transport

ApiError extends Error

ApiError distinguishes:
api
network
cancelled
unexpected
configuration

ApiError preserves status/code/requestId where available

Cause is preserved where appropriate

Cancellation detects AbortError and signal.aborted

UI is not expected to expose detail/cause directly

ApiResult<TData, TMeta> is the JSON success return boundary

Runtime success validation checks only the common transport envelope

Successful status must equal "success"

Data property presence is checked without truthiness assumptions

Falsey valid data values are preserved

Meta exists as a non-null object

Outer success status is removed before the transport result is returned

JsonRequestOptions supports the required HTTP methods and typed bodies

Generated request-body types can be supplied as TBody by future feature wrappers

GET requests cannot transmit request bodies

JSON Content-Type is added only when a JSON body exists

JSON error envelopes normalize centrally

Non-JSON HTTP failures remain API errors and preserve HTTP status

Raw HTML/plain-text HTTP error content is never exposed

A received HTTP 5xx response is not misclassified as a network failure

A network error represents failure without a usable HTTP response

Malformed expected JSON becomes unexpected ApiError

AbortSignal is supported

ApiFileResult returns:
blob
contentType
contentDisposition

JSON errors from file endpoints remain normalized ApiErrors

Non-JSON errors from file endpoints are safely normalized

QueryClientProvider remains centralized

Global query retries are conservative and transport-aware

Cancelled/configuration/deterministic 4xx errors are not globally retried

Network and 5xx failures may receive limited retry

Mutations are not retried globally

No feature-specific API wrapper was added

No product screen was connected to backend data

Typed read-only smoke request compiles through generated contract + Shared API Client

Runtime smoke request is executed only when backend and valid environment are available

External runtime unavailability is reported rather than mocked

TypeScript passes

ESLint passes

Format check passes

Production build passes

npm audit remains clean

No known blocking implementation defect remains
```

Milestone:

```text
Approved OpenAPI Snapshot
        ↓
Generated Types
        ↓
Shared Native-Fetch Client
        ↓
ApiResult / ApiFileResult
        ↓
Normalized ApiError
        ↓
TanStack Query Foundation
        ↓
Ready for Feature API Integration
```
