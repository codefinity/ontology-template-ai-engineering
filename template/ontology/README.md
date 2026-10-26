---
id: ontology.index
type: index
status: draft
last_reviewed: YYYY-MM-DD
code_root: ..   # path from this folder to the root of the code the ontology describes
owners: [<Name or role>]
---

# <Project name> — Business Ontology

<!-- One paragraph: what the business does and which part of it this ontology covers. -->

This folder is the single source of truth for the business language, model and rules of
<Project name>. It follows the strategic patterns of Domain-Driven Design:

- the **problem space** is described as a domain with subdomains (`01-domain/`);
- the **solution space** is split into bounded contexts, and the [context map](02-context-map/context-map.md)
  shows how they relate;
- each **bounded context** owns its ubiquitous language, model and rules in its own folder
  (`03-bounded-contexts/<context-name>/`).

## How to read it

| If you want to… | Read |
| --- | --- |
| Understand the business in five minutes | [Domain vision](01-domain/domain-vision.md) |
| Know what a word means | [Glossary](01-domain/glossary.md), then the owning context's `ubiquitous-language.md` |
| Find which context owns a concept | [Bounded contexts](#bounded-contexts) below |
| See how contexts work together | [Context map](02-context-map/context-map.md), [cross-context flows](02-context-map/cross-context-flows.md) |
| Change behaviour in code | The context `README.md`, then `business-rules.md`, then the aggregate file |
| Add to or change this ontology | [Conventions](00-meta/conventions.md), [Maintaining](00-meta/maintaining.md) |
| Build an ontology from existing code | [Extracting from code](00-meta/extracting-from-code.md) |

## Bounded contexts

<!-- One row per context. Keep in the same order as the context map. -->

| Context | Code | Subdomain | Type | Purpose |
| --- | --- | --- | --- | --- |
| [<ContextName>](03-bounded-contexts/<context-name>/README.md) | `<CTX>` | `SD-<NAME>` | core / supporting / generic | <One line> |

## Folder layout

```text
ontology/
├── README.md                 this index
├── CLAUDE.md                 instructions for Claude Code
├── 00-meta/                  conventions, maintenance, extraction playbook, changelog
├── 01-domain/                domain vision, subdomains, actors, glossary
├── 02-context-map/           context map and cross-context flows
├── 03-bounded-contexts/      one folder per bounded context (copy _context-template)
└── tools/validate.mjs        structural checks: node tools/validate.mjs
```

## Checking the ontology

```bash
node ontology/tools/validate.mjs            # from the repository root
```

The validator checks front matter, unique IDs, that every referenced concept and rule exists, that
links resolve, and that `code_refs` point at files that exist under `code_root`.
