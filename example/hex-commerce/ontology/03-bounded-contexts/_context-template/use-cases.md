---
id: <Context>.use-cases
type: use-cases
context: <Context>
status: draft
last_reviewed: YYYY-MM-DD
sources: []
---

# <Context> — use cases

<!--
What actors achieve through this context: one ### block per actor goal. Format: 00-meta/conventions.md §6a.
- Heading: "### <CTX>-UC-<NN> <goal in the actor's words>". Never reuse a number.
- Required: Actor, Goal, Main flow, Status.
- Steps say who does what in business terms, never UI mechanics.
- A use case that spans contexts lives in the context that owns the goal and cites the FLOW.
-->

### <CTX>-UC-01 <Goal in the actor's words>
- **Actor:** ACT-<NAME>
- **Goal:** <What the actor wants, in one sentence>
- **Trigger:** <What starts it>
- **Preconditions:** <What must be true before>
- **Main flow:**
  1. The <actor> <does something>.
  2. The system <responds, in business terms>.
- **Alternative flows:**
  - `2a.` <Condition>: <what happens, and how the use case ends>
- **Postconditions:** <What is true after success>
- **Commands:** `<Context>.<Command>`
- **Rules:** <CTX>-BR-001
- **Status:** implemented
- **Code:** `<entry point: route, handler, screen>`
- **Source:** <Requirement or process ID>
