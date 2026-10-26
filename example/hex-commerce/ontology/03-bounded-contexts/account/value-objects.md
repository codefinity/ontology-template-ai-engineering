---
id: Account.value-objects
type: value-objects
context: Account
status: implemented
last_reviewed: 2026-10-27
---

# Account — value objects

### CardBrand

- **Meaning:** The card scheme, shown with the last four digits.
- **Attributes:** Visa, Mastercard, Amex or Card
- **Constraints:** ACC-BR-007
- **Equality:** by value
- **Used by:** `Account.PaymentMethod`, `Ordering.PaymentSnapshot`
- **Code:** `src/components/account/PaymentMethodsCard.tsx` (`detectBrand`)

### CardExpiry

- **Meaning:** The last month a card can be used.
- **Attributes:** month (01–12), year (two digits), written MM/YY
- **Constraints:** ACC-BR-006
- **Equality:** by month and year
- **Used by:** `Account.PaymentMethod`
- **Code:** `src/components/account/PaymentMethodsCard.tsx`
