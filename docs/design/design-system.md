# UI/UX Design System

## 1. Visual Identity & Design Pillars

```
CAREOPS-INSPIRED OPERATIONS DASHBOARD STRUCTURE
                     +
         MODERN PREMIUM SAAS POLISH
                     +
   SUBTLE APPLE iOS-INSPIRED LIQUID GLASS
                     +
      PROFESSIONAL INVENTORY TRACEABILITY
                     +
             FAST RETAIL POS UX
```

---

## 2. Typography System
* **Primary UI Font**: `Plus Jakarta Sans` (page headers, forms, tables, buttons, general body).
* **Technical Code Font**: `IBM Plex Mono` (SKUs, barcodes, invoice numbers, payment IDs).
* **Numeric Financial Standard**: All currency values (`₹`), quantities, percentages, and metrics strictly use OpenType tabular numerals (`font-variant-numeric: tabular-nums`).

---

## 3. Color Tokens Specification

```scss
// Backgrounds & Canvas
$canvas-bg:      #F8FAFC; // slate-50 (Main application background)
$surface-white:  #FFFFFF; // Solid white card & table surfaces
$border-light:   #E2E8F0; // slate-200 standard borders

// Primary Brand
$primary-600:    #4F46E5; // Refined Indigo (Primary buttons, active nav)
$primary-50:     #EEF2FF; // Subtle tint background

// Semantic Tokens
$success-600:    #16A34A; // Emerald (In Stock, Paid, Active, Net Profit)
$warning-600:    #D97706; // Amber (Low Stock, Pending, Near Expiry)
$danger-600:     #DC2626; // Rose (Out of Stock, Cancelled, Expired, Danger CTA)
$info-600:       #2563EB; // Blue (Info alerts, UPI badges)
```

---

## 4. Subtle Liquid Glass Utility
* **Approved Surfaces**: Command Palette (`⌘K`), notification drawers, filter popovers, date pickers, confirmation modals.
* **Prohibited Surfaces**: Data tables, entire background canvases, POS billing item grids.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
