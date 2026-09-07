# Acceptance Criteria

This document defines formal verification rules and acceptance criteria for all core features in IMS.

## 1. Authentication & RBAC
* **AC-AUTH-01**: Given valid credentials, when a user logs in, then a secure `HttpOnly` session cookie (`sms_session`) is returned with status `200 OK` and active role permissions payload.
* **AC-AUTH-02**: Given 5 consecutive failed login attempts within 15 minutes, when another attempt is made, then the server returns `429 Too Many Requests` with a rate-limit cooldown message.
* **AC-AUTH-03**: Given a Cashier role, when accessing endpoints restricted to Manager/Admin (e.g. `POST /api/v1/inventory/adjustments`), then the server returns `403 Forbidden`.

## 2. POS Billing & Checkout
* **AC-POS-01**: Given a valid product barcode, when scanned via USB barcode scanner, then the product is instantly resolved and added to the active cart with default quantity `1` within 100ms.
* **AC-POS-02**: Given a product with `currentStock = 0`, when attempting to add to cart, then the system displays an out-of-stock warning and blocks checkout (unless negative stock override is active).
* **AC-POS-03**: Given an active sale with subtotal ₹1,000 and 18% GST (inclusive), then the system calculates Base Price = ₹847.46, CGST = ₹76.27, and SGST = ₹76.27.
* **AC-POS-04**: Given a customer with credit limit ₹5,000 and current balance ₹4,500, when attempting a Credit sale of ₹1,000, then the transaction is blocked with `CREDIT_LIMIT_EXCEEDED` unless authorized by Manager PIN.
* **AC-POS-05**: Given a successful sale confirmation, when `prisma.$transaction` completes, then:
  * A unique sequential invoice number (`INV-2026-XXXXXX`) is generated.
  * Inventory stock in the warehouse is decremented.
  * A `StockMovement` record of type `SALE` is created with before and after stock levels.
  * The receipt payload is returned with status `201 Created`.

## 3. Invoicing & Mistake Protection
* **AC-INV-01**: Given any existing invoice, there is no generic `DELETE` endpoint or action available in the system.
* **AC-INV-02**: Given an invoice cancellation request, when submitted with mandatory reason code and Manager PIN, then:
  * The invoice status changes to `CANCELLED`.
  * All items are restored to the warehouse stock via a compensatory `StockMovement`.
  * An audit log entry is recorded with operator ID, reason, and timestamp.

## 4. Sales Returns & Credit Notes
* **AC-RET-01**: Given an original invoice with 3 units of Product A, when a return of 2 units is processed, then:
  * A Credit Note (`CN-2026-XXXX`) is created for the value of 2 units.
  * Warehouse inventory for Product A increments by 2 units.
  * A `StockMovement` of type `SALES_RETURN` is recorded.

## 5. Stock Adjustments
* **AC-ADJ-01**: Given an existing stock of 100 units, when a stock reduction of 5 units is submitted with reason `DAMAGED_GOODS` and audit note, then:
  * New stock becomes 95 units.
  * `StockAdjustment` record is generated.
  * `StockMovement` of type `ADJUSTMENT_DECREASE` is logged with quantity `-5.000`.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
* Security Constraints: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
