---
id: <Context>.commands
type: commands
context: <Context>
status: draft
last_reviewed: YYYY-MM-DD
---

# <Context> — commands

<!--
What actors (people or other contexts' policies) can ask this context to do. Imperative names.
A command may be rejected; list the rules that can reject it. Each ### heading defines <Context>.<Name>.
-->

### <CommandName>

- **Intent:** <What the actor wants to achieve>
- **Actor:** ACT-<NAME> (or "policy `<Context>.<Policy>`")
- **Target:** `<Context>.<Aggregate>` (creates / changes / deletes)
- **Input:** <field: meaning, …>
- **Rejected when:** <CTX>-BR-001
- **On success:** <state change>; emits `<Context>.<Event>`
- **Code:** `<path>` (`<function>`)
