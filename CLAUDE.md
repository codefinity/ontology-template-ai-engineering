# Working on this repository

This repository holds a reusable **template** (`template/`) and a filled-in **example** of it
(`example/hex-commerce/`). The example must always follow the template exactly.

## Keep template and example in sync

- `template/ontology/00-meta/conventions.md` is the specification. If you change the format (a front
  matter key, a file in the context folder, an ID scheme, a rule field), update in the same change:
  1. every template file affected;
  2. `template/ontology/tools/validate.mjs`, if the change is checkable;
  3. every affected file in `example/hex-commerce/ontology/`.
- These files must stay **identical** in the template and the example: `tools/validate.mjs`, `CLAUDE.md`,
  `00-meta/conventions.md`, `00-meta/maintaining.md`, `00-meta/extracting-from-code.md`, and
  `03-bounded-contexts/_context-template/**`. Check with:

  ```bash
  for f in tools/validate.mjs CLAUDE.md 00-meta/conventions.md 00-meta/maintaining.md 00-meta/extracting-from-code.md; do
    diff -q "template/ontology/$f" "example/hex-commerce/ontology/$f"; done
  diff -rq template/ontology/03-bounded-contexts/_context-template example/hex-commerce/ontology/03-bounded-contexts/_context-template
  ```

## Validate both before finishing

```bash
node template/ontology/tools/validate.mjs              # warnings for unfilled placeholders are expected
node example/hex-commerce/ontology/tools/validate.mjs  # must report 0 errors and 0 warnings
```

The example's code checks need the HexCommerce source checked out at `../hex-commerce-source-ui`
(relative to this repository).

## Editing the example

The example describes `hex-commerce-source-ui` **as built**. Every claim must be traceable to code you
have read. Do not invent rules or values. Copy example instances from the sample data rather than making
them up.
