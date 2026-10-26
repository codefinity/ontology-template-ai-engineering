# Example: HexCommerce ontology

A complete business ontology built with [the template](../../template/README.md) from a real codebase:
**HexCommerce** (`hex-commerce-source-ui`), an Amazon-style marketplace storefront written with Next.js.
Use it as a reference for what a filled-in ontology looks like, and for how much detail each file needs.

Start at [`ontology/README.md`](ontology/README.md).

## What it covers

| | |
| --- | --- |
| Source | `hex-commerce-source-ui`: types, client stores, domain functions, validation in components, sample data |
| Reconciled with | BRD v3.0 (`docs/HexCommerce_Business_Requirements_Document_v3.0.docx` in that repository). Each rule cites its BRD ID; the few with no BRD counterpart cite the code instead. |
| Perspective | **As-built.** Rules the BRD requires but the code does not meet are marked `partial` or `not-implemented`, with what is missing. |
| Size | 9 bounded contexts, 14 context relationships, 6 cross-context flows, 15 aggregates, about 180 named concepts, 125 rules |

| Context | Type | Aggregates |
| --- | --- | --- |
| Catalog | core | Product, Department, StoreDeal |
| Shopping | core | Basket, WishList |
| Ordering | core | Order |
| SellerCentral | core | SellerListing, SellerDeal, SellerOrder |
| SellerOnboarding | supporting | SellerApplication |
| CustomerService | supporting | SupportIssue |
| Reviews | supporting | Review, HelpfulVotes |
| Account | generic | CustomerAccount |
| StoreConfig | generic | StoreConfiguration |

## Things worth looking at

These show what the template can capture that a README or a type file cannot:

- **Same word, different meanings.** "Order" (Ordering) and "seller order" (SellerCentral); "store deal"
  (Catalog, advertised only) and "seller deal" (SellerCentral, actually priced). See the
  [glossary](ontology/01-domain/glossary.md).
- **Logical boundaries versus code.** Orders are stored in `AccountProvider` but belong to Ordering.
  Checkout orchestrates three contexts from one UI function. See the Ordering README's *Implementation
  notes*.
- **A published language.** SellerCentral translates listings into Catalog's `Product` shape, so Shopping
  and Ordering never see a seller listing. See [REL-03/04/05](ontology/02-context-map/context-map.md).
- **Implicit events made explicit.** There is no event bus, but each event records how it is
  *realised*, for example `OrderPlaced` → `recordSale()`, `placeOrder()`, `clearCart()`.
- **Gaps found while extracting**, recorded as rules with status and notes. For example:
  - SHP-BR-007: moving a wish-list item into a full basket line drops it from the list without adding it.
  - ORD-BR-010: checkout ignores a failed `recordSale`, so a seller can miss a sale.
  - SEL-BR-024: sellers cannot cancel a `New` order.
  - REV-BR-007: the rating histogram is synthesised from the average.

## Validating against the code

The ontology's `code_root` points at `../../../../hex-commerce-source-ui`, the HexCommerce repository
checked out next to this one. With it in place, the validator also checks every `code_refs` entry, every
`path#Symbol`, and every code path quoted in the text:

```bash
node example/hex-commerce/ontology/tools/validate.mjs
# or point it elsewhere:
node example/hex-commerce/ontology/tools/validate.mjs --code-root /path/to/hex-commerce-source-ui
```

Without the source repository, the code checks are skipped with a notice and the structural checks still
run.

## How it was produced

Claude Code followed [`extracting-from-code.md`](ontology/00-meta/extracting-from-code.md):

1. It read the types (`src/lib/types.ts`), every client store (`src/context/*`), the domain functions
   (`src/data/*`, `src/lib/*`) and the validation in editor components.
2. It identified contexts from linguistic boundaries and from which actor owns each decision.
3. It recorded each rule with the code that enforces it, then matched it to its BRD v3.0 requirement.
4. It recorded disagreements between the code and the BRD as `partial` or `not-implemented` rules,
   instead of resolving them silently.
5. It ran the validator until there were no errors.
