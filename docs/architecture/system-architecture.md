# System Architecture

## 1. High-Level Architectural Pattern

SMS / Universal Inventory Platform is structured around a decoupled multi-tier architecture with clear separation between presentation, API gateway, domain services, and persistence layers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER (apps/web)                      │
│      Next.js (App Router) • React 19 • TypeScript • Tailwind CSS • Lucide   │
│           TanStack Query • React Hook Form • Zod Client Validation          │
│                 Warm Luxury SaaS UI & Section 40 Form Standards             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / REST / Session Cookie
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY (apps/api)                           │
│       NestJS Controllers • OpenAPI / Swagger • Cookie Session Guard         │
│    Universal Admin Permission Guards • Rate Limiters • Exception Filters    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Dependency Injection
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN LOGIC & SERVICE LAYER                         │
│  Auth • Users • Business Profile • Products • Inventory • Sales • Purchases │
│    Returns • Payments • Invoices • Audit Logger • ESC/POS Thermal Engine    │
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
   * NestJS implements domain logic and verifies universal permissions for authenticated sessions.
   * Prisma ORM executes parameterized queries against PostgreSQL.
2. **Universal Business Platform Topology (DECISION-018)**:
   * Dynamic catalog and inventory modeling serving any vertical (Footwear, Clothing, Grocery, Electronics, etc.) with zero hardcoded industry assumptions.
   * Universal Data Flow: `Active Business (BusinessProfile) → Business Data → Products → Categories → Inventory → POS`.
   * POS dynamic categories are sourced solely from real persisted categories in active inventory.
3. **Single Universal Admin Access Model (DECISION-016)**:
   * All authenticated users operate with full operational capabilities across the platform. Multi-role RBAC is permanently superseded.
4. **Transactional Integrity**: Multi-table state changes (e.g. Sales checkout, Purchase receiving, Stock adjustments) execute within `prisma.$transaction` interactive transactions with zero partial states.
5. **Non-Destructive Inventory Ledger**: All stock quantity changes are recorded as immutable rows in `stock_movements`.
6. **Desktop-First POS Focus**: Desktop browser counter optimization (`1366×768` priority) with zero viewport scrolling for POS billing.

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
