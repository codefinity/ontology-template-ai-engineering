---
id: Reviews.read-models
type: read-models
context: Reviews
status: implemented
last_reviewed: 2026-10-27
---

# Reviews — read models and queries

### ProductReviews

- **Answers:** What have people said about this product?
- **Shape:** the shopper's own reviews first, then sample or generic reviews; for each, whether the
  shopper voted it helpful
- **Derived from:** `Reviews.Review`, `Reviews.HelpfulVotes`
- **Rules:** REV-BR-008
- **Consumers:** ACT-SHOPPER (product page)
- **Published:** no
- **Code:** `src/data/reviews.ts` (`getReviewsForProduct`), `src/components/product/ReviewsSection.tsx`

### RatingSummary

- **Answers:** How well rated is this product overall?
- **Shape:** average rating, rating count, share of ratings at each star level
- **Derived from:** `Catalog.Product` (baseline), `Reviews.Review`
- **Rules:** REV-BR-006, REV-BR-007
- **Consumers:** ACT-SHOPPER (product page)
- **Published:** no
- **Code:** `src/components/product/ReviewsSection.tsx` (`averageRating`, `ratingCount`, `buildDistribution`)
