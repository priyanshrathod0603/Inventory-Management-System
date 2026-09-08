# Database Overview

## 1. Engine & ORM
* **Database Management System**: PostgreSQL 16+
* **Data Access Layer**: Prisma ORM v6
* **Host / Service**: Dockerized service `sms-postgres` on port `5432`.

---

## 2. Relational Design Principles
1. **Financial & Quantitative Precision**:
   * All monetary amounts use `DECIMAL(12, 2)` (e.g., `₹14,85,200.50`).
   * All fractional inventory quantities use `DECIMAL(10, 3)` (e.g., `1.750 Kg`).
   * All tax and discount percentages use `DECIMAL(5, 2)` (e.g., `18.00%`).
2. **Temporal Auditability**:
   * Every record maintains `createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` and `updatedAt`.
3. **Soft Deletions**:
   * Master entities (Products, Customers, Suppliers, Users) maintain `isDeleted BOOLEAN DEFAULT FALSE` and `deletedAt TIMESTAMP WITH TIME ZONE`.
4. **Permanent Financial History**:
   * Financial transactions (Sales, Purchases, Invoices, Payments, Movements) are permanent. Status changes use state fields (`COMPLETED`, `CANCELLED`, `VOID`, `RETURNED`).

---

## 3. Table Catalog Summary

* **Auth & Profile**: `users`, `permissions`, `sessions`, `business_profiles` *(Note: `roles` and `role_permissions` tables dropped in migration `20260907000000_remove_role_system` per DECISION-016)*
* **Master Data**: `categories`, `brands`, `products`, `warehouses`, `warehouse_inventory`, `product_batches`
* **CRM & Vendors**: `customers`, `suppliers`, `customer_ledger`, `supplier_ledger`
* **POS & Transactions**: `sales`, `sale_items`, `invoices`, `held_bills`
* **Procurement**: `purchases`, `purchase_items`
* **Returns**: `sales_returns`, `sales_return_items`, `purchase_returns`
* **Payments & Drawer**: `payments`, `cash_drawer_sessions`
* **Inventory & Auditing**: `stock_movements`, `stock_adjustments`, `stock_transfers`, `stock_transfer_items`, `notifications`, `audit_logs`, `system_settings`

---

## Source Reference
* Authoritative Specification: [.ai/DATABASE.md](../../.ai/DATABASE.md)
* Active Prisma Schema: [apps/api/prisma/schema.prisma](../../apps/api/prisma/schema.prisma)
