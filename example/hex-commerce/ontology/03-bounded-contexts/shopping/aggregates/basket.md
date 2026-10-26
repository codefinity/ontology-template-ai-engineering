---
id: Shopping.Basket
type: aggregate
context: Shopping
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/context/StoreProvider.tsx#addUnits
  - src/context/StoreProvider.tsx#MAX_QUANTITY
  - src/lib/types.ts#CartLine
---

# Basket (aggregate)

## Definition

The items a shopper intends to buy, each with a quantity, together with the items they have set aside
for later. The basket keeps only *which* item and *how many*. Price, title and availability are read
live from the item's owner, so the basket always shows today's price, including any running deal. Its
invariants protect the shopper from asking for more than can be sold.

## Structure

### Basket

Root entity. One per shopper; no identifier of its own.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| lines | list of `Shopping.BasketLine` | yes (may be empty) | Items to buy, in the order added | `cart` |
| savedForLater | list of `Shopping.SavedForLaterItem` | yes (may be empty) | Items set aside, newest first | `savedForLater` |

### BasketLine

Entity. Identity: the item id. There is at most one line per item.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| productId | `Shopping.PurchasableItem` id | yes | Catalogue product id or seller listing id | `productId` |
| quantity | integer ≥ 1 | yes | Units wanted | `quantity` |

### SavedForLaterItem

Entity. Identity: the item id. There is at most one per item.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| productId | `Shopping.PurchasableItem` id | yes | The item set aside | entry of `savedForLater` |

## Invariants

- SHP-BR-001 — At most 10 units of an item
- SHP-BR-002 — Never more than the units available
- SHP-BR-003 — Adding at the limit adds nothing
- SHP-BR-004 — A line above the limit is kept and flagged
- SHP-BR-006 — Quantity 0 removes the line
- SHP-BR-008 — Each item at most once on a list

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| `Shopping.AddToBasket` | `Shopping.ItemAddedToBasket` |
| `Shopping.ChangeLineQuantity` | `Shopping.LineQuantityChanged`, or `Shopping.LineRemoved` at 0 |
| `Shopping.RemoveLine` | `Shopping.LineRemoved` |
| `Shopping.SaveForLater` | `Shopping.ItemSavedForLater` |
| `Shopping.MoveSavedToBasket` | `Shopping.SavedItemMovedToBasket` |
| `Shopping.RemoveSavedItem` | `Shopping.SavedItemRemoved` |
| `Shopping.ClearBasket` | `Shopping.BasketCleared` |

## References to other aggregates

| Reference | Points to | Cardinality | Notes |
| --- | --- | --- | --- |
| productId | `Catalog.Product` or `SellerCentral.StorefrontProduct` | many to 1 | Resolved live; lines that cannot be resolved drop out of view (SHP-BR-015) |

## Example

The sample basket from `src/context/StoreProvider.tsx`:

```json
{
  "cart": [
    { "productId": "p-1005", "quantity": 1 },
    { "productId": "p-8001", "quantity": 2 }
  ],
  "savedForLater": ["p-4003", "p-6003"]
}
```

## Implementation

- **Type:** `src/lib/types.ts` (`CartLine`)
- **State changes:** `src/context/StoreProvider.tsx` (reducer cases `add`, `setQuantity`, `remove`,
  `clearCart`, `saveForLater`, `moveSavedToCart`, `removeFromSaved`; `addUnits`)
- **Persistence:** `localStorage` key `hexcommerce.store.v1`, written after every change once loaded
