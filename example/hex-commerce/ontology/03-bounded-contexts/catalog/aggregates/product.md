---
id: Catalog.Product
type: aggregate
context: Catalog
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/lib/types.ts#Product
  - src/data/products.ts#products
---

# Product (aggregate)

## Definition

Something shoppers can buy in the storefront. For a catalogue product, the store owns the record. The
same shape is also the **published language** of the storefront: SellerCentral translates each sellable
listing into a `Catalog.Product` (with `seller` set). Shopping, Ordering and the discovery queries
therefore treat both kinds alike.

## Structure

### Product

Root entity. Identity: `id` (catalogue `p-NNNN`, seller listing `SL-NNNNN`). Also addressed by `slug`.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| id | text | yes | Stable identifier | `id` |
| slug | text | yes | URL segment for catalogue products; equals `id` for listings | `slug` |
| title | text | yes | Name shown to shoppers | `title` |
| brand | text | yes | Maker; a filter facet | `brand` |
| department | `Catalog.Department` slug | yes | Owning department | `category` |
| subcategory | `Catalog.Subcategory` slug | no | Narrower grouping inside the department | `subcategory` |
| price | `StoreConfig.Money` | yes | Current selling price | `price` |
| listPrice | `StoreConfig.Money` | no | "Was" price; present only when discounted | `listPrice` |
| rating | 0–5 | yes | Baseline average rating | `rating` |
| reviewCount | integer ≥ 0 | yes | Ratings behind the average | `reviewCount` |
| stock | integer ≥ 0 | yes | Units on hand | `stock` |
| badge | `Catalog.Badge` | no | Merchandising label | `badge` |
| summary | text | yes | One line for cards | `summary` |
| description | text | yes | Long marketing copy | `description` |
| features | list of text | yes | "About this item" bullets | `features` |
| specs | key/value map | yes | Technical details | `specs` |
| colors, sizes | list of text | no | Variant choices (no separate price or stock) | `colors`, `sizes` |
| tags | list of text | yes | Search keywords | `tags` |
| images | list of URLs | no | Photos. Without them, artwork is generated. | `image`, `images` |
| seller | text | no | Seller business name; set only on seller listings | `seller` |

## Invariants

- CAT-BR-015 — A product's subcategory belongs to its department
- CAT-BR-002 — A product is on sale only when its list price is higher than its price

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| none as-built (static data) | none |

## References to other aggregates

| Reference | Points to | Cardinality | Notes |
| --- | --- | --- | --- |
| category | `Catalog.Department` | many to 1 | by slug |
| subcategory | `Catalog.Subcategory` | many to 0..1 | by slug |
| seller | `SellerOnboarding.SellerProfile` | many to 0..1 | by business name, not id (only on listings) |

## Example

From `src/data/products.ts`, trimmed. This product is also the subject of a store deal.

```json
{
  "id": "p-1008",
  "slug": "echo-wave-portable-speaker",
  "title": "EchoWave Portable Bluetooth Speaker, Waterproof",
  "brand": "EchoWave",
  "category": "electronics",
  "subcategory": "audio",
  "price": 79.99,
  "listPrice": 99.99,
  "rating": 4.5,
  "reviewCount": 31204,
  "stock": 410,
  "badge": "Deal of the Day",
  "summary": "IP67 waterproof, 20-hour battery and stereo pairing.",
  "specs": { "Output": "30 W", "Battery": "20 hours", "Rating": "IP67" },
  "colors": ["Charcoal", "Coral", "Teal"],
  "tags": ["speaker", "bluetooth", "waterproof", "outdoor", "portable"]
}
```

Derived: discount 20% (CAT-BR-001), on sale (CAT-BR-002), in stock (CAT-BR-010), free delivery for
the item (CAT-BR-011).

## Implementation

- **Type:** `src/lib/types.ts` (`Product`)
- **Data:** `src/data/products.ts` (`products`, 41 records)
- **Seller listings in this shape:** `src/data/seller.ts` (`toStorefrontProduct`)
- **Persistence:** none. Static data compiled into the app.
