# Design System

> [!info] Document Status
> **Status:** Approved direction for MVP Design Foundation
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define the visual language, design tokens, reusable UI rules, and component styling standards used across the frontend.

---

# 1. Design Principles

The interface should be:

* clean;
* professional;
* operational;
* easy to scan;
* visually consistent;
* accessible;
* content-first;
* optimized for desktop workflows while remaining responsive.

Avoid unnecessary decoration, heavy gradients, excessive animation, and visual clutter.

---

# 2. Design Technology

| Area          | Technology              |
| ------------- | ----------------------- |
| Styling       | Tailwind CSS            |
| UI Components | shadcn/ui               |
| UI Primitives | Radix UI where required |
| Icons         | Lucide React            |

Visual decisions should be implemented through reusable design tokens rather than arbitrary values.

---

# 3. Color System

Use semantic color tokens instead of directly using raw colors throughout feature code.

## Primary

Used for:

* primary actions;
* active navigation;
* selected controls;
* important interactive elements.

```text
Primary
Primary Hover
Primary Active
Primary Foreground
```

Recommended direction:

```text
Primary: Blue
```

Exact shade should be finalized during visual implementation.

---

## Neutral Colors

Used for:

* page backgrounds;
* cards;
* borders;
* secondary text;
* muted UI;
* disabled states.

Required tokens:

```text
Background
Surface
Surface Muted
Border
Text Primary
Text Secondary
Text Muted
```

Recommended visual direction:

```text
Page Background → very light neutral / off-white
Surface → white
Primary Text → near-black / dark neutral
Secondary Text → medium neutral
Border → light neutral
```

---

# 4. Semantic Colors

Semantic colors should communicate meaning consistently.

| Meaning             | Color Direction |
| ------------------- | --------------- |
| Success             | Green           |
| Warning             | Amber           |
| Error / Destructive | Red             |
| Information         | Blue            |
| Neutral             | Gray            |

Do not use semantic colors purely for decoration.

---

# 5. Product Status Colors

Status colors must remain consistent across screens.

## Publish Status

| Status    | Visual Meaning           |
| --------- | ------------------------ |
| Pending   | Neutral / muted          |
| Approved  | Positive / blue or green |
| Published | Success / green          |
| Reject    | Error / red              |

Published and Reject are terminal states. A red Reject badge communicates
status; it does not by itself mean that the user can perform a Reject action.
The backend remains authoritative for allowed actions and status transitions.

---

## Pipeline Stage Status

| Status    | Visual Meaning   |
| --------- | ---------------- |
| Completed | Success          |
| Running   | Primary / active |
| Pending   | Neutral / muted  |
| Interrupted | Warning / interrupted |
| Partial   | Warning / incomplete |
| Failed    | Error            |
| Superseded | Neutral / inactive |

Do not represent pipeline progress using invented percentages.

## Pipeline Execution Status

Pipeline execution status is a separate status domain from stage status:

| Status | Visual Meaning |
| --- | --- |
| Queued | Neutral / waiting |
| Running | Primary / active |
| Completed | Success |
| Partial | Warning / incomplete |
| Failed | Error |
| Abandoned | Neutral or destructive context |

The frontend must preserve the backend status domain and should use a safe
neutral treatment for an unknown status rather than silently reinterpreting it.

---

## Urgency

| Urgency | Visual Meaning         |
| ------- | ---------------------- |
| High    | Strong attention       |
| Medium  | Moderate attention     |
| Low     | Neutral / low emphasis |

Urgency colors must not conflict with error or success meanings.

---

# 6. Typography

Use one primary sans-serif font family across the application.

Recommended:

```text
Inter
```

Fallback:

```text
Inter, system-ui, sans-serif
```

---

# 7. Typography Scale

Recommended base scale:

| Usage                   |    Size |
| ----------------------- | ------: |
| Page Title              | 28–32px |
| Section Title           | 20–24px |
| Card / Subsection Title | 16–18px |
| Body                    | 14–16px |
| Table Text              |    14px |
| Supporting Text         | 13–14px |
| Caption / Metadata      |    12px |

Avoid excessively small text.

Normal operational content should generally not go below:

```text
12px
```

---

# 8. Font Weight

Recommended weights:

```text
400 → Normal text
500 → Labels / medium emphasis
600 → Headings / buttons / important labels
700 → Strong emphasis where required
```

Avoid excessive use of bold text.

---

# 9. Line Height

Use comfortable line heights for readability.

Recommended:

```text
Body → 1.5
Headings → 1.2–1.35
Table cells → 1.4
```

---

# 10. Spacing System

Use a consistent 4px-based spacing scale.

Recommended tokens:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Avoid arbitrary spacing such as:

```text
13px
27px
37px
```

unless there is a specific layout requirement.

---

# 11. Page Spacing

Recommended desktop page structure:

```text
Page horizontal padding: 24–32px
Page vertical padding: 24–32px
Major section gap: 24–32px
Card internal padding: 16–24px
Control gap: 8–12px
```

Exact responsive values may change in the Responsive & Accessibility document.
The MVP should target WCAG 2.1 AA for normal user interactions.

---

# 12. Border Radius

Use a restrained radius system.

Recommended:

```text
Small: 4px
Default: 6–8px
Large: 10–12px
```

Suggested usage:

| Component | Radius           |
| --------- | ---------------- |
| Input     | Default          |
| Button    | Default          |
| Card      | Large            |
| Modal     | Large            |
| Badge     | Small or rounded |
| Tooltip   | Small            |

Avoid excessive pill-shaped UI except for badges or controls where appropriate.

---

# 13. Borders

Use subtle borders to separate surfaces.

Recommended:

```text
1px solid semantic border color
```

Borders should be preferred over heavy shadows for normal application structure.

---

# 14. Shadows

Shadows should remain subtle.

Recommended usage:

```text
No shadow → normal cards / sections
Small shadow → dropdowns / floating elements
Medium shadow → dialogs / modals
```

Avoid strong decorative shadows.

---

# 15. Page Structure

Primary screens should generally follow:

```text
Page Header
    ↓
Primary / Secondary Actions
    ↓
Filters or Summary
    ↓
Main Content
```

Example:

```text
Final Results
Short page description

[Search] [Urgency] [Status] [Export]

Results Table
```

---

# 16. Page Header

Each primary screen should use a consistent page header.

Structure:

```text
Page Title
Short Description
Optional Primary Action
```

Example:

```text
Manual Inputs

Add additional information to be included
in the next pipeline run.

                        [Upload Excel] [Add Manual Input]
```

Do not add unnecessary page-level decoration.

---

# 17. Cards and Sections

Cards should be used for meaningful grouping.

Recommended style:

```text
White / surface background
Subtle border
Large radius
16–24px padding
Minimal or no shadow
```

Do not place every small element inside its own card.

---

# 18. Buttons

Button hierarchy:

```text
Primary
Secondary
Outline
Ghost
Destructive
```

## Primary

Use for the main action.

Examples:

```text
Start Pipeline
Add Manual Input
Add Category
```

Only one dominant primary action should normally exist within the same action group.

---

## Secondary / Outline

Use for lower-priority actions.

Examples:

```text
Upload Excel
Expand All
Export CSV
Retry
```

---

## Ghost

Use for low-emphasis actions.

Examples:

```text
Cancel
Show More
Clear Filter
```

---

## Destructive

Use for actions such as:

```text
Delete
Reject
```

Destructive actions should not visually resemble normal primary actions.
Whether a publication-status transition is available must come from the
backend contract; the frontend must not infer it from the displayed status.

---

# 19. Button Sizes

Recommended:

```text
Small → compact table/control actions
Default → standard application action
Large → only when required for prominent CTA
```

Avoid inconsistent custom button heights across features.

---

# 20. Inputs

Text inputs should consistently support:

```text
Default
Focus
Disabled
Error
```

Each form input should have:

* visible label where required;
* clear focus state;
* consistent height;
* accessible error message;
* optional supporting text where useful.

Placeholder text must not replace a required label.

---

# 21. Textarea

Use for longer content such as:

```text
Input Text
Summary / Gist
```

Textarea height should reflect expected content length.

Avoid unnecessarily large fixed-height fields.

---

# 22. Select / Dropdown

Use shadcn/ui Select or equivalent approved primitive.

Selects should have:

* visible selected value;
* clear dropdown indicator;
* keyboard support;
* focus state;
* disabled state.

Typical use cases:

```text
Urgency
Publish Status
Manual Input Status
Manual Input Source
```

---

# 23. Search

Search inputs should follow one consistent pattern.

Recommended:

```text
[ Search... ]
```

May include a Lucide search icon.

Search should not visually appear as a general text-entry form.

Clear-search behavior should be provided where useful.

---

# 24. Filters

Filters should generally be positioned together near the relevant dataset.

Example:

```text
[Search] [Urgency ▼] [Publish Status ▼]
```

Filters should:

* use consistent dimensions;
* clearly display active values;
* allow reset where appropriate;
* not hide important active filtering state.

---

# 25. Tables

Tables are a major UI pattern in this application.

Used for:

```text
Final Results
Manual Inputs
Recent Pipeline Runs
```

Table structure should prioritize readability over density.

---

# 26. Table Styling

Recommended:

```text
Clear header row
Subtle row borders
Consistent cell padding
Readable 14px text
Left alignment for text
Minimal decoration
```

Avoid heavy grid borders around every cell unless required.

---

# 27. Table Headers

Table headers should:

* use medium or semibold weight;
* use slightly muted text;
* remain visually distinct from rows;
* not use oversized typography.

---

# 28. Table Row Behaviour

Rows may support:

```text
Default
Hover
Selected where required
Disabled / locked where required
```

Avoid strong hover effects.

---

# 29. Long Table Content

Fields such as:

```text
Article Angle
Why Relevant
```

may use line clamping.

Example:

```text
2–3 visible lines
Show More
```

Do not make rows excessively tall by default.

---

# 30. Pagination

Use one consistent pagination component.

Typical structure:

```text
Showing 1–25 of 142

< Previous   1  2  3   Next >
```

Disabled navigation should be visually clear.

---

# 31. Tabs

Used by Final Results:

```text
Latest Results
History
```

Tabs should clearly distinguish:

```text
Active
Inactive
Hover
Focus
```

The active state should not rely only on subtle color differences.

---

# 32. Badges

Badges may be used for:

```text
Publish Status
Urgency
Pipeline Status
Manual Input Status
```

Badges should:

* use semantic colors;
* remain compact;
* preserve readable contrast;
* avoid excessive saturation.

Color must not be the only way to communicate status. Badges should include
readable status text and maintain sufficient contrast.

Do not use badges for normal descriptive text.

---

# 33. Modals / Dialogs

Use dialogs for focused tasks.

Current examples:

```text
Manual Input Reminder
Add Manual Input
Upload Excel
Add Category
Delete Category Confirmation
```

Modal structure:

```text
Title
Optional Description
Content
Actions
```

Action area:

```text
Cancel        Primary Action
```

Destructive confirmation:

```text
Cancel        Delete
```

---

# 34. Modal Behaviour

Dialogs should:

* trap keyboard focus;
* close using Cancel;
* support Escape where safe;
* prevent accidental duplicate submissions;
* show loading state during submission.

Do not use a modal for simple inline actions when a modal adds unnecessary friction.

---

# 35. Confirmation Dialogs

Confirmation dialogs are required for significant destructive actions.

Example:

```text
Delete Category?

Are you sure you want to delete "Competitors"?

This action cannot be undone.

[Cancel] [Delete]
```

Avoid confirmation dialogs for harmless or easily reversible actions.

---

# 36. Icons

Use:

```text
Lucide React
```

Icons should:

* support an action or meaning;
* use consistent sizing;
* not replace important text labels where meaning could be unclear.

Recommended default sizes:

```text
16px → inline / compact controls
18px → standard controls
20px → prominent controls
```

---

# 37. Navigation

Primary navigation should clearly show:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

Navigation must provide:

```text
Default
Hover
Active
Focus
```

The active screen should be visually obvious.

---

# 38. Loading States

Preferred loading patterns:

```text
Skeletons
Local loading indicators
Button loading state
```

Avoid blocking the entire page when only one section is loading.

---

# 39. Skeletons

Skeletons should approximately match the shape of expected content.

Examples:

```text
Table rows
Cards
Dashboard summary blocks
```

Avoid excessive animated placeholders.

---

# 40. Empty States

Distinguish:

## No Data

Example:

```text
No pipeline runs yet.
```

## No Filter Results

Example:

```text
No results match your current filters.

[Clear Filters]
```

These states should not use identical copy.

---

# 41. Error States

Feature-level error pattern:

```text
Unable to load Final Results.

[Retry]
```

Action error example:

```text
Unable to update Publish Status.
```

Do not show:

```text
Stack traces
Raw API messages
Internal error objects
Database information
```

---

# 42. Success Feedback

Success feedback should be concise.

Examples:

```text
Manual Input added.
Upload completed.
Category added.
Publish Status updated.
```

Avoid unnecessary success dialogs.

Use lightweight feedback such as toast notifications where appropriate.

---

# 43. Disabled States

Disabled elements should clearly look inactive while remaining readable.

Do not rely only on reduced opacity when that makes text difficult to read.

Typical disabled cases:

```text
Submitting forms
Terminal Publish Status
Unavailable pipeline actions
Pagination boundary
```

---

# 44. Focus States

All interactive controls should have visible keyboard focus indicators.

Required for:

```text
Buttons
Links
Inputs
Selects
Tabs
Dropdown items
Navigation
Expandable sections
```

Do not remove default focus indicators without providing an accessible replacement.

---

# 45. Hover States

Hover should provide subtle feedback.

Avoid large movement, scaling, or distracting animations for standard operational controls.

---

# 46. Motion

Animation should remain minimal.

Appropriate uses:

```text
Dialog opening
Dropdown opening
Accordion expansion
Loading indicator
Toast appearance
```

Avoid decorative animations unrelated to user actions.

---

# 47. Business Profile UI Pattern

Business Profile categories should use simple grouped sections/cards.

Each category should support:

```text
Category Name
Entry Count
Expand / Collapse
Add Entry
Delete Category
```

Entries should remain visually secondary to the category heading.

---

# 48. Service Taxonomy UI Pattern

Service Areas should use compact expandable cards.

Collapsed card:

```text
Service Area Name
6 service offerings                         >
```

Expanded card:

```text
Service Area Name
6 service offerings                         v

Service Offering
SEO Query
```

Multiple areas may remain expanded.

Do not visually treat this screen like an editable management interface.

---

# 49. Dashboard UI Pattern

Dashboard should emphasize operational state.

Priority:

```text
Current Pipeline State
      ↓
Pipeline Progress
      ↓
Manual Inputs
      ↓
Latest Pipeline Run
      ↓
Recent Pipeline Runs
```

Do not introduce analytics charts unless separately approved.

---

# 50. Final Results UI Pattern

Final Results should prioritize:

```text
Search / Filters
      ↓
Recommendation Table
      ↓
Publish Workflow
```

The UI should support dense information without becoming visually crowded.

---

# 51. Manual Inputs UI Pattern

Primary hierarchy:

```text
Ready Count
      ↓
Upload / Add Actions
      ↓
Search / Filters
      ↓
Manual Input Table
```

Invalid records should be visually identifiable without dominating the default Ready view.

---

# 52. Responsive Principles

Detailed breakpoints belong in the Responsive & Accessibility document.

General rules:

* avoid fixed desktop-only widths;
* stack controls when horizontal space becomes insufficient;
* avoid horizontal page scrolling;
* allow data tables to use intentional responsive handling;
* Service Taxonomy content should stack or reflow naturally when horizontal
  space is limited; the design does not require a specific two-column layout.

---

# 53. Design Token Naming

Tokens should be semantic.

Prefer:

```text
background
foreground
primary
primary-foreground
muted
muted-foreground
border
success
warning
destructive
```

These semantic tokens should be implemented centrally through the Tailwind
theme and shared CSS variables. Feature code must consume the approved token
names rather than create parallel color-token systems.

Avoid application-wide usage of raw names such as:

```text
blue-500
gray-200
red-600
```

when a semantic token exists.

---

# 54. Tailwind Usage

Feature code should consume approved semantic utilities and design tokens.

Avoid repeated arbitrary classes such as:

```text
text-[15px]
mt-[17px]
rounded-[11px]
bg-[#F9FAFB]
```

unless the design system specifically requires the value.

---

# 55. shadcn/ui Customization

shadcn/ui components should be customized centrally to match this Design System.

Do not independently restyle the same primitive differently inside multiple features.

Example:

```text
Button
Input
Dialog
Select
Tabs
```

should share consistent base styling application-wide.

---

# 56. Design System Guardrails

During implementation:

1. Use semantic design tokens.
2. Use Tailwind CSS as the primary styling system.
3. Use shadcn/ui as the base component system.
4. Use Lucide React for icons.
5. Do not mix multiple UI libraries.
6. Avoid arbitrary colors and spacing values.
7. Maintain consistent component states.
8. Use semantic colors consistently.
9. Keep typography simple and readable.
10. Avoid visual clutter.
11. Avoid unnecessary animation.
12. Prefer borders and spacing over heavy shadows.
13. Keep tables readable and operational.
14. Make focus states visible.
15. Maintain sufficient text/background contrast.
16. Do not expose backend technical information through UI styling or messages.

---

# 57. Design Decisions

| Area                    | Decision                         |
| ----------------------- | -------------------------------- |
| Visual Style            | Clean, professional, operational |
| Styling System          | Tailwind CSS                     |
| Component Foundation    | shadcn/ui                        |
| Icons                   | Lucide React                     |
| Primary Font            | Inter                            |
| Base Typography         | 14–16px                          |
| Spacing System          | 4px-based                        |
| Surface Style           | Light / neutral                  |
| Card Style              | Border + subtle radius           |
| Shadows                 | Minimal                          |
| Primary Color Direction | Blue                             |
| Success                 | Green                            |
| Warning                 | Amber                            |
| Error                   | Red                              |
| Neutral                 | Gray                             |
| Animation               | Minimal                          |
| Dark Mode               | Not required for MVP             |

---

# 58. Decisions Deferred

The following may be finalized during visual implementation:

* exact primary blue shade;
* exact neutral palette;
* exact status badge shades;
* exact semantic color token values;
* exact font-size token values;
* exact Tailwind theme values;
* exact component heights;
* exact shadow values;
* exact responsive breakpoints;
* exact table mobile behavior.

These decisions should remain consistent once selected.

---

# 59. Related Documents

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

This document defines **how the frontend should look and remain visually consistent**.

The next document should define **how the interface behaves during user interactions and state changes**:

```text
05 - UX Behaviour Rules.md
```
