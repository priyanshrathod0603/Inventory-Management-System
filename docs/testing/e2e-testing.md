# End-to-End (E2E) Testing Guide

## 1. Overview
End-to-End (E2E) tests use **Playwright** to execute automated browser journeys simulating cashier and manager interactions against the full stack (Next.js web UI + NestJS API + PostgreSQL database).

## 2. Core E2E Journeys
1. **Journey 1: Complete Counter Sale Journey**:
   * Login as `cashier` → Open POS screen → Input barcode `8901024001` → Verify cart item → Apply 5% order discount → Select UPI tender mode → Confirm sale (`F8`) → Assert receipt print dialogue triggered and cart cleared.
2. **Journey 2: Hold & Resume Bill**:
   * Add 3 items to cart → Press `F6` (Hold Bill) → Add 1 item for new customer and complete sale → Press `F7` (Resume Bill) → Select parked bill → Verify original 3 items restored in cart.
3. **Journey 3: Stock Adjustment & Audit Trail**:
   * Login as `manager` → Open Inventory Adjustments → Decrement stock by 5 units with reason `DAMAGED_GOODS` → Confirm adjustment → Navigate to Audit Log → Assert event is logged with operator name and diff.

---

## Source Reference
* Authoritative Specification: [.ai/CODING_RULES.md](../../.ai/CODING_RULES.md)
