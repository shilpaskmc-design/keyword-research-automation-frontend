# Form & Validation Specification

> [!info] Document Status
> **Status:** MVP Form & Validation Rules
> **Product:** Keyword Research Automation Frontend
> **Purpose:** Define frontend form behaviour, validation responsibilities, submission rules, and field-level requirements for the current MVP.

---

# 1. Validation Principles

Frontend validation exists to improve usability.

Backend validation remains authoritative.

General flow:

```text
User Input
    ↓
Frontend Validation
    ↓
Submit Request
    ↓
Backend Validation
    ↓
Success or Error
```

The frontend must not duplicate complex backend business rules unless explicitly required for UX.

---

# 2. Validation Technology

Recommended:

```text
React Hook Form
Zod
```

Use them where structured form handling adds value.

Very small inline forms may use local React state.

---

# 3. Validation Timing

Preferred behaviour:

```text
Initial validation → On Submit
Existing field error → Revalidate on change or blur
Simple required field → May validate on blur
```

Avoid showing aggressive validation errors before the user has interacted with a field.

---

# 4. Error Display

Field-specific validation errors should appear near the affected field.

Example:

```text
Category Name

[                     ]

Category name is required.
```

General form failures should appear at form level.

Do not expose raw backend exceptions or technical validation objects directly.

---

# 5. Backend Validation Errors

If the backend returns field-specific validation details:

* map them to the corresponding field where possible;
* preserve safe backend validation messages;
* use form-level error messaging when the error cannot be mapped to one field.

Frontend behaviour should use stable backend error codes/status where applicable.

---

# 6. Required Field Rules

Required fields must:

* have visible labels;
* be clearly indicated where useful;
* reject empty meaningful values;
* trim surrounding whitespace where appropriate.

Whitespace-only values should generally be treated as empty.

---

# 7. Submission Rules

While a form submission is pending:

```text
Disable repeated submission
Show loading state
Preserve entered values
```

On success:

```text
Refresh affected data
Close modal where appropriate
Reset temporary form state
Show lightweight success feedback where useful
```

On failure:

```text
Keep entered values
Show relevant error
Allow correction / retry
```

---

# 8. Manual Input Form

Used by:

```text
Add Manual Input
```

Fields:

```text
Input Text
Summary / Gist
Additional Details
```

---

# 9. Manual Input — Input Text

Backend field:

```text
raw_text
```

Frontend label:

```text
Input Text
```

Rules:

```text
Required
String
Trim surrounding whitespace
Must not be empty after trimming
```

Exact maximum length, if any, must follow the backend/OpenAPI contract.

---

# 10. Manual Input — Summary / Gist

Backend field:

```text
gist
```

Frontend label:

```text
Summary / Gist
```

Rules:

```text
Optional
String
Trim surrounding whitespace
```

Empty optional values should preferably be omitted or submitted according to the API contract rather than converted into arbitrary placeholder values.

---

# 11. Manual Input — Additional Details

Backend field:

```text
extra_data
```

Frontend representation:

```text
Field / Value rows
```

Example:

```text
Target Country → Japan
Service        → BIS
```

Users must not be required to manually write JSON.

---

# 12. Additional Details Row

Frontend type:

```typescript
interface AdditionalDetailField {
  key: string
  value: string
}
```

Rules:

```text
Key and value should be trimmed
Completely empty rows should be ignored
A row with only key or only value should be treated as incomplete
Duplicate keys should be rejected before submission
```

`extra_data` is an object, so duplicate keys cannot be preserved reliably.
Reject duplicate keys for the MVP rather than silently overwriting values.

---

# 13. Manual Input Request Mapping

Frontend form:

```text
inputText
gist
additionalDetails
```

maps to:

```text
raw_text
gist
extra_data
```

Mapping should occur before submission.

---

# 14. Manual Input Example Schema

Conceptual frontend schema:

```typescript
const manualInputSchema = z.object({
  inputText: z.string().trim().min(1, "Input Text is required."),
  gist: z.string().trim().optional(),
  additionalDetails: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
})
```

Final schema should match confirmed product and backend constraints.

---

# 15. Excel Upload Form

Used by:

```text
Upload Excel
```

Primary input:

```text
File
```

Rules:

```text
File required before Upload
Only XLSX files are accepted
Prevent duplicate upload while pending
```

The upload request uses the backend-supported XLSX content type:

```text
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

---

# 16. Excel Upload Validation

Frontend may validate:

```text
File selected
File extension / type where reliably known
Basic file-size constraint if backend defines one
```

Backend remains authoritative for:

```text
Workbook structure
Required columns
Row validation
Malformed workbook detection
Record eligibility
```

---

# 17. Excel Upload Result

The frontend must support responses containing:

```text
Ready records
Invalid records
Validation information
Partial valid / invalid result
```

Invalid records must not be presented as successfully accepted.

---

# 18. Add Category Form

Used by:

```text
Business Profile → Add Category
```

Field:

```text
Category Name
```

Rules:

```text
Required
String
Trim surrounding whitespace
Must not be empty after trimming
```

Exact:

```text
Maximum length
Duplicate-name behaviour
Character restrictions
```

must follow backend/product rules.

---

# 19. Add Category Example Schema

Conceptually:

```typescript
const addCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required."),
})
```

Do not invent frontend-only length limits without backend/product approval.

---

# 20. Add Entry Form

Used inline within a Business Profile category.

Field:

```text
Entry Value
```

Rules:

```text
Required
String
Trim surrounding whitespace
Must not be empty after trimming
```

The value may contain:

```text
Normal text
URL
```

Do not require URL format unless the product explicitly introduces a URL-only field.

---

# 21. Add Entry Submission

Flow:

```text
Enter value
    ↓
Validate
    ↓
Submit
    ↓
Success
    ↓
Clear input
    ↓
Refresh entries / count
```

If submission fails, preserve the entered value.

---

# 22. Delete Category Confirmation

Delete Category is not a form in the normal sense but requires explicit confirmation.

Confirmation must clearly identify the target category.

Example:

```text
Delete Category?

Are you sure you want to delete "Competitors"?

[Cancel] [Delete]
```

Backend remains authoritative regarding deletion when entries exist.

---

# 23. Publish Status Update

Publish Status uses a controlled selection rather than free text.

Known values:

```text
Pending
Approved
Published
Reject
```

The frontend must use the backend-supported status value.

The frontend must not allow arbitrary custom text.

Closed backend status values should use generated OpenAPI types at the request
boundary. Frontend display labels and validation schemas may wrap those types,
but must not create conflicting backend status unions.

---

# 24. Publish Status Validation

Backend remains authoritative for allowed transitions.

Frontend responsibilities:

```text
Use valid known status value
Submit backend row_id
Prevent duplicate update
Handle rejected transition safely
```

Do not infer allowed transitions solely from the current label or color.

---

# 25. Search Inputs

Search fields should:

```text
Trim unnecessary surrounding whitespace where appropriate
Allow empty value to clear search
Not apply form-style required validation
```

Search is not treated as a required form.

---

# 26. Filter Controls

Filters should use constrained values rather than free text where options are known.

Examples:

```text
Urgency
Publish Status
Manual Input Status
Manual Input Source
```

Filter values must map to backend-supported query values.

---

# 27. Numeric Filter Validation

Where numeric filters are used, such as:

```text
relevance_min
relevance_max
rank_min
rank_max
```

frontend validation should ensure:

```text
Valid number
relevance_min / relevance_max → 0–10
rank_min / rank_max → minimum 1
Minimum does not exceed maximum where both exist
```

These limits come from OpenAPI. Do not invent additional numeric limits.

---

# 28. Pagination Validation

Frontend-generated pagination values must satisfy API constraints.

Current Final Results direction:

```text
page >= 1

page_size:
minimum = 1
maximum = 100
```

Users should not normally type pagination values directly.

---

# 29. URL / Query Validation

URL-backed state must be validated before use.

Examples:

```text
tab
run
page
filters
```

Known URL-state constraints:

```text
tab → latest or history
run → UUID
page → integer >= 1
page_size → integer 1–100
```

Invalid URL values should fall back safely rather than crash the screen.

Example:

```text
Unknown tab
→ default to Latest Results
```

Do not send invalid query values blindly to the backend.

---

# 30. Optional Values

Optional values should be handled consistently.

Prefer:

```text
undefined / omission
```

where the API expects absence.

Avoid sending:

```text
""
null
```

unless the backend contract explicitly expects them.

---

# 31. Whitespace Handling

For normal text-entry forms:

```text
Trim leading/trailing whitespace before validation/submission
Preserve meaningful internal whitespace
```

Do not aggressively rewrite user-entered content.

---

# 32. Unknown Backend Validation

If backend validation changes or returns an unknown field/error:

```text
Do not crash
Show safe form-level error
Preserve entered data
Expose enough detail during development to identify contract drift
```

---

# 33. Form State Ownership

Form state belongs to the feature that owns the form.

Examples:

```text
Manual Inputs
→ AddManualInputForm

Business Profile
→ AddCategoryForm
→ AddEntryInput
```

Do not store temporary form values in global application state.

---

# 34. Unsaved Form Data

For current MVP forms:

```text
Simple forms
→ no confirmation required by default

Meaningful multi-field entered data
→ avoid accidental dismissal where practical
```

Do not add unsaved-change dialogs to every small form.

---

# 35. Reset Behaviour

On successful submission:

```text
Modal form
→ close and reset

Inline Add Entry
→ clear value

Upload
→ clear selected file after completed workflow
```

A valid or partially valid backend upload result counts as a completed
workflow. If the request or network operation fails, preserve the selected
file so the user can retry.

On error:

```text
Do not reset entered data automatically
```

---

# 36. Accessibility Requirements

Form controls must provide:

```text
Visible label
Keyboard access
Visible focus
Error association
Disabled state
```

Placeholder text must not replace a required label.

Detailed accessibility standards belong in the Responsive & Accessibility document.

---

# 37. Validation Guardrails

1. Backend validation remains authoritative.
2. Frontend validation should improve UX, not recreate business logic.
3. Do not invent maximum lengths or numeric ranges.
4. Trim surrounding whitespace where appropriate.
5. Treat whitespace-only required values as empty.
6. Preserve entered data after failed submission.
7. Prevent duplicate form submission.
8. Map backend field errors where possible.
9. Do not display raw backend technical errors.
10. Use constrained controls for known enum/status values.
11. Do not require users to write JSON.
12. Do not validate optional fields as required.
13. Keep temporary form state feature-local.
14. Do not reset forms after failed requests.
15. Use generated API types for request boundaries.

---

# 38. MVP Form Inventory

| Form / Interaction    | Validation Level                        |
| --------------------- | --------------------------------------- |
| Add Manual Input      | Structured form validation              |
| Additional Details    | Structured row validation               |
| Excel Upload          | File presence/basic frontend validation |
| Add Category          | Simple required-text validation         |
| Add Entry             | Simple required-text validation         |
| Delete Category       | Confirmation                            |
| Publish Status Update | Controlled backend value                |
| Search                | Lightweight query input                 |
| Filters               | Controlled values                       |
| Pagination            | Programmatic validation                 |

---

# 39. Decisions Still Dependent on Backend/Product Rules

The frontend must not invent these:

```text
Manual Input text maximum length
Summary maximum length
Additional Details limits
Maximum upload file size
Excel required columns
Category maximum length
Duplicate category rules
Entry maximum length
Duplicate entry rules
Category deletion behaviour with entries
Allowed Publish Status transitions
```

Use OpenAPI/backend/product decisions when available.

---

# 40. Related Documents

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

This document defines **how frontend forms validate, submit, preserve, and map user input while keeping backend validation authoritative**.
