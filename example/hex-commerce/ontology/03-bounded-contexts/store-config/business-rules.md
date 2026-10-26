---
id: StoreConfig.rules
type: business-rules
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 sections 7 (FR-CFG), 8.13 (BR-SYS-001), 10 (NFR-LOC)
---

# StoreConfig — business rules

## Settings

### CFG-BR-001 Blank or malformed settings fall back to defaults
- **Statement:** A setting that is missing, blank or (for numbers) not a finite number takes its default
  value.
- **Kind:** constraint
- **Applies to:** `StoreConfig.StoreConfiguration`
- **Status:** implemented
- **Code:** `src/lib/site.ts` (`num`, `str`)
- **Source:** FR-CFG (BRD v3.0)

### CFG-BR-002 Default values
- **Statement:** Unless configured otherwise, the store is "HexCommerce", trades in USD with locale
  `en-US`, delivers free at or above 35.00, charges 5.99 delivery below that, and applies 8.75% tax.
- **Kind:** constraint
- **Applies to:** `StoreConfig.StoreConfiguration`
- **Status:** partial
- **Code:** `src/lib/site.ts` (`siteConfig`)
- **Source:** BR-PRC-002, BR-PRC-003, FR-CFG
- **Notes:** The delivery fee is a constant and cannot be configured. The BRD also requires a
  configurable next-day cut-off time and returns window, which do not exist.

## Money

### CFG-BR-003 Money is rounded to whole cents
- **Statement:** Every calculated amount (line total, subtotal, tax, total, deal price) is rounded to two
  decimals, so the rows shown always add up to the total.
- **Kind:** derivation
- **Applies to:** `StoreConfig.Money`
- **Status:** implemented
- **Code:** `src/lib/format.ts` (`roundMoney`)
- **Source:** BR-PRC-006
- **Notes:** `Math.round(amount * 100) / 100`. Basket savings are not rounded (see SHP-BR-013).

### CFG-BR-004 Money is shown in the store currency and locale
- **Statement:** Every amount is formatted with the configured currency and locale.
- **Kind:** constraint
- **Applies to:** `StoreConfig.Money`
- **Status:** implemented
- **Code:** `src/lib/format.ts` (`formatPrice`)
- **Source:** NFR-LOC-001, NFR-LOC-003

## Time

### CFG-BR-005 The store clock is fixed
- **Statement:** "Today" is 10 March 2025 (UTC) for every date rule. Dates relative to today are
  calculated from that date.
- **Kind:** constraint
- **Applies to:** `StoreConfig.StoreClock`
- **Status:** partial
- **Code:** `src/lib/format.ts` (`REFERENCE_TODAY`, `daysFromReference`)
- **Source:** BR-SYS-001
- **Notes:** The clock is fixed so that server and client rendering agree. The BRD requires the real
  current date in the store time zone. Some timestamps (`createdAt`, `updatedAt`, `submittedAt`,
  `sentAt`, review dates) use the real time from `new Date()`, so the two clocks are mixed.

### CFG-BR-006 Dates are presented in UTC
- **Statement:** Dates are formatted in the UTC time zone, so the same date appears everywhere.
- **Kind:** constraint
- **Applies to:** `StoreConfig.StoreClock`
- **Status:** implemented
- **Code:** `src/lib/format.ts` (`formatDate`, `formatShortDate`, `formatDeliveryDate`)
- **Source:** NFR-LOC-002
