---
id: CustomerService.use-cases
type: use-cases
context: CustomerService
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 processes P05 (raise an issue), P15 (reopen), P22 (agent handling), P25 (returns)
---

# CustomerService — use cases

### CS-UC-01 Get help with an ordered item
- **Actor:** ACT-SHOPPER
- **Goal:** Get a problem with something they bought sorted out.
- **Trigger:** The shopper contacts customer service.
- **Preconditions:** The shopper has at least one order that is not cancelled.
- **Main flow:**
  1. The shopper opens customer service.
  2. The system offers the items from the shopper's orders that are not cancelled (CS-BR-001).
  3. The shopper picks an item and a topic, and optionally describes the problem.
  4. The system records the issue as `Open` with a reference (CS-BR-004), and acknowledges it at once
     with a promise to reply within 24 hours (CS-BR-005).
- **Alternative flows:**
  - `3a.` No item or no topic is chosen: the shopper is told which is missing (CS-BR-002).
  - `3b.` No details are given: the topic becomes the first message.
- **Postconditions:** An open, acknowledged issue exists.
- **Commands:** `CustomerService.RaiseIssue`
- **Rules:** CS-BR-001, CS-BR-002, CS-BR-003, CS-BR-004, CS-BR-005
- **Flows:** FLOW-05
- **Status:** implemented
- **Code:** `src/app/customer-service/page.tsx`, `src/components/support/CustomerServiceView.tsx`
- **Source:** P05

### CS-UC-02 Continue the conversation
- **Actor:** ACT-SHOPPER
- **Goal:** Answer the support team, or add information, until the issue is resolved.
- **Trigger:** The shopper opens an issue, often one with an unread reply.
- **Preconditions:** The issue exists.
- **Main flow:**
  1. The shopper opens the issue.
  2. The system shows the thread and marks the latest reply as read (CS-BR-007).
  3. The shopper writes a reply.
  4. The system adds it. If the issue was awaiting the shopper's reply, or resolved, it moves to
     `In review` (CS-BR-006).
- **Alternative flows:**
  - `3a.` The reply is empty: it cannot be sent (CS-BR-010).
  - `4a.` The issue is `Open` or `In review`: its status is unchanged.
- **Postconditions:** The reply is on the thread; the status says whose turn it is.
- **Commands:** `CustomerService.ReplyToIssue`, `CustomerService.MarkIssueRead`
- **Rules:** CS-BR-006, CS-BR-007, CS-BR-010
- **Status:** implemented
- **Code:** `src/components/support/CustomerServiceView.tsx`
- **Source:** P05, P15

### CS-UC-03 Ask to return or replace an item
- **Actor:** ACT-SHOPPER
- **Goal:** Send back a delivered item, or get it replaced.
- **Trigger:** The shopper chooses to return or replace items on a delivered order.
- **Preconditions:** The order is `Delivered`.
- **Main flow:**
  1. The shopper asks to return or replace items from the order.
  2. The system opens customer service with that order selected and the topic "Request a return"
     (CS-BR-008).
  3. The use case continues as CS-UC-01 from step 3.
- **Alternative flows:**
  - `2a.` (not built) The returns window has passed: the BRD requires a refusal with the reason
    (ORD-BR-015). As-built, no window is checked.
- **Postconditions:** A return request exists as an issue. The proper return lifecycle is ORD-UC-05.
- **Commands:** `CustomerService.RaiseIssue`
- **Rules:** CS-BR-008, ORD-BR-015
- **Status:** partial
- **Code:** `src/components/orders/OrderDetailView.tsx`, `src/components/orders/OrdersView.tsx`
- **Source:** P25

### CS-UC-04 Answer shoppers' issues
- **Actor:** ACT-SUPPORT-TEAM
- **Goal:** Resolve each issue, replying within 24 hours.
- **Trigger:** An issue is raised or a shopper replies.
- **Preconditions:** The agent is signed in to the back office.
- **Main flow:**
  1. The agent takes the next issue in the queue.
  2. The agent replies, sets the status, and adds internal notes the shopper never sees (CS-BR-009).
  3. The system tells the shopper there is a reply.
- **Alternative flows:**
  - `2a.` The issue needs a cancellation or return: the agent starts it for the shopper.
- **Postconditions:** The issue shows the agent's reply and status.
- **Commands:** none modelled yet; changes `CustomerService.SupportIssue`
- **Rules:** CS-BR-009
- **Status:** not-implemented
- **Code:** —
- **Source:** P22
