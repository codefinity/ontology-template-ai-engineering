---
id: Reviews.rules
type: business-rules
context: Reviews
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 8.6 (reviews)
---

# Reviews — business rules

## Writing

### REV-BR-001 Star rating required
- **Statement:** A review needs a star rating from 1 to 5.
- **Kind:** validation
- **Applies to:** `Reviews.Review`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (review form `handleSubmit`)
- **Source:** BR-REV-001

### REV-BR-002 Headline length
- **Statement:** A review headline has 3 to 80 characters after trimming.
- **Kind:** validation
- **Applies to:** `Reviews.Review`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (review form; `maxLength={80}`)
- **Source:** BR-REV-002

### REV-BR-003 Review text length
- **Statement:** Review text has 10 to 2,000 characters after trimming.
- **Kind:** validation
- **Applies to:** `Reviews.Review`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (review form; `maxLength={2000}`)
- **Source:** BR-REV-003

### REV-BR-004 Verified purchase
- **Statement:** A review is marked as a verified purchase when its author had bought the product, in an
  order that is not cancelled, at the time of writing (`Ordering.PurchaseCheck`).
- **Kind:** derivation
- **Applies to:** `Reviews.Review`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (`verifiedPurchase`), `src/data/reviews.ts` (`createCustomerReview`)
- **Source:** BR-ORD-007
- **Notes:** The mark is fixed when the review is written. It does not change if the order is later
  cancelled.

### REV-BR-009 Shoppers manage their own reviews
- **Statement:** A shopper may write more than one review of a product, and may delete their own
  reviews. They cannot edit them.
- **Kind:** policy
- **Applies to:** `Reviews.Review`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (reducer cases `add`, `remove`)
- **Source:** hex-commerce-source-ui (see REV-Q-01)

### REV-BR-010 Only catalogue products are reviewed
- **Statement:** Reviews can be written about catalogue products only, not about seller listings.
- **Kind:** constraint
- **Applies to:** `Reviews.Review`
- **Status:** implemented
- **Code:** `src/app/product/[slug]/page.tsx`
- **Source:** BR-SLS-008

### REV-BR-011 Reviews are moderated
- **Statement:** Shoppers can report a review for a listed reason, at most once each, and support agents
  can remove reported reviews.
- **Kind:** policy
- **Applies to:** `Reviews.Review`
- **Status:** not-implemented
- **Code:** —
- **Source:** BR-REV-007 (process P31)

## Votes

### REV-BR-005 One helpful vote per shopper per review
- **Statement:** A shopper can mark a review helpful at most once, can withdraw the vote, and cannot vote
  on their own review.
- **Kind:** invariant
- **Applies to:** `Reviews.HelpfulVotes`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (`toggleHelpful`; own reviews show Delete instead)
- **Source:** BR-REV-005

## Summary

### REV-BR-006 Average rating includes the shopper's reviews
- **Statement:** A product's average rating is (baseline average × baseline count + the shopper's
  ratings) ÷ (baseline count + number of shopper reviews).
- **Kind:** derivation
- **Applies to:** `Reviews.RatingSummary`
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx` (`averageRating`, `ratingCount`)
- **Source:** BR-REV-004

### REV-BR-007 Rating distribution
- **Statement:** The rating distribution is the share of published ratings at each star level, calculated
  from the actual ratings.
- **Kind:** derivation
- **Applies to:** `Reviews.RatingSummary`
- **Status:** partial
- **Code:** `src/components/product/ReviewsSection.tsx` (`buildDistribution`)
- **Source:** BR-REV-006
- **Notes:** As-built, the distribution is synthesised from the average so that it looks plausible.

### REV-BR-008 Generic reviews fill gaps
- **Statement:** A catalogue product with no written reviews shows three generic reviews, always the same
  three for that product.
- **Kind:** constraint
- **Applies to:** `Reviews.ProductReviews`
- **Status:** implemented
- **Code:** `src/data/reviews.ts` (`getReviewsForProduct`, `GENERIC_REVIEWS`)
- **Source:** hex-commerce-source-ui (demonstration data only; not a business rule of the target system)
