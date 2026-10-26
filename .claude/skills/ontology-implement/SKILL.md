---
name: ontology-implement
description: Implement a feature, fix or rule change in code guided by the DDD ontology - locate the owning bounded context, use case and rules, respect aggregate and context boundaries, use ubiquitous-language names, cite rule IDs in code, add rule-tagged tests, and update the ontology in the same change. Use whenever writing or changing code that affects business behaviour in a project that has an ontology/ folder.
---

# Implement code from the ontology

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Follow `<ont>/CLAUDE.md` throughout.

## 1. Understand: read only what the task needs

1. Find the owning context: `node <ont>/tools/ontology.mjs find <key word>`, or the index table.
2. Read the context `README.md`: responsibilities, non-responsibilities, relationships and code map.
3. Find the use case the change serves (`use-cases.md`). Read the rules it cites, and any rule the task
   names: `ontology.mjs show <RULE-ID>`. Note each rule's **Status**.
4. If the change crosses contexts, read the relationship row (`ontology.mjs show REL-NN`) and the flow.
   Cross only through the contract named there.
5. If the code files are known, `ontology.mjs affected <file>` lists everything that cites them.

## 2. Plan, and confirm when behaviour changes

State the plan before editing:
- context and aggregate;
- the rules to enforce, change or add (with ids, or "new");
- the use-case steps affected;
- files to touch;
- tests to add;
- ontology updates.

**If the task changes a rule's meaning, or needs a rule the ontology does not have, ask the user**,
unless the request already states the rule exactly. Never invent business behaviour to fill a gap.

## 3. Implement

- **Location.** Put logic where the ontology's `Code` fields and the aggregate say it belongs. Enforce an
  invariant inside the aggregate's state change (reducer, entity method, service), not only in the UI.
- **Names.** Use the ubiquitous-language terms for new names. Where the existing code uses a different
  identifier, follow the `Code` column, for consistency.
- **Traceability.** Add a short comment at each enforcement point: `// SHP-BR-001`.
- **Boundaries.** Do not import another context's internals. Use its published read model or command.
  Run `ontology.mjs boundaries` after the change.
- **Tests.** Add tests whose names start with the rule id (follow the `ontology-tests` skill). Cover the
  boundaries the rule states.

## 4. Keep the ontology true, in the same change

Follow the `ontology-sync` skill, or at least:
- update or add the rules (`next-id rule`) with `Status: implemented` and `Code`;
- move a `partial` or `not-implemented` rule to `implemented` when the change completes it, and remove
  it from *Known gaps*;
- update the use case, the aggregate structure and lifecycle, the commands and events, and the context
  map, as touched;
- set `last_reviewed`, add a changelog line, and run `validate.mjs` (0 errors).

## 5. Report

The rules implemented or changed (ids), the use cases affected, the tests added (and whether they pass),
the ontology files updated, and the open questions raised.
