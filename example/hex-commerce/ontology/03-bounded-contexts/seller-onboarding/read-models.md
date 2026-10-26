---
id: SellerOnboarding.read-models
type: read-models
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
---

# SellerOnboarding — read models and queries

### SellerAccountStatus

- **Answers:** Is the signed-in shopper a seller, an applicant, or neither?
- **Shape:** `None`, `Pending`, `Approved` or `Rejected`, plus the shopper's own application
- **Derived from:** `SellerOnboarding.SellerApplication`
- **Rules:** SON-BR-004
- **Consumers:** the seller tools' access gate; SellerCentral (REL-06)
- **Published:** yes (REL-06)
- **Code:** `src/context/SellerApplicationProvider.tsx` (`sellerStatus`, `myApplication`), `src/components/seller/SellerGate.tsx`

### SellerProfile

- **Answers:** Who is this seller, as shoppers and the seller see them?
- **Shape:** business name, type, contact, email, phone, website, description, seller since, registered
  address, tax number, masked payout account, status `Verified`
- **Derived from:** `SellerOnboarding.SellerApplication` while it is `Approved`
- **Rules:** SON-BR-008
- **Consumers:** SellerCentral (seller name on storefront products, REL-06); the business details page
- **Published:** yes (REL-06)
- **Code:** `src/data/seller.ts` (`toSellerProfile`), `src/lib/types.ts` (`SellerProfile`)

### ReviewQueue

- **Answers:** Which applications await a decision, and how were the others decided?
- **Shape:** applications, newest first, filterable by status, with the count still pending
- **Derived from:** `SellerOnboarding.SellerApplication`
- **Rules:** SON-BR-003, SON-BR-011
- **Consumers:** ACT-ADMIN
- **Published:** no
- **Code:** `src/components/admin/SellerApplicationsAdminView.tsx`
