---
id: CustomerService.language
type: ubiquitous-language
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
---

# CustomerService — ubiquitous language

## Nouns

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Acknowledgement | The support team's first reply, confirming the reference and the 24-hour promise. | second message, `SUPPORT_NAME` | auto-reply | `CustomerService.AcknowledgeNewIssue` |
| Issue | A problem a shopper raised about one ordered item, with its conversation. | `SupportIssue` | ticket, case, complaint | `CustomerService.SupportIssue` |
| Issue reference | `CS-NNNNN`. | `SupportIssue.id` | ticket number | `CustomerService.SupportIssue` |
| Message | One entry in an issue's thread, from the shopper or support. | `SupportMessage` | comment, note | `CustomerService.SupportMessage` |
| Ordered item | One item of an order that was not cancelled, as this context sees it. | `OrderedItem` | order line (Ordering's term) | `CustomerService.OrderedItem` |
| Topic | What went wrong, chosen from a fixed list. | `topic`, `SUPPORT_TOPICS` | category, reason | `CustomerService.SupportTopic` |
| Unread reply | A support message the shopper has not opened yet. | `read: false` | notification | `CustomerService.SupportIssue` |

## Verbs and actions

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Raise an issue | Report a problem with an ordered item. | `handleCreate` | open a ticket | `CustomerService.RaiseIssue` |
| Reply | Add a message to an issue. | `handleReply` | comment | `CustomerService.ReplyToIssue` |

## States and statuses

| Term | Definition | Code | Avoid | Model |
| --- | --- | --- | --- | --- |
| Open | Raised, not yet picked up. | `'Open'` | new | `CustomerService.SupportIssue` |
| In review | Support is working on it. | `'In review'` | in progress | `CustomerService.SupportIssue` |
| Awaiting your reply | Support needs something from the shopper. Shown as "Your reply needed". | `'Awaiting your reply'` | pending customer | `CustomerService.SupportIssue` |
| Resolved | Closed; a shopper reply reopens it. | `'Resolved'` | closed | `CustomerService.SupportIssue` |
