---
id: SellerCentral.value-objects
type: value-objects
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
---

# SellerCentral — value objects

### ListingCondition

- **Meaning:** The state a listed item is sold in.
- **Attributes:** value — New, Renewed, Used – like new, Used – good
- **Constraints:** SEL-BR-004
- **Equality:** by value
- **Used by:** `SellerCentral.SellerListing`
- **Code:** `src/lib/types.ts` (`ListingCondition`), `src/data/seller.ts` (`LISTING_CONDITIONS`)

### ListingImages

- **Meaning:** The photos of a listing, in order. The first is the cover.
- **Attributes:** ordered list of images (stored as compressed JPEG data URLs)
- **Constraints:** SEL-BR-006. An empty list falls back to generated artwork.
- **Equality:** by the list
- **Used by:** `SellerCentral.SellerListing`
- **Code:** `src/components/seller/ImageUploadField.tsx` (`MAX_IMAGES`, `MAX_FILE_BYTES`)

### DealWindow

- **Meaning:** The dates a deal runs, both inclusive.
- **Attributes:** startsOn (date), endsOn (date)
- **Constraints:** SEL-BR-013, SEL-BR-014. A new deal defaults to today until today + 7 days.
- **Equality:** by both dates
- **Used by:** `SellerCentral.SellerDeal`
- **Code:** `src/lib/types.ts` (`SellerDeal.startsOn`, `SellerDeal.endsOn`)

### SaleLine

- **Meaning:** One marketplace line of a shopper's order, as Ordering hands it over to be recorded.
  It is the contract of REL-09.
- **Attributes:** listingId, quantity, unitPrice (what the shopper paid per unit)
- **Constraints:** quantity ≥ 1
- **Equality:** by all attributes
- **Used by:** `SellerCentral.RecordSale`
- **Code:** `src/context/SellerProvider.tsx` (`SaleLine`)

### SellerReference

- **Meaning:** The human-readable reference of a listing, deal or seller order.
- **Attributes:** prefix (`SL`, `SD`, `SO`), five digits
- **Constraints:** SEL-BR-009
- **Equality:** by value
- **Used by:** `SellerCentral.SellerListing`, `SellerCentral.SellerDeal`, `SellerCentral.SellerOrder`
- **Code:** `src/context/SellerProvider.tsx` (`makeId`)
