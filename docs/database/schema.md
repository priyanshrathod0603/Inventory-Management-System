# Database Schema Specification

This document details the PostgreSQL schema implemented in Prisma ORM.

## 1. Authentication & RBAC

### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | User unique identifier |
| `username` | `VARCHAR(50)` | Unique, NOT NULL | Login username |
| `email` | `VARCHAR(255)`| Unique, NOT NULL | User email address |
| `passwordHash`| `VARCHAR(255)`| NOT NULL | Salted Argon2id hash |
| `fullName` | `VARCHAR(100)`| NOT NULL | Full display name |
| `roleId` | `UUID` | Foreign Key -> `roles.id` | User role |
| `isActive` | `BOOLEAN` | DEFAULT TRUE | Active status |
| `isDeleted`| `BOOLEAN` | DEFAULT FALSE | Soft delete flag |

### `roles` & `permissions`
* `roles`: `id` (UUID PK), `name` (VARCHAR Unique), `description` (TEXT), `isSystem` (BOOLEAN).
* `permissions`: `id` (UUID PK), `code` (VARCHAR Unique e.g. `create_sale`), `module` (VARCHAR), `description` (TEXT).
* `role_permissions`: `roleId` (UUID FK), `permissionId` (UUID FK) - Composite PK.

---

## 2. Master Data: Products & Warehouses

### `products`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key | Product identifier |
| `name` | `VARCHAR(255)`| NOT NULL | Product title |
| `sku` | `VARCHAR(100)`| Unique, NOT NULL, Indexed | Stock Keeping Unit |
| `barcode` | `VARCHAR(100)`| Unique Nullable, Indexed | EAN/UPC Barcode |
| `categoryId` | `UUID` | FK -> `categories.id` | Product category |
| `brandId` | `UUID` | FK -> `brands.id` Nullable | Product brand |
| `unit` | `VARCHAR(20)` | NOT NULL | Unit (Pcs, Kg, Litre) |
| `purchasePrice`| `DECIMAL(12,2)`| DEFAULT 0.00 | Cost price (Masked for Cashier) |
| `sellingPrice` | `DECIMAL(12,2)`| DEFAULT 0.00 | Base selling price |
| `taxRate` | `DECIMAL(5,2)` | DEFAULT 0.00 | GST percentage (e.g. 18.00) |
| `isTaxInclusive`| `BOOLEAN` | DEFAULT TRUE | Tax inclusion mode |
| `currentStock`| `DECIMAL(10,3)`| DEFAULT 0.000 | Aggregated stock count |
| `minStockAlert`| `DECIMAL(10,3)`| DEFAULT 5.000 | Low stock alert threshold |

---

## 3. Transactions: Sales & Stock Movements

### `sales`
* `id` (UUID PK), `invoiceNumber` (VARCHAR Unique, Indexed), `customerId` (UUID FK), `warehouseId` (UUID FK), `userId` (UUID FK), `saleDate` (TIMESTAMPTZ), `subtotal` (DECIMAL 12,2), `taxAmount` (DECIMAL 12,2), `grandTotal` (DECIMAL 12,2), `paidAmount` (DECIMAL 12,2), `changeAmount` (DECIMAL 12,2), `paymentStatus` (VARCHAR), `saleStatus` (VARCHAR).

### `stock_movements` (Immutable Ledger)
* `id` (UUID PK), `movementDate` (TIMESTAMPTZ), `productId` (UUID FK), `warehouseId` (UUID FK), `movementType` (VARCHAR: `OPENING`, `PURCHASE`, `SALE`, `SALES_RETURN`, `PURCHASE_RETURN`, `ADJUSTMENT`, `TRANSFER`), `quantity` (DECIMAL 10,3), `beforeStock` (DECIMAL 10,3), `afterStock` (DECIMAL 10,3), `referenceNumber` (VARCHAR), `userId` (UUID FK), `reason` (TEXT).

---

## Source Reference
* Authoritative Specification: [.ai/DATABASE.md](../../.ai/DATABASE.md)
* Active Prisma Schema: [apps/api/prisma/schema.prisma](../../apps/api/prisma/schema.prisma)
