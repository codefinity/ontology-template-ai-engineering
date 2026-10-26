---
name: ontology
description: Consult, update, extract or check the project's DDD business ontology in ontology/. Use before implementing business behaviour, after changing business rules or data shapes in code, when asked what a domain term means, or when asked to build the ontology from a codebase.
---

# Business ontology

The ontology lives in `ontology/`. Its format is specified in `ontology/00-meta/conventions.md`, and
`ontology/CLAUDE.md` has the working rules. Pick the workflow that matches the request.

## Consult (before coding)

1. Find the owning context in `ontology/README.md`. For a single word, use `ontology/01-domain/glossary.md`.
2. Read `<context>/README.md`, then `ubiquitous-language.md`.
3. Read the aggregate file and the rules in `business-rules.md` that the change touches. Note each rule's
   status.
4. If the change crosses contexts, read the relationship row in `02-context-map/context-map.md` and the
   matching flow.
5. Tell the user which rules apply (by ID) before writing code. Cite them in code comments.

## Update (after code changes)

1. List the business-relevant changes in the diff: rules, fields, statuses, cross-context calls, renames.
2. For each change, apply the table in `ontology/00-meta/maintaining.md` ("When to update what").
3. Set `last_reviewed` on each edited file, and add a line to `00-meta/changelog.md`.
4. Run `node ontology/tools/validate.mjs` and fix every error.

## Extract (build from an existing codebase)

Follow `ontology/00-meta/extracting-from-code.md`. Base every rule on code you have read, and cite the
file. Mark inferences you could not confirm as `draft` and list them as open questions.

## Check

Run `node ontology/tools/validate.mjs`. Then, for a sample of three rules marked `implemented`, open the
cited code and confirm it still does what the rule says. Report any drift as a list of rule IDs with what
differs. Do not fix drift silently.
