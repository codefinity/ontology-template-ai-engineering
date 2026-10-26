---
id: <Context>.events
type: domain-events
context: <Context>
status: draft
last_reviewed: YYYY-MM-DD
---

# <Context> — domain events and policies

<!--
Domain events: facts, in the past tense, that domain experts care about. Record them even when the code
has no event objects; then "Realised as" says how the fact is communicated today (direct call, state
change observed by a selector, and so on).
Policies: reactions of the form "when <event>, then <command>". Each ### heading defines
<Context>.<Name>.
-->

## Events

### <EventName>

- **Meaning:** <What happened, in business terms>
- **Emitted by:** `<Context>.<Command>`
- **Payload:** <field: meaning, …>
- **Consumers:** `<OtherContext>.<Policy>`
- **Scope:** internal | integration (crosses a context boundary)
- **Realised as:** <message / direct call `x()` from `path` / not realised>

## Policies

### <PolicyName>

- **When:** `<Context>.<Event>` (or `<OtherContext>.<Event>`)
- **Then:** `<Context>.<Command>`
- **Rules:** <CTX>-BR-001
- **Realised as:** <how the reaction happens in code>
