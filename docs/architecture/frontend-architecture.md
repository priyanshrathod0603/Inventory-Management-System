# Frontend Architecture

## 1. Overview
The frontend is a desktop-first Single Page Application / Hybrid Web Application built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS following the Warm Luxury SaaS design system.

## 2. Directory Structure (`apps/web`)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   │   ├── layout.tsx          # Root HTML layout with providers
│   │   ├── globals.css         # Global Tailwind directives & token utilities
│   │   ├── providers.tsx       # TanStack QueryClientProvider & AuthProvider
│   │   ├── page.tsx            # Application landing & redirection router
│   │   ├── (auth)/             # Protected Single Common Auth routes (/login, /register)
│   │   └── (app)/              # Authenticated App shell routes (/dashboard, /pos, /onboarding, etc.)
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Atomic design components (Button, Input, Table, Modal)
│   │   ├── layout/             # Shell components (Header, Nav, MegaMenu, SearchBar)
│   │   └── modals/             # Canonical Section 40 Form Modals (Product, Category, Brand, etc.)
│   ├── hooks/                  # Custom React hooks (useBarcodeScanner, useCurrentUser, useUserProfile)
│   ├── lib/                    # Utilities (cn, formatting, api-client, query-keys)
│   └── types/                  # Shared frontend TypeScript interfaces
```

## 3. State Management & Data Fetching
* **Server Cache (TanStack Query)**: Handles all server data caching, stale-while-revalidate cycles, query invalidation on mutation success, and background polling.
* **Form State (React Hook Form + Zod)**: Manages form inputs with schema validation prior to network dispatch.
* **Canonical Form UX/UI Standards (Section 40)**: Centered modal geometry, `#FAF7F4` input surfaces, `h-11` heights, clear `*` required and `(Optional)` labels, clean section cards, and keyboard `Escape` dismissal.
* **Local UI State (React Context)**: Lightweight context for the active POS cart items, held bills state, and global command palette (`⌘K`).

## 4. Hardware Integrations & POS Operations
* **Dynamic Category Filters (DECISION-018)**: Category filter bar in POS is populated strictly from real persisted categories associated with active inventory products (zero hardcoded categories).
* **USB/Bluetooth Barcode Scanner**: Custom `useBarcodeScanner` hook listens to global window keypress bursts (< 50ms interval terminating in `Enter`) and dispatches directly to cart additions without stealing focus from input fields.
* **Thermal Receipt Printing**: Styled via dedicated `@media print` ESC/POS CSS rules supporting standard `58mm` and `80mm` widths.

## 5. UI Design System Alignment & Protected Auth Screens
* Adheres strictly to [.ai/UI_RULES.md](../../.ai/UI_RULES.md):
  * **Typography**: `Plus Jakarta Sans` for UI; `IBM Plex Mono` for SKUs/barcodes/invoices; `tabular-nums` for all financial figures.
  * **Color Palette**: Solid white surfaces, `#FCF9F6` warm canvas, `#FF7048` Coral primary brand accent, `#111722` Dark Navy typography, and semantic status colors.
  * **Surfaces & Borders**: Soft neutral borders (`#EAE5E0`), pill-shaped interactive controls (`rounded-full`), and high-elevation modals.
  * **Protected Auth UI**: `/login` and `/register` authentication screens are strictly frozen and protected against accidental restyling.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md), [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md), and [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
