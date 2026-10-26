---
id: meta.maintaining
type: meta
status: implemented
last_reviewed: 2026-10-27
---

# Maintaining the ontology

The ontology is useful only while it matches the business and the code. Update it **in the same change**
as the code or decision that alters it, whether a person or Claude Code makes that change.

## When to update what

| What changed | Update |
| --- | --- |
| A business rule was added, changed or removed | `business-rules.md` (statement, status, code). The aggregate's *Invariants* list. Add a changelog line. |
| A new attribute, entity or value object | The aggregate file's structure tables. A `ubiquitous-language.md` row if it introduces a word. |
| A new state or transition | The aggregate's *Lifecycle* diagram and transition table. The rule that guards it. |
| A new user action | `commands.md`. The events it emits in `domain-events.md`. The use case in `use-cases.md` that reaches it. |
| A new or changed user journey (screen flow, entry point, alternative path) | `use-cases.md`; the flow in `cross-context-flows.md` if it crosses contexts |
| Tests added for a rule | Put the rule ID in the test name or a comment; optionally fill the rule's **Tests** field |
| A modelling choice someone may question later | A decision record in `00-meta/decisions/` |
| A new screen or report that only reads | `read-models.md` |
| One context now calls or reacts to another | The `context-map.md` relationship, the flow in `cross-context-flows.md`, and the **Relationships** section of both context READMEs |
| Code was renamed or moved | The `Code` column in `ubiquitous-language.md`, `code_refs`, and the **Code map** in the context README |
| A word is used differently by the business | `ubiquitous-language.md`. The glossary if the word also exists in another context. |
| An answer to an open question | Remove the question row and record the decision where it belongs (usually a rule) |

Always set `last_reviewed` on every file you touch.

## Recipes

### Add a bounded context
1. Run `node tools/ontology.mjs new-context <Name> --code <CODE> --subdomain <SD-X> --classification <type> --aggregate <Root>`.
   It copies `_context-template/` to `03-bounded-contexts/<name>/`, fills the placeholders it can, and
   creates the first aggregate file. Add more with `new-aggregate <Context> <Root>`.
2. Fill in every file. Delete the guidance comments once each section is written.
5. Add the context to the table in the ontology `README.md`, to `subdomains.md`, and to `context-map.md`
   (node, and a row for each relationship).
6. Run the validator.

### Add a business rule
1. Take the next free number: `node tools/ontology.mjs next-id rule <Context>`. Never fill an old gap.
2. Write the rule block (conventions §6) under the right `##` group.
3. Add the ID to the *Invariants* or *Rules* list of the aggregate, command or read model it governs.
4. Cite the ID in a code comment where it is enforced.

### Add a use case
1. `node tools/ontology.mjs next-id use-case <Context>`, then write the block (conventions §6a).
2. Cite the commands it invokes and the rules it applies. Cite the flow if it crosses contexts.
3. `node tools/ontology.mjs gaps` shows commands that no use case reaches yet.

### Rename a concept
1. Change the term in `ubiquitous-language.md`. Move the old word to the *Avoid* column, so readers who
   still know it can find the new one.
2. `node tools/ontology.mjs rename <Context.Old> <Context.New>` shows every line it would change; add
   `--write` to apply.
3. If the code keeps the old identifier for now, say so in the `Code` column.

### Find what a code change affects
`node tools/ontology.mjs affected --git main` lists the concepts, rules and use cases that cite each
changed file, and flags changed files the ontology does not mention.

### Split or merge contexts
Treat it as a design decision. Write the reason in the changelog, move files with their history, update
the context map, and leave a `deprecated` README in the old folder for one release that points to the
new location.

### Deprecate something
Set `status: deprecated`, say at the top what replaces it, and keep the file or heading so its ID is
never reused.

## Review routine

| When | Who | What |
| --- | --- | --- |
| Every pull request that changes domain behaviour | Author and reviewer | Checklist below |
| Each release | Product owner and tech lead | Open questions, `partial` / `not-implemented` rules, Known gaps; `ontology.mjs gaps`, `coverage` and `boundaries` |
| Each quarter | Domain experts | Read the domain vision, context map and each ubiquitous language aloud; fix what sounds wrong |

### Pull-request checklist
- [ ] Rules touched by the change are updated, with the right status.
- [ ] New words are in the ubiquitous language, with their code identifier.
- [ ] Cross-context calls added or removed are reflected in the context map and flows
      (`ontology.mjs boundaries` reports none undeclared).
- [ ] New user journeys have a use case; new rules have tests that cite their ID.
- [ ] `last_reviewed` is updated on edited files, and the changelog has a line.
- [ ] `node ontology/tools/validate.mjs` passes.
