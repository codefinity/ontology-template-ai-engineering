---
name: ontology-template-evolve
description: Change the ontology template's format in this repository (a new front-matter key, file, field, id kind, validation or CLI command) and propagate it consistently to the spec, the context template, the tools, the skills, the docs and the HexCommerce example. Use for any change to template/ in the ontology-template-ai-engineering repository.
---

# Evolve the template

This repository ships a template (`template/`) and an example built with it
(`example/hex-commerce/`). A format change is complete only when every layer agrees.

## Procedure

1. **Spec first.** Change `template/ontology/00-meta/conventions.md`: the type table (§3), identifiers
   (§4), definitions (§5), rule and use-case fields (§6, §6a), and tools (§10). If the change affects
   how people work, update `maintaining.md` and `extracting-from-code.md`.
2. **Templates.** Update the affected files in `template/ontology/03-bounded-contexts/_context-template/`,
   `00-meta/decisions/_decision-template.md`, the domain and map templates, and the index `README.md`.
3. **Tools.**
   - `template/ontology/tools/lib.mjs`: types, `CONTEXT_FILES`, `ID` patterns and loading.
   - `validate.mjs`: the new check.
   - `ontology.mjs`: commands that should understand the change (`export`, `gaps`, `next-id`, `show`).
   Keep them dependency-free.
4. **Guidance.** Update `template/ontology/CLAUDE.md`, `template/CLAUDE.snippet.md`, the affected skills in
   `template/.claude/skills/ontology-*/SKILL.md`, and `template/README.md`.
5. **Mirror.** Copy the shared files to the example and the repo-level skills:

   ```bash
   cp template/ontology/tools/*.mjs example/hex-commerce/ontology/tools/
   for f in CLAUDE.md 00-meta/conventions.md 00-meta/maintaining.md 00-meta/extracting-from-code.md 00-meta/decisions/_decision-template.md; do
     cp "template/ontology/$f" "example/hex-commerce/ontology/$f"; done
   rm -rf example/hex-commerce/ontology/03-bounded-contexts/_context-template
   cp -r template/ontology/03-bounded-contexts/_context-template example/hex-commerce/ontology/03-bounded-contexts/
   for d in template/.claude/skills/ontology-*; do rm -rf ".claude/skills/$(basename "$d")"; cp -r "$d" .claude/skills/; done
   ```

6. **Example content.** Apply the change to every affected file in `example/hex-commerce/ontology/`, with
   real content taken from `../hex-commerce-source-ui`. Never use placeholders or invented values.
7. **Verify.**

   ```bash
   node template/ontology/tools/validate.mjs              # 0 errors; placeholder warnings expected
   node example/hex-commerce/ontology/tools/validate.mjs  # 0 errors, 0 warnings
   node example/hex-commerce/ontology/tools/ontology.mjs gaps
   node example/hex-commerce/ontology/tools/ontology.mjs boundaries
   ```

   Then run the sync check from the repository `CLAUDE.md`. For a new validation, also break a copy of
   the example in the scratchpad on purpose and confirm the validator reports it.
8. **Changelog.** Add a line to `example/hex-commerce/ontology/00-meta/changelog.md` describing the format
   change.
