---
id: Reviews.commands
type: commands
context: Reviews
status: implemented
last_reviewed: 2026-10-27
---

# Reviews — commands

### WriteReview

- **Intent:** Tell other shoppers what a product is like.
- **Actor:** ACT-SHOPPER
- **Target:** `Reviews.Review` (creates)
- **Input:** product, star rating, headline, text
- **Rejected when:** REV-BR-001, REV-BR-002, REV-BR-003
- **On success:** a published review by the shopper (`Account.CurrentShopper`), dated today, with the
  verified mark per REV-BR-004; emits `Reviews.ReviewWritten`
- **Code:** `src/components/product/ReviewsSection.tsx` (`handleSubmit`), `src/data/reviews.ts` (`createCustomerReview`)

### DeleteReview

- **Intent:** Remove one's own review.
- **Actor:** ACT-SHOPPER
- **Target:** `Reviews.Review` (deletes)
- **Input:** review id
- **Rejected when:** the review is not the shopper's own
- **On success:** emits `Reviews.ReviewDeleted`
- **Code:** `src/components/product/ReviewsSection.tsx` (reducer case `remove`)

### MarkReviewHelpful

- **Intent:** Endorse a review.
- **Actor:** ACT-SHOPPER
- **Target:** `Reviews.HelpfulVotes` (changes)
- **Input:** review id
- **Rejected when:** REV-BR-005 (own review, or already voted)
- **On success:** emits `Reviews.ReviewMarkedHelpful`
- **Code:** `src/components/product/ReviewsSection.tsx` (`toggleHelpful`)

### WithdrawHelpfulVote

- **Intent:** Take an endorsement back.
- **Actor:** ACT-SHOPPER
- **Target:** `Reviews.HelpfulVotes` (changes)
- **Input:** review id
- **Rejected when:** never
- **On success:** emits `Reviews.HelpfulVoteWithdrawn`
- **Code:** `src/components/product/ReviewsSection.tsx` (`toggleHelpful`)
