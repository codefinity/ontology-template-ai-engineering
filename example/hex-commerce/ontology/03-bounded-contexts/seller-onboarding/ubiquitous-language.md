---
id: SellerOnboarding.language
type: ubiquitous-language
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
---

# SellerOnboarding — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Applicant | The shopper who submitted an application, acting for a business. | `myApplication` owner | | `SellerOnboarding.SellerApplication` |
| Application | A business's request to sell on the marketplace. | `SellerApplication` | registration, sign-up | `SellerOnboarding.SellerApplication` |
| Business details | The editable details of an approved seller's business. | `SellerDetailsDraft` | settings | `SellerOnboarding.UpdateBusinessDetails` |
| Business type | Legal structure: Sole trader, Partnership, Limited company, Non-profit. | `SellerBusinessType` | company type | `SellerOnboarding.BusinessType` |
| Decision note | The administrator's explanation, shown to the applicant (usually a rejection reason). | `note` | comment | `SellerOnboarding.SellerApplication` |
| My application | The signed-in shopper's own most recent application. | `myApplication`, `myApplicationId` | | `SellerOnboarding.SellerAccountStatus` |
| Payout account | The masked bank account the seller is paid into. | `SellerProfile.payoutAccount` | bank details | `SellerOnboarding.SellerProfile` |
| Registered address | The business's legal address. | `line1`…`country` | business address | `SellerOnboarding.RegisteredAddress` |
| Review queue | All applications, for administrators to decide. | `applications` | inbox | `SellerOnboarding.ReviewQueue` |
| Seller account | The shopper's approved application, which unlocks the seller tools. | `sellerStatus === 'Approved'` | seller login | `SellerOnboarding.SellerAccountStatus` |
| Seller profile | The business record shoppers buy from, derived from the approved application. | `SellerProfile` | | `SellerOnboarding.SellerProfile` |
| Seller since | The date the seller account was opened (the approval date). | `registeredSince` | joined | `SellerOnboarding.SellerProfile` |
| Years trading | How long the business has traded, in whole years. Fixed after approval. | `yearsTrading` | age | `SellerOnboarding.SellerApplication` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Apply / reapply | Submit a new application; reapplying starts from the rejected one. | `submitApplication` | register | `SellerOnboarding.SubmitApplication` |
| Approve | Admit the business as a seller. | `decideApplication(id, 'Approved')` | accept, verify | `SellerOnboarding.ApproveApplication` |
| Reconsider | Return a decided application to Pending. | `reconsiderApplication` | reopen, undo | `SellerOnboarding.ReconsiderApplication` |
| Reject | Refuse the application, optionally with a reason. | `decideApplication(id, 'Rejected', note)` | decline, deny | `SellerOnboarding.RejectApplication` |

## States and statuses

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| None | The shopper has never applied. | `'None'` | | `SellerOnboarding.SellerAccountStatus` |
| Pending | Waiting for an administrator's decision. | `'Pending'` | in review | `SellerOnboarding.SellerApplication` |
| Approved | Admitted; the application is the seller account. | `'Approved'` | active | `SellerOnboarding.SellerApplication` |
| Rejected | Refused; the shopper may reapply. | `'Rejected'` | declined | `SellerOnboarding.SellerApplication` |
| Verified | How an approved seller is described to others. | `SellerProfile.status` | | `SellerOnboarding.SellerProfile` |
