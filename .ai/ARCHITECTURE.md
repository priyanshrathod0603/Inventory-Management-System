# System Architecture & Technical Specification

## 1. High-Level Architectural Topology

The Inventory Management System (IMS) adheres to a multi-tier, modular client-server architecture with strict separation of concerns, server-authoritative business logic, and transactional consistency.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT / PRESENTATION LAYER                          │
│        Next.js (React 18+) • TypeScript • Tailwind CSS • shadcn/ui • Lucide      │
│          TanStack Query (Data Fetching & Cache) • React Hook Form • Zod          │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTPS / REST API / Cookie Auth
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              API & GATEWAY LAYER                                 │
│        NestJS REST Controllers • OpenAPI / Swagger • Cookie Session Guard        │
│    Universal Admin Permission Guards • Rate Limiters • Global Exception Filter   │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Dependency Injection
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC & DOMAIN SERVICES                         │
│  Auth • Users • Business Profile • Products • Inventory • POS/Sales • Purchases  │
│    Returns • Ledger • Payments • Invoicing • Audit Logger • Reporting Engine     │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Interactive Prisma Transactions
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          DATA ACCESS & PERSISTENCE LAYER                         │
│            Prisma ORM • PostgreSQL 16+ (Relational Storage & Constraints)        │
│                 Redis (Session Store, Rate Limiting & Fast Cache)                │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Async Queues (Non-Critical Workloads)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         BACKGROUND WORKERS & ADAPTERS                            │
│           BullMQ Workers • PDF Generator • WhatsApp / Email Adapters             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture (Next.js + React + TypeScript)

* **Framework**: Next.js with React and TypeScript.
* **Component Design System**: Tailwind CSS paired with `shadcn/ui` and `Lucide Icons` following Warm Luxury SaaS design language.
* **State & Data Management**:
  * **Server Cache & Sync**: `TanStack Query` (React Query) handles API queries, mutation invalidation, optimistic updates (where safe), and background polling.
  * **Form Management**: `React Hook Form` integrated with `Zod` schemas for client-side validation prior to API submission. Canonical form UX/UI standard (Section 40 of UI_RULES.md).
  * **UI State**: React context / lightweight state for active POS billing cart, keyboard shortcut listeners, and notification drawers.
* **Hardware Integration**:
  * **POS Barcode Scanner Handler**: Custom React hook listening for rapid keycode streams from USB/Bluetooth HID scanners and routing directly into the cart without losing form focus.
  * **Thermal Printing**: Direct browser `window.print()` targeting specialized `@media print` ESC/POS thermal CSS stylesheets (`58mm` and `80mm`).

---

## 3. Backend Architecture (NestJS Modular System)

The backend is built as a structured, modular NestJS application. Major business domains are isolated into dedicated modules containing their respective Controllers, Services, DTOs, and Repositories.

### Modular Breakdown:
```
src/
├── app.module.ts
├── common/
│   ├── decorators/         # @RequirePermissions, @CurrentUser, @Public
│   ├── filters/            # GlobalExceptionFilter
│   ├── guards/             # SessionAuthGuard, PermissionsGuard
│   ├── interceptors/       # AuditLogInterceptor, TransformResponseInterceptor
│   └── pipes/              # ZodValidationPipe
├── modules/
│   ├── auth/               # Single Common Auth: Login, Signup, Google OAuth, Email Verification, Session lifecycle, Password reset
│   ├── users/              # User management & profile (Single Universal Admin access model)
│   ├── business-profile/   # BusinessProfile setup, onboarding wizard, store identity, multi-warehouse setting
│   ├── permissions/        # System permissions catalog & seeder (38 granular permissions)
│   ├── roles/              # [SUPERSEDED / REMOVED per DECISION-016 — All users receive full permissions]
│   ├── products/           # Catalog, categories, brands, barcode lookup, SKU generation
│   ├── inventory/          # Stock movements, adjustments, stock transfers
│   ├── warehouses/         # Multi-warehouse location management
│   ├── batches/            # Batch tracking & expiry date management
│   ├── sales/              # POS counter checkout, held bills, order discounts
│   ├── purchases/          # Supplier procurement, inward stock receiving
│   ├── returns/            # Sales returns (Credit Notes) & Purchase returns (Debit Notes)
│   ├── customers/          # Customer profiles, Khata double-entry ledger, credit limits
│   ├── suppliers/          # Vendor master & payables ledger
│   ├── payments/           # Inflows, outflows, refunds, cash drawer reconciliation
│   ├── invoices/           # Invoice numbering, PDF rendering, layout formatting
│   ├── reports/            # SQL-aggregated analytics, profit/loss, tax reports
│   ├── notifications/      # Real-time stock/expiry alerts
│   ├── audit/              # System-wide immutable event logging
│   └── settings/           # Store profile, GST configuration, print preferences
└── infrastructure/
    ├── database/           # PrismaService, transaction manager
    ├── redis/              # RedisService (cache, session store)
    └── queues/             # BullMQ queue definitions
```

---

## 4. Transactional Integrity & Concurrency Control

Critical operations modifying financial data and inventory balances MUST execute within **Prisma Interactive Transactions (`prisma.$transaction`)**.

### Atomic POS Sale Execution Pattern:
```typescript
await this.prisma.$transaction(async (tx) => {
  // 1. Validate stock availability with row-level locks (or decrement condition)
  // 2. Decrement warehouse_inventory quantity
  // 3. Create immutable StockMovement records (type: 'SALE')
  // 4. Create Sale and SaleItem records (capturing unit price & cost price snapshot)
  // 5. Create Invoices record with atomic unique sequence number
  // 6. Create Payments record
  // 7. Update Customer outstanding balance & CustomerLedger if Credit sale
  // 8. Log AuditLog event
});
```

* **Zero Partial States**: If any sub-operation fails (e.g., payment rejected or insufficient inventory), the entire transaction aborts and rolls back completely.
* **Double Submission Prevention**: Idempotency keys or client-generated request tokens are validated on checkout endpoints to prevent accidental double-billing on rapid clicks.

---

## 5. Security & Authorization Architecture

* **Authentication & Session Security**:
  * Secure server-side session management stored in PostgreSQL/Redis.
  * Session token issued via an `HttpOnly`, `Secure` (in production), `SameSite=Lax` cookie named `sms_session`.
  * Passwords hashed using `Argon2id` with cryptographically secure random salts.
* **Single Universal Admin Access Model (DECISION-016)**:
  * All authenticated users operate with full operational permissions across the platform.
  * The backend provisions all 38 system permissions from the `permissions` table to any authenticated session.
  * Controller endpoints utilize `@RequirePermissions(...)` guards which pass for all valid sessions.
  * Complex multi-role hierarchy (Admin, Manager, Cashier, Staff) and the `roles` / `role_permissions` tables have been permanently superseded and removed.
* **Protected Auth UI**:
  * `/login` and `/register` authentication screens are strictly frozen and protected from accidental redesign.
* **Input Validation & Sanitization**:
  * Strict schema validation using Zod/class-validator DTOs on all request payloads.
  * Parameterized queries via Prisma ORM preventing SQL injection.

---

## 6. Document & Receipt Generation Architecture

* **Thermal ESC/POS Layouts (`58mm` and `80mm`)**:
  * Rendered via high-precision HTML/CSS with monospace typography and ESC/POS styling.
  * Direct browser print triggers with automatic feed and cut command formatting.
* **A4 GST Tax Invoices**:
  * Full official GST layout generated server-side using HTML templates compiled to vector PDF.
  * Stored in local protected directory or served via streaming API endpoint (`/api/v1/invoices/:id/pdf`).

---

## 7. Reporting & Analytics Architecture

* **Database-Level Aggregation**: All financial, sales velocity, margin %, and inventory valuation reports are computed using optimized PostgreSQL aggregation queries, CTEs, and indexed database views.
* **Performance Rule**: Large raw datasets are never streamed to the frontend for client-side computation. The backend aggregates and returns finalized mathematical metrics.

---

## 8. Asynchronous Background Jobs & Adapters

* **Queue Engine**: `BullMQ` backed by `Redis`.
* **Queue Workloads**:
  * Background batch PDF generation for bulk month-end reports.
  * WhatsApp Business API notification dispatch.
  * Email invoice delivery.
  * Nightly batch expiry check and low-stock alert summarization.
* **Critical Operation Separation**: Core POS checkout, inventory deduction, and payment capture execute **synchronously in the main database transaction** and NEVER depend on queue availability.

---

## 9. Backup, Restore & Disaster Recovery Strategy

* **Automated Database Backups**:
  * Daily automated `pg_dump` snapshot of the PostgreSQL database.
  * Backups encrypted using AES-256 before storage.
  * Rolling retention policy: 7 daily snapshots, 4 weekly snapshots, 12 monthly archives.
* **Restore & Disaster Recovery**:
  * Fully documented restore drill: Verification of dump integrity, database drop/recreate, migration validation, and data consistency check.
  * Restoration operations require Admin credentials and generate mandatory audit records.

---

## 10. Deployment & Containerization Architecture

* **Docker Architecture**:
  * **Frontend Container**: Multi-stage build producing an optimized standalone Next.js production server.
  * **Backend Container**: Multi-stage build compiling NestJS TypeScript into lean production Node.js artifacts with Prisma Client.
  * **Database Container**: Managed PostgreSQL 16+ with persistent volume storage.
* **Environment Configuration**:
  * Environment variables strictly separated between `.env.development`, `.env.staging`, and `.env.production`.
  * **Strict Policy**: No `.env` or `.env.example` files containing real secrets may ever be committed to version control.

---

## 11. Universal Business Platform Architecture (DECISION-018)

* **Universal Business Platform Topology**:
  * The system is a universal commerce engine serving any retail/wholesale vertical (Grocery, Footwear, Clothing, Electronics, Pharmacy, Hardware, Furniture, General Store, etc.).
  * **Zero Hardcoded Industry Data**: No application screen, backend handler, or database seed hardcodes vertical-specific categories or catalog structures.
  * **Data Flow**:
    ```
    Active Business (BusinessProfile) → Business Data → Products → Categories → Inventory → POS
    ```
* **POS Category Source-of-Truth**:
  * POS screen category filters are dynamically populated **solely** from real persisted categories associated with existing products in the active business inventory.
  * If no categories exist in the active business, POS displays only `"All"` and an appropriate empty state.
* **Multi-Business Selection vs. Multi-Warehouse Distinction**:
  * **Multi-Business Selection** (Onboarding Step 1): Allows merchants operating hybrid businesses to select multiple business types simultaneously (e.g., Footwear + Clothing + Grocery).
  * **Multi-Warehouse (`isMultiWarehouse`)**: An inventory capability flag controlling whether stock is tracked across multiple physical locations (godowns/storefronts) for a single business entity. It is NEVER a multi-business or multi-tenant switch.
* **Current Phase 10 Foundation vs. Future Scope Boundary**:
  * **Current Implemented Foundation (Phase 10)**: Single `BusinessProfile` entity per user account holding business identity, multi-type selection (`businessType` / `customBusinessType`), GST details, and `isMultiWarehouse` capability flag.
  * **Future Multi-Business Scope**: Normalized multi-business tenant entity model with contextual business switching per account is scheduled for subsequent phases.