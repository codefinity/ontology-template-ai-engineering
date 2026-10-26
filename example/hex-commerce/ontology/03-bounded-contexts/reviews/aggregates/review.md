---
id: Reviews.Review
type: aggregate
context: Reviews
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/lib/types.ts#Review
  - src/data/reviews.ts#createCustomerReview
---

# Review (aggregate)

## Definition

One shopper's opinion of one catalogue product: a star rating, a headline and some text. It is marked
as a verified purchase if the author had bought the product when they wrote it. It is published at once.

## Structure

### Review

Root entity. Identity: `id` (`rc-…` for shopper reviews).

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| id | text | yes | Identifier | `id` |
| productId | `Catalog.Product` id | yes | Product reviewed | `productId` |
| author | text | yes | Author's display name | `author` |
| rating | `Reviews.StarRating` | yes | 1–5 stars | `rating` |
| headline | text, 3–80 | yes | Review title | `title` |
| text | text, 10–2,000 | yes | Review body | `body` |
| date | date | yes | When written | `date` |
| verified | boolean | yes | Verified purchase | `verified` |
| helpfulCount | integer ≥ 0 | yes | Helpful votes from others | `helpfulCount` |

## Invariants

- REV-BR-001 — Star rating required
- REV-BR-002 — Headline length
- REV-BR-003 — Review text length
- REV-BR-004 — Verified purchase

## Lifecycle

A review is published when written and removed when its author deletes it. It has no other states
as-built. The BRD adds `removed` by moderation (P31).

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| `Reviews.WriteReview` | `Reviews.ReviewWritten` |
| `Reviews.DeleteReview` | `Reviews.ReviewDeleted` |

## References to other aggregates

| Reference | Points to | Cardinality | Notes |
| --- | --- | --- | --- |
| productId | `Catalog.Product` | many to 1 | Catalogue products only |

## Example

A review as `createCustomerReview` builds it (the id, text and date vary):

```json
{
  "id": "rc-m8k2x1-4fz9q",
  "productId": "p-1008",
  "author": "Alex Morgan",
  "rating": 5,
  "title": "Survived a week of camping",
  "body": "Loud, clear and it really does float.",
  "date": "2026-10-27",
  "verified": true,
  "helpfulCount": 0
}
```

`verified` is true because sample order `204-8871934-5520117` contains `p-1008` and is not cancelled.

## Implementation

- **Type:** `src/lib/types.ts` (`Review`)
- **Factory:** `src/data/reviews.ts` (`createCustomerReview`)
- **State changes:** `src/components/product/ReviewsSection.tsx` (reducer cases `add`, `remove`)
- **Persistence:** `localStorage` key `hexcommerce.reviews.v1`, grouped by product id
