---
id: domain.subdomains
type: subdomains
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 5 (capability map)
---

# Subdomains

## Classification

| ID | Subdomain | Type | Why this type | Objectives | Served by contexts |
| --- | --- | --- | --- | --- | --- |
| SD-DISCOVERY | Product discovery | Core | Shoppers stay with a marketplace that finds the right item fast. Search relevance and merchandising are tuned to this business. | BO-01 | [Catalog](../03-bounded-contexts/catalog/README.md) |
| SD-PURCHASING | Purchasing | Core | Honest stock limits, free-delivery thresholds and a short checkout drive conversion and basket value. | BO-02, BO-03 | [Shopping](../03-bounded-contexts/shopping/README.md), [Ordering](../03-bounded-contexts/ordering/README.md) |
| SD-MARKETPLACE | Marketplace selling | Core | Third-party listings and seller-run deals are what make this a marketplace rather than a shop. Its rules (deal windows, unit allowances, storefront projection) are the most intricate in the domain. | BO-03, BO-06 | [SellerCentral](../03-bounded-contexts/seller-central/README.md) |
| SD-SELLER-ONBOARDING | Seller onboarding | Supporting | Vetting sellers is necessary and specific to HexCommerce, but it is a simple approve/reject workflow. | BO-05 | [SellerOnboarding](../03-bounded-contexts/seller-onboarding/README.md) |
| SD-CUSTOMER-CARE | Customer care | Supporting | Issue threads must exist and follow the 24-hour promise, but they do not differentiate the business. | BO-04 | [CustomerService](../03-bounded-contexts/customer-service/README.md) |
| SD-TRUST | Trust and reviews | Supporting | Verified reviews build trust; the model is small and specific to products bought here. | BO-07 | [Reviews](../03-bounded-contexts/reviews/README.md) |
| SD-CUSTOMER-ACCOUNTS | Customer accounts | Generic | Address books, saved cards and identity work the same everywhere. | BO-10 | [Account](../03-bounded-contexts/account/README.md) |
| SD-STORE-CONFIGURATION | Store configuration | Generic | Settings for brand, currency, tax and delivery. | BO-08 | [StoreConfig](../03-bounded-contexts/store-config/README.md) |
| SD-PAYMENTS | Payments | Generic | Buy from a payment service provider. | BO-02, BO-10 | none: no payment is taken as-built |
| SD-FULFILMENT | Fulfilment and returns | Supporting | Dispatch, tracking, cancellation and returns (BRD P23–P25). | BO-04 | none: target state only |

## Core domain chart

```mermaid
quadrantChart
    title Subdomain investment
    x-axis Low model complexity --> High model complexity
    y-axis Low differentiation --> High differentiation
    quadrant-1 Core
    quadrant-2 Core (simple)
    quadrant-3 Supporting
    quadrant-4 Generic (buy or reuse)
    "Marketplace selling": [0.85, 0.85]
    "Purchasing": [0.65, 0.75]
    "Product discovery": [0.55, 0.7]
    "Seller onboarding": [0.3, 0.4]
    "Trust and reviews": [0.3, 0.35]
    "Customer care": [0.35, 0.25]
    "Customer accounts": [0.45, 0.15]
    "Payments": [0.8, 0.1]
    "Store configuration": [0.1, 0.1]
```

## Notes

- Shopping and Ordering both serve SD-PURCHASING (ADR-002). They are separate contexts because the basket is a
  mutable intention, keyed by product, with live prices and stock. An order is an immutable record that
  snapshots prices, address and card.
- SD-PAYMENTS and SD-FULFILMENT have no context yet. The BRD target state will need a Payments context
  (ACL in front of the payment service provider) and a Fulfilment context (line dispatch, returns).
