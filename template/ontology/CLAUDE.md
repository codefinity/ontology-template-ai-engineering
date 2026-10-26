---
id: meta.claude
type: meta
status: implemented
last_reviewed: 2026-10-27
---

# Working with this ontology — instructions for Claude Code

This folder specifies what the business **means**: its words, model and rules. The code records what is
**built**. Use the ontology to write code that speaks the business language and respects its rules, and
keep the ontology true as the code changes.

## Before writing or changing code that touches business behaviour

1. **Find the owning context.** Use the table in [README.md](README.md) or look the word up in
   [01-domain/glossary.md](01-domain/glossary.md). If the change spans contexts, read the relationship
   in [02-context-map/context-map.md](02-context-map/context-map.md) and the matching flow in
   [cross-context-flows.md](02-context-map/cross-context-flows.md).
2. **Read the context `README.md`.** It covers responsibilities, what the context deliberately does not
   do, its relationships, and the **Code map** that shows where each concept lives.
3. **Read `ubiquitous-language.md`.** Name new code with the preferred terms. Where the business term and
   the existing code identifier differ, follow the `Code` column so the code stays consistent.
4. **Read the aggregate file and `business-rules.md`** for every rule your change touches. Check the
   rule's `Status`: `partial` and `not-implemented` rules describe intent that the code does not yet
   meet.

Read only what the task needs. A one-context change rarely needs more than its README, its language
and one aggregate.

## While writing code

- Enforce a rule in the place its aggregate or `Code` field names. Do not re-implement another
  context's rule; use what that context exposes, as the context map describes.
- Cite rule IDs in a short comment where a rule is enforced: `// ORD-BR-003`.
- Cross a context boundary only through the contract named in the context map (the Open Host
  Service, published model, translation layer and so on).
- **Do not invent business rules.** If the ontology is silent or ambiguous about behaviour you need,
  ask the user. If you cannot ask, choose the most conservative behaviour, and record an open question
  (`<CODE>-Q-<NN>`) in the context README.

## Keeping the ontology current

Update the ontology **in the same change** as the code. Use the table in
[00-meta/maintaining.md](00-meta/maintaining.md#when-to-update-what) for what to touch. In short:

| You changed… | Update |
| --- | --- |
| A rule (limit, validation, calculation, transition) | `business-rules.md` and the aggregate's invariants |
| Data shape | Aggregate structure tables; `ubiquitous-language.md` for new words |
| A status or transition | Aggregate lifecycle diagram and table |
| A call between contexts | `context-map.md`, `cross-context-flows.md`, both context READMEs |
| File locations or identifiers | `code_refs`, `Code` columns, the context Code map |

Then set `last_reviewed` on each edited file, add a line to
[00-meta/changelog.md](00-meta/changelog.md), and run:

```bash
node ontology/tools/validate.mjs
```

Fix every error before you finish.

## When code and ontology disagree

Do not silently change either one to match the other.

- If the code reflects a deliberate decision, update the ontology and note the decision in the
  changelog.
- If the ontology states the intent and the code falls short, leave the code as it is unless the task
  is to fix it. Set the rule to `partial` or `not-implemented`, explain why in **Notes**, and list it
  under **Known gaps** in the context README.
- If you cannot tell which is right, ask the user.

## Format essentials

The full rules are in [00-meta/conventions.md](00-meta/conventions.md).

- Every file has front matter with `id`, `type`, `status` and `last_reviewed`. Context-scoped files
  also have `context`.
- A `###` heading in a model file defines the concept `<Context>.<Name>`. In `business-rules.md`, a
  `###` heading defines a rule `<CODE>-BR-<NNN>`.
- Reference concepts as `` `<Context>.<Name>` `` in backticks, and link files relatively.
- Never renumber or reuse an ID.
- Keep UI layout, styling and framework details out, except in `Code` and *Implementation* fields.
