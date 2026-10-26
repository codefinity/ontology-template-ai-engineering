---
id: StoreConfig.events
type: domain-events
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
---

# StoreConfig — domain events and policies

This context emits no domain events and has no policies. Configuration changes take effect at build time,
so no other context needs to react to them while the store is running.
