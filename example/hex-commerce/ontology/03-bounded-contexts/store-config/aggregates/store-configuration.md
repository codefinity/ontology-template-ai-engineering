---
id: StoreConfig.StoreConfiguration
type: aggregate
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/lib/site.ts#siteConfig
---

# StoreConfiguration (aggregate)

## Definition

The settings of one HexCommerce deployment. There is exactly one per store. It is read-only at run
time: the store operator changes it by editing the environment and rebuilding.

## Structure

### StoreConfiguration

Root entity. Singleton; no identifier.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| name | text | yes (default "HexCommerce") | Store name used in titles and legal copy | `name` / `NEXT_PUBLIC_SITE_NAME` |
| tagline | text | yes (default "Everything you need, delivered.") | Marketing line | `tagline` / `NEXT_PUBLIC_SITE_TAGLINE` |
| currency | ISO 4217 code | yes (default `USD`) | Currency of every amount | `currency` / `NEXT_PUBLIC_CURRENCY` |
| locale | BCP 47 tag | yes (default `en-US`) | Number and date formatting | `locale` / `NEXT_PUBLIC_LOCALE` |
| freeShippingThreshold | `StoreConfig.Money` | yes (default 35) | Subtotal at or above which delivery is free | `freeShippingThreshold` / `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` |
| shippingFee | `StoreConfig.Money` | yes (fixed 5.99) | Delivery fee below the threshold | `shippingFee` (constant) |
| taxRate | decimal fraction | yes (default 0.0875) | Sales tax on the subtotal | `taxRate` / `NEXT_PUBLIC_TAX_RATE` |

## Invariants

- CFG-BR-001 — Blank or malformed settings fall back to defaults
- CFG-BR-002 — Default values

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| `StoreConfig.ConfigureStore` | none |

## Example

```json
{
  "name": "HexCommerce",
  "tagline": "Everything you need, delivered.",
  "currency": "USD",
  "locale": "en-US",
  "freeShippingThreshold": 35,
  "shippingFee": 5.99,
  "taxRate": 0.0875
}
```

## Implementation

- **Type / object:** `src/lib/site.ts` (`siteConfig`, `SiteConfig`)
- **State changes:** none at run time
- **Persistence:** environment variables, inlined at build time (`.env`, documented in `.env.example`)
