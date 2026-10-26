---
id: Shopping.read-models
type: read-models
context: Shopping
status: implemented
last_reviewed: 2026-10-27
---

# Shopping — read models and queries

## Published to Ordering (REL-07)

### DetailedBasket

- **Answers:** What exactly is in the basket now: which items, at what price, and how many can be had?
- **Shape:** per line: the resolved `Shopping.PurchasableItem`, quantity, line total, units available
- **Derived from:** `Shopping.Basket`, `Shopping.PurchasableItem`
- **Rules:** SHP-BR-009, SHP-BR-015, SHP-BR-016
- **Consumers:** the basket view; Ordering (checkout copies it into the order)
- **Published:** yes (REL-07)
- **Code:** `src/context/StoreProvider.tsx` (`detailedCart`, `DetailedCartLine`)

### BasketTotals

- **Answers:** What does the basket cost?
- **Shape:** item count, subtotal, savings, delivery fee, tax, total, amount left for free delivery
- **Derived from:** `Shopping.DetailedBasket`, `StoreConfig.StoreSettings`
- **Rules:** SHP-BR-009 to SHP-BR-014
- **Consumers:** the basket view; Ordering (checkout copies the totals into the order)
- **Published:** yes (REL-07)
- **Code:** `src/context/StoreProvider.tsx` (`totals`, `CartTotals`)

### StockProblems

- **Answers:** Can this basket be ordered, as far as stock goes?
- **Shape:** yes/no. The detailed basket shows which lines are affected.
- **Derived from:** `Shopping.DetailedBasket`
- **Rules:** SHP-BR-005
- **Consumers:** the basket view; Ordering (blocks `Ordering.PlaceOrder`)
- **Published:** yes (REL-07)
- **Code:** `src/context/StoreProvider.tsx` (`hasStockProblems`)

## For the shopper

### UnitsAvailable

- **Answers:** How many units of this item can be in the basket?
- **Shape:** whole number 0–10
- **Derived from:** `Shopping.PurchasableItem`
- **Rules:** SHP-BR-001, SHP-BR-002
- **Consumers:** quantity choices on product pages and in the basket
- **Published:** no
- **Code:** `src/context/StoreProvider.tsx` (`maxQuantity`)

### BasketQuantity

- **Answers:** How many units of this item are already in the basket?
- **Shape:** whole number
- **Derived from:** `Shopping.Basket`
- **Rules:** none
- **Consumers:** product cards and the buy box
- **Published:** no
- **Code:** `src/context/StoreProvider.tsx` (`getCartQuantity`)

### WishListMembership

- **Answers:** Is this item on the wish list?
- **Shape:** yes/no
- **Derived from:** `Shopping.WishList`
- **Rules:** none
- **Consumers:** the heart control on every product card
- **Published:** no
- **Code:** `src/context/StoreProvider.tsx` (`isInWishlist`)
