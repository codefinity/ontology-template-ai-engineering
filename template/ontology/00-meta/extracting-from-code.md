---
id: meta.extracting-from-code
type: meta
status: implemented
last_reviewed: 2026-10-27
---

# Extracting an ontology from an existing codebase

Use this playbook to build the ontology for a system that already exists (as-built). For a new system,
start from the requirements and workshops instead (Event Storming, Domain Storytelling) and mark
everything `proposed`. The file structure is the same either way.

## 1. Gather sources, in order of trust

| Source | What it gives you | Watch out for |
| --- | --- | --- |
| Domain types and schemas (type definitions, ORM entities, DB migrations) | Entities, attributes, enumerations (states!) | Fields that exist only for the UI |
| State changes (reducers, services, command handlers, stored procedures) | Commands, invariants, state transitions | Rules split between UI and backend |
| Validation code (forms, DTO validators) | Validation rules and their messages | Messages that differ from the rule they enforce |
| Calculations (pricing, totals, status derivation) | Derivation rules | Rounding, boundaries (`<` versus `<=`) |
| Calls between modules | Context relationships, implicit events | Shared mutable data, which hides a Shared Kernel |
| Requirement documents, tickets, README | Intent, objectives, actors, vocabulary | Out of date. Verify every claim against code |
| Seed or sample data | Example instances, reference data | Demo-only shortcuts |

## 2. Find the bounded contexts

Look for **linguistic boundaries** first and technical ones second. Signs of a context boundary:

- The same word means different things: "order" for the shopper versus "seller order" for the merchant.
- A different actor owns the decisions: shopper versus seller versus administrator.
- Data has its own lifecycle and store: a separate table group, store or provider.
- Changes happen at a different pace or are made by a different team.

Write a candidate list. For each candidate, write one sentence of purpose and the 5–10 words that matter
most in it. If two candidates share most of their words with the same meanings, merge them. If one
candidate uses a word in two senses, split it.

Do not mistake modules for contexts. A UI folder (`components/cart`) or a technical layer (`lib/`) is not
a context. A single store or service can host two contexts; the ontology states the logical boundary,
and the context README's **Implementation notes** records the physical mismatch.

## 3. Classify subdomains

Ask: "If we did this exactly like every competitor, would we lose?" Yes means core. "Is it specific to
us but not a reason we win?" Yes means supporting. Otherwise it is generic. Record a one-line rationale
for each subdomain; people will dispute these, and that discussion is useful.

## 4. Model each context

For each context, in this order:

1. **Ubiquitous language.** List the nouns and verbs found in types, function names, UI text and
   documents. Pick one preferred term per meaning, map it to the code identifier, and list rejected
   synonyms.
2. **Aggregates.** Find what must stay consistent within one change: the data a single
   reducer/handler modifies together, and the invariants checked there. That is an aggregate.
3. **Lifecycles.** Every enumeration named `status`, `state` or `stage` is a state machine. Find every
   place it is assigned to get the transitions and their guards.
4. **Rules.** Each `if` that rejects input, caps a value or picks a branch for business reasons is a
   rule. Record the exact numbers and boundaries.
5. **Commands and events.** Each exported mutation is a command. Its successful outcome is an event,
   even when the code has no event objects. Record how it is actually realised ("synchronous call from
   X").
6. **Read models.** Selectors, queries and derived values that screens consume.
7. **Use cases.** List the entry points: routes, pages, API handlers, CLI commands, message consumers.
   Group them by actor goal (a goal often spans several screens). Write each as a use case with its
   main flow, and with alternative flows taken from the validation messages and `if` branches you
   found in step 4.

`node tools/ontology.mjs mine-rules --path <src>` lists lines that look like rules, with whether a rule
already cites them. Use it as a checklist, not as truth.

## 5. Map the contexts

For each pair that interacts, record direction (who depends on whose model), the pattern, what crosses
the boundary (contract) and where in code. Then trace each end-to-end user journey that crosses contexts
as a flow.

## 6. Reconcile with requirement documents

Where documents exist, add a `Source` to each rule. When the code and the document disagree, do not pick
one silently. Mark the rule `partial` or `not-implemented`, explain in **Notes**, and add an open
question if the right answer is unclear.

## 7. Verify

- Run the validator; it checks structure, IDs, links and `code_refs`.
- Run `ontology.mjs gaps` (orphan commands and rules) and `ontology.mjs boundaries` (imports the context
  map does not allow). Each finding is either a modelling gap or a real coupling problem worth recording.
- Pick three rules at random and confirm each against the code by reading it.
- Ask a domain expert to read one context's ubiquitous language aloud. Wherever they hesitate, there is
  a gap.

## With Claude Code

The `ontology-extract` skill runs this playbook. Without the skills, use this prompt:

> Read `ontology/00-meta/conventions.md` and this playbook. Then analyse the codebase at `<path>` and
> produce the ontology: domain files first, then the context map, then one folder per bounded context
> (`node ontology/tools/ontology.mjs new-context …`). Base every rule on code you have read and cite its
> file. Mark anything you inferred but could not confirm as `draft` and list it as an open question. Run
> `node ontology/tools/validate.mjs` and fix every error before finishing.
