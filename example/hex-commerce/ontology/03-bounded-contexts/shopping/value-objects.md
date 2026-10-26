---
id: Shopping.value-objects
type: value-objects
context: Shopping
status: implemented
last_reviewed: 2026-10-27
---

# Shopping — value objects

### PurchasableItem

- **Meaning:** Whatever a basket line or list entry points at, as Shopping sees it. It is a catalogue
  product, or a seller listing published to the storefront. Shopping does not distinguish them except to
  tell the shopper who sells the item.
- **Attributes:** id, title, price, list price, units available (`stock`), seller (for listings)
- **Constraints:** Conforms to `Catalog.Product` (REL-02, REL-03). Looked up in the catalogue first,
  then in the seller feed.
- **Equality:** by id
- **Used by:** `Shopping.BasketLine`, `Shopping.SavedForLaterItem`, `Shopping.WishListItem`
- **Code:** `src/context/StoreProvider.tsx` (`getProduct`)
