---
id: CustomerService.commands
type: commands
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
---

# CustomerService — commands

### RaiseIssue

- **Intent:** Get help with something the shopper ordered.
- **Actor:** ACT-SHOPPER
- **Target:** `CustomerService.SupportIssue` (creates)
- **Input:** an `CustomerService.OrderedItem`, a topic, optional details
- **Rejected when:** CS-BR-001, CS-BR-002
- **On success:** an `Open` issue with the shopper's message; emits `CustomerService.IssueRaised`, which
  triggers `CustomerService.AcknowledgeNewIssue`
- **Code:** `src/components/support/CustomerServiceView.tsx` (`handleCreate`)

### ReplyToIssue

- **Intent:** Add to the conversation.
- **Actor:** ACT-SHOPPER
- **Target:** `CustomerService.SupportIssue` (changes)
- **Input:** issue id, text
- **Rejected when:** CS-BR-010
- **On success:** message added, status per CS-BR-006, marked read; emits `CustomerService.ShopperReplied`
- **Code:** `src/components/support/CustomerServiceView.tsx` (`handleReply`)

### MarkIssueRead

- **Intent:** Acknowledge having seen the latest reply.
- **Actor:** ACT-SHOPPER (by opening the issue)
- **Target:** `CustomerService.SupportIssue` (changes)
- **Input:** issue id
- **Rejected when:** never
- **On success:** `read` is true; emits `CustomerService.IssueRead`
- **Code:** `src/components/support/CustomerServiceView.tsx` (`toggleExpand`)
