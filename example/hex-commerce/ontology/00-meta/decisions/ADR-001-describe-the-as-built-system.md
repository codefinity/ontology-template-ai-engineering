---
id: ADR-001
type: decision
status: implemented
last_reviewed: 2026-10-27
owners: [Product Owner]
---

# ADR-001 Describe the as-built system; requirements appear as rule status

## Context

Two sources describe HexCommerce, and they disagree in places. The demonstration application
(`hex-commerce-source-ui`) is what exists. BRD v3.0 is the target state: it adds payment, fulfilment,
returns, a back office and moderation, and it corrects some of the application's behaviour (for example
BR-CRT-006 against SHP-BR-007). An ontology that mixed the two without marking which is which would
mislead anyone writing code.

## Options considered

1. **Model the BRD target state.** It is useful for design, but much of the model would have no code,
   and the code's real quirks would be invisible.
2. **Model only the code.** It is accurate, but loses why things should change.
3. **Model the code, and show the BRD as status.** Every rule and use case states the as-built
   behaviour. Where the BRD requires more, the item is `partial` or `not-implemented`, and **Notes**
   says what is missing. Purely target-state capabilities appear as `not-implemented` use cases.

## Decision

Option 3. Files are `status: implemented`. Rules and use cases carry their own status, and cite the BRD
in **Source** where a requirement corresponds.

## Consequences

- Readers and Claude Code can trust `implemented` items as a description of the code, and treat
  `partial` / `not-implemented` items as backlog.
- Each context README's *Known gaps* lists the difference (`ontology.mjs gaps` checks that).
- When the target state is built, the change is a status flip plus code references, not a rewrite.
