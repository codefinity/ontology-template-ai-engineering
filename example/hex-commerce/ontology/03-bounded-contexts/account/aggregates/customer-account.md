---
id: Account.CustomerAccount
type: aggregate
context: Account
status: implemented
last_reviewed: 2026-10-27
code_refs:
  - src/context/AccountProvider.tsx#withDefault
  - src/lib/types.ts#Address
  - src/lib/types.ts#PaymentMethod
---

# CustomerAccount (aggregate)

## Definition

The signed-in shopper together with their account book. The address book and saved cards form one
aggregate with the shopper because their invariants (exactly one default, never empty, deliver-to always
valid) must hold together after every change.

## Structure

### CustomerAccount

Root entity. As-built there is one, the always-signed-in shopper.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| name | text | yes | Shopper's name | `currentUser.name` |
| email | email | yes | Shopper's email | `currentUser.email` |
| memberSince | date | yes | Registration date | `currentUser.memberSince` |
| addresses | list of `Account.Address` | yes, ≥ 1 | Address book | `addresses` |
| paymentMethods | list of `Account.PaymentMethod` | yes, ≥ 1 | Saved cards | `paymentMethods` |
| deliverToId | `Account.Address` id | yes | Current delivery address | `deliverToId` |

### Address

Entity. Identity: `id` (`addr-xxxxx`).

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| id | text | yes | Identifier | `id` |
| label | text | yes (blank becomes "Home") | Name of the place | `label` |
| name | text | yes | Recipient | `name` |
| line1 | text | yes | Street address | `line1` |
| line2 | text | no | Flat, unit | `line2` |
| city | text | yes | City | `city` |
| state | text | no | State or county | `state` |
| postcode | text | yes | Postcode | `postalCode` |
| country | text | yes | Country | `country` |
| isDefault | boolean | yes | The default address | `isDefault` |

### PaymentMethod

Entity. Identity: `id` (`pm-xxxxx`). Business term: *card*.

| Attribute | Type | Required | Meaning | Code |
| --- | --- | --- | --- | --- |
| id | text | yes | Identifier | `id` |
| brand | `Account.CardBrand` | yes | Derived from the card number | `brand` |
| last4 | 4 digits | yes | Last four digits | `last4` |
| expiry | `Account.CardExpiry` | yes | MM/YY | `expiry` |
| isDefault | boolean | yes | The default card | `isDefault` |

## Invariants

- ACC-BR-001 — Never remove the last address or card
- ACC-BR-002 — Exactly one default address and card
- ACC-BR-003 — Deliver-to is always a saved address
- ACC-BR-004 — Required address details
- ACC-BR-005 — Card number length
- ACC-BR-006 — Card expiry
- ACC-BR-008 — Only masked card data is kept

## Behaviour

| Commands handled | Events emitted |
| --- | --- |
| `Account.AddAddress` | `Account.AddressAdded` |
| `Account.UpdateAddress` | `Account.AddressUpdated` |
| `Account.RemoveAddress` | `Account.AddressRemoved` |
| `Account.SetDefaultAddress` | `Account.DefaultAddressChanged` |
| `Account.ChooseDeliverTo` | `Account.DeliverToChanged` |
| `Account.AddPaymentMethod` | `Account.PaymentMethodAdded` |
| `Account.RemovePaymentMethod` | `Account.PaymentMethodRemoved` |
| `Account.SetDefaultPaymentMethod` | `Account.DefaultPaymentMethodChanged` |

## Example

From `src/data/account.ts`, trimmed to one entry each:

```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@example.com",
  "memberSince": "2019-06-14",
  "addresses": [
    { "id": "addr-1", "label": "Home", "name": "Alex Morgan", "line1": "42 Northgate Street",
      "line2": "Flat 3B", "city": "Manchester", "state": "Greater Manchester",
      "postalCode": "M4 1HN", "country": "United Kingdom", "isDefault": true }
  ],
  "paymentMethods": [
    { "id": "pm-1", "brand": "Visa", "last4": "4242", "expiry": "08/28", "isDefault": true }
  ],
  "deliverToId": "addr-1"
}
```

## Implementation

- **Types:** `src/lib/types.ts` (`User`, `Address`, `PaymentMethod`)
- **State changes:** `src/context/AccountProvider.tsx` (reducer; `withDefault`)
- **Validation:** `src/components/account/AddressBook.tsx`, `src/components/account/PaymentMethodsCard.tsx`
- **Persistence:** `localStorage` key `hexcommerce.account.v1`
