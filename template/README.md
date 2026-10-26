# Ontology template

A drop-in folder for documenting a project's business ontology. It follows Domain-Driven Design strategic
patterns and is written for both people and Claude Code.

## What you get

```text
template/
├── ontology/                     copy into your project as ./ontology
│   ├── README.md                 index and reading guide (fill in)
│   ├── CLAUDE.md                 instructions Claude Code loads when it works in ontology/
│   ├── 00-meta/                  conventions (the spec), maintenance, extraction playbook, changelog
│   ├── 01-domain/                domain vision, subdomains, actors, glossary
│   ├── 02-context-map/           context map, cross-context flows
│   ├── 03-bounded-contexts/
│   │   └── _context-template/    copy once per bounded context
│   └── tools/validate.mjs        structural validator (Node 18+, no dependencies)
├── CLAUDE.snippet.md             paste into your project's root CLAUDE.md
└── .claude/skills/ontology/      optional Claude Code skill: consult, update, extract, check
```

## Adopt it in a project

1. Copy `template/ontology/` to the root of your repository as `ontology/`.
2. In `ontology/README.md`, set `code_root` to the path from `ontology/` to the code. It is usually `..`.
3. Paste the contents of `CLAUDE.snippet.md` into your repository's root `CLAUDE.md` (create it if needed).
4. Optional: copy `.claude/skills/ontology/` into your repository's `.claude/skills/`.
5. Fill in the ontology in this order:
   1. `01-domain/domain-vision.md`, `subdomains.md` and `actors.md`
   2. one folder per bounded context, copied from `03-bounded-contexts/_context-template/`
   3. `02-context-map/context-map.md` and `cross-context-flows.md`
   4. `01-domain/glossary.md`, last, as an index over the context languages
6. Run `node ontology/tools/validate.mjs` and fix what it reports.

For an existing codebase, have Claude Code do steps 5–6 with the prompt at the end of
[`00-meta/extracting-from-code.md`](ontology/00-meta/extracting-from-code.md).

## Design choices

| Choice | Why |
| --- | --- |
| One folder per bounded context, identical file set | Ownership is obvious, and readers (and Claude) always know where to look. |
| Markdown + YAML front matter + Mermaid | Diffable, reviewable in pull requests, rendered by GitHub and IDEs, and easy for LLMs to read. |
| `###` heading = one definition | Each concept or rule is addressable, greppable, and loadable alone. |
| Stable IDs (`ORD-BR-003`, `Ordering.Order`) | Code comments, tickets and tests can cite a rule, and the validator can check every reference. |
| Status on every file and rule | As-built and intended behaviour can live side by side without confusion. |
| `Code` columns and `code_refs` | The model connects to the code, and the validator detects drift when files move. |
| Glossary as an index, not a dictionary | Definitions live in their context, so the same word can mean different things in different contexts. |

See [`example/hex-commerce/`](../example/hex-commerce/) for a complete ontology built with this template.
