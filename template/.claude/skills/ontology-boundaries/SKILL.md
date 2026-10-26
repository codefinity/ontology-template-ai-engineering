---
name: ontology-boundaries
description: Analyse and improve bounded-context boundaries and the context map - detect code dependencies that cross contexts without a declared relationship, assess whether contexts should be split or merged, choose relationship patterns (OHS, ACL, Conformist, Shared Kernel...), and optionally generate import-lint rules. Use when asked about coupling, modularisation, context boundaries, the context map, or "is this in the right place".
---

# Analyse bounded-context boundaries

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Read `<ont>/02-context-map/context-map.md`,
  conventions §7 (relationship patterns) and §10 (how `boundaries` decides ownership), and the READMEs
  of the contexts involved.

## Procedure

1. **Measure**: `node <ont>/tools/ontology.mjs boundaries`. It lists imports from a file owned by one
   context to a file owned by another, where the map has no relationship allowing it (or allows only
   the reverse). A file is owned by a context when exactly one context README cites it. Files cited
   by several READMEs are reported as shared and not checked. Review that list too: a shared file is
   often a hidden Shared Kernel or a misplaced module.
2. **Decide each finding** with evidence from the code:

   | Finding | Fix in the ontology | Fix in code (only if asked) |
   | --- | --- | --- |
   | The dependency is legitimate but missing from the map | Add `REL-NN` (`next-id rel`) with the pattern, contract and code. Update both context READMEs and the flow. | none |
   | The dependency runs against the map's direction | Revisit the relationship, or record a known issue | Invert it (callback, event, port) |
   | The downstream uses the upstream's model raw where an ACL is intended | Record a known issue | Add a translation layer |
   | The ownership is wrong (a file listed in the wrong Code map) | Fix the Code map | none |
3. **Assess the boundaries themselves** when asked:
   - **Split** a context when one context uses a word in two senses, when two actor groups own disjoint
     decisions in it, or when two clusters of aggregates never share an invariant.
   - **Merge** two contexts when they share most terms with the same meaning and change together.

   Use the evidence: `ontology.mjs language`, imports, and which rules span which aggregates. Present
   options with consequences, and record the chosen one with `ontology.mjs new-decision`.
4. **Pick patterns deliberately.**
   - Open Host Service + Published Language when several consumers need the same contract.
   - An ACL when the downstream's language must not be bent.
   - Conformist when the upstream is stable and fits.
   - A Shared Kernel only for small, jointly owned value types.
5. **Optional: enforce the map in CI.** On request, generate import rules from the map and the Code maps,
   for example a `dependency-cruiser` `forbidden` rule per disallowed context pair, or ESLint
   `no-restricted-imports` per context folder. Explain that the rules are only as precise as the Code
   maps.
6. **Apply** the agreed ontology changes: update `context-map.md` (diagram, table, Known issues), the
   READMEs and the flows; set `last_reviewed`; add a changelog line; then re-run `validate.mjs` and
   `boundaries`.
7. **Report** the findings, how each was resolved, and the decisions recorded.

## Guardrails

- Model dependency direction, not call direction, decides upstream and downstream.
- Do not move code between modules unless the user asks. Boundary work is design. Propose, then act.
