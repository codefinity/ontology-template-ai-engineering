---
id: ADR-003
type: decision
status: implemented
last_reviewed: 2026-10-27
owners: [Product Owner, Marketplace operations lead]
---

# ADR-003 `Catalog.Product` is the storefront's published language

## Context

Shoppers find and buy two kinds of item: catalogue products and seller listings. The code translates
every sellable listing into the catalogue's `Product` shape (`toStorefrontProduct`). Discovery, the
basket and checkout then treat both alike. The result is a two-way dependency: SellerCentral conforms to
Catalog's shape (REL-05), and Catalog consumes SellerCentral's feed (REL-04).

## Options considered

1. **Let Shopping and Ordering know both models.** Every consumer branches on "catalogue or listing".
2. **Use `Catalog.Product` as a Published Language** that SellerCentral translates into, through an Open
   Host Service (the storefront feed).
3. **A separate Storefront context** that owns the item language, with Catalog and SellerCentral both
   upstream of it.

## Decision

Option 2, as built. The cycle is recorded as a known issue rather than hidden. Option 3 is the
preferred direction if a third source of items appears.

## Consequences

- Downstream contexts never see `SellerCentral.SellerListing` (REL-02, REL-03).
- A change to `Catalog.Product` is a change to a published contract. SellerCentral's translator
  (`SellerCentral.StorefrontProduct`) must change with it.
- `ontology.mjs boundaries` allows both directions, because both relationships are declared.
