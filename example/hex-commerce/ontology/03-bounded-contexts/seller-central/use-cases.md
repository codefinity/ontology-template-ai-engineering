---
id: SellerCentral.use-cases
type: use-cases
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P09 (create listing), P10 (run a deal), P11 (fulfil), P17 (maintain deal),
    P21 (maintain listing), P28 (payouts)
---

# SellerCentral — use cases

All use cases here need the seller's application to be `Approved` (SON-BR-004).

### SEL-UC-01 List a product for sale
- **Actor:** ACT-SELLER
- **Goal:** Offer a product to the marketplace's shoppers.
- **Trigger:** The seller creates a listing.
- **Preconditions:** none beyond approval
- **Main flow:**
  1. The seller describes the product: title, brand, department and subcategory, condition, and up to
     six images (SEL-BR-004, SEL-BR-006).
  2. The seller sets the price, an optional "was" price, and the units in stock.
  3. The seller writes the summary and description.
  4. The system checks the listing (SEL-BR-001), shows a preview, and saves it when the seller publishes.
  5. The system gives the listing a reference (SEL-BR-009) and makes it `Active`, or `Out of stock`
     with 0 units (SEL-BR-002). Shoppers can now find and buy it (FLOW-01).
- **Alternative flows:**
  - `4a.` A check fails: the seller is told what to correct at that step.
  - `4b.` The seller saves it as a draft: it is `Draft` and never shown to shoppers.
  - `4c.` The change cannot be saved: nothing changes, and the seller keeps their entries (SEL-BR-029).
- **Postconditions:** The listing exists. If `Active`, it is in the storefront feed.
- **Commands:** `SellerCentral.CreateListing`
- **Rules:** SEL-BR-001, SEL-BR-002, SEL-BR-004, SEL-BR-006, SEL-BR-009, SEL-BR-029
- **Status:** implemented
- **Code:** `src/app/sell/(seller)/listings/new/page.tsx`, `src/components/seller/ListingEditor.tsx`
- **Source:** P09

### SEL-UC-02 Keep listings up to date
- **Actor:** ACT-SELLER
- **Goal:** Keep what is on sale accurate: content, price, stock and visibility.
- **Trigger:** The seller opens their listings.
- **Preconditions:** The seller has listings.
- **Main flow:**
  1. The seller edits a listing and saves it.
  2. The system re-checks it (SEL-BR-001) and sets its status from the stock (SEL-BR-002). Shoppers see
     the change at once, including in their baskets.
  3. The seller unpublishes a listing, or publishes a draft or unpublished one.
  4. The system updates its status and its availability to shoppers (SEL-BR-003).
- **Alternative flows:**
  - `3a.` The seller deletes a listing: after confirmation, the listing and all its deals are removed
    (SEL-BR-007).
  - `4a.` An unpublished listing has a live deal: the deal pauses, and the seller is told why
    (SEL-BR-017).
- **Postconditions:** Each listing's status matches the seller's intent and its stock.
- **Commands:** `SellerCentral.UpdateListing`, `SellerCentral.PublishListing`, `SellerCentral.UnpublishListing`, `SellerCentral.DeleteListing`
- **Rules:** SEL-BR-001, SEL-BR-002, SEL-BR-003, SEL-BR-007, SEL-BR-017
- **Status:** implemented
- **Code:** `src/app/sell/(seller)/listings/page.tsx`, `src/app/sell/(seller)/listings/[id]/edit/page.tsx`, `src/components/seller/SellerListingsView.tsx`
- **Source:** P21

### SEL-UC-03 Run a deal on a listing
- **Actor:** ACT-SELLER
- **Goal:** Sell more of a listing by discounting it for a limited time and number of units.
- **Trigger:** The seller creates a deal.
- **Preconditions:** The seller has an `Active` listing (SEL-BR-022).
- **Main flow:**
  1. The seller picks the listing, and sets the discount, the deal units and the dates.
  2. The system checks the deal (SEL-BR-010 to SEL-BR-014) and shows the deal price (SEL-BR-015).
  3. The system saves the deal as `Scheduled` or `Live`, from its dates (SEL-BR-016).
  4. While the deal runs, shoppers see and pay the deal price for up to the remaining units
     (SEL-BR-019, SEL-BR-020).
- **Alternative flows:**
  - `2a.` The dates overlap another deal on the listing: the seller is told the other deal's dates
    (SEL-BR-014).
  - `2b.` More units than in stock: the seller is told the stock.
  - `4a.` All deal units are claimed: the deal pauses and the normal price applies (SEL-BR-017).
- **Postconditions:** The deal exists and prices the listing while it runs.
- **Commands:** `SellerCentral.CreateDeal`
- **Rules:** SEL-BR-010, SEL-BR-011, SEL-BR-013, SEL-BR-014, SEL-BR-015, SEL-BR-016, SEL-BR-017,
  SEL-BR-019, SEL-BR-020, SEL-BR-022
- **Flows:** FLOW-04
- **Status:** implemented
- **Code:** `src/app/sell/(seller)/deals/new/page.tsx`, `src/components/seller/DealEditor.tsx`
- **Source:** P10

### SEL-UC-04 Manage deals
- **Actor:** ACT-SELLER
- **Goal:** Adjust, start or stop deals as trading requires.
- **Trigger:** The seller opens their deals.
- **Preconditions:** The seller has deals.
- **Main flow:**
  1. The system lists the deals with their status, units claimed, and why any live deal is paused
     (SEL-BR-016, SEL-BR-017).
  2. The seller edits a deal. The units cannot go below those claimed (SEL-BR-012).
  3. The seller starts a scheduled deal early, or ends a running one.
  4. The system moves the start date to today (SEL-BR-021), or ends the deal for good (SEL-BR-023).
- **Alternative flows:**
  - `3a.` Starting now would overlap another deal: refused, with the other deal's dates (SEL-BR-021).
  - `3b.` The seller removes a deal: after confirmation, it is deleted.
- **Postconditions:** Deal statuses and the prices shoppers pay agree.
- **Commands:** `SellerCentral.UpdateDeal`, `SellerCentral.StartDealEarly`, `SellerCentral.EndDeal`, `SellerCentral.DeleteDeal`
- **Rules:** SEL-BR-012, SEL-BR-016, SEL-BR-017, SEL-BR-021, SEL-BR-023
- **Status:** implemented
- **Code:** `src/app/sell/(seller)/deals/page.tsx`, `src/app/sell/(seller)/deals/[id]/edit/page.tsx`, `src/components/seller/SellerDealsView.tsx`
- **Source:** P17

### SEL-UC-05 Fulfil orders
- **Actor:** ACT-SELLER
- **Goal:** Get every sold item to its buyer.
- **Trigger:** A shopper buys one of the seller's listings (FLOW-02).
- **Preconditions:** A seller order is `New`.
- **Main flow:**
  1. The system records the sale as a `New` seller order, with the buyer's name and city only
     (SEL-BR-025).
  2. The seller sends the item and confirms dispatch.
  3. The seller confirms delivery.
- **Alternative flows:**
  - `2a.` (not built) The seller cannot fulfil the order: the BRD lets them cancel a `New` order with a
    reason (SEL-BR-024).
- **Postconditions:** The seller order is `Delivered`.
- **Commands:** `SellerCentral.RecordSale`, `SellerCentral.DispatchSellerOrder`, `SellerCentral.MarkSellerOrderDelivered`
- **Rules:** SEL-BR-024, SEL-BR-025
- **Flows:** FLOW-02
- **Status:** partial
- **Code:** `src/app/sell/(seller)/orders/page.tsx`, `src/components/seller/SellerOrdersView.tsx`
- **Source:** P11

### SEL-UC-06 See how the business is doing
- **Actor:** ACT-SELLER
- **Goal:** Know the listings that need attention, what has sold, and what the seller will be paid.
- **Trigger:** The seller opens their dashboard.
- **Preconditions:** none beyond approval
- **Main flow:**
  1. The seller opens the dashboard.
  2. The system shows the listings by status, units sold, revenue, estimated payout, and the number of
     listings with a running deal (SEL-BR-026).
- **Alternative flows:**
  - `2a.` (not built) Payout statements, the fee schedule per department, and the payout account (BRD
    P27, P28).
- **Postconditions:** none
- **Commands:** none (read-only); reads `SellerCentral.SellerSummary`
- **Rules:** SEL-BR-026
- **Status:** partial
- **Code:** `src/app/sell/(seller)/dashboard/page.tsx`, `src/components/seller/SellerDashboardView.tsx`
- **Source:** P11, P28
