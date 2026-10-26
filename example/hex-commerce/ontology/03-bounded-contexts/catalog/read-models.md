---
id: Catalog.read-models
type: read-models
context: Catalog
status: implemented
last_reviewed: 2026-10-27
---

# Catalog — read models and queries

## Published to other contexts

### ProductLookup

- **Answers:** Which catalogue product has this id, or this slug?
- **Shape:** `Catalog.Product`, or nothing
- **Derived from:** `Catalog.Product`
- **Rules:** none
- **Consumers:** Shopping (resolves basket lines, REL-02), Ordering (prices of orders placed before
  prices were captured, REL-14), Reviews (REL-12)
- **Published:** yes (REL-02, REL-12, REL-14)
- **Code:** `src/lib/catalog.ts` (`getProductById`, `getProductBySlug`, `getProductsByIds`)

## Discovery

### SearchResults

- **Answers:** Which products match what the shopper typed, best match first?
- **Shape:** ordered list of `Catalog.Product`
- **Derived from:** `Catalog.Product`
- **Rules:** CAT-BR-005, CAT-BR-006
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`searchProducts`)

### FilteredResults

- **Answers:** Which products satisfy these facets, in this order, on this page?
- **Shape:** ordered list of `Catalog.Product`; a page holds 12, with the page number, page count and total
- **Derived from:** `Catalog.Product`, `Catalog.CatalogFilters`
- **Rules:** CAT-BR-002, CAT-BR-004, CAT-BR-007, CAT-BR-009
- **Consumers:** ACT-SHOPPER (department and search pages); brand facet counts come from the same list
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`filterProducts`, `paginate`, `getBrandFacets`)

### MarketplaceResults

- **Answers:** Which seller listings on sale match the shopper's current facets?
- **Shape:** ordered list of `Catalog.Product` with `seller` set
- **Derived from:** `SellerCentral.StorefrontProducts`, `Catalog.CatalogFilters`
- **Rules:** CAT-BR-012
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/components/catalog/MarketplaceResults.tsx`

### SearchSuggestions

- **Answers:** What might the shopper be typing?
- **Shape:** up to eight strings
- **Derived from:** `Catalog.Product`
- **Rules:** CAT-BR-013
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`getSearchSuggestions`)

## Curation

### BestSellers

- **Answers:** What are the most popular products?
- **Shape:** up to 12 `Catalog.Product`
- **Derived from:** `Catalog.Product`
- **Rules:** CAT-BR-003
- **Consumers:** ACT-SHOPPER (home page)
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`getBestSellers`)

### TopDiscounted

- **Answers:** Which products have the deepest discounts?
- **Shape:** up to 12 `Catalog.Product`
- **Derived from:** `Catalog.Product`
- **Rules:** CAT-BR-016
- **Consumers:** ACT-SHOPPER (home page)
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`getTopDiscounted`)

### RelatedProducts

- **Answers:** What else might a shopper looking at this product like?
- **Shape:** up to 8 `Catalog.Product`
- **Derived from:** `Catalog.Product`
- **Rules:** CAT-BR-008
- **Consumers:** ACT-SHOPPER (product page)
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`getRelatedProducts`)

### DealsList

- **Answers:** Which store deals are on, with their products?
- **Shape:** list of `Catalog.StoreDeal` joined with `Catalog.Product`. The deals page adds
  `SellerCentral.StorefrontDeals` as a separate group.
- **Derived from:** `Catalog.StoreDeal`
- **Rules:** CAT-BR-014
- **Consumers:** ACT-SHOPPER (deals page, home rails)
- **Published:** no
- **Code:** `src/lib/catalog.ts` (`getResolvedDeals`)

### HomeMerchandising

- **Answers:** What does the store promote on its home page?
- **Shape:** hero slides (eyebrow, title, body, call to action and its destination), and promotion tiles
  (title, destination, items)
- **Derived from:** sample merchandising content
- **Rules:** none
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/data/marketing.ts` (`heroSlides`, `promoTiles`)
