# User Stories

This document captures core user personas and their corresponding user stories for SMS / Universal Inventory Platform.

## User Personas
1. **Store Operator / Cashier**: High-velocity checkout operator focused on fast scanning, dynamic category lookup, minimal clicks, quick customer lookup, and receipt generation.
2. **Inventory & Operations Manager**: Operations manager handling inward purchases, stock adjustments, vendor payments, customer credit limits, multi-warehouse stock, and sales returns.
3. **Business Owner / Administrator**: Business owner analyzing gross profit margins, revenue trends, inventory valuation, audit logs, and configuring store settings. (Under DECISION-016, all authenticated users have full administrative access).

---

## 0. Business Onboarding Stories

* **US-001 (Multi-Business Onboarding)**: As a business owner operating across multiple retail categories (e.g. Footwear & Clothing), I want to select multiple business types during onboarding so that my store profile reflects my true business operations.
* **US-002 (Resumable Draft Onboarding)**: As a merchant setting up my store, I want my progress automatically saved so that I can resume setup if interrupted.

---

## 1. Cashier & Counter Checkout Stories

* **US-101 (Fast POS Checkout)**: As an Operator, I want to scan product barcodes directly into the cart so that I can process customer purchases in under 10 seconds without touching the mouse.
* **US-102 (Hold & Resume Bill)**: As an Operator, I want to hold a customer's active cart (`F6`) when they forget an item, service another customer, and resume the held bill (`F7`) later without re-scanning items.
* **US-103 (Customer Phone Lookup)**: As an Operator, I want to search an existing customer by typing their mobile number to view their credit balance or share their digital invoice via WhatsApp.
* **US-104 (Split & Fast Payment)**: As an Operator, I want to enter cash tender amounts using quick shortcuts (`+₹100`, `+₹500`) and see exact change due so that cash handling is error-free.
* **US-105 (Receipt Printing)**: As an Operator, I want the thermal receipt to automatically trigger printing upon sale completion (`Enter`) so that the customer gets their bill immediately.
* **US-106 (Dynamic Category Filters)**: As an Operator, I want the POS category tabs to dynamically show only my store's real product categories so that filtering is fast and industry-accurate.

---

## 2. Inventory & Operations Stories

* **US-201 (Stock Receiving)**: As a Manager, I want to record inward purchase invoices from suppliers and verify received quantities so that inventory increases accurately in real time.
* **US-202 (Sales Returns & Credit Notes)**: As a Manager, I want to process item returns against original invoices with reason codes so that stock is restored and customers receive store credit or refunds.
* **US-203 (Stock Adjustment Audit)**: As a Manager, I want to perform stock corrections (e.g. damaged goods or count discrepancies) with mandatory audit notes so that stock valuation stays accurate.
* **US-204 (Customer Credit Limit Control)**: As a Manager, I want to set maximum credit limits per customer so that high-risk unpaid accounts are blocked from taking further credit.
* **US-205 (Inter-Warehouse Transfers)**: As a Manager, I want to transfer inventory between godowns and track `In-Transit` status until received by the destination store.

---

## 3. Business Owner & Admin Stories

* **US-301 (Operations Dashboard)**: As an Admin, I want to see real-time KPIs (Today's Sales, Purchases, Total Stock Valuation, Low Stock Alerts, and Outstanding Customer Debt) in one scannable dashboard.
* **US-302 (Gross Profit Analysis)**: As an Admin, I want to view profit reports (Revenue minus Cost of Goods Sold) across categories so that I understand product profitability.
* **US-303 (Audit Trail Investigation)**: As an Admin, I want to inspect the system audit log to see "Who did what and when?" for sensitive actions like price changes, stock adjustments, and invoice cancellations.
* **US-304 (Single Universal Admin Access)**: As an Admin, I want all authenticated users in my organization to have full operational permissions (DECISION-016) without complex role assignment bottlenecks. *(Historical multi-role RBAC is SUPERSEDED).*

---

## Source Reference
* Derived from: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md), [.ai/UI_RULES.md](../../.ai/UI_RULES.md), and [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
