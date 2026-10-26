---
id: domain.vision
type: domain-vision
status: implemented
last_reviewed: 2026-10-27
owners: [Business Sponsor, Product Owner]
sources:
  - BRD v3.0 sections 1-3 (executive summary, objectives, scope)
  - hex-commerce-source-ui README.md
---

# Domain vision

## Vision statement

HexCommerce is a multi-department online marketplace. It sells the store's own catalogue alongside the
listings of vetted independent sellers, under a brand that can be configured. Shoppers find products
quickly, see honest prices, stock and delivery costs, and pay through a short, transparent checkout.
Sellers get self-service tools to list, promote and fulfil, so the assortment can grow without the store
holding the stock. One customer account can shop and, once approved, sell.

## Business objectives

| ID | Objective | Measured by |
| --- | --- | --- |
| BO-01 | Help shoppers find relevant products quickly | Searches returning at least one result; search-to-product-view rate |
| BO-02 | Turn intent into paid orders through a simple, transparent checkout | Basket-to-order conversion; checkout abandonment |
| BO-03 | Increase basket value | Average order value; share of orders above the free-delivery threshold |
| BO-04 | Provide self-service and responsive support after purchase | Issues answered within 24 hours; repeat contacts |
| BO-05 | Grow the assortment through vetted third-party sellers | Applications decided on time; number of active seller listings |
| BO-06 | Give sellers self-service tools to list, promote, fulfil and get paid | Time to first listing; dispatch time |
| BO-07 | Build trust in the marketplace | Share of reviews that are verified; complaint rate |
| BO-08 | Re-brand and re-parameterise without development work | Time to launch a new brand configuration |
| BO-10 | Protect customers, sellers and the business | Security incidents; audit findings |

BO-09 (demonstrate the experience with sample data) was withdrawn in BRD v3.0. BO-11 (efficient
back-office operations) has no context in the as-built system.

## Scope

### In scope (as-built)
- Browsing eight departments; search, filters, sort orders, related products; store deals.
- Basket, saved-for-later list and wish list, with stock limits, totals, tax and free delivery.
- Checkout to a placed order (no payment is taken); order history and tracking stages.
- Address book and saved cards.
- Customer-service issues raised against ordered items.
- Reviews with verified-purchase marking and helpful votes.
- Applying to sell, the administrator's decision, and the seller profile.
- Seller listings, seller deals and seller orders. Active listings are sold in the storefront.

### Out of scope (as-built)
- Authentication: the app always acts as one signed-in shopper, Alex Morgan.
- Payment authorisation, refunds, cancellation and returns: they are BRD target state, with no context yet.
- Fulfilment by store staff, carriers and tracking updates: placed orders stay `Processing`.
- Back office for support agents, merchandisers, catalogue managers and finance, including payouts.
- Theming and visual design: they are presentation, not domain, even though they are configurable.

## Key domain concepts at a glance

| Concept | Owning context | In one line |
| --- | --- | --- |
| Product | [Catalog](../03-bounded-contexts/catalog/README.md) | Something shoppers can buy; also the published shape of a seller listing in the storefront |
| Department | [Catalog](../03-bounded-contexts/catalog/README.md) | Top-level grouping of products (eight of them), with subcategories |
| Basket | [Shopping](../03-bounded-contexts/shopping/README.md) | What the shopper intends to buy, limited by stock and a 10-unit cap |
| Order | [Ordering](../03-bounded-contexts/ordering/README.md) | A confirmed purchase, with prices, address and card captured at that moment |
| Seller application | [SellerOnboarding](../03-bounded-contexts/seller-onboarding/README.md) | A business's request to sell; once approved, it *is* the seller account |
| Seller listing | [SellerCentral](../03-bounded-contexts/seller-central/README.md) | A product a seller offers; only `Active` listings are sold |
| Seller deal | [SellerCentral](../03-bounded-contexts/seller-central/README.md) | A time-limited percentage discount on one listing, with a unit allowance |
| Seller order | [SellerCentral](../03-bounded-contexts/seller-central/README.md) | The seller's view of one marketplace line of a shopper's order |
| Support issue | [CustomerService](../03-bounded-contexts/customer-service/README.md) | A problem raised about one ordered item, with a message thread |

## Assumptions and constraints

| ID | Assumption or constraint | Consequence for the model |
| --- | --- | --- |
| A-01 | There is no backend. All state is seeded from sample data and kept in the shopper's browser (`localStorage`). | Each context's aggregates live in a client store. Cross-context "events" are synchronous calls. |
| A-02 | The store clock is fixed at 10 March 2025 (`REFERENCE_TODAY`). | Every date rule (deal status, delivery dates, card expiry) uses `StoreConfig.StoreClock`, not real time. |
| A-03 | One shopper is always signed in, and owns the approved seller account "Northgate Goods". | One marketplace seller exists in practice. The ontology still names *the seller* as a separate role. |
| A-04 | Prices are in one configurable currency and tax is a single flat rate. | `StoreConfig.Money` has no currency per amount. Tax is not itemised by product. |
| A-05 | The UK market is assumed by the BRD; the code defaults to USD and `en-US`. | Formatting follows `StoreConfig.StoreConfiguration`. Spelling in the ontology follows the BRD. |
