---
id: domain.vision
type: domain-vision
status: draft
last_reviewed: YYYY-MM-DD
owners: [<Business sponsor>, <Product owner>]
sources: []
---

# Domain vision

<!--
A domain vision statement (Evans) is one short page. It says what the domain is, why it is worth
building, and what makes it distinctive. Keep it free of technology.
-->

## Vision statement

<!-- 3–6 sentences. Who is served, what they can do, what is distinctive. -->

<Project name> is …

## Business objectives

<!-- What the business is trying to achieve. Reference these IDs from subdomains and rules. -->

| ID | Objective | Measured by |
| --- | --- | --- |
| BO-01 | <Objective> | <Indicator> |

## Scope

### In scope
- <Capability>

### Out of scope
<!-- Explicit exclusions prevent scope creep and wrong assumptions in code. -->
- <Capability> — <why it is excluded>

## Key domain concepts at a glance

<!--
The 5–10 concepts a newcomer must understand first, one line each, linking to their owning context.
Do not define them here; the context's ubiquitous language does that.
-->

| Concept | Owning context | In one line |
| --- | --- | --- |
| <Concept> | [<Context>](../03-bounded-contexts/<context-name>/README.md) | <line> |

## Assumptions and constraints

<!-- Facts taken as given that shape the model (regulation, market, demo-only shortcuts). -->

| ID | Assumption or constraint | Consequence for the model |
| --- | --- | --- |
| A-01 | <Statement> | <Effect> |
