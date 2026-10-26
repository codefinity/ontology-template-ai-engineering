---
id: Account.rules
type: business-rules
context: Account
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 8.7 (account book and access)
---

# Account — business rules

## Account book

### ACC-BR-001 Never remove the last address or card
- **Statement:** A shopper always keeps at least one delivery address and at least one card. The last of
  either cannot be removed.
- **Kind:** invariant
- **Applies to:** `Account.CustomerAccount`
- **Status:** implemented
- **Code:** `src/context/AccountProvider.tsx` (reducer cases `removeAddress`, `removePaymentMethod`)
- **Source:** BR-ACC-001

### ACC-BR-002 Exactly one default address and card
- **Statement:** Exactly one address and exactly one card are the default. The first one saved becomes
  the default. When the default is removed, the first remaining entry becomes the default.
- **Kind:** invariant
- **Applies to:** `Account.CustomerAccount`
- **Status:** implemented
- **Code:** `src/context/AccountProvider.tsx` (`withDefault`, reducer cases `addAddress`, `removeAddress`, `addPaymentMethod`, `removePaymentMethod`)
- **Source:** BR-ACC-002

### ACC-BR-003 Deliver-to is always a saved address
- **Statement:** The deliver-to address is always one of the saved addresses. It can be set only to a
  saved address. When it is removed, or no longer exists, the default address takes its place.
- **Kind:** invariant
- **Applies to:** `Account.CustomerAccount`
- **Status:** implemented
- **Code:** `src/context/AccountProvider.tsx` (reducer cases `removeAddress`, `setDeliverTo`; hydration)
- **Source:** BR-ACC-003

## Validation

### ACC-BR-004 Required address details
- **Statement:** An address needs a recipient name, line 1, city, postcode and country. Line 2 and state
  or county are optional. A blank label is saved as "Home".
- **Kind:** validation
- **Applies to:** `Account.Address`
- **Status:** implemented
- **Code:** `src/components/account/AddressBook.tsx`
- **Source:** BR-ACC-004

### ACC-BR-005 Card number length
- **Statement:** A card number has 13 to 19 digits, ignoring spaces and hyphens.
- **Kind:** validation
- **Applies to:** `Account.PaymentMethod`
- **Status:** implemented
- **Code:** `src/components/account/PaymentMethodsCard.tsx`
- **Source:** BR-ACC-005

### ACC-BR-006 Card expiry
- **Statement:** The expiry is MM/YY with a month from 01 to 12, and is not earlier than the current
  month.
- **Kind:** validation
- **Applies to:** `Account.CardExpiry`
- **Status:** partial
- **Code:** `src/components/account/PaymentMethodsCard.tsx`
- **Source:** BR-ACC-006, BR-ACC-010
- **Notes:** Checked only when a card is added, against the store clock. A saved card that expires later
  can still be the default, and can still be used (ORD-BR-016).

### ACC-BR-007 Card brand from leading digits
- **Statement:** A number starting with 4 is Visa; 51–55 or 22–27 is Mastercard; 34 or 37 is Amex; any
  other is "Card".
- **Kind:** derivation
- **Applies to:** `Account.CardBrand`
- **Status:** implemented
- **Code:** `src/components/account/PaymentMethodsCard.tsx` (`detectBrand`)
- **Source:** BR-ACC-007

### ACC-BR-008 Only masked card data is kept
- **Statement:** Only a card's brand, last four digits and expiry are kept. The full number is never
  stored.
- **Kind:** constraint
- **Applies to:** `Account.PaymentMethod`
- **Status:** implemented
- **Code:** `src/components/account/PaymentMethodsCard.tsx`
- **Source:** BR-ACC-008, NFR-SEC-001
- **Notes:** The BRD target also keeps the payment provider's card reference.

## Access

### ACC-BR-009 One shopper is always signed in
- **Statement:** Shoppers register, sign in and sign out, with a password policy, lock-out after repeated
  failures and session expiry.
- **Kind:** constraint
- **Applies to:** `Account.CustomerAccount`
- **Status:** not-implemented
- **Code:** `src/data/account.ts` (`currentUser`)
- **Source:** BR-ACC-011, BR-ACC-012, BR-ACC-013
- **Notes:** The demonstration always acts as Alex Morgan. The sign-in and registration pages are
  presentation only.
