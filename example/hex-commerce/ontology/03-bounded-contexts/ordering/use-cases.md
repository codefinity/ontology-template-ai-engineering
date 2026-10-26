---
id: Ordering.use-cases
type: use-cases
context: Ordering
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P03 (checkout), P04 (track, invoice), P24 (cancel), P25 (returns)
---

# Ordering — use cases

### ORD-UC-01 Check out and place an order
- **Actor:** ACT-SHOPPER
- **Goal:** Buy everything in the basket.
- **Trigger:** The shopper proceeds to checkout.
- **Preconditions:** The basket has at least one item.
- **Main flow:**
  1. The shopper opens checkout.
  2. The system shows the deliver-to address, the default card, both delivery speeds with their
     arrival dates and fee, and the totals (ORD-BR-017, ORD-BR-003, ORD-BR-004).
  3. The shopper may choose another saved card and the standard speed instead of next-day.
  4. The shopper places the order.
  5. The system checks that every line is available (ORD-BR-006), and records the order as
     `Processing` with prices, address, masked card and totals captured (ORD-BR-001, ORD-BR-005). It
     gives the order a reference (ORD-BR-002).
  6. The system hands each marketplace line to its seller (ORD-BR-010) and empties the basket.
  7. The system confirms the order reference and the expected delivery date.
- **Alternative flows:**
  - `1a.` The basket is empty: there is nothing to check out. The use case ends.
  - `5a.` A line asks for more than is available: the order is refused and the shopper is told which
    items to change (SHP-BR-005). The use case resumes at SHP-UC-02.
  - `5b.` (not built) The chosen card has expired: the BRD requires a refusal (ORD-BR-016).
  - `5c.` (not built) Payment is authorised with the payment provider; a decline stops the order
    (ORD-BR-012).
  - `6a.` The seller's records cannot be saved: the BRD requires the order not to be placed; as-built,
    it is placed anyway (ORD-BR-010, partial).
- **Postconditions:** An order exists; seller orders exist for marketplace lines; listing stock and deal
  claims are updated; the basket is empty.
- **Commands:** `Ordering.PlaceOrder`; through policies `SellerCentral.RecordSale`, `Shopping.ClearBasket`
- **Rules:** ORD-BR-001, ORD-BR-002, ORD-BR-003, ORD-BR-004, ORD-BR-005, ORD-BR-006, ORD-BR-010,
  ORD-BR-012, ORD-BR-016, ORD-BR-017
- **Flows:** FLOW-02
- **Status:** partial
- **Code:** `src/app/checkout/page.tsx`, `src/components/checkout/CheckoutView.tsx`
- **Source:** P03

### ORD-UC-02 Follow an order
- **Actor:** ACT-SHOPPER
- **Goal:** Know where an order is and when it will arrive.
- **Trigger:** The shopper opens the order history or an order.
- **Preconditions:** The shopper has placed orders.
- **Main flow:**
  1. The shopper opens the order history.
  2. The system lists orders, newest placed first (ORD-BR-011), with status and delivery date.
  3. The shopper opens one order.
  4. The system shows its items, address, card and totals as placed (ORD-BR-005, ORD-BR-008), and the
     tracking stage (ORD-BR-007).
- **Alternative flows:**
  - `4a.` The order is delivered: the system offers to return or replace items (CS-UC-03).
  - `4b.` (not built) The order progresses as lines are dispatched and delivered (ORD-BR-013). As-built,
    orders placed in the store stay `Processing`.
- **Postconditions:** none
- **Commands:** none (read-only); reads `Ordering.OrderHistory`, `Ordering.OrderDetail`, `Ordering.DeliveryTracker`
- **Rules:** ORD-BR-005, ORD-BR-007, ORD-BR-008, ORD-BR-011, ORD-BR-013
- **Status:** partial
- **Code:** `src/app/orders/page.tsx`, `src/app/orders/[id]/page.tsx`
- **Source:** P04

### ORD-UC-03 Keep an invoice
- **Actor:** ACT-SHOPPER
- **Goal:** Have a record of what an order charged.
- **Trigger:** The shopper asks for an order's invoice.
- **Preconditions:** The order exists.
- **Main flow:**
  1. The shopper opens the order and its invoice.
  2. The system presents the reference, dates, address, card, items with prices and totals, ready to
     print.
- **Alternative flows:** none
- **Postconditions:** none
- **Commands:** none (read-only); reads `Ordering.Invoice`
- **Rules:** ORD-BR-005
- **Status:** implemented
- **Code:** `src/components/orders/OrderDetailView.tsx`
- **Source:** P04

### ORD-UC-04 Cancel an order before dispatch
- **Actor:** ACT-SHOPPER
- **Goal:** Stop an order, or part of it, that is no longer wanted.
- **Trigger:** The shopper asks to cancel lines of an order.
- **Preconditions:** The lines are still `Processing`.
- **Main flow:**
  1. The shopper chooses the lines to cancel and confirms.
  2. The system cancels them, returns their units to stock and to any deal, and refunds them.
- **Alternative flows:**
  - `1a.` A line has been dispatched: it cannot be cancelled; the shopper is offered a return once it
    is delivered.
- **Postconditions:** The cancelled lines are refunded, and the order status follows its lines.
- **Commands:** none modelled yet; changes `Ordering.Order`
- **Rules:** ORD-BR-014, ORD-BR-013
- **Status:** not-implemented
- **Code:** —
- **Source:** P24

### ORD-UC-05 Return a delivered item
- **Actor:** ACT-SHOPPER
- **Goal:** Send back a delivered item for a refund or replacement.
- **Trigger:** The shopper asks to return items of a delivered order.
- **Preconditions:** The line is `Delivered`, within the returns window.
- **Main flow:**
  1. The shopper chooses the items, quantities, reason, and refund or replacement.
  2. The system records a return request and issues return instructions.
  3. When the item is received and accepted, the system refunds or replaces it.
- **Alternative flows:**
  - `1a.` The line is not delivered, or the window has passed: the request is refused with the reason.
  - `3a.` The inspection rejects the return: the shopper is told why.
- **Postconditions:** The refund or replacement is issued, or the rejection is explained.
- **Commands:** none modelled yet; changes `Ordering.Order`
- **Rules:** ORD-BR-015
- **Status:** not-implemented
- **Code:** — (as-built, the shopper raises an issue instead: CS-UC-03)
- **Source:** P25
