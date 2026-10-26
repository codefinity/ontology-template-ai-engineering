# Working on this repository

This repository holds a reusable **template** (`template/`) and a filled-in **example** of it
(`example/hex-commerce/`). The example must always follow the template exactly. For any change to the
format, tools or skills, use the `ontology-template-evolve` skill (`.claude/skills/`).

## Keep the copies in sync

These must stay **identical** between the template and the example (and the repo-level skills):

| Template | Copy |
| --- | --- |
| `template/ontology/tools/*.mjs` | `example/hex-commerce/ontology/tools/` |
| `template/ontology/CLAUDE.md`, `00-meta/conventions.md`, `00-meta/maintaining.md`, `00-meta/extracting-from-code.md`, `00-meta/decisions/_decision-template.md` | same paths under `example/hex-commerce/ontology/` |
| `template/ontology/03-bounded-contexts/_context-template/` | `example/hex-commerce/ontology/03-bounded-contexts/_context-template/` |
| `template/.claude/skills/ontology-*` | `.claude/skills/ontology-*` |

Check with:

```bash
for f in tools/lib.mjs tools/validate.mjs tools/ontology.mjs CLAUDE.md 00-meta/conventions.md 00-meta/maintaining.md 00-meta/extracting-from-code.md 00-meta/decisions/_decision-template.md; do
  diff -q "template/ontology/$f" "example/hex-commerce/ontology/$f"; done
diff -rq template/ontology/03-bounded-contexts/_context-template example/hex-commerce/ontology/03-bounded-contexts/_context-template
for d in template/.claude/skills/ontology-*; do diff -rq "$d" ".claude/skills/$(basename "$d")"; done
```

## Validate before finishing

```bash
node template/ontology/tools/validate.mjs              # 0 errors; placeholder warnings are expected
node example/hex-commerce/ontology/tools/validate.mjs  # must report 0 errors and 0 warnings
node example/hex-commerce/ontology/tools/ontology.mjs gaps        # "No gaps found."
node example/hex-commerce/ontology/tools/ontology.mjs boundaries  # no undeclared crossings
```

The example's code checks need the HexCommerce source checked out at `../hex-commerce-source-ui`
(relative to this repository). Treat that repository as read-only.

## Editing the example

The example describes `hex-commerce-source-ui` **as built** (ADR-001 in the example). Every claim must be
traceable to code you have read. Do not invent rules or values. Copy example instances from the sample
data rather than making them up.
