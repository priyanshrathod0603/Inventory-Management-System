# Database Relationships

## 1. Overview of Key Entity Associations

```
┌──────────────┐1:N ┌──────────────┐1:N ┌──────────────┐
│  Warehouse   ├───►│WarehouseStock│◄───┤   Product    │
└──────┬───────┘    └──────────────┘    └──────┬───────┘
       │                                       │
       │1:N                                    │1:N
       ▼                                       ▼
┌──────────────┐1:N ┌──────────────┐1:N ┌──────────────┐
│    Sales     ├───►│  SaleItems   │    │StockMovements│
└──────┬───────┘    └──────────────┘    └──────────────┘
       │1:1
       ▼
┌──────────────┐
│   Invoices   │
└──────────────┘
```

## 2. Core Relational Rules
1. **Sales & Sale Items**:
   * `Sale` (1) to `SaleItem` (N). Deleting or voiding a sale cascades/updates items appropriately.
2. **Sales & Invoices**:
   * `Sale` (1) to `Invoice` (1) strictly enforces unique invoice numbering per sale transaction.
3. **Customers & Customer Ledger**:
   * `Customer` (1) to `CustomerLedger` (N) maintains an immutable chronological running balance.
4. **Suppliers & Purchases**:
   * `Supplier` (1) to `Purchase` (N) and `SupplierLedger` (N) tracks vendor inward procurement and pending payables.
5. **Products & Inventory**:
   * `Product` (1) to `WarehouseInventory` (N) tracks discrete stock counts per storage location.
   * `Product` (1) to `StockMovement` (N) maintains the immutable audit trail.

---

## Source Reference
* Authoritative Specification: [.ai/DATABASE.md](../../.ai/DATABASE.md)
