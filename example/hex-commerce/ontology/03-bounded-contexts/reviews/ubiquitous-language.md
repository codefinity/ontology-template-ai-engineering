---
id: Reviews.language
type: ubiquitous-language
context: Reviews
status: implemented
last_reviewed: 2026-10-27
---

# Reviews — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Average rating | The mean star rating over all ratings, including the shopper's own. | `averageRating` | score | `Reviews.RatingSummary` |
| Headline | The short title of a review. | `title` | subject | `Reviews.Review` |
| Helpful vote | A shopper's mark that a review helped them. | `helpfulIds`, `helpfulCount` | like, upvote | `Reviews.HelpfulVotes` |
| Rating count | How many ratings the average is based on. | `ratingCount`, `reviewCount` | | `Reviews.RatingSummary` |
| Rating distribution | The share of ratings at each star level. | `buildDistribution` | histogram (UI) | `Reviews.RatingSummary` |
| Review | A shopper's star rating, headline and text about a product. | `Review` | comment, feedback, testimonial | `Reviews.Review` |
| Review text | The body of a review. | `body` | content | `Reviews.Review` |
| Star rating | 1 to 5 stars. | `rating` | score, grade | `Reviews.StarRating` |
| Verified purchase | A review whose author had bought the product when they wrote it. | `verified` | confirmed buyer | `Reviews.Review` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Delete a review | Remove one's own review. | `dispatch({ type: 'remove' })` | | `Reviews.DeleteReview` |
| Mark helpful | Vote that a review helped. | `toggleHelpful` | like | `Reviews.MarkReviewHelpful` |
| Withdraw a vote | Take a helpful vote back. | `toggleHelpful` | unlike | `Reviews.WithdrawHelpfulVote` |
| Write a review | Publish a rating, headline and text. | `handleSubmit`, `createCustomerReview` | post | `Reviews.WriteReview` |
