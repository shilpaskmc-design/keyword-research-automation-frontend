# Business Profile Screen Specification

## 1. Purpose

The **Business Profile** screen stores relatively stable information about the business that is used by the keyword research pipeline.

This information is not expected to change frequently.

The screen should therefore be optimized primarily for:

- viewing business-profile information;
    
- organizing information into categories;
    
- adding new categories when required;
    
- adding entries to an existing category;
    
- deleting entries;
    
- deleting categories safely.
    

There is currently no role-based access control. Marketing-team users can manage the Business Profile.

---

# 2. Data Structure

Business Profile information follows a simple structure:

```text
Category
    ├── Entry
    ├── Entry
    ├── Entry
    └── ...
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

---

# 3. Categories

Categories group related Business Profile entries.

Examples may include:

- About Us
    
- Competitors
    
- Target Audience
    
- Intended Client Portfolio
    
- Target Markets
    
- Brand Positioning
    

Category names are user-created and should not be hard-coded by the frontend.

---

# 4. Category Display

Each category should remain visible on the Business Profile screen.

The category itself should **not collapse**.

Only the list of entries inside the category should be collapsible.

Example collapsed state:

```text
Competitors

ENTRIES (30)                                      >
```

Example expanded state:

```text
Competitors

ENTRIES (30)                                      v

Competitor A
Competitor B
https://competitor-example.com
...
```

The number of entries should be displayed beside or within the Entries section.

---

# 5. Internal Category IDs

Internal category IDs should **not be displayed** in the frontend.

Do not show values such as:

```text
Category ID 1
Category ID 2
Category ID 3
```

These are implementation details and are not useful to marketing users.

---

# 6. Add Category

The permanent **Add Category** form should be removed from the side of the page.

Instead, provide a primary action near the page heading:

```text
Business Profile

Business information used by the research pipeline.

                                      [ + Add Category ]
```

Clicking **Add Category** should open a modal.

Example:

```text
┌─────────────────────────────────┐
│ Add Category                    │
│                                 │
│ Category Name                   │
│ [                           ]   │
│                                 │
│ [Cancel]        [Add Category] │
└─────────────────────────────────┘
```

The category name must not be empty.

After successful creation:

- close the modal;
    
- refresh the category list;
    
- show the newly created category.
    

---

# 7. Category Rename

Category renaming is **not currently supported**.

The frontend should therefore not show an Edit Category or Rename Category action in the current version.

This can be reconsidered later if backend support is added.

---

# 8. Delete Category

Categories can be deleted.

Because category deletion is a destructive action, clicking the delete action must **not immediately delete the category**.

A confirmation modal should appear first.

Example:

```text
┌────────────────────────────────────────────┐
│ Delete Category?                           │
│                                            │
│ Are you sure you want to delete            │
│ "Competitors"?                             │
│                                            │
│ This action cannot be undone.              │
│                                            │
│ [Cancel]                  [Delete]         │
└────────────────────────────────────────────┘
```

The exact behavior when a category contains existing entries should follow backend rules.

The frontend must not guess whether deleting a category automatically deletes its entries.

---

# 9. Entries

Each category contains one or more entries.

An entry contains only a **single text value**.

Examples:

```text
Japanese manufacturers
```

```text
Foreign companies planning to enter India
```

```text
https://example.com
```

Entries may therefore contain either:

- normal text;
    
- a URL/link.
    

No field-name/value structure is required for Business Profile entries.

---

# 10. Add Entry

Adding entries should use an **inline input** inside the relevant category.

A modal is not required because an entry contains only one value.

Example:

```text
[ New entry...                                      ] [ Add ]
```

Each input belongs to one specific category.

The user should be able to:

1. type the entry;
    
2. click **Add**;
    
3. have the entry added to that category.
    

Empty values should not be submitted.

After a successful add:

- clear the input field;
    
- refresh the entries;
    
- update the entry count.
    

---

# 11. Entry Links

Because an entry may contain a URL, valid URL entries may be presented as clickable links when displayed.

Example:

```text
https://www.example.com
```

The backend value should remain the stored text value.

The frontend should not modify or infer additional information from the URL.

---

# 12. Entry Expansion and Collapse

The Entries area should be collapsible.

Example:

```text
ENTRIES (30)                                      >
```

Clicking it expands the list:

```text
ENTRIES (30)                                      v

Competitor A                                      Delete
Competitor B                                      Delete
https://competitor-example.com                    Delete
...
```

Clicking again collapses the list.

The category heading itself should always remain visible.

---

# 13. Delete Entry

Individual entries can be deleted.

A delete action should be available for each entry when the entry list is expanded.

Example:

```text
Competitor A                                     [Delete]
Competitor B                                     [Delete]
```

Entry editing is not currently supported.

Therefore the frontend should not display an Edit Entry action in the current version.

Whether entry deletion requires its own confirmation dialog can be finalized separately based on the desired interaction and backend behavior.

---

# 14. Search

Search is **not required** for the MVP Business Profile screen.

The expected amount of profile information does not currently justify adding search functionality.

Search can be considered later if the number of categories or entries becomes difficult to navigate.

---

# 15. Recommended Screen Layout

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Business Profile                                                        │
│ Business information used by the research pipeline.                    │
│                                                   [ + Add Category ]    │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ About Us                                                   [Delete] │ │
│ │                                                                     │ │
│ │ ENTRIES (3)                                                >        │ │
│ │                                                                     │ │
│ │ [ New entry...                                  ] [ Add ]          │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Competitors                                                [Delete] │ │
│ │                                                                     │ │
│ │ ENTRIES (30)                                               >        │ │
│ │                                                                     │ │
│ │ [ New entry...                                  ] [ Add ]          │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Target Audience                                            [Delete] │ │
│ │                                                                     │ │
│ │ ENTRIES (5)                                                >        │ │
│ │                                                                     │ │
│ │ [ New entry...                                  ] [ Add ]          │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 16. Expanded Category Example

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Competitors                                                [Delete] │
│                                                                     │
│ ENTRIES (3)                                                v        │
│                                                                     │
│ Competitor A                                              [Delete] │
│ Competitor B                                              [Delete] │
│ https://competitor-example.com                            [Delete] │
│                                                                     │
│ [ New entry...                                  ] [ Add ]          │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 17. Screen Behaviour

## Normal Viewing

When the page opens:

- all categories are visible;
    
- entry lists may remain collapsed;
    
- each category shows its entry count;
    
- Add Entry input remains available inside each category;
    
- Add Category is available near the page heading.
    

## Add Category

```text
Business Profile
      ↓
+ Add Category
      ↓
Add Category Modal
      ↓
Submit
      ↓
New category appears
```

## Add Entry

```text
Category
      ↓
Enter text in inline input
      ↓
Add
      ↓
Entry added
      ↓
Entry count updates
```

## Delete Category

```text
Delete Category
      ↓
Confirmation Modal
      ↓
Cancel
OR
Confirm Delete
```

---

# 18. What Should Not Be Shown

The Business Profile screen should not expose unnecessary technical information.

Do not show:

- category database IDs;
    
- entry database IDs;
    
- internal UUIDs;
    
- API information;
    
- raw JSON;
    
- database metadata;
    
- pipeline diagnostics;
    
- technical timestamps unless later required by users.
    

The screen should remain focused on business information.

---

# 19. Current Supported Actions

Based on the current Business Profile behavior, the frontend should support:

|Action|Current Requirement|
|---|---|
|View categories|Yes|
|Add category|Yes|
|Rename category|No|
|Delete category|Yes|
|View entries|Yes|
|Collapse/expand entries|Yes|
|Add entry|Yes|
|Edit entry|No|
|Delete entry|Yes|
|Search|No|
|Role restrictions|No|

---

# 20. Current Finalized Decisions

The current agreed direction is:

- Business Profile is a dedicated screen.
    
- The data changes relatively infrequently.
    
- Marketing-team users can currently manage it because role-based permissions are not implemented.
    
- Business information is organized into categories.
    
- Category names are user-defined.
    
- Category IDs are hidden.
    
- Categories themselves are always visible.
    
- Only the entries inside categories are collapsible.
    
- Entry counts are displayed.
    
- Add Category uses a button near the page heading.
    
- Add Category opens a modal.
    
- The permanent right-side Add Category panel should be removed.
    
- Categories cannot currently be renamed.
    
- Categories can be deleted.
    
- Category deletion requires a confirmation modal.
    
- Entries contain one text value only.
    
- Entry values may contain URLs.
    
- Add Entry uses an inline text input and Add button.
    
- Entries can be deleted.
    
- Entries cannot currently be edited.
    
- No Business Profile search is required for MVP.
    
- The screen should be optimized primarily for viewing and occasional maintenance.
    

---

# 21. Still To Be Finalized

The following items should be confirmed before implementation is considered complete:

- whether deleting a category also deletes all entries in that category;
    
- whether category deletion should be blocked when entries exist;
    
- whether individual entry deletion also requires confirmation;
    
- maximum category-name length;
    
- maximum entry-text length;
    
- URL rendering/link behavior;
    
- ordering of categories;
    
- ordering of entries;
    
- whether duplicate category names are allowed;
    
- whether duplicate entries inside the same category are allowed;
    
- exact backend validation and error messages;
    
- future role-based permissions if roles are introduced later.
    

---

# Google Stitch Wireframe Prompt

Create a low-fidelity desktop web application wireframe for the **Business Profile** screen of an internal keyword research tool used by a marketing team.

Use the same application layout and navigation style as the existing Home, Manual Inputs and Final Results screens.

At the top show:

- page title "Business Profile";
    
- short description saying this information is used by the research pipeline;
    
- a "+ Add Category" button on the right.
    

Do not show a permanent Add Category form.

Display Business Profile categories as vertical cards or sections.

Example categories:

- About Us
    
- Competitors
    
- Target Audience
    
- Intended Client Portfolio
    

Do not show Category IDs.

Each category should:

- always remain visible;
    
- show the number of entries;
    
- have an Entries section that can expand or collapse;
    
- provide an inline "New entry..." input and Add button;
    
- provide a category delete action.
    

When Entries is expanded, show simple text entries underneath. Some entries may be URLs. Each entry can have a delete action.

Do not provide category rename or entry edit actions.

When a category delete action is clicked, show a confirmation modal before deletion.

Also create an Add Category modal containing:

- Category Name input;
    
- Cancel button;
    
- Add Category button.
    

Do not add search, charts, analytics, technical IDs, API information, diagnostics or unrelated statistics.

Keep the design simple, professional and optimized primarily for viewing business information with occasional editing.