# Inventory Management System

> **Production-grade retail Point of Sale (POS) and inventory operations platform.**

Inventory Management System is engineered for Indian retail counters, supermarkets, pharmacies, FMCG distributors, and multi-warehouse operations.

---

## 📌 Development Status

* **Current Phase**: **PHASE 2 — Root Project Structure**
* **Status**: Architectural root boundaries established; application implementation pending future phases.
* **Source of Truth**: The [`.ai/`](.ai/) directory is the authoritative, frozen Single Source of Truth for all requirements, architecture, database design, API contracts, UI rules, and project governance.

> [!NOTE]
> **Planned Architecture ≠ Implemented Functionality.**
> Phase 2 establishes the physical project organization and monorepo boundaries only. Application modules, Docker orchestration, database migrations, authentication, POS, and REST APIs will be implemented during their respective upcoming phases.

---

## 📁 Workspace Architecture

The repository is organized as a `pnpm` monorepo:

```text
IMS/
├── .ai/                    # Authoritative Project Brain (Single Source of Truth)
├── apps/
│   ├── web/                # Future Next.js 15 frontend application boundary
│   └── api/                # Future NestJS 10 backend application boundary
├── packages/
│   ├── config/             # Future shared configuration & tooling
│   ├── types/              # Future shared TypeScript interfaces
│   └── validation/         # Future shared Zod validation schemas
├── scripts/                # Future development & maintenance automation
├── docs/                   # Human-readable engineering & product documentation
├── .gitattributes          # Line ending and repository normalization
├── .gitignore              # Repository secrets & artifact protection
├── package.json            # Root workspace configuration
├── pnpm-workspace.yaml     # pnpm workspace definition
└── README.md               # Repository entry point
```

---

## 🛠 Technology Direction

* **Frontend Framework**: Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query, shadcn/ui, Lucide Icons
* **Backend Framework**: NestJS, TypeScript, modular domain services
* **Database & ORM**: PostgreSQL 16+, Prisma ORM
* **Cache & Background Tasks**: Redis, BullMQ (where required)
* **Infrastructure**: Docker, Docker Compose
* **Package Manager**: pnpm

---

## 📚 Documentation Index

Human-readable engineering and product documentation can be explored in the [`docs/`](docs/) directory:
* [Requirements Specification](docs/requirements/product-requirements.md)
* [System Architecture](docs/architecture/system-architecture.md)
* [API Contracts](docs/api/api-overview.md)
* [Database Architecture](docs/database/database-overview.md)
* [Security Architecture](docs/security/security-architecture.md)
* [Design System & UI Guidelines](docs/design/design-system.md)
* [Testing Strategy](docs/testing/testing-strategy.md)
* [Deployment Guide](docs/deployment/deployment-guide.md)
* [Infrastructure Overview](docs/infrastructure/infrastructure-overview.md)
* [Getting Started](docs/user-guides/getting-started.md)

