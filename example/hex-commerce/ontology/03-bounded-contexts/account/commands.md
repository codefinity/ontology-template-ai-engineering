---
id: Account.commands
type: commands
context: Account
status: implemented
last_reviewed: 2026-10-27
---

# Account — commands

All commands are issued by ACT-SHOPPER and target `Account.CustomerAccount`.

## Addresses

### AddAddress

- **Intent:** Save a new place to deliver to.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** label, recipient name, line 1, line 2, city, state, postcode, country; make default?
- **Rejected when:** ACC-BR-004
- **On success:** address added, and becomes the default if asked or if it is the first (ACC-BR-002);
  emits `Account.AddressAdded`
- **Code:** `src/context/AccountProvider.tsx` (`addAddress`)

### UpdateAddress

- **Intent:** Correct a saved address.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** address id and the address fields; make default?
- **Rejected when:** ACC-BR-004
- **On success:** emits `Account.AddressUpdated`. Orders already placed keep their copy (ORD-BR-005).
- **Code:** `src/context/AccountProvider.tsx` (`updateAddress`)

### RemoveAddress

- **Intent:** Forget a saved address.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** address id
- **Rejected when:** ACC-BR-001 (it is the last address)
- **On success:** default and deliver-to are repaired (ACC-BR-002, ACC-BR-003); emits `Account.AddressRemoved`
- **Code:** `src/context/AccountProvider.tsx` (`removeAddress`)

### SetDefaultAddress

- **Intent:** Make an address the usual one.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** address id
- **Rejected when:** never
- **On success:** emits `Account.DefaultAddressChanged`
- **Code:** `src/context/AccountProvider.tsx` (`setDefaultAddress`)

### ChooseDeliverTo

- **Intent:** Choose where deliveries go now.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** address id
- **Rejected when:** ACC-BR-003 (not a saved address); ignored silently
- **On success:** emits `Account.DeliverToChanged`
- **Code:** `src/context/AccountProvider.tsx` (`setDeliverTo`), `src/components/layout/DeliverToMenu.tsx`

## Cards

### AddPaymentMethod

- **Intent:** Save a card for checkout.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** card number, expiry; make default?
- **Rejected when:** ACC-BR-005, ACC-BR-006
- **On success:** brand, last four and expiry kept (ACC-BR-007, ACC-BR-008); emits `Account.PaymentMethodAdded`
- **Code:** `src/context/AccountProvider.tsx` (`addPaymentMethod`), `src/components/account/PaymentMethodsCard.tsx`

### RemovePaymentMethod

- **Intent:** Forget a saved card.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** card id
- **Rejected when:** ACC-BR-001 (it is the last card)
- **On success:** default repaired (ACC-BR-002); emits `Account.PaymentMethodRemoved`
- **Code:** `src/context/AccountProvider.tsx` (`removePaymentMethod`)

### SetDefaultPaymentMethod

- **Intent:** Make a card the usual one.
- **Actor:** ACT-SHOPPER
- **Target:** `Account.CustomerAccount` (changes)
- **Input:** card id
- **Rejected when:** never
- **On success:** emits `Account.DefaultPaymentMethodChanged`
- **Code:** `src/context/AccountProvider.tsx` (`setDefaultPayment`)
