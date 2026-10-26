---
id: domain.subdomains
type: subdomains
status: draft
last_reviewed: YYYY-MM-DD
---

# Subdomains

<!--
Subdomains partition the PROBLEM space: what the business must be good at. Bounded contexts partition
the SOLUTION space. One subdomain is usually served by one context, sometimes by several.
Classification guide: see 00-meta/conventions.md §7.
-->

## Classification

| ID | Subdomain | Type | Why this type | Objectives | Served by contexts |
| --- | --- | --- | --- | --- | --- |
| SD-<NAME> | <Name> | Core / Supporting / Generic | <One line> | BO-01 | [<Context>](../03-bounded-contexts/<context-name>/README.md) |

## Core domain chart

<!-- Optional: place each subdomain by business differentiation (y) and model complexity (x). -->

```mermaid
quadrantChart
    title Subdomain investment
    x-axis Low model complexity --> High model complexity
    y-axis Low differentiation --> High differentiation
    quadrant-1 Core
    quadrant-2 Core (simple)
    quadrant-3 Supporting
    quadrant-4 Generic (buy or reuse)
    "<Subdomain>": [0.5, 0.5]
```

## Notes

<!-- Disagreements, planned reclassification, subdomains not yet served by any context. -->
