---
id: Ordering.read-models
type: read-models
context: Ordering
status: implemented
last_reviewed: 2026-10-27
---

# Ordering — read models and queries

## Published to other contexts

### PurchaseCheck

- **Answers:** Has the shopper bought this product?
- **Shape:** yes/no
- **Derived from:** `Ordering.OrderHistory`
- **Rules:** ORD-BR-009
- **Consumers:** Reviews (verified purchase, REL-10)
- **Published:** yes (REL-10)
- **Code:** `src/context/AccountProvider.tsx` (`hasPurchased`), `src/data/account.ts` (`hasPurchased`)

### OrderHistory

- **Answers:** What has the shopper ordered?
- **Shape:** list of `Ordering.Order`, newest placed first, then the sample history
- **Derived from:** `Ordering.Order`
- **Rules:** ORD-BR-011
- **Consumers:** ACT-SHOPPER (orders page, account page); CustomerService (translated into
  `CustomerService.OrderedItem`, REL-11)
- **Published:** yes (REL-11)
- **Code:** `src/context/AccountProvider.tsx` (`orders`, `getOrder`), `src/components/orders/OrdersView.tsx`

## For the shopper

### OrderDetail

- **Answers:** What exactly was in this order, where did it go, and what did it cost?
- **Shape:** the order with resolved items and `Ordering.OrderTotals`
- **Derived from:** `Ordering.Order`; `Catalog.ProductLookup` for sample orders
- **Rules:** ORD-BR-005, ORD-BR-008
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/components/orders/OrderDetailView.tsx`, `src/data/account.ts` (`getOrderTotals`)

### DeliveryTracker

- **Answers:** How far has this order got?
- **Shape:** the four tracking stages with the current one marked, and the expected or actual delivery
  date
- **Derived from:** `Ordering.Order`
- **Rules:** ORD-BR-007
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/components/orders/OrderDetailView.tsx` (`TRACKING_STAGES`)

### Invoice

- **Answers:** What did this order charge, in a form to keep?
- **Shape:** reference, dates, address, card, items with prices, totals; printable
- **Derived from:** `Ordering.OrderDetail`
- **Rules:** ORD-BR-005
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/components/orders/OrderDetailView.tsx` (`#invoice` section)
