---
id: CustomerService.rules
type: business-rules
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 8.5 (customer service)
---

# CustomerService — business rules

## Raising an issue

### CS-BR-001 Issues only about items actually ordered
- **Statement:** An issue can be raised only about an item from one of the shopper's orders that is not
  cancelled.
- **Kind:** validation
- **Applies to:** `CustomerService.SupportIssue`, `CustomerService.OrderedItem`
- **Status:** implemented
- **Code:** `src/data/support.ts` (`getOrderedItems`)
- **Source:** BR-ORD-007

### CS-BR-002 An item and a topic are required
- **Statement:** An issue needs the item it is about and a topic. Details are optional; without them, the
  first message is the topic.
- **Kind:** validation
- **Applies to:** `CustomerService.SupportIssue`
- **Status:** implemented
- **Code:** `src/components/support/CustomerServiceView.tsx` (issue form, `handleCreate`)
- **Source:** BRD v3.0 section 8.14 (customer-service issue outcomes)

### CS-BR-003 Support topics
- **Statement:** The topic is one of the nine support topics (`CustomerService.SupportTopic`).
- **Kind:** validation
- **Applies to:** `CustomerService.SupportTopic`
- **Status:** implemented
- **Code:** `src/data/support.ts` (`SUPPORT_TOPICS`)
- **Source:** BRD v3.0 section 9.4 (reference data)

### CS-BR-004 Issue reference
- **Statement:** An issue is referenced `CS-NNNNN`.
- **Kind:** constraint
- **Applies to:** `CustomerService.SupportIssue`
- **Status:** implemented
- **Code:** `src/components/support/CustomerServiceView.tsx` (`handleCreate`)
- **Source:** BR-CS-002

### CS-BR-005 Every issue is acknowledged with a 24-hour promise
- **Statement:** A new issue is `Open` and is acknowledged at once by the support team. The
  acknowledgement gives the reference and promises a reply within 24 hours.
- **Kind:** policy
- **Applies to:** `CustomerService.SupportIssue`
- **Status:** partial
- **Code:** `src/components/support/CustomerServiceView.tsx` (`handleCreate`)
- **Source:** BR-CS-003
- **Notes:** The promise is stated but not tracked or enforced.

### CS-BR-008 Asking for a return
- **Statement:** A shopper asks to return or replace a delivered order by raising an issue with the topic
  "Request a return". Coming from that order, the order and topic are preselected.
- **Kind:** policy
- **Applies to:** `CustomerService.RaiseIssue`
- **Status:** partial
- **Code:** `src/components/support/CustomerServiceView.tsx` (`RETURN_TOPIC`, `initialOrderId`)
- **Source:** BR-CS-004, BR-ORD-006
- **Notes:** The BRD target replaces this with a return request that has its own lifecycle (P25).

## Conversation

### CS-BR-006 Issue statuses and how a shopper reply moves them
- **Statement:** An issue is `Open`, `In review`, `Awaiting your reply` or `Resolved`. A shopper reply
  moves an issue that is `Awaiting your reply` or `Resolved` to `In review`, and leaves an `Open` or
  `In review` issue as it is.
- **Kind:** invariant
- **Applies to:** `CustomerService.SupportIssue`
- **Status:** implemented
- **Code:** `src/components/support/CustomerServiceView.tsx` (reducer case `reply`)
- **Source:** BR-CS-001

### CS-BR-007 Unread replies
- **Statement:** An issue is unread while it has a support reply the shopper has not opened. Opening the
  issue, or replying to it, marks it read.
- **Kind:** invariant
- **Applies to:** `CustomerService.SupportIssue`
- **Status:** implemented
- **Code:** `src/components/support/CustomerServiceView.tsx` (reducer cases `markRead`, `reply`)
- **Source:** FR-CS (BRD v3.0)

### CS-BR-010 A reply cannot be empty
- **Statement:** A reply needs some text after trimming.
- **Kind:** validation
- **Applies to:** `CustomerService.ReplyToIssue`
- **Status:** implemented
- **Code:** `src/components/support/CustomerServiceView.tsx` (reply form)
- **Source:** BRD v3.0 data dictionary (Customer-service reply)

### CS-BR-009 Support agents work issues
- **Statement:** A support agent can reply and set any status, and add internal notes that are never shown
  to the shopper.
- **Kind:** policy
- **Applies to:** `CustomerService.SupportIssue`
- **Status:** not-implemented
- **Code:** —
- **Source:** BR-CS-001, BR-CS-005 (process P22)
- **Notes:** Agent replies appear only in sample data.
