---
name: ontology-reconcile
description: Reconcile the ontology three ways - against the code (does each implemented rule still hold?) and against requirement documents (is each requirement modelled, and is the code meeting it?) - then set rule and use-case statuses, known gaps and open questions with evidence. Use for drift audits, release readiness, "does the code do what the BRD says", or gap analysis between requirements and implementation.
---

# Reconcile ontology, code and requirements

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Agree the scope: one context, a list of
  rules, or everything. Agree the sources: the code (`code_root`) and which requirement documents.
- Read conventions §6 and §6a for statuses. `node <ont>/tools/ontology.mjs export --out <tmp>.json`
  gives every rule and use case with its fields, if you want to work through them as a list.

## Procedure

1. **Code → ontology (drift).** For each rule and use case in scope with status `implemented` or
   `partial`:
   - open every location in its `Code` field;
   - confirm the statement: values, boundaries, conditions, messages, and the transitions allowed;
   - for a use case, walk the main flow and each alternative flow through the code.

   The verdicts are: still true / changed (state how) / code gone.
2. **Ontology → requirements (coverage).** For each requirement in scope (each "shall" statement or
   process step), find the rule or use case whose `Source` cites it (`ontology.mjs refs <REQ-ID>` or a
   text search). The verdicts are: modelled / modelled differently (say how) / not modelled.
3. **Requirements → code (fulfilment).** For each modelled requirement, take the verdict from step 1:
   `implemented`, `partial` (say what is missing) or `not-implemented`.
4. **Present a reconciliation table** before editing: id, requirement, ontology verdict, code verdict,
   proposed status, and evidence (`file:line`). Group the rows into drift, missing models and missing
   implementation.
5. **Apply** the agreed outcomes:
   - set statuses;
   - write **Notes** that say exactly what is missing;
   - add new rules or use cases for requirements that are not modelled (`not-implemented`);
   - list each `partial` and `not-implemented` item under *Known gaps* in the context README
     (`ontology.mjs gaps` reports the missing ones);
   - add open questions where the requirement itself is ambiguous;
   - set `last_reviewed` and add a changelog line, then run `validate.mjs`.
6. **Report** the counts per verdict, the most important gaps first (by the business objective at risk),
   and the likely bugs: code that contradicts an intended rule.

## Guardrails

- Evidence for every verdict: a `file:line` or a requirement id. "Looks fine" is not a verdict.
- Do not change code. Do not "fix" a requirement to match the code. Contradictions are surfaced, not
  resolved.
