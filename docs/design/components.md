# UI Components Specification

This document details the core component library rules for IMS.

## 1. Buttons & Actions
* **Primary CTA**: `.pill-btn-coral` (`h-9` or `h-11`, `bg-[#FF7048] hover:bg-[#F55F34] text-white rounded-full shadow-coral font-semibold text-xs sm:text-sm`).
* **Secondary**: `.pill-btn-secondary` (`bg-white border border-[#EAE5E0] text-[#111722] hover:bg-[#F8F5F2] rounded-full`).
* **Danger**: `.pill-btn-danger` (`bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-full font-semibold`).
* **Loading State**: Disables pointer events, shows inline spinning `Loader2` without layout shift.

## 2. Forms & Inputs
* **Pill Input**: `.pill-input` (`px-5 py-3.5 bg-white border border-[#EAE5E0] rounded-full text-xs sm:text-sm text-[#111722] focus:border-[#FF7048] focus:ring-4 focus:ring-[#FF7048]/14`).
* **Warm Form Input**: `.form-input-warm` (`px-4 py-2.5 bg-white border border-[#EAE5E0] rounded-[14px] text-xs sm:text-sm text-[#111722] focus:border-[#FF7048] focus:ring-4 focus:ring-[#FF7048]/14`).
* **Currency Input (₹)**: Left fixed prefix `₹` + right-aligned tabular numerals (`font-variant-numeric: tabular-nums`).
* **Validation Error**: `border-rose-500 ring-4 ring-rose-500/15` + red error message with `AlertCircle` icon.

## 3. Data Tables & Containers
* **Container**: `bg-white rounded-[24px] border border-[#EAE5E0] shadow-card overflow-hidden`.
* **Header**: `bg-[#F8F5F2] text-xs font-semibold text-[#5F636B] uppercase tracking-wider border-b border-[#EAE5E0]`.
* **Column Alignment**: Text left-aligned; Numbers/Currency right-aligned (`tabular-nums`); Status center-aligned; Actions right-aligned.

## 4. Status Badges (Pills)
* Standard Pill: `px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5`.
* `In Stock` / `Paid` / `Active`: `bg-emerald-50 text-emerald-700 border-emerald-200`
* `Low Stock` / `Pending` / `Near Expiry`: `bg-amber-50 text-amber-700 border-amber-200`
* `Out of Stock` / `Cancelled` / `Expired`: `bg-rose-50 text-rose-700 border-rose-200`

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
