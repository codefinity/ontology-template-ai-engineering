---
id: Reviews.HelpfulVotes
type: aggregate
context: Reviews
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/data/reviews.ts#loadHelpfulVotes
  - src/data/reviews.ts#saveHelpfulVotes
---

# HelpfulVotes (aggregate)

## Definition

The set of reviews the shopper has found helpful. It is a separate aggregate from `Reviews.Review`
because a vote changes the voter's own record, not the review's. That is how "at most one vote per
shopper per review" holds without locking the review.

## Structure

### HelpfulVotes

Root entity. One per shopper.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| reviewIds | set of `Reviews.Review` ids | yes (may be empty) | Reviews voted helpful | `helpfulIds` |

## Invariants

- REV-BR-005 — One helpful vote per shopper per review

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| `Reviews.MarkReviewHelpful` | `Reviews.ReviewMarkedHelpful` |
| `Reviews.WithdrawHelpfulVote` | `Reviews.HelpfulVoteWithdrawn` |

## Example

```json
["r-001", "p-2004-generic-1"]
```

## Implementation

- **State changes:** `src/components/product/ReviewsSection.tsx` (`toggleHelpful`)
- **Persistence:** `src/data/reviews.ts` (`loadHelpfulVotes`, `saveHelpfulVotes`), `localStorage` key
  `hexcommerce.reviewVotes.v1`
