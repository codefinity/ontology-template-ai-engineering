---
id: Catalog.Department
type: aggregate
context: Catalog
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/lib/types.ts#Category
  - src/data/categories.ts#categories
---

# Department (aggregate)

## Definition

A top-level grouping of products and seller listings, with optional narrower subcategories. The
departments are reference data: there are eight, and they change only with a code change. SellerCentral
uses the same taxonomy when a seller classifies a listing.

## Structure

### Department

Root entity. Identity: `slug`.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| slug | text | yes | Identifier and URL segment | `slug` |
| name | text | yes | Display name | `name` |
| blurb | text | yes | Short line for home-page tiles | `blurb` |
| subcategories | list of `Catalog.Subcategory` | no | Narrower groupings | `subcategories` |

### Subcategory

Entity inside a department. Identity: `slug`, unique within its department.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| slug | text | yes | Identifier | `slug` |
| name | text | yes | Display name | `name` |

## Reference data

| Department (`slug`) | Subcategories |
| --- | --- |
| Electronics (`electronics`) | Audio, Computers, Cameras, Wearables |
| Home & Kitchen (`home-kitchen`) | Cookware, Small appliances, Décor, Bedding |
| Fashion (`fashion`) | Men's, Women's, Footwear, Accessories |
| Books (`books`) | Fiction, Non-fiction, Children's |
| Sports & Outdoors (`sports-outdoors`) | Fitness, Camping, Cycling |
| Beauty & Personal Care (`beauty`) | Skincare, Haircare, Fragrance |
| Toys & Games (`toys-games`) | Building sets, Board games, Outdoor play |
| Grocery (`grocery`) | Coffee & tea, Snacks, Pantry |

## Invariants

- CAT-BR-015 — A product's subcategory belongs to its department

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| none as-built (reference data) | none |

## Implementation

- **Type:** `src/lib/types.ts` (`Category`)
- **Data:** `src/data/categories.ts` (`categories`, `getCategoryBySlug`)
- **Persistence:** none. Static data.
