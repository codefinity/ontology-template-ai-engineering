---
id: Catalog.StoreDeal
type: aggregate
context: Catalog
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/lib/types.ts#Deal
  - src/data/marketing.ts#deals
---

# StoreDeal (aggregate)

## Definition

A time-limited discount the **store** runs on one of its own catalogue products, advertised with a
percentage off, the share of deal stock already claimed, and a countdown. Do not confuse it with
`SellerCentral.SellerDeal`: a seller runs that on a seller listing, and it does change the price.

As-built, a store deal is merchandising content. It does not change the price charged (CAT-BR-014).

## Structure

### StoreDeal

Root entity. Identity: `productId`, since there is at most one store deal per product.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| productId | `Catalog.Product` id | yes | The discounted product | `productId` |
| percentOff | integer 1–99 | yes | Advertised percentage off the list price | `percentOff` |
| claimed | fraction 0–1 | yes | Share of deal stock already claimed | `claimed` |
| endsIn | text | yes | Countdown label, for example "Ends in 4h 12m" | `endsIn` |

## Invariants

- CAT-BR-014 — A store deal is advertised, not priced

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| none as-built (sample data) | none |

## References to other aggregates

| Reference | Points to | Cardinality | Notes |
| --- | --- | --- | --- |
| productId | `Catalog.Product` | 1 to 1 | Deals whose product is missing are dropped |

## Example

```json
{ "productId": "p-1008", "percentOff": 20, "claimed": 0.78, "endsIn": "Ends in 4h 12m" }
```

## Implementation

- **Type:** `src/lib/types.ts` (`Deal`)
- **Data:** `src/data/marketing.ts` (`deals`)
- **Read:** `src/lib/catalog.ts` (`getResolvedDeals`)
- **Persistence:** none. Static data.
