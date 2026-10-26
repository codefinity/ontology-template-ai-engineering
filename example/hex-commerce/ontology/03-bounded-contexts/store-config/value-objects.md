---
id: StoreConfig.value-objects
type: value-objects
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/lib/format.ts
---

# StoreConfig — value objects

Both value objects here form the **shared kernel** (REL-01). Every context uses them, so change them only
with the agreement of all context owners.

### Money

- **Meaning:** An amount in the store currency.
- **Attributes:** amount (decimal). The currency is implied by `StoreConfig.StoreConfiguration`.
- **Constraints:** Calculated amounts are rounded to whole cents (CFG-BR-003). Shown in the store
  currency and locale (CFG-BR-004).
- **Equality:** by amount
- **Used by:** prices in Catalog and SellerCentral, totals in Shopping and Ordering
- **Code:** `src/lib/format.ts` (`roundMoney`, `formatPrice`, `splitPrice`). Amounts are plain `number`s.

### StoreClock

- **Meaning:** The single source of "today" for every date-dependent rule (deal status, delivery dates,
  card expiry, order dates).
- **Attributes:** today (date, `YYYY-MM-DD`)
- **Constraints:** Fixed at 2025-03-10 UTC (CFG-BR-005). Dates are compared as `YYYY-MM-DD` strings.
- **Equality:** by date
- **Used by:** `SellerCentral.SellerDeal`, `Ordering.Order`, `Account.CustomerAccount`
- **Code:** `src/lib/format.ts` (`REFERENCE_TODAY`, `daysFromReference`)
