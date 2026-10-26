---
id: StoreConfig.language
type: ubiquitous-language
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
---

# StoreConfig — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Currency | The ISO 4217 currency every amount is in. One per store. | `siteConfig.currency` | | `StoreConfig.StoreConfiguration` |
| Delivery fee | Flat charge for delivering a basket below the free-delivery threshold. | `siteConfig.shippingFee` | shipping cost | `StoreConfig.StoreConfiguration` |
| Free-delivery threshold | Basket subtotal at or above which delivery is free. | `siteConfig.freeShippingThreshold` | free shipping limit | `StoreConfig.StoreConfiguration` |
| Locale | The BCP 47 language tag that drives number and date formatting. | `siteConfig.locale` | | `StoreConfig.StoreConfiguration` |
| Money | An amount in the store currency, rounded to whole cents. | `number` + `roundMoney` | price (a price is a *use* of money) | `StoreConfig.Money` |
| Store clock | The source of "today" for every date rule. Fixed in the demonstration. | `REFERENCE_TODAY` | now, `new Date()` | `StoreConfig.StoreClock` |
| Store configuration | The full set of settings of one deployment. | `siteConfig` | site config, settings | `StoreConfig.StoreConfiguration` |
| Tax rate | The single sales-tax rate applied to a basket subtotal. | `siteConfig.taxRate` | VAT (not itemised) | `StoreConfig.StoreConfiguration` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Configure the store | Set the settings for a deployment; takes effect on the next build. | `.env` | | `StoreConfig.ConfigureStore` |
| Round to the cent | Round an amount to two decimals, half away from zero. | `roundMoney` | truncate | `StoreConfig.Money` |
