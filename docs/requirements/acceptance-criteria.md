# Acceptance Criteria

This document defines formal verification rules and acceptance criteria for all core features in SMS / Universal Inventory Platform.

## 1. Authentication & Universal Access
* **AC-AUTH-01**: Given valid credentials, when a user logs in, then a secure `HttpOnly` session cookie (`sms_session`) is returned with status `200 OK` and universal admin permissions payload (`accessLevel: "Admin"`, all 38 permission codes).
* **AC-AUTH-02**: Given 5 consecutive failed login attempts within 15 minutes, when another attempt is made, then the server returns `429 Too Many Requests` with a rate-limit cooldown message.
* **AC-AUTH-03**: Given an unauthenticated request to any protected API endpoint, the server returns `401 Unauthorized`. (Note: Single Universal Admin Access Model DECISION-016 grants full permissions to all authenticated users).
* **AC-AUTH-04**: The `/login` and `/register` authentication UI screens are frozen and protected against accidental restyling or layout changes.

## 2. Universal Business Onboarding
* **AC-ONB-01**: Given Step 1 of `/onboarding`, when clicking multiple business type cards (e.g. Footwear and Clothing), all selected cards remain visibly selected, an active counter displays `"2 selected"`, and clicking an already selected card toggles it off.
* **AC-ONB-02**: Given completed onboarding, the system marks `isOnboardingCompleted = true`, provisions the default warehouse, and redirects the user to the operational dashboard.

## 3. Product Catalog & Canonical Form Standards
* **AC-FORM-01**: Given any form modal/drawer across the application, input fields render with `h-11` height, `#FAF7F4` background, required fields marked with `*` and optional fields with `(Optional)`, and pressing `Escape` closes the modal.
* **AC-PROD-01**: Given product creation, SKU and barcode uniqueness are strictly validated at both client and database levels.

## 4. POS Billing & Checkout
* **AC-POS-01**: Given a valid product barcode, when scanned via USB barcode scanner, then the product is instantly resolved and added to the active cart with default quantity `1` within 100ms.
* **AC-POS-02**: Given a product with `currentStock = 0`, when attempting to add to cart, then the system displays an out-of-stock warning and blocks checkout.
* **AC-POS-03**: Given an active sale with subtotal ₹1,000 and 18% GST (inclusive), then the system calculates Base Price = ₹847.46, CGST = ₹76.27, and SGST = ₹76.27.
* **AC-POS-04**: Given a customer with credit limit ₹5,000 and current balance ₹4,500, when attempting a Credit sale of ₹1,000, then the transaction is blocked with `CREDIT_LIMIT_EXCEEDED`.
* **AC-POS-05**: Given a successful sale confirmation, when `prisma.$transaction` completes, then:
  * A unique sequential invoice number (`INV-2026-XXXXXX`) is generated.
  * Inventory stock in the warehouse is decremented.
  * A `StockMovement` record of type `SALE` is created with before and after stock levels.
  * The receipt payload is returned with status `201 Created`.
* **AC-POS-06**: Given the POS screen, category filter tabs render dynamically from real persisted categories associated with existing inventory products. Zero hardcoded industry categories are displayed.

## 5. Invoicing & Mistake Protection
* **AC-INV-01**: Given any existing invoice, there is no generic `DELETE` endpoint or action available in the system.
* **AC-INV-02**: Given an invoice cancellation request, when submitted with mandatory reason code, then:
  * The invoice status changes to `CANCELLED`.
  * All items are restored to the warehouse stock via a compensatory `StockMovement`.
  * An audit log entry is recorded with operator ID, reason, and timestamp.

## 6. Sales Returns & Credit Notes
* **AC-RET-01**: Given an original invoice with 3 units of Product A, when a return of 2 units is processed, then:
  * A Credit Note (`CN-2026-XXXX`) is created for the value of 2 units.
  * Warehouse inventory for Product A increments by 2 units.
  * A `StockMovement` of type `SALES_RETURN` is recorded.

## 7. Stock Adjustments
* **AC-ADJ-01**: Given an existing stock of 100 units, when a stock reduction of 5 units is submitted with reason `DAMAGED_GOODS` and audit note, then:
  * New stock becomes 95 units.
  * `StockAdjustment` record is generated.
  * `StockMovement` of type `ADJUSTMENT_DECREASE` is logged with quantity `-5.000`.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
* Security Constraints: [.ai/SECURITY_RULES.md](../../.ai/SECURITY_RULES.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
