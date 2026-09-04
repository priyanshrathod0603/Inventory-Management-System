# File Map
.ai/
│
├── PROJECT_CONTEXT.md
│   Master project identity, core business philosophy, and permanent context.
│
├── PRODUCT_REQUIREMENTS.md
│   Frozen, implementation-ready product features, workflows, validations, and edge cases.
│
├── ARCHITECTURE.md
│   Production-grade modular system architecture, transaction boundaries, and data flow.
│
├── TECH_STACK.md
│   Frozen technology decisions (Next.js, NestJS, PostgreSQL, Prisma, Docker, pnpm).
│
├── CODING_RULES.md
│   Engineering standards, layer boundaries, test coverage matrix, and pre/post checklists.
│
├── AI_RULES.md
│   Permanent constitution governing AI development discipline and change control.
│
├── SECURITY_RULES.md
│   Production-grade security, RBAC enforcement, session management, and secret protection.
│
├── DATABASE.md
│   Complete PostgreSQL relational schema specification, data types, constraints, and indexes.
│
├── API_CONTRACTS.md
│   Exhaustive REST API endpoint contracts, permissions, request/response DTOs, and status codes.
│
├── UI_RULES.md
│   Locked UI/UX design system, CareOps top-navigation, typography, palette, and POS counter billing rules.
│
├── DECISIONS.md
│   Permanent architectural and product decision log (DECISION-001 through DECISION-010).
│
├── CURRENT_STATE.md
│   Current project status and append-only state history entries.
│
├── TASKS.md
│   Current task board cleanly separating completed specifications from pending implementation.
│
├── BUGS.md
│   Known bugs and investigation logs (clean pre-implementation baseline).
│
├── CHANGELOG.md
│   Permanent chronological project and documentation change history.
│
├── SESSION_STATE.md
│   Active AI session state, completed milestones, and immediate next steps.
│
└── FILE_MAP.md
    Master repository documentation and file map.

apps/
│
├── api/
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema matching .ai/DATABASE.md
│   ├── src/
│   │   ├── main.ts               # NestJS bootstrap (/api/v1, Swagger, Validation)
│   │   ├── app.module.ts         # Root application module
│   │   ├── prisma/               # PrismaService & PrismaModule
│   │   └── health/               # Health check endpoint (/api/v1/health)
│   └── test/
│       ├── app.e2e-spec.ts
│       └── jest-e2e.json
│
└── web/
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts        # Locked UI design system tokens
    ├── tsconfig.json
    └── src/
        ├── lib/
        │   └── utils.ts          # cn() class merge utility
        └── app/
            ├── globals.css       # Base CSS, tabular-nums, liquid glass
            ├── layout.tsx        # Root HTML layout with providers
            ├── page.tsx          # Foundation landing page
            └── providers.tsx     # TanStack QueryClientProvider