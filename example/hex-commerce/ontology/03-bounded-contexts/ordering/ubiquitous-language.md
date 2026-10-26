---
id: Ordering.language
type: ubiquitous-language
context: Ordering
status: implemented
last_reviewed: 2026-10-27
---

# Ordering — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Delivery speed | Next-day (+1 day) or standard (+4 days). | `speed`: `'express'` / `'standard'` | express (code only), shipping method | `Ordering.DeliverySpeed` |
| Expected delivery date | The date the order is due to arrive. | `deliveredOn` | delivery date (ambiguous after delivery) | `Ordering.Order` |
| Invoice | A printable summary of what an order charged. | `#invoice` section | receipt | `Ordering.Invoice` |
| Order | A confirmed purchase, frozen at the moment it was placed. | `Order` | purchase, transaction, seller order (that is SellerCentral's) | `Ordering.Order` |
| Order item | One item in an order, with its quantity and the price paid. | `OrderItem` | line item (fine in prose), cart line | `Ordering.OrderItem` |
| Order reference | The shopper-facing order number, `204-NNNNNNN-NNNNNNN`. | `Order.id` | order ID | `Ordering.OrderReference` |
| Order totals | Subtotal, delivery fee, tax and total charged. | `OrderTotals` | | `Ordering.OrderTotals` |
| Recipient | The name the order is delivered to. | `shipTo` | customer | `Ordering.AddressSnapshot` |
| Tracking stages | Processing, Shipped, Out for delivery, Delivered, in that order. | `TRACKING_STAGES` | | `Ordering.DeliveryTracker` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Check out | Review address, card and delivery speed before placing the order. | `CheckoutView` | | `Ordering.PlaceOrder` |
| Place an order | Turn the basket into an order. | `placeOrder` | buy, submit | `Ordering.PlaceOrder` |

## States and statuses

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Processing | Placed; nothing dispatched yet. | `'Processing'` | pending, new | `Ordering.Order` |
| Shipped | Dispatched. | `'Shipped'` | dispatched (SellerCentral's word) | `Ordering.Order` |
| Out for delivery | With the carrier on its final leg. | `'Out for delivery'` | | `Ordering.Order` |
| Delivered | Received. | `'Delivered'` | | `Ordering.Order` |
| Cancelled | Will not be fulfilled; excluded from purchases and support. | `'Cancelled'` | | `Ordering.Order` |
