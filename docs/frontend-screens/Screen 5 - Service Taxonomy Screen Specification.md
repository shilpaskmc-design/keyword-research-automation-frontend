# Service Taxonomy Screen Specification

## 1. Purpose

The **Service Taxonomy** screen provides a read-only view of the services used by the keyword research pipeline.

The primary users are members of the marketing team.

The screen should help users quickly:

- understand all available Service Areas;
    
- expand a Service Area to view its Service Offerings;
    
- see the SEO Query associated with an offering;
    
- search for a particular service or offering;
    
- browse the complete taxonomy without being forced to scroll through every offering.
    

The screen is currently **read-only**.

Users cannot:

- add Service Areas;
    
- add Service Offerings;
    
- edit taxonomy data;
    
- delete taxonomy data;
    
- reorder taxonomy data.
    

---

# 2. Taxonomy Structure

The taxonomy follows a hierarchical structure:

```text
Service Area
    ├── Service Offering
    │      └── SEO Query
    ├── Service Offering
    │      └── SEO Query
    └── Service Offering
           └── SEO Query
```

Example:

```text
Assurance and Risk Management
    ├── Compliance Audits
    │      └── Compliance Audit
    ├── Due Diligence
    │      └── Corporate Due Diligence
    └── External Audits
           └── External Audit
```

The screen should visually preserve this hierarchy.

---

# 3. Main UX Problem With the Current Screen

The current screen displays every Service Area together with all of its Service Offerings by default.

This makes the page unnecessarily long.

For example, if a Service Area contains 20 or 30 offerings, users must scroll through all of those offerings before reaching the next Service Area.

This makes it difficult for a marketing user who only wants to answer:

> What Service Areas are available?

The redesigned screen should therefore use **progressive disclosure**.

Service Areas should be visible first.

Service Offerings should only appear when the user chooses to expand a Service Area.

---

# 4. Default Screen State

All Service Areas should be **collapsed by default**.

Example:

```text
Service Taxonomy

Browse the services used by the keyword research pipeline.

[ Search services... ]                         [ Expand All ]


Assurance and Risk Management
6 service offerings                                      >


BFSI Advisory
8 service offerings                                      >


Business Registration
7 service offerings                                      >


Customs and Foreign Trade Policy
12 service offerings                                     >
```

This allows users to quickly scan the complete list of Service Areas.

---

# 5. Service Area Display

Each Service Area should display:

- Service Area name;
    
- number of Service Offerings;
    
- expand/collapse control.
    

Example:

```text
Assurance and Risk Management

6 service offerings                                      >
```

Do not show internal identifiers such as:

```text
Area ID 2
Area ID 3
```

Internal IDs are implementation details and provide no value to marketing users.

---

# 6. Expanding a Service Area

When the user expands a Service Area, show its Service Offerings underneath.

Example:

```text
Assurance and Risk Management

6 service offerings                                      v


Compliance Audits
Compliance Audit


Due Diligence
Corporate Due Diligence


External Audits
External Audit


Forensic Audits
Forensic Audit


Internal Controls and SOP Formulations
Internal Controls and SOP


Management Audits
Management Audit
```

The Service Area remains visible while its offerings expand below it.

---

# 7. Service Offering Display

Each Service Offering should show:

1. Service Offering name
    
2. SEO Query
    

Example:

```text
Due Diligence
Corporate Due Diligence
```

Recommended hierarchy:

```text
Due Diligence                ← Service Offering
Corporate Due Diligence      ← SEO Query
```

The Service Offering name should be visually more prominent than its SEO Query.

---

# 8. SEO Query

The SEO Query should remain visible because it helps marketing users understand the search concept associated with a particular Service Offering.

Recommended UI label:

**SEO Query**

If the interface becomes visually crowded, the label does not have to repeat on every row.

For example:

```text
Due Diligence
SEO Query: Corporate Due Diligence
```

or a lighter presentation:

```text
Due Diligence
Corporate Due Diligence
```

The exact visual styling can be finalized later.

---

# 9. Expand and Collapse Behaviour

Each Service Area should support independent expand/collapse behaviour.

Example collapsed:

```text
BFSI Advisory
8 service offerings                                      >
```

Example expanded:

```text
BFSI Advisory
8 service offerings                                      v

Audit & Governance Support
Corporate Governance

Audit & Regulatory Support
Audit Committee

Basel & Regulatory Capital Advisory
Basel

...
```

Users should be able to have multiple Service Areas expanded at the same time.

The UI should not force an accordion where opening one area automatically closes another.

---

# 10. Expand All / Collapse All

Provide a secondary action near the search field:

```text
[ Expand All ]
```

When selected, all Service Areas expand.

The control then changes to:

```text
[ Collapse All ]
```

This supports users who intentionally want to browse the entire taxonomy.

Default page load should still remain collapsed.

---

# 11. Search

Search is recommended for the Service Taxonomy screen.

Example:

```text
[ Search service areas or offerings... ]
```

Search should ideally match:

- Service Area name;
    
- Service Offering name;
    
- SEO Query.
    

Example:

```text
Search: BIS
```

The UI should show the matching Service Area and relevant Service Offering.

Example:

```text
Regulatory Compliance

BIS Certification
BIS certification services
```

When a search finds a matching Service Offering inside a collapsed Service Area, that Service Area should automatically expand so the result is visible.

---

# 12. Search Behaviour

Recommended search behaviour:

### Search matches Service Area

Show the matching Service Area.

Example:

```text
Search: BFSI
```

Result:

```text
BFSI Advisory
8 service offerings
```

### Search matches Service Offering

Show its parent Service Area and expand it automatically.

Example:

```text
Search: Due Diligence
```

Result:

```text
Assurance and Risk Management

Due Diligence
Corporate Due Diligence
```

### Search matches SEO Query

Show the associated Service Offering and its parent Service Area.

The exact implementation should follow the available frontend/backend data.

---

# 13. No Editing Controls

The screen is currently read-only.

Do not show:

- Add Service Area;
    
- Add Service Offering;
    
- Edit;
    
- Delete;
    
- Rename;
    
- drag-and-drop controls;
    
- overflow action menus.
    

This screen should visually feel like a reference/catalogue rather than a management screen.

---

# 14. Internal IDs

Do not display:

- Area ID;
    
- Offering ID;
    
- database IDs;
    
- UUIDs.
    

For example, remove:

```text
Area ID 2
Offering ID 11
```

These values should remain internal.

---

# 15. Recommended Desktop Layout

A two-column layout can still be used because it makes efficient use of desktop width.

Example:

```text
┌───────────────────────────────────────────────────────────────────────┐
│ Service Taxonomy                                                     │
│ Browse the services used by the keyword research pipeline.           │
│                                                                       │
│ [ Search services... ]                            [ Expand All ]      │
│                                                                       │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│ │ Assurance & Risk Management │  │ BFSI Advisory                │   │
│ │ 6 offerings              >  │  │ 8 offerings              >  │   │
│ └──────────────────────────────┘  └──────────────────────────────┘   │
│                                                                       │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│ │ Business Registration       │  │ Customs & Foreign Trade     │   │
│ │ 7 offerings              >  │  │ 12 offerings             >  │   │
│ └──────────────────────────────┘  └──────────────────────────────┘   │
│                                                                       │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐   │
│ │ Regulatory Compliance       │  │ Tax & Advisory              │   │
│ │ 15 offerings             >  │  │ 9 offerings              >  │   │
│ └──────────────────────────────┘  └──────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
```

The important change from the current design is that the cards are compact while collapsed.

---

# 16. Expanded Card Example

```text
┌────────────────────────────────────────────────────┐
│ Assurance and Risk Management                      │
│ 6 service offerings                             v │
│                                                    │
│ Compliance Audits                                  │
│ Compliance Audit                                   │
│                                                    │
│ Due Diligence                                      │
│ Corporate Due Diligence                            │
│                                                    │
│ External Audits                                    │
│ External Audit                                     │
│                                                    │
│ Forensic Audits                                    │
│ Forensic Audit                                     │
│                                                    │
│ Internal Controls and SOP Formulations             │
│ Internal Controls and SOP                          │
│                                                    │
│ Management Audits                                  │
│ Management Audit                                   │
└────────────────────────────────────────────────────┘
```

---

# 17. Responsive Behaviour

On wider desktop screens:

- use a two-column Service Area layout.
    

On smaller screens:

- use a single-column layout.
    

Expanded Service Offerings should remain inside their parent Service Area.

The UI should avoid horizontal scrolling for normal taxonomy browsing.

---

# 18. Empty Service Areas

If a Service Area has no Service Offerings, it should still remain visible.

Example:

```text
New Advisory Area

No service offerings available
```

Do not hide the Service Area unless the backend contract explicitly defines that behaviour.

---

# 19. Empty Search Results

If no taxonomy item matches the search:

```text
No services found.

Try a different Service Area, Service Offering or SEO Query.
```

Do not show an empty blank page.

---

# 20. Loading State

While taxonomy data is loading, use simple skeleton or placeholder rows.

Example:

```text
Loading service taxonomy...
```

Avoid showing stale or invented data.

---

# 21. Error State

If taxonomy data cannot be loaded:

```text
Unable to load Service Taxonomy.

[ Retry ]
```

Do not expose technical API errors or stack traces to marketing users.

---

# 22. What Should Not Be Shown

Do not show:

- Area IDs;
    
- Offering IDs;
    
- internal database identifiers;
    
- raw API responses;
    
- technical metadata;
    
- pipeline diagnostics;
    
- editing actions;
    
- unrelated analytics;
    
- charts;
    
- service performance statistics.
    

The screen should remain focused on browsing the service structure.

---

# 23. Primary User Flow

```text
Service Taxonomy
      ↓
View all Service Areas
      ↓
Choose a Service Area
      ↓
Expand
      ↓
View Service Offerings
      ↓
View associated SEO Queries
```

Alternative flow:

```text
Service Taxonomy
      ↓
Search
      ↓
Matching Service Area / Offering appears
      ↓
Relevant Service Area automatically expands
```

---

# 24. Current Finalized Decisions

The current agreed direction is:

- Service Taxonomy is a dedicated screen.
    
- It is currently completely read-only.
    
- Marketing users can view all Service Areas and Service Offerings.
    
- Service Areas are collapsed by default.
    
- Service Areas remain the top-level hierarchy.
    
- Users can independently expand or collapse Service Areas.
    
- Multiple Service Areas may remain expanded simultaneously.
    
- Service Offering count is shown for each Service Area.
    
- Service Offerings appear only when their Service Area is expanded.
    
- SEO Query should be displayed with each Service Offering.
    
- Search is recommended.
    
- Search should cover Service Area, Service Offering and preferably SEO Query.
    
- Search results should automatically reveal matching nested offerings.
    
- Provide Expand All / Collapse All.
    
- Internal Area IDs and Offering IDs are not displayed.
    
- No add/edit/delete controls are shown.
    
- A two-column layout may be used on desktop.
    
- Smaller screens should fall back to a single column.
    
- The screen should be optimized for fast scanning of Service Areas first and detailed browsing second.
    

---

# 25. Still To Be Finalized

Before implementation is considered complete, confirm:

- whether search will be frontend-side or backend-supported;
    
- exact SEO Query field name;
    
- whether search should include SEO Query;
    
- ordering of Service Areas;
    
- ordering of Service Offerings;
    
- whether all Service Areas should start collapsed after every page load;
    
- whether expand/collapse state should be preserved while navigating;
    
- whether `Expand All` is required for mobile;
    
- exact loading and error-state styling.
    

---

# Google Stitch Wireframe Prompt

Create a low-fidelity desktop web application wireframe for the **Service Taxonomy** screen of an internal keyword research tool used by a marketing team.

Use the same application layout and navigation style as the existing Home, Manual Inputs, Final Results and Business Profile screens.

The screen is completely read-only.

At the top show:

- page title "Service Taxonomy";
    
- short description saying users can browse the services used by the keyword research pipeline;
    
- search field;
    
- "Expand All" button.
    

Display Service Areas as compact cards in a two-column desktop layout.

All Service Areas should be collapsed by default.

Each collapsed Service Area should show:

- Service Area name;
    
- number of Service Offerings;
    
- expand arrow.
    

Example Service Areas:

- Assurance and Risk Management
    
- BFSI Advisory
    
- Business Registration
    
- Customs and Foreign Trade Policy
    

Do not show Area IDs or Offering IDs.

When a Service Area is expanded, show its Service Offerings underneath.

For each Service Offering show:

- Service Offering name;
    
- SEO Query underneath in smaller secondary text.
    

Allow multiple Service Areas to be expanded at the same time.

Include an "Expand All" / "Collapse All" control.

Search should visually support matching Service Areas and nested Service Offerings.

Do not add:

- Add buttons;
    
- Edit buttons;
    
- Delete buttons;
    
- technical IDs;
    
- charts;
    
- analytics;
    
- diagnostic information.
    

Keep the design simple, professional, compact and optimized so marketing users can scan all Service Areas quickly without scrolling through every Service Offering by default.