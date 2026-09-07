# User Stories

This document captures core user personas and their corresponding user stories for IMS.

## User Personas
1. **Cashier / Counter Staff**: High-velocity checkout operator focused on fast scanning, minimal clicks, quick customer lookup, and receipt generation.
2. **Store Manager**: Operations manager handling inward purchases, stock adjustments, vendor payments, customer credit limits, and sales returns.
3. **Store Admin / Owner**: Business owner analyzing gross profit margins, revenue trends, inventory valuation, audit logs, and configuring store settings.

---

## 1. Cashier / Staff Stories

* **US-101 (Fast POS Checkout)**: As a Cashier, I want to scan product barcodes directly into the cart so that I can process customer purchases in under 10 seconds without touching the mouse.
* **US-102 (Hold & Resume Bill)**: As a Cashier, I want to hold a customer's active cart (`F6`) when they forget an item, service another customer, and resume the held bill (`F7`) later without re-scanning items.
* **US-103 (Customer Phone Lookup)**: As a Cashier, I want to search an existing customer by typing their mobile number to view their credit balance or share their digital invoice via WhatsApp.
* **US-104 (Split & Fast Payment)**: As a Cashier, I want to enter cash tender amounts using quick shortcuts (`+₹100`, `+₹500`) and see exact change due so that cash handling is error-free.
* **US-105 (Receipt Printing)**: As a Cashier, I want the thermal receipt to automatically trigger printing upon sale completion (`Enter`) so that the customer gets their bill immediately.

---

## 2. Store Manager Stories

* **US-201 (Stock Receiving)**: As a Store Manager, I want to record inward purchase invoices from suppliers and verify received quantities so that inventory increases accurately in real time.
* **US-202 (Sales Returns & Credit Notes)**: As a Store Manager, I want to process item returns against original invoices with reason codes so that stock is restored and customers receive store credit or refunds.
* **US-203 (Stock Adjustment Audit)**: As a Store Manager, I want to perform stock corrections (e.g. damaged goods or count discrepancies) with mandatory audit notes so that stock valuation stays accurate.
* **US-204 (Customer Credit Limit Control)**: As a Store Manager, I want to set maximum credit limits per customer so that high-risk unpaid accounts are blocked from taking further credit.
* **US-205 (Inter-Warehouse Transfers)**: As a Store Manager, I want to transfer inventory between godowns and track `In-Transit` status until received by the destination store.

---

## 3. Store Admin / Owner Stories

* **US-301 (Operations Dashboard)**: As an Admin, I want to see real-time KPIs (Today's Sales, Purchases, Total Stock Valuation, Low Stock Alerts, and Outstanding Customer Debt) in one scannable dashboard.
* **US-302 (Gross Profit Analysis)**: As an Admin, I want to view profit reports (Revenue minus Cost of Goods Sold) across categories so that I understand product profitability.
* **US-303 (Audit Trail Investigation)**: As an Admin, I want to inspect the system audit log to see "Who did what and when?" for sensitive actions like price changes, stock adjustments, and invoice cancellations.
* **US-304 (Role & Permission Control)**: As an Admin, I want to assign granular permissions to staff roles so that cashiers cannot delete products or view supplier purchase prices.

---

## Source Reference
* Derived from: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md) and [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
