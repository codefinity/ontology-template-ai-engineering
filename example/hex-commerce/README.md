# Example: HexCommerce ontology

A complete business ontology built with [the template](../../template/README.md) from a real codebase:
**HexCommerce** (`hex-commerce-source-ui`), an Amazon-style marketplace storefront written with Next.js.
Use it as a reference for what a filled-in ontology looks like, how much detail each file needs, and
what the tools report on real code.

Start at [`ontology/README.md`](ontology/README.md).

## What it covers

| | |
| --- | --- |
| Source | `hex-commerce-source-ui`: types, client stores, domain functions, validation in components, routes, sample data |
| Reconciled with | BRD v3.0 (`docs/HexCommerce_Business_Requirements_Document_v3.0.docx` in that repository). Each rule and use case cites its BRD requirement or process; the few with no BRD counterpart cite the code instead. |
| Perspective | **As-built** ([ADR-001](ontology/00-meta/decisions/ADR-001-describe-the-as-built-system.md)). What the BRD requires but the code does not do is marked `partial` or `not-implemented`, saying what is missing. |
| Size | 9 bounded contexts, 15 aggregates, about 180 named concepts, 125 rules, 36 use cases, 15 context relationships, 6 cross-context flows, 3 decisions |

| Context | Type | Aggregates | Use cases |
| --- | --- | --- | --- |
| Catalog | core | Product, Department, StoreDeal | 4 |
| Shopping | core | Basket, WishList | 4 |
| Ordering | core | Order | 5 |
| SellerCentral | core | SellerListing, SellerDeal, SellerOrder | 6 |
| SellerOnboarding | supporting | SellerApplication | 4 |
| CustomerService | supporting | SupportIssue | 4 |
| Reviews | supporting | Review, HelpfulVotes | 4 |
| Account | generic | CustomerAccount | 4 |
| StoreConfig | generic | StoreConfiguration | 1 |

## Things worth looking at

- **Same word, different meanings.** "Order" (Ordering) and "seller order" (SellerCentral); "store deal"
  (Catalog, advertised only) and "seller deal" (SellerCentral, actually priced). See the
  [glossary](ontology/01-domain/glossary.md).
- **Logical boundaries versus code.** Orders are stored in `AccountProvider` but belong to Ordering
  ([ADR-002](ontology/00-meta/decisions/ADR-002-separate-shopping-and-ordering.md)). Checkout orchestrates
  three contexts from one UI function.
- **A published language.** SellerCentral translates listings into Catalog's `Product` shape, so Shopping
  and Ordering never see a seller listing
  ([ADR-003](ontology/00-meta/decisions/ADR-003-catalog-product-is-the-storefront-language.md)).
- **Use cases with real alternative flows**, taken from validation messages and branches, with
  "(not built)" steps where the BRD expects more. See [Ordering's
  use cases](ontology/03-bounded-contexts/ordering/use-cases.md).
- **Gaps found in the app**, recorded as rule statuses with notes. For example:
  - SHP-BR-007: moving a wish-list item into a full basket line drops it from the list without adding it.
  - ORD-BR-010: checkout ignores a failed `recordSale`, so a seller can miss a sale.
  - SEL-BR-024: sellers cannot cancel a `New` order.
  - REV-BR-007: the rating histogram is synthesised from the average.

## What the tools report on HexCommerce

Run from the repository root, with `../hex-commerce-source-ui` checked out:

| Command | Result |
| --- | --- |
| `validate.mjs` | 0 errors, 0 warnings. Every `code_refs` file and `#symbol`, and every code path quoted in the text, exists. |
| `ontology.mjs gaps` | No gaps. It first found CAT-BR-015 missing from *Known gaps* and CFG-BR-006 orphaned; both are now fixed. |
| `ontology.mjs boundaries` | No undeclared crossings. It first found CustomerService importing Shopping's store, which led to REL-15 and a known issue. |
| `ontology.mjs mine-rules --path src --uncited` | 214 candidate lines for the `ontology-rule-miner` skill to triage: 31 in code no rule cites (for example the password-reset email check, the seller dashboard's "needs attention" listings, the free-delivery progress bar), and 183 in cited files whose function no rule names. Most are presentation or already covered. |
| `ontology.mjs language --path src --context Shopping` | "cart" (89 hits, SHP-Q-01), plus generic words to dismiss |
| `ontology.mjs coverage` | 0 test files: HexCommerce has no test suite, so every rule is untested. That is the starting point for the `ontology-tests` skill. |
| `ontology.mjs affected src/context/StoreProvider.tsx` | The Shopping aggregates, 16 rules, 9 commands and 6 read models that cite the file |

## Validating against the code

The ontology's `code_root` points at `../../../../hex-commerce-source-ui`, the HexCommerce repository
checked out next to this one:

```bash
node example/hex-commerce/ontology/tools/validate.mjs
node example/hex-commerce/ontology/tools/validate.mjs --code-root /path/to/hex-commerce-source-ui
```

Without the source repository, the code checks are skipped with a notice and the structural checks still
run.

## How it was produced

Claude Code followed [`extracting-from-code.md`](ontology/00-meta/extracting-from-code.md), which the
`ontology-extract` skill now packages:

1. It read the types, every client store, the domain functions, the validation in editor components,
   and the routes.
2. It identified contexts from linguistic boundaries and from which actor owns each decision.
3. It recorded each rule with the code that enforces it, wrote the use cases from the routes and
   branches, and matched each to its BRD v3.0 requirement or process.
4. It recorded disagreements between the code and the BRD as `partial` or `not-implemented`, instead of
   resolving them silently.
5. It ran `validate.mjs`, `gaps` and `boundaries`, and fixed or recorded every finding.
