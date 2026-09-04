# Product Requirements

## 1. Overview & Vision
The Stock Management System (SMS) is an enterprise-ready retail Point of Sale (POS) and inventory operations platform engineered for Indian retail counters, supermarkets, pharmacies, FMCG distributors, and warehouse management.

### Key Objectives:
* **High-Velocity Counter Checkout**: Sub-10-second checkout flow optimized for desktop POS terminals with barcode scanner HID input and full keyboard navigation.
* **Non-Destructive Inventory Ledger**: All stock quantity changes are tracked as immutable, traceable `StockMovement` records. Stock is never silently overwritten.
* **Legal Invoice & Compliance Protection**: Strict mistake-protection workflows (Void/Cancel with reason codes and Sales Returns/Credit Notes); direct deletion of invoices is prohibited.
* **Server-Authoritative RBAC**: Backend NestJS permission guards enforce authorization across all endpoints; frontend controls provide UX guidance.
* **Double-Entry Ledger Accounting**: Running debit/credit balances for customer Khata credit accounts and supplier payables.

---

## 2. Core Business Workflows

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Customer Lookup │────►│ Product Scan    │────►│ Cart & Discounts│────►│ Split Payment   │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                                                 │
                                                                                 ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Thermal/A4 Print│◄────│ Stock Deduction │◄────│ Ledger Update   │◄────│ Confirm Sale    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 3. Phase 1 Module Matrix

| Module | Purpose | Key Capabilities | Status |
| :--- | :--- | :--- | :--- |
| **Authentication & RBAC** | User access control & permissions | Argon2id hashing, secure session cookies, Admin/Manager/Cashier roles | Foundation Initialized |
| **POS & Counter Sales** | Rapid billing counter | Barcode scanning, cart calculation, discounts, GST slabs, held bills (`F6`/`F7`), fast completion (`F8`) | Planned / Specification Frozen |
| **Sales Returns** | Customer return processing | Credit note generation, automatic inventory restocking, refund recording | Planned / Specification Frozen |
| **Procurement & Purchases**| Supplier inward stock | Supplier invoice recording, tax input credit, inventory increase, supplier ledger update | Planned / Specification Frozen |
| **Purchase Returns** | Returning defective vendor stock | Debit note generation, inventory stock reduction, supplier ledger credit | Planned / Specification Frozen |
| **Inventory & Movements** | Traceable stock ledger | Real-time stock counts, immutable movement ledger, valuation at cost/retail | Planned / Specification Frozen |
| **Stock Adjustments** | Reconciling discrepancies | Audited stock correction (damage, shrinkage, count error) with mandatory reason | Planned / Specification Frozen |
| **Warehouses & Transfers** | Multi-location stock | Multi-warehouse tracking, inter-warehouse transfer workflows (Draft, In-Transit, Completed) | Planned / Specification Frozen |
| **Batch & Expiry** | Perishable/batch tracking | Batch numbers, manufacturing/expiry dates, POS expired batch blocking | Planned / Specification Frozen |
| **Customer Khata & CRM** | Customer receivables | Customer profiles, phone lookup, credit limit enforcement, double-entry ledger | Planned / Specification Frozen |
| **Supplier Payables** | Vendor management | Vendor profiles, GSTIN, purchase history, pending payables ledger | Planned / Specification Frozen |
| **Payments & Cash Drawer** | Financial cashflow | Multi-tender (Cash, UPI, Card, Bank, Credit), daily drawer float reconciliation | Planned / Specification Frozen |
| **Invoicing Engine** | Receipt generation | 58mm/80mm thermal receipts, A4 GST tax invoices, WhatsApp sharing, PDF download | Planned / Specification Frozen |
| **Reports & Analytics** | Operational intelligence | Daily/monthly sales, gross profit & margins, stock valuation, tax summaries | Planned / Specification Frozen |
| **Notifications** | Alerts & monitoring | In-app low stock alerts, near-expiry warnings, customer credit overdue alerts | Planned / Specification Frozen |
| **Audit Logs** | Security & traceability | Chronological audit trail answering "Who did what and when?" with diff payloads | Planned / Specification Frozen |
| **Settings** | Store configuration | Business profile, GSTIN configuration, invoice numbering, print preferences | Planned / Specification Frozen |

---

## 4. References & Source of Truth
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
