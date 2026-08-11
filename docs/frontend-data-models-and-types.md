# Frontend Data Models & Types

> [!info] Document Status
> **Status:** MVP Frontend Type Strategy
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define how backend-generated API types, frontend-owned types, feature models, filters, form values, and display mappings are organized and used.

---

# 1. Type Strategy

The frontend uses two main categories of types:

```text
Generated API Types
        +
Frontend-Owned Types
```

Generated API types represent the backend contract.

Frontend-owned types represent UI-specific state, display models, forms, filters, and derived frontend behaviour.

---

# 2. Source of Truth

Backend request and response types must come from:

```text
src/api/generated/
```

Example:

```text
src/api/generated/schema.d.ts
```

Generated files must not be manually edited.

Do not manually duplicate backend DTOs unless the frontend genuinely needs a different model.

The Shared API Client owns transport-level types and behavior for success
envelopes, response metadata, pagination metadata, normalized API errors, and
CSV/file responses. Feature components should receive feature data or
normalized errors rather than raw transport envelopes.

---

# 3. Type Ownership

Recommended structure:

```text
src/
│
├── api/
│   └── generated/
│
├── types/
│
└── features/
    ├── dashboard/
    │   └── types/
    ├── final-results/
    │   └── types/
    ├── manual-inputs/
    │   └── types/
    ├── business-profile/
    │   └── types/
    └── service-taxonomy/
        └── types/
```

---

# 4. Generated API Types

Use generated types directly for:

```text
API Request Bodies
API Response Bodies
Backend Enums
Pagination Responses
Validation Responses
Endpoint Parameters
```

Example conceptually:

```typescript
type FinalResultsResponse =
  components["schemas"]["FinalResultsResponse"]
```

Exact generated names depend on the OpenAPI generator output.

---

# 5. Frontend-Owned Types

Frontend-owned types are appropriate for:

```text
UI state
Filter state
Route state
Form values
Display labels
Derived view models
Component props
Local expansion state
Frontend-only configuration
```

These should not redefine backend business rules.

---

# 6. Shared Frontend Types

Location:

```text
src/types/
```

Only genuinely cross-feature types belong here.

Examples:

```typescript
type AsyncState =
  | "idle"
  | "loading"
  | "success"
  | "error"
```

or:

```typescript
interface SelectOption<T = string> {
  label: string
  value: T
}
```

Do not turn `src/types/` into a dumping ground for feature-specific models.

---

# 7. Feature-Specific Types

Feature-owned types should remain close to the feature.

Example:

```text
src/features/final-results/types/
```

Possible contents:

```text
FinalResultsFilters
FinalResultsTab
PublishStatusDisplay
UrgencyDisplay
FinalResultViewModel
```

---

# 8. API Type vs UI Model

API responses and UI models are not automatically the same.

Use mapping only when the UI needs a different representation.

Conceptually:

```text
Generated API Type
      ↓
Optional Mapper
      ↓
Frontend View Model
      ↓
Component
```

Avoid mapping layers where the generated API type already fits the UI.

---

# 9. Display Mapping

Backend values and frontend labels must remain separate.

Example:

```typescript
const manualInputStatusLabels = {
  pending: "Ready for Next Run",
  promoted: "Used in Previous Run",
  invalid: "Invalid",
  cancelled: "Cancelled",
} as const
```

Backend value:

```text
pending
```

Frontend label:

```text
Ready for Next Run
```

The label must never replace the actual backend value in requests.

---

# 10. Pipeline Execution Types

Known execution values:

```text
queued
running
completed
partial
failed
abandoned
```

Where possible, use the generated backend type.

Frontend-only grouping may be defined separately:

```typescript
type PipelineExecutionGroup =
  | "active"
  | "terminal"
```

Mapping:

```text
Active:
queued
running

Terminal:
completed
partial
failed
abandoned
```

This grouping is frontend presentation logic, not a replacement backend enum.

---

# 11. Pipeline Stage Types

Known stage states:

```text
pending
running
completed
interrupted
partial
failed
superseded
```

Backend stage identifiers:

```text
collection
ai_pass1a
ai_pass1b
seo_enrichment
ai_pass2
ranking
```

Frontend stage labels should be maintained through display mapping.

Example:

```typescript
const pipelineStageLabels = {
  collection: "Collecting Data",
  ai_pass1a: "Filtering Relevance & Generating Keywords",
  ai_pass1b: "Grouping Similar Keywords",
  seo_enrichment: "Extracting SEO Data",
  ai_pass2: "Evaluating & Filtering Keywords",
  ranking: "Preparing Final Results",
} as const
```

---

# 12. Final Results Types

Feature location:

```text
src/features/final-results/types/
```

Potential frontend-owned types:

```typescript
type FinalResultsTab =
  | "latest"
  | "history"
```

```typescript
interface FinalResultsFilters {
  pipelineExecutionId?: string
  excludePipelineExecutionId?: string
  serviceAreaId?: number
  serviceOfferingId?: number
  search?: string
  urgency?: string
  relevanceMin?: number
  relevanceMax?: number
  selectionStatus?: GeneratedSelectionStatus
  publishStatus?: GeneratedPublishStatus[]
  rankMin?: number
  rankMax?: number
  page: number
  pageSize: number
  sortBy?: string
  sortDirection?: "asc" | "desc"
}
```

Frontend camelCase fields are mapped to exact backend query parameters such as
`pipeline_execution_id`, `exclude_pipeline_execution_id`, `sort_by`, and
`sort_direction`. `GeneratedSelectionStatus` and `GeneratedPublishStatus` are
conceptual aliases for the corresponding generated OpenAPI types.

---

# 13. Publish Status Types

Known values:

```text
Pending
Approved
Published
Reject
```

Use the generated backend type where available.

Frontend display metadata may be defined separately:

```typescript
interface PublishStatusPresentation {
  label: string
  variant: "neutral" | "positive" | "success" | "destructive"
}
```

This presentation type must not determine allowed transitions.

---

# 14. Urgency Types

Current frontend options:

```text
high
medium
low
```

The API currently treats urgency as an open string.

Therefore the frontend should avoid defining a strict backend-equivalent enum that could reject unknown server values.

Recommended:

```typescript
type KnownUrgency =
  | "high"
  | "medium"
  | "low"
```

Use this only for known frontend options.

Unknown backend values must still be handled safely.

---

# 15. Final Result View Model

Create a frontend view model only if required for display.

Example:

```typescript
interface FinalResultViewModel {
  rowId: number
  keyword: string
  topicTitle: string
  articleAngle?: string | null
  whyRelevant?: string | null
  contentType?: string | null
  searchIntent?: string | null
  urgency?: string | null
  publishStatus?: string | null
  runDate?: string | null
}
```

This is optional.

Prefer generated types directly if they already provide the required shape.

---

# 16. Final Results Route State

URL-backed state may require a frontend type.

Example:

```typescript
interface FinalResultsRouteState {
  tab: "latest" | "history"
  run?: string
  page?: number
}
```

Only URL-persisted state belongs here.

Temporary modal/dropdown state remains local React state.

---

# 17. Manual Input Types

Feature location:

```text
src/features/manual-inputs/types/
```

Known backend statuses:

```text
pending
promoted
invalid
cancelled
```

Known backend sources:

```text
manual_entry
manual_excel
```

Use generated types where available.

---

# 18. Manual Input Form Values

Form values may differ from API request shape.

Example:

```typescript
interface ManualInputFormValues {
  inputText: string
  gist?: string
  additionalDetails: AdditionalDetailField[]
}
```

Frontend form field:

```typescript
interface AdditionalDetailField {
  key: string
  value: string
}
```

Before API submission:

```text
ManualInputFormValues
      ↓
Mapper
      ↓
Backend Request
```

Current mapping:

```text
inputText          → raw_text
gist               → gist
additionalDetails  → extra_data
```

---

# 19. Manual Input Filters

Example frontend filter state:

```typescript
interface ManualInputFilters {
  keyword?: string
  status?: string
  source?: string
  page: number
  pageSize: number
}
```

Default:

```typescript
status = "pending"
```

User-facing label:

```text
Ready for Next Run
```

---

# 20. Manual Input Summary

Dashboard summary values should use backend-provided data.

Possible concepts:

```typescript
interface ManualInputSummaryView {
  readyCount: number
  invalidCount?: number
  totalUnprocessedCount?: number
}
```

Do not derive `readyCount` from visible table rows.

---

# 21. Business Profile Types

Feature location:

```text
src/features/business-profile/types/
```

Frontend view types may include:

```typescript
interface BusinessProfileCategoryView {
  id: number
  name: string
  entryCount: number
}
```

```typescript
interface BusinessProfileEntryView {
  id: number
  value: string
}
```

Use actual generated identifier types where available.

---

# 22. Business Profile UI State

Expansion state is frontend-only.

Example:

```typescript
type ExpandedCategoryState =
  Record<string, boolean>
```

This state should not be persisted to the backend.

---

# 23. Service Taxonomy Types

Feature location:

```text
src/features/service-taxonomy/types/
```

Conceptual hierarchy:

```typescript
interface ServiceAreaView {
  serviceAreaId: number
  name: string
  offerings: ServiceOfferingView[]
}
```

```typescript
interface ServiceOfferingView {
  serviceOfferingId: number
  name: string
  seoQuery: string
}
```

Use generated backend types directly where practical.

---

# 24. Taxonomy UI State

Frontend-only expansion state may use:

```typescript
type ExpandedServiceAreas =
  Set<string>
```

or:

```typescript
Record<string, boolean>
```

Exact implementation may be selected during development.

Search state remains separate from backend data.

---

# 25. Pagination Types

Prefer backend-generated pagination response types.

Frontend query state may use:

```typescript
interface PaginationState {
  page: number
  pageSize: number
}
```

Do not create a second pagination response schema if the backend-generated type already exists.

---

# 26. Sort Types

Use backend-supported sort values wherever possible.

Frontend may use:

```typescript
interface SortState {
  sortBy?: string
  direction?: "asc" | "desc"
}
```

Do not define unsupported sort fields.

---

# 27. Filter Types

Feature filters should be explicit rather than generic catch-all objects.

Prefer:

```typescript
interface FinalResultsFilters {
  search?: string
  urgency?: string
  publishStatus?: GeneratedPublishStatus[]
}
```

This is only a partial example; the feature's complete filter type must also
cover execution, taxonomy, relevance, selection, rank, pagination, and sort
fields defined by the API Contract.

Avoid:

```typescript
Record<string, any>
```

for feature filters.

---

# 28. Form Types

Form values should be frontend-owned types.

Examples:

```text
ManualInputFormValues
AddCategoryFormValues
AddEntryFormValues
```

Do not use API response models as form state unless the shapes genuinely match.

---

# 29. Component Prop Types

Component props should remain close to the component unless reused.

Example:

```typescript
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}
```

Avoid centralizing all component props into one global types file.

---

# 30. Nullable Values

Generated API nullability must be preserved.

Avoid unsafe assumptions such as:

```typescript
result.topicTitle!
```

unless guaranteed by the contract.

Use explicit handling:

```typescript
result.topicTitle ?? "—"
```

where appropriate.

---

# 31. Unknown Backend Values

Frontend types must allow safe handling of contract drift.

Do not create overly strict local unions for backend fields that OpenAPI defines as open strings.

For unknown values:

```text
Preserve
Display safely
Use neutral fallback
Do not crash
```

---

# 32. Identifier Types

Do not derive or invent identifiers.

Use backend-returned identifiers such as:

```text
row_id
pipeline_execution_id
intake_id
category_id
entry_id
```

where required.

For example:

```text
Publish Status Update
→ use backend row_id
```

Do not substitute another related ID.

Public entity IDs such as `row_id`, `intake_id`, `category_id`, `entry_id`,
`service_area_id`, and `service_offering_id` are integers in the current
OpenAPI contract. `pipeline_execution_id` is a UUID string. Prefer the
generated types at API boundaries and preserve these distinctions in any
frontend view model.

---

# 33. Date and Time Types

Keep backend timestamps as strings at the API boundary unless there is a clear need to convert them.

Example:

```typescript
type ApiTimestamp = string
```

Convert only for presentation:

```text
API Timestamp
      ↓
Date Formatter
      ↓
Display String
```

Do not store formatted display strings as authoritative data.

---

# 34. Mapper Functions

Mapper functions should be used only when needed.

Examples:

```typescript
mapManualInputFormToRequest()
mapFinalResultToViewModel()
mapServiceTaxonomyToView()
```

Avoid introducing mappers merely to rename every backend property.

Use them when they provide a meaningful frontend boundary.

---

# 35. Constants vs Types

Use types for allowed structure.

Use constants for display mappings.

Example:

```typescript
type FinalResultsTab =
  | "latest"
  | "history"
```

```typescript
const FINAL_RESULTS_TAB_LABELS = {
  latest: "Latest Results",
  history: "History",
} as const
```

Do not use duplicated magic strings throughout feature components.

---

# 36. Type Imports

Prefer type-only imports where appropriate.

Example:

```typescript
import type { FinalResultViewModel } from "../types"
```

This makes runtime and type dependencies clearer.

---

# 37. Avoid `any`

Avoid:

```typescript
any
```

Prefer:

```text
Generated types
Explicit interfaces
unknown
Generic types
```

Use `unknown` when data has not yet been validated or narrowed.

---

# 38. Type Guards

Use type guards when handling unknown external values.

Example:

```typescript
function isKnownUrgency(value: string): value is KnownUrgency {
  return ["high", "medium", "low"].includes(value)
}
```

Unknown values must still receive safe fallback behaviour.

---

# 39. Derived UI Types

Frontend-derived state may use types that do not exist in the backend.

Examples:

```text
PipelineExecutionGroup
FinalResultsTab
ExpandedCategoryState
ExpandedServiceAreas
FilterState
ModalState
```

These types should remain clearly frontend-owned.

---

# 40. Type Naming

Recommended naming:

```text
*Response
*Request
```

for generated/API concepts where generator naming supports it.

Frontend-owned:

```text
*ViewModel
*FormValues
*Filters
*RouteState
*Presentation
*Props
```

Avoid ambiguous names such as:

```text
Data
Item
Info
Object
```

where a specific domain name is available.

---

# 41. Type Guardrails

1. OpenAPI-generated types remain authoritative for backend contracts.
2. Never manually edit generated types.
3. Do not duplicate backend DTOs unnecessarily.
4. Keep frontend-only types separate from generated API types.
5. Keep feature-specific types inside their feature.
6. Put only genuinely shared frontend types in `src/types/`.
7. Preserve backend enum values separately from display labels.
8. Do not over-constrain backend open-string fields.
9. Handle unknown values safely.
10. Preserve backend nullability.
11. Do not invent identifiers.
12. Use frontend form models when form shape differs from API request shape.
13. Use mappers only where they add value.
14. Avoid `any`.
15. Prefer explicit filter and form types over generic objects.
16. Keep component prop types close to their components.
17. Do not store formatted display values as authoritative application data.

---

# 42. Type Strategy Summary

```text
OpenAPI
    ↓
Generated API Types
    ↓
Feature API Functions
    ↓
Optional Mapping
    ↓
Frontend Feature Types
    ↓
Components
```

Frontend-owned types mainly cover:

```text
View Models
Forms
Filters
Route State
Display Mapping
Component Props
Local UI State
```

---

# 43. Related Documents

```text
01. Product Scope & Screen Inventory
02. Frontend Tech Stack
03. Frontend Architecture
04. Design System
05. UX Behaviour Rules
06. Detailed Screen Specifications
07. Component Inventory
08. API Contract
09. Frontend Data Models & Types
10. Form & Validation Specification
11. Responsive & Accessibility Guidelines
12. Coding Standards
13. Testing Strategy
14. Performance & Security
15. Environment & Deployment
16. Definition of Done
```

This document defines **how frontend-owned types are structured and how they relate to generated backend API types**.

The next document should define field-level validation, form rules, and submission requirements:

```text
10 - Form & Validation Specification.md
```
