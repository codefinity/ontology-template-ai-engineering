---
id: SellerOnboarding.events
type: domain-events
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
---

# SellerOnboarding — domain events and policies

No event objects exist. Each event is a reducer action in `SellerApplicationProvider`. SellerCentral and
the seller tools see the outcome through `SellerOnboarding.SellerAccountStatus` and
`SellerOnboarding.SellerProfile`, which they read on every render.

## Events

### ApplicationSubmitted

- **Meaning:** A shopper asked to sell on behalf of a business.
- **Emitted by:** `SellerOnboarding.SubmitApplication`
- **Payload:** application
- **Consumers:** the review queue
- **Scope:** internal
- **Realised as:** reducer action `submit`

### ApplicationApproved

- **Meaning:** An administrator admitted the business as a seller.
- **Emitted by:** `SellerOnboarding.ApproveApplication`
- **Payload:** application id, decision time
- **Consumers:** SellerCentral: the seller tools unlock and listings reach the storefront (REL-06)
- **Scope:** integration
- **Realised as:** reducer action `decide` (`Approved`)

### ApplicationRejected

- **Meaning:** An administrator refused the application.
- **Emitted by:** `SellerOnboarding.RejectApplication`
- **Payload:** application id, decision time, optional note
- **Consumers:** the applicant's status screen
- **Scope:** internal
- **Realised as:** reducer action `decide` (`Rejected`)

### ApplicationReopened

- **Meaning:** A decided application went back to `Pending`.
- **Emitted by:** `SellerOnboarding.ReconsiderApplication`
- **Payload:** application id
- **Consumers:** `SellerCentral.WithdrawStorefrontWhenNotApproved` when the application was approved
- **Scope:** integration
- **Realised as:** reducer action `reconsider`

### BusinessDetailsUpdated

- **Meaning:** An approved seller changed their business details.
- **Emitted by:** `SellerOnboarding.UpdateBusinessDetails`
- **Payload:** new details
- **Consumers:** SellerCentral: the seller name on storefront products follows the business name
- **Scope:** integration
- **Realised as:** reducer action `updateDetails`

## Policies

This context has no policies. It reacts to nothing outside itself.
