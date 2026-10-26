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
| A new user action | `commands.md`. The events it emits in `domain-events.md`. |
| A new screen or report that only reads | `read-models.md` |
| One context now calls or reacts to another | The `context-map.md` relationship, the flow in `cross-context-flows.md`, and the **Relationships** section of both context READMEs |
| Code was renamed or moved | The `Code` column in `ubiquitous-language.md`, `code_refs`, and the **Code map** in the context README |
| A word is used differently by the business | `ubiquitous-language.md`. The glossary if the word also exists in another context. |
| An answer to an open question | Remove the question row and record the decision where it belongs (usually a rule) |

Always set `last_reviewed` on every file you touch.

## Recipes

### Add a bounded context
1. Copy `03-bounded-contexts/_context-template/` to `03-bounded-contexts/<context-name>/`.
2. In `README.md` front matter, set `id` and `context` to the PascalCase name. Choose a unique 2–4 letter
   `code`, and set `subdomain` and `classification`.
3. Rename `aggregates/_aggregate-template.md` to `aggregates/<aggregate-name>.md` and fill it in. Add one
   file per aggregate.
4. Replace `<Context>` and `<CTX>` placeholders in every file. Delete the guidance comments once each
   section is written.
5. Add the context to the table in the ontology `README.md`, to `subdomains.md`, and to `context-map.md`
   (node, and a row for each relationship).
6. Run the validator.

### Add a business rule
1. Take the next free number in that context (`<CODE>-BR-<NNN>`), even if an older number has gaps.
2. Write the rule block (conventions §6) under the right `##` group.
3. Add the ID to the *Invariants* or *Rules* list of the aggregate, command or read model it governs.
4. Cite the ID in a code comment where it is enforced.

### Rename a concept
1. Change the term in `ubiquitous-language.md`. Move the old word to the *Avoid* column, so readers who
   still know it can find the new one.
2. Search the ontology for the old qualified name (`<Context>.<OldName>`) and replace it.
3. If the code keeps the old identifier for now, say so in the `Code` column.

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
| Each release | Product owner and tech lead | Open questions, `partial` / `not-implemented` rules, Known gaps |
| Each quarter | Domain experts | Read the domain vision, context map and each ubiquitous language aloud; fix what sounds wrong |

### Pull-request checklist
- [ ] Rules touched by the change are updated, with the right status.
- [ ] New words are in the ubiquitous language, with their code identifier.
- [ ] Cross-context calls added or removed are reflected in the context map and flows.
- [ ] `last_reviewed` is updated on edited files, and the changelog has a line.
- [ ] `node ontology/tools/validate.mjs` passes.
