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
* **Title**: Technology Stack Selection for SMS
* **Status**: Accepted
* **Context**: Technology Stack Finalization
* **Decision**: Adopt the following technology stack for the Stock Management System:
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
* **Decision**: Lock the visual identity and interaction design for SMS:
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