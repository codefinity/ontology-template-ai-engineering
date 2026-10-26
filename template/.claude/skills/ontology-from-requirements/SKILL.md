---
name: ontology-from-requirements
description: Build or extend a DDD business ontology from requirement documents (BRD, PRD, specs, user stories, tickets, interview notes) for a system not yet built or not yet modelled. Use when asked to "model the domain from these requirements", to turn a BRD/PRD into bounded contexts, rules and use cases, or to add newly requested features to the ontology before coding.
---

# Build the ontology from requirements

You turn requirement documents into a **proposed** ontology: the model the code should implement.
Nothing here is checked against code.

## Setup

- `<ont>` is the folder whose `README.md` has `type: index` (create it from the template if missing).
- Read `<ont>/00-meta/conventions.md` §3–§6b. Read every source document the user names, completely.
  `.docx` and `.pdf` need their skills or a text export.

## Procedure

1. **Harvest.** From the documents, list, each with its source location (section, requirement ID, page):
   - objectives → `BO-NN`;
   - actors and roles → `ACT-*`;
   - nouns with business meaning (candidate terms) and their definitions;
   - processes and user goals → use cases;
   - "shall/must/only/at most/within" statements, calculations, limits → rules;
   - things that "happen" (past tense) → events;
   - states and lifecycles.
2. **Find contradictions and holes**: the same word defined twice, rules that conflict, a process with
   no actor, statuses with no transition. Each one becomes an open question (`<CODE>-Q-NN`); do not
   resolve it yourself.
3. **Propose contexts** by language and decision ownership. Show the user the proposal: contexts, their
   terms, and the relationships between them. **Wait for agreement** before scaffolding. Record the
   boundary rationale with `ontology.mjs new-decision`.
4. **Scaffold** with `ontology.mjs new-context …` and `new-aggregate …`.
5. **Write**, following conventions:
   - files `status: proposed`;
   - rules `Status: not-implemented` with `Source:` citing the requirement;
   - use cases from the processes, with alternative flows from exceptions in the text;
   - commands and events implied by the use cases.

   Leave `Code` fields as `—` and set no `code_refs`.
6. **Map** the relationships and cross-context flows, then the glossary.
7. **Check.** `validate.mjs` must report 0 errors, and `ontology.mjs gaps` must show no command without a
   use case.
8. **Report**: the contexts proposed, counts, the open questions (most important first), and every
   place where you had to interpret rather than transcribe.

## Extending an existing ontology

For a new feature in an existing ontology, find the owning context first (`ontology.mjs find <term>`).
Add new rules and use cases with `next-id` numbers, marked `not-implemented`, and leave the existing
`implemented` items alone. If the request changes an existing rule, do not edit the rule's statement.
Add a **Notes** line ("Requested change: …, see <source>") and an open question, until the change is
built.

## Guardrails

- Transcribe intent; do not design the UI or the technology.
- Keep each rule singular and testable. Split compound requirements.
- Prefer the domain experts' words. Record synonyms in the *Avoid* column.
