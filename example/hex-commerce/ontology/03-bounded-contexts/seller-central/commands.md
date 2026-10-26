---
id: SellerCentral.commands
type: commands
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
---

# SellerCentral — commands

Every command below needs the issuer to be an approved seller (SON-BR-004), except `RecordSale`, which
comes from Ordering. Every command is subject to SEL-BR-029: if the change cannot be saved, it is
refused.

## Listings

### CreateListing

- **Intent:** Offer a new product for sale, or keep it as a draft.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerListing` (creates)
- **Input:** listing details (title, brand, department, subcategory, condition, images, price, "was"
  price, stock, summary, description, features); publish or save as draft
- **Rejected when:** SEL-BR-001, SEL-BR-006
- **On success:** listing created with status per SEL-BR-002; emits `SellerCentral.ListingCreated`
- **Code:** `src/context/SellerProvider.tsx` (`createListing`), `src/components/seller/ListingEditor.tsx`

### UpdateListing

- **Intent:** Change a listing's details, publish it, or move it back to draft.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerListing` (changes)
- **Input:** listing id, listing details, publish or save as draft
- **Rejected when:** SEL-BR-001, SEL-BR-006
- **On success:** status per SEL-BR-002; emits `SellerCentral.ListingUpdated`
- **Code:** `src/context/SellerProvider.tsx` (`updateListing`)

### PublishListing

- **Intent:** Put a draft or unpublished listing on sale.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerListing` (changes)
- **Input:** listing id
- **Rejected when:** the listing is not `Draft` or `Unpublished`
- **On success:** `Active` if it has stock, otherwise `Out of stock` (SEL-BR-002); emits
  `SellerCentral.ListingStatusChanged`
- **Code:** `src/components/seller/SellerListingsView.tsx` → `setListingStatus`

### UnpublishListing

- **Intent:** Stop selling a listing without losing it.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerListing` (changes)
- **Input:** listing id
- **Rejected when:** the listing is not `Active` or `Out of stock`
- **On success:** `Unpublished`. Shoppers see it as unavailable, and any running deal pauses
  (SEL-BR-017). Emits `SellerCentral.ListingStatusChanged`.
- **Code:** `src/components/seller/SellerListingsView.tsx` → `setListingStatus`

### DeleteListing

- **Intent:** Remove a listing for good.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerListing` (deletes)
- **Input:** listing id
- **Rejected when:** never
- **On success:** listing removed with its deals (SEL-BR-007); emits `SellerCentral.ListingDeleted`
- **Code:** `src/context/SellerProvider.tsx` (`deleteListing`)

## Deals

### CreateDeal

- **Intent:** Discount a listing for a limited time and number of units.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerDeal` (creates)
- **Input:** listing, discount %, deal units, start date, end date
- **Rejected when:** SEL-BR-010, SEL-BR-011, SEL-BR-013, SEL-BR-014, SEL-BR-022
- **On success:** deal created `Scheduled` or `Live` with 0 claimed; emits `SellerCentral.DealCreated`
- **Code:** `src/context/SellerProvider.tsx` (`createDeal`), `src/components/seller/DealEditor.tsx`

### UpdateDeal

- **Intent:** Change a deal's discount, units or dates.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerDeal` (changes)
- **Input:** deal id and the same fields as `CreateDeal`
- **Rejected when:** SEL-BR-010 to SEL-BR-014
- **On success:** status re-derived, an ended deal stays ended (SEL-BR-023); emits `SellerCentral.DealUpdated`
- **Code:** `src/context/SellerProvider.tsx` (`updateDeal`)

### StartDealEarly

- **Intent:** Begin a scheduled deal today.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerDeal` (changes)
- **Input:** deal id
- **Rejected when:** SEL-BR-021 (it would overlap another deal)
- **On success:** start date set to today, status `Live`; emits `SellerCentral.DealStarted`
- **Code:** `src/context/SellerProvider.tsx` (`setDealStatus` with `Live`)

### EndDeal

- **Intent:** Stop a deal before its end date.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerDeal` (changes)
- **Input:** deal id
- **Rejected when:** never
- **On success:** status `Ended` for good (SEL-BR-023); emits `SellerCentral.DealEnded`
- **Code:** `src/context/SellerProvider.tsx` (`setDealStatus` with `Ended`)

### DeleteDeal

- **Intent:** Remove a deal.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerDeal` (deletes)
- **Input:** deal id
- **Rejected when:** never
- **On success:** deal removed; emits `SellerCentral.DealDeleted`
- **Code:** `src/context/SellerProvider.tsx` (`deleteDeal`)

## Seller orders

### RecordSale

- **Intent:** Hand the marketplace lines of a placed shopper order to the seller.
- **Actor:** policy `SellerCentral.RecordSaleOnOrderPlaced`
- **Target:** `SellerCentral.SellerOrder` (creates); `SellerCentral.SellerListing` and
  `SellerCentral.SellerDeal` (changes)
- **Input:** list of `SellerCentral.SaleLine`; buyer name and city
- **Rejected when:** SEL-BR-029 (cannot be saved); SEL-BR-028 should apply but is not implemented
- **On success:** one seller order per line (SEL-BR-025), stock reduced (SEL-BR-005), and units
  claimed under the running deal (SEL-BR-020), all in one step. Emits `SellerCentral.SaleRecorded`.
- **Code:** `src/context/SellerProvider.tsx` (`recordSale`)

### DispatchSellerOrder

- **Intent:** Confirm a seller order has been sent.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerOrder` (changes)
- **Input:** seller order id
- **Rejected when:** SEL-BR-024 (not `New`)
- **On success:** `Dispatched`; emits `SellerCentral.SellerOrderDispatched`
- **Code:** `src/components/seller/SellerOrdersView.tsx` → `setOrderStatus`

### MarkSellerOrderDelivered

- **Intent:** Record that the buyer received a seller order.
- **Actor:** ACT-SELLER
- **Target:** `SellerCentral.SellerOrder` (changes)
- **Input:** seller order id
- **Rejected when:** SEL-BR-024 (not `Dispatched`)
- **On success:** `Delivered`; emits `SellerCentral.SellerOrderDelivered`
- **Code:** `src/components/seller/SellerOrdersView.tsx` → `setOrderStatus`
