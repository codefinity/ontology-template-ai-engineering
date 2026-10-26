---
id: ontology.index
type: index
status: implemented
last_reviewed: 2026-10-27
code_root: ../../../../hex-commerce-source-ui   # the HexCommerce repository, checked out next to this one
owners: [Product Owner]
sources:
  - hex-commerce-source-ui (Next.js storefront), read in full on 2026-10-27
  - docs/HexCommerce_Business_Requirements_Document_v3.0.docx (BRD v3.0, 22 October 2026)
---

# HexCommerce — Business Ontology

HexCommerce is an online marketplace. Shoppers browse eight departments, collect items in a basket or
wish list, check out, and follow their orders. Independent businesses apply to sell; once an administrator
approves them, they list products, run time-limited deals and fulfil the orders shoppers place for their
items. Their listings are sold alongside the store's own catalogue.

This ontology describes the **as-built** demonstration application (`hex-commerce-source-ui`). Where a
target-state BRD v3.0 requirement corresponds to a rule, the rule cites it. Rules the BRD requires but the
application does not yet meet are marked `partial` or `not-implemented`.

It follows the strategic patterns of Domain-Driven Design:

- the **problem space** is described as a domain with subdomains (`01-domain/`);
- the **solution space** is split into nine bounded contexts, and the
  [context map](02-context-map/context-map.md) shows how they relate;
- each **bounded context** owns its ubiquitous language, model and rules in its own folder
  (`03-bounded-contexts/<context-name>/`).

## How to read it

| If you want to… | Read |
| --- | --- |
| Understand the business in five minutes | [Domain vision](01-domain/domain-vision.md) |
| Know what a word means | [Glossary](01-domain/glossary.md), then the owning context's `ubiquitous-language.md` |
| Find which context owns a concept | [Bounded contexts](#bounded-contexts) below |
| See how contexts work together | [Context map](02-context-map/context-map.md), [cross-context flows](02-context-map/cross-context-flows.md) |
| Change behaviour in code | The context `README.md`, then `business-rules.md`, then the aggregate file |
| Add to or change this ontology | [Conventions](00-meta/conventions.md), [Maintaining](00-meta/maintaining.md) |

## Bounded contexts

| Context | Code | Subdomain | Type | Purpose |
| --- | --- | --- | --- | --- |
| [Catalog](03-bounded-contexts/catalog/README.md) | `CAT` | `SD-DISCOVERY` | core | The store's products and departments, and finding things to buy |
| [Shopping](03-bounded-contexts/shopping/README.md) | `SHP` | `SD-PURCHASING` | core | The basket, saved-for-later list and wish list, with stock limits and totals |
| [Ordering](03-bounded-contexts/ordering/README.md) | `ORD` | `SD-PURCHASING` | core | Checkout, placed orders and their history |
| [SellerCentral](03-bounded-contexts/seller-central/README.md) | `SEL` | `SD-MARKETPLACE` | core | A seller's listings, deals and orders, and their storefront feed |
| [SellerOnboarding](03-bounded-contexts/seller-onboarding/README.md) | `SON` | `SD-SELLER-ONBOARDING` | supporting | Applying to sell, the admin decision and the seller profile |
| [CustomerService](03-bounded-contexts/customer-service/README.md) | `CS` | `SD-CUSTOMER-CARE` | supporting | Issues raised against ordered items, and their message threads |
| [Reviews](03-bounded-contexts/reviews/README.md) | `REV` | `SD-TRUST` | supporting | Customer reviews, verified purchases and helpful votes |
| [Account](03-bounded-contexts/account/README.md) | `ACC` | `SD-CUSTOMER-ACCOUNTS` | generic | The shopper, their address book and saved cards |
| [StoreConfig](03-bounded-contexts/store-config/README.md) | `CFG` | `SD-STORE-CONFIGURATION` | generic | Brand, currency, delivery and tax settings, money and the store clock |

## Folder layout

```text
ontology/
├── README.md                 this index
├── CLAUDE.md                 instructions for Claude Code
├── 00-meta/                  conventions, maintenance, extraction playbook, changelog
├── 01-domain/                domain vision, subdomains, actors, glossary
├── 02-context-map/           context map and cross-context flows
├── 03-bounded-contexts/      one folder per bounded context (copy _context-template for a new one)
└── tools/validate.mjs        structural checks: node tools/validate.mjs
```

## Checking the ontology

```bash
node example/hex-commerce/ontology/tools/validate.mjs     # from the repository root
```

The validator checks front matter, unique IDs, that every referenced concept and rule exists, that
links resolve, and that `code_refs` and quoted code paths exist in the HexCommerce repository. Code checks
are skipped with a notice when that repository is not checked out at `code_root`.
