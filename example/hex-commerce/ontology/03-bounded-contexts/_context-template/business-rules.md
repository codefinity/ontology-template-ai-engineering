---
id: <Context>.rules
type: business-rules
context: <Context>
status: draft
last_reviewed: YYYY-MM-DD
sources: []
---

# <Context> — business rules

<!--
Every business rule of this context, once. Format: 00-meta/conventions.md §6.
- Heading: "### <CTX>-BR-<NNN> <short title>". Number in order of creation; never reuse a number.
- Group with ## headings by topic (e.g. "## Pricing", "## Lifecycle").
- Status: implemented | partial | not-implemented | deprecated. Explain partial/not-implemented in Notes.
-->

## <Topic>

### <CTX>-BR-001 <Short title>
- **Statement:** <One or two testable sentences in business language.>
- **Kind:** invariant
- **Applies to:** `<Context>.<Aggregate>`
- **Status:** implemented
- **Code:** `<path>` (`<function>`)
- **Source:** <Requirement ID, document, interview>
- **Tests:** `<path/to/test-file>` (optional; tests that mention the rule ID are found anyway)
