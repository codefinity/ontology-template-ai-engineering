---
name: ontology-scaffold
description: Make mechanical, structure-preserving edits to the ontology - add a bounded context, aggregate, rule, use case, open question, decision or relationship with the correct next ID; rename or deprecate a concept everywhere; renumber nothing. Use for any "add a rule/use case/context/aggregate/decision to the ontology", "rename concept", or "deprecate" request, and when editing the template itself.
---

# Scaffold and edit the ontology

These are the safe ways to change structure. The CLI does the bookkeeping; you write the content.

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. The CLI is `node <ont>/tools/ontology.mjs`.
  Formats are in `<ont>/00-meta/conventions.md`; read the section for the item you add.

## Recipes

| Task | Steps |
| --- | --- |
| **New context** | `ontology.mjs new-context <Name> --code <CODE> --subdomain <SD-X> --classification <core\|supporting\|generic> --aggregate <Root>`. Then add a row to the index table in `README.md`, a row to `01-domain/subdomains.md`, a node and relationship rows to `02-context-map/context-map.md`, and fill every file. |
| **New aggregate** | `ontology.mjs new-aggregate <Context> <Root>`, then add it to the README model table and diagram. |
| **New rule** | `ontology.mjs next-id rule <Context>` → write the block (conventions §6) in the right `##` group → add the id to the aggregate *Invariants* or the command's *Rejected when*. |
| **New use case** | `ontology.mjs next-id use-case <Context>` → write the block (conventions §6a) → cite its commands and rules. |
| **New command, event, read model or value object** | Add a `###` block in the right file. The heading is the bare PascalCase name. Link it from the aggregate's *Behaviour* table. |
| **Open question** | `ontology.mjs next-id question <Context>` → add a row to the README's *Open questions* table. |
| **Relationship** | `ontology.mjs next-id rel` → add a row to the context-map table and an edge to the diagram, and update both context READMEs. |
| **Flow** | `ontology.mjs next-id flow` → add `## FLOW-NN <title>` with trigger, outcome, sequence diagram and steps. |
| **Decision** | `ontology.mjs new-decision "<title>"` → fill it in → add a row to `00-meta/decisions/README.md`. |
| **Rename a concept** | `ontology.mjs rename <Ctx.Old> <Ctx.New>` (dry run) → check it → re-run with `--write` → move the old word to *Avoid* in the ubiquitous language. |
| **Deprecate** | Set `Status: deprecated` (rule or use case) or `status: deprecated` (file), and add "Replaced by …". Never delete the heading or reuse the id. |
| **Find before you add** | `ontology.mjs find <word>` and `ontology.mjs show <id>`, to avoid duplicates. |

## Always

1. Use `next-id`. Never pick numbers by hand, and never fill gaps.
2. Set `last_reviewed` to today on every file you touch. Add a line to `00-meta/changelog.md` when the
   meaning changes.
3. Run `node <ont>/tools/validate.mjs` and fix every error before you finish.

## Editing the template itself

When `<ont>` is a template (placeholders like `<Context>`), keep the placeholders and guidance comments.
A format change (a new field, file or id kind) must be made in `00-meta/conventions.md`, the
`_context-template/`, `tools/lib.mjs` and `tools/validate.mjs` together. If the repository has a filled-in
example of the template, update it in the same change.
