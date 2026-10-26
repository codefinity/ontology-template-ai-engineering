---
id: StoreConfig.commands
type: commands
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
---

# StoreConfig — commands

### ConfigureStore

- **Intent:** Re-brand or re-parameterise the store without changing code.
- **Actor:** ACT-STORE-OPERATOR
- **Target:** `StoreConfig.StoreConfiguration` (changes)
- **Input:** any of the `NEXT_PUBLIC_*` settings listed in the aggregate
- **Rejected when:** never; invalid values fall back to defaults (CFG-BR-001)
- **On success:** the new settings apply after the next build. No event is emitted.
- **Code:** `.env`, `.env.example`
