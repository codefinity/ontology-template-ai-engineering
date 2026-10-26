---
id: Shopping.rules
type: business-rules
context: Shopping
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 sections 8.1 (pricing), 8.2 (basket and stock)
---

# Shopping — business rules

## Quantities

### SHP-BR-001 At most 10 units of an item
- **Statement:** The basket holds at most 10 units of any one product or listing.
- **Kind:** invariant
- **Applies to:** `Shopping.Basket`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`MAX_QUANTITY`, `maxQuantity`)
- **Source:** BR-CRT-001

### SHP-BR-002 Never more than the units available
- **Statement:** The units of an item that can be put in the basket are also limited by its units
  available. For a catalogue product, that is its stock. For a seller listing, it is the units its
  storefront product offers: stock, or while a deal runs, the lower of stock and deal units left
  (SEL-BR-019).
- **Kind:** invariant
- **Applies to:** `Shopping.Basket`, `Shopping.UnitsAvailable`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`maxQuantity`, `addUnits`)
- **Source:** BR-CRT-002

### SHP-BR-003 Adding at the limit adds nothing
- **Statement:** Adding to a line that is already at its basket limit changes nothing, and the shopper
  is told the limit has been reached.
- **Kind:** validation
- **Applies to:** `Shopping.Basket`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`addToCart` returns `false`), `src/components/product/AddToCartButton.tsx`
- **Source:** BR-CRT-003

### SHP-BR-004 A line above the limit is kept and flagged
- **Statement:** If an item's units available fall below a line's quantity after it was added, the line
  keeps its quantity and is flagged. It is never reduced automatically.
- **Kind:** invariant
- **Applies to:** `Shopping.Basket`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`addUnits`, `DetailedCartLine.available`)
- **Source:** BR-CRT-004

### SHP-BR-005 No order while a line exceeds the units available
- **Statement:** The basket cannot be ordered while any line asks for more units than are available.
- **Kind:** invariant
- **Applies to:** `Shopping.StockProblems`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`hasStockProblems`), `src/components/checkout/CheckoutView.tsx` (`placeOrder`)
- **Source:** BR-CRT-005

### SHP-BR-006 Quantity 0 removes the line
- **Statement:** Setting a line's quantity to 0 or less removes the line. Any other quantity is capped at
  the basket limit.
- **Kind:** invariant
- **Applies to:** `Shopping.BasketLine`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (reducer case `setQuantity`)
- **Source:** BRD v3.0 data dictionary (Basket: quantity "0 (delete)")

## Lists

### SHP-BR-007 Moving to the basket adds exactly one unit
- **Statement:** Moving an item from the wish list or the saved-for-later list adds exactly one unit to
  the basket, and only when the item is available and its basket line is below its limit. Otherwise the
  item stays on its list.
- **Kind:** policy
- **Applies to:** `Shopping.WishList`, `Shopping.Basket`
- **Status:** partial
- **Code:** `src/context/StoreProvider.tsx` (reducer cases `moveToCart`, `moveSavedToCart`)
- **Source:** BR-CRT-006
- **Notes:** The code checks only that the item is available. If the basket line is already at its
  limit, nothing is added but the item is still removed from its list.

### SHP-BR-008 Each item at most once on a list
- **Statement:** An item appears at most once on the wish list and at most once on the saved-for-later
  list, with the most recently saved first. Saving a basket line for later moves the whole line.
- **Kind:** invariant
- **Applies to:** `Shopping.WishList`, `Shopping.Basket`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (reducer cases `toggleWishlist`, `saveForLater`)
- **Source:** BR-CRT-007

### SHP-BR-015 Lines whose item cannot be found drop out
- **Statement:** A basket line whose item cannot be resolved is left out of the basket shown, its totals
  and checkout. That covers an unknown product, a draft or deleted listing, and any listing while its
  seller is not approved.
- **Kind:** policy
- **Applies to:** `Shopping.DetailedBasket`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`detailedCart`)
- **Source:** hex-commerce-source-ui
- **Notes:** The stored line is kept and reappears if the item becomes resolvable again (SHP-Q-02).

## Pricing

### SHP-BR-016 Basket prices are live
- **Statement:** A basket line is priced at the item's current price whenever it is read, including any
  deal that is running at that moment. The price when the item was added is not kept.
- **Kind:** derivation
- **Applies to:** `Shopping.DetailedBasket`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`detailedCart`)
- **Source:** hex-commerce-source-ui; prices are fixed only when the order is placed (ORD-BR-005)

### SHP-BR-009 Line totals and subtotal
- **Statement:** A line total is unit price × quantity, rounded to the cent. The subtotal is the sum of
  line totals, rounded to the cent.
- **Kind:** derivation
- **Applies to:** `Shopping.BasketTotals`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`detailedCart`, `totals`)
- **Source:** BR-PRC-006

### SHP-BR-010 Delivery fee
- **Statement:** The delivery fee (default 5.99) is charged when the basket has items and its subtotal is
  below the free-delivery threshold (default 35.00). Delivery is free at or above the threshold, and
  nothing is charged for an empty basket.
- **Kind:** derivation
- **Applies to:** `Shopping.BasketTotals`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`totals`)
- **Source:** BR-PRC-002

### SHP-BR-011 Tax
- **Statement:** Tax is the subtotal × the tax rate (default 8.75%), rounded to the cent. No tax is
  charged on the delivery fee.
- **Kind:** derivation
- **Applies to:** `Shopping.BasketTotals`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`totals`)
- **Source:** BR-PRC-003

### SHP-BR-012 Total
- **Statement:** The total is subtotal + delivery fee + tax, rounded to the cent.
- **Kind:** derivation
- **Applies to:** `Shopping.BasketTotals`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`totals`)
- **Source:** BR-PRC-004

### SHP-BR-013 Savings
- **Statement:** Savings are the sum, over lines with a list price, of (list price − price) × quantity.
- **Kind:** derivation
- **Applies to:** `Shopping.BasketTotals`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`totals`)
- **Source:** BR-PRC-005
- **Notes:** Not rounded to the cent, unlike every other amount (CFG-BR-003).

### SHP-BR-014 Amount left for free delivery
- **Statement:** Until the subtotal reaches the free-delivery threshold, the shopper is told how much more
  is needed: threshold − subtotal. Once it is reached, the amount is 0.
- **Kind:** derivation
- **Applies to:** `Shopping.BasketTotals`
- **Status:** implemented
- **Code:** `src/context/StoreProvider.tsx` (`freeShippingRemaining`)
- **Source:** FR-CRT (BRD v3.0), BO-03
