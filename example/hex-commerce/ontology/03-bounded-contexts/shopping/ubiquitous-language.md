---
id: Shopping.language
type: ubiquitous-language
context: Shopping
status: implemented
last_reviewed: 2026-10-27
---

# Shopping — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Basket | What the shopper intends to buy now: lines of items and quantities. | `cart` | cart (in documents; see SHP-Q-01), bag | `Shopping.Basket` |
| Basket line | One item in the basket with its quantity. | `CartLine` | cart item, row | `Shopping.BasketLine` |
| Basket limit | The most units of one item the basket may hold: the lower of 10 and the units available. | `maxQuantity`, `MAX_QUANTITY` | max qty | `Shopping.UnitsAvailable` |
| Delivery fee | The charge added when the subtotal is below the free-delivery threshold. | `totals.shipping` | shipping | `Shopping.BasketTotals` |
| Free-delivery remaining | How much more the shopper must add to get free delivery. | `freeShippingRemaining` | | `Shopping.BasketTotals` |
| Item | Anything that can go in the basket: a catalogue product, or a seller listing on the storefront. | `Product` (resolved by `getProduct`) | product (ambiguous here) | `Shopping.PurchasableItem` |
| Line total | Unit price × quantity, rounded to the cent. | `lineTotal` | | `Shopping.DetailedBasket` |
| Saved for later | Items taken out of the basket but kept, newest first. | `savedForLater` | parked items | `Shopping.SavedForLaterItem` |
| Savings | What discounted lines save against their list price. | `totals.savings` | discount | `Shopping.BasketTotals` |
| Stock problem | A basket line asking for more units than are available. | `hasStockProblems` | | `Shopping.StockProblems` |
| Subtotal | The sum of line totals. | `totals.subtotal` | | `Shopping.BasketTotals` |
| Units available | How many units of an item can be bought right now. | `available`, `maxQuantity` | stock (stock is the seller's or the catalogue's figure) | `Shopping.UnitsAvailable` |
| Wish list | Items the shopper wants to remember, newest first. | `wishlist` | favourites, likes | `Shopping.WishList` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Add to basket | Put units of an item into the basket, up to the basket limit. | `addToCart` | buy | `Shopping.AddToBasket` |
| Change quantity | Set a line's quantity; 0 removes it. | `setQuantity` | update | `Shopping.ChangeLineQuantity` |
| Move to basket | Take an item from the wish list or saved list into the basket as one unit. | `moveToCart`, `moveSavedToCart` | | `Shopping.MoveWishListItemToBasket` |
| Remove | Delete a basket line. | `removeFromCart` | | `Shopping.RemoveLine` |
| Save for later | Move a whole basket line to the saved-for-later list. | `saveForLater` | | `Shopping.SaveForLater` |
| Toggle wish list | Add an item to, or remove it from, the wish list. | `toggleWishlist` | like, favourite | `Shopping.ToggleWishList` |
