---
name: ontology-tests
description: Generate automated tests from the ontology's business rules and use cases - boundary-value cases for each rule, allowed/forbidden transitions for lifecycles, Given/When/Then acceptance tests for use-case flows - tagged with rule IDs so coverage is measurable. Use when asked to test business rules, raise rule coverage, write acceptance tests from use cases, or check which rules are untested.
---

# Tests from rules and use cases

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. The code root is `code_root` in its front
  matter.
- **Find the test framework.** Look in `package.json` (vitest, jest, playwright), `pyproject.toml` or
  `pytest.ini`, `*.csproj`, `pom.xml`, `go.mod` and so on. Follow the existing test layout and style.
  **If there is no test framework, propose one (the idiomatic default for the stack) and ask before
  adding dependencies or configuration.**

## Procedure

1. **Choose the targets.** Run `node <ont>/tools/ontology.mjs coverage` and take the rules
   "Without tests" in scope, or the rules or use cases the user names.
2. **For each rule** (`ontology.mjs show <id>`), open its `Code` location and derive the cases:

   | Rule kind | Cases |
   | --- | --- |
   | derivation (calculation) | Typical values; each boundary exactly, just below and just above; rounding cases (half-cent); zero and empty inputs |
   | validation | Every rejected input class, with the expected message or outcome; the smallest and largest accepted values |
   | invariant | Commands that would break it are refused or corrected; the state after each command still satisfies it |
   | lifecycle (status) | Every allowed transition succeeds; a representative forbidden transition is refused |
   | policy | When the trigger happens, the reaction happens, exactly once |

   Use the numbers in the rule statement. If the code disagrees with the rule, the test follows the
   **rule**, and fails. Report this as a bug; do not change the expectation to match the code.
3. **Test the enforcing unit**: the pure function, reducer, entity or service the `Code` field names. Do
   not test through the UI, unless the rule lives only there (then say so, and suggest moving it).
4. **Name tests by rule**: `describe('SHP-BR-010 Delivery fee', …)` / `it('SHP-BR-010: charges 5.99
   below 35.00', …)`. The rule id in the test file is what `coverage` counts.
5. **Rules that are not implemented**: add skipped or todo tests (`it.todo('ORD-BR-014: …')`) so the
   intent is visible. Do not add failing tests to the main suite without asking.
6. **Acceptance tests from use cases** (on request): one Given/When/Then scenario for the main flow and
   one per alternative flow, named `ORD-UC-01 main flow`, `ORD-UC-01 3a …`, at the level the project
   already uses (integration or end-to-end).
7. **Run the tests.** Fix the test code until the failures are real findings only. Then:
   - optionally fill each rule's **Tests** field with the test file path;
   - run `ontology.mjs coverage` again;
   - run `validate.mjs`.
8. **Report** the tests added per rule, the pass/fail result, the failures that reveal bugs (with rule
   ids), and the coverage before and after.

## Guardrails

- Expected values come from the rule statement, not from running the code.
- Keep tests deterministic. Inject the clock (rules that depend on "today") and random ids.
