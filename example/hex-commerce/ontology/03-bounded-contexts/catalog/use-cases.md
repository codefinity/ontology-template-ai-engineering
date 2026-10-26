---
id: Catalog.use-cases
type: use-cases
context: Catalog
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P01 (discover products), P29 (store deals)
---

# Catalog — use cases

### CAT-UC-01 Find a product by searching
- **Actor:** ACT-SHOPPER
- **Goal:** Find products that match what the shopper has in mind.
- **Trigger:** The shopper types words into search.
- **Preconditions:** none
- **Main flow:**
  1. The shopper types at least two characters.
  2. The system suggests matching titles, brands and keywords (CAT-BR-013).
  3. The shopper submits the search, optionally limited to one department.
  4. The system lists catalogue products that match every word, best match first (CAT-BR-005,
     CAT-BR-006), then the matching seller listings on sale (CAT-BR-012).
  5. The shopper narrows the list with facets and a sort order, and opens a product (CAT-UC-03).
- **Alternative flows:**
  - `4a.` Nothing matches: the system says so and offers the departments to browse instead. The use
    case ends.
  - `5a.` The shopper chooses a sort order other than Featured: relevance order is replaced (CAT-BR-006).
- **Postconditions:** none; nothing changes
- **Commands:** none (read-only); reads `Catalog.SearchSuggestions`, `Catalog.SearchResults`,
  `Catalog.FilteredResults`, `Catalog.MarketplaceResults`
- **Rules:** CAT-BR-005, CAT-BR-006, CAT-BR-007, CAT-BR-012, CAT-BR-013
- **Flows:** FLOW-01
- **Status:** implemented
- **Code:** `src/app/search/page.tsx`, `src/components/layout/SearchBar.tsx`
- **Source:** P01

### CAT-UC-02 Browse a department
- **Actor:** ACT-SHOPPER
- **Goal:** See what the store offers in one department, narrowed to what suits the shopper.
- **Trigger:** The shopper opens a department.
- **Preconditions:** none
- **Main flow:**
  1. The shopper opens a department.
  2. The system lists its products in Featured order: badged products first, then by popularity
     (CAT-BR-004), with the seller listings that belong to the department (CAT-BR-012).
  3. The shopper filters by subcategory, brand, price band, rating, in-stock or on-sale (CAT-BR-007,
     CAT-BR-002), and sorts.
  4. The system shows the matching products a page at a time.
- **Alternative flows:**
  - `3a.` The shopper sorts by newest arrivals: catalogue order is reversed, because products carry no
    publish date (CAT-BR-009, partial).
  - `4a.` No product matches the facets: the system says so and offers to clear the filters.
- **Postconditions:** none; the filtered view can be shared as a link
- **Commands:** none (read-only); reads `Catalog.FilteredResults`, `Catalog.MarketplaceResults`
- **Rules:** CAT-BR-002, CAT-BR-004, CAT-BR-007, CAT-BR-009, CAT-BR-012
- **Flows:** FLOW-01
- **Status:** implemented
- **Code:** `src/app/category/[slug]/page.tsx`, `src/components/catalog/FilterSidebar.tsx`
- **Source:** P01

### CAT-UC-03 Weigh up a product
- **Actor:** ACT-SHOPPER
- **Goal:** Decide whether to buy a product.
- **Trigger:** The shopper opens a product or a seller listing.
- **Preconditions:** none
- **Main flow:**
  1. The shopper opens a product.
  2. The system shows its price, any list price and discount (CAT-BR-001), stock level (CAT-BR-010),
     the delivery terms for the item (CAT-BR-011), features and specifications.
  3. The system shows customer reviews and the rating summary (`Reviews.RatingSummary`), and related
     products (CAT-BR-008).
  4. The shopper adds the product to the basket (SHP-UC-01), to the wish list (SHP-UC-04), or leaves.
- **Alternative flows:**
  - `2a.` The product is a seller listing: the system also names the seller, and shows a condition
    other than New (SEL-BR-004) and any running deal price (SEL-BR-019). It shows no reviews.
  - `2b.` The product is unavailable: the system says so and offers no quantity to add.
- **Postconditions:** none
- **Commands:** none (read-only); reads `Catalog.ProductLookup`, `Catalog.RelatedProducts`,
  `SellerCentral.StorefrontProduct`
- **Rules:** CAT-BR-001, CAT-BR-008, CAT-BR-010, CAT-BR-011, SEL-BR-004, SEL-BR-019
- **Status:** implemented
- **Code:** `src/app/product/[slug]/page.tsx`, `src/app/listing/[id]/page.tsx`, `src/components/product/BuyBox.tsx`
- **Source:** P01

### CAT-UC-04 Shop today's deals
- **Actor:** ACT-SHOPPER
- **Goal:** Find discounted items before the offers end.
- **Trigger:** The shopper opens the deals page or a deals rail.
- **Preconditions:** none
- **Main flow:**
  1. The shopper opens the deals.
  2. The system lists the store deals with their percentage off, the share already claimed and the time
     left (`Catalog.DealsList`).
  3. The system lists the seller deals that are running, at their deal price (`SellerCentral.StorefrontDeals`).
  4. The shopper opens a deal's product (CAT-UC-03).
- **Alternative flows:**
  - `2a.` (not built) A store deal's time or units run out: the BRD expects it to end and the normal
    price to apply. As-built, the store deal is advertised only and never ends (CAT-BR-014).
- **Postconditions:** none
- **Commands:** none (read-only)
- **Rules:** CAT-BR-014, SEL-BR-017, SEL-BR-019
- **Flows:** FLOW-04
- **Status:** partial
- **Code:** `src/app/deals/page.tsx`, `src/components/deals/SellerDealsSection.tsx`
- **Source:** P01, P29
