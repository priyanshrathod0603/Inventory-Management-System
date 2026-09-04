# Database Architecture

## 1. Overview
The database layer uses PostgreSQL 16+ managed via Prisma ORM. It enforces relational consistency, foreign key constraints, decimal precision standards, and high-performance indexes.

## 2. Core Design Patterns
1. **Precision Standards**:
   * Financial Currency: `DECIMAL(12, 2)` (e.g. `₹1,24,300.50`)
   * Fractional Stock Quantities: `DECIMAL(10, 3)` (e.g. `1.750 Kg`)
   * Tax & Discount Rates: `DECIMAL(5, 2)` (e.g. `18.00%`)
2. **Immutable Inventory Movement Model**:
   * Current stock on `Product` and `WarehouseInventory` represents an aggregated balance.
   * `StockMovement` stores an immutable chronological record of every stock event with `beforeStock`, `afterStock`, and entity references.
3. **Double-Entry Khata Ledgers**:
   * `CustomerLedger` and `SupplierLedger` track debit and credit mutations with running balances for accurate accounting.
4. **Soft Deletion & Permanent Financial Retention**:
   * Master entities (Products, Customers, Suppliers, Users) use `isDeleted BOOLEAN DEFAULT FALSE` and `deletedAt TIMESTAMP WITH TIME ZONE`.
   * Financial records (Sales, Purchases, Invoices, Payments, Movements) are **never deleted**.

---

## 3. Entity Domain Map

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   AUTH & RBAC    │  │   MASTER DATA    │  │  CRM & VENDORS   │  │   TRANSACTIONS   │
│ • users          │  │ • categories     │  │ • customers      │  │ • sales          │
│ • roles          │  │ • brands         │  │ • suppliers      │  │ • sale_items     │
│ • permissions    │  │ • products       │  │ • customer_ledger│  │ • purchases      │
│ • role_perms     │  │ • warehouses     │  │ • supplier_ledger│  │ • purchase_items │
│ • sessions       │  │ • warehouse_inv  │  │                  │  │ • sales_returns  │
│                  │  │ • product_batches│  │                  │  │ • purchase_returns│
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Source Reference
* Authoritative Specification: [.ai/DATABASE.md](../../.ai/DATABASE.md)
* Prisma Schema: [apps/api/prisma/schema.prisma](../../apps/api/prisma/schema.prisma)
