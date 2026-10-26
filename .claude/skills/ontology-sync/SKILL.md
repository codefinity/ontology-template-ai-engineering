---
name: ontology-sync
description: Update the ontology to match a code change - find which concepts, rules and use cases the changed files affect, and update rules, statuses, use cases, code references, the context map and the changelog. Use after implementing or merging changes to business logic, when asked to "update the ontology/docs for this change", or before opening a pull request that touches domain code.
---

# Sync the ontology with a code change

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Read `<ont>/00-meta/maintaining.md`
  ("When to update what"). Find the change: a base branch or commit (default `main`/`HEAD`), or the
  files the user names.

## Procedure

1. **Locate the impact**: `node <ont>/tools/ontology.mjs affected --git <base>` (or
   `affected <file>...`). For each changed file, it lists the ontology definitions that cite it, and the
   rule and use-case ids written in the file. Files "not cited by the ontology" are either new domain
   code (model it) or non-domain code (ignore it, and say so).
2. **Read the diff** (`git diff <base>`) for each affected file. For every business-relevant change,
   decide what it is:

   | Change in code | Update |
   | --- | --- |
   | A rule's limit, condition, rounding or message | The rule's statement. Status may move `partial` → `implemented` or the reverse. |
   | New validation, guard or calculation | A new rule (`next-id rule`). Link it from its aggregate. |
   | New field, entity or status | Aggregate structure, lifecycle and transition table; ubiquitous language |
   | New mutation or endpoint | Command, event, and the use case that reaches it |
   | New user journey or alternative path | Use case (main or alternative flow) |
   | New import across contexts | Context map relationship, or a boundary problem to report (`ontology.mjs boundaries`) |
   | Renamed or moved code | `code_refs`, `Code` columns, the README code map |
   | Removed behaviour | Status `deprecated`, with what replaced it |

3. **Never weaken intent silently.** If the code now contradicts an intended rule, ask the user whether
   the rule changed. If it did, update the statement and add a decision or changelog entry. If it did
   not, set `partial` with **Notes**, list it under *Known gaps*, and report it as a likely bug.
4. **Update bookkeeping**: set `last_reviewed` on each edited file and add a line to
   `00-meta/changelog.md`.
5. **Check**:
   - `validate.mjs` reports 0 errors (it catches code references broken by moves);
   - `ontology.mjs boundaries` shows no new findings;
   - `ontology.mjs gaps` has no new orphans.
6. **Report** the ontology files changed and why, the rules whose status changed, and the questions for
   the user.

## Automation tip

A project can run this check automatically. A Claude Code `Stop` hook, or a pre-commit hook, can run
`node ontology/tools/validate.mjs`, plus `ontology.mjs affected --git HEAD` to remind the author which
ontology entries a change touches. Set this up with the `update-config` skill if the user wants it.
