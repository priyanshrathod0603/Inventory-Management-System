# Backend Architecture

## 1. Overview
The backend is a modular NestJS 10 application written in TypeScript, providing a type-safe REST API (`/api/v1/*`), OpenAPI/Swagger documentation, and transactionally secure domain services.

## 2. Directory Structure (`apps/api`)

```
apps/api/
├── prisma/
│   └── schema.prisma           # Prisma 6 PostgreSQL Schema definition
├── src/
│   ├── main.ts                 # Bootstrap: Global prefix (/api/v1), Swagger, Validation
│   ├── app.module.ts           # Root NestJS module importing domain modules
│   ├── common/                 # Shared decorators, filters, guards, and interceptors
│   │   ├── decorators/         # @RequirePermissions(), @CurrentUser()
│   │   ├── filters/            # GlobalExceptionFilter
│   │   ├── guards/             # SessionAuthGuard, PermissionsGuard
│   │   ├── interceptors/       # AuditLogInterceptor, TransformInterceptor
│   │   └── pipes/              # ValidationPipe
│   ├── prisma/                 # PrismaService & PrismaModule
│   ├── health/                 # Health check controller (/api/v1/health)
│   └── modules/                # Business domain modules
│       ├── auth/               # Authentication & Session management
│       ├── users/              # User management & role assignment
│       ├── products/           # Product catalog, categories, brands
│       ├── inventory/          # Stock movements, adjustments, transfers
│       ├── sales/              # POS checkout, held bills, order discounts
│       ├── purchases/          # Procurement & inward stock receiving
│       ├── returns/            # Sales returns & Purchase returns
│       ├── customers/          # Customer profiles & Khata ledger
│       ├── suppliers/          # Vendor master & payables ledger
│       ├── payments/           # Financial cashflow & drawer reconciliation
│       ├── invoices/           # Invoice numbering, PDF & thermal formatting
│       ├── reports/            # Database-level SQL aggregations
│       ├── notifications/      # Real-time stock/expiry alerts
│       ├── audit/              # System audit trail logging
│       └── settings/           # Store configurations
└── test/                       # E2E & integration test suites
```

## 3. Request Processing Pipeline

```
Incoming Request
       ↓
Cookie Parser & CORS Middleware
       ↓
SessionAuthGuard (Validates session cookie 'sms_session')
       ↓
PermissionsGuard (Verifies granular @RequirePermissions against user role)
       ↓
ValidationPipe (Transforms & validates payload via class-validator / DTO)
       ↓
Domain Controller → Domain Service
       ↓
Prisma Service (Interactive Transaction if multi-table mutation)
       ↓
PostgreSQL 16+ Database
       ↓
TransformInterceptor & AuditLogInterceptor
       ↓
Outgoing Response (Standard JSON Envelope)
```

## 4. Transaction Management
* Multi-table operations execute within `this.prisma.$transaction(async (tx) => { ... })`.
* Ensures all related records (e.g. Sale, SaleItems, StockMovements, Payments, Invoices, CustomerLedger) commit atomically or roll back completely on failure.

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
* API Contracts: [.ai/API_CONTRACTS.md](../../.ai/API_CONTRACTS.md)
