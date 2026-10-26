---
id: domain.glossary
type: glossary
status: implemented
last_reviewed: 2026-10-27
---

# Glossary

An index, not a dictionary. Definitions live in each context's `ubiquitous-language.md`. Use this page
to find which context owns a word, and where the same word means different things.

## Terms that differ between contexts

These words cause most integration mistakes. Always qualify them by context in code and conversation.

| Term | Context | Meaning there | Do not confuse with |
| --- | --- | --- | --- |
| Order | Ordering | The shopper's confirmed purchase of a whole basket (`Ordering.Order`) | *Seller order* in SellerCentral: one marketplace line, as the seller sees it (`SellerCentral.SellerOrder`) |
| Deal | Catalog | A store-run, advertised discount on a catalogue product; does not change the price (`Catalog.StoreDeal`) | *Deal* in SellerCentral: a seller-run discount that does set the price (`SellerCentral.SellerDeal`) |
| Product | Catalog | Anything sellable in the storefront, in the published shape (`Catalog.Product`) | *Listing* in SellerCentral: the seller's own record behind a storefront product (`SellerCentral.SellerListing`) |
| Item | Shopping | Whatever a basket line points at (`Shopping.PurchasableItem`) | *Ordered item* in CustomerService (`CustomerService.OrderedItem`) and *order item* in Ordering (`Ordering.OrderItem`) |
| List price / "was" price | Catalog / SellerCentral | Catalog: the manufacturer's price on a discounted product. SellerCentral: an optional higher reference price set by the seller. | Both become `listPrice` on `Catalog.Product`; while a seller deal runs, it is the listing's normal price |
| Out of stock | SellerCentral | A listing *status* (`'Out of stock'`) | *Unavailable* in Catalog: any product with 0 units (`Catalog.StockLevel`) |
| Live / running | SellerCentral | *Live* is a deal status from its dates; *running* means shoppers actually get the price | A Live deal may be *paused* (`SellerCentral.DealPausedReason`) |
| Active | SellerCentral | A listing on sale | *Live* (deals) and *Approved* (applications) |
| Status | everywhere | Each aggregate has its own status values | Never compare statuses across aggregates |
| Shipped / Dispatched | Ordering / SellerCentral | Ordering: an order status. SellerCentral: a seller-order status. Not linked as-built. | ORD-BR-013 |
| Address | Account | A saved delivery address (`Account.Address`) | *Registered address* in SellerOnboarding (`SellerOnboarding.RegisteredAddress`); *address snapshot* in Ordering (`Ordering.AddressSnapshot`) |
| Buyer / shopper / customer | SellerCentral / Account | *Buyer* is how a seller sees the shopper (name and city only); *shopper* is the signed-in customer | *Customer* is fine in prose, but avoid it in code |
| Basket / cart | Shopping | The business word is *basket*; the code and parts of the UI say *cart* | SHP-Q-01 |
| Department / category | Catalog | The business word is *department*; the code says `category` | |

## Index of terms

| Term | Owning context | Code identifier |
| --- | --- | --- |
| Acknowledgement | [CustomerService](../03-bounded-contexts/customer-service/ubiquitous-language.md) | `handleCreate` (second message) |
| Address, deliver to | [Account](../03-bounded-contexts/account/ubiquitous-language.md) | `Address`, `deliverToId` |
| Application, applicant | [SellerOnboarding](../03-bounded-contexts/seller-onboarding/ubiquitous-language.md) | `SellerApplication` |
| Average rating, rating count | [Reviews](../03-bounded-contexts/reviews/ubiquitous-language.md) | `averageRating`, `ratingCount` |
| Badge | [Catalog](../03-bounded-contexts/catalog/ubiquitous-language.md) | `badge` |
| Basket, basket line, basket limit | [Shopping](../03-bounded-contexts/shopping/ubiquitous-language.md) | `cart`, `CartLine`, `maxQuantity` |
| Business type | [SellerOnboarding](../03-bounded-contexts/seller-onboarding/ubiquitous-language.md) | `SellerBusinessType` |
| Card, card brand, expiry | [Account](../03-bounded-contexts/account/ubiquitous-language.md) | `PaymentMethod`, `brand`, `expiry` |
| Claimed units, deal units, deal price | [SellerCentral](../03-bounded-contexts/seller-central/ubiquitous-language.md) | `claimed`, `dealStock`, `sellerDealPrice` |
| Condition | [SellerCentral](../03-bounded-contexts/seller-central/ubiquitous-language.md) | `ListingCondition` |
| Currency, locale, tax rate | [StoreConfig](../03-bounded-contexts/store-config/ubiquitous-language.md) | `siteConfig.*` |
| Delivery fee, free-delivery threshold | [StoreConfig](../03-bounded-contexts/store-config/ubiquitous-language.md) | `shippingFee`, `freeShippingThreshold` |
| Delivery speed, expected delivery date | [Ordering](../03-bounded-contexts/ordering/ubiquitous-language.md) | `speed`, `deliveredOn` |
| Department, subcategory | [Catalog](../03-bounded-contexts/catalog/ubiquitous-language.md) | `Category`, `subcategory` |
| Estimated payout, referral fee, revenue | [SellerCentral](../03-bounded-contexts/seller-central/ubiquitous-language.md) | `SellerSummary`, `SELLER_REFERRAL_FEE` |
| Facet, price band, sort order | [Catalog](../03-bounded-contexts/catalog/ubiquitous-language.md) | `CatalogFilters`, `PRICE_BANDS`, `SortKey` |
| Helpful vote | [Reviews](../03-bounded-contexts/reviews/ubiquitous-language.md) | `helpfulIds` |
| Invoice, tracking stages | [Ordering](../03-bounded-contexts/ordering/ubiquitous-language.md) | `#invoice`, `TRACKING_STAGES` |
| Issue, message, topic | [CustomerService](../03-bounded-contexts/customer-service/ubiquitous-language.md) | `SupportIssue`, `SupportMessage`, `SUPPORT_TOPICS` |
| Listing, seller order, deal | [SellerCentral](../03-bounded-contexts/seller-central/ubiquitous-language.md) | `SellerListing`, `SellerOrder`, `SellerDeal` |
| Money, store clock | [StoreConfig](../03-bounded-contexts/store-config/ubiquitous-language.md) | `roundMoney`, `REFERENCE_TODAY` |
| Order, order item, order reference | [Ordering](../03-bounded-contexts/ordering/ubiquitous-language.md) | `Order`, `OrderItem`, `id` |
| Ordered item | [CustomerService](../03-bounded-contexts/customer-service/ubiquitous-language.md) | `OrderedItem` |
| Popularity score, related products | [Catalog](../03-bounded-contexts/catalog/ubiquitous-language.md) | `getBestSellers`, `getRelatedProducts` |
| Product, price, list price, stock | [Catalog](../03-bounded-contexts/catalog/ubiquitous-language.md) | `Product` |
| Review, star rating, verified purchase | [Reviews](../03-bounded-contexts/reviews/ubiquitous-language.md) | `Review`, `rating`, `verified` |
| Review queue, decision note | [SellerOnboarding](../03-bounded-contexts/seller-onboarding/ubiquitous-language.md) | `applications`, `note` |
| Running deal, paused | [SellerCentral](../03-bounded-contexts/seller-central/ubiquitous-language.md) | `runningDealFor`, `dealPausedReason` |
| Saved for later, wish list | [Shopping](../03-bounded-contexts/shopping/ubiquitous-language.md) | `savedForLater`, `wishlist` |
| Seller account, seller profile, seller since | [SellerOnboarding](../03-bounded-contexts/seller-onboarding/ubiquitous-language.md) | `sellerStatus`, `SellerProfile`, `registeredSince` |
| Shopper, member since | [Account](../03-bounded-contexts/account/ubiquitous-language.md) | `currentUser` |
| Storefront product | [SellerCentral](../03-bounded-contexts/seller-central/ubiquitous-language.md) | `toStorefrontProduct` |
| Store deal | [Catalog](../03-bounded-contexts/catalog/ubiquitous-language.md) | `Deal` |
| Subtotal, savings, stock problem, units available | [Shopping](../03-bounded-contexts/shopping/ubiquitous-language.md) | `totals`, `hasStockProblems`, `maxQuantity` |
