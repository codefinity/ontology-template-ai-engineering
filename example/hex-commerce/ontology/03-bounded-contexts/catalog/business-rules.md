---
id: Catalog.rules
type: business-rules
context: Catalog
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 8.1 (pricing), 8.2 (stock), 8.3 (catalogue)
---

# Catalog — business rules

## Pricing and stock

### CAT-BR-001 Discount percentage
- **Statement:** A product's discount is ((list price − price) ÷ list price) × 100, rounded to the
  nearest whole number. It is 0 when there is no list price or the list price is not higher than the price.
- **Kind:** derivation
- **Applies to:** `Catalog.Product`
- **Status:** implemented
- **Code:** `src/lib/format.ts` (`discountPercent`)
- **Source:** BR-PRC-001

### CAT-BR-002 On sale means the list price is higher
- **Statement:** A product is on sale when, and only when, it has a list price higher than its price.
- **Kind:** invariant
- **Applies to:** `Catalog.Product`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`filterProducts` on-sale facet, `getTopDiscounted`)
- **Source:** BR-CAT-002

### CAT-BR-010 Stock level shown to shoppers
- **Statement:** 0 units is unavailable; 1 to 10 units is low stock and the number left is shown; more
  than 10 is in stock.
- **Kind:** derivation
- **Applies to:** `Catalog.StockLevel`
- **Status:** implemented
- **Code:** `src/components/ui/Badge.tsx` (`StockStatus`)
- **Source:** BR-STK-001

### CAT-BR-011 Free delivery message for a single item
- **Statement:** An item is described as delivered free when its own price is at or above the
  free-delivery threshold. Otherwise the delivery fee and the threshold are stated.
- **Kind:** derivation
- **Applies to:** `Catalog.Product`
- **Status:** implemented
- **Code:** `src/components/product/BuyBox.tsx` (`freeDelivery`)
- **Source:** BR-PRC-008
- **Notes:** This is a message only. What is charged depends on the basket subtotal (SHP-BR-010).

### CAT-BR-014 A store deal is advertised, not priced
- **Statement:** A store deal's percentage off, claimed share and countdown are shown to shoppers, but
  the price charged is the product's own price. Nothing stops the deal when its time or units run out.
- **Kind:** constraint
- **Applies to:** `Catalog.StoreDeal`
- **Status:** partial
- **Code:** `src/data/marketing.ts` (`deals`), `src/app/deals/page.tsx`
- **Source:** BR-STD-004, BR-STD-005
- **Notes:** The BRD requires the deal price to be product price × (1 − discount ÷ 100), a running
  window, and claimed units counted as they sell. None of that is built. Compare SEL-BR-015 to
  SEL-BR-020, which do exactly this for seller deals.

## Ranking

### CAT-BR-003 Popularity score
- **Statement:** Popularity is average rating × log10(rating count + 10). Best sellers are the products
  with the highest popularity.
- **Kind:** derivation
- **Applies to:** `Catalog.BestSellers`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`getBestSellers`, `applySort`)
- **Source:** BR-CAT-001

### CAT-BR-004 Featured order
- **Statement:** The Featured order lists badged products first, then orders by popularity (CAT-BR-003).
- **Kind:** derivation
- **Applies to:** `Catalog.SortOrder`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`applySort`, case `featured`)
- **Source:** BR-CAT-001

### CAT-BR-009 Newest arrivals
- **Statement:** Newest arrivals are ordered by the date each product was first published, most recent
  first.
- **Kind:** derivation
- **Applies to:** `Catalog.SortOrder`
- **Status:** partial
- **Code:** `src/lib/catalog.ts` (`applySort`, case `newest`)
- **Source:** BR-CAT-004
- **Notes:** Products have no publish date, so the code reverses catalogue order as a stand-in.

### CAT-BR-016 Top discounts
- **Statement:** The top-discount selection holds on-sale products, ordered by the share taken off the
  list price, largest first.
- **Kind:** derivation
- **Applies to:** `Catalog.TopDiscounted`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`getTopDiscounted`)
- **Source:** hex-commerce-source-ui (not in the BRD)

### CAT-BR-008 Related products
- **Statement:** A product's related products are the other products of its subcategory, then the rest of
  its department, never the product itself, at most eight.
- **Kind:** derivation
- **Applies to:** `Catalog.RelatedProducts`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`getRelatedProducts`)
- **Source:** BR-CAT-005

## Search and filters

### CAT-BR-005 Every search word must match
- **Statement:** A product matches a search only when every word of the query appears in its title,
  brand, summary, search keywords or department slug. Matching ignores case.
- **Kind:** derivation
- **Applies to:** `Catalog.SearchResults`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`searchProducts`)
- **Source:** FR-CAT (BRD v3.0)
- **Notes:** The subcategory adds to the relevance score but is not in the text every word must match
  (see CAT-Q-02 in the README).

### CAT-BR-006 Search relevance
- **Statement:** Each query word scores 10 for the title, 6 for the brand, 4 for search keywords, 3 each
  for department and subcategory, and 2 for the summary. Results are ordered by score, then by rating.
  This order is kept unless the shopper picks a sort order other than Featured.
- **Kind:** derivation
- **Applies to:** `Catalog.SearchResults`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`scoreMatch`, `searchProducts`, `filterProducts`)
- **Source:** hex-commerce-source-ui (the BRD leaves relevance to design)

### CAT-BR-013 Search suggestions
- **Statement:** Once at least two characters are typed, suggestions are the product titles, brands and
  search keywords that contain the text, at most eight.
- **Kind:** derivation
- **Applies to:** `Catalog.SearchSuggestions`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`getSearchSuggestions`)
- **Source:** FR-CAT (BRD v3.0)
- **Notes:** Suggestions come from catalogue products only, not seller listings.

### CAT-BR-007 Price filters include both bounds
- **Statement:** A price filter keeps products whose price is at or above the minimum and at or below the
  maximum.
- **Kind:** derivation
- **Applies to:** `Catalog.CatalogFilters`
- **Status:** implemented
- **Code:** `src/lib/catalog.ts` (`filterProducts`)
- **Source:** BR-CAT-003
- **Notes:** A product priced exactly 50 appears in both the 25–50 and the 50–100 bands.

### CAT-BR-012 Seller listings are found with the same facets
- **Statement:** A search or department view also lists the seller listings on sale that match the same
  facets and sort order, shown as their own group after the catalogue results.
- **Kind:** policy
- **Applies to:** `Catalog.MarketplaceResults`
- **Status:** implemented
- **Code:** `src/components/catalog/MarketplaceResults.tsx`
- **Source:** FR-CAT (BRD v3.0: "results including marketplace listings")

## Taxonomy

### CAT-BR-015 A product's subcategory belongs to its department
- **Statement:** When a product or listing has a subcategory, the subcategory is one of its department's
  subcategories.
- **Kind:** invariant
- **Applies to:** `Catalog.Product`, `Catalog.Department`
- **Status:** partial
- **Code:** `src/data/categories.ts`, `src/components/seller/ListingEditor.tsx`
- **Source:** BRD v3.0 data dictionary (Listing: sub-department)
- **Notes:** It holds in the catalogue data, and the listing editor offers only the chosen department's
  subcategories. No code checks it.
