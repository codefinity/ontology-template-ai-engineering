---
id: <Context>.value-objects
type: value-objects
context: <Context>
status: draft
last_reviewed: YYYY-MM-DD
---

# <Context> — value objects

<!--
Immutable values defined only by their attributes, used by more than one aggregate of this context or
exposed to other contexts. A value object used by a single aggregate may be defined in that aggregate's
file instead. Each ### heading defines <Context>.<Name>.
-->

### <ValueObject>

- **Meaning:** <What it represents>
- **Attributes:** <attribute: type, …>
- **Constraints:** <Valid values, e.g. "amount ≥ 0, two decimals">, rules <CTX>-BR-001
- **Equality:** by <attributes>
- **Used by:** `<Context>.<Aggregate>`
- **Code:** `<path>` (`<Type>`)
