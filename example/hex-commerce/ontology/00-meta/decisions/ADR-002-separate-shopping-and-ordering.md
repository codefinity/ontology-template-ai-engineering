---
id: ADR-002
type: decision
status: implemented
last_reviewed: 2026-10-27
owners: [Product Owner]
---

# ADR-002 Shopping and Ordering are separate bounded contexts

## Context

Both serve `SD-PURCHASING`, and in code checkout sits between them. The basket (`StoreProvider`) and the
orders (`AccountProvider`) live in different stores, and orders sit next to the address book, not next
to the basket.

## Options considered

1. **One Purchasing context**, with Basket and Order as two aggregates. Fewer relationships.
2. **Two contexts.** Shopping holds intentions, priced live; Ordering holds immutable records,
   priced as placed.
3. **Ordering inside Account**, as the code stores it.

## Decision

Option 2. The language differs: a basket line's price changes with the catalogue and deals
(SHP-BR-016), while an order item's price never does (ORD-BR-005). "Units available" and the basket limit
mean nothing once an order is placed. The two also change for different reasons: merchandising and
conversion for Shopping, fulfilment and finance for Ordering. Option 3 was rejected because the
address book is generic and orders are core.

## Consequences

- REL-07 (Customer–Supplier) is the contract at checkout. Ordering copies, and never references, basket
  lines.
- The code's placement of orders in `AccountProvider` is recorded as a mismatch (Ordering README,
  *Implementation notes*; the context map's *Known issues*).
