# Business Ontology Template for AI-Assisted Engineering

A template for documenting the business ontology of any software project: its language, model and rules.
It follows the **strategic patterns of Domain-Driven Design**, and is written so that people and
**Claude Code** can both create it, edit it, understand it, and consult it while writing code.

```text
ontology-template-ai-engineering/
├── template/                       the reusable template; copy template/ontology into a project
│   ├── ontology/
│   │   ├── 00-meta/                conventions (the spec), maintenance, extraction playbook, changelog
│   │   ├── 01-domain/              problem space: vision, subdomains, actors, glossary
│   │   ├── 02-context-map/         solution space: context map, cross-context flows
│   │   ├── 03-bounded-contexts/
│   │   │   └── _context-template/  one folder per bounded context, copied from here
│   │   ├── tools/validate.mjs      validator (Node 18+, no dependencies)
│   │   ├── README.md               index
│   │   └── CLAUDE.md               how Claude Code uses and maintains it
│   ├── .claude/skills/ontology/    optional Claude Code skill
│   └── CLAUDE.snippet.md           paste into a project's root CLAUDE.md
└── example/
    └── hex-commerce/               the template filled in from a real Next.js marketplace
```

## How DDD maps onto the folders

| DDD strategic concept | Where it lives |
| --- | --- |
| Domain vision statement | `01-domain/domain-vision.md` |
| Subdomains (core, supporting, generic) | `01-domain/subdomains.md` |
| Bounded contexts | `03-bounded-contexts/<context>/`: one folder each, with an identical file set |
| Ubiquitous language (per context) | `03-bounded-contexts/<context>/ubiquitous-language.md` |
| Context map and relationship patterns | `02-context-map/context-map.md` |
| Cross-context processes | `02-context-map/cross-context-flows.md` |

Each bounded context folder also holds the tactical model: aggregates (one file each), value objects,
business rules, commands, domain events with policies, and read models.

## How it serves Claude Code

- `ontology/CLAUDE.md` loads automatically whenever Claude Code works inside `ontology/`. It tells
  Claude what to read before coding, how to name things, and how to keep the ontology current.
- `CLAUDE.snippet.md` goes in the project's root `CLAUDE.md`, so Claude consults the ontology before
  changing business behaviour.
- Every concept and rule has a stable ID (`Ordering.Order`, `ORD-BR-003`), so code comments, tickets and
  conversations can cite them precisely.
- `Code` columns and `code_refs` map each concept to the files that implement it.
- `tools/validate.mjs` catches broken references, duplicate IDs and **drift between the ontology and the
  code** (missing files or symbols), so an agent can check its own edits.
- The optional `ontology` skill packages four workflows: consult, update, extract, check.

## Quick start

```bash
cp -r template/ontology  /path/to/your-project/ontology
cp -r template/.claude   /path/to/your-project/          # optional skill
cat template/CLAUDE.snippet.md >> /path/to/your-project/CLAUDE.md
node /path/to/your-project/ontology/tools/validate.mjs
```

Then follow [`template/README.md`](template/README.md). For an existing codebase, ask Claude Code to run
the extraction playbook in `ontology/00-meta/extracting-from-code.md`.

## The example

[`example/hex-commerce/`](example/hex-commerce/README.md) is a complete ontology of the HexCommerce
marketplace: 9 bounded contexts, 15 aggregates and 125 business rules, each tied to the code that enforces
it and, where one exists, to the BRD requirement it comes from. Read it alongside the template to see what "done" looks like.
