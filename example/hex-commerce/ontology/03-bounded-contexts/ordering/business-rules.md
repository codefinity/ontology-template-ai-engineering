---
id: Ordering.rules
type: business-rules
context: Ordering
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 sections 8.1 (pricing), 8.4 (orders, fulfilment, cancellations and returns), 8.7 (account)
---

# Ordering — business rules

## Placing an order

### ORD-BR-006 No order while the basket has stock problems
- **Statement:** An order cannot be placed while any basket line asks for more than is available
  (`Shopping.StockProblems`).
- **Kind:** validation
- **Applies to:** `Ordering.PlaceOrder`
- **Status:** implemented
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder`, `hasStockProblems`)
- **Source:** BR-CRT-005 (the Shopping rule SHP-BR-005)

### ORD-BR-017 Checkout starts from the shopper's choices
- **Statement:** Checkout delivers to the address selected as "deliver to", and charges the default
  card unless the shopper picks another saved card.
- **Kind:** policy
- **Applies to:** `Ordering.PlaceOrder`
- **Status:** implemented
- **Code:** `src/components/checkout/CheckoutView.tsx` (`selectedAddress`, `selectedPayment`)
- **Source:** BRD v3.0 data dictionary (Checkout: delivery address, payment card)

### ORD-BR-001 New orders start in Processing
- **Statement:** A newly placed order has the status `Processing`.
- **Kind:** invariant
- **Applies to:** `Ordering.Order`
- **Status:** implemented
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder`)
- **Source:** BR-ORD-001

### ORD-BR-002 Order reference format
- **Statement:** Every order is referenced `204-NNNNNNN-NNNNNNN`.
- **Kind:** constraint
- **Applies to:** `Ordering.OrderReference`
- **Status:** implemented
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder`)
- **Source:** BR-ORD-004
- **Notes:** The digits are random and not checked for uniqueness.

### ORD-BR-003 Expected delivery date
- **Statement:** The expected delivery date is the order date + 1 day for next-day delivery and + 4 days
  for standard delivery.
- **Kind:** derivation
- **Applies to:** `Ordering.Order`, `Ordering.DeliverySpeed`
- **Status:** partial
- **Code:** `src/components/checkout/CheckoutView.tsx` (`arrivalIso`)
- **Source:** BR-ORD-002
- **Notes:** The BRD makes next-day + 2 days for orders placed after a configurable cut-off time. There
  is no cut-off.

### ORD-BR-004 One delivery fee for both speeds
- **Statement:** Next-day and standard delivery cost the same: the basket's delivery fee.
- **Kind:** derivation
- **Applies to:** `Ordering.DeliverySpeed`
- **Status:** implemented
- **Code:** `src/components/checkout/CheckoutView.tsx` (`deliveryLabel`)
- **Source:** BR-PRC-007

### ORD-BR-005 An order keeps what it was placed with
- **Statement:** An order keeps the item titles, unit prices, delivery address, masked card and totals as
  they were when it was placed. Later changes to products, listings, deals or the account do not affect
  it.
- **Kind:** invariant
- **Applies to:** `Ordering.Order`
- **Status:** implemented
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder`)
- **Source:** BR-ORD-003

### ORD-BR-010 Marketplace lines are handed to their seller
- **Statement:** When an order is placed, each line sold by a marketplace seller is recorded as a sale for
  that seller, at the unit price paid. The seller receives only the recipient's name and city. The order
  is placed only if the sale is recorded.
- **Kind:** policy
- **Applies to:** `Ordering.PlaceOrder`
- **Status:** partial
- **Code:** `src/components/checkout/CheckoutView.tsx` (`placeOrder` → `recordSale`)
- **Source:** BR-SOR-005, NFR-REL-003
- **Notes:** `recordSale` returns `false` when the seller store cannot save. Checkout ignores that and
  places the order anyway.

### ORD-BR-012 No payment is taken
- **Statement:** Placing an order authorises and captures payment through the payment service provider.
- **Kind:** constraint
- **Applies to:** `Ordering.PlaceOrder`
- **Status:** not-implemented
- **Code:** —
- **Source:** FR-PAY-002
- **Notes:** The demonstration records the order and the masked card, but takes no payment.

### ORD-BR-016 Expired cards are refused
- **Statement:** An order cannot be paid with a card that has expired. A card is expired from the first
  day of the month after its expiry month.
- **Kind:** validation
- **Applies to:** `Ordering.PlaceOrder`
- **Status:** not-implemented
- **Code:** —
- **Source:** BR-ACC-010
- **Notes:** The card form refuses expired cards when they are added (ACC-BR-006), but a card that has
  expired since then can still be chosen.

## Status and tracking

### ORD-BR-007 Order statuses
- **Statement:** An order is `Processing`, `Shipped`, `Out for delivery`, `Delivered` or `Cancelled`.
  Tracking shows the first four as stages, in that order.
- **Kind:** invariant
- **Applies to:** `Ordering.Order`
- **Status:** implemented
- **Code:** `src/lib/types.ts` (`OrderStatus`), `src/components/orders/OrderDetailView.tsx` (`TRACKING_STAGES`)
- **Source:** BR-ORD-005

### ORD-BR-013 Order status follows its lines
- **Statement:** An order's status is the least advanced status of its lines that are not cancelled. An
  order whose lines are all cancelled is `Cancelled`.
- **Kind:** derivation
- **Applies to:** `Ordering.Order`
- **Status:** not-implemented
- **Code:** —
- **Source:** BR-ORD-008
- **Notes:** Lines have no status. Placed orders stay `Processing`, even after their seller dispatches
  (`SellerCentral.SellerOrderDispatched` has no consumer here).

### ORD-BR-014 Cancel only before dispatch
- **Statement:** A shopper can cancel an order line only while it is `Processing`.
- **Kind:** validation
- **Applies to:** `Ordering.Order`
- **Status:** not-implemented
- **Code:** —
- **Source:** BR-ORD-009, BR-ORD-011

### ORD-BR-015 Returns window
- **Statement:** A return or replacement can be requested for a line only when it is `Delivered`, and no
  more than 30 days after delivery.
- **Kind:** validation
- **Applies to:** `Ordering.Order`
- **Status:** not-implemented
- **Code:** `src/components/orders/OrderDetailView.tsx` ("Return or replace items" link)
- **Source:** BR-ORD-006
- **Notes:** Delivered orders link to a support issue with the topic "Request a return" preselected. No
  window is checked.

## History

### ORD-BR-008 Orders without captured prices are priced today
- **Statement:** An order that carries no totals (the sample history) is priced from current catalogue
  prices, with the basket's delivery and tax rules.
- **Kind:** derivation
- **Applies to:** `Ordering.OrderTotals`
- **Status:** implemented
- **Code:** `src/data/account.ts` (`getOrderTotals`)
- **Source:** hex-commerce-source-ui (demonstration data)
- **Notes:** This contradicts ORD-BR-005 for sample data only. Every order placed at checkout carries
  its own totals.

### ORD-BR-011 Order history order
- **Statement:** The order history lists orders placed by the shopper, newest first, followed by the
  sample history.
- **Kind:** derivation
- **Applies to:** `Ordering.OrderHistory`
- **Status:** implemented
- **Code:** `src/context/AccountProvider.tsx` (`orders`)
- **Source:** hex-commerce-source-ui

### ORD-BR-009 What counts as a purchase
- **Statement:** A shopper has bought a product if it appears in any of their orders that are not
  `Cancelled`.
- **Kind:** derivation
- **Applies to:** `Ordering.PurchaseCheck`
- **Status:** implemented
- **Code:** `src/data/account.ts` (`hasPurchased`)
- **Source:** BR-ORD-007
