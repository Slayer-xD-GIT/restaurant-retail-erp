# Requirements matrix — client test build

Status meanings: **Demo ready** is interactive and testable in the browser; **Partial** has a representative surface or contract but not the full end-to-end requirement; **Planned** is documented only.

| Module | PDF page(s) | Feature / screen | Data/API target | Test evidence | Status |
|---|---:|---|---|---|---|
| 1.1 IAM | 5, 25 | role/outlet context; authority card | `/auth`, `/users`, `/devices` | manual role UI | Partial |
| 1.2 Org Structure | 5 | Dhanmondi context and location tags | `/entities`, `/outlets` | manual scope UI | Partial |
| 1.3 Admin & Audit | 5 | decision/posting feedback | `/audit-events` | manual toasts | Partial |
| 1.4 Workflow | 5, 25 | approval inbox and decisions | `/approvals/{id}/decision` | local persistence | Demo ready |
| 2.1 POS | 6, 9 | touch menu, cart, tender, tax, COGS banner | `/sales` idempotent post | `domain.test.ts` | Demo ready |
| 2.2 Product & Menu | 6 | categories, prices, tax classes, recipes | `/items`, `/price-lists` | manual picker | Partial |
| 2.3 CRM & Loyalty | 6 | — | `/customers`, `/loyalty` | — | Planned |
| 2.4 Returns & Waste | 6, 13, 18 | expiry and waste alerts | `/returns`, `/waste` | — | Partial |
| 2.5 Warehouse requisition | 7 | status represented in approvals | `/warehouse-requisitions` | — | Partial |
| 2.6 Procurement requisition | 7, 14 | requisition tab and budget link | `/purchase-requisitions` | — | Partial |
| 2.7 Campaigns | 8 | — | `/campaigns` | — | Planned |
| 3.1 P2P | 10, 14 | PO register and monthly budget banner | `/purchase-orders` | manual UI | Demo ready |
| 3.2 Vendor | 10, 11 | quotation tab and vendor register data | `/vendors`, `/quotations` | — | Partial |
| 3.3 GRN | 10, 12 | GRN price-control tab / variance approval | `/goods-receipts` | manual flow | Demo ready |
| 3.4 Inventory | 10, 13 | batch/expiry/cover table | `/stock-batches` | manual FEFO UI | Demo ready |
| 3.5 WMS & Transfer | 10 | location-aware inventory | `/transfers` | — | Partial |
| 4.1 Recipe / BOM | 15, 16, 18 | ingredient preview; recipe COGS | `/recipes` | COGS unit test | Partial |
| 4.2 Production | 15 | — | `/production-orders` | — | Planned |
| 4.3 KDS | 15 | — | `/kds/orders` | — | Planned |
| 5.1 GL / AR / AP | 17, 18 | balanced posting preview and journal table | `/journals` | tax/balance unit test | Demo ready |
| 5.2 VAT & Tax | 3, 9, 17 | inclusive configurable VAT/SD calculation | `/tax-config` | tax unit test | Demo ready |
| 5.3 Treasury | 17 | tender and cash/bank KPI | `/treasury` | — | Partial |
| 5.4 Expenses | 17 | expense approval | `/expenses` | manual decision | Partial |
| 6.1–6.8 Assets | 19–20 | module status only | `/assets/*` | — | Planned |
| 7.1–7.2 HR / Attendance | 21 | module status only | `/hr/*` | — | Planned |
| 8.1 Budgeting | 22 | procurement budget banner | `/budgets` | manual UI | Partial |
| 8.2 Sales target | 23, 9 | monthly and item target progress | `/sales-targets` | manual UI | Demo ready |
| 8.3–8.8 FP&A | 22 | KPI/target surfaces | `/forecast/*` | — | Partial |
| 9.1 API | 24–25 | FastAPI scaffold | OpenAPI | import pending deps | Partial |
| 9.2 Offline & Sync | 24 | connection status, local persistence | `/sync` | browser offline manual | Partial |
| 9.3 Mobile Approval PWA | 25 | PWA manifest/shell contract | shared approvals API | — | Partial |
| 10.1 Reports | 26 | report/export controls | `/reports` | — | Partial |
| 10.2 BI | 26 | overview dashboard | `/analytics` | manual UI | Partial |
| 10.3 UAT | 26 | local UAT matrix | — | `docs/UAT.md` | Partial |
| 10.4 Deployment | 26–27 | npm flow + Compose scaffold | health checks | web build | Partial |

## Explicit ambiguities

1. The cover says 44 modules, while the numbered scope becomes 48 after addenda 2.5–2.7 and 9.3.
2. VAT/SD sequencing must be confirmed with a tax adviser. The demo follows the page-9 example.
3. GRN capitalizes inventory and credits GR/IR. Invoice matching clears GR/IR and records AP; it must not debit inventory again.
4. Recipe COGS, waste, and stock adjustments are separate ledger lines and are only combined in clearly labelled operational totals.
5. Offline posting uses server-side idempotency keys and costs at sync under the brief's stated policy; backdating/closed-period behavior still needs client sign-off.
