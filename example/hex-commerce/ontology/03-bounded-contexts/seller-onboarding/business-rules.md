---
id: SellerOnboarding.rules
type: business-rules
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 8.8 (seller onboarding)
---

# SellerOnboarding — business rules

## Applying

### SON-BR-001 Required application details
- **Statement:** An application needs the legal business name, a primary contact, a business email in the
  form text@text.text, a business phone, years trading (a whole number, 0 or more), a description of
  what will be sold, a registered address (line 1, city, state or county, postcode, country) and a tax
  registration number. Website and address line 2 are optional.
- **Kind:** validation
- **Applies to:** `SellerOnboarding.SellerApplication`
- **Status:** implemented
- **Code:** `src/components/seller/SellerApplicationForm.tsx` (submit validation)
- **Source:** BR-SAP-001, BR-SAP-010, BR-SAP-011, BR-ACC-009
- **Notes:** Fractional years trading are rounded down rather than refused.

### SON-BR-002 Business types
- **Statement:** The business type is one of Sole trader, Partnership, Limited company or Non-profit.
- **Kind:** validation
- **Applies to:** `SellerOnboarding.BusinessType`
- **Status:** implemented
- **Code:** `src/data/sellerApplications.ts` (`SELLER_BUSINESS_TYPES`)
- **Source:** BR-SAP-002

### SON-BR-005 One live application per shopper
- **Statement:** A shopper can submit an application only when they have none, or when their latest is
  `Rejected`. A reapplication starts from the details of the rejected one.
- **Kind:** invariant
- **Applies to:** `SellerOnboarding.SellerApplication`
- **Status:** implemented
- **Code:** `src/components/seller/SellerApplicationForm.tsx` (status screens, `formFromApplication`)
- **Source:** BR-SAP-007
- **Notes:** Enforced by the form, not by the store.

### SON-BR-006 Application reference
- **Statement:** An application is referenced `SA-NNNNN`.
- **Kind:** constraint
- **Applies to:** `SellerOnboarding.ApplicationReference`
- **Status:** implemented
- **Code:** `src/context/SellerApplicationProvider.tsx` (`makeId`)
- **Source:** BR-SAP-009

### SON-BR-010 A new application becomes the shopper's own
- **Statement:** Submitting an application makes it the shopper's own application, replacing any earlier
  one as their seller-account record.
- **Kind:** policy
- **Applies to:** `SellerOnboarding.SellerApplication`
- **Status:** implemented
- **Code:** `src/context/SellerApplicationProvider.tsx` (reducer case `submit`)
- **Source:** hex-commerce-source-ui

## Deciding

### SON-BR-003 Application statuses and transitions
- **Statement:** An application is `Pending`, `Approved` or `Rejected`. A `Pending` application can be
  approved or rejected. A decided application can be returned to `Pending`, which clears its note and
  decision date.
- **Kind:** invariant
- **Applies to:** `SellerOnboarding.SellerApplication`
- **Status:** implemented
- **Code:** `src/context/SellerApplicationProvider.tsx` (reducer cases `decide`, `reconsider`),
  `src/components/admin/SellerApplicationsAdminView.tsx`
- **Source:** BR-SAP-003

### SON-BR-007 Rejection reason is optional
- **Statement:** An administrator may give a reason when rejecting. Without one, the applicant is told
  that no reason was given and that they are welcome to apply again.
- **Kind:** policy
- **Applies to:** `SellerOnboarding.SellerApplication`
- **Status:** implemented
- **Code:** `src/components/seller/SellerApplicationForm.tsx`, `src/components/admin/SellerApplicationsAdminView.tsx`
- **Source:** BR-ADM-001

### SON-BR-011 Only administrators decide
- **Statement:** Only staff users with the marketplace-administrator role can see the review queue and
  decide applications.
- **Kind:** constraint
- **Applies to:** `SellerOnboarding.ReviewQueue`
- **Status:** not-implemented
- **Code:** `src/app/admin/sellers/page.tsx`
- **Source:** NFR-SEC-006
- **Notes:** The queue is a demonstration page open to anyone.

## Being a seller

### SON-BR-004 Only an approved applicant can sell
- **Statement:** Only a shopper whose own application is `Approved` can use the seller tools or have
  listings sold. Access follows the status the moment it changes.
- **Kind:** invariant
- **Applies to:** `SellerOnboarding.SellerAccountStatus`
- **Status:** implemented
- **Code:** `src/components/seller/SellerGate.tsx`, `src/context/SellerApplicationProvider.tsx` (`sellerStatus`, `sellerProfile`)
- **Source:** BR-SAP-004

### SON-BR-008 Seller profile comes from the approved application
- **Statement:** An approved seller's profile carries the application's business details. "Seller since"
  is the approval date, or the submission date if none is recorded. The seller is described as
  Verified. The payout account is shown masked, or as "Not set up yet".
- **Kind:** derivation
- **Applies to:** `SellerOnboarding.SellerProfile`
- **Status:** partial
- **Code:** `src/data/seller.ts` (`toSellerProfile`)
- **Source:** BR-SAP-005, BR-SAP-006
- **Notes:** Payout accounts are a fixed lookup by application id. The BRD requires the seller to supply
  one, and finance to verify it (P27), before payouts.

### SON-BR-009 Business details after approval
- **Statement:** An approved seller can edit their business details under the same rules as the
  application (SON-BR-001), except years trading, which cannot be changed.
- **Kind:** validation
- **Applies to:** `SellerOnboarding.SellerApplication`
- **Status:** implemented
- **Code:** `src/components/seller/BusinessDetailsView.tsx`, `src/context/SellerApplicationProvider.tsx` (`updateMyDetails`)
- **Source:** BR-SAP-008
