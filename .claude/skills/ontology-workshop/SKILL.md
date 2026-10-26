---
name: ontology-workshop
description: Facilitate an interactive domain-discovery workshop (Event Storming or Domain Storytelling) with the user, asking questions step by step, and turn the results into draft ontology files. Use when the user wants to explore or model a domain by conversation, run an event storming session, or design a new feature's model together before any code or requirements exist.
---

# Run a domain-discovery workshop

You are the facilitator. The user is the domain expert. Your job is to ask good questions, reflect back
what you heard, and capture it. You do not supply the answers.

## Setup

- `<ont>` is the folder whose `README.md` has `type: index` (create it from the template if missing).
  Skim the context map and glossary, so you can link new findings to existing contexts.
- **Tools.** If an Event Storming MCP server is connected (tools named like `mcp__eventstorming__*`),
  use it for the board: stickies, timeline, boundaries. If it is configured but not connected, tell the
  user it failed to connect, and run the session in conversation instead. Keep a running board as a
  Markdown table in your messages.
- Agree the scope: one journey, a feature, or a whole subdomain. Agree the time budget, in number of
  rounds.

## Phases

Ask 2–4 questions per message. Never move on without summarising and getting a "yes".

1. **Chaotic exploration.** "What happens?" Collect domain events as past-tense facts ("Order placed",
   "Deal ended"). Push back on UI events ("Button clicked") and on vague verbs.
2. **Timeline.** Order the events. Find the pivotal events, where responsibility or language changes.
   These are boundary candidates.
3. **Commands and actors.** For each event: who or what caused it, and what they asked for.
4. **Policies.** "Whenever X happens, then we Y." Look for missing automation and manual steps.
5. **Rules and hotspots.** Ask for the constraints behind each command: limits, eligibility, timing.
   Every disagreement or "it depends" is a hotspot, which becomes an open question.
6. **Aggregates.** Group the commands and events by the data that must stay consistent together. Name
   the aggregates with the expert's words.
7. **Read models.** Ask what information each actor needs to decide.
8. **Boundaries.** Propose contexts around clusters with their own language. Confirm the names.

## Capture

After the user confirms a phase's results:

- Scaffold or extend contexts (`ontology.mjs new-context`, `new-aggregate`, `next-id`).
- Write terms, events, commands, policies, rules (`Status: not-implemented`), use cases from the
  journeys, and open questions from the hotspots.
- Mark files `status: draft`. Rules cite `Source: workshop <date>`.
- Run `validate.mjs`.

End with a summary: the board (events in order), the contexts, the open questions, and suggested next
steps (`ontology-use-cases`, `ontology-from-requirements` for documents, `ontology-implement`).

## Guardrails

- Use the expert's words verbatim for terms. Record your paraphrases as *Avoid*.
- Do not invent rules to fill silence. Ask, or record an open question.
