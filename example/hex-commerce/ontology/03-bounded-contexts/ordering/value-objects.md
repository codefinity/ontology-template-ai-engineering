---
id: Ordering.value-objects
type: value-objects
context: Ordering
status: implemented
last_reviewed: 2026-10-27
---

# Ordering — value objects

### OrderReference

- **Meaning:** The shopper-facing order number.
- **Attributes:** `204-` + 7 digits + `-` + 7 digits
- **Constraints:** ORD-BR-002
- **Equality:** by value
- **Used by:** `Ordering.Order`; `CustomerService.SupportIssue` (as `orderId`)
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder`, `reference`)

### OrderTotals

- **Meaning:** What an order charged.
- **Attributes:** subtotal, delivery fee (`shipping`), tax, total, each a `StoreConfig.Money`
- **Constraints:** Copied from `Shopping.BasketTotals` when placed (ORD-BR-005). For sample orders,
  derived per ORD-BR-008.
- **Equality:** by all amounts
- **Used by:** `Ordering.Order`
- **Code:** `src/lib/types.ts` (`OrderTotals`)

### DeliverySpeed

- **Meaning:** How fast the shopper wants the order.
- **Attributes:** next-day or standard
- **Constraints:** ORD-BR-003, ORD-BR-004. Next-day is preselected.
- **Equality:** by value
- **Used by:** `Ordering.PlaceOrder`. It is not stored on the order; only its result, the expected
  delivery date, is.
- **Code:** `src/components/checkout/CheckoutView.tsx` (`speed`: `'express'` / `'standard'`)

### AddressSnapshot

- **Meaning:** The delivery address exactly as it was when the order was placed.
- **Attributes:** the fields of an `Account.CustomerAccount` address: label, name, line 1, line 2,
  city, state, postcode, country
- **Constraints:** never updated after placing (ORD-BR-005)
- **Equality:** by all attributes
- **Used by:** `Ordering.Order`
- **Code:** `src/lib/types.ts` (`Order.address`, of type `Address`)

### PaymentSnapshot

- **Meaning:** Which card paid, masked.
- **Attributes:** card brand, last four digits
- **Constraints:** never the full card number (ORD-BR-005, ACC-BR-008)
- **Equality:** by both attributes
- **Used by:** `Ordering.Order`
- **Code:** `src/lib/types.ts` (`Order.payment`)
