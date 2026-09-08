# API Endpoints Catalog

This document lists core REST API endpoints defined in the authoritative API specification.

## 1. Product Catalog (`/api/v1/products`)
* `GET /api/v1/products`: List paginated products with category/brand/status filters (`view_products`).
* `GET /api/v1/products/:id`: Get single product details (`view_products`).
* `GET /api/v1/products/barcode/:barcode`: Instant POS barcode lookup (`view_products`).
* `POST /api/v1/products`: Create a new product (`create_product`).
* `PUT /api/v1/products/:id`: Update product attributes (`edit_product`).
* `DELETE /api/v1/products/:id`: Soft-delete product (`delete_product`).

## 2. Categories & Brands (`/api/v1/categories`, `/api/v1/brands`)
* `GET /api/v1/categories`: List category hierarchy (`view_products`).
* `POST /api/v1/categories`: Create category (`create_product`).
* `GET /api/v1/brands`: List brands (`view_products`).
* `POST /api/v1/brands`: Create brand (`create_product`).

## 3. POS & Sales (`/api/v1/sales`)
* `POST /api/v1/sales`: Execute atomic counter sale transaction (`create_sale`).
* `GET /api/v1/sales`: List sales history with date and payment status filters (`view_sales`).
* `GET /api/v1/sales/:id`: Get detailed sale record and invoice line items (`view_sales`).
* `POST /api/v1/sales/:id/void`: Void/Cancel sale with mandatory reason and restock (`cancel_sale`).
* `POST /api/v1/sales/held-bills`: Park active cart (`hold_resume_bill`).
* `GET /api/v1/sales/held-bills`: Retrieve active parked carts (`hold_resume_bill`).

## 4. Sales Returns & Credit Notes (`/api/v1/sales/returns`)
* `POST /api/v1/sales/returns`: Process item return, restock inventory, issue Credit Note (`create_sales_return`).
* `GET /api/v1/sales/returns`: List return records (`view_returns`).

## 5. Procurement & Purchases (`/api/v1/purchases`)
* `POST /api/v1/purchases`: Record inward supplier purchase and update inventory (`create_purchase`).
* `GET /api/v1/purchases`: List purchase orders and receiving status (`view_purchases`).
* `POST /api/v1/purchases/returns`: Create supplier Debit Note and deduct stock (`create_purchase_return`).

## 6. Inventory & Stock Traceability (`/api/v1/inventory`)
* `GET /api/v1/inventory/movements`: Query immutable chronological stock movement ledger (`view_stock_movements`).
* `POST /api/v1/inventory/adjustments`: Execute high-impact audited stock correction (`adjust_stock`).
* `POST /api/v1/inventory/transfers`: Execute inter-warehouse stock transfer (`transfer_stock`).

## 7. Customers & Suppliers (`/api/v1/customers`, `/api/v1/suppliers`)
* `GET /api/v1/customers`: List customers with search and outstanding balance (`view_customers`).
* `POST /api/v1/customers`: Add customer (`create_customer`).
* `GET /api/v1/customers/:id/ledger`: Retrieve running double-entry Khata ledger (`view_customers`).
* `POST /api/v1/customers/:id/payments`: Record debt settlement payment (`record_payment`).
* `GET /api/v1/suppliers`: List vendors and payables (`view_suppliers`).
* `GET /api/v1/suppliers/:id/ledger`: Retrieve vendor payables ledger (`view_suppliers`).

## 8. Reports & Dashboard (`/api/v1/reports`)
* `GET /api/v1/reports/dashboard-summary`: Real-time Operations Dashboard KPIs (`view_reports`).
* `GET /api/v1/reports/sales`: Daily, monthly, and product-wise sales reports (`view_reports`).
* `GET /api/v1/reports/profit-loss`: Gross profit and margin % analytics (`view_profit_reports`).

## 9. Audit Logs & Settings (`/api/v1/audit-logs`, `/api/v1/settings`)
* `GET /api/v1/audit-logs`: Query system audit events (`view_audit_logs`).
* `GET /api/v1/settings`: Read store configurations (`manage_settings`).
* `PUT /api/v1/settings/:group`: Update store settings (`manage_settings`).

## 10. Business Profile & Onboarding (`/api/v1/business-profile`)
* `GET /api/v1/business-profile`: Fetch active store business profile.
* `PUT /api/v1/business-profile`: Upsert/update business profile details.
* `POST /api/v1/business-profile/complete-step`: Save intermediate onboarding step data.
* `POST /api/v1/business-profile/complete-onboarding`: Finalize onboarding & provision default warehouse.

---

## Source Reference
* Authoritative Specification: [.ai/API_CONTRACTS.md](../../.ai/API_CONTRACTS.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
