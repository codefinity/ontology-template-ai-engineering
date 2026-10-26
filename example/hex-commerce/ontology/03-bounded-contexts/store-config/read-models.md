---
id: StoreConfig.read-models
type: read-models
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
---

# StoreConfig — read models and queries

### StoreSettings

- **Answers:** What are this store's name, currency, delivery terms and tax rate?
- **Shape:** the attributes of `StoreConfig.StoreConfiguration`
- **Derived from:** `StoreConfig.StoreConfiguration`
- **Rules:** CFG-BR-001, CFG-BR-002
- **Consumers:** Shopping (basket totals), Ordering (totals of sample orders), Catalog (free-delivery
  message on a product)
- **Published:** yes (part of REL-01)
- **Code:** `src/lib/site.ts` (`siteConfig`)

### PriceDisplay

- **Answers:** How is this amount shown to a user?
- **Shape:** formatted string; or symbol, whole part and fraction for the large price layout
- **Derived from:** `StoreConfig.Money`, `StoreConfig.StoreConfiguration`
- **Rules:** CFG-BR-004
- **Consumers:** every context that shows money
- **Published:** yes (part of REL-01)
- **Code:** `src/lib/format.ts` (`formatPrice`, `splitPrice`)
