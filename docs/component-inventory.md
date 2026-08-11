Below is the Obsidian-ready `Component Inventory.md`.

# Component Inventory

> [!info] Document Status
> **Status:** Approved direction for MVP Component Structure
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define the reusable UI primitives, shared application components, and feature-specific components required to build the current frontend screens.

---

# 1. Component Classification

Components are divided into three levels:

```text
UI Primitives
      ↓
Shared Application Components
      ↓
Feature-Specific Components
```

## UI Primitives

Low-level reusable elements based mainly on shadcn/ui.

Location:

```text
src/components/ui/
```

## Shared Application Components

Reusable components used by multiple features.

Location:

```text
src/components/shared/
```

## Feature-Specific Components

Components that belong to one business feature.

Location:

```text
src/features/<feature>/components/
```

---

# 2. Component Ownership Rule

A component should remain inside its feature unless genuine cross-feature reuse exists.

Do not move a component into `shared/` only because it may theoretically be reusable later.

Example:

```text
PublishStatusSelect
```

belongs to:

```text
features/final-results/
```

not:

```text
components/shared/
```

---

# 3. UI Primitive Inventory

Location:

```text
src/components/ui/
```

| Component     | Source    | Purpose                        |
| ------------- | --------- | ------------------------------ |
| Button        | shadcn/ui | Standard application actions   |
| Input         | shadcn/ui | Single-line text input         |
| Textarea      | shadcn/ui | Multi-line input               |
| Select        | shadcn/ui | Dropdown selection             |
| Dialog        | shadcn/ui | Modal interactions             |
| Alert Dialog  | shadcn/ui | Destructive confirmation       |
| Tabs          | shadcn/ui | Tab navigation                 |
| Tooltip       | shadcn/ui | Supporting information         |
| Dropdown Menu | shadcn/ui | Context actions where required |
| Badge         | shadcn/ui | Status and urgency display     |
| Skeleton      | shadcn/ui | Loading placeholders           |
| Separator     | shadcn/ui | Lightweight content separation |
| Checkbox      | shadcn/ui | Selection where required       |
| Label         | shadcn/ui | Accessible form labels         |
| Toast         | shadcn-compatible | Lightweight feedback       |
| Toaster       | shadcn-compatible | Toast container            |

Only install/add primitives that are actually required.

---

# 4. Shared Layout Components

Location:

```text
src/layouts/
```

## AppLayout

Primary application layout.

Contains:

```text
Navigation
Main Content Area
Optional Header
```

Used by all five primary screens.

---

# 5. Shared Application Components

Location:

```text
src/components/shared/
```

---

## PageHeader

Used on primary screens.

Responsibilities:

```text
Page title
Short description
Optional actions
```

Used by:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

---

## AppNavigation

Primary application navigation.

Items:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Responsibilities:

* active route indication;
* navigation between screens;
* keyboard accessibility.

---

## SearchInput

Reusable search control.

Responsibilities:

* search value;
* clear action;
* search icon;
* debounce support where required.

Used by:

```text
Final Results
Manual Inputs
Service Taxonomy
```

Search behaviour remains feature-specific.

---

## FilterSelect

Reusable filter dropdown wrapper.

Used for:

```text
Urgency
Publish Status
Manual Input Status
Manual Input Source
```

Responsibilities:

* consistent filter appearance;
* selected value;
* clear/default state.

---

## StatusBadge

Shared visual status presentation.

May support multiple status domains:

```text
Pipeline execution
Pipeline stage
Manual Input
```

Feature-specific status mapping should be supplied by the owning feature.

Do not put business transition logic inside this component.

The component should receive a display label and visual variant from the
owning feature. It must not own mappings between backend status domains and
frontend labels.

---

---

## EmptyState

Reusable empty-state presentation.

Supports:

```text
Title
Description
Optional action
```

Examples:

```text
No data exists
No results match filters
No open work
```

---

## ErrorState

Reusable section/page error presentation.

Supports:

```text
User-safe message
Optional Retry action
```

Must not display raw backend technical errors.

---

## LoadingState

Reusable local loading presentation.

May use:

```text
Skeleton
Spinner
Loading text
```

Use at the smallest relevant section.

---

## ConfirmDialog

Reusable destructive confirmation wrapper.

Supports:

```text
Title
Description
Cancel
Confirm
Loading state
```

Used where product requirements explicitly require confirmation.

---

## Pagination

Shared pagination control.

Responsibilities:

```text
Current page
Total pages
Previous
Next
Optional page numbers
Result range
```

Feature owns the actual server pagination state.

---

## SectionHeader

Optional shared section-level heading component.

Supports:

```text
Title
Description
Optional action
Optional count
```

Useful for sections such as:

```text
Latest Pipeline Run
Open Items from Previous Runs
Recent Pipeline Runs
```

---

## DataTableShell

Shared table presentation wrapper.

Responsibilities may include:

```text
Table container
Loading state
Empty state
Error state
Pagination area
```

It should not contain feature-specific columns or backend logic.

It owns generic table presentation concerns such as loading, empty, error,
and pagination-container states. Feature tables own columns, rows, filtering
and sorting mappings, row actions, and backend query behavior.

A full generic data-table abstraction is not required unless actual reuse justifies it.

---

# 6. Dashboard Components

Location:

```text
src/features/dashboard/components/
```

---

## ManualInputSummary

Displays the number of Manual Inputs ready for the next pipeline run.

Example:

```text
27 Inputs Ready for Next Run
```

May provide navigation to Manual Inputs.

---

## StartPipelineButton

Starts the keyword research pipeline.

Responsibilities:

* trigger Manual Input reminder;
* loading state;
* duplicate submission protection.

It must not independently determine whether the pipeline may start.

---

## ManualInputReminderDialog

Shown before pipeline start.

Responsibilities:

```text
Ready Input count
Continue action
Navigate to Manual Inputs
Cancel
```

---

## PipelineStatusCard

Displays current pipeline execution state, distinct from individual stage
state.

Possible states:

```text
Queued
Running
Completed
Partial
Failed
Abandoned
```

Backend values remain authoritative.

---

## PipelineStageProgress

Displays marketing-facing pipeline stages, distinct from execution status.

Stages:

```text
Collecting Data
Filtering Relevance & Generating Keywords
Grouping Similar Keywords
Extracting SEO Data
Evaluating & Filtering Keywords
Preparing Final Results
```

Responsibilities:

* display backend-returned stage states;
* visually distinguish completed/running/pending/etc.;
* never generate percentage progress.

---

## PipelineStageItem

Represents one stage inside `PipelineStageProgress`.

Displays:

```text
Stage label
Stage status
Optional state icon
```

Dashboard keeps execution-status mapping separate from stage-status mapping:

```text
PipelineStatusCard → queued, running, completed, partial, failed, abandoned
PipelineStageItem  → pending, running, completed, interrupted, partial,
                     failed, superseded
```

Backend values remain authoritative; feature-level display mappings provide
the approved user-facing labels.

---

## LatestPipelineRunCard

Displays latest completed pipeline execution.

Contains:

```text
Run date
Execution status
Final Results count
View Final Results
```

---

## RecentPipelineRunsTable

Displays recent previous executions.

Possible columns:

```text
Run Date
Status
Final Results
Action
```

The currently active execution must not be duplicated here.

---

# 7. Final Results Components

Location:

```text
src/features/final-results/components/
```

---

## FinalResultsTabs

Tabs:

```text
Latest Results
History
```

Controls feature scope and URL-backed tab state where required.

---

## FinalResultsToolbar

Contains:

```text
Search
Urgency Filter
Publish Status Filter
Export CSV
```

Exact filter scope depends on the current Final Results section.

---

## FinalResultsTable

Primary recommendation table.

Columns:

```text
Keyword
Topic Title
Article Angle
Why Relevant
Content Type
Search Intent
Urgency
Publish Status
```

History additionally includes:

```text
Run Date
```

Server controls filtering, ordering, and pagination.

---

## PublishStatusSelect

Feature-specific status control.

Responsibilities:

* display current status;
* offer backend-supported transitions;
* protect duplicate mutation;
* restore confirmed state on failure.

Terminal statuses:

```text
Published
Reject
```

---

## FinalResultStatusBadge

Displays Publish Status when editing is unavailable.

May render:

```text
Pending
Approved
Published
Reject
```

---

## UrgencyBadge

Displays:

```text
High
Medium
Low
```

Keep feature-specific unless reused elsewhere.

---

## ExpandableTableText

Used for long fields such as:

```text
Article Angle
Why Relevant
```

Supports:

```text
Line clamp
Show More
Show Less
```

---

## LatestRunResultsSection

Contains:

```text
Latest run metadata
Toolbar
Final Results table
```

Maximum expected results from one pipeline run:

```text
10
```

---

## OpenItemsSection

Contains unfinished results from previous runs.

Base statuses:

```text
Pending
Approved
```

Latest execution is excluded.

---

## HistoryResultsSection

Displays unified historical Final Results.

Supports:

```text
Search
Filters
Pagination
Optional selected run filter
```

---

## ActiveRunFilterNotice

Shown when Dashboard deep-links to a selected pipeline run.

Example:

```text
Viewing results from 3 Aug 2026

[Clear Run Filter]
```

---

## ExportCsvButton

Handles Final Results CSV export.

Responsibilities:

* use current dataset scope;
* prevent duplicate exports;
* display progress;
* handle export limit errors;
* trigger browser download.

---

# 8. Manual Inputs Components

Location:

```text
src/features/manual-inputs/components/
```

---

## ManualInputReadySummary

Displays:

```text
Ready for Next Run count
```

---

## ManualInputsToolbar

Contains:

```text
Search
Status Filter
Source Filter
Upload Excel
Add Manual Input
```

---

## ManualInputsTable

Displays Manual Input records.

Potential columns should follow the approved screen specification and backend contract.

Responsibilities:

* loading;
* filtering;
* pagination;
* status display.

---

## ManualInputStatusBadge

Maps backend statuses to approved frontend labels.

Example:

```text
pending → Ready for Next Run
promoted → Used in Previous Run
invalid → Invalid
cancelled → Cancelled
```

The feature supplies this mapping to the shared status presentation component;
the shared component must not contain Manual Input business rules.

---

## AddManualInputDialog

Modal wrapper for Manual Input creation.

Contains:

```text
AddManualInputForm
```

---

## AddManualInputForm

Fields:

```text
Input Text
Summary / Gist
Additional Details
```

Uses:

```text
React Hook Form
Zod where appropriate
```

---

## AdditionalDetailsEditor

Allows users to enter structured field/value information without manually writing JSON.

Example:

```text
Target Country | Japan
Service        | BIS
```

Supports adding/removing field-value rows if required by the final form specification.

---

## UploadExcelDialog

Handles Excel selection and upload.

Contains:

```text
File selection
Upload action
Loading state
Upload result
```

---

## UploadResultSummary

Displays results such as:

```text
Ready records
Invalid records
```

Must not imply invalid records were successfully accepted.

---

## ManualInputValidationInfo

Displays backend-provided validation information for invalid records.

Must remain user-safe and avoid exposing backend internals.

---

# 9. Business Profile Components

Location:

```text
src/features/business-profile/components/
```

---

## BusinessProfileCategoryList

Renders all categories.

Responsibilities:

* categories remain visible;
* category ordering follows backend/product rules.

---

## BusinessProfileCategoryCard

Represents one category.

Contains:

```text
Category Name
Entry Count
Entries toggle
Add Entry
Delete Category
```

---

## CategoryEntriesToggle

Controls expansion/collapse of one category's entry list.

Expansion state remains independent per category.

---

## BusinessProfileEntryList

Displays entries belonging to a category.

Supports:

```text
Normal text
URL values
Delete Entry
```

---

## BusinessProfileEntry

Represents one entry.

Responsibilities:

* display stored value;
* optionally render valid URLs appropriately;
* expose Delete action where required.

No Edit action exists in the current MVP.

---

## AddEntryInput

Inline input used to create an entry.

Contains:

```text
Input
Add button
```

Successful submission should:

```text
Clear input
Refresh entry list
Refresh entry count
```

---

## AddCategoryDialog

Modal for creating a category.

Contains:

```text
Category Name
Cancel
Add Category
```

---

## DeleteCategoryDialog

Confirmation dialog for category deletion.

Backend remains authoritative regarding categories containing entries.

---

# 10. Service Taxonomy Components

Location:

```text
src/features/service-taxonomy/components/
```

---

## TaxonomyToolbar

Contains:

```text
Search
Expand All / Collapse All
```

---

## ServiceAreaList

Displays all Service Areas.

Responsibilities:

* render compact collapsed areas;
* manage independent expansion state;
* support search-revealed areas.

---

## ServiceAreaCard

Represents one Service Area.

Collapsed state:

```text
Service Area Name
Offering Count
Expand control
```

Expanded state additionally contains:

```text
Service Offering list
```

---

## ServiceOfferingList

Displays Service Offerings belonging to one Service Area.

---

## ServiceOfferingItem

Displays:

```text
Service Offering Name
SEO Query
```

No add/edit/delete controls are allowed.

---

## ExpandCollapseAllButton

Controls all Service Area expansion state.

Behaviour:

```text
Expand All
    ↕
Collapse All
```

This is local UI state.

---

# 11. Form Components

Generic form primitives should come from `components/ui/`.

Shared form wrappers should only be introduced where real reuse exists.

Potential shared patterns:

```text
FormField
FieldError
FieldDescription
RequiredIndicator
```

Do not create application-specific business forms in the shared directory.

---

# 12. Feedback Components

The following shared feedback components should provide consistent interaction patterns:

```text
EmptyState
ErrorState
LoadingState
ConfirmDialog
Toast
```

Toast implementation should use the approved shadcn-compatible solution.

Toasts are appropriate for lightweight feedback such as:

```text
Manual Input added.
Category added.
Publish Status updated.
```

---

# 13. Icon Usage

Use Lucide React.

Common icon categories may include:

```text
Search
Plus
Trash
Chevron Down
Chevron Right
Download
Upload
Refresh / Retry
Check
Alert
Clock
```

Do not create custom icon components unless additional behavior or consistent wrapping justifies it.

---

# 14. Component State Requirements

Interactive shared components should support relevant states.

Common states:

```text
Default
Hover
Focus
Disabled
Loading
Error
Selected / Active where relevant
```

Feature-specific components may additionally support business states.

Example:

```text
PipelineStageItem

Pending
Running
Completed
Failed
Partial
Interrupted
Superseded
```

---

# 15. Loading Ownership

Loading state should be owned by the feature/query invoking the operation.

Shared components receive state through props.

Prefer:

```text
Feature Query
      ↓
isLoading
      ↓
Shared Component
```

Do not allow low-level visual components to independently fetch feature data.

---

# 16. Error Ownership

Feature code determines:

```text
What failed
Which user-safe message applies
Whether Retry is available
```

Shared components determine only presentation.

Example:

```text
Feature
    ↓
"Unable to load Final Results"
    ↓
ErrorState
```

---

# 17. Business Logic Boundary

Components must not independently recreate backend business rules.

Avoid logic such as:

```text
if status === "approved"
    assume publishing is always allowed
```

Allowed actions should follow the backend contract.

Presentation components should not become business-rules engines.

---

# 18. Shared vs Feature-Specific Decision Rule

Move a component into `components/shared/` when:

* it is genuinely used by multiple features;
* its behavior is generic;
* it does not depend on one feature's business rules.

Keep it feature-specific when:

* it knows feature statuses;
* it calls feature APIs;
* it understands feature-specific workflow;
* it exists for one screen only.

---

# 19. Component Naming

Use PascalCase for React components.

Examples:

```text
PageHeader.tsx
StatusBadge.tsx
FinalResultsTable.tsx
PipelineStageProgress.tsx
```

shadcn/ui generated primitives may retain their standard lowercase filenames:

```text
button.tsx
dialog.tsx
select.tsx
```

---

# 20. Component File Scope

Prefer one primary component per file.

Small tightly coupled internal helper components may remain in the same file when separating them would reduce clarity.

Avoid very large files containing multiple unrelated components.

---

# 21. Props

Component props should be explicitly typed.

Example:

```typescript
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}
```

Avoid:

```typescript
any
```

for component props.

---

# 22. Data Fetching Rule

UI primitives and shared visual components should not directly perform backend requests.

Preferred:

```text
Page / Feature Component
      ↓
Feature Hook
      ↓
Feature API
```

then:

```text
Data
      ↓
Presentation Component
```

---

# 23. Table Architecture

Do not immediately build one extremely generic table abstraction for all screens.

Recommended structure:

```text
Shared DataTableShell
        +
Feature-specific table
```

Example:

```text
DataTableShell
    ↓
FinalResultsTable
```

and:

```text
DataTableShell
    ↓
ManualInputsTable
```

Introduce TanStack Table only if actual requirements justify it.

---

# 24. Component Reuse Strategy

Prefer:

```text
Build locally
      ↓
Observe real reuse
      ↓
Extract shared component
```

Avoid:

```text
Predict possible reuse
      ↓
Create large abstraction
      ↓
Force unrelated screens into it
```

---

# 25. Component Inventory Summary

## UI Primitives

```text
Button
Input
Textarea
Select
Dialog
AlertDialog
Tabs
Tooltip
DropdownMenu
Badge
Skeleton
Separator
Checkbox
Label
```

## Shared Application Components

```text
PageHeader
AppNavigation
SearchInput
FilterSelect
StatusBadge
EmptyState
ErrorState
LoadingState
ConfirmDialog
Pagination
SectionHeader
DataTableShell
```

## Dashboard

```text
ManualInputSummary
StartPipelineButton
ManualInputReminderDialog
PipelineStatusCard
PipelineStageProgress
PipelineStageItem
LatestPipelineRunCard
RecentPipelineRunsTable
```

## Final Results

```text
FinalResultsTabs
FinalResultsToolbar
FinalResultsTable
PublishStatusSelect
FinalResultStatusBadge
UrgencyBadge
ExpandableTableText
LatestRunResultsSection
OpenItemsSection
HistoryResultsSection
ActiveRunFilterNotice
ExportCsvButton
```

## Manual Inputs

```text
ManualInputReadySummary
ManualInputsToolbar
ManualInputsTable
ManualInputStatusBadge
AddManualInputDialog
AddManualInputForm
AdditionalDetailsEditor
UploadExcelDialog
UploadResultSummary
ManualInputValidationInfo
```

## Business Profile

```text
BusinessProfileCategoryList
BusinessProfileCategoryCard
CategoryEntriesToggle
BusinessProfileEntryList
BusinessProfileEntry
AddEntryInput
AddCategoryDialog
DeleteCategoryDialog
```

## Service Taxonomy

```text
TaxonomyToolbar
ServiceAreaList
ServiceAreaCard
ServiceOfferingList
ServiceOfferingItem
ExpandCollapseAllButton
```

---

# 26. Component Dependency Direction

Preferred:

```text
Pages
      ↓
Feature Components
      ↓
Shared Application Components
      ↓
UI Primitives
```

Data side:

```text
Feature Component
      ↓
Feature Hook
      ↓
Feature API Function
      ↓
Shared API Client
```

Do not reverse these dependency directions.

---

# 27. Component Guardrails

During implementation:

1. Keep business-specific components inside their feature.
2. Share only genuinely reusable components.
3. Keep UI primitives free from feature business logic.
4. Do not make raw API calls from shared visual components.
5. Keep backend rules authoritative.
6. Use typed component props.
7. Use existing shadcn/ui primitives before creating competing primitives.
8. Use Lucide React for icons.
9. Maintain shared loading, error, empty, and confirmation patterns.
10. Avoid premature generic abstractions.
11. Avoid one massive generic table component.
12. Keep component states accessible.
13. Preserve keyboard and focus behaviour.
14. Do not duplicate the same shared interaction pattern across features.
15. Do not introduce components for hypothetical future requirements.

---

# 28. Decisions Deferred

The following should be decided during implementation only if needed:

* whether `UrgencyBadge` becomes shared;
* whether a generic `DataTable` abstraction becomes necessary;
* whether TanStack Table is required;
* whether toast needs a custom wrapper;
* whether shared form wrappers provide enough reuse to justify extraction;
* whether Service Taxonomy search needs additional result components;
* whether Business Profile entry deletion needs a dedicated confirmation component;
* exact responsive variants for data-heavy components.

---

# 29. Related Documents

```text
01. Product Scope & Screen Inventory
02. Frontend Tech Stack
03. Frontend Architecture
04. Design System
05. UX Behaviour Rules
06. Detailed Screen Specifications
07. Component Inventory
08. API Contract
09. Frontend Data Models / Types
10. Form & Validation Specification
11. Responsive & Accessibility Guidelines
12. Coding Standards
13. Testing Strategy
14. Performance & Security
15. Environment & Deployment
16. Definition of Done
```

This document defines **which reusable frontend building blocks exist and where they belong**.

The next document should define the frontend-facing backend contract:

```text
08 - API Contract.md
```
