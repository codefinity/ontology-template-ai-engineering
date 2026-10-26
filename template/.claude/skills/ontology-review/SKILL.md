---
name: ontology-review
description: Review a code change (diff, branch or pull request) against the DDD ontology - broken or changed business rules, context-boundary violations, naming against the ubiquitous language, missing use-case/rule/ontology updates, and untested rules. Use when asked to review a PR or diff in a project with an ontology/ folder, or to check that a change respects the domain model.
---

# Review a change against the ontology

This is read-only. Report findings; change nothing unless the user asks you to fix them.

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Find the change: a PR (`gh pr diff <n>`), a
  branch against its base, or the working tree against `HEAD`.

## Procedure

1. **Impact**: `node <ont>/tools/ontology.mjs affected --git <base>`. Read every definition it lists for
   the changed files: rules, use cases, aggregates.
2. **Check each changed hunk of domain code**:
   - **Rules.** Does the change break or alter a rule it touches? Compare values, boundaries, conditions
     and transitions with the rule statement (`ontology.mjs show <id>`). If it alters one intentionally,
     did the ontology change with it?
   - **Placement.** Is an invariant enforced only in the UI or in another context, instead of in its
     aggregate? Is logic duplicated from another context's rule?
   - **Boundaries.** Run `ontology.mjs boundaries`. Does the change add an import across contexts that
     no relationship allows? Is it reaching into another context's internals instead of its published
     contract?
   - **Language.** Do new names use ubiquitous-language terms? `ontology.mjs language` flags avoided
     terms. Check only the new lines.
   - **Use cases.** Does the change add or alter a user journey or an alternative path without updating
     `use-cases.md`?
   - **Tests.** Do the rules added or changed have tests that cite their ids? `ontology.mjs coverage`
     shows this.
   - **Ontology updates.** If the diff changes `ontology/`, does `validate.mjs` pass? Are statuses,
     `last_reviewed` and the changelog updated? Files "not cited by the ontology" that contain domain
     logic need modelling.
3. **Report** findings, most severe first. For each: severity (**blocker** = breaks an implemented rule
   or crosses a boundary illegally; **major** = ontology out of date, rule untested, logic misplaced;
   **minor** = naming), `file:line`, the rule, use case or relationship id, what is wrong, and the
   suggested fix. Then list what is fine, briefly. Then any questions for the author, where intent is
   unclear.

## Guardrails

- Cite ids and evidence for every finding. A rule change can be legitimate: ask whether it is intended,
  rather than calling it a bug.
- When the host provides a findings-report tool for reviews, use it as instructed instead of plain text.
