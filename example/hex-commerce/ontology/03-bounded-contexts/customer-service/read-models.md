---
id: CustomerService.read-models
type: read-models
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
---

# CustomerService — read models and queries

### ContactableItems

- **Answers:** Which items can the shopper raise an issue about?
- **Shape:** list of `CustomerService.OrderedItem`, newest order first
- **Derived from:** `Ordering.OrderHistory` (translated)
- **Rules:** CS-BR-001
- **Consumers:** ACT-SHOPPER (issue form)
- **Published:** no
- **Code:** `src/data/support.ts` (`getOrderedItems`)

### IssueList

- **Answers:** What has the shopper raised, and where does each issue stand?
- **Shape:** issues, newest first, each with status, unread flag and thread
- **Derived from:** `CustomerService.SupportIssue`
- **Rules:** CS-BR-006, CS-BR-007
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/components/support/CustomerServiceView.tsx`

### OpenIssueCount

- **Answers:** How many of the shopper's issues are not resolved?
- **Shape:** number
- **Derived from:** `CustomerService.SupportIssue`
- **Rules:** none
- **Consumers:** ACT-SHOPPER
- **Published:** no
- **Code:** `src/components/support/CustomerServiceView.tsx` (`openCount`)
