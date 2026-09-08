# Administrator & Store Operations Guide

## 1. Status Notice
* **Implementation Status**: Phase 10 Foundation (Universal Business Onboarding, Product Master, Categories, Brands, Multi-Warehouse Inventory, Stock Adjustments, Transfers, Batches, and Form Redesign) is **Implemented & Verified**.
* Phases 11–17 (POS counter billing, procurement, invoices, ledger, reporting) follow the master roadmap.

---

## 2. Managing Inventory & Stock Adjustments
* **Stock Adjustments**: When physical stock differs from digital records, open `/stock-adjustments` and click `New Adjustment`. Enter the discrepancy quantity, select the mandatory reason category (`DAMAGED_GOODS`, `PHYSICAL_COUNT_DISCREPANCY`, etc.), provide a detailed audit note, and confirm.
* **Inter-Warehouse Transfers**: Navigate to `/stock-transfers` to dispatch stock between warehouses with state tracking (`DRAFT` → `IN_TRANSIT` → `COMPLETED`).

---

## 3. Universal Business Onboarding & Store Profile
* **Onboarding Setup (`/onboarding`)**: Complete multi-step setup including Step 1 Multi-Business Type Selection (e.g. Footwear + Clothing + Grocery), store contact information, GSTIN configuration, and single/multi-warehouse settings.
* **Store Branding**: Business profile information personalizes the top navigation header and store settings.

---

## 4. User Access & Audit Logging (DECISION-016)
* **Single Universal Admin Access Model**: All authenticated users receive full operational permissions across the platform without complex role hierarchy management.
* **Audit Trail**: Inspect the immutable chronological event log under `/audit-logs` to review system actions with diff payloads.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
