# Product Scope and Screen Inventory

> [!info] Document Status
> **Status:** Draft based on approved/current screen specifications
> **Product:** Keyword Research Automation Frontend
> **Primary Users:** Marketing Team
> **Document Purpose:** Define the frontend product boundary, screen inventory, major workflows, cross-screen relationships, MVP scope, and known unresolved product decisions.

---

# 1. Product Overview

The Keyword Research Automation Frontend is an internal web application designed to allow the marketing team to operate and interact with the keyword research pipeline without being exposed to backend implementation details.

The frontend provides a business-oriented interface for:

* preparing Manual Inputs for upcoming pipeline runs;
* starting the keyword research pipeline;
* monitoring pipeline progress;
* reviewing the latest completed pipeline run;
* reviewing and managing Final Results;
* tracking unfinished content recommendations from previous runs;
* browsing historical Final Results;
* maintaining relatively stable Business Profile information;
* browsing the Service Taxonomy used by the pipeline.

The frontend should translate backend pipeline functionality into terminology and workflows understandable to marketing users.

The application is primarily an **operational workflow tool**, not an analytics or technical monitoring platform.

---

# 2. Product Objective

The primary objective of the frontend is to provide the marketing team with a simple workflow for moving from business inputs to actionable keyword and content recommendations.

At a high level:

```text
Prepare Inputs
      ↓
Start Pipeline
      ↓
Monitor Pipeline
      ↓
Generate Final Results
      ↓
Review Recommendations
      ↓
Approve / Reject Recommendations
      ↓
Publish Content
      ↓
Track Historical Work
```

The application should allow users to perform this workflow without needing to understand:

* internal AI stages;
* database structures;
* worker processes;
* provider information;
* model configuration;
* prompts;
* raw API responses;
* pipeline implementation details;
* internal identifiers;
* technical diagnostics.

---

# 3. Primary Users

## 3.1 Marketing Team

The current frontend is designed primarily for internal marketing-team users.

Marketing users need to:

* prepare information for future pipeline runs;
* start the pipeline;
* understand whether the pipeline is running;
* understand its current business-level stage;
* review generated recommendations;
* prioritize recommendations;
* approve or reject recommendations;
* mark recommendations as Published;
* find unfinished recommendations from previous runs;
* review historical recommendations;
* maintain Business Profile information;
* browse the Service Taxonomy.

---

# 4. Access Control Scope

Role-based access control is not currently defined as part of the frontend product scope.

The current specifications assume marketing-team users can access the required functionality.

In particular:

* Business Profile currently has no role restrictions.
* Service Taxonomy is read-only for users.
* No separate administrator experience has been defined.
* No role-specific navigation has currently been specified.

Authentication and future role-based authorization should be treated as a separate product/architecture decision if required.

> [!warning] Open Decision
> Authentication requirements, user management, session management, and future role definitions have not been established by the current screen specifications and should not be invented during frontend implementation.

---

# 5. Product Navigation

The application currently contains five primary screens:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Recommended conceptual navigation:

```text
Application
│
├── Dashboard
│
├── Final Results
│
├── Manual Inputs
│
├── Business Profile
│
└── Service Taxonomy
```

These should form the primary frontend navigation.

Exact URL routes should be finalized in the frontend architecture/routing specification.

---

# 6. Screen Inventory

| # | Screen           | Primary Purpose                                       | Interaction Type        |
| - | ---------------- | ----------------------------------------------------- | ----------------------- |
| 1 | Dashboard        | Operate and monitor the keyword research pipeline     | Operational             |
| 2 | Final Results    | Review and manage generated recommendations           | Operational / Workflow  |
| 3 | Manual Inputs    | Prepare additional inputs for future pipeline runs    | Data Entry / Management |
| 4 | Business Profile | Maintain stable business context used by the pipeline | Reference / Maintenance |
| 5 | Service Taxonomy | Browse services and SEO queries used by the pipeline  | Read-only Reference     |

Total primary screens:

```text
5
```

---

# 7. Screen 1 — Dashboard

## Purpose

Dashboard is the operational starting point of the application.

It provides users with a concise view of:

* Manual Inputs available for the next run;
* current pipeline state;
* current pipeline progress;
* latest completed pipeline run;
* Final Results count;
* recent previous pipeline runs;
* navigation to generated Final Results.

Dashboard is operational rather than analytical.

---

## Primary Actions

Users can:

* review how many Manual Inputs are ready;
* navigate to Manual Inputs;
* start a new pipeline run;
* monitor an active pipeline;
* view results from the latest completed pipeline;
* view results from previous completed pipeline runs.

---

## Pipeline Start

The pipeline is started directly from Dashboard.

Before starting the pipeline, the user should be reminded about Manual Inputs.

The reminder is handled through a modal rather than a separate screen.

Conceptually:

```text
Dashboard
    ↓
Start Pipeline
    ↓
Manual Input Reminder
    ↓
Continue
    ↓
Pipeline Starts
```

The user may navigate to Manual Inputs if additional information needs to be prepared before the run.

---

## Active Pipeline

When a pipeline is active, Dashboard displays its progress directly.

There is no separate Pipeline Progress screen.

Progress is stage-based rather than percentage-based.

The frontend displays these user-facing stages:

1. Collecting Data
2. Filtering Relevance & Generating Keywords
3. Grouping Similar Keywords
4. Extracting SEO Data
5. Evaluating & Filtering Keywords
6. Preparing Final Results

These labels map to the backend stage identifiers as follows:

| Frontend label | Backend stage |
| --- | --- |
| Collecting Data | `collection` |
| Filtering Relevance & Generating Keywords | `ai_pass1a` |
| Grouping Similar Keywords | `ai_pass1b` |
| Extracting SEO Data | `seo_enrichment` |
| Evaluating & Filtering Keywords | `ai_pass2` |
| Preparing Final Results | `ranking` |

The frontend should display the user-facing labels while preserving the
returned backend stage and status values for state handling. It must not
invent percentage completion.

Possible stage states include:

```text
Completed
Running
Pending
```

---

## Latest Pipeline Run

Dashboard provides a prominent summary of the latest completed pipeline run.

It should include:

* completion/run date;
* completion state;
* number of Final Results;
* View Final Results action.

A pipeline run can produce:

```text
0–10 Final Results
```

Fewer than 10 Final Results does not automatically indicate a failure.

---

## Recent Pipeline Runs

Dashboard displays a small list of recent previous pipeline executions.

The purpose is to provide recent operational context without creating a dedicated Pipeline Runs screen.

Completed runs may provide:

```text
View Results
```

Failed runs do not currently require a View Results action.

The currently active execution must not be duplicated in Recent Pipeline Runs.

---

## Cross-Screen Navigation

Latest completed run:

```text
Dashboard
    ↓
View Final Results
    ↓
Final Results
    ↓
Latest Results
```

Older completed run:

```text
Dashboard
    ↓
Recent Pipeline Runs
    ↓
View Results
    ↓
Final Results
    ↓
History
    ↓
Selected Pipeline Run Filter
```

---

# 8. Screen 2 — Final Results

## Purpose

Final Results is the primary output and content-workflow screen.

It allows marketing users to:

* review recommendations from the latest pipeline run;
* identify unfinished recommendations from previous runs;
* search recommendations;
* filter recommendations;
* update Publish Status;
* export recommendations to CSV;
* browse historical Final Results.

---

## Main Structure

Final Results contains two tabs:

```text
Latest Results
History
```

Default:

```text
Latest Results
```

---

# 9. Final Results — Latest Results Tab

Latest Results contains two sections:

```text
Latest Pipeline Run
Open Items from Previous Runs
```

---

## Latest Pipeline Run

Displays Final Results belonging only to the most recently completed pipeline execution.

A single pipeline run produces a maximum of:

```text
10 Final Results
```

The table includes:

1. Keyword
2. Topic Title
3. Article Angle
4. Why Relevant
5. Content Type
6. Search Intent
7. Urgency
8. Publish Status

Results should preserve the ordering returned by the backend.

The frontend must not independently re-sort Final Results unless a supported
sort option is explicitly requested.

AI Score may be used internally by the backend as part of ranking logic, but it
is not displayed as a user-facing column.

---

## Open Items from Previous Runs

This section acts as a marketing work queue.

It contains unfinished Final Results from previous pipeline runs.

Included statuses:

```text
Pending
Approved
```

Excluded statuses:

```text
Published
Reject
```

The latest pipeline run is excluded from this section.

Its purpose is to prevent unfinished recommendations from older runs from being forgotten.

---

# 10. Final Results — History Tab

History provides one unified historical Final Results table.

It does **not** display a list of pipeline runs.

Historical rows from different pipeline executions are combined.

History includes:

* Run Date;
* Keyword;
* Topic Title;
* Article Angle;
* Why Relevant;
* Content Type;
* Search Intent;
* Urgency;
* Publish Status.

Ordering is:

```text
Newest Run
    ↓
Highest-ranked recommendation
    ↓
Lower-ranked recommendations
    ↓
Next Run
```

Dashboard can deep-link into History for a specific pipeline execution.

When this occurs, History should indicate that a run filter is active and allow the user to clear it.

---

# 11. Final Results Search and Filters

Search must use the API's `search` parameter. The frontend should not claim
that it searches Topic Title, Article Angle, Why Relevant, or other fields
unless the backend contract explicitly guarantees that scope.

MVP filters:

```text
Urgency
Publish Status
```

Known Urgency values:

```text
High
Medium
Low
```

Publish Status values:

```text
Pending
Approved
Published
Reject
```

---

# 12. Publish Status Workflow

Publish Status represents the marketing workflow for each recommendation.

Primary lifecycle:

```text
Pending
   ↓
Approved
   ↓
Published
```

A recommendation may also be:

```text
Reject
```

Allowed status behavior:

```text
Pending
    → Approved
    → Published
    → Reject

Approved
    → Pending
    → Published
    → Reject

Published
    → Terminal

Reject
    → Terminal
```

Published and Reject records are no longer editable.

Other historical content fields remain read-only.

---

# 13. Final Results CSV Export

Users can export the currently filtered result set.

Export should respect:

* selected section/tab;
* pipeline execution scope;
* Keyword search;
* Urgency filter;
* Publish Status filter;
* ordering.

Export represents **all matching rows**, not only the current pagination page.

The export should contain frontend-visible fields rather than internal backend data.

Maximum matching rows per export:

```text
10,000
```

If this limit is exceeded, users should be asked to narrow their filters.

---

# 14. Screen 3 — Manual Inputs

## Purpose

Manual Inputs allows marketing users to provide additional information for the next pipeline run.

Users can:

* manually add an input;
* upload inputs through Excel;
* review inputs ready for the next run;
* search inputs;
* filter inputs;
* review invalid records;
* access previously processed inputs.

---

## Default View

The default view focuses on:

```text
Ready for Next Run
```

which corresponds to pending eligible Manual Inputs.

The screen displays the number of inputs ready for the next pipeline run.

---

## Primary Actions

```text
Add Manual Input
Upload Excel
Search
Filter by Status
Filter by Source
Browse Manual Inputs
```

---

# 15. Add Manual Input

Add Manual Input opens a modal.

It does not require a separate screen.

Input fields:

### Input Text

Required primary information.

### Summary / Gist

Optional concise summary.

### Additional Details

Flexible field-name/value information.

Example:

```text
Target Country → Japan
Service        → BIS
```

Users should not need to manually enter JSON.

The frontend should provide field/value inputs and transform them into the required structured data.

---

# 16. Excel Upload

Excel Upload is handled through a modal.

There is no separate Excel Upload screen.

Conceptual flow:

```text
Manual Inputs
      ↓
Upload Excel
      ↓
Select File
      ↓
Upload
      ↓
Backend Validation
      ↓
Valid Records → Ready for Next Run
Invalid Records → Invalid
```

The frontend should provide a simple upload result summary.

---

# 17. Manual Input Lifecycle

Frontend labels map conceptually to the following lifecycle:

```text
Ready for Next Run
Used in Previous Run
Invalid
Cancelled
```

The default filter is:

```text
Ready for Next Run
```

Invalid records should not clutter the normal Ready view.

Users can explicitly select Invalid to inspect validation problems.

---

# 18. Manual Input Search and Filters

Search is supported through the backend `keyword` query parameter. The
contract does not expose a separate gist/additional-details search parameter;
the frontend should not promise those fields are searchable.

Status filters should use the backend values:

```text
pending
promoted
invalid
cancelled
All
```

The UI may label `pending` as “Ready for Next Run” and `promoted` as “Used in
Previous Run”, but those are display labels, not API values.

Source filters should use the backend values:

```text
All
manual_entry
manual_excel
```

---

# 19. Manual Input History

A separate Manual Input History screen is not required.

Historical/manual-input lifecycle records are accessed using the existing Manual Inputs screen and its Status filter.

Therefore:

```text
Manual Inputs
      ↓
Status Filter
      ↓
Used in Previous Run / Invalid / Cancelled
```

---

# 20. Screen 4 — Business Profile

## Purpose

Business Profile stores relatively stable business information used by the keyword research pipeline.

The screen is optimized primarily for:

* viewing business information;
* organizing information into categories;
* occasionally maintaining that information.

---

## Data Structure

```text
Category
    ├── Entry
    ├── Entry
    └── Entry
```

Example:

```text
Competitors
    ├── Competitor A
    ├── Competitor B
    └── https://competitor-example.com

Target Audience
    ├── Foreign companies entering India
    ├── Japanese manufacturers
    └── European SMEs
```

Category names are user-defined and should not be hard-coded into the frontend.

---

# 21. Business Profile Actions

Users can currently:

* view categories;
* add categories;
* delete categories;
* view entries;
* expand/collapse entry lists;
* add entries;
* delete entries.

The current public API does not provide operations to:

* rename categories;
* edit existing entries.

The public API also does not provide category-rename or entry-update
operations. These are not merely UI omissions; they are currently outside the
frontend contract.

Search is not required for MVP.

---

# 22. Business Profile Category Behaviour

Categories always remain visible.

Only the entries within a category can be collapsed.

Example:

```text
Competitors

ENTRIES (30) >
```

Expanded:

```text
Competitors

ENTRIES (30) v

Competitor A
Competitor B
https://competitor-example.com
```

Each category displays its entry count.

---

# 23. Add Category

Add Category is a primary page-level action.

It opens a modal containing the Category Name input.

Conceptually:

```text
Business Profile
      ↓
Add Category
      ↓
Add Category Modal
      ↓
Submit
      ↓
New Category Appears
```

---

# 24. Add Entry

Entries contain one text value.

Adding an entry uses an inline input within the relevant category.

Conceptually:

```text
Category
      ↓
New Entry
      ↓
Add
      ↓
Entry Added
      ↓
Entry Count Updated
```

Entry values may contain normal text or URLs.

---

# 25. Business Profile Deletion

Categories can be deleted.

Category deletion requires confirmation because it is destructive.

The behavior of deleting a category containing existing entries is not yet finalized and must follow authoritative backend rules.

Individual entries can also be deleted.

Whether individual entry deletion requires confirmation remains an open decision.

---

# 26. Screen 5 — Service Taxonomy

## Purpose

Service Taxonomy provides a read-only view of services used by the keyword research pipeline.

It allows marketing users to:

* browse Service Areas;
* inspect Service Offerings;
* view SEO Queries associated with offerings;
* search the taxonomy;
* quickly understand the available service structure.

---

## Data Structure

```text
Service Area
    ├── Service Offering
    │      └── SEO Query
    │
    ├── Service Offering
    │      └── SEO Query
    │
    └── Service Offering
           └── SEO Query
```

---

# 27. Service Taxonomy Behaviour

All Service Areas should initially be presented in a compact collapsed state.

Example:

```text
Assurance and Risk Management
6 service offerings >
```

Users can expand a Service Area to see its Service Offerings.

Multiple Service Areas may remain expanded simultaneously.

The interface should also provide:

```text
Expand All
Collapse All
```

The purpose is progressive disclosure:

```text
First → Understand available Service Areas

Then → Expand relevant Service Area

Then → Inspect Service Offerings and SEO Queries
```

---

# 28. Service Taxonomy Search

Search is intended to help users locate taxonomy information.

Desired search scope:

* Service Area;
* Service Offering;
* SEO Query.

When a matching Service Offering exists inside a collapsed Service Area, the relevant parent area should automatically expand so the match is visible.

The exact search implementation remains to be finalized.

---

# 29. Service Taxonomy Editing

Service Taxonomy is currently completely read-only.

Users cannot:

* add Service Areas;
* add Service Offerings;
* edit taxonomy data;
* delete taxonomy data;
* rename taxonomy data;
* reorder taxonomy data.

No editing controls should therefore be displayed.

---

# 30. Major Cross-Screen Workflows

## Workflow A — Prepare Inputs and Run Pipeline

```text
Manual Inputs
      ↓
Add Manual Input / Upload Excel
      ↓
Inputs Ready
      ↓
Dashboard
      ↓
Start Pipeline
      ↓
Manual Input Reminder
      ↓
Confirm
      ↓
Pipeline Running
```

---

## Workflow B — Monitor Pipeline

```text
Dashboard
      ↓
Pipeline Running
      ↓
Stage Progress
      ↓
Pipeline Completed
      ↓
Final Results Count
```

No separate progress screen is involved.

---

## Workflow C — Review Latest Results

```text
Dashboard
      ↓
Latest Pipeline Run
      ↓
View Final Results
      ↓
Final Results
      ↓
Latest Results
```

---

## Workflow D — Manage Content Recommendations

```text
Final Results
      ↓
Review Recommendation
      ↓
Pending
      ↓
Approved
      ↓
Published
```

Alternative:

```text
Pending / Approved
      ↓
Reject
```

Published and Reject are terminal states.

---

## Workflow E — Continue Previous Work

```text
Final Results
      ↓
Latest Results
      ↓
Open Items from Previous Runs
      ↓
Pending / Approved Recommendations
      ↓
Update Publish Status
```

This prevents unfinished recommendations from being forgotten.

---

## Workflow F — Review Historical Results

```text
Final Results
      ↓
History
      ↓
Search / Filter
      ↓
Historical Results
```

Or from Dashboard:

```text
Dashboard
      ↓
Recent Pipeline Runs
      ↓
Older Completed Run
      ↓
View Results
      ↓
Final Results
      ↓
History
      ↓
Selected Run Filter
```

---

## Workflow G — Maintain Business Context

```text
Business Profile
      ↓
View Categories
      ↓
Add Category / Add Entry / Delete Entry
```

This information serves as relatively stable business context for the research pipeline.

---

## Workflow H — Browse Service Structure

```text
Service Taxonomy
      ↓
Browse Service Areas
      ↓
Expand Service Area
      ↓
View Service Offerings
      ↓
View SEO Queries
```

Alternative:

```text
Service Taxonomy
      ↓
Search
      ↓
Matching Area / Offering
      ↓
Relevant Area Expands
```

---

# 31. Screens Explicitly Not Required

The current product scope does **not** require the following separate screens:

| Potential Screen              | Decision      |
| ----------------------------- | ------------- |
| Pipeline Progress             | Not required  |
| Pipeline Runs                 | Not required  |
| Pipeline Run Details          | Not required  |
| Run Results                   | Not required  |
| Manual Input History          | Not required  |
| Excel Upload                  | Modal instead |
| Add Manual Input              | Modal instead |
| Add Business Profile Category | Modal instead |
| Final Result Details          | Not required  |
| Final Result Row Drawer       | Not required  |

These functions are intentionally incorporated into the five primary screens.

---

# 32. Modal / Overlay Inventory

Although there are five primary screens, the frontend also requires several secondary interactions.

Known modal/overlay requirements include:

| Modal / Interaction          | Parent Screen    | Purpose                                        |
| ---------------------------- | ---------------- | ---------------------------------------------- |
| Manual Input Reminder        | Dashboard        | Remind user about inputs before pipeline start |
| Add Manual Input             | Manual Inputs    | Create one Manual Input                        |
| Upload Excel                 | Manual Inputs    | Upload Manual Inputs in bulk                   |
| Add Category                 | Business Profile | Create Business Profile category               |
| Delete Category Confirmation | Business Profile | Confirm destructive category deletion          |

Additional confirmation dialogs should only be added where product requirements explicitly require them.

---

# 33. Core Product Entities

The frontend interacts conceptually with the following major product entities:

```text
Pipeline Execution
Pipeline Stage
Manual Input
Final Result
Business Profile Category
Business Profile Entry
Service Area
Service Offering
SEO Query
```

These are product-level concepts.

Exact API schemas and TypeScript representations belong in the API Contract and Frontend Data Model documents.

---

# 34. Backend Authority Principle

The backend should remain authoritative for business rules.

The frontend should primarily:

```text
Request
Display
Collect User Input
Submit Actions
Represent Backend State
```

The frontend should not independently reconstruct important business logic.

Backend-authoritative areas include:

* pipeline execution state;
* pipeline stage state;
* pipeline stage ordering;
* Manual Input eligibility;
* Final Results count;
* Final Results filtering;
* Final Results ordering;
* pagination;
* Publish Status transition rules;
* validation;
* pipeline lifecycle rules;
* allowed pipeline actions.

---

# 35. User-Facing Information Principle

The frontend should display business-relevant information.

Examples:

```text
Pipeline Running
Collecting Data
10 Final Results
27 Inputs Ready for Next Run
Approved
Published
High Urgency
```

The frontend should avoid exposing implementation details such as:

```text
Database IDs
Internal UUIDs where unnecessary
Worker IDs
Checkpoint IDs
Provider Information
Model Names
Prompts
Token Counts
Raw AI Responses
Stack Traces
Database Metadata
Raw API Responses
Internal Stage Names
```

---

# 36. MVP Product Scope

The current MVP frontend consists of the following capabilities.

## Dashboard

* start pipeline;
* Manual Input reminder;
* Manual Input ready count;
* active pipeline state;
* stage-based progress;
* latest completed pipeline;
* Final Results count;
* recent pipeline runs;
* navigation to Final Results.

## Final Results

* Latest Results tab;
* latest run results;
* Open Items from Previous Runs;
* History tab;
* Keyword search;
* Urgency filter;
* Publish Status filter;
* Publish Status updates;
* historical browsing;
* server-side pagination where required;
* CSV export;
* Dashboard deep-link into historical run.

## Manual Inputs

* Ready for Next Run count;
* manual input creation;
* Excel upload;
* Manual Input table;
* search;
* Status filtering;
* Source filtering;
* invalid record inspection;
* pagination;
* historical lifecycle access through filtering.

## Business Profile

* view categories;
* view entry counts;
* expand/collapse entries;
* add category;
* delete category;
* add entry;
* delete entry;
* display text/URL entries.

## Service Taxonomy

* view Service Areas;
* view Service Offering counts;
* expand/collapse Service Areas;
* view Service Offerings;
* view SEO Queries;
* search taxonomy;
* Expand All / Collapse All;
* responsive browsing layout.

---

# 37. Explicitly Out of Scope for Current MVP

Unless separately approved, the following should not be added simply because they might be useful:

* analytics dashboard;
* charts;
* pipeline performance statistics;
* technical pipeline diagnostics;
* artificial percentage progress;
* dedicated Pipeline Runs screen;
* dedicated Pipeline Progress screen;
* Pipeline Run Details screen;
* separate Manual Input History screen;
* separate Excel Upload page;
* separate Final Result details page;
* Final Result details drawer;
* editing historical Final Result content;
* displaying AI Score as a Final Results column;
* Business Profile search;
* Business Profile category rename;
* Business Profile entry editing;
* Service Taxonomy editing;
* Service Taxonomy add/delete actions;
* technical database metadata;
* raw API information;
* internal pipeline terminology.

New functionality should be added only after an explicit product decision.

---

# 38. Screen Relationship Map

```text
                         ┌──────────────────┐
                         │    Dashboard     │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
         Manual Inputs      Pipeline Run      Final Results
                 │                │                │
                 │                │        ┌───────┴────────┐
                 │                │        │                │
                 │                │        ▼                ▼
                 │                │ Latest Results       History
                 │                │        │                ▲
                 │                │        │                │
                 │                └────────┘                │
                 │                                          │
                 └── Inputs used by next run                │
                                                            │
Dashboard Recent Pipeline Runs ─────────────────────────────┘


Business Profile ──────┐
                       ├── Business context used by pipeline
Service Taxonomy ──────┘
```

---

# 39. Functional Screen Classification

## Operational Screens

```text
Dashboard
Final Results
Manual Inputs
```

These screens participate directly in the recurring keyword research workflow.

## Reference / Configuration Screens

```text
Business Profile
Service Taxonomy
```

Business Profile is editable configuration/context data.

Service Taxonomy is currently read-only reference data.

---

# 40. Data Change Frequency

| Area                    | Expected Change Frequency               |
| ----------------------- | --------------------------------------- |
| Pipeline state          | High while pipeline runs                |
| Pipeline stage progress | High while pipeline runs                |
| Final Results           | New data per completed pipeline run     |
| Publish Status          | Regular marketing workflow updates      |
| Manual Inputs           | Before upcoming pipeline runs           |
| Business Profile        | Relatively infrequent                   |
| Service Taxonomy        | Relatively infrequent / backend-managed |

This distinction should later influence frontend caching and data-fetching strategy.

---

# 41. Important Product Constraints

## Pipeline

* Only backend-authoritative pipeline state should be displayed.
* No artificial percentage progress.
* Active pipeline should not be duplicated in recent runs.
* One pipeline execution produces at most 10 Final Results.

## Final Results

* Final Results preserve backend-authoritative ordering.
* AI Score is not displayed as a user-facing column.
* Search uses the backend-supported search contract; the frontend must not
  assume additional searchable fields beyond that contract.
* Historical content is read-only.
* Publish Status remains editable only while non-terminal.
* Published and Reject are terminal.
* Open Items excludes the latest run.
* CSV export represents all matching results, not only the current page.

## Manual Inputs

* Default view focuses on Ready for Next Run.
* Invalid records should not clutter the default view.
* Additional Details should not require users to write JSON.
* Manual Input history remains inside the same screen through filters.

## Business Profile

* Category names are user-created.
* Internal IDs remain hidden.
* Categories remain visible.
* Entry lists are collapsible.
* Categories cannot currently be renamed.
* Entries cannot currently be edited.

## Service Taxonomy

* Completely read-only.
* Service Areas are the top-level hierarchy.
* Progressive disclosure should prevent excessively long pages.
* Internal IDs remain hidden.
* Multiple Service Areas may remain expanded.

---

# 42. Empty, Loading and Error States

Every primary screen should eventually define consistent:

```text
Loading
Empty
Error
Success
Disabled
Retry
```

states.

Detailed visual treatment belongs in the Design System and UX Behaviour Rules documents.

The frontend must not display technical backend errors, stack traces, or raw error responses directly to marketing users.

---

# 43. Responsive Scope

The frontend should support responsive behavior.

Known requirement:

* Service Taxonomy may use two columns on wider desktop screens;
* Service Taxonomy should use one column on smaller screens;
* normal taxonomy browsing should not require horizontal scrolling.

Complete application breakpoints and responsive behavior should be defined separately in the Responsive & Accessibility Guidelines.

---

# 44. Current Product Decisions That Remain Open

The following decisions are not sufficiently finalized and should be tracked rather than silently assumed during implementation.

## Global

* final application route structure;
* authentication requirements;
* future role-based permissions;
* navigation presentation;
* exact responsive breakpoints.

## Dashboard

* whether the product name remains Dashboard or is later renamed Home;
* whether a unified Dashboard summary endpoint will be introduced.

## Final Results

* exact API representation of some frontend fields;
* handling of unknown Urgency values;
* whether Latest Results needs any pagination UI despite the maximum of 10 rows;
* whether quick Open Item filter presets are needed;
* exact CSV export-limit error copy.

## Manual Inputs

* remaining backend/API details identified in the Manual Inputs specification should be finalized before implementation of affected functionality.

## Business Profile

* category deletion behavior when entries exist;
* whether category deletion cascades to entries;
* whether category deletion should instead be blocked;
* whether entry deletion requires confirmation;
* maximum category-name length;
* maximum entry-text length;
* URL rendering behavior;
* category ordering;
* entry ordering;
* duplicate category-name rules;
* duplicate entry rules;
* exact validation/error messages.

## Service Taxonomy

* frontend-side versus backend-supported search;
* exact SEO Query field;
* whether SEO Query is included in search;
* Service Area ordering;
* Service Offering ordering;
* persistence of expand/collapse state;
* mobile Expand All behavior;
* exact loading/error presentation.

---

# 45. Product Scope Guardrail

The individual screen specification documents remain the detailed source of truth for screen-level behavior.

This Product Scope document defines:

```text
WHAT the frontend product contains
WHO uses it
WHICH screens exist
WHAT each screen is responsible for
HOW screens relate to each other
WHAT major workflows exist
WHAT is inside MVP scope
WHAT is intentionally outside MVP scope
```

It should **not** become the source of truth for:

```text
Colors
Typography
Spacing
Component styling
Frontend framework
State-management library
Folder structure
API DTO definitions
TypeScript interfaces
Detailed endpoint contracts
Testing implementation
Deployment implementation
```

Those concerns belong in separate frontend documentation.

---

# 46. Documentation Hierarchy

The recommended documentation hierarchy from this point is:

```text
01. Product Scope & Screen Inventory
        ↓
02. Roles & Permissions
        ↓
03. Frontend Tech Stack
        ↓
04. Frontend Architecture
        ↓
05. Design System
        ↓
06. UX Behaviour Rules
        ↓
07. Detailed Screen Specifications
        ↓
08. Component Inventory
        ↓
09. API Contract
        ↓
10. Frontend Data Models / Types
        ↓
11. Form & Validation Specification
        ↓
12. Responsive & Accessibility Guidelines
        ↓
13. Coding Standards
        ↓
14. Testing Strategy
        ↓
15. Performance & Security
        ↓
16. Environment & Deployment
        ↓
17. Definition of Done
```

The existing five detailed screen specifications should be retained rather than merged into this document.

---

# 47. Current Screen Specification Sources

Detailed product behavior is defined in the following screen-level documents:

```text
Screen 1 — Dashboard Screen Specification
Screen 2 — Final Results Screen Specification
Screen 3 — Manual Inputs Screen Specification
Screen 4 — Business Profile Screen Specification
Screen 5 — Service Taxonomy Screen Specification
```

These documents provide detailed implementation requirements.

This Product Scope document sits **above** those specifications and provides the overall frontend product boundary.

---

# 48. Product Scope Summary

The MVP frontend consists of five primary screens:

```text
1. Dashboard
2. Final Results
3. Manual Inputs
4. Business Profile
5. Service Taxonomy
```

Together they support the complete marketing-facing workflow:

```text
Business Context
      +
Service Taxonomy
      +
Manual Inputs
      ↓
Keyword Research Pipeline
      ↓
Pipeline Progress
      ↓
Final Results
      ↓
Marketing Review
      ↓
Approval / Rejection
      ↓
Publishing
      ↓
Historical Tracking
```

The frontend should remain focused on making this workflow understandable and efficient for marketing users.

Backend implementation details should remain hidden, backend business rules should remain authoritative, and new screens or features should not be introduced unless they solve an explicitly approved product requirement.
