---
id: Shopping.use-cases
type: use-cases
context: Shopping
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P02 (basket, saved-for-later, wish list), P19 (move to basket)
---

# Shopping — use cases

### SHP-UC-01 Put an item in the basket
- **Actor:** ACT-SHOPPER
- **Goal:** Collect an item to buy.
- **Trigger:** The shopper adds a product or listing to the basket.
- **Preconditions:** The item is shown to the shopper (CAT-UC-03, or a product card).
- **Main flow:**
  1. The shopper chooses a quantity and adds the item.
  2. The system adds the units, up to the basket limit: at most 10, and never more than are available
     (SHP-BR-001, SHP-BR-002).
  3. The system confirms the item is in the basket and updates the basket count.
- **Alternative flows:**
  - `2a.` The line is already at its limit, or the item is unavailable: nothing is added, and the
    shopper is told the limit has been reached (SHP-BR-003). The use case ends.
  - `2b.` Only part of the quantity fits: the line is filled to its limit.
- **Postconditions:** The basket holds the item, within its limit.
- **Commands:** `Shopping.AddToBasket`
- **Rules:** SHP-BR-001, SHP-BR-002, SHP-BR-003
- **Flows:** FLOW-02
- **Status:** implemented
- **Code:** `src/components/product/AddToCartButton.tsx`, `src/components/product/BuyBox.tsx`
- **Source:** P02

### SHP-UC-02 Review and adjust the basket
- **Actor:** ACT-SHOPPER
- **Goal:** Be sure of what will be ordered and what it will cost.
- **Trigger:** The shopper opens the basket.
- **Preconditions:** none
- **Main flow:**
  1. The shopper opens the basket.
  2. The system lists each item at its current price (SHP-BR-016), with line totals, subtotal, savings,
     delivery fee, tax and total (SHP-BR-009 to SHP-BR-013).
  3. The system tells the shopper how much more to add for free delivery (SHP-BR-014).
  4. The shopper changes quantities or removes items (SHP-BR-006).
  5. The shopper proceeds to checkout (ORD-UC-01).
- **Alternative flows:**
  - `2a.` A line asks for more than is now available: the line is kept and flagged with the units
    available (SHP-BR-004), and checkout is blocked until it is lowered (SHP-BR-005).
  - `2b.` An item can no longer be found (a listing deleted, or a seller no longer approved): it drops
    out of the basket shown (SHP-BR-015).
  - `4a.` The shopper sets a quantity to 0: the line is removed.
- **Postconditions:** The basket reflects the shopper's choices.
- **Commands:** `Shopping.ChangeLineQuantity`, `Shopping.RemoveLine`; reads `Shopping.BasketTotals`
- **Rules:** SHP-BR-004, SHP-BR-005, SHP-BR-006, SHP-BR-009, SHP-BR-010, SHP-BR-011, SHP-BR-012,
  SHP-BR-013, SHP-BR-014, SHP-BR-015, SHP-BR-016
- **Status:** implemented
- **Code:** `src/app/cart/page.tsx`, `src/components/cart/CartView.tsx`, `src/components/cart/CartSummary.tsx`
- **Source:** P02

### SHP-UC-03 Set an item aside for later
- **Actor:** ACT-SHOPPER
- **Goal:** Take an item out of this order without forgetting it.
- **Trigger:** The shopper saves a basket line for later.
- **Preconditions:** The item is in the basket.
- **Main flow:**
  1. The shopper saves a basket line for later.
  2. The system moves the whole line to the top of the saved-for-later list (SHP-BR-008).
  3. Later, the shopper moves it back to the basket.
  4. The system adds one unit to the basket and removes the item from the list (SHP-BR-007).
- **Alternative flows:**
  - `3a.` The shopper removes the saved item instead. The use case ends.
  - `4a.` The item is unavailable: it stays on the list.
  - `4b.` The basket line is already at its limit: the BRD says the item stays on the list. As-built,
    it leaves the list and nothing is added (SHP-BR-007, partial).
- **Postconditions:** The item is either in the basket or on the saved list, never lost (BRD intent).
- **Commands:** `Shopping.SaveForLater`, `Shopping.MoveSavedToBasket`, `Shopping.RemoveSavedItem`
- **Rules:** SHP-BR-007, SHP-BR-008
- **Status:** partial
- **Code:** `src/components/cart/CartView.tsx`
- **Source:** P02, P19

### SHP-UC-04 Keep a wish list
- **Actor:** ACT-SHOPPER
- **Goal:** Remember items to buy some other time.
- **Trigger:** The shopper marks or unmarks an item on any product card.
- **Preconditions:** none
- **Main flow:**
  1. The shopper marks an item.
  2. The system puts it at the top of the wish list, at most once (SHP-BR-008).
  3. Later, the shopper opens the wish list and moves an item to the basket.
  4. The system adds one unit and removes the item from the wish list (SHP-BR-007).
- **Alternative flows:**
  - `1a.` The item is already on the list: marking it again removes it.
  - `4a.` The item is unavailable: it stays on the wish list.
  - `4b.` The basket line is at its limit: as in SHP-UC-03 `4b.` (partial).
- **Postconditions:** The wish list holds what the shopper chose.
- **Commands:** `Shopping.ToggleWishList`, `Shopping.MoveWishListItemToBasket`
- **Rules:** SHP-BR-007, SHP-BR-008
- **Status:** partial
- **Code:** `src/app/wishlist/page.tsx`, `src/components/product/WishlistButton.tsx`, `src/components/account/WishlistView.tsx`
- **Source:** P02, P19
