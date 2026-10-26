---
id: Reviews.value-objects
type: value-objects
context: Reviews
status: implemented
last_reviewed: 2026-10-27
---

# Reviews — value objects

### StarRating

- **Meaning:** How much the reviewer liked the product.
- **Attributes:** whole number of stars
- **Constraints:** 1 to 5 (REV-BR-001)
- **Equality:** by value
- **Used by:** `Reviews.Review`, `Reviews.RatingSummary`
- **Code:** `src/lib/types.ts` (`Review.rating`), `src/components/ui/StarRatingInput.tsx`
