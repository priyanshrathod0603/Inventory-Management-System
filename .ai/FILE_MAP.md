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
│   │   ├── schema.prisma         # Prisma schema matching .ai/DATABASE.md
│   │   └── migrations/
│   │       ├── migration_lock.toml
│   │       ├── 20260904000000_init/
│   │       │   └── migration.sql # Deterministic baseline migration
│   │       └── 20260905000000_auth_phase6/
│   │           └── migration.sql # Additive Phase 6 auth tokens & OAuth migration
│   ├── src/
│   │   ├── main.ts               # NestJS bootstrap (/api/v1, cookie-parser, Swagger, Pipes, Interceptors, Filters)
│   │   ├── app.module.ts         # Root application module with Auth, Roles, Users, Prisma, Health
│   │   ├── prisma/               # PrismaService & PrismaModule
│   │   ├── health/               # Health check endpoints (/api/v1/health, /api/v1/health/ready)
│   │   │   ├── health.controller.ts
│   │   │   ├── health.controller.spec.ts
│   │   │   └── health.module.ts
│   │   ├── common/               # Common backend infrastructure
│   │   │   ├── index.ts          # Barrel export
│   │   │   ├── interfaces/       # ApiResponse, ApiErrorResponse, PaginationMeta
│   │   │   ├── dto/              # PaginationQueryDto
│   │   │   ├── middleware/       # RequestIdMiddleware & unit tests
│   │   │   ├── interceptors/     # TransformResponseInterceptor, LoggingInterceptor & tests
│   │   │   ├── filters/          # GlobalExceptionFilter & tests
│   │   │   ├── decorators/       # @CurrentUser, @Permissions, @Public
│   │   │   └── guards/           # SessionAuthGuard, PermissionsGuard & unit tests
│   │   └── modules/              # Core business & platform modules
│   │       ├── auth/             # Authentication & session security module
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.controller.spec.ts
│   │       │   ├── auth.module.ts
│   │       │   ├── security.spec.ts
│   │       │   ├── dto/          # Login, Register, Google, Verify, Reset DTOs
│   │       │   └── services/     # PasswordService, SessionService, EmailVerificationService, GoogleOAuthService, AuthService
│   │       ├── roles/            # Roles & permissions module
│   │       │   ├── roles.service.ts
│   │       │   └── roles.module.ts
│   │       └── users/            # User profile & IDOR protected management module
│   │           ├── users.controller.ts
│   │           ├── users.service.ts
│   │           ├── users.service.spec.ts
│   │           └── users.module.ts
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
        │   ├── utils.ts          # cn() class merge utility
        │   ├── api-client.ts     # Typed API client with credentials inclusion
        │   └── auth/
        │       └── auth-context.tsx # React AuthContext provider & hooks
        └── app/
            ├── globals.css       # Base CSS, tabular-nums, liquid glass
            ├── layout.tsx        # Root HTML layout with providers
            ├── page.tsx          # Foundation landing page
            ├── providers.tsx     # TanStack Query & AuthContext Provider
            └── (auth)/           # Single Common Authentication route group
                ├── layout.tsx    # Auth centered layout
                ├── login/
                │   └── page.tsx  # Single common login screen
                ├── register/
                │   └── page.tsx  # Single common registration screen
                ├── verify-email/
                │   └── page.tsx  # Link & 6-digit OTP verification screen
                └── forgot-password/
                    └── page.tsx  # Password reset request screen

packages/
│
├── config/                       # Shared configuration & tooling boundary
├── types/                        # Shared TypeScript types boundary
└── validation/                   # Shared validation schemas boundary

scripts/                          # Root automation scripts boundary

docs/                             # Human-readable engineering & product documentation layer
├── requirements/
├── architecture/
├── api/
├── database/
├── security/
├── design/
├── testing/
├── deployment/
├── infrastructure/
└── user-guides/

Root Configuration Files:
├── .gitattributes                # Repository line-ending & binary file normalization
├── .gitignore                    # Secrets & artifact protection
├── package.json                  # Root monorepo workspace configuration
├── pnpm-workspace.yaml           # pnpm workspace declaration (apps/*, packages/*)
└── README.md                     # Repository entry point