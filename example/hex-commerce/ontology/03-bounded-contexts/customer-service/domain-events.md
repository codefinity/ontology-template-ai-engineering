---
id: CustomerService.events
type: domain-events
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
---

# CustomerService — domain events and policies

## Events

### IssueRaised

- **Meaning:** A shopper reported a problem with an ordered item.
- **Emitted by:** `CustomerService.RaiseIssue`
- **Payload:** issue reference, order reference, item id, topic, first message
- **Consumers:** `CustomerService.AcknowledgeNewIssue`; in the target state, the support-agent queue
- **Scope:** internal
- **Realised as:** reducer action `create`

### ShopperReplied

- **Meaning:** The shopper added a message to an issue.
- **Emitted by:** `CustomerService.ReplyToIssue`
- **Payload:** issue reference, message, new status
- **Consumers:** none as-built; the support-agent queue in the target state
- **Scope:** internal
- **Realised as:** reducer action `reply`

### IssueRead

- **Meaning:** The shopper opened an issue with an unread reply.
- **Emitted by:** `CustomerService.MarkIssueRead`
- **Payload:** issue reference
- **Consumers:** none
- **Scope:** internal
- **Realised as:** reducer action `markRead`

## Policies

### AcknowledgeNewIssue

- **When:** `CustomerService.IssueRaised`
- **Then:** add a support message, one second later, that confirms the reference and promises a reply
  within 24 hours
- **Rules:** CS-BR-005
- **Realised as:** the second message built inside `handleCreate`, in the same step as the issue
