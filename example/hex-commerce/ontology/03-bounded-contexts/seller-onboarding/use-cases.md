---
id: SellerOnboarding.use-cases
type: use-cases
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P08 (apply and decide), P13 (business details), P14 (return to Pending)
---

# SellerOnboarding — use cases

### SON-UC-01 Apply to sell
- **Actor:** ACT-PROSPECTIVE-SELLER
- **Goal:** Be allowed to sell the business's products on HexCommerce.
- **Trigger:** The shopper chooses to sell.
- **Preconditions:** The shopper has no application, or their latest one is `Rejected` (SON-BR-005).
- **Main flow:**
  1. The shopper opens the application, with their name and email filled in.
  2. The shopper gives the business details, registered address and tax number.
  3. The system checks them (SON-BR-001, SON-BR-002).
  4. The system records the application as `Pending` with a reference (SON-BR-006), as the shopper's own
     (SON-BR-010), and shows its status.
- **Alternative flows:**
  - `1a.` The shopper's application is `Pending` or `Approved`: the system shows its status instead of a
    form. The use case ends.
  - `1b.` The latest application was `Rejected`: the system shows the reason (or the standard text) and
    offers to reapply, starting from the old details (SON-BR-007).
  - `3a.` A check fails: the shopper is told what to correct.
- **Postconditions:** A pending application awaits an administrator.
- **Commands:** `SellerOnboarding.SubmitApplication`
- **Rules:** SON-BR-001, SON-BR-002, SON-BR-005, SON-BR-006, SON-BR-007, SON-BR-010
- **Flows:** FLOW-03
- **Status:** implemented
- **Code:** `src/app/sell/apply/page.tsx`, `src/components/seller/SellerApplicationForm.tsx`
- **Source:** P08

### SON-UC-02 Decide a seller application
- **Actor:** ACT-ADMIN
- **Goal:** Admit only legitimate businesses as sellers.
- **Trigger:** An application is pending.
- **Preconditions:** The administrator can see the review queue (SON-BR-011).
- **Main flow:**
  1. The administrator opens the queue of pending applications.
  2. The administrator reviews an application and approves it.
  3. The system records the decision and its time. The applicant becomes a seller at once
     (SON-BR-003, SON-BR-004).
- **Alternative flows:**
  - `2a.` The administrator rejects it, optionally with a reason. The applicant sees the reason or the
    standard text (SON-BR-007).
- **Postconditions:** The application is `Approved` or `Rejected`.
- **Commands:** `SellerOnboarding.ApproveApplication`, `SellerOnboarding.RejectApplication`
- **Rules:** SON-BR-003, SON-BR-004, SON-BR-007, SON-BR-011
- **Flows:** FLOW-03
- **Status:** partial
- **Code:** `src/app/admin/sellers/page.tsx`, `src/components/admin/SellerApplicationsAdminView.tsx`
- **Source:** P08

### SON-UC-03 Reconsider a decision
- **Actor:** ACT-ADMIN
- **Goal:** Correct a decision, or re-review a seller.
- **Trigger:** The administrator reopens a decided application.
- **Preconditions:** The application is `Approved` or `Rejected`.
- **Main flow:**
  1. The administrator returns the application to `Pending`.
  2. The system clears the decision and its note (SON-BR-003). If the applicant was a seller, the
     seller tools lock and their listings leave the storefront at once (SON-BR-004, SEL-BR-027).
- **Alternative flows:** none
- **Postconditions:** The application is `Pending` again.
- **Commands:** `SellerOnboarding.ReconsiderApplication`
- **Rules:** SON-BR-003, SON-BR-004, SEL-BR-027
- **Flows:** FLOW-03
- **Status:** implemented
- **Code:** `src/components/admin/SellerApplicationsAdminView.tsx`
- **Source:** P14

### SON-UC-04 Keep business details current
- **Actor:** ACT-SELLER
- **Goal:** Keep the details shoppers and the marketplace hold about the business correct.
- **Trigger:** The seller opens their business details.
- **Preconditions:** The seller's application is `Approved`.
- **Main flow:**
  1. The seller edits the business details.
  2. The system checks them as for an application, but years trading cannot change (SON-BR-009).
  3. The system saves them. The seller profile, and the seller name on the storefront, follow
     (SON-BR-008).
- **Alternative flows:**
  - `2a.` A check fails: the seller is told what to correct.
- **Postconditions:** The seller profile shows the new details.
- **Commands:** `SellerOnboarding.UpdateBusinessDetails`
- **Rules:** SON-BR-008, SON-BR-009
- **Status:** implemented
- **Code:** `src/app/sell/(seller)/register/page.tsx`, `src/components/seller/BusinessDetailsView.tsx`
- **Source:** P13
