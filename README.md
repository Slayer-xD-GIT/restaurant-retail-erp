# Ranna Restaurant & Retail ERP — Client Test Build

An offline-friendly, locally runnable ERP client demo based on `ERP_Developer_Brief_v8.pdf` (27 pages). This build demonstrates the central operational flows and does **not** claim all 48 modules are production-complete.

## Quick start (client demo)

Requirements: Node.js 20+ and npm.

```powershell
npm install
npm run dev
```

Open <http://localhost:4174>. The demo stores approval decisions, POS orders, offline queues and operational records in the browser, so it remains useful without the API. Use **All modules** to inspect the wider ERP workspace.

Production preview:

```powershell
npm run build
npm run preview
```

## Demo walkthrough

1. Open **Overview** and inspect operational KPIs, alerts, targets, and top items.
2. Open **Point of sale**, choose dine-in/takeaway/delivery, add customer and table details, apply a coupon, and settle by cash, card, wallet or split payment.
3. Post the sale and inspect the itemised VAT/Mushak receipt, KDS ticket, stock/COGS impact and balanced journal preview.
4. Open **Inventory** to inspect batch expiry, FEFO status, and stock-cover risks.
5. Open **Procurement** for the monthly raw-material budget, PO status, GRN control, and quotation tabs.
6. Open **Approvals** and approve or reject a document. The decision persists locally.
7. Open **Finance** to verify balanced journal groups and source traceability.

## Demo credentials

The browser demo opens as **Nabila Rahman — Outlet Manager, Dhanmondi**. Authentication and outlet scope are represented in the UI; enforcement belongs to the API integration stage.

| Role | Planned API login | Scope |
|---|---|---|
| Business head | `owner@ranna.local` | All entities/outlets |
| Outlet manager | `manager.dhanmondi@ranna.local` | Dhanmondi only |
| Cashier | `cashier.dhanmondi@ranna.local` | POS and own shift |
| Procurement | `buyer@ranna.local` | Procurement and vendors |
| Finance | `finance@ranna.local` | GL, tax, treasury |

No production credentials or secrets are included. Configure authentication through environment variables before connecting a real API.

## Architecture

- `apps/web`: React + TypeScript + Vite client demo
- `apps/api`: FastAPI service contract and PostgreSQL-ready settings
- `apps/approvals`: installable PWA shell sharing the approval API contract
- `packages/shared`: shared domain contracts
- `infra`: Docker Compose for PostgreSQL, API, and web
- `docs`: requirements, test, and policy notes

## Important limitations

- The current client-test build uses deterministic browser data and local storage. It is suitable for flow/UX acceptance, not financial production use.
- API persistence, Alembic migrations, full outlet authorization, OCR, file retention, worker queues, and all 48 end-to-end modules remain implementation work.
- Tax values are configurable in the domain model. The example follows the brief's sequential inclusive calculation: `net = gross / (1 + VAT) / (1 + SD)`. A Bangladesh tax adviser must approve the real policy.
- Offline sales are queued locally and excluded from posted performance until synchronization. A production deployment still needs its central conflict-resolution and retry service.

## Quality checks

```powershell
npm test
npm run build
```

The CI workflow runs both checks for pushes and pull requests.

## Repository safety

- Generated builds, local databases, environment files and dependency folders are ignored.
- Never commit production credentials, customer data or exported financial records.
- Tax and Mushak behavior in this client build is demonstrative and requires professional validation before production use.

See [docs/requirements-matrix.md](docs/requirements-matrix.md) and [docs/UAT.md](docs/UAT.md).
