# System Architecture

## 1. High-Level Architectural Pattern

IMS is structured around a decoupled multi-tier architecture with clear separation between presentation, API gateway, domain services, and persistence layers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER (apps/web)                      │
│      Next.js (App Router) • React 19 • TypeScript • Tailwind CSS • Lucide   │
│           TanStack Query • React Hook Form • Zod Client Validation          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / REST / Session Cookie
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY (apps/api)                           │
│       NestJS Controllers • OpenAPI / Swagger • Cookie Session Guard         │
│          RBAC Permission Guards • Rate Limiters • Exception Filters         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Dependency Injection
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN LOGIC & SERVICE LAYER                         │
│ Auth • Products • Inventory • Sales • Purchases • Returns • Payments • Invoices│
│        Audit Logger • ESC/POS Thermal Engine • PDF Vector Generator         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma Interactive Transactions
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERSISTENCE & STORAGE LAYER                         │
│       PostgreSQL 16+ (Relational Integrity) • Redis 7 (Cache & Sessions)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles
1. **Frontend → Backend → Database → ORM Data Flow**:
   * Next.js renders the UI and communicates strictly via REST API endpoints (`/api/v1/*`).
   * NestJS implements domain logic and enforces RBAC authorization guards.
   * Prisma ORM executes parameterized queries against PostgreSQL.
2. **Transactional Integrity**: Multi-table state changes (e.g. Sales checkout, Purchase receiving, Stock adjustments) execute within `prisma.$transaction` interactive transactions.
3. **Non-Destructive Inventory Ledger**: All stock quantity changes are recorded as immutable rows in `stock_movements`.
4. **Desktop-First Phase 1 Focus**: Desktop browser counter optimization (`1366×768` priority) with zero viewport scrolling for POS billing.

---

## 3. Technology Stack Reference

| Layer | Selected Technology | Authoritative Document |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query, shadcn/ui | [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) |
| **Backend** | NestJS 10, TypeScript, Prisma ORM, class-validator, Swagger | [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) |
| **Database** | PostgreSQL 16+ (with `DECIMAL(12,2)` currency standards) | [.ai/DATABASE.md](../../.ai/DATABASE.md) |
| **Cache/Queues** | Redis 7, BullMQ (for asynchronous tasks) | [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) |
| **Package Manager**| pnpm v11 (Monorepo workspace) | [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) |
| **Containerization**| Docker, Docker Compose | [.ai/TECH_STACK.md](../../.ai/TECH_STACK.md) |

---

## Source Reference
* Authoritative Specification: [.ai/ARCHITECTURE.md](../../.ai/ARCHITECTURE.md)
* Technical Decisions: [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
