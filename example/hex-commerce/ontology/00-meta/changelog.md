---
id: meta.changelog
type: meta
status: implemented
last_reviewed: 2026-10-27
---

# Changelog

Newest first. One line per change that alters meaning: a new or changed rule, concept, context or
relationship. Typo fixes do not need a line.

| Date | Change | Affects | By |
| --- | --- | --- | --- |
| 2026-10-27 | Added REL-15 (Shopping → CustomerService, display-only item lookup), found by `ontology.mjs boundaries`, and recorded it as a known issue. | context map, Shopping, CustomerService | Claude Code, for Nikhil P |
| 2026-10-27 | Linked CAT-BR-015 from Catalog *Known gaps* and CFG-BR-006 from `StoreConfig.StoreClock`, found by `ontology.mjs gaps`. | Catalog, StoreConfig | Claude Code, for Nikhil P |
| 2026-10-27 | Template format: added `use-cases.md` per context (36 use cases written), decision records (ADR-001 to ADR-003), the optional rule **Tests** field, and the `ontology.mjs` CLI. | all contexts, 00-meta | Claude Code, for Nikhil P |
| 2026-10-27 | Ontology extracted from `hex-commerce-source-ui` and reconciled with BRD v3.0. Nine bounded contexts, 14 relationships, 6 cross-context flows. Rules the BRD requires but the code does not meet are marked `partial` or `not-implemented`. | all | Claude Code, for Nikhil P |
