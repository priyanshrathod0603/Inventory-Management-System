# Feature Specifications

This document outlines detailed engineering specifications for each approved module in SMS / Universal Inventory Platform.

## 1. Authentication & Universal Access Management
* **Credentials Validation**: Validates `identifier` (username or email) and `password` against salted Argon2id hashes.
* **Single Universal Admin Access Model (DECISION-016)**: All authenticated users operate with full operational permissions across the platform. Multi-role RBAC (Admin, Manager, Cashier, Staff) is permanently superseded.
* **Protected Auth UI**: `/login` and `/register` authentication screens are strictly frozen and protected from accidental restyling.
* **Session Lifecycle**: Issues server-managed session cookie (`sms_session`) with `HttpOnly`, `Secure` (production), and `SameSite=Lax`. Default expiry is 8 hours (or 30 days if `rememberMe` is enabled).
* **Rate Limiting**: Limits login endpoint to 5 attempts per 15 minutes per IP/username.

## 2. Universal Business Onboarding & Multi-Business Support
* **Step 1 Multi-Business Selection**: Allows merchants to select multiple industry business types simultaneously (e.g. Footwear + Clothing + Grocery) via interactive card toggle buttons with an active selection counter badge.
* **Draft Persistence**: Resumable multi-step state persisted to `BusinessProfile` on the backend.
* **Multi-Business ≠ Multi-Warehouse**: Multi-business reflects multiple store lines/verticals; multi-warehouse (`isMultiWarehouse`) is an inventory capability flag controlling whether stock is distributed across physical warehouses.
* **Default Location Provisioning**: Completing onboarding automatically initializes the primary warehouse location.

## 3. Product Catalog & Canonical Form Standards
* **Master Entities**: Products, Categories, Brands with full CRUD, barcode indexing, SKU generation, and tax-inclusive pricing.
* **Canonical Form UX/UI Standard (Section 40)**: Centered modal geometry, `#FAF7F4` input surfaces, `h-11` heights, clear `*` required and `(Optional)` labels, clean section cards, and keyboard `Escape` dismissal.

## 4. Point of Sale (POS) Counter Billing
* **Dynamic Category Filters (DECISION-018)**: Category filter tabs are populated strictly from real persisted product categories associated with existing products in the active inventory. Zero hardcoded industry categories.
* **Barcode Stream Listener**: Automatically routes rapid keystroke bursts from USB/Bluetooth HID scanners into the active cart without losing form focus.
* **Line Item Calculations**:
  * `LineTotal = (UnitPrice * Quantity) - ItemDiscount + TaxAmount`
  * Tax calculation supports Tax-Inclusive (MRP) and Tax-Exclusive configurations.
* **Held Bills (`F6` / `F7`)**: Stores active carts in `held_bills` table, allowing operators to suspend transactions and resume them instantly.
* **Tender & Payment Split**: Supports mixed tenders (e.g. ₹500 Cash + ₹500 UPI). Instant dynamic calculation of `Change Due`.
* **Atomic Checkout**: Checkout executes within a single `prisma.$transaction`, generating sequential invoice numbers (`INV-2026-XXXXXX`), reducing inventory, logging `StockMovement` (type: `SALE`), creating payment records, and returning the receipt payload.

## 5. Inventory Traceability & Movements
* **Non-Destructive Movement Ledger**: Every stock change produces an immutable row in `stock_movements` with `beforeStock`, `afterStock`, `movementType`, `referenceId`, and `userId`.
* **Negative Stock Control**: Negative inventory is blocked by default during POS billing.
* **Stock Adjustments**: High-impact modal requiring mandatory reason code (`DAMAGED_GOODS`, `EXPIRED_BATCH`, `PHYSICAL_COUNT_DISCREPANCY`) and detailed audit notes.

## 6. Sales Returns & Credit Notes
* **Invoice Lookup**: Operator loads original sale invoice, selects specific items and returned quantities (full or partial).
* **Restocking & Credit**: Restocks returned items into warehouse, issues Credit Note (`CN-2026-XXXX`), and refunds via Cash, original UPI reference, or Customer Khata credit.

## 7. Procurement & Inward Stock
* **Supplier Purchase Order & Inward Receipt**: Records supplier invoice details, purchase prices (cost of goods), and tax input credits. Confirming receiving increments warehouse inventory and logs `StockMovement` (type: `PURCHASE`).

## 8. Multi-Warehouse & Stock Transfers
* **Inter-Warehouse Workflow**: Initiates transfer from Source Warehouse to Target Warehouse. Status progresses: `DRAFT` → `IN_TRANSIT` (deducts source stock) → `RECEIVED / COMPLETED` (adds destination stock).

## 9. Customer Khata & Supplier Payables
* **Credit Limit Check**: Evaluates customer `outstandingBalance + currentSaleAmount <= creditLimit` during Credit checkout.
* **Double-Entry Ledgers**: Real-time ledger showing running balances for receivables and payables with settlement payment dialogues.

## 10. Invoicing & Document Engine
* **Formats Supported**:
  * `58mm` Thermal Receipt (ultra-compact, ESC/POS compatible)
  * `80mm` Thermal Receipt (standard counter layout with tax breakdown)
  * `A4` GST Tax Invoice (official format with store logo, GSTIN, HSN codes, CGST/SGST split, bank payment details, and signature block)
* **Mistake Protection**: Invoices cannot be deleted. Void/Cancellation requires reason, restocks goods, logs audit trail, and marks invoice `CANCELLED`.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
* Database Schema Reference: [.ai/DATABASE.md](../../.ai/DATABASE.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
