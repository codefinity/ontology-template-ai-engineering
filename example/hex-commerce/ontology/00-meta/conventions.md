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
│       ├── commands.md
│       ├── domain-events.md
│       └── read-models.md
└── tools/validate.mjs
```

- Folder and file names are `kebab-case`. A context folder is the context name in kebab-case
  (`SellerCentral` → `seller-central/`).
- Every context folder contains all eight entries above **(validated)**. When a file has nothing to say,
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
| `index` | `README.md` at the root. Also carries `code_root` | `ontology.index` | no |
| `meta` | `00-meta/*`, `CLAUDE.md` | `meta.<name>` | no |
| `domain-vision`, `subdomains`, `actors`, `glossary` | `01-domain/*` | `domain.<name>` | no |
| `context-map`, `flows` | `02-context-map/*` | `map.<name>` | no |
| `context` | `<context>/README.md`. Also carries `code`, `subdomain` and `classification` | `<Context>` | yes, same as `id` |
| `ubiquitous-language` | `<context>/ubiquitous-language.md` | `<Context>.language` | yes |
| `aggregate` | `<context>/aggregates/*.md` | `<Context>.<AggregateRoot>` | yes |
| `value-objects` | `<context>/value-objects.md` | `<Context>.value-objects` | yes |
| `business-rules` | `<context>/business-rules.md` | `<Context>.rules` | yes |
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
| Subdomain | `SD-<NAME>` | `SD-PURCHASING` | row in `subdomains.md` |
| Actor | `ACT-<NAME>` | `ACT-SHOPPER` | row in `actors.md` |
| Business objective | `BO-<NN>` | `BO-02` | row in `domain-vision.md` |
| Context relationship | `REL-<NN>` | `REL-04` | row in `context-map.md` |
| Cross-context flow | `FLOW-<NN>` | `FLOW-02` | heading in `cross-context-flows.md` |
| Model concept (aggregate, entity, value object, command, event, policy, read model) | `<Context>.<PascalName>` | `Ordering.OrderPlaced` | `###` heading or aggregate front matter **(validated)** |
| Business rule | `<CODE>-BR-<NNN>` | `ORD-BR-003` | `###` heading in `business-rules.md` **(validated)** |
| Open question | `<CODE>-Q-<NN>` | `ORD-Q-01` | row in the context `README.md` |

- IDs are permanent. Never renumber or reuse one. A withdrawn rule keeps its heading with status
  `deprecated` and says what replaced it.
- Number rules in the order they are added, not by topic. Group them with `##` headings instead.

## 5. Defining and referencing concepts (validated)

**Defining.** In `aggregates/*`, `value-objects.md`, `commands.md`, `domain-events.md` and
`read-models.md`, every `###` heading defines one concept. The heading text is the bare PascalCase name.
Anything after the first space is ignored, so `### OrderPlaced` and `### OrderPlaced (integration)` both
define `Ordering.OrderPlaced`. In `business-rules.md` every `###` heading starts with the rule ID followed
by a short title: `### ORD-BR-001 New orders start in Processing`.

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
- **Notes:** optional. Examples, edge cases, deviations from the source.
```

| Kind | Use for |
| --- | --- |
| `invariant` | Must always be true for an aggregate (for example "exactly one default address"). |
| `validation` | Input that must be refused, and the information the user gets. |
| `derivation` | How a value is calculated (totals, statuses derived from dates). |
| `policy` | "When X happens, then do Y", usually across aggregates or contexts. |
| `constraint` | A limit imposed from outside the domain (legal, technical, demo-only). |

`partial` and `not-implemented` must say in **Notes** what is missing.

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
