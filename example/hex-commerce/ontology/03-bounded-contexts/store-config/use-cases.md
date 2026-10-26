---
id: StoreConfig.use-cases
type: use-cases
context: StoreConfig
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 FR-CFG (store configuration)
---

# StoreConfig — use cases

### CFG-UC-01 Re-brand and re-price the store
- **Actor:** ACT-STORE-OPERATOR
- **Goal:** Launch the store under a different name, currency, or delivery and tax terms, without
  development work.
- **Trigger:** The operator changes the store settings.
- **Preconditions:** The operator can change the deployment's environment.
- **Main flow:**
  1. The operator sets the store name, tagline, currency, locale, free-delivery threshold and tax rate.
  2. The operator rebuilds and deploys the store.
  3. The system uses the new settings everywhere money is shown or calculated (CFG-BR-004).
- **Alternative flows:**
  - `1a.` A value is blank or not a number: the default applies (CFG-BR-001).
  - `1b.` (not built) The delivery fee, next-day cut-off and returns window cannot be set (CFG-BR-002,
    partial).
- **Postconditions:** The store runs with the new settings.
- **Commands:** `StoreConfig.ConfigureStore`
- **Rules:** CFG-BR-001, CFG-BR-002, CFG-BR-004
- **Status:** partial
- **Code:** `src/lib/site.ts`
- **Source:** FR-CFG
