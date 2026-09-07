# UI Rules & Design System Specification

## 1. Executive Visual Identity & Design Philosophy

The Inventory Management System (IMS) is a production-grade inventory, counter billing (POS), and operations management system designed for Indian retail stores, pharmacies, FMCG distributors, supermarkets, and warehouse operations.

### Core Visual Direction
The approved design language merges five pillars into a unified, high-performance interface:
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

### Visual Tone & Brand Attributes
* **Professional & Trustworthy**: Serious business software engineered for mission-critical operations.
* **Operational & Scannable**: High information density balanced with generous whitespace, structured cards, and high-contrast typographic hierarchy.
* **Fast & Tactile**: Instant feedback, rapid keyboard-driven billing, clear focus states, and zero unnecessary decorative clutter.
* **Refined & Modern**: Subtle border definitions, soft multi-layer drop shadows, clean cool neutrals, and refined indigo primary accents.

### Strict Anti-Patterns (What IMS Is NOT)
* **NOT** a generic flat Bootstrap/AdminLTE template.
* **NOT** an overwhelming, bloated legacy ERP screen.
* **NOT** a healthcare, medical-charting, or clinical dashboard.
* **NOT** a finance-only terminal or fintech trading platform.
* **NOT** a futuristic neon, dark-mode cyberpunk, or gaming UI.
* **NOT** a playful, childish, or consumer social app.
* **NOT** an excessively blurred glassmorphism showcase.
* **NOT** a dark enterprise dashboard. The IMS visual canvas is light, crisp, and high-clarity.

---

## 2. Desktop-First Rule & Target Display Resolutions

### Phase 1 Desktop Boundary
Phase 1 UI is **STRICTLY DESKTOP-ONLY**. The interface is optimized for desktop PCs, POS billing terminals, counter laptops, and office workstations.

```
Target Breakpoints:
├── 1280px × 800px  (Minimum supported desktop resolution)
├── 1366px × 768px  ★ PRIORITY COUNTER BILLING TARGET (Standard POS Laptop/Monitor)
├── 1440px × 900px  ★ PRIORITY OFFICE TARGET (Standard Desktop Workstation)
└── 1920px × 1080px (Full HD widescreen operations display)
```

### Usability Constraints:
* **Zero Viewport Overflow on Billing**: At `1366×768` and `1440×900`, the primary POS billing workflow (Cart, Totals, Fast Payment buttons, and Complete Sale CTA) must fit cleanly within the viewport without vertical page scrolling.
* **Phase 2 Scope Separation**: Mobile UI, Progressive Web App (PWA) layouts, responsive mobile navigation drawers, and mobile camera scanning belong strictly to Phase 2. Phase 1 components must be architecturally modular and reusable, but must not be compromised with mobile compromises or bottom sheets in Phase 1.

---

## 3. Global Application Shell & Navigation Architecture

The authenticated application shell consists of a top header, optional sub-navigation/breadcrumbs, a structured main content canvas, and global modal/drawer layers.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] IMS  Inventory Management System   Dashboard  POS  Inventory  Sales  Purchases  Reports  More ▾│ [🔍 ⌘K] [🔔 3] [Avatar (Admin) ▾] [+ New Sale]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Page Header: Title, Breadcrumbs, Contextual Actions & Date Filter                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│ Main Content Canvas (Max-width: 1600px / Full-width for POS, Background: #F8FAFC)                │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Top Application Header (Fixed Height: `64px` / `h-16`)
* **Left Section**:
  * **Brand Identity**: IMS Emblem / Logo (`32×32px`) + App Title "**IMS**" (`font-bold text-slate-900`) + Subtitle "**Inventory Management System**" (`text-xs text-slate-500 font-medium`).
* **Center Navigation Bar**:
  * **Dashboard**: `/dashboard`
  * **POS**: `/pos` (Prominent visual highlight badge)
  * **Inventory**: `/inventory`
  * **Sales**: `/sales`
  * **Purchases**: `/purchases`
  * **Reports**: `/reports`
  * **More ▾**: Mega-dropdown for secondary and master-data modules.
* **Right Section**:
  * **Global Search Trigger**: Search bar input simulation (`⌘K` shortcut badge, `w-56`).
  * **Keyboard Help**: `?` shortcut helper overlay trigger.
  * **Notification Bell**: Lucide `Bell` icon with unread count indicator pill.
  * **User Profile Menu**: User avatar (`36×36px`) with initials/photo, Full Name (`text-sm font-semibold`), User Role badge (`Admin`, `Manager`, `Cashier`), and dropdown arrow.
  * **Primary Header CTA**: `+ New Sale` (`bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700`).

### Active Navigation Rules:
* Active nav link state: `text-indigo-600 font-semibold bg-indigo-50/80 rounded-md border-b-2 border-indigo-600`.
* Inactive nav link state: `text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium`.
* Active navigation state must strictly match the current active route. Never display stale or unrelated navigation items as active.

### "More" Navigation Mega-Menu Structure
When clicking or hovering "More ▾", a multi-column structured popover with subtle Liquid Glass surface appears:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MASTER DATA           INVENTORY                 TRANSACTIONS             ADMINISTRATION          │
│ • Products            • Warehouses              • Sales Returns          • Users & Staff         │
│ • Categories          • Stock Movements         • Purchase Returns       • Roles & Permissions   │
│ • Brands              • Stock Adjustments       • Payment History        • Audit Logs            │
│ • Customers           • Stock Transfers         • Invoices & Receipts    • Notifications         │
│ • Suppliers           • Batch & Expiry Tracking • Customer/Supplier Ledger• Business Settings   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Typography System

The typography system is built around high legibility, professional aesthetics, and strict numeric alignment for financial and inventory accuracy.

```
Primary Font:           Plus Jakarta Sans (UI, Headings, Navigation, Forms, Tables)
Technical / Code Font:  IBM Plex Mono     (SKU, Barcode, Invoice Numbers, IDs, Hashes)
Numeric / Financial:    Plus Jakarta Sans with OpenType Tabular Numerals (tabular-nums)
```

### Typography Scale & Hierarchy

| Role | Font Family | Size | Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | Plus Jakarta Sans | `28px` (`1.75rem`) | `36px` | Bold (`700`) | `-0.02em` | Main Operations Dashboard metric headers |
| **Page Title** | Plus Jakarta Sans | `22px` (`1.375rem`) | `28px` | Bold (`700`) | `-0.015em` | Top-level screen title (`h1`) |
| **Section Title** | Plus Jakarta Sans | `18px` (`1.125rem`) | `24px` | SemiBold (`600`) | `-0.01em` | Card groups, table titles, modal headers (`h2`) |
| **Card Header / Sub**| Plus Jakarta Sans | `15px` (`0.9375rem`)| `22px` | SemiBold (`600`) | `-0.005em`| Widget cards, form section headers (`h3`) |
| **Body (Default)** | Plus Jakarta Sans | `14px` (`0.875rem`) | `20px` | Regular (`400`) | `0` | Form labels, descriptions, general text |
| **Table Body Cell** | Plus Jakarta Sans | `13px` (`0.8125rem`)| `18px` | Regular (`400`) | `0` | Data table cell content |
| **Table Header** | Plus Jakarta Sans | `11px` (`0.6875rem`)| `16px` | SemiBold (`600`) | `+0.05em` | Column headers (Uppercase) |
| **KPI Value** | Plus Jakarta Sans | `26px`–`30px` | `32px` | Bold (`700`) | `tabular-nums`| Dashboard KPI summary figures |
| **Technical Identifier**| IBM Plex Mono | `12px`–`13px` | `16px` | Medium (`500`) | `0` | SKU, Barcode, Invoice #, Payment ID |
| **Helper / Caption** | Plus Jakarta Sans | `12px` (`0.75rem`) | `16px` | Regular (`400`) | `0` | Form helper text, timestamp subtitles |
| **Badge / Pill Text** | Plus Jakarta Sans | `11px` (`0.6875rem`)| `14px` | SemiBold (`600`) | `+0.02em` | Status tags, stock status badges |

### Strict Typographic Rules:
* **Tabular Numerals**: Every financial value (₹), quantity, percentage, stock count, and report metric MUST use `font-variant-numeric: tabular-nums` (`tnum`) to ensure perfect vertical alignment across table rows.
* **Prohibited Fonts**: No cursive, script, handwritten, comic, or decorative fonts are permitted anywhere in the system.
* **Weight Discipline**: Avoid excessive bolding across whole paragraphs. Reserve `font-bold (700)` for page titles and KPI metrics; use `font-semibold (600)` for headers and `font-medium (500)` for interactive labels.

---

## 5. Color System & Semantic Tokens

The color system utilizes a refined cool-neutral base paired with an authoritative indigo primary accent and distinct semantic feedback colors.

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│     PRIMARY      │  │     SUCCESS      │  │     WARNING      │  │      DANGER      │
│  Indigo (#4F46E5)│  │ Emerald (#16A34A)│  │  Amber (#D97706) │  │   Rose (#DC2626) │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Color Palette Specification

```scss
// Base Canvas & Surfaces
$bg-canvas:        #F8FAFC; // slate-50  (Main application background)
$surface-white:    #FFFFFF; // Pure white (Card backgrounds, tables, modal surfaces)
$surface-subtle:   #F1F5F9; // slate-100 (Input background, table header, zebra rows)
$border-light:     #E2E8F0; // slate-200 (Standard card, table, and input borders)
$border-subtle:    #F1F5F9; // slate-100 (Internal row dividers)

// Typography & Content
$text-primary:     #0F172A; // slate-900 (High contrast headers, primary labels)
$text-secondary:   #475569; // slate-600 (Body text, regular table values)
$text-muted:       #94A3B8; // slate-400 (Placeholders, inactive icons, timestamps)

// Primary Brand Palette (Refined Indigo)
$primary-50:       #EEF2FF; // Subtle tint background for active nav, chips
$primary-100:      #E0E7FF; // Hover tint
$primary-500:      #6366F1; // Accent highlights, focus rings
$primary-600:      #4F46E5; // PRIMARY CTA BUTTONS, active icons, selected radio
$primary-700:      #4338CA; // Button hover state
$primary-900:      #312E81; // Deep brand text

// Semantic: SUCCESS (In Stock, Paid, Active, Completed, Profit)
$success-50:       #F0FDF4; // emerald-50  (Badge bg)
$success-200:      #BBF7D0; // emerald-200 (Badge border)
$success-600:      #16A34A; // emerald-600 (Text, checkmark, positive profit)
$success-700:      #15803D; // emerald-700

// Semantic: WARNING (Low Stock, Pending, Partial Payment, Near Expiry)
$warning-50:       #FFFBEB; // amber-50    (Badge bg)
$warning-200:      #FDE68A; // amber-200   (Badge border)
$warning-600:      #D97706; // amber-600   (Text, warning icons)
$warning-700:      #B45309; // amber-700

// Semantic: DANGER / ERROR (Out of Stock, Cancelled, Expired, Void, Destructive)
$danger-50:        #FEF2F2; // rose-50     (Badge bg)
$danger-200:       #FECACA; // rose-200    (Badge border)
$danger-600:       #DC2626; // rose-600    (Text, delete button, error banners)
$danger-700:       #B91C1C; // rose-700

// Semantic: INFO / INTEGRATION (UPI, Information alerts, Neutral links)
$info-50:          #EFF6FF; // blue-50
$info-200:         #BFDBFE; // blue-200
$info-600:         #2563EB; // blue-600
```

### Semantic Usage Rules
* **Green is NOT just "money"**: Green is reserved strictly for positive business outcomes (Paid in full, In Stock, Completed transaction, Net positive profit). Do not make every neutral currency value green.
* **Amber communicates urgency without panic**: Low stock threshold reached, partial payment collected, draft bill on hold, stock batch expiring in < 30 days.
* **Red communicates immediate blockers & permanent actions**: Out of stock (cannot bill), bill cancelled/voided, batch expired, delete confirmation button.

---

## 6. Spacing Scale, Grid System & Elevation

### 4px Multiplier Spacing System
All margins, paddings, gaps, and dimensions adhere strictly to an 8-point / 4-point spacing scale:

| Token | Value | Applied To |
| :--- | :--- | :--- |
| `space-1` | `4px` | Micro-spacing, badge padding, icon-text gap |
| `space-2` | `8px` | Input internal padding (vertical), compact button padding, chip gap |
| `space-3` | `12px`| Card header bottom margin, table cell vertical padding, form field gap |
| `space-4` | `16px`| Default card padding, button horizontal padding, standard grid gap |
| `space-5` | `20px`| Form row spacing, table cell horizontal padding |
| `space-6` | `24px`| Large card padding, dashboard widget gap, page container padding |
| `space-8` | `32px`| Major page section spacing, modal container padding |
| `space-12`| `48px`| Empty state vertical padding, authentication screen spacing |

### Border Radius Hierarchy
* **Tags, Status Pills, Counter Badges**: `rounded-full` (`9999px`)
* **Inputs, Selects, Buttons, Dropdowns**: `rounded-lg` (`8px`)
* **Cards, Tables, Dashboard Widgets**: `rounded-xl` (`12px`)
* **Modals, Dialogs, Command Palette**: `rounded-2xl` (`16px`)
* *Prohibition*: Avoid exaggerated pill shapes on inputs, square tables, or standard rectangular cards.

### Layered Elevation & Shadows
* **Card / Default Surface**: `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04); border: 1px solid #E2E8F0;`
* **Card Hover / Elevated**: `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04);`
* **Dropdown / Popover**: `box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04); border: 1px solid #E2E8F0;`
* **Modal / Command Palette / Dialog**: `box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.18); border: 1px solid rgba(226, 232, 240, 0.8);`
* *Prohibition*: Heavy pure black shadows (`rgba(0,0,0,0.5)`) or high-spread colored glow shadows are forbidden.

---

## 7. Subtle Apple iOS-Inspired Liquid Glass

Liquid Glass is utilized strictly as a **secondary visual enhancement for overlays, drawers, and floating utility surfaces**. The primary operational interface remains solid, high-contrast, and instantly readable.

```css
/* Approved Liquid Glass Surface Token */
.surface-liquid-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12),
              0 0 0 1px rgba(226, 232, 240, 0.6);
}
```

### Approved Liquid Glass Surfaces:
1. **Command Palette (`⌘K`)**: Floating global search overlay.
2. **Global Search Results Dropdown**: Autocomplete product/customer search list.
3. **Notification Drawer / Center**: Sliding panel from the right.
4. **Header Navigation Dropdowns & "More" Menu**: Contextual mega-menus.
5. **Floating Fast-Tender POS Dock**: Floating summary panel during quick payment.
6. **Date Range Picker Popover**: Calendar dropdown overlays.
7. **Contextual Action Menus (`•••`)**: Table row action popovers.
8. **Confirmation Dialog Backdrops & Containers**: Semi-translucent overlay backgrounds.

### Strictly Prohibited Liquid Glass Usage:
* **NEVER** apply glassmorphism to primary data tables or table rows.
* **NEVER** use glass on the main application background canvas.
* **NEVER** apply glass to POS cart item grids or receipt previews.
* **NEVER** use neon glow borders, rainbow refraction shaders, or psychedelic transparency.

---

## 8. Iconography & Visual Assets

* **Icon Library**: `Lucide Icons` (stroke-width: `1.75px` or `2px`).
* **Sizing Rules**:
  * Action Buttons & Table Row Actions: `16px` (`w-4 h-4`)
  * Navigation Links & Form Input Prefixes: `18px` (`w-[18px] h-[18px]`)
  * Section Headers & KPI Card Icons: `20px`–`24px` (`w-5 h-5` / `w-6 h-6`)
  * Empty State Illustrations: `40px`–`48px` container with subtle background circle
* **Icon Consistency Rules**:
  * Maintain consistent stroke width across all modules.
  * Never mix Lucide with Material Icons, FontAwesome, or custom emoji glyphs.
  * Every icon-only button (e.g. `Print`, `Trash`, `Edit`, `Close`) MUST have an accessible `aria-label` and an interactive tooltip indicating its exact action.

---

## 9. Button & Action Hierarchy

Buttons represent operational velocity. Visual weight must clearly reflect intent and risk.

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│       PRIMARY CTA       │  │        SECONDARY        │  │      DANGER ACTION      │
│  [ + Complete Sale ]    │  │    [ Hold Bill (F6) ]   │  │   [ Void Invoice ]      │
│  bg-indigo-600 text-fff │  │  bg-white border-slate   │  │  bg-rose-600 text-fff   │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

### Button Variants Specification

| Variant | Styles | Primary Usage |
| :--- | :--- | :--- |
| **Primary** | `bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm font-semibold` | `Complete Sale (F8)`, `Add Product`, `Save Purchase`, `Record Payment`, `New Sale` |
| **Secondary** | `bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-sm font-medium` | `Hold Bill (F6)`, `Cancel`, `Back to List`, `Export CSV`, `Filter` |
| **Tertiary / Subtle**| `bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 font-medium` | `Reset Filters`, `View Receipt`, `Add Item Row` |
| **Ghost** | `bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium` | Table row action toggles, Pagination controls, Tab triggers |
| **Danger** | `bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm font-semibold` | `Cancel Invoice`, `Void Sale`, `Deactivate User`, `Delete Product` |
| **Danger Outline**| `bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium` | `Remove Cart Item`, `Clear Bill`, `Reject Transfer` |

### Button States & Micro-interactions
* **Focus Ring**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`
* **Loading State**: Displays a spinning `Loader2` icon (`16px`), disables pointer events, and maintains fixed button dimensions to prevent layout jitter.
* **Single Primary Rule**: Each screen or modal may have at most **ONE** prominent Primary CTA.

---

## 10. Form Design System & Input Specifications

Forms must be accessible, fast to fill, error-resilient, and optimized for rapid keyboard data entry.

```
Standard Form Field Layout:
┌────────────────────────────────────────────────────────────────────────┐
│ Product Name *                                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Enter product title...                                          │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ Helper: Must be unique per brand/category                              │
└────────────────────────────────────────────────────────────────────────┘
```

### Form Input Components
* **Text Input / Number Input / Select**:
  * Height: `38px` (`h-[38px] px-3 py-2 text-sm`)
  * Surface: `bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400`
  * Focus State: `focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all`
* **Currency Input (₹)**:
  * Left adornment: Fixed `₹` symbol prefix (`bg-slate-50 border-r border-slate-300 px-3 text-slate-500 font-semibold`).
  * Content: `font-variant-numeric: tabular-nums; text-right font-medium`.
* **Barcode Scan Field**:
  * Left icon: `Barcode` scanner glyph.
  * Border: Distinct subtle indigo border indicating it is active and listening for USB scanner input.
* **Form Validation States**:
  * **Default**: `border-slate-300`
  * **Focus**: `border-indigo-600 ring-2 ring-indigo-100`
  * **Invalid / Error**: `border-rose-500 ring-2 ring-rose-100`. Displays an inline error message with `AlertCircle` icon below the field (`text-xs text-rose-600 font-medium mt-1`).
  * **Disabled**: `bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed`

---

## 11. Enterprise Table System

Every list and ledger across IMS (Products, Sales, Purchases, Stock Movements, Customers, Suppliers, Invoices, Audit Logs) utilizes a standardized, high-density data table.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [🔍 Search products, SKU...]  [Category: All ▾] [Status: All ▾]              [⭳ Export] [Column ▾]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ☐  PRODUCT NAME        SKU          CATEGORY    STOCK       PURCHASE    SELLING     STATUS   ••• │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ☐  Basmati Rice 5kg   [SKU-1049]   Grains      140 Bags    ₹450.00     ₹580.00    ● In Stock [▾]│
│ ☐  Fortune Oil 1L     [SKU-2091]   Edible Oil    4 Bottles ₹130.00     ₹165.00    ● Low Stock[▾]│
│ ☐  Tata Salt 1kg      [SKU-8012]   Spices        0 Packets  ₹22.00      ₹28.00    ● Out Stock[▾]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Showing 1-10 of 2,450 items                                 [Rows per page: 25 ▾]  [< Prev 1 2 3 Next >]│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Table Specifications:
1. **Compact Row Height**: Standard row height is `44px` (dense, scannable, without being cramped).
2. **Header Row**: `bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider`. Includes clickable sort direction arrows (`ArrowUpDown`, `ArrowUp`, `ArrowDown`).
3. **Zebra & Hover States**: Clean white rows with `hover:bg-slate-50/80 transition-colors`. Selected rows use `bg-indigo-50/50`.
4. **Column Alignment Rules**:
   * Text / Description / SKU / Name: **Left-aligned**
   * Status / Category / Date: **Left or Center-aligned**
   * Quantities / Amounts / Unit Prices / GST / Totals: **Right-aligned** with `font-variant-numeric: tabular-nums`.
   * Row Action Menus (`•••`): **Right-aligned** (fixed `48px` column).
5. **Sticky Table Header**: For tables with vertical scrolling, headers stick to the top with a subtle bottom divider shadow.
6. **Multi-Row Batch Selection**: Multi-select checkbox column on the left. When checked, reveals a floating batch action bar (e.g. `Export Selected`, `Print Barcode Labels`, `Bulk Category Assign`).

---

## 12. Standardized Status Badges

All badges follow a standardized pill structure: `px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5`.

| Status Category | Badge Text | Visual Styles (Tailwind Tokens) | Icon / Indicator |
| :--- | :--- | :--- | :--- |
| **Stock Status** | `In Stock` | `bg-emerald-50 text-emerald-700 border-emerald-200` | Solid Emerald Dot (`w-1.5 h-1.5`) |
| | `Low Stock` | `bg-amber-50 text-amber-700 border-amber-200` | Solid Amber Dot (`w-1.5 h-1.5`) |
| | `Out of Stock` | `bg-rose-50 text-rose-700 border-rose-200` | Solid Rose Dot (`w-1.5 h-1.5`) |
| **Payment Status**| `Paid` | `bg-emerald-50 text-emerald-700 border-emerald-200` | `CheckCircle2` |
| | `Partial` | `bg-amber-50 text-amber-700 border-amber-200` | `Clock` |
| | `Credit / Due` | `bg-indigo-50 text-indigo-700 border-indigo-200` | `CreditCard` |
| | `Cancelled` | `bg-rose-50 text-rose-700 border-rose-200` | `XCircle` |
| **Transaction** | `Completed` | `bg-emerald-50 text-emerald-700 border-emerald-200` | `Check` |
| | `Pending / Draft`| `bg-slate-100 text-slate-700 border-slate-200` | `FileText` |
| | `Void / Returned`| `bg-rose-50 text-rose-700 border-rose-200` | `RotateCcw` |
| **Batch / Expiry**| `Active` | `bg-emerald-50 text-emerald-700 border-emerald-200` | Solid Dot |
| | `Near Expiry` | `bg-amber-50 text-amber-700 border-amber-200` | `AlertTriangle` |
| | `Expired` | `bg-rose-50 text-rose-700 border-rose-200` | `AlertOctagon` |
| **User / Role** | `Admin` | `bg-purple-50 text-purple-700 border-purple-200` | `Shield` |
| | `Manager` | `bg-blue-50 text-blue-700 border-blue-200` | `UserCheck` |
| | `Cashier / Staff`| `bg-slate-100 text-slate-700 border-slate-200` | `User` |

*Accessibility Rule*: Badges MUST NOT rely on color alone. Every badge must contain clear legible text and an icon/dot indicator.

---

## 13. Operations Dashboard UI Rules

The Operations Dashboard provides a high-level, real-time command overview of daily store operations, revenue velocity, and inventory health.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Operations Dashboard                                           [Today: 04 Sep 2026 ▾] [⟳ Refresh]│
│ Real-time overview of business performance and inventory health.               [+ New Sale (F2)] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────────┐ │
│ │ TODAY'S SALES │ │ TODAY'S PUR.  │ │ TOTAL VALUATION│ │ LOW STOCK     │ │ CUSTOMER DUE         │ │
│ │ ₹48,250.00    │ │ ₹18,400.00    │ │ ₹14,85,200.00  │ │ 12 Products   │ │ ₹1,24,600.00         │ │
│ │ ↑ 14% vs yest.│ │ 3 POs received│ │ 420 Categories │ │ 3 Out of stock│ │ 18 Overdue accounts  │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────┬────────────────────────────────────────────────┤
│ SALES & PURCHASES TREND (7-Day / 30-Day View)   │ PAYMENT SPLIT        │ QUICK ACTIONS           │
│ [Area / Bar Chart: Revenue vs Purchases]        │ Cash: 45%  UPI: 40%  │ [ + Billing Counter ]   │
│                                                 │ Card: 10%  Credit: 5%│ [ + Adjust Stock ]      │
├─────────────────────────────────────────────────┴──────────────────────┴────────────────────────┤
│ RECENT TRANSACTIONS (Last 10 Sales)             │ LOW STOCK ALERTS & REORDER SUGGESTIONS         │
│ INV-1092 • Rahul Sharma • ₹1,420 • [Paid/UPI]   │ • Fortune Sunlite Oil (2 pkts left) [Order]    │
│ INV-1091 • Walk-in • ₹350 • [Paid/Cash]         │ • Dettol Soap 75g (0 pkts left) [Order]        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Layout Rules:
1. **Header Row**: Screen title "**Operations Dashboard**" + Real-time sync timestamp + Date Range dropdown (`Today`, `Yesterday`, `Last 7 Days`, `This Month`, `Custom Date Range`) + `⟳ Refresh Data` button.
2. **Primary 5-Card KPI Strip**:
   * **Today's Sales**: Gross revenue collected today + % comparison to previous period.
   * **Today's Purchases**: Total inventory procurement value today.
   * **Total Stock Value**: Total inventory valuation at cost / retail.
   * **Low Stock Items**: Count of items at or below minimum threshold (Amber badge).
   * **Outstanding Receivables**: Customer credit balance awaiting collection.
3. **Secondary Metrics Row**: Total Products count, Total Stock Units, Out of Stock Count, Today's Net Profit, Total Invoices Generated today.
4. **Interactive Data Grid**:
   * Left (60%): Sales & Purchase Revenue Trend chart (Clean area line chart with tooltip breakdown).
   * Center (20%): Payment Method Distribution (Doughnut chart: Cash, UPI, Card, Credit).
   * Right (20%): Quick Actions Panel (`Open POS`, `Add Product`, `Record Supplier Invoice`, `Stock Adjustment`).
5. **Operational Activity Tables**:
   * Recent Transactions table with direct links to invoice view.
   * Critical Low-Stock warning table with direct reorder/purchase action links.

---

## 14. POS (Point of Sale) & Counter Billing UI

POS is the **highest-velocity workflow** in the system. The interface is engineered to support sub-10-second checkout transactions with full keyboard navigation and zero screen hops.

```
┌────────────────────────────────────────────────────────┬─────────────────────────────────────────┐
│ 🔍 [F2] Scan Barcode or Search Product (Name, SKU)...  │ Customer: [Walk-in Customer      ▾] [+New]│
├────────────────────────────────────────────────────────┼─────────────────────────────────────────┤
│ CART ITEMS (4 Items)                       [Clear All] │ BILLING SUMMARY                         │
│ ┌────────────────────────────────────────────────────┐ │ Subtotal:                     ₹1,240.00 │
│ │ 1. Aashirvaad Atta 10kg               ₹420.00     │ │ Item Discounts:               - ₹40.00  │
│ │    SKU-89010   [-] [ 2 ] [+]   Qty   ₹840.00 [🗑] │ │ Order Discount (5%):          - ₹60.00  │
│ ├────────────────────────────────────────────────────┤ │ GST (18% Included):           ₹173.80   │
│ │ 2. Amul Butter 500g                   ₹275.00     │ ├─────────────────────────────────────────┤
│ │    SKU-10244   [-] [ 1 ] [+]   Qty   ₹275.00 [🗑] │ │ GRAND TOTAL:                ₹1,140.00   │
│ ├────────────────────────────────────────────────────┤ ├─────────────────────────────────────────┤
│ │ 3. Tata Tea Gold 500g                 ₹265.00     │ │ TENDER PAYMENT                         │
│ │    SKU-30911   [-] [ 1 ] [+]   Qty   ₹265.00 [🗑] │ │ [💵 Cash] [📱 UPI] [💳 Card] [📋 Credit]│
│ └────────────────────────────────────────────────────┘ │ Paid: [ ₹1,200.00 ]  Change: ₹60.00     │
├────────────────────────────────────────────────────────┼─────────────────────────────────────────┤
│ QUICK PRODUCT SHORTCUT TILES (Optional / Category View)│ [F6] Hold Bill     [F8] COMPLETE SALE   │
│ [Rice & Grains] [Oils] [Dairy] [Snacks] [Beverages]    │ [Esc] Cancel       [ 🖨 Complete & Print ]│
└────────────────────────────────────────────────────────┴─────────────────────────────────────────┘
```

### Critical POS UI Rules:
1. **Two-Panel High-Velocity Split**:
   * **Left Panel (60% width)**: Active product search bar, fast category chips, and live cart list.
   * **Right Panel (40% width)**: Customer selector, financial breakdown, tender mode selector, change calculator, and Primary Sale Action Dock.
2. **Dedicated Barcode Listening Input**: Top search bar automatically regains focus after every cart item addition or payment close.
3. **Cart Line Item Mechanics**:
   * Clear title + SKU in `font-mono text-xs text-slate-500`.
   * Unit price display.
   * Quantity stepper with immediate keyboard editability.
   * Line discount input (% or ₹).
   * Total line amount with tabular numeral formatting.
   * Immediate removal button (`Trash` icon).
4. **Fast Customer Selection**:
   * Default state: `Walk-in Customer`.
   * Phone lookup with auto-complete: Typing `98...` instantly searches existing customer accounts and reveals current outstanding balance.
   * Quick `+ New Customer` modal shortcut (`Alt+C`).
5. **Payment Method Selector**:
   * 1-Click payment buttons: `Cash`, `UPI` (generates on-screen dynamic QR code), `Card`, `Bank Transfer`, `Store Credit`.
   * Fast cash tender shortcuts: `[Exact]`, `[+₹100]`, `[+₹500]`, `[+₹2000]`.
   * Real-time calculation of `Change Due to Customer` (`text-emerald-700 font-bold text-lg`).
6. **Held Bills Dock (`F6` / `F7`)**:
   * Counter staff can hold the current active cart to service another customer.
   * Held bill counter badge in header/dock (`Held Bills (2)`).
   * 1-click resume with instant restoration of cart and customer context.
7. **Complete Sale Action Button**:
   * Huge high-contrast CTA (`h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl shadow-md flex items-center justify-center gap-2`).
   * Secondary CTA: `Complete & Print (Enter)` / `WhatsApp Receipt`.

---

## 15. Barcode Hardware Integration & Scanner UX

* **Phase 1 Hardware Focus**: Standard USB handheld laser/CCD scanners and Bluetooth POS barcode scanners operating in **Keyboard Emulation (HID Wedge) Mode**.
* **Scanner Input Buffer Handling**:
  * Scanners transmit character streams terminated by an `Enter` (CR/LF) keycode within milliseconds.
  * The global POS window listens for rapid alphanumeric bursts. When detected, the item is instantly resolved from cache, appended to the cart, and an audible soft success chime + subtle green pulse animation occurs on the cart item row.
* **Scan Failure Handling**: If an unrecognized barcode is scanned, a non-blocking toast alert appears with a button: `Product Not Found. [+ Add Product with Barcode: 8901024]` (provided user has `create_product` permission).

---

## 16. Inventory & Traceability UI Rules

**Fundamental Principle**: Stock in IMS is an immutable business asset. Stock quantities are **NEVER** silently overwritten or deleted. Every stock change is a traceable, historical **Stock Movement**.

```
Inventory Event Model:
[Opening Stock] + [Purchases] - [Sales] + [Sales Returns] - [Purchase Returns] ± [Stock Adjustments] ± [Transfers] = Current Stock
```

### Inventory View Requirements:
1. **Inventory Overview Dashboard**:
   * Total Asset Valuation at Cost Price (₹).
   * Total Asset Valuation at Selling Price (₹).
   * Total Stock Units in Warehouse / Store.
   * Filter tabs: `All Items`, `Low Stock Alert`, `Out of Stock`, `Expiring Soon`.
2. **Product Stock Traceability Ledger**:
   * Clicking any product's stock count opens its complete auditable **Movement History Drawer**:
     * Timestamp (`DD/MM/YYYY, hh:mm A`)
     * Movement Type badge (`Sale`, `Purchase`, `Adjustment`, `Return`)
     * Reference Number (Linked to `INV-1092`, `PO-4012`, `ADJ-004`)
     * Quantity Changed (`+10` in Green / `-3` in Red)
     * Stock Before Event → Stock After Event
     * Operator / Staff Name
     * Audited Reason / Note

---

## 17. Stock Adjustment UI (High-Impact Workflow)

Stock adjustment is a sensitive, auditable operation used for physical stock discrepancies, damage, spoilage, or shrinkage.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Adjust Product Stock: Basmati Rice 5kg (SKU-1049)                      │
├────────────────────────────────────────────────────────────────────────┤
│ Current Recorded Stock:            140 Bags                            │
│ Warehouse Location:                Main Warehouse                      │
├────────────────────────────────────────────────────────────────────────┤
│ Adjustment Type:                   [ (•) Reduce Stock   ( ) Add Stock ]│
│ Quantity to Adjust:                [ 5 ] Bags                          │
│ Resulting New Stock:               135 Bags                            │
├────────────────────────────────────────────────────────────────────────┤
│ Reason Category *:                 [ Damaged Goods / Spoilage        ▾]│
│ Audit Note / Explanation *:        Water leakage in shelf B-4          │
├────────────────────────────────────────────────────────────────────────┤
│ ⚠ This action directly impacts stock valuation and will be logged.     │
│                                    [ Cancel ]  [ Confirm Adjustment ]  │
└────────────────────────────────────────────────────────────────────────┘
```

### Stock Adjustment Rules:
* **Mandatory Reason**: Adjustment reason is required (`Damaged`, `Expired`, `Inventory Count Discrepancy`, `Theft/Lost`, `Internal Store Usage`).
* **Visual Math**: Always display `Current Stock (140)` ± `Adjustment (5)` = `Calculated New Stock (135)`.
* **Permission Gated**: Restricted to users with `adjust_stock` permission (Admin / Manager). Cashier view must show adjustment as disabled or hidden.

---

## 18. Products, Categories & Brands UI

### Product Catalog Table Columns:
1. `Checkbox` (Multi-select)
2. `Product Details` (Name, Brand, Category, Thumbnail placeholder)
3. `SKU` (`IBM Plex Mono text-xs bg-slate-100 px-2 py-0.5 rounded`)
4. `Barcode` (`IBM Plex Mono text-xs`)
5. `Purchase Price` (Permission-masked: Admin/Manager only; Cashier sees `—`)
6. `Selling Price` (₹ with tax inclusion indicator)
7. `Current Stock` (Quantity + Unit e.g. `140 Pcs`, with status badge)
8. `Min Stock Alert Threshold`
9. `Status` (`Active` / `Inactive` toggle)
10. `Actions` (`View Details`, `Edit`, `Print Barcode Label`, `Adjust Stock`, `Deactivate`)

### Product Create / Edit Modal Structure:
* **Tab 1: Basic Info**: Product Name, Category dropdown, Subcategory, Brand, Unit (Pieces, Kg, Litres, Packets, Boxes), Description, Barcode, SKU (auto-generate option).
* **Tab 2: Pricing & Tax**: Purchase Price (excl. tax), GST Tax Slab (`0%`, `5%`, `12%`, `18%`, `28%`), Margin Calculator, Selling Price (incl. tax), Maximum Retail Price (MRP), Wholesale / Minimum Discount allowed.
* **Tab 3: Stock & Warehouse**: Initial Opening Stock, Minimum Low Stock Alert Threshold, Default Warehouse Location, Batch/Expiry tracking toggle.

---

## 19. Customer & Supplier Management UI

### Customer CRM & Ledger
* **Customer List**: Name, Mobile Phone (`font-mono`), Total Lifetime Purchases (₹), Current Outstanding Balance (₹), Last Purchase Date, Status.
* **Customer Profile View**:
  * Header: Contact info, WhatsApp trigger link, Billing address, GSTIN (for B2B retail).
  * Financial KPI Strip: Total Invoices, Total Paid, Total Outstanding Credit, Credit Limit.
  * **Customer Ledger Tab**:
    * Clean double-entry business ledger (`Date`, `Transaction Ref`, `Debit (Sales)`, `Credit (Payments)`, `Running Balance`).
  * Invoices Tab & Payment History Tab.
  * Quick Action: `[ Record Customer Payment ]` modal.

### Supplier Management & Payables
* **Supplier List**: Company Name, Contact Person, Phone, Email, GSTIN, Total Procurement Value, Pending Payable Balance, Status.
* **Supplier Profile & Payables Ledger**:
  * Purchase Orders & Inward Receipt history.
  * Running Ledger for supplier payments and return debit notes.
  * Quick Action: `[ Record Supplier Payment ]`.

---

## 20. Sales, Invoices & Bill Mistake Protection

### Invoices Are NOT Disposable Records
* **Strict Prohibition**: There is **NO** generic `Delete Invoice` action anywhere in the system.
* Invoices are legal financial instruments. To rectify mistakes, the system provides:
  1. **Void / Cancel Invoice**: For same-day counter cashier mistakes before store reconciliation.
  2. **Sales Return / Credit Note**: For goods returned by customers.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Void / Cancel Sale Invoice: INV-1092                                   │
├────────────────────────────────────────────────────────────────────────┤
│ Customer:                          Rahul Sharma (9876543210)           │
│ Invoice Total:                     ₹1,420.00 (Paid via UPI)            │
├────────────────────────────────────────────────────────────────────────┤
│ Cancellation Reason *:             [ Cashier Billing Mistake         ▾]│
│ Audit Remarks *:                   Double scanned item #2 by mistake   │
│ Manager PIN / Approval *:          [ • • • • ]                         │
├────────────────────────────────────────────────────────────────────────┤
│ ⚠ Effects of Cancellation:                                            │
│ • Invoice status will be marked CANCELLED (Preserved in audit history) │
│ • 4 items will be automatically returned to Main Warehouse stock      │
│ • Refund of ₹1,420.00 will be recorded in payment register            │
│                                    [ Keep Invoice ]  [ Void Invoice ]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 21. Invoice Printing & Layout Formats

The invoice rendering engine supports three standardized layout formats:

```
┌─────────────────────────┐  ┌────────────────────────────────────────────────────────┐
│   58mm / 80mm THERMAL   │  │             A4 FULL TAX INVOICE (GST COMPLIANT)        │
│                         │  │                                                        │
│      IMS RETAIL         │  │ IMS MEGA STORE                        TAX INVOICE      │
│  GSTIN: 27AAAAA0000A1Z5 │  │ GSTIN: 27AAAAA0000A1Z5                Invoice: INV-1092│
│  Date: 04/09/2026 14:30 │  │ Mumbai, Maharashtra                   Date: 04/09/2026 │
│  Invoice: INV-1092      │  ├────────────────────────────────────────────────────────┤
│ ----------------------- │  │ Billed To: Rahul Sharma   Phone: 9876543210            │
│ Item   Qty  Rate  Total │  ├────────────────────────────────────────────────────────┤
│ Rice    2   420   840.00│  │ #  ITEM      HSN    QTY  RATE   DISC  GST%  TAX    TOTAL │
│ Oil     1   275   275.00│  │ 1  Rice 5kg  1006   2    420    0.00  5%    42.00  882.00│
│ ----------------------- │  ├────────────────────────────────────────────────────────┤
│ Subtotal:      ₹1,115.00│  │ Bank Details: HDFC Bank  A/C: 501000... IFSC: HDFC...  │
│ GST (5%):         ₹55.75│  │ Terms: Goods once sold will not be returned.           │
│ GRAND TOTAL:   ₹1,170.75│  │ Subtotal: ₹1,115.00   CGST: ₹27.88   SGST: ₹27.88      │
│ Paid (UPI):    ₹1,170.75│  │ GRAND TOTAL: ₹1,170.75 (Rupees One Thousand One...)    │
│ ----------------------- │  │                                                        │
│   Thank You! Visit Again│  │ [Authorized Signatory]                                 │
└─────────────────────────┘  └────────────────────────────────────────────────────────┘
```

### Invoice Actions Bar:
* `🖨 Print Bill (Enter)` (Auto-triggers browser print dialog with silent thermal print option)
* `📄 Download PDF` (Server-generated vector PDF)
* `💬 Share on WhatsApp` (Opens WhatsApp Business Web/Desktop with pre-filled invoice message & link)
* `✉ Email Invoice`

---

## 22. Sales Returns & Purchase Returns UI

### Sales Return Workflow:
```
Find Original Invoice # → Select Items to Return → Enter Return Qty → Enter Reason → Choose Refund Mode (Cash / Credit Note / Original UPI) → Complete Return
```
* **Inventory Effect**: Returned stock immediately increments warehouse inventory with a `Sales Return` movement record.
* **Accounting Effect**: Generates a Credit Note with unique ID (`CN-2026-001`).

### Purchase Return Workflow:
```
Select Supplier Purchase Bill → Select Products & Qty → Specify Return Reason (Damaged / Rejected) → Record Supplier Debit Note → Inventory Reduced
```

---

## 23. Purchases & Receiving UI

The purchase workflow manages incoming inventory stock from vendors and suppliers.

```
Select Supplier → Enter Purchase Invoice / PO # → Add Received Products (Quantity, Purchase Price, GST) → Select Receiving Warehouse → Confirm Stock Inward
```
* **Direct Stock Increase**: Confirming a purchase invoice immediately increases current stock for all included products in the selected warehouse.
* **Payment Terms**: Supports `Full Payment`, `Partial Payment`, or `Supplier Credit (Pending Payable)`.

---

## 24. Payments & Financial Registries

* **Unified Payment Register**:
  * Displays all financial cashflow transactions (Inflows from Sales, Outflows for Purchases, Customer Credit Settlements, Supplier Payments, Refunds).
  * Filterable by Payment Method: `Cash`, `UPI`, `Card`, `Bank Transfer`, `Credit`.
* **Daily Cash Drawer / Register Close**:
  * Opening Cash Float
  * Cash Collected from Sales
  * Cash Paid Out for Expenses/Refunds
  * Expected Cash in Drawer vs Actual Counted Cash (Discrepancy audit).

---

## 25. Warehouses & Multi-Location Stock Transfers

* **Warehouse Management Screen**:
  * List of warehouse/store locations (e.g. `Main Storefront`, `Central Godown`, `Cold Storage`).
  * Total products and valuation stored per warehouse.
* **Inter-Warehouse Stock Transfer**:
  * Select Source Warehouse → Destination Warehouse.
  * Product & Quantity selector with live source availability validation.
  * Transfer Status: `Draft` → `In Transit` → `Received / Completed` (or `Cancelled`).
  * Source stock decrements and destination stock increments atomically upon receiving confirmation.

---

## 26. Batch & Expiry Management UI

For FMCG, pharmaceuticals, and perishable goods, IMS provides batch-level traceability.

* **Batch Grid Columns**: Batch Number (`IBM Plex Mono`), Product Name, Manufacturing Date, Expiry Date, Remaining Stock, Warehouse Location, Days to Expiry, Status Badge.
* **Visual Expiry Alerts**:
  * `Active`: > 60 days remaining (Green)
  * `Near Expiry`: ≤ 30 days remaining (Amber badge with `AlertTriangle`)
  * `Expired`: Past expiry date (Red badge with `AlertOctagon` - **BLOCKED from POS billing**).

---

## 27. Reports & Analytics UI

The reporting center provides business intelligence with date filtering, summaries, charts, and export capabilities (`Excel`, `CSV`, `PDF`, `Print`).

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Reports & Business Intelligence                                [This Month: Sep 2026 ▾] [⭳ Export]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Sales Reports] [Purchase Reports] [Inventory Valuation] [Profit & Loss] [Payment Collections]    │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌───────────────────┐ │
│ │ TOTAL REVENUE        │ │ TOTAL COST OF GOODS  │ │ GROSS PROFIT         │ │ PROFIT MARGIN %   │ │
│ │ ₹4,85,200.00         │ │ ₹3,62,400.00         │ │ ₹1,22,800.00         │ │ 25.31%            │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └───────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DETAILED TRANSACTION & PRODUCT BREAKDOWN TABLE                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Approved Phase 1 Report Catalog:
1. **Sales Reports**: Daily Sales Summary, Monthly Sales, Product-wise Sales, Top-Selling Products, Staff/Cashier-wise Sales.
2. **Purchase Reports**: Supplier Purchases, Daily Inward Summary.
3. **Profit & Loss**: Gross Profit per invoice, Net Profit summary, Margin percentage by Category.
4. **Inventory Reports**: Stock Summary, Low Stock Alerts, Out of Stock, Stock Valuation (Cost vs Retail), Stock Movement Audit.
5. **Returns Reports**: Customer Sales Returns, Supplier Purchase Returns.
6. **Payment Collection Reports**: Cash Collection, UPI Reconciliation, Card Settlements, Bank Ledger.
7. **Outstanding Receivables & Payables**: Customer Credit Aging, Supplier Pending Payments.

---

## 28. User Management, Roles & Granular Permissions UI

IMS implements strict Role-Based Access Control (RBAC) with granular permissions.

### User Roles Overview:
* **Admin**: Complete system control, business settings, role assignments, audit logs, price adjustments.
* **Manager**: Full operational access (POS, Inventory, Products, Purchases, Sales, Reports, Returns, Customer/Supplier ledgers). Restricted from managing system admin settings.
* **Cashier / Staff**: High-velocity POS billing, customer creation, sales history, print/WhatsApp receipts.
  * **Strictly Restricted from**: Deleting products, editing purchase prices, unrestricted stock adjustments, managing users, viewing confidential profit margins.

### Permission-Aware UI Behavior:
* **UI Elements Disabled / Hidden**: If a user lacks a specific permission (e.g. `adjust_stock` or `view_profit`), the corresponding button/column is either hidden or rendered in a disabled state with a tooltip: `Requires permission: adjust_stock`.
* *Security Axiom*: Frontend permission checks are for **UI/UX only**. The NestJS backend enforces the true security boundary.

---

## 29. Notifications & Real-Time Alerts Center

The Notifications Center provides a sliding drawer with subtle Liquid Glass styling:

* **Notification Categories**:
  1. `Stock Alerts`: Low stock thresholds breached, out-of-stock items.
  2. `Expiry Warnings`: Batches expiring within 30 days.
  3. `Financial Alerts`: Overdue customer credit accounts, large cash drawer thresholds.
  4. `System Alerts`: Daily backup status, login anomalies.
* **Interactive Behavior**:
  * Unread badge counter on top header bell icon.
  * Clicking an alert navigates directly to the affected entity (e.g. clicking a low-stock alert opens the Product Reorder screen).
  * `Mark All as Read` and category filter tabs (`All`, `Unread`, `Stock`, `Finance`).

---

## 30. Audit Log UI ("Who Did What and When?")

The Audit Log is an immutable, chronological event log of all business-critical operations.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ System Audit Log Explorer                  [User: All ▾] [Module: All ▾] [Date: Last 7 Days ▾]   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TIMESTAMP          USER             ACTION            MODULE      REFERENCE    DETAILS               │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 04/09/2026 14:32   Rahul (Cashier)  Sale Created      Sales       INV-1092     Total: ₹1,420 (UPI)   │
│ 04/09/2026 12:15   Priya (Manager)  Stock Adjusted    Inventory   ADJ-004      Basmati Rice (-5 Bags)│
│ 04/09/2026 10:04   Admin            Price Changed     Products    SKU-1049     Selling: ₹420 → ₹450  │
│ 04/09/2026 09:01   Rahul (Cashier)  User Login        Auth        SESSION-9    IP: 192.168.1.45      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Audit Log Integrity Rules:
* **Zero Secret Exposure**: Audit logs NEVER record or display plaintext passwords, authentication tokens, API keys, or full credit card numbers.
* **Searchable & Filterable**: Filter by User, Date Range, Module (`Auth`, `Sales`, `Inventory`, `Products`, `Settings`), and Action Type.

---

## 31. Business Settings & Configuration UI

Settings are organized into clean tabbed panels to avoid overwhelming a single page:

1. **Business Profile**: Store Name, Trade Name, Registered Address, Phone, Email, Support WhatsApp number, Store Logo uploader.
2. **Tax & GST Configuration**: GSTIN Number, State Code, Composition Scheme toggle, Default Tax Slab, Tax Inclusive/Exclusive pricing mode.
3. **Invoice & Print Settings**: Invoice Prefix (e.g. `INV-`), Starting Number, Default Printer Layout (`58mm`, `80mm`, `A4`), Header/Footer notes, Terms & Conditions text, Bank Account details for A4 invoices.
4. **POS Counter Settings**: Default Customer (`Walk-in`), Barcode Audio Beep toggle, Auto-open Print Dialog on sale complete toggle, Quick Cash tender denominations.
5. **Inventory & Alert Thresholds**: Default Low Stock Alert threshold, Expiry warning threshold (days before expiry).
6. **User Preferences & Security**: Password change, Active sessions, Session timeout duration.

---

## 32. Global Search & Command Palette (`⌘K`)

Pressing `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) summons the floating Command Palette with subtle Liquid Glass backdrop blur:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🔍 Type a command or search products, customers, invoices...     [Esc] │
├────────────────────────────────────────────────────────────────────────┤
│ QUICK ACTIONS                                                          │
│ ⚡ [ + New Counter Sale ]                                     Shortcut: F2│
│ ⚡ [ + Add New Product ]                                      Shortcut: P │
│ ⚡ [ + Record Stock Adjustment ]                                          │
├────────────────────────────────────────────────────────────────────────┤
│ PRODUCTS                                                               │
│ 📦 Basmati Rice 5kg            SKU-1049 • ₹450.00 • 140 Bags in stock   │
│ 📦 Fortune Sunlite Oil 1L      SKU-2091 • ₹165.00 • 2 pkts (Low Stock)  │
├────────────────────────────────────────────────────────────────────────┤
│ CUSTOMERS                                                              │
│ 👤 Rahul Sharma                +91 9876543210 • ₹0.00 Outstanding       │
│ 👤 Amit Verma                  +91 9811223344 • ₹1,200.00 Due           │
├────────────────────────────────────────────────────────────────────────┤
│ INVOICES & ORDERS                                                      │
│ 🧾 INV-1092                    ₹1,420.00 • Today, 14:32 • [Paid / UPI]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 33. System State Patterns (Loading, Empty, Error, Success)

Every component, card, and table must gracefully handle all lifecycle states.

### 1. Skeleton Loading States (No Layout Shift)
* Use subtle shimmering skeleton blocks (`bg-slate-200/70 animate-pulse rounded-md`) matching the exact width and height of the destination cards, KPI figures, and table rows.
* Never use full-page blocking spinners for routine table or widget updates.

### 2. Standardized Empty States
When a search, table, or list returns zero records, render a structured empty state:
* Centered container (`py-12 text-center`).
* Soft circular icon badge (`w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3`).
* Clear Title: `text-base font-semibold text-slate-800` (e.g. "No Products Found").
* Informative Subtitle: `text-sm text-slate-500 max-w-sm mx-auto mb-4` (e.g. "Try adjusting your search terms or filter criteria, or add your first product.").
* Contextual Action Button: `[ + Add Product ]`.

### 3. Error States & Error Boundaries
* Human-readable, non-technical explanation (e.g. "Unable to load sales data due to a network interruption.").
* Never expose raw database stack traces, SQL errors, or backend code paths to the user.
* Include a prominent `[ ⟳ Retry ]` button and a secondary `[ Report Issue ]` link.

### 4. Toast Notifications & Success Feedback
* Non-blocking toast notifications appear in the bottom-right corner (`duration: 4000ms`).
* Structure: Icon (`CheckCircle2` in green) + Title (`Sale Completed`) + Subtitle (`Invoice #INV-1092 generated successfully`) + Action button (`[ View Receipt ]`).

### 5. Permission Denied State
* Shield / Lock icon (`ShieldAlert` in rose-500).
* Headline: "Access Restricted".
* Description: "You do not have permission to view this section. If you require access, please contact your store administrator."
* Action: `[ Return to Dashboard ]`.

---

## 34. Keyboard Navigation & POS Usability Standards

IMS is optimized for high-speed counter operation with minimal mouse reliance.

### Global Keyboard Shortcuts:

| Shortcut Key | Global Action | Context |
| :--- | :--- | :--- |
| `F2` | Focus Product Search / Open POS | Global |
| `F4` | Focus Customer Phone Lookup | POS |
| `F6` | Hold Current Active Bill | POS |
| `F7` | Resume Held Bill Selector | POS |
| `F8` | Open Tender / Complete Sale Modal | POS |
| `F9` | Print Last Invoice Receipt | POS |
| `⌘K` / `Ctrl+K` | Open Command Palette / Global Search | Global |
| `Esc` | Close Modal / Cancel Drawer / Clear Search | Global |
| `Enter` | Select highlighted item / Confirm Primary Action | Modals / POS |
| `↑` / `↓` | Navigate autocomplete lists & table rows | Search / Tables |

### Focus Ring Accessibility:
* Every interactive button, input, tab, and menu item displays a distinct, high-contrast focus ring when navigated via keyboard: `focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 outline-none`.

---

## 35. Data Formatting & Indian Business Localization

```
Currency:              ₹ (Indian Rupee Symbol)
Number Grouping:       Indian Numbering System (Lakhs & Crores)
Date Format:           DD/MM/YYYY (e.g. 04/09/2026)
Date & Time Format:    DD/MM/YYYY, hh:mm A (e.g. 04/09/2026, 02:30 PM)
Tax System:            GST (Goods and Services Tax)
Payment Modes:         Cash, UPI, Card, Bank Transfer, Credit / Khata
```

### Indian Number Grouping Examples:
* `₹450.00`
* `₹24,580.00`
* `₹1,24,300.00` (One Lakh Twenty Four Thousand Three Hundred)
* `₹14,85,200.00` (Fourteen Lakhs Eighty Five Thousand Two Hundred)
* `₹1,25,00,000.00` (One Crore Twenty Five Lakhs)

### GST Breakdown Representation:
* Intra-State Transactions: Display equal split of **CGST** and **SGST** (e.g. `18% GST = 9% CGST + 9% SGST`).
* Inter-State Transactions: Display unified **IGST** (e.g. `18% IGST`).

---

## 36. Single Common Authentication & Account UI Specification

> **Architectural Standard**: IMS uses **ONE Common Login System** and **ONE Common Registration Flow**. All users (Admin, Manager, Cashier, Staff, etc.) access the application through the exact same authentication screens. There are **NO separate role-based login screens**. Downstream role/permission authorization takes effect inside the application shell after login.

### 36.1 Common Login Screen (`/login`)
* **Card Container**: Centered branded glass card (`w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8`).
* **Header**: Brand Logo, Application Name ("Inventory Management System"), Subtitle ("Sign in to your counter or management terminal").
* **Elements**:
  * `Identifier Field`: Input for username or email address with left icon (`User` / `Mail`).
  * `Password Field`: Input with eye toggle (`Eye` / `EyeOff`) to show/hide plaintext.
  * `Remember Me`: Checkbox extending session duration for counter terminals.
  * `Primary CTA`: `Sign In` button (`h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg w-full`).
  * `Divider`: Visual "or continue with" horizontal separator.
  * `Google Sign-In CTA`: `Continue with Google` button (`h-11 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg w-full flex items-center justify-center gap-2`).
  * `Footer Links`: "Forgot Password?" (`/forgot-password`) and "Create an account" (`/register`).

### 36.2 Common Registration Screen (`/register`)
* **Card Container**: Centered branded card (`max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8`).
* **Elements**:
  * Full Name, Email, Username, Password, and Password Confirmation fields.
  * "Sign up with Google" alternative button.
  * "Already have an account? Sign In" link (`/login`).

### 36.3 Email Verification Screen (`/verify-email`)
* **Card Container**: Centered confirmation card (`max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8 text-center`).
* **Elements**:
  * Verification status badge / icon (`MailCheck` / `Loader2`).
  * "Resend Verification Email" action button.
  * "Back to Login" link (`/login`).

---

## 37. Phase 1 vs Future Scope Boundaries

To prevent scope creep and maintain development focus, strict boundaries are enforced:

### Phase 1 Confirmed UI Scope:
* Desktop Web UI (Optimized for `1366×768` and `1440×900`).
* Core Operations Dashboard & Real-Time KPIs.
* High-Velocity POS Counter Billing with USB/Bluetooth Barcode Scanner Support.
* Product, Category, Brand, Customer, and Supplier Master Data Management.
* Multi-Warehouse Stock Tracking & Inter-Warehouse Transfers.
* Traceable Stock Movement Ledgers & Stock Adjustments.
* Sales Returns, Purchase Returns & Credit/Debit Notes.
* 58mm/80mm Thermal Receipts & A4 Tax Invoices.
* Customer & Supplier Double-Entry Ledgers (Khata).
* Granular Role-Based Permissions (Admin, Manager, Cashier).
* Comprehensive Reports, Notifications & System Audit Logs.

### Phase 2 Future Scope (DO NOT DESIGN OR IMPLEMENT IN PHASE 1):
* Mobile native apps (iOS / Android) and mobile-responsive drawer adaptations.
* Progressive Web App (PWA) offline mode.
* Device camera barcode scanning.
* AI/ML stock prediction, demand forecasting, and automated reorder triggers.
* OCR invoice image scanning.
* Cloud multi-branch replication and distributed syncing.
* Direct e-Way Bill and government GST portal direct API filing.
* Payment gateway integrations for online customer payment links.

---

## 38. UI Design DO's and DON'Ts

### DO:
* **DO** maintain the CareOps-inspired top-navigation structure across all authenticated screens.
* **DO** use `Plus Jakarta Sans` for UI and `IBM Plex Mono` for technical identifiers (SKU, Barcodes, Invoice IDs).
* **DO** ensure all numeric financial and inventory columns use tabular numerals (`tabular-nums`) and are right-aligned.
* **DO** keep POS billing fast, keyboard-accessible, and strictly within the desktop viewport without vertical page scrolling.
* **DO** treat inventory stock as an immutable historical ledger where every change produces a visible movement record.
* **DO** require mandatory reasons and confirmations for high-impact actions (Stock Adjustments, Invoice Cancellations).
* **DO** use subtle Liquid Glass exclusively on floating overlays, menus, and drawers.
* **DO** localize currency to `₹` with proper Indian numbering notation (`1,00,000`).

### DO NOT:
* **DO NOT** replace top navigation with a left sidebar.
* **DO NOT** use generic, unstyled admin templates or dark-mode cyber dashboards.
* **DO NOT** create mobile-specific screens or mobile bottom sheets in Phase 1.
* **DO NOT** use decorative, cursive, or novelty fonts.
* **DO NOT** use pure black heavy shadows or neon glowing borders.
* **DO NOT** create a generic "Delete Invoice" button. Invoices must be Voided/Cancelled with audit logs.
* **DO NOT** rely solely on color to communicate status (always pair color with clear text and icon indicators).
* **DO NOT** expose raw database errors or stack traces to the user.
* **DO NOT** invent unrelated features (such as HR, payroll, hospital workflows, or manufacturing pipelines).

---

## 39. Header User Area Specification Update (DECISION-013)

Per user approval in **DECISION-013**, the authenticated application header user area has been updated:
* **No Profile Avatar**: The top navigation bar MUST NOT render any profile avatar (photos, initials circles, Google avatar images, generated avatars, or broken image placeholders).
* **Header User Structure**: The user menu trigger is composed solely of:
  1. User Full Name (`text-xs font-semibold text-slate-800`)
  2. Role Badge (`px-1.5 py-0.5 text-[10px] font-semibold rounded border uppercase`)
  3. Dropdown Chevron (`ChevronDown`)
* **Menu Actions**: Full dropdown functionality remains intact (Profile & Account, Store Settings, Sign Out).
* *Historical Note*: Earlier draft specifications in this document mentioning a 36×36px avatar in the header are superseded by DECISION-013.