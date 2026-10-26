---
id: CustomerService.value-objects
type: value-objects
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
---

# CustomerService — value objects

### OrderedItem

- **Meaning:** An item the shopper bought, in this context's own terms. This is the **anticorruption
  layer** over Ordering (REL-11): CustomerService never works with `Ordering.Order` directly.
- **Attributes:** order reference, order date, delivery date, order status, item id, quantity, title
  captured at checkout
- **Constraints:** CS-BR-001
- **Equality:** by order reference and item id
- **Used by:** `CustomerService.RaiseIssue`, `CustomerService.ContactableItems`
- **Code:** `src/data/support.ts` (`OrderedItem`, `getOrderedItems`)

### SupportTopic

- **Meaning:** What went wrong.
- **Attributes:** one of: Item arrived damaged or defective; Item never arrived; Wrong item delivered;
  Parts or accessories missing; Item not as described; Request a return; Refund not received; Billing or
  payment query; Something else
- **Constraints:** CS-BR-003
- **Equality:** by value
- **Used by:** `CustomerService.SupportIssue`
- **Code:** `src/data/support.ts` (`SUPPORT_TOPICS`)
