# Frontend Architecture

## 1. Overview
The frontend is a desktop-first Single Page Application / Hybrid Web Application built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS.

## 2. Directory Structure (`apps/web`)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router routes & layouts
│   │   ├── layout.tsx          # Root HTML layout with providers
│   │   ├── globals.css         # Global Tailwind directives & token utilities
│   │   ├── providers.tsx       # TanStack QueryClientProvider wrapper
│   │   └── page.tsx            # Application landing page
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Atomic design components (Button, Input, Table, Modal)
│   │   ├── layout/             # Shell components (Header, Nav, MegaMenu, SearchBar)
│   │   └── modules/            # Domain-specific components (POS Cart, StockAdjuster)
│   ├── hooks/                  # Custom React hooks (useBarcodeScanner, useCart)
│   ├── lib/                    # Utilities (cn, formatting, API client)
│   └── types/                  # Shared frontend TypeScript interfaces
```

## 3. State Management & Data Fetching
* **Server Cache (TanStack Query)**: Handles all server data caching, stale-while-revalidate cycles, query invalidation on mutation success, and background polling.
* **Form State (React Hook Form + Zod)**: Manages form inputs with schema validation prior to network dispatch.
* **Local UI State (React Context)**: Lightweight context for the active POS cart items, held bills state, and global command palette (`⌘K`).

## 4. Hardware Integrations (Desktop POS)
* **USB/Bluetooth Barcode Scanner**: Custom `useBarcodeScanner` hook listens to global window keypress bursts (< 50ms interval terminating in `Enter`) and dispatches directly to cart additions without stealing focus from input fields.
* **Thermal Receipt Printing**: Styled via dedicated `@media print` ESC/POS CSS rules supporting standard `58mm` and `80mm` widths.

## 5. UI Design System Alignment
* Adheres strictly to [.ai/UI_RULES.md](../../.ai/UI_RULES.md):
  * **Typography**: `Plus Jakarta Sans` for UI; `IBM Plex Mono` for SKUs/barcodes/invoices; `tabular-nums` for all financial figures.
  * **Color Palette**: Solid white surfaces, `#FCF9F6` warm canvas, `#FF7048` Coral primary brand accent, `#111722` Dark Navy typography, and semantic status colors.
  * **Surfaces & Borders**: Soft neutral borders (`#EAE5E0`), pill-shaped interactive controls (`rounded-full`), and high-elevation modals.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md) and [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md)
