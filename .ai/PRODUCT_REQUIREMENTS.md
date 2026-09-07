# Product Requirements Specification

## 1. Executive Summary & Core Business Principles

The Inventory Management System (IMS) is an enterprise-ready retail POS and inventory management platform tailored for Indian retail, wholesale, pharmacy, supermarket, and FMCG businesses.

### Non-Negotiable Core Business Principles:
1. **Transactional Integrity**: Critical operations (Sales, Purchases, Returns, Stock Adjustments, Payments) execute as atomic, single-unit database transactions. No partial state is permitted.
2. **Immutable Inventory Traceability**: Current stock quantity and historical stock movements are distinct concepts. Stock quantities are NEVER simply overwritten without an auditable stock movement record (`StockMovement`).
3. **Legal Invoice Protection**: Invoices are permanent accounting documents. There is **NO** generic `Delete Invoice` action. Rectifications occur via **Void/Cancel** workflows with mandatory audit reasons or **Sales Returns (Credit Notes)**.
4. **Server-Authoritative Security**: The NestJS backend is the sole security and authorization boundary. Frontend role/permission checks are strictly for UI presentation and UX guidance.
5. **Zero Mock Business Data**: The system operates with real data. When data is loading, empty, or failing, standard system state patterns (Skeletons, Empty States, Error Boundaries) are displayed without generating fake business entities.

---

## 2. Authentication & Session Management

### 2.1 Core Architectural Principles
* **Single Common Authentication System**: IMS uses exactly ONE unified authentication system. All users—regardless of role (Admin, Super Admin, Manager, Cashier, Staff, Accountant)—authenticate through the exact same login entry point. There are NO separate Admin, Manager, Staff, or role-specific login pages or portals.
* **Single Common Registration System**: A single unified signup flow (`/register`) for new account registration. There are NO role-specific signup portals.
* **Planned Authentication Methods**:
  1. **Email + Password**: Standard credential authentication with strong hashing (Argon2id) and validation.
  2. **Google Authentication**: Social login via Google OAuth 2.0 / Google Sign-In.
  3. **Email Verification**: Required verification step ensuring account validity before full access.
* **Authentication vs. Authorization Decoupling**: Authentication strictly verifies identity (*"Who is this user?"*). Authorization (*"What is this user permitted to do?"*) is handled separately via downstream RBAC and granular permissions on the backend after successful authentication.

### 2.2 Screens & Components
* **Common Login Screen** (`/login`): Clean branded card with username/email input, password input with visibility toggle, "Continue with Google" OAuth button, "Remember Me" checkbox, "Sign In" button, and links to registration and password reset.
* **Common Registration Screen** (`/register`): Branded registration form with full name, email, password, password confirmation, "Sign up with Google" option, and link to login.
* **Email Verification Screen** (`/verify-email`): Token-based verification confirmation screen and resend verification email trigger.
* **Forgot / Reset Password Screen** (`/forgot-password`, `/reset-password`): Self-service and administrative password reset workflow.
* **Change Password Dialog**: In-app modal accessible from the user profile dropdown.

### 2.3 Fields & Specifications
* `identifier`: String (Username or Email, required, trimmed, case-insensitive).
* `password`: String (Plaintext during entry, min 8 chars with mixed case, digits, and symbols).
* `rememberMe`: Boolean (Extends session cookie validity from 8 hours to 30 days).
* `googleAuthToken` / OAuth callback payload: Token/code received from Google OAuth provider.
* `verificationToken`: Cryptographic token for email verification.

### 2.4 User Workflow
1. **Common Login Flow**:
   - User enters identifier and password OR clicks "Continue with Google".
   - For password auth: Server validates credentials against salted Argon2id hash.
   - For Google auth: Server validates Google OAuth ID token and links/locates existing user record.
   - Server validates email verification status (if required).
   - On success: Server creates a session record, issues an HttpOnly, Secure session cookie (`sms_session`), logs an `AUTH_LOGIN` audit event, and returns user profile + granular permissions payload.
   - On failure: Increments failed attempt counter; triggers exponential rate-limiting after 5 failed attempts within 15 minutes.
2. **Common Registration Flow**:
   - User submits registration details or authenticates with Google.
   - System registers user account, sends email verification token, and prompts user to verify email.

### 2.5 Validation & Security Rules
* Session cookies must use `HttpOnly`, `Secure` (in production), and `SameSite=Strict` (or `Lax` where justified).
* Passwords and OAuth secrets must NEVER be logged or returned in any API response.
* Concurrent session handling: Allows simultaneous logins across different counter terminals while tracking unique terminal/session IDs (`terminalId`, `ipAddress`, `userAgent`).
* Phase 6 Note: Full implementation of authentication, sessions, OAuth, verification, and RBAC guards is scheduled for Phase 6.

---

## 3. Role-Based Access Control (RBAC) & Granular Permissions

### 3.1 Initial System Roles
1. **Admin**: Unrestricted operational and system administrative access.
2. **Manager**: Full operational access across POS, Inventory, Purchases, Sales, Customer/Supplier Ledgers, Returns, and Business Reports. Restricted from managing global system settings and modifying user roles.
3. **Cashier / Staff**: High-velocity POS counter billing, customer phone lookup, sales history viewing, receipt printing, and WhatsApp bill dispatch.

### 3.2 Granular Permission Catalog
```
Module           Permissions
--------------------------------------------------------------------------------------
Products         view_products, create_product, edit_product, delete_product, view_purchase_price
Inventory        view_inventory, adjust_stock, transfer_stock, view_stock_movements, view_valuation
POS & Sales      create_sale, cancel_sale, view_sales, apply_manual_discount, hold_resume_bill
Purchases        view_purchases, create_purchase, edit_purchase, cancel_purchase
Returns          create_sales_return, create_purchase_return, view_returns
Customers        view_customers, create_customer, edit_customer, manage_credit_limit
Suppliers        view_suppliers, create_supplier, edit_supplier
Payments         record_payment, view_payments, reconcile_cash_drawer
Reports          view_reports, view_profit_reports, export_reports
Administration   manage_users, view_audit_logs, manage_settings
```

### 3.3 Explicit Prohibitions for Cashier / Staff Role:
* Cannot view product purchase prices (cost of goods).
* Cannot perform manual or unrestricted stock adjustments.
* Cannot permanently delete or void invoices without manager authorization.
* Cannot view net store profit or business margin reports.
* Cannot manage user accounts, permissions, or system settings.

---

## 4. POS (Point of Sale) & Counter Billing

### 4.1 Purpose
Facilitate rapid, keyboard-driven counter checkout, barcode scanning, cart management, dynamic tax calculation, split payments, and instant receipt generation in retail environments.

### 4.2 Screens & Workflows
* **Main POS Billing Counter** (`/pos`):
  * **Product Search / Barcode Listener**: Auto-focused search bar accepting USB/Bluetooth barcode scanner HID input and fast name/SKU alphanumeric search.
  * **Interactive Cart Table**: Real-time line items with quantity adjustments, item-level discounts, tax slab calculations, and delete actions.
  * **Customer Selector Panel**: Fast customer phone lookup with instant outstanding ledger balance display; quick-toggle for `Walk-in Customer`.
  * **Totals & Calculation Summary**: Subtotal, Item discounts, Bill-level discount, GST breakdown (CGST, SGST, IGST), and Grand Total.
  * **Tender & Payment Selector**: Fast buttons for Cash, UPI (with live dynamic QR generation), Card, Bank Transfer, and Customer Credit (Khata).
  * **Fast Action Bar**: `Hold Bill (F6)`, `Resume Bill (F7)`, `Cancel Bill (Esc)`, and `Complete Sale (F8)`.

### 4.3 Real-Time Sale Transaction Workflow
```
Customer Selection (or Walk-in)
       ↓
Product Scan / SKU Search (Auto-adds to Cart)
       ↓
Adjust Quantities / Item Discounts / Overall Discount
       ↓
Tender Selection (Cash / UPI / Card / Bank / Credit)
       ↓
Execute Confirm Sale [Atomic Server Transaction]:
   ├── 1. Generate unique sequential invoice number (e.g. INV-2026-001092)
   ├── 2. Atomically reduce product inventory quantities across selected warehouse
   ├── 3. Create immutable StockMovement records (type: SALE)
   ├── 4. Record financial payment transaction in Payment table
   ├── 5. Update customer total purchases and ledger outstanding (if Credit/Khata)
   ├── 6. Record Sale and SaleItem records with cost price snapshot for profit calculation
   ├── 7. Check low-stock thresholds and enqueue low-stock notification if breached
   └── 8. Return finalized invoice payload for instant thermal/A4 printing & WhatsApp dispatch
```

### 4.4 Held Bills Management (`F6` / `F7`)
* Allows cashier to temporarily park up to 10 active carts with customer details and recall them instantly without losing item configurations or price overrides.

### 4.5 Decimal Quantities & Unit Management
* Supports discrete units (`Pcs`, `Packets`, `Boxes`) with integer quantities, as well as fractional units (`Kg`, `Grams`, `Litres`, `Metres`) with decimal quantities up to 3 decimal places (e.g. `1.750 Kg`).

### 4.6 Pricing & Tax Slabs (Indian GST Context)
* Pricing Modes: Configurable as **Tax-Inclusive** (MRP includes GST) or **Tax-Exclusive** (GST added on top of base selling price).
* Standard GST Slabs: `0%`, `5%`, `12%`, `18%`, `28%`.
* Intra-State Sales: Automatically split tax equally into `CGST` (50%) and `SGST` (50%).
* Inter-State Sales: Assessed as unified `IGST` (100%).

---

## 5. Sales Returns & Purchase Returns (Mistake & Refund Management)

### 5.1 Sales Return Workflow (Customer Returns Goods)
```
Lookup Original Invoice (e.g. INV-1092)
       ↓
Select Items & Quantities to Return (Full or Partial Return)
       ↓
Specify Mandatory Return Reason (Damaged, Defective, Wrong Item, Customer Regret)
       ↓
Select Refund Mode:
   ├── Cash Refund (Instant cash outflow from cash drawer)
   ├── Original UPI / Card Refund reference
   └── Customer Store Credit Note (Adjusts customer Khata ledger balance)
       ↓
Execute Return [Atomic Server Transaction]:
   ├── Increment product stock in warehouse
   ├── Create StockMovement record (type: SALES_RETURN)
   ├── Generate Credit Note document (e.g. CN-2026-00045)
   └── Log audit event with operator ID and reason
```

### 5.2 Purchase Return Workflow (Returning Defective Goods to Supplier)
* Select original Purchase Bill/PO → Select items and quantities → Specify return reason → Create **Debit Note** (`DN-2026-00012`) → Deducts inventory stock from warehouse → Updates Supplier Ledger (reduces pending payables).

---

## 6. Purchase Management & Inward Stock

### 6.1 Purpose
Track procurement from vendors and distributors, manage purchase prices, calculate input GST tax credits, and automatically receive incoming stock into designated warehouses.

### 6.2 Workflow & Requirements
1. **Create Purchase Bill**: Select Supplier, enter Supplier Invoice #, Bill Date, Receiving Warehouse, and payment terms (`Paid`, `Partial`, `Pending Credit`).
2. **Line Items Entry**: Add products with Purchase Price (cost price), Quantity, Purchase Discount %, and Input GST slab.
3. **Inward Receiving Execution**:
   * Increases inventory stock immediately in the specified warehouse.
   * Generates `StockMovement` records (type: `PURCHASE`).
   * Updates Supplier Ledger balance.
   * Recalculates Weighted Average Cost or updates latest purchase price based on store settings.

---

## 7. Inventory Traceability, Valuation & Stock Movements

### 7.1 Non-Destructive Stock Architecture
* `Product.currentStock` serves as an aggregated read optimization cache.
* `StockMovement` is the **immutable historical ledger** of all inventory events:
  * `OPENING`: Initial stock configured during onboarding or new product setup.
  * `PURCHASE`: Inward stock from supplier procurement.
  * `SALE`: Outward stock deducted during POS checkout.
  * `SALES_RETURN`: Inward stock added back from customer returns.
  * `PURCHASE_RETURN`: Outward stock sent back to supplier.
  * `ADJUSTMENT`: Manual stock correction (damage, count discrepancy, shrinkage).
  * `TRANSFER_IN` / `TRANSFER_OUT`: Inter-warehouse stock reallocations.

### 7.2 Negative Stock Policy
* **Default Business Rule**: Negative stock is **STRICTLY DISALLOWED**. POS billing is blocked if available quantity is `0` or less than requested cart quantity.
* *Manager Override Option*: In specific rapid retail setups where physical goods are present but delayed in system receiving, an Admin/Manager setting can permit negative stock temporarily with warning flags and audit logging.

### 7.3 Stock Valuation Methods
* Valuation is computed at **Cost Price** (FIFO / Weighted Average) and **Selling Price** (Potential Retail Value) across categories and individual warehouses.

---

## 8. Stock Adjustments (High-Impact Workflow)

### 8.1 Purpose
Reconcile physical stock counts with digital inventory records following physical audits, damaged goods discovery, or shrinkage.

### 8.2 Adjustment Interface Requirements
* Screen: Dedicated Stock Adjustment modal / page (`/inventory/adjustments/new`).
* Fields: Product, Warehouse, Current Stock (read-only), Adjustment Type (`Increase (+)` or `Decrease (-)`), Adjustment Quantity, Calculated New Stock, Mandatory Reason Code, Operator Notes.
* Reason Codes: `Damaged Goods`, `Expired Batch`, `Physical Count Discrepancy`, `Internal Store Consumption`, `Theft / Shrinkage`.
* Authorization: Restricted strictly to `Admin` and `Manager` roles. Generates high-priority audit log entry.

---

## 9. Multi-Warehouse Management & Stock Transfers

### 9.1 Multi-Location Support
* Supports discrete inventory tracking across multiple physical storage locations (e.g. `Main Storefront`, `Central Godown`, `Backroom Rack`).
* Every product stock count is partitioned per warehouse location.

### 9.2 Inter-Warehouse Stock Transfer Workflow
```
Source Warehouse Selection → Destination Warehouse Selection
       ↓
Select Items & Transfer Quantities (Validated against Source Available Stock)
       ↓
Transfer Status:
   ├── DRAFT: Staged for packing
   ├── IN_TRANSIT: Dispatched from source (Decrements Source Stock)
   ├── RECEIVED / COMPLETED: Confirmed at destination (Increments Destination Stock)
   └── CANCELLED: Restores stock back to Source Warehouse
```

---

## 10. Batch & Expiry Tracking Management

### 10.1 Purpose
Track batch numbers, manufacturing dates, and expiration dates for pharmaceuticals, cosmetics, packaged food, and FMCG products.

### 10.2 Workflow & Restrictions
* **Batch Entry**: Configured during product creation or inward Purchase Bill entry.
* **POS Expiry Protection**:
  * Active batches (> 30 days remaining): Normal billing.
  * Near-Expiry batches (≤ 30 days remaining): Highlighted in Amber with alert icons.
  * **Expired batches (Past Expiry Date)**: **STRICTLY BLOCKED** from POS selection to prevent accidental sale of expired goods.

---

## 11. Customer & Supplier Ledgers (Khata Management)

### 11.1 Customer Credit & Khata
* **Customer Credit Limit**: Configurable per customer (e.g. `₹10,000.00`). POS billing prevents Credit/Khata checkout if total outstanding balance exceeds limit.
* **Customer Ledger**: Chronological double-entry running balance (`Date`, `Voucher / Invoice #`, `Debit (Sales)`, `Credit (Payments/Returns)`, `Balance Due`).
* **Payment Settlement Dialog**: Record customer partial or full debt settlement with receipt generation.

### 11.2 Supplier Payables Ledger
* Chronological ledger of supplier purchase invoices, debit notes, and bank/cash payments made to vendors.

---

## 12. Invoices, Receipts & Printing Architecture

### 12.1 Format Specifications
1. **58mm Thermal Receipt**: Ultra-compact layout optimized for portable 2-inch ESC/POS thermal printers.
2. **80mm Thermal Receipt**: Standard 3-inch counter receipt with detailed product descriptions, HSN codes, and GST breakdown.
3. **A4 Full Business Tax Invoice**: Official GST-compliant tax invoice containing full store details, GSTIN, customer billing address, HSN/SAC codes, detailed CGST/SGST/IGST breakdown, bank payment details, and authorized signature block.

### 12.2 Output Channels
* **Direct Browser ESC/POS Silent Print**: Triggered directly upon sale completion (`Enter`).
* **Server-Generated PDF**: Downloadable vector PDF generated via backend service.
* **WhatsApp Direct Dispatch**: Encodes customer mobile number and invoice summary with direct link to digital receipt.

---

## 13. Reports, Analytics & Business Intelligence

### 13.1 Phase 1 Report Catalog
* **Sales Analytics**: Daily Sales Report, Monthly Trends, Product-Wise Sales Velocity, Cashier Performance Report, Top 20 Selling Products, Fast vs Slow Moving Inventory analysis.
* **Financial & Profit Reports**: Gross Profit Report (Sales Revenue - Cost of Goods Sold), Net Margin % by Category, Discount Impact Analysis.
* **Inventory Reports**: Stock Summary Report, Low Stock Alert Report, Out-of-Stock Report, Comprehensive Stock Valuation Report, Stock Movement Audit Report.
* **Payment Collections**: Daily Cash Register Reconciliation (Opening Float + Inflows - Outflows = Counted Balance), UPI Settlements, Card Transactions, Credit Balances.
* **Outstanding Debt Aging**: Customer Receivables (0-30 days, 31-60 days, >60 days overdue) and Supplier Payables.

---

## 14. Notifications & Operational Alerts

* **Alert Channels**: In-app Notification Bell drawer + visual table badges + dashboard widget counters.
* **Core Alert Triggers**:
  1. `Low Stock Alert`: Product stock reaches or falls below minimum threshold.
  2. `Out of Stock Alert`: Product stock reaches zero.
  3. `Batch Expiry Warning`: Batches expiring within 30 days.
  4. `Customer Credit Overdue`: Customer credit balance exceeding payment term limit.

---

## 15. System Audit Trail ("Who Did What and When?")

* **Scope**: Logs every authentication attempt, price modification, stock adjustment, sale cancellation, user permission edit, and configuration change.
* **Data Recorded**: `timestamp`, `userId`, `userName`, `userRole`, `actionType`, `module`, `entityId`, `oldValues` (JSON), `newValues` (JSON), `reason`, `ipAddress`.
* **Zero Secret Logging**: Password strings, session tokens, and secrets are strictly excluded from audit payloads.

---

## 16. Business Settings & Store Configuration

* **Store Master Profile**: Legal Name, Trade Name, GSTIN, State Code, Contact Details, Store Logo.
* **Invoice Preferences**: Numbering Prefix (e.g. `INV-2026-`), Reset frequency (Annual/Continuous), Terms & Conditions, Bank Details.
* **POS Hardware Preferences**: Thermal receipt format (`58mm` / `80mm` / `A4`), Cash drawer trigger, Audio feedback toggle.
* **Tax & Pricing**: Default Tax Slab, Tax Inclusive/Exclusive default mode.
* **Security & Session**: Session timeout duration, Password complexity policy.

---

## 17. Explicit Gap Closures & Business Rules Summary

| Requirement Area | Frozen Business Decision |
| :--- | :--- |
| **Customer Credit Limit** | Enforced at POS. Exceeding credit limit blocks credit sale unless authorized by Manager PIN. |
| **Negative Stock Policy** | Blocked by default. Configurable manager override toggle in Settings for exceptional workflows. |
| **Decimal Quantities** | Supported up to 3 decimal places for measured goods (Kg, Litres, Metres); 0 decimals for discrete units (Pcs). |
| **Tax Pricing Mode** | Selectable per store (Tax Inclusive or Tax Exclusive); items calculate exact base price and GST split. |
| **Invoice Cancellation** | Legal document protection: Invoices cannot be deleted. Void/Cancel preserves original record with audit trail. |
| **Financial Rounding** | Half-up rounding to 2 decimal places (`₹0.00`) across all calculations. |
| **Soft Delete Policy** | Master entities (Products, Customers, Suppliers, Users) use soft deletion (`isActive: false` / `deletedAt`). Financial records are never deleted. |

---

## 18. Phase 2 Scope Demarcation (Excluded from Phase 1)

The following items are strictly assigned to **Phase 2** and must not be implemented in Phase 1:
* Mobile / PWA Native Layouts & Responsive Navigation Drawers.
* Device Camera-based Barcode Scanning.
* AI/ML Stock Demand Prediction and Automated Reorder Optimization.
* OCR Supplier Invoice PDF Intake.
* Multi-Branch Cloud Data Replication.
* Direct Government GST Portal e-Invoicing / e-Way Bill API Sync.