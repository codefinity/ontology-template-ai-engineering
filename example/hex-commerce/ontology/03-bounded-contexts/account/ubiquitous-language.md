---
id: Account.language
type: ubiquitous-language
context: Account
status: implemented
last_reviewed: 2026-10-27
---

# Account — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Account book | The shopper's saved addresses and cards. | `AccountProvider` state | wallet (cards only) | `Account.CustomerAccount` |
| Address | A saved place to deliver to, with a label such as Home or Work. | `Address` | location | `Account.Address` |
| Card | A saved payment card, kept as brand, last four digits and expiry. | `PaymentMethod` | payment method (code only), credit card | `Account.PaymentMethod` |
| Card brand | Visa, Mastercard, Amex, or Card for any other. | `brand` | network, scheme | `Account.CardBrand` |
| Default address / card | The one address or card marked as the shopper's usual choice. | `isDefault` | primary | `Account.CustomerAccount` |
| Deliver to | The address currently chosen for deliveries; checkout starts from it. | `deliverToId`, `deliverTo` | shipping address | `Account.DeliverTo` |
| Expiry | Card expiry as MM/YY. | `expiry` | expiration | `Account.CardExpiry` |
| Member since | The date the shopper registered. | `memberSince` | | `Account.CurrentShopper` |
| Recently viewed | Products the shopper looked at recently, newest first. | `recentlyViewedIds` | history | `Account.RecentlyViewed` |
| Shopper | The signed-in customer. | `User`, `currentUser` | user, customer (fine in prose) | `Account.CurrentShopper` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Add an address / card | Save a new one, optionally as the default. | `addAddress`, `addPaymentMethod` | | `Account.AddAddress` |
| Choose where to deliver | Pick which saved address deliveries go to. | `setDeliverTo` | | `Account.ChooseDeliverTo` |
| Make default | Mark an address or card as the usual one. | `setDefaultAddress`, `setDefaultPayment` | | `Account.SetDefaultAddress` |
| Remove an address / card | Delete a saved one, unless it is the last. | `removeAddress`, `removePaymentMethod` | | `Account.RemoveAddress` |
