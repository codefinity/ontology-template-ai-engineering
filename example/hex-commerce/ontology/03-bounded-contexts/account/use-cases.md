---
id: Account.use-cases
type: use-cases
context: Account
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P07 (addresses and cards), P12 (register, sign in), P16 (delivery address)
---

# Account — use cases

### ACC-UC-01 Keep delivery addresses up to date
- **Actor:** ACT-SHOPPER
- **Goal:** Have the right places to deliver to, ready at checkout.
- **Trigger:** The shopper opens the address book.
- **Preconditions:** none
- **Main flow:**
  1. The shopper adds an address: label, recipient, street, city, postcode, country, and optionally
     makes it the default.
  2. The system checks the required details (ACC-BR-004), saves the address, and makes it the default
     if asked or if it is the first one (ACC-BR-002).
  3. The shopper edits or removes addresses, or makes another one the default.
- **Alternative flows:**
  - `2a.` A required detail is missing: the shopper is told which, and nothing is saved.
  - `3a.` The shopper removes the last address: it is kept (ACC-BR-001).
  - `3b.` The shopper removes the default address: the first remaining address becomes the default. If
    the removed address was the deliver-to address, the default takes its place (ACC-BR-002, ACC-BR-003).
- **Postconditions:** At least one address exists, and exactly one is the default.
- **Commands:** `Account.AddAddress`, `Account.UpdateAddress`, `Account.RemoveAddress`, `Account.SetDefaultAddress`
- **Rules:** ACC-BR-001, ACC-BR-002, ACC-BR-003, ACC-BR-004
- **Status:** implemented
- **Code:** `src/app/account/page.tsx`, `src/components/account/AddressBook.tsx`
- **Source:** P07

### ACC-UC-02 Keep payment cards up to date
- **Actor:** ACT-SHOPPER
- **Goal:** Have a valid card ready at checkout.
- **Trigger:** The shopper opens saved cards.
- **Preconditions:** none
- **Main flow:**
  1. The shopper enters a card number and expiry, and optionally makes it the default.
  2. The system checks the number length and the expiry (ACC-BR-005, ACC-BR-006), works out the brand
     (ACC-BR-007), and keeps only the brand, last four digits and expiry (ACC-BR-008).
  3. The shopper removes cards or changes the default.
- **Alternative flows:**
  - `2a.` The number is not 13–19 digits, or the expiry is malformed or already past: the shopper is told
    which, and nothing is saved.
  - `3a.` The shopper removes the last card: it is kept (ACC-BR-001).
  - `3b.` (not built) A saved card expires: the BRD forbids keeping it as the default or using it
    (ACC-BR-006, partial).
- **Postconditions:** At least one card exists, and exactly one is the default.
- **Commands:** `Account.AddPaymentMethod`, `Account.RemovePaymentMethod`, `Account.SetDefaultPaymentMethod`
- **Rules:** ACC-BR-001, ACC-BR-002, ACC-BR-005, ACC-BR-006, ACC-BR-007, ACC-BR-008
- **Status:** partial
- **Code:** `src/components/account/PaymentMethodsCard.tsx`
- **Source:** P07

### ACC-UC-03 Choose where the next order goes
- **Actor:** ACT-SHOPPER
- **Goal:** Have the next order delivered to a particular saved address.
- **Trigger:** The shopper opens the "deliver to" choice.
- **Preconditions:** The shopper has saved addresses.
- **Main flow:**
  1. The shopper picks a saved address.
  2. The system uses it as the deliver-to address, here and at checkout (ACC-BR-003).
- **Alternative flows:**
  - `1a.` The shopper wants a new address: they add it first (ACC-UC-01).
- **Postconditions:** Checkout starts from the chosen address.
- **Commands:** `Account.ChooseDeliverTo`
- **Rules:** ACC-BR-003
- **Status:** implemented
- **Code:** `src/components/layout/DeliverToMenu.tsx`
- **Source:** P16

### ACC-UC-04 Register and sign in
- **Actor:** ACT-VISITOR
- **Goal:** Have a personal account, so that baskets, orders and details follow the shopper.
- **Trigger:** A visitor registers or signs in.
- **Preconditions:** none
- **Main flow:**
  1. The visitor registers with name, email and password, or signs in with email and password.
  2. The system checks the details against the password policy and the registered accounts.
  3. The system starts a session for the shopper.
- **Alternative flows:**
  - `2a.` Wrong credentials: the visitor is told the email or password is incorrect, without saying
    which.
  - `2b.` Repeated failures: sign-in is locked for a time.
- **Postconditions:** The shopper is signed in.
- **Commands:** none modelled yet; changes `Account.CustomerAccount`
- **Rules:** ACC-BR-009
- **Status:** not-implemented
- **Code:** `src/app/signin/page.tsx`, `src/app/register/page.tsx` (presentation only)
- **Source:** P12
