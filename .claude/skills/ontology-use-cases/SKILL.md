---
name: ontology-use-cases
description: Identify and document use cases (actor goals with main and alternative flows) for a bounded context, from code entry points and/or requirements, and link them to commands, rules and flows in the ontology. Use when asked to find, list, write, complete or check use cases, user journeys or "what users can do", or when `ontology.mjs gaps` reports commands that no use case reaches.
---

# Identify and write use cases

## Setup

- `<ont>` is the folder whose `README.md` has `type: index`. Read `<ont>/00-meta/conventions.md` §6a
  (use-case format) and the target context's `README.md`, `ubiquitous-language.md` and `commands.md`.
- Scope: one context, or all of them one at a time. Ask if unclear.

## Procedure

1. **Find entry points** in the code. Search by framework:
   - Next.js: `app/**/page.tsx`, `app/**/route.ts`, `pages/**`
   - Express/Fastify/Nest: `router.get|post`, `app.get|post`, `@Get(`, `@Post(`
   - Django: `urls.py`; Rails: `config/routes.rb`; Spring: `@RequestMapping`, `@GetMapping`
   - CLIs, queue consumers, scheduled jobs: `command(`, `consume(`, `cron`

   Also take processes from the requirement docs, if any. List each entry point with the commands it
   triggers. Use `ontology.mjs affected <file>` to see which concepts an entry point already maps to.
2. **Group by actor goal.** A goal is what the actor wants ("buy what is in my basket"). It is not a
   screen ("checkout page") and not a function ("setQuantity"). Several screens can serve one goal;
   one screen can serve several goals.
3. **Check the inventory**:
   - `node <ont>/tools/ontology.mjs gaps`. Every command should be reached by some use case.
   - Every actor in `01-domain/actors.md` that interacts with this context should have at least one
     use case, or be explained.
4. **Write each use case** (`next-id use-case <Context>` for the id), following §6a:
   - **Main flow:** 3–9 numbered steps, alternating actor and system, in business words.
   - **Alternative flows:** take them from the code. Every validation message, guard and
     `if`-rejection on the path is an alternative or failure flow, numbered from the step it branches
     (`3a.`). Say how each one ends.
   - **Commands**, **Rules** (every rule that can change the outcome) and **Flows** (if it crosses
     contexts).
   - **Status:** `implemented` if the code supports the whole main flow; `partial` if some alternative
     the requirements expect is missing (say which in an alternative flow, marked "(not built)");
     `not-implemented` for intended use cases.
   - **Code:** the entry points. **Source:** the requirement or process ID.
5. **Back-link.** Add the use-case id to the related flow's step table, if useful. Do not duplicate the
   flow's steps in the use case.
6. **Check.** `validate.mjs` must report 0 errors. `ontology.mjs gaps` should show no "command not used
   by any use case" for this context, and no "use case cites no rule" unless that is genuinely true.
7. **Report** the use cases added (id and title), the commands still unreached, and the actors without
   use cases.

## Quality bar

- An actor would recognise the title as their own goal.
- No UI words ("click", "modal", "page") in steps. The system's responses are business facts.
- Each alternative flow is reachable in the code (as-built) or required by a cited source (intended).
