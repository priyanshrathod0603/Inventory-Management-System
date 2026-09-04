# Changelog

## Project Brain Initialization
Created the initial documentation architecture for Stock Management System (SMS).
Included:
- project context
- product requirements
- architecture planning
- technical stack placeholder
- coding rules
- AI rules
- security rules
- database planning
- API planning
- UI rules
- decision log
- current state
- task tracking
- bug tracking
- session state
- file map

## Upgrade Project Brain with Production-Grade Rules
Updated SECURITY_RULES.md with production-grade security enhancements.
Updated CODING_RULES.md with production-grade coding enhancements.
Appended CURRENT_STATE.md with a new state entry.

## Finalize Technology Stack Decisions and Docker Documentation
Finalized the technology stack for SMS: Next.js + React + TypeScript (frontend), NestJS + TypeScript (backend), PostgreSQL (database), Prisma ORM, Docker, and pnpm package manager.
Added architectural principle: Frontend → Backend → Database → ORM flow.
Updated DECISIONS.md with technology stack selection rationale.
Updated TECH_STACK.md with approved stack details and architectural principles.
Updated CURRENT_STATE.md to reflect finalized stack and Docker inspection results.
Updated SESSION_STATE.md to document the session work.

## Master Project Brain Finalization & Specification Freeze
Completed a senior-level audit, gap analysis, strengthening, and complete freeze of the entire `.ai/` Project Brain:
- **Product Requirements**: Upgraded `PRODUCT_REQUIREMENTS.md` into an implementation-ready requirement specification covering all 18 core modules, atomic transaction boundaries, gap closures (credit limits, negative stock policy, decimal quantities, GST slabs), and clear Phase 1 vs Phase 2 scope boundaries.
- **Database Design**: Upgraded `DATABASE.md` into a complete PostgreSQL relational database specification with exact data types, decimal precision standards, foreign keys, unique constraints, and performance indexes.
- **API Contracts**: Upgraded `API_CONTRACTS.md` into an exhaustive REST API specification with endpoints, permissions, request/response DTOs, and HTTP status codes across all business domains.
- **System Architecture**: Upgraded `ARCHITECTURE.md` into a modular, production-grade system architecture covering Next.js frontend, NestJS modular backend, Prisma interactive transactions, background queues, PDF/receipt generation, and automated backup/restore strategies.
- **UI/UX Design System**: Solidified and locked `UI_RULES.md` with CareOps top-navigation structure, Plus Jakarta Sans + IBM Plex Mono typography, refined indigo palette, subtle liquid glass overlays, and desktop-first POS specifications.
- **Security & Engineering**: Strengthened `SECURITY_RULES.md`, `CODING_RULES.md`, `AI_RULES.md`, and `DECISIONS.md` (adding DECISION-004 through DECISION-010).
- **State & Verification**: Updated `CURRENT_STATE.md`, `TASKS.md`, `SESSION_STATE.md`, and `FILE_MAP.md` while fully preserving all historical entries.

## Phase 1 Repository Initialization Milestone
Initialized the clean monorepo workspace and technical foundations:
- **Monorepo Foundation**: Configured pnpm workspace (`pnpm-workspace.yaml`), root `package.json`, `.gitignore`, `.dockerignore`, `.env.example`, and `docker-compose.yml` (PostgreSQL 16 + Redis).
- **Backend Foundation (`apps/api`)**: Configured NestJS 10 application with TypeScript, global `/api/v1` prefix, Swagger OpenAPI documentation (`/api/docs`), Health check controller (`/api/v1/health`), and generated Prisma 6 Client matching `DATABASE.md`.
- **Frontend Foundation (`apps/web`)**: Configured Next.js 15 (App Router) application with React 19, Tailwind CSS locking UI design tokens (`Plus Jakarta Sans`, `IBM Plex Mono`, refined indigo palette), and TanStack Query provider.
- **Quality Gates**: Verified all builds (`nest build`, `next build`), typechecks (`tsc --noEmit`), and backend unit tests (`jest`).

## Phase 1A Documentation System Initialization Milestone
Established the comprehensive human-readable engineering and product documentation layer in `docs/`:
- **Requirements**: `docs/requirements/` (product requirements, feature specs, user stories, user flows with Mermaid diagrams, acceptance criteria).
- **Architecture**: `docs/architecture/` (system, frontend, backend, database, infrastructure architecture, architecture diagrams).
- **API**: `docs/api/` (overview, authentication API, endpoint catalog, error handling, JSON payload examples).
- **Database**: `docs/database/` (overview, schema reference, table specs, relationships, performance indexes, migration guide).
- **Security**: `docs/security/` (security architecture, authentication, RBAC authorization, data protection, threat model).
- **Design**: `docs/design/` (design system tokens, UI guidelines, UX guidelines, component specs, POS billing UI flow).
- **Testing**: `docs/testing/` (strategy, test plan, unit testing, integration testing, E2E testing).
- **Deployment**: `docs/deployment/` (deployment guide, environments, environment variables reference, CI/CD pipeline, rollback strategy, release process).
- **Infrastructure**: `docs/infrastructure/` (overview, hosting, networking, storage volumes, monitoring, backup/recovery).
- **User Guides**: `docs/user-guides/` (getting started guide, user guide, admin guide, troubleshooting guide).
- **Root README**: Created `README.md` introducing the system with index links to all documentation sections.

## Git Safety & Version Control Governance Integration
Integrated strict Git safety rules and version control constitution into the `.ai/` Project Brain:
- **AI Rules**: Updated `AI_RULES.md` with explicit forbidden automatic commands (`git add .`, `git commit`, `git push`, `git reset --hard`, `git clean`), allowed read-only inspection commands, explicit commit/push authorization protocols, and the default workflow (`Inspect → Modify → Validate → git status → git diff → Report → STOP`).
- **Coding Rules**: Updated `CODING_RULES.md` workflow sequence, pre/post checklists, and absolute prohibitions.
- **Security Rules**: Updated `SECURITY_RULES.md` Section 6 with Git safety and release control policies.
- **Decision Log**: Appended `DECISION-011` in `DECISIONS.md`.
- **State Preservation**: Updated `CURRENT_STATE.md` and `SESSION_STATE.md`.

## Phase 2 Root Project Structure Milestone
Established the clean, scalable, production-grade root project structure and monorepo boundaries:
- **Root Directory Organization**: Established `apps/` (`web`, `api`), `packages/` (`config`, `types`, `validation`), `scripts/`, `docs/`, and `.ai/`.
- **Workspace Configuration**: Updated `pnpm-workspace.yaml` to include `packages/*` and `apps/*`.
- **Repository Normalization**: Created minimal `.gitattributes` for LF line endings and binary asset handling.
- **Security & Secret Protection**: Updated `.gitignore` to strictly ignore all environment files (`.env`, `.env.*`, `.env.example`).
- **README Entry Point**: Updated root `README.md` to state Phase 2 development status, technology direction, and workspace layout while explicitly clarifying that planned architecture is distinct from implemented functionality.
- **Scope Discipline**: Verified zero implementation of future phase logic (Docker, Prisma migrations, NestJS business modules, Next.js UI screens, auth, fake data).

## Phase 3 Docker + Local Development Milestone
Established and verified local development infrastructure in Docker Compose:
- **Docker Compose Configuration**: Configured `docker-compose.yml` with `postgres:16-alpine` and `redis:7-alpine`.
- **Networking**: Established explicit named bridge network `sms-network` for reliable inter-container service discovery.
- **Persistent Storage**: Configured named volumes `postgres_data` and `redis_data` to ensure data durability across container lifecycles.
- **Health Checks**: Configured connection-level health checks for PostgreSQL (`pg_isready -U postgres -d sms_db`) and Redis (`redis-cli ping`).
- **Docker Ignore**: Updated `.dockerignore` to exclude environment files, build artifacts, caches, and logs.
- **Scope Verification**: Verified that no Phase 4+ tasks (Prisma migrations, database seeds, business modules, auth, UI screens, fake data) were implemented.

## Phase 4 Database + Prisma Milestone
Established and verified PostgreSQL + Prisma ORM database foundation:
- **Prisma Schema Verification**: Validated `apps/api/prisma/schema.prisma` against `.ai/DATABASE.md` and `docs/database/` across all 24 relational tables, financial decimal standards (`DECIMAL(12,2)` amounts, `DECIMAL(10,3)` stock, `DECIMAL(5,2)` tax rates), relationships, constraints, and indexes.
- **Prisma Client**: Generated complete, type-safe Prisma 6 Client (`@prisma/client` v6.19.3).
- **Migration History**: Generated initial baseline migration (`apps/api/prisma/migrations/20260904000000_init/migration.sql`) and `migration_lock.toml`.
- **PrismaService & Module**: Verified `PrismaService` lifecycle and `PrismaModule` integration within NestJS API foundation.
- **Quality Gates**: Verified clean NestJS build (`nest build`), TypeScript typechecks (`tsc --noEmit`), and backend unit tests (`jest`).
- **Scope Verification**: Verified zero implementation of business modules, controllers, DTOs, authentication, UI screens, or fake business data.

## Phase 5 Backend / NestJS Milestone
Established and verified common NestJS backend architectural foundation:
- **Common Module (`apps/api/src/common/`)**:
  - `interfaces/api-response.interface.ts`: Standard API success and error envelopes (`ApiResponse<T>`, `ApiErrorResponse`, `PaginationMeta`).
  - `dto/pagination-query.dto.ts`: `PaginationQueryDto` with class-validator rules and Swagger OpenAPI metadata.
  - `middleware/request-id.middleware.ts`: Global middleware extracting incoming `x-request-id` or generating cryptographic UUID v4.
  - `interceptors/transform-response.interceptor.ts`: Global interceptor wrapping responses into standard `{ success: true, data: ..., meta: ..., message: ... }` envelope.
  - `interceptors/logging.interceptor.ts`: Execution duration, method, path, IP logging with strict sensitive parameter redaction.
  - `filters/global-exception.filter.ts`: Central exception filter formatting HTTP and Prisma exceptions (`P2002`, `P2025`, `P2003`) into standard `{ success: false, error: ... }` while preventing internal leakage.
  - `decorators/`: `@CurrentUser()`, `@Permissions()`, and `@Public()` decorators for RBAC readiness.
- **Health & Readiness (`apps/api/src/health/`)**:
  - Added database connectivity probe `GET /api/v1/health/ready` verifying active PostgreSQL connection via `SELECT 1`.
  - Maintained liveness check `GET /api/v1/health`.
- **Global Configuration**:
  - `apps/api/src/main.ts`: Configured global prefix `/api/v1`, `ValidationPipe` (whitelist + transform), global filter, interceptors, and Prisma shutdown hooks.
  - `apps/api/src/app.module.ts`: Configured `RequestIdMiddleware` for all routes.
- **Testing & Quality Gates**:
  - Created unit tests for `RequestIdMiddleware`, `TransformResponseInterceptor`, `GlobalExceptionFilter`, and `HealthController` (4 suites, 13 tests passing).
  - Validated clean `nest build` and `tsc --noEmit` across monorepo workspaces.
- **Scope Verification**: Verified zero implementation of Phase 6+ business features (auth controllers, password hashing, sessions, business domain services, UI screens).

## Single Common Authentication System Standardization
Synchronized the project authentication architecture to standard single common authentication:
- **Unified Identity & Access**: Explicitly formalized that SMS uses ONE single common login entry point (`/login`, `POST /api/v1/auth/login`) and ONE single common registration flow (`/register`, `POST /api/v1/auth/register`).
- **Elimination of Role-Specific Login Portals**: Confirmed there are NO separate Admin, Manager, Staff, Cashier, or role-specific login portals/pages. All users authenticate through the same entry point.
- **Planned Authentication Methods**: Documented planned Email + Password, Google Authentication (Google OAuth 2.0 / Sign-In), and Email Verification.
- **Decoupled Authorization**: Clarified separation between identity authentication (*"Who is this user?"*) and downstream RBAC authorization (*"What is this user permitted to do?"*).
- **Decision Log**: Added `DECISION-012` to `DECISIONS.md`.
- **Documentation & Specifications Updated**: Aligned `PRODUCT_REQUIREMENTS.md`, `ARCHITECTURE.md`, `API_CONTRACTS.md`, `SECURITY_RULES.md`, `DATABASE.md`, `UI_RULES.md`, and `docs/`.
- **Phase Boundary Verification**: Confirmed Phase 6 implementation has NOT been started. Zero auth logic, OAuth, Argon2, session tokens, or RBAC guards implemented in this task.

## Phase 6 Authentication, Session Security, Email Verification, Google Auth & RBAC Milestone
Completed full implementation and verification of Phase 6:
- **Additive Database Migrations**:
  - Made `passwordHash` nullable on `User` for OAuth users; added `googleId`, `isEmailVerified`, `emailVerifiedAt`, `avatarUrl`.
  - Added `EmailVerificationToken` and `PasswordResetToken` tables with token expiration, relations, and usage tracking.
  - Generated deterministic additive migration `20260905000000_auth_phase6/migration.sql` and regenerated `@prisma/client` v6.19.3.
- **Backend Authentication Foundation (`apps/api/src/modules/auth/`)**:
  - `PasswordService`: Argon2id hashing and constant-time verification.
  - `SessionService`: High-entropy 64-byte tokens, 8-hour session / 30-day Remember Me expiry, DB persistence, IP/User-Agent tracking, `sms_session` HttpOnly cookie management.
  - `EmailVerificationService`: Dual-mode verification (secure link token + 6-digit OTP code with 15-minute expiry), rate limiting, and atomic user status activation.
  - `GoogleOAuthService`: Google ID token / tokeninfo verification with audience/client ID verification.
  - `AuthService`: Unified business logic coordinating registration, email verification (link & OTP), password login, Google OAuth, password reset, logout, session revocation, and current user retrieval.
  - `AuthController`: Full REST endpoints under `/api/v1/auth/*` adhering to standard API envelopes and Swagger OpenAPI documentation.
- **Backend Authorization & Security Infrastructure**:
  - `SessionAuthGuard`: Global session verification guard extracting `sms_session` cookie/token, validating active session in DB, verifying user active/non-deleted status, attaching `req.user` (with roles and permissions) and `req.sessionId`, respecting `@Public()`.
  - `PermissionsGuard`: Enforces `@Permissions(...codes)` against authenticated user permissions, granting unconditional bypass to Admin role.
  - Configured `cookieParser()` in `apps/api/src/main.ts`.
- **Roles & Users Management (`apps/api/src/modules/`)**:
  - `RolesService` & `RolesModule`: System roles seeding (`Admin`, `Manager`, `Cashier`, `Staff`) and granular permissions matrix.
  - `UsersService`, `UsersController`, `UsersModule`: User profile retrieval with strict IDOR verification (`requestingUser.id === targetUserId` or `manage_users` permission required).
- **Security & Unit Test Suites**:
  - Comprehensive unit tests across all auth services, guards, and controllers, plus dedicated `security.spec.ts` testing 401 unauthenticated rejection, expired session rejection, deactivated account rejection, IDOR cross-user URL tampering rejection, and client-side permission spoofing rejection.
  - 14 test suites and 61 tests passing.
- **Frontend Authentication Foundation (`apps/web/`)**:
  - `lib/api-client.ts`: Typed API client with `credentials: 'include'` for cookie propagation.
  - `lib/auth/auth-context.tsx`: Full React Context provider managing user state, login, register, Google OAuth, and logout.
  - Created complete auth pages: `/login`, `/register`, `/verify-email`, and `/forgot-password` adhering to CareOps design tokens and UI rules.
  - Verified Next.js build (`next build` generates all static routes with 0 errors).

## Phase 6 Security Fix — Bearer Session Authentication Removed
Enforced strict HttpOnly session cookie transport across all protected routes:
- **SessionAuthGuard Hardening**: Removed `Authorization: Bearer <token>` fallback extraction. The guard strictly extracts session IDs from `request.cookies.sms_session`.
- **Swagger Documentation**: Aligned `@ApiCookieAuth('sms_session')` on protected controllers (`UsersController`).
- **Automated Security Verification**: Added tests in `session-auth.guard.spec.ts` and `security.spec.ts` proving that valid database session tokens presented via `Authorization: Bearer` without cookies are strictly rejected with `401 Unauthorized` without database lookups.