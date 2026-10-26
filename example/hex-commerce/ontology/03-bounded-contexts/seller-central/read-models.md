---
id: SellerCentral.read-models
type: read-models
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
---

# SellerCentral — read models and queries

## Storefront feed (published)

These read models are this context's **Open Host Service**. Each translates listings and deals into the
`Catalog.Product` published language, so the rest of the storefront never sees
`SellerCentral.SellerListing`.

### StorefrontProduct

- **Answers:** How does this listing look to a shopper, and how many units can they buy, right now?
- **Shape:** `Catalog.Product` with `seller` = business name, `slug` = listing id, price and "was" price
  per SEL-BR-019, badge, `specs.Condition`, rating 0, no keywords. Stock is 0 when the listing is not
  `Active`.
- **Derived from:** `SellerCentral.SellerListing`, `SellerCentral.RunningDeal`, `SellerOnboarding.SellerProfile`
- **Rules:** SEL-BR-003, SEL-BR-004, SEL-BR-008, SEL-BR-019, SEL-BR-027
- **Consumers:** Shopping (basket lines, REL-03); the listing page
- **Published:** yes (REL-03). Returns nothing for drafts, deleted listings, or while the seller is not
  approved.
- **Code:** `src/data/seller.ts` (`toStorefrontProduct`), `src/context/SellerProvider.tsx` (`getStorefrontProduct`)

### StorefrontProducts

- **Answers:** Which seller listings are on sale?
- **Shape:** list of `SellerCentral.StorefrontProduct` for `Active` listings
- **Derived from:** `SellerCentral.SellerListing`
- **Rules:** SEL-BR-003, SEL-BR-027
- **Consumers:** Catalog (`Catalog.MarketplaceResults`, REL-04)
- **Published:** yes (REL-04)
- **Code:** `src/context/SellerProvider.tsx` (`storefrontProducts`)

### StorefrontDeals

- **Answers:** Which seller deals can shoppers use right now?
- **Shape:** list of (deal, `SellerCentral.StorefrontProduct` priced with it)
- **Derived from:** `SellerCentral.SellerDeal`, `SellerCentral.RunningDeal`
- **Rules:** SEL-BR-017, SEL-BR-018, SEL-BR-027
- **Consumers:** Catalog (deals page, "Deals from our sellers", REL-04)
- **Published:** yes (REL-04)
- **Code:** `src/context/SellerProvider.tsx` (`storefrontDeals`), `src/components/deals/SellerDealsSection.tsx`

## For the seller

### RunningDeal

- **Answers:** Which deal, if any, prices this listing right now?
- **Shape:** `SellerCentral.SellerDeal` or nothing
- **Derived from:** `SellerCentral.SellerDeal`, `SellerCentral.SellerListing`
- **Rules:** SEL-BR-016, SEL-BR-017, SEL-BR-018
- **Consumers:** the storefront feed; `SellerCentral.RecordSale` (which deal to count claims against)
- **Published:** no
- **Code:** `src/data/seller.ts` (`runningDealFor`), `src/context/SellerProvider.tsx` (`getRunningDeal`)

### DealPausedReason

- **Answers:** Why does this Live deal not reach shoppers?
- **Shape:** text, or nothing when the deal is running: the listing was removed; the listing is not
  `Active`; every deal unit is claimed; another deal is already running
- **Derived from:** `SellerCentral.SellerDeal`, `SellerCentral.SellerListing`
- **Rules:** SEL-BR-017
- **Consumers:** ACT-SELLER (deals list)
- **Published:** no
- **Code:** `src/data/seller.ts` (`dealPausedReason`)

### SellerSummary

- **Answers:** How is the seller's business doing?
- **Shape:** counts of Active, Draft and Out-of-stock listings; units sold; revenue; estimated payout;
  number of listings with a running deal
- **Derived from:** `SellerCentral.SellerListing`, `SellerCentral.SellerOrder`, `SellerCentral.SellerDeal`
- **Rules:** SEL-BR-026
- **Consumers:** ACT-SELLER (dashboard)
- **Published:** no
- **Code:** `src/data/seller.ts` (`summariseSeller`)
