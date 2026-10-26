---
id: Shopping.events
type: domain-events
context: Shopping
status: implemented
last_reviewed: 2026-10-27
---

# Shopping — domain events and policies

Every event below is realised as a reducer action in `StoreProvider` (named in **Realised as**). No other
context listens to them; Ordering reads the basket's read models at checkout instead.

## Events

### ItemAddedToBasket

- **Meaning:** Units of an item were put in the basket.
- **Emitted by:** `Shopping.AddToBasket`
- **Payload:** item id, units added
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `add`

### LineQuantityChanged

- **Meaning:** The shopper changed how many units of an item they want.
- **Emitted by:** `Shopping.ChangeLineQuantity`
- **Payload:** item id, new quantity
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `setQuantity`

### LineRemoved

- **Meaning:** An item left the basket.
- **Emitted by:** `Shopping.RemoveLine`, `Shopping.ChangeLineQuantity`
- **Payload:** item id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `remove`, or `setQuantity` with 0

### BasketCleared

- **Meaning:** The basket was emptied after its contents were ordered.
- **Emitted by:** `Shopping.ClearBasket`
- **Payload:** none
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `clearCart`

### ItemSavedForLater

- **Meaning:** A basket line was set aside.
- **Emitted by:** `Shopping.SaveForLater`
- **Payload:** item id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `saveForLater`

### SavedItemMovedToBasket

- **Meaning:** A saved item came back into the basket.
- **Emitted by:** `Shopping.MoveSavedToBasket`
- **Payload:** item id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `moveSavedToCart`

### SavedItemRemoved

- **Meaning:** A saved item was forgotten.
- **Emitted by:** `Shopping.RemoveSavedItem`
- **Payload:** item id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `removeFromSaved`

### WishListChanged

- **Meaning:** An item was added to or removed from the wish list.
- **Emitted by:** `Shopping.ToggleWishList`
- **Payload:** item id, added or removed
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `toggleWishlist`

### WishListItemMovedToBasket

- **Meaning:** A remembered item was moved into the basket.
- **Emitted by:** `Shopping.MoveWishListItemToBasket`
- **Payload:** item id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `moveToCart`

## Policies

### ClearBasketAfterOrder

- **When:** `Ordering.OrderPlaced`
- **Then:** `Shopping.ClearBasket`
- **Rules:** none
- **Realised as:** direct call `clearCart()` at the end of `placeOrder` in
  `src/components/checkout/CheckoutView.tsx`, after the order is stored
