---
id: <Context>.read-models
type: read-models
context: <Context>
status: draft
last_reviewed: YYYY-MM-DD
---

# <Context> — read models and queries

<!--
Questions this context answers, for its own users or for other contexts. They change nothing.
If another context consumes a read model, it is part of this context's published contract; say so.
Each ### heading defines <Context>.<Name>.
-->

### <ReadModelName>

- **Answers:** <The question, e.g. "What does the basket cost?">
- **Shape:** <field: meaning, …>
- **Derived from:** `<Context>.<Aggregate>`
- **Rules:** <CTX>-BR-001
- **Consumers:** <who reads it: actor, screen, or `<OtherContext>`>
- **Published:** yes (part of REL-<NN>) / no
- **Code:** `<path>` (`<function>`)
