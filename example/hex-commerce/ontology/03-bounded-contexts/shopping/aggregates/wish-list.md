---
id: Shopping.WishList
type: aggregate
context: Shopping
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/context/StoreProvider.tsx#toggleWishlist
  - src/data/account.ts#wishlistIds
---

# WishList (aggregate)

## Definition

Items a shopper wants to remember without intending to buy them now. Every product card can toggle an
item in or out, and an item can be moved into the basket as one unit.

## Structure

### WishList

Root entity. One per shopper.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| items | list of `Shopping.WishListItem` | yes (may be empty) | Newest first | `wishlist` |

### WishListItem

Entity. Identity: the item id.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| productId | `Shopping.PurchasableItem` id | yes | The remembered item | entry of `wishlist` |

## Invariants

- SHP-BR-008 — Each item at most once on a list
- SHP-BR-007 — Moving to the basket adds exactly one unit

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| `Shopping.ToggleWishList` | `Shopping.WishListChanged` |
| `Shopping.MoveWishListItemToBasket` | `Shopping.WishListItemMovedToBasket` |

## Example

```json
{ "wishlist": ["p-1002", "p-2004", "p-5002", "p-3003", "p-7001"] }
```

## Implementation

- **State changes:** `src/context/StoreProvider.tsx` (reducer cases `toggleWishlist`, `moveToCart`)
- **Seed:** `src/data/account.ts` (`wishlistIds`)
- **Persistence:** `localStorage` key `hexcommerce.store.v1`, shared with the basket
