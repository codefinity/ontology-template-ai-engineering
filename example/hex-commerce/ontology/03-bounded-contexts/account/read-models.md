---
id: Account.read-models
type: read-models
context: Account
status: implemented
last_reviewed: 2026-10-27
---

# Account — read models and queries

## Published to other contexts

### CurrentShopper

- **Answers:** Who is signed in?
- **Shape:** name, email, member-since date
- **Derived from:** `Account.CustomerAccount`
- **Rules:** ACC-BR-009
- **Consumers:** Reviews (review author), CustomerService (first name in messages), SellerOnboarding
  (prefills the application), all through REL-13
- **Published:** yes (REL-13)
- **Code:** `src/data/account.ts` (`currentUser`)

### DeliverTo

- **Answers:** Where should this shopper's order go?
- **Shape:** an address
- **Derived from:** `Account.CustomerAccount`
- **Rules:** ACC-BR-003
- **Consumers:** Ordering (checkout copies it into `Ordering.AddressSnapshot`, REL-08); the header's
  "Deliver to" menu
- **Published:** yes (REL-08)
- **Code:** `src/context/AccountProvider.tsx` (`deliverTo`)

### SavedCards

- **Answers:** Which cards can this shopper pay with, and which is the default?
- **Shape:** list of cards (brand, last four, expiry), and the default card
- **Derived from:** `Account.CustomerAccount`
- **Rules:** ACC-BR-002, ACC-BR-008
- **Consumers:** Ordering (checkout copies the chosen card into `Ordering.PaymentSnapshot`, REL-08); the
  account page
- **Published:** yes (REL-08)
- **Code:** `src/context/AccountProvider.tsx` (`paymentMethods`, `defaultPaymentMethod`)

## For the shopper

### RecentlyViewed

- **Answers:** What has the shopper looked at recently?
- **Shape:** product ids, newest first
- **Derived from:** sample data (no tracking is built)
- **Rules:** none
- **Consumers:** ACT-SHOPPER (account page)
- **Published:** no
- **Code:** `src/data/account.ts` (`recentlyViewedIds`)
