---
id: SellerOnboarding.commands
type: commands
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
---

# SellerOnboarding — commands

### SubmitApplication

- **Intent:** Ask for a business to be allowed to sell.
- **Actor:** ACT-PROSPECTIVE-SELLER
- **Target:** `SellerOnboarding.SellerApplication` (creates)
- **Input:** business name, business type, contact, email, phone, website, description, years trading,
  registered address, tax number. The contact name and email are prefilled from `Account.CurrentShopper`.
- **Rejected when:** SON-BR-001, SON-BR-002, SON-BR-005
- **On success:** a `Pending` application that is now the shopper's own (SON-BR-010); emits
  `SellerOnboarding.ApplicationSubmitted`
- **Code:** `src/context/SellerApplicationProvider.tsx` (`submitApplication`)

### ApproveApplication

- **Intent:** Admit the business as a seller.
- **Actor:** ACT-ADMIN
- **Target:** `SellerOnboarding.SellerApplication` (changes)
- **Input:** application id
- **Rejected when:** SON-BR-003 (not `Pending`)
- **On success:** `Approved` with a decision time; emits `SellerOnboarding.ApplicationApproved`
- **Code:** `src/context/SellerApplicationProvider.tsx` (`decideApplication`)

### RejectApplication

- **Intent:** Refuse the application.
- **Actor:** ACT-ADMIN
- **Target:** `SellerOnboarding.SellerApplication` (changes)
- **Input:** application id, optional reason
- **Rejected when:** SON-BR-003 (not `Pending`)
- **On success:** `Rejected` with a decision time and note (SON-BR-007); emits
  `SellerOnboarding.ApplicationRejected`
- **Code:** `src/context/SellerApplicationProvider.tsx` (`decideApplication`)

### ReconsiderApplication

- **Intent:** Put a decided application back in the queue.
- **Actor:** ACT-ADMIN
- **Target:** `SellerOnboarding.SellerApplication` (changes)
- **Input:** application id
- **Rejected when:** SON-BR-003 (already `Pending`)
- **On success:** `Pending`, with note and decision time cleared. An approved seller loses access at once
  (SON-BR-004). Emits `SellerOnboarding.ApplicationReopened`.
- **Code:** `src/context/SellerApplicationProvider.tsx` (`reconsiderApplication`)

### UpdateBusinessDetails

- **Intent:** Keep the seller's business details current.
- **Actor:** ACT-SELLER
- **Target:** `SellerOnboarding.SellerApplication` (changes, the shopper's own)
- **Input:** the application fields except years trading
- **Rejected when:** SON-BR-009
- **On success:** details changed. The seller profile and the seller name on storefront listings follow.
  Emits `SellerOnboarding.BusinessDetailsUpdated`.
- **Code:** `src/context/SellerApplicationProvider.tsx` (`updateMyDetails`)
