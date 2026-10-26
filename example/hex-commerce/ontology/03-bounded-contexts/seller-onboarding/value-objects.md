---
id: SellerOnboarding.value-objects
type: value-objects
context: SellerOnboarding
status: implemented
last_reviewed: 2026-10-27
---

# SellerOnboarding — value objects

### BusinessType

- **Meaning:** The legal structure of the applying business.
- **Attributes:** value — Sole trader, Partnership, Limited company, Non-profit
- **Constraints:** SON-BR-002
- **Equality:** by value
- **Used by:** `SellerOnboarding.SellerApplication`, `SellerOnboarding.SellerProfile`
- **Code:** `src/lib/types.ts` (`SellerBusinessType`), `src/data/sellerApplications.ts` (`SELLER_BUSINESS_TYPES`)

### RegisteredAddress

- **Meaning:** The business's legal address. Unlike `Account.CustomerAccount` addresses, it is not a
  delivery address.
- **Attributes:** line 1, line 2 (optional), city, state or county, postcode, country
- **Constraints:** SON-BR-001
- **Equality:** by all attributes
- **Used by:** `SellerOnboarding.SellerApplication`, `SellerOnboarding.SellerProfile`
- **Code:** `src/lib/types.ts` (`SellerApplication` fields `line1` to `country`)

### ApplicationReference

- **Meaning:** The human-readable reference of an application.
- **Attributes:** `SA-` and five digits
- **Constraints:** SON-BR-006
- **Equality:** by value
- **Used by:** `SellerOnboarding.SellerApplication`
- **Code:** `src/context/SellerApplicationProvider.tsx` (`makeId`)
