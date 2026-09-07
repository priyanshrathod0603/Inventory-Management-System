# Decisions Log

## DECISION-001
* **Title**: Use a dedicated .ai Project Brain
* **Status**: Accepted
* **Context**: Project Brain Initialization
* **Decision**: The project will maintain a dedicated `.ai` directory containing permanent project context, requirements, architecture, rules, state, decisions, tasks, bugs and session information.
* **Reason**: Chat history is temporary and can become too large. Project documentation must serve as the persistent source of truth for AI-assisted development.
* **Impact**: All AI agents and developers must treat `.ai/` as the single authoritative source of truth.

---

## DECISION-002
* **Title**: Separate current inventory quantity from historical stock movement
* **Status**: Accepted
* **Context**: Inventory Architecture Design
* **Decision**: Stock changes must preserve immutable transaction/movement history (`StockMovement`) instead of simply mutating or overwriting product stock records.
* **Reason**: Auditability, reporting, traceability, and reliable inventory management require a full accounting ledger of all stock events.
* **Impact**: Every stock-altering operation (Sale, Purchase, Return, Adjustment, Transfer) must produce an auditable `StockMovement` entry.

---

## DECISION-003
* **Title**: Technology Stack Selection for IMS
* **Status**: Accepted
* **Context**: Technology Stack Finalization
* **Decision**: Adopt the following technology stack for the Inventory Management System:
  * Frontend: Next.js + React + TypeScript with Tailwind CSS, shadcn/ui, Lucide Icons, TanStack Query, React Hook Form, and Zod
  * Backend: NestJS + TypeScript with modular architecture
  * Database: PostgreSQL 16+
  * ORM: Prisma ORM
  * Key Infrastructure: Docker, with conditional use of Redis and BullMQ based on requirements
  * Package Manager: pnpm
* **Reason**: This stack provides a modern, type-safe, full-stack solution with excellent developer experience. Next.js offers hybrid rendering and routing capabilities for the frontend, while NestJS provides a structured, modular backend framework. PostgreSQL ensures reliable, transactional data storage, and Prisma offers type-safe database access. The stack aligns with the architectural principle of Frontend → Backend → Database → ORM flow, ensuring clear separation of concerns. Docker enables consistent deployment environments, and pnpm provides efficient package management.
* **Impact**: Stack is frozen. All future implementation will strictly adhere to these technologies without introducing unauthorized alternative frameworks.

---

## DECISION-004
* **Title**: Global UI/UX Design System & Visual Identity Freeze
* **Status**: Accepted
* **Context**: UI/UX Specification Finalization
* **Decision**: Lock the visual identity and interaction design for IMS:
  * Visual Architecture: CareOps-inspired operations dashboard structure with top navigation (no sidebars).
  * Typography: `Plus Jakarta Sans` (UI/Forms/Headings) + `IBM Plex Mono` (Technical Identifiers: SKU, Barcodes, Invoice #) + OpenType `tabular-nums` for all numeric/financial values.
  * Color Palette: Solid white surfaces on cool neutral canvas (`#F8FAFC`), Refined Indigo primary brand (`#4F46E5`), and strict semantic tokens (Emerald for success/in-stock, Amber for low-stock/warning, Rose for danger/out-of-stock, Blue for info/UPI).
  * Liquid Glass: Restrained secondary enhancement reserved exclusively for floating overlays (Command Palette `⌘K`, notification drawers, dropdowns, date pickers, modal dialogs).
  * Desktop-First Phase 1: Optimized strictly for desktop resolutions (`1366×768` priority counter billing and `1440×900` office workstations). Zero mobile layouts in Phase 1.
* **Reason**: Establishes a cohesive, high-performance, distraction-free operations UI tailored for fast counter billing and scannable inventory management.
* **Impact**: Visual tokens, fonts, colors, and layout structures are globally locked across all screens and components.

---

## DECISION-005
* **Title**: Legal Invoice Protection & Zero Silent Deletion
* **Status**: Accepted
* **Context**: Financial Integrity & Compliance
* **Decision**: Prohibit generic `Delete Invoice` actions across all modules. Invoice rectifications must occur strictly via auditable **Void / Cancel** workflows (requiring mandatory reason, manager authorization, and restock compensation) or **Sales Returns (Credit Notes)**.
* **Reason**: Invoices are legal accounting records. Deleting them violates tax compliance, auditability, and ledger integrity.
* **Impact**: Invoices maintain permanent records marked with status flags (`COMPLETED`, `CANCELLED`, `RETURNED`) and linked audit trails.

---

## DECISION-006
* **Title**: Frontend / Backend Layer Boundaries & Zero Mock Business Data
* **Status**: Accepted
* **Context**: Engineering Standards Definition
* **Decision**:
  1. Backend-only tasks must not modify frontend code; Frontend-only tasks must not modify backend code.
  2. The application must never render fake business data (mock products, fake sales, simulated API success) in place of real functionality. Authentic loading skeletons, empty states, and error retry patterns must be rendered instead.
* **Reason**: Prevents accidental regressions across layer boundaries and ensures software behaves predictably in production environments.
* **Impact**: Clear separation of responsibilities during development and testing.

---

## DECISION-007
* **Title**: Server-Authoritative Authorization & Granular Permissions
* **Status**: Accepted
* **Context**: Security Architecture
* **Decision**: All authorization and permission rules must be enforced strictly on the NestJS backend via endpoint guards (`@RequirePermissions`). Frontend permission checks are strictly for presentation/UX purposes.
* **Reason**: Client-side UI controls can be bypassed; the backend API is the only true security boundary.
* **Impact**: Every sensitive endpoint independently verifies active user permissions against the database/session cache.

---

## DECISION-008
* **Title**: Environment & Secrets Protection Policy
* **Status**: Accepted
* **Context**: Security & Source Control Integrity
* **Decision**: Never commit `.env`, `.env.*`, `.env.example`, private keys, certificates, or database dumps to version control.
* **Reason**: Prevents secret leaks, credential harvesting, and accidental exposure of infrastructure credentials.
* **Impact**: Strict `.gitignore` enforcement and runtime environment variable injection.

---

## DECISION-009
* **Title**: Interactive Database Transactions for Multi-Table State Mutations
* **Status**: Accepted
* **Context**: Transactional Integrity
* **Decision**: POS sales checkout, purchase receiving, stock adjustments, returns, and payment settlements must execute within atomic Prisma interactive transactions (`prisma.$transaction`).
* **Reason**: Prevents orphaned records, inconsistent inventory states, and partial financial bookings during network or hardware disruptions.
* **Impact**: Atomic rollback on any validation or execution failure.

---

## DECISION-010
* **Title**: Master Project Brain Finalization & Specification Freeze
* **Status**: Accepted
* **Context**: Master Project Brain Audit
* **Decision**: Freeze all specifications across the `.ai/` Project Brain (Requirements, Architecture, Database Schema, REST APIs, UI Rules, Security Standards, Coding Rules, and Testing Strategy). The project is formally declared implementation-ready.
* **Reason**: Clear, complete, ambiguity-free specifications prevent costly architectural rework and maintain development velocity during implementation.
* **Impact**: Direct implementation can proceed with zero requirement ambiguity.

---

## DECISION-011
* **Title**: Strict Git Safety and Version Control Governance
* **Status**: Accepted
* **Context**: Version Control Governance & AI Safety Boundaries
* **Decision**: Git operations must remain under explicit human control. The AI must NEVER automatically stage (`git add .`), commit (`git commit`), or push (`git push`) changes. The AI is restricted to read-only Git inspection commands (`git status`, `git branch`, `git log`, `git diff`, etc.) and must stop after validating changes. Staging, committing, or pushing require separate, direct, explicit human instructions. Destructive Git commands (`git reset --hard`, `git clean -fd`, force-push, history rewriting) are strictly prohibited without prior explicit human approval.
* **Reason**: Prevents unintended repository mutations, protects Git history integrity, avoids accidental commit of unvetted artifacts or secrets, and ensures human ownership over release control and repository state.
* **Impact**: Mandatory workflow: `Inspect → Modify → Validate → git status → git diff → Report → STOP`. Zero automatic git mutations by AI.

---

## DECISION-012
* **Title**: Single Common Authentication System (One Primary Login & One Common Signup)
* **Status**: Accepted
* **Context**: Authentication Model Standardization & Clarification
* **Decision**: IMS adopts ONE single common authentication system across the entire application:
  1. **One Primary Login**: All users (regardless of role: Admin, Super Admin, Manager, Cashier, Staff, Accountant, etc.) authenticate through the exact same single login entry point (`/login` and `POST /api/v1/auth/login`). There are NO separate Admin login, Manager login, Staff login, Super Admin login, or role-specific login pages/flows.
  2. **One Common Signup**: A single common registration flow (`/register` and `POST /api/v1/auth/register`). There are NO role-specific signup portals.
  3. **Supported / Planned Auth Methods**: Email + Password and Google Authentication (Google OAuth / Sign-In), with Email Verification planned as an integral part of the core authentication lifecycle.
  4. **Strict Decoupling of Authentication vs. Authorization**: Authentication answers *"Who is this user?"* (universal, role-agnostic). Authorization answers *"What is this user permitted to do?"* (handled downstream via RBAC, role assignments, and granular backend permission guards).
* **Reason**: Eliminates redundant login workflows, reduces attack surfaces, simplifies credential lifecycle management, provides a seamless modern user experience, and strictly adheres to standard software engineering principles separating identity from authorization.
* **Impact**: All documentation, architecture diagrams, API contracts, and future Phase 6 implementation contracts adhere strictly to this single common entry point. Roles exist purely as authorization constructs, not authentication portals. Phase 6 implementation is deferred to its designated phase.

---

## DECISION-013
* **Title**: Profile Avatar Removal from Application Header
* **Status**: Accepted
* **Context**: User Interface Design and User Menu Representation
* **Decision**: Profile avatars (whether user photos, initials circles, Google avatar URLs, generated avatars, or image placeholders) must NOT exist in the authenticated application header or top navigation bar. The user menu trigger area consists exclusively of:
  1. User Full Name (`text-xs font-semibold text-slate-800`)
  2. Role Badge (`px-1.5 py-0.5 text-[10px] font-semibold rounded border uppercase`)
  3. Dropdown Chevron (`ChevronDown`)
  All dropdown menu actions (Profile & Account, Store Settings, Sign Out) remain fully accessible and functional.
* **Reason**: User explicitly required the removal of the profile avatar from the application header to ensure a clean, modern, distraction-free desktop SaaS layout, eliminating broken avatar image loads and redundant circular icons.
* **Impact**: Overrides the earlier specification in `UI_RULES.md` that suggested a 36×36px avatar in the top navigation. The header user area is clean, text-and-badge-only, with zero profile avatar elements. Future AI agents and developers must NOT reintroduce an avatar to the application header.

---

## DECISION-014
* **Title**: Google OAuth 2.0 Authorization-Code Flow & google-auth-library Cryptographic Verification
* **Status**: Accepted
* **Context**: Production Google OAuth Implementation
* **Decision**: 
  1. Google authentication implements the real OAuth 2.0 authorization-code redirect flow (`GET /api/v1/auth/google` → Google Consent → `GET /api/v1/auth/google/callback`).
  2. CSRF protection during OAuth uses a cryptographically random `state` parameter bound in a 10-minute HttpOnly, SameSite=Lax cookie (`google_oauth_state`) cleared immediately on validation.
  3. Token exchange and ID token verification are performed exclusively via official `google-auth-library` (`OAuth2Client`), cryptographically checking signatures, audiences, issuers, expirations, and verified emails.
  4. Google user provisioning handles: (a) existing Google users, (b) automatic account linking for matching verified emails, and (c) new user creation with collision-safe unique usernames and default roles.
  5. The standard high-entropy `sms_session` HttpOnly cookie is issued upon successful callback.
* **Reason**: Replaces insecure or mock token flows with production-grade, cryptographically verified Google OpenID Connect authentication.
* **Impact**: Zero mock tokens, real server-side authorization flow, robust CSRF defense, and full standard session integration.

---

## DECISION-015
* **Title**: Dedicated Gmail SMTP for Transactional Authentication Emails
* **Status**: Accepted
* **Context**: Email Delivery Architecture for Auth Workflows
* **Decision**:
  1. All transactional authentication emails (email verification OTP/link and password reset links) are routed through Gmail SMTP (`smtp.gmail.com:587` with STARTTLS) using dedicated Google App Passwords (`SMTP_USER`, `SMTP_PASS`).
  2. Third-party vendor transports (such as Resend) are removed from active authentication flows.
  3. Password reset tokens are strictly delivered via email links and must never be exposed or logged in plain-text server logs.
  4. Email dispatch failures degrade gracefully without revealing account existence or crashing requests.
* **Reason**: User requirement to use dedicated Gmail SMTP instead of third-party SaaS email APIs, and security best practice to prevent credential leakage in logs.
* **Impact**: Eliminates Resend dependency for auth, standardizes Nodemailer on Gmail SMTP, and secures password reset tokens end-to-end.