---
id: Shopping.commands
type: commands
context: Shopping
status: implemented
last_reviewed: 2026-10-27
---

# Shopping — commands

## Basket

### AddToBasket

- **Intent:** Put units of an item in the basket.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.Basket` (changes)
- **Input:** item id, quantity (default 1; the product page offers 1 to the lower of 10 and stock)
- **Rejected when:** SHP-BR-003 (line at its limit, or the item is unavailable)
- **On success:** line created or increased, capped by SHP-BR-001 and SHP-BR-002; emits
  `Shopping.ItemAddedToBasket`
- **Code:** `src/context/StoreProvider.tsx` (`addToCart`)

### ChangeLineQuantity

- **Intent:** Buy more or fewer units of an item already in the basket.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.BasketLine` (changes or deletes)
- **Input:** item id, new quantity
- **Rejected when:** never; the quantity is capped (SHP-BR-006)
- **On success:** emits `Shopping.LineQuantityChanged`, or `Shopping.LineRemoved` at 0
- **Code:** `src/context/StoreProvider.tsx` (`setQuantity`)

### RemoveLine

- **Intent:** Stop intending to buy an item.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.BasketLine` (deletes)
- **Input:** item id
- **Rejected when:** never
- **On success:** emits `Shopping.LineRemoved`
- **Code:** `src/context/StoreProvider.tsx` (`removeFromCart`)

### ClearBasket

- **Intent:** Empty the basket once its contents have been ordered.
- **Actor:** policy `Shopping.ClearBasketAfterOrder`
- **Target:** `Shopping.Basket` (changes)
- **Input:** none
- **Rejected when:** never
- **On success:** no lines remain; the saved-for-later list is untouched. Emits `Shopping.BasketCleared`.
- **Code:** `src/context/StoreProvider.tsx` (`clearCart`)

## Saved for later

### SaveForLater

- **Intent:** Take an item out of the basket without forgetting it.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.Basket` (changes)
- **Input:** item id
- **Rejected when:** never
- **On success:** the whole line is removed, and the item heads the saved list (SHP-BR-008); emits
  `Shopping.ItemSavedForLater`
- **Code:** `src/context/StoreProvider.tsx` (`saveForLater`)

### MoveSavedToBasket

- **Intent:** Bring a saved item back into the basket.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.Basket` (changes)
- **Input:** item id
- **Rejected when:** the item is unavailable (SHP-BR-007)
- **On success:** one unit added and the item leaves the saved list; emits `Shopping.SavedItemMovedToBasket`
- **Code:** `src/context/StoreProvider.tsx` (`moveSavedToCart`)

### RemoveSavedItem

- **Intent:** Forget a saved item.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.Basket` (changes)
- **Input:** item id
- **Rejected when:** never
- **On success:** emits `Shopping.SavedItemRemoved`
- **Code:** `src/context/StoreProvider.tsx` (`removeFromSaved`)

## Wish list

### ToggleWishList

- **Intent:** Remember an item, or forget a remembered one.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.WishList` (changes)
- **Input:** item id
- **Rejected when:** never
- **On success:** added at the top, or removed; emits `Shopping.WishListChanged`
- **Code:** `src/context/StoreProvider.tsx` (`toggleWishlist`)

### MoveWishListItemToBasket

- **Intent:** Start buying a remembered item.
- **Actor:** ACT-SHOPPER
- **Target:** `Shopping.WishList` and `Shopping.Basket` (change)
- **Input:** item id
- **Rejected when:** the item is unavailable (SHP-BR-007)
- **On success:** one unit added and the item leaves the wish list; emits `Shopping.WishListItemMovedToBasket`
- **Code:** `src/context/StoreProvider.tsx` (`moveToCart`)
