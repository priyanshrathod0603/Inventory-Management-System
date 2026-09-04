# Stock Management System (SMS)

> **Production-grade retail Point of Sale (POS) and inventory operations platform.**

SMS is engineered for Indian retail counters, supermarkets, pharmacies, FMCG distributors, and multi-warehouse operations.

---

## 📚 Project Documentation Architecture

* **🤖 AI Project Brain (`.ai/`)**: The authoritative Single Source of Truth for AI governance, requirements, architecture, database design, API contracts, UI rules, and project state.
* **📖 Engineering & Product Docs (`docs/`)**: The human-readable engineering and product documentation layer.

### Documentation Directory Index:
* [Requirements Specification](docs/requirements/product-requirements.md) — Core business goals, workflows, user stories, and acceptance criteria.
* [System Architecture](docs/architecture/system-architecture.md) — Multi-tier design, Next.js frontend, NestJS modular backend, and database layer.
* [Architecture Diagrams](docs/architecture/architecture-diagrams/system-overview.md) — System context and transaction boundary diagrams.
* [API Contracts](docs/api/api-overview.md) — REST API endpoints, DTOs, Swagger documentation, and error codes.
* [Database Architecture](docs/database/database-overview.md) — PostgreSQL schema, 24 entities, data types, constraints, and indexes.
* [Security Architecture](docs/security/security-architecture.md) — Server-authoritative RBAC, session management, and data protection.
* [Design System & UI](docs/design/design-system.md) — CareOps top-navigation, Plus Jakarta Sans typography, refined indigo palette, and POS UX rules.
* [Testing Strategy](docs/testing/testing-strategy.md) — Jest unit testing, Supertest API testing, and Playwright E2E testing.
* [Deployment Guide](docs/deployment/deployment-guide.md) — Docker containerization, environments, and CI/CD quality gates.
* [Infrastructure](docs/infrastructure/infrastructure-overview.md) — Hosting, networking, storage volumes, and backup procedures.
* [Getting Started](docs/user-guides/getting-started.md) — Local developer setup instructions.

---

## 🚀 Quick Start

```bash
# 1. Start database services
docker compose up -d

# 2. Install dependencies & generate Prisma client
pnpm install
pnpm --filter @sms/api prisma:generate

# 3. Start development servers
pnpm run dev:api    # Backend runs on http://localhost:3001/api/v1
pnpm run dev:web    # Frontend runs on http://localhost:3000
```

---

## 🛠 Technology Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, TanStack Query, Lucide Icons, shadcn/ui
* **Backend**: NestJS 10, TypeScript, Prisma ORM v6, class-validator, Swagger OpenAPI
* **Database**: PostgreSQL 16+ (Dockerized) with `DECIMAL(12,2)` currency standards
* **Cache & Queues**: Redis 7, BullMQ
* **Workspace**: pnpm v11 Monorepo (`apps/api`, `apps/web`)
