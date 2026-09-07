# Feature Specifications

This document outlines detailed engineering specifications for each approved module in IMS.

## 1. Authentication & Session Management
* **Credentials Validation**: Validates `identifier` (username or email) and `password` against salted Argon2id hashes.
* **Session Lifecycle**: Issues server-managed session cookie (`sms_session`) with `HttpOnly`, `Secure` (production), and `SameSite=Strict`. Default expiry is 8 hours (or 30 days if `rememberMe` is enabled).
* **Rate Limiting**: Limits login endpoint to 5 attempts per 15 minutes per IP/username.

## 2. Point of Sale (POS) Counter Billing
* **Barcode Stream Listener**: Automatically routes rapid keystroke bursts from USB/Bluetooth HID scanners into the active cart without losing form focus.
* **Line Item Calculations**:
  * `LineTotal = (UnitPrice * Quantity) - ItemDiscount + TaxAmount`
  * Tax calculation supports Tax-Inclusive (MRP) and Tax-Exclusive configurations.
* **Held Bills (`F6` / `F7`)**: Stores up to 10 active carts in `held_bills` table, allowing cashiers to suspend transactions and resume them instantly.
* **Tender & Payment Split**: Supports mixed tenders (e.g. ₹500 Cash + ₹500 UPI). Instant dynamic calculation of `Change Due`.
* **Atomic Checkout**: Checkout executes within a single `prisma.$transaction`, generating the sequential invoice number (`INV-2026-XXXXXX`), reducing inventory, logging `StockMovement` (type: `SALE`), creating payment records, and generating the receipt payload.

## 3. Inventory Traceability & Movements
* **Non-Destructive Movement Ledger**: Every stock change produces an immutable row in `stock_movements` with `beforeStock`, `afterStock`, `movementType`, `referenceId`, and `userId`.
* **Negative Stock Control**: Negative inventory is blocked by default during POS billing unless explicitly overridden by Manager permissions.
* **Stock Adjustments**: Dedicated high-impact modal requiring mandatory reason code (`DAMAGED_GOODS`, `EXPIRED_BATCH`, `PHYSICAL_COUNT_DISCREPANCY`), detailed audit note, and Manager authorization.

## 4. Sales Returns & Credit Notes
* **Invoice Lookup**: Cashier loads original sale invoice, selects specific items and returned quantities (full or partial).
* **Restocking & Credit**: Restocks returned items into warehouse, issues Credit Note (`CN-2026-XXXX`), and refunds via Cash, original UPI reference, or Customer Khata credit.

## 5. Procurement & Inward Stock
* **Supplier Purchase Order & Inward Receipt**: Records supplier invoice details, purchase prices (cost of goods), and tax input credits. Confirming receiving increments warehouse inventory and logs `StockMovement` (type: `PURCHASE`).

## 6. Multi-Warehouse & Stock Transfers
* **Inter-Warehouse Workflow**: Initiates transfer from Source Warehouse to Target Warehouse. Status progresses: `DRAFT` → `IN_TRANSIT` (deducts source stock) → `RECEIVED / COMPLETED` (adds destination stock).

## 7. Customer Khata & Supplier Payables
* **Credit Limit Check**: Evaluates customer `outstandingBalance + currentSaleAmount <= creditLimit` during Credit checkout.
* **Double-Entry Ledgers**: Real-time ledger showing running balances for receivables and payables with settlement payment dialogues.

## 8. Invoicing & Document Engine
* **Formats Supported**:
  * `58mm` Thermal Receipt (ultra-compact, ESC/POS compatible)
  * `80mm` Thermal Receipt (standard counter layout with tax breakdown)
  * `A4` GST Tax Invoice (official format with store logo, GSTIN, HSN codes, CGST/SGST split, bank payment details, and signature block)
* **Mistake Protection**: Invoices cannot be deleted. Void/Cancellation requires reason, restocks goods, logs audit trail, and marks invoice `CANCELLED`.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
* Database Schema Reference: [.ai/DATABASE.md](../../.ai/DATABASE.md)
