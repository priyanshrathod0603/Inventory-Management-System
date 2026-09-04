# Database Specification & Relational Schema Design

## 1. Database Architecture & Design Principles

* **Database Engine**: PostgreSQL 16+
* **ORM & Migration Layer**: Prisma ORM with NestJS
* **Precision & Money Standards**:
  * Financial Currency Amounts: `DECIMAL(12, 2)` (e.g., `₹14,85,200.50`)
  * Fractional Stock Quantities: `DECIMAL(10, 3)` (supports `0.001 Kg / Litre` accuracy)
  * Tax & Discount Percentages: `DECIMAL(5, 2)` (supports `18.00%`, `2.50%`)
* **Temporal Tracking**: Every table maintains `createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` and `updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`.
* **Soft-Deletion Strategy**: Master records (Products, Categories, Brands, Customers, Suppliers, Users) utilize `isDeleted BOOLEAN DEFAULT FALSE` and `deletedAt TIMESTAMP WITH TIME ZONE`. Financial transactions (Sales, Purchases, Invoices, Stock Movements) are **NEVER deleted**; state changes occur via status flags (`CANCELLED`, `VOID`, `RETURNED`).
* **Transactional Boundaries**:
  * **Sale Transaction Boundary**: `Sales` + `SaleItems` + `Payments` + `StockMovements` + `WarehouseInventory` (decrement) + `Invoices` + `CustomerLedger` (if Credit).
  * **Purchase Transaction Boundary**: `Purchases` + `PurchaseItems` + `Payments` + `StockMovements` + `WarehouseInventory` (increment) + `SupplierLedger`.
  * **Sales Return Boundary**: `SalesReturns` + `SalesReturnItems` + `StockMovements` + `WarehouseInventory` (increment) + `Payments` (refund) + `CustomerLedger`.

---

## 2. Entity Relationship Overview

```
                                  ┌───────────────┐
                                  │   Warehouse   │
                                  └───────┬───────┘
                                          │1:N
┌───────────────┐1:N ┌────────────────────┴───────────────┐N:1 ┌───────────────┐
│   Category    ├───►│              Product               │◄───┤     Brand     │
└───────────────┘    └─┬──────────────┬───────────────┬─┬─┘    └───────────────┘
                       │1:N           │1:N            │ │1:N
                       ▼              ▼               │ └──────────────┐
                 ┌──────────┐   ┌──────────────┐      │                ▼
                 │SaleItems │   │PurchaseItems │      │        ┌───────────────┐
                 └─────┬────┘   └──────┬───────┘      │        │  BatchExpiry  │
                       │N:1            │N:1           │        └───────────────┘
                       ▼              ▼               ▼
                 ┌──────────┐   ┌──────────────┐ ┌───────────────┐
                 │  Sales   │   │  Purchases   │ │ StockMovement │ (Immutable Ledger)
                 └─────┬────┘   └──────┬───────┘ └───────────────┘
                       │1:1            │N:1
                       ▼               ▼
                 ┌──────────┐   ┌──────────────┐
                 │ Invoices │   │  Suppliers   │
                 └──────────┘   └──────────────┘
```

---

## 3. Detailed Table Schema Definitions

### 3.1 Authentication, Users & RBAC

> **Single Common Identity Standard**: The `users` table is the single, common account table for all users in the system (Admin, Manager, Cashier, Staff, etc.). There are NO separate login tables or role-specific account tables. All users authenticate through the same login system. The `roles`, `permissions`, and `role_permissions` tables serve downstream authorization (RBAC) only.

#### `users`
* `id`: `UUID` (PK, default `gen_random_uuid()`)
* `username`: `VARCHAR(50)` (Unique, NOT NULL)
* `email`: `VARCHAR(255)` (Unique, NOT NULL)
* `passwordHash`: `VARCHAR(255)` (NOT NULL, Argon2id hash)
* `fullName`: `VARCHAR(100)` (NOT NULL)
* `phone`: `VARCHAR(20)` (Nullable)
* `roleId`: `UUID` (FK -> `roles.id`, NOT NULL)
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `isDeleted`: `BOOLEAN` (DEFAULT FALSE)
* `lastLoginAt`: `TIMESTAMP WITH TIME ZONE` (Nullable)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `roles`
* `id`: `UUID` (PK)
* `name`: `VARCHAR(50)` (Unique, NOT NULL e.g., 'Admin', 'Manager', 'Cashier')
* `description`: `TEXT` (Nullable)
* `isSystem`: `BOOLEAN` (DEFAULT FALSE - protects built-in roles from deletion)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `permissions`
* `id`: `UUID` (PK)
* `code`: `VARCHAR(100)` (Unique, NOT NULL e.g., 'create_sale', 'adjust_stock')
* `module`: `VARCHAR(50)` (NOT NULL e.g., 'Sales', 'Inventory')
* `description`: `TEXT` (Nullable)

#### `role_permissions`
* `roleId`: `UUID` (PK, FK -> `roles.id` ON DELETE CASCADE)
* `permissionId`: `UUID` (PK, FK -> `permissions.id` ON DELETE CASCADE)

#### `sessions`
* `id`: `VARCHAR(128)` (PK)
* `userId`: `UUID` (FK -> `users.id` ON DELETE CASCADE)
* `ipAddress`: `VARCHAR(45)`
* `userAgent`: `TEXT`
* `expiresAt`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

---

### 3.2 Master Data: Products, Categories & Brands

#### `categories`
* `id`: `UUID` (PK)
* `name`: `VARCHAR(100)` (Unique, NOT NULL)
* `slug`: `VARCHAR(120)` (Unique, NOT NULL)
* `description`: `TEXT`
* `parentId`: `UUID` (FK -> `categories.id` Nullable, for subcategories)
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `isDeleted`: `BOOLEAN` (DEFAULT FALSE)

#### `brands`
* `id`: `UUID` (PK)
* `name`: `VARCHAR(100)` (Unique, NOT NULL)
* `description`: `TEXT`
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `isDeleted`: `BOOLEAN` (DEFAULT FALSE)

#### `products`
* `id`: `UUID` (PK)
* `name`: `VARCHAR(255)` (NOT NULL)
* `sku`: `VARCHAR(100)` (Unique, NOT NULL, Indexed)
* `barcode`: `VARCHAR(100)` (Unique Nullable, Indexed)
* `categoryId`: `UUID` (FK -> `categories.id`, NOT NULL)
* `brandId`: `UUID` (FK -> `brands.id`, Nullable)
* `unit`: `VARCHAR(20)` (NOT NULL e.g., 'Pcs', 'Kg', 'Litre', 'Box')
* `purchasePrice`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `sellingPrice`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `mrp`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `taxRate`: `DECIMAL(5, 2)` (NOT NULL DEFAULT 0.00 e.g., 18.00)
* `isTaxInclusive`: `BOOLEAN` (DEFAULT TRUE)
* `minStockAlert`: `DECIMAL(10, 3)` (DEFAULT 5.000)
* `currentStock`: `DECIMAL(10, 3)` (DEFAULT 0.000 - Aggregated cached balance)
* `hasBatchTracking`: `BOOLEAN` (DEFAULT FALSE)
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `isDeleted`: `BOOLEAN` (DEFAULT FALSE)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `warehouses`
* `id`: `UUID` (PK)
* `name`: `VARCHAR(100)` (Unique, NOT NULL e.g., 'Main Storefront', 'Central Godown')
* `code`: `VARCHAR(20)` (Unique, NOT NULL)
* `address`: `TEXT`
* `isDefault`: `BOOLEAN` (DEFAULT FALSE)
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `warehouse_inventory`
* `id`: `UUID` (PK)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `quantity`: `DECIMAL(10, 3)` (NOT NULL DEFAULT 0.000)
* `updatedAt`: `TIMESTAMP WITH TIME ZONE`
* *Unique Constraint*: `(warehouseId, productId)`

#### `product_batches`
* `id`: `UUID` (PK)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `batchNumber`: `VARCHAR(100)` (NOT NULL)
* `mfgDate`: `DATE` (Nullable)
* `expiryDate`: `DATE` (NOT NULL, Indexed)
* `quantity`: `DECIMAL(10, 3)` (NOT NULL DEFAULT 0.000)
* `purchasePrice`: `DECIMAL(12, 2)` (NOT NULL)
* `status`: `VARCHAR(20)` (DEFAULT 'ACTIVE' e.g., 'ACTIVE', 'NEAR_EXPIRY', 'EXPIRED', 'DEPLETED')
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

---

### 3.3 CRM & Vendor Master: Customers & Suppliers

#### `customers`
* `id`: `UUID` (PK)
* `name`: `VARCHAR(150)` (NOT NULL)
* `phone`: `VARCHAR(20)` (Unique Nullable, Indexed)
* `email`: `VARCHAR(255)` (Nullable)
* `address`: `TEXT`
* `gstin`: `VARCHAR(20)` (Nullable)
* `creditLimit`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `outstandingBalance`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `isWalkIn`: `BOOLEAN` (DEFAULT FALSE)
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `isDeleted`: `BOOLEAN` (DEFAULT FALSE)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `suppliers`
* `id`: `UUID` (PK)
* `companyName`: `VARCHAR(200)` (NOT NULL)
* `contactPerson`: `VARCHAR(100)`
* `phone`: `VARCHAR(20)` (NOT NULL)
* `email`: `VARCHAR(255)`
* `address`: `TEXT`
* `gstin`: `VARCHAR(20)` (Nullable)
* `pendingPayables`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `isActive`: `BOOLEAN` (DEFAULT TRUE)
* `isDeleted`: `BOOLEAN` (DEFAULT FALSE)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `customer_ledger`
* `id`: `UUID` (PK)
* `customerId`: `UUID` (FK -> `customers.id`, NOT NULL, Indexed)
* `transactionDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `referenceType`: `VARCHAR(50)` (NOT NULL e.g., 'SALE', 'PAYMENT', 'RETURN')
* `referenceId`: `UUID` (NOT NULL)
* `referenceNumber`: `VARCHAR(100)` (NOT NULL e.g., 'INV-1092', 'PAY-401')
* `debitAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00 - Invoiced amounts)
* `creditAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00 - Payments/Returns)
* `runningBalance`: `DECIMAL(12, 2)` (NOT NULL)
* `notes`: `TEXT`
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `supplier_ledger`
* `id`: `UUID` (PK)
* `supplierId`: `UUID` (FK -> `suppliers.id`, NOT NULL, Indexed)
* `transactionDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `referenceType`: `VARCHAR(50)` (NOT NULL e.g., 'PURCHASE', 'PAYMENT', 'RETURN')
* `referenceId`: `UUID` (NOT NULL)
* `referenceNumber`: `VARCHAR(100)` (NOT NULL e.g., 'PO-8812', 'SPAY-102')
* `debitAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00 - Payments/Returns made to supplier)
* `creditAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00 - Inward purchase bills)
* `runningBalance`: `DECIMAL(12, 2)` (NOT NULL)
* `notes`: `TEXT`
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

---

### 3.4 POS, Sales & Invoicing

#### `sales`
* `id`: `UUID` (PK)
* `invoiceNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed)
* `customerId`: `UUID` (FK -> `customers.id`, NOT NULL)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL - Cashier operator)
* `saleDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `subtotal`: `DECIMAL(12, 2)` (NOT NULL)
* `itemDiscountTotal`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `orderDiscountAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `orderDiscountPercent`: `DECIMAL(5, 2)` (DEFAULT 0.00)
* `taxAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `cgstAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `sgstAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `igstAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `grandTotal`: `DECIMAL(12, 2)` (NOT NULL)
* `paidAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `changeAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `dueAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `paymentStatus`: `VARCHAR(30)` (NOT NULL e.g., 'PAID', 'PARTIAL', 'CREDIT', 'CANCELLED')
* `saleStatus`: `VARCHAR(30)` (NOT NULL DEFAULT 'COMPLETED' e.g., 'COMPLETED', 'VOID', 'RETURNED')
* `notes`: `TEXT`
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `sale_items`
* `id`: `UUID` (PK)
* `saleId`: `UUID` (FK -> `sales.id` ON DELETE CASCADE, NOT NULL)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `batchId`: `UUID` (FK -> `product_batches.id`, Nullable)
* `quantity`: `DECIMAL(10, 3)` (NOT NULL)
* `unitPrice`: `DECIMAL(12, 2)` (NOT NULL)
* `costPriceSnapshot`: `DECIMAL(12, 2)` (NOT NULL - Captured at sale time for profit calculation)
* `discountAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00)
* `taxRate`: `DECIMAL(5, 2)` (DEFAULT 0.00)
* `taxAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00)
* `lineTotal`: `DECIMAL(12, 2)` (NOT NULL)

#### `invoices`
* `id`: `UUID` (PK)
* `invoiceNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed)
* `saleId`: `UUID` (Unique, FK -> `sales.id`, NOT NULL)
* `invoiceDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `formatType`: `VARCHAR(20)` (DEFAULT '80MM' e.g., '58MM', '80MM', 'A4')
* `pdfUrl`: `TEXT` (Nullable)
* `isCancelled`: `BOOLEAN` (DEFAULT FALSE)
* `cancelledAt`: `TIMESTAMP WITH TIME ZONE` (Nullable)
* `cancelledBy`: `UUID` (FK -> `users.id`, Nullable)
* `cancellationReason`: `TEXT` (Nullable)
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `held_bills`
* `id`: `UUID` (PK)
* `referenceCode`: `VARCHAR(50)` (NOT NULL)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL)
* `customerId`: `UUID` (FK -> `customers.id`, Nullable)
* `cartPayload`: `JSONB` (NOT NULL)
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

---

### 3.5 Procurement & Purchases

#### `purchases`
* `id`: `UUID` (PK)
* `purchaseNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed)
* `supplierInvoiceNumber`: `VARCHAR(100)` (NOT NULL)
* `supplierId`: `UUID` (FK -> `suppliers.id`, NOT NULL)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL)
* `purchaseDate`: `DATE` (NOT NULL)
* `subtotal`: `DECIMAL(12, 2)` (NOT NULL)
* `taxAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `discountAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `grandTotal`: `DECIMAL(12, 2)` (NOT NULL)
* `paidAmount`: `DECIMAL(12, 2)` (NOT NULL DEFAULT 0.00)
* `paymentStatus`: `VARCHAR(30)` (NOT NULL e.g., 'PAID', 'PARTIAL', 'PENDING')
* `receivingStatus`: `VARCHAR(30)` (NOT NULL DEFAULT 'RECEIVED' e.g., 'RECEIVED', 'PARTIAL', 'PENDING')
* `notes`: `TEXT`
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `purchase_items`
* `id`: `UUID` (PK)
* `purchaseId`: `UUID` (FK -> `purchases.id` ON DELETE CASCADE, NOT NULL)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `batchNumber`: `VARCHAR(100)` (Nullable)
* `expiryDate`: `DATE` (Nullable)
* `quantity`: `DECIMAL(10, 3)` (NOT NULL)
* `purchasePrice`: `DECIMAL(12, 2)` (NOT NULL)
* `taxRate`: `DECIMAL(5, 2)` (DEFAULT 0.00)
* `taxAmount`: `DECIMAL(12, 2)` (DEFAULT 0.00)
* `lineTotal`: `DECIMAL(12, 2)` (NOT NULL)

---

### 3.6 Sales Returns & Purchase Returns

#### `sales_returns`
* `id`: `UUID` (PK)
* `returnNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed e.g., 'CN-2026-001')
* `saleId`: `UUID` (FK -> `sales.id`, NOT NULL)
* `customerId`: `UUID` (FK -> `customers.id`, NOT NULL)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL)
* `returnDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `totalRefundAmount`: `DECIMAL(12, 2)` (NOT NULL)
* `refundMethod`: `VARCHAR(30)` (NOT NULL e.g., 'CASH', 'CREDIT_NOTE', 'ORIGINAL_PAYMENT')
* `reason`: `VARCHAR(255)` (NOT NULL)
* `notes`: `TEXT`
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `sales_return_items`
* `id`: `UUID` (PK)
* `salesReturnId`: `UUID` (FK -> `sales_returns.id` ON DELETE CASCADE, NOT NULL)
* `saleItemId`: `UUID` (FK -> `sale_items.id`, NOT NULL)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `returnedQuantity`: `DECIMAL(10, 3)` (NOT NULL)
* `unitPrice`: `DECIMAL(12, 2)` (NOT NULL)
* `refundAmount`: `DECIMAL(12, 2)` (NOT NULL)

#### `purchase_returns`
* `id`: `UUID` (PK)
* `returnNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed e.g., 'DN-2026-001')
* `purchaseId`: `UUID` (FK -> `purchases.id`, NOT NULL)
* `supplierId`: `UUID` (FK -> `suppliers.id`, NOT NULL)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL)
* `returnDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `totalDebitAmount`: `DECIMAL(12, 2)` (NOT NULL)
* `reason`: `VARCHAR(255)` (NOT NULL)
* `notes`: `TEXT`
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

---

### 3.7 Payments & Financial Transactions

#### `payments`
* `id`: `UUID` (PK)
* `paymentNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed e.g., 'PAY-2026-0091')
* `paymentType`: `VARCHAR(30)` (NOT NULL e.g., 'SALE_INFLOW', 'PURCHASE_OUTFLOW', 'CUSTOMER_CREDIT_SETTLEMENT', 'SUPPLIER_PAYMENT', 'REFUND')
* `referenceType`: `VARCHAR(50)` (NOT NULL e.g., 'SALE', 'PURCHASE', 'SALES_RETURN', 'CUSTOMER_LEDGER')
* `referenceId`: `UUID` (NOT NULL)
* `partyType`: `VARCHAR(20)` (NOT NULL e.g., 'CUSTOMER', 'SUPPLIER', 'WALK_IN')
* `partyId`: `UUID` (Nullable)
* `paymentMethod`: `VARCHAR(30)` (NOT NULL e.g., 'CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT')
* `amount`: `DECIMAL(12, 2)` (NOT NULL)
* `transactionReference`: `VARCHAR(100)` (Nullable e.g., UPI UTR, Card Auth Code)
* `paymentDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `receivedBy`: `UUID` (FK -> `users.id`, NOT NULL)
* `status`: `VARCHAR(20)` (DEFAULT 'COMPLETED' e.g., 'COMPLETED', 'FAILED', 'REVERSED')
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `cash_drawer_sessions`
* `id`: `UUID` (PK)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL)
* `openedAt`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `closedAt`: `TIMESTAMP WITH TIME ZONE` (Nullable)
* `openingBalance`: `DECIMAL(12, 2)` (NOT NULL)
* `expectedCashBalance`: `DECIMAL(12, 2)` (DEFAULT 0.00)
* `actualCashCounted`: `DECIMAL(12, 2)` (Nullable)
* `discrepancy`: `DECIMAL(12, 2)` (Nullable)
* `status`: `VARCHAR(20)` (DEFAULT 'OPEN' e.g., 'OPEN', 'CLOSED')

---

### 3.8 Immutable Inventory Ledger & Stock Movements

#### `stock_movements`
* `id`: `UUID` (PK)
* `movementDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL, Indexed)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL, Indexed)
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `batchId`: `UUID` (FK -> `product_batches.id`, Nullable)
* `movementType`: `VARCHAR(30)` (NOT NULL e.g., 'OPENING', 'PURCHASE', 'SALE', 'SALES_RETURN', 'PURCHASE_RETURN', 'ADJUSTMENT_INCREASE', 'ADJUSTMENT_DECREASE', 'TRANSFER_IN', 'TRANSFER_OUT')
* `quantity`: `DECIMAL(10, 3)` (NOT NULL - Positive for additions, negative for deductions)
* `beforeStock`: `DECIMAL(10, 3)` (NOT NULL)
* `afterStock`: `DECIMAL(10, 3)` (NOT NULL)
* `referenceType`: `VARCHAR(50)` (NOT NULL e.g., 'SALE', 'PURCHASE', 'ADJUSTMENT', 'TRANSFER')
* `referenceId`: `UUID` (NOT NULL)
* `referenceNumber`: `VARCHAR(100)` (NOT NULL)
* `userId`: `UUID` (FK -> `users.id`, NOT NULL)
* `reason`: `TEXT` (Nullable)
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `stock_adjustments`
* `id`: `UUID` (PK)
* `adjustmentNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed e.g., 'ADJ-2026-004')
* `warehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `adjustmentType`: `VARCHAR(20)` (NOT NULL e.g., 'INCREASE', 'DECREASE')
* `quantity`: `DECIMAL(10, 3)` (NOT NULL)
* `previousStock`: `DECIMAL(10, 3)` (NOT NULL)
* `newStock`: `DECIMAL(10, 3)` (NOT NULL)
* `reasonCategory`: `VARCHAR(100)` (NOT NULL e.g., 'DAMAGED_GOODS', 'EXPIRED_BATCH', 'PHYSICAL_COUNT_DISCREPANCY')
* `notes`: `TEXT` (NOT NULL)
* `authorizedBy`: `UUID` (FK -> `users.id`, NOT NULL)
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `stock_transfers`
* `id`: `UUID` (PK)
* `transferNumber`: `VARCHAR(100)` (Unique, NOT NULL, Indexed e.g., 'TRF-2026-0012')
* `fromWarehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `toWarehouseId`: `UUID` (FK -> `warehouses.id`, NOT NULL)
* `transferDate`: `TIMESTAMP WITH TIME ZONE` (NOT NULL)
* `status`: `VARCHAR(30)` (DEFAULT 'COMPLETED' e.g., 'DRAFT', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED')
* `notes`: `TEXT`
* `createdBy`: `UUID` (FK -> `users.id`, NOT NULL)
* `createdAt`, `updatedAt`: `TIMESTAMP WITH TIME ZONE`

#### `stock_transfer_items`
* `id`: `UUID` (PK)
* `stockTransferId`: `UUID` (FK -> `stock_transfers.id` ON DELETE CASCADE, NOT NULL)
* `productId`: `UUID` (FK -> `products.id`, NOT NULL)
* `quantity`: `DECIMAL(10, 3)` (NOT NULL)

---

### 3.9 Notifications, Audit Logs & Settings

#### `notifications`
* `id`: `UUID` (PK)
* `type`: `VARCHAR(50)` (NOT NULL e.g., 'LOW_STOCK', 'OUT_OF_STOCK', 'NEAR_EXPIRY', 'OVERDUE_PAYMENT')
* `title`: `VARCHAR(255)` (NOT NULL)
* `message`: `TEXT` (NOT NULL)
* `severity`: `VARCHAR(20)` (NOT NULL DEFAULT 'INFO' e.g., 'INFO', 'WARNING', 'DANGER')
* `entityType`: `VARCHAR(50)` (Nullable)
* `entityId`: `UUID` (Nullable)
* `isRead`: `BOOLEAN` (DEFAULT FALSE, Indexed)
* `readAt`: `TIMESTAMP WITH TIME ZONE` (Nullable)
* `createdAt`: `TIMESTAMP WITH TIME ZONE`

#### `audit_logs`
* `id`: `UUID` (PK)
* `timestamp`: `TIMESTAMP WITH TIME ZONE` (DEFAULT CURRENT_TIMESTAMP, Indexed)
* `userId`: `UUID` (FK -> `users.id`, Nullable)
* `userName`: `VARCHAR(100)` (NOT NULL)
* `userRole`: `VARCHAR(50)` (NOT NULL)
* `action`: `VARCHAR(100)` (NOT NULL e.g., 'SALE_CREATED', 'PRICE_CHANGED', 'INVOICE_VOIDED')
* `module`: `VARCHAR(50)` (NOT NULL e.g., 'Sales', 'Inventory', 'Auth', 'Settings')
* `entityId`: `UUID` (Nullable)
* `entityReference`: `VARCHAR(100)` (Nullable)
* `oldValues`: `JSONB` (Nullable)
* `newValues`: `JSONB` (Nullable)
* `reason`: `TEXT` (Nullable)
* `ipAddress`: `VARCHAR(45)` (Nullable)

#### `system_settings`
* `id`: `UUID` (PK)
* `key`: `VARCHAR(100)` (Unique, NOT NULL)
* `value`: `JSONB` (NOT NULL)
* `group`: `VARCHAR(50)` (NOT NULL e.g., 'BUSINESS_PROFILE', 'INVOICE', 'POS', 'TAX', 'SECURITY')
* `updatedBy`: `UUID` (FK -> `users.id`, Nullable)
* `updatedAt`: `TIMESTAMP WITH TIME ZONE`

---

## 4. Key Performance Indexes

```sql
-- High-velocity barcode & SKU lookups
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_sku ON products(sku);

-- Real-time stock movement reporting & audit trail
CREATE INDEX idx_stock_movements_prod_date ON stock_movements(productId, movementDate DESC);
CREATE INDEX idx_stock_movements_ref ON stock_movements(referenceType, referenceId);

-- POS Sales & Invoices
CREATE INDEX idx_sales_date ON sales(saleDate DESC);
CREATE INDEX idx_sales_customer ON sales(customerId);
CREATE INDEX idx_invoices_number ON invoices(invoiceNumber);

-- Double-entry Khata ledger lookups
CREATE INDEX idx_customer_ledger_cust_date ON customer_ledger(customerId, transactionDate DESC);
CREATE INDEX idx_supplier_ledger_supp_date ON supplier_ledger(supplierId, transactionDate DESC);

-- Batch Expiry checks
CREATE INDEX idx_batches_expiry ON product_batches(expiryDate) WHERE quantity > 0;
```