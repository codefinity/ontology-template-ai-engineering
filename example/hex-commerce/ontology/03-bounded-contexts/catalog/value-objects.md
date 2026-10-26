---
id: Catalog.value-objects
type: value-objects
context: Catalog
status: implemented
last_reviewed: 2026-10-27
---

# Catalog — value objects

### Badge

- **Meaning:** A merchandising label that lifts a product in the Featured order.
- **Attributes:** label (text)
- **Constraints:** On catalogue products, one of Best Seller, Deal of the Day or Hex Choice. On seller
  listings, `"<N>% off deal"` or the listing condition (see `SellerCentral.StorefrontProduct`).
- **Equality:** by label
- **Used by:** `Catalog.Product`
- **Code:** `src/lib/types.ts` (`Product.badge`)

### StockLevel

- **Meaning:** How available a product is, as told to shoppers.
- **Attributes:** level (unavailable | low | in stock), units (for low)
- **Constraints:** CAT-BR-010
- **Equality:** by level and units
- **Used by:** `Catalog.Product`
- **Code:** `src/components/ui/Badge.tsx` (`StockStatus`)

### CatalogFilters

- **Meaning:** The facets and sort order that define a result list. It is held in the page URL, so any
  filtered view can be shared.
- **Attributes:** department, subcategory, query, brands, minimum price, maximum price, minimum rating,
  in stock only, on sale only, `Catalog.SortOrder`
- **Constraints:** CAT-BR-007. An unknown sort order falls back to Featured.
- **Equality:** by all attributes
- **Used by:** `Catalog.FilteredResults`, `Catalog.MarketplaceResults`
- **Code:** `src/lib/catalog.ts` (`CatalogFilters`), `src/lib/searchParams.ts` (`parseFilters`)

### SortOrder

- **Meaning:** How a result list is ordered.
- **Attributes:** key — `featured`, `price-asc`, `price-desc`, `rating`, `reviews`, `newest`
- **Constraints:** Featured follows CAT-BR-004, rating breaks ties by rating count, newest follows CAT-BR-009
- **Equality:** by key
- **Used by:** `Catalog.CatalogFilters`
- **Code:** `src/lib/catalog.ts` (`SortKey`, `SORT_OPTIONS`, `applySort`)

### PriceBand

- **Meaning:** A price range offered as a filter.
- **Attributes:** label, minimum (optional), maximum (optional)
- **Constraints:** Under 25; 25–50; 50–100; 100–200; 200–500; 500 and above. Both bounds are inclusive
  (CAT-BR-007).
- **Equality:** by bounds
- **Used by:** `Catalog.CatalogFilters`
- **Code:** `src/lib/catalog.ts` (`PRICE_BANDS`)
