---
id: Catalog.language
type: ubiquitous-language
context: Catalog
status: implemented
last_reviewed: 2026-10-27
---

# Catalog — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Badge | A merchandising label on a product: Best Seller, Deal of the Day or Hex Choice. | `Product.badge` | tag (a tag is a search keyword) | `Catalog.Badge` |
| Department | One of the eight top-level groupings of products. | `Category`, `category` | category (in conversation) | `Catalog.Department` |
| Facet | One dimension shoppers can filter on: subcategory, brand, price band, rating, stock, on sale. | `CatalogFilters` fields | | `Catalog.CatalogFilters` |
| List price | The manufacturer's "was" price. Present only when the product is discounted. | `listPrice` | RRP, original price | `Catalog.Product` |
| Popularity score | Average rating × log10(rating count + 10). Ranks best sellers. | inline in `getBestSellers`, `applySort` | | `Catalog.BestSellers` |
| Price | The current selling price of a product. | `price` | sale price | `Catalog.Product` |
| Price band | A price range offered as a filter, such as "25 to 50". | `PRICE_BANDS` | | `Catalog.PriceBand` |
| Product | Something shoppers can buy in the storefront. A catalogue product, or a seller listing published in the same shape. | `Product` | item (too vague), SKU | `Catalog.Product` |
| Related products | Other products from the same subcategory, then the same department. | `getRelatedProducts` | recommendations | `Catalog.RelatedProducts` |
| Search keyword | A word a product should be found by that is not already in its title. | `tags` | tag (alone), label | `Catalog.Product` |
| Sort order | How a result list is ordered: Featured, price up/down, rating, review count, newest. | `SortKey` | | `Catalog.SortOrder` |
| Specification | A key/value row of technical details. | `specs` | | `Catalog.Product` |
| Stock | Units on hand. 0 means unavailable. | `stock` | inventory | `Catalog.Product` |
| Store deal | A store-run, time-limited discount on one catalogue product, with a share already claimed. | `Deal` | lightning deal (UI copy only), seller deal | `Catalog.StoreDeal` |
| Subcategory | A narrower grouping inside one department, such as Audio in Electronics. | `subcategories`, `subcategory` | sub-department (BRD) | `Catalog.Subcategory` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Browse a department | List the products of one department, optionally narrowed by facets. | `getProductsByCategory`, `filterProducts` | | `Catalog.FilteredResults` |
| Filter | Narrow a result list by one or more facets. | `filterProducts` | | `Catalog.FilteredResults` |
| Search | Find products whose text matches every word of a query. | `searchProducts` | | `Catalog.SearchResults` |
| Suggest | Offer completions while the shopper types. | `getSearchSuggestions` | autocomplete | `Catalog.SearchSuggestions` |

## States and statuses

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| In stock | More than 10 units on hand. | `StockStatus` | | `Catalog.StockLevel` |
| Low stock | 1 to 10 units on hand; the count is shown. | `StockStatus` | | `Catalog.StockLevel` |
| On sale | The list price is higher than the price. | `listPrice > price` | discounted (fine as a synonym in prose) | `Catalog.Product` |
| Unavailable | No units on hand. | `stock === 0` | out of stock (that is a seller listing status) | `Catalog.StockLevel` |
