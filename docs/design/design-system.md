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
$canvas-bg:      #FCF9F6; // Warm canvas (Main application background)
$surface-white:  #FFFFFF; // Solid white card & table surfaces
$surface-subtle: #F8F5F2; // Subtle neutral container surfaces
$border-light:   #EAE5E0; // Soft neutral standard borders

// Primary Brand & Typography
$primary-500:    #FF7048; // Coral (Primary CTA buttons, brand badges)
$primary-600:    #F55F34; // Coral hover
$text-navy:      #111722; // Deep Dark Navy (Primary headings & numbers)
$text-secondary: #5F636B; // Neutral secondary content

// Semantic Tokens
$success-600:    #16A34A; // Emerald (In Stock, Paid, Active, Net Profit)
$warning-600:    #D97706; // Amber (Low Stock, Pending, Near Expiry)
$danger-600:     #DC2626; // Rose (Out of Stock, Cancelled, Expired, Danger CTA)
$info-600:       #2563EB; // Blue (Info alerts, UPI badges)
```

---

## 4. Surfaces & Rounded Pill Controls
* **Pill Buttons & Inputs**: Fully rounded (`rounded-full`) controls with signature coral focus rings.
* **Elevated Cards**: `rounded-[20px]` to `rounded-[24px]` cards with soft multi-layer drop shadows (`shadow-card`).
* **Approved Popovers & Overlays**: Floating modal dialogs, notifications drawer, and command palette (`⌘K`).

---

## 5. Canonical Form UX/UI Design Standard (Section 40)
* **Modal Architecture**: Centered modal cards with rounded corners (`rounded-[24px]`), clean white surface (`#FFFFFF`), and soft backdrop (`bg-black/40 backdrop-blur-sm`).
* **Input Styling**: Standard `h-11` heights, rounded corners (`rounded-xl` / `rounded-full`), `#FAF7F4` clean warm surfaces, subtle `#EAE5E0` borders, and `#FF7048` coral focus rings (`ring-2 ring-[#FF7048]/20`).
* **Form Structure**: Grouped into distinct section cards with uppercase section headers and Lucide icons.
* **Explicit Labels**: Required fields marked with coral asterisk `<span className="text-[#FF7048]">*</span>`, optional fields explicitly marked with `<span className="text-neutral-400 text-xs font-normal">(Optional)</span>`.
* **Keyboard Accessibility**: All modals close on `Escape` key and auto-focus the primary input.

---

## 6. Protected Auth UI Policy (DECISION-010)
* The `/login` and `/register` authentication screens are strictly protected and frozen.
* Any application-wide form or styling changes must strictly exclude the `(auth)` route group.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
* Architectural Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
