---
id: SellerCentral.rules
type: business-rules
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 sections 8.9 (seller listings), 8.10 (seller deals), 8.12 (seller orders, earnings, payouts)
---

# SellerCentral — business rules

## Listings

### SEL-BR-001 Required listing details
- **Statement:** A listing needs a title, a brand, a selling price above 0, units in stock of 0 or more,
  a summary of at most 160 characters and a full description. A "was" price, when given, must be higher
  than the selling price.
- **Kind:** validation
- **Applies to:** `SellerCentral.SellerListing`
- **Status:** partial
- **Code:** `src/components/seller/ListingEditor.tsx` (`validateStep`)
- **Source:** BR-SLS-001
- **Notes:** Stock is not checked to be a whole number. The 160-character limit is enforced by the input
  field, not by validation.

### SEL-BR-002 Status after saving
- **Statement:** A listing saved as a draft is `Draft`. Otherwise it is `Out of stock` when its stock is
  0, and `Active` when it has stock. That includes a previously `Unpublished` or `Out of stock` listing
  being published again.
- **Kind:** derivation
- **Applies to:** `SellerCentral.SellerListing`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (`resolveStatus`), `src/components/seller/SellerListingsView.tsx`
- **Source:** BR-SLS-002

### SEL-BR-003 Only Active listings are sold
- **Statement:** Shoppers can buy only `Active` listings. `Out of stock` and `Unpublished` listings are
  shown as unavailable, with 0 units. `Draft` listings are never shown to shoppers.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerListing`, `SellerCentral.StorefrontProduct`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`toStorefrontProduct`), `src/context/SellerProvider.tsx` (`getStorefrontProduct`, `storefrontProducts`)
- **Source:** BR-SLS-003

### SEL-BR-004 Listing conditions
- **Statement:** A listing's condition is one of New, Renewed, Used – like new or Used – good. Any
  condition other than New is shown to shoppers.
- **Kind:** validation
- **Applies to:** `SellerCentral.ListingCondition`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`LISTING_CONDITIONS`, `toStorefrontProduct`)
- **Source:** BR-SLS-004

### SEL-BR-005 A sale reduces stock
- **Statement:** When a sale is recorded, the listing's stock drops by the quantity sold, never below 0.
  An `Active` listing that reaches 0 becomes `Out of stock`.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerListing`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (reducer case `recordSale`)
- **Source:** BR-SLS-005

### SEL-BR-006 Listing images
- **Statement:** A listing has up to six images, each at most 8 MB. The first is the cover. A listing may
  have none.
- **Kind:** validation
- **Applies to:** `SellerCentral.ListingImages`
- **Status:** partial
- **Code:** `src/components/seller/ImageUploadField.tsx`
- **Source:** BR-SLS-006
- **Notes:** The BRD allows JPEG, PNG and WebP only; the code accepts any image type. Images are
  downscaled and re-encoded as JPEG before storing, which meets NFR-PRF-004.

### SEL-BR-007 Deleting a listing deletes its deals
- **Statement:** When a listing is deleted, every deal on it is deleted too.
- **Kind:** policy
- **Applies to:** `SellerCentral.SellerListing`, `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (reducer case `delete`)
- **Source:** BR-SLS-007

### SEL-BR-008 New listings have no ratings or keywords
- **Statement:** A listing reaches the storefront with no rating, no rating count and no search keywords.
- **Kind:** derivation
- **Applies to:** `SellerCentral.StorefrontProduct`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`toStorefrontProduct`)
- **Source:** BR-SLS-008

### SEL-BR-009 Reference formats
- **Statement:** Listings are referenced `SL-NNNNN`, deals `SD-NNNNN` and seller orders `SO-NNNNN`.
- **Kind:** constraint
- **Applies to:** `SellerCentral.SellerReference`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (`makeId`)
- **Source:** BR-SLS-010, BR-SDL-013, BR-SOR-006
- **Notes:** The number is random and not checked for uniqueness. Seed data uses four digits
  (`SL-4820`).

## Deals

### SEL-BR-010 Discount between 5% and 70%
- **Statement:** A deal's discount is from 5% to 70% inclusive, stored as a whole percentage.
- **Kind:** validation
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`DEAL_MIN_PERCENT`, `DEAL_MAX_PERCENT`), `src/components/seller/DealEditor.tsx` (`validate`)
- **Source:** BR-SDL-001
- **Notes:** The range is checked before rounding (see SEL-Q-02).

### SEL-BR-011 Deal units within listing stock
- **Statement:** A deal has at least 1 unit and no more units than the listing has in stock.
- **Kind:** validation
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/components/seller/DealEditor.tsx` (`validate`)
- **Source:** BR-SDL-002

### SEL-BR-012 Deal units never below units claimed
- **Statement:** Editing a deal cannot set its units below the units already claimed.
- **Kind:** validation
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/components/seller/DealEditor.tsx` (`validate`)
- **Source:** BR-SDL-003

### SEL-BR-013 Valid deal window
- **Statement:** A deal needs a start and an end date. The end must be after the start and not before
  today.
- **Kind:** validation
- **Applies to:** `SellerCentral.DealWindow`
- **Status:** implemented
- **Code:** `src/components/seller/DealEditor.tsx` (`validate`)
- **Source:** BR-SDL-004

### SEL-BR-014 No overlapping deals on a listing
- **Statement:** Two deals on the same listing that have not ended cannot have overlapping dates. Both
  ends count, so a deal ending on the day another starts overlaps it.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`findOverlappingDeal`)
- **Source:** BR-SDL-005

### SEL-BR-015 Deal price
- **Statement:** The deal price is the listing's normal price × (1 − discount ÷ 100), rounded to the cent.
- **Kind:** derivation
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`sellerDealPrice`)
- **Source:** BR-SDL-006

### SEL-BR-016 Deal status follows its dates
- **Statement:** Whenever a deal is read, its status is `Ended` if the seller ended it or its end date
  has passed, `Scheduled` if its start date is after today, and `Live` otherwise.
- **Kind:** derivation
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`resolveDealStatus`), `src/context/SellerProvider.tsx` (`storedDealStatus`, `deals`)
- **Source:** BR-SDL-007

### SEL-BR-017 When a deal is running
- **Statement:** A deal is running, and shoppers get its price, only while it is `Live`, its listing is
  `Active`, and it has deal units left. A `Live` deal that is not running is paused, and the seller is
  told why.
- **Kind:** derivation
- **Applies to:** `SellerCentral.RunningDeal`, `SellerCentral.DealPausedReason`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`isDealRunning`, `dealPausedReason`)
- **Source:** BR-SDL-008

### SEL-BR-018 One running deal per listing
- **Statement:** At most one deal prices a listing at a time. If older data holds two running deals, the
  first one found is used everywhere: storefront, basket and seller figures.
- **Kind:** invariant
- **Applies to:** `SellerCentral.RunningDeal`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`runningDealFor`)
- **Source:** BR-SDL-005

### SEL-BR-019 Storefront price and units while a deal runs
- **Statement:** While a deal runs on a listing, shoppers see the deal price as the price and the normal
  price as the "was" price. The units offered are the lower of the listing's stock and the deal units
  left, and the badge reads "N% off deal".
- **Kind:** derivation
- **Applies to:** `SellerCentral.StorefrontProduct`
- **Status:** implemented
- **Code:** `src/data/seller.ts` (`toStorefrontProduct`)
- **Source:** BR-SDL-014, BR-CRT-002

### SEL-BR-020 Claims are counted and capped
- **Statement:** Units sold while a deal is running are added to its claimed units, never beyond its deal
  units. Once every deal unit is claimed, the listing sells at its normal price.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (reducer case `recordSale`)
- **Source:** BR-SDL-009

### SEL-BR-021 Starting a deal early
- **Statement:** Starting a scheduled deal early moves its start date to today, so its dates and status
  agree. It is refused if starting today would overlap another deal on the listing.
- **Kind:** policy
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (reducer case `setDealStatus`), `src/components/seller/SellerDealsView.tsx`
- **Source:** BR-SDL-010

### SEL-BR-022 Deals only on Active listings
- **Statement:** A new deal can be created only on a listing that is `Active`.
- **Kind:** validation
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/components/seller/DealEditor.tsx` (choice of listings)
- **Source:** BR-SDL-012

### SEL-BR-023 An ended deal stays ended
- **Statement:** A deal the seller ended stays `Ended`, even after later edits.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerDeal`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (`storedDealStatus`)
- **Source:** BR-SDL-011

## Seller orders and earnings

### SEL-BR-024 Seller order transitions
- **Statement:** A seller moves an order from `New` to `Dispatched`, from `Dispatched` to `Delivered`,
  and from `New` to `Cancelled`. No other transition is allowed.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerOrder`
- **Status:** partial
- **Code:** `src/components/seller/SellerOrdersView.tsx`, `src/context/SellerProvider.tsx` (reducer case `setOrderStatus`)
- **Source:** BR-SOR-001
- **Notes:** The seller cannot cancel a `New` order; `Cancelled` appears only in sample data. The store
  accepts any status, so only the UI enforces the transitions.

### SEL-BR-025 A seller order records the sale as it was
- **Statement:** A recorded sale creates a `New` seller order dated today. It holds the unit price the
  shopper paid (including any deal) and gives the seller only the buyer's name and city.
- **Kind:** invariant
- **Applies to:** `SellerCentral.SellerOrder`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (`recordSale`)
- **Source:** BR-SOR-005, BR-SOR-006, NFR-SEC-003

### SEL-BR-026 Revenue, units sold and estimated payout
- **Statement:** Revenue is the sum of unit price × quantity over seller orders that are not cancelled.
  Units sold is the sum of their quantities. Estimated payout is revenue less a 12% referral fee.
- **Kind:** derivation
- **Applies to:** `SellerCentral.SellerSummary`
- **Status:** partial
- **Code:** `src/data/seller.ts` (`summariseSeller`, `SELLER_REFERRAL_FEE`)
- **Source:** BR-SOR-002, BR-SOR-003, BR-SOR-004, BR-SPY-001
- **Notes:** The BRD requires referral fees per department from a fee schedule (default 12%), charged on
  delivered orders, with accepted returns deducted. None of that exists.

## Storefront

### SEL-BR-027 Listings reach shoppers only while the seller is approved
- **Statement:** A seller's listings and deals are in the storefront only while the seller's own
  application is `Approved`. Shoppers see them sold by the seller's business name. When approval is
  withdrawn, they disappear at once, including from baskets.
- **Kind:** policy
- **Applies to:** `SellerCentral.StorefrontProducts`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (`sellerName`, `storefrontProducts`, `getStorefrontProduct`)
- **Source:** BR-SAP-004

### SEL-BR-028 Sellers cannot buy their own listings
- **Statement:** Checkout refuses an order in which a seller buys one of their own listings.
- **Kind:** validation
- **Applies to:** `SellerCentral.RecordSale`
- **Status:** not-implemented
- **Code:** —
- **Source:** BRD v3.0 section 8.14 (validation outcome "Seller buying their own listing")
- **Notes:** In the demo, the only seller is the signed-in shopper, so every marketplace purchase is a
  seller buying their own listing.

### SEL-BR-029 A change is kept only if it can be saved
- **Statement:** A change to listings, deals or seller orders is applied only after it has been saved.
  If it cannot be saved, nothing changes, and the seller is told so with their entries kept.
- **Kind:** constraint
- **Applies to:** `SellerCentral.SellerListing`, `SellerCentral.SellerDeal`, `SellerCentral.SellerOrder`
- **Status:** implemented
- **Code:** `src/context/SellerProvider.tsx` (`commit`, `STORAGE_BUDGET`)
- **Source:** NFR-REL-003 (replaces BR-SLS-009)
- **Notes:** As-built, "saved" means written to `localStorage` within a 4,000,000-character budget.
