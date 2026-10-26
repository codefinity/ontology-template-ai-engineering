---
id: Account.events
type: domain-events
context: Account
status: implemented
last_reviewed: 2026-10-27
---

# Account — domain events and policies

All events are internal. Each is a reducer action in `AccountProvider` with the same name as its command
(`addAddress`, `updateAddress`, …). No other context subscribes: Ordering reads `Account.DeliverTo` and
`Account.SavedCards` when checkout opens, and copies them into the order.

## Events

### AddressAdded

- **Meaning:** The shopper saved a new address.
- **Emitted by:** `Account.AddAddress`
- **Payload:** address, whether it became the default
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `addAddress`

### AddressUpdated

- **Meaning:** The shopper changed a saved address.
- **Emitted by:** `Account.UpdateAddress`
- **Payload:** address id, new fields
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `updateAddress`

### AddressRemoved

- **Meaning:** The shopper forgot an address.
- **Emitted by:** `Account.RemoveAddress`
- **Payload:** address id, new default, new deliver-to
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `removeAddress`

### DefaultAddressChanged

- **Meaning:** A different address became the default.
- **Emitted by:** `Account.SetDefaultAddress`
- **Payload:** address id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `setDefaultAddress`

### DeliverToChanged

- **Meaning:** Deliveries now go to a different saved address.
- **Emitted by:** `Account.ChooseDeliverTo`
- **Payload:** address id
- **Consumers:** none (checkout reads it when it opens)
- **Scope:** internal
- **Realised as:** reducer action `setDeliverTo`

### PaymentMethodAdded

- **Meaning:** The shopper saved a card.
- **Emitted by:** `Account.AddPaymentMethod`
- **Payload:** brand, last four, expiry, whether it became the default
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `addPaymentMethod`

### PaymentMethodRemoved

- **Meaning:** The shopper forgot a card.
- **Emitted by:** `Account.RemovePaymentMethod`
- **Payload:** card id, new default
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `removePaymentMethod`

### DefaultPaymentMethodChanged

- **Meaning:** A different card became the default.
- **Emitted by:** `Account.SetDefaultPaymentMethod`
- **Payload:** card id
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `setDefaultPayment`

## Policies

This context has no policies.
