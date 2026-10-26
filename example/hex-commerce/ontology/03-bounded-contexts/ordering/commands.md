---
id: Ordering.commands
type: commands
context: Ordering
status: implemented
last_reviewed: 2026-10-27
---

# Ordering — commands

### PlaceOrder

- **Intent:** Buy everything in the basket.
- **Actor:** ACT-SHOPPER
- **Target:** `Ordering.Order` (creates)
- **Input:** the basket (`Shopping.DetailedBasket`, `Shopping.BasketTotals`), the delivery address
  (`Account.DeliverTo`), a saved card, a delivery speed
- **Rejected when:** ORD-BR-006 (stock problems), or the basket is empty; ORD-BR-016 and SEL-BR-028
  should apply but are not implemented
- **On success:** an order in `Processing` with its snapshot (ORD-BR-001, ORD-BR-005) and expected
  delivery date (ORD-BR-003). Emits `Ordering.OrderPlaced`. The shopper is shown the order reference.
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder`), `src/context/AccountProvider.tsx` (`placeOrder`)

The BRD target state adds `CancelOrderLine` (P24), `RequestReturn` (P25) and fulfilment updates (P23).
They are not modelled yet.
