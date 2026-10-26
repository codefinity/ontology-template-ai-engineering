# Ontology template

A drop-in folder for documenting a project's business ontology. It follows Domain-Driven Design strategic
patterns, and is written for both people and Claude Code: a format, a validator, a query-and-analysis
CLI, and a set of Claude Code skills that create, maintain and implement from it.

## What you get

```text
template/
├── ontology/                       copy into your project as ./ontology
│   ├── README.md                   index and reading guide (fill in)
│   ├── CLAUDE.md                   instructions Claude Code loads when it works in ontology/
│   ├── 00-meta/                    conventions (the spec), maintenance, extraction playbook, changelog
│   │   └── decisions/              decision records (ADRs) and their template
│   ├── 01-domain/                  domain vision, subdomains, actors, glossary
│   ├── 02-context-map/             context map, cross-context flows
│   ├── 03-bounded-contexts/
│   │   └── _context-template/      README, language, aggregates/, value objects, rules, use cases,
│   │                               commands, events, read models
│   └── tools/
│       ├── validate.mjs            structure, ids, references, links, code paths (Node 18+, no deps)
│       ├── ontology.mjs            CLI: query, scaffold, analyse code
│       └── lib.mjs                 shared loader
├── .claude/skills/ontology-*/      13 Claude Code skills (below)
└── CLAUDE.snippet.md               paste into your project's root CLAUDE.md
```

## Skills

| Phase | Skill | What it does |
| --- | --- | --- |
| Discover | `ontology-extract` | Builds the ontology from an existing codebase |
| | `ontology-from-requirements` | Builds or extends it from a BRD, PRD, stories or interview notes |
| | `ontology-workshop` | Runs an interactive Event Storming session and captures the results |
| | `ontology-use-cases` | Finds actor goals from entry points or requirements, and writes use cases |
| | `ontology-rule-miner` | Finds rules hidden in code, and checks recorded rules for drift |
| | `ontology-language` | Audits terminology: synonyms, homonyms, avoided words in code and UI |
| | `ontology-boundaries` | Finds imports that cross contexts without a relationship; split, merge and pattern choices |
| Maintain | `ontology-scaffold` | Adds a context, aggregate, rule, use case, decision or relationship with the next id; renames; deprecates |
| | `ontology-sync` | Updates the ontology after a code change (`affected --git`) |
| | `ontology-reconcile` | Three-way reconciliation of code, ontology and requirements, with evidence |
| Build | `ontology-implement` | Implements a change from the ontology: right context, rules cited, tests, ontology updated |
| | `ontology-tests` | Turns rules and use cases into tests tagged with rule ids; measures coverage |
| | `ontology-review` | Reviews a diff against rules, boundaries, language and ontology upkeep |

Every skill does its mechanical work through `ontology/tools/ontology.mjs` (run it with no arguments for
the command list) and finishes with `validate.mjs`.

## Invoking the skills explicitly

Claude Code loads skills from `.claude/skills/<name>/SKILL.md` in your project, or from
`~/.claude/skills/<name>/` for you only, when a session starts. After copying them in, start a new
session.

You can just describe the task (*"review my branch against the ontology"*), and Claude picks the matching
skill from its description. To choose the skill yourself, invoke it explicitly.

**As a slash command.** Type `/`, the skill name, then your request, which is passed to the skill as its
input:

```text
/ontology-implement Refuse expired cards at checkout (ORD-BR-016)
/ontology-review main..feature/returns
/ontology-tests SHP-BR-009 to SHP-BR-014
```

Type `/` on its own to see the available commands; the `ontology-*` skills are listed once installed.

**By name in a prompt**, which lets you add instructions:

```text
Use the ontology-rule-miner skill on src/billing only. Show me the table; don't apply anything yet.
```

| Skill | Input it expects | Example |
| --- | --- | --- |
| `ontology-extract` | Code location; optional requirement docs | `/ontology-extract src/ — requirements are in docs/` |
| `ontology-from-requirements` | Documents or sections; the scope | `/ontology-from-requirements docs/PRD.md, the returns chapter` |
| `ontology-workshop` | The journey or subdomain to explore | `/ontology-workshop seller payouts` |
| `ontology-use-cases` | A context, or "all" | `/ontology-use-cases Ordering` |
| `ontology-rule-miner` | A path to scan; whether to apply | `/ontology-rule-miner src/ — report only` |
| `ontology-language` | A context and/or a term | `/ontology-language Shopping: basket vs cart` |
| `ontology-boundaries` | Optional: contexts, or "generate lint rules" | `/ontology-boundaries and generate dependency-cruiser rules` |
| `ontology-scaffold` | The structural edit | `/ontology-scaffold add a Payments context, code PAY, generic` |
| `ontology-sync` | A base branch or commit, or files | `/ontology-sync main` |
| `ontology-reconcile` | A context or rule ids; the requirement source | `/ontology-reconcile Ordering against docs/BRD.docx` |
| `ontology-implement` | The feature, fix or rule ids | `/ontology-implement let sellers cancel new orders` |
| `ontology-tests` | Rule or use-case ids, or a context | `/ontology-tests Shopping` |
| `ontology-review` | A PR number, branch range, or nothing (the working tree) | `/ontology-review 142` |

Tips:
- Chain skills for a full cycle: `/ontology-implement …`, then `/ontology-tests …`, then `/ontology-review`.
- Skills that change meaning (rules, terms, boundaries) propose first and wait for you. Add *"apply
  directly"* or *"report only"* to change that.
- If a skill is missing from the `/` list, check three things: the folder name matches the `name:` in
  its `SKILL.md`, the path is `.claude/skills/<name>/SKILL.md`, and the session started after you
  copied it.

The repository's root [README](../README.md#using-the-skills) has a worked example for every skill and
three end-to-end workflows.

## Adopt it in a project

1. Copy `template/ontology/` to the root of your repository as `ontology/`.
2. In `ontology/README.md`, set `code_root` to the path from `ontology/` to the code. It is usually `..`.
3. Copy `template/.claude/skills/` into your repository's `.claude/skills/`.
4. Paste the contents of `CLAUDE.snippet.md` into your repository's root `CLAUDE.md` (create it if needed).
5. Build the ontology:
   - from existing code, ask Claude Code to "build the ontology from this codebase" (`ontology-extract`);
   - from documents, use `ontology-from-requirements`;
   - from scratch, with domain experts, use `ontology-workshop`;
   - by hand, follow `00-meta/conventions.md`, using `ontology.mjs new-context` to scaffold.
6. Run `node ontology/tools/validate.mjs`, `ontology.mjs gaps` and `ontology.mjs boundaries`, and fix
   what they report.

## Design choices

| Choice | Why |
| --- | --- |
| One folder per bounded context, identical file set | Ownership is obvious, and readers (and Claude) always know where to look. |
| Markdown + YAML front matter + Mermaid | Diffable, reviewable in pull requests, rendered by GitHub and IDEs, and easy for LLMs to read. |
| `###` heading = one definition | Each concept, rule or use case is addressable, greppable, and loadable alone (`ontology.mjs show <id>`). |
| Stable ids (`ORD-BR-003`, `ORD-UC-01`, `Ordering.Order`) | Code comments, tests and tickets can cite them. The validator checks every reference, and `coverage` counts tests by them. |
| Status on every file, rule and use case | As-built and intended behaviour live side by side without confusion. |
| `Code` fields and `code_refs` | The model connects to the code: `affected` finds the impact of a diff, `boundaries` checks the context map against imports, and the validator detects moved files and renamed symbols. |
| Use cases next to rules | Actor goals and their alternative flows are where edge cases, and therefore tests, come from. |
| Decision records | Boundary and naming choices keep their reasons. |
| Glossary as an index, not a dictionary | Definitions live in their context, so the same word can mean different things in different contexts. |

See [`example/hex-commerce/`](../example/hex-commerce/) for a complete ontology built with this template.
