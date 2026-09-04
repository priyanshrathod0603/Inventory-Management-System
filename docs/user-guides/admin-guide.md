# Administrator & Manager Guide

## 1. Status Notice
* **Implementation Status**: Planned / Specification Frozen.
* The administrative features below are documented based on the authoritative Project Brain specifications.

---

## 2. Managing Inventory & Stock Adjustments
* **Stock Adjustments**: When physical stock differs from digital records, open `/inventory/adjustments/new`. Enter the discrepancy quantity, select the mandatory reason category (`DAMAGED_GOODS`, `COUNT_DISCREPANCY`), and provide a detailed audit note before confirming with Manager PIN.
* **Inter-Warehouse Transfers**: Navigate to `/inventory/transfers` to dispatch stock from the main warehouse to storefront racks.

---

## 3. Reviewing Business Reports & Gross Margin
* **Operations Dashboard**: Access `/dashboard` to view real-time KPIs (Today's Sales, Purchases, Stock Valuation, Low Stock Alerts, and Outstanding Customer Debt).
* **Profit Analysis**: Access `/reports/profit-loss` to inspect Gross Profit (Sales Revenue - Cost of Goods Sold) and Category Margin percentages.

---

## 4. User Roles & Permission Auditing
* Manage staff access levels (`Admin`, `Manager`, `Cashier`) under `/settings/users`.
* Inspect the immutable chronological event log under `/audit-logs` to review sensitive system actions.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
