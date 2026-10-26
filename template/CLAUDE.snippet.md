## Business ontology

The business domain of this project is documented in [`ontology/`](ontology/README.md) as Domain-Driven
Design bounded contexts, each with its ubiquitous language, aggregates, business rules, use cases,
commands, events and read models.

- Before you implement or change business behaviour, find the owning bounded context in
  `ontology/README.md`, then follow `ontology/CLAUDE.md`. Read only the files the task needs.
  `node ontology/tools/ontology.mjs show <id>`, `find <word>` and `affected <file>` help.
- Name new code with the context's ubiquitous-language terms. The `Code` column gives the identifier to
  use where it differs from the business term.
- Cite the rule id in a comment where you enforce a business rule (`// ORD-BR-003`), and in the names of
  the tests that check it.
- Do not invent business rules. Ask, or record an open question in the context README.
- Update the ontology in the same change as the code, then run `node ontology/tools/validate.mjs`.
- The `ontology-*` skills in `.claude/skills/` cover implementing (`ontology-implement`), syncing
  (`ontology-sync`), reviewing (`ontology-review`), testing (`ontology-tests`) and discovery work.
