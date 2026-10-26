---
name: ontology-rule-miner
description: Find business rules hidden in code (validations, limits, calculations, status transitions, date logic) that the ontology does not yet record, and check that recorded rules still match the code. Use when asked to "find the business rules", "what rules does this code enforce", to audit rule coverage of the ontology, or after a large change to business logic.
---

# Mine business rules from code

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Read `<ont>/00-meta/conventions.md` §6
  (rule format) and §7 (rule kinds).
- Agree the scope with the user: whole source tree, one context's files, or a path. Exclude build
  scripts and docs tooling.

## Procedure

1. **Collect candidates**:
   `node <ont>/tools/ontology.mjs mine-rules --path <src-dir> --uncited --json`.
   Each candidate is a line with:
   - a category: validation, limit, calculation, state or date;
   - its enclosing symbol;
   - `cited` (a rule already names this file and symbol), `file-cited` (only the file), or `uncited`.
2. **Triage every candidate.** Read the surrounding code, not just the line. Classify it as one of:
   - **New rule.** Business behaviour that a domain expert would recognise and could change ("at most 10
     units", "deal price rounded to the cent", "only Pending applications can be decided").
   - **Covered.** An existing rule states it already. Check with `ontology.mjs find` or `refs`. If the
     rule's `Code` field does not name this location, add it.
   - **Not a rule.** Presentation, technical plumbing, pagination size, animation timing, or a
     defensive check with no business meaning.
3. **Write each new rule precisely.** Read the code until you can state:
   - the exact values and units, and whether boundaries are inclusive;
   - what is rejected and with what message;
   - which aggregate it protects.

   Pick the owning context from the context README code maps. If a rule seems to belong to two
   contexts, it belongs to the one whose aggregate holds the data it constrains.
4. **Check drift** of existing `implemented` rules in scope. For each one, open its `Code` location and
   confirm the statement still holds: numbers, boundaries, branches. Record any difference.
5. **Present findings before editing**, unless the user asked you to apply them. Use a table with:
   candidate, location, proposed context, kind, draft statement, and verdict (new / covered / not a
   rule / drift).
6. **Apply** the accepted items:
   - new rule: `next-id rule <Context>`, write the block (`Status: implemented`, `Code`, a `Source` such
     as "code" or a requirement), and add it to the aggregate's *Invariants* or the command's *Rejected
     when*;
   - drift: fix the statement if the code is right, or set `partial` with **Notes** if the ontology is
     right;
   - set `last_reviewed`, add a changelog line, and run `validate.mjs`.
7. **Report** the counts (new, covered, rejected, drift) and the rules added.

## Guardrails

- A candidate list is a lead, not evidence. Every rule you add must be confirmed by reading the code.
- Do not change code. If a rule looks wrong (a bug), record it as `partial` with **Notes** and tell the
  user.
- One rule = one testable statement. Split "A and B" rules.
