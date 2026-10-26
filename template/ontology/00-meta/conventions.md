---
id: meta.conventions
type: meta
status: implemented
last_reviewed: 2026-10-27
---

# Conventions

This file is the specification every other file in the ontology follows. `tools/validate.mjs` checks the
parts marked **(validated)**. Keep it identical across projects so that people and Claude Code can move
between ontologies without relearning the format.

## 1. Principles

1. **One fact, one place.** Every definition, rule or relationship is written once. Elsewhere it is
   *referenced* by ID or link, never copied.
2. **Business language first.** Write as a domain expert would speak. Code identifiers, file paths and
   framework details appear only in the fields made for them (`Code`, `code_refs`, *Implementation*).
3. **Bounded contexts own their language.** A word means exactly one thing inside a context. The same
   word may mean something else in another context; the [glossary](../01-domain/glossary.md) records
   those differences.
4. **As-built and intended are both explicit.** Every file and every rule carries a status, so a reader
   always knows whether the code does this today.
5. **Plain text, diffable, renderable.** Markdown, YAML front matter and Mermaid only. No binary
   diagrams.

## 2. Folder layout

```text
ontology/
├── README.md                     index and reading guide
├── CLAUDE.md                     how Claude Code uses and maintains the ontology
├── 00-meta/                      conventions, maintenance guides, changelog
│   └── decisions/                decision records (ADR-NNN-*.md)
├── 01-domain/                    problem space: vision, subdomains, actors, glossary
├── 02-context-map/               solution space: context map, cross-context flows
├── 03-bounded-contexts/
│   ├── _context-template/        copy this to start a new context
│   └── <context-name>/           one folder per bounded context
│       ├── README.md             context canvas
│       ├── ubiquitous-language.md
│       ├── aggregates/<aggregate-name>.md
│       ├── value-objects.md
│       ├── business-rules.md
│       ├── use-cases.md
│       ├── commands.md
│       ├── domain-events.md
│       └── read-models.md
└── tools/                        validate.mjs, ontology.mjs (CLI), lib.mjs
```

- Folder and file names are `kebab-case`. A context folder is the context name in kebab-case
  (`SellerCentral` → `seller-central/`).
- Every context folder contains all nine entries above **(validated)**. When a file has nothing to say,
  keep it with a one-line statement such as "This context handles no commands." An empty file tells the
  reader the question was considered.
- Files and folders whose names start with `_` are templates. The validator ignores them.

## 3. Front matter (validated)

Every Markdown file starts with YAML front matter.

```yaml
---
id: Ordering.Order            # required, unique across the ontology
type: aggregate               # required, see the table below
context: Ordering             # required for context-scoped types
status: implemented           # required: draft | proposed | implemented | deprecated
last_reviewed: 2026-10-27     # required, YYYY-MM-DD
owners: [Product Owner]       # optional: people or roles accountable for the content
code_refs:                    # optional: files that implement this, relative to code_root
  - src/lib/types.ts#Order    # "#Symbol" is optional; the validator checks the symbol appears in the file
sources:                      # optional: requirement documents, tickets, interviews
  - BRD v3.0 section 8.4
---
```

| `type` | Where | `id` format | Needs `context` |
| --- | --- | --- | --- |
| `index` | `README.md` at the root. Also carries `code_root`, and optionally `code_aliases` (see §10) | `ontology.index` | no |
| `meta` | `00-meta/*`, `CLAUDE.md` | `meta.<name>` | no |
| `decision` | `00-meta/decisions/ADR-<NNN>-<slug>.md` | `ADR-<NNN>` | no |
| `domain-vision`, `subdomains`, `actors`, `glossary` | `01-domain/*` | `domain.<name>` | no |
| `context-map`, `flows` | `02-context-map/*` | `map.<name>` | no |
| `context` | `<context>/README.md`. Also carries `code`, `subdomain` and `classification` | `<Context>` | yes, same as `id` |
| `ubiquitous-language` | `<context>/ubiquitous-language.md` | `<Context>.language` | yes |
| `aggregate` | `<context>/aggregates/*.md` | `<Context>.<AggregateRoot>` | yes |
| `value-objects` | `<context>/value-objects.md` | `<Context>.value-objects` | yes |
| `business-rules` | `<context>/business-rules.md` | `<Context>.rules` | yes |
| `use-cases` | `<context>/use-cases.md` | `<Context>.use-cases` | yes |
| `commands` | `<context>/commands.md` | `<Context>.commands` | yes |
| `domain-events` | `<context>/domain-events.md` | `<Context>.events` | yes |
| `read-models` | `<context>/read-models.md` | `<Context>.read-models` | yes |

### Status values

| Status | Meaning |
| --- | --- |
| `draft` | Being written; not yet reviewed by a domain expert. |
| `proposed` | Agreed as the intended model but not built yet (greenfield or target state). |
| `implemented` | Describes what the code does today. |
| `deprecated` | Kept for history. Say what replaces it. |

## 4. Identifiers

| Thing | Format | Example | Defined by |
| --- | --- | --- | --- |
| Bounded context | `PascalCase` name and a 2–4 letter `code` | `Ordering` / `ORD` | context `README.md` front matter |
| Subdomain | `SD-<NAME>` (a word, never all `N`s) | `SD-PURCHASING` | first cell of a row in `subdomains.md` **(validated)** |
| Actor | `ACT-<NAME>` | `ACT-SHOPPER` | first cell of a row in `actors.md` **(validated)** |
| Business objective | `BO-<NN>` | `BO-02` | row in `domain-vision.md` |
| Context relationship | `REL-<NN>` | `REL-04` | first cell of a row in `context-map.md` **(validated)** |
| Cross-context flow | `FLOW-<NN>` | `FLOW-02` | `## FLOW-<NN> <title>` heading in `cross-context-flows.md` **(validated)** |
| Model concept (aggregate, entity, value object, command, event, policy, read model) | `<Context>.<PascalName>` | `Ordering.OrderPlaced` | `###` heading or aggregate front matter **(validated)** |
| Business rule | `<CODE>-BR-<NNN>` | `ORD-BR-003` | `###` heading in `business-rules.md` **(validated)** |
| Use case | `<CODE>-UC-<NN>` | `ORD-UC-01` | `###` heading in `use-cases.md` **(validated)** |
| Open question | `<CODE>-Q-<NN>` | `ORD-Q-01` | first cell of a row in the context `README.md` **(validated)** |
| Decision | `ADR-<NNN>` | `ADR-002` | front matter `id` of a file in `00-meta/decisions/` **(validated)** |

Every id in the validated rows that is mentioned anywhere (outside `00-meta`) must be defined. Use
`node tools/ontology.mjs next-id <kind> [Context]` to get the next free number.

- IDs are permanent. Never renumber or reuse one. A withdrawn rule keeps its heading with status
  `deprecated` and says what replaced it.
- Number rules in the order they are added, not by topic. Group them with `##` headings instead.

## 5. Defining and referencing concepts (validated)

**Defining.** In `aggregates/*`, `value-objects.md`, `commands.md`, `domain-events.md` and
`read-models.md`, every `###` heading defines one concept. The heading text is the bare PascalCase name.
Anything after the first space is ignored, so `### OrderPlaced` and `### OrderPlaced (integration)` both
define `Ordering.OrderPlaced`. In `business-rules.md` every `###` heading starts with the rule ID followed
by a short title: `### ORD-BR-001 New orders start in Processing`. In `use-cases.md` every `###` heading
starts with the use-case ID: `### ORD-UC-01 Check out and place an order`.

**Referencing.** Inside the ontology:

- Write qualified concept names in backticks: `` `Ordering.Order` ``, `` `Shopping.Basket.lines` ``.
  The validator checks that every backticked `<Context>.<Name>` exists.
- Write rule IDs as plain text or in backticks: `ORD-BR-003`. The validator checks they exist.
- Link files with relative Markdown links. The validator checks they resolve.

**In code**, cite a rule ID in a comment where the rule is enforced (`// ORD-BR-003`). Then a search
for the ID finds both the specification and its enforcement.

## 6. Writing rules

Each rule is a `###` block with these fields, in this order:

```markdown
### ORD-BR-003 Expected delivery date depends on delivery speed
- **Statement:** One or two sentences in business language, testable and unambiguous.
- **Kind:** invariant | validation | derivation | policy | constraint
- **Applies to:** `Ordering.Order`
- **Status:** implemented | partial | not-implemented | deprecated
- **Code:** `src/path/file.ts` (`functionName`)
- **Source:** where the rule came from (requirement ID, interview, regulation)
- **Tests:** optional. `path/to/test-file` of the tests that check this rule
- **Notes:** optional. Examples, edge cases, deviations from the source.
```

**Statement** and **Status** are required **(validated)**. A test counts for a rule when the test file
contains the rule ID (in its name or a comment), or when **Tests** names the file.
`node tools/ontology.mjs coverage` reports which rules have tests.

| Kind | Use for |
| --- | --- |
| `invariant` | Must always be true for an aggregate (for example "exactly one default address"). |
| `validation` | Input that must be refused, and the information the user gets. |
| `derivation` | How a value is calculated (totals, statuses derived from dates). |
| `policy` | "When X happens, then do Y", usually across aggregates or contexts. |
| `constraint` | A limit imposed from outside the domain (legal, technical, demo-only). |

`partial` and `not-implemented` must say in **Notes** what is missing.

## 6a. Writing use cases

A use case is one actor's goal, achieved by talking to the system: what a person sets out to do, not a
screen or a button. It belongs to the context that owns the actor's goal. When a use case crosses
contexts, the owning context keeps the use case and the cross-context mechanics go in a flow. Each use
case is a `###` block in `use-cases.md`:

```markdown
### ORD-UC-01 Check out and place an order
- **Actor:** ACT-SHOPPER
- **Goal:** Buy everything in the basket.
- **Trigger:** what starts it
- **Preconditions:** what must be true before
- **Main flow:**
  1. The shopper …
  2. The system …
- **Alternative flows:** `2a.` variations and failures, each saying how it ends
- **Postconditions:** what is true after success
- **Commands:** `Ordering.PlaceOrder`
- **Rules:** ORD-BR-006, ORD-BR-003
- **Flows:** FLOW-02 (when it crosses contexts)
- **Status:** implemented | partial | not-implemented | deprecated
- **Code:** entry points (route, handler, screen)
- **Source:** requirement ID or process
```

**Actor**, **Goal**, **Main flow** and **Status** are required **(validated)**. Write each step as
"The \<actor or system\> \<verb\> …". Name the system's response in business terms, never as a UI
action ("the system shows the totals", not "a modal opens"). `node tools/ontology.mjs gaps` lists
commands that no use case reaches and use cases that cite no rule.

## 6b. Recording decisions

A decision record (ADR) captures a modelling choice that someone will later question: a context boundary,
a term chosen over another, a relationship pattern, or a deliberate gap between code and intent. Keep one
file per decision in `00-meta/decisions/`, created with `node tools/ontology.mjs new-decision "<title>"`.
The front matter `status` follows the usual values: `proposed` (under discussion), `implemented`
(accepted and in effect) or `deprecated` (superseded; say by which ADR). Reference decisions by id
(`ADR-002`) from the files they affect.

## 7. DDD vocabulary used here

### Subdomain types

| Type | Meaning | Investment |
| --- | --- | --- |
| Core | Differentiates the business; the reason it wins. | Best people, deepest modelling. |
| Supporting | Necessary and business-specific, but not a differentiator. | Simple, pragmatic models. |
| Generic | Solved problem, the same for everyone (identity, payments, configuration). | Buy, reuse, or keep minimal. |

### Context relationship patterns

Use these exact names in `context-map.md`. U = upstream (its model influences the other), D = downstream.

| Pattern | Short | Meaning |
| --- | --- | --- |
| Partnership | P | Two contexts succeed or fail together and plan changes jointly. |
| Shared Kernel | SK | A small part of the model is shared and changed only by agreement. |
| Customer–Supplier | C/S | D's needs are taken into U's planning. |
| Conformist | CF | D adopts U's model as-is, without translating it. |
| Anticorruption Layer | ACL | D translates U's model into its own, to protect its language. |
| Open Host Service | OHS | U offers a defined protocol or API for all its consumers. |
| Published Language | PL | A documented exchange model (schema, event contract) shared by both. |
| Separate Ways | SW | No integration; the contexts solve their needs independently. |
| Big Ball of Mud | BBoM | A part with no clear model; isolate it behind an ACL. |

### Tactical building blocks

| Term | Meaning in this ontology |
| --- | --- |
| Aggregate | A consistency boundary with one root entity. Invariants hold whenever a command completes. One file per aggregate. |
| Entity | Has identity that lasts while its attributes change. Defined inside its aggregate's file. |
| Value object | Defined only by its attributes and immutable (money, address snapshot). Shared ones go in `value-objects.md`; ones used by a single aggregate may sit in that aggregate's file. |
| Command | A request to change state, named imperatively (`PlaceOrder`). May be rejected. |
| Domain event | A fact that happened, named in the past tense (`OrderPlaced`). Cannot be rejected. |
| Policy | A reaction: "when `<event>`, then `<command>`". Lives in `domain-events.md` under `## Policies`. |
| Read model | A query or projection that answers a question and changes nothing. |
| Use case | An actor's goal and the dialogue that achieves it. It invokes commands and reads read models. |

## 8. Diagrams

Use Mermaid fenced blocks (` ```mermaid `). They render on GitHub, GitLab and most IDEs and stay
readable as text.

- Context map: `flowchart LR`
- Aggregate structure: `classDiagram`
- Lifecycles: `stateDiagram-v2`
- Cross-context flows: `sequenceDiagram`

A diagram illustrates; the text is authoritative. If they disagree, fix the diagram.

## 9. Style

- Present tense, active voice: "The basket holds at most 10 units of a product."
- Name the actor or the context that does a thing.
- Use the context's preferred terms exactly as the ubiquitous language spells them.
- Prefer tables for lists of like items, and headings plus bullet fields for things with several attributes.
- Leave UI layout, styling and component structure out unless the business depends on them.

## 10. Tools

All tools are plain Node (18+) with no dependencies, in `tools/`.

| Tool | Purpose |
| --- | --- |
| `validate.mjs` | Checks everything marked **(validated)** above, plus links and code paths. Run it after every edit. |
| `ontology.mjs` | CLI for people and skills. **Query:** `show`, `find`, `refs`, `stats`, `export`. **Scaffold:** `next-id`, `new-context`, `new-aggregate`, `new-decision`, `rename`. **Analyse code:** `affected`, `coverage`, `gaps`, `boundaries`, `mine-rules`, `language`. Run it with no arguments for usage. |
| `lib.mjs` | The loader both tools share. |

The code-analysing commands need `code_root`. `boundaries` resolves imports through
`tsconfig.json`/`jsconfig.json` `paths`. For anything else, add aliases to the index front matter:
`code_aliases: ["@/=src/"]`. It treats a code file as owned by a context when exactly one context README
cites it, so keep each context's **Code map** precise.
