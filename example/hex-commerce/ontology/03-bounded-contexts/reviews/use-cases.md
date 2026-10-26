---
id: Reviews.use-cases
type: use-cases
context: Reviews
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P06 (write and vote), P18 (edit or delete), P31 (report and moderate)
---

# Reviews — use cases

### REV-UC-01 Review a product
- **Actor:** ACT-SHOPPER
- **Goal:** Tell other shoppers what a product is like.
- **Trigger:** The shopper chooses to write a review on a catalogue product.
- **Preconditions:** The product is a catalogue product (REV-BR-010).
- **Main flow:**
  1. The shopper gives a star rating, a headline and some text.
  2. The system checks them (REV-BR-001 to REV-BR-003).
  3. The system publishes the review under the shopper's name. It marks the review as a verified
     purchase if the shopper bought the product in an order that is not cancelled (REV-BR-004).
  4. The system recalculates the product's average rating, including the new review (REV-BR-006).
- **Alternative flows:**
  - `2a.` A check fails: the shopper is told what to correct, and nothing is published.
- **Postconditions:** The review is published, and the rating summary includes it.
- **Commands:** `Reviews.WriteReview`
- **Rules:** REV-BR-001, REV-BR-002, REV-BR-003, REV-BR-004, REV-BR-006, REV-BR-010
- **Flows:** FLOW-06
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx`
- **Source:** P06

### REV-UC-02 Mark reviews that helped
- **Actor:** ACT-SHOPPER
- **Goal:** Point other shoppers to the most useful reviews.
- **Trigger:** The shopper finds a review helpful.
- **Preconditions:** The review is not the shopper's own.
- **Main flow:**
  1. The shopper marks the review as helpful.
  2. The system records one vote from this shopper, and shows it in the count (REV-BR-005).
- **Alternative flows:**
  - `1a.` The shopper has already voted: marking it again withdraws the vote.
- **Postconditions:** At most one vote per shopper per review.
- **Commands:** `Reviews.MarkReviewHelpful`, `Reviews.WithdrawHelpfulVote`
- **Rules:** REV-BR-005
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx`
- **Source:** P06

### REV-UC-03 Remove my review
- **Actor:** ACT-SHOPPER
- **Goal:** Take back a review the shopper wrote.
- **Trigger:** The shopper deletes one of their reviews.
- **Preconditions:** The review is the shopper's own.
- **Main flow:**
  1. The shopper deletes the review.
  2. The system removes it and recalculates the rating summary (REV-BR-009, REV-BR-006).
- **Alternative flows:**
  - `1a.` (not built) The shopper edits the review instead: the BRD allows editing; as-built, only
    deleting is possible (REV-Q-01).
- **Postconditions:** The review is gone.
- **Commands:** `Reviews.DeleteReview`
- **Rules:** REV-BR-009, REV-BR-006
- **Status:** implemented
- **Code:** `src/components/product/ReviewsSection.tsx`
- **Source:** P18

### REV-UC-04 Report an inappropriate review
- **Actor:** ACT-SHOPPER
- **Goal:** Have an abusive or irrelevant review removed.
- **Trigger:** The shopper reports a review.
- **Preconditions:** none
- **Main flow:**
  1. The shopper reports the review with a reason.
  2. The system queues it for moderation; a support agent keeps or removes it.
- **Alternative flows:**
  - `1a.` The shopper has already reported this review: the report is not repeated.
- **Postconditions:** The report is recorded and decided.
- **Commands:** none modelled yet; changes `Reviews.Review`
- **Rules:** REV-BR-011
- **Status:** not-implemented
- **Code:** —
- **Source:** P31
