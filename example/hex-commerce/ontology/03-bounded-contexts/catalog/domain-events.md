---
id: Catalog.events
type: domain-events
context: Catalog
status: implemented
last_reviewed: 2026-10-27
---

# Catalog — domain events and policies

This context emits no domain events as-built, because nothing in it changes at run time.

It has no policies of its own. It reacts to seller listings becoming sellable by reading
`SellerCentral.StorefrontProducts` on every render (REL-04), not by subscribing to events.

When catalogue maintenance is built (see [commands.md](commands.md)), expect `ProductPublished`,
`ProductPriceChanged`, `ProductStockChanged` and `StoreDealStarted`. Shopping will need the stock and
price events to re-check basket limits.
