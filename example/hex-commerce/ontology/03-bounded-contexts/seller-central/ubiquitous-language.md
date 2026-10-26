---
id: SellerCentral.language
type: ubiquitous-language
context: SellerCentral
status: implemented
last_reviewed: 2026-10-27
---

# SellerCentral — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Buyer | The shopper who bought a listing, known here only by name and city. | `SellerOrder.buyer`, `city` | customer (implies contact details) | `SellerCentral.SellerOrder` |
| Claimed units | Units of a deal already bought at the deal price. | `claimed` | sold (sold counts all sales) | `SellerCentral.SellerDeal` |
| Condition | The state an item is sold in: New, Renewed, Used – like new, Used – good. | `ListingCondition` | grade | `SellerCentral.ListingCondition` |
| Cover image | The first image of a listing, shown on cards. | `images[0]` | thumbnail | `SellerCentral.ListingImages` |
| Deal | A seller-run, time-limited percentage discount on one of their listings. | `SellerDeal` | promotion, store deal (that is Catalog's) | `SellerCentral.SellerDeal` |
| Deal price | A listing's price with the deal's discount applied, rounded to the cent. | `sellerDealPrice` | sale price | `SellerCentral.SellerDeal` |
| Deal units | Units the seller has committed to sell at the deal price. | `dealStock` | deal stock (code only) | `SellerCentral.SellerDeal` |
| Estimated payout | Revenue less the referral fee. | `SellerSummary.payout` | earnings, balance | `SellerCentral.SellerSummary` |
| Listing | A product a seller offers for sale. | `SellerListing` | product (that is the storefront shape), item | `SellerCentral.SellerListing` |
| Referral fee | The marketplace's share of a sale. Flat 12% as-built. | `SELLER_REFERRAL_FEE` | commission | `SellerCentral.SellerSummary` |
| Revenue | Unit price × quantity over seller orders that are not cancelled. | `SellerSummary.revenue` | sales | `SellerCentral.SellerSummary` |
| Running deal | The one deal that currently prices a listing for shoppers. | `runningDealFor` | active deal, live deal (Live is a status) | `SellerCentral.RunningDeal` |
| Seller order | The seller's record of one sale of one listing. | `SellerOrder` | order (that is the shopper's, in Ordering) | `SellerCentral.SellerOrder` |
| Storefront product | A sellable listing as shoppers see it, in the `Catalog.Product` shape. | `toStorefrontProduct` | | `SellerCentral.StorefrontProduct` |
| "Was" price | An optional higher reference price on a listing. | `SellerListing.listPrice` | list price (Catalog's term) | `SellerCentral.SellerListing` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Dispatch | Confirm a seller order has been sent. | `setOrderStatus(id, 'Dispatched')` | ship | `SellerCentral.DispatchSellerOrder` |
| End a deal | Stop a deal early; it stays ended. | `setDealStatus(id, 'Ended')` | cancel | `SellerCentral.EndDeal` |
| Publish | Make a listing sellable again. | `setListingStatus` | activate | `SellerCentral.PublishListing` |
| Record a sale | Turn a marketplace line of a shopper's order into a seller order. | `recordSale` | | `SellerCentral.RecordSale` |
| Save as draft | Save a listing without offering it to shoppers. | `createListing(draft, false)` | | `SellerCentral.CreateListing` |
| Start early | Begin a scheduled deal today. | `setDealStatus(id, 'Live')` | | `SellerCentral.StartDealEarly` |
| Unpublish | Stop selling a listing without deleting it. | `setListingStatus(id, 'Unpublished')` | deactivate, hide | `SellerCentral.UnpublishListing` |

## States and statuses

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Active | Listing on sale to shoppers. | `'Active'` | live (that is a deal status) | `SellerCentral.SellerListing` |
| Draft | Listing saved but never offered to shoppers. | `'Draft'` | | `SellerCentral.SellerListing` |
| Out of stock | Listing published but with no units; shown as unavailable. | `'Out of stock'` | sold out | `SellerCentral.SellerListing` |
| Unpublished | Listing withdrawn by the seller; shown as unavailable. | `'Unpublished'` | inactive | `SellerCentral.SellerListing` |
| Scheduled | Deal whose start date is after today. | `'Scheduled'` | upcoming | `SellerCentral.SellerDeal` |
| Live | Deal within its dates and not ended. It may still be *paused*. | `'Live'` | running (see Running deal) | `SellerCentral.SellerDeal` |
| Paused | A Live deal that does not reach shoppers: the listing is not Active, all units are claimed, or another deal is running. Not stored. | `dealPausedReason` | | `SellerCentral.DealPausedReason` |
| Ended | Deal past its end date or ended by the seller. | `'Ended'` | expired | `SellerCentral.SellerDeal` |
| New | Seller order waiting to be dispatched. | `'New'` | pending | `SellerCentral.SellerOrder` |
| Dispatched | Seller order sent. | `'Dispatched'` | shipped | `SellerCentral.SellerOrder` |
| Delivered | Seller order received by the buyer. | `'Delivered'` | | `SellerCentral.SellerOrder` |
| Cancelled | Seller order that will not be fulfilled; excluded from revenue. | `'Cancelled'` | | `SellerCentral.SellerOrder` |
