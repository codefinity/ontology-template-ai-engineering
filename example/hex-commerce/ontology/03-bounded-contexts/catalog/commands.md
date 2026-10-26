---
id: Catalog.commands
type: commands
context: Catalog
status: implemented
last_reviewed: 2026-10-27
---

# Catalog — commands

This context handles no commands as-built. Products, departments, store deals and home-page
merchandising are static data, changed only by changing code.

The BRD target state adds these commands. They are listed here without `###` headings because they are
not modelled yet:

| Command (proposed) | Actor | BRD process |
| --- | --- | --- |
| Publish, update, unpublish or retire a catalogue product | ACT-CATALOGUE-MANAGER | P30 |
| Maintain departments and subcategories | ACT-CATALOGUE-MANAGER | P30 |
| Create, change or end a store deal | ACT-MERCHANDISER | P29 |
| Maintain promotions, featured selections and badges | ACT-MERCHANDISER | P29 |
