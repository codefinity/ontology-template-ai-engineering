---
id: domain.actors
type: actors
status: implemented
last_reviewed: 2026-10-27
sources:
  - BRD v3.0 section 4 (roles R1-R12)
---

# Actors

## People and roles

| ID | Actor | Who they are | Goals | Interacts with contexts | Implemented |
| --- | --- | --- | --- | --- | --- |
| ACT-SHOPPER | Shopper | A registered customer who is signed in. As-built, always Alex Morgan. | Find, buy and receive products; resolve problems | Catalog, Shopping, Ordering, Account, CustomerService, Reviews | yes |
| ACT-VISITOR | Visitor | Anyone not signed in | Browse and build a basket before registering | Catalog, Shopping | no: the app always acts as signed in |
| ACT-PROSPECTIVE-SELLER | Prospective seller | A shopper whose own application is missing, `Pending` or `Rejected` | Apply to sell; follow the application | SellerOnboarding | yes |
| ACT-SELLER | Seller | A shopper whose own application is `Approved`. As-built: "Northgate Goods". | List, promote and fulfil; see earnings | SellerCentral, SellerOnboarding (business details) | yes |
| ACT-ADMIN | Marketplace administrator | Staff who vet sellers | Admit only legitimate sellers | SellerOnboarding | partly: the review queue exists but is not access-controlled |
| ACT-SUPPORT-TEAM | Support team | Staff who answer issues | Reply within 24 hours | CustomerService | partly: only an automatic acknowledgement is sent |
| ACT-STORE-OPERATOR | Store operator | Whoever deploys the store | Re-brand and re-parameterise | StoreConfig | yes: through environment settings |
| ACT-FULFILMENT | Fulfilment team | Staff who dispatch store items and receive returns | Dispatch on time | none yet | no |
| ACT-MERCHANDISER | Merchandiser | Staff who run promotions and store deals | Increase basket value | Catalog | no: store deals and hero slides are sample data |
| ACT-CATALOGUE-MANAGER | Catalogue manager | Staff who maintain the store's products | Accurate catalogue | Catalog | no: the catalogue is static |
| ACT-FINANCE | Finance | Staff who own fees and payouts | Correct payouts | SellerCentral | no: a flat 12% fee is shown only as an estimate |

## External systems

| ID | System | Role in the domain | Interacts with contexts | Implemented |
| --- | --- | --- | --- | --- |
| ACT-PSP | Payment service provider | Holds card data; authorises, captures and refunds payments | Account, Ordering | no |
| ACT-CARRIER | Carrier | Reports dispatch and delivery progress | Ordering, SellerCentral | no |
| ACT-EMAIL | Email service | Sends notifications to shoppers, sellers and applicants | all | no |

## Role relationships

- Shopper, prospective seller and seller are **states of one customer account**. Which applies depends
  on the status of that account's own seller application (`SellerOnboarding.SellerAccountStatus`).
- A seller is still a shopper. As-built, nothing stops a seller buying their own listing (BRD requires
  that it be refused; see SEL-BR-028).
