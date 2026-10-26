---
id: Ordering.events
type: domain-events
context: Ordering
status: implemented
last_reviewed: 2026-10-27
---

# Ordering — domain events and policies

## Events

### OrderPlaced

- **Meaning:** A shopper bought the contents of their basket. The order is now a fixed record.
- **Emitted by:** `Ordering.PlaceOrder`
- **Payload:** the order (reference, date, items with unit prices and titles, recipient name and city,
  address, masked card, totals); the marketplace lines as `SellerCentral.SaleLine`
- **Consumers:**
  - `SellerCentral.RecordSaleOnOrderPlaced`: the seller gets a seller order per marketplace line
  - `Shopping.ClearBasketAfterOrder`: the basket is emptied
  - Reviews and CustomerService read the effect later, through `Ordering.PurchaseCheck` and
    `Ordering.OrderHistory`
- **Scope:** integration
- **Realised as:** no event object. `placeOrder` in `src/components/checkout/CheckoutView.tsx` calls, in
  order: `recordSale(...)` (SellerCentral), `account.placeOrder(order)` (store the order), and
  `clearCart()` (Shopping). The steps are not atomic (ORD-BR-010).

## Policies

This context has no policies. It reacts to nothing that happens elsewhere. In the target state it will
need to react to seller dispatch (`SellerCentral.SellerOrderDispatched`) and carrier updates
(ORD-BR-013).
