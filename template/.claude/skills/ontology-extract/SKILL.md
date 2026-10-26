---
name: ontology-extract
description: Build a DDD business ontology (bounded contexts, ubiquitous language, aggregates, rules, use cases, context map) from an existing codebase, into the ontology/ folder. Use when asked to document, reverse-engineer or "create the ontology/domain model" of existing code, or to add a missing bounded context discovered in code.
---

# Extract an ontology from code

You turn an existing codebase into an **as-built** ontology. Every statement must trace to code you have
read. You never write code here.

## Setup

- The ontology is the folder whose `README.md` front matter has `type: index` (usually `ontology/`); call
  it `<ont>`. If none exists, copy the template's `ontology/` folder there first.
- Read `<ont>/00-meta/conventions.md` and `<ont>/00-meta/extracting-from-code.md` in full. They are the
  spec and the playbook; this skill is the procedure.
- Set `code_root` in `<ont>/README.md` front matter (path from `<ont>` to the code). Check it with
  `node <ont>/tools/ontology.mjs stats`.

## Procedure

1. **Inventory.** List, with paths: domain types and schemas; every place state changes (reducers,
   services, handlers, repositories); validation; calculations; entry points (routes, pages, API
   handlers, CLI, consumers); requirement docs. Read them; do not skim names only.
2. **Rule candidates.** Run `node <ont>/tools/ontology.mjs mine-rules --path <src-dir>`. Keep the output
   as a checklist for step 6.
3. **Propose contexts.** Group by language and by who decides (playbook §2). Present the list to the
   user: name, code, one-line purpose, subdomain type, main aggregates, and the evidence. **Wait for
   confirmation or edits before writing context folders.** If you cannot ask, proceed and record the
   choice in a decision (`ontology.mjs new-decision`).
4. **Domain files.** `01-domain/domain-vision.md`, `subdomains.md`, `actors.md`. Use requirement docs for
   intent; mark claims you could not confirm in code as assumptions.
5. **Scaffold.** For each context:
   `node <ont>/tools/ontology.mjs new-context <Name> --code <CODE> --subdomain <SD-X> --classification <type> --aggregate <Root>`.
6. **Fill each context**, in this order: `ubiquitous-language.md` → aggregates (structure, invariants,
   lifecycle from every assignment of a status field) → `business-rules.md` (exact numbers and
   boundaries; `Code` names file and function) → `value-objects.md` → `commands.md` → `domain-events.md`
   (say how each event is *realised*, even as a direct call) → `read-models.md` → `use-cases.md` (follow
   the `ontology-use-cases` skill) → README canvas (code map, implementation notes, known gaps, open
   questions). Use real sample data for examples. Never invent values.
7. **Map.** `02-context-map/context-map.md` (one row per directed relationship, with pattern and
   contract) and `cross-context-flows.md` (one flow per journey that crosses contexts). Then the
   glossary, last.
8. **Check.**
   - `node <ont>/tools/validate.mjs` must report 0 errors.
   - `node <ont>/tools/ontology.mjs boundaries`: every finding is a missing relationship or a real
     coupling problem. Record it as such.
   - `node <ont>/tools/ontology.mjs gaps`: fix the orphans, or explain them.
   - Re-run `mine-rules --uncited` and confirm each remaining line is not a business rule.
9. **Report** to the user: contexts and why, counts (`ontology.mjs stats`), the defects and gaps found
   (rules marked `partial` / `not-implemented`), open questions, and what you could not determine.

## Guardrails

- Code is evidence for *what is built*, not for *what is intended*. Where code and documents disagree,
  mark the rule `partial` or `not-implemented` and explain it. Never pick one silently.
- Mark inferences as `status: draft` and add an open question.
- For a large codebase, offer to split the work per context (for example, one agent per context after
  step 5). Keep the context map and glossary as a single final step.
