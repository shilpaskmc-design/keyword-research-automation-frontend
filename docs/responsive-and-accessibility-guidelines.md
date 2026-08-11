# Responsive & Accessibility Guidelines

> [!info] Document Status
> **Status:** MVP Responsive & Accessibility Guidelines
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define minimum responsive behaviour and accessibility requirements for the frontend across supported screen sizes and interaction methods.

---

# 1. Core Principles

The frontend must:

* remain usable across supported screen sizes;
* preserve important information and actions;
* avoid horizontal page-level overflow;
* support keyboard navigation;
* provide visible focus states;
* maintain sufficient color contrast;
* avoid using color as the only source of meaning;
* use semantic HTML wherever practical.

Accessibility target:

```text
WCAG 2.1 AA
```

---

# 2. Responsive Strategy

Use a responsive desktop-first application layout while ensuring all core workflows remain usable on smaller screens.

The interface should adapt through:

```text
Flexible widths
Responsive spacing
Content wrapping
Grid changes
Controlled table overflow
Navigation adaptation
Modal adaptation
```

Do not create separate desktop and mobile applications.

---

# 3. Breakpoints

Use Tailwind CSS breakpoints consistently.

Default Tailwind breakpoints:

| Breakpoint | Minimum Width |
| ---------- | ------------: |
| `sm`       |         640px |
| `md`       |         768px |
| `lg`       |        1024px |
| `xl`       |        1280px |
| `2xl`      |        1536px |

Prefer standard Tailwind breakpoints unless a real layout problem requires otherwise.

Avoid feature-specific arbitrary breakpoints.

---

# 4. Supported Viewports

The MVP should support:

```text
Desktop
Laptop
Tablet
Mobile
```

Primary optimization priority:

```text
Desktop / Laptop
    ↓
Tablet
    ↓
Mobile
```

Mobile does not need to reproduce the desktop layout exactly.

It must preserve the ability to complete core workflows.

---

# 5. Page Layout

Main content should use available viewport width while respecting the Design System's content-width and spacing rules.

On smaller screens:

```text
Reduce horizontal padding
Stack incompatible horizontal layouts
Allow controls to wrap
Preserve readable spacing
```

The page itself should not require horizontal scrolling.

Prevent page-level overflow without hiding content. Intentional scrolling may
be used inside bounded components such as data-table containers.

---

# 6. Navigation

Desktop navigation should follow the approved application layout.

On smaller screens, navigation may collapse into:

```text
Menu button
    ↓
Navigation panel / drawer
```

Navigation must:

* expose all primary screens;
* indicate the active route;
* remain keyboard accessible;
* provide a clear accessible name for the mobile menu control.

Provide a keyboard-accessible `Skip to main content` link before primary
navigation in the document order. It may remain visually hidden until focused.

Primary screens:

```text
Dashboard
Final Results
Manual Inputs
Business Profile
Service Taxonomy
```

---

# 7. Page Headers

A typical page header may contain:

```text
Title
Description
Actions
```

Wide layout:

```text
Title / Description                  Actions
```

Narrow layout:

```text
Title
Description

Actions
```

Actions should wrap or stack rather than overflow.

---

# 8. Responsive Toolbars

Toolbars may contain:

```text
Search
Filters
Upload
Export
Primary actions
```

On wide screens:

```text
[ Search ] [ Filter ] [ Filter ]       [ Action ]
```

On narrow screens:

```text
[ Search                    ]

[ Filter ] [ Filter ]

[ Action                    ]
```

Exact arrangement depends on available space.

Important actions must not disappear solely because the viewport becomes smaller.

---

# 9. Forms

Form fields should generally use available container width.

On narrow screens:

```text
Multi-column form
    ↓
Single-column form
```

Labels, descriptions, validation messages, and controls must remain readable without horizontal scrolling.

---

# 10. Dialogs

Dialogs should use constrained width on larger screens.

On smaller screens they should:

```text
Fit within viewport
Maintain safe edge spacing
Allow internal scrolling where necessary
Keep important actions reachable
```

Dialogs must not extend beyond the usable viewport.

For long modal content:

```text
Scrollable content
+
Reachable action area
```

is preferred over page overflow.

---

# 11. Tables

Data-heavy screens include:

```text
Final Results
Manual Inputs
Recent Pipeline Runs
```

Desktop should use the normal table layout.

On smaller screens, use controlled horizontal scrolling where preserving column relationships is important.

Preferred:

```text
Table Container
    ↓
overflow-x-auto
```

Avoid forcing every table into a card layout unless the table becomes genuinely unusable.

---

# 12. Table Priority

Not all columns have equal importance.

When necessary, lower-priority information may:

```text
Wrap
Use expandable content
Move behind row details
Be hidden at specific breakpoints
```

only when the screen specification allows it.

Critical identifiers, statuses, and required actions must remain accessible.

Do not silently remove information required to complete the workflow.

---

# 13. Long Table Content

Fields such as:

```text
Article Angle
Why Relevant
```

may use:

```text
Line clamp
Show More
Show Less
```

Long content must not force uncontrolled table width.

Expanded content must remain keyboard accessible.

---

# 14. Pagination

Pagination must remain usable on narrow screens.

Lower-priority pagination information may be simplified.

Example:

Desktop:

```text
Showing 26–50 of 183     [1] [2] [3] [4] [Next]
```

Mobile:

```text
[Previous]    Page 2    [Next]
```

Core Previous/Next navigation must remain available.

---

# 15. Dashboard Responsiveness

Dashboard sections should stack as viewport width decreases.

Conceptually:

```text
Wide
┌───────────────┬───────────────┐
│ Section       │ Section       │
└───────────────┴───────────────┘

Narrow
┌───────────────────────────────┐
│ Section                       │
├───────────────────────────────┤
│ Section                       │
└───────────────────────────────┘
```

Pipeline stages must remain readable without requiring precise horizontal alignment.

---

# 16. Business Profile Responsiveness

Category cards should use available width.

Inline Add Entry controls may appear horizontally when space permits:

```text
[ Entry Value                         ] [Add]
```

On narrow screens:

```text
[ Entry Value                              ]

[ Add                                      ]
```

Expanded entry values should wrap safely.

---

# 17. Service Taxonomy Responsiveness

Service Area layout should respond to available width rather than enforce a fixed column count.

Collapsed and expanded cards must remain readable on narrow screens.

Long:

```text
Service Area names
Service Offering names
SEO Queries
```

should wrap rather than overflow.

---

# 18. Text Scaling

The interface must remain usable when browser text is enlarged.

Do not depend on fixed-height containers for text-heavy UI.

Prefer:

```text
min-height
padding
natural content growth
```

over rigid heights.

Text should not become clipped when enlarged.

---

# 19. Semantic HTML

Use semantic elements where appropriate.

Prefer:

```html
<button>
<nav>
<main>
<header>
<section>
<table>
<form>
<label>
```

Avoid clickable:

```html
<div>
<span>
```

when a native interactive element is appropriate.

Native semantics should be preferred over recreating behaviour with ARIA.

---

# 20. Heading Structure

Pages should use a logical heading hierarchy.

Example:

```text
h1 → Page Title
h2 → Major Section
h3 → Subsection
```

Do not select heading levels based only on visual size.

Each page should normally contain one primary `h1`.

---

# 21. Keyboard Accessibility

All interactive functionality must be usable without a mouse.

Users must be able to reach:

```text
Navigation
Buttons
Links
Tabs
Filters
Selects
Forms
Dialog actions
Expandable controls
Pagination
Table actions
```

using the keyboard.

---

# 22. Keyboard Interaction

Expected behaviour:

| Key           | Behaviour                           |
| ------------- | ----------------------------------- |
| `Tab`         | Move to next focusable element      |
| `Shift + Tab` | Move to previous focusable element  |
| `Enter`       | Activate relevant control           |
| `Space`       | Activate button-like controls       |
| `Escape`      | Close safe dismissible overlays     |
| Arrow Keys    | Navigate components where supported |

shadcn/ui component keyboard behaviour should be preserved.

---

# 23. Focus Visibility

Keyboard focus must always be visible.

Use the approved Design System focus treatment.

Do not remove browser/component focus indicators unless replaced with an accessible alternative.

Avoid:

```css
outline: none;
```

without an equivalent visible focus style.

---

# 24. Focus Management

When a dialog opens:

```text
Focus moves into dialog
```

When it closes:

```text
Focus returns to triggering control where practical
```

For validation failure, focus may move to the first invalid field where useful.

Dynamic UI changes should not unexpectedly move focus.

---

# 25. Focus Order

Focus order should follow the logical visual and reading order.

Avoid using positive `tabindex` values to manually rearrange focus.

Preferred:

```text
DOM order
=
Logical interaction order
```

---

# 26. Labels

Form controls must have accessible labels.

Preferred:

```html
<label for="category-name">
  Category Name
</label>
```

Placeholder text must not replace a label.

Icon-only controls require an accessible name.

Example:

```text
Trash icon
→ accessible name: "Delete category"
```

---

# 27. Validation Accessibility

Validation messages should be programmatically associated with their field.

When appropriate use:

```text
aria-invalid
aria-describedby
```

Example relationship:

```text
Input
    ↓
Validation Message
```

Users must not have to rely on red color alone to identify invalid fields.

---

# 28. Status Accessibility

Status indicators must include readable text.

Do not communicate state only through:

```text
Color
Icon
Position
```

Correct:

```text
● Running
```

Incorrect:

```text
●
```

where color alone communicates Running.

---

# 29. Color Contrast

All foreground/background combinations must meet the Design System's WCAG 2.1 AA target.

As a general requirement:

```text
Normal text → minimum 4.5:1
Large text  → minimum 3:1
```

Interactive boundaries and meaningful graphical elements should maintain sufficient contrast where required.

---

# 30. Color Independence

Color must not be the only indicator for:

```text
Pipeline state
Publish Status
Urgency
Validation errors
Selected state
Success / failure
```

Use additional signals such as:

```text
Text
Icons
Labels
Borders
Shape
```

---

# 31. Buttons and Interactive Targets

Interactive controls must provide sufficient target size and spacing.

Recommended minimum target:

```text
44 × 44 CSS pixels where practical
```

Compact desktop controls may visually appear smaller where appropriate, but must remain easy to activate and distinguish.

Avoid tightly packed icon-only controls.

---

# 32. Links vs Buttons

Use:

```text
Link
→ Navigation

Button
→ Action
```

Examples:

```text
View Final Results → Link / navigation action

Start Pipeline → Button

Delete Category → Button
```

Do not style non-interactive text to look clickable.

---

# 33. Icons

Icons should support rather than replace meaning.

Icon-only controls require:

```text
Accessible name
Tooltip where useful
Visible focus
```

Decorative icons should not create unnecessary screen-reader announcements.

---

# 34. Images and Decorative Content

If meaningful images are introduced later, provide appropriate alternative text.

Decorative visual elements should not receive unnecessary alternative text.

The current MVP should not rely on images to communicate essential workflow information.

---

# 35. Loading Accessibility

Loading states should communicate meaningful activity where necessary.

Examples:

```text
Loading Final Results…
Uploading file…
Starting pipeline…
```

Do not rely solely on spinner animation.

Long-running asynchronous operations should expose meaningful textual state.

Use live regions for meaningful asynchronous updates where appropriate:

```text
aria-live="polite" → background refreshes, upload results, success feedback,
                     and pipeline stage changes
aria-live="assertive" → urgent errors requiring immediate attention
```

Use assertive announcements sparingly and do not announce every minor visual
change.

---

# 36. Error Accessibility

Errors must be:

```text
Visible
Readable
Associated with relevant context
Not communicated by color alone
```

Page/section errors should expose Retry controls through normal keyboard navigation.

Toasts must have readable text and appropriate live-region behavior. Important
errors must not be communicated only through a toast; provide contextual or
inline feedback where the user needs to act.

---

# 37. Empty States

Empty states should clearly distinguish:

```text
No data exists
No filter results
No open work
```

Any recovery action such as:

```text
Clear Filters
Add Manual Input
Retry
```

must be keyboard accessible.

---

# 38. Expand / Collapse Controls

Expandable controls must expose their state.

Use:

```text
aria-expanded="true"
```

or:

```text
aria-expanded="false"
```

where appropriate.

This applies to:

```text
Business Profile categories
Service Taxonomy areas
Expandable table content
```

---

# 39. Tabs

Tabs should use the accessibility behaviour provided by the approved UI primitive.

For Final Results:

```text
Latest Results
History
```

must expose:

```text
Active tab
Keyboard navigation
Associated tab panel
```

Do not recreate tab behaviour manually when the existing accessible primitive supports it.

---

# 40. Tables and Screen Readers

Use semantic table structure:

```html
<table>
<thead>
<tbody>
<tr>
<th>
<td>
```

Column headers must use `<th>`.

Avoid building data tables entirely from generic `<div>` elements unless a specific requirement makes semantic tables unsuitable.

On small screens, row actions must remain reachable and identifiable. Users
must not need hover interaction to discover or operate an action hidden by the
responsive layout.

---

# 41. Responsive Content Hiding

Before hiding content at a breakpoint, determine whether it is required for:

```text
Understanding the record
Making a decision
Completing an action
Identifying status
```

If yes, preserve access through another mechanism.

Responsive design must not create functional differences that block smaller-screen users.

---

# 42. Motion

Avoid unnecessary motion.

Animations should:

```text
Be short
Support understanding
Not delay interaction
```

Respect:

```css
prefers-reduced-motion
```

for non-essential animation where applicable.

Pipeline progress must not use distracting continuous animation merely to indicate activity.

---

# 43. Zoom and Reflow

The interface should remain usable with browser zoom and increased text size.

Avoid:

```text
Fixed-width page layouts
Text clipping
Overlapping controls
Horizontal page scrolling caused by normal content
```

Data tables may use their own controlled horizontal scroll container.

---

# 44. Accessibility Testing

Before considering a screen complete, perform basic checks using:

```text
Keyboard-only navigation
Browser zoom
Responsive viewport testing
Visible focus inspection
Form error testing
Contrast verification
```

Automated accessibility tooling may supplement these checks but does not replace manual keyboard testing.

---

# 45. Minimum Responsive Test Widths

During development, test representative widths around:

```text
375px   → Mobile
768px   → Tablet
1024px  → Small desktop / laptop
1440px  → Desktop
```

These are test targets, not additional CSS breakpoints.

Layouts should also behave correctly between these widths.

---

# 46. MVP Accessibility Checklist

Before completing a screen, verify:

* [ ] Page has a clear `h1`
* [ ] Heading hierarchy is logical
* [ ] All actions are keyboard reachable
* [ ] Focus is visible
* [ ] Focus order is logical
* [ ] Form fields have labels
* [ ] Errors are associated with fields
* [ ] Color is not the only status indicator
* [ ] Icon-only controls have accessible names
* [ ] Dialog focus behaviour works
* [ ] Expandable controls expose state
* [ ] Tables use semantic markup
* [ ] Content remains usable on mobile
* [ ] Page has no unintended horizontal overflow
* [ ] Text remains usable when enlarged
* [ ] Loading/error states contain readable text
* [ ] Core workflows remain usable without a mouse

---

# 47. Responsive Guardrails

1. Use standard Tailwind breakpoints by default.
2. Do not create arbitrary breakpoints without a demonstrated need.
3. Preserve all core actions on smaller screens.
4. Stack layouts when horizontal space becomes insufficient.
5. Allow text to wrap naturally.
6. Keep page-level horizontal overflow disabled by design.
7. Allow controlled table-level horizontal scrolling.
8. Do not force every responsive table into cards.
9. Do not hide workflow-critical information without an alternative.
10. Avoid fixed heights for text-heavy content.

---

# 48. Accessibility Guardrails

1. Target WCAG 2.1 AA.
2. Prefer semantic HTML.
3. Preserve shadcn/ui accessibility behaviour.
4. Support keyboard-only interaction.
5. Keep focus visible.
6. Do not use color as the only communication method.
7. Provide accessible labels for controls.
8. Associate validation messages with fields.
9. Manage focus correctly in dialogs.
10. Use semantic tables for tabular data.
11. Expose expanded/collapsed state programmatically.
12. Respect reduced-motion preferences.
13. Do not rely solely on automated accessibility testing.
14. Accessibility fixes must not be deferred solely because the application is an internal marketing tool.

---

# 49. Related Documents

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
13. Definition of Done
```

This document defines **how the frontend adapts across viewport sizes and the minimum accessibility requirements every MVP screen must satisfy**.
