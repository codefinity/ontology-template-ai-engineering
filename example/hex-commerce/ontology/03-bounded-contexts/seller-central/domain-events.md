---
id: SellerCentral.events
type: domain-events
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
---

# SellerCentral — domain events and policies

There is no event bus. Each "event" below is a reducer action applied to the seller store. Other
contexts see its effect because they read `SellerCentral.StorefrontProducts` and
`SellerCentral.StorefrontProduct` again on the next render. **Realised as** names the reducer action.

## Events

### ListingCreated

- **Meaning:** A seller added a listing, as a draft or for sale.
- **Emitted by:** `SellerCentral.CreateListing`
- **Payload:** listing
- **Consumers:** Catalog and Shopping, through the storefront feed if `Active`
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `create`

### ListingUpdated

- **Meaning:** A seller changed a listing's details or saved it with a new status.
- **Emitted by:** `SellerCentral.UpdateListing`
- **Payload:** listing id, new details, new status
- **Consumers:** storefront feed: price, stock and content change for shoppers at once, including in
  baskets
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `update`

### ListingStatusChanged

- **Meaning:** A listing was published or unpublished.
- **Emitted by:** `SellerCentral.PublishListing`, `SellerCentral.UnpublishListing`
- **Payload:** listing id, new status
- **Consumers:** storefront feed; `SellerCentral.DealPausedReason`
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `setListingStatus`

### ListingDeleted

- **Meaning:** A listing was removed, together with its deals.
- **Emitted by:** `SellerCentral.DeleteListing`
- **Payload:** listing id
- **Consumers:** storefront feed (the listing disappears); Shopping (basket lines for it can no longer be
  resolved and drop out, SHP-BR-015)
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `delete`

### DealCreated

- **Meaning:** A seller created a deal, scheduled or live.
- **Emitted by:** `SellerCentral.CreateDeal`
- **Payload:** deal
- **Consumers:** storefront feed (price drops if the deal runs at once)
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `createDeal`

### DealUpdated

- **Meaning:** A seller changed a deal's discount, units or dates.
- **Emitted by:** `SellerCentral.UpdateDeal`
- **Payload:** deal id, new values
- **Consumers:** storefront feed
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `updateDeal`

### DealStarted

- **Meaning:** A scheduled deal was started early.
- **Emitted by:** `SellerCentral.StartDealEarly`
- **Payload:** deal id, new start date
- **Consumers:** storefront feed
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `setDealStatus` (`Live`)

### DealEnded

- **Meaning:** A seller ended a deal.
- **Emitted by:** `SellerCentral.EndDeal`
- **Payload:** deal id
- **Consumers:** storefront feed (the price returns to normal)
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `setDealStatus` (`Ended`)

### DealDeleted

- **Meaning:** A seller removed a deal.
- **Emitted by:** `SellerCentral.DeleteDeal`
- **Payload:** deal id
- **Consumers:** storefront feed
- **Scope:** integration (through the feed)
- **Realised as:** reducer action `deleteDeal`

### SaleRecorded

- **Meaning:** Marketplace lines of a shopper's order became seller orders. Stock and deal claims were
  updated with them.
- **Emitted by:** `SellerCentral.RecordSale`
- **Payload:** seller orders created; quantity per listing; quantity per deal
- **Consumers:** storefront feed (lower stock, possibly `Out of stock`, deal units left);
  `SellerCentral.SellerSummary`
- **Scope:** integration
- **Realised as:** reducer action `recordSale`

### SellerOrderDispatched

- **Meaning:** The seller sent an order.
- **Emitted by:** `SellerCentral.DispatchSellerOrder`
- **Payload:** seller order id
- **Consumers:** none outside this context. The shopper's order does not change status (gap; see
  Ordering README).
- **Scope:** internal
- **Realised as:** reducer action `setOrderStatus`

### SellerOrderDelivered

- **Meaning:** The seller recorded delivery to the buyer.
- **Emitted by:** `SellerCentral.MarkSellerOrderDelivered`
- **Payload:** seller order id
- **Consumers:** none outside this context
- **Scope:** internal
- **Realised as:** reducer action `setOrderStatus`

## Policies

### RecordSaleOnOrderPlaced

- **When:** `Ordering.OrderPlaced` contains lines whose product has a seller
- **Then:** `SellerCentral.RecordSale` with one `SellerCentral.SaleLine` per marketplace line, and the
  delivery recipient's name and city as the buyer
- **Rules:** SEL-BR-025, SEL-BR-005, SEL-BR-020
- **Realised as:** direct call `recordSale(...)` from `placeOrder` in `src/components/checkout/CheckoutView.tsx`,
  made before the order is stored. Its `false` result (storage full) is ignored, so the order can be
  placed without the seller orders (see Ordering ORD-BR-010).

### WithdrawStorefrontWhenNotApproved

- **When:** the seller's application leaves `Approved` (`SellerOnboarding.ApplicationReopened`)
- **Then:** every listing and deal leaves the storefront feed
- **Rules:** SEL-BR-027
- **Realised as:** the feed is computed only while `sellerProfile` is present; no explicit reaction
