---
name: ontology-language
description: Audit and curate the ubiquitous language - find synonyms, homonyms and terms used inconsistently across code, UI text and documents, and update the ubiquitous-language files and glossary. Use when asked about naming consistency, "what should we call X", terminology drift, or before renaming domain concepts in code.
---

# Curate the ubiquitous language

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Read the `ubiquitous-language.md` of the
  contexts in scope, and `01-domain/glossary.md`.

## Procedure

1. **Find avoided terms in use**: `node <ont>/tools/ontology.mjs language [--context <Name>]`. It
   searches code and UI text for every word in the *Avoid* columns, and flags words that are a
   preferred term in another context.
2. **Find unrecorded synonyms.** Collect the words used for the same thing in:
   - type and field names;
   - UI strings (labels, headings, messages);
   - API and route names;
   - documents.

   For each concept in scope, check the term and its plural with `ontology.mjs find <word>`.
3. **Classify each finding**:
   - **Drift.** The same meaning has two words in one context (for example, "cart" and "basket" in the
     UI). Pick the preferred one, with the domain expert's word first.
   - **Homonym.** The same word means different things in different contexts ("order" and "seller
     order"). This is legitimate. Make sure each context's language defines it, and that the glossary's
     *Terms that differ between contexts* table has a row.
   - **Code identifier differs from the business term** (`Category` for *department*). This is
     legitimate if recorded in the `Code` column. Renaming code is a separate decision.
   - **False positive.** A generic word in unrelated code.
4. **Propose changes** to the user as a table: term, contexts, finding, proposal. A choice between two
   terms is a business decision. **Ask; do not decide alone.** Record a disputed choice as an open
   question, and an agreed one as a decision (`ontology.mjs new-decision`).
5. **Apply the agreed changes**:
   - update the preferred term, its definition, `Code` and *Avoid* in `ubiquitous-language.md`;
   - add glossary rows;
   - for a renamed concept, run `ontology.mjs rename <Ctx.Old> <Ctx.New>`, check the dry run, then add
     `--write`;
   - set `last_reviewed`, add a changelog line, and run `validate.mjs`.
6. **Code and UI renames** are separate work. List them (file, current text, proposed text), and change
   code only if the user asks.

## Guardrails

- A context may legitimately use a word that another context avoids. Judge per context.
- Definitions must be ones a domain expert would sign off. Write them in business terms, never "the
  React state that…".
