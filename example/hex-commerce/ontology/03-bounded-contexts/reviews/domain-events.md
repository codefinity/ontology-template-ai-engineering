---
id: Reviews.events
type: domain-events
context: Reviews
status: implemented
last_reviewed: 2026-10-27
---

# Reviews — domain events and policies

All events are internal and are realised as state changes in `ReviewsSection`. The product's rating
summary is recomputed from them on the next render.

## Events

### ReviewWritten

- **Meaning:** A shopper published a review.
- **Emitted by:** `Reviews.WriteReview`
- **Payload:** review
- **Consumers:** `Reviews.RatingSummary`
- **Scope:** internal
- **Realised as:** reducer action `add`

### ReviewDeleted

- **Meaning:** A shopper removed their review.
- **Emitted by:** `Reviews.DeleteReview`
- **Payload:** review id
- **Consumers:** `Reviews.RatingSummary`
- **Scope:** internal
- **Realised as:** reducer action `remove`

### ReviewMarkedHelpful

- **Meaning:** A shopper endorsed a review.
- **Emitted by:** `Reviews.MarkReviewHelpful`
- **Payload:** review id
- **Consumers:** the review's helpful count shown to this shopper
- **Scope:** internal
- **Realised as:** `toggleHelpful` adding the id

### HelpfulVoteWithdrawn

- **Meaning:** A shopper took back an endorsement.
- **Emitted by:** `Reviews.WithdrawHelpfulVote`
- **Payload:** review id
- **Consumers:** the review's helpful count shown to this shopper
- **Scope:** internal
- **Realised as:** `toggleHelpful` removing the id

## Policies

This context has no policies.
