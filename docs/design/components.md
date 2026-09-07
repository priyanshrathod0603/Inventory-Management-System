# UI Components Specification

This document details the core component library rules for IMS.

## 1. Buttons & Actions
* **Primary CTA**: `bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold rounded-lg` (`Complete Sale`, `New Sale`, `Save`).
* **Secondary**: `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50` (`Hold Bill`, `Cancel`, `Export`).
* **Danger**: `bg-rose-600 text-white hover:bg-rose-700` (`Cancel Invoice`, `Void Sale`).
* **Loading State**: Disables pointer events, shows inline spinning `Loader2` without changing button width.

## 2. Forms & Inputs
* **Standard Input**: `h-[38px] px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100`.
* **Currency Input (₹)**: Left fixed prefix `₹` + right-aligned tabular numerals (`font-variant-numeric: tabular-nums`).
* **Validation Error**: `border-rose-500 ring-2 ring-rose-100` + red error text with `AlertCircle` icon.

## 3. Data Tables
* **Density**: Compact row height (`44px`).
* **Header**: `bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider`.
* **Column Alignment**: Text left-aligned; Numbers/Currency right-aligned (`tabular-nums`); Status center-aligned; Actions right-aligned (`48px`).

## 4. Status Badges (Pills)
* Standard Pill: `px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5`.
* `In Stock` / `Paid` / `Active`: `bg-emerald-50 text-emerald-700 border-emerald-200`
* `Low Stock` / `Pending` / `Near Expiry`: `bg-amber-50 text-amber-700 border-amber-200`
* `Out of Stock` / `Cancelled` / `Expired`: `bg-rose-50 text-rose-700 border-rose-200`

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
